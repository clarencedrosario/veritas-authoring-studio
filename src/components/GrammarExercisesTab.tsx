import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  Check,
  X,
  ListOrdered,
  GraduationCap,
  FileDown,
  Wand2,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import {
  GrammarTopic,
  GrammarExercise,
  GrammarQuestion,
  QuestionType,
  DevelopmentalTier,
} from '../types';
import {
  TIER_METADATA,
  inferQuestionTier,
  groupTopicQuestionsByTier,
  generateScaffoldedQuestionsForTier,
} from '../utils/differentiatedTiering';
import { DifferentiatedWorksheetStudioModal } from './differentiated/DifferentiatedWorksheetStudioModal';

interface GrammarExercisesTabProps {
  topic: GrammarTopic;
  onUpdateTopic: (updated: GrammarTopic) => void;
  isDarkMode: boolean;
  onOpenAiGenerator: () => void;
}

export const GrammarExercisesTab: React.FC<GrammarExercisesTabProps> = ({
  topic,
  onUpdateTopic,
  isDarkMode,
  onOpenAiGenerator,
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(
    topic.exercises[0]?.id || ''
  );
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [showWorksheetStudio, setShowWorksheetStudio] = useState(false);

  // New Exercise Form
  const [newExTitle, setNewExTitle] = useState('');
  const [newExInstructions, setNewExInstructions] = useState('');

  // New Question Form with Developmental Tiering
  const [qType, setQType] = useState<QuestionType>('mcq');
  const [qPrompt, setQPrompt] = useState('');
  const [qInstruction, setQInstruction] = useState('');
  const [qTier, setQTier] = useState<DevelopmentalTier>('standard');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qMarks, setQMarks] = useState(1);
  const [qScaffoldingNotes, setQScaffoldingNotes] = useState('');
  const [qExplanation, setQExplanation] = useState('');

  // MCQ specific
  const [mcqOptionA, setMcqOptionA] = useState('');
  const [mcqOptionB, setMcqOptionB] = useState('');
  const [mcqOptionC, setMcqOptionC] = useState('');
  const [mcqOptionD, setMcqOptionD] = useState('');
  const [mcqCorrect, setMcqCorrect] = useState('A');

  // Fill in blanks specific
  const [blanksSentence, setBlanksSentence] = useState('');
  const [acceptableAnswer, setAcceptableAnswer] = useState('');
  const [hints, setHints] = useState('');

  // Match column specific
  const [colA1, setColA1] = useState('');
  const [colB1, setColB1] = useState('');
  const [colA2, setColA2] = useState('');
  const [colB2, setColB2] = useState('');
  const [colA3, setColA3] = useState('');
  const [colB3, setColB3] = useState('');

  // Error correction & transformation
  const [originalSentence, setOriginalSentence] = useState('');
  const [correctedSentence, setCorrectedSentence] = useState('');

  const currentExercise =
    topic.exercises.find((e) => e.id === selectedExId) || topic.exercises[0];

  const handleCreateExercise = () => {
    if (!newExTitle.trim()) {
      alert('Please enter an exercise title.');
      return;
    }
    const newEx: GrammarExercise = {
      id: `ex-${Date.now()}`,
      title: newExTitle.trim(),
      instructions: newExInstructions.trim() || 'Complete the questions as directed.',
      targetType: 'mixed',
      questions: [],
      maxMarks: 0,
    };
    const updated = {
      ...topic,
      exercises: [...topic.exercises, newEx],
    };
    onUpdateTopic(updated);
    setSelectedExId(newEx.id);
    setIsAddingExercise(false);
    setNewExTitle('');
    setNewExInstructions('');
  };

  const handleAddQuestion = () => {
    if (!currentExercise) return;
    if (!qPrompt.trim() && qType !== 'fill_in_blanks') {
      alert('Please enter a question prompt.');
      return;
    }

    let question: GrammarQuestion;

    if (qType === 'mcq') {
      const opts = [
        `A) ${mcqOptionA.trim()}`,
        `B) ${mcqOptionB.trim()}`,
        `C) ${mcqOptionC.trim()}`,
        `D) ${mcqOptionD.trim()}`,
      ];
      const correctIdx = mcqCorrect === 'A' ? 0 : mcqCorrect === 'B' ? 1 : mcqCorrect === 'C' ? 2 : 3;
      question = {
        id: `q-${Date.now()}`,
        type: 'mcq',
        prompt: qPrompt.trim(),
        instruction: qInstruction.trim() || undefined,
        difficulty: qDifficulty,
        tier: qTier,
        marks: qMarks,
        options: opts,
        correctAnswer: opts[correctIdx],
        scaffoldingNotes: qScaffoldingNotes.trim() || undefined,
        explanation: qExplanation.trim(),
      };
    } else if (qType === 'fill_in_blanks') {
      question = {
        id: `q-${Date.now()}`,
        type: 'fill_in_blanks',
        prompt: qPrompt.trim() || 'Fill in the blank with suitable word:',
        blanksSentence: blanksSentence.trim(),
        hints: hints.trim() || undefined,
        acceptableAnswers: [acceptableAnswer.trim()],
        correctAnswer: acceptableAnswer.trim(),
        difficulty: qDifficulty,
        tier: qTier,
        marks: qMarks,
        scaffoldingNotes: qScaffoldingNotes.trim() || undefined,
        explanation: qExplanation.trim(),
      };
    } else if (qType === 'match_column') {
      const colA = [
        { id: 'a1', text: `1. ${colA1.trim()}` },
        { id: 'a2', text: `2. ${colA2.trim()}` },
        ...(colA3.trim() ? [{ id: 'a3', text: `3. ${colA3.trim()}` }] : []),
      ];
      const colB = [
        { id: 'b1', text: `A. ${colB1.trim()}` },
        { id: 'b2', text: `B. ${colB2.trim()}` },
        ...(colB3.trim() ? [{ id: 'b3', text: `C. ${colB3.trim()}` }] : []),
      ];
      question = {
        id: `q-${Date.now()}`,
        type: 'match_column',
        prompt: qPrompt.trim() || 'Match Column A with Column B:',
        columnA: colA,
        columnB: colB,
        matchPairs: [
          { aId: 'a1', bId: 'b1' },
          { aId: 'a2', bId: 'b2' },
          ...(colA3.trim() ? [{ aId: 'a3', bId: 'b3' }] : []),
        ],
        correctAnswer: '1-A, 2-B' + (colA3.trim() ? ', 3-C' : ''),
        difficulty: qDifficulty,
        tier: qTier,
        marks: colA.length,
        scaffoldingNotes: qScaffoldingNotes.trim() || undefined,
        explanation: qExplanation.trim(),
      };
    } else if (qType === 'error_correction') {
      question = {
        id: `q-${Date.now()}`,
        type: 'error_correction',
        prompt: qPrompt.trim() || 'Identify and correct the grammatical error:',
        originalSentence: originalSentence.trim(),
        correctedSentence: correctedSentence.trim(),
        correctAnswer: correctedSentence.trim(),
        difficulty: qDifficulty,
        tier: qTier,
        marks: qMarks,
        scaffoldingNotes: qScaffoldingNotes.trim() || undefined,
        explanation: qExplanation.trim(),
      };
    } else {
      // transformation
      question = {
        id: `q-${Date.now()}`,
        type: 'transformation',
        prompt: qPrompt.trim() || 'Transform the sentence as directed:',
        instruction: qInstruction.trim(),
        originalSentence: originalSentence.trim(),
        correctedSentence: correctedSentence.trim(),
        correctAnswer: correctedSentence.trim(),
        difficulty: qDifficulty,
        tier: qTier,
        marks: qMarks,
        scaffoldingNotes: qScaffoldingNotes.trim() || undefined,
        explanation: qExplanation.trim(),
      };
    }

    const updatedQuestions = [...currentExercise.questions, question];
    const updatedExercises = topic.exercises.map((ex) =>
      ex.id === currentExercise.id
        ? {
            ...ex,
            questions: updatedQuestions,
            maxMarks: updatedQuestions.reduce((a, q) => a + q.marks, 0),
          }
        : ex
    );

    onUpdateTopic({ ...topic, exercises: updatedExercises });

    // Reset form
    setIsAddingQuestion(false);
    setQPrompt('');
    setQInstruction('');
    setQScaffoldingNotes('');
    setQExplanation('');
    setMcqOptionA('');
    setMcqOptionB('');
    setMcqOptionC('');
    setMcqOptionD('');
    setBlanksSentence('');
    setAcceptableAnswer('');
    setOriginalSentence('');
    setCorrectedSentence('');
  };

  const handleUpdateQuestionTier = (qId: string, newTier: DevelopmentalTier) => {
    if (!currentExercise) return;
    const updatedQuestions = currentExercise.questions.map((q) => {
      if (q.id === qId) {
        return {
          ...q,
          tier: newTier,
          difficulty: newTier === 'foundation' ? ('Easy' as const) : newTier === 'advanced' ? ('Hard' as const) : ('Medium' as const),
        };
      }
      return q;
    });

    const updatedExercises = topic.exercises.map((ex) =>
      ex.id === currentExercise.id
        ? {
            ...ex,
            questions: updatedQuestions,
          }
        : ex
    );
    onUpdateTopic({ ...topic, exercises: updatedExercises });
  };

  const handleAutoScaffold3Tiers = () => {
    if (!currentExercise) return;
    const { foundation, standard, advanced } = groupTopicQuestionsByTier(topic);
    const newItems: GrammarQuestion[] = [];
    if (foundation.length === 0) {
      newItems.push(...generateScaffoldedQuestionsForTier(topic, 'foundation'));
    }
    if (advanced.length === 0) {
      newItems.push(...generateScaffoldedQuestionsForTier(topic, 'advanced'));
    }
    if (newItems.length === 0) {
      newItems.push(generateScaffoldedQuestionsForTier(topic, 'foundation')[0]);
      newItems.push(generateScaffoldedQuestionsForTier(topic, 'advanced')[0]);
    }

    const updatedQuestions = [...currentExercise.questions, ...newItems];
    const updatedExercises = topic.exercises.map((ex) =>
      ex.id === currentExercise.id
        ? {
            ...ex,
            questions: updatedQuestions,
            maxMarks: updatedQuestions.reduce((a, q) => a + q.marks, 0),
          }
        : ex
    );
    onUpdateTopic({ ...topic, exercises: updatedExercises });
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!currentExercise) return;
    if (confirm('Delete this question?')) {
      const updatedQuestions = currentExercise.questions.filter((q) => q.id !== qId);
      const updatedExercises = topic.exercises.map((ex) =>
        ex.id === currentExercise.id
          ? {
              ...ex,
              questions: updatedQuestions,
              maxMarks: updatedQuestions.reduce((a, q) => a + q.marks, 0),
            }
          : ex
      );
      onUpdateTopic({ ...topic, exercises: updatedExercises });
    }
  };

  const filteredQuestions = (currentExercise?.questions || []).filter((q) => {
    if (filterType !== 'all' && q.type !== filterType) return false;
    if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
    if (filterTier !== 'all' && inferQuestionTier(q) !== filterTier) return false;
    return true;
  });

  return (
    <div id="grammar-exercises-tab" className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Left Exercise Sub-navigation */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 dark:border-slate-800 p-4 space-y-3 bg-stone-50/50 dark:bg-slate-900/40 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400">
            Exercise Sets ({topic.exercises.length})
          </span>
          <button
            onClick={() => setIsAddingExercise(true)}
            className="p-1 rounded-md text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40"
            title="Create New Exercise"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {isAddingExercise && (
          <div className="p-3 rounded-xl border border-amber-400 bg-white dark:bg-slate-800 space-y-2 text-xs">
            <input
              type="text"
              placeholder="Exercise Title"
              value={newExTitle}
              onChange={(e) => setNewExTitle(e.target.value)}
              className="w-full px-2.5 py-1 rounded border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
            />
            <input
              type="text"
              placeholder="Instructions"
              value={newExInstructions}
              onChange={(e) => setNewExInstructions(e.target.value)}
              className="w-full px-2.5 py-1 rounded border border-stone-300 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
            />
            <div className="flex justify-end space-x-1 pt-1">
              <button
                onClick={() => setIsAddingExercise(false)}
                className="px-2 py-0.5 rounded text-[11px] border border-stone-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExercise}
                className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {topic.exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExId(ex.id)}
              className={`w-full text-left p-3 rounded-xl transition-colors text-xs flex flex-col ${
                currentExercise?.id === ex.id
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold'
                  : 'hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300'
              }`}
            >
              <div className="truncate font-medium">{ex.title}</div>
              <div className="flex items-center space-x-2 text-[10px] text-stone-400 mt-1">
                <span>{ex.questions.length} Questions</span>
                <span>•</span>
                <span>{ex.maxMarks} Marks</span>
              </div>
            </button>
          ))}
        </div>

        {/* AI Quick Generate in Sidebar */}
        <div className="pt-2">
          <button
            onClick={onOpenAiGenerator}
            className="w-full p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Generate Exercises</span>
          </button>
        </div>
      </div>

      {/* Right Content Area: Question Bank for Selected Exercise */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
        {/* Header with Exercise Details & Filters */}
        <div className="space-y-3 pb-3 border-b border-stone-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-stone-900 dark:text-slate-100">
                  {currentExercise?.title || 'Practice Exercises'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  3-Tier Scaffolding Enabled
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                {currentExercise?.instructions || 'Attempt all questions according to syllabus instructions.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowWorksheetStudio(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
                title="Generate Differentiated Homework & Mixed-Ability Worksheets"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Dual Worksheet Studio</span>
              </button>

              <button
                onClick={handleAutoScaffold3Tiers}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 flex items-center space-x-1.5 transition-colors"
                title="Ensure exercises have balanced Foundation, Standard, and Advanced items"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Scaffold Tiers</span>
              </button>

              <button
                onClick={() => setIsAddingQuestion(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Developmental Tier Scaffolding Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mr-1 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Tiers:</span>
              </span>

              <button
                onClick={() => setFilterTier('all')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  filterTier === 'all'
                    ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 shadow-xs'
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 hover:bg-stone-200'
                }`}
              >
                All ({(currentExercise?.questions || []).length})
              </button>

              <button
                onClick={() => setFilterTier('foundation')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                  filterTier === 'foundation'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Foundation (Remedial) (
                {(currentExercise?.questions || []).filter((q) => inferQuestionTier(q) === 'foundation').length}
                )
              </button>

              <button
                onClick={() => setFilterTier('standard')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                  filterTier === 'standard'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                }`}
              >
                Standard (Grade-Level) (
                {(currentExercise?.questions || []).filter((q) => inferQuestionTier(q) === 'standard').length}
                )
              </button>

              <button
                onClick={() => setFilterTier('advanced')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                  filterTier === 'advanced'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                }`}
              >
                Advanced / Olympiad (
                {(currentExercise?.questions || []).filter((q) => inferQuestionTier(q) === 'advanced').length}
                )
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter questions by format"
                className="px-2 py-1 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-[11px]"
              >
                <option value="all">All Formats</option>
                <option value="mcq">MCQ</option>
                <option value="fill_in_blanks">Fill in Blanks</option>
                <option value="match_column">Match Column</option>
                <option value="error_correction">Error Spotting</option>
                <option value="transformation">Transformation</option>
              </select>

              {/* Difficulty filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                aria-label="Filter questions by difficulty"
                className="px-2 py-1 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-[11px]"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add Question Modal / Form Card */}
        {isAddingQuestion && (
          <div className="p-5 rounded-2xl border-2 border-amber-400 bg-white dark:bg-slate-800 shadow-lg space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                <Plus className="w-4 h-4" />
                <span>Create New Assessment Item</span>
              </h4>
              <button
                onClick={() => setIsAddingQuestion(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Type Selector */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              {(
                [
                  { type: 'mcq', label: 'MCQ Choice' },
                  { type: 'fill_in_blanks', label: 'Fill in Blanks' },
                  { type: 'match_column', label: 'Match Column' },
                  { type: 'error_correction', label: 'Error Spotting' },
                  { type: 'transformation', label: 'Transformation' },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => setQType(btn.type)}
                  className={`p-2 rounded-xl text-center border font-medium transition-colors ${
                    qType === btn.type
                      ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-900 text-stone-700 dark:text-slate-300'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Developmental Scaffolding Tier Selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400">
                Developmental Scaffolding Tier (3-Tier Differentiation) *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(['foundation', 'standard', 'advanced'] as DevelopmentalTier[]).map((tierKey) => {
                  const meta = TIER_METADATA[tierKey];
                  const isSelected = qTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => {
                        setQTier(tierKey);
                        setQDifficulty(
                          tierKey === 'foundation' ? 'Easy' : tierKey === 'advanced' ? 'Hard' : 'Medium'
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? `${meta.badgeBorder} ${meta.badgeBg} ring-2 ring-amber-500/50 font-semibold shadow-xs`
                          : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? meta.badgeText : 'text-stone-800 dark:text-slate-200'
                          }`}
                        >
                          {meta.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {meta.sublabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                  Question Prompt / Lead *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Choose the correct option to fill the gap:"
                  value={qPrompt}
                  onChange={(e) => setQPrompt(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={qDifficulty}
                    onChange={(e: any) => setQDifficulty(e.target.value)}
                    aria-label="Question difficulty"
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="w-20">
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={qMarks}
                    onChange={(e) => setQMarks(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Scaffolding Cue Note */}
            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scaffolding Notes / Remedial Hint / Olympiad Nuance (Optional)</span>
              </label>
              <input
                type="text"
                placeholder={
                  qTier === 'foundation'
                    ? 'e.g. Scaffolding hint: Remember that singular nouns take -s in present tense'
                    : qTier === 'advanced'
                    ? 'e.g. Enrichment nuance: Tests inversion after negative adverbial "Seldom"'
                    : 'e.g. Target grammar rule hint or guided step'
                }
                value={qScaffoldingNotes}
                onChange={(e) => setQScaffoldingNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            {/* Type Specific Fields */}
            {qType === 'mcq' && (
              <div className="p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
                <span className="font-bold text-stone-700 dark:text-slate-300">
                  Multiple Choice Options (A, B, C, D) &amp; Correct Key
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 font-bold text-stone-500">A)</span>
                    <input
                      type="text"
                      placeholder="Option A text"
                      value={mcqOptionA}
                      onChange={(e) => setMcqOptionA(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 font-bold text-stone-500">B)</span>
                    <input
                      type="text"
                      placeholder="Option B text"
                      value={mcqOptionB}
                      onChange={(e) => setMcqOptionB(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 font-bold text-stone-500">C)</span>
                    <input
                      type="text"
                      placeholder="Option C text"
                      value={mcqOptionC}
                      onChange={(e) => setMcqOptionC(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 font-bold text-stone-500">D)</span>
                    <input
                      type="text"
                      placeholder="Option D text"
                      value={mcqOptionD}
                      onChange={(e) => setMcqOptionD(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <span className="font-semibold text-stone-600 dark:text-slate-400">
                    Correct Option Key:
                  </span>
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="correct-mcq"
                        checked={mcqCorrect === opt}
                        onChange={() => setMcqCorrect(opt)}
                      />
                      <span className="font-bold">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {qType === 'fill_in_blanks' && (
              <div className="p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Sentence with Blank (Use ___ for blank):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. She has been waiting ___ two hours."
                    value={blanksSentence}
                    onChange={(e) => setBlanksSentence(e.target.value)}
                    className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                      Correct Answer:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. for"
                      value={acceptableAnswer}
                      onChange={(e) => setAcceptableAnswer(e.target.value)}
                      className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                      Hint / Word Choices (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. since / for"
                      value={hints}
                      onChange={(e) => setHints(e.target.value)}
                      className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {qType === 'match_column' && (
              <div className="p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
                <span className="font-bold text-stone-700 dark:text-slate-300">
                  Column Matching Pairs (Item 1 matches A, Item 2 matches B, etc.)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Column A Item 1"
                    value={colA1}
                    onChange={(e) => setColA1(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Matching Column B Item A"
                    value={colB1}
                    onChange={(e) => setColB1(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Column A Item 2"
                    value={colA2}
                    onChange={(e) => setColA2(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Matching Column B Item B"
                    value={colB2}
                    onChange={(e) => setColB2(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Column A Item 3 (Optional)"
                    value={colA3}
                    onChange={(e) => setColA3(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Matching Column B Item C (Optional)"
                    value={colB3}
                    onChange={(e) => setColB3(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {(qType === 'error_correction' || qType === 'transformation') && (
              <div className="p-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Original Sentence:
                  </label>
                  <input
                    type="text"
                    placeholder={
                      qType === 'error_correction'
                        ? 'e.g. He do not know the answer.'
                        : 'e.g. As soon as the bell rang, they departed.'
                    }
                    value={originalSentence}
                    onChange={(e) => setOriginalSentence(e.target.value)}
                    className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                {qType === 'transformation' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                      Transformation Instruction (e.g. "Begin with 'No sooner did...'"):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Begin with 'No sooner did...'"
                      value={qInstruction}
                      onChange={(e) => setQInstruction(e.target.value)}
                      className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Corrected / Transformed Target Sentence:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. He does not know the answer."
                    value={correctedSentence}
                    onChange={(e) => setCorrectedSentence(e.target.value)}
                    className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Pedagogical Explanation */}
            <div className="text-xs">
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Pedagogical Explanation (Shown in LMS feedback &amp; Teacher Key) *
              </label>
              <textarea
                rows={2}
                placeholder="Explain the grammar rule violated or why this choice is correct..."
                value={qExplanation}
                onChange={(e) => setQExplanation(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAddingQuestion(false)}
                className="px-3 py-1.5 rounded-lg text-xs border border-stone-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
              >
                Save Question
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-stone-200 dark:border-slate-800 rounded-2xl">
              <HelpCircle className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="text-xs font-semibold text-stone-600 dark:text-slate-400">
                No questions found matching your filter.
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Click "+ Add Question" or "AI Generate Exercises" to populate questions for this exercise.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const currentTier = inferQuestionTier(q);
              const tierMeta = TIER_METADATA[currentTier];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs space-y-3 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        Q{idx + 1}.
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300">
                        {q.type.replace('_', ' ')}
                      </span>

                      {/* Developmental Tier Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierMeta.badgeBg} ${tierMeta.badgeText} ${tierMeta.badgeBorder} flex items-center space-x-1`}
                        title={tierMeta.description}
                      >
                        <span>{tierMeta.label}</span>
                      </span>

                      {/* Fast Tier Switcher Dropdown */}
                      <select
                        value={q.tier || currentTier}
                        onChange={(e) => handleUpdateQuestionTier(q.id, e.target.value as DevelopmentalTier)}
                        aria-label="Change question developmental tier"
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-700 dark:text-slate-300 cursor-pointer hover:border-amber-400"
                        title="Reassign this question to Foundation, Standard, or Advanced tier"
                      >
                        <option value="foundation">Tier 1: Foundation (Remedial)</option>
                        <option value="standard">Tier 2: Standard (Grade-Level)</option>
                        <option value="advanced">Tier 3: Advanced / Olympiad</option>
                      </select>

                      <span className="text-[10px] text-stone-400 font-mono">
                        [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors shrink-0"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scaffolding Cue Note */}
                  {q.scaffoldingNotes && (
                    <div className="text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-start space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Scaffolding / Remedial Cue: </strong>
                        <span>{q.scaffoldingNotes}</span>
                      </div>
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="text-xs md:text-sm font-medium text-stone-800 dark:text-slate-200">
                    {q.prompt}
                  </div>

                {q.instruction && (
                  <div className="text-[11px] italic text-stone-500 dark:text-slate-400">
                    ↳ Instruction: {q.instruction}
                  </div>
                )}

                {/* MCQ Options Display */}
                {q.type === 'mcq' && q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            isCorrect
                              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-semibold'
                              : 'border-stone-200 dark:border-slate-700 bg-stone-50/50 dark:bg-slate-900/40 text-stone-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Fill in Blanks Display */}
                {q.type === 'fill_in_blanks' && q.blanksSentence && (
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-700 text-xs font-serif">
                    <span className="font-semibold text-stone-800 dark:text-slate-200">
                      {q.blanksSentence}
                    </span>
                    {q.hints && (
                      <span className="ml-2 text-amber-700 dark:text-amber-400 font-sans text-[11px]">
                        ({q.hints})
                      </span>
                    )}
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-sans mt-1">
                      Key: <strong>{q.correctAnswer}</strong>
                    </div>
                  </div>
                )}

                {/* Match Column Display */}
                {q.type === 'match_column' && q.columnA && q.columnB && (
                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-slate-900/50 p-3 rounded-xl border border-stone-200 dark:border-slate-700">
                    <div className="space-y-1">
                      <span className="font-bold text-[10px] uppercase text-stone-500">Column A</span>
                      {q.columnA.map((ca) => (
                        <div key={ca.id} className="p-1.5 rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                          {ca.text}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-[10px] uppercase text-stone-500">Column B</span>
                      {q.columnB.map((cb) => (
                        <div key={cb.id} className="p-1.5 rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                          {cb.text}
                        </div>
                      ))}
                    </div>
                    <div className="col-span-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                      Answer Key: {q.correctAnswer}
                    </div>
                  </div>
                )}

                {/* Error correction or transformation sentence */}
                {q.originalSentence && (
                  <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="text-stone-600 dark:text-slate-400 italic">
                      Sentence: "{q.originalSentence}"
                    </div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                      Target: "{q.correctAnswer}"
                    </div>
                  </div>
                )}

                {/* Pedagogical Explanation Footer */}
                {q.explanation && (
                  <div className="text-[11px] text-stone-500 dark:text-slate-400 bg-stone-50/50 dark:bg-slate-900/30 p-2 rounded-lg border-l-2 border-amber-500">
                    <strong>Pedagogical Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </div>

      {/* Dual Worksheet & Mixed-Ability Studio Modal */}
      {showWorksheetStudio && (
        <DifferentiatedWorksheetStudioModal
          topic={topic}
          isOpen={showWorksheetStudio}
          onClose={() => setShowWorksheetStudio(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
