
import React, { useEffect, useState } from 'react';
import { Character, StatCategory } from '../types';
import { getCharacterById, getCharacters } from '../services/storageService';
import { getTier } from './CharacterCard';
import { TIER_COLORS } from '../constants';
import { ArrowLeft, History, Trophy, TrendingUp, Users, Plus } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { ImageWithFallback } from './ImageWithFallback';

interface CharacterProfileProps {
  characterId: string;
  onBack: () => void;
  onAddVersion?: (baseChar: Character) => void;
}

export const CharacterProfile: React.FC<CharacterProfileProps> = ({ characterId, onBack, onAddVersion }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [allVersions, setAllVersions] = useState<Character[]>([]);

  useEffect(() => {
    const char = getCharacterById(characterId);
    if (char) {
       setCharacter(char);
       // Fetch all versions based on name matching
       const all = getCharacters();
       const related = all.filter(c => c.name.toLowerCase() === char.name.toLowerCase());
       // Sort versions: Current first, then others alphabetically or by some logic
       setAllVersions(related);
    }
  }, [characterId]);

  if (!character) return <div>Loading...</div>;

  const tier = getTier(character.overallElo);

  const chartData = [
    { subject: 'Hand-to-Hand', A: character.handToHandElo, fullMark: 2000 },
    { subject: 'Bladed', A: character.bladedWeaponsElo, fullMark: 2000 },
    { subject: 'Firearms', A: character.firearmsElo, fullMark: 2000 },
    { subject: 'Battle IQ', A: character.battleIqElo, fullMark: 2000 },
    { subject: 'Physical', A: character.physicalStatsElo, fullMark: 2000 },
    { subject: 'Assassination', A: character.assassinationElo, fullMark: 2000 },
  ];

  const handleSwitchVersion = (id: string) => {
     const newChar = getCharacterById(id);
     if (newChar) setCharacter(newChar);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-400 hover:text-white transition-colors gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
      </button>

      {/* VERSION TABS */}
      <div className="flex items-center gap-2 border-b border-neutral-800 overflow-x-auto pb-1">
        {allVersions.length > 0 && allVersions.map(v => (
          <button
            key={v.id}
            onClick={() => handleSwitchVersion(v.id)}
            className={`
               px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-t-lg transition-colors whitespace-nowrap
               ${character.id === v.id 
                 ? 'bg-neutral-900 text-red-500 border-t border-x border-neutral-800' 
                 : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50'}
            `}
          >
            {v.version}
          </button>
        ))}
        {onAddVersion && (
          <button 
            onClick={() => onAddVersion(character)}
            className="px-3 py-2 text-xs font-bold uppercase text-neutral-600 hover:text-green-500 hover:bg-neutral-900 rounded flex items-center gap-1 transition-colors"
            title="Create new version"
          >
            <Plus className="w-3 h-3" /> Add Version
          </button>
        )}
      </div>

      {/* PROFILE CONTENT */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
        <div className="absolute top-0 right-0 p-32 bg-red-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-full md:w-1/3 max-w-sm mx-auto">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700">
               <ImageWithFallback 
                 src={character.imageUrl} 
                 name={character.name}
                 alt={character.name} 
                 className="w-full h-full object-cover" 
                />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <span className={`px-3 py-1 rounded text-lg font-black border shadow-lg ${TIER_COLORS[tier]}`}>
                TIER {tier}
              </span>
              <span className="text-slate-500 font-mono text-sm border border-slate-700 px-2 py-1 rounded">
                {character.faction}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              {character.name} <span className="text-neutral-600 text-2xl align-top ml-2">{character.version}</span>
            </h1>
            
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              {character.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 text-sm uppercase mb-1">
                    <Trophy className="w-4 h-4" /> Overall Elo
                  </div>
                  <div className="text-3xl font-bold text-red-500">{character.overallElo}</div>
               </div>
               <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 text-sm uppercase mb-1">
                    <TrendingUp className="w-4 h-4" /> Win Rate
                  </div>
                  <div className="text-3xl font-bold text-slate-200">
                    {character.wins + character.losses > 0 
                      ? Math.round((character.wins / (character.wins + character.losses)) * 100)
                      : 0}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{character.wins}W - {character.losses}L</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" /> Combat Parameters
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[1000, 2000]} tick={false} axisLine={false} />
                <Radar
                  name={character.name}
                  dataKey="A"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fill="#ef4444"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-5 h-5 text-red-500" /> Battle History ({character.version})
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
             {character.matchHistory.length === 0 ? (
               <div className="text-slate-500 text-center py-10">No matches recorded yet.</div>
             ) : (
               character.matchHistory.map((match, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${match.result === 'WIN' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
                        {match.result}
                      </span>
                      <span className="text-slate-300 font-medium text-sm">vs. {match.opponentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${match.eloChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                      </span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
