// ============================================================================
// VERITAS ACADEMIC ENGINE: Centralised Class-Level Pedagogical Intelligence
// Single Source of Truth for Grade-Appropriate, Board-Calibrated Educational AI
// ============================================================================

export type PedagogicalTier =
  | 'foundation' // Classes 1–2 (Early Primary, Age 6–7)
  | 'preparatory' // Classes 3–5 (Primary, Age 8–10)
  | 'middle' // Classes 6–8 (Middle School, Age 11–13)
  | 'secondary' // Classes 9–10 (Secondary / Board Prep, Age 14–16)
  | 'senior'; // Classes 11–12 (Senior Secondary / Pre-University, Age 17–18)

export interface ClassPedagogicalProfile {
  tier: PedagogicalTier;
  label: string;
  targetAge: string;
  averageSentenceWords: string;
  toneAndVoice: string;
  vocabularyGuidelines: string[];
  sentenceStructureGuidelines: string[];
  explanationStyle: string;
  exampleDomains: string[];
  headingDirectives: string;
  prohibitedPatterns: string[];
  formattingRules: string[];
  systemInstructionText: string;
}

export interface CurriculumBoardProfile {
  board: string;
  syllabusFocus: string;
  curriculumTerminology: string[];
  pedagogicalExpectations: string[];
  assessmentDirectives: string[];
  guidanceText: string;
}

/**
 * Normalizes any class string (e.g. "Class 6", "Grade 2", "class 11", "6")
 * into a numerical grade 1–12 and its corresponding Pedagogical Tier.
 */
export function parseClassLevelNumber(classLevel?: string | number): number {
  if (typeof classLevel === 'number') {
    return Math.min(12, Math.max(1, Math.round(classLevel)));
  }
  if (!classLevel) return 6; // sensible default

  const match = String(classLevel).match(/\b(1[0-2]|[1-9])\b/);
  if (match) {
    return parseInt(match[1], 10);
  }

  const lower = String(classLevel).toLowerCase();
  if (lower.includes('kg') || lower.includes('kindergarten') || lower.includes('prep') || lower.includes('foundation')) {
    return 1;
  }
  if (lower.includes('primary') || lower.includes('junior')) {
    return 3;
  }
  if (lower.includes('middle') || lower.includes('lower secondary')) {
    return 7;
  }
  if (lower.includes('high') || lower.includes('secondary') || lower.includes('icse') || lower.includes('matric')) {
    return 10;
  }
  if (lower.includes('senior') || lower.includes('isc') || lower.includes('higher') || lower.includes('pre-university')) {
    return 12;
  }

  return 6;
}

export function getPedagogicalTier(classNumber: number): PedagogicalTier {
  if (classNumber <= 2) return 'foundation';
  if (classNumber <= 5) return 'preparatory';
  if (classNumber <= 8) return 'middle';
  if (classNumber <= 10) return 'secondary';
  return 'senior';
}

/**
 * Returns comprehensive, unbending class-level language intelligence for any grade (1–12).
 */
export function getPedagogicalClassProfile(classLevelInput?: string | number): ClassPedagogicalProfile {
  const classNum = parseClassLevelNumber(classLevelInput);
  const tier = getPedagogicalTier(classNum);

  switch (tier) {
    case 'foundation': // Classes 1–2 (Ages 6–7)
      return {
        tier: 'foundation',
        label: `Class ${classNum} (Early Primary / Foundation)`,
        targetAge: 'Age 6–7',
        averageSentenceWords: '5 to 10 words per sentence',
        toneAndVoice: 'Warm, encouraging, cheerful, friendly, and deeply supportive. Direct teacher-to-child voice.',
        vocabularyGuidelines: [
          'Use very simple, concrete, everyday decodable vocabulary familiar to a 6- or 7-year-old child.',
          'Introduce grammar terms immediately with friendly childlike definitions (e.g., "A noun is a naming word").',
          'Strictly avoid abstract linguistic or academic terminology (never use: "constituents", "syntactic", "concord", "nominal", "subordinate").',
          'Keep one single idea per sentence.',
        ],
        sentenceStructureGuidelines: [
          'Write very short, clean sentences (average 5–10 words).',
          'Avoid complex coordinate or subordinate clauses with multiple conjunctions.',
          'Use clear subject-verb-object patterns with familiar nouns.',
        ],
        explanationStyle:
          'Step-by-step concrete storytelling, picture prompts, guided observation ("Look at...", "Notice how...", "Say it out loud").',
        exampleDomains: [
          'Home and family (mom, dad, sister, brother, baby)',
          'School and classroom (pencil, desk, teacher, crayons, book)',
          'Pets and animals (dog, kitten, parrot, lion, rabbit)',
          'Toys and games (ball, teddy bear, bicycle, jump rope)',
          'Food and snacks (apple, milk, bread, mango)',
          'Playground and everyday daily actions (running, jumping, laughing, singing)',
        ],
        headingDirectives:
          'Headings must be short, cheerful, and child-friendly (e.g. "Let Us Begin", "Naming Words All Around Us", "Fun Word Games", "Try This Out", "Remember"). NEVER use academic jargon in headings.',
        prohibitedPatterns: [
          'Academic headings like "Core Conceptual Explanations & Structural Foundations"',
          'Linguistic phrases like "syntactic architecture", "concord between grammatical constituents"',
          'Long abstract paragraphs or dry theoretical definitions',
          'Multiple choice questions with tricky negative distractors',
        ],
        formattingRules: [
          'No visible raw Markdown control characters (###, ####, **text**). Format cleanly for young readers.',
          'Generous spacing, bulleted lists with short phrases, clear bold highlights for target words.',
        ],
        systemInstructionText: `CRITICAL CLASS 1–2 PEDAGOGICAL CONTRACT:
- The target learner is 6–7 years old in Class ${classNum}.
- Write in warm, cheerful, crystal-clear early-primary English (5–10 words per sentence).
- Explain ideas one at a time using everyday terms: "A noun is a naming word."
- Headings MUST be friendly and short (e.g. "Let Us Begin", "Naming Words", "Word Fun", "Try This Out").
- STRICTLY FORBIDDEN: University-level phrases, abstract linguistic terms ("syntactic", "constituents", "concord"), or complicated sentence structures.
- Examples must come from familiar child contexts: home, family, pets, toys, school, food, and playground.`,
      };

    case 'preparatory': // Classes 3–5 (Ages 8–10)
      return {
        tier: 'preparatory',
        label: `Class ${classNum} (Primary / Preparatory)`,
        targetAge: 'Age 8–10',
        averageSentenceWords: '8 to 15 words per sentence',
        toneAndVoice: 'Friendly, encouraging, clear, engaging, and instructional.',
        vocabularyGuidelines: [
          'Simple, clear textbook English with gradually increasing vocabulary.',
          'Correct grammar terminology explained clearly and simply (e.g., subject, action word/verb, singular, plural).',
          'Avoid unnecessarily difficult or archaic words.',
          'Define any new topic word in plain, friendly language with relatable examples.',
        ],
        sentenceStructureGuidelines: [
          'Simple and compound sentences joined by common conjunctions (and, but, so, because).',
          'Gradually introduce introductory phrases while maintaining absolute clarity.',
        ],
        explanationStyle:
          'Clear definitions followed immediately by 2–3 lively relatable examples and a quick rule box.',
        exampleDomains: [
          'School life (school bus, library, science fair, sports day, art room)',
          'Pets, wildlife, and nature (gardens, rivers, birds, seasons)',
          'Hobbies and games (cricket, painting, chess, swimming, puzzles)',
          'Family outings, festivals, and simple adventures',
          'Short, charming narrative vignettes involving school children',
        ],
        headingDirectives:
          'Headings must be clear, welcoming, and direct (e.g. "What Are Nouns?", "Rules to Remember", "Examples in Action", "Let\'s Practice", "Watch Out for Mistakes"). Do NOT use high-brow university titles.',
        prohibitedPatterns: [
          'University-style headings ("Theoretical Foundations", "Exemplary Models & Contrastive Usage")',
          'Abstract linguistic terminology ("syntactic spine", "subcategorization", "nominal agreement")',
          'Convoluted, multi-clause academic sentences',
        ],
        formattingRules: [
          'Never output visible Markdown hashes (###) or star codes (**) in headings or prose.',
          'Use crisp numbered lists and clear rule boxes with distinct labels.',
        ],
        systemInstructionText: `CRITICAL CLASS 3–5 PEDAGOGICAL CONTRACT:
- The target learner is 8–10 years old in Class ${classNum}.
- Write in simple, crystal-clear textbook English (8–15 words per sentence).
- Use correct grammar terms, but explain them simply with real-world clarity.
- Headings must be inviting and straightforward: e.g. "Understanding Nouns", "Rules to Remember", "Let's Practice".
- STRICTLY FORBIDDEN: Pretentious academic jargon ("syntactic architecture", "concordant constituents").
- Examples must draw from primary school life, hobbies, sports, nature, pets, and family stories.`,
      };

    case 'middle': // Classes 6–8 (Ages 11–13)
      return {
        tier: 'middle',
        label: `Class ${classNum} (Middle School / Lower Secondary)`,
        targetAge: 'Age 11–13',
        averageSentenceWords: '12 to 20 words per sentence',
        toneAndVoice: 'Engaging, direct, authoritative yet accessible, intellectually stimulating without being dry.',
        vocabularyGuidelines: [
          'Clear middle-school textbook English.',
          'Use standard, correct grammatical terminology: subject, predicate, finite verb, singular/plural concord, clause, phrase, tense, modifier.',
          'Avoid university-level linguistic jargon (do NOT use: "syntactic architecture governing concord between grammatical constituents", "contrastive distribution", "subcategorization frames").',
          'CORE PRINCIPLE: Never make educational writing complicated simply to make it sound intelligent or academic.',
          'BAD: "Examine the syntactic architecture governing concord between grammatical constituents."',
          'GOOD: "The subject and the verb in a sentence must agree with each other."',
        ],
        sentenceStructureGuidelines: [
          'Balanced sentences with moderate complexity (compound and complex sentences with clear clause boundaries).',
          'Vary sentence lengths naturally: mix short punchy rule statements with well-crafted explanatory sentences.',
        ],
        explanationStyle:
          'Inductive discovery (read an authentic school passage, notice word agreements, deduce the rule), followed by structured principles and practical checks.',
        exampleDomains: [
          'School newspaper editorial desk, debating society, quiz team',
          'Inter-school sports day, science club experiments, astronomy night',
          'History museum visits, geography field trips, environmental projects',
          'Everyday conversations, books, adventure stories, and modern school life',
        ],
        headingDirectives:
          'Clean, direct, natural textbook headings.\n' +
          'BAD HEADING: "Core Conceptual Explanations & Structural Foundations"\n' +
          'GOOD HEADING: "Understanding Subject–Verb Agreement"\n' +
          'BAD HEADING: "Exemplary Models & Contrastive Usage"\n' +
          'GOOD HEADING: "Examples and Correct Usage"\n' +
          'BAD HEADING: "Inquiry & Contextual Discovery"\n' +
          'BETTER HEADING: "Let Us Begin"',
        prohibitedPatterns: [
          'Pretentious, hyper-academic headings and dense theoretical linguistics prose',
          'Artificial, overly elaborate vocabulary used just to sound sophisticated',
          'Raw Markdown control symbols (###, ####, **text**) visible in output',
        ],
        formattingRules: [
          'No visible Markdown hashes or asterisks in titles or final prose.',
          'Clear section blocks: Concept explanation, Rule boxes, Worked examples with step-by-step reasoning, Common traps, Exercises with answers.',
        ],
        systemInstructionText: `CRITICAL CLASS 6–8 PEDAGOGICAL CONTRACT:
- The target learner is 11–13 years old in Class ${classNum}.
- Write in clear, structured middle-school textbook English (12–20 words per sentence).
- CORE PRINCIPLE: Never make educational writing complicated simply to make it sound intelligent or academic!
- ALWAYS prefer clean, accurate clarity:
  • BAD: "Examine the syntactic architecture governing concord between grammatical constituents."
  • GOOD: "The subject and the verb in a sentence must agree with each other."
- HEADINGS must be natural and direct:
  • BAD: "Core Conceptual Explanations & Structural Foundations" -> GOOD: "Understanding Subject–Verb Agreement"
  • BAD: "Exemplary Models & Contrastive Usage" -> GOOD: "Examples and Correct Usage"
  • BAD: "Inquiry & Contextual Discovery" -> BETTER: "Let Us Begin"
- Use standard school grammar terms (subject, predicate, verb, singular, plural, clause). Strictly avoid university linguistic jargon.
- Examples must involve school newspaper, sports day, science club, hobbies, and everyday reading.`,
      };

    case 'secondary': // Classes 9–10 (Ages 14–16)
      return {
        tier: 'secondary',
        label: `Class ${classNum} (Secondary / High School / Board Exam)`,
        targetAge: 'Age 14–16',
        averageSentenceWords: '16 to 25 words per sentence',
        toneAndVoice: 'Scholarly, authoritative, precise, analytical, and exam-focused while remaining completely lucid.',
        vocabularyGuidelines: [
          'Mature secondary-school academic English.',
          'Precise grammatical and literary terminology (finite/non-finite verbs, participle clauses, subordinate conditional clauses, synthesis, transformation of sentences, formal register).',
          'Analytical depth matching ICSE / CBSE Class 10 board specifications.',
          'Must remain fully readable and logical for a 15-year-old student—no gratuitous obscurity.',
        ],
        sentenceStructureGuidelines: [
          'Sophisticated sentence architecture with varied introductory clauses, relative clauses, and appositives.',
          'High precision in clause connection, avoiding dangling modifiers and ambiguity.',
        ],
        explanationStyle:
          'Deductive and analytical explanations, explicit structural formulas, contrastive pairs ("Correct vs. Common Board Trap"), transformation rules, and board examination tips.',
        exampleDomains: [
          'Classic and contemporary literature excerpts (speeches, prose, biographies)',
          'Scientific reporting, environmental policy, formal debate arguments',
          'Civic discourse, historical documents, journalism, and editorial opinion',
          'Formal letters, official notices, and analytical essays',
        ],
        headingDirectives:
          'Structured, academic, and exam-aligned headings (e.g. "Principles of Sentence Transformation", "Rules Governing Concord in Complex Sentences", "Common Board Examination Traps", "Scaffolded Board Practice Drills").',
        prohibitedPatterns: [
          'Childish oversimplification or nursery school examples',
          'Vague or ambiguous rule statements without formal grammatical criteria',
          'Raw Markdown control characters visible in finished text',
        ],
        formattingRules: [
          'No visible Markdown syntax characters in headings or final prose.',
          'Distinct sections for Rules, Formulas, Board Traps, Solved Transformation Examples, and Timed Drills.',
        ],
        systemInstructionText: `CRITICAL CLASS 9–10 PEDAGOGICAL CONTRACT:
- The target learner is 14–16 years old in Class ${classNum} preparing for Board Examinations.
- Write in mature, precise secondary-school academic English (16–25 words per sentence).
- Emphasize structural precision, transformation formulas, and Board examination conventions (ICSE / CBSE).
- Keep explanations analytical, logical, and unambiguous—clarity remains paramount.
- Examples should reflect formal communication, literature, science, history, and persuasive writing.`,
      };

    case 'senior': // Classes 11–12 (Ages 17–18)
    default:
      return {
        tier: 'senior',
        label: `Class ${classNum} (Senior Secondary / Pre-University)`,
        targetAge: 'Age 17–18',
        averageSentenceWords: '18 to 30 words per sentence',
        toneAndVoice: 'Sophisticated, scholarly, nuanced, intellectually rigorous, and publication-grade.',
        vocabularyGuidelines: [
          'Senior-secondary academic English meeting ISC / CBSE / A-Level standards.',
          'Advanced grammatical and stylistic terminology (stylistic inversion, subjunctive mood, nominalisation, rhetorical cadence, syntactic parallelism, discourse markers).',
          'Nuanced analytical distinctions between prescriptive rules, formal register, and contemporary standard usage.',
          'CLARITY PRINCIPLE: Even at Class 12, clarity takes priority over convoluted or ostentatious vocabulary.',
        ],
        sentenceStructureGuidelines: [
          'Complex, periodic, and balanced sentences demonstrating high rhetorical control.',
          'Masterful use of transitional markers and logical argumentation structures.',
        ],
        explanationStyle:
          'Comprehensive theoretical frameworks, historical linguistic context where helpful, exhaustive exception taxonomies, and high-stakes competitive examination problem-solving.',
        exampleDomains: [
          'Literary essays, philosophical arguments, judicial opinions, and historical treatises',
          'Academic research abstracts, scientific journalism, formal diplomacy, and rhetoric',
          'Advanced composition, discursive essays, and competitive examination passages',
        ],
        headingDirectives:
          'Scholarly, publication-grade academic chapter and section headings (e.g. "Theoretical Foundations & Syntactic Principles", "Advanced Concord: Structural Anomalies & Proximity Concord", "Stylistic Variations & Rhetorical Precision", "Comprehensive Assessment & ISC Examination Series").',
        prohibitedPatterns: [
          'Trivial or overly simplified grammar drills',
          'Obscurantist prose that obscures educational meaning',
          'Raw Markdown control characters in the final layout',
        ],
        formattingRules: [
          'No visible Markdown hashes or asterisks in titles or final prose.',
          'Scholarly layout with clear subheadings, analytical notes, and advanced diagnostic keys.',
        ],
        systemInstructionText: `CRITICAL CLASS 11–12 PEDAGOGICAL CONTRACT:
- The target learner is 17–18 years old in Class ${classNum} (Senior Secondary / Pre-University).
- Write in publication-grade, scholarly academic English (18–30 words per sentence).
- Cover advanced grammatical nuances, stylistic inversion, subjunctive mood, and complex syntax.
- CLARITY IS NON-NEGOTIABLE: Never make writing convoluted simply to sound intellectual.
- Examples must come from formal literature, academic essays, science, rhetoric, and civic discourse.`,
      };
  }
}

/**
 * Returns distinct curriculum expectations based on Board/Curriculum (independent of class level).
 */
export function getCurriculumBoardProfile(boardInput?: string): CurriculumBoardProfile {
  const board = (boardInput || 'CBSE').toUpperCase();

  if (board.includes('CISCE') || board.includes('ICSE') || board.includes('ISC')) {
    return {
      board: 'CISCE (ICSE / ISC)',
      syllabusFocus: 'Grammatical precision, sentence synthesis, transformation without changing meaning, and formal accuracy.',
      curriculumTerminology: ['Transformation of Sentences', 'Synthesis of Sentences', 'Direct and Indirect Speech', 'Active and Passive Voice', 'Prepositions and Phrasal Verbs', 'Concord / Agreement'],
      pedagogicalExpectations: [
        'Strict adherence to standard British English spelling and syntax (e.g., colour, travelled, amongst).',
        'Explicit transformation formulas (e.g., "Begin with No sooner...", "Use: Unless...").',
        'Clear differentiation between proximity concord, collective noun number, and compound subjects with intervening parentheticals.',
      ],
      assessmentDirectives: [
        'Model questions after the canonical CISCE Section A / English Language Paper 1 format.',
        'Include sentence re-writing drills with mandatory starting phrases.',
        'Provide rigorous answer keys detailing why alternative options fail.',
      ],
      guidanceText: `CISCE / ICSE / ISC CURRICULUM MANDATE:
- Focus on formal grammar precision, sentence synthesis, and exact transformations.
- Maintain British English spelling and standard formal register.
- Frame questions matching the ICSE English Language examination pattern (transformations, cloze passages, verb forms).`,
    };
  }

  if (board.includes('CAMBRIDGE') || board.includes('CAIE') || board.includes('IGCSE') || board.includes('CHECKPOINT')) {
    return {
      board: 'Cambridge (CAIE / IGCSE / Checkpoint)',
      syllabusFocus: 'Inquiry-based learning, communicative competence, international English contexts, and functional usage in authentic genres.',
      curriculumTerminology: ['Language in Context', 'Textual Analysis', 'Authorial Craft', 'Audience and Purpose', 'Conventions of Genre'],
      pedagogicalExpectations: [
        'Promote inductive discovery: students notice patterns before formalising rules.',
        'Include international, multicultural contexts and global literature.',
        'Focus on how grammatical choices affect meaning, tone, and audience perception.',
      ],
      assessmentDirectives: [
        'Task-based and scenario-driven questions (e.g., writing a travel article, analyzing a blog post).',
        'Reflective self-evaluation and peer review prompts.',
      ],
      guidanceText: `CAMBRIDGE / IGCSE CURRICULUM MANDATE:
- Prioritise inquiry, context-based discovery, and functional grammar application.
- Use international, global contexts and diverse perspectives.
- Emphasise audience, tone, and communicative purpose.`,
    };
  }

  if (board.includes('IB') || board.includes('MYP') || board.includes('DP')) {
    return {
      board: 'International Baccalaureate (IB MYP/DP)',
      syllabusFocus: 'Conceptual understanding, inquiry questions, global contexts, and critical language exploration.',
      curriculumTerminology: ['Statement of Inquiry', 'Global Contexts', 'Key and Related Concepts', 'Form and Function'],
      pedagogicalExpectations: [
        'Frame learning around central inquiry questions.',
        'Explore language as a system for communication, expression, and cultural understanding.',
      ],
      assessmentDirectives: [
        'Criterion-referenced assessment rubrics and open-ended evaluative tasks.',
      ],
      guidanceText: `IB CURRICULUM MANDATE:
- Structure around statements of inquiry and conceptual exploration.
- Encourage critical reflection on how grammar shapes meaning and culture.`,
    };
  }

  // Default: CBSE / National Curriculum Framework (NCF)
  return {
    board: 'CBSE (NCERT / NCF Guidelines)',
    syllabusFocus: 'Competency-based learning, functional grammar in everyday contexts, and clear mastery of standard conventions.',
    curriculumTerminology: ['Integrated Grammar', 'Gap Filling', 'Editing & Omission', 'Sentence Reordering', 'Competency-Based Questions'],
    pedagogicalExpectations: [
      'Align strictly with latest NCERT and CBSE competency-based education guidelines.',
      'Blend conceptual explanations with integrated contextual drills (editing, gap-filling).',
      'Provide clear, memorable rules with step-by-step guidance.',
    ],
    assessmentDirectives: [
      'Include CBSE-style integrated grammar exercises: Cloze gap-filling, editing for errors, sentence re-ordering.',
      'Ensure clear question numbering and comprehensive answer explanations.',
    ],
    guidanceText: `CBSE / NCERT CURRICULUM MANDATE:
- Align with CBSE competency-based framework and integrated grammar formats.
- Connect concepts to authentic everyday Indian and global student life.
- Provide clear, accessible rule summaries and diagnostic exercises.`,
  };
}

/**
 * Strips raw markdown control characters from plain text, headings, and labels
 * to guarantee that control characters like ###, ####, ** never appear visibly in the finished textbook.
 */
export function cleanMarkdownSyntax(text: string): string {
  if (!text) return '';

  return text
    // Remove leading markdown heading hashes: "### 1. Title" -> "1. Title"
    .replace(/^#{1,6}\s+/gm, '')
    // Remove triple asterisks (bold italic): "***word***" -> "word"
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    // Remove bold asterisks: "**word**" -> "word"
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic asterisks: "*word*" -> "word"
    .replace(/\*(.*?)\*/g, '$1')
    // Remove bold/italic underscores: "__word__" -> "word"
    .replace(/__(.*?)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove backtick codes: "`code`" -> "code"
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquote markers: "> quote" -> "quote"
    .replace(/^>\s+/gm, '')
    // Remove any leftover stray double asterisks
    .replace(/\*\*/g, '')
    .trim();
}

/**
 * Sanitizes student-facing textbook typography:
 * - Converts raw programming arrows (->, =>, -->) into proper typographic arrows (→)
 * - Converts reverse arrows (<-, <=, <--) into proper typographic arrows (←)
 * - Converts raw programming shorthand into natural textbook prose
 * - Strips unformatted code fences, stray backticks, and programming notation
 */
export function sanitizeStudentTypography(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Natural prose conversion for programming-style shorthand
  res = res
    .replace(/\bcloser to the verb\s*(?:->|→|=>)\s*(?:use\s+)?(['"][a-zA-Z]+['"])/gi, 'Because it is nearer to the verb, we use $1')
    .replace(/\bcloser to the verb\s*(?:->|→|=>)\s*(?:use\s+)?([a-zA-Z]+)\b/gi, 'Because it is nearer to the verb, we use "$1"')
    .replace(/\bnearer to the verb\s*(?:->|→|=>)\s*(?:use\s+)?(['"][a-zA-Z]+['"])/gi, 'Because it is nearer to the verb, we use $1')
    .replace(/\bnearer to the verb\s*(?:->|→|=>)\s*(?:use\s+)?([a-zA-Z]+)\b/gi, 'Because it is nearer to the verb, we use "$1"')
    .replace(/\bOne bird\s*(?:->|→|=>)\s*sings\b/gi, 'One bird → sings (With one bird, we use "sings")')
    .replace(/\bMore than one bird\s*(?:->|→|=>)\s*sing\b/gi, 'More than one bird → sing (With more than one bird, we use "sing")')
    .replace(/\bTwo people\s*(?:->|→|=>)\s*(?:plural verb\s*)?(['"][a-zA-Z]+['"])/gi, 'Two people → use $1')
    .replace(/\bSingular subject\s*(?:->|→|=>)\s*Singular verb\b/gi, 'Singular subject → Singular verb')
    .replace(/\bPlural subject\s*(?:->|→|=>)\s*Plural verb\b/gi, 'Plural subject → Plural verb')
    .replace(/\bSubject:\s*['"]?([a-zA-Z]+)['"]?\s*(?:->|→|=>)\s*(?:singular|plural)?\s*verb\s*['"]?([a-zA-Z]+)['"]?/gi, 'The subject "$1" is singular, so we use the verb "$2"')
    .replace(/\b([a-zA-Z]+)\s*(?:->|=>)\s*Take singular verbs\b/gi, '$1 takes a singular verb')
    .replace(/\b([a-zA-Z]+)\s*(?:->|=>)\s*Take plural verbs\b/gi, '$1 takes a plural verb');

  // 2. Convert remaining raw arrows to proper typographic arrows
  res = res
    .replace(/\s*-->\s*/g, ' → ')
    .replace(/\s*==>\s*/g, ' → ')
    .replace(/\s*=>\s*/g, ' → ')
    .replace(/\s*->\s*/g, ' → ')
    .replace(/\s*<--\s*/g, ' ← ')
    .replace(/\s*<==\s*/g, ' ← ')
    .replace(/\s*<-\s*/g, ' ← ');

  // 3. Remove stray code-block notation and backticks
  res = res
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .replace(/`([^`]+)`/g, '$1');

  return res.trim();
}

/**
 * Strips editorial rationale blocks from student-facing content and returns both clean text and rationale.
 * Guarantees that "Rationale: ..." is kept strictly as metadata and NEVER part of student text.
 */
export function sanitizeContentStrippingRationale(rawContent: string): {
  cleanContent: string;
  extractedRationale?: string;
} {
  if (!rawContent) return { cleanContent: '' };

  let extractedRationale: string | undefined = undefined;
  
  // Match patterns like "Rationale: ...", "**Rationale:** ...", "Pedagogical Rationale: ..."
  const rationaleRegex = /(?:^|\n)(?:\*\*|\*|#{1,6}\s*)?(?:Pedagogical\s+)?Rationale\s*:\s*([^\n]+(?:\n(?!\n|#{1,6}|\d+\.)[^\n]+)*)/i;
  const match = rawContent.match(rationaleRegex);
  if (match) {
    extractedRationale = match[1].trim();
  }

  // Remove all occurrences of Rationale blocks from student content
  let cleanContent = rawContent
    .replace(/(?:^|\n)(?:\*\*|\*|#{1,6}\s*)?(?:Pedagogical\s+)?Rationale\s*:\s*[^\n]+(?:\n(?!\n|#{1,6}|\d+\.)[^\n]+)*/gi, '')
    .trim();

  // Apply student typography sanitization to remove raw ->, =>, etc.
  cleanContent = sanitizeStudentTypography(cleanContent);

  return { cleanContent, extractedRationale };
}

/**
 * Replaces internal pedagogical/editorial terminology with student-friendly phrasing for Classes 1–8.
 * Also removes internal curriculum/board generation language like "In Indian and British English curricula (CISCE)...".
 */
export function cleanLeakedEditorialTerms(text: string, classNum: number): string {
  if (!text) return '';

  let sanitized = text;

  // Rule 5: DO NOT EXPOSE INTERNAL CURRICULUM / GENERATION LANGUAGE TO STUDENTS
  // Remove self-referential statements mentioning curricula, boards, or internal generation labels
  sanitized = sanitized
    .replace(/In (?:Indian and British English|Indian, British, and International|Indian|British|CBSE|CISCE|ICSE|ISC|State Board|IB|Cambridge|NCERT)[^,.:\n]*(?:curricula|syllabi|frameworks?|classrooms?|examinations?|standards?)[^,.:\n]*,\s*/gi, '')
    .replace(/\(In (?:Indian and British English|Indian|British|CBSE|CISCE|ICSE|ISC|NCERT)[^)]*\)/gi, '')
    .replace(/\(in accordance with (?:CBSE|CISCE|ICSE|ISC|NCERT|Cambridge)[^)]*\)/gi, '')
    .replace(/\(as prescribed by (?:CBSE|CISCE|ICSE|ISC|NCERT|Cambridge)[^)]*\)/gi, '')
    .replace(/\bpreferred by (?:CBSE|CISCE|ICSE|ISC) examiners\b/gi, 'preferred in standard English')
    .replace(/\bCISCE Class 6 foundational chapter covering\b/gi, 'Foundational chapter covering')
    .replace(/\baligned with (?:CBSE|CISCE|ICSE|ISC) expectations\b/gi, 'aligned with curriculum expectations');

  if (classNum > 8) {
    return sanitizeStudentTypography(sanitized);
  }

  // Rule 4: REMOVE UNNECESSARY HIGH-LEVEL LINGUISTIC JARGON for Classes 1–8
  sanitized = sanitized
    // Main subject terminology
    .replace(/\bthe head word\b/gi, 'the main subject')
    .replace(/\bthe head noun\b/gi, 'the main subject')
    .replace(/\bhead word\b/gi, 'main subject')
    .replace(/\bhead noun\b/gi, 'main subject')
    .replace(/\bhead words\b/gi, 'main subjects')
    .replace(/\bhead nouns\b/gi, 'main subjects')
    .replace(/\btrue structural head noun\b/gi, 'true main subject')
    .replace(/\bgoverning head noun\b/gi, 'governing main subject')
    // Syntactic jargon
    .replace(/\bConcord & Syntactic Synthesis\b/gi, 'Making Subjects and Verbs Agree')
    .replace(/\bconcord & syntactic synthesis\b/gi, 'making subjects and verbs agree')
    .replace(/\bSyntactic Synthesis\b/gi, 'Sentence Building')
    .replace(/\bsyntactic synthesis\b/gi, 'sentence building')
    .replace(/\bSyntactic Concord\b/gi, 'Subject–Verb Agreement')
    .replace(/\bsyntactic concord\b/gi, 'subject–verb agreement')
    .replace(/\bSyntactic Structure\b/gi, 'Sentence Structure')
    .replace(/\bsyntactic structure\b/gi, 'sentence structure')
    .replace(/\bPerson–Number Harmony\b/gi, 'Matching Number and Person')
    .replace(/\bperson–number harmony\b/gi, 'matching number and person')
    .replace(/\bPerson-Number Harmony\b/gi, 'Matching Number and Person')
    .replace(/\bperson-number harmony\b/gi, 'matching number and person')
    .replace(/\bIntervening Modifiers?\b/gi, 'Words Between Subject and Verb')
    .replace(/\bintervening modifiers?\b/gi, 'words between subject and verb')
    .replace(/\bintervening prepositional modifiers?\b/gi, 'words that come between subject and verb')
    .replace(/\bintervening prepositional phrases?\b/gi, 'words that come between subject and verb')
    .replace(/\bintervening phrase\b/gi, 'words that come in between')
    .replace(/\bintervening phrases\b/gi, 'words that come in between')
    .replace(/\bProximity Principle\b/gi, 'Choosing the Nearer Subject')
    .replace(/\bproximity principle\b/gi, 'choosing the nearer subject')
    .replace(/\bProximity Concord\b/gi, 'Choosing the Nearer Subject')
    .replace(/\bproximity concord\b/gi, 'choosing the nearer subject')
    .replace(/\bAttraction to Proximity\b/gi, 'Matching the Nearer Noun')
    .replace(/\battraction to proximity\b/gi, 'matching the nearer noun')
    .replace(/\bproximity with correlatives\b/gi, 'choosing the nearer subject with either or neither')
    // Pedagogy jargon
    .replace(/\binductive discovery\b/gi, 'guided discovery')
    .replace(/\bcontrastive analysis\b/gi, 'sentence comparison')
    .replace(/\bsyntactic architecture\b/gi, 'sentence structure')
    .replace(/\bhigh-frequency rules?\b/gi, 'key rules')
    .replace(/\bdisjunctive coordination\b/gi, 'sentences with either or neither')
    .replace(/\bgrammatical constituents?\b/gi, 'parts of a sentence')
    .replace(/\bsubcategorization frames?\b/gi, 'sentence patterns')
    .replace(/\bnominal agreement\b/gi, 'word agreement');

  return sanitizeStudentTypography(sanitized);
}

/**
 * Specifically cleans chapter and section titles so they are pristine textbook headings.
 */
export function cleanHeadingTitle(title: string): string {
  if (!title) return '';
  return cleanMarkdownSyntax(title)
    .replace(/^section\s+\d+[:\s-]*/i, '')
    .replace(/^chapter\s+\d+[:\s-]*/i, '')
    .replace(/^#+\s*/, '')
    // Typography sanitization
    .replace(/\s*->\s*/g, ' → ')
    .replace(/\s*=>\s*/g, ' → ')
    .trim();
}

/**
 * Dynamically calibrates manuscript metadata (titles, subtitles, headings, callouts, notes)
 * according to the target class level so younger grades (Classes 1–8) never display university-level jargon.
 */
export function calibrateManuscriptMetadataForClass(
  text: string,
  classLevelOrNum: number | string
): string {
  if (!text) return '';
  const classNum = typeof classLevelOrNum === 'number' ? classLevelOrNum : parseClassLevelNumber(classLevelOrNum);
  const cleaned = cleanHeadingTitle(text);
  return cleanLeakedEditorialTerms(cleaned, classNum);
}

/**
 * Assembles the full, authoritative System Prompt for any Academic AI generation task.
 * Guarantees strict adherence to Class Level (1–12), Board/Curriculum, Author Directives,
 * Simple-to-Complex Pedagogical Sequencing, and Student Purity (no editorial jargon).
 */
export function buildAcademicAiPromptContext(params: {
  classLevel: string;
  board: string;
  subject: string;
  chapterTitle: string;
  sectionTitle?: string;
  featureName?: string;
  customInstructions?: string;
}): string {
  const classNum = parseClassLevelNumber(params.classLevel);
  const classProfile = getPedagogicalClassProfile(params.classLevel);
  const boardProfile = getCurriculumBoardProfile(params.board);

  return `You are a Master Textbook Author and Chief Curriculum Architect for VERITAS Academic Publishing.
You are authoring official, publication-ready educational content for school textbooks.

================================================================================
CRITICAL CONTEXT: SEPARATE CLASS AND BOARD CONTROLS
================================================================================
1. TARGET CLASS / READING LEVEL: ${classProfile.label} (${classProfile.targetAge})
   - Average sentence length: ${classProfile.averageSentenceWords}
   - Tone: ${classProfile.toneAndVoice}
   - Vocabulary rules: ${classProfile.vocabularyGuidelines.join(' ')}
   - Explanation style: ${classProfile.explanationStyle}
   - Example contexts: ${classProfile.exampleDomains.join('; ')}
   - Heading style: ${classProfile.headingDirectives}

2. TARGET CURRICULUM BOARD: ${boardProfile.board}
   - Focus: ${boardProfile.syllabusFocus}
   - Terminology: ${boardProfile.curriculumTerminology.join(', ')}
   - Requirements: ${boardProfile.pedagogicalExpectations.join(' ')}

3. ACTIVE SUBJECT & CHAPTER:
   - Subject: ${params.subject || 'English Grammar & Composition'}
   - Chapter: "${params.chapterTitle}"
   ${params.sectionTitle ? `- Section: "${params.sectionTitle}"` : ''}
   ${params.featureName ? `- Operation: ${params.featureName}` : ''}

================================================================================
MANDATORY AUTHOR INSTRUCTIONS (SUPREME HIGH PRIORITY)
================================================================================
${params.customInstructions?.trim() ? `THE AUTHOR HAS PROVIDED EXPLICIT INSTRUCTIONS:
"${params.customInstructions.trim()}"

STRICT DIRECTIVES REGARDING AUTHOR INSTRUCTIONS:
- Explicit instructions entered in "Optional Author Instructions" MUST materially determine the proposed chapter structure and drafted prose!
- Treat explicit author instructions as having HIGHER PRIORITY than the default chapter outline template, provided they do not conflict with the selected curriculum or class level.
- PREREQUISITE DEFINITIONS: If the author requests introducing, defining, or reviewing prerequisite concepts (for example: "Include a simple definition of a subject and a verb before introducing subject–verb agreement"), you MUST actually introduce, dedicate section space to, and explain those concepts (e.g. "What is a Subject?", "What is a Verb?") in clear, accessible language BEFORE introducing the main rules!
- The author's directives must be clearly visible and fulfilled in the section titles and section content.` : 'No custom author instructions entered. Proceed with optimal age-appropriate pedagogical structure.'}

================================================================================
PEDAGOGICAL SEQUENCING: TEACH FROM SIMPLE TO COMPLEX
================================================================================
- Enforce strict pedagogical sequencing appropriate to ${classProfile.label}:
- ALWAYS introduce the simplest, foundational form of the concept before introducing exceptions, traps, or difficult constructions.
- For grammar chapters, begin with the most basic, familiar forms and high-frequency sentences:
  • e.g. for Subject-Verb Agreement: Begin with simple singular vs plural subjects ("The boy plays." / "The boys play.") before introducing:
    - intervening prepositional phrases ("The box of chocolates is on the table.")
    - parenthetical additions ("along with", "together with", "as well as")
    - disjunctive correlatives ("either... or", "neither... nor")
    - collective nouns ("team", "committee", "crowd")
    - proximity rules
    - exceptional cases
- Do NOT begin an opener or early section with advanced exceptions before the foundational rule has been established and understood.

================================================================================
STUDENT-FACING LANGUAGE PURITY & JARGON RULES
================================================================================
- Direct, age-calibrated textbook prose must be presented to students.
- NEVER expose internal curriculum or board references in student-facing prose, such as:
  "In Indian and British English curricula (CISCE (ICSE / ISC)), collective nouns..."
  Instead, teach the grammar rule directly and naturally:
  "Collective nouns such as 'team', 'committee', and 'choir' take a singular verb when the group acts together as one single unit."
- For Classes 1–5: Use very simple grammatical explanations.
- For Classes 6–8: Standard school grammar terminology is allowed (subject, verb, singular, plural, phrase, tense, agreement, pronoun, adjective), but avoid unnecessary linguistic terminology:
  • Avoid: "the head word" / "the head noun" — Prefer: "the main subject"
  • Avoid: "syntactic synthesis" — Prefer: "sentence building" or "making subjects and verbs agree"
  • Avoid: "intervening modifier" — Prefer: "words that come between subject and verb"
  • Avoid: "proximity principle" — Prefer: "choosing the nearer subject"
  • Avoid: "inductive discovery", "contrastive analysis", "syntactic architecture".
- Board rigor must NEVER automatically increase reading difficulty or vocabulary intimidation!

===============================================================================
TYPOGRAPHY & NO PROGRAMMING / ASCII NOTATION
===============================================================================
- Student-facing textbook content must NEVER display raw symbols such as:
  ->, <-, =>, backticks, or programming-style notation.
- Convert "->" to a proper typographic arrow "→" only where an arrow is pedagogically appropriate (e.g. boy → boys).
- Prefer natural prose when possible:
  BAD: "One bird -> sings"
  BETTER: "One bird → sings" or "With one bird, we use 'sings'."
  BAD: "closer to the verb -> use 'were'"
  BETTER: "Because 'students' is nearer to the verb, we use 'were'."

================================================================================
EDITORIAL RATIONALE METADATA INTEGRITY
================================================================================
- The "rationale" property is purely for the author's reference in the drafting tool.
- Rationale text must be stored as editorial metadata and must NEVER appear inside the student-facing "content", headings, or exercises.

================================================================================
FORMATTING: ZERO VISIBLE RAW MARKDOWN CONTROL CHARACTERS
================================================================================
- Users and students must NEVER see raw control syntax such as:
  **, *, ###, ####, unformatted backticks, or Markdown list artefacts in titles or text.
- Deliver beautifully styled, clean textbook reading material with structured paragraphs, examples, and lists.

${classProfile.systemInstructionText}

${boardProfile.guidanceText}`;
}
