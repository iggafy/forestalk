
import React from 'react';
import { Forestalk } from '@/types';
import ForestalkRingVisual from './ForestalkRingVisual';
import MoodTag from './MoodTag';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ForestalkCardProps {
  forestalk: Forestalk;
  onClick: () => void;
}

const ForestalkCard: React.FC<ForestalkCardProps> = ({ forestalk, onClick }) => {
  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={onClick} 
        className="relative aspect-square mb-4 w-full border-0 p-0 bg-transparent"
      >
        <ForestalkRingVisual forestalk={forestalk} />
      </button>
      
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
        
        <Button
  onClick={onClick}
  className="px-5 py-2 rounded-full border border-forest-accent/30 text-forest-accent bg-forest-accent/10 transition-colors inline-flex items-center hover:bg-forest-accent/20">
  <PlusCircle size={16} className="mr-2" />Add a Ring</Button>
      </div>
    </div>
  );
};

export default ForestalkCard;
