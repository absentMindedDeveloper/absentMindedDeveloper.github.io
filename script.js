var programCode = function(processingInstance) {
	with(processingInstance) {
		size(996, 600);
		frameRate(60);
		var mouseIsPressed = false;
		
		// the maximum fade value
		var fade = 175;
		
		
		// function for text with a single column
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
		
		// function for text with two columns
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
			textLeading(this.size * 1.5);
			text(this.left, 480, 300);
			textAlign(LEFT, CENTER);
			text(this.right, 516, 300);
		};
		
		// stores all of the frames
		/** 
		 * 10 - nixon
		 * 13 - Sack
		 * 14 -second sack
		 * 15-18 moose stuff
		 * 19 - total sack
		 * 20 - change of credits
		 **/
		var frames = [
			new Text([]),
			new Text(['Evangel Classical School', 'presents'], 42),
			new Text(['The Grail'], 46),
			new Text(['probably influenced by', '', 'MONTY PYTHON', 'and the', 'HOLY GRAIL'], 32),
			new Text(['fine, fine', 'HEAVILY inspired by', '', 'MONTY PYTHON', 'and the ', 'HOLY GRAIL'], 32),
			new Text(['pretty much copied from', '', 'MONTY PYTHON', 'and the', 'HOLY GRAIL', '', 'now rated PG'], 32),
			new Text(['adapted and directed', 'by', 'MAGGIE HIGGINS'], 32),
			new Text(['facilities provided', 'by', 'RECLAMATION CHURCH'], 32),
			new SplitText(['Franz Overman', 'Gideon Marlatt', 'Laird Marlatt', 'Reese Paine', 'K̶e̶l̶l̶y̶ ̶D̶u̶r̶h̶a̶m̶', 'Kelly Durham'], ['King Arthur', 'Sir Bedevere', 'Sir Launcelot', 'Sir Robin', 'S̶i̶r̶ ̶H̶a̶d̶ ̶a̶ ̶g̶a̶l̶', 'Sir Gallahad'], 32),
			new Text(['also appearing', 'Bonnie Bour', 'Dineke Bour', 'Henry Callender', 'Gresham Callender', 'Theodore Callender', 'Thomas Callender', 'Cheyenne Crane'], 29),
			new Text(['also also appearing', 'Elizabeth Durham', 'Timothy Durham', 'Evelyn Funden', 'Bazen Hevia', 'Calvin Higgins', 'Autumn Marlatt', 'Natasha Pohli'], 29),
			new Text(['these people were here too', 'Tatyana Pohli', 'Abigail Sarr', 'Elizabeth Sarr', 'Aaron vanderBeken', 'Abigail vanderBeken', 'Isaiah vanderBeken', 'Veronika Yerina'], 29),
			new Text(['also featuring', 'the special voice talents', 'of', 'KAITLYN HALL'], 32),
			new Text(['Gastronomies prepared by', 'Jolie Hall', 'Kaitlyn Hall', 'Autumn Marlatt'], 30),
			new Text(['Practices chaperoned by', 'Arike Bour', 'Leila Bowers'], 30),
			new SplitText(['Stage manager', 'Assistant stage manager', 'Stage hands', '', '', ''], ['Thomas Callender', 'Kaitlyn Hall', 'Addison Hall', 'Merian Bowers', 'Anne Callender', 'Hallie Higgins'], 30),
			new SplitText(['Lighting Manager', 'Assistant to the Lighting Manager', 'Assistant to the Assistant', 'to the Lighting Manager'], ['Thomas Callender', 'Sam Rothenberger', '', 'Isaiah vanderBeken'], 26),
			new Text(['a special thanks', 'to the parents', 'FOR PUTTING UP WITH THIS NONSENSE', 'EVERY TUESDAY'], 26),
			new Text(['as well as', 'MR. SEAN HIGGINS', 'for having an', 'amazing beard'], 30),
			new Text(['We apologize for the fault in the', 'subtitles. Those responsible have been', 'sacked.'], 42),
			new Text(['We apologize again for the fault in the', 'subtitles. Those responsible for sacking', 'the people who have just been sacked,', 'have been sacked.'], 42),
			new SplitText(['Set design', 'Stage design', 'Lighting design', 'Costumer', 'Casting', 'Props design', 'Møøse Costuming'], ['MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'YUTTE HERMSGERVØRDENBRØTBØRDA'], 28),
			new SplitText(['Heraldry', 'Choreographer', 'Voice coach', 'Assistant to the director', 'Personal assistant to the director'], ['MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS', 'MAGGIE HIGGINS'], 28),
			new SplitText(['Special Møøse Effects', 'Møøse Costumes', 'Antler Design'], ['PASTOR SCOTT', 'KEELAH HIGGINS', 'DAVID LIGHT'], 30),
			new SplitText(['Designer', 'Møøse choreographed by by', 'Miss Taylor\'s Møøses by', 'Møøse trained to mix concrete and', 'sign complicated insurance forms by'], ['PETER POLHI', 'ERIN PAKINAS', 'KARA ROTHENBERGER', '', 'RON VANDERBEKEN'], 30),
			new SplitText(['Digital Guru', 'Møøse noses wiped by', 'Large møøse on the left-hand side', 'of the screen in the third scene from the', 'end, given a thorough grounding in Latin,', 'French and \'O\' Level Geography by', 'Suggestive poses for the moose suggest by', 'Antler-care by'], ['myself.. I mean GRESHAM CALLENDER', 'BJØRN IRKESTØM-SLATER WALKER', '', '', '', 'DOUGLAS WILSON ⁽ᵐᵃʸ ʰᵉ ˡᶦᵛᵉ ᶠᵒʳᵉᵛᵉʳ⁾', 'IMPERATOR NERO CLADIUS DIVI CLAUDIUS', 'FATHER CHRISTMAS'], 26),
			new Text(['The directors of the firm hired to', 'continue the credits after the other', 'people had been sacked, wish it to', 'be known that they have just been', 'sacked.', '', 'The credits have been completed', 'in an entirely different style at great', 'expense and at the last minute.'], 38),
			new Text([]),
			new Text(['𝐸𝑥𝑒𝑐𝑢𝑡𝑖𝑣𝑒 𝑃𝑟𝑜𝑑𝑢𝑐𝑒𝑟', 'TED & \'RALPH\' THE WONDER LLAMA'], 32),
			new Text(['test'], 32)
		];
		
		// changes the fade
		var fadeChange = 0;
		// stores the current fade value
		var col = fade;
		
		// the color flashing
		var epilepsy = 255;
		// the speed at which the screen flashes
		var speed = 10;
		// the actual number that changes
		var epilChange = -speed;
		// whether or not it is flashing
		var flash = false;
		
		// determines when it is time to change each seem
		var timer = 0;
		var timerChange = 1;
		
		// the current frame being shown
		var cur = 0;
		var serif = createFont('serif');
		var spotlight = {
			x: -100,
			y: 650,
			xc: 3,
			yc: -3,
			ycc: 0.01666,
		};
		draw = function () {
			textFont(serif);
			fade += fadeChange;
			
			// changes the background if flash is turned on
			if(flash) {
				background(255, epilepsy, 50);
			} else {
				background(0, 0, 0);
			}
			// increments the background if it is flashing
			epilepsy += epilChange;
			// resets to make the color flash
			if(epilepsy > 255) {
				epilChange = -speed;
			}
			if(epilepsy < 0) {
				epilChange = speed;
			}
			
			// increments the timer
			timer += timerChange;
			
			if(cur <= 27) {
				// scene ends
				if(timer > 300) {
					timer = 0;
					timerChange = 0;
					fadeChange = -3;
				}
				// scene has completely faded out
				if(fade < 0) {
					fadeChange = 3;
					cur++;
				}
				// the fade in completes
				if(fade > col) {
					fadeChange = 0;
					fade = col;
					timer = 0;
					timerChange = 1;
				}
			} else if(cur > 27) {
				if(timer > 360) {
					timer = 0;
					cur++;
				}
				timerChange = 1;
				fade = 0;
			}
			// determines when the flash starts
			if(cur > 27) {
				flash = true;
			}
			
			// draws the current text if it is defined
			if(frames[cur] !== undefined) {
				frames[cur].draw();
			}
			
			// adds the starring text the sixth frame
			if(cur === 8) {
				textSize(32);
				textAlign(CENTER, CENTER);
				text('Starring', 498, 125);
			}
			if(cur === 16) {
				noStroke();
				spotlight.x += spotlight.xc;
				spotlight.y += spotlight.yc;
				spotlight.yc += spotlight.ycc;
				for(var i = 0; i < 20; i++) {
					fill(255, 255, 255, 20 - i);
					ellipse(spotlight.x, spotlight.y, 160 + i * 2, 160 + i * 2);
				}
			}
		};
	
		keyPressed = function () {
			timer = 301;
		};
	}
};
// Get the canvas that ProcessingJS will use
var canvas = document.getElementById("mycanvas");
// Pass the function to ProcessingJS constructor
var processingInstance = new Processing(canvas, programCode);
