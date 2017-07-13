'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient

success = """{
    "message": "Database remove performed successfully.",
    "success": true,
    "data": []
}"""

class DeleteDatabaseRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_RM_DB", connection)
        
    def validateInput(self):
        user_input = self.getUserInput()
        return user_input["db_name"]
    
    def processRequest(self):
        user_input = self.getUserInput()
        client = MongoClient("localhost", 27017)
        database_name = user_input["db_name"]
        
        client.drop_database(database_name)
        
        return success