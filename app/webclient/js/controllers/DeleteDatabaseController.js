
$("document").ready(function(){
	
	var conn = getDssConnectionSingleton();
	
	conn.registerHandler(new ResponseHandler("DSS_LS_DB", true, function DisplayDatabases(response) {
		
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