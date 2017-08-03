

$("document").ready(function(){
	
	var tableGenerator = new TableGenerator();
	var manager = getPluginManager();
	
	$.each(manager.getAll(), function(key, value){
		
		var isEnabledStr = value.enabled ? "true" : "false";
		var row_values = [
			key,
			value.getDescription(),
			value.getType(),
			value.getDependencies(),
			isEnabledStr,
		];
		
		tableGenerator.addRow(row_values, value,
			function(event){
				value.enabled = !value.enabled;
				var isEnabledStr = value.enabled ? "true" : "false";
				var color = value.enabled ? "green" : "red";
				$(this).find("td:eq(4)").css("color", color).text(isEnabledStr);
				manager.saveSettings();
		});
	});
	$("tr").each(function(key,value){
		$(this).find("td:eq(4):contains(true)").css("color", "green");
		$(this).find("td:eq(4):contains(false)").css("color", "red");
	});
	
	
	tableGenerator.setTableMaxSize(15);
	tableGenerator.setCurrentPage(0);
	
});