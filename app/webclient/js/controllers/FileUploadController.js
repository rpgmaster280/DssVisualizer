
$("document").ready(function(){
	
	var fileInput = document.getElementById('fileInput');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];


		var reader = new FileReader();

		reader.onload = function(e) {
			
			var obj = null;
			
			try {
				obj = JSON.parse(reader.result);
			} catch (e) {
				$("#fileFeedback").text("File type not supported.");
				$("#submitButton").addClass("disabled");
				return;
			}
			
			if (obj[0].keypresses_id != null) {
				$("#fileFeedback").text("Keypress data selected.");
				$("#submitButton").removeClass("disabled");
			} else if (obj[0].clicks_id != null) {
				$("#fileFeedback").text("Click data selected.");
				$("#submitButton").removeClass("disabled");
			} else if (obj[0].timed_id != null) {
				$("#fileFeedback").text("Timed screenshot data selected.");
				$("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_all_id != null) {
				$("#fileFeedback").text("Traffic data selected.");
				$("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_xy_id != null) {
				$("#fileFeedback").text("Traffic throughput data selected.");
				$("#submitButton").removeClass("disabled");
			} else {
				$("#fileFeedback").text("File type not supported.");
				$("#submitButton").addClass("disabled");
			}
		}

		reader.readAsText(file);	
		
		$("#submitButton").click(function(){
			
			if($("#submitButton").hasClass("disabled")) {
				return;
			}
			
			alert("Triggered");
		})
	});
});