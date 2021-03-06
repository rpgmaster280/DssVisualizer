/* Copyright (C) 2017  Jamie Acosta, Robert McCain

This file is part of DssVisualizer.

DssVisualizer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DssVisualizer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DssVisualizer.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * A general request object. All other request inherit from this. 
 * 
 * @param identifier - What function (as understood by backend) is being called.
 * @param parameters - What parameters does the function need in order to work properly.
 * @returns A Request object
 */
function Request(identifier, parameters = null) {
	
	this.requestFields = {};
	this.requestFields["type"] = identifier;
	
	if(parameters != null) {
		for(var key in parameters) {
			this.requestFields[key] = parameters[key];
		}
	}
	
	this.getFields = function() {
		return this.requestFields;
	}
	
	this.setField = function(key, value) {
		this.requestFields[key] = value;
	}
	
	this.getField = function(key) {
		return this.requestFields[key];
	}
	
	this.getType = function() {
		return this.requestFields["type"];
	}
}

//Below is a list of all requests in the system

function AddDatabaseRequest(name) {
	var fields = {
		"db_name" : name
	};
	Request.call(this, "DSS_ADD_DB", fields);
}

function RemoveDatabaseRequest(name) {
	var fields = {
		"db_name" : name
	};
	Request.call(this, "DSS_RM_DB", fields);
}

function GetAllDatabasesRequest() {
	Request.call(this, "DSS_LS_DB", null);
}

function FileUploadRequest(db_name, tech_name, event_name, data, is_archive) {
	var fields = {
		"db_name" : db_name,
		"tech_name" : tech_name,
		"event_name" : event_name,
		"event_data" : data,
		"is_archive" : is_archive
	};
	Request.call(this, "DSS_UPLOAD_FILE", fields);
}

function GetTechniciansRequest(db_name) {
	var fields = {
		"db_name" : db_name
	};
	Request.call(this, "DSS_GET_TECHS", fields);
}

function GetEventsRequest(db_name) {
	var fields = {
		"db_name" : db_name
	};
	Request.call(this, "DSS_GET_EVENTS", fields);
}

function GetDataRequest(db_name, tech_name, event_name, start_date, end_date) {
	var fields = {
		"db_name" : db_name,
		"tech_name" : tech_name,
		"event_name" : event_name,
		"start_date" : start_date,
		"end_date" : end_date
	};
	Request.call(this, "DSS_GET_DATA", fields);
}

function GetAllPluginsRequest() {
	Request.call(this, "DSS_GET_PLUGINS", {});
}

//End list of requests in the system

/**
 * A ResponseHandler object is given to the controller. When the
 * backend sends a response to a message, the response handler
 * will fire off its event handler so long as the filter matches
 * the function name of the original request.
 * 
 * @param filter - What function are we concerned with? Can be set to "ANY".
 * @param oneTime - Should this only be executed once? (Does nothing for sync events)
 * @param onResponse - Function with 1 parameter used in order to process
 * 	the response object send by the backend.
 * @returns A ResponseHandler object
 */
var response_identifier_ticket = 0;

function ResponseHandler(filter, oneTime, onResponse = null) {
	
	this.setResponse = function(onResponse){
		this.onResponse = onResponse;
	};
	
	this.setFilter = function(filter) {
		this.filter = filter;
	}
	
	if(onResponse != null) {
		this.onResponse = onResponse;
	}
	
	this.oneTime = oneTime;
	this.filter = filter;
	this.identifier = response_identifier_ticket++;
}

/**
 * Handles communication between the frontend and backend using
 * Request objects along with ResponseHandlers.
 * 
 * @returns A Connection object.
 */
function Connection() {
	
	this.handlers = new Array();
	
	/**
	 * Registers a handler to the controller. The handler
	 * must be of type ResponseHandler.
	 * 
	 * @param handler - An instance of a ResponseHandler object.
	 * @returns N/A
	 */
	this.registerHandler = function(handler) {
		this.handlers.push(handler);
	};
	
	/**
	 * The sendRequest function is used in order to send requests
	 * to the backend.
	 * 
	 * @param request - An instance of a request object or a raw json object
	 * @param isAsync - If set, request will be asynchronous and will require
	 * 	event handlers in order to respond to the message. Otherwise, will 
	 * 	block until data is retrieved, ignoring event handlers.
	 * @param isRaw - Set to true if request is of type Request. False otherwise.
	 * @returns True if the request was asynchronous, the request object if the
	 * 	request is synchronous.
	 */
	this.sendRequest = function(request, isAsync, isRaw = false, upload_callback=null, download_callback=null) {
		var type = isRaw ? request.type : request.getType();
		var parent = this;
		var returned_data = isAsync ? true : null;
		var param_data = isRaw ? request : request.getFields();
		
		var responseHandler = isAsync ? 
			function(response) { 
			
				var handlers_to_remove = new Array();
			
				//Fire off any events that match the specified message type
				for(var i in parent.handlers) { 
					if(parent.handlers[i].filter == type || parent.handlers[i].filter == "ANY") {
						
						//Fire off the event
						parent.handlers[i].onResponse(response);
						
						//If a one time event, flag it for removal
						if(parent.handlers[i].oneTime) {
							handlers_to_remove.push(parent.handlers[i]);
						}
					}
				}
				
				//Cleans up any one time async event handlers that have fired off				
				for(var i in handlers_to_remove) {
		        	parent.handlers = parent.handlers.filter(function(e1){
		        		return e1.identifier !== handlers_to_remove[i].identifier;
		        	});
		        }
				
			} : function(response){ returned_data = response; };

        jQuery.ajax({
	        success: responseHandler,
	        url: "data_request.php",
	        async: isAsync,
	        data: param_data,
	        dataType: "json",
	        method: "POST",
	        xhr: function() {
	        	var xhr = new window.XMLHttpRequest();
	        	var upload_callback = this.upload_callback;
	        	var download_callback = this.download_callback;
	        	
	        	//Upload event handler
	        	xhr.upload.addEventListener("progress", function(evt){
	        		if(evt.lengthComputable && upload_callback != null) {
	        			var percentComplete = evt.loaded / evt.total;
	        			upload_callback(percentComplete);
	        		}
	        	}, false);
	        	
	        	//Download event handler
	        	xhr.addEventListener("progress", function(evt){
	        		if(evt.lengthComputable && download_callback != null) {
	        			var percentComplete = evt.loaded / evt.total;
	        			download_callback(percentComplete);
	        		}
	        	}, false);
	        	
	        	return xhr;
	        }.bind({"upload_callback": upload_callback, "download_callback": download_callback})
	    });

        return returned_data;
	};
	
}


var masterConnection = new Connection();

/**
 * This function ensures that there is only one running instance of a Connection.
 * @returns A singleton instance of a Connection.
 */
function getDssConnectionSingleton() {
	return masterConnection;
}

