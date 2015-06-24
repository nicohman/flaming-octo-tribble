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
	if ($("#player").attr("src") !== sourceUrl){
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
var bull = imgLoad('./img/bullet.png', function() {});
var frame1 = imgLoad('./img/frame1.png', function() {});
var frame2 = imgLoad('./img/frame2.png', function() {});
var frame3 = imgLoad('./img/frame3.png', function() {});
var ufo = imgLoad('./img/ufo.png')
var frameRate = 1000 / 30;
var rightDown;
var leftDown;
var spaceDown;
var Tank = {
	topX: 0,
	topY: 540
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