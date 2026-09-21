// =============================================================
// VERITAS Editorial Platform — New Visual Modal
// Phase 4E-1: Visual Production Foundation
// =============================================================

import React, { useState } from 'react';
import { X, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import { VisualType, VisualPedagogicalPurpose, VisualRecord } from '../../../types/visualStudio';
import { StudioChapter } from '../../../types';

interface NewVisualModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  existingCount: number;
  onAddVisual: (newRecord: VisualRecord) => void;
}

const VISUAL_TYPES: VisualType[] = [
  'Educational Illustration',
  'Grammar Diagram',
  'Sentence Diagram',
  'Concept Map',
  'Flowchart',
  'Timeline',
  'Comparison Chart',
  'Table',
  'Infographic',
  'Picture-Based Exercise',
  'Labelled Diagram',
  'Unlabelled Diagram',
  'Photograph',
  'Icon / Symbol',
  'Decorative Illustration',
  'Callout Illustration',
  'Process Diagram',
  'Reference Figure',
  'Custom Visual',
];

const PEDAGOGICAL_PURPOSES: VisualPedagogicalPurpose[] = [
  'Introduce Concept',
  'Explain Concept',
  'Demonstrate Rule',
  'Provide Example',
  'Compare Concepts',
  'Show Process',
  'Support Memory',
  'Practice / Exercise',
  'Assessment Stimulus',
  'Revision',
  'Decorative / Engagement',
];

export const NewVisualModal: React.FC<NewVisualModalProps> = ({
  isOpen,
  onClose,
  chapter,
  existingCount,
  onAddVisual,
}) => {
  const chNum = chapter.chapterNumber || 1;
  const nextNumber = existingCount + 1;

  const [title, setTitle] = useState('');
  const [visualType, setVisualType] = useState<VisualType>('Educational Illustration');
  const [purpose, setPurpose] = useState<VisualPedagogicalPurpose>('Introduce Concept');
  const [sectionId, setSectionId] = useState(chapter.sections[0]?.id || '');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [isExerciseStimulus, setIsExerciseStimulus] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const figNum = `Figure ${chNum}.${nextNumber}`;
    const selectedSec = chapter.sections.find((s) => s.id === sectionId);

    const newRecord: VisualRecord = {
      id: `vis-${chapter.id}-${Date.now()}`,
      figureNumber: figNum,
      title: title.trim(),
      visualType,
      purpose,
      learningObjectiveSupported: `Support core understanding for ${chapter.title}`,
      conceptSupported: title.trim(),
      status: 'Brief Required',
      statusHistory: [
        {
          status: 'Brief Required',
          timestamp: new Date().toISOString(),
          note: 'Visual requirement created in Chapter Visual Studio.',
          author: 'Author / Editor',
        },
      ],
      board: chapter.systemId || 'CBSE',
      classLevel: (chapter.equivalentClass as string) || 'Class 3',
      bookTitle: chapter.bookTitle || 'Step-by-Step English Grammar',
      unit: chapter.unitTitle || chapter.unitId || 'Unit 1',
      chapterNumber: chNum,
      chapterTitle: chapter.title,
      associatedSectionId: sectionId,
      associatedSectionTitle: selectedSec?.title || '',
      brief: {
        description: description.trim() || `Illustration requirement for ${title.trim()}`,
        requiredElements: [],
        optionalElements: [],
        elementsToAvoid: [],
        charactersPeople: '',
        settingEnvironment: '',
        objectsProps: '',
        labelsRequired: [],
        textInsideArtwork: '',
        ageAppropriateness: `${chapter.equivalentClass || 'Class 3'} level`,
        visualComplexity: 'Moderate',
        suggestedComposition: 'Clear focal point with balanced educational elements',
        orientation: 'Landscape',
        placement: 'Full Width',
        suggestedSize: 'Half page',
        colourGuidance: 'Consistent with textbook style palette',
        styleGuidance: 'Textbook line illustration with soft tints',
        accessibilityConsiderations: 'High contrast text and distinct silhouettes',
        illustratorInstructions: 'Deliver print-ready high-resolution asset',
        editorialNotes: '',
        referenceNotes: '',
      },
      metadata: {
        figureNumber: figNum,
        caption: caption.trim() || `${figNum}: ${title.trim()}`,
        shortCaption: title.trim(),
        altText: altText.trim() || `Illustration showing ${title.trim()}`,
        creditSource: 'VERITAS Academic Art Studio',
        copyrightStatus: 'Original Commission',
        rightsPermission: 'Exclusive Publishing Rights',
        creatorIllustrator: 'Commissioned Artist',
        dateCreated: new Date().toISOString().split('T')[0],
      },
      sourceType: 'Visual Brief Only',
      versions: [],
      review: {
        reviewStatus: 'Pending',
        reviewer: 'Editorial Board',
        reviewNotes: 'Newly registered visual brief awaiting artwork commission.',
        revisionRequested: '',
        reviewChecks: {
          educationalAccuracy: false,
          grammarAccuracy: false,
          ageAppropriateness: false,
          visualClarity: false,
          captionAccuracy: false,
          labelAccuracy: false,
          accessibility: false,
          boardRelevance: false,
          publicationSuitability: false,
        },
      },
      isExerciseStimulus,
      linkedExerciseId: isExerciseStimulus ? chapter.exercises[0]?.id : undefined,
      stimulusPrompt: isExerciseStimulus
        ? `Look at ${figNum} and complete the following exercise.`
        : undefined,
    };

    onAddVisual(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-2xl p-6 space-y-5 text-[#292521]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A1832] flex items-center justify-center text-[#C29A52]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#292521]">Register New Chapter Visual</h3>
              <p className="text-xs text-[#71685E]">
                Assigns sequential Figure {chNum}.{nextNumber} in {chapter.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#292521] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
              Visual Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Common Nouns Around Us"
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-sm text-[#292521] focus:outline-none focus:border-[#5A1832]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
                Visual Type *
              </label>
              <select
                value={visualType}
                onChange={(e) => setVisualType(e.target.value as VisualType)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
              >
                {VISUAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
                Pedagogical Purpose *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as VisualPedagogicalPurpose)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
              >
                {PEDAGOGICAL_PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
              Target Chapter Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
            >
              {chapter.sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
              Initial Illustration Description / Brief
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the required visual content, people, setting, objects or chart structure..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
                Reader-Facing Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`Figure ${chNum}.${nextNumber}: ...`}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1">
                Accessibility Alt-Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Accessible description for screen readers"
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-xs text-[#292521] focus:outline-none focus:border-[#5A1832]"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] flex items-center space-x-3">
            <input
              type="checkbox"
              id="exStimulus"
              checked={isExerciseStimulus}
              onChange={(e) => setIsExerciseStimulus(e.target.checked)}
              className="w-4 h-4 rounded text-[#5A1832] accent-[#5A1832]"
            />
            <label htmlFor="exStimulus" className="text-xs text-[#292521] cursor-pointer">
              <strong className="block text-[#5A1832]">Picture-Based Exercise Stimulus</strong>
              Use this visual as direct stimulus for an exercise or question in this chapter.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#CBBEAC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-xs font-semibold text-[#292521] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-xs font-bold text-[#FFFDF8] inline-flex items-center space-x-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C29A52]" />
              <span>Create Visual &amp; Brief</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
