import { useEffect, useState, useCallback  } from "react";
import { PretAPI } from "../../api/pret.api";
import { Prete } from "../../types/Pret";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";

const MesDemandes = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState<Prete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDemandes = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    if (!user) return;

    const data = await PretAPI.getDemandesLecteur();
    setDemandes(data);
  } catch (err: any) {
    console.error("Erreur lors de la récupération :", err);
    setError("Impossible de charger vos demandes");
  } finally {
    setLoading(false);
  }
}, [user]);


  useEffect(() => {
    fetchDemandes();
  }, [user, fetchDemandes]);

  const annuler = async (idPret?: number) => {
    if (!idPret) return;

    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
      return;
    }

    try {
      await PretAPI.annulerDemande(idPret);
      setDemandes(prev =>
        prev.filter(d => String(d.idPret) !== String(idPret))
      );
    } catch (err: any) {
      setError(err.message || "Impossible d'annuler la demande");
    }
  };

  // Filter demandes based on search
  const filteredDemandes = demandes.filter((d) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      d.livre?.titre?.toLowerCase().includes(searchLower) ||
      d.idPret?.toString().includes(searchLower)
    );
  });

  // Get status color
  const getStatusColor = (demande: boolean) => {
    return demande ? '#FFD166' : '#4CAF50'; // Yellow for pending, Green for processed
  };

  // Loading state
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
          Chargement de vos demandes...
        </div>
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
          `}
        </style>
      </div>
    );
  }

  // Error state
  if (error) {
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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
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

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            backgroundColor: 'rgba(248, 215, 218, 0.2)',
            color: '#FFFBF5',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '20px',
            border: '2px solid rgba(245, 198, 203, 0.3)',
            backdropFilter: 'blur(15px)',
          }}>
            <h3 style={{ marginTop: 0, color: '#FF6B6B', fontSize: '1.5rem' }}>Erreur</h3>
            <p style={{ marginBottom: '20px' }}>{error}</p>
            <button
              onClick={fetchDemandes}
              style={{
                backgroundColor: 'rgba(255, 209, 102, 0.2)',
                color: '#FFD166',
                padding: '12px 24px',
                border: '2px solid rgba(255, 209, 102, 0.4)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Cormorant Garamond', serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.3)';
                e.currentTarget.style.borderColor = '#FFD166';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.4)';
              }}
            >
              Réessayer
            </button>
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
      padding: '70px 50px',
    }}>
      
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
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

      <div style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <Link
              to="/lecteur"
              style={{
                fontSize: '1.5rem',
                color: '#FFFBF5',
                textDecoration: 'none',
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 251, 245, 0.1)',
                borderRadius: '10px',
                border: '2px solid rgba(255, 251, 245, 0.2)',
                transition: 'all 0.3s ease',
                fontFamily: "'Cormorant Garamond', serif",
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
              ← Retour
            </Link>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
            }}>
              Mes Demandes de Prêt
            </div>
          </div>
        </header>

        {/* Search and Stats */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          marginBottom: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '25px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 251, 245, 0.9)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                🔍 Rechercher
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre du livre ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  border: '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '12px',
                  color: '#FFFBF5',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FFD166';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                }}
              />
            </div>
            
            <div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 251, 245, 0.9)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                📊 Statistiques
              </div>
              <div style={{
                padding: '15px 20px',
                backgroundColor: 'rgba(255, 251, 245, 0.1)',
                border: '2px solid rgba(255, 251, 245, 0.3)',
                borderRadius: '12px',
                color: '#FFD166',
                fontSize: '1.1rem',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {filteredDemandes.length} demande(s)
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '30px',
            paddingTop: '25px',
            borderTop: '2px solid rgba(255, 251, 245, 0.1)',
          }}>
            <div style={{
              color: '#FFD166',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}>
              {demandes.length === 0 
                ? "Aucune demande de prêt" 
                : `Affichage : ${filteredDemandes.length} sur ${demandes.length} demandes`}
            </div>
            <button
              onClick={fetchDemandes}
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
              🔄 Actualiser
            </button>
          </div>
        </div>

        {/* Demandes Table */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          overflow: 'auto',
        }}>
          {demandes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '1.3rem',
              fontStyle: 'italic',
            }}>
              Vous n'avez aucune demande de prêt pour le moment
            </div>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
            }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>
                    ID
                  </th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Titre du livre</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Date de la demande</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Statut</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDemandes.map((d) => {
                  const statusColor = getStatusColor(d.demande || false);
                  return (
                    <tr
                      key={d.idPret}
                      style={{
                        borderBottom: '1px solid rgba(255, 251, 245, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                        <span style={{
                          padding: '8px 16px',
                          backgroundColor: 'rgba(156, 81, 73, 0.2)',
                          color: '#FFD166',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          border: '2px solid rgba(156, 81, 73, 0.4)',
                        }}>
                          #{d.idPret}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{
                          color: '#FFFBF5',
                          fontWeight: 600,
                          fontSize: '1.2rem',
                        }}>
                          {d.livre?.titre || "Titre non disponible"}
                        </div>
                      </td>
                      <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                        {d.datePret ? new Date(d.datePret).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "—"}
                      </td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          padding: '10px 20px',
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          borderRadius: '25px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          border: `2px solid ${statusColor}40`,
                          minWidth: '120px',
                          textAlign: 'center',
                        }}>
                          {d.demande ? "En attente" : "Traitée"}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        {d.demande && (
                          <button
                            onClick={() => annuler(d.idPret)}
                            style={{
                              padding: '10px 24px',
                              backgroundColor: 'rgba(255, 107, 107, 0.1)',
                              color: '#FF6B6B',
                              border: '2px solid rgba(255, 107, 107, 0.3)',
                              borderRadius: '10px',
                              fontSize: '1rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                              e.currentTarget.style.borderColor = '#FF6B6B';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            ✗ Annuler
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {searchTerm && filteredDemandes.length === 0 && demandes.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '1.2rem',
              fontStyle: 'italic',
            }}>
              Aucune demande trouvée pour "{searchTerm}"
            </div>
          )}
        </div>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            color: '#FF6B6B',
            borderRadius: '12px',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            backdropFilter: 'blur(15px)',
          }}>
            {error}
          </div>
        )}
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
        `}
      </style>
    </div>
  );
};

export default MesDemandes;