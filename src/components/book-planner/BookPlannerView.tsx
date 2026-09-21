import React, { useState, useMemo } from 'react';
import {
  BookMarked,
  BookOpen,
  Layers,
  ListTree,
  FileSpreadsheet,
  CheckSquare,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  Eye,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Tag,
  Clock,
  Award,
  BarChart2,
  FolderPlus,
  ArrowRight,
  Info,
  Calendar,
  Hash,
  Move,
  Printer,
  ChevronUp,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  BookProject,
  ClassCurriculumBook,
  GrammarTopic,
  BookUnit,
  StudioChapter,
  GrammarClassLevel,
  ChapterWorkflowStatus,
} from '../../types';
import {
  ensureBookUnitsAndMetadata,
  getBookMetrics,
  getChapterWordCount,
  getChapterExerciseCount,
  getChapterQuestionCount,
  getChapterVisualCount,
  getChapterCompletionPercentage,
  getChapterProductionStatus,
  getChapterAnswerKeyStatus,
  duplicateChapterStructure,
} from '../../utils/bookProductionUtils';
import {
  createDefaultCbseClass6SubjectVerbAgreementChapter,
  convertTopicToStudioChapter,
} from '../../utils/chapterStudioData';
import { calculateBookReadiness, getInitialBookProjects } from '../../utils/bookProjectUtils';
import { validateISBN } from '../../utils/isbnUtils';
import { BookArchitectureWorkspace } from './architecture/BookArchitectureWorkspace';
import { BookArchitectureConfig } from './architecture/types';
import {
  createChapterFromArchitecture,
  resolveActiveBookArchitecture,
} from '../chapter-studio/architecture/chapterArchitectureBridge';
import { CurriculumCoverageDashboard } from './CurriculumCoverageDashboard';
import { PublishingBreadcrumbs } from '../series/PublishingBreadcrumbs';
import { ScopeSequenceSyncModal } from './ScopeSequenceSyncModal';
import { resolveActiveBookContext, switchActiveBookProject } from '../../utils/activeBookContext';

export type BookPlannerTab =
  | 'toc'
  | 'overview'
  | 'curriculum'
  | 'page_budget'
  | 'assessment_plan'
  | 'audit';

interface BookPlannerViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onOpenChapterStudio: (topicId?: string) => void;
  onOpenLayoutExport?: (classLevel?: string) => void;
  onOpenTextbookPreview?: (classLevel?: string) => void;
  onOpenQuestionBank?: () => void;
  onOpenCurriculumMapping?: () => void;
  onOpenScopeSequence?: () => void;
  onOpenSeriesDashboard?: () => void;
  onOpenBookProjects?: () => void;
  isDarkMode: boolean;
  initialTab?: BookPlannerTab;
}

export const BookPlannerView: React.FC<BookPlannerViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onOpenChapterStudio,
  onOpenLayoutExport,
  onOpenTextbookPreview,
  onOpenQuestionBank,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenSeriesDashboard,
  onOpenBookProjects,
  isDarkMode,
  initialTab = 'toc',
}) => {
  const [activeTab, setActiveTab] = useState<BookPlannerTab>(initialTab);

  // Authoritative active book context resolution
  const resolvedBookContext = useMemo(() => {
    return resolveActiveBookContext(seriesProject);
  }, [seriesProject]);

  const bookProjectsRecord: Record<string, BookProject> = resolvedBookContext.allProjectsRecord;
  const allProjects = resolvedBookContext.allProjects;
  const activeProjectId = resolvedBookContext.activeProjectId;
  const activeProject: BookProject = resolvedBookContext.activeProject;

  const selectedClassLevel: GrammarClassLevel = activeProject.classLevel || seriesProject.selectedClass || 'Class 6';

  // Get raw book, prioritizing editionBooks[activeProjectId] for authentic multi-board isolation
  const rawBook: ClassCurriculumBook = useMemo(() => {
    if (seriesProject.editionBooks && seriesProject.editionBooks[activeProjectId]) {
      return seriesProject.editionBooks[activeProjectId];
    }
    return seriesProject.books[selectedClassLevel] || Object.values(seriesProject.books)[0] || {
      classLevel: selectedClassLevel,
      title: activeProject.bookTitle,
      ageBracket: activeProject.targetAge,
      description: activeProject.notes,
      topics: [],
    };
  }, [seriesProject.editionBooks, seriesProject.books, activeProjectId, selectedClassLevel, activeProject]);

  const currentBook: ClassCurriculumBook = useMemo(() => {
    return ensureBookUnitsAndMetadata(rawBook, seriesProject.seriesTitle, (activeProject.board as string) || 'CBSE');
  }, [rawBook, seriesProject.seriesTitle, activeProject.board]);

  const metrics = useMemo(() => getBookMetrics(currentBook), [currentBook]);
  const topics = currentBook.topics || [];
  const units = currentBook.units || [];

  // Local UI state for TOC
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'cbse-6-sva': true, // Expand default SVA chapter initially for instant visibility
  });

  // Modal / Inline Edit States
  const [showScopeSyncModal, setShowScopeSyncModal] = useState(false);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [targetUnitForNewChapter, setTargetUnitForNewChapter] = useState<string>(units[0]?.id || '');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterCategory, setNewChapterCategory] = useState('Core Syntax');

  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editUnitTitle, setEditUnitTitle] = useState('');
  const [editUnitDesc, setEditUnitDesc] = useState('');

  // Switch Active Project with atomic multi-board context update
  const handleSelectProject = (projectId: string) => {
    const updated = switchActiveBookProject(seriesProject, projectId, bookProjectsRecord);
    onUpdateSeriesProject(updated);
  };

  // Update current book in seriesProject with strict board isolation
  const handleUpdateCurrentBook = (updatedBook: ClassCurriculumBook) => {
    const isCbse = (activeProject.board || 'CBSE').toUpperCase().includes('CBSE');
    const updated: GrammarSeriesProject = {
      ...seriesProject,
      editionBooks: {
        ...(seriesProject.editionBooks || {}),
        [activeProjectId]: updatedBook,
      },
      books: isCbse
        ? {
            ...seriesProject.books,
            [selectedClassLevel]: updatedBook,
          }
        : seriesProject.books,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateSeriesProject(updated);
  };

  // Update book architecture for active project
  const handleUpdateProjectArchitecture = (updatedArch: BookArchitectureConfig) => {
    const currentProj = bookProjectsRecord[activeProjectId] || activeProject;
    const updatedProj: BookProject = {
      ...currentProj,
      architecture: updatedArch,
      lastEdited: new Date().toISOString(),
    };
    const updatedBookProjects = {
      ...bookProjectsRecord,
      [activeProjectId]: updatedProj,
    };
    const updatedSeries: GrammarSeriesProject = {
      ...seriesProject,
      bookProjects: updatedBookProjects,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateSeriesProject(updatedSeries);
  };

  // Toggle unit collapse
  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Expand / Collapse all
  const handleToggleExpandAll = () => {
    const allCollapsed = units.every((u) => collapsedUnits[u.id]);
    const newState: Record<string, boolean> = {};
    units.forEach((u) => {
      newState[u.id] = !allCollapsed;
    });
    setCollapsedUnits(newState);
  };

  // Toggle chapter expansion (sections view)
  const toggleChapterExpand = (topicId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Helper to resolve StudioChapter for any topic
  const resolveStudioChapter = (topic: GrammarTopic): StudioChapter => {
    if (topic.studioChapter) return topic.studioChapter;
    return convertTopicToStudioChapter(topic, selectedClassLevel, (activeProject.board as any) || 'CBSE');
  };

  // Reorder Units
  const handleMoveUnit = (unitIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? unitIndex - 1 : unitIndex + 1;
    if (newIndex < 0 || newIndex >= units.length) return;
    const updatedUnits = [...units];
    const temp = updatedUnits[unitIndex];
    updatedUnits[unitIndex] = updatedUnits[newIndex];
    updatedUnits[newIndex] = temp;
    // Update order numbers
    updatedUnits.forEach((u, i) => {
      u.order = i + 1;
      u.unitNumber = i + 1;
    });
    handleUpdateCurrentBook({ ...currentBook, units: updatedUnits });
  };

  // Add New Unit
  const handleCreateUnit = () => {
    if (!newUnitTitle.trim()) return;
    const newUnit: BookUnit = {
      id: `unit-${Date.now()}`,
      unitNumber: units.length + 1,
      title: newUnitTitle.trim(),
      description: newUnitDesc.trim() || 'Unit pedagogical focus and learning outcomes.',
      chapterIds: [],
      order: units.length + 1,
      isArchived: false,
    };
    handleUpdateCurrentBook({
      ...currentBook,
      units: [...units, newUnit],
    });
    setNewUnitTitle('');
    setNewUnitDesc('');
    setIsAddingUnit(false);
  };

  // Save Unit Edits
  const handleSaveUnitEdit = (unitId: string) => {
    const updatedUnits = units.map((u) => {
      if (u.id !== unitId) return u;
      return {
        ...u,
        title: editUnitTitle.trim() || u.title,
        description: editUnitDesc.trim() || u.description,
      };
    });
    handleUpdateCurrentBook({ ...currentBook, units: updatedUnits });
    setEditingUnitId(null);
  };

  // Add Chapter to specific unit
  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newTopicId = `top-${selectedClassLevel.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Resolve active book architecture and create blueprint studio chapter
    const arch = resolveActiveBookArchitecture(seriesProject);
    const initialStudioChapter = createChapterFromArchitecture(
      arch,
      newTopicId,
      newChapterTitle.trim(),
      topics.length + 1,
      selectedClassLevel,
      (activeProject?.board as any) || 'CBSE'
    );

    const generatedExercises = initialStudioChapter.exercises?.map((se) => ({
      id: se.id,
      title: `Exercise ${se.letter}: ${se.title}`,
      instructions: se.instructions,
      targetType: 'mixed' as const,
      maxMarks: se.suggestedMarks,
      questions: se.questions || [],
    })) || [
      {
        id: `ex-${Date.now()}`,
        title: 'Exercise A: Diagnostic Practice',
        instructions: 'Read the instructions carefully and select the correct answer.',
        targetType: 'mixed' as const,
        maxMarks: 5,
        questions: [],
      },
    ];

    const newTopic: GrammarTopic = {
      id: newTopicId,
      title: newChapterTitle.trim(),
      category: newChapterCategory,
      classLevel: selectedClassLevel,
      overview: `Introduction and pedagogical rules for ${newChapterTitle.trim()}.`,
      learningObjectives: initialStudioChapter.opening.learningObjectives || [
        `Understand the fundamental principles of ${newChapterTitle.trim()}`,
        'Apply rules accurately in sentence formation and board questions',
      ],
      definitions: [
        {
          id: `def-${Date.now()}`,
          term: newChapterTitle.trim(),
          ageAppropriateExplanation: `Comprehensive explanation of ${newChapterTitle.trim()}.`,
          rules: ['Rule 1: Standard grammatical convention must be strictly observed.'],
          examples: [
            {
              sentence: 'The student observed the syntactic rule accurately.',
              highlightWord: 'accurately',
              note: 'Standard declarative application.',
            },
          ],
        },
      ],
      notesAndTheoryMarkdown: `# ${newChapterTitle.trim()}\n\nDetailed theoretical guidelines and examples conforming to the standard 23-component book architecture.`,
      exercises: generatedExercises,
      testSeries: [],
      studioChapter: initialStudioChapter,
    };

    // Append to target unit
    const targetUnitId = targetUnitForNewChapter || units[0]?.id;
    const updatedUnits = units.map((u) => {
      if (u.id === targetUnitId) {
        return {
          ...u,
          chapterIds: [...u.chapterIds, newTopicId],
        };
      }
      return u;
    });

    handleUpdateCurrentBook({
      ...currentBook,
      topics: [...topics, newTopic],
      units: updatedUnits,
    });

    setNewChapterTitle('');
    setIsAddingChapter(false);
  };

  // Move Chapter inside Unit or between topics
  const handleMoveChapter = (unitId: string, chapterIndex: number, direction: 'up' | 'down') => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;
    const newIndex = direction === 'up' ? chapterIndex - 1 : chapterIndex + 1;
    if (newIndex < 0 || newIndex >= unit.chapterIds.length) return;

    const newChapterIds = [...unit.chapterIds];
    const temp = newChapterIds[chapterIndex];
    newChapterIds[chapterIndex] = newChapterIds[newIndex];
    newChapterIds[newIndex] = temp;

    const updatedUnits = units.map((u) => (u.id === unitId ? { ...u, chapterIds: newChapterIds } : u));
    handleUpdateCurrentBook({ ...currentBook, units: updatedUnits });
  };

  // Duplicate Chapter
  const handleDuplicateChapter = (topic: GrammarTopic, unitId: string) => {
    const newNum = topics.length + 1;
    const duplicated = duplicateChapterStructure(topic, newNum, `${topic.title} (Copy)`);

    const updatedUnits = units.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          chapterIds: [...u.chapterIds, duplicated.id],
        };
      }
      return u;
    });

    handleUpdateCurrentBook({
      ...currentBook,
      topics: [...topics, duplicated],
      units: updatedUnits,
    });
  };

  // Delete Chapter
  const handleDeleteChapter = (topicId: string, unitId: string) => {
    if (!confirm('Are you sure you want to remove this chapter from the book planner?')) return;
    const updatedTopics = topics.filter((t) => t.id !== topicId);
    const updatedUnits = units.map((u) => ({
      ...u,
      chapterIds: u.chapterIds.filter((id) => id !== topicId),
    }));
    handleUpdateCurrentBook({
      ...currentBook,
      topics: updatedTopics,
      units: updatedUnits,
    });
  };

  // Calculate Page Budget metrics with realistic Class 6 allocations
  const targetPages = activeProject.targetPageCount || 192;
  const frontMatterPages = 8;
  const unitOpenersPages = units.length * 1;
  const chapterInstructionPages = Math.max(topics.length * 3, Math.round(metrics.totalWords / 380));
  const exercisePages = Math.max(topics.length * 4, Math.round(metrics.totalQuestions * 0.35));
  const assessmentPages = units.length * 2 + (targetPages >= 160 ? 8 : 4);
  const visualAllowancePages = Math.ceil(topics.length * 0.75);
  const backMatterPages = 16;
  const totalAllocatedPages = frontMatterPages + unitOpenersPages + chapterInstructionPages + exercisePages + assessmentPages + visualAllowancePages + backMatterPages;
  const estimatedPages = frontMatterPages + unitOpenersPages + Math.round(metrics.totalWords / 380) + Math.round(metrics.totalQuestions * 0.35) + backMatterPages;
  const actualTypesetPages = topics.some((t) => !!t.studioChapter || t.id === 'cbse-6-sva')
    ? (frontMatterPages + 14)
    : 0;
  const remainingPages = targetPages - totalAllocatedPages;
  const pageVariance = totalAllocatedPages - targetPages;

  // Book readiness
  const readiness = useMemo(() => calculateBookReadiness(activeProject, currentBook), [activeProject, currentBook]);

  return (
    <div id="book-planner-workspace-root" className="w-full min-h-full flex-1 flex flex-col bg-[#EDE4D6] dark:bg-[#150a10] text-[#292521] dark:text-[#F6F0E7]">
      {/* 1. TOP HEADER & PROJECT SWITCHER */}
      <div className="border-b border-[#CBBEAC] dark:border-[#5A1832] bg-[#FDFBF7] dark:bg-[#1E1919] sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Project Title & Breadcrumb */}
            <div>
              <PublishingBreadcrumbs
                className="mb-2"
                items={[
                  { label: 'Academic Publishing', onClick: onOpenSeriesDashboard },
                  { label: seriesProject.seriesTitle || 'Grammar in Action: Complete K-12 English Series', onClick: onOpenSeriesDashboard },
                  { label: 'Book Projects', onClick: onOpenBookProjects },
                  { label: `${activeProject.board} • ${activeProject.classLevel}` },
                  { label: 'Book Planner', isCurrent: true },
                ]}
              />
              <div className="flex flex-wrap items-baseline gap-3 mt-1">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  {activeProject.bookTitle}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-bold border border-[#CBBEAC] dark:border-[#5A1832]">
                  {activeProject.board} &bull; {activeProject.classLevel}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold text-[11px]">
                  {activeProject.status || 'Authoring'}
                </span>
              </div>
              <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5 line-clamp-1">
                {activeProject.subtitle || 'Curriculum Scaffolding, Unit & Chapter Hierarchy, and Page Budgeting'}
              </p>
            </div>

            {/* Project Selector & Direct Navigation Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Project Dropdown Switcher */}
              <div className="relative">
                <label htmlFor="project-switcher" className="sr-only">
                  Switch Active Book Project
                </label>
                <select
                  id="project-switcher"
                  value={activeProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="appearance-none bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] focus:outline-hidden focus:ring-1 focus:ring-[#9A7438] cursor-pointer"
                >
                  {allProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      [{proj.board}] {proj.bookTitle} ({proj.classLevel})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Primary Action: Open in Chapter Studio */}
              <button
                onClick={() => onOpenChapterStudio(topics[0]?.id)}
                className="px-3.5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                title="Open active book in Chapter Studio"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Chapter Studio</span>
              </button>

              {/* Secondary Action: Layout & Export */}
              {onOpenLayoutExport && (
                <button
                  onClick={() => onOpenLayoutExport(selectedClassLevel)}
                  className="px-3 py-2 rounded-xl bg-[#FDFBF7] dark:bg-[#2A1822] hover:bg-[#EDE4D6] text-[#292521] dark:text-[#F6F0E7] text-xs font-semibold border border-[#CBBEAC] dark:border-[#5A1832] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Open in Layout & Export"
                >
                  <Layers className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                  <span>Layout &amp; Export</span>
                </button>
              )}

              {/* Tertiary Action: Preview */}
              {onOpenTextbookPreview && (
                <button
                  onClick={() => onOpenTextbookPreview(selectedClassLevel)}
                  className="px-3 py-2 rounded-xl bg-[#FDFBF7] dark:bg-[#2A1822] hover:bg-[#EDE4D6] text-[#292521] dark:text-[#F6F0E7] text-xs font-semibold border border-[#CBBEAC] dark:border-[#5A1832] flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Open Book Reader Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
                  <span>Reader Preview</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. TAB NAVIGATION STRIP */}
          <div className="flex items-center space-x-1 overflow-x-auto mt-4 pt-2 border-t border-[#CBBEAC]/50 dark:border-[#5A1832]/50 scrollbar-none">
            <button
              onClick={() => setActiveTab('toc')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'toc'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <ListTree className={`w-3.5 h-3.5 ${activeTab === 'toc' ? 'text-[#C29A52]' : ''}`} />
              <span>Table of Contents</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-[#F6F0E7]">
                {topics.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'text-[#C29A52]' : ''}`} />
              <span>Overview &amp; Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'curriculum'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <CheckSquare className={`w-3.5 h-3.5 ${activeTab === 'curriculum' ? 'text-[#C29A52]' : ''}`} />
              <span>Curriculum Coverage</span>
            </button>

            <button
              onClick={() => setActiveTab('page_budget')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'page_budget'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${activeTab === 'page_budget' ? 'text-[#C29A52]' : ''}`} />
              <span>Page Budget</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                  Math.abs(pageVariance) <= 8
                    ? 'bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                {totalAllocatedPages}/{targetPages}p
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assessment_plan')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'assessment_plan'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${activeTab === 'assessment_plan' ? 'text-[#C29A52]' : ''}`} />
              <span>Assessment Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'audit' ? 'text-[#C29A52]' : ''}`} />
              <span>Book Audit</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#9A7438]/20 text-[#9A7438] dark:text-[#C29A52] font-mono">
                {readiness.bookReadinessScore}%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* ========================================================================= */}
        {/* TAB 1: TABLE OF CONTENTS (DEFAULT) */}
        {/* ========================================================================= */}
        {activeTab === 'toc' && (
          <div className="space-y-6">
            {/* Filter & Action Toolbar */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#9A7438] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search chapters & sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] focus:outline-hidden"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-[#EDE4D6] dark:bg-[#35101F] text-xs font-medium py-1.5 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="planning">Planning</option>
                  <option value="writing">Writing</option>
                  <option value="academic_review">Academic Review</option>
                  <option value="ready_for_layout">Ready for Layout</option>
                  <option value="final">Final</option>
                </select>

                <button
                  onClick={handleToggleExpandAll}
                  className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors cursor-pointer"
                >
                  Expand / Collapse All
                </button>
              </div>

              {/* Action Buttons: Sync Scope & Sequence, Add Unit, Add Chapter */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-sync-scope-sequence"
                  onClick={() => setShowScopeSyncModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] hover:bg-[#e2d5c2] dark:hover:bg-[#431225] border border-[#9A7438]/60 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Synchronize curriculum requirements into structured chapters"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                  <span>Sync from Scope &amp; Sequence</span>
                </button>

                <button
                  onClick={() => setIsAddingUnit(true)}
                  className="px-3 py-1.5 rounded-xl border border-[#9A7438] text-[#5A1832] dark:text-[#C29A52] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Add Unit</span>
                </button>

                <button
                  onClick={() => {
                    setTargetUnitForNewChapter(units[0]?.id || '');
                    setIsAddingChapter(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Add Chapter</span>
                </button>
              </div>
            </div>

            {/* Modal: Add Unit */}
            {isAddingUnit && (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border-2 border-[#9A7438] shadow-md space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                  <h3 className="text-sm font-bold font-serif text-[#5A1832] dark:text-[#C29A52]">
                    Create New Book Unit / Module
                  </h3>
                  <button
                    onClick={() => setIsAddingUnit(false)}
                    className="text-xs text-[#71685E] hover:text-[#292521]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Unit Title (e.g. Unit 7: Practical Composition & Formal Letter Writing)"
                    value={newUnitTitle}
                    onChange={(e) => setNewUnitTitle(e.target.value)}
                    className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs px-3 py-2 rounded-xl border border-[#CBBEAC] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Unit Pedagogical Focus / Scope"
                    value={newUnitDesc}
                    onChange={(e) => setNewUnitDesc(e.target.value)}
                    className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs px-3 py-2 rounded-xl border border-[#CBBEAC] focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => setIsAddingUnit(false)}
                    className="px-3 py-1.5 text-xs text-[#71685E]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateUnit}
                    className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                  >
                    Create Unit
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Add Chapter */}
            {isAddingChapter && (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border-2 border-[#5A1832] shadow-md space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                  <h3 className="text-sm font-bold font-serif text-[#5A1832] dark:text-[#C29A52]">
                    Add Chapter to Book Hierarchy
                  </h3>
                  <button
                    onClick={() => setIsAddingChapter(false)}
                    className="text-xs text-[#71685E] hover:text-[#292521]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-[#71685E] uppercase block mb-1">
                      Target Unit
                    </label>
                    <select
                      value={targetUnitForNewChapter}
                      onChange={(e) => setTargetUnitForNewChapter(e.target.value)}
                      className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs p-2 rounded-xl border border-[#CBBEAC]"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          Unit {u.unitNumber}: {u.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#71685E] uppercase block mb-1">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Active and Passive Voice in Contemporary Usage"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs p-2 rounded-xl border border-[#CBBEAC]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#71685E] uppercase block mb-1">
                      Curriculum Strand / Category
                    </label>
                    <select
                      value={newChapterCategory}
                      onChange={(e) => setNewChapterCategory(e.target.value)}
                      className="w-full bg-[#EDE4D6] dark:bg-[#35101F] text-xs p-2 rounded-xl border border-[#CBBEAC]"
                    >
                      <option value="Core Syntax">Core Syntax &amp; Concord</option>
                      <option value="Verbs & Morphology">Verbs &amp; Morphology</option>
                      <option value="Nominal Structures">Word Classes &amp; Pronouns</option>
                      <option value="Clauses & Synthesis">Clauses &amp; Synthesis</option>
                      <option value="Vocabulary & Semantics">Vocabulary &amp; Semantics</option>
                      <option value="Applied Composition">Applied Composition</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={() => setIsAddingChapter(false)}
                    className="px-3 py-1.5 text-xs text-[#71685E]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateChapter}
                    className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                  >
                    Add Chapter to Planner
                  </button>
                </div>
              </div>
            )}

            {/* PRELIMINARY / FRONT MATTER SUMMARY PILL */}
            <div className="p-3.5 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/70 dark:border-[#5A1832] flex items-center justify-between text-xs font-serif">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] font-bold">
                  Preliminary Matter
                </span>
                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                  Half Title &bull; Title Page &bull; Copyright &bull; Preface &bull; Pedagogical Architecture &bull; Table of Contents
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#71685E]">Pages i–viii (~8 pp)</span>
            </div>

            {/* HIERARCHICAL UNITS & CHAPTERS LIST */}
            <div className="space-y-6">
              {units.map((unit, unitIdx) => {
                const isCollapsed = !!collapsedUnits[unit.id];
                const unitTopics = unit.chapterIds
                  .map((id) => topics.find((t) => t.id === id))
                  .filter(Boolean) as GrammarTopic[];

                // Filter topics if search query or status filter is active
                const visibleTopics = unitTopics.filter((t) => {
                  const matchesSearch =
                    !searchQuery ||
                    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesStatus =
                    selectedStatusFilter === 'all' ||
                    getChapterProductionStatus(t) === selectedStatusFilter;
                  return matchesSearch && matchesStatus;
                });

                if (unitTopics.length === 0 && unit.isArchived) return null;

                const isEditingThisUnit = editingUnitId === unit.id;

                return (
                  <div
                    key={unit.id}
                    className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden"
                  >
                    {/* UNIT HEADER */}
                    <div className="p-4 bg-[#EDE4D6] dark:bg-[#2b1622] border-b border-[#CBBEAC]/80 dark:border-[#5A1832] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleUnitCollapse(unit.id)}
                          className="p-1 rounded-lg hover:bg-black/5 text-[#5A1832] dark:text-[#C29A52] transition-colors cursor-pointer"
                          title="Toggle Unit Collapse"
                        >
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <div>
                          {isEditingThisUnit ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editUnitTitle}
                                onChange={(e) => setEditUnitTitle(e.target.value)}
                                className="bg-white dark:bg-[#1E1919] text-xs font-bold font-mono px-2 py-1 rounded border border-[#9A7438]"
                              />
                              <button
                                onClick={() => handleSaveUnitEdit(unit.id)}
                                className="px-2 py-1 rounded bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUnitId(null)}
                                className="text-xs text-[#71685E]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-baseline space-x-2">
                              <span className="font-mono text-xs font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                                Unit {unit.unitNumber}:
                              </span>
                              <h2 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                                {unit.title.replace(/^Unit\s+\d+:\s*/i, '')}
                              </h2>
                            </div>
                          )}
                          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5 line-clamp-1">
                            {unit.description || 'Pedagogical unit scope and curriculum boundaries.'}
                          </p>
                        </div>
                      </div>

                      {/* Unit Controls */}
                      <div className="flex items-center space-x-1 self-end sm:self-auto">
                        <span className="text-[11px] font-mono text-[#71685E] mr-2">
                          {unitTopics.length} {unitTopics.length === 1 ? 'Chapter' : 'Chapters'}
                        </span>

                        <button
                          onClick={() => handleMoveUnit(unitIdx, 'up')}
                          disabled={unitIdx === 0}
                          className="p-1 rounded hover:bg-black/5 disabled:opacity-30 text-[#71685E]"
                          title="Move Unit Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveUnit(unitIdx, 'down')}
                          disabled={unitIdx === units.length - 1}
                          className="p-1 rounded hover:bg-black/5 disabled:opacity-30 text-[#71685E]"
                          title="Move Unit Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingUnitId(unit.id);
                            setEditUnitTitle(unit.title);
                            setEditUnitDesc(unit.description || '');
                          }}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832]"
                          title="Edit Unit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setTargetUnitForNewChapter(unit.id);
                            setIsAddingChapter(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold flex items-center space-x-1 shadow-2xs hover:bg-[#431225] transition-colors ml-1"
                          title="Add Chapter to this Unit"
                        >
                          <Plus className="w-3 h-3 text-[#C29A52]" />
                          <span>Add Chapter</span>
                        </button>
                      </div>
                    </div>

                    {/* CHAPTERS IN THIS UNIT */}
                    {!isCollapsed && (
                      <div className="p-4 space-y-3">
                        {visibleTopics.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#71685E] italic border border-dashed border-[#CBBEAC] dark:border-[#5A1832] rounded-xl">
                            No chapters assigned to this unit yet. Click "Add Chapter" above to create one.
                          </div>
                        ) : (
                          visibleTopics.map((topic, cIdx) => {
                            const studio = resolveStudioChapter(topic);
                            const sections = studio.sections || [];
                            const isExpanded = !!expandedChapters[topic.id];
                            const words = getChapterWordCount(topic);
                            const estPages = Math.max(2, Math.round(words / 350));
                            const completion = getChapterCompletionPercentage(topic);
                            const status = getChapterProductionStatus(topic);
                            const exercisesCount = getChapterExerciseCount(topic);
                            const visualsCount = getChapterVisualCount(topic);
                            const ansKeyStatus = getChapterAnswerKeyStatus(topic);

                            return (
                              <div
                                key={topic.id}
                                className="rounded-xl bg-white dark:bg-[#251520] border border-[#CBBEAC]/70 dark:border-[#5A1832] p-4 transition-all hover:border-[#9A7438] space-y-3"
                              >
                                {/* Chapter Header Row */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                  <div className="flex items-start space-x-3">
                                    <button
                                      onClick={() => toggleChapterExpand(topic.id)}
                                      className="p-1 rounded hover:bg-black/5 text-[#5A1832] dark:text-[#C29A52] mt-0.5 cursor-pointer"
                                      title="Toggle Sections View"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4" />
                                      )}
                                    </button>

                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-mono text-xs font-bold text-[#9A7438] dark:text-[#C29A52]">
                                          Chapter {cIdx + 1}
                                        </span>
                                        <h3 className="text-sm font-bold font-serif text-[#292521] dark:text-[#F6F0E7]">
                                          {topic.title}
                                        </h3>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
                                          {topic.category}
                                        </span>
                                      </div>
                                      <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5 line-clamp-1">
                                        {topic.overview || 'Comprehensive chapter rules and practice drills.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right Chapter Metrics & Actions */}
                                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                                    {/* Metrics Badges */}
                                    <div className="flex items-center space-x-2 text-[11px] font-mono text-[#71685E] dark:text-[#D8CCBC] mr-2">
                                      <span title="Estimated Pages" className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                                        ~{estPages} pp
                                      </span>
                                      <span>&bull;</span>
                                      <span title="Word Count">{words.toLocaleString()} w</span>
                                      <span>&bull;</span>
                                      <span title="Sections Count">{sections.length} Sec</span>
                                      <span>&bull;</span>
                                      <span title="Exercises Count">{exercisesCount} Ex</span>
                                    </div>

                                    {/* Status Badge */}
                                    <span
                                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md ${
                                        status === 'ready_for_layout' || status === 'final'
                                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                                          : status === 'academic_review'
                                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                      }`}
                                    >
                                      {status.replace(/_/g, ' ')}
                                    </span>

                                    {/* Move Chapter Buttons */}
                                    <button
                                      onClick={() => handleMoveChapter(unit.id, cIdx, 'up')}
                                      disabled={cIdx === 0}
                                      className="p-1 rounded hover:bg-black/5 disabled:opacity-25 text-[#71685E]"
                                      title="Move Chapter Up"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveChapter(unit.id, cIdx, 'down')}
                                      disabled={cIdx === unitTopics.length - 1}
                                      className="p-1 rounded hover:bg-black/5 disabled:opacity-25 text-[#71685E]"
                                      title="Move Chapter Down"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Duplicate */}
                                    <button
                                      onClick={() => handleDuplicateChapter(topic, unit.id)}
                                      className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832]"
                                      title="Duplicate Chapter Structure"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                      onClick={() => handleDeleteChapter(topic.id, unit.id)}
                                      className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-rose-600"
                                      title="Remove Chapter"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* CRITICAL: Open in Chapter Studio Button */}
                                    <button
                                      onClick={() => onOpenChapterStudio(topic.id)}
                                      className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                                      title="Open in Chapter Authoring Studio"
                                    >
                                      <BookOpen className="w-3 h-3 text-[#C29A52]" />
                                      <span>Open in Studio</span>
                                    </button>
                                  </div>
                                </div>

                                {/* EXPANDED SECTIONS HIERARCHY */}
                                {isExpanded && (
                                  <div className="pl-6 pt-2 border-t border-[#CBBEAC]/40 dark:border-[#5A1832]/40 space-y-2">
                                    <div className="text-[11px] font-mono text-[#9A7438] dark:text-[#C29A52] font-semibold uppercase tracking-wider flex items-center justify-between">
                                      <span>Instructional Sections ({sections.length})</span>
                                      <span className="text-[10px] text-[#71685E] font-normal normal-case">
                                        Click any section to inspect in Studio
                                      </span>
                                    </div>

                                    {sections.length === 0 ? (
                                      <div className="text-xs text-[#71685E] italic py-1">
                                        No sections declared. Sections are synchronized directly from Chapter Studio.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {sections.map((sec) => {
                                          const blockTypes = (sec.blocks || []).map((b) => b.type);
                                          const hasRules = blockTypes.includes('grammar_rule') || blockTypes.includes('definition');
                                          const hasVisuals = blockTypes.includes('visual') || blockTypes.includes('diagram');
                                          const hasWorkedEx = blockTypes.includes('worked_example') || blockTypes.includes('example_set');

                                          return (
                                            <div
                                              key={sec.id}
                                              onClick={() => onOpenChapterStudio(topic.id)}
                                              className="group flex flex-col justify-between p-2.5 rounded-lg bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/50 dark:border-[#5A1832]/50 hover:border-[#5A1832] transition-colors cursor-pointer text-xs"
                                            >
                                              <div className="flex items-baseline justify-between gap-1">
                                                <div className="font-semibold text-[#292521] dark:text-[#F6F0E7] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] line-clamp-1">
                                                  <span className="font-mono text-[#9A7438] mr-1">
                                                    {sec.numberLabel || '•'}
                                                  </span>
                                                  {sec.title}
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-[#9A7438] opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                                              </div>

                                              {/* Block chips */}
                                              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-mono text-[#71685E]">
                                                <span>{sec.blocks?.length || 0} Blocks</span>
                                                {hasRules && (
                                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                                                    Rule
                                                  </span>
                                                )}
                                                {hasVisuals && (
                                                  <span className="px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300">
                                                    Diagram
                                                  </span>
                                                )}
                                                {hasWorkedEx && (
                                                  <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300">
                                                    Worked Ex
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {/* Exercises Strip */}
                                    {studio.exercises && studio.exercises.length > 0 && (
                                      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                                        <span className="text-[#9A7438] font-bold">Exercises:</span>
                                        {studio.exercises.map((ex) => (
                                          <span
                                            key={ex.id}
                                            className="px-2 py-0.5 rounded-md bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC]/50"
                                          >
                                            Ex {ex.letter}: {ex.title} ({ex.questionCount || ex.questions?.length || 0} Qs)
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* REFERENCE / BACK MATTER SUMMARY PILL */}
            <div className="p-3.5 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/70 dark:border-[#5A1832] flex items-center justify-between text-xs font-serif">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] font-bold">
                  Back Matter
                </span>
                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                  Comprehensive Glossary &bull; Irregular Verb Charts &bull; Complete Answer Key &bull; Concept Index &bull; Credits
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#71685E]">Pages 177–192 (~16 pp)</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OVERVIEW & ARCHITECTURE */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <BookArchitectureWorkspace
            project={activeProject}
            seriesProject={seriesProject}
            allProjects={allProjects}
            unitsCount={units.length}
            topicsCount={topics.length}
            onUpdateProjectArchitecture={handleUpdateProjectArchitecture}
            onOpenChapterStudio={onOpenChapterStudio}
            onOpenQuestionBank={onOpenQuestionBank}
            onOpenCurriculumMapping={onOpenCurriculumMapping}
            onOpenScopeSequence={onOpenScopeSequence}
            onOpenSeriesDashboard={onOpenSeriesDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CURRICULUM COVERAGE */}
        {/* ========================================================================= */}
        {activeTab === 'curriculum' && (
          <CurriculumCoverageDashboard
            book={activeProject}
            topics={topics}
            onOpenChapterStudio={onOpenChapterStudio}
            onOpenCurriculumMapping={onOpenCurriculumMapping}
            isDarkMode={isDarkMode}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PAGE BUDGET */}
        {/* ========================================================================= */}
        {activeTab === 'page_budget' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC]/60 pb-4">
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#9A7438] dark:text-[#C29A52] font-bold">
                    Typesetting &amp; Pagination Engine
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                    Page Budget Allocation &amp; Signature Integrity
                  </h2>
                  <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                    Target page planning to ensure exact standard signature multiples (16pp / 32pp).
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
                    {totalAllocatedPages} / {targetPages} pp
                  </span>
                  <span
                    className={`block text-[11px] font-mono font-semibold ${
                      Math.abs(pageVariance) <= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {pageVariance === 0
                      ? 'Perfect Signature Match'
                      : pageVariance > 0
                      ? `+${pageVariance} pp over budget`
                      : `${pageVariance} pp under budget`}
                  </span>
                </div>
              </div>

              {/* 5 Key Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60">
                  <div className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#D8CCBC]">1. Target Pages</div>
                  <div className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">{targetPages} pp</div>
                  <div className="text-[10px] text-[#71685E]">Commercial spec</div>
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60">
                  <div className="text-[10px] font-mono uppercase text-[#9A7438] dark:text-[#C29A52]">2. Allocated Pages</div>
                  <div className="text-lg font-serif font-bold text-[#5A1832] dark:text-[#C29A52] mt-0.5">{totalAllocatedPages} pp</div>
                  <div className="text-[10px] text-[#71685E]">Planned architecture</div>
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60">
                  <div className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#D8CCBC]">3. Estimated Pages</div>
                  <div className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">{estimatedPages} pp</div>
                  <div className="text-[10px] text-[#71685E]">Word count derived</div>
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60">
                  <div className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400">4. Actual Typeset</div>
                  <div className="text-lg font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{actualTypesetPages} pp</div>
                  <div className="text-[10px] text-[#71685E]">Completed in Studio</div>
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60">
                  <div className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#D8CCBC]">5. Remaining / Delta</div>
                  <div className={`text-lg font-serif font-bold mt-0.5 ${remainingPages >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {remainingPages >= 0 ? `${remainingPages} pp` : `${Math.abs(remainingPages)} pp`}
                  </div>
                  <div className="text-[10px] text-[#71685E]">{remainingPages >= 0 ? 'Available for content' : 'Over signature target'}</div>
                </div>
              </div>

              {/* Visual Budget Allocation Bar (7 Structural Categories) */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-[#71685E]">
                  <span>7-Category Structural Allocation</span>
                  <span>Signature multiple: {Math.round(totalAllocatedPages / 16)} × 16pp standard press run</span>
                </div>

                <div className="h-6 w-full rounded-xl bg-slate-200 dark:bg-slate-800 flex overflow-hidden border border-[#CBBEAC] shadow-inner">
                  <div
                    style={{ width: `${(frontMatterPages / targetPages) * 100}%` }}
                    className="bg-[#9A7438] hover:opacity-90 transition-opacity"
                    title={`1. Front Matter: ${frontMatterPages} pp`}
                  />
                  <div
                    style={{ width: `${(unitOpenersPages / targetPages) * 100}%` }}
                    className="bg-[#C29A52] hover:opacity-90 transition-opacity"
                    title={`2. Unit Openers: ${unitOpenersPages} pp`}
                  />
                  <div
                    style={{ width: `${(chapterInstructionPages / targetPages) * 100}%` }}
                    className="bg-[#5A1832] hover:opacity-90 transition-opacity"
                    title={`3. Chapter Instruction: ${chapterInstructionPages} pp`}
                  />
                  <div
                    style={{ width: `${(exercisePages / targetPages) * 100}%` }}
                    className="bg-[#832649] hover:opacity-90 transition-opacity"
                    title={`4. Exercises: ${exercisePages} pp`}
                  />
                  <div
                    style={{ width: `${(assessmentPages / targetPages) * 100}%` }}
                    className="bg-[#A43B63] hover:opacity-90 transition-opacity"
                    title={`5. Review & Assessments: ${assessmentPages} pp`}
                  />
                  <div
                    style={{ width: `${(visualAllowancePages / targetPages) * 100}%` }}
                    className="bg-[#B8860B] hover:opacity-90 transition-opacity"
                    title={`6. Visuals & Diagrams: ${visualAllowancePages} pp`}
                  />
                  <div
                    style={{ width: `${(backMatterPages / targetPages) * 100}%` }}
                    className="bg-[#431225] hover:opacity-90 transition-opacity"
                    title={`7. Back Matter: ${backMatterPages} pp`}
                  />
                </div>

                {/* Legend with All 7 Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#9A7438] shrink-0" />
                    <span>Front Matter ({frontMatterPages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#C29A52] shrink-0" />
                    <span>Unit Openers ({unitOpenersPages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#5A1832] shrink-0" />
                    <span>Chapter Theory ({chapterInstructionPages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#832649] shrink-0" />
                    <span>Exercises ({exercisePages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#A43B63] shrink-0" />
                    <span>Assessments ({assessmentPages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#B8860B] shrink-0" />
                    <span>Visuals &amp; Diagrams ({visualAllowancePages} pp)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#431225] shrink-0" />
                    <span>Back Matter ({backMatterPages} pp)</span>
                  </div>
                </div>
              </div>

              {/* Unit-by-Unit Page Allocation Table */}
              <div className="space-y-3 pt-4 border-t border-[#CBBEAC]/50">
                <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                  Unit &amp; Chapter Page Allotment
                </h3>

                <div className="rounded-xl border border-[#CBBEAC]/70 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Unit / Chapter</th>
                        <th className="p-3">Chapters Count</th>
                        <th className="p-3">Est. Words</th>
                        <th className="p-3 text-right">Target Pages</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CBBEAC]/40 dark:divide-[#5A1832]/40">
                      {units.map((unit) => {
                        const unitTopics = unit.chapterIds
                          .map((id) => topics.find((t) => t.id === id))
                          .filter(Boolean) as GrammarTopic[];
                        const unitWords = unitTopics.reduce((acc, t) => acc + getChapterWordCount(t), 0);
                        const unitPages = Math.max(unitTopics.length * 6, Math.round(unitWords / 350) + unitTopics.length * 4);

                        return (
                          <tr key={unit.id} className="hover:bg-[#EDE4D6]/30 dark:hover:bg-[#35101F]/30">
                            <td className="p-3 font-semibold text-[#292521] dark:text-[#F6F0E7]">
                              Unit {unit.unitNumber}: {unit.title.replace(/^Unit\s+\d+:\s*/i, '')}
                            </td>
                            <td className="p-3 font-mono">{unitTopics.length}</td>
                            <td className="p-3 font-mono">{unitWords.toLocaleString()} w</td>
                            <td className="p-3 text-right font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                              ~{unitPages} pp
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ASSESSMENT PLAN */}
        {/* ========================================================================= */}
        {activeTab === 'assessment_plan' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC]/60 pb-4">
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#9A7438] dark:text-[#C29A52] font-bold">
                    Pedagogical Evaluation System
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                    Assessment Architecture &amp; Taxonomy
                  </h2>
                  <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                    Formative checks, tiered differentiation (Foundation/Standard/Advanced), and Bloom's balance.
                  </p>
                </div>

                {onOpenQuestionBank && (
                  <button
                    onClick={onOpenQuestionBank}
                    className="px-3.5 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>Open Question Bank</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Assessment Types Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 space-y-2">
                  <div className="font-mono text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase">
                    1. Formative Checks
                  </div>
                  <p className="text-[#71685E] dark:text-[#D8CCBC]">
                    Embedded within instructional sections:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-[11px]">
                    <li>"Try This" instant rule drills</li>
                    <li>Spot-the-error contrast pairs</li>
                    <li>Guided sentence bracketings</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 space-y-2">
                  <div className="font-mono text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase">
                    2. Tiered End-of-Chapter Drills
                  </div>
                  <p className="text-[#71685E] dark:text-[#D8CCBC]">
                    Graded scaffolding per chapter:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-[11px]">
                    <li>Exercise A: Foundation (Recall &amp; Identify)</li>
                    <li>Exercise B: Standard (Apply &amp; Select)</li>
                    <li>Exercise C: Advanced (Synthesize &amp; Transform)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 space-y-2">
                  <div className="font-mono text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase">
                    3. Summative Unit Reviews
                  </div>
                  <p className="text-[#71685E] dark:text-[#D8CCBC]">
                    Board blueprint examination papers:
                  </p>
                  <ul className="space-y-1 list-disc pl-4 text-[11px]">
                    <li>Term-end diagnostic test series</li>
                    <li>Integrated passage editing</li>
                    <li>Official marking scheme compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BOOK AUDIT */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC]/60 pb-4">
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#9A7438] dark:text-[#C29A52] font-bold">
                    Quality &amp; Production Verification
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                    Book-Wide Structural Audit
                  </h2>
                  <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                    Automated pre-press inspection for complete chapters, exercises, visual assets, and answer keys.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
                    {readiness.bookReadinessScore}%
                  </span>
                  <span className="block text-[11px] font-mono text-[#71685E]">
                    Overall Readiness Score
                  </span>
                </div>
              </div>

              {/* Audit Checklist Items */}
              <div className="space-y-3">
                {/* 1. Chapter 1 Flagship */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                        Flagship Chapter: Subject–Verb Agreement
                      </span>
                      <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                        7 instructional sections authored, balance scale visual included, Bloom exercises and answer key fully populated.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenChapterStudio(topics[0]?.id)}
                    className="px-3 py-1 rounded bg-emerald-700 text-white font-semibold text-[11px] shrink-0"
                  >
                    Inspect in Studio
                  </button>
                </div>

                {/* 2. Answer Keys */}
                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                        Answer Key &amp; Explanations
                      </span>
                      <p className="text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                        {metrics.missingAnswersCount === 0
                          ? 'All active chapter questions include verified correct answers.'
                          : `${metrics.missingAnswersCount} chapter(s) have pending answer key verifications.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Visual Assets */}
                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#9A7438] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                        Visual Learning Diagrams &amp; Callouts
                      </span>
                      <p className="text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                        {metrics.totalVisuals} pedagogical illustrations &amp; syntactic diagrams rendered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Page Budget Balance */}
                <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/60 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                        Target Page Budget Signature Integrity
                      </span>
                      <p className="text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                        Allocated {totalAllocatedPages} pages vs target of {targetPages} pages (Variance: {pageVariance > 0 ? `+${pageVariance}` : pageVariance} pp).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scope & Sequence Synchronization Modal */}
      <ScopeSequenceSyncModal
        isOpen={showScopeSyncModal}
        onClose={() => setShowScopeSyncModal(false)}
        activeProject={activeProject}
        currentBook={currentBook}
        onApplySync={handleUpdateCurrentBook}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
