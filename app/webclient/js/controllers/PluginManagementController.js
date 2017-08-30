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
	
	var tableGenerator = new TableGenerator();
	var manager = getPluginManager();
	
	$.each(manager.getAll(), function(key, value){
		
		var isEnabledStr = value.enabled ? "true" : "false";
		var row_values = [
			key,
			value.getDescription(),
			value.getType(),
			value.getDependencies(),
			isEnabledStr,
		];
		
		tableGenerator.addRow(row_values, value,
			function(event){
				value.enabled = !value.enabled;
				var isEnabledStr = value.enabled ? "true" : "false";
				var color = value.enabled ? "green" : "red";
				$(this).find("td:eq(4)").css("color", color).text(isEnabledStr);
				manager.saveSettings();
		});
	});
	$("tr").each(function(key,value){
		$(this).find("td:eq(4):contains(true)").css("color", "green");
		$(this).find("td:eq(4):contains(false)").css("color", "red");
	});
	
	
	tableGenerator.setTableMaxSize(15);
	tableGenerator.setCurrentPage(0);
	
});