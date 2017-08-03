
var GraphSynchronizer;
var getGraphSynchronizer;
var _graph_sync;

var namespace = getPluginNamespace();

if (namespace["Sync"] == null) {
	namespace.Sync = function Sync(){
		
		this.loadDependencies = function(){
			
			GraphSynchronizer = function GraphSynchronizer() {
				this.sync_tables = {};
				
				this.add_graph = function(table_id, sync_key, graph) {
					if(this.sync_tables[table_id] == null) {
						this.sync_tables[table_id] = {};
					}
					
					if(this.sync_tables[table_id][sync_key] == null) {
						this.sync_tables[table_id][sync_key] = [];
					}
					
					this.sync_tables[table_id][sync_key].push(graph);
				};
				
				this.get_graphs = function(table_id, sync_key) {
					if(this.sync_tables[table_id] != null) {
						return this.sync_tables[table_id][sync_key];
					}
					return null;
				};
				
				this.delete_table = function(table_id) {
					if(this.sync_tables[table_id] != null) {
						delete this.sync_tables[table_id];
					}
				};
			};

			_graph_sync = new GraphSynchronizer();
			getGraphSynchronizer = function getGraphSynchronizer() {
				return _graph_sync;
			};

			//Need to free memory when a collection no longer exists.
			var manager = getCollectionManager();
			manager.registerHandler(new DssHandler("update", function(collection){
				_graph_sync.delete_table(collection.name);
			}));

			manager.registerHandler(new DssHandler("del", function(collection){
				_graph_sync.delete_table(collection.name);
			}));

		};
		
		this.getSettings = function() {
			return {};
		};
		
		this.getType = function(){
			return "Library";
		};
		
		this.getDependencies = function(){
			return "Standalone";
		};
		
		this.getDescription = function(){
			return "Helper library for synchronizing certain types of VisJS graphs.";
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {

		};
	};
}


