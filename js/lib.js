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
	$("#player").attr("src", sourceUrl);
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