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

var can_enable = false;
var file_contents = {};
var is_archive = false;

$("document").ready(function(){
	
	$("#cancelButton").click(function(){
		if($("#cancelButton").hasClass("disabled")) {
			return;
		}
		$("#dssModal").modal('hide');
	});
	
	$("#xButton").click(function(){
		if($("#xButton").hasClass("disabled")) {
			return;
		}
		$("#dssModal").modal('hide');
	});
	
	var conn = getDssConnectionSingleton();
	conn.registerHandler(new ResponseHandler("DSS_LS_DB", true, function(response) {
		
		if(response.success) {
			var databases = response.data;
			var formBuilder = new FormBuilder();
			
			if(databases.length > 0) {
				can_enable = true;
			} else {
				databases.push("No databases present in the system.");
			}
			
			var db_names = formBuilder.generateSelectField("db_name", databases);
			$("#db_options").html("");
			$("#db_options").append(db_names);
			db_names.chosen({width : "100%"});
		}
		
	}));
	
	conn.sendRequest(new GetAllDatabasesRequest(), true);

	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var settings = $("#fileUploadForm").serializeArray();
		var settings_as_map = {};
		
		for(var i in settings) {
			var setting = settings[i];
			settings_as_map[setting.name] = setting.value;
		}
		
		var request = new FileUploadRequest(
				settings_as_map["db_name"],
				settings_as_map["tech_name"],
				settings_as_map["event_name"],
				btoa(file_contents),
				is_archive
		);
		
		var upload_func = function(percent){
			
			//Update progress bar with upload percentage
			var width = percent * 100;
			$(".progress-bar-info").css("width", width + "%").text(width.toFixed(2) + "%");
			
			if(percent === 1) {
				$(".progress-bar-info").text("Server is processing archive. Please wait...");
			}
		};
		
		var download_func = function(percent){
			
			//Close modal when everything is done
			if(percent === 1) {
				$("#dssModal").modal('hide');
			}
			
		};
		
		$("#submitButton").addClass("disabled");
		$("#cancelButton").addClass("disabled");
		$("#xButton").addClass("disabled");
		$("#fileInput").attr("disabled", true);
		
		conn.sendRequest(request, true, false, upload_func, download_func);
		
	});
	
	var fileInput = document.getElementById('fileInput');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		
		var tokenized_file = file.name.split(".");
		var extension = tokenized_file[tokenized_file.length - 1];
		is_archive = extension.toUpperCase() == "ZIP";
		var valid_extension = extension.toUpperCase() == "JSON" || is_archive;
		
		if(tokenized_file.length < 2 || !valid_extension) {
			$("#fileFeedback").text("Invalid file extension.");
			if(can_enable) $("#submitButton").removeClass("disabled");
			return;
		}
		
		var reader = new FileReader();

		reader.onload = function(e) {
			
			var obj = null;
			
			if(is_archive) {
				$("#fileFeedback").text("ZIP file selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
				file_contents = reader.result;
				return;
			}
			
			try {
				obj = JSON.parse(reader.result);
			} catch (e) {
				$("#fileFeedback").text("File type not supported.");
				$("#submitButton").addClass("disabled");
				return;
			}
			
			if ((obj[0].keypress_id != null) || (obj[0].keypresses_id != null)) {
				$("#fileFeedback").text("Keypress data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].clicks_id != null) {
				$("#fileFeedback").text("Click data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].timed_id != null) {
				$("#fileFeedback").text("Timed screenshot data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_all_id != null) {
				$("#fileFeedback").text("Traffic data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_xy_id != null) {
				$("#fileFeedback").text("Traffic throughput data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].manualscreen_id != null){
				$("#fileFeedback").text("Manual screenshot data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].snoopy_id != null){
				$("#fileFeedback").text("Snoopy data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else {
				$("#fileFeedback").text("File type not supported.");
				$("#submitButton").addClass("disabled");
			}
			
			file_contents = reader.result;
		};

		if(is_archive) {
			reader.readAsBinaryString(file);
		} else {
			reader.readAsText(file);
		}
		
	});
});