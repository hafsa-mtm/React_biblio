import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  change,
  changeType = 'neutral',
  description,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#FF6B6B';
      default: return '#9C5149';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 251, 245, 0.08)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '25px',
      border: `2px solid ${color}40`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = `0 15px 40px ${color}20`;
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = `${color}40`;
    }}
    >
      {/* Background glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 80%, ${color}15 0%, transparent 50%)`,
        opacity: 0.5,
        zIndex: 0,
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{
              fontSize: '0.9rem',
              color: 'rgba(255, 251, 245, 0.7)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              {title}
            </div>
            {description && (
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 251, 245, 0.5)',
                marginTop: '5px',
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
              }}>
                {description}
              </div>
            )}
          </div>
          
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: `${color}20`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${color}40`,
            fontSize: '1.8rem',
          }}>
            {icon}
          </div>
        </div>

        {/* Value */}
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#FFFBF5',
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1,
          marginBottom: '15px',
        }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        {/* Change indicator */}
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: `${getChangeColor()}15`,
            borderRadius: '8px',
            border: `1px solid ${getChangeColor()}30`,
            width: 'fit-content',
          }}>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: getChangeColor(),
            }}>
              {getChangeIcon()} {change}
            </span>
            <span style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 251, 245, 0.6)',
              fontFamily: "'Cormorant Garamond', serif",
            }}>
              vs last month
            </span>
          </div>
        )}

        {/* Decorative line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '25px',
          right: '25px',
          height: '4px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
          borderRadius: '2px',
        }} />
      </div>
    </div>
  );
};

export default StatCard;