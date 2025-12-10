
import React from 'react';
import { Character, Tier } from '../types';
import { TIER_THRESHOLDS, TIER_COLORS } from '../constants';
import { Info, Pencil } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
  onEdit?: (character: Character) => void;
  showStats?: boolean;
  animate?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hideVersionBadge?: boolean;
}

export const getTier = (elo: number): Tier => {
  if (elo >= TIER_THRESHOLDS[Tier.EX]) return Tier.EX;
  if (elo >= TIER_THRESHOLDS[Tier.SSS]) return Tier.SSS;
  if (elo >= TIER_THRESHOLDS[Tier.SS]) return Tier.SS;
  if (elo >= TIER_THRESHOLDS[Tier.S]) return Tier.S;
  if (elo >= TIER_THRESHOLDS[Tier.AA]) return Tier.AA;
  if (elo >= TIER_THRESHOLDS[Tier.A]) return Tier.A;
  if (elo >= TIER_THRESHOLDS[Tier.B]) return Tier.B;
  if (elo >= TIER_THRESHOLDS[Tier.C]) return Tier.C;
  if (elo >= TIER_THRESHOLDS[Tier.D]) return Tier.D;
  return Tier.E;
};

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onClick, 
  onEdit,
  showStats = false,
  animate = false,
  selected = false,
  disabled = false,
  hideVersionBadge = false
}) => {
  const tier = getTier(character.overallElo);
  const tierColor = TIER_COLORS[tier];

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative group overflow-hidden rounded-xl bg-neutral-900 border transition-all duration-300
        ${selected ? 'border-red-600 scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'border-neutral-800 hover:border-neutral-600'}
        ${!disabled && onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''}
        ${animate ? 'animate-in fade-in zoom-in duration-500' : ''}
        ${disabled ? 'opacity-50 grayscale' : ''}
      `}
    >
      {/* Tier Badge */}
      <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-sm text-xs font-black tracking-widest shadow-lg ${tierColor}`}>
        {tier}
      </div>

      {/* Version Badge */}
      {!hideVersionBadge && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded bg-black/80 backdrop-blur-sm text-[10px] uppercase text-neutral-400 font-mono border border-neutral-700">
          {character.version}
        </div>
      )}

      {/* Edit Button (Only visible if onEdit is provided) */}
      {onEdit && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(character);
          }}
          className="absolute top-12 right-3 z-20 p-1.5 rounded bg-black/80 hover:bg-white hover:text-black text-neutral-400 border border-neutral-700 transition-colors opacity-0 group-hover:opacity-100"
          title="Edit Character"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950 flex items-center justify-center">
        <ImageWithFallback 
          src={character.imageUrl} 
          name={character.name}
          alt={character.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-black text-white leading-tight mb-1 truncate shadow-black drop-shadow-md tracking-tight uppercase">
          {character.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2 border-t border-white/10 pt-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-[10px] uppercase text-neutral-500 tracking-wider">Rating</span>
            <span className="text-lg font-bold text-red-500 font-mono">{character.overallElo}</span>
          </div>
          {showStats && (
            <div className="text-[10px] text-neutral-600 font-mono">
               {character.wins}W / {character.losses}L
            </div>
          )}
        </div>

        {/* Overlay Info (Visible on hover on desktop) */}
        {!disabled && onClick && (
          <div className="hidden md:block absolute inset-0 bg-black/90 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center pointer-events-none">
              <Info className="w-8 h-8 text-red-600 mb-2" />
              <p className="text-sm text-neutral-300 leading-snug">{character.description}</p>
              <div className="mt-4 text-[10px] text-red-500 uppercase tracking-[0.2em] font-bold border-b border-red-900 pb-1">Click to Vote</div>
          </div>
        )}
      </div>
    </div>
  );
};
