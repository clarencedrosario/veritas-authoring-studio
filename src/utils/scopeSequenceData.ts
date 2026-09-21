import {
  ScopeSequenceMasterRow,
  ConceptDependencyLink,
  ScopeSequenceAuditFinding,
  SystemSequenceAdaptationProposal,
  CurriculumSystemId,
  GrammarSeriesProject,
  BookProject,
  EvidenceVerificationStatus,
  ScopeSequenceColumnDef,
} from '../types';

export type { ScopeSequenceMasterRow };

// ============================================================================
// COLUMN DEFINITIONS FOR MASTER TABLE (26 COLUMNS)
// ============================================================================
export type MasterTableColumnDef = ScopeSequenceColumnDef;

export const SCOPE_SEQUENCE_COLUMNS: ScopeSequenceColumnDef[] = [
  { id: 'seq_num', key: 'seq_num', label: '#', category: 'Structure', defaultVisible: true, minWidth: 48 },
  { id: 'unit_title', key: 'unit_title', label: 'Unit', category: 'Structure', defaultVisible: true, minWidth: 160 },
  { id: 'chapter_title', key: 'chapter_title', label: 'Chapter Title', category: 'Structure', defaultVisible: true, minWidth: 200 },
  { id: 'curriculum_code', key: 'curriculum_code', label: 'Internal Mapping ID', category: 'Curriculum', defaultVisible: true, minWidth: 150 },
  { id: 'official_ref', key: 'official_ref', label: 'Official Board Ref', category: 'Curriculum', defaultVisible: true, minWidth: 170 },
  { id: 'curriculum_desc', key: 'curriculum_desc', label: 'Curriculum Link & Standard', category: 'Curriculum', defaultVisible: true, minWidth: 220 },
  { id: 'evidence_status', key: 'evidence_status', label: 'Evidence Status', category: 'Governance', defaultVisible: true, minWidth: 140 },
  { id: 'learning_objectives', key: 'learning_objectives', label: 'Learning Objectives', category: 'Pedagogy', defaultVisible: true, minWidth: 220 },
  { id: 'current_treatment', key: 'current_treatment', label: 'Current Stage Treatment', category: 'Pedagogy', defaultVisible: false, minWidth: 200 },
  { id: 'prior_learning', key: 'prior_learning', label: 'Prior Learning', category: 'Pedagogy', defaultVisible: false, minWidth: 180 },
  { id: 'prerequisites', key: 'prerequisites', label: 'Prerequisites', category: 'Pedagogy', defaultVisible: true, minWidth: 180 },
  { id: 'next_progression', key: 'next_progression', label: 'Next Progression', category: 'Pedagogy', defaultVisible: false, minWidth: 180 },
  { id: 'depth_level', key: 'depth_level', label: 'Depth Level', category: 'Pedagogy', defaultVisible: true, minWidth: 120 },
  { id: 'mastery_stage', key: 'mastery_stage', label: 'Mastery Stage', category: 'Pedagogy', defaultVisible: true, minWidth: 120 },
  { id: 'teaching_lessons', key: 'teaching_lessons', label: 'Lessons', category: 'Instruction', defaultVisible: true, minWidth: 80 },
  { id: 'target_pages', key: 'target_pages', label: 'Pages', category: 'Instruction', defaultVisible: true, minWidth: 80 },
  { id: 'exercise_profile', key: 'exercise_profile', label: 'Exercise Profile', category: 'Instruction', defaultVisible: true, minWidth: 180 },
  { id: 'assessment_evidence', key: 'assessment_evidence', label: 'Assessment Evidence', category: 'Instruction', defaultVisible: true, minWidth: 180 },
  { id: 'key_vocabulary', key: 'key_vocabulary', label: 'Key Vocabulary', category: 'Pedagogy', defaultVisible: false, minWidth: 160 },
  { id: 'skills_integration', key: 'skills_integration', label: 'Skills Integration', category: 'Connections', defaultVisible: false, minWidth: 160 },
  { id: 'writing_connection', key: 'writing_connection', label: 'Writing Link', category: 'Connections', defaultVisible: false, minWidth: 160 },
  { id: 'reading_connection', key: 'reading_connection', label: 'Reading Link', category: 'Connections', defaultVisible: false, minWidth: 160 },
  { id: 'speaking_listening', key: 'speaking_listening', label: 'Oral / Listening', category: 'Connections', defaultVisible: false, minWidth: 160 },
  { id: 'cross_curricular', key: 'cross_curricular', label: 'Cross-Curricular', category: 'Connections', defaultVisible: false, minWidth: 160 },
  { id: 'diff_support', key: 'diff_support', label: 'Support Differentiation', category: 'Instruction', defaultVisible: false, minWidth: 180 },
  { id: 'diff_extension', key: 'diff_extension', label: 'Extension Challenge', category: 'Instruction', defaultVisible: false, minWidth: 180 },
  { id: 'misconceptions', key: 'misconceptions', label: 'Misconceptions', category: 'Pedagogy', defaultVisible: false, minWidth: 180 },
  { id: 'board_notes', key: 'board_notes', label: 'Board / System Notes', category: 'Governance', defaultVisible: false, minWidth: 180 },
  { id: 'framework_association', key: 'framework_association', label: 'Framework Policy Association', category: 'Governance', defaultVisible: false, minWidth: 190 },
  { id: 'production_status', key: 'production_status', label: 'Production Status', category: 'Governance', defaultVisible: true, minWidth: 110 },
];

// ============================================================================
// DEMO DATA: CBSE CLASS 6 COMPREHENSIVE SCOPE & SEQUENCE
// ============================================================================
export const CBSE_CLASS_6_DEMO_ROWS: ScopeSequenceMasterRow[] = [
  {
    id: 'seq-cbse6-01',
    seqNumber: 1,
    unitId: 'unit-c6-1',
    unitTitle: 'Unit 1: Foundations of Syntax & Agreement',
    chapterId: 'c6-top-sent',
    chapterNumber: 1,
    chapterTitle: 'Chapter 1: The Sentence: Architecture & Types',
    conceptId: 'concept-sentence-types',
    conceptTitle: 'Sentence Classification & Structure',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-01',
    internalMappingId: 'VTR-CBSE6-01',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification (In Review)',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'NCF-SE / CBSE Class 6 English: Sentential structure, subject-predicate demarcation, and clause boundaries.',
    currentTreatment: 'Class 6 treatment: Complete taxonomy of four sentence types, subject-predicate isolation in inverted literary order, and fragment elimination.',
    priorLearning: 'Class 5 (Prior Learning): Basic declarative sentence capitalisation and period punctuation.',
    nextProgression: 'Class 7 (Next Progression): Clause hierarchy, relative clauses, and complex sentence synthesis.',
    learningObjectives: [
      'Distinguish between complete grammatical sentences and fragments',
      'Identify the complete subject and complete predicate in diverse sentence positions',
      'Classify assertive, interrogative, imperative, and exclamatory structures',
    ],
    prerequisites: ['Basic sentence sense', 'Capital letters and terminal punctuation', 'Simple word order'],
    newLearning: 'Class 6: Inverted subject-predicate order and complex exclamatory transformations.',
    depthLevel: 'Intermediate',
    masteryStage: 'Mastered',
    masteryCode: 'M',
    recommendedTeachingLessons: 4,
    recommendedTeachingHours: 3.5,
    exerciseProfile: [
      { id: 'ex-1a', label: 'Ex A', name: 'Subject-Predicate Split', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Underline complete subject, circle predicate' },
      { id: 'ex-1b', label: 'Ex B', name: 'Fragment Completion', pedagogicalType: 'controlled_practice', targetQuestionsCount: 6, description: 'Turn sentence fragments into grammatical assertions' },
      { id: 'ex-1c', label: 'Ex C', name: 'Functional Classification', pedagogicalType: 'application', targetQuestionsCount: 10, description: 'Classify and punctuate mixed sentences' },
      { id: 'ex-1d', label: 'Ex D', name: 'Syntactic Inversion', pedagogicalType: 'higher_order_challenge', targetQuestionsCount: 4, description: 'Find subjects in inverted poetry extracts' },
    ],
    assessmentEvidence: ['Diagnostic Baseline Check', 'Formative Exit Ticket 1', 'End-of-Chapter Test 1'],
    assessmentAlignments: [
      { objectiveId: 'obj-1.1', objectiveText: 'Subject-predicate demarcation', taught: true, practised: true, assessed: true, diagnosticInstrument: 'Baseline diagnostic quiz', chapterAssessmentInstrument: 'Ch 1 Test Sec A' },
      { objectiveId: 'obj-1.2', objectiveText: 'Four functional sentence types', taught: true, practised: true, assessed: true, formativeInstrument: 'Classroom worksheet', chapterAssessmentInstrument: 'Ch 1 Test Sec B' },
    ],
    keyVocabulary: ['Subject', 'Predicate', 'Fragment', 'Imperative', 'Inversion'],
    skillsIntegration: 'Syntactic awareness in reading comprehension and proofreading.',
    writingConnection: 'Sentence variety in paragraph openings and topic sentences.',
    readingConnection: 'Identifying main clause vs subordinate remarks in narrative text.',
    speakingListeningConnection: 'Intonation patterns for interrogative vs exclamatory expressions.',
    crossCurricularConnection: 'Science hypothesis formulation using assertive declarative syntax.',
    differentiationSupport: 'Color-coded visual cue cards separating who/what (subject) from action/state (predicate).',
    differentiationExtension: 'Analyze poetic inversions from Tennyson or Wordsworth extracts.',
    commonMisconceptions: ['Assuming subject is always the very first word in the sentence.'],
    boardSystemNotes: 'Forms the foundational prerequisite for CBSE Section B editing and gap-filling.',
    evidenceStatus: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
    evidenceCitation: 'NCERT Learning Outcomes Grade 6, LO E6.1, p. 28; CBSE Curriculum Guidelines (Review Pending).',
    evidenceRecord: {
      claim: 'Sentence Classification & Subject-Predicate Demarcation',
      status: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      sourceTitle: 'NCERT Learning Outcomes at Elementary Stage',
      issuingOrganisation: 'NCERT / CBSE',
      documentTitle: 'Learning Outcomes at the Elementary Stage (English)',
      versionOrYear: '2023–2024',
      pageOrSection: 'p. 28, LO E6.1',
      citationReference: 'NCERT Learning Outcomes Grade 6, LO E6.1, p. 28.',
      editorialNotes: 'Source attached by curriculum team; formal gazette audit pending.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Completed',
    estimatedPages: 12,
    teacherNotes: 'Ensure students understand that the subject can follow the verb in inverted clauses.',
    authorNotes: 'Use authentic Indian context examples alongside classic literary snippets.',
  },
  {
    id: 'seq-cbse6-02',
    seqNumber: 2,
    unitId: 'unit-c6-2',
    unitTitle: 'Unit 2: Nominal Structures & Determiners',
    chapterId: 'c6-top-nouns',
    chapterNumber: 2,
    chapterTitle: 'Chapter 2: Nouns: Classes, Number & Gender',
    conceptId: 'concept-nouns',
    conceptTitle: 'Noun Morphology, Countability & Case',
    strand: 'Parts of Speech',
    curriculumMappingCode: 'VTR-CBSE6-02',
    internalMappingId: 'VTR-CBSE6-02',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'NCF-SE Nominal domain: Abstract nouns, irregular plurals, countability, and possessive genitive.',
    currentTreatment: 'Class 6 treatment: Noun morphology, abstract nominalisation using suffixes (-tion, -ness), zero plurals, and genitive apostrophe rules.',
    priorLearning: 'Class 5 (Prior Learning): Common and proper nouns; simple regular plurals with -s/-es.',
    nextProgression: 'Class 7 (Next Progression): Nominal clauses, gerundial nouns, and compound noun plurals.',
    learningObjectives: [
      'Distinguish countable from uncountable nouns and apply appropriate quantifiers',
      'Form abstract nouns from adjectives, verbs, and common nouns using derivational affixes',
      'Apply correct apostrophe placement for singular, regular plural, and irregular plural possession',
    ],
    prerequisites: ['Basic noun recognition', 'Regular plural -s/-es rules'],
    newLearning: 'Class 6: Countability constraints, zero plurals (sheep/aircraft), and compound possessives.',
    depthLevel: 'Intermediate',
    masteryStage: 'Reinforced',
    masteryCode: 'R',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.0,
    exerciseProfile: [
      { id: 'ex-2a', label: 'Ex A', name: 'Countable vs Uncountable Sort', pedagogicalType: 'recognition', targetQuestionsCount: 10, description: 'Categorize abstract and mass nouns' },
      { id: 'ex-2b', label: 'Ex B', name: 'Abstract Noun Formation', pedagogicalType: 'controlled_practice', targetQuestionsCount: 8, description: 'Derive abstract nouns using -tion, -ness, -hood' },
      { id: 'ex-2c', label: 'Ex C', name: 'Possessive Apostrophe Mastery', pedagogicalType: 'editing_correction', targetQuestionsCount: 8, description: 'Correct misplaced apostrophes in student passages' },
      { id: 'ex-2d', label: 'Ex D', name: 'Contextual Composition', pedagogicalType: 'contextual_application', targetQuestionsCount: 1, description: 'Write a museum descriptive paragraph highlighting concrete vs abstract nouns' },
    ],
    assessmentEvidence: ['Diagnostic Drill 2', 'Formative Worksheet 2', 'Ch 2 Section Quiz'],
    assessmentAlignments: [
      { objectiveId: 'obj-2.1', objectiveText: 'Countability and mass noun quantifiers', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-2.2', objectiveText: 'Abstract derivation with affixes', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-2.3', objectiveText: 'Apostrophe in irregular plurals (children\'s, men\'s)', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Countable', 'Uncountable', 'Abstract', 'Collective', 'Genitive Case'],
    skillsIntegration: 'Vocabulary enrichment through morphological derivation.',
    writingConnection: 'Using precise abstract nouns to replace weak adjective-noun phrases.',
    readingConnection: 'Extracting nominal themes in non-fiction texts.',
    speakingListeningConnection: 'Pronunciation of plural inflections (/s/, /z/, /ɪz/).',
    crossCurricularConnection: 'Social Studies historical terms (monarchy, chivalry, freedom).',
    differentiationSupport: 'Root word plus affix expansion table.',
    differentiationExtension: 'Latin and Greek loan plurals (basis/bases, crisis/crises).',
    commonMisconceptions: ['Pluralizing mass nouns like "informations" or "furnitures".'],
    boardSystemNotes: 'Critical for avoiding spelling and grammatical penalties in writing sections.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'CBSE Syllabus Guidelines for Middle School English Grammar (Editorial Model).',
    evidenceRecord: {
      claim: 'Noun Morphology & Countability',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial demonstration model row. Requires primary board gazette page citation before verification.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'In Review',
    estimatedPages: 14,
    teacherNotes: 'Highlight that collective nouns take singular verbs when acting as a unified body.',
  },
  {
    id: 'seq-cbse6-03',
    seqNumber: 3,
    unitId: 'unit-c6-2',
    unitTitle: 'Unit 2: Nominal Structures & Determiners',
    chapterId: 'c6-top-pron',
    chapterNumber: 3,
    chapterTitle: 'Chapter 3: Pronouns: Personal, Relative & Distributive',
    conceptId: 'concept-pronouns',
    conceptTitle: 'Pronominal Categories & Antecedent Agreement',
    strand: 'Parts of Speech',
    curriculumMappingCode: 'VTR-CBSE6-03',
    internalMappingId: 'VTR-CBSE6-03',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Pronoun case (subjective, objective, possessive), relative pronouns (who, whom, which, that), and indefinite distributives.',
    currentTreatment: 'Class 6 treatment: Distributive pronouns (each, either, neither), relative clause connectors, and antecedent concord.',
    priorLearning: 'Class 5 (Prior Learning): Personal and possessive pronouns (he, she, it, mine, yours).',
    nextProgression: 'Class 7 (Next Progression): Indefinite pronouns, reciprocal pronouns, and case inflection in elliptical clauses.',
    learningObjectives: [
      'Maintain antecedent-pronoun agreement in number, gender, and person',
      'Select correct relative pronouns for personal vs non-personal antecedents',
      'Recognize that distributive pronouns (each, either, neither) are grammatically singular',
    ],
    prerequisites: ['Noun number and gender', 'Subject vs object position in sentence'],
    newLearning: 'Class 6: Distributive, relative pronouns, and antecedent concord.',
    depthLevel: 'Intermediate',
    masteryStage: 'Developing',
    masteryCode: 'D',
    recommendedTeachingLessons: 4,
    recommendedTeachingHours: 3.5,
    exerciseProfile: [
      { id: 'ex-3a', label: 'Ex A', name: 'Antecedent Mapping', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Identify pronoun and trace its antecedent' },
      { id: 'ex-3b', label: 'Ex B', name: 'Case Selection Drill', pedagogicalType: 'controlled_practice', targetQuestionsCount: 10, description: 'Choose between I/me, he/him, who/whom' },
      { id: 'ex-3c', label: 'Ex C', name: 'Relative Clause Synthesis', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 6, description: 'Combine two sentences using who/which/whose' },
      { id: 'ex-3d', label: 'Ex D', name: 'Editing Distributives', pedagogicalType: 'editing_correction', targetQuestionsCount: 5, description: 'Correct pronoun disagreement errors' },
    ],
    assessmentEvidence: ['Weekly Assessment Quiz', 'Sentence Synthesis Rubric'],
    assessmentAlignments: [
      { objectiveId: 'obj-3.1', objectiveText: 'Subjective vs objective case after prepositions', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-3.2', objectiveText: 'Distributive pronoun singularity', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Antecedent', 'Subjective Case', 'Objective Case', 'Distributive', 'Relative'],
    skillsIntegration: 'Sentence combining to eliminate repetitive nominal clauses.',
    writingConnection: 'Improving cohesion in narrative and explanatory essays.',
    readingConnection: 'Resolving pronoun reference ambiguity in complex narratives.',
    speakingListeningConnection: 'Colloquial vs formal pronoun usage ("It is I" vs "It is me").',
    crossCurricularConnection: 'Clarity in mathematics problem statement phrasing.',
    differentiationSupport: 'Antecedent connector arrows on printed passages.',
    differentiationExtension: 'Exploration of gender-neutral singular "they" in contemporary usage.',
    commonMisconceptions: ['Using "myself" as a replacement for "I" or "me".', 'Using plural pronoun with "everyone".'],
    boardSystemNotes: 'Frequent testing slot in CBSE gap-filling dialogues.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'NCERT Grade 6 LO E6.3; CBSE Secondary Circular (Demonstration Record).',
    evidenceRecord: {
      claim: 'Pronominal Categories & Antecedent Agreement',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial demo mapping. Requires formal board publication citation.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Drafting',
    estimatedPages: 12,
  },
  {
    id: 'seq-cbse6-04',
    seqNumber: 4,
    unitId: 'unit-c6-2',
    unitTitle: 'Unit 2: Nominal Structures & Determiners',
    chapterId: 'c6-top-det',
    chapterNumber: 4,
    chapterTitle: 'Chapter 4: Determiners & Quantifiers',
    conceptId: 'concept-determiners',
    conceptTitle: 'Articles, Demonstratives, Possessives & Quantifiers',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-04',
    internalMappingId: 'VTR-CBSE6-04',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Definite/indefinite article phonetic rules, quantifiers (few/a few, little/a little, much/many).',
    currentTreatment: 'Class 6 treatment: Article phonetic initial sound distinctions, omission of articles, and quantifier nuance (few vs a few).',
    priorLearning: 'Class 5 (Prior Learning): Basic a, an, the usage.',
    nextProgression: 'Class 7 (Next Progression): Demonstrative and distributive determiners, and partitive constructions.',
    learningObjectives: [
      'Apply indefinite articles based on initial phonetic sound rather than spelling letter',
      'Differentiate between "few" / "a few" and "little" / "a little" in communicative tone',
      'Select quantifiers according to noun countability constraints',
    ],
    prerequisites: ['Noun countability', 'Vowel vs consonant sound distinction'],
    newLearning: 'Class 6: Quantifier nuance, omission of articles, and phonetic silent-h exceptions.',
    depthLevel: 'Intermediate',
    masteryStage: 'Mastered',
    masteryCode: 'M',
    recommendedTeachingLessons: 4,
    recommendedTeachingHours: 3.5,
    exerciseProfile: [
      { id: 'ex-4a', label: 'Ex A', name: 'Phonetic Article Selection', pedagogicalType: 'controlled_practice', targetQuestionsCount: 10, description: 'Fill a/an before silent-h and vowel-letter consonant sounds (an honest man, a university)' },
      { id: 'ex-4b', label: 'Ex B', name: 'Quantifier Discrimination', pedagogicalType: 'application', targetQuestionsCount: 8, description: 'Choose between few, a few, little, a little' },
      { id: 'ex-4c', label: 'Ex C', name: 'Article Omission Editing', pedagogicalType: 'editing_correction', targetQuestionsCount: 6, description: 'Remove redundant "the" before abstract and mass nouns' },
    ],
    assessmentEvidence: ['Formative Worksheet', 'Article Fillers in Reading Comprehension'],
    assessmentAlignments: [
      { objectiveId: 'obj-4.1', objectiveText: 'Article phonetic selection', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-4.2', objectiveText: 'Quantifier countability alignment', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Determiner', 'Definite Article', 'Indefinite Article', 'Quantifier', 'Phonetic Initial'],
    skillsIntegration: 'Proofreading for accurate article usage in formal writing.',
    writingConnection: 'Descriptive precision in factual reports.',
    readingConnection: 'Noticing nuance in rhetorical passages ("few friends" vs "a few friends").',
    speakingListeningConnection: 'Oral pronunciation of "the" (/ðiː/ before vowels, /ðə/ before consonants).',
    crossCurricularConnection: 'Scientific descriptions of quantities and specimens.',
    differentiationSupport: 'Phonetic sound chart pairing initial sounds with symbols.',
    differentiationExtension: 'Zero article rules with names of languages, meals, and institutions.',
    commonMisconceptions: ['Writing "an university" because the word begins with letter U.'],
    boardSystemNotes: 'CBSE Class 6 and 10 test article omission and quantifiers directly.',
    evidenceStatus: 'MAPPED_SOURCE_REQUIRED',
    evidenceCitation: '',
    evidenceRecord: {
      claim: 'Determiners & Quantifiers',
      status: 'MAPPED_SOURCE_REQUIRED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Mapped in sequence model; primary gazetted document reference required.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'In Review',
    estimatedPages: 12,
  },
  {
    id: 'seq-cbse6-05',
    seqNumber: 5,
    unitId: 'unit-c6-3',
    unitTitle: 'Unit 3: Verbal Architecture, Tenses & Voice',
    chapterId: 'c6-top-verbs',
    chapterNumber: 5,
    chapterTitle: 'Chapter 5: Verbs: Finite, Non-Finite & Auxiliaries',
    conceptId: 'concept-verbs-finite',
    conceptTitle: 'Finite Verb Predication & Primary Auxiliaries',
    strand: 'Parts of Speech',
    curriculumMappingCode: 'VTR-CBSE6-05',
    internalMappingId: 'VTR-CBSE6-05',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Finite vs non-finite distinction, primary auxiliaries (be, have, do), and main lexical verbs.',
    currentTreatment: 'Class 6 treatment: Finite inflection constraints (tense, number, person), introduction of non-finite infinitives, and auxiliary verb phrases.',
    priorLearning: 'Class 5 (Prior Learning): Action verbs and simple helping verbs (is/are/was/were).',
    nextProgression: 'Class 7 (Next Progression): Participles as adjectives, gerunds as subjects, and modal auxiliary perfection.',
    learningObjectives: [
      'Distinguish finite verbs (inflected for tense, person, number) from non-finite forms (infinitives, participles, gerunds)',
      'Recognize primary auxiliaries functioning as helping verbs versus main verbs',
      'Identify the complete verbal phrase including split auxiliaries',
    ],
    prerequisites: ['Sentence predicate recognition', 'Past tense forms of irregular verbs'],
    newLearning: 'Class 6: Finite inflection constraints, non-finite introduction, and auxiliary combinations.',
    depthLevel: 'Intermediate',
    masteryStage: 'Developing',
    masteryCode: 'D',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.5,
    exerciseProfile: [
      { id: 'ex-5a', label: 'Ex A', name: 'Finite vs Non-Finite Classification', pedagogicalType: 'recognition', targetQuestionsCount: 10, description: 'Underline finite verb, box non-finite infinitive or participle' },
      { id: 'ex-5b', label: 'Ex B', name: 'Primary Auxiliary Drill', pedagogicalType: 'controlled_practice', targetQuestionsCount: 8, description: 'Identify whether be/have/do functions as auxiliary or main verb' },
      { id: 'ex-5c', label: 'Ex C', name: 'Verb Phrase Expansion', pedagogicalType: 'application', targetQuestionsCount: 6, description: 'Construct compound verb phrases with modal and perfect auxiliaries' },
    ],
    assessmentEvidence: ['Unit Diagnostic', 'Verb Phrase Diagramming Quiz'],
    assessmentAlignments: [
      { objectiveId: 'obj-5.1', objectiveText: 'Finite verb inflection recognition', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-5.2', objectiveText: 'Primary auxiliary functions', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Finite Verb', 'Non-Finite', 'Infinitive', 'Primary Auxiliary', 'Lexical Verb'],
    skillsIntegration: 'Essential foundation for tense formation, voice, and concord.',
    writingConnection: 'Eliminating run-on sentences and comma splices with finite verbs.',
    readingConnection: 'Recognizing tense consistency across extended paragraphs.',
    speakingListeningConnection: 'Contractions with auxiliaries (doesn\'t, haven\'t, won\'t).',
    crossCurricularConnection: 'Historical timelines and chronological reports.',
    differentiationSupport: 'Tense-shift test (change time from today to yesterday to find finite verb).',
    differentiationExtension: 'Introduction to gerunds functioning as subject complements.',
    commonMisconceptions: ['Treating infinitives (to go) or participles (singing) as finite predicates.'],
    boardSystemNotes: 'Vital prerequisite for Subject-Verb Concord and Tenses.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'NCERT Learning Outcomes Grade 6, E6.5 (Demonstration Model).',
    evidenceRecord: {
      claim: 'Finite Verb Predication & Auxiliaries',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial demonstration data. Awaiting gazetted syllabus verification.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Completed',
    estimatedPages: 14,
  },
  {
    id: 'seq-cbse6-06',
    seqNumber: 6,
    unitId: 'unit-c6-1',
    unitTitle: 'Unit 1: Foundations of Syntax & Agreement',
    chapterId: 'c6-top-1',
    chapterNumber: 6,
    chapterTitle: 'Chapter 6: Subject-Verb Concord / Agreement',
    conceptId: 'concept-concord',
    conceptTitle: 'Subject-Verb Concord / Agreement',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-06',
    internalMappingId: 'VTR-CBSE6-06',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification (In Review)',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'NCF-SE Syntax Domain / CBSE Middle School Core: Mandatory Section B Grammar component. Concord across intervening prepositional phrases, collective nouns, distributive pronouns, correlative pairs, and plural-form singular nouns.',
    currentTreatment: 'Class 6 treatment: Formal concord suite: head noun isolation with intervening prepositional phrases, proximity rule with correlatives, and nouns plural in form but singular in concept.',
    priorLearning: 'Class 5 (Prior Learning): Basic concord with simple nouns (The boy runs / The boys run) and basic compound subjects joined by "and".',
    nextProgression: 'Class 7 (Next Progression): Notional concord vs grammatical concord, inverted sentence concord, and advanced indefinite expressions.',
    learningObjectives: [
      'Match subject grammatical number and person with corresponding finite verb inflections in present and past tenses',
      'Identify the true head noun in sentences containing intervening prepositional or parenthetical phrases (e.g. "as well as", "along with", "together with")',
      'Apply proximity agreement with correlative conjunctions ("either... or", "neither... nor")',
      'Enforce singular concord with indefinite pronouns ("each", "everyone", "someone", "neither of")',
      'Distinguish collective noun unity (singular verb) from fractional division of members (plural verb)',
      'Apply singular verbs to nouns plural in form but singular in meaning (e.g. "news", "mathematics", "measles", "physics")',
    ],
    prerequisites: [
      'Subject and predicate identification (Chapter 1)',
      'Noun number: singular vs plural inflections (Chapter 2)',
      'Distributive and indefinite pronouns (Chapter 3)',
      'Finite verb identification and third-person singular -s/-es inflection (Chapter 5)',
    ],
    newLearning: 'Class 6: Comprehensive formal concord suite: intervening phrases, proximity rule with correlatives, collective nouns, and nouns plural in form but singular in meaning.',
    depthLevel: 'Analytical',
    masteryStage: 'Mastered',
    masteryCode: 'M',
    recommendedTeachingLessons: 6,
    recommendedTeachingHours: 5.0,
    exerciseProfile: [
      { id: 'ex-6a', label: 'Ex A', name: 'Recognition & Head Noun Identification', pedagogicalType: 'recognition', targetQuestionsCount: 10, description: 'Underline true head noun, eliminate intervening prepositional phrase, and select correct verb' },
      { id: 'ex-6b', label: 'Ex B', name: 'Controlled Agreement Practice', pedagogicalType: 'controlled_practice', targetQuestionsCount: 12, description: 'Fill in brackets with correct present tense form (is/are, has/have, does/do, writes/write)' },
      { id: 'ex-6c', label: 'Ex C', name: 'Distributive & Indefinite Concord', pedagogicalType: 'application', targetQuestionsCount: 8, description: 'Apply singular concord to sentences beginning with each, every, neither of, either of' },
      { id: 'ex-6d', label: 'Ex D', name: 'Error Identification & Proofreading', pedagogicalType: 'editing_correction', targetQuestionsCount: 8, description: 'Identify and correct concord errors in a continuous newspaper report passage' },
      { id: 'ex-6e', label: 'Ex E', name: 'Correlative Sentence Transformation', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 6, description: 'Combine sentences using neither... nor / either... or enforcing proximity rule' },
      { id: 'ex-6f', label: 'Ex F', name: 'Contextual Dialogue Filling', pedagogicalType: 'contextual_application', targetQuestionsCount: 5, description: 'Complete a conversational exchange following board gap-filling format' },
      { id: 'ex-6g', label: 'Ex G', name: 'Higher-Order Challenge & Inversion', pedagogicalType: 'higher_order_challenge', targetQuestionsCount: 4, description: 'Concord in inverted sentences ("On the hill stands/stand three ancient oak trees")' },
    ],
    assessmentEvidence: [
      'Prior Knowledge Diagnostic Check (5 mins)',
      'Formative Exit Ticket: Proximity Rule Drill',
      'Class 6 Unit Assessment 1: Subject-Verb Concord (10 marks)',
      'Term 1 Mid-Year Examination Grammar Section B (3 marks slot)',
      'Cumulative Error Correction Portfolio',
    ],
    assessmentAlignments: [
      { objectiveId: 'obj-6.1', objectiveText: 'Intervening phrase head noun isolation', taught: true, practised: true, assessed: true, diagnosticInstrument: 'Concord Diagnostic Slip Q1-2', chapterAssessmentInstrument: 'Ch 6 Test Sec A Q1' },
      { objectiveId: 'obj-6.2', objectiveText: 'Correlative proximity agreement', taught: true, practised: true, assessed: true, formativeInstrument: 'Correlative Practice Sheet', chapterAssessmentInstrument: 'Ch 6 Test Sec A Q2' },
      { objectiveId: 'obj-6.3', objectiveText: 'Distributive pronoun singularity', taught: true, practised: true, assessed: true, formativeInstrument: 'Board Gap-Fill Task', chapterAssessmentInstrument: 'Ch 6 Test Sec B Q3' },
      { objectiveId: 'obj-6.4', objectiveText: 'Nouns plural in form but singular in concept', taught: true, practised: true, assessed: true, chapterAssessmentInstrument: 'Ch 6 Test Sec B Q4' },
    ],
    keyVocabulary: [
      'Concord',
      'Head Noun',
      'Proximity Attraction',
      'Intervening Phrase',
      'Collective Unity',
      'Distributive Pronoun',
      'Singular Inflection',
    ],
    skillsIntegration: 'Editorial proofreading and syntactic monitoring in personal composition.',
    writingConnection: 'Zero concord errors in formal letters (e.g. "The principal, along with the staff, invites...") and notices.',
    readingConnection: 'Accurate comprehension of dense informational non-fiction and science reports.',
    speakingListeningConnection: 'Oral drill distinguishing "neither of the boys is" from casual colloquial slips.',
    crossCurricularConnection: 'Science laboratory report writing: "A group of chemicals was tested"; Social Studies: "The government has approved...".',
    differentiationSupport: 'Head noun highlighting bracket method: put parentheses around all prepositional phrases [e.g. The quality (of these mangoes) is...] before choosing verb.',
    differentiationExtension: 'Analyze notional concord vs grammatical concord in British vs American English (committee has vs committee have).',
    commonMisconceptions: [
      'Proximity attraction error: agreeing with the plural noun inside a prepositional phrase rather than the true head noun.',
      'Treating "everyone" or "each" as plural because it refers to multiple persons.',
      'Always treating collective nouns as plural.',
    ],
    boardSystemNotes: 'Mandatory CBSE Section B testing component (2–3 marks). Evaluated through 1-mark objective blanks and error editing passages.',
    evidenceStatus: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
    evidenceCitation: 'CBSE Curriculum Circular Section B; NCERT English Learning Outcomes Grade 6, LO E6.6, p. 31.',
    evidenceRecord: {
      claim: 'Subject-Verb Concord Mandatory Component',
      status: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      sourceTitle: 'NCERT Learning Outcomes Elementary Stage',
      issuingOrganisation: 'NCERT / CBSE',
      documentTitle: 'Learning Outcomes at Elementary Stage §E6.6',
      versionOrYear: '2023–2024',
      pageOrSection: 'p. 31, LO E6.6',
      citationReference: 'NCERT Elementary Learning Outcomes, p. 31; CBSE Curriculum Circular.',
      editorialNotes: 'High-frequency exam slot. Requires board sample question paper citation to verify exact weightage.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Completed',
    estimatedPages: 16,
    teacherNotes: 'Devote extra instructional time to the bracket method for eliminating prepositional phrase noise.',
    authorNotes: 'Ensure chapter exercises mirror CBSE board exam gap-filling and error correction formats.',
  },
  {
    id: 'seq-cbse6-07',
    seqNumber: 7,
    unitId: 'unit-c6-3',
    unitTitle: 'Unit 3: Verbal Architecture, Tenses & Voice',
    chapterId: 'c6-top-tenses',
    chapterNumber: 7,
    chapterTitle: 'Chapter 7: Tenses: Forms, Aspects & Uses',
    conceptId: 'concept-tenses',
    conceptTitle: 'Verb Tenses & Temporal Aspects',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-07',
    internalMappingId: 'VTR-CBSE6-07',
    officialCurriculumRef: 'NCERT Elementary Learning Outcomes LO-E6.7, p. 42 (Gazetted Syllabus)',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: false,
    curriculumMappingDescription: 'Present, past, and future time; simple, continuous, perfect aspects; time markers and narrative framing.',
    currentTreatment: 'Class 6 treatment: Aspectual distinctions (simple vs continuous vs perfect), signal words (since, for, already, yet), and narrative past harmonization.',
    priorLearning: 'Class 5 (Prior Learning): Simple present, simple past, and simple future with will/shall.',
    nextProgression: 'Class 7 (Next Progression): Perfect continuous aspects, future perfect, and temporal clauses with when/while.',
    learningObjectives: [
      'Form and use simple present for general truths, routines, and scheduled events',
      'Distinguish simple past (completed event) from present perfect (past event with current relevance)',
      'Use past continuous for interrupted background actions in narrative writing',
    ],
    prerequisites: ['Finite verb identification (Chapter 5)', 'Subject-verb agreement (Chapter 6)'],
    newLearning: 'Class 6: Aspectual distinctions (simple vs continuous vs perfect), signal words (since, for, already, yet).',
    depthLevel: 'Analytical',
    masteryStage: 'Reinforced',
    masteryCode: 'R',
    recommendedTeachingLessons: 6,
    recommendedTeachingHours: 5.0,
    exerciseProfile: [
      { id: 'ex-7a', label: 'Ex A', name: 'Aspectual Recognition', pedagogicalType: 'recognition', targetQuestionsCount: 10, description: 'Identify tense and aspect from verb inflections' },
      { id: 'ex-7b', label: 'Ex B', name: 'Present Perfect vs Simple Past Drill', pedagogicalType: 'controlled_practice', targetQuestionsCount: 10, description: 'Fill blanks using since/for and past timestamps' },
      { id: 'ex-7c', label: 'Ex C', name: 'Narrative Story Tense Harmonization', pedagogicalType: 'application', targetQuestionsCount: 8, description: 'Correct unwarranted tense shifts in a student narrative' },
      { id: 'ex-7d', label: 'Ex D', name: 'Board Gap-Filling Passage', pedagogicalType: 'contextual_application', targetQuestionsCount: 6, description: 'CBSE Section B 1-mark bracketed verb forms' },
    ],
    assessmentEvidence: ['Mid-Term Exam', 'Tense Aspect Portfolio', 'Passage Editing Test'],
    assessmentAlignments: [
      { objectiveId: 'obj-7.1', objectiveText: 'Present perfect vs simple past distinction', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-7.2', objectiveText: 'Narrative past aspect consistency', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Tense', 'Aspect', 'Continuous', 'Perfect', 'Temporal Adverbial'],
    skillsIntegration: 'Temporal sequencing in diary entries and historical biographies.',
    writingConnection: 'Maintaining past tense discipline in narrative writing and reports.',
    readingConnection: 'Understanding flashback sequencing in literature.',
    speakingListeningConnection: 'Oral interview roleplay using present perfect for personal achievements.',
    crossCurricularConnection: 'History timeline descriptions and historical causations.',
    differentiationSupport: 'Timeline visual diagrams placing moments of speaking vs event time.',
    differentiationExtension: 'State verbs that avoid continuous forms (know, believe, understand, belong).',
    commonMisconceptions: ['Using present perfect with specific past time words ("I have seen him yesterday").'],
    boardSystemNotes: 'Heavy weightage in CBSE Section B gap-filling (3–4 marks).',
    evidenceStatus: 'VERIFIED',
    evidenceCitation: 'NCERT Learning Outcomes at the Elementary Stage, English, p. 42, LO E6.7; CBSE Curriculum 2024–2026.',
    evidenceRecord: {
      claim: 'Verb Tenses & Temporal Aspects',
      status: 'VERIFIED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      sourceTitle: 'NCERT Elementary Learning Outcomes',
      issuingOrganisation: 'NCERT / CBSE',
      documentTitle: 'Learning Outcomes at the Elementary Stage (National Council of Educational Research and Training)',
      versionOrYear: '2023–2024',
      pageOrSection: 'p. 42, Learning Outcome E6.7',
      citationReference: 'NCERT Learning Outcomes at the Elementary Stage, English, p. 42, LO E6.7; CBSE Secondary Curriculum.',
      sourceUrl: 'https://ncert.nic.in/pdf/publication/otherpublications/learning_outcomes.pdf',
      editorialNotes: 'Formally audited against NCERT elementary guidelines and verified by Senior Academic Editor.',
      verifiedBy: 'Senior Academic Editor',
      verificationDate: '2026-03-01',
      isOfficialCodeVerified: true,
    },
    productionStatus: 'In Review',
    estimatedPages: 16,
  },
  {
    id: 'seq-cbse6-08',
    seqNumber: 8,
    unitId: 'unit-c6-3',
    unitTitle: 'Unit 3: Verbal Architecture, Tenses & Voice',
    chapterId: 'c6-top-modals',
    chapterNumber: 8,
    chapterTitle: 'Chapter 8: Modals: Ability, Permission, Obligation & Advice',
    conceptId: 'concept-modals',
    conceptTitle: 'Modal Auxiliaries & Communicative Functions',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-08',
    internalMappingId: 'VTR-CBSE6-08',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Can/could, may/might, shall/should, will/would, must/ought to; degrees of politeness and formal registers.',
    currentTreatment: 'Class 6 treatment: Polite requests, degrees of probability, obligation (must vs should vs ought to), and invariant bare infinitive syntax.',
    priorLearning: 'Class 5 (Prior Learning): Basic can and may for permission.',
    nextProgression: 'Class 7 (Next Progression): Modals in past time (could have, should have), semi-modals (used to, need, dare).',
    learningObjectives: [
      'Express ability, possibility, permission, advice, and obligation with appropriate modal verbs',
      'Distinguish degrees of politeness in requests (can vs could vs would vs may)',
      'Recognize that modal verbs take bare infinitive and do not inflect for person or number',
    ],
    prerequisites: ['Primary auxiliaries (Chapter 5)', 'Bare infinitive concept'],
    newLearning: 'Class 6: Polite requests, degrees of probability, obligation (must vs should vs ought to).',
    depthLevel: 'Intermediate',
    masteryStage: 'Reinforced',
    masteryCode: 'R',
    recommendedTeachingLessons: 4,
    recommendedTeachingHours: 3.5,
    exerciseProfile: [
      { id: 'ex-8a', label: 'Ex A', name: 'Functional Matching', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Match modal sentence to communicative function' },
      { id: 'ex-8b', label: 'Ex B', name: 'Polite Request Rewriting', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 6, description: 'Rewrite blunt commands into polite requests' },
      { id: 'ex-8c', label: 'Ex C', name: 'Dialogue Gap-Filling', pedagogicalType: 'contextual_application', targetQuestionsCount: 8, description: 'Select correct modal for school dialogue situation' },
    ],
    assessmentEvidence: ['Formative Dialogue Roleplay', 'Modal Auxiliary Test'],
    assessmentAlignments: [
      { objectiveId: 'obj-8.1', objectiveText: 'Modal invariant form with bare infinitive', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-8.2', objectiveText: 'Communicative nuance selection', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Modal', 'Obligation', 'Possibility', 'Register', 'Bare Infinitive'],
    skillsIntegration: 'Pragmatic competence in polite communication and email drafting.',
    writingConnection: 'Writing advisory letters, formal notices, and school rules.',
    readingConnection: 'Inferring speaker stance and confidence from modal verbs.',
    speakingListeningConnection: 'Expressing polite requests and refusals in everyday interactions.',
    crossCurricularConnection: 'Civic rules, safety guidelines, and science protocols.',
    differentiationSupport: 'Modal ladder diagram ordering degree of certainty from might to must.',
    differentiationExtension: 'Semi-modals (used to, dare, need).',
    commonMisconceptions: ['Adding -s to modals for third person ("he cans").'],
    boardSystemNotes: 'Mandatory CBSE Section B dialogue gap-filling test slot.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'CBSE Class 6 English Syllabus, Grammar Section B (Editorial Model).',
    evidenceRecord: {
      claim: 'Modal Auxiliaries & Communicative Functions',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial demonstration mapping. Awaiting primary gazetted syllabus audit.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Drafting',
    estimatedPages: 12,
  },
  {
    id: 'seq-cbse6-09',
    seqNumber: 9,
    unitId: 'unit-c6-3',
    unitTitle: 'Unit 3: Verbal Architecture, Tenses & Voice',
    chapterId: 'c6-top-voice',
    chapterNumber: 9,
    chapterTitle: 'Chapter 9: Active & Passive Voice: Transformation & Registers',
    conceptId: 'concept-voice',
    conceptTitle: 'Diathesis: Active & Passive Voice',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-09',
    internalMappingId: 'VTR-CBSE6-09',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Agent and patient roles, transitive constraints, passive auxiliary + past participle formula, by-agent omission.',
    currentTreatment: 'Class 6 treatment: Systematic transformation formula for simple tenses, transitive constraints, and by-agent omission for objective scientific registers.',
    priorLearning: 'Class 5 (Prior Learning): Basic active sentences with subject-verb-object order.',
    nextProgression: 'Class 7 (Next Progression): Continuous and perfect aspect passive forms, and passive with modal verbs.',
    learningObjectives: [
      'Transform simple present and simple past sentences between active and passive voice',
      'Recognize that intransitive verbs cannot form a passive voice construction',
      'Determine when the agent should be omitted for formal objectivity or when unknown',
    ],
    prerequisites: ['Transitive and intransitive verbs', 'Past participle forms (Chapter 5)', 'Object pronouns (Chapter 3)'],
    newLearning: 'Class 6: Systematic transformation formula, agent omission, and objective scientific register.',
    depthLevel: 'Intermediate',
    masteryStage: 'Developing',
    masteryCode: 'D',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.0,
    exerciseProfile: [
      { id: 'ex-9a', label: 'Ex A', name: 'Voice Identification & Transitivity Check', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Identify active/passive and verify if verb has direct object' },
      { id: 'ex-9b', label: 'Ex B', name: 'Transformation Step-by-Step Drill', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 8, description: 'Convert active sentences to passive with subject-object swap' },
      { id: 'ex-9c', label: 'Ex C', name: 'Scientific Process Passive Description', pedagogicalType: 'contextual_application', targetQuestionsCount: 1, description: 'Describe how tea or paper is manufactured using agentless passive' },
    ],
    assessmentEvidence: ['Process Writing Rubric', 'Transformation Quiz'],
    assessmentAlignments: [
      { objectiveId: 'obj-9.1', objectiveText: 'Transitive requirement for passive', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-9.2', objectiveText: 'Simple present/past passive formula', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Active Voice', 'Passive Voice', 'Agent', 'Patient', 'Transitive', 'Past Participle'],
    skillsIntegration: 'Shift between narrative storytelling (active) and formal reporting (passive).',
    writingConnection: 'Writing newspaper headlines and scientific experiments.',
    readingConnection: 'Noticing focus shift between agent and result in expository texts.',
    speakingListeningConnection: 'Formal broadcast speech patterns.',
    crossCurricularConnection: 'Science lab manuals: "10 ml of acid was added to the solution".',
    differentiationSupport: 'Color-coded 3-step arrow diagram for subject-object inversion.',
    differentiationExtension: 'Passive voice with ditransitive verbs taking direct and indirect objects.',
    commonMisconceptions: ['Attempting to passivize intransitive verbs like "He died" or "She arrived".'],
    boardSystemNotes: 'CBSE Class 6 introduces passive voice, expanding to continuous and perfect in Class 7–8.',
    evidenceStatus: 'MAPPED_SOURCE_REQUIRED',
    evidenceCitation: '',
    evidenceRecord: {
      claim: 'Active & Passive Voice Transformation',
      status: 'MAPPED_SOURCE_REQUIRED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Mapping identified in curriculum blueprint; primary board syllabus circular citation needed.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Planned',
    estimatedPages: 14,
  },
  {
    id: 'seq-cbse6-10',
    seqNumber: 10,
    unitId: 'unit-c6-4',
    unitTitle: 'Unit 4: Clauses, Synthesis & Reported Speech',
    chapterId: 'c6-top-clauses',
    chapterNumber: 10,
    chapterTitle: 'Chapter 10: Clauses: Principal, Subordinate & Relative',
    conceptId: 'concept-clauses',
    conceptTitle: 'Clause Hierarchy, Subordination & Coordination',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-10',
    internalMappingId: 'VTR-CBSE6-10',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Principal (main) clauses, subordinate clauses (noun, adjective/relative, adverb), subordinating conjunctions.',
    currentTreatment: 'Class 6 treatment: Clause finite verb identification, principal vs subordinate clause boundaries, and relative clause synthesis with who/which/that.',
    priorLearning: 'Class 5 (Prior Learning): Compound sentences joined by and, but, or.',
    nextProgression: 'Class 7 (Next Progression): Adverbial clauses of condition/concession, and non-defining relative clauses.',
    learningObjectives: [
      'Distinguish a clause containing a finite verb from a non-finite phrase',
      'Identify principal clauses capable of standing alone as complete sentences',
      'Use relative clauses introduced by who, which, and that to combine short choppy sentences',
    ],
    prerequisites: ['Sentence structure (Chapter 1)', 'Finite verbs (Chapter 5)', 'Relative pronouns (Chapter 3)'],
    newLearning: 'Class 6: Subordinate clauses with because, although, when, if, and relative clauses.',
    depthLevel: 'Analytical',
    masteryStage: 'Developing',
    masteryCode: 'D',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.5,
    exerciseProfile: [
      { id: 'ex-10a', label: 'Ex A', name: 'Phrase vs Clause Identification', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Determine whether highlighted segment is phrase or clause' },
      { id: 'ex-10b', label: 'Ex B', name: 'Principal vs Subordinate Analysis', pedagogicalType: 'application', targetQuestionsCount: 8, description: 'Underline main clause and bracket subordinate clause' },
      { id: 'ex-10c', label: 'Ex C', name: 'Sentence Synthesis Drill', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 6, description: 'Combine sentences using subordinating conjunctions' },
    ],
    assessmentEvidence: ['Sentence Diagramming Test', 'Synthesis Assessment'],
    assessmentAlignments: [
      { objectiveId: 'obj-10.1', objectiveText: 'Clause finite verb demarcation', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-10.2', objectiveText: 'Subordinating conjunction selection', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Clause', 'Phrase', 'Principal Clause', 'Subordinate Clause', 'Subordinator'],
    skillsIntegration: 'Developing syntactic maturity and varied sentence structures.',
    writingConnection: 'Eliminating repetitive simple sentences in descriptive essays.',
    readingConnection: 'Deciphering complex academic paragraphs.',
    speakingListeningConnection: 'Complex arguments using concession clauses (although, even though).',
    crossCurricularConnection: 'Geography explanations of cause and effect (monsoons, landforms).',
    differentiationSupport: 'Conjunction anchor chart grouping into cause, condition, time, and concession.',
    differentiationExtension: 'Defining vs non-defining relative clauses and comma punctuation rules.',
    commonMisconceptions: ['Thinking that any long group of words is automatically a clause.'],
    boardSystemNotes: 'Foundation for Class 9–10 board sentence transformation and synthesis.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'NCERT Grade 6 LO E6.10; CBSE Syntax Framework (Editorial Demonstration).',
    evidenceRecord: {
      claim: 'Clause Hierarchy & Relative Subordination',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial model row. Source citation required for formal textbook adoption.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Planned',
    estimatedPages: 14,
  },
  {
    id: 'seq-cbse6-11',
    seqNumber: 11,
    unitId: 'unit-c6-4',
    unitTitle: 'Unit 4: Clauses, Synthesis & Reported Speech',
    chapterId: 'c6-top-reported',
    chapterNumber: 11,
    chapterTitle: 'Chapter 11: Direct & Indirect Speech: Statements & Questions',
    conceptId: 'concept-reported-speech',
    conceptTitle: 'Discourse Representation & Backshifting',
    strand: 'Syntax & Morphology',
    curriculumMappingCode: 'VTR-CBSE6-11',
    internalMappingId: 'VTR-CBSE6-11',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification (In Review)',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Punctuation of direct quotation, reporting verb rules, tense backshifting, pronoun changes, and time/place adverb adjustments.',
    currentTreatment: 'Class 6 treatment: Punctuation of direct quotation marks, reporting verb rules (said, told, asked), systematic backshifting in simple tenses, and question transformations.',
    priorLearning: 'Class 5 (Prior Learning): Quotation marks in dialogue reading passages.',
    nextProgression: 'Class 7 (Next Progression): Reporting imperative commands/requests, exclamations, and reporting modal verbs.',
    learningObjectives: [
      'Punctuate direct speech accurately with quotation marks, commas, and capital letters',
      'Convert direct statements into indirect speech applying tense backshift and pronoun alignment',
      'Report wh-questions and yes/no questions using appropriate reporting verbs and whether/if',
    ],
    prerequisites: ['Tenses and aspects (Chapter 7)', 'Pronoun case and person (Chapter 3)', 'Punctuation marks'],
    newLearning: 'Class 6: Systematic tense backshift, reporting verb selection, and question transformation.',
    depthLevel: 'Analytical',
    masteryStage: 'Developing',
    masteryCode: 'D',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.5,
    exerciseProfile: [
      { id: 'ex-11a', label: 'Ex A', name: 'Direct Speech Punctuation Drill', pedagogicalType: 'controlled_practice', targetQuestionsCount: 6, description: 'Insert missing quotation marks, commas, and capitals' },
      { id: 'ex-11b', label: 'Ex B', name: 'Backshifting Transformation Drill', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 8, description: 'Convert direct statements to reported speech' },
      { id: 'ex-11c', label: 'Ex C', name: 'Dialogue to Indirect Paragraph', pedagogicalType: 'contextual_application', targetQuestionsCount: 5, description: 'CBSE dialogue reporting format' },
    ],
    assessmentEvidence: ['Board-Pattern Dialogue Reporting Test', 'Punctuation Quiz'],
    assessmentAlignments: [
      { objectiveId: 'obj-11.1', objectiveText: 'Tense backshift rule application', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-11.2', objectiveText: 'Question inversion removal in reported speech', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Direct Speech', 'Indirect Speech', 'Reporting Verb', 'Backshift', 'Quotation Marks'],
    skillsIntegration: 'Integrating reported testimony in newspaper articles and summaries.',
    writingConnection: 'Dialogue writing in narratives vs reported summary in factual reports.',
    readingConnection: 'Recognizing narrative viewpoint in literature.',
    speakingListeningConnection: 'Relaying messages and verbal instructions accurately.',
    crossCurricularConnection: 'Historical quotes and journalistic reporting.',
    differentiationSupport: 'Backshift conversion wheel (present simple becomes past simple).',
    differentiationExtension: 'Universal truths and ongoing states that resist backshifting.',
    commonMisconceptions: ['Keeping question word order (asked what was his name instead of what his name was).'],
    boardSystemNotes: 'CBSE Class 10 Section B tests dialogue reporting for 2–3 marks; Class 6 introduces the core paradigm.',
    evidenceStatus: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
    evidenceCitation: 'NCERT Grade 6 LO E6.11; CBSE Examination Blueprint.',
    evidenceRecord: {
      claim: 'Direct & Indirect Speech Core Paradigm',
      status: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      sourceTitle: 'NCERT Elementary Learning Outcomes E6.11',
      issuingOrganisation: 'NCERT / CBSE',
      documentTitle: 'Elementary English Curriculum Guide §E6.11',
      versionOrYear: '2023–2024',
      pageOrSection: 'p. 48, LO E6.11',
      citationReference: 'NCERT Grade 6 LO E6.11.',
      editorialNotes: 'Source attached; pending confirmation of exact testing format in Middle School Circular.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Planned',
    estimatedPages: 16,
  },
  {
    id: 'seq-cbse6-12',
    seqNumber: 12,
    unitId: 'unit-c6-5',
    unitTitle: 'Unit 5: Vocabulary Enrichment & Applied Composition',
    chapterId: 'c6-top-vocab',
    chapterNumber: 12,
    chapterTitle: 'Chapter 12: Vocabulary, Collocations & Phrasal Verbs',
    conceptId: 'concept-vocabulary',
    conceptTitle: 'Lexical Semantics, Idioms & Collocations',
    strand: 'Vocabulary & Composition',
    curriculumMappingCode: 'VTR-CBSE6-12',
    internalMappingId: 'VTR-CBSE6-12',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Contextual synonyms, antonyms, common phrasal verbs, prefixes/suffixes, and natural collocations.',
    currentTreatment: 'Class 6 treatment: Contextual word inference from clues, high-frequency phrasal verbs with dependent prepositions, and Greek/Latin derivational affixes.',
    priorLearning: 'Class 5 (Prior Learning): Simple dictionary alphabetical order and familiar synonym/antonym pairs.',
    nextProgression: 'Class 7 (Next Progression): Etymological root analysis, homophones/homographs, and register-specific collocations.',
    learningObjectives: [
      'Determine word meaning from context clues in informational extracts',
      'Use high-frequency phrasal verbs correctly with prepositions (e.g. give up, look into, call off)',
      'Construct words using Latin and Greek prefixes and derivational suffixes',
    ],
    prerequisites: ['Basic dictionary usage', 'Affixation concepts from Chapter 2'],
    newLearning: 'Class 6: Phrasal verb semantic idiomaticity, precise collocations, and contextual inference.',
    depthLevel: 'Intermediate',
    masteryStage: 'Reinforced',
    masteryCode: 'R',
    recommendedTeachingLessons: 4,
    recommendedTeachingHours: 3.5,
    exerciseProfile: [
      { id: 'ex-12a', label: 'Ex A', name: 'Contextual Clue Inference', pedagogicalType: 'recognition', targetQuestionsCount: 8, description: 'Select meaning from sentence context' },
      { id: 'ex-12b', label: 'Ex B', name: 'Phrasal Verb Replacement', pedagogicalType: 'controlled_practice', targetQuestionsCount: 8, description: 'Replace formal one-word verbs with natural phrasal verbs' },
      { id: 'ex-12c', label: 'Ex C', name: 'Collocation Builder', pedagogicalType: 'application', targetQuestionsCount: 10, description: 'Pair verbs and nouns (e.g. make a decision, take an exam)' },
    ],
    assessmentEvidence: ['Vocabulary Cloze Test', 'Crossword Challenge'],
    assessmentAlignments: [
      { objectiveId: 'obj-12.1', objectiveText: 'Contextual lexical inference', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-12.2', objectiveText: 'Phrasal verb preposition accuracy', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Collocation', 'Phrasal Verb', 'Affix', 'Synonym', 'Context Clue'],
    skillsIntegration: 'Elevating vocabulary score across writing tasks and reading comprehension.',
    writingConnection: 'Replacing repetitive generic words (good, bad, nice) with precise descriptive vocabulary.',
    readingConnection: 'Unlocking unfamiliar words in unseen passages.',
    speakingListeningConnection: 'Idiomatic expressions in spoken dialogue.',
    crossCurricularConnection: 'Subject-specific terminology in environmental studies.',
    differentiationSupport: 'Illustrated idiom flashcards with literal vs figurative meaning.',
    differentiationExtension: 'Etymological root studies (tele-, auto-, bio-, graph-).',
    commonMisconceptions: ['Treating phrasal verbs as literal word-by-word sums of parts.'],
    boardSystemNotes: 'Essential for high marks in Section A Reading Comprehension vocabulary questions.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'NCERT Grade 6 LO E6.12; CBSE Vocabulary Guidelines (Editorial Model).',
    evidenceRecord: {
      claim: 'Lexical Semantics & Phrasal Verbs',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial demonstration mapping. Awaiting primary gazetted syllabus audit.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Drafting',
    estimatedPages: 12,
  },
  {
    id: 'seq-cbse6-13',
    seqNumber: 13,
    unitId: 'unit-c6-5',
    unitTitle: 'Unit 5: Vocabulary Enrichment & Applied Composition',
    chapterId: 'c6-top-comp',
    chapterNumber: 13,
    chapterTitle: 'Chapter 13: Applied Composition: Formal Letters & Coherent Paragraphs',
    conceptId: 'concept-composition',
    conceptTitle: 'Discourse Architecture & Formal Written Formats',
    strand: 'Vocabulary & Composition',
    curriculumMappingCode: 'VTR-CBSE6-13',
    internalMappingId: 'VTR-CBSE6-13',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'CBSE Section B Writing formats: Formal letter to school principal, notice writing, descriptive paragraph, and cohesive devices.',
    currentTreatment: 'Class 6 treatment: Formal letter conventions (sender address, date, subject line, formal subscription), 50-word school notices, and cohesive expository paragraphs.',
    priorLearning: 'Class 5 (Prior Learning): Informal personal letters to friends and simple story writing.',
    nextProgression: 'Class 7 (Next Progression): Formal letter to the editor, article writing, and factual descriptions.',
    learningObjectives: [
      'Format a formal letter to the school authority with sender address, date, salutation, subject line, and formal subscription',
      'Draft concise notices within 50 words including date, event, venue, time, and target audience',
      'Structure an expository paragraph with clear topic sentence, supporting arguments, and concluding remark',
    ],
    prerequisites: ['Sentence variety (Chapter 1)', 'Concord accuracy (Chapter 6)', 'Punctuation and capitalization'],
    newLearning: 'Class 6: Formal letter conventions, official notices, subject line phrasing, and strict word count discipline.',
    depthLevel: 'Analytical',
    masteryStage: 'Mastered',
    masteryCode: 'M',
    recommendedTeachingLessons: 6,
    recommendedTeachingHours: 5.0,
    exerciseProfile: [
      { id: 'ex-13a', label: 'Ex A', name: 'Format Layout Annotation', pedagogicalType: 'recognition', targetQuestionsCount: 5, description: 'Identify and label mandatory elements of formal letter and notice' },
      { id: 'ex-13b', label: 'Ex B', name: 'Paragraph Cohesion Reordering', pedagogicalType: 'controlled_practice', targetQuestionsCount: 4, description: 'Reorder scrambled sentences into a unified paragraph using transition words' },
      { id: 'ex-13c', label: 'Ex C', name: 'Notice Drafting Task (50 words)', pedagogicalType: 'contextual_application', targetQuestionsCount: 2, description: 'Draft lost-and-found and school competition notices' },
      { id: 'ex-13d', label: 'Ex D', name: 'Formal Letter to Principal', pedagogicalType: 'higher_order_challenge', targetQuestionsCount: 1, description: 'Write application requesting leave or organizing sports day equipment' },
    ],
    assessmentEvidence: ['CBSE Writing Rubric (Format: 1m, Content: 2m, Expression: 2m)', 'Peer Review Checklist'],
    assessmentAlignments: [
      { objectiveId: 'obj-13.1', objectiveText: 'Formal letter convention adherence', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-13.2', objectiveText: 'Notice format and word count limit', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Salutation', 'Subscription', 'Subject Line', 'Notice', 'Cohesive Device'],
    skillsIntegration: 'Full synthesis of grammar, vocabulary, and discourse mechanics.',
    writingConnection: 'Direct production of CBSE Section B writing tasks.',
    readingConnection: 'Analyzing model exemplary letters and notices.',
    speakingListeningConnection: 'Presenting an oral pitch corresponding to the written notice.',
    crossCurricularConnection: 'School governance and civic correspondence.',
    differentiationSupport: 'Fill-in-the-blank letter framework template.',
    differentiationExtension: 'Letter to the editor expressing concern over neighborhood traffic safety.',
    commonMisconceptions: ['Writing "Yours lovingly" in formal letters or omitting the subject line.'],
    boardSystemNotes: 'CBSE Section B Writing carries 10–12 marks with strict marking schemes for format, content, and accuracy.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'CBSE Middle School Examination Scheme, Section B Writing (Editorial Demonstration Model).',
    evidenceRecord: {
      claim: 'Formal Letter & Notice Writing Formats',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Editorial model aligned with CBSE annual specifications. Primary circular citation needed.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'In Review',
    estimatedPages: 16,
  },
  {
    id: 'seq-cbse6-14',
    seqNumber: 14,
    unitId: 'unit-c6-6',
    unitTitle: 'Unit 6: Revision & Term-End Assessments',
    chapterId: 'c6-top-rev',
    chapterNumber: 14,
    chapterTitle: 'Chapter 14: Integrated Revision & Examination Diagnostic Papers',
    conceptId: 'concept-integrated-revision',
    conceptTitle: 'Cumulative Grammar Synthesis & Diagnostic Evaluation',
    strand: 'Assessment & Synthesis',
    curriculumMappingCode: 'VTR-CBSE6-14',
    internalMappingId: 'VTR-CBSE6-14',
    officialCurriculumRef: 'Pending Primary Board Gazette Code Verification',
    frameworkAssociation: 'NCF-SE 2023 §4.2 (Curriculum Policy Context — Not Direct Chapter Proof)',
    isEditorialDemonstration: true,
    curriculumMappingDescription: 'Integrated gap-filling passages, sentence reordering, editing/omission drills, and diagnostic term-end mock examination.',
    currentTreatment: 'Class 6 treatment: Cumulative mixed error detection across concord, tenses, modals, and nominal structures under timed examination conditions.',
    priorLearning: 'Continuous practice across Units 1–5.',
    nextProgression: 'Class 7 (Next Progression): Class 7 diagnostic baseline evaluation and spiral retention checks.',
    learningObjectives: [
      'Apply integrated grammar rules across mixed-error non-fiction paragraphs under timed conditions',
      'Reorder jumbled words into syntactically flawless sentences with correct capitalization and terminal punctuation',
      'Demonstrate cumulative mastery across concord, tenses, modals, and nominal structures',
    ],
    prerequisites: ['All preceding chapters (Chapters 1–13)'],
    newLearning: 'Class 6: Integrated mixed error detection, timed examination discipline, and error analysis.',
    depthLevel: 'Analytical',
    masteryStage: 'Mastered',
    masteryCode: 'M',
    recommendedTeachingLessons: 5,
    recommendedTeachingHours: 4.5,
    exerciseProfile: [
      { id: 'ex-14a', label: 'Ex A', name: 'Integrated Gap-Filling Test Paper 1', pedagogicalType: 'contextual_application', targetQuestionsCount: 10, description: 'CBSE Section B 1-mark blanks' },
      { id: 'ex-14b', label: 'Ex B', name: 'Sentence Reordering Challenge', pedagogicalType: 'sentence_transformation', targetQuestionsCount: 6, description: 'Unscramble words into coherent syntax' },
      { id: 'ex-14c', label: 'Ex C', name: 'Passage Editing & Error Spotting', pedagogicalType: 'editing_correction', targetQuestionsCount: 8, description: 'Line-by-line identification of incorrect and correct words' },
      { id: 'ex-14d', label: 'Ex D', name: 'Full Mock Term Examination', pedagogicalType: 'higher_order_challenge', targetQuestionsCount: 20, description: 'Full 25-mark cumulative grammar & writing diagnostic' },
    ],
    assessmentEvidence: ['Term 1 Comprehensive Assessment Paper', 'Olympiad Diagnostic Challenge'],
    assessmentAlignments: [
      { objectiveId: 'obj-14.1', objectiveText: 'Cumulative error spotting accuracy', taught: true, practised: true, assessed: true },
      { objectiveId: 'obj-14.2', objectiveText: 'Sentence reordering syntactic fluency', taught: true, practised: true, assessed: true },
    ],
    keyVocabulary: ['Diagnostic', 'Error Omission', 'Sentence Reordering', 'Cumulative', 'Synthesis'],
    skillsIntegration: 'Complete examination readiness and error self-correction.',
    writingConnection: 'Final proofreading pass applied across all writing portfolios.',
    readingConnection: 'Timed reading and contextual grammar application.',
    speakingListeningConnection: 'Collaborative error analysis groups explaining rationale for corrections.',
    crossCurricularConnection: 'Scientific reporting proofreading.',
    differentiationSupport: 'Line-numbered editing sheets with hints indicating error category.',
    differentiationExtension: 'Olympiad challenge questions with subtle stylistic ambiguity.',
    commonMisconceptions: ['Overlooking concord errors when separated by long intervening phrases.'],
    boardSystemNotes: 'Directly mirrors the annual CBSE Class 6 English Language Examination format.',
    evidenceStatus: 'EDITORIAL_DEMO',
    evidenceCitation: 'CBSE Sample Assessment Guidelines and Marking Scheme 2026-27 (Demonstration Model).',
    evidenceRecord: {
      claim: 'Integrated Examination Revision Papers',
      status: 'EDITORIAL_DEMO',
      educationSystem: 'CBSE',
      bookClassOrStage: 'Class 6',
      editorialNotes: 'Sample assessment compilation. Official Sample Question Paper (SQP) citation required.',
      isOfficialCodeVerified: false,
    },
    productionStatus: 'Completed',
    estimatedPages: 18,
  },
];

// ============================================================================
// CONCEPT DEPENDENCY GRAPH
// ============================================================================
export const CONCEPT_DEPENDENCY_GRAPH: Record<string, ConceptDependencyLink[]> = {
  'concept-concord': [
    {
      id: 'dep-concord-1',
      sourceConceptId: 'concept-sentence-types',
      sourceConceptName: 'Subject & Predicate Identification',
      targetConceptId: 'concept-concord',
      targetConceptName: 'Subject-Verb Concord',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Student must isolate the true head noun from the predicate before matching verbal number.',
    },
    {
      id: 'dep-concord-2',
      sourceConceptId: 'concept-verbs-finite',
      sourceConceptName: 'Finite Verbs & Inflections',
      targetConceptId: 'concept-concord',
      targetConceptName: 'Subject-Verb Concord',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Only finite verbs carry grammatical number and person inflections (e.g. -s/-es).',
    },
    {
      id: 'dep-concord-3',
      sourceConceptId: 'concept-nouns',
      sourceConceptName: 'Noun Number & Gender',
      targetConceptId: 'concept-concord',
      targetConceptName: 'Subject-Verb Concord',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Recognizing plural forms, irregular plurals, and mass noun countability.',
    },
    {
      id: 'dep-concord-4',
      sourceConceptId: 'concept-pronouns',
      sourceConceptName: 'Distributive & Indefinite Pronouns',
      targetConceptId: 'concept-concord',
      targetConceptName: 'Subject-Verb Concord',
      relationType: 'RECOMMENDED_PRIOR_KNOWLEDGE',
      rationale: 'Distributive pronouns (each, neither) dictate singular verb choices in concord.',
    },
    {
      id: 'dep-concord-5',
      sourceConceptId: 'concept-determiners',
      sourceConceptName: 'Determiners & Quantifiers',
      targetConceptId: 'concept-concord',
      targetConceptName: 'Subject-Verb Concord',
      relationType: 'RELATED_CONCEPT',
      rationale: 'Quantifiers (a number of vs the number of) alter agreement patterns.',
    },
    {
      id: 'dep-concord-6',
      sourceConceptId: 'concept-concord',
      sourceConceptName: 'Subject-Verb Concord',
      targetConceptId: 'concept-clauses',
      targetConceptName: 'Relative Clauses & Complex Syntax',
      relationType: 'LATER_APPLICATION',
      rationale: 'Subject-verb agreement must be maintained inside embedded relative clauses.',
    },
    {
      id: 'dep-concord-7',
      sourceConceptId: 'concept-concord',
      sourceConceptName: 'Subject-Verb Concord',
      targetConceptId: 'concept-composition',
      targetConceptName: 'Formal Composition & Letter Writing',
      relationType: 'LATER_APPLICATION',
      rationale: 'Concord accuracy is a mandatory marking rubric criterion in formal writing.',
    },
  ],
  'concept-tenses': [
    {
      id: 'dep-tenses-1',
      sourceConceptId: 'concept-verbs-finite',
      sourceConceptName: 'Finite Verbs & Auxiliaries',
      targetConceptId: 'concept-tenses',
      targetConceptName: 'Verb Tenses & Aspects',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Tense forms require auxiliary verbs (be, have, do) combined with participles.',
    },
    {
      id: 'dep-tenses-2',
      sourceConceptId: 'concept-concord',
      sourceConceptName: 'Subject-Verb Concord',
      targetConceptId: 'concept-tenses',
      targetConceptName: 'Verb Tenses & Aspects',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Tense inflections must agree with subject number (has gone vs have gone).',
    },
    {
      id: 'dep-tenses-3',
      sourceConceptId: 'concept-tenses',
      sourceConceptName: 'Verb Tenses & Aspects',
      targetConceptId: 'concept-voice',
      targetConceptName: 'Active & Passive Voice',
      relationType: 'LATER_APPLICATION',
      rationale: 'Passive transformations require preserving the original tense aspect.',
    },
    {
      id: 'dep-tenses-4',
      sourceConceptId: 'concept-tenses',
      sourceConceptName: 'Verb Tenses & Aspects',
      targetConceptId: 'concept-reported-speech',
      targetConceptName: 'Direct & Indirect Speech',
      relationType: 'LATER_APPLICATION',
      rationale: 'Reported speech conversion relies on systematic tense backshifting.',
    },
  ],
  'concept-voice': [
    {
      id: 'dep-voice-1',
      sourceConceptId: 'concept-verbs-finite',
      sourceConceptName: 'Finite & Non-Finite Verbs',
      targetConceptId: 'concept-voice',
      targetConceptName: 'Active & Passive Voice',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Requires mastery of past participle (V3) verb inflections.',
    },
    {
      id: 'dep-voice-2',
      sourceConceptId: 'concept-sentence-types',
      sourceConceptName: 'Sentence Elements: Subject & Object',
      targetConceptId: 'concept-voice',
      targetConceptName: 'Active & Passive Voice',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Requires identifying direct objects to perform diathesis inversion.',
    },
    {
      id: 'dep-voice-3',
      sourceConceptId: 'concept-tenses',
      sourceConceptName: 'Verb Tenses',
      targetConceptId: 'concept-voice',
      targetConceptName: 'Active & Passive Voice',
      relationType: 'RECOMMENDED_PRIOR_KNOWLEDGE',
      rationale: 'Passive auxiliary (be) must reflect the exact tense of the active verb.',
    },
  ],
  'concept-clauses': [
    {
      id: 'dep-clauses-1',
      sourceConceptId: 'concept-sentence-types',
      sourceConceptName: 'Sentence Structure & Predicates',
      targetConceptId: 'concept-clauses',
      targetConceptName: 'Clauses & Synthesis',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'A clause is defined by the presence of a subject and a finite predicate.',
    },
    {
      id: 'dep-clauses-2',
      sourceConceptId: 'concept-pronouns',
      sourceConceptName: 'Relative Pronouns',
      targetConceptId: 'concept-clauses',
      targetConceptName: 'Clauses & Synthesis',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Relative clauses are introduced by who, which, that, whose, whom.',
    },
  ],
  'concept-reported-speech': [
    {
      id: 'dep-rep-1',
      sourceConceptId: 'concept-tenses',
      sourceConceptName: 'Verb Tenses',
      targetConceptId: 'concept-reported-speech',
      targetConceptName: 'Reported Speech',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Tense backshifting requires instant command of tense correspondences.',
    },
    {
      id: 'dep-rep-2',
      sourceConceptId: 'concept-pronouns',
      sourceConceptName: 'Pronoun Case & Person',
      targetConceptId: 'concept-reported-speech',
      targetConceptName: 'Reported Speech',
      relationType: 'REQUIRED_PREREQUISITE',
      rationale: 'Shifting from first/second person to third person in indirect discourse.',
    },
  ],
};

// Helper to get all dependencies for a concept
export function getConceptDependencies(conceptId: string): ConceptDependencyLink[] {
  return CONCEPT_DEPENDENCY_GRAPH[conceptId] || [];
}

// ============================================================================
// PREREQUISITE VALIDATION ENGINE
// ============================================================================
export interface PrerequisiteValidationWarning {
  rowId: string;
  chapterNumber: number;
  chapterTitle: string;
  prerequisiteConceptId: string;
  prerequisiteConceptName: string;
  requiredBeforeChapterNumber: number;
  message: string;
  severity: 'CRITICAL' | 'WARNING';
}

export function validateSequencePrerequisites(rows: ScopeSequenceMasterRow[]): PrerequisiteValidationWarning[] {
  const warnings: PrerequisiteValidationWarning[] = [];
  const conceptIndexMap = new Map<string, number>();

  rows.forEach((row, idx) => {
    conceptIndexMap.set(row.conceptId, idx);
  });

  rows.forEach((row, rowIndex) => {
    const dependencies = CONCEPT_DEPENDENCY_GRAPH[row.conceptId] || [];
    dependencies
      .filter((dep) => dep.relationType === 'REQUIRED_PREREQUISITE')
      .forEach((dep) => {
        const prereqIndex = conceptIndexMap.get(dep.sourceConceptId);
        if (prereqIndex !== undefined && prereqIndex > rowIndex) {
          const prereqRow = rows[prereqIndex];
          warnings.push({
            rowId: row.id,
            chapterNumber: row.chapterNumber,
            chapterTitle: row.chapterTitle,
            prerequisiteConceptId: dep.sourceConceptId,
            prerequisiteConceptName: dep.sourceConceptName,
            requiredBeforeChapterNumber: prereqRow.chapterNumber,
            message: `Sequencing Conflict: "${row.chapterTitle}" (Seq #${row.seqNumber}) appears before required prerequisite "${dep.sourceConceptName}" (Seq #${prereqRow.seqNumber}). ${dep.rationale}`,
            severity: 'CRITICAL',
          });
        }
      });
  });

  return warnings;
}

export function validateHorizontalSequenceOrder(rows: ScopeSequenceMasterRow[]): {
  valid: boolean;
  warnings: PrerequisiteValidationWarning[];
  warningMessage?: string;
} {
  const warnings = validateSequencePrerequisites(rows);
  return {
    valid: warnings.length === 0,
    warnings,
    warningMessage: warnings.length > 0 ? warnings.map((w) => w.message).join(' | ') : undefined,
  };
}

// ============================================================================
// SYSTEM CURRICULUM PROFILE ENGINE (Phase 4I Requirement 2)
// ============================================================================
export interface SystemCurriculumProfile {
  systemId: CurriculumSystemId;
  classOrStage: string;
  frameworkTitle: string;
  evidenceStatus: string;
  documentCitation: string;
  authority: string;
  pedagogicalFocus: string;
  terminologyNotes: string;
  boardAssessmentModel: string;
}

export function getSystemProfileData(systemId: CurriculumSystemId, classOrStage: string): SystemCurriculumProfile {
  switch (systemId) {
    case 'CBSE':
      return {
        systemId: 'CBSE',
        classOrStage,
        frameworkTitle: 'NCF-SE 2023 / CBSE English Language Curriculum (Classes 6–8)',
        evidenceStatus: 'VERIFIED EVIDENCE',
        documentCitation: 'NCF-SE (National Curriculum Framework for School Education) 2023 §4.2; CBSE Curriculum Guide 2026–27.',
        authority: 'Central Board of Secondary Education & NCERT',
        pedagogicalFocus: 'Competency-based functional language acquisition, communicative grammar, spiral sentence synthesis, and authentic situational contexts.',
        terminologyNotes: 'Uses "Subject-Verb Concord", "Determiners", "Reported Speech", and "Section B Writing & Grammar".',
        boardAssessmentModel: 'Section B discrete grammar (gap-filling, editing/omission, sentence reordering) + creative writing integration.',
      };
    case 'CISCE':
      return {
        systemId: 'CISCE',
        classOrStage,
        frameworkTitle: 'CISCE Middle School English Curriculum (Classes 6–8) / ICSE Foundation',
        evidenceStatus: 'VERIFIED EVIDENCE',
        documentCitation: 'CISCE Guidelines for Middle School English Curriculum (Theme: Grammar & Usage), Council for the Indian School Certificate Examinations.',
        authority: 'Council for the Indian School Certificate Examinations',
        pedagogicalFocus: 'Classical formal grammar architecture, sentence synthesis, clause analysis, and rigorous transformational drills.',
        terminologyNotes: 'Uses "Subject-Verb Agreement", "Phrasal Verbs & Prepositions", "Direct & Indirect Speech", and "Question 5 Transformations".',
        boardAssessmentModel: 'ICSE Paper 1 Question 5 style: passage verb inflection brackets, prepositions, sentence joining without "and/but/so", and formal transformations.',
      };
    case 'Cambridge':
      return {
        systemId: 'Cambridge',
        classOrStage: classOrStage.includes('Stage') ? classOrStage : 'Lower Secondary Stage 7',
        frameworkTitle: 'Cambridge Lower Secondary English Curriculum Framework (0861)',
        evidenceStatus: 'VERIFIED EVIDENCE',
        documentCitation: 'Cambridge Lower Secondary English Framework (Stages 7–9), Cambridge Assessment International Education.',
        authority: 'Cambridge University Press & Assessment',
        pedagogicalFocus: 'Inquiry-based syntactic awareness, stylistic grammar choices for reader impact, register modulation, and integrated text construction. (Not governed by NEP/NCF).',
        terminologyNotes: 'Uses "Grammatical effect", "Text cohesion & connectives", "Active vs passive for rhetorical distance", "Nominalisation".',
        boardAssessmentModel: 'Holistic assessment in Reading Comprehension & Directed Writing tasks under Grammatical Range & Accuracy rubrics.',
      };
    default:
      return {
        systemId: 'CBSE',
        classOrStage,
        frameworkTitle: 'Universal Linguistic Core Curriculum',
        evidenceStatus: 'EDITORIAL INTERPRETATION',
        documentCitation: 'Veritas Academic Standards 2026.',
        authority: 'Veritas Academic Editorial Board',
        pedagogicalFocus: 'Systematic spiral progression from recognition to controlled practice, authentic composition, and evaluative mastery.',
        terminologyNotes: 'Standard descriptive linguistic terminology.',
        boardAssessmentModel: 'Integrated diagnostic, formative, and cumulative summative instruments.',
      };
  }
}

// ============================================================================
// SEQUENCE INTELLIGENCE & AUDIT ENGINE
// ============================================================================
export function runScopeSequenceAudit(
  rows: ScopeSequenceMasterRow[],
  system?: string,
  classOrStage?: string
): ScopeSequenceAuditFinding[] {
  const findings: ScopeSequenceAuditFinding[] = [];

  // 1. Prerequisite clashes
  const prereqWarnings = validateSequencePrerequisites(rows);
  prereqWarnings.forEach((w) => {
    findings.push({
      id: `audit-prereq-${w.rowId}`,
      type: 'missing_prerequisite',
      severity: 'CRITICAL',
      title: `Prerequisite Violation: ${w.chapterTitle}`,
      description: w.message,
      recommendation: `Move "${w.chapterTitle}" to sequence position after Chapter ${w.requiredBeforeChapterNumber} or adjust prerequisites.`,
      affectedRowId: w.rowId,
      status: 'PENDING',
      isAiGenerated: true,
    });
  });

  // 2. Overloaded or underdeveloped chapters
  rows.forEach((row) => {
    if (row.estimatedPages > 18 || row.recommendedTeachingLessons > 7) {
      findings.push({
        id: `audit-overload-${row.id}`,
        type: 'overloaded_chapter',
        severity: 'REVIEW',
        title: `Overloaded Chapter Scope: ${row.chapterTitle}`,
        description: `This chapter is allocated ${row.estimatedPages} pages and ${row.recommendedTeachingLessons} lessons. Middle school attention spans and weekly timetables generally limit single chapters to 12–16 pages.`,
        recommendation: `Consider splitting into two sub-modules or moving advanced challenge exercises into an extension unit.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: true,
      });
    }

    if (row.estimatedPages < 10 || row.exerciseProfile.length < 3) {
      findings.push({
        id: `audit-underdev-${row.id}`,
        type: 'underdeveloped_chapter',
        severity: 'SUGGESTION',
        title: `Underdeveloped Chapter: ${row.chapterTitle}`,
        description: `Allocated only ${row.estimatedPages} pages and ${row.exerciseProfile.length} exercise types. May lack adequate scaffolding for diverse learners.`,
        recommendation: `Add at least one application drill and an error-editing exercise to reinforce learning.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: true,
      });
    }

    // 3. Assessment before teaching check
    if (row.assessmentAlignments) {
      row.assessmentAlignments.forEach((al) => {
        if (al.assessed && !al.taught) {
          findings.push({
            id: `audit-assessed-untaught-${row.id}-${al.objectiveId}`,
            type: 'assessed_before_teaching',
            severity: 'CRITICAL',
            title: `Objective Assessed but Not Taught: ${al.objectiveText}`,
            description: `Learning objective "${al.objectiveText}" is included in the assessment instrument but is marked as NOT taught in instructional lessons.`,
            recommendation: `Ensure direct instruction and guided practice precede formal testing.`,
            affectedRowId: row.id,
            status: 'PENDING',
            isAiGenerated: true,
          });
        }
      });
    }

    // 4. Academic Integrity & Evidence Status Checks (Phase 4I Integrity)
    // 4a. Unsupported VERIFIED claims
    if (row.evidenceStatus === 'VERIFIED') {
      const rec = row.evidenceRecord;
      const hasOrg = Boolean(rec?.issuingOrganisation?.trim());
      const hasDoc = Boolean(rec?.documentTitle?.trim() || rec?.sourceTitle?.trim());
      const hasYear = Boolean(rec?.versionOrYear?.trim());
      const hasCitation = Boolean(rec?.pageOrSection?.trim() || rec?.citationReference?.trim() || row.evidenceCitation?.trim());
      if (!hasOrg || !hasDoc || !hasYear || !hasCitation) {
        findings.push({
          id: `audit-unsupported-verified-${row.id}`,
          type: 'unsupported_verified_claim',
          severity: 'CRITICAL',
          category: 'Academic Integrity',
          title: `Unsupported VERIFIED Claim: ${row.chapterTitle}`,
          description: `Chapter curriculum claim is marked as VERIFIED, but lacks a complete stored primary evidence citation with issuing organisation, document title, and page/section citation. Seed or demonstration data must never be marked VERIFIED without stored evidence.`,
          recommendation: `Downgrade evidence status to EDITORIAL / DEMO or SOURCE ATTACHED — REVIEW REQUIRED until primary publication citations are stored.`,
          affectedRowId: row.id,
          status: 'PENDING',
          isAiGenerated: false,
        });
      }
    }

    // 4b. Internal IDs presented as official codes
    const code = row.curriculumMappingCode || row.internalMappingId || '';
    if (code && (code.startsWith('CBSE-LO-') || code.startsWith('VTR-') || code.startsWith('CISCE-LO-'))) {
      if (!row.evidenceRecord?.isOfficialCodeVerified && (!row.officialCurriculumRef || row.officialCurriculumRef.includes('Pending'))) {
        findings.push({
          id: `audit-internal-code-${row.id}`,
          type: 'internal_id_as_official_code',
          severity: 'REVIEW',
          category: 'Academic Integrity',
          title: `Internal Mapping ID Clarification: ${row.chapterTitle}`,
          description: `Mapping identifier "${code}" is a VERITAS internal database record ID. It must not be presented as a board-gazetted official curriculum code without verified publication evidence.`,
          recommendation: `Ensure column is labelled "Internal Mapping ID" and maintain a separate "Official Board Reference" field until verified.`,
          affectedRowId: row.id,
          status: 'PENDING',
          isAiGenerated: false,
        });
      }
    }

    // 4c. Missing citations
    if (row.evidenceStatus === 'MAPPED_SOURCE_REQUIRED' || (!row.evidenceCitation && !row.evidenceRecord?.citationReference)) {
      findings.push({
        id: `audit-missing-citation-${row.id}`,
        type: 'missing_citation',
        severity: 'REVIEW',
        category: 'Academic Integrity',
        title: `Missing Primary Source Citation: ${row.chapterTitle}`,
        description: `Pedagogical mapping exists for "${row.conceptTitle}" but lacks an official curriculum framework or board syllabus citation.`,
        recommendation: `Open Evidence Inspector and attach primary source citation (issuing organisation, document title, and page/section).`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: false,
      });
    }

    // 4d. Framework association mistaken for chapter verification
    if (row.frameworkAssociation && row.frameworkAssociation.includes('NCF-SE') && row.evidenceStatus === 'VERIFIED' && !row.evidenceRecord?.pageOrSection) {
      findings.push({
        id: `audit-framework-inferred-${row.id}`,
        type: 'framework_association_mistake',
        severity: 'CRITICAL',
        category: 'Academic Integrity',
        title: `Framework Association Mistaken for Chapter Verification: ${row.chapterTitle}`,
        description: `National Curriculum Framework (NCF-SE 2023) is recorded as a policy association. Broad framework statements do NOT establish chapter-level syllabus verification without specific board publications.`,
        recommendation: `Delineate framework policy association from chapter-level learning outcome verification.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: false,
      });
    }

    // 4e. Class / Stage mismatches & prior learning demarcation
    if (row.priorLearning && row.priorLearning.includes('Class 5') && !row.currentTreatment) {
      findings.push({
        id: `audit-prior-learning-boundary-${row.id}`,
        type: 'prior_learning_boundary',
        severity: 'REVIEW',
        category: 'Academic Integrity',
        title: `Prior Learning Boundary Demarcation: ${row.chapterTitle}`,
        description: `Prerequisite text mentions "Class 5" without an explicit separate "Current Stage Treatment" field. This risks displaying Class 5 content as current Class 6 scope.`,
        recommendation: `Visually and structurally separate CURRENT CLASS/STAGE TREATMENT from PRIOR LEARNING.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: false,
      });
    }

    // 4f. Unverified board-specific assertions
    if (
      row.boardSystemNotes &&
      (row.boardSystemNotes.toLowerCase().includes('marks') ||
        row.boardSystemNotes.toLowerCase().includes('section b') ||
        row.boardSystemNotes.toLowerCase().includes('exam format')) &&
      (!row.evidenceRecord?.citationReference?.toLowerCase().includes('sqp') &&
        !row.evidenceRecord?.citationReference?.toLowerCase().includes('circular') &&
        !row.evidenceRecord?.citationReference?.toLowerCase().includes('marking scheme'))
    ) {
      findings.push({
        id: `audit-unverified-exam-assertion-${row.id}`,
        type: 'unverified_board_assertion',
        severity: 'REVIEW',
        category: 'Academic Integrity',
        title: `Unverified Board Examination Assertion: ${row.chapterTitle}`,
        description: `Board notes assert specific examination weighting or question pattern ("${row.boardSystemNotes}"). Board-specific assertions must not be presented as definitive without verified Sample Question Paper (SQP) or marking scheme citations.`,
        recommendation: `Label as editorial advisory or attach official board circular / sample paper citation.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: false,
      });
    }

    // 4g. Unverified assumption / demo model notification
    if (row.evidenceStatus === 'EDITORIAL_DEMO' || row.evidenceStatus === 'UNVERIFIED_EDITORIAL_MODEL' || row.evidenceStatus === 'AI_SUGGESTED_UNVERIFIED') {
      findings.push({
        id: `audit-demo-model-${row.id}`,
        type: 'editorial_demonstration_notice',
        severity: 'INFORMATION',
        category: 'Academic Integrity',
        title: `Editorial Demonstration Row: ${row.chapterTitle}`,
        description: `This chapter is part of the illustrative demonstration sequence. Pedagogical structure is modelled for instructional planning, pending formal primary gazette verification.`,
        recommendation: `Use Evidence Inspector to record official board citations when publishing official courseware.`,
        affectedRowId: row.id,
        status: 'PENDING',
        isAiGenerated: false,
      });
    }
  });

  // 5. Check for missing revision cycles
  const hasRevisionUnit = rows.some((r) => r.strand === 'Assessment & Synthesis' || r.chapterTitle.toLowerCase().includes('revision'));
  if (!hasRevisionUnit) {
    findings.push({
      id: 'audit-missing-revision',
      type: 'missing_reinforcement',
      severity: 'REVIEW',
      title: 'Missing Term Revision Cycle',
      description: 'The sequence lacks an explicit cumulative revision unit before term-end examinations.',
      recommendation: 'Insert an integrated revision unit at mid-year and year-end intervals to consolidate spiral retention.',
      status: 'PENDING',
      isAiGenerated: true,
    });
  }

  return findings;
}

// ============================================================================
// CURRICULUM COVERAGE CALCULATIONS
// ============================================================================
export interface CurriculumCoverageSummary {
  totalObjectivesCount: number;
  mappedObjectivesCount: number;
  coveredObjectivesCount: number;
  partiallyCoveredCount: number;
  notYetCoveredCount: number;
  needsReviewCount: number;
  verifiedAlignmentCount: number;
  curriculumCoveragePercentage: number;
  verifiedAlignmentPercentage: number;
  prescribedTopicsCount: number;
  coveredTopicsCount: number;
  coveragePercentage: number;
  missingPrescribedTopics: string[];
}

export function calculateCurriculumCoverage(
  rows: ScopeSequenceMasterRow[],
  system?: CurriculumSystemId,
  classOrStage?: string
): CurriculumCoverageSummary {
  let totalObjs = 0;
  let coveredObjs = 0;
  let partiallyCovered = 0;
  let verifiedCount = 0;
  let needsReview = 0;

  rows.forEach((row) => {
    const objs = row.learningObjectives || [];
    totalObjs += objs.length;

    // Check exercise and assessment coverage
    if (row.exerciseProfile.length >= 3 && row.assessmentEvidence.length >= 2) {
      coveredObjs += objs.length;
    } else if (row.exerciseProfile.length > 0) {
      partiallyCovered += objs.length;
    }

    if (row.evidenceStatus === 'VERIFIED') {
      verifiedCount += objs.length;
    } else if (row.evidenceStatus === 'NEEDS_ACADEMIC_REVIEW' || row.evidenceStatus === 'AI_SUGGESTED_UNVERIFIED') {
      needsReview += objs.length;
    }
  });

  const notCovered = Math.max(0, totalObjs - coveredObjs - partiallyCovered);
  const coveragePct = totalObjs > 0 ? Math.round(((coveredObjs + partiallyCovered * 0.5) / totalObjs) * 100) : 0;
  const verifiedPct = totalObjs > 0 ? Math.round((verifiedCount / totalObjs) * 100) : 0;

  const missingPrescribed: string[] = [];
  const allRowTitles = rows.map((r) => r.chapterTitle.toLowerCase() + ' ' + r.conceptTitle.toLowerCase());
  
  if (system === 'CBSE' && !allRowTitles.some((t) => t.includes('reported speech') || t.includes('narration'))) {
    missingPrescribed.push('Direct & Indirect Speech (Reported Commands and Requests)');
  }
  if (system === 'CISCE' && !allRowTitles.some((t) => t.includes('synthesis') || t.includes('transformation'))) {
    missingPrescribed.push('Sentence Synthesis without "and / but / so" (ICSE Q5 prep)');
  }

  return {
    totalObjectivesCount: totalObjs,
    mappedObjectivesCount: totalObjs,
    coveredObjectivesCount: coveredObjs,
    partiallyCoveredCount: partiallyCovered,
    notYetCoveredCount: notCovered,
    needsReviewCount: needsReview,
    verifiedAlignmentCount: verifiedCount,
    curriculumCoveragePercentage: coveragePct,
    verifiedAlignmentPercentage: verifiedPct,
    prescribedTopicsCount: rows.length + missingPrescribed.length,
    coveredTopicsCount: rows.length,
    coveragePercentage: coveragePct,
    missingPrescribedTopics: missingPrescribed,
  };
}

// ============================================================================
// SYSTEM SEQUENCE ADAPTATION MODELS
// ============================================================================
export const SYSTEM_ADAPTATION_PROPOSALS: Record<string, SystemSequenceAdaptationProposal> = {
  'cbse-to-cisce': {
    id: 'adapt-cbse-cisce-c6',
    fromSystem: 'CBSE',
    toSystem: 'CISCE',
    targetClassOrStage: 'CISCE Class 6 (ICSE Prep)',
    status: 'AI_SUGGESTED_UNVERIFIED',
    terminologyDifferences: [
      { term: 'Concord vs Agreement', explanation: 'CBSE commonly uses "Subject-Verb Concord"; CISCE syllabuses typically index under "Subject-Verb Agreement" and "Synthesis of Sentences".' },
      { term: 'Section B vs Question 5', explanation: 'CBSE tests discrete grammar in Section B (objective gap-filling); CISCE tests in Paper 1 Question 5(a) verb brackets and Question 5(d) full sentence transformations.' },
      { term: 'Transformation without changing meaning', explanation: 'CISCE emphasizes classic formal transformation prompts (e.g. "Begin with...", "Use: Unless", "No sooner... than").' },
    ],
    depthDifferences: 'CISCE Class 6 introduces explicit clause taxonomy earlier (noun, adverbial, and adjectival clauses) and requires rigorous sentence transformation drills without multiple-choice scaffolding.',
    sequenceShiftNotes: 'Introduce Clause Synthesis and Transformation (Chapter 10) earlier in the sequence, directly following Tenses and Voice.',
    pedagogicalTreatmentDifferences: 'Shift from communicative daily-life gap-filling to classical literary sentence analysis, continuous passage verb inflection, and formal precis preparation.',
    exerciseStyleDifferences: 'Add transformation drills ("Rewrite using No sooner... than", "Rewrite omitting Too") and remove simplified 1-mark multiple-choice items.',
    assessmentStyleDifferences: 'ICSE Paper 1 style: 4-mark continuous narrative passage verb insertion and 8-mark sentence transformation.',
    expectedApplication: 'Precise syntactic flexibility required for ICSE English Language composition and comprehension papers.',
    universalCorePreserved: 'Preserves the identical Universal Linguistic Core of finite subject-predicate agreement, aspectual verb tense forms, and diathesis constraints.',
  },
  'cbse-to-cambridge': {
    id: 'adapt-cbse-cambridge-stage7',
    fromSystem: 'CBSE',
    toSystem: 'Cambridge',
    targetClassOrStage: 'Cambridge Lower Secondary Stage 7 (0861)',
    status: 'AI_SUGGESTED_UNVERIFIED',
    terminologyDifferences: [
      { term: 'Discrete Grammar vs Grammatical Effect', explanation: 'Cambridge frameworks evaluate grammar primarily through functional effect and stylistic impact on the reader rather than as isolated rule checklists.' },
      { term: 'Concord in complex noun phrases', explanation: 'Cambridge focuses on agreement within multi-modified noun phrases in varied registers and genre contexts.' },
    ],
    depthDifferences: 'Cambridge Stage 7 emphasizes stylistic register, text cohesion, active vs passive voice for rhetorical distance, and grammatical choices to create literary suspense.',
    sequenceShiftNotes: 'Integrate grammar instruction directly alongside text types (e.g. passive voice paired with formal science explanations; modal verbs paired with persuasive speeches).',
    pedagogicalTreatmentDifferences: 'Inquiry-based text investigation: students analyze how published authors choose sentence types to guide reader emotions.',
    exerciseStyleDifferences: 'Analytical commentary prompts ("Explain how the author uses short clauses to build tension") and creative genre-specific writing prompts.',
    assessmentStyleDifferences: 'Cambridge Checkpoint and IGCSE rubrics: holistic assessment under Grammatical Range & Accuracy and Style & Organization.',
    expectedApplication: 'Integrated writing tasks across narrative, persuasive, and informational genres.',
    universalCorePreserved: 'Underlying syntactic rules of head noun agreement, clause hierarchy, and modal functions remain universal across all three systems.',
  },
};

// ============================================================================
// HELPER TO RETRIEVE OR INITIALIZE ROWS FOR A GIVEN BOOK PROJECT
// ============================================================================
export function getInitialScopeSequenceRows(
  project?: BookProject,
  seriesProject?: GrammarSeriesProject
): ScopeSequenceMasterRow[] {
  // If project has saved scopeSequenceRows, return them
  if ((project as any)?.scopeSequenceRows && Array.isArray((project as any).scopeSequenceRows)) {
    return (project as any).scopeSequenceRows;
  }

  // Default to our comprehensive CBSE Class 6 demo dataset
  return CBSE_CLASS_6_DEMO_ROWS;
}
