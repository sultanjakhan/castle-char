import { createClient } from '@supabase/supabase-js';
import { Character, MatchResult } from '../types';
import { INITIAL_CHARACTERS, INITIAL_ELO } from '../constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Falling back to localStorage.');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to convert DB character to app Character
const dbToCharacter = (dbChar: any, matchHistory: MatchResult[] = []): Character => ({
  id: dbChar.id,
  name: dbChar.name,
  version: dbChar.version,
  imageUrl: dbChar.image_url || '',
  description: dbChar.description || '',
  faction: dbChar.faction,
  wikiLink: dbChar.wiki_link,
  overallElo: dbChar.overall_elo || INITIAL_ELO,
  handToHandElo: dbChar.hand_to_hand_elo || INITIAL_ELO,
  bladedWeaponsElo: dbChar.bladed_weapons_elo || INITIAL_ELO,
  firearmsElo: dbChar.firearms_elo || INITIAL_ELO,
  battleIqElo: dbChar.battle_iq_elo || INITIAL_ELO,
  physicalStatsElo: dbChar.physical_stats_elo || INITIAL_ELO,
  speedElo: dbChar.speed_elo || INITIAL_ELO,
  durabilityElo: dbChar.durability_elo || INITIAL_ELO,
  staminaElo: dbChar.stamina_elo || INITIAL_ELO,
  assassinationElo: dbChar.assassination_elo || INITIAL_ELO,
  wins: dbChar.wins || 0,
  losses: dbChar.losses || 0,
  matchHistory
});

// Helper to convert app Character to DB format
const characterToDb = (char: Character) => ({
  id: char.id,
  name: char.name,
  version: char.version,
  image_url: char.imageUrl,
  description: char.description,
  faction: char.faction,
  wiki_link: char.wikiLink,
  overall_elo: char.overallElo,
  hand_to_hand_elo: char.handToHandElo,
  bladed_weapons_elo: char.bladedWeaponsElo,
  firearms_elo: char.firearmsElo,
  battle_iq_elo: char.battleIqElo,
  physical_stats_elo: char.physicalStatsElo,
  speed_elo: char.speedElo,
  durability_elo: char.durabilityElo,
  stamina_elo: char.staminaElo,
  assassination_elo: char.assassinationElo,
  wins: char.wins,
  losses: char.losses
});

export const getCharacters = async (): Promise<Character[]> => {
  if (!supabase) {
    // Fallback to localStorage
    const stored = localStorage.getItem('castle_ranker_data_v9_visible');
    if (stored) {
      return JSON.parse(stored);
    }
    return initializeDefaultCharacters();
  }

  try {
    // Fetch characters
    const { data: characters, error: charsError } = await supabase
      .from('characters')
      .select('*')
      .order('overall_elo', { ascending: false });

    if (charsError) throw charsError;

    if (!characters || characters.length === 0) {
      // Initialize with default characters
      return await initializeDefaultCharacters();
    }

    // Fetch match history for all characters
    const characterIds = characters.map(c => c.id);
    const { data: matchHistory, error: historyError } = await supabase
      .from('match_history')
      .select('*')
      .in('character_id', characterIds)
      .order('created_at', { ascending: false })
      .limit(20); // Limit per character

    if (historyError) {
      console.warn('Error fetching match history:', historyError);
    }

    // Group match history by character
    const historyByCharacter = new Map<string, MatchResult[]>();
    if (matchHistory) {
      matchHistory.forEach(match => {
        if (!historyByCharacter.has(match.character_id)) {
          historyByCharacter.set(match.character_id, []);
        }
        historyByCharacter.get(match.character_id)!.push({
          opponentId: match.opponent_id,
          opponentName: match.opponent_name,
          result: match.result as 'WIN' | 'LOSS',
          eloChange: match.elo_change,
          date: new Date(match.created_at).getTime(),
          scenarioDescription: match.scenario_description
        });
      });
    }

    return characters.map(char => 
      dbToCharacter(char, historyByCharacter.get(char.id) || [])
    );
  } catch (error) {
    console.error('Error fetching characters:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('castle_ranker_data_v9_visible');
    if (stored) {
      return JSON.parse(stored);
    }
    return initializeDefaultCharacters();
  }
};

const initializeDefaultCharacters = async (): Promise<Character[]> => {
  const initialData: Character[] = INITIAL_CHARACTERS.map(c => ({
    ...c,
    overallElo: INITIAL_ELO,
    handToHandElo: INITIAL_ELO,
    bladedWeaponsElo: INITIAL_ELO,
    firearmsElo: INITIAL_ELO,
    battleIqElo: INITIAL_ELO,
    physicalStatsElo: INITIAL_ELO,
    speedElo: INITIAL_ELO,
    durabilityElo: INITIAL_ELO,
    staminaElo: INITIAL_ELO,
    assassinationElo: INITIAL_ELO,
    wins: 0,
    losses: 0,
    matchHistory: []
  }));

  if (supabase) {
    try {
      // Insert all default characters
      const dbData = initialData.map(characterToDb);
      const { error } = await supabase
        .from('characters')
        .insert(dbData);

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing characters:', error);
    }
  } else {
    // Fallback to localStorage
    saveCharacters(initialData);
  }

  return initialData;
};

export const saveCharacters = async (characters: Character[]): Promise<void> => {
  if (!supabase) {
    // Fallback to localStorage
    localStorage.setItem('castle_ranker_data_v9_visible', JSON.stringify(characters));
    return;
  }

  try {
    // Update all characters
    for (const char of characters) {
      const { error } = await supabase
        .from('characters')
        .upsert(characterToDb(char), { onConflict: 'id' });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error saving characters:', error);
    // Fallback to localStorage
    localStorage.setItem('castle_ranker_data_v9_visible', JSON.stringify(characters));
  }
};

export const getCharacterById = async (id: string): Promise<Character | undefined> => {
  const characters = await getCharacters();
  return characters.find(c => c.id === id);
};

export const updateCharactersAfterVote = async (
  winner: Character,
  loser: Character
): Promise<void> => {
  // Save updated characters
  await saveCharacters([winner, loser]);

  // Save match history
  if (supabase) {
    try {
      const timestamp = new Date().toISOString();
      
      // Winner's match record
      await supabase.from('match_history').insert({
        character_id: winner.id,
        opponent_id: loser.id,
        opponent_name: loser.name,
        result: 'WIN',
        elo_change: winner.matchHistory[0]?.eloChange || 0,
        created_at: timestamp
      });

      // Loser's match record
      await supabase.from('match_history').insert({
        character_id: loser.id,
        opponent_id: winner.id,
        opponent_name: winner.name,
        result: 'LOSS',
        elo_change: loser.matchHistory[0]?.eloChange || 0,
        created_at: timestamp
      });
    } catch (error) {
      console.error('Error saving match history:', error);
    }
  }
};

export const saveCharacterDetails = async (character: Character): Promise<void> => {
  const characters = await getCharacters();
  const index = characters.findIndex(c => c.id === character.id);
  
  if (index !== -1) {
    characters[index] = { ...characters[index], ...character };
  } else {
    characters.push(character);
  }
  
  await saveCharacters(characters);
};

export const addCharacter = async (characterData: any): Promise<void> => {
  const characters = await getCharacters();
  const newChar: Character = {
    ...characterData,
    overallElo: INITIAL_ELO,
    handToHandElo: INITIAL_ELO,
    bladedWeaponsElo: INITIAL_ELO,
    firearmsElo: INITIAL_ELO,
    battleIqElo: INITIAL_ELO,
    physicalStatsElo: INITIAL_ELO,
    speedElo: INITIAL_ELO,
    durabilityElo: INITIAL_ELO,
    staminaElo: INITIAL_ELO,
    assassinationElo: INITIAL_ELO,
    wins: 0,
    losses: 0,
    matchHistory: []
  };
  
  characters.push(newChar);
  await saveCharacters(characters);
};

export const deleteCharacter = async (id: string): Promise<void> => {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting character:', error);
      // Fallback to localStorage
      const characters = await getCharacters();
      const filtered = characters.filter(c => c.id !== id);
      await saveCharacters(filtered);
    }
  } else {
    const characters = await getCharacters();
    const filtered = characters.filter(c => c.id !== id);
    await saveCharacters(filtered);
  }
};

export const resetData = async (): Promise<void> => {
  if (supabase) {
    try {
      // Delete all match history
      await supabase.from('match_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Delete all characters
      await supabase.from('characters').delete().neq('id', '');
      
      // Delete organization metadata
      await supabase.from('organization_metadata').delete().neq('faction', '');
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }
  
  // Also clear localStorage
  localStorage.removeItem('castle_ranker_data_v9_visible');
  localStorage.removeItem('castle_ranker_org_meta');
};

// Organization Metadata
export const getOrgDescription = async (faction: string): Promise<string> => {
  if (!supabase) {
    const stored = localStorage.getItem('castle_ranker_org_meta');
    const meta = stored ? JSON.parse(stored) : {};
    return meta[faction] || "An active faction within the Castle universe.";
  }

  try {
    const { data, error } = await supabase
      .from('organization_metadata')
      .select('description')
      .eq('faction', faction)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    
    return data?.description || "An active faction within the Castle universe.";
  } catch (error) {
    console.error('Error fetching org description:', error);
    return "An active faction within the Castle universe.";
  }
};

export const saveOrgDescription = async (faction: string, description: string): Promise<void> => {
  if (!supabase) {
    const stored = localStorage.getItem('castle_ranker_org_meta');
    const meta = stored ? JSON.parse(stored) : {};
    meta[faction] = description;
    localStorage.setItem('castle_ranker_org_meta', JSON.stringify(meta));
    return;
  }

  try {
    const { error } = await supabase
      .from('organization_metadata')
      .upsert({ faction, description }, { onConflict: 'faction' });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving org description:', error);
    // Fallback to localStorage
    const stored = localStorage.getItem('castle_ranker_org_meta');
    const meta = stored ? JSON.parse(stored) : {};
    meta[faction] = description;
    localStorage.setItem('castle_ranker_org_meta', JSON.stringify(meta));
  }
};

