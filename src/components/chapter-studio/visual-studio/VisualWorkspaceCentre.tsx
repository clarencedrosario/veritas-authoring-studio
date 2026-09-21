// =============================================================
// VERITAS Editorial Platform — Visual Workspace Centre (Centre Column)
// Phase 4E-1: Visual Production Foundation
// =============================================================

import React, { useState } from 'react';
import {
  Eye,
  FileText,
  Upload,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Plus,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Brain,
  Wand2,
} from 'lucide-react';
import {
  VisualRecord,
  VisualType,
  VisualPedagogicalPurpose,
  VisualOrientation,
  VisualPlacement,
  VisualArtworkAsset,
} from '../../../types/visualStudio';
import { StudioChapter } from '../../../types';
import { VisualIntelligenceStudio } from './VisualIntelligenceStudio';
import {
  generateVisualBriefFromContext,
  generateEducationalArtworkSvg,
} from '../../../utils/visualIntelligenceService';

interface VisualWorkspaceCentreProps {
  visual: VisualRecord;
  chapter: StudioChapter;
  onUpdateVisual: (updated: VisualRecord) => void;
  onSyncWithChapter: (
    targetSectionId: string,
    placement: 'before_block' | 'after_block' | 'inside_section' | 'end_of_section',
    targetBlockId?: string
  ) => void;
  visuals?: VisualRecord[];
  onSelectVisual?: (visualId: string) => void;
  onAddVisual?: (newVisual: VisualRecord) => void;
  onUpdateChapter?: (updated: StudioChapter) => void;
  isDarkMode?: boolean;
}

type CentreViewTab = 'preview' | 'brief' | 'artwork' | 'intelligence' | 'insert';

export const VisualWorkspaceCentre: React.FC<VisualWorkspaceCentreProps> = ({
  visual,
  chapter,
  onUpdateVisual,
  onSyncWithChapter,
  visuals = [],
  onSelectVisual = () => {},
  onAddVisual = () => {},
  onUpdateChapter = () => {},
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<CentreViewTab>('preview');

  // Preview zoom level
  const [zoomScale, setZoomScale] = useState<number>(100);

  // Tag inputs for brief editor
  const [newRequiredElem, setNewRequiredElem] = useState('');
  const [newOptionalElem, setNewOptionalElem] = useState('');
  const [newAvoidElem, setNewAvoidElem] = useState('');
  const [newLabelElem, setNewLabelElem] = useState('');

  // Chapter insertion controls
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    visual.associatedSectionId || chapter.sections[0]?.id || ''
  );
  const [placementMode, setPlacementMode] = useState<
    'before_block' | 'after_block' | 'inside_section' | 'end_of_section'
  >('end_of_section');
  const [targetBlockId, setTargetBlockId] = useState<string>('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');

  // Handle Brief update
  const handleBriefChange = (field: keyof typeof visual.brief, value: any) => {
    onUpdateVisual({
      ...visual,
      brief: {
        ...visual.brief,
        [field]: value,
      },
    });
  };

  // Tag list helper
  const addTag = (field: 'requiredElements' | 'optionalElements' | 'elementsToAvoid' | 'labelsRequired', value: string) => {
    if (!value.trim()) return;
    const currentList = visual.brief[field] || [];
    if (!currentList.includes(value.trim())) {
      handleBriefChange(field, [...currentList, value.trim()]);
    }
  };

  const removeTag = (field: 'requiredElements' | 'optionalElements' | 'elementsToAvoid' | 'labelsRequired', tag: string) => {
    const currentList = visual.brief[field] || [];
    handleBriefChange(
      field,
      currentList.filter((t) => t !== tag)
    );
  };

  // Handle local artwork file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newVersionNum = (visual.versions.length || 0) + 1;
      const newAsset: VisualArtworkAsset = {
        versionNumber: newVersionNum,
        filename: file.name,
        fileType: file.type || 'image/png',
        fileSize: `${Math.round(file.size / 1024)} KB`,
        dimensions: { width: 1200, height: 800 },
        artworkUrl: dataUrl,
        uploadedAt: new Date().toISOString(),
        notes: `Uploaded artwork file: ${file.name}`,
        isApproved: true,
      };

      onUpdateVisual({
        ...visual,
        sourceType: 'Uploaded Artwork',
        status: visual.status === 'Brief Required' || visual.status === 'Placeholder' ? 'Draft Artwork' : visual.status,
        currentAsset: newAsset,
        versions: [...visual.versions, newAsset],
        statusHistory: [
          ...visual.statusHistory,
          {
            status: 'Draft Artwork',
            timestamp: new Date().toISOString(),
            note: `Uploaded artwork asset: ${file.name}`,
            author: 'Illustrator / Layout Editor',
          },
        ],
      });
    };
    reader.readAsDataURL(file);
  };

  // Find target section blocks for insert
  const targetSection = chapter.sections.find((s) => s.id === selectedSectionId);

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-[#F6F0E7]">
      {/* Centre Sub-Navigation Bar */}
      <div className="border-b border-[#CBBEAC] bg-[#FFFDF8] px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Preview &amp; Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'brief'
                ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Visual Brief Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artwork')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'artwork'
                ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Artwork &amp; Uploads ({visual.versions?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'intelligence'
                ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs ring-1 ring-[#C29A52]'
                : 'text-[#5A1832] bg-[#C29A52]/15 hover:bg-[#C29A52]/25 font-bold border border-[#C29A52]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Visual Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C29A52] animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('insert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'insert'
                ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Insert into Chapter</span>
          </button>
        </div>

        {/* View Details Right Pill */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-[#71685E]">
          <span className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-semibold border border-[#CBBEAC]">
            {visual.figureNumber}
          </span>
          <span>{visual.visualType}</span>
        </div>
      </div>

      {/* Centre Working Surface (Independent vertical scroll, full available height) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        {/* ========================================================= */}
        {/* TAB 1: PREVIEW & CANVAS                                   */}
        {/* ========================================================= */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between bg-[#FFFDF8] p-2.5 rounded-xl border border-[#CBBEAC] text-xs">
              <div className="flex items-center space-x-2 text-[#71685E]">
                <span className="font-semibold text-[#292521]">Orientation:</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-mono">
                  {visual.brief.orientation}
                </span>
                <span className="font-semibold text-[#292521]">Placement:</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-mono">
                  {visual.brief.placement}
                </span>
                {visual.brief.suggestedSize && (
                  <span className="text-stone-500">({visual.brief.suggestedSize})</span>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.max(50, prev - 15))}
                  className="p-1 rounded bg-[#EDE4D6] hover:bg-[#CBBEAC]/60 text-[#292521] transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs w-10 text-center">{zoomScale}%</span>
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.min(200, prev + 15))}
                  className="p-1 rounded bg-[#EDE4D6] hover:bg-[#CBBEAC]/60 text-[#292521] transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(100)}
                  className="p-1 rounded bg-[#EDE4D6] hover:bg-[#CBBEAC]/60 text-[#292521] transition-colors"
                  title="Reset 100%"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Specimen Preview Box (Framed in Ivory/Parchment) */}
            <div className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-sm space-y-4">
              {/* Artwork Box */}
              <div
                className="w-full rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] flex flex-col items-center justify-center p-4 overflow-hidden relative transition-all"
                style={{
                  minHeight: '340px',
                  transform: `scale(${zoomScale / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                {visual.currentAsset?.artworkUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <img
                      src={visual.currentAsset.artworkUrl}
                      alt={visual.metadata.altText || visual.title}
                      className="max-h-[440px] w-auto max-w-full rounded-lg shadow-xs object-contain"
                    />
                    <div className="mt-2 text-[11px] font-mono text-[#71685E] flex items-center space-x-2">
                      <span>{visual.currentAsset.filename}</span>
                      <span>•</span>
                      <span>Version {visual.currentAsset.versionNumber}</span>
                      {visual.currentAsset.dimensions && (
                        <span>• {visual.currentAsset.dimensions.width} &times; {visual.currentAsset.dimensions.height} px</span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard Textbook Placeholder */
                  <div className="w-full max-w-xl py-12 px-6 rounded-xl border-2 border-dashed border-[#CBBEAC] text-center space-y-3 bg-[#FFFDF8]/90">
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#EDE4D6] text-[#5A1832] font-mono text-xs font-bold border border-[#CBBEAC]">
                      <span>{visual.figureNumber.toUpperCase()}</span>
                      <span>•</span>
                      <span>{visual.visualType.toUpperCase()}</span>
                    </div>

                    <div className="py-2">
                      <div className="font-bold text-sm font-serif uppercase tracking-widest text-[#9A7438]">
                        [ARTWORK PENDING]
                      </div>
                      <h3 className="font-serif font-bold text-lg text-[#292521] mt-1">
                        {visual.title}
                      </h3>
                      <p className="font-serif text-xs text-[#71685E] max-w-md mx-auto mt-2 leading-relaxed">
                        {visual.brief.description || 'Illustration brief undergoing editorial commissioning.'}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#71685E]">
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6]">
                        {visual.brief.orientation}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6]">
                        {visual.brief.placement}
                      </span>
                      {visual.brief.suggestedSize && (
                        <span className="px-2 py-0.5 rounded bg-[#EDE4D6]">
                          {visual.brief.suggestedSize}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reader-Facing Caption & Academic Metadata */}
              <div className="pt-3 border-t border-[#CBBEAC]/70 space-y-2">
                <div className="text-center font-serif">
                  <p className="text-sm font-semibold text-[#292521]">
                    {visual.metadata.caption || `${visual.figureNumber}: ${visual.title}`}
                  </p>
                  {visual.metadata.shortCaption && (
                    <p className="text-xs text-[#71685E] mt-0.5">
                      Short Reference: {visual.metadata.shortCaption}
                    </p>
                  )}
                </div>

                {/* Alt-Text Indicator & Attribution */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-[#CBBEAC]/40 text-[#71685E]">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-semibold text-[10px] uppercase">
                      Alt-Text (Accessibility)
                    </span>
                    <span className="italic text-[11px] max-w-md truncate" title={visual.metadata.altText}>
                      &ldquo;{visual.metadata.altText}&rdquo;
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px]">
                    <span>Credit: <strong className="text-[#292521]">{visual.metadata.creditSource}</strong></span>
                    <span>•</span>
                    <span>Rights: <strong className="text-[#292521]">{visual.metadata.copyrightStatus}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Bar below Preview */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8]">
              <div className="text-xs text-[#71685E]">
                <span>Associated Section: </span>
                <strong className="text-[#292521]">
                  {visual.associatedSectionTitle || 'Not inserted into chapter yet'}
                </strong>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('brief')}
                  className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/60 text-xs font-semibold text-[#292521] transition-colors cursor-pointer"
                >
                  Edit Brief Fields &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('artwork')}
                  className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Upload Artwork &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VISUAL BRIEF EDITOR                                */}
        {/* ========================================================= */}
        {activeTab === 'brief' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 rounded-xl border border-[#C29A52]/40 bg-[#FFFDF8] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[#C29A52] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[#292521]">
                    Educational Visual Brief Specification
                  </h3>
                  <p className="text-xs text-[#71685E] leading-relaxed">
                    Every textbook visual requires an exhaustive, pedagogically sound brief for artists,
                    typesetters, and editorial reviewers. Complete all required fields below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const { brief: aiBrief, metadata: aiMeta } = generateVisualBriefFromContext({
                    chapter,
                    concept: visual.conceptSupported || visual.title,
                    visualType: visual.visualType,
                    purpose: visual.purpose,
                    figureNumber: visual.figureNumber,
                    title: visual.title,
                  });
                  onUpdateVisual({
                    ...visual,
                    brief: aiBrief,
                    metadata: {
                      ...visual.metadata,
                      ...aiMeta,
                    },
                    status: visual.status === 'Brief Required' ? 'Brief Ready' : visual.status,
                    statusHistory: [
                      ...visual.statusHistory,
                      {
                        status: 'Brief Ready',
                        timestamp: new Date().toISOString(),
                        note: 'Visual Brief auto-populated by AI Educational Visual Intelligence.',
                        author: 'AI Visual Intelligence',
                      },
                    ],
                  });
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Auto-Generate Brief with AI</span>
              </button>
            </div>

            {/* 1. Core Visual Identification */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-2">
                1. Core Educational &amp; Architectural Scope
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Visual Title *
                  </label>
                  <input
                    type="text"
                    value={visual.title}
                    onChange={(e) => onUpdateVisual({ ...visual, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Figure Number *
                  </label>
                  <input
                    type="text"
                    value={visual.figureNumber}
                    onChange={(e) => onUpdateVisual({ ...visual, figureNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] font-mono focus:outline-none focus:border-[#5A1832]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Visual Type
                  </label>
                  <select
                    value={visual.visualType}
                    onChange={(e) => onUpdateVisual({ ...visual, visualType: e.target.value as VisualType })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Educational Illustration">Educational Illustration</option>
                    <option value="Grammar Diagram">Grammar Diagram</option>
                    <option value="Sentence Diagram">Sentence Diagram</option>
                    <option value="Comparison Chart">Comparison Chart</option>
                    <option value="Concept Map">Concept Map</option>
                    <option value="Flowchart">Flowchart</option>
                    <option value="Table">Table</option>
                    <option value="Infographic">Infographic</option>
                    <option value="Picture-Based Exercise">Picture-Based Exercise</option>
                    <option value="Labelled Diagram">Labelled Diagram</option>
                    <option value="Photograph">Photograph</option>
                    <option value="Icon / Symbol">Icon / Symbol</option>
                    <option value="Callout Illustration">Callout Illustration</option>
                    <option value="Custom Visual">Custom Visual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Pedagogical Purpose
                  </label>
                  <select
                    value={visual.purpose}
                    onChange={(e) =>
                      onUpdateVisual({ ...visual, purpose: e.target.value as VisualPedagogicalPurpose })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Introduce Concept">Introduce Concept</option>
                    <option value="Explain Concept">Explain Concept</option>
                    <option value="Demonstrate Rule">Demonstrate Rule</option>
                    <option value="Provide Example">Provide Example</option>
                    <option value="Compare Concepts">Compare Concepts</option>
                    <option value="Show Process">Show Process</option>
                    <option value="Support Memory">Support Memory</option>
                    <option value="Practice / Exercise">Practice / Exercise</option>
                    <option value="Assessment Stimulus">Assessment Stimulus</option>
                    <option value="Revision">Revision</option>
                    <option value="Decorative / Engagement">Decorative / Engagement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Learning Objective Supported
                </label>
                <input
                  type="text"
                  value={visual.learningObjectiveSupported}
                  onChange={(e) =>
                    onUpdateVisual({ ...visual, learningObjectiveSupported: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Core Concept Supported
                </label>
                <input
                  type="text"
                  value={visual.conceptSupported}
                  onChange={(e) => onUpdateVisual({ ...visual, conceptSupported: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>
            </div>

            {/* 2. Detailed Illustration Specification */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-2">
                2. Detailed Illustration &amp; Subject Description
              </h4>

              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Detailed Illustration Description *
                </label>
                <textarea
                  rows={4}
                  value={visual.brief.description}
                  onChange={(e) => handleBriefChange('description', e.target.value)}
                  placeholder="Describe the entire visual scene or diagram in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] leading-relaxed focus:outline-none focus:border-[#5A1832]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Characters / People
                  </label>
                  <input
                    type="text"
                    value={visual.brief.charactersPeople}
                    onChange={(e) => handleBriefChange('charactersPeople', e.target.value)}
                    placeholder="e.g. Teacher, 2 students"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Setting / Environment
                  </label>
                  <input
                    type="text"
                    value={visual.brief.settingEnvironment}
                    onChange={(e) => handleBriefChange('settingEnvironment', e.target.value)}
                    placeholder="e.g. Sunlit classroom with blackboard"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Objects / Props
                  </label>
                  <input
                    type="text"
                    value={visual.brief.objectsProps}
                    onChange={(e) => handleBriefChange('objectsProps', e.target.value)}
                    placeholder="e.g. Desks, books, clock, bag"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>
              </div>

              {/* Tag Editor: Required Elements */}
              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Required Elements ({visual.brief.requiredElements?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] mb-2 min-h-[42px]">
                  {visual.brief.requiredElements?.map((req) => (
                    <span
                      key={req}
                      className="px-2 py-0.5 rounded-md bg-[#FFFDF8] border border-[#CBBEAC] text-xs text-[#5A1832] font-medium inline-flex items-center space-x-1"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => removeTag('requiredElements', req)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!visual.brief.requiredElements || visual.brief.requiredElements.length === 0) && (
                    <span className="text-xs text-[#71685E] italic">No required elements added yet.</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRequiredElem}
                    onChange={(e) => setNewRequiredElem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('requiredElements', newRequiredElem);
                        setNewRequiredElem('');
                      }
                    }}
                    placeholder="Add required element and press enter or Add"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addTag('requiredElements', newRequiredElem);
                      setNewRequiredElem('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] hover:bg-[#CBBEAC] text-xs font-semibold text-[#292521] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tag Editor: Labels Required */}
              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Labels Required in Artwork ({visual.brief.labelsRequired?.length || 0})
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] mb-2 min-h-[42px]">
                  {visual.brief.labelsRequired?.map((lbl) => (
                    <span
                      key={lbl}
                      className="px-2 py-0.5 rounded-md bg-[#FFFDF8] border border-[#CBBEAC] text-xs text-[#292521] font-mono inline-flex items-center space-x-1"
                    >
                      <span>{lbl}</span>
                      <button
                        type="button"
                        onClick={() => removeTag('labelsRequired', lbl)}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!visual.brief.labelsRequired || visual.brief.labelsRequired.length === 0) && (
                    <span className="text-xs text-[#71685E] italic">No labels added yet.</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLabelElem}
                    onChange={(e) => setNewLabelElem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag('labelsRequired', newLabelElem);
                        setNewLabelElem('');
                      }
                    }}
                    placeholder="Add label text (e.g. blackboard, teacher, desk)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addTag('labelsRequired', newLabelElem);
                      setNewLabelElem('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] hover:bg-[#CBBEAC] text-xs font-semibold text-[#292521] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Text inside artwork */}
              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Text Permitted Inside Artwork
                </label>
                <input
                  type="text"
                  value={visual.brief.textInsideArtwork}
                  onChange={(e) => handleBriefChange('textInsideArtwork', e.target.value)}
                  placeholder="e.g. NAMING WORDS (NOUNS) on the blackboard"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>
            </div>

            {/* 3. Composition, Layout & Print Constraints */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-2">
                3. Composition, Geometry &amp; Page Placement
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Orientation
                  </label>
                  <select
                    value={visual.brief.orientation}
                    onChange={(e) =>
                      handleBriefChange('orientation', e.target.value as VisualOrientation)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Landscape">Landscape</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Square">Square</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Suggested Placement
                  </label>
                  <select
                    value={visual.brief.placement}
                    onChange={(e) =>
                      handleBriefChange('placement', e.target.value as VisualPlacement)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Full Width">Full Width</option>
                    <option value="Half Width">Half Width</option>
                    <option value="Inline">Inline</option>
                    <option value="Margin">Margin</option>
                    <option value="Boxed Feature">Boxed Feature</option>
                    <option value="Full Page">Full Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Visual Complexity
                  </label>
                  <select
                    value={visual.brief.visualComplexity}
                    onChange={(e) =>
                      handleBriefChange('visualComplexity', e.target.value as any)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Detailed">Detailed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Suggested Print Dimensions
                  </label>
                  <input
                    type="text"
                    value={visual.brief.suggestedSize}
                    onChange={(e) => handleBriefChange('suggestedSize', e.target.value)}
                    placeholder="e.g. Half Page (180mm x 110mm)"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Suggested Composition Note
                  </label>
                  <input
                    type="text"
                    value={visual.brief.suggestedComposition}
                    onChange={(e) => handleBriefChange('suggestedComposition', e.target.value)}
                    placeholder="e.g. Teacher on left, blackboard in center, desks on right"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Style Guidance
                  </label>
                  <input
                    type="text"
                    value={visual.brief.styleGuidance}
                    onChange={(e) => handleBriefChange('styleGuidance', e.target.value)}
                    placeholder="e.g. Clean line art with soft watercolor tints"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#292521] mb-1">
                    Colour Guidance
                  </label>
                  <input
                    type="text"
                    value={visual.brief.colourGuidance}
                    onChange={(e) => handleBriefChange('colourGuidance', e.target.value)}
                    placeholder="e.g. Earth tones, soft ivory background, gold accents"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Accessibility Considerations
                </label>
                <input
                  type="text"
                  value={visual.brief.accessibilityConsiderations}
                  onChange={(e) => handleBriefChange('accessibilityConsiderations', e.target.value)}
                  placeholder="e.g. 4.5:1 text contrast, sans-serif labels, distinct object silhouettes"
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292521] mb-1">
                  Instructions for Illustrator / Typesetter
                </label>
                <textarea
                  rows={2}
                  value={visual.brief.illustratorInstructions}
                  onChange={(e) => handleBriefChange('illustratorInstructions', e.target.value)}
                  placeholder="Specific technical delivery notes (bleed, resolution, layer organization)..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ARTWORK & UPLOADS                                  */}
        {/* ========================================================= */}
        {activeTab === 'artwork' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upload Area */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-[#CBBEAC] bg-[#FFFDF8] text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EDE4D6] text-[#5A1832] flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-bold text-sm text-[#292521]">
                  Upload Draft or Final Artwork Asset
                </h4>
                <p className="text-xs text-[#71685E]">
                  Supports PNG, JPG/JPEG, SVG, and print vector formats. Files are converted into
                  chapter visual specimens immediately.
                </p>
              </div>

              <div>
                <label className="px-5 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold inline-flex items-center space-x-2 shadow-md cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-[#C29A52]" />
                  <span>Choose Artwork File</span>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Current Active Asset Specifications */}
            {visual.currentAsset && (
              <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-4">
                <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                      Current Active Asset (Version {visual.currentAsset.versionNumber})
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                    Active in Manuscript
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <span className="text-[#71685E] block text-[10px] uppercase font-bold">Filename</span>
                    <span className="font-mono text-[#292521] truncate block" title={visual.currentAsset.filename}>
                      {visual.currentAsset.filename}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <span className="text-[#71685E] block text-[10px] uppercase font-bold">File Format</span>
                    <span className="font-mono text-[#292521] block">
                      {visual.currentAsset.fileType}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <span className="text-[#71685E] block text-[10px] uppercase font-bold">File Size</span>
                    <span className="font-mono text-[#292521] block">
                      {visual.currentAsset.fileSize || '38 KB'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]">
                    <span className="text-[#71685E] block text-[10px] uppercase font-bold">Resolution / Dims</span>
                    <span className="font-mono text-[#292521] block">
                      {visual.currentAsset.dimensions ? `${visual.currentAsset.dimensions.width}x${visual.currentAsset.dimensions.height}px` : 'Vector SVG'}
                    </span>
                  </div>
                </div>

                {visual.currentAsset.notes && (
                  <p className="text-xs text-[#71685E] italic">
                    Asset Note: {visual.currentAsset.notes}
                  </p>
                )}
              </div>
            )}

            {/* Version History */}
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                Artwork Version Archive ({visual.versions?.length || 0})
              </h4>
              {visual.versions && visual.versions.length > 0 ? (
                <div className="divide-y divide-[#CBBEAC]/60">
                  {visual.versions.map((ver, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#5A1832]">Version {ver.versionNumber}</span>
                          <span className="font-mono text-[11px] text-[#71685E]">{ver.filename}</span>
                          {ver.isApproved && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Approved
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#71685E]">
                          Uploaded: {new Date(ver.uploadedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateVisual({
                              ...visual,
                              currentAsset: ver,
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            visual.currentAsset?.versionNumber === ver.versionNumber
                              ? 'bg-[#5A1832] text-[#FFFDF8]'
                              : 'bg-[#EDE4D6] text-[#292521] hover:bg-[#CBBEAC]'
                          }`}
                        >
                          {visual.currentAsset?.versionNumber === ver.versionNumber ? 'Active' : 'Set as Active'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#71685E] italic">
                  No previous versions recorded. Upload your first artwork file above.
                </p>
              )}
            </div>

            {/* Phase 4E-2 AI Extension Notice Card */}
            <div className="p-4 rounded-xl border border-[#C29A52]/40 bg-[#FFFDF8] flex items-start space-x-3 text-xs">
              <Sparkles className="w-5 h-5 text-[#C29A52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-[#5A1832]">
                  Phase 4E-2 Foundation Ready: Generative Educational Illustrations
                </strong>
                <p className="text-[#71685E] leading-relaxed">
                  In the next phase, the generative illustration engine will connect directly to this
                  Visual Brief to synthesize custom textbook artwork adhering to the exact characters,
                  labels, and CBSE Class 3 curriculum specifications.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: INSERT INTO CHAPTER                                */}
        {/* ========================================================= */}
        {activeTab === 'insert' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] space-y-5">
              <div className="flex items-center space-x-2 border-b border-[#CBBEAC] pb-3">
                <BookOpen className="w-4 h-4 text-[#5A1832]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#5A1832]">
                  Synchronize with Chapter Manuscript
                </h4>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#292521] mb-1.5">
                    1. Select Target Section in Chapter:
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                  >
                    {chapter.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.blocks.length} content blocks)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#292521] mb-1.5">
                    2. Choose Placement Position:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label
                      onClick={() => setPlacementMode('end_of_section')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        placementMode === 'end_of_section'
                          ? 'border-[#5A1832] bg-[#EDE4D6] font-bold text-[#5A1832]'
                          : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#292521]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="placementMode"
                        checked={placementMode === 'end_of_section'}
                        onChange={() => setPlacementMode('end_of_section')}
                        className="hidden"
                      />
                      <div>At End of Section</div>
                      <span className="text-[10px] font-normal text-[#71685E]">Appends after all current content</span>
                    </label>

                    <label
                      onClick={() => setPlacementMode('before_block')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        placementMode === 'before_block'
                          ? 'border-[#5A1832] bg-[#EDE4D6] font-bold text-[#5A1832]'
                          : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#292521]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="placementMode"
                        checked={placementMode === 'before_block'}
                        onChange={() => setPlacementMode('before_block')}
                        className="hidden"
                      />
                      <div>Before Block...</div>
                      <span className="text-[10px] font-normal text-[#71685E]">Insert immediately before chosen element</span>
                    </label>

                    <label
                      onClick={() => setPlacementMode('after_block')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        placementMode === 'after_block'
                          ? 'border-[#5A1832] bg-[#EDE4D6] font-bold text-[#5A1832]'
                          : 'border-[#CBBEAC] bg-[#F6F0E7] text-[#292521]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="placementMode"
                        checked={placementMode === 'after_block'}
                        onChange={() => setPlacementMode('after_block')}
                        className="hidden"
                      />
                      <div>After Block...</div>
                      <span className="text-[10px] font-normal text-[#71685E]">Insert immediately after chosen element</span>
                    </label>
                  </div>
                </div>

                {(placementMode === 'before_block' || placementMode === 'after_block') && (
                  <div>
                    <label className="block font-bold text-[#292521] mb-1.5">
                      3. Select Target Block:
                    </label>
                    <select
                      value={targetBlockId}
                      onChange={(e) => setTargetBlockId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
                    >
                      <option value="">-- Choose Block in {targetSection?.title} --</option>
                      {targetSection?.blocks.map((b) => (
                        <option key={b.id} value={b.id}>
                          [{b.type.toUpperCase()}] {b.title || b.textContent?.slice(0, 40) || b.id}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {syncSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSyncWithChapter(selectedSectionId, placementMode, targetBlockId);
                      setSyncSuccessMsg(
                        `Successfully synchronized ${visual.figureNumber} into ${targetSection?.title}!`
                      );
                      setTimeout(() => setSyncSuccessMsg(''), 4000);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold inline-flex items-center space-x-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#C29A52]" />
                    <span>Synchronize &amp; Embed Block</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: VISUAL INTELLIGENCE & EDUCATIONAL GENERATION       */}
        {/* ========================================================= */}
        {activeTab === 'intelligence' && (
          <VisualIntelligenceStudio
            chapter={chapter}
            onUpdateChapter={onUpdateChapter}
            activeVisual={visual}
            onUpdateVisual={onUpdateVisual}
            visuals={visuals}
            onSelectVisual={onSelectVisual}
            onAddVisual={onAddVisual}
            onSwitchTab={(t) => setActiveTab(t as any)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </main>
  );
};
