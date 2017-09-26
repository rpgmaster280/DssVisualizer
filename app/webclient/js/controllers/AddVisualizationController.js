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

$("document").ready(function(){
	var pluginManager = getPluginManager();
	var renderers = pluginManager.getActiveRenderers();
	var current_set_index = JSON.parse(localStorage.getItem("working-set-index"));
	
	for(var i in renderers) {
		var renderer = renderers[i];
		var display_string = renderer.class_name + " - " + renderer.getDependencies();
		var new_option = $("<option>").text(display_string).val(renderer.class_name);
		$("#viz_type").append(new_option);
	}
	$("#viz_type").chosen({width: "100%"});
	
	$("#viz_type").change(function(){
		var current_option = $("#viz_type option:selected");
		
		$("#viz_specific").html("");
		if(current_option.val() == "") {
			$("#submitButton").addClass("disabled");
			return
		}
		$("#submitButton").removeClass("disabled");
		
		//Generate form based on plugin settings
		var plugin = pluginManager.get(current_option.val());
		var settings = plugin.getSettings();
		
		var form_builder = new FormBuilder(settings);
		var new_form = form_builder.constructForm();
		$("#viz_specific").append(new_form);
	});
	
	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var settings = $("#vizAddForm").serializeArray();
		var settings_as_map = {};
		
		for(var i in settings) {
			var setting = settings[i];
			
			if(settings_as_map[setting.name] == null) {
				settings_as_map[setting.name] = [];
			}
			
			settings_as_map[setting.name].push(setting.value);
		}
		
		var viz = new Visualization(settings_as_map.viz_type, settings_as_map);
		
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		var set = collection.get(current_set_index);
		var plugin_name = viz.settings.viz_type;
		var renderer = pluginManager.get(plugin_name);
		var viz_dom = $("<div>").css("clear", "both");
		var error_text = null;
		
		var context = {
				"collection_name" : collection.name,
				"database_name" : set.db_name,
				"set_name" : set.name,
				"set_index" : current_set_index,
				"viz_name" : plugin_name,
				"viz_index" : 0 //Hardcoded since viz hasn't been added to set yet
		};
		
		//This block of code will attempt to execute the renderer plugin in
		//the background. If it succeeds, the visualization will be added to
		//the system. Otherwise, an error alert will be displayed.
		if(!renderer.enabled) {
			error_text = "Selected renderer is not enabled in the system";
		} else {
			try {
				renderer.run(viz_dom, set.data, viz.settings, context);
			} catch(e) {
				error_text = "Error running plugin " + plugin_name + " | " + e;
			}
		}
		
		if(error_text == null) {
			set.add(viz);
			manager.update();
		} else {
			new AlertManager().generateAlert("alert-danger", "Error adding visualization: " + error_text);
		}
		
		$("#dssModal").modal('hide');
	});
});