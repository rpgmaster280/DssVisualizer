
var namespace = getPluginNamespace();

if (namespace["HorizontalRule"] == null) {
	namespace.HorizontalRule = function HorizontalRule(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {

			anchor_point.append($("<hr>"));
		};
	};
}
