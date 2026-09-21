import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldAlert,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { GrammarTopic, DevelopmentalTier } from '../../types';
import {
  TIER_METADATA,
  groupTopicQuestionsByTier,
  generateDifferentiatedWorksheetHtml,
  generateWorksheetDocContent,
  DifferentiatedWorksheetConfig,
} from '../../utils/differentiatedTiering';

interface DifferentiatedWorksheetStudioModalProps {
  topic: GrammarTopic;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const DifferentiatedWorksheetStudioModal: React.FC<
  DifferentiatedWorksheetStudioModalProps
> = ({ topic, isOpen, onClose, isDarkMode }) => {
  const [mode, setMode] = useState<'dual_tracks' | 'mixed_classroom_master'>(
    'dual_tracks'
  );
  const [selectedTier, setSelectedTier] = useState<DevelopmentalTier>('foundation');
  const [includeFormulasSheet, setIncludeFormulasSheet] = useState(true);
  const [includeHints, setIncludeHints] = useState(true);
  const [includeTeacherAnswerKey, setIncludeTeacherAnswerKey] = useState(false);
  const [includeRemediationRubric, setIncludeRemediationRubric] = useState(true);
  const [schoolName, setSchoolName] = useState('Cambridge International School');
  const [teacherName, setTeacherName] = useState('Department of English');
  const [worksheetTitle, setWorksheetTitle] = useState(
    `${topic.title} - Differentiated Practice Worksheet`
  );
  const [dueDate, setDueDate] = useState('Next Class Session');
  const [hasCopied, setHasCopied] = useState(false);

  const printIframeRef = useRef<HTMLIFrameElement>(null);

  if (!isOpen) return null;

  const { foundation, standard, advanced } = groupTopicQuestionsByTier(topic);

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
    dueDate,
  };

  const previewHtml = generateDifferentiatedWorksheetHtml(topic, currentConfig);

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
    }, 300);
  };

  const handleDownloadDocx = () => {
    const blob = generateWorksheetDocContent(topic, currentConfig);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const tierSuffix = mode === 'dual_tracks' ? `_${selectedTier}` : '_mixed_master';
    a.download = `${topic.title.replace(/\s+/g, '_')}${tierSuffix}_worksheet.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = previewHtml;
    const text = tempDiv.innerText || tempDiv.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div
      id="differentiated-worksheet-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 md:p-6 overflow-hidden"
    >
      <iframe ref={printIframeRef} className="hidden" title="Print Frame" />

      <div className="w-full max-w-6xl h-[92vh] bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-stone-50/70 dark:bg-slate-900/70 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">
                  Differentiated Learning Studio &amp; Worksheet Exporter
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  {topic.classLevel}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                Unit: <strong className="text-stone-700 dark:text-slate-300">{topic.title}</strong> &bull; Dual Homework Tracks &amp; Mixed-Ability Progressive Classroom Packets
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Content Area: Split View (Settings Left, Live Preview Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Controls Column */}
          <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-slate-800 p-5 space-y-5 bg-stone-50/40 dark:bg-slate-900/30 overflow-y-auto shrink-0">
            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>Export Configuration Mode</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('dual_tracks')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === 'dual_tracks'
                      ? 'border-amber-600 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-2xs font-semibold'
                      : 'border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold">Dual Homework Tracks</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-1">
                    Export targeted track per ability group (Foundation / Standard / Advanced).
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('mixed_classroom_master')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === 'mixed_classroom_master'
                      ? 'border-amber-600 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-2xs font-semibold'
                      : 'border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold">Mixed-Ability Master</div>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-1">
                    Single scaffolded packet with progressive Tiers 1–3 + Teacher Rubric.
                  </div>
                </button>
              </div>
            </div>

            {/* If in Dual Tracks mode, select Tier Track */}
            {mode === 'dual_tracks' && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Select Target Tier Track
                </label>

                <div className="space-y-2">
                  {(['foundation', 'standard', 'advanced'] as DevelopmentalTier[]).map((tier) => {
                    const meta = TIER_METADATA[tier];
                    const count =
                      tier === 'foundation'
                        ? foundation.length
                        : tier === 'standard'
                        ? standard.length
                        : advanced.length;
                    const isSelected = selectedTier === tier;

                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                          isSelected
                            ? `${meta.badgeBorder} ${meta.badgeBg} shadow-2xs font-semibold`
                            : 'border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:border-stone-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-bold ${isSelected ? meta.badgeText : ''}`}>
                              {meta.label}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300 font-mono">
                              {count} items
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-1">
                            {meta.sublabel}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Worksheet Header &amp; Scaffolding Options
              </label>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 dark:text-slate-400 mb-0.5">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 dark:text-slate-400 mb-0.5">
                    Worksheet Title
                  </label>
                  <input
                    type="text"
                    value={worksheetTitle}
                    onChange={(e) => setWorksheetTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 dark:text-slate-400 mb-0.5">
                    Due / Session Date
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFormulasSheet}
                    onChange={(e) => setIncludeFormulasSheet(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700 dark:text-slate-300">
                    Include Formula Reference Anchor
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHints}
                    onChange={(e) => setIncludeHints(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700 dark:text-slate-300">
                    Include Scaffolding Cues / Hints (Foundation)
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTeacherAnswerKey}
                    onChange={(e) => setIncludeTeacherAnswerKey(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-stone-700 dark:text-slate-300 font-medium">
                    Include Teacher Solution Key &amp; Remediation Notes
                  </span>
                </label>

                {mode === 'mixed_classroom_master' && (
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRemediationRubric}
                      onChange={(e) => setIncludeRemediationRubric(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-stone-700 dark:text-slate-300">
                      Include Teacher Differentiation Rubric Table
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  className="py-2 px-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Word (.doc)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="py-2 px-3 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Paper Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-100 dark:bg-slate-950 p-4 md:p-6">
            <div className="flex items-center justify-between pb-3 text-xs text-stone-500 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-stone-700 dark:text-slate-300">
                  Live Print Simulation (A4 / Crown Quarto Format)
                </span>
              </div>
              <span className="text-[11px] font-mono">
                {mode === 'dual_tracks'
                  ? `Track: ${TIER_METADATA[selectedTier].label}`
                  : 'Mode: Progressive 3-Tier Classroom Master'}
              </span>
            </div>

            {/* Paper Container */}
            <div className="flex-1 overflow-y-auto rounded-xl border border-stone-300 dark:border-slate-800 bg-stone-200/50 dark:bg-slate-900/50 p-4 md:p-6 flex justify-center shadow-inner">
              <div
                className="w-full max-w-[800px] bg-white text-stone-900 p-8 rounded-lg shadow-xl border border-stone-200 min-h-full"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
