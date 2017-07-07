/**
 * 
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