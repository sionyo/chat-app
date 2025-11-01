import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, typingUsers, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <div 
          key={message._id || message.timestamp} 
          className={`message ${message.username === 'System' ? 'system' : ''}`}
          style={message.userColor ? { borderLeftColor: message.userColor } : {}}
        >
          <strong>{message.username}:</strong> {message.text}
          <span className="timestamp">
            {formatTime(message.createdAt || message.timestamp)}
          </span>
        </div>
      ))}
      
      {/* Typing Indicators */}
      {typingUsers.map((user) => (
        <div key={user.userId} className="typing-indicator">
          <strong>{user.username}</strong> is typing...
        </div>
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;