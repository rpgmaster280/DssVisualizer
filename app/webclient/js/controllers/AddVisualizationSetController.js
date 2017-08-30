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

$("document").ready(function(){
	
	$("#start_date").datepicker({dateFormat: 'yy-mm-dd'});
	$("#end_date").datepicker({dateFormat: 'yy-mm-dd'});
	
	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		
		var set_name = $("#set_name").val();
		var start_date = $("#start_date").val();
		var end_date = $("#end_date").val();
		var event_name = $("#event_name").val();
		var tech_names = $("#tech_name").val();
		var database = $("#db_options option:selected").text();
		
		var set = new Set(
				set_name,
				database,
				event_name,
				tech_names,
				start_date,
				end_date
		);
		collection.add(set);
		
		set.loadData().then(function(fufilled){ manager.update(); });
		
		$("#dssModal").modal('hide');
		
	});
	
	var conn = getDssConnectionSingleton();
	var request = new GetAllDatabasesRequest();
	conn.registerHandler(new ResponseHandler(request.getType(), true, function(response) {
		
		if(response.success) {
			var databases = response.data;
			var formBuilder = new FormBuilder();
			
			if(databases.length > 0) {
				$("#submitButton").removeClass("disabled");
			} else {
				databases.push("No databases present in the system.");
				$("#submitButton").addClass("disabled");
			}
			
			var db_names = formBuilder.generateSelectField("db_name", databases);
			$("#db_options").html("");
			$("#db_options").append(db_names);
			db_names.chosen({width : "100%"});
		}
		
	}));
	conn.sendRequest(request, true);
	
	
});