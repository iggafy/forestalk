import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MoodTag from '@/components/MoodTag';
import { Forestalk, AudioPlayerState } from '@/types';
import { formatDuration, timeAgo } from '@/utils/audioHelpers';
import ForestalkRingVisual from './ForestalkRingVisual';

interface ForestalkDetailViewProps {
  forestalk: Forestalk;
}

const ForestalkDetailView: React.FC<ForestalkDetailViewProps> = ({ forestalk }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentRingIndex: null,
    progress: 0
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Audio playback control
  const playRing = (index: number) => {
    if (!forestalk) return;
    
    if (audioRef.current) {
      // Set the audio source to the actual ring audio
      audioRef.current.src = forestalk.rings[index].audioUrl;
      audioRef.current.load();
    }
    
    setAudioState({
      isPlaying: true,
      currentRingIndex: index,
      progress: 0
    });
    
    startPlaybackSimulation(forestalk.rings[index].duration);
  };
  
  const playAllRings = () => {
    if (!forestalk || forestalk.rings.length === 0) return;
    
    // Start playback from the innermost ring (last in the array)
    const startIndex = forestalk.rings.length - 1;
    
    if (audioRef.current) {
      audioRef.current.src = forestalk.rings[startIndex].audioUrl;
      audioRef.current.load();
    }
    
    setAudioState({
      isPlaying: true,
      currentRingIndex: startIndex,
      progress: 0
    });
    
    startPlaybackSimulation(forestalk.rings[startIndex].duration);
  };
  
  const startPlaybackSimulation = (duration: number) => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      
      // Update progress during playback
      const intervalId = setInterval(() => {
        if (audio.paused) {
          clearInterval(intervalId);
          return;
        }
        
        setAudioState(prev => ({
          ...prev,
          progress: audio.currentTime / audio.duration
        }));
      }, 100);
      
      // Handle playback end
      audio.onended = () => {
        clearInterval(intervalId);
        setAudioState(prev => {
          if (!forestalk) return prev;
          
          // Go to the next ring (from inner to outer, i.e., from most recent to oldest)
          const nextRingIndex = prev.currentRingIndex !== null ? prev.currentRingIndex - 1 : null;
          
          if (nextRingIndex !== null && nextRingIndex >= 0) {
            // Play next ring
            setTimeout(() => {
              playRing(nextRingIndex);
            }, 500);
            
            return {
              isPlaying: false,
              currentRingIndex: prev.currentRingIndex,
              progress: 1
            };
          }
          
          return {
            isPlaying: false,
            currentRingIndex: null,
            progress: 0
          };
        });
      };
      
      audio.play().catch(console.error);
    }
  };
  
  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false
      }));
    }
  };
  
  const resumePlayback = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setAudioState(prev => ({
        ...prev,
        isPlaying: true
      }));
    }
  };
  
  const togglePlayback = () => {
    if (audioState.isPlaying) {
      pausePlayback();
    } else if (audioState.currentRingIndex !== null) {
      resumePlayback();
    } else {
      playAllRings();
    }
  };
  
  const handleRingClick = (index: number) => {
    if (audioState.currentRingIndex === index && audioState.isPlaying) {
      pausePlayback();
    } else {
      playRing(index);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl text-forest-accent mb-2">{forestalk.title}</h1>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-forest-highlight/80">{forestalk.treeName}</span>
          <MoodTag mood={forestalk.mood} />
        </div>
        <p className="text-sm text-forest-highlight/60 mt-2">
          Created {timeAgo(forestalk.createdAt)}
        </p>
      </div>
      
      <div className="relative my-8 flex justify-center">
        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
          {forestalk && (
            <ForestalkRingVisual 
              forestalk={forestalk} 
              isHomePage={false} 
            />
          )}
          
          {/* Audio element for playback */}
          <audio 
            ref={audioRef}
            preload="auto"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ForestalkDetailView;
