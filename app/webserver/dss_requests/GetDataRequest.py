'''
Created on Jul 10, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
from pymongo.mongo_client import MongoClient
from datetime import datetime
from datetime import timedelta
import json
from bson import json_util

class GetDataRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_GET_DATA", connection)
        
    def to_datetime(self, raw_date):
        date_tokens = raw_date.split("-")
        year = int(date_tokens[0])
        month = int(date_tokens[1])
        day = int(date_tokens[2])
        return datetime(year, month, day)
        
    def validateInput(self):
        return True
    
    def processRequest(self):
        user_input = self.getUserInput()
        
        tech_name = user_input["tech_name"]
        event_name = user_input["event_name"]
        
        if not user_input["start_date"]:
            start_date = self.to_datetime("1900-01-01")
        else:
            start_date = self.to_datetime(user_input["start_date"])

        if not user_input["end_date"]:
            end_date = self.to_datetime("3000-01-01")
        else:
            end_date = self.to_datetime(user_input["end_date"])
            end_date += timedelta(days=1)
        
        query = {
            "tech_name" : tech_name, 
            "event_name" : event_name,
            "$or" : [
                {"start" : {'$lt' : end_date, '$gte' : start_date}},
                {"x" : {'$lt' : end_date, '$gte' : start_date}}
            ]
        }
        
        if not tech_name:
            del query["tech_name"]
            
        if not event_name:
            del query["event_name"]
        
        client = MongoClient("localhost", 27017)
        db_name = user_input["db_name"]
        db = client[db_name]
        
        datasets_to_return = {}
        
        for collection in db.collection_names():
            if not (collection == "events" or collection == "analysts"):
                cursor = db[collection].find(query)
                datasets_to_return[collection] = []
                for document in cursor:
                    # convert from datetime object -> String in YYYY-MM-DD hh:mm:ss format
                    if "start" in document:
                        document["start"] = document["start"].strftime('%Y-%m-%d %H:%M:%S')
                    elif "x" in document:
                        document["x"] = document["x"].strftime('%Y-%m-%d %H:%M:%S')
                    datasets_to_return[collection].append(document)
        
        response = {
            "message" : "Data retrieved successfully.",
            "success" : True,
            "data" : datasets_to_return
        }
        
        return json.dumps(response, default=json_util.default)
        
