import {
  GrammarClassLevel,
  VeritasSeriesLevel,
  DevelopmentalBandId,
  DevelopmentalBand,
  AssessmentArchitectureType,
  AssessmentIntegrityStatus,
  CurriculumSystemId,
  BookProjectStatus,
  ProgressionStage,
} from '../types';

// ============================================================================
// 1. UNIVERSAL VERITAS 12-LEVEL SERIES FOUNDATION
// ============================================================================

export const VERITAS_SERIES_LEVELS: VeritasSeriesLevel[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

export const ALL_CLASS_LEVELS: GrammarClassLevel[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

// Helper: map Class X to Veritas Level
export function classToVeritasLevel(cls: GrammarClassLevel | string): VeritasSeriesLevel {
  const match = cls.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 12) return num as VeritasSeriesLevel;
  }
  return 6;
}

// Helper: map Veritas Level to Class X
export function veritasLevelToClass(lvl: VeritasSeriesLevel): GrammarClassLevel {
  return `Class ${lvl}` as GrammarClassLevel;
}

// ============================================================================
// 2. DEVELOPMENTAL BANDS (Configurable VERITAS Editorial Bands)
// ============================================================================

export const DEVELOPMENTAL_BANDS: Record<DevelopmentalBandId, DevelopmentalBand> = {
  foundation: {
    id: 'foundation',
    name: 'FOUNDATION',
    seriesLevels: [1, 2],
    classLevels: ['Class 1', 'Class 2'],
    nominalAgeRange: 'Ages 5–7 (Early Childhood & Foundational)',
    description:
      'Oral-to-written language transition, basic sentence awareness, naming words, action words, describing words, introductory pronouns, capitalization, and foundational punctuation.',
    pedagogicalFocus: [
      'Oral-to-written language transition',
      'Basic sentence awareness (a sentence makes complete sense)',
      'Naming words / nouns (people, places, animals, things)',
      'Action words / doing words / verbs',
      'Describing words / adjectives (color, size, feelings)',
      'Introductory pronouns (I, you, he, she, it, we, they)',
      'Basic punctuation (full stop, question mark)',
      'Capitalization (sentence start, uppercase "I", personal names)',
      'Simple sight words & picture vocabulary',
      'Sentence completion with visual prompts',
      'Matching words to illustrations',
      'Sorting and classifying language games',
    ],
    assessmentFocus: [
      'Picture-supported identification',
      'Matching word cards to images',
      'Choose / circle the correct word',
      'Simple gap-fill completion with word bank',
      'Oral-response teacher tasks where appropriate',
      'Sorting naming vs action words',
      'Sentence unjumbling (3–5 words)',
      'Capital letter and period placement',
      'Short guided sentence completion',
    ],
    vocabularyRestrictions: [
      'Avoid technical Latinate grammatical jargon (no "transitive/intransitive", "participle", "gerund", "subjunctive", "modal auxiliary")',
      'Prefer student-friendly terms: "Naming Word" (Noun), "Doing Word" (Verb), "Describing Word" (Adjective)',
    ],
  },
  primary: {
    id: 'primary',
    name: 'PRIMARY DEVELOPMENT',
    seriesLevels: [3, 4, 5],
    classLevels: ['Class 3', 'Class 4', 'Class 5'],
    nominalAgeRange: 'Ages 7–10 (Primary)',
    description:
      'Progressive introduction of formal grammatical taxonomy, parts of speech, agreement, tense foundations, contextual grammar, basic editing, and guided composition.',
    pedagogicalFocus: [
      'Formal grammar concepts & parts of speech introduced progressively',
      'Subject and predicate segmentation',
      'Singular, plural, and collective nouns',
      'Subject-verb agreement (basic number concord)',
      'Tense foundations (simple present, past, future; continuous aspects)',
      'Adverbials of time, place, and manner',
      'Prepositions of position and movement',
      'Coordinating conjunctions (and, but, or, because)',
      'Punctuation expansion (commas in series, apostrophe for possession and contraction)',
      'Guided composition (paragraphs, personal letters, picture stories)',
      'Basic error detection & sentence correction',
    ],
    assessmentFocus: [
      'Identification of parts of speech in context',
      'Fill in the blanks with correct verb tense or preposition',
      'Matching sentence halves',
      'Contextual paragraph completion',
      'Sentence correction & basic error detection',
      'Basic sentence transformation (affirmative to negative/interrogative)',
      'Vocabulary in context',
      'Guided paragraph writing with prompt outlines',
    ],
  },
  middle: {
    id: 'middle',
    name: 'MIDDLE SCHOOL DEVELOPMENT',
    seriesLevels: [6, 7, 8],
    classLevels: ['Class 6', 'Class 7', 'Class 8'],
    nominalAgeRange: 'Ages 11–14 (Middle School)',
    description:
      'Grammatical analysis, syntax, contextual application, editing, transformation, integrated grammar, composition, and language reasoning.',
    pedagogicalFocus: [
      'Rigorous grammatical analysis and clause architecture',
      'Complete subject-verb concord rules (conjunctions, quantifiers, indefinite pronouns)',
      'Tense aspects (perfect and perfect continuous distinctions)',
      'Active and passive voice transformations',
      'Direct and indirect speech (statements, questions, imperatives)',
      'Modal auxiliaries and nuanced hedging',
      'Non-finite verbs (infinitives, gerunds, participles)',
      'Phrasal verbs and prepositional collocations',
      'Subordinate clauses (noun, relative, adverbial clauses)',
      'Integrated grammar editing and passage proofreading',
      'Formal letter, notice, diary entry, and discursive composition',
    ],
    assessmentFocus: [
      'Contextual grammar cloze passages',
      'Sentence transformation with constrained prompts',
      'Editing passages (omission & error correction)',
      'Reported speech dialogue conversions',
      'Synthesis of simple sentences into compound/complex',
      'Independent discursive and creative writing',
    ],
  },
  secondary: {
    id: 'secondary',
    name: 'SECONDARY DEVELOPMENT',
    seriesLevels: [9, 10],
    classLevels: ['Class 9', 'Class 10'],
    nominalAgeRange: 'Ages 14–16 (Secondary / Board Prep)',
    description:
      'Advanced grammar application, examination-oriented language skills, transformation, editing, synthesis, composition, functional language, and verified board requirements.',
    pedagogicalFocus: [
      'Advanced grammar application and functional language accuracy',
      'CBSE Section B Grammar (Tenses, Modals, Concord, Reported Speech, Determiners)',
      'ICSE English Language Paper 1 (Question 5 Transformation, Prepositions, Passage Tenses)',
      'Cambridge IGCSE First Language English (Summary synthesis, stylistic analysis)',
      'Complete sentence synthesis and clause subordination',
      'Degrees of comparison and negative-affirmative transformation without meaning change',
      'Conditionals (Types 0, 1, 2, 3 and mixed conditionals)',
      'Idiomatic precision and register consistency',
      'Analytical, persuasive, and evaluative composition',
    ],
    assessmentFocus: [
      'Board examination style question slots and blueprints',
      'Constrained transformation ("Begin with...", "Use: ...", "Without using...")',
      'Rigorous passage error editing under time limits',
      'Integrated dialogue reporting from complex speech bubbles',
      'Extended composition evaluated on syntax, register, and cohesion',
    ],
  },
  senior_secondary: {
    id: 'senior_secondary',
    name: 'SENIOR SECONDARY / ADVANCED',
    seriesLevels: [11, 12],
    classLevels: ['Class 11', 'Class 12'],
    nominalAgeRange: 'Ages 16–18 (Senior Secondary / Pre-University)',
    description:
      'Advanced language control, sophisticated syntax, register and style, rhetoric, advanced composition, editing and refinement, and academic/formal communication.',
    pedagogicalFocus: [
      'Advanced syntactic control and structural variation',
      'Inversion structures (negative adverbials, conditionals: "Had I known...")',
      'Subjunctive mood and counterfactual constructions',
      'Elimination of dangling modifiers, faulty parallelism, and ambiguous references',
      'Nominalization and lexical density in academic prose',
      'Rhetorical devices and foregrounding syntax',
      'Register calibration across academic, legal, journalistic, and literary genres',
      'ISC Paper 1 transformation, synthesis, and precise idiomatic phrasal verbs',
      'Cambridge International AS & A Level linguistic analysis & discursive essays',
    ],
    assessmentFocus: [
      'High-rigour syntactic transformations and inversion drills',
      'Complex sentence synthesis preserving precise nuance',
      'Passage editing for register harmony and stylistic precision',
      'Rhetorical analysis and academic commentary',
      'Pre-university qualification assessment specifications',
    ],
  },
};

export function getDevelopmentalBand(
  levelOrClass: VeritasSeriesLevel | GrammarClassLevel | number
): DevelopmentalBand {
  const levelNum =
    typeof levelOrClass === 'number'
      ? levelOrClass
      : typeof levelOrClass === 'string'
      ? classToVeritasLevel(levelOrClass)
      : 6;

  if (levelNum <= 2) return DEVELOPMENTAL_BANDS.foundation;
  if (levelNum <= 5) return DEVELOPMENTAL_BANDS.primary;
  if (levelNum <= 8) return DEVELOPMENTAL_BANDS.middle;
  if (levelNum <= 10) return DEVELOPMENTAL_BANDS.secondary;
  return DEVELOPMENTAL_BANDS.senior_secondary;
}

export const getDevelopmentalBandForLevel = getDevelopmentalBand;

// ============================================================================
// 3. CAMBRIDGE AUTHENTIC STAGE EDITORIAL MAPPINGS
// ============================================================================

export interface CambridgeProgrammeMapping {
  veritasLevel: VeritasSeriesLevel;
  programme: string;
  stageName: string;
  nominalAge: string;
  isEditorialMapping: true;
  editorialDisclaimer: string;
  qualificationFamily: string;
}

export const CAMBRIDGE_STAGE_MAPPINGS: Record<VeritasSeriesLevel, CambridgeProgrammeMapping> = {
  1: {
    veritasLevel: 1,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 1',
    nominalAge: 'Ages 5–6',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 1 (not Class 1).',
    qualificationFamily: 'Cambridge Primary',
  },
  2: {
    veritasLevel: 2,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 2',
    nominalAge: 'Ages 6–7',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 2.',
    qualificationFamily: 'Cambridge Primary',
  },
  3: {
    veritasLevel: 3,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 3',
    nominalAge: 'Ages 7–8',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 3.',
    qualificationFamily: 'Cambridge Primary',
  },
  4: {
    veritasLevel: 4,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 4',
    nominalAge: 'Ages 8–9',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 4.',
    qualificationFamily: 'Cambridge Primary',
  },
  5: {
    veritasLevel: 5,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 5',
    nominalAge: 'Ages 9–10',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 5.',
    qualificationFamily: 'Cambridge Primary',
  },
  6: {
    veritasLevel: 6,
    programme: 'Cambridge Primary English (0058)',
    stageName: 'Stage 6 (Primary Checkpoint)',
    nominalAge: 'Ages 10–11',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 6.',
    qualificationFamily: 'Cambridge Primary Checkpoint',
  },
  7: {
    veritasLevel: 7,
    programme: 'Cambridge Lower Secondary English (0861)',
    stageName: 'Stage 7',
    nominalAge: 'Ages 11–12',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 7 (not Class 7).',
    qualificationFamily: 'Cambridge Lower Secondary',
  },
  8: {
    veritasLevel: 8,
    programme: 'Cambridge Lower Secondary English (0861)',
    stageName: 'Stage 8',
    nominalAge: 'Ages 12–13',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 8.',
    qualificationFamily: 'Cambridge Lower Secondary',
  },
  9: {
    veritasLevel: 9,
    programme: 'Cambridge Lower Secondary English (0861)',
    stageName: 'Stage 9 (Lower Secondary Checkpoint)',
    nominalAge: 'Ages 13–14',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE framework designates Stage 9 Checkpoint.',
    qualificationFamily: 'Cambridge Lower Secondary Checkpoint',
  },
  10: {
    veritasLevel: 10,
    programme: 'Cambridge Upper Secondary / IGCSE (0500 / 0510)',
    stageName: 'IGCSE First Language English (0500)',
    nominalAge: 'Ages 14–16',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE qualification is Cambridge IGCSE.',
    qualificationFamily: 'Cambridge IGCSE',
  },
  11: {
    veritasLevel: 11,
    programme: 'Cambridge International AS & A Level English Language (9093)',
    stageName: 'Cambridge International AS Level',
    nominalAge: 'Ages 16–17',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE qualification is Cambridge International AS Level.',
    qualificationFamily: 'Cambridge International AS & A Level',
  },
  12: {
    veritasLevel: 12,
    programme: 'Cambridge International AS & A Level English Language (9093)',
    stageName: 'Cambridge International A Level',
    nominalAge: 'Ages 17–19',
    isEditorialMapping: true,
    editorialDisclaimer: 'Internal VERITAS editorial learning band mapping. Authentic CAIE qualification is Cambridge International A Level.',
    qualificationFamily: 'Cambridge International AS & A Level',
  },
};

// ============================================================================
// 4. CISCE PROGRAMME DISTINCTION ARCHITECTURE
// ============================================================================

export interface CISCEProgrammeDetails {
  veritasLevel: VeritasSeriesLevel;
  officialClass: GrammarClassLevel;
  programmeType: 'school_aligned' | 'icse_qualification' | 'isc_qualification';
  programmeName: string;
  programmeShort: string;
  integrityStatus: AssessmentIntegrityStatus;
  statusNote: string;
}

export const CISCE_PROGRAMME_DETAILS: Record<VeritasSeriesLevel, CISCEProgrammeDetails> = {
  1: {
    veritasLevel: 1,
    officialClass: 'Class 1',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Pre-Primary / Primary Aligned English',
    programmeShort: 'CISCE Primary',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 1.',
  },
  2: {
    veritasLevel: 2,
    officialClass: 'Class 2',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Primary Aligned English',
    programmeShort: 'CISCE Primary',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 2.',
  },
  3: {
    veritasLevel: 3,
    officialClass: 'Class 3',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Primary Aligned English',
    programmeShort: 'CISCE Primary',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 3.',
  },
  4: {
    veritasLevel: 4,
    officialClass: 'Class 4',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Primary Aligned English',
    programmeShort: 'CISCE Primary',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 4.',
  },
  5: {
    veritasLevel: 5,
    officialClass: 'Class 5',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Upper Primary Aligned English',
    programmeShort: 'CISCE Upper Primary',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 5.',
  },
  6: {
    veritasLevel: 6,
    officialClass: 'Class 6',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Middle School Curriculum Aligned English',
    programmeShort: 'CISCE Middle School',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 6.',
  },
  7: {
    veritasLevel: 7,
    officialClass: 'Class 7',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Middle School Curriculum Aligned English',
    programmeShort: 'CISCE Middle School',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 7.',
  },
  8: {
    veritasLevel: 8,
    officialClass: 'Class 8',
    programmeType: 'school_aligned',
    programmeName: 'CISCE Middle School Curriculum Aligned English',
    programmeShort: 'CISCE Middle School',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'School-level CISCE-aligned curriculum model. No statutory board examination blueprint exists for Class 8.',
  },
  9: {
    veritasLevel: 9,
    officialClass: 'Class 9',
    programmeType: 'icse_qualification',
    programmeName: 'ICSE (Indian Certificate of Secondary Education) Preparatory',
    programmeShort: 'ICSE Class 9',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'ICSE examination preparatory syllabus model aligned with ICSE regulations.',
  },
  10: {
    veritasLevel: 10,
    officialClass: 'Class 10',
    programmeType: 'icse_qualification',
    programmeName: 'ICSE (Indian Certificate of Secondary Education) Examination',
    programmeShort: 'ICSE Class 10',
    integrityStatus: 'VERIFIED BOARD SPECIFICATION',
    statusNote: 'Official statutory ICSE English Language Paper 1 Question 5 blueprint verified.',
  },
  11: {
    veritasLevel: 11,
    officialClass: 'Class 11',
    programmeType: 'isc_qualification',
    programmeName: 'ISC (Indian School Certificate) Senior Secondary Preparatory',
    programmeShort: 'ISC Class 11',
    integrityStatus: 'CURRICULUM-ALIGNED EDITORIAL MODEL',
    statusNote: 'ISC Senior Secondary preparatory syllabus model aligned with ISC regulations.',
  },
  12: {
    veritasLevel: 12,
    officialClass: 'Class 12',
    programmeType: 'isc_qualification',
    programmeName: 'ISC (Indian School Certificate) Examination',
    programmeShort: 'ISC Class 12',
    integrityStatus: 'VERIFIED BOARD SPECIFICATION',
    statusNote: 'Official statutory ISC English Language Paper 1 blueprint verified.',
  },
};

// ============================================================================
// 5. PLANNED PORTFOLIO ROADMAP GENERATOR (All 36 books across 12 levels)
// ============================================================================

export interface PlannedBookPortfolioItem {
  id: string;
  veritasLevel: VeritasSeriesLevel;
  system: CurriculumSystemId;
  officialLabel: string;
  programmeName: string;
  bookTitle: string;
  subtitle: string;
  developmentalBand: DevelopmentalBand;
  status: BookProjectStatus;
  integrityStatus: AssessmentIntegrityStatus;
  isEditorialMapping?: boolean;
  editorialDisclaimer?: string;
  isActiveProductionBook?: boolean;
  isDemoProject?: boolean;
}

export function getFullPortfolioRoadmap(
  activeBookId: string = 'proj-cbse-c6'
): PlannedBookPortfolioItem[] {
  const portfolio: PlannedBookPortfolioItem[] = [];

  // Loop through all 12 levels
  VERITAS_SERIES_LEVELS.forEach((lvl) => {
    const band = getDevelopmentalBand(lvl);
    const cls = veritasLevelToClass(lvl);

    // 1. CBSE Item
    const cbseId = `proj-cbse-c${lvl}`;
    const isCbseActive = cbseId === activeBookId;
    let cbseStatus: BookProjectStatus = 'Not Planned';
    if (lvl === 6) cbseStatus = 'Authoring';
    else if (lvl === 10) cbseStatus = 'Planning';
    else if (lvl <= 5) cbseStatus = 'Planning';
    else cbseStatus = 'Planning';

    portfolio.push({
      id: cbseId,
      veritasLevel: lvl,
      system: 'CBSE',
      officialLabel: cls,
      programmeName:
        lvl <= 2
          ? 'CBSE Foundational Stage (NEP 2020)'
          : lvl <= 5
          ? 'CBSE Preparatory Stage'
          : lvl <= 8
          ? 'CBSE Middle School'
          : lvl <= 10
          ? 'CBSE Secondary (Code 184)'
          : 'CBSE Senior Secondary (Code 301)',
      bookTitle:
        lvl === 6
          ? 'Middle School Grammar & Syntax — Class 6'
          : lvl === 10
          ? 'Board Master: CBSE Class 10'
          : lvl <= 2
          ? `Foundational English Grammar & Words — ${cls}`
          : lvl <= 5
          ? `Step-by-Step English Grammar — ${cls}`
          : `Applied English Grammar & Syntax — ${cls}`,
      subtitle:
        lvl === 6
          ? 'Subject-Verb Concord, Tenses & Applied Sentence Architecture'
          : lvl <= 2
          ? 'Oral-to-Written Naming Words, Action Words & Picture Activities'
          : lvl <= 5
          ? 'Parts of Speech, Agreement & Guided Sentence Construction'
          : 'Integrated Grammar, Synthesis & Analytical Writing',
      developmentalBand: band,
      status: cbseStatus,
      integrityStatus:
        lvl === 10 || lvl === 12
          ? 'VERIFIED BOARD SPECIFICATION'
          : lvl === 6
          ? 'CURRICULUM-ALIGNED EDITORIAL MODEL'
          : 'EDITORIAL MODEL',
      isActiveProductionBook: isCbseActive,
      isDemoProject: !isCbseActive && (lvl === 6 || lvl === 10),
    });

    // 2. CISCE Item
    const cisceDetails = CISCE_PROGRAMME_DETAILS[lvl];
    const cisceId = `proj-cisce-c${lvl}`;
    let cisceStatus: BookProjectStatus = 'Not Planned';
    if (lvl === 6 || lvl === 10) cisceStatus = 'Planning';
    else cisceStatus = 'Planning';

    portfolio.push({
      id: cisceId,
      veritasLevel: lvl,
      system: 'CISCE',
      officialLabel: cisceDetails.officialClass,
      programmeName: cisceDetails.programmeName,
      bookTitle:
        lvl === 6
          ? 'Classical Grammar: ICSE Class 6'
          : lvl === 10
          ? 'ICSE Examination Language Paper 1 Master: Class 10'
          : lvl <= 2
          ? `CISCE Foundational English Language — ${cls}`
          : lvl <= 8
          ? `CISCE Progressive Grammar & Composition — ${cls}`
          : `ISC Senior English Language — ${cls}`,
      subtitle:
        lvl === 6
          ? 'Subject-Verb Agreement, Active-Passive Voice & Prepositions'
          : lvl === 10
          ? 'Question 5 Transformation, Prepositions & Synthesis'
          : cisceDetails.statusNote,
      developmentalBand: band,
      status: cisceStatus,
      integrityStatus: cisceDetails.integrityStatus,
      isActiveProductionBook: false,
      isDemoProject: lvl === 6 || lvl === 10,
    });

    // 3. Cambridge Item
    const cambMapping = CAMBRIDGE_STAGE_MAPPINGS[lvl];
    const cambId = `proj-camb-lvl${lvl}`;
    let cambStatus: BookProjectStatus = 'Not Planned';
    if (lvl === 6 || lvl === 7 || lvl === 9 || lvl === 10) cambStatus = 'Planning';
    else cambStatus = 'Planning';

    portfolio.push({
      id: cambId,
      veritasLevel: lvl,
      system: 'Cambridge',
      officialLabel: cambMapping.stageName,
      programmeName: cambMapping.programme,
      bookTitle:
        lvl === 7
          ? 'Cambridge Lower Secondary English — Stage 7'
          : lvl === 10
          ? 'Cambridge IGCSE First Language English (0500)'
          : `Cambridge English Language Coursebook — ${cambMapping.stageName}`,
      subtitle:
        lvl === 7
          ? 'Functional Syntax, Writer Effect & Multi-Clause Architecture'
          : lvl === 10
          ? 'Linguistic Analysis, Stylistic Register & Summary Synthesis'
          : `Enquiry-Led Learning Framework Aligned with ${cambMapping.qualificationFamily}`,
      developmentalBand: band,
      status: cambStatus,
      integrityStatus:
        lvl === 9 || lvl === 10
          ? 'VERIFIED BOARD SPECIFICATION'
          : 'CURRICULUM-ALIGNED EDITORIAL MODEL',
      isEditorialMapping: true,
      editorialDisclaimer: cambMapping.editorialDisclaimer,
      isActiveProductionBook: false,
      isDemoProject: lvl === 7 || lvl === 10,
    });
  });

  return portfolio;
}

// ============================================================================
// 6. SCOPE & SEQUENCE VERTICAL PROGRESSION AUDIT ENGINE
// ============================================================================

export interface ProgressionAuditFinding {
  id: string;
  topicId: string;
  topicTitle: string;
  system: CurriculumSystemId | string;
  findingType:
    | 'introduced_too_early'
    | 'introduced_too_late'
    | 'unexplained_prerequisite'
    | 'progression_gap'
    | 'excessive_repetition'
    | 'insufficient_reinforcement'
    | 'abrupt_difficulty_jump'
    | 'duplicated_chapter_treatment'
    | 'missing_advanced_development';
  severity: 'high' | 'medium' | 'low' | 'advisory';
  title: string;
  description: string;
  recommendation: string;
  affectedLevels: GrammarClassLevel[];
}

export function runFullProgressionAudit(
  topics: Array<{
    id: string;
    strand: string;
    title: string;
    progression: Record<GrammarClassLevel, { stage: ProgressionStage; subtopicsOrNotes?: string }>;
  }>,
  targetSystem: CurriculumSystemId | string = 'CBSE'
): ProgressionAuditFinding[] {
  const findings: ProgressionAuditFinding[] = [];

  topics.forEach((topic) => {
    const prog = topic.progression;
    if (!prog) return;

    // Check 1: Concepts introduced too early in Foundation (Class 1–2)
    const foundationClasses: GrammarClassLevel[] = ['Class 1', 'Class 2'];
    const advancedConceptKeywords = [
      'transformation',
      'passive voice',
      'inversion',
      'subjunctive',
      'non-finite',
      'gerund',
      'synthesis',
      'indirect speech',
      'reported speech',
      'clause',
    ];
    const isAdvancedTitle = advancedConceptKeywords.some((k) =>
      topic.title.toLowerCase().includes(k)
    );

    foundationClasses.forEach((cls) => {
      const cell = prog[cls];
      if (cell && (cell.stage === 'I' || cell.stage === 'D' || cell.stage === 'R' || cell.stage === 'M')) {
        if (isAdvancedTitle) {
          findings.push({
            id: `audit-too-early-${topic.id}-${cls}`,
            topicId: topic.id,
            topicTitle: topic.title,
            system: targetSystem,
            findingType: 'introduced_too_early',
            severity: 'high',
            title: `Concept Introduced Too Early (${cls})`,
            description: `"${topic.title}" involves advanced syntactic analysis unsuitable for ${cls} foundational language learners (Ages 5–7).`,
            recommendation: `Defer formal treatment to Middle School (Class 6+) and replace with concrete oral/picture language play at ${cls}.`,
            affectedLevels: [cls],
          });
        }
      }
    });

    // Check 2: Core foundational concept introduced too late (e.g. Nouns/Verbs not introduced until Class 5+)
    const foundationalKeywords = ['noun', 'verb', 'capital', 'punctuation', 'sentence'];
    const isFoundational = foundationalKeywords.some((k) =>
      topic.title.toLowerCase().includes(k)
    );
    if (isFoundational) {
      const c1Stage = prog['Class 1']?.stage || 'none';
      const c2Stage = prog['Class 2']?.stage || 'none';
      const c3Stage = prog['Class 3']?.stage || 'none';
      if (c1Stage === 'none' && c2Stage === 'none' && c3Stage === 'none') {
        findings.push({
          id: `audit-too-late-${topic.id}`,
          topicId: topic.id,
          topicTitle: topic.title,
          system: targetSystem,
          findingType: 'introduced_too_late',
          severity: 'medium',
          title: `Foundational Concept Introduced Too Late`,
          description: `"${topic.title}" is a foundational literacy concept but has no exposure in Classes 1–3.`,
          recommendation: `Introduce basic naming/doing word awareness in Class 1 or 2 before formal classification in Class 3.`,
          affectedLevels: ['Class 1', 'Class 2', 'Class 3'],
        });
      }
    }

    // Check 3: Progression gaps (e.g. Active at Class 4, None at Class 5, Tested/Mastered at Class 6)
    for (let i = 0; i < ALL_CLASS_LEVELS.length - 2; i++) {
      const cCurrent = ALL_CLASS_LEVELS[i];
      const cNext = ALL_CLASS_LEVELS[i + 1];
      const cLater = ALL_CLASS_LEVELS[i + 2];
      const sCurrent = prog[cCurrent]?.stage || 'none';
      const sNext = prog[cNext]?.stage || 'none';
      const sLater = prog[cLater]?.stage || 'none';

      if (sCurrent !== 'none' && sNext === 'none' && (sLater === 'M' || sLater === 'E' || sLater === 'R')) {
        findings.push({
          id: `audit-gap-${topic.id}-${cNext}`,
          topicId: topic.id,
          topicTitle: topic.title,
          system: targetSystem,
          findingType: 'progression_gap',
          severity: 'medium',
          title: `Progression Gap in ${cNext}`,
          description: `"${topic.title}" is active in ${cCurrent} and resumes in ${cLater}, but has no learning cell at ${cNext}.`,
          recommendation: `Add a 'Reinforced' (R) or 'Developing' (D) learning cell at ${cNext} to maintain continuity.`,
          affectedLevels: [cNext],
        });
      }
    }

    // Check 4: Abrupt difficulty jumps (e.g. going from 'none' or 'I' straight to 'M' or 'E')
    for (let i = 0; i < ALL_CLASS_LEVELS.length - 1; i++) {
      const cA = ALL_CLASS_LEVELS[i];
      const cB = ALL_CLASS_LEVELS[i + 1];
      const sA = prog[cA]?.stage || 'none';
      const sB = prog[cB]?.stage || 'none';

      if (sA === 'none' && (sB === 'M' || sB === 'E')) {
        findings.push({
          id: `audit-jump-${topic.id}-${cB}`,
          topicId: topic.id,
          topicTitle: topic.title,
          system: targetSystem,
          findingType: 'abrupt_difficulty_jump',
          severity: 'high',
          title: `Abrupt Difficulty Jump (${cA} to ${cB})`,
          description: `"${topic.title}" is untaught at ${cA} but jumps immediately to '${sB === 'M' ? 'Mastered' : 'Extension'}' at ${cB} without introductory scaffolding.`,
          recommendation: `Provide 'Introduced' (I) or 'Developing' (D) exposure before demanding board-level mastery.`,
          affectedLevels: [cA, cB],
        });
      }
    }

    // Check 5: Excessive repetition without cognitive development (e.g. same 'I' stage across 4+ classes)
    let introducedCount = 0;
    const introClasses: GrammarClassLevel[] = [];
    ALL_CLASS_LEVELS.forEach((cls) => {
      if (prog[cls]?.stage === 'I') {
        introducedCount++;
        introClasses.push(cls);
      }
    });
    if (introducedCount >= 3) {
      findings.push({
        id: `audit-rep-${topic.id}`,
        topicId: topic.id,
        topicTitle: topic.title,
        system: targetSystem,
        findingType: 'excessive_repetition',
        severity: 'low',
        title: `Persistent Re-introduction (${introClasses.join(', ')})`,
        description: `"${topic.title}" is marked as 'Introduced' across ${introducedCount} classes without advancing to Developing (D) or Mastery (M).`,
        recommendation: `Elevate later classes to 'Developing' or 'Reinforced & Expanded' with higher cognitive demand.`,
        affectedLevels: introClasses,
      });
    }

    // Check 6: Missing advanced development at Senior Secondary (Class 11–12) for core grammar
    const c11Stage = prog['Class 11']?.stage || 'none';
    const c12Stage = prog['Class 12']?.stage || 'none';
    if (
      (topic.strand === 'Syntax & Sentence Architecture' || topic.strand === 'Transformations') &&
      c11Stage === 'none' &&
      c12Stage === 'none'
    ) {
      findings.push({
        id: `audit-adv-${topic.id}`,
        topicId: topic.id,
        topicTitle: topic.title,
        system: targetSystem,
        findingType: 'missing_advanced_development',
        severity: 'advisory',
        title: `Missing Senior Secondary Extension`,
        description: `"${topic.title}" terminates before Senior Secondary (Class 11–12) where pre-university stylistic synthesis can be developed.`,
        recommendation: `Consider extending with formal rhetorical or advanced inversion applications at Classes 11 and 12.`,
        affectedLevels: ['Class 11', 'Class 12'],
      });
    }
  });

  return findings;
}
