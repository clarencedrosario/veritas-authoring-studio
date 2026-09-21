import React, { useState } from 'react';
import {
  BookProductionSettings,
  NamedStyleId,
  PreflightIssue,
  TRIM_PRESET_MAP,
  TrimPreset,
} from '../../../types/bookLayoutTypes';
import {
  Sliders,
  Type,
  Maximize2,
  FileCheck,
  Download,
  Printer,
  ChevronRight,
  Eye,
  Layers,
  Settings,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Save,
  RotateCcw,
} from 'lucide-react';
import { DESIGN_PRESET_PROFILES } from '../../../utils/bookLayoutDefaults';

interface LayoutInspectorProps {
  settings: BookProductionSettings;
  onUpdateSettings: (newSettings: BookProductionSettings) => void;
  preflightIssues: PreflightIssue[];
  onNavigateToPage: (pageIndex: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onExportDocx: () => void;
  onExportPrintPdf: () => void;
  onExportDigitalPdf: () => void;
  onExportProofPdf?: () => void;
  onOpenHandoffModal?: () => void;
  activePageIndex?: number;
  totalPageCount?: number;
  isDarkMode: boolean;
}

export const LayoutInspector: React.FC<LayoutInspectorProps> = ({
  settings,
  onUpdateSettings,
  preflightIssues,
  onNavigateToPage,
  isCollapsed,
  onToggleCollapse,
  onExportDocx,
  onExportPrintPdf,
  onExportDigitalPdf,
  onExportProofPdf,
  onOpenHandoffModal,
  activePageIndex = 0,
  totalPageCount = 1,
  isDarkMode,
}) => {
  type InspectorTab = 'geometry' | 'typography' | 'masters' | 'preflight' | 'export';
  const [activeTab, setActiveTab] = useState<InspectorTab>('geometry');
  const [selectedStyleId, setSelectedStyleId] = useState<NamedStyleId>('body');
  const [exportRange, setExportRange] = useState<'all' | 'chapter' | 'range'>('all');
  const [customRangeStart, setCustomRangeStart] = useState<number>(1);
  const [customRangeEnd, setCustomRangeEnd] = useState<number>(1);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [snapshots, setSnapshots] = useState<{ id: string; name: string; date: string; settings: BookProductionSettings }[]>(() => {
    try {
      const raw = localStorage.getItem('veritas_layout_snapshots');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      { id: 'snap-1', name: 'Layout Draft 1', date: 'Initial Baseline', settings },
      { id: 'snap-2', name: 'Academic Review Layout', date: 'Pre-production', settings },
    ];
  });

  const handleSaveSnapshot = () => {
    if (!newSnapshotName.trim()) return;
    const snap = {
      id: `snap-${Date.now()}`,
      name: newSnapshotName.trim(),
      date: new Date().toLocaleDateString(),
      settings: JSON.parse(JSON.stringify(settings)),
    };
    const updated = [snap, ...snapshots];
    setSnapshots(updated);
    try {
      localStorage.setItem('veritas_layout_snapshots', JSON.stringify(updated));
    } catch (e) {}
    setNewSnapshotName('');
  };

  const handleRestoreSnapshot = (snap: { settings: BookProductionSettings }) => {
    onUpdateSettings(snap.settings);
  };

  const errorCount = preflightIssues.filter((i) => i.severity === 'error').length;
  const warningCount = preflightIssues.filter((i) => i.severity === 'warning').length;

  // Apply a design preset
  const handleApplyPreset = (presetName: string) => {
    const profile = DESIGN_PRESET_PROFILES[presetName];
    if (profile) {
      onUpdateSettings({
        ...settings,
        ...profile,
        geometry: { ...settings.geometry, ...profile.geometry },
        bleed: { ...settings.bleed, ...profile.bleed },
      });
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-l border-[#CBBEAC]/70 dark:border-slate-800 bg-[#FAF8F2] dark:bg-slate-900 flex flex-col items-center py-4 space-y-4 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center hover:bg-[#35101F] transition-colors shadow-2xs"
          title="Expand Production Inspector"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <div className="writing-mode-vertical text-[11px] font-mono uppercase tracking-widest text-[#71685E] dark:text-slate-400 rotate-180">
          Layout Inspector
        </div>
      </div>
    );
  }

  const selectedStyle = settings.typography[selectedStyleId];

  return (
    <div
      id="book-production-inspector"
      className="w-80 xl:w-96 border-l border-[#CBBEAC]/80 dark:border-slate-800 bg-[#FAF8F2] dark:bg-slate-900/95 flex flex-col shrink-0 select-none text-xs"
    >
      {/* Top Header */}
      <div className="p-3 border-b border-[#CBBEAC]/60 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
          <span className="font-serif font-bold text-[#292521] dark:text-slate-100 text-sm">
            Production Inspector
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-[#71685E] hover:text-[#5A1832] dark:hover:text-white"
          title="Collapse inspector panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-5 p-1 border-b border-[#CBBEAC]/40 dark:border-slate-800 text-[11px] font-semibold gap-1 bg-[#EDE4D6]/40 dark:bg-slate-950">
        <button
          onClick={() => setActiveTab('geometry')}
          className={`py-1.5 rounded text-center transition-all ${
            activeTab === 'geometry'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
          title="Format & Geometry"
        >
          Format
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`py-1.5 rounded text-center transition-all ${
            activeTab === 'typography'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
          title="Typography Cascade"
        >
          Type
        </button>
        <button
          onClick={() => setActiveTab('masters')}
          className={`py-1.5 rounded text-center transition-all ${
            activeTab === 'masters'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
          title="Master Pages & Headers"
        >
          Masters
        </button>
        <button
          onClick={() => setActiveTab('preflight')}
          className={`py-1.5 rounded text-center transition-all relative ${
            activeTab === 'preflight'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
          title="Preflight Engine"
        >
          Preflight
          {errorCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`py-1.5 rounded text-center transition-all ${
            activeTab === 'export'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
          title="Export Centre"
        >
          Export
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ======================================================== */}
        {/* TAB 1: FORMAT & GEOMETRY */}
        {/* ======================================================== */}
        {activeTab === 'geometry' && (
          <div className="space-y-4">
            {/* Design Presets Dropdown */}
            <div className="space-y-1.5 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-[#CBBEAC]/70 dark:border-slate-800">
              <span className="font-mono uppercase font-bold text-[10px] text-[#9A7438]">
                Standard Design Presets
              </span>
              <select
                value={settings.presetName}
                onChange={(e) => handleApplyPreset(e.target.value)}
                className="w-full bg-[#EDE4D6]/40 dark:bg-slate-800 border border-[#CBBEAC] dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-serif font-bold text-[#5A1832] dark:text-[#C29A52] outline-none cursor-pointer"
              >
                {Object.keys(DESIGN_PRESET_PROFILES).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trim Size Presets */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#292521] dark:text-slate-200 block">
                Trim Dimensions &amp; Size
              </label>
              <select
                value={settings.trimPreset}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    trimPreset: e.target.value as TrimPreset,
                  })
                }
                className="w-full bg-white dark:bg-slate-800 border border-[#CBBEAC] dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-[#292521] dark:text-slate-200 outline-none"
              >
                {Object.entries(TRIM_PRESET_MAP).map(([key, dim]) => (
                  <option key={key} value={key}>
                    {dim.name} ({dim.inches} / {dim.widthMm}×{dim.heightMm} mm)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom dimensions if selected */}
            {settings.trimPreset === 'custom' && (
              <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-[#CBBEAC]">
                <div>
                  <span className="text-[10px] text-[#71685E]">Width (mm)</span>
                  <input
                    type="number"
                    value={settings.customWidthMm || 189}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        customWidthMm: parseFloat(e.target.value) || 189,
                      })
                    }
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E]">Height (mm)</span>
                  <input
                    type="number"
                    value={settings.customHeightMm || 246}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        customHeightMm: parseFloat(e.target.value) || 246,
                      })
                    }
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
              </div>
            )}

            {/* Page Geometry / Margins */}
            <div className="space-y-2 border-t border-[#CBBEAC]/50 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#292521] dark:text-slate-200">
                  Page Geometry &amp; Margins (mm)
                </span>
                <span className="text-[10px] font-mono text-[#9A7438]">
                  {settings.geometry.facingPages ? 'Mirrored Spreads' : 'Single Margins'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-[#CBBEAC]/70 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Top Margin</span>
                  <input
                    type="number"
                    value={settings.geometry.topMarginMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        geometry: {
                          ...settings.geometry,
                          topMarginMm: parseFloat(e.target.value) || 18,
                        },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] dark:border-slate-700 rounded text-xs font-mono font-bold text-[#5A1832]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Bottom Margin</span>
                  <input
                    type="number"
                    value={settings.geometry.bottomMarginMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        geometry: {
                          ...settings.geometry,
                          bottomMarginMm: parseFloat(e.target.value) || 20,
                        },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] dark:border-slate-700 rounded text-xs font-mono font-bold text-[#5A1832]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Inside (Gutter)</span>
                  <input
                    type="number"
                    value={settings.geometry.insideMarginMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        geometry: {
                          ...settings.geometry,
                          insideMarginMm: parseFloat(e.target.value) || 22,
                        },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] dark:border-slate-700 rounded text-xs font-mono font-bold text-[#5A1832]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Outside Margin</span>
                  <input
                    type="number"
                    value={settings.geometry.outsideMarginMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        geometry: {
                          ...settings.geometry,
                          outsideMarginMm: parseFloat(e.target.value) || 16,
                        },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] dark:border-slate-700 rounded text-xs font-mono font-bold text-[#5A1832]"
                  />
                </div>
              </div>
            </div>

            {/* Bleed & Binding Allowance */}
            <div className="space-y-2 border-t border-[#CBBEAC]/50 pt-3">
              <span className="font-bold text-[#292521] dark:text-slate-200 block">
                Bleed &amp; Binding Creep
              </span>
              <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70">
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Bleed (mm)</span>
                  <select
                    value={settings.bleed.bleedMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        bleed: { ...settings.bleed, bleedMm: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono"
                  >
                    <option value={0}>0 mm (No Bleed)</option>
                    <option value={3}>3 mm (Standard Preset)</option>
                    <option value={5}>5 mm (Wide Trim)</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Gutter Creep (mm)</span>
                  <input
                    type="number"
                    value={settings.geometry.gutterMm}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        geometry: {
                          ...settings.geometry,
                          gutterMm: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Paper Stock & Tint */}
            <div className="grid grid-cols-2 gap-2 border-t border-[#CBBEAC]/50 pt-3">
              <div>
                <span className="text-[10px] font-bold text-[#71685E] block">Paper Stock</span>
                <select
                  value={settings.paperStock}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, paperStock: e.target.value as any })
                  }
                  className="w-full p-1.5 bg-white border border-[#CBBEAC] rounded text-xs"
                >
                  <option value="70gsm">70 gsm (Standard)</option>
                  <option value="80gsm">80 gsm (Archival Coursebook)</option>
                  <option value="100gsm">100 gsm (Heavy Art)</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#71685E] block">Paper Tint</span>
                <select
                  value={settings.paperTint}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, paperTint: e.target.value as any })
                  }
                  className="w-full p-1.5 bg-white border border-[#CBBEAC] rounded text-xs"
                >
                  <option value="cream">Cream Parchment</option>
                  <option value="ivory">Ivory Academic</option>
                  <option value="white">Pure White Offset</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TYPOGRAPHY CASCADE */}
        {/* ======================================================== */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#292521] dark:text-slate-200 block">
                Select Named Style to Calibrate
              </label>
              <select
                value={selectedStyleId}
                onChange={(e) => setSelectedStyleId(e.target.value as NamedStyleId)}
                className="w-full bg-white dark:bg-slate-800 border border-[#CBBEAC] dark:border-slate-700 rounded-lg p-2 text-xs font-serif font-bold text-[#5A1832] dark:text-[#C29A52] outline-none"
              >
                {Object.values(settings.typography).map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label} ({st.fontSizePt} pt / {st.fontWeight})
                  </option>
                ))}
              </select>
            </div>

            {selectedStyle && (
              <div className="space-y-3 bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-[#CBBEAC]/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-2">
                  <span className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                    {selectedStyle.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#9A7438]">
                    Cascades Globally
                  </span>
                </div>

                {/* Font Family */}
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Font Family</span>
                  <select
                    value={selectedStyle.fontFamily}
                    onChange={(e) => {
                      const updated = { ...selectedStyle, fontFamily: e.target.value };
                      onUpdateSettings({
                        ...settings,
                        typography: { ...settings.typography, [selectedStyleId]: updated },
                      });
                    }}
                    className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-serif"
                  >
                    <option value="serif">Garamond / Academic Serif</option>
                    <option value="Georgia, serif">Georgia Editorial</option>
                    <option value="'Century Schoolbook', serif">Century Schoolbook</option>
                    <option value="sans-serif">Academic Sans</option>
                    <option value="monospace">Syntactic Code / Mono</option>
                  </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#71685E] block font-mono">Size (pt)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedStyle.fontSizePt}
                      onChange={(e) => {
                        const updated = {
                          ...selectedStyle,
                          fontSizePt: parseFloat(e.target.value) || 10,
                        };
                        onUpdateSettings({
                          ...settings,
                          typography: { ...settings.typography, [selectedStyleId]: updated },
                        });
                      }}
                      className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono font-bold text-[#5A1832]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71685E] block font-mono">Weight</span>
                    <select
                      value={selectedStyle.fontWeight}
                      onChange={(e) => {
                        const updated = {
                          ...selectedStyle,
                          fontWeight: e.target.value as any,
                        };
                        onUpdateSettings({
                          ...settings,
                          typography: { ...settings.typography, [selectedStyleId]: updated },
                        });
                      }}
                      className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono"
                    >
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                    </select>
                  </div>
                </div>

                {/* Line Height & Alignment */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#71685E] block font-mono">Line Height</span>
                    <input
                      type="number"
                      step="0.05"
                      value={selectedStyle.lineHeight}
                      onChange={(e) => {
                        const updated = {
                          ...selectedStyle,
                          lineHeight: parseFloat(e.target.value) || 1.4,
                        };
                        onUpdateSettings({
                          ...settings,
                          typography: { ...settings.typography, [selectedStyleId]: updated },
                        });
                      }}
                      className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#71685E] block font-mono">Alignment</span>
                    <select
                      value={selectedStyle.alignment}
                      onChange={(e) => {
                        const updated = {
                          ...selectedStyle,
                          alignment: e.target.value as any,
                        };
                        onUpdateSettings({
                          ...settings,
                          typography: { ...settings.typography, [selectedStyleId]: updated },
                        });
                      }}
                      className="w-full p-1.5 bg-[#EDE4D6]/30 dark:bg-slate-900 border border-[#CBBEAC] rounded text-xs font-mono"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="justify">Justified</option>
                      <option value="center">Centered</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MASTER PAGES & HEADERS */}
        {/* ======================================================== */}
        {activeTab === 'masters' && (
          <div className="space-y-4">
            {/* Running Header Config */}
            <div className="space-y-2 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-[#CBBEAC]/70">
              <span className="font-bold text-[#292521] dark:text-slate-200 block">
                Running Headers
              </span>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">
                    Left Page Header (Verso)
                  </span>
                  <select
                    value={settings.runningHeaders.leftHeaderContent}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        runningHeaders: {
                          ...settings.runningHeaders,
                          leftHeaderContent: e.target.value as any,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-[#CBBEAC] rounded text-xs"
                  >
                    <option value="series_title">Series Title</option>
                    <option value="book_title">Book Title</option>
                    <option value="unit_title">Unit Title</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">
                    Right Page Header (Recto)
                  </span>
                  <select
                    value={settings.runningHeaders.rightHeaderContent}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        runningHeaders: {
                          ...settings.runningHeaders,
                          rightHeaderContent: e.target.value as any,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-[#CBBEAC] rounded text-xs"
                  >
                    <option value="chapter_title">Chapter Title</option>
                    <option value="topic_title">Topic Title</option>
                  </select>
                </div>
                <label className="flex items-center space-x-2 pt-1 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.runningHeaders.suppressOnChapterOpener}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        runningHeaders: {
                          ...settings.runningHeaders,
                          suppressOnChapterOpener: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-[#5A1832]"
                  />
                  <span>Suppress header on Chapter Opener</span>
                </label>
              </div>
            </div>

            {/* Page Number Folios */}
            <div className="space-y-2 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-[#CBBEAC]/70">
              <span className="font-bold text-[#292521] dark:text-slate-200 block">
                Page Numbers (Folios)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Position</span>
                  <select
                    value={settings.pageNumbers.position}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        pageNumbers: {
                          ...settings.pageNumbers,
                          position: e.target.value as any,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-[#CBBEAC] rounded text-xs"
                  >
                    <option value="bottom_outside">Bottom Outside</option>
                    <option value="bottom_centre">Bottom Centre</option>
                    <option value="top_outside">Top Outside</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-[#71685E] block font-mono">Front Matter</span>
                  <select
                    value={settings.pageNumbers.frontMatterFormat}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        pageNumbers: {
                          ...settings.pageNumbers,
                          frontMatterFormat: e.target.value as any,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-[#CBBEAC] rounded text-xs"
                  >
                    <option value="roman">Roman (i, ii, iii)</option>
                    <option value="arabic">Arabic (1, 2, 3)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chapter Start Rules */}
            <div className="space-y-2 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-[#CBBEAC]/70">
              <span className="font-bold text-[#292521] dark:text-slate-200 block">
                Pagination &amp; Flow Rules
              </span>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.startChapterOnRightPage}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        startChapterOnRightPage: e.target.checked,
                      })
                    }
                    className="rounded text-[#5A1832]"
                  />
                  <span>Start Chapters on Right Page (Recto)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoColumnGlossary}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        twoColumnGlossary: e.target.checked,
                      })
                    }
                    className="rounded text-[#5A1832]"
                  />
                  <span>Two-Column Layout for Glossary &amp; Index</span>
                </label>
              </div>
            </div>

            {/* Exercise Answer Space */}
            <div className="space-y-1.5 bg-white dark:bg-slate-800/70 p-3 rounded-xl border border-[#CBBEAC]/70">
              <span className="font-bold text-[#292521] dark:text-slate-200 block">
                Exercise Student Answer Space
              </span>
              <select
                value={settings.defaultAnswerSpace}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    defaultAnswerSpace: e.target.value as any,
                  })
                }
                className="w-full p-1.5 border border-[#CBBEAC] rounded text-xs"
              >
                <option value="lines">Ruled Lines (Standard)</option>
                <option value="box">Framed Response Box</option>
                <option value="writing_area">Generous Writing Area</option>
                <option value="blank">Blank White Space</option>
                <option value="none">No Answer Space (Text Only)</option>
              </select>
            </div>

            {/* Active Page Overrides (Requirement 42) */}
            <div className="space-y-2 bg-[#FAF8F2] dark:bg-slate-800 p-3 rounded-xl border border-[#C29A52]/60">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5A1832] dark:text-[#C29A52] block text-xs flex items-center space-x-1">
                  <Bookmark className="w-3.5 h-3.5 text-[#9A7438]" />
                  <span>Page {activePageIndex + 1} Local Overrides</span>
                </span>
                <span className="text-[10px] font-mono text-[#71685E]">
                  Non-destructive
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] leading-relaxed">
                Apply local layout adjustments to this sheet without altering academic source text.
              </p>

              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pageOverrides?.[activePageIndex]?.suppressHeader || false}
                    onChange={(e) => {
                      const prev = settings.pageOverrides || {};
                      const pageOvr = prev[activePageIndex] || {};
                      onUpdateSettings({
                        ...settings,
                        pageOverrides: {
                          ...prev,
                          [activePageIndex]: { ...pageOvr, suppressHeader: e.target.checked },
                        },
                      });
                    }}
                    className="rounded text-[#5A1832]"
                  />
                  <span>Suppress Running Header</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pageOverrides?.[activePageIndex]?.suppressPageNumber || false}
                    onChange={(e) => {
                      const prev = settings.pageOverrides || {};
                      const pageOvr = prev[activePageIndex] || {};
                      onUpdateSettings({
                        ...settings,
                        pageOverrides: {
                          ...prev,
                          [activePageIndex]: { ...pageOvr, suppressPageNumber: e.target.checked },
                        },
                      });
                    }}
                    className="rounded text-[#5A1832]"
                  />
                  <span>Suppress Page Folio</span>
                </label>

                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pageOverrides?.[activePageIndex]?.forcePageBreakBefore || false}
                    onChange={(e) => {
                      const prev = settings.pageOverrides || {};
                      const pageOvr = prev[activePageIndex] || {};
                      onUpdateSettings({
                        ...settings,
                        pageOverrides: {
                          ...prev,
                          [activePageIndex]: { ...pageOvr, forcePageBreakBefore: e.target.checked },
                        },
                      });
                    }}
                    className="rounded text-[#5A1832]"
                  />
                  <span>Force Page Break Before</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PREFLIGHT ENGINE */}
        {/* ======================================================== */}
        {activeTab === 'preflight' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70">
              <div>
                <span className="text-[11px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase font-mono">
                  Preflight Audit Status
                </span>
                <p className="text-xs text-[#71685E]">
                  {errorCount === 0 ? 'Passed all critical press checks' : `${errorCount} blocking errors detected`}
                </p>
              </div>
              <div className="flex items-center space-x-1 font-mono font-bold text-xs">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  {errorCount} Err
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {warningCount} Warn
                </span>
              </div>
            </div>

            {/* Print Guides Toggles */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-2">
              <span className="font-bold text-[#292521] dark:text-slate-200 block text-xs">
                Non-Printing Proof Guides
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.guides.showMargins}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        guides: { ...settings.guides, showMargins: e.target.checked },
                      })
                    }
                  />
                  <span>Margins Line</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.guides.showTrim}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        guides: { ...settings.guides, showTrim: e.target.checked },
                      })
                    }
                  />
                  <span>Trim Boundary</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.guides.showBleed}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        guides: { ...settings.guides, showBleed: e.target.checked },
                      })
                    }
                  />
                  <span>Bleed Boundary</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.guides.showSafeArea}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        guides: { ...settings.guides, showSafeArea: e.target.checked },
                      })
                    }
                  />
                  <span>Safe Area</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.guides.showBaselineGrid}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...settings,
                        guides: { ...settings.guides, showBaselineGrid: e.target.checked },
                      })
                    }
                  />
                  <span>Baseline Grid</span>
                </label>
              </div>
            </div>

            {/* Clickable Issue List */}
            <div className="space-y-2">
              <span className="font-bold text-[#292521] dark:text-slate-200 block text-xs">
                Detailed Issues &amp; Jump Navigation
              </span>
              {preflightIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    if (issue.pageIndex !== undefined) {
                      onNavigateToPage(issue.pageIndex);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    issue.severity === 'error'
                      ? 'bg-rose-50/80 border-rose-200 hover:bg-rose-100'
                      : issue.severity === 'warning'
                      ? 'bg-amber-50/80 border-amber-200 hover:bg-amber-100'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#292521]">
                      {issue.title}
                    </span>
                    {issue.pageIndex !== undefined && (
                      <span className="font-mono text-[10px] text-[#5A1832] font-bold">
                        Jump &rarr;
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#524338] mt-0.5">{issue.description}</p>
                  <div className="mt-1 text-[10px] font-mono text-[#9A7438]">
                    Remedy: {issue.remediation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: EXPORT CENTRE */}
        {/* ======================================================== */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="space-y-1.5 bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70">
              <span className="font-bold text-[#292521] dark:text-slate-200 block text-xs">
                Export Target Range
              </span>
              <div className="flex items-center space-x-1 bg-[#EDE4D6]/40 p-1 rounded-lg">
                <button
                  onClick={() => setExportRange('all')}
                  className={`flex-1 py-1 rounded text-xs font-semibold ${
                    exportRange === 'all'
                      ? 'bg-[#5A1832] text-[#F6F0E7]'
                      : 'text-[#71685E]'
                  }`}
                >
                  Entire Book
                </button>
                <button
                  onClick={() => setExportRange('chapter')}
                  className={`flex-1 py-1 rounded text-xs font-semibold ${
                    exportRange === 'chapter'
                      ? 'bg-[#5A1832] text-[#F6F0E7]'
                      : 'text-[#71685E]'
                  }`}
                >
                  Active Chapter
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={onExportPrintPdf}
                className="w-full h-10 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] font-semibold flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#C29A52]" />
                <span>Print-Ready High-Res PDF</span>
              </button>

              <button
                onClick={onExportDigitalPdf}
                className="w-full h-10 rounded-xl bg-[#9A7438] hover:bg-[#7d5d2b] text-[#F6F0E7] font-semibold flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Digital Interactive PDF (Hyperlinked)</span>
              </button>

              {onExportProofPdf && (
                <button
                  onClick={onExportProofPdf}
                  className="w-full h-10 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  title="Generate review PDF with draft watermark & preflight stamp"
                >
                  <FileCheck className="w-4 h-4 text-amber-700" />
                  <span>Review Proof PDF (Draft Watermark)</span>
                </button>
              )}

              <button
                onClick={onExportDocx}
                className="w-full h-10 rounded-xl bg-white hover:bg-stone-50 border border-[#CBBEAC] text-[#292521] font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#5A1832]" />
                <span>Microsoft Word Coursebook (.docx)</span>
              </button>
            </div>

            {/* Publisher Handoff Package */}
            <div className="p-3 bg-[#EDE4D6]/50 rounded-xl border border-[#CBBEAC]/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-[#5A1832]">
                  <Sparkles className="w-3.5 h-3.5 text-[#9A7438]" />
                  <span>Publisher Handoff Package</span>
                </div>
                {onOpenHandoffModal && (
                  <button
                    onClick={onOpenHandoffModal}
                    className="px-2.5 py-1 rounded bg-[#5A1832] text-[#F6F0E7] text-[10px] font-bold hover:bg-[#35101F] transition-colors cursor-pointer"
                  >
                    Open Dossier &rarr;
                  </button>
                )}
              </div>
              <p className="text-[#71685E] text-[11px] leading-relaxed">
                Includes prepress specifications, color profile, signature binding budget, chapter manifest, and font &amp; preflight audit.
              </p>
            </div>

            {/* Layout Version Snapshots */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-[#CBBEAC]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#292521] dark:text-slate-200">
                  Layout Version Snapshots
                </span>
                <span className="text-[10px] font-mono text-[#9A7438]">
                  {snapshots.length} saved
                </span>
              </div>
              <p className="text-[11px] text-[#71685E]">
                Preserve layout geometries and typography configurations without altering academic manuscripts.
              </p>

              <div className="flex items-center space-x-1.5 pt-1">
                <input
                  type="text"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  placeholder="e.g. Academic Review Layout..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] text-xs bg-[#FAF8F2] dark:bg-slate-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveSnapshot();
                  }}
                />
                <button
                  onClick={handleSaveSnapshot}
                  disabled={!newSnapshotName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:bg-[#35101F] disabled:opacity-50 cursor-pointer"
                >
                  Save
                </button>
              </div>

              {/* Saved Snapshots List */}
              <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
                {snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-2 rounded-lg bg-[#EDE4D6]/40 dark:bg-slate-900 border border-[#CBBEAC]/50 flex items-center justify-between text-xs hover:bg-[#EDE4D6]/70 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                        {snap.name}
                      </div>
                      <div className="text-[10px] text-[#71685E] font-mono">
                        {snap.date} &bull; {snap.settings.trimPreset.replace('_', ' ')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="px-2 py-0.5 rounded border border-[#CBBEAC] bg-white dark:bg-slate-800 text-[10px] font-semibold text-[#292521] hover:bg-stone-100 cursor-pointer"
                      title="Restore this layout configuration"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-[#CBBEAC]/60 dark:border-slate-800 bg-[#EDE4D6]/40 dark:bg-slate-950 flex items-center justify-between text-[11px] font-mono text-[#71685E] dark:text-slate-400">
        <span>Settings Auto-saved</span>
        <span className="text-[#5A1832] dark:text-[#C29A52] font-semibold">
          {settings.trimPreset.replace('_', ' ').toUpperCase()}
        </span>
      </div>
    </div>
  );
};
