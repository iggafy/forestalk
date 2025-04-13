
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element reference
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle playback toggle
  const togglePlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      stopAudio();
    } else {
      startPlayback();
    }
  };
  
  const startPlayback = () => {
    // Start from innermost ring (last one in the array)
    const startIndex = forestalk.rings.length - 1;
    playRingAudio(startIndex);
  };
  
  const playRingAudio = (index: number) => {
    if (!audioRef.current || index < 0 || index >= forestalk.rings.length) return;
    
    const ring = forestalk.rings[index];
    
    audioRef.current.src = ring.audioUrl;
    audioRef.current.currentTime = 0;
    
    // Set up audio event listeners
    audioRef.current.onplay = () => {
      setIsPlaying(true);
      setCurrentRingIndex(index);
    };
    
    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        setPlayProgress(audioRef.current.currentTime / audioRef.current.duration);
      }
    };
    
    audioRef.current.onended = () => {
      // Move to next ring (going from inner to outer)
      const nextIndex = index - 1;
      if (nextIndex >= 0) {
        setTimeout(() => {
          playRingAudio(nextIndex);
        }, 300);
      } else {
        stopAudio();
      }
    };
    
    audioRef.current.play().catch(err => {
      console.error("Audio playback error:", err);
      stopAudio();
    });
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentRingIndex(null);
    setPlayProgress(0);
  };
  
  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Draw multiple concentric rings with waveforms
  const renderRings = () => {
    // Draw the rings in reverse order, so that the oldest ring is the innermost
    return [...forestalk.rings].reverse().map((ring, index) => {
      const actualIndex = forestalk.rings.length - 1 - index;
      const ringSize = 100 - (index * (70 / forestalk.rings.length));
      const isActiveRing = currentRingIndex === actualIndex;
      
      return (
        <div
          key={ring.id}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 overflow-hidden transition-all duration-300"
          style={{
            width: `${ringSize}%`,
            height: `${ringSize}%`,
            opacity: isActiveRing ? 1 : isHovered ? 0.9 : 0.7,
            zIndex: index + 1, // Reversed z-index
            cursor: 'pointer',
            transform: isActiveRing ? 'translate(-50%, -50%) scale(1.02)' : 'translate(-50%, -50%) scale(1)'
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isPlaying && currentRingIndex === actualIndex) {
              stopAudio();
            } else {
              playRingAudio(actualIndex);
            }
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
      {(isHovered || isPlaying) && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20"
          onClick={togglePlayback}
        >
          <button 
            className="w-12 h-12 rounded-full bg-forest-dark/70 flex items-center justify-center text-forest-accent transition-transform hover:scale-105"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
        </div>
      )}
      
      {/* Hidden audio element for playback */}
      <audio style={{ display: 'none' }} />
    </div>
  );
};

export default ForestalkRingVisual;
