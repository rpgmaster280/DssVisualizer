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

var namespace = getPluginNamespace();

function computeHostsAndEdges(table) {

	var hosts = {};
	var edges = {};
	
	for(var i in table) {
		var packet_array = table[i].title.split("\n");
		for(var j in packet_array) {
			var packet_columns = packet_array[j].split(" ");
			
			//If we have IP information, extract it
			if(packet_columns.length >= 5) {

				var fromIP = packet_columns[4];
				var toIP = packet_columns[5];

				var ip_array = [fromIP, toIP];
				ip_array.sort();

				if(hosts[fromIP] == null) {
					hosts[fromIP] = {
						id: fromIP,
						label: fromIP
					};
				}

				if(hosts[toIP] == null) {
					hosts[toIP] = {
						id: toIP,
						label: toIP
					};
				}

				var edge_key = ip_array[0] + ":" + ip_array[1];
				
				if(edges[edge_key] == null) {
					edges[edge_key] = {
						from: fromIP,
						to: toIP
					}; 
				}
			}
		}		
	}

	var host_arr = [];
	for (var x in hosts) {
		host_arr.push(hosts[x]);
	}

	var edge_arr = [];
	for (var x in edges) {
		edge_arr.push(edges[x]);
	}

	return {"nodes" : host_arr, "edges" : edge_arr};
}

if (namespace["Connections"] == null) {
	namespace.Connections = function Connections(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "Visjs";
		};
		
		this.getDescription = function(){
			return "VisJS based network graphing utility. Shows which devices are communicating with one another.";
		};
		
		this.getSettings = function() {
			return {
				"Height" : "Integer"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			//Protocol_layers macA macB ipA ipB portA portB			
			var info = computeHostsAndEdges(data["traffic"]);

			var options = {
				layout: {
					improvedLayout: false,
				}
			};
		
			var container = anchor_point.get(0);

			var network = new vis.Network(container, info, options);	
			
			anchor_point.data("network", network);
			anchor_point.first().css("height", settings.Height + "px");
		};
	};
}
