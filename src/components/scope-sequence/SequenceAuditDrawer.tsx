import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Check,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ScopeSequenceAuditFinding, AuditSeverityLevel } from '../../types';

interface SequenceAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  findings: ScopeSequenceAuditFinding[];
  onUpdateFindingStatus: (
    findingId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'DEFERRED'
  ) => void;
  onNavigateToRow?: (rowId: string) => void;
  isDarkMode?: boolean;
}

export const SequenceAuditDrawer: React.FC<SequenceAuditDrawerProps> = ({
  isOpen,
  onClose,
  findings,
  onUpdateFindingStatus,
  onNavigateToRow,
  isDarkMode = false,
}) => {
  const [severityFilter, setSeverityFilter] = useState<AuditSeverityLevel | 'ALL'>('ALL');

  if (!isOpen) return null;

  const filteredFindings = findings.filter((f) => {
    if (severityFilter === 'ALL') return true;
    return f.severity === severityFilter;
  });

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL' && f.authorAction === 'PENDING').length;
  const reviewCount = findings.filter((f) => f.severity === 'REVIEW' && f.authorAction === 'PENDING').length;
  const suggestionCount = findings.filter((f) => f.severity === 'SUGGESTION' && f.authorAction === 'PENDING').length;

  const getSeverityBadge = (sev: AuditSeverityLevel) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'SUGGESTION':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'INFORMATION':
        return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#FAF8F5] dark:bg-[#1c1917] border-l border-[#C29A52]/40 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#5A1832] text-white border-b border-[#C29A52]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
                Sequence Intelligence
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                AI SUGGESTED — UNVERIFIED
              </span>
            </div>
            <h2 className="text-base font-serif font-bold text-[#F6F0E7]">
              Curriculum Audit & Gap Engine
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-[#F0EBE0] dark:bg-[#262220] border-b border-[#C29A52]/20 text-xs text-center">
        <div className="p-2 rounded bg-white dark:bg-[#1c1917] border border-[#C29A52]/20">
          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 block">Critical Issues</span>
          <span className="text-sm font-bold font-mono text-red-800 dark:text-red-300">{criticalCount}</span>
        </div>
        <div className="p-2 rounded bg-white dark:bg-[#1c1917] border border-[#C29A52]/20">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block">Review Flags</span>
          <span className="text-sm font-bold font-mono text-amber-800 dark:text-amber-300">{reviewCount}</span>
        </div>
        <div className="p-2 rounded bg-white dark:bg-[#1c1917] border border-[#C29A52]/20">
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 block">Suggestions</span>
          <span className="text-sm font-bold font-mono text-blue-800 dark:text-blue-300">{suggestionCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-5 py-2.5 border-b border-[#C29A52]/20 bg-white/60 dark:bg-[#1c1917]/60 text-xs overflow-x-auto">
        <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] mr-1">Filter:</span>
        {(['ALL', 'CRITICAL', 'REVIEW', 'SUGGESTION'] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setSeverityFilter(lvl)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
              severityFilter === lvl
                ? 'bg-[#5A1832] text-white font-bold'
                : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#C29A52]/10'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-12 text-[#71685E] dark:text-[#c9b9a6]">
            <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600 mb-2 opacity-80" />
            <p className="text-sm font-serif font-bold">No active issues found</p>
            <p className="text-xs mt-1">
              The Scope & Sequence meets the current curriculum and dependency validation criteria.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isPending = finding.authorAction === 'PENDING';

            return (
              <div
                key={finding.id}
                className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className="text-[10px] font-mono text-[#71685E] dark:text-[#c9b9a6] uppercase">
                      {finding.category.replace('_', ' ')}
                    </span>
                  </div>

                  {!isPending && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        finding.authorAction === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : finding.authorAction === 'REJECTED'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {finding.authorAction}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#292521] dark:text-[#F6F0E7]">
                    {finding.title}
                  </h4>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-1">
                    {finding.description}
                  </p>
                </div>

                {finding.recommendation && (
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20 text-xs">
                    <span className="font-bold text-[#5A1832] dark:text-[#C29A52] block mb-0.5">
                      Recommendation:
                    </span>
                    <p className="text-[#71685E] dark:text-[#c9b9a6]">{finding.recommendation}</p>
                  </div>
                )}

                {/* Author Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#C29A52]/20 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdateFindingStatus(finding.id, 'ACCEPTED')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition"
                      title="Accept recommendation into manuscript plan"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateFindingStatus(finding.id, 'DEFERRED')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#C29A52]/40 text-[#292521] dark:text-[#F6F0E7] text-[11px] hover:bg-[#C29A52]/10 transition"
                      title="Defer for subsequent review"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Defer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateFindingStatus(finding.id, 'REJECTED')}
                      className="px-2 py-1 rounded text-red-700 hover:bg-red-50 text-[11px] transition"
                      title="Reject and dismiss this finding"
                    >
                      Reject
                    </button>
                  </div>

                  {finding.relatedRowId && onNavigateToRow && (
                    <button
                      type="button"
                      onClick={() => onNavigateToRow(finding.relatedRowId!)}
                      className="text-[#5A1832] dark:text-[#C29A52] hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <span>Jump</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 bg-[#F0EBE0] dark:bg-[#262220] border-t border-[#C29A52]/30 text-xs text-[#71685E] dark:text-[#c9b9a6]">
        <p className="italic">
          "The software advises. The author decides."
        </p>
      </div>
    </div>
  );
};
