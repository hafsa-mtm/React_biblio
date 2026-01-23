import { useEffect, useState } from 'react';
import { LivreAPI } from '../../api/livre.api';
import { Book } from '../../types/Book';
import BookCard from '../../components/BookCard';

const Catalog = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await LivreAPI.getAll();
        const dispoBooks = data.filter((book: Book) => (book.numTotalLivres ?? 0) > 0);
        setBooks(dispoBooks);
        setFilteredBooks(dispoBooks);
        
        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(dispoBooks.map(book => book.genre).filter(Boolean))
        ) as string[];
        setGenres(uniqueGenres);
      } catch {
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(book =>
        book.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.auteur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (filterGenre !== 'all') {
      result = result.filter(book => book.genre === filterGenre);
    }
    
    setFilteredBooks(result);
  }, [searchTerm, filterGenre, books]);

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
          📚 Chargement des livres...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "'Cormorant Garamond', serif",
        color: '#FFFBF5',
        overflow: 'hidden',
        backgroundColor: '#281C16',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80)',
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

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '50px',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            maxWidth: '600px',
            width: '100%',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '25px',
              color: '#FF6B6B',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#FFFBF5',
              marginBottom: '20px',
              fontFamily: "'Playfair Display', serif",
            }}>
              Erreur de Chargement
            </h2>
            <div style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 251, 245, 0.9)',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}>
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                color: '#FFD166',
                border: '2px solid rgba(255, 209, 102, 0.3)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Cormorant Garamond', serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                e.currentTarget.style.borderColor = '#FFD166';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔄 Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "'Cormorant Garamond', serif",
        color: '#FFFBF5',
        overflow: 'hidden',
        backgroundColor: '#281C16',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80)',
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

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '50px',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'rgba(255, 251, 245, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 251, 245, 0.2)',
            maxWidth: '600px',
            width: '100%',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '25px',
              color: '#FFD166',
            }}>
              📚
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#FFFBF5',
              marginBottom: '20px',
              fontFamily: "'Playfair Display', serif",
            }}>
              Catalogue Vide
            </h2>
            <div style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 251, 245, 0.9)',
              marginBottom: '30px',
              lineHeight: 1.6,
            }}>
              Aucun livre n'est actuellement disponible dans notre catalogue.
              <br />
              Revenez bientôt pour découvrir nos nouvelles acquisitions.
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80)',
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
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '16px',
              height: '60px',
              backgroundColor: '#FFD166',
              borderRadius: '8px',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 20px rgba(255, 209, 102, 0.3)',
            }} />
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
              textTransform: 'uppercase',
              margin: 0,
            }}>
              📚 Catalogue des Livres
            </h1>
          </div>
          <p style={{
            color: 'rgba(255, 251, 245, 0.8)',
            fontSize: '1.2rem',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Explorez notre vaste collection de livres disponibles pour le prêt. 
            Chaque ouvrage est soigneusement sélectionné pour enrichir votre expérience de lecture.
          </p>
        </header>

        {/* Search and Filter Bar */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '25px',
            marginBottom: '25px',
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
                🔍 Rechercher un livre
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre, auteur ou ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  border: '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '14px',
                  color: '#FFFBF5',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD166';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                  e.target.style.boxShadow = '0 0 20px rgba(255, 209, 102, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
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
                🏷️ Filtrer par genre
              </div>
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 25px',
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  border: '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '14px',
                  color: '#FFFBF5',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FFD166' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 20px center',
                  backgroundSize: '20px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD166';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                }}
              >
                <option value="all">Tous les genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Stats and Results Info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '25px',
            borderTop: '1px solid rgba(255, 251, 245, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}>
              <div style={{
                color: '#FFD166',
                fontSize: '1.3rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <span style={{
                  fontSize: '1.8rem',
                  animation: 'pulse 2s infinite',
                }}>📖</span>
                {filteredBooks.length} Livre{filteredBooks.length !== 1 ? 's' : ''} Trouvé{filteredBooks.length !== 1 ? 's' : ''}
              </div>
              
              {(searchTerm || filterGenre !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterGenre('all');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    color: '#FF6B6B',
                    border: '2px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                    e.currentTarget.style.borderColor = '#FF6B6B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                  }}
                >
                  ✕ Effacer les filtres
                </button>
              )}
            </div>
            
            <div style={{
              color: 'rgba(255, 251, 245, 0.8)',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
              Mis à jour: {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '35px',
            marginBottom: '60px',
          }}>
            {filteredBooks.map(book => (
              <BookCard key={book.idLivre || Math.random()} book={book} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            backgroundColor: 'rgba(255, 251, 245, 0.08)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 251, 245, 0.2)',
            marginBottom: '60px',
          }}>
            <div style={{
              fontSize: '4rem',
              color: '#FF9B54',
              marginBottom: '25px',
              animation: 'pulse 2s infinite',
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              color: '#FFFBF5',
              marginBottom: '15px',
              fontFamily: "'Playfair Display', serif",
            }}>
              Aucun résultat trouvé
            </h3>
            <p style={{
              color: 'rgba(255, 251, 245, 0.8)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto 25px',
              lineHeight: 1.6,
            }}>
              Aucun livre ne correspond à vos critères de recherche.
              <br />
              Essayez avec d'autres termes ou explorez tous nos livres disponibles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGenre('all');
              }}
              style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                color: '#FFD166',
                border: '2px solid rgba(255, 209, 102, 0.3)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Cormorant Garamond', serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                e.currentTarget.style.borderColor = '#FFD166';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📚 Voir tous les livres
            </button>
          </div>
        )}

        {/* Footer */}
        <footer style={{
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
            color: 'rgba(255, 251, 245, 0.9)',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}>
            © {new Date().getFullYear()} Bibliothèque Virtuelle
          </div>
          
          <div style={{
            display: 'flex',
            gap: '30px',
            color: 'rgba(255, 251, 245, 0.8)',
            fontSize: '0.95rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>📞</span>
              +1 234 567 8900
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>✉️</span>
              contact@bibliotheque.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span>
              Paris, France
            </div>
          </div>
          
          <div style={{
            color: 'rgba(255, 251, 245, 0.7)',
            fontSize: '0.85rem',
            fontStyle: 'italic',
          }}>
            {books.length} livres dans notre collection
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
          
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          
          select::-ms-expand {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export default Catalog;