var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

// Authenticator
app.use(function(req, res, next) {
    var auth;
 
    if (req.headers.authorization) {
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    if (!auth || auth[0] !== 'caleb' || auth[1] !== 'baze') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="BazeChat"');
        res.end('Unauthorized');
    } else {
        next();
    }
});

// Define Paths for media files and public views
app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(__dirname + '/public'));

// Root path to index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var users = {};

// Main connection handler
io.on('connection', function(socket) {

	var clientIP = socket.request.connection.remoteAddress;

	var userAdded = false;

	socket.on('new user', function(uname) {

		if (!userAdded) {

			socket.username = uname;

			users[uname] = socket.username;

			userAdded = true;
			console.log(socket.username + ' has connected from ' + clientIP);
			io.emit('update user list', users);

		}
		
	});

	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('disconnect', function() {
		if (userAdded) {
			delete users[socket.username];
			io.emit('update user list', users);
		}
		console.log(socket.username + ' has disconnected.');
	});
});

// Start server
http.listen(port, function(){
	console.log('listening on ' + port);
});

function getSocketFromName(n) {
	for (var i in io.sockets.sockets) {
		if (io.sockets.sockets[i].username == n) {
			return i;
		}
	}
}