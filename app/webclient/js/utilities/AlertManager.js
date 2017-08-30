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

function AlertManager() {
	this.generateAlert = function (type, text) {
		var html = '<div class = "alert ' + type  +'"><a href="#" class="close" ' +
			'data-dismiss="alert" aria-label="close">&times;</a>' + text + '</div>';
		$("#alert_panel").html($("#alert_panel").html() + html);
		$("html, body").animate({
			scrollTop: $(".alert:last").offset().top - 100
		}, 1000);
	};
	
	this.clearAllAlerts = function () {
		$("#alert_panel").html("");
	}
}