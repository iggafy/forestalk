
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trees, Volume2, Users, Layers, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-forest-dark">
      <header className="py-6 px-4 sm:px-6 flex items-center justify-between border-b border-forest-medium">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="p-0 text-forest-highlight hover:text-forest-highlight hover:bg-transparent"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Forest
        </Button>
        
        <div className="flex items-center space-x-2">
          <Trees size={24} className="text-forest-accent" />
          <h1 className="text-xl font-normal text-forest-accent">Forestalk</h1>
        </div>
      </header>
      
      <main className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl text-forest-accent text-center mb-8">About Forestalk</h1>
        
        <div className="space-y-6 text-forest-highlight/80">
          <p>
            Forestalk is a platform for voice conversations, inspired by the concept of tree rings. 
            Just as trees add rings over time to record their growth, our conversations here grow 
            with each new voice contribution.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="bg-forest-medium/40 p-6 rounded-lg flex flex-col items-center text-center">
              <Volume2 size={48} className="text-forest-accent mb-4" />
              <h3 className="text-xl text-forest-accent mb-2">Voice-First</h3>
              <p className="text-forest-highlight/70">
                Share your thoughts through voice messages, creating a more personal and authentic connection.
              </p>
            </div>
            
            <div className="bg-forest-medium/40 p-6 rounded-lg flex flex-col items-center text-center">
              <Layers size={48} className="text-forest-accent mb-4" />
              <h3 className="text-xl text-forest-accent mb-2">Tree Rings</h3>
              <p className="text-forest-highlight/70">
                Each voice message forms a new ring in the conversation, visualizing the growth of ideas over time.
              </p>
            </div>
            
            <div className="bg-forest-medium/40 p-6 rounded-lg flex flex-col items-center text-center">
              <Users size={48} className="text-forest-accent mb-4" />
              <h3 className="text-xl text-forest-accent mb-2">Anonymous Identity</h3>
              <p className="text-forest-highlight/70">
                Express yourself freely through a tree identity generated based on your mood.
              </p>
            </div>
            
            <div className="bg-forest-medium/40 p-6 rounded-lg flex flex-col items-center text-center">
              <Lock size={48} className="text-forest-accent mb-4" />
              <h3 className="text-xl text-forest-accent mb-2">Safe Space</h3>
              <p className="text-forest-highlight/70">
                A respectful environment for sharing thoughts, experiences, and stories.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl text-forest-accent mt-10 mb-4">How It Works</h2>
          
          <div className="space-y-4">
            <div className="border-l-2 border-forest-accent pl-4 py-2">
              <h3 className="text-forest-accent text-lg">Start a Forestalk</h3>
              <p className="text-forest-highlight/70">
                Create a new topic, choose a mood, receive a tree identity, and record your voice message.
              </p>
            </div>
            
            <div className="border-l-2 border-forest-accent pl-4 py-2">
              <h3 className="text-forest-accent text-lg">Add Rings</h3>
              <p className="text-forest-highlight/70">
                Contribute to existing conversations by adding your voice as a new ring.
              </p>
            </div>
            
            <div className="border-l-2 border-forest-accent pl-4 py-2">
              <h3 className="text-forest-accent text-lg">Listen & Explore</h3>
              <p className="text-forest-highlight/70">
                Play back conversations from inner to outer rings, filtering by moods to find relevant discussions.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-forest-accent text-forest-dark hover:bg-forest-accent/90"
            >
              <Trees size={18} className="mr-2" />
              Enter the Forest
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-forest-medium/30">
        <div className="container max-w-7xl px-4">
          <p className="text-center text-forest-highlight/50 text-sm">
            Forestalk © {new Date().getFullYear()} • A place for voice conversations
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
