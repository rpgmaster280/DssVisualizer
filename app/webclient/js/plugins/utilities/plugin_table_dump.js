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

var namespace = getPluginNamespace();

if (namespace["TableDump"] == null) {
	namespace.TableDump = function TableDump(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Dumps the database contents to the screen.";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var textarea = $("<textarea>").attr("rows", 30).css("overflow-y", "auto").css("width", "100%");
			
			for(var i in data) {
				var table_name = "Table - " + i;
				textarea.text(textarea.text() + table_name + "\n\n");
				for(var j in data[i]) {
					var row = data[i][j];
					textarea.text(textarea.text() + JSON.stringify(row) + "\n");
				}
				textarea.text(textarea.text() + "\n");
			}
			
			anchor_point.append(textarea);	
		};
	};
}
