
var namespace = getPluginNamespace();

if (namespace["HelloWorld"] == null) {
	namespace.HelloWorld = function HelloWorld(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getSettings = function() {
			return {"Name": "String", "Count": "Integer", "Color": "Options(Red, Green, Blue)"};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			for(var i = 0; i < settings.Count; i++)
				anchor_point.append("<p style=\"color:" + settings.Color + "\">Hello, " + settings.Name + "</p>");
		};
	};
}
