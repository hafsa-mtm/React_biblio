// AdminDashboard.tsx - Version finale optimisée
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminAPI, AdminStats } from '../../api/admin.api';
import StatCard from '../../components/StatsCard';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import { useAuth } from '../../auth/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const { logout } = useAuth();

const handleLogout = () => {
  logout();               // Supprime le user et les tokens
  navigate('/login');     // Redirige vers la page de login
};
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques dynamiques
      const statsData = await AdminAPI.getDashboardStats();
      setStats(statsData);
      
      // Générer les activités récentes
      await generateRecentActivities();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(getFallbackStats());
      setRecentActivities(getFallbackActivities());
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = async () => {
    try {
      const allUsers = await AdminAPI.getAllUsers();
     const recentUsers = allUsers
        .filter(user => user.created_at) // filtrer les undefined
        .sort(
          (a, b) => 
            new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        )
        .slice(0, 6);

      
      const userActivities = recentUsers.map(user => ({
  user: `${user.prenom} ${user.nom}`,
  action: `Nouvelle inscription ${getRoleLabel(user.role)}`,
  time: user.created_at ? getTimeAgo(new Date(user.created_at)) : 'Date inconnue',
  icon: getRoleIcon(user.role),
  color: getRoleColor(user.role)
}));

      
      const systemActivities = [
        {
          user: 'Système',
          action: 'Export CSV complété',
          time: '1 heure',
          icon: '📊',
          color: '#4CAF50'
        },
        {
          user: 'Admin',
          action: 'Rapport utilisateurs généré',
          time: '3 heures',
          icon: '📈',
          color: '#FFD166'
        }
      ];
      
      setRecentActivities([...userActivities, ...systemActivities]);
    } catch (error) {
      console.error('Error generating activities:', error);
    }
  };

  // Fonctions utilitaires
  const getRoleLabel = (role: string) => {
    const roleMap = {
      'ADMIN': 'Admin',
      'BIBLIOTHECAIRE': 'Bibliothécaire',
      'LECTEUR': 'Lecteur'
    };
    return roleMap[role as keyof typeof roleMap] || 'Utilisateur';
  };

  const getRoleIcon = (role: string) => {
    const iconMap = {
      'ADMIN': '👑',
      'BIBLIOTHECAIRE': '📚',
      'LECTEUR': '👨‍🎓'
    };
    return iconMap[role as keyof typeof iconMap] || '👤';
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      'ADMIN': '#FF6B6B',
      'BIBLIOTHECAIRE': '#FF9B54',
      'LECTEUR': '#FFD166'
    };
    return colorMap[role as keyof typeof colorMap] || '#2196F3';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
  };

  // Données de secours
  const getFallbackStats = (): AdminStats => ({
    totalUsers: 156,
    totalAdmins: 12,
    totalBibliothecaires: 19,
    totalLecteurs: 125,
    activeUsers: 142,
    inactiveUsers: 8,
    suspendedUsers: 6,
    usersByMonth: [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 19 },
      { label: 'Mar', value: 25 },
      { label: 'Apr', value: 32 },
      { label: 'May', value: 45 },
      { label: 'Jun', value: 52 }
    ],
    usersByRole: [
      { label: 'Admins', value: 12, color: '#FF6B6B' },
      { label: 'Bibliothecaires', value: 19, color: '#FF9B54' },
      { label: 'Lecteurs', value: 125, color: '#FFD166' }
    ],
    recentRegistrations: []
  });

  const getFallbackActivities = () => [
    { user: 'John Smith', action: 'New user registration', time: '2 minutes ago', icon: '👤', color: '#FFD166' },
    { user: 'Admin User', action: 'Updated user role to Admin', time: '15 minutes ago', icon: '🎭', color: '#FF6B6B' },
    { user: 'Jane Doe', action: 'Account status updated', time: '1 hour ago', icon: '✅', color: '#4CAF50' },
    { user: 'System', action: 'User report generated', time: '2 hours ago', icon: '📈', color: '#FF9B54' },
    { user: 'Robert Brown', action: 'User information updated', time: '3 hours ago', icon: '📝', color: '#2196F3' },
    { user: 'Admin User', action: 'User export completed', time: '5 hours ago', icon: '📥', color: '#9C5149' },
  ];

  // Gestionnaires d'événements
  const handleExportCSV = async () => {
    try {
      const blob = await AdminAPI.exportUsersToCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  const handleGenerateReport = async () => {
    try {
      await AdminAPI.generateUserReport();
      alert('Rapport généré avec succès!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Erreur lors de la génération du rapport');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardData();
  };

  const handleExportPDF = () => {
    alert('Export PDF à venir...');
  };

  // Calculs
  const calculateGrowthRate = () => {
    if (!stats?.usersByMonth || stats.usersByMonth.length < 2) return "0%";
    
    const currentMonth = stats.usersByMonth[stats.usersByMonth.length - 1].value;
    const previousMonth = stats.usersByMonth[stats.usersByMonth.length - 2].value;
    
    if (previousMonth === 0) return "100%";
    
    const growth = ((currentMonth - previousMonth) / previousMonth) * 100;
    return `${growth > 0 ? '+' : ''}${Math.round(growth)}%`;
  };

  const calculateActivityRate = () => {
    if (!stats || stats.totalUsers === 0) return '0%';
    return `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`;
  };

  const calculateMonthlyAverage = () => {
    if (!stats?.usersByMonth || stats.usersByMonth.length === 0) return 0;
    const total = stats.usersByMonth.reduce((acc, item) => acc + item.value, 0);
    return Math.round(total / stats.usersByMonth.length);
  };

  // Données pour les actions rapides
  const quickActions = [
    { 
      label: 'Ajouter Utilisateur', 
      icon: '👤', 
      color: '#FFD166', 
      path: '/admin/users/create',
      description: 'Créer un nouveau compte'
    },
    { 
      label: 'Gérer Utilisateurs', 
      icon: '👥', 
      color: '#FF9B54', 
      path: '/admin/users',
      description: 'Voir tous les utilisateurs'
    },
  ];

  // Données pour les rapports
  const reportActions = [
    {
      label: 'Exporter en CSV',
      icon: '📥',
      color: '#4CAF50',
      action: handleExportCSV,
      description: 'Exporter les utilisateurs en CSV'
    },
    {
      label: 'Exporter en PDF',
      icon: '📄',
      color: '#9C5149',
      action: handleExportPDF,
      description: 'Exporter le rapport en PDF'
    },
  ];

  // Afficher le chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">📊 Chargement du tableau de bord...</div>
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Background */}
      <div className="dashboard-background">
        <div className="background-overlay" />
      </div>

      <div className="dashboard-content">
        {/* Admin Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="header-accent" />
            <div className="header-title">Tableau de Bord Admin</div>
          </div>
          
          <div className="header-actions">
            <button className="refresh-btn" onClick={handleRefresh}>
              🔄 Rafraîchir
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

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            title="Total Utilisateurs"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="#FFD166"
            change="+12%"
            changeType="positive"
            description="Tous les utilisateurs enregistrés"
          />
          <StatCard
            title="Administrateurs"
            value={stats?.totalAdmins || 0}
            icon="👑"
            color="#FF6B6B"
            change="+2"
            changeType="positive"
            description="Comptes administrateurs"
          />
          <StatCard
            title="Bibliothécaires"
            value={stats?.totalBibliothecaires || 0}
            icon="📚"
            color="#FF9B54"
            change="+5"
            changeType="positive"
            description="Personnel de bibliothèque"
          />
          <StatCard
            title="Lecteurs"
            value={stats?.totalLecteurs || 0}
            icon="👨‍🎓"
            color="#2196F3"
            change="+15"
            changeType="positive"
            description="Comptes lecteurs"
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <PieChart
            data={stats?.usersByRole || []}
            title="Utilisateurs par Rôle"
            size={280}
            showLegend={true}
            showPercentages={true}
          />
          <BarChart
            data={stats?.usersByMonth.map(item => ({
              ...item,
              color: '#FFD166'
            })) || []}
            title="Nouveaux Utilisateurs (6 derniers mois)"
            height={350}
            showValues={true}
            animate={true}
          />
          <LineChart
            data={stats?.usersByMonth || []}
            title="Tendance de Croissance"
            height={350}
            width={400}
            color="#FF9B54"
            showPoints={true}
            fillArea={true}
          />
        </div>

        {/* Quick Actions & Reports */}
        <div className="actions-reports-grid">
          {/* Quick Actions */}
          <div className="quick-actions-panel">
            <h3 className="panel-title">⚡ Actions Rapides</h3>
            
            <div className="actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-btn"
                  onClick={() => navigate(action.path)}
                  style={{ '--action-color': action.color } as React.CSSProperties}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <div className="action-label">{action.label}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reports Panel */}
          <div className="reports-panel">
            <h3 className="panel-title">📊 Rapports & Exports</h3>
            
            <div className="reports-list">
              {reportActions.map((report, index) => (
                <button
                  key={index}
                  className="report-btn"
                  onClick={report.action}
                  style={{ '--report-color': report.color } as React.CSSProperties}
                >
                  <span className="report-icon">{report.icon}</span>
                  {report.label}
                </button>
              ))}
            </div>
            
            {/* Quick Statistics */}
            <div className="quick-stats">
              <h4 className="stats-title">📊 Statistiques Rapides</h4>
              <div className="stats-item">
                <span className="stats-label">Taux d'activité:</span>
                <span className="stats-value activity-rate">{calculateActivityRate()}</span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Moyenne mensuelle:</span>
                <span className="stats-value monthly-average">{calculateMonthlyAverage()}</span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Dernière mise à jour:</span>
                <span className="stats-time">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <div className="activities-header">
            <h3 className="panel-title">🔔 Activités Récentes</h3>
            <Link className="view-all-link" to="/admin/users">
              Voir Tous les Utilisateurs →
            </Link>
          </div>
          
          <div className="activities-grid">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="activity-card"
                style={{ '--activity-color': activity.color } as React.CSSProperties}
              >
                <div className="activity-accent" />
                <div className="activity-header">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-user">
                    <div className="user-name">{activity.user}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
                <div className="activity-action">{activity.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-left">
            <div className="status-indicator">
              <div className="status-dot" />
              Tableau de bord mis à jour
            </div>
          </div>
          <div className="footer-right">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </footer>
      </div>

      {/* Styles CSS */}
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          position: relative;
          font-family: 'Cormorant Garamond', serif;
          color: #FFFBF5;
          overflow-x: hidden;
          background-color: #281C16;
          padding: 70px 50px;
        }

        .dashboard-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
          filter: brightness(0.8);
          z-index: 0;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(40, 28, 22, 0.95) 0%, rgba(156, 81, 73, 0.9) 100%);
          z-index: 1;
        }

        .dashboard-content {
          position: relative;
          z-index: 2;
        }

        /* Loading Styles */
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #281C16;
          color: #FFFBF5;
          flex-direction: column;
          gap: 20px;
        }

        .loading-text {
          font-size: 2rem;
          font-family: 'Cormorant Garamond', serif;
          animation: pulse 2s infinite;
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background-color: rgba(255, 251, 245, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .loading-progress {
          width: 60%;
          height: 100%;
          background-color: #FFD166;
          animation: loading 2s infinite ease-in-out;
        }

        /* Header Styles */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 25px;
          border-bottom: 2px solid rgba(255, 251, 245, 0.2);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-accent {
          width: 16px;
          height: 60px;
          background-color: #FFD166;
          border-radius: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 20px rgba(255, 209, 102, 0.3);
        }

        .header-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: 2px;
          color: #FFFBF5;
          font-family: 'Playfair Display', serif;
          text-transform: uppercase;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .refresh-btn, .profile-btn, .logout-btn {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          border-radius: 10px;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 12px 25px;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .refresh-btn {
          color: #FFFBF5;
          background-color: rgba(33, 150, 243, 0.2);
          border-color: rgba(33, 150, 243, 0.4);
        }

        .refresh-btn:hover {
          background-color: rgba(33, 150, 243, 0.3);
          transform: translateY(-2px);
        }

        .profile-btn {
          color: #FFFBF5;
          text-decoration: none;
          background-color: rgba(255, 251, 245, 0.12);
          border-color: rgba(255, 251, 245, 0.3);
        }

        .profile-btn:hover {
          background-color: rgba(255, 251, 245, 0.2);
          transform: translateY(-2px);
        }

        .logout-btn {
          color: #FFFBF5;
          background-color: rgba(255, 107, 107, 0.2);
          border-color: rgba(255, 107, 107, 0.4);
        }

        .logout-btn:hover {
          background-color: rgba(255, 107, 107, 0.3);
          transform: translateY(-2px);
        }

        /* Grid Styles */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          margin-bottom: 40px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          margin-bottom: 40px;
        }

        .actions-reports-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 25px;
          margin-bottom: 40px;
        }

        /* Panel Styles */
        .quick-actions-panel, .reports-panel, .recent-activities {
          background-color: rgba(255, 251, 245, 0.08);
          backdrop-filter: blur(15px);
          border-radius: 18px;
          padding: 30px;
          border: 2px solid rgba(255, 251, 245, 0.2);
        }

        .panel-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #FFFBF5;
          margin-bottom: 25px;
          font-family: 'Playfair Display', serif;
        }

        /* Quick Actions */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background-color: rgba(255, 251, 245, 0.1);
          border-radius: 12px;
          border: 2px solid var(--action-color, #FFD166)40;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          border-color: color-mix(in srgb, var(--action-color, #FFD166) 25%, transparent);
        }

        .action-btn:hover {
          transform: translateY(-5px);
          background-color: color-mix(in srgb, var(--action-color, #FFD166) 20%, transparent);
          border-color: var(--action-color, #FFD166);
          box-shadow: 0 10px 30px color-mix(in srgb, var(--action-color, #FFD166) 30%, transparent);
        }

        .action-icon {
          font-size: 2rem;
          color: var(--action-color, #FFD166);
        }

        .action-label {
          color: #FFFBF5;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .action-description {
          color: rgba(255, 251, 245, 0.7);
          font-size: 0.85rem;
        }

        /* Reports Panel */
        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .report-btn {
          padding: 18px;
          background-color: color-mix(in srgb, var(--report-color, #FFD166) 10%, transparent);
          color: var(--report-color, #FFD166);
          border: 2px solid color-mix(in srgb, var(--report-color, #FFD166) 30%, transparent);
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 15px;
          font-family: 'Cormorant Garamond', serif;
        }

        .report-btn:hover {
          background-color: color-mix(in srgb, var(--report-color, #FFD166) 20%, transparent);
          border-color: var(--report-color, #FFD166);
          transform: translateX(5px);
        }

        .report-icon {
          font-size: 1.5rem;
        }

        /* Quick Stats */
        .quick-stats {
          background-color: rgba(255, 251, 245, 0.05);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 251, 245, 0.1);
        }

        .stats-title {
          color: #FFFBF5;
          margin-bottom: 15px;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .stats-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .stats-label {
          color: rgba(255, 251, 245, 0.7);
        }

        .stats-value {
          font-weight: 600;
        }

        .activity-rate {
          color: #4CAF50;
        }

        .monthly-average {
          color: #FFD166;
        }

        .stats-time {
          color: rgba(255, 251, 245, 0.7);
          font-size: 0.9rem;
        }

        /* Recent Activities */
        .recent-activities {
          margin-bottom: 40px;
        }

        .activities-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .view-all-link {
          color: #FFD166;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .activity-card {
          padding: 20px;
          background-color: rgba(255, 251, 245, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 251, 245, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .activity-card:hover {
          background-color: rgba(255, 251, 245, 0.1);
          transform: translateY(-3px);
        }

        .activity-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background-color: var(--activity-color, #FFD166);
        }

        .activity-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
          padding-left: 10px;
        }

        .activity-icon {
          font-size: 1.8rem;
          color: var(--activity-color, #FFD166);
        }

        .user-name {
          color: #FFFBF5;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .activity-time {
          color: rgba(255, 251, 245, 0.7);
          font-size: 0.9rem;
        }

        .activity-action {
          color: rgba(255, 251, 245, 0.9);
          font-size: 0.95rem;
          padding-left: 50px;
        }

        /* Footer */
        .dashboard-footer {
          padding: 25px;
          background-color: rgba(255, 251, 245, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 2px solid rgba(255, 251, 245, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: rgba(255, 251, 245, 0.8);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background-color: #4CAF50;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        /* Animations */
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

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        /* Scrollbar */
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

        /* Responsive Design */
        @media (max-width: 1600px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .admin-dashboard {
            padding: 50px 30px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .actions-reports-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 30px 20px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .header-actions {
            flex-wrap: wrap;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .activities-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-footer {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;