
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1>Design to SQL Converter</h1>
      <p>Upload a UI design image to generate SQL queries</p>
    </header>
  );
};

export default Header;
