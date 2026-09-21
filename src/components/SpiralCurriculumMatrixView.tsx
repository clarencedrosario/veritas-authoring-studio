import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  Download,
  Printer,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Plus,
  ExternalLink,
  BookOpen,
  Info,
  X,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  Eye,
  GitFork,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  FolderKanban,
  Target,
} from 'lucide-react';
import {
  SpiralCurriculumMatrix,
  ScopeSequenceTopic,
  GrammarClassLevel,
  ProgressionStage,
  CurriculumCell,
  GrammarSeriesProject,
  ScopeSequenceMasterRow,
  CurriculumSystemId,
  ScopeSequenceAuditFinding,
} from '../types';
import {
  ALL_CLASSES,
  PROGRESSION_META,
  auditCurriculumGaps,
  exportMatrixToCSV,
  exportMatrixToMarkdown,
  getDefaultCurriculumMatrix,
} from '../utils/spiralMatrixData';
import {
  CBSE_CLASS_6_DEMO_ROWS,
  runScopeSequenceAudit,
  getSystemProfileData,
} from '../utils/scopeSequenceData';
import { MASTER_GRAMMAR_CONCEPTS } from '../utils/multiBoardData';

// Sub-components
import { MasterTableView } from './scope-sequence/MasterTableView';
import { HorizontalBookSequenceView } from './scope-sequence/HorizontalBookSequenceView';
import { VerticalProgressionView } from './scope-sequence/VerticalProgressionView';
import { CurriculumCoverageView } from './scope-sequence/CurriculumCoverageView';
import { PublisherEditorialView } from './scope-sequence/PublisherEditorialView';
import { ChapterPlanModal } from './scope-sequence/ChapterPlanModal';
import { ConceptDependencyModal } from './scope-sequence/ConceptDependencyModal';
import { SystemAdaptationModal } from './scope-sequence/SystemAdaptationModal';
import { SequenceAuditDrawer } from './scope-sequence/SequenceAuditDrawer';

interface SpiralCurriculumMatrixViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onNavigateToTopicInClass?: (classLevel: GrammarClassLevel, topicId?: string) => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
  onOpenBookPlanner?: (bookProjId?: string) => void;
  onOpenCurriculumMapping?: () => void;
  isDarkMode: boolean;
}

type StudioViewMode =
  | 'master_table'
  | 'horizontal_sequence'
  | 'vertical_progression'
  | 'series_matrix'
  | 'curriculum_coverage'
  | 'publisher_proposal';

export const SpiralCurriculumMatrixView: React.FC<SpiralCurriculumMatrixViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onNavigateToTopicInClass,
  onOpenChapterStudio,
  onOpenBookPlanner,
  onOpenCurriculumMapping,
  isDarkMode,
}) => {
  // 1. Studio View Mode
  const [viewMode, setViewMode] = useState<StudioViewMode>('master_table');

  // 2. Active System & Class & Book Project
  const [selectedSystem, setSelectedSystem] = useState<CurriculumSystemId>(
    (seriesProject.targetBoard as any) === 'Cambridge'
      ? 'Cambridge'
      : (seriesProject.targetBoard as any) === 'ICSE' || (seriesProject.targetBoard as any) === 'CISCE'
      ? 'CISCE'
      : 'CBSE'
  );

  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 6'
  );

  // Active book project if available
  const availableProjects = Object.values(seriesProject.bookProjects || {});
  const currentBookProject =
    availableProjects.find(
      (p) => p.classLevel === selectedClass || p.id === seriesProject.activeBookProjectId
    ) || availableProjects[0];

  // 3. Master Scope & Sequence Rows State
  // Initialize with CBSE Class 6 demo rows or rows adapted to active class
  const [masterRows, setMasterRows] = useState<ScopeSequenceMasterRow[]>(() => {
    // If book exists and has TOC chapters, synchronize or use demo dataset
    return CBSE_CLASS_6_DEMO_ROWS;
  });

  // 4. Audit Engine State
  const [auditFindings, setAuditFindings] = useState<ScopeSequenceAuditFinding[]>(() =>
    runScopeSequenceAudit(CBSE_CLASS_6_DEMO_ROWS, 'CBSE', 'Class 6')
  );

  // Run audit whenever masterRows change
  useEffect(() => {
    setAuditFindings(runScopeSequenceAudit(masterRows, selectedSystem, selectedClass));
  }, [masterRows, selectedSystem, selectedClass]);

  // Active pending issues count
  const activeCriticalCount = auditFindings.filter(
    (f) => f.severity === 'CRITICAL' && (f.authorAction || f.status) === 'PENDING'
  ).length;
  const activeReviewCount = auditFindings.filter(
    (f) => f.severity === 'REVIEW' && (f.authorAction || f.status) === 'PENDING'
  ).length;

  // 5. Overlays & Modals
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [activePlanRow, setActivePlanRow] = useState<ScopeSequenceMasterRow | null>(null);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [dependencyConceptId, setDependencyConceptId] = useState('concept-concord');
  const [isAdaptationModalOpen, setIsAdaptationModalOpen] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Legacy Series Matrix State
  const matrix: SpiralCurriculumMatrix =
    seriesProject.curriculumMatrix || getDefaultCurriculumMatrix(seriesProject.targetBoard);

  const [searchQueryMatrix, setSearchQueryMatrix] = useState('');
  const [selectedStrandMatrix, setSelectedStrandMatrix] = useState<string>('all');
  const [activeCellData, setActiveCellData] = useState<{
    topic: ScopeSequenceTopic;
    classLevel: GrammarClassLevel;
  } | null>(null);

  // New topic modal form
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicStrand, setNewTopicStrand] = useState('Parts of Speech');
  const [newTopicDescription, setNewTopicDescription] = useState('');

  // Row update handler
  const handleUpdateRow = (updatedRow: ScopeSequenceMasterRow) => {
    setMasterRows((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
  };

  // Reorder rows handler (from Horizontal Roadmap)
  const handleReorderRows = (newRows: ScopeSequenceMasterRow[]) => {
    setMasterRows(newRows);
  };

  // Audit finding status update
  const handleUpdateFindingStatus = (
    findingId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'DEFERRED'
  ) => {
    setAuditFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, authorAction: status } : f))
    );
  };

  // Legacy matrix updates
  const handleUpdateMatrix = (updatedMatrix: SpiralCurriculumMatrix) => {
    onUpdateSeriesProject({
      ...seriesProject,
      curriculumMatrix: {
        ...updatedMatrix,
        lastAudited: new Date().toISOString(),
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleUpdateCell = (
    topicId: string,
    classLevel: GrammarClassLevel,
    newStage: ProgressionStage,
    newNotes?: string
  ) => {
    const updatedTopics = matrix.topics.map((topic) => {
      if (topic.id !== topicId) return topic;
      return {
        ...topic,
        progression: {
          ...topic.progression,
          [classLevel]: {
            ...topic.progression[classLevel],
            stage: newStage,
            subtopicsOrNotes:
              newNotes !== undefined ? newNotes : topic.progression[classLevel]?.subtopicsOrNotes || '',
          },
        },
      };
    });

    handleUpdateMatrix({
      ...matrix,
      topics: updatedTopics,
    });

    if (activeCellData && activeCellData.topic.id === topicId) {
      const updatedTopic = updatedTopics.find((t) => t.id === topicId);
      if (updatedTopic) {
        setActiveCellData({
          topic: updatedTopic,
          classLevel,
        });
      }
    }
  };

  const handleCreateNewTopic = () => {
    if (!newTopicTitle.trim()) return;
    const newProgression: any = {};
    ALL_CLASSES.forEach((cls) => {
      newProgression[cls] = { stage: 'none', subtopicsOrNotes: '' };
    });

    const newTopic: ScopeSequenceTopic = {
      id: `top-custom-${Date.now()}`,
      strand: newTopicStrand,
      title: newTopicTitle.trim(),
      description: newTopicDescription.trim() || 'Custom curriculum topic.',
      progression: newProgression,
    };

    const newStrands = matrix.strands.includes(newTopicStrand)
      ? matrix.strands
      : [...matrix.strands, newTopicStrand];

    handleUpdateMatrix({
      ...matrix,
      strands: newStrands,
      topics: [...matrix.topics, newTopic],
    });

    setNewTopicTitle('');
    setNewTopicDescription('');
    setShowNewTopicModal(false);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportMatrixToCSV(matrix);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Scope_Sequence_Matrix_${selectedSystem}_${selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = exportMatrixToMarkdown(matrix);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Scope_Sequence_${selectedSystem}_${selectedClass}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // System profile data
  const systemProfile = getSystemProfileData(selectedSystem, selectedClass);

  return (
    <div
      id="scope-sequence-studio-container"
      className="flex flex-col h-full bg-[#EDE4D6] dark:bg-[#12080e] text-[#292521] dark:text-[#F6F0E7] overflow-y-auto"
    >
      {/* 1. TOP HEADER & STUDIO IDENTITY */}
      <div
        id="scope-sequence-header"
        className="px-6 py-4 bg-[#5A1832] text-[#FAF8F5] border-b border-[#C29A52]/40 shadow-md"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Studio Brand & Breadcrumbs */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
                VERITAS Academic Publishing
              </span>
              <span className="text-[#C29A52]/50">•</span>
              <span className="text-[11px] font-mono text-[#FAF8F5]/80">Curriculum Intelligence</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-[#F6F0E7] flex items-center gap-2">
                  Scope & Sequence Studio
                  <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-[#C29A52]/25 text-[#C29A52] border border-[#C29A52]/40">
                    {selectedSystem} • {selectedClass}
                  </span>
                </h1>
                <p className="text-xs text-[#FAF8F5]/80 max-w-2xl">
                  Answers what is taught, when, in which chapter, at what depth, with what prerequisites, and how it aligns with examination standards.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Audit Engine Trigger */}
            <button
              type="button"
              onClick={() => setIsAuditDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm border ${
                activeCriticalCount > 0
                  ? 'bg-red-950/80 text-red-200 border-red-500/60 hover:bg-red-900'
                  : activeReviewCount > 0
                  ? 'bg-amber-950/80 text-amber-200 border-amber-500/60 hover:bg-amber-900'
                  : 'bg-emerald-950/60 text-emerald-200 border-emerald-500/40 hover:bg-emerald-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Sequence Audit</span>
              {(activeCriticalCount > 0 || activeReviewCount > 0) && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-mono">
                  {activeCriticalCount + activeReviewCount}
                </span>
              )}
            </button>

            {/* Concept Dependency Map Trigger */}
            <button
              type="button"
              onClick={() => setIsDependencyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#C29A52]/40 text-xs font-semibold transition"
            >
              <GitFork className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Dependency Map</span>
            </button>

            {/* Multi-System Adaptation Trigger */}
            <button
              type="button"
              onClick={() => setIsAdaptationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/20 text-[#FAF8F5] border border-[#C29A52]/40 text-xs font-semibold transition"
            >
              <Compass className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Adapt System</span>
            </button>

            {/* Export Dropdown */}
            <div className="flex items-center bg-[#FAF8F5]/10 rounded-lg border border-[#C29A52]/40 p-0.5">
              <button
                type="button"
                onClick={handleDownloadCSV}
                title="Download CSV"
                className="px-2.5 py-1.5 text-xs text-[#FAF8F5] hover:bg-white/10 rounded transition font-mono font-bold"
              >
                CSV
              </button>
              <span className="text-[#C29A52]/40 text-xs">|</span>
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                title="Download Markdown"
                className="px-2.5 py-1.5 text-xs text-[#FAF8F5] hover:bg-white/10 rounded transition font-mono font-bold"
              >
                MD
              </button>
            </div>

            {/* Jump to Book Planner */}
            {onOpenBookPlanner && (
              <button
                type="button"
                onClick={() => onOpenBookPlanner(currentBookProject?.id)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#C29A52] hover:bg-[#d6ac60] text-[#292521] text-xs font-bold transition shadow-sm"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Book Planner</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. SELECTOR RAIL: BOOK PROJECT • EDUCATION SYSTEM • CLASS/GRADE */}
        <div className="mt-4 pt-3 border-t border-[#C29A52]/25 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* System Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#FAF8F5]/80 font-semibold">System:</span>
              <div className="flex items-center bg-black/20 p-0.5 rounded-lg border border-[#C29A52]/40">
                {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[]).map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setSelectedSystem(sys)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      selectedSystem === sys
                        ? 'bg-[#C29A52] text-[#292521] shadow-sm'
                        : 'text-[#FAF8F5]/80 hover:text-white'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade / Class Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#FAF8F5]/80 font-semibold">Class / Stage:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as GrammarClassLevel)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/30 border border-[#C29A52]/40 text-[#F6F0E7] focus:outline-none"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls} className="bg-[#5A1832] text-white">
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Project Context */}
            {currentBookProject && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#FAF8F5]/80">
                <span>Book:</span>
                <span className="font-serif font-bold text-[#C29A52]">
                  {currentBookProject.bookTitle}
                </span>
              </div>
            )}
          </div>

          {/* Workflow Position Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#FAF8F5]/70">
            {onOpenCurriculumMapping ? (
              <button
                type="button"
                onClick={onOpenCurriculumMapping}
                className="hover:underline text-[#C29A52]"
              >
                Curriculum Mapping
              </button>
            ) : (
              <span>Curriculum Mapping</span>
            )}
            <ArrowRight className="w-3 h-3 text-[#C29A52]" />
            <span className="font-bold text-white bg-black/30 px-2 py-0.5 rounded border border-[#C29A52]/40">
              Scope & Sequence
            </span>
            <ArrowRight className="w-3 h-3 text-[#C29A52]" />
            {onOpenBookPlanner ? (
              <button
                type="button"
                onClick={() => onOpenBookPlanner(currentBookProject?.id)}
                className="hover:underline text-[#C29A52]"
              >
                Book Planner & TOC
              </button>
            ) : (
              <span>Book Planner</span>
            )}
            <ArrowRight className="w-3 h-3 text-[#C29A52]" />
            {onOpenChapterStudio ? (
              <button
                type="button"
                onClick={() => onOpenChapterStudio()}
                className="hover:underline text-[#C29A52]"
              >
                Chapter Studio
              </button>
            ) : (
              <span>Chapter Studio</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. EVIDENCE-GOVERNED POLICY PROFILE BANNER */}
      <div className="px-6 py-3 bg-[#F0EBE0] dark:bg-[#1a0e16] border-b border-[#C29A52]/30 text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Curriculum Framework:</span>
            </span>
            <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
              {systemProfile.frameworkTitle}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              {systemProfile.evidenceStatus}
            </span>
          </div>

          <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] italic">
            Citation: {systemProfile.documentCitation}
          </div>
        </div>
      </div>

      {/* 4. VIEW MODE TABS NAVIGATION */}
      <div className="px-6 pt-3 bg-white dark:bg-[#1c1917] border-b border-[#C29A52]/25 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode('master_table')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'master_table'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Editable Master Table (26 Columns)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('horizontal_sequence')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'horizontal_sequence'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Book Sequence Roadmap</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('vertical_progression')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'vertical_progression'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Vertical Progression (Multi-Grade)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('series_matrix')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'series_matrix'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Series Progression Matrix (3–12)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('curriculum_coverage')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'curriculum_coverage'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Curriculum Coverage & Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('publisher_proposal')}
            className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition whitespace-nowrap ${
              viewMode === 'publisher_proposal'
                ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] font-bold'
                : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Publisher / Editorial Proposal</span>
          </button>
        </div>
      </div>

      {/* 5. MAIN STUDIO VIEW BODY */}
      <div className="flex-1 p-6 space-y-6">
        {/* VIEW 1: MASTER TABLE */}
        {viewMode === 'master_table' && (
          <MasterTableView
            rows={masterRows}
            onUpdateRow={handleUpdateRow}
            onOpenChapterPlan={(row) => setActivePlanRow(row)}
            onOpenChapterStudio={onOpenChapterStudio}
            isDarkMode={isDarkMode}
          />
        )}

        {/* VIEW 2: HORIZONTAL BOOK SEQUENCE */}
        {viewMode === 'horizontal_sequence' && (
          <HorizontalBookSequenceView
            rows={masterRows}
            onReorderRows={handleReorderRows}
            onOpenChapterPlan={(row) => setActivePlanRow(row)}
            onOpenChapterStudio={onOpenChapterStudio}
            onOpenDependencyInspector={(cId) => {
              setDependencyConceptId(cId);
              setIsDependencyModalOpen(true);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* VIEW 3: VERTICAL PROGRESSION */}
        {viewMode === 'vertical_progression' && (
          <VerticalProgressionView
            masterConcepts={MASTER_GRAMMAR_CONCEPTS}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* VIEW 4: SERIES PROGRESSION MATRIX (Preserved & Styled) */}
        {viewMode === 'series_matrix' && (
          <div className="space-y-4">
            {/* Toolbar for matrix */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQueryMatrix}
                  onChange={(e) => setSearchQueryMatrix(e.target.value)}
                  placeholder="Filter matrix concepts or notes..."
                  className="text-xs p-2 rounded-lg border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917] w-64"
                />
                <select
                  value={selectedStrandMatrix}
                  onChange={(e) => setSelectedStrandMatrix(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-[#C29A52]/30 bg-[#FAF8F5] dark:bg-[#1c1917]"
                >
                  <option value="all">All Matrix Strands</option>
                  {matrix.strands.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A1832] text-white text-xs font-bold hover:bg-[#722342] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Topic</span>
                </button>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="rounded-xl border border-[#C29A52]/30 bg-white dark:bg-[#292521] shadow-sm overflow-x-auto max-h-[600px]">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#F0EBE0] dark:bg-[#262220] text-[#71685E] dark:text-[#c9b9a6] font-bold sticky top-0 z-10 border-b border-[#C29A52]/30">
                  <tr>
                    <th className="py-3 px-3 min-w-[200px]">Curriculum Topic</th>
                    <th className="py-3 px-3 min-w-[130px]">Strand</th>
                    {ALL_CLASSES.map((cls) => (
                      <th key={cls} className="py-3 px-2 text-center w-24">
                        {cls}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C29A52]/20 text-[#292521] dark:text-[#F6F0E7]">
                  {matrix.topics
                    .filter((t) => {
                      const matchesStrand =
                        selectedStrandMatrix === 'all' ||
                        t.strand.toLowerCase() === selectedStrandMatrix.toLowerCase();
                      const matchesQ =
                        !searchQueryMatrix ||
                        t.title.toLowerCase().includes(searchQueryMatrix.toLowerCase());
                      return matchesStrand && matchesQ;
                    })
                    .map((topic) => (
                      <tr key={topic.id} className="hover:bg-[#FAF8F5]/60 dark:hover:bg-[#1c1917]/50">
                        <td className="py-2.5 px-3 font-semibold text-[#5A1832] dark:text-[#C29A52]">
                          {topic.title}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                          {topic.strand}
                        </td>
                        {ALL_CLASSES.map((cls) => {
                          const cell = topic.progression[cls];
                          const stage = cell?.stage || 'none';
                          const meta = PROGRESSION_META[stage];
                          return (
                            <td
                              key={cls}
                              className="py-2.5 px-2 text-center cursor-pointer hover:bg-[#C29A52]/10"
                              onClick={() => setActiveCellData({ topic, classLevel: cls })}
                            >
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta?.bgClass} ${meta?.colorClass} ${meta?.borderClass}`}
                              >
                                {meta?.short || '—'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: CURRICULUM COVERAGE */}
        {viewMode === 'curriculum_coverage' && (
          <CurriculumCoverageView
            rows={masterRows}
            system={selectedSystem}
            classLevel={selectedClass}
            onOpenRow={(rowId) => {
              const r = masterRows.find((m) => m.id === rowId);
              if (r) setActivePlanRow(r);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* VIEW 6: PUBLISHER / PROPOSAL VIEW */}
        {viewMode === 'publisher_proposal' && (
          <PublisherEditorialView
            rows={masterRows}
            system={selectedSystem}
            classLevel={selectedClass}
            seriesTitle={seriesProject.seriesTitle}
            bookTitle={currentBookProject?.bookTitle || `${selectedSystem} English Grammar ${selectedClass}`}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* 6. MODALS & DRAWERS */}

      {/* Chapter Plan Card Modal */}
      {activePlanRow && (
        <ChapterPlanModal
          row={activePlanRow}
          onClose={() => setActivePlanRow(null)}
          onSaveRow={handleUpdateRow}
          onOpenChapterStudio={onOpenChapterStudio}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Concept Dependency Modal */}
      {isDependencyModalOpen && (
        <ConceptDependencyModal
          initialConceptId={dependencyConceptId}
          onClose={() => setIsDependencyModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Multi-System Sequence Adaptation Modal */}
      {isAdaptationModalOpen && (
        <SystemAdaptationModal
          currentSystem={selectedSystem}
          onClose={() => setIsAdaptationModalOpen(false)}
          onApplyAdaptation={(adapted) => {
            // Handled safely without overwriting source
            setIsAdaptationModalOpen(false);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Sequence Audit Intelligence Drawer */}
      <SequenceAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        findings={auditFindings}
        onUpdateFindingStatus={handleUpdateFindingStatus}
        onNavigateToRow={(rowId) => {
          const target = masterRows.find((r) => r.id === rowId);
          if (target) {
            setActivePlanRow(target);
            setIsAuditDrawerOpen(false);
          }
        }}
        isDarkMode={isDarkMode}
      />

      {/* Legacy Cell Inspector Modal */}
      {activeCellData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] dark:bg-[#1c1917] rounded-xl border border-[#C29A52]/40 shadow-2xl p-6 max-w-md w-full animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#C29A52]/30 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C29A52] font-bold">
                  {activeCellData.classLevel} Progression
                </span>
                <h3 className="text-base font-bold text-[#5A1832] dark:text-[#C29A52]">
                  {activeCellData.topic.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCellData(null)}
                className="text-[#71685E] hover:text-[#292521]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Instructional Stage:</label>
                <select
                  value={activeCellData.topic.progression[activeCellData.classLevel]?.stage || 'none'}
                  onChange={(e) =>
                    handleUpdateCell(
                      activeCellData.topic.id,
                      activeCellData.classLevel,
                      e.target.value as ProgressionStage
                    )
                  }
                  className="w-full p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#292521] font-semibold"
                >
                  <option value="none">None (Not Taught)</option>
                  <option value="introduced">Introduced (I)</option>
                  <option value="developing">Developing (D)</option>
                  <option value="reinforced">Reinforced (R)</option>
                  <option value="mastered">Mastered (M)</option>
                  <option value="extended">Extended (E)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Curriculum Notes / Subtopics:</label>
                <textarea
                  rows={3}
                  value={activeCellData.topic.progression[activeCellData.classLevel]?.subtopicsOrNotes || ''}
                  onChange={(e) =>
                    handleUpdateCell(
                      activeCellData.topic.id,
                      activeCellData.classLevel,
                      activeCellData.topic.progression[activeCellData.classLevel]?.stage || 'none',
                      e.target.value
                    )
                  }
                  className="w-full p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#292521]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveCellData(null)}
                  className="px-4 py-1.5 rounded bg-[#5A1832] text-white font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] dark:bg-[#1c1917] rounded-xl border border-[#C29A52]/40 shadow-2xl p-6 max-w-md w-full animate-fadeIn">
            <h3 className="text-base font-bold text-[#5A1832] dark:text-[#C29A52] mb-3">
              Add New Topic to Matrix
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Topic Title:</label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Subjunctive Mood & Inversion"
                  className="w-full p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#292521]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Strand:</label>
                <input
                  type="text"
                  value={newTopicStrand}
                  onChange={(e) => setNewTopicStrand(e.target.value)}
                  className="w-full p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#292521]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  className="w-full p-2 rounded border border-[#C29A52]/30 bg-white dark:bg-[#292521]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-3 py-1.5 rounded border border-[#C29A52]/40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewTopic}
                  className="px-4 py-1.5 rounded bg-[#5A1832] text-white font-bold"
                >
                  Create Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
