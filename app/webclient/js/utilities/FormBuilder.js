
function FormBuilder(settings){
	this.settings = settings;
	this.constructForm = function(){
		
		var form = $("<div>");
		
		for(var setting_key in settings) {
			var setting_value = settings[setting_key];
			
			var form_group = $("<div class='form-group'>");
			var label = $("<label>").attr('for', setting_key).text(setting_key);
			form_group.append(label);
				
			if(setting_value == "String") {
				
				var input = $("<input type='text' class='form-control'>").attr('id', setting_key).attr('name', setting_key);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value == "Integer") {
				
				var input = $("<input type='number' class='form-control'>").attr('id', setting_key).attr('name', setting_key);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value.startsWith("Options")) {
				var start = setting_value.indexOf("(") + 1;
				var end = setting_value.indexOf(")");
				var str = setting_value.substring(start, end).replace(/\s+/g, '');
				var tokens = str.split(",");
				
				var input = $("<select class='form-control'>").attr('id', setting_key).attr('name', setting_key);
				
				for(var i in tokens) {
					var next_option = $("<option>").val(tokens[i]).text(tokens[i]);
					input.append(next_option);
				}
				
				form_group.append(input);
				form.append(form_group);
				
			} else {
				//Form option not understood by the system
			}
		}
		
		return form;
	}
}