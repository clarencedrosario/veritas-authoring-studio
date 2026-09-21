import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Plus,
  ShieldAlert,
  Sliders,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  BoardQuestionBlueprint,
  GrammarSeriesProject,
  QuestionBankGapItem,
  GrammarQuestion,
  GrammarExercise,
} from '../../types';
import {
  runQuestionBankGapAnalysis,
  generateDraftQuestionsForBlueprint,
} from '../../utils/boardBlueprintIntelligenceData';

interface QuestionBankGapAnalysisViewProps {
  blueprint: BoardQuestionBlueprint;
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
}

type DraftItemType = ReturnType<typeof generateDraftQuestionsForBlueprint>[number];

export const QuestionBankGapAnalysisView: React.FC<QuestionBankGapAnalysisViewProps> = ({
  blueprint,
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [filterOrigin, setFilterOrigin] = useState<'ALL' | 'OFFICIAL' | 'EDITORIAL'>('ALL');

  // Draft questions state
  const [generatedDrafts, setGeneratedDrafts] = useState<DraftItemType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approvedQuestionIds, setApprovedQuestionIds] = useState<Record<string, boolean>>({});

  const gapItems: QuestionBankGapItem[] = runQuestionBankGapAnalysis(blueprint, seriesProject);

  const filteredGaps = gapItems.filter((g) => {
    if (filterSeverity !== 'ALL' && g.severity.toUpperCase() !== filterSeverity) return false;
    if (filterOrigin === 'OFFICIAL' && !g.isOfficialRequirement) return false;
    if (filterOrigin === 'EDITORIAL' && g.isOfficialRequirement) return false;
    return true;
  });

  // Handle generating draft questions for this blueprint
  const handleGenerateDraftQuestions = (conceptName?: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const drafts = generateDraftQuestionsForBlueprint(
        blueprint,
        conceptName || blueprint.conceptWeightages?.[0]?.conceptName || 'Subject-Verb Concord',
        2
      );
      setGeneratedDrafts(drafts);
      setIsGenerating(false);
    }, 300);
  };

  // Approve a draft question and push to topic question bank
  const handleApproveAndAddDraft = (draft: DraftItemType) => {
    const targetClass = blueprint.targetClass || seriesProject.selectedClass || 'Class 6';
    const book = seriesProject.books[targetClass] || seriesProject.books['Class 6'];
    if (!book || book.topics.length === 0) {
      alert(`No curriculum topics found for ${targetClass}.`);
      return;
    }

    // Find topic matching concept or use first topic
    const targetTopic =
      book.topics.find((t) => t.title.toLowerCase().includes(draft.conceptTested?.toLowerCase() || '')) ||
      book.topics[0];

    const approvedQuestion: GrammarQuestion = {
      id: draft.id,
      type: draft.type,
      prompt: draft.prompt,
      options: draft.options,
      correctAnswer: draft.correctAnswer,
      acceptableAnswers: draft.acceptableAnswers,
      explanation: draft.explanation,
      difficulty: draft.difficulty,
      marks: draft.marks,
      cognitiveLevel: draft.cognitiveLevel,
      evidenceStatus: 'EDITORIAL MODEL',
    };

    const targetExercise: GrammarExercise = targetTopic.exercises?.[0] || {
      id: `ex-${Date.now()}`,
      title: `${draft.conceptTested} Practice Exercises`,
      instructions: 'Complete the following exercises based on official blueprint specifications.',
      targetType: 'mixed',
      maxMarks: 10,
      questions: [],
    };

    const updatedExercises = targetTopic.exercises && targetTopic.exercises.length > 0
      ? targetTopic.exercises.map((ex, idx) =>
          idx === 0 ? { ...ex, questions: [...ex.questions, approvedQuestion] } : ex
        )
      : [{ ...targetExercise, questions: [approvedQuestion] }];

    const updatedTopic = {
      ...targetTopic,
      exercises: updatedExercises,
    };

    const updatedBook = {
      ...book,
      topics: book.topics.map((t) => (t.id === targetTopic.id ? updatedTopic : t)),
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [targetClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });

    setApprovedQuestionIds((prev) => ({ ...prev, [draft.id]: true }));
  };

  return (
    <div id="question-bank-gap-analysis-view" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Question Bank Gap &amp; Alignment Studio
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            Identify curriculum deficit areas, missing question types, depth shortages, and generate verified academic drafts.
          </p>
        </div>

        <button
          onClick={() => handleGenerateDraftQuestions()}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Draft Questions'}</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Total Gaps Detected</span>
          <strong className="text-lg font-mono text-[#292521] dark:text-[#F6F0E7]">
            {gapItems.length}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-rose-600 block">High Severity</span>
          <strong className="text-lg font-mono text-rose-700 dark:text-rose-400">
            {gapItems.filter((g) => g.severity === 'high').length}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-amber-600 block">Medium Severity</span>
          <strong className="text-lg font-mono text-amber-700 dark:text-amber-400">
            {gapItems.filter((g) => g.severity === 'medium').length}
          </strong>
        </div>

        <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-stone-500 block">Official Board Requirements</span>
          <strong className="text-lg font-mono text-[#5A1832] dark:text-[#C29A52]">
            {gapItems.filter((g) => g.isOfficialRequirement).length}
          </strong>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[#CBBEAC]/80 dark:border-[#4d2b3b]/80 bg-[#F6F0E7]/50 dark:bg-[#2b1622]/50 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-stone-500 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Severity:</span>
          </span>
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterSeverity === sev
                  ? 'bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#1e0f18] font-bold'
                  : 'bg-white dark:bg-[#1e0f18] text-stone-600 dark:text-stone-300 border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] uppercase font-bold text-stone-500">Origin:</span>
          {(['ALL', 'OFFICIAL', 'EDITORIAL'] as const).map((orig) => (
            <button
              key={orig}
              onClick={() => setFilterOrigin(orig)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterOrigin === orig
                  ? 'bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#1e0f18] font-bold'
                  : 'bg-white dark:bg-[#1e0f18] text-stone-600 dark:text-stone-300 border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50'
              }`}
            >
              {orig}
            </button>
          ))}
        </div>
      </div>

      {/* Gap Items List */}
      <div className="space-y-3">
        {filteredGaps.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-serif font-bold text-emerald-900 dark:text-emerald-200">
              Zero Question Bank Deficits Detected for this Filter
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              All blueprint concept weightages, item typologies, and minimum question depths are currently satisfied.
            </p>
          </div>
        ) : (
          filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className={`p-4 rounded-xl border transition-all ${
                gap.severity === 'high'
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                  : gap.severity === 'medium'
                  ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                  : 'border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        gap.severity === 'high'
                          ? 'bg-rose-600 text-white'
                          : gap.severity === 'medium'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-500 text-white'
                      }`}
                    >
                      {gap.severity.toUpperCase()}
                    </span>
                    <strong className="text-sm text-[#292521] dark:text-[#F6F0E7]">
                      {gap.conceptTitle || gap.title}
                    </strong>
                    {gap.conceptCode && (
                      <span className="text-xs font-mono text-[#5A1832] dark:text-[#C29A52]">
                        ({gap.conceptCode})
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832]">
                      {gap.requirementOrigin || (gap.isOfficialRequirement ? 'Official Board Requirement' : 'Editorial Recommendation')}
                    </span>
                  </div>

                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-1">
                    {gap.description}
                  </p>

                  <p className="text-xs text-[#5A1832] dark:text-[#C29A52] italic">
                    Remediation: {gap.recommendation}
                  </p>

                  {(gap.currentCount !== undefined || gap.missingQuestionTypes) && (
                    <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                      {gap.currentCount !== undefined && (
                        <span>Current Count: <strong>{gap.currentCount}</strong></span>
                      )}
                      {gap.targetMinimum !== undefined && (
                        <>
                          <span>&bull;</span>
                          <span>Target Minimum: <strong>{gap.targetMinimum}</strong></span>
                        </>
                      )}
                      {gap.gapCount !== undefined && (
                        <>
                          <span>&bull;</span>
                          <span>Deficit: <strong className="text-rose-600 dark:text-rose-400">-{gap.gapCount}</strong></span>
                        </>
                      )}
                      {gap.missingQuestionTypes && gap.missingQuestionTypes.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <span>Missing Typologies: <strong>{gap.missingQuestionTypes.join(', ')}</strong></span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleGenerateDraftQuestions(gap.conceptTitle || gap.title)}
                  className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs shrink-0 self-start"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Item</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* GENERATED DRAFTS SECTION WITH MANDATORY LABEL */}
      {generatedDrafts.length > 0 && (
        <div className="pt-4 border-t border-[#CBBEAC] dark:border-[#4d2b3b] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C29A52]" />
                <span>Generated Draft Questions ({generatedDrafts.length})</span>
              </h3>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                Review and approve draft questions to populate the Chapter and Coursebook Question Bank.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {generatedDrafts.map((draft) => {
              const isApproved = !!approvedQuestionIds[draft.id];
              return (
                <div
                  key={draft.id}
                  className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 space-y-3 shadow-2xs"
                >
                  {/* MANDATORY EDITORIAL LABEL */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-stone-950 tracking-wider">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{draft.draftLabel || 'AI DRAFT — ACADEMIC REVIEW REQUIRED'}</span>
                    </span>

                    <div className="flex items-center space-x-2 text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                      <span>{draft.type.toUpperCase()}</span>
                      <span>&bull;</span>
                      <span>{draft.marks} Marks</span>
                      <span>&bull;</span>
                      <span>{draft.cognitiveLevel}</span>
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="text-xs font-semibold text-[#292521] dark:text-[#F6F0E7]">
                    {draft.prompt}
                  </div>

                  {/* Correct Answer / Guidance */}
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1e0f18] border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                    <div className="font-mono text-[10px] uppercase font-bold text-stone-500">
                      Standard Answer Key / Rubric:
                    </div>
                    <div className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                      {draft.correctAnswer}
                    </div>
                    {draft.markingRubricNotes && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 italic pt-1">
                        Guideline: {draft.markingRubricNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                      Concept: <strong>{draft.conceptTested}</strong>
                    </span>

                    <button
                      onClick={() => handleApproveAndAddDraft(draft)}
                      disabled={isApproved}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                        isApproved
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-[#5A1832] hover:bg-[#35101F] text-white dark:bg-[#C29A52] dark:text-[#1e0f18]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Approved & Added to Question Bank' : 'Approve & Add to Question Bank'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
