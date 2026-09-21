import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  Printer,
  Copy,
  Info,
  Scale,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  CompositionGenre,
  GrammarClassLevel,
  CompositionEvaluationResult,
} from '../../types';
import {
  BOARD_RUBRICS,
  BoardRubricScheme,
  evaluateCompositionLocally,
} from '../../utils/compositionData';

interface RubricsEvaluatorProps {
  genre: CompositionGenre;
  subCategory: string;
  classLevel: GrammarClassLevel;
  rawText: string;
  isDarkMode: boolean;
  onEvaluationComplete?: (res: CompositionEvaluationResult) => void;
}

export const RubricsEvaluator: React.FC<RubricsEvaluatorProps> = ({
  genre,
  subCategory,
  classLevel,
  rawText,
  isDarkMode,
  onEvaluationComplete,
}) => {
  const defaultSchemeKey =
    genre === 'notice' ? 'cbse_notice' : genre === 'formal_letter' ? 'cbse_formal_letter' : 'cbse_formal_letter';

  const [selectedSchemeKey, setSelectedSchemeKey] = useState<string>(defaultSchemeKey);
  const activeScheme: BoardRubricScheme = BOARD_RUBRICS[selectedSchemeKey] || BOARD_RUBRICS.cbse_formal_letter;

  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<CompositionEvaluationResult | null>(() =>
    rawText.trim()
      ? evaluateCompositionLocally(genre, subCategory, rawText, classLevel, activeScheme)
      : null
  );

  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const runEvaluation = async (useAi: boolean = false) => {
    if (!rawText.trim()) {
      alert('Please enter or generate text in the draft editor first.');
      return;
    }

    setEvaluating(true);

    if (useAi) {
      try {
        const response = await fetch('/api/grammar/grade-composition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            genre,
            subCategory,
            classLevel,
            studentText: rawText,
            rubric: {
              totalMarks: activeScheme.totalMarks,
              formatMarks: activeScheme.formatMarks,
              contentMarks: activeScheme.contentMarks,
              expressionMarks: activeScheme.expressionMarks,
              boardScheme: activeScheme.boardName,
              accuracyRule: activeScheme.accuracyRule,
            },
          }),
        });

        if (response.ok) {
          const aiResult = await response.json();
          setEvaluationResult(aiResult);
          if (onEvaluationComplete) onEvaluationComplete(aiResult);
          setEvaluating(false);
          return;
        }
      } catch (err) {
        console.warn('AI evaluation endpoint unavailable, using local rules evaluator:', err);
      }
    }

    // Local evaluation engine
    setTimeout(() => {
      const localResult = evaluateCompositionLocally(genre, subCategory, rawText, classLevel, activeScheme);
      setEvaluationResult(localResult);
      if (onEvaluationComplete) onEvaluationComplete(localResult);
      setEvaluating(false);
    }, 300);
  };

  const handleCopyReport = () => {
    if (!evaluationResult) return;
    const report = `COMPOSITION EVALUATION REPORT
Target Genre: ${genre.toUpperCase()} (${subCategory})
Class Level: ${classLevel}
Board Standard: ${activeScheme.boardName}
Score: ${evaluationResult.totalScore} / ${evaluationResult.maxScore} (${evaluationResult.percentage}%) - Grade: ${evaluationResult.letterGrade}

WORD COUNT:
${evaluationResult.wordCount.actual} words (Recommended: ${evaluationResult.wordCount.recommendedMin}-${evaluationResult.wordCount.recommendedMax})

CRITERIA BREAKDOWN:
${evaluationResult.criteriaBreakdown
  .map((c) => `- ${c.criterion}: ${c.scoredMarks} / ${c.maxMarks} marks (${c.assessedFeedback})`)
  .join('\n')}

STRENGTHS:
${evaluationResult.strengths.map((s) => `• ${s}`).join('\n')}

IMPROVEMENT AREAS:
${evaluationResult.improvements.map((i) => `• ${i}`).join('\n')}

TEACHER REMARKS:
${teacherNotes || 'Consistently follow structural guidelines to secure full marks.'}`.trim();

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Board Scheme Picker & Grade trigger */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-slate-300">
            Marking Scheme:
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.values(BOARD_RUBRICS)
              .filter((r) => r.genre === genre || (genre !== 'notice' && r.genre === 'formal_letter'))
              .map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => {
                    setSelectedSchemeKey(scheme.id);
                    if (rawText.trim()) {
                      const updated = evaluateCompositionLocally(
                        genre,
                        subCategory,
                        rawText,
                        classLevel,
                        scheme
                      );
                      setEvaluationResult(updated);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSchemeKey === scheme.id
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {scheme.boardName} ({scheme.totalMarks} Marks)
                </button>
              ))}
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => runEvaluation(false)}
            disabled={evaluating}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 border transition-all ${
              isDarkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
            <span>Instant Rule Check</span>
          </button>

          <button
            onClick={() => runEvaluation(true)}
            disabled={evaluating}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs hover:from-amber-500 hover:to-orange-500 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{evaluating ? 'Analyzing...' : 'AI Comprehensive Grade'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Criteria Rubric Table + Right Assessment Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Board Rubric Specifications (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`p-5 rounded-xl border ${
              isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-stone-800 dark:text-slate-100 flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-500" />
                <span>{activeScheme.boardName} Rubric Matrix</span>
              </h3>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                Max: {activeScheme.totalMarks} Marks
              </span>
            </div>

            <div className="space-y-4 text-sm">
              {/* Format Criteria */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                  <span className="text-amber-600 dark:text-amber-400">
                    1. Format ({activeScheme.formatMarks} Mark{activeScheme.formatMarks > 1 ? 's' : ''})
                  </span>
                  <span className="text-xs text-stone-400 font-normal">Strict Sequence</span>
                </div>
                <ul className="space-y-1 text-stone-600 dark:text-slate-300 list-disc list-inside text-sm">
                  {activeScheme.formatChecklist.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Criteria */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                  <span className="text-amber-600 dark:text-amber-400">
                    2. Content ({activeScheme.contentMarks} Marks)
                  </span>
                  <span className="text-xs text-stone-400 font-normal">Thematic Coverage</span>
                </div>
                <ul className="space-y-1 text-stone-600 dark:text-slate-300 list-disc list-inside text-sm">
                  {activeScheme.contentGuidelines.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expression Criteria */}
              <div
                className={`p-3.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-stone-800 dark:text-slate-200 mb-1.5">
                  <span className="text-amber-600 dark:text-amber-400">
                    3. Expression &amp; Style ({activeScheme.expressionMarks} Marks)
                  </span>
                  <span className="text-xs text-stone-400 font-normal">Fluency &amp; Register</span>
                </div>
                <ul className="space-y-1 text-stone-600 dark:text-slate-300 list-disc list-inside text-sm">
                  {activeScheme.expressionGuidelines.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accuracy & Penalty Rules */}
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-stone-700 dark:text-slate-300">
                <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center space-x-1 mb-1 text-sm">
                  <Info className="w-4 h-4" />
                  <span>Penalty &amp; Deduction Rules:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">{activeScheme.accuracyRule}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assessment Scorecard & Feedback (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {evaluationResult ? (
            <div
              className={`p-6 rounded-xl border ${
                isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              {/* Header Score summary */}
              <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-slate-700 gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-500 dark:text-slate-400 font-semibold">
                    Evaluated Score
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
                      {evaluationResult.totalScore}
                    </span>
                    <span className="text-stone-400 text-base">/ {evaluationResult.maxScore} Marks</span>
                    <span
                      className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                        evaluationResult.percentage >= 80
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : evaluationResult.percentage >= 60
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {evaluationResult.percentage}% • Grade {evaluationResult.letterGrade}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyReport}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 border transition-all ${
                      copied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Report Copied' : 'Copy Report'}</span>
                  </button>
                </div>
              </div>

              {/* Word Count Indicator */}
              <div className="mb-4 p-3.5 rounded-lg bg-stone-50 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-800 flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-slate-200">Word Count Analysis: </span>
                  <span className="font-mono text-stone-700 dark:text-slate-300 font-bold">
                    {evaluationResult.wordCount.actual} words
                  </span>{' '}
                  <span className="text-stone-500 text-xs sm:text-sm">
                    (Target: {evaluationResult.wordCount.recommendedMin}–
                    {evaluationResult.wordCount.recommendedMax})
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    evaluationResult.wordCount.status === 'optimal'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {evaluationResult.wordCount.status === 'optimal'
                    ? 'Within Prescribed Limits'
                    : evaluationResult.wordCount.status === 'under'
                    ? 'Under Limit'
                    : 'Over Limit'}
                </span>
              </div>

              {/* Criteria Score Cards */}
              <div className="space-y-3.5 mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                  Criterion-by-Criterion Marks Allocation
                </h4>

                {evaluationResult.criteriaBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border text-sm ${
                      isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-stone-50/70 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1.5">
                      <span className="text-stone-800 dark:text-slate-200">{item.criterion}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">
                        {item.scoredMarks} / {item.maxMarks} Marks
                      </span>
                    </div>
                    {/* Visual Meter */}
                    <div className="w-full h-2 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (item.scoredMarks / item.maxMarks) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                      {item.assessedFeedback}
                    </p>
                  </div>
                ))}
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5 text-sm">
                {/* Strengths */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Demonstrated Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-700 dark:text-slate-300 text-xs sm:text-sm">
                    {evaluationResult.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center space-x-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Areas to Refine</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-700 dark:text-slate-300 text-xs sm:text-sm">
                    {evaluationResult.improvements.map((imp, iIdx) => (
                      <li key={iIdx} className="flex items-start space-x-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Teacher Remarks field */}
              <div className="pt-2">
                <label className="block text-sm font-semibold text-stone-700 dark:text-slate-300 mb-1.5">
                  Teacher / Examiner Personalized Remarks
                </label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  rows={2}
                  className={`w-full p-3 rounded-lg text-sm border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                  placeholder="Add custom constructive remarks for the student or grading records..."
                />
              </div>
            </div>
          ) : (
            <div
              className={`p-8 rounded-xl border text-center ${
                isDarkMode ? 'bg-[#151c28] border-slate-700/80 text-slate-400' : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              <Award className="w-12 h-12 text-amber-500/50 mx-auto mb-3" />
              <h4 className="text-base font-bold text-stone-800 dark:text-slate-200 mb-1">
                No Evaluation Run Yet
              </h4>
              <p className="text-sm max-w-sm mx-auto mb-4">
                Click "AI Comprehensive Grade" or "Instant Rule Check" to grade your current draft against curriculum
                rubrics.
              </p>
              <button
                onClick={() => runEvaluation(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-xs cursor-pointer"
              >
                Evaluate Current Draft Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
