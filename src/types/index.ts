
export type ForestalkMood = 
  | "calm" 
  | "inspired" 
  | "reflective" 
  | "curious" 
  | "hopeful" 
  | "melancholic" 
  | "joyful" 
  | "grateful";

export type ForestalkRing = {
  id: string;
  audioUrl: string;
  duration: number;
  waveform: number[];
  createdAt: Date;
  color: string;
};

export type Forestalk = {
  id: string;
  title: string;
  treeName: string;
  mood: ForestalkMood;
  rings: ForestalkRing[];
  createdAt: Date;
  lastActive: Date;
};

export type TreeName = {
  prefix: string;
  name: string;
};

export interface WaveformProps {
  data: number[];
  color: string;
  isPlaying: boolean;
  progress?: number;
}

export interface ForestalkRingProps {
  ring: ForestalkRing;
  index: number;
  totalRings: number;
  isPlaying: boolean;
  isSelected: boolean;
  progress: number;
  onClick: () => void;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentRingIndex: number | null;
  progress: number;
}
