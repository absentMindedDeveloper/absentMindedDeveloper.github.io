var p = document.getElementById('p');
var l = document.getElementById('load');
var loadButton = document.getElementById('loadButton');
var load = [];

var programCode = function(processingInstance) {
	with(processingInstance) {
		size(1024, 512);
		frameRate(60);
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
			var p = createGraphics(64, 64, JAVA2D);
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
        'FFFFFFFFFFFFFFFF'], colors, 4);
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
        'aaaaaaaaaaaaaaaa'], colors, 4);
			var pillarMiddle = Pixel([
        'c6cd6d77d7d66c6c',
        'c6cd6d77d7d6dc6c',
        'c6cd6d77d7d6dc6c',
        'c6c6cd77d7d6dc6c',
        'c6cd66ddd7d6dcc5',
        'c6cd6d77d7d6dc6c',
        'c6cd6d77d76c6c6c',
        'cc5d6d77d7d6dc6c',
        'c6cd6d77d7d6dc6c',
        'c6cd6d77d7d6dc6c',
        'c6cd6d77d7d6dc6c',
        'c6c6cd77d7d6d5cc',
        'c6cd6d77d7d6dc6c',
        'c6cd6d776dd6dc6c',
        'c6cd6d77d7d6dc6c',
        'c6cd6d77d7d6dc6c'], colors, 4);
			var pillarTop = Pixel([
        '6666666666666666',
        '6777777767777777',
        'cdddddddcddddddd',
        'cc66666ccc66666c',
        'dddddddddddddddd',
        'ddddddd66ddddddd',
        'dd66dd6776dd66dd',
        'd6776d6776d6776d',
        'd677767dd767776d',
        '66d776d66d677d66',
        '766d7d6776d7d667',
        '7776d677776d6777',
        '7776d677776d6777',
        'dd76667dd76667dd',
        '6ddd6dddddd6ddd6',
        '6666666666666666'], colors, 4);
			var pillarBottom = Pixel([
        'cccccccccccccccc',
        '7777777777777777',
        '77ddd77d7d77ddd7',
        '7d777d77d77d777d',
        '7d7777d777d7777d',
        '77dd777ddd777dd7',
        '7777777777777777',
        'cccccccccccccccc',
        '5555555555555555',
        'dddddddddddddddd',
        '7777777777777777',
        'dddddddddddddddd',
        'dddddddddddddddd',
        'dddddddddddddddd',
        '7777777777777777',
        'dddddddddddddddd'], colors, 4);
			var wallBlank = Pixel([
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTT'], colors, 4);
			var wallPanel = Pixel([
        'PPPPPPPPPPPPPPPP',
        'RRRRRRRRRRRRRRRR',
        'QRRQQRRQQRRQRQQR',
        'QQQQQQQQQQRQQQQQ',
        'OOOOOOOOOOOOOOOO',
        'QQQOQQQOQQQOQQQO',
        'PQQOQQQOQPQOQQQO',
        'QPQOQQQOQPQOQQPO',
        'PQQOQPQOPQQOQPQO',
        'PQPOPPQOQPQOPPQO',
        'PPPOPQPOPPPOPPPO',
        'PPQOPPPOPPQOQPPO',
        'PPPOPQPOPQPOPPPO',
        'PPPOPPPOPPPOPPPO',
        'PPPOPPPOPPPOPPPO',
        'OOOOOOOOOOOOOOOO'], colors, 4);
			var windowTopLeft = Pixel([
        'POOOOOOOOOOOOOOO',
        'OQPPQPPPPQPPQQQP',
        'OPQQRQQQQQQQQRRQ',
        'OPQRRRRRRRRRRRRR',
        'OPQROOOOOOOOOOOO',
        'OQQRO           ',
        'OQRRO           ',
        'OPQRO           ',
        'OPQRO           ',
        'OQRRO           ',
        'OQQRO           ',
        'OPQRO           ',
        'OQRRO           ',
        'OQRRO           ',
        'OPQRO           ',
        'OPQRO           '], colors, 4);
			var windowTopRight = Pixel([
        'OOOOOOOOOOOOOOOP',
        'PPQQPQQPPQQPPPQO',
        'QQRRQQRQQRQQQQPO',
        'RRRRRRRRRRRRRQPO',
        'OOOOOOOOOOOORRQO',
        '           ORQPO',
        '           ORQPO',
        '           ORQPO',
        '           ORQPO',
        '           ORQQO',
        '           ORQPO',
        '           ORQPO',
        '           ORQQO',
        '           ORRQO',
        '           ORRQO',
        '           ORQPO'], colors, 4);
			var windowBottomLeft = Pixel([
        'OPQRO           ',
        'OQRRO           ',
        'OQRRO           ',
        'OQQRO           ',
        'OPQRO           ',
        'OPQRO           ',
        'OQQRO           ',
        'OPQRO           ',
        'OPQRO           ',
        'OPQRO           ',
        'OPQRO           ',
        'OQRROOOOOOOOOOOO',
        'OPQRRRRRRRRRRRRR',
        'OPQQQQRQQRQQRRQQ',
        'OQPPPQQPPQQPQQPP',
        'POOOOOOOOOOOOOOO'], colors, 4);
			var windowBottomRight = Pixel([
        '           ORQPO',
        '           ORQPO',
        '           ORRQO',
        '           ORRQO',
        '           ORQPO',
        '           ORQQO',
        '           ORRQO',
        '           ORQPO',
        '           ORQPO',
        '           ORRQO',
        '           ORQQO',
        'OOOOOOOOOOOORQPO',
        'RRRRRRRRRRRRRQPO',
        'QRRQQQQQQQQRQQPO',
        'PQQQPPQPPPPQPPQO',
        'OOOOOOOOOOOOOOOP'], colors, 4);
			var windowTopLeftSky = Composite([sky, windowTopLeft]);
			var windowTopRightSky = Composite([sky, windowTopRight]);
			var windowBottomLeftSky = Composite([sky, windowBottomLeft]);
			var windowBottomRightSky = Composite([sky, windowBottomRight]);
		}
		// item tiles
		{
			var potStand = Pixel([
        '                ',
        '     aaaaaa     ',
        '    a4VVVV4a    ',
        '   abVaaaaVba   ',
        '   abbVVVVbba   ',
        '   a4bbbbbb4a   ',
        '  aa444bb444aa  ',
        ' aPOaa4444aaOPa ',
        ' aPPOOaaaaOOPPa ',
        '  aPPPOOOOPPPa  ',
        '   aaaPPPPaaa   ',
        '   accaaaacca   ',
        '   a6cabbac6a   ',
        '   a6cabbac6a   ',
        '   a6cabbac6a   ',
        '   a6ca5bac6a   ',
        '   a6ca55ac6a   ',
        '  a66ca55ac66a  ',
        '  a6caa55aac6a  ',
        ' aa6caa55aac6aa ',
        'add6caa55aac6dda',
        'ad66ca aa ac66da',
        ' acca      acca ',
        '  aa        aa  '], colors, 4);
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
				image: pillarMiddle
			},
			'$': {
				name: 'pillar top',
				image: pillarTop
			},
			'%': {
				name: 'pillar bottom',
				image: pillarBottom
			},
			'&': {
				name: 'wall blank',
				image: wallBlank
			},
			'(': {
				name: 'wall panel',
				image: wallPanel
			},
			')': {
				name: 'window top left',
				image: windowTopLeftSky
			},
			'*': {
				name: 'window top right',
				image: windowTopRightSky
			},
			'+': {
				name: 'window bottom left',
				image: windowBottomLeftSky
			},
			',': {
				name: 'window bottom right',
				image: windowBottomRightSky
			}
		};
		var items = {
			'pot stand': {
				image: potStand
			}
		};
		
		var scenes = [
			[
				'$$$$$$$$$$$$$$$$',
				'#&&&&&&&&&&&&&&#',
				'#&&&&&&&&&&&&&&#',
				'#&&)*&&&&&&&&&&#',
				'#&&+,&&&&&&&&&&#',
				'#&&&&&&&&&&&&&&#',
				'#((((((((((((((#',
				'%%%%%%%%%%%%%%%%'
				
			],
			['!!!!']
		];
		var mapItems = [
			[
				{
					name: 'pot stand',
					x: 3,
					y: 6
				}
			],
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
							if(blocks[scenes[i][y][x]].wide === true) {
								tiles.push({
									x: (x * 64) + (i * 1024),
									y: (y * 64),
									image: blocks[scenes[i][y][x]].image,
									wide: true
								});
							} else if(blocks[scenes[i][y][x]].tall === true) {
								tiles.push({
									x: (x * 64) + (i * 1024),
									y: (y * 64),
									image: blocks[scenes[i][y][x]].image,
									tall: true
								});
							} else {
								tiles.push({
									x: (x * 64) + (i * 1024),
									y: (y * 64),
									image: blocks[scenes[i][y][x]].image,
									tall: true
								});
							}
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
				if(t.wide === true) {
					image(t.image, t.x + scroll - 16, t.y);
				} else if(t.tall === true) {
					image(t.image, t.x + scroll, t.y - 32);
				} else {
					image(t.image, t.x + scroll, t.y - 32);
				}
			}
			for(var i = 0; i < mapItems.length; i++) {
				for(var j = 0; j < mapItems[i].length; j++) {
					var item = mapItems[i][j];
					image(items[item.name].image, (item.x * 64) + (i * 1024) + scroll, (item.y * 64) - 64); 
				}
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
