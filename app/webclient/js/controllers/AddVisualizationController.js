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
	
	//Add date picker GUI elements to appropriate form elements
	$("#start_date").datepicker({dateFormat: 'yy-mm-dd'});
	$("#end_date").datepicker({dateFormat: 'yy-mm-dd'});
	
	//Generate list of available renderer types for user selection
	let pluginManager = getPluginManager();
	let renderers = pluginManager.getActiveRenderers();
	for(let i in renderers) {
		let renderer = renderers[i];
		let display_string = renderer.class_name + " - " + renderer.getDependencies();
		let new_option = $("<option>").text(display_string).val(renderer.class_name);
		$("#viz_type").append(new_option);
	}
	$("#viz_type").chosen({width: "100%"});
	
	let conn = getDssConnectionSingleton();
	let request = new GetAllDatabasesRequest();
	conn.registerHandler(new ResponseHandler(request.getType(), true, function(response) {
		
		//Generate a list of available databases. If none are available, disable submit
		let databases = [];
		let formBuilder = new FormBuilder();
		
		if(response.success) {databases = response.data;}
		
		let db_names = null;
		if(databases.length == 0) {
			db_names = formBuilder.generateSelectField("db_name", ["No databases present in the system"]);
			$("#submitButton").addClass("disabled");
		} else {
			db_names = formBuilder.generateSelectField("db_name", databases);
		}
		$("#db_options").html("");
		$("#db_options").append(db_names);
		db_names.chosen({width : "100%"});
		
		//Add event handler for renderer selection (generates renderer specific settings)
		$("#viz_type").change({"databases" : databases}, function(e){
			let current_option = $("#viz_type option:selected");
			
			$("#viz_specific").html("");

			if(current_option.val() == "" || e.data.databases.length == 0) {
				$("#submitButton").addClass("disabled");
				return
			}
			$("#submitButton").removeClass("disabled");
			
			//Generate form based on plugin settings
			let pluginManager = getPluginManager();
			let plugin = pluginManager.get(current_option.val());
			let settings = plugin.getSettings();
			
			let form_builder = new FormBuilder(settings);
			let new_form = form_builder.constructForm();
			$("#viz_specific").append(new_form);
		});
		
	}));
	conn.sendRequest(request, true);
	
	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		let viz_name = $("#viz_name").val();
		let viz_type = $("#viz_type option:selected").val();
		let start_date = $("#start_date").val();
		let end_date = $("#end_date").val();
		let event_name = $("#event_name").val();
		let tech_names = $("#tech_name").val();
		let database = $("#db_options option:selected").text();
		let settings = $("#viz_specific :input").serializeArray();
		let settings_as_map = {};
		for(let i in settings) {
			let setting = settings[i];
			
			if(settings_as_map[setting.name] == null) {
				settings_as_map[setting.name] = [];
			}
			
			settings_as_map[setting.name].push(setting.value);
		}
		
		//Add visualization to the current collection
		let viz = new Visualization(
				viz_name,
				database,
				event_name,
				tech_names,
				start_date,
				end_date,
				viz_type, 
				settings_as_map
		);
		let manager = getCollectionManager();
		let collection = manager.getCurrent();
		collection.add(viz);
		
		//Update GUI upon successfully loading visualization data
		viz.loadData().then(function(fufilled){ 
			manager.update();
			manager.save();
		});
		
		$("#dssModal").modal('hide');
	});
});