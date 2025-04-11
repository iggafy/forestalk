
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForestalkRing from '@/components/ForestalkRing';
import MoodTag from '@/components/MoodTag';
import { Forestalk, AudioPlayerState, ForestalkRing as ForestalkRingType } from '@/types';
import { formatDuration, timeAgo } from '@/utils/audioHelpers';
import RecordButton from '@/components/RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useToast } from '@/hooks/use-toast';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const { 
    recorderState, 
    startRecording, 
    stopRecording,
    createForestalkRing,
    error: recordingError
  } = useAudioRecorder();
  
  // Fetch forestalk data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockForestalks: Forestalk[] = [
      {
        id: 'forestalk-1',
        title: 'Sounds from my morning walk',
        treeName: 'Gentle Maple',
        mood: 'calm',
        rings: [
          {
            id: 'ring-1',
            audioUrl: '',
            duration: 45,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 3),
            color: 'bg-forest-wave-green'
          },
          {
            id: 'ring-2',
            audioUrl: '',
            duration: 60,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 2),
            color: 'bg-forest-wave-red'
          },
          {
            id: 'ring-3',
            audioUrl: '',
            duration: 30,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000),
            color: 'bg-forest-wave-amber'
          }
        ],
        createdAt: new Date(Date.now() - 86400000 * 3),
        lastActive: new Date(Date.now() - 86400000)
      },
      {
        id: 'forestalk-2',
        title: 'Thoughts on mindfulness',
        treeName: 'Wise Oak',
        mood: 'reflective',
        rings: [
          {
            id: 'ring-1',
            audioUrl: '',
            duration: 80,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 5),
            color: 'bg-forest-wave-blue'
          },
          {
            id: 'ring-2',
            audioUrl: '',
            duration: 45,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 4),
            color: 'bg-forest-wave-amber'
          },
          {
            id: 'ring-3',
            audioUrl: '',
            duration: 65,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 3),
            color: 'bg-forest-wave-red'
          },
          {
            id: 'ring-4',
            audioUrl: '',
            duration: 50,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000 * 2),
            color: 'bg-forest-wave-green'
          },
          {
            id: 'ring-5',
            audioUrl: '',
            duration: 40,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000),
            color: 'bg-forest-wave-blue'
          }
        ],
        createdAt: new Date(Date.now() - 86400000 * 5),
        lastActive: new Date(Date.now() - 86400000)
      },
      {
        id: 'forestalk-3',
        title: 'Birds singing in my backyard',
        treeName: 'Serene Willow',
        mood: 'joyful',
        rings: [
          {
            id: 'ring-1',
            audioUrl: '',
            duration: 35,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 86400000),
            color: 'bg-forest-wave-amber'
          },
          {
            id: 'ring-2',
            audioUrl: '',
            duration: 55,
            waveform: Array.from({ length: 100 }, () => 5 + Math.random() * 25),
            createdAt: new Date(Date.now() - 43200000),
            color: 'bg-forest-wave-green'
          }
        ],
        createdAt: new Date(Date.now() - 86400000),
        lastActive: new Date(Date.now() - 43200000)
      }
    ];
    
    const found = mockForestalks.find(f => f.id === id);
    
    if (found) {
      setForestalk(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);
  
  // Audio playback control
  const playRing = (index: number) => {
    if (!forestalk) return;
    
    setAudioState({
      isPlaying: true,
      currentRingIndex: index,
      progress: 0
    });
    
    // In a real app, we would play the actual audio file
    startPlaybackSimulation(forestalk.rings[index].duration);
  };
  
  const playAllRings = () => {
    if (!forestalk || forestalk.rings.length === 0) return;
    
    setAudioState({
      isPlaying: true,
      currentRingIndex: 0,
      progress: 0
    });
    
    // In a real app, we would play the actual audio files in sequence
    startPlaybackSimulation(forestalk.rings[0].duration);
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
          const nextRingIndex = prev.currentRingIndex !== null ? prev.currentRingIndex + 1 : null;
          
          if (nextRingIndex !== null && forestalk && nextRingIndex < forestalk.rings.length) {
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
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  
  const handleStartRecording = () => {
    startRecording();
  };
  
  const handleStopRecording = () => {
    stopRecording();
  };
  
  const handleSaveRecording = () => {
    if (!forestalk) return;
    
    const newRing = createForestalkRing();
    
    if (!newRing) {
      toast({
        title: "Error",
        description: "Failed to save recording. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new ring to the forestalk
    const updatedRings = [...forestalk.rings, newRing];
    const updatedForestalk = {
      ...forestalk,
      rings: updatedRings,
      lastActive: new Date()
    };
    
    setForestalk(updatedForestalk);
    setIsRecording(false);
    
    toast({
      title: "Ring added",
      description: "Your voice has been added to the Forestalk.",
    });
  };
  
  if (!forestalk) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center">
        <div className="animate-pulse text-forest-accent">Loading...</div>
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
                    className="flex-1 border-forest-light/30 text-forest-highlight"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveRecording}
                    className="flex-1 bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
                  >
                    Add to Forestalk
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="relative my-8 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                {/* Center dot */}
                <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-forest-accent z-10" />
                
                {/* Render rings from outer to inner */}
                {forestalk.rings.map((ring, index) => {
                  const ringIndex = forestalk.rings.length - 1 - index;
                  return (
                    <ForestalkRing
                      key={ring.id}
                      ring={ring}
                      index={index}
                      totalRings={forestalk.rings.length}
                      isPlaying={audioState.isPlaying && audioState.currentRingIndex === ringIndex}
                      isSelected={audioState.currentRingIndex === ringIndex}
                      progress={audioState.progress}
                      onClick={() => handleRingClick(ringIndex)}
                    />
                  );
                })}
                
                {/* Placeholder audio element for simulation */}
                <audio 
                  ref={audioRef}
                  src="/lovable-uploads/3271187c-02d8-43e8-b725-d837d841b54e.png" 
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
                  {audioState.currentRingIndex + 1} / {forestalk.rings.length}
                </div>
              )}
            </div>
            
            <div className="mt-10">
              <h3 className="text-lg text-forest-accent mb-4">Rings</h3>
              <div className="space-y-2">
                {forestalk.rings.map((ring, index) => (
                  <div 
                    key={ring.id}
                    className={`p-3 rounded-md flex items-center justify-between cursor-pointer 
                               ${audioState.currentRingIndex === index 
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
                          Ring {index + 1}
                        </div>
                        <div className="text-xs text-forest-highlight/60">
                          {formatDuration(ring.duration)} • {timeAgo(ring.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {audioState.currentRingIndex === index && audioState.isPlaying ? (
                      <Pause size={16} className="text-forest-highlight/80" />
                    ) : (
                      <Play size={16} className="text-forest-highlight/80" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ForestalkView;
