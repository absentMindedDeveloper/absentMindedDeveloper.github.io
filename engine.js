var programCode = function(processingInstance) {
with (processingInstance) {
size(768, 544);



/*jshint sub:true*/
var FRAME_RATE = 60;
var PIXEL_SIZE = 2;
var TILE_SIZE = 16;
var REAL_SIZE = TILE_SIZE * PIXEL_SIZE;
var GUI_TEXT_COLOR = 'd';
var CONTROLS = {
	up: 87,
	down: 83,
	left: 65,
	right: 68
}; // stores the key controls 

var loaded = false;
var collisionBoxes = false;
var keys = [];
var mouseIsPressed = false;
var keyIsPressed = true;
var newClick = true;
var items = {};
var entities = {
	'enemies': {},
	'vendors': {},
	'interactings': {},
	'questGivers': {}
};
var Hover = function (x, y, sizeX, sizeY) {
	if(mouseX > x && mouseX < sizeX + x && mouseY > y && mouseY < sizeY + y) {
		return true;
	} else {
		return false;
	}
}; // a function that returns true when the mouse is over a certain area
var arrayMax = function (array) {
	var cur = array[0];
	for(var i = 0; i < array.length; i++) {
		if(cur < array[i]) {
			cur = array[i];
		}
	}
	return(cur);
}; // returns the greatest number value in an array

frameRate(FRAME_RATE);
colorMode(RGB, 255, 255, 255);

var pal = {
	'a': color(16, 16, 16),
	'b': color(64, 64, 64),
	'c': color(112, 112, 112),
	'd': color(160, 160, 160),
	' ': color(255, 255, 255, 0)
}; // the current pallette

var Player = {
	'loc': {
		'scene': {
			'x': 0, // the x-coordinate of the scene the player is in
			'y': 0, // the y-coordinate of the scene the player is in
			'z': 0 // the z-coordinate of the scene the player is in
		},
		'facing': 'down', // which direction the player is facing
		'x': 0, // the player's x-coordinate
		'y': 0, // the player's y-coordinate
	},
	'moveable': true, // if the player is able to move
	'inventory': {
		'bagSlots': {
			'bag1': 'blue bag',
			'bag2': 'nothing',
			'bag3': 'nothing',
			'bag4': 'nothing',
			'bag5': 'nothing'
		}, // the players bag slots
		'bags': { // the players bags
			'bag1': {},
			'bag2': {},
			'bag3': {},
			'bag4': {},
			'bag5': {}
		},
		'equipment': { // the items the player is wearings
			'head': 'nothing',
			'neck': 'nothing',
			'shoulders': 'nothing',
			'chest': 'nothing',
			'wrists': 'nothing',
			'hands': 'nothing',
			'finger': 'nothing',
			'waist': 'nothing',
			'legs': 'nothing',
			'feet': 'nothing',
			'mainHand': 'nothing',
			'offHand': 'nothing'
		},
		'abilities': {}, // the abilities currently available in the spellbook
		'abilityBar': {}, // the abilities the player has placed on their bar
		'buffs': {}, // the buff or debuff effects currently on the player
		'quests': {} // the quests the player has within their inventory
	},
	'stats': {
		'speed': 2, // movement speed
		'curEndurance': 1, // energy
		'endurance': 100,
		'curFortitude': 1, // health
		'fortitude': 100,
		'vitality': 50, // health regeneration
		'vigor': 50, // energy regeneration
		'luck': 0, // critical hit chance
		'strength': 0, // attack power
		'armor': 0, // armor points
	},
	'actions': { // the different actions the player is performing
		'moving': {
			'up': false,
			'down': false,
			'left': false,
			'right': false
		},
		'guis': {
			'bag1': false,
			'bag2': false,
			'bag3': false,
			'bag4': false,
			'bag5': false,
			'characterPane': false,
			'spellBook': false,
			'questLog': false
		}
	},
	'size': {
		'x': 16, // the width of the player
		'y': 24, // the height
		'colX': 0, // the x location of the players hitbox
		'colY': 0, // the y location of the players hitbox
		'colXSize': 16, // the width of the players hitbox
		'colYSize': 16 // the height of the players hitbox
	},
	'animation': {},
	'colBox': {
		'x': 0,
		'y': 0,
		'xSize': 0,
		'ySize': 0
	}
}; // stores information about the player
Player.update = function () {
	Player['colBox'] = {
		'x': (Player['loc']['x'] + Player['size']['colX'] * PIXEL_SIZE),
		'y': (Player['loc']['y'] + Player['size']['colY'] * PIXEL_SIZE),
		'xSize': Player['size']['colXSize'] * PIXEL_SIZE,
		'ySize': Player['size']['colYSize'] * PIXEL_SIZE,
	}; // calculates the players collision box so that it is consistent with x and y location
	if(Player['stats']['curFortitude'] < Player['stats']['fortitude']) {
		Player['stats']['curFortitude'] += (Player['stats']['vitality']/1000);
	} else if(Player['stats']['curFortitude'] > Player['stats']['fortitude']) {
		Player['stats']['curFortitude'] = Player['stats']['fortitude'];
	}
	if(Player['stats']['curEndurance'] < Player['stats']['endurance']) {
		Player['stats']['curEndurance'] += (Player['stats']['vigor']/1000);
	} else if(Player['stats']['curEndurance'] > Player['stats']['endurance']) {
		Player['stats']['curEndurance'] = Player['stats']['endurance'];
	}

	var bagTemp = {
		x: width,
		y: 0
	};
	for(var i = 1; i < 6; i++) {
		if(Player['inventory']['bagSlots']['bag' + i] !== 'nothing') {
			var cBag = items[Player['inventory']['bagSlots']['bag' + i]];
			cBag.bag.draw(bagTemp.x - cBag.bag.width, bagTemp.y, Player['inventory']['bags']['bag' + i], 'bag' + i);
			if(Player['actions']['guis']['bag' + i]) {
				bagTemp.y += cBag.bag.height;
			}
		}
	}
	Player['characterPane'].draw(0, 0, Player['actions']['guis']['characterPane']);
};
Player.movement = function () {
	if(Player['moveable']) {
		// moves the player left
		if(keys[CONTROLS.left]) {
			Player['loc']['facing'] = 'left';
			Player['actions']['moving']['left'] = true;
			Player['loc']['x'] -= Player['stats']['speed'];
		} else {
			Player['actions']['moving']['left'] = false;
		}
		// moves the player right
		if(keys[CONTROLS.right]) {
			Player['loc']['facing'] = 'right';
			Player['actions']['moving']['right'] = true;
			Player['loc']['x'] += Player['stats']['speed'];
		} else {
			Player['actions']['moving']['right'] = false;
		}
		// moves the player up
		if(keys[CONTROLS.up]) {
			Player['loc']['facing'] = 'up';
			Player['actions']['moving']['up'] = true;
			Player['loc']['y'] -= Player['stats']['speed'];
		} else {
			Player['actions']['moving']['up'] = false;
		}
		// moves the player down
		if(keys[CONTROLS.down]) {
			Player['loc']['facing'] = 'down';
			Player['actions']['moving']['down'] = true;
			Player['loc']['y'] += Player['stats']['speed'];
		} else {
			Player['actions']['moving']['down'] = false;
		}
	}
	// draws the moving left animation
	if(Player['loc']['facing'] === 'left') {
		if(Player['actions']['moving']['left']) {
			Player['animation']['left'].draw();
		} else if(!Player['actions']['moving']['left']) {
			// draws a static animation when the player stops moving
			Player['animation']['left'].reset();
			Player['animation']['left'].static(0);
		}
	}
	// draws the moving right animation
	if(Player['loc']['facing'] === 'right') {
		if(Player['actions']['moving']['right']) {
			Player['animation']['right'].draw();
		} else if(!Player['actions']['moving']['right']) {
			// draws a static animation when the player stops moving
			Player['animation']['right'].reset();
			Player['animation']['right'].static(0);
		}
	}
	// draws the moving up animation
	if(Player['loc']['facing'] === 'up') {
		if(Player['actions']['moving']['up']) {
			Player['animation']['up'].draw();
		} else if(!Player['actions']['moving']['up']) {
			// draws a static animation when the player stops moving
			Player['animation']['up'].reset();
			Player['animation']['up'].static(0);
		}
	}
	// draws the moving down animation
	if(Player['loc']['facing'] === 'down') {
		if(Player['actions']['moving']['down']) {
			Player['animation']['down'].draw();
		} else if(!Player['actions']['moving']['down']) {
			// draws a static animation when the player stops moving
			Player['animation']['down'].reset();
			Player['animation']['down'].static(0);
		}
	}

	// detects when the player goes off of the top of the screen
	if(Player['loc']['y'] + (Player['size']['y'] * PIXEL_SIZE / 2) < 0) {
		Player['loc']['scene']['y']--;
		Player['loc']['y'] = height - (Player['size']['y'] * PIXEL_SIZE / 2);
	}
	// detects when the player goes off the left of the screen
	if(Player['loc']['x'] + (Player['size']['x'] * PIXEL_SIZE / 2) < 0) {
		Player['loc']['scene']['x']--;
		Player['loc']['x'] = width - (Player['size']['x'] * PIXEL_SIZE / 2);
	}
	// detects when the player goes off the right of the screen
	if(Player['loc']['x'] + (Player['size']['x'] * PIXEL_SIZE / 2) > width) {
		Player['loc']['scene']['x']++;
		Player['loc']['x'] = 0 - (Player['size']['x'] * PIXEL_SIZE / 2);
	}
};
Player.calcBagSpace = function () {
	var tempSpace = 0;
	for(var i = 1; i < 6; i++) {
		if(Player['inventory']['bagSlots']['bag' + i] !== 'nothing') {
			tempSpace += (items[Player['inventory']['bagSlots']['bag' + i]].slots - Object.keys(Player['inventory']['bags']['bag' + i]).length);
		}
	}
	return tempSpace;
};
var images = []; // the array that stores all of the images before they are loaded
var Image = function (pixmap, colors, size, allColors) {
	// sets the pixel size if not specified
	if(size === undefined) {
		this.size = PIXEL_SIZE; 
	} else {
		this.size = size;
	}
	// detects if the image is to be loaded with all possible colors
	if(allColors === undefined) {
		this.allColors = false;
	} else {
		this.allColors = true;
	}
	this.pixmap = pixmap;
	this.colors = colors;
	this.combined = false;
	images.push(this);
}; // the image constructor function
Image.prototype.load = function () {
	// checks to make sure the image is not a combination of two already loaded images
	if(!this.combined) {
		this.width = this.pixmap[0].length * this.size; // sets the width of the image
		this.height = this.pixmap.length * this.size; // sets the height of the image
		this.offset = {
			x: (this.width - (TILE_SIZE * this.size))/2, // sets the x-offset to align images
			y: this.height - (TILE_SIZE * this.size) // sets the y-offset to align images
		};
		if(!this.allColors) {
			this.p = createGraphics(this.width, this.height, JAVA2D); // creates the graphics
			this.p.background(0, 0, 0, 0);
			this.p.noStroke();
			// loops through the tilemap
			for(var y = 0; y < this.pixmap.length; y++) {
				for(var x = 0; x < this.pixmap[y].length; x++) {
					this.p.fill(pal[this.pixmap[y][x]]); // sets the color
					this.p.rect(x * this.size, y * this.size, this.size, this.size); // draws the pixels
				}
			}
			this.p = this.p.get(); // gets the canvas and exports it as an image
		} else {
			this.colorKeys = Object.keys(this.colors); // creates an array with all of the color keys
			this.p = [];
			// loops through all of the colors, and creates an image with each color
			for(var i = 0; i < this.colorKeys.length; i++) {
				this.p[i] = createGraphics(this.width, this.height, JAVA2D); // creates the graphics
				this.p[i].background(0, 0, 0, 0);
				this.p[i].noStroke();
				// loops through the tilemap
				for(var y = 0; y < this.pixmap.length; y++) {
					for(var x = 0; x < this.pixmap[y].length; x++) {
						if(this.pixmap[y][x] !== ' ') {
							this.p[i].fill(this.colors[this.colorKeys[i]]); // sets the color
							this.p[i].rect(x * this.size, y * this.size, this.size, this.size); // draws the pixels
						}
					}
				}
				this.p[i] = this.p[i].get(); // gets the canvas and exports it as an image
			}
		}
	}
};
Image.prototype.draw = function (x, y, textColor) {
	if(textColor === undefined) {
		textColor = 0;
	}
	if(this.p) {
		if(!this.allColors) {
			image(this.p, x - this.offset.x, y - this.offset.y); // draws the image
		} else {
			image(this.p[0], x - this.offset.x, y - this.offset.y);
		}
	} else {
		this.load();
		println('image drawn before loaded: forced load');
	}
};
// block images
{
	var grass = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbdbbbbbbbb',
        'dbbbbbbcdbbbbbbb',
        'cdbbbbbbcbbbbbbb',
        'bcbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbdbbbb',
        'bbbbbbbbbbdcbbbb',
        'bbbdbbbbbbcbbbbb',
        'bbbcdbbbbbbbbbbb',
        'bbbbcbbbbbbbbbbb',
        'bbbbbbbbbdbbbbbb',
        'bbbbbbbbdcbbbbbb',
        'bbbdbbbbcbbbdbbb',
        'bbdcbbbbbbbbcdbb',
        'bbcbbbbbbbbbbcbb'], pal);
	var rock = new Image([
        '                ',
        '                ',
        '                ',
        '      aaa       ',
        '     adddaa     ',
        '    abcdddda    ',
        '    acccdddda   ',
        '   abbcbcddda   ',
        '   abbbcbcddda  ',
        '   ababccbcdda  ',
        '   aababcbcdda  ',
        '   aaaaabcbcda  ',
        '    aaaaabcaa   ',
        '      aaaaa     ',
        '                ',
        '                '], pal);
}
// gui images
{
	var topLeft = new Image([
        ' aaaaaaaaaaaaaaa',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb'], pal);
	var topRight = new Image([
        'aaaaaaaaaaaaaaa ',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba'], pal);
	var bottomLeft = new Image([
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        ' aaaaaaaaaaaaaaa'], pal);
	var bottomRight = new Image([
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'aaaaaaaaaaaaaaa '], pal);
	var top = new Image([
        'aaaaaaaaaaaaaaaa',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb'], pal);
	var bottom = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'aaaaaaaaaaaaaaaa'], pal);
	var left = new Image([
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb'], pal);
	var right = new Image([
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba'], pal);
	var middle = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb'], pal);
	var closeButton = new Image([
        'aaaaaaaaaaaaaaa ',
        'bbacccccccccccca',
        'bbacbbbccccbbbca',
        'bbacbddbccbddbca',
        'bbacbcddbbddcbca',
        'bbaccbcddddcbcca',
        'bbacccbcddcbccca',
        'bbacccbcddcbccca',
        'bbaccbddccddbcca',
        'bbacbddcbbcddbca',
        'bbacbdcbccbcdbca',
        'bbacbbbccccbbcca',
        'bbacccccccccccca',
        'bbbaaaaaaaaaaaaa',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba'], pal);
	var acceptButton = new Image([
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbaaaaaaaaaaaaa',
        'bbabbbbbbbbbbbba',
        'bbabbbbbbbbbddba',
        'bbabbbbbbbbdddba',
        'bbabbbbbbbbddcba',
        'bbabbbbbbbddcbba',
        'bbabddbbbbddbbba',
        'bbabcddbbddcbbba',
        'bbabbcddbddbbbba',
        'bbabbbcdddcbbbba',
        'bbabbbbcdcbbbbba',
        'bbabbbbbcbbbbbba',
        'bbabbbbbbbbbbbba',
        'aaaaaaaaaaaaaaa '], pal);
	var slot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var slotTop = new Image([
        'aaaaaaaaaaaaaaaa',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var slotBottom = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'aaaaaaaaaaaaaaaa'], pal);
	var slotLeft = new Image([
        'abbbbbbbbbbbbbbb',
        'abaaaaaaaaaaaabb',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'abaaaaaaaaaaaabb',
        'abbbbbbbbbbbbbbb'], pal);
	var slotRight = new Image([
        'bbbbbbbbbbbbbbba',
        'bbaaaaaaaaaaaaba',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'bbaaaaaaaaaaaaba',
        'bbbbbbbbbbbbbbba'], pal);
	var slotTopLeft = new Image([
        ' aaaaaaaaaaaaaaa',
        'abaaaaaaaaaaaabb',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'abaaaaaaaaaaaabb',
        'abbbbbbbbbbbbbbb'], pal);
	var slotTopRight = new Image([
        'aaaaaaaaaaaaaaa ',
        'bbaaaaaaaaaaaaba',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'bbaaaaaaaaaaaaba',
        'bbbbbbbbbbbbbbba'], pal);
	var slotBottomLeft = new Image([
        'abbbbbbbbbbbbbbb',
        'abaaaaaaaaaaaabb',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'aaccccccccccccab',
        'abaaaaaaaaaaaabb',
        ' aaaaaaaaaaaaaaa'], pal);
	var slotBottomRight = new Image([
        'bbbbbbbbbbbbbbba',
        'bbaaaaaaaaaaaaba',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'baccccccccccccaa',
        'bbaaaaaaaaaaaaba',
        'aaaaaaaaaaaaaaa '], pal);
	var barLeft = new Image([
        '                ',
        '                ',
        '  aaaaaaaaaaaaaa',
        ' abbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        'abbbbbbbbbbbbbbb',
        ' abbbbbbbbbbbbbb',
        '  aaaaaaaaaaaaaa',
        '                ',
        '                '], pal);
	var barRight = new Image([
        '                ',
        '                ',
        'aaaaaaaaaaaaaa  ',
        'bbbbbbbbbbbbbba ',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbbba',
        'bbbbbbbbbbbbbba ',
        'aaaaaaaaaaaaaa  ',
        '                ',
        '                '], pal);
	var barMiddle = new Image([
        '                ',
        '                ',
        'aaaaaaaaaaaaaaaa',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'bbbbbbbbbbbbbbbb',
        'aaaaaaaaaaaaaaaa',
        '                ',
        '                '], pal);
	var characterIcon = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baaaaaddddaaaaab',
        'baaaaddddddaaaab',
        'baaaddddddddaaab',
        'baaaddddddddaaab',
        'baaaddddddddaaab',
        'baaacddddddcaaab',
        'baaaacddddcaaaab',
        'baaaabcddcbaaaab',
        'baaaaabccbaaaaab',
        'baaaaccddccaaaab',
        'baaacddddddcaaab',
        'baaaabddddbaaaab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var spellBookIcon = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baaaaaaaaaaaaaab',
        'baaaddaaaaddaaab',
        'baabdddaadddbaab',
        'baabdcdbcdcdbaab',
        'baabddccbcddbaab',
        'baabdcdbcdcdbaab',
        'baabddccbcddbaab',
        'baabdddbcdddbaab',
        'baabccdcbdccbaab',
        'baaabbcddcbbaaab',
        'baaaaabccbaaaaab',
        'baaaaaabbaaaaaab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var questLogIcon = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baaaaaaaaaaaaaab',
        'baaacdaaaacaaaab',
        'baabcddaacaaaaab',
        'baabcdddacbbaaab',
        'baaabcccbbaabaab',
        'baaaabcbbddaaaab',
        'baaaaabbbddddaab',
        'baaaaaabcdddddab',
        'baaaaaaabcdcbdab',
        'baaaaaaaabddddab',
        'baaaaaaaaabbbaab',
        'baaaaaaaaaaaaaab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var headSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacccccbbbccccab',
        'baccccbcccbcccab',
        'bacccbcccccbccab',
        'bacccbcbbbcbccab',
        'bacccbbbbbbbccab',
        'bacccbababbaccab',
        'bacccbababbaccab',
        'bacccbaaabacccab',
        'bacccbaaabccccab',
        'bacccbcccbccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var neckSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacccccbabccccab',
        'baccccacccacccab',
        'bacccbcccccbccab',
        'bacccacccccaccab',
        'bacccbccccbcccab',
        'bacccacccaccccab',
        'baccccbcbcccccab',
        'bacccccbccccccab',
        'baccccbdbcccccab',
        'bacccccbccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var shoulderSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacccccccbbbccab',
        'bacccccbbcdcbcab',
        'baccccbccbddbcab',
        'bacccbddcbcbacab',
        'baccbcdddcbaacab',
        'baccbbcdcbaaacab',
        'bacbcdbcbaacccab',
        'bacbddcbaaccccab',
        'bacbcdbbacccccab',
        'baccbbbaccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var chestSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccbbbccbbbccab',
        'bacbcccbbcccbcab',
        'bacacddccddcacab',
        'bacabbcddcbbacab',
        'baccabbbbbbaccab',
        'bacccaaaaaacccab',
        'baccccbcdbccccab',
        'baccccabbaccccab',
        'bacccccaacccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var wristSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'bacccccbbbccccab',
        'baccccbdddbcccab',
        'bacccbcbcddbccab',
        'baccbaacbddbccab',
        'bacbaaaacbcbccab',
        'bacbaaaacbbcccab',
        'bacbaaaacbccccab',
        'baccbaacbcccccab',
        'bacccbbbccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var handSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccbbbbccccab',
        'bacccbcccbccccab',
        'bacccabccbccccab',
        'bacccaabccbcccab',
        'bacccccbccbcccab',
        'baccccbbbcbcccab',
        'bacccbabccbcccab',
        'bacccbcbcbacccab',
        'bacccccbcbacccab',
        'baccccbbbaccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var fingerSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'bacccbbbccccccab',
        'baccbcdabcccccab',
        'baccbcdaabccccab',
        'baccbccdaabcccab',
        'bacccbccdaabccab',
        'baccccbccddbccab',
        'bacccccbcccbccab',
        'baccccccbbbcccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var waistSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccaaaaaaaaccab',
        'bacbbaaaaaabbcab',
        'bacbabddddbabcab',
        'bacccabbbbacccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var legSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'baccccccccccccab',
        'bacccbbbbbbcccab',
        'bacccbcccbbcccab',
        'bacccbcbccbcccab',
        'bacccbcbcbbcccab',
        'bacccbcaccbcccab',
        'bacccbcacbbcccab',
        'bacccbbbccbcccab',
        'bacccbbcbbacccab',
        'baccccccccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var footSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacccaaaacccccab',
        'baccabcbbbbcccab',
        'bacccabcddcbccab',
        'baccccabdcbcccab',
        'baccccabdcbcccab',
        'baccccabbcbcccab',
        'baccaaabdcbcccab',
        'bacabbbbcbacccab',
        'baccaaccaaccccab',
        'baccccaaccccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var mainHandSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacddcccccccccab',
        'bacdddccccccccab',
        'baccdddcccccccab',
        'bacccdcdccccccab',
        'baccccdcdccbccab',
        'bacccccdcdcbccab',
        'baccccccdcbaccab',
        'bacccccccbacccab',
        'bacccccbbacbccab',
        'baccccccccccacab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var offHandSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baccccccccccccab',
        'bacccbbbbbbcccab',
        'baccbddddddbccab',
        'baccbddddddbccab',
        'baccbddddddbccab',
        'baccbcddddcbccab',
        'baccaccccccaccab',
        'bacccaddddacccab',
        'bacccabddbacccab',
        'baccccabbaccccab',
        'bacccccaacccccab',
        'baccccccccccccab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
	var emptyBagSlot = new Image([
        'bbbbbbbbbbbbbbbb',
        'bbaaaaaaaaaaaabb',
        'baaaaaaaabbaaaab',
        'baaaaaaaaabbbaab',
        'baaaaabbbbcdbaab',
        'baaaabccccbcdbab',
        'baaabccccccbcbab',
        'baaabcccccbbdbab',
        'baabcccbbbbbadab',
        'baabcbbbbbbbacab',
        'baabbbbbbbbbadab',
        'baaabbbbbbbaacab',
        'baaaabbbbbaaaaab',
        'baaaaaaaaaaaaaab',
        'bbaaaaaaaaaaaabb',
        'bbbbbbbbbbbbbbbb'], pal);
}
// text
{
	var space = new Image([
        '    ',
        '    ',
        '    ',
        '    ',
        '    ',
        '    ',
        '    ',
        '    '], pal, 1, true);
	var upperA = new Image([
        '  aaaa  ',
        '   aa   ',
        '  a  a  ',
        '  a  a  ',
        '  aaaa  ',
        ' a    a ',
        ' a    a ',
        'aaa  aaa'], pal, 1, true);
	var lowerA = new Image([
        '       ',
        '       ',
        '  aaa  ',
        '     a ',
        '  aaaa ',
        ' a   a ',
        ' a   a ',
        '  aaa a'], pal, 1, true);
	var upperB = new Image([
        'aaaaaa ',
        ' a    a',
        ' a    a',
        ' aaaaa ',
        ' a    a',
        ' a    a',
        ' a    a',
        'aaaaaa '], pal, 1, true);
	var lowerB = new Image([
        ' aaa   ',
        '  a    ',
        '  a    ',
        '  aaaa ',
        '  a   a',
        '  a   a',
        '  a   a',
        ' aaaaa '], pal, 1, true);
	var upperC = new Image([
        '  aaa a',
        ' a   aa',
        'a     a',
        'a      ',
        'a      ',
        'a     a',
        ' a    a',
        '  aaaa '], pal, 1, true);
	var lowerC = new Image([
        '       ',
        '       ',
        '  aaa a',
        ' a   aa',
        ' a    a',
        ' a     ',
        ' a    a',
        '  aaaa '], pal, 1, true);
	var upperD = new Image([
        'aaaaa  ',
        ' a   a ',
        ' a    a',
        ' a    a',
        ' a    a',
        ' a    a',
        ' a   a ',
        'aaaaa  '], pal, 1, true);
	var lowerD = new Image([
        '    aaa',
        '     a ',
        '     a ',
        '  aaaa ',
        ' a   a ',
        ' a   a ',
        ' a   a ',
        '  aaaaa'], pal, 1, true);
	var upperE = new Image([
        'aaaaaaa',
        ' a    a',
        ' a  a  ',
        ' aaaa  ',
        ' a  a  ',
        ' a     ',
        ' a    a',
        'aaaaaaa'], pal, 1, true);
	var lowerE = new Image([
        '       ',
        '       ',
        '  aaaa ',
        ' a    a',
        ' a  aa ',
        ' aaa   ',
        ' a    a',
        '  aaaa '], pal, 1, true);
	var upperF = new Image([
        'aaaaaaa',
        ' a    a',
        ' a  a  ',
        ' aaaa  ',
        ' a  a  ',
        ' a     ',
        ' a     ',
        'aaa    '], pal, 1, true);
	var lowerF = new Image([
        '   aa ',
        '  a  a',
        '  a   ',
        ' aaaa ',
        '  a   ',
        '  a   ',
        '  a   ',
        ' aaa  '], pal, 1, true);
	var upperG = new Image([
        '  aaaa a',
        ' a    aa',
        'a      a',
        'a       ',
        'a    aaa',
        'a      a',
        ' a     a',
        '  aaaaa '], pal, 1, true);
	var lowerG = new Image([
        '       ',
        '       ',
        '       ',
        '  aaaaa',
        ' a   a ',
        ' a   a ',
        ' a   a ',
        '  aaaa ',
        '     a ',
        '     a ',
        ' a   a ',
        '  aaa  '], pal, 1, true);
	var upperH = new Image([
        'aaa  aaa',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' aaaaaa ',
        ' a    a ',
        ' a    a ',
        'aaa  aaa'], pal, 1, true);
	var lowerH = new Image([
        ' aaa    ',
        '  a     ',
        '  aaa   ',
        '  a  a  ',
        '  a  a  ',
        '  a  a  ',
        '  a  a  ',
        ' aaa aa '], pal, 1, true);
	var upperI = new Image([
        'aaaaaaa',
        'a  a  a',
        '   a   ',
        '   a   ',
        '   a   ',
        '   a   ',
        'a  a  a',
        'aaaaaaa'], pal, 1, true);
	var lowerI = new Image([
        '  a ',
        '    ',
        ' aaa',
        '  a ',
        '  a ',
        '  a ',
        '  a ',
        ' aaa'], pal, 1, true);
	var upperJ = new Image([
        'aaaaaaaa',
        'a    a a',
        '     a  ',
        '     a  ',
        '     a  ',
        'a    a  ',
        'a    a  ',
        ' aaaa   '], pal, 1, true);
	var lowerJ = new Image([
        '    a ',
        '      ',
        '   aaa',
        '    a ',
        '    a ',
        '    a ',
        '    a ',
        '    a ',
        '    a ',
        '    a ',
        'a   a ',
        ' aaa  '], pal, 1, true);
	var upperK = new Image([
        'aaa  aaa',
        ' a    a ',
        ' a   a  ',
        ' aaaa   ',
        ' a   a  ',
        ' a    a ',
        ' a    a ',
        'aa   aaa'], pal, 1, true);
	var lowerK = new Image([
        ' aaa   ',
        '  a    ',
        '  a aaa',
        '  a  a ',
        '  aaa  ',
        '  a  a ',
        '  a  a ',
        ' aa aaa'], pal, 1, true);
	var upperL = new Image([
        'aaa    ',
        ' a     ',
        ' a     ',
        ' a     ',
        ' a     ',
        ' a     ',
        ' a    a',
        'aaaaaaa'], pal, 1, true);
	var lowerL = new Image([
        ' aa ',
        '  a ',
        '  a ',
        '  a ',
        '  a ',
        '  a ',
        '  a ',
        '  aa'], pal, 1, true);
	var upperM = new Image([
        'aa    aa',
        ' aa  aa ',
        ' a aa a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        'aaa  aaa'], pal, 1, true);
	var lowerM = new Image([
        '            ',
        '            ',
        ' aa aa  aa  ',
        '  aa  aa  a ',
        '  a   a   a ',
        '  a   a   a ',
        '  a   a   a ',
        ' aaa aaa aaa'], pal, 1, true);
	var upperN = new Image([
        'aa   aaa',
        ' aa   a ',
        ' a a  a ',
        ' a  a a ',
        ' a   aa ',
        ' a    a ',
        ' a    a ',
        'aaa  aaa'], pal, 1, true);
	var lowerN = new Image([
        '        ',
        '        ',
        ' aa aa  ',
        '  aa  a ',
        '  a   a ',
        '  a   a ',
        '  a   a ',
        ' aaa aaa'], pal, 1, true);
	var upperO = new Image([
        '  aaaa  ',
        ' a    a ',
        'a      a',
        'a      a',
        'a      a',
        'a      a',
        ' a    a ',
        '  aaaa  '], pal, 1, true);
	var lowerO = new Image([
        '      ',
        '      ',
        '  aaa ',
        ' a   a',
        ' a   a',
        ' a   a',
        ' a   a',
        '  aaa '], pal, 1, true);
	var upperP = new Image([
        'aaaaa ',
        ' a   a',
        ' a   a',
        ' a   a',
        ' aaaa ',
        ' a    ',
        ' a    ',
        'aaa   '], pal, 1, true);
	var lowerP = new Image([
        '       ',
        '       ',
        ' aaaaa ',
        '  a   a',
        '  a   a',
        '  a   a',
        '  a   a',
        ' aaaaa ',
        '  a    ',
        '  a    ',
        '  a    ',
        ' aaa   '], pal, 1, true);
	var upperQ = new Image([
        '  aaaa  ',
        ' a    a ',
        'a      a',
        'a      a',
        'a      a',
        'a   aa a',
        ' a    a ',
        '  aaaa a'], pal, 1, true);
	var lowerQ = new Image([
        '        ',
        '        ',
        '  aaaa  ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        '  aaaaa ',
        '      a ',
        '      a ',
        '      a ',
        '       a'], pal, 1, true);
	var upperR = new Image([
        'aaaaaa ',
        ' a    a',
        ' a    a',
        ' aaaaa ',
        ' a  a  ',
        ' a   a ',
        ' a   a ',
        'aaa aaa'], pal, 1, true);
	var lowerR = new Image([
        '       ',
        '       ',
        ' aa aa ',
        '  aa  a',
        '  a    ',
        '  a    ',
        '  a    ',
        ' aaa   '], pal, 1, true);
	var upperS = new Image([
        ' aaaa ',
        'a    a',
        'a     ',
        ' aaaa ',
        '     a',
        'a    a',
        'a    a',
        ' aaaa '], pal, 1, true);
	var lowerS = new Image([
        '      ',
        '      ',
        '  aaa ',
        ' a   a',
        '  aa  ',
        '    a ',
        ' a   a',
        '  aaa '], pal, 1, true);
	var upperT = new Image([
        'aaaaaaa',
        'a  a  a',
        '   a   ',
        '   a   ',
        '   a   ',
        '   a   ',
        '   a   ',
        '  aaa  '], pal, 1, true);
	var lowerT = new Image([
        '  a ',
        '  a ',
        ' aaa',
        '  a ',
        '  a ',
        '  a ',
        '  a ',
        '   a'], pal, 1, true);
	var upperU = new Image([
        'aaa  aaa',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        ' a    a ',
        '  aaaa  '], pal, 1, true);
	var lowerU = new Image([
        '        ',
        '        ',
        ' aaa aaa',
        '  a   a ',
        '  a   a ',
        '  a   a ',
        '  a   a ',
        '   aaa a'], pal, 1, true);
	var upperV = new Image([
        'a     a',
        'a     a',
        'a     a',
        ' a   a ',
        ' a   a ',
        ' a   a ',
        '  a a  ',
        '   a   '], pal, 1, true);
	var lowerV = new Image([
        '      ',
        '      ',
        ' a   a',
        ' a   a',
        ' a   a',
        '  a a ',
        '  a a ',
        '   a  '], pal, 1, true);
	var upperW = new Image([
        'a  aaa  a',
        'a   a   a',
        'a   a   a',
        'a   a   a',
        ' a a a a ',
        ' a a a a ',
        ' a a a a ',
        '  a   a  '], pal, 1, true);
	var lowerW = new Image([
        '        ',
        '        ',
        ' a     a',
        ' a  a  a',
        ' a  a  a',
        ' a a a a',
        '  aa aa ',
        '  a   a '], pal, 1, true);
	var upperX = new Image([
        'aaa  aaa',
        ' a    a ',
        '  a  a  ',
        '   aa   ',
        '   aa   ',
        '  a  a  ',
        ' a    a ',
        'aaa  aaa'], pal, 1, true);
	var lowerX = new Image([
        '        ',
        '        ',
        ' aaa aaa',
        '  a   a ',
        '   aaa  ',
        '   a a  ',
        '  a   a ',
        ' aaa aaa'], pal, 1, true);
	var upperY = new Image([
        'aaa aaa',
        ' a   a ',
        ' a   a ',
        ' a   a ',
        '  a a  ',
        '   a   ',
        '   a   ',
        '  aaa  '], pal, 1, true);
	var lowerY = new Image([
        '        ',
        '        ',
        'aaa  aaa',
        ' a    a ',
        ' a    a ',
        '  a  a  ',
        '  a  a  ',
        '   aa   ',
        '    a   ',
        '   a    ',
        '   a    ',
        '  a     ',], pal, 1, true);
	var upperZ = new Image([
        'aaaaaaa',
        'a     a',
        '    aa ',
        '   a   ',
        '  a    ',
        ' a     ',
        'a     a',
        'aaaaaaa'], pal, 1, true);
	var lowerZ = new Image([
        '       ',
        '       ',
        ' aaaaaa',
        ' a   a ',
        '   aa  ',
        '  a    ',
        ' a    a',
        ' aaaaaa'], pal, 1, true);
	var doubleQuotes = new Image([
        ' a a ',
        ' a a '], pal, 1, true);
	var singleQuotes = new Image([
        ' a ',
        ' a '], pal, 1, true);
	var period = new Image([
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        ' a'], pal, 1, true);
	var comma = new Image([
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        ' a',
        ' a',
        'a '], pal, 1, true);
	var colon = new Image([
        '  ',
        ' a',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        ' a'], pal, 1, true);
	var semiColon = new Image([
		'  ',
        ' a',
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        ' a',
        ' a',
        'a '], pal, 1, true);
	var exclamationPoint = new Image([
        ' a',
        ' a',
        ' a',
        ' a',
        ' a',
        ' a',
        '  ',
        ' a'], pal, 1, true);
	var questionMark = new Image([
        '  aaaa ',
        ' a    a',
        '      a',
        '    aa ',
        '   a   ',
        '   a   ',
        '       ',
        '   a   '], pal, 1, true);
	var parRight = new Image([
        ' a  ',
        '  a ',
        '   a',
        '   a',
        '   a',
        '   a',
        '  a ',
        ' a  '], pal, 1, true);
	var parLeft = new Image([
        '   a',
        '  a ',
        ' a  ',
        ' a  ',
        ' a  ',
        ' a  ',
        '  a ',
        '   a'], pal, 1, true);
	var numeral1 = new Image([
        '   a  ',
        '  aa  ',
        ' a a  ',
        '   a  ',
        '   a  ',
        '   a  ',
        '   a  ',
        ' aaaaa'], pal, 1, true);
	var numeral2 = new Image([
        '  aaa ',
        ' a   a',
        ' a   a',
        '    a ',
        '   a  ',
        '  a   ',
        ' a   a',
        ' aaaaa'], pal, 1, true);
	var numeral3 = new Image([
        '  aaa ',
        ' a   a',
        '     a',
        '   aa ',
        '     a',
        '     a',
        ' a   a',
        '  aaa '], pal, 1, true);
	var numeral4 = new Image([
        '  a  a ',
        '  a  a ',
        ' a   a ',
        ' a   a ',
        ' aaaaaa',
        '     a ',
        '     a ',
        '    aaa'], pal, 1, true);
	var numeral5 = new Image([
        ' aaaaa',
        ' a    ',
        ' a    ',
        '  aaa ',
        '     a',
        '     a',
        ' a   a',
        '  aaa '], pal, 1, true);
	var numeral6 = new Image([
        '   aaa',
        '  a   ',
        ' a    ',
        ' aaaa ',
        ' a   a',
        ' a   a',
        ' a   a',
        '  aaa '], pal, 1, true);
	var numeral7 = new Image([
        ' aaaaaa',
        '      a',
        '     a ',
        '    a  ',
        '    a  ',
        '   a   ',
        '   a   ',
        '   a   '], pal, 1, true);
	var numeral8 = new Image([
        '  aaa ',
        ' a   a',
        ' a   a',
        '  aaa ',
        ' a   a',
        ' a   a',
        ' a   a',
        '  aaa '], pal, 1, true);
	var numeral9 = new Image([
        '  aaa ',
        ' a   a',
        ' a   a',
        ' a   a',
        '  aaaa',
        '     a',
        '    a ',
        '  aa  '], pal, 1, true);
	var numeral0 = new Image([
        '   aaa  ',
        '  a   a ',
        ' a     a',
        ' a  a  a',
        ' a     a',
        ' a     a',
        '  a   a ',
        '   aaa  '], pal, 1, true);
}
// enemy images
{
	var slimeImage = new Image([
        '      aaaa      ',
        '     acccca     ',
        '     acddca     ',
        '    acddddca    ',
        '    acddddca    ',
        '    accddcca    ',
        '    acccccca    ',
        '    abccccba    ',
        '    abbbbbba    ',
        '    abaddaba    ',
        '    abaddaba    ',
        '    abddddba    ',
        '    abccccba    ',
        '     aaaaaa     ',
        '                ',
        '                '], pal);
}
// item tiles
{
	var boogerImage = new Image([
        '                ',
        '                ',
        '  aaaaaaaaaaaa  ',
        '  aaaaaaaaaaaa  ',
        '  aaaaaaaaaaaa  ',
        '  aaaaabccaaaa  ',
        '  aaaacccbbaaa  ',
        '  aaacccbcbaaa  ',
        '  aaaccbcbbaaa  ',
        '  aaaabcbaaaaa  ',
        '  aaaaabaaaaaa  ',
        '  aaaaaaaaaaaa  ',
        '  aaaaaaaaaaaa  ',
        '  aaaaaaaaaaaa  ',
        '                ',
        '                '], pal);
}
var textKeys = {
	'A': upperA,
	'a': lowerA,
	'B': upperB,
	'b': lowerB,
	'C': upperC,
	'c': lowerC,
	'D': upperD,
	'd': lowerD,
	'E': upperE,
	'e': lowerE,
	'F': upperF,
	'f': lowerF,
	'G': upperG,
	'g': lowerG,
	'H': upperH,
	'h': lowerH,
	'I': upperI,
	'i': lowerI,
	'J': upperJ,
	'j': lowerJ,
	'K': upperK,
	'k': lowerK,
	'L': upperL,
	'l': lowerL,
	'M': upperM,
	'm': lowerM,
	'N': upperN,
	'n': lowerN,
	'O': upperO,
	'o': lowerO,
	'P': upperP,
	'p': lowerP,
	'Q': upperQ,
	'q': lowerQ,
	'R': upperR,
	'r': lowerR,
	'S': upperS,
	's': lowerS,
	'T': upperT,
	't': lowerT,
	'U': upperU,
	'u': lowerU,
	'V': upperV,
	'v': lowerV,
	'W': upperW,
	'w': lowerW,
	'X': upperX,
	'x': lowerX,
	'Y': upperY,
	'y': lowerY,
	'Z': upperZ,
	'z': lowerZ,
	' ': space,
	'.': period,
	',': comma,
	'(': parLeft,
	')': parRight,
	'\"': doubleQuotes,
	'\'': singleQuotes,
	'?': questionMark,
	'!': exclamationPoint,
	':': colon,
	';': semiColon,
	'1': numeral1,
	'2': numeral2,
	'3': numeral3,
	'4': numeral4,
	'5': numeral5,
	'6': numeral6,
	'7': numeral7,
	'8': numeral8,
	'9': numeral9,
	'0': numeral0
};
var texts = [];

var Text = function (text, size, color) {
	this.text = text;
	this.size = size;
	this.color = color;
	texts.push(this);
};
Text.prototype.load = function () {
	this.lines = this.text.split('\n').length;
	this.width = [];
	var tempWidth = 0;
	this.height = this.lines * 8 + (this.lines - 1) + 4;
	for(var i = 0; i < this.text.length; i++) {
		if(this.text[i] === '\n' || i === this.text.length - 1) {
			this.width.push(tempWidth);
			tempWidth = 0;
		} else if(this.text[i] === '\t') {
			tempWidth += 32;
		} else if(textKeys[this.text[i]].p !== undefined) {
			tempWidth += textKeys[this.text[i]].width;
		}
	}
	this.width = arrayMax(this.width);
	this.p = createGraphics(this.width + 8, this.height, JAVA2D);
	this.p.noStroke();
	this.p.background(0, 0, 0, 0);
	var x = 0;
	var y = 0;
	for(var i = 0; i < this.text.length; i++) {
		if(this.text[i] === '\n') {
			y += 9;
			x = 0;
		} else if(this.text[i] === '\t') {
			x += 32;
		} else if(textKeys[this.text[i]].p !== undefined) {
			var tempImage = textKeys[this.text[i]];
			this.index = tempImage.colorKeys.indexOf(this.color);
			this.p.image(tempImage.p[this.index], x, y);
			x += tempImage.width;
		} else {
			textKeys[this.text[i]].load();
			println('image called in text before loaded: forced load');
		}
	}
	this.p = this.p.get();
};
Text.prototype.draw = function (x, y) {
	image(this.p, x, y);
};
var PixelNumber = function (number, x, y, color) {
	number = String(number);
	var tempX = x;
	for(var i = 0; i < number.length; i++) {
		var tempImage = textKeys[number[i]];
		var colorIndex = tempImage.colorKeys.indexOf(color);
		image(tempImage.p[colorIndex], tempX, y);
		tempX += tempImage.width;
	}
};
var PixelText = function (string, x, y, color) {
	var temp = {
		x: x,
		y: y,
	};
	for(var i = 0; i < string.length; i++) {
		if(string[i] === '~' && string[i + 2] === '~') {
			color = string[i + 1];
			i+=2;
		} else if(string[i] === '\n') {
			temp.y += 9;
			temp.x = x;
		} else if(string[i] === '\t') {
			temp.x += 32;
		} else if(textKeys[string[i]].p !== undefined) {
			var tempImage = textKeys[string[i]];
			var index = tempImage.colorKeys.indexOf(color);
			image(tempImage.p[index], temp.x, temp.y);
			temp.x += tempImage.width;
		} else {
			textKeys[string[i]].load();
			println('image called in text before loaded: forced load');
		}
	}
};

var animations = [];
var Animation = function (frames, colors, speed) {
	this.frames = frames;
	this.colors = colors;
	this.speed = speed;
	animations.push(this);
}; // the animation constructor function
Animation.prototype.load = function () {
	this.a = []; // stores all the final image frames
	this.frame = 0; // the current frame
	this.width = this.frames[0][0].length * PIXEL_SIZE; // sets the image width
	this.height = this.frames[0].length * PIXEL_SIZE; // sets the image height
	this.offset = {
		x: (this.width - (REAL_SIZE))/2, // sets the tile x-offset
		y: this.height - (REAL_SIZE) // sets the tile y-offset
	};
	// loops through the frames
	for(var i = 0; i < this.frames.length; i++) {
		this.p = createGraphics(this.width, this.height, JAVA2D); // creates the graphics
		this.p.background(0, 0, 0, 0); // sets the background to transparent
		this.p.noStroke();
		// loops through the pixmaps
		for(var y = 0; y < this.frames[i].length; y++) {
			for(var x = 0; x < this.frames[i][y].length; x++) {
				this.p.fill(pal[this.frames[i][y][x]]); // sets the pixel color
				this.p.rect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE); // draws the pixels
			}
		}
		this.p = this.p.get(); // return the image
		this.a.push(this.p); // pushes the image to the array
	}
}; // loads the animation
Animation.prototype.draw = function (x, y) {
	if(x === undefined) {
		x = Player['loc']['x'];
	}
	if(y === undefined) {
		y = Player['loc']['y'];
	}
	if(this.a === undefined) {
		this.load();
		println('animation drawn without loading: forced load');
	}
	this.frame += 1/ (this.speed * FRAME_RATE / this.a.length); // sets the animation speed
	// resets the animation once the program has looped through the frames
	if(this.frame > this.a.length - 1) {
		this.frame = 0;
	}
	image(this.a[round(this.frame)], x - this.offset.x, y - this.offset.y); // draws the image of the current frame
}; // draws an animation
Animation.prototype.reset = function () {
	this.frame = 0;
}; // resets the animation
Animation.prototype.static = function (frame, x, y) {
	if(x === undefined) {
		x = Player['loc']['x'];
	}
	if(y === undefined) {
		y = Player['loc']['y'];
	}
	if(this.a === undefined) {
		this.load();
		println('static animation drawn without loading: forced load');
	}
	image(this.a[frame], x - this.offset.x, y - this.offset.y);
};
{
	Player['animation']['up'] = new Animation([
		[
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbbbbbaaaaa',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbbbbbaaaaa',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbbbbbaaaaa',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbbbbbaaaaa',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbbbbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbbbbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbbbbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbbbbbbba  ',
        ' abbbbbccbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbbbbbba   ',
        '  abbbbccbbbba  ',
        ' abbbbbccbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbbbbba    ',
        '   abbbccbbba   ',
        '  abbbbccbbbba  ',
        ' abbbbbccbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abbbba     ',
        '    abbccbba    ',
        '   abbbccbbba   ',
        '  abbbbccbbbba  ',
        ' abbbbbccbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      abba      ',
        '     abccba     ',
        '    abbccbba    ',
        '   abbbccbbba   ',
        '  abbbbccbbbba  ',
        ' abbbbbccbbbbba ',
        'abbbbbbccbbbbbba',
        'aaaaabbccbbaaaaa',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    aaaaaaaa    '],
    ], pal, 0.60);
	Player['animation']['down'] = new Animation([
	[
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        'aaaaabbbbbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        'aaaaabbbbbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        '    abbbbbba    ',
        'aaaaabbbbbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbbbbba    ',
        'aaaaabbbbbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbbbbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbbbbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbbbbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbccbbbbba ',
        '  abbbbbbbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbccbbbbba ',
        '  abbbbccbbbba  ',
        '   abbbbbbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbccbbbbba ',
        '  abbbbccbbbba  ',
        '   abbbccbbba   ',
        '    abbbbbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbccbbbbba ',
        '  abbbbccbbbba  ',
        '   abbbccbbba   ',
        '    abbccbba    ',
        '     abbbba     ',
        '      abba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '    aaaaaaaa    ',
        '    abbbbbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        '    abbccbba    ',
        'aaaaabbccbbaaaaa',
        'abbbbbbccbbbbbba',
        ' abbbbbccbbbbba ',
        '  abbbbccbbbba  ',
        '   abbbccbbba   ',
        '    abbccbba    ',
        '     abccba     ',
        '      abba      ',
        '       aa       '],
    ], pal, 0.60);
	Player['animation']['left'] = new Animation([
		[
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbbbbbbcba',
        'abbbbbbbbbbbbcba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbbbbbccba',
        'abbbbbbbbbbbccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbbbbcccba',
        'abbbbbbbbbbcccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbbbccccba',
        'abbbbbbbbbccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbbcccccba',
        'abbbbbbbbcccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbbccccccba',
        'abbbbbbbccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbbcccccccba',
        'abbbbbbcccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbbccccccccba',
        'abbbbbccccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbbcccccccccba',
        'abbbbcccccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbbccccccccccba',
        'abbbccccccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abbcccccccccccba',
        'abbcccccccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '      aba       ',
        '     abba       ',
        '    abbba       ',
        '   abbbbaaaaaaaa',
        '  abbbbbbbbbbbba',
        ' abbbbbbbbbbbbba',
        'abccccccccccccba',
        'abccccccccccccba',
        ' abbbbbbbbbbbbba',
        '  abbbbbbbbbbbba',
        '   abbbbaaaaaaaa',
        '    abbba       ',
        '     abba       ',
        '      aba       ',
        '       aa       '],
    ], pal, 0.60);
	Player['animation']['right'] = new Animation([
		[
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcbbbbbbbbbbbba',
        'abcbbbbbbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccbbbbbbbbbbba',
        'abccbbbbbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcccbbbbbbbbbba',
        'abcccbbbbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccccbbbbbbbbba',
        'abccccbbbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcccccbbbbbbbba',
        'abcccccbbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccccccbbbbbbba',
        'abccccccbbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcccccccbbbbbba',
        'abcccccccbbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccccccccbbbbba',
        'abccccccccbbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcccccccccbbbba',
        'abcccccccccbbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccccccccccbbba',
        'abccccccccccbbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
        [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abcccccccccccbba',
        'abcccccccccccbba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
       [
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '       aa       ',
        '       aba      ',
        '       abba     ',
        '       abbba    ',
        'aaaaaaaabbbba   ',
        'abbbbbbbbbbbba  ',
        'abbbbbbbbbbbbba ',
        'abccccccccccccba',
        'abccccccccccccba',
        'abbbbbbbbbbbbba ',
        'abbbbbbbbbbbba  ',
        'aaaaaaaabbbba   ',
        '       abbba    ',
        '       abba     ',
        '       aba      ',
        '       aa       '],
    ], pal, 0.60);
} // stores all of the animations

var tiles = [];
var Tile = function (image, type) {
	this.image = image;
	this.type = type;
	tiles.push(this);
}; // the tile constructor function
Tile.prototype.load = function () {
	// detects if the tile is a composition of different images
	if(this.image.constructor === Array) {
		this.width = this.image[0].width; // sets the width to that of the first image
		this.height = this.image[0].height; // sets the height to that of the first image
	} else {
		this.width = this.image.width; // sets the width
		this.height = this.image.height; // sets the height
	}
};
Tile.prototype.draw = function (x, y) {
	// detects if the tile is a composition of different images
	if(this.image.constructor === Array) {
		// draws all the images if it is a composite
		for(var i = 0; i < this.image.length; i++) {
			if(this.image[i].width !== undefined) {
				this.image[i].draw(x, y);
			} else {
				this.image[i].load();
				println('composite tile image not loaded on start: forced load');
			}
		}
	} else {
		if(this.image.width !== undefined) {
			// draws the image
			this.image.draw(x, y);
		} else {
			this.image.load();
			println('tile image not loaded on start: forced load');
		}
	}
}; // draws the tile
Tile.prototype.collide = function (x1, y1, x2, y2, w, h) {
	var cols = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	if(x2 + w > x1 && x2 + w < x1 + this.width / 3 && y2 + h > y1 && y2 < y1 + this.height) {
		// detects if something overlaps with the tile to the left
		cols.left = true;
	} else {
		cols.left = false;
	}
	if(x2 < x1 + this.width && x2 > x1 + this.width - this.width / 3 && y2 + h > y1 && y2 < y1 + this.height) {
		// detects if something overlaps with the tile to the right
		cols.right = true;
	} else {
		cols.right = false;
	}
	if(x2 + w > x1 && x2 < x1 + this.width && y2 + h > y1 && y2 + h < y1 + this.height / 3) {
		// detects if something overlaps with the top of the tile
		cols.up = true;
	} else {
		cols.up = false;
	}
	if(x2 + w > x1 && x2 < x1 + this.width && y2 < y1 + this.height && y2 > y1 + this.height - this.height / 3) {
		// detects if something overlaps with the bottom of the tile
		cols.down = true;
	} else {
		// if there are no collisions
		cols.down = false;
	}
	return cols;
}; // detects if the tile is colliding
var tileKeys = {
	'a': new Tile(grass, 'walkable'),
	'b': new Tile([grass, rock], 'solid')
}; // stores all of the tiles and their keys

var gui = {
	'a': new Tile(top, 'basic'),
	'b': new Tile(bottom, 'basic'),
	'c': new Tile(left, 'basic'),
	'd': new Tile(right, 'basic'),
	'e': new Tile(topLeft, 'basic'),
	'f': new Tile(topRight, 'basic'),
	'g': new Tile(bottomLeft, 'basic'),
	'h': new Tile(bottomRight, 'basic'),
	'j': new Tile(middle, 'basic'),
	'k': new Tile(slot, 'slot'),
	'l': new Tile(slotTop, 'slot'),
	'm': new Tile(slotBottom, 'slot'),
	'n': new Tile(slotLeft, 'slot'),
	'o': new Tile(slotRight, 'slot'),
	'p': new Tile(slotTopLeft, 'slot'),
	'q': new Tile(slotTopRight, 'slot'),
	'r': new Tile(slotBottomLeft, 'slot'),
	's': new Tile(slotBottomRight, 'slot'),
	't': new Tile(barLeft, 'bar'),
	'u': new Tile(barRight, 'bar'),
	'v': new Tile(barMiddle, 'bar'),
	'w': new Tile(characterIcon, 'character'),
	'y': new Tile(spellBookIcon, 'spellbook'),
	'z': new Tile(questLogIcon, 'questlog'),
	'A': new Tile(headSlot, 'head'),
	'B': new Tile(neckSlot, 'neck'),
	'C': new Tile(shoulderSlot, 'shoulders'),
	'D': new Tile(wristSlot, 'wrists'),
	'E': new Tile(handSlot, 'hands'),
	'F': new Tile(fingerSlot, 'finger'),
	'G': new Tile(waistSlot, 'waist'),
	'H': new Tile(legSlot, 'legs'),
	'I': new Tile(footSlot, 'feet'),
	'J': new Tile(mainHandSlot, 'mainhand'),
	'K': new Tile(offHandSlot, 'offhand'),
	'L': new Tile(emptyBagSlot, 'bagSlot'),
	'M': new Tile(chestSlot, 'chest'),
	'*': new Tile(acceptButton, 'accept'),
	'x': new Tile(closeButton, 'close') 
}; // stores all of the gui tiles
var slots = {
	'k': true, 
	'l': true,
	'm': true,
	'n': true,
	'o': true,
	'p': true,
	'q': true,
	'r': true,
	's': true
};
var guis = [];
var Gui = function (tilemap) {
	this.tilemap = tilemap;
	this.open = false;
	guis.push(this);
};
Gui.prototype.load = function () {
	this.width = this.tilemap[0].length * REAL_SIZE; // sets the width
	this.height = this.tilemap.length * REAL_SIZE; // sets the height
	this.tiles = []; // stores all of the tiles to later detect user interaction
	this.slots = [];
	
	this.p = createGraphics(this.width, this.height, JAVA2D);
	this.p.background(0, 0, 0, 0);
	this.p.noStroke();

	// loops through the tilemap
	for(var y = 0; y < this.tilemap.length; y++) {
		for(var x = 0; x < this.tilemap[y].length; x++) {
			var t = gui[this.tilemap[y][x]];
			var b = t.image;
			if(slots[this.tilemap[y][x]]) {
				this.slots.push({
					x: x * REAL_SIZE - b.offset.x,
					y: y * REAL_SIZE - b.offset.y
				});
			} // stores the coordinates of the slots
			this.tiles.push({
				tile: t, 
				x: x * REAL_SIZE - b.offset.x,
				y: y * REAL_SIZE - b.offset.y
			}); // adds the tiles to the array to later detect user interaction
			if(b.p !== undefined) {
				// draws the image if it is defined
				this.p.image(b.p, x * REAL_SIZE - b.offset.x, y * REAL_SIZE - b.offset.y);
			} else {
				b.load();
				println('image called in gui: forced load');
			} // loads the image if it is undefined
		}
	}
	this.p = this.p.get(); // stores the entire gui as an image
};
Gui.prototype.draw = function (x, y) {
	// draws the gui
	if(this.p !== undefined) {
		image(this.p, x, y); // draws the gui image
		for(var i = 0; i < this.tiles.length; i++) {
			var t = this.tiles[i];
			if(t.tile.type === 'close' && Hover(t.x + x, t.y + y, 32, 32)) {
				if(mouseIsPressed && newClick) {
					newClick = false;
					this.open = false;
				}
			} // detects if a close button is clicked
		} // loops through all of the tiles
	} else {
		println('gui not loaded on start: forced load');
		this.load();
	} // loads the gui if it is not loaded
};
{
	var Alert = function (tilemap) {
		Gui.call(this, tilemap, open);
	};
	Alert.prototype = Object.create(Gui.prototype);
	Alert.prototype.constructor = Alert;
	Alert.prototype.draw = function(x, y, text) {
		// draws the gui
		if(this.p !== undefined) {
			var temp = {
				x: 0,
				y: 0,
			};
			if(x + this.width <= width) {
				temp.x = x;
			} else if (x + this.width > width) {
				temp.x = x - this.width - REAL_SIZE;
			}
			if(y + this.height <= height) {
				temp.y = y;
			} else if(y + this.height > height) {
				temp.y = y - this.width + REAL_SIZE * 2;
			}

			image(this.p, temp.x, temp.y); // draws the gui image

			if(text !== undefined) {
				PixelText(text, temp.x + 4, temp.y + 4, GUI_TEXT_COLOR);
			}
		} else {
			println('gui not loaded on start: forced load');
			this.load();
		} // loads the gui if it is not loaded
	};
	var info = new Alert([
		'eaaf',
		'cjjd',
		'gbbh']);
} // the alert gui
{
	var Bar = function (tilemap) {
		Gui.call(this, tilemap);
	};
	Bar.prototype = Object.create(Gui.prototype);
	Bar.prototype.constructor = Bar;
	Bar.prototype.draw = function (x, y) {
		var tempBagIndex = 1;
		image(this.p, x, y);
		for(var i = 0; i < this.tiles.length; i++) {
			var t = this.tiles[i];
			var hover = Hover(t.x + x, t.y + y, REAL_SIZE, REAL_SIZE);
			if(t.tile.type === 'character' && hover) {
				info.draw(t.x + x, t.y + y - REAL_SIZE, 'Click to view armor');
				if(mouseIsPressed && newClick) {
					newClick = false;
					if(!Player['actions']['guis']['characterPane']) {
						Player['actions']['guis']['characterPane'] = true;
					} else {
						Player['actions']['guis']['characterPane'] = false;
					}
				}
			} // detects if a character pane is clicked
			if(t.tile.type === 'bagSlot') {
				if(Player['inventory']['bagSlots']['bag' + tempBagIndex] !== 'nothing') {
					items[Player['inventory']['bagSlots']['bag' + tempBagIndex]].draw(t.x + x, t.y + y);
					if(hover) {
						var tempText = items[Player['inventory']['bagSlots']['bag' + tempBagIndex]].text;
						info.draw(t.x + x, t.y + y - REAL_SIZE, tempText);
						if(mouseIsPressed && newClick) {
							newClick = false;
							if(mouseButton === 37) {
								if(Player['actions']['guis']['bag' + tempBagIndex]) {
									Player['actions']['guis']['bag' + tempBagIndex] = false;
								} else {
									Player['actions']['guis']['bag' + tempBagIndex] = true;
								}
							} else {
								if(Player.calcBagSpace() - items[Player['inventory']['bagSlots']['bag' + tempBagIndex]].slots > 0) {
									var tempBag = Player['inventory']['bagSlots']['bag' + tempBagIndex];
									Player['inventory']['bagSlots']['bag' + tempBagIndex] = 'nothing';
									items[tempBag].store();
								}
							}
						}
					}
				}
				tempBagIndex++;
			}
		} // loops through all of the tiles
	};
	Player['bar'] = new Bar(['kkkkkwyzLLLLL']);
} // the bar gui
{
	var CharacterPane = function (tilemap) {
		Gui.call(this, tilemap);
	};
	CharacterPane.prototype = Object.create(Gui.prototype);
	CharacterPane.prototype.constructor = CharacterPane;
	CharacterPane.prototype.draw = function (x, y) {
		if(Player['actions']['guis']['characterPane']) {
			image(this.p, x, y);
			for(var i = 0; i < this.tiles.length; i++) {
				var t = this.tiles[i];
				var hover = Hover(t.x + x, t.y + y, REAL_SIZE, REAL_SIZE);
				if(t.tile.type === 'close' && hover) {
					if(mouseIsPressed && newClick) {
						newClick = false;
						Player['actions']['guis']['characterPane'] = false;
					}
				} // detects if a close button is clicked
				var tempArmorSlot = Player['inventory']['equipment'][t.tile.type];
				if(tempArmorSlot !== 'nothing' && tempArmorSlot !== undefined) {
					items[Player['inventory']['equipment'][t.tile.type]].draw(t.x + x, t.y + y);
					if(hover) {
						info.draw(t.x + REAL_SIZE, t.y, items[Player['inventory']['equipment'][t.tile.type]].text + 'click to dequip');
						if(mouseIsPressed && newClick) {
							newClick = false;
							if(Player.calcBagSpace() > 0) {
								items[Player['inventory']['equipment'][t.tile.type]].dequip();
							}
						}
					}
				}
			}
		}
	};
	Player['characterPane'] = new CharacterPane([
		'jjjx',
		'AjjM',
		'BjjF',
		'CjjG',
		'DjjH',
		'EJKI',]);
} // character gui
{
	var HealthBar = function (tilemap) {
		Gui.call(this, tilemap);
	};
	HealthBar.prototype = Object.create(Gui.prototype);
	HealthBar.prototype.constructor = HealthBar;
	HealthBar.prototype.draw = function (x, y, curFortitude, fortitude, curEndurance, endurance, vitality, vigor) {
		if(fortitude === undefined) {
			curFortitude = 0;
			fortitude = 0;
			curEndurance = 0;
			endurance = 0;
			vitality = 0;
			vigor = 0;
		}
		image(this.p, x, y);
		fill(pal['d']);
		noStroke();
		rect(x + PIXEL_SIZE * 2, y + PIXEL_SIZE * 4, curFortitude/fortitude * 88, PIXEL_SIZE * 3);
		PixelNumber(floor(curFortitude), x + PIXEL_SIZE * 2, y + PIXEL_SIZE * 3.5, 'a');
		fill(pal['c']);
		rect(x + PIXEL_SIZE * 2, y + PIXEL_SIZE * 9, curEndurance/endurance * 88, PIXEL_SIZE * 3);
		PixelNumber(floor(curEndurance), x + PIXEL_SIZE * 2, y + PIXEL_SIZE * 8.5, 'a');
	};
	Player['healthBar'] = new HealthBar(['tvu']);
} // the health bar
{
	var Bag = function (tilemap) {
		Gui.call(this, tilemap);
	};
	Bag.prototype = Object.create(Gui.prototype);
	Bag.prototype.constructor = Bag;
	Bag.prototype.draw = function (x, y, bagItems, index) {
		if(Player['actions']['guis'][index]) {
			// draws the gui
			if(this.p !== undefined) {
				image(this.p, x, y); // draws the gui image
				if(bagItems !== undefined) {
					var tempKeys = Object.keys(bagItems);
					for(var i = 0; i < tempKeys.length; i++) {
						var s = this.slots[i]; // assigns a slot to each bag value
						var temp = {
							x: s.x + x,
							y: s.y + y,
						}; // sets the x-coordinates of the slots
						temp.hov = Hover(temp.x, temp.y, REAL_SIZE, REAL_SIZE); // detects if the mouse is over the slot and item
						items[tempKeys[i]].draw(s.x + x, s.y + y); // draws the items
						PixelNumber(bagItems[tempKeys[i]], s.x + x, s.y + y, GUI_TEXT_COLOR);
	                    if(temp.hov) {
							info.draw(temp.x + REAL_SIZE, temp.y, items[tempKeys[i]].text);
							if(mouseIsPressed && newClick) {
								newClick = false;
								if(mouseButton === 37) {
									if(items[tempKeys[i]].useable()) {
										items[tempKeys[i]].use();
										if(bagItems[tempKeys[i]] > 1) {
											bagItems[tempKeys[i]]--;
										} else {
											delete bagItems[tempKeys[i]];
										}
									}
								} else {
									for(var j = 49; j < 54; j++) {
										if(keys[j]) {
											if(Player['inventory']['bagSlots']['bag' + (j - 48)] !== 'nothing') {
												var tempName = tempKeys[i];
												var tempAmount = bagItems[tempKeys[i]];
												delete bagItems[tempKeys[i]];
												items[tempName].move('bag' + (j - 48), tempAmount);
											}
										}
									}
								}
							}
						} // displays info about the items if they are hovered over
					} // loops through items in the bag
				} // detects if anything is in the bag
				for(var i = 0; i < this.tiles.length; i++) {
					var t = this.tiles[i];
					if(t.tile.type === 'close' && Hover(t.x + x, t.y + y, 32, 32)) {
						if(mouseIsPressed && newClick) {
							newClick = false;
							Player['actions']['guis'][index] = false;
						}
					} // detects if a close button is clicked
				}
			} else {
				println('gui not loaded on start: forced load');
				this.load();
			} // loads the gui if it is not loaded
		}
	};
} // the bag gui
{
	var bag8 = new Bag([
		'eaax',
		'nkko',
		'rmms'
	]);
} // stores the guis

var Enemy = function (image, name, maxLevel, minLevel, maxHit, minHit, loot) {
	this.image = image;
	this.name = name;
	this.maxLevel = maxLevel;
	this.minLevel = minLevel;
	this.maxHit = maxHit;
	this.minHit = minHit;
	this.loot = loot;
	entities['enemies'][this.name] = this;
};
Enemy.prototype.draw = function (x, y) {
	this.image.draw(x, y);
};
Enemy.prototype.fight = function () {};
Enemy.prototype.loot = function () {};
{
	var slime = new Enemy(slimeImage, 'slime', 12, 14, 20, 20, {});
}


var World = {maps: []};
var screens = [];
var Screen = function (x, y, z, map, entities) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.map = map;
	this.entities = entities;
	if(entities === undefined) {
		this.entities = {
			enemies: [],
			interactings: [],
			questGivers: [],
			vendors: []
		};
	}
	screens.push(this);
}; // the map constructor function
Screen.prototype.load = function () {
	this.width = this.map[0].length * REAL_SIZE; // sets the map width
	this.height = this.map.length * REAL_SIZE;  // sets the map height
	this.tiles = []; // stores the tiles
	this.storedEntities = [];
	// creates a new x array if it is not defined
	if(World.maps[this.x] === undefined) {
		World.maps[this.x] = [];
	}
	// creates a new y array if it is not defined
	if(World.maps[this.x][this.y] === undefined) {
		World.maps[this.x][this.y] = [];
	}
	this.p = createGraphics(this.width, this.height, JAVA2D);
	this.p.background(0, 0, 0, 0);
	this.p.noStroke();
	// loops through the map array
	for(var y = 0; y < this.map.length; y++) {
		for(var x = 0; x < this.map[y].length; x++) {
			var b = tileKeys[this.map[y][x]];
			this.tiles.push({
				tile: b, 
				x: x * REAL_SIZE,
				y: y * REAL_SIZE
			});
			if(b.image.constructor === Array) {
				for(var i = 0; i < b.image.length; i++) {
					if(b.image[i].width !== undefined) {
						this.p.image(b.image[i].p, x * REAL_SIZE, y * REAL_SIZE);
					} else {
						b.image[i].load();
						println('composite image not loaded in map function: forced load');
					}
				}
			} else {
				if(b.image.p !== undefined) {
					this.p.image(b.image.p, x * REAL_SIZE, y * REAL_SIZE);
				} else {
					b.image.load();
					println('image not loaded in map function: forced load');
				}
			}
		}
	}
	var entityKeys = Object.keys(this.entities);
	for(var i = 0; i < entityKeys.length; i++) {
		for(var j = 0; j < this.entities[entityKeys[i]].length; j++) {
			var b = this.entities[entityKeys[i]][j];
			var e = entities[entityKeys[i]][b['name']];
			this.p.image(e.image.p, b.x * REAL_SIZE, b.y * REAL_SIZE);
			this.storedEntities.push({
				name: b['name'],
				entity: e,
				x: b.x * REAL_SIZE,
				y: b.y * REAL_SIZE,
				type: entityKeys[i],
				level: round(random(e.minLevel, e.maxLevel))
			});
		}
	}
	this.p = this.p.get();
	World.maps[this.x][this.y][this.z] = this;
};
{
	var start = new Screen(0, 0, 0, [
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaabbaaaaaaaaaaaaaa',
	'aaaaaabaaaaaaaaaaaaaaaaa',
	'aaaaabbaaabbabaaaaaaaaaa',
	'aaaaaaaaabaaaaaaaaaaaaaa',
	'aaaaaabaaaabbbaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',
	'aaaaaaaaaaaaaaaaaaaaaaaa',], {
		'enemies': [
			{'name': 'slime', 'x': 4, 'y': 4}
		]
	});
}
World.draw = function (x, y, z) {
	var selMap = World.maps[x][y][z];
	image(selMap.p, 0, 0);
	for(var i = 0; i < selMap.tiles.length; i++) {
		var tile = selMap.tiles[i];
		var calc = tile.tile.collide(tile.x, tile.y, Player['colBox']['x'], Player['colBox']['y'], Player['colBox']['xSize'], Player['colBox']['ySize']);
		if(collisionBoxes && tile.tile.type === 'solid') {
			strokeWeight(2);
			noFill();
			stroke(255, 255, 0);
			rect(tile.x, tile.y, REAL_SIZE, REAL_SIZE);
		}
		if(calc.up) {
			if(tile.tile.type === 'solid') {
				Player['loc']['y'] += -Player['stats']['speed'];
			}
		}
		if(calc.down) {
			if(tile.tile.type === 'solid') {
				Player['loc']['y'] += Player['stats']['speed'];
			}
		}
		if(calc.left) {
			if(tile.tile.type === 'solid') {
				Player['loc']['x'] += -Player['stats']['speed'];
			}
		}
		if(calc.right) {
			if(tile.tile.type === 'solid') {
				Player['loc']['x'] += Player['stats']['speed'];
			}
		}
	}
	for(var i = 0; i < selMap.storedEntities.length; i++) {
		var e = selMap.storedEntities[i];
		if(Hover(e.x, e.y, REAL_SIZE, REAL_SIZE)) {
			info.draw(e.x + REAL_SIZE, e.y, e.name + '\nlevel ' + e.level);
		}
	}
	if(collisionBoxes) {
		strokeWeight(2);
		noFill();
		stroke(255, 0, 0);
		rect(Player['colBox']['x'], Player['colBox']['y'], Player['colBox']['xSize'], Player['colBox']['ySize']);
	}
};

var Item = function (name, image, buy, sell) {
	this.name = name;
	this.text = name;
	this.image = image;
	this.buy = buy;
	this.sell = sell;
	items[this.name] = this;
};
Item.prototype.draw = function (x, y) {
	this.image.draw(x, y);
};
Item.prototype.store = function () {
	for(var i = 1; i < 6; i++) {
		if(Player['inventory']['bagSlots']['bag' + i] !== 'nothing') {
			if(Player['inventory']['bags']['bag' + i][this.name] !== undefined) {
				Player['inventory']['bags']['bag' + i][this.name]++;
				break;
			} else {
				Player['inventory']['bags']['bag' + i][this.name] = 1;
				break;
			}
			/*var stored = false;
			for(var j = 0; j < Player['inventory']['bags']['bag' + i].length; j++) {
				if(Player['inventory']['bags']['bag' + i][j].item === this.name) {
					Player['inventory']['bags']['bag' + i][j].amount++;
					stored = true;
					break;
				}
			}
			var availableSlots = items[Player['inventory']['bagSlots']['bag' + i]].slots - Player['inventory']['bags']['bag' + i].length;
			if(availableSlots > 0 && !stored) {
				Player['inventory']['bags']['bag' + i].push({'item': this.name, 'amount': 1});
				break;
			}*/
		}
	}
};
Item.prototype.useable = function () {

	return true;
};
Item.prototype.move = function (destination, amount) {
	var tempSlots = Object.keys(Player['inventory']['bags'][destination]).length;
	var availableSlots = items[Player['inventory']['bagSlots'][destination]].slots - tempSlots;
	if(availableSlots > 0) {
		Player['inventory']['bags'][destination][this.name] = amount;
	}
};
{
	var Food = function (name, image, buy, sell, health) {
		Item.call(this, name, image, buy, sell);
		this.text = this.name + '\n\nRestores ' + health + ' health\nCannot be used in\ncombat\n\nclick to use';
		this.health = health;
	};
	Food.prototype = Object.create(Item.prototype);
	Food.prototype.constructor = Food;
	Food.prototype.use = function () {
		if(Player['stats']['fortitude'] < Player['stats']['maxFortitude']) {
			Player['stats']['fortitude'] += this.health;
		}
	};
} // food constructors
{
	var Drink = function (name, image, buy, sell, energy) {
		Item.call(this, name, image, buy, sell);
		this.text = this.name + '\n\nRestores ' + energy + ' energy\nCannot be used in\ncombat\n\nclick to use';
		this.energy = energy;
	};
	Drink.prototype = Object.create(Item.prototype);
	Drink.prototype.constructor = Food;
	Drink.prototype.use = function () {
		if(Player['stats']['curFortitude'] < Player['stats']['fortitude']) {
			Player['stats']['curFortitude'] += this.energy;
		}
	};
} // drink constructors
{
	var Drink = function (name, image, buy, sell, energy) {
		Item.call(this, name, image, buy, sell);
		this.text = this.name + '\n\nRestores ' + energy + ' energy\nCannot be used in\ncombat\n\nclick to use';
		this.energy = energy;
	};
	Drink.prototype = Object.create(Item.prototype);
	Drink.prototype.constructor = Drink;
	Drink.prototype.use = function () {
		if(Player['stats']['curEndurance'] < Player['stats']['endurance']) {
			Player['stats']['curEndurance'] += this.energy;
		}
	};
} // drink constructors
{
	var Armor = function (name, image, buy, sell, slot, stats) {
		Item.call(this, name, image, buy, sell);

		this.text = this.name + '\n' + slot + '\n';
		this.stats = stats;
		this.statKeys = Object.keys(stats);
		for(var i = 0; i < this.statKeys.length; i++) {
			this.text += this.statKeys[i] + ' ' + this.stats[this.statKeys[i]] + '\n';
		}
		this.slot = slot;
	};
	Armor.prototype = Object.create(Item.prototype);
	Armor.prototype.constructor = Armor;
	Armor.prototype.use = function () {
		Player['inventory']['equipment'][this.slot] = this.name;
		for(var i = 0; i < this.statKeys.length; i++) {
			var tempStat = this.stats[this.statKeys[i]];
			Player['stats'][this.statKeys[i]] += tempStat;
		}
	};
	Armor.prototype.dequip = function () {
		Player['inventory']['equipment'][this.slot] = 'nothing';
		for(var i = 0; i < this.statKeys.length; i++) {
			var tempStat = this.stats[this.statKeys[i]];
			Player['stats'][this.statKeys[i]] -= tempStat;
		}
		this.store();
	};
} // armor constructors
{
	var BagItem = function (name, image, buy, sell, slots) {
		Item.call(this, name, image, buy, sell);
		this.slots = slots;
		this.text = this.name + '\n' + this.slots + ' slot bag';
		if(this.slots === 8) {
			this.bag = bag8;
		}
	};
	BagItem.prototype = Object.create(Item.prototype);
	BagItem.prototype.constructor = BagItem;
	BagItem.prototype.use = function () {
		for(var i = 1; i < 6; i++) {
			if(Player['inventory']['bagSlots']['bag' + i] === 'nothing') {
				Player['inventory']['bagSlots']['bag' + i] = this.name;
				break;
			}
		}
	};
	BagItem.prototype.useable = function () {
		for(var i = 1; i < 6; i++) {
			if(Player['inventory']['bagSlots']['bag' + i] === 'nothing') {
				return true;
				break;
			} else if(i === 5) {
				return false;
			}
		}
	};
} // bag constructors
var booger = new Drink('booger', boogerImage, 12, 12, 25);
var helmet = new Armor('random chestplate', boogerImage, 12, 12, 'chest', {'vigor': 10});
var blueBag = new BagItem('blue bag', boogerImage, 12, 12, 8);
Player['inventory']['bags']['bag1'] = {'blue bag': 10, 'random chestplate': 1};
var loadAll = function () {
	fill(0, 0, 0);
	textAlign(CENTER, CENTER);
	background(225, 225, 225);
	if(images.length > 0) { // loads the images
		images[0].load();
		images.splice(0, 1);
		text('Loading Images\nremaining: ' + images.length, 384, 272);
	} else if(texts.length > 0) { // loads text
		texts[0].load();
		texts.splice(0, 1);
		text('Loading Texts\nremaining: ' + texts.length, 384, 272);
	} else if(animations.length > 0) { // loads animations
		animations[0].load();
		animations.splice(0, 1);
		text('Loading Animations\nremaining: ' + animations.length, 384, 272);
	} else if(guis.length > 0) { // loads guis
		guis[0].load();
		guis.splice(0, 1);
		text('Loading User Interface\nremaining: ' + guis.length, 384, 272);
	} else if(tiles.length > 0) { // loads tiles
		tiles[0].load();
		tiles.splice(0, 1);
		text('Loading Tiles\nremaining: ' + tiles.length, 384, 272);
	} else if(screens.length > 0) { // loads maps
		screens[0].load();
		World.draw(screens[0].x, screens[0].y, screens[0].z);
		screens.splice(0, 1);
		text('Loading Maps\nremaining: ' + screens.length, 384, 272);
	} else {
		loaded = true;
	}
};

draw = function () {
	if(!loaded) {
		loadAll();
	} else {
		World.draw(Player['loc']['scene']['x'], Player['loc']['scene']['y'], Player['loc']['scene']['z']);
		Player.movement();
		Player['bar'].draw(0, height - REAL_SIZE);
		Player['healthBar'].draw(0, 0, Player['stats']['curFortitude'], Player['stats']['fortitude'], Player['stats']['curEndurance'], Player['stats']['endurance'], Player['stats']['vitality'], Player['stats']['vigor']);
		Player.update();
	}
};
keyPressed = function () {
	keys[keyCode] = true;
	keyIsPressed = true;
};
keyReleased = function () {
	keys[keyCode] = false;
	keyIsPressed = false;
};
mousePressed = function () {
	mouseIsPressed = true;
};
mouseReleased = function () {
	mouseIsPressed = false;
	newClick = true;
};

}
};

// Get the canvas that ProcessingJS will use
var canvas = document.getElementById('canvas');

// Pass the function to ProcessingJS constructor
var processingInstance = new Processing(canvas, programCode);