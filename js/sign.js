window.onload = function(){
	var socket = io('http://10.0.1.14:3000');
	console.log('ready');
	$("#login").click(function(){
		console.log('clicked');
		console.log($('#userName').val());
		console.log($('#userPassword').val());
		socket.emit('checking', {
			name:$('#userName').val(),
			pass:$('#userPassword').val()
		});
		socket.on('gtg', function(data){
			console.log('ready');
			Cookies.set('name', $('#userName').val());
			Cookies.set('pass', $('#userPassword').val());
				window.location.href = "index.html";
		});
	});
};
