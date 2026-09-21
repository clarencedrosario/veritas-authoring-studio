import React, { useState } from 'react';
import { SentenceDiagramData } from '../../types';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

interface SyntaxChallengeModeProps {
  currentDiagram: SentenceDiagramData;
  onNextPreset?: () => void;
}

export const SyntaxChallengeMode: React.FC<SyntaxChallengeModeProps> = ({
  currentDiagram,
  onNextPreset,
}) => {
  // Steps in quiz:
  // Step 1: Sentence Classification (Simple vs Compound vs Complex vs Compound-Complex)
  // Step 2: Main Subject Head
  // Step 3: Main Finite Verb
  // Step 4: Clause Type Identification
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const resetQuiz = () => {
    setCurrentStep(1);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore({ correct: 0, total: 0 });
  };

  // Questions configuration based on current diagram
  const primarySubject = currentDiagram.clauses[0]?.subject.headNoun || 'Subject';
  const primaryVerb = currentDiagram.clauses[0]?.predicate.verbPhrase || 'Verb';
  const classification = currentDiagram.classification;

  // Step 1: Classification question
  const q1 = {
    title: 'Question 1: Sentence Classification',
    prompt: `Analyze the sentence structure: "${currentDiagram.sentence}"`,
    question: 'How is this sentence classified grammatically?',
    options: [
      { id: 'simple', label: 'Simple Sentence (Single Independent Clause)' },
      { id: 'compound', label: 'Compound Sentence (Multiple Coordinate Independent Clauses)' },
      { id: 'complex', label: 'Complex Sentence (One Principal Clause + Subordinate Clause)' },
      { id: 'compound-complex', label: 'Compound-Complex Sentence (Two+ Independent + Subordinate)' },
    ],
    correctAnswer: classification,
    explanation: currentDiagram.pedagogicalNotes,
  };

  // Step 2: Subject Head Question
  const otherWords = currentDiagram.tokens
    .filter((t) => t.word !== primarySubject && (t.pos === 'noun' || t.pos === 'adjective'))
    .slice(0, 3)
    .map((t) => t.word);
  const q2Options = Array.from(new Set([primarySubject, ...otherWords])).sort();

  const q2 = {
    title: 'Question 2: Core Subject Head',
    prompt: `Look at the main clause: "${currentDiagram.clauses[0]?.text || currentDiagram.sentence}"`,
    question: 'Which word serves as the grammatical head of the Subject?',
    options: q2Options.map((w) => ({ id: w, label: w })),
    correctAnswer: primarySubject,
    explanation: `The head noun is "${primarySubject}". Modifiers like adjectives and articles attach to it, but "${primarySubject}" performs or experiences the predicate.`,
  };

  // Step 3: Finite Verb Question
  const verbWords = currentDiagram.tokens
    .filter((t) => t.pos === 'verb' || t.pos === 'adverb')
    .slice(0, 3)
    .map((t) => t.word);
  const q3Options = Array.from(new Set([primaryVerb, ...verbWords])).sort();

  const q3 = {
    title: 'Question 3: Finite Predicate Verb',
    prompt: `Sentence: "${currentDiagram.sentence}"`,
    question: 'What is the primary finite verb of the main clause?',
    options: q3Options.map((w) => ({ id: w, label: w })),
    correctAnswer: primaryVerb,
    explanation: `The finite verb is "${primaryVerb}". It governs the predicate and indicates tense, aspect, and mood.`,
  };

  const activeQuestion = currentStep === 1 ? q1 : currentStep === 2 ? q2 : q3;

  const handleSelect = (id: string) => {
    if (isAnswered) return;
    setSelectedOption(id);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    const isCorrect = selectedOption.toLowerCase() === activeQuestion.correctAnswer.toLowerCase();
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else if (onNextPreset) {
      onNextPreset();
      resetQuiz();
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Challenge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="veritas-section-title text-lg md:text-xl font-serif font-bold text-stone-900 dark:text-slate-100">
              Interactive Syntax &amp; Clause Challenge
            </h3>
            <p className="veritas-body text-sm text-stone-500 dark:text-slate-400 mt-0.5">
              Step {currentStep} of 3 &bull; Test your grammatical parsing accuracy
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          <span className="text-sm font-semibold text-stone-700 dark:text-slate-300">
            Score: <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base">{score.correct}</strong> / {score.total}
          </span>
          <button
            onClick={resetQuiz}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-xs font-semibold text-stone-700 dark:text-slate-300 flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Target Sentence Display */}
      <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700">
        <span className="text-xs font-mono font-bold uppercase text-stone-500 dark:text-slate-400 tracking-wider">
          Sentence Under Analysis
        </span>
        <p className="font-serif text-lg md:text-xl text-stone-900 dark:text-slate-100 mt-2 leading-relaxed font-medium">
          "{currentDiagram.sentence}"
        </p>
      </div>

      {/* Active Question Box */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {activeQuestion.title}
          </span>
          <h4 className="veritas-card-title text-base md:text-lg font-bold text-stone-900 dark:text-slate-100 mt-1">
            {activeQuestion.question}
          </h4>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {activeQuestion.options.map((opt) => {
            const isSel = selectedOption === opt.id;
            const isCorrect = opt.id.toLowerCase() === activeQuestion.correctAnswer.toLowerCase();

            let itemClass =
              'border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-800 dark:text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                itemClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isSel && !isCorrect) {
                itemClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
              }
            } else if (isSel) {
              itemClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30 font-semibold';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-sm md:text-[15px] ${itemClass}`}
              >
                <span>{opt.label}</span>
                {isAnswered && (
                  <span>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSel ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback / Explanation upon answering */}
        {isAnswered && (
          <div className="p-4 md:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-sm text-indigo-900 dark:text-indigo-200 space-y-1.5 animate-in fade-in">
            <strong className="font-bold block">Pedagogical Analysis:</strong>
            <p className="veritas-body text-sm md:text-[15px] leading-relaxed">{activeQuestion.explanation}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!selectedOption}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
            >
              Verify Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <span>{currentStep < 3 ? 'Next Question' : 'Next Sentence Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
