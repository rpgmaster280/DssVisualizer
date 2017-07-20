'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
import json

class GetEventsRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_GET_EVENTS", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self, server_state_info):
        user_input = self.getUserInput()
        
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        db = client[db_name]
        results = db.events.find({})
        
        to_return = []
        
        for event in results:
            to_return.append(event)
            
        response = {
            "message" : "Events retrieved successfully",
            "success" : True,
            "data" : to_return
        }
        
        return json.dumps(response)
    
    