import React, { useState } from 'react';
import {
  BookOpen,
  BookMarked,
  Layers,
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  FileSpreadsheet,
  ShieldCheck,
  Eye,
  Copy,
  Archive,
  ArrowRightLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Edit3,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Send,
  GitBranch,
  Globe2,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  BookProject,
  CurriculumSystemId,
  GrammarClassLevel,
  BookProjectStatus,
} from '../../types';
import { getInitialBookProjects } from '../../utils/bookProjectUtils';
import { PublishingBreadcrumbs } from './PublishingBreadcrumbs';
import { BookProjectCard } from './BookProjectCard';
import { BookProjectDetailModal } from './BookProjectDetailModal';
import { CreateNewBookProjectModal } from './CreateNewBookProjectModal';
import { BookWideAuditView } from './BookWideAuditView';

interface BookProjectsViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onOpenBookPlanner: (projectId: string) => void;
  onOpenChapterStudio: (chapterId?: string) => void;
  onOpenCurriculumMapping: () => void;
  onOpenScopeSequence: () => void;
  onOpenSeriesStudio: () => void;
  onOpenTextbookPreview?: (classLevel?: string) => void;
  onOpenLayoutExport?: (classLevel?: string) => void;
  onOpenPublisherSubmission?: () => void;
  isDarkMode?: boolean;
}

export const BookProjectsView: React.FC<BookProjectsViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onOpenBookPlanner,
  onOpenChapterStudio,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenSeriesStudio,
  onOpenTextbookPreview,
  onOpenLayoutExport,
  onOpenPublisherSubmission,
  isDarkMode,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<BookProject | null>(null);
  const [activeAuditProject, setActiveAuditProject] = useState<BookProject | null>(null);

  // Initialize Projects
  const bookProjectsMap: Record<string, BookProject> =
    seriesProject.bookProjects && Object.keys(seriesProject.bookProjects).length > 0
      ? seriesProject.bookProjects
      : getInitialBookProjects(seriesProject);

  const bookProjectsList = Object.values(bookProjectsMap);

  // Filter projects
  const filteredProjects = bookProjectsList.filter((proj) => {
    if (!showArchived && proj.isArchived) return false;
    if (selectedBoardFilter !== 'ALL' && proj.board !== selectedBoardFilter) return false;
    if (selectedStatusFilter !== 'ALL' && proj.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        proj.bookTitle.toLowerCase().includes(q) ||
        (proj.subtitle && proj.subtitle.toLowerCase().includes(q)) ||
        proj.classOrStage.toLowerCase().includes(q) ||
        proj.board.toLowerCase().includes(q) ||
        proj.internalProjectCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPI Metrics
  const totalBooks = bookProjectsList.length;
  const inPlanning = bookProjectsList.filter((b) => b.status === 'Planning' || b.status === 'Curriculum Mapping').length;
  const inAuthoring = bookProjectsList.filter((b) => b.status === 'Authoring').length;
  const inReview = bookProjectsList.filter((b) => b.status === 'Academic Review' || b.status === 'Assessment Review').length;
  const layoutOrPrepress = bookProjectsList.filter((b) => b.status === 'Layout' || b.status === 'Proofreading' || b.status === 'Publisher Ready').length;
  const published = bookProjectsList.filter((b) => b.status === 'Published').length;

  // Actions
  const handleSaveBookProject = (updated: BookProject) => {
    const updatedMap = {
      ...bookProjectsMap,
      [updated.id]: updated,
    };
    onUpdateSeriesProject({
      ...seriesProject,
      bookProjects: updatedMap,
      activeBookProjectId: updated.id,
      selectedClass: updated.classLevel,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleCreateNewProject = (newProj: BookProject) => {
    const updatedMap = {
      ...bookProjectsMap,
      [newProj.id]: newProj,
    };
    onUpdateSeriesProject({
      ...seriesProject,
      bookProjects: updatedMap,
      activeBookProjectId: newProj.id,
      selectedClass: newProj.classLevel,
      lastUpdated: new Date().toISOString(),
    });
    setShowNewProjectModal(false);
  };

  const handleAdaptBoard = (projectId: string) => {
    const baseProj = bookProjectsMap[projectId];
    if (!baseProj) return;

    const nextBoard =
      baseProj.board === 'CBSE' ? 'CISCE' : baseProj.board === 'CISCE' ? 'Cambridge' : 'CBSE';
    const nextStage =
      nextBoard === 'Cambridge'
        ? baseProj.classOrStage.includes('6')
          ? 'Cambridge Lower Secondary (Stage 7)'
          : 'Stage 8'
        : baseProj.classOrStage;

    const newId = `bp-${nextBoard.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const adaptedProject: BookProject = {
      ...baseProj,
      id: newId,
      board: nextBoard,
      classOrStage: nextStage,
      bookTitle: `${baseProj.bookTitle} (${nextBoard} Edition)`,
      subtitle: `Syllabus-aligned grammar courseware adapted for ${nextBoard} ${nextStage}`,
      status: 'Planning',
      internalProjectCode: `${baseProj.internalProjectCode}-ADAPT-${nextBoard}`,
      notes: `Adapted from ${baseProj.board} ${baseProj.classOrStage} edition for cross-board publishing alignment.`,
      lastEdited: new Date().toISOString(),
    };

    handleSaveBookProject(adaptedProject);
  };

  const handleDuplicateEdition = (projectId: string) => {
    const baseProj = bookProjectsMap[projectId];
    if (!baseProj) return;

    const newId = `${baseProj.id}-copy-${Date.now().toString().slice(-4)}`;
    const duplicatedProject: BookProject = {
      ...baseProj,
      id: newId,
      bookTitle: `${baseProj.bookTitle} (Teacher's Edition)`,
      subtitle: `Annotated pedagogical guide with answer keys & teacher scripts`,
      edition: 'Teacher Edition',
      status: 'Planning',
      internalProjectCode: `${baseProj.internalProjectCode}-TE`,
      lastEdited: new Date().toISOString(),
    };

    handleSaveBookProject(duplicatedProject);
  };

  const handleArchiveProject = (projectId: string) => {
    const baseProj = bookProjectsMap[projectId];
    if (!baseProj) return;

    const updated: BookProject = {
      ...baseProj,
      isArchived: !baseProj.isArchived,
      lastEdited: new Date().toISOString(),
    };
    handleSaveBookProject(updated);
  };

  const getStatusBadge = (status: BookProjectStatus) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'Curriculum Mapping':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800';
      case 'Authoring':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'Academic Review':
      case 'Assessment Review':
        return 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'Layout':
      case 'Publisher Ready':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
      case 'Published':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getBoardBadge = (board: string) => {
    if (board === 'CBSE') return 'bg-[#5A1832] text-[#F6F0E7] border-[#C29A52]/40';
    if (board === 'CISCE') return 'bg-[#35101F] text-[#E6C994] border-[#9A7438]/50';
    return 'bg-slate-800 text-sky-200 border-sky-600/40';
  };

  return (
    <div
      id="book-projects-root"
      className="w-full min-h-full flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]"
    >
      <div id="book-projects-container" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
        {/* Breadcrumb Hierarchy */}
        <PublishingBreadcrumbs
          items={[
            {
              label: 'Academic Publishing',
              icon: Globe2,
              onClick: onOpenSeriesStudio,
            },
            {
              label: 'Grammar in Action',
              onClick: onOpenSeriesStudio,
            },
            {
              label: 'Book Projects',
              icon: BookOpen,
              isCurrent: true,
            },
          ]}
        />

        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
              <BookOpen className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Book Library &amp; Project Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7]">
              Book Projects
            </h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] max-w-3xl">
              Manage individual textbook volumes, editions, production status, curriculum profiles and publishing readiness.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-nav-to-series-studio"
              onClick={onOpenSeriesStudio}
              className="flex items-center space-x-2 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[13.5px] font-semibold text-[#292521] dark:text-[#F6F0E7] transition-colors shadow-2xs"
            >
              <Globe2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Series Studio</span>
            </button>

            <button
              id="btn-create-new-book-project"
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center space-x-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[13.5px] font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#C29A52]" />
              <span>+ New Book Project</span>
            </button>
          </div>
        </div>

        {/* 2. Key Status Counts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Total Volumes</div>
            <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-1">{totalBooks}</div>
            <div className="text-[10px] text-[#9A7438] dark:text-[#C29A52] mt-0.5">Across All Boards</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Planning</div>
            <div className="text-xl font-bold font-mono text-blue-700 dark:text-blue-400 mt-1">{inPlanning}</div>
            <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Initial Scope</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">In Authoring</div>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{inAuthoring}</div>
            <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Active Manuscripts</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Academic Review</div>
            <div className="text-xl font-bold font-mono text-purple-700 dark:text-purple-400 mt-1">{inReview}</div>
            <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Peer Audit</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Layout Ready</div>
            <div className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-400 mt-1">{layoutOrPrepress}</div>
            <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Typesetting</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Published</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{published}</div>
            <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Released Editions</div>
          </div>
        </div>

        {/* 3. Filter & Controls Toolbar */}
        <div className="p-4 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, level, board, code..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-xs text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E]/70 dark:placeholder-[#c9b9a6]/70 focus:outline-hidden focus:ring-1 focus:ring-[#9A7438]"
              />
            </div>

            {/* Board Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#71685E] dark:text-[#c9b9a6] font-medium hidden sm:inline">Board:</span>
              <div className="flex items-center space-x-1 p-1 bg-[#EDE4D6] dark:bg-[#35101F] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
                {['ALL', 'CBSE', 'CISCE', 'Cambridge'].map((board) => (
                  <button
                    key={board}
                    onClick={() => setSelectedBoardFilter(board)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedBoardFilter === board
                        ? 'bg-[#5A1832] text-[#F6F0E7] font-bold shadow-2xs'
                        : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
                    }`}
                  >
                    {board}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#71685E] dark:text-[#c9b9a6] font-medium hidden sm:inline">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-xs font-medium text-[#292521] dark:text-[#F6F0E7]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Planning">Planning</option>
                <option value="Curriculum Mapping">Curriculum Mapping</option>
                <option value="Authoring">Authoring</option>
                <option value="Academic Review">Academic Review</option>
                <option value="Layout">Layout</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 p-1 bg-[#EDE4D6] dark:bg-[#35101F] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#71685E] dark:text-[#c9b9a6] pt-1 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d]/50">
            <span>Showing <strong className="text-[#35101F] dark:text-[#F6F0E7]">{filteredProjects.length}</strong> of {bookProjectsList.length} book projects</span>
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="rounded text-[#5A1832] focus:ring-[#9A7438]"
              />
              <span>Show Archived</span>
            </label>
          </div>
        </div>

        {/* 4. Book Projects Display: Grid or Table */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] space-y-3">
            <BookOpen className="w-10 h-10 text-[#9A7438] dark:text-[#C29A52] mx-auto opacity-70" />
            <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
              No Matching Book Projects Found
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] max-w-md mx-auto">
              Try adjusting your search query or filters, or initialize a new academic book project.
            </p>
            <button
              onClick={() => {
                setSelectedBoardFilter('ALL');
                setSelectedStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const book = seriesProject.books[project.classLevel];
              return (
                <BookProjectCard
                  key={project.id}
                  project={project}
                  book={book}
                  isActive={seriesProject.activeBookProjectId === project.id}
                  onOpen={() => setEditingProject(project)}
                  onOpenBookPlanner={(projId) => onOpenBookPlanner(projId)}
                  onOpenChapterStudio={() => onOpenChapterStudio()}
                  onOpenTextbookPreview={() => onOpenTextbookPreview && onOpenTextbookPreview(project.classLevel)}
                  onOpenLayoutExport={() => onOpenLayoutExport && onOpenLayoutExport(project.classLevel)}
                  onRunAudit={() => setActiveAuditProject(project)}
                  onAdaptBoard={handleAdaptBoard}
                  onDuplicate={handleDuplicateEdition}
                  onArchive={handleArchiveProject}
                  onEditMetadata={() => setEditingProject(project)}
                />
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EDE4D6] dark:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7] font-serif font-bold border-b border-[#CBBEAC] dark:border-[#4f2c3d]">
                    <th className="p-3.5">Book Title &amp; Details</th>
                    <th className="p-3.5">Education System</th>
                    <th className="p-3.5">Level / Stage</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Chapters</th>
                    <th className="p-3.5 text-center">Pages</th>
                    <th className="p-3.5 text-center">Readiness</th>
                    <th className="p-3.5 text-right">Primary Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/40 dark:divide-[#4f2c3d]">
                  {filteredProjects.map((proj) => {
                    const book = seriesProject.books[proj.classLevel];
                    const chapterCount = book?.topics?.length || 0;
                    const readinessScore = proj.readiness?.overallScore || 70;

                    return (
                      <tr
                        key={proj.id}
                        className="hover:bg-[#EDE4D6]/50 dark:hover:bg-[#35101F]/40 transition-colors"
                      >
                        <td className="p-3.5">
                          <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                            {proj.bookTitle}
                          </div>
                          {proj.subtitle && (
                            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                              {proj.subtitle}
                            </div>
                          )}
                          <div className="text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52] mt-0.5">
                            {proj.internalProjectCode} • {proj.edition || 'Student Edition'}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border ${getBoardBadge(
                              proj.board
                            )}`}
                          >
                            {proj.board}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="font-medium text-[#292521] dark:text-[#F6F0E7]">
                            {proj.classOrStage}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${getStatusBadge(
                              proj.status
                            )}`}
                          >
                            {proj.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-center font-mono font-semibold text-[#35101F] dark:text-[#F6F0E7]">
                          {chapterCount}
                        </td>

                        <td className="p-3.5 text-center font-mono text-[#71685E] dark:text-[#c9b9a6]">
                          ~{proj.targetPageCount || 192}
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="inline-flex items-center space-x-1">
                            <span className="font-mono font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
                              {readinessScore}%
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* PRIMARY ACTION: Open Book Planner */}
                            <button
                              onClick={() => onOpenBookPlanner(proj.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1 shadow-2xs transition-colors"
                              title="Open Book Planner"
                            >
                              <BookMarked className="w-3.5 h-3.5 text-[#C29A52]" />
                              <span>Open Book Planner</span>
                            </button>

                            <button
                              onClick={() => onOpenChapterStudio()}
                              className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F]"
                              title="Open Chapter Studio"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F]"
                              title="Project Details & Metadata"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {editingProject && (
        <BookProjectDetailModal
          project={editingProject}
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onSave={(updated) => {
            handleSaveBookProject(updated);
            setEditingProject(null);
          }}
          onOpenChapterStudio={() => {
            setEditingProject(null);
            onOpenChapterStudio();
          }}
          onOpenBookPlanner={(projId) => {
            setEditingProject(null);
            onOpenBookPlanner(projId);
          }}
          onOpenTextbookPreview={() => {
            setEditingProject(null);
            onOpenTextbookPreview && onOpenTextbookPreview(editingProject.classLevel);
          }}
          onOpenLayoutExport={() => {
            setEditingProject(null);
            onOpenLayoutExport && onOpenLayoutExport(editingProject.classLevel);
          }}
        />
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <CreateNewBookProjectModal
          seriesTitle={seriesProject.seriesTitle || 'Grammar in Action: Complete K-12 English Series'}
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateNewProject}
        />
      )}

      {/* Audit Modal if clicked */}
      {activeAuditProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#9A7438] dark:text-[#C29A52]" />
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Whole-Book Audit: {activeAuditProject.bookTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveAuditProject(null)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#5A1832] text-[#F6F0E7]"
              >
                Close Audit
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <BookWideAuditView
                project={activeAuditProject}
                book={seriesProject.books[activeAuditProject.classLevel]}
                onOpenChapter={(topicId) => {
                  setActiveAuditProject(null);
                  onOpenChapterStudio(topicId);
                }}
                onUpdateProjectAuditIssues={(issues) => {
                  const updatedProj = { ...activeAuditProject, auditIssues: issues };
                  handleSaveBookProject(updatedProj);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
