
import { ForestalkMood } from '@/types';

// Define tree types that can be associated with different moods
const treeTypes = [
  'Oak', 'Pine', 'Maple', 'Birch', 'Cedar', 'Willow', 'Ash', 
  'Redwood', 'Cypress', 'Aspen', 'Elm', 'Sequoia', 'Spruce', 
  'Sycamore', 'Cherry', 'Fir', 'Magnolia', 'Juniper', 'Poplar',
  'Chestnut', 'Beech', 'Walnut', 'Apple', 'Linden', 'Ginkgo',
  'Acacia', 'Eucalyptus', 'Mahogany', 'Hemlock', 'Tamarack'
];

// Map mood types to relevant adjectives
const moodToAdjectives: Record<ForestalkMood, string[]> = {
  calm: ['Peaceful', 'Gentle', 'Tranquil', 'Serene', 'Quiet', 'Still'],
  inspired: ['Creative', 'Visionary', 'Imaginative', 'Innovative', 'Bright', 'Enlightened'],
  reflective: ['Thoughtful', 'Pondering', 'Meditative', 'Contemplative', 'Wise', 'Philosophical'],
  curious: ['Inquisitive', 'Wondering', 'Exploring', 'Observant', 'Questioning', 'Investigative'],
  hopeful: ['Optimistic', 'Promising', 'Aspiring', 'Encouraging', 'Expectant', 'Uplifted'],
  melancholic: ['Wistful', 'Somber', 'Pensive', 'Mournful', 'Downcast', 'Longing'],
  joyful: ['Happy', 'Delighted', 'Cheerful', 'Merry', 'Exuberant', 'Gleeful'],
  grateful: ['Thankful', 'Appreciative', 'Blessed', 'Indebted', 'Obliged', 'Humbled'],
  anxious: ['Nervous', 'Restless', 'Fidgety', 'Shaking', 'Quivering', 'Trembling'],
  frustrated: ['Irritated', 'Vexed', 'Thwarted', 'Blocked', 'Hindered', 'Stuck'],
  excited: ['Enthusiastic', 'Eager', 'Animated', 'Lively', 'Spirited', 'Thrilled'],
  peaceful: ['Harmonious', 'Balanced', 'Placid', 'Composed', 'Centered', 'Relaxed'],
  passionate: ['Ardent', 'Fervent', 'Intense', 'Zealous', 'Fiery', 'Burning'],
  nostalgic: ['Reminiscent', 'Yearning', 'Sentimental', 'Longing', 'Retrospective', 'Remembering'],
  confused: ['Perplexed', 'Bewildered', 'Disoriented', 'Puzzled', 'Baffled', 'Uncertain'],
  content: ['Satisfied', 'Fulfilled', 'Comfortable', 'Pleased', 'At Ease', 'Settled'],
  determined: ['Resolute', 'Steadfast', 'Tenacious', 'Unwavering', 'Persistent', 'Committed'],
  empathetic: ['Compassionate', 'Understanding', 'Sympathetic', 'Sensitive', 'Perceptive', 'Caring'],
  energetic: ['Vibrant', 'Dynamic', 'Lively', 'Spirited', 'Vigorous', 'Bustling'],
  gloomy: ['Dreary', 'Dismal', 'Morose', 'Sullen', 'Forlorn', 'Bleak'],
  serene: ['Calm', 'Tranquil', 'Peaceful', 'Composed', 'Untroubled', 'Placid'],
  worried: ['Concerned', 'Anxious', 'Troubled', 'Apprehensive', 'Uneasy', 'Distressed']
};

// Generate a tree identity based on mood
export const generateTreeByMood = (mood: ForestalkMood): string => {
  const adjectives = moodToAdjectives[mood] || moodToAdjectives.reflective;
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
  
  return `${adjective} ${treeType}`;
};

// Get a list of all moods for filtering
export const getAllMoods = (): ForestalkMood[] => {
  return Object.keys(moodToAdjectives) as ForestalkMood[];
};

// Get a list of grouped moods for UI display
export const getMoodGroups = (): { type: string; moods: ForestalkMood[] }[] => {
  return [
    {
      type: 'Positive',
      moods: ['calm', 'inspired', 'hopeful', 'joyful', 'grateful', 'excited', 'peaceful', 'passionate', 'content', 'energetic', 'serene']
    },
    {
      type: 'Neutral',
      moods: ['reflective', 'curious', 'nostalgic', 'empathetic', 'determined']
    },
    {
      type: 'Negative',
      moods: ['melancholic', 'anxious', 'frustrated', 'confused', 'gloomy', 'worried']
    }
  ];
};
