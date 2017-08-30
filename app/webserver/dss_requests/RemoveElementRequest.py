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
    
    