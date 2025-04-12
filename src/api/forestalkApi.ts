
import { supabase } from '@/integrations/supabase/client';
import { 
  DbForestalk, 
  DbRing, 
  Forestalk, 
  ForestalkMood, 
  ForestalkRing 
} from '@/types';
import { generateRandomWaveform } from '@/utils/audioHelpers';
import { Database } from '@/integrations/supabase/types';

// Type for tables in the Supabase database
type Tables = Database['public']['Tables'];

// Mapper functions to convert between DB and frontend types
const mapDbForestalkToForestalk = (
  dbForestalk: Tables['forestalks']['Row'], 
  dbRings: Tables['rings']['Row'][]
): Forestalk => {
  return {
    id: dbForestalk.id,
    title: dbForestalk.title,
    treeName: dbForestalk.tree_name,
    mood: dbForestalk.mood as ForestalkMood,
    rings: dbRings.map(mapDbRingToRing),
    createdAt: new Date(dbForestalk.created_at),
    lastActive: new Date(dbForestalk.last_active)
  };
};

const mapDbRingToRing = (dbRing: Tables['rings']['Row']): ForestalkRing => {
  return {
    id: dbRing.id,
    audioUrl: dbRing.audio_url,
    duration: dbRing.duration,
    waveform: dbRing.waveform,
    createdAt: new Date(dbRing.created_at),
    color: dbRing.color
  };
};

// Get all forestalks
export const getAllForestalks = async (moodFilter?: ForestalkMood): Promise<Forestalk[]> => {
  try {
    let query = supabase.from('forestalks').select('*');
    
    if (moodFilter) {
      query = query.eq('mood', moodFilter);
    }
    
    const { data: forestalksData, error: forestalksError } = await query
      .order('last_active', { ascending: false });
      
    if (forestalksError) throw forestalksError;
    if (!forestalksData) return [];
    
    const forestalks: Forestalk[] = [];
    
    // For each forestalk, get its rings
    for (const dbForestalk of forestalksData) {
      const { data: ringsData, error: ringsError } = await supabase
        .from('rings')
        .select('*')
        .eq('forestalk_id', dbForestalk.id)
        .order('created_at', { ascending: true });
        
      if (ringsError) throw ringsError;
      if (!ringsData) continue;
      
      forestalks.push(
        mapDbForestalkToForestalk(dbForestalk, ringsData)
      );
    }
    
    return forestalks;
  } catch (error) {
    console.error('Error fetching forestalks:', error);
    return [];
  }
};

// Get a single forestalk by ID
export const getForestalkById = async (id: string): Promise<Forestalk | null> => {
  try {
    const { data: forestalkData, error: forestalkError } = await supabase
      .from('forestalks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (forestalkError) throw forestalkError;
    if (!forestalkData) return null;
    
    const { data: ringsData, error: ringsError } = await supabase
      .from('rings')
      .select('*')
      .eq('forestalk_id', id)
      .order('created_at', { ascending: true });
      
    if (ringsError) throw ringsError;
    if (!ringsData) return null;
    
    return mapDbForestalkToForestalk(
      forestalkData, 
      ringsData
    );
  } catch (error) {
    console.error('Error fetching forestalk:', error);
    return null;
  }
};

// Create a new forestalk
export const createForestalk = async (
  title: string,
  treeName: string,
  mood: ForestalkMood,
  audioFile: File,
  duration: number
): Promise<Forestalk | null> => {
  try {
    // 1. Insert the forestalk record
    const { data: forestalkData, error: forestalkError } = await supabase
      .from('forestalks')
      .insert({
        title,
        tree_name: treeName,
        mood
      })
      .select()
      .single();
      
    if (forestalkError) throw forestalkError;
    if (!forestalkData) throw new Error("Failed to create forestalk record");
    
    // 2. Upload the audio file to storage
    const fileName = `${forestalkData.id}/${Date.now()}.webm`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('forestalk_audio')
      .upload(fileName, audioFile, {
        contentType: 'audio/webm',
      });
      
    if (fileError) throw fileError;
    
    // 3. Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('forestalk_audio')
      .getPublicUrl(fileName);
    
    // 4. Generate waveform data (or extract it from the audio file in a real app)
    const waveform = generateRandomWaveform();
    const colors = ["bg-forest-wave-red", "bg-forest-wave-green", "bg-forest-wave-amber", "bg-forest-wave-blue"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 5. Insert the ring record
    const { data: ringData, error: ringError } = await supabase
      .from('rings')
      .insert({
        forestalk_id: forestalkData.id,
        audio_url: publicUrl,
        waveform,
        duration,
        color
      })
      .select()
      .single();
      
    if (ringError) throw ringError;
    if (!ringData) throw new Error("Failed to create ring record");
    
    // 6. Return the complete forestalk with the new ring
    return {
      id: forestalkData.id,
      title: forestalkData.title,
      treeName: forestalkData.tree_name,
      mood: forestalkData.mood as ForestalkMood,
      rings: [{
        id: ringData.id,
        audioUrl: ringData.audio_url,
        duration: ringData.duration,
        waveform: ringData.waveform,
        createdAt: new Date(ringData.created_at),
        color: ringData.color
      }],
      createdAt: new Date(forestalkData.created_at),
      lastActive: new Date(forestalkData.last_active)
    };
  } catch (error) {
    console.error('Error creating forestalk:', error);
    return null;
  }
};

// Add a ring to an existing forestalk
export const addRingToForestalk = async (
  forestalkId: string,
  audioFile: File,
  duration: number
): Promise<ForestalkRing | null> => {
  try {
    // 1. Upload the audio file to storage
    const fileName = `${forestalkId}/${Date.now()}.webm`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('forestalk_audio')
      .upload(fileName, audioFile, {
        contentType: 'audio/webm',
      });
      
    if (fileError) throw fileError;
    
    // 2. Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('forestalk_audio')
      .getPublicUrl(fileName);
    
    // 3. Generate waveform data (or extract it from the audio file in a real app)
    const waveform = generateRandomWaveform();
    const colors = ["bg-forest-wave-red", "bg-forest-wave-green", "bg-forest-wave-amber", "bg-forest-wave-blue"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 4. Insert the ring record
    const { data: ringData, error: ringError } = await supabase
      .from('rings')
      .insert({
        forestalk_id: forestalkId,
        audio_url: publicUrl,
        waveform,
        duration,
        color
      })
      .select()
      .single();
      
    if (ringError) throw ringError;
    if (!ringData) throw new Error("Failed to create ring record");
    
    // 5. Update the lastActive timestamp of the forestalk
    const { error: updateError } = await supabase
      .from('forestalks')
      .update({ last_active: new Date().toISOString() })
      .eq('id', forestalkId);
      
    if (updateError) throw updateError;
    
    // 6. Return the new ring
    return {
      id: ringData.id,
      audioUrl: ringData.audio_url,
      duration: ringData.duration,
      waveform: ringData.waveform,
      createdAt: new Date(ringData.created_at),
      color: ringData.color
    };
  } catch (error) {
    console.error('Error adding ring:', error);
    return null;
  }
};
