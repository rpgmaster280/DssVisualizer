'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient

dss_success = """{
    "message": "Database added successfully.",
    "success": true,
    "data": []
}"""
class GetDataRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_GET_DATA", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self):
        user_input = self.getUserInput()
        
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        db = client[db_name]
        
        for collection in db.collection_names():
            print(collection)
        
        return dss_success