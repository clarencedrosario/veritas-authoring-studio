import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  FileCheck,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { BoardQuestionBlueprint, GrammarSeriesProject, BlueprintComprehensiveAuditResult } from '../../types';
import { runAssessmentBlueprintAudit } from '../../utils/boardBlueprintIntelligenceData';

interface BlueprintAuditModalProps {
  blueprint: BoardQuestionBlueprint;
  seriesProject: GrammarSeriesProject;
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintAuditModal: React.FC<BlueprintAuditModalProps> = ({
  blueprint,
  seriesProject,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const auditResult: BlueprintComprehensiveAuditResult = runAssessmentBlueprintAudit(
    blueprint,
    seriesProject
  );

  const getStatusBadge = (status: BlueprintComprehensiveAuditResult['overallAuditStatus']) => {
    if (status === 'PASS') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center space-x-1.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>PASS — AUDIT CERTIFIED</span>
        </span>
      );
    }
    if (status === 'SOURCE REQUIRED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center space-x-1.5 shadow-2xs">
          <AlertOctagon className="w-4 h-4" />
          <span>SOURCE EVIDENCE REQUIRED</span>
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white flex items-center space-x-1.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4" />
          <span>WARNING — ALLOCATION VARIANCE</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white flex items-center space-x-1.5 shadow-2xs">
        <ShieldAlert className="w-4 h-4" />
        <span>ACADEMIC REVIEW REQUIRED</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e0f18] rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d2b3b] flex items-center justify-between bg-[#F6F0E7] dark:bg-[#2b1622] shrink-0">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-[#5A1832] dark:text-[#C29A52]" />
            <div>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Blueprint Academic Audit Engine
              </h3>
              <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                {blueprint.title} ({blueprint.boardCode})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Banner */}
          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] block">
                Audit Compliance Rating
              </span>
              <div className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                Audit Verdict &amp; Evidence Validation
              </div>
            </div>
            <div>{getStatusBadge(auditResult.overallAuditStatus)}</div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Total Marks</span>
              <strong className="text-sm text-[#292521] dark:text-[#F6F0E7] font-mono">
                {auditResult.targetMarks}m
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Assigned Marks</span>
              <strong className="text-sm text-[#292521] dark:text-[#F6F0E7] font-mono">
                {auditResult.assignedMarks}m
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Mark Variance</span>
              <strong
                className={`text-sm font-mono ${
                  auditResult.marksMatch ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {auditResult.marksMatch ? '0m (Perfect)' : `${auditResult.targetMarks - auditResult.assignedMarks}m`}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-stone-500 block">Audit Score</span>
              <strong className="text-sm text-[#292521] dark:text-[#F6F0E7] font-mono">
                {auditResult.auditScore} / 100
              </strong>
            </div>
          </div>

          {/* Detailed Issues List */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
              Audit Findings &amp; Discrepancies ({auditResult.issues.length})
            </span>

            {auditResult.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  issue.severity === 'BLOCKING'
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                    : issue.severity === 'CRITICAL'
                    ? 'border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/10'
                    : issue.severity === 'WARNING'
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                    : 'border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        issue.severity === 'BLOCKING' || issue.severity === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : issue.severity === 'WARNING'
                          ? 'bg-amber-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <strong className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                      {issue.rule}
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    {issue.fieldTarget}
                  </span>
                </div>

                <p className="text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                  {issue.message}
                </p>

                <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] italic pt-1 border-t border-black/5 dark:border-white/5">
                  Recommendation: {issue.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] font-mono">
            VERITAS Academic Integrity &amp; Verification Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-white text-xs font-bold"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
