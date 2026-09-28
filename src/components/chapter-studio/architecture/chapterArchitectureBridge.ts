import {
  StudioChapter,
  GrammarSeriesProject,
  BookProject,
  ChapterSection,
  StudioExercise,
  TextbookContentBlock,
  ChapterOpeningData,
  ChapterEndingData,
  ArchitectureComponentStatus,
  ChapterComponentCustomization,
  ChapterArchitectureState,
} from '../../../types';
import {
  BookArchitectureConfig,
  ChapterComponentAnatomy,
} from '../../book-planner/architecture/types';
import { getDefaultBookArchitecture } from '../../book-planner/architecture/defaultArchitecture';
import { calibrateManuscriptMetadataForClass } from '../../../utils/pedagogicalProfileSystem';

// ---------------------------------------------------------------------------
// 1. Architecture Resolution
// ---------------------------------------------------------------------------

/**
 * Resolves the governing BookArchitectureConfig for the current chapter context.
 * Resolves dynamically from seriesProject without hard-coding.
 */
export function resolveActiveBookArchitecture(
  seriesProject: GrammarSeriesProject,
  classLevel?: string,
  projectId?: string,
  targetBoard?: string
): BookArchitectureConfig {
  const effectiveBoard =
    targetBoard ||
    (seriesProject as any)?.activeBoard ||
    (seriesProject as any)?.activeSystemId ||
    (seriesProject as any)?.targetBoard ||
    'CISCE';

  // 1. If explicit projectId provided
  if (projectId && seriesProject.bookProjects && seriesProject.bookProjects[projectId]) {
    const proj = seriesProject.bookProjects[projectId];
    if (proj.architecture) {
      return proj.architecture;
    }
    return getDefaultBookArchitecture(proj);
  }

  // 2. Look for matching classLevel and board
  if (classLevel && seriesProject.bookProjects) {
    const matchedWithBoard = Object.values(seriesProject.bookProjects).find(
      (bp) => bp.classLevel === classLevel && (bp.board || '').toLowerCase() === effectiveBoard.toLowerCase()
    );
    if (matchedWithBoard) {
      if (matchedWithBoard.architecture) {
        return matchedWithBoard.architecture;
      }
      return getDefaultBookArchitecture(matchedWithBoard);
    }

    const matched = Object.values(seriesProject.bookProjects).find(
      (bp) => bp.classLevel === classLevel
    );
    if (matched) {
      if (matched.architecture) {
        return matched.architecture;
      }
      return getDefaultBookArchitecture(matched);
    }
  }

  // 3. Fallback to activeBookProjectId
  if (seriesProject.activeBookProjectId && seriesProject.bookProjects?.[seriesProject.activeBookProjectId]) {
    const proj = seriesProject.bookProjects[seriesProject.activeBookProjectId];
    if (proj.architecture) {
      return proj.architecture;
    }
    return getDefaultBookArchitecture(proj);
  }

  // 4. Fallback to first available book project
  const firstProj = Object.values(seriesProject.bookProjects || {})[0];
  if (firstProj) {
    if (firstProj.architecture) {
      return firstProj.architecture;
    }
    return getDefaultBookArchitecture(firstProj);
  }

  // 5. Synthesize minimal project
  const isCisce = effectiveBoard.toUpperCase() === 'CISCE' || effectiveBoard.toUpperCase() === 'ICSE';
  const syntheticProj: BookProject = {
    id: isCisce ? 'proj-cisce-class6' : `proj-default-${effectiveBoard.toLowerCase()}-6`,
    bookTitle: isCisce ? 'Classical Grammar: ICSE Class 6' : 'Middle School Grammar & Syntax',
    seriesTitle: (seriesProject as any)?.seriesTitle || (seriesProject as any)?.title || 'Grammar in Action: Tri-Board English Series',
    subtitle: isCisce ? calibrateManuscriptMetadataForClass('Making Subjects and Verbs Agree', (classLevel as any) || 'Class 6') : 'Comprehensive Student Edition',
    programme: 'Secondary',
    classOrStage: (classLevel as any) || 'Class 6',
    classLevel: (classLevel as any) || 'Class 6',
    subject: 'English Grammar & Composition',
    author: 'VERITAS Editorial Board',
    editor: 'Academic Editorial Panel',
    edition: 'Student Edition',
    academicYear: '2025–2026',
    isbnPlaceholder: '978-93-89100-42-1',
    board: effectiveBoard,
    targetAge: '11–12 years',
    targetPageCount: 192,
    estimatedWordCount: 45000,
    trimSize: 'Royal Octavo (7.44 × 9.69 in)',
    status: 'Authoring',
    publisher: 'VERITAS Press & Studio (Academic Division)',
    internalProjectCode: isCisce ? 'VER-ICSE-06' : 'VER-ENG-06',
    copyrightYear: 2025,
    language: 'English',
    notes: '',
    milestones: [],
    rightsAndEditions: [],
    lastEdited: new Date().toISOString(),
  };

  return getDefaultBookArchitecture(syntheticProj);
}

// ---------------------------------------------------------------------------
// 2. Component Status Resolution
// ---------------------------------------------------------------------------

/**
 * Maps a single architecture component to its live status in a given StudioChapter.
 * Respects explicit user overrides while evaluating true underlying content.
 */
export function calculateComponentStatus(
  chapter: StudioChapter,
  component: ChapterComponentAnatomy,
  componentIndex: number
): ArchitectureComponentStatus {
  // Check if author explicitly marked customization/override
  const custom = chapter.architectureState?.customizations?.[component.id];
  if (custom && custom.status) {
    return custom.status;
  }

  const nameLower = component.name.toLowerCase();
  const cat = component.category;

  // 1. Chapter Opener & Orientation
  if (component.id === 'comp-1' || nameLower.includes('opener') || nameLower.includes('title')) {
    const hasTitle = Boolean(chapter.title || chapter.opening?.title);
    const hasSubtitle = Boolean(
      (chapter.subtitle && chapter.subtitle.trim().length > 0) ||
      (chapter.opening?.subtitle && chapter.opening.subtitle.trim().length > 0)
    );
    const hasHook = Boolean(chapter.opening?.openingHook && chapter.opening.openingHook.trim().length > 15);
    const hasIntro = Boolean(chapter.opening?.shortIntroduction && chapter.opening.shortIntroduction.trim().length > 30);
    if (hasTitle && hasSubtitle && hasHook && hasIntro) {
      return 'complete';
    }
    if (hasHook || hasIntro || hasSubtitle) {
      return 'drafting';
    }
    return 'not_started';
  }

  // 2. Learning Objectives
  if (component.id === 'comp-2' || nameLower.includes('objective')) {
    const validObjs = (chapter.opening?.learningObjectives || []).filter(
      (o) => typeof o === 'string' && o.trim().length > 5
    );
    if (validObjs.length >= 3) return 'complete';
    if (validObjs.length > 0) return 'drafting';
    return 'not_started';
  }

  // 3. Warm-Up / Prior Knowledge
  if (component.id === 'comp-3' || nameLower.includes('warm-up') || nameLower.includes('prior knowledge')) {
    const hasWarmUp = Boolean(
      (chapter.opening?.warmUpActivity && chapter.opening.warmUpActivity.trim().length > 20) ||
      ((chapter.opening as unknown as Record<string, unknown>)?.warmUp && String((chapter.opening as unknown as Record<string, unknown>).warmUp).trim().length > 20)
    );
    const hasPriorKnowledge = Boolean(
      (typeof chapter.opening?.priorKnowledge === 'string' && chapter.opening.priorKnowledge.trim().length > 20) ||
      (Array.isArray(chapter.opening?.priorKnowledge) && chapter.opening.priorKnowledge.length > 0)
    );
    if (hasWarmUp && hasPriorKnowledge) {
      return 'complete';
    }
    if (hasWarmUp || hasPriorKnowledge) {
      return 'drafting';
    }
    return 'not_started';
  }

  // 4. Concept Introduction & Discovery Vignette
  if (component.id === 'comp-4' || nameLower.includes('concept introduction') || nameLower.includes('discovery vignette') || nameLower.includes('narrative')) {
    const vignetteText =
      (chapter.opening as unknown as Record<string, unknown>)?.discoveryVignette ||
      (chapter.opening as unknown as Record<string, unknown>)?.conceptDiscovery ||
      chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'text')?.textContent ||
      '';
    const questionsText =
      (chapter.opening as unknown as Record<string, unknown>)?.discoveryQuestions ||
      (chapter.opening as unknown as Record<string, unknown>)?.discoveryQuestion ||
      chapter.sections?.find((s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery'))?.blocks?.find((b) => b.type === 'try_this')?.textContent ||
      '';
    const hasVignette = typeof vignetteText === 'string' && vignetteText.trim().length > 60;
    const hasQuestions = typeof questionsText === 'string' && questionsText.trim().length > 30;
    if (hasVignette && hasQuestions) return 'complete';
    if (hasVignette || hasQuestions || (typeof vignetteText === 'string' && vignetteText.trim().length > 0)) {
      return 'drafting';
    }
    return 'not_started';
  }

  // 5. Explanation & Syntactic Analysis
  if (component.id === 'comp-5' || nameLower.includes('syntactic analysis') || nameLower.includes('explanation')) {
    const custom = chapter.architectureState?.customizations?.['comp-5'];
    if (custom?.status) return custom.status as ArchitectureComponentStatus;

    const c05 = chapter.component05;
    const hasC05Content = Boolean(
      (c05?.conceptualExplanation && c05.conceptualExplanation.trim().length > 0) ||
      (Array.isArray(c05?.syntacticAnalysis) && c05.syntacticAnalysis.length > 0) ||
      (typeof c05?.syntacticAnalysis === 'string' && c05.syntacticAnalysis.trim().length > 0) ||
      (Array.isArray(c05?.conceptChecks) && c05.conceptChecks.length > 0) ||
      (c05?.linguisticInsight && c05.linguisticInsight.trim().length > 0)
    );

    if (c05?.status === 'complete') return 'complete';
    if (
      c05?.conceptualExplanation &&
      c05.conceptualExplanation.trim().length > 100 &&
      ((Array.isArray(c05?.syntacticAnalysis) && c05.syntacticAnalysis.length >= 2) ||
        (typeof c05?.syntacticAnalysis === 'string' && c05.syntacticAnalysis.trim().length > 50))
    ) {
      return 'complete';
    }
    if (c05?.status === 'draft' || c05?.status === 'in_progress' || hasC05Content) return 'drafting';

    const textBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) =>
        b.metadata?.componentId === 'comp-5' ||
        (b.type === 'text' && b.metadata?.componentId !== 'comp-4' && s.id !== 'sec-concept-discovery' && !s.title?.toLowerCase().includes('discovery') && !s.title?.toLowerCase().includes('concept introduction') && s.order > 1)
      )
    ) || [];
    const totalChars = textBlocks.reduce((acc, b) => acc + (b.textContent?.length || 0), 0);
    if (totalChars > 400) return 'complete';
    if (totalChars > 0) return 'drafting';
    return 'not_started';
  }

  // 6. Grammar Rules & Form Boxes
  if (component.id === 'comp-6' || nameLower.includes('rule') || nameLower.includes('form box')) {
    const custom = chapter.architectureState?.customizations?.['comp-6'];
    if (custom?.status) return custom.status as ArchitectureComponentStatus;

    const c06 = chapter.component06;
    if (c06?.status === 'complete') return 'complete';
    if (
      c06?.formalRuleStatement &&
      c06.formalRuleStatement.trim().length > 25 &&
      Array.isArray(c06?.ruleVariations) &&
      c06.ruleVariations.length >= 2
    ) {
      return 'complete';
    }
    if (
      c06?.status === 'draft' ||
      c06?.status === 'in_progress' ||
      (c06?.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
      (Array.isArray(c06?.ruleVariations) && c06.ruleVariations.length > 0)
    ) {
      return 'drafting';
    }

    const ruleBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'grammar_rule' || (b.type as string) === 'rule_box')
    ) || [];
    if (ruleBlocks.length >= 1) return 'complete';
    if (chapter.rules && chapter.rules.length >= 1) return 'complete';
    return 'not_started';
  }

  // 7. Examples & Contrastive Pairs
  if (component.id === 'comp-7' || nameLower.includes('contrastive') || nameLower.includes('example')) {
    const exampleBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'example_set')
    );
    if (exampleBlocks.length >= 1) return 'complete';
    return 'not_started';
  }

  // 8. Visual / Syntactic Diagram
  if (component.id === 'comp-8' || (cat === 'instruction' && (nameLower.includes('visual') || nameLower.includes('diagram')))) {
    const visualBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'visual')
    );
    if (visualBlocks.length >= 1) return 'complete';
    return component.isRequired ? 'not_started' : 'not_applicable';
  }

  // 9. Worked Examples with Commentary (COMP-09)
  if (component.id === 'comp-9' || nameLower.includes('worked example')) {
    if ((chapter.component09?.items?.length || 0) >= 1) {
      return chapter.component09?.status === 'complete' ? 'complete' : 'drafting';
    }
    const workedBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'worked_example')
    );
    if (workedBlocks.length >= 1) return 'complete';
    return 'not_started';
  }

  // 10. Common Errors & Pitfalls (COMP-10)
  if (component.id === 'comp-10' || nameLower.includes('error') || nameLower.includes('pitfall')) {
    if ((chapter.component10?.items?.length || 0) >= 1) {
      return chapter.component10?.status === 'complete' ? 'complete' : 'drafting';
    }
    const errorBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'common_error')
    );
    const hasEndingErrors = (chapter.ending?.commonMistakes?.length || 0) > 0;
    if (errorBlocks.length >= 1 || hasEndingErrors) return 'complete';
    return 'not_started';
  }

  // 11. Remember / Tip Boxes (COMP-11)
  if (component.id === 'comp-11' || nameLower.includes('remember') || nameLower.includes('tip')) {
    if ((chapter.component11?.items?.length || 0) >= 1) {
      return chapter.component11?.status === 'complete' ? 'complete' : 'drafting';
    }
    const tipBlocks = chapter.sections?.flatMap((s) =>
      (s.blocks || []).filter((b) => b.type === 'grammar_tip' || b.type === 'remember' || b.type === 'important_note' || (b.type as string) === 'callout')
    );
    if (tipBlocks.length >= 1) return 'complete';
    return 'not_started';
  }

  // 12. Guided Practice
  if (component.id === 'comp-12' || nameLower.includes('guided practice')) {
    if ((chapter.component12?.items?.length || 0) >= 1) {
      return chapter.component12?.status === 'complete' ? 'complete' : 'drafting';
    }
    const hasDrill = chapter.sections?.some((s) =>
      s.id !== 'sec-concept-discovery' &&
      !s.title?.toLowerCase().includes('discovery') &&
      s.metadata?.componentId !== 'comp-4' &&
      (s.title?.toLowerCase().includes('guided practice') ||
       s.metadata?.componentId === 'comp-12' ||
       s.blocks?.some((b) =>
         b.metadata?.componentId === 'comp-12' ||
         (b.metadata?.componentId !== 'comp-4' &&
          b.id !== 'blk-discovery-inquiry' &&
          !b.id?.startsWith('blk-discovery') &&
          !b.title?.toLowerCase().includes('discovery') &&
          (b.title?.toLowerCase().includes('guided practice') ||
           (b.type as string) === 'practice_drill' ||
           (b.type === 'practice' && !b.title?.toLowerCase().includes('discovery'))))
       ))
    );
    if (hasDrill) return 'complete';
    return 'not_started';
  }

  // 13. Exercise A: Recognition & Identification
  if (component.id === 'comp-13' || nameLower.includes('exercise a')) {
    const exA = chapter.exercises?.[0];
    if (exA && exA.questions?.length >= 2) return 'complete';
    if (exA && exA.questions?.length > 0) return 'drafting';
    return 'not_started';
  }

  // 14. Exercise B: Fill in the Blanks / Selection
  if (component.id === 'comp-14' || nameLower.includes('exercise b')) {
    const exB = chapter.exercises?.[1];
    if (exB && exB.questions?.length >= 2) return 'complete';
    if (exB && exB.questions?.length > 0) return 'drafting';
    return 'not_started';
  }

  // 15. Exercise C: Sentence Rewriting & Transformation
  if (component.id === 'comp-15' || nameLower.includes('exercise c')) {
    const exC = chapter.exercises?.[2];
    if (exC && exC.questions?.length >= 2) return 'complete';
    if (exC && exC.questions?.length > 0) return 'drafting';
    return 'not_started';
  }

  // 16. Exercise D: Error Correction & Editing
  if (component.id === 'comp-16' || nameLower.includes('exercise d')) {
    const exD = chapter.exercises?.[3];
    if (exD && exD.questions?.length >= 2) return 'complete';
    if (exD && exD.questions?.length > 0) return 'drafting';
    return 'not_started';
  }

  // 17. Exercise E: Contextual Application & Composition
  if (component.id === 'comp-17' || nameLower.includes('exercise e')) {
    const exE = chapter.exercises?.[4];
    if (exE && exE.questions?.length >= 2) return 'complete';
    if (exE && exE.questions?.length > 0) return 'drafting';
    return 'not_started';
  }

  // 18. Additional Exercises & Practice Set
  if (component.id === 'comp-18' || nameLower.includes('additional exercise')) {
    if ((chapter.exercises?.length || 0) > 5) return 'complete';
    return 'not_applicable';
  }

  // 19. Application / Challenge Drill
  if (component.id === 'comp-19' || nameLower.includes('challenge') || nameLower.includes('drill')) {
    const hasChallenge =
      chapter.sections?.some((s) => s.title?.toLowerCase().includes('challenge')) ||
      chapter.exercises?.some((e) => e.progression === 'challenge');
    if (hasChallenge) return 'complete';
    return 'not_started';
  }

  // 20. Chapter Review & Summary
  if (component.id === 'comp-20' || nameLower.includes('review') || nameLower.includes('summary')) {
    const hasRules = (chapter.ending?.rulesAtAGlance?.length || 0) > 0;
    const hasLearned = (chapter.ending?.whatYouLearned?.length || 0) > 0;
    if (hasRules && hasLearned) return 'complete';
    if (hasRules || hasLearned) return 'drafting';
    return 'not_started';
  }

  // 21. Chapter Assessment & Mastery Test
  if (component.id === 'comp-21' || nameLower.includes('assessment') || nameLower.includes('mastery test')) {
    const testQuestions = (chapter.chapterTest?.sections || []).flatMap((s) => s.questions || []);
    if (testQuestions.length >= 3) {
      return 'complete';
    }
    if (testQuestions.length > 0) {
      return 'drafting';
    }
    return 'not_started';
  }

  // 22. Answer Key
  if (component.id === 'comp-22' || nameLower.includes('answer key')) {
    if (chapter.answerKey && chapter.answerKey.length >= 2) return 'complete';
    // If all exercises have answers
    const totalQs = (chapter.exercises || []).flatMap((e) => e.questions || []);
    const answeredQs = totalQs.filter((q) => q.correctAnswer || q.modelAnswer);
    if (totalQs.length > 0 && answeredQs.length >= totalQs.length * 0.75) {
      return 'complete';
    }
    if (answeredQs.length > 0) return 'drafting';
    return 'not_started';
  }

  // 23. Teacher / Author Pedagogical Notes
  if (component.id === 'comp-23' || nameLower.includes('teacher') || nameLower.includes('pedagogical notes')) {
    if (chapter.teacherAuthorNotes && chapter.teacherAuthorNotes.length > 0) return 'complete';
    if (typeof chapter.teacherNotes === 'object' && (chapter.teacherNotes as unknown as Record<string, unknown>)?.lessonPlanFlow) return 'complete';
    return component.isRequired ? 'not_started' : 'not_applicable';
  }

  // General Fallback
  return 'not_started';
}

// ---------------------------------------------------------------------------
// 3. Architecture Completion Meter Calculations
// ---------------------------------------------------------------------------

export interface ArchitectureCompletionStats {
  totalComponents: number;
  totalRequired: number;
  completedRequired: number;
  draftingRequired: number;
  overallCompleted: number;
  overallDrafting: number;
  requiredPercent: number;
  overallPercent: number;
  breakdown: {
    content: { complete: number; total: number };
    practice: { complete: number; total: number };
    assessment: { complete: number; total: number };
    visuals: { complete: number; total: number };
    teacher: { complete: number; total: number };
  };
  componentsWithStatus: Array<{
    component: ChapterComponentAnatomy;
    sequenceNumber: number;
    status: ArchitectureComponentStatus;
    isInherited: boolean;
  }>;
}

export function getArchitectureCompletionStats(
  chapter: StudioChapter,
  architecture: BookArchitectureConfig
): ArchitectureCompletionStats {
  const components = architecture.chapterArchitecture?.components || [];

  let totalRequired = 0;
  let completedRequired = 0;
  let draftingRequired = 0;
  let overallCompleted = 0;
  let overallDrafting = 0;

  const breakdown = {
    content: { complete: 0, total: 0 },
    practice: { complete: 0, total: 0 },
    assessment: { complete: 0, total: 0 },
    visuals: { complete: 0, total: 0 },
    teacher: { complete: 0, total: 0 },
  };

  const componentsWithStatus = components.map((comp, idx) => {
    const status = calculateComponentStatus(chapter, comp, idx);
    const custom = chapter.architectureState?.customizations?.[comp.id];
    const isInherited = !custom?.isCustomized;

    // Do NOT count 'not_applicable' in required totals
    if (comp.isRequired && status !== 'not_applicable') {
      totalRequired += 1;
      if (status === 'complete') {
        completedRequired += 1;
      } else if (status === 'drafting') {
        draftingRequired += 1;
      }
    }

    if (status === 'complete') {
      overallCompleted += 1;
    } else if (status === 'drafting') {
      overallDrafting += 1;
    }

    // Categorization
    const nameLower = comp.name.toLowerCase();
    const cat = comp.category;

    if (cat === 'opener' || cat === 'instruction') {
      if (nameLower.includes('visual') || nameLower.includes('diagram')) {
        breakdown.visuals.total += 1;
        if (status === 'complete') breakdown.visuals.complete += 1;
      } else {
        breakdown.content.total += 1;
        if (status === 'complete') breakdown.content.complete += 1;
      }
    } else if (cat === 'practice') {
      breakdown.practice.total += 1;
      if (status === 'complete') breakdown.practice.complete += 1;
    } else if (cat === 'assessment' || cat === 'review') {
      breakdown.assessment.total += 1;
      if (status === 'complete') breakdown.assessment.complete += 1;
    } else if (cat === 'back_matter') {
      breakdown.teacher.total += 1;
      if (status === 'complete') breakdown.teacher.complete += 1;
    }

    return {
      component: comp,
      sequenceNumber: idx + 1,
      status,
      isInherited,
    };
  });

  const weightedRequiredScore = completedRequired + (draftingRequired * 0.5);
  const requiredPercent =
    totalRequired > 0 ? Math.round((weightedRequiredScore / totalRequired) * 100) : 0;
  const weightedOverallScore = overallCompleted + (overallDrafting * 0.5);
  const overallPercent =
    components.length > 0 ? Math.round((weightedOverallScore / components.length) * 100) : 0;

  return {
    totalComponents: components.length,
    totalRequired,
    completedRequired,
    draftingRequired,
    overallCompleted,
    overallDrafting,
    requiredPercent,
    overallPercent,
    breakdown,
    componentsWithStatus,
  };
}

export function calculateArchitectureCompletionStats(
  chapter: StudioChapter,
  architecture: BookArchitectureConfig
) {
  const stats = getArchitectureCompletionStats(chapter, architecture);
  return {
    ...stats,
    percentage: stats.requiredPercent,
    complete: stats.completedRequired,
    total: stats.totalRequired,
  };
}

// ---------------------------------------------------------------------------
// 4. Pedagogical Flow (10-Stage Model)
// ---------------------------------------------------------------------------

export interface PedagogicalStageStatus {
  id: string;
  stageNumber: number;
  name: string;
  shortLabel: string;
  description: string;
  isPresent: boolean;
  status: 'covered' | 'partial' | 'missing';
  evidence: string[];
  recommendation?: string;
}

export interface PedagogicalFlowReport {
  stages: PedagogicalStageStatus[];
  coveredCount: number;
  totalStages: number;
  coveragePercent: number;
  missingStages: string[];
}

export function detectPedagogicalFlowStages(chapter: StudioChapter): PedagogicalFlowReport {
  const stagesDef: Array<{
    id: string;
    num: number;
    name: string;
    label: string;
    desc: string;
    detector: (ch: StudioChapter) => { isPresent: boolean; status: 'covered' | 'partial' | 'missing'; evidence: string[]; rec?: string };
  }> = [
    {
      id: 'flow-1',
      num: 1,
      name: 'Discover / Observe',
      label: '1. Discover',
      desc: 'Introductory problem, real-world context, or provocative hook activating inductive observation.',
      detector: (ch) => {
        const hasHook = !!ch.opening?.openingHook && ch.opening.openingHook.length > 30;
        const hasTextIntro = ch.sections?.some((s) =>
          s.blocks?.some((b) => b.type === 'text' && b.textContent?.includes('?'))
        );
        if (hasHook || hasTextIntro) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Chapter opening hook present', 'Inductive observation text found'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Add a provocative real-world hook or inductive observation to Chapter Opener.',
        };
      },
    },
    {
      id: 'flow-2',
      num: 2,
      name: 'Understand',
      label: '2. Understand',
      desc: 'Clear semantic and structural explanation breaking down linguistic mechanics.',
      detector: (ch) => {
        const textCount = ch.sections?.reduce(
          (acc, s) => acc + (s.blocks?.filter((b) => b.type === 'text').length || 0),
          0
        );
        if (textCount >= 2) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: [`${textCount} explanatory text blocks formatted`],
          };
        }
        if (textCount === 1) {
          return {
            isPresent: true,
            status: 'partial',
            evidence: ['1 explanatory block present'],
            rec: 'Deepen syntactic explanation with comparative discussion.',
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Provide clear linguistic exposition in Section 1.',
        };
      },
    },
    {
      id: 'flow-3',
      num: 3,
      name: 'Rule / Concept Formulation',
      label: '3. Rule Form',
      desc: 'Explicit grammatical law, formal pattern definition, or bordered parchment rule box.',
      detector: (ch) => {
        const ruleBlocks = ch.sections?.flatMap((s) =>
          (s.blocks || []).filter((b) => b.type === 'grammar_rule' || (b.type as string) === 'rule_box')
        );
        if (ruleBlocks.length >= 1) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: [`${ruleBlocks.length} explicit Grammar Rule box(es) declared`],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Insert a formal "The Fundamental Concord Law" or rule box.',
        };
      },
    },
    {
      id: 'flow-4',
      num: 4,
      name: 'Modelled Examples',
      label: '4. Modelled Ex',
      desc: 'Worked example with step-by-step commentary, rationale, and contrastive pairs.',
      detector: (ch) => {
        const workedBlocks = ch.sections?.flatMap((s) =>
          (s.blocks || []).filter((b) => b.type === 'worked_example')
        );
        const exampleSets = ch.sections?.flatMap((s) =>
          (s.blocks || []).filter((b) => b.type === 'example_set')
        );
        if (workedBlocks.length >= 1) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Worked Example with step-by-step commentary present'],
          };
        }
        if (exampleSets.length >= 1) {
          return {
            isPresent: true,
            status: 'partial',
            evidence: ['Specimen examples found, but lacks full commentary steps'],
            rec: 'Add a full Worked Example step-by-step breakdown.',
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Include modelled worked examples demonstrating cognitive problem solving.',
        };
      },
    },
    {
      id: 'flow-5',
      num: 5,
      name: 'Guided Practice',
      label: '5. Guided',
      desc: 'Low-stakes check-for-understanding drills with hints or teacher scaffolds.',
      detector: (ch) => {
        const hasGuidedDrill = ch.sections?.some((s) =>
          s.title?.toLowerCase().includes('guided') ||
          s.blocks?.some((b) => b.title?.toLowerCase().includes('guided'))
        );
        const exA = ch.exercises?.[0];
        if (hasGuidedDrill || (exA && exA.progression === 'foundation')) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Immediate guided drill / Foundation Exercise A present'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Provide Guided Practice check-in before independent exercises.',
        };
      },
    },
    {
      id: 'flow-6',
      num: 6,
      name: 'Independent Practice',
      label: '6. Independent',
      desc: 'Structured graded exercises (Recognition, Selection, Transformation, Editing).',
      detector: (ch) => {
        const exCount = ch.exercises?.length || 0;
        if (exCount >= 3) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: [`${exCount} independent exercises configured (A, B, C...)`],
          };
        }
        if (exCount >= 1) {
          return {
            isPresent: true,
            status: 'partial',
            evidence: [`${exCount} exercise(s) present; recommended at least 3 tiers`],
            rec: 'Expand practice sets to cover multiple exercise typologies.',
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Author graded practice exercises for independent student work.',
        };
      },
    },
    {
      id: 'flow-7',
      num: 7,
      name: 'Application & Synthesis',
      label: '7. Application',
      desc: 'Contextual usage, continuous prose passage editing, or authentic composition.',
      detector: (ch) => {
        const hasEditing = ch.exercises?.some(
          (e) =>
            e.progression === 'error_analysis' ||
            e.title.toLowerCase().includes('editing') ||
            e.title.toLowerCase().includes('composition')
        );
        if (hasEditing) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Passage editing or contextual composition exercise included'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Add authentic passage proofreading or creative composition drill.',
        };
      },
    },
    {
      id: 'flow-8',
      num: 8,
      name: 'Challenge & High-Order Reasoning',
      label: '8. Challenge',
      desc: 'Olympiad-style teaser, inverted syntax, or linguistic edge-cases.',
      detector: (ch) => {
        const hasChallenge =
          ch.sections?.some((s) => s.title?.toLowerCase().includes('challenge')) ||
          ch.exercises?.some((e) => e.progression === 'challenge');
        if (hasChallenge) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Challenge Drill / High-Order Problem specified'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Consider adding a high-order linguistic challenge problem.',
        };
      },
    },
    {
      id: 'flow-9',
      num: 9,
      name: 'Review & Metacognition',
      label: '9. Review',
      desc: 'Bullet-point rules-at-a-glance, summary checklists, or common pitfalls review.',
      detector: (ch) => {
        const hasRulesGlance = (ch.ending?.rulesAtAGlance?.length || 0) > 0;
        const hasChecklist = (ch.ending?.quickRevisionChecklist?.length || 0) > 0;
        if (hasRulesGlance || hasChecklist) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Rules at a glance and revision summary formatted'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Complete Chapter Review summary and Rules-at-a-Glance in ending matter.',
        };
      },
    },
    {
      id: 'flow-10',
      num: 10,
      name: 'Formal Assessment',
      label: '10. Assess',
      desc: 'Graded chapter mastery test with board-aligned marking schemes and answer keys.',
      detector: (ch) => {
        const testQuestions = (ch.chapterTest?.sections || []).flatMap((s) => s.questions || []);
        const hasTest = !!ch.chapterTest && testQuestions.length >= 2;
        if (hasTest) {
          return {
            isPresent: true,
            status: 'covered',
            evidence: ['Chapter Mastery Test series configured with questions'],
          };
        }
        return {
          isPresent: false,
          status: 'missing',
          evidence: [],
          rec: 'Configure formal Chapter Assessment / Mastery Test.',
        };
      },
    },
  ];

  const stages: PedagogicalStageStatus[] = stagesDef.map((s) => {
    const res = s.detector(chapter);
    return {
      id: s.id,
      stageNumber: s.num,
      name: s.name,
      shortLabel: s.label,
      description: s.desc,
      isPresent: res.isPresent,
      status: res.status,
      evidence: res.evidence,
      recommendation: res.rec,
    };
  });

  const coveredCount = stages.filter((s) => s.status === 'covered').length;
  const coveragePercent = Math.round((coveredCount / stages.length) * 100);
  const missingStages = stages.filter((s) => s.status === 'missing').map((s) => s.name);

  return {
    stages,
    coveredCount,
    totalStages: stages.length,
    coveragePercent,
    missingStages,
  };
}

// ---------------------------------------------------------------------------
// 5. Chapter Architecture Audit (Advisory Checks)
// ---------------------------------------------------------------------------

export type AuditSeverity = 'info' | 'suggestion' | 'needs_review' | 'potential_gap';

export interface ArchitectureAuditFinding {
  id: string;
  category: 'Structure' | 'Pedagogy' | 'Practice' | 'Visuals' | 'Assessment' | 'Editorial';
  title: string;
  description: string;
  severity: AuditSeverity;
  recommendation: string;
  componentRef?: string;
}

export interface ArchitectureAuditSummary {
  overallHealthScore: number;
  findings: ArchitectureAuditFinding[];
  severityCounts: {
    potential_gap: number;
    needs_review: number;
    suggestion: number;
    info: number;
  };
  disclaimer: string;
}

export function auditChapterArchitecture(
  chapter: StudioChapter,
  architecture: BookArchitectureConfig
): ArchitectureAuditSummary {
  const findings: ArchitectureAuditFinding[] = [];
  const components = architecture.chapterArchitecture?.components || [];

  // Check 1: Required component missing / empty
  components.forEach((comp) => {
    if (comp.isRequired) {
      const status = calculateComponentStatus(chapter, comp, 0);
      if (status === 'not_started') {
        findings.push({
          id: `audit-missing-${comp.id}`,
          category: 'Structure',
          title: `Required Component Not Started: ${comp.name}`,
          description: `The book architecture prescribes "${comp.name}" as mandatory for standard ${comp.editionTarget} editions.`,
          severity: 'potential_gap',
          recommendation: `Author content for "${comp.name}" (~${comp.defaultEstimatedPages} pp allocated) or mark Not Applicable if intentionally omitted for this chapter.`,
          componentRef: comp.id,
        });
      }
    }
  });

  // Check 2: Objectives missing
  const objCount = chapter.opening?.learningObjectives?.length || 0;
  if (objCount === 0) {
    findings.push({
      id: 'audit-obj-none',
      category: 'Pedagogy',
      title: 'Missing Chapter Learning Objectives',
      description: 'No explicit learning objectives are formulated for this chapter opening.',
      severity: 'potential_gap',
      recommendation: 'Formulate 3–5 behavioral learning objectives using Bloom taxonomy verbs (Identify, Apply, Resolve).',
    });
  } else if (objCount < 3) {
    findings.push({
      id: 'audit-obj-few',
      category: 'Pedagogy',
      title: 'Limited Learning Objectives',
      description: `Only ${objCount} learning objective(s) specified. Academic publishing standards recommend 3–5 per chapter.`,
      severity: 'suggestion',
      recommendation: 'Add 1 or 2 more granular curriculum objectives.',
    });
  }

  // Check 3: Rule without example
  const ruleBlocks = chapter.sections?.flatMap((s) =>
    (s.blocks || []).filter((b) => b.type === 'grammar_rule' || (b.type as string) === 'rule_box')
  );
  const exampleBlocks = chapter.sections?.flatMap((s) =>
    (s.blocks || []).filter((b) => b.type === 'example_set')
  );
  if (ruleBlocks.length > 0 && exampleBlocks.length === 0) {
    findings.push({
      id: 'audit-rule-no-ex',
      category: 'Pedagogy',
      title: 'Grammar Rule Declared Without Specimen Examples',
      description: 'A formal rule box is present, but no paired Example Set block is attached to anchor student intuition.',
      severity: 'needs_review',
      recommendation: 'Add an Example Set block with contrastive pairs showing correct versus incorrect applications.',
    });
  }

  // Check 4: Explanation without practice
  const hasExplanation = (chapter.sections || []).length > 0;
  const hasExercises = (chapter.exercises || []).length > 0;
  if (hasExplanation && !hasExercises) {
    findings.push({
      id: 'audit-no-practice',
      category: 'Practice',
      title: 'Instruction Without Practice Drills',
      description: 'Chapter contains theory sections but no graded practice exercises.',
      severity: 'potential_gap',
      recommendation: 'Author at least Exercise A (Recognition) and Exercise B (Selection) to reinforce syntactic concepts.',
    });
  }

  // Check 5: Exercise without answer
  const exercises = chapter.exercises || [];
  exercises.forEach((ex) => {
    const unAnswered = (ex.questions || []).filter((q) => !q.correctAnswer && !q.modelAnswer);
    if (unAnswered.length > 0) {
      findings.push({
        id: `audit-unanswered-${ex.id}`,
        category: 'Practice',
        title: `Incomplete Answer Key for Exercise ${ex.letter}`,
        description: `${unAnswered.length} of ${ex.questions.length} question(s) lack an answer key or model answer.`,
        severity: 'needs_review',
        recommendation: `Provide correct answers or model solutions for Exercise ${ex.letter} to support self-evaluation.`,
      });
    }
  });

  // Check 6: Exercise progression imbalance
  if (exercises.length >= 2) {
    const progressions = exercises.map((e) => e.progression);
    const hasFoundation = progressions.includes('foundation') || progressions.includes('understanding');
    const hasApplication = progressions.includes('application') || progressions.includes('transformation');
    if (!hasFoundation && hasApplication) {
      findings.push({
        id: 'audit-prog-skip-foundation',
        category: 'Practice',
        title: 'Exercise Progression Skips Foundation Stage',
        description: 'Practice jumps directly to application/transformation without initial recognition or identification drills.',
        severity: 'suggestion',
        recommendation: 'Introduce a diagnostic Exercise A for recognition/underlining before complex sentence rewriting.',
      });
    }
  }

  // Check 7: Missing assessment / test
  const testQuestions = (chapter.chapterTest?.sections || []).flatMap((s) => s.questions || []);
  if (!chapter.chapterTest || testQuestions.length === 0) {
    findings.push({
      id: 'audit-no-test',
      category: 'Assessment',
      title: 'Chapter Mastery Test Not Configured',
      description: 'No formal end-of-chapter assessment test is attached.',
      severity: 'needs_review',
      recommendation: 'Configure a 15–20 mark Chapter Mastery Test covering all key concepts.',
    });
  }

  // Check 8: Missing answer key
  if (!chapter.answerKey || chapter.answerKey.length === 0) {
    findings.push({
      id: 'audit-no-ans-key-section',
      category: 'Assessment',
      title: 'Back-Matter Answer Key Notes Not Populated',
      description: 'The master answer key entries for teacher edition have not been generated.',
      severity: 'info',
      recommendation: 'Compile comprehensive answer rationale and marking schemes in the Answer Key stage.',
    });
  }

  // Check 9: Component 5 — Theoretical Content & Syntactic Analysis Audit
  const c05 = chapter.component05;
  if (c05) {
    // 9a. Missing or truncated theoretical explanation
    if (!c05.conceptualExplanation || c05.conceptualExplanation.trim().length < 150) {
      findings.push({
        id: 'audit-comp5-missing-explanation',
        category: 'Pedagogy',
        title: 'Component 5: Incomplete Theoretical Explanation',
        description: 'Theoretical explanation is either missing or too brief (< 150 chars) to establish rigorous conceptual foundation.',
        severity: 'needs_review',
        recommendation: 'Expand the core concept explanation to 250–450 words with progressive pedagogical sequencing.',
        componentRef: 'comp-5',
      });
    }

    // 9b. Topic consistency check
    const topicKeywords = (chapter.grammarStrand || chapter.title || '').toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const explanationLower = (c05.conceptualExplanation || '').toLowerCase();
    const matchesTopic =
      topicKeywords.some((kw) => explanationLower.includes(kw)) ||
      explanationLower.includes('concord') ||
      explanationLower.includes('agreement') ||
      explanationLower.includes('subject') ||
      explanationLower.includes('verb');
    if (c05.conceptualExplanation && !matchesTopic) {
      findings.push({
        id: 'audit-comp5-topic-inconsistency',
        category: 'Pedagogy',
        title: 'Component 5: Explanation Inconsistent with Chapter Topic',
        description: 'Theoretical explanation does not contain the key grammatical concepts or terminology for this chapter.',
        severity: 'needs_review',
        recommendation: 'Align the explanation with the chapter topic and curriculum syllabus.',
        componentRef: 'comp-5',
      });
    }

    // 9c. Excessive repetition of Component 4
    const vignetteText = chapter.opening?.discoveryVignette || '';
    if (vignetteText && c05.conceptualExplanation && c05.conceptualExplanation.includes(vignetteText.slice(0, 100))) {
      findings.push({
        id: 'audit-comp5-repetition',
        category: 'Pedagogy',
        title: 'Component 5: Excessive Repetition of Discovery Vignette',
        description: 'The theoretical explanation duplicates the narrative text of Component 4 rather than providing conceptual analysis.',
        severity: 'potential_gap',
        recommendation: 'Synthesize the linguistic principles observed in the vignette rather than repeating the dialogue.',
        componentRef: 'comp-5',
      });
    }

    // 9d. Missing or incomplete syntactic analysis
    const analyses = Array.isArray(c05.syntacticAnalysis) ? c05.syntacticAnalysis : [];
    if (analyses.length < 2) {
      findings.push({
        id: 'audit-comp5-missing-syntax',
        category: 'Pedagogy',
        title: 'Component 5: Missing Syntactic Analysis Models',
        description: 'Component 5 requires structured sentence breakdowns (subject head noun, expanded subject, verb phrase, concord).',
        severity: 'needs_review',
        recommendation: 'Provide 3–5 analysed sentence models demonstrating head noun isolation and concord relations.',
        componentRef: 'comp-5',
      });
    } else {
      analyses.forEach((item, aIdx) => {
        if (!item.sentence || !item.subjectHeadNoun || !item.verbPhrase) {
          findings.push({
            id: `audit-comp5-syntax-incomplete-${aIdx}`,
            category: 'Pedagogy',
            title: `Component 5: Incomplete Sentence Model #${aIdx + 1}`,
            description: 'Model sentence is missing head noun or verb phrase identification.',
            severity: 'suggestion',
            recommendation: 'Specify the grammatical subject head noun and verb phrase clearly.',
            componentRef: 'comp-5',
          });
        }
      });
    }

    // 9e. Missing Concept Checks (Pause & Think)
    const checks = Array.isArray(c05.conceptChecks) ? c05.conceptChecks : [];
    if (checks.length === 0) {
      findings.push({
        id: 'audit-comp5-missing-checks',
        category: 'Pedagogy',
        title: 'Component 5: Missing "Pause & Think" Concept Checks',
        description: 'No embedded reflection questions provided to encourage students to pause and test their understanding.',
        severity: 'suggestion',
        recommendation: 'Add 2–4 short conceptual reasoning prompts embedded inside the explanation.',
        componentRef: 'comp-5',
      });
    }

    // 9f. Missing Language Insight
    if (!c05.linguisticInsight || c05.linguisticInsight.trim().length < 15) {
      findings.push({
        id: 'audit-comp5-missing-insight',
        category: 'Pedagogy',
        title: 'Component 5: Missing Language Insight Callout',
        description: 'No concise linguistic insight is highlighted to encapsulate the underlying syntactic architecture.',
        severity: 'suggestion',
        recommendation: 'Add a memorable 25–50 word language insight callout for students.',
        componentRef: 'comp-5',
      });
    }
  }

  // Check 9b: Component 6 — Grammar Rules & Structural Form Boxes Audit
  const c06 = chapter.component06;
  if (c06) {
    if (!c06.formalRuleStatement || c06.formalRuleStatement.trim().length < 30) {
      findings.push({
        id: 'audit-comp6-missing-master-rule',
        category: 'Pedagogy',
        title: 'Component 6: Incomplete Principal Rule Statement',
        description: 'The master rule statement is missing or too brief to articulate the definitive grammatical law.',
        severity: 'needs_review',
        recommendation: 'Provide an authoritative, unambiguous principal rule statement for the chapter.',
        componentRef: 'comp-6',
      });
    }

    if (!c06.structuralFormula || c06.structuralFormula.trim().length === 0) {
      findings.push({
        id: 'audit-comp6-missing-formula',
        category: 'Pedagogy',
        title: 'Component 6: Missing Structural Formula',
        description: 'A visual structural formula box is required to provide learners with an abstract grammatical template.',
        severity: 'suggestion',
        recommendation: 'Formulate a tokenized syntactic formula (e.g., [Head Noun] + (intervening phrase) ⟶ [Finite Verb]).',
        componentRef: 'comp-6',
      });
    }

    const variations = Array.isArray(c06.ruleVariations) ? c06.ruleVariations : [];
    if (variations.length < 2) {
      findings.push({
        id: 'audit-comp6-insufficient-variations',
        category: 'Pedagogy',
        title: 'Component 6: Insufficient Sub-Rule Variations',
        description: 'A canonical grammar chapter must provide at least 2 distinct structural sub-rules or variations.',
        severity: 'needs_review',
        recommendation: 'Add sub-rule variations covering common syntactic patterns and structural conditions.',
        componentRef: 'comp-6',
      });
    }

    variations.forEach((v, vIdx) => {
      if (!v.correctExample || !v.incorrectExample) {
        findings.push({
          id: `audit-comp6-variation-contrast-missing-${vIdx}`,
          category: 'Pedagogy',
          title: `Component 6: Missing Contrastive Pair in Rule ${vIdx + 1}`,
          description: `Rule variation "${v.title || `#${vIdx + 1}`}" lacks an explicit contrastive pair (correct exemplar vs. incorrect counter-example).`,
          severity: 'suggestion',
          recommendation: 'Provide both a verified positive exemplar and an illustrative negative exemplar marked with an asterisk (*).',
          componentRef: 'comp-6',
        });
      }
    });

    const exceptions = Array.isArray(c06.exceptions) ? c06.exceptions : [];
    if (exceptions.length === 0) {
      findings.push({
        id: 'audit-comp6-no-exceptions',
        category: 'Pedagogy',
        title: 'Component 6: No Caution or Exceptions Noted',
        description: 'Grammar rules in secondary education curricula benefit from explicit boundary caution boxes.',
        severity: 'info',
        recommendation: 'Document common syntactic edge cases or exception traps in the Caution Box.',
        componentRef: 'comp-6',
      });
    }
  }

  // Check 9: Visual missing caption / alt text
  const visualBlocks = chapter.sections?.flatMap((s) =>
    (s.blocks || []).filter((b) => b.type === 'visual')
  );
  visualBlocks.forEach((vb) => {
    if (!vb.visualData?.caption || vb.visualData.caption.trim().length === 0) {
      findings.push({
        id: `audit-vis-no-caption-${vb.id}`,
        category: 'Visuals',
        title: `Figure Missing Caption: "${vb.title || 'Untitled Visual'}"`,
        description: 'Publishing design guidelines require every figure to feature a caption explaining the grammatical diagram.',
        severity: 'needs_review',
        recommendation: 'Add an informative caption with figure number (e.g. "Figure 6.1: The Agreement Balance Scale").',
      });
    }
    if (!vb.visualData?.altText || vb.visualData.altText.trim().length === 0) {
      findings.push({
        id: `audit-vis-no-alt-${vb.id}`,
        category: 'Visuals',
        title: `Figure Missing Alt Text (Accessibility): "${vb.title || 'Untitled Visual'}"`,
        description: 'Digital curriculum guidelines require accessibility alt text describing the diagram.',
        severity: 'suggestion',
        recommendation: 'Add descriptive alt text for screen readers.',
      });
    }
  });

  // Check 10: Pedagogical stage gaps
  const flow = detectPedagogicalFlowStages(chapter);
  if (flow.missingStages.length > 3) {
    findings.push({
      id: 'audit-flow-gap',
      category: 'Pedagogy',
      title: `Multiple Pedagogical Flow Stages Missing (${flow.missingStages.length} Stages)`,
      description: `Key instructional stages are unaddressed: ${flow.missingStages.join(', ')}.`,
      severity: 'needs_review',
      recommendation: 'Review the 10-Stage Pedagogical Flow in Chapter Studio to balance the instructional arc.',
    });
  }

  // Check 11: Page allocation estimation
  const totalAllocatedPages = components.reduce(
    (acc, c) => acc + (c.defaultEstimatedPages || 0),
    0
  );
  const words = (chapter.sections || []).flatMap((s) => s.blocks || []).reduce(
    (acc, b) => acc + (b.textContent?.split(/\s+/).length || 0),
    0
  );
  const roughActualPages = Math.max(1, Math.round(words / 350));
  if (roughActualPages > totalAllocatedPages * 1.5 && totalAllocatedPages > 0) {
    findings.push({
      id: 'audit-page-overflow',
      category: 'Editorial',
      title: `Estimated Page Allocation Significantly Exceeded`,
      description: `Manuscript length (~${roughActualPages} pages based on word count) exceeds the allocated ${totalAllocatedPages} pages by more than 50%.`,
      severity: 'suggestion',
      recommendation: 'Review prose density or increase page budget in Book Architecture.',
    });
  }

  // Calculate severity counts
  const severityCounts = {
    potential_gap: findings.filter((f) => f.severity === 'potential_gap').length,
    needs_review: findings.filter((f) => f.severity === 'needs_review').length,
    suggestion: findings.filter((f) => f.severity === 'suggestion').length,
    info: findings.filter((f) => f.severity === 'info').length,
  };

  // Compute overall score (100 minus weighted penalties)
  const penalty =
    severityCounts.potential_gap * 12 +
    severityCounts.needs_review * 6 +
    severityCounts.suggestion * 2;
  const overallHealthScore = Math.max(25, 100 - penalty);

  return {
    overallHealthScore,
    findings,
    severityCounts,
    disclaimer:
      'Advisory publisher audit. These recommendations are based on VERITAS academic publishing standards and do not claim official CBSE, CISCE, or Cambridge assessment approval or endorsement.',
  };
}

// ---------------------------------------------------------------------------
// 6. Create Chapter from Architecture (Structural Framework Only)
// ---------------------------------------------------------------------------

/**
 * Creates structural placeholder slots for configured components.
 * Strictly adheres to requirement: DO NOT fabricate full chapter prose.
 */
export function createChapterFromArchitecture(
  archOrTitle: BookArchitectureConfig | string,
  topicIdOrCategory: string,
  titleOrClassLevel?: string,
  chapterNumberOrArchitecture?: number | BookArchitectureConfig,
  classLevelOrChapterNumber?: string | number,
  boardOrSystemId?: string
): StudioChapter {
  let architecture: BookArchitectureConfig;
  let title: string;
  let category: string;
  let classLevel: string;
  let chapterNumber: number;
  let chapterId: string;

  if (typeof archOrTitle === 'object') {
    // Called as: (arch, newTopicId, title, chapterNumber, classLevel, board)
    architecture = archOrTitle;
    chapterId = topicIdOrCategory || `top-${Date.now()}`;
    chapterNumber = typeof chapterNumberOrArchitecture === 'number' ? chapterNumberOrArchitecture : 1;
    title = titleOrClassLevel || `Chapter ${chapterNumber}: Untitled Chapter`;
    classLevel = typeof classLevelOrChapterNumber === 'string' ? classLevelOrChapterNumber : 'Class 6';
    category = 'General';
  } else {
    // Called as: (title, category, classLevel, architecture, chapterNumber)
    category = topicIdOrCategory || 'General';
    classLevel = titleOrClassLevel || 'Class 6';
    architecture = (chapterNumberOrArchitecture as BookArchitectureConfig);
    chapterNumber = typeof classLevelOrChapterNumber === 'number' ? classLevelOrChapterNumber : 1;
    title = archOrTitle || `Chapter ${chapterNumber}: Untitled Chapter`;
    chapterId = `top-${Date.now()}`;
  }

  const isGrammar = /grammar|syntax|english language/i.test(category || '') || /grammar|syntax/i.test(title || '');
  const isMath = /math/i.test(category || '') || /algebra|geometry|calculus|arithmetic/i.test(title || '');
  const isScience = /science|biology|physics|chemistry/i.test(category || '');

  const components = architecture.chapterArchitecture?.components || [];

  const defaultOpening: ChapterOpeningData = {
    chapterNumber,
    title,
    subtitle: isGrammar ? `${category} Structural Framework` : `${category} Curriculum Framework`,
    openingHook: '',
    shortIntroduction: '',
    learningObjectives: isGrammar
      ? [
          `Define the core linguistic principles of ${title}`,
          `Apply structural rules with grammatical precision`,
          `Identify and rectify frequent errors in examination contexts`,
        ]
      : [
          `Understand the foundational concepts and principles of ${title}`,
          `Apply core conceptual frameworks and methods in practice`,
          `Identify and rectify common misconceptions in examinations`,
        ],
    keyVocabulary: [title, isGrammar ? 'Rule' : isMath ? 'Formula' : 'Concept', 'Core Principle'],
    conceptsCovered: [title, 'Core Concepts', 'Common Misconceptions'],
    priorKnowledge: 'Foundational prerequisite concepts and grade-level skills.',
    estimatedStudyTimeMinutes: 90,
  };

  // Construct placeholder sections based on instruction components
  const sections: ChapterSection[] = [];
  let secOrder = 1;

  const introComp = components.find((c) => c.category === 'instruction' || c.id === 'comp-4');
  if (introComp) {
    sections.push({
      id: `sec-${Date.now()}-1`,
      chapterId: `ch-${Date.now()}`,
      numberLabel: `${chapterNumber}.1`,
      title: 'Introduction & Core Concepts',
      order: secOrder++,
      blocks: [
        {
          id: `blk-${Date.now()}-rule`,
          type: isGrammar ? 'grammar_rule' : 'key_concept',
          title: `${title} Principle`,
          calloutTitle: isGrammar
            ? `RULE: ${title.toUpperCase()}`
            : isMath
            ? `FORMULA / THEOREM: ${title.toUpperCase()}`
            : `KEY PRINCIPLE: ${title.toUpperCase()}`,
          calloutText: isGrammar
            ? 'Formal grammatical rule statement to be authored.'
            : 'Formal concept, theorem, or principle statement to be authored.',
          order: 1,
          visibility: 'student',
        },
      ],
    });
  }

  // Construct standard graded exercises A through E based on architecture
  const exercises: StudioExercise[] = isGrammar
    ? [
        {
          id: `ex-${Date.now()}-A`,
          letter: 'A',
          title: 'Exercise A: Recognition & Identification',
          progression: 'foundation',
          instructions: `Identify and underline the target ${title.toLowerCase()} structures in each sentence.`,
          difficulty: 'Easy',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-B`,
          letter: 'B',
          title: 'Exercise B: Fill in the Blanks / Selection',
          progression: 'understanding',
          instructions: 'Select the correct grammatical form from the brackets.',
          difficulty: 'Medium',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-C`,
          letter: 'C',
          title: 'Exercise C: Sentence Rewriting & Transformation',
          progression: 'transformation',
          instructions: 'Rewrite the following sentences according to the given instructions.',
          difficulty: 'Medium',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-D`,
          letter: 'D',
          title: 'Exercise D: Error Correction & Editing',
          progression: 'error_analysis',
          instructions: 'Identify the grammatical error in each sentence and write the correction.',
          difficulty: 'Hard',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-E`,
          letter: 'E',
          title: 'Exercise E: Contextual Application & Composition',
          progression: 'contextual',
          instructions: 'Compose sentences demonstrating the correct application of the rules.',
          difficulty: 'Hard',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
      ]
    : [
        {
          id: `ex-${Date.now()}-A`,
          letter: 'A',
          title: 'Exercise A: Foundation & Key Concepts',
          progression: 'foundation',
          instructions: `Answer the following introductory questions on ${title}.`,
          difficulty: 'Easy',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-B`,
          letter: 'B',
          title: 'Exercise B: Core Understanding & Application',
          progression: 'understanding',
          instructions: 'Apply the core principles to solve the following problems.',
          difficulty: 'Medium',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-C`,
          letter: 'C',
          title: 'Exercise C: Analysis & Problem Solving',
          progression: 'transformation',
          instructions: 'Solve the following analytical questions with full reasoning.',
          difficulty: 'Medium',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-D`,
          letter: 'D',
          title: 'Exercise D: Critical Evaluation & Common Pitfalls',
          progression: 'error_analysis',
          instructions: 'Identify common errors or fallacies and provide accurate corrections.',
          difficulty: 'Hard',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
        {
          id: `ex-${Date.now()}-E`,
          letter: 'E',
          title: 'Exercise E: Advanced Synthesis & Extension',
          progression: 'contextual',
          instructions: 'Complete the following comprehensive synthesis and challenge problems.',
          difficulty: 'Hard',
          suggestedMarks: 5,
          questionCount: 0,
          questions: [],
        },
      ];

  const defaultEnding: ChapterEndingData = {
    whatYouLearned: [`Core definition and application of ${title}.`],
    rulesAtAGlance: [
      {
        rule: isGrammar
          ? `Fundamental Rule for ${title}`
          : isMath
          ? `Key Formula/Method for ${title}`
          : `Core Principle of ${title}`,
        example: 'Consult chapter notes for specimen usage.',
      },
    ],
    commonMistakes: [],
    quickRevisionChecklist: ['Reviewed core principles', 'Completed exercises'],
    keyVocabulary: [title],
    examReminders: ['Review core concepts and verify all steps carefully.'],
  };

  const initialCustomizations: Record<string, ChapterComponentCustomization> = {};
  components.forEach((comp) => {
    initialCustomizations[comp.id] = {
      componentId: comp.id,
      name: comp.name,
      status: 'not_started',
      isCustomized: false,
      allocatedPages: comp.defaultEstimatedPages,
    };
  });

  return {
    id: chapterId,
    chapterNumber,
    title,
    equivalentClass: (classLevel as any) || 'Class 6',
    category,
    workflowStatus: 'writing',
    opening: defaultOpening,
    sections,
    exercises,
    ending: defaultEnding,
    architectureState: {
      inheritedFromBookId: architecture.purposePositioning?.targetLearner?.classOrStage || 'CBSE-6',
      architectureVersion: '1.0.0',
      hasPendingUpdate: false,
      isCustomized: false,
      customizations: initialCustomizations,
    },
    lastSaved: new Date().toISOString(),
    saveStatus: 'saved',
  };
}

// ---------------------------------------------------------------------------
// 12. Component <-> Studio View Mapping
// ---------------------------------------------------------------------------

/**
 * Maps an Architecture component (by ID or component anatomy) to its authorable studio view and sectionId.
 * Guarantees a valid, non-empty authorable view (defaulting safely to 'opener' for comp-1).
 */
export function mapComponentToStudioView(
  componentOrId: string | ChapterComponentAnatomy | undefined | null,
  architecture?: BookArchitectureConfig,
  defaultSectionId?: string
): { viewId: string; sectionId?: string; componentId: string } {
  if (!componentOrId) {
    return { viewId: 'opener', componentId: 'comp-1' };
  }

  let comp: ChapterComponentAnatomy | undefined;
  let id = '';

  if (typeof componentOrId === 'string') {
    id = componentOrId;
    comp = architecture?.chapterArchitecture?.components?.find((c) => c.id === id);
  } else {
    comp = componentOrId;
    id = comp.id;
  }

  const nameLower = (comp?.name || '').toLowerCase();
  const category = comp?.category || '';

  if (id === 'comp-1' || nameLower.includes('opener')) {
    return { viewId: 'opener', componentId: id || 'comp-1' };
  }
  if (id === 'comp-2' || nameLower.includes('objective')) {
    return { viewId: 'objectives', componentId: id || 'comp-2' };
  }
  if (id === 'comp-3' || nameLower.includes('warm-up') || nameLower.includes('prior knowledge')) {
    return { viewId: 'warm_up', componentId: id || 'comp-3' };
  }
  if (id === 'comp-4' || nameLower.includes('concept introduction')) {
    return { viewId: 'concept_intro', componentId: id || 'comp-4' };
  }
  if (id === 'comp-5' || nameLower.includes('explanation') || nameLower.includes('syntactic analysis')) {
    return { viewId: 'explanation', sectionId: defaultSectionId, componentId: id || 'comp-5' };
  }
  if (id === 'comp-6' || nameLower.includes('rule') || nameLower.includes('form box')) {
    return { viewId: 'rules', componentId: id || 'comp-6' };
  }
  if (id === 'comp-7' || (nameLower.includes('example') && !nameLower.includes('worked'))) {
    return { viewId: 'examples', componentId: id || 'comp-7' };
  }
  if (id === 'comp-8' || nameLower.includes('visual') || nameLower.includes('diagram')) {
    return { viewId: 'visuals', componentId: id || 'comp-8' };
  }
  if (id === 'comp-9' || nameLower.includes('worked example')) {
    return { viewId: 'worked_examples', componentId: id || 'comp-9' };
  }
  if (id === 'comp-10' || nameLower.includes('common error') || nameLower.includes('pitfall')) {
    return { viewId: 'common_errors', componentId: id || 'comp-10' };
  }
  if (id === 'comp-11' || nameLower.includes('tip') || nameLower.includes('mnemonic') || nameLower.includes('remember')) {
    return { viewId: 'tips', componentId: id || 'comp-11' };
  }
  if (id === 'comp-12' || nameLower.includes('guided practice')) {
    return { viewId: 'guided_practice', componentId: id || 'comp-12' };
  }
  if (id === 'comp-19' || nameLower.includes('challenge') || nameLower.includes('olympiad')) {
    return { viewId: 'challenge', componentId: id || 'comp-19' };
  }
  if (category === 'practice' || nameLower.includes('exercise') || nameLower.includes('drill')) {
    return { viewId: 'exercises', componentId: id || 'comp-13' };
  }
  if (id === 'comp-20' || nameLower.includes('summary') || nameLower.includes('at a glance') || nameLower.includes('wrap-up')) {
    return { viewId: 'summary', componentId: id || 'comp-20' };
  }
  if (id === 'comp-21' || nameLower.includes('assessment') || nameLower.includes('mastery test')) {
    return { viewId: 'test', componentId: id || 'comp-21' };
  }
  if (id === 'comp-22' || nameLower.includes('answer key')) {
    return { viewId: 'answer_key', componentId: id || 'comp-22' };
  }
  if (id === 'comp-23' || nameLower.includes('teacher') || nameLower.includes('author notes')) {
    return { viewId: 'teacher_notes', componentId: id || 'comp-23' };
  }

  // Safe fallback to Chapter Opener
  return { viewId: 'opener', componentId: 'comp-1' };
}

/**
 * Resolves the matching Architecture Component ID for a given Studio viewId.
 * Returns null for temporary/preview views (e.g. preview, student_preview, teacher_preview, setup, audit)
 * so that activeArchitectureItemId is preserved when viewing preview modes.
 */
export function findComponentIdForAuthoringView(
  viewId: string,
  architecture?: BookArchitectureConfig
): string | null {
  switch (viewId) {
    case 'opener':
      return 'comp-1';
    case 'objectives':
      return 'comp-2';
    case 'warm_up':
      return 'comp-3';
    case 'concept_intro':
      return 'comp-4';
    case 'section':
    case 'explanation':
      return 'comp-5';
    case 'rules':
    case 'concepts':
      return 'comp-6';
    case 'examples':
      return 'comp-7';
    case 'visuals':
      return 'comp-8';
    case 'worked_examples':
      return 'comp-9';
    case 'common_errors':
      return 'comp-10';
    case 'tips':
      return 'comp-11';
    case 'guided_practice':
      return 'comp-12';
    case 'exercises':
      return 'comp-13';
    case 'challenge':
      return 'comp-19';
    case 'summary':
    case 'ending':
      return 'comp-20';
    case 'test':
    case 'assessment':
      return 'comp-21';
    case 'answer_key':
      return 'comp-22';
    case 'teacher_notes':
    case 'teacher_guide':
      return 'comp-23';
    default:
      // For preview, student_preview, teacher_preview, setup, audit, or modal views,
      // return null so that the last authorable activeComponentId is preserved!
      return null;
  }
}

