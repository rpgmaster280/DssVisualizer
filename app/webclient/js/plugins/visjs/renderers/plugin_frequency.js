

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

		//Settings currently ignored because the graph currently only supports one table
		this.getSettings = function() {
			return {
				"Sources": "Options(Traffic Throughput)",
				"SyncKey" : "String"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var container = anchor_point.get(0);
			var throughput_data = data["traffic_throughput"];
			var dataset = new vis.DataSet(throughput_data);
		  
			// get data start and end date
			startDate = dataset.min('x')['x'];
			endDate = dataset.max('x')['x'];
			var anHour = 1000 * 60 * 60;
			startDate = JSONDatetoMillis(startDate) - anHour;
			endDate = JSONDatetoMillis(endDate) + anHour;
			maxZoom = endDate - startDate;

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
				showMinorLabels: false,
				showMajorLabels: false,
				dataAxis: {visible: false}
			};
			
			// Create a frequency graph
			var graph = new vis.Graph2d(container, dataset, options);
			anchor_point.data("frequency", graph);
			
			if(settings.SyncKey != null && settings.SyncKey != "") {
				var table = context.collection_name;
				var synchronizer = getGraphSynchronizer();
				synchronizer.add_graph(table, settings.SyncKey, graph);
				graph.on("rangechanged", function(properties){
					var windowRangeStart = properties.start;
					var windowRangeEnd = properties.end;
					var synchronizer = getGraphSynchronizer();
					var graphs = synchronizer.get_graphs(table, this.key);
					
					for (var i in graphs) {
						var graph = graphs[i];
						graph.setWindow(windowRangeStart,windowRangeEnd);
					}
				}.bind({"key" : settings.SyncKey}));
			}
		};
	}
}


