'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
import json
from pymongo.mongo_client import MongoClient

class GetDatabasesRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_LS_DB", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self):
        
        client = MongoClient("localhost", 27017)
        
        response = {
            "message" : "Databases retrieved successfully",
            "success" : True,
            "data" : client.database_names()
        }
        
        return json.dumps(response)