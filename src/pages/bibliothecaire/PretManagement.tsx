import React from 'react';
import { useNavigate } from 'react-router-dom';

const PretManagement = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#FFFBF5',
      overflow: 'hidden',
      backgroundColor: '#281C16',
      padding: '70px 50px',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80)',
        filter: 'brightness(0.8)',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(40, 28, 22, 0.95) 0%, rgba(156, 81, 73, 0.9) 100%)',
          zIndex: 1,
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '25px',
          borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '16px',
              height: '60px',
              backgroundColor: '#FFD166',
              borderRadius: '8px',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 20px rgba(255, 209, 102, 0.3)',
            }} />
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
              textTransform: 'uppercase',
            }}>
              Gestion des Prêts
            </div>
          </div>
          
          <button
            onClick={() => navigate('/biblio')}
            style={{
              color: '#FFFBF5',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              padding: '12px 25px',
              backgroundColor: 'rgba(255, 251, 245, 0.12)',
              borderRadius: '10px',
              border: '2px solid rgba(255, 251, 245, 0.3)',
              transition: 'all 0.3s ease',
              fontFamily: "'Cormorant Garamond', serif",
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Retour au Dashboard
          </button>
        </header>

        {/* Content */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#FFFBF5',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '20px',
          }}>
            📖 Gestion des Prêts
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 251, 245, 0.8)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            Cette page est actuellement en construction. Elle permettra de gérer tous les prêts de livres.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '40px',
          }}>
            <button
              onClick={() => navigate('/biblio/livres')}
              style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                color: '#FFD166',
                border: '2px solid rgba(255, 209, 102, 0.3)',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                e.currentTarget.style.borderColor = '#FFD166';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📚 Gérer les Livres
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default PretManagement;