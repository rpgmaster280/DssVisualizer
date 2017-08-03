
var namespace = getPluginNamespace();

if (namespace["D3"] == null) {
	namespace.D3 = function D3(){
		
		this.loadDependencies = function(){
			
			$.holdReady(true);
			$.getScript('js/plugins/d3/d3.js').done(function(){
				$.holdReady(false);
			});
			
			$.holdReady(true);
			$.getScript('js/plugins/d3/d3pie.js').done(function(){
				$.holdReady(false);
			});
			
		};
		
		this.getType = function(){
			return "Library";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Data Driven Document (D3) is a JavaScript library for manipulating documents based on data.";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			alert("Do not create an instance of D3. This function is only for renderers");
		};
	};
}
