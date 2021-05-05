$(document).ready(() => {
  //Connect to the socket.io server
  const socket = io.connect();
  let currentUser;

  socket.emit('get online users');

  $('#create-user-btn').click((e) => {
    e.preventDefault();
    let username = $('#username-input').val();
    if (username.length > 0) {
      // Emit to the server the new user
      socket.emit('new user', username);
      $('.username-form').remove();
      // Show the main page
      $('.main-container').css('display', 'flex');
    }
  });

  $('#send-chat-btn').click((e) => {
    e.preventDefault();
    let msg = $('#chat-input').val();
    if (msg.length > 0) {
      // Emit new message to the server
      socket.emit('new message', { sender: currentUser, message: msg });
      $('#chat-input').val("");
    }
  });

  $('#new-channel-btn').click( () => {
    let newChannel = $('#new-channel-input').val();

    if (newChannel.length > 0) {
      socket.emit('new channel', newChannel);
      $('#new-channel-input').val("");
    }
  });

  socket.on('new user', (username) => {
    console.log(`✋ ${username} has joined the chat! ✋`);

    currentUser = username;

    // Add the new user to the online users div
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  });

  socket.on('new message', (data) => {
    console.log(`🎤 ${data.sender}: ${data.message} 🎤`);

    // Add the new user to the online users div
    $('.message-container').append(`
      <div class="message">
        <p class="message-user">${data.sender}: </p>
        <p class="message-text">${data.message}</p>
      </div>`);
  });

  socket.on('get online users', (onlineUsers) => {
    for (let username in onlineUsers) {
      $('.users-online').append(`<div class="user-online">${username}</div>`)
    }
  });

  socket.on('user has left', (onlineUsers) => {
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<p>${username}</p>`);
    }
  });
});