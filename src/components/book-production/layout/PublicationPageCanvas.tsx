import React from 'react';
import {
  BookProductionSettings,
  PaginatedPage,
  RenderableBlock,
  TRIM_PRESET_MAP,
} from '../../../types/bookLayoutTypes';
import {
  BookOpen,
  Award,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  Info,
  ShieldCheck,
  FileText,
  Layers,
} from 'lucide-react';

interface PublicationPageCanvasProps {
  page: PaginatedPage;
  facingPage?: PaginatedPage | null; // For facing spreads
  settings: BookProductionSettings;
  zoomPercent: number; // 50 to 150
  isProofMode: boolean; // whether print guides are visible
  onNavigateToPage?: (index: number) => void;
}

export const PublicationPageCanvas: React.FC<PublicationPageCanvasProps> = ({
  page,
  facingPage,
  settings,
  zoomPercent,
  isProofMode,
  onNavigateToPage,
}) => {
  const trim =
    settings.trimPreset === 'custom'
      ? {
          name: 'Custom',
          widthMm: settings.customWidthMm || 189,
          heightMm: settings.customHeightMm || 246,
        }
      : TRIM_PRESET_MAP[settings.trimPreset] || TRIM_PRESET_MAP.crown_quarto;

  // Base canvas scale: 1 mm = ~3.78 px at 96 DPI screen
  const pxPerMm = 3.6;
  const zoomFactor = zoomPercent / 100;

  const pageBaseWidthPx = trim.widthMm * pxPerMm;
  const pageBaseHeightPx = trim.heightMm * pxPerMm;

  // Scaled dimensions (NO CSS transform: scale() on the root module!)
  const pageWidthPx = pageBaseWidthPx * zoomFactor;
  const pageHeightPx = pageBaseHeightPx * zoomFactor;

  // Bleed in px
  const bleedPx = settings.bleed.bleedMm * pxPerMm * zoomFactor;

  // Paper background tint
  const paperBg =
    settings.paperTint === 'cream'
      ? '#FDFBF7'
      : settings.paperTint === 'ivory'
      ? '#FAF8F2'
      : '#FFFFFF';

  // Render an individual page sheet
  const renderPageSheet = (targetPage: PaginatedPage, isSpreadSecond = false) => {
    const isVerso = targetPage.isVerso;
    const geom = settings.geometry;

    // Mirrored margins calculation in px
    const leftMarginMm = isVerso
      ? geom.outsideMarginMm
      : geom.insideMarginMm + geom.gutterMm;
    const rightMarginMm = isVerso
      ? geom.insideMarginMm + geom.gutterMm
      : geom.outsideMarginMm;

    const leftMarginPx = leftMarginMm * pxPerMm * zoomFactor;
    const rightMarginPx = rightMarginMm * pxPerMm * zoomFactor;
    const topMarginPx = geom.topMarginMm * pxPerMm * zoomFactor;
    const bottomMarginPx = geom.bottomMarginMm * pxPerMm * zoomFactor;

    // Running Header text
    const showHeader =
      !targetPage.isCoverOrTitle &&
      targetPage.masterPageId !== 'chapter_opener' &&
      targetPage.masterPageId !== 'blank_page' &&
      targetPage.pageType !== 'blank_verso';

    const headerText = isVerso
      ? settings.runningHeaders.leftCustomText ||
        targetPage.unitTitle ||
        'VERITAS ACADEMIC GRAMMAR'
      : settings.runningHeaders.rightCustomText ||
        targetPage.chapterTitle ||
        'GRAMMAR & CONCORD';

    // Page number folio
    const showFolio =
      !targetPage.isCoverOrTitle &&
      targetPage.displayPageNumber.length > 0 &&
      !(settings.pageNumbers.suppressOnChapterOpener && targetPage.masterPageId === 'chapter_opener');

    return (
      <div
        id={`page-sheet-${targetPage.pageIndex}`}
        className="relative bg-white shadow-xl transition-all duration-200 select-text flex flex-col shrink-0"
        style={{
          width: `${pageWidthPx}px`,
          height: `${pageHeightPx}px`,
          backgroundColor: paperBg,
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        {/* ======================================================== */}
        {/* NON-PRINTING PROOF GUIDES OVERLAY */}
        {/* ======================================================== */}
        {isProofMode && settings.guides.showTrim && (
          <div
            className="absolute inset-0 pointer-events-none border border-black/30 z-40"
            title="Trim Edge Line"
          />
        )}

        {isProofMode && settings.guides.showBleed && settings.bleed.bleedMm > 0 && (
          <div
            className="absolute pointer-events-none border border-dashed border-rose-500/70 z-40"
            style={{
              top: `-${bleedPx}px`,
              bottom: `-${bleedPx}px`,
              left: `-${bleedPx}px`,
              right: `-${bleedPx}px`,
            }}
            title="3mm Bleed Line"
          />
        )}

        {isProofMode && settings.guides.showMargins && (
          <div
            className="absolute pointer-events-none border border-cyan-500/40 z-40"
            style={{
              top: `${topMarginPx}px`,
              bottom: `${bottomMarginPx}px`,
              left: `${leftMarginPx}px`,
              right: `${rightMarginPx}px`,
            }}
            title="Print Margin Boundaries"
          />
        )}

        {isProofMode && settings.guides.showSafeArea && (
          <div
            className="absolute pointer-events-none border border-emerald-500/30 border-dashed z-40"
            style={{
              top: `${topMarginPx + 10 * zoomFactor}px`,
              bottom: `${bottomMarginPx + 10 * zoomFactor}px`,
              left: `${leftMarginPx + 10 * zoomFactor}px`,
              right: `${rightMarginPx + 10 * zoomFactor}px`,
            }}
            title="Live Safe Type Area"
          />
        )}

        {isProofMode && settings.guides.showBaselineGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-30 opacity-15"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, #4f46e5, #4f46e5 1px, transparent 1px, transparent ${14 * zoomFactor}px)`,
            }}
          />
        )}

        {/* ======================================================== */}
        {/* RUNNING HEADER */}
        {/* ======================================================== */}
        {showHeader && (
          <div
            className="absolute z-20 flex items-center justify-between border-b border-[#CBBEAC]/50 text-[#71685E]"
            style={{
              top: `${(geom.headerDistanceMm || 10) * pxPerMm * zoomFactor}px`,
              left: `${leftMarginPx}px`,
              right: `${rightMarginPx}px`,
              fontSize: `${Math.max(7.5, (settings.typography.running_header?.fontSizePt || 8.5) * zoomFactor * 0.95)}px`,
              fontFamily: 'serif',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              paddingBottom: `${2 * zoomFactor}px`,
            }}
          >
            {isVerso ? (
              <>
                <span className="font-semibold text-[#5A1832]">{headerText}</span>
                <span className="text-[9px] font-mono text-[#9A7438]">
                  {targetPage.unitTitle || 'UNIT OVERVIEW'}
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-mono text-[#9A7438]">
                  {targetPage.unitTitle || 'CHAPTER'}
                </span>
                <span className="font-semibold text-[#5A1832]">{headerText}</span>
              </>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE CONTENT CONTAINER (INSIDE MARGIN BOUNDARIES) */}
        {/* ======================================================== */}
        <div
          className="flex-1 flex flex-col relative overflow-hidden"
          style={{
            marginTop: `${topMarginPx}px`,
            marginBottom: `${bottomMarginPx}px`,
            marginLeft: `${leftMarginPx}px`,
            marginRight: `${rightMarginPx}px`,
          }}
        >
          {targetPage.isIntentionalBlank ? (
            <div className="flex-1 flex items-center justify-center text-center text-[#CBBEAC] italic text-xs">
              [ This page intentionally left blank for chapter opening ]
            </div>
          ) : targetPage.blocks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-[#CBBEAC] text-xs">
              [ Empty Page Sheet ]
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-3.5">
              {targetPage.blocks.map((block) => renderBlock(block, zoomFactor, targetPage))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* PAGE FOLIO / NUMBER */}
        {/* ======================================================== */}
        {showFolio && (
          <div
            className={`absolute z-20 font-serif font-bold text-[#5A1832] ${
              isVerso ? 'text-left' : 'text-right'
            }`}
            style={{
              bottom: `${(geom.footerDistanceMm || 10) * pxPerMm * zoomFactor}px`,
              left: isVerso ? `${leftMarginPx}px` : 'auto',
              right: isVerso ? 'auto' : `${rightMarginPx}px`,
              fontSize: `${Math.max(8, (settings.typography.page_number?.fontSizePt || 9) * zoomFactor)}px`,
            }}
          >
            {targetPage.displayPageNumber}
          </div>
        )}
      </div>
    );
  };

  // Render individual content blocks with high-fidelity publishing typography
  const renderBlock = (
    block: RenderableBlock,
    scale: number,
    currentPage: PaginatedPage
  ) => {
    switch (block.type) {
      case 'half_title':
        return (
          <div
            key={block.id}
            className="flex-1 flex flex-col justify-center items-center text-center px-4"
          >
            <h1
              className="font-serif font-bold text-[#5A1832] tracking-wide"
              style={{ fontSize: `${24 * scale}px`, lineHeight: 1.25 }}
            >
              {block.title}
            </h1>
            <div className="mt-4 w-12 h-0.5 bg-[#C29A52]" />
          </div>
        );

      case 'title_page':
        return (
          <div
            key={block.id}
            className="flex-1 flex flex-col justify-between items-center text-center py-6 px-4"
          >
            <div className="space-y-1">
              <span
                className="font-mono text-[#9A7438] uppercase tracking-widest font-bold"
                style={{ fontSize: `${9 * scale}px` }}
              >
                {block.metadata?.series || 'VERITAS ACADEMIC PUBLISHING'}
              </span>
              <div
                className="font-serif font-bold text-[#5A1832]"
                style={{ fontSize: `${26 * scale}px`, lineHeight: 1.2 }}
              >
                {block.title}
              </div>
              <p
                className="font-serif italic text-[#71685E]"
                style={{ fontSize: `${12 * scale}px` }}
              >
                {block.content}
              </p>
            </div>

            <div className="my-auto py-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#5A1832]/5 border border-[#C29A52]/30 flex items-center justify-center text-[#5A1832]">
                <BookOpen style={{ width: `${28 * scale}px`, height: `${28 * scale}px` }} />
              </div>
              <span
                className="mt-3 inline-block px-3 py-1 rounded-full bg-[#5A1832]/10 border border-[#5A1832]/20 font-bold text-[#5A1832]"
                style={{ fontSize: `${9 * scale}px` }}
              >
                {block.metadata?.edition || 'STUDENT COURSEBOOK'}
              </span>
            </div>

            <div className="border-t border-[#CBBEAC]/60 pt-4 w-full space-y-1 text-[#71685E]">
              <div
                className="font-mono uppercase font-bold text-[#5A1832]"
                style={{ fontSize: `${8.5 * scale}px` }}
              >
                {block.metadata?.board} Curricular Compliance
              </div>
              <div
                className="font-serif text-[#292521]"
                style={{ fontSize: `${8.5 * scale}px` }}
              >
                Veritas Academic Publishing Press &bull; London &bull; New York &bull; New Delhi
              </div>
            </div>
          </div>
        );

      case 'imprint_page':
        return (
          <div
            key={block.id}
            className="flex-1 flex flex-col justify-end text-[#71685E] font-serif space-y-2 pb-2"
            style={{ fontSize: `${8 * scale}px`, lineHeight: 1.4 }}
          >
            <div className="border-t border-[#CBBEAC]/50 pt-2 font-mono uppercase font-bold text-[#292521]">
              Cataloging &amp; Imprint Record
            </div>
            <pre className="font-sans whitespace-pre-wrap text-[10px] leading-relaxed text-[#524338]">
              {block.content}
            </pre>
          </div>
        );

      case 'toc':
        return (
          <div key={block.id} className="space-y-2">
            <div className="space-y-1.5 border-t border-[#CBBEAC]/60 pt-2">
              {block.tocEntries?.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-baseline justify-between text-[#292521] hover:text-[#5A1832] cursor-pointer group"
                  style={{ fontSize: `${10 * scale}px` }}
                >
                  <div className="flex items-baseline space-x-1.5 min-w-0">
                    <span className="font-bold text-[#5A1832] font-mono text-[9px]">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-serif font-medium truncate group-hover:underline">
                      {entry.title}
                    </span>
                  </div>
                  <div className="flex-1 mx-2 border-b border-dotted border-[#CBBEAC]" />
                  <span className="font-mono font-bold text-[#5A1832]">
                    {entry.pageNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chapter_opener':
        return (
          <div
            key={block.id}
            className="border-b border-[#CBBEAC]/80 pb-3.5 mb-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <span
                className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] font-mono font-bold tracking-widest uppercase"
                style={{ fontSize: `${8 * scale}px` }}
              >
                CHAPTER {block.metadata?.chapterNumber || '1'}
              </span>
              <span
                className="text-[#9A7438] font-mono font-bold uppercase tracking-wider"
                style={{ fontSize: `${8.5 * scale}px` }}
              >
                {block.metadata?.unitTitle}
              </span>
            </div>

            <h1
              className="font-serif font-bold text-[#5A1832] tracking-tight"
              style={{ fontSize: `${18 * scale}px`, lineHeight: 1.25 }}
            >
              {block.title}
            </h1>

            {block.content && (
              <p
                className="font-serif text-[#382D25] leading-relaxed italic"
                style={{ fontSize: `${9.5 * scale}px` }}
              >
                {block.content}
              </p>
            )}

            {block.metadata?.learningObjectives && block.metadata.learningObjectives.length > 0 && (
              <div
                className="bg-[#EDE4D6]/50 rounded-lg p-2 border border-[#CBBEAC]/60 space-y-1"
                style={{ fontSize: `${8.5 * scale}px` }}
              >
                <span className="font-mono font-bold text-[#9A7438] uppercase block">
                  Core Curricular Goals:
                </span>
                <ul className="list-disc list-inside text-[#524338] space-y-0.5">
                  {block.metadata.learningObjectives.map((obj: string, i: number) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'heading':
        return (
          <h2
            key={block.id}
            className="font-serif font-bold text-[#5A1832] border-b border-[#CBBEAC]/40 pb-1"
            style={{
              fontSize: `${(block.level === 1 ? 14 : 12) * scale}px`,
              lineHeight: 1.3,
            }}
          >
            {block.title}
          </h2>
        );

      case 'paragraph':
        return (
          <p
            key={block.id}
            className="font-serif text-[#292521] text-justify leading-relaxed"
            style={{ fontSize: `${10 * scale}px`, lineHeight: 1.48 }}
          >
            {block.content}
          </p>
        );

      case 'rule_card':
        return (
          <div
            key={block.id}
            className="rounded-lg bg-[#FAF8F2] border-l-3 border-[#5A1832] p-2.5 shadow-2xs space-y-1"
          >
            <div
              className="font-serif font-bold text-[#5A1832] flex items-center space-x-1.5"
              style={{ fontSize: `${10 * scale}px` }}
            >
              <span>{block.title}</span>
            </div>
            <p
              className="font-serif text-[#292521] leading-relaxed"
              style={{ fontSize: `${9.5 * scale}px` }}
            >
              {block.content}
            </p>
            {block.metadata?.examples && (
              <div
                className="mt-1.5 pl-2 border-l-2 border-[#C29A52] font-serif italic text-[#4B3F35]"
                style={{ fontSize: `${9 * scale}px` }}
              >
                {Array.isArray(block.metadata.examples)
                  ? block.metadata.examples.join(' • ')
                  : block.metadata.examples}
              </div>
            )}
          </div>
        );

      case 'callout':
        return (
          <div
            key={block.id}
            className="rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] p-2.5 space-y-1 shadow-2xs"
          >
            <div
              className="flex items-center space-x-1.5 font-bold font-mono uppercase text-[#9A7438]"
              style={{ fontSize: `${8.5 * scale}px` }}
            >
              {block.calloutType === 'common_error' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              ) : (
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{block.title || 'Pedagogical Note'}</span>
            </div>
            <p
              className="font-serif text-[#382D25] leading-relaxed"
              style={{ fontSize: `${9.5 * scale}px` }}
            >
              {block.content}
            </p>
          </div>
        );

      case 'figure':
        return (
          <div
            key={block.id}
            className="my-2 border border-[#CBBEAC] rounded-lg p-2.5 bg-white text-center space-y-1.5"
          >
            <div className="h-16 bg-[#EDE4D6]/40 rounded border border-dashed border-[#CBBEAC] flex items-center justify-center text-[#71685E]">
              <div className="flex items-center space-x-2 text-[10px] font-mono">
                <FileText className="w-4 h-4 text-[#5A1832]" />
                <span>[ Syntactic Tree / Concord Chart: {block.figureNumber} ]</span>
              </div>
            </div>
            <div
              className="font-serif italic text-[#524338]"
              style={{ fontSize: `${8.5 * scale}px` }}
            >
              <strong className="font-semibold text-[#5A1832] font-sans not-italic">
                {block.figureNumber}:
              </strong>{' '}
              {block.figureCaption}
            </div>
            {block.figureCredit && (
              <div
                className="font-mono text-[#9A7438]"
                style={{ fontSize: `${7.5 * scale}px` }}
              >
                Source: {block.figureCredit}
              </div>
            )}
          </div>
        );

      case 'teacher_annotation':
        return (
          <div
            key={block.id}
            className="rounded-lg bg-rose-50 border border-rose-300 p-2 text-rose-950 space-y-0.5"
          >
            <div
              className="flex items-center space-x-1 font-bold font-mono uppercase text-rose-800"
              style={{ fontSize: `${8 * scale}px` }}
            >
              <ShieldCheck className="w-3 h-3 text-rose-700" />
              <span>{block.title}</span>
            </div>
            <p className="font-serif text-[10px] leading-snug">{block.content}</p>
          </div>
        );

      case 'exercise':
        return (
          <div key={block.id} className="space-y-1">
            {block.title && (
              <div
                className="font-serif font-bold text-[#5A1832] flex items-center justify-between border-b border-[#CBBEAC]/50 pb-1"
                style={{ fontSize: `${11 * scale}px` }}
              >
                <span>{block.title}</span>
                {block.metadata?.marks && (
                  <span
                    className="font-mono font-bold text-[#9A7438]"
                    style={{ fontSize: `${9 * scale}px` }}
                  >
                    [{block.metadata.marks} Marks]
                  </span>
                )}
              </div>
            )}
            {block.content && (
              <div
                className="font-serif text-[#292521] leading-relaxed flex items-start justify-between"
                style={{ fontSize: `${9.5 * scale}px` }}
              >
                <span>{block.content}</span>
                {block.metadata?.marks && !block.title && (
                  <span className="font-mono text-[9px] text-[#9A7438] shrink-0 ml-2">
                    ({block.metadata.marks}m)
                  </span>
                )}
              </div>
            )}

            {/* Answer Space Lines or Box */}
            {block.metadata?.answerSpace === 'lines' && (
              <div className="space-y-1.5 my-1">
                <div className="w-full border-b border-[#CBBEAC]/60 border-dashed h-3" />
                <div className="w-full border-b border-[#CBBEAC]/60 border-dashed h-3" />
              </div>
            )}
            {block.metadata?.answerSpace === 'box' && (
              <div className="w-full border border-[#CBBEAC] rounded h-8 bg-stone-50/50 my-1" />
            )}

            {/* Teacher solution in Master mode */}
            {block.metadata?.showTeacherSolution && block.metadata?.solution && (
              <div className="text-[9px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 mt-1">
                <strong>Ans:</strong> {block.metadata.solution}
              </div>
            )}
          </div>
        );

      case 'assessment':
        return (
          <div key={block.id} className="space-y-1.5">
            {block.title && (
              <div className="border-2 border-[#5A1832] rounded-lg p-2.5 bg-[#FAF8F2] space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="font-serif font-bold text-[#5A1832]"
                    style={{ fontSize: `${12 * scale}px` }}
                  >
                    {block.title}
                  </span>
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-[#5A1832] text-white">
                    {block.metadata?.totalMarks} Marks
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#71685E] font-mono border-t border-[#CBBEAC] pt-1">
                  <span>Student: ____________________</span>
                  <span>Roll No: ________</span>
                  <span>Time: {block.metadata?.durationMinutes} Mins</span>
                </div>
              </div>
            )}
            {block.content && (
              <div
                className="font-serif text-[#292521] text-[10px] leading-snug flex items-baseline justify-between"
              >
                <span>{block.content}</span>
                <span className="font-mono text-[9px] text-[#9A7438]">
                  [{block.metadata?.marks || 1}m]
                </span>
              </div>
            )}
            {block.metadata?.showTeacherSolution && block.metadata?.solution && (
              <div className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <strong>Key:</strong> {block.metadata.solution}
              </div>
            )}
          </div>
        );

      case 'glossary':
        return (
          <div
            key={block.id}
            className={`${
              settings.twoColumnGlossary ? 'grid grid-cols-2 gap-3' : 'space-y-2'
            }`}
          >
            {block.glossaryEntries?.map((g, i) => (
              <div key={i} className="text-[9.5px] font-serif leading-snug">
                <strong className="font-bold text-[#5A1832]">{g.term}:</strong>{' '}
                <span className="text-[#382D25]">{g.definition}</span>{' '}
                <span className="font-mono text-[8px] text-[#9A7438]">
                  (p. {g.pageRefs.join(', ')})
                </span>
              </div>
            ))}
          </div>
        );

      case 'index':
        return (
          <div key={block.id} className="grid grid-cols-2 gap-2 text-[9.5px] font-serif">
            {block.indexEntries?.map((idxEntry, i) => (
              <div key={i} className="flex items-baseline justify-between border-b border-dotted border-[#CBBEAC]/50 pb-0.5">
                <span className="text-[#292521]">{idxEntry.term}</span>
                <span className="font-mono font-semibold text-[#5A1832] text-[8.5px]">
                  {idxEntry.pageNumbers.join(', ')}
                </span>
              </div>
            ))}
          </div>
        );

      case 'answer_key':
        return (
          <div key={block.id} className="space-y-2 text-[9px] font-serif">
            {block.answerKeyEntries?.map((entry, idx) => (
              <div key={idx} className="border border-[#CBBEAC]/60 rounded p-2 bg-stone-50/70">
                <div className="font-bold text-[#5A1832] font-mono text-[9px] uppercase border-b border-[#CBBEAC]/40 pb-0.5 mb-1">
                  {entry.chapterTitle}
                </div>
                <div className="grid grid-cols-2 gap-1 text-[8.5px]">
                  {entry.solutions.map((sol, sIdx) => (
                    <div key={sIdx} className="truncate">
                      <span className="font-bold text-[#71685E]">{sol.question}:</span>{' '}
                      <span className="text-[#292521]">{sol.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div key={block.id} className="text-xs text-[#71685E]">
            {block.content || block.title}
          </div>
        );
    }
  };

  return (
    <div
      id="publication-page-canvas-viewport"
      className="flex-1 overflow-auto flex items-center justify-center p-6 bg-stone-200/70 dark:bg-[#090e17] transition-colors"
    >
      <div className="flex flex-row items-center justify-center gap-6 select-text">
        {/* First Page Sheet (Verso if spread, or active single page) */}
        {renderPageSheet(page, false)}

        {/* Second Page Sheet (Recto facing spread if enabled and provided) */}
        {settings.canvasMode === 'spread' && facingPage && (
          renderPageSheet(facingPage, true)
        )}
      </div>
    </div>
  );
};
