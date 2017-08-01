
$("document").ready(function(){
	
	$("#start_date").datepicker({dateFormat: 'yy-mm-dd'});
	$("#end_date").datepicker({dateFormat: 'yy-mm-dd'});
	
	var conn = getDssConnectionSingleton();
	var manager = getCollectionManager();
	var collection = manager.getCurrent();
	var current_set_index = JSON.parse(localStorage.getItem("working-set-index"));
	var current_set = collection.get(current_set_index);
	
	$("#set_name").val(current_set.name);
	$("#start_date").val(current_set.start_date);
	$("#end_date").val(current_set.end_date);
	$("#event_name").val(current_set.event_name);
	$("#tech_name").val(current_set.tech_names);
	
	$("#submitButton").click(function(){
		
		var set_name = $("#set_name").val();
		var start_date = $("#start_date").val();
		var end_date = $("#end_date").val();
		var event_name = $("#event_name").val();
		var tech_names = $("#tech_name").val();
		var database = $("#db_options option:selected").text();
		
		var new_set = new Set(
				set_name,
				database,
				event_name,
				tech_names,
				start_date,
				end_date
		);
		
		//If the database has not changed, pass the data.
		if(database == current_set.db_name) {
			
			new_set.insertData(current_set.data);
			new_set.visualizations = current_set.visualizations;
			collection.update(parseInt(current_set_index), new_set);
			manager.update();
			
		//Else we need to re-query the database for new data.
		} else {
			
			var request = new GetDataRequest(database, tech_names, event_name, start_date, end_date);
			conn.registerHandler(new ResponseHandler(request.getType(), true, function(response) {
				
				if(response.success) {
					new_set.insertData(response.data);
					new_set.visualizations = current_set.visualizations;
					collection.update(parseInt(current_set_index), new_set);
					manager.update();
				}
				
			}));
			conn.sendRequest(request, true);
		}
		
		$("#dssModal").modal('hide');
	});
	
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
			$("#db_name").val(current_set.db_name);
			db_names.chosen({width : "100%"});
		}
		
	}));
	conn.sendRequest(request, true);
});
