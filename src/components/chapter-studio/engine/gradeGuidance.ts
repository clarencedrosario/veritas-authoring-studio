/**
 * Grade-Aware & Board-Aware Guidance Helper for VERITAS Academic Book Studio
 * 
 * CRITICAL DIRECTIVES:
 * - Adapts dynamically across K-12 grades (Class 1 to 12).
 * - NEVER hardcodes Class 6.
 * - Supports CISCE, CBSE, Cambridge, and Custom curricula with authentic pedagogical guidance.
 */

export type GradeBand =
  | 'early_primary' // Class 1–2
  | 'primary'       // Class 3–5
  | 'middle'        // Class 6–8
  | 'secondary'     // Class 9–10
  | 'senior';       // Class 11–12

export interface GradeGuidanceDetails {
  band: GradeBand;
  bandLabel: string;
  classLevel: string;
  pedagogicalFocus: string;
  toneAndVoice: string;
  cognitiveLevel: string;
  recommendedVisualRatio: string;
  terminologyDepth: string;
  scaffoldingLevel: 'Heavy' | 'Moderate' | 'Light' | 'Minimal / Independent';
  authoringAdvice: string;
  aiPromptDirectives: string[];
}

export interface BoardGuidanceDetails {
  boardName: string;
  systemCode: string;
  curricularFramework: string;
  stylisticPreferences: string;
  assessmentStyle: string;
  authoringPriorities: string[];
}

/**
 * Normalizes any class/grade string (e.g. "Class 3", "Grade 7", "Stage 9", "Class 11")
 * into its numerical equivalent (1–12) and returns the pedagogical GradeBand.
 */
export function getGradeBand(classLevel: string | undefined): GradeBand {
  if (!classLevel) return 'middle';
  const digits = classLevel.replace(/\D/g, '');
  const num = parseInt(digits, 10);

  if (isNaN(num)) {
    const lower = classLevel.toLowerCase();
    if (lower.includes('primary') || lower.includes('junior')) return 'primary';
    if (lower.includes('middle')) return 'middle';
    if (lower.includes('senior') || lower.includes('higher')) return 'senior';
    return 'middle';
  }

  if (num <= 2) return 'early_primary';
  if (num <= 5) return 'primary';
  if (num <= 8) return 'middle';
  if (num <= 10) return 'secondary';
  return 'senior';
}

/**
 * Provides comprehensive pedagogical parameters based on the active class level.
 */
export function getGradeGuidance(classLevel: string | undefined): GradeGuidanceDetails {
  const band = getGradeBand(classLevel);
  const normalizedClass = classLevel || 'Selected Class';

  switch (band) {
    case 'early_primary':
      return {
        band,
        bandLabel: 'Early Primary (Class 1–2)',
        classLevel: normalizedClass,
        pedagogicalFocus: 'Oral pattern recognition, pictorial naming, simple naming/action words, and foundational phonics/syntax.',
        toneAndVoice: 'Warm, encouraging, playful, immediate, and concrete with short, highly decodable sentences.',
        cognitiveLevel: 'Remembering & Naming (Bloom Level 1)',
        recommendedVisualRatio: 'High (60% visual / 40% text)',
        terminologyDepth: 'Informal: "Naming words" rather than "Substantives", "Action words" rather than "Finite Verbs".',
        scaffoldingLevel: 'Heavy',
        authoringAdvice: 'Use vivid everyday animal/home contexts, single-clause examples, zero abstract grammatical jargon, and visual prompts.',
        aiPromptDirectives: [
          'Use extremely simple vocabulary appropriate for 6–7 year olds.',
          'Keep sentences under 7–8 words.',
          'Rely on concrete everyday familiar objects (toys, pets, fruit, family).',
          'Avoid abstract grammatical terms like "transitive", "clause", or "aspect".',
        ],
      };

    case 'primary':
      return {
        band,
        bandLabel: 'Primary (Class 3–5)',
        classLevel: normalizedClass,
        pedagogicalFocus: 'Sentence boundary security, basic concord (singular/plural), parts of speech identification, and simple/compound sentence generation.',
        toneAndVoice: 'Curious, structured, supportive, and lucid with clear model sentences and relatable student situations.',
        cognitiveLevel: 'Understanding & Applying (Bloom Level 2–3)',
        recommendedVisualRatio: 'Moderate-High (40% visual / 60% text)',
        terminologyDepth: 'Standard elementary grammar terms: Noun, Verb, Pronoun, Adjective, Tense, Subject, Predicate.',
        scaffoldingLevel: 'Moderate',
        authoringAdvice: 'Anchor each rule with a concrete everyday story snippet. Provide 2 clear examples before asking students to attempt drills.',
        aiPromptDirectives: [
          'Target age group 8–10 years old.',
          'Use accessible school and playground contexts.',
          'Focus on clear step-by-step contrast between singular and plural forms.',
          'Include friendly, relatable character names and diverse real-world settings.',
        ],
      };

    case 'middle':
      return {
        band,
        bandLabel: 'Middle School (Class 6–8)',
        classLevel: normalizedClass,
        pedagogicalFocus: 'Formal syntax, clause analysis, complex concord, aspectual tense shifts, voice transformations, and precise error diagnosis.',
        toneAndVoice: 'Scholarly yet engaging, intellectually respectful, clear, and systematically organized.',
        cognitiveLevel: 'Applying & Analysing (Bloom Level 3–4)',
        recommendedVisualRatio: 'Balanced (25% visual / 75% text)',
        terminologyDepth: 'Authoritative grammatical vocabulary: Finite Verb, Relative Clause, Subordinating Conjunction, Intervening Prepositional Phrase.',
        scaffoldingLevel: 'Moderate',
        authoringAdvice: 'Explicitly explain the mechanical underlying rule. Show why errors occur through contrastive analysis.',
        aiPromptDirectives: [
          'Target age group 11–13 years old transitioning to formal secondary grammar.',
          'Provide precise grammatical explanations explaining syntactic relationships.',
          'Highlight common traps like intervening prepositional phrases and collective nouns.',
          'Provide structured multi-step reasoning for worked examples.',
        ],
      };

    case 'secondary':
      return {
        band,
        bandLabel: 'Secondary / Board Examination (Class 9–10)',
        classLevel: normalizedClass,
        pedagogicalFocus: 'Board examination rigor, complex transformations (synthesis, inversion), nuanced editing, passage proofreading, and formal composition harmony.',
        toneAndVoice: 'Rigorous, exam-focused, articulate, and analytically sharp.',
        cognitiveLevel: 'Analysing & Evaluating (Bloom Level 4–5)',
        recommendedVisualRatio: 'Text-Dense (10% diagrams / 90% text)',
        terminologyDepth: 'Full academic linguistic terms: Subjunctive mood, Non-finite verbals, Gerundial clauses, Correlative concord, Parallelism.',
        scaffoldingLevel: 'Light',
        authoringAdvice: 'Align strictly with board examination blueprints (CISCE Paper 1 / CBSE Section B / CAIE Paper 1). Train students to catch subtle distractors.',
        aiPromptDirectives: [
          'Target age group 14–16 years old preparing for official board certification.',
          'Emphasize examination traps, subtle false attractions, and precise rule constraints.',
          'Include high-level passage contexts and rigorous transformations.',
        ],
      };

    case 'senior':
      return {
        band,
        bandLabel: 'Senior Secondary (Class 11–12)',
        classLevel: normalizedClass,
        pedagogicalFocus: 'Advanced rhetoric, stylistic synthesis, register variation, historical/formal idiom, discourse markers, and competitive academic writing.',
        toneAndVoice: 'Academic, sophisticated, publication-grade, and stylistically refined.',
        cognitiveLevel: 'Evaluating & Creating (Bloom Level 5–6)',
        recommendedVisualRatio: 'Scholarly (Clean typographical layout with tables and structural trees)',
        terminologyDepth: 'Comprehensive linguistic terminology and stylistic rhetorical analysis.',
        scaffoldingLevel: 'Minimal / Independent',
        authoringAdvice: 'Provide nuanced exceptions, formal register variations, and stylistic rationale beyond mechanical rule compliance.',
        aiPromptDirectives: [
          'Target young adult scholars (17–18 years old).',
          'Feature sophisticated literary and journalistic sentence structures.',
          'Discuss stylistic nuance, rhetorical impact, and edge-case exceptions.',
        ],
      };
  }
}

/**
 * Returns curriculum-specific priorities based on the active board/programme.
 */
export function getBoardGuidance(boardNameOrSystem: string | undefined): BoardGuidanceDetails {
  const b = (boardNameOrSystem || '').toUpperCase();

  if (b.includes('CISCE') || b.includes('ICSE') || b.includes('ISC')) {
    return {
      boardName: 'CISCE (ICSE / ISC)',
      systemCode: 'CISCE',
      curricularFramework: 'CISCE Curriculum for English Language & Literature',
      stylisticPreferences: 'Rigorous formal syntactic rules, precise traditional Latinate grammatical terminology, heavy emphasis on sentence transformation (Question 5 format).',
      assessmentStyle: 'Direct transformation without changing meaning, passage editing, preposition precision, and strict concordance.',
      authoringPriorities: [
        'Insist on precise syntactic terminology (e.g., Finite vs Non-finite, Correlative Conjunctions).',
        'Frame error analysis around ICSE Question 5 sentence transformation rubrics.',
        'Emphasize exact prepositional collocations and subtle mood/tense forms.',
      ],
    };
  }

  if (b.includes('CAMBRIDGE') || b.includes('CAIE') || b.includes('CHECKPOINT') || b.includes('IGCSE')) {
    return {
      boardName: 'Cambridge Assessment International Education (CAIE)',
      systemCode: 'Cambridge',
      curricularFramework: 'Cambridge Lower Secondary / IGCSE English Curriculum Framework',
      stylisticPreferences: 'Inquiry-led discovery, international English conventions (UK spelling), communicative effectiveness, and authentic context.',
      assessmentStyle: 'Text-in-context evaluation, functional communication, reader impact, and international language precision.',
      authoringPriorities: [
        'Use standard British English spelling conventions (colour, organise, centre).',
        'Present grammar in engaging global and international extracts.',
        'Focus on how grammatical choice alters authorial tone and meaning.',
      ],
    };
  }

  // Default to CBSE / National Curriculum Framework (NCF)
  return {
    boardName: 'CBSE / NCF',
    systemCode: 'CBSE',
    curricularFramework: 'National Curriculum Framework (NCF) / CBSE Secondary English Curriculum',
    stylisticPreferences: 'Communicative and functional English, inductive pattern-finding, integrated grammar exercises, gap-filling, sentence reordering, and dialogue completion.',
    assessmentStyle: 'Integrated grammar passages, editing/omission drills, sentence reordering, and applied composition rubrics.',
    authoringPriorities: [
      'Balance explicit structural rules with everyday functional communication.',
      'Provide contextual dialogues and multi-sentence passages rather than isolated phrases.',
      'Align pitfalls with high-frequency errors observed in CBSE national board papers.',
    ],
  };
}

/**
 * Builds an authentic, grade- and board-aware AI system prompt for chapter component generation.
 */
export function buildContextAwareAiPrompt(
  componentTitle: string,
  topic: string,
  classLevel: string | undefined,
  board: string | undefined,
  taskDescription: string,
  schemaPrompt: string
): string {
  const grade = getGradeGuidance(classLevel);
  const boardInfo = getBoardGuidance(board);

  return `You are a distinguished K-12 English Language & Grammar textbook author and curriculum director for VERITAS Academic Publishing.

CURRICULAR CONTEXT:
- Active Board / Programme: ${boardInfo.boardName} (${boardInfo.curricularFramework})
- Active Class Level: ${grade.classLevel} (${grade.bandLabel})
- Pedagogical Focus: ${grade.pedagogicalFocus}
- Tone & Voice: ${grade.toneAndVoice}
- Cognitive Depth: ${grade.cognitiveLevel}
- Terminology Depth: ${grade.terminologyDepth}
- Grammar Topic: "${topic}"
- Target Component: ${componentTitle}

PEDAGOGICAL DIRECTIVES:
${grade.aiPromptDirectives.map((d) => `- ${d}`).join('\n')}
${boardInfo.authoringPriorities.map((p) => `- ${p}`).join('\n')}

TASK:
${taskDescription}

OUTPUT REQUIREMENT:
Return a strictly valid JSON object matching this schema (do not wrap in markdown or backticks):
${schemaPrompt}
`;
}
