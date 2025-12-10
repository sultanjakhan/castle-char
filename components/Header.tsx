
import React from 'react';
import { AppView } from '../types';
import { Swords, Trophy, Shuffle, UserCog, ListOrdered, Users, Building2 } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.ROSTER, label: 'Roster', icon: Users },
    { view: AppView.ORGANIZATIONS, label: 'Orgs', icon: Building2 },
    { view: AppView.RANDOM_BATTLE, label: 'Random', icon: Shuffle },
    { view: AppView.CUSTOM_BATTLE, label: 'Custom', icon: UserCog },
    { view: AppView.LEADERBOARD, label: 'Rankings', icon: Trophy },
    { view: AppView.TIER_LIST, label: 'Tier List', icon: ListOrdered },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-red-900/30 shadow-2xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onNavigate(AppView.RANDOM_BATTLE)}
        >
          {/* Stylized Logo Text mimicking the Castle Logo */}
          <div className="flex flex-col leading-none">
             <h1 className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter scale-y-110 uppercase drop-shadow-[0_2px_0_rgba(255,255,255,0.1)] italic">
               CASTLE
             </h1>
             <span className="text-[8px] md:text-[10px] text-neutral-500 font-mono tracking-[0.5em] uppercase text-center -mt-1">
               Ranker
             </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-sm transition-all duration-200 uppercase tracking-wider text-[10px] md:text-xs font-bold ${
                  isActive 
                    ? 'bg-red-950/30 text-red-500 border-b-2 border-red-600' 
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Nav - Simple Scrollable */}
        <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 p-2 justify-around z-50 pb-safe shadow-t-xl overflow-x-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] ${
                   isActive ? 'text-red-500' : 'text-neutral-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[8px] uppercase font-bold tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
