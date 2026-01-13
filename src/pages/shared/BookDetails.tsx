import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LivreAPI } from '../../api/livre.api';
import { Book } from '../../types/Book';

// Helper functions for book styling
const getBookSpineColor = (genre: string) => {
  const colors: Record<string, string> = {
    'Roman': '#C19A6B',
    'Science-Fiction': '#4A90E2',
    'Fantastique': '#8B4513',
    'Historique': '#B8860B',
    'Policier': '#2C3E50',
    'Biographie': '#7D3C98',
    'Thriller': '#C0392B',
    'Poésie': '#16A085',
    'Drame': '#8E44AD',
    'Humour': '#F39C12',
    'Aventure': '#27AE60',
    'Jeunesse': '#E74C3C',
  };
  return colors[genre] || '#9C5149';
};

const getBookCoverGradient = (genre: string) => {
  const gradients: Record<string, string> = {
    'Roman': 'linear-gradient(135deg, #C19A6B 0%, #8B7355 100%)',
    'Science-Fiction': 'linear-gradient(135deg, #4A90E2 0%, #2C5282 100%)',
    'Fantastique': 'linear-gradient(135deg, #8B4513 0%, #5D4037 100%)',
    'Historique': 'linear-gradient(135deg, #B8860B 0%, #D4AF37 100%)',
    'Policier': 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    'Biographie': 'linear-gradient(135deg, #7D3C98 0%, #9B59B6 100%)',
    'Thriller': 'linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)',
    'Poésie': 'linear-gradient(135deg, #16A085 0%, #1ABC9C 100%)',
    'Drame': 'linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%)',
    'Humour': 'linear-gradient(135deg, #F39C12 0%, #F1C40F 100%)',
    'Aventure': 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
    'Jeunesse': 'linear-gradient(135deg, #E74C3C 0%, #FF6B6B 100%)',
  };
  return gradients[genre] || 'linear-gradient(135deg, #9C5149 0%, #C19A6B 100%)';
};

const getBookIcon = (genre: string) => {
  const icons: Record<string, string> = {
    'Roman': '📖',
    'Science-Fiction': '🚀',
    'Fantastique': '🐉',
    'Historique': '🏛️',
    'Policier': '🕵️',
    'Biographie': '👤',
    'Thriller': '🔪',
    'Poésie': '✍️',
    'Drame': '🎭',
    'Humour': '😂',
    'Aventure': '🗺️',
    'Jeunesse': '🧒',
  };
  return icons[genre] || '📚';
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookRotating, setIsBookRotating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await LivreAPI.getById(Number(id));
        setBook(data);
      } catch {
        console.error('Livre introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#281C16',
        color: '#FFFBF5',
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontFamily: "'Cormorant Garamond', serif",
          animation: 'pulse 2s infinite',
        }}>
          📖 Chargement des détails du livre...
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#281C16',
        color: '#FFFBF5',
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 107, 107, 0.3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📖</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 600 }}>Livre introuvable</div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 25px',
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              color: '#FFFBF5',
              border: '2px solid rgba(255, 251, 245, 0.3)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const spineColor = getBookSpineColor(book.genre);
  const coverGradient = getBookCoverGradient(book.genre);
  const bookIcon = getBookIcon(book.genre);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#FFFBF5',
      overflow: 'hidden',
      backgroundColor: '#281C16',
    }}>
      
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=90)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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

      <div style={{ position: 'relative', zIndex: 2, padding: '70px 50px' }}>
        
        {/* Header */}
        <header style={{
          marginBottom: '40px',
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              fontSize: '1.1rem',
              color: '#FFFBF5',
              background: 'none',
              border: 'none',
              padding: '12px 25px',
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              borderRadius: '10px',
              border: '2px solid rgba(255, 251, 245, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: '25px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
              e.currentTarget.style.transform = 'translateX(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>←</span>
            Retour au catalogue
          </button>
          
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#FFFBF5',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.2,
            marginBottom: '10px',
          }}>
            {book.titre}
          </div>
          <div style={{
            color: '#FFD166',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontStyle: 'italic',
          }}>
            <span>✍️</span>
            <span>{book.auteur}</span>
          </div>
        </header>

        {/* Book Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '50px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          
          {/* Left Column - 3D Book Display */}
          <div style={{
            backgroundColor: 'rgba(255, 251, 245, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid rgba(255, 251, 245, 0.2)',
            textAlign: 'center',
            alignSelf: 'start',
            position: 'sticky',
            top: '30px',
            overflow: 'hidden',
          }}>
            {/* Book Rotate Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px',
            }}>
              <button
                onClick={() => setIsBookRotating(!isBookRotating)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 209, 102, 0.1)',
                  color: '#FFD166',
                  border: '2px solid rgba(255, 209, 102, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                  e.currentTarget.style.borderColor = '#FFD166';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                }}
              >
                {isBookRotating ? '⏸️' : '▶️'} {isBookRotating ? 'Pause' : 'Tourner'} le livre
              </button>
            </div>

            {/* 3D Book Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              transformStyle: 'preserve-3d',
              transform: isBookRotating ? 'rotateY(15deg)' : 'rotateY(-15deg)',
              transition: 'transform 2s ease',
              marginBottom: '40px',
            }}>
              
              {/* Book Cover - Front */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: book.image ? `url(${book.image}) center/cover` : coverGradient,
                borderRadius: '8px 20px 20px 8px',
                border: '3px solid rgba(255, 251, 245, 0.3)',
                boxShadow: '20px 20px 40px rgba(0, 0, 0, 0.4)',
                transform: 'translateZ(25px)',
                overflow: 'hidden',
              }}>
                {/* Cover Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(40, 28, 22, 0.1) 0%, rgba(156, 81, 73, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {!book.image && (
                    <div style={{
                      fontSize: '5rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}>
                      {bookIcon}
                    </div>
                  )}
                </div>
                
                {/* Gold Border Effect */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  right: '15px',
                  bottom: '15px',
                  border: '2px solid rgba(255, 209, 102, 0.3)',
                  borderRadius: '4px 16px 16px 4px',
                  pointerEvents: 'none',
                }} />
              </div>
              
              {/* Book Spine */}
              <div style={{
                position: 'absolute',
                left: '-25px',
                top: '15px',
                bottom: '15px',
                width: '25px',
                backgroundColor: spineColor,
                borderRadius: '4px 0 0 4px',
                transform: 'rotateY(-90deg) translateX(-12.5px)',
                boxShadow: 'inset -3px 0 10px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  transform: 'rotate(90deg)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}>
                  {book.genre}
                </div>
              </div>
              
              {/* Book Pages Effect */}
              <div style={{
                position: 'absolute',
                left: '-22px',
                top: '20px',
                bottom: '20px',
                width: '20px',
                backgroundColor: '#FFFBF5',
                transform: 'rotateY(-90deg) translateX(-10px)',
                borderRadius: '3px 0 0 3px',
                boxShadow: 'inset -2px 0 5px rgba(0, 0, 0, 0.2)',
                opacity: 0.9,
              }} />
              
              {/* Book Shadow */}
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '30px',
                right: '30px',
                height: '30px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '50%',
                filter: 'blur(15px)',
                transform: 'translateZ(-20px)',
              }} />
            </div>
            
            {/* Book Stats */}
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.08)',
              borderRadius: '14px',
              padding: '25px',
              marginBottom: '30px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 251, 245, 0.1)',
              }}>
                <span style={{ 
                  color: 'rgba(255, 251, 245, 0.9)', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📚 Disponibilité
                </span>
                <span style={{
                  color: book.numTotalLivres > 0 ? '#4CAF50' : '#FF6B6B',
                  fontWeight: 600,
                  padding: '6px 15px',
                  backgroundColor: book.numTotalLivres > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '20px',
                  border: `1px solid ${book.numTotalLivres > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`,
                }}>
                  {book.numTotalLivres} exemplaire{book.numTotalLivres > 1 ? 's' : ''}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid rgba(255, 251, 245, 0.1)',
              }}>
                <span style={{ 
                  color: 'rgba(255, 251, 245, 0.9)', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📄 Pages
                </span>
                <span style={{ 
                  color: '#FFD166', 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}>
                  {book.numPages}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ 
                  color: 'rgba(255, 251, 245, 0.9)', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📑 Chapitres
                </span>
                <span style={{ 
                  color: '#FFD166', 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}>
                  {book.numChapters}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '30px' }}>
              <button
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.1) 0%, rgba(255, 155, 84, 0.1) 100%)',
                  color: '#FFD166',
                  border: '2px solid rgba(255, 209, 102, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Cormorant Garamond', serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '15px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 209, 102, 0.2) 0%, rgba(255, 155, 84, 0.2) 100%)';
                  e.currentTarget.style.borderColor = '#FFD166';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 209, 102, 0.1) 0%, rgba(255, 155, 84, 0.1) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>📖</span>
                Demander en prêt
                <span style={{
                  position: 'absolute',
                  right: '20px',
                  fontSize: '1.2rem',
                  transition: 'transform 0.3s ease',
                }}>→</span>
              </button>
              
              <button
                style={{
                  width: '100%',
                  padding: '18px',
                  background: 'linear-gradient(135deg, rgba(156, 81, 73, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%)',
                  color: '#9C5149',
                  border: '2px solid rgba(156, 81, 73, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Cormorant Garamond', serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(156, 81, 73, 0.2) 0%, rgba(192, 57, 43, 0.2) 100%)';
                  e.currentTarget.style.borderColor = '#9C5149';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(156, 81, 73, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(156, 81, 73, 0.1) 0%, rgba(192, 57, 43, 0.1) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(156, 81, 73, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>📚</span>
                Ajouter à ma liste
                <span style={{
                  position: 'absolute',
                  right: '20px',
                  fontSize: '1.2rem',
                  transition: 'transform 0.3s ease',
                }}>+</span>
              </button>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div>
            {/* Book Metadata */}
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 251, 245, 0.2)',
              marginBottom: '30px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
              }}>
                <div style={{
                  width: '16px',
                  height: '50px',
                  backgroundColor: '#FFD166',
                  borderRadius: '8px',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 20px rgba(255, 209, 102, 0.3)',
                }} />
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#FFFBF5',
                  fontFamily: "'Playfair Display', serif",
                  margin: 0,
                }}>
                  📋 Informations du livre
                </h3>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '25px',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 251, 245, 0.7)',
                    marginBottom: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    🏷️ Genre
                  </div>
                  <div style={{
                    padding: '15px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.08)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFBF5',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {book.genre}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 251, 245, 0.7)',
                    marginBottom: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    🔢 ISBN
                  </div>
                  <div style={{
                    padding: '15px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.08)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFBF5',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                  }}>
                    {book.isbn}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 251, 245, 0.7)',
                    marginBottom: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    🗣️ Langue
                  </div>
                  <div style={{
                    padding: '15px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.08)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    color: '#FFFBF5',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    Français
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 251, 245, 0.7)',
                    marginBottom: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    ⭐ État
                  </div>
                  <div style={{
                    padding: '15px 20px',
                    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(39, 174, 96, 0.1) 100%)',
                    border: '2px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '10px',
                    color: '#4CAF50',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    minHeight: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>✨</span>
                    Excellent
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 251, 245, 0.2)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px',
                paddingBottom: '15px',
                borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
              }}>
                <div style={{
                  width: '16px',
                  height: '50px',
                  backgroundColor: '#FF9B54',
                  borderRadius: '8px',
                  animation: 'pulse 2s infinite',
                  boxShadow: '0 0 20px rgba(255, 155, 84, 0.3)',
                }} />
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#FFFBF5',
                  fontFamily: "'Playfair Display', serif",
                  margin: 0,
                }}>
                  📖 Synopsis
                </h3>
              </div>
              
              <div style={{
                color: 'rgba(255, 251, 245, 0.9)',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                textAlign: 'justify',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  fontSize: '4rem',
                  color: 'rgba(255, 251, 245, 0.05)',
                  fontFamily: "'Playfair Display', serif",
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  "
                </div>
                
                {book.synopsis || (
                  <>
                    <p style={{ marginBottom: '20px' }}>
                      Ce livre exceptionnel fait partie de notre collection la plus prestigieuse. 
                      Écrit par <span style={{ color: '#FFD166', fontWeight: 600 }}>{book.auteur}</span>, 
                      il incarne l'excellence littéraire à travers une narration captivante et profonde.
                    </p>
                    
                    <p style={{ marginBottom: '20px' }}>
                      Au cœur du genre <span style={{ color: '#FF9B54', fontWeight: 600 }}>{book.genre}</span>, 
                      cette œuvre vous transporte dans un univers riche en émotions, réflexions et découvertes. 
                      Chaque page tournée révèle de nouvelles perspectives et une compréhension plus profonde 
                      des thèmes abordés.
                    </p>
                    
                    <p>
                      Parfait pour les passionnés de littérature exigeante, ce livre s'impose comme 
                      une référence incontournable dans sa catégorie. Sa profondeur narrative et 
                      son style élégant en font un compagnon idéal pour les lecteurs en quête 
                      d'enrichissement intellectuel et émotionnel.
                    </p>
                  </>
                )}
                
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  right: '-10px',
                  fontSize: '4rem',
                  color: 'rgba(255, 251, 245, 0.05)',
                  fontFamily: "'Playfair Display', serif",
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  "
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          padding: '30px',
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: book.numTotalLivres > 0 ? '#4CAF50' : '#FF6B6B',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{
                color: 'rgba(255, 251, 245, 0.9)',
                fontWeight: 600,
              }}>
                {book.numTotalLivres > 0 ? 'Disponible pour le prêt' : 'Indisponible'}
              </span>
            </div>
          </div>
          
          <div style={{
            color: 'rgba(255, 251, 245, 0.8)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            textAlign: 'right',
          }}>
            <div>ISBN: {book.isbn}</div>
            <div>Dernière vérification: {new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </footer>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          @keyframes bookRotate {
            0% {
              transform: rotateY(-15deg);
            }
            100% {
              transform: rotateY(15deg);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          ::-webkit-scrollbar {
            width: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 251, 245, 0.1);
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #FFD166, #FF9B54);
            border-radius: 5px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #FF9B54, #FF6B6B);
          }
        `}
      </style>
    </div>
  );
};

export default BookDetails;