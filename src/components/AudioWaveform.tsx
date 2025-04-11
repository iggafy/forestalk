
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
    
    const bars = data.map((value, index) => {
      const height = `${value}%`;
      const isActive = progress * data.length > index;
      const delay = index * 0.01;
      
      return (
        <div
          key={index}
          className={`waveform-bar ${color} transition-all duration-200`}
          style={{
            height: height,
            opacity: isActive ? 1 : 0.5,
            animationDelay: `${delay}s`,
            transform: isPlaying && isActive ? `scaleY(1.2)` : 'scaleY(1)'
          }}
        />
      );
    });
    
    setBarElements(bars);
  }, [data, color, isPlaying, progress]);
  
  return (
    <div className="waveform" ref={containerRef}>
      <div className="flex items-center justify-center h-full space-x-0.5">
        {barElements}
      </div>
    </div>
  );
};

export default AudioWaveform;
