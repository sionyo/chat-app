require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const setupUserSocket = require('./sockets/userSocket');
const setupMessageSocket = require('./sockets/messageSocket'); // NEW

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('MongoDB connection error:', error));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Chat server is running!' });
});

// Get online users route
app.get('/api/users/online', async (req, res) => {
  try {
    const userController = require('./controllers/userController');
    const users = await userController.getOnlineUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// NEW: Get messages route
app.get('/api/messages', async (req, res) => {
  try {
    const messageController = require('./controllers/messageController');
    const messages = await messageController.getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// NEW: Get recent messages route
app.get('/api/messages/recent', async (req, res) => {
  try {
    const messageController = require('./controllers/messageController');
    const messages = await messageController.getRecentMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Setup WebSocket handlers
setupUserSocket(io);
setupMessageSocket(io); // NEW

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});