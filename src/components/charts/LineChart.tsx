import React, { useState, useEffect } from 'react';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  width?: number;
  color?: string;
  showPoints?: boolean;
  fillArea?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  width = 600,
  color = '#FF9B54',
  showPoints = true,
  fillArea = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatedPath, setAnimatedPath] = useState('');
  
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const valueRange = maxValue - minValue;
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const xStep = chartWidth / (data.length - 1);
  
  // Generate points
  const points = data.map((item, index) => {
    const x = padding + index * xStep;
    const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight;
    return { x, y, value: item.value };
  });
  
  // Generate SVG path
  useEffect(() => {
    const path = points.map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');
    setAnimatedPath(path);
  }, [points]);

  // Generate area path
  const areaPath = points.length > 0 
    ? `${animatedPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

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
        background: 'linear-gradient(135deg, transparent 30%, rgba(255, 155, 84, 0.03) 50%, transparent 70%)',
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
        width: '100%',
        overflow: 'hidden',
      }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((percent, index) => {
            const y = height - padding - (percent * chartHeight);
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255, 251, 245, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="rgba(255, 251, 245, 0.5)"
                  fontSize="12"
                  fontFamily="'Cormorant Garamond', serif"
                >
                  {Math.round(minValue + percent * valueRange)}
                </text>
              </g>
            );
          })}
          
          {/* Area fill */}
          {fillArea && areaPath && (
            <path
              d={areaPath}
              fill={`${color}20`}
              stroke="none"
            />
          )}
          
          {/* Line */}
          <path
            d={animatedPath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: 'drawLine 2s ease forwards',
              filter: 'url(#glow)',
            }}
          />
          
          {/* Points */}
          {showPoints && points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === index ? "6" : "4"}
                fill={hoveredIndex === index ? "#FFFBF5" : color}
                stroke={color}
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* X-axis labels */}
              <text
                x={point.x}
                y={height - padding + 20}
                textAnchor="middle"
                fill="rgba(255, 251, 245, 0.7)"
                fontSize="11"
                fontFamily="'Cormorant Garamond', serif"
              >
                {data[index].label}
              </text>
            </g>
          ))}
          
          {/* Hover tooltip */}
          {hoveredIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={points[hoveredIndex].x}
                y1={padding}
                x2={points[hoveredIndex].x}
                y2={height - padding}
                stroke="rgba(255, 251, 245, 0.3)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              
              {/* Tooltip */}
              <foreignObject
                x={points[hoveredIndex].x - 60}
                y={points[hoveredIndex].y - 80}
                width="120"
                height="70"
              >
                <div style={{
                  backgroundColor: 'rgba(40, 28, 22, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${color}`,
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center',
                  color: '#FFFBF5',
                  fontSize: '0.9rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '5px' }}>
                    {data[hoveredIndex].label}
                  </div>
                  <div style={{
                    color: color,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1,
                  }}>
                    {points[hoveredIndex].value}
                  </div>
                </div>
              </foreignObject>
            </g>
          )}
          
          {/* Glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      
      {/* Stats Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 251, 245, 0.1)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'rgba(255, 251, 245, 0.7)',
            fontSize: '0.9rem',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Min
          </div>
          <div style={{
            color: color,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
          }}>
            {minValue}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'rgba(255, 251, 245, 0.7)',
            fontSize: '0.9rem',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Max
          </div>
          <div style={{
            color: color,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
          }}>
            {maxValue}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'rgba(255, 251, 245, 0.7)',
            fontSize: '0.9rem',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Avg
          </div>
          <div style={{
            color: color,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
          }}>
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: 'rgba(255, 251, 245, 0.7)',
            fontSize: '0.9rem',
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            Total
          </div>
          <div style={{
            color: color,
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
          }}>
            {data.reduce((sum, item) => sum + item.value, 0)}
          </div>
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
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes drawLine {
            from {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dasharray: 1000;
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LineChart;