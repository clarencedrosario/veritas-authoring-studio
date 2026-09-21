import {
  ClassCurriculumBook,
  GrammarTopic,
  BookUnit,
  FrontMatterItem,
  BackMatterItem,
  BookStyleGuide,
  TerminologyEntry,
  GlossaryEntry,
  IndexTermEntry,
  CrossChapterReference,
  BookTeacherMaterial,
  StudioChapter,
  ChapterWorkflowStatus,
} from '../types';

export function ensureBookUnitsAndMetadata(
  book: ClassCurriculumBook,
  seriesTitle = 'Mastering English Grammar & Composition',
  targetBoard = 'CBSE'
): ClassCurriculumBook {
  const updated: ClassCurriculumBook = { ...book };

  // Metadata defaults
  if (!updated.subject) updated.subject = 'English Grammar & Composition';
  if (!updated.edition) updated.edition = '1st Edition (2026–2027)';
  if (!updated.academicYear) updated.academicYear = '2026–2027';
  if (!updated.authorOrEditor) updated.authorOrEditor = 'Veritas Editorial Board & Academic Commission';
  if (!updated.bookStatus) updated.bookStatus = 'In Review';
  if (!updated.targetPageCount) updated.targetPageCount = 180;

  // Units initialization — preserve existing authored units or leave empty for author/architecture generation
  if (!updated.units) {
    updated.units = [];
  } else {
    // Re-verify ordering and numbers of existing units
    updated.units = updated.units.map((u, idx) => ({
      ...u,
      order: u.order || idx + 1,
      unitNumber: u.unitNumber || idx + 1,
    }));
  }

  // Front Matter defaults
  if (!updated.frontMatter || updated.frontMatter.length === 0) {
    updated.frontMatter = [
      {
        id: 'fm-half-title',
        type: 'half_title',
        title: 'Half Title',
        content: `# ${updated.title}\n\n*A Rigorous Pedagogical Grammar for Academic Excellence*`,
        isEnabled: true,
        order: 1,
      },
      {
        id: 'fm-title-page',
        type: 'title_page',
        title: 'Title Page',
        content: `# ${updated.title}\n\n### ${updated.subject}\n**Standard / Level**: ${updated.classLevel} (${updated.ageBracket})\n**Curriculum Target**: ${targetBoard} Framework\n**Series**: ${seriesTitle}\n\n*Published by Veritas Academic Press — All Rights Reserved*`,
        isEnabled: true,
        order: 2,
      },
      {
        id: 'fm-copyright',
        type: 'copyright_page',
        title: 'Copyright Page',
        content: `**${updated.title} — ${updated.edition}**\n\nCopyright © ${new Date().getFullYear()} ${seriesTitle}.\n\nAll rights reserved. No part of this publication may be reproduced, stored in a retrieval system, or transmitted in any form or by any means without the prior written permission of the publisher.\n\n**ISBN**: ${updated.isbn || 'Pending Assignment'}\n**Edition**: ${updated.edition}\n**Publisher**: To be confirmed`,
        isEnabled: true,
        order: 3,
      },
      {
        id: 'fm-preface',
        type: 'preface',
        title: 'Preface & Pedagogical Approach',
        content: `### Preface\n\n*${updated.title}* is engineered to bridge the gap between prescriptive grammatical correctness and communicative fluency. Grounded in cognitive linguistics and the latest board syllabus specifications, this volume adopts an inductive approach: rules are discovered through authentic sentence pairs before formalization.\n\nEach chapter incorporates structured scaffolding, differentiated exercise tiers (Foundation, Standard, Advanced), and explicit pitfall warnings to ensure lasting conceptual retention.`,
        isEnabled: true,
        order: 4,
      },
      {
        id: 'fm-how-to-use',
        type: 'how_to_use',
        title: 'How to Use This Textbook',
        content: `### Features in Every Chapter\n\n- **Golden Rules**: Core prescriptive guidelines highlighted in antique gold frames.\n- **Contrastive Example Pairs**: Highlighting correct vs incorrect usage with precise explanations.\n- **Watch Out Boxes**: Warning students against deceptive grammatical traps.\n- **Tiered Exercises**: Foundation drills for immediate reinforcement followed by analytical board-pattern questions.\n- **Teacher Edition Callouts**: Pedagogical tips and common classroom misconceptions in the Teacher Master.`,
        isEnabled: true,
        order: 5,
      },
      {
        id: 'fm-toc',
        type: 'table_of_contents',
        title: 'Table of Contents',
        content: `*Dynamic Table of Contents automatically populated from Book Units and Chapters.*`,
        isEnabled: true,
        order: 6,
      },
      {
        id: 'fm-curriculum-alignment',
        type: 'curriculum_alignment',
        title: 'Curriculum & Board Alignment Matrix',
        content: `### Formal Curriculum Framework Alignment\n\nThis textbook maps comprehensively to the ${targetBoard} English Language Framework for ${updated.classLevel}. Key strands covered include:\n- Morphological classification and parts of speech\n- Syntactic concord and clause boundaries\n- Tense concordance and reported discourse\n- Functional writing formats and rubric compliance`,
        isEnabled: true,
        order: 7,
      },
      {
        id: 'fm-teachers-message',
        type: 'message_to_teachers',
        title: 'Note to the Educator',
        content: `### Dear Colleague,\n\nGrammar instruction is most potent when students understand *why* a rule exists rather than merely memorizing formulas. We encourage you to use the **Sentence Diagrammer** and **Oral Contrast Drills** provided in the Teacher Companion to encourage lively syntactic debate in your classroom.`,
        isEnabled: true,
        order: 8,
      },
    ];
  }

  // Back Matter defaults
  if (!updated.backMatter || updated.backMatter.length === 0) {
    updated.backMatter = [
      {
        id: 'bm-glossary',
        type: 'glossary',
        title: 'Comprehensive Glossary of Grammatical Terms',
        content: `*Consolidated dynamic glossary generated from all chapter definitions and terminology entries.*`,
        isEnabled: true,
        order: 1,
      },
      {
        id: 'bm-grammar-ref',
        type: 'grammar_reference',
        title: 'Quick Reference Tables & Conjugation Charts',
        content: `### Master Irregular Verb Forms\n\n| Base Form (V1) | Past Simple (V2) | Past Participle (V3) | Present Participle (V-ing) |\n|---|---|---|---|\n| Arise | Arose | Arisen | Arising |\n| Choose | Chose | Chosen | Choosing |\n| Drive | Drove | Driven | Driving |\n| Forbid | Forbade | Forbidden | Forbidding |\n| Lay (to place) | Laid | Laid | Laying |\n| Lie (to recline)| Lay | Lain | Lying |\n| Rise (intransitive)| Rose | Risen | Rising |\n| Raise (transitive)| Raised | Raised | Raising |`,
        isEnabled: true,
        order: 2,
      },
      {
        id: 'bm-answer-key',
        type: 'answer_key',
        title: 'Complete Answer Key (Student & Teacher Editions)',
        content: `*Automated answer key aggregated across all chapter exercises and assessments with full explanations.*`,
        isEnabled: true,
        order: 3,
      },
      {
        id: 'bm-index',
        type: 'index',
        title: 'Subject & Concept Index',
        content: `*Alphabetical index cross-referencing key syntactic concepts to units and chapter pages.*`,
        isEnabled: true,
        order: 4,
      },
      {
        id: 'bm-credits',
        type: 'image_credits',
        title: 'Artwork, Visual & Text Acknowledgements',
        content: `### Acknowledgements\n\nSyntactic diagrams rendered via Veritas Classical Sentence Parser.\nEditorial review completed under the aegis of the National Council of English Educators.`,
        isEnabled: true,
        order: 5,
      },
    ];
  }

  // Style Guide defaults
  if (!updated.styleGuide) {
    updated.styleGuide = {
      variety: 'British English',
      quotationStyle: 'Single quotes with punctuation outside',
      hyphenation: 'Standard Oxford',
      capitalisation: 'Title Case for Headings',
      headingConventions: 'Chapter titles in Title Case; Section titles in Bold Garamond; Subheadings in Small Caps.',
      exerciseNaming: 'Exercise + Letter (e.g. Exercise A, Exercise B) followed by descriptive objective.',
      numberFormatting: 'Words for one to ten, numerals for 11+',
      grammarTerminology: 'Standard British & Board canonical terminology (e.g. Subject-Verb Concord, Finite vs Non-Finite).',
      punctuationConventions: 'Oxford comma maintained in academic series; em-dash without flanking spaces; curved single apostrophe.',
    };
  }

  // Terminology dictionary defaults
  if (!updated.terminologyDictionary || updated.terminologyDictionary.length === 0) {
    updated.terminologyDictionary = [
      {
        id: 'term-sva',
        preferredTerm: 'Subject-Verb Concord',
        allowedAlternative: 'Subject-Verb Agreement',
        board: targetBoard,
        classLevel: updated.classLevel,
        definition: 'The grammatical requirement that a finite verb agrees in number and person with its subject.',
        usageNote: 'Use "Subject-Verb Concord" in chapter titles and exam blueprints; "Agreement" is acceptable in informal notes.',
      },
      {
        id: 'term-reported',
        preferredTerm: 'Reported Speech',
        allowedAlternative: 'Direct & Indirect Speech',
        board: targetBoard,
        classLevel: updated.classLevel,
        definition: 'Grammatical discourse representing the words of another speaker.',
        usageNote: 'Prefer "Reported Speech" for functional units; use "Direct & Indirect" in transformation tables.',
      },
      {
        id: 'term-determiners',
        preferredTerm: 'Determiners',
        allowedAlternative: 'Articles & Adjectives of Quantity',
        board: targetBoard,
        classLevel: updated.classLevel,
        definition: 'Words placed in front of a noun to specify quantity or definiteness.',
        usageNote: 'Classify articles as a sub-branch of determiners in Class 6 and above.',
      },
      {
        id: 'term-clause',
        preferredTerm: 'Principal & Subordinate Clauses',
        allowedAlternative: 'Main & Dependent Clauses',
        board: targetBoard,
        classLevel: updated.classLevel,
        definition: 'Structural divisions of complex sentences containing a finite verb.',
        usageNote: 'CISCE and CBSE syllabi explicitly use "Principal clause" and "Subordinate noun/adverb/relative clause".',
      },
    ];
  }

  // Glossary defaults
  if (!updated.glossary || updated.glossary.length === 0) {
    updated.glossary = [
      {
        id: 'glo-concord',
        term: 'Concord (Agreement)',
        definition: 'The harmony in number and person between a subject and its finite verb.',
        firstAppearanceChapterId: updated.topics[0]?.id || 'ch-1',
        firstAppearanceChapterTitle: updated.topics[0]?.title || 'Subject-Verb Agreement',
        boardNote: 'Tested under Section B (Grammar) in CBSE Class 6–10.',
        status: 'Approved',
      },
      {
        id: 'glo-parenthetical',
        term: 'Parenthetical Phrase',
        definition: 'A phrase set off by commas (e.g. "as well as", "along with") that does not alter the grammatical number of the subject.',
        firstAppearanceChapterId: updated.topics[0]?.id || 'ch-1',
        firstAppearanceChapterTitle: updated.topics[0]?.title || 'Subject-Verb Agreement',
        boardNote: 'Major error trap in board error-editing tasks.',
        status: 'Approved',
      },
      {
        id: 'glo-distributive',
        term: 'Distributive Pronoun',
        definition: 'A pronoun referring to persons or things taken singly (e.g. each, neither, either), inherently taking a singular verb.',
        firstAppearanceChapterId: updated.topics[0]?.id || 'ch-1',
        firstAppearanceChapterTitle: updated.topics[0]?.title || 'Subject-Verb Agreement',
        boardNote: 'Must always be parsed as singular in standard examinations.',
        status: 'Approved',
      },
      {
        id: 'glo-collective-noun',
        term: 'Collective Noun',
        definition: 'A noun denoting a group of individuals (e.g. jury, committee, herd) taking singular or plural verb depending on unity of action.',
        firstAppearanceChapterId: updated.topics[0]?.id || 'ch-1',
        firstAppearanceChapterTitle: updated.topics[0]?.title || 'Subject-Verb Agreement',
        boardNote: 'CBSE standard accepts singular verb when acting as a unified body.',
        status: 'Approved',
      },
    ];
  }

  // Index terms defaults
  if (!updated.indexTerms || updated.indexTerms.length === 0) {
    updated.indexTerms = [
      {
        id: 'idx-1',
        term: 'Subject-Verb Concord',
        category: 'Syntactic Rule',
        referencedChapterIds: [updated.topics[0]?.id || 'ch-1'],
      },
      {
        id: 'idx-2',
        term: 'Intervening Phrases',
        category: 'Syntactic Rule',
        referencedChapterIds: [updated.topics[0]?.id || 'ch-1'],
      },
      {
        id: 'idx-3',
        term: 'Distributive Pronouns',
        category: 'Grammar Concept',
        referencedChapterIds: [updated.topics[0]?.id || 'ch-1'],
      },
      {
        id: 'idx-4',
        term: 'Correlative Conjunctions',
        category: 'Syntactic Rule',
        referencedChapterIds: [updated.topics[0]?.id || 'ch-1'],
      },
    ];
  }

  // Teacher material defaults
  if (!updated.teacherMaterial) {
    updated.teacherMaterial = {
      introForTeachers: `This Teacher Master Edition contains comprehensive lesson trajectories, pedagogical rationale, anticipated student misconceptions, and fully verified answer keys with rubric breakdowns.`,
      pedagogicalApproach: `Adopt the inductive spiral approach: start with oral discovery, highlight anomalous pairs, formalize the rule using color-coded syntax maps, and reinforce through scaffolded drills.`,
      suggestedSchedule: `Recommended pace: 4 teaching periods (40 mins each) per chapter, with 1 dedicated diagnostic review period at the conclusion of every Unit.`,
      differentiationGuidance: `Provide tiered task cards: Tier 1 (Foundation) uses sentence templates with brackets; Tier 2 (Standard) requires standalone error spotting; Tier 3 (Advanced) challenges students with complex compound-complex sentences.`,
      assessmentGuidance: `Use formative 5-minute exit tickets after each rule block. Unit assessments should be graded using the official board step-marking criteria provided in the Answer Key.`,
      additionalActivities: `Engage students in "Grammar Courtroom" role-play where students defend their sentence corrections using formal grammatical terminology.`,
    };
  }

  return updated;
}

// -------------------------------------------------------------
// Metric Computation Utilities
// -------------------------------------------------------------

export function getChapterWordCount(topic: GrammarTopic): number {
  let count = 0;
  if (topic.overview) count += topic.overview.trim().split(/\s+/).length;
  if (topic.notesAndTheoryMarkdown) count += topic.notesAndTheoryMarkdown.trim().split(/\s+/).length;

  if (topic.definitions) {
    topic.definitions.forEach((def) => {
      if (def.ageAppropriateExplanation) count += def.ageAppropriateExplanation.trim().split(/\s+/).length;
      if (def.rules) count += def.rules.join(' ').trim().split(/\s+/).length;
      if (def.examples) {
        def.examples.forEach((ex) => {
          if (ex.sentence) count += ex.sentence.trim().split(/\s+/).length;
          if (ex.note) count += ex.note.trim().split(/\s+/).length;
        });
      }
    });
  }

  if (topic.studioChapter?.sections) {
    topic.studioChapter.sections.forEach((sec) => {
      sec.blocks.forEach((blk) => {
        if (blk.textContent) count += blk.textContent.trim().split(/\s+/).length;
        if (blk.associatedRuleData?.explanation) count += blk.associatedRuleData.explanation.trim().split(/\s+/).length;
        if (blk.associatedRuleData?.formulaOrPattern) count += blk.associatedRuleData.formulaOrPattern.trim().split(/\s+/).length;
        if (blk.examplePair) {
          const p = blk.examplePair;
          count += ((p.correct || '') + ' ' + (p.incorrect || '') + ' ' + (p.why || '')).trim().split(/\s+/).length;
        }
        if (blk.exampleData?.items) {
          blk.exampleData.items.forEach((it) => {
            if (it.sentence) count += it.sentence.trim().split(/\s+/).length;
          });
        }
      });
    });
  }

  if (topic.studioChapter?.ending) {
    const end = topic.studioChapter.ending;
    if (end.rulesRecap) count += end.rulesRecap.join(' ').trim().split(/\s+/).length;
    if (end.summaryPoints) count += end.summaryPoints.join(' ').trim().split(/\s+/).length;
    if (end.commonTraps) count += end.commonTraps.join(' ').trim().split(/\s+/).length;
  }

  return Math.max(count, 120); // Baseline minimum
}

export function getChapterExerciseCount(topic: GrammarTopic): number {
  const classicCount = topic.exercises ? topic.exercises.length : 0;
  const studioCount = topic.studioChapter?.exercises ? topic.studioChapter.exercises.length : 0;
  return Math.max(classicCount, studioCount);
}

export function getChapterQuestionCount(topic: GrammarTopic): number {
  let count = 0;
  if (topic.exercises) {
    topic.exercises.forEach((ex) => {
      count += (ex.questions || []).length;
    });
  }
  if (topic.studioChapter?.exercises) {
    let sCount = 0;
    topic.studioChapter.exercises.forEach((ex) => {
      sCount += (ex.questions || []).length;
    });
    count = Math.max(count, sCount);
  }
  return count;
}

export function getChapterVisualCount(topic: GrammarTopic): number {
  let count = 0;
  if (topic.studioChapter?.sections) {
    topic.studioChapter.sections.forEach((sec) => {
      sec.blocks.forEach((blk) => {
        if (
          blk.type === 'visual' ||
          blk.type === 'diagram' ||
          blk.type === 'illustration' ||
          blk.type === 'photograph' ||
          blk.type === 'figure' ||
          blk.type === 'flowchart' ||
          blk.type === 'sentence_diagram' ||
          blk.visualData
        ) {
          count++;
        }
      });
    });
  }
  return count;
}

export function getChapterProductionStatus(topic: GrammarTopic): ChapterWorkflowStatus {
  if (topic.studioChapter?.workflowStatus) {
    return topic.studioChapter.workflowStatus;
  }
  // Compute inferential status based on depth
  const questions = getChapterQuestionCount(topic);
  const visuals = getChapterVisualCount(topic);
  if (questions >= 4 && visuals >= 1) return 'academic_review';
  if (questions >= 2) return 'exercises_in_progress';
  if (topic.notesAndTheoryMarkdown && topic.notesAndTheoryMarkdown.length > 200) return 'writing';
  return 'planning';
}

export function getChapterCompletionPercentage(topic: GrammarTopic): number {
  let score = 0;
  // 1. Title & objectives (15%)
  if (topic.title && topic.title.length > 3) score += 5;
  if (topic.overview && topic.overview.length > 20) score += 5;
  if (topic.learningObjectives && topic.learningObjectives.length > 0) score += 5;

  // 2. Theory & Rules (30%)
  if (topic.definitions && topic.definitions.length > 0) score += 15;
  if (topic.notesAndTheoryMarkdown && topic.notesAndTheoryMarkdown.length > 100) score += 15;

  // 3. Exercises & Questions (25%)
  const qCount = getChapterQuestionCount(topic);
  if (qCount >= 4) score += 25;
  else if (qCount >= 1) score += 15;

  // 4. Visuals & Diagrams (15%)
  const vCount = getChapterVisualCount(topic);
  if (vCount >= 1) score += 15;

  // 5. Answer Key & Assessment (15%)
  const ansStatus = getChapterAnswerKeyStatus(topic);
  if (ansStatus === 'complete') score += 15;
  else if (ansStatus === 'partial') score += 8;

  return Math.min(100, Math.round(score));
}

export function getChapterAnswerKeyStatus(topic: GrammarTopic): 'complete' | 'partial' | 'missing' {
  const exercises = topic.exercises || [];
  let totalQuestions = 0;
  let answeredQuestions = 0;

  exercises.forEach((ex) => {
    (ex.questions || []).forEach((q) => {
      totalQuestions++;
      if (q.correctAnswer && q.correctAnswer.trim().length > 0) {
        answeredQuestions++;
      }
    });
  });

  if (topic.studioChapter?.exercises) {
    topic.studioChapter.exercises.forEach((ex) => {
      (ex.questions || []).forEach((q) => {
        totalQuestions++;
        if (q.correctAnswer && q.correctAnswer.trim().length > 0) {
          answeredQuestions++;
        }
      });
    });
  }

  if (totalQuestions === 0) return 'missing';
  if (answeredQuestions === totalQuestions) return 'complete';
  if (answeredQuestions > 0) return 'partial';
  return 'missing';
}

export interface BookProductionMetrics {
  totalWords: number;
  totalExercises: number;
  totalQuestions: number;
  totalVisuals: number;
  overallCompletionPercentage: number;
  chaptersCount: number;
  chaptersCompletedCount: number;
  chaptersInProgressCount: number;
  missingAnswersCount: number;
  unresolvedVisualsCount: number;
  academicReviewNeededCount: number;
  layoutReadyCount: number;
}

export function getBookMetrics(book: ClassCurriculumBook): BookProductionMetrics {
  const topics = book.topics || [];
  let totalWords = 0;
  let totalExercises = 0;
  let totalQuestions = 0;
  let totalVisuals = 0;
  let completionSum = 0;
  let chaptersCompletedCount = 0;
  let chaptersInProgressCount = 0;
  let missingAnswersCount = 0;
  let unresolvedVisualsCount = 0;
  let academicReviewNeededCount = 0;
  let layoutReadyCount = 0;

  topics.forEach((t) => {
    const words = getChapterWordCount(t);
    const exercises = getChapterExerciseCount(t);
    const questions = getChapterQuestionCount(t);
    const visuals = getChapterVisualCount(t);
    const completion = getChapterCompletionPercentage(t);
    const status = getChapterProductionStatus(t);
    const ansStatus = getChapterAnswerKeyStatus(t);

    totalWords += words;
    totalExercises += exercises;
    totalQuestions += questions;
    totalVisuals += visuals;
    completionSum += completion;

    if (completion >= 90 || status === 'ready_for_layout' || status === 'final') {
      chaptersCompletedCount++;
    } else {
      chaptersInProgressCount++;
    }

    if (ansStatus !== 'complete') {
      missingAnswersCount++;
    }

    if (visuals === 0) {
      unresolvedVisualsCount++;
    }

    if (status === 'academic_review' || (completion > 60 && completion < 90)) {
      academicReviewNeededCount++;
    }

    if (status === 'ready_for_layout' || status === 'final') {
      layoutReadyCount++;
    }
  });

  const overallCompletionPercentage =
    topics.length > 0 ? Math.round(completionSum / topics.length) : 0;

  return {
    totalWords,
    totalExercises,
    totalQuestions,
    totalVisuals,
    overallCompletionPercentage,
    chaptersCount: topics.length,
    chaptersCompletedCount,
    chaptersInProgressCount,
    missingAnswersCount,
    unresolvedVisualsCount,
    academicReviewNeededCount,
    layoutReadyCount,
  };
}

// -------------------------------------------------------------
// Duplication Helpers
// -------------------------------------------------------------

export function duplicateChapterStructure(
  source: GrammarTopic,
  newNumber: number,
  newTitle: string
): GrammarTopic {
  const newId = `ch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const duplicatedStudio: StudioChapter | undefined = source.studioChapter
    ? {
        ...source.studioChapter,
        id: `studio-${newId}`,
        chapterNumber: newNumber,
        title: newTitle,
        shortTitle: newTitle,
        workflowStatus: 'planning',
        sections: source.studioChapter.sections.map((sec, sIdx) => ({
          ...sec,
          id: `sec-${newId}-${sIdx + 1}`,
          numberLabel: `${newNumber}.${sIdx + 1}`,
          title: `Section ${sIdx + 1}: [Enter Rule / Subtopic Title]`,
          blocks: sec.blocks.map((blk, bIdx) => ({
            ...blk,
            id: `blk-${newId}-${sIdx + 1}-${bIdx + 1}`,
            textContent: blk.type === 'text' ? 'Write instructional exposition for this block...' : undefined,
            associatedRuleData: blk.associatedRuleData ? { ...blk.associatedRuleData } : undefined,
            examplePair: blk.examplePair ? { incorrect: '', correct: '', why: '' } : undefined,
          })),
        })),
        exercises: source.studioChapter.exercises.map((ex, eIdx) => ({
          ...ex,
          id: `ex-${newId}-${eIdx + 1}`,
          title: `Exercise ${String.fromCharCode(65 + eIdx)}: [Exercise Focus]`,
          questions: [],
        })),
        answerKey: [],
        qualityAudit: undefined,
        architectureState: source.studioChapter.architectureState
          ? JSON.parse(JSON.stringify(source.studioChapter.architectureState))
          : undefined,
      }
    : undefined;

  return {
    id: newId,
    title: newTitle,
    category: source.category || 'Grammar Concept',
    classLevel: source.classLevel,
    overview: `Structured framework for ${newTitle}. Formulate core pedagogical goals and syllabus scope.`,
    learningObjectives: [
      `Understand the core definitions and principles of ${newTitle}`,
      `Identify and construct grammatically accurate sentences`,
      `Avoid typical syntactic errors and exam pitfalls`,
    ],
    definitions: [
      {
        id: `def-${newId}-1`,
        term: newTitle,
        partOfSpeechOrCategory: source.category || 'Syntactic Rule',
        ageAppropriateExplanation: `Formal definition and standard explanation for ${newTitle}.`,
        rules: ['State the first prescriptive rule clearly.'],
        examples: [],
      },
    ],
    notesAndTheoryMarkdown: `### ${newTitle}\n\nIntroduce the grammatical concept with authentic illustrative sentences and clear prescriptive boundaries.`,
    exercises: [
      {
        id: `ex-${newId}-1`,
        title: 'Exercise A: Concept Mastery & Identification',
        instructions: 'Read each prompt carefully and provide the correct response.',
        targetType: 'mixed',
        maxMarks: 5,
        questions: [],
      },
    ],
    testSeries: [],
    studioChapter: duplicatedStudio,
  };
}

export function duplicateChapterFull(
  source: GrammarTopic,
  newNumber: number,
  newTitle: string
): GrammarTopic {
  const newId = `ch-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const clonedStudio: StudioChapter | undefined = source.studioChapter
    ? JSON.parse(JSON.stringify(source.studioChapter))
    : undefined;

  if (clonedStudio) {
    clonedStudio.id = `studio-${newId}`;
    clonedStudio.chapterNumber = newNumber;
    clonedStudio.title = newTitle;
    clonedStudio.workflowStatus = 'writing';
  }

  const clonedTopic: GrammarTopic = JSON.parse(JSON.stringify(source));
  clonedTopic.id = newId;
  clonedTopic.title = newTitle;
  clonedTopic.studioChapter = clonedStudio;

  return clonedTopic;
}

/**
 * Generates age/stage-appropriate recommended book units aligned to syllabus architecture.
 * Units are clearly tagged as `aiSuggestion: true` and `isTemplate: true` so the user knows
 * they are AI recommendations pending review.
 */
export function generateRecommendedUnitsForClass(
  classLevel: string,
  targetBoard = 'CBSE',
  topics: GrammarTopic[] = [],
  bookProjectId?: string,
  editionId?: string,
  systemId?: string,
  programmeId?: string
): BookUnit[] {
  const numMatch = (classLevel || '').match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : 6;
  const boardUpper = (targetBoard || '').toUpperCase();

  let unitSpecs: Array<{ title: string; description: string }>;

  if (classNum <= 1 || classLevel.toLowerCase().includes('foundational') || classLevel.toLowerCase().includes('stage 1')) {
    // Primary / Foundational Stage (Class 1)
    unitSpecs = [
      {
        title: 'Unit 1: Letters, Sounds & Foundations of Reading',
        description: 'Letter-sound correspondences, alphabetical order, and initial phonological awareness.',
      },
      {
        title: 'Unit 2: Naming Words & Describing Words',
        description: 'Common naming words (people, places, animals, things) and simple descriptive adjectives.',
      },
      {
        title: 'Unit 3: Doing Words & Initial Sentence Sense',
        description: 'Action words (verbs), basic sentence boundaries, and word sequencing.',
      },
      {
        title: 'Unit 4: Capital Letters, Full Stops & Expression',
        description: 'Mechanics of sentence opening and closing with creative communicative drawing and writing.',
      },
    ];
  } else if (classNum <= 3) {
    // Lower Primary (Classes 2-3)
    unitSpecs = [
      {
        title: 'Unit 1: Words, Alphabetical Order & Dictionaries',
        description: 'Spelling conventions, word building, alphabetical sequence, and vocabulary exploration.',
      },
      {
        title: 'Unit 2: Parts of Speech: Nouns, Pronouns & Adjectives',
        description: 'Proper and common nouns, singular/plural inflections, pronouns, and qualitative adjectives.',
      },
      {
        title: 'Unit 3: Action Verbs, Helping Verbs & Time Sense',
        description: 'Present, past, and future temporal expressions with essential helping verbs.',
      },
      {
        title: 'Unit 4: Sentences, Punctuation & Short Paragraphs',
        description: 'Statements, questions, exclamation marks, and connecting sentences with "and", "but".',
      },
    ];
  } else if (classNum <= 5) {
    // Upper Primary (Classes 4-5)
    unitSpecs = [
      {
        title: 'Unit 1: Sentence Anatomy: Subject & Predicate',
        description: 'Subject and predicate identification, sentence types (declarative, interrogative, imperative, exclamatory).',
      },
      {
        title: 'Unit 2: Nominal Structures & Determiners',
        description: 'Countable/uncountable nouns, collective nouns, possessives, and articles (a, an, the).',
      },
      {
        title: 'Unit 3: Verb Forms, Auxiliary Verbs & Tense Consistency',
        description: 'Simple and continuous tenses, modal auxiliaries (can, may, must), and subject concord.',
      },
      {
        title: 'Unit 4: Prepositions, Conjunctions & Connected Sentences',
        description: 'Spatial/temporal prepositions, coordinating conjunctions, and sentence joining.',
      },
      {
        title: 'Unit 5: Paragraph Composition & Punctuation Precision',
        description: 'Topic sentences, supporting details, commas, speech marks, and structured composition.',
      },
    ];
  } else if (classNum <= 8) {
    // Middle School (Classes 6-8)
    if (boardUpper.includes('CISCE') || boardUpper.includes('ICSE')) {
      unitSpecs = [
        {
          title: 'Unit 1: Verbal Syntax & Concord (ICSE Foundation)',
          description: 'Rigorous subject-verb agreement (correlative conjunctions, collective nouns, intervening phrases).',
        },
        {
          title: 'Unit 2: Noun Taxonomy, Gender & Case Inflection',
          description: 'Abstract nouns, nominative/accusative/possessive cases, and noun clause foundations.',
        },
        {
          title: 'Unit 3: Verbal Syntax: Tense Aspect & Transformation',
          description: '12-tense timeline, active/passive voice transformation, and verbal aspect consistency.',
        },
        {
          title: 'Unit 4: Sentence Synthesis & Transformation (Question 5 Preparation)',
          description: 'Combining sentences without and/but/so, transformation of degree, and affirmative-negative conversion.',
        },
        {
          title: 'Unit 5: Prepositions, Phrasal Verbs & Vocabulary Register',
          description: 'Appropriate prepositions, phrasal collocations, synonyms, and antonyms in context.',
        },
        {
          title: 'Unit 6: Formal Composition: Notice, Email & Guided Letters',
          description: 'Prescribed CISCE formats, structural marking rubrics, and formal letter conventions.',
        },
      ];
    } else if (boardUpper.includes('CAMBRIDGE')) {
      unitSpecs = [
        {
          title: 'Unit 1: Syntax in Context: Crafting Varied Sentences',
          description: 'Exploring how sentence architecture impacts rhythm, pace, and reader perception.',
        },
        {
          title: 'Unit 2: Word Choices, Register & Linguistic Precision',
          description: 'Analysing connotations, formal vs informal registers, and modal nuances.',
        },
        {
          title: 'Unit 3: Clause Combining, Subordination & Emphasis',
          description: 'Complex sentences, relative clauses, and foregrounding key narrative/expository information.',
        },
        {
          title: 'Unit 4: Cohesive Devices & Textual Progression',
          description: 'Discourse markers, paragraph transitions, and pronoun referencing across extended texts.',
        },
        {
          title: 'Unit 5: Punctuation for Nuance & Rhetorical Effect',
          description: 'Colons, semi-colons, dashes, and parenthetical commas for sophisticated tone.',
        },
      ];
    } else {
      // Standard CBSE Middle School
      unitSpecs = [
        {
          title: 'Unit 1: Foundations of Syntax & Concord',
          description: 'Core rules governing the agreement between subjects, predicates, and intervening modifiers.',
        },
        {
          title: 'Unit 2: Word Classes, Pronouns & Determiners',
          description: 'Nominal taxonomy, relative pronouns, demonstratives, and distributive determiners.',
        },
        {
          title: 'Unit 3: Tenses, Modals & Voice',
          description: 'Aspectual verb distinctions, modal auxiliary functions, and active-passive transposition.',
        },
        {
          title: 'Unit 4: Clauses, Transformation & Reported Speech',
          description: 'Principal and subordinate clauses, direct/indirect discourse, and sentence synthesis.',
        },
        {
          title: 'Unit 5: Vocabulary, Idioms & Applied Composition',
          description: 'Collocations, phrasal verbs, formal letters, paragraph cohesion, and diary entries.',
        },
        {
          title: 'Unit 6: Revision & Term-End Diagnostic Papers',
          description: 'Integrated editing exercises, error detection drills, and blueprint-aligned test papers.',
        },
      ];
    }
  } else if (classNum <= 10) {
    // Secondary (Classes 9-10)
    unitSpecs = [
      {
        title: 'Unit 1: Syntactic Architecture & Clause Analysis',
        description: 'Complex and compound-complex sentence parsing, finite/non-finite verbs, and conditional clauses.',
      },
      {
        title: 'Unit 2: Advanced Verb Structures & Mood',
        description: 'Subjunctive mood, perfective aspects, modal certainty/deduction, and participle clauses.',
      },
      {
        title: 'Unit 3: Sentence Transformation & Synthesis',
        description: 'Synthesis without conjunctions, degree of comparison transformation, and cleft sentences.',
      },
      {
        title: 'Unit 4: Direct & Indirect Discourse (Complex Reporting)',
        description: 'Exclamations, commands, interrogative inversion, and narrative reporting shifts.',
      },
      {
        title: 'Unit 5: Formal Composition & Academic Registers',
        description: 'Analytical paragraph writing, formal editorial letters, speech writing, and debate formats.',
      },
      {
        title: 'Unit 6: Board Examination Blueprints & Diagnostic Test Papers',
        description: 'Section-wise question bank integration, rubric-guided marking, and model answer keys.',
      },
    ];
  } else {
    // Senior Secondary (Classes 11-12)
    unitSpecs = [
      {
        title: 'Unit 1: Advanced Rhetoric, Inversion & Parallelism',
        description: 'Fronting, negative inversion, balanced structures, and stylistic emphasis.',
      },
      {
        title: 'Unit 2: Complex Clause Synthesis & Subjunctive Nuance',
        description: 'Nominalisation, absolute phrases, formulaic subjunctive, and ellipsis in discourse.',
      },
      {
        title: 'Unit 3: Discourse Markers & Cohesive Devices',
        description: 'Anaphoric and cataphoric reference, lexical cohesion, and pragmatic markers.',
      },
      {
        title: 'Unit 4: Stylistic Mechanics, Register Variation & Editing',
        description: 'Error hunting, stylistic editing, jargon vs clarity, and proofreading protocols.',
      },
      {
        title: 'Unit 5: Advanced Academic Composition & Criticism',
        description: 'Critical reviews, research summaries, argumentative dissertations, and official memoranda.',
      },
    ];
  }

  // Create units and assign existing topics if available
  const units: BookUnit[] = unitSpecs.map((spec, idx) => {
    const unitId = `unit-${bookProjectId || 'proj'}-${idx + 1}-${Date.now()}`;
    return {
      id: unitId,
      unitNumber: idx + 1,
      title: spec.title,
      description: spec.description,
      chapterIds: [],
      order: idx + 1,
      isArchived: false,
      bookProjectId,
      editionId,
      curriculumSystemId: systemId || targetBoard,
      programmeId,
      classOrStageId: classLevel,
      isTemplate: true,
      aiSuggestion: true,
      status: 'draft',
    };
  });

  // Distribute any existing topics across the units
  if (topics.length > 0 && units.length > 0) {
    topics.forEach((t) => {
      const titleLower = t.title.toLowerCase();
      const matchedUnit = units.find((u) => {
        const uLower = u.title.toLowerCase();
        if (titleLower.includes('noun') || titleLower.includes('naming')) return uLower.includes('noun') || uLower.includes('naming');
        if (titleLower.includes('verb') || titleLower.includes('action') || titleLower.includes('tense')) return uLower.includes('verb') || uLower.includes('action') || uLower.includes('tense');
        if (titleLower.includes('sentence') || titleLower.includes('syntax') || titleLower.includes('concord')) return uLower.includes('sentence') || uLower.includes('syntax') || uLower.includes('concord');
        if (titleLower.includes('letter') || titleLower.includes('sound') || titleLower.includes('alphabet')) return uLower.includes('letter') || uLower.includes('sound');
        return false;
      });

      if (matchedUnit) {
        matchedUnit.chapterIds.push(t.id);
      } else {
        units[0].chapterIds.push(t.id);
      }
    });
  }

  return units;
}
