
$("document").ready(function(){

	$("#submitButton").click( function(){
		var conn = getDssConnectionSingleton();
		var db_name = $("#db_name").val();
		var request = new AddDatabaseRequest(db_name);
		conn.sendRequest(request, true);
		$("#dssModal").modal('hide');
	}); //end click
	
});