import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About Us</h1>
      <p style={{ marginBottom: '2rem' }}>Information about the library will be displayed here.</p>
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

export default About;