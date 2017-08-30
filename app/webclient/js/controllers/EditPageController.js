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

function NotifyUser(response) {
		
		var alert_type = response.success ? "alert-success" : "alert-danger";
		var am = new AlertManager();
		am.generateAlert(alert_type, response.message);
}

$("document").ready(function(){
	$("#menu_bar").load("views/MenuBarView.html");
	$("#collection_selector").load("views/CollectionSelectorView.html");
	$("#view_placeholder").load("views/CollectionManagementView.html");
	
	var conn = getDssConnectionSingleton();
	
	conn.registerHandler(new ResponseHandler("DSS_ADD_DB", false, NotifyUser));
	conn.registerHandler(new ResponseHandler("DSS_RM_DB", false, NotifyUser));
	conn.registerHandler(new ResponseHandler("DSS_UPLOAD_FILE", false, NotifyUser));
});