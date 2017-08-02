
function compute_categories(traffic){
	
	var counts = {};
	
	for(var i in traffic) {
		var row = traffic[i].title;
		var tokenized = row.split("\n");
		
		for(var j in tokenized){
			var layers = tokenized[j].split(" ")[0].split(":");
			//var layer_3 = layers[2];
			var layer_4 = layers[3];
			
			if(layer_4 == undefined) {
				continue;
			}
			
			if(counts[layer_4] == null) {
				counts[layer_4] = 1;
			} else {
				counts[layer_4] = counts[layer_4] + 1;
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

		this.getSettings = function() {
			return {
				"Title" : "String",
				"SubTitle": "String",
				"Type": "Options(Layer 4 Traffic)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings, context) {
			
			var computed_categories = compute_categories(data["traffic"]);
			var processed_categories = [];
			
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
			
			for(var category in computed_categories) {
				var category_count = computed_categories[category];
				processed_categories.push({
					"label" : category,
					"value" : category_count,
					"color" : color_wheel[color_counter]
				});
				color_counter = (color_counter + 1) % color_wheel.length;
			}
			
			anchor_point.css("width", "40%").css("margin", "auto");
			
			var container = anchor_point.get(0);
			
			var pie = new d3pie(container, {
				"header": {
					"title": {
						"text": settings.Title,
						"fontSize": 24,
						"font": "open sans"
					},
					"subtitle": {
						"text": settings.SubTitle,
						"color": "#999999",
						"fontSize": 12,
						"font": "open sans"
					},
					"titleSubtitlePadding": 9
				},
				"footer": {
					"color": "#999999",
					"fontSize": 10,
					"font": "open sans",
					"location": "bottom-left"
				},
				"size": {
					"canvasWidth": 590,
					"pieOuterRadius": "90%"
				},
				"data": {
					"sortOrder": "value-desc",
					"content": processed_categories
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
			
			anchor_point.data("piechart", pie);
		}
	}
}


