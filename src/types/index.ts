
export type ForestalkMood = 
  | "calm" 
  | "inspired" 
  | "reflective" 
  | "curious" 
  | "hopeful" 
  | "melancholic" 
  | "joyful" 
  | "grateful"
  | "anxious"
  | "frustrated"
  | "excited"
  | "peaceful"
  | "passionate"
  | "nostalgic"
  | "confused"
  | "content"
  | "determined"
  | "empathetic"
  | "energetic"
  | "gloomy"
  | "serene"
  | "worried";

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

// Database types that match our Supabase schema
export type DbForestalk = {
  id: string;
  title: string;
  tree_name: string;
  mood: ForestalkMood;
  created_at: string;
  last_active: string;
};

export type DbRing = {
  id: string;
  forestalk_id: string;
  audio_url: string;
  waveform: number[];
  duration: number;
  color: string;
  created_at: string;
};

// Type for the filter state
export type ForestalkFilter = {
  mood: ForestalkMood | 'all';
};
