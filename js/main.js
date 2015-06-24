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
var coolDown = 0;
var animation = [];
var frame1;
var ufos = [];
var frame2;
var frame3;
var score = 0;
var coolDownL0 = 100;
var coolDownL2 = 166.66;
const bulletSpeed = 12;
window.onload = function() {

	var body = document.getElementById("body");
	canvas = document.createElement("canvas");

	ctx = canvas.getContext('2d');
	ctx.font = "45px Arial";

	canvas.setAttribute('width', 500);
	canvas.setAttribute('height', 700);

	body.appendChild(canvas);
	var loader;

	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

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
		var audio = $("#player");
		if ($("#player").attr("src") !== sourceUrl) {
			$("#player").attr("src", sourceUrl);
		}
		audio[0].pause();
		audio[0].load();
		audio[0].play();
	}
	var updateScore = function() {
		ctx.fillText(score.toString(), 0, 600);
	}
	var imgLoad = function(url, callback) {
		loader = new Image();
		loader.onload = callback;
		loader.src = url;
		return loader;
	}
	var drawImage = function(img, posX, posY) {
		ctx.drawImage(img, posX, posY);
	}
	var fireBullet = function() {
		var bulX = Tank.topX + 22;
		var bulY = Tank.topY + 15;
		bullets.push({
			topX: bulX,
			topY: bulY
		});
	}
	var grass = imgLoad('./img/g.png', function() {
		drawImage(grass, 0, 0);
	});

	var blimpie = imgLoad('./img/blimpie.png', function() {});

	var bull = imgLoad('./img/bullet.png', function() {});
	 frame1 = imgLoad('./img/frame1.png', function() {});
	 frame2 = imgLoad('./img/frame2.png', function() {});
	 frame3 = imgLoad('./img/frame3.png', function() {});
	var ufo = imgLoad('./img/ufo.png')

	var layas = [0, 65, 130];
	$('#body').keydown(function(event) {
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
	var tank = imgLoad('./img/tank.png', function() {
		drawImage(tank, Tank.topX, Tank.topY)
	});

	planeImgs = {
		'L': imgLoad('./img/plane1.png'),
		'R': imgLoad('./img/plane-1.png'),
		'B': imgLoad('./img/blimpie.png')
	}
	var animate = function() {

		ctx.clearRect(0, 0, 500, 610);
		if (rightDown && Tank.topX + 5 <= 450) {
			Tank.topX = Tank.topX + 5;
		} else if (leftDown && Tank.topX - 5 >= 0) {
			Tank.topX = Tank.topX - 5;
		}
		if (spaceDown && bullets.length == 0) {
			fireBullet();
			coolDown = 5;
		} else if (coolDown > 0) {
			coolDown = coolDown - 1
		}
		if (randomIntFromInterval(0, 667) === 4) {
			ufos.push({
				topY: randomIntFromInterval(140, 200),
				topX: 0
			});
		}
		ufos.forEach(function(val, index, arr) {
			drawImage(ufo, val.topX, val.topY);
			arr[index].topX = val.topX + 15
		});
		bullets.forEach(function(val, index, arr) {
			bullets[index].topY = bullets[index].topY - bulletSpeed;
			drawImage(bull, bullets[index].topX, bullets[index].topY);
			if (val.topY < 0) {
				arr.splice(index, 1);
			}
		})
		drawImage(tank, Tank.topX, Tank.topY)
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
			planes.push({
				topX: 0,
				orientL: 1,
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
		planes.forEach(function(val, index, arr) {
			var imig;
			if (planes[index].layer == 2) {
				planes[index].topX = planes[index].topX + (2.5 * planes[index].orientL);

				imig = planeImgs['B'];
			} else {
				planes[index].topX = planes[index].topX + (5 * planes[index].orientL);

				imig = planeImgs['R']
			}
			drawImage(imig, planes[index].topX, layas[planes[index].layer])

		});
		coolDownL1 = coolDownL1 - 1;
		coolDownL0 = coolDownL0 - 1;
		coolDownL2 = coolDownL2 - 1;
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
		})
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
		updateScore();
	}

	setInterval(animate, frameRate);
}