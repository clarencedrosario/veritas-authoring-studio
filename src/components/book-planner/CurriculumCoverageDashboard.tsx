import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Eye,
  Layers,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Info,
  Sparkles,
  FileCheck,
  Compass,
  GraduationCap,
} from 'lucide-react';
import {
  BookProject,
  CurriculumMapping,
  CurriculumRequirement,
  CurriculumCoverageState,
  FrameworkVerificationStatus,
  GrammarTopic,
} from '../../types';
import {
  detectCurriculumGaps,
  getBoardTerminology,
  getFrameworkProfileForBook,
  getCurriculumRequirementsForBook,
  getCurriculumMappingsForBook,
  normalizeClassOrStage,
} from '../../utils/curriculumFrameworkData';
import { CurriculumEvidenceModal } from '../curriculum/CurriculumEvidenceModal';

interface CurriculumCoverageDashboardProps {
  book: BookProject;
  topics: GrammarTopic[];
  onOpenChapterStudio: (topicId?: string) => void;
  onOpenCurriculumMapping?: () => void;
  isDarkMode?: boolean;
}

export const CurriculumCoverageDashboard: React.FC<CurriculumCoverageDashboardProps> = ({
  book,
  topics,
  onOpenChapterStudio,
  onOpenCurriculumMapping,
  isDarkMode = false,
}) => {
  const [selectedChapterForDetail, setSelectedChapterForDetail] = useState<string | null>(null);
  const [selectedEvidenceMapping, setSelectedEvidenceMapping] = useState<CurriculumMapping | null>(null);
  const [filterStrand, setFilterStrand] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Clear stale chapter/mapping/filter state when switching books
  useEffect(() => {
    setSelectedChapterForDetail(null);
    setSelectedEvidenceMapping(null);
    setFilterStrand('all');
    setFilterStatus('all');
    setSearchQuery('');
  }, [book.id, book.board, book.classLevel, book.classOrStage, book.edition]);

  // 1. Authoritative Framework Resolution for Current Book Project
  const frameworkProfile = useMemo(() => getFrameworkProfileForBook(book), [book]);
  const terminology = useMemo(() => getBoardTerminology(book.board), [book.board]);
  const profileRequirements = useMemo(() => getCurriculumRequirementsForBook(book), [book]);
  const bookMappings = useMemo(() => getCurriculumMappingsForBook(book), [book]);

  // 2. Editorial Diagnostic Gaps Engine
  const gapWarnings = useMemo(
    () => detectCurriculumGaps(book, profileRequirements, bookMappings, topics),
    [book, profileRequirements, bookMappings, topics]
  );

  // 3. Granular Metrics Calculation
  const totalReqs = profileRequirements.length;

  const verifiedReqs = useMemo(() => {
    return profileRequirements.filter((r) => {
      if (r.evidenceStatus === 'Verified' || r.verificationStatus === 'VERIFIED') return true;
      const m = bookMappings.find((bm) => bm.requirementId === r.id || bm.requirementCode === r.code);
      return m && m.verificationStatus === 'verified';
    }).length;
  }, [profileRequirements, bookMappings]);

  const mappedReqs = useMemo(() => {
    return profileRequirements.filter((r) =>
      bookMappings.some((m) => m.requirementId === r.id || m.requirementCode === r.code)
    ).length;
  }, [profileRequirements, bookMappings]);

  const partiallyCoveredReqs = useMemo(() => {
    return profileRequirements.filter((r) =>
      bookMappings.some(
        (m) =>
          (m.requirementId === r.id || m.requirementCode === r.code) &&
          (m.coverageState === 'introduced' || m.coverageState === 'developing')
      )
    ).length;
  }, [profileRequirements, bookMappings]);

  const unmappedReqs = Math.max(0, totalReqs - mappedReqs);

  const assessedReqs = useMemo(() => {
    return profileRequirements.filter((r) =>
      bookMappings.some(
        (m) =>
          (m.requirementId === r.id || m.requirementCode === r.code) &&
          (m.coverageState === 'assessed' ||
            m.coverageState === 'mastered' ||
            m.assessmentQuestionId ||
            m.evidence.some((e) => e.type === 'assessment' || e.componentId === 'comp-21'))
      )
    ).length;
  }, [profileRequirements, bookMappings]);

  const needsReviewCount = useMemo(() => {
    return bookMappings.filter(
      (m) => m.verificationStatus === 'needs_academic_review' || m.verificationStatus === 'not_checked'
    ).length;
  }, [bookMappings]);

  const mappedCoveragePct = totalReqs > 0 ? Math.round((mappedReqs / totalReqs) * 100) : 0;
  const verifiedCoveragePct = totalReqs > 0 ? Math.round((verifiedReqs / totalReqs) * 100) : 0;

  // Available strands for filter
  const uniqueStrands = useMemo(() => {
    const s = new Set<string>();
    profileRequirements.forEach((r) => {
      if (r.strand) s.add(r.strand);
    });
    return Array.from(s);
  }, [profileRequirements]);

  // Filtered requirements list
  const filteredRequirements = useMemo(() => {
    return profileRequirements.filter((req) => {
      if (filterStrand !== 'all' && req.strand !== filterStrand) return false;
      const mapped = bookMappings.find((m) => m.requirementId === req.id || m.requirementCode === req.code);

      if (filterStatus === 'verified') {
        if (req.evidenceStatus !== 'Verified' && req.verificationStatus !== 'VERIFIED' && mapped?.verificationStatus !== 'verified') return false;
      } else if (filterStatus === 'review') {
        if (req.evidenceStatus !== 'Needs Academic Review' && req.verificationStatus !== 'NEEDS ACADEMIC REVIEW' && mapped?.verificationStatus !== 'needs_academic_review')
          return false;
      } else if (filterStatus === 'unmapped') {
        if (mapped) return false;
      } else if (filterStatus === 'mapped') {
        if (!mapped) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = req.code.toLowerCase().includes(q);
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesDesc = req.description.toLowerCase().includes(q);
        const matchesSubStrand = req.subStrand ? req.subStrand.toLowerCase().includes(q) : false;
        if (!matchesCode && !matchesTitle && !matchesDesc && !matchesSubStrand) return false;
      }

      return true;
    });
  }, [profileRequirements, bookMappings, filterStrand, filterStatus, searchQuery]);

  // Heatmap generation per chapter (strictly derived from actual mappings)
  const getChapterHeatmapBlocks = (_chapterIndex: number, topicId: string) => {
    const mappingsForChapter = bookMappings.filter((m) => m.chapterId === topicId);
    const count = mappingsForChapter.length;
    const score = count > 0 ? Math.min(5, Math.max(1, count)) : 0;

    return {
      score,
      filledBlocks: '█'.repeat(score),
      emptyBlocks: '░'.repeat(5 - score),
      mappingsCount: count,
    };
  };

  const activeDetailTopic = topics.find((t) => t.id === selectedChapterForDetail);
  const activeDetailMappings = bookMappings.filter(
    (m) => m.chapterId === selectedChapterForDetail
  );

  const formattedClass = normalizeClassOrStage(book.classLevel || frameworkProfile.classOrStage, book.board);

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE BOARD & BOOK GOVERNANCE HEADER */}
      <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#CBBEAC]/60 pb-5">
          <div className="space-y-2">
            {/* Context Breadcrumbs / Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-[#5A1832] text-[#EDE4D6] flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>{terminology.systemName}</span>
              </span>

              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#2A121D]/10 dark:bg-[#C29A52]/15 text-[#5A1832] dark:text-[#C29A52] border border-[#5A1832]/20 dark:border-[#C29A52]/30">
                {frameworkProfile.programme}
              </span>

              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {formattedClass}
              </span>

              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                {book.academicYear || book.edition || frameworkProfile.academicYearOrEdition}
              </span>

              {/* Status Badge */}
              {totalReqs === 0 ? (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-200/80 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-300/60 dark:border-stone-700 flex items-center space-x-1">
                  <FileCheck className="w-3 h-3 text-stone-500" />
                  <span>UNVERIFIED / PENDING IMPORT</span>
                </span>
              ) : verifiedReqs === totalReqs && totalReqs > 0 ? (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>100% VERIFIED EVIDENCE</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/40 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>AI SUGGESTION — NEEDS REVIEW</span>
                </span>
              )}
            </div>

            {/* Book Title & Framework Document */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                {book.bookTitle || 'Curriculum Volume'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#71685E] dark:text-[#D8CCBC] mt-1">
                <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                  Framework:
                </span>
                <span>{frameworkProfile.curriculumDocument}</span>
                <span className="text-stone-400">•</span>
                <span className="font-mono text-[11px]">Ref: {frameworkProfile.syllabusReference}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onOpenCurriculumMapping && (
              <button
                type="button"
                onClick={onOpenCurriculumMapping}
                className="px-3.5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#EDE4D6] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Full Series Matrix</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C29A52]" />
              </button>
            )}
          </div>
        </div>

        {/* 6 System-Governed Intelligence KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Overall Mapped */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Mapped Coverage
            </span>
            <div className="text-2xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
              {mappedCoveragePct}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
              <div
                style={{ width: `${mappedCoveragePct}%` }}
                className="h-full bg-[#5A1832] dark:bg-[#C29A52] rounded-full"
              />
            </div>
            <span className="text-[10px] text-stone-500 font-mono block">
              {mappedReqs} of {totalReqs} {terminology.requirementPlural.toLowerCase()}
            </span>
          </div>

          {/* Card 2: Formally Verified */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Verified Evidence
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
              {verifiedReqs}
            </div>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-mono block">
              {verifiedCoveragePct}% signed off
            </span>
            <span className="text-[9px] text-stone-400 font-sans">
              Human editorial sign-off
            </span>
          </div>

          {/* Card 3: Partially Covered */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Developing
            </span>
            <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400">
              {partiallyCoveredReqs}
            </div>
            <span className="text-[10px] text-stone-500 font-mono block">
              Introduced / Drills
            </span>
          </div>

          {/* Card 4: Unmapped Gaps */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Unmapped Gaps
            </span>
            <div className={`text-2xl font-serif font-bold ${unmappedReqs > 0 ? 'text-rose-600' : 'text-stone-400'}`}>
              {unmappedReqs}
            </div>
            <span className="text-[10px] text-stone-500 font-mono block">
              Pending allocation
            </span>
          </div>

          {/* Card 5: Formally Assessed */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Assessed
            </span>
            <div className="text-2xl font-serif font-bold text-blue-700 dark:text-blue-400">
              {assessedReqs}
            </div>
            <span className="text-[10px] text-stone-500 font-mono block">
              In Mastery Tests
            </span>
          </div>

          {/* Card 6: Needs Academic Review */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-black/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#71685E] dark:text-[#A89C8F] block font-bold">
              Needs Review
            </span>
            <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-300">
              {needsReviewCount}
            </div>
            <span className="text-[10px] text-amber-800 dark:text-amber-400 font-mono block">
              AI Suggestion items
            </span>
          </div>
        </div>

        {/* Board vs Policy Statutory Separation Guidance */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 dark:text-amber-200 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <p className="font-semibold">
              Statutory System Separation Notice ({terminology.systemName}):
            </p>
            <p className="text-[11px] opacity-90">
              {terminology.policySeparationNote}
            </p>
            <p className="text-[10px] font-mono text-amber-900/80 dark:text-amber-300/80 pt-1">
              * Note: "100% compliant" status is reserved exclusively for records where evidence is verified by an accredited academic editor. Algorithmic mappings are designated as "AI Suggestion — Needs Review".
            </p>
          </div>
        </div>
      </div>

      {/* 2. EDITORIAL DIAGNOSTICS & GAP WARNINGS PANEL */}
      {gapWarnings.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/40 pb-3">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Curriculum Gap Warnings ({gapWarnings.length} Diagnostic Findings)
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                  AI suggestions identifying potential curricular deficits or verification gaps across this book project.
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/50">
              AI Suggestion — Needs Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gapWarnings.map((gap) => (
              <div
                key={gap.id}
                className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-black/20 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        gap.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
                          : gap.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300'
                      }`}
                    >
                      {gap.severity}
                    </span>

                    {gap.isAiSuggestion && (
                      <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI Suggestion — Needs Review</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                    {gap.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                    {gap.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 italic text-[10px]">
                    {gap.recommendation}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenChapterStudio(gap.affectedChapterId || topics[0]?.id)}
                    className="ml-2 text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline shrink-0 text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Resolve</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE CURRICULUM COVERAGE HEATMAP BY CHAPTER */}
      <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBBEAC]/60 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Chapter Curriculum Coverage Heatmap
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Click any chapter to inspect mapped requirements, pedagogical components, and direct evidence snippets.
            </p>
          </div>
          <div className="text-xs font-mono text-stone-500">
            Density: <span className="text-emerald-700 dark:text-emerald-400 font-bold">█████ (Optimal)</span> to{' '}
            <span className="text-stone-400">██░░░ (Developing)</span>
          </div>
        </div>

        <div className="space-y-2">
          {topics.map((topic, idx) => {
            const { score, filledBlocks, emptyBlocks, mappingsCount } = getChapterHeatmapBlocks(
              idx,
              topic.id
            );
            const isSelected = selectedChapterForDetail === topic.id;

            return (
              <div
                key={topic.id}
                onClick={() => setSelectedChapterForDetail(isSelected ? null : topic.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#5A1832] dark:border-[#C29A52] bg-white dark:bg-[#2A121D] shadow-xs ring-1 ring-[#5A1832]/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 bg-white/70 dark:bg-black/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-[#9A7438] dark:text-[#C29A52] w-20">
                    Chapter {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                      {topic.title}
                    </h4>
                    <span className="text-[11px] text-[#71685E] dark:text-[#A89C8F]">
                      {mappingsCount} {terminology.requirementPlural.toLowerCase()} mapped
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  {/* Visual Density Blocks */}
                  <div className="font-mono text-base tracking-widest">
                    <span className="text-emerald-600 dark:text-emerald-400">{filledBlocks}</span>
                    <span className="text-stone-300 dark:text-stone-700">{emptyBlocks}</span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {score * 20}%
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChapterStudio(topic.id);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. GRANULAR CHAPTER INSPECTION PANEL (Triggered by click) */}
      {activeDetailTopic && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#5A1832]/40 dark:border-[#C29A52]/40 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52]">
                Detailed Chapter Mapping Trace
              </span>
              <h3 className="text-lg font-serif font-bold text-[#191918] dark:text-[#F6F0E7]">
                {activeDetailTopic.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onOpenChapterStudio(activeDetailTopic.id)}
              className="px-3 py-1.5 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>Open in Chapter Studio</span>
              <ExternalLink className="w-3 h-3 text-[#C29A52]" />
            </button>
          </div>

          <div className="space-y-3">
            {activeDetailMappings.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 border border-dashed rounded-xl">
                No formal mappings registered for this chapter yet. Open in Chapter Studio to add requirement links.
              </div>
            ) : (
              activeDetailMappings.map((mapItem) => (
                <div
                  key={mapItem.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-black/20 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                        {mapItem.requirementCode}
                      </span>
                      <span className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
                        {mapItem.requirementTitle}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          mapItem.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {mapItem.verificationStatus === 'verified'
                          ? 'Verified'
                          : 'AI Suggestion — Needs Review'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedEvidenceMapping(mapItem)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-[#C29A52] flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#C29A52]" />
                        <span>Evidence ({mapItem.evidence.length})</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-stone-600 dark:text-stone-400">
                    <div>
                      <span className="text-[10px] font-mono text-[#71685E] block">Coverage State:</span>
                      <span className="font-semibold capitalize text-[#5A1832] dark:text-[#C29A52]">
                        {mapItem.coverageState}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#71685E] block">Architecture Component:</span>
                      <span>{mapItem.architectureComponentId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#71685E] block">Learning Objective:</span>
                      <span className="font-mono">{mapItem.learningObjectiveId || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#71685E] block">Depth Tier:</span>
                      <span className="truncate block">{mapItem.depth}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. COMPLETE PRESCRIBED REQUIREMENTS REPOSITORY TABLE */}
      <div className="p-6 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#CBBEAC]/60 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Prescribed {terminology.systemName} {terminology.requirementPlural} Repository
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Statutory syllabus citations for {formattedClass} ({frameworkProfile.academicYearOrEdition}).
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs w-48 focus:outline-hidden focus:border-[#5A1832]"
              />
            </div>

            <select
              value={filterStrand}
              onChange={(e) => setFilterStrand(e.target.value)}
              className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
            >
              <option value="all">All Strands</option>
              {uniqueStrands.map((strand) => (
                <option key={strand} value={strand}>
                  {strand}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Evidence</option>
              <option value="review">AI Suggestion — Needs Review</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
          </div>
        </div>

        {totalReqs === 0 ? (
          <div className="p-8 sm:p-10 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-black/10 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="max-w-md mx-auto space-y-1.5">
              <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
                No curriculum requirements have been verified for this book context yet.
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Statutory syllabus citations and prescribed learning outcomes have not yet been imported or verified for{' '}
                <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                  {terminology.systemName} {formattedClass}
                </span>{' '}
                ({book.bookTitle}).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenCurriculumMapping) onOpenCurriculumMapping();
                  else onOpenChapterStudio(topics[0]?.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <span>Add Curriculum Requirement</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCurriculumMapping) onOpenCurriculumMapping();
                  else onOpenChapterStudio(topics[0]?.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-[#C29A52] text-[#5A1832] dark:text-[#C29A52] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <span>Import Curriculum Framework</span>
              </button>

              {onOpenCurriculumMapping && (
                <button
                  type="button"
                  onClick={onOpenCurriculumMapping}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-[#5A1832] text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-[#9A7438]" />
                  <span>Open Curriculum Mapping</span>
                </button>
              )}
            </div>

            <div className="pt-2 text-[11px] font-mono text-stone-400 dark:text-stone-500">
              * Note: Fallback records from other grades or stages are strictly prohibited under VERITAS isolation standards.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-mono uppercase text-[#71685E]">
                <th className="py-2.5 px-3">Code &amp; Sub-Strand</th>
                <th className="py-2.5 px-3">Requirement Title &amp; Description</th>
                <th className="py-2.5 px-3">Strand</th>
                <th className="py-2.5 px-3">Cognitive Tier / Depth</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-stone-500 font-sans">
                    No requirements matched the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRequirements.map((req) => {
                  const mapped = bookMappings.find(
                    (m) => m.requirementId === req.id || m.requirementCode === req.code
                  );

                  return (
                    <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 align-top">
                        <div className="font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                          {req.code}
                        </div>
                        {req.subStrand && (
                          <span className="text-[10px] font-mono text-stone-500 block mt-0.5">
                            {req.subStrand}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top max-w-sm">
                        <div className="font-serif font-bold text-stone-900 dark:text-stone-100">
                          {req.title}
                        </div>
                        <p className="text-[11px] font-normal font-sans text-stone-500 mt-0.5 leading-snug">
                          {req.description}
                        </p>
                        {req.sourceReference && (
                          <div className="text-[10px] font-mono text-stone-400 mt-1">
                            Ref: {req.sourceReference}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top font-mono text-stone-600 dark:text-stone-400">
                        {req.strand}
                      </td>

                      <td className="py-3 px-3 align-top">
                        <span className="font-semibold text-stone-700 dark:text-stone-300 block">
                          {req.recommendedDepth}
                        </span>
                        <span className="text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52] uppercase">
                          {req.requirementType || 'Instructional'}
                        </span>
                      </td>

                      <td className="py-3 px-3 align-top">
                        {mapped ? (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Mapped ({mapped.coverageState})
                            </span>
                            <div>
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                                  mapped.verificationStatus === 'verified' || req.evidenceStatus === 'Verified' || req.verificationStatus === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300/40'
                                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/40'
                                }`}
                              >
                                {mapped.verificationStatus === 'verified' || req.evidenceStatus === 'Verified' || req.verificationStatus === 'VERIFIED'
                                  ? 'Verified'
                                  : 'AI Suggestion — Needs Review'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            Unmapped
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 align-top text-right">
                        {mapped ? (
                          <button
                            type="button"
                            onClick={() => setSelectedEvidenceMapping(mapped)}
                            className="text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline cursor-pointer"
                          >
                            View Evidence
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenChapterStudio(topics[0]?.id)}
                            className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
                          >
                            Assign to Chapter &rarr;
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Evidence Viewer Sub-modal */}
      <CurriculumEvidenceModal
        isOpen={!!selectedEvidenceMapping}
        onClose={() => setSelectedEvidenceMapping(null)}
        mapping={selectedEvidenceMapping}
        onOpenChapter={onOpenChapterStudio}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
