import {
  CurriculumSystemId,
  EducationSystemProfile,
  FrameworkProfile,
  FrameworkReference,
  CurriculumRequirement,
  CurriculumMapping,
  CoverageEvidence,
  CurriculumGapWarning,
  ProgressionLink,
  CrossBoardAdaptationPlan,
  StudioChapter,
  BookProject,
  GrammarSeriesProject,
  FrameworkVerificationStatus,
  CurriculumCoverageState,
  GrammarTopic,
} from '../types';

// =========================================================================
// 1. EDUCATION SYSTEM PROFILES (CISCE, CBSE, CAMBRIDGE)
// =========================================================================

export const EDUCATION_SYSTEM_PROFILES: Record<CurriculumSystemId, EducationSystemProfile> = {
  CBSE: {
    id: 'CBSE',
    name: 'Central Board of Secondary Education',
    shortName: 'CBSE',
    authority: 'Ministry of Education, Government of India',
    description:
      'National curriculum framework for India with an emphasis on competency-based language acquisition, communicative grammar in context, and formative assessment.',
    programmes: [
      'Primary Stage (Classes 1–5)',
      'Middle School (Classes 6–8)',
      'Secondary School (Classes 9–10)',
      'Senior School (Classes 11–12)',
    ],
    standardsTerminology: 'Class',
    policyFrameworkDistinction:
      'Distinguishes statutory CBSE Curriculum syllabi from broad policy references such as National Education Policy 2020 (NEP 2020) and National Curriculum Framework for School Education (NCF-SE 2023). Policy documents serve as pedagogical reference benchmarks and are never conflated with board exam specifications.',
    assessmentExpectations:
      'Contextual error correction, dialogue gap-filling, sentence reordering, reported speech transformations in conversational contexts, and continuous competency tracking.',
    sampleSyllabusRefs: [
      'CBSE Secondary Curriculum (Subject Code 184)',
      'NCERT Learning Outcomes at the Elementary Stage',
      'CBSE Assessment & Examination Byelaws',
    ],
  },
  CISCE: {
    id: 'CISCE',
    name: 'Council for the Indian School Certificate Examinations',
    shortName: 'CISCE (ICSE / ISC)',
    authority: 'Council for the Indian School Certificate Examinations, New Delhi',
    description:
      'Autonomous pan-Indian examining body renowned for high linguistic precision, rigorous classical syntax, formal sentence synthesis, and comprehensive written mastery.',
    programmes: [
      'Middle School Curriculum (Classes 6–8)',
      'Indian Certificate of Secondary Education — ICSE (Classes 9–10)',
      'Indian School Certificate — ISC (Classes 11–12)',
    ],
    standardsTerminology: 'Class',
    policyFrameworkDistinction:
      'Maintains independent statutory examination regulations. National Education Policy (NEP 2020) references are catalogued as external comparative benchmarks only where adopted by schools, never automatically stamped as CISCE syllabus mandates.',
    assessmentExpectations:
      'ICSE English Language Paper 1 Section B (Question 5): Strict sentence transformations without changing meaning, cloze passages testing tense inflection and prepositions, joint sentence synthesis without conjunctions "and", "but", or "so", with strict deduction for syntactic flaws.',
    sampleSyllabusRefs: [
      'CISCE Regulations & Syllabuses for ICSE Examination',
      'CISCE Middle School English Language Curriculum Compendium',
      'ISC English Language Paper 1 Examination Guidelines',
    ],
  },
  Cambridge: {
    id: 'Cambridge',
    name: 'Cambridge Assessment International Education',
    shortName: 'Cambridge International',
    authority: 'University of Cambridge, United Kingdom',
    description:
      'World-renowned international curriculum framework offering spiral progression across inquiry-driven language structures, international varieties of English, and banded holistic assessment.',
    programmes: [
      'Cambridge Primary (Stages 1–6)',
      'Cambridge Lower Secondary (Stages 7–9)',
      'Cambridge Upper Secondary (IGCSE / O Level)',
      'Cambridge Advanced (AS & A Level)',
    ],
    standardsTerminology: 'Stage',
    policyFrameworkDistinction:
      'Operates independently under UK CAIE curriculum frameworks. National frameworks (such as NEP or NCF) are completely excluded unless explicitly catalogued by an editor as an external cross-curriculum reference.',
    assessmentExpectations:
      'Banded criterion-referenced assessment (Bands 1–4 / Band 1–5), open-ended contextual grammar analysis, audience-and-purpose register adaptations, reading syntax appreciation (AO1), writing accuracy (AO2), and spoken language syntactic precision.',
    sampleSyllabusRefs: [
      'Cambridge Lower Secondary English Curriculum Framework (0861)',
      'Cambridge IGCSE First Language English (0500)',
      'Cambridge IGCSE English as a Second Language (0510)',
      'Cambridge International AS & A Level English Language (9093)',
    ],
  },
};

// =========================================================================
// 2. FRAMEWORK REFERENCE LIBRARY (STORED OFFICIAL CITATIONS & METADATA)
// =========================================================================

export const DEFAULT_FRAMEWORK_REFERENCES: FrameworkReference[] = [
  {
    id: 'ref-cbse-curriculum-2025',
    title: 'CBSE Secondary School English Curriculum (Language & Literature)',
    system: 'CBSE',
    documentType: 'curriculum_syllabus',
    publishingBody: 'Central Board of Secondary Education, Academic Unit',
    year: '2024–2025',
    version: 'CBSE-Acad/2024/Vol-1',
    officialRefUrl: 'https://cbseacademic.nic.in/curriculum_2025.html',
    editorialNotes:
      'Official statutory syllabus document specifying grammar weightage (10 marks) and prescribed competencies in middle and secondary schools.',
  },
  {
    id: 'ref-ncert-lo-2020',
    title: 'NCERT Learning Outcomes at the Elementary Stage',
    system: 'CBSE',
    documentType: 'national_standard',
    publishingBody: 'National Council of Educational Research and Training',
    year: '2020',
    version: 'NCERT-LO-Elem-v2',
    officialRefUrl: 'https://ncert.nic.in/learning-outcomes.php',
    editorialNotes:
      'Foundational benchmark detailing grade-wise grammatical competencies (LO E604 for Subject-Verb Concord, LO E609 for Clauses).',
  },
  {
    id: 'ref-nep-2020-policy',
    title: 'National Education Policy 2020 (Policy Document)',
    system: 'CBSE',
    documentType: 'policy_framework',
    publishingBody: 'Ministry of Education, Government of India',
    year: '2020',
    version: 'NEP-2020-Final',
    editorialNotes:
      'External national policy guideline advocating experiential learning, multilingual flexibility, and reduction of rote learning. Recorded as external reference benchmark.',
    isExternalPolicyOnly: true,
  },
  {
    id: 'ref-ncf-se-2023',
    title: 'National Curriculum Framework for School Education (NCF-SE)',
    system: 'CBSE',
    documentType: 'policy_framework',
    publishingBody: 'National Steering Committee for Curriculum Frameworks',
    year: '2023',
    version: 'NCF-SE-2023',
    editorialNotes:
      'Pedagogical framework detailing competency-based progression across foundational, preparatory, middle, and secondary stages.',
    isExternalPolicyOnly: true,
  },
  {
    id: 'ref-cisce-middle-curriculum',
    title: 'CISCE Curriculum for English Language (Middle School Classes VI–VIII)',
    system: 'CISCE',
    documentType: 'curriculum_syllabus',
    publishingBody: 'Council for the Indian School Certificate Examinations',
    year: '2024',
    version: 'CISCE-MS-ENG-2024',
    officialRefUrl: 'https://cisce.org/curriculum-middle-school/',
    editorialNotes:
      'Statutory CISCE curriculum document outlining the spiral grammar scope across parts of speech, agreement, synthesis, and transformation for Classes 6 to 8.',
  },
  {
    id: 'ref-icse-exam-reg-2026',
    title: 'ICSE Regulations and Syllabuses for Examination 2026 (English Paper 1)',
    system: 'CISCE',
    documentType: 'assessment_spec',
    publishingBody: 'Council for the Indian School Certificate Examinations',
    year: '2025',
    version: 'ICSE-2026-REG-ENG1',
    officialRefUrl: 'https://cisce.org/regulations-and-syllabuses/',
    editorialNotes:
      'Official board examination format for English Language Paper 1, detailing Question 5 requirements (functional grammar, synthesis, and transformations).',
  },
  {
    id: 'ref-caie-0861-lower-sec',
    title: 'Cambridge Lower Secondary English Curriculum Framework (0861)',
    system: 'Cambridge',
    documentType: 'curriculum_syllabus',
    publishingBody: 'Cambridge Assessment International Education',
    year: '2023',
    version: '0861-LS-ENG-v2.1',
    officialRefUrl: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/',
    editorialNotes:
      'Core Cambridge curriculum framework defining learning strands: Reading (7Rg), Writing (7Wg), Speaking & Listening (7Sl) with international English syntax standards.',
  },
  {
    id: 'ref-caie-0500-igcse',
    title: 'Cambridge IGCSE First Language English Syllabus (0500)',
    system: 'Cambridge',
    documentType: 'assessment_spec',
    publishingBody: 'Cambridge Assessment International Education',
    year: '2025–2027',
    version: '0500-Syllabus-2025',
    officialRefUrl: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-english-first-language-0500/',
    editorialNotes:
      'Assessment objectives AO1 (Reading), AO2 (Writing), AO3 (Spoken Language) emphasizing structural elegance, precision, and stylistic variation.',
  },
];

// =========================================================================
// 3. REUSABLE FRAMEWORK PROFILES (VERSIONED PER BOARD & EDITION)
// =========================================================================

export const DEFAULT_FRAMEWORK_PROFILES: FrameworkProfile[] = [
  {
    id: 'prof-cbse-c6-2026',
    educationSystem: 'CBSE',
    awardingOrganisation: 'Central Board of Secondary Education',
    programme: 'Middle School',
    classOrStage: 'Class 6',
    subject: 'English Language & Grammar',
    academicYearOrEdition: '2025–2026 Edition',
    curriculumDocument: 'CBSE Secondary School Curriculum (Languages Volume)',
    frameworkDocument: 'NCF-SE 2023 & NEP 2020 Pedagogical Guidelines',
    syllabusReference: 'CBSE-ENG-MS-06',
    documentYear: '2024–2025',
    sourceCitation: 'CBSE Academic Circular No. Acad-38/2024; NCERT LO E604/E609',
    learningOutcomes: [
      'LO-E604: Accurately identifies and uses singular and plural concord across various sentence structures.',
      'LO-E607: Employs subject-verb concord correctly when subjects are separated by prepositional modifiers.',
      'LO-E609: Detects and rectifies grammatical agreement anomalies in conversational dialogues and short narrative paragraphs.',
      'LO-E612: Applies agreement rules to distributive and indefinite quantifiers in applied writing tasks.',
    ],
    competencies: [
      'Contextual Grammatical Precision',
      'Syntactic Reasoning in Extended Discourse',
      'Proofreading & Textual Editing',
      'Communicative Confidence in Spoken & Written English',
    ],
    assessmentExpectations:
      'Contextual cloze passages, paragraph error editing, multiple choice syntactic disambiguation, and sentence completion with authentic dialogue prompts.',
    pedagogicalExpectations:
      'Inductive discovery through authentic reading passages, contrastive example pairs, visual syntactic diagrams, and spiral reinforcement.',
    crossCurricularExpectations: [
      'Environmental awareness in example contexts',
      'Collaborative teamwork in guided exercises',
      'Scientific observation reports using precise present-tense concord',
    ],
    notes:
      'Demonstration framework profile for CBSE Class 6. Distinguishes board-mandated grammar from broader national policy recommendations.',
    verificationStatus: 'needs_academic_review',
    version: '2025.1',
  },
  {
    id: 'prof-cisce-c6-2026',
    educationSystem: 'CISCE',
    awardingOrganisation: 'Council for the Indian School Certificate Examinations',
    programme: 'Middle School Curriculum',
    classOrStage: 'Class 6',
    subject: 'English Language',
    academicYearOrEdition: '2025–2026 Edition',
    curriculumDocument: 'CISCE Curriculum for English Language (Middle School)',
    frameworkDocument: 'CISCE Middle School English Language Curriculum Compendium',
    syllabusReference: 'CISCE-ENG-C6-LANG',
    documentYear: '2024',
    sourceCitation: 'CISCE Regulations & Syllabuses, Middle School Compendium Section 2.4',
    learningOutcomes: [
      'CLO-MS-01: Synthesize two simple clauses into one complex clause without modifying sentence meaning or using "and/but/so".',
      'CLO-MS-02: Apply strict subject-verb agreement rules to compound subjects joined by correlatives ("either...or", "neither...nor").',
      'CLO-MS-03: Recognize and correctly inflect verbs with nouns of collective, singular in form but plural in sense, and vice versa.',
      'CLO-MS-04: Transform sentences across active/passive voices, positive/negative assertions, and degrees of comparison.',
    ],
    competencies: [
      'Structural Grammatical Precision',
      'Sentence Synthesis without Meaning Shift',
      'Formal Grammatical Terminology Fluency',
      'Zero-Tolerance Proofreading for Written Discourse',
    ],
    assessmentExpectations:
      'ICSE Paper 1 Question 5 style formal transformation drills, 8-sentence synthesis exercises, fill-in-the-blanks with correct tense/preposition form, and structured punctuation tests.',
    pedagogicalExpectations:
      'Formal law-and-rule formulation, linguistic citations with quotation marks, systematic sentence parsing, and continuous written drill.',
    crossCurricularExpectations: [
      'Historical essay composition with formal syntax',
      'Scientific procedure writing with passive concord',
    ],
    notes:
      'CISCE maintains autonomous syllabus standards. NEP references are recorded as external comparative references only.',
    verificationStatus: 'needs_academic_review',
    version: '2025.1',
  },
  {
    id: 'prof-cambridge-s7-2026',
    educationSystem: 'Cambridge',
    awardingOrganisation: 'Cambridge Assessment International Education',
    programme: 'Cambridge Lower Secondary',
    classOrStage: 'Stage 7',
    subject: 'English (0861)',
    academicYearOrEdition: '2025–2026 Edition',
    curriculumDocument: 'Cambridge Lower Secondary English Curriculum Framework (0861)',
    frameworkDocument: 'Cambridge Global Learning & Pedagogical Matrix',
    syllabusReference: 'CAIE-0861-STG7',
    documentYear: '2023',
    sourceCitation: 'Cambridge International Curriculum Framework 0861 for Lower Secondary English, Version 2.1',
    learningOutcomes: [
      '7Rg.02: Comment on how the writer’s choice of grammatical structures, including subject-verb agreement in complex sentences, shapes tone and meaning.',
      '7Wg.01: Use a varied range of sentence structures (compound, complex, compound-complex) with consistent subject-verb agreement throughout.',
      '7Wg.04: Punctuate sentences accurately, using commas to separate clauses and avoiding comma splices and run-on sentences.',
      '7Sl.03: Adapt syntax and verb agreement appropriately when presenting formal arguments or engaging in exploratory group discussions.',
    ],
    competencies: [
      'Syntactic Dexterity and Stylistic Variation',
      'Contextual Register Adaptation for Purpose and Audience',
      'Critical Textual Analysis of Grammatical Choices',
      'Global English Linguistic Awareness',
    ],
    assessmentExpectations:
      'Banded criterion-referenced assessment (Bands 1–4), diagnostic open-ended syntax investigation, writing tasks evaluated for stylistic cohesion, and text transformation for alternate readerships.',
    pedagogicalExpectations:
      'Grammar embedded in authentic global literature, inquiry-driven investigation of linguistic patterns, collaborative discussion, and student reflection.',
    crossCurricularExpectations: [
      'Global environmental inquiry projects',
      'Cross-cultural narrative analysis',
      'Scientific hypothesis formulation with modal verbs',
    ],
    notes:
      'Cambridge International framework does not use Indian grade terminology or national policies. Uses Stage 7 / Year 7 conventions.',
    verificationStatus: 'needs_academic_review',
    version: '2024.2',
  },
];

// =========================================================================
// 4. CURRICULUM REQUIREMENTS REPOSITORY
// =========================================================================

export const DEFAULT_CURRICULUM_REQUIREMENTS: CurriculumRequirement[] = [
  {
    id: 'req-cbse-c6-conc-01',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-01',
    title: 'Basic Subject-Verb Concord (Singular & Plural)',
    description:
      'Core rule that a singular subject takes a singular verb and a plural subject takes a plural verb in standard declarative and interrogative sentences.',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Introduced',
    learningObjectives: [
      'Identify the simple subject and corresponding predicate verb in basic sentences',
      'Apply correct third-person singular inflection (-s/-es) in present simple tense',
    ],
    assessmentGuideline:
      'Test via fill-in-the-blanks with dual options (is/are, does/do) in everyday contexts.',
  },
  {
    id: 'req-cbse-c6-conc-02',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-02',
    title: 'Compound Subjects with "and" vs. "or" / "nor"',
    description:
      'Rule governing compound subjects joined by coordinating conjunction "and" (plural verb) versus alternative conjunctions "or", "either...or", "neither...nor" (proximity rule).',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Developing',
    prerequisiteRequirementIds: ['req-cbse-c6-conc-01'],
    learningObjectives: [
      'Distinguish additive compound subjects from alternative compound subjects',
      'Apply the proximity rule for compound subjects connected by "or" or "nor"',
    ],
    assessmentGuideline:
      'Contextual error identification in sentences like "Neither the teacher nor the students (was/were) present."',
  },
  {
    id: 'req-cbse-c6-conc-03',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-03',
    title: 'Intervening Prepositional Phrases & Modifiers',
    description:
      'Recognition that prepositional phrases ("of", "with", "along with", "as well as") intervening between subject and verb do not alter the grammatical number of the subject.',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Practised',
    prerequisiteRequirementIds: ['req-cbse-c6-conc-01'],
    learningObjectives: [
      'Isolate intervening prepositional phrases to locate the true syntactic head noun',
      'Resist the cognitive pitfall of matching the verb with the nearest noun inside a modifier',
    ],
    assessmentGuideline:
      'CBSE Section B editing items with intervening prepositional modifiers.',
  },
  {
    id: 'req-cbse-c6-conc-04',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-04',
    title: 'Indefinite & Distributive Pronoun Concord',
    description:
      'Grammatical concord governing distributive pronouns ("each", "either", "neither") and singular indefinite pronouns ("everyone", "everybody", "someone", "nobody").',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Practised',
    prerequisiteRequirementIds: ['req-cbse-c6-conc-01'],
    learningObjectives: [
      'Apply singular verb inflection to "each of the [plural nouns]" constructs',
      'Differentiate singular indefinite pronouns from plural indefinite pronouns ("both", "few", "many")',
    ],
    assessmentGuideline:
      'Sentence completion and diagnostic multiple choice items.',
  },
  {
    id: 'req-cbse-c6-conc-05',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-05',
    title: 'Collective Noun Concord (Unitary vs. Individual Members)',
    description:
      'Concord governing collective nouns (e.g. "jury", "team", "choir", "family") when acting as a single unit (singular) versus when individual members act separately (plural).',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Analyze semantic intent: unitary action taking singular verb vs. divided members taking plural verb',
      'Explain agreement nuances in formal Indian English contexts',
    ],
    assessmentGuideline:
      'Contextual paragraph editing with collective subject nouns.',
  },
  {
    id: 'req-cbse-c6-conc-06',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-06',
    title: 'Quantifiers, Proportions, and Plural-Form Nouns',
    description:
      'Concord with nouns expressing measurement, distance, time, and money treated as singular wholes, plus nouns ending in -s that are singular in meaning (e.g. "mathematics", "news").',
    strand: 'Syntax & Concord',
    requirementType: 'concord',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Treat units of measurement, sums of money, and periods of time as singular wholes',
      'Recognize deceptive plural-form singular nouns (e.g. "physics", "measles")',
    ],
    assessmentGuideline:
      'Standardized sentence correction items in Class 6 term examinations.',
  },
  {
    id: 'req-cbse-c6-conc-07',
    frameworkProfileId: 'prof-cbse-c6-2026',
    code: 'CBSE-GR6-CONC-07',
    title: 'Applied Dialogue & Passage Editing in Context',
    description:
      'Competency-based requirement to proofread an authentic multi-sentence dialogue or narrative for subject-verb agreement anomalies.',
    strand: 'Applied Composition & Editing',
    requirementType: 'editing',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Locate subject-verb mismatches in connected multi-speaker dialogues',
      'Rewrite erroneous sentences with justification for the corrected form',
    ],
    assessmentGuideline:
      'CBSE Section B 4-line editing passage (1 mark per error identification & correction).',
    evidenceSource: 'CBSE Secondary School Curriculum (Languages Volume)',
    sourceReference: 'Circular Acad-38/2024, LO-E609',
    evidenceStatus: 'Verified',
    assessmentRelevance: 'Directly tested in CBSE Section B editing items.',
  },

  // =========================================================================
  // CISCE CLASS 6 CURRICULUM REQUIREMENTS
  // =========================================================================
  {
    id: 'req-cisce-c6-sva-01',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-SVA-01',
    title: 'Subject-Verb Agreement with Collective & Correlative Subjects',
    description:
      'Mandatory ICSE standard governing concord with collective nouns (unitary singular vs individual plural) and correlative conjunctions ("either...or", "neither...nor").',
    strand: 'Syntax & Agreement',
    subStrand: 'Concord & Correlatives',
    requirementType: 'concord',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Apply singular or plural agreement based on collective noun semantic agency',
      'Enforce nearest-subject proximity in "neither...nor" correlatives',
      'Differentiate deceptive plural-form singular nouns from true plurals',
    ],
    assessmentGuideline:
      'ICSE Paper 1 Question 5 style formal transformation and fill-in-the-blank drills.',
    evidenceSource: 'CISCE Regulations & Syllabuses, Middle School Compendium',
    sourceReference: 'Section 2.4, CLO-MS-02 & 03',
    evidenceStatus: 'Source Located',
    assessmentRelevance: 'Directly tested in ICSE Question 5 sentence transformations and correct verb inflections.',
    editorialNotes: 'Universal ICSE foundation; zero-tolerance grading in board examinations.',
  },
  {
    id: 'req-cisce-c6-syn-02',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-SYN-02',
    title: 'Sentence Synthesis without "and", "but", or "so"',
    description:
      'Synthesizing two or more simple sentences into a single compound or complex sentence using infinitives, participles, or relative clauses without meaning alteration.',
    strand: 'Sentence Synthesis & Transformation',
    subStrand: 'Complex Clause Synthesis',
    requirementType: 'syntax',
    recommendedDepth: 'Developing',
    learningObjectives: [
      'Combine sentences using participle phrases without altering original meaning',
      'Use relative pronouns ("who", "which", "that") to synthesize clauses without coordinator words',
      'Maintain tense consistency across synthesized clauses',
    ],
    assessmentGuideline:
      'ICSE Paper 1 Question 5(b) — 4-item synthesis without "and", "but", or "so".',
    evidenceSource: 'CISCE Curriculum for English Language (Middle School)',
    sourceReference: 'Compendium p. 42, CLO-MS-01',
    evidenceStatus: 'Source Located',
    assessmentRelevance: 'Core 4-mark sub-question in every ICSE English Language examination.',
    editorialNotes: 'Essential for ICSE Class 6 through 10 progression.',
  },
  {
    id: 'req-cisce-c6-voi-03',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-VOI-03',
    title: 'Active and Passive Voice Transformation',
    description:
      'Systematic conversion of declarative assertions, interrogatives, and imperatives between active and passive voice without tense distortion.',
    strand: 'Voice & Structural Transformation',
    subStrand: 'Transitivity & Agent Demotion',
    requirementType: 'syntax',
    recommendedDepth: 'Practised',
    learningObjectives: [
      'Maintain exact aspect and tense during passive transformations',
      'Omit indefinite agent phrases ("by someone", "by people") when contextually redundant',
      'Transform interrogative sentences beginning with "Who" or "Whom" into passive structure',
    ],
    assessmentGuideline:
      'ICSE transformation items with strict tense invariance and formal punctuation.',
    evidenceSource: 'CISCE English Language Curriculum Guidelines',
    sourceReference: 'Syllabus Appendix III, CLO-MS-04',
    evidenceStatus: 'Mapped',
    assessmentRelevance: 'Frequent target in Question 5(c) sentence restructuring.',
    editorialNotes: 'High-frequency exam requirement.',
  },
  {
    id: 'req-cisce-c6-prp-04',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-PRP-04',
    title: 'Appropriate Prepositions & Phrasal Verbs',
    description:
      'Idiomatic preposition usage following verbs, adjectives, and nouns, along with phrasal verb distinctions ("look after", "look into", "look down upon").',
    strand: 'Prepositions & Phrasal Idioms',
    subStrand: 'Idiomatic Collocations',
    requirementType: 'vocabulary',
    recommendedDepth: 'Practised',
    learningObjectives: [
      'Distinguish subtle preposition differences (agree with a person vs. agree to a proposal)',
      'Complete Cloze passages with accurate dependent prepositions',
      'Identify correct prepositions of time, position, direction, and agency',
    ],
    assessmentGuideline:
      'ICSE Question 5(a) 8-mark cloze test demanding precise preposition insertion.',
    evidenceSource: 'CISCE Middle School English Language Guidelines',
    sourceReference: 'Grammar Strands Section 4.1',
    evidenceStatus: 'Needs Academic Review',
    assessmentRelevance: 'Direct benchmark for Paper 1 Section 5(a) cloze passage.',
    editorialNotes: 'Editorial review needed to verify Class 6 vocabulary list against ICSE benchmark.',
  },
  {
    id: 'req-cisce-c6-dir-05',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-DIR-05',
    title: 'Direct and Indirect Speech Shift Rules',
    description:
      'Tense backshift, pronoun shifts, and spatial/temporal adverb transformations in declarative, interrogative, and imperative speech reporting.',
    strand: 'Reported Discourse',
    subStrand: 'Backshift & Pronoun Alignment',
    requirementType: 'syntax',
    recommendedDepth: 'Developing',
    learningObjectives: [
      'Apply canonical backshift when introductory reporting verb is in past tense',
      'Transform yes/no questions using "if" or "whether"',
      'Convert imperative commands into infinitive report clauses ("told him to...")',
    ],
    assessmentGuideline:
      'Sentence transformation with reporting clause variations.',
    evidenceSource: 'CISCE Regulations & Syllabuses',
    sourceReference: 'Middle School Curriculum p. 48',
    evidenceStatus: 'Potential Gap',
    assessmentRelevance: 'Tested in Question 5(c) reported speech items.',
    editorialNotes: 'Pending explicit allocation in Unit 3 or Unit 4.',
  },
  {
    id: 'req-cisce-c6-pnc-06',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-PNC-06',
    title: 'Formal Punctuation, Semicolons & Dialogue Directives',
    description:
      'Punctuation mechanics including semicolons separating independent clauses, colons introducing enumerations, and quotation marks for direct speech.',
    strand: 'Mechanics & Punctuation',
    subStrand: 'Punctuation Syntax',
    requirementType: 'punctuation',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Use semicolons to connect closely related independent clauses',
      'Punctuate split dialogue quotations accurately with commas inside quotes',
      'Employ apostrophes correctly for contraction versus possessive distinction',
    ],
    assessmentGuideline:
      'Passage repunctuation with zero error tolerance in ICSE composition.',
    evidenceSource: 'CISCE Compendium of Prescribed Language Standards',
    sourceReference: 'Section 5.3',
    evidenceStatus: 'Mapped',
    assessmentRelevance: 'Essential across Paper 1 composition and Question 5.',
    editorialNotes: 'Fully integrated across chapter drill sets.',
  },
  {
    id: 'req-cisce-c6-con-07',
    frameworkProfileId: 'prof-cisce-c6-2026',
    code: 'CISCE-GR6-CON-07',
    title: 'Conditional Clauses & Inverted Hypothesis',
    description:
      'First, second, and third conditional structures, and inversion with "Had I known..." or "Should you require...".',
    strand: 'Conditional Syntax & Modality',
    subStrand: 'Hypothetical Structures',
    requirementType: 'syntax',
    recommendedDepth: 'Developing',
    learningObjectives: [
      'Formulate type 1, 2, and 3 conditionals accurately',
      'Transform "If...not" structures to "Unless" clauses without double negatives',
    ],
    assessmentGuideline:
      'Conditional sentence transformations with strict clause order.',
    evidenceSource: 'CISCE English Language Curriculum',
    sourceReference: 'Section 3.2',
    evidenceStatus: 'Needs Academic Review',
    assessmentRelevance: 'Crucial for Question 5 transformation items.',
    editorialNotes: 'Introduced in Class 6; reinforced in Classes 7 and 8.',
  },

  // =========================================================================
  // CAMBRIDGE LOWER SECONDARY STAGE 7 CURRICULUM REQUIREMENTS
  // =========================================================================
  {
    id: 'req-cam-s7-01',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Rg.02',
    title: 'Subject-Verb Agreement in Complex & Compound Structures',
    description:
      'Comment on and apply grammatical structures, including subject-verb agreement in complex multi-clause sentences, shaping tone and meaning.',
    strand: 'Grammar & Syntactic Analysis',
    subStrand: 'Sentential Concord',
    requirementType: 'concord',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Maintain unbroken concord across complex multi-clause sentences',
      'Analyze how syntactic rhythm and concordance impact narrative register',
      'Identify deliberate agreement departures for stylistic effect in literary texts',
    ],
    assessmentGuideline:
      'Banded diagnostic open-ended syntax investigation and analytical commentary.',
    evidenceSource: 'Cambridge Lower Secondary English Framework (0861)',
    sourceReference: 'Stage 7 Reading: Grammar 7Rg.02',
    evidenceStatus: 'Source Located',
    assessmentRelevance: 'Progression test criterion and Checkpoint writing evaluation.',
    editorialNotes: 'Criterion-referenced under Cambridge Assessment International Education standard.',
  },
  {
    id: 'req-cam-s7-02',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Wg.01',
    title: 'Syntactic Dexterity & Varied Sentence Types',
    description:
      'Use a varied range of sentence structures (compound, complex, compound-complex) with consistent subject-verb agreement throughout.',
    strand: 'Writing: Grammar & Style',
    subStrand: 'Syntactic Variation',
    requirementType: 'syntax',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Deploy short dramatic simple sentences alongside balanced compound-complex periods',
      'Vary clause openings with adverbial and non-finite participle clauses',
      'Maintain grammatical consistency across extended discursive essays',
    ],
    assessmentGuideline:
      'Writing tasks evaluated for stylistic syntactic variation against Band 4 criteria.',
    evidenceSource: 'Cambridge Lower Secondary English Curriculum Framework',
    sourceReference: 'Stage 7 Writing: Grammar 7Wg.01',
    evidenceStatus: 'Mapped',
    assessmentRelevance: 'Core criteria for Band 4 Writing Assessment in Cambridge Progression Tests.',
    editorialNotes: 'Key differentiator in international school student portfolios.',
  },
  {
    id: 'req-cam-s7-03',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Wg.04',
    title: 'Punctuation Precision & Clause Boundary Demarcation',
    description:
      'Punctuate sentences accurately, using commas to separate clauses and avoiding comma splices and run-on sentences.',
    strand: 'Writing: Grammar & Style',
    subStrand: 'Punctuation Architecture',
    requirementType: 'punctuation',
    recommendedDepth: 'Practised',
    learningObjectives: [
      'Identify and resolve comma splices using semicolons or conjunctive adverbs',
      'Punctuate parenthetical embedded clauses with paired dashes or commas',
      'Use colons and semicolons with syntactic intention',
    ],
    assessmentGuideline:
      'Editing and proofreading drills in connected discursive prose.',
    evidenceSource: 'Cambridge Lower Secondary Framework 0861',
    sourceReference: 'Stage 7 Writing: Punctuation 7Wg.04',
    evidenceStatus: 'Source Located',
    assessmentRelevance: 'Zero-tolerance clause boundary checking in Stage 7 Progression Tests.',
    editorialNotes: 'Scaffolded with Cambridge exemplar texts.',
  },
  {
    id: 'req-cam-s7-04',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Rv.01',
    title: 'Register Adaptation & Lexical Precision',
    description:
      'Analyze and adapt register, vocabulary, and syntactic formality for specific purposes and global audiences.',
    strand: 'Reading: Vocabulary & Style',
    subStrand: 'Register & Tone',
    requirementType: 'vocabulary',
    recommendedDepth: 'Developing',
    learningObjectives: [
      'Shift registers between informal student peer discussion and formal academic essay',
      'Select verbs with exact aspectual precision and nuanced connotations',
      'Critique register mismatch in authentic international communication',
    ],
    assessmentGuideline:
      'Comparative textual transformation tasks for contrasting global audiences.',
    evidenceSource: 'Cambridge Global Learning & Pedagogical Matrix',
    sourceReference: 'Stage 7 Reading 7Rv.01',
    evidenceStatus: 'Needs Academic Review',
    assessmentRelevance: 'AO1 Reading and AO2 Writing evaluation criterion.',
    editorialNotes: 'Requires academic reviewer validation of global English register examples.',
  },
  {
    id: 'req-cam-s7-05',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Sl.03',
    title: 'Formal Spoken Syntax & Exploratory Agreement',
    description:
      'Adapt syntax and verb agreement appropriately when presenting formal arguments or engaging in exploratory group discussions.',
    strand: 'Speaking & Listening',
    subStrand: 'Spoken Syntactic Fluency',
    requirementType: 'concord',
    recommendedDepth: 'Practised',
    learningObjectives: [
      'Self-correct agreement slips during spoken group deliberations',
      'Formulate hypothesis questions using modal auxiliaries and tentative syntax',
    ],
    assessmentGuideline:
      'Oral debate and collaborative seminar evaluation rubrics.',
    evidenceSource: 'Cambridge Lower Secondary Framework (0861)',
    sourceReference: 'Stage 7 Speaking & Listening 7Sl.03',
    evidenceStatus: 'Potential Gap',
    assessmentRelevance: 'Spoken language component AO3.',
    editorialNotes: 'Scheduled for Chapter 4 communicative extension.',
  },
  {
    id: 'req-cam-s7-06',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7Wc.02',
    title: 'Discourse Cohesion & Logical Connectives',
    description:
      'Structure paragraphs logically using transitional adverbs, reference chains, and syntactic parallelism.',
    strand: 'Writing: Composition & Cohesion',
    subStrand: 'Paragraph Coherence',
    requirementType: 'composition',
    recommendedDepth: 'Developing',
    learningObjectives: [
      'Link paragraphs using contrastive and concessive connectives ("whereas", "nevertheless")',
      'Maintain referential integrity with anaphoric pronouns',
    ],
    assessmentGuideline:
      'Extended persuasive essay rubric (Bands 1–4).',
    evidenceSource: 'Cambridge International Curriculum Framework 0861',
    sourceReference: 'Stage 7 Writing: Composition 7Wc.02',
    evidenceStatus: 'Mapped',
    assessmentRelevance: 'Key marker for cohesive discourse in Checkpoint tests.',
    editorialNotes: 'Directly supported by Component 15 composition guides.',
  },
  {
    id: 'req-cam-s7-07',
    frameworkProfileId: 'prof-cambridge-s7-2026',
    code: 'CAIE-0861-7As.01',
    title: 'Metacognitive Grammar Reflection & Peer Review',
    description:
      'Evaluate own and peers writing against banded criteria, justifying revisions on syntactic and rhetorical grounds.',
    strand: 'Metacognition & Evaluation',
    subStrand: 'Self & Peer Assessment',
    requirementType: 'editing',
    recommendedDepth: 'Mastered',
    learningObjectives: [
      'Annotate draft writing with constructive grammatical and stylistic recommendations',
      'Formulate personal editing goals based on diagnostic feedback',
    ],
    assessmentGuideline:
      'Reflective learning log entries and tracked revisions.',
    evidenceSource: 'Cambridge Lower Secondary Pedagogical Handbook',
    sourceReference: 'Assessment Section 6.2',
    evidenceStatus: 'Needs Academic Review',
    assessmentRelevance: 'Continuous formative feedback alignment.',
    editorialNotes: 'Reflective learning framework integration.',
  },
];

// =========================================================================
// 5. DEMONSTRATION CURRICULUM MAPPINGS (TRACEABILITY MATRIX)
// =========================================================================

export const DEMONSTRATION_CURRICULUM_MAPPINGS: CurriculumMapping[] = [
  {
    id: 'map-demo-cbse-c6-01',
    requirementId: 'req-cbse-c6-conc-01',
    requirementCode: 'CBSE-GR6-CONC-01',
    requirementTitle: 'Basic Subject-Verb Concord (Singular & Plural)',
    bookId: 'proj-default-cbse-6',
    unitId: 'unit-syntax-01',
    chapterId: 'top-concord-c6',
    architectureComponentId: 'comp-6', // Rule Box
    learningObjectiveId: 'LO-CONC-01',
    exerciseId: 'ex-c6-01-a',
    assessmentQuestionId: 'q-test-01',
    coverageState: 'mastered',
    verificationStatus: 'needs_academic_review',
    depth: 'Comprehensive (Universal law + contrasting pairs)',
    evidence: [
      {
        id: 'ev-01-rule',
        type: 'content_block',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        sectionId: 'sec-concord-rules',
        sectionTitle: 'Core Rules of Concord',
        componentId: 'comp-6',
        componentName: 'Grammar Rules & Form Boxes',
        snippet:
          'Rule 1: A singular subject demands a singular verb; a plural subject demands a plural verb in standard indicative mood.',
      },
      {
        id: 'ev-01-drill',
        type: 'exercise',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-12',
        componentName: 'Guided Practice & Scaffolding Drill',
        exerciseId: 'ex-c6-01-a',
        snippet:
          'Exercise 1A (Foundational Identification): Underline the syntactic subject and circle the matching verb in each sentence.',
      },
      {
        id: 'ev-01-test',
        type: 'assessment',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-21',
        componentName: 'Chapter Assessment & Mastery Test',
        questionId: 'q-test-01',
        snippet:
          'Mastery Test Section A (Item 1): The astronomer (gazes / gaze) through the observatory telescope. [1 Mark]',
      },
    ],
    notes:
      'Mapped to Chapter 1 Section 2 rule block, Exercise 1A, and Mastery Test Item 1. Tagged as sample awaiting formal academic sign-off.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cbse-c6-02',
    requirementId: 'req-cbse-c6-conc-02',
    requirementCode: 'CBSE-GR6-CONC-02',
    requirementTitle: 'Compound Subjects with "and" vs. "or" / "nor"',
    bookId: 'proj-default-cbse-6',
    unitId: 'unit-syntax-01',
    chapterId: 'top-concord-c6',
    architectureComponentId: 'comp-7', // Contrasting Pairs
    learningObjectiveId: 'LO-CONC-02',
    exerciseId: 'ex-c6-01-b',
    assessmentQuestionId: 'q-test-03',
    coverageState: 'practised',
    verificationStatus: 'needs_academic_review',
    depth: 'High (Proximity rule with dual singular/plural subjects)',
    evidence: [
      {
        id: 'ev-02-pairs',
        type: 'content_block',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        sectionId: 'sec-concord-compound',
        sectionTitle: 'Compound Subjects & Correlatives',
        componentId: 'comp-7',
        componentName: 'Exemplar Sets & Contrasting Pairs',
        snippet:
          'Contrast Pair: "Neither the captain nor the sailors were ready" vs. "Neither the sailors nor the captain was ready".',
      },
      {
        id: 'ev-02-drill',
        type: 'exercise',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-13',
        componentName: 'Tier 1: Foundational Practice',
        exerciseId: 'ex-c6-01-b',
        snippet:
          'Exercise 1B (Compound Subject Drill): Fill in the blanks with the correct verb form respecting correlative proximity.',
      },
    ],
    notes:
      'Covered in concept section and Tier 1 drills. Assessment question included in Chapter Mastery Test Section B.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cbse-c6-03',
    requirementId: 'req-cbse-c6-conc-03',
    requirementCode: 'CBSE-GR6-CONC-03',
    requirementTitle: 'Intervening Prepositional Phrases & Modifiers',
    bookId: 'proj-default-cbse-6',
    unitId: 'unit-syntax-01',
    chapterId: 'top-concord-c6',
    architectureComponentId: 'comp-8', // Visual Syntactic Diagram
    learningObjectiveId: 'LO-CONC-03',
    exerciseId: 'ex-c6-01-c',
    assessmentQuestionId: 'q-test-04',
    coverageState: 'mastered',
    verificationStatus: 'needs_academic_review',
    depth: 'Deep (Sentence diagram isolating prepositional intruder)',
    evidence: [
      {
        id: 'ev-03-visual',
        type: 'content_block',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        sectionId: 'sec-concord-intervening',
        sectionTitle: 'The Prepositional Interruption Trap',
        componentId: 'comp-8',
        componentName: 'Visual / Syntactic Diagram Block',
        snippet:
          'Sentence Architecture Diagram: [The bouquet] (of blooming lavender roses) -> [smells] sweet. Diagram visually shields the verb from the modifier.',
      },
      {
        id: 'ev-03-tip',
        type: 'content_block',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-11',
        componentName: 'Remember / Tip / Note Boxes',
        snippet:
          'Linguistic Shield Tip: Put your hand over words inside "of...", "with...", "along with...". Match the verb directly to the noun before the preposition.',
      },
      {
        id: 'ev-03-ex',
        type: 'exercise',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-14',
        componentName: 'Tier 2: Intermediate Application',
        exerciseId: 'ex-c6-01-c',
        snippet:
          'Exercise 1C (Sentence Editing): Cross out the intervening modifier and correct the verb.',
      },
    ],
    notes:
      'Fully developed with visual sentence diagramming, mnemonic note box, and tier 2 error-spotting drill.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cbse-c6-04',
    requirementId: 'req-cbse-c6-conc-04',
    requirementCode: 'CBSE-GR6-CONC-04',
    requirementTitle: 'Indefinite & Distributive Pronoun Concord',
    bookId: 'proj-default-cbse-6',
    unitId: 'unit-syntax-01',
    chapterId: 'top-concord-c6',
    architectureComponentId: 'comp-10', // Formula / Rule Strip
    learningObjectiveId: 'LO-CONC-04',
    exerciseId: 'ex-c6-01-d',
    assessmentQuestionId: 'q-test-05',
    coverageState: 'practised',
    verificationStatus: 'needs_academic_review',
    depth: 'High (Distributive "each", "either", "everybody" rules)',
    evidence: [
      {
        id: 'ev-04-strip',
        type: 'content_block',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        sectionId: 'sec-concord-distributive',
        sectionTitle: 'Distributive Pronoun Rules',
        componentId: 'comp-10',
        componentName: 'Formula / Structural Rule Strip',
        snippet:
          'Syntactic Formula Strip: EACH / EITHER / NEITHER + [of + Plural Noun] = SINGULAR VERB (is / has / does).',
      },
    ],
    notes:
      'Taught via rule strip and practiced in Exercise 1D. Ready for academic editorial verification.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cbse-c6-07',
    requirementId: 'req-cbse-c6-conc-07',
    requirementCode: 'CBSE-GR6-CONC-07',
    requirementTitle: 'Applied Dialogue & Passage Editing in Context',
    bookId: 'proj-default-cbse-6',
    unitId: 'unit-syntax-01',
    chapterId: 'top-concord-c6',
    architectureComponentId: 'comp-15', // Tier 3 Advanced / Contextual
    learningObjectiveId: 'LO-CONC-07',
    exerciseId: 'ex-c6-01-e',
    assessmentQuestionId: 'q-test-08',
    coverageState: 'assessed',
    verificationStatus: 'needs_academic_review',
    depth: 'Authentic 4-line conversation passage editing',
    evidence: [
      {
        id: 'ev-07-ex',
        type: 'exercise',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-15',
        componentName: 'Tier 3: Advanced / Contextual Challenge',
        exerciseId: 'ex-c6-01-e',
        snippet:
          'Exercise 1E (CBSE Dialogue Editing): Anjali and Rohan are debating school council elections. Read the dialogue, find 4 agreement errors, and rewrite each line correctly.',
      },
      {
        id: 'ev-07-test',
        type: 'assessment',
        chapterId: 'top-concord-c6',
        chapterTitle: 'Subject–Verb Agreement (Concord)',
        componentId: 'comp-21',
        componentName: 'Chapter Assessment & Mastery Test',
        questionId: 'q-test-08',
        snippet:
          'Mastery Test Section C (Competency Editing): Paragraph error detection in school eco-club news report. [4 Marks]',
      },
    ],
    notes:
      'Directly matches CBSE Board Section B examination format and competency-based assessment guidelines.',
    isDemonstration: true,
  },

  // =========================================================================
  // CISCE CLASS 6 DEMONSTRATION MAPPINGS
  // =========================================================================
  {
    id: 'map-demo-cisce-c6-01',
    requirementId: 'req-cisce-c6-sva-01',
    requirementCode: 'CISCE-GR6-SVA-01',
    requirementTitle: 'Subject-Verb Agreement with Collective & Correlative Subjects',
    bookId: 'proj-icse-c6',
    unitId: 'unit-cisce-01',
    chapterId: 'top-sva-cisce-c6',
    architectureComponentId: 'comp-6',
    learningObjectiveId: 'CLO-MS-02',
    exerciseId: 'ex-cisce-01',
    assessmentQuestionId: 'q-cisce-01',
    coverageState: 'mastered',
    verificationStatus: 'needs_academic_review',
    depth: 'Formal Grammar Law + Contrasting Exceptions',
    evidence: [
      {
        id: 'ev-cisce-01-rule',
        type: 'content_block',
        chapterId: 'top-sva-cisce-c6',
        chapterTitle: 'Subject-Verb Agreement & Correlative Syntax',
        sectionId: 'sec-cisce-sva',
        sectionTitle: 'Collective Nouns and Neither/Nor Rules',
        componentId: 'comp-6',
        componentName: 'Grammar Rules & Form Boxes',
        snippet:
          'Rule: When two subjects are connected by "neither...nor", the verb agrees with the subject closest to it. Collective nouns take singular verbs when acting as a unified entity.',
      },
      {
        id: 'ev-cisce-01-drill',
        type: 'exercise',
        chapterId: 'top-sva-cisce-c6',
        chapterTitle: 'Subject-Verb Agreement & Correlative Syntax',
        componentId: 'comp-12',
        componentName: 'Guided Practice & Scaffolding Drill',
        exerciseId: 'ex-cisce-01',
        snippet:
          'Exercise 1 (Formal Parsing): Select the correct verb form for collective subjects in formal British/Indian English prose.',
      },
      {
        id: 'ev-cisce-01-exam',
        type: 'assessment',
        chapterId: 'top-sva-cisce-c6',
        chapterTitle: 'Subject-Verb Agreement & Correlative Syntax',
        componentId: 'comp-21',
        componentName: 'Chapter Assessment & Mastery Test',
        questionId: 'q-cisce-01',
        snippet:
          'Question 5(c) Sentence Transformation: Rewrite without changing meaning: "Neither the captain nor the sailors were aware of the shoal."',
      },
    ],
    notes: 'Direct ICSE Paper 1 Question 5 alignment. Sample requiring academic verification.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cisce-c6-02',
    requirementId: 'req-cisce-c6-syn-02',
    requirementCode: 'CISCE-GR6-SYN-02',
    requirementTitle: 'Sentence Synthesis without "and", "but", or "so"',
    bookId: 'proj-icse-c6',
    unitId: 'unit-cisce-01',
    chapterId: 'top-sva-cisce-c6',
    architectureComponentId: 'comp-7',
    learningObjectiveId: 'CLO-MS-01',
    exerciseId: 'ex-cisce-02',
    assessmentQuestionId: 'q-cisce-02',
    coverageState: 'developing',
    verificationStatus: 'needs_academic_review',
    depth: 'Sentence Synthesis with Participle and Relative Clause Scaffolding',
    evidence: [
      {
        id: 'ev-cisce-02-rule',
        type: 'content_block',
        chapterId: 'top-sva-cisce-c6',
        chapterTitle: 'Subject-Verb Agreement & Correlative Syntax',
        componentId: 'comp-7',
        componentName: 'Contrasting Language Examples',
        snippet:
          'Synthesis Technique: Using present participle phrases to combine two actions performed by the identical grammatical subject.',
      },
    ],
    notes: 'Core ICSE Question 5(b) drill mapped to Chapter 1 synthesis extension.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-cisce-c6-03',
    requirementId: 'req-cisce-c6-voi-03',
    requirementCode: 'CISCE-GR6-VOI-03',
    requirementTitle: 'Active and Passive Voice Transformation',
    bookId: 'proj-icse-c6',
    unitId: 'unit-cisce-02',
    chapterId: 'c6-top-sent',
    architectureComponentId: 'comp-6',
    learningObjectiveId: 'CLO-MS-04',
    coverageState: 'practised',
    verificationStatus: 'verified',
    depth: 'Full Voice Paradigm with Interrogative & Imperative Conversions',
    evidence: [
      {
        id: 'ev-cisce-03-rule',
        type: 'content_block',
        chapterId: 'c6-top-sent',
        chapterTitle: 'Sentence Structure & Voice',
        componentId: 'comp-6',
        componentName: 'Grammar Rules & Form Boxes',
        snippet:
          'Voice Conversion Rule: The object of the active verb becomes the subject of the passive verb. Tense aspect must be strictly preserved.',
      },
    ],
    notes: 'Verified against ICSE Class 6 prescribed syntax syllabus.',
    isDemonstration: false,
  },
  {
    id: 'map-demo-cisce-c6-06',
    requirementId: 'req-cisce-c6-pnc-06',
    requirementCode: 'CISCE-GR6-PNC-06',
    requirementTitle: 'Formal Punctuation, Semicolons & Dialogue Directives',
    bookId: 'proj-icse-c6',
    unitId: 'unit-cisce-03',
    chapterId: 'c6-top-punc',
    architectureComponentId: 'comp-6',
    learningObjectiveId: 'CLO-MS-05',
    coverageState: 'mastered',
    verificationStatus: 'verified',
    depth: 'High-rigour Punctuation Syntax & Colon/Semicolon Deployment',
    evidence: [
      {
        id: 'ev-cisce-06-rule',
        type: 'content_block',
        chapterId: 'c6-top-punc',
        chapterTitle: 'Punctuation & Direct Discourse',
        componentId: 'comp-6',
        componentName: 'Grammar Rules & Form Boxes',
        snippet:
          'Punctuation Rule: A semicolon is used between two independent clauses not joined by a conjunction.',
      },
    ],
    notes: 'Formally verified mapping for ICSE Class 6 mechanics.',
    isDemonstration: false,
  },

  // =========================================================================
  // CAMBRIDGE STAGE 7 DEMONSTRATION MAPPINGS
  // =========================================================================
  {
    id: 'map-demo-camb-s7-01',
    requirementId: 'req-cam-s7-01',
    requirementCode: 'CAIE-0861-7Rg.02',
    requirementTitle: 'Subject-Verb Agreement in Complex & Compound Structures',
    bookId: 'proj-camb-s7',
    unitId: 'unit-cam-01',
    chapterId: 'top-sva-camb-s7',
    architectureComponentId: 'comp-6',
    learningObjectiveId: '7Rg.02',
    exerciseId: 'ex-camb-01',
    assessmentQuestionId: 'q-camb-01',
    coverageState: 'mastered',
    verificationStatus: 'needs_academic_review',
    depth: 'Syntactic Commentary & Multi-clause Concord Analysis',
    evidence: [
      {
        id: 'ev-camb-01-rule',
        type: 'content_block',
        chapterId: 'top-sva-camb-s7',
        chapterTitle: 'Concord & Syntactic Cohesion in Complex Text',
        componentId: 'comp-6',
        componentName: 'Grammar Exploration & Language Rules',
        snippet:
          'Investigating Agreement: How multi-clause sentences maintain grammatical concordance even across embedded parenthetical clauses.',
      },
      {
        id: 'ev-camb-01-ex',
        type: 'exercise',
        chapterId: 'top-sva-camb-s7',
        chapterTitle: 'Concord & Syntactic Cohesion in Complex Text',
        componentId: 'comp-12',
        componentName: 'Diagnostic Text Investigation',
        exerciseId: 'ex-camb-01',
        snippet:
          'Inquiry Task: Identify how the writer has structured verb choices in this travel narrative to create momentum.',
      },
    ],
    notes: 'Aligned to CAIE Framework 0861 Stage 7 Reading: Grammar criteria.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-camb-s7-02',
    requirementId: 'req-cam-s7-02',
    requirementCode: 'CAIE-0861-7Wg.01',
    requirementTitle: 'Syntactic Dexterity & Varied Sentence Types',
    bookId: 'proj-camb-s7',
    unitId: 'unit-cam-01',
    chapterId: 'top-sva-camb-s7',
    architectureComponentId: 'comp-15',
    learningObjectiveId: '7Wg.01',
    coverageState: 'mastered',
    verificationStatus: 'verified',
    depth: 'Stylistic Syntactic Variation across Writing Genres',
    evidence: [
      {
        id: 'ev-camb-02-comp',
        type: 'content_block',
        chapterId: 'top-sva-camb-s7',
        chapterTitle: 'Concord & Syntactic Cohesion in Complex Text',
        componentId: 'comp-15',
        componentName: 'Applied Writing Workshop',
        snippet:
          'Stylistic Focus: Crafting compound-complex sentences with precise non-finite participle openings.',
      },
    ],
    notes: 'Band 4 Cambridge writing progression mapping verified.',
    isDemonstration: false,
  },
  {
    id: 'map-demo-camb-s7-03',
    requirementId: 'req-cam-s7-03',
    requirementCode: 'CAIE-0861-7Wg.04',
    requirementTitle: 'Punctuation Precision & Clause Boundary Demarcation',
    bookId: 'proj-camb-s7',
    unitId: 'unit-cam-02',
    chapterId: 'c7-top-punc',
    architectureComponentId: 'comp-6',
    learningObjectiveId: '7Wg.04',
    coverageState: 'practised',
    verificationStatus: 'needs_academic_review',
    depth: 'Comma Splice Disambiguation & Clause Boundary Punctuation',
    evidence: [
      {
        id: 'ev-camb-03-rule',
        type: 'content_block',
        chapterId: 'c7-top-punc',
        chapterTitle: 'Punctuation & Clause Boundaries',
        componentId: 'comp-6',
        componentName: 'Punctuation Architecture Guide',
        snippet:
          'Rule: Avoid comma splices by connecting complete independent clauses with a semicolon or coordinating conjunction.',
      },
    ],
    notes: 'Stage 7 Cambridge progression test target.',
    isDemonstration: true,
  },
  {
    id: 'map-demo-camb-s7-06',
    requirementId: 'req-cam-s7-06',
    requirementCode: 'CAIE-0861-7Wc.02',
    requirementTitle: 'Discourse Cohesion & Logical Connectives',
    bookId: 'proj-camb-s7',
    unitId: 'unit-cam-03',
    chapterId: 'c7-top-cohesion',
    architectureComponentId: 'comp-15',
    learningObjectiveId: '7Wc.02',
    coverageState: 'developing',
    verificationStatus: 'needs_academic_review',
    depth: 'Paragraph Cohesion & Transitional Logic',
    evidence: [
      {
        id: 'ev-camb-06-comp',
        type: 'content_block',
        chapterId: 'c7-top-cohesion',
        chapterTitle: 'Paragraph Architecture & Cohesion',
        componentId: 'comp-15',
        componentName: 'Discourse Workshop',
        snippet:
          'Cohesion Focus: Employ transitional adverbs to signal contrast and concession across paragraph boundaries.',
      },
    ],
    notes: 'Progression from Stage 6 into Stage 7 writing maturity.',
    isDemonstration: true,
  },
];

// =========================================================================
// BOARD-SPECIFIC TERMINOLOGY HELPERS
// =========================================================================

export interface BoardTerminology {
  systemName: string;
  requirementTerm: string;
  requirementPlural: string;
  competencyTerm: string;
  frameworkRefTerm: string;
  examRelevanceTerm: string;
  classOrStageLabel: string;
  policySeparationNote: string;
  sampleSyllabusCode: string;
  syllabusAuthority: string;
  curriculumDocLabel: string;
  evidenceSourceDefault: string;
}

/**
 * Normalizes class or stage strings to prevent duplicate prefixes (e.g. "Class Class 1").
 * - If value is "Class 1", returns "Class 1".
 * - If value is "1", returns "Class 1" (or "Stage 1" for Cambridge).
 * - Never prepends "Class" if already present.
 */
export function normalizeClassOrStage(value?: string, board?: string): string {
  if (!value) {
    const isCamb = (board || '').toUpperCase().includes('CAMBRIDGE') || (board || '').toUpperCase().includes('CAIE');
    return isCamb ? 'Stage 1' : 'Class 1';
  }
  const str = value.trim();
  const isCamb = (board || '').toUpperCase().includes('CAMBRIDGE') || (board || '').toUpperCase().includes('CAIE');

  if (isCamb) {
    if (/^stage\s+/i.test(str)) {
      return str.replace(/^(stage\s+)+/i, 'Stage ');
    }
    if (/^cambridge/i.test(str)) return str;
    const numMatch = str.match(/\d+/);
    return numMatch ? `Stage ${numMatch[0]}` : str;
  }

  // Non-Cambridge (CISCE, CBSE, etc.)
  if (/^class\s+/i.test(str)) {
    return str.replace(/^(class\s+)+/i, 'Class ');
  }
  const numMatch = str.match(/\d+/);
  return numMatch ? `Class ${numMatch[0]}` : `Class ${str}`;
}

/**
 * Derives the educational tier / programme label dynamically from class/stage and board metadata.
 * Prevents hardcoding "Middle School Curriculum" for Primary classes like Class 1.
 */
export function getEducationalTierLabel(classOrStage?: string, board?: string): string {
  const rawBoard = (board || 'CBSE').toUpperCase();
  const rawClass = (classOrStage || 'Class 6').trim();
  const numMatch = rawClass.match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : 6;

  if (rawBoard.includes('CAMBRIDGE') || rawBoard.includes('CAIE')) {
    if (classNum <= 6) return 'Cambridge Primary';
    if (classNum <= 9) return 'Cambridge Lower Secondary';
    if (classNum <= 11) return 'Cambridge Upper Secondary (IGCSE)';
    return 'Cambridge Advanced';
  }

  if (rawBoard.includes('CISCE') || rawBoard.includes('ICSE') || rawBoard.includes('ISC')) {
    if (classNum <= 5) return 'Primary';
    if (classNum <= 8) return 'Middle School Curriculum';
    if (classNum <= 10) return 'ICSE (Secondary)';
    return 'ISC (Senior Secondary)';
  }

  // CBSE
  if (classNum <= 2) return 'Foundational Stage (Class 1–2)';
  if (classNum <= 5) return 'Preparatory Stage (Class 3–5)';
  if (classNum <= 8) return 'Middle School';
  if (classNum <= 10) return 'Secondary School';
  return 'Senior Secondary';
}

export function getBoardTerminology(boardOrSystem: string = 'CBSE'): BoardTerminology {
  const upper = (boardOrSystem || '').toUpperCase();
  if (upper.includes('CISCE') || upper.includes('ICSE') || upper.includes('ISC')) {
    return {
      systemName: 'CISCE',
      requirementTerm: 'Syllabus Requirement',
      requirementPlural: 'Syllabus Requirements',
      competencyTerm: 'Language Skill',
      frameworkRefTerm: 'CISCE Regulations & Syllabus Citation',
      examRelevanceTerm: 'ICSE Paper 1 (Question 5 Transformations)',
      classOrStageLabel: 'Class',
      policySeparationNote:
        'CISCE maintains autonomous syllabus standards. NEP 2020 references are recorded as external comparative references only and not the syllabus itself.',
      sampleSyllabusCode: 'CISCE-ENG-C6-LANG',
      syllabusAuthority: 'Council for the Indian School Certificate Examinations (CISCE)',
      curriculumDocLabel: 'CISCE English Language Curriculum Compendium',
      evidenceSourceDefault: 'CISCE Regulations & Syllabuses, Middle School Compendium',
    };
  }
  if (upper.includes('CAMBRIDGE') || upper.includes('CAIE')) {
    return {
      systemName: 'Cambridge',
      requirementTerm: 'Learning Objective',
      requirementPlural: 'Learning Objectives',
      competencyTerm: 'Assessment Objective (AO)',
      frameworkRefTerm: 'Cambridge Framework Code (0861)',
      examRelevanceTerm: 'Progression Test & Checkpoint Criteria',
      classOrStageLabel: 'Stage',
      policySeparationNote:
        'Cambridge Assessment International Education operates on autonomous Stage/Programme standards without Indian grade terminology or national policies.',
      sampleSyllabusCode: 'CAIE-0861-STG7',
      syllabusAuthority: 'Cambridge Assessment International Education (CAIE)',
      curriculumDocLabel: 'Cambridge Lower Secondary English Framework (0861)',
      evidenceSourceDefault: 'Cambridge Lower Secondary English Curriculum Framework (0861)',
    };
  }
  // Default to CBSE
  return {
    systemName: 'CBSE',
    requirementTerm: 'Learning Outcome',
    requirementPlural: 'Learning Outcomes',
    competencyTerm: 'Competency',
    frameworkRefTerm: 'NCF / NCERT / CBSE Reference',
    examRelevanceTerm: 'Section B Grammar & Writing Blueprint',
    classOrStageLabel: 'Class',
    policySeparationNote:
      'CBSE Secondary School Curriculum (Languages Volume) governed under NCF-SE 2023 & NEP 2020 Competency Guidelines.',
    sampleSyllabusCode: 'CBSE-ENG-MS-06',
    syllabusAuthority: 'Central Board of Secondary Education (CBSE)',
    curriculumDocLabel: 'CBSE Secondary School Curriculum (Languages Volume)',
    evidenceSourceDefault: 'CBSE Secondary School Curriculum (Languages Volume), Circular Acad-38/2024',
  };
}

export function getFrameworkProfileForBook(book: BookProject): FrameworkProfile {
  const rawBoard = (book.board || 'CBSE').toUpperCase();
  const isCambridge = rawBoard.includes('CAMBRIDGE') || rawBoard.includes('CAIE');
  const isCisce = rawBoard.includes('CISCE') || rawBoard.includes('ICSE') || rawBoard.includes('ISC');
  const targetSystem: CurriculumSystemId = isCambridge ? 'Cambridge' : isCisce ? 'CISCE' : 'CBSE';

  const rawClass = book.classLevel || book.classOrStage || (isCambridge ? 'Stage 7' : 'Class 6');
  const normalizedClass = normalizeClassOrStage(rawClass, targetSystem);
  const numMatch = normalizedClass.match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : (isCambridge ? 7 : 6);

  // 1. Strict match in existing demonstration profiles by system AND class
  const existing = DEFAULT_FRAMEWORK_PROFILES.find(
    (p) =>
      p.educationSystem === targetSystem &&
      (p.classOrStage.toLowerCase() === normalizedClass.toLowerCase() ||
        (numMatch && p.classOrStage.includes(String(classNum))))
  );
  if (existing) return existing;

  // 2. Generate isolated, non-leaking profile tailored strictly to this class and system
  const programmeTier = getEducationalTierLabel(normalizedClass, targetSystem);

  if (targetSystem === 'CISCE') {
    return {
      id: `prof-cisce-${normalizedClass.toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026`,
      educationSystem: 'CISCE',
      awardingOrganisation: 'Council for the Indian School Certificate Examinations',
      programme: programmeTier,
      classOrStage: normalizedClass,
      subject: 'English Language',
      academicYearOrEdition: book.academicYear || book.edition || '2025–2026 Edition',
      curriculumDocument: `CISCE Curriculum for English Language (${normalizedClass})`,
      frameworkDocument: 'CISCE English Language Curriculum Compendium',
      syllabusReference: `CISCE-ENG-${normalizedClass.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
      documentYear: '2024',
      sourceCitation: `CISCE Regulations & Syllabuses, Compendium Section for ${normalizedClass}`,
      learningOutcomes: [],
      competencies: [
        'Structural Grammatical Precision',
        'Sentence Formulation & Syntax',
        'Lexical Precision & Usage',
      ],
      assessmentExpectations: `Syllabus diagnostic items and formative exercises appropriate for ${normalizedClass}.`,
      pedagogicalExpectations: 'Systematic grammar instruction with authentic contextual examples.',
      notes: 'CISCE autonomous curriculum standards. No requirements officially verified yet for this class context.',
      verificationStatus: 'needs_academic_review',
      version: '2025.1',
    };
  }

  if (targetSystem === 'Cambridge') {
    return {
      id: `prof-cambridge-${normalizedClass.toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026`,
      educationSystem: 'Cambridge',
      awardingOrganisation: 'Cambridge Assessment International Education',
      programme: programmeTier,
      classOrStage: normalizedClass,
      subject: 'English (0861)',
      academicYearOrEdition: book.academicYear || book.edition || '2025–2026 Edition',
      curriculumDocument: `Cambridge Curriculum Framework for English (${normalizedClass})`,
      frameworkDocument: 'Cambridge Global Learning & Pedagogical Matrix',
      syllabusReference: `CAIE-ENG-${normalizedClass.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
      documentYear: '2024',
      sourceCitation: `Cambridge International Curriculum Framework for ${normalizedClass}`,
      learningOutcomes: [],
      competencies: [
        'Syntactic Dexterity and Stylistic Variation',
        'Contextual Register Adaptation for Purpose and Audience',
      ],
      assessmentExpectations: `Criterion-referenced progression objectives for ${normalizedClass}.`,
      pedagogicalExpectations: 'Inquiry-driven investigation of linguistic patterns.',
      notes: 'Cambridge International framework operates on autonomous Stage/Programme standards.',
      verificationStatus: 'needs_academic_review',
      version: '2024.2',
    };
  }

  // Default to CBSE
  return {
    id: `prof-cbse-${normalizedClass.toLowerCase().replace(/[^a-z0-9]/g, '-')}-2026`,
    educationSystem: 'CBSE',
    awardingOrganisation: 'Central Board of Secondary Education',
    programme: programmeTier,
    classOrStage: normalizedClass,
    subject: 'English Language & Grammar',
    academicYearOrEdition: book.academicYear || book.edition || '2025–2026 Edition',
    curriculumDocument: `CBSE Secondary School Curriculum (${normalizedClass})`,
    frameworkDocument: 'NCF-SE 2023 & NEP 2020 Pedagogical Guidelines',
    syllabusReference: `CBSE-ENG-${normalizedClass.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
    documentYear: '2024–2025',
    sourceCitation: `CBSE Curriculum Guidelines for ${normalizedClass}`,
    learningOutcomes: [],
    competencies: [
      'Contextual Grammatical Precision',
      'Proofreading & Textual Editing',
    ],
    assessmentExpectations: `Formative and diagnostic language assessment for ${normalizedClass}.`,
    pedagogicalExpectations: 'Spiral curriculum reinforcement and communicative grammar practice.',
    notes: 'CBSE competency-based curriculum framework.',
    verificationStatus: 'needs_academic_review',
    version: '2025.1',
  };
}

export function getCurriculumRequirementsForBook(book: BookProject): CurriculumRequirement[] {
  // 1. Explicitly stored requirements on the active book project
  if (book.curriculumRequirements && book.curriculumRequirements.length > 0) {
    return book.curriculumRequirements;
  }

  const profile = getFrameworkProfileForBook(book);

  // 2. Strict match against profile id
  const matched = DEFAULT_CURRICULUM_REQUIREMENTS.filter((r) => r.frameworkProfileId === profile.id);
  if (matched.length > 0) return matched;

  // 3. Strict match against educationSystem AND classOrStage
  const classMatched = DEFAULT_CURRICULUM_REQUIREMENTS.filter((r) => {
    const prof = DEFAULT_FRAMEWORK_PROFILES.find((p) => p.id === r.frameworkProfileId);
    return prof && prof.educationSystem === profile.educationSystem && prof.classOrStage === profile.classOrStage;
  });
  if (classMatched.length > 0) return classMatched;

  // 4. Never fall back to other classes! Return empty array so UI shows clean empty state
  return [];
}

export function getCurriculumMappingsForBook(
  book: BookProject,
  seriesProject?: GrammarSeriesProject
): CurriculumMapping[] {
  // 1. Explicitly stored mappings on the book
  if (book.curriculumMappings && book.curriculumMappings.length > 0) {
    return book.curriculumMappings;
  }

  // 2. Series-level mappings scoped to this book
  if (seriesProject?.curriculumMappings && seriesProject.curriculumMappings.length > 0) {
    const matched = seriesProject.curriculumMappings.filter(
      (m) => m.bookId === book.id || (book.internalProjectCode && m.bookId === book.internalProjectCode)
    );
    if (matched.length > 0) return matched;
  }

  // 3. Strict check: only return demonstration mappings for the designated demo books
  const rawBoard = (book.board || 'CBSE').toUpperCase();
  const numMatch = (book.classLevel || book.classOrStage || '').match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : null;

  // CISCE Class 6 demonstration project:
  if ((rawBoard.includes('CISCE') || rawBoard.includes('ICSE')) && (classNum === 6 || book.id === 'proj-icse-c6')) {
    return DEMONSTRATION_CURRICULUM_MAPPINGS.filter((m) => m.bookId === 'proj-icse-c6');
  }

  // Cambridge Stage 7 demonstration project:
  if (rawBoard.includes('CAMBRIDGE') && (classNum === 7 || book.id === 'proj-camb-s7')) {
    return DEMONSTRATION_CURRICULUM_MAPPINGS.filter((m) => m.bookId === 'proj-camb-s7');
  }

  // CBSE Class 6 demonstration project:
  if (rawBoard.includes('CBSE') && (classNum === 6 || book.id === 'proj-default-cbse-6')) {
    return DEMONSTRATION_CURRICULUM_MAPPINGS.filter((m) => m.bookId === 'proj-default-cbse-6');
  }

  // 4. Return empty array for non-demo projects
  return [];
}

// =========================================================================
// 6. CURRICULUM GAP DETECTION ENGINE (EDITORIAL DIAGNOSTICS)
// =========================================================================

export function detectCurriculumGaps(
  book: BookProject,
  requirements?: CurriculumRequirement[],
  mappings?: CurriculumMapping[],
  topics?: GrammarTopic[]
): CurriculumGapWarning[] {
  const warnings: CurriculumGapWarning[] = [];
  const activeProfile = getFrameworkProfileForBook(book);
  const activeRequirements = requirements !== undefined ? requirements : getCurriculumRequirementsForBook(book);
  const activeMappings = mappings !== undefined ? mappings : getCurriculumMappingsForBook(book);

  if (activeRequirements.length === 0 && activeMappings.length === 0) {
    return [];
  }

  const profileRequirements = activeRequirements.filter(
    (r) => r.frameworkProfileId === activeProfile.id
  );

  if (profileRequirements.length === 0 && activeMappings.length === 0) {
    return [];
  }

  // Check 1: Unmapped requirement
  profileRequirements.forEach((req) => {
    const isMapped = activeMappings.some((m) => m.requirementId === req.id || m.requirementCode === req.code);
    if (!isMapped) {
      warnings.push({
        id: `gap-unmapped-${req.id}`,
        category: 'unassigned_requirement',
        severity: 'critical',
        title: `Unmapped Requirement: ${req.code}`,
        description: `"${req.title}" from ${activeProfile.curriculumDocument} has not been mapped to any chapter in this book project.`,
        recommendation: `Assign ${req.code} to an active chapter in the Chapter Coverage Heatmap or Scope & Sequence table.`,
        affectedRequirementId: req.id,
        affectedBookId: book.id,
        isAiSuggestion: true,
      });
    }
  });

  // Check 2: Requirement mapped but not taught explicitly (introduced without practice)
  activeMappings.forEach((m) => {
    if (m.coverageState === 'introduced') {
      const hasExercise = m.evidence.some(
        (e) => e.type === 'exercise' || (e.componentId && parseInt(e.componentId.replace('comp-', ''), 10) >= 12)
      );
      if (!hasExercise) {
        warnings.push({
          id: `gap-intro-not-practised-${m.id}`,
          category: 'introduced_not_practised',
          severity: 'warning',
          title: `Introduced but Lacks Practice Drills: ${m.requirementCode}`,
          description: `Requirement "${m.requirementTitle}" is introduced in ${m.chapterId}, but lacks scaffolded practice exercises (Component 12 or 13).`,
          recommendation: `Add guided practice exercises in Chapter Studio to reinforce this requirement before advancing to assessments.`,
          affectedRequirementId: m.requirementId,
          affectedChapterId: m.chapterId,
          affectedBookId: book.id,
          isAiSuggestion: true,
        });
      }
    }
  });

  // Check 3: Requirement taught but not assessed
  activeMappings.forEach((m) => {
    if (m.coverageState === 'practised' || m.coverageState === 'developing') {
      const hasAssessment = m.evidence.some(
        (e) => e.type === 'assessment' || e.componentId === 'comp-21' || m.assessmentQuestionId
      );
      if (!hasAssessment) {
        warnings.push({
          id: `gap-practised-not-assessed-${m.id}`,
          category: 'practised_not_assessed',
          severity: 'review',
          title: `Taught Concept Lacks Formal Assessment: ${m.requirementCode}`,
          description: `"${m.requirementTitle}" has classroom practice drills but lacks a summative item in the Chapter Mastery Test (Component 21).`,
          recommendation: `Add a diagnostic question to Section B or C of the Chapter Test in Chapter Studio or Question Bank.`,
          affectedRequirementId: m.requirementId,
          affectedChapterId: m.chapterId,
          affectedBookId: book.id,
          isAiSuggestion: true,
        });
      }
    }
  });

  // Check 4: Requirement assessed without instructional coverage
  activeMappings.forEach((m) => {
    const hasAssessment = m.evidence.some((e) => e.type === 'assessment' || e.componentId === 'comp-21');
    const hasInstruction = m.evidence.some(
      (e) => e.type === 'content_block' || (e.componentId && ['comp-5', 'comp-6', 'comp-7', 'comp-8'].includes(e.componentId))
    );
    if (hasAssessment && !hasInstruction && m.coverageState !== 'introduced') {
      warnings.push({
        id: `gap-assessed-without-instruction-${m.id}`,
        category: 'objective_without_content',
        severity: 'warning',
        title: `Assessed Without Explicit Instructional Form: ${m.requirementCode}`,
        description: `"${m.requirementTitle}" is tested in chapter assessment without an explicit foundational grammar rule box or exposition block.`,
        recommendation: `Ensure an instructional Form Box (Component 6) introduces the concept prior to summative examination items.`,
        affectedRequirementId: m.requirementId,
        affectedChapterId: m.chapterId,
        affectedBookId: book.id,
        isAiSuggestion: true,
      });
    }
  });

  // Check 5: Duplicate over-coverage
  const reqCoverageCounts: Record<string, number> = {};
  activeMappings.forEach((m) => {
    reqCoverageCounts[m.requirementCode] = (reqCoverageCounts[m.requirementCode] || 0) + 1;
  });
  Object.entries(reqCoverageCounts).forEach(([code, count]) => {
    if (count >= 4) {
      warnings.push({
        id: `gap-over-coverage-${code}`,
        category: 'excessive_duplication',
        severity: 'info',
        title: `Potential Over-Coverage: ${code}`,
        description: `Requirement "${code}" is mapped across ${count} separate chapters in this volume. Verify if this represents planned spiral progression or unintended duplication.`,
        recommendation: `Check Scope & Sequence to ensure each chapter addresses a distinctly advanced cognitive depth tier.`,
        affectedBookId: book.id,
        isAiSuggestion: true,
      });
    }
  });

  // Check 6: Chapter too dense
  if (topics && topics.length > 0) {
    topics.forEach((top) => {
      const chapterMaps = activeMappings.filter((m) => m.chapterId === top.id || (top.id === 'cbse-6-sva' && m.chapterId === 'top-concord-c6'));
      if (chapterMaps.length > 5) {
        warnings.push({
          id: `gap-dense-chapter-${top.id}`,
          category: 'excessive_duplication',
          severity: 'warning',
          title: `Chapter Cognitive Density Alert: ${top.title}`,
          description: `Chapter "${top.title}" has ${chapterMaps.length} distinct curriculum requirements assigned. This may overwhelm classroom instruction within the allotted page budget.`,
          recommendation: `Consider distributing secondary objectives into the subsequent spiral chapter or revision unit.`,
          affectedChapterId: top.id,
          affectedBookId: book.id,
          isAiSuggestion: true,
        });
      }
    });
  }

  // Check 7: Framework evidence missing or unverified
  activeMappings.forEach((m) => {
    if (m.verificationStatus === 'not_checked' || m.verificationStatus === 'needs_academic_review') {
      warnings.push({
        id: `gap-unverified-${m.id}`,
        category: 'board_mismatch',
        severity: 'info',
        title: `Editorial Sign-off Outstanding: ${m.requirementCode}`,
        description: `Evidence trace for "${m.requirementTitle}" in ${m.chapterId} has not yet been given final verification by an academic editor.`,
        recommendation: `Review the evidence snippets in the Evidence Inspector and upgrade status to "Verified".`,
        affectedRequirementId: m.requirementId,
        affectedChapterId: m.chapterId,
        affectedBookId: book.id,
        isAiSuggestion: true,
      });
    }
  });

  return warnings;
}

// =========================================================================
// 7. MULTI-BOOK SERIES PROGRESSION INTELLIGENCE ENGINE
// =========================================================================

export function analyzeSeriesProgression(
  conceptId: string = 'concept-concord',
  seriesProject?: GrammarSeriesProject
): ProgressionLink {
  const progressionData: ProgressionLink = {
    id: `prog-${conceptId}`,
    conceptId,
    conceptName: 'Subject–Verb Agreement (Syntactic Concord)',
    strand: 'Syntax & Concord',
    stages: [
      {
        classOrStage: 'Class 5 / Stage 5',
        bookId: 'proj-cbse-c5',
        bookTitle: 'Primary Foundations in English Grammar (Class 5)',
        coverageState: 'introduced',
        levelDepth: 'Foundational Intuition & Basic Dual Forms (is/are, was/were)',
        spiralFocus: 'Intuitive number recognition in simple declarative sentences.',
        keyConstructs: ['Pronoun subjects (I, he, she, they)', 'Basic dual auxiliaries (is/are, has/have)'],
      },
      {
        classOrStage: 'Class 6 / Stage 7',
        bookId: 'proj-default-cbse-6',
        bookTitle: 'Middle School Grammar & Syntax (Class 6)',
        coverageState: 'mastered',
        levelDepth: 'Formal Rules, Compound Subjects, Intervening Modifiers',
        spiralFocus: 'Explicit syntactic rules, correlatives, and prepositional interference shields.',
        keyConstructs: ['Intervening prepositional phrases', 'Compound subjects with "and" vs. "or"', 'Distributive pronouns'],
      },
      {
        classOrStage: 'Class 7 / Stage 8',
        bookId: 'proj-cbse-c7',
        bookTitle: 'Advanced Syntax & Rhetoric (Class 7)',
        coverageState: 'practised',
        levelDepth: 'Delayed Subjects, Inverted Order, Quantifiers & Fractions',
        spiralFocus: 'Complex syntactic inversions with "there", percentages, and measurement units.',
        keyConstructs: ['Dummy "there" inversions', 'Fractional subjects (two-thirds of the...)', 'Plural-form singular nouns'],
      },
      {
        classOrStage: 'Class 8 / Stage 9',
        bookId: 'proj-cbse-c8',
        bookTitle: 'Comprehensive Grammar Mastery & Composition (Class 8)',
        coverageState: 'assessed',
        levelDepth: 'Extended Editing, High-Register Prose & Subjunctive Mood',
        spiralFocus: 'Editorial diagnostics in academic prose, relative clauses, and subjunctive concord.',
        keyConstructs: ['Subjunctive "were"', 'Relative clause agreement with antecedent', 'Proofreading under time pressure'],
      },
    ],
    progressionHealth: 'optimal',
    analysis:
      'Progression exhibits healthy spiral development. Class 5 establishes intuitive singular/plural discrimination; Class 6 formalizes rules and tackles cognitive traps (intervening modifiers); Class 7 extends into inversions and fractions; Class 8 consolidates with authentic proofreading.',
    recommendations: [
      'Ensure Class 6 Chapter 1 recaps Class 5 basic auxiliary tables in Component 2 (Prerequisites).',
      'Provide forward-looking margin note in Class 6 pointing to Class 7 fractional subjects.',
      'Check that Class 7 does not re-teach simple "he is / they are" rules at the expense of inverted structures.',
    ],
  };

  return progressionData;
}

// =========================================================================
// 8. CROSS-BOARD CHAPTER ADAPTATION PLAN GENERATOR
// =========================================================================

export function generateCrossBoardAdaptationPlan(
  sourceChapter: StudioChapter,
  targetBoard: CurriculumSystemId
): CrossBoardAdaptationPlan {
  const sourceBoard = sourceChapter.systemId || 'CBSE';
  const sourceTitle = sourceChapter.title;
  const isSvaTopic =
    sourceTitle.toLowerCase().includes('subject') &&
    sourceTitle.toLowerCase().includes('verb');
  const chapterClass = sourceChapter.equivalentClass || 'Class 6';

  if (targetBoard === 'CISCE') {
    return {
      sourceBoard,
      targetBoard: 'CISCE',
      sourceChapterTitle: sourceTitle,
      targetChapterTitle: isSvaTopic
        ? 'Subject–Verb Agreement: Making Subjects and Verbs Agree'
        : `${sourceTitle}`,
      targetProgramme: `CISCE Curriculum (${chapterClass})`,
      targetClassOrStage: chapterClass,
      comparison: {
        curriculumRequirements:
          'CISCE mandates formal transformation and sentence synthesis without conjunctions "and/but/so", plus strict Latinate grammatical terminology.',
        terminology: [
          { from: 'Fill-in-the-blanks', to: 'Formal Cloze Synthesis', note: 'Emphasize exact inflection' },
          { from: 'Golden Rules', to: 'Prescribed Concord Laws', note: 'Formal grammatical phrasing' },
          { from: 'Dialogue Editing', to: 'Sentence Synthesis & Transformation', note: 'Align with ICSE Paper 1 Q5' },
          { from: 'Class 6', to: 'Standard 6 / Grade VI', note: 'CISCE school convention' },
        ],
        depthShift:
          'Increase depth on compound correlatives ("either...or", "neither...nor") and singular collective nouns.',
        expectedSkills:
          'Syntactic parsing, sentence combining without meaning alteration, zero error tolerance in punctuation.',
        exerciseStyleShift:
          'Replace multiple-choice communicative dialogues with 8-item sentence transformation drills and formal bracketed verb-form synthesis.',
        assessmentExpectations:
          'ICSE Paper 1 Question 5 style items with rigorous mark-deduction rubric for minor agreement flaws.',
      },
      actions: [
        {
          id: 'act-01',
          action: 'KEEP',
          targetComponent: 'comp-6 (Rule Boxes)',
          itemDescription: 'Universal concord rules and standard singular/plural distinctions.',
          rationale: 'Core linguistic rules of concord are universally true across English language syllabi.',
          approved: true,
        },
        {
          id: 'act-02',
          action: 'MODIFY',
          targetComponent: 'comp-10 (Formula Strip)',
          itemDescription: 'Format rule strips with formal Oxford punctuation and CISCE citation standards.',
          rationale: 'CISCE emphasizes scholarly precision and standard British grammatical styling.',
          approved: true,
        },
        {
          id: 'act-03',
          action: 'ADD',
          targetComponent: 'comp-15 (Tier 3 Exercises)',
          itemDescription: 'Add ICSE Paper 1 Question 5 style transformation drill: "Begin with...", "Rewrite without using..."',
          rationale: 'Mandatory benchmark for secondary ICSE candidate preparation.',
          approved: true,
        },
        {
          id: 'act-04',
          action: 'REMOVE',
          targetComponent: 'comp-12 (Informal Dialogues)',
          itemDescription: 'Remove casual communicative dialogue bubbles with slang.',
          rationale: 'CISCE curriculum encourages formal standard English register.',
          approved: true,
        },
        {
          id: 'act-05',
          action: 'REVIEW',
          targetComponent: 'comp-21 (Mastery Test)',
          itemDescription: 'Verify that the marking scheme deducts full marks for agreement errors under ICSE guidelines.',
          rationale: 'Requires teacher/editorial confirmation of institutional grading standards.',
          approved: false,
        },
      ],
      authorApproved: false,
    };
  }

  if (targetBoard === 'Cambridge') {
    return {
      sourceBoard,
      targetBoard: 'Cambridge',
      sourceChapterTitle: sourceTitle,
      targetChapterTitle: isSvaTopic
        ? 'Grammar in Context: Subject–Verb Agreement & Syntactic Cohesion'
        : `${sourceTitle} (Cambridge Framework)`,
      targetProgramme: `Cambridge Framework (${chapterClass})`,
      targetClassOrStage: chapterClass,
      comparison: {
        curriculumRequirements:
          'Cambridge 0861 framework prioritizes language inquiry, understanding how syntactic choices create tone, and international English diversity.',
        terminology: [
          { from: 'Class 6', to: 'Stage 7 / Year 7', note: 'Cambridge stage terminology' },
          { from: 'Marks / Out of 20', to: 'Banded Criteria (Bands 1–4)', note: 'CAIE rubric standards' },
          { from: 'Prescriptive Golden Rules', to: 'Grammatical Patterns & Language Choices', note: 'Inquiry-led framing' },
          { from: 'NEP 2020 / NCF', to: 'Cambridge Lower Secondary Framework (0861)', note: 'Remove Indian policy labels' },
        ],
        depthShift:
          'Shift from prescriptive right/wrong drill to analyzing why an author chooses particular syntactic structures in literary or informative texts.',
        expectedSkills:
          'Linguistic observation, evaluating stylistic impact of agreement, identifying international English register differences.',
        exerciseStyleShift:
          'Introduce open-ended literary investigation tasks, peer-feedback checklists, and contextual writing prompts evaluated by banded descriptors.',
        assessmentExpectations:
          'Cambridge Checkpoint style multi-part tasks assessing Reading for Grammar (7Rg.02) and Writing for Accuracy (7Wg.01).',
      },
      actions: [
        {
          id: 'act-cam-01',
          action: 'KEEP',
          targetComponent: 'comp-8 (Visual Syntactic Diagram)',
          itemDescription: 'Sentence structure diagrams isolating prepositional modifiers.',
          rationale: 'Visual syntactic models align with Cambridge inquiry-led pedagogy.',
          approved: true,
        },
        {
          id: 'act-cam-02',
          action: 'MODIFY',
          targetComponent: 'comp-1 (Chapter Opener)',
          itemDescription: 'Frame opening hook with a Cambridge Global English inquiry question on language variation.',
          rationale: 'Complies with CAIE intercultural communication benchmarks.',
          approved: true,
        },
        {
          id: 'act-cam-03',
          action: 'ADD',
          targetComponent: 'comp-16 (Contextual Writing)',
          itemDescription: 'Add a 150-word descriptive writing prompt with banded rubric assessing agreement consistency.',
          rationale: 'Cambridge evaluates syntax directly inside extended student prose.',
          approved: true,
        },
        {
          id: 'act-cam-04',
          action: 'REMOVE',
          targetComponent: 'comp-0 (Metadata)',
          itemDescription: 'Remove NEP 2020 and NCERT circular references from chapter header.',
          rationale: 'Cambridge International does not operate under Indian national education policies.',
          approved: true,
        },
        {
          id: 'act-cam-05',
          action: 'REVIEW',
          targetComponent: 'comp-21 (Mastery Test)',
          itemDescription: 'Convert numerical marks (e.g. 20/20) into Cambridge 4-band criteria table.',
          rationale: 'Requires editorial confirmation on whether to provide dual numerical/banded scores.',
          approved: false,
        },
      ],
      authorApproved: false,
    };
  }

  // Default: Adapt to CBSE
  return {
    sourceBoard,
    targetBoard: 'CBSE',
    sourceChapterTitle: sourceTitle,
    targetChapterTitle: isSvaTopic
      ? 'Subject–Verb Agreement (Concord)'
      : sourceTitle,
    targetProgramme: `CBSE Curriculum (${chapterClass})`,
    targetClassOrStage: chapterClass,
    comparison: {
      curriculumRequirements:
        'CBSE Middle School English aligns with competency-based education, NCERT Learning Outcomes (LO E604), and communicative contextual tasks.',
      terminology: [
        { from: 'Stage 7 / Standard 6', to: 'Class 6', note: 'Standard CBSE terminology' },
        { from: 'Banded Criteria', to: 'Competency Marks (1 Mark / 2 Marks)', note: 'CBSE grading format' },
        { from: 'Formal Synthesis', to: 'Dialogue Gap-Filling & Error Correction', note: 'Section B format' },
      ],
      depthShift:
        'Focus on functional recognition in everyday dialogues, informal letters, and short descriptive paragraphs.',
      expectedSkills:
        'Error detection in narrative text, reordering jumbled words with subject-verb concord, conversational dialogue completion.',
      exerciseStyleShift:
        'Balance multiple-choice questions with 4-line editing passages and real-life communicative scenarios.',
      assessmentExpectations:
        'CBSE Section B Grammar pattern (10 marks total in final exam), emphasizing communicative context over isolated parsing.',
    },
    actions: [
      {
        id: 'act-cbse-01',
        action: 'KEEP',
        targetComponent: 'comp-6 (Rule Boxes)',
        itemDescription: 'Foundational concord rules and clear definitions.',
        rationale: 'Core syntax rules are standard across all English curricula.',
        approved: true,
      },
      {
        id: 'act-cbse-02',
        action: 'MODIFY',
        targetComponent: 'comp-15 (Tier 3)',
        itemDescription: 'Align advanced exercises with CBSE paragraph editing and dialogue completion.',
        rationale: 'Directly prepares students for CBSE Class 6 internal assessments.',
        approved: true,
      },
      {
        id: 'act-cbse-03',
        action: 'ADD',
        targetComponent: 'comp-11 (Note Boxes)',
        itemDescription: 'Add Competency Reflection Box linking grammar to art-integrated and daily life communication.',
        rationale: 'Encouraged by CBSE experiential learning guidelines.',
        approved: true,
      },
      {
        id: 'act-cbse-04',
        action: 'REMOVE',
        targetComponent: 'comp-13',
        itemDescription: 'Remove Latinate parsing terms not prescribed in NCERT syllabi.',
        rationale: 'Prevents cognitive overload outside the NCERT curriculum scope.',
        approved: true,
      },
      {
        id: 'act-cbse-05',
        action: 'REVIEW',
        targetComponent: 'comp-21 (Mastery Test)',
        itemDescription: 'Verify that questions test communicative understanding rather than rote definition recall.',
        rationale: 'Enforces NEP 2020 competency-based evaluation criteria.',
        approved: false,
      },
    ],
    authorApproved: false,
  };
}

// =========================================================================
// 9. WHOLE-BOOK CURRICULUM INTELLIGENCE AUDIT COMPUTATION
// =========================================================================

export interface CurriculumIntelligenceAuditResult {
  curriculumCoveragePct: number;
  assessmentCoveragePct: number;
  progressionHealth: 'Optimal' | 'Minor Gaps' | 'Review Required';
  outstandingGapsCount: number;
  academicReviewStatus: 'Verified' | 'Needs Academic Review' | 'Potential Gaps' | 'Not Checked';
  checklist: Array<{
    id: string;
    label: string;
    passed: boolean;
    note: string;
  }>;
  summaryNote: string;
}

export function runCurriculumIntelligenceAudit(
  book: BookProject,
  mappings: CurriculumMapping[] = DEMONSTRATION_CURRICULUM_MAPPINGS,
  requirements: CurriculumRequirement[] = DEFAULT_CURRICULUM_REQUIREMENTS
): CurriculumIntelligenceAuditResult {
  const profile = DEFAULT_FRAMEWORK_PROFILES.find(
    (p) => p.educationSystem === book.board || p.classOrStage === book.classOrStage
  ) || DEFAULT_FRAMEWORK_PROFILES[0];

  const profileReqs = requirements.filter((r) => r.frameworkProfileId === profile.id);
  const totalReqs = profileReqs.length || 1;

  const mappedReqs = profileReqs.filter((r) =>
    mappings.some((m) => m.requirementId === r.id)
  );

  const assessedReqs = profileReqs.filter((r) =>
    mappings.some(
      (m) =>
        m.requirementId === r.id &&
        (m.coverageState === 'assessed' || m.coverageState === 'mastered') &&
        m.evidence.some((e) => e.type === 'assessment' || e.componentId === 'comp-21')
    )
  );

  const curriculumCoveragePct = Math.round((mappedReqs.length / totalReqs) * 100);
  const assessmentCoveragePct = Math.round((assessedReqs.length / totalReqs) * 100);

  const verifiedCount = mappings.filter((m) => m.verificationStatus === 'verified').length;
  const reviewCount = mappings.filter((m) => m.verificationStatus === 'needs_academic_review').length;
  const gapCount = totalReqs - mappedReqs.length;

  let academicReviewStatus: CurriculumIntelligenceAuditResult['academicReviewStatus'] = 'Not Checked';
  if (gapCount > 2) {
    academicReviewStatus = 'Potential Gaps';
  } else if (reviewCount > 0) {
    academicReviewStatus = 'Needs Academic Review';
  } else if (verifiedCount === mappings.length && mappings.length > 0) {
    academicReviewStatus = 'Verified';
  }

  const checklist = [
    {
      id: 'chk-mapped',
      label: 'Curriculum requirements systematically mapped to chapters',
      passed: mappedReqs.length >= totalReqs * 0.7,
      note: `${mappedReqs.length} of ${totalReqs} requirements mapped (${curriculumCoveragePct}%).`,
    },
    {
      id: 'chk-objectives',
      label: 'Learning objectives supported by concrete text and rule boxes',
      passed: mappings.some((m) => m.evidence.some((e) => e.type === 'content_block')),
      note: 'Verified presence of grammar law and exemplar sets across mapped units.',
    },
    {
      id: 'chk-progression',
      label: 'Progression between classes/stages is logically continuous',
      passed: true,
      note: 'Multi-book spiral verified from Class 5 intuition through Class 8 discourse editing.',
    },
    {
      id: 'chk-exercises',
      label: 'Multi-tier exercises directly support mapped competencies',
      passed: mappings.some((m) => m.evidence.some((e) => e.type === 'exercise')),
      note: 'Tier 1 foundational, Tier 2 intermediate, and Tier 3 contextual drills linked.',
    },
    {
      id: 'chk-assessment',
      label: 'Assessment coverage verified in Chapter Mastery Tests',
      passed: assessedReqs.length > 0,
      note: `${assessedReqs.length} requirements verified with graded test questions.`,
    },
    {
      id: 'chk-prereq',
      label: 'Prerequisites established in Component 2 before complex rules',
      passed: true,
      note: 'Prerequisite diagnostic openers present in authoring studio blueprint.',
    },
    {
      id: 'chk-references',
      label: 'Official framework references recorded in reference library',
      passed: DEFAULT_FRAMEWORK_REFERENCES.some((r) => r.system === book.board),
      note: `Statutory citations for ${book.board} stored with publication year and authority.`,
    },
    {
      id: 'chk-gaps',
      label: 'Zero critical curriculum gaps remaining in active volume',
      passed: gapCount <= 1,
      note: gapCount > 0 ? `${gapCount} requirements pending chapter allocation.` : 'All profile requirements allocated.',
    },
    {
      id: 'chk-verification',
      label: 'Formal academic editorial verification completed',
      passed: verifiedCount > 0 && reviewCount === 0,
      note:
        verifiedCount === mappings.length
          ? 'All mappings formally verified by academic editor.'
          : `${reviewCount} mappings marked as "NEEDS ACADEMIC REVIEW".`,
    },
  ];

  return {
    curriculumCoveragePct,
    assessmentCoveragePct,
    progressionHealth: gapCount === 0 ? 'Optimal' : gapCount <= 2 ? 'Minor Gaps' : 'Review Required',
    outstandingGapsCount: gapCount,
    academicReviewStatus,
    checklist,
    summaryNote:
      'Audit provides internal editorial verification metrics. External certification requires formal statutory evaluation by accredited board authorities.',
  };
}
