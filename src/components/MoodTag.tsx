
import React from 'react';
import { ForestalkMood } from '@/types';

interface MoodTagProps {
  mood: ForestalkMood;
  className?: string;
}

const moodColors: Record<ForestalkMood, string> = {
  calm: 'bg-blue-500/10 text-blue-200 border-blue-500/20',
  inspired: 'bg-purple-500/10 text-purple-200 border-purple-500/20',
  reflective: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20',
  curious: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
  hopeful: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
  melancholic: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
  joyful: 'bg-pink-500/10 text-pink-200 border-pink-500/20',
  grateful: 'bg-teal-500/10 text-teal-200 border-teal-500/20',
};

const MoodTag: React.FC<MoodTagProps> = ({ mood, className = '' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${moodColors[mood]} ${className}`}>
      {mood}
    </span>
  );
};

export default MoodTag;
