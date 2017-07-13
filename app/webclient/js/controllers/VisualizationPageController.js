
function NotifyUser(response) {
		
		var alert_type = response.success ? "alert-success" : "alert-danger";
		var am = new AlertManager();
		am.generateAlert(alert_type, response.message);
}

$("document").ready(function(){
	$("#menu_bar").load("views/MenuBarView.html");
	$("#collection_selector").load("views/CollectionSelectorView.html");
	$("#collection_management").load("views/CollectionManagementView.html");
	
	var conn = getDssConnectionSingleton();
	
	conn.registerHandler(new ResponseHandler("DSS_ADD_DB", false, NotifyUser));
	conn.registerHandler(new ResponseHandler("DSS_RM_DB", false, NotifyUser));
	conn.registerHandler(new ResponseHandler("DSS_UPLOAD_FILE", false, NotifyUser));
});