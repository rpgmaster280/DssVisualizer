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
	var message = $("<h3 style='text-align: center;'>").text("No visualizations have been added to this collection.");
	target.append(message);
}

function updateUI(collection){
	
	$("<div>").load("views/VisualizationView.html", function(){
		
		$("#view_placeholder").empty();
		
		var collection_markup = $("<div>");
		
		var visualizations = collection.getAll();

		if(visualizations.length == 0) {
			
			generateNoDatasetMessage(collection_markup);
			
		} else {
			
			var counter = 0;
			for(var index in visualizations) {
				
				var visualization = visualizations[index];

				var template = $(this).first().clone();
				
				template.find(".viz-title").text(visualization.name);
				
				var new_panel = template.find(".viz-target");
				new_panel.removeClass("viz-target");
				
				var edit_button = template.find(".edit-target");
				edit_button.removeClass(".edit_target");
				
				var delete_button = template.find(".delete-target");
				delete_button.removeClass(".delete_target");
				
				var collapse_button = template.find(".collapse-target");
				collapse_button.removeClass(".collapse-target");
				
				var panel_body = template.find(".viz-body-target");
				panel_body.removeClass("viz-body-target");
				
				var pluginManager = getPluginManager();
				var plugin_name = visualization.viz_type;
				var renderer = pluginManager.get(plugin_name);
				var viz_dom = $("<div>").css("clear", "both");
				
				var context = {
						"collection_name" : collection.name,
						"database_name" : visualization.db_name,
				};
				
				var dataset = {
						"viz_dom" : viz_dom,
						"data" : visualization.data,
						"settings": visualization.settings,
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
				
				panel_body.attr("id", "viz-panel" + counter);
				collapse_button.attr("data-target", "#" + panel_body.attr("id"));
				
				delete_button.click([index, new_panel], function(e){
					var viz_index = e.data[0];
					var panel = e.data[1];
					var manager = getCollectionManager();
					var current = manager.getCurrent();
					current.del(viz_index);
					panel.remove();
					manager.update();
				});
				
				edit_button.click({"index" : index}, function(e){
					localStorage.setItem("viz_index", e.data.index);
					$("#contents-dss-modal").load("views/EditVisualizationView.html");
					$("#dssModal").modal('show');
				});
				
				collection_markup.append(template);
				
				counter = counter + 1;
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

});
