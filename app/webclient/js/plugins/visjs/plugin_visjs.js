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

if (namespace["Visjs"] == null) {
	namespace.Visjs = function Visjs(){
		
		this.loadDependencies = function(){
			
			$.holdReady(true);
			
			$('<link>')
			  .appendTo('head')
			  .attr({
			      type: 'text/css', 
			      rel: 'stylesheet',
			      href: 'js/plugins/visjs/vis.css'
			 });
			
			$.getScript('js/plugins/visjs/vis.js').done(function(){
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
			return "Vis.js is a dynamic browser based visualization library that can handle large amounts of dynamic data.";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			alert("Do not create an instance of VisJS. This function is only for renderers");
		};
	};
}
