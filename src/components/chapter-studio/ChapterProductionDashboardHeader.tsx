import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ChevronDown,
  Plus,
  BookOpen,
  Check,
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
  chapters?: { id: string; order: number; title: string; category?: string }[];
  activeChapterId?: string;
  onSelectChapter?: (id: string) => void;
  onAddChapter?: () => void;
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
  chapters = [],
  activeChapterId,
  onSelectChapter,
  onAddChapter,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const chapterMenuRef = useRef<HTMLDivElement>(null);

  // Close chapter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chapterMenuRef.current && !chapterMenuRef.current.contains(e.target as Node)) {
        setShowChapterMenu(false);
      }
    };
    if (showChapterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChapterMenu]);

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
        {/* Left: Chapter Identity & Switcher Dropdown */}
        <div className="flex items-center gap-2 min-w-0" ref={chapterMenuRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowChapterMenu(!showChapterMenu)}
              className="flex items-center gap-2 p-1 -m-1 rounded-xl hover:bg-[#CBBEAC]/30 transition-colors text-left cursor-pointer group"
              title="Click to switch chapters or add new chapter"
            >
              <div className="w-7 h-7 rounded-lg bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/40 flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
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
                  <ChevronDown className="w-3 h-3 text-[#71685E] group-hover:text-[#5A1832]" />
                </div>
                <h1 className="text-xs sm:text-sm font-serif font-bold text-[#35101F] leading-tight truncate max-w-xs sm:max-w-sm md:max-w-md">
                  {chapter.title || 'Untitled Chapter'}
                </h1>
              </div>
            </button>

            {/* Chapter Switcher Dropdown */}
            {showChapterMenu && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] p-2 z-50 text-[#292521] animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-[#CBBEAC]/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5A1832] uppercase tracking-wider">
                    Book Chapters ({chapters.length > 0 ? chapters.length : 1})
                  </span>
                  {onAddChapter && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowChapterMenu(false);
                        onAddChapter();
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5A1832] text-[#FFFDF8] text-[10px] font-bold hover:bg-[#35101F] shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-[#C29A52]" />
                      <span>Add Chapter</span>
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {chapters.map((ch, idx) => {
                    const isSelected = ch.id === activeChapterId || ch.order === chapter.chapterNumber;
                    return (
                      <button
                        key={ch.id || idx}
                        type="button"
                        onClick={() => {
                          setShowChapterMenu(false);
                          onSelectChapter?.(ch.id);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#EDE4D6] text-[#5A1832] font-bold'
                            : 'hover:bg-[#F6F0E7] text-[#292521]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded bg-[#5A1832]/10 text-[#5A1832] font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                            {ch.order || idx + 1}
                          </span>
                          <span className="truncate">{ch.title}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5A1832] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {onAddChapter && (
                  <div className="pt-1.5 border-t border-[#CBBEAC]/60">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChapterMenu(false);
                        onAddChapter();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 text-[#5A1832] flex items-center space-x-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                      <span>+ Add New Chapter to Book</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Direct Add Chapter shortcut button */}
          {onAddChapter && (
            <button
              type="button"
              onClick={onAddChapter}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#5A1832] text-xs font-bold border border-[#CBBEAC] shadow-2xs transition-colors cursor-pointer"
              title="Add a new chapter to this book project (no chapter limits)"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span className="text-[11px]">Chapter</span>
            </button>
          )}
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
