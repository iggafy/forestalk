import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MoodTag from '@/components/MoodTag';
import { Forestalk, AudioPlayerState, ForestalkRing } from '@/types';
import { formatDuration, timeAgo } from '@/utils/audioHelpers';
import RecordButton from '@/components/RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useToast } from '@/hooks/use-toast';
import ForestalkRingVisual from '@/components/ForestalkRingVisual';
import { getForestalkById, addRingToForestalk } from '@/api/forestalkApi';

const ForestalkView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [forestalk, setForestalk] = useState<Forestalk | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentRingIndex: null,
    progress: 0
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchForestalk = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          navigate('/');
          return;
        }
        
        const data = await getForestalkById(id);
        
        if (!data) {
          toast({
            title: "Not found",
            description: "This Forestalk doesn't exist or has been removed",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        setForestalk(data);
      } catch (error) {
        console.error('Error fetching forestalk:', error);
        toast({
          title: "Error",
          description: "Failed to load Forestalk",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForestalk();
  }, [id, navigate, toast]);
  
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
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  
  const handleStartRecording = () => {
    startRecording();
  };
  
  const handleStopRecording = () => {
    stopRecording();
  };
  
  const handleSaveRecording = async () => {
    if (!forestalk || !recorderState.audioFile) return;
    
    setIsSaving(true);
    
    try {
      const newRing = await addRingToForestalk(
        forestalk.id,
        recorderState.audioFile,
        recorderState.recordingTime
      );
      
      if (!newRing) {
        throw new Error("Failed to add ring");
      }
      
      const updatedForestalk = {
        ...forestalk,
        rings: [...forestalk.rings, newRing],
        lastActive: new Date()
      };
      
      setForestalk(updatedForestalk);
      setIsRecording(false);
      
      toast({
        title: "Ring added",
        description: "Your voice has been added to the Forestalk",
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="animate-pulse text-forest-accent">Loading...</div>
      </div>
    );
  }
  
  if (!forestalk) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-forest-accent">Forestalk not found</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-forest-dark">
      <header className="py-6 px-4 sm:px-6 flex items-center justify-between border-b border-forest-medium">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="p-0 text-forest-highlight hover:text-forest-highlight hover:bg-transparent"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Forest
        </Button>
        
        {!isRecording && (
          <Button 
            onClick={toggleRecording}
            className="bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
          >
            <Plus size={18} className="mr-1" />
            Add Ring
          </Button>
        )}
      </header>
      
      <main className="container max-w-4xl py-8 px-4">
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
        
        {isRecording ? (
          <div className="py-8 flex flex-col items-center">
            <div className="mb-6">
              <RecordButton
                isRecording={recorderState.isRecording}
                isPaused={recorderState.isPaused}
                recordingTime={recorderState.recordingTime}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
              />
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
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRecording(false)}
                    disabled={isSaving}
                    className="flex-1 border-forest-light/30 text-forest-highlight"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveRecording}
                    disabled={isSaving}
                    className="flex-1 bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
                  >
                    {isSaving ? "Saving..." : "Add to Forestalk"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
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
                {[...forestalk.rings].map((ring, index) => {
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
          </>
        )}
      </main>
    </div>
  );
};

export default ForestalkView;
