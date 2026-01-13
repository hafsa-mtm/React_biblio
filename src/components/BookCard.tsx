import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

interface Props {
  book: Book;
}

const BookCard = ({ book }: Props) => {
  const navigate = useNavigate();

  // Generate sophisticated colors based on genre
  const getBookSpineColor = (genre: string) => {
    const colors: Record<string, string> = {
      'Roman': '#8B7355',
      'Science-Fiction': '#2C5282',
      'Fantastique': '#5D4037',
      'Historique': '#B8860B',
      'Policier': '#1A202C',
      'Biographie': '#553C9A',
      'Thriller': '#C53030',
      'Poésie': '#285E61',
      'Drame': '#6B46C1',
      'Humour': '#D69E2E',
      'Aventure': '#276749',
      'Jeunesse': '#E53E3E',
    };
    return colors[genre] || '#9C5149';
  };

  // Generate elegant book cover designs
  const getBookCoverDesign = (genre: string) => {
    const designs: Record<string, { color: string; pattern: string }> = {
      'Roman': {
        color: '#C19A6B',
        pattern: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)'
      },
      'Science-Fiction': {
        color: '#2D3748',
        pattern: 'radial-gradient(circle at 20% 80%, rgba(66, 153, 225, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(66, 153, 225, 0.2) 0%, transparent 50%)'
      },
      'Fantastique': {
        color: '#5D4037',
        pattern: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(101, 67, 33, 0.3) 100%)'
      },
      'Historique': {
        color: '#B8860B',
        pattern: 'repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.1) 10px, rgba(184, 134, 11, 0.1) 10px, rgba(184, 134, 11, 0.1) 20px)'
      },
      'Policier': {
        color: '#1A202C',
        pattern: 'linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
      },
    };
    return designs[genre] || { 
      color: '#9C5149', 
      pattern: 'linear-gradient(135deg, rgba(156, 81, 73, 0.3) 0%, rgba(192, 57, 43, 0.3) 100%)' 
    };
  };

  // Get elegant book icon
  const getBookIcon = (genre: string) => {
    const icons: Record<string, string> = {
      'Roman': '📜',
      'Science-Fiction': '🚀',
      'Fantastique': '✨',
      'Historique': '🏺',
      'Policier': '🔍',
      'Biographie': '👑',
      'Thriller': '⚡',
      'Poésie': '🌸',
      'Drame': '🎭',
      'Humour': '😄',
      'Aventure': '🗺️',
      'Jeunesse': '🎈',
    };
    return icons[genre] || '📚';
  };

  const spineColor = getBookSpineColor(book.genre);
  const coverDesign = getBookCoverDesign(book.genre);
  const bookIcon = getBookIcon(book.genre);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '460px',
      background: 'linear-gradient(145deg, rgba(25, 18, 15, 0.98) 0%, rgba(45, 32, 27, 0.98) 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 251, 245, 0.12)',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 209, 102, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.4)';
      const glow = e.currentTarget.querySelector('.book-glow') as HTMLDivElement;
      if (glow) glow.style.opacity = '1';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.12)';
      const glow = e.currentTarget.querySelector('.book-glow') as HTMLDivElement;
      if (glow) glow.style.opacity = '0';
    }}
    onClick={() => navigate(`/livres/${book.idLivre}`)}
    >
      
      {/* Enhanced Library Shelf Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 209, 102, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 209, 102, 0.02) 0%, transparent 50%),
          linear-gradient(90deg, 
            rgba(255, 209, 102, 0.02) 1px, 
            transparent 1px
          ),
          linear-gradient(
            rgba(255, 209, 102, 0.02) 1px, 
            transparent 1px
          )
        `,
        backgroundSize: '24px 24px',
        opacity: 0.5,
      }} />

      {/* Glow Effect */}
      <div className="book-glow" style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'radial-gradient(circle at 50% 0%, rgba(255, 209, 102, 0.08) 0%, transparent 60%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        height: '100%',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2,
      }}>
        
        {/* Book ID Badge - Professional Design */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, rgba(255, 251, 245, 0.1), rgba(255, 251, 245, 0.05))',
          border: '1px solid rgba(255, 251, 245, 0.15)',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '0.7rem',
          fontWeight: '700',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: 'rgba(255, 209, 102, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}>
          REF: {book.idLivre.toString().padStart(5, '0')}
        </div>

        {/* Book Display Area */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          minHeight: '280px',
        }}>
          
          {/* Enhanced Book Shadow */}
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '25px',
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }} />

          {/* 3D Book */}
          <div style={{
            position: 'relative',
            width: '220px',
            height: '280px',
            transformStyle: 'preserve-3d',
            transform: 'perspective(1200px) rotateY(-15deg)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'perspective(1200px) rotateY(-25deg) translateZ(10px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'perspective(1200px) rotateY(-15deg) translateZ(0)';
          }}
          >
            
            {/* Book Cover */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: book.image ? `url(${book.image}) center/cover no-repeat` : coverDesign.color,
              backgroundImage: book.image ? `url(${book.image})` : `${coverDesign.pattern}, ${coverDesign.color}`,
              borderRadius: '8px 18px 18px 8px',
              border: '3px solid rgba(255, 251, 245, 0.25)',
              boxShadow: `
                inset 0 0 0 2px rgba(255, 209, 102, 0.25),
                15px 15px 40px rgba(0, 0, 0, 0.4),
                0 0 20px rgba(255, 209, 102, 0.1)
              `,
              transform: 'translateZ(25px)',
              overflow: 'hidden',
            }}>
              
              {/* Enhanced Gold Embossed Border */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                bottom: '10px',
                border: '2px solid rgba(255, 209, 102, 0.5)',
                borderRadius: '6px 14px 14px 6px',
                pointerEvents: 'none',
                boxShadow: 'inset 0 0 20px rgba(255, 209, 102, 0.1)',
              }} />
              
              {/* Book Title on Spine */}
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'left center',
                color: 'rgba(255, 251, 245, 0.95)',
                fontSize: '0.85rem',
                fontWeight: '700',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                maxWidth: '270px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)',
                padding: '2px 10px 2px 5px',
              }}>
                {book.titre}
              </div>
              
              {/* Book Icon for Missing Images */}
              {!book.image && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '5rem',
                  color: 'rgba(255, 251, 245, 0.95)',
                  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
                  opacity: 0.9,
                  filter: 'drop-shadow(0 0 8px rgba(255, 209, 102, 0.3))',
                }}>
                  {bookIcon}
                </div>
              )}
              
              {/* Decorative Corner */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                width: '30px',
                height: '30px',
                borderRight: '3px solid rgba(255, 209, 102, 0.7)',
                borderBottom: '3px solid rgba(255, 209, 102, 0.7)',
                borderBottomRightRadius: '8px',
                boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
              }} />
            </div>
            
            {/* Book Spine */}
            <div style={{
              position: 'absolute',
              left: '-22px',
              top: '10px',
              bottom: '10px',
              width: '22px',
              background: `linear-gradient(135deg, 
                ${spineColor} 0%, 
                ${spineColor}40 50%, 
                ${spineColor}80 100%)`,
              borderRadius: '6px 0 0 6px',
              transform: 'rotateY(-90deg) translateX(-11px)',
              boxShadow: `
                inset -3px 0 10px rgba(0, 0, 0, 0.6),
                3px 0 6px rgba(0, 0, 0, 0.3),
                inset 0 0 10px rgba(255, 209, 102, 0.2)
              `,
              borderRight: '2px solid rgba(0, 0, 0, 0.4)',
            }}>
              {/* Spine Details */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                color: 'rgba(255, 251, 245, 0.95)',
                fontSize: '0.8rem',
                fontWeight: '800',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {book.genre}
              </div>
            </div>
            
            {/* Book Pages */}
            <div style={{
              position: 'absolute',
              left: '-20px',
              top: '12px',
              bottom: '12px',
              width: '20px',
              background: 'linear-gradient(to right, #FFFBF5, #F7F3EE, #EEE9E2, #F7F3EE)',
              transform: 'rotateY(-90deg) translateX(-10px)',
              borderRadius: '4px 0 0 4px',
              boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.3), 2px 0 3px rgba(255, 255, 255, 0.2)',
              opacity: 0.98,
            }} />
          </div>
        </div>

        {/* Enhanced Information Section */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(255, 251, 245, 0.07), rgba(255, 251, 245, 0.03))',
          borderRadius: '12px',
          border: '1px solid rgba(255, 251, 245, 0.15)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.2)',
        }}>
          
          {/* Book Title */}
          <h3 style={{
            color: '#FFFBF5',
            fontSize: '1.2rem',
            fontWeight: '700',
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            margin: '0 0 12px 0',
            textAlign: 'center',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.2em',
            letterSpacing: '0.3px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
          }}>
            {book.titre}
          </h3>

          {/* Author with Enhanced Styling */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: 'rgba(255, 251, 245, 0.85)',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(255, 209, 102, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 209, 102, 0.1)',
          }}>
            <div style={{
              color: '#FFD166',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: 'rgba(255, 209, 102, 0.1)',
              borderRadius: '50%',
              border: '1px solid rgba(255, 209, 102, 0.2)',
            }}>
              ✒
            </div>
            <span style={{
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 40px)',
              color: '#FFE5B4',
            }}>
              {book.auteur}
            </span>
          </div>

          {/* Essential Details - Professional Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}>
            
            {/* Genre Badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px',
              background: 'rgba(255, 251, 245, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 251, 245, 0.12)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                color: '#FF9B54',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: 'rgba(255, 155, 84, 0.1)',
                borderRadius: '50%',
                border: '1px solid rgba(255, 155, 84, 0.2)',
                marginBottom: '4px',
              }}>
                📖
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'rgba(255, 251, 245, 0.7)',
                marginBottom: '4px',
              }}>
                Genre
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#FFFBF5',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}>
                {book.genre}
              </span>
            </div>
            
            {/* Quantity Badge */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '12px',
              background: book.numTotalLivres > 0 
                ? 'rgba(76, 175, 80, 0.08)' 
                : 'rgba(255, 107, 107, 0.08)',
              borderRadius: '10px',
              border: book.numTotalLivres > 0 
                ? '1px solid rgba(76, 175, 80, 0.15)' 
                : '1px solid rgba(255, 107, 107, 0.15)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: book.numTotalLivres > 0 ? '#4CAF50' : '#FF6B6B',
                  animation: book.numTotalLivres > 0 ? 'pulse 2s infinite' : 'none',
                  boxShadow: book.numTotalLivres > 0 
                    ? '0 0 8px rgba(76, 175, 80, 0.5)' 
                    : '0 0 8px rgba(255, 107, 107, 0.5)',
                }} />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: book.numTotalLivres > 0 
                    ? 'rgba(76, 175, 80, 0.9)' 
                    : 'rgba(255, 107, 107, 0.9)',
                }}>
                  Disponibilité
                </span>
              </div>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: '800',
                color: book.numTotalLivres > 0 ? '#4CAF50' : '#FF6B6B',
                textShadow: book.numTotalLivres > 0 
                  ? '0 2px 8px rgba(76, 175, 80, 0.3)' 
                  : '0 2px 8px rgba(255, 107, 107, 0.3)',
              }}>
                {book.numTotalLivres}
              </span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: book.numTotalLivres > 0 
                  ? 'rgba(76, 175, 80, 0.8)' 
                  : 'rgba(255, 107, 107, 0.8)',
                letterSpacing: '0.3px',
              }}>
                {book.numTotalLivres === 1 ? 'copie' : 'copies'}
              </span>
            </div>
          </div>

          {/* Action Hint */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: 'rgba(255, 209, 102, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 209, 102, 0.15)',
            color: 'rgba(255, 209, 102, 0.8)',
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontSize: '1rem' }}>🔍</span>
            Cliquer pour explorer les détails
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default BookCard;