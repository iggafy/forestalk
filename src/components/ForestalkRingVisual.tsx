
import React, { useState, useEffect } from 'react';
import { Forestalk } from '@/types';
import AudioWaveform from './AudioWaveform';

interface ForestalkRingVisualProps {
  forestalk: Forestalk;
}

const ForestalkRingVisual: React.FC<ForestalkRingVisualProps> = ({ forestalk }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Draw multiple concentric rings with waveforms
  const renderRings = () => {
    return forestalk.rings.map((ring, index) => {
      const isOuterRing = index === 0;
      const isInnerRing = index === forestalk.rings.length - 1;
      const ringSize = 100 - (index * (70 / forestalk.rings.length));
      
      return (
        <div
          key={ring.id}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 overflow-hidden"
          style={{
            width: `${ringSize}%`,
            height: `${ringSize}%`,
            opacity: isHovered ? 0.9 : 0.7,
          }}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          
          <AudioWaveform
            data={ring.waveform}
            color={ring.color}
            isPlaying={isHovered}
            progress={isHovered ? 0.5 : 0}
          />
        </div>
      );
    });
  };

  return (
    <div 
      className="relative w-full h-full rounded-full overflow-hidden bg-forest-dark/80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderRings()}
    </div>
  );
};

export default ForestalkRingVisual;
