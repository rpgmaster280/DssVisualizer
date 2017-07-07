#!flask/bin/python

from flask import Flask
from flask import request as flask_request
from flask import Response
import os
import sys
import importlib
from dss_response.DssResponse import DssResponse

#Ensures working directory is where the webserver script is
os.chdir(sys.path[0])

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
        class_instance = target_class(None)
        request_map[class_instance.getRequestLabel()] = class_instance
    return request_map

request_map = loadDssRequests()
app = Flask(__name__)

#Begin list of error messages (Change to DssResponses)
type_not_found = """{ 
    message: \"Type not found\",
    success: false,
    data: []
}"""
request_not_found = """{ 
    message: \"Request not understood by the system\",
    success: false,
    data: []
}"""
invalid_parameters = """{ 
    message: \"Parameters for the request are incorrect\",
    success: false,
    data: []
}"""
#End list of error messages

#Handles database requests from the browser
@app.route('/data_request.php')
def data_request_handler():
    
    #First, check to see if type field is set. If not return error.
    if 'type' not in flask_request.args:
        return Response(type_not_found, mimetype="application/json")
    
    if flask_request.args['type'] not in request_map:
        return Response(request_not_found, mimetype="application/json")
    
    req = request_map[flask_request.args['type']]
    req.setUserInput(flask_request.args)
    
    if not req.validateInput():
        return Response(invalid_parameters, mimetype="application/json")
    
    return req.processRequest()

#Finds html, js, image, and other standard resources needed for the browser
def find_browser_files(startPoint):
    path_len = len(startPoint)
    resource_map = {}
    for root, subdirs, files in os.walk(startPoint):
        for filename in files:
            #Absolute path of the file
            file_loc = root + "/" + filename
            
            #Relative path of the file
            rule = file_loc[path_len:]
            
            #Create dictionary for file entry and populate fields
            resource_map[rule] = {}
            resource_map[rule]["absolute_path"] = file_loc
            resource_map[rule]["relative_path"] = rule
            
            #Tokenize file path in order to determine extension
            file_tokens = file_loc.split(".")
            
            #Get the extension of the file (if present
            if not file_tokens[-1]:
                resource_map[rule]["extension"] = "None"
            else:
                resource_map[rule]["extension"] = file_tokens[-1]
                
    return resource_map

#Gets standard resources (html, css, js, images, etc) for the browser
def get_resource():
    
    rule = flask_request.url_rule.rule
    contents = ""
    mtype = "plain/text"
    
    if rule in filelist:
        
        #Get extension and determine open flags
        extension = filelist[rule]["extension"]
        open_flags = 'r'
        if extension == "png" or extension == "jpeg" or extension == "jpg":
            open_flags = 'rb'
            
        #Open file and determine MIME type
        with open(filelist[rule]["absolute_path"], open_flags) as resource:
            contents = resource.read()    
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
            else:
                raise RuntimeError("Unsupported mime type")
    
    #Return a response
    return Response(contents, mimetype=mtype)
    
#This code sets up and starts the web server, linking in required resources
file_content_path = sys.path[0][:-10] + "/webclient"
filelist = find_browser_files(file_content_path)

for rule in filelist:
    app.add_url_rule(rule, None, get_resource)

app.run(debug=True)
