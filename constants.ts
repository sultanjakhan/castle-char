import { Character, Faction, ScenarioFormat, ScenarioLocation, ScenarioWeapon, StatCategory, Tier } from "./types";

export const INITIAL_ELO = 1200;
export const F_TIER_INITIAL_ELO = 400; // For F-tier characters (below 600 threshold)
export const K_FACTOR = 32;

// Characters that should start in F-tier
export const F_TIER_CHARACTER_IDS = [
  "lisa",
  "oijin",
  "kim-taehoon",
  "cheon-ildo",
  "shinsuke-iwashiro",
  "lim-jong-tae",
  "riwon-lee",
  "marina"
];

// 12-Tier System
export const TIER_THRESHOLDS = {
  [Tier.EX]: 2400,
  [Tier.SSS]: 2200,
  [Tier.SS]: 2000,
  [Tier.S]: 1800,
  [Tier.AA]: 1600,
  [Tier.A]: 1400,
  [Tier.B]: 1200,
  [Tier.C]: 1000,
  [Tier.D]: 800,
  [Tier.E]: 600,
  [Tier.F]: 0,
  [Tier.UNKNOWN]: -Infinity,
};

export const TIER_COLORS = {
  [Tier.EX]: "bg-gradient-to-r from-red-600 via-red-900 to-black text-white border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.8)]",
  [Tier.SSS]: "bg-red-800 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.5)]",
  [Tier.SS]: "bg-red-900 text-white border-red-600",
  [Tier.S]: "bg-orange-800 text-white border-orange-500",
  [Tier.AA]: "bg-orange-900/80 text-orange-100 border-orange-700",
  [Tier.A]: "bg-amber-900/80 text-amber-100 border-amber-700",
  [Tier.B]: "bg-purple-900/80 text-purple-100 border-purple-600",
  [Tier.C]: "bg-blue-900/80 text-blue-100 border-blue-600",
  [Tier.D]: "bg-slate-800 text-slate-300 border-slate-600",
  [Tier.E]: "bg-neutral-900 text-neutral-500 border-neutral-800",
  [Tier.F]: "bg-zinc-950 text-zinc-600 border-zinc-800",
  [Tier.UNKNOWN]: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 border-gray-700 border-dashed",
};

export const STAT_LABELS = {
  [StatCategory.OVERALL]: 'Overall',
  [StatCategory.HAND_TO_HAND]: 'Hand-to-Hand',
  [StatCategory.BLADED]: 'Bladed Weapons',
  [StatCategory.FIREARMS]: 'Firearms',
  [StatCategory.BATTLE_IQ]: 'Battle IQ',
  [StatCategory.PHYSICAL]: 'Physical',
  [StatCategory.SPEED]: 'Speed',
  [StatCategory.DURABILITY]: 'Durability',
  [StatCategory.STAMINA]: 'Stamina',
  [StatCategory.ASSASSINATION]: 'Assassination',
};

// Expanded Character List including Castle 2
export const INITIAL_CHARACTERS: Omit<Character, 'overallElo' | 'handToHandElo' | 'bladedWeaponsElo' | 'firearmsElo' | 'battleIqElo' | 'physicalStatsElo' | 'speedElo' | 'durabilityElo' | 'staminaElo' | 'assassinationElo' | 'wins' | 'losses' | 'matchHistory'>[] = [
  // BAEK-YI
  {
    id: "kim-shin-current",
    name: "Kim Shin",
    version: "Current",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/b/b7/Kim_Shin_%282%29.jpg",
    description: "Leader of Baek-Yi. The Tiger of Castle who seeks to dismantle the cartel.",
  },
  {
    id: "kim-shin-peak",
    name: "Kim Shin",
    version: "Peak (Amur)",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/b/b7/Kim_Shin_%282%29.jpg",
    description: "Kim Shin in his prime days as Amur, the legendary assassin of Iskra.",
  },
  {
    id: "seo-jintae",
    name: "Seo Jintae",
    version: "Current",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/9/90/Seo_Jintae.jpg",
    description: "Baek-Yi's number two. A master of knives and speed.",
  },
  {
    id: "pi-woojin",
    name: "Pi Woojin",
    version: "Current",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/8/87/Pi_Woojin.jpg",
    description: "A powerhouse with immense physical strength.",
  },
  {
    id: "kim-daegeon-peak",
    name: "Kim Daegeon",
    version: "Peak",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/1/18/Kim_Dae-Geon.jpg",
    description: "A warrior with an indomitable will.",
  },
  {
    id: "shin-tae-jin-peak",
    name: "Shin Tae-jin",
    version: "Peak",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/e/e2/Shin_Tae-Jin.jpg",
    description: "Kim Shin's mentor and a legend in the assassin world. 'Killer Shin'.",
  },
  {
    id: "pyo-young",
    name: "Pyo Young",
    version: "Current",
    faction: Faction.BAEK_YI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/07/Pyo_Young.jpg",
    description: "Agile assassin, skilled in using the environment.",
  },

  // CASTLE HOLDINGS
  {
    id: "choi-minwook",
    name: "Choi Minwook",
    version: "Current",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/6/67/Choi_Min-Wook.jpg",
    description: "The Chairman of Castle. The absolute authority.",
  },
  {
    id: "ma-hakyeong",
    name: "Ma Hakyeong",
    version: "Current",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/5/52/Ma_Hak-Yeong.jpg",
    description: "Leader of the Castle Guards. An unbreakable wall.",
  },
  {
    id: "ma-minhwi",
    name: "Ma Minhwi",
    version: "Current",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/7/7f/Ma_Min-Hwi.jpg",
    description: "Brother of Ma Hakyeong and Castle Guard Elite.",
  },
  {
    id: "nam-goong-hyuk",
    name: "Nam Goong-hyuk",
    version: "Peak",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/3/3d/Nam_Goong-Hyuk.jpg",
    description: "A monster of the Castle Guards who wields immense power.",
  },
  {
    id: "choi-dalcheon",
    name: "Choi Dalcheon",
    version: "Current",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/4/4c/Choi_Dal-Cheon.jpg",
    description: "Leader of Hweam. A tank with overwhelming physicals.",
  },
  {
    id: "jeongdan",
    name: "Jeongdan",
    version: "Current",
    faction: Faction.CASTLE_HOLDINGS,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/e/e9/Jeong_Dan.jpg",
    description: "A silent executioner for Castle.",
  },

  // ISKRA
  {
    id: "lisa",
    name: "Lisa",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/f/f0/Lisa.jpg",
    description: "Leader of Iskra. The mastermind behind the mercenaries.",
  },
  {
    id: "gustav",
    name: "Gustav",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/d/d7/Gustav.jpg",
    description: "A monster of pure durability and strength. Does not feel pain.",
  },
  {
    id: "aquila",
    name: "Aquila",
    version: "Peak",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/9/9d/Aquila.jpg",
    description: "The legendary sniper. Never misses a target.",
  },
  {
    id: "black-mamba",
    name: "Black Mamba",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/4/4b/Black_Mamba.jpg",
    description: "Current top killer of Iskra. Unrivaled technique.",
  },
  {
    id: "grolar",
    name: "Grolar",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/05/Grolar.jpg",
    description: "Savage fighter from Iskra's Free Soul team.",
  },
  {
    id: "frigate",
    name: "Frigate",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/9/91/Frigate.jpg",
    description: "A towering member of Iskra.",
  },
  {
    id: "doria",
    name: "Doria",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/a/a7/Doria.jpg",
    description: "Member of Hot Blood team. British mercenary.",
  },
  {
    id: "krupman",
    name: "Krupman",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/3/32/Krupman.jpg",
    description: "Precision expert.",
  },
  {
    id: "shamo",
    name: "Shamo",
    version: "Current",
    faction: Faction.ISKRA,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/5/56/Shamo.jpg",
    description: "Wild and unpredictable fighter.",
  },

  // HWAJIN
  {
    id: "yoo-woosung",
    name: "Yoo Woosung",
    version: "Current",
    faction: Faction.HWAJIN,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/c/c8/Yoo_Woo-Sung.jpg",
    description: "Leader of Hwajin. Ruthless, calculating, and deadly.",
  },
  {
    id: "li-chen",
    name: "Li Chen",
    version: "Current",
    faction: Faction.HWAJIN,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/d/d4/Li_Chen.jpg",
    description: "Hwajin's top martial artist.",
  },
  {
    id: "ling-ling",
    name: "Ling Ling",
    version: "Current",
    faction: Faction.HWAJIN,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/7/77/Ling_Ling.jpg",
    description: "Dangerous assassin from the mainland.",
  },
  {
    id: "yoo-ilseon",
    name: "Yoo Ilseon",
    version: "Current",
    faction: Faction.HWAJIN,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/7/73/Yoo_Il-Seon.jpg",
    description: "Yoo Woosung's brother. Skilled but arrogant.",
  },

  // ADVANCED TRADE / IWASHIRO
  {
    id: "baek-do-chan",
    name: "Baek Do Chan",
    version: "Peak",
    faction: Faction.ADVANCED_TRADE,
    imageUrl: "https://i.pinimg.com/736x/21/22/e3/2122e37943486395232709214b931988.jpg",
    description: "The Python. The former strongest killer who nearly killed Kim Shin.",
  },
  {
    id: "sasaki-shingen",
    name: "Sasaki Shingen",
    version: "Current",
    faction: Faction.IWASHIRO,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/4/4e/Sasaki_Shingen.jpg",
    description: "The master swordsman of the Iwashiro group. Rivals the top tiers.",
  },
  {
    id: "hide",
    name: "Hide",
    version: "Current",
    faction: Faction.IWASHIRO,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/3/36/Hide.jpg",
    description: "Japanese yakuza leader affiliated with Castle.",
  },

  // HASUNG
  {
    id: "ryu-jihak",
    name: "Ryu Jihak",
    version: "Current",
    faction: Faction.HASUNG,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/1/15/Ryu_Ji-Hak.jpg",
    description: "Hasung's finest masterpiece. Elegant and lethal swordsmanship.",
  },
  {
    id: "kim-taehoon",
    name: "Kim Taehoon",
    version: "Current",
    faction: Faction.HASUNG,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/4/48/Kim_Tae-Hoon.jpg",
    description: "Hasung Group leader. A strategist.",
  },

  // HOTEL CASTLE
  {
    id: "cheon-ildo",
    name: "Cheon Ildo",
    version: "Current",
    faction: Faction.HOTEL_CASTLE,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/b/b3/Cheon_Il-Do.jpg",
    description: "Representative of Hotel Castle.",
  },

  // MORI
  {
    id: "im-mooyeol",
    name: "Im Mooyeol",
    version: "Current",
    faction: Faction.MORI,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/a/a2/Im_Moo-Yeol.jpg",
    description: "Leader of Mori.",
  },

  // F-TIER CHARACTERS
  {
    id: "oijin",
    name: "Oijin",
    version: "Current",
    faction: Faction.OTHER,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/00/Oijin.jpg",
    description: "A minor character with limited combat abilities.",
  },
  {
    id: "shinsuke-iwashiro",
    name: "Shinsuke Iwashiro",
    version: "Current",
    faction: Faction.IWASHIRO,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/00/Shinsuke_Iwashiro.jpg",
    description: "Member of the Iwashiro group.",
  },
  {
    id: "lim-jong-tae",
    name: "Lim Jong-Tae",
    version: "Current",
    faction: Faction.OTHER,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/00/Lim_Jong-Tae.jpg",
    description: "A new character in the series.",
  },
  {
    id: "riwon-lee",
    name: "Riwon Lee",
    version: "Current",
    faction: Faction.OTHER,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/00/Riwon_Lee.jpg",
    description: "A new character in the series.",
  },
  {
    id: "marina",
    name: "Marina",
    version: "Current",
    faction: Faction.OTHER,
    imageUrl: "https://static.wikia.nocookie.net/castle-webtoon/images/0/00/Marina.jpg",
    description: "A new character in the series.",
  }
];

// Scenario Definitions
export const LOCATIONS: ScenarioLocation[] = [
  { id: "forest", name: "Dense Forest" },
  { id: "enclosed", name: "Enclosed Room (10x10m)" },
  { id: "open_field", name: "Open Field" },
  { id: "urban", name: "Urban Street (Night)" },
  { id: "rooftop", name: "Rooftop (Rain)" },
  { id: "underground", name: "Underground Bunker" },
  { id: "corridor", name: "Narrow Corridor" },
  { id: "warehouse", name: "Abandoned Warehouse" },
  { id: "shipping_container", name: "Shipping Container Maze" },
  { id: "moving_train", name: "Moving Train Top" },
  { id: "elevator", name: "Elevator (Restricted)" },
];

export const WEAPONS: ScenarioWeapon[] = [
  { id: "no_weapons", name: "No Weapons (Fists Only)" },
  { id: "bladed_only", name: "Bladed Weapons Only" },
  { id: "firearms_available", name: "Firearms Available" },
  { id: "limited_ammo", name: "Limited Ammo (1 Mag)" },
  { id: "improvised_weapons", name: "Improvised Weapons" },
  { id: "full_arsenal", name: "Full Arsenal" },
  { id: "sniper_rifle", name: "Sniper Rifles (Start 1km)" },
  { id: "dual_knives", name: "Dual Combat Knives" },
];

export const FORMATS: ScenarioFormat[] = [
  { id: "1v1", name: "1 vs 1 Duel" },
  { id: "with_minions", name: "With 5 Minions Each" },
  { id: "ambush", name: "Ambush (One side attacks)" },
  { id: "assassination", name: "Assassination Attempt" },
  { id: "prolonged_battle", name: "Prolonged Battle (Stamina)" },
  { id: "blitz_attack", name: "Blitz Attack" },
  { id: "cage_match", name: "Cage Match (No Escape)" },
  { id: "protect_vip", name: "Protect VIP" },
  { id: "nightmare", name: "Nightmare Fuel (Injured Start)" },
  { id: "car_chase", name: "High Speed Car Chase" },
  { id: "pitch_black", name: "Pitch Black (No Vision)" },
  { id: "sniper_duel", name: "Sniper Duel" },
  { id: "battle_royale", name: "Chaos (Interference allowed)" }
];

// Mappings for Auto-Detection
export const SCENARIO_MAPPING: Record<string, StatCategory[]> = {
  // Locations
  "forest": [StatCategory.ASSASSINATION, StatCategory.BATTLE_IQ],
  "enclosed": [StatCategory.HAND_TO_HAND, StatCategory.DURABILITY],
  "open_field": [StatCategory.FIREARMS, StatCategory.SPEED],
  "urban": [StatCategory.BATTLE_IQ, StatCategory.ASSASSINATION],
  "rooftop": [StatCategory.HAND_TO_HAND, StatCategory.SPEED],
  "underground": [StatCategory.HAND_TO_HAND, StatCategory.BLADED],
  "corridor": [StatCategory.HAND_TO_HAND, StatCategory.BLADED],
  "warehouse": [StatCategory.BATTLE_IQ, StatCategory.ASSASSINATION],
  "shipping_container": [StatCategory.ASSASSINATION, StatCategory.BATTLE_IQ],
  "moving_train": [StatCategory.BATTLE_IQ, StatCategory.SPEED],
  "elevator": [StatCategory.HAND_TO_HAND, StatCategory.DURABILITY],

  // Weapons
  "no_weapons": [StatCategory.HAND_TO_HAND, StatCategory.DURABILITY],
  "bladed_only": [StatCategory.BLADED, StatCategory.SPEED],
  "firearms_available": [StatCategory.FIREARMS],
  "limited_ammo": [StatCategory.FIREARMS, StatCategory.BATTLE_IQ],
  "improvised_weapons": [StatCategory.BATTLE_IQ, StatCategory.HAND_TO_HAND],
  "full_arsenal": [StatCategory.BATTLE_IQ, StatCategory.FIREARMS, StatCategory.BLADED],
  "sniper_rifle": [StatCategory.FIREARMS, StatCategory.BATTLE_IQ],
  "dual_knives": [StatCategory.BLADED, StatCategory.SPEED],

  // Formats
  "1v1": [StatCategory.HAND_TO_HAND, StatCategory.DURABILITY],
  "with_minions": [StatCategory.BATTLE_IQ],
  "ambush": [StatCategory.ASSASSINATION, StatCategory.BATTLE_IQ],
  "assassination": [StatCategory.ASSASSINATION, StatCategory.BATTLE_IQ],
  "prolonged_battle": [StatCategory.STAMINA, StatCategory.DURABILITY],
  "blitz_attack": [StatCategory.ASSASSINATION, StatCategory.SPEED],
  "cage_match": [StatCategory.HAND_TO_HAND, StatCategory.DURABILITY],
  "protect_vip": [StatCategory.BATTLE_IQ, StatCategory.DURABILITY],
  "nightmare": [StatCategory.STAMINA, StatCategory.BATTLE_IQ],
  "car_chase": [StatCategory.FIREARMS, StatCategory.BATTLE_IQ],
  "pitch_black": [StatCategory.ASSASSINATION, StatCategory.BATTLE_IQ],
  "sniper_duel": [StatCategory.FIREARMS, StatCategory.BATTLE_IQ],
  "battle_royale": [StatCategory.STAMINA, StatCategory.BATTLE_IQ]
};
