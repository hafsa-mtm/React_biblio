import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bibliothecaireAPI, DashboardData } from '../../api/bibliothecaire.api';
import StatCard from '../../components/StatsCard';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import { useAuth } from '../../auth/AuthContext';


const BiblioDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousData, setPreviousData] = useState<DashboardData | null>(null);

  const { logout } = useAuth();
const handleLogout = () => {
  logout();               // Supprime le user et les tokens
  navigate('/login');     // Redirige vers la page de login
};

  const fetchDashboardData = useCallback(async () => {
    try {
      if (dashboardData) {
        setPreviousData(dashboardData);
      }
      const data = await bibliothecaireAPI.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [dashboardData]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Calculer le pourcentage de changement
  type ChangeType = 'neutral' | 'positive' | 'negative';

  const calculateChange = (
    current: number,
    previous: number | undefined
  ): { value: string; type: ChangeType } => {
    if (!previous || previous === 0) {
      return { value: '0%', type: 'neutral' };
    }

    const change = ((current - previous) / previous) * 100;
    const absChange = Math.abs(Math.round(change));

    return {
      value: `${change > 0 ? '+' : ''}${absChange}%`,
      type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
    };
  };

  // Gérer le rafraîchissement
  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardData();
  };

  // Données à afficher
  const stats = dashboardData?.stats;
  const booksStatus = dashboardData?.booksStatus || [];
  const recentActivity = dashboardData?.stats?.recentActivity || [];
  const booksByGenre = dashboardData?.stats?.booksByGenre || [];
  const previousStats = previousData?.stats;

  // Préparer les données pour les graphiques
  const pieData = booksStatus.map(item => ({
    label: normalizeStatus(item.status),
    value: item.count,
    color: getColorForStatus(item.status)
  }));

  const genreData = booksByGenre.slice(0, 6).map(item => ({
    label: item.genre,
    value: item.count,
    color: getColorForGenre(item.genre)
  }));

  if (loading && !dashboardData) {
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
          Chargement du tableau de bord...
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
              Tableau de bord Bibliothèque
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '0.9rem',
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
              Mis à jour à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            
            <button
              onClick={handleRefresh}
              style={{
                color: '#FFD166',
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
              }}
            >
              {loading ? '🔄' : '🔁'} {loading ? 'Rafraîchissement...' : 'Rafraîchir'}
            </button>
            
            <button
  onClick={handleLogout}
  style={{
    color: '#FF6B6B',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: '12px 25px',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderRadius: '10px',
    border: '2px solid rgba(255, 107, 107, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Cormorant Garamond', serif",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.12)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  🚪 Logout
</button>
          </div>
        </header>

        {/* Stats Grid - MODIFIÉ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '25px',
          marginBottom: '40px',
        }}>
          <StatCard
            title="Livres Totaux"
            value={stats?.totalBooks || 0}
            icon="📚"
            color="#FFD166"
            change={calculateChange(stats?.totalBooks || 0, previousStats?.totalBooks).value}
            changeType={calculateChange(stats?.totalBooks || 0, previousStats?.totalBooks).type}
            description="Collection totale"
          />
          <StatCard
            title="Disponibles"
            value={stats?.availableBooks || 0}
            icon="✅"
            color="#4CAF50"
            change={calculateChange(stats?.availableBooks || 0, previousStats?.availableBooks).value}
            changeType={calculateChange(stats?.availableBooks || 0, previousStats?.availableBooks).type}
            description="Prêts à être empruntés"
          />
          <StatCard
            title="Empruntés"
            value={stats?.borrowedBooks || 0}
            icon="📖"
            color="#FF9B54"
            change={calculateChange(stats?.borrowedBooks || 0, previousStats?.borrowedBooks).value}
            changeType={calculateChange(stats?.borrowedBooks || 0, previousStats?.borrowedBooks).type}
            description="Actuellement empruntés"
          />
          <StatCard
            title="Demandés"
            value={stats?.pendingRequests || 0}
            icon="📋"
            color="#FFD166"
            change={calculateChange(stats?.pendingRequests || 0, previousStats?.pendingRequests).value}
            changeType={calculateChange(stats?.pendingRequests || 0, previousStats?.pendingRequests).type}
            description="Demandes en attente"
          />
          
          <StatCard
            title="Retournés"
            value={stats?.returnedBooks || 0}
            icon="✅"
            color="#4CAF50"
            change={calculateChange(stats?.returnedBooks || 0, previousStats?.returnedBooks).value}
            changeType={calculateChange(stats?.returnedBooks || 0, previousStats?.returnedBooks).type}
            description="Livres retournés"
          />
          
          <StatCard
            title="Retards"
            value={stats?.lateReturns || 0}
            icon="⏰"
            color="#FF6B6B"
            change={calculateChange(stats?.lateReturns || 0, previousStats?.lateReturns).value}
            changeType={calculateChange(stats?.lateReturns || 0, previousStats?.lateReturns).type}
            description="Retours en retard"
          />
          
          <StatCard
            title="Total Prêts"
            value={stats?.totalPrets || 0}
            icon="📜"
            color="#9C27B0"
            change={calculateChange(stats?.totalPrets || 0, previousStats?.totalPrets).value}
            changeType={calculateChange(stats?.totalPrets || 0, previousStats?.totalPrets).type}
            description="Tous les prêts"
          />
          
          <StatCard
            title="Total Genres"
            value={booksByGenre.length}
            icon="🏷️"
            color="#FF9800"
            change=""
            changeType="neutral"
            description="Catégories différentes"
          />
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px',
          marginBottom: '40px',
        }}>
          <PieChart
            data={pieData}
            title="Statut des Livres"
            size={280}
            showLegend={true}
            showPercentages={true}
            totalLabel="Livres"
          />
          <BarChart
            data={genreData}
            title="Livres par Genre"
            height={350}
            showValues={true}
            animate={true}
          />
          <PieChart
            data={[
              { 
                label: 'Retournés', 
                value: stats?.returnedBooks || 0, 
                color: '#4CAF50'
              },
              { 
                label: 'Emprunts en cours', 
                value: stats?.borrowedBooks || 0, 
                color: '#FF9B54'
              }
            ]}
            title="Retours des Livres"
            size={280}
            showLegend={true}
            showPercentages={true}
            totalLabel="Prêts"
          />
        </div>

        {/* Quick Actions & Reports */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '25px',
          marginBottom: '40px',
        }}>
          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'rgba(255, 251, 245, 0.08)',
            backdropFilter: 'blur(15px)',
            borderRadius: '18px',
            padding: '30px',
            border: '2px solid rgba(255, 251, 245, 0.2)',
          }}>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#FFFBF5',
              marginBottom: '25px',
              fontFamily: "'Playfair Display', serif",
            }}>
              ⚡ Actions Rapides
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}>
              {[
                { 
                  label: 'Gérer les Livres', 
                  icon: '📚', 
                  color: '#FFD166', 
                  action: () => navigate('/biblio/livres'),
                  description: `${stats?.totalBooks || 0} livres au catalogue`
                },
                { 
                  label: 'Gérer les Demandes', 
                  icon: '📋', 
                  color: '#FFD166', 
                  action: () => navigate('/biblio/demandes'),
                  description: `${stats?.pendingRequests || 0} demandes à traiter`
                },
                { 
                  label: 'Gérer Prêts Actifs', 
                  icon: '📖', 
                  color: '#FF9B54', 
                  action: () => navigate('/biblio/pretes-actifs'),
                  description: `${stats?.borrowedBooks || 0} emprunts actifs`
                },
                { 
                  label: 'Historique des Prêts', 
                  icon: '📜', 
                  color: '#9C27B0', 
                  action: () => navigate('/biblio/historique-pretes'),
                  description: `${stats?.totalPrets || 0} prêts au total`
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.1)',
                    borderRadius: '12px',
                    border: `2px solid ${action.color}40`,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.backgroundColor = `${action.color}20`;
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.boxShadow = `0 10px 30px ${action.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    e.currentTarget.style.borderColor = `${action.color}40`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '2rem',
                    color: action.color,
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <div style={{
                      color: '#FFFBF5',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      marginBottom: '5px',
                    }}>
                      {action.label}
                    </div>
                    <div style={{
                      color: 'rgba(255, 251, 245, 0.7)',
                      fontSize: '0.85rem',
                    }}>
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}>
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
            }}>
              🔔 Activités Récentes
            </h3>
            <button
              onClick={() => navigate('/biblio/prets')}
              style={{
                color: '#FFD166',
                background: 'none',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Voir Toutes les Activités
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
          }}>
            {recentActivity.slice(0, 8).map((activity: any, index: number) => (
              <div
                key={activity.id || index}
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(255, 251, 245, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 251, 245, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '10px',
                }}>
                  <div style={{
                    fontSize: '1.8rem',
                    color: '#FFD166',
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div style={{
                      color: '#FFFBF5',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}>
                      {activity.user}
                    </div>
                    <div style={{
                      color: 'rgba(255, 251, 245, 0.7)',
                      fontSize: '0.9rem',
                    }}>
                      {formatTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
                <div style={{
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontSize: '0.95rem',
                  paddingLeft: '50px',
                }}>
                  {activity.description}
                </div>
              </div>
            ))}
            
            {recentActivity.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 251, 245, 0.5)',
                fontStyle: 'italic',
              }}>
                Aucune activité récente
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          padding: '25px',
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          color: 'rgba(255, 251, 245, 0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: loading ? '#FFD166' : '#4CAF50',
                borderRadius: '50%',
                animation: loading ? 'pulse 1s infinite' : 'none',
              }} />
              {loading ? 'Mise à jour en cours...' : 'Tableau de bord actif'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 15px',
              backgroundColor: 'rgba(255, 209, 102, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 209, 102, 0.2)',
            }}>
              <span style={{ color: '#FFD166' }}>📚</span>
              <span>{stats?.totalBooks || 0} Livres</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 15px',
              backgroundColor: 'rgba(255, 155, 84, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 155, 84, 0.2)',
            }}>
              <span style={{ color: '#FF9B54' }}>📖</span>
              <span>{stats?.borrowedBooks || 0} Emprunts</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 15px',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}>
              <span style={{ color: '#4CAF50' }}>✅</span>
              <span>{stats?.returnedBooks || 0} Retournés</span>
            </div>
          </div>
          <div>
            Dernière mise à jour: {stats?.lastUpdated ? 
              new Date(stats.lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 
              new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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

// Fonctions utilitaires ajoutées
const getColorForGenre = (genre: string) => {
  const genreColors: Record<string, string> = {
    'Roman': '#FFD166',
    'Science-Fiction': '#FF9B54',
    'Fantastique': '#9C5149',
    'Historique': '#4CAF50',
    'Policier': '#2196F3',
    'Biographie': '#FF6B6B',
    'Poésie': '#9C27B0',
  };
  return genreColors[genre] || '#8884d8';
};

const getColorForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return '#4CAF50';
    case 'emprunté':
    case 'borrowed':
    case 'emprunte':
      return '#FF9B54';
    case 'demandé':
    case 'réservé':
    case 'reserved':
    case 'reserve':
      return '#FFD166';
    case 'en retard':
    case 'en réparation':
    case 'en reparation':
    case 'maintenance':
      return '#FF6B6B';
    default:
      return '#2196F3';
  }
};

const normalizeStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'disponible': 'Disponible',
    'available': 'Disponible',
    'emprunté': 'Emprunté',
    'emprunte': 'Emprunté',
    'borrowed': 'Emprunté',
    'demandé': 'Demandé',
    'réservé': 'Demandé',
    'reserve': 'Demandé',
    'reserved': 'Demandé',
    'en retard': 'En retard',
    'en réparation': 'En retard',
    'en reparation': 'En retard',
    'maintenance': 'En retard'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'borrow': return '📚';
    case 'return': return '✅';
    case 'reserve': return '🔖';
    case 'add': return '➕';
    case 'update': return '✏️';
    case 'renew': return '🔄';
    case 'late': return '⏰';
    case 'register': return '👤';
    case 'delete': return '🗑️';
    default: return '📝';
  }
};

const formatTime = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('fr-FR');
};

export default BiblioDashboard;