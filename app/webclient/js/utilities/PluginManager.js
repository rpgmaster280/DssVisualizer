

var _plugin_namespace = {};
function getPluginNamespace() {
	return _plugin_namespace;
}

function Plugin(name, class_name, path, type, depends_on) {
	this.name = name;
	this.class_name = class_name;
	this.path = path;
	this.type = type;
	this.isRunning = false;
	this.depends_on = depends_on;
	this.enabled = true;
	this.instance = null;
	this.load = function() {
		if(this.enabled && !this.isRunning) {
			
			$.holdReady(true);
			
			var script_handler = function(script, text_status) {
				//Called when loading dependency
				this.instance = new _plugin_namespace[class_name]();
				this.instance.loadDependencies();
				this.isRunning = true;
				$.holdReady(false);
			};
			
			$.getScript(this.path).done(script_handler.bind(this));
		}
	};
	this.run = function(anchor_point, data) {
		if(this.enabled && this.isRunning) {
			this.instance.createInstance(anchor_point, data);
		}
	};
	
}

function PluginManager() {
	this.plugins = {};
	
	this.add = function(plugin) {
		if(this.plugins[plugin.name] == null) {
			this.plugins[plugin.name] = plugin;
		}
	};
	
	this.get = function(name) {
		return this.plugins[name];
	};
	
	this.del = function(name) {
		delete this.plugins[name];
	};
	
	this.loadAll = function(){
		for(var i in this.plugins) {
			this.plugins[i].load();
		} 
	};
}

var _pluginManager = new PluginManager();
function getPluginManager() {
	return _pluginManager;
}

var visjs = new Plugin("VisJS", "VisJS", "js/plugins/visjs/plugin_visjs.js", "Library", "");
_pluginManager.add(visjs);
_pluginManager.loadAll();

