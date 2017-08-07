'''
Created on Aug 4, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
from bson.objectid import ObjectId

dss_success = """{
    "message": "Element deleted successfully.",
    "success": true,
    "data": []
}"""

class RemoveElementRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_REMOVE_ELEMENT", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self, server_state_info):
        user_input = self.getUserInput()
         
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        db = client[db_name]
        table_name = user_input["table_name"]
        
        if table_name in db.collection_names():
            db[table_name].delete_one({"_id" : ObjectId(user_input['id'])})
         
        return dss_success
    
    