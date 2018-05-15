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
import re
import json

class GetAllPluginsRequest(IRequest):
    def __init__(self):
        super().__init__("DSS_GET_PLUGINS")
        
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
    
    