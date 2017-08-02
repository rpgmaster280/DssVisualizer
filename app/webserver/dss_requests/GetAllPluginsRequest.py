'''
Created on Jun 27, 2017

@author: root
'''

from dss_requests.IRequest import IRequest
import re
import json

class GetAllPluginsRequest(IRequest):
    def __init__(self, connection):
        super().__init__("DSS_GET_PLUGINS", connection)
        
    def validateInput(self):
        return True
    
    def processRequest(self, server_state_info):
        
        plugins = []
        for relative_path in server_state_info["static_content"]:
            
            file_name = server_state_info["static_content"][relative_path]["name"]
            extension = server_state_info["static_content"][relative_path]["extension"]
            matches = re.match("^plugin_[a-zA-Z0-9_]+\.js$", file_name)
            if matches != None and extension == "js":
                start_index = file_name.find("_") + 1
                end_index = file_name.find(".js")
                class_name = file_name[start_index:end_index].title().replace("_", "")
                plugin = {
                    "class_name" : class_name,
                    "path" : relative_path
                }
                plugins.append(plugin)
                 
        response = {
            "message" : "Plugins retrieved successfully",
            "success" : True,
            "data" : plugins
        }
        
        return json.dumps(response)
    
    