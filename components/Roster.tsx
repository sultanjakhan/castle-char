
import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { getCharacters, deleteCharacter } from '../services/storageService';
import { CharacterCard } from './CharacterCard';
import { Search, Users, Trash2 } from 'lucide-react';

interface RosterProps {
  onEditCharacter: (character: Character) => void;
  onSelectCharacter: (id: string) => void;
  onRefresh: () => void;
}

export const Roster: React.FC<RosterProps> = ({ onEditCharacter, onSelectCharacter, onRefresh }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) {
      deleteCharacter(id);
      setCharacters(getCharacters());
      onRefresh();
    }
  };

  // Group characters by name to show only one card per character name (main version)
  const getUniqueCharacters = (chars: Character[]) => {
    const uniqueMap = new Map<string, Character>();
    chars.forEach(c => {
      // Logic to pick the "best" representative? Or just the first one.
      // Let's try to pick "Current" if available, otherwise just first.
      if (!uniqueMap.has(c.name)) {
        uniqueMap.set(c.name, c);
      } else {
        const existing = uniqueMap.get(c.name)!;
        if (c.version.toLowerCase() === 'current' && existing.version.toLowerCase() !== 'current') {
           uniqueMap.set(c.name, c);
        }
      }
    });
    return Array.from(uniqueMap.values());
  };

  const filtered = characters.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.version.toLowerCase().includes(search.toLowerCase()) ||
    (c.faction && c.faction.toLowerCase().includes(search.toLowerCase()))
  );

  const displayCharacters = search ? filtered : getUniqueCharacters(filtered);

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
          <Users className="w-8 h-8 text-red-600" />
          Full Roster
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search roster..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black border border-neutral-800 text-neutral-200 pl-9 pr-4 py-2 rounded-sm text-xs font-mono uppercase focus:ring-1 focus:ring-red-900 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayCharacters.map(char => (
          <div key={char.id} className="relative group">
            <CharacterCard 
              character={char} 
              onEdit={onEditCharacter}
              onClick={() => onSelectCharacter(char.id)}
              hideVersionBadge={true} // Hide version on roster
            />
            
            {/* Delete Button (Only visible on hover) */}
            <button 
              onClick={(e) => handleDelete(e, char.id, char.name)}
              className="absolute top-12 left-3 z-20 p-1.5 rounded bg-black/80 hover:bg-red-600 text-neutral-400 hover:text-white border border-neutral-700 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Character"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
         <div className="text-center py-20 text-neutral-500">No characters found.</div>
      )}
    </div>
  );
};
