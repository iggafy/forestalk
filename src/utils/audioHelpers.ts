import { ForestalkRing } from "@/types";

// Generate random waveform data for visualization
export const generateRandomWaveform = (): number[] => {
  // Create an array of random numbers to represent a waveform
  return Array.from({ length: 100 }, () => 
    // Generate random integer values between 5 and 30
    Math.round(Math.random() * 25 + 5)
  );
};

// Calculate how long ago a date was
export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
}

// Format duration in seconds to MM:SS format
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${String(minutes).padStart(1, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Mock data for initial app state
export function generateMockForestalkRings(count: number): ForestalkRing[] {
  const ringColors = ["bg-forest-wave-red", "bg-forest-wave-green", "bg-forest-wave-amber", "bg-forest-wave-blue"];
  
  return Array.from({ length: count }, (_, index) => {
    // Each ring is progressively older as index increases
    const daysAgo = index * 2;
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    return {
      id: `ring-${index}`,
      audioUrl: "", // In a real app, this would be a URL to the audio file
      duration: 30 + Math.random() * 60, // Random duration between 30 and 90 seconds
      waveform: generateRandomWaveform(),
      createdAt: createdDate,
      color: ringColors[index % ringColors.length]
    };
  });
}
