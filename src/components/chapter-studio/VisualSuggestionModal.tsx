import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Image as ImageIcon,
  Check,
  Eye,
  Layers,
  ArrowRight,
  Lightbulb,
  FileText,
  SlidersHorizontal,
  Compass,
  Layout,
  Plus,
} from 'lucide-react';
import { VisualBlockData, TextbookContentBlock } from '../../types';
import { suggestVisualPedagogy } from '../../utils/chapterStudioData';

interface VisualSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  topicTitle: string;
  classLevel: string;
  onInsertVisualBlock: (visualBlock: TextbookContentBlock) => void;
  isDarkMode: boolean;
}

export const VisualSuggestionModal: React.FC<VisualSuggestionModalProps> = ({
  isOpen,
  onClose,
  sectionTitle,
  topicTitle,
  classLevel,
  onInsertVisualBlock,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'ai_suggestions' | 'custom_create'>('ai_suggestions');

  // Custom creation state
  const [customTitle, setCustomTitle] = useState(`${sectionTitle} Pedagogical Diagram`);
  const [customType, setCustomType] = useState<VisualBlockData['visualType']>('diagram');
  const [customCaption, setCustomCaption] = useState(`Figure: Visualizing ${sectionTitle} rules and patterns.`);
  const [customAltText, setCustomAltText] = useState(`Explanatory diagram illustrating key concepts in ${sectionTitle}`);
  const [customSource, setCustomSource] = useState('Academic Publishing Studio');
  const [customCredit, setCustomCredit] = useState('Editorial Pedagogical Design');
  const [customLicense, setCustomLicense] = useState<VisualBlockData['licenseStatus']>('Original Creation');
  const [customPlacement, setCustomPlacement] = useState<VisualBlockData['placement']>('center');
  const [customSize, setCustomSize] = useState<VisualBlockData['size']>('medium');
  const [customBrief, setCustomBrief] = useState(
    'Two-column visual schematic showing the contrast between the primary rule on the left and the common trap on the right.'
  );

  if (!isOpen) return null;

  const suggestions = suggestVisualPedagogy(sectionTitle, topicTitle, classLevel);

  const handleApplySuggestion = (sug: (typeof suggestions)[0]) => {
    const newBlock: TextbookContentBlock = {
      id: `blk-vis-${Date.now()}`,
      type: 'visual',
      title: sug.title,
      order: Date.now(),
      visibility: 'student',
      visualData: {
        visualType: sug.visualType,
        title: sug.title,
        caption: `Figure: ${sug.conceptDemonstrated}.`,
        altText: `Schematic representing ${sug.conceptDemonstrated}`,
        source: 'Academic Publishing Studio Core',
        credit: 'Textbook Editorial Team',
        licenseStatus: 'Original Creation',
        authorNote: sug.whyThisVisualHelps,
        placement: 'center',
        size: 'medium',
        svgIllustrationBrief: sug.illustrationBrief,
      },
    };
    onInsertVisualBlock(newBlock);
    onClose();
  };

  const handleCreateCustom = () => {
    const newBlock: TextbookContentBlock = {
      id: `blk-vis-${Date.now()}`,
      type: 'visual',
      title: customTitle,
      order: Date.now(),
      visibility: 'student',
      visualData: {
        visualType: customType,
        title: customTitle,
        caption: customCaption,
        altText: customAltText,
        source: customSource,
        credit: customCredit,
        licenseStatus: customLicense,
        placement: customPlacement,
        size: customSize,
        svgIllustrationBrief: customBrief,
      },
    };
    onInsertVisualBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#CBBEAC] bg-[#EDE4D6]/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#5A1832] text-[#FFFDF8]">
              <Sparkles className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#35101F]">Visual Suggestion Intelligence &amp; Studio</h3>
              <p className="text-xs text-[#71685E]">
                Visual-first pedagogical authoring for: <span className="font-medium text-[#5A1832]">{sectionTitle}</span> ({classLevel})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#292521] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#CBBEAC] px-4 text-xs font-semibold bg-[#EDE4D6]/30">
          <button
            type="button"
            onClick={() => setActiveTab('ai_suggestions')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'ai_suggestions'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>AI Pedagogical Visual Concepts ({suggestions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom_create')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'custom_create'
                ? 'border-[#5A1832] text-[#5A1832]'
                : 'border-transparent text-[#71685E] hover:text-[#292521]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Custom Visual Specification</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'ai_suggestions' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#EDE4D6]/70 border border-[#CBBEAC] text-[#292521] flex items-start space-x-2.5">
                <Lightbulb className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[11px] text-[#35101F] mb-0.5">How Visual Suggestions Work</p>
                  <p className="text-[11px] text-[#71685E] leading-relaxed">
                    Textbooks achieve distinction through visual explanations. The system analyzes what is being taught, explains why the visual helps students, and crafts an illustration brief ready for your production team.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-4 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] hover:border-[#C29A52] transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md uppercase font-mono text-[10px] font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                          {sug.visualType.replace('_', ' ')}
                        </span>
                        <h4 className="font-bold text-sm text-[#35101F]">{sug.title}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplySuggestion(sug)}
                        className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-xs cursor-pointer"
                      >
                        <span>Insert Block</span>
                        <ArrowRight className="w-3 h-3 text-[#C29A52]" />
                      </button>
                    </div>

                    <p className="text-[#292521] font-medium mb-2.5">
                      {sug.conceptDemonstrated}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <div className="p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]">
                        <span className="font-bold text-[10px] uppercase text-[#71685E] block mb-1">
                          Left / Component 1
                        </span>
                        <p className="text-[11px] text-[#292521] leading-snug">{sug.leftOrStep1}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]">
                        <span className="font-bold text-[10px] uppercase text-[#71685E] block mb-1">
                          Right / Component 2
                        </span>
                        <p className="text-[11px] text-[#292521] leading-snug">{sug.rightOrStep2}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start space-x-1.5 text-[#71685E] font-medium">
                        <span className="font-semibold text-[#292521] shrink-0">Why This Helps:</span>
                        <span>{sug.whyThisVisualHelps}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#EDE4D6]/50 border border-[#CBBEAC] text-[#292521] font-mono text-[10px] leading-relaxed">
                        <span className="font-bold text-[#5A1832] uppercase mr-1">Illustration Brief:</span>
                        {sug.illustrationBrief}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                    Visual Title *
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                    Visual Type
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  >
                    <option value="diagram">Diagram</option>
                    <option value="illustration">Illustration</option>
                    <option value="concept_map">Concept Map</option>
                    <option value="flowchart">Flowchart</option>
                    <option value="table">Table</option>
                    <option value="sentence_diagram">Sentence Diagram</option>
                    <option value="annotated_sentence">Annotated Sentence</option>
                    <option value="infographic">Infographic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                  Caption (appears in student textbook)
                </label>
                <input
                  type="text"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                  Alt Text (for accessibility &amp; screen readers)
                </label>
                <input
                  type="text"
                  value={customAltText}
                  onChange={(e) => setCustomAltText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                    Placement
                  </label>
                  <select
                    value={customPlacement}
                    onChange={(e) => setCustomPlacement(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  >
                    <option value="center">Center</option>
                    <option value="full_width">Full Width</option>
                    <option value="margin_right">Margin Right</option>
                    <option value="two_column">Two Column</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                    Size
                  </label>
                  <select
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  >
                    <option value="small">Small (compact margin)</option>
                    <option value="medium">Medium (standard block)</option>
                    <option value="large">Large (feature visual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                    License / Rights
                  </label>
                  <select
                    value={customLicense}
                    onChange={(e) => setCustomLicense(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                  >
                    <option value="Original Creation">Original Creation</option>
                    <option value="Commissioned">Commissioned Art</option>
                    <option value="Public Domain">Public Domain</option>
                    <option value="Creative Commons">Creative Commons</option>
                    <option value="Licensed">Licensed Rights</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#35101F] mb-1">
                  Illustration Brief &amp; Vector Art Guidance
                </label>
                <textarea
                  rows={3}
                  value={customBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                  placeholder="Detailed visual description for illustrators..."
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCreateCustom}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Insert Custom Visual Block</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
