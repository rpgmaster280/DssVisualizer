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

$("document").ready(function(){
	
	var manager = getCollectionManager();
	
	manager.registerHandler(new DssHandler("add", function(collection){
		var new_item = $("<li>").addClass("ui-widget-content").text(collection.name);
		new_item.click(collection.name, function(e){
			var manager = getCollectionManager();
			manager.set(e.data);
		});
		$("#selectable").append(new_item);
	}));
	
	manager.registerHandler(new DssHandler("del", function(collection){
		var name = collection.name;
		$("#selectable li:contains('" + name + "')").remove();
	}));
	
	manager.registerHandler(new DssHandler("set", function(collection){
		var name = collection.name;
		$("#selectable li:contains('" + name + "')").addClass("ui-selected").siblings().removeClass("ui-selected");
	}));
	
	manager.load();
	
	if(manager.size() == 0){
		manager.reset();
	}
});