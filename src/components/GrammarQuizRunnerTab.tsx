import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
  Flag,
  AlertCircle,
  Check,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Filter,
  ArrowLeft,
  ChevronLeft,
  Info,
} from 'lucide-react';
import {
  GrammarTopic,
  GrammarQuestion,
  GrammarSeriesProject,
  GrammarClassLevel,
  QuizPracticeMode,
  QuizMasteryStatus,
  QuizAttemptRecord,
} from '../types';
import {
  evaluateStudentAnswer,
  getMasteryClassification,
  getMasteryBadgeStyles,
  generateLearningDiagnosis,
  saveQuizAttemptToStorage,
  getMistakeQuestionIdsForTopic,
  LearningDiagnosis,
} from '../utils/grammarQuizEngine';

interface GrammarQuizRunnerTabProps {
  topic: GrammarTopic;
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  selectedClass: GrammarClassLevel;
  onSelectClass?: (cls: GrammarClassLevel) => void;
  onSelectTopicId?: (topicId: string) => void;
}

export const GrammarQuizRunnerTab: React.FC<GrammarQuizRunnerTabProps> = ({
  topic,
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  selectedClass,
  onSelectClass,
  onSelectTopicId,
}) => {
  // 1. Collect all questions from current topic's exercises and test series (Source of truth: Question Bank)
  const allTopicQuestions: GrammarQuestion[] = useMemo(() => {
    const list: GrammarQuestion[] = [];
    const seenIds = new Set<string>();

    topic.exercises.forEach((ex) => {
      ex.questions.forEach((q) => {
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          list.push(q);
        }
      });
    });

    topic.testSeries.forEach((ts) => {
      ts.sections.forEach((s) => {
        s.questions.forEach((q) => {
          if (!seenIds.has(q.id)) {
            seenIds.add(q.id);
            list.push(q);
          }
        });
      });
    });

    return list;
  }, [topic]);

  // 2. Identify previously incorrect questions for this topic
  const pastMistakeIds = useMemo(() => {
    return getMistakeQuestionIdsForTopic(topic.id, seriesProject.quizHistory);
  }, [topic.id, seriesProject.quizHistory]);

  const mistakeQuestions = useMemo(() => {
    return allTopicQuestions.filter((q) => pastMistakeIds.includes(q.id));
  }, [allTopicQuestions, pastMistakeIds]);

  // Past attempts for this topic
  const topicHistory = useMemo(() => {
    return (seriesProject.quizHistory || []).filter((h) => h.unitId === topic.id);
  }, [seriesProject.quizHistory, topic.id]);

  // 3. Quiz State
  const [stage, setStage] = useState<'setup' | 'running' | 'results'>('setup');
  const [practiceMode, setPracticeMode] = useState<QuizPracticeMode>('standard');
  const [instantFeedbackEnabled, setInstantFeedbackEnabled] = useState(false);

  const [activeQuestions, setActiveQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  // Timing
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<any>(null);

  // Unanswered confirmation state
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);

  // Results & Review
  const [lastAttempt, setLastAttempt] = useState<QuizAttemptRecord | null>(null);
  const [diagnosis, setDiagnosis] = useState<LearningDiagnosis | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Reset when topic changes
  useEffect(() => {
    setStage('setup');
    setAnswers({});
    setFlaggedIds(new Set());
    setCurrentIdx(0);
    setSecondsElapsed(0);
    setShowUnansweredConfirm(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [topic.id]);

  // Timer effect during 'running'
  useEffect(() => {
    if (stage === 'running') {
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  // Format timer MM:SS
  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsElapsed / 60);
    const secs = secondsElapsed % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [secondsElapsed]);

  const activeQuestion: GrammarQuestion | undefined = activeQuestions[currentIdx];

  // Helper: Start Practice Session
  const handleStartPractice = (mode: QuizPracticeMode) => {
    let chosenQuestions: GrammarQuestion[] = [];

    if (mode === 'quick') {
      chosenQuestions = allTopicQuestions.slice(0, 5);
    } else if (mode === 'standard') {
      chosenQuestions = allTopicQuestions.slice(0, 10);
    } else if (mode === 'mistakes_only') {
      chosenQuestions = mistakeQuestions.length > 0 ? [...mistakeQuestions] : allTopicQuestions.slice(0, 5);
    } else {
      // full
      chosenQuestions = [...allTopicQuestions];
    }

    if (chosenQuestions.length === 0) {
      alert('No questions available in Question Bank for this unit.');
      return;
    }

    setPracticeMode(mode);
    setActiveQuestions(chosenQuestions);
    setAnswers({});
    setFlaggedIds(new Set());
    setCurrentIdx(0);
    setShowUnansweredConfirm(false);
    setStage('running');
  };

  // Helper: Flag/Unflag Question
  const handleToggleFlag = (qId: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) {
        next.delete(qId);
      } else {
        next.add(qId);
      }
      return next;
    });
  };

  // Helper: Answer Selection
  const handleUpdateAnswer = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  // Check unanswered count
  const unansweredCount = useMemo(() => {
    return activeQuestions.filter((q) => !answers[q.id]?.trim()).length;
  }, [activeQuestions, answers]);

  const answeredCount = activeQuestions.length - unansweredCount;
  const progressPercent = activeQuestions.length > 0 ? Math.round((answeredCount / activeQuestions.length) * 100) : 0;

  // Submit Handler
  const handleInitiateSubmit = () => {
    if (unansweredCount > 0) {
      setShowUnansweredConfirm(true);
    } else {
      handleFinalizeGrading();
    }
  };

  const handleFinalizeGrading = () => {
    setShowUnansweredConfirm(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate marks & evaluate each question objectively
    let totalPossibleMarks = 0;
    let earnedMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    const incorrectIds: string[] = [];
    const unansweredIds: string[] = [];

    const evalMap: Record<string, { isCorrect: boolean; marksAwarded: number }> = {};

    activeQuestions.forEach((q) => {
      totalPossibleMarks += q.marks;
      const userAns = answers[q.id] || '';
      if (!userAns.trim()) {
        unansweredIds.push(q.id);
      }

      const res = evaluateStudentAnswer(q, userAns);
      evalMap[q.id] = res;

      if (res.isCorrect) {
        earnedMarks += res.marksAwarded;
        correctCount += 1;
      } else {
        incorrectCount += 1;
        incorrectIds.push(q.id);
      }
    });

    const percentage =
      totalPossibleMarks > 0 ? Math.round((earnedMarks / totalPossibleMarks) * 100) : 0;
    const masteryStatus = getMasteryClassification(percentage);

    // Build Learning Diagnosis
    const diag = generateLearningDiagnosis(activeQuestions, answers, evalMap);
    setDiagnosis(diag);

    // Record attempt
    const record: QuizAttemptRecord = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      grade: topic.classLevel,
      unitId: topic.id,
      unitTitle: topic.title,
      practiceMode,
      questionIds: activeQuestions.map((q) => q.id),
      answers: { ...answers },
      marks: earnedMarks,
      totalMarks: totalPossibleMarks,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      dateTime: new Date().toISOString(),
      durationSeconds: secondsElapsed,
      incorrectQuestionIds: incorrectIds,
      unansweredQuestionIds: unansweredIds,
      masteryStatus,
    };

    setLastAttempt(record);
    saveQuizAttemptToStorage(record, seriesProject, onUpdateSeriesProject);
    setStage('results');
  };

  // Retry Entire Quiz
  const handleRetryEntireQuiz = () => {
    setAnswers({});
    setFlaggedIds(new Set());
    setCurrentIdx(0);
    setShowUnansweredConfirm(false);
    setStage('running');
  };

  // Practice Incorrect Answers
  const handlePracticeIncorrect = () => {
    if (!lastAttempt || lastAttempt.incorrectQuestionIds.length === 0) return;
    const missedQuestions = activeQuestions.filter((q) =>
      lastAttempt.incorrectQuestionIds.includes(q.id)
    );

    if (missedQuestions.length === 0) return;

    setPracticeMode('mistakes_only');
    setActiveQuestions(missedQuestions);
    setAnswers({});
    setFlaggedIds(new Set());
    setCurrentIdx(0);
    setShowUnansweredConfirm(false);
    setStage('running');
  };

  // ==========================================
  // VIEW 1: NO QUESTIONS EMPTY STATE
  // ==========================================
  if (allTopicQuestions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#191918] dark:text-[#f4f4f5]">
          No Questions Available for {topic.title}
        </h3>
        <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] max-w-md mt-1 mb-4">
          Add exercises or test series questions in the Question Bank or Curriculum Authoring Studio to activate this self-paced learning engine.
        </p>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: QUIZ SETUP SCREEN
  // ==========================================
  if (stage === 'setup') {
    const modes: Array<{
      id: QuizPracticeMode;
      title: string;
      desc: string;
      questionCount: number;
      disabled?: boolean;
      badge?: string;
    }> = [
      {
        id: 'quick',
        title: 'Quick Practice',
        desc: 'Rapid 5-question diagnostic drill targeting fundamental concord rules.',
        questionCount: Math.min(5, allTopicQuestions.length),
        badge: '5 Questions',
      },
      {
        id: 'standard',
        title: 'Standard Practice',
        desc: 'Balanced 10-question calibration spanning MCQ, error spotting, and transformation.',
        questionCount: Math.min(10, allTopicQuestions.length),
        badge: '10 Questions',
      },
      {
        id: 'full',
        title: 'Full Unit Practice',
        desc: 'Comprehensive marathon through all available exercise and test questions.',
        questionCount: allTopicQuestions.length,
        badge: `${allTopicQuestions.length} Questions`,
      },
      {
        id: 'mistakes_only',
        title: 'Mistakes Only',
        desc:
          mistakeQuestions.length > 0
            ? 'Targeted remediation reviewing previously missed questions.'
            : 'Review previously missed questions. (No past mistakes recorded for this unit yet)',
        questionCount: mistakeQuestions.length,
        disabled: mistakeQuestions.length === 0,
        badge: `${mistakeQuestions.length} Mistakes`,
      },
    ];

    return (
      <div id="quiz-setup-container" className="space-y-6">
        {/* Top Header */}
        <div className="p-6 sm:p-7 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#5A1832] text-[#F6F0E7]">
                {seriesProject.targetBoard} Syllabus
              </span>
              <span className="text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                {topic.classLevel}
              </span>
            </div>
            <span className="text-sm font-mono font-medium text-[#71685E] dark:text-[#c9b9a6]">
              {allTopicQuestions.length} Questions in Question Bank
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              {topic.title}
            </h2>
            <p className="text-base text-[#71685E] dark:text-[#c9b9a6] mt-1.5 leading-relaxed max-w-2xl">
              {topic.overview ||
                'Master grammar concord, syntactic transformation, and contextual sentence structure through guided practice.'}
            </p>
          </div>
        </div>

        {/* Practice Mode Selection */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6]">
              Select Practice Mode
            </h3>
            <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              Choose scope before commencing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {modes.map((m) => {
              const isSelected = practiceMode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (!m.disabled) setPracticeMode(m.id);
                  }}
                  className={`p-5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                    m.disabled
                      ? 'opacity-50 cursor-not-allowed border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6]/50 dark:bg-[#1e0f18]'
                      : isSelected
                      ? 'cursor-pointer border-[#5A1832] bg-[#EDE4D6] dark:bg-[#35101F] shadow-xs'
                      : 'cursor-pointer border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] hover:border-[#5A1832]/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {m.title}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                          isSelected
                            ? 'bg-[#5A1832] text-white'
                            : 'bg-[#EDE4D6] dark:bg-[#2b1622] text-[#71685E] dark:text-[#c9b9a6]'
                        }`}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-sm text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs pt-2.5 border-t border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60">
                    <span className="text-[#71685E] dark:text-[#c9b9a6]">
                      Est. Duration: ~{Math.max(2, Math.round(m.questionCount * 1.5))} mins
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected
                          ? 'text-[#5A1832] dark:text-[#C29A52]'
                          : 'text-[#71685E] dark:text-[#c9b9a6]'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Mode Configuration */}
        <div className="p-4 sm:p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-[#292521] dark:text-[#F6F0E7]">
              Instant Pedagogical Feedback
            </span>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              Reveal rationale immediately upon answering, or withhold until grading submission.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#EDE4D6] dark:bg-[#1e0f18] p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b]">
            <button
              onClick={() => setInstantFeedbackEnabled(false)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                !instantFeedbackEnabled
                  ? 'bg-white dark:bg-[#24111d] text-[#292521] dark:text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
              }`}
            >
              Standard Exam Mode
            </button>
            <button
              onClick={() => setInstantFeedbackEnabled(true)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                instantFeedbackEnabled
                  ? 'bg-[#5A1832] text-white shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521]'
              }`}
            >
              Practice Feedback Mode
            </button>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={() => handleStartPractice(practiceMode)}
            className="w-full py-4 rounded-xl text-base font-semibold bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] shadow-xs flex items-center justify-center space-x-2 transition-transform active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              Start {practiceMode === 'quick' ? 'Quick Practice (5 Qs)' : practiceMode === 'standard' ? 'Standard Practice (10 Qs)' : practiceMode === 'mistakes_only' ? `Mistakes Practice (${mistakeQuestions.length} Qs)` : 'Full Unit Practice'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Past Attempts on this Topic */}
        {topicHistory.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-[#e8e8e6] dark:border-[#28292d]">
            <div className="flex items-center justify-between text-xs font-bold text-[#6e6e6b] dark:text-[#9ca3af] uppercase tracking-wider">
              <span>Recent Topic Attempts</span>
              <span className="text-[10px] lowercase text-[#9c9c98]">
                {topicHistory.length} recorded
              </span>
            </div>
            <div className="space-y-1.5">
              {topicHistory.slice(0, 3).map((att) => {
                const styles = getMasteryBadgeStyles(att.masteryStatus);
                return (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#18191b] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                      <div>
                        <div className="font-semibold text-[#191918] dark:text-[#f4f4f5]">
                          {att.percentage}% • {att.marks} / {att.totalMarks} Marks
                        </div>
                        <div className="text-[10px] text-[#9c9c98]">
                          {new Date(att.dateTime).toLocaleDateString()} at{' '}
                          {new Date(att.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Mode: {att.practiceMode}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles.bg} ${styles.text} ${styles.border}`}
                    >
                      {att.masteryStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: RUNNING QUIZ SCREEN
  // ==========================================
  if (stage === 'running' && activeQuestion) {
    const isCurrentFlagged = flaggedIds.has(activeQuestion.id);
    const hasAnsweredCurrent = Boolean(answers[activeQuestion.id]?.trim());

    return (
      <div id="quiz-runner-running-container" className="space-y-6">
        {/* Top Progress & Banner */}
        <div className="p-4 sm:p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-bold text-[#292521] dark:text-[#F6F0E7]">
                Question {currentIdx + 1} of {activeQuestions.length}
              </span>
              <span className="text-sm text-[#71685E] dark:text-[#c9b9a6]">•</span>
              <span className="text-sm text-[#71685E] dark:text-[#c9b9a6]">
                Answered {answeredCount} / {activeQuestions.length}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#71685E] dark:text-[#c9b9a6] px-3 py-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
                <Clock className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                <span>{formattedTime}</span>
              </div>

              <button
                onClick={() => handleToggleFlag(activeQuestion.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isCurrentFlagged
                    ? 'border-[#5A1832] bg-[#5A1832]/15 text-[#5A1832] dark:text-[#C29A52]'
                    : 'border-[#CBBEAC] dark:border-[#4d2b3b] text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
                title="Flag for Review"
              >
                <Flag className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">
                  {isCurrentFlagged ? 'Flagged' : 'Flag for Review'}
                </span>
              </button>

              <button
                onClick={handleInitiateSubmit}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit for Grading</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#EDE4D6] dark:bg-[#1e0f18] overflow-hidden">
            <div
              className="h-full bg-[#5A1832] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Numbers Navigation Grid */}
        <div className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] flex flex-wrap items-center gap-2">
          {activeQuestions.map((q, qIndex) => {
            const isCurr = qIndex === currentIdx;
            const isAns = Boolean(answers[q.id]?.trim());
            const isFlg = flaggedIds.has(q.id);

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(qIndex)}
                className={`relative w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isCurr
                    ? 'bg-[#5A1832] text-white ring-2 ring-[#C29A52] shadow-xs'
                    : isFlg
                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-500'
                    : isAns
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-500/60'
                    : 'bg-white dark:bg-[#24111d] text-[#71685E] dark:text-[#c9b9a6] border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
                title={`Question ${qIndex + 1}${isFlg ? ' (Flagged)' : isAns ? ' (Answered)' : ' (Unanswered)'}`}
              >
                <span>{qIndex + 1}</span>
                {isFlg && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-[#1e0f18]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Unanswered Confirmation Prompt */}
        {showUnansweredConfirm && (
          <div className="p-4 sm:p-5 rounded-xl border-2 border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  Unanswered Questions Remaining
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Submit anyway?
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUnansweredConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#24111d] border border-amber-400 text-[#292521] dark:text-[#F6F0E7] hover:bg-amber-50 cursor-pointer"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleFinalizeGrading}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white shadow-xs cursor-pointer"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        )}

        {/* Active Question Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] shadow-xs space-y-5">
          {/* Card Top Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 pb-3.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-bold text-[#5A1832] dark:text-[#C29A52]">
                Question #{currentIdx + 1}
              </span>
              <span className="text-xs font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#71685E] dark:text-[#c9b9a6]">
                {activeQuestion.type.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                {activeQuestion.marks} Mark{activeQuestion.marks > 1 ? 's' : ''}
              </span>
              {activeQuestion.conceptTested && (
                <span className="hidden md:inline text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
                  • {activeQuestion.conceptTested}
                </span>
              )}
            </div>

            {hasAnsweredCurrent && (
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Answer Saved</span>
              </span>
            )}
          </div>

          {/* Prompt: 17.5px */}
          <div className="text-[17.5px] font-serif font-bold text-[#292521] dark:text-[#F6F0E7] leading-relaxed break-words">
            {activeQuestion.prompt}
          </div>

          {/* Instruction */}
          {activeQuestion.instruction && (
            <div className="text-sm italic text-[#71685E] dark:text-[#c9b9a6] bg-[#EDE4D6]/50 dark:bg-[#1e0f18] px-3.5 py-2.5 rounded-lg border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
              ↳ {activeQuestion.instruction}
            </div>
          )}

          {/* Question Interface by Type */}

          {/* 1. MCQ: 16px options */}
          {activeQuestion.type === 'mcq' && activeQuestion.options && (
            <div className="space-y-3 pt-1">
              {activeQuestion.options.map((opt, oIdx) => {
                const isSelected = answers[activeQuestion.id] === opt;
                return (
                  <label
                    key={oIdx}
                    onClick={() => handleUpdateAnswer(activeQuestion.id, opt)}
                    className={`p-4 rounded-xl border text-base font-serif flex items-start space-x-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#5A1832] bg-[#EDE4D6] dark:bg-[#35101F] font-semibold text-[#292521] dark:text-[#F6F0E7]'
                        : 'border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`mcq-${activeQuestion.id}`}
                      checked={isSelected}
                      onChange={() => handleUpdateAnswer(activeQuestion.id, opt)}
                      className="accent-[#5A1832] w-4 h-4 mt-1 shrink-0"
                    />
                    <span className="leading-relaxed break-words">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* 2. Fill in the Blank */}
          {activeQuestion.type === 'fill_in_blanks' && (
            <div className="space-y-4 p-5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              {activeQuestion.blanksSentence && (
                <div className="text-base sm:text-lg font-serif leading-relaxed text-[#292521] dark:text-[#F6F0E7] break-words">
                  {activeQuestion.blanksSentence}
                </div>
              )}

              {activeQuestion.hints && (
                <div className="text-sm text-[#5A1832] dark:text-[#C29A52] font-medium bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60">
                  <strong>Options / Hint:</strong> {activeQuestion.hints}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                  Type your missing answer:
                </label>
                <input
                  type="text"
                  placeholder="Enter word..."
                  value={answers[activeQuestion.id] || ''}
                  onChange={(e) => handleUpdateAnswer(activeQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] text-base text-[#292521] dark:text-[#F6F0E7] font-serif focus:outline-none focus:ring-2 focus:ring-[#5A1832]"
                />
              </div>
            </div>
          )}

          {/* 3. Error Correction */}
          {activeQuestion.type === 'error_correction' && (
            <div className="space-y-4 p-5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              {activeQuestion.originalSentence && (
                <div className="p-4 rounded-lg border-l-4 border-[#5A1832] bg-white dark:bg-[#24111d] border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#71685E] dark:text-[#c9b9a6] block mb-1">
                    Sentence with Error
                  </span>
                  <div className="text-base font-serif italic text-[#292521] dark:text-[#F6F0E7] leading-relaxed break-words">
                    "{activeQuestion.originalSentence}"
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                  Enter corrected word or full sentence:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. was -> were OR type the full corrected sentence..."
                  value={answers[activeQuestion.id] || ''}
                  onChange={(e) => handleUpdateAnswer(activeQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] text-base text-[#292521] dark:text-[#F6F0E7] font-serif focus:outline-none focus:ring-2 focus:ring-[#5A1832] resize-y"
                />
              </div>
            </div>
          )}

          {/* 4. Transformation */}
          {activeQuestion.type === 'transformation' && (
            <div className="space-y-4 p-5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
              {activeQuestion.originalSentence && (
                <div className="p-4 rounded-lg border-l-4 border-[#5A1832] bg-white dark:bg-[#24111d] border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#71685E] dark:text-[#c9b9a6] block mb-1">
                    Original Sentence
                  </span>
                  <div className="text-base font-serif text-[#292521] dark:text-[#F6F0E7] leading-relaxed break-words">
                    {activeQuestion.originalSentence}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                  Type your transformed sentence:
                </label>
                <textarea
                  rows={2}
                  placeholder="Write complete transformed sentence adhering to instructions..."
                  value={answers[activeQuestion.id] || ''}
                  onChange={(e) => handleUpdateAnswer(activeQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] text-base text-[#292521] dark:text-[#F6F0E7] font-serif focus:outline-none focus:ring-2 focus:ring-[#5A1832] resize-y"
                />
              </div>
            </div>
          )}

          {/* Instant Feedback View (if enabled) */}
          {instantFeedbackEnabled && hasAnsweredCurrent && (
            <div className="p-4.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-sm space-y-1.5 animate-in fade-in">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Practice Feedback Mode Active</span>
              </div>
              <p className="text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                <strong>Pedagogical Hint / Rationale:</strong> {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Bottom Prev / Next Nav */}
          <div className="flex items-center justify-between pt-5 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="h-10 px-4 rounded-lg text-sm font-semibold border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-mono hidden sm:inline">
              Q{currentIdx + 1} of {activeQuestions.length}
            </div>

            {currentIdx < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="h-10 px-4 rounded-lg text-sm font-semibold bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleInitiateSubmit}
                className="h-10 px-4 rounded-lg text-sm font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center space-x-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Finish &amp; Submit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: RESULTS & MASTERY DASHBOARD
  // ==========================================
  if (stage === 'results' && lastAttempt) {
    const styles = getMasteryBadgeStyles(lastAttempt.masteryStatus);

    // Build question list with detailed evaluations
    const reviewedQuestions = activeQuestions.map((q) => {
      const userAns = lastAttempt.answers[q.id] || '';
      const evalRes = evaluateStudentAnswer(q, userAns);
      const isUnans = !userAns.trim();
      return {
        question: q,
        userAnswer: userAns,
        isCorrect: evalRes.isCorrect,
        marksAwarded: evalRes.marksAwarded,
        isUnanswered: isUnans,
      };
    });

    const filteredReviewed = reviewedQuestions.filter((item) => {
      if (reviewFilter === 'incorrect') return !item.isCorrect;
      if (reviewFilter === 'correct') return item.isCorrect;
      return true;
    });

    return (
      <div id="quiz-results-container" className="space-y-6">
        {/* Results Banner */}
        <div className={`p-6 sm:p-7 rounded-2xl border-2 ${styles.border} ${styles.bg} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#24111d] border border-[#CBBEAC] dark:border-[#4d2b3b] shadow-xs flex items-center justify-center text-[#5A1832] dark:text-[#C29A52]">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${styles.bg} ${styles.text} ${styles.border}`}
                  >
                    {lastAttempt.masteryStatus}
                  </span>
                  <span className="text-sm text-[#71685E] dark:text-[#c9b9a6]">
                    {topic.classLevel} • {topic.title}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
                  Practice Assessment Graded
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-black font-serif text-[#292521] dark:text-[#F6F0E7]">
                {lastAttempt.percentage}%
              </div>
              <div className="text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                Score: {lastAttempt.marks} / {lastAttempt.totalMarks} Marks
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#24111d]/80 border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <span className="text-xs uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] block">Correct</span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                {lastAttempt.correctCount} / {activeQuestions.length}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#24111d]/80 border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <span className="text-xs uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] block">Incorrect</span>
              <span className="text-base font-bold text-rose-700 dark:text-rose-400">
                {lastAttempt.incorrectCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#24111d]/80 border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <span className="text-xs uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] block">Unanswered</span>
              <span className="text-base font-bold text-[#71685E] dark:text-[#c9b9a6]">
                {lastAttempt.unansweredCount}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#24111d]/80 border border-[#CBBEAC] dark:border-[#4d2b3b]">
              <span className="text-xs uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] block">Time Taken</span>
              <span className="text-base font-bold text-[#292521] dark:text-[#F6F0E7] font-mono">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Learning Diagnosis Card */}
        {diagnosis && (
          <div className="p-6 sm:p-7 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <BrainCircuit className="w-5 h-5 text-[#5A1832] dark:text-[#C29A52]" />
                <h4 className="text-base font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Learning Diagnosis &amp; Concept Breakdown
                </h4>
              </div>
              <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                Overall Mastery: {diagnosis.overallPercentage}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strong Concepts */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Strong Mastery Areas</span>
                </div>
                {diagnosis.strongConcepts.length > 0 ? (
                  <ul className="space-y-2 pl-1">
                    {diagnosis.strongConcepts.map((sc, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold text-emerald-600">✓</span>
                        <span>
                          {sc.name} ({sc.accuracy}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-500 dark:text-slate-400 italic">
                    Focus on foundational drills to establish baseline mastery.
                  </p>
                )}
              </div>

              {/* Needs Practice Concepts */}
              <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-500/30 space-y-2.5">
                <div className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Needs Remediation &amp; Practice</span>
                </div>
                {diagnosis.needsPracticeConcepts.length > 0 ? (
                  <ul className="space-y-2 pl-1">
                    {diagnosis.needsPracticeConcepts.map((nc, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-amber-950 dark:text-amber-200">
                        <span className="font-bold text-amber-600">•</span>
                        <span>
                          {nc.name} ({nc.accuracy}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
                    No major weak areas detected on this attempt!
                  </p>
                )}
              </div>
            </div>

            {/* Targeted Recommendations */}
            {diagnosis.recommendations.length > 0 && (
              <div className="p-4 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#1e0f18] border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 text-sm space-y-2">
                <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                  Targeted Pedagogical Recommendations:
                </span>
                <div className="space-y-1.5 text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  {diagnosis.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="flex items-start space-x-2">
                      <span className="text-[#5A1832] dark:text-[#C29A52] font-bold shrink-0">→</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-xl bg-white dark:bg-[#24111d] border border-[#CBBEAC] dark:border-[#4d2b3b] shadow-xs">
          <button
            onClick={() => setStage('setup')}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] flex items-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Unit Setup</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRetryEntireQuiz}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] flex items-center space-x-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
              <span>Retry Entire Quiz</span>
            </button>

            <button
              onClick={handlePracticeIncorrect}
              disabled={lastAttempt.incorrectCount === 0}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-xs transition-colors ${
                lastAttempt.incorrectCount > 0
                  ? 'bg-[#5A1832] hover:bg-[#35101F] text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {lastAttempt.incorrectCount > 0
                  ? `Practice Incorrect Answers (${lastAttempt.incorrectCount})`
                  : 'All Mastered! (0 Mistakes)'}
              </span>
            </button>
          </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Review Questions &amp; Answer Keys ({reviewedQuestions.length})
            </h4>

            {/* Filter */}
            <div className="flex items-center space-x-1.5 bg-[#EDE4D6] dark:bg-[#1e0f18] p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-md font-semibold ${
                  reviewFilter === 'all'
                    ? 'bg-white dark:bg-[#24111d] text-[#292521] dark:text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                All ({reviewedQuestions.length})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1.5 rounded-md font-semibold ${
                  reviewFilter === 'incorrect'
                    ? 'bg-white dark:bg-[#24111d] text-rose-700 dark:text-rose-400 shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                Incorrect ({lastAttempt.incorrectCount})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1.5 rounded-md font-semibold ${
                  reviewFilter === 'correct'
                    ? 'bg-white dark:bg-[#24111d] text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                Correct ({lastAttempt.correctCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReviewed.map((item, idx) => {
              const q = item.question;
              return (
                <div
                  key={q.id}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all text-sm space-y-3.5 ${
                    item.isCorrect
                      ? 'border-emerald-500/30 bg-emerald-50/25 dark:bg-emerald-950/15'
                      : item.isUnanswered
                      ? 'border-stone-300 dark:border-stone-700 bg-white dark:bg-[#24111d]'
                      : 'border-rose-500/30 bg-rose-50/25 dark:bg-rose-950/15'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-[#292521] dark:text-[#F6F0E7]">
                        Question #{idx + 1}
                      </span>
                      <span className="text-xs font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#71685E] dark:text-[#c9b9a6]">
                        {q.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                        {q.marks} Mark{q.marks > 1 ? 's' : ''}
                      </span>
                      {q.conceptTested && (
                        <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] italic hidden sm:inline">
                          • {q.conceptTested}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold">
                        Awarded: {item.marksAwarded} / {q.marks}
                      </span>
                      {item.isCorrect ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : item.isUnanswered ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300">
                          Unanswered
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prompt */}
                  <div className="font-serif font-bold text-[16.5px] text-[#292521] dark:text-[#F6F0E7] leading-snug break-words">
                    {q.prompt}
                  </div>

                  {q.originalSentence && (
                    <div className="italic text-base text-[#71685E] dark:text-[#c9b9a6] bg-white/70 dark:bg-[#1e0f18] p-3 rounded-lg border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50">
                      "{q.originalSentence}"
                    </div>
                  )}

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] block mb-1">
                        Your Submitted Answer
                      </span>
                      <div
                        className={`font-mono text-sm break-words ${
                          item.isCorrect
                            ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                            : item.isUnanswered
                            ? 'text-stone-400 italic'
                            : 'text-rose-700 dark:text-rose-400 font-semibold'
                        }`}
                      >
                        {item.userAnswer ? item.userAnswer : '(No answer submitted)'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b]">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                        Official Answer Key
                      </span>
                      <div className="font-mono text-sm text-emerald-800 dark:text-emerald-300 break-words font-semibold">
                        {q.correctAnswer}
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-[#1e0f18]/70 border border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60 text-sm leading-relaxed text-[#71685E] dark:text-[#c9b9a6]">
                      <strong className="text-[#292521] dark:text-[#F6F0E7]">Grammar Rationale:</strong>{' '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
