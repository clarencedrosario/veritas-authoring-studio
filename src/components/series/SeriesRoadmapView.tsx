import React, { useState, useMemo } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Globe2,
  BookOpen,
  Filter,
  Info,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import {
  BookProject,
  CurriculumSystemId,
  GrammarClassLevel,
  VeritasSeriesLevel,
  DevelopmentalBandId,
  GrammarSeriesProject,
} from '../../types';
import {
  VERITAS_SERIES_LEVELS,
  DEVELOPMENTAL_BANDS,
  getFullPortfolioRoadmap,
  runFullProgressionAudit,
  getDevelopmentalBandForLevel,
  PlannedBookPortfolioItem,
  ProgressionAuditFinding,
  classToVeritasLevel,
} from '../../utils/seriesArchitecture';
import { getDefaultCurriculumMatrix } from '../../utils/spiralMatrixData';

interface SeriesRoadmapViewProps {
  seriesProject: GrammarSeriesProject;
  activeBookProject: BookProject;
  allBookProjects: BookProject[];
  onSelectProject: (projectId: string) => void;
  onOpenBookPlanner?: (projectId?: string) => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
  onOpenCurriculumMapping?: () => void;
  onOpenScopeSequence?: () => void;
}

export const SeriesRoadmapView: React.FC<SeriesRoadmapViewProps> = ({
  seriesProject,
  activeBookProject,
  allBookProjects,
  onSelectProject,
  onOpenBookPlanner,
  onOpenChapterStudio,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
}) => {
  const [systemFilter, setSystemFilter] = useState<'ALL' | CurriculumSystemId>('ALL');
  const [bandFilter, setBandFilter] = useState<'ALL' | DevelopmentalBandId>('ALL');
  const [selectedItem, setSelectedItem] = useState<PlannedBookPortfolioItem | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Full roadmap items
  const fullRoadmap = useMemo(() => {
    return getFullPortfolioRoadmap(activeBookProject.id);
  }, [activeBookProject.id]);

  // Progression audit across the entire spiral matrix
  const auditFindings = useMemo(() => {
    const topics = seriesProject.curriculumMatrix?.topics || getDefaultCurriculumMatrix().topics;
    return runFullProgressionAudit(
      topics,
      systemFilter === 'ALL' ? undefined : systemFilter
    );
  }, [seriesProject.curriculumMatrix, systemFilter]);

  // Filtered portfolio
  const filteredRoadmap = useMemo(() => {
    return fullRoadmap.filter((item) => {
      if (systemFilter !== 'ALL' && item.system !== systemFilter) return false;
      if (bandFilter !== 'ALL' && item.developmentalBand.id !== bandFilter) return false;
      return true;
    });
  }, [fullRoadmap, systemFilter, bandFilter]);

  // Group by level
  const levelsToDisplay = useMemo(() => {
    if (bandFilter === 'ALL') return VERITAS_SERIES_LEVELS;
    return DEVELOPMENTAL_BANDS[bandFilter]?.seriesLevels || VERITAS_SERIES_LEVELS;
  }, [bandFilter]);

  // Find if an item is already initialized as a working BookProject
  const getExistingProject = (item: PlannedBookPortfolioItem): BookProject | undefined => {
    return allBookProjects.find((p) => {
      if (p.id === item.id) return true;
      const pLvl = p.veritasLevel || classToVeritasLevel(p.classLevel);
      return pLvl === item.veritasLevel && p.board === item.system;
    });
  };

  return (
    <div id="series-roadmap-root" className="space-y-6">
      {/* 1. Header Banner & Editorial Philosophy */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
              <Milestone className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Full Series Master Plan • 12-Level Publishing Continuum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              VERITAS 12-Level Graded English Publishing Architecture
            </h2>
            <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] max-w-3xl">
              Spans 5 developmental bands from Foundation (Classes 1–2) through Senior Secondary (Classes 11–12),
              governing parallel editions for <strong>CBSE</strong>, <strong>CISCE (ICSE / ISC)</strong>, and <strong>Cambridge International</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-run-progression-audit"
              onClick={() => setShowAuditModal(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-bold transition-all shadow-xs min-h-[40px]"
            >
              <ShieldCheck className="w-4 h-4 text-[#C29A52]" />
              <span>12-Level Progression Audit ({auditFindings.length} findings)</span>
            </button>

            {onOpenScopeSequence && (
              <button
                onClick={onOpenScopeSequence}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-xs font-semibold text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] transition-colors min-h-[40px]"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                <span>Scope &amp; Sequence Matrix</span>
              </button>
            )}
          </div>
        </div>

        {/* Core Principles Truth Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11.5px] border-t border-[#CBBEAC]/60 dark:border-[#4f2c3d]">
          <div className="flex items-start space-x-2 text-[#71685E] dark:text-[#c9b9a6]">
            <span className="font-bold text-[#5A1832] dark:text-[#C29A52] shrink-0">1. Core Linguistic Spine:</span>
            <span>Classes 1–12 share a unified developmental sequence, preventing duplicate re-introductions.</span>
          </div>
          <div className="flex items-start space-x-2 text-[#71685E] dark:text-[#c9b9a6]">
            <span className="font-bold text-[#5A1832] dark:text-[#C29A52] shrink-0">2. Real Class Separation:</span>
            <span>Preserves distinct CISCE Primary/Middle vs statutory ICSE (9–10) &amp; ISC (11–12) requirements.</span>
          </div>
          <div className="flex items-start space-x-2 text-[#71685E] dark:text-[#c9b9a6]">
            <span className="font-bold text-[#5A1832] dark:text-[#C29A52] shrink-0">3. Non-Equivalence Honesty:</span>
            <span>Cambridge stages are tracked as editorial progression mappings without asserting statutory equivalence.</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Board System:</span>
          </span>
          <div className="flex items-center rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] p-0.5 bg-[#EDE4D6] dark:bg-[#1e0f18] text-xs">
            {(['ALL', 'CBSE', 'CISCE', 'Cambridge'] as const).map((sys) => (
              <button
                key={sys}
                onClick={() => setSystemFilter(sys)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  systemFilter === sys
                    ? 'bg-[#5A1832] text-white shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
                }`}
              >
                {sys === 'ALL' ? 'All Boards (36 Volumes)' : sys}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6]">Developmental Band:</span>
          <select
            value={bandFilter}
            onChange={(e) => setBandFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] font-semibold"
          >
            <option value="ALL">All Bands (Foundation → Senior)</option>
            <option value="foundation">1. Foundation (Classes 1–2 / Ages 5–7)</option>
            <option value="primary">2. Primary (Classes 3–5 / Ages 7–10)</option>
            <option value="middle">3. Middle (Classes 6–8 / Ages 11–14)</option>
            <option value="secondary">4. Secondary (Classes 9–10 / Ages 14–16)</option>
            <option value="senior">5. Senior Secondary (Classes 11–12 / Ages 16–18)</option>
          </select>
        </div>
      </div>

      {/* 3. Developmental Continuum Grid */}
      <div className="space-y-6">
        {levelsToDisplay.map((lvl) => {
          const band = getDevelopmentalBandForLevel(lvl);
          const isFirstInBand = band.seriesLevels[0] === lvl;
          const itemsForLevel = filteredRoadmap.filter((item) => item.veritasLevel === lvl);

          if (itemsForLevel.length === 0) return null;

          return (
            <div key={lvl} className="space-y-3">
              {/* Band Divider when level starts a new band */}
              {isFirstInBand && (
                <div className="pt-3 pb-1">
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 rounded-md bg-[#5A1832] text-[#F6F0E7] text-[11px] font-mono font-bold tracking-wider uppercase">
                      {band.name} BAND
                    </div>
                    <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                      {band.nominalAgeRange}
                    </span>
                    <div className="flex-1 h-px bg-[#CBBEAC]/70 dark:bg-[#4f2c3d]" />
                  </div>
                  <p className="mt-1 text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] italic">
                    {band.description}
                  </p>
                </div>
              )}

              {/* Level Heading */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                    Level {lvl} (Class {lvl})
                  </span>
                  <span className="text-[11px] font-mono text-[#9A7438] dark:text-[#C29A52]">
                    • 3 Parallel Board Implementations
                  </span>
                </div>
              </div>

              {/* 3-Column Board Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {itemsForLevel.map((item) => {
                  const existingProj = getExistingProject(item);
                  const isWorkingActive = existingProj?.id === activeBookProject.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isWorkingActive
                          ? 'border-[#5A1832] dark:border-[#C29A52] bg-white dark:bg-[#35101F]/30 ring-2 ring-[#5A1832]/20 shadow-sm'
                          : existingProj
                          ? 'border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] hover:border-[#9A7438]'
                          : 'border-[#CBBEAC]/60 dark:border-[#4f2c3d]/60 bg-[#F6F0E7]/60 dark:bg-[#2b1622]/40'
                      }`}
                    >
                      <div>
                        {/* Top System Tag & Status */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-bold font-mono uppercase tracking-wider ${
                              item.system === 'CBSE'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                : item.system === 'CISCE'
                                ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {item.system} • {item.officialLabel}
                          </span>

                          {isWorkingActive ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#5A1832] text-[#F6F0E7] text-[10px] font-bold font-mono uppercase flex items-center space-x-1">
                              <Sparkles className="w-3 h-3 text-[#C29A52]" />
                              <span>Active Volume</span>
                            </span>
                          ) : existingProj ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                              {existingProj.status}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 text-[10px] font-mono">
                              {item.status}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-serif font-bold text-[14px] text-[#35101F] dark:text-[#F6F0E7] leading-snug">
                          {item.bookTitle}
                        </h3>
                        <p className="text-[12px] text-[#71685E] dark:text-[#c9b9a6] mt-1 line-clamp-2 leading-relaxed">
                          {item.subtitle}
                        </p>

                        {/* Programme info */}
                        <div className="mt-3 pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d]/50 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-[#71685E] dark:text-[#c9b9a6]">
                            <span>Programme:</span>
                            <span className="font-medium text-[#292521] dark:text-[#F6F0E7] truncate max-w-[180px]">
                              {item.programmeName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[#71685E] dark:text-[#c9b9a6]">
                            <span>Assessment Base:</span>
                            <span
                              className={`font-mono text-[10px] font-semibold ${
                                item.integrityStatus === 'VERIFIED BOARD SPECIFICATION'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-[#9A7438] dark:text-[#C29A52]'
                              }`}
                            >
                              {item.integrityStatus === 'VERIFIED BOARD SPECIFICATION' ? 'Verified Board Spec' : 'Editorial Model'}
                            </span>
                          </div>

                          {item.isEditorialMapping && (
                            <div className="p-1.5 bg-[#EDE4D6] dark:bg-[#1e0f18] rounded text-[10px] text-[#71685E] dark:text-[#c9b9a6] flex items-start space-x-1">
                              <Info className="w-3 h-3 text-[#9A7438] shrink-0 mt-0.5" />
                              <span>Editorial mapping; not a statutory board equivalence.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d]/40 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-[11.5px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] underline"
                        >
                          Specs &amp; Pedagogy
                        </button>

                        {existingProj ? (
                          isWorkingActive ? (
                            <button
                              onClick={() => {
                                if (onOpenChapterStudio) onOpenChapterStudio();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11.5px] font-bold hover:bg-[#35101F] transition-colors flex items-center space-x-1 shadow-2xs"
                            >
                              <span>Enter Chapter Studio</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectProject(existingProj.id)}
                              className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] text-[11.5px] font-semibold hover:bg-[#EDE4D6] transition-colors flex items-center space-x-1"
                            >
                              <span>Switch to Volume</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-[#C29A52] hover:bg-[#A8813C] text-slate-950 text-[11.5px] font-bold transition-colors shadow-2xs"
                          >
                            <span>Inspect &amp; Plan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Detail Modal for Planned Book Specification */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#F6F0E7] dark:bg-[#24131d] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-white dark:bg-[#2b1622]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#9A7438] dark:text-[#C29A52]">
                  {selectedItem.system} • Level {selectedItem.veritasLevel} ({selectedItem.officialLabel})
                </span>
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  {selectedItem.bookTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#292521] dark:text-[#F6F0E7] max-h-[70vh] overflow-y-auto">
              <div className="p-3.5 bg-white dark:bg-[#1e0f18] rounded-xl border border-[#CBBEAC]/70 dark:border-[#4f2c3d] space-y-1.5">
                <div className="font-bold text-[#5A1832] dark:text-[#C29A52] text-sm">
                  Developmental Band: {selectedItem.developmentalBand.name} ({selectedItem.developmentalBand.nominalAgeRange})
                </div>
                <p className="text-[12px] text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  {selectedItem.developmentalBand.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#35101F] dark:text-[#F6F0E7] mb-2 uppercase tracking-wider text-[11px]">
                  Pedagogical Focus at this Continuum Level
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedItem.developmentalBand.pedagogicalFocus.map((focus, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white/70 dark:bg-[#1e0f18]/60 border border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex items-start space-x-2 text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#35101F] dark:text-[#F6F0E7] mb-2 uppercase tracking-wider text-[11px]">
                  Assessment Architecture Focus
                </h4>
                <div className="p-3 bg-white dark:bg-[#1e0f18] rounded-xl border border-[#CBBEAC]/70 dark:border-[#4f2c3d] space-y-1.5">
                  <div className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                    Status: {selectedItem.integrityStatus}
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#71685E] dark:text-[#c9b9a6] text-[11.5px]">
                    {selectedItem.developmentalBand.assessmentFocus.map((af, idx) => (
                      <li key={idx}>{af}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedItem.editorialDisclaimer && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-[11px]">
                  <span className="font-bold">Editorial Integrity Note: </span>
                  {selectedItem.editorialDisclaimer}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#71685E] hover:text-[#292521]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Progression Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#F6F0E7] dark:bg-[#24131d] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden my-8">
            <div className="p-5 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-white dark:bg-[#2b1622]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#C29A52]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                    12-Level Vertical Progression &amp; Spiral Audit
                  </h3>
                  <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                    Automated editorial verification of continuity, re-introduction, and developmental scaffolding.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto text-xs">
              {auditFindings.length === 0 ? (
                <div className="p-6 text-center text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-300">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <div className="font-bold text-sm">Clean Spiral Progression!</div>
                  <p className="text-xs mt-1">
                    No progression regressions, premature gaps, or excessive re-introductions detected across the 12-level curriculum continuum.
                  </p>
                </div>
              ) : (
                auditFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`p-3.5 rounded-xl border space-y-1.5 ${
                      finding.severity === 'high'
                        ? 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                        : finding.severity === 'medium'
                        ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                        : 'border-[#CBBEAC] bg-white dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            finding.severity === 'high'
                              ? 'bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100'
                              : finding.severity === 'medium'
                              ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                              : 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {finding.findingType.replace(/_/g, ' ')}
                        </span>
                        <span className="font-bold text-[13px]">{finding.title}</span>
                      </div>
                      <span className="font-mono text-[10.5px] opacity-75">{finding.topicTitle}</span>
                    </div>
                    <p className="text-[12px] opacity-90 leading-relaxed">{finding.description}</p>
                    <div className="text-[11.5px] font-semibold text-[#5A1832] dark:text-[#C29A52] pt-1">
                      Recommendation: {finding.recommendation}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#2b1622] flex items-center justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold hover:bg-[#35101F]"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
