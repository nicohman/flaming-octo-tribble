
var io = require('socket.io')(/*2673*/3000);
var http = require('http')
var fs = require('fs');
var ip = null;
var queue = [];
var games = [];
io.on('connection', function(socket){
	var clientIp = socket.request.connection.remoteAddress;
	console.log('connection!');
	socket.on('looking', function(data){
		console.log('lookin')
		queue.push(socket.id);
		if(queue.length > 1){
			console.log('yay!')
			games.push({
				p1:socket.id,
				p2:queue[0]
			});
			socket.emit('done', {tank:true});
			console.log(queue[0])
			socket.in(queue[0]).emit('done', {tank:false});
			queue.splice(0, 2);
			console.log(games);
			console.log(queue);
		} else {
			return;
		}
	});
	socket.on('tank', function(data){
		games.forEach(function(val, index, arr){
			if(val.p1 === socket.id){
				io.in(val.p2).emit('tank', data);
			}
		})
	})
	socket.on('bomb', function(data){
		games.forEach(function(val, index, arr){
			if(val.p2 === socket.id){
				io.in(val.p1).emit('bomb', data);
			}
		})
	})
	socket.on('plane', function(data){
		games.forEach(function(val, index, arr){
			if(val.p2 === socket.id){
				io.in(val.p1).emit('plane', data);
			}
		})
	})
})
/*http.createServer(function(req, res){
	if(req.url[req.url.split('.')[1] === "png"]){
		fs.readFile('../'+req.url, function(err, data){
			res.end(data);
		});
	}else {
	fs.readFile('../'+req.url, {encoding:'utf8'}, function(err, data){
		res.end(data);
	});
}
}).listen(7000)*/
console.log('server');
