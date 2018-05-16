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

function JSONDatetoMillis(date){
	var theDate = date.split(/-|:| /);
	var d = new Date(theDate[0],theDate[1]-1,theDate[2],theDate[3],theDate[4],theDate[5]);
	return d.getTime();
}

var namespace = getPluginNamespace();

if (namespace["Frequency"] == null) {
	namespace.Frequency = function Frequency(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Visjs";
		};
		
		this.getDescription = function(){
			return "VisJS based frequency graphing utility.";
		};

		//Settings currently ignored because the graph currently only supports one table
		this.getSettings = function() {
			return {
				"TimeAxis" : "Options(Off, Major, Minor, Both)",
				"YAxisVisible" : "Options(On, Off)"
			};
		};
		
		this.isSynchronized = false;
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var container = anchor_point.get(0);
			var throughput_data = data["traffic_throughput"];
			
			//Check to see if the database is empty for table throughput
			if(throughput_data == null) {
				throw "There is no throughput data in the database.";
			}
			
			//Renames start field to x for the purposes of this plugin
			var first_row = throughput_data[0];
			if(first_row['start'] != null) {
				for(var i in throughput_data){
					var row = throughput_data[i];
					row['x'] = row['start'];
					delete row['start'];
				}
			}
			
			var dataset = new vis.DataSet(throughput_data);
		  
			// get data start and end date
			startDate = dataset.min('x')['x'];
			endDate = dataset.max('x')['x'];
			var anHour = 1000 * 60 * 60;
			startDate = JSONDatetoMillis(startDate) - anHour;
			endDate = JSONDatetoMillis(endDate) + anHour;
			maxZoom = endDate - startDate;
			
			var majorOn = settings.TimeAxis == "Major" || settings.TimeAxis == "Both";
			var minorOn = settings.TimeAxis == "Minor" || settings.TimeAxis == "Both";
			var yaxisvisible = settings.YAxisVisible == "On";

			var options = {
				// limit viewing window to startdate and end date
				min: startDate,
				max: endDate,
				//limit zoomin to 30 sec
				zoomMin: 1000 * 30,
				//limit zoom out to whole data set
				zoomMax: maxZoom,
				drawPoints: true,
				interpolation: false,
				height: "150px",
				showMinorLabels: minorOn,
				showMajorLabels: majorOn,
				dataAxis: {visible: yaxisvisible},
				sampling: true,
				sort: true
			};
			
			// Create a frequency graph
			var graph = new vis.Graph2d(container, dataset, options);
			anchor_point.data("frequency", graph);
			
			var sync_key = context.set_name + context.set_index;
			if(this.isSynchronized) {
				
				var table = context.collection_name;
				
				var synchronizer = getGraphSynchronizer();
				synchronizer.add_graph(table, sync_key, graph);
				
				graph.on("rangechanged", function(properties){
					var windowRangeStart = properties.start;
					var windowRangeEnd = properties.end;
					var synchronizer = getGraphSynchronizer();
					var graphs = synchronizer.get_graphs(table, this.key);
					
					for (var i in graphs) {
						var graph = graphs[i];
						graph.setWindow(windowRangeStart,windowRangeEnd);
					}
				}.bind({"key" : sync_key}));
			}
		};
	}
}


