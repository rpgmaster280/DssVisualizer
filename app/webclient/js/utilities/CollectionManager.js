
function Visualization(viz_type, settings) {
	this.viz_type = viz_type;
	this.settings = settings;
}

var counterz = 0;
function Set(name, db_name, event_name, tech_names, start_date, end_date) {
	
	this.name = name;
	this.db_name = db_name;
	this.event_name = event_name;
	this.tech_names = tech_names;
	this.start_date = start_date;
	this.end_date = end_date;
	this.data = {};
	
	this.visualizations = [];
	
	this.add = function(visualization) {
		this.visualizations.push(visualization);
	};
	
	this.getAll = function(){
		return this.visualizations;
	};
	
	this.del = function(index) {
		delete this.visualizations[index];
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
	this.sets = [];
	
	this.add = function(set) {
		this.sets.push(set);
	}
	
	this.update = function(index, set) {
		this.sets[index] = set;
	}
	
	this.del = function(index) {
		delete this.sets[index];
		var tmp = this.sets;
		this.sets = [];
		for (var i in tmp) {
			if(tmp[i] != null) {
				this.sets.push(tmp[i]);
			}
		}
	}
	
	this.get = function(index) {
		return this.sets[index];
	}
	
	this.getAll = function() {
		return this.sets;
	};
	
	this.size = function() {
		return this.sets.length;
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
	
	//Complex because query information cannot be saved to disk (too much memory).
	//Need to create the structure without saving any database information.
	this.save = function() {
		var cloned_manager = new CollectionManager();
		cloned_manager.active_collection = this.active_collection;
		for(var i in this.collections) {
			var old_collection = this.collections[i];
			var new_collection = new Collection(old_collection.name);
			
			for(var j in old_collection.sets) {
				var old_set = old_collection.sets[j];
				var new_set = new Set(
						old_set.name,
						old_set.db_name,
						old_set.event_name,
						old_set.tech_names,
						old_set.start_date,
						old_set.end_date
				);
				new_set.visualizations = old_set.visualizations;
				new_collection.add(new_set);
			}
			
			cloned_manager.add(new_collection);
		}
		
		var dataset_as_string = JSON.stringify(cloned_manager);
		localStorage.setItem("temporary-workspace", dataset_as_string);
	};
	
	this.load = function(){
		
		if(localStorage.getItem("temporary-workspace") === null) {
			return;
		}
		
		var old_instance = JSON.parse(localStorage.getItem("temporary-workspace"));
		
		//Remove old collections and notify event handlers
		for(var i in this.collections) {
			this._del(this.collections[i].name);
		}

		var promise_array = [];
		for(var i in old_instance.collections) {
			var current_collection_data = old_instance.collections[i];
			var current_collection = new Collection(current_collection_data.name);
			
			for(var j in current_collection_data.sets){
				var current_set_data = current_collection_data.sets[j];
				var current_set = new Set(
					current_set_data.name,
					current_set_data.db_name,
					current_set_data.event_name,
					current_set_data.tech_names,
					current_set_data.start_date,
					current_set_data.end_date
				);
				
				current_set.visualizations = current_set_data.visualizations;
				current_collection.add(current_set);
				
				promise_array.push(current_set.loadData());
			}
			this.add(current_collection);
		}
		
		Promise.all(promise_array).then(function(allData){
			getCollectionManager().set(old_instance.active_collection);
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
}

_collectionManager = new CollectionManager();
_collectionManager.registerHandler(new DssHandler("update", function(collection){
	_collectionManager.save();
}));


function getCollectionManager() {
	return _collectionManager;
}