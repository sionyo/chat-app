import React, { useState, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, currentUser }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Handle typing indicators
  useEffect(() => {
    let typingTimer;
    
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    } else if (!message.trim() && isTyping) {
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        onTypingStop();
      }, 1000);
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [message, isTyping, onTypingStart, onTypingStop]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && currentUser) {
      onSendMessage(message.trim());
      setMessage('');
      if (isTyping) {
        setIsTyping(false);
        onTypingStop();
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        placeholder={currentUser ? "Type your message..." : "Connecting..."}
        value={message}
        onChange={handleChange}
        className="message-input"
        disabled={!currentUser}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={!message.trim() || !currentUser}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;