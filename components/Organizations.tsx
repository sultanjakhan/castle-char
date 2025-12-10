
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { getCharacters } from '../services/storageService';
import { CharacterCard } from './CharacterCard';
import { Building2, ChevronRight, Eye } from 'lucide-react';

interface OrganizationsProps {
  onSelectCharacter: (id: string) => void;
  onSelectFaction: (faction: string) => void;
}

export const Organizations: React.FC<OrganizationsProps> = ({ onSelectCharacter, onSelectFaction }) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const getGroupedCharacters = () => {
    const groups: Record<string, Character[]> = {};
    characters.forEach(char => {
      const faction = char.faction || 'Unknown';
      if (!groups[faction]) groups[faction] = [];
      groups[faction].push(char);
    });
    return groups;
  };

  const grouped = getGroupedCharacters();
  const sortedFactions = Object.keys(grouped).sort();

  return (
    <div className="pb-20">
      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
        <Building2 className="w-8 h-8 text-red-600" />
        Organizations
      </h2>

      <div className="space-y-12">
        {sortedFactions.map(faction => {
          const factionChars = grouped[faction];
          if (factionChars.length === 0) return null;

          return (
            <div key={faction} className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group">
               {/* Faction Background Decoration */}
               <div className="absolute -right-10 -top-10 text-neutral-800/20 font-black text-9xl uppercase whitespace-nowrap pointer-events-none select-none group-hover:text-red-900/10 transition-colors">
                  {faction.substring(0, 3)}
               </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 mb-6 relative z-10 gap-4">
                <h3 
                  onClick={() => onSelectFaction(faction)}
                  className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors group/title"
                >
                  <span className="text-red-600 group-hover/title:text-red-500">{faction}</span> 
                  <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-1 rounded-full">{factionChars.length} Members</span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover/title:text-white group-hover/title:translate-x-1 transition-all" />
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
                {factionChars.slice(0, 5).map(char => (
                  <CharacterCard 
                    key={char.id} 
                    character={char} 
                    onClick={() => onSelectCharacter(char.id)}
                  />
                ))}
                {factionChars.length > 5 && (
                   <div 
                     onClick={() => onSelectFaction(faction)}
                     className="flex flex-col items-center justify-center border border-neutral-800 rounded-xl bg-black/20 text-neutral-500 hover:bg-red-900/20 hover:text-red-500 hover:border-red-900 transition-all cursor-pointer"
                   >
                      <span className="text-2xl font-bold">+{factionChars.length - 5}</span>
                      <span className="text-[10px] uppercase">More</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
