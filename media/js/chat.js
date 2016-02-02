var socket = io();
var currRoom = '';
var uname = '';

$('form').submit(function() {
	socket.emit('chat message', { room: currRoom, from: uname, msg: $('#message-input').val() });
	$('#message-input').val('');
	return false;
});


socket.on('chat message', function(data) {
	if (data.room == currRoom) {
		$('#messages').append($('<li>').text(data.from + ': ' + data.msg));
	}
});


socket.on('load history', function(history) {
	console.log('loading history!');
	for (var i in history) {
		if (history[i].room == currRoom) {
			$('#messages').append($('<li>').text(history[i].from + ': ' + history[i].msg));
		}
	}
});


socket.on('update user list', function(users) {
	$('#user-list').html('');
	for (var i in users) {
		$('#user-list').append('<li>' + users[i].name + '</li>');
	}
});


$(function() {

	$('#connect-button').on('click', function() {
		socket.emit('new user', $('#username-input').val());
		uname = $('#username-input').val();
	});

	$('#newroom-button').on('click', function() {
		socket.emit('create room', $('#newroom-input').val());
		currRoom = $('#newroom-input').val();
		$('#room-name').text(currRoom);
	});

});