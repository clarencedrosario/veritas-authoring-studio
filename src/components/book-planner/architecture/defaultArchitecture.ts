import { BookProject } from '../../../types';
import {
  BookArchitectureConfig,
  BookPurposePositioning,
  LearningArchitecture,
  PedagogicalModel,
  StandardChapterArchitecture,
  ExerciseArchitecture,
  AssessmentPhilosophy,
  VisualArchitecture,
  EditorialStyleArchitecture,
  SeriesProgressionArchitecture,
  BookArchitectureHealthReport,
} from './types';

/**
 * Creates default, rich, pedagogically sound Book Architecture tailored to a BookProject
 */
export function getDefaultBookArchitecture(project: BookProject): BookArchitectureConfig {
  const isCambridge = (project.board || '').toLowerCase().includes('cambridge');
  const isIcse = (project.board || '').toLowerCase().includes('icse') || (project.board || '').toLowerCase().includes('cisce');
  const classLabel = project.classLevel || 'Class 6';

  // Determine stage progression labels
  let prevStage: string = 'Class 5';
  let curStage: string = classLabel;
  let nextStage: string = 'Class 7';

  if (isCambridge) {
    const num = classLabel.replace(/\D/g, '') || '6';
    const n = parseInt(num, 10);
    prevStage = `Stage ${Math.max(1, n - 1)}`;
    curStage = `Stage ${n}`;
    nextStage = `Stage ${n + 1}`;
  } else if (classLabel.includes('Class')) {
    const num = classLabel.replace(/\D/g, '') || '6';
    const n = parseInt(num, 10);
    prevStage = `Class ${Math.max(1, n - 1)}`;
    curStage = `Class ${n}`;
    nextStage = `Class ${n + 1}`;
  }

  // 1. Purpose & Positioning
  const purposePositioning: BookPurposePositioning = {
    bookPurpose: `This volume is authored to establish rigorous syntactic fluency, grammatical precision, and structural sentence mastery for middle school students entering secondary academic discourse.`,
    targetLearner: {
      ageRange: project.targetAge || '11–12 years',
      classOrStage: curStage,
      expectedPriorKnowledge: `Functional awareness of primary parts of speech, elementary capitalization, basic end-stop punctuation, and simple declarative clause structures.`,
      learnerProfile: `Middle school learners transitioning from intuitive primary language acquisition toward formal syntactic analysis, active error-detection, and structured academic writing.`,
    },
    curriculumContext: {
      boardOrProgramme: `${project.board || 'CBSE'} Secondary Academic Framework`,
      curriculumFramework: isCambridge
        ? 'Cambridge Lower Secondary English Curriculum Framework'
        : isIcse
        ? 'CISCE Curriculum for English Language & Literature'
        : 'National Curriculum Framework (NCF) / CBSE Secondary English Grammar & Composition',
      languageStandard: isCambridge
        ? 'Standard International English (UK spelling conventions)'
        : 'Standard English with standard Indian and international curriculum conventions',
      examinationRelevance: `Direct preparation for board-pattern grammar items: subject-verb concord, tense transformations, reported discourse, error spotting, and formal composition formats.`,
    },
    bookPositioning: 'Grammar & Composition Book',
    pedagogicalPromise: `Bridges explicit grammatical theory and authentic writing through inductive discovery drills, syntactic diagramming, and graduated Bloom-tiered practice.`,
  };

  // 2. Learning Architecture
  const learningArchitecture: LearningArchitecture = {
    priorKnowledge: `Learners should recognize basic word classes (nouns, verbs, adjectives, prepositions), simple tense forms (present, past), and construct basic subject-verb-object sentences without structural fragments.`,
    entryCompetencies: [
      'Identify grammatical subject and lexical verb in simple affirmative sentences.',
      'Distinguish singular and plural noun forms, including irregular plurals.',
      'Apply standard sentence boundaries (capital letters, full stops, question marks).',
      'Construct compound sentences using basic coordinating conjunctions (and, but, so).',
    ],
    endOfBookCompetencies: [
      'Apply subject-verb agreement across compound, collective, and modified subjects with zero concord errors.',
      'Distinguish subtle aspectual nuances across present perfect, simple past, and continuous forms.',
      'Transform direct statements and inquiries into reported speech with correct deictic pronoun/tense shifts.',
      'Form complex sentences utilizing subordinating clauses and relative pronouns.',
      'Identify and rectify dangling modifiers, comma splices, and faulty parallel structures in multi-sentence texts.',
      'Compose cohesive formal paragraphs, structured letters, and descriptive vignettes adhering to prescribed formats.',
    ],
    coreStrands: [
      {
        id: 'strand-1',
        title: 'Grammar & Syntax',
        description: 'Structural rules governing sentence elements, concord, clause hierarchy, and verbal inflection.',
        relativeEmphasis: 'Core',
        curriculumLinks: ['Syntax.Concord.6', 'ClauseHierarchy.6'],
        contributingChapters: ['Chapter 1: Subject–Verb Agreement', 'Unit 1 Chapters', 'Unit 4 Chapters'],
      },
      {
        id: 'strand-2',
        title: 'Usage & Accuracy',
        description: 'Contextual precision in prepositions, determiners, modal auxiliaries, and idioms.',
        relativeEmphasis: 'High',
        curriculumLinks: ['Usage.Determiners.6', 'Modals.Auxiliary.6'],
        contributingChapters: ['Unit 2 Chapters', 'Unit 3 Chapters'],
      },
      {
        id: 'strand-3',
        title: 'Vocabulary & Lexicon',
        description: 'Collocations, prefixes, suffixes, phrasal verbs, and context-dependent word forms.',
        relativeEmphasis: 'Moderate',
        curriculumLinks: ['Lexicon.Morphology.6'],
        contributingChapters: ['Unit 2 Chapters', 'Back Matter Glossary'],
      },
      {
        id: 'strand-4',
        title: 'Sentence Construction & Synthesis',
        description: 'Synthesizing simple ideas into compound and complex periodic sentences without run-ons.',
        relativeEmphasis: 'Core',
        curriculumLinks: ['Sentence.Synthesis.6'],
        contributingChapters: ['Unit 1 Chapters', 'Unit 4 Chapters'],
      },
      {
        id: 'strand-5',
        title: 'Editing & Error Correction',
        description: 'Proofreading passages, isolating syntactic flaws, and replacing faulty idioms.',
        relativeEmphasis: 'High',
        curriculumLinks: ['Proofreading.Editing.6'],
        contributingChapters: ['Chapter 1 Sections', 'All Unit Reviews'],
      },
      {
        id: 'strand-6',
        title: 'Composition & Applied Writing',
        description: 'Paragraph development, formal and informal letters, notices, and analytical summaries.',
        relativeEmphasis: 'High',
        curriculumLinks: ['Composition.Discourse.6'],
        contributingChapters: ['Unit 5 Chapters', 'Unit 6 Chapters'],
      },
      {
        id: 'strand-7',
        title: 'Language in Context',
        description: 'Functional dialogues, register appropriateness, tone calibration, and authentic extracts.',
        relativeEmphasis: 'Supportive',
        curriculumLinks: ['Pragmatics.Context.6'],
        contributingChapters: ['Unit 3 Chapters', 'Unit 5 Chapters'],
      },
      {
        id: 'strand-8',
        title: 'Assessment & Spaced Revision',
        description: 'Periodic diagnostic diagnostics, unit benchmarks, and comprehensive term revision.',
        relativeEmphasis: 'Core',
        curriculumLinks: ['Assessment.Diagnostic.6', 'Revision.Summative.6'],
        contributingChapters: ['All Chapter Assessments', 'Unit Reviews', 'Term Papers'],
      },
    ],
  };

  // 3. Pedagogical Model
  const pedagogicalModel: PedagogicalModel = {
    modelName: 'Inductive Discovery to Communicative Mastery (IDCM)',
    modelDescription: `A scaffolded instructional flow that introduces authentic language instances first, prompts student pattern recognition, codifies explicit grammatical rules, and culminates in creative student production.`,
    stages: [
      {
        id: 'stage-1',
        name: 'Discover / Observe',
        tagline: 'Noticing patterns in authentic context',
        description: 'Presents an engaging short passage or dialogue where the target grammatical feature appears naturally in bold.',
        iconName: 'Eye',
      },
      {
        id: 'stage-2',
        name: 'Understand',
        tagline: 'Guided inquiry & conceptual grasp',
        description: 'Prompts learners with guided questions to deduce underlying structural principles before formal terminology.',
        iconName: 'Compass',
      },
      {
        id: 'stage-3',
        name: 'Rule / Concept',
        tagline: 'Clear, authoritative codification',
        description: 'Concise, highlighted rule box summarizing syntax, morphological rules, exceptions, and key formulas.',
        iconName: 'BookOpen',
      },
      {
        id: 'stage-4',
        name: 'Modelled Examples',
        tagline: 'Exemplary sentence demonstrations',
        description: 'Contrastive pairs demonstrating correct vs incorrect usage with annotations explaining grammatical rationale.',
        iconName: 'CheckSquare',
      },
      {
        id: 'stage-5',
        name: 'Guided Practice',
        tagline: 'Low-stakes scaffolded exercises',
        description: 'Fill-in-the-blanks, multiple choice, and underline drills with helpful hints and partial scaffolding.',
        iconName: 'Layers',
      },
      {
        id: 'stage-6',
        name: 'Independent Practice',
        tagline: 'Firming confidence & accuracy',
        description: 'Unassisted drills requiring sentence rewrite, conversion, and selection from multiple possibilities.',
        iconName: 'PenTool',
      },
      {
        id: 'stage-7',
        name: 'Application',
        tagline: 'Contextual communicative drills',
        description: 'Students deploy target grammar in writing real sentences, paragraphs, or roleplay dialogues.',
        iconName: 'Send',
      },
      {
        id: 'stage-8',
        name: 'Challenge',
        tagline: 'Higher-order cognitive analysis',
        description: 'Complex sentences, irregular exceptions, and tricky syntactic puzzles for enrichment.',
        iconName: 'Sparkles',
      },
      {
        id: 'stage-9',
        name: 'Review',
        tagline: 'Consolidation & rapid self-check',
        description: 'Quick summary bullet points and error-spotting checklist before formal assessment.',
        iconName: 'Activity',
      },
      {
        id: 'stage-10',
        name: 'Assessment',
        tagline: 'Graded evaluation of mastery',
        description: 'Standardized chapter test measuring retention, transfer, and syntactic precision.',
        iconName: 'Award',
      },
    ],
  };

  // 4. Standard Chapter Architecture
  const chapterArchitecture: StandardChapterArchitecture = {
    components: [
      {
        id: 'comp-1',
        name: 'Chapter Opener',
        category: 'opener',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Chapter number, title, contextual vignette, and theme illustration.',
      },
      {
        id: 'comp-2',
        name: 'Learning Objectives',
        category: 'opener',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.25,
        description: 'Bulleted behavioral outcomes ("In this chapter, you will learn to...").',
      },
      {
        id: 'comp-3',
        name: 'Warm-Up / Prior Knowledge',
        category: 'opener',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Quick 2-minute diagnostic starter activating previous grade concepts.',
      },
      {
        id: 'comp-4',
        name: 'Concept Introduction',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Engaging real-world context introducing the target linguistic structure.',
      },
      {
        id: 'comp-5',
        name: 'Explanation & Syntactic Analysis',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Step-by-step breakdown of grammatical mechanics.',
      },
      {
        id: 'comp-6',
        name: 'Grammar Rules & Form Boxes',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Distinctive bordered parchment box defining core grammatical laws.',
      },
      {
        id: 'comp-7',
        name: 'Examples & Contrastive Pairs',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Highlighted sample sentences showing correct vs incorrect usage.',
      },
      {
        id: 'comp-8',
        name: 'Visual / Syntactic Diagram',
        category: 'instruction',
        isRequired: false,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Sentence tree, reed-kellogg diagram, or flowchart mapping relationships.',
      },
      {
        id: 'comp-9',
        name: 'Worked Examples with Commentary',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Sample problem solved with step-by-step grammatical rationale.',
      },
      {
        id: 'comp-10',
        name: 'Common Errors & Pitfalls',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Warning box highlighting frequent mistakes made by middle schoolers.',
      },
      {
        id: 'comp-11',
        name: 'Remember / Tip Boxes',
        category: 'instruction',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.25,
        description: 'Bite-sized mnemonic device or memory tip.',
      },
      {
        id: 'comp-12',
        name: 'Guided Practice',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Immediate check-for-understanding exercises with teacher hints.',
      },
      {
        id: 'comp-13',
        name: 'Exercise A: Recognition & Identification',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Underlining, identifying, circling target structures.',
      },
      {
        id: 'comp-14',
        name: 'Exercise B: Fill in the Blanks / Selection',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Choosing correct verb form, determiner, or pronoun from brackets.',
      },
      {
        id: 'comp-15',
        name: 'Exercise C: Sentence Rewriting & Transformation',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Transforming sentences according to instructions (active to passive, direct to indirect).',
      },
      {
        id: 'comp-16',
        name: 'Exercise D: Error Correction & Editing',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.75,
        description: 'Passage proofreading to detect and rectify grammatical errors.',
      },
      {
        id: 'comp-17',
        name: 'Exercise E: Contextual Application & Composition',
        category: 'practice',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Writing original sentences, completing dialogues, or drafting paragraphs.',
      },
      {
        id: 'comp-18',
        name: 'Additional Exercises & Practice Set',
        category: 'practice',
        isRequired: false,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Extra practice sets for extended revision or homework assignments.',
      },
      {
        id: 'comp-19',
        name: 'Application / Challenge Drill',
        category: 'review',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Higher-order problem solving and linguistic brain teasers.',
      },
      {
        id: 'comp-20',
        name: 'Chapter Review & Summary',
        category: 'review',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 0.5,
        description: 'Comprehensive bullet-point review of all rules covered.',
      },
      {
        id: 'comp-21',
        name: 'Chapter Assessment & Mastery Test',
        category: 'assessment',
        isRequired: true,
        editionTarget: 'both',
        defaultEstimatedPages: 1.0,
        description: 'Formal graded assessment testing all chapter concepts.',
      },
      {
        id: 'comp-22',
        name: 'Answer Key',
        category: 'back_matter',
        isRequired: true,
        editionTarget: 'teacher',
        defaultEstimatedPages: 0.5,
        description: 'Complete answer keys and model answers for student self-evaluation or teacher reference.',
      },
      {
        id: 'comp-23',
        name: 'Teacher / Author Pedagogical Notes',
        category: 'back_matter',
        isRequired: false,
        editionTarget: 'teacher',
        defaultEstimatedPages: 0.5,
        description: 'Pedagogical recommendations, anticipated misconceptions, and lesson plan suggestions.',
      },
    ],
    notes: 'Default chapter structure designed for standard 12–16 page academic grammar chapters.',
  };

  // 5. Exercise & Practice Architecture
  const exerciseArchitecture: ExerciseArchitecture = {
    levels: [
      {
        id: 'tier-1',
        name: 'Tier 1: Foundation / Identification / Direct Recall',
        purpose: 'Establish baseline syntactic recognition and rule familiarity without cognitive overload.',
        suggestedQuestionTypes: ['Multiple Choice (Single Option)', 'Underline and Label Constituent', 'Matching Concord Pairs', 'Term & Function Identification'],
        typicalQuestionCount: 12,
        difficulty: 'Easy',
        marksPerItem: 1,
        bloomLevel: 'Remember',
        isRequired: true,
      },
      {
        id: 'tier-2',
        name: 'Tier 2: Application / Fill-in / Sentence Transformation',
        purpose: 'Execute active sentence manipulation and rule application in controlled linguistic environments.',
        suggestedQuestionTypes: ['Fill in the blanks with correct verb/determiner', 'Rewrite sentence as directed', 'Combine two clauses with conjunction', 'Tense and Aspect Shift'],
        typicalQuestionCount: 14,
        difficulty: 'Medium',
        marksPerItem: 1,
        bloomLevel: 'Apply',
        isRequired: true,
      },
      {
        id: 'tier-3',
        name: 'Tier 3: Error Analysis / Editing / Contextual Synthesis',
        purpose: 'Identify syntactic breaches in multi-sentence contexts and deploy target forms in sustained discourse.',
        suggestedQuestionTypes: ['Find the incorrect word and write correction', 'Short passage proofreading (4-6 lines)', 'Dialogue cloze completion', 'Authentic contextual sentence generation'],
        typicalQuestionCount: 8,
        difficulty: 'Hard',
        marksPerItem: 2,
        bloomLevel: 'Analyze',
        isRequired: true,
      },
    ],
    questionTypes: [
      {
        id: 'qt-1',
        name: 'Multiple Choice (Single Option)',
        category: 'objective',
        description: '4-option stem targeting concord, tense recognition, or part-of-speech function.',
        typicalMarks: 1,
        typicalTimeMinutes: 1,
        autoGradable: true,
        bloomLevel: 'Remember',
        frequencyRecommendation: 'Common',
      },
      {
        id: 'qt-2',
        name: 'Underline & Label Constituent',
        category: 'objective',
        description: 'Isolate grammatical subject, auxiliary, or clause boundary in a full sentence.',
        typicalMarks: 1,
        typicalTimeMinutes: 1,
        autoGradable: true,
        bloomLevel: 'Understand',
        frequencyRecommendation: 'Common',
      },
      {
        id: 'qt-3',
        name: 'Fill-in-the-Blank with Root Choice',
        category: 'completion',
        description: 'Provide bracketed root verb or base form for student inflected completion.',
        typicalMarks: 1,
        typicalTimeMinutes: 1.5,
        autoGradable: true,
        bloomLevel: 'Apply',
        frequencyRecommendation: 'Frequent',
      },
      {
        id: 'qt-4',
        name: 'Sentence Transformation (Rewrite as Directed)',
        category: 'transformation',
        description: 'Transform affirmative to negative, singular to plural, or change tense aspect.',
        typicalMarks: 1,
        typicalTimeMinutes: 2,
        autoGradable: false,
        bloomLevel: 'Apply',
        frequencyRecommendation: 'Frequent',
      },
      {
        id: 'qt-5',
        name: 'Class 6 Passage Editing (Omission / Error Correction)',
        category: 'analysis',
        description: '4-line passage with one syntactic error per line requiring identification and correction.',
        typicalMarks: 4,
        typicalTimeMinutes: 5,
        autoGradable: false,
        bloomLevel: 'Analyze',
        frequencyRecommendation: 'Every Chapter',
      },
      {
        id: 'qt-6',
        name: 'Contextual Dialogue Cloze',
        category: 'synthesis',
        description: 'Authentic 2-speaker conversation requiring target grammatical form to maintain coherence.',
        typicalMarks: 3,
        typicalTimeMinutes: 4,
        autoGradable: false,
        bloomLevel: 'Apply',
        frequencyRecommendation: 'Alternate Chapters',
      },
    ],
    distributionRules: [
      {
        id: 'dr-1',
        title: 'Class 6 Bloom Cognitive Balance',
        description: 'Ensure 35% Remember/Understand (Tier 1), 45% Apply/Transform (Tier 2), and 20% Analyze/Error Spotting (Tier 3).',
        minPercentage: 20,
        maxPercentage: 45,
        enforcementLevel: 'strict',
      },
      {
        id: 'dr-2',
        title: 'Middle School Question Volume Guarantee',
        description: 'Every chapter must contain a minimum of 32 total exercise items across Tiers 1-3.',
        minPercentage: 30,
        maxPercentage: 40,
        enforcementLevel: 'strict',
      },
    ],
    rubrics: [],
    notes: 'Progression directly feeds the Question Bank and Interactive Quiz generator.',
  };

  // 6. Assessment Philosophy
  const assessmentPhilosophy: AssessmentPhilosophy = {
    components: [
      {
        id: 'assess-1',
        name: 'Diagnostic Assessment',
        purpose: 'Establish prior knowledge baselines and isolate learning gaps at the start of each unit.',
        frequency: 'Start of each major unit (6 times per year)',
        approximateMarks: '10–15 Marks',
        questionMix: '60% Objective Recall, 40% Simple Application',
        difficultyDistribution: '70% Easy, 30% Medium',
        feedbackModel: 'Instant classroom self-check with diagnostic remedial mapping.',
      },
      {
        id: 'assess-2',
        name: 'Formative Practice',
        purpose: 'Continuous low-stakes check during instructional sections to guide teaching.',
        frequency: 'Every instructional topic (2–3 times per chapter)',
        approximateMarks: '5–10 Marks',
        questionMix: '100% Focused Practice Drills',
        difficultyDistribution: '40% Easy, 50% Medium, 10% Hard',
        feedbackModel: 'Immediate peer discussion and teacher clarification.',
      },
      {
        id: 'assess-3',
        name: 'Chapter Assessment',
        purpose: 'Evaluate mastery of complete chapter objectives before moving forward.',
        frequency: 'End of each chapter (once per chapter)',
        approximateMarks: '25 Marks',
        questionMix: '30% Objective, 50% Transformation/Editing, 20% Creative',
        difficultyDistribution: '30% Easy, 50% Medium, 20% Hard',
        feedbackModel: 'Formal teacher grading with rubric-based error categories.',
      },
      {
        id: 'assess-4',
        name: 'Unit Assessment',
        purpose: 'Synthesize inter-related chapters into cohesive language capability.',
        frequency: 'End of each unit (6 times per year)',
        approximateMarks: '40 Marks',
        questionMix: '25% Syntax, 25% Morphology, 25% Editing, 25% Composition',
        difficultyDistribution: '25% Easy, 55% Medium, 20% Advanced',
        feedbackModel: 'Detailed grade report with targeted review references.',
      },
      {
        id: 'assess-5',
        name: 'Term / Summative Assessment',
        purpose: 'Benchmark comprehensive academic achievement against curriculum standards.',
        frequency: 'Mid-term and Annual Examination (2 papers per volume)',
        approximateMarks: '80 Marks',
        questionMix: 'Full board-pattern distribution covering reading, grammar, and writing',
        difficultyDistribution: '30% Easy, 50% Medium, 20% Challenging',
        feedbackModel: 'Standardized mark sheet with board grade descriptors.',
      },
      {
        id: 'assess-6',
        name: 'Revision & Remediation',
        purpose: 'Spaced repetition to prevent skill decay and provide targeted intervention.',
        frequency: 'Quarterly review weeks',
        approximateMarks: '20 Marks',
        questionMix: 'Curated error-prone questions from earlier chapters',
        difficultyDistribution: '50% Medium, 50% Hard',
        feedbackModel: 'Diagnostic error classification and guided correction drills.',
      },
      {
        id: 'assess-7',
        name: 'Challenge & Enrichment',
        purpose: 'Extend high-achieving students with Olympiad-style and linguistic inquiry problems.',
        frequency: 'Optional section at the close of each unit',
        approximateMarks: '15 Marks',
        questionMix: '100% Analytical & Evaluative linguistic tasks',
        difficultyDistribution: '20% Medium, 50% Hard, 30% Advanced',
        feedbackModel: 'Explanatory commentary revealing nuanced linguistic rules.',
      },
    ],
    notes: 'Philosophy establishes the guiding pedagogical standards; detailed chapter-by-chapter assessment matrices reside in the Assessment Plan tab.',
  };

  // 7. Visual & Design Architecture
  const visualArchitecture: VisualArchitecture = {
    visualDensity: 'Moderate',
    approxVisualsPerChapter: 4,
    assetTypes: [
      {
        id: 'asset-1',
        name: 'Grammar Diagrams & Branching Trees',
        status: 'Preferred',
        usageGuideline: 'Use for sentence constituent breakdown, clause nesting, and syntactic concord mapping.',
      },
      {
        id: 'asset-2',
        name: 'Sentence Diagrams (Reed-Kellogg style)',
        status: 'Optional',
        usageGuideline: 'Use selectively for complex subject-verb-object-complement relations in middle school.',
      },
      {
        id: 'asset-3',
        name: 'Syntactic Matrix Tables',
        status: 'Preferred',
        usageGuideline: 'Required for person/number concord tables, pronoun declensions, and tense paradigm grids.',
      },
      {
        id: 'asset-4',
        name: 'Concept Maps & Mind Maps',
        status: 'Preferred',
        usageGuideline: 'Recommended for chapter openers and unit overview pages to show thematic connections.',
      },
      {
        id: 'asset-5',
        name: 'Visual Infographics',
        status: 'Preferred',
        usageGuideline: 'Deploy for prepositional spatial relations (above, over, through) and time prepositions.',
      },
      {
        id: 'asset-6',
        name: 'Illustrations & Vignettes',
        status: 'Preferred',
        usageGuideline: 'High-contrast line art or duotone illustrations contextualizing example sentences and dialogues.',
      },
      {
        id: 'asset-7',
        name: 'Photographs',
        status: 'Restricted',
        usageGuideline: 'Restricted to authentic realia (newspaper headlines, book covers, official notices) in composition.',
      },
      {
        id: 'asset-8',
        name: 'Worked-Example Panels',
        status: 'Preferred',
        usageGuideline: 'Parchment background with gold accent border, presenting annotated sample analyses.',
      },
      {
        id: 'asset-9',
        name: 'Rule Boxes',
        status: 'Preferred',
        usageGuideline: 'High-contrast Burgundy header with clear serif rule text, boxed with subtle 1px border.',
      },
      {
        id: 'asset-10',
        name: 'Common-Error Warning Boxes',
        status: 'Preferred',
        usageGuideline: 'Amber-tinted alert box with crossed-out incorrect sentence and verified correct counterpart.',
      },
      {
        id: 'asset-11',
        name: 'Tip & Mnemonic Boxes',
        status: 'Preferred',
        usageGuideline: 'Emerald or gold pill callout with lightbulb icon for high-yield memory shortcuts.',
      },
      {
        id: 'asset-12',
        name: 'Revision & Summary Boxes',
        status: 'Preferred',
        usageGuideline: 'End-of-chapter double-column summary card reviewing essential formulas.',
      },
    ],
    accessibility: {
      requireCaptions: true,
      requireAltText: true,
      wcagContrastCompliance: true,
      readableTypeMinimum: true,
      nonColourDependentMeaning: true,
      notes: 'All diagrams must be accompanied by explicit text explanations; colors must not be the sole indicator of grammatical error.',
    },
  };

  // 8. Language & Editorial Style
  const editorialStyle: EditorialStyleArchitecture = {
    englishVariety: isCambridge ? 'British English' : 'Indian English conventions',
    spellingStandard: isCambridge
      ? 'Oxford British Standard: -ise/-ize consistent, -our (colour, honour), double-l in inflected verbs (travelling).'
      : 'Standard Indian Academic English: British spelling conventions (-our, -re, -ise/ize accepted per CBSE norms).',
    punctuationConvention: 'Oxford serial comma recommended for disambiguation; single quotation marks for speech with terminal punctuation logically placed.',
    capitalisation: 'Title Case for book and chapter headings; Sentence case for subheadings, exercise labels, and table column titles.',
    terminologyConventions: 'Subject-Verb Concord (also referenced as Subject-Verb Agreement); Determiners categorized distinctly from descriptive adjectives.',
    grammarTerminology: 'Descriptive modern functional grammar paired with traditional structural labels to support both classroom pedagogy and formal exams.',
    exampleSentenceStyle: 'Culturally inclusive, vibrant, and relatable middle-school settings (science fairs, school sports, family dialogues, nature observations).',
    tone: 'Encouraging, authoritative, intellectually engaging, and free of condescending jargon.',
    readingLevel: 'Lexile 750L–880L (approximate Grade 6 readability index for instructional prose; example sentences calibrated for clarity).',
    inclusivityGuidance: 'Balanced gender representation across names and roles; varied regional and cultural backgrounds represented in reading extracts.',
    sensitiveContentGuidance: 'Exclude brand product placements, violent metaphors, stereotypes, and socio-economic biases.',
    editorialStyleNotes: 'Ensure consistent bolding for grammatical terms on first appearance, with italicization for linguistic citation forms.',
  };

  // 9. Series Progression
  const seriesProgression: SeriesProgressionArchitecture = {
    previousVolume: {
      classOrStage: prevStage,
      title: `Junior Grammar Foundations — ${prevStage}`,
      inheritedConcepts: [
        'Identification of 8 parts of speech',
        'Simple past and simple present verb paradigms',
        'Countable and uncountable nouns',
        'Terminal punctuation (period, question mark, exclamation point)',
        'Basic compound sentences with coordinating conjunctions',
      ],
    },
    currentVolume: {
      classOrStage: curStage,
      title: project.bookTitle || `Middle School Grammar & Syntax — ${curStage}`,
      reinforcedConcepts: [
        'Rigorous Subject-Verb Agreement with intervening prepositional phrases and compound subjects',
        'Aspectual distinctions: Present Perfect vs Simple Past, Past Continuous',
        'Direct and Indirect speech transformations',
        'Modal auxiliaries for obligation, permission, and possibility',
        'Relative clauses and complex sentence construction',
      ],
      newConceptsIntroduced: [
        'Concord rules for collective nouns, fractions, and correlative conjunctions',
        'Non-finite verbals (infinitives, gerunds, participles)',
        'Active and Passive voice transformations',
        'Synthesis of sentences using participle clauses',
        'Formal letter writing and notice drafting',
      ],
    },
    nextVolume: {
      classOrStage: nextStage,
      title: `Advanced Grammar & Rhetoric — ${nextStage}`,
      preparedConcepts: [
        'Subjunctive mood and conditional sentence hierarchies',
        'Transformation of compound-complex sentences',
        'Synthesis with nominal clauses and adverbial clauses of condition/concession',
        'Analytical composition and persuasive essay structure',
        'Stylistic parallelism and rhetoric in literature',
      ],
    },
  };

  // 10. Health Check
  const health: BookArchitectureHealthReport = {
    status: 'Configured',
    checks: [
      { id: 'check-1', title: 'Book Purpose Defined', isPassed: true, message: 'Concise volume objective documented.' },
      { id: 'check-2', title: 'Target Learner Profile Defined', isPassed: true, message: 'Age, stage, and prior knowledge specified.' },
      { id: 'check-3', title: 'Core Learning Strands Configured', isPassed: learningArchitecture.coreStrands.length >= 6, message: `${learningArchitecture.coreStrands.length} pedagogical strands active.` },
      { id: 'check-4', title: 'Chapter Architecture Anatomy Established', isPassed: chapterArchitecture.components.length >= 10, message: `${chapterArchitecture.components.length} chapter components mapped.` },
      { id: 'check-5', title: 'Exercise Progression Established', isPassed: exerciseArchitecture.levels.length >= 6, message: `${exerciseArchitecture.levels.length} Bloom-tiered exercise levels active.` },
      { id: 'check-6', title: 'Assessment Philosophy Configured', isPassed: assessmentPhilosophy.components.length >= 5, message: `${assessmentPhilosophy.components.length} assessment tiers documented.` },
      { id: 'check-7', title: 'Editorial Style Guide Established', isPassed: !!editorialStyle.englishVariety && !!editorialStyle.spellingStandard, message: 'Spelling, punctuation, and style guide set.' },
      { id: 'check-8', title: 'Page Target & Budget Mapped', isPassed: (project.targetPageCount || 0) > 0, message: `Target page budget: ${project.targetPageCount || 192} pages.` },
    ],
    warnings: [],
    lastAudited: new Date().toISOString(),
  };

  return {
    version: '1.0.0',
    lastEdited: new Date().toISOString(),
    purposePositioning,
    learningArchitecture,
    pedagogicalModel,
    chapterArchitecture,
    exerciseArchitecture,
    assessmentPhilosophy,
    visualArchitecture,
    editorialStyle,
    seriesProgression,
    health,
  };
}

/**
 * Validates Book Architecture and produces an updated health report
 */
export function auditBookArchitecture(
  arch: BookArchitectureConfig,
  project: BookProject,
  unitsCount: number,
  topicsCount: number
): BookArchitectureHealthReport {
  const checks = [
    {
      id: 'check-1',
      title: 'Book Purpose Defined',
      isPassed: !!arch.purposePositioning?.bookPurpose?.trim(),
      message: arch.purposePositioning?.bookPurpose?.trim()
        ? 'Book purpose is documented.'
        : 'Missing concise statement of book purpose.',
    },
    {
      id: 'check-2',
      title: 'Target Learner Profile Defined',
      isPassed:
        !!arch.purposePositioning?.targetLearner?.ageRange &&
        !!arch.purposePositioning?.targetLearner?.expectedPriorKnowledge,
      message: 'Learner demographics and prior knowledge specified.',
    },
    {
      id: 'check-3',
      title: 'Learning Strands Configured',
      isPassed: (arch.learningArchitecture?.coreStrands || []).length >= 4,
      message: `${arch.learningArchitecture?.coreStrands?.length || 0} active learning strands configured.`,
    },
    {
      id: 'check-4',
      title: 'Chapter Architecture Established',
      isPassed: (arch.chapterArchitecture?.components || []).length >= 8,
      message: `${arch.chapterArchitecture?.components?.length || 0} standard chapter components mapped.`,
    },
    {
      id: 'check-5',
      title: 'Exercise Progression Established',
      isPassed: (arch.exerciseArchitecture?.levels || []).length >= 4,
      message: `${arch.exerciseArchitecture?.levels?.length || 0} practice tiers configured.`,
    },
    {
      id: 'check-6',
      title: 'Assessment Philosophy Configured',
      isPassed: (arch.assessmentPhilosophy?.components || []).length >= 4,
      message: `${arch.assessmentPhilosophy?.components?.length || 0} assessment categories defined.`,
    },
    {
      id: 'check-7',
      title: 'Editorial Style Established',
      isPassed: !!arch.editorialStyle?.englishVariety && !!arch.editorialStyle?.spellingStandard,
      message: 'Style variety and spelling conventions set.',
    },
    {
      id: 'check-8',
      title: 'Page Target Defined',
      isPassed: (project.targetPageCount || 0) > 0,
      message: `Target of ${project.targetPageCount || 192} pages allocated.`,
    },
  ];

  const warnings: Array<{ id: string; severity: 'warning' | 'info' | 'critical'; title: string; message: string }> = [];

  if (unitsCount === 0) {
    warnings.push({
      id: 'warn-1',
      severity: 'critical',
      title: 'No Units Declared',
      message: 'The table of contents has no instructional units configured.',
    });
  }

  if (topicsCount === 0) {
    warnings.push({
      id: 'warn-2',
      severity: 'critical',
      title: 'No Chapters in Scope',
      message: 'No chapters are mapped to instructional units.',
    });
  }

  if (!arch.learningArchitecture?.priorKnowledge) {
    warnings.push({
      id: 'warn-3',
      severity: 'warning',
      title: 'Missing Prerequisite Mapping',
      message: 'Prior knowledge baseline has not been documented for incoming students.',
    });
  }

  const passedCount = checks.filter((c) => c.isPassed).length;
  let status: 'Not Configured' | 'Draft' | 'Needs Review' | 'Configured' | 'Verified' = 'Draft';

  if (passedCount === 0) {
    status = 'Not Configured';
  } else if (passedCount < 5 || warnings.some((w) => w.severity === 'critical')) {
    status = 'Needs Review';
  } else if (passedCount === checks.length && warnings.length === 0) {
    status = 'Verified';
  } else {
    status = 'Configured';
  }

  return {
    status,
    checks,
    warnings,
    lastAudited: new Date().toISOString(),
  };
}
