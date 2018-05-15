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

success = """{
    "message": "Database remove performed successfully.",
    "success": true,
    "data": []
}"""

class DeleteDatabaseRequest(IRequest):
    def __init__(self):
        super().__init__("DSS_RM_DB")
        
    def validateInput(self):
        user_input = self.getUserInput()
        return user_input["db_name"]
    
    def processRequest(self, server_state_info):
        user_input = self.getUserInput()
        client = MongoClient("localhost", 27017)
        database_name = user_input["db_name"]
        
        client.drop_database(database_name)
        
        return success