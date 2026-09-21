import React, { useState, useRef, useMemo } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Eye,
  FileText,
  AlertCircle,
  HelpCircle,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  DevelopmentalTier,
} from '../../types';
import {
  TIER_METADATA,
  groupTopicQuestionsByTier,
  generateDifferentiatedWorksheetHtml,
  generateWorksheetDocContent,
  DifferentiatedWorksheetConfig,
} from '../../utils/differentiatedTiering';

interface DifferentiatedWorksheetsViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
}

type DocumentZoomPreset = 'fit_page' | 'fit_width' | '75%' | '100%' | '125%';

export const DifferentiatedWorksheetsView: React.FC<DifferentiatedWorksheetsViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
}) => {
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 7'
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [mode, setMode] = useState<'dual_tracks' | 'mixed_classroom_master'>('dual_tracks');
  const [selectedTier, setSelectedTier] = useState<DevelopmentalTier>('foundation');
  const [includeFormulasSheet, setIncludeFormulasSheet] = useState(true);
  const [includeHints, setIncludeHints] = useState(true);
  const [includeTeacherAnswerKey, setIncludeTeacherAnswerKey] = useState(false);
  const [includeRemediationRubric, setIncludeRemediationRubric] = useState(true);
  const [schoolName, setSchoolName] = useState('Cambridge International School');
  const [teacherName, setTeacherName] = useState('Department of English');
  const [hasCopied, setHasCopied] = useState(false);

  // Document-only zoom controls
  const [zoomSetting, setZoomSetting] = useState<DocumentZoomPreset>('100%');

  const printIframeRef = useRef<HTMLIFrameElement>(null);

  const allClasses: GrammarClassLevel[] = [
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12',
  ];

  const currentBook = seriesProject.books[selectedClass] || {
    classLevel: selectedClass,
    title: `${seriesProject.seriesTitle} - ${selectedClass}`,
    topics: [],
  };

  const activeTopic: GrammarTopic | undefined =
    currentBook.topics.find((t) => t.id === selectedTopicId) || currentBook.topics[0];

  const worksheetTitle = activeTopic
    ? `${activeTopic.title} - Differentiated Practice Worksheet`
    : 'Differentiated Practice Worksheet';

  const currentConfig: DifferentiatedWorksheetConfig = {
    mode,
    selectedTier,
    includeFormulasSheet,
    includeHints,
    includeTeacherAnswerKey,
    includeRemediationRubric,
    schoolName,
    teacherName,
    worksheetTitle,
    dueDate: 'Next Class Session',
  };

  const previewHtml = useMemo(() => {
    if (!activeTopic) return '';
    return generateDifferentiatedWorksheetHtml(activeTopic, currentConfig);
  }, [activeTopic, currentConfig]);

  const handlePrint = () => {
    if (!printIframeRef.current) return;
    const doc = printIframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(previewHtml);
    doc.close();
    setTimeout(() => {
      printIframeRef.current?.contentWindow?.focus();
      printIframeRef.current?.contentWindow?.print();
    }, 250);
  };

  const handleDownloadDoc = () => {
    if (!activeTopic) return;
    const blob = generateWorksheetDocContent(activeTopic, currentConfig);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTopic.title.replace(/[\s/]+/g, '_')}_Differentiated_${selectedTier}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    if (!activeTopic) return;
    try {
      const blob = generateWorksheetDocContent(activeTopic, currentConfig);
      const text = await blob.text();
      navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Sizing styles for document-only zoom
  const getDocumentContainerClass = () => {
    switch (zoomSetting) {
      case 'fit_page':
        return 'w-full max-w-[640px] shadow-md transition-all duration-200';
      case 'fit_width':
        return 'w-full max-w-5xl shadow-xl transition-all duration-200';
      case '75%':
        return 'w-full max-w-[690px] shadow-md transition-all duration-200';
      case '100%':
        return 'w-full max-w-[860px] shadow-lg transition-all duration-200';
      case '125%':
        return 'w-full max-w-[1080px] shadow-xl transition-all duration-200';
      default:
        return 'w-full max-w-[860px] shadow-lg transition-all duration-200';
    }
  };

  const zoomPresets: { label: string; value: DocumentZoomPreset }[] = [
    { label: 'Fit Width', value: 'fit_width' },
    { label: 'Fit Page', value: 'fit_page' },
    { label: '75%', value: '75%' },
    { label: '100%', value: '100%' },
    { label: '125%', value: '125%' },
  ];

  return (
    <div
      id="differentiated-worksheets-studio-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] select-none"
    >
      {/* Editorial Subheader */}
      <header className="h-14 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-[#71685E] dark:text-[#c9b9a6] hidden sm:inline">
              Class Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => {
                const cls = e.target.value as GrammarClassLevel;
                setSelectedClass(cls);
                const book = seriesProject.books[cls];
                if (book && book.topics.length > 0) setSelectedTopicId(book.topics[0].id);
              }}
              className="bg-white dark:bg-[#24111d] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer shadow-xs"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4d2b3b]">
            {seriesProject.targetBoard}
          </span>
          <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-serif hidden md:inline">
            Differentiated Scaffolding Studio
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-medium text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            {hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />}
            <span>{hasCopied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownloadDoc}
            className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-medium text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
            <span>Download TXT</span>
          </button>
          <button
            onClick={handlePrint}
            className="h-9 px-4 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-white text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Worksheet</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Left Control Configuration & Chapter Picker -> Right Typeset Worksheet Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Configuration Panel */}
        <aside className="w-84 border-r border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] flex flex-col shrink-0 overflow-y-auto p-5 space-y-5">
          {/* Chapter Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
              Curriculum Unit
            </label>
            <select
              value={activeTopic?.id || ''}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6]/30 dark:bg-[#1e0f18] text-sm font-medium text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              {currentBook.topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Differentiation Track / Mode */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
              Worksheet Strategy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('dual_tracks')}
                className={`p-3 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  mode === 'dual_tracks'
                    ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#5A1832]/10 dark:bg-[#C29A52]/15 text-[#5A1832] dark:text-[#F6F0E7]'
                    : 'border-[#CBBEAC] dark:border-[#4d2b3b] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]/40'
                }`}
              >
                <div className="font-bold text-sm">Single Track</div>
                <div className="text-xs opacity-85 mt-0.5">Foundation, Standard, or Advanced</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('mixed_classroom_master')}
                className={`p-3 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  mode === 'mixed_classroom_master'
                    ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#5A1832]/10 dark:bg-[#C29A52]/15 text-[#5A1832] dark:text-[#F6F0E7]'
                    : 'border-[#CBBEAC] dark:border-[#4d2b3b] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]/40'
                }`}
              >
                <div className="font-bold text-sm">Mixed Master</div>
                <div className="text-xs opacity-85 mt-0.5">All 3 tiers progressive worksheet</div>
              </button>
            </div>
          </div>

          {/* Tier Selector (when single track) */}
          {mode === 'dual_tracks' && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
                Target Developmental Tier
              </label>
              <div className="space-y-2">
                {(['foundation', 'standard', 'advanced'] as DevelopmentalTier[]).map((tier) => {
                  const meta = TIER_METADATA[tier];
                  const isSelected = selectedTier === tier;

                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors flex items-start space-x-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#5A1832]/10 dark:bg-[#C29A52]/15'
                          : 'border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6]/40'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#5A1832] dark:bg-[#C29A52] text-white'
                            : 'border-[#CBBEAC]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[#292521] dark:text-[#F6F0E7]">
                          {meta.label}
                        </div>
                        <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                          {meta.sublabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scaffolding Features */}
          <div className="space-y-3 pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
              Pedagogical Scaffolding Elements
            </label>

            <label className="flex items-center space-x-2.5 text-sm text-[#292521] dark:text-[#F6F0E7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeFormulasSheet}
                onChange={(e) => setIncludeFormulasSheet(e.target.checked)}
                className="rounded border-[#CBBEAC] text-[#5A1832] w-4 h-4 cursor-pointer"
              />
              <span>Include Syntax Formula Anchor Sheet</span>
            </label>

            <label className="flex items-center space-x-2.5 text-sm text-[#292521] dark:text-[#F6F0E7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeHints}
                onChange={(e) => setIncludeHints(e.target.checked)}
                className="rounded border-[#CBBEAC] text-[#5A1832] w-4 h-4 cursor-pointer"
              />
              <span>Include Word Bank &amp; Bracketed Hints</span>
            </label>

            <label className="flex items-center space-x-2.5 text-sm text-[#292521] dark:text-[#F6F0E7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeRemediationRubric}
                onChange={(e) => setIncludeRemediationRubric(e.target.checked)}
                className="rounded border-[#CBBEAC] text-[#5A1832] w-4 h-4 cursor-pointer"
              />
              <span>Include Error Analysis Rubric</span>
            </label>

            <label className="flex items-center space-x-2.5 text-sm text-[#292521] dark:text-[#F6F0E7] cursor-pointer">
              <input
                type="checkbox"
                checked={includeTeacherAnswerKey}
                onChange={(e) => setIncludeTeacherAnswerKey(e.target.checked)}
                className="rounded border-[#CBBEAC] text-[#5A1832] w-4 h-4 cursor-pointer"
              />
              <span>Append Teacher Marking Scheme &amp; Key</span>
            </label>
          </div>

          {/* School Header Customization */}
          <div className="space-y-2.5 pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
            <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
              Institution Header
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School or Institution Name"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6]/30 dark:bg-[#1e0f18] text-sm text-[#292521] dark:text-[#F6F0E7] outline-none"
            />
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Department or Teacher Name"
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6]/30 dark:bg-[#1e0f18] text-sm text-[#292521] dark:text-[#F6F0E7] outline-none"
            />
          </div>
        </aside>

        {/* Right: Authentic Typeset Worksheet Preview with Document-Only Zoom Controls */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#EDE4D6]/40 dark:bg-[#1e0f18]/40">
          {/* Document Zoom Controls Toolbar */}
          <div className="h-11 px-4 sm:px-6 bg-[#F6F0E7] dark:bg-[#24111d] border-b border-[#CBBEAC] dark:border-[#4d2b3b] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span className="text-xs font-semibold text-[#292521] dark:text-[#F6F0E7]">
                Document Preview
              </span>
              <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] hidden sm:inline">
                • Standard A4 Editorial Typeset
              </span>
            </div>

            {/* Document-Only Zoom Controls */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] mr-1 hidden sm:inline">
                Zoom:
              </span>

              <div className="flex items-center space-x-1 bg-[#EDE4D6] dark:bg-[#1e0f18] p-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b]">
                {zoomPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setZoomSetting(preset.value)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      zoomSetting === preset.value
                        ? 'bg-white dark:bg-[#24111d] text-[#5A1832] dark:text-[#C29A52] shadow-xs'
                        : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Stage */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            <div className={`${getDocumentContainerClass()} h-full min-h-[900px] bg-white border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-2xl overflow-hidden flex flex-col`}>
              <iframe
                srcDoc={previewHtml}
                title="Differentiated Worksheet Preview"
                className="w-full flex-1 border-0 bg-white"
              />
            </div>
          </main>
        </div>
      </div>

      {/* Hidden Print Iframe */}
      <iframe ref={printIframeRef} title="print_frame" className="hidden" />
    </div>
  );
};

