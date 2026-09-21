// =============================================================
// VERITAS Editorial Platform — Exercise Quality Audit Modal
// Section 11: 22-point publisher quality & pedagogy diagnostic audit
// =============================================================

import React, { useState } from 'react';
import {
  StudioChapter,
  ExerciseAuditIssue,
  ExerciseAuditSeverity,
} from '../../../types';
import {
  runExerciseQualityAudit,
  ExerciseQualityAuditResult,
} from '../../../utils/exerciseStudioDefaults';
import {
  ShieldCheck,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  Info,
} from 'lucide-react';

interface ExerciseQualityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onJumpToExercise?: (letter: string) => void;
}

export const ExerciseQualityAuditModal: React.FC<ExerciseQualityAuditModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onJumpToExercise,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const audit: ExerciseQualityAuditResult = runExerciseQualityAudit(chapter);

  const filteredFindings =
    severityFilter === 'ALL'
      ? audit.findings
      : audit.findings.filter((f) => f.severity === severityFilter);

  return (
    <div className="fixed inset-0 z-50 bg-[#292521]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border-2 border-[#8C2435] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden font-serif">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8C2435] to-[#6E1C2A] text-[#FAF7F2] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="text-base font-bold tracking-wide">
                VERITAS Exercise Quality Audit (22-Point Standard)
              </h2>
              <p className="text-xs text-[#EADDC9]">
                Academic publishing integrity, cognitive balance & pedagogy inspection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#EADDC9] hover:text-white hover:bg-white/10 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Summary Banner */}
        <div className="bg-[#FAF7F2] p-5 border-b border-[#D8CBB9] space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-[#FFFDF9] p-3 rounded border border-[#DDD0BC]">
              <div className="text-[10px] uppercase font-bold text-[#7A6E5F]">Overall Health</div>
              <div className="text-2xl font-bold text-[#8C2435]">
                {audit.overallHealthScore}/100
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-3 rounded border border-[#DDD0BC]">
              <div className="text-[10px] uppercase font-bold text-[#7A6E5F]">Checks Passed</div>
              <div className="text-2xl font-bold text-emerald-700">
                {audit.passedChecks} / 22
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-3 rounded border border-[#DDD0BC]">
              <div className="text-[10px] uppercase font-bold text-[#7A6E5F]">Review Suggested</div>
              <div className="text-2xl font-bold text-amber-700">
                {audit.severityCounts.review_suggested}
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-3 rounded border border-[#DDD0BC]">
              <div className="text-[10px] uppercase font-bold text-[#7A6E5F]">Academic Review</div>
              <div className="text-2xl font-bold text-rose-700">
                {audit.severityCounts.needs_academic_review}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#615546] italic text-center">
            {audit.summaryText}
          </p>
        </div>

        {/* Findings Filter & List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-[#D8CBB9]">
            <span className="font-bold text-[#292521]">
              Audit Findings ({filteredFindings.length} Items)
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#7A6E5F]">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#DDD0BC] rounded px-2 py-1 text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="needs_academic_review">Needs Academic Review</option>
                <option value="potential_issue">Potential Issue</option>
                <option value="review_suggested">Review Suggested</option>
              </select>
            </div>
          </div>

          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center bg-[#EAF2DC] rounded-lg border border-[#C6DC9E] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#4D7C0F] mx-auto" />
              <h3 className="text-sm font-bold text-[#2E4A08]">No Audit Issues Found!</h3>
              <p className="text-xs text-[#4A6E1E] max-w-md mx-auto">
                All 22 quality checks verified cleanly. The chapter exercises satisfy the highest VERITAS editorial and pedagogical standards.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFindings.map((finding) => {
                const isCritical = finding.severity === 'needs_academic_review';
                const isPotential = finding.severity === 'potential_issue';

                return (
                  <div
                    key={finding.id}
                    className={`p-4 rounded-lg border space-y-2 text-xs transition-all ${
                      isCritical
                        ? 'bg-[#FDF3F3] border-rose-300'
                        : isPotential
                        ? 'bg-[#FFFDF7] border-amber-300'
                        : 'bg-[#FAF7F2] border-[#DDD0BC]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isCritical
                              ? 'bg-rose-700 text-white'
                              : isPotential
                              ? 'bg-amber-600 text-white'
                              : 'bg-[#7A6E5F] text-white'
                          }`}
                        >
                          #{finding.ruleNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[#292521]">
                          {finding.title}
                        </h4>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isPotential
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#EDE4D6] text-[#4A3F33]'
                        }`}
                      >
                        {finding.severity.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[#4A3F33] leading-relaxed pl-7">
                      {finding.description}
                    </p>

                    <div className="ml-7 p-2.5 bg-[#FFFDF9] rounded border border-[#DDD0BC] text-[#292521] space-y-1">
                      <div className="font-bold text-[11px] text-[#8C2435]">
                        Editorial Recommendation:
                      </div>
                      <p className="text-[11px]">{finding.recommendation}</p>
                    </div>

                    {finding.exerciseLetter && onJumpToExercise && (
                      <div className="pl-7 pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            onJumpToExercise(finding.exerciseLetter!);
                            onClose();
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#8C2435] hover:underline"
                        >
                          Jump to Exercise {finding.exerciseLetter} &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Publisher Mandatory Disclaimer */}
          <div className="p-3 bg-[#FAF7F2] rounded border border-[#D8CBB9] text-[11px] text-[#7A6E5F] leading-relaxed italic">
            <span className="font-bold not-italic text-[#615546]">Editorial Disclaimer: </span>
            {audit.disclaimer}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF7F2] border-t border-[#D8CBB9] p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#8C2435] text-white text-xs font-bold rounded hover:bg-[#721B2A] transition-all"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
