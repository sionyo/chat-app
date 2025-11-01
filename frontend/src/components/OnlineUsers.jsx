import React from 'react';

const OnlineUsers = ({ users, currentUser }) => {
  return (
    <div className="online-users">
      <h3>🟢 Online Users ({users.length})</h3>
      <ul className="user-list">
        {users.map(user => (
          <li 
            key={user._id} 
            className={`user-item ${user._id === currentUser?._id ? 'you' : ''}`}
          >
            <span 
              className="user-item-color" 
              style={{ backgroundColor: user.color }}
            ></span>
            <span>
              {user.username}
              {user._id === currentUser?._id && ' (You)'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;