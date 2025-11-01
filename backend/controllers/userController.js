const User = require('../models/User');

const userController = {
  createUser: async (socketId) => {
    try {
      const randomNumber = Math.floor(Math.random() * 10000);
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const user = new User({
        username: `User${randomNumber}`,
        socketId: socketId,
        color: randomColor,
        isOnline: true,
        lastSeen: new Date()
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUserBySocketId: async (socketId) => {
    try {
      return await User.findOne({ socketId });
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  },

  setUserOffline: async (socketId) => {
    try {
      const user = await User.findOne({ socketId });
      if (user) {
        user.isOnline = false;
        user.lastSeen = new Date();
        await user.save();
      }
      return user;
    } catch (error) {
      console.error('Error setting user offline:', error);
      throw error;
    }
  },

  getOnlineUsers: async () => {
    try {
      return await User.find({ isOnline: true });
    } catch (error) {
      console.error('Error getting online users:', error);
      throw error;
    }
  }

  // Removed updateUsername function!
};

module.exports = userController;