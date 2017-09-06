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

function AddAnnotationRequest(db_name, table_name, contents) {
	Request.call(this, "DSS_ADD_ANNOTATION", {
		"db_name" : db_name,
		"table_name" : table_name,
		"contents" : contents
	});
}

function DeleteAnnotationRequest(db_name, table_name, id) {
	Request.call(this, "DSS_REMOVE_ELEMENT", {
		"db_name" : db_name,
		"table_name" : table_name,
		"id" : id
	});
}

function JSONDatetoMillis(date){
	var theDate = date.split(/-|:| /);
	var d = new Date(theDate[0],theDate[1]-1,theDate[2],theDate[3],theDate[4],theDate[5]);
	return d.getTime();
}

var namespace = getPluginNamespace();
var metaDataItem = {};

if (namespace["Timeline"] == null) {
	namespace.Timeline = function Timeline(){
		
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
			return "VisJS based timeline graphing utility.";
		};
		
		this.getSettings = function() {
			return {
				"Sources": "MultiOptions(Clicks, Keypresses, Timed Screenshots, Manual Screenshots, Traffic, Snoopy)",
				"Synchronized": "Options(On, Off)",
				"PointStyle" : "Options(box, point)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			if(settings["Sources"] == null) {
				throw "No data sources were selected";
			}
			
			var source_map = {
				"Clicks" : "clicks",
				"Keypresses" : "keypresses",
				"TimedScreenshots" : "timed_screenshots",
				"ManualScreenshots" : "manual_screenshots",
				"Traffic" : "traffic",
				"Snoopy" : "snoopy"
			};
			
			var tables = [];
			for(var i in settings.Sources) {
				var table_name = source_map[settings.Sources[i]];
				tables.push(table_name);
			}
			
			// DOM element where the Timeline will be attached
			var container = anchor_point.get(0);
			
			var items = new vis.DataSet();
			for(var i in tables) {
				var database_table = data[tables[i]];
				database_table.forEach(function(obj){ 
					obj['group'] = (i + "");
					obj['m_id'] = obj["_id"]["$oid"];
					obj['type'] = settings.PointStyle;
				});
				items.add(database_table);
			}
			
			
			// Create a DataSet (allows two way data-binding)
			var groups = new vis.DataSet();
			var dataNames = settings.Sources;
			
			for(var g=0; g<dataNames.length; g++){
				groups.add({id: g, content: dataNames[g]});
			}
			
		    // get data start and end date
			startDate = items.min('start')['start'];
			endDate = items.max('start')['start'];
			var anHour = 1000 * 60 * 60;
			startDate = JSONDatetoMillis(startDate) - anHour;
			endDate = JSONDatetoMillis(endDate) + anHour;
			maxZoom = endDate - startDate;
			
			// Configuration for the Timeline
			var options = {
				min: startDate,
				max: endDate,
				zoomMin: 1000 * 30,	//limit zooming to 30 sec
				zoomMax: maxZoom,	//limit zoom out to whole data set
				maxHeight: 400,
				dataAttributes: 'all',
				template: function (item) {
					var display = item.content;
					if(display == " "){
						return '<div>Img ' + item.start + '</div>';
					}
					else{
				    	return '<div>' + item.content + '</div>';
					}
				},
				editable: false, //Turn me on when add is fixed
				stack: false,
				/*onAdd: function(item, callback){
					new PopupGenerator().generateTextboxDialog('Add Annotation', 'Add', function(value) {
						if (value) {

							var isoDate = new Date(item.start);
							var itemDateString = isoDate.getFullYear()+"-"+(isoDate.getMonth()+1)+"-"+isoDate.getDate();
							var itemTimeHours = addLeadingZeroes(isoDate.getHours());
							var itemTimeMinutes = addLeadingZeroes(isoDate.getMinutes());
							var itemTimeSeconds = addLeadingZeroes(isoDate.getSeconds());
							itemDateString += " "+itemTimeHours+":"+itemTimeMinutes+":"+itemTimeSeconds;
							
							var db_name = this.context.database_name;
							var table_name = metaDataItem.parent_table;
							
							item.start = itemDateString;
							item.content = value;
							item.annotation = value;
							item.className = "annotation";
							item.event_name = metaDataItem.event_name;
							item.tech_name = metaDataItem.tech_name;
							item.parent_table = metaDataItem.parent_table;
							
							delete item.id;

							var request = new AddAnnotationRequest(db_name, table_name, JSON.stringify(item));
							var connection = getDssConnectionSingleton();
							connection.registerHandler(new ResponseHandler(request.getType(), true, function(response){
								
								if(response.success) {
									item['m_id'] = response.data["$oid"]
									callback(item);
								} else {
									callback(null);
								}
							}));
							connection.sendRequest(request, true); 
							
						} else {
							callback(null);
						}
					}.bind({"context": context}));
				},
				onUpdate: function(item, callback){
					new PopupGenerator().generateAnnotationViewDialog(item, item, callback);
				},
				onRemove: function(item, callback) {
					new PopupGenerator().generateConfirmDialog(
						'Remove item', 
						'Do you really want to remove item ' + item.content + '?',
						function (ok) {
			                		if (ok) {
			                			
			                			var db_name = this.context.database_name;
			                			var table_name = item.parent_table;
			                			
			                			var request = new DeleteAnnotationRequest(db_name, table_name, item.m_id);
										var connection = getDssConnectionSingleton();
										connection.registerHandler(new ResponseHandler(request.getType(), true, function(response){
											if(response.success) {
												callback(item);
											} else {
												callback(null);
											}
										}));
										connection.sendRequest(request, true); 
			                    		callback(item); //confirm deletion
			                		} else {
			                    		callback(null); //cancel deletion
			                		}
	            		}.bind({"context": context}));
				}*/
			};

			// Create a Timeline
			var graph = new vis.Timeline(container, items, groups, options);
			anchor_point.data("timeline", graph);
			
			var sync_key = context.set_name + context.set_index;
			if(settings.Synchronized == "On") {
				
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
			
			// Populates metaDataItem global object whenever a user doubleclicks on the graph
		    graph.on('doubleClick', function(properties){
		        var firstChildItemOfTimeline = properties.event.firstTarget.firstChild;
		        try {
		            var firstChildId = firstChildItemOfTimeline.getAttribute("data-id");
		            items.forEach(function(data){
		                if(data['id'] == firstChildId){
		                    metaDataItem = data;
		                    return;
		                }
		            })
		        } catch(TypeError) {}
		    });
		};
	};
}
