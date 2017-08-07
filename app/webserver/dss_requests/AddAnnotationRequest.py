'''
Created on Aug 4, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
import json
from datetime import datetime
from bson import json_util

class AddAnnotationRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_ADD_ANNOTATION", connection)
        
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
    
    