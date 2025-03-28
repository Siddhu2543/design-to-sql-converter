
import React from 'react';
import { Message } from './ChatInterface';
import SqlEditor from './SqlEditor';
import './MessageList.css';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🖼️</div>
        <h2>Upload a UI design to get started</h2>
        <p>Upload an image of your UI design and I'll generate the SQL queries needed to support it.</p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
        >
          <div className="message-avatar">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div className="message-content">
            {message.image && (
              <div className="message-image-container">
                <img 
                  src={message.image} 
                  alt="Uploaded design" 
                  className="message-image" 
                />
              </div>
            )}
            <p>{message.content}</p>
            
            {message.sql && (
              <SqlEditor initialSql={message.sql} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
