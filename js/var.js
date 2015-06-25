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