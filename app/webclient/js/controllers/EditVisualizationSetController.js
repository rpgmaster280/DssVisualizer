
$("document").ready(function(){
	var current_set = JSON.parse(localStorage.getItem("working-set"));
	var current_set_index = JSON.parse(localStorage.getItem("working-set-index"));
	
	$("#set-name").val(current_set.name);
	
	$("#submitButton").click(function(){
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		var set_name = $("#set-name").val();
		var new_set = new Set(set_name);
		
		collection.update(parseInt(current_set_index), new_set);
		
		manager.update();
		
		$("#dssModal").modal('hide');
	});
});