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
	
	var conn = getDssConnectionSingleton();
	
	conn.registerHandler(new ResponseHandler("DSS_LS_DB", true, function(response) {
		
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
			$("#delete_options").html("");
			$("#delete_options").append(db_names);
			
			db_names.chosen({ width: "100%"});
		}
		
	}));

	conn.sendRequest(new GetAllDatabasesRequest(), true);
	
	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var database_to_drop = $("#db_name option:selected").text();
		conn.sendRequest(new RemoveDatabaseRequest(database_to_drop), true);
		$("#dssModal").modal('hide');
	});
});