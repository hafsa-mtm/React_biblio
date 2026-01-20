import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LecteurAPI } from "../../api/lecteur.api";
import { LecteurRegister } from "../../types/LecteurRegister";

const RegisterLecteur = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [form, setForm] = useState<LecteurRegister>({
    nom: "",
    prenom: "",
    date_naissance: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data: LecteurRegister = {
        nom: form.nom,
        prenom: form.prenom,
        date_naissance: form.date_naissance,
        email: form.email,
        password: form.password,
      };

      await LecteurAPI.register(data);

      // Success animation
      setTimeout(() => {
        alert("Inscription réussie. Vous pouvez vous connecter.");
        navigate("/login");
      }, 800);
    } catch (err: any) {
      const formElement = document.querySelector('form');
      formElement?.classList.add('shake');
      setTimeout(() => formElement?.classList.remove('shake'), 500);
      alert(err.response?.data?.error || "Erreur lors de l'inscription");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#3C2F2F',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      
      {/* Background - Same as home */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=90&ar=16:9)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
        transition: 'transform 0.1s linear',
        zIndex: 0,
        filter: 'brightness(0.85)',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(156, 81, 73, 0.85) 0%, rgba(196, 164, 132, 0.95) 100%)',
          zIndex: 1,
        }} />
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          backgroundSize: '400px',
          opacity: 0.05,
          mixBlendMode: 'overlay',
          zIndex: 2,
        }} />
      </div>

      {/* Animated Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              backgroundColor: `rgba(255, 251, 245, ${Math.random() * 0.4 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Back to Home Link */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '40px',
          left: '50px',
          color: '#FFFBF5',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 3,
          opacity: 0,
          animation: isLoaded ? 'fadeIn 0.5s ease 0.3s forwards' : 'none',
          padding: '12px 25px',
          backgroundColor: 'rgba(255, 251, 245, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          border: '2px solid rgba(255, 251, 245, 0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.25)';
          e.currentTarget.style.transform = 'translateX(-5px)';
          e.currentTarget.style.gap = '18px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.gap = '12px';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span>
        Back to Home
      </Link>

      {/* Main Register Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '520px',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: isLoaded ? 'fadeInUp 0.6s ease 0.2s both' : 'none',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '16px',
              height: '60px',
              background: 'linear-gradient(180deg, #FFD166, #FF9B54)',
              borderRadius: '8px',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 20px rgba(255, 209, 102, 0.4)',
            }} />
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
              margin: 0,
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            }}>
              ATHENAEUM
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '15px',
          }}>
            <div style={{
              width: '50px',
              height: '2px',
              backgroundColor: '#FFD166',
              borderRadius: '1px',
            }} />
            <span style={{
              fontSize: '1.2rem',
              letterSpacing: '3px',
              color: 'rgba(255, 251, 245, 0.9)',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              textTransform: 'uppercase',
            }}>
              New Member Registration
            </span>
            <div style={{
              width: '50px',
              height: '2px',
              backgroundColor: '#FFD166',
              borderRadius: '1px',
            }} />
          </div>
        </div>

        {/* Register Form */}
        <form 
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255, 251, 245, 0.15)',
            backdropFilter: 'blur(25px)',
            borderRadius: '24px',
            padding: '50px 45px',
            border: '2px solid rgba(255, 251, 245, 0.25)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: isLoaded ? 'fadeInUp 0.6s ease 0.4s both' : 'none',
          }}
        >
          {/* Animated Border Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '24px',
            padding: '3px',
            background: 'linear-gradient(90deg, #FFD166, #FF9B54, #FF6B6B, #FF9B54, #FFD166)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'borderRotate 6s linear infinite',
            backgroundSize: '300% 100%',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Form Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '35px',
            }}>
              <h2 style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#FFFBF5',
                fontFamily: "'Playfair Display', serif",
                marginBottom: '10px',
                letterSpacing: '1px',
              }}>
                Join Our Library
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 251, 245, 0.85)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                margin: 0,
              }}>
                Create your reader account and start your literary journey
              </p>
            </div>

            {/* Two Column Name Inputs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px',
            }}>
              {/* First Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '1.1rem',
                  color: '#FFFBF5',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  letterSpacing: '1px',
                }}>
                  First Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 45px 16px 20px',
                      backgroundColor: 'rgba(255, 251, 245, 0.1)',
                      border: '2px solid rgba(255, 251, 245, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      color: '#FFFBF5',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="John"
                  />
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                    color: 'rgba(255, 251, 245, 0.5)',
                  }}>
                    👤
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontSize: '1.1rem',
                  color: '#FFFBF5',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  letterSpacing: '1px',
                }}>
                  Last Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 45px 16px 20px',
                      backgroundColor: 'rgba(255, 251, 245, 0.1)',
                      border: '2px solid rgba(255, 251, 245, 0.2)',
                      borderRadius: '10px',
                      fontSize: '1.1rem',
                      color: '#FFFBF5',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                      e.target.style.borderColor = '#FFD166';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Doe"
                  />
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                    color: 'rgba(255, 251, 245, 0.5)',
                  }}>
                    📝
                  </div>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '1.1rem',
                color: '#FFFBF5',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: '1px',
              }}>
                Date of Birth
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 45px 16px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.1)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    color: '#FFFBF5',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.borderColor = '#FFD166';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: 'rgba(255, 251, 245, 0.5)',
                }}>
                  📅
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '1.1rem',
                color: '#FFFBF5',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: '1px',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 45px 16px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.1)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    color: '#FFFBF5',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.borderColor = '#FFD166';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="john.doe@example.com"
                />
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: 'rgba(255, 251, 245, 0.5)',
                }}>
                  ✉️
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '1.1rem',
                color: '#FFFBF5',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                letterSpacing: '1px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '16px 45px 16px 20px',
                    backgroundColor: 'rgba(255, 251, 245, 0.1)',
                    border: '2px solid rgba(255, 251, 245, 0.2)',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    color: '#FFFBF5',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.borderColor = '#FFD166';
                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 251, 245, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="••••••••"
                />
                <div style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  color: 'rgba(255, 251, 245, 0.5)',
                }}>
                  🔒
                </div>
              </div>
              <div style={{
                marginTop: '8px',
                fontSize: '0.9rem',
                color: 'rgba(255, 251, 245, 0.6)',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
              }}>
                Must be at least 8 characters long
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(135deg, #FFD166, #FF9B54)',
                color: '#3C2F2F',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 700,
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: isSubmitting ? 0.7 : 1,
                marginBottom: '30px',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 209, 102, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #FF9B54, #FFD166)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #FFD166, #FF9B54)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px',
                  }}>⟳</span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              margin: '30px 0',
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 251, 245, 0.3), transparent)',
              }} />
              <span style={{
                color: 'rgba(255, 251, 245, 0.6)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                fontStyle: 'italic',
              }}>
                Already have an account?
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 251, 245, 0.3), transparent)',
              }} />
            </div>

            {/* Login Link */}
            <div style={{ textAlign: 'center' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '16px 40px',
                  backgroundColor: 'transparent',
                  color: '#FFFBF5',
                  border: '2px solid rgba(255, 251, 245, 0.3)',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#FFD166';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Sign In Instead
              </Link>
            </div>

            {/* Terms Text */}
            <div style={{
              marginTop: '30px',
              textAlign: 'center',
            }}>
              <p style={{
                color: 'rgba(255, 251, 245, 0.6)',
                fontSize: '0.9rem',
                fontFamily: "'Cormorant Garamond', serif",
                margin: 0,
                lineHeight: 1.5,
              }}>
                By creating an account, you agree to our{' '}
                <Link
                  to="/terms"
                  style={{
                    color: '#FFD166',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  to="/privacy"
                  style={{
                    color: '#FFD166',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Copyright Footer */}
        <div style={{
          marginTop: '35px',
          textAlign: 'center',
          color: 'rgba(255, 251, 245, 0.6)',
          fontSize: '0.9rem',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          letterSpacing: '1px',
          animation: isLoaded ? 'fadeIn 0.5s ease 0.8s both' : 'none',
        }}>
          © {new Date().getFullYear()} The Athenaeum Digital Library
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
          
          /* Keyframes from home page */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
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
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(-30px) translateX(15px) rotate(90deg);
            }
            50% {
              transform: translateY(-60px) translateX(0) rotate(180deg);
            }
            75% {
              transform: translateY(-30px) translateX(-15px) rotate(270deg);
            }
            100% {
              transform: translateY(0) translateX(0) rotate(360deg);
            }
          }
          
          @keyframes borderRotate {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 300% 50%;
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Shake animation for error */
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .shake {
            animation: shake 0.5s ease-in-out;
          }
          
          /* Input placeholder styling */
          input::placeholder {
            color: rgba(255, 251, 245, 0.5);
            font-style: italic;
          }
          
          /* Date input styling */
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1) opacity(0.5);
            cursor: pointer;
          }
          
          /* Selection */
          ::selection {
            background: rgba(255, 209, 102, 0.4);
            color: #3C2F2F;
          }
        `}
      </style>
    </div>
  );
};

export default RegisterLecteur;