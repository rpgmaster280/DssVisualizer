# Copyright (C) 2017  Jamie Acosta, Robert McCain
#
# This file is part of DssVisualizer.
# 
# DssVisualizer is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# DssVisualizer is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with DssVisualizer.  If not, see <http://www.gnu.org/licenses/>.

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
from subprocess import Popen, PIPE
import base64
import json
from datetime import datetime
import re
import os

dss_success = """{
    "message": "File upload successful.",
    "success": true,
    "data": []
}"""
class UploadFileRequest(IRequest):
    def __init__(self):
        super().__init__("DSS_UPLOAD_FILE")
        
    def getTable(self, event_data):
        first_row = event_data[0]
            
        if "keypress_id" in first_row or "keypresses_id" in first_row:
            return "keypresses"
        elif "clicks_id" in first_row:
            return "clicks"
        elif "timed_id" in first_row:
            return "timed_screenshots"
        elif "traffic_all_id" in first_row:
            return "traffic"
        elif "traffic_xy_id" in first_row:
            return "traffic_throughput"
        elif "manualscreen_id" in first_row:
            return "manual_screenshots"
        elif "snoopy_id" in first_row:
            return "snoopy"
        return None
            
        
    def validateInput(self):
        user_input = self.getUserInput()
        
        if not "db_name" in self.getUserInput():
            return False
        
        event_data = user_input["event_data"]
        event_data = base64.b64decode(event_data)
        is_archive = user_input["is_archive"] == "true"
        
        if is_archive:
            
            # 0) Clean up any old data
            p = Popen(["rm", "-f", "/tmp/ecel_archive.zip"])
            p.communicate()
            p = Popen(["rm", "-rf", "/tmp/extracted_files"])
            p.communicate()
            
            # 1) Save file to disk
            with open("/tmp/ecel_archive.zip", "wb") as f:
                f.write(event_data)
                
            # 2) Test if the file is a valid zip file. If so,
            #    extract the archive to disk.
            p = Popen(["unzip", "-t", "/tmp/ecel_archive.zip"], stdin=PIPE, stdout=PIPE, stderr=PIPE)
            p.communicate()
            rc = p.returncode
            
            if rc != 0:
                return False
            
            p = Popen(["unzip", "/tmp/ecel_archive.zip", "-d", "/tmp/extracted_files"])
            p.communicate()
            rc = p.returncode
            
            if rc != 0:
                return False
            
            # 3) If files were extracted correctly, recursively search for 
            #    JSON files we can process. Save targets to a list.
            self.resources = []
            for root, subdirs, files in os.walk("/tmp/extracted_files"):
                for filename in files:
                    matches = re.match("^[a-zA-Z0-9_]+\.JSON$", filename)
                    if matches != None:
                        #Absolute path of the file
                        file_loc = root + "/" + filename
                        print(file_loc)
                        with open(file_loc, "r") as f:
                            file_json = json.loads(f.read())
                            table = self.getTable(file_json)
                            if table != None:
                                self.resources.append(file_json)
                            else:
                                print("File: " + file_loc + " is not supported")
                                return False
        else:        
            event_data = json.loads(event_data.decode("utf-8"))
            table = self.getTable(event_data)
            if not table:
                return False
            self.event_data = event_data
        
        return True
    
    def insert_json(self, db, tech_name, event_name, data):
        for row in data:
            row["tech_name"] = tech_name
            row["event_name"] = event_name
            row["start"] = datetime.strptime(row["start"], "%Y-%m-%dT%H:%M:%S")
        
        table = self.getTable(data)
        db[table].insert_many(data)
    
    def processRequest(self, server_state_info):
        user_input = self.getUserInput()
        
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        tech_name = user_input["tech_name"]
        event_name = user_input["event_name"]
        is_archive = user_input["is_archive"] == "true"
        
        db = client[db_name]
         
        if tech_name:
            techs = db.analysts.find_one({"name" : tech_name})
            if not techs:
                db.analysts.insert_one({"name" : tech_name})
        else:
            tech_name = "unassigned"
                  
        if event_name:
            events = db.events.find_one({"name" : event_name})
            if not events:
                db.events.insert_one({"name" : event_name})
        else:
            event_name = "unassigned"
                
        if not is_archive:
            self.insert_json(db, tech_name, event_name, self.event_data)
        else:
            for data in self.resources:
                self.insert_json(db, tech_name, event_name, data)
            
        return dss_success
    
    