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


