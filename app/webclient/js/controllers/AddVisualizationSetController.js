

$("document").ready(function(){
	$("#start_date").datepicker({dateFormat: 'yy-mm-dd'});
	$("#end_date").datepicker({dateFormat: 'yy-mm-dd'});
	
	$("#submitButton").click(function(){
		var set_name = $("#set_name").val();
		var start_date = $("#start_date").val();
		var end_date = $("#end_date").val();
		var event_name = $("#event_name").val();
		var tech_names = $("#tech_name").val();
		
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		var set = new Set(
				set_name,
				event_name,
				tech_names,
				start_date,
				end_date
		);
		collection.add(set);
		manager.update();
		
		$("#dssModal").modal('hide');
	})
});