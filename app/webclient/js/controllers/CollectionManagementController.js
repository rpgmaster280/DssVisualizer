
function updateUI(collection){
	
	
	$("<div>").load("views/SetView.html", function(){
		
		$("#view_placeholder").html("");
		
		var sets = collection.getAll();

		if(sets.length == 0) {
			var message = $("<h3 style='text-align: center;'>").text("No datasets have been added to this collection.");
			$("#view_placeholder").append(message);
			return;
		}
		
		var counter = 0;
		for(var index in sets) {
			
			var set = sets[index];

			var template = $(this).first().clone();
			
			template.find(".set-title").text(set.name);
			
			var new_panel = template.find(".set-target");
			new_panel.removeClass("set-target");
			
			var add_button = template.find(".add-target");
			add_button.removeClass(".add_target");
			
			var edit_button = template.find(".edit-target");
			edit_button.removeClass(".edit-target");
			
			var delete_button = template.find(".delete-target");
			delete_button.removeClass(".delete_target");
			
			var collapse_button = template.find(".collapse-target");
			collapse_button.removeClass(".collapse-target");
			
			var panel_body = template.find(".set-body-target");
			panel_body.removeClass("set-body-target");
			
			var components = [
				new_panel,
				add_button,
				edit_button,
				delete_button,
				collapse_button,
				panel_body
			];
			
			var pluginManager = getPluginManager();
			var visualizations = set.getAll();
			
			if(visualizations.length > 0) {
				panel_body.html("");
			}
			
			for(var i = 0; i < visualizations.length; i++) {
				var viz = visualizations[i];
				var plugin_name = viz.settings.viz_type;
				var renderer = pluginManager.get(plugin_name);
				var viz_dom = $("<div>").css("clear", "both");
				
				try {
					renderer.run(viz_dom, set.data, viz.settings);
				} catch(e) {
					
					var error_text = "Error running plugin " +
						plugin_name + " | " + e;
					viz_dom.append($("<p>").text(error_text).css("color", "red"));
				}
				
				panel_body.append(viz_dom);
			}
			
			components[5].attr("id", "set-panel" + counter);
			collapse_button.attr("data-target", "#" + components[5].attr("id"));
			counter = counter + 1;
			
			add_button.attr("data-toggle", "modal");
			add_button.attr("data-target", "#dssModal");
			add_button.click([index, set], function(e){
				var set_index = e.data[0];
				var current_set = e.data[1];
				localStorage.setItem("working-set", JSON.stringify(current_set));
				localStorage.setItem("working-set-index", set_index);
				$("#contents-dss-modal").load("views/AddVisualizationView.html");
			});
			
			edit_button.attr("data-toggle", "modal");
			edit_button.attr("data-target", "#dssModal");
			edit_button.click([index, set], function(e){
				var set_index = e.data[0];
				var current_set = e.data[1];
				localStorage.setItem("working-set", JSON.stringify(current_set));
				localStorage.setItem("working-set-index", set_index);
				$("#contents-dss-modal").load("views/EditVisualizationSetView.html");
			});
			
			delete_button.click([index, new_panel], function(e){
				var set_index = e.data[0];
				var panel = e.data[1];
				var current = getCollectionManager().getCurrent();
				current.del(set_index);
				panel.remove();
				getCollectionManager().update();
			});
			
			$("#view_placeholder").append(template);
		}
	});
}

$("document").ready(function(){
	
	var manager = getCollectionManager();
	
	manager.registerHandler(new DssHandler("set", function(collection){
		updateUI(collection);
	}));
	
	manager.registerHandler(new DssHandler("update", function(collection){
		updateUI(collection);
	}));
	
	manager.update();
});