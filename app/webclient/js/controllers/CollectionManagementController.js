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

var _dom_table = {};
var _last_collection = null;

function generateNoDatasetMessage(target) {
	var message = $("<h3 style='text-align: center;'>").text("No datasets have been added to this collection.");
	target.append(message);
}

function updateUI(collection){
	
	$("<div>").load("views/SetView.html", function(){
		
		$("#view_placeholder").empty();
		
		var collection_markup = $("<div>");
		
		var sets = collection.getAll();

		if(sets.length == 0) {
			
			generateNoDatasetMessage(collection_markup);
			
		} else {
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
					
					var context = {
							"collection_name" : collection.name,
							"database_name" : set.db_name,
							"set_name" : set.name,
							"set_index" : index,
							"viz_name" : plugin_name,
							"viz_index" : i
					};
					
					var dataset = {
							"viz_dom" : viz_dom,
							"data" : set.data,
							"settings": viz.settings,
							"context" : context,
							"panel_body" : panel_body
					};
					
					new Promise(function(resolve, reject){
			
						if(!renderer.enabled) {
							var error_text = "Plugin tried to run but is disabled: " + plugin_name;
							viz_dom.append($("<p>").text(error_text).css("color", "red"));
							reject(this);
						} else {
							try {
								renderer.run(this.viz_dom, this.data, this.settings, this.context);
								resolve(this);
							} catch(e) {
								var error_text = "Error running plugin " +
									plugin_name + " | " + e;
								viz_dom.append($("<p>").text(error_text).css("color", "red"));
								reject(this);
							}
						}
						
						
					}.bind(dataset)).then(function(fufill){
						fufill.panel_body.append(fufill.viz_dom);
					}).catch(function(error){
						error.panel_body.append(error.viz_dom);
					});
					
				}
				
				panel_body.attr("id", "set-panel" + counter);
				collapse_button.attr("data-target", "#" + panel_body.attr("id"));
				counter = counter + 1;
				
				add_button.attr("data-toggle", "modal");
				add_button.attr("data-target", "#dssModal");
				add_button.click([index], function(e){
					var set_index = e.data[0];
					localStorage.setItem("working-set-index", set_index);
					$("#contents-dss-modal").load("views/AddVisualizationView.html");
				});
				
				edit_button.attr("data-toggle", "modal");
				edit_button.attr("data-target", "#dssModal");
				edit_button.click([index], function(e){
					var set_index = e.data[0];
					localStorage.setItem("working-set-index", set_index);
					$("#contents-dss-modal").load("views/EditVisualizationSetView.html");
				});
				
				delete_button.click([index, new_panel], function(e){
					var set_index = e.data[0];
					var panel = e.data[1];
					var manager = getCollectionManager();
					var current = manager.getCurrent();
					current.del(set_index);
					panel.remove();
					manager.update();
				});
				
				collection_markup.append(template);
			}
		}
		
		$("#view_placeholder").append(collection_markup);
	});
}

$("document").ready(function(){
	
	var manager = getCollectionManager();
	
	manager.registerHandler(new DssHandler("set", function(collection){
		
		//If we are changing collections then save the DOM for later use.
		if(_last_collection != null && _last_collection != collection.name) {
			_dom_table[_last_collection] = $("#view_placeholder > div").detach();	
		}
		
		//Case: We haven't viewed the collection yet.
		if(_dom_table[collection.name] == null) {
			
			//Generate markup.
			updateUI(collection);
			
		//Case: Collection has been viewed before.
		} else {
		
			//Load previously saved markup.
			$("#view_placeholder").html("");
			$("#view_placeholder").append(_dom_table[collection.name]);
		}
		
		_last_collection = collection.name;
		
	}));
	
	manager.registerHandler(new DssHandler("update", function(collection){
		
		//Think of more intelligent way of redrawing the page (currently redraws everything).
		updateUI(collection);
		
	}));
	
	manager.registerHandler(new DssHandler("del", function(collection){
		
		delete _dom_table[collection.name];
		
		if(collection.name == _last_collection) {
			_last_collection = null;
		}
		
	}));
	
	manager.update();
});
