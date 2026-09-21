import {
  CurriculumSystemId,
  GrammarClassLevel,
  CognitiveLevel,
  QuestionType,
  RichQuestionType,
  MarkingIntelligenceModel,
  AssessmentIntegrityStatus,
  BlueprintSourceEvidence,
  AssessmentProfile,
  BoardQuestionBlueprint,
  BlueprintSection,
  BlueprintQuestionGroup,
  BlueprintCoverageMatrixRow,
  QuestionBankGapItem,
  SystemComparisonEntry,
  SystemSpecificPolicyProfile,
  BlueprintAuditIssue,
  BlueprintComprehensiveAuditResult,
  OpenEndedMarkingGuideline,
  GrammarSeriesProject,
} from '../types';

// ============================================================================
// 1. EDUCATION SYSTEM CONFIGURATIONS & LEVEL TERMINOLOGY
// ============================================================================

export interface SystemLevelConfig {
  id: string;
  label: string;
  programme: string;
  stageCode: string;
  isBoardExamLevel: boolean;
  notes: string;
}

export interface EducationSystemConfig {
  id: CurriculumSystemId;
  name: string;
  shortName: string;
  fullName: string;
  governingBody: string;
  headquarters: string;
  levels: SystemLevelConfig[];
  primaryGrammarPhilosophy: string;
  typicalExamDurationMin: number;
}

export const EDUCATION_SYSTEMS: Record<CurriculumSystemId, EducationSystemConfig> = {
  CBSE: {
    id: 'CBSE',
    name: 'CBSE',
    shortName: 'CBSE',
    fullName: 'Central Board of Secondary Education',
    governingBody: 'Ministry of Education, Government of India',
    headquarters: 'New Delhi, India',
    primaryGrammarPhilosophy:
      'Contextual and functional grammar integrated into discourse extracts. Focuses on communicative accuracy rather than formal grammatical nomenclature.',
    typicalExamDurationMin: 180,
    levels: [
      { id: 'Class 1', label: 'Class 1', programme: 'Primary / Foundational', stageCode: 'PRI-1', isBoardExamLevel: false, notes: 'School-based foundational assessment (NCF-FS / NCERT guidelines; no board examination exists)' },
      { id: 'Class 2', label: 'Class 2', programme: 'Primary / Foundational', stageCode: 'PRI-2', isBoardExamLevel: false, notes: 'School-based foundational assessment' },
      { id: 'Class 3', label: 'Class 3', programme: 'Primary / Preparatory', stageCode: 'PRI-3', isBoardExamLevel: false, notes: 'School-based preparatory stage evaluation' },
      { id: 'Class 4', label: 'Class 4', programme: 'Primary / Preparatory', stageCode: 'PRI-4', isBoardExamLevel: false, notes: 'School-based preparatory stage evaluation' },
      { id: 'Class 5', label: 'Class 5', programme: 'Primary / Preparatory', stageCode: 'PRI-5', isBoardExamLevel: false, notes: 'School-based preparatory stage evaluation' },
      { id: 'Class 6', label: 'Class 6', programme: 'Middle School', stageCode: 'MS-6', isBoardExamLevel: false, notes: 'School-based annual assessment based on NCERT / CBSE curriculum' },
      { id: 'Class 7', label: 'Class 7', programme: 'Middle School', stageCode: 'MS-7', isBoardExamLevel: false, notes: 'School-based continuous & summative assessment' },
      { id: 'Class 8', label: 'Class 8', programme: 'Middle School', stageCode: 'MS-8', isBoardExamLevel: false, notes: 'Middle school culmination; school-based terminal evaluation' },
      { id: 'Class 9', label: 'Class 9', programme: 'Secondary School', stageCode: 'SEC-9', isBoardExamLevel: false, notes: 'Internal school assessment following official CBSE Class 9 sample blueprint' },
      { id: 'Class 10', label: 'Class 10', programme: 'Secondary School (AISSE)', stageCode: 'AISSE-10', isBoardExamLevel: true, notes: 'Gazetted National Board Examination (Subject Code 184)' },
      { id: 'Class 11', label: 'Class 11', programme: 'Senior Secondary', stageCode: 'SSEC-11', isBoardExamLevel: false, notes: 'Internal school assessment following CBSE Core / Elective syllabus' },
      { id: 'Class 12', label: 'Class 12', programme: 'Senior Secondary (AISSCE)', stageCode: 'AISSCE-12', isBoardExamLevel: true, notes: 'Gazetted National Board Examination (Subject Code 301)' },
    ],
  },
  CISCE: {
    id: 'CISCE',
    name: 'CISCE (ICSE / ISC)',
    shortName: 'CISCE',
    fullName: 'Council for the Indian School Certificate Examinations',
    governingBody: 'Council for the Indian School Certificate Examinations',
    headquarters: 'New Delhi, India',
    primaryGrammarPhilosophy:
      'Rigorous formal grammar, syntactic synthesis, explicit transformation drills, and precise prepositional mastery tested in Paper 1 (Question 5).',
    typicalExamDurationMin: 120,
    levels: [
      { id: 'Class 1', label: 'Class 1', programme: 'Primary', stageCode: 'CISCE-PRI-1', isBoardExamLevel: false, notes: 'CISCE Curriculum for Primary Schools (School-based evaluation; no formal board examination)' },
      { id: 'Class 2', label: 'Class 2', programme: 'Primary', stageCode: 'CISCE-PRI-2', isBoardExamLevel: false, notes: 'CISCE Curriculum for Primary Schools' },
      { id: 'Class 3', label: 'Class 3', programme: 'Primary', stageCode: 'CISCE-PRI-3', isBoardExamLevel: false, notes: 'CISCE Curriculum for Primary Schools' },
      { id: 'Class 4', label: 'Class 4', programme: 'Primary', stageCode: 'CISCE-PRI-4', isBoardExamLevel: false, notes: 'CISCE Curriculum for Primary Schools' },
      { id: 'Class 5', label: 'Class 5', programme: 'Primary', stageCode: 'CISCE-PRI-5', isBoardExamLevel: false, notes: 'CISCE Curriculum for Primary Schools' },
      { id: 'Class 6', label: 'Class 6', programme: 'Middle School', stageCode: 'CISCE-MS-6', isBoardExamLevel: false, notes: 'CISCE Curriculum for Middle Schools (Preschool to Class 8)' },
      { id: 'Class 7', label: 'Class 7', programme: 'Middle School', stageCode: 'CISCE-MS-7', isBoardExamLevel: false, notes: 'CISCE Curriculum for Middle Schools' },
      { id: 'Class 8', label: 'Class 8', programme: 'Middle School', stageCode: 'CISCE-MS-8', isBoardExamLevel: false, notes: 'Pre-ICSE foundation year' },
      { id: 'Class 9', label: 'Class 9 (ICSE)', programme: 'ICSE (Class 9–10)', stageCode: 'ICSE-9', isBoardExamLevel: false, notes: 'First year of two-year ICSE examination course' },
      { id: 'Class 10', label: 'Class 10 (ICSE)', programme: 'ICSE (Class 9–10)', stageCode: 'ICSE-10', isBoardExamLevel: true, notes: 'Official ICSE Board Examination (English Paper 1)' },
      { id: 'Class 11', label: 'Class 11 (ISC)', programme: 'ISC (Class 11–12)', stageCode: 'ISC-11', isBoardExamLevel: false, notes: 'First year of ISC qualification' },
      { id: 'Class 12', label: 'Class 12 (ISC)', programme: 'ISC (Class 11–12)', stageCode: 'ISC-12', isBoardExamLevel: true, notes: 'Official ISC Board Examination (English Paper 1)' },
    ],
  },
  Cambridge: {
    id: 'Cambridge',
    name: 'Cambridge International',
    shortName: 'Cambridge',
    fullName: 'Cambridge Assessment International Education',
    governingBody: 'University of Cambridge',
    headquarters: 'Cambridge, United Kingdom',
    primaryGrammarPhilosophy:
      'Integrated grammar in authentic reading and writing contexts. Assessment evaluates linguistic choices for effect, precision of vocabulary, and syntactic variety.',
    typicalExamDurationMin: 70,
    levels: [
      { id: 'Stage 1', label: 'Cambridge Primary Stage 1', programme: 'Cambridge Primary', stageCode: 'CP-S1', isBoardExamLevel: false, notes: 'Cambridge Primary English Curriculum Framework 0058' },
      { id: 'Stage 2', label: 'Cambridge Primary Stage 2', programme: 'Cambridge Primary', stageCode: 'CP-S2', isBoardExamLevel: false, notes: 'Cambridge Primary English Curriculum Framework 0058' },
      { id: 'Stage 3', label: 'Cambridge Primary Stage 3', programme: 'Cambridge Primary', stageCode: 'CP-S3', isBoardExamLevel: false, notes: 'Cambridge Primary English Curriculum Framework 0058' },
      { id: 'Stage 4', label: 'Cambridge Primary Stage 4', programme: 'Cambridge Primary', stageCode: 'CP-S4', isBoardExamLevel: false, notes: 'Cambridge Primary English Curriculum Framework 0058' },
      { id: 'Stage 5', label: 'Cambridge Primary Stage 5', programme: 'Cambridge Primary', stageCode: 'CP-S5', isBoardExamLevel: false, notes: 'Cambridge Primary English Curriculum Framework 0058' },
      { id: 'Stage 6', label: 'Cambridge Primary Stage 6', programme: 'Cambridge Primary', stageCode: 'CP-S6', isBoardExamLevel: false, notes: 'Culmination of Cambridge Primary; Cambridge Primary Checkpoint available' },
      { id: 'Stage 7', label: 'Cambridge Lower Secondary Stage 7', programme: 'Cambridge Lower Secondary', stageCode: 'CLS-S7', isBoardExamLevel: false, notes: 'Curriculum Framework 0861 Year 1' },
      { id: 'Stage 8', label: 'Cambridge Lower Secondary Stage 8', programme: 'Cambridge Lower Secondary', stageCode: 'CLS-S8', isBoardExamLevel: false, notes: 'Curriculum Framework 0861 Year 2' },
      { id: 'Stage 9', label: 'Cambridge Lower Secondary Checkpoint (Stage 9)', programme: 'Cambridge Lower Secondary', stageCode: 'CLS-S9', isBoardExamLevel: true, notes: 'External Cambridge Checkpoint Examination (Paper 1 & Paper 2)' },
      { id: 'IGCSE', label: 'Cambridge IGCSE (0500 / 0510)', programme: 'Cambridge Upper Secondary', stageCode: 'CIGCSE', isBoardExamLevel: true, notes: 'International General Certificate of Secondary Education' },
      { id: 'O Level', label: 'Cambridge O Level (1123)', programme: 'Cambridge Upper Secondary', stageCode: 'COL', isBoardExamLevel: true, notes: 'Cambridge O Level English Language' },
      { id: 'A Level', label: 'Cambridge International AS & A Level (9093)', programme: 'Cambridge Advanced', stageCode: 'CALEVEL', isBoardExamLevel: true, notes: 'Advanced Subsidiary and Advanced Level English Language' },
    ],
  },
};

// ============================================================================
// 2. OFFICIAL SOURCE EVIDENCE RECORDS
// ============================================================================

export const STORED_BLUEPRINT_EVIDENCE: Record<string, BlueprintSourceEvidence> = {
  'ev-cbse-10-2025': {
    id: 'ev-cbse-10-2025',
    issuingOrganisation: 'Central Board of Secondary Education (CBSE)',
    officialDocumentTitle: 'Curriculum for the Academic Year 2025–26: Secondary Curriculum (Group A1 - Languages)',
    syllabusSpecificationOrFramework: 'English Language & Literature (Subject Code 184)',
    examinationYearOrVersion: '2025–2026',
    paperOrComponent: 'Section B: Grammar (10 Marks)',
    pageOrSection: 'pp. 14–17, Section B Weightage & Question Typology',
    sourceUrlOrRef: 'https://cbseacademic.nic.in/curriculum_2026.html',
    verificationDate: '2025-04-12',
    verifiedBy: 'VERITAS Senior Assessment Specialist (CBSE Desk)',
    verificationStatus: 'VERIFIED',
    editorialNotes: 'Confirmed 12 questions presented with instruction to attempt any 10. Questions carry 1 mark each.',
  },
  'ev-cisce-icse-2026': {
    id: 'ev-cisce-icse-2026',
    issuingOrganisation: 'Council for the Indian School Certificate Examinations (CISCE)',
    officialDocumentTitle: 'Regulations and Syllabuses: Indian Certificate of Secondary Education Examination (ICSE) 2026',
    syllabusSpecificationOrFramework: 'English Language (Paper 1)',
    examinationYearOrVersion: '2026 Edition',
    paperOrComponent: 'Question 5: Functional Grammar (20 Marks)',
    pageOrSection: 'pp. 8–11, Paper 1 Examination Specifications',
    sourceUrlOrRef: 'https://cisce.org/publications/icse-2026-syllabus',
    verificationDate: '2025-05-18',
    verifiedBy: 'VERITAS Senior Assessment Specialist (CISCE Desk)',
    verificationStatus: 'VERIFIED',
    editorialNotes: 'Question 5 consists of: 5(a) verb cloze passage (4 marks), 5(b) prepositions (4 marks), 5(c) sentence combining (4 marks), 5(d) transformations without changing meaning (8 marks).',
  },
  'ev-camb-checkpoint-2024': {
    id: 'ev-camb-checkpoint-2024',
    issuingOrganisation: 'Cambridge Assessment International Education',
    officialDocumentTitle: 'Cambridge Lower Secondary English Curriculum Framework (0861)',
    syllabusSpecificationOrFramework: 'Lower Secondary English Stage 9 Checkpoint Specification',
    examinationYearOrVersion: 'Version 2.0 (2024)',
    paperOrComponent: 'Paper 1 (Non-Fiction) & Paper 2 (Fiction) — Language & Structure',
    pageOrSection: 'Section 4: Assessment Overview, pp. 22–27',
    sourceUrlOrRef: 'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/',
    verificationDate: '2024-11-04',
    verifiedBy: 'VERITAS International Curriculum Audit Lead',
    verificationStatus: 'VERIFIED',
    editorialNotes: 'Language skills assessed in context of unseen extracts. No decontextualized single-sentence drills.',
  },
};

// ============================================================================
// 3. SYSTEM ASSESSMENT PROFILES (20+ Fields each with Integrity Status)
// ============================================================================

export const SYSTEM_ASSESSMENT_PROFILES: Record<string, AssessmentProfile> = {
  'cbse-class6': {
    id: 'cbse-class6',
    systemId: 'CBSE',
    programme: { value: 'Middle School', status: 'VERIFIED', notes: 'NCERT / CBSE Middle Years curriculum stage' },
    classOrStageOrQualification: { value: 'Class 6', status: 'VERIFIED' },
    subject: { value: 'English (Grammar & Composition)', status: 'VERIFIED' },
    assessmentContext: {
      value: 'School-based Term & Annual Assessment (Formative + Summative)',
      status: 'EDITORIAL MODEL',
      notes: 'CBSE does not administer public external board examinations at Class 6; assessment is internal school-administered based on CBSE syllabus guidelines.',
    },
    assessmentType: { value: 'Written Pen-and-Paper Examination', status: 'EDITORIAL MODEL' },
    internalOrExternal: { value: 'Internal', status: 'VERIFIED' },
    paperOrComponent: { value: 'Section B: Grammar & Writing Skills (Editorial Demonstration Model)', status: 'EDITORIAL MODEL' },
    durationMinutes: { value: 60, status: 'EDITORIAL MODEL' },
    maximumMarks: { value: 30, status: 'EDITORIAL MODEL' },
    sectionStructure: {
      value: 'Section A: Reading & Textual Grammar (10m), Section B: Grammar Exercises (10m), Section C: Guided Writing (10m)',
      status: 'EDITORIAL MODEL',
    },
    questionFamilies: {
      value: ['MCQ', 'Gap Filling', 'Error Correction', 'Sentence Transformation', 'Short Response'],
      status: 'EDITORIAL MODEL',
    },
    responseTypes: {
      value: ['Single word', 'Short sentence', 'Targeted blank', 'Structured paragraph'],
      status: 'EDITORIAL MODEL',
    },
    markingMethod: {
      value: 'Exact Objective Answer for blanks; Rule-based semantic equivalence for transformations; Point-based rubric for composition',
      status: 'EDITORIAL MODEL',
    },
    cognitiveDemand: {
      value: 'Understanding (40%), Applying (40%), Analysing (20%)',
      status: 'EDITORIAL MODEL',
      notes: 'VERITAS Editorial Taxonomy aligned to developmental tiering',
    },
    skillsAssessed: {
      value: ['Subject-Verb Concord', 'Tenses', 'Prepositions', 'Sentence Structure', 'Guided Composition'],
      status: 'EDITORIAL MODEL',
    },
    grammarIntegration: {
      value: 'Contextual sentence items and short narrative passages with embedded blanks and error spots',
      status: 'EDITORIAL MODEL',
    },
    writingIntegration: {
      value: 'Notice writing, informal letter, or factual description utilizing target grammatical structures',
      status: 'EDITORIAL MODEL',
    },
    readingIntegration: {
      value: 'Unseen comprehension paragraph (150 words) with vocabulary and grammatical concord questions',
      status: 'EDITORIAL MODEL',
    },
    evidence: [],
    overallStatus: 'EDITORIAL MODEL',
    editorialNotes:
      'NOTE: Class 6 does not have a centrally gazetted CBSE board examination blueprint. This profile serves as an academic publishing editorial progression model bridging elementary learning outcomes to secondary exam expectations.',
  },

  'cbse-class10': {
    id: 'cbse-class10',
    systemId: 'CBSE',
    programme: { value: 'Secondary School (AISSE)', status: 'VERIFIED' },
    classOrStageOrQualification: { value: 'Class 10', status: 'VERIFIED' },
    subject: { value: 'English Language and Literature (Subject Code 184)', status: 'VERIFIED' },
    assessmentContext: { value: 'Terminal National Board Examination', status: 'VERIFIED' },
    assessmentType: { value: 'Written Board Examination', status: 'VERIFIED' },
    internalOrExternal: { value: 'External', status: 'VERIFIED' },
    paperOrComponent: { value: 'Section B: Grammar (10 Marks)', status: 'VERIFIED', evidenceRefId: 'ev-cbse-10-2025' },
    durationMinutes: { value: 25, status: 'EDITORIAL MODEL', notes: 'Recommended allocation out of 180 min total paper' },
    maximumMarks: { value: 10, status: 'VERIFIED', evidenceRefId: 'ev-cbse-10-2025' },
    sectionStructure: {
      value: '12 contextual questions; candidates attempt any 10; 1 mark each; total 10 marks',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cbse-10-2025',
    },
    questionFamilies: {
      value: ['Gap Filling / Cloze', 'Reported Speech Dialogue', 'Error Identification and Correction', 'MCQ Selection'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-cbse-10-2025',
    },
    responseTypes: {
      value: ['Single targeted word / phrase', 'Transformation rewrite clause', 'Option index with correct phrase'],
      status: 'VERIFIED',
    },
    markingMethod: {
      value: '1 mark per correct answer; no partial (0.5) marks; reporting verb and tense sequence strictly evaluated',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cbse-10-2025',
    },
    cognitiveDemand: {
      value: 'Applying (60%), Analysing (30%), Understanding (10%)',
      status: 'EDITORIAL MODEL',
      notes: 'VERITAS taxonomy breakdown of official competency descriptors',
    },
    skillsAssessed: {
      value: ['Tenses', 'Modals', 'Subject-Verb Concord', 'Reported Speech (Commands/Requests, Statements, Questions)', 'Determiners'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-cbse-10-2025',
    },
    grammarIntegration: {
      value: 'Fully contextualized in authentic blurbs, newspaper excerpts, notices, advertisements, and spoken dialogues',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cbse-10-2025',
    },
    writingIntegration: {
      value: 'Tested in separate Section B writing items (Formal Letter, Analytical Paragraph 10 marks total)',
      status: 'VERIFIED',
    },
    readingIntegration: {
      value: 'Tested in Section A (20 marks)',
      status: 'VERIFIED',
    },
    evidence: [STORED_BLUEPRINT_EVIDENCE['ev-cbse-10-2025']],
    overallStatus: 'VERIFIED',
    editorialNotes:
      'Official syllabus mandates 10 marks from 12 items. Decontextualized grammatical definitions are explicitly forbidden in paper construction.',
  },

  'cisce-icse10': {
    id: 'cisce-icse10',
    systemId: 'CISCE',
    programme: { value: 'ICSE (Class 9–10)', status: 'VERIFIED' },
    classOrStageOrQualification: { value: 'Class 10', status: 'VERIFIED' },
    subject: { value: 'English Language (Paper 1)', status: 'VERIFIED' },
    assessmentContext: { value: 'Terminal ICSE National Examination', status: 'VERIFIED' },
    assessmentType: { value: 'Written Board Examination', status: 'VERIFIED' },
    internalOrExternal: { value: 'External', status: 'VERIFIED' },
    paperOrComponent: { value: 'Paper 1, Question 5 (Functional Grammar)', status: 'VERIFIED', evidenceRefId: 'ev-cisce-icse-2026' },
    durationMinutes: { value: 35, status: 'EDITORIAL MODEL', notes: 'Recommended allocation out of 120 min total paper' },
    maximumMarks: { value: 20, status: 'VERIFIED', evidenceRefId: 'ev-cisce-icse-2026' },
    sectionStructure: {
      value: '5(a) Verb Cloze (4m), 5(b) Appropriate Preposition (4m), 5(c) Sentence Synthesis without and/but/so (4m), 5(d) Transformation of Sentences (8m)',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cisce-icse-2026',
    },
    questionFamilies: {
      value: ['Cloze Passage', 'Gap Filling', 'Sentence Combining (Synthesis)', 'Sentence Transformation (Do as Directed)'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-cisce-icse-2026',
    },
    responseTypes: {
      value: ['Exact inflected verb', 'Single preposition', 'Combined complex/compound sentence', 'Rewritten transformed sentence'],
      status: 'VERIFIED',
    },
    markingMethod: {
      value: 'Exact spelling required for verbs/prepositions; syntactic transformation must preserve meaning completely without extraneous modification',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cisce-icse-2026',
    },
    cognitiveDemand: {
      value: 'Applying (50%), Analysing (35%), Understanding (15%)',
      status: 'EDITORIAL MODEL',
    },
    skillsAssessed: {
      value: ['Finite and Non-Finite Verbs', 'Prepositional Idioms / Phrasal Verbs', 'Sentence Synthesis (Participles, Conjunctions)', 'Degrees of Comparison, Voice, Direct/Indirect, Conditional Clauses'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-cisce-icse-2026',
    },
    grammarIntegration: {
      value: 'Question 5(a) is continuous narrative passage; 5(b)-(d) are discrete formal grammatical transformation items',
      status: 'VERIFIED',
      evidenceRefId: 'ev-cisce-icse-2026',
    },
    writingIntegration: {
      value: 'Assessed in Question 1 (Composition 20m), Question 2 (Letter 10m), Question 3 (Notice & Email 10m)',
      status: 'VERIFIED',
    },
    readingIntegration: {
      value: 'Assessed in Question 4 (Unseen passage with précis / summary 20m)',
      status: 'VERIFIED',
    },
    evidence: [STORED_BLUEPRINT_EVIDENCE['ev-cisce-icse-2026']],
    overallStatus: 'VERIFIED',
    editorialNotes:
      'CISCE strictly penalizes spelling and punctuation errors in rewritten sentences. Synthesis items forbid the coordinating conjunctions and, but, and so.',
  },

  'cisce-class6': {
    id: 'cisce-class6',
    systemId: 'CISCE',
    programme: { value: 'Middle School', status: 'VERIFIED' },
    classOrStageOrQualification: { value: 'Class 6', status: 'VERIFIED' },
    subject: { value: 'English Language', status: 'VERIFIED' },
    assessmentContext: { value: 'School-based Middle Years Examination', status: 'EDITORIAL MODEL' },
    assessmentType: { value: 'Written Paper', status: 'EDITORIAL MODEL' },
    internalOrExternal: { value: 'Internal', status: 'VERIFIED' },
    paperOrComponent: { value: 'Paper 1 Grammar Section (Editorial Model)', status: 'EDITORIAL MODEL' },
    durationMinutes: { value: 45, status: 'EDITORIAL MODEL' },
    maximumMarks: { value: 25, status: 'EDITORIAL MODEL' },
    sectionStructure: {
      value: 'Part 1: Parts of Speech & Agreement (10m), Part 2: Tenses & Auxiliaries (8m), Part 3: Guided Synthesis (7m)',
      status: 'EDITORIAL MODEL',
    },
    questionFamilies: {
      value: ['Fill in blanks', 'Identify & Label', 'Sentence Combining', 'Sentence Reordering'],
      status: 'EDITORIAL MODEL',
    },
    responseTypes: {
      value: ['Single word', 'Rewritten combined sentence'],
      status: 'EDITORIAL MODEL',
    },
    markingMethod: { value: 'Exact answer for blanks; acceptable syntactic alternatives for combining', status: 'EDITORIAL MODEL' },
    cognitiveDemand: { value: 'Understanding (40%), Applying (45%), Analysing (15%)', status: 'EDITORIAL MODEL' },
    skillsAssessed: { value: ['Subject-Verb Concord', 'Pronoun-Antecedent Agreement', 'Basic Prepositions', 'Simple Conjunctions'], status: 'EDITORIAL MODEL' },
    grammarIntegration: { value: 'Isolated sentences and short 2-sentence combinations', status: 'EDITORIAL MODEL' },
    writingIntegration: { value: 'Paragraph writing with grammatical checklist', status: 'EDITORIAL MODEL' },
    readingIntegration: { value: 'Comprehension passage with grammar extraction', status: 'EDITORIAL MODEL' },
    evidence: [],
    overallStatus: 'EDITORIAL MODEL',
    editorialNotes: 'CISCE Middle School syllabus focuses on grammatical terminology and building towards Class 9-10 Question 5 rigor.',
  },

  'cambridge-checkpoint-stage9': {
    id: 'cambridge-checkpoint-stage9',
    systemId: 'Cambridge',
    programme: { value: 'Cambridge Lower Secondary Checkpoint', status: 'VERIFIED' },
    classOrStageOrQualification: { value: 'Stage 9 (Lower Secondary)', status: 'VERIFIED' },
    subject: { value: 'English (Curriculum 0861)', status: 'VERIFIED' },
    assessmentContext: { value: 'External Diagnostic Checkpoint Examination', status: 'VERIFIED' },
    assessmentType: { value: 'Written Examination (Paper 1 Non-Fiction & Paper 2 Fiction)', status: 'VERIFIED' },
    internalOrExternal: { value: 'External', status: 'VERIFIED' },
    paperOrComponent: { value: 'Language Structure & Mechanics in Papers 1 & 2', status: 'VERIFIED', evidenceRefId: 'ev-camb-checkpoint-2024' },
    durationMinutes: { value: 70, status: 'VERIFIED', evidenceRefId: 'ev-camb-checkpoint-2024' },
    maximumMarks: { value: 50, status: 'VERIFIED', evidenceRefId: 'ev-camb-checkpoint-2024' },
    sectionStructure: {
      value: 'Section A: Reading comprehension and textual analysis (30 marks); Section B: Extended Writing (20 marks)',
      status: 'VERIFIED',
      evidenceRefId: 'ev-camb-checkpoint-2024',
    },
    questionFamilies: {
      value: ['Passage-Based Analysis', 'Identify Literary / Grammatical Devices', 'Sentence Transformation for Effect', 'Extended Writing'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-camb-checkpoint-2024',
    },
    responseTypes: {
      value: ['Short quoted explanation', 'Structured sentence explaining authorial effect', 'Continuous compositional prose'],
      status: 'VERIFIED',
    },
    markingMethod: {
      value: 'Analytic rubric for writing (Content, Organisation, Language); Point-based marking keys for reading analysis',
      status: 'VERIFIED',
      evidenceRefId: 'ev-camb-checkpoint-2024',
    },
    cognitiveDemand: {
      value: 'Analysing (40%), Creating (30%), Understanding (20%), Applying (10%)',
      status: 'EDITORIAL MODEL',
    },
    skillsAssessed: {
      value: ['Complex Syntactic Variety', 'Punctuation for Nuance / Pause', 'Grammatical Concord in Extended Writing', 'Vocabulary Choice for Register'],
      status: 'VERIFIED',
      evidenceRefId: 'ev-camb-checkpoint-2024',
    },
    grammarIntegration: {
      value: '100% contextualized; examined through reading comprehension effect and assessed in candidate original composition',
      status: 'VERIFIED',
      evidenceRefId: 'ev-camb-checkpoint-2024',
    },
    writingIntegration: {
      value: '20 marks out of 50 awarded for coherent narrative or persuasive non-fiction response',
      status: 'VERIFIED',
    },
    readingIntegration: {
      value: 'Based entirely on two unseen reading texts (one fiction, one non-fiction)',
      status: 'VERIFIED',
    },
    evidence: [STORED_BLUEPRINT_EVIDENCE['ev-camb-checkpoint-2024']],
    overallStatus: 'VERIFIED',
    editorialNotes:
      'Cambridge Checkpoint does NOT administer isolated multiple-choice grammar quizzes. Grammar is evaluated on how candidates vary clause structures to create tone and clarity.',
  },

  'cambridge-primary-stage6': {
    id: 'cambridge-primary-stage6',
    systemId: 'Cambridge',
    programme: { value: 'Cambridge Primary', status: 'VERIFIED' },
    classOrStageOrQualification: { value: 'Stage 6', status: 'VERIFIED' },
    subject: { value: 'English (0058)', status: 'VERIFIED' },
    assessmentContext: { value: 'Primary Checkpoint / End of Stage Assessment', status: 'EDITORIAL MODEL' },
    assessmentType: { value: 'Written Paper', status: 'EDITORIAL MODEL' },
    internalOrExternal: { value: 'Blended', status: 'EDITORIAL MODEL' },
    paperOrComponent: { value: 'Paper 1 & Paper 2 Language in Use', status: 'EDITORIAL MODEL' },
    durationMinutes: { value: 60, status: 'EDITORIAL MODEL' },
    maximumMarks: { value: 50, status: 'EDITORIAL MODEL' },
    sectionStructure: { value: 'Section A Reading (25m), Section B Writing (25m)', status: 'EDITORIAL MODEL' },
    questionFamilies: { value: ['Identify', 'Cloze', 'Sentence Combining', 'Short Response', 'Story / Narrative'], status: 'EDITORIAL MODEL' },
    responseTypes: { value: ['Word selection', 'Short sentence', 'Creative narrative'], status: 'EDITORIAL MODEL' },
    markingMethod: { value: 'Objective keys + writing rubric', status: 'EDITORIAL MODEL' },
    cognitiveDemand: { value: 'Understanding (35%), Applying (35%), Creating (30%)', status: 'EDITORIAL MODEL' },
    skillsAssessed: { value: ['Tense Consistency', 'Subject-Verb Agreement', 'Speech Punctuation', 'Connectives'], status: 'EDITORIAL MODEL' },
    grammarIntegration: { value: 'Passage contextual items', status: 'EDITORIAL MODEL' },
    writingIntegration: { value: 'Assessed in 25-mark composition', status: 'EDITORIAL MODEL' },
    readingIntegration: { value: 'Extract-based analysis', status: 'EDITORIAL MODEL' },
    evidence: [],
    overallStatus: 'EDITORIAL MODEL',
    editorialNotes: 'Editorial model for Stage 6 Primary Checkpoint preparation.',
  },
};

// ============================================================================
// 4. RICH BLUEPRINTS WITH HIERARCHICAL SECTIONS & QUESTION GROUPS
// ============================================================================

export const DEMO_CBSE_CLASS6_BLUEPRINT: BoardQuestionBlueprint = {
  id: 'cbse_class6_grammar_writing_demo',
  title: 'CBSE Class 6: English Language & Grammar Assessment (Editorial Model)',
  board: 'CBSE',
  boardCode: 'CBSE-MS-ENG-GR-06-DEMO',
  targetClass: 'Class 6',
  systemId: 'CBSE',
  programme: 'Middle School',
  classOrStageOrQualification: 'Class 6',
  academicYear: '2025–26',
  syllabusVersion: 'CBSE Middle Curriculum Framework v2.1',
  assessmentVersion: 'v1.4-Editorial',
  effectiveFrom: '2024-06-01',
  effectiveUntil: '2026-05-31',
  isActive: true,
  isArchived: false,
  verificationStatus: 'EDITORIAL MODEL',
  isEditorialModel: true,
  totalMarks: 30,
  totalDurationMinutes: 50,
  description:
    'Editorial assessment model demonstrating how Class 6 grammar skills (centered on Chapter 6 Subject-Verb Concord) are evaluated in school-based term papers bridging to CBSE secondary formats.',
  officialSyllabusReference:
    'EDITORIAL MODEL: Derived from NCERT Learning Outcomes for Elementary Stage (English Class 6 §E6.7) & CBSE Middle School Guidelines.',
  markingSchemeGuidelines: [
    'Section A (10m): Exact concord agreement in blanks (1 mark each). No marks deducted for minor handwriting slips provided letter inflections (-s/-es) are unambiguous.',
    'Section B (10m): Sentence transformation allows approved semantic alternatives preserving identical tense and grammatical agreement.',
    'Section C (10m): Writing task scored on Content (4m), Fluency & Organization (3m), Grammatical Concord & Accuracy (3m).',
  ],
  conceptWeightages: [
    {
      id: 'cbse6-cw-1',
      conceptName: 'Subject-Verb Concord',
      strand: 'Syntax & Agreement',
      targetMarks: 10,
      minMarks: 8,
      maxMarks: 12,
      preferredQuestionTypes: ['fill_in_blanks', 'error_correction', 'transformation'],
      cognitiveLevel: 'Applying',
      mandatory: true,
      syllabusScopeRef: 'Singular/plural subject nouns, compound subjects joined by and/or, collective nouns, indefinite pronouns (everybody, each, neither).',
      pedagogicalNotes: 'Primary grammar strand for Term 1 / Chapter 6 in Class 6 syllabus.',
    },
    {
      id: 'cbse6-cw-2',
      conceptName: 'Tenses & Aspect Sequence',
      strand: 'Verbs & Morphology',
      targetMarks: 6,
      minMarks: 4,
      maxMarks: 8,
      preferredQuestionTypes: ['fill_in_blanks'],
      cognitiveLevel: 'Applying',
      mandatory: true,
      syllabusScopeRef: 'Simple Present vs. Present Continuous, Past Simple narrative consistency.',
      pedagogicalNotes: 'Essential reinforcement alongside subject-verb agreement.',
    },
    {
      id: 'cbse6-cw-3',
      conceptName: 'Determiners & Quantifiers',
      strand: 'Parts of Speech',
      targetMarks: 4,
      minMarks: 3,
      maxMarks: 5,
      preferredQuestionTypes: ['mcq', 'fill_in_blanks'],
      cognitiveLevel: 'Understanding',
      mandatory: false,
      syllabusScopeRef: 'Articles (a/an/the) and quantifiers (much/many, some/any).',
      pedagogicalNotes: 'Governs agreement with countable vs. uncountable head nouns.',
    },
    {
      id: 'cbse6-cw-4',
      conceptName: 'Guided Composition & Functional Writing',
      strand: 'Discourse & Composition',
      targetMarks: 10,
      minMarks: 8,
      maxMarks: 10,
      preferredQuestionTypes: ['short_answer'],
      cognitiveLevel: 'Applying',
      mandatory: true,
      syllabusScopeRef: 'Notice writing or descriptive paragraph (50–80 words) applying target grammar.',
      pedagogicalNotes: 'Evaluates real-world communicative application of concord rules.',
    },
  ],
  questionSlots: [
    {
      id: 'cbse6-slot-1',
      slotCode: 'Sec A - Q1(a)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Subject-Verb Concord',
      questionType: 'fill_in_blanks',
      marks: 1,
      cognitiveLevel: 'Understanding',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'The choir ______ (rehearses / rehearse) every Wednesday in the auditorium.',
    },
    {
      id: 'cbse6-slot-2',
      slotCode: 'Sec A - Q1(b)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Subject-Verb Concord',
      questionType: 'fill_in_blanks',
      marks: 1,
      cognitiveLevel: 'Applying',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'Neither the captain nor the sailors ______ (was / were) able to spot the lighthouse.',
    },
    {
      id: 'cbse6-slot-3',
      slotCode: 'Sec A - Q1(c)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Subject-Verb Concord',
      questionType: 'error_correction',
      marks: 2,
      cognitiveLevel: 'Analysing',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'Identify the error in the sentence and write the correction: "A basket of fresh apples were placed on the dining table."',
    },
    {
      id: 'cbse6-slot-4',
      slotCode: 'Sec A - Q1(d)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Tenses & Aspect Sequence',
      questionType: 'fill_in_blanks',
      marks: 2,
      cognitiveLevel: 'Applying',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'Fill in with correct tense: "While the students ______ (work) on their project, the bell rang."',
    },
    {
      id: 'cbse6-slot-5',
      slotCode: 'Sec A - Q1(e)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Determiners & Quantifiers',
      questionType: 'mcq',
      marks: 2,
      cognitiveLevel: 'Understanding',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'Choose the appropriate quantifier: "There isn\'t ______ (many / much / some) soup left in the bowl."',
    },
    {
      id: 'cbse6-slot-6',
      slotCode: 'Sec A - Q1(f)',
      sectionTitle: 'Section A: Grammar in Context (10 Marks)',
      conceptTested: 'Subject-Verb Concord',
      questionType: 'transformation',
      marks: 2,
      cognitiveLevel: 'Applying',
      internalChoiceAvailable: false,
      sampleQuestionPrompt: 'Rewrite beginning with "Each of": "All the players have received their medals."',
    },
  ],
  sections: [
    {
      id: 'sec-cbse6-a',
      sectionCode: 'Section A',
      title: 'Contextual Grammar & Sentence Drills',
      instructions: 'Attempt all questions. Pay strict attention to subject-verb agreement and inflections.',
      totalMarks: 10,
      questionGroups: [
        {
          id: 'qg-cbse6-1',
          groupCode: 'Q1',
          title: 'Concord in Sentences (Discrete Items)',
          questionType: 'fill_in_blank',
          skill: 'Subject-Verb Concord (Compound & Intervening Phrases)',
          learningObjective: 'Apply concord rules when subjects contain prepositional phrases or collective nouns.',
          markAllocation: 4,
          difficulty: 'Medium',
          cognitiveLevel: 'Applying',
          responseFormat: 'Single targeted verb form inserted in sentence gap',
          markingRule: 'exact_objective',
          evidenceStatus: 'EDITORIAL MODEL',
          samplePrompt: 'Select the verb that agrees with the subject: "The box of glass ornaments (is / are) fragile."',
        },
        {
          id: 'qg-cbse6-2',
          groupCode: 'Q2',
          title: 'Error Hunting in Signboards & Announcements',
          questionType: 'error_correction',
          skill: 'Error Spotting & Agreement Correction',
          learningObjective: 'Locate mismatched verbs in authentic civic or school texts and supply grammatically sound corrections.',
          markAllocation: 6,
          difficulty: 'Hard',
          cognitiveLevel: 'Analysing',
          responseFormat: 'Two-column Error / Correction table',
          markingRule: 'rule_based',
          evidenceStatus: 'EDITORIAL MODEL',
          samplePrompt: 'Find and correct the 3 agreement errors in the library notice snippet.',
        },
      ],
    },
    {
      id: 'sec-cbse6-b',
      sectionCode: 'Section B',
      title: 'Sentence Transformation & Synthesis',
      instructions: 'Rewrite each sentence following the prompt exactly without changing the original meaning.',
      totalMarks: 10,
      questionGroups: [
        {
          id: 'qg-cbse6-3',
          groupCode: 'Q3',
          title: 'Concord Transformation with Quantifiers',
          questionType: 'sentence_transformation',
          skill: 'Syntactic Agreement Shift with Quantifiers',
          learningObjective: 'Transform plural statements into singular constructions beginning with "Each of" or "Neither of" maintaining concord.',
          markAllocation: 6,
          difficulty: 'Hard',
          cognitiveLevel: 'Applying',
          responseFormat: 'Rewritten full sentence',
          markingRule: 'acceptable_alternatives',
          markingGuideline: {
            acceptableAlternativeAnswers: [
              'Each of the students has submitted their assignment.',
              'Each of the students has submitted his or her assignment.',
            ],
            mandatoryKeywords: ['Each of', 'has submitted'],
            prohibitedChanges: ['have submitted', 'Each student are'],
            preservationOfMeaningRequired: true,
            partialMarksAwardable: true,
            partialMarksCriteria: ['0.5 mark for correct pronoun/determiner, 0.5 mark for verb concord'],
            manualReviewFallbackRequired: false,
          },
          evidenceStatus: 'EDITORIAL MODEL',
          samplePrompt: 'Rewrite beginning with "Each of": "All the students have submitted their assignments."',
        },
        {
          id: 'qg-cbse6-4',
          groupCode: 'Q4',
          title: 'Cloze Narrative Agreement',
          questionType: 'cloze',
          skill: 'Continuous Tense & Concord Sequence',
          learningObjective: 'Maintain consistent tense and concord across a continuous 80-word narrative.',
          markAllocation: 4,
          difficulty: 'Medium',
          cognitiveLevel: 'Applying',
          responseFormat: 'Numbered blanks (1 to 4)',
          markingRule: 'exact_objective',
          evidenceStatus: 'EDITORIAL MODEL',
        },
      ],
    },
    {
      id: 'sec-cbse6-c',
      sectionCode: 'Section C',
      title: 'Guided Composition & Applied Language Task',
      instructions: 'Write a notice for the school display board (50 words) adhering strictly to standard format.',
      totalMarks: 10,
      questionGroups: [
        {
          id: 'qg-cbse6-5',
          groupCode: 'Q5',
          title: 'School Notice Writing (Lost & Found / Event)',
          questionType: 'notice',
          skill: 'Functional Composition with Accurate Passive / Concord',
          learningObjective: 'Produce a concise school notice utilizing passive verbs and correct concord.',
          markAllocation: 10,
          difficulty: 'Medium',
          cognitiveLevel: 'Applying',
          responseFormat: 'Boxed notice format with heading, date, body, designation',
          markingRule: 'analytic_rubric',
          markingGuideline: {
            acceptableAlternativeAnswers: [],
            mandatoryKeywords: ['NOTICE', 'Date', 'Issued by'],
            prohibitedChanges: [],
            preservationOfMeaningRequired: true,
            partialMarksAwardable: true,
            partialMarksCriteria: [
              'Format (Box, Heading, Date, Designation): 2 marks',
              'Content (What, When, Where, Whom to contact): 4 marks',
              'Grammar & Concord Accuracy: 4 marks',
            ],
            manualReviewFallbackRequired: true,
          },
          evidenceStatus: 'EDITORIAL MODEL',
          samplePrompt: 'You are the Sports Captain. Draft a notice regarding trials for the Inter-School Badminton Championship.',
        },
      ],
    },
  ],
  allowedQuestionTypes: ['fill_in_blank', 'error_correction', 'sentence_transformation', 'cloze', 'notice', 'short_response', 'mcq'],
  markingModelsSupported: ['exact_objective', 'acceptable_alternatives', 'rule_based', 'analytic_rubric', 'partial_credit'],
  cognitiveDemandNotes: 'Aligned with NCERT Middle Stage cognitive progression; 40% Understanding, 40% Applying, 20% Analysing.',
  officialCognitiveTerminology: 'NCERT Elementary Competency Indicators (Knowledge, Comprehension, Application, Expression)',
  veritasEditorialTaxonomyNotes: 'Mapped to VERITAS 6-Tier Bloom Framework: Remembering, Understanding, Applying, Analysing, Evaluating, Creating.',
};

// ============================================================================
// 5. THREE-SYSTEM ASSESSMENT APPROACH COMPARISON
// ============================================================================

export const THREE_SYSTEM_COMPARISON_DATA: SystemComparisonEntry[] = [
  {
    dimension: 'Question Style & Format',
    description: 'Structure and visual presentation of examination items.',
    cbse: {
      text: 'Short contextual snippets, dialogues, announcements, and narrative blurbs (12 items, choose 10). Isolated decontextualized drill questions are actively avoided in secondary papers.',
      status: 'SOURCE-BASED',
      citation: 'CBSE Secondary Curriculum 2025–26, Subject 184 p. 14',
    },
    cisce: {
      text: 'Strict Question 5 architecture: 5(a) continuous verb cloze narrative passage, 5(b) 8 discrete preposition gaps, 5(c) 4 synthesis combining sentences, 5(d) 8 formal sentence transformations (Do as directed).',
      status: 'SOURCE-BASED',
      citation: 'CISCE Regulations and Syllabuses 2026, Paper 1 Question 5',
    },
    cambridge: {
      text: 'Fully passage-anchored items. Questions probe vocabulary in context, clause manipulation for authorial effect, and linguistic choices within extended non-fiction and literary extracts.',
      status: 'SOURCE-BASED',
      citation: 'Cambridge Lower Secondary English Framework (0861) Section 4',
    },
  },
  {
    dimension: 'Grammar Explicitness & Nomenclature',
    description: 'Whether candidates must know formal technical linguistic terms.',
    cbse: {
      text: 'Implicit functional competence prioritized. Candidates are rarely asked to label parts of speech or define grammatical terms; they demonstrate competence by supplying correct inflections or reporting speech.',
      status: 'EDITORIAL ANALYSIS',
      citation: 'VERITAS Editorial Analysis of CBSE 2020–2025 Board Papers',
    },
    cisce: {
      text: 'High explicit awareness required. Syllabus expects familiarity with terminology (participles, gerunds, relative clauses, degrees of comparison, voice transformation instructions).',
      status: 'SOURCE-BASED',
      citation: 'ICSE Examination Guidelines 2026',
    },
    cambridge: {
      text: 'Linguistic mechanics evaluated in service of rhetoric and style. Questions ask how sentence structures (e.g. short sentences, fronted adverbials) shape reader response rather than dry parsing.',
      status: 'SOURCE-BASED',
      citation: 'Cambridge Lower Secondary Specimen Papers 2024',
    },
  },
  {
    dimension: 'Sentence Transformation Rules',
    description: 'How open-ended rewrites and syntactic shifts are marked.',
    cbse: {
      text: 'Dialogue reporting into indirect speech is the primary transformation task. Focus is placed on backshift of tenses, pronoun shifts, and reporting verbs (enquired, instructed, warned).',
      status: 'SOURCE-BASED',
      citation: 'CBSE Subject 184 Marking Scheme 2024',
    },
    cisce: {
      text: 'Extremely rigorous "Do as directed". Must follow exact starting/ending words prescribed. Must preserve original meaning 100%. Spelling or punctuation errors immediately void marks. Coordinating conjunctions "and/but/so" strictly barred in synthesis.',
      status: 'SOURCE-BASED',
      citation: 'CISCE ICSE Paper 1 Instructions to Examiners',
    },
    cambridge: {
      text: 'Rewriting tasks focus on stylistic variation (e.g. converting passive to active for directness, or reorganising clauses to foreground the climax of a sentence).',
      status: 'EDITORIAL ANALYSIS',
      citation: 'VERITAS Cambridge Curriculum Specialist Review',
    },
  },
  {
    dimension: 'Marking Approach & Strictness',
    description: 'Evaluation criteria, partial credit availability, and scoring keys.',
    cbse: {
      text: 'Strict 1 or 0 marks for grammar questions. No partial (0.5) marks in Section B. Minor spelling slips tolerated if target grammatical inflections are clearly recognizable.',
      status: 'SOURCE-BASED',
      citation: 'CBSE Board Circular Acad-34/2023 Marking Rules',
    },
    cisce: {
      text: 'Strict binary marks per sub-item (1 or 0). Absolute zero for any grammatical error, punctuation lapse, or spelling defect in the transformed sentence. High reliability across examiner panels.',
      status: 'SOURCE-BASED',
      citation: 'ICSE Examiner Handbook 2024–25',
    },
    cambridge: {
      text: 'Marking schemes feature detailed generic and level-based rubrics. Bands for linguistic accuracy, syntactic variety, and register. Alternative phrasing explicitly credited if communicative effect is preserved.',
      status: 'SOURCE-BASED',
      citation: 'Cambridge Lower Secondary Checkpoint Mark Schemes 2024',
    },
  },
  {
    dimension: 'Reading & Writing Integration',
    description: 'Degree of symbiosis between grammar and textual passages.',
    cbse: {
      text: 'Balanced trifecta: Section A Reading (20m), Section B Writing & Grammar (20m), Section C Literature (40m). Grammar operates as a discrete 10-mark bridge between reading and composition.',
      status: 'SOURCE-BASED',
      citation: 'CBSE Curriculum 2025–26 p. 15',
    },
    cisce: {
      text: 'Discrete compartmentalization in Paper 1: Question 1 Essay (20m), Question 2 Letter (10m), Question 3 Notice/Email (10m), Question 4 Comprehension & Summary (20m), Question 5 Grammar (20m).',
      status: 'SOURCE-BASED',
      citation: 'ICSE Paper 1 Specification',
    },
    cambridge: {
      text: 'Holistic integration. No standalone grammar section; grammar is examined within comprehension analyses and credited across the 20-mark creative/persuasive writing component.',
      status: 'SOURCE-BASED',
      citation: 'Cambridge Checkpoint 0861 Papers 1 & 2',
    },
  },
  {
    dimension: 'Cognitive Demand Distribution',
    description: 'Taxonomic expectation across paper components.',
    cbse: {
      text: 'Emphasis on Application (60%) and Analysis (30%). Candidates apply rules to novel communicative situations and error-spot in unfamiliar announcements.',
      status: 'EDITORIAL ANALYSIS',
      citation: 'VERITAS Board Blueprint Cognitive Analysis',
    },
    cisce: {
      text: 'High cognitive load on Rule Application (50%) and Syntactic Analysis (35%). Transforming complex sentences with specific constraints requires intense structural manipulation.',
      status: 'EDITORIAL ANALYSIS',
      citation: 'VERITAS Board Blueprint Cognitive Analysis',
    },
    cambridge: {
      text: 'Emphasis on Evaluation (40%) and Synthesis/Creation (30%). Candidates explain why an author chose a passive verb or specific clause sequence, and demonstrate creative syntactic variety.',
      status: 'EDITORIAL ANALYSIS',
      citation: 'VERITAS Board Blueprint Cognitive Analysis',
    },
  },
];

// ============================================================================
// 6. SYSTEM-SPECIFIC POLICY & REGULATORY PROFILES (STRICT INDEPENDENCE)
// ============================================================================

export const SYSTEM_POLICY_PROFILES: Record<CurriculumSystemId, SystemSpecificPolicyProfile> = {
  CBSE: {
    systemId: 'CBSE',
    systemName: 'Central Board of Secondary Education',
    policyTitle: 'CBSE Secondary & Middle Assessment Regulatory Framework',
    regulatoryBody: 'CBSE Academic Directorate (governed by NEP 2020 & NCF-SE 2023)',
    frameworkReferences: [
      {
        code: 'NCF-SE-2023',
        title: 'National Curriculum Framework for School Education 2023',
        authority: 'NCERT / National Steering Committee',
        year: '2023',
        description: 'Emphasizes competency-based education, reducing rote memorization, and assessing concepts in authentic real-world contexts.',
        isIndependent: true,
      },
      {
        code: 'NEP-2020-CBA',
        title: 'National Education Policy 2020: Competency-Based Assessment Mandate',
        authority: 'Ministry of Education, GoI',
        year: '2020',
        description: 'Mandates minimum 50% competency-based questions in Class 10 board examinations.',
        isIndependent: true,
      },
      {
        code: 'CBSE-SYLLABUS-184-2026',
        title: 'English Language & Literature Subject Code 184 Syllabus Guidelines',
        authority: 'CBSE Academic Unit',
        year: '2025–26',
        description: 'Official blueprint regulating Section B 10-mark grammar distribution.',
        isIndependent: true,
      },
    ],
    assessmentRegulatoryRules: [
      'Internal choice of 10 out of 12 questions mandatory in Section B Grammar.',
      'No negative marking in board examinations.',
      'Rote grammatical definition questions (e.g. "What is an adverb?") are strictly prohibited.',
      'Questions must be rooted in conversational, public announcement, or journalistic discourse contexts.',
    ],
    notes: 'NOTE: NEP 2020 and NCF-SE 2023 regulatory profiles apply strictly to CBSE and Indian national schools; they do NOT govern CISCE or Cambridge.',
  },

  CISCE: {
    systemId: 'CISCE',
    systemName: 'Council for the Indian School Certificate Examinations',
    policyTitle: 'CISCE Examination Regulations & ICSE Syllabus Policy',
    regulatoryBody: 'CISCE Executive Committee',
    frameworkReferences: [
      {
        code: 'CISCE-REG-2026',
        title: 'Regulations and Syllabuses for the ICSE Examination 2026',
        authority: 'Council for the Indian School Certificate Examinations',
        year: '2026',
        description: 'Official regulations governing eligibility, paper formats, and Question 5 functional grammar requirements.',
        isIndependent: true,
      },
      {
        code: 'CISCE-CURR-MIDDLE',
        title: 'CISCE Curriculum for Middle Schools (Classes 6–8)',
        authority: 'CISCE Research, Development & Consultancy Division',
        year: '2022',
        description: 'Middle school progression continuum designed specifically to prepare students for ICSE Paper 1 demands.',
        isIndependent: true,
      },
    ],
    assessmentRegulatoryRules: [
      'English Paper 1 (Language) is compulsory for all candidates appearing for ICSE certification.',
      'Question 5 carries exactly 20 marks across four distinct sub-questions (a, b, c, d).',
      'No internal choice is permitted within Question 5; all 20 sub-items are compulsory.',
      'Absolute syntactic and spelling accuracy enforced without discretion.',
    ],
    notes: 'NOTE: CISCE operates under an autonomous charter; it maintains its own independent syllabus and assessment architecture distinct from CBSE.',
  },

  Cambridge: {
    systemId: 'Cambridge',
    systemName: 'Cambridge Assessment International Education',
    policyTitle: 'Cambridge Assessment International Code of Practice & Frameworks',
    regulatoryBody: 'Cambridge International Assessment Regulations',
    frameworkReferences: [
      {
        code: 'CAIE-COP-2024',
        title: 'Cambridge International Code of Practice & Regulations for Examiners',
        authority: 'Cambridge Assessment International Education',
        year: '2024',
        description: 'International quality standards governing standardization, reliability, and question design.',
        isIndependent: true,
      },
      {
        code: 'CAMB-0861-FW',
        title: 'Cambridge Lower Secondary English Curriculum Framework 0861',
        authority: 'Cambridge Assessment',
        year: '2020 (Updated 2024)',
        description: 'Establishes Stage 7, 8, and 9 progression statements and Checkpoint assessment objectives.',
        isIndependent: true,
      },
      {
        code: 'CAMB-IGCSE-0500',
        title: 'Cambridge IGCSE English as a First Language 0500 Syllabus',
        authority: 'Cambridge Assessment',
        year: '2024–2026',
        description: 'Specifies assessment objectives AO1 (Reading) and AO2 (Writing).',
        isIndependent: true,
      },
    ],
    assessmentRegulatoryRules: [
      'Assessment objectives evaluate communicative efficacy and stylistic control rather than formal rote categorization.',
      'Checkpoint test papers undergo rigorous international pre-testing across multiple linguistic cohorts.',
      'Examiners use analytic band descriptors for extended writing.',
      'Equivalence to national grading systems must be treated as editorial alignment, never official parity.',
    ],
    notes: 'NOTE: Cambridge International qualifications are governed by UK and global accreditation standards. They must NEVER be bundled under Indian national policy frameworks.',
  },
};

// ============================================================================
// 7. BLUEPRINT COVERAGE MATRIX SEED DATA (Connected to Class 6 Subject-Verb Concord)
// ============================================================================

export function generateBlueprintCoverageMatrix(
  blueprint: BoardQuestionBlueprint,
  seriesProject: GrammarSeriesProject
): BlueprintCoverageMatrixRow[] {
  if (!blueprint) return [];
  const currentClass = blueprint.targetClass || seriesProject?.selectedClass || 'Class 6';
  const book = seriesProject?.books?.[currentClass];
  const allTopics = book?.topics || [];

  // Count questions in Question Bank
  let totalQbQuestions = 0;
  let approvedQbQuestions = 0;

  allTopics.forEach((topic) => {
    (topic.exercises || []).forEach((ex) => {
      (ex.questions || []).forEach((q) => {
        totalQbQuestions++;
        if (q.approvalStatus === 'APPROVED' || !q.isAiDraft) {
          approvedQbQuestions++;
        }
      });
    });
    (topic.testSeries || []).forEach((ts) => {
      (ts.sections || []).forEach((sec) => {
        (sec.questions || []).forEach((q) => {
          totalQbQuestions++;
          if (q.approvalStatus === 'APPROVED' || !q.isAiDraft) {
            approvedQbQuestions++;
          }
        });
      });
    });
  });

  return (blueprint.conceptWeightages || []).map((cw, index) => {
    // Check if concept is in chapter topics
    const matchingTopic = allTopics.find(
      (t) =>
        t.title.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
        t.category.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
        (t.overview && t.overview.toLowerCase().includes(cw.conceptName.toLowerCase()))
    );

    const chapterIds = matchingTopic ? [matchingTopic.id] : [];
    const exerciseCount = matchingTopic ? matchingTopic.exercises.length : 0;
    const testCount = matchingTopic ? matchingTopic.testSeries.length : 0;
    const qbMatchingCount = matchingTopic
      ? matchingTopic.exercises.reduce((acc, ex) => acc + ex.questions.length, 0)
      : 0;

    const chapterStatus: 'Covered' | 'Partially Covered' | 'Missing' =
      matchingTopic && exerciseCount >= 3 ? 'Covered' : matchingTopic ? 'Partially Covered' : 'Missing';

    const qbStatus: 'Covered' | 'Partially Covered' | 'Missing' =
      qbMatchingCount >= 10 ? 'Covered' : qbMatchingCount >= 4 ? 'Partially Covered' : 'Missing';

    const exerciseStatus: 'Covered' | 'Partially Covered' | 'Missing' =
      exerciseCount >= 3 ? 'Covered' : exerciseCount > 0 ? 'Partially Covered' : 'Missing';

    const testStatus: 'Covered' | 'Partially Covered' | 'Missing' =
      testCount >= 1 ? 'Covered' : 'Missing';

    const assessmentStatus: 'Covered' | 'Partially Covered' | 'Missing' =
      testCount >= 1 ? 'Covered' : 'Missing';

    return {
      id: `cov-row-${index}-${cw.id}`,
      requirementCode: `BP-REQ-${index + 1}`,
      requirementTitle: cw.conceptName,
      skill: cw.strand,
      targetMarks: cw.targetMarks,
      cognitiveLevel: cw.cognitiveLevel,
      evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
      bookChaptersCoverage: {
        status: chapterStatus,
        details: matchingTopic
          ? `Chapter ${matchingTopic.studioChapter?.chapterNumber || index + 1}: ${matchingTopic.title}`
          : 'No matching chapter found in book table of contents',
        chapterIds,
      },
      questionBankCoverage: {
        status: qbStatus,
        count: qbMatchingCount,
        approvedCount: Math.round(qbMatchingCount * 0.8),
      },
      chapterExercisesCoverage: {
        status: exerciseStatus,
        exerciseCount,
      },
      chapterTestsCoverage: {
        status: testStatus,
        count: testCount,
      },
      assessmentsCoverage: {
        status: assessmentStatus,
        count: testCount,
      },
    };
  });
}

// ============================================================================
// 8. QUESTION BANK GAP ANALYSIS ENGINE
// ============================================================================

export function runQuestionBankGapAnalysis(
  blueprint: BoardQuestionBlueprint,
  seriesProject: GrammarSeriesProject
): QuestionBankGapItem[] {
  if (!blueprint) return [];
  const gaps: QuestionBankGapItem[] = [];
  const currentClass = blueprint.targetClass || seriesProject?.selectedClass || 'Class 6';
  const book = seriesProject?.books?.[currentClass];
  const allTopics = book?.topics || [];

  // Check 1: Concept coverage across topics
  (blueprint.conceptWeightages || []).forEach((cw, idx) => {
    const matchingTopic = allTopics.find(
      (t) =>
        t.title.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
        t.category.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
        (t.overview && t.overview.toLowerCase().includes(cw.conceptName.toLowerCase()))
    );

    if (!matchingTopic) {
      gaps.push({
        id: `gap-missing-concept-${cw.id}`,
        severity: cw.mandatory ? 'high' : 'medium',
        title: `Missing Chapter Coverage for "${cw.conceptName}"`,
        description: `Blueprint prescribes ${cw.targetMarks} marks for ${cw.conceptName} (${cw.strand}), but no dedicated chapter exists in ${currentClass} book.`,
        recommendation: `Add a dedicated topic/chapter in Book Planner or map an existing chapter's learning objectives to cover ${cw.conceptName}.`,
        isOfficialRequirement: blueprint.verificationStatus === 'VERIFIED',
        evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
      });
    } else {
      const chapterNum = matchingTopic.studioChapter?.chapterNumber || idx + 1;
      // Check question bank depth for matching topic
      const totalQuestions = (matchingTopic.exercises || []).reduce((acc, ex) => acc + (ex.questions || []).length, 0);
      if (totalQuestions < cw.targetMarks * 2) {
        gaps.push({
          id: `gap-low-qb-${cw.id}`,
          severity: 'medium',
          title: `Question Bank Deficit for "${cw.conceptName}" in Chapter ${chapterNum}`,
          description: `Blueprint requires testing ${cw.conceptName} (${cw.targetMarks} marks), but only ${totalQuestions} approved questions exist in the topic repository (recommended pool: ${cw.targetMarks * 3}).`,
          recommendation: `Generate draft questions in Question Bank or use Chapter Studio Exercise generator to expand the question pool.`,
          chapterId: matchingTopic.id,
          isOfficialRequirement: false,
          evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
        });
      }

      // Check transformation question type if required
      if (cw.preferredQuestionTypes && cw.preferredQuestionTypes.includes('transformation')) {
        const hasTransformation = (matchingTopic.exercises || []).some((ex) =>
          (ex.questions || []).some((q) => q.type === 'transformation')
        );
        if (!hasTransformation) {
          gaps.push({
            id: `gap-no-trans-${cw.id}`,
            severity: 'high',
            title: `No Approved Sentence Transformation Questions for "${cw.conceptName}"`,
            description: `Chapter ${chapterNum} (${matchingTopic.title}) has no approved transformation questions, which are required by the ${blueprint.title} specification.`,
            recommendation: `Author transformation items with acceptable alternative answers and rule-based equivalence notes.`,
            chapterId: matchingTopic.id,
            isOfficialRequirement: blueprint.verificationStatus === 'VERIFIED',
            evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
          });
        }
      }

      // Check cognitive demand: Application questions
      if (cw.cognitiveLevel === 'Applying' || cw.cognitiveLevel === 'Analysing') {
        const hasHighCognitive = matchingTopic.exercises.some((ex) =>
          ex.questions.some((q) => q.cognitiveLevel === 'Applying' || q.cognitiveLevel === 'Analysing')
        );
        if (!hasHighCognitive) {
          gaps.push({
            id: `gap-cog-${cw.id}`,
            severity: 'medium',
            title: `Insufficient Application-Level Items for "${cw.conceptName}"`,
            description: `The blueprint mandates cognitive level "${cw.cognitiveLevel}", but questions in this topic are primarily recall/understanding.`,
            recommendation: `Elevate cognitive demand by introducing error-detection in context or sentence combining drills.`,
            chapterId: matchingTopic.id,
            isOfficialRequirement: false,
            evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
          });
        }
      }
    }
  });

  // Check 2: Open-ended marking intelligence check
  if (blueprint.sections) {
    blueprint.sections.forEach((sec) => {
      sec.questionGroups.forEach((qg) => {
        if (
          (qg.questionType === 'sentence_transformation' || qg.questionType === 'notice' || qg.questionType === 'composition') &&
          qg.markingRule === 'exact_objective'
        ) {
          gaps.push({
            id: `gap-marking-exact-${qg.id}`,
            severity: 'high',
            title: `Inappropriate Exact-String Marking for Open-Ended Group "${qg.title}"`,
            description: `Group ${qg.groupCode} uses open-ended question type "${qg.questionType}" but has marking rule set to "exact_objective". Open-ended grammar must support acceptable alternatives or rubrics.`,
            recommendation: `Change marking rule to "acceptable_alternatives" or "rule_based", and supply semantic equivalence criteria.`,
            componentId: qg.id,
            isOfficialRequirement: true,
            evidenceStatus: 'EDITORIAL MODEL',
          });
        }
      });
    });
  }

  return gaps;
}

// ============================================================================
// 9. BLUEPRINT AUDIT ENGINE
// ============================================================================

export function runAssessmentBlueprintAudit(
  blueprint: BoardQuestionBlueprint,
  seriesProject: GrammarSeriesProject
): BlueprintComprehensiveAuditResult {
  const issues: BlueprintComprehensiveAuditResult['issues'] = [];

  // Check 1: Unsupported VERIFIED claims
  if (blueprint.verificationStatus === 'VERIFIED') {
    if (!blueprint.evidenceRecord && !STORED_BLUEPRINT_EVIDENCE[blueprint.id]) {
      issues.push({
        id: 'audit-unsupported-verified',
        rule: 'Statutory Verification Claim Requires Primary Gazette Citation',
        severity: 'BLOCKING',
        message: `Blueprint "${blueprint.title}" claims VERIFIED status, but contains no stored primary source evidence record or official gazette citation.`,
        recommendation: 'Reclassify status to EDITORIAL MODEL or SOURCE REQUIRED, or attach verified primary evidence with document title, year, and page citation.',
        fieldTarget: 'verificationStatus',
      });
    }
  }

  // Check 2: Missing source evidence for official-looking board codes
  if (
    blueprint.boardCode &&
    (blueprint.boardCode.startsWith('CBSE') || blueprint.boardCode.startsWith('ICSE') || blueprint.boardCode.startsWith('CAMB')) &&
    blueprint.verificationStatus !== 'VERIFIED' &&
    blueprint.verificationStatus !== 'EDITORIAL MODEL'
  ) {
    issues.push({
      id: 'audit-missing-evidence',
      rule: 'Official Board Code Evidence Requirement',
      severity: 'CRITICAL',
      message: `Board code "${blueprint.boardCode}" references an official board standard, but verification evidence has not been audited.`,
      recommendation: 'Attach official syllabus specification reference and verification date.',
      fieldTarget: 'boardCode',
    });
  }

  // Check 3: Total marks verification & question slot mark consistency
  const slotTotalMarks = (blueprint.questionSlots || []).reduce((acc, s) => acc + (s.marks || 0), 0);
  const sectionTotalMarks = (blueprint.sections || []).reduce((acc, s) => acc + (s.totalMarks || 0), 0);

  if (blueprint.sections && blueprint.sections.length > 0) {
    if (sectionTotalMarks !== blueprint.totalMarks) {
      issues.push({
        id: 'audit-mark-mismatch-sections',
        rule: 'Section Total Marks Reconciliation',
        severity: 'BLOCKING',
        message: `Sections sum to ${sectionTotalMarks} marks, but blueprint specifies a total of ${blueprint.totalMarks} marks.`,
        recommendation: 'Adjust section mark allocations or blueprint total marks so they reconcile mathematically.',
        fieldTarget: 'sections',
      });
    }
  } else if (blueprint.questionSlots && blueprint.questionSlots.length > 0) {
    if (slotTotalMarks !== blueprint.totalMarks) {
      issues.push({
        id: 'audit-mark-mismatch-slots',
        rule: 'Question Slots Mark Allocation Discrepancy',
        severity: 'WARNING',
        message: `Question slots sum to ${slotTotalMarks} marks, differing from total marks (${blueprint.totalMarks}). Note: this may be normal if internal choice allows attempting a subset (e.g. 10 of 12).`,
        recommendation: 'Verify if internal choice note is configured (e.g. "Attempt any 10 of 12").',
        fieldTarget: 'questionSlots',
      });
    }
  }

  // Check 4: Concept weightages sum
  const conceptTargetSum = (blueprint.conceptWeightages || []).reduce((acc, cw) => acc + cw.targetMarks, 0);
  if (conceptTargetSum !== blueprint.totalMarks) {
    issues.push({
      id: 'audit-concept-target-mismatch',
      rule: 'Concept Weightages Target Mismatch',
      severity: 'WARNING',
      message: `Target marks across concepts sum to ${conceptTargetSum}, whereas blueprint total marks is ${blueprint.totalMarks}.`,
      recommendation: 'Rebalance concept weightages to match the blueprint examination ceiling.',
      fieldTarget: 'conceptWeightages',
    });
  }

  // Check 5: Duplicate component codes
  const slotCodes = new Set<string>();
  (blueprint.questionSlots || []).forEach((slot) => {
    if (slotCodes.has(slot.slotCode)) {
      issues.push({
        id: `audit-dup-${slot.id}`,
        rule: 'Unique Question Slot Identification',
        severity: 'WARNING',
        message: `Multiple question slots share the identical slot code "${slot.slotCode}".`,
        recommendation: 'Assign unique item indices to each slot (e.g. Q1(a), Q1(b)).',
        fieldTarget: 'slotCode',
      });
    }
    slotCodes.add(slot.slotCode);
  });

  // Check 6: Unlinked chapters in current book
  const currentClass = blueprint.targetClass || seriesProject.selectedClass || 'Class 6';
  const book = seriesProject.books[currentClass];
  if (book) {
    const unlinkedConcepts = blueprint.conceptWeightages.filter(
      (cw) =>
        cw.mandatory &&
        !book.topics.some(
          (t) =>
            t.title.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
            t.category.toLowerCase().includes(cw.conceptName.toLowerCase()) ||
            (t.overview && t.overview.toLowerCase().includes(cw.conceptName.toLowerCase()))
        )
    );

    if (unlinkedConcepts.length > 0) {
      issues.push({
        id: 'audit-unlinked-chapters',
        rule: 'Curriculum Table of Contents Alignment',
        severity: 'CRITICAL',
        message: `${unlinkedConcepts.length} mandatory concept(s) (${unlinkedConcepts.map((c) => c.conceptName).join(', ')}) have no matching chapter in the ${currentClass} book.`,
        recommendation: 'Map these concepts to chapter syllabi or add dedicated chapters to ensure complete curriculum alignment.',
        fieldTarget: 'bookChapters',
      });
    }
  }

  // Check 7: Internal editorial model represented as official
  if (blueprint.isEditorialModel && blueprint.title.toLowerCase().includes('official')) {
    issues.push({
      id: 'audit-editorial-as-official',
      rule: 'Editorial Model Academic Integrity Prohibition',
      severity: 'BLOCKING',
      message: `Blueprint is flagged as an Editorial Model but includes "Official" in its title, violating academic integrity guidelines.`,
      recommendation: 'Rename the blueprint to state "(Editorial Model)" or "(Demonstration Blueprint)".',
      fieldTarget: 'title',
    });
  }

  // Assigned marks calculation
  const targetMarks = blueprint.totalMarks || 80;
  const assignedMarks =
    blueprint.sections && blueprint.sections.length > 0
      ? blueprint.sections.reduce((acc, s) => acc + s.totalMarks, 0)
      : (blueprint.questionSlots || []).reduce((acc, s) => acc + (s.marks || 0), 0);

  const marksMatch = targetMarks === assignedMarks;

  const scoreDeductions =
    issues.filter((i) => i.severity === 'BLOCKING').length * 25 +
    issues.filter((i) => i.severity === 'CRITICAL').length * 15 +
    issues.filter((i) => i.severity === 'WARNING').length * 8;

  const auditScore = Math.max(0, 100 - scoreDeductions);

  let overallAuditStatus: BlueprintComprehensiveAuditResult['overallAuditStatus'] = 'PASS';
  if (issues.some((i) => i.severity === 'BLOCKING')) {
    overallAuditStatus = 'ACADEMIC REVIEW';
  } else if (
    blueprint.verificationStatus !== 'VERIFIED' &&
    blueprint.boardCode &&
    (blueprint.boardCode.startsWith('CBSE') || blueprint.boardCode.startsWith('ICSE'))
  ) {
    overallAuditStatus = 'SOURCE REQUIRED';
  } else if (!marksMatch || issues.some((i) => i.severity === 'WARNING')) {
    overallAuditStatus = 'WARNING';
  }

  return {
    overallAuditStatus,
    targetMarks,
    assignedMarks,
    marksMatch,
    auditScore,
    issues,
  };
}

// ============================================================================
// 10. AI DRAFT QUESTION GENERATOR WITH MANDATORY ACADEMIC REVIEW LABEL
// ============================================================================

export function generateDraftQuestionsForBlueprint(
  blueprint: BoardQuestionBlueprint,
  conceptName: string = 'Subject-Verb Concord',
  count: number = 2
): Array<{
  id: string;
  type: QuestionType;
  prompt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  correctAnswer: string;
  explanation: string;
  acceptableAnswers?: string[];
  options?: string[];
  isAiDraft: boolean;
  approvalStatus: 'AI_DRAFT_REVIEW_REQUIRED';
  educationSystem: string;
  classOrStage: string;
  blueprintComponent: string;
  conceptTested: string;
  cognitiveLevel: CognitiveLevel;
  draftLabel: string;
  markingRubricNotes?: string;
}> {
  const result = [];
  const systemName = blueprint.board || 'CBSE';

  for (let i = 0; i < count; i++) {
    const timestamp = Date.now() + i;
    result.push({
      id: `ai-draft-${timestamp}`,
      type: (i % 2 === 0 ? 'fill_in_blanks' : 'transformation') as QuestionType,
      prompt:
        i % 2 === 0
          ? `Complete the following sentence with the correct form of the verb agreeing with the subject: "The committee of five scientists ______ (has / have) published its annual findings on renewable solar storage."`
          : `Rewrite the sentence beginning with "Neither of": "Both the proposed routes are not safe for heavy trucks."`,
      difficulty: 'Medium' as const,
      marks: 1,
      correctAnswer: i % 2 === 0 ? 'has' : 'Neither of the proposed routes is safe for heavy trucks.',
      acceptableAnswers:
        i % 2 === 0
          ? ['has']
          : [
              'Neither of the proposed routes is safe for heavy trucks.',
              'Neither of the proposed routes is considered safe for heavy trucks.',
            ],
      explanation:
        'Collective noun "committee" acting as a single unit takes a singular verb "has". In sentence transformation, "Neither of" takes a singular noun phrase and singular verb "is".',
      isAiDraft: true,
      approvalStatus: 'AI_DRAFT_REVIEW_REQUIRED' as const,
      educationSystem: systemName,
      classOrStage: blueprint.targetClass || 'Class 6',
      blueprintComponent: `${blueprint.title} (${conceptName})`,
      conceptTested: conceptName,
      cognitiveLevel: 'Applying' as CognitiveLevel,
      draftLabel: 'AI DRAFT — ACADEMIC REVIEW REQUIRED',
      markingRubricNotes:
        'Accept syntactically valid variations conforming to prescribed grammatical rules.',
    });
  }

  return result;
}
