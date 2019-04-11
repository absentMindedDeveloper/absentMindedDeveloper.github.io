var p = document.getElementById('p');
var l = document.getElementById('load');
var loadButton = document.getElementById('loadButton');
var load = [];

var programCode = function(processingInstance) {
	with(processingInstance) {
		size(1024, 512);
		frameRate(30);
		var mouseIsPressed = false;
		
		var colors = {
			'a': color(0, 0, 0), // black
			'4': color(25, 25, 25),
			'b': color(50, 50, 50), // dark gray
			'5': color(75, 75, 75),
			'c': color(100, 100, 100), // gray
			'6': color(125, 125, 125),
			'd': color(150, 150, 150), // light gray
			'7': color(175, 175, 175),
			'e': color(180, 0, 0), // dark red
			'f': color(205, 50, 50), // red
			'g': color(230, 101, 101), // light red
			'h': color(255, 162, 162), // pink
			'i': color(180, 80, 0), // darkest orange
			'j': color(238, 105, 0), // dark orange
			'k': color(255, 130, 0), // orange
			'l': color(255, 155, 0), // light orange
			'm': color(190, 150, 0), // dark yellow
			'n': color(230, 180, 0), // gold
			'o': color(255, 210, 0), // yellow
			'p': color(255, 240, 0), // light yellow
			'q': color(0, 50, 20), // green start
			'r': color(10, 80, 30),
			's': color(20, 110, 40),
			't': color(30, 140, 50),
			'u': color(40, 170, 60),
			'v': color(50, 200, 70),
			'w': color(60, 230, 80),
			'x': color(70, 255, 90), // green end
			'y': color(0, 20, 50), // blue start
			'z': color(15, 30, 80),
			'A': color(30, 40, 110),
			'B': color(45, 50, 140),
			'C': color(60, 60, 170),
			'D': color(75, 70, 200),
			'E': color(90, 80, 230),
			'F': color(105, 90, 255), // blue end
			'G': color(50, 40, 50), // purple start
			'H': color(80, 50, 80),
			'I': color(110, 60, 110),
			'J': color(140, 70, 140),
			'K': color(170, 80, 170),
			'L': color(200, 90, 200),
			'M': color(230, 100, 230),
			'N': color(255, 110, 255), // purple end
			'O': color(50, 20, 10), // brown start
			'P': color(65, 35, 20),
			'Q': color(80, 50, 30),
			'R': color(95, 65, 40),
			'S': color(110, 80, 50),
			'T': color(125, 95, 60),
			'U': color(140, 110, 70),
			'V': color(155, 125, 80), // brown end
			'W': color(255, 115, 165), // pink begin
			'X': color(255, 145, 170),
			'Y': color(255, 175, 175),
			'Z': color(255, 215, 180), // pink end
			'1': color(255, 255, 255), // white
			'2': color(215, 175, 140),
			'3': color(175, 135, 100),
			' ': color(255, 255, 255, 0), // transparent
		};
		
		var Pixel = function(pixmap, colors, pixelsize) {
			var p = createGraphics(pixmap[0].length * pixelsize, pixmap.length * pixelsize, JAVA2D);
			if (!p) {
				return;
			}
			p.background(255, 255, 255, 0);
			p.noStroke();

			for (var y = 0; y < pixmap.length; y++) {
				for (var x = 0; x < pixmap[y].length; x++) {
					p.fill(colors[pixmap[y][x]]);
					p.rect(x * pixelsize, y * pixelsize, pixelsize, pixelsize);
				}
			}
			return (p.get());
		}; // Creates a pixel art image
		var Composite = function(images) {
			var p = createGraphics(32, 32, JAVA2D);
			for (var i = 0; i < images.length; i++) {
				p.image(images[i], 0, 0);
			}
			return (p.get());
		};
		// block tiles
		{
			var sky = Pixel([
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF',
        'FFFFFFFFFFFFFFFF'], colors, 2);
			var nothing = Pixel([
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa',
        'aaaaaaaaaaaaaaaa'], colors, 2);
			var pillarMiddle = Pixel([
        '  6d67d77d76d6  ',
        '  6d67d77d76d6  ',
        '  6d67d77d76d6  ',
        '  6c67d776d6d6  ',
        '  6d67dd7d76d6  ',
        '  6d67d6dd7c66  ',
        '  6d67d77d76d6  ',
        '  6d67d77d76d6  ',
        '  6d67d77d76d6  ',
        '  6d6dd77d76d6  ',
        '  6d67677d76d6  ',
        '  6d67d77d76d6  ',
        '  6667d7dd76d6  ',
        '  6dc7d7d67666  ',
        '  6d67d7d676d6  ',
        '  6d67d77d76d6  '], colors, 2);
			var pillarMiddleSky = Composite([sky, pillarMiddle]);
		}
		var blocks = {
			' ': {
				name: 'nothing',
				image: nothing
			},
			'!': {
				name: 'sky',
				image: sky
			},
			'#': {
				name: 'pillar middle',
				image: pillarMiddleSky
			}
		};
		
		
		var scenes = [
			[
				'!!!!!!!!!!!',
				'#!!!!!!!!!#'
			],
			['!!!!']
		];
		var tiles = [];
		var scroll = 0;
		var Load = function () {
			for(var i = 0; i < scenes.length; i++) {
				console.log('i');
				for(var y = 0; y < scenes[i].length; y++) {
					console.log('y');
					for(var x = 0; x < scenes[i][y].length; x++) {
						if(blocks[scenes[i][y][x]] !== undefined) {
							tiles.push({
								x: (x * 32) + (i * 1024),
								y: (y * 32),
								image: blocks[scenes[i][y][x]].image
							});
						} else {
							console.log(undefined);
							tiles.push({
								x: (x * 32) + (i * 1024),
								y: (y * 32),
								image: blocks[' '].image
							});
						}
					}
				}
			}
		};
		Load();
		
		draw = function () {
			background(125, 125, 125);
			for(var i = 0; i < tiles.length; i++) {
				var t = tiles[i];
				image(t.image, t.x + scroll, t.y);
			}
		};
		
		keyPressed = function () {
			if(keyCode === 37) {
				scroll += 4;
			}
			if(keyCode === 39) {
				scroll -= 4;
			}
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
