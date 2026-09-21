// =============================================================
// VERITAS Editorial Platform — AI Exercise Generator Modal
// Section 6: Pedagogical generator with Suggest/Preview/Accept/Reject workflow
// =============================================================

import React, { useState } from 'react';
import {
  StudioChapter,
  StudioExercise,
  GrammarQuestion,
  QuestionType,
  ExerciseDevelopmentalTier,
} from '../../../types';
import {
  generateAiExerciseQuestions,
  AiExerciseGenerationParams,
  GeneratedExerciseDraft,
} from '../../../utils/aiExerciseGenerator';
import {
  Sparkles,
  X,
  CheckCircle2,
  Trash2,
  Edit3,
  Layers,
  Eye,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AiExerciseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  currentExercise: StudioExercise;
  onAcceptQuestionsIntoExercise: (exerciseId: string, questions: GrammarQuestion[]) => void;
  onAcceptAsNewExercise: (newExercise: StudioExercise) => void;
  initialMode?: any;
  sourceQuestion?: GrammarQuestion;
}

export const AiExerciseGeneratorModal: React.FC<AiExerciseGeneratorModalProps> = ({
  isOpen,
  onClose,
  chapter,
  currentExercise,
  onAcceptQuestionsIntoExercise,
  onAcceptAsNewExercise,
  initialMode = 'generate_entire_exercise',
  sourceQuestion,
}) => {
  const [mode, setMode] = useState<any>(initialMode);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [tier, setTier] = useState<ExerciseDevelopmentalTier>(
    currentExercise.developmentalTier || 'PRACTICE'
  );
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [targetConcept, setTargetConcept] = useState<string>(
    currentExercise.grammarRuleCoverage?.[0] ||
      chapter.rules?.[0]?.ruleName ||
      (chapter.rules?.[0] as any)?.ruleTitle ||
      'Grammar Rule Application'
  );
  const [includeVisual, setIncludeVisual] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Generated draft state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedExerciseDraft | null>(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const params: AiExerciseGenerationParams = {
        mode,
        questionCount,
        questionTypes: ['identify_underline', 'mcq', 'rewrite_sentence', 'open_ended'],
        difficulty,
        tier,
        marksPerQuestion: 1,
        targetConcept,
        sourceQuestion,
        includeVisual: mode === 'from_visual' || includeVisual,
        targetVisualId: `vis-${chapter.id}-1`,
        targetVisualFigureNumber: 'Figure 1.1',
        customPrompt,
      };

      const result = generateAiExerciseQuestions(chapter, params);
      setGeneratedDraft(result);
      setSelectedQuestionIds(new Set(result.questions.map((q) => q.id)));
      setIsGenerating(false);
    }, 400);
  };

  const handleToggleSelectQuestion = (qId: string) => {
    const next = new Set(selectedQuestionIds);
    if (next.has(qId)) {
      next.delete(qId);
    } else {
      next.add(qId);
    }
    setSelectedQuestionIds(next);
  };

  const handleUpdateCandidateQuestion = (qId: string, updatedFields: Partial<GrammarQuestion>) => {
    if (!generatedDraft) return;
    const updated = generatedDraft.questions.map((q) =>
      q.id === qId ? { ...q, ...updatedFields } : q
    );
    setGeneratedDraft({
      ...generatedDraft,
      questions: updated,
    });
  };

  const handleAcceptSelected = () => {
    if (!generatedDraft) return;
    const accepted = generatedDraft.questions.filter((q) => selectedQuestionIds.has(q.id));

    if (accepted.length === 0) {
      alert('Please select at least one question to accept.');
      return;
    }

    if (mode === 'generate_entire_exercise') {
      const nextLetter = String.fromCharCode(65 + (chapter.exercises?.length || 0));
      const newEx: StudioExercise = {
        id: `ex-${chapter.id}-${nextLetter}-${Date.now()}`,
        letter: nextLetter,
        title: generatedDraft.exerciseTitle || `Exercise ${nextLetter}: Applied Practice`,
        progression:
          tier === 'FOUNDATION'
            ? 'foundation'
            : tier === 'APPLICATION'
            ? 'application'
            : tier === 'MASTERY'
            ? 'challenge'
            : 'understanding',
        developmentalTier: tier,
        status: 'Author Review',
        instructions:
          generatedDraft.exerciseInstructions || 'Read each question carefully and answer.',
        pedagogicalPurpose: generatedDraft.pedagogicalPurpose,
        difficulty,
        suggestedMarks: accepted.length,
        questionCount: accepted.length,
        boardRelevance: `${chapter.curriculumBoard || chapter.systemId || 'CISCE'} ${chapter.equivalentClass || 'Class 6'}`,
        classLevel: chapter.equivalentClass || 'Class 6',
        questions: accepted,
      };
      onAcceptAsNewExercise(newEx);
    } else {
      onAcceptQuestionsIntoExercise(currentExercise.id, accepted);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#292521]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border-2 border-[#D4AF37] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden font-serif">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#8C2435] to-[#6E1C2A] text-[#FAF7F2] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="text-base font-bold tracking-wide">
                AI Pedagogical Exercise Generator
              </h2>
              <p className="text-xs text-[#EADDC9]">
                Suggest &bull; Preview &bull; Edit &bull; Accept &bull; Reject
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#EADDC9] hover:text-white hover:bg-white/10 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Generation Configuration Grid */}
          <div className="bg-[#FAF7F2] p-4 rounded-lg border border-[#D8CBB9] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#615546] uppercase text-[10px] block mb-1">
                  Generation Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs font-semibold text-[#292521] outline-none"
                >
                  <option value="generate_entire_exercise">Generate Entire Exercise Set</option>
                  <option value="from_concept">From Concept / Rule</option>
                  <option value="from_visual">From Visual (Figure 1.1)</option>
                  <option value="more_like_this">Generate More Like This</option>
                  <option value="easier_version">Generate Scaffolded / Easier Variant</option>
                  <option value="harder_version">Generate Extension / Harder Variant</option>
                  <option value="misconceptions">Generate Misconception Traps</option>
                  <option value="challenge">Generate Higher-Order Challenge</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#615546] uppercase text-[10px] block mb-1">
                  Developmental Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as ExerciseDevelopmentalTier)}
                  className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs font-semibold text-[#8C2435] outline-none"
                >
                  <option value="FOUNDATION">FOUNDATION (Recognition)</option>
                  <option value="PRACTICE">PRACTICE (Consolidation)</option>
                  <option value="APPLICATION">APPLICATION (Sentence Level)</option>
                  <option value="CHALLENGE">CHALLENGE (Discrimination)</option>
                  <option value="MASTERY">MASTERY (Synthesis)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#615546] uppercase text-[10px] block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs font-semibold text-[#292521] outline-none"
                >
                  <option value="Easy">Easy (Grade 3 Standard)</option>
                  <option value="Medium">Medium (Application)</option>
                  <option value="Hard">Hard (Diagnostic Extension)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#615546] uppercase text-[10px] block mb-1">
                  Question Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs font-mono font-bold text-[#292521] outline-none"
                />
              </div>
            </div>

            {/* Target Concept Field */}
            <div>
              <label className="font-bold text-[#615546] uppercase text-[10px] block mb-1">
                Target Concept / Rule Tested
              </label>
              <input
                type="text"
                value={targetConcept}
                onChange={(e) => setTargetConcept(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-3 py-1.5 text-xs text-[#292521] outline-none"
                placeholder="e.g. Common vs Proper Nouns, Capitalization of City & Person names"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#DDD0BC]">
              <div className="text-xs text-[#7A6E5F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AI will draft items; no authored text is overwritten.</span>
              </div>

              <button
                onClick={handleRunGeneration}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8C2435] to-[#6E1C2A] text-white text-xs font-bold rounded shadow-sm hover:from-[#751E2D] hover:to-[#591621] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                {isGenerating ? 'Generating Candidates...' : 'Generate Candidate Questions'}
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PREVIEW CANDIDATES LIST                                       */}
          {/* ------------------------------------------------------------- */}
          {generatedDraft && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#D8CBB9]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#292521]">
                    Generated Draft Candidates ({generatedDraft.questions.length} Items)
                  </span>
                  <span className="text-[#7A6E5F]">
                    &bull; {selectedQuestionIds.size} Selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedQuestionIds(
                        new Set(generatedDraft.questions.map((q) => q.id))
                      )
                    }
                    className="text-[#8C2435] hover:underline font-bold text-xs"
                  >
                    Select All
                  </button>
                  <span className="text-[#DDD0BC]">|</span>
                  <button
                    onClick={() => setSelectedQuestionIds(new Set())}
                    className="text-[#7A6E5F] hover:underline text-xs"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="space-y-3">
                {generatedDraft.questions.map((q, idx) => {
                  const isSelected = selectedQuestionIds.has(q.id);
                  const isEditing = editingQuestionId === q.id;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#8C2435] ring-1 ring-[#8C2435]/20'
                          : 'bg-[#F9F5EE]/60 border-[#DDD0BC] opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectQuestion(q.id)}
                            className="w-4 h-4 text-[#8C2435] rounded border-[#DDD0BC] cursor-pointer"
                          />
                          <span className="font-bold text-xs text-[#8C2435]">
                            Candidate #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#EDE4D6] text-[#4A3F33] rounded">
                            {q.type.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setEditingQuestionId(isEditing ? null : q.id)
                            }
                            className="flex items-center gap-1 text-[11px] text-[#615546] hover:text-[#292521]"
                          >
                            <Edit3 className="w-3 h-3" />
                            {isEditing ? 'Done Editing' : 'Edit Prompt/Answer'}
                          </button>
                        </div>
                      </div>

                      {/* Prompt */}
                      {isEditing ? (
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="font-bold text-[#615546]">Prompt:</label>
                            <textarea
                              rows={2}
                              value={q.prompt}
                              onChange={(e) =>
                                handleUpdateCandidateQuestion(q.id, {
                                  prompt: e.target.value,
                                })
                              }
                              className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-[#615546]">Correct Answer:</label>
                            <input
                              type="text"
                              value={q.correctAnswer || ''}
                              onChange={(e) =>
                                handleUpdateCandidateQuestion(q.id, {
                                  correctAnswer: e.target.value,
                                })
                              }
                              className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-2 py-1 text-xs text-[#292521] outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-xs text-[#292521]">
                          <div className="font-medium whitespace-pre-line">{q.prompt}</div>

                          {q.options && (
                            <div className="grid grid-cols-2 gap-1 text-[11px] text-[#615546] pl-2">
                              {q.options.map((opt, oI) => (
                                <div key={oI}>{opt}</div>
                              ))}
                            </div>
                          )}

                          <div className="p-2 bg-[#EAF2DC] rounded text-xs text-[#2D5A27] flex items-center gap-2 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Correct: {q.correctAnswer || q.modelAnswer}</span>
                          </div>

                          {q.acceptableAlternatives && q.acceptableAlternatives.length > 0 && (
                            <div className="text-[11px] text-[#4A3F33] italic pl-2">
                              Alternatives: {q.acceptableAlternatives.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] border-t border-[#D8CBB9] p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#615546] hover:text-[#292521] rounded"
          >
            Cancel & Dismiss
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptSelected}
              disabled={!generatedDraft || selectedQuestionIds.size === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8C2435] text-white text-xs font-bold rounded shadow-sm hover:bg-[#721B2A] transition-all disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" />
              {mode === 'generate_entire_exercise'
                ? `Accept as New Exercise (${selectedQuestionIds.size} Qs)`
                : `Accept Selected (${selectedQuestionIds.size}) into Exercise ${currentExercise.letter}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
