
import React, { useState, useEffect } from 'react';
import { Play, Pause, PlusCircle } from 'lucide-react';
import { Forestalk } from '@/types';
import AudioWaveform from './AudioWaveform';
import { Link } from 'react-router-dom';

interface ForestalkRingVisualProps {
  forestalk: Forestalk;
  isHomePage?: boolean;
}

const ForestalkRingVisual: React.FC<ForestalkRingVisualProps> = ({ forestalk, isHomePage = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRingIndex, setCurrentRingIndex] = useState<number | null>(null);
  const [playProgress, setPlayProgress] = useState(0);
  
  // Handle playback toggle
  const togglePlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentRingIndex(null);
    } else {
      setIsPlaying(true);
      setCurrentRingIndex(0);
      // In a real app, this would trigger actual audio playback
    }
  };
  
  // Simulate progress for demo purposes
  useEffect(() => {
    let interval: number;
    
    if (isPlaying && currentRingIndex !== null) {
      interval = window.setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 1) {
            // Move to next ring or stop
            const nextIndex = currentRingIndex + 1;
            if (nextIndex < forestalk.rings.length) {
              setCurrentRingIndex(nextIndex);
              return 0;
            } else {
              setIsPlaying(false);
              setCurrentRingIndex(null);
              return 0;
            }
          }
          return prev + 0.01;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentRingIndex, forestalk.rings.length]);
  
  // Draw multiple concentric rings with waveforms
  const renderRings = () => {
    return forestalk.rings.map((ring, index) => {
      const ringSize = 100 - (index * (70 / forestalk.rings.length));
      const isActiveRing = currentRingIndex === index;
      
      return (
        <div
          key={ring.id}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 overflow-hidden transition-all duration-300"
          style={{
            width: `${ringSize}%`,
            height: `${ringSize}%`,
            opacity: isActiveRing ? 1 : isHovered ? 0.9 : 0.7,
            zIndex: forestalk.rings.length - index,
            cursor: 'pointer',
            transform: isActiveRing ? 'translate(-50%, -50%) scale(1.02)' : 'translate(-50%, -50%) scale(1)'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentRingIndex(index);
            setIsPlaying(true);
            setPlayProgress(0);
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
            isPlaying={isPlaying && isActiveRing}
            progress={isActiveRing ? playProgress : 0}
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
      
      {/* Play/Pause button overlay */}
      {(isHovered || isPlaying) && isHomePage && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          onClick={togglePlayback}
        >
          <button 
            className="w-12 h-12 rounded-full bg-forest-dark/70 flex items-center justify-center text-forest-accent transition-transform hover:scale-105"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
        </div>
      )}
      
      {/* Add Ring button for home page */}
      {isHovered && isHomePage && (
        <Link 
          to={`/forestalk/${forestalk.id}?action=add-ring`}
          className="absolute bottom-2 right-2 z-30 w-8 h-8 rounded-full bg-forest-dark/70 flex items-center justify-center text-forest-accent hover:bg-forest-dark/90 transition-all"
        >
          <PlusCircle size={18} />
        </Link>
      )}
    </div>
  );
};

export default ForestalkRingVisual;
