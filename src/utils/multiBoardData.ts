import {
  CurriculumSystem,
  CurriculumSystemId,
  CurriculumProgramme,
  CurriculumStage,
  BookEdition,
  MasterGrammarConcept,
  QualityAuditAlert,
  GrammarClassLevel,
  ProgressionStage,
} from '../types';

// ============================================================================
// 1. CURRICULUM SYSTEMS & PROGRAMMES REGISTRY
// ============================================================================

export const CURRICULUM_SYSTEMS: CurriculumSystem[] = [
  {
    id: 'CISCE',
    name: 'Council for the Indian School Certificate Examinations (CISCE)',
    shortName: 'CISCE',
    authority: 'Council for the Indian School Certificate Examinations, New Delhi',
    description:
      'Rigorous British-Indian heritage curriculum emphasizing classical grammatical precision, formal sentence transformation, rich literary terminology, and formal composition syntax.',
    programmes: [
      {
        id: 'cisce-school',
        systemId: 'CISCE',
        name: 'CISCE Aligned Primary & Middle School English',
        shortCode: 'CISCE School',
        ageBracket: 'Ages 5–14 (Classes 1–8)',
        description:
          'School-level curriculum aligned with the CISCE syllabus framework for Preschool to Class VIII. Emphasizes classical grammar, parts of speech, syntax, and progressive writing. Note: School-level curriculum, not statutory board examinations.',
        stages: [],
      },
      {
        id: 'cisce-icse',
        systemId: 'CISCE',
        name: 'ICSE (Indian Certificate of Secondary Education)',
        shortCode: 'ICSE',
        ageBracket: 'Ages 14–16 (Classes 9–10)',
        description:
          'Comprehensive secondary English Language curriculum culminating in the compulsory ICSE Class 10 English Language Paper 1 (featuring Question 5 functional grammar: transformation of sentences, prepositions/phrasal verbs, and passage tense-filling).',
        stages: [], // populated below
      },
      {
        id: 'cisce-isc',
        systemId: 'CISCE',
        name: 'ISC (Indian School Certificate)',
        shortCode: 'ISC',
        ageBracket: 'Ages 16–18 (Classes 11–12)',
        description:
          'Advanced pre-university English Language curriculum (Paper 1) focusing on sentence synthesis, nuanced idioms, formal register, precision editing, and rhetorical clarity.',
        stages: [],
      },
    ],
  },
  {
    id: 'CBSE',
    name: 'Central Board of Secondary Education (CBSE)',
    shortName: 'CBSE',
    authority: 'Central Board of Secondary Education, Ministry of Education, New Delhi',
    description:
      'National curriculum framework prioritizing communicative grammar, integrated gap-filling, dialogic reported speech, sentence reordering, and error editing aligned with the NEP 2020 pedagogical standards.',
    programmes: [
      {
        id: 'cbse-main',
        systemId: 'CBSE',
        name: 'CBSE English Language & Literature',
        shortCode: 'CBSE',
        ageBracket: 'Ages 5–18 (Classes 1–12)',
        description:
          'Progressive spiral curriculum from Class 1 foundational language play to Class 10 Section B Grammar (10 Marks: Determiners, Tenses, Modals, Subject-Verb Concord, Reported Speech) and Class 12 formal discourse.',
        stages: [],
      },
    ],
  },
  {
    id: 'Cambridge',
    name: 'Cambridge Assessment International Education (CAIE)',
    shortName: 'Cambridge',
    authority: 'Cambridge University Press & Assessment, Cambridge, UK',
    description:
      'Global enquiry-led continuum structured into Stages rather than Indian Classes. Emphasizes functional grammar, stylistic effect, linguistic analysis, rhetorical conventions, and communicative accuracy across varied international contexts.',
    programmes: [
      {
        id: 'cambridge-primary',
        systemId: 'Cambridge',
        name: 'Cambridge Primary English (0058)',
        shortCode: 'Cambridge Primary',
        ageBracket: 'Ages 5–11 (Stages 1–6)',
        description:
          'Structured learning objectives developing foundational syntax, clause combination, punctuation nuance, and text-organizing linguistic features in active contextual writing.',
        stages: [],
      },
      {
        id: 'cambridge-lower-sec',
        systemId: 'Cambridge',
        name: 'Cambridge Lower Secondary English (0861)',
        shortCode: 'Cambridge Lower Sec',
        ageBracket: 'Ages 11–14 (Stages 7–9 / Checkpoint)',
        description:
          'Rigorous middle-stage continuum leading to Cambridge Checkpoint (Stage 9), mastering complex sentences, passive voice for depersonalized effect, modal hedging, and cohesive grammatical devices.',
        stages: [],
      },
      {
        id: 'cambridge-igcse',
        systemId: 'Cambridge',
        name: 'Cambridge Upper Secondary / IGCSE (0500 / 0510)',
        shortCode: 'Cambridge IGCSE',
        ageBracket: 'Ages 14–16 (Years 10–11)',
        description:
          'International qualification developing critical linguistic awareness, precise grammatical conventions, summary synthesis, and subtle tone manipulation for diverse audiences.',
        stages: [],
      },
      {
        id: 'cambridge-alevel',
        systemId: 'Cambridge',
        name: 'Cambridge International AS & A Level (9093)',
        shortCode: 'Cambridge AS/A Level',
        ageBracket: 'Ages 16–19 (Years 12–13)',
        description:
          'University-preparatory linguistics and advanced language mechanics: sociolinguistic registers, syntactic foregrounding, nominalisation, discourse markers, and text deconstruction.',
        stages: [],
      },
    ],
  },
];

// ============================================================================
// 2. STAGES DEFINITIONS (Respecting Cambridge Stages & Indian Classes)
// ============================================================================

export const CURRICULUM_STAGES: CurriculumStage[] = [
  // --- CBSE Stages (Classes 1 to 12) ---
  {
    id: 'stage-cbse-c1',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 1',
    equivalentClass: 'Class 1',
    veritasLevel: 1,
    nominalAge: 'Ages 5–6',
    description: 'Foundational language play: oral-to-written transition, naming words (nouns), action words (verbs), sentence capitalization, and full stop.',
    syllabusFrameworkRef: 'CBSE Foundational Stage Curriculum (NEP 2020) - Class 1 English',
  },
  {
    id: 'stage-cbse-c2',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 2',
    equivalentClass: 'Class 2',
    veritasLevel: 2,
    nominalAge: 'Ages 6–7',
    description: 'Foundational sentence awareness: simple sentences, describing words (adjectives), personal pronouns (I, you, he, she), question mark, and word order.',
    syllabusFrameworkRef: 'CBSE Foundational Stage Curriculum (NEP 2020) - Class 2 English',
  },
  {
    id: 'stage-cbse-c3',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 3',
    equivalentClass: 'Class 3',
    nominalAge: 'Ages 8–9',
    description: 'Foundational parts of speech, simple present/past, capitalization, and naming vs doing words.',
    syllabusFrameworkRef: 'CBSE Primary Syllabus - English Language Framework Class 3',
  },
  {
    id: 'stage-cbse-c4',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 4',
    equivalentClass: 'Class 4',
    nominalAge: 'Ages 9–10',
    description: 'Compound subjects, pronouns, basic adjectives, and time adverbs in daily context.',
    syllabusFrameworkRef: 'CBSE Primary Syllabus - English Language Framework Class 4',
  },
  {
    id: 'stage-cbse-c5',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 5',
    equivalentClass: 'Class 5',
    nominalAge: 'Ages 10–11',
    description: 'Subject & predicate segmentation, articles, coordinating conjunctions, and simple prepositional usage.',
    syllabusFrameworkRef: 'CBSE Upper Primary Syllabus Class 5',
  },
  {
    id: 'stage-cbse-c6',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 6',
    equivalentClass: 'Class 6',
    nominalAge: 'Ages 11–12',
    description: 'Subject-verb concord, verb aspects, prepositional accuracy, and introductory active/passive voice.',
    syllabusFrameworkRef: 'CBSE Middle School Syllabus Class 6 - English Language',
  },
  {
    id: 'stage-cbse-c7',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 7',
    equivalentClass: 'Class 7',
    nominalAge: 'Ages 12–13',
    description: 'Reported speech, modal auxiliaries, transitive/intransitive verbs, and compound sentence structures.',
    syllabusFrameworkRef: 'CBSE Middle School Syllabus Class 7 - English Language',
  },
  {
    id: 'stage-cbse-c8',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 8',
    equivalentClass: 'Class 8',
    nominalAge: 'Ages 13–14',
    description: 'Non-finite verbs, noun/adverb clauses, relative pronouns, and conditional sentence basics.',
    syllabusFrameworkRef: 'CBSE Middle School Syllabus Class 8 - English Language',
  },
  {
    id: 'stage-cbse-c9',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 9',
    equivalentClass: 'Class 9',
    nominalAge: 'Ages 14–15',
    description: 'Integrated grammar, dialogue reporting, sentence transformation, and error editing.',
    syllabusFrameworkRef: 'CBSE Secondary Curriculum (Code 184) Class 9',
  },
  {
    id: 'stage-cbse-c10',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 10',
    equivalentClass: 'Class 10',
    nominalAge: 'Ages 15–16',
    description: 'CBSE Board Examination Blueprint Section B (10 Marks): Tenses, Modals, Concord, Reported Speech, Determiners.',
    syllabusFrameworkRef: 'CBSE Board Examination Curriculum (Code 184) Class 10',
  },
  {
    id: 'stage-cbse-c11',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 11',
    equivalentClass: 'Class 11',
    nominalAge: 'Ages 16–17',
    description: 'Senior secondary syntax, inversion, subjunctive mood, and formal academic prose linkage.',
    syllabusFrameworkRef: 'CBSE Senior Secondary Curriculum (Code 301) Class 11',
  },
  {
    id: 'stage-cbse-c12',
    systemId: 'CBSE',
    programmeId: 'cbse-main',
    stageLabel: 'Class 12',
    equivalentClass: 'Class 12',
    nominalAge: 'Ages 17–18',
    description: 'Advanced syntactic parallelism, dangling modifier elimination, rhetorical synthesis, and competitive entrance grammar.',
    syllabusFrameworkRef: 'CBSE Senior Secondary Curriculum (Code 301) Class 12',
  },

  // --- CISCE Stages (Classes 1 to 12) ---
  // Note: Classes 1–8 are School-Level CISCE Curriculum Aligned; Classes 9–10 are ICSE; Classes 11–12 are ISC
  {
    id: 'stage-icse-c1',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 1',
    equivalentClass: 'Class 1',
    veritasLevel: 1,
    nominalAge: 'Ages 5–6',
    description: 'Foundational language acquisition: naming words, action words, simple punctuation, and oral language reinforcement.',
    syllabusFrameworkRef: 'CISCE Curriculum for Preschool to Class VIII - Class 1',
  },
  {
    id: 'stage-icse-c2',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 2',
    equivalentClass: 'Class 2',
    veritasLevel: 2,
    nominalAge: 'Ages 6–7',
    description: 'Introductory grammar: describing words, simple singular/plural, capital letters, and sentence framing.',
    syllabusFrameworkRef: 'CISCE Curriculum for Preschool to Class VIII - Class 2',
  },
  {
    id: 'stage-icse-c3',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 3',
    equivalentClass: 'Class 3',
    veritasLevel: 3,
    nominalAge: 'Ages 8–9',
    description: 'Classical parts of speech, regular/irregular plurals, genders, and simple sentence punctuation.',
    syllabusFrameworkRef: 'CISCE Curriculum for Preschool to Class VIII - Class 3',
  },
  {
    id: 'stage-icse-c4',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 4',
    equivalentClass: 'Class 4',
    veritasLevel: 4,
    nominalAge: 'Ages 9–10',
    description: 'Collective nouns, abstract nouns, degrees of comparison, and subject-predicate division.',
    syllabusFrameworkRef: 'CISCE Curriculum for Preschool to Class VIII - Class 4',
  },
  {
    id: 'stage-icse-c5',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 5',
    equivalentClass: 'Class 5',
    veritasLevel: 5,
    nominalAge: 'Ages 10–11',
    description: 'Transitive/intransitive verbs, direct/indirect objects, prepositions of position, and punctuation rules.',
    syllabusFrameworkRef: 'CISCE Curriculum for Preschool to Class VIII - Class 5',
  },
  {
    id: 'stage-icse-c6',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 6',
    equivalentClass: 'Class 6',
    veritasLevel: 6,
    nominalAge: 'Ages 11–12',
    description: 'Subject-verb agreement (concord), active and passive voice, simple/compound sentences, and prepositions.',
    syllabusFrameworkRef: 'CISCE Curriculum for Middle School Class 6',
  },
  {
    id: 'stage-icse-c7',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 7',
    equivalentClass: 'Class 7',
    veritasLevel: 7,
    nominalAge: 'Ages 12–13',
    description: 'Direct & indirect speech rules, phrasal verbs, non-finite verbs (infinitives/gerunds), and clause analysis.',
    syllabusFrameworkRef: 'CISCE Curriculum for Middle School Class 7',
  },
  {
    id: 'stage-icse-c8',
    systemId: 'CISCE',
    programmeId: 'cisce-school',
    stageLabel: 'Class 8',
    equivalentClass: 'Class 8',
    veritasLevel: 8,
    nominalAge: 'Ages 13–14',
    description: 'Synthesis of sentences (using participles, infinitives, conjunctions), conditional clauses, and mood.',
    syllabusFrameworkRef: 'CISCE Curriculum for Middle School Class 8',
  },
  {
    id: 'stage-icse-c9',
    systemId: 'CISCE',
    programmeId: 'cisce-icse',
    stageLabel: 'Class 9',
    equivalentClass: 'Class 9',
    veritasLevel: 9,
    nominalAge: 'Ages 14–15',
    description: 'ICSE Examination Prep: Transformation of sentences (affirmative/negative, degrees, voice), preposition mastery.',
    syllabusFrameworkRef: 'ICSE Regulations & Syllabuses Class 9 English Paper 1',
  },
  {
    id: 'stage-icse-c10',
    systemId: 'CISCE',
    programmeId: 'cisce-icse',
    stageLabel: 'Class 10',
    equivalentClass: 'Class 10',
    veritasLevel: 10,
    nominalAge: 'Ages 15–16',
    description: 'ICSE Board English Language Paper 1 Question 5: Complete transformation without changing meaning (8 marks), prepositions (4 marks), passage verb forms (4 marks).',
    syllabusFrameworkRef: 'ICSE Regulations & Syllabuses Class 10 English Language Paper 1',
  },

  // --- CISCE / ISC Stages (Classes 11 to 12) ---
  {
    id: 'stage-isc-c11',
    systemId: 'CISCE',
    programmeId: 'cisce-isc',
    stageLabel: 'Class 11',
    equivalentClass: 'Class 11',
    veritasLevel: 11,
    nominalAge: 'Ages 16–17',
    description: 'ISC Senior Grammar: Complex sentence synthesis, phrasal verbs in varied registers, subjunctive mood, and inversion.',
    syllabusFrameworkRef: 'ISC Regulations & Syllabuses Class 11 English Paper 1',
  },
  {
    id: 'stage-isc-c12',
    systemId: 'CISCE',
    programmeId: 'cisce-isc',
    stageLabel: 'Class 12',
    equivalentClass: 'Class 12',
    veritasLevel: 12,
    nominalAge: 'Ages 17–18',
    description: 'ISC Board English Language Paper 1: Advanced functional grammar, precise sentence transformation, error editing, and idiomatic precision.',
    syllabusFrameworkRef: 'ISC Regulations & Syllabuses Class 12 English Paper 1',
  },

  // --- Cambridge International Stages (Primary, Lower Sec, IGCSE, A Level) ---
  {
    id: 'stage-camb-s1',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 1',
    equivalentClass: 'Class 1',
    veritasLevel: 1,
    nominalAge: 'Ages 5–6',
    description: 'Cambridge Primary Stage 1: Basic word order, naming words, action words, capital letters, and full stops. Note: Editorial learning band mapping to VERITAS Level 1.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 1',
    isEditorialMapping: true,
    officialProgrammeOrStage: 'Stage 1',
  },
  {
    id: 'stage-camb-s2',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 2',
    equivalentClass: 'Class 2',
    veritasLevel: 2,
    nominalAge: 'Ages 6–7',
    description: 'Cambridge Primary Stage 2: Simple adjectives, pronouns, connective "and", question marks, and exclamation marks. Note: Editorial learning band mapping to VERITAS Level 2.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 2',
    isEditorialMapping: true,
    officialProgrammeOrStage: 'Stage 2',
  },
  {
    id: 'stage-camb-s3',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 3',
    equivalentClass: 'Class 3',
    nominalAge: 'Ages 7–8',
    description: 'Cambridge Primary: Noun phrases, past tense consistency, conjunctions (and, but, because), commas in lists.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 3',
  },
  {
    id: 'stage-camb-s4',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 4',
    equivalentClass: 'Class 4',
    nominalAge: 'Ages 8–9',
    description: 'Cambridge Primary: Fronted adverbials, expanded noun phrases with prepositions, apostrophes for possession.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 4',
  },
  {
    id: 'stage-camb-s5',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 5',
    equivalentClass: 'Class 5',
    nominalAge: 'Ages 9–10',
    description: 'Cambridge Primary: Relative clauses (who, which, that), modal verbs for possibility, cohesive devices.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 5',
  },
  {
    id: 'stage-camb-s6',
    systemId: 'Cambridge',
    programmeId: 'cambridge-primary',
    stageLabel: 'Stage 6',
    equivalentClass: 'Class 6',
    nominalAge: 'Ages 10–11',
    description: 'Cambridge Primary Checkpoint: Passive constructions for objective tone, semicolon linkage, complex subordination.',
    syllabusFrameworkRef: 'Cambridge Primary English Curriculum Framework (0058) Stage 6',
  },
  {
    id: 'stage-camb-s7',
    systemId: 'Cambridge',
    programmeId: 'cambridge-lower-sec',
    stageLabel: 'Stage 7',
    equivalentClass: 'Class 6',
    nominalAge: 'Ages 11–12',
    description: 'Cambridge Lower Secondary: Varying sentence lengths for effect, complex noun phrases, direct/indirect reporting nuances.',
    syllabusFrameworkRef: 'Cambridge Lower Secondary English Curriculum Framework (0861) Stage 7',
  },
  {
    id: 'stage-camb-s8',
    systemId: 'Cambridge',
    programmeId: 'cambridge-lower-sec',
    stageLabel: 'Stage 8',
    equivalentClass: 'Class 7',
    nominalAge: 'Ages 12–13',
    description: 'Cambridge Lower Secondary: Active vs passive voice for emphasis, conditional structures for hypothesis, subtle connective transitions.',
    syllabusFrameworkRef: 'Cambridge Lower Secondary English Curriculum Framework (0861) Stage 8',
  },
  {
    id: 'stage-camb-s9',
    systemId: 'Cambridge',
    programmeId: 'cambridge-lower-sec',
    stageLabel: 'Stage 9 (Checkpoint)',
    equivalentClass: 'Class 8',
    nominalAge: 'Ages 13–14',
    description: 'Cambridge Lower Secondary Checkpoint: Structural linguistic effects, non-finite subordinate clauses, rhetorical punctuation (colons, dashes).',
    syllabusFrameworkRef: 'Cambridge Lower Secondary English Checkpoint Framework (0861) Stage 9',
  },
  {
    id: 'stage-camb-y10',
    systemId: 'Cambridge',
    programmeId: 'cambridge-igcse',
    stageLabel: 'IGCSE Year 10',
    equivalentClass: 'Class 9',
    nominalAge: 'Ages 14–15',
    description: 'Cambridge Upper Secondary: Stylistic syntax, precise grammatical registers, concise summary structures, and tone calibration.',
    syllabusFrameworkRef: 'Cambridge IGCSE First Language English (0500) Syllabus Year 10',
  },
  {
    id: 'stage-camb-y11',
    systemId: 'Cambridge',
    programmeId: 'cambridge-igcse',
    stageLabel: 'IGCSE Year 11',
    equivalentClass: 'Class 10',
    nominalAge: 'Ages 15–16',
    description: 'Cambridge IGCSE Examination: Complex rhetorical manipulation, analytical sentence structures, error-free formal conventions.',
    syllabusFrameworkRef: 'Cambridge IGCSE First Language English (0500) Examination Year 11',
  },
  {
    id: 'stage-camb-as',
    systemId: 'Cambridge',
    programmeId: 'cambridge-alevel',
    stageLabel: 'AS Level (Year 12)',
    equivalentClass: 'Class 11',
    nominalAge: 'Ages 16–17',
    description: 'Cambridge International AS Level: Linguistic deconstruction, register and genre conventions, nominalisation, stylistic foregrounding.',
    syllabusFrameworkRef: 'Cambridge International AS & A Level English Language (9093) Syllabus AS Level',
  },
  {
    id: 'stage-camb-a2',
    systemId: 'Cambridge',
    programmeId: 'cambridge-alevel',
    stageLabel: 'A Level (Year 13)',
    equivalentClass: 'Class 12',
    nominalAge: 'Ages 17–18',
    description: 'Cambridge International A Level: Advanced English language mechanics, sociolinguistic discourse, syntactic architecture of academic and literary prose.',
    syllabusFrameworkRef: 'Cambridge International AS & A Level English Language (9093) Syllabus A Level',
  },
];

// Link stages into programmes
CURRICULUM_SYSTEMS.forEach((system) => {
  system.programmes.forEach((prog) => {
    prog.stages = CURRICULUM_STAGES.filter((s) => s.programmeId === prog.id);
  });
});

// ============================================================================
// 3. MASTER GRAMMAR CONCEPTS VS. CURRICULUM IMPLEMENTATIONS
// ============================================================================

export const MASTER_GRAMMAR_CONCEPTS: MasterGrammarConcept[] = [
  {
    id: 'concept-concord',
    name: 'Subject-Verb Concord / Agreement',
    strand: 'Syntax & Morphology',
    universalDefinition:
      'The grammatical rule that a finite verb must match its subject in both grammatical number (singular or plural) and person (first, second, or third person).',
    universalRules: [
      'Singular subjects require singular verbs; plural subjects require plural verbs.',
      'Intervening prepositional phrases or parenthetical remarks do not alter the head noun number.',
      'Compound subjects joined by "and" take plural verbs unless expressing a single unified entity.',
      'Correlative pairs (either... or, neither... nor) enforce proximity agreement with the nearer subject.',
      'Indefinite pronouns (each, everyone, someone, neither) take grammatically singular verbs in standard formal English.',
    ],
    commonPitfalls: [
      'Proximity attraction error: agreeing with an intervening plural noun inside a prepositional phrase rather than the true head noun.',
      'Treating collective nouns uniformly without distinguishing between collective unity (singular) vs individual division (plural).',
      'Confusing nouns plural in form but singular in meaning (news, mathematics, economics) with plural nouns.',
    ],
    progressionByStage: {
      'Class 3': { stage: 'I', outcome: 'Recognize singular vs plural subject and matching simple verbs (is/are, has/have).', depthNote: 'Concrete picture-supported drill.' },
      'Class 4': { stage: 'D', outcome: 'Compound subjects with "and" taking plural verbs; simple past forms (was/were).', depthNote: 'Focus on regular pronouns and nouns.' },
      'Class 5': { stage: 'R', outcome: 'Identify head noun across basic prepositional phrases (e.g. "The boy in the red shoes is...").', depthNote: 'Simple intervening phrases.' },
      'Class 6': { stage: 'M', outcome: 'Master intervening parenthetical phrases, collective nouns, and distributive pronouns.', depthNote: 'Full formal concord suite.' },
      'Class 7': { stage: 'M', outcome: 'Indefinite quantifiers (either of, neither of, a number of vs the number of).', depthNote: 'Application in error editing passages.' },
      'Class 8': { stage: 'R', outcome: 'Advanced concord in complex sentences with relative clause subjects.', depthNote: 'Syntax integration.' },
      'Class 9': { stage: 'R', outcome: 'Board editing error identification in dense non-fiction paragraphs.', depthNote: 'Timed exam drills.' },
      'Class 10': { stage: 'M', outcome: 'Zero-tolerance accuracy in board gap-filling and sentence transformation.', depthNote: 'Board exam mandatory standard.' },
      'Class 11': { stage: 'E', outcome: 'Concord in inverted sentences, existential "there", and pseudo-cleft clauses.', depthNote: 'Rhetorical registers.' },
      'Class 12': { stage: 'E', outcome: 'Syntactic parallelism and notional concord in formal academic prose.', depthNote: 'Competitive and scholarly level.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Class 6 & Class 10 Board Core',
        canonicalTerminology: 'Subject-Verb Concord',
        pedagogicalEmphasis: 'Communicative gap-filling and 1-mark error identification passages in Section B.',
        boardExamWeightage: '2–3 marks (Mandatory slot in Class 10 Section B Grammar)',
        sampleQuestionPrompt: 'Fill in the blank by choosing the correct verb: "The jury ___ (was / were) divided in their opinions."',
        testingPattern: '1-mark objective multiple-choice or single blank correction in dialogue/reported context.',
        scopeBoundary: 'Focuses on prescriptive clarity: collective nouns, indefinite pronouns, and intervening phrases.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE English Language Paper 1 Question 5',
        canonicalTerminology: 'Subject-Verb Agreement',
        pedagogicalEmphasis: 'Rigorous classical transformation of sentences without changing meaning, and passage verb filling.',
        boardExamWeightage: 'Part of Question 5(a) verb forms (4 marks) and 5(d) transformation (8 marks)',
        sampleQuestionPrompt: 'Rewrite the sentence using "No sooner... than": "As soon as the teacher entered, the boys stood up."',
        testingPattern: 'Complete sentence rewrites and bracketed verb inflection in narrative passages.',
        scopeBoundary: 'Demands precise inflectional mastery without contextual prompts or word banks.',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Lower Secondary (Stage 7–9) & IGCSE',
        canonicalTerminology: 'Subject-verb agreement in complex noun phrases',
        pedagogicalEmphasis: 'Linguistic effect, stylistic register, and communicative clarity across varied text types.',
        boardExamWeightage: 'Embedded in Writing Assessment Criterion: Grammatical Accuracy & Range',
        sampleQuestionPrompt: 'Explain how the author uses subject-verb positioning to heighten tension in the excerpt.',
        testingPattern: 'Analytical commentary and integrated writing production rather than discrete grammar blanks.',
        scopeBoundary: 'Treats concord as a functional tool for rhetorical clarity rather than an isolated rule checklist.',
      },
    },
  },
  {
    id: 'concept-conditionals',
    name: 'Conditional Sentences & Hypotheses',
    strand: 'Complex Syntax & Modality',
    universalDefinition:
      'Complex sentences expressing a condition (if-clause/protasis) and its consequence or result (main clause/apodosis) across real, probable, improbable, and counterfactual past realities.',
    universalRules: [
      'Zero Conditional: General truths (If + Simple Present, Simple Present).',
      'First Conditional: Likely future condition (If + Simple Present, will/can/may + Verb).',
      'Second Conditional: Hypothetical present/future (If + Simple Past / subjunctive were, would/could + Verb).',
      'Third Conditional: Counterfactual past regret (If + Past Perfect, would/could/might have + Past Participle).',
      'Inversion Rule: Omitting "if" by placing auxiliary first ("Had I known...", "Should you require...").',
    ],
    commonPitfalls: [
      'Using "would have" in the if-clause (e.g. *If I would have known* instead of *If I had known*).',
      'Misusing "was" instead of hypothetical subjunctive "were" in formal registers (e.g. *If I were you*).',
      'Confusing "unless" with "if not" and causing a double negative.',
    ],
    progressionByStage: {
      'Class 3': { stage: 'none', outcome: 'Not introduced.', depthNote: 'Cognitively premature.' },
      'Class 4': { stage: 'none', outcome: 'Not introduced.', depthNote: 'Cognitively premature.' },
      'Class 5': { stage: 'I', outcome: 'Simple causes: "If it rains, we will stay home."', depthNote: 'Concrete cause-effect.' },
      'Class 6': { stage: 'D', outcome: 'Zero and First Conditionals with realistic examples.', depthNote: 'Distinguish real from unreal.' },
      'Class 7': { stage: 'R', outcome: 'Second Conditional (Imaginary scenarios): "If I had wings, I would fly."', depthNote: 'Modal auxiliaries linkage.' },
      'Class 8': { stage: 'M', outcome: 'Third Conditional (Past counterfactuals) and "Unless".', depthNote: 'Regret and hindsight expressions.' },
      'Class 9': { stage: 'R', outcome: 'Mixed conditionals and transformation of conditional structures.', depthNote: 'Syntactic flexibility.' },
      'Class 10': { stage: 'M', outcome: 'Board exam mastery of all four conditional types and inverted conditionals.', depthNote: 'Mandatory exam testing.' },
      'Class 11': { stage: 'E', outcome: 'Subjunctive mood, conditional inversions (Had..., Were..., Should...).', depthNote: 'Rhetorical sophistication.' },
      'Class 12': { stage: 'E', outcome: 'Stylistic manipulation in formal argument, diplomatic nuance, and satire.', depthNote: 'Advanced stylistic analysis.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Class 10 Grammar & Modals',
        canonicalTerminology: 'Conditionals & Modals',
        pedagogicalEmphasis: 'Applying correct modal verbs in hypothetical situations and reported clauses.',
        boardExamWeightage: '1–2 marks in Section B Grammar',
        sampleQuestionPrompt: 'Complete the condition: "If the government had taken timely measures, the tragedy ___ (could be / could have been) averted."',
        testingPattern: 'Multiple-choice option selection or fill-in-the-blank in authentic dialogues.',
        scopeBoundary: 'Focuses on standard Zero, First, Second, and Third patterns.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE Class 10 Question 5(d) Transformation',
        canonicalTerminology: 'Conditional Clauses & Sentence Transformation',
        pedagogicalEmphasis: 'Rewriting sentences beginning with "Had...", "Unless...", "Provided that...", or "If only...".',
        boardExamWeightage: '2 marks in Question 5(d) Sentence Transformation (Compulsory)',
        sampleQuestionPrompt: 'Rewrite beginning with "Had": "If you had warned me about the treacherous path, I would not have taken it."',
        testingPattern: 'Strict formal sentence transformation without altering meaning or introducing errors.',
        scopeBoundary: 'Deep testing of inverted conditionals without "if".',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Checkpoint Stage 9 & IGCSE',
        canonicalTerminology: 'Conditional structures for hypothetical and speculative argument',
        pedagogicalEmphasis: 'Using conditional constructions to weigh counterarguments and express nuanced degrees of probability.',
        boardExamWeightage: 'Assessed in Extended Writing and Discursive Essays',
        sampleQuestionPrompt: 'Construct a complex sentence using a conditional clause to hypothesize about the environmental consequences.',
        testingPattern: 'Integrated discursive writing rubric.',
        scopeBoundary: 'Emphasis on pragmatic effect and rhetorical stance.',
      },
    },
  },
  {
    id: 'concept-voice',
    name: 'Active & Passive Voice Transformation',
    strand: 'Syntax & Pragmatics',
    universalDefinition:
      'The syntactic alternation of grammatical voice that shifts focus between the agent (active) and the patient/receiver of the action (passive), utilizing forms of auxiliary "be" plus past participle.',
    universalRules: [
      'Only transitive verbs with direct objects can be transformed into passive voice.',
      'The active direct object becomes the passive grammatical subject.',
      'The verb phrase becomes: [Appropriate tense of "be"] + [Past Participle (V3)].',
      'The active subject is moved to a prepositional "by" phrase or omitted when irrelevant, unknown, or obvious.',
      'Verbs with two objects (direct & indirect) yield two valid passive constructions.',
    ],
    commonPitfalls: [
      'Attempting to transform intransitive verbs (e.g. *The accident was happened*).',
      'Altering the grammatical tense during voice transformation (e.g. turning present continuous into past simple).',
      'Overusing the passive voice in narrative prose, resulting in flat and sluggish action.',
    ],
    progressionByStage: {
      'Class 3': { stage: 'none', outcome: 'Not introduced.', depthNote: 'Focus on active narrative.' },
      'Class 4': { stage: 'none', outcome: 'Not introduced.', depthNote: 'Focus on active narrative.' },
      'Class 5': { stage: 'I', outcome: 'Introduce active vs passive sentences with simple transitive actions.', depthNote: 'Focus on "by whom" concept.' },
      'Class 6': { stage: 'D', outcome: 'Simple present, simple past, and future active-passive transformation.', depthNote: 'Formulaic substitution.' },
      'Class 7': { stage: 'R', outcome: 'Continuous and perfect tenses in passive voice; modal passive.', depthNote: 'Auxiliary chaining.' },
      'Class 8': { stage: 'M', outcome: 'Passive with two objects, imperative sentences, and agent omission.', depthNote: 'Functional context.' },
      'Class 9': { stage: 'R', outcome: 'Process descriptions and scientific report writing using passive voice.', depthNote: 'Objective register.' },
      'Class 10': { stage: 'M', outcome: 'Complete transformation without meaning change in board examination formats.', depthNote: 'High accuracy drill.' },
      'Class 11': { stage: 'E', outcome: 'Depersonalization, impersonal passive ("It is argued that..."), agent suppression.', depthNote: 'Academic prose.' },
      'Class 12': { stage: 'E', outcome: 'Stylistic critique of passive voice in political speech, news framing, and bias.', depthNote: 'Critical linguistics.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Middle School & Secondary Process Writing',
        canonicalTerminology: 'Active and Passive Voice',
        pedagogicalEmphasis: 'Process descriptions (recipes, experiments) and news headline expansion.',
        boardExamWeightage: '1–2 marks in editing and transformation exercises',
        sampleQuestionPrompt: 'Complete the process description by choosing the passive form: "The solution ___ (is boiled / was boiled) until crystal formation begins."',
        testingPattern: 'Process completion paragraph with blanks.',
        scopeBoundary: 'Pragmatic focus on scientific and procedural objectivity.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE Question 5(d) Transformation',
        canonicalTerminology: 'Voice Transformation',
        pedagogicalEmphasis: 'Rigorous bidirectional sentence conversion without altering meaning.',
        boardExamWeightage: '1–2 marks in Question 5(d) compulsory transformation',
        sampleQuestionPrompt: 'Rewrite beginning with "The manuscript": "The editorial committee thoroughly examined the manuscript."',
        testingPattern: 'Single sentence rewrite with strict structural constraint.',
        scopeBoundary: 'Tests complex tenses, modal passives, and interrogative passives.',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Checkpoint & IGCSE Non-Fiction',
        canonicalTerminology: 'Active vs. passive voice for objectivity and emphasis',
        pedagogicalEmphasis: 'Understanding when to deliberately conceal or foreground the agent for rhetorical effect.',
        boardExamWeightage: 'Evaluated in Report, Speech, and Formal Letter Writing criteria',
        sampleQuestionPrompt: 'Explain why the journalist chose the passive voice in paragraph 3 instead of naming the officials.',
        testingPattern: 'Stylistic effect commentary and formal non-fiction production.',
        scopeBoundary: 'Focuses on the sociolinguistic effect of agency suppression.',
      },
    },
  },
  {
    id: 'concept-reported-speech',
    name: 'Direct & Indirect (Reported) Speech',
    strand: 'Syntax & Pragmatics',
    universalDefinition:
      'The syntactic rules governing the reporting of statements, questions, commands, and exclamations across temporal, spatial, and deictic shifts.',
    universalRules: [
      'Tense back-shift when reporting verb is in the past tense (Simple Present -> Simple Past, etc.).',
      'No back-shift when reporting universal scientific truths, habitual facts, or when the reporting verb is in the present/future.',
      'Pronoun and possessive adjective shifts to align with the reporter viewpoint.',
      'Time and place adverb shifts (now -> then, here -> there, today -> that day, tomorrow -> the next day).',
      'Interrogatives: Wh-questions retain the question word; Yes/No questions introduce "if" or "whether"; inverted word order returns to subject + verb.',
    ],
    commonPitfalls: [
      'Retaining question word order in indirect questions (e.g. *He asked where was I going* instead of *where I was going*).',
      'Back-shifting universal scientific facts inappropriately (e.g. *The teacher said that the earth went round the sun*).',
      'Failing to convert the connecting word "that" correctly in commands (reporting with infinitive "to do" instead).',
    ],
    progressionByStage: {
      'Class 3': { stage: 'none', outcome: 'Not introduced.', depthNote: 'Speech marks in creative stories.' },
      'Class 4': { stage: 'none', outcome: 'Speech marks recognized.', depthNote: 'Punctuation awareness.' },
      'Class 5': { stage: 'I', outcome: 'Recognize direct quote vs telling what someone said.', depthNote: 'Introductory concept.' },
      'Class 6': { stage: 'D', outcome: 'Reporting simple statements with "that" and pronoun shift.', depthNote: 'Statements only.' },
      'Class 7': { stage: 'R', outcome: 'Tense back-shift rules and reporting Yes/No and Wh- questions.', depthNote: 'Question word order.' },
      'Class 8': { stage: 'M', outcome: 'Reporting commands, requests, and exclamations with suitable reporting verbs.', depthNote: 'Expanded reporting verbs.' },
      'Class 9': { stage: 'R', outcome: 'Dialogue reporting in paragraph format with multiple conversational turns.', depthNote: 'Dialogue completion.' },
      'Class 10': { stage: 'M', outcome: 'Board exam dialogue passage transformation and error editing.', depthNote: 'Mandatory board slot.' },
      'Class 11': { stage: 'E', outcome: 'Nuanced reporting verbs (conceded, refuted, implied) in journalistic writing.', depthNote: 'Semantic precision.' },
      'Class 12': { stage: 'E', outcome: 'Free indirect speech in modern narrative and rhetorical quotation techniques.', depthNote: 'Literary analysis.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Class 10 Section B Dialogue Reporting',
        canonicalTerminology: 'Reported Speech',
        pedagogicalEmphasis: 'Converting a 2-turn graphic dialogue into a cohesive reported paragraph.',
        boardExamWeightage: '2–3 marks (Guaranteed in CBSE Class 10 Section B)',
        sampleQuestionPrompt: 'Read the conversation between Doctor and Patient and complete the report: Doctor: "How are you feeling today?" Patient: "I have a mild headache." The doctor enquired ___.',
        testingPattern: 'Fill in the blank within an integrated reported paragraph.',
        scopeBoundary: 'High emphasis on question reporting without auxiliary inversion.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE Question 5(d) Transformation',
        canonicalTerminology: 'Direct and Indirect Speech',
        pedagogicalEmphasis: 'Exact sentence transformation of challenging quotes, exclamations, and archaic dialogue.',
        boardExamWeightage: '1–2 marks in Question 5(d) compulsory transformation',
        sampleQuestionPrompt: 'Rewrite beginning with "The traveler asked": "Where does this cobblestone lane lead, little girl?"',
        testingPattern: 'Single sentence rewrite with strict structural criteria.',
        scopeBoundary: 'Tests vocatives, exclamatory sentences, and complex multi-clause speeches.',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Lower Secondary & IGCSE English',
        canonicalTerminology: 'Quotation, indirect speech, and narrative perspective',
        pedagogicalEmphasis: 'Choosing between direct quotation, summary indirect speech, and paraphrasing for effect.',
        boardExamWeightage: 'Assessed in Journalistic Writing and Interview Transcription',
        sampleQuestionPrompt: 'Rewrite the witness statement into a formal police report using indirect reporting.',
        testingPattern: 'Communicative text transformation into a new genre.',
        scopeBoundary: 'Focuses on fidelity, conciseness, and appropriate journalistic register.',
      },
    },
  },
  {
    id: 'concept-prepositions',
    name: 'Prepositions & Phrasal Verbs',
    strand: 'Lexical Syntax & Collocations',
    universalDefinition:
      'Words that establish spatial, temporal, directional, and logical relationships between nouns/pronouns and other elements, as well as idiomatic verb-particle combinations (phrasal verbs).',
    universalRules: [
      'Prepositions are followed by noun phrases, pronouns, or gerunds (-ing forms), never bare verbs.',
      'Prepositions of time: "at" (specific times), "on" (days/dates), "in" (months/years/periods).',
      'Prepositions of place: "at" (specific point), "in" (enclosed space/country), "on" (surface).',
      'Phrasal verbs consist of verb + particle(s) with non-compositional, idiomatic meaning.',
      'Transitive separable phrasal verbs allow objects between verb and particle; pronouns MUST separate.',
    ],
    commonPitfalls: [
      'Using literal mother-tongue translation for prepositions (e.g. *discuss about*, *order for*).',
      'Confusing closely related phrasal verb particles (e.g. *give up* vs *give in*, *look into* vs *look after*).',
      'Separating inseparable phrasal verbs incorrectly.',
    ],
    progressionByStage: {
      'Class 3': { stage: 'I', outcome: 'Basic spatial prepositions: in, on, under, behind, near.', depthNote: 'Visual spatial drills.' },
      'Class 4': { stage: 'D', outcome: 'Prepositions of time (at, on, in) and movement (into, out of, towards).', depthNote: 'Everyday routines.' },
      'Class 5': { stage: 'R', outcome: 'Prepositions of cause, instrument (with/by), and distinction between among/between.', depthNote: 'Rules of usage.' },
      'Class 6': { stage: 'M', outcome: 'Common dependent prepositions (afraid of, interested in, good at).', depthNote: 'Collocational accuracy.' },
      'Class 7': { stage: 'M', outcome: 'Introductory phrasal verbs (turn on/off, give up, break down, call off).', depthNote: 'Idiomatic particles.' },
      'Class 8': { stage: 'R', outcome: 'Advanced phrasal verbs (look forward to, put up with, bring about).', depthNote: 'Three-part phrasal verbs.' },
      'Class 9': { stage: 'R', outcome: 'Board error editing with prepositional traps in authentic texts.', depthNote: 'Eliminating redundant prepositions.' },
      'Class 10': { stage: 'M', outcome: 'ICSE Question 5(b) 4-mark preposition mastery and CBSE gap-filling.', depthNote: 'Mandatory board slot.' },
      'Class 11': { stage: 'E', outcome: 'Nuanced prepositional idioms and stylistic phrasal verb alternatives in formal writing.', depthNote: 'Formal vs informal register.' },
      'Class 12': { stage: 'E', outcome: 'Prepositional collocations in legal, bureaucratic, and academic registers.', depthNote: 'Precision editing.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Integrated Grammar',
        canonicalTerminology: 'Prepositions',
        pedagogicalEmphasis: 'Contextual selection in cloze passages and error spotting.',
        boardExamWeightage: '1–2 marks in Section B Integrated Grammar',
        sampleQuestionPrompt: 'Fill in the blank with the appropriate preposition: "She succeeded ___ sheer dint of perseverance."',
        testingPattern: 'Multiple-choice blank selection in a non-fiction excerpt.',
        scopeBoundary: 'Tests standard formal prepositions of time, agency, and condition.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE Question 5(b) Prepositions',
        canonicalTerminology: 'Appropriate Prepositions & Phrasal Verbs',
        pedagogicalEmphasis: 'Rigorous 4-mark standalone question testing subtle collocations and phrasal particles without word bank.',
        boardExamWeightage: '4 marks (Mandatory standalone Question 5(b) in ICSE Class 10)',
        sampleQuestionPrompt: 'Fill in each blank with an appropriate preposition: (i) The fire was put ___ before much damage was done. (ii) The committee called ___ an explanation.',
        testingPattern: '4 discrete sentences with missing prepositions; no options provided.',
        scopeBoundary: 'Very high difficulty; deep library of 100+ phrasal verbs tested regularly.',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Checkpoint & IGCSE English',
        canonicalTerminology: 'Prepositional phrases and idiomatic collocations',
        pedagogicalEmphasis: 'Using prepositional phrases as fronted adverbials to create cohesive text progression.',
        boardExamWeightage: 'Assessed in Text Structure & Cohesion criterion',
        sampleQuestionPrompt: 'Improve the cohesion of the paragraph by varying the sentence openings with prepositional phrases.',
        testingPattern: 'Holistic assessment in creative and non-fiction composition.',
        scopeBoundary: 'Treated as cohesive stylistic devices rather than isolated blank drills.',
      },
    },
  },
  {
    id: 'concept-clauses',
    name: 'Clause Analysis & Synthesis (Noun, Relative, Adverbial)',
    strand: 'Complex Syntax & Clause Architecture',
    universalDefinition:
      'The syntactic anatomy of sentences into independent (main) and dependent (subordinate) clauses, and the synthesis of multiple simple sentences into compound and complex sentences.',
    universalRules: [
      'A clause contains both a subject and a finite predicate; a phrase does not.',
      'Noun Clauses perform syntactic roles of a noun (subject, direct object, complement, prepositional object).',
      'Relative (Adjective) Clauses qualify nouns/pronouns and are introduced by relative pronouns or adverbs.',
      'Restrictive (defining) relative clauses do NOT take commas; non-restrictive (extra info) MUST be surrounded by commas.',
      'Adverbial Clauses qualify verbs/adjectives/adverbs and express time, place, condition, concession, reason, or result.',
    ],
    commonPitfalls: [
      'Comma splices: joining two independent clauses with just a comma instead of a conjunction or semicolon.',
      'Misplacing relative clauses away from the noun they modify, creating hilarious ambiguities.',
      'Using "which" without commas in restrictive clauses in formal American style (though accepted in British).',
    ],
    progressionByStage: {
      'Class 3': { stage: 'none', outcome: 'Simple sentences with single verb.', depthNote: 'One thought per sentence.' },
      'Class 4': { stage: 'none', outcome: 'Joining sentences with "and", "but", "because".', depthNote: 'Compound sentences.' },
      'Class 5': { stage: 'I', outcome: 'Subject and predicate separation in compound sentences.', depthNote: 'Identifying full ideas.' },
      'Class 6': { stage: 'D', outcome: 'Main clause vs subordinate clause distinction.', depthNote: 'Dependent thought awareness.' },
      'Class 7': { stage: 'R', outcome: 'Relative clauses with who, which, that, whose, whom.', depthNote: 'Combining sentences.' },
      'Class 8': { stage: 'M', outcome: 'Classification into Noun, Adjective (Relative), and Adverbial Clauses.', depthNote: 'Full clause classification.' },
      'Class 9': { stage: 'M', outcome: 'Synthesis of sentences using participles, infinitives, and clauses.', depthNote: 'Syntactic economy.' },
      'Class 10': { stage: 'M', outcome: 'Transformation between simple, compound, and complex sentences.', depthNote: 'Compulsory exam skill.' },
      'Class 11': { stage: 'E', outcome: 'Subordination hierarchy, periodic sentences, and loose sentences.', depthNote: 'Rhetorical pacing.' },
      'Class 12': { stage: 'E', outcome: 'Syntactic rhythm, parenthetical clause intrusion, and rhetorical balance.', depthNote: 'Mastery level.' },
    },
    implementations: {
      CBSE: {
        systemId: 'CBSE',
        programmeName: 'CBSE Secondary Clauses (Noun, Adverb, Relative)',
        canonicalTerminology: 'Clauses (Noun, Adverbial, Relative)',
        pedagogicalEmphasis: 'Sentence reordering, dialogue completion, and joining sentences in narrative contexts.',
        boardExamWeightage: '1–2 marks in Section B Grammar',
        sampleQuestionPrompt: 'Combine the sentences into a complex sentence using a relative clause: "The scientist made the breakthrough. She received the prestigious award yesterday."',
        testingPattern: 'Sentence combination or clause identification.',
        scopeBoundary: 'Emphasizes clear relative pronoun usage and time/reason adverbial clauses.',
      },
      CISCE: {
        systemId: 'CISCE',
        programmeName: 'ICSE Question 5(c) & 5(d) Synthesis & Transformation',
        canonicalTerminology: 'Synthesis of Sentences & Clause Analysis',
        pedagogicalEmphasis: 'Compulsory 4-mark standalone Question 5(c): Join sentences without using "and", "but", or "so".',
        boardExamWeightage: '4 marks (Mandatory Question 5(c) in ICSE Class 10)',
        sampleQuestionPrompt: 'Join without using "and", "but", or "so": "The detective scrutinized the footprint. He concluded the intruder was left-handed."',
        testingPattern: '4 sentence pairs joined into a single coherent sentence without specified conjunctions.',
        scopeBoundary: 'Very rigorous; requires mastery of participles, absolute phrases, and subordinate clauses.',
      },
      Cambridge: {
        systemId: 'Cambridge',
        programmeName: 'Cambridge Lower Secondary & IGCSE Syntax',
        canonicalTerminology: 'Sentence variety, complex sentences, and relative clauses',
        pedagogicalEmphasis: 'Using varied sentence lengths (minor, simple, compound, multi-clause complex) to control reader empathy.',
        boardExamWeightage: 'Core criterion in Paper 1 and Paper 2 Writing marks',
        sampleQuestionPrompt: 'Analyze how the writer combines short simple sentences and multi-clause complex sentences to evoke tension.',
        testingPattern: 'Writer effect analysis and expressive narrative/discursive composition.',
        scopeBoundary: 'Treated as an expressive rhetorical paintbrush rather than a mechanical parsing exercise.',
      },
    },
  },
];

// ============================================================================
// 4. PRE-POPULATED BOOK EDITIONS (Preserving CBSE C6 & adding ICSE/Cambridge)
// ============================================================================

export function getInitialMultiBoardEditions(): Record<string, BookEdition> {
  return {
    'ed-cbse-c3': {
      id: 'ed-cbse-c3',
      systemId: 'CBSE',
      programmeId: 'cbse-main',
      stageId: 'stage-cbse-c3',
      stageLabel: 'Class 3',
      equivalentClass: 'Class 3',
      title: 'Veritas Step-by-Step English Grammar: Class 3',
      subtitle: 'Nouns, Naming Words, Capital Letters & Sentence Sense',
      editionCode: 'VER-CBSE-C3-2026',
      publicationStatus: 'Drafting',
      pedagogicalPhilosophy:
        'Foundational primary grammar introducing parts of speech, naming words (common and proper), doing words, and sentence building through visual, relatable examples.',
      boardSpecificGuidelines: [
        'Aligned with CBSE Primary English Language syllabus and NEP 2020 Foundational/Preparatory stage.',
        'Features concrete vocabulary, single-clause sentences, picture-based associations, and capitalization.',
        'Emphasizes common and proper nouns (naming words), verbs, and punctuation.',
      ],
      targetExamFormat: 'CBSE Primary Evaluation Standard',
      completenessScore: 90,
      lastModified: new Date().toISOString(),
      topics: [],
    },

    'ed-cbse-c6': {
      id: 'ed-cbse-c6',
      systemId: 'CBSE',
      programmeId: 'cbse-main',
      stageId: 'stage-cbse-c6',
      stageLabel: 'Class 6',
      equivalentClass: 'Class 6',
      title: 'Veritas Grammar in Action: CBSE Class 6',
      subtitle: 'Concord, Tenses, Prepositions & Applied Syntax',
      editionCode: 'VER-CBSE-C6-2026',
      publicationStatus: 'Published',
      pedagogicalPhilosophy:
        'Communicative grammar anchored in NEP 2020 experiential learning. Balances rigorous concord rules with real-world paragraph editing and relatable contextual examples.',
      boardSpecificGuidelines: [
        'Aligned with CBSE Middle School English Language syllabus.',
        'Features integrated error editing passages and dialogue completion.',
        'Emphasizes Subject-Verb Concord, Tenses, and Prepositions.',
      ],
      targetExamFormat: 'CBSE Mid-Term & Annual Examination Standard (Section B Grammar)',
      completenessScore: 92,
      lastModified: new Date().toISOString(),
      topics: [], // will be linked to existing Class 6 topics
    },

    'ed-cbse-c10': {
      id: 'ed-cbse-c10',
      systemId: 'CBSE',
      programmeId: 'cbse-main',
      stageId: 'stage-cbse-c10',
      stageLabel: 'Class 10',
      equivalentClass: 'Class 10',
      title: 'Veritas Board Master: CBSE Class 10',
      subtitle: 'Official 10-Mark Section B Grammar Blueprint & Exam Engine',
      editionCode: 'VER-CBSE-C10-2026',
      publicationStatus: 'In Review',
      pedagogicalPhilosophy:
        'Targeted board examination preparation focusing on the 5 prescribed pillars: Determiners, Tenses, Modals, Subject-Verb Concord, and Reported Speech.',
      boardSpecificGuidelines: [
        'Strict adherence to the 10-mark Section B question pattern.',
        'Dialogue reporting drills without auxiliary inversion errors.',
        'Timed error-correction passages reflecting latest sample papers.',
      ],
      targetExamFormat: 'CBSE Class 10 Board Examination Code 184 (10 Marks)',
      completenessScore: 84,
      lastModified: new Date().toISOString(),
      topics: [],
    },

    'ed-icse-c6': {
      id: 'ed-icse-c6',
      systemId: 'CISCE',
      programmeId: 'cisce-icse',
      stageId: 'stage-icse-c6',
      stageLabel: 'Class 6',
      equivalentClass: 'Class 6',
      title: 'Veritas Classical Grammar: ICSE Class 6',
      subtitle: 'Subject-Verb Agreement, Active-Passive Voice & Prepositional Accuracy',
      editionCode: 'VER-ICSE-C6-2026',
      publicationStatus: 'In Review',
      pedagogicalPhilosophy:
        'CISCE classical foundation emphasizing exact grammatical taxonomy, Latinate inflectional awareness, rigorous voice transformation, and rich vocabulary.',
      boardSpecificGuidelines: [
        'Adheres to CISCE Curriculum Guidelines for Middle School English Language.',
        'Emphasizes bidirectional active-passive transformation.',
        'Includes dedicated phrasal verb collocations and preposition lists.',
      ],
      targetExamFormat: 'ICSE Middle School Examination (Language Paper 1 Foundation)',
      completenessScore: 78,
      lastModified: new Date().toISOString(),
      topics: [
        {
          id: 'icse-c6-top-1',
          title: 'Subject-Verb Agreement (CISCE Standard)',
          category: 'Syntax & Concord',
          classLevel: 'Class 6',
          overview:
            'Mastering grammatical agreement between finite verbs and complex subjects, including intervening phrases, nouns plural in form, and collective nouns.',
          learningObjectives: [
            'Distinguish true grammatical subject from nouns in prepositional adjuncts',
            'Apply proximity rules with correlative conjunctions',
            'Handle singular collective nouns vs nouns of multitude',
          ],
          definitions: [
            {
              id: 'icse-c6-def-1',
              term: 'Subject-Verb Agreement',
              partOfSpeechOrCategory: 'Syntactic Concord',
              ageAppropriateExplanation:
                'A verb must agree with its grammatical subject in person and number. When the subject is singular, the verb is singular; when the subject is plural, the verb is plural.',
              formulaOrSyntax: 'Subject (Number, Person) ⟷ Finite Verb (Number, Person)',
              rules: [
                'Words introduced by "with", "together with", "as well as", "in addition to" do not affect the verb number.',
                'When two singular nouns refer to the same person or thing, the verb is singular.',
                'When two subjects are connected by "either... or" or "neither... nor", the verb agrees with the nearer subject.',
              ],
              examples: [
                {
                  sentence: 'The commander, with his brave officers, was decorated for valor.',
                  highlightWord: 'was',
                  note: 'Agrees with singular "commander", not plural "officers".',
                },
                {
                  sentence: 'Bread and butter is his staple breakfast.',
                  highlightWord: 'is',
                  note: 'Treated as a single unified dish.',
                },
              ],
              commonMistakes: [
                {
                  incorrect: 'Neither the magistrate nor the witnesses was convinced.',
                  correct: 'Neither the magistrate nor the witnesses were convinced.',
                  reason: 'The verb must agree with the nearer subject "witnesses" (plural).',
                },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### CISCE Subject-Verb Agreement Rules\n\n1. **Compound Subjects**:\n   - If two singular subjects express a single collective notion, the verb is singular.\n   - *Slow and steady **wins** the race.*\n   - *The horse and carriage **is** waiting at the gate.*\n\n2. **Proximity with Correlatives**:\n   - *Neither he nor his friends **are** to blame.*\n   - *Either your colleagues or you **are** mistaken.*`,
          exercises: [
            {
              id: 'icse-c6-ex-1',
              title: 'Exercise A: CISCE Concord Verification',
              instructions: 'Supply the correct form of the verb in brackets:',
              targetType: 'fill_in_blanks',
              maxMarks: 4,
              questions: [
                {
                  id: 'icse-c6-q-1',
                  type: 'fill_in_blanks',
                  prompt: 'Supply the correct verb form:',
                  blanksSentence: 'The poet and philosopher ___ (has / have) passed away.',
                  hints: 'has / have',
                  acceptableAnswers: ['has'],
                  correctAnswer: 'has',
                  difficulty: 'Medium',
                  marks: 1,
                  explanation: 'The single article "The" before poet indicates both nouns refer to the same individual.',
                },
              ],
            },
          ],
          testSeries: [],
        },
      ],
    },

    'ed-icse-c10': {
      id: 'ed-icse-c10',
      systemId: 'CISCE',
      programmeId: 'cisce-icse',
      stageId: 'stage-icse-c10',
      stageLabel: 'Class 10',
      equivalentClass: 'Class 10',
      title: 'Veritas ICSE English Language Master: Class 10',
      subtitle: 'Complete Question 5 Blueprint: Transformation, Prepositions & Synthesis',
      editionCode: 'VER-ICSE-C10-2026',
      publicationStatus: 'Pre-Press',
      pedagogicalPhilosophy:
        'Exhaustive preparation for ICSE English Language Paper 1 Question 5 (20 Marks total). Rigorous sentence transformation without changing meaning, standalone prepositions, and non-fiction synthesis.',
      boardSpecificGuidelines: [
        'Complete coverage of Question 5(a) Passage Verbs (4 marks).',
        'Complete coverage of Question 5(b) Appropriate Prepositions (4 marks).',
        'Complete coverage of Question 5(c) Sentence Synthesis without "and/but/so" (4 marks).',
        'Complete coverage of Question 5(d) Transformation of Sentences (8 marks).',
      ],
      targetExamFormat: 'ICSE Board Examination English Language Paper 1 (Question 5)',
      completenessScore: 95,
      lastModified: new Date().toISOString(),
      topics: [],
    },

    'ed-camb-s7': {
      id: 'ed-camb-s7',
      systemId: 'Cambridge',
      programmeId: 'cambridge-lower-sec',
      stageId: 'stage-camb-s7',
      stageLabel: 'Stage 7',
      equivalentClass: 'Class 6',
      title: 'Veritas Cambridge Lower Secondary English: Stage 7',
      subtitle: 'Functional Syntax, Stylistic Sentence Variety & Linguistic Enquiry',
      editionCode: 'VER-CAMB-S7-2026',
      publicationStatus: 'In Review',
      pedagogicalPhilosophy:
        'Cambridge enquiry-led methodology: students explore how syntactic structures shape reader empathy, tone, and pacing in authentic world literature and non-fiction.',
      boardSpecificGuidelines: [
        'Aligned with Cambridge Lower Secondary English Curriculum Framework 0861.',
        'Explores complex sentences as expressive tools rather than isolated rules.',
        'Develops fronted adverbials and cohesive linguistic markers.',
      ],
      targetExamFormat: 'Cambridge Lower Secondary Progression Test & Checkpoint Foundations',
      completenessScore: 82,
      lastModified: new Date().toISOString(),
      topics: [
        {
          id: 'camb-s7-top-1',
          title: 'Stylistic Sentence Variety & Complex Noun Phrases',
          category: 'Functional Syntax',
          classLevel: 'Class 6',
          overview:
            'Investigating how writers deliberately manipulate sentence length, complex noun phrases, and subordinate clauses to influence reader engagement.',
          learningObjectives: [
            'Analyze the rhetorical effect of short minor sentences alongside multi-clause complex sentences',
            'Construct expanded noun phrases with pre-modifiers and post-modifying prepositional phrases',
            'Use fronted adverbials punctuated with commas to direct reader attention',
          ],
          definitions: [
            {
              id: 'camb-s7-def-1',
              term: 'Expanded Noun Phrase',
              partOfSpeechOrCategory: 'Syntactic Structure',
              ageAppropriateExplanation:
                'A noun phrase expanded with descriptive adjectives before the head noun, and prepositional phrases or relative clauses after it, providing rich detail concisely.',
              formulaOrSyntax: '[Determiner] + [Pre-modifying Adjectives] + HEAD NOUN + [Post-modifying Phrase/Clause]',
              rules: [
                'Pre-modifiers typically follow Royal Order of Adjectives (Opinion, Size, Age, Shape, Color, Origin, Material).',
                'Post-modifying prepositional phrases answer "which one" or "what kind".',
                'Avoid overloading: more than three adjectives can clutter reader focus.',
              ],
              examples: [
                {
                  sentence: 'The ancient stone lighthouse on the jagged cliff guided the storm-tossed vessel.',
                  highlightWord: 'The ancient stone lighthouse on the jagged cliff',
                  note: 'Expanded noun phrase functioning as the subject.',
                },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Cambridge Linguistic Enquiry: Sentence Rhythm\n\nNotice how sentence rhythm changes pacing:\n- *Darkness fell.* (Short, dramatic)\n- *As the storm battered the coast, the solitary keeper climbed the winding iron staircase.* (Complex, visual)\n\nWriters never rely on a single sentence type!`,
          exercises: [],
          testSeries: [],
        },
      ],
    },

    'ed-camb-s9': {
      id: 'ed-camb-s9',
      systemId: 'Cambridge',
      programmeId: 'cambridge-lower-sec',
      stageId: 'stage-camb-s9',
      stageLabel: 'Stage 9 (Checkpoint)',
      equivalentClass: 'Class 8',
      title: 'Veritas Cambridge Checkpoint English: Stage 9',
      subtitle: 'Rhetorical Syntax, Analytical Writing & Checkpoint Mastery',
      editionCode: 'VER-CAMB-S9-2026',
      publicationStatus: 'Drafting',
      pedagogicalPhilosophy:
        'Prepares learners for the Cambridge Checkpoint Stage 9 examination. Focuses on writer craft analysis, non-finite clauses, modal hedging, and communicative synthesis.',
      boardSpecificGuidelines: [
        'Cambridge Checkpoint 0861 official framework alignment.',
        'High focus on "comment on the effect of language" questions.',
        'Synthesis of multiple perspectives in formal argumentation.',
      ],
      targetExamFormat: 'Cambridge Lower Secondary Checkpoint Examination Paper 1 & Paper 2',
      completenessScore: 70,
      lastModified: new Date().toISOString(),
      topics: [],
    },

    'ed-camb-y10': {
      id: 'ed-camb-y10',
      systemId: 'Cambridge',
      programmeId: 'cambridge-igcse',
      stageId: 'stage-camb-y10',
      stageLabel: 'IGCSE Year 10',
      equivalentClass: 'Class 9',
      title: 'Veritas Cambridge IGCSE English Language: Year 10',
      subtitle: 'Critical Reading, Directed Writing & Stylistic Mechanics',
      editionCode: 'VER-CAMB-IGCSE-2026',
      publicationStatus: 'Drafting',
      pedagogicalPhilosophy:
        'IGCSE First Language English 0500 foundation. Focuses on directed writing, summary techniques, stylistic transformation, and precise rhetorical tone.',
      boardSpecificGuidelines: [
        'Aligned with Cambridge IGCSE 0500 / 0510 specifications.',
        'Training in concise synthesis without verbatim lifting.',
        'Controlled sentence structures for formal persuasive writing.',
      ],
      targetExamFormat: 'Cambridge IGCSE Examination (Paper 1 Reading & Paper 2 Directed Writing)',
      completenessScore: 65,
      lastModified: new Date().toISOString(),
      topics: [],
    },
  };
}

// ============================================================================
// 5. INTELLIGENT AUDIT ENGINE: DUPLICATION & CURRICULUM GAP DETECTION
// ============================================================================

export function detectDuplications(editions: Record<string, BookEdition>): QualityAuditAlert[] {
  const alerts: QualityAuditAlert[] = [];
  const definitionTermsMap = new Map<string, Array<{ editionId: string; editionLabel: string; term: string }>>();
  const exercisePromptsMap = new Map<string, Array<{ editionId: string; editionLabel: string; prompt: string }>>();

  Object.values(editions).forEach((edition) => {
    edition.topics.forEach((topic) => {
      topic.definitions.forEach((def) => {
        const cleanTerm = def.term.trim().toLowerCase();
        if (!definitionTermsMap.has(cleanTerm)) {
          definitionTermsMap.set(cleanTerm, []);
        }
        definitionTermsMap.get(cleanTerm)!.push({
          editionId: edition.id,
          editionLabel: `${edition.stageLabel} (${edition.systemId})`,
          term: def.term,
        });
      });

      topic.exercises.forEach((ex) => {
        ex.questions.forEach((q) => {
          const cleanPrompt = q.prompt.trim().toLowerCase();
          if (cleanPrompt.length > 15) {
            if (!exercisePromptsMap.has(cleanPrompt)) {
              exercisePromptsMap.set(cleanPrompt, []);
            }
            exercisePromptsMap.get(cleanPrompt)!.push({
              editionId: edition.id,
              editionLabel: `${edition.stageLabel} (${edition.systemId})`,
              prompt: q.prompt,
            });
          }
        });
      });
    });
  });

  // Flag duplicate definition terms across differing editions if unadapted
  definitionTermsMap.forEach((occurrences, term) => {
    if (occurrences.length > 1) {
      const distinctEditions = Array.from(new Set(occurrences.map((o) => o.editionLabel)));
      if (distinctEditions.length > 1) {
        alerts.push({
          id: `dup-def-${term.replace(/[^a-z0-9]/g, '-')}`,
          type: 'duplication',
          severity: 'info',
          editionId: occurrences[0].editionId,
          editionLabel: distinctEditions.join(', '),
          title: `Shared Definition Across Editions: "${occurrences[0].term}"`,
          description: `The definition for "${occurrences[0].term}" appears in multiple editions (${distinctEditions.join(', ')}). Ensure board-specific nuances (e.g. CBSE concord vs ICSE agreement) are accurately reflected.`,
          recommendation: 'Verify that each edition customizes the pedagogical depth and board-mandated terminology rather than copying raw text.',
        });
      }
    }
  });

  return alerts;
}

export function detectCurriculumGaps(
  editions: Record<string, BookEdition>,
  masterConcepts: MasterGrammarConcept[]
): QualityAuditAlert[] {
  const alerts: QualityAuditAlert[] = [];

  // 1. Check for missing ICSE Question 5 critical competencies in ICSE Class 10
  const icse10 = editions['ed-icse-c10'];
  if (icse10 && icse10.topics.length === 0) {
    alerts.push({
      id: 'gap-icse-10-topics',
      type: 'gap',
      severity: 'warning',
      editionId: icse10.id,
      editionLabel: 'Class 10 (CISCE / ICSE)',
      title: 'Missing ICSE Question 5 Core Modules',
      description:
        'ICSE Class 10 English Language Paper 1 requires dedicated preparation for Sentence Transformation (Question 5d) and Prepositions (Question 5b). Currently, no dedicated units are published.',
      recommendation:
        'Generate or populate the ICSE Class 10 edition with the Question 5 Master Blueprint units.',
    });
  }

  // 2. Check for Cambridge Stage 7 enquiry-based units
  const cambS7 = editions['ed-camb-s7'];
  if (cambS7) {
    const hasRelativeClauses = cambS7.topics.some((t) =>
      t.title.toLowerCase().includes('relative') || t.overview.toLowerCase().includes('relative')
    );
    if (!hasRelativeClauses) {
      alerts.push({
        id: 'gap-camb-s7-relative',
        type: 'gap',
        severity: 'info',
        editionId: cambS7.id,
        editionLabel: 'Stage 7 (Cambridge Lower Secondary)',
        title: 'Recommended Topic: Relative Clauses & Embedded Subordination',
        description:
          'Cambridge Lower Secondary Framework (0861 Stage 7) emphasizes early mastery of non-restrictive relative clauses and embedded subordination for stylistic range.',
        recommendation:
          'Add a focused unit on "Relative Clauses & Embedded Information" to align with Cambridge Lower Secondary progression.',
      });
    }
  }

  // 3. Check for CBSE Class 6 concord alignment
  const cbse6 = editions['ed-cbse-c6'];
  if (cbse6 && cbse6.topics.length > 0) {
    const hasConcord = cbse6.topics.some((t) => t.title.toLowerCase().includes('agreement') || t.title.toLowerCase().includes('concord'));
    if (!hasConcord) {
      alerts.push({
        id: 'gap-cbse-c6-concord',
        type: 'gap',
        severity: 'critical',
        editionId: cbse6.id,
        editionLabel: 'Class 6 (CBSE)',
        title: 'Core Syllabus Gap: Subject-Verb Concord Missing',
        description: 'Subject-Verb Concord is the mandatory pillar of CBSE Middle School English Grammar.',
        recommendation: 'Restore or import the Subject-Verb Concord unit into CBSE Class 6.',
      });
    }
  }

  return alerts;
}
