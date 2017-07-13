
var can_enable = false;
var file_contents = {};

$("document").ready(function(){
	
	var conn = getDssConnectionSingleton();
	conn.registerHandler(new ResponseHandler("DSS_LS_DB", true, function(response) {
		
		if(response.success) {
			var databases = response.data;
			var formBuilder = new FormBuilder();
			
			if(databases.length > 0) {
				can_enable = true;
			} else {
				databases.push("No databases present in the system.");
			}
			
			var db_names = formBuilder.generateSelectField("db_name", databases);
			$("#db_options").html("");
			$("#db_options").append(db_names);
		}
		
	}));
	
	conn.sendRequest(new GetAllDatabasesRequest(), true);

	$("#submitButton").click(function(){
		
		if($("#submitButton").hasClass("disabled")) {
			return;
		}
		
		var settings = $("#fileUploadForm").serializeArray();
		var settings_as_map = {};
		
		for(var i in settings) {
			var setting = settings[i];
			settings_as_map[setting.name] = setting.value;
		}
		
		var request = new FileUploadRequest(
				settings_as_map["db_name"],
				settings_as_map["tech_name"],
				settings_as_map["event_name"],
				btoa(file_contents)
		);
		
		conn.sendRequest(request, true);
		$("#dssModal").modal('hide');
	});
	
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
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].clicks_id != null) {
				$("#fileFeedback").text("Click data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].timed_id != null) {
				$("#fileFeedback").text("Timed screenshot data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_all_id != null) {
				$("#fileFeedback").text("Traffic data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else if (obj[0].traffic_xy_id != null) {
				$("#fileFeedback").text("Traffic throughput data selected.");
				if(can_enable) $("#submitButton").removeClass("disabled");
			} else {
				$("#fileFeedback").text("File type not supported.");
				$("#submitButton").addClass("disabled");
			}
			
			file_contents = reader.result;
		};

		reader.readAsText(file);
		
	});
});