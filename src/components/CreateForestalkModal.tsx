import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ForestalkMood, Forestalk } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecordButton from './RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { generateTreeByMood } from '@/utils/moodBasedTrees';
import { useToast } from '@/hooks/use-toast';
import { createForestalk } from '@/api/forestalkApi';
import { getMoodGroups } from '@/utils/moodBasedTrees';

interface CreateForestalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateForestalk: (forestalk: Forestalk) => void;
}

const CreateForestalkModal: React.FC<CreateForestalkModalProps> = ({
  isOpen,
  onClose,
  onCreateForestalk
}) => {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState<ForestalkMood>('reflective');
  const [treeName, setTreeName] = useState('');
  const [step, setStep] = useState<'title' | 'mood' | 'tree' | 'record'>('title');
  const [isLoading, setIsLoading] = useState(false);
  const moodGroups = getMoodGroups();
  
  const { 
    recorderState, 
    startRecording, 
    stopRecording,
    error 
  } = useAudioRecorder();
  
  const { toast } = useToast();
  
  useEffect(() => {
    if (mood) {
      setTreeName(generateTreeByMood(mood));
    }
  }, [mood]);
  
  const resetForm = () => {
    setTitle('');
    setMood('reflective');
    setTreeName('');
    setStep('title');
    setIsLoading(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleNext = () => {
    if (step === 'title') {
      if (!title.trim()) {
        toast({
          title: "Title required",
          description: "Please enter a title for your Forestalk",
          variant: "destructive"
        });
        return;
      }
      setStep('mood');
    } else if (step === 'mood') {
      setStep('tree');
    } else if (step === 'tree') {
      setStep('record');
    }
  };
  
  const handleGenerate = () => {
    setTreeName(generateTreeByMood(mood));
  };
  
  const handleSubmit = async () => {
    if (!recorderState.audioFile) {
      toast({
        title: "Recording required",
        description: "Please record your voice first",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newForestalk = await createForestalk(
        title,
        treeName,
        mood,
        recorderState.audioFile,
        recorderState.recordingTime
      );
      
      if (!newForestalk) {
        throw new Error("Failed to create Forestalk");
      }
      
      onCreateForestalk(newForestalk);
      resetForm();
      onClose();
      
      toast({
        title: "Forestalk created",
        description: "Your voice has been added to the forest",
      });
    } catch (error) {
      console.error("Error creating forestalk:", error);
      toast({
        title: "Error",
        description: "Failed to create Forestalk. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderTitleStep = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What's this Forestalk about?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-forest-medium border-forest-light/30 text-forest-highlight"
        />
        <p className="text-xs text-forest-highlight/60">
          This will be the main topic of your Forestalk
        </p>
      </div>
      
      <Button 
        onClick={handleNext}
        className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
      >
        Next - Choose a Mood
      </Button>
    </div>
  );
  
  const renderMoodStep = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="mood">Select a Mood</Label>
        <Select value={mood} onValueChange={(value) => setMood(value as ForestalkMood)}>
          <SelectTrigger className="bg-forest-medium border-forest-light/30 text-forest-highlight">
            <SelectValue placeholder="Select a mood" />
          </SelectTrigger>
          <SelectContent className="bg-forest-medium border-forest-light/30 max-h-72">
            {moodGroups.map(group => (
              <div key={group.type} className="px-2 py-1.5">
                <p className="text-xs font-semibold text-forest-highlight/70 mb-1">{group.type}</p>
                {group.moods.map((m) => (
                  <SelectItem key={m} value={m} className="text-forest-highlight">
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </SelectItem>
                ))}
                {group !== moodGroups[moodGroups.length - 1] && (
                  <div className="my-1 border-t border-forest-light/10"></div>
                )}
              </div>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-forest-highlight/60">
          The mood will influence your tree identity
        </p>
      </div>
      
      <Button 
        onClick={handleNext}
        className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
      >
        Next - Your Tree Identity
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setStep('title')}
        className="w-full border-forest-light/30 text-forest-highlight"
      >
        Back
      </Button>
    </div>
  );
  
  const renderTreeStep = () => (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="tree-name">Your Tree Identity</Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 p-2 bg-forest-medium border border-forest-light/30 rounded-md text-forest-highlight">
            {treeName}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerate}
            className="border-forest-light/30 text-forest-highlight"
          >
            Generate
          </Button>
        </div>
        <p className="text-xs text-forest-highlight/60">
          This is your anonymous identity for this Forestalk
        </p>
      </div>
      
      <Button 
        onClick={handleNext}
        className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
      >
        Next - Record Your Voice
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => setStep('mood')}
        className="w-full border-forest-light/30 text-forest-highlight"
      >
        Back
      </Button>
    </div>
  );
  
  const renderRecordStep = () => (
    <div className="py-4 space-y-6">
      <p className="text-sm text-center text-forest-highlight/80">
        Record your voice message (up to 90 seconds)
      </p>
      
      <div className="flex justify-center py-6">
        <RecordButton
          isRecording={recorderState.isRecording}
          isPaused={recorderState.isPaused}
          recordingTime={recorderState.recordingTime}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
      
      {recorderState.audioUrl && (
        <div className="space-y-3">
          <p className="text-sm text-forest-highlight/80 text-center">Preview your recording:</p>
          <audio 
            src={recorderState.audioUrl} 
            controls 
            className="w-full h-10" 
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!recorderState.audioUrl || isLoading}
            className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
          >
            {isLoading ? "Creating..." : "Create Forestalk"}
          </Button>
        </div>
      )}
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          onClick={() => setStep('tree')}
          disabled={isLoading}
          className="w-full border-forest-light/30 text-forest-highlight"
        >
          Back
        </Button>
      </div>
    </div>
  );
  
  const renderStepContent = () => {
    switch (step) {
      case 'title': return renderTitleStep();
      case 'mood': return renderMoodStep();
      case 'tree': return renderTreeStep();
      case 'record': return renderRecordStep();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-forest-dark border-forest-medium max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest-accent">
            {step === 'title' && "Create a New Forestalk"}
            {step === 'mood' && "Choose a Mood"}
            {step === 'tree' && "Your Tree Identity"}
            {step === 'record' && "Record Your Voice"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-forest-highlight/60 hover:text-forest-highlight"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X size={18} />
          </Button>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateForestalkModal;
