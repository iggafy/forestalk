
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ForestalkMood, Forestalk, ForestalkRing } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecordButton from './RecordButton';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { generateTreeName, getFullTreeName } from '@/utils/treeNames';

interface CreateForestalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateForestalk: (forestalk: Forestalk) => void;
}

const moods: ForestalkMood[] = [
  'calm', 'inspired', 'reflective', 'curious', 
  'hopeful', 'melancholic', 'joyful', 'grateful'
];

const CreateForestalkModal: React.FC<CreateForestalkModalProps> = ({
  isOpen,
  onClose,
  onCreateForestalk
}) => {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState<ForestalkMood>('reflective');
  const [step, setStep] = useState<'info' | 'record'>('info');
  const [treeName, setTreeName] = useState(generateTreeName());
  
  const { 
    recorderState, 
    startRecording, 
    stopRecording,
    createForestalkRing,
    error 
  } = useAudioRecorder();
  
  const resetForm = () => {
    setTitle('');
    setMood('reflective');
    setStep('info');
    setTreeName(generateTreeName());
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleNext = () => {
    if (step === 'info') {
      if (!title.trim()) {
        // Show error or validation message
        return;
      }
      setStep('record');
    }
  };
  
  const handleSubmit = () => {
    const ring = createForestalkRing();
    
    if (!ring) {
      console.error('Failed to create recording');
      return;
    }
    
    const newForestalk: Forestalk = {
      id: `forestalk-${Date.now()}`,
      title,
      treeName: getFullTreeName(treeName),
      mood,
      rings: [ring],
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    onCreateForestalk(newForestalk);
    resetForm();
    onClose();
  };
  
  const handleGenerate = () => {
    setTreeName(generateTreeName());
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-forest-dark border-forest-medium max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest-accent">
            {step === 'info' ? 'Create a New Forestalk' : 'Record Your Voice'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-forest-highlight/60 hover:text-forest-highlight"
            onClick={handleClose}
          >
            <X size={18} />
          </Button>
        </DialogHeader>
        
        {step === 'info' ? (
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tree-name">Your Tree Identity</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-2 bg-forest-medium border border-forest-light/30 rounded-md text-forest-highlight">
                  {getFullTreeName(treeName)}
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
            
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={mood} onValueChange={(value) => setMood(value as ForestalkMood)}>
                <SelectTrigger className="bg-forest-medium border-forest-light/30 text-forest-highlight">
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent className="bg-forest-medium border-forest-light/30">
                  {moods.map((m) => (
                    <SelectItem key={m} value={m} className="text-forest-highlight">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleNext}
              className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
            >
              Next - Record Your Voice
            </Button>
          </div>
        ) : (
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
                  disabled={!recorderState.audioUrl}
                  className="w-full bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
                >
                  Create Forestalk
                </Button>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('info')}
                className="w-full border-forest-light/30 text-forest-highlight"
              >
                Back to Details
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateForestalkModal;
