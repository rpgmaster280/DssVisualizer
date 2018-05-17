#!flask/bin/python

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

from flask import Flask
from flask import request as flask_request
from flask import Response
import os
import sys
import importlib

#Ensures working directory is where the webserver script is
os.chdir(sys.path[0])

#Resource cache for faster loading
resource_cache = {}

#Grabs a list of all requests residing the dss_requests package.
def getDssRequests():
    reqs = os.listdir("dss_requests")
        
    to_return = []
    for req in reqs:
        if req == "IRequest.py" or not req.endswith(".py"):
            continue
        to_return.append(req[:-3])
    return to_return

#Imports requests residing in the dss_requests folder and instantiates them.
#Objects are then stored in a map and returned.
def loadDssRequests():
    request_list = getDssRequests()
    request_map = {}

    #Dynamically loads request objects from dss_requests folder
    for request_item in request_list:
        req_mod = importlib.import_module("dss_requests." + request_item)
        target_class = getattr(req_mod, request_item)
        class_instance = target_class()
        request_map[class_instance.getRequestLabel()] = class_instance
    return request_map

request_map = loadDssRequests()
app = Flask(__name__)

#Begin list of error messages
type_not_found = """{ 
    "message": "Type not found",
    "success": false,
    "data": []
}"""
request_not_found = """{ 
    "message": "Request not understood by the system",
    "success": false,
    "data": []
}"""
invalid_parameters = """{ 
    "message": "Parameters for the request are incorrect",
    "success": false,
    "data": []
}"""
#End list of error messages

#Handles database requests from the browser
@app.route('/data_request.php', methods=['POST'])
def data_request_handler():
    
    #First, check to see if type field is set. If not return error.
    if 'type' not in flask_request.form:
        return Response(type_not_found, mimetype="application/json")
     
    if flask_request.form['type'] not in request_map:
        return Response(request_not_found, mimetype="application/json")
     
    req = request_map[flask_request.form['type']]
    req.setUserInput(flask_request.form)
    
    if not req.validateInput():
        return Response(invalid_parameters, mimetype="application/json")
    
    server_info = {
        "static_content": filelist
    }
    return Response(req.processRequest(server_info), mimetype="application/json")

@app.route('/')
def index_request_handler():
    return _get_resource("/index.html")

#Finds html, js, image, and other standard resources needed for the browser
def find_browser_files(startPoint):
    path_len = len(startPoint)
    resource_map = {}
    for root, _ , files in os.walk(startPoint):
        for filename in files:
            #Absolute path of the file
            file_loc = root + "/" + filename
            
            #Relative path of the file
            rule = file_loc[path_len:]
            
            #Create dictionary for file entry and populate fields
            resource_map[rule] = {}
            resource_map[rule]["name"] = filename
            resource_map[rule]["absolute_path"] = file_loc
            resource_map[rule]["relative_path"] = rule
            
            #Tokenize file path in order to determine extension
            file_tokens = file_loc.split(".")
            
            #Get the extension of the file (if present)
            if not file_tokens[-1]:
                resource_map[rule]["extension"] = "None"
            else:
                resource_map[rule]["extension"] = file_tokens[-1]
                
    return resource_map

#Gets standard resources (html, css, js, images, etc) for the browser
def _get_resource(resource_path):
    
    content = ""
    mtype = "text/plain"
    
    if resource_path in filelist:
        
        #Open file and determine MIME type
        if(not (resource_path in resource_cache)):
            
            #Get extension and determine open flags
            extension = filelist[resource_path]["extension"]
            open_flags = 'r'
            if extension == "png" or extension == "jpeg" or extension == "jpg" or extension == "ttf" or \
                    extension == "woff" or extension == "woff2" or extension == "ico" or extension == "eot" or \
                    extension == "gif":
                open_flags = 'rb'
    
            #Open file and cache content
            with open(filelist[resource_path]["absolute_path"], open_flags) as resource:
                content = resource.read()    
                if extension == "html" or extension == "htm" or extension == "php":
                    mtype = "text/html"
                elif extension == "js":
                    mtype = "text/javascript"
                elif extension == "css":
                    mtype = "text/css"
                elif extension == "png":
                    mtype = "image/png"
                elif extension == "jpg" or extension == "jpeg":
                    mtype = "image/jpeg"
                elif extension == "ttf":
                    mtype = "image/ttf"
                elif extension == "woff":
                    mtype = "image/woff"
                elif extension == "woff2":
                    mtype = "image/woff2"
                elif extension == "gif":
                    mtype = "image/gif"
                elif extension == "ico":
                    mtype = "image/x-icon"
                else:
                    mtype = "plain/text"
                resource_cache[resource_path] = {
                    "mimetype" : mtype,
                    "content" : content
                }
    
        content = resource_cache[resource_path]["content"]
        mtype = resource_cache[resource_path]["mimetype"]
        
    return Response(content, mimetype=mtype)
    
def get_resource():
    rule = flask_request.url_rule.rule
    return _get_resource(rule)
    
#This code sets up and starts the web server, linking in required resources
file_content_path = sys.path[0][:-10] + "/webclient"
filelist = find_browser_files(file_content_path)

for rule in filelist:
    app.add_url_rule(rule, None, get_resource)

app.run(debug=True)
