import React, { useState } from 'react';
import {
  BookOpen,
  BookMarked,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Image,
  ChevronRight,
  Copy,
  Archive,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  FileSpreadsheet,
  ShieldCheck,
  Eye,
  Send,
  Edit3,
  Clock,
  Info,
  X,
  Tag,
} from 'lucide-react';
import { BookProject, ClassCurriculumBook } from '../../types';
import { calculateBookReadiness, deriveProductionStatus } from '../../utils/bookProjectUtils';
import { validateISBN } from '../../utils/isbnUtils';

export interface BookProjectCardProps {
  project: BookProject;
  book?: ClassCurriculumBook;
  isActive?: boolean;
  onOpen?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  onAdaptBoard?: (projectId: string) => void;
  onEditMetadata?: (projectId: string) => void;
  onOpenChapterStudio?: () => void;
  onOpenBookPlanner?: (projectId: string) => void;
  onOpenTextbookPreview?: () => void;
  onOpenLayoutExport?: () => void;
  onOpenCompleteness?: () => void;
  onManageChapters?: () => void;
  onRunAudit?: () => void;
}

export const BookProjectCard: React.FC<BookProjectCardProps> = ({
  project,
  book,
  isActive = false,
  onOpen,
  onDuplicate,
  onArchive,
  onAdaptBoard,
  onEditMetadata,
  onOpenChapterStudio,
  onOpenBookPlanner,
  onOpenTextbookPreview,
  onOpenLayoutExport,
  onOpenCompleteness,
  onManageChapters,
  onRunAudit,
}) => {
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  const topics = book?.topics || [];
  const chapterCount = topics.length;
  const completedChapters = topics.filter(
    (t) => (t.definitions?.length || 0) > 0 && (t.exercises?.length || 0) > 0
  ).length;

  const totalQuestions = topics.reduce(
    (acc, t) => acc + (t.exercises?.reduce((eAcc, ex) => eAcc + (ex.questions?.length || 0), 0) || 0),
    0
  );

  const totalVisuals = topics.reduce(
    (acc, t) => {
      const blocks = ((t as any).contentBlocks || t.studioChapter?.sections?.flatMap((s: any) => s.blocks) || []) as any[];
      return acc + (blocks.filter((b: any) => b.type === 'callout_box' || b.type === 'table_block' || b.type === 'visual' || b.type === 'diagram' || b.type === 'illustration').length || 0);
    },
    0
  );

  // Calculate actual word count from content
  const actualWordCount = topics.reduce((acc, t) => {
    const theoryWords = (t.notesAndTheoryMarkdown || '').trim().split(/\s+/).filter(Boolean).length;
    const overviewWords = (t.overview || '').trim().split(/\s+/).filter(Boolean).length;
    const defWords = (t.definitions || []).reduce((dAcc, d) => {
      const termWords = ((d as any).explanation || d.ageAppropriateExplanation || (d as any).notes || '').trim().split(/\s+/).filter(Boolean).length;
      const exWords = (d.examples || []).reduce((eAcc, ex) => eAcc + ex.sentence.trim().split(/\s+/).filter(Boolean).length, 0);
      return dAcc + termWords + exWords;
    }, 0);
    const qWords = (t.exercises || []).reduce((eAcc, ex) => {
      return eAcc + (ex.questions || []).reduce((qAcc, q) => qAcc + q.prompt.trim().split(/\s+/).filter(Boolean).length, 0);
    }, 0);
    return acc + theoryWords + overviewWords + defWords + qWords;
  }, 0);

  // Evidence-based readiness report calculation
  const readiness = project.readiness || calculateBookReadiness(project, book);
  const bookReadinessPct = readiness.bookReadinessScore;
  const chapterReadinessPct = readiness.chapterReadinessScore;
  const productionReadinessPct = readiness.productionReadinessScore;
  const plannedChapters = readiness.calculationExplanation?.plannedChapters || Math.max(12, Math.round((project.targetPageCount || 192) / 16));

  // ISBN verification check
  const isbnValidation = validateISBN(project.isbnPlaceholder);

  // Production status with manual override awareness
  const derivedStatus = project.derivedStatus || deriveProductionStatus(bookReadinessPct, Math.round((chapterCount / plannedChapters) * 100), chapterCount);
  const displayStatus = project.isManualStatus ? project.status : derivedStatus;

  const completedMilestones = project.milestones?.filter((m) => m.status === 'completed').length || (displayStatus === 'Publisher Ready' ? 12 : 2);
  const totalMilestones = project.milestones?.length || 13;

  const getBoardColor = (board: string) => {
    switch (board?.toUpperCase()) {
      case 'CBSE':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'CISCE':
      case 'ICSE':
        return 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800';
      case 'CAMBRIDGE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
      case 'Publisher Ready':
        return 'bg-emerald-600 text-white';
      case 'Layout':
      case 'Proofreading':
        return 'bg-[#C29A52] text-slate-950 font-bold';
      case 'Authoring':
      case 'Copyediting':
      case 'Academic Review':
        return 'bg-[#5A1832] text-[#F6F0E7]';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  // Author label neutral display
  const authorDisplay = (!project.author || project.author === 'Not entered' || project.author === 'Not assigned' || project.author === '—' || !project.author.trim())
    ? '—'
    : project.author;

  return (
    <>
      <div
        id={`book-project-card-${project.id}`}
        className={`rounded-2xl border transition-all duration-200 bg-[#F6F0E7] dark:bg-[#2b1622] flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md ${
          isActive
            ? 'border-[#5A1832] dark:border-[#C29A52] ring-2 ring-[#5A1832]/20 dark:ring-[#C29A52]/20'
            : 'border-[#CBBEAC] dark:border-[#4f2c3d] hover:border-[#9A7438]'
        }`}
      >
        {/* Top Header */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              <span
                className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md border ${getBoardColor(
                  project.board
                )}`}
              >
                {project.board}
              </span>
              <span className="text-[12px] font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] bg-[#EDE4D6] dark:bg-[#35101F] px-2 py-0.5 rounded border border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
                {project.classOrStage}
              </span>
              <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                {project.edition}
              </span>

              {/* Demo Model Badge */}
              {project.isDemoProject && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30" title="Demonstration reference volume. Can be replaced with author's own project.">
                  DEMO MODEL
                </span>
              )}
              {project.isPrimaryWorkingProject && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" title="Active primary manuscript project.">
                  PRIMARY VOLUME
                </span>
              )}
            </div>

            {/* Production Status Badge */}
            <div className="flex items-center space-x-1">
              {project.isManualStatus && (
                <span className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded" title={`Manually configured status. Derived from data: ${derivedStatus}`}>
                  Manual
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-md shadow-2xs ${getStatusBadge(
                  displayStatus
                )}`}
              >
                {displayStatus}
              </span>
            </div>
          </div>

          {/* Title and Subtitle - Clickable to Open Detail */}
          <div
            onClick={() => onOpen && onOpen(project.id)}
            className="cursor-pointer group/title"
          >
            <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7] leading-snug line-clamp-1 group-hover/title:text-[#9A7438] transition-colors flex items-center justify-between">
              <span>{project.bookTitle}</span>
              <ChevronRight className="w-4 h-4 text-[#71685E] group-hover/title:text-[#9A7438] shrink-0 ml-1 transition-transform group-hover/title:translate-x-0.5" />
            </h3>
            <p className="text-[13px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5 line-clamp-2 leading-relaxed">
              {project.subtitle || 'Coursebook for language, syntax & composition.'}
            </p>
          </div>

          {/* Authors and Internal Code */}
          <div className="text-[12px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between pt-1 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d]">
            <span className="truncate max-w-[200px]">
              Author: <span className={authorDisplay === '—' ? 'italic text-slate-400' : 'font-medium text-[#292521] dark:text-[#F6F0E7]'}>{authorDisplay}</span>
            </span>
            <span className="font-mono text-[11px] text-[#9A7438] dark:text-[#C29A52]">{project.internalProjectCode || '—'}</span>
          </div>

          {/* ISBN Truth Layer Display */}
          <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between pt-1 border-t border-[#CBBEAC]/30 dark:border-[#4f2c3d]">
            <span>
              ISBN: <span className="font-mono font-medium">{isbnValidation.formatted}</span>
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                isbnValidation.status === 'Validated Format'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : isbnValidation.status === 'Entered by Author/Publisher'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
              }`}
              title={isbnValidation.message}
            >
              {isbnValidation.status}
            </span>
          </div>

          {/* Evidence-Based Readiness Bar & Breakdown */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#71685E] dark:text-[#c9b9a6] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                <span>Book Readiness</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExplanationModal(true);
                  }}
                  className="p-0.5 text-[#9A7438] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] rounded hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                  title="How this score is calculated"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                  (Ch. Depth: <span className="font-mono font-semibold">{chapterReadinessPct}%</span>)
                </span>
                <span className="font-mono font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  {bookReadinessPct}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EDE4D6] dark:bg-[#35101F] overflow-hidden border border-[#CBBEAC]/40 dark:border-[#4f2c3d]">
              <div
                className="h-full rounded-full bg-[#9A7438] dark:bg-[#C29A52] transition-all duration-300"
                style={{ width: `${bookReadinessPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
              <span>Milestones: {completedMilestones}/{totalMilestones}</span>
              <span>Target: {project.targetPageCount || 192} Pgs</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-center p-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/50 dark:border-[#4f2c3d] text-[11px]">
            <div>
              <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">Chapters</div>
              <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7]">
                {chapterCount} / {plannedChapters} <span className="text-[9px] font-normal text-slate-500">plan</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">Questions</div>
              <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7]">{totalQuestions}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">Visuals</div>
              <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7]">{totalVisuals}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">Words</div>
              <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7]" title={actualWordCount > 0 ? `${actualWordCount} authored words` : 'Estimated target'}>
                {actualWordCount > 0 ? `${(actualWordCount / 1000).toFixed(1)}k` : `~${((project.estimatedWordCount || 42000) / 1000).toFixed(0)}k`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-3 bg-[#EDE4D6]/70 dark:bg-[#1e0f18] border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] space-y-2 rounded-b-2xl">
          {/* Primary Row: Open Project, Plan Book & Studio */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onOpen && onOpen(project.id)}
              className="flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[11.5px] font-semibold transition-colors shadow-2xs"
              title="Open Book Project Detail Screen"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C29A52] shrink-0" />
              <span>Project</span>
            </button>

            <button
              onClick={() => onOpenBookPlanner && onOpenBookPlanner(project.id)}
              className="flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg border border-[#9A7438] bg-[#EDE4D6] dark:bg-[#35101F] hover:bg-[#FDFBF7] text-[11.5px] font-semibold text-[#5A1832] dark:text-[#C29A52] transition-colors shadow-2xs"
              title="Plan Book Structure & Table of Contents"
            >
              <BookMarked className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52] shrink-0" />
              <span>Plan Book</span>
            </button>

            <button
              onClick={() => onOpenChapterStudio && onOpenChapterStudio()}
              className="flex items-center justify-center space-x-1 py-1.5 px-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[11.5px] font-semibold text-[#292521] dark:text-[#F6F0E7] transition-colors"
              title="Open Book in Chapter Studio"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52] shrink-0" />
              <span>Studio</span>
            </button>
          </div>

          {/* Secondary Row: Preview, Layout, Readiness */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onOpenTextbookPreview && onOpenTextbookPreview()}
              className="flex items-center justify-center space-x-1 py-1 px-1.5 rounded-lg border border-[#CBBEAC]/70 dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[11px] font-medium text-[#292521] dark:text-[#F6F0E7] transition-colors"
              title="Open Book in Textbook Preview"
            >
              <Eye className="w-3 h-3 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => onOpenLayoutExport && onOpenLayoutExport()}
              className="flex items-center justify-center space-x-1 py-1 px-1.5 rounded-lg border border-[#CBBEAC]/70 dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[11px] font-medium text-[#292521] dark:text-[#F6F0E7] transition-colors"
              title="Open Book in Layout & Export"
            >
              <Layers className="w-3 h-3 text-[#9A7438] dark:text-[#C29A52]" />
              <span>Layout</span>
            </button>

            <button
              onClick={() => onOpenCompleteness && onOpenCompleteness()}
              className="flex items-center justify-center space-x-1 py-1 px-1.5 rounded-lg border border-[#CBBEAC]/70 dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] text-[11px] font-medium text-[#5A1832] dark:text-[#C29A52] transition-colors"
              title="Open Book Completeness & Readiness Engine"
            >
              <Sparkles className="w-3 h-3 text-[#9A7438] dark:text-[#C29A52]" />
              <span>Readiness</span>
            </button>
          </div>

          {/* Third Row: Project Operations (Adapt, Duplicate, Archive, Metadata) */}
          <div className="flex items-center justify-between gap-1 text-[11px] pt-1.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d]">
            <div className="flex items-center space-x-1 text-[#71685E] dark:text-[#c9b9a6]">
              {onAdaptBoard && (
                <button
                  onClick={() => onAdaptBoard(project.id)}
                  className="px-1.5 py-0.5 rounded hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] hover:text-[#5A1832] dark:hover:text-[#C29A52] flex items-center space-x-1"
                  title="Adapt to Another Board (e.g. CBSE → CISCE/Cambridge)"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Adapt</span>
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(project.id)}
                  className="px-1.5 py-0.5 rounded hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] hover:text-[#5A1832] dark:hover:text-[#C29A52] flex items-center space-x-1"
                  title="Duplicate Edition"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplicate</span>
                </button>
              )}
              {onArchive && (
                <button
                  onClick={() => onArchive(project.id)}
                  className="px-1.5 py-0.5 rounded hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] hover:text-rose-600 flex items-center space-x-1"
                  title="Archive Book Project"
                >
                  <Archive className="w-3 h-3" />
                  <span>Archive</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {onEditMetadata && (
                <button
                  onClick={() => onEditMetadata(project.id)}
                  className="px-1.5 py-0.5 text-[11px] font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline"
                >
                  Metadata
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "How this score is calculated" Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-[#9A7438] dark:text-[#C29A52]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                    How This Readiness Score Is Calculated
                  </h3>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Evidence-based weighted audit for {project.bookTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="p-1.5 text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] rounded-lg hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs text-[#292521] dark:text-[#F6F0E7]">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white dark:bg-[#2b1622] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] text-center">
                  <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Book Readiness</div>
                  <div className="text-2xl font-mono font-bold text-[#5A1832] dark:text-[#C29A52] mt-0.5">
                    {bookReadinessPct}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Whole-Volume Aggregate</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#2b1622] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] text-center">
                  <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Chapter Readiness</div>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {chapterReadinessPct}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Avg of {chapterCount} Authored Unit(s)</div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#2b1622] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] text-center">
                  <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Production Readiness</div>
                  <div className="text-2xl font-mono font-bold text-[#9A7438] dark:text-[#C29A52] mt-0.5">
                    {productionReadinessPct}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Prepress & Layout Spec</div>
                </div>
              </div>

              {/* Explanatory Paragraph */}
              <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] leading-relaxed">
                <p className="font-serif font-bold text-[13px] text-[#35101F] dark:text-[#F6F0E7] mb-1">
                  Why is this score evidence-based?
                </p>
                <p className="text-[#71685E] dark:text-[#c9b9a6]">
                  A book project containing 1 authored chapter out of {plannedChapters} planned chapters cannot claim high whole-book readiness, even if that individual chapter is fully finished. Individual Chapter Readiness reflects depth of authoring, while Book Readiness measures progress toward a complete multi-unit curriculum volume.
                </p>
              </div>

              {/* Factor Breakdown Table */}
              <div className="space-y-2">
                <div className="font-serif font-bold text-xs uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
                  Contributing Weighted Factors
                </div>
                <div className="border border-[#CBBEAC]/60 dark:border-[#4f2c3d] rounded-xl overflow-hidden bg-white dark:bg-[#2b1622]">
                  <table className="w-full text-left text-[11.5px]">
                    <thead className="bg-[#EDE4D6] dark:bg-[#35101F] border-b border-[#CBBEAC]/60 dark:border-[#4f2c3d] text-[#35101F] dark:text-[#F6F0E7] font-semibold">
                      <tr>
                        <th className="p-2.5">Factor</th>
                        <th className="p-2.5 text-right">Weight</th>
                        <th className="p-2.5 text-right">Score</th>
                        <th className="p-2.5 text-right">Contr.</th>
                        <th className="p-2.5">Evidence in Manuscript</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CBBEAC]/30 dark:divide-[#4f2c3d]">
                      {(readiness.calculationExplanation?.factors || []).map((f, idx) => (
                        <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="p-2 font-medium text-[#35101F] dark:text-[#F6F0E7]">{f.name}</td>
                          <td className="p-2 text-right font-mono text-slate-500">{Math.round(f.weight * 100)}%</td>
                          <td className="p-2 text-right font-mono font-semibold">{f.score}%</td>
                          <td className="p-2 text-right font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                            +{f.contribution}%
                          </td>
                          <td className="p-2 text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[220px]" title={f.evidence}>
                            {f.evidence}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#2b1622]">
              <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                Calculation updates dynamically with actual chapters, questions, and test papers.
              </div>
              <button
                type="button"
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#5A1832] text-white hover:bg-[#35101F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
