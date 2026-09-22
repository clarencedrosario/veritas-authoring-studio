// =============================================================
// VERITAS Editorial Platform — Exercise Authoring Center
// Section 5, 24: Dominant middle column for exercise & question editing
// =============================================================

import React, { useState, useRef } from 'react';
import {
  StudioExercise,
  GrammarQuestion,
  QuestionType,
  ExerciseDevelopmentalTier,
  ExerciseWorkflowStatus,
  CognitiveLevel,
  ClarityAuditResult,
  ClarityAuditIssue,
  ClarityAuditStatus,
  AccuracyAuditResult,
  AccuracyAuditFinding,
  AccuracyAuditStatus,
  AccuracyAnswerStatus,
  AuditConfidence,
  StudioChapter,
  GrammarSeriesProject,
} from '../../../types';
import { auditQuestionClarity, auditQuestionAccuracy } from '../../../utils/editorialAuditApi';
import { CreateQuestionDialog } from '../../common/CreateQuestionDialog';
import { ImportFromQuestionBankModal } from './ImportFromQuestionBankModal';
import { CHAPTER_COMPONENT_REGISTRY } from '../engine/componentRegistry';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  BookOpen,
  Eye,
  CheckCircle2,
  CircleCheckBig,
  ScanSearch,
  SearchCheck,
  RotateCcw,
  AlertCircle,
  GraduationCap,
  Info,
  Award,
  Layers,
  HelpCircle,
  Tag,
  AlertTriangle,
  ExternalLink,
  ArrowRightLeft,
  Database,
  Check,
  Send,
  SlidersHorizontal,
  ShieldCheck,
  BadgeCheck,
  Edit3,
} from 'lucide-react';

interface ExerciseAuthoringCenterProps {
  exercise: StudioExercise;
  onUpdateExercise: (updated: StudioExercise) => void;
  onOpenVisualStudio?: (visualId?: string) => void;
  onOpenAiGeneratorForQuestion?: (question: GrammarQuestion) => void;
  onSelectQuestionForIntelligence?: (questionId: string) => void;
  selectedQuestionId?: string;
  availableExercises?: StudioExercise[];
  onMoveQuestionToExercise?: (questionId: string, targetExerciseId: string) => void;
  onSaveToQuestionBank?: (question: GrammarQuestion) => void;
  chapter?: StudioChapter;
  activeComponentId?: string;
  seriesProject?: GrammarSeriesProject;
}

const QUESTION_TYPES: { type: QuestionType; label: string; group: string }[] = [
  { type: 'identify_underline', label: 'Identify / Underline', group: 'Recognition' },
  { type: 'circle_select', label: 'Circle / Select', group: 'Recognition' },
  { type: 'mcq', label: 'Multiple Choice (MCQ)', group: 'Objective' },
  { type: 'fill_in_blanks', label: 'Fill in the Blanks', group: 'Objective' },
  { type: 'true_false', label: 'True / False', group: 'Objective' },
  { type: 'match_column', label: 'Match Columns', group: 'Structured' },
  { type: 'classification', label: 'Classification / Sorting', group: 'Structured' },
  { type: 'rewrite_sentence', label: 'Rewrite Sentence', group: 'Application' },
  { type: 'error_correction', label: 'Error Correction', group: 'Application' },
  { type: 'sentence_combining', label: 'Sentence Combining', group: 'Application' },
  { type: 'visual_picture', label: 'Visual / Picture Stimulus', group: 'Multimodal' },
  { type: 'open_ended', label: 'Open-Ended Composition', group: 'Higher-Order' },
  { type: 'short_answer', label: 'Short Answer Response', group: 'Higher-Order' },
];

export const ExerciseAuthoringCenter: React.FC<ExerciseAuthoringCenterProps> = ({
  exercise,
  onUpdateExercise,
  onOpenVisualStudio,
  onOpenAiGeneratorForQuestion,
  onSelectQuestionForIntelligence,
  selectedQuestionId,
  availableExercises,
  onMoveQuestionToExercise,
  onSaveToQuestionBank,
  chapter,
  activeComponentId,
  seriesProject,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    exercise.questions?.[0]?.id || null
  );
  const [questionToDeleteIndex, setQuestionToDeleteIndex] = useState<number | null>(null);
  const [savedToBankIds, setSavedToBankIds] = useState<Set<string>>(new Set());
  const [sentToQuizIds, setSentToQuizIds] = useState<Set<string>>(new Set());
  const [sentToAssessmentIds, setSentToAssessmentIds] = useState<Set<string>>(new Set());

  // Question Creation & Import Modals
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDialogType, setCreateDialogType] = useState<QuestionType>('mcq');
  const [isImportBankOpen, setIsImportBankOpen] = useState(false);

  // Granular Question AI Actions
  const [runningAiActionForQId, setRunningAiActionForQId] = useState<Record<string, string>>({});
  const [activeActionMenuQId, setActiveActionMenuQId] = useState<string | null>(null);
  const [aiAmbiguityReport, setAiAmbiguityReport] = useState<
    Record<
      string,
      {
        isAmbiguous: boolean;
        report: string;
        improvedPrompt?: string;
        recommendations?: string[];
      }
    >
  >({});

  // Rapid double-click guard
  const isAddingRef = useRef(false);

  // Clarity Audit State
  const [auditingQIds, setAuditingQIds] = useState<Set<string>>(new Set());
  const [clarityAuditResults, setClarityAuditResults] = useState<Record<string, ClarityAuditResult>>({});
  const [clarityAuditErrors, setClarityAuditErrors] = useState<Record<string, string>>({});
  const [appliedQIds, setAppliedQIds] = useState<Set<string>>(new Set());

  // Accuracy & Answer Key Audit State
  const [auditingAccuracyQIds, setAuditingAccuracyQIds] = useState<Set<string>>(new Set());
  const [accuracyAuditResults, setAccuracyAuditResults] = useState<Record<string, AccuracyAuditResult>>({});
  const [accuracyAuditErrors, setAccuracyAuditErrors] = useState<Record<string, string>>({});
  const [appliedAccuracyNotices, setAppliedAccuracyNotices] = useState<Record<string, string>>({});

  const questions = exercise.questions || [];

  const handleSaveQuestionToBank = (q: GrammarQuestion) => {
    if (onSaveToQuestionBank) {
      onSaveToQuestionBank(q);
    }
    setSavedToBankIds((prev) => new Set([...prev, q.id]));
  };

  const handleSendToInteractiveQuiz = (qId: string) => {
    setSentToQuizIds((prev) => new Set([...prev, qId]));
  };

  const handleSendToAssessmentBuilder = (qId: string) => {
    setSentToAssessmentIds((prev) => new Set([...prev, qId]));
  };

  // Audit Clarity handler for an individual question
  const handleAuditClarity = async (q: GrammarQuestion) => {
    if (auditingQIds.has(q.id)) return; // Prevent duplicate requests
    const promptText = q.prompt || q.originalSentence || q.blanksSentence || '';
    if (!promptText.trim()) {
      setClarityAuditErrors((prev) => ({
        ...prev,
        [q.id]: 'Question text is required to audit clarity.',
      }));
      return;
    }

    setAuditingQIds((prev) => new Set([...prev, q.id]));
    setClarityAuditErrors((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });

    try {
      const result = await auditQuestionClarity({
        questionText: promptText,
        questionType: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer || q.modelAnswer,
        chapter: exercise.title,
      });
      setClarityAuditResults((prev) => ({ ...prev, [q.id]: result }));
    } catch (err: any) {
      setClarityAuditErrors((prev) => ({
        ...prev,
        [q.id]: err.message || 'Clarity audit failed. Original question remains unchanged.',
      }));
    } finally {
      setAuditingQIds((prev) => {
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
    }
  };

  // Explicitly apply suggested revision to question
  const handleApplySuggestion = (qIndex: number, q: GrammarQuestion) => {
    const result = clarityAuditResults[q.id];
    if (!result?.suggestedRevision) return;
    const revised = result.suggestedRevision.trim();
    if (!revised) return;

    handleUpdateQuestion(qIndex, {
      ...q,
      prompt: revised,
      originalSentence: q.originalSentence ? revised : q.originalSentence,
      blanksSentence: q.blanksSentence ? revised : q.blanksSentence,
    });

    setAppliedQIds((prev) => new Set([...prev, q.id]));
  };

  // Dismiss audit findings for a question
  const handleDismissAudit = (qId: string) => {
    setClarityAuditResults((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setClarityAuditErrors((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setAppliedQIds((prev) => {
      const next = new Set(prev);
      next.delete(qId);
      return next;
    });
  };

  // Audit Accuracy & Answer Key handler for an individual question
  const handleAuditAccuracy = async (q: GrammarQuestion) => {
    if (auditingAccuracyQIds.has(q.id)) return; // Prevent duplicate requests
    const promptText = q.prompt || q.originalSentence || q.blanksSentence || '';
    if (!promptText.trim()) {
      setAccuracyAuditErrors((prev) => ({
        ...prev,
        [q.id]: 'Question text is required to audit accuracy and answer key.',
      }));
      return;
    }

    setAuditingAccuracyQIds((prev) => new Set([...prev, q.id]));
    setAccuracyAuditErrors((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });

    try {
      const result = await auditQuestionAccuracy({
        questionText: promptText,
        questionType: q.type,
        options: q.options,
        currentAnswer: q.correctAnswer || q.modelAnswer,
        rationale: q.explanation || (q as any).pedagogicalNotes,
        marks: q.marks,
        chapter: exercise.title,
      });
      setAccuracyAuditResults((prev) => ({ ...prev, [q.id]: result }));
    } catch (err: any) {
      setAccuracyAuditErrors((prev) => ({
        ...prev,
        [q.id]: err.message || 'Accuracy audit failed. Original question remains unchanged.',
      }));
    } finally {
      setAuditingAccuracyQIds((prev) => {
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
    }
  };

  // Apply suggested accuracy corrections to question
  const handleApplyAccuracyCorrection = (
    qIndex: number,
    q: GrammarQuestion,
    type: 'prompt' | 'answer' | 'both'
  ) => {
    const result = accuracyAuditResults[q.id];
    if (!result) return;

    let updated = { ...q };
    let notice = '';

    if ((type === 'prompt' || type === 'both') && result.suggestedQuestionRevision) {
      const revisedPrompt = result.suggestedQuestionRevision.trim();
      updated = {
        ...updated,
        prompt: revisedPrompt,
        originalSentence: q.originalSentence ? revisedPrompt : q.originalSentence,
        blanksSentence: q.blanksSentence ? revisedPrompt : q.blanksSentence,
      };
      notice = 'Question stem revision applied.';
    }

    if ((type === 'answer' || type === 'both') && result.suggestedAnswer) {
      const revisedKey = result.suggestedAnswer.trim();
      updated = {
        ...updated,
        correctAnswer: revisedKey,
        modelAnswer: revisedKey,
      };
      notice = type === 'both' ? 'Question revision & verified key applied.' : 'Verified answer key applied.';
    }

    handleUpdateQuestion(qIndex, updated);
    setAppliedAccuracyNotices((prev) => ({ ...prev, [q.id]: notice }));
  };

  // Dismiss accuracy audit findings
  const handleDismissAccuracyAudit = (qId: string) => {
    setAccuracyAuditResults((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setAccuracyAuditErrors((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
    setAppliedAccuracyNotices((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  // Update a single field in the exercise
  const handleFieldChange = (field: keyof StudioExercise, value: any) => {
    onUpdateExercise({
      ...exercise,
      [field]: value,
    });
  };

  // Update a specific question
  const handleUpdateQuestion = (qIndex: number, updatedQuestion: GrammarQuestion) => {
    const newQuestions = [...questions];
    newQuestions[qIndex] = updatedQuestion;
    onUpdateExercise({
      ...exercise,
      questions: newQuestions,
    });
  };

  // Add a new question with double-click guard
  const handleAddQuestion = (type: QuestionType = 'identify_underline') => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    setTimeout(() => {
      isAddingRef.current = false;
    }, 400);

    const newQId = `q-${exercise.id}-${Date.now()}`;
    const newQ: GrammarQuestion = {
      id: newQId,
      type,
      prompt: '',
      blanksSentence: '',
      correctAnswer: '',
      modelAnswer: '',
      acceptableAnswers: [],
      acceptableAlternatives: [],
      marks: 1,
      difficulty: exercise.difficulty || 'Medium',
      tier: 'standard',
      conceptTested: exercise.grammarRuleCoverage?.[0] || 'Core Concept Application',
      curriculumObjective: exercise.learningObjective || 'Demonstrate subject competence.',
      cognitiveLevel: 'Understanding',
      explanation: '',
      grammarRationale: '',
      hints: '',
    };

    onUpdateExercise({
      ...exercise,
      questions: [...questions, newQ],
      questionCount: questions.length + 1,
    });
    setExpandedQuestionId(newQId);
  };

  // Run contextual AI Action on an individual question
  const handleRunQuestionAiAction = async (qIndex: number, actionName: string) => {
    const targetQ = questions[qIndex];
    if (!targetQ) return;
    setRunningAiActionForQId((prev) => ({ ...prev, [targetQ.id]: actionName }));
    setActiveActionMenuQId(null);

    try {
      const response = await fetch('/api/chapter-studio/question-ai-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          question: targetQ,
          exerciseContext: {
            title: exercise.title,
            letter: exercise.letter,
            instructions: exercise.instructions,
            developmentalTier: exercise.developmentalTier,
          },
          topic: chapter?.title || exercise.title,
          classLevel: chapter?.equivalentClass || 'Class 6',
          board: chapter?.curriculumBoard || 'CISCE',
          subject: chapter?.subject || 'Academic Curriculum',
        }),
      });

      if (!response.ok) {
        throw new Error(`Question AI action returned status ${response.status}`);
      }

      const data = await response.json();

      if (actionName === 'generate_similar') {
        if (data.question) {
          const newQ: GrammarQuestion = {
            ...targetQ,
            ...data.question,
            id: `q-${exercise.id}-${Date.now()}`,
          };
          const nextQuestions = [...questions];
          nextQuestions.splice(qIndex + 1, 0, newQ);
          onUpdateExercise({
            ...exercise,
            questions: nextQuestions,
            questionCount: nextQuestions.length,
          });
          setExpandedQuestionId(newQ.id);
        }
      } else if (actionName === 'generate_distractors') {
        if (data.options) {
          handleUpdateQuestion(qIndex, {
            ...targetQ,
            options: data.options,
            distractorExplanations: data.distractorExplanations,
          });
        }
      } else if (actionName === 'generate_answer' || actionName === 'generate_explanation') {
        handleUpdateQuestion(qIndex, {
          ...targetQ,
          correctAnswer: data.correctAnswer || targetQ.correctAnswer,
          modelAnswer: data.modelAnswer || targetQ.modelAnswer,
          explanation: data.explanation || targetQ.explanation,
          markingPoints: data.markingPoints || targetQ.markingPoints,
        });
      } else if (actionName === 'increase_difficulty' || actionName === 'decrease_difficulty') {
        if (data.question) {
          handleUpdateQuestion(qIndex, {
            ...targetQ,
            ...data.question,
          });
        }
      } else if (actionName === 'improve_question') {
        if (data.improvedPrompt) {
          handleUpdateQuestion(qIndex, {
            ...targetQ,
            prompt: data.improvedPrompt,
            instruction: data.improvedInstruction || targetQ.instruction,
          });
        }
      } else if (actionName === 'check_ambiguity') {
        setAiAmbiguityReport((prev) => ({
          ...prev,
          [targetQ.id]: {
            isAmbiguous: data.isAmbiguous,
            report: data.ambiguityReport,
            improvedPrompt: data.improvedPrompt,
            recommendations: data.editorialRecommendations,
          },
        }));
      }
    } catch (err: any) {
      console.error('Question AI action error:', err);
    } finally {
      setRunningAiActionForQId((prev) => {
        const next = { ...prev };
        delete next[targetQ.id];
        return next;
      });
    }
  };

  // Duplicate a question
  const handleDuplicateQuestion = (qIndex: number) => {
    const target = questions[qIndex];
    const duplicated: GrammarQuestion = {
      ...target,
      id: `q-${exercise.id}-${Date.now()}`,
      prompt: `${target.prompt} (Variant)`,
    };
    const newQuestions = [...questions];
    newQuestions.splice(qIndex + 1, 0, duplicated);
    onUpdateExercise({
      ...exercise,
      questions: newQuestions,
    });
  };

  // Delete question
  const handleDeleteQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      alert('An exercise must contain at least one question.');
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== qIndex);
    onUpdateExercise({
      ...exercise,
      questions: newQuestions,
    });
  };

  // Reorder questions
  const handleMoveQuestion = (qIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && qIndex === 0) ||
      (direction === 'down' && qIndex === questions.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? qIndex - 1 : qIndex + 1;
    const newQuestions = [...questions];
    const temp = newQuestions[qIndex];
    newQuestions[qIndex] = newQuestions[targetIndex];
    newQuestions[targetIndex] = temp;
    onUpdateExercise({
      ...exercise,
      questions: newQuestions,
    });
  };

  // Map exercise to canonical architecture component (COMP-13 through COMP-18)
  const canonicalComp = React.useMemo(() => {
    if (activeComponentId && CHAPTER_COMPONENT_REGISTRY[activeComponentId]) {
      return CHAPTER_COMPONENT_REGISTRY[activeComponentId];
    }
    const letter = (exercise.letter || 'A').toUpperCase();
    const map: Record<string, string> = {
      A: 'comp-13',
      B: 'comp-14',
      C: 'comp-15',
      D: 'comp-16',
      E: 'comp-17',
      F: 'comp-18',
      G: 'comp-18',
    };
    const cId = map[letter] || 'comp-13';
    return CHAPTER_COMPONENT_REGISTRY[cId];
  }, [activeComponentId, exercise.letter]);

  return (
    <div
      id="exercise-authoring-center"
      className="flex-1 bg-[#FAF7F2] overflow-y-auto flex flex-col h-full"
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP EXERCISE METADATA BAR                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#F6F0E7] border-b border-[#D8CBB9] p-4 sticky top-0 z-10 shadow-xs">
        {/* Canonical Architecture Component Banner */}
        {canonicalComp && (
          <div className="mb-3 px-3 py-2 bg-[#EDE4D6]/80 rounded-lg border border-[#C29A52]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8C2435] text-white">
                {canonicalComp.id.toUpperCase()}
              </span>
              <span className="font-serif font-bold text-[#35101F]">
                {canonicalComp.title}
              </span>
              <span className="text-[#7A6E5F] text-[11px] hidden md:inline">
                &bull; {canonicalComp.description}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C2435] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#C29A52]/40 shrink-0">
              Canonical Architecture
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded font-serif font-bold text-base bg-[#8C2435] text-[#FAF7F2] flex items-center justify-center shadow-xs">
              {exercise.letter}
            </span>
            <input
              type="text"
              value={exercise.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-lg font-serif font-bold text-[#292521] bg-transparent border-b border-transparent hover:border-[#D8CBB9] focus:border-[#8C2435] focus:bg-[#FFFDF9] px-1 py-0.5 rounded transition-all outline-none"
              placeholder="Exercise Title..."
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Developmental Tier Selector */}
            <div className="flex items-center gap-1 bg-[#EDE4D6] px-2 py-1 rounded border border-[#D5C7B4]">
              <span className="font-serif text-[#7A6E5F] text-[11px]">Tier:</span>
              <select
                value={exercise.developmentalTier || 'PRACTICE'}
                onChange={(e) =>
                  handleFieldChange('developmentalTier', e.target.value as ExerciseDevelopmentalTier)
                }
                className="bg-transparent font-serif font-bold text-[#8C2435] text-xs outline-none cursor-pointer"
              >
                <option value="FOUNDATION">FOUNDATION</option>
                <option value="PRACTICE">PRACTICE</option>
                <option value="APPLICATION">APPLICATION</option>
                <option value="CHALLENGE">CHALLENGE</option>
                <option value="MASTERY">MASTERY</option>
              </select>
            </div>

            {/* Workflow Status Selector */}
            <div className="flex items-center gap-1 bg-[#EDE4D6] px-2 py-1 rounded border border-[#D5C7B4]">
              <span className="font-serif text-[#7A6E5F] text-[11px]">Status:</span>
              <select
                value={exercise.status || 'Drafting'}
                onChange={(e) =>
                  handleFieldChange('status', e.target.value as ExerciseWorkflowStatus)
                }
                className="bg-transparent font-serif font-bold text-[#292521] text-xs outline-none cursor-pointer"
              >
                <option value="Planning">Planning</option>
                <option value="Drafting">Drafting</option>
                <option value="Author Review">Author Review</option>
                <option value="Academic Review">Academic Review</option>
                <option value="Answer Review">Answer Review</option>
                <option value="Layout Ready">Layout Ready</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            {/* Marks & Time */}
            <div className="flex items-center gap-1 bg-[#EDE4D6] px-2 py-1 rounded border border-[#D5C7B4]">
              <span className="font-serif text-[#7A6E5F] text-[11px]">Marks:</span>
              <input
                type="number"
                min="1"
                max="50"
                value={exercise.suggestedMarks || 5}
                onChange={(e) => handleFieldChange('suggestedMarks', parseInt(e.target.value) || 5)}
                className="w-10 text-center font-mono font-bold text-[#292521] bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Student Instructions Editor */}
        <div className="space-y-1">
          <label className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#615546] flex items-center justify-between">
            <span>Student Instructions (As Printed in Textbook)</span>
            <span className="text-[10px] font-normal text-[#7A6E5F]">
              {(exercise.instructions || '').length} characters
            </span>
          </label>
          <textarea
            rows={2}
            value={exercise.instructions || ''}
            onChange={(e) => handleFieldChange('instructions', e.target.value)}
            className="w-full text-sm font-serif text-[#292521] bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 focus:border-[#8C2435] focus:ring-1 focus:ring-[#8C2435]/20 outline-none resize-none leading-relaxed"
            placeholder="Write clear instructions for students..."
          />
        </div>

        {/* Linked Visual Stimulus Banner (if applicable) */}
        {exercise.visualId && (
          <div className="mt-2.5 p-2 bg-[#F3ECE0] rounded border border-[#D4AF37]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#8C2435]" />
              <span className="font-serif font-bold text-[#8C2435]">
                Stimulus Linked: {exercise.visualFigureNumber || 'Figure 1.1'} (Visual Studio)
              </span>
              <span className="text-[#615546] font-serif">
                {exercise.visualCaption || 'Grammar Visual Anchor'}
              </span>
            </div>
            {onOpenVisualStudio && (
              <button
                onClick={() => onOpenVisualStudio(exercise.visualId)}
                className="flex items-center gap-1 text-[11px] font-serif text-[#8C2435] hover:underline font-bold"
              >
                Open in Visual Studio
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Quick Add Question Toolbar */}
        <div className="mt-3 pt-3 border-t border-[#D8CBB9] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-serif font-bold text-[#7A6E5F] mr-1">Quick Add:</span>
            <button
              type="button"
              onClick={() => handleAddQuestion('mcq')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + MCQ
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('fill_in_blanks')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + Fill Blanks
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('true_false')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + True/False
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('short_answer')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + Short Answer
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('rewrite_sentence')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + Transformation
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('error_correction')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + Error Correction
            </button>
            <button
              type="button"
              onClick={() => handleAddQuestion('match_column')}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/50 rounded shadow-2xs transition-all cursor-pointer"
            >
              + Match Columns
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImportBankOpen(true)}
              className="px-2.5 py-1 text-xs font-serif font-bold text-[#35101F] bg-[#EDE4D6] hover:bg-[#E3D7C5] border border-[#CBBEAC] rounded flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Import canonical questions from Question Bank"
            >
              <Database className="w-3.5 h-3.5 text-[#8C2435]" />
              <span>Import from Bank</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCreateDialogType('mcq');
                setIsCreateDialogOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-serif font-bold text-white bg-[#8C2435] hover:bg-[#701D2A] rounded flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Dialog</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUESTION AUTHORING CARDS LIST                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="p-4 space-y-4 flex-1">
        <div className="flex items-center justify-between text-xs text-[#7A6E5F] font-serif pb-1 border-b border-[#E5DACB]">
          <span>
            {questions.length} Question{questions.length === 1 ? '' : 's'} in Exercise {exercise.letter}
          </span>
          <span>Click question to edit prompts, answers, and rubrics</span>
        </div>

        {questions.map((q, qIndex) => {
          const isExpanded = expandedQuestionId === q.id;
          const isSelected = selectedQuestionId === q.id;

          return (
            <div
              key={q.id}
              id={`question-card-${q.id}`}
              onClick={() => onSelectQuestionForIntelligence && onSelectQuestionForIntelligence(q.id)}
              className={`rounded-lg border transition-all ${
                isSelected
                  ? 'border-[#8C2435] ring-2 ring-[#8C2435]/20 bg-[#FFFDF9]'
                  : 'border-[#DDD0BC] bg-[#FDFBF7] hover:border-[#CBBDA8]'
              }`}
            >
              {/* Question Card Top Bar */}
              <div
                className="px-4 py-2.5 bg-[#F6F0E7] rounded-t-lg border-b border-[#E3D7C5] flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full font-serif font-bold text-xs bg-[#E3D7C5] text-[#4A3F33] flex items-center justify-center">
                    {qIndex + 1}
                  </span>

                  <span className="px-2 py-0.5 text-[11px] font-serif font-bold uppercase tracking-wider bg-[#EDE4D6] text-[#8C2435] rounded border border-[#D8CBB9]">
                    {q.type.replace('_', ' ')}
                  </span>

                  {q.sourceQuestionBankId && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Database className="w-2.5 h-2.5 text-emerald-700" />
                      <span>Bank Ref</span>
                    </span>
                  )}

                  <span className="text-xs font-serif font-semibold text-[#292521] line-clamp-1 max-w-md">
                    {q.prompt || 'Question Prompt'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-mono font-semibold text-[#615546] mr-2">
                    {q.marks || 1} Mark
                  </span>

                  {/* Move Up/Down */}
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 'up')}
                    disabled={qIndex === 0}
                    className="p-1 hover:text-[#292521] disabled:opacity-20 text-[#7A6E5F] cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(qIndex, 'down')}
                    disabled={qIndex === questions.length - 1}
                    className="p-1 hover:text-[#292521] disabled:opacity-20 text-[#7A6E5F] cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Contextual Question AI Actions Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={Boolean(runningAiActionForQId[q.id])}
                      onClick={() =>
                        setActiveActionMenuQId(activeActionMenuQId === q.id ? null : q.id)
                      }
                      className="px-2 py-1 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#C29A52]/60 rounded flex items-center gap-1 shadow-2xs cursor-pointer transition-all"
                      title="Contextual Question AI Suite"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${runningAiActionForQId[q.id] ? 'animate-spin text-amber-600' : ''}`} />
                      <span>{runningAiActionForQId[q.id] ? 'Working...' : 'AI Actions'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {activeActionMenuQId === q.id && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl shadow-xl z-30 py-1 text-xs font-serif text-[#292521] divide-y divide-[#EDE4D6]">
                        <div className="px-3 py-1.5 bg-[#EDE4D6]/60 text-[10px] uppercase font-bold tracking-wider text-[#71685E]">
                          Question AI Suite
                        </div>
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'generate_similar')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Generate Similar Variant</span>
                          </button>

                          {(q.type === 'mcq' || (q.options && q.options.length > 0)) && (
                            <button
                              type="button"
                              onClick={() => handleRunQuestionAiAction(qIndex, 'generate_distractors')}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                            >
                              <Layers className="w-3.5 h-3.5 text-[#8C2435]" />
                              <span>Generate / Tune Distractors</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'generate_answer')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Generate Model Answer & Rubric</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'generate_explanation')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Generate Pedagogical Explanation</span>
                          </button>
                        </div>

                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'increase_difficulty')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-amber-700" />
                            <span>Increase Difficulty (Bloom's Up)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'decrease_difficulty')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-sky-700" />
                            <span>Decrease Difficulty (Scaffold)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'improve_question')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Improve Question Stem & Clarity</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRunQuestionAiAction(qIndex, 'check_ambiguity')}
                            className="w-full text-left px-3 py-1.5 hover:bg-[#F3ECE0] flex items-center gap-2 text-[#35101F] cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Check Ambiguity & Alignment</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI More Like This */}
                  {onOpenAiGeneratorForQuestion && (
                    <button
                      onClick={() => onOpenAiGeneratorForQuestion(q)}
                      className="p-1 text-[#8C2435] hover:bg-[#EAE1D2] rounded cursor-pointer"
                      title="AI: Generate variant / more like this"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicateQuestion(qIndex)}
                    className="p-1 text-[#615546] hover:bg-[#EAE1D2] rounded cursor-pointer"
                    title="Duplicate Question"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setQuestionToDeleteIndex(qIndex)}
                    className="p-1 text-[#8C2435] hover:bg-[#ECC5CA] rounded cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editorial Ambiguity Report Banner if present */}
              {aiAmbiguityReport[q.id] && (
                <div className="mx-4 mt-2 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#C29A52]/60 text-xs text-[#292521] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#8C2435]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Editorial Ambiguity Audit Report
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAiAmbiguityReport((prev) => {
                          const next = { ...prev };
                          delete next[q.id];
                          return next;
                        });
                      }}
                      className="text-[10px] text-[#71685E] hover:text-[#292521] cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-[#615546]">{aiAmbiguityReport[q.id].report}</p>
                  {aiAmbiguityReport[q.id].improvedPrompt && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] italic text-[#35101F]">
                        Suggested: "{aiAmbiguityReport[q.id].improvedPrompt}"
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateQuestion(qIndex, {
                            ...q,
                            prompt: aiAmbiguityReport[q.id].improvedPrompt!,
                          });
                          setAiAmbiguityReport((prev) => {
                            const next = { ...prev };
                            delete next[q.id];
                            return next;
                          });
                        }}
                        className="px-2 py-0.5 rounded bg-[#8C2435] text-white text-[10px] font-bold cursor-pointer"
                      >
                        Apply Stem
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Question Body: Expanded View */}
              {isExpanded ? (
                <div className="p-4 space-y-4 text-sm font-serif">
                  {/* Type, Cognitive Level, Marks row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                        Question Type
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, {
                            ...q,
                            type: e.target.value as QuestionType,
                          })
                        }
                        className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-2.5 py-1.5 text-xs text-[#292521] outline-none focus:border-[#8C2435]"
                      >
                        {QUESTION_TYPES.map((qt) => (
                          <option key={qt.type} value={qt.type}>
                            {qt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                        Cognitive Level (Bloom)
                      </label>
                      <select
                        value={q.cognitiveLevel || 'Understanding'}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, {
                            ...q,
                            cognitiveLevel: e.target.value as CognitiveLevel,
                          })
                        }
                        className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-2.5 py-1.5 text-xs text-[#292521] outline-none focus:border-[#8C2435]"
                      >
                        <option value="Remembering">Remembering (Recall)</option>
                        <option value="Understanding">Understanding (Comprehension)</option>
                        <option value="Applying">Applying (Execution)</option>
                        <option value="Analysing">Analysing (Discrimination)</option>
                        <option value="Evaluating">Evaluating (Critique)</option>
                        <option value="Creating">Creating (Synthesis)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                        Marks Allocated
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={q.marks || 1}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, {
                            ...q,
                            marks: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-2.5 py-1.5 text-xs font-mono font-bold text-[#292521] outline-none focus:border-[#8C2435]"
                      />
                    </div>
                  </div>

                  {/* Prompt Editor & Clarity Audit */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546]">
                        Question Prompt / Stem
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAuditClarity(q)}
                          disabled={auditingQIds.has(q.id)}
                          className={`h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg border text-xs font-serif font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            auditingQIds.has(q.id)
                              ? 'bg-[#EDE4D6] text-[#71685E] border-[#DDD0BC] cursor-not-allowed opacity-75'
                              : 'bg-[#FFFDF9] border-[#C29A52]/60 text-[#8C2435] hover:bg-[#F6F0E7]'
                          }`}
                          title="Audit question clarity for ambiguity, distractor plausibility, and grade difficulty"
                        >
                          {auditingQIds.has(q.id) ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-[#8C2435] animate-spin" />
                              <span>Auditing clarity&hellip;</span>
                            </>
                          ) : (
                            <>
                              <ScanSearch className="w-3.5 h-3.5 text-[#8C2435]" />
                              <span>Audit Clarity</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAuditAccuracy(q)}
                          disabled={auditingAccuracyQIds.has(q.id)}
                          className={`h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg border text-xs font-serif font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                            auditingAccuracyQIds.has(q.id)
                              ? 'bg-[#EDE4D6] text-[#71685E] border-[#DDD0BC] cursor-not-allowed opacity-75'
                              : 'bg-[#FFFDF9] border-[#C29A52]/60 text-[#8C2435] hover:bg-[#F6F0E7]'
                          }`}
                          title="Audit question factual accuracy, answer key correctness, and internal consistency"
                        >
                          {auditingAccuracyQIds.has(q.id) ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 text-[#8C2435] animate-spin" />
                              <span>Checking accuracy&hellip;</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#8C2435]" />
                              <span>Audit Accuracy &amp; Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={q.prompt || ''}
                      onChange={(e) =>
                        handleUpdateQuestion(qIndex, {
                          ...q,
                          prompt: e.target.value,
                        })
                      }
                      className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2.5 text-sm text-[#292521] outline-none focus:border-[#8C2435] resize-none"
                      placeholder="Enter question text..."
                    />

                    {/* Loading indicator during audit */}
                    {auditingQIds.has(q.id) && (
                      <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC] flex items-center justify-between text-xs font-serif text-[#5A1832] animate-pulse">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 animate-spin text-[#8C2435]" />
                          <span className="font-semibold">Auditing clarity&hellip;</span>
                        </div>
                        <span className="text-[11px] text-[#71685E] italic">
                          Analysing stem, distractors, and psychometric rigor
                        </span>
                      </div>
                    )}

                    {/* Error Banner */}
                    {clarityAuditErrors[q.id] && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs font-serif text-red-900">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                          <span>{clarityAuditErrors[q.id]}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAuditClarity(q)}
                          className="h-10 min-h-[40px] max-h-[44px] px-3 rounded-lg text-xs font-serif font-bold text-rose-800 bg-white border border-rose-300 hover:bg-rose-100 cursor-pointer"
                        >
                          Retry Audit
                        </button>
                      </div>
                    )}

                    {/* Applied Success Toast */}
                    {appliedQIds.has(q.id) && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-xs font-serif text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Suggested revision applied to question stem.</span>
                      </div>
                    )}

                    {/* Audit Results Panel */}
                    {clarityAuditResults[q.id] && (
                      <div className="p-3.5 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC] space-y-3 font-serif text-xs">
                        {/* Status Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {clarityAuditResults[q.id].status === 'CLEAR' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <CircleCheckBig className="w-3.5 h-3.5 text-emerald-600" />
                                CLEAR
                              </span>
                            )}
                            {clarityAuditResults[q.id].status === 'MINOR_REVIEW' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                MINOR REVIEW
                              </span>
                            )}
                            {clarityAuditResults[q.id].status === 'NEEDS_REVISION' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-rose-950 border border-red-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                                NEEDS REVISION
                              </span>
                            )}
                            <span className="text-[11px] text-[#71685E]">
                              {clarityAuditResults[q.id].issues.length}{' '}
                              {clarityAuditResults[q.id].issues.length === 1 ? 'issue' : 'issues'} flagged
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDismissAudit(q.id)}
                            className="text-[11px] text-[#71685E] hover:text-[#292521] underline cursor-pointer"
                          >
                            Dismiss Findings
                          </button>
                        </div>

                        {/* Detected Issues */}
                        {clarityAuditResults[q.id].issues.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#615546] block">
                              Detected Issues:
                            </span>
                            <div className="space-y-1">
                              {clarityAuditResults[q.id].issues.map((iss, iIdx) => (
                                <div
                                  key={iIdx}
                                  className="p-2 rounded-lg bg-[#FFFDF9] border border-[#DDD0BC] space-y-1 text-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#8C2435]">{iss.type}</span>
                                    <span
                                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                        iss.severity === 'high'
                                          ? 'bg-rose-100 text-rose-800'
                                          : iss.severity === 'medium'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-sky-100 text-sky-800'
                                      }`}
                                    >
                                      {iss.severity} severity
                                    </span>
                                  </div>
                                  {iss.excerpt && (
                                    <div className="text-[11px] text-[#5A1832] italic bg-[#F6F0E7] px-2 py-0.5 rounded">
                                      &ldquo;{iss.excerpt}&rdquo;
                                    </div>
                                  )}
                                  <p className="text-[#4A4237] leading-relaxed">{iss.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggested Revision Display */}
                        {clarityAuditResults[q.id].suggestedRevision && (
                          <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#C29A52]/60 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C2435] flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#C29A52]" />
                                Suggested Revised Question
                              </span>
                              <span className="text-[10px] text-[#71685E] italic">
                                Author action required
                              </span>
                            </div>
                            <p className="text-xs text-[#292521] leading-relaxed">
                              {clarityAuditResults[q.id].suggestedRevision}
                            </p>
                          </div>
                        )}

                        {/* Pedagogical Note */}
                        {clarityAuditResults[q.id].pedagogicalNote && (
                          <div className="p-2.5 rounded-lg bg-[#EFE9DF] text-[11px] text-[#4A4237] flex items-start gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-[#8C2435] shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              {clarityAuditResults[q.id].pedagogicalNote}
                            </p>
                          </div>
                        )}

                        {/* Review Action Buttons (strictly 40-44px high) */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DDD0BC]">
                          <button
                            type="button"
                            onClick={() => handleDismissAudit(q.id)}
                            className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold text-[#71685E] hover:text-[#292521] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition-all cursor-pointer"
                          >
                            Dismiss
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAuditClarity(q)}
                              disabled={auditingQIds.has(q.id)}
                              className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold text-[#5A1832] bg-[#FFFDF9] hover:bg-[#EDE4D6] border border-[#C29A52]/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw
                                className={`w-3.5 h-3.5 ${
                                  auditingQIds.has(q.id) ? 'animate-spin' : ''
                                }`}
                              />
                              <span>Regenerate Suggestion</span>
                            </button>

                            {clarityAuditResults[q.id].suggestedRevision && (
                              <button
                                type="button"
                                onClick={() => handleApplySuggestion(qIndex, q)}
                                className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-lg text-xs font-serif font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-200" />
                                <span>Apply Suggestion</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading indicator during accuracy audit */}
                    {auditingAccuracyQIds.has(q.id) && (
                      <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC] flex items-center justify-between text-xs font-serif text-[#5A1832] animate-pulse">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 animate-spin text-[#8C2435]" />
                          <span className="font-semibold">Checking factual accuracy &amp; answer key&hellip;</span>
                        </div>
                        <span className="text-[11px] text-[#71685E] italic">
                          Validating claims, keys, and internal consistency
                        </span>
                      </div>
                    )}

                    {/* Accuracy Error Banner */}
                    {accuracyAuditErrors[q.id] && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs font-serif text-red-900">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                          <span>{accuracyAuditErrors[q.id]}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAuditAccuracy(q)}
                          className="h-10 min-h-[40px] max-h-[44px] px-3 rounded-lg text-xs font-serif font-bold text-rose-800 bg-white border border-rose-300 hover:bg-rose-100 cursor-pointer"
                        >
                          Retry Audit
                        </button>
                      </div>
                    )}

                    {/* Accuracy Applied Success Toast */}
                    {appliedAccuracyNotices[q.id] && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-2 text-xs font-serif text-emerald-900">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{appliedAccuracyNotices[q.id]}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                          Author Approved
                        </span>
                      </div>
                    )}

                    {/* Accuracy Audit Results Panel */}
                    {accuracyAuditResults[q.id] && (
                      <div className="p-3.5 rounded-xl bg-[#F6F0E7] border border-[#C29A52]/50 space-y-3 font-serif text-xs">
                        {/* Status Header */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {accuracyAuditResults[q.id].status === 'VERIFIED' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Answer Verified
                              </span>
                            )}
                            {accuracyAuditResults[q.id].status === 'REVIEW_RECOMMENDED' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                Review Recommended
                              </span>
                            )}
                            {accuracyAuditResults[q.id].status === 'ERROR_FOUND' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-rose-950 border border-red-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                                Accuracy Issue Detected
                              </span>
                            )}
                            {accuracyAuditResults[q.id].status === 'INSUFFICIENT_CONTEXT' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-200 text-stone-800 border border-stone-300">
                                <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                                Context Insufficient to Verify
                              </span>
                            )}

                            {accuracyAuditResults[q.id].answerStatus && (
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                  accuracyAuditResults[q.id].answerStatus === 'CORRECT'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : accuracyAuditResults[q.id].answerStatus === 'INCORRECT'
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                Key: {accuracyAuditResults[q.id].answerStatus}
                              </span>
                            )}

                            <span className="text-[10px] uppercase font-bold text-[#71685E] px-1.5 py-0.5 rounded bg-[#EDE4D6]">
                              {accuracyAuditResults[q.id].confidence} confidence
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDismissAccuracyAudit(q.id)}
                            className="text-[11px] text-[#71685E] hover:text-[#292521] underline cursor-pointer"
                          >
                            Dismiss Findings
                          </button>
                        </div>

                        {/* Findings List */}
                        {accuracyAuditResults[q.id].findings &&
                          accuracyAuditResults[q.id].findings.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#615546] block">
                                Accuracy Findings ({accuracyAuditResults[q.id].findings.length}):
                              </span>
                              <div className="space-y-1.5">
                                {accuracyAuditResults[q.id].findings.map((finding, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="p-2 rounded-lg bg-[#FFFDF9] border border-[#DDD0BC] space-y-1 text-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-[#8C2435]">
                                        {finding.type.replace(/_/g, ' ')}
                                      </span>
                                      <span
                                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                          finding.severity === 'high'
                                            ? 'bg-rose-100 text-rose-800'
                                            : finding.severity === 'medium'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-sky-100 text-sky-800'
                                        }`}
                                      >
                                        {finding.severity} severity
                                      </span>
                                    </div>
                                    {finding.excerpt && (
                                      <div className="text-[11px] text-[#5A1832] italic bg-[#F6F0E7] px-2 py-0.5 rounded">
                                        &ldquo;{finding.excerpt}&rdquo;
                                      </div>
                                    )}
                                    <p className="text-[#4A4237] leading-relaxed">{finding.explanation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Current vs Suggested Comparison View */}
                        {(accuracyAuditResults[q.id].suggestedAnswer ||
                          accuracyAuditResults[q.id].suggestedQuestionRevision) && (
                          <div className="p-3 rounded-lg bg-[#FFFDF9] border border-[#C29A52]/70 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C2435] flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#C29A52]" />
                                Proposed Corrections &amp; Verified Key
                              </span>
                              <span className="text-[10px] text-[#71685E] italic">
                                Author review required
                              </span>
                            </div>

                            {/* Answer Key Comparison */}
                            {accuracyAuditResults[q.id].suggestedAnswer && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-rose-50/70 border border-rose-200">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-0.5">
                                    Current Answer Key
                                  </span>
                                  <p className="text-[#292521] font-mono font-medium">
                                    {q.correctAnswer || q.modelAnswer || '(None designated)'}
                                  </p>
                                </div>
                                <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                                    Suggested / Verified Key
                                  </span>
                                  <p className="text-emerald-950 font-mono font-semibold">
                                    {accuracyAuditResults[q.id].suggestedAnswer}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Question Stem Comparison */}
                            {accuracyAuditResults[q.id].suggestedQuestionRevision && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-[#F6F0E7] border border-[#DDD0BC]">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#615546] block mb-0.5">
                                    Current Question Stem
                                  </span>
                                  <p className="text-[#292521] leading-relaxed">
                                    {q.prompt || q.originalSentence || '(Empty)'}
                                  </p>
                                </div>
                                <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
                                    Suggested Revised Stem
                                  </span>
                                  <p className="text-[#292521] leading-relaxed font-medium">
                                    {accuracyAuditResults[q.id].suggestedQuestionRevision}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Rationale */}
                        {(accuracyAuditResults[q.id].rationale ||
                          accuracyAuditResults[q.id].editorialNote ||
                          accuracyAuditResults[q.id].explanation) && (
                          <div className="p-2.5 rounded-lg bg-[#EFE9DF] text-[11px] text-[#4A4237] flex items-start gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-[#8C2435] shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              {accuracyAuditResults[q.id].rationale ||
                                accuracyAuditResults[q.id].editorialNote ||
                                accuracyAuditResults[q.id].explanation}
                            </p>
                          </div>
                        )}

                        {/* Review Action Buttons (strictly 40-44px high) */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#DDD0BC]">
                          <button
                            type="button"
                            onClick={() => handleDismissAccuracyAudit(q.id)}
                            className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold text-[#71685E] hover:text-[#292521] hover:bg-[#EAE0D0] border border-[#DDD0BC] transition-all cursor-pointer"
                          >
                            Dismiss
                          </button>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAuditAccuracy(q)}
                              disabled={auditingAccuracyQIds.has(q.id)}
                              className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold text-[#5A1832] bg-[#FFFDF9] hover:bg-[#EDE4D6] border border-[#C29A52]/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw
                                className={`w-3.5 h-3.5 ${
                                  auditingAccuracyQIds.has(q.id) ? 'animate-spin' : ''
                                }`}
                              />
                              <span>Re-audit</span>
                            </button>

                            {accuracyAuditResults[q.id].suggestedQuestionRevision && (
                              <button
                                type="button"
                                onClick={() => handleApplyAccuracyCorrection(qIndex, q, 'prompt')}
                                className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold bg-[#FFFDF9] hover:bg-emerald-50 text-emerald-900 border border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Apply only the question stem revision"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Apply Stem Revision</span>
                              </button>
                            )}

                            {accuracyAuditResults[q.id].suggestedAnswer && (
                              <button
                                type="button"
                                onClick={() => handleApplyAccuracyCorrection(qIndex, q, 'answer')}
                                className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-lg text-xs font-serif font-semibold bg-[#FFFDF9] hover:bg-emerald-50 text-emerald-900 border border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Apply only the verified answer key"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Apply Answer Key</span>
                              </button>
                            )}

                            {accuracyAuditResults[q.id].suggestedQuestionRevision &&
                              accuracyAuditResults[q.id].suggestedAnswer && (
                                <button
                                  type="button"
                                  onClick={() => handleApplyAccuracyCorrection(qIndex, q, 'both')}
                                  className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-lg text-xs font-serif font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                                  title="Apply both question revision and answer key correction"
                                >
                                  <BadgeCheck className="w-4 h-4 text-emerald-200" />
                                  <span>Apply Both</span>
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Context sentence if applicable (for underline, blanks, rewrite) */}
                  {(q.type === 'identify_underline' ||
                    q.type === 'fill_in_blanks' ||
                    q.type === 'rewrite_sentence' ||
                    q.type === 'error_correction') && (
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                        Target Sentence Context
                      </label>
                      <input
                        type="text"
                        value={q.blanksSentence || q.originalSentence || ''}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, {
                            ...q,
                            blanksSentence: e.target.value,
                            originalSentence: e.target.value,
                          })
                        }
                        className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-3 py-1.5 text-sm text-[#292521] outline-none focus:border-[#8C2435]"
                        placeholder="e.g., The friendly teacher smiled at the little children."
                      />
                    </div>
                  )}

                  {/* Options editor for MCQ / Classification */}
                  {(q.type === 'mcq' || q.type === 'classification' || q.type === 'circle_select') && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block">
                        Answer Options (Click one to set as primary correct)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(q.options || ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4']).map(
                          (opt, oIdx) => {
                            const isCorrect = q.correctAnswer === opt;
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-center gap-2 p-1.5 rounded border ${
                                  isCorrect
                                    ? 'bg-[#EAF2DC] border-[#B2CE87]'
                                    : 'bg-[#FFFDF9] border-[#DDD0BC]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateQuestion(qIndex, {
                                      ...q,
                                      correctAnswer: opt,
                                    })
                                  }
                                  className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'border-[#7A6E5F] text-transparent'
                                  }`}
                                  title="Set as Correct Answer"
                                >
                                  ✓
                                </button>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...(q.options || [])];
                                    newOpts[oIdx] = e.target.value;
                                    handleUpdateQuestion(qIndex, {
                                      ...q,
                                      options: newOpts,
                                      correctAnswer: isCorrect ? e.target.value : q.correctAnswer,
                                    });
                                  }}
                                  className="flex-1 bg-transparent text-xs text-[#292521] outline-none"
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* ------------------------------------------------------------- */}
                  {/* ANSWER INTELLIGENCE & ACCEPTABLE ALTERNATIVES (Section 9)     */}
                  {/* ------------------------------------------------------------- */}
                  <div className="p-3 bg-[#F4EFE6] rounded border border-[#D8CBB9] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-[#8C2435] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Answer Intelligence & Model Rubric
                      </span>
                      <span className="text-[11px] font-serif text-[#7A6E5F]">
                        No exact-string matching only
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                          Primary Correct / Model Answer
                        </label>
                        <input
                          type="text"
                          value={q.correctAnswer || q.modelAnswer || ''}
                          onChange={(e) =>
                            handleUpdateQuestion(qIndex, {
                              ...q,
                              correctAnswer: e.target.value,
                              modelAnswer: e.target.value,
                            })
                          }
                          className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-3 py-1.5 text-xs text-[#292521] font-semibold outline-none focus:border-[#8C2435]"
                          placeholder="Primary model answer..."
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                          Acceptable Alternatives (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={(q.acceptableAlternatives || []).join(', ')}
                          onChange={(e) => {
                            const alts = e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            handleUpdateQuestion(qIndex, {
                              ...q,
                              acceptableAlternatives: alts,
                            });
                          }}
                          className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded px-3 py-1.5 text-xs text-[#292521] outline-none focus:border-[#8C2435]"
                          placeholder="e.g., teacher and children, children, teacher"
                        />
                      </div>
                    </div>

                    {/* Grammar Rationale & Pedagogical Feedback */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                          Grammar Rationale (Teacher Edition)
                        </label>
                        <textarea
                          rows={2}
                          value={q.grammarRationale || ''}
                          onChange={(e) =>
                            handleUpdateQuestion(qIndex, {
                              ...q,
                              grammarRationale: e.target.value,
                            })
                          }
                          className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none focus:border-[#8C2435]"
                          placeholder="Explain grammatical logic behind the answer..."
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#615546] block mb-1">
                          Student Explanatory Feedback
                        </label>
                        <textarea
                          rows={2}
                          value={q.explanation || q.studentFeedback || ''}
                          onChange={(e) =>
                            handleUpdateQuestion(qIndex, {
                              ...q,
                              explanation: e.target.value,
                              studentFeedback: e.target.value,
                            })
                          }
                          className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded p-2 text-xs text-[#292521] outline-none resize-none focus:border-[#8C2435]"
                          placeholder="Feedback shown to students after answering..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* EDITORIAL PIPELINE & ACTIONS (Bank, Assessment, Move)        */}
                  {/* ------------------------------------------------------------- */}
                  <div className="pt-2 border-t border-[#E3D7C5] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Move Question Between Exercises */}
                      {availableExercises && availableExercises.length > 1 && onMoveQuestionToExercise && (
                        <div className="flex items-center gap-1 bg-[#F4EFE6] border border-[#D8CBB9] rounded px-2 py-1">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-[#8C2435]" />
                          <span className="text-[10px] font-bold text-[#615546] uppercase tracking-wider">Move to:</span>
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                onMoveQuestionToExercise(q.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs bg-[#FFFDF9] border border-[#DDD0BC] rounded px-1.5 py-0.5 text-[#292521] outline-none cursor-pointer font-serif"
                            title="Move this question to another exercise set"
                          >
                            <option value="" disabled>Select Exercise...</option>
                            {availableExercises
                              .filter((ex) => ex.id !== exercise.id)
                              .map((ex) => (
                                <option key={ex.id} value={ex.id}>
                                  Exercise {ex.letter}: {ex.title}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {/* Audit Clarity in Footer */}
                      <button
                        type="button"
                        onClick={() => handleAuditClarity(q)}
                        disabled={auditingQIds.has(q.id)}
                        className={`h-10 min-h-[40px] max-h-[44px] inline-flex items-center gap-1.5 px-3 rounded text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          auditingQIds.has(q.id)
                            ? 'bg-[#EDE4D6] text-[#71685E] border-[#DDD0BC] cursor-not-allowed opacity-75'
                            : 'bg-[#FFFDF9] border-[#C29A52]/60 text-[#8C2435] hover:bg-[#F6F0E7]'
                        }`}
                        title="Audit question clarity for pedagogical precision"
                      >
                        {auditingQIds.has(q.id) ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 text-[#8C2435] animate-spin" />
                            <span>Auditing clarity&hellip;</span>
                          </>
                        ) : (
                          <>
                            <ScanSearch className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Audit Clarity</span>
                          </>
                        )}
                      </button>

                      {/* Audit Accuracy & Key in Footer */}
                      <button
                        type="button"
                        onClick={() => handleAuditAccuracy(q)}
                        disabled={auditingAccuracyQIds.has(q.id)}
                        className={`h-10 min-h-[40px] max-h-[44px] inline-flex items-center gap-1.5 px-3 rounded text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          auditingAccuracyQIds.has(q.id)
                            ? 'bg-[#EDE4D6] text-[#71685E] border-[#DDD0BC] cursor-not-allowed opacity-75'
                            : 'bg-[#FFFDF9] border-[#C29A52]/60 text-[#8C2435] hover:bg-[#F6F0E7]'
                        }`}
                        title="Audit factual accuracy, designated answer key, and consistency"
                      >
                        {auditingAccuracyQIds.has(q.id) ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 text-[#8C2435] animate-spin" />
                            <span>Checking accuracy&hellip;</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Audit Accuracy</span>
                          </>
                        )}
                      </button>

                      {/* Save to Question Bank */}
                      <button
                        type="button"
                        onClick={() => handleSaveQuestionToBank(q)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          savedToBankIds.has(q.id)
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-[#FFFDF9] border-[#DDD0BC] text-[#615546] hover:text-[#292521] hover:bg-[#F6F0E7]'
                        }`}
                        title="Send this question to the Central Question Bank"
                      >
                        {savedToBankIds.has(q.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Question Bank</span>
                          </>
                        ) : (
                          <>
                            <Database className="w-3.5 h-3.5 text-[#8C2435]" />
                            <span>Question Bank</span>
                          </>
                        )}
                      </button>

                      {/* Send to Interactive Quiz */}
                      <button
                        type="button"
                        onClick={() => handleSendToInteractiveQuiz(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          sentToQuizIds.has(q.id)
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : 'bg-[#FFFDF9] border-[#DDD0BC] text-[#615546] hover:text-[#292521] hover:bg-[#F6F0E7]'
                        }`}
                        title="Send question to Interactive Digital Quiz player"
                      >
                        {sentToQuizIds.has(q.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                            <span>In Digital Quiz</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-blue-700" />
                            <span>Interactive Quiz</span>
                          </>
                        )}
                      </button>

                      {/* Send to Assessment Builder */}
                      <button
                        type="button"
                        onClick={() => handleSendToAssessmentBuilder(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-serif font-semibold border transition-all cursor-pointer ${
                          sentToAssessmentIds.has(q.id)
                            ? 'bg-purple-50 border-purple-300 text-purple-800'
                            : 'bg-[#FFFDF9] border-[#DDD0BC] text-[#615546] hover:text-[#292521] hover:bg-[#F6F0E7]'
                        }`}
                        title="Add to Chapter Assessment Test"
                      >
                        {sentToAssessmentIds.has(q.id) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-purple-600" />
                            <span>In Assessment</span>
                          </>
                        ) : (
                          <>
                            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700" />
                            <span>Assessment Test</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#7A6E5F] italic font-serif">
                      QID: {q.id} &bull; {q.marks || 1} mark
                    </div>
                  </div>
                </div>
              ) : (
                /* Compact summary row when collapsed */
                <div
                  className="px-4 py-2 text-xs text-[#615546] flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedQuestionId(q.id)}
                >
                  <span className="line-clamp-1 italic">
                    Answer: {q.correctAnswer || q.modelAnswer || 'No answer set'}
                  </span>
                  <span className="text-[11px] text-[#8C2435] font-semibold hover:underline">
                    Click to expand & edit
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Question Button Bar */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#D8CBB9]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddQuestion('identify_underline')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D4AF37]/60 rounded shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>

            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddQuestion(e.target.value as QuestionType);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-2 py-2 text-xs font-serif bg-[#EDE4D6] border border-[#D5C7B4] rounded text-[#4A3F33] outline-none cursor-pointer"
            >
              <option value="" disabled>
                + Add by Specific Type...
              </option>
              {QUESTION_TYPES.map((qt) => (
                <option key={qt.type} value={qt.type}>
                  + {qt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-serif text-[#7A6E5F]">
            {questions.length} questions in Exercise {exercise.letter}
          </div>
        </div>
      </div>

      {/* Delete Question Confirmation Modal */}
      {questionToDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl p-5 shadow-2xl border border-[#CBBEAC] space-y-3 bg-[#FFFDF8] text-[#292521]">
            <div className="flex items-center space-x-2 text-[#8C2435]">
              <AlertTriangle className="w-5 h-5 text-[#8C2435]" />
              <h4 className="font-bold text-sm font-serif">Remove Question {questionToDeleteIndex + 1}?</h4>
            </div>
            <p className="text-xs text-[#71685E] font-serif leading-relaxed">
              Are you sure you want to delete this question? Its answer rubric, model solutions, and curriculum alignment data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDeleteIndex(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-serif border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 text-[#292521] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = questionToDeleteIndex;
                  setQuestionToDeleteIndex(null);
                  if (questions.length <= 1) {
                    return;
                  }
                  const newQuestions = questions.filter((_, i) => i !== idx);
                  onUpdateExercise({
                    ...exercise,
                    questions: newQuestions,
                    questionCount: newQuestions.length,
                    suggestedMarks: newQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
                  });
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold bg-[#8C2435] text-white hover:bg-[#6D1B28] cursor-pointer"
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject-Neutral Create Question Dialog */}
      <CreateQuestionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        preselectedType={createDialogType}
        topics={
          chapter
            ? [
                {
                  id: chapter.id,
                  title: chapter.title,
                  classLevel: (chapter.equivalentClass as any) || 'Class 6',
                  chapterNumber: chapter.chapterNumber || 1,
                  category: chapter.category || 'General',
                  exercises: [],
                },
              ]
            : []
        }
        selectedClass={(chapter?.equivalentClass as any) || 'Class 6'}
        targetBoard={chapter?.curriculumBoard || 'CISCE'}
        onCreateQuestion={(newQ) => {
          onUpdateExercise({
            ...exercise,
            questions: [...questions, newQ],
            questionCount: questions.length + 1,
            suggestedMarks: [...questions, newQ].reduce((acc, q) => acc + (q.marks || 1), 0),
          });
          setExpandedQuestionId(newQ.id);
        }}
      />

      {/* Import Canonical Questions from Question Bank */}
      <ImportFromQuestionBankModal
        isOpen={isImportBankOpen}
        onClose={() => setIsImportBankOpen(false)}
        seriesProject={seriesProject}
        exerciseTitle={`Exercise ${exercise.letter}: ${exercise.title}`}
        onImportQuestions={(imported) => {
          const nextQuestions = [...questions, ...imported];
          onUpdateExercise({
            ...exercise,
            questions: nextQuestions,
            questionCount: nextQuestions.length,
            suggestedMarks: nextQuestions.reduce((acc, q) => acc + (q.marks || 1), 0),
          });
          if (imported[0]) {
            setExpandedQuestionId(imported[0].id);
          }
        }}
      />
    </div>
  );
};
