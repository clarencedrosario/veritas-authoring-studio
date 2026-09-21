import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Layers,
  ShieldCheck,
  ExternalLink,
  Info,
  Clock,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ScopeSequenceMasterRow } from '../../types';
import { validateHorizontalSequenceOrder } from '../../utils/scopeSequenceData';

interface HorizontalBookSequenceViewProps {
  rows: ScopeSequenceMasterRow[];
  onReorderRows: (newRows: ScopeSequenceMasterRow[]) => void;
  onOpenChapterPlan: (row: ScopeSequenceMasterRow) => void;
  onOpenChapterStudio?: (chapterId: string) => void;
  onOpenDependencyInspector?: (conceptId: string) => void;
  isDarkMode?: boolean;
}

export const HorizontalBookSequenceView: React.FC<HorizontalBookSequenceViewProps> = ({
  rows,
  onReorderRows,
  onOpenChapterPlan,
  onOpenChapterStudio,
  onOpenDependencyInspector,
  isDarkMode = false,
}) => {
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [pendingReorder, setPendingReorder] = useState<ScopeSequenceMasterRow[] | null>(null);

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const newRows = [...rows];
    const [moved] = newRows.splice(index, 1);
    newRows.splice(targetIndex, 0, moved);

    // Update seqNumbers
    const renumbered = newRows.map((r, i) => ({
      ...r,
      seqNumber: i + 1,
    }));

    // Run dependency check
    const checkResult = validateHorizontalSequenceOrder(renumbered);
    if (!checkResult.valid) {
      setActiveWarning(checkResult.warningMessage || 'Sequencing dependency conflict detected');
      setPendingReorder(renumbered);
    } else {
      setActiveWarning(null);
      setPendingReorder(null);
      onReorderRows(renumbered);
    }
  };

  const handleConfirmOverride = () => {
    if (pendingReorder) {
      onReorderRows(pendingReorder);
    }
    setActiveWarning(null);
    setPendingReorder(null);
  };

  const handleCancelReorder = () => {
    setActiveWarning(null);
    setPendingReorder(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sequence Warning Banner if dependency violated */}
      {activeWarning && (
        <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/60 shadow-lg animate-slideDown">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                Concept Dependency Prerequisite Notice
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">
                {activeWarning}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleConfirmOverride}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
                >
                  Override Warning & Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelReorder}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1c1917] border border-amber-600/40 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-amber-100/50 transition"
                >
                  Revert Order
                </button>
                {onOpenDependencyInspector && (
                  <button
                    type="button"
                    onClick={() => onOpenDependencyInspector('concept-concord')}
                    className="text-xs text-amber-900 dark:text-amber-300 underline font-semibold ml-2"
                  >
                    Inspect Dependency Map
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
            Instructional Flow
          </span>
          <h3 className="text-base font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
            Horizontal Book Sequence Roadmap
          </h3>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            Linear chapter delivery order for this volume. Reorder chapters with the arrows or click to inspect pedagogical plans.
          </p>
        </div>
        <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-mono font-bold">
          {rows.length} Planned Chapters
        </div>
      </div>

      {/* Horizontal / Grid Roadmap View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map((row, index) => {
          return (
            <div
              key={row.id}
              className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 hover:border-[#5A1832] dark:hover:border-[#C29A52] transition shadow-sm flex flex-col justify-between group"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5A1832] text-white text-xs font-mono font-bold flex items-center justify-center">
                      {row.seqNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] truncate max-w-[140px]">
                      {row.unitTitle}
                    </span>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveRow(index, 'up')}
                      className="p-1 rounded hover:bg-[#C29A52]/20 text-[#71685E] dark:text-[#c9b9a6] disabled:opacity-30"
                      title="Move earlier in sequence"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === rows.length - 1}
                      onClick={() => moveRow(index, 'down')}
                      className="p-1 rounded hover:bg-[#C29A52]/20 text-[#71685E] dark:text-[#c9b9a6] disabled:opacity-30"
                      title="Move later in sequence"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4
                  onClick={() => onOpenChapterPlan(row)}
                  className="text-sm font-serif font-bold text-[#5A1832] dark:text-[#C29A52] hover:underline cursor-pointer line-clamp-1"
                >
                  {row.chapterTitle}
                </h4>

                <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-2 mt-1">
                  {row.curriculumMappingDescription}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 text-[#5A1832] dark:text-[#C29A52]">
                    {row.depthLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/30 text-emerald-700 dark:text-emerald-400">
                    {row.masteryStage} ({row.masteryCode})
                  </span>
                  <span className="text-[10px] font-mono text-[#71685E] dark:text-[#c9b9a6] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {row.recommendedTeachingLessons}L
                  </span>
                  <span className="text-[10px] font-mono text-[#71685E] dark:text-[#c9b9a6] flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {row.estimatedPages}pp
                  </span>
                </div>
              </div>

              {/* Card Bottom / Actions */}
              <div className="pt-3 mt-3 border-t border-[#C29A52]/20 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenChapterPlan(row)}
                  className="font-bold text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center gap-1"
                >
                  <span>Chapter Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onOpenChapterStudio && (
                  <button
                    type="button"
                    onClick={() => onOpenChapterStudio(row.chapterId)}
                    className="p-1 rounded text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52] flex items-center gap-1 text-[11px]"
                    title="Open in Chapter Studio"
                  >
                    <span>Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
