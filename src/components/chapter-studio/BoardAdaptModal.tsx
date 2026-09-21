import React, { useState } from 'react';
import {
  Globe,
  X,
  Check,
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckSquare,
  Square,
  Copy,
  Info,
} from 'lucide-react';
import { StudioChapter, CurriculumSystemId, CrossBoardAdaptationPlan } from '../../types';
import {
  generateCrossBoardAdaptationPlan,
  EDUCATION_SYSTEM_PROFILES,
} from '../../utils/curriculumFrameworkData';
import {
  isSameTopicDomain,
  sanitizeChapterDataIntegrity,
} from '../../utils/dataIntegrityGuard';

interface BoardAdaptModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onApplyAdaptation: (adaptedChapter: StudioChapter) => void;
  isDarkMode: boolean;
}

export const BoardAdaptModal: React.FC<BoardAdaptModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onApplyAdaptation,
  isDarkMode,
}) => {
  const currentBoard = chapter?.systemId || 'CBSE';
  const [targetBoard, setTargetBoard] = useState<CurriculumSystemId>(
    currentBoard === 'CBSE' ? 'CISCE' : currentBoard === 'CISCE' ? 'Cambridge' : 'CBSE'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [adaptationPlan, setAdaptationPlan] = useState<CrossBoardAdaptationPlan | null>(null);
  const [authorConfirmed, setAuthorConfirmed] = useState(false);
  const [adaptationMode, setAdaptationMode] = useState<'create_variant' | 'apply_to_current'>('create_variant');

  if (!isOpen || !chapter) return null;

  const sourceProfile = EDUCATION_SYSTEM_PROFILES[currentBoard] || EDUCATION_SYSTEM_PROFILES.CBSE;
  const targetProfile = EDUCATION_SYSTEM_PROFILES[targetBoard] || EDUCATION_SYSTEM_PROFILES.CISCE;

  const handleGeneratePlan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const plan = generateCrossBoardAdaptationPlan(chapter, targetBoard);
      setAdaptationPlan(plan);
      setIsProcessing(false);
    }, 400);
  };

  const handleToggleActionApproval = (actionId: string) => {
    if (!adaptationPlan) return;
    const updatedActions = adaptationPlan.actions.map((act) =>
      act.id === actionId ? { ...act, approved: !act.approved } : act
    );
    setAdaptationPlan({
      ...adaptationPlan,
      actions: updatedActions,
    });
  };

  const handleExecuteAdaptation = () => {
    if (!adaptationPlan || !authorConfirmed) return;

    const targetTitle = adaptationPlan.targetChapterTitle;
    const sameTopic = isSameTopicDomain(chapter.title, targetTitle);

    if (adaptationMode === 'create_variant') {
      // Create new variant chapter leaving source untouched
      const variantId = `${chapter.id}-${targetBoard.toLowerCase()}`;
      const variantChapter: StudioChapter = {
        ...chapter,
        id: variantId,
        systemId: targetBoard,
        title: targetTitle,
        equivalentClass: adaptationPlan.targetClassOrStage,
        sections: sameTopic
          ? chapter.sections.map((s) => ({ ...s, chapterId: variantId }))
          : [],
        exercises: sameTopic
          ? chapter.exercises.map((e) => ({ ...e, chapterId: variantId }))
          : [],
        opening: sameTopic
          ? { ...chapter.opening, title: targetTitle }
          : {
              chapterNumber: chapter.opening.chapterNumber,
              title: targetTitle,
              subtitle: `${adaptationPlan.targetClassOrStage} Grammar Master Class`,
              shortIntroduction: '',
              openingHook: '',
              learningObjectives: [],
              keyVocabulary: [targetTitle],
              conceptsCovered: [targetTitle],
              estimatedStudyTimeMinutes: 90,
            },
        ending: sameTopic ? chapter.ending : undefined,
        revisionData: sameTopic ? chapter.revisionData : undefined,
        authorNotes: `Adapted from ${sourceProfile.name} version of "${chapter.title}" using VERITAS Cross-Board Adaptation Plan. Approved by author on ${new Date().toLocaleDateString()}.`,
        lastSaved: new Date().toISOString(),
      };
      const cleanVariant = sanitizeChapterDataIntegrity(variantChapter, variantId).chapter;
      onApplyAdaptation(cleanVariant);
    } else {
      // In-place modification with updated metadata
      const modifiedChapter: StudioChapter = {
        ...chapter,
        systemId: targetBoard,
        title: targetTitle,
        equivalentClass: adaptationPlan.targetClassOrStage,
        sections: sameTopic ? chapter.sections : [],
        exercises: sameTopic ? chapter.exercises : [],
        opening: sameTopic
          ? { ...chapter.opening, title: targetTitle }
          : {
              ...chapter.opening,
              title: targetTitle,
              shortIntroduction: '',
              openingHook: '',
              learningObjectives: [],
            },
        ending: sameTopic ? chapter.ending : undefined,
        revisionData: sameTopic ? chapter.revisionData : undefined,
        authorNotes: `Board adapted to ${targetProfile.name}. Adaptation plan approved on ${new Date().toLocaleDateString()}.`,
        lastSaved: new Date().toISOString(),
      };
      const cleanModified = sanitizeChapterDataIntegrity(modifiedChapter, chapter.id).chapter;
      onApplyAdaptation(cleanModified);
    }

    onClose();
  };

  const getActionBadge = (action: CrossBoardAdaptationPlan['actions'][0]['action']) => {
    switch (action) {
      case 'KEEP':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'MODIFY':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'ADD':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'REMOVE':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'REVIEW':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div
      id="board-adapt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="board-adapt-modal"
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-[#181515] border-[#5A1832] text-[#EDE4D6]'
            : 'bg-[#FAF7F2] border-[#CBBEAC] text-[#292521]'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Cross-Board Adaptation Engine
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                  AUTHOR APPROVAL REQUIRED
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#191918] dark:text-[#F6F0E7] mt-0.5">
                Generate Adaptation Plan: {chapter.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Board Selector */}
          <div className="p-4 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-3">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#A89C8F]">
              Select Target Education System
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[]).map((board) => {
                const isCurrent = currentBoard === board;
                const isSelected = targetBoard === board;
                const prof = EDUCATION_SYSTEM_PROFILES[board];

                return (
                  <button
                    key={board}
                    type="button"
                    disabled={isCurrent}
                    onClick={() => {
                      setTargetBoard(board);
                      setAdaptationPlan(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isCurrent
                        ? 'opacity-40 border-dashed border-stone-300 cursor-not-allowed bg-stone-50 dark:bg-stone-900'
                        : isSelected
                        ? 'border-[#5A1832] dark:border-[#C29A52] bg-[#FAF7F2] dark:bg-[#2A121D] shadow-xs ring-1 ring-[#5A1832]/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 bg-white dark:bg-stone-900/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        {board}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600">
                          Current
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#5A1832] text-[#EDE4D6]">
                          Target
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                      {prof.description}
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-stone-500">
                      Standard: <strong>{prof.standardsTerminology}</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C29A52]" />
                <span>{isProcessing ? 'Generating Analysis...' : 'Generate Adaptation Plan'}</span>
              </button>
            </div>
          </div>

          {/* Generated Adaptation Plan */}
          {adaptationPlan && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Comparative Matrix Section */}
              <div className="p-5 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
                    <span>Curriculum &amp; Pedagogical Comparison</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                    {adaptationPlan.sourceBoard} → {adaptationPlan.targetBoard}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#71685E] block">
                      Target Chapter Title &amp; Standard
                    </span>
                    <p className="font-serif font-bold text-stone-800 dark:text-stone-200 text-sm">
                      {adaptationPlan.targetChapterTitle}
                    </p>
                    <p className="text-stone-500 font-mono text-[11px]">
                      {adaptationPlan.targetProgramme} • {adaptationPlan.targetClassOrStage}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#71685E] block">
                      Pedagogical Depth Shift
                    </span>
                    <p className="text-stone-700 dark:text-stone-300">
                      {adaptationPlan.comparison.depthShift}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#71685E] block">
                      Exercise Style Shift
                    </span>
                    <p className="text-stone-700 dark:text-stone-300">
                      {adaptationPlan.comparison.exerciseStyleShift}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#71685E] block">
                      Assessment &amp; Rubric Expectations
                    </span>
                    <p className="text-stone-700 dark:text-stone-300">
                      {adaptationPlan.comparison.assessmentExpectations}
                    </p>
                  </div>
                </div>

                {/* Terminology Shifts */}
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#A89C8F] block mb-2">
                    Key Terminology Alignments ({adaptationPlan.comparison.terminology.length} shifts)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {adaptationPlan.comparison.terminology.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-black/20 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="line-through text-stone-400 mr-2">{t.from}</span>
                          <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">{t.to}</span>
                        </div>
                        {t.note && <span className="text-[10px] text-stone-500 italic">{t.note}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Plan Table (KEEP / MODIFY / ADD / REMOVE / REVIEW) */}
              <div className="p-5 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      Granular Adaptation Action Plan
                    </h4>
                    <p className="text-xs text-stone-500">
                      Approve or uncheck individual items before executing adaptation.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {adaptationPlan.actions.filter((a) => a.approved).length} of {adaptationPlan.actions.length} Approved
                  </span>
                </div>

                <div className="space-y-2.5">
                  {adaptationPlan.actions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleActionApproval(item.id)}
                      className={`p-3.5 rounded-xl border transition-colors flex items-start space-x-3 cursor-pointer ${
                        item.approved
                          ? 'border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-black/20'
                          : 'border-dashed border-stone-300 opacity-60 bg-stone-50'
                      }`}
                    >
                      <div className="mt-0.5 text-[#5A1832] dark:text-[#C29A52]">
                        {item.approved ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getActionBadge(
                              item.action
                            )}`}
                          >
                            {item.action}
                          </span>
                          <span className="font-mono text-xs font-semibold text-stone-700 dark:text-stone-300">
                            {item.targetComponent}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                          {item.itemDescription}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          <strong>Rationale:</strong> {item.rationale}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Mode & Mandatory Author Approval */}
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
                  <h4 className="font-serif font-bold text-sm text-amber-900 dark:text-amber-200">
                    Author Verification &amp; Non-Destructive Protection
                  </h4>
                </div>

                <div className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
                  <p>
                    VERITAS guarantees source chapter integrity: source manuscripts are never silently overwritten.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center space-x-2 p-3 rounded-lg border border-amber-400/50 bg-white/70 dark:bg-black/30 cursor-pointer">
                      <input
                        type="radio"
                        name="adaptation_mode"
                        checked={adaptationMode === 'create_variant'}
                        onChange={() => setAdaptationMode('create_variant')}
                        className="text-[#5A1832] focus:ring-[#5A1832]"
                      />
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        Create Variant Chapter (Recommended)
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 p-3 rounded-lg border border-amber-400/50 bg-white/70 dark:bg-black/30 cursor-pointer">
                      <input
                        type="radio"
                        name="adaptation_mode"
                        checked={adaptationMode === 'apply_to_current'}
                        onChange={() => setAdaptationMode('apply_to_current')}
                        className="text-[#5A1832] focus:ring-[#5A1832]"
                      />
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        Apply Modifications to Active Chapter
                      </span>
                    </label>
                  </div>

                  <label className="flex items-center space-x-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={authorConfirmed}
                      onChange={(e) => setAuthorConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A1832] focus:ring-[#5A1832]"
                    />
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      I have reviewed the {adaptationPlan.targetBoard} adaptation plan and approve the execution.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>

          {adaptationPlan && (
            <button
              type="button"
              disabled={!authorConfirmed}
              onClick={handleExecuteAdaptation}
              className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-xs ${
                authorConfirmed
                  ? 'bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] cursor-pointer'
                  : 'bg-stone-300 text-stone-500 dark:bg-stone-800 dark:text-stone-600 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 text-[#C29A52]" />
              <span>
                {adaptationMode === 'create_variant'
                  ? `Create ${adaptationPlan.targetBoard} Chapter Variant`
                  : `Apply ${adaptationPlan.targetBoard} Adaptation`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
