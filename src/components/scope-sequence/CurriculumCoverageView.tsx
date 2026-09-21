import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Award,
  Target,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ScopeSequenceMasterRow, CurriculumSystemId, GrammarClassLevel } from '../../types';
import { calculateCurriculumCoverage } from '../../utils/scopeSequenceData';

interface CurriculumCoverageViewProps {
  rows: ScopeSequenceMasterRow[];
  system: CurriculumSystemId;
  classLevel: GrammarClassLevel;
  onOpenRow?: (rowId: string) => void;
  isDarkMode?: boolean;
}

export const CurriculumCoverageView: React.FC<CurriculumCoverageViewProps> = ({
  rows,
  system,
  classLevel,
  onOpenRow,
  isDarkMode = false,
}) => {
  const coverage = calculateCurriculumCoverage(rows, system, classLevel);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
          Curriculum Standards Compliance
        </span>
        <h3 className="text-base font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
          Curriculum Coverage & Evidence Verification Audit
        </h3>
        <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
          Measures textbook alignment against prescribed syllabus frameworks for {system} ({classLevel}).
        </p>
      </div>

      {/* Primary Metrics Strip - Phase 4I Requirement 9 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Mapped Objectives */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
            Mapped Objectives
          </span>
          <span className="text-xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52] mt-1 block">
            {coverage.mappedObjectivesCount}
          </span>
          <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
            Total syllabus standards
          </span>
        </div>

        {/* Covered Objectives */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Covered Objectives
          </span>
          <span className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {coverage.coveredObjectivesCount}
          </span>
          <span className="text-[10px] text-emerald-600">
            Taught & assessed
          </span>
        </div>

        {/* Partially Covered */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            Partially Covered
          </span>
          <span className="text-xl font-serif font-bold text-amber-700 dark:text-amber-400 mt-1 block">
            {coverage.partiallyCoveredCount}
          </span>
          <span className="text-[10px] text-amber-600">
            Instruction without test
          </span>
        </div>

        {/* Not Yet Covered */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block">
            Not Yet Covered
          </span>
          <span className="text-xl font-serif font-bold text-red-700 dark:text-red-400 mt-1 block">
            {coverage.notYetCoveredCount}
          </span>
          <span className="text-[10px] text-red-600">
            Pending chapter draft
          </span>
        </div>

        {/* Needs Review */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
            Needs Review
          </span>
          <span className="text-xl font-serif font-bold text-purple-700 dark:text-purple-400 mt-1 block">
            {coverage.needsReviewCount}
          </span>
          <span className="text-[10px] text-purple-600">
            Academic audit queue
          </span>
        </div>

        {/* Verified Coverage */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm text-center">
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
            Verified Coverage
          </span>
          <span className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {coverage.verifiedAlignmentCount}
          </span>
          <span className="text-[10px] text-emerald-600 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Authoritative Source
          </span>
        </div>
      </div>

      {/* Dual Progress: CURRICULUM COVERAGE and VERIFIED ALIGNMENT as separate measures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider text-[11px]">
              Curriculum Coverage
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">
              {coverage.curriculumCoveragePercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${coverage.curriculumCoveragePercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
            Proportion of prescribed syllabus objectives mapped and instructionalized across chapters.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Alignment Index
            </span>
            <span className="font-mono text-[#5A1832] dark:text-[#C29A52]">
              {coverage.verifiedAlignmentPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5A1832] to-[#C29A52] transition-all duration-500"
              style={{ width: `${coverage.verifiedAlignmentPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
            Proportion with authenticated citations against official board curriculum frameworks.
          </p>
        </div>
      </div>

      {/* Two Column Breakdown: Covered vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Covered Chapters */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Covered Curriculum Competencies ({rows.length})
            </h4>
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
              SCHEDULED IN BOOK
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {rows.map((r) => (
              <div
                key={r.id}
                onClick={() => onOpenRow && onOpenRow(r.id)}
                className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20 flex items-center justify-between text-xs cursor-pointer hover:border-[#5A1832] transition"
              >
                <div>
                  <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                    {r.chapterTitle}
                  </span>
                  <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] font-mono">
                    {r.curriculumMappingCode} • {r.masteryStage}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {r.evidenceStatus === 'VERIFIED' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#71685E]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Topics & Audit Recommendations */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Uncovered or Deferred Prescriptions
            </h4>
            <span className="text-[10px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
              SYLLABUS GAPS
            </span>
          </div>

          {coverage.missingPrescribedTopics.length === 0 ? (
            <div className="p-8 text-center text-[#71685E] dark:text-[#c9b9a6]">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold">All Core Prescribed Standards Included in Scope</p>
              <p className="text-[11px] mt-1">
                All mandatory curriculum objectives for {system} ({classLevel}) have been assigned to discrete chapters.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {coverage.missingPrescribedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 dark:text-amber-200">{topic}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold">
                      REQUIRED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-1">
                    This syllabus standard is expected in {system} ({classLevel}) but has no assigned chapter in the current scope.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
