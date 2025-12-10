
import { Character, Faction } from "../types";
import { INITIAL_CHARACTERS, INITIAL_ELO } from "../constants";

// UPDATED KEY TO FORCE CLEAN RESET
const STORAGE_KEY = 'castle_ranker_data_v9_visible';
const ORG_META_KEY = 'castle_ranker_org_meta';

export const getCharacters = (): Character[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize
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

  saveCharacters(initialData);
  return initialData;
};

export const saveCharacters = (characters: Character[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
};

export const getCharacterById = (id: string): Character | undefined => {
  const chars = getCharacters();
  return chars.find(c => c.id === id);
};

export const updateCharactersAfterVote = (winner: Character, loser: Character) => {
  const chars = getCharacters();
  const wIndex = chars.findIndex(c => c.id === winner.id);
  const lIndex = chars.findIndex(c => c.id === loser.id);

  if (wIndex !== -1) chars[wIndex] = winner;
  if (lIndex !== -1) chars[lIndex] = loser;

  saveCharacters(chars);
};

export const saveCharacterDetails = (character: Character) => {
  const chars = getCharacters();
  const index = chars.findIndex(c => c.id === character.id);
  
  if (index !== -1) {
    // Update existing - Ensure we merge to keep stats, but update bio/faction/image
    chars[index] = { ...chars[index], ...character };
  }
  saveCharacters(chars);
};

export const addCharacter = (characterData: any) => {
  const chars = getCharacters();
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
  chars.push(newChar);
  saveCharacters(chars);
};

export const deleteCharacter = (id: string) => {
  const chars = getCharacters();
  const filtered = chars.filter(c => c.id !== id);
  saveCharacters(filtered);
};

export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ORG_META_KEY);
};

// --- Organization Metadata ---
export const getOrgDescription = (faction: string): string => {
  const stored = localStorage.getItem(ORG_META_KEY);
  const meta = stored ? JSON.parse(stored) : {};
  return meta[faction] || "An active faction within the Castle universe.";
};

export const saveOrgDescription = (faction: string, description: string) => {
  const stored = localStorage.getItem(ORG_META_KEY);
  const meta = stored ? JSON.parse(stored) : {};
  meta[faction] = description;
  localStorage.setItem(ORG_META_KEY, JSON.stringify(meta));
};
