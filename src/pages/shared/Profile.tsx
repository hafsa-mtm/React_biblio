import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nom: 'Smith',
    prenom: 'John',
    email: 'john.smith@example.com',
    role: 'Admin',
    joinDate: '2023-01-15',
    phone: '+1 234 567 8900',
    address: '123 Library St, Bookville',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to API
    console.log('Saving user data:', userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data here if needed
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#3C2F2F',
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
        backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '50px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <Link
              to="/admin"
              style={{
                fontSize: '1.5rem',
                color: '#FFFBF5',
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 251, 245, 0.1)',
                borderRadius: '10px',
                border: '2px solid rgba(255, 251, 245, 0.2)',
                transition: 'all 0.3s ease',
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
              ← Back
            </Link>
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
            }}>
              My Profile
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '15px 30px',
              backgroundColor: isEditing ? 'transparent' : '#FFD166',
              color: isEditing ? '#FFD166' : '#3C2F2F',
              border: '2px solid #FFD166',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Cormorant Garamond', serif",
            }}
            onMouseEnter={(e) => {
              if (!isEditing) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFD166';
              }
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              if (!isEditing) {
                e.currentTarget.style.backgroundColor = '#FFD166';
                e.currentTarget.style.color = '#3C2F2F';
              }
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </header>

        {/* Profile Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          
          {/* Left Column - Profile Card */}
          <div style={{
            backgroundColor: 'rgba(255, 251, 245, 0.1)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid rgba(255, 251, 245, 0.2)',
            textAlign: 'center',
          }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 251, 245, 0.2)',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: '#FFD166',
              border: '4px solid rgba(255, 209, 102, 0.4)',
            }}>
              {userData.prenom[0]}{userData.nom[0]}
            </div>
            
            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              color: '#FFFBF5',
              marginBottom: '10px',
              fontFamily: "'Playfair Display', serif",
            }}>
              {userData.prenom} {userData.nom}
            </h2>
            
            <div style={{
              padding: '10px 25px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              color: '#FF6B6B',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: 600,
              display: 'inline-block',
              marginBottom: '25px',
            }}>
              {userData.role}
            </div>
            
            <div style={{
              color: 'rgba(255, 251, 245, 0.9)',
              fontSize: '1.1rem',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}>
              📧 {userData.email}
            </div>
            
            <div style={{
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '0.95rem',
              marginBottom: '25px',
              fontStyle: 'italic',
            }}>
              Member since {new Date(userData.joinDate).toLocaleDateString()}
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.08)',
              borderRadius: '14px',
              padding: '25px',
              marginTop: '30px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}>
                <span style={{ color: 'rgba(255, 251, 245, 0.9)' }}>Account Status</span>
                <span style={{
                  color: '#4CAF50',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  ● Active
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}>
                <span style={{ color: 'rgba(255, 251, 245, 0.9)' }}>Last Login</span>
                <span style={{ color: 'rgba(255, 251, 245, 0.7)' }}>
                  Today, 14:30
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: 'rgba(255, 251, 245, 0.9)' }}>IP Address</span>
                <span style={{ color: 'rgba(255, 251, 245, 0.7)' }}>
                  192.168.1.1
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div>
            {/* Edit Form / Display Info */}
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 251, 245, 0.2)',
              marginBottom: '30px',
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#FFFBF5',
                marginBottom: '30px',
                fontFamily: "'Playfair Display', serif",
              }}>
                Personal Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '25px',
              }}>
                {[
                  { label: 'First Name', value: userData.prenom, key: 'prenom' },
                  { label: 'Last Name', value: userData.nom, key: 'nom' },
                  { label: 'Email', value: userData.email, key: 'email' },
                  { label: 'Phone', value: userData.phone, key: 'phone' },
                  { label: 'Address', value: userData.address, key: 'address', fullWidth: true },
                  { label: 'Role', value: userData.role, key: 'role' },
                ].map((field) => (
                  <div key={field.key} style={{ gridColumn: field.fullWidth ? 'span 2' : 'auto' }}>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 251, 245, 0.7)',
                      marginBottom: '8px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {field.label}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => setUserData({ ...userData, [field.key]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '15px 20px',
                          backgroundColor: 'rgba(255, 251, 245, 0.1)',
                          border: '2px solid rgba(255, 251, 245, 0.3)',
                          borderRadius: '10px',
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
                    ) : (
                      <div style={{
                        padding: '15px 20px',
                        backgroundColor: 'rgba(255, 251, 245, 0.08)',
                        border: '2px solid rgba(255, 251, 245, 0.2)',
                        borderRadius: '10px',
                        color: '#FFFBF5',
                        fontSize: '1.1rem',
                        minHeight: '52px',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        {field.value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '40px',
                  justifyContent: 'flex-end',
                }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '15px 30px',
                      backgroundColor: 'transparent',
                      color: '#FF6B6B',
                      border: '2px solid #FF6B6B',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      padding: '15px 30px',
                      backgroundColor: '#FFD166',
                      color: '#3C2F2F',
                      border: '2px solid #FFD166',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#FFD166';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFD166';
                      e.currentTarget.style.color = '#3C2F2F';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'rgba(255, 251, 245, 0.1)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '40px',
              border: '2px solid rgba(255, 251, 245, 0.2)',
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#FFFBF5',
                marginBottom: '30px',
                fontFamily: "'Playfair Display', serif",
              }}>
                Recent Activity
              </h3>
              
              {[
                { action: 'Logged in', time: 'Today, 14:30', icon: '🔐' },
                { action: 'Updated user settings', time: 'Yesterday, 09:15', icon: '⚙️' },
                { action: 'Processed 5 loan requests', time: '2 days ago', icon: '📖' },
                { action: 'Generated monthly report', time: '3 days ago', icon: '📈' },
                { action: 'Added 3 new books', time: '1 week ago', icon: '📚' },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.05)',
                    borderRadius: '12px',
                    marginBottom: '15px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    color: '#FFD166',
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#FFFBF5',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    }}>
                      {activity.action}
                    </div>
                    <div style={{
                      color: 'rgba(255, 251, 245, 0.7)',
                      fontSize: '0.9rem',
                    }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;