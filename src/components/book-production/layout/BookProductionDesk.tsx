import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  GrammarSeriesProject,
  ClassCurriculumBook,
  GrammarClassLevel,
  GrammarTopic,
} from '../../../types';
import {
  BookProductionSettings,
  PaginatedPage,
  PreflightIssue,
  TRIM_PRESET_MAP,
} from '../../../types/bookLayoutTypes';
import {
  DEFAULT_PRODUCTION_SETTINGS,
  loadBookProductionSettings,
  saveBookProductionSettings,
} from '../../../utils/bookLayoutDefaults';
import { paginateTextbook } from '../../../utils/textbookPaginator';
import {
  resolveActiveBookContext,
  getEditionIsolatedBookData,
  switchAcademicContext,
  ALL_INDIAN_CLASSES,
} from '../../../utils/activeBookContext';
import { BookPageStructureNav } from './BookPageStructureNav';
import { PublicationPageCanvas } from './PublicationPageCanvas';
import { LayoutInspector } from './LayoutInspector';
import { PublisherHandoffModal } from './PublisherHandoffModal';
import { ReorderChaptersModal } from './ReorderChaptersModal';
import {
  BookMarked,
  Printer,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileCheck,
  ArrowUpDown,
} from 'lucide-react';
import {
  TextbookExportOptions,
  exportTextbookToDocx,
  generateTextbookHtml,
} from '../../../utils/textbookExport';

interface BookProductionDeskProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject?: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToPreview?: () => void;
  onNavigateToMatrix?: () => void;
  onNavigateToClassTextbook?: (cls: GrammarClassLevel) => void;
}

export const BookProductionDesk: React.FC<BookProductionDeskProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToPreview,
  onNavigateToMatrix,
  onNavigateToClassTextbook,
}) => {
  // Authoritative active context
  const resolvedContext = useMemo(() => resolveActiveBookContext(seriesProject), [seriesProject]);
  const activeBook = resolvedContext.activeProject;
  const activeSystemId = resolvedContext.activeSystemId;
  const selectedClass = seriesProject.selectedClass || activeBook.classLevel || 'Class 6';

  const currentBook: ClassCurriculumBook = useMemo(() => {
    return getEditionIsolatedBookData(seriesProject, activeBook);
  }, [seriesProject, activeBook]);

  // Persistent production settings
  const [settings, setSettings] = useState<BookProductionSettings>(() => {
    return loadBookProductionSettings();
  });

  // Active page index
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Panel collapse states
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);

  // Mode: Proof Mode vs Clean Reader
  const [isProofMode, setIsProofMode] = useState<boolean>(true);
  const [showHandoffModal, setShowHandoffModal] = useState<boolean>(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Chapter Reordering & Book Updates
  const handleUpdateBook = (updatedBook: ClassCurriculumBook) => {
    if (!onUpdateSeriesProject) return;

    const currentClassLevel = updatedBook.classLevel || activeBook.classLevel || selectedClass;
    const activeBookId = activeBook.id || `proj-${currentClassLevel.toLowerCase().replace(/\s+/g, '-')}`;

    const stampedBook: ClassCurriculumBook = {
      ...updatedBook,
      bookProjectId: activeBookId,
      editionId: activeBook.editionId || `ed-${activeBookId}`,
      curriculumSystemId: activeBook.board || seriesProject.targetBoard,
      programmeId: activeBook.programmeId || activeBook.programme,
      classOrStageId: activeBook.classLevel || activeBook.classOrStage || currentClassLevel,
    };

    const isCbse = (activeBook.board || seriesProject.targetBoard || '').toUpperCase().includes('CBSE');

    onUpdateSeriesProject({
      ...seriesProject,
      editionBooks: {
        ...(seriesProject.editionBooks || {}),
        [activeBookId]: stampedBook,
      },
      books: isCbse
        ? {
            ...seriesProject.books,
            [currentClassLevel]: stampedBook,
          }
        : seriesProject.books,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleReorderChapters = (newTopics: GrammarTopic[]) => {
    // Re-index topic orders
    const reorderedTopics = newTopics.map((topic, idx) => ({
      ...topic,
      order: idx + 1,
      chapterNumber: idx + 1,
      studioChapter: topic.studioChapter
        ? {
            ...topic.studioChapter,
            order: idx + 1,
            chapterNumber: idx + 1,
          }
        : undefined,
    }));

    // If currentBook has units, keep chapterIds in unit aligned
    let updatedUnits = currentBook.units;
    if (updatedUnits && updatedUnits.length > 0) {
      const topicIdOrderMap = new Map<string, number>();
      reorderedTopics.forEach((t, i) => topicIdOrderMap.set(t.id, i));

      updatedUnits = updatedUnits.map((unit) => ({
        ...unit,
        chapterIds: [...unit.chapterIds].sort((a, b) => {
          const orderA = topicIdOrderMap.get(a) ?? 999;
          const orderB = topicIdOrderMap.get(b) ?? 999;
          return orderA - orderB;
        }),
      }));
    }

    const updatedBook: ClassCurriculumBook = {
      ...currentBook,
      topics: reorderedTopics,
      units: updatedUnits,
    };

    handleUpdateBook(updatedBook);
    showToast(`Chapters reordered for ${currentBook.title || selectedClass}. Textbook repaginated successfully.`);
  };

  // Save settings when changed
  const handleUpdateSettings = (newSettings: BookProductionSettings) => {
    setSettings(newSettings);
    saveBookProductionSettings(newSettings);
  };

  // Run the deterministic pagination engine
  const paginationResult = useMemo(() => {
    return paginateTextbook(currentBook, seriesProject, settings);
  }, [currentBook, seriesProject, settings]);

  const {
    pages,
    preflightIssues,
    totalLeaves,
    totalSignatures,
    estimatedSpineThicknessMm,
  } = paginationResult;

  // Safe active page
  const safeActivePageIndex = Math.min(activePageIndex, Math.max(0, pages.length - 1));
  const activePage: PaginatedPage = pages[safeActivePageIndex] || pages[0];

  // Facing page for two-page spreads
  const facingPage: PaginatedPage | null = useMemo(() => {
    if (settings.canvasMode !== 'spread') return null;
    // In facing pages: Verso (left) is even numbered sheet, Recto (right) is next odd sheet
    if (activePage.isVerso) {
      return pages[safeActivePageIndex + 1] || null;
    } else {
      // If user is viewing a recto page, the facing verso is the previous page
      return safeActivePageIndex > 0 ? pages[safeActivePageIndex - 1] : null;
    }
  }, [settings.canvasMode, activePage, safeActivePageIndex, pages]);

  // Page navigation handlers
  const handlePrevPage = () => {
    if (settings.canvasMode === 'spread') {
      setActivePageIndex((prev) => Math.max(0, prev - 2));
    } else {
      setActivePageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (settings.canvasMode === 'spread') {
      setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 2));
    } else {
      setActivePageIndex((prev) => Math.min(pages.length - 1, prev + 1));
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setSettings((prev) => ({
      ...prev,
      zoomPercent: Math.min(150, prev.zoomPercent + 10),
    }));
  };

  const handleZoomOut = () => {
    setSettings((prev) => ({
      ...prev,
      zoomPercent: Math.max(50, prev.zoomPercent - 10),
    }));
  };

  const handleFitPage = () => {
    setSettings((prev) => ({ ...prev, zoomPercent: 80 }));
  };

  const handleFitWidth = () => {
    setSettings((prev) => ({ ...prev, zoomPercent: 110 }));
  };

  // Direct print PDF handler
  const handleDirectPrint = () => {
    const options: TextbookExportOptions = {
      format: 'print_pdf',
      trimSize: (settings.trimPreset === 'custom' ? 'crown_quarto' : settings.trimPreset) as any,
      edition: settings.edition,
      includeFrontMatter: true,
      includeScopeMatrix: true,
      includeAnswerKeys: settings.edition === 'teacher_master',
      includeTestSeries: true,
      includeRubrics: true,
      targetClassLevel: selectedClass,
      fontSizePt: settings.typography.body.fontSizePt,
      fontFamily: 'garamond',
    };

    const html = generateTextbookHtml(currentBook, seriesProject, options);
    if (printFrameRef.current) {
      const doc = printFrameRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        printFrameRef.current.contentWindow?.focus();
        printFrameRef.current.contentWindow?.print();
      }
    }
    showToast('Launched high-definition browser print preview for book production.');
  };

  // Review / Proof PDF handler with watermark and prepress timestamp
  const handleExportProofPdf = () => {
    const options: TextbookExportOptions = {
      format: 'print_pdf',
      trimSize: (settings.trimPreset === 'custom' ? 'crown_quarto' : settings.trimPreset) as any,
      edition: settings.edition,
      includeFrontMatter: true,
      includeScopeMatrix: true,
      includeAnswerKeys: true,
      includeTestSeries: true,
      includeRubrics: true,
      targetClassLevel: selectedClass,
      fontSizePt: settings.typography.body.fontSizePt,
      fontFamily: 'garamond',
    };

    let html = generateTextbookHtml(currentBook, seriesProject, options);
    const watermarkCss = `
      <style>
        .proof-watermark-overlay {
          position: fixed;
          top: 35%;
          left: 5%;
          right: 5%;
          transform: rotate(-30deg);
          font-size: 38pt;
          font-weight: 900;
          color: rgba(90, 24, 50, 0.12);
          text-transform: uppercase;
          text-align: center;
          pointer-events: none;
          z-index: 9999;
          letter-spacing: 0.12em;
          font-family: sans-serif;
        }
        .proof-header-stamp {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #fef2f2;
          border-bottom: 2px solid #b91c1c;
          color: #991b1b;
          padding: 4px 12px;
          font-family: monospace;
          font-size: 8pt;
          font-weight: bold;
          text-align: center;
          z-index: 9999;
        }
      </style>
      <div class="proof-header-stamp">ACADEMIC PROOF COPY &bull; VERSION: PRE-PRESS DRAFT &bull; DATE: ${new Date().toLocaleDateString()} &bull; NOT FOR COMMERCIAL DISTRIBUTION</div>
      <div class="proof-watermark-overlay">UNEDITED ACADEMIC PROOF</div>
    `;
    html = html.replace('<body>', `<body>${watermarkCss}`);
    if (printFrameRef.current) {
      const doc = printFrameRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        printFrameRef.current.contentWindow?.focus();
        printFrameRef.current.contentWindow?.print();
      }
    }
    showToast('Generated Review / Proof PDF with draft watermark & preflight timestamp.');
  };

  // DOCX export handler
  const handleExportDocx = async () => {
    try {
      showToast('Generating Microsoft Word coursebook...');
      const options: TextbookExportOptions = {
        format: 'docx',
        trimSize: (settings.trimPreset === 'custom' ? 'crown_quarto' : settings.trimPreset) as any,
        edition: settings.edition,
        includeFrontMatter: true,
        includeScopeMatrix: true,
        includeAnswerKeys: settings.edition === 'teacher_master',
        includeTestSeries: true,
        includeRubrics: true,
        targetClassLevel: selectedClass,
        fontSizePt: settings.typography.body.fontSizePt,
        fontFamily: 'garamond',
      };
      await exportTextbookToDocx(currentBook, seriesProject, options);
      showToast(`Exported ${currentBook.title} (.docx)`);
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    }
  };

  const allClasses = ALL_INDIAN_CLASSES;

  return (
    <div
      id="veritas-book-production-desk-root"
      className="flex-1 flex flex-col h-full overflow-hidden select-none bg-[#EDE4D6] dark:bg-[#111724] text-[#292521] dark:text-[#F6F0E7]"
    >
      {/* Hidden iframe for print PDF */}
      <iframe ref={printFrameRef} className="hidden" title="Production Print Frame" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#5A1832] text-[#F6F0E7] px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold border border-[#C29A52]">
          <CheckCircle2 className="w-4 h-4 text-[#C29A52]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP HEADER: TITLE, GRADE, EDITION, SWITCH TO PREVIEW */}
      {/* ======================================================== */}
      <header className="border-b border-[#CBBEAC] dark:border-slate-800 bg-[#F6F0E7] dark:bg-slate-900 px-4 xl:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
        {/* Left: Module Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold shadow-xs">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[10px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
                Veritas Book Production Desk
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A1832]/10 text-[#5A1832] dark:text-[#C29A52] border border-[#5A1832]/20">
                {TRIM_PRESET_MAP[settings.trimPreset]?.name || 'Crown Quarto'}
              </span>
            </div>
            <h1 className="text-sm xl:text-base font-serif font-bold text-[#292521] dark:text-slate-100">
              Textbook Layout, Pagination &amp; Prepress Studio
            </h1>
          </div>
        </div>

        {/* Center: Grade & Edition Switcher */}
        <div className="flex items-center space-x-2.5">
          {/* Grade Selector */}
          <div className="flex items-center bg-[#EDE4D6] dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-[#CBBEAC] dark:border-slate-700">
            <span className="text-[11px] font-bold text-[#71685E] dark:text-slate-400 mr-1.5 uppercase font-mono">
              Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => {
                const cls = e.target.value as GrammarClassLevel;
                setActivePageIndex(0);
                if (onUpdateSeriesProject) {
                  const updated = switchAcademicContext(
                    seriesProject,
                    activeSystemId,
                    seriesProject.activeProgrammeId,
                    undefined,
                    cls
                  );
                  onUpdateSeriesProject(updated);
                }
                if (onNavigateToClassTextbook) onNavigateToClassTextbook(cls);
              }}
              className="bg-transparent text-xs font-bold text-[#5A1832] dark:text-[#C29A52] outline-none cursor-pointer"
            >
              {allClasses.map((cls) => {
                const b = seriesProject.books[cls];
                const count = b?.topics?.length || 0;
                return (
                  <option key={cls} value={cls} className="bg-white dark:bg-slate-900 text-[#292521] dark:text-slate-200">
                    {cls} ({count} Chapters)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Student vs Teacher Edition Switcher */}
          <div className="flex items-center bg-[#EDE4D6] dark:bg-slate-800 p-1 rounded-xl border border-[#CBBEAC] dark:border-slate-700">
            <button
              onClick={() => handleUpdateSettings({ ...settings, edition: 'student' })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                settings.edition === 'student'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] hover:text-[#292521]'
              }`}
            >
              Student Edition
            </button>
            <button
              onClick={() => handleUpdateSettings({ ...settings, edition: 'teacher_master' })}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                settings.edition === 'teacher_master'
                  ? 'bg-[#9A7438] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] hover:text-[#292521]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Teacher's Master</span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Switch back to Reader Preview */}
          {onNavigateToPreview && (
            <button
              onClick={onNavigateToPreview}
              className="h-8 px-3 rounded-lg border border-[#CBBEAC] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#292521] dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 hover:bg-[#EDE4D6] transition-colors cursor-pointer"
              title="Switch to student-facing reader preview"
            >
              <Eye className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Reader Preview</span>
            </button>
          )}

          {/* Direct Print Button */}
          <button
            onClick={handleDirectPrint}
            className="h-8 px-3 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            title="Generate high-resolution print PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Print PDF</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. SUB-BAR: PAGINATION CONTROLS, VIEW MODES & ZOOM */}
      {/* ======================================================== */}
      <div className="border-b border-[#CBBEAC]/70 dark:border-slate-800 bg-[#F6F0E7]/80 dark:bg-slate-900/70 px-4 xl:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-10">
        {/* Left: Page Stepping */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-[#CBBEAC]/80 dark:border-slate-700">
            <button
              onClick={() => setActivePageIndex(0)}
              disabled={safeActivePageIndex === 0}
              className="px-2 py-1 rounded text-xs font-mono disabled:opacity-30 hover:bg-[#EDE4D6]"
              title="First Page"
            >
              &laquo;
            </button>
            <button
              onClick={handlePrevPage}
              disabled={safeActivePageIndex === 0}
              className="p-1 rounded text-xs disabled:opacity-30 hover:bg-[#EDE4D6]"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
              {activePage.displayPageNumber ? `p. ${activePage.displayPageNumber}` : `Sheet ${safeActivePageIndex + 1}`} / {pages.length}
            </span>
            <button
              onClick={handleNextPage}
              disabled={safeActivePageIndex >= pages.length - 1}
              className="p-1 rounded text-xs disabled:opacity-30 hover:bg-[#EDE4D6]"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePageIndex(pages.length - 1)}
              disabled={safeActivePageIndex >= pages.length - 1}
              className="px-2 py-1 rounded text-xs font-mono disabled:opacity-30 hover:bg-[#EDE4D6]"
              title="Last Page"
            >
              &raquo;
            </button>
          </div>

          {/* Spread vs Single Mode */}
          <div className="flex items-center bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-[#CBBEAC]/80 dark:border-slate-700">
            <button
              onClick={() => handleUpdateSettings({ ...settings, canvasMode: 'spread' })}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                settings.canvasMode === 'spread'
                  ? 'bg-[#5A1832] text-[#F6F0E7]'
                  : 'text-[#71685E]'
              }`}
            >
              Two-Page Spread
            </button>
            <button
              onClick={() => handleUpdateSettings({ ...settings, canvasMode: 'single' })}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                settings.canvasMode === 'single'
                  ? 'bg-[#5A1832] text-[#F6F0E7]'
                  : 'text-[#71685E]'
              }`}
            >
              Single Sheet
            </button>
          </div>

          {/* Proof Mode vs Clean Reader */}
          <button
            onClick={() => setIsProofMode(!isProofMode)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isProofMode
                ? 'bg-[#9A7438]/20 border-[#9A7438] text-[#5A1832] dark:text-[#C29A52]'
                : 'bg-white dark:bg-slate-800 border-[#CBBEAC] text-[#71685E]'
            }`}
          >
            {isProofMode ? 'Proof Guides Active' : 'Clean Reader View'}
          </button>

          {/* Quick Reorder Chapters Button */}
          <button
            onClick={() => setIsReorderModalOpen(true)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-[#CBBEAC] dark:border-slate-700 text-[#5A1832] dark:text-[#C29A52] hover:bg-[#EDE4D6] transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            title="Open Drag-and-Drop Chapter Reorder Studio"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Reorder Chapters</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#5A1832]/10 dark:bg-slate-700 font-mono font-bold">
              {currentBook.topics?.length || 0}
            </span>
          </button>
        </div>

        {/* Right: Zoom & Specs */}
        <div className="flex items-center space-x-3 text-[#71685E] dark:text-slate-400">
          <span className="hidden xl:inline text-[11px] font-mono">
            {totalLeaves} Leaves &bull; {totalSignatures} Sigs &bull; Spine: {estimatedSpineThicknessMm}mm
          </span>

          <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-[#CBBEAC]/80 dark:border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-[#EDE4D6] rounded text-[#71685E]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-xs font-bold text-[#5A1832] dark:text-[#C29A52]">
              {settings.zoomPercent}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-[#EDE4D6] rounded text-[#71685E]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitPage}
              className="px-1.5 py-0.5 text-[10px] font-mono hover:bg-[#EDE4D6] rounded"
            >
              Fit
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE: THREE-AREA STRUCTURE */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
        {/* LEFT AREA: Book / Page Structure */}
        <BookPageStructureNav
          pages={pages}
          activePageIndex={safeActivePageIndex}
          onSelectPage={(idx) => setActivePageIndex(idx)}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
          isDarkMode={isDarkMode}
          topics={currentBook.topics || []}
          onReorderChapters={handleReorderChapters}
          onOpenReorderModal={() => setIsReorderModalOpen(true)}
        />

        {/* CENTRE AREA: Publication Page Canvas */}
        <PublicationPageCanvas
          page={activePage}
          facingPage={facingPage}
          settings={settings}
          zoomPercent={settings.zoomPercent}
          isProofMode={isProofMode}
          onNavigateToPage={(idx) => setActivePageIndex(idx)}
        />

        {/* RIGHT AREA: Layout Inspector / Production Controls */}
        <LayoutInspector
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          preflightIssues={preflightIssues}
          onNavigateToPage={(idx) => setActivePageIndex(idx)}
          isCollapsed={isRightCollapsed}
          onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
          onExportDocx={handleExportDocx}
          onExportPrintPdf={handleDirectPrint}
          onExportDigitalPdf={handleDirectPrint}
          onExportProofPdf={handleExportProofPdf}
          onOpenHandoffModal={() => setShowHandoffModal(true)}
          activePageIndex={safeActivePageIndex}
          totalPageCount={pages.length}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Publisher Handoff Package Prepress Dossier Modal */}
      {showHandoffModal && (
        <PublisherHandoffModal
          currentBook={currentBook}
          seriesProject={seriesProject}
          settings={settings}
          pages={pages}
          preflightIssues={preflightIssues}
          totalLeaves={totalLeaves}
          totalSignatures={totalSignatures}
          estimatedSpineThicknessMm={estimatedSpineThicknessMm}
          onClose={() => setShowHandoffModal(false)}
          onExportPrintPdf={handleDirectPrint}
          onExportDocx={handleExportDocx}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Chapter Drag-and-Drop Reorder Studio Modal */}
      {isReorderModalOpen && (
        <ReorderChaptersModal
          currentBook={currentBook}
          topics={currentBook.topics || []}
          onApplyReorder={handleReorderChapters}
          onClose={() => setIsReorderModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
