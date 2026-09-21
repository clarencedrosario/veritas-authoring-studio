import React, { useState } from 'react';
import {
  X,
  Split,
  Plus,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Download,
  BookOpen,
  Eye,
} from 'lucide-react';
import { StudioChapter, VisualBriefRecord } from '../../types';

export interface SentenceDiagrammerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onUpdateChapter?: (updated: StudioChapter) => void;
  onInsertDiagram?: (visualBlock: any) => void;
  initialSentence?: string;
  isDarkMode: boolean;
}

export const SentenceDiagrammerModal: React.FC<SentenceDiagrammerModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onUpdateChapter,
  initialSentence = 'The captain, along with his crew members, has received the gallantry medal.',
  isDarkMode,
}) => {
  const [sentence, setSentence] = useState(initialSentence);
  const [diagramType, setDiagramType] = useState<'reed_kellogg' | 'syntax_tree' | 'clause_boxes'>('reed_kellogg');
  const [isInserted, setIsInserted] = useState(false);

  if (!isOpen) return null;

  const sampleSentences = [
    'The captain, along with his crew members, has received the gallantry medal.',
    'Neither the headmaster nor the senior tutors were present at the assembly.',
    'The bouquet of rare scarlet roses was presented to the visiting scholar.',
    'Ten kilometres is a formidable distance to hike before sunrise.',
  ];

  const handleInsertAsVisual = () => {
    const newVisual: VisualBriefRecord = {
      id: `vis-diag-${Date.now()}`,
      visualType: 'sentence_structure_diagram',
      title: `Sentence Diagram: ${sentence.slice(0, 32)}...`,
      figureNumber: `Figure 1.${(chapter.visualBriefs?.length || 0) + 1}`,
      caption: `Grammatical Diagram (${diagramType === 'reed_kellogg' ? 'Reed-Kellogg' : diagramType === 'syntax_tree' ? 'Syntax Tree' : 'Constituent Boxes'}): Demonstrating concord linkage in "${sentence}"`,
      altText: `Sentence structure diagram of: ${sentence}`,
      authorBrief: `Generated through VERITAS Sentence Diagramming Engine for syntactic analysis of concord.`,
      designerBrief: `Render architectural diagram showing head subject branch connecting directly to finite verb auxiliary.`,
      educationalPurpose: 'Isolate the subject-verb dependency from modifying clauses and prepositional adjuncts.',
      placement: 'inline',
      approximateSize: 'half_page',
      editionTarget: 'student_and_teacher',
      sourceOrCredit: 'VERITAS Sentence Diagramming Engine',
      copyrightStatus: 'original_commission',
      productionStatus: 'approved_artwork',
      diagramData: {
        sentence,
        diagramType,
      },
    };

    const updatedBriefs = [...(chapter.visualBriefs || []), newVisual];
    onUpdateChapter({
      ...chapter,
      visualBriefs: updatedBriefs,
      lastSaved: new Date().toISOString(),
    });

    setIsInserted(true);
    setTimeout(() => {
      setIsInserted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF7F2] dark:bg-stone-900 border border-[#8B263E]/30 dark:border-amber-900/50 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#8B263E] text-[#FAF7F2] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF7F2]/10 flex items-center justify-center text-[#D4AF37]">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                  Syntactic Engineering Bridge
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                  Linguistic Studio
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#FAF7F2]">
                Sentence Diagrammer Studio
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Sentence Input & Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Target Sentence to Diagram:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-serif text-stone-900 dark:text-stone-100 shadow-xs focus:ring-2 focus:ring-[#8B263E]"
              />
            </div>
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 self-center mr-1">
                Chapter Examples:
              </span>
              {sampleSentences.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSentence(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-[#8B263E] text-stone-700 dark:text-stone-300 transition-colors truncate max-w-[240px]"
                >
                  "{s.slice(0, 30)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Diagram Type Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Grammatical Diagram Standard:
            </span>
            <div className="flex bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setDiagramType('reed_kellogg')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  diagramType === 'reed_kellogg'
                    ? 'bg-[#8B263E] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                Reed–Kellogg Traditional
              </button>
              <button
                onClick={() => setDiagramType('syntax_tree')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  diagramType === 'syntax_tree'
                    ? 'bg-[#8B263E] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                Constituent Syntax Tree
              </button>
              <button
                onClick={() => setDiagramType('clause_boxes')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  diagramType === 'clause_boxes'
                    ? 'bg-[#8B263E] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                Functional Bracket Boxes
              </button>
            </div>
          </div>

          {/* Diagram Graphical Canvas */}
          <div className="p-6 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
            {diagramType === 'reed_kellogg' && (
              <div className="w-full max-w-lg space-y-4 font-serif">
                <div className="text-center text-xs font-mono text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                  Reed–Kellogg Syntactic Baseline
                </div>
                {/* Horizontal Baseline */}
                <div className="relative border-b-2 border-[#8B263E] dark:border-[#D4AF37] pb-2 flex items-end justify-between px-8">
                  <div className="text-center">
                    <span className="text-[11px] font-sans text-stone-400 block">Subject (Head Noun)</span>
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100">captain</span>
                  </div>
                  {/* Vertical Dividing Line */}
                  <div className="w-0.5 h-10 bg-[#8B263E] dark:bg-[#D4AF37] mx-6 -mb-2" />
                  <div className="text-center">
                    <span className="text-[11px] font-sans text-stone-400 block">Predicate (Verb Auxiliary)</span>
                    <span className="text-base font-bold text-stone-900 dark:text-stone-100">has received</span>
                  </div>
                </div>

                {/* Subordinate Slanted Prepositional Branch */}
                <div className="pl-12 pt-2 flex items-start gap-4">
                  <div className="border-l-2 border-dashed border-stone-400 h-8 transform rotate-12" />
                  <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold text-[10px] uppercase tracking-wider block text-amber-700 dark:text-amber-400">
                      Parenthetical Prepositional Modifier (Invariant)
                    </span>
                    "along with his crew members"
                  </div>
                </div>
              </div>
            )}

            {diagramType === 'syntax_tree' && (
              <div className="w-full max-w-md space-y-3 font-mono text-xs text-center">
                <div className="inline-block p-1.5 bg-[#8B263E] text-white rounded font-bold">
                  S (Sentence)
                </div>
                <div className="flex justify-around items-start pt-3">
                  <div className="space-y-2">
                    <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
                      NP (Subject)
                    </div>
                    <div className="text-[11px] font-serif font-bold text-[#8B263E] dark:text-[#E6C687]">
                      The captain
                    </div>
                    <div className="text-[9px] text-stone-500">
                      [+Singular, +3rd Person]
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
                      VP (Predicate)
                    </div>
                    <div className="text-[11px] font-serif font-bold text-[#8B263E] dark:text-[#E6C687]">
                      has received medal
                    </div>
                    <div className="text-[9px] text-stone-500">
                      [+Singular Agreement Match]
                    </div>
                  </div>
                </div>
              </div>
            )}

            {diagramType === 'clause_boxes' && (
              <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 p-2">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-center">
                  <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                    Head Subject (Singular)
                  </span>
                  <span className="text-sm font-serif font-bold text-emerald-950 dark:text-emerald-100">
                    The captain
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-400 text-center opacity-75">
                  <span className="text-[9px] font-bold text-stone-500 uppercase block">
                    Parenthetical Shield [ ]
                  </span>
                  <span className="text-xs italic text-stone-600 dark:text-stone-300">
                    along with his crew members
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-center">
                  <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                    Finite Verb (Singular Match)
                  </span>
                  <span className="text-sm font-serif font-bold text-emerald-950 dark:text-emerald-100">
                    has received
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#8B263E]" />
            <span>Connects directly into Chapter Visuals & Schematics pipeline</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsertAsVisual}
              disabled={isInserted}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#8B263E] hover:bg-[#721E32] text-[#FAF7F2] shadow-sm transition-colors"
            >
              {isInserted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Inserted into Visuals!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Insert into Chapter Visuals</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
