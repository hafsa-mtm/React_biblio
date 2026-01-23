import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecommendAPI } from "../../api/recommend.api";

interface Livre {
  idLivre: number;
  titre: string;
  auteur: string;
  genre: string;
  synopsis: string;
  numChapters?: number;
  numPages?: number;
  numTotalLivres?: number;
  isbn?: string;
  image?: string; // base64 ou url
}

const LecteurDashboard = () => {
  const navigate = useNavigate(); // <-- pour redirection logout
  const [recommendations, setRecommendations] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const recs = await RecommendAPI.getRecommendations();
      setRecommendations(recs);
    } catch (err) {
      console.error("Erreur lors de la récupération des recommandations:", err);
      setError("Impossible de charger les recommandations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Fonction logout
  const handleLogout = () => {
    // Exemple : supprimer token
    localStorage.removeItem("token");
    navigate("/login"); // redirige vers login
  };

  // Get genre color
  const getGenreColor = (genre: string) => {
    const genreColors: Record<string, string> = {
      'Roman': '#FF6B6B',
      'Science-fiction': '#4CAF50',
      'Fantasy': '#9C27B0',
      'Mystère': '#FF9800',
      'Historique': '#795548',
      'Biographie': '#2196F3',
      'Poésie': '#FFD166',
      'Théâtre': '#607D8B',
      'Essai': '#009688',
      'Jeunesse': '#FF4081',
    };
    return genreColors[genre] || '#9C5149';
  };

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
          Chargement de votre dashboard...
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
  }

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
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.8)',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
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
        }}>
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '2px',
            color: '#FFFBF5',
            fontFamily: "'Playfair Display', serif",
          }}>
            Bienvenue, Cher Lecteur
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 251, 245, 0.8)',
              fontStyle: 'italic',
            }}>
              Votre bibliothèque personnelle
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#FF6B6B',
                color: '#FFF',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF4C4C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6B6B';
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Message */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          marginBottom: '40px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#FFD166',
            marginBottom: '15px',
            fontWeight: 600,
          }}>
            📖 Explorez, Empruntez, Lisez
          </div>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 251, 245, 0.9)',
            lineHeight: 1.6,
            marginBottom: '25px',
          }}>
            Découvrez des milliers de livres, suivez vos prêts en cours, et recevez 
            des recommandations personnalisées basées sur vos préférences de lecture.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}>
            <div style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(156, 81, 73, 0.2)',
              color: '#FFD166',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 600,
              border: '2px solid rgba(156, 81, 73, 0.4)',
            }}>
              {recommendations.length} recommandations personnalisées
            </div>
            
            {error && (
              <button
                onClick={fetchRecommendations}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  color: '#FF6B6B',
                  border: '2px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Cormorant Garamond', serif",
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
                Recharger
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginBottom: '50px',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#FFFBF5',
            marginBottom: '25px',
            fontFamily: "'Playfair Display', serif",
          }}>
            ⚡ Accès Rapide
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '25px',
          }}>
            <Link
              to="/catalog"
              style={{
                padding: '25px',
                backgroundColor: 'rgba(156, 81, 73, 0.1)',
                borderRadius: '18px',
                border: '2px solid rgba(156, 81, 73, 0.3)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(156, 81, 73, 0.2)';
                e.currentTarget.style.borderColor = '#9C5149';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(156, 81, 73, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(156, 81, 73, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(156, 81, 73, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                color: '#FFD166',
              }}>
                📚
              </div>
              <div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#FFFBF5',
                  marginBottom: '5px',
                }}>
                  Explorer le Catalogue
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 251, 245, 0.7)',
                }}>
                  Découvrez tous les livres disponibles
                </div>
              </div>
            </Link>

            <Link
              to="/lecteur/mes-demandes"
              style={{
                padding: '25px',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '18px',
                border: '2px solid rgba(76, 175, 80, 0.3)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                e.currentTarget.style.borderColor = '#4CAF50';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                color: '#FFD166',
              }}>
                📝
              </div>
              <div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#FFFBF5',
                  marginBottom: '5px',
                }}>
                  Mes Demandes
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 251, 245, 0.7)',
                }}>
                  Suivez vos demandes de prêt
                </div>
              </div>
            </Link>

            <Link
              to="/lecteur/mes-prets"
              style={{
                padding: '25px',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderRadius: '18px',
                border: '2px solid rgba(33, 150, 243, 0.3)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.2)';
                e.currentTarget.style.borderColor = '#2196F3';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                color: '#FFD166',
              }}>
                📖
              </div>
              <div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#FFFBF5',
                  marginBottom: '5px',
                }}>
                  Mes Prêts
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 251, 245, 0.7)',
                }}>
                  Consultez vos prêts en cours
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommendations Section */}
        <div style={{
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
            }}>
              📌 Recommandations Personnalisées
            </div>
            <div style={{
              color: '#FFD166',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}>
              {recommendations.length} livre(s) suggéré(s)
            </div>
          </div>

          {error ? (
            <div style={{
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              color: '#FF6B6B',
              padding: '30px',
              borderRadius: '18px',
              textAlign: 'center',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              backdropFilter: 'blur(15px)',
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '15px',
              }}>
                ⚠️ Erreur
              </div>
              <p style={{ marginBottom: '20px' }}>{error}</p>
              <button
                onClick={fetchRecommendations}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 209, 102, 0.1)',
                  color: '#FFD166',
                  border: '2px solid rgba(255, 209, 102, 0.3)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Cormorant Garamond', serif",
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
                Réessayer
              </button>
            </div>
          ) : recommendations.length === 0 ? (
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.08)',
              color: 'rgba(255, 251, 245, 0.7)',
              padding: '50px 30px',
              borderRadius: '18px',
              textAlign: 'center',
              border: '2px solid rgba(255, 251, 245, 0.2)',
              backdropFilter: 'blur(15px)',
              fontSize: '1.2rem',
              fontStyle: 'italic',
            }}>
              Aucune recommandation disponible pour le moment.
              <br />
              Continuez à lire pour recevoir des suggestions personnalisées !
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '30px',
            }}>
              {recommendations.map((book) => {
                const genreColor = getGenreColor(book.genre);
                return (
                  <Link
                    key={book.idLivre}
                    to={`/livres/${book.idLivre}`}
                    style={{
                      backgroundColor: 'rgba(255, 251, 245, 0.08)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      border: '2px solid rgba(255, 251, 245, 0.2)',
                      backdropFilter: 'blur(15px)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = genreColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                    }}
                  >
                    {book.image ? (
                      <div style={{
                        width: '100%',
                        height: '250px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}>
                        <img
                          src={book.image}
                          alt={book.titre}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Changé de 'cover' à 'contain' pour voir toute l'image
                            backgroundColor: 'rgba(40, 28, 22, 0.3)', // Fond pour les images avec transparence
                            padding: '10px',
                          }}
                          onError={(e) => {
                            // Fallback si l'image ne se charge pas
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div style="
                                width: 100%;
                                height: 100%;
                                background: linear-gradient(135deg, rgba(156, 81, 73, 0.3), rgba(40, 28, 22, 0.5));
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: rgba(255, 251, 245, 0.7);
                                font-size: 3rem;
                              ">
                                📚
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '250px',
                        background: 'linear-gradient(135deg, rgba(156, 81, 73, 0.3), rgba(40, 28, 22, 0.5))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 251, 245, 0.7)',
                        fontSize: '4rem',
                      }}>
                        📚
                      </div>
                    )}
                    
                    <div style={{
                      padding: '25px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '220px', // Hauteur minimale pour uniformiser
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '15px',
                        gap: '10px',
                      }}>
                        <h3 style={{
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          color: '#FFFBF5',
                          margin: 0,
                          flex: 1,
                          lineHeight: 1.3,
                          minHeight: '3.6em', // Hauteur fixe pour 2 lignes
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {book.titre}
                        </h3>
                        <span style={{
                          padding: '6px 12px',
                          backgroundColor: `${genreColor}20`,
                          color: genreColor,
                          borderRadius: '15px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          border: `1px solid ${genreColor}40`,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          height: 'fit-content',
                        }}>
                          {book.genre}
                        </span>
                      </div>
                      
                      <div style={{
                        marginTop: 'auto',
                        paddingTop: '15px',
                        borderTop: '1px solid rgba(255, 251, 245, 0.1)',
                      }}>
                        <div style={{
                          color: '#FFD166',
                          fontSize: '1rem',
                          fontWeight: 600,
                          marginBottom: '5px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {book.auteur}
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          {book.numPages && (
                            <div style={{
                              color: 'rgba(255, 251, 245, 0.7)',
                              fontSize: '0.9rem',
                            }}>
                              📄 {book.numPages} pages
                            </div>
                          )}
                          {book.numChapters && (
                            <div style={{
                              color: 'rgba(255, 251, 245, 0.7)',
                              fontSize: '0.9rem',
                            }}>
                              📖 {book.numChapters} chapitres
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
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
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 251, 245, 0.1);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #FFD166, #FF9B54);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #FF9B54, #FF6B6B);
          }
          
          /* Styles pour les images responsives */
          img {
            max-width: 100%;
            max-height: 100%;
            transition: transform 0.3s ease;
          }
          
          img:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default LecteurDashboard;