
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
		var manager = getCollectionManager();
		
		if(manager.size() <= 1) {
			alert("Visualizer must have at least 1 collection.");
		} else {
			manager.del(name);
		}
	});
	
	$("#edit_collection").click(function(){
		
		var old_name = $("#selectable .ui-selected").text();
		var p_gen = new PopupGenerator();
		
		p_gen.generateTextboxDialog("Enter new name for " + old_name, "Submit", function(new_name){
			
			var manager = getCollectionManager();
			
			if(new_name != null) {
				if(manager.contains(new_name)) {
					alert("Cannot give two collections the same name.");
				} else {
					var collection = manager.get(old_name);
					var new_collection = jQuery.extend(true, {}, collection);
					new_collection.name = new_name;
					manager.add(new_collection);
					manager.set(new_name);
					manager.del(old_name);
				}
			}
		});
		
	});
	
	$("#add_set").click(function(){
		$("#contents-dss-modal").load("views/AddVisualizationSetView.html");
	});
});