import {
  GrammarQuestion,
  QuizAttemptRecord,
  QuizMasteryStatus,
  QuizPracticeMode,
  GrammarClassLevel,
  GrammarSeriesProject,
} from '../types';

const STORAGE_KEY = 'veritas_grammar_quiz_history_v1';

/**
 * Normalizes text for clean semantic comparison across punctuation, casing, and whitespace.
 */
export function normalizeAnswerText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Objectively evaluates a student's answer against Question Bank answer keys.
 * Does not invent keys; evaluates MCQ, Fill-in-the-blank, Error Correction, and Transformation.
 */
export function evaluateStudentAnswer(
  question: GrammarQuestion,
  rawAnswer: string
): { isCorrect: boolean; marksAwarded: number } {
  const trimmed = (rawAnswer || '').trim();
  if (!trimmed) {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const userClean = normalizeAnswerText(trimmed);

  if (question.type === 'mcq') {
    const correctClean = normalizeAnswerText(question.correctAnswer);

    // Exact normalized match (e.g. "b leads" === "b leads" or "leads" === "leads")
    if (userClean === correctClean) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    // Strip leading option letter prefix like "a", "b", "c", "d"
    const correctWithoutLetter = correctClean.replace(/^[a-d]\s*/, '').trim();
    const userWithoutLetter = userClean.replace(/^[a-d]\s*/, '').trim();
    if (userWithoutLetter && correctWithoutLetter && userWithoutLetter === correctWithoutLetter) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    // Direct match with letter prefix (e.g. user selected "B) leads" and correctAnswer has "B")
    const userLetterMatch = trimmed.match(/^([A-Da-d])[\)\.]?/);
    const correctLetterMatch = question.correctAnswer.match(/^([A-Da-d])[\)\.]?/);
    if (userLetterMatch && correctLetterMatch) {
      if (userLetterMatch[1].toLowerCase() === correctLetterMatch[1].toLowerCase()) {
        return { isCorrect: true, marksAwarded: question.marks };
      }
    }

    // Check if user answer string contains the core option content or vice versa
    if (correctWithoutLetter && (userClean.includes(correctWithoutLetter) || correctWithoutLetter.includes(userClean))) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    return { isCorrect: false, marksAwarded: 0 };
  }

  if (question.type === 'fill_in_blanks') {
    const candidateList = [
      question.correctAnswer,
      ...(question.acceptableAnswers || []),
    ].map(normalizeAnswerText);

    if (candidateList.includes(userClean)) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    // Handle single-word answer inside brackets like "(was / were)"
    for (const cand of candidateList) {
      if (cand && (userClean === cand || userClean.startsWith(cand + ' ') || userClean.endsWith(' ' + cand))) {
        return { isCorrect: true, marksAwarded: question.marks };
      }
    }

    return { isCorrect: false, marksAwarded: 0 };
  }

  if (question.type === 'error_correction') {
    const correctClean = normalizeAnswerText(question.correctAnswer);
    const correctedSentenceClean = question.correctedSentence
      ? normalizeAnswerText(question.correctedSentence)
      : '';

    // Full match with correct answer or corrected sentence
    if (userClean === correctClean || (correctedSentenceClean && userClean === correctedSentenceClean)) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    // Check key correction snippet
    if (question.correctionSnippet) {
      const snipClean = normalizeAnswerText(question.correctionSnippet);
      if (snipClean && (userClean === snipClean || userClean.includes(snipClean))) {
        return { isCorrect: true, marksAwarded: question.marks };
      }
    }

    // Check if error correction instructions say "Change X to Y"
    const targetWordMatch = question.correctAnswer.match(/to\s+["']?([a-zA-Z]+)["']?/i);
    if (targetWordMatch) {
      const targetWord = normalizeAnswerText(targetWordMatch[1]);
      if (targetWord && userClean === targetWord) {
        return { isCorrect: true, marksAwarded: question.marks };
      }
    }

    // If student wrote the whole corrected sentence correctly
    if (correctedSentenceClean) {
      if (userClean.replace(/\s+/g, '') === correctedSentenceClean.replace(/\s+/g, '')) {
        return { isCorrect: true, marksAwarded: question.marks };
      }
    }

    return { isCorrect: false, marksAwarded: 0 };
  }

  if (question.type === 'transformation') {
    const correctClean = normalizeAnswerText(question.correctAnswer);
    const correctedSentenceClean = question.correctedSentence
      ? normalizeAnswerText(question.correctedSentence)
      : '';

    if (userClean === correctClean || (correctedSentenceClean && userClean === correctedSentenceClean)) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    // Compare sans punctuation and spaces
    const noPunctUser = userClean.replace(/\s+/g, '');
    const noPunctCorrect = correctClean.replace(/\s+/g, '');
    if (noPunctUser === noPunctCorrect) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    if (correctedSentenceClean && noPunctUser === correctedSentenceClean.replace(/\s+/g, '')) {
      return { isCorrect: true, marksAwarded: question.marks };
    }

    return { isCorrect: false, marksAwarded: 0 };
  }

  if (question.type === 'match_column') {
    const correctClean = normalizeAnswerText(question.correctAnswer);
    if (userClean === correctClean || userClean.replace(/\s+/g, '') === correctClean.replace(/\s+/g, '')) {
      return { isCorrect: true, marksAwarded: question.marks };
    }
    return { isCorrect: false, marksAwarded: 0 };
  }

  return { isCorrect: false, marksAwarded: 0 };
}

/**
 * Standard VERITAS Mastery Classification:
 * 90–100% = Mastered
 * 75–89% = Proficient
 * 60–74% = Developing
 * Below 60% = Needs Practice
 */
export function getMasteryClassification(percentage: number): QuizMasteryStatus {
  if (percentage >= 90) return 'Mastered';
  if (percentage >= 75) return 'Proficient';
  if (percentage >= 60) return 'Developing';
  return 'Needs Practice';
}

export function getMasteryBadgeStyles(status: QuizMasteryStatus): {
  bg: string;
  border: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'Mastered':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-500/30 dark:border-emerald-600/50',
        text: 'text-emerald-800 dark:text-emerald-300',
        dot: 'bg-emerald-600 dark:bg-emerald-400',
      };
    case 'Proficient':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        border: 'border-teal-500/30 dark:border-teal-600/50',
        text: 'text-teal-800 dark:text-teal-300',
        dot: 'bg-teal-600 dark:bg-teal-400',
      };
    case 'Developing':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-500/30 dark:border-amber-600/50',
        text: 'text-amber-800 dark:text-amber-300',
        dot: 'bg-amber-600 dark:bg-amber-400',
      };
    case 'Needs Practice':
    default:
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-500/30 dark:border-rose-600/50',
        text: 'text-rose-800 dark:text-rose-300',
        dot: 'bg-rose-600 dark:bg-rose-400',
      };
  }
}

export interface ConceptDiagnosisItem {
  name: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracy: number;
  isStrong: boolean;
  recommendations: string[];
}

export interface LearningDiagnosis {
  overallPercentage: number;
  masteryStatus: QuizMasteryStatus;
  strongConcepts: ConceptDiagnosisItem[];
  needsPracticeConcepts: ConceptDiagnosisItem[];
  recommendations: string[];
}

/**
 * Generates an educational Learning Diagnosis breaking down performance by grammar concept.
 */
export function generateLearningDiagnosis(
  questions: GrammarQuestion[],
  answers: Record<string, string>,
  evaluationMap: Record<string, { isCorrect: boolean; marksAwarded: number }>
): LearningDiagnosis {
  const conceptGroups: Record<
    string,
    {
      totalMarks: number;
      earnedMarks: number;
      totalCount: number;
      correctCount: number;
      missedExplanations: string[];
    }
  > = {};

  let totalPossible = 0;
  let totalEarned = 0;

  questions.forEach((q) => {
    const rawConcept = q.conceptTested?.trim() || getFallbackConcept(q);
    if (!conceptGroups[rawConcept]) {
      conceptGroups[rawConcept] = {
        totalMarks: 0,
        earnedMarks: 0,
        totalCount: 0,
        correctCount: 0,
        missedExplanations: [],
      };
    }

    const evalResult = evaluationMap[q.id] || { isCorrect: false, marksAwarded: 0 };
    conceptGroups[rawConcept].totalMarks += q.marks;
    conceptGroups[rawConcept].earnedMarks += evalResult.marksAwarded;
    conceptGroups[rawConcept].totalCount += 1;
    totalPossible += q.marks;
    totalEarned += evalResult.marksAwarded;

    if (evalResult.isCorrect) {
      conceptGroups[rawConcept].correctCount += 1;
    } else {
      if (q.explanation) {
        conceptGroups[rawConcept].missedExplanations.push(q.explanation);
      }
    }
  });

  const overallPercentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  const masteryStatus = getMasteryClassification(overallPercentage);

  const strongConcepts: ConceptDiagnosisItem[] = [];
  const needsPracticeConcepts: ConceptDiagnosisItem[] = [];
  const allRecommendations: string[] = [];

  Object.entries(conceptGroups).forEach(([name, data]) => {
    const accuracy = data.totalMarks > 0 ? Math.round((data.earnedMarks / data.totalMarks) * 100) : 0;
    const isStrong = accuracy >= 75 && data.correctCount > 0;

    const item: ConceptDiagnosisItem = {
      name,
      totalQuestions: data.totalCount,
      correctQuestions: data.correctCount,
      accuracy,
      isStrong,
      recommendations: data.missedExplanations.slice(0, 2),
    };

    if (isStrong) {
      strongConcepts.push(item);
    } else {
      needsPracticeConcepts.push(item);
      data.missedExplanations.forEach((exp) => {
        if (!allRecommendations.includes(exp)) {
          allRecommendations.push(exp);
        }
      });
    }
  });

  // If student got 100%, provide praise recommendation
  if (needsPracticeConcepts.length === 0) {
    allRecommendations.push(
      'Flawless performance across all tested grammatical strands! Ready to progress to higher-order transformation or Olympiad exercises.'
    );
  }

  return {
    overallPercentage,
    masteryStatus,
    strongConcepts,
    needsPracticeConcepts,
    recommendations: allRecommendations,
  };
}

function getFallbackConcept(q: GrammarQuestion): string {
  if (q.type === 'mcq') return 'Syntactic Choice & Concord Identification';
  if (q.type === 'fill_in_blanks') return 'Contextual Verb & Tense Supply';
  if (q.type === 'error_correction') return 'Error Spotting & Concord Correction';
  if (q.type === 'transformation') return 'Sentence Rephrasing & Clause Synthesis';
  return 'General Grammar Application';
}

/**
 * Storage helpers for Quiz Mastery History.
 */
export function loadQuizHistory(): QuizAttemptRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load quiz history:', e);
    return [];
  }
}

export function saveQuizAttemptToStorage(
  attempt: QuizAttemptRecord,
  seriesProject: GrammarSeriesProject,
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void
): void {
  try {
    const currentList = loadQuizHistory();
    const updatedList = [attempt, ...currentList.slice(0, 99)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Update project state for persistence
    const existingHistory = seriesProject.quizHistory || [];
    onUpdateSeriesProject({
      ...seriesProject,
      quizHistory: [attempt, ...existingHistory.slice(0, 99)],
      lastUpdated: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to save quiz attempt:', e);
  }
}

export function getMistakeQuestionIdsForTopic(
  topicId: string,
  history?: QuizAttemptRecord[]
): string[] {
  const attempts = history || loadQuizHistory();
  const topicAttempts = attempts.filter((a) => a.unitId === topicId);
  const mistakeIds = new Set<string>();

  topicAttempts.forEach((a) => {
    a.incorrectQuestionIds.forEach((id) => mistakeIds.add(id));
  });

  return Array.from(mistakeIds);
}
