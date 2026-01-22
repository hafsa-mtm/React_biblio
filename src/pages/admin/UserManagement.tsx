import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { User } from "../../types/User";
import { Link } from "react-router-dom";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Clock
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteRole, setConfirmDeleteRole] = useState<User["role"] | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // KEEP YOUR EXISTING LOGIC - START
  useEffect(() => {
    AdminAPI.getAllUsers()
      .then(data => {
        console.log("Users fetched:", data); // 🔹 debug
        setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, role: User["role"]) => {
    if (!id) return;

    try {
      await AdminAPI.deleteUser(id, role);
      setUsers(prev => prev.filter(u => u.id !== id));
      showNotification('success', 'Utilisateur supprimé avec succès');
    } catch (err: any) {
      console.error(err);
      showNotification('error', "Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    } finally {
      setConfirmDeleteId(null);
      setConfirmDeleteRole(null);
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );
  // KEEP YOUR EXISTING LOGIC - END

  // Apply styling from AllBooks component
  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative' as const,
      fontFamily: "'Cormorant Garamond', serif",
      color: '#FFFBF5',
      overflow: 'hidden' as const,
      backgroundColor: '#281C16',
      padding: '70px 50px',
    },
    background: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
      backgroundSize: 'cover' as const,
      backgroundPosition: 'center' as const,
      filter: 'brightness(0.8)',
      zIndex: 0,
    },
    gradientOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(40, 28, 22, 0.95) 0%, rgba(156, 81, 73, 0.9) 100%)',
      zIndex: 1,
    },
    content: {
      position: 'relative' as const,
      zIndex: 2,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
    },
    backButton: {
      fontSize: '1rem',
      color: '#FFFBF5',
      textDecoration: 'none' as const,
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      borderRadius: '10px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: 800,
      letterSpacing: '2px',
      color: '#FFFBF5',
      fontFamily: "'Playfair Display', serif",
    },
    addButton: {
      padding: '15px 30px',
      backgroundColor: '#FFD166',
      color: '#3C2F2F',
      border: '2px solid #FFD166',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      textDecoration: 'none' as const,
      fontFamily: "'Cormorant Garamond', serif",
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchCard: {
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '25px',
      marginBottom: '40px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
    },
    searchLabel: {
      fontSize: '0.9rem',
      color: 'rgba(255, 251, 245, 0.7)',
      marginBottom: '8px',
      fontWeight: 600,
    },
    searchInput: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      color: '#FFFBF5',
      fontSize: '1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
    },
    tableCard: {
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '25px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      overflow: 'auto' as const,
    },
    table: {
      width: '100%',
      borderCollapse: 'separate' as const,
      borderSpacing: '0',
    },
    th: {
      padding: '20px',
      textAlign: 'left' as const,
      color: 'rgba(255, 251, 245, 0.9)',
      fontWeight: 600,
      fontSize: '1.1rem',
      borderBottom: '2px solid rgba(255, 251, 245, 0.2)',
    },
    td: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 251, 245, 0.1)',
      verticalAlign: 'middle' as const,
    },
    actionButton: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      color: '#FFD166',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      textDecoration: 'none' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    },
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      color: '#FF6B6B',
      border: '2px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      color: 'rgba(255, 251, 245, 0.7)',
      fontSize: '1.2rem',
      fontStyle: 'italic',
    },
    badge: {
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 209, 102, 0.2)',
      color: '#FFD166',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#281C16',
      color: '#FFFBF5',
    },
    loadingText: {
      fontSize: '1.5rem',
      fontFamily: "'Cormorant Garamond', serif",
      animation: 'pulse 2s infinite',
    },
    notification: {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      zIndex: 50,
      animation: 'slideIn 0.3s ease-out forwards',
    },
    modalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100,
    },
    modalContent: {
      backgroundColor: 'rgba(40, 28, 22, 0.95)',
      borderRadius: '16px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      backdropFilter: 'blur(15px)',
      animation: 'scaleIn 0.2s ease-out',
    },
    roleBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  // Role badge colors based on role
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return { bg: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' };
      case 'BIBLIOTHECAIRE': return { bg: 'rgba(255, 155, 84, 0.2)', color: '#FF9B54' };
      case 'LECTEUR': return { bg: 'rgba(255, 209, 102, 0.2)', color: '#FFD166' };
      default: return { bg: 'rgba(156, 81, 73, 0.2)', color: '#9C5149' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>
          Chargement des utilisateurs...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background}>
        <div style={styles.gradientOverlay} />
      </div>

      {/* Notification */}
      {notification.show && (
        <div style={styles.notification}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            backgroundColor: notification.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 107, 107, 0.2)',
            border: `2px solid ${notification.type === 'success' ? '#4CAF50' : '#FF6B6B'}`,
            borderRadius: '10px',
            color: '#FFFBF5',
            backdropFilter: 'blur(10px)',
          }}>
            {notification.type === 'success' ? (
              <CheckCircle size={24} color="#4CAF50" />
            ) : (
              <XCircle size={24} color="#FF6B6B" />
            )}
            <span style={{ fontWeight: 600 }}>{notification.message}</span>
            <button
              onClick={() => setNotification(n => ({ ...n, show: false }))}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 251, 245, 0.7)',
                cursor: 'pointer',
                marginLeft: '20px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && confirmDeleteRole && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: 'rgba(255, 107, 107, 0.2)',
                  borderRadius: '10px',
                }}>
                  <AlertCircle size={28} color="#FF6B6B" />
                </div>
                <div style={{ ...styles.title, fontSize: '1.8rem' }}>
                  Confirmer la suppression
                </div>
              </div>
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteRole(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 251, 245, 0.7)',
                  cursor: 'pointer',
                  padding: '5px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <p style={{ color: 'rgba(255, 251, 245, 0.9)', fontSize: '1.1rem', marginBottom: '15px' }}>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </p>
              <div style={{
                padding: '15px',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderLeft: '4px solid #FF6B6B',
                borderRadius: '0 8px 8px 0',
              }}>
                <p style={{ color: '#FF6B6B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} />
                  Cette action est irréversible
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteRole(null);
                }}
                style={{
                  ...styles.actionButton,
                  backgroundColor: 'rgba(255, 251, 245, 0.1)',
                  borderColor: 'rgba(255, 251, 245, 0.3)',
                  color: '#FFFBF5',
                  padding: '12px 24px',
                }}
              >
                <X size={18} />
                Annuler
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId, confirmDeleteRole)}
                style={{
                  ...styles.deleteButton,
                  padding: '12px 24px',
                }}
              >
                <Trash2 size={18} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/admin"
              style={styles.backButton}
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
            <div style={styles.title}>
              Gestion des Utilisateurs
            </div>
          </div>
          
          <Link
            to="/admin/users/create"
            style={styles.addButton}
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
            <PlusCircle size={20} />
            Nouvel Utilisateur
          </Link>
        </header>

        {/* Search */}
        <div style={styles.searchCard}>
          <div style={styles.searchLabel}>Rechercher des utilisateurs</div>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou rôle..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#FFD166';
              e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
              e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
            }}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '25px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(255, 251, 245, 0.1)',
          }}>
            <div style={{
              color: 'rgba(255, 251, 245, 0.9)',
              fontSize: '1.1rem',
            }}>
              Affichage de {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  <UserIcon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Utilisateur
                </th>
                <th style={styles.th}>
                  <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Email
                </th>
                <th style={styles.th}>
                  <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Date de naissance
                </th>
                <th style={styles.th}>
                  <Shield size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Rôle
                </th>
                <th style={styles.th}>
                  <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Créé le
                </th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyState}>
                    <Users size={48} style={{ color: 'rgba(255, 251, 245, 0.5)', marginBottom: '20px' }} />
                    <div style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '1.2rem' }}>
                      Aucun utilisateur trouvé
                    </div>
                    <div style={{ color: 'rgba(255, 251, 245, 0.5)', marginTop: '10px' }}>
                      Essayez d'autres termes de recherche
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr
                    key={u.id}
                    style={{
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.td}>
                      <div>
                        <div style={{ color: '#FFFBF5', fontWeight: 600, fontSize: '1.1rem' }}>
                          {u.nom} {u.prenom}
                        </div>
                        <div style={{ color: 'rgba(255, 251, 245, 0.7)', fontSize: '0.9rem' }}>
                          ID: {u.id}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {u.email}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {u.date_naissance ? new Date(u.date_naissance).toLocaleDateString('fr-FR') : "-"}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleColor(u.role).bg,
                        color: getRoleColor(u.role).color,
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ color: 'rgba(255, 251, 245, 0.9)' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : "-"}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          to={`/admin/users/${u.role.toLowerCase()}/${u.id}/edit`}
                          style={styles.actionButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
                            e.currentTarget.style.borderColor = '#FFD166';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 209, 102, 0.3)';
                          }}
                        >
                          <Edit size={16} />
                          Modifier
                        </Link>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(u.id);
                            setConfirmDeleteRole(u.role);
                          }}
                          style={styles.deleteButton}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                            e.currentTarget.style.borderColor = '#FF6B6B';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                          }}
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
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