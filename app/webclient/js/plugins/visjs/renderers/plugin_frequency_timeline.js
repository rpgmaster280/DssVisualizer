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

if (namespace["FrequencyTimeline"] == null) {
	namespace.FrequencyTimeline = function (){
		
		this.loadDependencies = function(){
			//Nothing to do here
			
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Visjs, Frequency, Timeline";
		};
		
		this.getDescription = function(){
			return "Provides both frequency and timeline views.";
		};
		
		this.getSettings = function() {
			return {
				"Sources": "MultiOptions(Clicks, Keypresses, Timed Screenshots, Manual Screenshots, Traffic, Snoopy)",
				"PointStyle" : "Options(box, point)",
				"TimeAxis" : "Options(Off, Major, Minor, Both)",
				"YAxisVisible" : "Options(On, Off)",
				"Synchronized" : "Options(On, Off)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var freq = new namespace["Frequency"]();
			var timeline = new namespace["Timeline"]();
			
			freq.isSynchronized = timeline.isSynchronized = settings["Synchronized"] == "On"
			
			freq.createInstance(anchor_point, data, settings, context);
			timeline.createInstance(anchor_point, data, settings, context);
		};
	};
}
