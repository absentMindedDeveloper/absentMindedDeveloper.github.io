var programCode = function(processingInstance) {
	with(processingInstance) {
		size(996, 600);
		frameRate(60);
		var mouseIsPressed = false;
		
		var fade = 175;
		var fadeChange = 0;
		var col = fade;
		
		var epilepsy = 255;
		var speed = 10;
		var epilChange = -speed;
		var flash = false;
		
		var timer = 0;
		var timerChange = 1;
		
		var Text = function(str, size) {
			this.str = str;
			this.size = size;
		};
		Text.prototype.draw = function () {
			fill(fade, fade, fade);
			textAlign(CENTER, CENTER);
			this.final = '';
			for(var i = 0; i < this.str.length; i++) {
				this.final += this.str[i];
				this.final += '\n';
			}
			textSize(this.size);
			textLeading(this.size * 1.5);
			text(this.final, 498, 300);
		};
		var SplitText = function (str1, str2, size) {
			this.str1 = str1;
			this.str2 = str2;
			this.size = size;
		};
		SplitText.prototype.draw = function () {
			fill(fade, fade, fade);
			this.left = '';
			this.right = '';
			for(var i = 0; i < this.str1.length; i++) {
				this.left += this.str1[i];
				this.left += '\n';
			}
			for(var i = 0; i < this.str2.length; i++) {
				this.right += this.str2[i];
				this.right += '\n';
			}
			textSize(this.size);
			textAlign(RIGHT, CENTER);
			text(this.left, 480, 300);
			textAlign(LEFT, CENTER);
			text(this.right, 516, 300);
		};
		
		var frames = [
			new Text([]),
			new Text(['Evangel Classical School', 'presents'], 42),
			new Text(['The Grail'], 46),
			new Text(['VERY heavily inspired by', 'MONTY PYTHON', 'and the', 'HOLY GRAIL'], 32),
			new Text(['adapted and directed', 'by', 'MAGGIE HIGGINS'], 32),
			new Text(['facilities provided', 'by', 'RECLAMATION CHURCH'], 32),
			new SplitText(['Franz Overman', 'Gideon Marlatt', 'Laird Marlatt', 'Reese Paine', 'K̶e̶l̶l̶y̶ ̶D̶u̶r̶h̶a̶m̶', 'Kelly Durham'], ['King Arthur', 'Sir Bedevere', 'Sir Launcelot', 'Sir Robin', 'S̶i̶r̶ ̶H̶a̶d̶ ̶a̶ ̶g̶a̶l̶', 'Sir Gallahad'], 32),
			new Text(['also featuring', 'Bonnie Bour', 'Dineke Bour', 'Henry Callender', 'Gresham Callender', 'Thomas Callender', 'Elizabeth Durham', 'Kelly Durham', 'Timothy Durham'], 26),
		];
		var cur = 0;
		var serif = createFont('serif');
		draw = function () {
			textFont(serif);
			var currentFrame = floor(cur);
			fade += fadeChange;
			if(flash) {
				background(255, epilepsy, 50);
			} else {
				background(0, 0, 0);
			}
			epilepsy += epilChange;
			
			if(epilepsy > 255) {
				epilChange = -speed;
			}
			if(epilepsy < 0) {
				epilChange = speed;
			}
			
			timer += timerChange;
 			if(timer > 300) {
				timer = 0;
				timerChange = 0;
				fadeChange = -3;
			}
			if(fade < 0) {
				fadeChange = 3;
				cur++;
			}
			if(fade > col) {
				fadeChange = 0;
				fade = col;
				timer = 0;
				timerChange = 1;
			}
			if(cur > 25) {
				flash = true;
			}
			if(frames[cur] !== undefined) {
				frames[cur].draw();
			}
		};
		
	}
};
// Get the canvas that ProcessingJS will use
var canvas = document.getElementById("mycanvas");
// Pass the function to ProcessingJS constructor
var processingInstance = new Processing(canvas, programCode);
