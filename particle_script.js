var programCode = function(processingInstance) {
	with(processingInstance) {
		size(800, 600);
		frameRate(60);
		var mouseIsPressed = false;
		var newClick = true;

		var sim = {
			number: 0,
			particles: [],
			run: false,
			gravity: 0,
			circle: true,
			size: 10,
			scatterY: 4,
			scatterX: 4,
			r: 150,
			g: 150,
			b: 150,
			colorOffset: 40,
			bouncing: true,
			energyLoss: 0.70,
			limitedBouncing: false,
			collisions: true,
		};
		sim.draw = function () {
			while(sim.particles.length < sim.number) {
				sim.particles.push({
					x: width/2,
					y: height/2,
					size: sim.size,
					highPoint: width/2,
					bounces: 0,
					xc: random(-sim.scatterX, sim.scatterX),
					yc: random(-sim.scatterY, sim.scatterY),
					color: color(random(sim.r - sim.colorOffset, sim.r + sim.colorOffset), random(sim.g - sim.colorOffset, sim.g + sim.colorOffset), random(sim.b - sim.colorOffset, sim.b + sim.colorOffset))
				});
			}
			for(var i = sim.particles.length - 1; i >= 0; i--) {
				var p = sim.particles[i];
				fill(p.color);
				if(sim.circle) {
					ellipse(p.x, p.y, sim.size, sim.size);
				} else {
					rect(p.x - sim.size/2, p.y - sim.size/2, sim.size, sim.size);
				}
				if(!p.colliding) {
					p.x += p.xc;
					p.y += p.yc;
					p.yc += sim.gravity;
				}
				if(sim.bouncing) {
					if((p.y + (sim.size/2) >= height) && (p.bounces < 10 || !sim.limitedBouncing)) {
						p.bounces++;
						p.y -= p.yc;
						p.yc = -p.yc*sim.energyLoss;
					}
					if((p.y - (sim.size/2) <= 0) && (p.bounces < 10 || !sim.limitedBouncing)) {
						p.bounces++;
						p.y -= p.yc;
						p.yc = -p.yc*sim.energyLoss;
					}
					if((p.x + (sim.size/2) >= width) && (p.bounces < 10 || !sim.limitedBouncing)) {
						p.bounces++;
						p.x -= p.xc;
						p.xc = -p.xc*sim.energyLoss;
					}
					if((p.x - (sim.size/2) <= 0) && (p.bounces < 10 || !sim.limitedBouncing)) {
						p.bounces++;
						p.x -= p.xc;
						p.xc = -p.xc*sim.energyLoss;
					}
				}
				if(p.y > height + sim.size || (p.y < -sim.size && sim.gravity <= 0) || p.x < -sim.size || p.x > width + sim.size) {
					sim.particles.splice(i, 1);
				}
				if(sim.collisions) {
					for(var j = sim.particles.length - 1; j >= 0 && j !== i; j--) {
						var p1 = p;
						var p2 = sim.particles[j];
						if(sim.collisions) {
							if(dist(p1.x, p1.y, p2.x, p2.y) <= sim.size/4) {
								p1.colliding = true;
								p2.colliding = true;
								var temp = {
									xc1: p1.xc,
									xc2: p2.xc,
									yc1: p1.yc,
									yc2: p2.yc
								};
								p1.xc = ((-temp.xc1 + temp.xc2)*sim.energyLoss)/2;
								p1.yc = ((-temp.yc1 + temp.yc2)*sim.energyLoss)/2;
								p2.xc = ((-temp.xc2 + temp.xc1)*sim.energyLoss)/2;
								p2.yc = ((-temp.yc2 + temp.yc1)*sim.energyLoss)/2;
								p1.colliding = false;
								p2.colliding = false;
							}
						}
					}
				}
			}
		};
		{
			var buttons = [];
			var Button = function (x, y, width, height, text, value, action) {
				this.x = x;
				this.y = y;
				this.height = height;
				this.width = width;
				this.text = text;
				this.action = action;
				this.value = value;
				this.color = {
					r: 125,
					g: 125,
					b: 125
				};
				buttons.push(this);
			};
			Button.prototype.draw = function () {
				fill(this.color.r, this.color.g, this.color.b);
				noStroke();
				rect(this.x, this.y, this.width, this.height, 8);
				fill(this.color.r - 80, this.color.g - 80, this.color.b - 80);
				textAlign(CENTER, CENTER);
				text(this.text + ' ' + sim[this.value], this.x + this.width/2, this.y + this.height/2);
			};
			Button.prototype.hover = function () {
				if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
					this.color.r = 80;
					this.color.g = 80;
					this.color.b = 80;
					return true;
				} else {
					this.color.r = 125;
					this.color.g = 125;
					this.color.b = 125;
					return false;
				}
			};
			Button.prototype.click = function () {
				this.action();
			};
			var increaseParticles = new Button (160, 560, 160, 40, 'increase particles', 'number', function(){sim.number++;});
			var decreaseParticles = new Button (480, 560, 160, 40, 'decrease particles', 'number', function(){sim.number--;});
			var moreGravity = new Button (0, 0, 120, 40, 'increase gravity', 'gravity', function(){sim.gravity+=0.05;});
			var lessGravity = new Button (0, 40, 120, 40, 'decrease gravity', 'gravity', function(){sim.gravity-=0.05;});
			var moreScatterX = new Button (0, 80, 120, 40, 'increase scatter X', 'scatterX', function(){sim.scatterX+=0.1;});
			var lessScatterX = new Button (0, 120, 120, 40, 'decrease scatter X', 'scatterX', function(){sim.scatterX-=0.1;});
			var moreScatterY = new Button (0, 160, 120, 40, 'increase scatter Y', 'scatterY', function(){sim.scatterY+=0.1;});
			var lessScatterY = new Button (0, 200, 120, 40, 'decrease scatter Y', 'scatterY', function(){sim.scatterY-=0.1;});
			var bouncing = new Button (0, 240, 120, 40, 'bouncing', 'bouncing', function(){if(sim.bouncing){sim.bouncing = false;} else{sim.bouncing = true;}});
			var increaseSize = new Button(0, 280, 120, 40, 'increase size', 'size', function(){sim.size++;});
			var decreaseSize = new Button(0, 320, 120, 40, 'decrease size', 'size', function(){sim.size--;});
			var increaseEnergy = new Button(0, 360, 120, 40, 'increase energy', 'energyLoss', function(){sim.energyLoss+=.1;});
			var decreaseEnergy = new Button(0, 400, 120, 40, 'decrease energy', 'energyLoss', function(){sim.energyLoss-=.1;});
			var limitedBouncing = new Button (0, 440, 120, 40, 'limited bounces', 'limitedBouncing', function(){if(sim.limitedBouncing){sim.limitedBouncing = false;} else{sim.limitedBouncing = true;}});
			var collisions = new Button (0, 480, 120, 40, 'collisions', 'collisions', function(){if(sim.collisions){sim.collisions = false;} else{sim.collisions = true;}});
			var increaseRed = new Button(680, 0, 120, 40, 'increase red', 'r', function(){sim.r+=1;});
			var decreaseRed = new Button(680, 40, 120, 40, 'decrease red', 'r', function(){sim.r-=1;});
			var increaseGreen = new Button(680, 80, 120, 40, 'increase green', 'g', function(){sim.g+=1;});
			var decreaseGreen = new Button(680, 120, 120, 40, 'decrease green', 'g', function(){sim.g-=1;});
			var increaseBlue = new Button(680, 160, 120, 40, 'increase blue', 'b', function(){sim.b+=1;});
			var decreaseBlue = new Button(680, 200, 120, 40, 'decrease blue', 'b', function(){sim.b-=1;});
			var increaseColorOffset = new Button(680, 240, 120, 40, 'increase color', 'colorOffset', function(){sim.colorOffset+=1;});
			var decreaseColorOffset = new Button(680, 280, 120, 40, 'decrease color', 'colorOffset', function(){sim.colorOffset-=1;});
			var Start = new Button (320, 560, 160, 40, 'Run simulation', 'run', function(){if(sim.run){sim.run = false;} else{sim.particles = [];sim.run = true;}});
		}


		draw = function () {
			background(255, 255, 255);
			sim.gravity = round(sim.gravity * 100)/100;
			sim.scatterX = round(sim.scatterX * 10)/10;
			sim.scatterY = round(sim.scatterY * 10)/10;
			sim.energyLoss = round(sim.energyLoss * 10)/10;
			for(var i = 0; i < buttons.length; i++) {
				buttons[i].draw();
				buttons[i].hover();
				if(buttons[i].hover() && newClick && mouseIsPressed) {
					newClick = false;
					buttons[i].click();
				}
			}
			if(sim.run) {
				sim.draw();
			}
		};
		
		mousePressed = function () {
			mouseIsPressed = true;
		};
		mouseReleased = function () {
			newClick = true;
			mouseIsPressed = false;
		};
	}
};
// Get the canvas that ProcessingJS will use
var canvas = document.getElementById("mycanvas");
// Pass the function to ProcessingJS constructor
var processingInstance = new Processing(canvas, programCode);
