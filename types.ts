
export enum AppView {
  RANDOM_BATTLE = 'RANDOM_BATTLE',
  CUSTOM_BATTLE = 'CUSTOM_BATTLE',
  LEADERBOARD = 'LEADERBOARD',
  TIER_LIST = 'TIER_LIST',
  PROFILE = 'PROFILE',
  ROSTER = 'ROSTER',
  ORGANIZATIONS = 'ORGANIZATIONS',
  ORGANIZATION_DETAIL = 'ORGANIZATION_DETAIL'
}

// Enum used for defaults, but Character interface accepts string for custom ones
export enum Faction {
  BAEK_YI = "Baek-Yi",
  CASTLE_HOLDINGS = "Castle Holdings",
  ISKRA = "Iskra",
  HWAJIN = "Hwajin",
  HOTEL_CASTLE = "Hotel Castle",
  HASUNG = "Hasung",
  MORI = "Mori",
  ADVANCED_TRADE = "Advanced Trade",
  IWASHIRO = "Iwashiro (Japan)",
  OTHER = "Other"
}

export enum Tier {
  EX = 'EX',
  SSS = 'SSS',
  SS = 'SS',
  S = 'S',
  AA = 'AA',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export interface Character {
  id: string;
  name: string;
  version: string;
  imageUrl: string;
  description: string;
  faction: string; // Changed from Faction enum to string to support custom factions
  wikiLink?: string;
  
  // Elo Ratings
  overallElo: number;
  handToHandElo: number;
  bladedWeaponsElo: number;
  firearmsElo: number;
  battleIqElo: number;
  physicalStatsElo: number; // Legacy mapping
  speedElo: number;
  durabilityElo: number;
  staminaElo: number;
  assassinationElo: number;

  // Stats
  wins: number;
  losses: number;
  matchHistory: MatchResult[];
}

export interface MatchResult {
  opponentId: string;
  opponentName: string;
  result: 'WIN' | 'LOSS';
  eloChange: number;
  date: number;
  scenarioDescription?: string;
}

export enum StatCategory {
  OVERALL = 'overallElo',
  HAND_TO_HAND = 'handToHandElo',
  BLADED = 'bladedWeaponsElo',
  FIREARMS = 'firearmsElo',
  BATTLE_IQ = 'battleIqElo',
  PHYSICAL = 'physicalStatsElo',
  SPEED = 'speedElo',
  DURABILITY = 'durabilityElo',
  STAMINA = 'staminaElo',
  ASSASSINATION = 'assassinationElo'
}

export interface ScenarioLocation {
  id: string;
  name: string;
}

export interface ScenarioWeapon {
  id: string;
  name: string;
}

export interface ScenarioFormat {
  id: string;
  name: string;
}

export interface ActiveScenario {
  location: ScenarioLocation;
  weapon: ScenarioWeapon;
  format: ScenarioFormat;
  affectedCategories: StatCategory[];
}

export interface VoteResult {
  winnerId: string;
  loserId: string;
  winnerNewElo: number;
  loserNewElo: number;
  eloChange: number;
}
