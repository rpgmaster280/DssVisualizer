/* Copyright (C) 2017  Jamie Acosta, Robert McCain

This file is part of DssVisualizer.

DssVisualizer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

DssVisualizer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with DssVisualizer.  If not, see <http://www.gnu.org/licenses/>.
*/

var _plugin_namespace = {};
function getPluginNamespace() {
	return _plugin_namespace;
}

function Plugin(class_name, path) {
	
	this.class_name = class_name;
	this.path = path;
	this.isRunning = false;
	this.enabled = true;
	this.instance = null;
	
	this.load = function() {
		
		if(!this.isRunning) {
			
			$.holdReady(true);
			
			var script_handler = function(script, text_status) {
				//Called when loading dependency
				this.instance = new _plugin_namespace[this.class_name]();
				
				if(this.enabled) {
					this.instance.loadDependencies();
				}
				
				this.isRunning = true;
				$.holdReady(false);
			};
			$.getScript(this.path).done(script_handler.bind(this));
		}
	};
	
	this.run = function(anchor_point, data, settings, context) {
		if(this.enabled && this.isRunning) {
			this.instance.createInstance(anchor_point, data, settings, context);
		}
	};
	
	this.getSettings = function(){
		if(this.isRunning) {
			return this.instance.getSettings();
		}
		return null;
	};
	
	this.getType = function(){
		if(this.isRunning) {
			return this.instance.getType();
		}
		return null;
	};
	
	this.getDependencies = function(){
		if(this.isRunning) {
			return this.instance.getDependencies();
		}
		return null;
	};
	
	this.getDescription = function() {
		if(this.isRunning) {
			return this.instance.getDescription();
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
	
	this.getAll = function() {
		return this.plugins;
	};
	
	this.del = function(name) {
		delete this.plugins[name];
	};
	
	this.loadAllPlugins = function(){
		for(var i in this.plugins) {
			this.plugins[i].load();
		} 
	};
	
	this.getActiveRenderers = function() {
		var list_to_return = [];
		
		for(var i in this.plugins) {
			if (this.plugins[i].getType() == "Renderer" &&
					this.plugins[i].enabled &&
					this.plugins[i].isRunning) {
				list_to_return.push(this.plugins[i]);
			}
		}
		
		return list_to_return;
	};
	
	this.saveSettings = function() {
		localStorage.setItem("plugin-settings", this.serialize());
	};
	
	this.loadSettings = function() {
		var old_settings = localStorage.getItem("plugin-settings");
		
		if(old_settings == null) {
			return;
		}
		
		old_settings = JSON.parse(old_settings);
		
		//If we find any matches, set enabled state based on previous state
		for(var name in this.plugins) {
			if(old_settings.plugins[name] != null) {
				this.plugins[name].enabled = old_settings.plugins[name].enabled;
			}
		}
	};
	
	this.serialize = function(){
		return JSON.stringify(this);
	};
}

var _pluginManager = new PluginManager();
function getPluginManager() {
	return _pluginManager;
}

var connection = getDssConnectionSingleton();

//Sync request is required here.
var response = connection.sendRequest(new GetAllPluginsRequest(), false);

if(response.success) {
	for(var i in response.data) {
		var plugin_name = response.data[i]["class_name"];
		var path = response.data[i]["path"];
		var plugin = new Plugin(plugin_name, path);
		_pluginManager.add(plugin);
	}
}
_pluginManager.loadSettings();
_pluginManager.loadAllPlugins();
