import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact</h1>
      <p style={{ marginBottom: '2rem' }}>Contact information and form will be here.</p>
      <Link 
        to="/"
        style={{
          padding: '0.75rem 1.5rem',
          border: '2px solid #667eea',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Contact;