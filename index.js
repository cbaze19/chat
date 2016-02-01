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


var users = [];
var history = [];


// Main connection handler
io.on('connection', function(socket) {

	var clientIP = socket.request.connection.remoteAddress;
	var userAdded = false;
	var currRoom = '';


	socket.on('new user', function(name) {
		socket.name = name;

		users.push({ id: socket.id, name: socket.name });
		userAdded = true;
		io.emit('update user list', users);
		socket.join('lobby');
		currRoom = 'lobby';
		console.log(users);
	});


	socket.on('create room', function(rname) {
		socket.join(rname);
		currRoom = rname;
	});


	socket.on('chat message', function(data) {
		io.to(currRoom).emit('chat message', data.msg);
		history.push(data);
	});


	socket.on('disconnect', function() {
		if (userAdded) {
			var elementPos = users.map(function(x) {return x.id;}).indexOf(socket.id);
			users.splice(elementPos, 1);
			io.emit('update user list', users);
		}
		console.log(socket.username + ' has disconnected.');
	});
});

// Start server
http.listen(port, function(){
	console.log('listening on ' + port);
});

