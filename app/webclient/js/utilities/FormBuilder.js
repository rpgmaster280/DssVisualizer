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

function FormBuilder(settings, defaults={}){
	this.settings = settings;
	this.defaults = defaults;
	
	this.generateStringField = function(id, value=null){
		let elem = $("<input type='text' class='form-control'>").attr('id', id).attr('name', id);
		if(value != null)
			elem.val(value);
		return elem;
	};
	
	this.generateIntegerField = function(id, value=null) {
		let elem = $("<input type='number' class='form-control'>").attr('id', id).attr('name', id);
		if(value != null)
			elem.val(value);
		return elem;
	};
	
	this.generateSelectField = function(id, options, isMultiple = false, selected_options=null) {
		var input = null;
		
		if(isMultiple) {
			input = $("<select class='chosen form-control' multiple>").attr('id', id).attr('name', id);
		} else {
			input = $("<select class='chosen form-control'>").attr('id', id).attr('name', id);
		}
		
		for(var i in options) {
			var option = options[i];
			var next_option = $("<option>").val(option).text(option);
			if(selected_options != null && (selected_options.indexOf(option) > -1)) {
				next_option.attr("selected", "");
			}
			input.append(next_option);
		}
		
		return input;
	};
	
	this.constructForm = function(){
		
		var form = $("<div>");
		
		for(var setting_key in this.settings) {
			var setting_value = this.settings[setting_key];
			
			var setting_default = this.defaults[setting_key];
			
			var form_group = $("<div class='form-group'>");
			var label = $("<label>").attr('for', setting_key).text(setting_key);
			form_group.append(label);
				
			if(setting_value == "String") {
				
				var input = this.generateStringField(setting_key, setting_default);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value == "Integer") {
				
				var input = this.generateIntegerField(setting_key, setting_default);
				form_group.append(input);
				form.append(form_group);
				
			} else if (setting_value.startsWith("Options") || setting_value.startsWith("MultiOptions")) {
				var start = setting_value.indexOf("(") + 1;
				var end = setting_value.indexOf(")");
				var str = setting_value.substring(start, end).replace(/\s+/g, '');
				var tokens = str.split(",");
				
				var is_multi = setting_value.startsWith("MultiOptions");
				var input = this.generateSelectField(setting_key, tokens, is_multi, setting_default);
				
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
