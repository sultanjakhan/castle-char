import React, { useState, useEffect } from 'react';
import { Character, Tier } from '../types';
import { getCharacters } from '../services/supabaseService';
import { getTier } from './CharacterCard';
import { TIER_COLORS } from '../constants';
import { User } from 'lucide-react';

export const TierList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const loadCharacters = async () => {
      const chars = await getCharacters();
      setCharacters(chars);
    };
    loadCharacters();
  }, []);

  const tiers = [Tier.EX, Tier.SSS, Tier.SS, Tier.S, Tier.AA, Tier.A, Tier.B, Tier.C, Tier.D, Tier.E];

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center">
        <span className="w-2 h-8 bg-red-600 mr-3 block"></span>
        Tier Classification
      </h2>

      {tiers.map((tier) => {
        const tierChars = characters
          .filter(c => getTier(c.overallElo) === tier)
          .sort((a, b) => b.overallElo - a.overallElo);

        // Extract styling
        const isHighTier = [Tier.EX, Tier.SSS, Tier.SS, Tier.S].includes(tier);

        return (
          <div key={tier} className="flex flex-col md:flex-row bg-neutral-900/50 border border-neutral-800 rounded-sm overflow-hidden min-h-[5rem]">
            {/* Tier Label */}
            <div className={`
              md:w-32 flex items-center justify-center p-4 md:p-0
              border-b md:border-b-0 md:border-r border-neutral-800
              ${isHighTier ? 'bg-gradient-to-br from-red-950 to-neutral-900' : 'bg-neutral-950'}
            `}>
              <span className={`text-3xl md:text-4xl font-black ${isHighTier ? 'text-red-500' : 'text-neutral-500'}`}>
                {tier}
              </span>
            </div>

            {/* Characters Grid */}
            <div className="flex-1 p-4">
              <div className="flex flex-wrap gap-3">
                {tierChars.length === 0 ? (
                  <span className="text-neutral-700 text-xs uppercase tracking-widest py-2">No fighters</span>
                ) : (
                  tierChars.map(char => (
                    <div 
                      key={char.id} 
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded bg-neutral-950 border border-neutral-800 overflow-hidden group hover:border-red-500 transition-colors cursor-help"
                      title={`${char.name} (${char.overallElo})`}
                    >
                      {char.imageUrl ? (
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-800">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] md:text-[10px] text-center text-neutral-300 truncate px-1 py-0.5">
                        {char.name}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};