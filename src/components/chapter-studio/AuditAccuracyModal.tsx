import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  SearchCheck,
  CircleCheckBig,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  X,
  RotateCcw,
  Check,
  ArrowRight,
  BookOpen,
  GraduationCap,
  ListFilter,
  Layers,
  Award,
  BadgeCheck,
} from 'lucide-react';
import {
  GrammarQuestion,
  StudioChapter,
  AccuracyAuditResult,
  AccuracyAuditFinding,
  AccuracyAuditStatus,
  AccuracyAnswerStatus,
  AuditConfidence,
} from '../../types';
import { auditQuestionAccuracy } from '../../utils/editorialAuditApi';

export interface AuditAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter?: StudioChapter | null;
  targetQuestion?: GrammarQuestion | null;
  onApplyCorrection?: (params: {
    questionId: string;
    newPrompt?: string;
    newAnswer?: string;
    userAction: 'apply_prompt' | 'apply_answer' | 'apply_both';
    previousPrompt?: string;
    previousAnswer?: string;
  }) => void;
  isDarkMode?: boolean;
}

export const AuditAccuracyModal: React.FC<AuditAccuracyModalProps> = ({
  isOpen,
  onClose,
  chapter,
  targetQuestion,
  onApplyCorrection,
  isDarkMode = false,
}) => {
  // Collect all available questions from chapter exercises for quick switching
  const allChapterQuestions = useMemo(() => {
    if (!chapter?.exercises) return [];
    const list: {
      question: GrammarQuestion;
      exerciseTitle: string;
      exerciseLetter: string;
    }[] = [];
    chapter.exercises.forEach((ex) => {
      (ex.questions || []).forEach((q) => {
        list.push({
          question: q,
          exerciseTitle: ex.title,
          exerciseLetter: ex.letter,
        });
      });
    });
    return list;
  }, [chapter]);

  // Selected question ID
  const [selectedQId, setSelectedQId] = useState<string>(
    targetQuestion?.id || allChapterQuestions[0]?.question.id || ''
  );

  // Active question being inspected
  const currentQ = useMemo(() => {
    if (targetQuestion && targetQuestion.id === selectedQId) return targetQuestion;
    const found = allChapterQuestions.find((item) => item.question.id === selectedQId);
    return found?.question || targetQuestion || null;
  }, [selectedQId, targetQuestion, allChapterQuestions]);

  // Working state for audit request
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('mcq');
  const [rationale, setRationale] = useState<string>('');
  const [marks, setMarks] = useState<number | undefined>(undefined);

  // Audit results & async state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AccuracyAuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Sync state when targetQuestion or selected question changes
  useEffect(() => {
    if (targetQuestion) {
      setSelectedQId(targetQuestion.id);
    } else if (allChapterQuestions.length > 0 && !selectedQId) {
      setSelectedQId(allChapterQuestions[0].question.id);
    }
  }, [targetQuestion, allChapterQuestions]);

  useEffect(() => {
    if (currentQ) {
      setQuestionText(currentQ.prompt || currentQ.originalSentence || currentQ.blanksSentence || '');
      setOptions(currentQ.options || []);
      setCorrectAnswer(currentQ.correctAnswer || currentQ.modelAnswer || '');
      setQuestionType(currentQ.type || 'mcq');
      setRationale(currentQ.explanation || (currentQ as any).pedagogicalNotes || '');
      setMarks(currentQ.marks || 1);
      setAuditResult(null);
      setErrorMessage(null);
      setAppliedNotice(null);
    }
  }, [currentQ]);

  if (!isOpen) return null;

  // Run accuracy and answer key audit
  const handleRunAudit = async () => {
    if (isLoading) return;
    if (!questionText.trim()) {
      setErrorMessage('Please provide question text to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setAppliedNotice(null);

    try {
      const result = await auditQuestionAccuracy({
        questionText: questionText.trim(),
        questionType,
        options: options.filter((o) => o && o.trim()),
        currentAnswer: correctAnswer.trim(),
        rationale: rationale.trim(),
        marks,
        board: chapter?.curriculumBoard || 'CISCE',
        grade: chapter?.equivalentClass || 'Class 6',
        subject: chapter?.category || 'English Language & Grammar',
        chapter: chapter?.title,
        learningObjective: chapter?.opening?.learningObjectives?.[0],
      });

      setAuditResult(result);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'Failed to complete accuracy and answer key audit. Original question data remains unchanged.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Apply corrections explicitly
  const handleApply = (type: 'prompt' | 'answer' | 'both') => {
    if (!currentQ || !auditResult) return;

    const previousPrompt = questionText;
    const previousAnswer = correctAnswer;
    let nextPrompt = questionText;
    let nextAnswer = correctAnswer;

    if (type === 'prompt' || type === 'both') {
      if (auditResult.suggestedQuestionRevision) {
        nextPrompt = auditResult.suggestedQuestionRevision.trim();
        setQuestionText(nextPrompt);
      }
    }

    if (type === 'answer' || type === 'both') {
      if (auditResult.suggestedAnswer) {
        nextAnswer = auditResult.suggestedAnswer.trim();
        setCorrectAnswer(nextAnswer);
      }
    }

    const actionType =
      type === 'prompt' ? 'apply_prompt' : type === 'answer' ? 'apply_answer' : 'apply_both';

    if (onApplyCorrection) {
      onApplyCorrection({
        questionId: currentQ.id,
        newPrompt: type === 'prompt' || type === 'both' ? nextPrompt : undefined,
        newAnswer: type === 'answer' || type === 'both' ? nextAnswer : undefined,
        userAction: actionType,
        previousPrompt,
        previousAnswer,
      });
    }

    const noticeLabel =
      type === 'both'
        ? 'Applied question revision and answer key correction'
        : type === 'prompt'
        ? 'Applied question revision to stem'
        : 'Applied corrected answer key';

    setAppliedNotice(`${noticeLabel}. Canonical data updated.`);
  };

  const handleDismiss = () => {
    setAuditResult(null);
    setErrorMessage(null);
    setAppliedNotice(null);
  };

  // Status visual badge
  const getStatusBadge = (status: AccuracyAuditStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-serif">
            <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider">Answer verified</span>
              <span className="text-[11px] text-emerald-700 ml-2 hidden sm:inline">
                Question premise and designated answer are factually sound and consistent.
              </span>
            </div>
          </div>
        );
      case 'REVIEW_RECOMMENDED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-serif">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider">
                Editorial review recommended
              </span>
              <span className="text-[11px] text-amber-800 ml-2 hidden sm:inline">
                Minor ambiguities, suboptimal wording, or distractor defensibility issues flagged.
              </span>
            </div>
          </div>
        );
      case 'ERROR_FOUND':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950 font-serif">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-rose-900">
                Possible accuracy issue detected
              </span>
              <span className="text-[11px] text-rose-800 ml-2 hidden sm:inline">
                Factual error, incorrect key, or contradictory question stem detected.
              </span>
            </div>
          </div>
        );
      case 'INSUFFICIENT_CONTEXT':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-900 font-serif">
            <HelpCircle className="w-4 h-4 text-stone-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Unable to verify from available context
              </span>
              <span className="text-[11px] text-stone-600 ml-2 hidden sm:inline">
                Missing external reference, reading passage, or unsupplied diagram.
              </span>
            </div>
          </div>
        );
    }
  };

  // Confidence visual badge
  const getConfidenceBadge = (confidence: AuditConfidence) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            High Confidence
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Medium Confidence
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-200 text-stone-800 border border-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-600" />
            Low Confidence
          </span>
        );
    }
  };

  // Answer status badge
  const getAnswerStatusBadge = (status: AccuracyAnswerStatus) => {
    switch (status) {
      case 'CORRECT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Key: Correct
          </span>
        );
      case 'INCORRECT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            Key: Incorrect
          </span>
        );
      case 'AMBIGUOUS':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Key: Ambiguous / Multiple
          </span>
        );
      case 'UNVERIFIABLE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">
            Key: Unverifiable
          </span>
        );
      case 'NOT_APPLICABLE':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Key: N/A
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border border-[var(--veritas-parchment,#DDD0BC)] bg-[#FFFDF9] overflow-hidden"
        style={{
          fontFamily: "'Cinzel', 'EB Garamond', Georgia, serif",
        }}
      >
        {/* ================================================================= */}
        {/* HEADER BAR                                                        */}
        {/* ================================================================= */}
        <div className="px-6 py-4 border-b border-[var(--veritas-parchment,#DDD0BC)] bg-[var(--veritas-parchment,#F6F0E7)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--veritas-burgundy,#8C2435)] text-[var(--veritas-gold,#F7E7CE)] shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-[var(--veritas-burgundy,#5A1832)] tracking-tight">
                  Audit Accuracy &amp; Answer Key
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--veritas-gold,#C29A52)]/20 text-[var(--veritas-burgundy,#5A1832)] border border-[var(--veritas-gold,#C29A52)]/40">
                  AI Editorial Review
                </span>
              </div>
              <p className="text-xs text-[#71685E] font-serif">
                Pre-publication fact-checking, answer-key verification, and curriculum consistency audit
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* BODY (SCROLLABLE)                                                 */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[#292521]">
          {/* Question Selector across chapter exercises */}
          {allChapterQuestions.length > 1 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC]">
              <ListFilter className="w-4 h-4 text-[#8C2435] shrink-0" />
              <label className="text-xs font-bold font-serif text-[#615546] shrink-0">
                Select Assessment Item:
              </label>
              <select
                value={selectedQId}
                onChange={(e) => setSelectedQId(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-xs bg-[#FFFDF9] border border-[#DDD0BC] rounded-lg px-2.5 py-1.5 text-[#292521] outline-none font-serif cursor-pointer disabled:opacity-50"
              >
                {allChapterQuestions.map((item) => (
                  <option key={item.question.id} value={item.question.id}>
                    Ex {item.exerciseLetter} &bull; Q{item.question.id} &bull;{' '}
                    {(item.question.prompt || item.question.originalSentence || 'Question item').slice(0, 75)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Context Badges (Board, Grade, Subject, Question Type) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-serif text-[#615546]">
            <span className="px-2.5 py-1 rounded-md bg-[#F2EAE0] border border-[#DDD0BC]">
              <strong className="text-[#5A1832]">Board:</strong> {chapter?.curriculumBoard || 'CISCE'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F2EAE0] border border-[#DDD0BC]">
              <strong className="text-[#5A1832]">Grade:</strong> {chapter?.equivalentClass || 'Class 6'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F2EAE0] border border-[#DDD0BC]">
              <strong className="text-[#5A1832]">Type:</strong> {questionType.toUpperCase()}
            </span>
            {marks !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-[#F2EAE0] border border-[#DDD0BC]">
                <strong className="text-[#5A1832]">Marks:</strong> {marks}
              </span>
            )}
            {chapter?.title && (
              <span className="px-2.5 py-1 rounded-md bg-[#F2EAE0] border border-[#DDD0BC] truncate max-w-xs">
                <strong className="text-[#5A1832]">Chapter:</strong> {chapter.title}
              </span>
            )}
          </div>

          {/* Question Prompt Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#615546] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8C2435]" />
                Question Prompt / Stem
              </label>
              <span className="text-[11px] text-[#7A6E5F] font-serif">
                Advisory audit &bull; Canonical data unchanged until applied
              </span>
            </div>

            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded-xl p-3 text-sm text-[#292521] font-serif outline-none focus:border-[#8C2435] focus:ring-1 focus:ring-[#8C2435] transition-all disabled:opacity-60"
              placeholder="Enter question stem or prompt..."
            />

            {/* MCQ Options Display if present */}
            {options.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#615546] block">
                  Multiple Choice Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.map((opt, oIdx) => {
                    const isKey = correctAnswer && correctAnswer.trim() === opt.trim();
                    return (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-serif ${
                          isKey
                            ? 'bg-[#EAF2DC] border-[#B2CE87] text-[#292521] font-semibold ring-1 ring-[#87A859]'
                            : 'bg-[#FFFDF9] border-[#DDD0BC] text-[#4A4237]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isKey ? 'bg-emerald-700 text-white' : 'bg-[#DDD0BC] text-[#615546]'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1 truncate">{opt}</span>
                        {isKey && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-1.5 py-0.5 rounded bg-white/80 border border-emerald-300">
                            Current Key
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Designated Answer Key Input/Display */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#615546] block">
                Designated Correct Answer / Model Key
              </label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                disabled={isLoading}
                placeholder="e.g. B. The subject must agree in number with the verb"
                className="w-full bg-[#FFFDF9] border border-[#DDD0BC] rounded-lg px-3 py-2 text-xs font-serif text-[#292521] outline-none focus:border-[#8C2435] focus:ring-1 focus:ring-[#8C2435] transition-all disabled:opacity-60"
              />
            </div>

            {/* Rationale if present */}
            {rationale && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E5F] block">
                  Author's Existing Rationale
                </label>
                <div className="p-2.5 rounded-lg bg-[#FAF6F0] border border-[#DDD0BC] text-xs font-serif text-[#4A4237] italic">
                  {rationale}
                </div>
              </div>
            )}
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 font-serif">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs space-y-1">
                <p className="font-bold text-rose-900">Audit Request Unsuccessful</p>
                <p className="text-rose-800">{errorMessage}</p>
                <p className="text-[11px] text-rose-700 italic">
                  The original question remains unaltered. You can retry with the button below.
                </p>
              </div>
            </div>
          )}

          {/* Applied Success Toast */}
          {appliedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2.5 text-emerald-900 font-serif animate-in fade-in duration-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">{appliedNotice}</span>
            </div>
          )}

          {/* =============================================================== */}
          {/* AUDIT RESULTS DISPLAY                                            */}
          {/* =============================================================== */}
          {auditResult && (
            <div className="space-y-4 pt-2 border-t border-[#DDD0BC] animate-in fade-in duration-200">
              {/* Header with Status, Confidence, and Answer Status */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC]">
                <div className="flex-1 min-w-[240px]">{getStatusBadge(auditResult.status)}</div>
                <div className="flex items-center gap-2 shrink-0">
                  {getAnswerStatusBadge(auditResult.answerStatus)}
                  {getConfidenceBadge(auditResult.confidence)}
                </div>
              </div>

              {/* Comprehensive Summary Explanation */}
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#DDD0BC] space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#8C2435]" />
                  Editorial Accuracy Finding
                </span>
                <p className="text-xs font-serif text-[#3D352E] leading-relaxed">
                  {auditResult.explanation}
                </p>
              </div>

              {/* Specific Findings List */}
              {auditResult.findings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#615546] flex items-center gap-1.5">
                    <SearchCheck className="w-4 h-4 text-[#8C2435]" />
                    Detected Factual, Distractor &amp; Key Issues ({auditResult.findings.length})
                  </h4>
                  <div className="space-y-2">
                    {auditResult.findings.map((finding: AccuracyAuditFinding, idx: number) => {
                      const sevBadge =
                        finding.severity === 'high' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                            High Severity
                          </span>
                        ) : finding.severity === 'medium' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            Medium Severity
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                            Low Severity
                          </span>
                        );

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#F8F4EC] border border-[#DDD0BC] space-y-1.5 text-xs font-serif"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#5A1832] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8C2435]" />
                              {finding.type}
                            </span>
                            {sevBadge}
                          </div>

                          {finding.excerpt && (
                            <div className="p-2 rounded bg-[#FFFDF9] border border-[#E5DAC8] text-[#5A1832] italic text-[11px]">
                              &ldquo;{finding.excerpt}&rdquo;
                            </div>
                          )}

                          <p className="text-[#4A4237] leading-relaxed">{finding.explanation}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* CURRENT VS PROPOSED COMPARISON CARDS                          */}
              {/* ============================================================= */}
              {(auditResult.suggestedAnswer || auditResult.suggestedQuestionRevision) && (
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A1832] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C29A52]" />
                    Proposed Editorial Corrections (Author Approval Required)
                  </h4>

                  {/* Answer Key Diff Comparison */}
                  {auditResult.suggestedAnswer && (
                    <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#C29A52]/50 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8C2435]">
                          Answer Key Correction
                        </span>
                        <span className="text-[11px] text-[#7A6E5F] font-serif">
                          Requires explicit author acceptance
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                            Current Answer Key
                          </span>
                          <p className="text-xs font-serif text-rose-950 font-medium">
                            {correctAnswer || '[None designated]'}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-300 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Proposed Verified Key
                          </span>
                          <p className="text-xs font-serif text-emerald-950 font-semibold">
                            {auditResult.suggestedAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Revision Diff Comparison */}
                  {auditResult.suggestedQuestionRevision && (
                    <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[#C29A52]/50 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8C2435]">
                          Question Stem Correction
                        </span>
                        <span className="text-[11px] text-[#7A6E5F] font-serif">
                          Resolves internal contradiction / factual error in stem
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                            Current Question Stem
                          </span>
                          <p className="text-xs font-serif text-rose-950">{questionText}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-300 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Proposed Revised Question Stem
                          </span>
                          <p className="text-xs font-serif text-emerald-950 font-medium">
                            {auditResult.suggestedQuestionRevision}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pedagogical / Academic Editorial Note */}
              {auditResult.editorialNote && (
                <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DDD0BC] flex items-start gap-2.5 text-xs font-serif text-[#4A4237]">
                  <GraduationCap className="w-4 h-4 text-[#8C2435] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#5A1832] block">Academic Editorial Note</span>
                    <p className="leading-relaxed">{auditResult.editorialNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* FOOTER ACTIONS (All buttons strictly 40-44px high)                */}
        {/* ================================================================= */}
        <div className="px-6 py-3 border-t border-[var(--veritas-parchment,#DDD0BC)] bg-[var(--veritas-parchment,#F6F0E7)] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Dismiss button */}
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isLoading || !auditResult}
              className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-xl font-serif text-xs font-semibold text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] border border-[#DDD0BC] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Dismiss
            </button>

            {/* Regenerate button */}
            {auditResult && (
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isLoading}
                className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-xl font-serif text-xs font-semibold text-[#5A1832] hover:bg-[#EDE4D6] border border-[#C29A52]/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Regenerate Audit</span>
              </button>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Granular Apply Buttons */}
            {auditResult && auditResult.suggestedQuestionRevision && auditResult.suggestedAnswer ? (
              <>
                <button
                  type="button"
                  onClick={() => handleApply('prompt')}
                  disabled={isLoading}
                  className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-xl font-serif text-xs font-semibold bg-[#EAF2DC] hover:bg-[#d8e6c3] text-emerald-900 border border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Apply only the question stem revision"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Apply Question Revision</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApply('answer')}
                  disabled={isLoading}
                  className="h-10 min-h-[40px] max-h-[44px] px-3.5 rounded-xl font-serif text-xs font-semibold bg-[#EAF2DC] hover:bg-[#d8e6c3] text-emerald-900 border border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Apply only the answer key correction"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Apply Answer Correction</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApply('both')}
                  disabled={isLoading}
                  className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-xl font-serif text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Apply both stem revision and answer key correction"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Apply Both Corrections</span>
                </button>
              </>
            ) : auditResult && auditResult.suggestedAnswer ? (
              <button
                type="button"
                onClick={() => handleApply('answer')}
                disabled={isLoading}
                className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-xl font-serif text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Apply Answer Correction</span>
              </button>
            ) : auditResult && auditResult.suggestedQuestionRevision ? (
              <button
                type="button"
                onClick={() => handleApply('prompt')}
                disabled={isLoading}
                className="h-10 min-h-[40px] max-h-[44px] px-4 rounded-xl font-serif text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Apply Question Revision</span>
              </button>
            ) : null}

            {/* Run Audit Button */}
            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isLoading || !questionText.trim()}
              className="h-10 min-h-[40px] max-h-[44px] px-5 rounded-xl font-serif text-xs font-bold bg-[var(--veritas-burgundy,#8C2435)] hover:bg-[#701C2A] text-[var(--veritas-parchment,#FFFDF9)] shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-[var(--veritas-gold,#F7E7CE)]" />
                  <span>Checking accuracy&hellip;</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[var(--veritas-gold,#F7E7CE)]" />
                  <span>Audit Accuracy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
