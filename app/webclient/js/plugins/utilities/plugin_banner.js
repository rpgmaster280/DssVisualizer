
var namespace = getPluginNamespace();

if (namespace["Banner"] == null) {
	namespace.Banner = function Banner(){
		
		this.loadDependencies = function(){
			//Nothing to do here
		};
		
		this.getSettings = function() {
			return {
				"Text": "String", 
				"Size": "Options(h1, h2, h3, h4, h5, h6)", 
				"Color": "Options(Red, Green, Blue)",
				"Align": "Options(Left, Right)"
			};
		};
		
		this.createInstance = function(anchor_point, data, settings) {
			
			var title = settings.Text[0];
			var size = settings.Size[0];
			var color = settings.Color[0];
			var align = settings.Align[0];
			
			var banner = null;
			
			if(size == "h6") {
				banner = $("<h6>");
			} else if(size == "h5") {
				banner = $("<h5>");
			} else if(size == "h4") {
				banner = $("<h4>");
			} else if(size == "h3") {
				banner = $("<h3>");
			} else if(size == "h2") {
				banner = $("<h2>");
			} else if(size == "h1") {
				banner = $("<h1>");
			}
			
			if(align == "Right") {
				banner.addClass("pull-right");
			} else {
				banner.addClass("pull-left");
			}
			
			banner.css("color", color).text(title);
			anchor_point.append(banner);
		};
	};
}
