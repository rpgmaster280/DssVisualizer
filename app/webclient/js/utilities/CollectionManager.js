
function Visualization(viz_type, settings) {
	this.viz_type = viz_type;
	this.settings = settings;
}

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
	
	this.insertData = function(data) {
		this.data = data;
	}
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
function getCollectionManager() {
	return _collectionManager;
}