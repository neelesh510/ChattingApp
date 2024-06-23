import React from 'react';

const MessageCard = ({ messages }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.isOwnMessage ? 'own-message' : 'other-message'} p-2 mb-2`}
        >
          <div className="message-text">{message.message}</div>
          <div className="message-time text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageCard;
