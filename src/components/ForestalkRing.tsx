
import React from 'react';
import { ForestalkRingProps } from '@/types';
import AudioWaveform from './AudioWaveform';

const ForestalkRing: React.FC<ForestalkRingProps> = ({
  ring,
  index,
  totalRings,
  isPlaying,
  isSelected,
  progress,
  onClick
}) => {
  // Calculate size and position based on index and total rings
  const size = 100 - (index * (80 / totalRings));
  const thickness = 20 / totalRings;
  
  return (
    <div
      className={`forestalk-ring ${ring.color} ${isSelected ? 'z-10' : 'z-0'}`}
      style={{
        width: `${size}%`,
        height: `${size}%`,
        borderWidth: isSelected ? '3px' : '1px',
        borderColor: isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
        opacity: isSelected ? 1 : isPlaying ? 0.9 : 0.7,
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)'
      }}
      onClick={onClick}
    >
      {/* Only show waveform on selected or currently playing ring */}
      {(isSelected || isPlaying) && (
        <AudioWaveform
          data={ring.waveform}
          color={`bg-white`}
          isPlaying={isPlaying && isSelected}
          progress={isSelected ? progress : 0}
        />
      )}
    </div>
  );
};

export default ForestalkRing;
