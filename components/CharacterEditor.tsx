
import React, { useState, useEffect } from 'react';
import { Character, Faction } from '../types';
import { getCharacters } from '../services/supabaseService';
import { X, Save, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CharacterEditorProps {
  character?: Character | null; // If null, we are adding new
  onSave: (data: any) => void;
  onClose: () => void;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({ character, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    version: '',
    faction: '' as string,
    imageUrl: '',
    description: ''
  });
  
  const [isCustomFaction, setIsCustomFaction] = useState(false);
  const [availableFactions, setAvailableFactions] = useState<string[]>([]);

  // Load all available factions from existing characters
  const loadFactions = async () => {
    const characters = await getCharacters();
    const enumFactions = Object.values(Faction);
    const customFactions = new Set<string>();
    
    characters.forEach(char => {
      if (char.faction && !enumFactions.includes(char.faction as Faction)) {
        customFactions.add(char.faction);
      }
    });
    
    // Combine enum factions with custom ones, sorted
    const allFactions = [...enumFactions, ...Array.from(customFactions)].sort();
    setAvailableFactions(allFactions);
  };

  useEffect(() => {
    loadFactions();
  }, []);

  useEffect(() => {
    if (character) {
      // If character has an ID, it's an edit. If it has no ID but has props, it's a "New Version" template
      const isKnown = Object.values(Faction).includes(character.faction as Faction);
      setIsCustomFaction(!isKnown && !!character.faction);

      setFormData({
        id: character.id || uuidv4(),
        name: character.name || '',
        version: character.version || '',
        faction: character.faction || Faction.OTHER,
        imageUrl: character.imageUrl || '',
        description: character.description || ''
      });
    } else {
      setIsCustomFaction(false);
      setFormData({
        id: uuidv4(),
        name: '',
        version: 'Current',
        faction: Faction.OTHER,
        imageUrl: '',
        description: ''
      });
    }
  }, [character]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate custom faction
    if (isCustomFaction && !formData.faction.trim()) {
      alert('Please enter a faction name');
      return;
    }
    
    // Save character (onSave is async, but we don't need to wait)
    onSave(formData);
  };

  const toggleCustomFaction = (isCustom: boolean) => {
    setIsCustomFaction(isCustom);
    if (isCustom) {
      setFormData(prev => ({ ...prev, faction: '' }));
    } else {
      setFormData(prev => ({ ...prev, faction: Faction.OTHER }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            {character && character.id ? 'Edit Character' : 'Add New Character'}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-500 outline-none"
              placeholder="e.g. Kim Shin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-1">Version</label>
              <input 
                required
                type="text" 
                value={formData.version}
                onChange={e => setFormData({...formData, version: e.target.value})}
                className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-500 outline-none"
                placeholder="e.g. Current"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-neutral-500 mb-1">
                Faction
              </label>
              
              {isCustomFaction ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      required
                      type="text"
                      value={formData.faction}
                      onChange={e => setFormData({...formData, faction: e.target.value})}
                      className="flex-1 bg-black border border-red-500 rounded p-2 text-white focus:border-red-400 outline-none"
                      placeholder="Enter new faction name (e.g. 'Shadow Syndicate')"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => toggleCustomFaction(false)}
                      className="px-3 py-2 bg-neutral-800 text-neutral-400 hover:text-white rounded text-xs"
                      title="Cancel and use existing faction"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-600">Creating new faction: "{formData.faction || '...'}"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <select 
                    value={formData.faction}
                    onChange={e => {
                      if (e.target.value === '__CREATE_NEW__') {
                        toggleCustomFaction(true);
                      } else {
                        setFormData({...formData, faction: e.target.value});
                      }
                    }}
                    className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-500 outline-none text-sm"
                  >
                    {availableFactions.length > 0 ? (
                      availableFactions.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))
                    ) : (
                      Object.values(Faction).map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))
                    )}
                    {/* Fallback for custom faction not in list yet */}
                    {formData.faction && !availableFactions.includes(formData.faction) && !Object.values(Faction).includes(formData.faction as Faction) && (
                      <option value={formData.faction} hidden>{formData.faction}</option>
                    )}
                    <option value="__CREATE_NEW__" className="bg-red-900 text-white">
                      ➕ Create New Faction...
                    </option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Image URL</label>
            <input 
              type="url" 
              value={formData.imageUrl}
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-500 outline-none"
              placeholder="https://..."
            />
            <p className="text-[10px] text-neutral-600 mt-1">Leave empty to auto-generate avatar.</p>
          </div>

          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black border border-neutral-700 rounded p-2 text-white focus:border-red-500 outline-none h-24 resize-none"
              placeholder="Short bio..."
            />
          </div>

          {formData.imageUrl && (
             <div className="mt-4">
               <p className="text-xs text-neutral-500 mb-1">Preview</p>
               <div className="w-20 h-20 rounded overflow-hidden border border-neutral-700">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
               </div>
             </div>
          )}

          <div className="pt-4 flex gap-3">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-3 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-bold uppercase text-xs"
             >
               Cancel
             </button>
             <button 
               type="submit"
               className="flex-1 py-3 rounded bg-red-600 text-white hover:bg-red-700 font-bold uppercase text-xs flex items-center justify-center gap-2"
             >
               <Save className="w-4 h-4" /> Save
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
