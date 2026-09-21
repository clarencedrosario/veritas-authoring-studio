import React, { useState, useMemo } from 'react';
import {
  Search,
  Layers,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  X,
  BookOpen,
  AlertCircle,
  Sparkles,
  Info,
  Sliders,
} from 'lucide-react';
import {
  BoardQuestionBlueprint,
  CurriculumSystemId,
} from '../../types';
import {
  PUBLISHING_CURRICULUM_HIERARCHY,
  createEmptyBlueprintPlaceholder,
  createEditorialTemplateForClass,
} from '../../utils/boardBlueprintDirectory';
import { DirectoryErrorBoundary } from './DirectoryErrorBoundary';

interface HierarchicalBlueprintSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBlueprints: BoardQuestionBlueprint[];
  selectedBlueprintId: string;
  onSelectBlueprint: (blueprintId: string, customBlueprint?: BoardQuestionBlueprint) => void;
  activeBookBoard: string;
  activeBookClass: string;
  onCreateEditorialBlueprint?: (blueprint: BoardQuestionBlueprint) => void;
  onOpenCustomCreator?: (system: CurriculumSystemId, targetClass: string) => void;
}

export interface DirectoryItem {
  id: string;
  system: CurriculumSystemId | 'Custom';
  programme: string;
  classId: string;
  classLabel: string;
  hasFormalBoardExam: boolean;
  examNotes?: string;
  blueprint?: BoardQuestionBlueprint;
  status: 'VERIFIED BOARD SPECIFICATION' | 'VERITAS EDITORIAL MODEL' | 'CUSTOM / AUTHOR MODEL' | 'NO BLUEPRINT CREATED';
}

function matchesClass(bClass: string, targetId: string, targetLabel?: string): boolean {
  const normBp = (bClass || '').trim().toLowerCase();
  const normId = (targetId || '').trim().toLowerCase();
  const normLabel = (targetLabel || '').trim().toLowerCase();

  if (normBp === normId || (normLabel && normBp === normLabel)) return true;

  // Word boundary regex check: avoids "Class 1" matching "Class 10", "Class 11", "Class 12"
  const escaped = normId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(normBp);
}

export const HierarchicalBlueprintSelectorModal: React.FC<HierarchicalBlueprintSelectorModalProps> = ({
  isOpen,
  onClose,
  allBlueprints,
  selectedBlueprintId,
  onSelectBlueprint,
  activeBookBoard,
  activeBookClass,
  onCreateEditorialBlueprint,
  onOpenCustomCreator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'VERIFIED' | 'EDITORIAL' | 'NO_BLUEPRINT' | 'CUSTOM'>('ALL');

  // Build canonical directory items for all boards and stages
  const directoryItems = useMemo(() => {
    const items: DirectoryItem[] = [];
    const systemsList: CurriculumSystemId[] = ['CBSE', 'CISCE', 'Cambridge'];

    systemsList.forEach((sys) => {
      const progs = PUBLISHING_CURRICULUM_HIERARCHY[sys] || [];
      progs.forEach((prog) => {
        prog.classes.forEach((cls) => {
          // Find matching blueprint
          const match = allBlueprints.find((b) => {
            const bSys =
              b.systemId ||
              (b.board === 'ICSE' || b.board === 'CISCE' || b.board === 'ISC'
                ? 'CISCE'
                : b.board?.startsWith('Cambridge')
                ? 'Cambridge'
                : b.board);
            if (bSys !== sys) return false;

            const bStage = b.classOrStageOrQualification || '';
            const bTarget = b.targetClass || '';

            return (
              matchesClass(bStage, cls.id, cls.label) ||
              matchesClass(bTarget, cls.id, cls.label)
            );
          });

          if (match) {
            const isVerified =
              match.verificationStatus === 'VERIFIED BOARD SPECIFICATION' ||
              (!match.isEditorialModel && match.verificationStatus !== 'CURRICULUM-ALIGNED EDITORIAL MODEL');
            const isCustom =
              match.id.startsWith('custom_') || match.verificationStatus === 'CUSTOM / AUTHOR MODEL';

            items.push({
              id: match.id,
              system: sys,
              programme: prog.programme,
              classId: cls.id,
              classLabel: cls.label,
              hasFormalBoardExam: cls.hasFormalBoardExam,
              examNotes: cls.examNotes,
              blueprint: match,
              status: isVerified
                ? 'VERIFIED BOARD SPECIFICATION'
                : isCustom
                ? 'CUSTOM / AUTHOR MODEL'
                : 'VERITAS EDITORIAL MODEL',
            });
          } else {
            items.push({
              id: `empty_${sys.toLowerCase()}_${cls.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
              system: sys,
              programme: prog.programme,
              classId: cls.id,
              classLabel: cls.label,
              hasFormalBoardExam: cls.hasFormalBoardExam,
              examNotes: cls.examNotes,
              status: 'NO BLUEPRINT CREATED',
            });
          }
        });
      });
    });

    // Custom blueprints
    allBlueprints.forEach((bp) => {
      const isCustom =
        bp.board === 'Custom' ||
        bp.id.startsWith('custom_') ||
        bp.id.startsWith('imported_') ||
        bp.verificationStatus === 'CUSTOM / AUTHOR MODEL';

      if (isCustom && !items.some((it) => it.blueprint?.id === bp.id)) {
        items.push({
          id: bp.id,
          system: 'Custom',
          programme: bp.programme || 'Custom Programme',
          classId: bp.targetClass || 'Custom Class',
          classLabel: bp.targetClass || 'Custom Class',
          hasFormalBoardExam: false,
          blueprint: bp,
          status: 'CUSTOM / AUTHOR MODEL',
        });
      }
    });

    return items;
  }, [allBlueprints]);

  // Filter items based on active criteria
  const filteredItems = useMemo(() => {
    return directoryItems.filter((item) => {
      // System filter
      if (selectedSystem !== 'ALL') {
        if (selectedSystem === 'Custom') {
          if (item.system !== 'Custom' && item.status !== 'CUSTOM / AUTHOR MODEL') return false;
        } else if (item.system !== selectedSystem) {
          return false;
        }
      }

      // Type / Status filter
      if (typeFilter === 'VERIFIED') {
        if (item.status !== 'VERIFIED BOARD SPECIFICATION') return false;
      } else if (typeFilter === 'EDITORIAL') {
        if (item.status !== 'VERITAS EDITORIAL MODEL') return false;
      } else if (typeFilter === 'NO_BLUEPRINT') {
        if (item.status !== 'NO BLUEPRINT CREATED') return false;
      } else if (typeFilter === 'CUSTOM') {
        if (item.status !== 'CUSTOM / AUTHOR MODEL') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        // Intelligent equivalence between "class 3" and "stage 3"
        const stageEquivalent = q.replace(/\bclass\s*/i, 'stage ');
        const classEquivalent = q.replace(/\bstage\s*/i, 'class ');

        const sysStr = (item.system || '').toLowerCase();
        const progStr = (item.programme || '').toLowerCase();
        const classIdStr = (item.classId || '').toLowerCase();
        const classLabelStr = (item.classLabel || '').toLowerCase();
        const notesStr = (item.examNotes || '').toLowerCase();

        const bp = item.blueprint;
        const titleStr = bp ? (bp.title || '').toLowerCase() : '';
        const descStr = bp ? (bp.description || '').toLowerCase() : '';
        const refStr = bp ? (bp.officialSyllabusReference || '').toLowerCase() : '';
        const codeStr = bp ? (bp.boardCode || '').toLowerCase() : '';

        const matchesSearch =
          sysStr.includes(q) ||
          progStr.includes(q) ||
          classIdStr.includes(q) ||
          classLabelStr.includes(q) ||
          classIdStr.includes(stageEquivalent) ||
          classLabelStr.includes(stageEquivalent) ||
          classIdStr.includes(classEquivalent) ||
          classLabelStr.includes(classEquivalent) ||
          notesStr.includes(q) ||
          titleStr.includes(q) ||
          descStr.includes(q) ||
          refStr.includes(q) ||
          codeStr.includes(q) ||
          (q === 'grammar' && (titleStr.includes('grammar') || descStr.includes('grammar') || progStr.includes('grammar')));

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [directoryItems, selectedSystem, typeFilter, searchQuery]);

  // Handle selecting an empty class destination
  const handleSelectEmptyClass = (system: CurriculumSystemId | 'Custom', cls: string, prog?: string) => {
    const sys = system === 'Custom' ? 'CBSE' : system;
    const emptyBp = createEmptyBlueprintPlaceholder(sys, cls, prog);
    onSelectBlueprint(emptyBp.id, emptyBp);
    onClose();
  };

  // Handle creating an editorial model directly
  const handleCreateEditorial = (system: CurriculumSystemId | 'Custom', cls: string, prog?: string) => {
    const sys = system === 'Custom' ? 'CBSE' : system;
    const template = createEditorialTemplateForClass(sys, cls, prog);
    if (onCreateEditorialBlueprint) {
      onCreateEditorialBlueprint(template);
    }
    onSelectBlueprint(template.id, template);
    onClose();
  };

  if (!isOpen) return null;

  const systemsToDisplay: Array<{ key: string; title: string; subtitle: string }> = [];
  if (selectedSystem === 'ALL' || selectedSystem === 'CBSE') {
    systemsToDisplay.push({ key: 'CBSE', title: 'CBSE', subtitle: 'Central Board of Secondary Education • Classes 1–12' });
  }
  if (selectedSystem === 'ALL' || selectedSystem === 'CISCE') {
    systemsToDisplay.push({ key: 'CISCE', title: 'CISCE', subtitle: 'Council for the Indian School Certificate Examinations • Classes 1–12' });
  }
  if (selectedSystem === 'ALL' || selectedSystem === 'Cambridge') {
    systemsToDisplay.push({ key: 'Cambridge', title: 'Cambridge International', subtitle: 'Cambridge Assessment International Education • Programme & Stage Specific' });
  }
  if ((selectedSystem === 'ALL' || selectedSystem === 'Custom') && filteredItems.some((i) => i.system === 'Custom')) {
    systemsToDisplay.push({ key: 'Custom', title: 'Custom Blueprints', subtitle: 'Author & Editorial Bespoke Assessment Models' });
  }

  return (
    <div
      id="blueprint-directory-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <DirectoryErrorBoundary onClose={onClose}>
        <div
          id="blueprint-directory-dialog"
          className="bg-[#FAF7F2] dark:bg-[#1A1218] border-2 border-[#8C6D3B]/40 dark:border-[#C29A52]/40 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        >
          {/* HEADER */}
          <div className="p-4 sm:px-6 sm:py-4 bg-white dark:bg-[#20141D] border-b border-stone-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#5A1832]/10 dark:bg-[#C29A52]/20 border border-[#5A1832]/20 dark:border-[#C29A52]/30 flex items-center justify-center text-[#5A1832] dark:text-[#C29A52] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#5A1832]/10 text-[#5A1832] dark:bg-[#C29A52]/20 dark:text-[#C29A52] border border-[#5A1832]/20">
                    CURRICULUM DIRECTORY
                  </span>
                  <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                    Complete K–12 Educational Architecture
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                  Board Blueprint &amp; Class Destination Directory
                </h2>
              </div>
            </div>

            <button
              id="btn-close-blueprint-directory"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center justify-center transition-colors"
              title="Close Directory"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SEARCH & SYSTEM FILTERS BAR */}
          <div className="p-4 bg-white/90 dark:bg-[#231720]/90 border-b border-stone-200 dark:border-slate-800 space-y-3 shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Input: placeholder 'Search blueprints...' */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="input-blueprint-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search blueprints..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#8C6D3B]/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* System Filters: All, CBSE, CISCE, Cambridge, Custom */}
              <div className="flex items-center space-x-1 bg-stone-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs font-semibold shrink-0">
                {(['ALL', 'CBSE', 'CISCE', 'Cambridge', 'Custom'] as const).map((sys) => (
                  <button
                    key={sys}
                    id={`filter-system-${sys.toLowerCase()}`}
                    onClick={() => setSelectedSystem(sys)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedSystem === sys
                        ? 'bg-[#5A1832] text-white shadow-xs dark:bg-[#C29A52] dark:text-[#1e0f18]'
                        : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-stone-200/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sys === 'ALL' ? 'All' : sys}
                  </button>
                ))}
              </div>
            </div>

            {/* SECONDARY FILTER CHIPS: Status / Verification */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 dark:border-slate-800/60 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-stone-500 font-medium mr-1">Status:</span>
                <button
                  onClick={() => setTypeFilter('ALL')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    typeFilter === 'ALL'
                      ? 'bg-stone-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold'
                      : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
                  }`}
                >
                  All ({filteredItems.length})
                </button>
                <button
                  onClick={() => setTypeFilter('VERIFIED')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center space-x-1 ${
                    typeFilter === 'VERIFIED'
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Specs</span>
                </button>
                <button
                  onClick={() => setTypeFilter('EDITORIAL')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center space-x-1 ${
                    typeFilter === 'EDITORIAL'
                      ? 'bg-amber-700 text-white font-bold'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Editorial Models</span>
                </button>
                <button
                  onClick={() => setTypeFilter('NO_BLUEPRINT')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center space-x-1 ${
                    typeFilter === 'NO_BLUEPRINT'
                      ? 'bg-stone-700 text-white font-bold'
                      : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 border border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <Info className="w-3 h-3" />
                  <span>No Blueprint Created</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-500 font-mono">
                Active Book: <strong className="text-stone-800 dark:text-slate-200">{activeBookBoard} {activeBookClass}</strong>
              </div>
            </div>
          </div>

          {/* DIRECTORY CONTENT: GROUPED RESULTS */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {filteredItems.length === 0 ? (
              <div className="py-12 px-4 max-w-md mx-auto text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900 dark:text-slate-100">
                    No Matching Blueprints or Classes Found
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    No directory entries match &ldquo;{searchQuery}&rdquo;. Try another search term or reset filters.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSystem('ALL');
                    setTypeFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-slate-800 hover:bg-stone-300 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              systemsToDisplay.map((sysMeta) => {
                const sysItems = filteredItems.filter((i) => i.system === sysMeta.key);
                if (sysItems.length === 0) return null;

                return (
                  <div
                    key={sysMeta.key}
                    id={`directory-group-${sysMeta.key.toLowerCase()}`}
                    className="space-y-3"
                  >
                    {/* System Section Header */}
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-2">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5A1832] dark:bg-[#C29A52]" />
                        <h3 className="text-base font-serif font-bold text-stone-900 dark:text-slate-100">
                          {sysMeta.title}
                        </h3>
                        <span className="text-xs text-stone-500 hidden sm:inline">
                          — {sysMeta.subtitle}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-stone-500">
                        {sysItems.length} {sysItems.length === 1 ? 'level' : 'levels'}
                      </span>
                    </div>

                    {/* Class Rows / Cards */}
                    <div className="space-y-2.5">
                      {sysItems.map((item) => {
                        const bp = item.blueprint;
                        const isSelected = bp && bp.id === selectedBlueprintId;

                        if (bp) {
                          // Established Blueprint Row
                          const isVerified = item.status === 'VERIFIED BOARD SPECIFICATION';
                          const isEditorial = item.status === 'VERITAS EDITORIAL MODEL';

                          return (
                            <div
                              key={item.id}
                              id={`blueprint-row-${item.id}`}
                              onClick={() => {
                                onSelectBlueprint(bp.id);
                                onClose();
                              }}
                              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:shadow-sm ${
                                isSelected
                                  ? 'bg-[#F6F0E7] dark:bg-[#2b1723] border-[#8C6D3B] dark:border-[#C29A52] ring-2 ring-[#8C6D3B]/25'
                                  : 'bg-white dark:bg-slate-900 border-stone-200/90 dark:border-slate-800 hover:border-[#8C6D3B]/70'
                              }`}
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold font-mono text-stone-900 dark:text-slate-100">
                                    {item.classLabel}
                                  </span>

                                  {isVerified ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1 shrink-0">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                      <span>VERIFIED BOARD SPECIFICATION</span>
                                    </span>
                                  ) : isEditorial ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1 shrink-0">
                                      <FileCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                      <span>VERITAS Editorial Model</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center space-x-1 shrink-0">
                                      <Sliders className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                      <span>Custom / Author Model</span>
                                    </span>
                                  )}

                                  <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                                    {item.programme}
                                  </span>
                                </div>

                                <h4 className="text-sm font-bold text-stone-900 dark:text-slate-100 group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors leading-snug truncate">
                                  {bp.title}
                                </h4>

                                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                                  {bp.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-slate-800">
                                <div className="flex items-center space-x-2 text-xs font-mono text-stone-500">
                                  <span><strong>{bp.totalMarks}</strong>m</span>
                                  <span>•</span>
                                  <span><strong>{bp.totalDurationMinutes}</strong>m</span>
                                  <span>•</span>
                                  <span><strong>{bp.questionSlots?.length || 0}</strong> slots</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectBlueprint(bp.id);
                                    onClose();
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-bold flex items-center space-x-1 transition-colors"
                                >
                                  <span>{isSelected ? 'Active' : 'Inspect'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // No Blueprint Created Row
                        return (
                          <div
                            key={item.id}
                            id={`empty-class-row-${item.id}`}
                            className="p-3.5 sm:p-4 rounded-xl border border-dashed border-stone-300 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold font-mono text-stone-800 dark:text-slate-200">
                                  {item.classLabel}
                                </span>

                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-200/90 dark:bg-slate-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-slate-700 flex items-center space-x-1">
                                  <Info className="w-3 h-3 text-stone-500" />
                                  <span>No blueprint created</span>
                                </span>

                                <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                                  {item.programme}
                                </span>
                              </div>

                              <p className="text-xs text-stone-500 dark:text-stone-400">
                                {item.examNotes || (item.hasFormalBoardExam ? 'Formal board exam level. No transcribed blueprint record yet.' : 'School-based curriculum evaluation (No formal board exam).')}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/60 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => handleCreateEditorial(item.system, item.classId, item.programme)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-600/10 hover:bg-amber-600/20 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors"
                                title="Generate a balanced curriculum-aligned editorial model"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>+ Create Editorial</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSelectEmptyClass(item.system, item.classId, item.programme)}
                                className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
                              >
                                <span>Select &amp; Setup</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div className="p-3.5 sm:px-6 bg-stone-100 dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 text-xs">
            <div className="text-stone-500 text-[11px] sm:text-xs">
              Showing <strong>{filteredItems.length}</strong> matching levels across CBSE, CISCE, and Cambridge.
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close Directory
            </button>
          </div>
        </div>
      </DirectoryErrorBoundary>
    </div>
  );
};
