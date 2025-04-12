
import React, { useState, useEffect } from 'react';
import { Plus, Trees, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ForestalkCard from '@/components/ForestalkCard';
import CreateForestalkModal from '@/components/CreateForestalkModal';
import { Forestalk, ForestalkMood, ForestalkFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getAllForestalks } from '@/api/forestalkApi';
import { getAllMoods } from '@/utils/moodBasedTrees';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forestalks, setForestalks] = useState<Forestalk[]>([]);
  const [filter, setFilter] = useState<ForestalkFilter>({ mood: 'all' });
  const { toast } = useToast();
  const allMoods = getAllMoods();
  
  // Load forestalks from Supabase
  useEffect(() => {
    const loadForestalks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllForestalks(filter.mood === 'all' ? undefined : filter.mood);
        setForestalks(data);
      } catch (error) {
        console.error("Error loading forestalks:", error);
        toast({
          title: "Error",
          description: "Failed to load forestalks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadForestalks();
  }, [filter, toast]);
  
  const handleCreateForestalk = (forestalk: Forestalk) => {
    setForestalks(prev => [forestalk, ...prev]);
  };
  
  const handleFilterChange = (mood: ForestalkMood | 'all') => {
    setFilter({ ...filter, mood });
  };
  
  const getFilterLabel = () => {
    if (filter.mood === 'all') return 'All Moods';
    return filter.mood.charAt(0).toUpperCase() + filter.mood.slice(1);
  };
  
  return (
    <div className="min-h-screen bg-[#1A2A1A] bg-opacity-95">
      <header className="py-6 px-4 sm:px-6 flex items-center justify-between border-b border-forest-medium/30">
        <div className="flex items-center space-x-2">
          <Trees size={24} className="text-forest-accent" />
          <h1 className="text-xl sm:text-2xl font-normal text-forest-accent">Forestalk</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/about" className="text-forest-highlight hover:text-forest-accent transition-colors">
            About
          </Link>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
          >
            <Plus size={18} className="mr-1" />
            New Forestalk
          </Button>
        </div>
      </header>
      
      <main className="container max-w-7xl py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl text-forest-accent mb-2">The Forest</h2>
            <p className="text-forest-highlight/60">
              Explore voice conversations visualized as tree rings
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-forest-light/30 text-forest-highlight">
                <Filter size={16} className="mr-2" />
                {getFilterLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-forest-medium border-forest-light/30">
              <DropdownMenuLabel className="text-forest-highlight">Filter by Mood</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-forest-light/10" />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className={`text-forest-highlight hover:bg-forest-light/10 ${filter.mood === 'all' ? 'bg-forest-light/10' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Moods
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-forest-light/10" />
                {allMoods.map(mood => (
                  <DropdownMenuItem
                    key={mood}
                    className={`text-forest-highlight hover:bg-forest-light/10 ${filter.mood === mood ? 'bg-forest-light/10' : ''}`}
                    onClick={() => handleFilterChange(mood)}
                  >
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-forest-accent animate-spin" />
          </div>
        ) : forestalks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-forest-highlight/60">
              {filter.mood !== 'all'
                ? `No forestalks found with the "${filter.mood}" mood. Try a different filter or create a new one.`
                : 'The forest is quiet. Create the first Forestalk.'}
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-forest-accent/20 text-forest-accent border border-forest-accent/30 hover:bg-forest-accent/30"
            >
              <Plus size={18} className="mr-1" />
              New Forestalk
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {forestalks.map(forestalk => (
              <ForestalkCard key={forestalk.id} forestalk={forestalk} />
            ))}
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
