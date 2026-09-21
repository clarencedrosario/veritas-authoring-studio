import { ChapterComponentDefinition, ComponentCategory } from './types';
import { StudioChapter } from '../../../types';

/**
 * Authoritative Declarative Registry of Academic Chapter Components (COMP-01 through COMP-23)
 * Provides standardized metadata, authoring shell configurations, validation rules,
 * and export parameters for the VERITAS Academic Book Studio.
 */
export const CHAPTER_COMPONENT_REGISTRY: Record<string, ChapterComponentDefinition> = {
  // -------------------------------------------------------------
  // OPENER STAGE (COMP-01 to COMP-03)
  // -------------------------------------------------------------
  'comp-1': {
    id: 'comp-1',
    componentNumber: 1,
    title: 'Chapter Opener & Theme Vignette',
    shortTitle: 'Opener',
    category: 'opener',
    categoryLabel: 'Chapter Opener',
    description: 'Chapter number, title, contextual vignette, and theme illustration activating learner interest.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'structured_fields',
    supportedBlockTypes: ['paragraph', 'callout', 'image'],
    iconName: 'BookOpen',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Establishes chapter identity, cultural context, and aesthetic thematic tone.',
    aiPromptConfig: {
      systemRole: 'Textbook Opener Specialist',
      taskPromptTemplate: 'Generate an engaging real-world narrative vignette introducing the grammatical theme.',
      constraints: ['Age-appropriate context', 'Connect to everyday student experiences'],
      expectedJsonFormat: '{ "title": string, "subtitle": string, "openingHook": string, "shortIntroduction": string }',
    },
    validationRules: [
      {
        id: 'title-required',
        label: 'Chapter Title defined',
        check: (ch) => ({ valid: !!ch.title?.trim(), message: 'Chapter title must not be empty' }),
      },
      {
        id: 'opening-hook',
        label: 'Opening vignette / hook authored',
        check: (ch) => ({ valid: !!ch.opening?.openingHook?.trim(), message: 'Opening hook or vignette is recommended' }),
      },
    ],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'opener-parchment',
      exportRendererId: 'chapter_opener',
    },
  },

  'comp-2': {
    id: 'comp-2',
    componentNumber: 2,
    title: 'Learning Objectives & Competencies',
    shortTitle: 'Objectives',
    category: 'opener',
    categoryLabel: 'Learning Objectives',
    description: 'Measurable Bloom-tiered behavioral outcomes stating student capabilities upon chapter completion.',
    defaultEstimatedPages: 0.25,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'structured_fields',
    supportedBlockTypes: ['bullet_list', 'callout'],
    iconName: 'Target',
    badgeColor: '#9A7438',
    pedagogicalRole: 'Sets clear instructional goals and self-monitoring targets for students and teachers.',
    aiPromptConfig: {
      systemRole: 'Curriculum Competency Architect',
      taskPromptTemplate: 'Draft 3–5 measurable learning outcomes using active Bloom verbs.',
      constraints: ['Use measurable verbs like identify, analyze, transform, construct'],
      expectedJsonFormat: '{ "learningObjectives": string[] }',
    },
    validationRules: [
      {
        id: 'has-objectives',
        label: 'At least 2 learning objectives',
        check: (ch) => ({
          valid: (ch.opening?.learningObjectives?.length || 0) >= 2,
          message: 'At least 2 behavioral learning objectives required',
        }),
      },
    ],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'objectives-banner',
      exportRendererId: 'learning_objectives',
    },
  },

  'comp-3': {
    id: 'comp-3',
    componentNumber: 3,
    title: 'Warm-Up & Prior Knowledge Diagnostic',
    shortTitle: 'Warm-Up',
    category: 'opener',
    categoryLabel: 'Prior Knowledge',
    description: 'Quick 2-minute diagnostic starter activating prerequisite concepts from earlier grades.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'structured_fields',
    supportedBlockTypes: ['activity', 'question', 'callout'],
    iconName: 'Sparkles',
    badgeColor: '#C29A52',
    pedagogicalRole: 'Activates schema and surfaces baseline misconceptions before formal instruction.',
    aiPromptConfig: {
      systemRole: 'Diagnostic Starter Designer',
      taskPromptTemplate: 'Create a 2-minute diagnostic warm-up activity reviewing prerequisite knowledge.',
      constraints: ['Keep brief and interactive', 'Low-stakes diagnostic'],
      expectedJsonFormat: '{ "warmUpTitle": string, "instructions": string, "promptSentence": string }',
    },
    validationRules: [
      {
        id: 'has-prior-knowledge',
        label: 'Prerequisite knowledge stated',
        check: (ch) => ({ valid: !!ch.opening?.priorKnowledge?.trim(), message: 'Prior knowledge statement recommended' }),
      },
    ],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'warm-up-box',
      exportRendererId: 'warm_up',
    },
  },

  // -------------------------------------------------------------
  // INSTRUCTIONAL STAGE (COMP-04 to COMP-11)
  // -------------------------------------------------------------
  'comp-4': {
    id: 'comp-4',
    componentNumber: 4,
    title: 'Concept Introduction & Noticing Passage',
    shortTitle: 'Introduction',
    category: 'instruction',
    categoryLabel: 'Instruction',
    description: 'Engaging real-world textual extract where target linguistic structures appear naturally in bold.',
    defaultEstimatedPages: 1.0,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'block_sequence',
    supportedBlockTypes: ['paragraph', 'passage', 'callout'],
    iconName: 'BookOpenCheck',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Introduces language patterns inductively through natural communicative immersion.',
    aiPromptConfig: {
      systemRole: 'Inductive Grammar Author',
      taskPromptTemplate: 'Write an engaging narrative or dialogue paragraph with target grammatical features in bold.',
      constraints: ['Authentic dialogue or story', 'Target features highlighted naturally'],
      expectedJsonFormat: '{ "passageTitle": string, "passageText": string, "noticingPrompts": string[] }',
    },
    validationRules: [
      {
        id: 'has-intro-blocks',
        label: 'Introduction content exists in sections',
        check: (ch) => ({ valid: ch.sections.length > 0, message: 'Chapter must contain at least one content section' }),
      },
    ],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'concept_introduction',
    },
  },

  'comp-5': {
    id: 'comp-5',
    componentNumber: 5,
    title: 'Explanation & Syntactic Analysis',
    shortTitle: 'Explanation',
    category: 'instruction',
    categoryLabel: 'Syntactic Analysis',
    description: 'Step-by-step grammatical breakdown, clause relationships, and mechanical analysis.',
    defaultEstimatedPages: 1.0,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['paragraph', 'explanation', 'analysis_table'],
    iconName: 'GitCommit',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Explains the grammatical mechanics and structural relationships underlying the feature.',
    aiPromptConfig: {
      systemRole: 'Syntactic Linguist',
      taskPromptTemplate: 'Break down the grammatical mechanics with clear analytical prose.',
      constraints: ['Clear syntactic definitions', 'Highlight head words and dependencies'],
      expectedJsonFormat: '{ "conceptualExplanation": string, "syntacticAnalysis": any[] }',
    },
    validationRules: [
      {
        id: 'has-explanation',
        label: 'Syntactic explanation authored',
        check: (ch) => ({
          valid: !!ch.component05?.conceptualExplanation || ch.sections.some((s) => s.blocks.some((b) => b.type === 'text' || b.type === 'key_concept' || (b.type as string) === 'explanation')),
          message: 'Explanation content must be authored in Component 5 or sections',
        }),
      },
    ],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'explanation_view',
    },
  },

  'comp-6': {
    id: 'comp-6',
    componentNumber: 6,
    title: 'Grammar Rules & Form Boxes',
    shortTitle: 'Rules',
    category: 'instruction',
    categoryLabel: 'Rules & Form Boxes',
    description: 'Distinctive bordered parchment boxes defining definitive grammatical laws and formula tokens.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['grammar_rule', 'formula_box', 'callout'],
    iconName: 'Shield',
    badgeColor: '#9A7438',
    pedagogicalRole: 'Codifies the authoritative linguistic rule for unambiguous student reference and study.',
    aiPromptConfig: {
      systemRole: 'Textbook Rule Codifier',
      taskPromptTemplate: 'Formulate authoritative rule boxes with clear formulas and variations.',
      constraints: ['Prescriptive and clear rule statement', 'Include formula tokens'],
      expectedJsonFormat: '{ "formalRuleStatement": string, "structuralFormula": string, "ruleVariations": any[] }',
    },
    validationRules: [
      {
        id: 'has-rules',
        label: 'Grammar rules authored',
        check: (ch) => ({
          valid: !!ch.component06?.formalRuleStatement || (ch.rules?.length || 0) > 0 || ch.sections.some((s) => s.blocks.some((b) => b.type === 'grammar_rule')),
          message: 'At least one formal rule box must be authored',
        }),
      },
    ],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'parchment-gold-rule',
      exportRendererId: 'rule_box',
    },
  },

  // -------------------------------------------------------------
  // VALIDATION COMPONENT A: COMP-07 / Worked Examples
  // -------------------------------------------------------------
  'comp-7': {
    id: 'comp-7',
    componentNumber: 7,
    title: 'Worked Examples with Step-by-Step Commentary',
    shortTitle: 'Worked Examples',
    category: 'instruction',
    categoryLabel: 'Modelled Examples',
    description: 'Step-by-step grammatical reasoning demonstrating student thought process, rule application, and verified answers.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['worked_example', 'step_sequence', 'contrastive_pair'],
    iconName: 'HelpCircle',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Scaffolds cognitive reasoning from rule observation to independent drill problem solving.',
    aiPromptConfig: {
      systemRole: 'Master Pedagogical Modeling Author',
      taskPromptTemplate: 'Generate 2–3 step-by-step worked grammar examples demonstrating thought process, grammatical reasoning, and verified final answers.',
      constraints: [
        'Each worked example must include: problem sentence, 2 to 4 sequential reasoning steps, rule applied, and final verified solution.',
        'Teacher edition view must receive pedagogical insight explaining why students might hesitate.',
        'Grade-adapted difficulty and authentic board-appropriate sentences.',
      ],
      expectedJsonFormat: `{
  "items": [
    {
      "id": "we-1",
      "title": "Example 1: Resolving Intervening Prepositional Phrases",
      "problem": "The bouquet of yellow roses (look / looks) magnificent on the table.",
      "contextOrScenario": "Subject-verb agreement with intervening prepositional modifier",
      "difficulty": "Standard",
      "steps": [
        { "stepNumber": 1, "title": "Identify Grammatical Subject", "instruction": "Locate the core subject noun before the preposition.", "sampleWork": "'The bouquet' is the head noun (singular).", "ruleApplied": "Rule 1.1: Agreement with Head Noun" },
        { "stepNumber": 2, "title": "Bracket Intervening Phrase", "instruction": "Ignore intervening prepositional modifier 'of yellow roses'.", "sampleWork": "[of yellow roses] is a modifier and does not govern the verb." },
        { "stepNumber": 3, "title": "Select Verb Form", "instruction": "Match singular subject 'bouquet' with third-person singular finite verb.", "sampleWork": "Singular verb required: 'looks'." }
      ],
      "finalAnswer": "The bouquet of yellow roses looks magnificent on the table.",
      "grammaticalRationale": "The singular subject 'bouquet' governs the third-person singular finite verb 'looks', regardless of the plural noun 'roses' inside the intervening prepositional phrase.",
      "ruleReference": "RULE 1.1",
      "teacherNote": "Students frequently get trapped by proximity agreement with plural 'roses'. Highlight the syntactic head on the board."
    }
  ]
}`,
    },
    validationRules: [
      {
        id: 'has-worked-examples',
        label: 'At least one worked example authored',
        check: (ch) => {
          const c07Items = ch.component07?.items || [];
          const hasSectionBlocks = ch.sections.some((s) => s.blocks.some((b) => b.type === 'worked_example'));
          return {
            valid: c07Items.length > 0 || hasSectionBlocks,
            message: 'Authored worked examples are required to model cognitive reasoning',
          };
        },
      },
      {
        id: 'valid-steps',
        label: 'Worked examples have structured steps',
        check: (ch) => {
          const c07Items = ch.component07?.items || [];
          if (c07Items.length === 0) return { valid: true };
          const allHaveSteps = c07Items.every((item) => item.steps && item.steps.length >= 2);
          return {
            valid: allHaveSteps,
            message: 'Each worked example should contain at least 2 structured reasoning steps',
          };
        },
      },
    ],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'worked-example-parchment',
      exportRendererId: 'worked_examples',
    },
  },

  'comp-8': {
    id: 'comp-8',
    componentNumber: 8,
    title: 'Visual / Syntactic Diagram Brief',
    shortTitle: 'Diagrams',
    category: 'instruction',
    categoryLabel: 'Visual Architecture',
    description: 'Sentence structure trees, reed-kellogg diagrams, or infographics mapping clause relationships.',
    defaultEstimatedPages: 0.5,
    isRequired: false,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['image', 'diagram_brief', 'svg'],
    iconName: 'Image',
    badgeColor: '#C29A52',
    pedagogicalRole: 'Visualizes hierarchical syntactic dependencies for spatial and dual-coding learners.',
    aiPromptConfig: {
      systemRole: 'Syntactic Illustrator & Visual Brief Designer',
      taskPromptTemplate: 'Describe an educational visual or flowchart clarifying the grammatical rule.',
      constraints: ['Clear visual layout specification', 'Identify labels and arrows'],
      expectedJsonFormat: '{ "visualTitle": string, "caption": string, "svgBrief": string }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'visual_diagram',
    },
  },

  'comp-9': {
    id: 'comp-9',
    componentNumber: 9,
    title: 'Modelled Examples with Commentary',
    shortTitle: 'Modelled Examples',
    category: 'instruction',
    categoryLabel: 'Worked Examples',
    description: 'Detailed problem walkthroughs showing teacher reasoning and board explanation annotations.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['worked_example'],
    iconName: 'HelpCircle',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Exemplifies mastery with explicit metacognitive commentary.',
    aiPromptConfig: {
      systemRole: 'Master Pedagogical Modeling Author',
      taskPromptTemplate: 'Generate step-by-step worked examples showing teacher annotations.',
      constraints: ['Include full teacher commentary and solution steps'],
      expectedJsonFormat: '{ "items": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'worked_examples',
    },
  },

  // -------------------------------------------------------------
  // VALIDATION COMPONENT B: COMP-10 / Common Errors & Pitfalls
  // -------------------------------------------------------------
  'comp-10': {
    id: 'comp-10',
    componentNumber: 10,
    title: 'Common Errors, False Traps & Pitfalls',
    shortTitle: 'Common Errors',
    category: 'instruction',
    categoryLabel: 'Pitfalls & Traps',
    description: 'High-contrast incorrect vs correct exemplar pairs inoculating learners against high-frequency board examination traps.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['common_error', 'contrastive_pair', 'watch_out'],
    iconName: 'AlertTriangle',
    badgeColor: '#C29A52',
    pedagogicalRole: 'Inoculates learners against systematic errors, false attractions, and L1 interference patterns.',
    aiPromptConfig: {
      systemRole: 'Forensic Error Analysis Specialist & Board Chief Examiner',
      taskPromptTemplate: 'Generate 2–4 high-frequency common student errors for this topic with incorrect/correct pairs, underlying rationale, and prevention tips.',
      constraints: [
        'Highlight authentic errors frequently penalized on board examinations (not trivial typos).',
        'Provide incorrect sentence (with faulty element highlighted), correct sentence, mistake type classification, plain-English explanation of why students make the mistake, and how to avoid it.',
        'Teacher view receives diagnostic observations on student confusion sources.',
      ],
      expectedJsonFormat: `{
  "items": [
    {
      "id": "ce-1",
      "title": "False Attraction to Nearest Plural Noun",
      "incorrectSentence": "A collection of rare coins were sold yesterday.",
      "correctSentence": "A collection of rare coins was sold yesterday.",
      "mistakeType": "Proximity Trap / Agreement with Collective Head",
      "explanation": "Students instinctively look at 'coins' right next to the verb and supply a plural verb, forgetting that the grammatical subject is the singular head noun 'collection'.",
      "ruleAnchor": "Rule 1.2: A collective noun phrase acting as a single unit takes a singular finite verb.",
      "preventionTip": "Cross out prepositional phrases starting with 'of', 'in', or 'with' to reveal the true grammatical subject.",
      "frequency": "Critical Exam Trap",
      "teacherNote": "Over 45% of Class 6–8 students fall for proximity traps in diagnostic tests. Have students circle the prepositional phrase."
    }
  ]
}`,
    },
    validationRules: [
      {
        id: 'has-common-errors',
        label: 'At least one error pair authored',
        check: (ch) => {
          const c10Items = ch.component10?.items || [];
          const hasSectionBlocks = ch.sections.some((s) => s.blocks.some((b) => b.type === 'common_error' || b.type === 'watch_out'));
          const hasEndingMistakes = (ch.ending?.commonMistakes?.length || 0) > 0;
          return {
            valid: c10Items.length > 0 || hasSectionBlocks || hasEndingMistakes,
            message: 'At least one common error contrastive pair must be authored',
          };
        },
      },
      {
        id: 'pairs-complete',
        label: 'Incorrect and correct sentences both present',
        check: (ch) => {
          const c10Items = ch.component10?.items || [];
          if (c10Items.length === 0) return { valid: true };
          const allComplete = c10Items.every((item) => item.incorrectSentence?.trim() && item.correctSentence?.trim());
          return {
            valid: allComplete,
            message: 'Every error item must include both an incorrect exemplar and its verified correction',
          };
        },
      },
    ],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'common-error-rose',
      exportRendererId: 'common_errors',
    },
  },

  // -------------------------------------------------------------
  // VALIDATION COMPONENT C: COMP-11 / Tips & Remember Boxes
  // -------------------------------------------------------------
  'comp-11': {
    id: 'comp-11',
    componentNumber: 11,
    title: 'Remember / Quick Tip Boxes & Mnemonics',
    shortTitle: 'Tips & Mnemonics',
    category: 'instruction',
    categoryLabel: 'Memory Anchors',
    description: 'Bite-sized mnemonic devices, quick memory hooks, and highlighted golden rules for rapid retention.',
    defaultEstimatedPages: 0.25,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['tip_box', 'mnemonic', 'callout', 'formula'],
    iconName: 'Lightbulb',
    badgeColor: '#9A7438',
    pedagogicalRole: 'Provides cognitive hooks and memorable catchphrases facilitating rapid long-term memory retrieval.',
    aiPromptConfig: {
      systemRole: 'Mnemonic & Memory Retention Specialist',
      taskPromptTemplate: 'Generate 2–3 memorable quick tips, mnemonics, or golden rules for this topic.',
      constraints: [
        'Keep tips punchy, high-impact, and easy to memorize.',
        'Include tip type: Golden Rule, Mnemonic Hook, Exam Tip, or Shortcut.',
        'Optionally include quick formula or memory hook text.',
      ],
      expectedJsonFormat: `{
  "items": [
    {
      "id": "tip-1",
      "title": "The Finger Test for Prepositional Phrases",
      "tipType": "shortcut",
      "calloutText": "Cover the prepositional phrase between the subject and verb with your finger. Does the sentence still sound right? 'The box [of chocolates] IS heavy.'",
      "memoryHook": "Cover the phrase, reveal the base!",
      "quickFormula": "Subject + [Prepositional Modifier] + Finite Verb (Agrees with Subject)",
      "icon": "lightbulb",
      "importance": "high",
      "teacherNote": "Teach this as a standard proofreading habit before students submit assignments."
    }
  ]
}`,
    },
    validationRules: [
      {
        id: 'has-tips',
        label: 'At least one memory tip authored',
        check: (ch) => {
          const c11Items = ch.component11?.items || [];
          const hasSectionBlocks = ch.sections.some((s) => s.blocks.some((b) => b.type === 'tip' || b.type === 'remember' || b.type === 'exam_tip' || b.type === 'did_you_know' || (b.type as string) === 'tip_box'));
          const hasRememberPoints = (ch.revisionData?.rememberPoints?.length || 0) > 0;
          return {
            valid: c11Items.length > 0 || hasSectionBlocks || hasRememberPoints,
            message: 'At least one Remember or Quick Tip box must be authored',
          };
        },
      },
    ],
    exportRules: {
      headingLevel: 4,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'tip-gold-badge',
      exportRendererId: 'tips_view',
    },
  },

  // -------------------------------------------------------------
  // PRACTICE STAGE (COMP-12 to COMP-18)
  // -------------------------------------------------------------
  'comp-12': {
    id: 'comp-12',
    componentNumber: 12,
    title: 'Guided Practice Drills',
    shortTitle: 'Guided Practice',
    category: 'practice',
    categoryLabel: 'Scaffolded Practice',
    description: 'Immediate check-for-understanding exercises with teacher hints and partial scaffolding.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise', 'practice_drill'],
    iconName: 'FileText',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Low-stakes immediate transfer activity validating comprehension before independent exercises.',
    aiPromptConfig: {
      systemRole: 'Scaffolded Exercise Author',
      taskPromptTemplate: 'Create guided practice questions with supportive hints.',
      constraints: ['Provide hints for the first 2 questions', 'Scaffold step by step'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'guided_practice',
    },
  },

  'comp-13': {
    id: 'comp-13',
    componentNumber: 13,
    title: 'Exercise A: Recognition & Identification',
    shortTitle: 'Exercise A',
    category: 'practice',
    categoryLabel: 'Foundation Drills',
    description: 'Underlining, identifying, circling target structures.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'CheckSquare',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Bloom Level 1–2: Foundation recognition without production burden.',
    aiPromptConfig: {
      systemRole: 'Textbook Exercise Writer',
      taskPromptTemplate: 'Draft 5–10 identification and underlining questions.',
      constraints: ['Simple and clear instructions', 'Single target structure per item'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  'comp-14': {
    id: 'comp-14',
    componentNumber: 14,
    title: 'Exercise B: Fill in the Blanks / Selection',
    shortTitle: 'Exercise B',
    category: 'practice',
    categoryLabel: 'Understanding Drills',
    description: 'Choosing correct verb form, determiner, or pronoun from brackets.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'ListChecks',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Bloom Level 2: Discrete-item selection from bracketed choices.',
    aiPromptConfig: {
      systemRole: 'Textbook Exercise Writer',
      taskPromptTemplate: 'Draft 5–10 fill in the blanks questions with bracketed options.',
      constraints: ['Clear grammatical distractors', 'High sentence variety'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  'comp-15': {
    id: 'comp-15',
    componentNumber: 15,
    title: 'Exercise C: Sentence Rewriting & Transformation',
    shortTitle: 'Exercise C',
    category: 'practice',
    categoryLabel: 'Transformation',
    description: 'Transforming sentences according to instructions without changing original meaning.',
    defaultEstimatedPages: 1.0,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'RotateCcw',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Bloom Level 3–4: Syntactic flexibility and sentence synthesis.',
    aiPromptConfig: {
      systemRole: 'Transformation Assessment Designer',
      taskPromptTemplate: 'Draft 5–10 sentence transformation questions with clear instructions.',
      constraints: ['Follow board transformation patterns', 'Maintain semantic fidelity'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  'comp-16': {
    id: 'comp-16',
    componentNumber: 16,
    title: 'Exercise D: Error Correction & Editing',
    shortTitle: 'Exercise D',
    category: 'practice',
    categoryLabel: 'Error Analysis',
    description: 'Passage proofreading and error rectification detecting subtle syntactic flaws.',
    defaultEstimatedPages: 0.75,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'PenTool',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Bloom Level 4–5: Critical editing and error analysis.',
    aiPromptConfig: {
      systemRole: 'Proofreading & Editing Exercise Author',
      taskPromptTemplate: 'Draft editing passage with intentional errors to detect and correct.',
      constraints: ['One error per line or clear sentence errors', 'Authentic student errors'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  'comp-17': {
    id: 'comp-17',
    componentNumber: 17,
    title: 'Exercise E: Contextual Application & Composition',
    shortTitle: 'Exercise E',
    category: 'practice',
    categoryLabel: 'Application',
    description: 'Writing original sentences, completing dialogues, or drafting paragraphs deploying the target grammar.',
    defaultEstimatedPages: 1.0,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'Send',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Bloom Level 5–6: Productive communicative synthesis in authentic discourse.',
    aiPromptConfig: {
      systemRole: 'Communicative Composition Designer',
      taskPromptTemplate: 'Draft communicative writing prompts deploying target structures.',
      constraints: ['Real-world communicative context', 'Clear word length guidelines'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  'comp-18': {
    id: 'comp-18',
    componentNumber: 18,
    title: 'Additional Exercises & Practice Set',
    shortTitle: 'Extra Practice',
    category: 'practice',
    categoryLabel: 'Supplemental Practice',
    description: 'Extra practice sets for homework, remediation, and differentiated review.',
    defaultEstimatedPages: 1.0,
    isRequired: false,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['exercise'],
    iconName: 'Layers',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Provides extra homework banks and differentiated review drills.',
    aiPromptConfig: {
      systemRole: 'Supplemental Exercise Writer',
      taskPromptTemplate: 'Create additional tiered practice items.',
      constraints: ['Include easy, medium, and hard items'],
      expectedJsonFormat: '{ "questions": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'exercise_studio',
    },
  },

  // -------------------------------------------------------------
  // REVIEW & ASSESSMENT STAGE (COMP-19 to COMP-21)
  // -------------------------------------------------------------
  'comp-19': {
    id: 'comp-19',
    componentNumber: 19,
    title: 'Application / Olympiad Challenge Drill',
    shortTitle: 'Challenge',
    category: 'review',
    categoryLabel: 'Challenge & Enrichment',
    description: 'Higher-order cognitive analysis, irregular exceptions, and competitive linguistics puzzles.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['challenge', 'puzzle', 'exercise'],
    iconName: 'Award',
    badgeColor: '#C29A52',
    pedagogicalRole: 'Bloom Level 5–6: High-order brain teasers for gifted and talented enrichment.',
    aiPromptConfig: {
      systemRole: 'Linguistics Olympiad Problem Author',
      taskPromptTemplate: 'Draft 2–3 tricky grammar puzzles and higher-order challenges.',
      constraints: ['Deep syntactic ambiguity', 'Requires lateral grammatical reasoning'],
      expectedJsonFormat: '{ "challengeProblems": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 3,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      calloutBoxTheme: 'challenge-gold-box',
      exportRendererId: 'challenge_view',
    },
  },

  'comp-20': {
    id: 'comp-20',
    componentNumber: 20,
    title: 'Chapter Review & Rules at a Glance',
    shortTitle: 'Summary',
    category: 'review',
    categoryLabel: 'Consolidation',
    description: 'Comprehensive bullet-point review of all rules, checklists, and revision tables.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'structured_fields',
    supportedBlockTypes: ['summary_table', 'checklist'],
    iconName: 'Activity',
    badgeColor: '#9A7438',
    pedagogicalRole: 'Synthesizes all chapter rules into an easily revisable summary for pre-exam review.',
    aiPromptConfig: {
      systemRole: 'Revision Summary Author',
      taskPromptTemplate: 'Summarize all chapter rules into a quick-reference table and bullet points.',
      constraints: ['Concise rule statements', 'Include specimen example for each rule'],
      expectedJsonFormat: '{ "whatYouLearned": string[], "rulesAtAGlance": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'chapter_summary',
    },
  },

  'comp-21': {
    id: 'comp-21',
    componentNumber: 21,
    title: 'Chapter Assessment & Mastery Test',
    shortTitle: 'Mastery Test',
    category: 'assessment',
    categoryLabel: 'Formal Assessment',
    description: 'Standardized chapter test measuring retention, transfer, and syntactic precision with marks.',
    defaultEstimatedPages: 1.0,
    isRequired: true,
    targetAudience: 'both',
    editorType: 'specialised',
    supportedBlockTypes: ['test_section', 'graded_question'],
    iconName: 'GraduationCap',
    badgeColor: '#5A1832',
    pedagogicalRole: 'Summative chapter evaluation with formal rubric and board-pattern weightages.',
    aiPromptConfig: {
      systemRole: 'Standardized Assessment Architect',
      taskPromptTemplate: 'Generate a 25-mark chapter assessment test.',
      constraints: ['Include Section A (MCQs), Section B (FIB), Section C (Transformations)'],
      expectedJsonFormat: '{ "title": string, "totalMarks": number, "sections": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: true,
      includeInTeacherEdition: true,
      exportRendererId: 'chapter_assessment',
    },
  },

  // -------------------------------------------------------------
  // BACK MATTER & TEACHER RESOURCES (COMP-22 to COMP-23)
  // -------------------------------------------------------------
  'comp-22': {
    id: 'comp-22',
    componentNumber: 22,
    title: 'Complete Answer Key & Evaluation Rubrics',
    shortTitle: 'Answer Key',
    category: 'back_matter',
    categoryLabel: 'Answer Key',
    description: 'Complete answer keys, acceptable alternatives, and pedagogical rationales for all exercises.',
    defaultEstimatedPages: 0.5,
    isRequired: true,
    targetAudience: 'teacher', // Visible in Teacher Edition only by default
    editorType: 'specialised',
    supportedBlockTypes: ['answer_key_item'],
    iconName: 'Key',
    badgeColor: '#71685E',
    pedagogicalRole: 'Ensures teacher confidence and supports objective subjective evaluation.',
    aiPromptConfig: {
      systemRole: 'Answer Key Verifier',
      taskPromptTemplate: 'Generate exhaustive answer keys with grammar rationale.',
      constraints: ['Include acceptable alternatives', 'Provide grammar explanation for tricky items'],
      expectedJsonFormat: '{ "answerKey": any[] }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: false,
      includeInTeacherEdition: true,
      exportRendererId: 'answer_key',
    },
  },

  'comp-23': {
    id: 'comp-23',
    componentNumber: 23,
    title: 'Teacher Guide & Lesson Pacing Notes',
    shortTitle: 'Teacher Notes',
    category: 'back_matter',
    categoryLabel: 'Teacher Resource',
    description: 'Pedagogical guidance, period breakdown, common student pitfalls, and diagnostic strategies.',
    defaultEstimatedPages: 0.5,
    isRequired: false,
    targetAudience: 'teacher', // Teacher Edition only
    editorType: 'structured_fields',
    supportedBlockTypes: ['teacher_note', 'pacing_table'],
    iconName: 'FileQuestion',
    badgeColor: '#71685E',
    pedagogicalRole: 'Provides professional classroom pacing and remediation guidance for educators.',
    aiPromptConfig: {
      systemRole: 'Teacher Mentor & Curriculum Director',
      taskPromptTemplate: 'Draft lesson pacing recommendations and common confusion points.',
      constraints: ['Period-by-period breakdown', 'Diagnostic check questions'],
      expectedJsonFormat: '{ "teacherNotes": string }',
    },
    validationRules: [],
    exportRules: {
      headingLevel: 2,
      includeInStudentEdition: false,
      includeInTeacherEdition: true,
      exportRendererId: 'teacher_notes',
    },
  },
};

/**
 * Returns the definition for a given component ID (e.g. 'comp-7', 'comp-10', 'comp-11').
 * Falls back safely to comp-1 if not found.
 */
export function getComponentDefinition(id: string): ChapterComponentDefinition {
  return CHAPTER_COMPONENT_REGISTRY[id] || CHAPTER_COMPONENT_REGISTRY['comp-1'];
}

/**
 * Returns all definitions in canonical numerical order.
 */
export function getAllComponentDefinitions(): ChapterComponentDefinition[] {
  return Object.values(CHAPTER_COMPONENT_REGISTRY).sort(
    (a, b) => a.componentNumber - b.componentNumber
  );
}

/**
 * Returns all components belonging to a specific category.
 */
export function getComponentsByCategory(category: ComponentCategory): ChapterComponentDefinition[] {
  return getAllComponentDefinitions().filter((c) => c.category === category);
}
