
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MoodTag from '@/components/MoodTag';
import { Forestalk, AudioPlayerState } from '@/types';
import { formatDuration, timeAgo } from '@/utils/audioHelpers';
import ForestalkRingVisual from './ForestalkRingVisual';
import RecordButton from '@/components/RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useToast } from '@/hooks/use-toast';
import { addRingToForestalk } from '@/api/forestalkApi';

interface ForestalkDetailViewProps {
  forestalk: Forestalk;
  onForestalkUpdate: (updatedForestalk: Forestalk) => void;
  onClose: () => void;
}

const ForestalkDetailView: React.FC<ForestalkDetailViewProps> = ({
  forestalk,
  onForestalkUpdate,
  onClose
}) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentRingIndex: null,
    progress: 0
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const { 
    recorderState, 
    startRecording, 
    stopRecording,
    error: recordingError
  } = useAudioRecorder();

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
    const startIndex = 0; // Start from the oldest ring (index 0)
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
          const nextRingIndex = prev.currentRingIndex !== null ? prev.currentRingIndex + 1 : null;
          if (nextRingIndex !== null && nextRingIndex < forestalk.rings.length) {
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

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      startRecording();
    }
  };

  const handleCancelRecording = () => {
    if (recorderState.isRecording) {
      stopRecording();
    }
    setIsRecording(false);
  };

  const handleSaveRecording = async () => {
    if (!forestalk || !recorderState.audioFile) return;
    
    setIsSaving(true);
    
    try {
      const newRing = await addRingToForestalk(
        forestalk.id,
        recorderState.audioFile,
        Math.round(recorderState.recordingTime)
      );
      
      if (!newRing) {
        throw new Error("Failed to add ring");
      }
      
      const updatedForestalk = {
        ...forestalk,
        rings: [...forestalk.rings, newRing],
        lastActive: new Date()
      };
      
      onForestalkUpdate(updatedForestalk);
      setIsRecording(false);
      
      toast({
        title: "Ring added",
        description: "Your voice has been added to the Forestalk",
        variant: "default",
        className: "bg-forest-accent/20 text-forest-highlight border-forest-accent/30"
      });
    } catch (error) {
      console.error('Error saving recording:', error);
      toast({
        title: "Error",
        description: "Failed to save your recording. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-0 right-0 text-forest-highlight/60 hover:text-forest-highlight hover:bg-transparent" 
        onClick={onClose}
      >
        <X size={20} />
      </Button>
      
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
      
      <div className="relative my-8">
        {isRecording ? (
          <div className="py-4 flex flex-col items-center">
            <div className="mb-6 flex items-center justify-center space-x-4">
              <RecordButton
                isRecording={recorderState.isRecording}
                isPaused={recorderState.isPaused}
                recordingTime={recorderState.recordingTime}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
              <Button 
                variant="ghost" 
                onClick={handleCancelRecording}
                className="text-forest-highlight hover:text-forest-highlight hover:bg-transparent"
              >
                <X size={20} className="mr-2" />
                Cancel
              </Button>
            </div>
            
            {recordingError && (
              <p className="text-red-400 text-sm mb-4">{recordingError}</p>
            )}
            
            {recorderState.audioUrl && (
              <div className="w-full max-w-md space-y-4">
                <p className="text-center text-forest-highlight/80">Preview your recording:</p>
                <audio 
                  src={recorderState.audioUrl} 
                  controls 
                  className="w-full h-10" 
                />
                
                <div className="flex flex-col-reverse sm:flex-row space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelRecording}
                    disabled={isSaving}
                    className="border-forest-light/30 text-forest-highlight"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveRecording}
                    disabled={isSaving}
                    className="bg-forest-accent text-forest-dark hover:bg-forest-accent/90 mb-3 sm:mb-0"
                  >
                    {isSaving ? "Saving..." : "Add to Forestalk"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {forestalk && <ForestalkRingVisual forestalk={forestalk} isHomePage={false} />}
              
              <audio ref={audioRef} preload="auto" style={{
                display: 'none'
              }} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center items-center space-x-4 mt-6">
        {!isRecording && (
          <Button 
            variant="outline"
            onClick={toggleRecording}
            className="px-4 py-2 rounded-full border border-forest-accent/30 text-forest-accent bg-forest-accent/10 transition-colors hover:bg-forest-accent/20"
          >
            <Mic size={16} className="mr-2" />
            Add Ring
          </Button>
        )}
        
        {!isRecording && audioState.currentRingIndex !== null && (
          <div className="text-forest-highlight/80 text-sm">
            Ring {audioState.currentRingIndex + 1} / {forestalk.rings.length}
          </div>
        )}
      </div>
      
      {!isRecording && (
        <div className="mt-10">
          <h3 className="text-lg text-forest-accent mb-4">Rings</h3>
          <div className="space-y-2">
            {forestalk.rings.map((ring, index) => {
              const ringNumber = index + 1;
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
                        Ring {ringNumber}
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
      )}
    </div>
  );
};

export default ForestalkDetailView;
