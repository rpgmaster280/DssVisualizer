
function FormBuilder(settings){
	this.settings = settings;
	
	this.generateStringField = function(id){
		return $("<input type='text' class='form-control'>").attr('id', id).attr('name', id);
	};
	
	this.generateIntegerField = function(id) {
		return $("<input type='number' class='form-control'>").attr('id', id).attr('name', id);
	};
	
	this.generateSelectField = function(id, options, isMultiple = false) {
		var input = null;
		
		if(isMultiple) {
			input = $("<select class='chosen form-control' multiple>").attr('id', id).attr('name', id);
		} else {
			input = $("<select class='chosen form-control'>").attr('id', id).attr('name', id);
		}
		
		for(var i in options) {
			var option = options[i];
			var next_option = $("<option>").val(option).text(option);
			input.append(next_option);
		}
		
		return input;
	};

	//Broken. Need to fix this.	
	this.generateCheckboxField = function(id) {
		var outer_div = $("<div>").addClass("checkbox");
		var inner_label = $("<label>");
		var input = $("<input>").attr("id", id).attr("type", "checkbox").attr("name", id).text(id);
		
		outer_div.append(inner_label);
		inner_label.append(input);
		return outer_div;
	};
	
	this.constructForm = function(){
		
		var form = $("<div>");
		
		for(var setting_key in settings) {
			var setting_value = settings[setting_key];
			
			var form_group = $("<div class='form-group'>");
			var label = $("<label>").attr('for', setting_key).text(setting_key);
			form_group.append(label);
				
			if(setting_value == "String") {
				
				var input = this.generateStringField(setting_key);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value == "Integer") {
				
				var input = this.generateIntegerField(setting_key);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value.startsWith("Options") || setting_value.startsWith("MultiOptions")) {
				var start = setting_value.indexOf("(") + 1;
				var end = setting_value.indexOf(")");
				var str = setting_value.substring(start, end).replace(/\s+/g, '');
				var tokens = str.split(",");
				
				var is_multi = setting_value.startsWith("MultiOptions");
				var input = this.generateSelectField(setting_key, tokens, is_multi);
				
				form_group.append(input);
				form.append(form_group);
			
			//Broken. Need to fix this.
			} else if (setting_value == "Boolean") {
				
				label.css("display", "none");
				var input = this.generateCheckboxField(setting_key);
				form_group.append(input);
				form.append(form_group);
				
			} else {
				//Form option not understood by the system
			}
		}
		
		form.find("select").chosen({width : "100%"});
		
		return form;
	}
}
