/**
 * VERITAS Publishing System — Data Integrity Guard
 * Enforces strict chapter isolation, prevents cross-chapter data bleed,
 * validates parent-child component hierarchy, and normalizes exercise titles.
 */

import { StudioChapter, ChapterSection, StudioExercise } from '../types';

/**
 * Normalizes exercise titles so they consistently render as "Exercise <Letter>: <Title>"
 * without any duplication like "Exercise A: Exercise A:" or "Exercise B: Exercise:".
 */
export function normalizeExerciseTitle(
  title: string | undefined,
  letterOrIndex: string | number
): string {
  const letter =
    typeof letterOrIndex === 'number'
      ? String.fromCharCode(65 + letterOrIndex)
      : String(letterOrIndex).toUpperCase();

  if (!title || !title.trim()) {
    return `Exercise ${letter}`;
  }

  let cleaned = title.trim();

  // Repeatedly strip leading variations of "Exercise", "Exercise A:", "Exercise:", "Exercise 1 -", etc.
  while (/^exercise(\s+[a-z0-9]+)?[:.\s-]*/i.test(cleaned)) {
    const next = cleaned.replace(/^exercise(\s+[a-z0-9]+)?[:.\s-]*/i, '').trim();
    if (next === cleaned) break;
    cleaned = next;
  }

  return cleaned ? `Exercise ${letter}: ${cleaned}` : `Exercise ${letter}`;
}

/**
 * Returns only the subtitle part of an exercise, stripping any leading "Exercise <Letter>:"
 */
export function cleanExerciseSubtitleOnly(title: string | undefined): string {
  if (!title || !title.trim()) return '';
  let cleaned = title.trim();
  while (/^exercise(\s+[a-z0-9]+)?[:.\s-]*/i.test(cleaned)) {
    const next = cleaned.replace(/^exercise(\s+[a-z0-9]+)?[:.\s-]*/i, '').trim();
    if (next === cleaned) break;
    cleaned = next;
  }
  return cleaned;
}

/**
 * Helper to test whether two titles belong to the same grammatical topic domain.
 */
export function isSameTopicDomain(titleA: string, titleB: string): boolean {
  const a = titleA.toLowerCase();
  const b = titleB.toLowerCase();

  const isNounsA = /\bnoun(s)?\b|\bnaming word(s)?\b/.test(a);
  const isNounsB = /\bnoun(s)?\b|\bnaming word(s)?\b/.test(b);
  if (isNounsA || isNounsB) return isNounsA === isNounsB;

  const isSvaA = /subject.*verb|verb.*subject|concord|syntactic synthesis/.test(a);
  const isSvaB = /subject.*verb|verb.*subject|concord|syntactic synthesis/.test(b);
  if (isSvaA || isSvaB) return isSvaA === isSvaB;

  const isTensesA = /\btense(s)?\b|\baspect\b/.test(a);
  const isTensesB = /\btense(s)?\b|\baspect\b/.test(b);
  if (isTensesA || isTensesB) return isTensesA === isTensesB;

  const isVoiceA = /\bvoice\b|\bpassive\b|\bactive\b/.test(a);
  const isVoiceB = /\bvoice\b|\bpassive\b|\bactive\b/.test(b);
  if (isVoiceA || isVoiceB) return isVoiceA === isVoiceB;

  return true;
}

export interface SanitizedChapterResult {
  chapter: StudioChapter;
  warnings: string[];
  mismatchesDetected: boolean;
}

/**
 * Rigorous runtime check and sanitizer for chapter data before rendering or persisting.
 * Guarantees that:
 * 1. Every rendered section belongs to the active chapter.
 * 2. Every rendered exercise belongs to the active chapter.
 * 3. Every question belongs to its parent exercise.
 * 4. Topic domain mismatches (e.g. Noun sections/exercises inside Subject-Verb Agreement)
 *    are detected, logged as development errors, and stripped out so unauthored chapters
 *    display as clean DRAFT / NOT STARTED rather than displaying foreign content.
 */
export function sanitizeChapterDataIntegrity(
  rawChapter: StudioChapter,
  expectedChapterId?: string
): SanitizedChapterResult {
  const warnings: string[] = [];
  let mismatchesDetected = false;

  const chapterId = expectedChapterId || rawChapter.id;
  const titleLower = (rawChapter.title || '').toLowerCase();

  const isSvaChapter = /subject.*verb|verb.*subject|concord|syntactic synthesis/.test(titleLower);
  const isNounsChapter = /\bnoun(s)?\b|\bnaming word(s)?\b/.test(titleLower);

  // Check 1: Chapter ID mismatch
  if (expectedChapterId && rawChapter.id !== expectedChapterId) {
    warnings.push(
      `[Data Integrity Guard] Active chapter ID mismatch: expected "${expectedChapterId}", got "${rawChapter.id}". Re-binding to active ID.`
    );
    mismatchesDetected = true;
  }

  // Regex to detect leaked Noun content
  const nounLeakRegex =
    /\b(common|proper|collective|abstract)\s+nouns?\b|\bnaming words?\b|\bganga\b|\byamuna\b|\bidentify nouns\b|\bcapitalize proper nouns\b|\bwords used to name people\b/i;

  // Check 2: Sections sanitization
  const cleanSections: ChapterSection[] = [];
  for (const s of rawChapter.sections || []) {
    // Check chapter ownership
    if (s.chapterId && s.chapterId !== chapterId) {
      warnings.push(
        `[Data Integrity Guard] Excluded foreign section "${s.id}" with chapterId "${s.chapterId}" from active chapter "${chapterId}".`
      );
      mismatchesDetected = true;
      continue;
    }

    // Check domain leakage
    if (isSvaChapter && !isNounsChapter) {
      const sectionText = `${s.title || ''} ${s.blocks?.map((b) => b.textContent || b.title || '').join(' ') || ''}`;
      if (nounLeakRegex.test(sectionText)) {
        warnings.push(
          `[Data Integrity Guard] Excluded foreign Noun section "${s.title}" from Subject–Verb Agreement chapter "${chapterId}".`
        );
        mismatchesDetected = true;
        continue;
      }
    }

    // Ensure section has canonical chapterId
    cleanSections.push({
      ...s,
      chapterId,
    });
  }

  // Check 3: Exercises sanitization
  const cleanExercises: StudioExercise[] = [];
  for (let i = 0; i < (rawChapter.exercises || []).length; i++) {
    const ex = rawChapter.exercises[i];
    const letter = ex.letter || String.fromCharCode(65 + i);

    // Check chapter ownership
    if (ex.chapterId && ex.chapterId !== chapterId) {
      warnings.push(
        `[Data Integrity Guard] Excluded foreign exercise "${ex.id}" with chapterId "${ex.chapterId}" from active chapter "${chapterId}".`
      );
      mismatchesDetected = true;
      continue;
    }

    // Check domain leakage
    if (isSvaChapter && !isNounsChapter) {
      const exText = `${ex.title || ''} ${ex.instructions || ''} ${ex.questions?.map((q) => q.prompt || q.blanksSentence || '').join(' ') || ''}`;
      if (nounLeakRegex.test(exText)) {
        warnings.push(
          `[Data Integrity Guard] Excluded foreign Noun exercise "${ex.title}" from Subject–Verb Agreement chapter "${chapterId}".`
        );
        mismatchesDetected = true;
        continue;
      }
    }

    // Question-level deduplication and exerciseId validation
    const seenQuestionKeys = new Set<string>();
    const cleanQuestions = (ex.questions || []).filter((q) => {
      // Check exerciseId if present
      if (q.exerciseId && q.exerciseId !== ex.id) {
        warnings.push(
          `[Data Integrity Guard] Excluded mismatched question "${q.id}" from exercise "${ex.id}".`
        );
        mismatchesDetected = true;
        return false;
      }

      const qKey = (q.prompt || q.blanksSentence || q.id || '').trim().toLowerCase();
      if (!qKey) return true;
      if (seenQuestionKeys.has(qKey)) {
        mismatchesDetected = true;
        return false; // deduplicate
      }
      seenQuestionKeys.add(qKey);
      return true;
    });

    cleanExercises.push({
      ...ex,
      letter,
      title: normalizeExerciseTitle(ex.title, letter),
      chapterId,
      questions: cleanQuestions,
    });
  }

  // Check 4: Opening metadata sanitization
  let cleanOpening = { ...rawChapter.opening };
  let cleanCategory = rawChapter.category;
  let cleanUnitTitle = rawChapter.unitTitle;
  let cleanSubtitle = rawChapter.subtitle || '';
  let cleanEquivalentClass = rawChapter.equivalentClass;

  if (isSvaChapter && !isNounsChapter) {
    // Sanitize category & unitTitle
    if (!cleanCategory || cleanCategory === 'Parts of Speech' || /noun/i.test(cleanCategory)) {
      cleanCategory = 'Syntax & Concord';
      warnings.push(`[Data Integrity Guard] Replaced stale category "${rawChapter.category}" with "Syntax & Concord".`);
      mismatchesDetected = true;
    }

    if (
      !cleanUnitTitle ||
      /noun|naming\s*word|parts\s*of\s*speech/i.test(cleanUnitTitle)
    ) {
      cleanUnitTitle = rawChapter.systemId === 'CISCE' ? 'Unit 1: Verbal Syntax & Concord' : 'Unit 1: Syntax & Concord';
      warnings.push(`[Data Integrity Guard] Replaced stale unitTitle "${rawChapter.unitTitle}" with "${cleanUnitTitle}".`);
      mismatchesDetected = true;
    }

    // Sanitize subtitle / scope
    if (
      /parts\s*of\s*speech|class\s*3|naming\s*words?|\bnouns?\b/i.test(cleanSubtitle) ||
      cleanSubtitle.includes('Master Class for Class 3')
    ) {
      warnings.push(`[Data Integrity Guard] Stripped stale subtitle "${cleanSubtitle}" from SVA chapter.`);
      cleanSubtitle = '';
      mismatchesDetected = true;
    }

    if (
      cleanOpening.subtitle &&
      (/parts\s*of\s*speech|class\s*3|naming\s*words?|\bnouns?\b/i.test(cleanOpening.subtitle) ||
        cleanOpening.subtitle.includes('Master Class for Class 3'))
    ) {
      cleanOpening.subtitle = '';
      mismatchesDetected = true;
    }

    // Sanitize Class 3 grade mismatch if present in CISCE or Class 6 SVA
    if (cleanEquivalentClass === 'Class 3') {
      cleanEquivalentClass = 'Class 6';
      warnings.push(`[Data Integrity Guard] Corrected stale grade "Class 3" to "Class 6" for SVA chapter.`);
      mismatchesDetected = true;
    }

    // Sanitize warm-up activity
    if (cleanOpening.warmUpActivity && /classroom around you|three objects|naming words?|\bnouns?\b/i.test(cleanOpening.warmUpActivity)) {
      warnings.push(`[Data Integrity Guard] Cleared stale noun warm-up activity from SVA chapter.`);
      cleanOpening.warmUpActivity = '';
      mismatchesDetected = true;
    }

    // Sanitize prior knowledge
    if (typeof cleanOpening.priorKnowledge === 'string') {
      if (/naming words?|\bnouns?\b/i.test(cleanOpening.priorKnowledge)) {
        cleanOpening.priorKnowledge = '';
      }
    } else if (Array.isArray(cleanOpening.priorKnowledge)) {
      cleanOpening.priorKnowledge = (cleanOpening.priorKnowledge as string[]).filter(
        (pk) => !/naming words?|\bnouns?\b/i.test(pk)
      ) as any;
    }

    const openingText = `${cleanOpening.shortIntroduction || ''} ${cleanOpening.openingHook || ''} ${(cleanOpening.learningObjectives || []).join(' ')}`;
    if (nounLeakRegex.test(openingText)) {
      warnings.push(
        `[Data Integrity Guard] Foreign Noun text detected in opening of Subject–Verb Agreement chapter "${chapterId}". Clearing unauthored opening.`
      );
      mismatchesDetected = true;
      cleanOpening = {
        ...cleanOpening,
        title: rawChapter.title,
        subtitle: cleanSubtitle,
        shortIntroduction: '',
        openingHook: '',
        warmUpActivity: '',
        learningObjectives: [],
        priorKnowledge: '',
        keyVocabulary: ['Subject', 'Verb', 'Agreement', 'Concord'],
        conceptsCovered: ['Subject-Verb Concord'],
      };
    }
  }

  // Check 5: Rules sanitization
  const cleanRules = (rawChapter.rules || []).filter((r) => {
    if (isSvaChapter && !isNounsChapter) {
      const ruleLabel = r.ruleName || (r as any).ruleTitle || '';
      const ruleText = `${ruleLabel} ${r.ruleStatement || ''} ${r.explanation || ''} ${(r.correctExamples || []).join(' ')} ${(r.incorrectExamples || []).join(' ')}`;
      if (nounLeakRegex.test(ruleText)) {
        warnings.push(`[Data Integrity Guard] Excluded foreign Noun rule "${ruleLabel}" from SVA chapter.`);
        mismatchesDetected = true;
        return false;
      }
    }
    return true;
  });

  // Check 6: Ending / Summary metadata sanitization
  let cleanEnding = rawChapter.ending ? { ...rawChapter.ending } : undefined;
  if (cleanEnding && isSvaChapter && !isNounsChapter) {
    const endingText = `${(cleanEnding.whatYouLearned || []).join(' ')} ${cleanEnding.rulesAtAGlance?.map((r) => r.rule || '').join(' ') || ''}`;
    if (nounLeakRegex.test(endingText)) {
      warnings.push(
        `[Data Integrity Guard] Foreign Noun text detected in ending/summary of Subject–Verb Agreement chapter "${chapterId}". Clearing unauthored summary.`
      );
      mismatchesDetected = true;
      cleanEnding = {
        ...cleanEnding,
        whatYouLearned: [],
        rulesAtAGlance: [],
        commonMistakes: [],
        quickRevisionChecklist: [],
      };
    }
  }

  let cleanRevision = rawChapter.revisionData ? { ...rawChapter.revisionData } : undefined;
  if (cleanRevision && isSvaChapter && !isNounsChapter) {
    const revText = `${cleanRevision.rulesAtAGlance?.map((r) => (r as any).rule || r.ruleTitle || r.summary || '').join(' ') || ''} ${(cleanRevision.keyConcepts || (cleanRevision as any).whatYouLearned || []).join(' ')}`;
    if (nounLeakRegex.test(revText)) {
      mismatchesDetected = true;
      cleanRevision = undefined;
    }
  }

  if (warnings.length > 0) {
    console.warn(
      `[Data Integrity Guard] Sanitized chapter "${chapterId}":\n${warnings.join('\n')}`
    );
  }

  return {
    chapter: {
      ...rawChapter,
      id: chapterId,
      category: cleanCategory,
      unitTitle: cleanUnitTitle,
      subtitle: cleanSubtitle,
      equivalentClass: cleanEquivalentClass,
      sections: cleanSections,
      exercises: cleanExercises,
      rules: cleanRules,
      opening: cleanOpening,
      ending: cleanEnding,
      revisionData: cleanRevision,
    },
    warnings,
    mismatchesDetected,
  };
}

/**
 * Development-time assertions for integrity violations.
 * Catches mismatches between canonical chapter identity, components, grades,
 * publishing editions, and preview content.
 */
export function assertChapterContextConsistency(
  activeChapter: StudioChapter,
  componentContext?: {
    componentId?: string;
    componentChapterId?: string;
    grade?: string;
    viewMode?: 'student' | 'teacher' | 'manuscript';
    isStudentPreview?: boolean;
    rendersAnswerKey?: boolean;
    rendersTeacherNotes?: boolean;
  }
): { isValid: boolean; violations: string[] } {
  const violations: string[] = [];

  // 1. Chapter ID mismatch
  if (
    componentContext?.componentChapterId &&
    componentContext.componentChapterId !== activeChapter.id
  ) {
    violations.push(
      `[CRITICAL INTEGRITY VIOLATION] Component chapterId "${componentContext.componentChapterId}" does not match active canonical chapter "${activeChapter.id}".`
    );
  }

  // 2. Grade / Class mismatch
  if (
    componentContext?.grade &&
    activeChapter.equivalentClass &&
    componentContext.grade.toLowerCase().trim() !== activeChapter.equivalentClass.toLowerCase().trim()
  ) {
    violations.push(
      `[GRADE INTEGRITY VIOLATION] Component grade "${componentContext.grade}" mismatches active canonical chapter grade "${activeChapter.equivalentClass}".`
    );
  }

  // 3. Student Edition leakage violation
  if (
    (componentContext?.viewMode === 'student' || componentContext?.isStudentPreview) &&
    (componentContext.rendersAnswerKey || componentContext.rendersTeacherNotes)
  ) {
    violations.push(
      `[SECURITY/EDITION INTEGRITY VIOLATION] Student Edition attempted to expose Teacher-only materials (answers or teacher notes).`
    );
  }

  // 4. Topic Domain mismatch
  const title = (activeChapter.title || '').toLowerCase();
  const isSva = /subject.*verb|verb.*subject|concord|syntactic synthesis/.test(title);
  const isNouns = /\bnoun(s)?\b|\bnaming word(s)?\b/.test(title);

  if (isSva && !isNouns) {
    if (activeChapter.category && /parts\s*of\s*speech|\bnouns?\b/i.test(activeChapter.category)) {
      violations.push(
        `[METADATA INTEGRITY VIOLATION] SVA chapter has foreign category "${activeChapter.category}". Expected "Syntax & Concord".`
      );
    }
    if (activeChapter.subtitle && /parts\s*of\s*speech|class\s*3/i.test(activeChapter.subtitle)) {
      violations.push(
        `[METADATA INTEGRITY VIOLATION] SVA chapter has stale subtitle "${activeChapter.subtitle}".`
      );
    }
  }

  if (violations.length > 0) {
    console.error(`[VERITAS INTEGRITY ASSERTION FAILED]:\n${violations.join('\n')}`);
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}
