
import React, { useState, useEffect } from 'react';
import { Plus, Trees, Filter, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForestalkCard from '@/components/ForestalkCard';
import CreateForestalkModal from '@/components/CreateForestalkModal';
import { Forestalk, ForestalkMood, ForestalkFilter, ForestalkRing } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getAllForestalks, addRingToForestalk } from '@/api/forestalkApi';
import { getAllMoods } from '@/utils/moodBasedTrees';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import ForestalkDetailView from '@/components/ForestalkDetailView';
import RecordButton from '@/components/RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forestalks, setForestalks] = useState<Forestalk[]>([]);
  const [filter, setFilter] = useState<ForestalkFilter>({ mood: 'all' });
  const [selectedForestalk, setSelectedForestalk] = useState<Forestalk | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const allMoods = getAllMoods();
  
  const { 
    recorderState, 
    startRecording, 
    stopRecording,
    error: recordingError
  } = useAudioRecorder();
  
  // Load forestalks from Supabase
  useEffect(() => {
    const loadForestalks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllForestalks(filter.mood === 'all' ? undefined : filter.mood);
        setForestalks(data);
      } catch (error) {
        console.error("Error loading forestalks:", error);
        toast({
          title: "Error",
          description: "Failed to load forestalks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadForestalks();
  }, [filter, toast]);
  
  const handleCreateForestalk = (forestalk: Forestalk) => {
    setForestalks(prev => [forestalk, ...prev]);
  };
  
  const handleFilterChange = (mood: ForestalkMood | 'all') => {
    setFilter({ ...filter, mood });
  };
  
  const getFilterLabel = () => {
    if (filter.mood === 'all') return 'All Moods';
    return filter.mood.charAt(0).toUpperCase() + filter.mood.slice(1);
  };
  
  const handleSelectForestalk = (forestalk: Forestalk) => {
    setSelectedForestalk(forestalk);
    setIsRecording(false);
  };
  
  const handleCloseForestalk = () => {
    setSelectedForestalk(null);
    setIsRecording(false);
  };
  
  const handleStartRecording = () => {
    if (!selectedForestalk) return;
    setIsRecording(true);
    startRecording();
  };
  
  const handleCancelRecording = () => {
    setIsRecording(false);
  };
  
  const handleSaveRecording = async () => {
    if (!selectedForestalk || !recorderState.audioFile) return;
    
    setIsSaving(true);
    
    try {
      const newRing = await addRingToForestalk(
        selectedForestalk.id,
        recorderState.audioFile,
        Math.round(recorderState.recordingTime)
      );
      
      if (!newRing) {
        throw new Error("Failed to add ring");
      }
      
      // Update the forestalk with the new ring
      const updatedForestalk = {
        ...selectedForestalk,
        rings: [...selectedForestalk.rings, newRing],
        lastActive: new Date()
      };
      
      // Update the selected forestalk
      setSelectedForestalk(updatedForestalk);
      
      // Update forestalks list to reflect the change
      setForestalks(prev => 
        prev.map(f => f.id === updatedForestalk.id ? updatedForestalk : f)
      );
      
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
  
  return (
    <div className="min-h-screen bg-[#1A2A1A] bg-opacity-95">
      <header className="py-6 px-4 sm:px-6 flex items-center justify-between border-b border-forest-medium/30">
        <div className="flex items-center space-x-2">
          <Trees size={24} className="text-forest-accent" />
          <h1 className="text-xl sm:text-2xl font-normal text-forest-accent">Forestalk</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/about" className="text-forest-highlight hover:text-forest-accent transition-colors">
            About
          </Link>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
          >
            <Plus size={18} className="mr-1" />
            New Forestalk
          </Button>
        </div>
      </header>
      
      <main className="container max-w-7xl py-8 px-4">
        {selectedForestalk ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="ghost" 
                onClick={handleCloseForestalk}
                className="p-0 text-forest-highlight hover:text-forest-highlight hover:bg-transparent"
              >
                <X size={20} className="mr-2" />
                Back to Forest
              </Button>
              
              {!isRecording && (
                <Button 
                  onClick={handleStartRecording}
                  className="bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
                >
                  <Plus size={18} className="mr-1" />
                  Add Ring
                </Button>
              )}
            </div>
            
            {isRecording ? (
              <div className="py-8 flex flex-col items-center">
                <div className="mb-6 flex items-center">
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
                    className="ml-4 text-forest-highlight hover:text-forest-highlight hover:bg-transparent"
                  >
                    <X size={20} />
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
                    
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelRecording}
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
              <ForestalkDetailView forestalk={selectedForestalk} />
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl text-forest-accent mb-2">The Forest</h2>
                <p className="text-forest-highlight/60">
                  Explore voice conversations visualized as tree rings
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-forest-light/30 text-forest-highlight">
                    <Filter size={16} className="mr-2" />
                    {getFilterLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-forest-medium border-forest-light/30">
                  <DropdownMenuLabel className="text-forest-highlight">Filter by Mood</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-forest-light/10" />
                  <ScrollArea className="h-[calc(100vh-200px)] max-h-80">
                    <DropdownMenuGroup>
                      <DropdownMenuItem 
                        className={`text-forest-highlight hover:bg-forest-light/10 ${filter.mood === 'all' ? 'bg-forest-light/10' : ''}`}
                        onClick={() => handleFilterChange('all')}
                      >
                        All Moods
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-forest-light/10" />
                      {allMoods.map(mood => (
                        <DropdownMenuItem
                          key={mood}
                          className={`text-forest-highlight hover:bg-forest-light/10 ${filter.mood === mood ? 'bg-forest-light/10' : ''}`}
                          onClick={() => handleFilterChange(mood)}
                        >
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 text-forest-accent animate-spin" />
              </div>
            ) : forestalks.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-forest-highlight/60">
                  {filter.mood !== 'all'
                    ? `No forestalks found with the "${filter.mood}" mood. Try a different filter or create a new one.`
                    : 'The forest is quiet. Create the first Forestalk.'}
                </p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
                >
                  <Plus size={18} className="mr-1" />
                  New Forestalk
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {forestalks.map(forestalk => (
                  <ForestalkCard 
                    key={forestalk.id} 
                    forestalk={forestalk} 
                    onClick={() => handleSelectForestalk(forestalk)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <CreateForestalkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateForestalk={handleCreateForestalk}
      />
    </div>
  );
};

export default Index;
