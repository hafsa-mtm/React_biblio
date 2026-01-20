import React, { useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, CheckCircle, XCircle, Info, User, Mail, Lock, Calendar, Crown, Book, UserCheck, AlertCircle } from "lucide-react";

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
    role: "LECTEUR" as "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string): { isValid: boolean; error: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return {
        isValid: false,
        error: "L'email est requis"
      };
    }
    
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: "Format d'email invalide (ex: utilisateur@example.com)"
      };
    }
    
    return {
      isValid: true,
      error: ""
    };
  };

  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (!password) {
      return {
        isValid: false,
        error: "Le mot de passe est requis"
      };
    }
    
    if (password.length < 8) {
      return {
        isValid: false,
        error: "Le mot de passe doit contenir au moins 8 caractères"
      };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        error: "Doit contenir au moins une majuscule, une minuscule et un chiffre"
      };
    }
    
    return {
      isValid: true,
      error: ""
    };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: name === "role" ? (value as "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR") : value,
    }));

    // Validate email in real-time
    if (name === "email") {
      const validation = validateEmail(value);
      setEmailValid(validation.isValid);
      setEmailError(validation.error);
    }

    // Validate password in real-time
    if (name === "password") {
      const validation = validatePassword(value);
      setPasswordError(validation.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final validation
    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);
    
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      setLoading(false);
      return;
    }
    
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error);
      setLoading(false);
      return;
    }

    // Check if all required fields are filled
    if (!form.nom.trim() || !form.prenom.trim() || !form.date_naissance) {
      setError("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    try {
      console.log("Creating user with data:", form);
      
      // Prepare the data
      const userData = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        password: form.password,
        date_naissance: form.date_naissance,
        role: form.role,
      };

      await AdminAPI.createUser(userData);
      
      // Show success message and navigate
      alert("Utilisateur créé avec succès !");
      navigate("/admin/users");
      
    } catch (err: any) {
      console.error("Error creating user:", err);
      
      let errorMessage = "Erreur lors de la création de l'utilisateur";
      
      if (err.response) {
        console.error("Response error:", err.response.data);
        
        if (err.response.status === 409) {
          errorMessage = "Un utilisateur avec cet email existe déjà";
        } else if (err.response.status === 400) {
          errorMessage = "Données invalides. Vérifiez les informations saisies.";
          
          // Try to get specific error message from response
          if (err.response.data && typeof err.response.data === 'object') {
            const serverError = Object.values(err.response.data).join(', ');
            if (serverError) errorMessage = serverError;
          } else if (err.response.data) {
            errorMessage = err.response.data;
          }
        } else if (err.response.status === 401) {
          errorMessage = "Vous n'êtes pas autorisé à effectuer cette action";
        } else if (err.response.status === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    infoBox: {
      padding: '20px',
      backgroundColor: 'rgba(255, 209, 102, 0.1)',
      border: '2px solid rgba(255, 209, 102, 0.3)',
      borderRadius: '12px',
      color: '#FFD166',
      marginTop: '25px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.gradientOverlay} />
      </div>

      <div style={styles.content}>
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
              Créer un Nouvel Utilisateur
            </div>
          </div>
        </header>

        <div style={styles.card}>
          {error && (
            <div style={styles.errorAlert}>
              <AlertCircle size={24} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: '5px' }}>
                  Erreur de création
                </div>
                <div style={{ fontSize: '0.9rem' }}>{error}</div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={styles.label}>
                      <Mail size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                      Email *
                    </label>
                    {form.email && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: emailValid ? '#4CAF50' : '#FF6B6B',
                        fontWeight: 600,
                      }}>
                        {emailValid ? '✓ Valide' : '✗ Invalide'}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="email"
                      type="email"
                      placeholder="utilisateur@exemple.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        paddingRight: '50px',
                        borderColor: emailError && !emailValid ? '#FF6B6B' : 
                                   emailValid ? '#4CAF50' : 'rgba(255, 251, 245, 0.3)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#FFD166';
                        e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                      }}
                      onBlur={(e) => {
                        if (!emailError && !emailValid) {
                          e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                        }
                        e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}>
                      {emailValid ? (
                        <CheckCircle size={20} color="#4CAF50" />
                      ) : emailError ? (
                        <XCircle size={20} color="#FF6B6B" />
                      ) : null}
                    </div>
                  </div>
                  {emailError && (
                    <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginTop: '5px', marginBottom: 0 }}>
                      {emailError}
                    </p>
                  )}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={styles.label}>
                      <Lock size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                      Mot de passe *
                    </label>
                    {form.password && (
                      <span style={{
                        fontSize: '0.8rem',
                        color: passwordError ? '#FF6B6B' : '#4CAF50',
                        fontWeight: 600,
                      }}>
                        {passwordError ? '✗ Faible' : '✓ Fort'}
                      </span>
                    )}
                  </div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Au moins 8 caractères"
                    required
                    value={form.password}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      paddingRight: '50px',
                      borderColor: passwordError ? '#FF6B6B' : 
                                 form.password && !passwordError ? '#4CAF50' : 'rgba(255, 251, 245, 0.3)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                    }}
                    onBlur={(e) => {
                      if (!passwordError) {
                        e.target.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                      }
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    }}
                  />
                  {passwordError && (
                    <p style={{ color: '#FF6B6B', fontSize: '0.9rem', marginTop: '5px', marginBottom: 0 }}>
                      {passwordError}
                    </p>
                  )}
                  {!passwordError && form.password && (
                    <p style={{ color: '#4CAF50', fontSize: '0.9rem', marginTop: '5px', marginBottom: 0 }}>
                      ✓ Mot de passe valide
                    </p>
                  )}
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
                <div style={{ ...styles.roleTitle, color: getRoleColor(form.role) }}>
                  {form.role === "ADMIN" ? "Administrateur" : 
                   form.role === "BIBLIOTHECAIRE" ? "Bibliothécaire" : "Lecteur"}
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
                disabled={loading || !emailValid || !!passwordError || !form.nom.trim() || !form.prenom.trim() || !form.date_naissance}
                style={{
                  ...styles.submitButton,
                  opacity: loading || !emailValid || !!passwordError || !form.nom.trim() || !form.prenom.trim() || !form.date_naissance ? 0.6 : 1,
                  cursor: loading || !emailValid || !!passwordError || !form.nom.trim() || !form.prenom.trim() || !form.date_naissance ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!loading && emailValid && !passwordError && form.nom.trim() && form.prenom.trim() && form.date_naissance) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FFD166';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 209, 102, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && emailValid && !passwordError && form.nom.trim() && form.prenom.trim() && form.date_naissance) {
                    e.currentTarget.style.backgroundColor = '#FFD166';
                    e.currentTarget.style.color = '#3C2F2F';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #3C2F2F',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Créer l'utilisateur
                  </>
                )}
              </button>
            </div>
          </form>

          <div style={styles.infoBox}>
            <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.95rem' }}>
              <strong>Information importante :</strong> Tous les champs marqués d'un astérisque (*) sont obligatoires.
              Le mot de passe doit contenir au moins 8 caractères avec une majuscule, une minuscule et un chiffre.
              Le rôle détermine les permissions de l'utilisateur dans le système.
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

export default CreateUser;