
var namespace = getPluginNamespace();

if (namespace["VisJS"] == null) {
	namespace.VisJS = function VisJS(){
		
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
		
		this.getSettings = function() {
			return {};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			alert("Do not create an instance of VisJS. This function is only for renderers");
		};
	};
}
