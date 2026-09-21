import React from 'react';
import {
  X,
  FileText,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
  Eye,
} from 'lucide-react';
import { CoverageEvidence, CurriculumMapping } from '../../types';

interface CurriculumEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapping: CurriculumMapping | null;
  onOpenChapter?: (chapterId: string) => void;
  isDarkMode?: boolean;
}

export const CurriculumEvidenceModal: React.FC<CurriculumEvidenceModalProps> = ({
  isOpen,
  onClose,
  mapping,
  onOpenChapter,
  isDarkMode = false,
}) => {
  if (!isOpen || !mapping) return null;

  const getEvidenceTypeBadge = (type: CoverageEvidence['type']) => {
    switch (type) {
      case 'content_block':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'exercise':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'assessment':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'example':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'teacher_note':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200';
    }
  };

  return (
    <div
      id="curriculum-evidence-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="curriculum-evidence-modal"
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-[#181515] border-[#5A1832] text-[#EDE4D6]'
            : 'bg-[#FAF7F2] border-[#CBBEAC] text-[#292521]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center shadow-xs">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Curriculum Mapping Evidence
                </span>
                {mapping.isDemonstration && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                    AI Suggestion — Needs Review
                  </span>
                )}
              </div>
              <h3 className="text-base font-serif font-bold text-[#191918] dark:text-[#F6F0E7] mt-0.5">
                {mapping.requirementCode} • {mapping.requirementTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metadata banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl border border-inherit bg-white/60 dark:bg-black/20 text-xs">
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Coverage State
              </span>
              <span className="font-bold capitalize text-[#5A1832] dark:text-[#C29A52]">
                {mapping.coverageState.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Verification Status
              </span>
              <span className={`font-bold uppercase text-xs ${
                mapping.verificationStatus === 'verified'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {mapping.verificationStatus === 'needs_academic_review'
                  ? 'AI Suggestion — Needs Review'
                  : mapping.verificationStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Architecture Blueprint
              </span>
              <span className="font-semibold">{mapping.architectureComponentId}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Target Chapter
              </span>
              <span className="font-semibold truncate block">{mapping.chapterId}</span>
            </div>
          </div>

          {/* Evidence Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#A89C8F]">
              Direct Textual &amp; Component Evidence ({mapping.evidence.length} records)
            </h4>

            {mapping.evidence.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-xs text-stone-500">
                No direct evidence blocks linked yet. Add citations from the Chapter Studio.
              </div>
            ) : (
              mapping.evidence.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-4 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getEvidenceTypeBadge(
                          ev.type
                        )}`}
                      >
                        {ev.type.replace('_', ' ')}
                      </span>
                      {ev.componentName && (
                        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          {ev.componentName}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-stone-500">
                      {ev.chapterTitle} {ev.sectionTitle ? `• ${ev.sectionTitle}` : ''}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-black/30 border border-stone-200 dark:border-stone-800 font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200 italic">
                    "{ev.snippet}"
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <div className="flex items-center space-x-2">
                      {ev.exerciseId && (
                        <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          Exercise: {ev.exerciseId}
                        </span>
                      )}
                      {ev.questionId && (
                        <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          Item: {ev.questionId}
                        </span>
                      )}
                    </div>
                    {ev.pageNumberOrRef && <span>Ref: {ev.pageNumberOrRef}</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Academic Editorial Notes */}
          {mapping.notes && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-mono font-bold uppercase tracking-wider block">
                Editorial Review Note:
              </span>
              <p className="leading-relaxed">{mapping.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-500 font-mono">
            {mapping.verifiedBy ? (
              <span>Verified by {mapping.verifiedBy} on {mapping.verifiedAt}</span>
            ) : (
              <span>Pending Academic Verification</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onOpenChapter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChapter(mapping.chapterId);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <span>Open in Chapter Studio</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C29A52]" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
