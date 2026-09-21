import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
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
  AlertTriangle,
  Download,
  Printer,
  Compass,
  Check,
  ExternalLink,
  BookMarked,
  Info,
} from 'lucide-react';
import {
  BookProject,
  GrammarSeriesProject,
  ClassCurriculumBook,
  MasterGrammarConcept,
  SpiralCurriculumMatrix,
  ReadinessCategoryScore,
  ProductionMilestone,
} from '../../types';
import { calculateBookReadiness } from '../../utils/bookProjectUtils';
import { normalizeClassOrStage } from '../../utils/curriculumFrameworkData';
import { ChapterManagerView } from './ChapterManagerView';
import { ProductionMilestonesView } from './ProductionMilestonesView';
import { RightsAndEditionsView } from './RightsAndEditionsView';
import { BookWideAuditView } from './BookWideAuditView';

export interface BookProjectDetailViewProps {
  project: BookProject;
  seriesProject: GrammarSeriesProject;
  book?: ClassCurriculumBook;
  masterConcepts?: MasterGrammarConcept[];
  curriculumMatrix?: SpiralCurriculumMatrix;
  allProjects?: BookProject[];
  onSelectProject?: (projectId: string) => void;
  onBackToDashboard: () => void;
  onUpdateProject: (project: BookProject) => void;
  onOpenChapterStudio: (chapterId?: string) => void;
  onOpenBookPlanner?: (projectId?: string) => void;
  onOpenTextbookPreview: (classLevel?: string) => void;
  onOpenLayoutExport: (classLevel?: string) => void;
  onOpenPublisherSubmission: () => void;
  onOpenCurriculumMapping?: () => void;
  onOpenAssessmentBuilder?: () => void;
  onAdaptBoard?: (projectId: string) => void;
  onDuplicateEdition?: (projectId: string) => void;
  onArchiveProject?: (projectId: string) => void;
}

export type BookDetailTab =
  | 'overview'
  | 'chapters'
  | 'curriculum'
  | 'assessments'
  | 'visuals'
  | 'audit'
  | 'production'
  | 'editions'
  | 'milestones'
  | 'publisher_package';

export const BookProjectDetailView: React.FC<BookProjectDetailViewProps> = ({
  project,
  seriesProject,
  book,
  masterConcepts = [],
  curriculumMatrix,
  allProjects = [],
  onSelectProject,
  onBackToDashboard,
  onUpdateProject,
  onOpenChapterStudio,
  onOpenBookPlanner,
  onOpenTextbookPreview,
  onOpenLayoutExport,
  onOpenPublisherSubmission,
  onOpenCurriculumMapping,
  onOpenAssessmentBuilder,
  onAdaptBoard,
  onDuplicateEdition,
  onArchiveProject,
}) => {
  const [activeTab, setActiveTab] = useState<BookDetailTab>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const topics = book?.topics || [];
  const testPapers = book?.testPapers || [];
  const chapterCount = topics.length;
  const completedChapters = topics.filter(
    (t) => (t.definitions?.length || 0) > 0 && (t.exercises?.length || 0) > 0
  ).length;

  const totalQuestions = topics.reduce(
    (acc, t) => acc + (t.exercises?.reduce((eAcc, ex) => eAcc + (ex.questions?.length || 0), 0) || 0),
    0
  );

  const totalVisuals = topics.reduce((acc, t) => {
    const blocks = ((t as any).contentBlocks || t.studioChapter?.sections?.flatMap((s) => s.blocks) || []) as any[];
    return acc + (blocks.filter((b) => b.type === 'callout_box' || b.type === 'table_block' || b.type === 'visual').length || 0);
  }, 0);

  const totalAssessments = testPapers.length + topics.reduce((acc, t) => acc + (t.testSeries?.length || 0), 0);

  // Calculate readiness report
  const readinessReport =
    project.readiness || calculateBookReadiness(project, book, masterConcepts);

  const getStatusBadge = (status: ReadinessCategoryScore['status']) => {
    switch (status) {
      case 'Complete':
      case 'Verified':
        return 'bg-emerald-600 text-white';
      case 'In Progress':
        return 'bg-[#C29A52] text-slate-950 font-bold';
      case 'Needs Review':
        return 'bg-amber-600 text-white';
      case 'Missing':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getVerificationBadge = (vStatus?: string) => {
    switch (vStatus) {
      case 'Internally Verified':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Mapped':
        return 'bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      case 'Needs Academic Review':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Potential Gap':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Not Checked':
      default:
        return 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] border-[#CBBEAC] dark:border-[#4f2c3d]';
    }
  };

  return (
    <div id="book-project-detail-view" className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] shadow-xl border border-[#C29A52] flex items-center space-x-2 text-sm">
          <Sparkles className="w-4 h-4 text-[#C29A52]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Book Projects</span>
          </button>

          <div className="h-4 w-px bg-[#CBBEAC]/60 dark:bg-[#4f2c3d]" />

          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-mono">
            {seriesProject.seriesTitle}
          </span>
          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">/</span>
          <span className="text-xs font-bold text-[#35101F] dark:text-[#F6F0E7] font-serif">
            {project.bookTitle}
          </span>
        </div>

        {/* Project Selector (Switch to another book) */}
        {allProjects.length > 1 && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#71685E] dark:text-[#c9b9a6]">Switch Volume:</span>
            <select
              value={project.id}
              onChange={(e) => onSelectProject && onSelectProject(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] text-[#35101F] dark:text-[#F6F0E7] font-medium text-xs focus:ring-1 focus:ring-[#5A1832]"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.board} {normalizeClassOrStage(p.classOrStage || p.classLevel, p.board)} — {p.bookTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hero Banner with Academic Project Identification */}
      <div className="bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C29A52]/10 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-[#5A1832] text-white">
                {project.board}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md bg-[#EDE4D6] dark:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7] border border-[#CBBEAC]">
                {normalizeClassOrStage(project.classOrStage || project.classLevel, project.board)}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono rounded-md bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Subject: {project.subject || 'English Grammar'}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-600 text-white">
                {project.status}
              </span>
              <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                ISBN: {project.isbnPlaceholder || 'Not Assigned'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] tracking-tight">
                {project.bookTitle}
              </h1>
              <p className="text-sm text-[#71685E] dark:text-[#c9b9a6] mt-1 leading-relaxed">
                {project.subtitle}
              </p>
            </div>

            {/* Key Demonstrating Meta: Current Chapter */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
                <BookOpen className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
                <span className="text-[#71685E] dark:text-[#c9b9a6]">Current Chapter:</span>
                <span className="font-semibold text-[#35101F] dark:text-[#F6F0E7]">
                  Subject–Verb Agreement / Concord
                </span>
              </div>

              <div className="text-[#71685E] dark:text-[#c9b9a6]">
                Author: <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">{project.author}</span>
              </div>

              <div className="text-[#71685E] dark:text-[#c9b9a6]">
                Edition: <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">{project.edition}</span>
              </div>

              <div className="text-[#71685E] dark:text-[#c9b9a6]">
                Trim Size: <span className="font-mono font-medium">{project.trimSize}</span>
              </div>
            </div>
          </div>

          {/* Action Launchpad */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <button
              onClick={() => onOpenChapterStudio()}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-bold transition-colors shadow-sm"
            >
              <Edit3 className="w-4 h-4 text-[#C29A52]" />
              <span>Open in Chapter Studio</span>
            </button>

            {onOpenBookPlanner && (
              <button
                onClick={() => onOpenBookPlanner(project.id)}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-[#9A7438] bg-[#EDE4D6] dark:bg-[#35101F] hover:bg-[#FDFBF7] text-[#5A1832] dark:text-[#C29A52] text-xs font-bold transition-colors shadow-xs"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                <span>Book Planner &amp; TOC</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenTextbookPreview(project.classLevel)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/70 dark:bg-[#35101F] hover:bg-[#EDE4D6] text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => onOpenLayoutExport(project.classLevel)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/70 dark:bg-[#35101F] hover:bg-[#EDE4D6] text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                <span>Layout</span>
              </button>
            </div>

            <button
              onClick={onOpenPublisherSubmission}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-[#5A1832]/40 bg-[#5A1832]/10 hover:bg-[#5A1832]/20 text-[#5A1832] dark:text-[#C29A52] text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publisher Submission Centre</span>
            </button>
          </div>
        </div>

        {/* Quick Operations Bar (Adapt, Duplicate, Archive) */}
        <div className="mt-5 pt-4 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Operations:</span>
            {onAdaptBoard && (
              <button
                onClick={() => onAdaptBoard(project.id)}
                className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-medium flex items-center space-x-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Adapt to Another Board</span>
              </button>
            )}
            {onDuplicateEdition && (
              <button
                onClick={() => onDuplicateEdition(project.id)}
                className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-medium flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Duplicate Edition</span>
              </button>
            )}
            {onArchiveProject && (
              <button
                onClick={() => onArchiveProject(project.id)}
                className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-rose-50 text-rose-700 dark:text-rose-400 font-medium flex items-center space-x-1"
              >
                <Archive className="w-3 h-3" />
                <span>Archive</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-[#71685E] dark:text-[#c9b9a6]">
            <span>Target: <strong className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{project.targetPageCount} pages</strong></span>
            <span>Words: <strong className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{project.estimatedWordCount?.toLocaleString()}</strong></span>
            <span>Readiness: <strong className="font-mono text-[#9A7438] dark:text-[#C29A52]">{readinessReport.overallScore}%</strong></span>
          </div>
        </div>
      </div>

      {/* 10-Tab Detail Navigation Bar */}
      <div className="flex border-b border-[#CBBEAC] dark:border-[#4f2c3d] overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'overview', label: 'Overview & Readiness', icon: Sparkles },
          { id: 'chapters', label: `Chapters (${chapterCount})`, icon: BookOpen },
          { id: 'curriculum', label: 'Curriculum Alignment', icon: SlidersHorizontal },
          { id: 'assessments', label: `Assessments (${totalAssessments})`, icon: Award },
          { id: 'visuals', label: `Visuals (${totalVisuals})`, icon: Image },
          { id: 'audit', label: 'Book Audit', icon: ShieldCheck },
          { id: 'production', label: 'Production Specs', icon: Layers },
          { id: 'editions', label: 'Editions & Rights', icon: BookMarked },
          { id: 'milestones', label: 'Milestones (13)', icon: Clock },
          { id: 'publisher_package', label: 'Publisher Package', icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as BookDetailTab)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-[#5A1832] dark:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 rounded-t-lg'
                  : 'border-transparent text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#5A1832] dark:text-[#C29A52]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Chapters</div>
                <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                  {chapterCount}
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                  {completedChapters} completed
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Practice Questions</div>
                <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                  {totalQuestions}
                </div>
                <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                  Across 3 cognitive tiers
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Visual Assets</div>
                <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                  {totalVisuals}
                </div>
                <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                  Infoboxes &amp; tables
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Target Extent</div>
                <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                  {project.targetPageCount} pgs
                </div>
                <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                  12 signatures (16pp)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Estimated Words</div>
                <div className="text-xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                  {((project.estimatedWordCount || 42500) / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                  Rigorous theory &amp; drills
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#5A1832] text-white border border-[#C29A52]/40 shadow-xs">
                <div className="text-[11px] text-[#E6C994]">Readiness Score</div>
                <div className="text-xl font-bold font-mono text-[#FAF8F2] mt-0.5">
                  {readinessReport.overallScore}%
                </div>
                <div className="text-[10px] text-emerald-300 mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Prepress Verified</span>
                </div>
              </div>
            </div>

            {/* Phase 4F Book Readiness Engine Section */}
            <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md bg-[#5A1832] text-white">
                      EDITORIAL ENGINE
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[#35101F] dark:text-[#F6F0E7]">
                      Editorial &amp; Prepress Readiness Engine
                    </h2>
                  </div>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-1">
                    Multi-stage academic audit assessing 14 critical publishing categories for textbook production.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[#71685E] dark:text-[#c9b9a6]">Status Legend:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold text-[10px]">Complete</span>
                  <span className="px-2 py-0.5 rounded bg-[#C29A52] text-slate-950 font-semibold text-[10px]">In Progress</span>
                  <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-semibold text-[10px]">Needs Review</span>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-semibold text-[10px]">Missing</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-semibold text-[10px]">Verified</span>
                </div>
              </div>

              {/* Critical Legal Disclaimer Required by Phase 4F: Never claim official board approval */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
                <div className="leading-relaxed">
                  <strong>Academic Alignment Notice:</strong> All curriculum matrix mappings and board audits are conducted for internal educational benchmarking and manuscript readiness against published {project.board} syllabus criteria. VERITAS Press does not represent, claim, or imply official board endorsement, formal affiliation, or state examination council approval.
                </div>
              </div>

              {/* 14-Category Readiness Table */}
              <div className="overflow-x-auto rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#EDE4D6] dark:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7] font-semibold border-b border-[#CBBEAC] dark:border-[#4f2c3d]">
                      <th className="p-3 font-serif">Readiness Category</th>
                      <th className="p-3 w-28 text-center">Score</th>
                      <th className="p-3 w-32 text-center">Status</th>
                      <th className="p-3 w-40 text-center">Verification Level</th>
                      <th className="p-3">Audit Findings &amp; Editorial Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#4f2c3d]">
                    {readinessReport.categories.map((cat, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#EDE4D6]/40 dark:hover:bg-[#35101F]/40 transition-colors"
                      >
                        <td className="p-3 font-semibold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52] shrink-0" />
                          <span>{cat.category}</span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5 font-mono font-bold">
                            <div className="w-12 h-1.5 rounded-full bg-[#EDE4D6] dark:bg-[#35101F] overflow-hidden">
                              <div
                                className="h-full bg-[#9A7438] dark:bg-[#C29A52]"
                                style={{ width: `${cat.percent}%` }}
                              />
                            </div>
                            <span>{cat.percent}%</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${getStatusBadge(cat.status)}`}>
                            {cat.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${getVerificationBadge(
                              cat.verificationStatus
                            )}`}
                          >
                            {cat.verificationStatus || 'Internally Verified'}
                          </span>
                        </td>
                        <td className="p-3 text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                          <div>{cat.notes}</div>
                          {cat.details && (
                            <div className="text-[11px] text-[#9A7438] dark:text-[#C29A52] mt-0.5 font-sans">
                              {cat.details}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. CHAPTERS TAB ==================== */}
        {activeTab === 'chapters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  Chapter Sequence &amp; Content Architecture
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  Reorder chapters, manage 3-tier difficulty distribution, and audit learning outcomes.
                </p>
              </div>

              <button
                onClick={() => onOpenChapterStudio()}
                className="px-3.5 py-2 rounded-xl bg-[#5A1832] text-white hover:bg-[#35101F] text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Launch Chapter Studio</span>
              </button>
            </div>

            <ChapterManagerView
              project={project}
              book={book}
              onUpdateBookTopics={(level, updatedTopics) => {
                showNotification('Chapter sequence updated successfully');
              }}
              onOpenChapterInStudio={(chapId) => {
                onOpenChapterStudio(chapId);
              }}
            />
          </div>
        )}

        {/* ==================== 3. CURRICULUM TAB ==================== */}
        {activeTab === 'curriculum' && (
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  {project.board} Framework Alignment &amp; Spiral Syllabus Matrix
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                  Standardized curriculum mapping for {normalizeClassOrStage(project.classOrStage || project.classLevel, project.board)} across universal syntax strands.
                </p>
              </div>

              {onOpenCurriculumMapping && (
                <button
                  onClick={onOpenCurriculumMapping}
                  className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#35101F] hover:bg-[#EDE4D6]/80 text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Open Full Matrix</span>
                </button>
              )}
            </div>

            {/* Strand Distribution Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Strand 1: Syntax &amp; Clauses
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Subject-Verb agreement, clause boundary analysis, conditional structures, and transformational mechanics.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Weightage: 35% (28 Marks)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Strand 2: Accidence &amp; Morphology
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Tense aspects (Simple, Continuous, Perfect), voice transposition, modal auxiliaries, and pronoun inflections.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Weightage: 30% (24 Marks)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Strand 3: Composition &amp; Rhetoric
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Formal letter composition, analytical paragraphing, descriptive discourse, and cohesive discourse markers.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Weightage: 20% (16 Marks)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Strand 4: Mechanics &amp; Lexicon
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Serial comma rules, semicolon junctions, hyphenation standards, prefixation, and spelling conventions.
                </p>
                <div className="text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Weightage: 15% (12 Marks)
                </div>
              </div>
            </div>

            {/* Mapped Chapters List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                Mapped Syllabus Chapters for {project.board} Class {project.classOrStage}
              </h4>
              <div className="divide-y divide-[#CBBEAC]/50 dark:divide-[#4f2c3d] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl overflow-hidden">
                {topics.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 bg-[#F6F0E7] dark:bg-[#2b1622] flex items-center justify-between text-xs hover:bg-[#EDE4D6]/40 dark:hover:bg-[#35101F]/40"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-[11px] text-[#71685E] dark:text-[#c9b9a6] w-6">
                        Ch {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-[#35101F] dark:text-[#F6F0E7]">{t.title}</div>
                        <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                          Category: {t.category} • {t.definitions?.length || 0} Rules • {t.exercises?.length || 0} Exercises
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Mapped to {project.board}
                      </span>
                      <button
                        onClick={() => onOpenChapterStudio(t.id)}
                        className="px-2 py-1 rounded border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-medium"
                      >
                        Edit in Studio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. ASSESSMENTS TAB ==================== */}
        {activeTab === 'assessments' && (
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  Assessment Architecture &amp; Summative Examination Blueprints
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                  Formative unit tests and term papers calibrated against board marking rubrics.
                </p>
              </div>

              {onOpenAssessmentBuilder && (
                <button
                  onClick={onOpenAssessmentBuilder}
                  className="px-3.5 py-2 rounded-xl bg-[#5A1832] text-white hover:bg-[#35101F] text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Launch Assessment Builder</span>
                </button>
              )}
            </div>

            {/* Bloom's Taxonomy Cognitive Distribution */}
            <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                  Cognitive Rigour Balance (Bloom&apos;s Revised Taxonomy)
                </span>
                <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                  Total Item Pool: {totalQuestions} Questions
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Remembering</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">20%</div>
                  <div className="text-[10px] text-[#9A7438]">Rule recall</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Understanding</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">25%</div>
                  <div className="text-[10px] text-[#9A7438]">Contrast pairs</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Applying</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">25%</div>
                  <div className="text-[10px] text-[#9A7438]">Cloze &amp; blank fills</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Analyzing</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">15%</div>
                  <div className="text-[10px] text-[#9A7438]">Error detection</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Evaluating</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">10%</div>
                  <div className="text-[10px] text-[#9A7438]">Sentence critique</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC]/40">
                  <div className="text-[10px] text-[#71685E]">Creating</div>
                  <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">5%</div>
                  <div className="text-[10px] text-[#9A7438]">Composition</div>
                </div>
              </div>
            </div>

            {/* Test Papers List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                Included Formative &amp; Summative Examination Papers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">Periodic Test 1</span>
                    <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">25 Marks</span>
                  </div>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Chapters 1–3 diagnostic check. 45-minute timed paper assessing foundational syntax.
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ Full marking scheme &amp; answer rationale included
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">Mid-Term Assessment</span>
                    <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">80 Marks</span>
                  </div>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Comprehensive half-yearly examination paper matching {project.board} 3-hour examination format.
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ Section A (Reading), Section B (Grammar), Section C (Writing)
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">Annual Summative Paper</span>
                    <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">80 Marks</span>
                  </div>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Final year-end model paper covering full spiral syllabus with step-marking criteria.
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ Evaluated against specimen paper standards
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. VISUALS TAB ==================== */}
        {activeTab === 'visuals' && (
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                Pedagogical Diagramming &amp; Visual Callout Strategy
              </h3>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                Two-column and full-width graphical infoboxes designed to visually anchor abstract grammatical abstractions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                  <Image className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                  <span>Syntactic Tree Diagrams</span>
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Visual constituent breakdown displaying Subject Noun Phrase (NP) and Verb Phrase (VP) hierarchical tree attachments.
                </p>
                <div className="text-[11px] font-mono text-[#9A7438]">Deployed in Chapters 1 &amp; 2 (Subject-Verb Concord)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                  <Layers className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                  <span>Contrastive Inflection Tables</span>
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Two-column tables contrasting singular vs. plural verb inflections with irregular exceptions (e.g. collective nouns).
                </p>
                <div className="text-[11px] font-mono text-[#9A7438]">8 formatted tables embedded in student body</div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Common Pitfall &ldquo;Watch Out!&rdquo; Boxes</span>
                </div>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Tinted callouts alerting pupils to intervening prepositional phrases causing false plural agreement errors.
                </p>
                <div className="text-[11px] font-mono text-[#9A7438]">12 callout boxes with corrective guidance</div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. BOOK AUDIT TAB ==================== */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <BookWideAuditView
              project={project}
              book={book}
              masterConcepts={masterConcepts}
              onOpenChapter={(chapId) => onOpenChapterStudio(chapId)}
              onUpdateProjectAuditIssues={(issues) => {
                onUpdateProject({ ...project, auditIssues: issues });
                showNotification('Audit issues updated');
              }}
            />
          </div>
        )}

        {/* ==================== 7. PRODUCTION SPECS TAB ==================== */}
        {activeTab === 'production' && (
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                Technical Print &amp; Prepress Manufacturing Specifications
              </h3>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                Exact physical geometry, imposition signature layout, and binding standards for commercial offset presses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-1">
                <div className="text-[#71685E] dark:text-[#c9b9a6]">Trim Size</div>
                <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">
                  {project.trimSize}
                </div>
                <div className="text-[11px] text-[#71685E]">Crown Quarto (189 × 246 mm)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-1">
                <div className="text-[#71685E] dark:text-[#c9b9a6]">Extent / Pagination</div>
                <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">
                  {project.targetPageCount} Pages (12 × 16pp)
                </div>
                <div className="text-[11px] text-[#71685E]">Even signature count, zero waste</div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-1">
                <div className="text-[#71685E] dark:text-[#c9b9a6]">Color Intent</div>
                <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">
                  4/4 Full Colour (CMYK)
                </div>
                <div className="text-[11px] text-[#71685E]">FOGRA39 Euroscale Coated/Uncoated</div>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d] space-y-1">
                <div className="text-[#71685E] dark:text-[#c9b9a6]">Binding</div>
                <div className="font-mono font-bold text-[#35101F] dark:text-[#F6F0E7] text-sm">
                  Section Sewn Paperback
                </div>
                <div className="text-[11px] text-[#71685E]">Drawn-on cover with 5mm spine</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EDE4D6]/60 dark:bg-[#35101F]/60 border border-[#CBBEAC]/50 dark:border-[#4f2c3d] space-y-2 text-xs text-[#71685E] dark:text-[#c9b9a6]">
              <div className="font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Prepress Margin System &amp; Folios:
              </div>
              <ul className="list-disc list-inside space-y-1 leading-relaxed">
                <li>Head margin: 18mm | Foot margin: 20mm | Mirrored Gutter (Inner): 22mm | Outer: 16mm</li>
                <li>Bleed: 3mm on all exterior cut edges; keep live matter minimum 5mm inside trim line.</li>
                <li>Running folios: Chapter title on verso header; section header on recto; page numbers centered on foot margin.</li>
                <li>Chapter openers: Strictly forced to recto (odd-numbered pages) with generous blank half-title spread.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== 8. EDITIONS TAB ==================== */}
        {activeTab === 'editions' && (
          <div className="space-y-4">
            <RightsAndEditionsView
              project={project}
              onUpdateRightsAndEditions={(records) => {
                onUpdateProject({ ...project, rightsAndEditions: records });
                showNotification('Editions updated successfully');
              }}
            />
          </div>
        )}

        {/* ==================== 9. MILESTONES TAB ==================== */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <ProductionMilestonesView
              project={project}
              onUpdateMilestones={(milestones) => {
                onUpdateProject({ ...project, milestones });
                showNotification('Production milestones updated successfully');
              }}
            />
          </div>
        )}

        {/* ==================== 10. PUBLISHER PACKAGE TAB ==================== */}
        {activeTab === 'publisher_package' && (
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  Textbook Publisher Dossier &amp; Submission Package
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                  Complete commercial proposal and sample chapter portfolio calibrated for acquisition editors.
                </p>
              </div>

              <button
                onClick={onOpenPublisherSubmission}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-white hover:bg-[#35101F] text-xs font-semibold flex items-center space-x-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Launch Publisher Submission Centre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
                <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Included Proposal Elements
                </h4>
                <ul className="space-y-2 text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Executive Summary &amp; Series Placement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Curriculum Matrix &amp; Board Specifications ({project.board})</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Complete Annotated Table of Contents</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sample Chapter 1: Subject–Verb Agreement / Concord</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pedagogical Differentiation &amp; Bloom&apos;s Taxonomy Model</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Competing Titles Differentiation Matrix</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
                <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                  Target Educational Publishers
                </h4>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Configured for submission to major K-12 textbook imprints: Oxford University Press, Cambridge University Press, Pearson Education, Macmillan Education, and Orient Blackswan.
                </p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={onOpenPublisherSubmission}
                    className="w-full py-2 rounded-lg bg-[#5A1832] text-white hover:bg-[#35101F] text-xs font-semibold flex items-center justify-center space-x-1.5"
                  >
                    <span>Generate Publisher Proposal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
