
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Character, VoteResult, ActiveScenario, StatCategory, ScenarioLocation, ScenarioWeapon, ScenarioFormat } from '../types';
import { getCharacters, updateCharactersAfterVote } from '../services/supabaseService';
import { applyVote } from '../services/eloService';
import { CharacterCard } from './CharacterCard';
import { LOCATIONS, WEAPONS, FORMATS, SCENARIO_MAPPING, STAT_LABELS } from '../constants';
import { Shuffle, Swords, Shield, Crosshair, MapPin, Skull, Play, RefreshCw, Settings2, Search, ChevronDown, HelpCircle, X, BarChart3, History } from 'lucide-react';

interface VotingArenaProps {
  mode: 'random' | 'custom';
  onVoteComplete: () => void;
}

// Helper Component for Searchable Character Select
const CharacterSearchSelect: React.FC<{
  label: string;
  value: string;
  characters: Character[];
  onChange: (id: string) => void;
}> = ({ label, value, characters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedChar = characters.find(c => c.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredChars = characters.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.version.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-slate-400 text-sm mb-2">{label}</label>
      <div 
        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white flex justify-between items-center cursor-pointer hover:border-slate-500 transition-colors"
        onClick={() => {
           setIsOpen(!isOpen);
           // If opening, focus search?
        }}
      >
        <span className={selectedChar ? "text-white" : "text-slate-500"}>
          {selectedChar ? `${selectedChar.name} (${selectedChar.version})` : "Select Character"}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-black border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-slate-800 bg-slate-900 sticky top-0">
            <div className="relative">
              <Search className="absolute left-2 top-2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 pl-8 text-sm text-white focus:outline-none focus:border-red-900"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredChars.map(c => (
              <div 
                key={c.id}
                onClick={() => {
                  onChange(c.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`p-3 text-sm cursor-pointer hover:bg-red-900/20 flex items-center gap-3 border-b border-white/5 ${value === c.id ? 'bg-red-900/10 text-red-500' : 'text-slate-300'}`}
              >
                <div className="w-8 h-8 rounded bg-slate-800 overflow-hidden flex-shrink-0">
                  {c.imageUrl && <img src={c.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{c.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{c.version}</span>
                </div>
              </div>
            ))}
            {filteredChars.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-xs">No fighters found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const VotingArena: React.FC<VotingArenaProps> = ({ mode, onVoteComplete }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [contenders, setContenders] = useState<[Character, Character] | null>(null);
  const [activeScenario, setActiveScenario] = useState<ActiveScenario | null>(null);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Custom Mode State
  const [setupMode, setSetupMode] = useState(mode === 'custom');
  const [customChar1Id, setCustomChar1Id] = useState<string>('');
  const [customChar2Id, setCustomChar2Id] = useState<string>('');
  const [customLocationId, setCustomLocationId] = useState<string>('random');
  const [customWeaponId, setCustomWeaponId] = useState<string>('random');
  const [customFormatId, setCustomFormatId] = useState<string>('random');

  useEffect(() => {
    const loadCharacters = async () => {
      const chars = await getCharacters(false); // Don't load history for faster loading
      setCharacters(chars);
    };
    loadCharacters();
    // If mode switches to random, ensure we exit setup mode
    if (mode === 'random') {
      setSetupMode(false);
    } else {
      setSetupMode(true);
    }
  }, [mode]);

  // Helper to get affected categories from IDs
  const getAffectedCategories = (locId: string, wepId: string, fmtId: string): StatCategory[] => {
    const cats = [
      ...(SCENARIO_MAPPING[locId] || []),
      ...(SCENARIO_MAPPING[wepId] || []),
      ...(SCENARIO_MAPPING[fmtId] || [])
    ];
    // Deduplicate
    return Array.from(new Set(cats));
  };

  const generateScenario = (locId?: string, wepId?: string, fmtId?: string): ActiveScenario => {
    const loc = locId && locId !== 'random' 
      ? LOCATIONS.find(l => l.id === locId)! 
      : LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    
    const wep = wepId && wepId !== 'random'
      ? WEAPONS.find(w => w.id === wepId)!
      : WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
      
    const fmt = fmtId && fmtId !== 'random'
      ? FORMATS.find(f => f.id === fmtId)!
      : FORMATS[Math.floor(Math.random() * FORMATS.length)];

    return {
      location: loc,
      weapon: wep,
      format: fmt,
      affectedCategories: getAffectedCategories(loc.id, wep.id, fmt.id)
    };
  };

  const startRandomMatch = useCallback(() => {
    if (characters.length < 2) return;
    
    setIsAnimating(true);
    setVoteResult(null);

    setTimeout(() => {
      let idx1 = Math.floor(Math.random() * characters.length);
      let idx2 = Math.floor(Math.random() * characters.length);
      while (idx1 === idx2) idx2 = Math.floor(Math.random() * characters.length);
      
      setContenders([characters[idx1], characters[idx2]]);
      setActiveScenario(generateScenario());
      setIsAnimating(false);
    }, 300);
  }, [characters]);

  // Initial load for random
  useEffect(() => {
    if (mode === 'random' && !contenders && characters.length > 0) {
      startRandomMatch();
    }
  }, [mode, characters, contenders, startRandomMatch]);

  const startCustomMatch = () => {
    if (!customChar1Id || !customChar2Id || customChar1Id === customChar2Id) {
      alert("Please select two different characters.");
      return;
    }
    const c1 = characters.find(c => c.id === customChar1Id);
    const c2 = characters.find(c => c.id === customChar2Id);
    if (!c1 || !c2) return;

    setContenders([c1, c2]);
    setActiveScenario(generateScenario(customLocationId, customWeaponId, customFormatId));
    setSetupMode(false);
    setVoteResult(null);
  };

  const handleVote = async (winner: Character, loser: Character) => {
    if (voteResult || !activeScenario) return;

    // Apply vote to Overall + Affected Categories
    const categoriesToUpdate = [StatCategory.OVERALL, ...activeScenario.affectedCategories];
    
    const result = applyVote(winner, loser, categoriesToUpdate);
    await updateCharactersAfterVote(result.winner, result.loser);
    
    setVoteResult({
      winnerId: winner.id,
      loserId: loser.id,
      winnerNewElo: result.winner.overallElo,
      loserNewElo: result.loser.overallElo,
      eloChange: result.change
    });

    onVoteComplete();
  };

  const handleNext = () => {
    if (mode === 'random') {
      startRandomMatch();
    } else {
      setSetupMode(true);
      setContenders(null);
      setVoteResult(null);
    }
  };

  // Calculate Win Probability based on Elo
  const getWinProbability = (eloA: number, eloB: number) => {
    const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
    return Math.round(expectedA * 100);
  };

  // Calculate Historical Head-to-Head
  const getHeadToHead = (charA: Character, charB: Character) => {
    const aWins = charA.matchHistory.filter(m => m.opponentId === charB.id && m.result === 'WIN').length;
    const bWins = charB.matchHistory.filter(m => m.opponentId === charA.id && m.result === 'WIN').length;
    const total = aWins + bWins;
    return { aWins, bWins, total };
  };

  // ------------------------------------------------------------------
  // RENDER: SETUP MODE (Custom Only)
  // ------------------------------------------------------------------
  if (setupMode) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Settings2 className="text-red-500" /> Custom Battle Setup
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <CharacterSearchSelect 
               label="Fighter 1" 
               value={customChar1Id} 
               characters={characters} 
               onChange={setCustomChar1Id} 
             />
             <CharacterSearchSelect 
               label="Fighter 2" 
               value={customChar2Id} 
               characters={characters} 
               onChange={setCustomChar2Id} 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 text-xs uppercase mb-2">Location</label>
              <select 
                value={customLocationId} 
                onChange={e => setCustomLocationId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200"
              >
                <option value="random">Random Location</option>
                {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase mb-2">Weapon</label>
              <select 
                value={customWeaponId} 
                onChange={e => setCustomWeaponId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200"
              >
                <option value="random">Random Weapon</option>
                {WEAPONS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs uppercase mb-2">Format</label>
              <select 
                value={customFormatId} 
                onChange={e => setCustomFormatId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200"
              >
                <option value="random">Random Format</option>
                {FORMATS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={startCustomMatch}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" /> START BATTLE
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: BATTLE ARENA
  // ------------------------------------------------------------------
  if (!contenders || !activeScenario) return <div className="text-center py-20 animate-pulse text-slate-500">Entering Arena...</div>;

  const winProb1 = getWinProbability(contenders[0].overallElo, contenders[1].overallElo);
  const winProb2 = 100 - winProb1;
  const history = getHeadToHead(contenders[0], contenders[1]);

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500 relative">
      
      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm shadow-2xl relative">
              <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white mb-4">Impact System</h3>
              <p className="text-sm text-slate-300 mb-4">
                Different scenarios test different skills. When you vote in this match, the winner gains Elo points in:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-400 space-y-2 mb-4">
                <li><span className="text-red-400 font-bold">Overall Rating</span> (Always)</li>
                <li>Specific categories listed below the scenario (e.g., Battle IQ, Firearms).</li>
              </ul>
              <p className="text-xs text-slate-500 italic">
                Example: Winning a "Sniper Duel" boosts "Firearms" rating significantly more than a fist fight would.
              </p>
           </div>
        </div>
      )}

      {/* Scenario Card */}
      <div className="w-full max-w-3xl mb-8 relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-slate-600 rounded-xl opacity-20 group-hover:opacity-40 transition blur"></div>
         <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => setShowHelp(true)}
                className="text-slate-600 hover:text-red-500 transition-colors"
                title="How does this affect ratings?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
              <Crosshair className="w-4 h-4 text-red-500" /> Battle Scenario
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="flex flex-col items-center justify-center p-2">
                 <MapPin className="w-5 h-5 text-slate-500 mb-2" />
                 <span className="text-lg font-bold text-slate-200">{activeScenario.location.name}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                 <Skull className="w-5 h-5 text-slate-500 mb-2" />
                 <span className="text-lg font-bold text-slate-200">{activeScenario.weapon.name}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                 <Swords className="w-5 h-5 text-slate-500 mb-2" />
                 <span className="text-lg font-bold text-slate-200">{activeScenario.format.name}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-xs text-slate-500 uppercase font-semibold mr-2">Impacts:</span>
              <div className="inline-flex flex-wrap gap-2 justify-center">
                <span className="bg-red-900/30 text-red-400 text-xs px-2 py-0.5 rounded border border-red-900/50">Overall</span>
                {activeScenario.affectedCategories.map(cat => (
                  <span key={cat} className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700">
                    {STAT_LABELS[cat]}
                  </span>
                ))}
              </div>
            </div>
         </div>
      </div>

      {/* Info Bars */}
      {!voteResult && (
        <div className="w-full max-w-2xl mb-8 space-y-4">
           {/* Win Probability */}
           <div>
              <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold mb-1 px-1">
                <span>{contenders[0].name} ({winProb1}%)</span>
                <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3"/> Win Probability</span>
                <span>{contenders[1].name} ({winProb2}%)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${winProb1}%` }}></div>
                <div className="bg-slate-700 h-full transition-all duration-1000" style={{ width: `${winProb2}%` }}></div>
              </div>
           </div>

           {/* Historical Head-to-Head - SHOW ALWAYS to prove feature exists */}
           <div className="bg-black/40 p-2 rounded border border-neutral-800 flex justify-between items-center px-4 animate-in fade-in">
              <span className={`text-xs font-bold ${history.aWins > history.bWins ? 'text-green-400' : 'text-neutral-400'}`}>{history.aWins} Wins</span>
              <span className="text-[10px] uppercase text-neutral-600 flex items-center gap-1">
                <History className="w-3 h-3" /> Historical Matchup
              </span>
              <span className={`text-xs font-bold ${history.bWins > history.aWins ? 'text-green-400' : 'text-neutral-400'}`}>{history.bWins} Wins</span>
           </div>
        </div>
      )}

      {/* Fighters */}
      <div className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* Fighter 1 */}
        <div className="w-full md:w-5/12 max-w-sm transition-transform hover:scale-[1.02]">
          <CharacterCard 
            character={contenders[0]} 
            onClick={() => handleVote(contenders[0], contenders[1])}
            selected={voteResult?.winnerId === contenders[0].id}
            disabled={!!voteResult && voteResult.winnerId !== contenders[0].id}
          />
          {voteResult && voteResult.winnerId === contenders[0].id && (
             <div className="mt-4 text-center animate-bounce text-green-400 font-bold text-xl">
               +{voteResult.eloChange} ELO
             </div>
          )}
          {voteResult && voteResult.loserId === contenders[0].id && (
             <div className="mt-4 text-center text-red-400 font-bold text-xl">
               -{voteResult.eloChange} ELO
             </div>
          )}
        </div>

        {/* VS Badge */}
        <div className="relative z-10 flex-shrink-0">
          <div className="bg-slate-950 rounded-full p-6 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
            <span className="text-4xl font-black text-slate-200 italic pr-1">VS</span>
          </div>
        </div>

        {/* Fighter 2 */}
        <div className="w-full md:w-5/12 max-w-sm transition-transform hover:scale-[1.02]">
          <CharacterCard 
            character={contenders[1]} 
            onClick={() => handleVote(contenders[1], contenders[0])}
            selected={voteResult?.winnerId === contenders[1].id}
            disabled={!!voteResult && voteResult.winnerId !== contenders[1].id}
          />
          {voteResult && voteResult.winnerId === contenders[1].id && (
             <div className="mt-4 text-center animate-bounce text-green-400 font-bold text-xl">
               +{voteResult.eloChange} ELO
             </div>
          )}
          {voteResult && voteResult.loserId === contenders[1].id && (
             <div className="mt-4 text-center text-red-400 font-bold text-xl">
               -{voteResult.eloChange} ELO
             </div>
          )}
        </div>
      </div>

      {/* Next Match Action */}
      {voteResult && (
        <div className="mt-12 animate-in slide-in-from-bottom-4 fade-in duration-300 pb-10">
          <button 
            onClick={handleNext}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-600 font-lg rounded-full hover:bg-red-700 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          >
            {mode === 'random' ? (
              <>
                <Shuffle className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                NEXT BATTLE
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                NEW SETUP
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
