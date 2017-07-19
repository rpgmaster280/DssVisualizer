
var namespace = getPluginNamespace();

if (namespace["TableDump"] == null) {
	namespace.TableDump = function TableDump(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			
			for(var i in data) {
				anchor_point.append($("<h1>").text("Table - " + i));
				for(var j in data[i]) {
					anchor_point.append($("<p>").text(JSON.stringify(data[i][j])));
				}
			}
			
			
		};
	};
}
