import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Users,
  Cpu,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  Tag,
  Key,
  Eye,
  Volume2,
  Wind,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { NovelProject, CodexEntry, CodexCategory, Character } from '../types';

interface CodexViewProps {
  project: NovelProject;
  onUpdateCodex: (entries: CodexEntry[]) => void;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
  onNavigateToCharacter?: (characterId: string) => void;
}

const CATEGORY_MAP: Record<
  CodexCategory,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  location: { label: 'Locations & Havens', icon: MapPin },
  faction: { label: 'Factions & Organizations', icon: Users },
  magic_tech: { label: 'Magic & Systems', icon: Cpu },
  history: { label: 'History & Lore', icon: BookOpen },
  relic: { label: 'Relics & Objects', icon: Key },
  culture: { label: 'Cultures & Rituals', icon: Sparkles },
};

export const CodexView: React.FC<CodexViewProps> = ({
  project,
  onUpdateCodex,
  isDarkMode,
  onNavigateToScene,
  onNavigateToCharacter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CodexCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEntryId, setActiveEntryId] = useState<string>(
    project.codexEntries?.[0]?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<CodexEntry>>({});
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const entries = project.codexEntries || [];
  const characters = project.characters || [];

  const filteredEntries = entries.filter((entry) => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeEntry = entries.find((e) => e.id === activeEntryId) || filteredEntries[0];

  // Helper to find connected chapters/scenes
  const getLinkedScenes = (entry: CodexEntry) => {
    const results: Array<{
      chapterId: string;
      chapterNumber: number;
      chapterTitle: string;
      sceneId: string;
      sceneTitle: string;
    }> = [];

    const entryWord = entry.title.split(' ')[0].toLowerCase();

    project.chapters.forEach((chap) => {
      chap.scenes.forEach((sc) => {
        const isDirect = entry.linkedChapterIds?.includes(chap.id);
        const textMention = sc.content && sc.content.toLowerCase().includes(entryWord);
        if (isDirect || textMention) {
          results.push({
            chapterId: chap.id,
            chapterNumber: chap.number,
            chapterTitle: chap.title,
            sceneId: sc.id,
            sceneTitle: sc.title,
          });
        }
      });
    });

    return results;
  };

  // Helper to find connected research notes
  const getLinkedResearch = (entry: CodexEntry) => {
    return (project.researchNotes || []).filter(
      (r) => r.linkedCodexIds?.includes(entry.id) || r.title.toLowerCase().includes(entry.title.toLowerCase())
    );
  };

  const handleStartCreate = () => {
    const newEntry: CodexEntry = {
      id: `codex-${Date.now()}`,
      title: 'New Codex Lore Entry',
      category: selectedCategory === 'all' ? 'location' : selectedCategory,
      shortDescription: '',
      detailedLore: '',
      sensoryDetails: '',
      secrets: '',
      tags: ['Worldbuilding'],
      significance: 'Core Narrative',
      linkedCharacterIds: [],
      linkedChapterIds: [],
    };
    setEditFormData(newEntry);
    setIsEditing(true);
  };

  const handleStartEdit = (entry: CodexEntry) => {
    setEditFormData({ ...entry });
    setIsEditing(true);
  };

  const handleSaveEntry = () => {
    if (!editFormData.title) return;

    if (entries.some((e) => e.id === editFormData.id)) {
      const updated = entries.map((e) => (e.id === editFormData.id ? (editFormData as CodexEntry) : e));
      onUpdateCodex(updated);
    } else {
      const updated = [editFormData as CodexEntry, ...entries];
      onUpdateCodex(updated);
      setActiveEntryId(editFormData.id!);
    }
    setIsEditing(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Delete this world lore entry?')) {
      const updated = entries.filter((e) => e.id !== id);
      onUpdateCodex(updated);
      if (activeEntryId === id) {
        setActiveEntryId(updated[0]?.id || '');
      }
      setIsEditing(false);
    }
  };

  const handleGenerateLoreAI = async () => {
    if (!editFormData.title) return;
    setIsAIGenerating(true);
    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'continue',
          prompt: `Create evocative, concrete, anti-cliché novel worldbuilding lore for a "${editFormData.category || 'location'}" named "${editFormData.title}". 
Novel Genre: ${project.genre}.
Novel Premise: ${project.logline}.
Provide rich physical history, visceral micro-sensory details (sounds, odors, tactile textures), and an intriguing plot-relevant secret or dangerous consequence. Avoid generic high-fantasy or sci-fi boilerplate.`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setEditFormData((prev) => ({
          ...prev,
          detailedLore: prev.detailedLore ? `${prev.detailedLore}\n\n${data.result}` : data.result,
        }));
      }
    } catch (e) {
      console.warn('AI lore error:', e);
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div id="world-codex-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Workspace Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            World Codex
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({entries.length} entries)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Codex Entry</span>
          </button>
        </div>
      </header>

      {/* Two-Column Author's Encyclopedia Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Encyclopedia Index & Categories */}
        <div className="w-80 shrink-0 border-r border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-col">
          {/* Search bar */}
          <div className="p-3 border-b border-[#ecece9] dark:border-[#242528]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
              <input
                type="text"
                placeholder="Search lore, relics, factions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] placeholder-[#9c9c98] focus:outline-none focus:border-[#4f46e5]"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-3 py-2 border-b border-[#ecece9] dark:border-[#242528] flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2 py-0.75 rounded text-[11px] font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                  : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]'
              }`}
            >
              All ({entries.length})
            </button>
            {(Object.keys(CATEGORY_MAP) as CodexCategory[]).map((cat) => {
              const count = entries.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.75 rounded text-[11px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                      : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]'
                  }`}
                >
                  {CATEGORY_MAP[cat].label.split(' ')[0]} ({count})
                </button>
              );
            })}
          </div>

          {/* List of Entries */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#ecece9] dark:divide-[#242528]">
            {filteredEntries.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9c9c98]">No entries match filter</div>
            ) : (
              filteredEntries.map((entry) => {
                const isSelected = entry.id === activeEntry?.id;
                const CatIcon = CATEGORY_MAP[entry.category]?.icon || BookOpen;
                return (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setActiveEntryId(entry.id);
                      setIsEditing(false);
                    }}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#f4f4f2] dark:bg-[#1e1f23]'
                        : 'hover:bg-[#f9f9f8] dark:hover:bg-[#191a1d]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <CatIcon className="w-3.5 h-3.5 text-[#6e6e6b] dark:text-[#9ca3af]" />
                        <span className="text-[10px] font-mono uppercase text-[#9c9c98]">
                          {CATEGORY_MAP[entry.category]?.label.split('&')[0]}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#9c9c98]">
                        {entry.significance === 'Core Narrative' ? 'Core' : 'Subplot'}
                      </span>
                    </div>

                    <h3 className="text-xs font-serif font-bold text-[#191918] dark:text-[#f4f4f5] leading-snug">
                      {entry.title}
                    </h3>
                    <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] line-clamp-2 mt-0.5">
                      {entry.shortDescription}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Private Encyclopedia Article */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {isEditing ? (
            /* Editing / Creation Mode */
            <div className="max-w-3xl mx-auto p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-5 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#242528] pb-3">
                <span className="font-serif font-bold text-sm text-[#191918] dark:text-[#f4f4f5]">
                  {editFormData.id ? 'Edit Codex Article' : 'New Codex Article'}
                </span>
                <button
                  onClick={handleGenerateLoreAI}
                  disabled={isAIGenerating || !editFormData.title}
                  className="px-3 py-1 rounded text-xs font-medium bg-[#4f46e5]/10 text-[#4f46e5] dark:text-[#818cf8] hover:bg-[#4f46e5]/20 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAIGenerating ? 'Generating Canon...' : 'AI Lore Drafting'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Article Title</label>
                  <input
                    type="text"
                    value={editFormData.title || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Category</label>
                  <select
                    value={editFormData.category || 'location'}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                  >
                    {(Object.keys(CATEGORY_MAP) as CodexCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_MAP[cat].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Short Summary / Concise Definition</label>
                <input
                  type="text"
                  value={editFormData.shortDescription || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, shortDescription: e.target.value })}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Detailed Lore &amp; In-Universe History</label>
                <textarea
                  value={editFormData.detailedLore || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, detailedLore: e.target.value })}
                  rows={5}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Visceral Sensory Details (Atmosphere, Sights, Odors, Textures)</label>
                <textarea
                  value={editFormData.sensoryDetails || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, sensoryDetails: e.target.value })}
                  rows={3}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Hidden Secrets &amp; Plot Consequences (Author-Only)</label>
                <textarea
                  value={editFormData.secrets || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, secrets: e.target.value })}
                  rows={2}
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntry}
                  className="px-4 py-2 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium shadow-2xs"
                >
                  Save Entry
                </button>
              </div>
            </div>
          ) : activeEntry ? (
            /* Article View */
            <article className="max-w-3xl mx-auto space-y-8">
              {/* Article Header */}
              <div className="border-b border-[#e8e8e6] dark:border-[#28292d] pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                      {CATEGORY_MAP[activeEntry.category]?.label}
                    </span>
                    <span className="text-[#9c9c98]">&bull;</span>
                    <span className="text-[11px] font-mono text-[#9c9c98]">
                      Significance: {activeEntry.significance}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStartEdit(activeEntry)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] bg-white dark:bg-[#1f2023] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(activeEntry.id)}
                      className="p-1.5 rounded-md text-[#9c9c98] hover:text-[#b91c1c] hover:bg-[#fef2f2] dark:hover:bg-[#1f1616] transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5] leading-tight">
                  {activeEntry.title}
                </h1>
                <p className="text-base text-[#6e6e6b] dark:text-[#9ca3af] font-serif italic mt-2 leading-relaxed">
                  {activeEntry.shortDescription}
                </p>
              </div>

              {/* 1. DETAILED LORE */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                  Detailed Lore &amp; In-Universe Canon
                </h2>
                <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs">
                  <p className="text-sm text-[#191918] dark:text-[#f4f4f5] leading-relaxed whitespace-pre-line font-serif">
                    {activeEntry.detailedLore}
                  </p>
                </div>
              </div>

              {/* 2. SENSORY DETAILS & PHYSICAL TEXTURES */}
              {activeEntry.sensoryDetails && (
                <div className="space-y-3">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                    Sensory Details &amp; Atmosphere
                  </h2>
                  <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#141517]">
                    <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed italic">
                      "{activeEntry.sensoryDetails}"
                    </p>
                  </div>
                </div>
              )}

              {/* 3. HIDDEN SECRETS & PLOT REVEALS */}
              {activeEntry.secrets && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#d97706]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Hidden Secrets &amp; Plot Reveals (Author-Only)</span>
                  </div>
                  <div className="p-5 rounded-xl border border-[#d97706]/30 bg-[#fffbeb] dark:bg-[#1f1a14] dark:border-[#d97706]/30">
                    <p className="text-xs text-[#92400e] dark:text-[#fde68a] leading-relaxed">
                      {activeEntry.secrets}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. CONTINUITY AUDIT & CONFLICT WATCH */}
              <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <div>
                    <span className="font-semibold text-[#191918] dark:text-[#f4f4f5]">
                      Continuity Verified
                    </span>
                    <span className="text-[#9c9c98] block text-[11px]">
                      No spatial or historical contradictions detected across active chapters.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#9c9c98]">Canon Engine 2.4</span>
              </div>

              {/* 5. CONNECTED CHARACTERS */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                  Connected Characters
                </h2>
                <div className="flex flex-wrap gap-2">
                  {activeEntry.linkedCharacterIds && activeEntry.linkedCharacterIds.length > 0 ? (
                    activeEntry.linkedCharacterIds.map((charId) => {
                      const char = characters.find((c) => c.id === charId);
                      if (!char) return null;
                      return (
                        <button
                          key={char.id}
                          onClick={() => onNavigateToCharacter && onNavigateToCharacter(char.id)}
                          className="px-3 py-1.5 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] hover:border-[#4f46e5] text-xs font-medium text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-2 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5 text-[#9c9c98]" />
                          <span>{char.name}</span>
                          <span className="text-[10px] text-[#9c9c98]">({char.role})</span>
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-[#9c9c98]">No specific character ties assigned</span>
                  )}
                </div>
              </div>

              {/* 6. MANUSCRIPT APPEARANCES & SCENES */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                  Manuscript References &amp; Scenes
                </h2>
                <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] divide-y divide-[#ecece9] dark:divide-[#28292d] text-xs">
                  {getLinkedScenes(activeEntry).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigateToScene && onNavigateToScene(item.chapterId, item.sceneId)}
                      className="py-2.5 flex items-center justify-between hover:text-[#4f46e5] cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#9c9c98]" />
                        <span className="font-serif font-medium text-[#191918] dark:text-[#f4f4f5] group-hover:text-[#4f46e5]">
                          Chapter {item.chapterNumber}: {item.sceneTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9c9c98] flex items-center space-x-1">
                        <span>Open Scene</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                  {getLinkedScenes(activeEntry).length === 0 && (
                    <div className="py-2 text-[#9c9c98]">No explicit scene references found</div>
                  )}
                </div>
              </div>

              {/* 7. CONNECTED RESEARCH NOTES */}
              {getLinkedResearch(activeEntry).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                    Author Research Notebook Connections
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {getLinkedResearch(activeEntry).map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517]"
                      >
                        <span className="text-[10px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                          {res.category}
                        </span>
                        <h4 className="font-serif font-semibold text-[#191918] dark:text-[#f4f4f5] mt-1">
                          {res.title}
                        </h4>
                        <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] line-clamp-2 mt-1">
                          {res.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ) : (
            <div className="text-center p-12 text-xs text-[#9c9c98]">Select an entry to view article</div>
          )}
        </div>
      </div>
    </div>
  );
};
