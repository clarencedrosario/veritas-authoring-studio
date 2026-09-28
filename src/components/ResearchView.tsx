import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Tag,
  Users,
  MapPin,
  FileText,
  Copy,
  Check,
  Bookmark,
  Quote,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NovelProject, ResearchNote, Character, CodexEntry, ContentWritingProject } from '../types';
import { WorkspaceType } from './NavigationRail';

interface ResearchViewProps {
  project: NovelProject;
  contentProject?: ContentWritingProject;
  activeWorkspace?: WorkspaceType;
  onUpdateResearchNotes: (notes: ResearchNote[]) => void;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
  onNavigateToCharacter?: (characterId: string) => void;
  onNavigateToCodex?: (codexId: string) => void;
  onNavigateToContentStudio?: () => void;
  onNavigateToContentPiece?: (docId: string) => void;
}

const CATEGORY_MAP: Record<
  ResearchNote['category'],
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  'Historical': { label: 'Historical Period & Era', icon: Clock },
  'Geographical': { label: 'Setting & Location Reference', icon: MapPin },
  'Scientific & Technical': { label: 'Technical & Domain Expertise', icon: Bookmark },
  'Material & Sensory': { label: 'Sensory & Material Detail', icon: Sparkles },
  'Literary Reference': { label: 'Literary Inspirations & Citations', icon: Quote },
};

export const ResearchView: React.FC<ResearchViewProps> = ({
  project,
  contentProject,
  activeWorkspace,
  onUpdateResearchNotes,
  isDarkMode,
  onNavigateToScene,
  onNavigateToCharacter,
  onNavigateToCodex,
  onNavigateToContentStudio,
  onNavigateToContentPiece,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string>(
    project.researchNotes?.[0]?.id || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ResearchNote>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const notes = project.researchNotes || [];
  const characters = project.characters || [];
  const codexEntries = project.codexEntries || [];
  const chapters = project.chapters || [];

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.sourceUrl && note.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeNote = notes.find((n) => n.id === activeNoteId) || filteredNotes[0];

  const handleStartCreate = () => {
    const newNote: ResearchNote = {
      id: `research-${Date.now()}`,
      title: 'New Research Observation',
      category: selectedCategory === 'all' ? 'Historical' : (selectedCategory as any),
      content: '',
      sourceUrl: '',
      tags: ['Reference'],
      linkedCharacterIds: [],
      linkedCodexIds: [],
      linkedChapterIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditFormData(newNote);
    setIsEditing(true);
  };

  const handleStartEdit = (note: ResearchNote) => {
    setEditFormData({ ...note });
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!editFormData.title) return;

    const now = new Date().toISOString();
    if (notes.some((n) => n.id === editFormData.id)) {
      const updated = notes.map((n) =>
        n.id === editFormData.id ? { ...(editFormData as ResearchNote), updatedAt: now } : n
      );
      onUpdateResearchNotes(updated);
    } else {
      const updated = [{ ...(editFormData as ResearchNote), updatedAt: now }, ...notes];
      onUpdateResearchNotes(updated);
      setActiveNoteId(editFormData.id!);
    }
    setIsEditing(false);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this research note?')) {
      const updated = notes.filter((n) => n.id !== id);
      onUpdateResearchNotes(updated);
      if (activeNoteId === id) setActiveNoteId(updated[0]?.id || '');
      setIsEditing(false);
    }
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="research-notebook-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Workspace Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {activeWorkspace === 'content' && onNavigateToContentStudio && (
            <button
              onClick={onNavigateToContentStudio}
              className="mr-2 px-2.5 py-1 text-xs font-medium rounded-lg border border-[#e8e8e6] dark:border-[#28292d] text-[#191918] dark:text-[#f4f4f5] hover:bg-[#fbfbfa] dark:hover:bg-[#1a1b1e] flex items-center space-x-1 transition-colors"
            >
              <span>← Back to Content Studio</span>
            </button>
          )}
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            {activeWorkspace === 'content' ? 'Content Writing' : activeWorkspace === 'academic' ? 'Academic Books' : 'Novel Writing'}
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            {activeWorkspace === 'content' ? 'Research Archive & Fact Repository' : 'Author Research Notebook'}
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({notes.length} references)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartCreate}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Research Note</span>
          </button>
        </div>
      </header>

      {/* Two-Column Author's Notebook Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Note Index & Categories */}
        <div className="w-80 shrink-0 border-r border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-col">
          {/* Search bar */}
          <div className="p-3 border-b border-[#ecece9] dark:border-[#242528]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
              <input
                type="text"
                placeholder="Search research, citations, tags..."
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
              All ({notes.length})
            </button>
            {(Object.keys(CATEGORY_MAP) as ResearchNote['category'][]).map((cat) => {
              const count = notes.filter((n) => n.category === cat).length;
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

          {/* List of Research Notes */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#ecece9] dark:divide-[#242528]">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#9c9c98]">No research notes found</div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = note.id === activeNote?.id;
                const CatIcon = CATEGORY_MAP[note.category]?.icon || FileText;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
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
                        <CatIcon className="w-3 h-3 text-[#6e6e6b] dark:text-[#9ca3af]" />
                        <span className="text-[10px] font-mono uppercase text-[#9c9c98]">
                          {note.category}
                        </span>
                      </div>
                      {note.sourceUrl && (
                        <span className="text-[10px] font-mono text-[#4f46e5] dark:text-[#818cf8]">
                          Cited
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-serif font-bold text-[#191918] dark:text-[#f4f4f5] leading-snug">
                      {note.title}
                    </h3>
                    <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] line-clamp-2 mt-0.5">
                      {note.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Research Note Dossier */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {isEditing ? (
            /* Editing / Creation Form */
            <div className="max-w-3xl mx-auto p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] space-y-4 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#ecece9] dark:border-[#242528] pb-3">
                <span className="font-serif font-bold text-sm text-[#191918] dark:text-[#f4f4f5]">
                  {editFormData.id ? 'Edit Research Reference' : 'New Research Reference'}
                </span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-[#9c9c98] hover:text-[#191918]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Reference Title</label>
                  <input
                    type="text"
                    value={editFormData.title || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    placeholder="e.g. Coastal Lime-Mortar Decay &amp; Sea Fog Salt Absorption"
                    className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Category</label>
                  <select
                    value={editFormData.category || 'Historical'}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                  >
                    {(Object.keys(CATEGORY_MAP) as ResearchNote['category'][]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_MAP[cat].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Source Bibliography / Citation / URL</label>
                <input
                  type="text"
                  value={editFormData.sourceUrl || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, sourceUrl: e.target.value })}
                  placeholder="e.g. Royal Architectural Archives (1894), Vol. 14, or https://..."
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#191918] dark:text-[#f4f4f5]">Field Notes, Technical Details &amp; Extracted Quotes</label>
                <textarea
                  value={editFormData.content || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  rows={8}
                  placeholder="Record historical facts, technical jargon, physical weights, real-world blueprints, or verbatim extracts..."
                  className="w-full p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded-lg font-medium shadow-2xs"
                >
                  Save Research Note
                </button>
              </div>
            </div>
          ) : activeNote ? (
            /* Note Display View */
            <article className="max-w-3xl mx-auto space-y-8">
              {/* Note Header */}
              <div className="border-b border-[#e8e8e6] dark:border-[#28292d] pb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                      {CATEGORY_MAP[activeNote.category]?.label}
                    </span>
                    <span className="text-[#9c9c98]">&bull;</span>
                    <span className="text-[11px] font-mono text-[#9c9c98]">
                      Updated: {new Date(activeNote.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCitation(activeNote.content, activeNote.id)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] bg-white dark:bg-[#1f2023] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-1.5 transition-colors"
                      title="Copy content for manuscript reference"
                    >
                      {copiedId === activeNote.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === activeNote.id ? 'Copied' : 'Copy Excerpt'}</span>
                    </button>
                    <button
                      onClick={() => handleStartEdit(activeNote)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] bg-white dark:bg-[#1f2023] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Note</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(activeNote.id)}
                      className="p-1.5 rounded-md text-[#9c9c98] hover:text-[#b91c1c] hover:bg-[#fef2f2] dark:hover:bg-[#1f1616] transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5] leading-tight">
                  {activeNote.title}
                </h1>

                {activeNote.sourceUrl && (
                  <div className="flex items-center space-x-2 mt-2 text-xs font-mono text-[#6e6e6b] dark:text-[#9ca3af]">
                    <LinkIcon className="w-3.5 h-3.5 text-[#4f46e5] dark:text-[#818cf8]" />
                    <span>Citation / Source:</span>
                    <span className="text-[#191918] dark:text-[#f4f4f5] font-serif italic">
                      {activeNote.sourceUrl}
                    </span>
                  </div>
                )}
              </div>

              {/* Research Content */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                  Field Notes &amp; Technical Reference
                </h2>
                <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs">
                  <p className="text-sm font-serif text-[#191918] dark:text-[#f4f4f5] leading-relaxed whitespace-pre-line">
                    {activeNote.content}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {activeNote.tags && activeNote.tags.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-[#9c9c98]" />
                  <span className="text-[#9c9c98] font-mono text-[11px]">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {activeNote.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#d4d4d8]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Elements (Content Pieces for Content Studio, Characters/Codex for Novel) */}
              {activeWorkspace === 'content' ? (
                <div className="space-y-3">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                    Referenced in Content Writing Pieces
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {contentProject?.documents && contentProject.documents.length > 0 ? (
                      contentProject.documents.map((doc) => {
                        const isLinked = activeNote.linkedContentDocIds?.includes(doc.id);
                        return (
                          <button
                            key={doc.id}
                            onClick={() => onNavigateToContentPiece && onNavigateToContentPiece(doc.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-2 transition-colors ${
                              isLinked
                                ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]'
                                : 'border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] text-[#191918] dark:text-[#f4f4f5] hover:border-[#5A1832]'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-[#9A7438]" />
                            <span className="truncate max-w-[200px]">{doc.title}</span>
                            <span className="text-[10px] font-mono opacity-70">({doc.contentType.replace(/_/g, ' ')})</span>
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-xs text-[#9c9c98]">No content pieces in workspace</span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Linked Characters */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                      Relevant Characters
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {activeNote.linkedCharacterIds && activeNote.linkedCharacterIds.length > 0 ? (
                        activeNote.linkedCharacterIds.map((charId) => {
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
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-xs text-[#9c9c98]">No characters specifically tagged</span>
                      )}
                    </div>
                  </div>

                  {/* Linked Codex Lore */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
                      Connected World Codex Lore
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {activeNote.linkedCodexIds && activeNote.linkedCodexIds.length > 0 ? (
                        activeNote.linkedCodexIds.map((codexId) => {
                          const codex = codexEntries.find((c) => c.id === codexId);
                          if (!codex) return null;
                          return (
                            <button
                              key={codex.id}
                              onClick={() => onNavigateToCodex && onNavigateToCodex(codex.id)}
                              className="px-3 py-1.5 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] hover:border-[#4f46e5] text-xs font-medium text-[#191918] dark:text-[#f4f4f5] flex items-center space-x-2 transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#9c9c98]" />
                              <span>{codex.title}</span>
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-xs text-[#9c9c98]">No codex entries tagged</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </article>
          ) : (
            <div className="text-center p-12 text-xs text-[#9c9c98]">
              Select a research note to view dossier
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
