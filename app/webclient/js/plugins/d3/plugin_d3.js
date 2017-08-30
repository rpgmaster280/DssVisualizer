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

if (namespace["D3"] == null) {
	namespace.D3 = function D3(){
		
		this.loadDependencies = function(){
			
			$.holdReady(true);
			$.getScript('js/plugins/d3/d3.js').done(function(){
				$.holdReady(false);
			});
			
			$.holdReady(true);
			$.getScript('js/plugins/d3/d3pie.js').done(function(){
				$.holdReady(false);
			});
			
		};
		
		this.getType = function(){
			return "Library";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Data Driven Document (D3) is a JavaScript library for manipulating documents based on data.";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			alert("Do not create an instance of D3. This function is only for renderers");
		};
	};
}
