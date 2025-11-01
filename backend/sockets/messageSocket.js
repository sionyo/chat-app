const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

function setupMessageSocket(io) {
  io.on('connection', async (socket) => {
    console.log('Message socket connected:', socket.id);

    // Send recent messages when user connects
    try {
      console.log('Sending message history to:', socket.id);
      const messages = await messageController.getRecentMessages();
      socket.emit('messagesHistory', messages);
      console.log('Message history sent');
    } catch (error) {
      console.error('Error sending messages history:', error);
      socket.emit('error', { message: 'Failed to load messages' });
    }

    // Handle new message
    socket.on('sendMessage', async (messageData) => {
      try {
        console.log('New message received:', messageData);
        
        // Create message in database
        const message = await messageController.createMessage(messageData.text, socket.id);
        
        console.log('Message created:', message);
        
        // Broadcast to all connected clients
        io.emit('newMessage', message);
        
        console.log('Message broadcasted to all users');
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typingStart', async () => {
      try {
        const user = await userController.getUserBySocketId(socket.id);
        if (user) {
          socket.broadcast.emit('userTyping', {
            username: user.username,
            userId: user._id
          });
        }
      } catch (error) {
        console.error('Error handling typing start:', error);
      }
    });

    socket.on('typingStop', async () => {
      try {
        const user = await userController.getUserBySocketId(socket.id);
        if (user) {
          socket.broadcast.emit('userStoppedTyping', {
            userId: user._id
          });
        }
      } catch (error) {
        console.error('Error handling typing stop:', error);
      }
    });
  });
}

module.exports = setupMessageSocket;