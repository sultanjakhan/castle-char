
import React, { useState } from 'react';
import { Header } from './components/Header';
import { VotingArena } from './components/VotingArena';
import { Leaderboard } from './components/Leaderboard';
import { CharacterProfile } from './components/CharacterProfile';
import { TierList } from './components/TierList';
import { BackgroundEffects } from './components/BackgroundEffects';
import { CharacterEditor } from './components/CharacterEditor';
import { Roster } from './components/Roster';
import { Organizations } from './components/Organizations';
import { OrganizationDetail } from './components/OrganizationDetail';
import { AppView, Character } from './types';
import { saveCharacterDetails, addCharacter, getCharacters } from './services/supabaseService';
import { PlusCircle, Download } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.RANDOM_BATTLE);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorCharacter, setEditorCharacter] = useState<Character | null>(null); // null = new, object = edit

  // Force a re-render when data changes
  const [dataVersion, setDataVersion] = useState(0);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    setSelectedCharacterId(null);
    setSelectedFaction(null);
    window.scrollTo(0, 0);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
    setCurrentView(AppView.PROFILE);
    window.scrollTo(0, 0);
  };

  const handleSelectFaction = (faction: string) => {
    setSelectedFaction(faction);
    setCurrentView(AppView.ORGANIZATION_DETAIL);
    window.scrollTo(0, 0);
  };

  const refreshData = () => {
    setDataVersion(v => v + 1);
  };

  // Editor Handlers
  const openAddCharacter = () => {
    setEditorCharacter(null);
    setIsEditorOpen(true);
  };

  const openAddVersion = (baseChar: Character) => {
    // Create a new template based on existing char but with clean stats/id
    const template = {
       ...baseChar,
       id: '', // Will trigger ID generation in editor
       version: '', // Clear version
       overallElo: 1200, // Reset stats
       // Keep description/image/faction/name
    };
    setEditorCharacter(template);
    setIsEditorOpen(true);
  };

  const openEditCharacter = (char: Character) => {
    setEditorCharacter(char);
    setIsEditorOpen(true);
  };

  const handleSaveCharacter = async (data: any) => {
    if (editorCharacter && editorCharacter.id && data.id === editorCharacter.id) {
      // Merge with existing to keep stats
      const existing = (await getCharacters()).find(c => c.id === editorCharacter.id);
      const updated = { ...existing, ...data };
      await saveCharacterDetails(updated);
    } else {
      // Add new
      await addCharacter(data);
    }
    setIsEditorOpen(false);
    refreshData();
  };

  const handleExport = async () => {
    const data = await getCharacters();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `castle_ranker_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <BackgroundEffects />

      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-grow container mx-auto px-4 py-6 max-w-6xl relative z-10">
        {currentView === AppView.RANDOM_BATTLE && (
          <VotingArena mode="random" onVoteComplete={refreshData} />
        )}

        {currentView === AppView.CUSTOM_BATTLE && (
          <VotingArena mode="custom" onVoteComplete={refreshData} />
        )}

        {currentView === AppView.LEADERBOARD && (
          <Leaderboard 
            key={dataVersion} 
            onSelectCharacter={handleSelectCharacter} 
            onEditCharacter={openEditCharacter}
          />
        )}

        {currentView === AppView.TIER_LIST && (
          <TierList key={dataVersion} />
        )}
        
        {currentView === AppView.ROSTER && (
          <Roster 
            key={dataVersion} 
            onEditCharacter={openEditCharacter} 
            onSelectCharacter={handleSelectCharacter}
            onRefresh={refreshData}
          />
        )}

        {currentView === AppView.ORGANIZATIONS && (
          <Organizations 
            key={dataVersion} 
            onSelectCharacter={handleSelectCharacter}
            onSelectFaction={handleSelectFaction}
          />
        )}

        {currentView === AppView.ORGANIZATION_DETAIL && selectedFaction && (
          <OrganizationDetail
            faction={selectedFaction}
            onBack={() => handleNavigate(AppView.ORGANIZATIONS)}
            onSelectCharacter={handleSelectCharacter}
            onDataChange={refreshData}
          />
        )}

        {currentView === AppView.PROFILE && selectedCharacterId && (
          <CharacterProfile 
            characterId={selectedCharacterId} 
            onBack={() => handleNavigate(AppView.LEADERBOARD)}
            onAddVersion={openAddVersion}
          />
        )}
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <CharacterEditor 
          character={editorCharacter} 
          onSave={handleSaveCharacter} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}

      <footer className="border-t border-neutral-900 py-8 mt-12 relative z-10 bg-black/80">
        <div className="container mx-auto px-4 text-center text-neutral-600 text-sm flex flex-col items-center">
          <p className="mb-4 font-mono uppercase tracking-widest text-xs">Castle Character Ranking System</p>
          
          <div className="flex gap-4">
             <button 
               onClick={openAddCharacter}
               className="flex items-center gap-2 text-white bg-red-900/50 hover:bg-red-800 px-4 py-2 rounded text-xs uppercase font-bold tracking-wider transition-colors border border-red-900"
             >
               <PlusCircle className="w-4 h-4" /> Add Fighter
             </button>
             
             <button 
                onClick={handleExport}
                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider px-4 py-2 border border-neutral-800 rounded"
              >
                <Download className="w-3 h-3" /> Backup JSON
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
