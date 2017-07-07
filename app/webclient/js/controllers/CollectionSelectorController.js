
$("document").ready(function(){
	
	var manager = getCollectionManager();
	
	manager.registerHandler(new DssHandler("add", function(collection){
		var new_item = $("<li>").addClass("ui-widget-content").text(collection.name);
		new_item.click(collection.name, function(e){
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
		$("#selectable li:contains('" + name + "')").addClass("ui-selected").siblings().removeClass("ui-selected").each(
            function(key,value){
                $(value).find('*').removeClass("ui-selected");
            }
        );
	}));
	
	
	manager.add(new Collection("Default Collection"));
	manager.set("Default Collection");
});