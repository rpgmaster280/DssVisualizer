

$("document").ready(function(){
	$("#start_date").datepicker({dateFormat: 'yy-mm-dd'});
	$("#end_date").datepicker({dateFormat: 'yy-mm-dd'});
	
	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var set_name = $("#set_name").val();
		var start_date = $("#start_date").val();
		var end_date = $("#end_date").val();
		var event_name = $("#event_name").val();
		var tech_names = $("#tech_name").val();
		var database = $("#db_options option:selected").text();
		
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		var set = new Set(
				set_name,
				database,
				event_name,
				tech_names,
				start_date,
				end_date
		);
		collection.add(set);
		manager.update();
		
		$("#dssModal").modal('hide');
	});
	
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
			$("#db_options").html("");
			$("#db_options").append(db_names);
			db_names.chosen({width : "100%"})
		}
		
	}));
	conn.sendRequest(new GetAllDatabasesRequest(), true);
	
});