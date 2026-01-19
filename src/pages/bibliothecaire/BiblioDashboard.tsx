import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bibliothecaireAPI, DashboardData } from '../../api/bibliothecaire.api';
import StatCard from '../../components/StatsCard';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';

const BiblioDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousData, setPreviousData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (dashboardData) {
        setPreviousData(dashboardData);
      }
      const data = await bibliothecaireAPI.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const defaultData = await bibliothecaireAPI.getDashboardData();
      setDashboardData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le pourcentage de changement
  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return { value: '0%', type: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    const absChange = Math.abs(Math.round(change));
    
    return {
      value: `${change > 0 ? '+' : ''}${absChange}%`,
      type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
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
    label: item.status,
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
              onClick={() => navigate('/profile')}
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
              👤 Profil
            </button>
          </div>
        </header>

        {/* Stats Grid - MODIFIÉ (gardé seulement les 8 statistiques principales) */}
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
            title="Réservés"
            value={stats?.reservedBooks || 0}
            icon="🔖"
            color="#9C5149"
            change={calculateChange(stats?.reservedBooks || 0, previousStats?.reservedBooks).value}
            changeType={calculateChange(stats?.reservedBooks || 0, previousStats?.reservedBooks).type}
            description="Livres en attente"
          />
          
          <StatCard
            title="En attente"
            value={stats?.pendingReturns || 0}
            icon="⏳"
            color="#FFD166"
            change={calculateChange(stats?.pendingReturns || 0, previousStats?.pendingReturns).value}
            changeType={calculateChange(stats?.pendingReturns || 0, previousStats?.pendingReturns).type}
            description="Retours à traiter"
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
            title="Lecteurs Actifs"
            value={stats?.activeReaders || 0}
            icon="👥"
            color="#2196F3"
            change={calculateChange(stats?.activeReaders || 0, previousStats?.activeReaders).value}
            changeType={calculateChange(stats?.activeReaders || 0, previousStats?.activeReaders).type}
            description="Membres actifs"
          />
          <StatCard
            title="Total Genres"
            value={booksByGenre.length}
            icon="🏷️"
            color="#9C27B0"
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
              { label: 'À temps', value: (stats?.borrowedBooks || 0) - (stats?.lateReturns || 0), color: '#4CAF50' },
              { label: 'En retard', value: stats?.lateReturns || 0, color: '#FF6B6B' }
            ]}
            title="Retours des Livres"
            size={280}
            showLegend={true}
            showPercentages={true}
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
                  label: 'Gérer les Emprunts', 
                  icon: '📖', 
                  color: '#FF9B54', 
                  action: () => navigate('/biblio/prets'),
                  description: `${stats?.borrowedBooks || 0} emprunts actifs`
                },
                { 
                  label: 'Gérer les Lecteurs', 
                  icon: '👥', 
                  color: '#2196F3', 
                  action: () => navigate('/biblio/lecteurs'),
                  description: 'Voir tous les membres'
                },
                { 
                  label: 'Traiter les Retours', 
                  icon: '🔄', 
                  color: '#9C5149', 
                  action: () => navigate('/biblio/retours'),
                  description: `${stats?.pendingReturns || 0} retours à traiter`
                },
                { 
                  label: 'Supprimer Livre', 
                  icon: '🗑️', 
                  color: '#FF6B6B', 
                  action: () => navigate('/biblio/livres'),
                  description: 'Supprimer un ouvrage'
                },
                { 
                  label: 'Analytiques', 
                  icon: '📊', 
                  color: '#4CAF50', 
                  action: () => navigate('/biblio/analytiques'),
                  description: 'Voir les statistiques détaillées'
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

          {/* Reports Panel */}
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
              📊 Rapports
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginBottom: '25px',
            }}>
              <button
                onClick={() => bibliothecaireAPI.generateMonthlyReport()}
                style={{
                  padding: '18px',
                  backgroundColor: 'rgba(255, 209, 102, 0.1)',
                  color: '#FFD166',
                  border: '2px solid rgba(255, 209, 102, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                  e.currentTarget.style.borderColor = '#FFD166';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📈</span>
                Générer Rapport Mensuel
              </button>
              
              <button
                onClick={async () => {
                  try {
                    const blob = await bibliothecaireAPI.exportLoansToCSV();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prets_${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Erreur lors de l\'export CSV:', error);
                  }
                }}
                style={{
                  padding: '18px',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: '#4CAF50',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                  e.currentTarget.style.borderColor = '#4CAF50';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.3)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📥</span>
                Exporter Emprunts CSV
              </button>
              
              <button
                onClick={async () => {
                  try {
                    const blob = await bibliothecaireAPI.exportBooksToCSV();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `catalogue_${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Erreur lors de l\'export du catalogue:', error);
                  }
                }}
                style={{
                  padding: '18px',
                  backgroundColor: 'rgba(156, 81, 73, 0.1)',
                  color: '#9C5149',
                  border: '2px solid rgba(156, 81, 73, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(156, 81, 73, 0.2)';
                  e.currentTarget.style.borderColor = '#9C5149';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(156, 81, 73, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(156, 81, 73, 0.3)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                Exporter Catalogue
              </button>
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
              <span>{stats?.borrowedBooks || 0} Emprunts actifs</span>
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

const getGenreIcon = (genre: string) => {
  const genreIcons: Record<string, string> = {
    'Roman': '📖',
    'Science-Fiction': '🚀',
    'Fantastique': '🐉',
    'Historique': '🏛️',
    'Policier': '🔍',
    'Biographie': '👤',
    'Poésie': '✍️',
  };
  return genreIcons[genre] || '📚';
};

const getColorForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'disponible':
    case 'available':
      return '#4CAF50';
    case 'emprunté':
    case 'borrowed':
      return '#FF9B54';
    case 'réservé':
    case 'reserved':
      return '#FFD166';
    case 'en réparation':
    case 'maintenance':
      return '#FF6B6B';
    default:
      return '#2196F3';
  }
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