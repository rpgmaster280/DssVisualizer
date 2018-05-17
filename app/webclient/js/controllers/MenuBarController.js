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

var _next_collection = 1;

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
		let manager = getCollectionManager();
		while(manager.get("NewCollection " + _next_collection) != null) {
			_next_collection++;
		}
		manager.add(new Collection("NewCollection " + _next_collection));
		manager.save();
		_next_collection++;
	});
	
	$("#delete_collection").click(function(){
		var name = $("#selectable .ui-selected").text();
		var manager = getCollectionManager();
		
		if(manager.size() <= 1) {
			alert("Visualizer must have at least 1 collection.");
		} else {
			manager.del(name);
			manager.save();
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
					manager.save();
				}
			}
		});
		
	});
	
	$("#add_viz").click(function(){
		$("#contents-dss-modal").load("views/AddVisualizationView.html");
	});
	
	$("#expand_viz").click(function(){
		$("#view_placeholder .collapse").collapse('show');
	});
	
	$("#collapse_viz").click(function(){
		$("#view_placeholder .collapse").collapse('hide');
	});
	
	$("#reset_workspace").click(function(){
		getCollectionManager().reset();
		getCollectionManager().save();
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
			
			
			getCollectionManager().loadFromJSON(obj).then(function(){
				getCollectionManager().save();
			});
		};

		reader.readAsText(file);

	});
});

