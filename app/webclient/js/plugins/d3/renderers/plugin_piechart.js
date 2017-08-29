

function to_title(label) {
	 
	if(label == "layer_2") {
		return "Data Link Layer Traffic Frequency"
	} else if(label == "layer_3") {
		return "Network Layer Traffic Frequency"
	} else if(label == "layer_4") {
		return "Transport Layer Traffic Frequency"
	} else if(label == "layer_5") {
		return "Application Layer Traffic Frequency"
	}
}

function compute_categories(traffic){
	
	var counts = {
			"layer_3" : {},
			"layer_4" : {},
			"layer_5" : {}
	};
	
	for(var i in traffic) {

		//Checks to see if the data point is not an annotation.
		if (traffic[i].title == null) {
			continue;
		}

		var row = traffic[i].title;
		var tokenized = row.split("\n");
		
		for(var j in tokenized){
			var layers = tokenized[j].split(" ")[0].split(":");
			
			var layer_3 = layers[2];
			var layer_4 = layers[3];
			var layer_5 = layers[4];
			
			var layers = {
					"layer_3" : layer_3,
					"layer_4" : layer_4,
					"layer_5" : layer_5
			}
			
			for(var layer in layers) {
				var layer_value = layers[layer];
				
				if(layer_value != undefined) {
					if(counts[layer][layer_value] == null) {
						counts[layer][layer_value] = 1;
					} else {
						counts[layer][layer_value] = counts[layer][layer_value] + 1;
					}
				}
			}
		}
	}
	
	return counts;
}

function JSONDatetoMillis(date){
	var theDate = date.split(/-|:| /);
	var d = new Date(theDate[0],theDate[1]-1,theDate[2],theDate[3],theDate[4],theDate[5]);
	return d.getTime();
}

var namespace = getPluginNamespace();
var _pie_counter = 0;

if (namespace["Piechart"] == null) {
	namespace.Piechart = function Piechart(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getType = function(){
			return "Renderer";
		};
		
		this.getDependencies = function(){
			return "D3";
		};
		
		this.getDescription = function(){
			return "D3 based pie chart graphing utility.";
		};

		this.getSettings = function() {
			return {
				"Type": "MultiOptions(layer_3,layer_4,layer_5)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var computed_categories = compute_categories(data["traffic"]);
			var processed_categories = {
					"layer_3" : [],
					"layer_4" : [],
					"layer_5" : []
			};
			
			var color_wheel = [
				"#2484c1",
				"#0c6197",
				"#4daa4b",
				"#90c469",
				"#daca61",
				"#e4a14b",
				"#e98125",
				"#cb2121",
				"#830909",
				"#923e99",
				"#ae83d5",
				"#bf273e",
				"#ce2aeb",
				"#bca44a",
				"#618d1b",
				"#1ee67b",
				"#b0ec44",
				"#a4a0c9",
				"#322849",
				"#86f71a",
				"#d1c87f",
				"#7d9058",
				"#44b9b0",
				"#7c37c0",
				"#cc9fb1",
				"#e65414",
				"#8b6834",
				"#248838"
			];
			var color_counter = 0;
			
			for(var layer in computed_categories) {
				var category_counts = computed_categories[layer];
				
				for(var category in category_counts) {
					var category_count = category_counts[category];
					processed_categories[layer].push({
						"label" : category,
						"value" : category_count,
						"color" : color_wheel[color_counter]
					});
					color_counter = (color_counter + 1) % color_wheel.length;
				}
			}
			
			for(var type_index in settings.Type) {
				var type = settings.Type[type_index];
				
				var pie = new d3pie(anchor_point.get(0), {
					"header": {
						"title": {
							"text": to_title(type),
							"fontSize": 24,
							"font": "open sans"
						}
					},
					"footer": {
						"color": "#999999",
						"fontSize": 10,
						"font": "open sans",
						"location": "bottom-left"
					},
					"size": {
						"canvasWidth": 550,
						"pieOuterRadius": "90%"
					},
					"data": {
						"sortOrder": "value-desc",
						"content": processed_categories[type]
					},
					"labels": {
						"outer": {
							"pieDistance": 32
						},
						"inner": {
							"hideWhenLessThanPercentage": 3
						},
						"mainLabel": {
							"fontSize": 11
						},
						"percentage": {
							"color": "#ffffff",
							"decimalPlaces": 0
						},
						"value": {
							"color": "#adadad",
							"fontSize": 11
						},
						"lines": {
							"enabled": true
						},
						"truncation": {
							"enabled": true
						}
					},
					"effects": {
						"pullOutSegmentOnClick": {
							"effect": "linear",
							"speed": 400,
							"size": 8
						}
					},
					"misc": {
						"gradient": {
							"enabled": true,
							"percentage": 100
						}
					}
				});
				
				anchor_point.data("piechart-" + type, pie);

			}
		}
	}
}


