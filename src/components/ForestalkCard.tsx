
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Forestalk } from '@/types';
import ForestalkRingVisual from './ForestalkRingVisual';

interface ForestalkCardProps {
  forestalk: Forestalk;
}

const ForestalkCard: React.FC<ForestalkCardProps> = ({ forestalk }) => {
  return (
    <div className="flex flex-col items-center">
      <Link 
        to={`/forestalk/${forestalk.id}`}
        className="block w-full transform transition-transform hover:scale-105"
      >
        <div className="relative aspect-square mb-4">
          <ForestalkRingVisual forestalk={forestalk} />
        </div>
      </Link>
      
      <h3 className="text-2xl font-medium text-forest-accent text-center mb-2">
        {forestalk.treeName}
      </h3>
      
      <p className="text-forest-highlight/80 text-center mb-4 text-sm">
        {forestalk.title}
      </p>
      
      <Link 
        to={`/forestalk/${forestalk.id}?action=add-ring`}
        className="px-6 py-2 rounded-full border border-forest-accent/30 text-forest-accent hover:bg-forest-accent/10 transition-colors"
      >
        Add a Ring
      </Link>
    </div>
  );
};

export default ForestalkCard;
