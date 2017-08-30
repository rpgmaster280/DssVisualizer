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

function comparer(index) {
	return function(a, b) {
		var valA = getCellValue(a, index), valB = getCellValue(b, index);
		var numericalComparison = $.isNumeric(valA) && $.isNumeric(valB);
		return numericalComparison ? valA - valB : valA.localeCompare(valB);
	};
}

function getCellValue(row, index) {
	//Get the contents of a cell within the specified column.
	var current = $(row).children('td').eq(index);
	return current.text();
}

function TableGenerator() {
	
	this.current_page = 0;
	this.max_size = 15;
	this.sorted_column = -1;
	this.is_ascending = true;
	
	this.resetTableIndices = function () {
		this.current_page = 0;
		this.max_size = 15;
		this.sorted_column = -1;
		this.is_ascending = true;
	};
	
	this.generatePagePulldown = function() {
		var rows = this.computeMaxPages();
		$(".pagenum").html("");
		$(".pagenum").change(this, function(event){
			var val = $(this).val() - 1;
			event.data.setCurrentPage(val);
		});
		
		if(rows <= 0) {
			var option = $("<option>").attr("value", 1);
			option.text("1");
			$(".pagenum").append(option);
		} else {
			for(var i = 0; i < rows; i++) {
				var tmp = i + 1;
				var option = $("<option>").attr("value", tmp);
				option.text(tmp);
				$(".pagenum").append(option);
			}
		}
	}
	
	this.setTableMaxSize = function (size) {
		this.max_size = size;
		this.generatePagePulldown();
		this.refreshTable();
	};
	
	this.setCurrentPage = function (page) {
		this.current_page = page;
		$(".pagnum").val(page + 1);
		this.refreshTable();
	};
	
	this.computeMaxPages = function () {
		var row_count = $("tbody > tr").size();
		return Math.ceil(row_count / this.max_size);
	};
	
	this.refreshTable = function () {
		var left_index = this.max_size * this.current_page;
		var right_index = left_index + this.max_size - 1;
		var tbody = $(".sortable-table > tbody");
		tbody.find("tr").show();
		tbody.find("tr:gt(" + right_index + ")").hide();
		tbody.find("tr:lt(" + left_index + ")").hide();
	};
	
	this.nextPage = function () {
		if(this.current_page < this.computeMaxPages() - 1) {
			this.current_page++;
		}
		this.setCurrentPage(this.current_page);
	};
	
	this.previousPage = function() {
		if(this.current_page > 0) {
			this.current_page--;
		}
		this.setCurrentPage(this.current_page);
	};
	
	this.addRow = function(cells, rowValue, rowHandler) {
		var row = $("<tr>");
				
		$.each(cells, function(k,v){
			var newCell = $("<td>").text(v);
			row.append(newCell);
		});
		
		if(rowHandler != null) {
			row.click(rowValue, rowHandler);
		}
				
		$("tbody").append(row);
	};
	
	$('.sortable-column').click(this, function(event){
		var table = $(".sortable-table");
		var tbody = table.find("tbody");
		var rows = tbody.find("tr").toArray();
		var index = $(this).index();
		
		if(index === event.data.sorted_column) {
			event.data.is_ascending = !event.data.is_ascending;
		} else {
			event.data.is_ascending = true;
		}
		event.data.sorted_column = index;
		
		rows = rows.sort(comparer(index));
		
		if (!event.data.is_ascending) { rows = rows.reverse(); }
		
		$("tr", tbody).detach();
		for(var i = 0; i < rows.length; i++) { 
			tbody.append(rows[i]);
		}
		event.data.refreshTable();
	});
		
	$('.pagesize').change(this, function(event){
		var val = $(this).val();
		event.data.setTableMaxSize(parseInt(val));
		event.data.setCurrentPage(0);
	});

	$(".first").click(this, function(event){ event.data.setCurrentPage(0); });
	
	$(".last").click(this, function(event) { 
		event.data.setCurrentPage(event.data.computeMaxPages() - 1);
	});
	
	$(".next").click(this, function(event){
		event.data.nextPage();
	});
	
	$(".prev").click(this, function(event){
		event.data.previousPage();
	});
}


