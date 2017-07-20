
function JSONDatetoMillis(date){
	var theDate = date.split(/-|:| /);
	
	var d = new Date(theDate[0],theDate[1]-1,theDate[2],theDate[3],theDate[4],theDate[5]);
	return d.getTime();
}

var namespace = getPluginNamespace();

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
		
		this.getSettings = function() {
			return {
				"Sources": "MultiOptions(Clicks, Keypresses, Timed Screenshots, Manual Screenshots, Traffic)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			
			if(settings["Sources"] == null) {
				throw "No data sources were selected";
			}
			
			var source_map = {
				"Clicks" : "clicks",
				"Keypresses" : "keypresses",
				"TimedScreenshots" : "timed_screenshots",
				"ManualScreenshots" : "manual_screenshots",
				"Traffic" : "traffic"
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
				database_table.forEach(function(obj){ obj['group'] = (i + "");});
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
				editable: true,
				stack: false
			};

			// Create a Timeline
			anchor_point.data("timeline", new vis.Timeline(container, items, groups, options));
		};
	};
}