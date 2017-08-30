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

if (namespace["HorizontalRule"] == null) {
	namespace.HorizontalRule = function HorizontalRule(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Utility for adding horizontal rules to the set.";
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {

			anchor_point.append($("<hr>"));
		};
	};
}
