var socket = io();

$('form').submit(function() {
	socket.emit('chat message', $('#message-input').val());
	$('#message-input').val('');
	return false;
});

socket.on('chat message', function(msg) {
	$('#messages').append($('<li>').text(msg));
});

socket.on('update user list', function(users) {
	$('#user-list').html('');
	for (var i in users) {
		$('#user-list').append('<li>' + i + '</li>');
		console.log(i);
	}
});

$(function() {

	$('#connect-button').on('click', function() {
		socket.emit('new user', $('#username-input').val());

		$('#login-div').addClass('inactive');
		$('#chat-div').removeClass('inactive');

	});

});