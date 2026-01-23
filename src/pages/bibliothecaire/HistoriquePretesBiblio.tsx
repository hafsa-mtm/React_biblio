import React from "react";
import { useEffect, useState } from "react";
import { PretAPI } from "../../api/pret.api";
import { Prete } from "../../types/Pret";
import { getPretStatus } from "../../utils/pretStatus";
import { Link } from "react-router-dom";

const HistoriquePretesBiblio = () => {
    const [statusFilter, setStatusFilter] = useState<
    "ALL" | "DEMANDE" | "ACTIF" | "RETARD" | "RETOURNE"
    >("ALL");

  const [pretes, setPretes] = useState<Prete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistorique = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PretAPI.getHistoriquePretesBiblio();
      setPretes(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération :", err);
      setError("Impossible de charger l'historique des prêts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorique();
  }, []);

  const filteredPretes = pretes.filter((p) => {
    // Apply status filter
    if (statusFilter !== "ALL") {
      const statusCode = getPretStatus(p).code;
      if (statusCode !== statusFilter) return false;
    }
    
    // Apply search filter
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      p.livre?.titre?.toLowerCase().includes(searchLower) ||
      p.lecteur?.nom?.toLowerCase().includes(searchLower) ||
      p.lecteur?.prenom?.toLowerCase().includes(searchLower) ||
      p.idPret?.toString().includes(searchLower)
    );
  });

  // Get status color for filter display
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DEMANDE": return '#FFD166'; // Yellow
      case "ACTIF": return '#4CAF50'; // Green
      case "RETARD": return '#FF6B6B'; // Red
      case "RETOURNE": return '#2196F3'; // Blue
      default: return '#9C5149'; // Brown
    }
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
          Chargement de l'historique...
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
              onClick={fetchHistorique}
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
              to="/biblio"
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
              Historique des Prêts
            </div>
          </div>
        </header>

        {/* Filters and Search */}
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
                placeholder="Rechercher par livre, lecteur ou ID..."
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
                📊 Filtrer par Statut
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  border: `2px solid ${getStatusColor(statusFilter)}40`,
                  borderRadius: '12px',
                  color: '#FFFBF5',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = getStatusColor(statusFilter);
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${getStatusColor(statusFilter)}40`;
                  e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                }}
              >
                <option value="ALL">Tous les statuts</option>
                <option value="DEMANDE">Demandes</option>
                <option value="ACTIF">Actifs</option>
                <option value="RETARD">En retard</option>
                <option value="RETOURNE">Retournés</option>
              </select>
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
              {pretes.length === 0 
                ? "Aucun prêt dans l'historique" 
                : `Affichage : ${filteredPretes.length} sur ${pretes.length} prêts`}
            </div>
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
            }}>
              <button
                onClick={fetchHistorique}
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
        </div>

        {/* Historique Table */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          overflow: 'auto',
        }}>
          {pretes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '1.3rem',
              fontStyle: 'italic',
            }}>
              L'historique des prêts est vide
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
                  }}>Livre</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Lecteur</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Début</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Fin</th>
                  <th style={{
                    padding: '20px',
                    textAlign: 'left',
                    color: 'rgba(255, 251, 245, 0.9)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                  }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredPretes.map((p) => {
                  const status = getPretStatus(p);
                  return (
                    <tr
                      key={p.idPret}
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
                          #{p.idPret}
                        </span>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{
                          color: '#FFFBF5',
                          fontWeight: 600,
                          fontSize: '1.2rem',
                        }}>
                          {p.livre?.titre || "Titre non disponible"}
                        </div>
                      </td>
                      <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                        }}>
                          <span style={{ fontWeight: 600, color: '#FFFBF5' }}>
                            {p.lecteur?.nom} {p.lecteur?.prenom}
                          </span>
                          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            {p.lecteur?.email}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                        {new Date(p.datePret || "").toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                        {new Date(p.dateFinPret || "").toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '20px' }}>
                        <span style={{
                          padding: '10px 20px',
                          backgroundColor: `${status.color}20`,
                          color: status.color,
                          borderRadius: '25px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          display: 'inline-block',
                          border: `2px solid ${status.color}40`,
                          minWidth: '120px',
                          textAlign: 'center',
                        }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {searchTerm && filteredPretes.length === 0 && pretes.length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '1.2rem',
              fontStyle: 'italic',
            }}>
              Aucun prêt trouvé pour "{searchTerm}" avec le statut "{statusFilter}"
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

export default HistoriquePretesBiblio;