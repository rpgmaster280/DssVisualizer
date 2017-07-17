'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
import base64
import json
from datetime import datetime

dss_success = """{
    "message": "File upload successful.",
    "success": true,
    "data": []
}"""
class UploadFileRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_UPLOAD_FILE", connection)
        
    def getTable(self, event_data):
        first_row = event_data[0]
            
        if "keypresses_id" in first_row:
            return "keypresses"
        elif "clicks_id" in first_row:
            return "clicks"
        elif "timed_id" in first_row:
            return "timed"
        elif "traffic_all_id" in first_row:
            return "traffic"
        elif "traffic_xy_id" in first_row:
            return "traffic_throughput"
        return None
            
        
    def validateInput(self):
        user_input = self.getUserInput()
        
        event_data = user_input["event_data"]
        event_data = base64.b64decode(event_data).decode("utf-8")
        event_data = json.loads(event_data)
        
        table = self.getTable(event_data)
        if not table:
            return False
        
        if not "db_name" in self.getUserInput():
            return False
        
        self.event_data = event_data
        
        return True
    
    def processRequest(self):
        user_input = self.getUserInput()
        
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        tech_name = user_input["tech_name"]
        event_name = user_input["event_name"]
        event_data = self.event_data
        
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
         
        for row in event_data:
            row["tech_name"] = tech_name
            row["event_name"] = event_name
            row["start"] = datetime.strptime(row["start"], "%Y-%m-%dT%H:%M:%S")
        
        table = self.getTable(event_data)
        db[table].insert_many(event_data)
        
        return dss_success