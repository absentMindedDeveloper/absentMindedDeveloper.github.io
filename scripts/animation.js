var p = document.getElementById('p');
var l = document.getElementById('load');
var loadButton = document.getElementById('loadButton');
var load = [];

var programCode = function(processingInstance) {
	with(processingInstance) {
		size(600, 600);
		frameRate(30);
		var mouseIsPressed = false;
		
		
		draw = function () {
			background(0, 25, 0);
		};
		
		mousePressed = function() {
			mouseIsPressed = true;
		};
		mouseReleased = function() {
			mouseIsPressed = false;
		};
		
	}
};

// Get the canvas that ProcessingJS will use
var canvas = document.getElementById("mycanvas");

// Pass the function to ProcessingJS constructor
var processingInstance = new Processing(canvas, programCode);
