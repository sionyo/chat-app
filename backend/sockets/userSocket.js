const userController = require('../controllers/userController');

function setupUserSocket(io) {
  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    try {
      // Create user in database
      const user = await userController.createUser(socket.id);
      
      // Send welcome to the new user
      socket.emit('welcome', {
        message: 'Welcome to chat!',
        yourInfo: user
      });

      // Send list of online users to new user
      const onlineUsers = await userController.getOnlineUsers();
      socket.emit('onlineUsers', onlineUsers);

      // Tell everyone else that new user joined
      socket.broadcast.emit('userJoined', {
        message: user.username + ' joined the chat',
        user: user
      });

    } catch (error) {
      console.log('Error creating user:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }

    // When user disconnects
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      try {
        const user = await userController.setUserOffline(socket.id);
        if (user) {
          // Tell everyone user left
          socket.broadcast.emit('userLeft', {
            message: user.username + ' left the chat',
            user: user
          });
        }
      } catch (error) {
        console.log('Error handling disconnect:', error);
      }
    });

    // No username change handler - removed!
  });
}

module.exports = setupUserSocket;