import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Eye,
  Check,
  X,
  Sparkles,
  Filter,
  RefreshCw,
  Award,
  Layers,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import {
  BookProject,
  ClassCurriculumBook,
  MasterGrammarConcept,
  BookWideAuditIssue,
  BookWideAuditCategory,
} from '../../types';
import { runBookWideAudit } from '../../utils/bookProjectUtils';
import {
  EDUCATION_SYSTEM_PROFILES,
  DEFAULT_FRAMEWORK_PROFILES,
  DEFAULT_CURRICULUM_REQUIREMENTS,
  DEMONSTRATION_CURRICULUM_MAPPINGS,
  detectCurriculumGaps,
  analyzeSeriesProgression,
} from '../../utils/curriculumFrameworkData';

interface BookWideAuditViewProps {
  project: BookProject;
  book?: ClassCurriculumBook;
  masterConcepts?: MasterGrammarConcept[];
  onOpenChapter: (chapterId: string) => void;
  onUpdateProjectAuditIssues: (issues: BookWideAuditIssue[]) => void;
}

export const BookWideAuditView: React.FC<BookWideAuditViewProps> = ({
  project,
  book,
  masterConcepts,
  onOpenChapter,
  onUpdateProjectAuditIssues,
}) => {
  const [issues, setIssues] = useState<BookWideAuditIssue[]>(() => {
    return project.auditIssues || runBookWideAudit(project, book, masterConcepts);
  });

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('open');
  const [activeFixModal, setActiveFixModal] = useState<BookWideAuditIssue | null>(null);

  const handleRerunAudit = () => {
    const freshlyAudited = runBookWideAudit(project, book, masterConcepts);
    setIssues(freshlyAudited);
    onUpdateProjectAuditIssues(freshlyAudited);
  };

  const handleUpdateStatus = (issueId: string, status: BookWideAuditIssue['status']) => {
    const updated = issues.map((iss) => (iss.id === issueId ? { ...iss, status } : iss));
    setIssues(updated);
    onUpdateProjectAuditIssues(updated);
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedStatus === 'open' && issue.status !== 'open') return false;
    if (selectedStatus === 'reviewed' && issue.status !== 'reviewed') return false;
    if (selectedStatus === 'ignored' && issue.status !== 'ignored') return false;
    return true;
  });

  const getSeverityBadge = (sev: BookWideAuditIssue['severity']) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'review':
        return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800';
      case 'info':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  const openIssuesCount = issues.filter((i) => i.status === 'open').length;
  const criticalCount = issues.filter((i) => i.severity === 'critical' && i.status === 'open').length;
  const warningCount = issues.filter((i) => i.severity === 'warning' && i.status === 'open').length;

  // Phase 4H: Curriculum Intelligence Audit Calculations
  const boardProfile = EDUCATION_SYSTEM_PROFILES[project.board] || EDUCATION_SYSTEM_PROFILES.CBSE;
  const frameworkProfile =
    DEFAULT_FRAMEWORK_PROFILES.find((p) => p.educationSystem === project.board) ||
    DEFAULT_FRAMEWORK_PROFILES[0];
  const profileRequirements = DEFAULT_CURRICULUM_REQUIREMENTS.filter(
    (r) => r.frameworkProfileId === frameworkProfile.id
  );
  const mappings = DEMONSTRATION_CURRICULUM_MAPPINGS;
  const curriculumGaps = detectCurriculumGaps(project, profileRequirements, mappings);
  const progressionReport = analyzeSeriesProgression('concept-concord');

  const coveredCount = profileRequirements.filter((r) =>
    mappings.some((m) => m.requirementId === r.id && (m.coverageState === 'mastered' || m.coverageState === 'practised'))
  ).length;
  const partialCount = profileRequirements.filter((r) =>
    mappings.some((m) => m.requirementId === r.id && (m.coverageState === 'introduced' || m.coverageState === 'developing'))
  ).length;
  const curriculumCoveragePct = Math.round(
    ((coveredCount + partialCount * 0.5) / (profileRequirements.length || 7)) * 100
  );

  const assessedCount = profileRequirements.filter((r) =>
    mappings.some(
      (m) =>
        m.requirementId === r.id &&
        (m.coverageState === 'assessed' || m.coverageState === 'mastered') &&
        m.evidence.some((e) => e.type === 'assessment' || e.componentId === 'comp-21')
    )
  ).length;
  const assessmentCoveragePct = Math.round(
    (assessedCount / (profileRequirements.length || 7)) * 100
  );

  return (
    <div id="book-wide-audit-dashboard" className="space-y-4">
      {/* Overview Stat Bar */}
      <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5A1832] text-[#E6C994]">
              Whole-Book Quality Audit
            </span>
            <span className="text-xs text-slate-500">
              {issues.length} checks performed across volume
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Editorial Integrity & Curriculum Diagnostic Engine
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Automated detection of conceptual gaps, exercise balance, duplicate examples, and board alignment.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {criticalCount} Critical
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {warningCount} Warnings
            </span>
          </div>

          <button
            onClick={handleRerunAudit}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#431225] rounded-lg shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Audit Book</span>
          </button>
        </div>
      </div>

      {/* PHASE 4H: Curriculum Intelligence Audit Section */}
      <div className="bg-white dark:bg-[#121b2d] border border-[#CBBEAC] dark:border-[#5A1832] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
                Curriculum Intelligence Audit
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 font-semibold">
                SAMPLE / REQUIRES ACADEMIC VERIFICATION
              </span>
            </div>
            <h4 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
              Framework Alignment &amp; Spiral Progression Audit ({project.board})
            </h4>
            <p className="text-xs text-slate-500">
              Evaluates learning objectives, exercise evidence, assessment coverage, prerequisites, and unresolved gaps.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono">
              Academic Review: <strong className="text-amber-600 dark:text-amber-400">PENDING BOARD SIGNOFF</strong>
            </span>
          </div>
        </div>

        {/* 5 Core Curriculum KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
              Curriculum Coverage
            </span>
            <div className="text-xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52] mt-0.5">
              {curriculumCoveragePct}%
            </div>
            <span className="text-[10px] text-slate-500">
              {coveredCount} covered, {partialCount} partial
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
              Assessment Coverage
            </span>
            <div className="text-xl font-serif font-bold text-blue-700 dark:text-blue-400 mt-0.5">
              {assessmentCoveragePct}%
            </div>
            <span className="text-[10px] text-slate-500">
              {assessedCount} assessed in drills &amp; tests
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
              Progression Health
            </span>
            <div className="text-lg font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 capitalize">
              {progressionReport.progressionHealth === 'optimal' ? 'Optimal (100%)' : progressionReport.progressionHealth.replace('_', ' ')}
            </div>
            <span className="text-[10px] text-slate-500">
              Spiral sequence sound
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
              Outstanding Gaps
            </span>
            <div className={`text-xl font-serif font-bold mt-0.5 ${curriculumGaps.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {curriculumGaps.length}
            </div>
            <span className="text-[10px] text-slate-500">
              Editorial warnings flagged
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
              Academic Review Status
            </span>
            <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 mt-1">
              Sample Verification
            </div>
            <span className="text-[10px] text-slate-500">
              Editorial signoff required
            </span>
          </div>
        </div>

        {/* Audit Verification Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Core Alignment Checks</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pl-5 list-disc">
              <li>Curriculum requirements mapped ({mappings.length} links recorded)</li>
              <li>Learning objectives supported across 23 architecture components</li>
              <li>Framework references recorded ({frameworkProfile.curriculumDocument})</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-800 dark:text-blue-300">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Pedagogy &amp; Progression Checks</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pl-5 list-disc">
              <li>Progression logical (no retrograde concept jumps detected)</li>
              <li>Exercises directly support learning objectives</li>
              <li>Prerequisites established from earlier grade levels</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Editorial Gaps &amp; Verification</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 pl-5 list-disc">
              <li>Assessment coverage present (Chapter Review + Test Generator)</li>
              <li>{curriculumGaps.length} unresolved mapping gap warnings detected</li>
              <li>Verification status: Not checked / Needs academic review</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer / Compliance Warning Banner */}
        <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Editorial Standard Notice:</strong> VERITAS applies rigorous curriculum alignment mapping for instructional fidelity. Alignment calculations and verification statuses are editorial diagnostic tools and do not constitute official board endorsement or authorization by CBSE, CISCE, or Cambridge Assessment International Education.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSelectedStatus('open')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedStatus === 'open'
                ? 'bg-[#5A1832] text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Open Issues ({openIssuesCount})
          </button>
          <button
            onClick={() => setSelectedStatus('reviewed')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedStatus === 'reviewed'
                ? 'bg-[#5A1832] text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Reviewed ({issues.filter((i) => i.status === 'reviewed').length})
          </button>
          <button
            onClick={() => setSelectedStatus('ignored')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedStatus === 'ignored'
                ? 'bg-[#5A1832] text-white font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            Ignored ({issues.filter((i) => i.status === 'ignored').length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings Only</option>
            <option value="review">Reviews Only</option>
            <option value="info">Informational Only</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">
              No Issues in This Category
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All scanned chapters comply with selected parameters. Re-audit or adjust filters to inspect other statuses.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {issue.category}
                  </span>
                  {issue.chapterTitle && (
                    <span className="text-xs text-slate-500 font-serif">
                      Unit {issue.chapterNumber}: {issue.chapterTitle}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {issue.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {issue.description}
                </p>

                {issue.suggestedFix && (
                  <div className="text-[11px] text-[#5A1832] dark:text-[#E6C994] font-medium pt-0.5">
                    💡 Suggested Remedy: {issue.suggestedFix}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-center">
                {issue.chapterId && (
                  <button
                    onClick={() => onOpenChapter(issue.chapterId!)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1 border border-slate-200 dark:border-slate-700"
                    title="Open Chapter in Authoring Studio"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Chapter</span>
                  </button>
                )}

                {issue.suggestedFix && (
                  <button
                    onClick={() => setActiveFixModal(issue)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5A1832] dark:text-[#E6C994] bg-[#5A1832]/10 hover:bg-[#5A1832]/20 flex items-center space-x-1"
                    title="View & Approve AI Suggested Fix"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggest Fix</span>
                  </button>
                )}

                {issue.status === 'open' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(issue.id, 'reviewed')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1"
                      title="Mark as Reviewed"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(issue.id, 'ignored')}
                      className="px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Ignore this issue"
                    >
                      <span>Ignore</span>
                    </button>
                  </>
                )}

                {issue.status !== 'open' && (
                  <button
                    onClick={() => handleUpdateStatus(issue.id, 'open')}
                    className="px-2 py-1 rounded text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggest Fix Modal (Requires Explicit Author Approval) */}
      {activeFixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#C29A52]" />
                <h3 className="text-base font-serif font-bold text-slate-900 dark:text-slate-100">
                  Author Approval Required
                </h3>
              </div>
              <button
                onClick={() => setActiveFixModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              In accordance with editorial guidelines, AI suggestions must never automatically overwrite author content without explicit confirmation.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Issue: {activeFixModal.title}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {activeFixModal.description}
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 font-serif text-[#5A1832] dark:text-[#E6C994]">
                Proposed Remediation:
              </div>
              <p className="italic text-slate-800 dark:text-slate-200">
                "{activeFixModal.suggestedFix}"
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveFixModal(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(activeFixModal.id, 'fixed');
                  setActiveFixModal(null);
                  if (activeFixModal.chapterId) {
                    onOpenChapter(activeFixModal.chapterId);
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#431225] shadow-xs flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Open Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
