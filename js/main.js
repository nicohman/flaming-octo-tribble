//Let's define some important variables here.
var frameRate = 1000 / 30;
var rightDown;
var leftDown;
var spaceDown;
var Tank = {
	topX: 0,
	topY: 575
}
var planes = [{
	topX: 0,
	layer: 1,
	orientL: 1,
	topY: 65
}];
var coolDownL1 = 66.66;
var bullets = [];
var level = 1;
var intervalID = null;
var bomb;
var bombs = [];
var coolDown = 0;
var animation = [];
var frame1;
var gameOver;
var ufos = [];
var frame2;
var frame3;
var score = 0;
var coolDownL0 = 100;
var coolDownL2 = 166.66;
var bull;
const bulletSpeed = 12;
window.onload = function() {
	//Now that the window has loaded, let's actually get to work.
	var body = document.getElementById("body");
	canvas = document.createElement("canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "60px Arial";
	//Retrieve the canvas and get the context out of it.
	canvas.setAttribute('width', 500);
	canvas.setAttribute('height', 700);
	canvas.setAttribute('id', 'cav')
		//Set some height/width
	body.appendChild(canvas);
	//Aaand attach it to the actually body of the page.
	var loader;

	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	//This function just generates me a random number
	var haveCollided = function(rect1, rect2) {
		if (rect1.topX < rect2.topX + 32 && rect1.topX + 8 > rect2.topX &&
			rect1.topY - 8 < rect2.topY && rect1.topY > rect2.topY - 32) {
			// The objects are touching
			return true;
		} else {
			return false;
		}
	}

	function changeAudio(sourceUrl) {
		if (sourceUrl == './audio/boom.mp3') {
			var audio = $("#boosh");
			audio[0].currentTime = 0;
			audio[0].play()
		}
		var audio = $("#player");
		if ($("#player").attr("src") !== sourceUrl) {
			$("#player").attr("src", sourceUrl);
			audio[0].pause();
			audio[0].load();
			audio[0].play();
		} else {
			audio[0].pause();
			audio[0].currentTime = 0;
			audio[0].play();
		}

	}
	//A function to more easily change the audio.
	var updateScore = function() {
			if (score > 15) {
				score = score - 15
				level = level + 1;
				ctx.fillText('LEVEL UP!', 150, 300)
			}
			ctx.fillText('Score:' + score.toString(), 0, 580);
			ctx.fillText('Level:' + level.toString(), 0, 570)
		}
		//A function to update the score
	var imgLoad = function(url, callback) {
			loader = new Image();
			loader.onload = callback;
			loader.src = url;
			return loader;
		}
		//A function to load a sprite/image
	var drawImage = function(img, posX, posY) {
			ctx.drawImage(img, posX, posY);
		}
		//A function to easily draw an image, not REALLY needed but sorta useful
	var fireBullet = function() {
			var bulX = Tank.topX + 22;
			var bulY = Tank.topY + 15;
			bullets.push({
				topX: bulX,
				topY: bulY
			});
		}
		//An automatic bullet-firer
	bull = imgLoad('./img/bullet.png');
	bomb = imgLoad('./img/dabomb.png');
	var grass = imgLoad('./img/g.png');
	var splasher = imgLoad('./img/splash.png');
	var blimpie = imgLoad('./img/blimpie.png', function() {});
	frame1 = imgLoad('./img/frame1.png', function() {});
	frame2 = imgLoad('./img/frame2.png', function() {});
	frame3 = imgLoad('./img/frame3.png', function() {});
	var over = imgLoad('./img/over.png');
	var ufo = imgLoad('./img/ufo.png')
		//Loading some images.
	var layas = [0, 65, 130];
	drawImage(splasher, 0, 0);
	//Detecting when the player starts to press down the left, right, or space keys.
	$('#body').keydown(function(event) {
		event.preventDefault();
		$('#body').unbind('keydown');
		$('#body').keydown(function(event) {
			event.preventDefault();
			if (event.keyCode == 39) {
				rightDown = true;
			} else if (event.keyCode == 37) {
				leftDown = true;
			} else if (event.keyCode == 32) {
				spaceDown = true;
			} else {
				return;
			}
		});
		//And detecting when they let go.
		$('#body').keyup(function(event) {
			if (event.keyCode == 39) {
				rightDown = false;
			} else if (event.keyCode == 37) {
				leftDown = false;
			} else if (event.keyCode == 32) {
				spaceDown = false;
			} else {
				return;
			}
		});
		var bull;
		//Drawing the tank initially
		var tank = imgLoad('./img/tank.png', function() {
			drawImage(tank, Tank.topX, Tank.topY)
		});
		//Loading the plane images into an easily accesible array
		planeImgs = {
			'L': imgLoad('./img/plane1.png'),
			'R': imgLoad('./img/plane-1.png'),
			'B': imgLoad('./img/blimpie.png')
		}

		//And now the function that'll run every frame loop: animate!
		var animate = function() {
				drawImage(grass, 0, 0);
				//First, wipe away everything but the grass.
				ctx.clearRect(0, 0, 500, 610);
				//Then, move the tank
				if (rightDown && Tank.topX + 5 <= 450) {
					Tank.topX = Tank.topX + 5;
				} else if (leftDown && Tank.topX - 5 >= 0) {
					Tank.topX = Tank.topX - 5;
				}
				//Then, fire a bullet(if needed, of course)
				if (spaceDown && bullets.length == 0) {
					fireBullet();
					coolDown = 5;
				} else if (coolDown > 0) {
					coolDown = coolDown - 1
				}
				//Randomly decide whether or not a ufo will appear
				if (randomIntFromInterval(0, 667) === 4) {
					ufos.push({
						topY: randomIntFromInterval(140, 200),
						topX: 0,
						orientL: 1
					});
				}
				//And draw the ufos
				ufos.forEach(function(val, index, arr) {
					if (150 < val.topX < 300 && randomIntFromInterval(0, 50) == 3) {
						val.orientL = -1;
					}
					drawImage(ufo, val.topX, val.topY);
					arr[index].topX = val.topX + 6.5 * val.orientL
				});
				//Move the bullets, and if they've reached the top of the screen, DESTROY THEM
				bullets.forEach(function(val, index, arr) {
					bullets[index].topY = bullets[index].topY - bulletSpeed;
					drawImage(window.bull, bullets[index].topX, bullets[index].topY);
					if (val.topY < 0) {
						arr.splice(index, 1);
					}
				});
				//Now draw the tank.
				drawImage(tank, Tank.topX, Tank.topY)
					//Next, spawn some planes/blimps based on how long ago the last ones were spawned.
				if (coolDownL1 < 1) {
					var wilb;
					if (Math.round(Math.random() * 1) == 1) {
						wilb = 1;
					} else {
						wilb = -1;
					}
					planes.push({
						topX: 0,
						orientL: 1,
						layer: 1,
						topY: 65
					})
					coolDownL1 = 66.66;
				}
				if (coolDownL0 < 1) {
					var wilb;
					if (Math.round(Math.random() * 1) == 1) {
						wilb = 1;
					} else {
						wilb = -1;
					}
					var ex = 0;
					if (wilb == -1) {
						ex = 450;
					}
					planes.push({
						topX: ex,
						orientL: wilb,
						layer: 0,
						topY: 0
					})
					coolDownL0 = 100;
				}
				if (coolDownL2 < 1) {
					var wilb;
					if (Math.round(Math.random() * 1) == 1) {
						wilb = 1;
					} else {
						wilb = -1;
					}
					planes.push({
						topX: 0,
						orientL: 1,
						layer: 2,
						topY: 130
					})
					coolDownL2 = 166.66;
				}
				//Move the planes
				planes.forEach(function(val, index, arr) {
					var imig;
					if (planes[index].layer == 2) {
						planes[index].topX = planes[index].topX + (level * 0.1) + (2 * planes[index].orientL);
						imig = planeImgs['B'];
					} else if (val.layer == 0 && val.orientL == -1) {
						planes[index].topX = planes[index].topX + (level * 0.1) + (4 * planes[index].orientL);
						imig = planeImgs['L'];
					} {
						planes[index].topX = planes[index].topX + (level * 0.1) + (4 * planes[index].orientL);

						imig = planeImgs['R'];
					}
					drawImage(imig, planes[index].topX, layas[planes[index].layer])
					if (randomIntFromInterval(0, (500 - (level * 4))) == 6) {
						bombs.push({
							topX: val.topX,
							topY: val.topY
						});
					}
				});
				//Decrease the cooldown for each plane layer
				coolDownL1 = coolDownL1 - 1;
				coolDownL0 = coolDownL0 - 1;
				coolDownL2 = coolDownL2 - 1;
				//Collison detection/audio playing.

				bombs.forEach(function(val, index, arr) {
					drawImage(bomb, val.topX, val.topY);
					if (haveCollided(val, Tank)) {
						gameOver = true;
					}
					arr[index].topY = val.topY + 7;
				})
				bullets.forEach(function(val, index, arr) {
						planes.forEach(function(valp, indexp, arrp) {
							if (haveCollided(val, valp)) {
								var toAdd;
								if (valp.layer == 2) {
									toAdd = 0.5;
								} else if (valp.layer == 1) {
									toAdd = 1;
								} else if (valp.layer == 0) {
									toAdd = 0;
								} else {
									alert('OH NO ITS ALL DIED')
								}
								score = score + toAdd;
								changeAudio('./audio/boom.mp3');

								updateScore();
								animation.push({
									framenum: 1,
									topX: valp.topX,
									topY: valp.topY
								});
								bullets.splice(index, 1);
								planes.splice(indexp, 1);
							}
						})
						ufos.forEach(function(valu, indexu, arru) {
							if (haveCollided(val, valu)) {
								score = score + 15;
								changeAudio('./audio/boom.mp3');

								updateScore();
								animation.push({
									framenum: 1,
									topX: valu.topX,
									topY: valu.topY
								});
								bullets.splice(index, 1);
								planes.splice(indexu, 1);
							}
						})
					})
					//And continuing previously made animations
				if (animation.length > 0) {
					animation.forEach(function(val, index, arr) {
						if (val.framenum > 3) {
							arr.splice(index, 1);
							return;
						}
						drawImage(window['frame' + val.framenum.toString()], val.topX, val.topY)
						arr[index].framenum = arr[index].framenum + 1
					});
				}
				//And finally update the score...
				updateScore();
				if (window.requestAnimationFrame && gameOver !== true) {
					window.requestAnimationFrame(animate);
				}
				if (intervalID !== null && gameOver === true) {
					clearInterval(intervalID)
				}
				if (gameOver === true) {
					drawImage(over, 0, 0);
				}
			}
			//And now make stuff happen!
		if (window.requestAnimationFrame && gameOver !== true) {
			window.requestAnimationFrame(animate);
		} else if (gameOver !== true) {
			intervalID = setInterval(animate, frameRate);
		}
	})

}