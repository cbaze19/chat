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

var inviter = '';

socket.on('invite', function(from) {
	console.log('Invite to chat from ' + from);
	$('#invite-text').text('Invite to chat from ' + from);
	$('#invite-div').removeClass('inactive');
	inviter = from;
});



$(function() {

	$('#connect-button').on('click', function() {
		socket.emit('new user', $('#username-input').val());

		$('#login-div').addClass('inactive');
		$('#chat-div').removeClass('inactive');

	});

	$(document).on('click', 'li', function() {
		socket.emit('invite', $(this).text());
	});

	$(document).on('click', '#decline-button', function() {
		$('#chat-div').addClass('inactive');
		inviter = '';
	});

	$(document).on('click', '#accept-button', function() {
		socket.emit('accept', inviter);
	});

});