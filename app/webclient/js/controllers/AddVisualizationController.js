
$("document").ready(function(){
	var pluginManager = getPluginManager();
	var renderers = pluginManager.getActiveRenderers();
	var current_set = JSON.parse(localStorage.getItem("working-set"));
	var current_set_index = JSON.parse(localStorage.getItem("working-set-index"));
	
	for(var i in renderers) {
		var renderer = renderers[i];
		var display_string = renderer.class_name + " - " + renderer.depends_on;
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
			settings_as_map[setting.name] = setting.value;
		}
		
		var viz = new Visualization(settings_as_map.viz_type, settings_as_map);
		var manager = getCollectionManager();
		var collection = manager.getCurrent();
		var set = collection.get(current_set_index);
		set.add(viz);
		manager.update();
		
		$("#dssModal").modal('hide');
	});
});