import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Layers,
  Sliders,
  FileText,
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Palette,
  ExternalLink,
  Eye,
  Maximize2,
  Table as TableIcon,
  GitCommit,
  Check,
} from 'lucide-react';
import { StudioChapter, TextbookContentBlock, VisualBlockData } from '../../types';
import { suggestVisualPedagogy } from '../../utils/chapterStudioData';

interface VisualsStudioViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  onOpenVisualBriefModal: () => void;
  isDarkMode: boolean;
}

interface ChapterVisualItem {
  id: string;
  blockId: string;
  sectionTitle: string;
  figureNumber?: string;
  visualData: VisualBlockData;
  artworkStatus: 'brief' | 'placeholder' | 'uploaded' | 'final';
  designerInstruction?: string;
  authorInstruction?: string;
}

export const VisualsStudioView: React.FC<VisualsStudioViewProps> = ({
  chapter,
  onUpdateChapter,
  onOpenVisualBriefModal,
  isDarkMode,
}) => {
  const [selectedVisualId, setSelectedVisualId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'brief' | 'placeholder' | 'uploaded' | 'final'>('all');
  const [showNewVisualModal, setShowNewVisualModal] = useState(false);

  // New visual form state
  const [newTitle, setNewTitle] = useState('New Pedagogical Diagram');
  const [newFigureNum, setNewFigureNum] = useState(`Figure ${chapter.chapterNumber}.1`);
  const [newVisualType, setNewVisualType] = useState<VisualBlockData['visualType']>('diagram');
  const [newCaption, setNewCaption] = useState('Figure illustrating fundamental rule relationships.');
  const [newAltText, setNewAltText] = useState('Schematic showing subject and verb concord alignment');
  const [newSource, setNewSource] = useState('VERITAS Academic Studio');
  const [newCredit, setNewCredit] = useState('Editorial Design Team');
  const [newPlacement, setNewPlacement] = useState<VisualBlockData['placement']>('center');
  const [newSize, setNewSize] = useState<VisualBlockData['size']>('medium');
  const [newArtworkStatus, setNewArtworkStatus] = useState<'brief' | 'placeholder' | 'uploaded' | 'final'>('brief');
  const [newDesignerInstruction, setNewDesignerInstruction] = useState(
    'Create an antique brass balance scale with calligraphic lettering. Ensure high-contrast line work suitable for student edition.'
  );
  const [newAuthorInstruction, setNewAuthorInstruction] = useState(
    'Emphasize that the singular noun and singular verb balance evenly.'
  );

  // Extract all visuals across chapter sections
  const visuals: ChapterVisualItem[] = [];

  chapter.sections.forEach((sec, sIdx) => {
    sec.blocks.forEach((blk, bIdx) => {
      if (blk.type === 'visual' && blk.visualData) {
        visuals.push({
          id: `${sec.id}-${blk.id}`,
          blockId: blk.id,
          sectionTitle: sec.title,
          figureNumber: blk.figureNumber || `Fig ${chapter.chapterNumber}.${visuals.length + 1}`,
          visualData: blk.visualData,
          artworkStatus: blk.artworkStatus || 'brief',
          designerInstruction: blk.designerInstruction || blk.visualData.svgIllustrationBrief,
          authorInstruction: blk.authorInstruction || blk.visualData.authorNote,
        });
      }
    });
  });

  // Default demo visual items if none in sections yet
  const defaultVisuals: ChapterVisualItem[] = [
    {
      id: 'vis-demo-1',
      blockId: 'blk-sva-balance',
      sectionTitle: '6.1 Fundamental Concord Principles',
      figureNumber: 'Figure 6.1',
      visualData: {
        visualType: 'illustration',
        title: 'The Agreement Balance Scale',
        caption: 'Figure 6.1: Grammatical equilibrium between singular subjects and singular verb inflection.',
        altText: 'Antique balance scale depicting singular subject and verb with -s inflection in equilibrium.',
        source: 'VERITAS Academic Publishing Studio',
        credit: 'Editorial Pedagogical Design Team',
        licenseStatus: 'Original Creation',
        placement: 'center',
        size: 'medium',
        svgIllustrationBrief:
          'Antique brass mechanical scale with illuminated typographic characters. The left pan holds the singular pronoun "He" and noun "The clock"; the right pan balances with the verb ending "-s".',
      },
      artworkStatus: 'final',
      designerInstruction: 'Render in VERITAS palette (#35101F Burgundy and #C29A52 Antique Gold). Ensure crisp line work for print.',
      authorInstruction: 'Ensure the -s suffix is visually distinguished with an accent aura.',
    },
    {
      id: 'vis-demo-2',
      blockId: 'blk-sva-bracket',
      sectionTitle: '6.2 Intervening Prepositional Modifiers',
      figureNumber: 'Figure 6.2',
      visualData: {
        visualType: 'concept_map',
        title: 'The X-Ray Bracket Filter',
        caption: 'Figure 6.2: Mental bracketing of intervening prepositional phrases to expose the true head noun.',
        altText: 'Diagram illustrating how mental brackets isolate prepositional phrases from the true subject noun.',
        source: 'VERITAS Curriculum Lab',
        credit: 'Senior Pedagogical Cartographer',
        licenseStatus: 'Original Creation',
        placement: 'full_width',
        size: 'large',
        svgIllustrationBrief:
          'A calligraphic sentence where the intervening phrase "of Belgian chocolates" sits inside translucent glass brackets, while a glowing golden arch links "The box" directly to "is empty".',
      },
      artworkStatus: 'brief',
      designerInstruction: 'The bracket should look like a visual filter or X-ray lens that highlights the true grammatical spine.',
      authorInstruction: 'The sentence must read: "The box [of Belgian chocolates] is empty."',
    },
    {
      id: 'vis-demo-3',
      blockId: 'blk-sva-proximity',
      sectionTitle: '6.4 Correlative Conjunctions',
      figureNumber: 'Figure 6.3',
      visualData: {
        visualType: 'flowchart',
        title: 'The Proximity Magnet',
        caption: 'Figure 6.3: How correlative conjunctions (either...or, neither...nor) pull verb agreement to the closer subject.',
        altText: 'Magnetic field lines showing the proximity attraction between the closer subject noun and the verb.',
        source: 'VERITAS Academic Design',
        credit: 'Commissioned Studio Artist',
        licenseStatus: 'Commissioned',
        placement: 'two_column',
        size: 'medium',
        svgIllustrationBrief:
          'Stylized horseshoe magnet icon centered at the finite verb, pulling magnetic field lines toward Subject 2 while Subject 1 remains outside the field.',
      },
      artworkStatus: 'placeholder',
      designerInstruction: 'Keep arrows directional and clear so young readers see which noun governs the verb immediately.',
      authorInstruction: 'Include both singular-then-plural and plural-then-singular configurations.',
    },
  ];

  const allVisuals = visuals.length > 0 ? visuals : defaultVisuals;

  const filteredVisuals = allVisuals.filter((v) => {
    if (statusFilter !== 'all' && v.artworkStatus !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: ChapterVisualItem['artworkStatus']) => {
    switch (status) {
      case 'brief':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Visual Brief
          </span>
        );
      case 'placeholder':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Placeholder
          </span>
        );
      case 'uploaded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Uploaded Artwork
          </span>
        );
      case 'final':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            ✓ Final Artwork
          </span>
        );
    }
  };

  const handleUpdateVisualStatus = (vItem: ChapterVisualItem, newStatus: ChapterVisualItem['artworkStatus']) => {
    const updatedSections = chapter.sections.map((sec) => ({
      ...sec,
      blocks: sec.blocks.map((blk) => {
        if (blk.id === vItem.blockId) {
          return {
            ...blk,
            artworkStatus: newStatus,
          };
        }
        return blk;
      }),
    }));

    onUpdateChapter({
      ...chapter,
      sections: updatedSections,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleAddVisualBlock = () => {
    const firstSection = chapter.sections[0];
    if (!firstSection) return;

    const newBlock: TextbookContentBlock = {
      id: `blk-vis-${Date.now()}`,
      type: 'visual',
      title: newTitle,
      figureNumber: newFigureNum,
      order: firstSection.blocks.length + 1,
      visibility: 'student',
      artworkStatus: newArtworkStatus,
      designerInstruction: newDesignerInstruction,
      authorInstruction: newAuthorInstruction,
      visualData: {
        visualType: newVisualType,
        title: newTitle,
        caption: newCaption,
        altText: newAltText,
        source: newSource,
        credit: newCredit,
        licenseStatus: 'Original Creation',
        placement: newPlacement,
        size: newSize,
        svgIllustrationBrief: newDesignerInstruction,
      },
    };

    const updatedSections = chapter.sections.map((s, idx) =>
      idx === 0 ? { ...s, blocks: [...s.blocks, newBlock] } : s
    );

    onUpdateChapter({
      ...chapter,
      sections: updatedSections,
      lastSaved: new Date().toISOString(),
    });

    setShowNewVisualModal(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner with VERITAS Luxury Palette */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#EDE4D6]/70 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-[#5A1832] text-[#FFFDF8] shrink-0 shadow-xs">
              <ImageIcon className="w-6 h-6 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C29A52]">
                  Production Stage 6
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EDE4D6] text-[#5A1832] border border-[#C29A52]/30">
                  {allVisuals.length} Visual Assets
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-[#35101F] tracking-tight mt-0.5">
                Visual &amp; Illustration Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Commission, brief, and manage diagrams, sentence architectures, balance scales, timelines, flowcharts, and textbook figures.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onOpenVisualBriefModal}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Open Visual &amp; Illustration Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNewVisualModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#C29A52]/40 bg-[#FFFDF8] text-[#5A1832] hover:bg-[#EDE4D6] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>+ Quick Insert</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#CBBEAC] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#5A1832] text-[#FFFDF8]'
                : 'text-[#71685E] hover:bg-[#EDE4D6]'
            }`}
          >
            All Visuals ({allVisuals.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('brief')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'brief'
                ? 'bg-blue-600 text-white'
                : 'text-[#71685E] hover:bg-[#EDE4D6]'
            }`}
          >
            Visual Briefs ({allVisuals.filter((v) => v.artworkStatus === 'brief').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('placeholder')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'placeholder'
                ? 'bg-amber-600 text-white'
                : 'text-[#71685E] hover:bg-[#EDE4D6]'
            }`}
          >
            Placeholders ({allVisuals.filter((v) => v.artworkStatus === 'placeholder').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('uploaded')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'uploaded'
                ? 'bg-purple-600 text-white'
                : 'text-[#71685E] hover:bg-[#EDE4D6]'
            }`}
          >
            Uploaded Art ({allVisuals.filter((v) => v.artworkStatus === 'uploaded').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('final')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'final'
                ? 'bg-emerald-600 text-white'
                : 'text-[#71685E] hover:bg-[#EDE4D6]'
            }`}
          >
            Final Artwork ({allVisuals.filter((v) => v.artworkStatus === 'final').length})
          </button>
        </div>
      </div>

      {/* Visual Assets Cards */}
      <div className="space-y-6">
        {filteredVisuals.map((vItem) => (
          <div
            key={vItem.id}
            className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs hover:border-[#C29A52] transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#CBBEAC]/50">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#C29A52]">
                  {vItem.figureNumber || 'Figure'}
                </span>
                <span className="text-[#CBBEAC]">•</span>
                <h3 className="font-bold text-base text-[#35101F]">
                  {vItem.visualData.title}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#F6F0E7] text-[#5A1832] border border-[#CBBEAC]">
                  {vItem.visualData.visualType}
                </span>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center space-x-2">
                {getStatusBadge(vItem.artworkStatus)}
                <select
                  value={vItem.artworkStatus}
                  onChange={(e) => handleUpdateVisualStatus(vItem, e.target.value as any)}
                  className="px-2 py-1 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-semibold focus:outline-none"
                >
                  <option value="brief">Status: Visual Brief</option>
                  <option value="placeholder">Status: Placeholder</option>
                  <option value="uploaded">Status: Uploaded Art</option>
                  <option value="final">Status: Final Artwork</option>
                </select>
              </div>
            </div>

            {/* Visual Schematic Box / Preview Simulator */}
            <div className="p-6 rounded-xl border border-dashed border-[#C29A52] bg-[#F6F0E7] flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
              <div className="p-3 rounded-full bg-[#EDE4D6] text-[#5A1832] shadow-xs">
                {vItem.visualData.visualType === 'table' ? (
                  <TableIcon className="w-8 h-8 text-[#C29A52]" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#C29A52]" />
                )}
              </div>
              <div className="max-w-lg space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C29A52]">
                  {vItem.visualData.visualType.toUpperCase()} PREVIEW ({vItem.visualData.placement} • {vItem.visualData.size})
                </span>
                <p className="font-serif text-sm font-semibold text-[#35101F] italic">
                  "{vItem.visualData.caption}"
                </p>
                <p className="text-xs text-[#71685E] font-mono">
                  Alt text: {vItem.visualData.altText}
                </p>
              </div>
            </div>

            {/* Production Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              {/* Designer Instruction / Brief */}
              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/50 border border-[#CBBEAC] space-y-1.5">
                <span className="font-bold text-blue-800 block uppercase tracking-wider text-[10px]">
                  Illustration &amp; Designer Brief
                </span>
                <p className="text-[#292521] leading-relaxed">
                  {vItem.designerInstruction || vItem.visualData.svgIllustrationBrief || 'No detailed illustration brief specified yet.'}
                </p>
              </div>

              {/* Author Instruction */}
              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/50 border border-[#CBBEAC] space-y-1.5">
                <span className="font-bold text-[#5A1832] block uppercase tracking-wider text-[10px]">
                  Author Pedagogical Guidance
                </span>
                <p className="text-[#292521] leading-relaxed">
                  {vItem.authorInstruction || vItem.visualData.authorNote || 'Ensure that the grammatical concept is immediately graspable by students without reading surrounding text.'}
                </p>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#CBBEAC]/40 text-[11px] text-[#71685E]">
              <div className="flex items-center space-x-3">
                <span>Source: <strong className="text-[#292521]">{vItem.visualData.source}</strong></span>
                <span>Credit: <strong className="text-[#292521]">{vItem.visualData.credit}</strong></span>
                <span>License: <strong className="text-[#292521]">{vItem.visualData.licenseStatus}</strong></span>
              </div>
              <div className="font-medium text-[#71685E]">
                Placement: {vItem.visualData.placement} • Section: {vItem.sectionTitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insert Visual Modal */}
      {showNewVisualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3">
              <h3 className="font-bold text-base text-[#35101F] flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-[#C29A52]" />
                <span>Insert Pedagogical Visual / Figure</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewVisualModal(false)}
                className="text-[#71685E] hover:text-[#292521] cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[#35101F]">Figure Number</label>
                <input
                  type="text"
                  value={newFigureNum}
                  onChange={(e) => setNewFigureNum(e.target.value)}
                  placeholder="e.g. Figure 6.4"
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#35101F]">Visual Type</label>
                <select
                  value={newVisualType}
                  onChange={(e) => setNewVisualType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-semibold focus:outline-hidden"
                >
                  <option value="diagram">Diagram</option>
                  <option value="illustration">Editorial Illustration</option>
                  <option value="concept_map">Concept Map</option>
                  <option value="flowchart">Flowchart / Timeline</option>
                  <option value="sentence_diagram">Sentence Architecture Diagram</option>
                  <option value="table">Grammar Paradigm Table</option>
                  <option value="photo">Photograph</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold block mb-1 text-[#35101F]">Visual Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Subject-Verb Agreement Flowchart"
                className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-hidden"
              />
            </div>

            <div className="text-xs">
              <label className="font-bold block mb-1 text-[#35101F]">Figure Caption</label>
              <textarea
                rows={2}
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Caption printed directly below the figure in the textbook..."
                className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-hidden"
              />
            </div>

            <div className="text-xs">
              <label className="font-bold block mb-1 text-[#35101F]">Illustration Brief for Designer</label>
              <textarea
                rows={3}
                value={newDesignerInstruction}
                onChange={(e) => setNewDesignerInstruction(e.target.value)}
                placeholder="Detailed description of layout, colors, typography, callouts, and metaphors for the illustrator..."
                className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[#35101F]">Initial Status</label>
                <select
                  value={newArtworkStatus}
                  onChange={(e) => setNewArtworkStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-semibold focus:outline-hidden"
                >
                  <option value="brief">Visual Brief</option>
                  <option value="placeholder">Placeholder</option>
                  <option value="uploaded">Uploaded Art</option>
                  <option value="final">Final Artwork</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#35101F]">Placement</label>
                <select
                  value={newPlacement}
                  onChange={(e) => setNewPlacement(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-semibold focus:outline-hidden"
                >
                  <option value="center">Center</option>
                  <option value="full_width">Full Width</option>
                  <option value="two_column">Two Column</option>
                  <option value="margin_right">Margin Callout</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#35101F]">Size</label>
                <select
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-semibold focus:outline-hidden"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[#CBBEAC]">
              <button
                type="button"
                onClick={() => setShowNewVisualModal(false)}
                className="px-4 py-2 rounded-xl text-xs border border-[#CBBEAC] text-[#71685E] hover:bg-[#EDE4D6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVisualBlock}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-xs cursor-pointer"
              >
                Insert Visual Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
