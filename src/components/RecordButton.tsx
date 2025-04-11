
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { formatDuration } from '@/utils/audioHelpers';

interface RecordButtonProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  maxDuration?: number;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isPaused,
  recordingTime,
  onStartRecording,
  onStopRecording,
  maxDuration = 90
}) => {
  const [progress, setProgress] = useState(0);
  
  // Update recording progress as percentage
  useEffect(() => {
    if (isRecording) {
      setProgress((recordingTime / maxDuration) * 100);
    } else {
      setProgress(0);
    }
  }, [isRecording, recordingTime, maxDuration]);
  
  // Auto stop recording if max duration is reached
  useEffect(() => {
    if (recordingTime >= maxDuration && isRecording) {
      onStopRecording();
    }
  }, [recordingTime, maxDuration, isRecording, onStopRecording]);
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`record-button group ${isRecording ? 'bg-forest-wave-red animate-pulse' : 'bg-forest-wave-red/80'}`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <Square size={24} className="text-white" />
        ) : (
          <Mic size={24} className="text-white" />
        )}
      </button>
      
      {isRecording && (
        <div className="mt-2 text-forest-highlight flex flex-col items-center">
          <div className="text-sm font-medium">
            {formatDuration(recordingTime)} / {formatDuration(maxDuration)}
          </div>
          <div className="w-32 h-1 bg-forest-medium rounded-full mt-1">
            <div 
              className="h-full bg-forest-wave-red rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordButton;
