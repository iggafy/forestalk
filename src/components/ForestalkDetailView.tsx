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
  
  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const playRing = (index: number) => {
    if (!forestalk) return;
    
    if (audioRef.current) {
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
      
      audio.onended = () => {
        clearInterval(intervalId);
        setAudioState(prev => {
          if (!forestalk) return prev;
          
          const nextRingIndex = prev.currentRingIndex !== null ? prev.currentRingIndex - 1 : null;
          
          if (nextRingIndex !== null && nextRingIndex >= 0) {
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
          
          <audio 
            ref={audioRef}
            preload="auto"
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-forest-light/30"
          onClick={togglePlayback}
        >
          {audioState.isPlaying ? (
            <Pause size={20} className="text-forest-highlight" />
          ) : (
            <Play size={20} className="text-forest-highlight ml-1" />
          )}
        </Button>
        
        {audioState.currentRingIndex !== null && (
          <div className="text-forest-highlight/80 text-sm">
            Ring {forestalk.rings.length - audioState.currentRingIndex} / {forestalk.rings.length}
          </div>
        )}
      </div>
      
      <div className="mt-10">
        <h3 className="text-lg text-forest-accent mb-4">Rings</h3>
        <div className="space-y-2">
          {[...forestalk.rings].map((ring, displayIndex) => {
            const index = forestalk.rings.length - 1 - displayIndex;
            const isActiveRing = audioState.currentRingIndex === index;
            
            return (
              <div 
                key={ring.id}
                className={`p-3 rounded-md flex items-center justify-between cursor-pointer 
                         ${isActiveRing 
                            ? 'bg-forest-medium' 
                            : 'bg-forest-medium/40 hover:bg-forest-medium/70'}`}
                onClick={() => handleRingClick(index)}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-3 ${ring.color}`}
                  />
                  <div>
                    <div className="text-forest-highlight">
                      Ring {forestalk.rings.length - index}
                    </div>
                    <div className="text-xs text-forest-highlight/60">
                      {formatDuration(ring.duration)} • {timeAgo(ring.createdAt)}
                    </div>
                  </div>
                </div>
                
                {isActiveRing && audioState.isPlaying ? (
                  <Pause size={16} className="text-forest-highlight/80" />
                ) : (
                  <Play size={16} className="text-forest-highlight/80" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForestalkDetailView;
