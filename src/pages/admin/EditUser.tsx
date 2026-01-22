import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft, CheckCircle, XCircle, Info, User, Mail, Lock, Calendar, Crown, Book, UserCheck, ShieldAlert } from "lucide-react";

const EditUser = () => {
  const { id, role } = useParams<{ id: string; role: "admin" | "bibliothecaire" | "lecteur" }>();
  const navigate = useNavigate();

  // KEEP YOUR EXACT LOGIC - START
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
    role: "LECTEUR",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id || !role) {
      setError("Utilisateur invalide ou ID manquant");
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await AdminAPI.getUserById(id, role.toUpperCase() as any);
        if (!user || !user.id) {
          setError("Utilisateur introuvable");
          return;
        }
        setForm({
          nom: user.nom || "",
          prenom: user.prenom || "",
          email: user.email || "",
          password: "",
          date_naissance: user.date_naissance || "",
          role: user.role,
        });
      } catch {
        setError("Impossible de charger l'utilisateur");
        navigate("/admin/users");
      }
    };

    fetchUser();
  }, [id, role, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentRole = role!.toUpperCase() as "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";
      if (form.role !== currentRole) {
        await AdminAPI.changeUserRole({
          id: id!,
          oldRole: currentRole,
          newRole: form.role as any,
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          date_naissance: form.date_naissance,
          password: form.password,
        });
      } else {
        await AdminAPI.updateUser(id!, currentRole, {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          date_naissance: form.date_naissance,
          password: form.password || undefined,
        });
      }
      navigate("/admin/users");
    } catch {
      alert("Erreur lors de la modification");
    }
  };
  // KEEP YOUR EXACT LOGIC - END

  // Apply styling from EditBook component
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
      maxWidth: '800px',
      margin: '0 auto',
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
    card: {
      backgroundColor: 'rgba(255, 251, 245, 0.08)',
      backdropFilter: 'blur(15px)',
      borderRadius: '18px',
      padding: '30px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
    },
    label: {
      fontSize: '1rem',
      color: 'rgba(255, 251, 245, 0.9)',
      marginBottom: '10px',
      fontWeight: 600,
      display: 'block' as const,
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '12px',
      color: '#FFFBF5',
      fontSize: '1.1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
    },
    select: {
      width: '100%',
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '12px',
      color: '#FFFBF5',
      fontSize: '1.1rem',
      fontFamily: "'Cormorant Garamond', serif",
      outline: 'none' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    buttonGroup: {
      display: 'flex',
      gap: '20px',
      marginTop: '30px',
      paddingTop: '30px',
      borderTop: '2px solid rgba(255, 251, 245, 0.1)',
    },
    cancelButton: {
      flex: 1,
      padding: '15px 30px',
      backgroundColor: 'rgba(255, 251, 245, 0.1)',
      color: '#FFFBF5',
      border: '2px solid rgba(255, 251, 245, 0.3)',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    submitButton: {
      flex: 1,
      padding: '15px 30px',
      backgroundColor: '#FFD166',
      color: '#3C2F2F',
      border: '2px solid #FFD166',
      borderRadius: '10px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    errorAlert: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      border: '2px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '12px',
      color: '#FF6B6B',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    warningAlert: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '12px',
      color: '#FFD166',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    infoBox: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '12px',
      color: '#FFD166',
      marginTop: '25px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    roleInfoCard: {
      padding: '15px 20px',
      backgroundColor: 'rgba(255, 251, 245, 0.05)',
      border: '2px solid rgba(255, 251, 245, 0.1)',
      borderRadius: '12px',
      marginTop: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      transition: 'all 0.3s ease',
    },
    roleIconContainer: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    roleContent: {
      flex: 1,
    },
    roleTitle: {
      color: '#FFFBF5',
      fontWeight: 600,
      fontSize: '1.1rem',
      marginBottom: '5px',
    },
    roleDescription: {
      color: 'rgba(255, 251, 245, 0.7)',
      fontSize: '0.9rem',
      lineHeight: 1.4,
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px',
      marginBottom: '25px',
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
  };

  // Role styling functions
  const getRoleDescription = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "Accès complet à toutes les fonctionnalités du système";
      case "BIBLIOTHECAIRE":
        return "Gestion des livres, des prêts et des lecteurs";
      case "LECTEUR":
        return "Consultation du catalogue et emprunt de livres";
      default:
        return "";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN": return <Crown size={20} />;
      case "BIBLIOTHECAIRE": return <Book size={20} />;
      case "LECTEUR": return <UserCheck size={20} />;
      default: return <User size={20} />;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'ADMIN': return '#FF6B6B';
      case 'BIBLIOTHECAIRE': return '#FF9B54';
      case 'LECTEUR': return '#FFD166';
      default: return '#9C5149';
    }
  };

  // Check if role is being changed
  const isRoleChanged = role && form.role !== role.toUpperCase();

  if (error && !form.nom) {
    return (
      <div style={styles.container}>
        <div style={styles.background}>
          <div style={styles.gradientOverlay} />
        </div>
        <div style={styles.content}>
          <header style={styles.header}>
            <Link
              to="/admin/users"
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
              <ArrowLeft size={20} />
              Retour
            </Link>
            <div style={styles.title}>
              Erreur
            </div>
          </header>
          <div style={styles.card}>
            <div style={styles.errorAlert}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          </div>
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

      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link
              to="/admin/users"
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
              <ArrowLeft size={20} />
              Retour
            </Link>
            <div style={styles.title}>
              Modifier l'Utilisateur
            </div>
          </div>
        </header>

        {/* Main Form */}
        <div style={styles.card}>
          {error && (
            <div style={styles.errorAlert}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {isRoleChanged && (
            <div style={styles.warningAlert}>
              <ShieldAlert size={24} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: '5px' }}>
                  ⚠️ Changement de rôle détecté
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  L'utilisateur sera supprimé et recréé avec le nouveau rôle. L'ID sera conservé.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              {/* Left Column */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <User size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Nom *
                  </label>
                  <input
                    name="nom"
                    placeholder="Ex: Dupont"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    style={styles.input}
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <User size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Prénom *
                  </label>
                  <input
                    name="prenom"
                    placeholder="Ex: Jean"
                    required
                    value={form.prenom}
                    onChange={handleChange}
                    style={styles.input}
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <Mail size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="utilisateur@exemple.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    style={styles.input}
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
              </div>

              {/* Right Column */}
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <Calendar size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    required
                    value={form.date_naissance}
                    onChange={handleChange}
                    style={styles.input}
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <Lock size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Nouveau mot de passe
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Laissez vide pour conserver l'actuel"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={styles.label}>
                    <Crown size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    Rôle *
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    style={{
                      ...styles.select,
                      borderColor: getRoleColor(form.role),
                      backgroundColor: `${getRoleColor(form.role)}15`,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getRoleColor(form.role);
                      e.target.style.backgroundColor = `${getRoleColor(form.role)}15`;
                    }}
                  >
                    <option value="LECTEUR">Lecteur</option>
                    <option value="BIBLIOTHECAIRE">Bibliothécaire</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role Information Card */}
            <div style={{
              ...styles.roleInfoCard,
              borderColor: getRoleColor(form.role),
              backgroundColor: `${getRoleColor(form.role)}10`,
            }}>
              <div style={{
                ...styles.roleIconContainer,
                backgroundColor: `${getRoleColor(form.role)}30`,
                color: getRoleColor(form.role),
              }}>
                {getRoleIcon(form.role)}
              </div>
              <div style={styles.roleContent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <div style={{ ...styles.roleTitle, color: getRoleColor(form.role) }}>
                    {form.role === "ADMIN" ? "Administrateur" : 
                     form.role === "BIBLIOTHECAIRE" ? "Bibliothécaire" : "Lecteur"}
                  </div>
                  {isRoleChanged && (
                    <span style={{
                      fontSize: '0.8rem',
                      backgroundColor: '#FFD16630',
                      color: '#FFD166',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}>
                      Changement
                    </span>
                  )}
                </div>
                <div style={styles.roleDescription}>
                  {getRoleDescription(form.role)}
                </div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                  e.currentTarget.style.borderColor = '#FFFBF5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                }}
              >
                <ArrowLeft size={20} />
                Annuler
              </button>
              <button
                type="submit"
                style={styles.submitButton}
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
                <Save size={20} />
                Enregistrer les modifications
              </button>
            </div>
          </form>

          <div style={styles.infoBox}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.9rem' }}>
              <strong>Information importante :</strong> Le mot de passe n'est obligatoire que pour un changement. 
              Si vous changez le rôle de l'utilisateur, celui-ci sera supprimé puis recréé avec le nouveau rôle.
              L'identifiant de l'utilisateur sera conservé pendant cette opération.
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
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
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
          }
          
          option {
            background-color: #281C16;
            color: #FFFBF5;
            padding: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default EditUser;