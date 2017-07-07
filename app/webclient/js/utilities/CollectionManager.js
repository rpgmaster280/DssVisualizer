
function Visualization() {
	this.settings = [];
}

function Set(name) {
	this.name = name;
	this.visualizations = [];
	
	this.add = function(visualization) {
		this.visualizations.push(visualization);
	};
	
	this.del = function(index) {
		delete this.visualizations[index];
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
	}
	
	this.getAll = function() {
		return this.sets;
	};
	
	this.add(new Set("Default Set"));
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
		if(name in this.collections) {
			var collection = this.collections[name];
			delete this.collections[name];
			this._handle("del", collection);
			
			if(this.size() == 0) {
				this.add(new Collection("Default Collection"));
				this.set("Default Collection");
			} else {
				var keys = Object.keys(this.collections);
				this.set(keys[0]);
			}
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