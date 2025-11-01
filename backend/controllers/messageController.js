const Message = require('../models/Message');
const User = require('../models/User');

const messageController = {
  // Create new message
  createMessage: async (text, socketId) => {
    try {
      console.log('Creating message:', text, 'for socket:', socketId);
      
      // Find user who sent the message
      const user = await User.findOne({ socketId });
      if (!user) {
        throw new Error('User not found');
      }

      console.log('Found user:', user.username);

      const message = new Message({
        text,
        user: user._id,
        username: user.username,
        userColor: user.color
      });

      await message.save();
      console.log('Message saved to database');
      
      return {
        _id: message._id,
        text: message.text,
        user: user._id,
        username: user.username,
        userColor: user.color,
        createdAt: message.createdAt
      };
      
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Get recent messages (for when user joins)
  getRecentMessages: async (limit = 50) => {
    try {
      const messages = await Message.find()
        .populate('user', 'username color')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Get all messages (for history)
  getAllMessages: async () => {
    try {
      return await Message.find()
        .populate('user', 'username color')
        .sort({ createdAt: 1 });
    } catch (error) {
      console.error('Error getting all messages:', error);
      throw error;
    }
  }
};

module.exports = messageController;