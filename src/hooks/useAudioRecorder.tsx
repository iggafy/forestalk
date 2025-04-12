
import { useState, useEffect, useRef } from "react";
import { generateRandomWaveform } from "@/utils/audioHelpers";
import { getRandomRingColor } from "@/utils/treeNames";
import { ForestalkRing } from "@/types";

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  audioBlob: Blob | null;
  audioUrl: string;
  audioFile: File | null; // Add this property
}

export function useAudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    mediaRecorder: null,
    audioChunks: [],
    audioBlob: null,
    audioUrl: "",
    audioFile: null, // Initialize the new property
  });
  
  const [error, setError] = useState<string>("");
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Effect to increment recording time while recording
  useEffect(() => {
    if (recorderState.isRecording && !recorderState.isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecorderState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recorderState.isRecording, recorderState.isPaused]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create a File object from the Blob
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        
        setRecorderState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          audioChunks,
          audioFile
        }));
      });
      
      mediaRecorder.start();
      
      setRecorderState({
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        mediaRecorder,
        audioChunks,
        audioBlob: null,
        audioUrl: "",
        audioFile: null
      });
      
      setError("");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (recorderState.mediaRecorder?.state !== "inactive") {
      recorderState.mediaRecorder?.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setRecorderState(prev => ({
      ...prev,
      isRecording: false,
      isPaused: false
    }));
  };
  
  const pauseRecording = () => {
    if (recorderState.mediaRecorder?.state === "recording") {
      recorderState.mediaRecorder.pause();
      setRecorderState(prev => ({
        ...prev,
        isPaused: true
      }));
    }
  };
  
  const resumeRecording = () => {
    if (recorderState.mediaRecorder?.state === "paused") {
      recorderState.mediaRecorder.resume();
      setRecorderState(prev => ({
        ...prev,
        isPaused: false
      }));
    }
  };
  
  const resetRecording = () => {
    setRecorderState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: "",
      audioFile: null
    });
  };
  
  const createForestalkRing = (): ForestalkRing | null => {
    if (!recorderState.audioBlob || !recorderState.audioUrl) {
      return null;
    }
    
    return {
      id: `ring-${Date.now()}`,
      audioUrl: recorderState.audioUrl,
      duration: recorderState.recordingTime,
      waveform: generateRandomWaveform(),
      createdAt: new Date(),
      color: getRandomRingColor()
    };
  };
  
  return {
    recorderState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    createForestalkRing,
    error
  };
}
