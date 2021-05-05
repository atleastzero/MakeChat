module.exports = (io, socket, onlineUsers, channels) => {
  // Listen for "new user" socket emits
  socket.on('new user', (username) => {
    onlineUsers[username] = socket.id;
    socket["username"] = username;

    // Send the username to all clients currently connected
    io.emit("new user", username);
  });

  // Listen for "new message" socket emits
  socket.on('new message', (data) => {
    // Save
    channels[data.channel].push({ sender: data.sender, message: data.message });
    // Emit
    io.to(data.channel).emit("new message", data);
  });

  socket.on('get online users', () => {
    // Send over the onlineUsers
    socket.emit('get online users', onlineUsers);
  });

  socket.on('get all channels', () => {
    socket.emit('get all channels', channels);
  });

  socket.on('new channel', (newChannel) => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    //Have the socket join the new channel room.
    socket.join(newChannel);
    //Inform all clients of the new channel.
    io.emit('new channel', newChannel);
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  });

  socket.on('user changed channel', (newChannel) => {
    socket.join(newChannel);
    socket.emit('user changed channel', {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.username];
    io.emit('user has left', onlineUsers);
  });
}