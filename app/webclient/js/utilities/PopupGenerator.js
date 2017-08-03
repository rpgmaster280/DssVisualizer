
function PopupGenerator() {
	
	this.generateTextboxDialog = function(title, ok_label, callback) {
		swal({
			title: title,
			input: 'text',
			confirmButtonText: ok_label,
			showCancelButton: true
		}).then(callback);
	};
	
	this.generateConfirmDialog = function (title, text, callback) {
	    swal({
	        title: title,
	        text: text,
	        type: 'warning',
	        showCancelButton: true,
	        confirmButtonText: 'Delete',
	        confirmButtonColor: "#DD6B55"
	      }).then(callback);
	};
	
	this.generateAnnotationViewDialog = function(item, groupName, callback) {
		var title = item.start;
		var text = formatObjectForDisplay(item);
		var form = this.generateAnnotationEditForm(item);
		swal.setDefaults({
			confirmButtonText: 'Edit',
			showCancelButton: true,
			animation: false
		});
		var resultsFromForm = {};
		var steps = [
			{
				title: title,
				html: text,
				width: '700px'
			},
			{
				title: 'Editing: '+title,
				html: form,
				width: '90%',
				confirmButtonText: 'Submit',
				preConfirm: function(result) {
					return new Promise(function(resolve) {
						if (result) {
							var jsonResults = {
								"startDate": $('#editStartDate').val(),
								"startHours": $('#editStartHours').val(),
								"startMinutes": $('#editStartMinutes').val(),
								"startSeconds": $('#editStartSeconds').val(),
								"annotation": $('#editAnnotation').val()
							};
							Object.keys(item).forEach(function(key){
								if(arrayOfEditIncludedAttr.indexOf(key)>-1){
									jsonResults[key] = $('#edit'+key).val();
								}
							});
							resultsFromForm = jsonResults;
							resolve(jsonResults);
						}
					})
				}
			}
		];

		swal.queue(steps).then(function(ok){
	            var value = resultsFromForm;
	            var startHour = addLeadingZeroes(value['startHours']);
	            var startMinutes = addLeadingZeroes(value['startMinutes']);
	            var startSeconds = addLeadingZeroes(value['startSeconds']);
	            var startDateTime = value['startDate']+" "+startHour+":"+startMinutes+":"+startSeconds;
	            item['start'] = startDateTime;

	            urlString = "http://localhost?submission=edit&editType=edit&itemID="+item.id+"&type="+groupName+"&start="+startDateTime+"&className="+item['className']+"&dataType="+item['type'];
	            Object.keys(value).forEach(function(key){
	                if(key != 'startDate' && key != 'startHours' && key != 'startMinutes' && key != 'startSeconds'){
	                    urlString = urlString + "&"+key+"="+value[key]
	                    item[key] = value[key];
	                }
	            });
	            $.get(urlString);
	            callback(item);
		});
	};
	
	this.generateAnnotationEditForm = function(item) {
		
		var dateFormat = "yy-mm-dd";
		var itemDateTime = new Date(item['start'].replace(/-/g, "/").replace(/T/, " "));
		var itemDateString = itemDateTime.getFullYear()+"-"+(itemDateTime.getMonth()+1)+"-"+itemDateTime.getDate();
		var itemDate = new Date(itemDateString);
		var itemTimeHours = itemDateTime.getHours();
		var itemTimeMinutes = itemDateTime.getMinutes();
		var itemTimeSeconds = itemDateTime.getSeconds();
		
		var form = "<div style='border:none'>";
		form += "<label for='editStartDate'>Edit start date:</label>";
		form += "<input type='text' id='editStartDate' name='editStartDate' value='"+itemDateString+"'/>";
		form += "</div>";
		
		form += "<div style='border:none'>";
		form += "<label for='editStartHours'>Edit start time:</label>";
		form += "<input type='number' id='editStartHours' name='editStartHours' value='"+itemTimeHours+"' min='0' max='23'/>h ";
		form += "<input type='number' id='editStartMinutes' name='editStartMinutes' value='"+itemTimeMinutes+"' min='0' max='59'/>m ";
		form += "<input type='number' id='editStartSeconds' name='editStartSeconds' value='"+itemTimeSeconds+"' min='0' max='59'/>s";
		form += "</div>";
		
		//array of attributes included for editing.
		//start and annotations not included because they are handled separately
		var arrayOfEditIncludedAttr = ['content', 'title', 'comment'];

		Object.keys(item).forEach(function(key){
			if(arrayOfEditIncludedAttr.indexOf(key)>-1){
				form += "<div style='border:none'>";
				form += "<label for='edit"+key+"'>Edit "+key+":</label>";
				form += "<textarea id='edit"+key+"' name='edit"+key+"'>"+item[key]+"</textarea>";
				form += "</div>";
			}
		});
		form += "<div style='border:none'>";
		form += "<label for='editAnnotation'>Edit Annotation:</label>";
		if(item['annotation'] == null){
			form += "<textarea id='editAnnotation' name='editAnnotation'></textarea>";
		}
		else{
			form += "<textarea id='editAnnotation' name='editAnnotation'>"+item['annotation']+"</textarea>";
		}
		form += "</div>"; 
		
		$("#editStartDate").datepicker({dateFormat: 'yy-mm-dd'});
		
		return form;
	};
}

function formatObjectForDisplay(item){
	
	var container = $("<div>");
	var table = $("<table>").css("margin", "auto");
	container.append(table);
	
	Object.keys(item).forEach(function(key){
		
		var isImage = item['classname'] != null && item['classname'] == 'imgPoint';
		
		if(key != 'classname' && typeof item[key] !== 'object'){
			
			var row = $("<tr>");
			var key_cell = null;
			var value_cell = null;
			
			if(key == 'title' && isImage){
				
				key_cell = $("<td>").text(key);
				
				//Images should not be on the file system. They should be stored by the server.
				//Need to fix at a later point in time.
				var image = $("<img>").attr("src", "file:///" + item[key]);
				value_cell = $("<td>").text(item[key]).append($("<br>")).append(image);
			
			} else {
				
				key_cell = $("<td>").text(key);
				value_cell = $("<td>").text(item[key]);

			}
			
			key_cell.css("text-align", "left").css("border-style", "solid").css("border-width", "2px").css("border-color", "#ddd").css("padding", "5px");
			value_cell.css("text-align", "left").css("border-style", "solid").css("border-width", "2px").css("border-color", "#ddd").css("padding", "5px");
			row.append(key_cell).append(value_cell);
			table.append(row);
			
		}
	});

	return container.html();
}

function addLeadingZeroes(num){
	if(num<10){
		return "0"+num;
	}
	else{
		return num;
	}
}

