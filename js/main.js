//var cv = document.getElementById('canvas');
//var ctx = cv.getContext('2d');
//var ctx = $('#canvas').get(0).getContext('2d');
var frameRate = 1000/30;
var rightDown;
var leftDown;
var spaceDown;
var Tank = {
	topX:0,
	topY:540
}
var planes = [{
	x:0,
	layer:1,
	orientL:true
}];
var bullets = [];
var coolDown = 0;
window.onload = function(){
	var body = document.getElementById("body");
	canvas = document.createElement("canvas");

	ctx = canvas.getContext('2d');

	canvas.setAttribute('width', 500);
	canvas.setAttribute('height', 700);

	body.appendChild(canvas);
	var loader;
	var imgLoad = function(url, callback){
		loader = new Image();
		loader.onload = callback;
		loader.src = url;
		return loader;
	}
	var drawImage = function(img,posX,posY){
		ctx.drawImage(img, posX, posY);
	}
	var fireBullet = function(){
		var bulX = Tank.topX + 32;
		var bulY = Tank.topY;
		bullets.push({
			topX:bulX,
			topY:bulY
		});
	}
	var grass = imgLoad('./img/g.png', function(){
		drawImage(grass, 0, 0);
	});
	var layers = [0, 65, 130];
	$('#body').keydown(function(event){
		if (event.keyCode == 39 ){
			rightDown = true;
		} else if (event.keyCode == 37){
			leftDown = true;
		} else if (event.keyCode == 32){
			spaceDown = true;
		} else {
			return;
		}
	});
	$('#body').keyup(function(event){
		if(event.keyCode == 39){
			rightDown = false;
		} else if (event.keyCode == 37){
			leftDown = false;
		} else if (event.keyCode == 32){
			spaceDown = false;
		} else {
			return;
		}
	});
	var bull;
	var tank = imgLoad('./img/tank.png', function(){
			drawImage(tank, Tank.topX, Tank.topY)
		});

			bull = imgLoad('./img/bullet.png', function(){
			});
	var animate = function(){
		ctx.clearRect(0, 0, 500, 610);
		if(rightDown && Tank.topX + 5 <= 450){
			Tank.topX = Tank.topX + 5;
		} else if (leftDown && Tank.topX - 5 >= 0){
			Tank.topX = Tank.topX - 5;
		}
		if(spaceDown && coolDown == 0){
			fireBullet();
			coolDown = 5;
		} else if (coolDown > 0){
			coolDown = coolDown-1
		}
		bullets.forEach(function(val, index, arr){
			bullets[index].topY = bullets[index].topY - 5;
			drawImage(bull, bullets[index].topX, bullets[index].topY);
		})
		drawImage(tank, Tank.topX, Tank.topY)
		planes.forEach(function(val, index, arr){

		});
	}
	setInterval(animate, frameRate);
}