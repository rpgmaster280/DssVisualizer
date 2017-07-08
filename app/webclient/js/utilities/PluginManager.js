

var _plugin_namespace = {};
function getPluginNamespace() {
	return _plugin_namespace;
}

function Plugin(class_name, path, type, depends_on) {
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
				this.instance = new _plugin_namespace[this.class_name]();
				this.instance.loadDependencies();
				this.isRunning = true;
				$.holdReady(false);
			};
			
			$.getScript(this.path).done(script_handler.bind(this));
		}
	};
	this.run = function(anchor_point, data, settings) {
		if(this.enabled && this.isRunning) {
			this.instance.createInstance(anchor_point, data, settings);
		}
	};
	this.getSettings = function(){
		if(this.enabled && this.isRunning) {
			return this.instance.getSettings();
		}
		return null;
	};
}

function PluginManager() {
	this.plugins = {};
	
	this.add = function(plugin) {
		if(this.plugins[plugin.class_name] == null) {
			this.plugins[plugin.class_name] = plugin;
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
	
	this.getActiveRenderers = function() {
		var list_to_return = [];
		
		for(var i in this.plugins) {
			if (this.plugins[i].type == "Renderer" &&
					this.plugins[i].enabled &&
					this.plugins[i].isRunning) {
				list_to_return.push(this.plugins[i]);
			}
		}
		
		return list_to_return;
	};
}

var _pluginManager = new PluginManager();
function getPluginManager() {
	return _pluginManager;
}

var visjs = new Plugin("VisJS", "js/plugins/visjs/plugin_visjs.js", "Library", "");
var d3 = new Plugin("D3", "js/plugins/d3/plugin_d3.js", "Library", "");
var hello_world = new Plugin("HelloWorld", "js/plugins/visjs/renderers/plugin_hello_world.js", "Renderer", "VisJS");
_pluginManager.add(visjs);
_pluginManager.add(d3);
_pluginManager.add(hello_world);
_pluginManager.loadAll();

