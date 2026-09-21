/**
 * VERITAS Publishing System — Canonical Chapter Derived Metrics Layer
 *
 * Single source of truth for all derived chapter statistics and metrics.
 * Rules, exercises, questions, words, blueprint completion, and audit scores
 * are computed dynamically from the canonical chapter state, NEVER hardcoded.
 */

import { StudioChapter } from '../types';
import { BookArchitectureConfig } from '../components/book-planner/architecture/types';
import {
  getArchitectureCompletionStats,
  calculateComponentStatus,
} from '../components/chapter-studio/architecture/chapterArchitectureBridge';

export interface ChapterDerivedMetrics {
  rulesCount: number;
  exercisesCount: number;
  exerciseLettersDisplay: string;
  questionsCount: number;
  sectionsCount: number;
  wordCount: number;
  blueprintCompletedCount: number;
  blueprintTotalCount: number;
  blueprintPct: number;
  auditScore: number;
  auditStatusDisplay: string;
  isFullyAuthored: boolean;
}

/**
 * Counts words accurately across any text string.
 */
export function countStringWords(text?: string | null): number {
  if (!text || typeof text !== 'string') return 0;
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

/**
 * Computes canonical derived metrics directly from the StudioChapter object.
 * Guarantees that if sections, exercises, and rules are 0, word count and
 * rule counts report 0 rather than contradictory hardcoded numbers.
 */
export function calculateChapterDerivedMetrics(
  chapter: StudioChapter | null | undefined,
  architecture?: BookArchitectureConfig
): ChapterDerivedMetrics {
  if (!chapter) {
    return {
      rulesCount: 0,
      exercisesCount: 0,
      exerciseLettersDisplay: '0 Exercises',
      questionsCount: 0,
      sectionsCount: 0,
      wordCount: 0,
      blueprintCompletedCount: 0,
      blueprintTotalCount: 23,
      blueprintPct: 0,
      auditScore: 0,
      auditStatusDisplay: '0% Audit (Draft)',
      isFullyAuthored: false,
    };
  }

  // 1. Rules Count: count explicitly listed rules or rule blocks inside sections
  const explicitRulesCount = chapter.rules?.length || 0;
  const sectionRulesCount = (chapter.sections || []).reduce((acc, section) => {
    const ruleBlocks = (section.blocks || []).filter(
      (b) => b.type === 'grammar_rule'
    ).length;
    return acc + ruleBlocks;
  }, 0);
  const rulesCount = explicitRulesCount > 0 ? explicitRulesCount : sectionRulesCount;

  // 2. Exercises Count & Letter Range
  const exercises = chapter.exercises || [];
  const exercisesCount = exercises.length;
  let exerciseLettersDisplay = '0 Exercises';
  if (exercisesCount === 1) {
    const letter = exercises[0]?.letter || 'A';
    exerciseLettersDisplay = `1 Exercise (${letter})`;
  } else if (exercisesCount > 1) {
    const firstLetter = exercises[0]?.letter || 'A';
    const lastLetter = exercises[exercisesCount - 1]?.letter || String.fromCharCode(64 + exercisesCount);
    exerciseLettersDisplay = `${exercisesCount} Exercises (${firstLetter}–${lastLetter})`;
  }

  // 3. Questions Count
  const questionsCount = exercises.reduce((acc, ex) => {
    return acc + (ex.questions ? ex.questions.length : 0);
  }, 0);

  // 4. Sections Count
  const sectionsCount = chapter.sections?.length || 0;

  // 5. Total Word Count (Dynamically computed from actual authored text only)
  let totalWords = 0;

  // Header & Opening
  totalWords += countStringWords(chapter.title);
  totalWords += countStringWords(chapter.subtitle);
  totalWords += countStringWords(chapter.opening?.shortIntroduction);
  totalWords += countStringWords(chapter.opening?.openingHook);
  totalWords += countStringWords(chapter.opening?.warmUpActivity);
  totalWords += countStringWords(chapter.opening?.openingIllustrationPrompt);
  (chapter.opening?.learningObjectives || []).forEach((obj) => {
    totalWords += countStringWords(obj);
  });
  if (typeof chapter.opening?.priorKnowledge === 'string') {
    totalWords += countStringWords(chapter.opening.priorKnowledge);
  } else if (Array.isArray(chapter.opening?.priorKnowledge)) {
    (chapter.opening.priorKnowledge as string[]).forEach((pk) => {
      totalWords += countStringWords(pk);
    });
  }
  (chapter.opening?.keyVocabulary || []).forEach((vocab) => {
    totalWords += countStringWords(vocab);
  });

  // Sections & Blocks
  (chapter.sections || []).forEach((sec) => {
    totalWords += countStringWords(sec.title);
    (sec.blocks || []).forEach((block) => {
      totalWords += countStringWords(block.title);
      totalWords += countStringWords(block.textContent);
      (block.exampleData?.items || []).forEach((ex) => {
        totalWords += countStringWords(ex.sentence);
        totalWords += countStringWords(ex.explanation);
      });
      if (block.associatedRuleData) {
        totalWords += countStringWords(block.associatedRuleData.ruleText);
        totalWords += countStringWords(block.associatedRuleData.explanation);
      }
    });
  });

  // Rules
  (chapter.rules || []).forEach((rule) => {
    totalWords += countStringWords(rule.ruleName);
    totalWords += countStringWords(rule.ruleStatement);
    totalWords += countStringWords(rule.explanation);
    (rule.correctExamples || []).forEach((e) => totalWords += countStringWords(e));
    (rule.incorrectExamples || []).forEach((e) => totalWords += countStringWords(e));
  });

  // Exercises & Questions
  exercises.forEach((ex) => {
    totalWords += countStringWords(ex.title);
    totalWords += countStringWords(ex.instructions);
    totalWords += countStringWords(ex.studentInstruction);
    totalWords += countStringWords(ex.teacherNote);
    (ex.questions || []).forEach((q) => {
      totalWords += countStringWords(q.prompt);
      totalWords += countStringWords(q.blanksSentence);
      totalWords += countStringWords(q.originalSentence);
      totalWords += countStringWords(q.correctAnswer);
      totalWords += countStringWords(q.modelAnswer);
      totalWords += countStringWords(q.explanation);
      (q.options || []).forEach((opt) => totalWords += countStringWords(opt));
    });
  });

  // Ending / Summary
  if (chapter.ending) {
    (chapter.ending.whatYouLearned || []).forEach((w) => totalWords += countStringWords(w));
    (chapter.ending.rulesAtAGlance || []).forEach((r) => {
      totalWords += countStringWords(r.rule);
      totalWords += countStringWords(r.example);
    });
    (chapter.ending.commonMistakes || []).forEach((m: any) => {
      totalWords += countStringWords(m.mistake || m.incorrectSentence);
      totalWords += countStringWords(m.correction || m.correctSentence);
      totalWords += countStringWords(m.ruleRef || m.explanation);
    });
  }

  // Revision data if present
  if (chapter.revisionData) {
    (chapter.revisionData.rulesAtAGlance || []).forEach((r: any) => {
      totalWords += countStringWords(r.rule || r.ruleTitle || r.summary);
    });
  }

  // 6. Blueprint Completion
  let blueprintCompletedCount = 0;
  let blueprintTotalCount = 23;
  let blueprintPct = 0;

  if (architecture) {
    const stats = getArchitectureCompletionStats(chapter, architecture);
    blueprintCompletedCount = stats.overallCompleted;
    blueprintTotalCount = stats.totalComponents || 23;
    blueprintPct = stats.overallPercent;
  } else {
    // Default 23-component anatomy check
    let completed = 0;
    for (let i = 1; i <= 23; i++) {
      const compId = `comp-${i}`;
      const status = calculateComponentStatus(chapter, { id: compId, name: `Component ${i}` } as any, undefined);
      if (status === 'complete') completed++;
    }
    blueprintCompletedCount = completed;
    blueprintPct = Math.round((completed / 23) * 100);
  }

  // 7. Dynamic Audit Score
  let auditScore = 0;
  if (chapter.qualityAudit?.overallReadinessScore !== undefined) {
    auditScore = chapter.qualityAudit.overallReadinessScore;
  } else if (chapter.academicQualityScore !== undefined && (sectionsCount > 0 || exercisesCount > 0)) {
    auditScore = chapter.academicQualityScore;
  } else if (sectionsCount === 0 && exercisesCount === 0 && rulesCount === 0) {
    // If the chapter manuscript is completely empty, it cannot have 100% or 95% audit
    auditScore = 0;
  } else {
    // Proportional quality calculation based on component completion & exercises
    const exerciseRatio = Math.min(1, exercisesCount / 5);
    const ruleRatio = Math.min(1, rulesCount / 4);
    const sectionRatio = Math.min(1, sectionsCount / 3);
    auditScore = Math.round((exerciseRatio * 35 + ruleRatio * 35 + sectionRatio * 30));
  }

  let auditStatusDisplay = '0% Audit (Draft)';
  if (auditScore >= 95) {
    auditStatusDisplay = `${auditScore}% Audit (Certified)`;
  } else if (auditScore >= 70) {
    auditStatusDisplay = `${auditScore}% Audit (In Progress)`;
  } else if (auditScore > 0) {
    auditStatusDisplay = `${auditScore}% Audit (Draft)`;
  } else {
    auditStatusDisplay = 'Draft (Unverified)';
  }

  const isFullyAuthored = sectionsCount > 0 && exercisesCount >= 3 && rulesCount >= 3;

  return {
    rulesCount,
    exercisesCount,
    exerciseLettersDisplay,
    questionsCount,
    sectionsCount,
    wordCount: totalWords,
    blueprintCompletedCount,
    blueprintTotalCount,
    blueprintPct,
    auditScore,
    auditStatusDisplay,
    isFullyAuthored,
  };
}
