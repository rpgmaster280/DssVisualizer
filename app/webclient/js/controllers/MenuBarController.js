
var _next_collection = 1;
function addNewCollection() {
	getCollectionManager().add(new Collection("NewCollection " + _next_collection));
	_next_collection++;
}

$("document").ready(function(){
    
	$("#add_db").click(function(){
		$("#contents-dss-modal").load("views/AddDatabaseView.html");
	});
	
	$("#delete_db").click(function(){
		$("#contents-dss-modal").load("views/DeleteDatabaseView.html");
	});
	
	$("#upload_db").click(function(){
		$("#contents-dss-modal").load("views/FileUploadView.html");
	});
	
	$("#new_collection").click(function(){
		addNewCollection();
	});
	
	$("#delete_collection").click(function(){
		var name = $("#selectable .ui-selected").text();
		getCollectionManager().del(name);
	});
	
	$("#edit_collection").click(function(){
		var old_name = $("#selectable .ui-selected").text();
		var new_name = prompt("Please enter collection name", old_name);
		var manager = getCollectionManager();
		
		if(new_name != null) {
			if(manager.contains(new_name)) {
				alert("Cannot give two collections the same name.");
			} else {
				var collection = manager.get(old_name);
				manager.del(old_name);
				collection.name = new_name;
				manager.add(collection);
				manager.set(collection.name);
			}
		}
	});
	
	$("#add_set").click(function(){
		$("#contents-dss-modal").load("views/AddVisualizationSetView.html");
	});
});