import React, { useState, useEffect } from 'react';

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  animate?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  showValues = true,
  animate = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>(Array(data.length).fill(0));
  
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = 40;
  const spacing = 20;
  //const chartWidth = (barWidth + spacing) * data.length + spacing;
  
  // Animation effect
  useEffect(() => {
    if (!animate) {
      setAnimatedValues(data.map(item => item.value));
      return;
    }
    
    const animationDuration = 1500;
    const startTime = Date.now();
    
    const animateBars = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      const newValues = data.map(item => item.value * easedProgress);
      setAnimatedValues(newValues);
      
      if (progress < 1) {
        requestAnimationFrame(animateBars);
      }
    };
    
    requestAnimationFrame(animateBars);
  }, [data, animate]);

  return (
    <div style={{
      backgroundColor: 'rgba(255, 251, 245, 0.08)',
      backdropFilter: 'blur(15px)',
      borderRadius: '18px',
      padding: '30px',
      border: '2px solid rgba(255, 251, 245, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, transparent 30%, rgba(255, 209, 102, 0.03) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
        animation: 'shine 3s infinite linear',
      }} />
      
      {title && (
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          color: '#FFFBF5',
          marginBottom: '30px',
          fontFamily: "'Playfair Display', serif",
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {title}
        </h3>
      )}
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: spacing,
        padding: `0 ${spacing}px`,
      }}>
        {data.map((item, index) => {
          const barHeight = (animatedValues[index] / maxValue) * (height - 60);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Bar */}
              <div style={{
                position: 'relative',
                width: barWidth,
                height: barHeight,
                backgroundColor: item.color,
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.3s ease',
                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredIndex === index 
                  ? `0 10px 30px ${item.color}40` 
                  : '0 5px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {/* Bar fill animation */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '0%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  animation: 'fillUp 1.5s ease forwards',
                  animationDelay: `${index * 0.1}s`,
                }} />
                
                {/* Value label on bar */}
                {showValues && barHeight > 30 && (
                  <div style={{
                    color: '#FFFBF5',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '5px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    {item.value}
                  </div>
                )}
              </div>
              
              {/* X-axis label */}
              <div style={{
                marginTop: '15px',
                color: '#FFFBF5',
                fontSize: '0.9rem',
                fontWeight: 500,
                fontFamily: "'Cormorant Garamond', serif",
                textAlign: 'center',
                maxWidth: barWidth + 20,
                lineHeight: 1.2,
              }}>
                {item.label}
              </div>
              
              {/* Hover Tooltip */}
              {hoveredIndex === index && (
                <div style={{
                  position: 'absolute',
                  bottom: barHeight + 60,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(40, 28, 22, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${item.color}`,
                  borderRadius: '10px',
                  padding: '12px 15px',
                  minWidth: '100px',
                  textAlign: 'center',
                  zIndex: 10,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <div style={{
                    color: '#FFFBF5',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginBottom: '5px',
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    color: item.color,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1,
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    color: 'rgba(255, 251, 245, 0.7)',
                    fontSize: '0.8rem',
                    marginTop: '3px',
                  }}>
                    {((item.value / maxValue) * 100).toFixed(1)}% of max
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Y-axis grid lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: spacing,
          right: spacing,
          bottom: 40,
          zIndex: -1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {[0, 0.25, 0.5, 0.75, 1].map((percent, index) => (
            <div
              key={index}
              style={{
                borderTop: '1px solid rgba(255, 251, 245, 0.1)',
                position: 'relative',
              }}
            >
              <span style={{
                position: 'absolute',
                left: -30,
                top: -8,
                color: 'rgba(255, 251, 245, 0.5)',
                fontSize: '0.8rem',
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                {Math.round(percent * maxValue)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Animation Styles */}
      <style>
        {`
          @keyframes shine {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
          
          @keyframes fillUp {
            from {
              height: 0%;
            }
            to {
              height: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BarChart;