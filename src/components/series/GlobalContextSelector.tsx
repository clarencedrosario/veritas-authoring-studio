import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  BookOpen,
  Check,
  Globe2,
  Compass,
  Plus,
  ArrowRight,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  CurriculumSystemId,
  CurriculumStage,
  BookProject,
} from '../../types';
import {
  CURRICULUM_SYSTEMS,
  CURRICULUM_STAGES,
} from '../../utils/multiBoardData';
import {
  resolveActiveBookContext,
  switchAcademicContext,
  createBookProjectForStage,
  getStageBookStatus,
  BookProjectStatusCategory,
} from '../../utils/activeBookContext';

interface GlobalContextSelectorProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onNavigateToEdition?: (editionId: string) => void;
  compact?: boolean;
}

export const GlobalContextSelector: React.FC<GlobalContextSelectorProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onNavigateToEdition: _onNavigateToEdition,
  compact: _compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Authoritative Context Resolution (Active Context across all Veritas)
  const resolvedContext = useMemo(() => {
    return resolveActiveBookContext(seriesProject);
  }, [seriesProject]);

  const activeBook: BookProject = resolvedContext.activeProject;
  const activeSystem: CurriculumSystemId = resolvedContext.activeSystemId;
  const allProjectsRecord = resolvedContext.allProjectsRecord;

  // Local browsing / preview state inside selector popover
  const [browsingSystemId, setBrowsingSystemId] = useState<CurriculumSystemId>(activeSystem);
  const [browsingProgrammeId, setBrowsingProgrammeId] = useState<string>(
    seriesProject.activeProgrammeId ||
      (activeSystem === 'CISCE'
        ? 'cisce-school'
        : activeSystem === 'Cambridge'
        ? 'cambridge-lower-sec'
        : 'cbse-main')
  );
  const [previewStageId, setPreviewStageId] = useState<string>(
    seriesProject.activeStageId ||
      (activeSystem === 'CISCE'
        ? 'stage-icse-c6'
        : activeSystem === 'Cambridge'
        ? 'stage-camb-s7'
        : 'stage-cbse-c6')
  );

  // Dynamic popover coordinates for fixed viewport portal placement
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({
    top: 60,
    left: 16,
    width: 490,
    maxHeight: 520,
  });

  // Calculate precise fixed positioning to avoid sticky toolbar overlap and viewport overflow
  const updatePosition = useCallback(() => {
    if (!triggerButtonRef.current) return;
    const btnRect = triggerButtonRef.current.getBoundingClientRect();

    // Query toolbar / sticky navigation header containing this button or in the workspace
    const stickyToolbar =
      triggerButtonRef.current.closest('div.border-b') ||
      triggerButtonRef.current.closest('header') ||
      document.querySelector('#grammar-lms-root > div.border-b') ||
      document.querySelector('header');

    const toolbarRect = stickyToolbar ? stickyToolbar.getBoundingClientRect() : btnRect;

    // Popover must start STRICTLY below the entire navigation toolbar and the button
    const top = Math.max(btnRect.bottom, toolbarRect.bottom) + 6;

    // Desktop target width: 480–500px, bounded by viewport
    const popoverWidth = Math.min(490, window.innerWidth - 24);

    // Align left with button, safely clamped within viewport
    let left = btnRect.left;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = window.innerWidth - popoverWidth - 12;
    }
    if (left < 12) {
      left = 12;
    }

    // Maximum height strictly bounded by remaining viewport height below top
    const maxHeight = Math.max(320, window.innerHeight - top - 16);

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(popoverWidth),
      maxHeight: Math.round(maxHeight),
    });
  }, []);

  // Sync browsing preview when active context changes externally while popover is closed
  useEffect(() => {
    if (!isOpen) {
      setBrowsingSystemId(resolvedContext.activeSystemId);
      if (seriesProject.activeProgrammeId) {
        setBrowsingProgrammeId(seriesProject.activeProgrammeId);
      }
      if (seriesProject.activeStageId) {
        setPreviewStageId(seriesProject.activeStageId);
      }
    }
  }, [isOpen, resolvedContext.activeSystemId, seriesProject.activeProgrammeId, seriesProject.activeStageId]);

  // Position listener on resize and scroll
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => updatePosition();
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);
      return () => {
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Toggle Popover with clean reset to current active context
  const handleToggleOpen = () => {
    if (!isOpen) {
      // Initialize browsing state directly from active context
      setBrowsingSystemId(resolvedContext.activeSystemId);
      const activeProg =
        seriesProject.activeProgrammeId ||
        (resolvedContext.activeSystemId === 'CISCE'
          ? 'cisce-school'
          : resolvedContext.activeSystemId === 'Cambridge'
          ? 'cambridge-lower-sec'
          : 'cbse-main');
      setBrowsingProgrammeId(activeProg);

      const activeStg = CURRICULUM_STAGES.find(
        (s) =>
          s.systemId === resolvedContext.activeSystemId &&
          (s.id === seriesProject.activeStageId ||
            s.stageLabel === activeBook.classOrStage ||
            s.equivalentClass === activeBook.classLevel)
      );
      if (activeStg) {
        setPreviewStageId(activeStg.id);
      }
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Compute clean, non-duplicated trigger button label
  const triggerLabel = useMemo(() => {
    const sys = resolvedContext.activeSystemId;
    const book = resolvedContext.activeProject;
    const stageStr = book.classOrStage || book.classLevel || resolvedContext.selectedClass || 'Class 6';

    if (sys === 'CBSE') {
      return {
        system: 'CBSE',
        programme: null,
        stage: book.classLevel || stageStr,
      };
    }

    if (sys === 'CISCE') {
      const clsNum = parseInt(stageStr.replace(/\D/g, '') || '6', 10);
      let progName: string | null = null;
      if (clsNum >= 11) {
        progName = 'ISC';
      } else if (clsNum >= 9) {
        progName = 'ICSE';
      } else if (book.bookTitle?.includes('ICSE') || book.subtitle?.includes('ICSE')) {
        progName = 'ICSE';
      }
      return {
        system: 'CISCE',
        programme: progName,
        stage: stageStr,
      };
    }

    if (sys === 'Cambridge') {
      let progName = 'Lower Sec';
      if (stageStr.includes('IGCSE')) {
        progName = 'IGCSE';
      } else if (stageStr.includes('A Level') || stageStr.includes('AS')) {
        progName = 'AS/A Level';
      } else if (stageStr.includes('Primary') || (stageStr.includes('Stage') && parseInt(stageStr.replace(/\D/g, '') || '7', 10) <= 6)) {
        progName = 'Primary';
      }

      let shortStage = stageStr;
      if (stageStr.includes('Stage 7')) shortStage = 'Stage 7';
      else if (stageStr.includes('Stage 8')) shortStage = 'Stage 8';
      else if (stageStr.includes('Stage 9')) shortStage = 'Stage 9';
      else if (stageStr.includes('IGCSE')) shortStage = 'Years 10–11';
      else if (stageStr.includes('A Level')) shortStage = 'Years 12–13';

      return {
        system: 'Cambridge',
        programme: progName,
        stage: shortStage,
      };
    }

    return {
      system: sys,
      programme: null,
      stage: stageStr,
    };
  }, [resolvedContext]);

  // Current system data in popover
  const currentBrowsingSystem =
    CURRICULUM_SYSTEMS.find((s) => s.id === browsingSystemId) || CURRICULUM_SYSTEMS[1];

  // Available stages for the current browsing system & programme
  const stagesForBrowsing = useMemo(() => {
    if (browsingSystemId === 'CBSE') {
      return CURRICULUM_STAGES.filter((s) => s.systemId === 'CBSE');
    }
    if (browsingSystemId === 'CISCE') {
      if (browsingProgrammeId) {
        return CURRICULUM_STAGES.filter((s) => s.systemId === 'CISCE' && s.programmeId === browsingProgrammeId);
      }
      return CURRICULUM_STAGES.filter((s) => s.systemId === 'CISCE');
    }
    if (browsingSystemId === 'Cambridge') {
      if (browsingProgrammeId) {
        return CURRICULUM_STAGES.filter((s) => s.systemId === 'Cambridge' && s.programmeId === browsingProgrammeId);
      }
      return CURRICULUM_STAGES.filter((s) => s.systemId === 'Cambridge');
    }
    return CURRICULUM_STAGES.filter((s) => s.systemId === browsingSystemId);
  }, [browsingSystemId, browsingProgrammeId]);

  // Selected stage object for preview
  const currentPreviewStage =
    CURRICULUM_STAGES.find((s) => s.id === previewStageId) || stagesForBrowsing[0] || CURRICULUM_STAGES[0];

  // Derive status and matching project strictly for preview stage and system
  const stageStatusResult = useMemo(() => {
    return getStageBookStatus(
      allProjectsRecord,
      browsingSystemId,
      currentPreviewStage?.stageLabel || currentPreviewStage?.equivalentClass || 'Class 6'
    );
  }, [allProjectsRecord, browsingSystemId, currentPreviewStage]);

  // Handler: Change Browsing System
  const handleSelectSystemTab = (systemId: CurriculumSystemId) => {
    setBrowsingSystemId(systemId);
    const sys = CURRICULUM_SYSTEMS.find((s) => s.id === systemId);
    if (!sys) return;
    const defaultProg = sys.programmes[0]?.id || 'cbse-main';
    setBrowsingProgrammeId(defaultProg);

    // Pick appropriate default stage
    const sysStages = CURRICULUM_STAGES.filter((s) => s.systemId === systemId);
    const defaultStage =
      systemId === 'CISCE'
        ? sysStages.find((s) => s.stageLabel === 'Class 6') || sysStages[0]
        : systemId === 'Cambridge'
        ? sysStages.find((s) => s.stageLabel === 'Stage 7') || sysStages[0]
        : sysStages.find((s) => s.stageLabel === 'Class 6') || sysStages[0];

    if (defaultStage) {
      setPreviewStageId(defaultStage.id);
    }
  };

  // Handler: Change Browsing Programme
  const handleSelectProgrammeTab = (progId: string) => {
    setBrowsingProgrammeId(progId);
    const progStages = CURRICULUM_STAGES.filter((s) => s.programmeId === progId);
    if (progStages.length > 0) {
      setPreviewStageId(progStages[0].id);
    }
  };

  // Handler: Click a Stage Card (UPDATES PREVIEW ONLY — DOES NOT SWITCH ACTIVE BOOK)
  const handleStageClick = (stage: CurriculumStage) => {
    setPreviewStageId(stage.id);
  };

  // Handler: Explicitly Switch Context to previewed book
  const handleConfirmSwitchBook = (bookId: string) => {
    const updated = switchAcademicContext(
      seriesProject,
      browsingSystemId,
      browsingProgrammeId,
      previewStageId,
      currentPreviewStage.equivalentClass,
      bookId
    );
    onUpdateSeriesProject(updated);
    setIsOpen(false);
  };

  // Handler: Create Book Project for uncreated stage
  const handleCreateBookProject = (useTemplate: boolean = false) => {
    const customTitle = useTemplate
      ? browsingSystemId === 'CISCE'
        ? `Classical Grammar & Composition: ICSE ${currentPreviewStage.stageLabel}`
        : browsingSystemId === 'Cambridge'
        ? `Cambridge English Language Coursebook — ${currentPreviewStage.stageLabel}`
        : `Communicative English Grammar & Syntax — ${currentPreviewStage.stageLabel}`
      : undefined;

    const { updatedProject } = createBookProjectForStage(
      seriesProject,
      browsingSystemId,
      currentPreviewStage.id,
      customTitle
    );

    onUpdateSeriesProject(updatedProject);
    setIsOpen(false);
  };

  // Render Status Badge
  const renderStatusBadge = (status: BookProjectStatusCategory) => {
    switch (status) {
      case 'Book Exists':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
            Book Exists
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
            Planned
          </span>
        );
      case 'Published':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
            Published
          </span>
        );
      case 'Not Yet Created':
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-medium text-[#8C7A6B] dark:text-[#9E8B7C] bg-[#EDE4D6]/60 dark:bg-[#2A1521] border border-dashed border-[#CBBEAC] dark:border-[#4A2435]">
            Not Created
          </span>
        );
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* 1. Authoritative Context Trigger Button (VERITAS Burgundy & Antique Gold Theme) */}
      <button
        id="btn-global-academic-context"
        ref={triggerButtonRef}
        type="button"
        onClick={handleToggleOpen}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-[#FAF7F2] dark:bg-[#2A121D] hover:border-[#C29A52] hover:bg-[#F2ECE1] dark:hover:bg-[#35101F] text-xs font-semibold text-[#292521] dark:text-[#F6F0E7] transition-all shadow-2xs outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] focus-visible:ring-offset-1 ring-offset-[#FAF7F2] dark:ring-offset-[#1e0f18] cursor-pointer"
        title="Switch Curriculum System, Board Framework, and Class Context"
        aria-expanded={isOpen}
      >
        <Compass className="w-3.5 h-3.5 text-[#C29A52] shrink-0" />

        {/* Board / System Badge */}
        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[11px] bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/40 shrink-0">
          {triggerLabel.system}
        </span>

        {/* Middle programme (Only when meaningful; NO CBSE/CBSE duplication) */}
        {triggerLabel.programme && (
          <>
            <span className="text-[#C29A52]/70 font-semibold select-none">/</span>
            <span className="text-[#5A1832] dark:text-[#E6C994] font-medium truncate max-w-[90px] sm:max-w-[120px]">
              {triggerLabel.programme}
            </span>
          </>
        )}

        <span className="text-[#C29A52]/70 font-semibold select-none">/</span>

        {/* Stage / Class Badge */}
        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[11px] bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832]/60 shrink-0">
          {triggerLabel.stage}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#C29A52] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 2. Portal-Rendered Dropdown Popover: Escapes Sticky Toolbar Stacking Context */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="popover-academic-context-selector"
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              maxHeight: `${coords.maxHeight}px`,
            }}
            className="z-[9999] flex flex-col rounded-2xl border border-[#C29A52]/60 bg-[#FAF7F2] dark:bg-[#200D16] shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 text-xs text-[#292521] dark:text-[#F6F0E7]"
          >
            {/* Popover Header (Fixed at top of popover) */}
            <div className="shrink-0 px-4 pt-3.5 pb-2.5 bg-[#F5EFE6] dark:bg-[#27101C] border-b border-[#CBBEAC]/50 dark:border-[#5A1832]/60 flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <div className="w-6 h-6 rounded-lg bg-[#5A1832] flex items-center justify-center border border-[#C29A52]/50 shrink-0">
                  <Globe2 className="w-3.5 h-3.5 text-[#C29A52]" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#5A1832] dark:text-[#E6C994] text-[13px] leading-tight">
                    Academic Publishing Context
                  </div>
                  <div className="text-[10px] text-[#6E6359] dark:text-[#C2B59B] truncate">
                    Active: <span className="font-medium text-[#292521] dark:text-[#F6F0E7]">{activeBook.bookTitle}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#6E6359] hover:text-[#5A1832] dark:text-[#C2B59B] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                title="Dismiss"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SECTION 1: CURRICULUM SYSTEM (Always visible directly at the top, never hidden) */}
            <div className="shrink-0 px-4 pt-3 pb-2.5 bg-[#FAF7F2] dark:bg-[#200D16] border-b border-[#CBBEAC]/40 dark:border-[#5A1832]/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                  1. Curriculum System
                </label>
                <span className="text-[10px] text-[#6E6359] dark:text-[#C2B59B]">
                  Shared Multi-Board Continuum
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {CURRICULUM_SYSTEMS.map((sys) => {
                  const isSelected = sys.id === browsingSystemId;
                  const isActiveActual = sys.id === activeSystem;

                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => handleSelectSystemTab(sys.id)}
                      className={`px-3 py-2 rounded-xl text-left transition-all border outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] focus-visible:ring-offset-1 ring-offset-[#FAF7F2] dark:ring-offset-[#200D16] cursor-pointer ${
                        isSelected
                          ? 'bg-[#5A1832] text-[#F6F0E7] border-[#C29A52] shadow-sm font-semibold'
                          : 'bg-[#EDE4D6]/50 dark:bg-[#2B121F] text-[#5A1832] dark:text-[#E6C994] border-[#CBBEAC] dark:border-[#5A1832] hover:border-[#C29A52]/60 hover:bg-[#EDE4D6]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs font-mono">{sys.shortName}</span>
                        {isActiveActual && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Active Volume" />
                        )}
                      </div>
                      <div
                        className={`text-[9.5px] truncate mt-0.5 ${
                          isSelected ? 'text-[#E6C994]' : 'text-[#6E6359] dark:text-[#C2B59B]'
                        }`}
                      >
                        {sys.id === 'CISCE'
                          ? 'Classes 1–12 (ICSE)'
                          : sys.id === 'Cambridge'
                          ? 'Stages 1–9 & IGCSE'
                          : 'Classes 1–12 (NEP)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Middle Body: Sections 2 & 3 */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 space-y-3.5">
              {/* SECTION 2: PROGRAMME / EDUCATIONAL TIER */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                    2. Programme / Educational Tier
                  </label>
                  <span className="text-[10px] text-[#6E6359] dark:text-[#C2B59B]">
                    {browsingSystemId === 'Cambridge' ? 'Enquiry Framework' : 'Board Pathway'}
                  </span>
                </div>

                {browsingSystemId === 'CBSE' ? (
                  <div className="p-2.5 rounded-xl bg-[#EDE4D6]/60 dark:bg-[#2B121F] border border-[#CBBEAC] dark:border-[#5A1832] text-[11px] text-[#5A1832] dark:text-[#E6C994] flex items-center justify-between">
                    <span>National K–12 Spiral Continuum (Classes 1–12)</span>
                    <span className="text-[10px] font-mono text-[#6E6359] dark:text-[#C2B59B]">NEP 2020</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {currentBrowsingSystem.programmes.map((prog) => {
                      const isProgActive = prog.id === browsingProgrammeId;
                      return (
                        <button
                          key={prog.id}
                          type="button"
                          onClick={() => handleSelectProgrammeTab(prog.id)}
                          className={`px-2.5 py-2 rounded-xl text-left transition-all border outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] focus-visible:ring-offset-1 ring-offset-[#FAF7F2] dark:ring-offset-[#200D16] cursor-pointer ${
                            isProgActive
                              ? 'bg-[#5A1832] text-[#F6F0E7] border-[#C29A52] font-semibold shadow-xs'
                              : 'bg-[#EDE4D6]/40 dark:bg-[#2B121F]/60 text-[#292521] dark:text-[#F6F0E7] border-[#CBBEAC] dark:border-[#5A1832] hover:bg-[#EDE4D6]'
                          }`}
                        >
                          <div className="text-[11px] font-medium truncate">{prog.shortCode}</div>
                          <div
                            className={`text-[9px] truncate ${
                              isProgActive ? 'text-[#E6C994]' : 'text-[#6E6359] dark:text-[#C2B59B]'
                            }`}
                          >
                            {prog.ageBracket.split('(')[1]?.replace(')', '') || prog.ageBracket}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 3: CLASS / STAGE SELECTION */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                    3. Stage / Class Selection
                  </label>
                  <span className="text-[10px] text-[#6E6359] dark:text-[#C2B59B]">
                    Click to preview stage
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {stagesForBrowsing.map((stg) => {
                    const isSelected = stg.id === previewStageId;
                    const stageBookInfo = getStageBookStatus(allProjectsRecord, browsingSystemId, stg.stageLabel);
                    const isCurrentActive =
                      activeSystem === browsingSystemId &&
                      (activeBook.classLevel === stg.equivalentClass || activeBook.classOrStage === stg.stageLabel);

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => handleStageClick(stg)}
                        className={`p-2 rounded-xl text-left transition-all border outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] focus-visible:ring-offset-1 ring-offset-[#FAF7F2] dark:ring-offset-[#200D16] cursor-pointer ${
                          isSelected
                            ? 'border-[#C29A52] bg-[#EDE4D6] dark:bg-[#35101F] shadow-xs'
                            : 'border-[#CBBEAC] dark:border-[#5A1832]/60 bg-[#FAF7F2] dark:bg-[#2B121F]/40 hover:bg-[#EDE4D6]/60 dark:hover:bg-[#2B121F]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] font-mono text-[#5A1832] dark:text-[#E6C994]">
                            {stg.stageLabel}
                          </span>
                          {isCurrentActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Volume" />
                          ) : isSelected ? (
                            <Check className="w-3 h-3 text-[#C29A52] shrink-0" />
                          ) : null}
                        </div>

                        <div className="text-[9.5px] text-[#6E6359] dark:text-[#C2B59B] truncate mt-0.5">
                          {stg.nominalAge}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between">
                          {renderStatusBadge(stageBookInfo.status)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 4: MATCHING BOOK / EDITION (Sticky Footer in Popover) */}
            <div className="shrink-0 px-4 py-3 border-t border-[#CBBEAC]/70 dark:border-[#5A1832]/70 bg-[#F5EFE6] dark:bg-[#27101C]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                  4. Matching Book / Edition
                </label>
                <span className="text-[10px] text-[#6E6359] dark:text-[#C2B59B] font-mono font-medium">
                  {browsingSystemId} / {currentPreviewStage.stageLabel}
                </span>
              </div>

              {stageStatusResult.project ? (
                /* Matching Book Project Exists or is Planned */
                <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#200D16] border border-[#CBBEAC] dark:border-[#5A1832] space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 min-w-0 pr-2">
                      <BookOpen className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-bold text-[11.5px] text-[#292521] dark:text-[#F6F0E7] truncate">
                          {stageStatusResult.project.bookTitle}
                        </div>
                        <div className="text-[10px] text-[#6E6359] dark:text-[#C2B59B] flex items-center space-x-1.5">
                          <span className="font-mono font-semibold text-[#5A1832] dark:text-[#E6C994]">
                            {stageStatusResult.project.internalProjectCode}
                          </span>
                          <span>•</span>
                          <span>{stageStatusResult.project.status}</span>
                        </div>
                      </div>
                    </div>

                    {renderStatusBadge(stageStatusResult.status)}
                  </div>

                  {stageStatusResult.project.id === activeBook.id ? (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Current Active Book</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[11px] font-medium text-[#5A1832] dark:text-[#E6C994] hover:bg-[#EDE4D6] dark:hover:bg-[#2B121F] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[11px] font-medium text-[#6E6359] dark:text-[#C2B59B] hover:bg-[#EDE4D6] dark:hover:bg-[#2B121F] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmSwitchBook(stageStatusResult.project!.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] font-semibold text-[11.5px] transition-colors shadow-xs outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                      >
                        {stageStatusResult.status === 'Planned' ? (
                          <>
                            <Compass className="w-3.5 h-3.5 text-[#C29A52]" />
                            <span>Open Project</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
                            <span>Open Book</span>
                          </>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-[#C29A52]" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* No Book Project Exists Yet for Selected Stage */
                <div className="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-amber-900 dark:text-amber-300">
                      <span className="font-bold">
                        No {browsingSystemId} {currentPreviewStage.stageLabel} book project exists.
                      </span>
                      <div className="text-[10px] text-amber-800/80 dark:text-amber-400/80 mt-0.5">
                        Click "Create Book Project" to initialize this volume, or Cancel to dismiss.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] bg-[#FAF7F2] dark:bg-[#200D16] text-[11px] font-medium text-[#6E6359] dark:text-[#C2B59B] hover:bg-[#EDE4D6] transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateBookProject(false)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] font-semibold text-[11px] transition-colors shadow-xs outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                      <span>Create Book Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
