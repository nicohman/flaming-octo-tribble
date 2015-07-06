
var io = require('socket.io')( /*2673*/ 3000);
var http = require('http');
var fs = require('fs');
require('colors');
var ip = null;
var queue = [];
var games = [];
var checkUserInfo = function(name, pass, callb) {
	global.infoU = false;
  db.collection('users').find({
    "name": name
  }, function(err, records) {
    records.toArray(function(err, docs) {
      docs.forEach(function(val, index, arr) {
        if (val.pass === pass) {
          console.log('Authorized user accepted. Enjoy the ride and there\'s a pimento taco--a pimentaco-- in the glove box');
          global.infoU = true;
					console.log(true);
          callb(true);
        }
      });
			if(global.infoU === false){
				console.log(false);
				callb(global.infoU);
			}
    });
  });
};
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/tanks', function(err, dbe) {
  if (err)
    throw err;
  //throw db into global scope
  global.db = dbe;
  console.log("Connected to Database".green);
  db.collection('users').find(function(err, records) {
    records.toArray(function(err, docs) {
      console.log(docs[0]);
    });
  });
});
io.on('connection', function(socket) {
  socket.on('checking', function(data) {
    checkUserInfo(data.name, data.pass, function(boole) {
      if (boole) {
        socket.emit('gtg');
      }
    });
  });
  var clientIp = socket.request.connection.remoteAddress;
  console.log('connection!');

  socket.on('logged', function(data) {
    checkUserInfo(data.name, data.pass, function(bool) {
      if (bool === true) {
        socket.emit('gtg');
        socket.on('looking', function(data) {
          console.log('lookin');
          queue.push(socket.id);
          if (queue.length > 1) {
            console.log('yay!');
            games.push({
              p1: socket.id,
              p2: queue[0]
            });
            socket.emit('done', {
              tank: true
            });
            console.log(queue[0]);
            socket.in(queue[0]).emit('done', {
              tank: false
            });
            queue.splice(0, 2);
          } else {
            return;
          }
        });
        socket.on('tank', function(data) {
          games.forEach(function(val, index, arr) {
            if (val.p1 === socket.id) {
              io.in(val.p2).emit('tank', data);
            }
          });
        });
        socket.on('bomb', function(data) {
          games.forEach(function(val, index, arr) {
            if (val.p2 === socket.id) {
              io.in(val.p1).emit('bomb', data);
            }
          });
        });
        socket.on('plane', function(data) {
          games.forEach(function(val, index, arr) {
            if (val.p2 === socket.id) {
              io.in(val.p1).emit('plane', data);
            }
          });
        });
      } else if (bool === false){
        socket.emit('no');
      }
    });
  });
  console.log('server');
});
