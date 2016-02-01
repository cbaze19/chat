var socket = io();
var currRoom = '';

$('form').submit(function() {
	socket.emit('chat message', { room: currRoom, from: socket.name, msg: $('#message-input').val() });
	$('#message-input').val('');
	return false;
});


socket.on('chat message', function(msg) {
	$('#messages').append($('<li>').text(msg));
});


socket.on('update user list', function(users) {
	$('#user-list').html('');
	for (var i in users) {
		$('#user-list').append('<li>' + users[i].name + '</li>');
		console.log(users[i].name);
	}
});


$(function() {

	$('#connect-button').on('click', function() {
		socket.emit('new user', $('#username-input').val());
	});

	$('#newroom-button').on('click', function() {
		socket.emit('create room', $('#newroom-input').val());
		currRoom = $('#newroom-input').val();
	});

});