import React, { useState, useMemo } from 'react';
import {
  Split,
  FileCheck,
  History,
  ShieldCheck,
  Eye,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  ChevronUp,
} from 'lucide-react';
import { StudioChapter } from '../../types';
import { BookArchitectureConfig } from '../book-planner/architecture/types';
import { calculateChapterDerivedMetrics } from '../../utils/chapterMetrics';

export interface ChapterProductionDashboardHeaderProps {
  chapter: StudioChapter;
  architecture?: BookArchitectureConfig;
  activeStageId: string;
  onSelectStage: (stageId: any) => void;
  onOpenDiagrammer: () => void;
  onOpenTraceability: () => void;
  onOpenSnapshots: () => void;
  isDarkMode: boolean;
  onToggleCompact?: () => void;
  onToggleFocusMaximized?: () => void;
  isFocusMaximized?: boolean;
}

export const ChapterProductionDashboardHeader: React.FC<ChapterProductionDashboardHeaderProps> = ({
  chapter,
  architecture,
  activeStageId,
  onSelectStage,
  onOpenDiagrammer,
  onOpenTraceability,
  onOpenSnapshots,
  onToggleCompact,
  onToggleFocusMaximized,
  isFocusMaximized,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Derived metrics dynamically computed from the canonical chapter state
  const metrics = useMemo(
    () => calculateChapterDerivedMetrics(chapter, architecture),
    [chapter, architecture]
  );

  return (
    <div
      className="border-b border-[#CBBEAC] py-1.5 px-3 sm:px-4 shrink-0 shadow-2xs select-none bg-[#EDE4D6] text-[#292521] relative"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Chapter Identity & Board Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/40 flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-2xs">
            C{chapter.chapterNumber || 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A1832]">
                {chapter.systemId || 'CISCE'} • {chapter.equivalentClass || 'Class 6'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFFDF8] text-[#5A1832] border border-[#CBBEAC] font-mono font-semibold">
                {chapter.unitTitle ? (chapter.unitTitle.includes(':') ? chapter.unitTitle.split(':')[0] : chapter.unitTitle) : 'Unit 1'} • Ch {chapter.chapterNumber || 1}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-serif font-bold text-[#35101F] leading-tight truncate max-w-xs sm:max-w-sm md:max-w-md">
              {chapter.title || 'Untitled Chapter'}
            </h1>
          </div>
        </div>

        {/* Center: Live Production Metrics - Dynamic single source of truth */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-serif text-[#71685E]">
          <span className="font-medium text-[#292521]"><strong className="text-[#5A1832]">{metrics.rulesCount}</strong> {metrics.rulesCount === 1 ? 'Rule' : 'Rules'}</span>
          <span className="text-[#CBBEAC]">•</span>
          <span className="font-medium text-[#292521]"><strong className="text-[#5A1832]">{metrics.exercisesCount}</strong> {metrics.exerciseLettersDisplay}</span>
          <span className="text-[#CBBEAC]">•</span>
          <span className="font-medium text-[#292521]"><strong className="text-[#5A1832]">{metrics.wordCount}</strong> Words</span>
          <span className="text-[#CBBEAC]">•</span>
          <span className="font-medium text-[#292521]"><strong className="text-[#5A1832]">{metrics.blueprintCompletedCount}/{metrics.blueprintTotalCount}</strong> Blueprint</span>
          <span className="text-[#CBBEAC]">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${metrics.auditScore >= 80 ? 'text-emerald-700' : metrics.auditScore > 0 ? 'text-amber-700' : 'text-stone-400'}`} />
            <span className={`font-bold ${metrics.auditScore >= 80 ? 'text-emerald-800' : metrics.auditScore > 0 ? 'text-amber-800' : 'text-stone-500'}`}>
              {metrics.auditStatusDisplay}
            </span>
          </div>
        </div>

        {/* Right: Primary Action + More Dropdown + Focus & Compact Toggles */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectStage('student_preview')}
            title="View Real Textbook Layout"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#EDE4D6] text-xs font-bold border border-[#C29A52]/40 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Textbook View</span>
          </button>

          {/* More actions dropdown (Sentence Diagrammer, Traceability Matrix, Snapshots) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="More production tools"
              className="p-1 px-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#292521] border border-[#CBBEAC] shadow-2xs transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-[#5A1832]" />
              <span className="hidden sm:inline">More</span>
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-xl border border-[#CBBEAC] p-1.5 space-y-0.5 bg-[#FFFDF8] text-[#292521] z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenDiagrammer();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                >
                  <Split className="w-3.5 h-3.5 text-[#5A1832]" />
                  <span>Sentence Diagrammer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenTraceability();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Traceability Matrix</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenSnapshots();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-[#71685E]" />
                  <span>Version Snapshots</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Maximise (Focus Mode) button */}
          {onToggleFocusMaximized && (
            <button
              type="button"
              onClick={onToggleFocusMaximized}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isFocusMaximized
                  ? 'bg-[#5A1832] text-[#C29A52] border-[#5A1832]'
                  : 'bg-[#FFFDF8] text-[#71685E] hover:text-[#5A1832] border-[#CBBEAC] hover:bg-[#F6F0E7]'
              }`}
              title={isFocusMaximized ? 'Exit Maximized Focus (Restore sidebars)' : 'Maximize Authoring Surface (Collapse sidebars)'}
            >
              {isFocusMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Compact Header button */}
          {onToggleCompact && (
            <button
              type="button"
              onClick={onToggleCompact}
              className="p-1 rounded-lg bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#71685E] hover:text-[#5A1832] border border-[#CBBEAC] transition-colors cursor-pointer"
              title="Compact Header"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
