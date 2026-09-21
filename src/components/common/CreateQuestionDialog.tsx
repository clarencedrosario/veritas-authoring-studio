import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  AlertCircle,
  BookOpen,
  HelpCircle,
  FileText,
  Sparkles,
  Layers,
  Award,
  ListOrdered,
  Edit3,
} from 'lucide-react';
import {
  GrammarQuestion,
  QuestionType,
  GrammarClassLevel,
  GrammarTopic,
  DevelopmentalTier,
  CognitiveLevel,
} from '../../types';

export interface CreateQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedType?: QuestionType;
  topics: GrammarTopic[];
  selectedClass: GrammarClassLevel;
  targetBoard: string;
  onCreateQuestion: (question: GrammarQuestion, targetTopicId: string) => void;
  isDarkMode?: boolean;
}

export const CreateQuestionDialog: React.FC<CreateQuestionDialogProps> = ({
  isOpen,
  onClose,
  preselectedType = 'mcq',
  topics,
  selectedClass,
  targetBoard,
  onCreateQuestion,
  isDarkMode = false,
}) => {
  const [questionType, setQuestionType] = useState<QuestionType>(preselectedType);
  const [targetTopicId, setTargetTopicId] = useState<string>(
    topics[0]?.id || 'general-grammar'
  );

  // Form State
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tier, setTier] = useState<DevelopmentalTier>('standard');
  const [cognitiveLevel, setCognitiveLevel] = useState<CognitiveLevel>('Applying');
  const [marks, setMarks] = useState<number>(1);
  const [explanation, setExplanation] = useState('');

  // MCQ state
  const [mcqOptions, setMcqOptions] = useState<string[]>([
    'Neither the headmaster nor the tutors were in attendance.',
    'Neither the headmaster nor the tutors was in attendance.',
    'Both the headmaster nor the tutors was in attendance.',
    'Either the headmaster and tutors are in attendance.',
  ]);
  const [mcqCorrectIndex, setMcqCorrectIndex] = useState<number>(0);

  // Transformation state
  const [originalSentence, setOriginalSentence] = useState(
    'Neither the teacher nor the students was present in the auditorium.'
  );
  const [transformationInstruction, setTransformationInstruction] = useState(
    'Begin with: Neither the students...'
  );
  const [transformedAnswer, setTransformedAnswer] = useState(
    'Neither the students nor the teacher was present in the auditorium.'
  );

  // Error Correction state
  const [errorSentence, setErrorSentence] = useState(
    'The committee have decided to adjourn the formal assembly.'
  );
  const [errorSnippet, setErrorSnippet] = useState('have');
  const [correctionSnippet, setCorrectionSnippet] = useState('has');

  // Fill in blanks / Short answer state
  const [blanksSentence, setBlanksSentence] = useState(
    'Each of the candidates ___ (has/have) submitted the required thesis.'
  );
  const [directAnswer, setDirectAnswer] = useState('has');

  // Error validation feedback
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize preselectedType whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setQuestionType(preselectedType);
      if (topics.length > 0 && !topics.some((t) => t.id === targetTopicId)) {
        setTargetTopicId(topics[0].id);
      }
      setValidationError(null);

      // Pre-fill sensible default prompt based on type if empty
      if (!prompt) {
        if (preselectedType === 'mcq') {
          setPrompt('Identify the sentence that observes correct grammatical concord:');
        } else if (preselectedType === 'transformation') {
          setPrompt('Rewrite the following sentence according to the given instructions without altering its core meaning:');
        } else if (preselectedType === 'error_correction') {
          setPrompt('Identify the grammatical error in the sentence and provide the correct replacement:');
        } else if (preselectedType === 'fill_in_blanks') {
          setPrompt('Fill in the blank with the appropriate finite verb form:');
        } else {
          setPrompt('Provide the prescriptive grammatical rule and justification for this construction:');
        }
      }
    }
  }, [isOpen, preselectedType, topics]);

  // Handle Type Change
  const handleTypeChange = (newType: QuestionType) => {
    setQuestionType(newType);
    setValidationError(null);
    if (newType === 'mcq') {
      setPrompt('Identify the sentence that observes correct grammatical concord:');
      setMarks(1);
    } else if (newType === 'transformation') {
      setPrompt('Rewrite the following sentence according to the given instructions without altering its core meaning:');
      setMarks(1);
    } else if (newType === 'error_correction') {
      setPrompt('Identify the grammatical error in the sentence and provide the correct replacement:');
      setMarks(1);
    } else if (newType === 'fill_in_blanks') {
      setPrompt('Fill in the blank with the appropriate finite verb form:');
      setMarks(1);
    } else {
      setPrompt('Provide the prescriptive grammatical rule and justification for this construction:');
      setMarks(2);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setValidationError('Please enter a question prompt or stem.');
      return;
    }

    let correctAnswer = '';
    let options: string[] | undefined = undefined;
    let distractorExplanations: string[] | undefined = undefined;

    if (questionType === 'mcq') {
      const validOptions = mcqOptions.map((o) => o.trim());
      if (validOptions.some((o) => !o)) {
        setValidationError('All four MCQ options must be populated.');
        return;
      }
      options = validOptions;
      correctAnswer = validOptions[mcqCorrectIndex] || validOptions[0];
      distractorExplanations = validOptions.map((_, i) =>
        i === mcqCorrectIndex
          ? 'Complies fully with standard grammatical concord.'
          : 'Syntactically discordant with subject-verb concord principles.'
      );
    } else if (questionType === 'transformation') {
      if (!transformedAnswer.trim()) {
        setValidationError('Please specify the correct transformed answer.');
        return;
      }
      correctAnswer = transformedAnswer.trim();
    } else if (questionType === 'error_correction') {
      if (!errorSnippet.trim() || !correctionSnippet.trim()) {
        setValidationError('Please specify both the error and correction snippets.');
        return;
      }
      correctAnswer = `Error: ${errorSnippet.trim()} -> Correction: ${correctionSnippet.trim()}`;
    } else if (questionType === 'fill_in_blanks') {
      if (!directAnswer.trim()) {
        setValidationError('Please provide the correct word for the blank.');
        return;
      }
      correctAnswer = directAnswer.trim();
    } else {
      if (!directAnswer.trim()) {
        setValidationError('Please enter the standard model answer.');
        return;
      }
      correctAnswer = directAnswer.trim();
    }

    const newQuestion: GrammarQuestion = {
      id: `q_${Date.now()}`,
      type: questionType,
      prompt: prompt.trim(),
      difficulty,
      tier,
      cognitiveLevel,
      marks: Number(marks) || 1,
      options,
      correctAnswer,
      distractorExplanations,
      explanation:
        explanation.trim() ||
        'Adheres to standard prescriptive English grammar rules regarding agreement, inflection, and syntax.',
      originalSentence:
        questionType === 'transformation'
          ? originalSentence.trim()
          : questionType === 'error_correction'
          ? errorSentence.trim()
          : undefined,
      instruction:
        questionType === 'transformation'
          ? transformationInstruction.trim()
          : undefined,
      errorSnippet:
        questionType === 'error_correction' ? errorSnippet.trim() : undefined,
      correctionSnippet:
        questionType === 'error_correction' ? correctionSnippet.trim() : undefined,
      blanksSentence:
        questionType === 'fill_in_blanks' ? blanksSentence.trim() : undefined,
      isAiDraft: false,
    };

    onCreateQuestion(newQuestion, targetTopicId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#C29A52]/40 rounded-2xl shadow-2xl max-w-2xl w-full text-[#292521] dark:text-[#F6F0E7] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-question-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#2b1622] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="create-question-modal-title"
                className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]"
              >
                Create Academic Question
              </h3>
              <p className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                Veritas Question Bank &bull; {selectedClass} &bull; {targetBoard}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Question Type Segmented Selector */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1.5">
              Question Format &amp; Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'mcq', label: 'MCQ (Single Choice)', icon: HelpCircle },
                { id: 'transformation', label: 'Sentence Transformation', icon: Edit3 },
                { id: 'error_correction', label: 'Editing / Error', icon: AlertCircle },
                { id: 'fill_in_blanks', label: 'Fill in the Blanks', icon: FileText },
              ].map((item) => {
                const isSelected = questionType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id as QuestionType)}
                    className={`h-11 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all text-center ${
                      isSelected
                        ? 'bg-[#5A1832] text-[#F6F0E7] border-[#5A1832] shadow-xs'
                        : 'border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-[#292521] dark:text-[#EDE4D6] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Topic / Syllabus Unit Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Chapter / Topic Assignment
              </label>
              <select
                value={targetTopicId}
                onChange={(e) => setTargetTopicId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52]"
              >
                {topics.length > 0 ? (
                  topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.category})
                    </option>
                  ))
                ) : (
                  <option value="general-grammar">General Grammar &amp; Syntax</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Cognitive Taxonomy (Bloom)
              </label>
              <select
                value={cognitiveLevel}
                onChange={(e) => setCognitiveLevel(e.target.value as CognitiveLevel)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52]"
              >
                <option value="Remembering">Remembering (Factual recall)</option>
                <option value="Understanding">Understanding (Rule comprehension)</option>
                <option value="Applying">Applying (Rule execution)</option>
                <option value="Analysing">Analysing (Error identification)</option>
                <option value="Evaluating">Evaluating (Diagnostic critique)</option>
                <option value="Creating">Creating (Original synthesis)</option>
              </select>
            </div>
          </div>

          {/* 3. Question Prompt */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
              Question Prompt / Stem <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the primary question instructions or prompt..."
              className="w-full p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52] leading-relaxed resize-none"
            />
          </div>

          {/* 4. Type Specific Fields */}
          {questionType === 'mcq' && (
            <div className="space-y-2.5 p-3.5 rounded-xl bg-white dark:bg-[#25121c] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6]">
                <span>MCQ Options (Select the correct option)</span>
                <span className="text-[#5A1832] dark:text-[#C29A52]">Option {String.fromCharCode(65 + mcqCorrectIndex)} is Correct</span>
              </div>
              <div className="space-y-2">
                {mcqOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setMcqCorrectIndex(idx)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all font-mono text-xs font-bold ${
                        mcqCorrectIndex === idx
                          ? 'bg-[#5A1832] text-white border-[#5A1832]'
                          : 'border-[#CBBEAC] dark:border-[#4d2b3b] text-[#71685E] hover:border-[#5A1832]'
                      }`}
                      title="Set as correct answer"
                    >
                      {String.fromCharCode(65 + idx)}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...mcqOptions];
                        next[idx] = e.target.value;
                        setMcqOptions(next);
                      }}
                      className="flex-1 h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionType === 'transformation' && (
            <div className="space-y-2.5 p-3.5 rounded-xl bg-white dark:bg-[#25121c] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <div>
                <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                  Original Sentence
                </label>
                <input
                  type="text"
                  value={originalSentence}
                  onChange={(e) => setOriginalSentence(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
                  placeholder="e.g. Neither the teacher nor the students was present in the auditorium."
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                  Beginning Constraint / Instruction
                </label>
                <input
                  type="text"
                  value={transformationInstruction}
                  onChange={(e) => setTransformationInstruction(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
                  placeholder="e.g. Begin with: Neither the students..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52] mb-1">
                  Correct Transformed Answer <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={transformedAnswer}
                  onChange={(e) => setTransformedAnswer(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#5A1832] dark:border-[#C29A52] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none font-medium"
                  placeholder="e.g. Neither the students nor the teacher was present in the auditorium."
                />
              </div>
            </div>
          )}

          {questionType === 'error_correction' && (
            <div className="space-y-2.5 p-3.5 rounded-xl bg-white dark:bg-[#25121c] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <div>
                <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                  Context Sentence Containing Error
                </label>
                <input
                  type="text"
                  value={errorSentence}
                  onChange={(e) => setErrorSentence(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
                  placeholder="e.g. The committee have decided to adjourn the formal assembly."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-red-700 dark:text-red-400 mb-1">
                    Incorrect Snippet
                  </label>
                  <input
                    type="text"
                    value={errorSnippet}
                    onChange={(e) => setErrorSnippet(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-red-300 dark:border-red-900 bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none"
                    placeholder="e.g. have"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-green-700 dark:text-green-400 mb-1">
                    Correction Snippet
                  </label>
                  <input
                    type="text"
                    value={correctionSnippet}
                    onChange={(e) => setCorrectionSnippet(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-green-300 dark:border-green-900 bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none"
                    placeholder="e.g. has"
                  />
                </div>
              </div>
            </div>
          )}

          {questionType === 'fill_in_blanks' && (
            <div className="space-y-2.5 p-3.5 rounded-xl bg-white dark:bg-[#25121c] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <div>
                <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                  Sentence with Blank
                </label>
                <input
                  type="text"
                  value={blanksSentence}
                  onChange={(e) => setBlanksSentence(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
                  placeholder="e.g. Each of the candidates ___ (has/have) submitted..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52] mb-1">
                  Target Answer <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={directAnswer}
                  onChange={(e) => setDirectAnswer(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#5A1832] dark:border-[#C29A52] bg-[#F6F0E7] dark:bg-[#1e0f18] text-xs sm:text-sm text-[#292521] dark:text-[#F6F0E7] outline-none font-medium"
                  placeholder="e.g. has"
                />
              </div>
            </div>
          )}

          {/* 5. Taxonomic Parameters: Marks, Difficulty, Tier */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Marks
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                <option value="Easy">Easy (Recall)</option>
                <option value="Medium">Medium (Application)</option>
                <option value="Hard">Hard (Diagnostic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Pedagogical Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as DevelopmentalTier)}
                className="w-full h-9 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                <option value="foundation">Tier 1: Foundation</option>
                <option value="standard">Tier 2: Standard</option>
                <option value="advanced">Tier 3: Advanced</option>
              </select>
            </div>
          </div>

          {/* 6. Grammatical Rationale / Explanation */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] mb-1">
              Marking Scheme Rationale &amp; Pedagogical Notes
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="State prescriptive grammar rule, concord explanation, or citation for teacher marking..."
              className="w-full p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52] leading-relaxed resize-none"
            />
          </div>
        </form>

        {/* Footer Actions - VERITAS buttons 40-44px */}
        <div className="px-5 py-3.5 border-t border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#2b1622] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-10 sm:h-11 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] text-xs sm:text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 sm:h-11 px-5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Question Bank</span>
          </button>
        </div>
      </div>
    </div>
  );
};
