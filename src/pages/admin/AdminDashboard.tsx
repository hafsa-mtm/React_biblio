import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { AdminAPI, AdminStats } from '../../api/admin.api';
import StatCard from '../../components/StatsCard';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';

// Sample data for charts (will be replaced with real data)
const samplePieData = [
  { label: 'Admins', value: 12, color: '#FF6B6B' },
  { label: 'Bibliothecaires', value: 19, color: '#FF9B54' },
  { label: 'Lecteurs', value: 125, color: '#FFD166' },
];
const sampleBarData = [
  { label: 'Jan', value: 12, color: '#FFD166' },
  { label: 'Feb', value: 19, color: '#FFD166' },
  { label: 'Mar', value: 3, color: '#FFD166' },
  { label: 'Apr', value: 5, color: '#FFD166' },
  { label: 'May', value: 2, color: '#FFD166' },
  { label: 'Jun', value: 3, color: '#FFD166' },
];

const sampleLineData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 59 },
  { label: 'Mar', value: 80 },
  { label: 'Apr', value: 81 },
  { label: 'May', value: 56 },
  { label: 'Jun', value: 55 },
];

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await AdminAPI.getDashboardStats(); // Fixed: AdminAPI instead of adminAPI
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use sample data for demo
      setStats({
        totalUsers: 156,
        totalAdmins: 12,
        totalBibliothecaires: 19,
        totalLecteurs: 125,
        activeUsers: 142,
        inactiveUsers: 8,
        suspendedUsers: 6,
        usersByMonth: [],
        usersByRole: [],
        recentRegistrations: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await AdminAPI.exportUsersToCSV(); // Fixed: AdminAPI instead of adminAPI
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await AdminAPI.generateUserReport(); // Fixed: AdminAPI instead of adminAPI
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
    }
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
          Loading Dashboard...
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
        
        {/* Admin Header */}
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
              User Management Dashboard
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}>
            <Link
              to="/profile"
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
              👤 Profile
            </Link>
            <button
              onClick={() => {/* Handle logout */}}
              style={{
                color: '#FFFBF5',
                fontSize: '1.1rem',
                fontWeight: 600,
                padding: '12px 25px',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderRadius: '10px',
                border: '2px solid rgba(255, 107, 107, 0.4)',
                transition: 'all 0.3s ease',
                fontFamily: "'Cormorant Garamond', serif",
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Removed: Time Filter section */}

        {/* Stats Grid - Only keep 5 stat cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '25px',
          marginBottom: '40px',
        }}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="#FFD166"
            change="+12%"
            changeType="positive"
            description="All registered users"
          />
          <StatCard
            title="Admins"
            value={stats?.totalAdmins || 0}
            icon="👑"
            color="#FF6B6B"
            change="+2"
            changeType="positive"
            description="Administrator accounts"
          />
          <StatCard
            title="Bibliothecaires"
            value={stats?.totalBibliothecaires || 0}
            icon="📚"
            color="#FF9B54"
            change="+5"
            changeType="positive"
            description="Library staff"
          />
          <StatCard
            title="Lecteurs"
            value={stats?.totalLecteurs || 0}
            icon="👨‍🎓"
            color="#2196F3"
            change="+15"
            changeType="positive"
            description="Reader accounts"
          />
          <StatCard
            title="Growth Rate"
            value="24%"
            icon="📈"
            color="#9C5149"
            change="+3%"
            changeType="positive"
            description="Monthly growth"
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
            data={samplePieData}
            title="Users by Role"
            size={280}
            showLegend={true}
            showPercentages={true}
          />
          <BarChart
            data={sampleBarData}
            title="New Users (Last 6 Months)"
            height={350}
            showValues={true}
            animate={true}
          />
          <LineChart
            data={sampleLineData}
            title="User Growth Trend"
            height={350}
            width={400}
            color="#FF9B54"
            showPoints={true}
            fillArea={true}
          />
        </div>

        {/* Quick Actions & Reports */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '25px',
          marginBottom: '40px',
        }}>
          {/* Quick Actions - Fixed with proper React Router navigation */}
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
              ⚡ Quick Actions
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}>
              {[
                { 
                  label: 'Add New User', 
                  icon: '👤', 
                  color: '#FFD166', 
                  path: '/admin/users/create', // Correct path from your routes
                  description: 'Create new user account'
                },
                { 
                  label: 'Manage Users', 
                  icon: '👥', 
                  color: '#FF9B54', 
                  path: '/admin/users', // Correct path from your routes
                  description: 'View all users'
                },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)} // Fixed: Use navigate instead of window.location
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
              📊 Reports
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginBottom: '25px',
            }}>
              <button
                onClick={handleGenerateReport}
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
                Generate User Report
              </button>
              
              <button
                onClick={handleExportCSV}
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
                Export Users to CSV
              </button>
              
              <button
                onClick={() => {/* Handle PDF export */}}
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
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                Export to PDF
              </button>
            </div>
            
            {/* Removed: Report Schedule section */}
          </div>
        </div>

        {/* Recent Activity - Updated with relevant activities only */}
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
              🔔 Recent Activity
            </h3>
            <Link
              to="/admin/users"
              style={{
                color: '#FFD166',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              View All Users
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </Link>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
          }}>
            {[
              { user: 'John Smith', action: 'New user registration', time: '2 minutes ago', icon: '👤' },
              { user: 'Admin User', action: 'Updated user role to Admin', time: '15 minutes ago', icon: '🎭' },
              { user: 'Jane Doe', action: 'Account status updated', time: '1 hour ago', icon: '✅' },
              { user: 'System', action: 'User report generated', time: '2 hours ago', icon: '📈' },
              { user: 'Robert Brown', action: 'User information updated', time: '3 hours ago', icon: '📝' },
              { user: 'Admin User', action: 'User export completed', time: '5 hours ago', icon: '📥' },
            ].map((activity, index) => (
              <div
                key={index}
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
                    {activity.icon}
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
                      {activity.time}
                    </div>
                  </div>
                </div>
                <div style={{
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontSize: '0.95rem',
                  paddingLeft: '50px',
                }}>
                  {activity.action}
                </div>
              </div>
            ))}
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
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
              Dashboard Updated
            </div>
          </div>
          <div>
            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
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

export default AdminDashboard;