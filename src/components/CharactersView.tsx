import React, { useState } from 'react';
import {
  Users,
  ArrowLeft,
  Plus,
  Search,
  Edit3,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Shield,
  Zap,
  Check,
  Filter,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';
import { Character, NovelProject } from '../types';

interface CharactersViewProps {
  project: NovelProject;
  onUpdateCharacters: (characters: Character[]) => void;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
}

export const CharactersView: React.FC<CharactersViewProps> = ({
  project,
  onUpdateCharacters,
  isDarkMode,
  onNavigateToScene,
}) => {
  // Navigation mode: 'index' or 'dossier'
  const [viewMode, setViewMode] = useState<'index' | 'dossier'>('index');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    project.characters[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [artPromptCustom, setArtPromptCustom] = useState('');
  const [artStyle, setArtStyle] = useState('digital oil painting');
  const [showVoiceConsistencyAlert, setShowVoiceConsistencyAlert] = useState(true);

  const activeCharacter =
    project.characters.find((c) => c.id === selectedCharacterId) || project.characters[0];

  // Helper to find scenes featuring this character
  const getCharacterScenes = (charId: string) => {
    const scenes: Array<{
      chapterNumber: number;
      chapterTitle: string;
      chapterId: string;
      sceneId: string;
      sceneTitle: string;
      isPov: boolean;
    }> = [];

    project.chapters.forEach((chap) => {
      chap.scenes.forEach((sc) => {
        const isPov = sc.povCharacterId === charId;
        const mentionsName =
          activeCharacter &&
          sc.content &&
          sc.content.toLowerCase().includes(activeCharacter.name.toLowerCase().split(' ')[0]);
        if (isPov || mentionsName) {
          scenes.push({
            chapterNumber: chap.number,
            chapterTitle: chap.title,
            chapterId: chap.id,
            sceneId: sc.id,
            sceneTitle: sc.title,
            isPov,
          });
        }
      });
    });

    return scenes;
  };

  // Helper to find last appearance
  const getLastAppearance = (charId: string) => {
    for (let i = project.chapters.length - 1; i >= 0; i--) {
      const chap = project.chapters[i];
      for (let j = chap.scenes.length - 1; j >= 0; j--) {
        const sc = chap.scenes[j];
        if (sc.povCharacterId === charId) {
          return `Ch. ${chap.number}, ${sc.title}`;
        }
      }
    }
    return 'Chapter 1';
  };

  // Helper to count appearances
  const getAppearanceCount = (charId: string) => {
    let count = 0;
    project.chapters.forEach((chap) => {
      chap.scenes.forEach((sc) => {
        if (sc.povCharacterId === charId) count++;
      });
    });
    return count;
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
    setViewMode('dossier');
    setIsEditing(false);
  };

  const handleAddCharacter = () => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      alias: '',
      role: 'Supporting',
      archetype: 'The Catalyst',
      age: '32',
      appearance: 'Tall, keen-eyed, functional attire.',
      personality: 'Methodical, deeply observant, guarded.',
      internalGoal: 'To uncover the truth behind the family lineage.',
      externalConflict: 'Betrayed by their former guild.',
      flaw: 'Distrusts everyone until danger is unavoidable.',
      voiceNotes: 'Speaks in brief, declarative statements with technical precision.',
      relationships: [],
    };
    onUpdateCharacters([...project.characters, newChar]);
    setSelectedCharacterId(newChar.id);
    setViewMode('dossier');
    setIsEditing(true);
  };

  const handleSaveCharacter = (updated: Character) => {
    onUpdateCharacters(
      project.characters.map((c) => (c.id === updated.id ? updated : c))
    );
    setIsEditing(false);
  };

  const handleDeleteCharacter = (id: string) => {
    if (confirm('Delete this character dossier?')) {
      const remaining = project.characters.filter((c) => c.id !== id);
      onUpdateCharacters(remaining);
      if (remaining.length > 0) {
        setSelectedCharacterId(remaining[0].id);
      }
      setViewMode('index');
    }
  };

  // Generate Character Portrait with AI
  const handleGeneratePortrait = async () => {
    if (!activeCharacter) return;
    setIsGeneratingArt(true);
    try {
      const prompt =
        artPromptCustom.trim() ||
        `${activeCharacter.name}, ${activeCharacter.role}. ${activeCharacter.appearance}. ${activeCharacter.personality}. Style: ${artStyle}. Masterpiece novel character portrait.`;

      const res = await fetch('/api/gemini/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: 'character',
          style: artStyle,
          aspectRatio: '1:1',
        }),
      });

      if (!res.ok) {
        throw new Error('Art generation failed');
      }

      const data = await res.json();
      if (data.imageUrl) {
        handleSaveCharacter({
          ...activeCharacter,
          portraitUrl: data.imageUrl,
        });
      }
    } catch (e: any) {
      console.warn('Portrait generation error:', e);
      const svgAvatar = `https://picsum.photos/seed/${encodeURIComponent(
        activeCharacter.name
      )}/600/600`;
      handleSaveCharacter({
        ...activeCharacter,
        portraitUrl: svgAvatar,
      });
    } finally {
      setIsGeneratingArt(false);
    }
  };

  const filteredCharacters = project.characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.archetype.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.alias && c.alias.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || c.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const activeIndex = project.characters.findIndex((c) => c.id === activeCharacter?.id);
  const prevChar = activeIndex > 0 ? project.characters[activeIndex - 1] : null;
  const nextChar = activeIndex < project.characters.length - 1 ? project.characters[activeIndex + 1] : null;

  return (
    <div id="characters-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Header Bar */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {viewMode === 'dossier' && (
            <button
              onClick={() => setViewMode('index')}
              className="p-1.5 rounded-md hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023] text-[#6e6e6b] dark:text-[#9ca3af] transition-colors"
              title="Return to Character Index"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
              Story Workspace
            </span>
            <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
            <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
              {viewMode === 'index' ? 'Character Index' : `Dossier: ${activeCharacter?.name || 'Character'}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === 'dossier' && (
            <>
              {prevChar && (
                <button
                  onClick={() => setSelectedCharacterId(prevChar.id)}
                  className="px-2 py-1 rounded text-xs text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023] flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{prevChar.name.split(' ')[0]}</span>
                </button>
              )}
              {nextChar && (
                <button
                  onClick={() => setSelectedCharacterId(nextChar.id)}
                  className="px-2 py-1 rounded text-xs text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023] flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">{nextChar.name.split(' ')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="w-px h-4 bg-[#e8e8e6] dark:border-[#28292d] mx-1" />
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] bg-white dark:bg-[#1f2023] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'View Dossier' : 'Edit Dossier'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleAddCharacter}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Character</span>
          </button>
        </div>
      </header>

      {/* VIEW MODE 1: CHARACTER INDEX */}
      {viewMode === 'index' ? (
        <div className="flex-1 flex flex-col overflow-hidden p-6 md:p-8 max-w-6xl mx-auto w-full">
          {/* Controls Bar: Search & Role Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
                <input
                  type="text"
                  placeholder="Filter characters by name, alias, archetype..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] text-[#191918] dark:text-[#f4f4f5] placeholder-[#9c9c98] focus:outline-none focus:border-[#4f46e5]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
              <span className="text-[#9c9c98] text-[11px] font-mono mr-1">Role:</span>
              {['all', 'Protagonist', 'Antagonist', 'Deuteragonist', 'Supporting', 'Minor'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    roleFilter === role
                      ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                      : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Editorial Character Index Table */}
          <div className="flex-1 overflow-y-auto border border-[#e8e8e6] dark:border-[#28292d] rounded-xl bg-white dark:bg-[#141517] shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#18191b] text-[#6e6e6b] dark:text-[#9ca3af]">
                  <th className="py-3 px-4 font-semibold">Character</th>
                  <th className="py-3 px-3 font-semibold">Role</th>
                  <th className="py-3 px-3 font-semibold">Archetype</th>
                  <th className="py-3 px-3 font-semibold">POV Status</th>
                  <th className="py-3 px-3 font-semibold">Last Appearance</th>
                  <th className="py-3 px-3 font-semibold">Arc Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecece9] dark:divide-[#242528]">
                {filteredCharacters.map((char) => {
                  const povScenesCount = getAppearanceCount(char.id);
                  const lastApp = getLastAppearance(char.id);
                  return (
                    <tr
                      key={char.id}
                      onClick={() => handleSelectCharacter(char.id)}
                      className="group hover:bg-[#f8f8f6] dark:hover:bg-[#1c1d21] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {char.portraitUrl ? (
                            <img
                              src={char.portraitUrl}
                              alt={char.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-[#e8e8e6] dark:border-[#28292d] shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#f0f0ee] dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center justify-center font-serif text-xs font-semibold shrink-0">
                              {char.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-serif font-medium text-sm text-[#191918] dark:text-[#f4f4f5] group-hover:text-[#4f46e5] dark:group-hover:text-[#818cf8] transition-colors flex items-center space-x-1.5">
                              <span>{char.name}</span>
                              {char.alias && (
                                <span className="text-[11px] font-sans text-[#9c9c98] font-normal italic">
                                  "{char.alias}"
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#9c9c98] truncate max-w-xs">
                              {char.appearance.slice(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            char.role === 'Protagonist'
                              ? 'bg-[#eef2ff] text-[#4338ca] dark:bg-[#4338ca]/20 dark:text-[#a5b4fc]'
                              : char.role === 'Antagonist'
                              ? 'bg-[#fef2f2] text-[#b91c1c] dark:bg-[#b91c1c]/20 dark:text-[#fca5a5]'
                              : char.role === 'Deuteragonist'
                              ? 'bg-[#faf5ff] text-[#7e22ce] dark:bg-[#7e22ce]/20 dark:text-[#d8b4fe]'
                              : 'bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]'
                          }`}
                        >
                          {char.role}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[#52525b] dark:text-[#d4d4d8] font-sans">
                        {char.archetype}
                      </td>

                      <td className="py-3 px-3 text-[#6e6e6b] dark:text-[#9ca3af]">
                        {povScenesCount > 0 ? (
                          <span className="font-mono text-[11px] text-[#4f46e5] dark:text-[#818cf8]">
                            POV in {povScenesCount} scene{povScenesCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#9c9c98]">Supporting POV</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[#6e6e6b] dark:text-[#9ca3af] font-mono text-[11px]">
                        {lastApp}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-[#191918] dark:text-[#f4f4f5]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                          <span>Active / In Conflict</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCharacter(char.id);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-[#4f46e5] dark:text-[#818cf8] hover:bg-[#eef2ff] dark:hover:bg-[#1e1b4b] rounded transition-colors inline-flex items-center space-x-1"
                        >
                          <span>Open Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: CHARACTER DOSSIER */
        activeCharacter && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
            {/* Dossier Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e8e6] dark:border-[#28292d]">
              <div className="flex items-center space-x-5">
                {activeCharacter.portraitUrl ? (
                  <img
                    src={activeCharacter.portraitUrl}
                    alt={activeCharacter.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border border-[#e8e8e6] dark:border-[#28292d] shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[#f0f0ee] dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center justify-center font-serif text-2xl font-bold border border-[#e8e8e6] dark:border-[#28292d] shrink-0">
                    {activeCharacter.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-2xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                      {activeCharacter.name}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                        activeCharacter.role === 'Protagonist'
                          ? 'bg-[#eef2ff] text-[#4338ca] dark:bg-[#4338ca]/20 dark:text-[#a5b4fc]'
                          : activeCharacter.role === 'Antagonist'
                          ? 'bg-[#fef2f2] text-[#b91c1c] dark:bg-[#b91c1c]/20 dark:text-[#fca5a5]'
                          : 'bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]'
                      }`}
                    >
                      {activeCharacter.role}
                    </span>
                  </div>

                  {activeCharacter.alias && (
                    <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] italic mt-0.5">
                      "{activeCharacter.alias}"
                    </p>
                  )}

                  <div className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] flex items-center space-x-2 mt-1.5 font-sans">
                    <span>Archetype: <strong className="text-[#191918] dark:text-[#f4f4f5] font-medium">{activeCharacter.archetype}</strong></span>
                    <span>&bull;</span>
                    <span>Age: <strong className="text-[#191918] dark:text-[#f4f4f5] font-medium">{activeCharacter.age || 'Unspecified'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                {project.characters.length > 1 && (
                  <button
                    onClick={() => handleDeleteCharacter(activeCharacter.id)}
                    className="p-2 rounded-md text-[#9c9c98] hover:text-[#b91c1c] hover:bg-[#fef2f2] dark:hover:bg-[#1f1616] transition-colors"
                    title="Delete character"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Portrait Generation Tool (Editorial Accordion) */}
            <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8]" />
                  <span className="text-xs font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
                    Character Portrait Study
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#9c9c98]">Integrated Visual Model</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={artPromptCustom}
                  onChange={(e) => setArtPromptCustom(e.target.value)}
                  placeholder="Atmospheric visual prompt (e.g. weathered coat, sea-fog, piercing gray eyes)..."
                  className="sm:col-span-2 text-xs px-3 py-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
                <div className="flex gap-2">
                  <select
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] flex-1"
                  >
                    <option value="digital oil painting">Oil Painting</option>
                    <option value="cinematic concept art">Concept Art</option>
                    <option value="dark watercolor illustration">Dark Watercolor</option>
                    <option value="vintage ink and graphite sketch">Ink Sketch</option>
                  </select>
                  <button
                    onClick={handleGeneratePortrait}
                    disabled={isGeneratingArt}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 shrink-0 disabled:opacity-50 transition-colors shadow-2xs"
                  >
                    {isGeneratingArt ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Editing Form vs Display Dossier */}
            {isEditing ? (
              <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-5 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Name</label>
                    <input
                      type="text"
                      value={activeCharacter.name}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, name: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Alias / Epithet</label>
                    <input
                      type="text"
                      value={activeCharacter.alias || ''}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, alias: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Role in Story</label>
                    <select
                      value={activeCharacter.role}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, role: e.target.value as any })}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    >
                      <option value="Protagonist">Protagonist</option>
                      <option value="Antagonist">Antagonist</option>
                      <option value="Deuteragonist">Deuteragonist</option>
                      <option value="Supporting">Supporting</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Physical Appearance</label>
                    <textarea
                      value={activeCharacter.appearance}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, appearance: e.target.value })}
                      rows={3}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Personality &amp; Psychology</label>
                    <textarea
                      value={activeCharacter.personality}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, personality: e.target.value })}
                      rows={3}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Motivation: Internal Need (Want vs Need)</label>
                    <textarea
                      value={activeCharacter.internalGoal}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, internalGoal: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">External Goal &amp; Dramatic Conflict</label>
                    <textarea
                      value={activeCharacter.externalConflict}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, externalConflict: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Fatal Flaw &amp; Vulnerability</label>
                    <textarea
                      value={activeCharacter.flaw}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, flaw: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#4f46e5] dark:text-[#818cf8]">Voice &amp; Speech Cadence</label>
                    <textarea
                      value={activeCharacter.voiceNotes}
                      onChange={(e) => handleSaveCharacter({ ...activeCharacter, voiceNotes: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-[#4f46e5]/30 dark:border-[#818cf8]/30 bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium text-xs shadow-2xs"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              /* Display Dossier Sections */
              <div className="space-y-8">
                {/* 1. Identity & Psychology Grid */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#9c9c98] mb-3">
                    Core Psychology &amp; Motivations
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c9c98]">
                        Internal Need (Want vs. Need)
                      </span>
                      <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                        {activeCharacter.internalGoal}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c9c98]">
                        External Goal &amp; Stakes
                      </span>
                      <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                        {activeCharacter.externalConflict}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c9c98]">
                        Fatal Flaw &amp; Blindspot
                      </span>
                      <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                        {activeCharacter.flaw}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9c9c98]">
                        Physical Appearance &amp; Mannerisms
                      </span>
                      <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                        {activeCharacter.appearance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Character Voice Section */}
                <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#242528] pb-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8]" />
                      <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#191918] dark:text-[#f4f4f5]">
                        Character Voice Profile
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-[#9c9c98]">Distinctive Verbal Fingerprint</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#fbfbfa] dark:bg-[#18191b] border border-[#ecece9] dark:border-[#28292d]">
                      <span className="text-[10px] font-semibold text-[#9c9c98] block mb-1">Speech Style</span>
                      <span className="text-[#191918] dark:text-[#f4f4f5]">Methodical, Technical precision</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fbfbfa] dark:bg-[#18191b] border border-[#ecece9] dark:border-[#28292d]">
                      <span className="text-[10px] font-semibold text-[#9c9c98] block mb-1">Sentence Rhythm</span>
                      <span className="text-[#191918] dark:text-[#f4f4f5]">Short, declarative clauses</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fbfbfa] dark:bg-[#18191b] border border-[#ecece9] dark:border-[#28292d]">
                      <span className="text-[10px] font-semibold text-[#9c9c98] block mb-1">Formality</span>
                      <span className="text-[#191918] dark:text-[#f4f4f5]">High / Academic reserve</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#fbfbfa] dark:bg-[#18191b] border border-[#ecece9] dark:border-[#28292d] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">
                      Established Cadence &amp; Quirks
                    </span>
                    <p className="text-xs text-[#191918] dark:text-[#f4f4f5] font-serif italic leading-relaxed">
                      "{activeCharacter.voiceNotes}"
                    </p>
                  </div>

                  {/* Voice Consistency Alert (As instructed in Prompt: "VOICE CONSISTENCY ⚠ Review suggested...") */}
                  {showVoiceConsistencyAlert && (
                    <div className="p-4 rounded-lg border border-[#e8e8e6] dark:border-[#38393d] bg-[#fbfbfa] dark:bg-[#18191b] flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-mono text-[10px] uppercase font-bold text-[#d97706]">
                            Voice Consistency &bull; Review Suggested
                          </div>
                          <p className="text-xs text-[#191918] dark:text-[#f4f4f5] mt-1 leading-relaxed">
                            {activeCharacter.name}'s dialogue in Chapter 1 Scene 2 demonstrates more informal contractions than his established speaking pattern.
                          </p>
                          <span className="text-[10px] text-[#9c9c98] block mt-0.5">
                            AI editorial observation: author review recommended without automatic rewrite.
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (onNavigateToScene) {
                            onNavigateToScene('chap-1', 'scene-1-2');
                          }
                        }}
                        className="px-3 py-1 text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] rounded hover:bg-white dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shrink-0 transition-colors"
                      >
                        Review Scene
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Relationships & Interpersonal Bonds */}
                {activeCharacter.relationships && activeCharacter.relationships.length > 0 && (
                  <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#9c9c98]">
                      Interpersonal Dynamics &amp; Bonds
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeCharacter.relationships.map((rel, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border border-[#ecece9] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#18191b] flex items-center justify-between"
                        >
                          <span className="font-medium text-[#191918] dark:text-[#f4f4f5]">{rel}</span>
                          <span className="text-[10px] font-mono text-[#9c9c98]">Active Arc</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Key Scenes in Manuscript */}
                <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#9c9c98]">
                      Key Scenes &amp; Continuity References
                    </span>
                    <span className="text-[10px] font-mono text-[#9c9c98]">
                      {getCharacterScenes(activeCharacter.id).length} linked scenes
                    </span>
                  </div>

                  <div className="divide-y divide-[#ecece9] dark:divide-[#28292d] text-xs">
                    {getCharacterScenes(activeCharacter.id).map((sc, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => onNavigateToScene && onNavigateToScene(sc.chapterId, sc.sceneId)}
                        className="py-2.5 flex items-center justify-between hover:text-[#4f46e5] dark:hover:text-[#818cf8] cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#9c9c98]" />
                          <span className="font-serif font-medium text-[#191918] dark:text-[#f4f4f5] group-hover:text-[#4f46e5]">
                            Chapter {sc.chapterNumber}: {sc.sceneTitle}
                          </span>
                          {sc.isPov && (
                            <span className="px-1.5 py-0.25 rounded text-[9.5px] font-mono bg-[#eef2ff] dark:bg-[#4338ca]/20 text-[#4338ca] dark:text-[#a5b4fc]">
                              POV
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#9c9c98] flex items-center space-x-1">
                          <span>Open Scene</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
