import React, { useState } from 'react';
import {
  Layers,
  Globe2,
  BookOpen,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Plus,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  BookMarked,
  Info,
  Clock,
  Award,
  ChevronRight,
  SlidersHorizontal,
  FileText,
  BarChart3,
  Calendar,
  Send,
  GitBranch,
  Milestone,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  CurriculumSystemId,
  BookEdition,
  QualityAuditAlert,
  BookProject,
  BookProjectStatus,
  GrammarClassLevel,
  GrammarTopic,
} from '../../types';
import {
  CURRICULUM_SYSTEMS,
  CURRICULUM_STAGES,
  detectDuplications,
  detectCurriculumGaps,
} from '../../utils/multiBoardData';
import { getInitialBookProjects, getDefaultProductionMilestones, getDefaultRightsAndEditions, getDefaultPublisherProposal } from '../../utils/bookProjectUtils';
import { BookProjectCard } from './BookProjectCard';
import { BookProjectDetailModal } from './BookProjectDetailModal';
import { CreateNewBookProjectModal } from './CreateNewBookProjectModal';
import { BookProjectDetailView } from './BookProjectDetailView';
import { SeriesRoadmapView } from './SeriesRoadmapView';
import { BookCompletenessView } from './BookCompletenessView';
import { ChapterManagerView } from './ChapterManagerView';
import { BookWideAuditView } from './BookWideAuditView';
import { SeriesProgressionAuditView } from './SeriesProgressionAuditView';
import { RightsAndEditionsView } from './RightsAndEditionsView';
import { ProductionMilestonesView } from './ProductionMilestonesView';

interface SeriesDashboardViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onOpenBookEdition: (editionId: string) => void;
  onOpenCurriculumMapping: () => void;
  onOpenScopeSequence: () => void;
  onOpenBookPlanner?: (projectId?: string) => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
  onOpenTextbookPreview?: (classLevel?: string) => void;
  onOpenLayoutExport?: (classLevel?: string) => void;
  onOpenPublisherSubmission?: () => void;
  initialSubTab?: SeriesDashboardSubTab;
  initialProjectId?: string;
}

export type SeriesDashboardSubTab =
  | 'projects'
  | 'roadmap'
  | 'completeness'
  | 'chapters'
  | 'audit'
  | 'progression'
  | 'milestones'
  | 'rights'
  | 'systems';

export const SeriesDashboardView: React.FC<SeriesDashboardViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onOpenBookEdition,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenBookPlanner,
  onOpenChapterStudio,
  onOpenTextbookPreview,
  onOpenLayoutExport,
  onOpenPublisherSubmission,
  initialSubTab = 'projects',
  initialProjectId,
}) => {
  // Navigation & Sub-views
  const [activeSubTab, setActiveSubTab] = useState<SeriesDashboardSubTab>(initialSubTab);
  const [selectedBoardFilter, setSelectedBoardFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Edit State
  const [editingProject, setEditingProject] = useState<BookProject | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState<QualityAuditAlert | null>(null);

  // Initialize Book Projects if not present
  const bookProjectsMap: Record<string, BookProject> =
    seriesProject.bookProjects && Object.keys(seriesProject.bookProjects).length > 0
      ? seriesProject.bookProjects
      : getInitialBookProjects(seriesProject);

  const bookProjectsList = Object.values(bookProjectsMap);

  // Detail View State (Full screen detail mode for a selected Book Project)
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<BookProject | null>(
    initialProjectId ? bookProjectsMap[initialProjectId] || null : null
  );

  // Active book project selection
  const activeProjectId = seriesProject.activeBookProjectId || bookProjectsList[0]?.id || 'bp-cbse-c6';
  const activeBookProject = bookProjectsMap[activeProjectId] || bookProjectsList[0];
  const activeBook = seriesProject.books[activeBookProject?.classLevel || 'Class 6'];

  // Quality alerts
  const editionsMap: Record<string, BookEdition> = seriesProject.editions || {};
  const liveDuplications = detectDuplications(editionsMap);
  const liveGaps = detectCurriculumGaps(editionsMap, seriesProject.masterConcepts || []);
  const allAlerts = [...liveDuplications, ...liveGaps];

  // Operations: Adapt, Duplicate, Archive
  const handleAdaptBoard = (projectId: string) => {
    const baseProj = bookProjectsMap[projectId];
    if (!baseProj) return;

    const nextBoard =
      baseProj.board === 'CBSE' ? 'CISCE' : baseProj.board === 'CISCE' ? 'Cambridge' : 'CBSE';
    const nextStage =
      nextBoard === 'Cambridge'
        ? baseProj.classOrStage.includes('6')
          ? 'Stage 7'
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

    const updatedMap = {
      ...bookProjectsMap,
      [newId]: adaptedProject,
    };

    onUpdateSeriesProject({
      ...seriesProject,
      bookProjects: updatedMap,
      activeBookProjectId: newId,
      lastUpdated: new Date().toISOString(),
    });

    setSelectedProjectForDetail(adaptedProject);
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

    const updatedMap = {
      ...bookProjectsMap,
      [newId]: duplicatedProject,
    };

    onUpdateSeriesProject({
      ...seriesProject,
      bookProjects: updatedMap,
      activeBookProjectId: newId,
      lastUpdated: new Date().toISOString(),
    });

    setSelectedProjectForDetail(duplicatedProject);
  };

  const handleArchiveProject = (projectId: string) => {
    const baseProj = bookProjectsMap[projectId];
    if (!baseProj) return;

    const isArchived = !!baseProj.isArchived;
    const updatedProject: BookProject = {
      ...baseProj,
      isArchived: !isArchived,
      lastEdited: new Date().toISOString(),
    };

    handleSaveBookProject(updatedProject);
    if (selectedProjectForDetail?.id === projectId) {
      setSelectedProjectForDetail(updatedProject);
    }
  };

  // Filtering projects
  const filteredProjects = bookProjectsList.filter((proj) => {
    if (selectedBoardFilter !== 'ALL' && proj.board !== selectedBoardFilter) return false;
    if (selectedStatusFilter !== 'ALL' && proj.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        proj.bookTitle.toLowerCase().includes(q) ||
        proj.subtitle.toLowerCase().includes(q) ||
        proj.classOrStage.toLowerCase().includes(q) ||
        proj.board.toLowerCase().includes(q) ||
        proj.internalProjectCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Actions for updating Book Projects
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

  const handleSelectActiveProject = (projectId: string) => {
    const proj = bookProjectsMap[projectId];
    if (proj) {
      onUpdateSeriesProject({
        ...seriesProject,
        activeBookProjectId: projectId,
        selectedClass: proj.classLevel,
      });
    }
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

  // Chapter updates propagate to book & seriesProject
  const handleUpdateBookTopics = (classLevel: GrammarClassLevel, updatedTopics: GrammarTopic[]) => {
    const targetBook = seriesProject.books[classLevel];
    if (!targetBook) return;

    const updatedBook = {
      ...targetBook,
      topics: updatedTopics,
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [classLevel]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  // Dynamically computed progression tab label based on board/programme
  const progressionTabLabel =
    selectedBoardFilter === 'Cambridge' || (selectedBoardFilter === 'ALL' && activeBookProject?.board === 'Cambridge')
      ? 'Series Progression (Stages 1–11)'
      : 'Series Progression (Classes 1–12)';

  if (selectedProjectForDetail) {
    const detailBook = seriesProject.books[selectedProjectForDetail.classLevel];
    return (
      <div
        id="book-project-detail-root"
        className="w-full min-h-full flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]"
      >
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
          <BookProjectDetailView
            project={selectedProjectForDetail}
            seriesProject={seriesProject}
            book={detailBook}
            masterConcepts={seriesProject.masterConcepts}
            curriculumMatrix={seriesProject.curriculumMatrix}
            allProjects={bookProjectsList}
            onSelectProject={(projId) => {
              const p = bookProjectsMap[projId];
              if (p) setSelectedProjectForDetail(p);
            }}
            onBackToDashboard={() => setSelectedProjectForDetail(null)}
            onUpdateProject={(updated) => {
              handleSaveBookProject(updated);
              setSelectedProjectForDetail(updated);
            }}
            onOpenChapterStudio={(chapId) => {
              handleSelectActiveProject(selectedProjectForDetail.id);
              if (onOpenChapterStudio) onOpenChapterStudio(chapId);
            }}
            onOpenBookPlanner={(projId) => {
              handleSelectActiveProject(projId || selectedProjectForDetail.id);
              if (onOpenBookPlanner) onOpenBookPlanner(projId || selectedProjectForDetail.id);
            }}
            onOpenTextbookPreview={(cls) => {
              handleSelectActiveProject(selectedProjectForDetail.id);
              if (onOpenTextbookPreview) onOpenTextbookPreview(cls || selectedProjectForDetail.classLevel);
            }}
            onOpenLayoutExport={(cls) => {
              handleSelectActiveProject(selectedProjectForDetail.id);
              if (onOpenLayoutExport) onOpenLayoutExport(cls || selectedProjectForDetail.classLevel);
            }}
            onOpenPublisherSubmission={() => {
              handleSelectActiveProject(selectedProjectForDetail.id);
              if (onOpenPublisherSubmission) onOpenPublisherSubmission();
            }}
            onOpenCurriculumMapping={onOpenCurriculumMapping}
            onAdaptBoard={(projId) => handleAdaptBoard(projId)}
            onDuplicateEdition={(projId) => handleDuplicateEdition(projId)}
            onArchiveProject={(projId) => handleArchiveProject(projId)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      id="series-publishing-dashboard-root"
      className="w-full min-h-full flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]"
    >
      <div id="series-publishing-dashboard" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
              <Globe2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Multi-Board Series Management &amp; Publishing Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7]">
              Academic Publishing Studio
            </h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] max-w-3xl">
              Professional publishing-series workspace governing full textbook volumes across
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> CBSE</span>,
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> CISCE (ICSE)</span>, and
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> Cambridge International</span>.
            </p>
          </div>

          {/* Global Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenPublisherSubmission && (
              <button
                id="btn-publisher-submission"
                onClick={onOpenPublisherSubmission}
                className="flex items-center space-x-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[13.5px] font-semibold transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 text-[#C29A52]" />
                <span>Publisher Submission</span>
              </button>
            )}

            <button
              id="btn-open-curriculum-mapping"
              onClick={onOpenCurriculumMapping}
              className="flex items-center space-x-2 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[13.5px] font-semibold text-[#292521] dark:text-[#F6F0E7] transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Curriculum Mapping</span>
            </button>

            <button
              id="btn-open-spiral-matrix"
              onClick={onOpenScopeSequence}
              className="flex items-center space-x-2 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[13.5px] font-semibold text-[#292521] dark:text-[#F6F0E7] transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
              <span>Scope &amp; Sequence</span>
            </button>

            <button
              id="btn-create-new-book-project"
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center space-x-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#C29A52] hover:bg-[#A8813C] text-slate-950 text-[13.5px] font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Book Project</span>
            </button>
          </div>
        </div>

        {/* 2. Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Active Book Projects</div>
            <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-1">
              {bookProjectsList.length} Volumes
            </div>
            <div className="text-[11px] text-[#9A7438] dark:text-[#C29A52] mt-0.5 font-medium">CBSE • CISCE • CAIE</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Active Volume</div>
            <div className="text-xl font-bold font-serif text-[#5A1832] dark:text-[#C29A52] mt-1 truncate" title={activeBookProject?.bookTitle}>
              {activeBookProject?.classOrStage || 'Class 6'}
            </div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5 truncate">{activeBookProject?.board}</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Readiness Score</div>
            <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-1">
              {activeBookProject?.readiness?.overallScore || 76}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">Prepress Readiness</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Sequenced Units</div>
            <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-1">
              {activeBook?.topics.length || 0} Chapters
            </div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
              ~{activeBookProject?.targetPageCount || 192} Target Pgs
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Production Milestones</div>
            <div className="text-xl font-bold font-mono text-[#5A1832] dark:text-[#C29A52] mt-1">
              {activeBookProject?.milestones?.filter((m) => m.status === 'completed').length || 7}/13
            </div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Stages Verified</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Audited Findings</div>
            <div className="text-xl font-bold font-mono text-[#9A7438] dark:text-[#C29A52] mt-1">
              {activeBookProject?.auditIssues?.length || 4} Issues
            </div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Editorial Checks</div>
          </div>
        </div>

        {/* 3. Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xs">
          {[
            { id: 'projects', label: 'Book Projects Grid', icon: BookOpen },
            { id: 'roadmap', label: '12-Level Series Roadmap', icon: Milestone },
            { id: 'completeness', label: 'Readiness & Completeness', icon: BarChart3 },
            { id: 'chapters', label: 'Chapter Manager', icon: Layers },
            { id: 'audit', label: 'Whole-Book Audit', icon: ShieldCheck },
            { id: 'progression', label: progressionTabLabel, icon: GitBranch },
            { id: 'milestones', label: 'Production Milestones', icon: Clock },
            { id: 'rights', label: 'Rights & Editions', icon: Award },
            { id: 'systems', label: 'Curriculum Systems', icon: Globe2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SeriesDashboardSubTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs font-bold'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C29A52]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Active Volume Switcher Ribbon (shown on sub-tabs other than 'projects' & 'systems') */}
        {activeSubTab !== 'projects' && activeSubTab !== 'systems' && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52] font-serif">
                Active Book Volume:
              </span>
              <select
                value={activeProjectId}
                onChange={(e) => handleSelectActiveProject(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#121b2d] font-bold text-[#35101F] dark:text-[#F6F0E7]"
              >
                {bookProjectsList.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.bookTitle} ({bp.board} {bp.classOrStage})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] font-mono text-[11px] font-semibold text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                {activeBookProject.status}
              </span>
              <button
                onClick={() => setEditingProject(activeBookProject)}
                className="text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline"
              >
                Edit Metadata
              </button>
            </div>
          </div>
        )}

        {/* 5. TAB 1: BOOK PROJECTS GRID */}
        {activeSubTab === 'projects' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6]">Board:</span>
                <div className="flex items-center rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] p-0.5 bg-[#EDE4D6] dark:bg-[#1e0f18] text-xs">
                  {['ALL', 'CBSE', 'CISCE', 'Cambridge'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBoardFilter(b)}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        selectedBoardFilter === b
                          ? 'bg-[#5A1832] text-white'
                          : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] ml-2">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#121b2d] text-[#292521] dark:text-[#F6F0E7]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Manuscript Planning">Manuscript Planning</option>
                  <option value="Chapter Authoring">Chapter Authoring</option>
                  <option value="Academic Review">Academic Review</option>
                  <option value="Board Alignment Review">Board Alignment Review</option>
                  <option value="Copyediting">Copyediting</option>
                  <option value="Layout & Typesetting">Layout & Typesetting</option>
                  <option value="Prepress & Proofing">Prepress & Proofing</option>
                  <option value="Publisher Submission">Publisher Submission</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71685E] dark:text-[#c9b9a6]" />
                <input
                  type="text"
                  placeholder="Search books, codes, stages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 pr-3 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#121b2d] text-xs text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#c9b9a6] focus:outline-hidden focus:border-[#5A1832] w-64"
                />
              </div>
            </div>

            {/* Book Projects Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const book = seriesProject.books[project.classLevel];
                return (
                  <BookProjectCard
                    key={project.id}
                    project={project}
                    book={book}
                    onOpen={(projId) => {
                      handleSelectActiveProject(projId);
                      const p = bookProjectsMap[projId];
                      if (p) setSelectedProjectForDetail(p);
                    }}
                    onOpenChapterStudio={() => {
                      handleSelectActiveProject(project.id);
                      if (onOpenChapterStudio) onOpenChapterStudio();
                    }}
                    onOpenBookPlanner={() => {
                      handleSelectActiveProject(project.id);
                      if (onOpenBookPlanner) onOpenBookPlanner(project.id);
                    }}
                    onOpenTextbookPreview={() => {
                      handleSelectActiveProject(project.id);
                      if (onOpenTextbookPreview) onOpenTextbookPreview(project.classLevel);
                    }}
                    onOpenLayoutExport={() => {
                      handleSelectActiveProject(project.id);
                      if (onOpenLayoutExport) onOpenLayoutExport(project.classLevel);
                    }}
                    onOpenCompleteness={() => {
                      handleSelectActiveProject(project.id);
                      setActiveSubTab('completeness');
                    }}
                    onEditMetadata={() => setEditingProject(project)}
                    onManageChapters={() => {
                      handleSelectActiveProject(project.id);
                      setActiveSubTab('chapters');
                    }}
                    onRunAudit={() => {
                      handleSelectActiveProject(project.id);
                      setActiveSubTab('audit');
                    }}
                    onAdaptBoard={(projId) => handleAdaptBoard(projId)}
                    onDuplicate={(projId) => handleDuplicateEdition(projId)}
                    onArchive={(projId) => handleArchiveProject(projId)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 5B. TAB: 12-LEVEL SERIES ROADMAP */}
        {activeSubTab === 'roadmap' && (
          <SeriesRoadmapView
            seriesProject={seriesProject}
            activeBookProject={activeBookProject}
            allBookProjects={bookProjectsList}
            onSelectProject={handleSelectActiveProject}
            onOpenBookPlanner={onOpenBookPlanner}
            onOpenChapterStudio={onOpenChapterStudio}
            onOpenCurriculumMapping={onOpenCurriculumMapping}
            onOpenScopeSequence={onOpenScopeSequence}
          />
        )}

        {/* 6. TAB 2: BOOK COMPLETENESS ENGINE */}
        {activeSubTab === 'completeness' && (
          <BookCompletenessView
            project={activeBookProject}
            book={activeBook}
            masterConcepts={seriesProject.masterConcepts}
            curriculumMatrix={seriesProject.curriculumMatrix}
            onUpdateProjectReadiness={(report) => {
              handleSaveBookProject({
                ...activeBookProject,
                readiness: report,
              });
            }}
            onNavigateToTab={(tab) => {
              if (tab === 'chapter_studio' && onOpenChapterStudio) onOpenChapterStudio();
              else if (tab === 'textbook_exporter' && onOpenLayoutExport) onOpenLayoutExport(activeBookProject.classLevel);
              else if (tab === 'curriculum_mapping') onOpenCurriculumMapping();
            }}
          />
        )}

        {/* 7. TAB 3: CHAPTER MANAGER */}
        {activeSubTab === 'chapters' && (
          <ChapterManagerView
            project={activeBookProject}
            book={activeBook}
            onUpdateBookTopics={handleUpdateBookTopics}
            onOpenChapterInStudio={(chapId) => {
              if (onOpenChapterStudio) onOpenChapterStudio(chapId);
            }}
          />
        )}

        {/* 8. TAB 4: WHOLE-BOOK AUDIT */}
        {activeSubTab === 'audit' && (
          <BookWideAuditView
            project={activeBookProject}
            book={activeBook}
            masterConcepts={seriesProject.masterConcepts}
            onOpenChapter={(chapId) => {
              if (onOpenChapterStudio) onOpenChapterStudio(chapId);
            }}
            onUpdateProjectAuditIssues={(issues) => {
              handleSaveBookProject({
                ...activeBookProject,
                auditIssues: issues,
              });
            }}
          />
        )}

        {/* 9. TAB 5: SERIES-WIDE PROGRESSION AUDIT */}
        {activeSubTab === 'progression' && (
          <SeriesProgressionAuditView
            seriesProject={seriesProject}
            onNavigateToCurriculumMapping={onOpenCurriculumMapping}
          />
        )}

        {/* 10. TAB 6: PRODUCTION MILESTONES */}
        {activeSubTab === 'milestones' && (
          <ProductionMilestonesView
            project={activeBookProject}
            onUpdateMilestones={(milestones) => {
              handleSaveBookProject({
                ...activeBookProject,
                milestones,
              });
            }}
          />
        )}

        {/* 11. TAB 7: RIGHTS & EDITIONS REGISTRY */}
        {activeSubTab === 'rights' && (
          <RightsAndEditionsView
            project={activeBookProject}
            onUpdateRightsAndEditions={(records) => {
              handleSaveBookProject({
                ...activeBookProject,
                rightsAndEditions: records,
              });
            }}
          />
        )}

        {/* 12. TAB 8: CURRICULUM SYSTEMS (EXISTING BOARD PILLARS) */}
        {activeSubTab === 'systems' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CURRICULUM_SYSTEMS.map((system) => {
                const systemEditions = Object.values(editionsMap).filter((e) => e.systemId === system.id);
                return (
                  <div
                    key={system.id}
                    className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] flex flex-col justify-between shadow-2xs hover:border-[#9A7438] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-[#EDE4D6] text-[#5A1832] dark:bg-[#35101F] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                          {system.shortName}
                        </span>
                        <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                          {systemEditions.length} Editions
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                        {system.name}
                      </h3>
                      <p className="text-[13.5px] text-[#71685E] dark:text-[#c9b9a6] leading-relaxed line-clamp-3">
                        {system.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedBoardFilter(system.id);
                          setActiveSubTab('projects');
                        }}
                        className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center space-x-1"
                      >
                        <span>Filter {system.shortName} Books</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail & Metadata Edit Modal */}
        {editingProject && (
          <BookProjectDetailModal
            project={editingProject}
            isOpen={Boolean(editingProject)}
            onClose={() => setEditingProject(null)}
            onSave={(updated) => {
              handleSaveBookProject(updated);
              setEditingProject(null);
            }}
          />
        )}

        {/* Create New Book Project Modal with Truth Layer */}
        {showNewProjectModal && (
          <CreateNewBookProjectModal
            seriesTitle={seriesProject.seriesTitle}
            isOpen={showNewProjectModal}
            onClose={() => setShowNewProjectModal(false)}
            onCreate={(newProj) => handleCreateNewProject(newProj)}
          />
        )}
      </div>
    </div>
  );
};
