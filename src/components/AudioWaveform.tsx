
import React, { useEffect, useRef, useState } from 'react';
import { WaveformProps } from '@/types';

const AudioWaveform: React.FC<WaveformProps> = ({ 
  data, 
  color, 
  isPlaying, 
  progress = 0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barElements, setBarElements] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate how many points to use based on container size
    const numPoints = 180; // One point every 2 degrees for a full circle
    const radius = 48; // Percentage of container
    
    const bars = Array.from({ length: numPoints }).map((_, index) => {
      // Calculate angle in degrees, start from right (0deg) and go clockwise
      const angle = (index * 2) * Math.PI / 180;
      
      // Get waveform data point or generate one
      const dataIndex = Math.floor((index / numPoints) * data.length);
      const value = data[dataIndex] || Math.random() * 10 + 10; // Fallback
      
      // Calculate height based on waveform value
      const height = 1 + value * 0.2;
      
      // Calculate position on circle
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);
      
      // Calculate if this bar should be active based on progress
      const isActive = progress * numPoints > index;
      
      // Add animation for playing state
      const scaleAmount = isPlaying && isActive ? 
        1.5 + Math.sin(Date.now() / 200 + index * 0.1) * 0.3 : 1;
      
      return (
        <div
          key={index}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            height: `${height}px`,
            width: '1px',
            backgroundColor: color === 'bg-white' ? '#EADBC8' : 
                             color.includes('red') ? '#E86F50' : 
                             color.includes('green') ? '#7CAF76' : 
                             color.includes('amber') ? '#E2A447' : 
                             color.includes('blue') ? '#6A9CB0' : '#FFFFFF',
            opacity: isActive ? 1 : 0.7,
            transform: `translateX(-50%) translateY(-50%) rotate(${angle * 180 / Math.PI}deg) scaleY(${scaleAmount})`,
            boxShadow: isPlaying && isActive ? `0 0 3px ${color === 'bg-white' ? '#EADBC8' : '#E86F50'}` : 'none'
          }}
        />
      );
    });
    
    setBarElements(bars);
    
    // Add animation frame update for waveform effect
    let animationFrame: number;
    if (isPlaying) {
      const updateAnimation = () => {
        setBarElements(prev => {
          return prev.map((bar, i) => {
            const style = {...bar.props.style};
            if (progress * numPoints > i) {
              // Create pulsing wave effect
              const pulse = 1.5 + Math.sin(Date.now() / 200 + i * 0.1) * 0.3;
              style.transform = style.transform.replace(/scaleY\([^)]+\)/, `scaleY(${pulse})`);
            }
            return React.cloneElement(bar, { style });
          });
        });
        animationFrame = requestAnimationFrame(updateAnimation);
      };
      animationFrame = requestAnimationFrame(updateAnimation);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data, color, isPlaying, progress]);
  
  return (
    <div className="absolute inset-0" ref={containerRef}>
      {barElements}
    </div>
  );
};

export default AudioWaveform;
