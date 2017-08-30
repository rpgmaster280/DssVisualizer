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

if (namespace["Banner"] == null) {
	namespace.Banner = function Banner(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		
		this.getSettings = function() {
			return {
				"Text": "String", 
				"Size": "Options(h1, h2, h3, h4, h5, h6)", 
				"Color": "Options(Red, Green, Blue)",
				"Align": "Options(Left, Right)"
			};
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Utility for adding headers to the set.";
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var title = settings.Text[0];
			var size = settings.Size[0];
			var color = settings.Color[0];
			var align = settings.Align[0];
			
			var banner = null;
			
			if(size == "h6") {
				banner = $("<h6>");
			} else if(size == "h5") {
				banner = $("<h5>");
			} else if(size == "h4") {
				banner = $("<h4>");
			} else if(size == "h3") {
				banner = $("<h3>");
			} else if(size == "h2") {
				banner = $("<h2>");
			} else if(size == "h1") {
				banner = $("<h1>");
			}
			
			if(align == "Right") {
				banner.addClass("pull-right");
			} else {
				banner.addClass("pull-left");
			}
			
			banner.css("color", color).text(title);
			anchor_point.append(banner);
		};
	};
}
