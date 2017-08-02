
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
	
	$("#expand_set").click(function(){
		$("#view_placeholder .collapse").collapse('show');
	});
	
	$("#collapse_set").click(function(){
		$("#view_placeholder .collapse").collapse('hide');
	});
	
	$("#reset_workspace").click(function(){
		getCollectionManager().reset();
	});
	
	$("#save_workspace").click(function(){
		var workspace_serialized = getCollectionManager().serialize();
		var filename = "dss_workspace.json";
		var blob = new Blob([workspace_serialized], {type: "application/json;charset=utf-8"});
		saveAs(blob, filename);
	});
	
	$('#load_workspace').click(function(){
		$("#loaded_workspace").click();
	});
	
	$("#loaded_workspace").change(function(){

		var file = $(this).get(0).files[0];
		
		var reader = new FileReader();
		
		reader.onload = function(e) {
			
			var obj = null;
			
			try {
				obj = JSON.parse(reader.result);
			} catch (e) {
				alert("File selected is not vaild.");
				return;
			}
			
			getCollectionManager().loadFromJSON(obj);
			getCollectionManager().save();
		};

		reader.readAsText(file);

	});
});

