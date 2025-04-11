
import React from 'react';
import { ForestalkMood } from '@/types';

interface MoodTagProps {
  mood: ForestalkMood;
  className?: string;
}

const moodColors: Record<ForestalkMood, string> = {
  calm: 'bg-blue-500/20 text-blue-100',
  inspired: 'bg-purple-500/20 text-purple-100',
  reflective: 'bg-indigo-500/20 text-indigo-100',
  curious: 'bg-amber-500/20 text-amber-100',
  hopeful: 'bg-emerald-500/20 text-emerald-100',
  melancholic: 'bg-slate-500/20 text-slate-100',
  joyful: 'bg-pink-500/20 text-pink-100',
  grateful: 'bg-teal-500/20 text-teal-100',
};

const MoodTag: React.FC<MoodTagProps> = ({ mood, className = '' }) => {
  return (
    <span className={`mood-tag ${moodColors[mood]} ${className}`}>
      {mood}
    </span>
  );
};

export default MoodTag;
