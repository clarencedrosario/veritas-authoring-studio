import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  GraduationCap,
  Feather,
  FileText,
  Film,
  Plus,
  ArrowUpDown,
  BookOpen,
  Clock,
  CheckCircle2,
  Copy,
  Edit2,
  Archive,
  Trash2,
  ExternalLink,
  Tag,
  Calendar,
  AlertTriangle,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import {
  NovelProject,
  GrammarSeriesProject,
  ContentWritingProject,
  ScriptProject,
} from '../types';

export type ProjectFilterType = 'all' | 'academic' | 'novels' | 'content' | 'scripts' | 'recent' | 'archived';
export type ProjectSortType = 'lastModified' | 'title' | 'wordCount';

export interface UnifiedProjectItem {
  id: string;
  type: 'academic' | 'novel' | 'content' | 'script';
  title: string;
  subtitle?: string;
  authorOrBoard: string;
  detailBadge: string;
  wordCount: number;
  unitsCount: number;
  unitLabel: string;
  lastEdited: string;
  isArchived?: boolean;
  status: string;
  tags: string[];
}

interface ProjectLibraryViewProps {
  novelProject: NovelProject;
  grammarProject: GrammarSeriesProject;
  contentProject: ContentWritingProject;
  scriptProject: ScriptProject;
  onOpenProject: (type: 'academic' | 'novel' | 'content' | 'film', projectId?: string) => void;
  onUpdateNovelProject: (updates: Partial<NovelProject>) => void;
  onUpdateGrammarProject: (updated: GrammarSeriesProject) => void;
  onUpdateContentProject: (updated: ContentWritingProject) => void;
  onUpdateScriptProject: (updated: ScriptProject) => void;
  isDarkMode: boolean;
}

export const ProjectLibraryView: React.FC<ProjectLibraryViewProps> = ({
  novelProject,
  grammarProject,
  contentProject,
  scriptProject,
  onOpenProject,
  onUpdateNovelProject,
  onUpdateGrammarProject,
  onUpdateContentProject,
  onUpdateScriptProject,
  isDarkMode,
}) => {
  const [filter, setFilter] = useState<ProjectFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<ProjectSortType>('lastModified');
  const [archivedIds, setArchivedIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('veritas_archived_projects');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Rename modal state
  const [editingProject, setEditingProject] = useState<UnifiedProjectItem | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Delete confirmation state
  const [deletingProject, setDeletingProject] = useState<UnifiedProjectItem | null>(null);

  // New project modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newType, setNewType] = useState<'academic' | 'novel' | 'content' | 'script'>('novel');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const toggleArchive = (id: string) => {
    setArchivedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('veritas_archived_projects', JSON.stringify(next));
      return next;
    });
  };

  // Assemble Unified Projects list
  const allItems: UnifiedProjectItem[] = useMemo(() => {
    const list: UnifiedProjectItem[] = [];

    // 1. Novel Project
    const totalNovelWords = novelProject.chapters.reduce(
      (acc, c) => acc + c.scenes.reduce((sa, s) => sa + (s.wordCount || 0), 0),
      0
    );
    const totalScenes = novelProject.chapters.reduce((acc, c) => acc + c.scenes.length, 0);
    list.push({
      id: novelProject.id || 'novel-active',
      type: 'novel',
      title: novelProject.title || 'Untitled Novel Manuscript',
      subtitle: novelProject.logline || novelProject.subtitle || 'Fiction Manuscript',
      authorOrBoard: novelProject.authorName || 'Julian Mercer',
      detailBadge: novelProject.genre || 'Literary Fiction',
      wordCount: totalNovelWords,
      unitsCount: novelProject.chapters.length,
      unitLabel: `${novelProject.chapters.length} Chapters (${totalScenes} Scenes)`,
      lastEdited: novelProject.updatedAt || new Date().toISOString(),
      isArchived: !!archivedIds[novelProject.id || 'novel-active'],
      status: 'Active Drafting',
      tags: [novelProject.genre, 'Fiction', 'Novel'].filter(Boolean) as string[],
    });

    // 2. Academic Book Projects
    if (grammarProject.bookProjects && Object.keys(grammarProject.bookProjects).length > 0) {
      Object.entries(grammarProject.bookProjects).forEach(([id, bp]) => {
        const wordCount = bp.estimatedWordCount || (bp.topics?.length || 0) * 1800;
        list.push({
          id,
          type: 'academic',
          title: bp.bookTitle || `Grammar & Language — ${bp.classLevel}`,
          subtitle: bp.subtitle || `${bp.board} Curriculum Series Volume`,
          authorOrBoard: `${bp.board} (${bp.classLevel})`,
          detailBadge: `${bp.board} • ${bp.classLevel}`,
          wordCount,
          unitsCount: bp.topics?.length || 0,
          unitLabel: `${bp.topics?.length || 0} Syllabus Chapters`,
          lastEdited: bp.lastEdited || new Date().toISOString(),
          isArchived: !!archivedIds[id],
          status: bp.status || 'Authoring',
          tags: [bp.board, bp.classLevel, 'Academic', 'NEP 2020'],
        });
      });
    } else {
      // Fallback from books record
      Object.entries(grammarProject.books || {}).forEach(([cls, b]) => {
        const id = `academic-${cls.toLowerCase().replace(/\s+/g, '-')}`;
        list.push({
          id,
          type: 'academic',
          title: b.title || `Middle School Grammar & Syntax — ${cls}`,
          subtitle: `${grammarProject.seriesTitle} (${grammarProject.targetBoard})`,
          authorOrBoard: `${grammarProject.targetBoard} (${cls})`,
          detailBadge: `${grammarProject.targetBoard} • ${cls}`,
          wordCount: (b.topics?.length || 0) * 1900,
          unitsCount: b.topics?.length || 0,
          unitLabel: `${b.topics?.length || 0} Chapters`,
          lastEdited: new Date().toISOString(),
          isArchived: !!archivedIds[id],
          status: 'Curriculum Ready',
          tags: [grammarProject.targetBoard, cls, 'Academic'],
        });
      });
    }

    // 3. Content Writing Project
    const totalContentWords = contentProject.documents.reduce((acc, d) => acc + (d.wordCount || 0), 0);
    list.push({
      id: contentProject.id || 'content-active',
      type: 'content',
      title: contentProject.title || 'Thought Leadership & Analysis Articles',
      subtitle: contentProject.brandOrPublication || 'Essays, whitepapers, and review documents',
      authorOrBoard: 'Content Writing Studio',
      detailBadge: `${contentProject.documents.length} Documents`,
      wordCount: totalContentWords,
      unitsCount: contentProject.documents.length,
      unitLabel: `${contentProject.documents.length} Articles / Essays`,
      lastEdited: contentProject.documents[0]?.updatedAt || new Date().toISOString(),
      isArchived: !!archivedIds[contentProject.id || 'content-active'],
      status: 'Active Pipeline',
      tags: ['Nonfiction', 'Essays', 'Articles'],
    });

    // 4. Script Project
    const totalScriptScenes = scriptProject.scenes.length;
    const totalScriptElements = scriptProject.scenes.reduce((acc, s) => acc + s.elements.length, 0);
    list.push({
      id: scriptProject.id || 'script-active',
      type: 'script',
      title: scriptProject.title || 'Screenplay & Feature Film',
      subtitle: scriptProject.logline || `${scriptProject.format} Screenplay`,
      authorOrBoard: scriptProject.screenwriter || 'Film & Script Studio',
      detailBadge: `${scriptProject.format}`,
      wordCount: totalScriptElements * 25,
      unitsCount: totalScriptScenes,
      unitLabel: `${totalScriptScenes} Screenplay Scenes (${totalScriptElements} Elements)`,
      lastEdited: new Date().toISOString(),
      isArchived: !!archivedIds[scriptProject.id || 'script-active'],
      status: 'In Development',
      tags: [scriptProject.format, 'Screenplay'],
    });

    return list;
  }, [novelProject, grammarProject, contentProject, scriptProject, archivedIds]);

  // Filter & Search & Sort
  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        // Filter tabs
        if (filter === 'academic' && item.type !== 'academic') return false;
        if (filter === 'novels' && item.type !== 'novel') return false;
        if (filter === 'content' && item.type !== 'content') return false;
        if (filter === 'scripts' && item.type !== 'script') return false;
        if (filter === 'archived' && !item.isArchived) return false;
        if (filter !== 'archived' && item.isArchived) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSub = (item.subtitle || '').toLowerCase().includes(q);
          const matchAuthor = item.authorOrBoard.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchSub || matchAuthor || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'wordCount') return b.wordCount - a.wordCount;
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
      });
  }, [allItems, filter, searchQuery, sortBy]);

  // Actions
  const handleOpen = (item: UnifiedProjectItem) => {
    if (item.type === 'academic') {
      onOpenProject('academic', item.id);
    } else if (item.type === 'novel') {
      onOpenProject('novel');
    } else if (item.type === 'content') {
      onOpenProject('content');
    } else if (item.type === 'script') {
      onOpenProject('film');
    }
  };

  const handleStartRename = (item: UnifiedProjectItem) => {
    setEditingProject(item);
    setRenameInput(item.title);
  };

  const handleSaveRename = () => {
    if (!editingProject || !renameInput.trim()) return;

    if (editingProject.type === 'novel') {
      onUpdateNovelProject({ title: renameInput.trim() });
    } else if (editingProject.type === 'academic') {
      const activeProjId = editingProject.id;
      if (grammarProject.bookProjects?.[activeProjId]) {
        onUpdateGrammarProject({
          ...grammarProject,
          bookProjects: {
            ...grammarProject.bookProjects,
            [activeProjId]: {
              ...grammarProject.bookProjects[activeProjId],
              bookTitle: renameInput.trim(),
            },
          },
        });
      }
    } else if (editingProject.type === 'content') {
      onUpdateContentProject({
        ...contentProject,
        title: renameInput.trim(),
      });
    } else if (editingProject.type === 'script') {
      onUpdateScriptProject({
        ...scriptProject,
        title: renameInput.trim(),
      });
    }

    setEditingProject(null);
  };

  const handleDuplicate = (item: UnifiedProjectItem) => {
    if (item.type === 'novel') {
      onUpdateNovelProject({
        title: `${novelProject.title} (Copy)`,
      });
      alert(`Duplicated novel manuscript: "${novelProject.title} (Copy)"`);
    } else if (item.type === 'content') {
      onUpdateContentProject({
        ...contentProject,
        title: `${contentProject.title} (Duplicate)`,
      });
      alert(`Duplicated content project: "${contentProject.title} (Duplicate)"`);
    } else if (item.type === 'script') {
      onUpdateScriptProject({
        ...scriptProject,
        title: `${scriptProject.title} (Copy)`,
      });
      alert(`Duplicated screenplay: "${scriptProject.title} (Copy)"`);
    } else if (item.type === 'academic') {
      const source = grammarProject.bookProjects?.[item.id];
      if (source) {
        const newId = `proj-copy-${Date.now()}`;
        onUpdateGrammarProject({
          ...grammarProject,
          bookProjects: {
            ...grammarProject.bookProjects,
            [newId]: {
              ...source,
              id: newId,
              bookTitle: `${source.bookTitle} (Copy)`,
            },
          },
        });
        alert(`Duplicated academic book: "${source.bookTitle} (Copy)"`);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingProject) return;

    if (deletingProject.type === 'academic') {
      if (grammarProject.bookProjects?.[deletingProject.id]) {
        const updated = { ...grammarProject.bookProjects };
        delete updated[deletingProject.id];
        onUpdateGrammarProject({
          ...grammarProject,
          bookProjects: updated,
        });
      }
    } else {
      toggleArchive(deletingProject.id);
    }

    setDeletingProject(null);
  };

  const handleCreateNewProject = () => {
    if (!newTitle.trim()) return;

    if (newType === 'novel') {
      onUpdateNovelProject({
        title: newTitle.trim(),
        logline: newSubtitle.trim() || 'A new fiction manuscript',
      });
      onOpenProject('novel');
    } else if (newType === 'academic') {
      const newId = `proj-${Date.now()}`;
      const newBook = {
        id: newId,
        seriesTitle: grammarProject.seriesTitle,
        bookTitle: newTitle.trim(),
        subtitle: newSubtitle.trim() || 'English Language & Grammar Syllabus',
        board: 'CBSE',
        programme: 'cbse-main',
        classLevel: 'Class 6',
        classOrStage: 'Class 6',
        subject: 'English Language & Grammar',
        author: 'Julian Mercer',
        edition: 'Student Edition',
        academicYear: '2026–2027',
        status: 'Authoring',
        notes: 'Newly initiated volume',
        topics: [],
        lastEdited: new Date().toISOString(),
      };
      onUpdateGrammarProject({
        ...grammarProject,
        bookProjects: {
          ...(grammarProject.bookProjects || {}),
          [newId]: newBook as any,
        },
        activeBookProjectId: newId,
      });
      onOpenProject('academic', newId);
    } else if (newType === 'content') {
      onUpdateContentProject({
        ...contentProject,
        title: newTitle.trim(),
        brandOrPublication: newSubtitle.trim(),
      });
      onOpenProject('content');
    } else if (newType === 'script') {
      onUpdateScriptProject({
        ...scriptProject,
        title: newTitle.trim(),
        logline: newSubtitle.trim(),
      });
      onOpenProject('film');
    }

    setShowNewModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-[#C29A52]" />;
      case 'novel':
        return <Feather className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'content':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'script':
        return <Film className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <FolderOpen className="w-4 h-4 text-[#9A7438]" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-[#5A1832] text-[#F6F0E7] border-[#C29A52]/40';
      case 'novel':
        return 'bg-emerald-950 text-emerald-200 border-emerald-700/50';
      case 'content':
        return 'bg-blue-950 text-blue-200 border-blue-700/50';
      case 'script':
        return 'bg-purple-950 text-purple-200 border-purple-700/50';
      default:
        return 'bg-stone-800 text-stone-200 border-stone-600';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F6F0E7] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] overflow-hidden">
      {/* Top Header: Title & Action Bar */}
      <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#2c1320] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#5A1832] text-[#C29A52]">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] tracking-tight">
              Veritas Project Library
            </h1>
          </div>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5 font-sans">
            Central repository for Academic Books, Novels, Content Articles, and Screenplays.
          </p>
        </div>

        {/* Create Project Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="h-9 px-3.5 rounded-xl bg-[#5A1832] hover:bg-[#722040] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C29A52]" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-6 py-3 border-b border-[#CBBEAC]/50 dark:border-[#4d1e2e]/50 bg-[#F6F0E7] dark:bg-[#200b14] flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Projects', count: allItems.filter((i) => !i.isArchived).length },
            { id: 'academic', label: 'Academic', count: allItems.filter((i) => i.type === 'academic' && !i.isArchived).length },
            { id: 'novels', label: 'Novels', count: allItems.filter((i) => i.type === 'novel' && !i.isArchived).length },
            { id: 'content', label: 'Content', count: allItems.filter((i) => i.type === 'content' && !i.isArchived).length },
            { id: 'scripts', label: 'Scripts', count: allItems.filter((i) => i.type === 'script' && !i.isArchived).length },
            { id: 'archived', label: 'Archived', count: allItems.filter((i) => i.isArchived).length },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id as ProjectFilterType)}
              className={`h-7.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                filter === pill.id
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC] hover:text-[#35101F] dark:hover:text-[#F6F0E7]'
              }`}
            >
              <span>{pill.label}</span>
              <span className="text-[10px] font-mono px-1 rounded bg-black/10 dark:bg-white/10">
                {pill.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71685E] dark:text-[#D8CCBC]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 w-48 sm:w-60 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 text-xs text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-[#71685E] dark:text-[#D8CCBC]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProjectSortType)}
              className="h-8 px-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 text-xs text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              <option value="lastModified">Last Edited</option>
              <option value="title">Title (A–Z)</option>
              <option value="wordCount">Word Count</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid / List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <FolderOpen className="w-12 h-12 text-[#9A7438]/50 mb-3" />
            <div className="text-base font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              No projects found
            </div>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-1 max-w-sm">
              {searchQuery
                ? `No projects matching "${searchQuery}" in this category.`
                : 'Get started by creating a new project in your chosen studio.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/70 dark:bg-[#2a1320] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top Section */}
                <div className="p-4 space-y-2.5">
                  {/* Studio Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold border flex items-center space-x-1.5 ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {getTypeIcon(item.type)}
                      <span>{item.type.toUpperCase()}</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
                      {item.status}
                    </span>
                  </div>

                  {/* Project Title & Subtitle */}
                  <div>
                    <h3
                      onClick={() => handleOpen(item)}
                      className="font-serif font-bold text-[15px] text-[#35101F] dark:text-[#F6F0E7] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] line-clamp-2 mt-1 font-sans">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Metadata Chips */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-mono text-[#5A1832] dark:text-[#C29A52] font-semibold flex items-center justify-between">
                      <span>{item.authorOrBoard}</span>
                      <span>{item.detailBadge}</span>
                    </div>

                    <div className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] font-mono flex items-center justify-between border-t border-[#CBBEAC]/40 dark:border-[#5A1832]/40 pt-1.5">
                      <span>{item.wordCount.toLocaleString()} words</span>
                      <span>{item.unitLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action Bar */}
                <div className="px-3 py-2 border-t border-[#CBBEAC]/50 dark:border-[#4d1e2e]/50 bg-[#E3D7C5] dark:bg-[#200b14] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpen(item)}
                    className="h-7 px-2.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] font-medium hover:bg-[#722040] text-[11px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3 text-[#C29A52]" />
                  </button>

                  <div className="flex items-center space-x-1 text-[#71685E] dark:text-[#D8CCBC]">
                    <button
                      onClick={() => handleStartRename(item)}
                      className="p-1.5 rounded-md hover:bg-[#CBBEAC]/50 dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
                      title="Rename project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="p-1.5 rounded-md hover:bg-[#CBBEAC]/50 dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleArchive(item.id)}
                      className="p-1.5 rounded-md hover:bg-[#CBBEAC]/50 dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
                      title={item.isArchived ? 'Restore project' : 'Archive project'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingProject(item)}
                      className="p-1.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-600 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] text-[#292521] dark:text-[#F6F0E7] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                Rename Project
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-[#71685E] hover:text-[#292521] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#71685E] dark:text-[#D8CCBC] mb-1 block">
                Project Title
              </label>
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#35101F] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none focus:ring-2 focus:ring-[#C29A52]"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingProject(null)}
                className="h-8 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-medium text-[#71685E] dark:text-[#D8CCBC]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                className="h-8 px-4 rounded-lg bg-[#5A1832] hover:bg-[#722040] text-[#F6F0E7] text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-300 dark:border-rose-900 bg-[#F6F0E7] dark:bg-[#200b14] text-[#292521] dark:text-[#F6F0E7] p-5 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                Delete Project
              </h3>
            </div>

            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#35101F] dark:text-[#F6F0E7]">"{deletingProject.title}"</strong>?
              This action will permanently remove or archive this project from the workspace.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingProject(null)}
                className="h-8 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-medium text-[#71685E] dark:text-[#D8CCBC]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-8 px-4 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] text-[#292521] dark:text-[#F6F0E7] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  Create New Veritas Project
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                  Choose a primary authoring studio to initialize project architecture.
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#71685E] hover:text-[#292521] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Studio Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'academic', label: 'Academic', icon: GraduationCap, desc: 'Class 1-12 Books' },
                { id: 'novel', label: 'Novel', icon: Feather, desc: 'Fiction Manuscript' },
                { id: 'content', label: 'Content', icon: FileText, desc: 'Articles & Essays' },
                { id: 'script', label: 'Screenplay', icon: Film, desc: 'Film & Teleplay' },
              ].map((s) => {
                const Icon = s.icon;
                const isSel = newType === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setNewType(s.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSel
                        ? 'border-[#C29A52] bg-[#5A1832] text-[#F6F0E7] shadow-sm'
                        : 'border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 text-[#71685E] dark:text-[#D8CCBC] hover:border-[#9A7438]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSel ? 'text-[#C29A52]' : 'text-[#71685E] dark:text-[#D8CCBC]'}`} />
                    <div>
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] opacity-80">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#71685E] dark:text-[#D8CCBC] mb-1 block">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder={
                    newType === 'academic'
                      ? 'e.g. Applied English Syntax & Composition — Class 7'
                      : newType === 'novel'
                      ? 'e.g. The Whispering Archive'
                      : newType === 'content'
                      ? 'e.g. Deep Architectural Analysis of Modern LLMs'
                      : 'e.g. Echoes in the Orbit — Feature Screenplay'
                  }
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#35101F] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none focus:ring-2 focus:ring-[#C29A52]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#71685E] dark:text-[#D8CCBC] mb-1 block">
                  Subtitle / Logline / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Central premise, target board, or publication objective"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] bg-white dark:bg-[#35101F] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none focus:ring-2 focus:ring-[#C29A52]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4d1e2e]/50">
              <button
                onClick={() => setShowNewModal(false)}
                className="h-8.5 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-medium text-[#71685E] dark:text-[#D8CCBC]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewProject}
                disabled={!newTitle.trim()}
                className="h-8.5 px-4 rounded-lg bg-[#5A1832] hover:bg-[#722040] disabled:opacity-50 text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Create &amp; Open Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
