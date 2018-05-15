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
import json
from datetime import datetime
from bson import json_util

class AddAnnotationRequest(IRequest):
    def __init__(self):
        super().__init__("DSS_ADD_ANNOTATION")
        
    def validateInput(self):
        return True
    
    def processRequest(self, server_state_info):
        user_input = self.getUserInput()
         
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        db = client[db_name]
        table_name = user_input["table_name"]
        
        dss_response = {
            "message": "Annotation added successfully.",
            "success": True,
            "data": []
        }
        
        if table_name in db.collection_names():
            contents = json.loads(user_input["contents"])
            if "start" in contents:
                contents["start"] = datetime.strptime(contents["start"], "%Y-%m-%d %H:%M:%S")
            elif "x" in contents:
                contents["x"] = datetime.strptime(contents["x"], "%Y-%m-%dT%H:%M:%S")
            result = db[table_name].insert_one(contents)
            dss_response["data"] = result.inserted_id
        else:
            dss_response["message"] = "System failed to add annotation."
            dss_response["success"] = False
         
        return json.dumps(dss_response, default=json_util.default)
    
    