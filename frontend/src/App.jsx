import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import OnlineUsers from './components/OnlineUsers';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import './index.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // User events
    newSocket.on('welcome', (data) => {
      console.log('Welcome:', data);
      setCurrentUser(data.yourInfo);
    });

    newSocket.on('onlineUsers', (users) => {
      console.log('Online users:', users);
      setOnlineUsers(users);
    });

    newSocket.on('userJoined', (data) => {
      console.log('User joined:', data);
      setOnlineUsers(prev => [...prev, data.user]);
      
      setMessages(prev => [...prev, {
        text: data.message,
        username: 'System',
        timestamp: new Date()
      }]);
    });

    newSocket.on('userLeft', (data) => {
      console.log('User left:', data);
      setOnlineUsers(prev => prev.filter(user => user._id !== data.user._id));
      
      setMessages(prev => [...prev, {
        text: data.message,
        username: 'System',
        timestamp: new Date()
      }]);
    });

    // Message events
    newSocket.on('messagesHistory', (messageHistory) => {
      console.log('Message history:', messageHistory);
      setMessages(messageHistory);
    });

    newSocket.on('newMessage', (message) => {
      console.log('New message:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userTyping', (data) => {
      console.log('User typing:', data);
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== data.userId);
        return [...filtered, data];
      });
    });

    newSocket.on('userStoppedTyping', (data) => {
      console.log('User stopped typing:', data);
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setMessages(prev => [...prev, {
        text: `Error: ${data.message}`,
        username: 'System',
        timestamp: new Date()
      }]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (messageText) => {
    if (socket && currentUser) {
      socket.emit('sendMessage', {
        text: messageText
      });
    }
  };

  const handleTypingStart = () => {
    if (socket) {
      socket.emit('typingStart');
    }
  };

  const handleTypingStop = () => {
    if (socket) {
      socket.emit('typingStop');
    }
  };

  return (
    <div className="app">
      {/* User Info Header */}
      {currentUser && (
        <div className="user-info-header">
          <h2>greenCat Group Chat</h2>
          <div className="user-details">
            <span 
              className="user-color-badge" 
              style={{ backgroundColor: currentUser.color }}
            ></span>
            You are: <strong>{currentUser.username}</strong>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!currentUser && (
        <div className="connection-status">
          {isConnected ? '🟢 Connecting to chat...' : '🔴 Connecting to server...'}
        </div>
      )}

      <div className="chat-container">
        <OnlineUsers users={onlineUsers} currentUser={currentUser} />
        
        <div className="chat-area">
          <MessageList 
            messages={messages} 
            typingUsers={typingUsers}
            currentUser={currentUser} 
          />
          
          <MessageInput 
            onSendMessage={sendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default App;