import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { User } from "../../types/User";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Loading users...");
      
      const usersData = await AdminAPI.getAllUsers();
      console.log("✅ Users loaded:", usersData);
      
      if (!Array.isArray(usersData)) {
        throw new Error("Invalid data format received");
      }
      
      setUsers(usersData);
    } catch (err: any) {
      console.error("❌ Error loading users:", err);
      setError(err.message || "Erreur lors du chargement des utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string, role: User["role"]) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await AdminAPI.deleteUser(id, role);
      // Refresh the list
      await loadUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete' && selectedUsers.length > 0) {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
        // Implement bulk delete here
        console.log('Bulk delete:', selectedUsers);
        // For now, just clear selection
        setSelectedUsers([]);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#FF6B6B';
      case 'BIBLIOTHECAIRE': return '#FF9B54';
      case 'LECTEUR': return '#FFD166';
      default: return '#9C5149';
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

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
          Chargement des utilisateurs...
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
              onClick={loadUsers}
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
              to="/admin"
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
              Gestion des Utilisateurs
            </div>
          </div>
          
          <Link
            to="/admin/users/create"
            style={{
              padding: '15px 30px',
              backgroundColor: '#FFD166',
              color: '#3C2F2F',
              border: '2px solid #FFD166',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: "'Cormorant Garamond', serif",
              transition: 'all 0.3s ease',
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
            + Nouvel Utilisateur
          </Link>
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
            gridTemplateColumns: '2fr 1fr 1fr',
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
                placeholder="Rechercher par nom, prénom ou email..."
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
                👥 Filtrer par Rôle
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
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
                  cursor: 'pointer',
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
              >
                <option value="all">Tous les rôles</option>
                <option value="ADMIN">Administrateur</option>
                <option value="BIBLIOTHECAIRE">Bibliothécaire</option>
                <option value="LECTEUR">Lecteur</option>
              </select>
            </div>
            
            <div>
              <div style={{
                fontSize: '1rem',
                color: 'rgba(255, 251, 245, 0.9)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                ⚡ Actions en Masse
              </div>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  backgroundColor: selectedUsers.length > 0 ? 
                    'rgba(255, 107, 107, 0.1)' : 'rgba(255, 251, 245, 0.1)',
                  border: selectedUsers.length > 0 ? 
                    '2px solid rgba(255, 107, 107, 0.3)' : '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '12px',
                  color: '#FFFBF5',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <option value="">Sélectionner une action</option>
                <option value="delete">Supprimer la sélection</option>
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
              📊 Affichage : {filteredUsers.length} sur {users.length} utilisateurs
            </div>
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
            }}>
              {selectedUsers.length > 0 && (
                <span style={{
                  color: '#FFD166',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}>
                  {selectedUsers.length} sélectionné(s)
                </span>
              )}
              <button
                onClick={() => setSelectedUsers([])}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  color: '#FFFBF5',
                  border: '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                  e.currentTarget.style.borderColor = '#FFFBF5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                }}
              >
                Effacer la Sélection
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '18px',
          padding: '30px',
          border: '2px solid rgba(255, 251, 245, 0.2)',
          overflow: 'auto',
        }}>
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
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    style={{
                      marginRight: '15px',
                      transform: 'scale(1.3)',
                      cursor: 'pointer',
                    }}
                  />
                  Utilisateur
                </th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                }}>Email</th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                }}>Rôle</th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                }}>Date de naissance</th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                }}>Créé le</th>
                <th style={{
                  padding: '20px',
                  textAlign: 'left',
                  color: 'rgba(255, 251, 245, 0.9)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={`${user.role}-${user.id}`}
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
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        style={{
                          transform: 'scale(1.3)',
                          cursor: 'pointer',
                        }}
                      />
                      <div>
                        <div style={{
                          color: '#FFFBF5',
                          fontWeight: 600,
                          fontSize: '1.2rem',
                        }}>
                          {user.nom} {user.prenom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{
                      padding: '10px 20px',
                      backgroundColor: `${getRoleColor(user.role)}20`,
                      color: getRoleColor(user.role),
                      borderRadius: '25px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      display: 'inline-block',
                      border: `2px solid ${getRoleColor(user.role)}40`,
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                    {user.date_naissance
                      ? new Date(user.date_naissance).toLocaleDateString('fr-FR')
                      : "-"}
                  </td>
                  <td style={{ padding: '20px', color: 'rgba(255, 251, 245, 0.9)' }}>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('fr-FR')
                      : "-"}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <Link
                        to={`/admin/users/${user.role.toLowerCase()}/${user.id}/edit`}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'rgba(255, 209, 102, 0.1)',
                          color: '#FFD166',
                          border: '2px solid rgba(255, 209, 102, 0.3)',
                          borderRadius: '10px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
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
                        ✏️ Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id, user.role)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          color: '#FF6B6B',
                          border: '2px solid rgba(255, 107, 107, 0.3)',
                          borderRadius: '10px',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                          e.currentTarget.style.borderColor = '#FF6B6B';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 251, 245, 0.7)',
              fontSize: '1.3rem',
              fontStyle: 'italic',
            }}>
              {searchTerm || filterRole !== 'all' 
                ? "Aucun utilisateur trouvé avec ces critères" 
                : "Aucun utilisateur disponible"}
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
        `}
      </style>
    </div>
  );
};

export default UserManagement;