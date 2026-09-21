import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  GitFork,
  Printer,
  FileText,
  HelpCircle,
  Award,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Download,
  Search,
  BookMarked,
  SlidersHorizontal,
  BarChart3,
  Compass,
  FileSpreadsheet,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  FolderOpen,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarDefinition,
  GrammarExercise,
  GrammarQuestion,
  ClassCurriculumBook,
} from '../../types';
import { ensureBookUnitsAndMetadata } from '../../utils/bookProductionUtils';
import {
  resolveActiveBookContext,
  switchActiveBookProject,
  switchAcademicContext,
  getEditionIsolatedBookData,
  createBookProjectForStage,
  isBookProjectMatchingStage,
} from '../../utils/activeBookContext';
import { normalizeClassOrStage } from '../../utils/curriculumFrameworkData';
import { CURRICULUM_STAGES } from '../../utils/multiBoardData';
import { BookStructureManager } from '../book-production/BookStructureManager';
import { BookProductionDashboard } from '../book-production/BookProductionDashboard';
import { BookTableOfContents } from '../book-production/BookTableOfContents';
import { CurriculumCoverageMatrix } from '../book-production/CurriculumCoverageMatrix';
import { BookRegistersView } from '../book-production/BookRegistersView';
import { EditorialToolsManager } from '../book-production/EditorialToolsManager';
import { TeacherEditionManager } from '../book-production/TeacherEditionManager';
import { TextbookReaderPreview } from '../book-production/TextbookReaderPreview';
import { BookReadinessAuditModal } from '../book-production/BookReadinessAuditModal';
import { NewChapterModal } from '../book-production/NewChapterModal';

export type BookStudioTab =
  | 'architecture'
  | 'dashboard'
  | 'toc'
  | 'coverage'
  | 'registers'
  | 'editorial'
  | 'teacher'
  | 'manuscript'
  | 'preview';

interface GrammarBookAuthoringStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToConcepts?: () => void;
  onNavigateToQuestions?: () => void;
  onNavigateToQuestionBank?: () => void;
  onNavigateToAssessments?: () => void;
  onNavigateToDiagrammer?: (specimen: string) => void;
  onOpenChapterStudio?: (topicId?: string) => void;
}

export const GrammarBookAuthoringStudioView: React.FC<GrammarBookAuthoringStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToConcepts,
  onNavigateToQuestions,
  onNavigateToQuestionBank,
  onNavigateToAssessments,
  onNavigateToDiagrammer,
  onOpenChapterStudio,
}) => {
  // Authoritative canonical active book context
  const resolvedContext = useMemo(() => resolveActiveBookContext(seriesProject), [seriesProject]);
  const activeBook = resolvedContext.activeProject;
  const activeSystemId = resolvedContext.activeSystemId;
  const allProjectsRecord = resolvedContext.allProjectsRecord;
  const allProjectsList = resolvedContext.allProjectsList;

  const currentClassLevel = seriesProject.selectedClass || activeBook.classLevel || 'Class 6';
  const currentClassOrStage = activeBook.classOrStage || currentClassLevel;
  const isCambridge = activeSystemId === 'Cambridge';
  const normalizedClassLabel = normalizeClassOrStage(currentClassOrStage, activeSystemId);

  const [activeTab, setActiveTab] = useState<BookStudioTab>('architecture');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnswerKeys, setShowAnswerKeys] = useState(true);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNewChapterModalOpen, setIsNewChapterModalOpen] = useState(false);
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Retrieve and guarantee complete Book Production structures derived truth from active book
  const rawBook = useMemo(() => {
    return getEditionIsolatedBookData(seriesProject, activeBook);
  }, [seriesProject, activeBook]);

  const currentBook: ClassCurriculumBook = useMemo(() => {
    return ensureBookUnitsAndMetadata(rawBook, seriesProject.seriesTitle, activeBook.board || seriesProject.targetBoard);
  }, [rawBook, seriesProject.seriesTitle, activeBook.board, seriesProject.targetBoard]);

  // Valid textbooks specifically for the active system, programme, and class/stage
  const validBooksForContext = useMemo(() => {
    return allProjectsList.filter((p) => {
      const b = (p.board || '').toUpperCase();
      const isSysMatch =
        (activeSystemId === 'CISCE' && (b.includes('CISCE') || b.includes('ICSE') || b.includes('ISC'))) ||
        (activeSystemId === 'CBSE' && b.includes('CBSE')) ||
        (activeSystemId === 'Cambridge' && (b.includes('CAMBRIDGE') || b.includes('CAIE')));
      if (!isSysMatch) return false;

      return isBookProjectMatchingStage(p, activeSystemId, currentClassOrStage);
    });
  }, [allProjectsList, activeSystemId, currentClassOrStage]);

  const activeTopic: GrammarTopic | undefined =
    currentBook.topics.find((t) => t.id === selectedTopicId) || currentBook.topics[0];

  const handleSwitchBook = (bookId: string) => {
    if (!bookId || bookId === activeBook.id) return;
    const updated = switchActiveBookProject(seriesProject, bookId, allProjectsRecord);
    onUpdateSeriesProject(updated);
  };

  const handleCreateTextbookForContext = () => {
    const matchingStage =
      CURRICULUM_STAGES.find(
        (s) =>
          s.systemId === activeSystemId &&
          (s.stageLabel === currentClassOrStage || s.equivalentClass === currentClassOrStage)
      ) || CURRICULUM_STAGES[0];

    const { updatedProject } = createBookProjectForStage(
      seriesProject,
      activeSystemId,
      matchingStage.id
    );
    onUpdateSeriesProject(updatedProject);
  };

  const handleUpdateBook = (updatedBook: ClassCurriculumBook) => {
    const stampedBook: ClassCurriculumBook = {
      ...updatedBook,
      id: activeBook.id,
      bookProjectId: activeBook.id,
      editionId: activeBook.editionId || `ed-${activeBook.id}`,
      curriculumSystemId: activeBook.board || seriesProject.targetBoard,
      programmeId: activeBook.programmeId || activeBook.programme,
      classOrStageId: activeBook.classLevel || activeBook.classOrStage || currentClassLevel,
    };

    const isCbse = (activeBook.board || seriesProject.targetBoard || '').toUpperCase().includes('CBSE');

    onUpdateSeriesProject({
      ...seriesProject,
      editionBooks: {
        ...(seriesProject.editionBooks || {}),
        [activeBook.id]: stampedBook,
      },
      books: isCbse
        ? {
            ...seriesProject.books,
            [currentClassLevel]: stampedBook,
          }
        : seriesProject.books,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateTopic = (updatedTopic: GrammarTopic) => {
    const stampedTopic: GrammarTopic = {
      ...updatedTopic,
      bookProjectId: activeBook.id,
      editionId: activeBook.editionId || `ed-${activeBook.id}`,
      curriculumSystemId: activeBook.board || seriesProject.targetBoard,
      programmeId: activeBook.programmeId || activeBook.programme,
      classOrStageId: activeBook.classLevel || activeBook.classOrStage || currentClassLevel,
    };
    const updatedTopics = currentBook.topics.map((t) =>
      t.id === stampedTopic.id ? stampedTopic : t
    );
    const updatedBook: ClassCurriculumBook = {
      ...currentBook,
      topics: updatedTopics,
    };
    handleUpdateBook(updatedBook);
  };

  const handleAddChapterCreated = (newChapter: GrammarTopic, targetUnitId: string) => {
    const stampedChapter: GrammarTopic = {
      ...newChapter,
      bookProjectId: activeBook.id,
      editionId: activeBook.editionId || `ed-${activeBook.id}`,
      unitId: targetUnitId,
      curriculumSystemId: activeBook.board || seriesProject.targetBoard,
      programmeId: activeBook.programmeId || activeBook.programme,
      classOrStageId: activeBook.classLevel || activeBook.classOrStage || currentClassLevel,
    };

    const updatedTopics = [...currentBook.topics, stampedChapter];
    const updatedUnits = (currentBook.units || []).map((u) => {
      if (u.id === targetUnitId) {
        return {
          ...u,
          chapterIds: [...u.chapterIds, stampedChapter.id],
        };
      }
      return u;
    });

    const updatedBook: ClassCurriculumBook = {
      ...currentBook,
      topics: updatedTopics,
      units: updatedUnits,
    };

    handleUpdateBook(updatedBook);
    setSelectedTopicId(stampedChapter.id);
  };

  const handleOpenManuscriptForChapter = (chapterId: string) => {
    setSelectedTopicId(chapterId);
    setActiveTab('manuscript');
  };

  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const filteredTopics = currentBook.topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      id="grammar-book-authoring-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFBF7] dark:bg-[#1E1919] select-none text-[#292521] dark:text-[#F6F0E7]"
    >
      {/* 1. Academic Book Production Subheader */}
      <header className="border-b border-[#CBBEAC] dark:border-[#5A1832] bg-[#EDE4D6] dark:bg-[#35101F] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10 shadow-2xs">
        {/* Left: Class Grade Selector & Board Identifier */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold hidden sm:inline">
              {isCambridge ? 'Stage Coursebook:' : 'Class Textbook:'}
            </span>
            {validBooksForContext.length > 0 ? (
              <select
                id="select-textbook-class"
                value={activeBook.id}
                onChange={(e) => handleSwitchBook(e.target.value)}
                className="bg-white dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer shadow-2xs font-serif"
              >
                {validBooksForContext.map((b) => {
                  const bData =
                    seriesProject.editionBooks?.[b.id] ||
                    (b.id === activeBook.id ? currentBook : getEditionIsolatedBookData(seriesProject, b));
                  const count = bData?.topics?.length || 0;
                  const label =
                    validBooksForContext.length === 1
                      ? `${normalizedClassLabel} • ${count} chapters`
                      : `${b.bookTitle || normalizedClassLabel}${b.edition ? ` (${b.edition})` : ''} • ${count} chapters`;
                  return (
                    <option key={b.id} value={b.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <div className="flex items-center space-x-2">
                <select
                  id="select-textbook-class"
                  value=""
                  disabled
                  className="bg-white/60 dark:bg-[#251D1E]/60 border border-[#CBBEAC] dark:border-[#5A1832] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#71685E] dark:text-[#D8CCBC] outline-none font-serif"
                >
                  <option value="">No {normalizedClassLabel} textbook created</option>
                </select>
                <button
                  id="btn-create-context-textbook"
                  onClick={handleCreateTextbookForContext}
                  className="h-7 px-2.5 rounded-lg bg-[#5A1832] hover:bg-[#721F40] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                  title={`Create textbook for ${normalizedClassLabel}`}
                >
                  <Plus className="w-3 h-3 text-[#C29A52]" />
                  <span>Create</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/40 shadow-xs">
              {activeBook.board || seriesProject.targetBoard}
            </span>
            <span className="text-xs text-[#71685E] dark:text-[#D8CCBC] hidden xl:inline font-serif italic truncate max-w-xs">
              {currentBook.title || activeBook.bookTitle}
            </span>
          </div>
        </div>

        {/* Center: Book Architecture Navigation Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white/80 dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Manage Units, Chapter Sequence, and Structure"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Units &amp; Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Book Production Pipeline and Diagnostics"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Production Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'toc'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Typeset Table of Contents"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Contents</span>
          </button>

          <button
            onClick={() => setActiveTab('coverage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'coverage'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Curriculum Coverage Matrix"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Coverage Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('registers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'registers'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Visual, Exercise, and Assessment Registers with Answer Key Audit"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Registers &amp; Answers</span>
          </button>

          <button
            onClick={() => setActiveTab('editorial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'editorial'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Editorial Standards, Cross References, Lexicon, and Front/Back Matter"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Editorial Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'teacher'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Teacher Edition & Pacing Calendar"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Teacher Edition</span>
          </button>

          <button
            onClick={() => setActiveTab('manuscript')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'manuscript'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Chapter Manuscript Editor"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Chapter Manuscript</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'preview'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832]'
            }`}
            title="Full Textbook Typeset Reader"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Book Reader</span>
          </button>
        </div>

        {/* Right: Quick Publication Tools */}
        <div className="flex items-center space-x-2">
          {/* Readiness Audit Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-white dark:bg-[#251D1E] hover:bg-[#FDFBF7] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
            title="Execute comprehensive 10-dimension pre-press publishing audit"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#9A7438]" />
            <span className="hidden md:inline">Readiness Audit</span>
          </button>

          {/* New Chapter Modal Button */}
          <button
            onClick={() => setIsNewChapterModalOpen(true)}
            className="h-8 px-3 rounded-xl bg-[#5A1832] hover:bg-[#721F40] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>New Chapter</span>
          </button>

          {/* Launch Chapter Studio */}
          {onOpenChapterStudio && (
            <button
              onClick={() => onOpenChapterStudio(activeTopic?.id)}
              className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#9A7438] to-[#C29A52] hover:opacity-95 text-[#FDFBF7] text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-opacity"
              title="Launch Chapter Authoring Studio for deep chapter production"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden lg:inline">Chapter Studio</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Studio View Body */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'architecture' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <BookStructureManager
                currentBook={currentBook}
                seriesProject={seriesProject}
                onUpdateBook={handleUpdateBook}
                onUpdateSeriesProject={onUpdateSeriesProject}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                onOpenChapterManuscript={handleOpenManuscriptForChapter}
                onAddNewChapter={() => setIsNewChapterModalOpen(true)}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'dashboard' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <BookProductionDashboard
                currentBook={currentBook}
                seriesProject={seriesProject}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                onOpenReadinessAudit={() => setIsAuditModalOpen(true)}
                onOpenTOC={() => setActiveTab('toc')}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'toc' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              <BookTableOfContents
                currentBook={currentBook}
                seriesProject={seriesProject}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                onUpdateBook={handleUpdateBook}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'coverage' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <CurriculumCoverageMatrix
                currentBook={currentBook}
                seriesProject={seriesProject}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'registers' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <BookRegistersView
                currentBook={currentBook}
                seriesProject={seriesProject}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'editorial' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <EditorialToolsManager
                currentBook={currentBook}
                seriesProject={seriesProject}
                onUpdateBook={handleUpdateBook}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'teacher' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <TeacherEditionManager
                currentBook={currentBook}
                seriesProject={seriesProject}
                onUpdateBook={handleUpdateBook}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'preview' && (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <TextbookReaderPreview
                currentBook={currentBook}
                seriesProject={seriesProject}
                onBack={() => setActiveTab('architecture')}
                onOpenChapterStudio={(topicId) => {
                  if (onOpenChapterStudio) onOpenChapterStudio(topicId);
                  else handleOpenManuscriptForChapter(topicId);
                }}
                isDarkMode={isDarkMode}
              />
            </div>
          </main>
        )}

        {activeTab === 'manuscript' && (
          /* MANUSCRIPT EDITOR VIEW: Unit-Aware Sidebar + Chapter Canvas */
          <div className="flex-1 flex overflow-hidden">
            {/* Left Unit & Chapter Navigator Sidebar */}
            <aside className="w-64 sm:w-80 border-r border-[#CBBEAC] dark:border-[#5A1832] bg-[#EDE4D6]/50 dark:bg-[#1E1919] flex flex-col shrink-0">
              {/* Search lessons */}
              <div className="p-3 border-b border-[#CBBEAC] dark:border-[#5A1832] bg-white/70 dark:bg-[#251D1E]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#9A7438]" />
                  <input
                    type="text"
                    placeholder="Filter book chapters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-[#FDFBF7] dark:bg-[#1E1919] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
                  />
                </div>
              </div>

              {/* Units & Chapters Tree */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {(currentBook.units || []).length === 0 && currentBook.topics.length === 0 && (
                  <div className="p-6 text-center text-xs text-[#71685E] dark:text-[#D8CCBC] space-y-2">
                    <Layers className="w-6 h-6 mx-auto text-[#9A7438] opacity-60" />
                    <p className="font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                      No chapters or units authored yet
                    </p>
                    <p className="text-[11px]">
                      Create your first chapter or generate unit structure in the Architecture tab.
                    </p>
                  </div>
                )}

                {(currentBook.units || []).map((unit) => {
                  const unitChapters = unit.chapterIds
                    .map((id) => currentBook.topics.find((t) => t.id === id))
                    .filter(Boolean) as GrammarTopic[];

                  const isCollapsed = !!collapsedUnits[unit.id];

                  return (
                    <div
                      key={unit.id}
                      className="rounded-xl border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 bg-white/90 dark:bg-[#251D1E] overflow-hidden"
                    >
                      {/* Unit Header */}
                      <div
                        onClick={() => toggleUnitCollapse(unit.id)}
                        className="px-3 py-2 bg-[#EDE4D6] dark:bg-[#35101F] flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          {isCollapsed ? (
                            <ChevronRight className="w-3.5 h-3.5 text-[#9A7438] shrink-0" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#9A7438] shrink-0" />
                          )}
                          <span className="font-serif font-bold text-xs text-[#5A1832] dark:text-[#F6F0E7] truncate">
                            {unit.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#9A7438] shrink-0">
                          {unitChapters.length} ch
                        </span>
                      </div>

                      {/* Chapters under Unit */}
                      {!isCollapsed && (
                        <div className="p-1.5 space-y-1">
                          {unitChapters.length === 0 ? (
                            <div className="p-2 text-center text-[11px] text-[#71685E] italic">
                              No chapters assigned to this unit.
                            </div>
                          ) : (
                            unitChapters.map((topic, cIdx) => {
                              const isSelected = activeTopic?.id === topic.id;
                              const totalQuestions = topic.exercises.reduce(
                                (acc, ex) => acc + ex.questions.length,
                                0
                              );

                              return (
                                <button
                                  key={topic.id}
                                  onClick={() => setSelectedTopicId(topic.id)}
                                  className={`w-full text-left p-2 rounded-lg transition-colors flex flex-col space-y-0.5 text-xs ${
                                    isSelected
                                      ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                                      : 'text-[#292521] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-mono opacity-80">
                                      CH {cIdx + 1} &bull; {topic.category}
                                    </span>
                                    <span className="font-mono text-[#C29A52]">
                                      {totalQuestions} q
                                    </span>
                                  </div>
                                  <div className="truncate font-medium">
                                    {topic.title}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Unassigned / General Chapters */}
                {(() => {
                  const assignedIds = new Set<string>();
                  (currentBook.units || []).forEach((u) => u.chapterIds.forEach((id) => assignedIds.add(id)));
                  const unassigned = currentBook.topics.filter((t) => !assignedIds.has(t.id));
                  if (unassigned.length === 0) return null;

                  return (
                    <div className="rounded-xl border border-dashed border-[#CBBEAC] dark:border-[#5A1832] bg-white/60 dark:bg-[#251D1E]/60 overflow-hidden">
                      <div className="px-3 py-2 bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#9A7438] dark:text-[#C29A52]">
                          Unassigned Chapters
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#9A7438]">
                          {unassigned.length} ch
                        </span>
                      </div>
                      <div className="p-1.5 space-y-1">
                        {unassigned.map((topic, cIdx) => {
                          const isSelected = activeTopic?.id === topic.id;
                          return (
                            <button
                              key={topic.id}
                              onClick={() => setSelectedTopicId(topic.id)}
                              className={`w-full text-left p-2 rounded-lg transition-colors flex flex-col space-y-0.5 text-xs ${
                                isSelected
                                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                                  : 'text-[#292521] dark:text-[#D8CCBC] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-mono opacity-80">
                                  CH {cIdx + 1} &bull; {topic.category}
                                </span>
                              </div>
                              <div className="truncate font-medium">{topic.title}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Related Tools Footer */}
              <div className="p-3 border-t border-[#CBBEAC] dark:border-[#5A1832] bg-white/70 dark:bg-[#251D1E] space-y-1 text-xs">
                {onNavigateToConcepts && (
                  <button
                    onClick={onNavigateToConcepts}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC] transition-colors"
                  >
                    <span>Grammar Concepts</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                {onNavigateToQuestions && (
                  <button
                    onClick={onNavigateToQuestions}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC] transition-colors"
                  >
                    <span>Question Bank</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                {onNavigateToAssessments && (
                  <button
                    onClick={onNavigateToAssessments}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC] transition-colors"
                  >
                    <span>Assessment Builder</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </aside>

            {/* Right: Chapter Manuscript Canvas */}
            {activeTopic ? (
              <main className="flex-1 overflow-y-auto bg-[#FDFBF7] dark:bg-[#1E1919] p-6 sm:p-10 lg:p-12">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Chapter Header */}
                  <div className="border-b border-[#CBBEAC] dark:border-[#5A1832] pb-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7]">
                          {activeTopic.category}
                        </span>
                        <span className="text-[#9A7438]">&bull;</span>
                        <span className="font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
                          {normalizedClassLabel}
                        </span>
                        <span className="text-[#9A7438]">&bull;</span>
                        <span className="font-mono text-[#71685E] dark:text-[#D8CCBC]">
                          Board: {activeBook.board || seriesProject.targetBoard}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const specimen =
                              activeTopic.definitions[0]?.examples[0]?.sentence ||
                              'The experienced editor reviewed the manuscript with great diligence.';
                            if (onNavigateToDiagrammer) onNavigateToDiagrammer(specimen);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5 transition-colors"
                          title="Diagram sentences from this lesson in the Syntax Studio"
                        >
                          <GitFork className="w-3.5 h-3.5" />
                          <span>Diagram Specimen</span>
                        </button>

                        {onOpenChapterStudio && (
                          <button
                            onClick={() => onOpenChapterStudio(activeTopic.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#5A1832] hover:bg-[#721F40] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                            title="Open in Chapter Authoring Studio"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                            <span>Open in Chapter Studio</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Chapter Title Edit */}
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] block mb-1 font-bold">
                        Chapter Title
                      </label>
                      <input
                        type="text"
                        value={activeTopic.title}
                        onChange={(e) =>
                          handleUpdateTopic({ ...activeTopic, title: e.target.value })
                        }
                        className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] bg-transparent border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] outline-none pb-1 transition-colors"
                      />
                    </div>

                    {/* Chapter Overview */}
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] block mb-1 font-bold">
                        Pedagogical Overview &amp; Introduction
                      </label>
                      <textarea
                        rows={2}
                        value={activeTopic.overview}
                        onChange={(e) =>
                          handleUpdateTopic({ ...activeTopic, overview: e.target.value })
                        }
                        className="w-full text-xs text-[#292521] dark:text-[#F6F0E7] bg-white dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] rounded-xl p-3 outline-none focus:border-[#5A1832] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Learning Objectives Box */}
                  <section className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-[#EDE4D6]/40 dark:bg-[#35101F]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-[#C29A52]" />
                        <span>Curriculum Learning Objectives</span>
                      </h4>
                      <span className="text-[10px] font-mono text-[#71685E]">
                        Aligned to {seriesProject.targetBoard}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeTopic.learningObjectives.map((obj, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs">
                          <span className="text-[#9A7438] font-bold mt-0.5">&bull;</span>
                          <input
                            type="text"
                            value={obj}
                            onChange={(e) => {
                              const updated = [...activeTopic.learningObjectives];
                              updated[i] = e.target.value;
                              handleUpdateTopic({ ...activeTopic, learningObjectives: updated });
                            }}
                            className="flex-1 bg-transparent border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] outline-none text-[#292521] dark:text-[#F6F0E7]"
                          />
                          <button
                            onClick={() => {
                              const updated = activeTopic.learningObjectives.filter(
                                (_, idx) => idx !== i
                              );
                              handleUpdateTopic({ ...activeTopic, learningObjectives: updated });
                            }}
                            className="text-[#71685E] hover:text-rose-600 text-xs px-1"
                            title="Remove Objective"
                          >
                            &times;
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          handleUpdateTopic({
                            ...activeTopic,
                            learningObjectives: [
                              ...activeTopic.learningObjectives,
                              'New specific grammatical competency',
                            ],
                          });
                        }}
                        className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline mt-1 inline-block"
                      >
                        + Add Learning Objective
                      </button>
                    </div>
                  </section>

                  {/* Core Grammar Concepts & Formulas */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#CBBEAC] dark:border-[#5A1832] pb-2">
                      <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        Grammar Rules &amp; Syntactic Formulations
                      </h3>
                      <button
                        onClick={() => {
                          const newDef: GrammarDefinition = {
                            id: `def_${Date.now()}`,
                            term: 'New Grammar Term',
                            partOfSpeechOrCategory: activeTopic.category,
                            ageAppropriateExplanation:
                              'Definition of this syntactic rule for this grade level.',
                            rules: ['Standard rule statement'],
                            examples: [{ sentence: 'Exemplar illustrative sentence.' }],
                          };
                          handleUpdateTopic({
                            ...activeTopic,
                            definitions: [...activeTopic.definitions, newDef],
                          });
                        }}
                        className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                      >
                        + Add Concept Definition
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeTopic.definitions.map((def, defIdx) => (
                        <div
                          key={def.id}
                          className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={def.term}
                              onChange={(e) => {
                                const updated = [...activeTopic.definitions];
                                updated[defIdx] = { ...def, term: e.target.value };
                                handleUpdateTopic({ ...activeTopic, definitions: updated });
                              }}
                              className="font-serif font-bold text-base text-[#5A1832] dark:text-[#C29A52] bg-transparent border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] outline-none"
                            />
                            <button
                              onClick={() => {
                                const updated = activeTopic.definitions.filter(
                                  (_, idx) => idx !== defIdx
                                );
                                handleUpdateTopic({ ...activeTopic, definitions: updated });
                              }}
                              className="p-1 text-[#71685E] hover:text-rose-600 rounded transition-colors"
                              title="Delete Concept"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Definition Text */}
                          <div>
                            <label className="text-[10px] font-mono text-[#9A7438] block mb-1">
                              Explanation
                            </label>
                            <textarea
                              rows={2}
                              value={def.ageAppropriateExplanation}
                              onChange={(e) => {
                                const updated = [...activeTopic.definitions];
                                updated[defIdx] = {
                                  ...def,
                                  ageAppropriateExplanation: e.target.value,
                                };
                                handleUpdateTopic({ ...activeTopic, definitions: updated });
                              }}
                              className="w-full text-xs text-[#292521] dark:text-[#F6F0E7] bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] rounded-xl p-2.5 outline-none focus:border-[#5A1832]"
                            />
                          </div>

                          {/* Exemplar Sentences */}
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-mono uppercase text-[#71685E] font-bold">
                              Specimen Examples
                            </div>
                            {def.examples.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="flex items-center space-x-2 text-xs bg-[#FDFBF7] dark:bg-[#1E1919] px-3 py-2 rounded-xl border border-[#CBBEAC]/70 dark:border-[#5A1832]/60"
                              >
                                <span className="text-[#9A7438] font-bold">&bull;</span>
                                <input
                                  type="text"
                                  value={ex.sentence}
                                  onChange={(e) => {
                                    const updatedDef = { ...def };
                                    updatedDef.examples[exIdx] = {
                                      ...ex,
                                      sentence: e.target.value,
                                    };
                                    const updatedDefs = [...activeTopic.definitions];
                                    updatedDefs[defIdx] = updatedDef;
                                    handleUpdateTopic({
                                      ...activeTopic,
                                      definitions: updatedDefs,
                                    });
                                  }}
                                  className="flex-1 bg-transparent outline-none font-serif italic text-[#292521] dark:text-[#F6F0E7]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Lesson Theory / Markdown Body */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#CBBEAC] dark:border-[#5A1832] pb-2">
                      <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        Textbook Narrative Prose &amp; Pedagogical Notes
                      </h3>
                      <span className="text-[10px] font-mono text-[#71685E]">
                        Markdown supported
                      </span>
                    </div>

                    <textarea
                      rows={8}
                      value={activeTopic.notesAndTheoryMarkdown}
                      onChange={(e) =>
                        handleUpdateTopic({
                          ...activeTopic,
                          notesAndTheoryMarkdown: e.target.value,
                        })
                      }
                      className="w-full text-xs font-mono text-[#292521] dark:text-[#F6F0E7] bg-white dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] rounded-2xl p-4 outline-none focus:border-[#5A1832] leading-relaxed"
                    />
                  </section>

                  {/* Lesson Exercises */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#CBBEAC] dark:border-[#5A1832] pb-2">
                      <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        Practice Exercises ({activeTopic.exercises.length})
                      </h3>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 text-xs text-[#71685E] dark:text-[#D8CCBC] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAnswerKeys}
                            onChange={(e) => setShowAnswerKeys(e.target.checked)}
                            className="rounded text-[#5A1832]"
                          />
                          <span>Show Answer Keys</span>
                        </label>
                        <button
                          onClick={() => {
                            const newEx: GrammarExercise = {
                              id: `ex_${Date.now()}`,
                              title: `Exercise ${activeTopic.exercises.length + 1}: Graded Practice`,
                              instructions:
                                'Complete the following according to prescriptive grammar conventions.',
                              targetType: 'mixed',
                              maxMarks: 5,
                              questions: [
                                {
                                  id: `q_${Date.now()}`,
                                  type: 'fill_in_blanks',
                                  prompt: 'Fill in the blank with the appropriate syntactic form.',
                                  blanksSentence: 'Neither the teacher nor the students ______ present.',
                                  correctAnswer: 'were',
                                  difficulty: 'Medium',
                                  marks: 1,
                                  explanation: 'Rule of proximity applies with neither/nor.',
                                },
                              ],
                            };
                            handleUpdateTopic({
                              ...activeTopic,
                              exercises: [...activeTopic.exercises, newEx],
                            });
                          }}
                          className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                        >
                          + Add Exercise
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeTopic.exercises.map((ex, exIdx) => (
                        <div
                          key={ex.id}
                          className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={ex.title}
                              onChange={(e) => {
                                const updated = [...activeTopic.exercises];
                                updated[exIdx] = { ...ex, title: e.target.value };
                                handleUpdateTopic({ ...activeTopic, exercises: updated });
                              }}
                              className="font-bold text-sm text-[#5A1832] dark:text-[#C29A52] bg-transparent outline-none"
                            />
                            <span className="text-xs font-mono text-[#71685E]">
                              {ex.questions.length} questions &bull; {ex.maxMarks} marks
                            </span>
                          </div>

                          <input
                            type="text"
                            value={ex.instructions}
                            onChange={(e) => {
                              const updated = [...activeTopic.exercises];
                              updated[exIdx] = { ...ex, instructions: e.target.value };
                              handleUpdateTopic({ ...activeTopic, exercises: updated });
                            }}
                            className="w-full text-xs italic text-[#71685E] bg-transparent outline-none"
                            placeholder="Instructions for students..."
                          />

                          {/* Questions list */}
                          <div className="space-y-2 pt-2">
                            {ex.questions.map((q, qIdx) => (
                              <div
                                key={q.id}
                                className="p-3.5 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-1.5 text-xs"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-mono text-[#9A7438] font-bold">
                                    {qIdx + 1}.
                                  </span>
                                  <div className="flex-1 space-y-1">
                                    <div className="text-[#292521] dark:text-[#F6F0E7] font-medium">
                                      {q.prompt || q.blanksSentence}
                                    </div>
                                    {showAnswerKeys && (
                                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px]">
                                        <strong>Expected Answer:</strong> {q.correctAnswer}
                                        {q.explanation && (
                                          <div className="text-[10px] mt-0.5 opacity-90 italic">
                                            Rationale: {q.explanation}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <span className="font-mono text-[10px] text-[#71685E] shrink-0">
                                    [{q.marks} mk]
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </main>
            ) : (
              <div className="flex-1 flex items-center justify-center p-12 text-center text-xs text-[#71685E]">
                No chapter selected. Choose a chapter from the units sidebar or click "+ New Chapter".
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. New Chapter Creation Modal with Academic Templates */}
      <NewChapterModal
        isOpen={isNewChapterModalOpen}
        onClose={() => setIsNewChapterModalOpen(false)}
        currentBook={currentBook}
        seriesProject={seriesProject}
        onChapterCreated={handleAddChapterCreated}
        isDarkMode={isDarkMode}
      />

      {/* 4. Pre-Press Readiness Audit Modal */}
      <BookReadinessAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        currentBook={currentBook}
        seriesProject={seriesProject}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
