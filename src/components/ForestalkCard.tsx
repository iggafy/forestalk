
import React from 'react';
import { Link } from 'react-router-dom';
import { Forestalk } from '@/types';
import ForestalkRingVisual from './ForestalkRingVisual';
import MoodTag from './MoodTag';

interface ForestalkCardProps {
  forestalk: Forestalk;
}

const ForestalkCard: React.FC<ForestalkCardProps> = ({ forestalk }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square mb-4 w-full">
        <ForestalkRingVisual forestalk={forestalk} />
      </div>
      
      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-xl font-medium text-forest-accent">
            {forestalk.treeName}
          </h3>
          <MoodTag mood={forestalk.mood} />
        </div>
        
        <p className="text-forest-highlight/80 text-center mb-4 text-sm line-clamp-2">
          {forestalk.title}
        </p>
        
        <Link 
          to={`/forestalk/${forestalk.id}`}
          className="px-6 py-2 rounded-full border border-forest-accent/30 text-forest-accent hover:bg-forest-accent/10 transition-colors inline-block"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ForestalkCard;
