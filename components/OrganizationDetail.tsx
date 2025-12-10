
import React, { useState, useEffect } from 'react';
import { Character, Faction } from '../types';
import { getCharacters, saveCharacterDetails, getOrgDescription, saveOrgDescription, addCharacter } from '../services/storageService';
import { CharacterCard, getTier } from './CharacterCard';
import { ArrowLeft, UserPlus, TrendingUp, Users, Shield, Zap, Pencil, Trash2, PlusCircle, Save } from 'lucide-react';
import { TIER_COLORS } from '../constants';
import { CharacterEditor } from './CharacterEditor';

interface OrganizationDetailProps {
  faction: string;
  onBack: () => void;
  onSelectCharacter: (id: string) => void;
  onDataChange: () => void;
}

export const OrganizationDetail: React.FC<OrganizationDetailProps> = ({ faction, onBack, onSelectCharacter, onDataChange }) => {
  const [members, setMembers] = useState<Character[]>([]);
  const [availableRecruits, setAvailableRecruits] = useState<Character[]>([]);
  const [isRecruiting, setIsRecruiting] = useState(false);
  
  // Description Edit State
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState('');

  // Create New Character State (from recruit modal)
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    loadData();
    const desc = getOrgDescription(faction);
    setDescription(desc);
    setEditedDesc(desc);
  }, [faction]);

  const loadData = () => {
    const all = getCharacters();
    setMembers(all.filter(c => c.faction === faction).sort((a, b) => b.overallElo - a.overallElo));
    setAvailableRecruits(all.filter(c => c.faction !== faction).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const avgElo = members.length > 0 
    ? Math.round(members.reduce((acc, c) => acc + c.overallElo, 0) / members.length) 
    : 0;
  
  const avgTier = getTier(avgElo);

  const handleRecruit = (char: Character) => {
    const updated = { ...char, faction: faction };
    saveCharacterDetails(updated);
    onDataChange();
    loadData(); // Reload local state
    setIsRecruiting(false);
  };

  const handleKick = (e: React.MouseEvent, char: Character) => {
    e.stopPropagation();
    if(confirm(`Remove ${char.name} from ${faction}?`)) {
      const updated = { ...char, faction: Faction.OTHER };
      saveCharacterDetails(updated);
      onDataChange();
      loadData();
    }
  };

  const saveDescription = () => {
    saveOrgDescription(faction, editedDesc);
    setDescription(editedDesc);
    setIsEditingDesc(false);
  };

  const handleCreateNewSave = (data: any) => {
      // Data from editor comes with the ID already, we just save it using the App's normal flow effectively
      // But since we are inside a component, we can call saveCharacterDetails directly if it's new.
      // Wait, the main App.tsx handles saving via props usually, but here we can use the service.
      // We need to ensure the faction is set to THIS faction.
      const newCharData = { ...data, faction: faction };
      
      addCharacter(newCharData);
      
      onDataChange();
      loadData();
      setIsCreatingNew(false);
      setIsRecruiting(false);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Organizations
      </button>

      {/* Header Banner */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-red-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="text-xs uppercase text-red-500 font-bold tracking-widest mb-2">Organization Profile</div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">{faction}</h1>
            
            {isEditingDesc ? (
              <div className="flex gap-2 max-w-xl">
                <textarea 
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full bg-black/50 border border-neutral-700 rounded p-2 text-neutral-200 text-sm focus:border-red-500 outline-none"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                   <button onClick={saveDescription} className="p-2 bg-red-600 rounded text-white hover:bg-red-700"><Save className="w-4 h-4"/></button>
                   <button onClick={() => setIsEditingDesc(false)} className="p-2 bg-neutral-700 rounded text-white hover:bg-neutral-600"><ArrowLeft className="w-4 h-4"/></button>
                </div>
              </div>
            ) : (
              <div className="group flex items-start gap-2 max-w-xl">
                 <p className="text-neutral-400 leading-relaxed">{description}</p>
                 <button 
                   onClick={() => setIsEditingDesc(true)}
                   className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-white transition-opacity pt-1"
                 >
                   <Pencil className="w-3 h-3" />
                 </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="bg-black/50 p-4 rounded-lg border border-neutral-800 text-center min-w-[100px]">
              <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1 flex justify-center items-center gap-1">
                 <Shield className="w-3 h-3" /> Avg Power
              </div>
              <div className={`text-2xl font-black ${avgElo > 2000 ? 'text-red-500' : 'text-white'}`}>{avgElo}</div>
              <div className={`text-[10px] px-2 py-0.5 rounded mt-1 inline-block ${TIER_COLORS[avgTier]}`}>Tier {avgTier}</div>
            </div>
            
            <div className="bg-black/50 p-4 rounded-lg border border-neutral-800 text-center min-w-[100px]">
              <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1 flex justify-center items-center gap-1">
                 <Users className="w-3 h-3" /> Members
              </div>
              <div className="text-2xl font-black text-white">{members.length}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
           <button 
             onClick={() => setIsRecruiting(true)}
             className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
           >
             <UserPlus className="w-4 h-4" /> Recruit Member
           </button>
        </div>
      </div>

      {/* Members Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           <Zap className="w-5 h-5 text-yellow-500" /> Key Operatives
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {members.map(char => (
            <div key={char.id} className="relative group">
              <CharacterCard 
                character={char} 
                onClick={() => onSelectCharacter(char.id)}
              />
              <button 
                onClick={(e) => handleKick(e, char)}
                className="absolute top-2 right-2 bg-black/80 p-1.5 rounded text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border border-neutral-800"
                title="Remove from Organization"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-600 bg-neutral-900/30 rounded border border-neutral-800 border-dashed">
              No members recorded in this faction yet.
            </div>
          )}
        </div>
      </div>

      {/* Recruitment Modal */}
      {isRecruiting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-white uppercase">Recruit to {faction}</h3>
              <button onClick={() => setIsRecruiting(false)} className="text-neutral-500 hover:text-white">Close</button>
            </div>
            
            {/* Create New Button */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-950">
               <button 
                 onClick={() => setIsCreatingNew(true)}
                 className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-neutral-700 rounded text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors uppercase text-xs font-bold"
               >
                 <PlusCircle className="w-4 h-4" /> Create New Character for {faction}
               </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              <input 
                 type="text" 
                 placeholder="Search existing fighters..." 
                 className="w-full bg-black border border-neutral-700 rounded p-2 text-sm text-white mb-4 sticky top-0"
                 onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setAvailableRecruits(availableRecruits.filter(c => c.name.toLowerCase().includes(term)));
                 }}
              />
              {availableRecruits.map(char => (
                <div key={char.id} className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded hover:border-red-900 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-neutral-800 overflow-hidden">
                        <img src={char.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{char.name}</div>
                        <div className="text-[10px] text-neutral-500">{char.faction}</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleRecruit(char)}
                     className="text-xs bg-neutral-800 hover:bg-green-700 text-white px-3 py-1 rounded"
                   >
                     Add
                   </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Internal Editor for Creating New Character in Faction */}
      {isCreatingNew && (
        <CharacterEditor 
          onSave={handleCreateNewSave} 
          onClose={() => setIsCreatingNew(false)}
          // Pre-fill faction
          character={{ faction: faction } as any}
        />
      )}
    </div>
  );
};
    