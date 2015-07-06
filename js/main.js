/*Main.js - the main game code for Tanks v Planes
By Nicholas Hickman
*/
//Let's define some important variables here.
var frameRate = 1000 / 60;
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
window.planesByX = [{
  topX: 0,
  layer: 1,
  topY: 65,
  orientL: 1
}];
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
var coolDownL1 = 66.66;
const bulletSpeed = 12;
var socket = io('http://10.0.1.14:3000');
window.onload = function() {
  //Now that the window has loaded, let's actually get to work.
  var body = document.getElementById("body");
  canvas = document.createElement("canvas");
  ctx = canvas.getContext('2d');
  ctx.font = "60px Arial";
  //Retrieve the canvas and get the context out of it.
  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 700);
  canvas.setAttribute('id', 'cav');
  //Set some height/width
  canvas.innerHTML = "U NO CANVAS";
  body.appendChild(canvas);
  //Aaand attach it to the actually body of the page.
  var loader;
  //TFTBL LB
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
      //The objects are not touching
      return false;
    }
  };
  lowLag.init();
  function changeAudio(sourceUrl) {
    lowLag.load(sourceUrl);
    lowLag.play(sourceUrl);
  }
  //A function to more easily change the audio.
  function compare(topX1, topX2) {
    if (topX1 > topX2) {
      return 1;
    }
    if (topX2 < topX1) {
      return -1;
    }
    return 0;
  }
  var updateScore = function() {
    if (score > 15) {
      score = score - 15;
      level = level + 1;
      ctx.fillText('LEVEL UP!', 150, 300);
    }
    ctx.fillText('Score:' + score.toString(), 0, 580);
    ctx.fillText('Level:' + level.toString(), 0, 570);
  };
  //A function to update the score
  var imgLoad = function(url, callback) {
    loader = new Image();
    loader.onload = callback;
    loader.src = url;
    return loader;
  };
  //A function to load a sprite/image
  var drawImage = function(img, posX, posY, why) {
    ctx.drawImage(img, posX, posY);
    return true;
  };
  //A function to easily draw an image, not REALLY needed but sorta useful
  var fireBullet = function() {
    var bulX = Tank.topX + 22;
    var bulY = Tank.topY + 15;
    bullets.push({
      topX: bulX,
      topY: bulY
    });
  };
  //An automatic bullet-firer
  bull = imgLoad('./img/bullet.png');
  bomb = imgLoad('./img/dabomb.png');
  var grass = imgLoad('./img/g.png');
  var overplane = imgLoad('./img/overplane.png');
  var splasher = imgLoad('./img/splash.png', function() {
    drawImage(splasher, 0, 0);
  });
  var blimpie = imgLoad('./img/blimpie.png', function() {});
  frame1 = imgLoad('./img/frame1.png', function() {});
  frame2 = imgLoad('./img/frame2.png', function() {});
  frame3 = imgLoad('./img/frame3.png', function() {});
  var over = imgLoad('./img/over.png');
  var ufo = imgLoad('./img/ufo.png');
  //Loading some images.
  var layas = [0, 65, 130];
  if(Cookies.get('name')&& Cookies.get('pass')){
    socket.emit('logged', {
      name: Cookies.get('name'),
      pass:Cookies.get('pass')
    });
    socket.on('no', function(){
      window.location.href = "10.0.1.14:7000/signin.html";
    });
    socket.on('gtg', function(){
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
          drawImage(tank, Tank.topX, Tank.topY);
        });
        //Loading the plane images into an easily accesible array
        window.planeImgs = {
          'L': imgLoad('./img/plane1.png'),
          'R': imgLoad('./img/plane-1.png'),
          'B': imgLoad('./img/blimpie.png')
        };
        if (event.keyCode == 77) {
          window.multiplayer = true;
          var loaded = imgLoad('./img/loaded.png', function() {
            drawImage(loaded, 0, 0);
            socket.emit('looking');
            socket.on('done', function(data) {
              var istank = false;
              gameOver = false;
              if (data.tank) {
                istank = true;
              }
              var cross;
              if (istank !== true) {
                cross = imgLoad('./img/cross.png');
              }
              var selected = null;
              window.planesByX = [{
                topX: 0,
                layer: 1,
                topY: 65,
                orientL: 1
              }];
              window.planesByXAr = [];
              window.temp = [];
              if (istank) {
                socket.on('plane', function(data) {
                  window.planesByX = data.planesByX;
                  //planes = data.planes;
                  bombs = data.bombs;

                });
              } else {
                socket.on('tank', function(data) {
                  Tank = data.tank,
                  bullets = data.bullets
                });
              }
              var animate = function() {
                drawImage(grass, 0, 0);
                planesByX.forEach(function(val, index, arr) {
                  window.planesByXAr.push(val.topX);
                });
                window.planesByXAr = window.planesByXAr.sort(compare);
                window.planesByX.forEach(function(val, index, arr) {
                  window.planesByXAr.forEach(function(valp, indexp, arrp) {
                    if (valp === val.topX) {
                      window.temp[index] = {};
                      window.temp[index].topX = valp;
                      window.temp[index].topY = val.topY;
                      window.temp[index].layer = val.layer;
                      window.temp[index].orientL = val.orientL;
                    }
                  });
                });
                window.planesByX = window.temp;
                window.planesByX.forEach(function(val) {
                  var imgCode;
                  var multiplier = 4;
                  if (val.layer === 2) {
                    multiplier = 2;
                    imgCode = 'B';
                  } else if (val.layer === 0 && val.orientL === -1) {
                    imgCode = 'L';
                  } else {
                    imgCode = 'R';
                  }

                  val.topX += (level * 0.1) + (multiplier * val.orientL);
                  var img = window.planeImgs[imgCode];
                  drawImage(img, val.topX, layas[val.layer], true);
                });
                //First, wipe away everything but the grass.
                ctx.clearRect(0, 0, 500, 610);
                //Then, move the tank
                if (istank) {
                  if (rightDown && Tank.topX + 5 <= 450) {
                    Tank.topX = Tank.topX + 5;
                  } else if (leftDown && Tank.topX - 5 >= 0) {
                    Tank.topX = Tank.topX - 5;
                  }
                  //Then, fire a bullet(if needed, of course)
                  if (spaceDown && bullets.length === 0) {
                    fireBullet();
                    coolDown = 5;
                  } else if (coolDown > 0) {
                    coolDown = coolDown - 1;
                  }
                }
                  if (leftDown && (selected + 1 <= planesByX.length -1) && istank !== true) {
                    selected = selected + 1;
                  } else if (rightDown && (selected - 1 >= 0)&& istank !== true) {
                    selected = selected - 1;
                  }
                  if (spaceDown && bombs.length < 4 && istank !== true) {
                    var tbbomb = {
                      topX: window.planesByX[selected].topX,
                      topY: window.planesByX[selected].topY
                    };
                    bombs.push(tbbomb);
                    socket.emit('bomb', tbbomb);
                  }

                window.planesByX.forEach(function(val, index, arr) {
                  //TBS
                  if (selected === index && istank !== true) {
                    drawImage(cross, val.topX - 8, val.topY - 8);
                  }
                  var image = 'R';
                  if (val.layer == 2) {
                    image = 'B';
                  }
                  if(val.topX > 500 || val.topX < 0){
                    planesByX.splice(index, 1);
                  }
                  drawImage(planeImgs[image], val.topX, val.topY);
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
                drawImage(tank, Tank.topX, Tank.topY);
                //Next, spawn some window.planesByX/blimps based on how long ago the last ones were spawned.
                if (istank !== true) {
                  if (coolDownL1 < 1) {
                    var wilb;
                    if (Math.round(Math.random() * 1) == 1) {
                      wilb = 1;
                    } else {
                      wilb = -1;
                    }
                    planesByX.push({
                      topX: 0,
                      orientL: 1,
                      layer: 1,
                      topY: 65
                    });
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
                    planesByX.push({
                      topX: ex,
                      orientL: wilb,
                      layer: 0,
                      topY: 0
                    });

                    coolDownL0 = 100;
                  }
                  if (coolDownL2 < 1) {
                    var wilb;
                    if (Math.round(Math.random() * 1) == 1) {
                      wilb = 1;
                    } else {
                      wilb = -1;
                    }
                    planesByX.push({
                      topX: 0,
                      orientL: 1,
                      layer: 2,
                      topY: 130
                    });

                    coolDownL2 = 166.66;
                  }
                }
                //Move the window.planesByX
                socket.on('bomb', function(data) {
                  bombs.push({
                    topX: data.topX,
                    topY: data.topY
                  });
                });
                //Decrease the cooldown for each plane layer
                coolDownL1 = coolDownL1 - 1;
                coolDownL0 = coolDownL0 - 1;
                coolDownL2 = coolDownL2 - 1;
                bombs.forEach(function(val, index, arr) {
                  drawImage(bomb, val.topX, val.topY);
                  if (haveCollided(val, Tank)) {
                    gameOver = true;
                    socket.emit('tankdead');
                  }
                  arr[index].topY = val.topY + 7;
                  if (val.topY > 600) {
                    arr.splice(index, 1);
                  }
                });
                bullets.forEach(function(val, index, arr) {
                  planesByX.forEach(function(valp, indexp, arrp) {
                    if (haveCollided(val, valp)) {
                      var toAdd;
                      if (valp.layer == 2) {
                        toAdd = 0.5;
                      } else if (valp.layer == 1) {
                        toAdd = 1;
                      } else if (valp.layer === 0) {
                        toAdd = 2;
                      } else {
                        alert('OH NO ITS ALL DIED');
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
                      planesByX.splice(indexp, 1);
                    }
                  });
                }
              );

                //And continuing previously made animations
                if (animation.length > 0) {
                  animation.forEach(function(val, index, arr) {
                    if (val.framenum > 3) {
                      arr.splice(index, 1);
                      return;
                    }
                    drawImage(window['frame' + val.framenum.toString()], val.topX, val.topY);
                    arr[index].framenum = arr[index].framenum + 1;
                  });
                }
                if (istank === true) {
                  socket.emit('tank', {
                    tank: Tank,
                    bullets: bullets
                  });
                }
                if (istank === false) {
                  socket.emit('plane', {
                    planes: planes,
                    bombs: bombs,
                    planesByX: window.planesByX
                  });
                }
                //And finally update the score...
                updateScore();
                if (window.requestAnimationFrame && gameOver !== true) {
                  window.requestAnimationFrame(animate);
                }
                if (intervalID !== null && gameOver === true) {
                  clearInterval(intervalID);
                }
                if (gameOver === true && istank === true) {
                  drawImage(over, 0, 0);
                  $('#body').keydown(function(event) {
                    location.reload(true);
                  });
                } else if (gameOver === true && istank !== true) {
                  drawImage(overplane, 0, 0);
                  $('#body').keydown(function(event) {
                    location.reload(true);
                  });

                }
              };
              //And now make stuff happen!

              if (window.requestAnimationFrame && gameOver !== true) {
                window.requestAnimationFrame(animate);
              } else if (gameOver !== true) {
                intervalID = setInterval(animate, frameRate);
              }
            });

          });
        } else {
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
            if (spaceDown && bullets.length === 0) {
              fireBullet();
              coolDown = 5;
            } else if (coolDown > 0) {
              coolDown = coolDown - 1;
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
              arr[index].topX = val.topX + 7 * val.orientL;
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
            //Next, spawn some window.planesByX/blimps based on how long ago the last ones were spawned.
            if (coolDownL1 < 1) {
              var wilb;
              if (Math.round(Math.random() * 1) == 1) {
                wilb = 1;
              } else {
                wilb = -1;
              }
              window.planesByX.push({
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
              window.planesByX.push({
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
              window.planesByX.push({
                topX: 0,
                orientL: 1,
                layer: 2,
                topY: 130
              })
              coolDownL2 = 166.66;
            }
            //Move the window.planesByX
            window.planesByX.forEach(function(val, index, arr) {
              if (window.planesByX[index].layer == 2) {
                window.planesByX[index].topX = window.planesByX[index].topX + (level * 0.1) + (2 * window.planesByX[index].orientL);
                window.imig = window.planeImgs['B'];
              } else if (val.layer == 0 && val.orientL == -1) {
                window.planesByX[index].topX = window.planesByX[index].topX + (level * 0.1) + (4 * window.planesByX[index].orientL);
                window.imig = window.planeImgs['L'];
              }{
              window.planesByX[index].topX = window.planesByX[index].topX + (level * 0.1) + (4 * window.planesByX[index].orientL);

              window.imig = window.planeImgs['R'];
              }
              drawImage(window.imig, window.planesByX[index].topX, layas[window.planesByX[index].layer])
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
              window.planesByX.forEach(function(valp, indexp, arrp) {
                if (haveCollided(val, valp)) {
                  var toAdd;
                  if (valp.layer == 2) {
                    toAdd = 0.5;
                  } else if (valp.layer == 1) {
                    toAdd = 1;
                  } else if (valp.layer == 0) {
                    toAdd = 2;
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
                  window.planesByX.splice(indexp, 1);
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
                  ufos.splice(indexu, 1);
                }
              })
            }
            )
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
              $('#body').keydown(function(event) {})
            }
          }
          //And now make stuff happen!
          if (window.requestAnimationFrame && gameOver !== true) {
            window.requestAnimationFrame(animate);
          } else if (gameOver !== true) {
            intervalID = setInterval(animate, frameRate);
          }
        }
      })

    })
  } else {
    window.location.href = "signin.html";
  }
  //Detecting when the player starts to press down the left, right, or space keys.

}
