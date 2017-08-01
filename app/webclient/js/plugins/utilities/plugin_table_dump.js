
var namespace = getPluginNamespace();

if (namespace["TableDump"] == null) {
	namespace.TableDump = function TableDump(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var textarea = $("<textarea>").attr("rows", 30).css("overflow-y", "auto").css("width", "100%");
			
			for(var i in data) {
				var table_name = "Table - " + i;
				textarea.text(textarea.text() + table_name + "\n\n");
				for(var j in data[i]) {
					var row = data[i][j];
					textarea.text(textarea.text() + JSON.stringify(row) + "\n");
				}
				textarea.text(textarea.text() + "\n");
			}
			
			anchor_point.append(textarea);	
		};
	};
}
