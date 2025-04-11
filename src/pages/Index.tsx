
import React, { useState } from 'react';
import { Plus, Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForestalkCard from '@/components/ForestalkCard';
import CreateForestalkModal from '@/components/CreateForestalkModal';
import { Forestalk } from '@/types';
import { generateMockForestalkRings } from '@/utils/audioHelpers';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forestalks, setForestalks] = useState<Forestalk[]>(() => {
    // Generate some initial mock data
    return [
      {
        id: 'forestalk-1',
        title: 'Tell me about a dream',
        treeName: 'Curious Fir',
        mood: 'curious',
        rings: generateMockForestalkRings(3),
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        lastActive: new Date(Date.now() - 3600000 * 6) // 6 hours ago
      },
      {
        id: 'forestalk-2',
        title: 'Nice to take it easy today',
        treeName: 'Content Cedar',
        mood: 'reflective',
        rings: generateMockForestalkRings(5),
        createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
        lastActive: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: 'forestalk-3',
        title: "Life's big questions",
        treeName: 'Thoughtful Spruce',
        mood: 'reflective',
        rings: generateMockForestalkRings(2),
        createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
        lastActive: new Date(Date.now() - 3600000 * 8) // 8 hours ago
      },
      {
        id: 'forestalk-4',
        title: "I feel like I'm fading away",
        treeName: 'Melancholy Oak',
        mood: 'melancholic',
        rings: generateMockForestalkRings(4),
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        lastActive: new Date(Date.now() - 3600000 * 10) // 10 hours ago
      },
    ];
  });
  
  const { toast } = useToast();
  
  const handleCreateForestalk = (forestalk: Forestalk) => {
    setForestalks(prev => [forestalk, ...prev]);
    toast({
      title: "Forestalk created",
      description: "Your voice has been added to the forest.",
    });
  };
  
  return (
    <div className="min-h-screen bg-[#1A2A1A] bg-opacity-95">
      <header className="py-6 px-4 sm:px-6 flex items-center justify-between border-b border-forest-medium/30">
        <div className="flex items-center space-x-2">
          <Trees size={24} className="text-forest-accent" />
          <h1 className="text-xl sm:text-2xl font-normal text-forest-accent">Forestalk</h1>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
        >
          <Plus size={18} className="mr-1" />
          New Forestalk
        </Button>
      </header>
      
      <main className="container max-w-7xl py-8 px-4">
        <div className="mb-8">
          <h2 className="text-xl text-forest-accent mb-2">The Forest</h2>
          <p className="text-forest-highlight/60">
            Explore voice conversations visualized as tree rings
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {forestalks.map(forestalk => (
            <ForestalkCard key={forestalk.id} forestalk={forestalk} />
          ))}
        </div>
        
        {forestalks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-forest-highlight/60">
              The forest is quiet. Create the first Forestalk.
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
            >
              <Plus size={18} className="mr-1" />
              New Forestalk
            </Button>
          </div>
        )}
      </main>
      
      <CreateForestalkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateForestalk={handleCreateForestalk}
      />
    </div>
  );
};

export default Index;
