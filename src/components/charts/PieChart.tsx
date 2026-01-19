import React, { useState, useEffect } from 'react';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 250,
  showLegend = true,
  showPercentages = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentages = data.map(item => (item.value / total) * 100);
  
  // Animation effect
  useEffect(() => {
    const animationDuration = 1500;
    const startTime = Date.now();
    const startValues = Array(data.length).fill(0);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      const newValues = data.map(item => item.value * easedProgress);
      setAnimatedValues(newValues);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [data]);

  // Generate pie slices
  const generateSlices = () => {
    let cumulativeAngle = 0;
    const radius = size / 2;
    const strokeWidth = 30;
    const innerRadius = radius - strokeWidth;

    return data.map((item, index) => {
      const percentage = percentages[index];
      const angle = (percentage / 100) * 360;
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Convert angles to radians
      const startAngleRad = (cumulativeAngle * Math.PI) / 180;
      const endAngleRad = ((cumulativeAngle + angle) * Math.PI) / 180;
      
      // Calculate start and end points
      const x1 = radius + radius * Math.cos(startAngleRad - Math.PI / 2);
      const y1 = radius + radius * Math.sin(startAngleRad - Math.PI / 2);
      const x2 = radius + radius * Math.cos(endAngleRad - Math.PI / 2);
      const y2 = radius + radius * Math.sin(endAngleRad - Math.PI / 2);
      
      // Calculate inner circle points
      const x1Inner = radius + innerRadius * Math.cos(startAngleRad - Math.PI / 2);
      const y1Inner = radius + innerRadius * Math.sin(startAngleRad - Math.PI / 2);
      const x2Inner = radius + innerRadius * Math.cos(endAngleRad - Math.PI / 2);
      const y2Inner = radius + innerRadius * Math.sin(endAngleRad - Math.PI / 2);
      
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x2Inner} ${y2Inner}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
        'Z',
      ].join(' ');
      
      cumulativeAngle += angle;
      
      return (
        <g key={index}>
          <path
            d={pathData}
            fill={item.color}
            stroke={hoveredIndex === index ? '#FFFBF5' : 'transparent'}
            strokeWidth="3"
            strokeOpacity="0.8"
            filter={hoveredIndex === index ? 'url(#shadow)' : 'none'}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
              transformOrigin: 'center',
            }}
          />
          {showPercentages && percentage > 5 && (
            <text
              x={radius + (radius * 0.7) * Math.cos((cumulativeAngle - angle / 2) * Math.PI / 180 - Math.PI / 2)}
              y={radius + (radius * 0.7) * Math.sin((cumulativeAngle - angle / 2) * Math.PI / 180 - Math.PI / 2)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFBF5"
              fontSize="12"
              fontWeight="600"
              fontFamily="'Cormorant Garamond', serif"
              style={{
                pointerEvents: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {percentage.toFixed(1)}%
            </text>
          )}
        </g>
      );
    });
  };

  // Calculate center text position
  const centerX = size / 2;
  const centerY = size / 2;

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
      {/* Animated Background Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 209, 102, 0.05) 50%, transparent 70%)',
        backgroundSize: '200% 200%',
        animation: 'shine 3s infinite linear',
      }} />
      
      {title && (
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          color: '#FFFBF5',
          marginBottom: '25px',
          fontFamily: "'Playfair Display', serif",
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {title}
        </h3>
      )}
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '30px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Pie Chart SVG */}
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FFD166" floodOpacity="0.6" />
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Outer glow circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={size / 2 - 5}
              fill="transparent"
              stroke="rgba(255, 209, 102, 0.1)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Pie slices */}
            {generateSlices()}
            
            {/* Center circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={size / 2 - 40}
              fill="rgba(40, 28, 22, 0.8)"
              stroke="rgba(255, 251, 245, 0.2)"
              strokeWidth="1"
            />
            
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFD166"
              fontSize="24"
              fontWeight="700"
              fontFamily="'Playfair Display', serif"
            >
              {total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 20}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255, 251, 245, 0.7)"
              fontSize="14"
              fontWeight="500"
              fontFamily="'Cormorant Garamond', serif"
            >
              Total Users
            </text>
          </svg>
          
          {/* Hover Tooltip */}
          {hoveredIndex !== null && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(40, 28, 22, 0.95)',
              backdropFilter: 'blur(10px)',
              border: `2px solid ${data[hoveredIndex].color}`,
              borderRadius: '12px',
              padding: '15px',
              minWidth: '120px',
              textAlign: 'center',
              zIndex: 10,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: data[hoveredIndex].color,
                  borderRadius: '3px',
                }} />
                <div style={{
                  color: '#FFFBF5',
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                }}>
                  {data[hoveredIndex].label}
                </div>
              </div>
              <div style={{
                color: data[hoveredIndex].color,
                fontSize: '1.8rem',
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1,
              }}>
                {data[hoveredIndex].value.toLocaleString()}
              </div>
              <div style={{
                color: 'rgba(255, 251, 245, 0.7)',
                fontSize: '0.9rem',
                marginTop: '5px',
              }}>
                {percentages[hoveredIndex].toFixed(1)}% of total
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            maxWidth: '100%',
          }}>
            {data.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 15px',
                  backgroundColor: 'rgba(255, 251, 245, 0.05)',
                  borderRadius: '10px',
                  border: `2px solid ${hoveredIndex === index ? item.color : 'rgba(255, 251, 245, 0.1)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '140px',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: item.color,
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: hoveredIndex === index ? `0 0 10px ${item.color}` : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    color: '#FFFBF5',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '4px',
                  }}>
                    <span style={{
                      color: 'rgba(255, 251, 245, 0.7)',
                      fontSize: '0.85rem',
                    }}>
                      {item.value.toLocaleString()}
                    </span>
                    <span style={{
                      color: item.color,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}>
                      {percentages[index].toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
              transform: translate(-50%, -50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          
          @keyframes sliceGrow {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PieChart;