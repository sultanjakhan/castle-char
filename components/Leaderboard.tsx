import React, { useState, useEffect } from 'react';
import { Character, StatCategory, Tier } from '../types';
import { getCharacters } from '../services/supabaseService';
import { getTier } from './CharacterCard';
import { TIER_COLORS, STAT_LABELS } from '../constants';
import { Search, User, Pencil } from 'lucide-react';

interface LeaderboardProps {
  onSelectCharacter: (id: string) => void;
  onEditCharacter: (character: Character) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onSelectCharacter, onEditCharacter }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [sortBy, setSortBy] = useState<StatCategory>(StatCategory.OVERALL);
  const [filterText, setFilterText] = useState('');
  
  useEffect(() => {
    const loadCharacters = async () => {
      const chars = await getCharacters();
      setCharacters(chars);
    };
    loadCharacters();
  }, []);

  const sortedCharacters = [...characters]
    .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const categories = [
    { id: StatCategory.OVERALL, label: 'Overall' },
    { id: StatCategory.HAND_TO_HAND, label: 'Hand-to-Hand' },
    { id: StatCategory.BLADED, label: 'Bladed' },
    { id: StatCategory.FIREARMS, label: 'Firearms' },
    { id: StatCategory.BATTLE_IQ, label: 'Battle IQ' },
    { id: StatCategory.PHYSICAL, label: 'Physical' },
    { id: StatCategory.ASSASSINATION, label: 'Assassination' },
  ];

  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-sm border border-neutral-800 shadow-2xl overflow-hidden min-h-[80vh]">
      
      {/* Header Controls */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
             Leaderboards
          </h2>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="SEARCH FIGHTER..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-neutral-200 pl-9 pr-4 py-2 rounded-sm text-xs font-mono uppercase focus:ring-1 focus:ring-red-900 focus:border-red-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 gap-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSortBy(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                sortBy === cat.id 
                  ? 'bg-red-900 text-white border border-red-700' 
                  : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700 hover:text-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 text-neutral-500 text-[10px] uppercase tracking-widest border-b border-neutral-800">
              <th className="p-4 font-semibold w-16 text-center">Rank</th>
              <th className="p-4 font-semibold">Fighter</th>
              <th className="p-4 font-semibold text-center">Tier</th>
              <th className="p-4 font-semibold text-right text-red-500">{STAT_LABELS[sortBy]}</th>
              <th className="p-4 font-semibold text-center hidden md:table-cell">Rec.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {sortedCharacters.map((char, index) => {
              const rating = char[sortBy];
              const tier = getTier(rating); 
              
              return (
                <tr 
                  key={char.id} 
                  onClick={() => onSelectCharacter(char.id)}
                  className="hover:bg-red-900/10 transition-colors cursor-pointer group"
                >
                  <td className="p-4 text-center font-mono text-neutral-500 group-hover:text-red-500 text-lg font-bold">
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-neutral-900 flex-shrink-0 border border-neutral-800 flex items-center justify-center overflow-hidden relative">
                        {char.imageUrl ? (
                           <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                        ) : (
                           <User className="w-5 h-5 text-neutral-700" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <div className="font-bold text-neutral-200 text-sm uppercase tracking-wide group-hover:text-red-400 transition-colors">{char.name}</div>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               onEditCharacter(char);
                             }}
                             className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-white transition-opacity p-1"
                           >
                              <Pencil className="w-3 h-3" />
                           </button>
                        </div>
                        <div className="text-[9px] text-neutral-600 uppercase font-mono">{char.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black border ${TIER_COLORS[tier]}`}>
                      {tier}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-lg text-neutral-300">
                    {Math.round(rating)}
                  </td>
                  <td className="p-4 text-center text-[10px] text-neutral-600 hidden md:table-cell font-mono">
                    <span className="text-green-800">{char.wins}W</span> - <span className="text-red-900">{char.losses}L</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {sortedCharacters.length === 0 && (
        <div className="p-12 text-center text-neutral-500 flex flex-col items-center">
          <p>No fighters found.</p>
        </div>
      )}
    </div>
  );
};