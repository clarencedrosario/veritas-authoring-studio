import React, { useState, useEffect } from 'react';
import {
  ScanSearch,
  SearchCheck,
  CircleCheckBig,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  X,
  RotateCcw,
  Check,
  ArrowRight,
  HelpCircle,
  BookOpen,
  GraduationCap,
  ListFilter,
} from 'lucide-react';
import {
  GrammarQuestion,
  StudioChapter,
  ClarityAuditResult,
  ClarityAuditIssue,
  ClarityAuditStatus,
} from '../../types';
import { auditQuestionClarity } from '../../utils/clarityAuditApi';

export interface AuditClarityModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter?: StudioChapter | null;
  targetQuestion?: GrammarQuestion | null;
  onApplyRevision?: (revisedText: string, questionId?: string) => void;
  isDarkMode?: boolean;
}

export const AuditClarityModal: React.FC<AuditClarityModalProps> = ({
  isOpen,
  onClose,
  chapter,
  targetQuestion,
  onApplyRevision,
  isDarkMode = false,
}) => {
  // Collect all available questions from chapter exercises
  const allChapterQuestions = React.useMemo(() => {
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

  // Selected question state
  const [selectedQId, setSelectedQId] = useState<string>(
    targetQuestion?.id || allChapterQuestions[0]?.question.id || ''
  );

  // Active question being inspected/audited
  const currentQ = React.useMemo(() => {
    if (targetQuestion && targetQuestion.id === selectedQId) return targetQuestion;
    const found = allChapterQuestions.find((item) => item.question.id === selectedQId);
    return found?.question || targetQuestion || null;
  }, [selectedQId, targetQuestion, allChapterQuestions]);

  // Editable question text for audit query
  const [questionText, setQuestionText] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [questionType, setQuestionType] = useState<string>('mcq');

  // Audit results & loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<ClarityAuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  // Synchronize with selected question
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
      setAuditResult(null);
      setErrorMessage(null);
      setAppliedSuccess(false);
    }
  }, [currentQ]);

  if (!isOpen) return null;

  // Execute clarity audit
  const handleRunAudit = async () => {
    if (isLoading) return; // Prevent duplicate requests while running
    if (!questionText.trim()) {
      setErrorMessage('Please provide question text to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setAppliedSuccess(false);

    try {
      const result = await auditQuestionClarity({
        questionText: questionText.trim(),
        questionType,
        options: options.filter((o) => o && o.trim()),
        correctAnswer: correctAnswer.trim(),
        board: chapter?.curriculumBoard || 'CISCE',
        grade: chapter?.equivalentClass || 'Class 6',
        subject: chapter?.category || 'English Language & Grammar',
        chapter: chapter?.title,
        learningObjective: chapter?.opening?.learningObjectives?.[0],
      });

      setAuditResult(result);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Failed to complete clarity audit. The original question remains unchanged.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Apply suggestion handler
  const handleApplySuggestion = () => {
    if (!auditResult?.suggestedRevision) return;
    const revised = auditResult.suggestedRevision.trim();
    if (!revised) return;

    // Update local preview
    setQuestionText(revised);

    // Call parent handler to update question text in canonical state
    if (onApplyRevision) {
      onApplyRevision(revised, currentQ?.id);
    }

    setAppliedSuccess(true);
  };

  // Dismiss audit findings
  const handleDismiss = () => {
    setAuditResult(null);
    setErrorMessage(null);
    setAppliedSuccess(false);
  };

  // Severity style helper
  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            High Severity
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Medium Severity
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
            Low Severity
          </span>
        );
    }
  };

  // Status badge styling
  const getStatusBadge = (status: ClarityAuditStatus) => {
    switch (status) {
      case 'CLEAR':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-serif">
            <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider">CLEAR</span>
              <span className="text-[11px] text-emerald-700 ml-2 hidden sm:inline">
                No meaningful ambiguity or clarity issues detected.
              </span>
            </div>
          </div>
        );
      case 'MINOR_REVIEW':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-serif">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider">MINOR REVIEW</span>
              <span className="text-[11px] text-amber-800 ml-2 hidden sm:inline">
                Minor phrasing or distractor improvements recommended.
              </span>
            </div>
          </div>
        );
      case 'NEEDS_REVISION':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-300 text-red-950 font-serif">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-rose-900">
                NEEDS REVISION
              </span>
              <span className="text-[11px] text-rose-800 ml-2 hidden sm:inline">
                Substantive ambiguity, multiple correct answers, or flawed stems identified.
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-[var(--veritas-parchment,#DDD0BC)] bg-[#FFFDF9] overflow-hidden"
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
              <ScanSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-[var(--veritas-burgundy,#5A1832)] tracking-tight">
                  Audit Clarity
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--veritas-gold,#C29A52)]/20 text-[var(--veritas-burgundy,#5A1832)] border border-[var(--veritas-gold,#C29A52)]/40">
                  AI Editorial Review
                </span>
              </div>
              <p className="text-xs text-[#71685E] font-serif">
                Pre-publication evaluation of assessment clarity, distractor plausibility, and linguistic precision
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
          {/* Question Selector if multiple chapter questions exist */}
          {allChapterQuestions.length > 1 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC]">
              <ListFilter className="w-4 h-4 text-[#8C2435] shrink-0" />
              <label className="text-xs font-bold font-serif text-[#615546] shrink-0">
                Select Question Item:
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

          {/* Question Prompt Editor & Metadata Context */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#615546] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#8C2435]" />
                Assessment Question Stem / Prompt
              </label>
              <span className="text-[11px] text-[#7A6E5F] font-serif">
                Original text will not be changed automatically
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

            {/* MCQ Options Display if applicable */}
            {options.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#615546] block">
                  Multiple Choice Options & Answer Key
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.map((opt, oIdx) => {
                    const isKey = correctAnswer && correctAnswer === opt;
                    return (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-serif ${
                          isKey
                            ? 'bg-[#EAF2DC] border-[#B2CE87] text-[#292521] font-semibold'
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
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 px-1.5 py-0.5 rounded bg-white/70">
                            Key
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Error Message Banner if error occurs */}
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
          {appliedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-2.5 text-emerald-900 font-serif animate-in fade-in duration-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">
                Suggested revision successfully applied to question text!
              </span>
            </div>
          )}

          {/* =============================================================== */}
          {/* AUDIT RESULTS SECTION                                           */}
          {/* =============================================================== */}
          {auditResult && (
            <div className="space-y-4 pt-2 border-t border-[#DDD0BC] animate-in fade-in duration-200">
              {/* Overall Status Badge */}
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(auditResult.status)}</div>
                <span className="text-xs text-[#71685E] font-serif">
                  {auditResult.issues.length} {auditResult.issues.length === 1 ? 'issue' : 'issues'} flagged
                </span>
              </div>

              {/* Detected Issues List */}
              {auditResult.issues.length > 0 ? (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#615546] flex items-center gap-1.5">
                    <SearchCheck className="w-4 h-4 text-[#8C2435]" />
                    Detected Clarity & Pedagogical Issues
                  </h4>
                  <div className="space-y-2">
                    {auditResult.issues.map((issue: ClarityAuditIssue, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#F6F0E7] border border-[#DDD0BC] space-y-1.5 text-xs font-serif"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#5A1832] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8C2435]" />
                            {issue.type}
                          </span>
                          {getSeverityBadge(issue.severity)}
                        </div>

                        {issue.excerpt && (
                          <div className="p-2 rounded bg-[#FFFDF9] border border-[#E5DAC8] text-[#5A1832] italic text-[11px]">
                            &ldquo;{issue.excerpt}&rdquo;
                          </div>
                        )}

                        <p className="text-[#4A4237] leading-relaxed">{issue.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-emerald-900 font-serif">
                  <CircleCheckBig className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs">
                    The question stem, instructions, and distractors meet all clarity standards. No revisions are required.
                  </p>
                </div>
              )}

              {/* Suggested Revision Box */}
              {auditResult.suggestedRevision && (
                <div className="p-4 rounded-xl bg-[#FFFDF9] border-2 border-[var(--veritas-gold,#C29A52)]/50 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C2435] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[var(--veritas-gold,#C29A52)]" />
                      Suggested Revised Question
                    </span>
                    <span className="text-[11px] text-[#7A6E5F] font-serif">
                      Requires explicit author confirmation
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#FAF6F0] border border-[#E0D4C3] text-sm font-serif text-[#292521] leading-relaxed">
                    {auditResult.suggestedRevision}
                  </div>
                </div>
              )}

              {/* Pedagogical Note */}
              {auditResult.pedagogicalNote && (
                <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DDD0BC] flex items-start gap-2.5 text-xs font-serif text-[#4A4237]">
                  <GraduationCap className="w-4 h-4 text-[#8C2435] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#5A1832] block">Pedagogical Note</span>
                    <p className="leading-relaxed">{auditResult.pedagogicalNote}</p>
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
                <span>Regenerate Suggestion</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Apply Suggestion button */}
            {auditResult?.suggestedRevision && (
              <button
                type="button"
                onClick={handleApplySuggestion}
                disabled={isLoading || appliedSuccess}
                className="h-10 min-h-[40px] max-h-[44px] px-5 rounded-xl font-serif text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Apply Suggestion</span>
              </button>
            )}

            {/* Audit Clarity button */}
            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isLoading || !questionText.trim()}
              className="h-10 min-h-[40px] max-h-[44px] px-5 rounded-xl font-serif text-xs font-bold bg-[var(--veritas-burgundy,#8C2435)] hover:bg-[#701C2A] text-[var(--veritas-parchment,#FFFDF9)] shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-[var(--veritas-gold,#F7E7CE)]" />
                  <span>Auditing clarity&hellip;</span>
                </>
              ) : (
                <>
                  <ScanSearch className="w-4 h-4 text-[var(--veritas-gold,#F7E7CE)]" />
                  <span>Audit Clarity</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
