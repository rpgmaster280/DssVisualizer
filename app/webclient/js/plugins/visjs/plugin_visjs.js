
var namespace = getPluginNamespace();

if (namespace["VisJS"] == null) {
	namespace.VisJS = function VisJS(){
		
		this.loadDependencies = function(){
			//alert("Loading depedencies of class 1");
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
		
		this.createInstance = function(anchor_point, data) {
			alert("Do not create an instance of VisJS. This function is only for renderers");
		};
	};
}
