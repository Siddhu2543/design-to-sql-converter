
import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Header from './Header';
import './ChatInterface.css';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  image?: string;
  sql?: string;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Generate a unique ID for each message
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    if (!text.trim() && !currentImage) return;

    const newUserMessage: Message = {
      id: generateId(),
      content: text,
      role: 'user',
      image: currentImage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentImage('');
    setIsProcessing(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = processUserMessage(newUserMessage);
      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  // Process the user message and generate AI response with SQL
  const processUserMessage = (userMessage: Message): Message => {
    let responseContent = "I've analyzed your design image and generated SQL queries based on what I see.";
    let sql = "";

    // If there's an image, generate SQL based on the "design"
    if (userMessage.image) {
      sql = generateSqlFromImage(userMessage.image);
    } else {
      // Handle text-only queries with a default response
      responseContent = "I can help convert UI designs to SQL. Please upload an image of your UI design to get started.";
    }

    return {
      id: generateId(),
      content: responseContent,
      role: 'assistant',
      sql: sql,
    };
  };

  // Generate SQL based on the image (this would be where your real ML/AI logic goes)
  const generateSqlFromImage = (imageSrc: string): string => {
    // This is a placeholder function that would be replaced with real AI logic
    // For now, we'll return a demo SQL query
    return `-- Generated SQL based on UI design
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;
  };

  // Image upload state and handlers
  const [currentImage, setCurrentImage] = useState<string>('');

  const handleImageUpload = (base64Image: string) => {
    setCurrentImage(base64Image);
  };

  return (
    <div className="chat-interface">
      <Header />
      <main className="chat-container">
        <MessageList messages={messages} />
        <div ref={endOfMessagesRef} />
      </main>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onImageUpload={handleImageUpload}
        currentImage={currentImage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ChatInterface;
