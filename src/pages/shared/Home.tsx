import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Feature Card Component - Keep exactly the same
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  color, 
  delay,
  link 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  color: string; 
  delay: number;
  link: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.gap = '15px';
  };
  
  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.gap = '10px';
  };

  return (
    <div
      style={{
        padding: '45px 35px',
        backgroundColor: 'rgba(255, 251, 245, 0.12)',
        backdropFilter: 'blur(15px)',
        border: `2px solid ${color}40`,
        borderRadius: '18px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        animation: 'slideInRight 0.6s ease forwards',
        animationDelay: `${delay}s`,
        transform: isHovered ? 'translateX(15px) scale(1.02)' : 'none',
        boxShadow: isHovered ? '0 30px 60px rgba(0, 0, 0, 0.25)' : '0 15px 40px rgba(0, 0, 0, 0.15)',
        borderColor: isHovered ? `${color}80` : `${color}40`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: isHovered ? '100%' : '-100%',
        width: '100%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
        transition: 'left 0.6s ease',
      }} />
      
      {/* Number Badge */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '25px',
        fontSize: '5rem',
        fontWeight: 800,
        color: `${color}15`,
        fontFamily: "'Playfair Display', serif",
        lineHeight: 1,
        zIndex: 1,
      }}>
        {delay === 0.5 ? 'I' : delay === 0.7 ? 'II' : 'III'}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        marginBottom: '25px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          fontSize: '3.2rem',
          opacity: 0.9,
          color: color,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
          filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
        }}>
          {icon}
        </div>
        <h3 style={{
          fontSize: '1.9rem',
          fontWeight: 700,
          color: color,
          fontFamily: "'Playfair Display', serif",
          margin: 0,
          letterSpacing: '0.5px',
        }}>
          {title}
        </h3>
      </div>
      
      <p style={{
        fontSize: '1.25rem',
        lineHeight: 1.8,
        color: 'rgba(255, 251, 245, 0.95)',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        margin: 0,
        paddingLeft: '25px',
        borderLeft: `3px solid ${color}40`,
        position: 'relative',
        zIndex: 2,
      }}>
        {description}
      </p>
      
      <div style={{
        marginTop: '35px',
        paddingTop: '25px',
        borderTop: `1px solid ${color}30`,
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'relative',
        zIndex: 2,
      }}>
        <Link
          to={link}
          style={{
            color: color,
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Cormorant Garamond', serif",
            transition: 'all 0.3s ease',
            letterSpacing: '1.2px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 251, 245, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${color}40`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.gap = '15px';
            e.currentTarget.style.backgroundColor = `${color}20`;
            e.currentTarget.style.transform = 'translateX(5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.gap = '10px';
            e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.1)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          Explore Collection
          <span style={{
            fontSize: '1.3rem',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateX(5px)' : 'none',
          }}>→</span>
        </Link>
      </div>
    </div>
  );
};

// Main Home Component - Updated Background Visibility
const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const featureSections = [
    {
      icon: '📜',
      title: 'Rare Manuscripts',
      description: 'Access exclusive collections of historical documents and first editions dating back to the 15th century.',
      color: '#FFD166',
      delay: 0.5,
      link: '/rare-manuscripts'
    },
    {
      icon: '🏛️',
      title: 'Digital Archives',
      description: 'Explore our fully digitized collections with advanced search capabilities and preservation tools.',
      color: '#FF9B54',
      delay: 0.7,
      link: '/digital-archives'
    },
    {
      icon: '👑',
      title: 'Member Privileges',
      description: 'Enjoy premium access to restricted collections, research assistance, and exclusive events.',
      color: '#FF6B6B',
      delay: 0.9,
      link: '/member-privileges'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: "'Cormorant Garamond', serif",
      color: '#3C2F2F',
      overflow: 'hidden',
    }}>
      
      {/* Enhanced Background with MORE VISIBLE Image */}
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
        filter: 'brightness(0.9)',
      }}>
        {/* Lighter Gradient Overlay - REDUCED OPACITY FOR MORE VISIBILITY */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(156, 81, 73, 0.75) 0%, rgba(196, 164, 132, 0.85) 100%)', // Changed from 0.92/0.95 to 0.75/0.85
          zIndex: 1,
        }} />
        
        {/* More Visible Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
          backgroundSize: '400px',
          opacity: 0.05, // Increased from 0.03
          mixBlendMode: 'overlay',
          zIndex: 2,
        }} />
      </div>

      {/* Enhanced Animated Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {[...Array(25)].map((_, i) => (
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

      {/* Main Content Container - ADJUSTED OPACITIES FOR BETTER CONTRAST */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '70px 50px',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        
        {/* Professional Header - DARKER BORDER FOR CONTRAST */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '100px',
          paddingBottom: '25px',
          borderBottom: '2px solid rgba(255, 251, 245, 0.4)', // Increased from 0.25
          animation: isLoaded ? 'slideDown 0.8s ease 0.2s both' : 'none',
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
              fontSize: '2.8rem',
              fontWeight: 800,
              letterSpacing: '4px',
              color: '#FFFBF5',
              fontFamily: "'Playfair Display', serif",
              textTransform: 'uppercase',
              position: 'relative',
              padding: '0 20px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Added shadow for better visibility
            }}>
              ATHENAEUM
              <div style={{
                position: 'absolute',
                bottom: '-15px',
                left: '20px',
                width: 'calc(100% - 40px)',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #FFD166, transparent)',
              }} />
            </div>
          </div>
          
          <nav style={{
            display: 'flex',
            gap: '45px',
            alignItems: 'center',
          }}>
            {['CATALOG', 'ABOUT', 'CONTACT', 'MEMBERS'].map((item, index) => {
              const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget;
                target.style.color = '#FFD166';
                target.style.letterSpacing = '3px';
                const span = target.querySelector('span');
                if (span) {
                  span.style.width = '100%';
                }
              };
              
              const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget;
                target.style.color = '#FFFBF5';
                target.style.letterSpacing = '2px';
                const span = target.querySelector('span');
                if (span) {
                  span.style.width = '0%';
                }
              };
              
              return (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  style={{
                    color: '#FFFBF5',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    letterSpacing: '2px',
                    fontWeight: 600,
                    position: 'relative',
                    padding: '12px 0',
                    fontFamily: "'Cormorant Garamond', serif",
                    transition: 'all 0.3s ease',
                    opacity: 0,
                    animation: isLoaded ? `fadeIn 0.5s ease ${0.3 + index * 0.1}s forwards` : 'none',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Added shadow
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {item}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '0%',
                    height: '2px',
                    backgroundColor: '#FFD166',
                    transition: 'width 0.3s ease',
                    boxShadow: '0 0 10px #FFD166',
                  }} />
                </Link>
              );
            })}
            
            <Link
              to="/login"
              style={{
                padding: '15px 35px',
                backgroundColor: 'rgba(255, 251, 245, 0.15)', // Increased from 0.12
                color: '#FFFBF5',
                border: '2px solid rgba(255, 251, 245, 0.5)', // Increased from 0.4
                borderRadius: '10px',
                fontSize: '1rem',
                letterSpacing: '2px',
                textDecoration: 'none',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                transition: 'all 0.3s ease',
                marginLeft: '30px',
                opacity: 0,
                animation: isLoaded ? 'fadeIn 0.5s ease 0.7s forwards' : 'none',
                backdropFilter: 'blur(10px)',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Added shadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFBF5';
                e.currentTarget.style.color = '#9C5149';
                e.currentTarget.style.borderColor = '#FFFBF5';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 251, 245, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.15)';
                e.currentTarget.style.color = '#FFFBF5';
                e.currentTarget.style.borderColor = 'rgba(255, 251, 245, 0.5)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              LOGIN
            </Link>
          </nav>
        </header>

        {/* Enhanced Hero Section - ADJUSTED BACKGROUND OPACITIES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '80px',
          marginBottom: '100px',
          flex: 1,
          alignItems: 'start',
        }}>
          
          {/* Enhanced Title Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            opacity: 0,
            animation: isLoaded ? 'slideInLeft 0.8s ease 0.4s forwards' : 'none',
          }}>
            {/* Pre-Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px',
              opacity: 0,
              animation: isLoaded ? 'fadeIn 0.5s ease 0.5s forwards' : 'none',
            }}>
              <div style={{
                width: '50px',
                height: '2px',
                backgroundColor: '#FFD166',
                boxShadow: '0 0 8px #FFD166',
              }} />
              <span style={{
                fontSize: '1.1rem',
                letterSpacing: '3px',
                color: 'rgba(255, 251, 245, 0.85)', // Increased from 0.7
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                textTransform: 'uppercase',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              }}>
                Digital Library
              </span>
            </div>
            
            {/* Main Title */}
            <h1 style={{
              fontSize: 'clamp(4rem, 6vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#FFFBF5',
              marginBottom: '30px',
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.05,
              textShadow: '4px 4px 15px rgba(0, 0, 0, 0.5)', // Enhanced shadow
              position: 'relative',
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #FFFBF5 0%, #FFD166 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              }}>
                Online Library
              </span>
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: 0,
                width: '150px',
                height: '6px',
                background: 'linear-gradient(90deg, #FFD166, #FF9B54, #FF6B6B)',
                borderRadius: '3px',
                animation: isLoaded ? 'widthGrow 1.2s ease 0.8s forwards' : 'none',
                transformOrigin: 'left',
                transform: 'scaleX(0)',
                boxShadow: '0 4px 15px rgba(255, 209, 102, 0.4)', // Enhanced shadow
              }} />
            </h1>
            
            {/* Enhanced Description - REDUCED BACKGROUND OPACITY */}
            <div style={{
              marginTop: '60px',
              padding: '45px',
              backgroundColor: 'rgba(255, 251, 245, 0.15)', // Reduced from 0.1
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 251, 245, 0.25)', // Increased from 0.15
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
              opacity: 0,
              animation: isLoaded ? 'fadeInUp 0.6s ease 1s forwards' : 'none',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '25px',
                marginBottom: '30px',
              }}>
                <div style={{
                  fontSize: '3.5rem',
                  color: '#FFD166',
                  opacity: 0.9,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}>
                  "
                </div>
                <p style={{
                  fontSize: 'clamp(1.3rem, 1.6vw, 1.6rem)',
                  lineHeight: 1.9,
                  color: 'rgba(255, 251, 245, 0.98)', // Increased from 0.95
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontStyle: 'italic',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)', // Enhanced shadow
                  margin: 0,
                }}>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exercitation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '30px',
                paddingTop: '25px',
                borderTop: '1px solid rgba(255, 251, 245, 0.2)', // Increased from 0.1
              }}>
                <span style={{
                  fontSize: '1.1rem',
                  color: '#FF9B54',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}>
                  — The Library Collection
                </span>
              </div>
            </div>
            
            {/* Enhanced Stats Section - ADJUSTED FOR BETTER VISIBILITY */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px',
              marginTop: '60px',
            }}>
              {[
                { number: '25,847+', label: 'Digital Books', color: '#FFD166', suffix: 'Volumes' },
                { number: '1,843', label: 'Rare Manuscripts', color: '#FF9B54', suffix: 'Documents' },
                { number: '1847', label: 'Established', color: '#FF6B6B', suffix: 'Years of Excellence' },
              ].map((stat, index) => (
                <div 
                  key={index}
                  style={{
                    textAlign: 'center',
                    padding: '30px 25px',
                    backgroundColor: 'rgba(255, 251, 245, 0.12)', // Increased from 0.08
                    backdropFilter: 'blur(15px)',
                    borderRadius: '16px',
                    border: `2px solid ${stat.color}40`, // Increased opacity
                    opacity: 0,
                    animation: isLoaded ? `fadeInUp 0.5s ease ${1.2 + index * 0.2}s forwards` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}30`; // Enhanced shadow
                    e.currentTarget.style.borderColor = `${stat.color}80`; // More visible on hover
                    e.currentTarget.style.backgroundColor = `rgba(255, 251, 245, 0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = `${stat.color}40`;
                    e.currentTarget.style.backgroundColor = 'rgba(255, 251, 245, 0.12)';
                  }}
                >
                  <div style={{
                    fontSize: '2.8rem',
                    fontWeight: 800,
                    color: stat.color,
                    marginBottom: '10px',
                    fontFamily: "'Playfair Display', serif",
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)', // Enhanced shadow
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 251, 245, 0.95)', // Increased from 0.9
                    fontWeight: 600,
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: '1.5px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 251, 245, 0.8)', // Increased from 0.6
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  }}>
                    {stat.suffix}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Feature Cards Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '35px',
            justifyContent: 'center',
          }}>
            <div style={{
              marginBottom: '40px',
              textAlign: 'center',
              opacity: 0,
              animation: isLoaded ? 'fadeIn 0.5s ease 0.6s forwards' : 'none',
            }}>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: 700,
                color: '#FFFBF5',
                fontFamily: "'Playfair Display', serif",
                marginBottom: '15px',
                letterSpacing: '1px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}>
                Our Collections
              </h2>
              <div style={{
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #FFD166, transparent)',
                margin: '0 auto',
                boxShadow: '0 0 10px rgba(255, 209, 102, 0.3)',
              }} />
            </div>
            
            {featureSections.map((section, index) => (
              <FeatureCard
                key={index}
                icon={section.icon}
                title={section.title}
                description={section.description}
                color={section.color}
                delay={section.delay}
                link={section.link}
              />
            ))}
          </div>
        </div>

        {/* Premium Call to Action - KEEP SAME */}
        <div style={{
          backgroundColor: 'rgba(255, 251, 245, 0.98)',
          borderRadius: '28px',
          padding: '90px 70px',
          marginTop: '60px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.25)',
          opacity: 0,
          animation: isLoaded ? 'fadeInUp 0.8s ease 1.5s forwards' : 'none',
          border: '2px solid rgba(255, 209, 102, 0.4)',
        }}>
          {/* Animated Border */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '28px',
            padding: '3px',
            background: 'linear-gradient(90deg, #FFD166, #FF9B54, #FF6B6B, #FF9B54, #FFD166)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'borderRotate 4s linear infinite',
            backgroundSize: '300% 100%',
          }} />
          
          <div style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '850px',
            margin: '0 auto',
          }}>
            <div style={{
              fontSize: '1.3rem',
              letterSpacing: '4px',
              color: '#9C5149',
              marginBottom: '25px',
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              textTransform: 'uppercase',
              opacity: 0.8,
            }}>
              Ready to Begin
            </div>
            
            <h2 style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: '#3C2F2F',
              marginBottom: '35px',
              fontFamily: "'Playfair Display', serif",
              lineHeight: 1.1,
            }}>
              Start Your Literary Journey
            </h2>
            
            <p style={{
              fontSize: '1.5rem',
              color: '#5D4A3F',
              marginBottom: '70px',
              fontFamily: "'Cormorant Garamond', serif",
              lineHeight: 1.8,
              maxWidth: '700px',
              margin: '0 auto 70px',
              fontWeight: 400,
            }}>
              Join thousands of scholars, researchers, and bibliophiles in exploring the world's most comprehensive digital collection of literature and historical documents.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '35px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
              <Link
                to="/login"
                style={{
                  padding: '22px 55px',
                  backgroundColor: '#9C5149',
                  color: '#FFFBF5',
                  border: '3px solid #9C5149',
                  borderRadius: '14px',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease',
                  minWidth: '260px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9C5149';
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(156, 81, 73, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#9C5149';
                  e.currentTarget.style.color = '#FFFBF5';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                }}>
                  Member Login
                </span>
              </Link>
              
              <Link
                to="/catalog"
                style={{
                  padding: '22px 55px',
                  backgroundColor: 'transparent',
                  color: '#9C5149',
                  border: '3px solid #9C5149',
                  borderRadius: '14px',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease',
                  minWidth: '260px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9C5149';
                  e.currentTarget.style.color = '#FFFBF5';
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(156, 81, 73, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9C5149';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                }}>
                  Browse Collection
                </span>
              </Link>
            </div>
            
            <div style={{
              marginTop: '70px',
              color: '#7A5C4D',
              fontSize: '1.1rem',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              letterSpacing: '1.5px',
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
            }}>
              <span>Free 30-Day Trial</span>
              <span style={{ color: '#FF9B54' }}>•</span>
              <span>24/7 Digital Access</span>
              <span style={{ color: '#FF9B54' }}>•</span>
              <span>Global Academic Network</span>
            </div>
          </div>
        </div>

        {/* Premium Footer - ADJUSTED FOR BETTER VISIBILITY */}
        <footer style={{
          marginTop: '100px',
          padding: '40px',
          backgroundColor: 'rgba(255, 251, 245, 0.18)', // Increased from 0.12
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 251, 245, 0.3)', // Increased from 0.2
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.1rem',
          color: 'rgba(255, 251, 245, 0.98)', // Increased from 0.95
          fontFamily: "'Cormorant Garamond', serif",
          opacity: 0,
          animation: isLoaded ? 'fadeIn 0.8s ease 1.8s forwards' : 'none',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)', // Enhanced shadow
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: '#FFD166',
              borderRadius: '4px',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 15px rgba(255, 209, 102, 0.4)', // Enhanced shadow
            }} />
            © {new Date().getFullYear()} The Athenaeum Digital Library • All Rights Reserved
          </div>
          <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
            <span style={{ fontStyle: 'italic', color: '#FFD166', fontWeight: 600, textShadow: '0 0 8px rgba(255, 209, 102, 0.3)' }}>
              Est. 1847
            </span>
            <span style={{ color: '#FF9B54', fontSize: '1.3rem', textShadow: '0 0 8px rgba(255, 155, 84, 0.3)' }}>•</span>
            <span>London • Istanbul • Marrakech • Madrid • Tokyo • New York</span>
          </div>
        </footer>
      </div>

      {/* Enhanced Animation Styles - KEEP SAME */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
          
          /* Enhanced Keyframes */
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
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
          
          @keyframes widthGrow {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
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
          
          /* Enhanced Custom Scrollbar */
          ::-webkit-scrollbar {
            width: 14px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(156, 81, 73, 0.15);
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #FFD166, #FF9B54, #FF6B6B);
            border-radius: 8px;
            border: 3px solid rgba(255, 251, 245, 0.2);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #FF9B54, #FF6B6B, #9C5149);
          }
          
          /* Enhanced Selection */
          ::selection {
            background: rgba(255, 209, 102, 0.4);
            color: #3C2F2F;
            text-shadow: none;
          }
          
          /* Smooth Scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Cursor */
          * {
            cursor: default;
          }
          
          a, button {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Home;