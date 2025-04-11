
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { Forestalk } from '@/types';
import MoodTag from './MoodTag';
import { timeAgo } from '@/utils/audioHelpers';

interface ForestalkCardProps {
  forestalk: Forestalk;
}

const ForestalkCard: React.FC<ForestalkCardProps> = ({ forestalk }) => {
  const ringCount = forestalk.rings.length;
  const lastActive = timeAgo(forestalk.lastActive);
  
  return (
    <Link 
      to={`/forestalk/${forestalk.id}`}
      className="block p-4 rounded-lg bg-forest-medium/50 hover:bg-forest-medium transition-all duration-300 border border-forest-light/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-forest-accent">{forestalk.title}</h3>
          <div className="flex items-center mt-1 text-sm text-forest-highlight/80">
            <span>{forestalk.treeName}</span>
            <span className="mx-2 text-forest-highlight/40">•</span>
            <MoodTag mood={forestalk.mood} />
          </div>
        </div>
        
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
          {/* Preview of concentric rings */}
          <div className="absolute inset-0 rounded-full bg-forest-dark/60 flex items-center justify-center">
            {forestalk.rings.slice(0, 3).map((ring, i) => (
              <div 
                key={i} 
                className={`absolute rounded-full ${ring.color}`}
                style={{
                  width: `${100 - (i * 30)}%`,
                  height: `${100 - (i * 30)}%`,
                  opacity: 0.6 - (i * 0.1)
                }}
              />
            ))}
            <Play size={18} className="text-white z-10" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs text-forest-highlight/60">
        <span>{ringCount} {ringCount === 1 ? 'ring' : 'rings'}</span>
        <div className="flex items-center">
          <span>Last active {lastActive}</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default ForestalkCard;
