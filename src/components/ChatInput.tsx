
import React, { useState, useRef } from 'react';
import { FileUpload } from './FileUpload';
import './ChatInput.css';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onImageUpload: (base64Image: string) => void;
  currentImage: string;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onImageUpload,
  currentImage,
  isProcessing 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize the textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Remove the uploaded image
  const handleRemoveImage = () => {
    onImageUpload('');
  };

  return (
    <div className="chat-input-container">
      {currentImage && (
        <div className="image-preview">
          <img src={currentImage} alt="Upload preview" />
          <button 
            type="button" 
            className="remove-image-button" 
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      )}
      
      <form className="chat-form" onSubmit={handleSubmit}>
        <FileUpload onImageUpload={onImageUpload} />
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or upload a UI design image..."
          rows={1}
          disabled={isProcessing}
          className="chat-textarea"
        />
        
        <button 
          type="submit" 
          className="send-button"
          disabled={isProcessing || (!message.trim() && !currentImage)}
        >
          {isProcessing ? 'Processing...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
