import {
  DevelopmentalTier,
  TierScaffoldingMetadata,
  GrammarQuestion,
  GrammarTopic,
  GrammarDefinition,
} from '../types';

export const TIER_METADATA: Record<DevelopmentalTier, TierScaffoldingMetadata> = {
  foundation: {
    tier: 'foundation',
    label: 'Foundation (Remedial)',
    sublabel: 'Scaffolding & Visual Cues',
    targetGroup: 'Remediation, language learners, or students needing guided concept verification.',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    description:
      'Features high scaffolding: visual formula reminders, bracketed word banks, step-by-step breakdown, and reduced cognitive load to build core confidence.',
    scaffoldingCharacteristics: [
      'Visual syntax formulas & rule anchors',
      'Bracketed hints and cue words',
      'Clear binary choices or high-contrast distractors',
      'Step-by-step guided recognition',
    ],
  },
  standard: {
    tier: 'standard',
    label: 'Standard (Grade-Level)',
    sublabel: 'Core Board Benchmarks',
    targetGroup: 'Mainstream grade-level syllabus (CBSE, ICSE, Cambridge standard expectations).',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeBorder: 'border-blue-500/30 dark:border-blue-500/40',
    badgeText: 'text-blue-800 dark:text-blue-300',
    description:
      'Rigorous grade-level assessments testing independent rule application, direct transformation, and error editing without overt cues.',
    scaffoldingCharacteristics: [
      'Authentic exam-style prompts',
      'Contextual sentences with realistic distractors',
      'Sentence transformations without hints',
      'Standard error-spotting & editing passages',
    ],
  },
  advanced: {
    tier: 'advanced',
    label: 'Advanced / Olympiad',
    sublabel: 'Enrichment & HOTS Challenge',
    targetGroup: 'Gifted students, English Olympiad (IEO) aspirants, and board exam top scorers.',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeBorder: 'border-purple-500/30 dark:border-purple-500/40',
    badgeText: 'text-purple-800 dark:text-purple-300',
    description:
      'Deep syntactic synthesis, rare grammatical exceptions, multi-clause restructuring, archaic or formal idioms, and Higher Order Thinking Skills (HOTS).',
    scaffoldingCharacteristics: [
      'Multi-clause syntactic transformations',
      'Nuanced exception handling & irregular forms',
      'Dual-error spotting with grammatical justification',
      'Higher Order Thinking Skills (HOTS) synthesis',
    ],
  },
};

/**
 * Infers tier from question properties if not explicitly assigned.
 */
export function inferQuestionTier(q: GrammarQuestion): DevelopmentalTier {
  if (q.tier) return q.tier;
  if (q.difficulty === 'Easy') return 'foundation';
  if (q.difficulty === 'Hard') return 'advanced';
  return 'standard';
}

/**
 * Group questions across exercises by developmental tier.
 */
export function groupTopicQuestionsByTier(topic: GrammarTopic): {
  foundation: GrammarQuestion[];
  standard: GrammarQuestion[];
  advanced: GrammarQuestion[];
} {
  const foundation: GrammarQuestion[] = [];
  const standard: GrammarQuestion[] = [];
  const advanced: GrammarQuestion[] = [];

  topic.exercises.forEach((ex) => {
    ex.questions.forEach((q) => {
      const tier = inferQuestionTier(q);
      if (tier === 'foundation') foundation.push(q);
      else if (tier === 'advanced') advanced.push(q);
      else standard.push(q);
    });
  });

  return { foundation, standard, advanced };
}

/**
 * Generates sample tiered questions for a topic when a tier lacks questions.
 */
export function generateScaffoldedQuestionsForTier(
  topic: GrammarTopic,
  tier: DevelopmentalTier
): GrammarQuestion[] {
  const timestamp = Date.now();
  const title = topic.title;

  if (tier === 'foundation') {
    return [
      {
        id: `scaffold-fnd-${timestamp}-1`,
        type: 'fill_in_blanks',
        prompt: `[Step 1: Scaffolding Rule Reminder] Look at the cue in brackets to complete the sentence:`,
        blanksSentence: `The student ___ (was / were) reading the lesson attentively.`,
        hints: 'Hint: "The student" is singular, so choose "was".',
        acceptableAnswers: ['was'],
        correctAnswer: 'was',
        difficulty: 'Easy',
        tier: 'foundation',
        marks: 1,
        scaffoldingNotes: 'Visual cue provided in brackets. Focus on matching singular subject with singular verb.',
        tierRationale: 'Foundation tier item: Reduces working memory load with a binary choice and rule hint.',
        explanation: 'The singular noun "student" requires the singular past verb "was".',
      },
      {
        id: `scaffold-fnd-${timestamp}-2`,
        type: 'mcq',
        prompt: `Identify the correct usage of ${title.toLowerCase()} from the options:`,
        difficulty: 'Easy',
        tier: 'foundation',
        marks: 1,
        options: [
          'A) Each of the girls has completed her assignment.',
          'B) Each of the girls have completed their assignment.',
          'C) Each girls is completed assignment.',
          'D) Girls each are completed assignment.',
        ],
        correctAnswer: 'A) Each of the girls has completed her assignment.',
        hints: '"Each" is singular and takes a singular verb "has".',
        scaffoldingNotes: 'Distractors feature blatant agreement errors for easy contrast.',
        tierRationale: 'Reinforces core rule recognition.',
        explanation: '"Each" is a distributive pronoun treated as singular, requiring "has".',
      },
    ];
  }

  if (tier === 'advanced') {
    return [
      {
        id: `scaffold-adv-${timestamp}-1`,
        type: 'transformation',
        prompt: `[Olympiad HOTS Challenge] Synthesize the following clauses into a single periodic sentence without using "and", "so", or "because":`,
        instruction: 'Maintain strict subjunctive mood or inversion syntax as appropriate.',
        originalSentence: 'The committee members differed sharply on the financial policy. They refused to ratify the annual budget.',
        correctedSentence: 'Differing sharply on the financial policy, the committee members refused to ratify the annual budget.',
        correctAnswer: 'Differing sharply on the financial policy, the committee members refused to ratify the annual budget. / So sharply did the committee members differ on the financial policy that they refused to ratify the annual budget.',
        difficulty: 'Hard',
        tier: 'advanced',
        marks: 3,
        scaffoldingNotes: 'Requires participial clause reduction or fronted adverbial inversion.',
        tierRationale: 'Advanced Olympiad tier: Tests multi-level syntactic synthesis and stylistic variety.',
        explanation: 'Transforms two coordinate clauses into an elegant complex sentence using a participial phrase.',
      },
      {
        id: `scaffold-adv-${timestamp}-2`,
        type: 'error_correction',
        prompt: `[Double Error Spotting & Syntactic Justification] Identify two subtle grammatical errors in the sentence below and provide the corrected version:`,
        originalSentence: 'Neither of the five candidates who was interviewed were deemed eligible by the board.',
        correctedSentence: 'None of the five candidates who were interviewed was deemed eligible by the board.',
        correctAnswer: '1. Change "Neither" to "None" (neither is only for two). 2. Change "was" to "were" (relative pronoun refers to plural "candidates"). 3. Change "were deemed" to "was deemed" (agrees with "None").',
        difficulty: 'Hard',
        tier: 'advanced',
        marks: 3,
        scaffoldingNotes: 'Examines "neither vs. none" limitation plus relative pronoun clause agreement.',
        tierRationale: 'Olympiad-level discernment of multiple interacting agreement rules.',
        explanation: '"Neither" applies strictly to two items; for five, use "None". The relative clause "who were interviewed" modifies "candidates", while the main verb agrees with "None" (singular).',
      },
    ];
  }

  // Standard
  return [
    {
      id: `scaffold-std-${timestamp}-1`,
      type: 'fill_in_blanks',
      prompt: `Complete the sentence with the appropriate grammatical form:`,
      blanksSentence: `The bouquet of yellow roses ___ (smell / smells) fragrant in the sunlight.`,
      acceptableAnswers: ['smells'],
      correctAnswer: 'smells',
      difficulty: 'Medium',
      tier: 'standard',
      marks: 1,
      scaffoldingNotes: 'Requires ignoring intervening prepositional phrase "of yellow roses".',
      tierRationale: 'Standard curriculum benchmark testing true subject identification.',
      explanation: 'The true subject is the singular collective "bouquet", which takes the singular verb "smells".',
    },
    {
      id: `scaffold-std-${timestamp}-2`,
      type: 'transformation',
      prompt: `Rewrite the sentence beginning with the specified phrase:`,
      instruction: 'Begin with: "No sooner..."',
      originalSentence: 'As soon as the bell rang, the students rushed to the playground.',
      correctedSentence: 'No sooner did the bell ring than the students rushed to the playground.',
      correctAnswer: 'No sooner did the bell ring than the students rushed to the playground.',
      difficulty: 'Medium',
      tier: 'standard',
      marks: 2,
      scaffoldingNotes: 'Standard ICSE/CBSE correlative conjunction transformation: "No sooner... than".',
      tierRationale: 'Core grade-level transformation objective without overt hints.',
      explanation: '"No sooner" takes auxiliary inversion ("did the bell ring") paired strictly with "than".',
    },
  ];
}

export interface DifferentiatedWorksheetConfig {
  mode: 'dual_tracks' | 'mixed_classroom_master';
  selectedTier: DevelopmentalTier; // For dual_tracks mode
  includeFormulasSheet: boolean;
  includeHints: boolean; // Relevant for foundation
  includeTeacherAnswerKey: boolean;
  includeRemediationRubric: boolean;
  schoolName: string;
  teacherName: string;
  worksheetTitle: string;
  dueDate: string;
}

/**
 * Generates an all-inclusive, print-styled HTML document for differentiated worksheets.
 */
export function generateDifferentiatedWorksheetHtml(
  topic: GrammarTopic,
  config: DifferentiatedWorksheetConfig
): string {
  const isMixedMaster = config.mode === 'mixed_classroom_master';
  const { foundation, standard, advanced } = groupTopicQuestionsByTier(topic);

  // If a tier is empty, supplement with scaffolded questions
  const fndList = foundation.length > 0 ? foundation : generateScaffoldedQuestionsForTier(topic, 'foundation');
  const stdList = standard.length > 0 ? standard : generateScaffoldedQuestionsForTier(topic, 'standard');
  const advList = advanced.length > 0 ? advanced : generateScaffoldedQuestionsForTier(topic, 'advanced');

  const defFormula = topic.definitions[0]?.formulaOrSyntax || 'Subject + Verb Agreement';
  const defRules = topic.definitions[0]?.rules || [];

  const renderQuestionItem = (q: GrammarQuestion, index: number, showTierTag: boolean) => {
    const tierMeta = TIER_METADATA[inferQuestionTier(q)];
    let bodyHtml = '';

    if (q.type === 'mcq' && q.options) {
      bodyHtml = `
        <div class="options-grid">
          ${q.options
            .map(
              (opt) =>
                `<div class="option-item"><span class="opt-box"></span> <span>${escapeHtml(opt)}</span></div>`
            )
            .join('')}
        </div>
      `;
    } else if (q.type === 'fill_in_blanks') {
      const sentence = q.blanksSentence || q.prompt;
      bodyHtml = `
        <div class="blank-sentence">
          ${escapeHtml(sentence)}
        </div>
        ${
          config.includeHints && q.hints
            ? `<div class="hint-pill"><strong>Scaffolding Cue:</strong> ${escapeHtml(q.hints)}</div>`
            : ''
        }
      `;
    } else if (q.type === 'match_column' && q.columnA && q.columnB) {
      bodyHtml = `
        <div class="match-table">
          <table>
            <thead>
              <tr><th>Column A</th><th>Column B</th><th>Answer</th></tr>
            </thead>
            <tbody>
              ${q.columnA
                .map(
                  (colA, i) => `
                <tr>
                  <td>${escapeHtml(colA.text)}</td>
                  <td>${escapeHtml(q.columnB![i]?.text || '')}</td>
                  <td class="answer-box">____</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      // Transformation or Error Correction
      bodyHtml = `
        ${q.originalSentence ? `<div class="original-quote"><strong>Original:</strong> "${escapeHtml(q.originalSentence)}"</div>` : ''}
        ${q.instruction ? `<div class="instruction-note"><em>Instruction: ${escapeHtml(q.instruction)}</em></div>` : ''}
        <div class="writing-line"></div>
        <div class="writing-line"></div>
      `;
    }

    const answerKeyHtml = config.includeTeacherAnswerKey
      ? `
        <div class="teacher-key-box">
          <span class="key-badge">TEACHER KEY &amp; RATIONALE:</span>
          <strong>Answer:</strong> ${escapeHtml(q.correctAnswer)}<br/>
          <span class="explanation-text"><em>Pedagogical Notes:</em> ${escapeHtml(q.explanation || q.scaffoldingNotes || 'Standard rule adherence.')}</span>
        </div>
      `
      : '';

    return `
      <div class="question-card">
        <div class="q-header">
          <div class="q-number">
            <strong>Q${index + 1}.</strong> ${escapeHtml(q.prompt)}
          </div>
          <div class="q-marks-tier">
            ${showTierTag ? `<span class="tier-tag ${q.tier || inferQuestionTier(q)}">${tierMeta.label}</span>` : ''}
            <span class="marks-badge">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
          </div>
        </div>
        <div class="q-body">
          ${bodyHtml}
        </div>
        ${answerKeyHtml}
      </div>
    `;
  };

  const renderFormulaCheatSheet = () => {
    if (!config.includeFormulasSheet) return '';
    return `
      <div class="formula-cheat-sheet">
        <div class="sheet-title">STUDENT SCAFFOLDING REFERENCE ANCHOR</div>
        <div class="formula-syntax"><strong>Core Syntactic Formula:</strong> <code>${escapeHtml(defFormula)}</code></div>
        ${
          defRules.length > 0
            ? `<div class="rules-summary">
                <strong>Key Rules to Remember:</strong>
                <ul>
                  ${defRules.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
                </ul>
              </div>`
            : ''
        }
      </div>
    `;
  };

  let contentHtml = '';

  if (isMixedMaster) {
    // Progressive 3-Tier Classroom Master
    contentHtml = `
      <div class="worksheet-header">
        <div class="school-title">${escapeHtml(config.schoolName || 'ACADEMIC PUBLISHING BOARD')}</div>
        <h1 class="main-title">${escapeHtml(config.worksheetTitle || `${topic.title} - Differentiated Mastery Packet`)}</h1>
        <div class="sub-bar">
          <span><strong>Class / Grade:</strong> ${escapeHtml(topic.classLevel)}</span>
          <span><strong>Topic Strand:</strong> ${escapeHtml(topic.category)}</span>
          <span><strong>Date:</strong> ${escapeHtml(config.dueDate || '___ / ___ / 2026')}</span>
        </div>
        <div class="student-info-row">
          <span><strong>Student Name:</strong> ___________________________</span>
          <span><strong>Roll No:</strong> _______</span>
          <span><strong>Assigned Band:</strong> [ ] Foundation &nbsp; [ ] Standard &nbsp; [ ] Advanced</span>
        </div>
      </div>

      ${renderFormulaCheatSheet()}

      <!-- TIER 1: FOUNDATION -->
      <div class="tier-section foundation-section">
        <div class="tier-header-bar fnd-bar">
          <div class="tier-title-group">
            <span class="tier-level-num">TIER 1</span>
            <div>
              <h2 class="tier-name">Foundation Stepping Stones (Remedial &amp; Scaffolding)</h2>
              <p class="tier-desc">Guided exercises with formula anchors, bracketed cues, and direct recognition.</p>
            </div>
          </div>
          <span class="tier-target-badge">Core Competency</span>
        </div>
        <div class="questions-list">
          ${fndList.map((q, i) => renderQuestionItem(q, i, false)).join('')}
        </div>
      </div>

      <!-- TIER 2: STANDARD -->
      <div class="tier-section standard-section">
        <div class="tier-header-bar std-bar">
          <div class="tier-title-group">
            <span class="tier-level-num">TIER 2</span>
            <div>
              <h2 class="tier-name">Standard Grade-Level Practice (Core Syllabus)</h2>
              <p class="tier-desc">Uncued sentence transformations, contextual application, and error detection.</p>
            </div>
          </div>
          <span class="tier-target-badge">Grade Benchmark</span>
        </div>
        <div class="questions-list">
          ${stdList.map((q, i) => renderQuestionItem(q, fndList.length + i, false)).join('')}
        </div>
      </div>

      <!-- TIER 3: ADVANCED / OLYMPIAD -->
      <div class="tier-section advanced-section">
        <div class="tier-header-bar adv-bar">
          <div class="tier-title-group">
            <span class="tier-level-num">TIER 3</span>
            <div>
              <h2 class="tier-name">Olympiad &amp; HOTS Challenge (Enrichment)</h2>
              <p class="tier-desc">Complex clause synthesis, syntactic nuances, and multi-error justification.</p>
            </div>
          </div>
          <span class="tier-target-badge">Olympiad &amp; HOTS</span>
        </div>
        <div class="questions-list">
          ${advList.map((q, i) => renderQuestionItem(q, fndList.length + stdList.length + i, false)).join('')}
        </div>
      </div>

      ${
        config.includeRemediationRubric
          ? `
        <div class="differentiation-rubric">
          <h3>TEACHER DIFFERENTIATION RUBRIC &amp; EVALUATION GUIDE</h3>
          <table>
            <thead>
              <tr>
                <th>Tier Band</th>
                <th>Target Mastery Outcome</th>
                <th>Threshold for Promotion</th>
                <th>Next Step Intervention</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tier 1: Foundation</strong></td>
                <td>Accurately identifies singular/plural subjects and applies basic concordance with visual cues.</td>
                <td>80%+ score on Tier 1 questions</td>
                <td>Transition student to Tier 2 standard practice with gradual withdrawal of bracketed cues.</td>
              </tr>
              <tr>
                <td><strong>Tier 2: Standard</strong></td>
                <td>Independently spots intervening phrases and transforms sentences according to board criteria.</td>
                <td>85%+ score on Tier 2 questions</td>
                <td>Assign Olympiad challenge extension; introduce inverted and subjunctive constructions.</td>
              </tr>
              <tr>
                <td><strong>Tier 3: Advanced</strong></td>
                <td>Synthesizes multi-clause structures and defends grammatical choices using formal terminology.</td>
                <td>Demonstrates complete syntactic logic</td>
                <td>Enrich with English Language Olympiad past papers and editorial proofreading projects.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
          : ''
      }
    `;
  } else {
    // Single Targeted Track (Dual Export)
    const targetTier = config.selectedTier;
    const tierMeta = TIER_METADATA[targetTier];
    const questionList = targetTier === 'foundation' ? fndList : targetTier === 'advanced' ? advList : stdList;

    contentHtml = `
      <div class="worksheet-header">
        <div class="school-title">${escapeHtml(config.schoolName || 'ACADEMIC PUBLISHING BOARD')}</div>
        <div class="track-badge ${targetTier}">${tierMeta.label.toUpperCase()} TRACK</div>
        <h1 class="main-title">${escapeHtml(config.worksheetTitle || `${topic.title} - ${tierMeta.label} Worksheet`)}</h1>
        <div class="sub-bar">
          <span><strong>Class / Grade:</strong> ${escapeHtml(topic.classLevel)}</span>
          <span><strong>Strand:</strong> ${escapeHtml(topic.category)}</span>
          <span><strong>Due Date:</strong> ${escapeHtml(config.dueDate || '___ / ___ / 2026')}</span>
          <span><strong>Total Marks:</strong> ${questionList.reduce((acc, q) => acc + q.marks, 0)}</span>
        </div>
        <div class="student-info-row">
          <span><strong>Student Name:</strong> ___________________________</span>
          <span><strong>Roll No:</strong> _______</span>
          <span><strong>Score Obtained:</strong> ______ / ${questionList.reduce((acc, q) => acc + q.marks, 0)}</span>
        </div>
      </div>

      ${targetTier === 'foundation' || config.includeFormulasSheet ? renderFormulaCheatSheet() : ''}

      <div class="instructions-banner">
        <strong>General Instructions:</strong> Read each question carefully. Answer in neat handwriting.
        ${targetTier === 'foundation' ? ' Refer to the Scaffolding Reference Anchor if you need a reminder.' : ''}
        ${targetTier === 'advanced' ? ' Show all grammatical steps and justify your syntactic choices where required.' : ''}
      </div>

      <div class="questions-list">
        ${questionList.map((q, i) => renderQuestionItem(q, i, false)).join('')}
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(config.worksheetTitle || 'Differentiated Grammar Worksheet')}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      color: #1c1917;
      background: #ffffff;
      margin: 0;
      padding: 32px;
      font-size: 14pt;
      line-height: 1.65;
    }
    .worksheet-header {
      text-align: center;
      border-bottom: 2.5px solid #1c1917;
      padding-bottom: 18px;
      margin-bottom: 22px;
    }
    .school-title {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 12.5pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #44403c;
    }
    .track-badge {
      display: inline-block;
      margin: 6px 0;
      padding: 5px 14px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 1px;
      border-radius: 6px;
    }
    .track-badge.foundation {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .track-badge.standard {
      background: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    .track-badge.advanced {
      background: #faf5ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
    }
    .main-title {
      font-size: 22pt;
      margin: 8px 0 10px 0;
      font-weight: bold;
      letter-spacing: -0.01em;
    }
    .sub-bar {
      display: flex;
      justify-content: center;
      gap: 28px;
      font-size: 12pt;
      color: #57534e;
      margin-bottom: 12px;
    }
    .student-info-row {
      display: flex;
      justify-content: space-between;
      font-size: 12.5pt;
      border-top: 1.5px dashed #a8a29e;
      padding-top: 12px;
      margin-top: 12px;
    }
    .formula-cheat-sheet {
      background: #fdfaf6;
      border: 2px solid #d97706;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 22px;
      font-size: 12.5pt;
    }
    .sheet-title {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11.5pt;
      font-weight: 800;
      color: #b45309;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .formula-syntax code {
      font-family: 'Courier New', Courier, monospace;
      background: #fef3c7;
      padding: 4px 10px;
      border-radius: 5px;
      font-size: 12.5pt;
      font-weight: 600;
    }
    .rules-summary ul {
      margin: 8px 0 0 24px;
      padding: 0;
    }
    .rules-summary li {
      margin-bottom: 5px;
    }
    .instructions-banner {
      background: #f5f5f4;
      padding: 12px 18px;
      border-left: 5px solid #78716c;
      font-size: 12.5pt;
      margin-bottom: 22px;
    }
    .tier-section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .tier-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .fnd-bar {
      background: #ecfdf5;
      border-left: 5px solid #059669;
    }
    .std-bar {
      background: #eff6ff;
      border-left: 5px solid #2563eb;
    }
    .adv-bar {
      background: #faf5ff;
      border-left: 5px solid #7c3aed;
    }
    .tier-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tier-level-num {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-weight: 900;
      font-size: 11pt;
      background: #1c1917;
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 5px;
    }
    .tier-name {
      margin: 0;
      font-size: 15pt;
      font-weight: bold;
    }
    .tier-desc {
      margin: 2px 0 0 0;
      font-size: 11.5pt;
      color: #57534e;
    }
    .tier-target-badge {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 5px;
      background: #ffffff;
      border: 1px solid #d6d3d1;
    }
    .question-card {
      margin-bottom: 22px;
      padding-bottom: 16px;
      border-bottom: 1px dotted #d6d3d1;
      page-break-inside: avoid;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .q-number {
      font-size: 14pt;
      font-weight: 600;
      line-height: 1.5;
    }
    .marks-badge {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10.5pt;
      font-weight: bold;
      color: #57534e;
      margin-left: 10px;
    }
    .tier-tag {
      font-size: 9.5pt;
      font-weight: bold;
      padding: 3px 9px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tier-tag.foundation { background: #d1fae5; color: #065f46; }
    .tier-tag.standard { background: #dbeafe; color: #1e40af; }
    .tier-tag.advanced { background: #f3e8ff; color: #6b21a8; }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 22px;
      margin: 12px 0 10px 24px;
      font-size: 13pt;
    }
    .option-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .opt-box {
      width: 16px;
      height: 16px;
      border: 1.5px solid #78716c;
      border-radius: 3px;
      display: inline-block;
      flex-shrink: 0;
    }
    .blank-sentence {
      margin: 10px 0 8px 24px;
      font-size: 13.5pt;
      line-height: 1.6;
    }
    .hint-pill {
      margin: 6px 0 0 24px;
      font-size: 11pt;
      color: #047857;
      background: #f0fdf4;
      border: 1px dashed #86efac;
      padding: 5px 12px;
      border-radius: 5px;
      display: inline-block;
    }
    .match-table table {
      width: 90%;
      margin: 12px auto;
      border-collapse: collapse;
      font-size: 12.5pt;
    }
    .match-table th, .match-table td {
      border: 1px solid #a8a29e;
      padding: 8px 12px;
      text-align: left;
    }
    .match-table th {
      background: #f5f5f4;
    }
    .answer-box {
      text-align: center;
      width: 75px;
    }
    .original-quote {
      margin: 10px 0 8px 24px;
      font-style: italic;
      color: #292524;
      font-size: 13.5pt;
    }
    .instruction-note {
      margin-left: 24px;
      font-size: 11.5pt;
      color: #57534e;
    }
    .writing-line {
      border-bottom: 1.5px solid #a8a29e;
      height: 28px;
      margin: 10px 0 0 24px;
    }
    .teacher-key-box {
      margin-top: 12px;
      margin-left: 24px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      font-size: 11.5pt;
      color: #991b1b;
    }
    .key-badge {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-weight: 900;
      font-size: 9.5pt;
      color: #b91c1c;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .differentiation-rubric {
      margin-top: 36px;
      page-break-before: always;
      border-top: 2.5px solid #1c1917;
      padding-top: 18px;
    }
    .differentiation-rubric h3 {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 13pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .differentiation-rubric table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5pt;
    }
    .differentiation-rubric th, .differentiation-rubric td {
      border: 1px solid #78716c;
      padding: 7px 10px;
      vertical-align: top;
      text-align: left;
    }
    .differentiation-rubric th {
      background: #e7e5e4;
      font-weight: bold;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;
}

/**
 * Exports formatted Word (.doc) content ready for download.
 */
export function generateWorksheetDocContent(
  topic: GrammarTopic,
  config: DifferentiatedWorksheetConfig
): Blob {
  const html = generateDifferentiatedWorksheetHtml(topic, config);
  const fullDocument = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(config.worksheetTitle)}</title>
        <style>
          body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return new Blob(['\ufeff', fullDocument], {
    type: 'application/msword',
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
