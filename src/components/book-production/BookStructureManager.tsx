import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarTopic,
  BookUnit,
  GrammarSeriesProject,
  GrammarClassLevel,
  ChapterWorkflowStatus,
} from '../../types';
import {
  getBookMetrics,
  getChapterWordCount,
  getChapterExerciseCount,
  getChapterQuestionCount,
  getChapterVisualCount,
  getChapterCompletionPercentage,
  getChapterProductionStatus,
  getChapterAnswerKeyStatus,
  duplicateChapterStructure,
  duplicateChapterFull,
} from '../../utils/bookProductionUtils';
import { NewChapterModal } from './NewChapterModal';
import {
  Plus,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Copy,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Move,
  CheckCircle2,
  AlertTriangle,
  Globe,
  FileText,
  Eye,
  CheckSquare,
  BarChart2,
  Clock,
  Calendar,
  User,
  Hash,
  ArrowRight,
  HelpCircle,
  Archive,
  Share2,
  X,
} from 'lucide-react';
import { generateRecommendedUnitsForClass } from '../../utils/bookProductionUtils';

interface BookStructureManagerProps {
  currentBook: ClassCurriculumBook;
  seriesProject: GrammarSeriesProject;
  onUpdateBook: (updatedBook: ClassCurriculumBook) => void;
  onUpdateSeriesProject?: (updatedProject: GrammarSeriesProject) => void;
  onOpenChapterStudio: (topicId: string) => void;
  onOpenTextbookPreview?: () => void;
  onOpenChapterManuscript?: (chapterId: string) => void;
  onAddNewChapter?: () => void;
  onOpenBoardAdapt?: (topic: GrammarTopic) => void;
  isDarkMode: boolean;
}

export const BookStructureManager: React.FC<BookStructureManagerProps> = ({
  currentBook,
  seriesProject,
  onUpdateBook,
  onUpdateSeriesProject,
  onOpenChapterStudio,
  onOpenTextbookPreview,
  onOpenChapterManuscript,
  onAddNewChapter,
  onOpenBoardAdapt,
}) => {
  const metrics = getBookMetrics(currentBook);
  const units = currentBook.units || [];
  const topics = currentBook.topics || [];

  // Local state for modals & editors
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);
  const [targetUnitForNewChapter, setTargetUnitForNewChapter] = useState<string>(units[0]?.id || '');
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Unit edit modal
  const [editingUnit, setEditingUnit] = useState<BookUnit | null>(null);
  const [unitTitleInput, setUnitTitleInput] = useState('');
  const [unitDescInput, setUnitDescInput] = useState('');

  // Chapter move modal
  const [movingTopicId, setMovingTopicId] = useState<string | null>(null);
  const [destinationUnitId, setDestinationUnitId] = useState<string>('');

  // Copy structure modal
  const [showCopyStructureModal, setShowCopyStructureModal] = useState(false);
  const [selectedSourceProjectId, setSelectedSourceProjectId] = useState<string>('');

  // Copy chapter to another book modal
  const [targetCopyTopic, setTargetCopyTopic] = useState<GrammarTopic | null>(null);
  const [targetCopyBookId, setTargetCopyBookId] = useState<string>('');

  // Search / filter within structure
  const [searchFilter, setSearchFilter] = useState('');

  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Helper to calculate estimated page count
  const estimatedPageCount = Math.max(
    Math.round(metrics.totalWords / 320) + Math.round(metrics.totalVisuals * 0.5) + units.length * 2 + 16,
    currentBook.targetPageCount || 160
  );

  // Unit Operations
  const handleAddUnit = () => {
    const nextNum = units.length + 1;
    const newUnit: BookUnit = {
      id: `unit-${currentBook.id || seriesProject.activeBookProjectId || 'proj'}-${Date.now()}`,
      unitNumber: nextNum,
      title: `Unit ${nextNum}: [New Unit Domain]`,
      description: 'Define syllabus strand coverage and thematic progression for this unit.',
      chapterIds: [],
      order: nextNum,
      isArchived: false,
      bookProjectId: currentBook.id || seriesProject.activeBookProjectId,
      editionId: seriesProject.activeEditionId,
      curriculumSystemId: seriesProject.activeSystemId || seriesProject.targetBoard,
      programmeId: seriesProject.activeProgrammeId,
      classOrStageId: currentBook.classLevel,
      status: 'draft',
    };
    onUpdateBook({
      ...currentBook,
      units: [...units, newUnit],
    });
  };

  const handleGenerateRecommendedStructure = () => {
    const recommended = generateRecommendedUnitsForClass(
      currentBook.classLevel,
      currentBook.boardStandards || seriesProject.targetBoard,
      currentBook.topics,
      currentBook.id || seriesProject.activeBookProjectId,
      seriesProject.activeEditionId,
      seriesProject.activeSystemId,
      seriesProject.activeProgrammeId
    );
    onUpdateBook({
      ...currentBook,
      units: recommended,
    });
  };

  const handleAcceptUnitSuggestion = (unitId: string) => {
    const updatedUnits = units.map((u) =>
      u.id === unitId ? { ...u, aiSuggestion: false, isTemplate: false } : u
    );
    onUpdateBook({ ...currentBook, units: updatedUnits });
  };

  const handleAcceptAllSuggestions = () => {
    const updatedUnits = units.map((u) => ({
      ...u,
      aiSuggestion: false,
      isTemplate: false,
    }));
    onUpdateBook({ ...currentBook, units: updatedUnits });
  };

  const handleDiscardAllSuggestions = () => {
    const nonSuggestedUnits = units.filter((u) => !u.aiSuggestion);
    onUpdateBook({ ...currentBook, units: nonSuggestedUnits });
  };

  const handleExecuteCopyStructure = () => {
    if (!selectedSourceProjectId) return;
    const allProjects = Object.values(seriesProject.bookProjects || {});
    const sourceProject = allProjects.find((p) => p.id === selectedSourceProjectId);
    const sourceBookData =
      seriesProject.editionBooks?.[selectedSourceProjectId] ||
      (sourceProject && seriesProject.books?.[sourceProject.classLevel || '']) ||
      null;

    if (!sourceBookData || !sourceBookData.units || sourceBookData.units.length === 0) {
      alert('The selected volume has no defined units to copy.');
      return;
    }

    const copiedUnits: BookUnit[] = sourceBookData.units.map((su, idx) => ({
      id: `unit-${currentBook.id || seriesProject.activeBookProjectId || 'proj'}-${Date.now()}-${idx + 1}`,
      unitNumber: idx + 1,
      order: idx + 1,
      title: su.title,
      description: su.description,
      chapterIds: [],
      bookProjectId: currentBook.id || seriesProject.activeBookProjectId,
      editionId: seriesProject.activeEditionId,
      curriculumSystemId: seriesProject.activeSystemId || seriesProject.targetBoard,
      programmeId: seriesProject.activeProgrammeId,
      classOrStageId: currentBook.classLevel,
      status: 'draft',
      isTemplate: true,
      aiSuggestion: false,
    }));

    onUpdateBook({
      ...currentBook,
      units: copiedUnits,
    });
    setShowCopyStructureModal(false);
    setSelectedSourceProjectId('');
  };

  const handleExecuteCopyChapterToBook = () => {
    if (!targetCopyTopic || !targetCopyBookId || !onUpdateSeriesProject) return;
    const allProjects = Object.values(seriesProject.bookProjects || {});
    const targetProject = allProjects.find((p) => p.id === targetCopyBookId);
    if (!targetProject) return;

    const targetExistingBook =
      seriesProject.editionBooks?.[targetCopyBookId] ||
      (targetProject.classLevel && seriesProject.books?.[targetProject.classLevel]) ||
      null;

    if (!targetExistingBook) {
      alert(`Target volume "${targetProject.bookTitle}" is not initialized yet.`);
      return;
    }

    const newChapterId = `chap-${targetCopyBookId}-${Date.now()}`;
    const freshChapter: GrammarTopic = {
      ...targetCopyTopic,
      id: newChapterId,
      bookProjectId: targetCopyBookId,
      editionId: targetProject.editionId || `ed-${targetCopyBookId}`,
      unitId: undefined,
      curriculumSystemId: targetProject.board || seriesProject.targetBoard,
      programmeId: targetProject.programmeId,
      classOrStageId: targetProject.classLevel || targetProject.classOrStage || 'Class 6',
      classLevel: targetProject.classLevel || targetExistingBook.classLevel || 'Class 6',
      title: `${targetCopyTopic.title} (Copied from ${currentBook.classLevel})`,
      order: (targetExistingBook.topics || []).length + 1,
    };

    const updatedTargetBook: ClassCurriculumBook = {
      ...targetExistingBook,
      topics: [...(targetExistingBook.topics || []), freshChapter],
    };

    onUpdateSeriesProject({
      ...seriesProject,
      editionBooks: {
        ...(seriesProject.editionBooks || {}),
        [targetCopyBookId]: updatedTargetBook,
      },
      lastUpdated: new Date().toISOString(),
    });

    alert(`Chapter "${targetCopyTopic.title}" was copied as a fresh, isolated chapter in "${targetProject.bookTitle}".`);
    setTargetCopyTopic(null);
    setTargetCopyBookId('');
  };

  const handleOpenEditUnit = (unit: BookUnit) => {
    setEditingUnit(unit);
    setUnitTitleInput(unit.title);
    setUnitDescInput(unit.description || '');
  };

  const handleSaveUnitEdit = () => {
    if (!editingUnit) return;
    const updatedUnits = units.map((u) =>
      u.id === editingUnit.id
        ? { ...u, title: unitTitleInput.trim() || u.title, description: unitDescInput.trim() }
        : u
    );
    onUpdateBook({ ...currentBook, units: updatedUnits });
    setEditingUnit(null);
  };

  const handleMoveUnit = (unitIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? unitIndex - 1 : unitIndex + 1;
    if (targetIndex < 0 || targetIndex >= units.length) return;
    const newUnits = [...units];
    const temp = newUnits[unitIndex];
    newUnits[unitIndex] = newUnits[targetIndex];
    newUnits[targetIndex] = temp;
    // Re-index unit order & numbers
    newUnits.forEach((u, i) => {
      u.order = i + 1;
      u.unitNumber = i + 1;
    });
    onUpdateBook({ ...currentBook, units: newUnits });
  };

  const handleDuplicateUnitStructure = (unit: BookUnit) => {
    const nextNum = units.length + 1;
    const newUnit: BookUnit = {
      id: `unit-${Date.now()}`,
      unitNumber: nextNum,
      title: `${unit.title} (Duplicate)`,
      description: unit.description,
      chapterIds: [],
      order: nextNum,
      isArchived: false,
    };
    onUpdateBook({ ...currentBook, units: [...units, newUnit] });
  };

  const handleArchiveUnit = (unitId: string) => {
    const updatedUnits = units.map((u) =>
      u.id === unitId ? { ...u, isArchived: !u.isArchived } : u
    );
    onUpdateBook({ ...currentBook, units: updatedUnits });
  };

  const handleDeleteUnit = (unit: BookUnit) => {
    if (unit.chapterIds.length > 0) {
      alert(`Cannot delete "${unit.title}" because it contains ${unit.chapterIds.length} chapter(s). Move or delete the chapters first.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete empty unit "${unit.title}"?`)) return;
    const updatedUnits = units.filter((u) => u.id !== unit.id);
    updatedUnits.forEach((u, i) => {
      u.order = i + 1;
      u.unitNumber = i + 1;
    });
    onUpdateBook({ ...currentBook, units: updatedUnits });
  };

  // Chapter Operations
  const handleCreateChapter = (newTopic: GrammarTopic, targetUnitId: string) => {
    const newTopics = [...topics, newTopic];
    const updatedUnits = units.map((u) => {
      if (u.id === targetUnitId) {
        return { ...u, chapterIds: [...u.chapterIds, newTopic.id] };
      }
      return u;
    });
    onUpdateBook({
      ...currentBook,
      topics: newTopics,
      units: updatedUnits,
    });
  };

  const handleDuplicateStructure = (topic: GrammarTopic) => {
    const newTitle = `${topic.title} (Structural Shell)`;
    const newTopic = duplicateChapterStructure(topic, topics.length + 1, newTitle);
    // Find parent unit
    const parentUnit = units.find((u) => u.chapterIds.includes(topic.id)) || units[0];
    newTopic.bookProjectId = currentBook.id || seriesProject.activeBookProjectId;
    newTopic.editionId = seriesProject.activeEditionId;
    newTopic.curriculumSystemId = seriesProject.activeSystemId || seriesProject.targetBoard;
    newTopic.programmeId = seriesProject.activeProgrammeId;
    newTopic.classOrStageId = currentBook.classLevel;
    newTopic.unitId = parentUnit?.id;
    if (newTopic.studioChapter) {
      newTopic.studioChapter.bookProjectId = newTopic.bookProjectId;
      newTopic.studioChapter.editionId = newTopic.editionId;
      newTopic.studioChapter.curriculumSystemId = newTopic.curriculumSystemId;
      newTopic.studioChapter.programmeId = newTopic.programmeId;
      newTopic.studioChapter.classOrStageId = newTopic.classOrStageId;
      newTopic.studioChapter.unitId = parentUnit?.id;
    }

    const updatedUnits = units.map((u) =>
      u.id === parentUnit.id ? { ...u, chapterIds: [...u.chapterIds, newTopic.id] } : u
    );
    onUpdateBook({
      ...currentBook,
      topics: [...topics, newTopic],
      units: updatedUnits,
    });
  };

  const handleDuplicateFull = (topic: GrammarTopic) => {
    const newTitle = `${topic.title} (Copy)`;
    const newTopic = duplicateChapterFull(topic, topics.length + 1, newTitle);
    const parentUnit = units.find((u) => u.chapterIds.includes(topic.id)) || units[0];
    newTopic.bookProjectId = currentBook.id || seriesProject.activeBookProjectId;
    newTopic.editionId = seriesProject.activeEditionId;
    newTopic.curriculumSystemId = seriesProject.activeSystemId || seriesProject.targetBoard;
    newTopic.programmeId = seriesProject.activeProgrammeId;
    newTopic.classOrStageId = currentBook.classLevel;
    newTopic.unitId = parentUnit?.id;
    if (newTopic.studioChapter) {
      newTopic.studioChapter.bookProjectId = newTopic.bookProjectId;
      newTopic.studioChapter.editionId = newTopic.editionId;
      newTopic.studioChapter.curriculumSystemId = newTopic.curriculumSystemId;
      newTopic.studioChapter.programmeId = newTopic.programmeId;
      newTopic.studioChapter.classOrStageId = newTopic.classOrStageId;
      newTopic.studioChapter.unitId = parentUnit?.id;
    }

    const updatedUnits = units.map((u) =>
      u.id === parentUnit.id ? { ...u, chapterIds: [...u.chapterIds, newTopic.id] } : u
    );
    onUpdateBook({
      ...currentBook,
      topics: [...topics, newTopic],
      units: updatedUnits,
    });
  };

  const handleMoveChapterWithinUnit = (unitId: string, chapterIndex: number, direction: 'up' | 'down') => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;
    const targetIndex = direction === 'up' ? chapterIndex - 1 : chapterIndex + 1;
    if (targetIndex < 0 || targetIndex >= unit.chapterIds.length) return;

    const newChapterIds = [...unit.chapterIds];
    const temp = newChapterIds[chapterIndex];
    newChapterIds[chapterIndex] = newChapterIds[targetIndex];
    newChapterIds[targetIndex] = temp;

    const updatedUnits = units.map((u) => (u.id === unitId ? { ...u, chapterIds: newChapterIds } : u));
    onUpdateBook({ ...currentBook, units: updatedUnits });
  };

  const handleExecuteMoveToUnit = () => {
    if (!movingTopicId || !destinationUnitId) return;

    const updatedUnits = units.map((u) => {
      // Remove from existing
      const filtered = u.chapterIds.filter((id) => id !== movingTopicId);
      // Add to destination
      if (u.id === destinationUnitId) {
        return { ...u, chapterIds: [...filtered, movingTopicId] };
      }
      return { ...u, chapterIds: filtered };
    });

    onUpdateBook({ ...currentBook, units: updatedUnits });
    setMovingTopicId(null);
  };

  const handleDeleteChapter = (topicId: string, topicTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${topicTitle}"? This cannot be undone.`)) return;

    const newTopics = topics.filter((t) => t.id !== topicId);
    const updatedUnits = units.map((u) => ({
      ...u,
      chapterIds: u.chapterIds.filter((id) => id !== topicId),
    }));

    onUpdateBook({
      ...currentBook,
      topics: newTopics,
      units: updatedUnits,
    });
  };

  // Status color helper
  const getStatusBadge = (status: ChapterWorkflowStatus) => {
    switch (status) {
      case 'ready_for_layout':
      case 'final':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'academic_review':
      case 'editorial_review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'exercises_in_progress':
      case 'writing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Active Book Master Context Header */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
              <span>{seriesProject.seriesTitle}</span>
              <span>&bull;</span>
              <span>{seriesProject.targetBoard} Framework</span>
              <span>&bull;</span>
              <span className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] text-[10px]">
                {currentBook.bookStatus || 'In Production'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              {currentBook.title}
            </h1>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] max-w-3xl leading-relaxed">
              {currentBook.description ||
                'Authoritative curriculum textbook engineered for comprehensive syntactic and communicative mastery.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                setTargetUnitForNewChapter(units[0]?.id || '');
                setShowNewChapterModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 text-[#C29A52]" />
              <span>New Chapter</span>
            </button>
            <button
              onClick={handleAddUnit}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#251D1E] hover:bg-[#FDFBF7] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Unit</span>
            </button>
            <button
              onClick={onOpenTextbookPreview}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#251D1E] hover:bg-[#FDFBF7] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Preview Typeset Book"
            >
              <Eye className="w-4 h-4 text-[#9A7438]" />
              <span>Book Preview</span>
            </button>
          </div>
        </div>

        {/* Structured Publishing Metadata Strip */}
        <div className="mt-4 pt-4 border-t border-[#CBBEAC]/70 dark:border-[#5A1832]/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Standard</span>
            <div className="font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">{currentBook.classLevel}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Subject</span>
            <div className="font-medium text-[#292521] dark:text-[#F6F0E7] truncate">{currentBook.subject}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Edition</span>
            <div className="font-mono text-[#292521] dark:text-[#F6F0E7]">{currentBook.edition}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Academic Year</span>
            <div className="font-mono text-[#292521] dark:text-[#F6F0E7]">{currentBook.academicYear}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Est. Pages</span>
            <div className="font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
              {estimatedPageCount} pp <span className="text-[10px] font-normal text-[#71685E]">/ {currentBook.targetPageCount}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Units &bull; Chapters</span>
            <div className="font-mono text-[#292521] dark:text-[#F6F0E7]">
              {units.length} units &bull; {topics.length} ch
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase">Completion</span>
            <div className="flex items-center space-x-1.5 font-mono font-bold text-[#292521] dark:text-[#F6F0E7]">
              <div className="w-12 h-2 rounded-full bg-[#CBBEAC] dark:bg-[#5A1832] overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${metrics.overallCompletionPercentage}%` }}
                />
              </div>
              <span>{metrics.overallCompletionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Units & Chapter Production Architecture Canvas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#292521] dark:text-[#F6F0E7]">
              Book Architecture ({units.length} Units &bull; {topics.length} Chapters)
            </h2>
          </div>
          <div className="text-xs text-[#71685E] dark:text-[#D8CCBC] flex items-center space-x-3">
            <span>Drag or move chapters to reorder units</span>
            <span>&bull;</span>
            <span>All changes persist automatically</span>
          </div>
        </div>

        {/* AI Suggestion Banner */}
        {units.some((u) => u.aiSuggestion) && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                  <span>AI Suggestion — Needs Review</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                    {units.filter((u) => u.aiSuggestion).length} Units Proposed
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  Recommended unit architecture proposed based on {seriesProject.targetBoard} {currentBook.classLevel} syllabus standards. Review and accept to lock in or customize.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleAcceptAllSuggestions}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept All Units</span>
              </button>
              <button
                onClick={handleDiscardAllSuggestions}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1919] text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Unassigned Chapters Alert Section */}
        {(() => {
          const assignedIds = new Set<string>();
          units.forEach((u) => u.chapterIds.forEach((id) => assignedIds.add(id)));
          const unassigned = topics.filter((t) => !assignedIds.has(t.id));
          if (unassigned.length === 0) return null;

          return (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <h3 className="text-xs font-mono uppercase font-bold text-amber-900 dark:text-amber-200">
                    Unassigned Chapters ({unassigned.length})
                  </h3>
                </div>
                <span className="text-[11px] text-amber-800 dark:text-amber-300">
                  {units.length === 0
                    ? 'Authored chapters awaiting unit grouping'
                    : 'Assign chapters to a unit to organize the book structure'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {unassigned.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#1E1919] border border-amber-200 dark:border-amber-900/60 flex items-center justify-between shadow-2xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-[#292521] dark:text-[#F6F0E7] truncate">
                        {topic.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
                        {topic.category} &bull; {getChapterWordCount(topic)} words
                      </div>
                    </div>
                    {units.length > 0 ? (
                      <button
                        onClick={() => {
                          setMovingTopicId(topic.id);
                          setDestinationUnitId(units[0]?.id || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold shrink-0"
                      >
                        Assign
                      </button>
                    ) : (
                      <button
                        onClick={handleAddUnit}
                        className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold shrink-0"
                      >
                        Create Unit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {units.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-4 shadow-xs">
            <Layers className="w-10 h-10 mx-auto text-[#9A7438] opacity-70" />
            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                This book has no authored units yet.
              </h3>
              <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] max-w-md mx-auto">
                Units organize your curriculum into coherent pedagogical domains (e.g. Word Classes, Verbal Syntax, Clauses, Composition).
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={handleAddUnit}
                className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#721F40] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Create First Unit</span>
              </button>
              <button
                onClick={handleGenerateRecommendedStructure}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9A7438] to-[#C29A52] hover:opacity-95 text-[#FDFBF7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Generate Recommended Structure</span>
              </button>
              <button
                onClick={() => {
                  const otherProjects = Object.values(seriesProject.bookProjects || {}).filter(
                    (p) => p.id !== (currentBook.id || seriesProject.activeBookProjectId)
                  );
                  setSelectedSourceProjectId(otherProjects[0]?.id || '');
                  setShowCopyStructureModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#251D1E] hover:bg-[#FDFBF7] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Structure from Existing Volume</span>
              </button>
            </div>
          </div>
        ) : (
          units.map((unit, uIdx) => {
            const isCollapsed = !!collapsedUnits[unit.id];
            const unitTopics = unit.chapterIds
              .map((id) => topics.find((t) => t.id === id))
              .filter(Boolean) as GrammarTopic[];

            const unitWords = unitTopics.reduce((acc, t) => acc + getChapterWordCount(t), 0);
            const unitQuestions = unitTopics.reduce((acc, t) => acc + getChapterQuestionCount(t), 0);

            return (
              <div
                key={unit.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  unit.isArchived
                    ? 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 opacity-70'
                    : unit.aiSuggestion
                    ? 'border-amber-300 dark:border-amber-700/80 bg-white dark:bg-[#1E1919] shadow-xs'
                    : 'border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] shadow-xs'
                }`}
              >
                {/* Unit Header Bar */}
                <div className="p-4 bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC]/70 dark:border-[#5A1832]/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      onClick={() => toggleUnitCollapse(unit.id)}
                      className="p-1 rounded text-[#71685E] hover:text-[#292521] dark:text-[#D8CCBC]"
                    >
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-serif font-bold text-[#292521] dark:text-[#F6F0E7] truncate">
                          {unit.title}
                        </span>
                        {unit.aiSuggestion && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>AI Suggestion — Needs Review</span>
                          </span>
                        )}
                        {unit.isArchived && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            Archived
                          </span>
                        )}
                      </div>
                      {unit.description && (
                        <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] truncate mt-0.5">
                          {unit.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unit Stats & Actions */}
                  <div className="flex items-center space-x-2 shrink-0 text-xs">
                    {unit.aiSuggestion && (
                      <button
                        onClick={() => handleAcceptUnitSuggestion(unit.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 text-[11px] font-semibold flex items-center space-x-1"
                        title="Accept this suggested unit into canonical book architecture"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Accept Unit</span>
                      </button>
                    )}

                    <span className="text-[11px] font-mono text-[#71685E] dark:text-[#D8CCBC] hidden md:inline">
                      {unitTopics.length} chapters &bull; {unitWords.toLocaleString()} words &bull; {unitQuestions} q
                    </span>

                    <button
                      onClick={() => {
                        setTargetUnitForNewChapter(unit.id);
                        setShowNewChapterModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] hover:bg-[#CBBEAC] text-[11px] font-semibold flex items-center space-x-1"
                      title="Add Chapter to this Unit"
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Chapter</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditUnit(unit)}
                      className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                      title="Edit Unit Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMoveUnit(uIdx, 'up')}
                      disabled={uIdx === 0}
                      className="p-1.5 rounded-lg text-[#71685E] disabled:opacity-30 hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                      title="Move Unit Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleMoveUnit(uIdx, 'down')}
                      disabled={uIdx === units.length - 1}
                      className="p-1.5 rounded-lg text-[#71685E] disabled:opacity-30 hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                      title="Move Unit Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicateUnitStructure(unit)}
                      className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                      title="Duplicate Unit Structure"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleArchiveUnit(unit.id)}
                      className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                      title={unit.isArchived ? 'Unarchive Unit' : 'Archive Unit'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteUnit(unit)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50"
                      title="Delete Unit (Must be empty)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Chapters List inside Unit */}
                {!isCollapsed && (
                  <div className="p-3 space-y-2">
                    {unitTopics.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#71685E] dark:text-[#D8CCBC] italic">
                        No chapters assigned to this unit yet. Click "+ Chapter" to author or assign one.
                      </div>
                    ) : (
                      unitTopics.map((topic, cIdx) => {
                        const wordCount = getChapterWordCount(topic);
                        const exerciseCount = getChapterExerciseCount(topic);
                        const questionCount = getChapterQuestionCount(topic);
                        const visualCount = getChapterVisualCount(topic);
                        const completion = getChapterCompletionPercentage(topic);
                        const status = getChapterProductionStatus(topic);
                        const ansStatus = getChapterAnswerKeyStatus(topic);

                        return (
                          <div
                            key={topic.id}
                            className="p-3.5 rounded-xl border border-[#CBBEAC]/60 dark:border-[#5A1832]/50 bg-[#FDFBF7]/60 dark:bg-[#251D1E]/60 hover:border-[#9A7438] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs"
                          >
                            {/* Left: Chapter Identifiers */}
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                                  CH {cIdx + 1}
                                </span>
                                <span className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7] truncate">
                                  {topic.title}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono border font-medium ${getStatusBadge(
                                    status
                                  )}`}
                                >
                                  {status.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <div className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] flex items-center space-x-2">
                                <span>{topic.category}</span>
                                <span>&bull;</span>
                                <span className="italic truncate">{topic.overview || 'Standard Grammar Chapter'}</span>
                              </div>
                            </div>

                            {/* Middle: Key Publishing Metrics */}
                            <div className="flex items-center space-x-4 shrink-0 font-mono text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                              <div title="Word Count">
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {wordCount.toLocaleString()}
                                </span>{' '}
                                w
                              </div>
                              <div title="Exercises & Questions">
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {exerciseCount}
                                </span>{' '}
                                ex &bull;{' '}
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {questionCount}
                                </span>{' '}
                                q
                              </div>
                              <div title="Visuals & Syntactic Diagrams">
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {visualCount}
                                </span>{' '}
                                vis
                              </div>
                              <div
                                title={`Answer Key: ${ansStatus}`}
                                className={`flex items-center space-x-1 ${
                                  ansStatus === 'complete'
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : ansStatus === 'partial'
                                    ? 'text-amber-700 dark:text-amber-400'
                                    : 'text-rose-700 dark:text-rose-400'
                                }`}
                              >
                                {ansStatus === 'complete' ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3" />
                                )}
                                <span className="capitalize">{ansStatus} Key</span>
                              </div>
                              <div className="flex items-center space-x-1 font-bold text-[#292521] dark:text-[#F6F0E7]">
                                <span>{completion}%</span>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button
                                onClick={() => onOpenChapterStudio(topic.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                                title="Open in Chapter Authoring Studio"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
                                <span>Chapter Studio</span>
                              </button>

                              <button
                                onClick={() => handleDuplicateStructure(topic)}
                                className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] hover:bg-white dark:hover:bg-[#1E1919]"
                                title="Duplicate Structure (Architecture shells only, no student content)"
                              >
                                <Layers className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDuplicateFull(topic)}
                                className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] hover:bg-white dark:hover:bg-[#1E1919]"
                                title="Duplicate Full Chapter (with content)"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {onOpenBoardAdapt && (
                                <button
                                  onClick={() => onOpenBoardAdapt(topic)}
                                  className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] hover:bg-white dark:hover:bg-[#1E1919]"
                                  title="Adapt for CISCE / Cambridge / CBSE"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {onUpdateSeriesProject && Object.keys(seriesProject.bookProjects || {}).length > 1 && (
                                <button
                                  onClick={() => {
                                    setTargetCopyTopic(topic);
                                    const otherProjects = Object.values(seriesProject.bookProjects || {}).filter(
                                      (p) => p.id !== (currentBook.id || seriesProject.activeBookProjectId)
                                    );
                                    setTargetCopyBookId(otherProjects[0]?.id || '');
                                  }}
                                  className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] hover:bg-white dark:hover:bg-[#1E1919]"
                                  title="Copy Chapter to Another Book (Creates isolated clone)"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setMovingTopicId(topic.id);
                                  setDestinationUnitId(unit.id);
                                }}
                                className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] hover:bg-white dark:hover:bg-[#1E1919]"
                                title="Move to another Unit"
                              >
                                <Move className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleMoveChapterWithinUnit(unit.id, cIdx, 'up')}
                                disabled={cIdx === 0}
                                className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] disabled:opacity-30 hover:text-[#292521]"
                                title="Move Up within Unit"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleMoveChapterWithinUnit(unit.id, cIdx, 'down')}
                                disabled={cIdx === unitTopics.length - 1}
                                className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] disabled:opacity-30 hover:text-[#292521]"
                                title="Move Down within Unit"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteChapter(topic.id, topic.title)}
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                title="Delete Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Chapter Modal */}
      <NewChapterModal
        isOpen={showNewChapterModal}
        onClose={() => setShowNewChapterModal(false)}
        units={units}
        selectedClass={currentBook.classLevel}
        targetBoard={seriesProject.targetBoard}
        existingTopicsCount={topics.length}
        onCreateChapter={handleCreateChapter}
        isDarkMode={false}
      />

      {/* Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Edit Unit Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                  Unit Title
                </label>
                <input
                  type="text"
                  value={unitTitleInput}
                  onChange={(e) => setUnitTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none"
                />
              </div>
              <div>
                <label className="block font-mono uppercase text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                  Unit Pedagogical Description
                </label>
                <textarea
                  rows={3}
                  value={unitDescInput}
                  onChange={(e) => setUnitDescInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingUnit(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs text-[#71685E]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUnitEdit}
                className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Chapter to Unit Modal */}
      {movingTopicId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Move Chapter to Another Unit
            </h3>
            <div className="space-y-3 text-xs">
              <label className="block font-mono uppercase text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Destination Unit
              </label>
              <select
                value={destinationUnitId}
                onChange={(e) => setDestinationUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title} ({u.chapterIds.length} chapters)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setMovingTopicId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs text-[#71685E]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMoveToUnit}
                className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
              >
                Move Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Structure From Existing Volume Modal */}
      {showCopyStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Copy className="w-4 h-4 text-[#9A7438]" />
                <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Copy Structure from Existing Volume
                </h3>
              </div>
              <button
                onClick={() => setShowCopyStructureModal(false)}
                className="p-1 rounded-lg text-[#71685E] hover:text-[#292521]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Select an existing book in your series to copy its Unit domain framework (headings, descriptions, and syllabus strands). Existing chapters in this book will remain unaffected.
            </p>

            <div className="space-y-3 text-xs">
              <label className="block font-mono uppercase text-[10px] text-[#71685E] dark:text-[#D8CCBC] font-semibold">
                Source Volume
              </label>
              <select
                value={selectedSourceProjectId}
                onChange={(e) => setSelectedSourceProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                {Object.values(seriesProject.bookProjects || {})
                  .filter((p) => p.id !== (currentBook.id || seriesProject.activeBookProjectId))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.bookTitle} ({p.board} &bull; {p.classLevel || p.classOrStage})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowCopyStructureModal(false)}
                className="px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs text-[#71685E]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteCopyStructure}
                disabled={!selectedSourceProjectId}
                className="px-4 py-1.5 rounded-xl bg-[#5A1832] hover:bg-[#721F40] disabled:opacity-50 text-[#F6F0E7] text-xs font-semibold"
              >
                Copy Unit Structure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Chapter to Another Book Modal */}
      {targetCopyTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#9A7438]" />
                <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Copy Chapter to Another Book
                </h3>
              </div>
              <button
                onClick={() => {
                  setTargetCopyTopic(null);
                  setTargetCopyBookId('');
                }}
                className="p-1 rounded-lg text-[#71685E] hover:text-[#292521]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#F6F0E7] dark:bg-[#251D1E] border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 text-xs">
              <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                {targetCopyTopic.title}
              </span>
              <div className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                Current volume: {currentBook.classLevel} &bull; {currentBook.boardStandards}
              </div>
            </div>

            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              This creates a <strong className="text-[#292521] dark:text-[#F6F0E7]">completely isolated clone</strong> bound to the destination book's ID, class level, and curriculum system. It will not share an ID or state with this chapter.
            </p>

            <div className="space-y-3 text-xs">
              <label className="block font-mono uppercase text-[10px] text-[#71685E] dark:text-[#D8CCBC] font-semibold">
                Destination Book
              </label>
              <select
                value={targetCopyBookId}
                onChange={(e) => setTargetCopyBookId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                {Object.values(seriesProject.bookProjects || [])
                  .filter((p) => p.id !== (currentBook.id || seriesProject.activeBookProjectId))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.bookTitle} ({p.board} &bull; {p.classLevel || p.classOrStage})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setTargetCopyTopic(null);
                  setTargetCopyBookId('');
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs text-[#71685E]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteCopyChapterToBook}
                disabled={!targetCopyBookId}
                className="px-4 py-1.5 rounded-xl bg-[#5A1832] hover:bg-[#721F40] disabled:opacity-50 text-[#F6F0E7] text-xs font-semibold"
              >
                Create Isolated Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
