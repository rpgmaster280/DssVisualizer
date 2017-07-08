
var namespace = getPluginNamespace();

if (namespace["D3"] == null) {
	namespace.D3 = function D3(){
		
		this.loadDependencies = function(){
			
			$.holdReady(true);
			
			$.getScript('js/plugins/d3/d3.js').done(function(){
				$.holdReady(false);
			});
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			alert("Do not create an instance of D3. This function is only for renderers");
		};
	};
}
