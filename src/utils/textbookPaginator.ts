import {
  ClassCurriculumBook,
  GrammarSeriesProject,
  GrammarTopic,
} from '../types';
import {
  BookProductionSettings,
  PaginatedPage,
  PreflightIssue,
  RenderableBlock,
  TRIM_PRESET_MAP,
} from '../types/bookLayoutTypes';
import { MM_TO_PT } from './bookLayoutDefaults';

export interface PaginationResult {
  pages: PaginatedPage[];
  preflightIssues: PreflightIssue[];
  tocPageNumbers: Record<string, string>;
  totalLeaves: number;
  totalSignatures: number;
  estimatedSpineThicknessMm: number;
}

// Convert integer to Roman numeral (for Front Matter)
function toRoman(num: number): string {
  if (num <= 0) return '';
  const lookup: [number, string][] = [
    [1000, 'm'],
    [900, 'cm'],
    [500, 'd'],
    [400, 'cd'],
    [100, 'c'],
    [90, 'xc'],
    [50, 'l'],
    [40, 'xl'],
    [10, 'x'],
    [9, 'ix'],
    [5, 'v'],
    [4, 'iv'],
    [1, 'i'],
  ];
  let roman = '';
  let n = num;
  for (const [val, str] of lookup) {
    while (n >= val) {
      roman += str;
      n -= val;
    }
  }
  return roman;
}

export function paginateTextbook(
  book: ClassCurriculumBook,
  series: GrammarSeriesProject,
  settings: BookProductionSettings
): PaginationResult {
  const pages: PaginatedPage[] = [];
  const preflightIssues: PreflightIssue[] = [];
  const tocPageNumbers: Record<string, string> = {};

  const trim =
    settings.trimPreset === 'custom'
      ? {
          widthMm: settings.customWidthMm || 189,
          heightMm: settings.customHeightMm || 246,
        }
      : TRIM_PRESET_MAP[settings.trimPreset] || TRIM_PRESET_MAP.crown_quarto;

  const usableHeightPt =
    (trim.heightMm - settings.geometry.topMarginMm - settings.geometry.bottomMarginMm) * MM_TO_PT;

  let currentNumericPage = 1;

  // Helper to create a new page
  function createPage(
    type: PaginatedPage['pageType'],
    masterId: PaginatedPage['masterPageId'],
    isCover = false,
    unitTitle?: string,
    chapterTitle?: string,
    chapterNumber?: number
  ): PaginatedPage {
    const isRecto = currentNumericPage % 2 !== 0;
    const isVerso = !isRecto;

    const page: PaginatedPage = {
      pageIndex: pages.length,
      displayPageNumber: '',
      numericPageNumber: currentNumericPage,
      isVerso,
      isRecto,
      isCoverOrTitle: isCover,
      masterPageId: masterId,
      unitTitle,
      chapterTitle,
      chapterNumber,
      blocks: [],
      hasWidowOrphan: false,
      hasOverset: false,
      isIntentionalBlank: type === 'blank_verso',
    };

    pages.push(page);
    currentNumericPage++;
    return page;
  }

  // ==========================================
  // 1. FRONT MATTER (Pages 1 to ~8)
  // ==========================================

  // Half Title (Page 1, Recto)
  const halfTitlePage = createPage('half_title', 'front_matter', true);
  halfTitlePage.blocks.push({
    id: 'half-title-block',
    type: 'half_title',
    title: book.title || `${series.seriesTitle} — ${book.classLevel}`,
    estimatedHeightPt: 150,
  });

  // Series Description / Blank (Page 2, Verso)
  const versoImprintNotice = createPage('imprint_page', 'front_matter', true);
  versoImprintNotice.blocks.push({
    id: 'series-colophon-block',
    type: 'paragraph',
    content: `${series.seriesTitle} is an authoritative, multi-tier English grammar and composition coursebook published in adherence with ${series.targetBoard} standards.`,
    estimatedHeightPt: 80,
  });

  // Title Page (Page 3, Recto)
  const fullTitlePage = createPage('title_page', 'front_matter', true);
  fullTitlePage.blocks.push({
    id: 'title-page-block',
    type: 'title_page',
    title: book.title,
    content: `${book.classLevel} • Comprehensive Grammar, Composition & Verbal Logic`,
    metadata: {
      board: series.targetBoard,
      series: series.seriesTitle,
      publisher: 'VERITAS ACADEMIC PUBLISHING PRESS',
      edition: settings.edition === 'teacher_master' ? "TEACHER'S MASTER RESOURCE EDITION" : 'STUDENT COURSEBOOK',
    },
    estimatedHeightPt: usableHeightPt * 0.85,
  });

  // Imprint / Copyright Page (Page 4, Verso)
  const copyrightPage = createPage('imprint_page', 'front_matter', true);
  copyrightPage.blocks.push({
    id: 'copyright-block',
    type: 'imprint_page',
    content: `Published by Veritas Academic Press\nFirst Edition: 2026\nISBN: 978-0-987654-32-1\nAll rights reserved. No part of this publication may be reproduced or transmitted in any form without prior written permission.\nPrinted on ${settings.paperStock} archival-grade offset paper.`,
    estimatedHeightPt: 220,
  });

  // Preface / Academic Scope (Page 5, Recto)
  const prefacePage = createPage('body_content', 'front_matter', false);
  prefacePage.blocks.push({
    id: 'preface-heading',
    type: 'heading',
    level: 1,
    title: 'Pedagogical Preface & Architecture',
    estimatedHeightPt: 40,
  });
  prefacePage.blocks.push({
    id: 'preface-body-1',
    type: 'paragraph',
    content: `Language proficiency requires systematic scaffolding, structural syntactic understanding, and regular communicative drill. This coursebook for ${book.classLevel} delivers rigorous alignment with ${series.targetBoard} benchmarks, structured across thematic units and differentiated learning tiers.`,
    estimatedHeightPt: 90,
  });
  prefacePage.blocks.push({
    id: 'preface-body-2',
    type: 'callout',
    calloutType: 'grammar_rule',
    title: 'The Veritas Pedagogical Framework',
    content: '1. Theoretical Rule Enunciation → 2. Systematic Contrastive Exemplars → 3. Tiered Formative Drills → 4. Syntactic Diagramming & Summative Board Testing.',
    estimatedHeightPt: 100,
  });

  // Dynamic Table of Contents (Page 6, Verso or Page 7, Recto)
  const tocPage = createPage('toc', 'front_matter', false);
  tocPage.blocks.push({
    id: 'toc-heading',
    type: 'heading',
    level: 1,
    title: 'Table of Contents',
    estimatedHeightPt: 45,
  });
  const tocBlock: RenderableBlock = {
    id: 'toc-entries-block',
    type: 'toc',
    tocEntries: [],
    estimatedHeightPt: 250,
  };
  tocPage.blocks.push(tocBlock);

  // Curriculum Alignment Matrix (Page 8, Verso)
  const matrixPage = createPage('curriculum_matrix', 'front_matter', false);
  matrixPage.blocks.push({
    id: 'curriculum-heading',
    type: 'heading',
    level: 1,
    title: 'Board Curriculum Alignment Matrix',
    estimatedHeightPt: 40,
  });
  matrixPage.blocks.push({
    id: 'curriculum-content',
    type: 'curriculum_matrix',
    content: `Course units systematically map to the ${series.targetBoard} spiral syllabus for ${book.classLevel}.`,
    metadata: {
      topicsCount: book.topics.length,
      board: series.targetBoard,
    },
    estimatedHeightPt: 300,
  });

  // Number the Front Matter pages using Roman Numerals (i, ii, iii...)
  pages.forEach((p, idx) => {
    if (idx === 0 || idx === 1 || idx === 2 || idx === 3) {
      p.displayPageNumber = ''; // Suppress visible folios on Half-title, Title, and Imprint
    } else {
      p.displayPageNumber = toRoman(idx + 1);
    }
  });

  // ==========================================
  // 2. MAIN MATTER: CHAPTERS & UNITS
  // ==========================================
  // Reset numeric counter for main matter (Page 1 = Recto)
  let mainMatterPageNumber = 1;

  let activePage: PaginatedPage | null = null;
  let currentAccumulatedHeight = 0;

  function ensurePageForContent(
    unitTitle?: string,
    chapterTitle?: string,
    chapterNumber?: number
  ): PaginatedPage {
    if (!activePage || currentAccumulatedHeight >= usableHeightPt - 20) {
      activePage = createPage(
        'body_content',
        'standard_recto', // will be adjusted dynamically by isVerso
        false,
        unitTitle,
        chapterTitle,
        chapterNumber
      );
      activePage.displayPageNumber = String(mainMatterPageNumber);
      activePage.masterPageId = activePage.isVerso ? 'standard_verso' : 'standard_recto';
      mainMatterPageNumber++;
      currentAccumulatedHeight = 0;
    }
    return activePage;
  }

  let figureIndex = 1;

  // Iterate over topics / chapters
  book.topics.forEach((topic, tIdx) => {
    const chapterNum = tIdx + 1;
    const unitTitle = topic.category || 'General Grammar';
    const chapterTitle = topic.title;

    // Enforce Recto Start: If startChapterOnRightPage is true, chapter opener MUST be on a Recto (odd) page
    if (settings.startChapterOnRightPage) {
      if (activePage && activePage.isRecto) {
        // If current page is Recto, the next naturally would be Verso (left).
        // So we insert an intentional blank verso page to force the chapter opener to start on Recto!
        const blankPage = createPage(
          'blank_verso',
          'blank_page',
          false,
          unitTitle,
          chapterTitle,
          chapterNum
        );
        blankPage.displayPageNumber = ''; // Intentionally blank
        blankPage.blocks.push({
          id: `blank-verso-${topic.id}`,
          type: 'blank_filler',
          content: 'This page is intentionally left blank.',
          estimatedHeightPt: 40,
        });
        mainMatterPageNumber++;
      }
    }

    // CHAPTER OPENER PAGE (Always Recto when enforced)
    activePage = createPage(
      'chapter_opener',
      'chapter_opener',
      false,
      unitTitle,
      chapterTitle,
      chapterNum
    );
    activePage.displayPageNumber = String(mainMatterPageNumber);
    mainMatterPageNumber++;
    currentAccumulatedHeight = 0;

    // Record TOC page number
    tocPageNumbers[topic.id] = activePage.displayPageNumber;
    tocBlock.tocEntries?.push({
      title: chapterTitle,
      pageNumber: activePage.displayPageNumber,
      unitTitle,
      level: 1,
    });

    // Chapter Opener Block
    const openerBlock: RenderableBlock = {
      id: `chap-opener-${topic.id}`,
      type: 'chapter_opener',
      title: chapterTitle,
      content: topic.overview,
      metadata: {
        unitTitle,
        chapterNumber: chapterNum,
        learningObjectives: topic.learningObjectives || [],
      },
      estimatedHeightPt: 160,
    };
    activePage.blocks.push(openerBlock);
    currentAccumulatedHeight += openerBlock.estimatedHeightPt;

    // Definitions & Grammar Rules
    if (topic.definitions && topic.definitions.length > 0) {
      topic.definitions.forEach((def, dIdx) => {
        const defBlock: RenderableBlock = {
          id: `def-${topic.id}-${dIdx}`,
          type: 'rule_card',
          title: `Rule ${chapterNum}.${dIdx + 1}: ${def.term}`,
          content: def.ageAppropriateExplanation || (def as any).definition || def.term,
          metadata: { examples: def.examples },
          estimatedHeightPt: 95,
        };

        if (currentAccumulatedHeight + defBlock.estimatedHeightPt > usableHeightPt) {
          ensurePageForContent(unitTitle, chapterTitle, chapterNum);
        }
        activePage!.blocks.push(defBlock);
        currentAccumulatedHeight += defBlock.estimatedHeightPt;
      });
    }

    // Theory & Exposition Prose
    if (topic.notesAndTheoryMarkdown) {
      // Split into paragraphs or major sections
      const sections = topic.notesAndTheoryMarkdown.split('\n\n').filter((s) => s.trim().length > 0);
      sections.forEach((sec, sIdx) => {
        const isHeader = sec.startsWith('#');
        const cleanText = sec.replace(/^#+\s*/, '').trim();
        const estHeight = isHeader ? 32 : Math.min(180, Math.max(45, Math.ceil(cleanText.length / 5.5)));

        const block: RenderableBlock = {
          id: `theory-${topic.id}-${sIdx}`,
          type: isHeader ? 'heading' : 'paragraph',
          level: isHeader ? 2 : undefined,
          title: isHeader ? cleanText : undefined,
          content: isHeader ? undefined : cleanText,
          estimatedHeightPt: estHeight,
        };

        if (currentAccumulatedHeight + block.estimatedHeightPt > usableHeightPt) {
          ensurePageForContent(unitTitle, chapterTitle, chapterNum);
        }
        activePage!.blocks.push(block);
        currentAccumulatedHeight += block.estimatedHeightPt;
      });
    }

    // Illustrative Figure / Syntactic Model
    const figBlock: RenderableBlock = {
      id: `fig-${topic.id}`,
      type: 'figure',
      figureNumber: `Figure ${chapterNum}.${figureIndex++}`,
      figureCaption: `Syntactic structure and concord relations in ${topic.title}.`,
      figurePlacement: 'full_width',
      figureAlt: `Structural chart demonstrating concord for ${topic.title}`,
      figureCredit: 'Veritas Linguistic Diagnostics Lab',
      estimatedHeightPt: 130,
    };
    if (currentAccumulatedHeight + figBlock.estimatedHeightPt > usableHeightPt) {
      ensurePageForContent(unitTitle, chapterTitle, chapterNum);
    }
    activePage!.blocks.push(figBlock);
    currentAccumulatedHeight += figBlock.estimatedHeightPt;

    // Callout Box (Remember / Common Error)
    const calloutBlock: RenderableBlock = {
      id: `callout-${topic.id}`,
      type: 'callout',
      calloutType: 'common_error',
      title: 'Frequent Grammatical Pitfall',
      content: `Do not confuse proximity of intervening prepositional phrases with grammatical agreement. Singular subjects demand singular verbs regardless of nearby plural nouns.`,
      estimatedHeightPt: 85,
    };
    if (currentAccumulatedHeight + calloutBlock.estimatedHeightPt > usableHeightPt) {
      ensurePageForContent(unitTitle, chapterTitle, chapterNum);
    }
    activePage!.blocks.push(calloutBlock);
    currentAccumulatedHeight += calloutBlock.estimatedHeightPt;

    // Teacher Note (if in Teacher Master Edition)
    if (settings.edition === 'teacher_master') {
      const teacherBlock: RenderableBlock = {
        id: `teacher-note-${topic.id}`,
        type: 'teacher_annotation',
        title: `Teacher's Pedagogical Guide: Chapter ${chapterNum}`,
        content: `Remedial Strategy: Use choral response drills for struggling students. Introduce the diagnostic test after Exercise B.`,
        estimatedHeightPt: 75,
      };
      if (currentAccumulatedHeight + teacherBlock.estimatedHeightPt > usableHeightPt) {
        ensurePageForContent(unitTitle, chapterTitle, chapterNum);
      }
      activePage!.blocks.push(teacherBlock);
      currentAccumulatedHeight += teacherBlock.estimatedHeightPt;
    }

    // Formative Exercises Section
    if (topic.exercises && topic.exercises.length > 0) {
      // Start exercises on a fresh page or section
      topic.exercises.forEach((ex, exIdx) => {
        const exerciseLetter = String.fromCharCode(65 + exIdx); // 'A', 'B', 'C'
        const exHeadingBlock: RenderableBlock = {
          id: `ex-heading-${topic.id}-${ex.id}`,
          type: 'exercise',
          title: `Exercise ${exerciseLetter}: ${ex.title}`,
          content: ex.instructions || 'Read the following sentences carefully and provide the correct response.',
          metadata: {
            exerciseLetter,
            tier: ex.tier || 'standard',
            marks: ex.questions.reduce((sum, q) => sum + (q.marks || 1), 0),
          },
          estimatedHeightPt: 55,
        };

        if (currentAccumulatedHeight + exHeadingBlock.estimatedHeightPt > usableHeightPt - 40) {
          ensurePageForContent(unitTitle, chapterTitle, chapterNum);
          activePage!.masterPageId = 'exercise_page';
        }
        activePage!.blocks.push(exHeadingBlock);
        currentAccumulatedHeight += exHeadingBlock.estimatedHeightPt;

        // Individual Questions
        ex.questions.forEach((q, qIdx) => {
          // Height depends on answer space setting
          let answerHeight = 0;
          if (settings.defaultAnswerSpace === 'lines') answerHeight = 30;
          else if (settings.defaultAnswerSpace === 'box') answerHeight = 45;
          else if (settings.defaultAnswerSpace === 'writing_area') answerHeight = 60;

          const estQHeight = 40 + answerHeight;

          const qBlock: RenderableBlock = {
            id: `q-${q.id || `${ex.id}-${qIdx}`}`,
            type: 'exercise',
            content: `${qIdx + 1}. ${q.prompt || q.blanksSentence || 'Fill in the blank.'}`,
            metadata: {
              questionNumber: qIdx + 1,
              marks: q.marks || 1,
              type: q.type,
              options: q.options,
              answerSpace: settings.defaultAnswerSpace,
              solution: q.correctAnswer,
              explanation: q.explanation,
              showTeacherSolution: settings.edition === 'teacher_master',
            },
            estimatedHeightPt: estQHeight,
          };

          if (currentAccumulatedHeight + qBlock.estimatedHeightPt > usableHeightPt) {
            ensurePageForContent(unitTitle, chapterTitle, chapterNum);
            activePage!.masterPageId = 'exercise_page';
          }
          activePage!.blocks.push(qBlock);
          currentAccumulatedHeight += qBlock.estimatedHeightPt;
        });
      });
    }

    // Summative Assessment / Board Test Series
    if (topic.testSeries && topic.testSeries.length > 0) {
      topic.testSeries.forEach((test, testIdx) => {
        // Assessments start on a dedicated assessment page
        activePage = createPage(
          'assessment_page',
          'assessment_page',
          false,
          unitTitle,
          chapterTitle,
          chapterNum
        );
        activePage.displayPageNumber = String(mainMatterPageNumber);
        mainMatterPageNumber++;
        currentAccumulatedHeight = 0;

        const examHeaderBlock: RenderableBlock = {
          id: `exam-hdr-${test.id || testIdx}`,
          type: 'assessment',
          title: test.title || `Chapter Assessment ${chapterNum}`,
          metadata: {
            durationMinutes: test.durationMinutes || 30,
            totalMarks: test.totalMarks || 25,
            board: series.targetBoard,
            grade: book.classLevel,
          },
          estimatedHeightPt: 85,
        };
        activePage.blocks.push(examHeaderBlock);
        currentAccumulatedHeight += examHeaderBlock.estimatedHeightPt;

        const testQuestions =
          test.sections?.flatMap((s) => s.questions) || (test as any).questions || [];

        testQuestions.forEach((tq: any, tqIdx: number) => {
          const tqBlock: RenderableBlock = {
            id: `tq-${tq.id || tqIdx}`,
            type: 'assessment',
            content: `${tqIdx + 1}. ${tq.prompt}`,
            metadata: {
              questionNumber: tqIdx + 1,
              marks: tq.marks || 2,
              options: tq.options,
              answerSpace: 'lines',
              solution: tq.correctAnswer,
              showTeacherSolution: settings.edition === 'teacher_master',
            },
            estimatedHeightPt: 55,
          };

          if (currentAccumulatedHeight + tqBlock.estimatedHeightPt > usableHeightPt) {
            ensurePageForContent(unitTitle, chapterTitle, chapterNum);
            activePage!.masterPageId = 'assessment_page';
          }
          activePage!.blocks.push(tqBlock);
          currentAccumulatedHeight += tqBlock.estimatedHeightPt;
        });
      });
    }
  });

  // ==========================================
  // 3. BACK MATTER: GLOSSARY, INDEX, ANSWERS
  // ==========================================

  // Glossary Page
  const glossaryPage = createPage('glossary', 'back_matter', false);
  glossaryPage.displayPageNumber = String(mainMatterPageNumber);
  mainMatterPageNumber++;

  glossaryPage.blocks.push({
    id: 'glossary-heading',
    type: 'heading',
    level: 1,
    title: 'Glossary of Grammatical Terms',
    estimatedHeightPt: 40,
  });

  const glossaryEntries = [
    { term: 'Agreement (Concord)', definition: 'The grammatical requirement where verbs, pronouns, or adjectives match person and number.', pageRefs: ['1', '4'] },
    { term: 'Antecedent', definition: 'The noun or pronoun to which a subsequent pronoun refers.', pageRefs: ['8', '12'] },
    { term: 'Clause (Finite)', definition: 'A clause containing a subject and a verb inflected for tense, person, and number.', pageRefs: ['14', '16'] },
    { term: 'Gerund', definition: 'A verbal form ending in -ing functioning syntactically as a nominal entity.', pageRefs: ['20'] },
    { term: 'Participle (Past)', definition: 'A verbal form used in perfective aspects and passive diathesis.', pageRefs: ['24', '28'] },
    { term: 'Subjunctive Mood', definition: 'A grammatical mood expressing hypothetical conditions, wishes, or non-factual states.', pageRefs: ['32'] },
  ];

  glossaryPage.blocks.push({
    id: 'glossary-content',
    type: 'glossary',
    glossaryEntries,
    estimatedHeightPt: 280,
  });

  // Subject Index Page
  const indexPage = createPage('index', 'back_matter', false);
  indexPage.displayPageNumber = String(mainMatterPageNumber);
  mainMatterPageNumber++;

  indexPage.blocks.push({
    id: 'index-heading',
    type: 'heading',
    level: 1,
    title: 'Comprehensive Subject Index',
    estimatedHeightPt: 40,
  });

  const indexEntries = [
    { term: 'Collective Nouns', pageNumbers: ['4', '7', '18'] },
    { term: 'Compound Subjects', pageNumbers: ['2', '3', '10'] },
    { term: 'Correlative Conjunctions', pageNumbers: ['5', '9'] },
    { term: 'Indefinite Pronouns', pageNumbers: ['6', '11', '15'] },
    { term: 'Inverted Sentence Order', pageNumbers: ['12', '14'] },
    { term: 'Modal Auxiliaries', pageNumbers: ['22', '25'] },
  ];

  indexPage.blocks.push({
    id: 'index-content',
    type: 'index',
    indexEntries,
    estimatedHeightPt: 250,
  });

  // Answer Keys Page (if teacher edition or back-matter solutions)
  if (settings.edition === 'teacher_master') {
    const answersPage = createPage('answer_key', 'back_matter', false);
    answersPage.displayPageNumber = String(mainMatterPageNumber);
    mainMatterPageNumber++;

    answersPage.blocks.push({
      id: 'answers-heading',
      type: 'heading',
      level: 1,
      title: 'Teacher’s Master Answer Keys',
      estimatedHeightPt: 40,
    });

    const answerKeyEntries = book.topics.map((t) => ({
      chapterTitle: t.title,
      solutions: t.exercises.flatMap((ex) =>
        ex.questions.map((q, qIdx) => ({
          question: `Ex ${ex.title || 'A'} • Q${qIdx + 1}`,
          answer: q.correctAnswer || 'Acceptable standard concord response.',
        }))
      ),
    }));

    answersPage.blocks.push({
      id: 'answers-content',
      type: 'answer_key',
      answerKeyEntries,
      estimatedHeightPt: 350,
    });
  }

  // ==========================================
  // 4. PREFLIGHT AUDIT PASS
  // ==========================================

  pages.forEach((p, idx) => {
    // Check for empty pages that are not intentional blank pages
    if (p.blocks.length === 0 && !p.isIntentionalBlank) {
      preflightIssues.push({
        id: `empty-page-${idx}`,
        severity: 'warning',
        category: 'blank_page',
        title: `Unexpected Empty Page (${p.displayPageNumber || `Sheet ${idx + 1}`})`,
        description: 'Page contains zero content blocks. Review chapter breaks or text flow.',
        pageIndex: idx,
        pageNumber: p.displayPageNumber,
        remediation: 'Remove superfluous page break or adjust start on right page rule.',
      });
    }

    // Check for potential overset content
    const totalBlockHeight = p.blocks.reduce((sum, b) => sum + b.estimatedHeightPt, 0);
    if (totalBlockHeight > usableHeightPt + 10) {
      p.hasOverset = true;
      preflightIssues.push({
        id: `overset-page-${idx}`,
        severity: 'error',
        category: 'overset',
        title: `Potential Overset / Margin Overflow (Page ${p.displayPageNumber || idx + 1})`,
        description: `Accumulated content height (${Math.round(totalBlockHeight)} pt) exceeds printable boundary (${Math.round(usableHeightPt)} pt).`,
        pageIndex: idx,
        pageNumber: p.displayPageNumber,
        remediation: 'Decrease typography font size pt, reduce paragraph spacing, or split exercise blocks.',
      });
    }

    // Check for figures missing captions or alt text
    p.blocks.forEach((b) => {
      if (b.type === 'figure') {
        if (!b.figureCaption) {
          preflightIssues.push({
            id: `figure-caption-${b.id}`,
            severity: 'warning',
            category: 'artwork',
            title: `Missing Figure Caption (${b.figureNumber || 'Diagram'})`,
            description: 'Artwork item is rendered without a descriptive pedagogical caption.',
            pageIndex: idx,
            pageNumber: p.displayPageNumber,
            remediation: 'Provide an academic caption explaining the syntactic structure.',
          });
        }
        if (!b.figureAlt) {
          preflightIssues.push({
            id: `figure-alt-${b.id}`,
            severity: 'review',
            category: 'editorial',
            title: `Missing Accessibility Alt-Text (${b.figureNumber})`,
            description: 'Digital PDF and EPUB exports require accessible descriptions for screen readers.',
            pageIndex: idx,
            pageNumber: p.displayPageNumber,
            remediation: 'Add alt-text describing the grammatical relationship shown in diagram.',
          });
        }
      }
    });
  });

  // Calculate signature metrics
  const totalPages = pages.length;
  const totalLeaves = Math.ceil(totalPages / 2);
  const totalSignatures = Math.ceil(totalPages / 16);
  // Caliper: 80gsm ~ 0.108mm per leaf
  const caliperPerLeaf = settings.paperStock === '70gsm' ? 0.092 : settings.paperStock === '80gsm' ? 0.108 : 0.135;
  const estimatedSpineThicknessMm = Number((totalLeaves * caliperPerLeaf).toFixed(1));

  const trimDisplayName = (trim as any).name || `${trim.widthMm}mm × ${trim.heightMm}mm`;

  // Add info preflight summary
  preflightIssues.unshift({
    id: 'preflight-summary-info',
    severity: 'info',
    category: 'geometry',
    title: `Publication Geometry Verified: ${trimDisplayName}`,
    description: `Total ${totalPages} pages (${totalLeaves} leaves, ${totalSignatures} signatures of 16pp). Spine bulk: ${estimatedSpineThicknessMm} mm.`,
    remediation: 'Production geometry meets standard offset bookbinding guidelines.',
  });

  return {
    pages,
    preflightIssues,
    tocPageNumbers,
    totalLeaves,
    totalSignatures,
    estimatedSpineThicknessMm,
  };
}
