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

var counterz = 0;
function Visualization(name, db_name, event_name, tech_names, start_date, end_date, viz_type, settings) {
	
	this.name = name;
	this.db_name = db_name;
	this.event_name = event_name;
	this.tech_names = tech_names;
	this.start_date = start_date;
	this.end_date = end_date;
	this.data = {};
	
	this.viz_type = viz_type;
	this.settings = settings;
	
	this.getType = function() {
		return this.viz_type;
	};
	
	this.getSettings = function() {
		return this.settings;
	};
	
	this.loadData = function() {
		
		return new Promise(function(resolve, reject){
			
			var conn = getDssConnectionSingleton();
			var request = new GetDataRequest(
					this.db_name, 
					this.tech_names, 
					this.event_name, 
					this.start_date, 
					this.end_date
			);
			
			var response = conn.sendRequest(request, false);
			
			if(response.success) {
				this.data = response.data;
				resolve(null);
			} else {
				reject(null);
			}
			
		}.bind(this));
		
	};
	
	this.size = function() {
		return this.data.length;
	};
}

function Collection(name){
	this.name = name;
	this.visualizations = [];
	
	this.add = function(viz) {
		this.visualizations.push(viz);
	}
	
	this.update = function(index, viz) {
		this.visualizations[index] = viz;
	}
	
	this.del = function(index) {
		delete this.visualizations[index];
		var tmp = this.visualizations;
		this.visualizations = [];
		for (var i in tmp) {
			if(tmp[i] != null) {
				this.visualizations.push(tmp[i]);
			}
		}
	}
	
	this.get = function(index) {
		return this.visualizations[index];
	}
	
	this.getAll = function() {
		return this.visualizations;
	};
	
	this.size = function() {
		return this.visualizations.length;
	}
}

function DssHandler(name, operation) {
	this.name = name;
	this.operation = operation;
}

function CollectionManager(){
		
	this.handlers = new Array();
		
	this.registerHandler = function(handler) {
		this.handlers.push(handler);
	};

	this.active_collection = "";
	this.collections = {};
	
	this._handle = function(type, collection) {
		
		if(collection == null) {
			return;
		}
		
		for(var i = 0; i < this.handlers.length; i++) {
			if(this.handlers[i].name == type) {
				this.handlers[i].operation(collection);
			}
		}
	};
	
	this.add = function(collection){
		if(!(collection.name in this.collections)) {
			this.collections[collection.name] = collection;
			this._handle("add", this.collections[collection.name]);
		}
	};
	
	this.set = function(name) {
		if(name in this.collections) {
			this.active_collection = name;
			this._handle("set", this.collections[name]);
		}
	};
	
	this.save = function() {
		localStorage.setItem("temporary-workspace", this.serialize());
	};
	
	this.load = function(){
		
		if(localStorage.getItem("temporary-workspace") === null) {
			return;
		}
		
		var old_instance = JSON.parse(localStorage.getItem("temporary-workspace"));
		this.loadFromJSON(old_instance);
	};
	
	this.loadFromJSON = function(json) {
		//Remove old collections and notify event handlers
		this._reset();

		var promise_array = [];
		for(var i in json.collections) {
			var current_collection_data = json.collections[i];
			var current_collection = new Collection(current_collection_data.name);
			
			for(var j in current_collection_data.visualizations){
				var current_viz_data = current_collection_data.visualizations[j];
				var current_viz = new Visualization(
					current_viz_data.name,
					current_viz_data.db_name,
					current_viz_data.event_name,
					current_viz_data.tech_names,
					current_viz_data.start_date,
					current_viz_data.end_date,
					current_viz_data.viz_type,
					current_viz_data.settings
				);
				
				current_collection.add(current_viz);
				promise_array.push(current_viz.loadData());
			}
			this.add(current_collection);
		}
		
		return Promise.all(promise_array).then(function(allData){
			getCollectionManager().set(json.active_collection);
		});
	};
	
	this.get = function(name) {
		if(name in this.collections) {
			var collection = this.collections[name];
			this._handle("get", collection);
			return collection;
		}
		return null;
	};
	
	this.getAll = function() {
		return this.collections;
	};
	
	this.getCurrent = function() {
		return this.get(this.active_collection);
	};
	
	this.del = function(name){
		
		//Must have at least 1 collection
		if(this.size() <= 1) {
			return;
		}
		
		this._del(name);
	};
	
	this._del = function(name){
		
		if(name in this.collections) {
			var collection = this.collections[name];
			delete this.collections[name];
			
			if(this.active_collection == name) {
				var keys = Object.keys(this.collections);
				this.set(keys[0]);
			}
			
			this._handle("del", collection);
		}
	};
	
	this.contains = function(name) {
		return name in this.collections;
	};
	
	this.size = function() {
		return Object.keys(this.collections).length;
	};
	
	this.update = function() {
		this._handle("update", this.getCurrent());
	};
	
	this._reset = function() {
		for(var i in this.collections) {
			this._del(this.collections[i].name);
		}
	};
	
	this.reset = function () {
		this._reset();
		this.add(new Collection("Default Collection"));
		this.set("Default Collection");
		this.save();
	};
	
	this.serialize = function() {
		var cloned_manager = new CollectionManager();
		cloned_manager.active_collection = this.active_collection;
		for(var i in this.collections) {
			var old_collection = this.collections[i];
			var new_collection = new Collection(old_collection.name);
			
			for(var j in old_collection.visualizations) {
				var old_viz = old_collection.visualizations[j];
				var new_viz = new Visualization(
						old_viz.name,
						old_viz.db_name,
						old_viz.event_name,
						old_viz.tech_names,
						old_viz.start_date,
						old_viz.end_date,
						old_viz.viz_type,
						old_viz.settings
				);
				new_collection.add(new_viz);
			}
			
			cloned_manager.add(new_collection);
		}
		
		return JSON.stringify(cloned_manager)
	};
}

_collectionManager = new CollectionManager();
function getCollectionManager() {
	return _collectionManager;
}