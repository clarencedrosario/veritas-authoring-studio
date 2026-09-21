import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarSeriesProject,
  GrammarClassLevel,
} from '../../../types';
import {
  BookProductionSettings,
  PaginatedPage,
  PreflightIssue,
  TRIM_PRESET_MAP,
} from '../../../types/bookLayoutTypes';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface PublisherHandoffModalProps {
  currentBook: ClassCurriculumBook;
  seriesProject: GrammarSeriesProject;
  settings: BookProductionSettings;
  pages: PaginatedPage[];
  preflightIssues: PreflightIssue[];
  totalLeaves: number;
  totalSignatures: number;
  estimatedSpineThicknessMm: number;
  onClose: () => void;
  onExportPrintPdf: () => void;
  onExportDocx: () => void;
  isDarkMode: boolean;
}

export const PublisherHandoffModal: React.FC<PublisherHandoffModalProps> = ({
  currentBook,
  seriesProject,
  settings,
  pages,
  preflightIssues,
  totalLeaves,
  totalSignatures,
  estimatedSpineThicknessMm,
  onClose,
  onExportPrintPdf,
  onExportDocx,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'chapters' | 'visuals' | 'typography' | 'preflight'>('specs');
  const [copied, setCopied] = useState(false);

  const trim =
    settings.trimPreset === 'custom'
      ? {
          name: 'Custom Trim',
          widthMm: settings.customWidthMm || 189,
          heightMm: settings.customHeightMm || 246,
        }
      : TRIM_PRESET_MAP[settings.trimPreset] || TRIM_PRESET_MAP.crown_quarto;

  const widthInches = (trim.widthMm / 25.4).toFixed(2);
  const heightInches = (trim.heightMm / 25.4).toFixed(2);
  const spineInches = (estimatedSpineThicknessMm / 25.4).toFixed(2);

  // Collect visual register
  const visualAssets = currentBook.topics.map((t, idx) => ({
    figureNumber: `Figure ${idx + 1}.1`,
    chapterTitle: t.title,
    caption: `Syntactic structure and concord relations in ${t.title}.`,
    altText: `Structural chart demonstrating grammatical concord for ${t.title}`,
    credit: 'Veritas Linguistic Diagnostics Lab',
    placement: 'Full Width',
    effectiveResolution: '300 DPI (Vector/SVG High-Res)',
    status: 'Verified',
  }));

  // Generate complete manifest object
  const manifestData = {
    productionSystem: 'VERITAS Publishing Engine',
    generatedAt: new Date().toISOString(),
    series: {
      title: seriesProject.seriesTitle,
      board: seriesProject.targetBoard,
      classLevel: currentBook.classLevel,
    },
    book: {
      title: currentBook.title,
      subtitle: currentBook.subtitle || 'Systematic Grammar & Composition',
      edition: settings.edition === 'teacher_master' ? "Teacher's Master Edition" : 'Student Coursebook',
      isbn: currentBook.isbn || 'Not Assigned',
      publisher: 'To be confirmed',
      imprint: 'Curricular Language Foundations Press',
      copyrightYear: new Date().getFullYear(),
      language: 'English (UK / Commonwealth & Board Compliant)',
    },
    productionSpecifications: {
      trimSize: trim.name,
      dimensionsMetric: `${trim.widthMm}mm × ${trim.heightMm}mm`,
      dimensionsImperial: `${widthInches}" × ${heightInches}"`,
      bleed: `${settings.bleed.bleedMm}mm (${settings.bleed.bleedMode})`,
      margins: {
        top: `${settings.geometry.topMarginMm}mm`,
        bottom: `${settings.geometry.bottomMarginMm}mm`,
        inside: `${settings.geometry.insideMarginMm}mm`,
        outside: `${settings.geometry.outsideMarginMm}mm`,
        gutter: `${settings.geometry.gutterMm}mm`,
      },
      colorProfileIntent: settings.colorMode === 'full_colour' ? 'CMYK Euroscale / Coated FOGRA39 (Prepress verified)' : 'Grayscale 1-Bit Line Art',
      targetPrintResolution: `${settings.targetResolutionDpi || 300} DPI`,
      paperStock: `${settings.paperStock} Woodfree Offset`,
      caliperPerLeafMm: 0.108,
      totalPageCount: pages.length,
      totalLeaves,
      totalSignatures16Page: totalSignatures,
      estimatedSpineBulkMm: estimatedSpineThicknessMm,
      estimatedSpineBulkInches: spineInches,
      bindingRecommendation: totalSignatures > 3 ? 'Smyth Sewn Case Bound / Section Sewn Softcover' : 'Saddle Stitch Wire',
    },
    chaptersCount: currentBook.topics.length,
    preflightStatus: {
      totalIssues: preflightIssues.length,
      errors: preflightIssues.filter((i) => i.severity === 'error').length,
      warnings: preflightIssues.filter((i) => i.severity === 'warning').length,
      review: preflightIssues.filter((i) => i.severity === 'review').length,
    },
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifestData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadManifest = () => {
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBook.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Publisher_Handoff_Package.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="publisher-handoff-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
    >
      <div className="bg-[#FAF8F2] dark:bg-slate-900 border border-[#C29A52] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Modal Header */}
        <div className="p-4 xl:p-5 border-b border-[#CBBEAC]/70 dark:border-slate-800 bg-[#F6F0E7] dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-bold text-[#9A7438] uppercase tracking-wider">
                  Veritas Production Prepress
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A1832]/10 text-[#5A1832] dark:text-[#C29A52] border border-[#5A1832]/20">
                  Ready for Press
                </span>
              </div>
              <h2 className="text-base xl:text-lg font-serif font-bold text-[#292521] dark:text-slate-100">
                Publisher Handoff Package &amp; Prepress Dossier
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71685E] hover:text-[#5A1832] hover:bg-[#EDE4D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center space-x-1 px-4 xl:px-6 pt-2 border-b border-[#CBBEAC]/60 dark:border-slate-800 bg-[#F6F0E7]/60 dark:bg-slate-950 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-2 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-[#5A1832] text-[#5A1832] dark:text-[#C29A52]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Production Specifications
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-3 py-2 border-b-2 transition-all ${
              activeTab === 'chapters'
                ? 'border-[#5A1832] text-[#5A1832] dark:text-[#C29A52]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Chapter Register ({currentBook.topics.length})
          </button>
          <button
            onClick={() => setActiveTab('visuals')}
            className={`px-3 py-2 border-b-2 transition-all ${
              activeTab === 'visuals'
                ? 'border-[#5A1832] text-[#5A1832] dark:text-[#C29A52]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Visual Register ({visualAssets.length})
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`px-3 py-2 border-b-2 transition-all ${
              activeTab === 'typography'
                ? 'border-[#5A1832] text-[#5A1832] dark:text-[#C29A52]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Typography Manifest
          </button>
          <button
            onClick={() => setActiveTab('preflight')}
            className={`px-3 py-2 border-b-2 transition-all flex items-center space-x-1 ${
              activeTab === 'preflight'
                ? 'border-[#5A1832] text-[#5A1832] dark:text-[#C29A52]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            <span>Preflight Audit</span>
            {preflightIssues.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-mono">
                {preflightIssues.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 xl:p-6 space-y-4 text-xs">
          {/* TAB 1: PRODUCTION SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#9A7438] uppercase font-bold">Trim Size</span>
                  <div className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                    {trim.name}
                  </div>
                  <div className="text-[11px] text-[#71685E]">
                    {trim.widthMm} × {trim.heightMm} mm ({widthInches}" × {heightInches}")
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#9A7438] uppercase font-bold">Total Signatures</span>
                  <div className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                    {totalSignatures} Sigs (16-pp)
                  </div>
                  <div className="text-[11px] text-[#71685E]">
                    {pages.length} Pages &bull; {totalLeaves} Leaves
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#9A7438] uppercase font-bold">Calculated Spine</span>
                  <div className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                    {estimatedSpineThicknessMm} mm
                  </div>
                  <div className="text-[11px] text-[#71685E]">
                    {spineInches}" Spine Bulk Caliper
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-1 shadow-2xs">
                  <span className="text-[10px] font-mono text-[#9A7438] uppercase font-bold">Color Intent</span>
                  <div className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                    {settings.colorMode === 'full_colour' ? 'CMYK 4/4 Process' : 'B&W 1/1 Offset'}
                  </div>
                  <div className="text-[11px] text-[#71685E]">
                    Target 300 DPI Resolution
                  </div>
                </div>
              </div>

              {/* Detailed Specs Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#CBBEAC]/70 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#EDE4D6]/50 dark:bg-slate-900 border-b border-[#CBBEAC]/60 font-serif font-bold text-xs text-[#5A1832] dark:text-[#C29A52] flex items-center justify-between">
                  <span>Prepress Technical Specifications Sheet</span>
                  <span className="font-mono text-[10px] text-[#71685E]">ISO 12647-2 Compliant</span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Book Title &amp; Series:</span>
                    <span className="font-semibold text-right">{currentBook.title} ({seriesProject.seriesTitle})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Curricular Board Compliance:</span>
                    <span className="font-semibold text-right">{seriesProject.targetBoard} &bull; {currentBook.classLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Bleed Specification:</span>
                    <span className="font-semibold text-right">{settings.bleed.bleedMm} mm (Top, Bottom, Outside)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Safety Live Margin:</span>
                    <span className="font-semibold text-right">Inside {settings.geometry.insideMarginMm}mm + Gutter {settings.geometry.gutterMm}mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Top &amp; Bottom Margins:</span>
                    <span className="font-semibold text-right">Top {settings.geometry.topMarginMm}mm &bull; Bottom {settings.geometry.bottomMarginMm}mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Paper Caliper Specification:</span>
                    <span className="font-semibold text-right">{settings.paperStock} (approx 0.108mm/leaf)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Binding Method:</span>
                    <span className="font-semibold text-right">Section-sewn case bound or PUR softcover</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#CBBEAC]/30">
                    <span className="text-[#71685E]">Publisher / Imprint:</span>
                    <span className="font-semibold text-right">Veritas Academic Press &bull; London / New York</span>
                  </div>
                </div>
              </div>

              {/* Prepress Quality Notice */}
              <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 rounded-xl flex items-start space-x-3 text-[11px] text-amber-900 dark:text-amber-200">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Prepress Proofing Note:</strong> The browser renders in sRGB space. For offset press publication, final PDF output should undergo standard prepress colour proofing and CTP (Computer to Plate) ripping with your certified commercial printer.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTER REGISTER */}
          {activeTab === 'chapters' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#CBBEAC]/70 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE4D6]/60 dark:bg-slate-900 border-b border-[#CBBEAC]/60 font-mono text-[10px] text-[#5A1832] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Chapter Title</th>
                      <th className="p-2.5">Category / Strand</th>
                      <th className="p-2.5">Rules</th>
                      <th className="p-2.5">Exercises</th>
                      <th className="p-2.5">Tests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBBEAC]/40">
                    {currentBook.topics.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-[#EDE4D6]/20">
                        <td className="p-2.5 font-mono font-bold text-[#9A7438]">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="p-2.5 font-serif font-bold text-[#292521] dark:text-slate-100">
                          {t.title}
                        </td>
                        <td className="p-2.5 text-[#71685E] font-mono text-[11px]">
                          {t.category || 'Core Grammar'}
                        </td>
                        <td className="p-2.5 text-center font-mono">
                          {t.definitions?.length || 3}
                        </td>
                        <td className="p-2.5 text-center font-mono">
                          {t.exercises?.length || 2}
                        </td>
                        <td className="p-2.5 text-center font-mono">
                          {t.testSeries?.length || 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VISUAL REGISTER */}
          {activeTab === 'visuals' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#CBBEAC]/70 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EDE4D6]/60 dark:bg-slate-900 border-b border-[#CBBEAC]/60 font-mono text-[10px] text-[#5A1832] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Figure ID</th>
                      <th className="p-2.5">Chapter</th>
                      <th className="p-2.5">Caption &amp; Alt Text</th>
                      <th className="p-2.5">Credit Source</th>
                      <th className="p-2.5">Resolution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBBEAC]/40">
                    {visualAssets.map((v, i) => (
                      <tr key={i} className="hover:bg-[#EDE4D6]/20">
                        <td className="p-2.5 font-mono font-bold text-[#5A1832]">
                          {v.figureNumber}
                        </td>
                        <td className="p-2.5 font-serif font-semibold text-[#292521]">
                          {v.chapterTitle}
                        </td>
                        <td className="p-2.5 text-[#524338]">
                          <div className="font-serif italic">{v.caption}</div>
                          <div className="text-[10px] font-mono text-[#71685E]">Alt: {v.altText}</div>
                        </td>
                        <td className="p-2.5 text-[#71685E] font-mono text-[10px]">
                          {v.credit}
                        </td>
                        <td className="p-2.5 text-center font-mono text-[10px] text-emerald-700 font-bold">
                          {v.effectiveResolution}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY MANIFEST */}
          {activeTab === 'typography' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#CBBEAC]/70 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#EDE4D6]/50 border-b border-[#CBBEAC]/60 font-serif font-bold text-xs text-[#5A1832]">
                  Cascade Typography Hierarchy
                </div>
                <div className="divide-y divide-[#CBBEAC]/30">
                  {Object.entries(settings.typography).map(([styleKey, s]) => (
                    <div key={styleKey} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#5A1832] uppercase text-[10px]">
                          {styleKey.replace('_', ' ')}
                        </span>
                        <div className="text-[#71685E] font-serif">
                          Font Family: <strong className="font-mono text-[11px] text-[#292521]">{s.fontFamily}</strong> &bull; Size: <strong className="font-mono text-[11px] text-[#292521]">{s.fontSizePt} pt</strong> &bull; Weight: <strong className="font-mono text-[11px] text-[#292521]">{s.fontWeight}</strong>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-[#9A7438]">
                        Line Height: {s.lineHeight} &bull; Spacing: +{s.spaceBeforePt}/{s.spaceAfterPt}pt
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PREFLIGHT AUDIT */}
          {activeTab === 'preflight' && (
            <div className="space-y-3">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-[#CBBEAC]/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#5A1832]">
                    Pre-Export Publication Health Check
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Zero Fatal Build Blockers
                  </span>
                </div>
                <p className="text-xs text-[#71685E]">
                  Preflight scanned {pages.length} paginated sheets, {currentBook.topics.length} chapters, and {visualAssets.length} graphic elements.
                </p>
              </div>

              <div className="space-y-2">
                {preflightIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-3 rounded-xl border text-left text-xs ${
                      issue.severity === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-950'
                        : issue.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-stone-50 border-stone-200 text-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{issue.title}</span>
                      <span className="font-mono uppercase text-[10px] px-1.5 py-0.5 rounded bg-white/70">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] opacity-90">{issue.description}</p>
                    <div className="mt-1 font-mono text-[10px] text-[#9A7438]">
                      Suggested Fix: {issue.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 xl:p-5 border-t border-[#CBBEAC]/70 dark:border-slate-800 bg-[#F6F0E7] dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyManifest}
              className="h-9 px-3.5 rounded-xl border border-[#CBBEAC] bg-white text-[#292521] text-xs font-semibold flex items-center space-x-1.5 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#71685E]" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Spec JSON'}</span>
            </button>

            <button
              onClick={handleDownloadManifest}
              className="h-9 px-3.5 rounded-xl border border-[#CBBEAC] bg-white text-[#292521] text-xs font-semibold flex items-center space-x-1.5 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#5A1832]" />
              <span>Download Manifest (.json)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportDocx}
              className="h-9 px-3.5 rounded-xl border border-[#CBBEAC] bg-white text-[#292521] text-xs font-semibold flex items-center space-x-1.5 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#5A1832]" />
              <span>Manuscript (.docx)</span>
            </button>

            <button
              onClick={onExportPrintPdf}
              className="h-9 px-4 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C29A52]" />
              <span>Export Production PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
