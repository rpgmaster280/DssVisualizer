
var namespace = getPluginNamespace();

if (namespace["Visjs"] == null) {
	namespace.Visjs = function Visjs(){
		
		this.loadDependencies = function(){
			
			$.holdReady(true);
			
			$('<link>')
			  .appendTo('head')
			  .attr({
			      type: 'text/css', 
			      rel: 'stylesheet',
			      href: 'js/plugins/visjs/vis.css'
			 });
			
			$.getScript('js/plugins/visjs/vis.js').done(function(){
				$.holdReady(false);
			});
		};
		
		this.getType = function(){
			return "Library";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			alert("Do not create an instance of VisJS. This function is only for renderers");
		};
	};
}
