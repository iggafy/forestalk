
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
  anxious: 'bg-red-500/10 text-red-200 border-red-500/20',
  frustrated: 'bg-orange-500/10 text-orange-200 border-orange-500/20',
  excited: 'bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-500/20',
  peaceful: 'bg-sky-500/10 text-sky-200 border-sky-500/20',
  passionate: 'bg-rose-500/10 text-rose-200 border-rose-500/20',
  nostalgic: 'bg-amber-600/10 text-amber-200 border-amber-600/20',
  confused: 'bg-violet-500/10 text-violet-200 border-violet-500/20',
  content: 'bg-green-500/10 text-green-200 border-green-500/20',
  determined: 'bg-indigo-600/10 text-indigo-200 border-indigo-600/20',
  empathetic: 'bg-blue-400/10 text-blue-200 border-blue-400/20',
  energetic: 'bg-yellow-500/10 text-yellow-200 border-yellow-500/20',
  gloomy: 'bg-gray-500/10 text-gray-200 border-gray-500/20',
  serene: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20',
  worried: 'bg-red-400/10 text-red-200 border-red-400/20'
};

const MoodTag: React.FC<MoodTagProps> = ({ mood, className = '' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${moodColors[mood]} ${className}`}>
      {mood}
    </span>
  );
};

export default MoodTag;
