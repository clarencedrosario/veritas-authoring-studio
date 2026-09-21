import {
  BoardQuestionBlueprint,
  BlueprintConceptWeightage,
  BlueprintQuestionSlot,
  BlueprintAuditReport,
  ConceptAuditResult,
  CognitiveLevel,
  GrammarQuestion,
  GrammarTestSeries,
  QuestionType,
} from '../types';

// ============================================================================
// PRECONFIGURED BOARD BLUEPRINTS
// ============================================================================

export const PRECONFIGURED_BOARD_BLUEPRINTS: BoardQuestionBlueprint[] = [
  // 1. CBSE Class 10 Section B Grammar (10 Marks / 12 Questions)
  {
    id: 'cbse_class10_sec_b',
    title: 'CBSE Class 10: Section B Grammar (10-Mark Standard)',
    board: 'CBSE',
    boardCode: 'CBSE-ENG-LANG-LIT-SEC-B-10',
    targetClass: 'Class 10',
    totalMarks: 10,
    totalDurationMinutes: 25,
    description:
      'Standard 10-mark English Language & Literature Section B Grammar test blueprint. Students are presented with 12 contextual questions and must attempt any 10.',
    officialSyllabusReference:
      'CBSE Curriculum 2025–26, Subject Code 184 (English Language and Literature), Section B: Grammar',
    markingSchemeGuidelines: [
      '1 mark awarded for each grammatically correct answer. No partial (0.5) marks.',
      'No penalty for minor spelling errors provided the target grammatical inflections/forms are correct.',
      'Dialogue reporting must strictly follow reported speech tense shift and pronoun concord rules.',
      'Questions 1 to 12 contain internal options; total maximum scored mark is 10.',
    ],
    conceptWeightages: [
      {
        id: 'cbse10-cw-1',
        conceptName: 'Reported Speech',
        strand: 'Syntax & Speech Shift',
        targetMarks: 3,
        minMarks: 2,
        maxMarks: 4,
        preferredQuestionTypes: ['transformation', 'fill_in_blanks'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Commands and requests, statements, and questions in dialogue contexts.',
        pedagogicalNotes:
          'Crucial board requirement: test change of pronoun, backshift of tense, and reporting verb nuances.',
      },
      {
        id: 'cbse10-cw-2',
        conceptName: 'Tenses & Verb Forms',
        strand: 'Verbs & Morphology',
        targetMarks: 2,
        minMarks: 2,
        maxMarks: 3,
        preferredQuestionTypes: ['fill_in_blanks', 'error_correction'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Past, present, and future contextual verb forms and sequence of tenses.',
        pedagogicalNotes: 'Contextual cloze or error spotting in narrative snippets.',
      },
      {
        id: 'cbse10-cw-3',
        conceptName: 'Subject-Verb Concord',
        strand: 'Syntax & Agreement',
        targetMarks: 2,
        minMarks: 1,
        maxMarks: 3,
        preferredQuestionTypes: ['error_correction', 'fill_in_blanks'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Compound subjects, quantifiers (either/neither, each of), collective nouns.',
        pedagogicalNotes: 'Frequently tested via error identification in formal signage or public announcements.',
      },
      {
        id: 'cbse10-cw-4',
        conceptName: 'Modals',
        strand: 'Verbs & Morphology',
        targetMarks: 2,
        minMarks: 1,
        maxMarks: 2,
        preferredQuestionTypes: ['mcq', 'fill_in_blanks'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
        syllabusScopeRef: 'Modal auxiliaries: obligation, permission, probability, advisory (ought to, must, might).',
        pedagogicalNotes: 'Focus on communicative intent and degrees of politeness or necessity.',
      },
      {
        id: 'cbse10-cw-5',
        conceptName: 'Determiners & Articles',
        strand: 'Parts of Speech',
        targetMarks: 1,
        minMarks: 1,
        maxMarks: 2,
        preferredQuestionTypes: ['fill_in_blanks', 'mcq'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
        syllabusScopeRef: 'Quantifiers (much/many, little/few), articles, and demonstratives.',
        pedagogicalNotes: 'Tests countability vs. uncountability nuances in authentic contexts.',
      },
    ],
    questionSlots: [
      {
        id: 'cbse10-qs-1',
        slotCode: 'Sec B - Q1(i)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Tenses & Verb Forms',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
        internalChoiceAvailable: true,
        choiceNote: 'Item 1 of 12',
        sampleQuestionPrompt:
          'Fill in the blank by choosing the correct option to complete the weather report: "According to meteorologists, the coastal districts ______ (experience / have experienced) sporadic thunderstorms since yesterday morning."',
      },
      {
        id: 'cbse10-qs-2',
        slotCode: 'Sec B - Q1(ii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        internalChoiceAvailable: true,
        choiceNote: 'Item 2 of 12',
        sampleQuestionPrompt:
          'Read the conversation between a librarian and an applicant. Report the librarian\'s question: Librarian: "Have you registered your student ID on the national digital portal?" The librarian enquired of the applicant ______.',
      },
      {
        id: 'cbse10-qs-3',
        slotCode: 'Sec B - Q1(iii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Subject-Verb Concord',
        questionType: 'error_correction',
        marks: 1,
        cognitiveLevel: 'Analysing',
        internalChoiceAvailable: true,
        choiceNote: 'Item 3 of 12',
        sampleQuestionPrompt:
          'Identify the error and supply the correction in the school circular: "A team of young robotics researchers along with their mentor have developed an automated waste sorter." [Error: have -> Correction: has]',
      },
      {
        id: 'cbse10-qs-4',
        slotCode: 'Sec B - Q1(iv)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Modals',
        questionType: 'mcq',
        marks: 1,
        cognitiveLevel: 'Understanding',
        internalChoiceAvailable: true,
        choiceNote: 'Item 4 of 12',
        sampleQuestionPrompt:
          'Select the correct modal auxiliary to complete the advisory sign: "Visitors ______ (shall / must / might / would) surrender all magnetic items before entering the MRI observation chamber."',
      },
      {
        id: 'cbse10-qs-5',
        slotCode: 'Sec B - Q1(v)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Determiners & Articles',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
        internalChoiceAvailable: true,
        choiceNote: 'Item 5 of 12',
        sampleQuestionPrompt:
          'Complete the line from a magazine article: "Despite their best efforts, ______ (few / little / many) progress was achieved before dusk fell."',
      },
      {
        id: 'cbse10-qs-6',
        slotCode: 'Sec B - Q1(vi)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        internalChoiceAvailable: true,
        choiceNote: 'Item 6 of 12',
        sampleQuestionPrompt:
          'Report the dialogue: Teacher: "Submit your science portfolios by Wednesday." The teacher instructed the students ______.',
      },
      {
        id: 'cbse10-qs-7',
        slotCode: 'Sec B - Q1(vii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Tenses & Verb Forms',
        questionType: 'error_correction',
        marks: 1,
        cognitiveLevel: 'Analysing',
        internalChoiceAvailable: true,
        choiceNote: 'Item 7 of 12',
        sampleQuestionPrompt:
          'Identify the error and supply correction: "Last century, scientists believe that continental plates were fixed." [Error: believe -> Correction: believed]',
      },
      {
        id: 'cbse10-qs-8',
        slotCode: 'Sec B - Q1(viii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Subject-Verb Concord',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
        internalChoiceAvailable: true,
        choiceNote: 'Item 8 of 12',
        sampleQuestionPrompt:
          'Fill in the blank with the correct verb form: "Neither the captain nor the crew members ______ (was / were) aware of the submerged reef."',
      },
      {
        id: 'cbse10-qs-9',
        slotCode: 'Sec B - Q1(ix)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        internalChoiceAvailable: true,
        choiceNote: 'Item 9 of 12',
        sampleQuestionPrompt:
          'Father to son: "Why are you staying up so late tonight?" Father enquired of his son why he was staying up so late that night.',
      },
      {
        id: 'cbse10-qs-10',
        slotCode: 'Sec B - Q1(x)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Modals',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
        internalChoiceAvailable: true,
        choiceNote: 'Item 10 of 12',
        sampleQuestionPrompt:
          'Complete the civic slogan: "Citizens ______ (ought to / can / might) protect public heritage monuments from vandalism."',
      },
      {
        id: 'cbse10-qs-11',
        slotCode: 'Sec B - Q1(xi)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
        internalChoiceAvailable: true,
        choiceNote: 'Item 11 of 12',
        sampleQuestionPrompt:
          'The detective asked the guard: "Did anyone enter this courtyard after 10 PM?" The detective enquired whether anyone had entered that courtyard after 10 PM.',
      },
      {
        id: 'cbse10-qs-12',
        slotCode: 'Sec B - Q1(xii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Determiners & Articles',
        questionType: 'mcq',
        marks: 1,
        cognitiveLevel: 'Understanding',
        internalChoiceAvailable: true,
        choiceNote: 'Item 12 of 12',
        sampleQuestionPrompt:
          'Choose the correct quantifier: "He has ______ (little / few / many) doubt that his team will qualify for the finals."',
      },
    ],
  },

  // 2. CBSE Class 9 Section B Grammar (10-Mark Standard)
  {
    id: 'cbse_class9_sec_b',
    title: 'CBSE Class 9: Section B Grammar (10-Mark Standard)',
    board: 'CBSE',
    boardCode: 'CBSE-ENG-LANG-LIT-SEC-B-C9',
    targetClass: 'Class 9',
    totalMarks: 10,
    totalDurationMinutes: 25,
    description:
      'CBSE Class 9 Section B Integrated Grammar blueprint matching board testing parameters (12 questions testing Tenses, Modals, Subject-Verb Agreement, Reported Speech, and Determiners).',
    officialSyllabusReference:
      'CBSE Secondary School Curriculum (Class 9), English Language & Literature (184)',
    markingSchemeGuidelines: [
      '1 mark per correct question. Any 10 out of 12 questions to be attempted.',
      'Focus on contextual usage in continuous notices, short diaries, and dialogue excerpts.',
    ],
    conceptWeightages: [
      {
        id: 'cbse9-cw-1',
        conceptName: 'Tenses & Verb Forms',
        strand: 'Verbs & Morphology',
        targetMarks: 3,
        minMarks: 2,
        maxMarks: 3,
        preferredQuestionTypes: ['fill_in_blanks', 'error_correction'],
        cognitiveLevel: 'Applying',
        mandatory: true,
      },
      {
        id: 'cbse9-cw-2',
        conceptName: 'Modals',
        strand: 'Verbs & Morphology',
        targetMarks: 2,
        minMarks: 1,
        maxMarks: 2,
        preferredQuestionTypes: ['mcq', 'fill_in_blanks'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
      },
      {
        id: 'cbse9-cw-3',
        conceptName: 'Subject-Verb Concord',
        strand: 'Syntax & Agreement',
        targetMarks: 2,
        minMarks: 1,
        maxMarks: 2,
        preferredQuestionTypes: ['error_correction', 'fill_in_blanks'],
        cognitiveLevel: 'Applying',
        mandatory: true,
      },
      {
        id: 'cbse9-cw-4',
        conceptName: 'Reported Speech',
        strand: 'Syntax & Speech Shift',
        targetMarks: 2,
        minMarks: 2,
        maxMarks: 3,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Applying',
        mandatory: true,
      },
      {
        id: 'cbse9-cw-5',
        conceptName: 'Determiners & Articles',
        strand: 'Parts of Speech',
        targetMarks: 1,
        minMarks: 1,
        maxMarks: 2,
        preferredQuestionTypes: ['fill_in_blanks'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
      },
    ],
    questionSlots: [
      {
        id: 'cbse9-qs-1',
        slotCode: 'Sec B - Q1(i)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Tenses & Verb Forms',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'cbse9-qs-2',
        slotCode: 'Sec B - Q1(ii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Modals',
        questionType: 'mcq',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'cbse9-qs-3',
        slotCode: 'Sec B - Q1(iii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Subject-Verb Concord',
        questionType: 'error_correction',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'cbse9-qs-4',
        slotCode: 'Sec B - Q1(iv)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'cbse9-qs-5',
        slotCode: 'Sec B - Q1(v)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Determiners & Articles',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'cbse9-qs-6',
        slotCode: 'Sec B - Q1(vi)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Tenses & Verb Forms',
        questionType: 'error_correction',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'cbse9-qs-7',
        slotCode: 'Sec B - Q1(vii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Modals',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'cbse9-qs-8',
        slotCode: 'Sec B - Q1(viii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Subject-Verb Concord',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'cbse9-qs-9',
        slotCode: 'Sec B - Q1(ix)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'cbse9-qs-10',
        slotCode: 'Sec B - Q1(x)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Tenses & Verb Forms',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'cbse9-qs-11',
        slotCode: 'Sec B - Q1(xi)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Reported Speech',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'cbse9-qs-12',
        slotCode: 'Sec B - Q1(xii)',
        sectionTitle: 'Section B: Grammar (Attempt any 10 of 12)',
        conceptTested: 'Determiners & Articles',
        questionType: 'mcq',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
    ],
  },

  // 3. ICSE Class 10 English Language (Paper 1) - Question 5: Functional Grammar (20 Marks)
  {
    id: 'icse_class10_q5',
    title: 'ICSE Class 10: Question 5 Functional Grammar (20-Mark Standard)',
    board: 'ICSE',
    boardCode: 'ICSE-ENG-PAP1-Q5-20M',
    targetClass: 'Class 10',
    totalMarks: 20,
    totalDurationMinutes: 40,
    description:
      'Rigorous 20-mark Functional Grammar Question 5 blueprint from ICSE English Language (Paper 1). All sub-questions 5(a), 5(b), 5(c), and 5(d) are compulsory.',
    officialSyllabusReference:
      'CISCE Regulations and Syllabuses, ICSE Class X English Language (Paper 1), Question 5',
    markingSchemeGuidelines: [
      'Question 5(a): Verb Conjugation (4 marks, 8 blanks x 1/2 mark). Exact grammatical form required.',
      'Question 5(b): Prepositions & Phrasal Verbs (4 marks, 8 sentences x 1/2 mark). Single appropriate preposition.',
      'Question 5(c): Sentence Synthesis (4 marks, 4 items x 1 mark). Must join without using "and", "but", or "so". Zero marks if words are used or comma splice occurs.',
      'Question 5(d): Sentence Transformation (8 marks, 8 items x 1 mark). Exact instruction followed (Voice, Speech, Degrees, Conditionals, No sooner/Hardly, etc.) without changing sentence meaning.',
    ],
    conceptWeightages: [
      {
        id: 'icse10-cw-1',
        conceptName: 'Tenses & Verb Conjugation',
        strand: 'Verbs & Morphology',
        targetMarks: 4,
        minMarks: 4,
        maxMarks: 4,
        preferredQuestionTypes: ['fill_in_blanks'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Q5(a) Continuous narrative passage with 8 numbered blanks.',
        pedagogicalNotes: 'Assesses mastery of sequence of tenses, active vs. passive participles, and conditional forms.',
      },
      {
        id: 'icse10-cw-2',
        conceptName: 'Prepositions & Phrasal Verbs',
        strand: 'Parts of Speech & Idiomatic Function',
        targetMarks: 4,
        minMarks: 4,
        maxMarks: 4,
        preferredQuestionTypes: ['fill_in_blanks'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
        syllabusScopeRef: 'Q5(b) 8 separate sentences with missing prepositions / phrasal particles.',
        pedagogicalNotes: 'Strict examination of dependent prepositions (e.g., cope with, prevent from, look into).',
      },
      {
        id: 'icse10-cw-3',
        conceptName: 'Sentence Synthesis (No and/but/so)',
        strand: 'Syntax & Clauses',
        targetMarks: 4,
        minMarks: 4,
        maxMarks: 4,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Analysing',
        mandatory: true,
        syllabusScopeRef: 'Q5(c) 4 pairs of independent clauses synthesized into a single cohesive sentence.',
        pedagogicalNotes: 'Demands use of participles, infinitives, relative pronouns, adversative coordinators (though/yet), or noun clauses.',
      },
      {
        id: 'icse10-cw-4',
        conceptName: 'Sentence Transformation as Directed',
        strand: 'Syntax & Stylistics',
        targetMarks: 8,
        minMarks: 8,
        maxMarks: 8,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Q5(d) 8 distinct transformation patterns prescribed in ICSE marking keys.',
        pedagogicalNotes: 'Includes Voice, Reported Speech, Comparative/Superlative, Conditionals (If/Unless), Inversion (No sooner...than / Hardly...when), and Too...to -> So...that.',
      },
    ],
    questionSlots: [
      // 5(a) Verb forms (8 items x 0.5m = 4m)
      {
        id: 'icse10-slot-5a',
        slotCode: 'Question 5(a)',
        sectionTitle: 'Question 5(a): Verb Conjugation Passage (4 Marks)',
        conceptTested: 'Tenses & Verb Conjugation',
        questionType: 'fill_in_blanks',
        marks: 4,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Fill in each of the numbered blanks with the correct form of the word given in brackets. Do not copy the passage, but write in correct serial order the word appropriate to the blank space: "The mountaineers (1) ______ (struggle) through the blizzard when suddenly a crevasse (2) ______ (open) before them..."',
      },
      // 5(b) Prepositions (8 items x 0.5m = 4m)
      {
        id: 'icse10-slot-5b',
        slotCode: 'Question 5(b)',
        sectionTitle: 'Question 5(b): Prepositions & Phrasal Verbs (4 Marks)',
        conceptTested: 'Prepositions & Phrasal Verbs',
        questionType: 'fill_in_blanks',
        marks: 4,
        cognitiveLevel: 'Understanding',
        sampleQuestionPrompt:
          'Fill in the blanks with appropriate prepositions: (i) The committee decided to look ______ the matter immediately. (ii) He was prevented ______ entering the council chamber.',
      },
      // 5(c) Synthesis (4 items x 1m = 4m)
      {
        id: 'icse10-slot-5c',
        slotCode: 'Question 5(c)',
        sectionTitle: 'Question 5(c): Sentence Synthesis (4 Marks)',
        conceptTested: 'Sentence Synthesis (No and/but/so)',
        questionType: 'transformation',
        marks: 4,
        cognitiveLevel: 'Analysing',
        sampleQuestionPrompt:
          'Join the following sentences to make one complete sentence without using "and", "but", or "so": (1) The bell rang. The students rushed out of their classrooms. (2) He ran as fast as he could. He could not overtake the leader.',
      },
      // 5(d) Transformations (8 items x 1m = 8m)
      {
        id: 'icse10-slot-5d-1',
        slotCode: 'Question 5(d)(i)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 1)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "As soon as the minister entered the hall, the audience stood up." (Begin: No sooner...)',
      },
      {
        id: 'icse10-slot-5d-2',
        slotCode: 'Question 5(d)(ii)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 2)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "He is too proud to acknowledge his fault." (Use: so...that)',
      },
      {
        id: 'icse10-slot-5d-3',
        slotCode: 'Question 5(d)(iii)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 3)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "The teacher said to Vikram, \'Did you write this essay on your own?\'" (Begin: The teacher enquired...)',
      },
      {
        id: 'icse10-slot-5d-4',
        slotCode: 'Question 5(d)(iv)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 4)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "No other sovereign in history was as benevolent as Emperor Ashoka." (End: ...benevolent of all sovereigns.)',
      },
      {
        id: 'icse10-slot-5d-5',
        slotCode: 'Question 5(d)(v)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 5)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "If you do not register before noon, you will forfeit your seat." (Begin: Unless...)',
      },
      {
        id: 'icse10-slot-5d-6',
        slotCode: 'Question 5(d)(vi)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 6)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "The architects designed an earthquake-resistant tower." (Begin: An earthquake-resistant tower...)',
      },
      {
        id: 'icse10-slot-5d-7',
        slotCode: 'Question 5(d)(vii)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 7)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "Hardly had the whistle blown when the match restarted." (Begin: Scarcely...)',
      },
      {
        id: 'icse10-slot-5d-8',
        slotCode: 'Question 5(d)(viii)',
        sectionTitle: 'Question 5(d): Transformation as Directed (Item 8)',
        conceptTested: 'Sentence Transformation as Directed',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
        sampleQuestionPrompt:
          'Rewrite as directed: "Everyone admitted that the new library was a magnificent structure." (Begin: No one...)',
      },
    ],
  },

  // 4. Cambridge Lower Secondary Checkpoint (15 Marks)
  {
    id: 'cambridge_checkpoint_sec',
    title: 'Cambridge Checkpoint: Lower Secondary Grammar & Language Mechanics (15-Mark Standard)',
    board: 'Cambridge_Checkpoint',
    boardCode: 'CAMB-CHECKPOINT-ESL-15M',
    targetClass: 'Class 8',
    totalMarks: 15,
    totalDurationMinutes: 30,
    description:
      'Cambridge Lower Secondary Checkpoint language mechanics blueprint assessing lexical grammar, morphological word building, syntactic combinations, and key-word transformations.',
    officialSyllabusReference:
      'Cambridge Lower Secondary Curriculum Framework, English as a Second Language (0861) / First Language English',
    markingSchemeGuidelines: [
      '1 mark per correct lexical or syntactic item.',
      'Key word transformations: 1 or 2 marks based on grammatical structure accuracy (do not change given word).',
      'Spelling of derived words (prefixes/suffixes) must be 100% accurate.',
    ],
    conceptWeightages: [
      {
        id: 'camb-cw-1',
        conceptName: 'Word Formation & Affixes',
        strand: 'Morphology & Lexis',
        targetMarks: 4,
        minMarks: 3,
        maxMarks: 5,
        preferredQuestionTypes: ['fill_in_blanks'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Derivation of nouns, adjectives, and adverbs from root words.',
        pedagogicalNotes: 'E.g., compete -> competitive / competition, courage -> encourage.',
      },
      {
        id: 'camb-cw-2',
        conceptName: 'Relative Clauses & Connectors',
        strand: 'Syntax & Clauses',
        targetMarks: 4,
        minMarks: 3,
        maxMarks: 5,
        preferredQuestionTypes: ['transformation', 'mcq'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
        syllabusScopeRef: 'Defining and non-defining relative pronouns (who, which, whose, where) and cohesive conjunctions.',
      },
      {
        id: 'camb-cw-3',
        conceptName: 'Tenses & Passive Structures',
        strand: 'Verbs & Morphology',
        targetMarks: 4,
        minMarks: 3,
        maxMarks: 5,
        preferredQuestionTypes: ['fill_in_blanks', 'transformation'],
        cognitiveLevel: 'Applying',
        mandatory: true,
        syllabusScopeRef: 'Passive voice with modals, present perfect continuous, past perfect.',
      },
      {
        id: 'camb-cw-4',
        conceptName: 'Key Word Transformation',
        strand: 'Syntax & Stylistics',
        targetMarks: 3,
        minMarks: 3,
        maxMarks: 4,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Analysing',
        mandatory: true,
        syllabusScopeRef: 'Complete second sentence using given key word in 2 to 5 words.',
      },
    ],
    questionSlots: [
      {
        id: 'camb-slot-1',
        slotCode: 'Checkpoint Part 1(i)',
        sectionTitle: 'Part 1: Word Formation & Vocabulary',
        conceptTested: 'Word Formation & Affixes',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-2',
        slotCode: 'Checkpoint Part 1(ii)',
        sectionTitle: 'Part 1: Word Formation & Vocabulary',
        conceptTested: 'Word Formation & Affixes',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-3',
        slotCode: 'Checkpoint Part 1(iii)',
        sectionTitle: 'Part 1: Word Formation & Vocabulary',
        conceptTested: 'Word Formation & Affixes',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-4',
        slotCode: 'Checkpoint Part 1(iv)',
        sectionTitle: 'Part 1: Word Formation & Vocabulary',
        conceptTested: 'Word Formation & Affixes',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-5',
        slotCode: 'Checkpoint Part 2(i)',
        sectionTitle: 'Part 2: Relative Clauses & Connectors',
        conceptTested: 'Relative Clauses & Connectors',
        questionType: 'mcq',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'camb-slot-6',
        slotCode: 'Checkpoint Part 2(ii)',
        sectionTitle: 'Part 2: Relative Clauses & Connectors',
        conceptTested: 'Relative Clauses & Connectors',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'camb-slot-7',
        slotCode: 'Checkpoint Part 2(iii)',
        sectionTitle: 'Part 2: Relative Clauses & Connectors',
        conceptTested: 'Relative Clauses & Connectors',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'camb-slot-8',
        slotCode: 'Checkpoint Part 2(iv)',
        sectionTitle: 'Part 2: Relative Clauses & Connectors',
        conceptTested: 'Relative Clauses & Connectors',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'camb-slot-9',
        slotCode: 'Checkpoint Part 3(i)',
        sectionTitle: 'Part 3: Tenses & Passive Structures',
        conceptTested: 'Tenses & Passive Structures',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-10',
        slotCode: 'Checkpoint Part 3(ii)',
        sectionTitle: 'Part 3: Tenses & Passive Structures',
        conceptTested: 'Tenses & Passive Structures',
        questionType: 'fill_in_blanks',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-11',
        slotCode: 'Checkpoint Part 3(iii)',
        sectionTitle: 'Part 3: Tenses & Passive Structures',
        conceptTested: 'Tenses & Passive Structures',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-12',
        slotCode: 'Checkpoint Part 3(iv)',
        sectionTitle: 'Part 3: Tenses & Passive Structures',
        conceptTested: 'Tenses & Passive Structures',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'camb-slot-13',
        slotCode: 'Checkpoint Part 4(i)',
        sectionTitle: 'Part 4: Key Word Transformation',
        conceptTested: 'Key Word Transformation',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'camb-slot-14',
        slotCode: 'Checkpoint Part 4(ii)',
        sectionTitle: 'Part 4: Key Word Transformation',
        conceptTested: 'Key Word Transformation',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'camb-slot-15',
        slotCode: 'Checkpoint Part 4(iii)',
        sectionTitle: 'Part 4: Key Word Transformation',
        conceptTested: 'Key Word Transformation',
        questionType: 'transformation',
        marks: 1,
        cognitiveLevel: 'Analysing',
      },
    ],
  },

  // 5. Middle School Integrated Grammar (15 Marks)
  {
    id: 'middle_school_integrated_15',
    title: 'Middle School (Class 6–8): Integrated Grammar Assessment (15-Mark Standard)',
    board: 'State_Board',
    boardCode: 'MID-SCH-INT-GRAM-15M',
    targetClass: 'Class 7',
    totalMarks: 15,
    totalDurationMinutes: 35,
    description:
      'Balanced middle-school integrated grammar blueprint covering Error Editing, Sentence Reordering, Cloze Gap Filling, and Active-Passive Foundations.',
    officialSyllabusReference:
      'General Middle School English Curriculum (Classes 6 to 8)',
    markingSchemeGuidelines: [
      'Error Editing: 1 mark per correct identification and correction pair.',
      'Sentence Reordering: 1 mark per grammatically coherent sentence.',
      'Gap Filling: 1 mark per blank.',
    ],
    conceptWeightages: [
      {
        id: 'mid-cw-1',
        conceptName: 'Error Editing & Omission',
        strand: 'Syntax & Accuracy',
        targetMarks: 5,
        minMarks: 4,
        maxMarks: 6,
        preferredQuestionTypes: ['error_correction'],
        cognitiveLevel: 'Analysing',
        mandatory: true,
      },
      {
        id: 'mid-cw-2',
        conceptName: 'Jumbled Words & Sentence Reordering',
        strand: 'Syntax & Word Order',
        targetMarks: 4,
        minMarks: 3,
        maxMarks: 5,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Applying',
        mandatory: true,
      },
      {
        id: 'mid-cw-3',
        conceptName: 'Prepositions & Determiners Cloze',
        strand: 'Parts of Speech',
        targetMarks: 3,
        minMarks: 2,
        maxMarks: 4,
        preferredQuestionTypes: ['fill_in_blanks'],
        cognitiveLevel: 'Understanding',
        mandatory: true,
      },
      {
        id: 'mid-cw-4',
        conceptName: 'Voice Transformation (Active / Passive)',
        strand: 'Verbs & Voice',
        targetMarks: 3,
        minMarks: 2,
        maxMarks: 4,
        preferredQuestionTypes: ['transformation'],
        cognitiveLevel: 'Applying',
        mandatory: false,
      },
    ],
    questionSlots: [
      {
        id: 'mid-qs-1',
        slotCode: 'Sec A - Q1 (Editing)',
        sectionTitle: 'Section A: Error Correction',
        conceptTested: 'Error Editing & Omission',
        questionType: 'error_correction',
        marks: 5,
        cognitiveLevel: 'Analysing',
      },
      {
        id: 'mid-qs-2',
        slotCode: 'Sec B - Q2 (Reordering)',
        sectionTitle: 'Section B: Sentence Reordering',
        conceptTested: 'Jumbled Words & Sentence Reordering',
        questionType: 'transformation',
        marks: 4,
        cognitiveLevel: 'Applying',
      },
      {
        id: 'mid-qs-3',
        slotCode: 'Sec C - Q3 (Cloze)',
        sectionTitle: 'Section C: Cloze Gap-Fill',
        conceptTested: 'Prepositions & Determiners Cloze',
        questionType: 'fill_in_blanks',
        marks: 3,
        cognitiveLevel: 'Understanding',
      },
      {
        id: 'mid-qs-4',
        slotCode: 'Sec D - Q4 (Voice)',
        sectionTitle: 'Section D: Voice Transformation',
        conceptTested: 'Voice Transformation (Active / Passive)',
        questionType: 'transformation',
        marks: 3,
        cognitiveLevel: 'Applying',
      },
    ],
  },
];

// ============================================================================
// CONCEPT HEURISTICS & AUTO-DETECTION
// ============================================================================

export function detectQuestionConcept(
  q: GrammarQuestion,
  blueprint: BoardQuestionBlueprint
): string {
  if (q.conceptTested) return q.conceptTested;

  const haystack = `${q.prompt} ${q.instruction || ''} ${q.explanation || ''} ${q.correctAnswer || ''}`.toLowerCase();
  const conceptWeightages = blueprint.conceptWeightages || [];

  // Try matching directly to one of the blueprint's defined concept weightages
  for (const cw of conceptWeightages) {
    const cName = cw.conceptName.toLowerCase();
    const words = cName.split(/[\s/&,-]+/).filter((w) => w.length > 3);
    if (words.some((w) => haystack.includes(w))) {
      return cw.conceptName;
    }
  }

  // Fallback heuristic rules
  if (
    haystack.includes('reported speech') ||
    haystack.includes('direct') ||
    haystack.includes('indirect') ||
    haystack.includes('said that') ||
    haystack.includes('enquired') ||
    haystack.includes('asked whether')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('reported') || c.conceptName.toLowerCase().includes('speech')
    );
    if (match) return match.conceptName;
    return 'Reported Speech';
  }

  if (
    haystack.includes('preposition') ||
    haystack.includes('phrasal verb') ||
    haystack.includes('into') ||
    haystack.includes('prevented from') ||
    haystack.includes('cope with')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('preposition')
    );
    if (match) return match.conceptName;
    return 'Prepositions & Phrasal Verbs';
  }

  if (
    haystack.includes('concord') ||
    haystack.includes('subject-verb') ||
    haystack.includes('subject verb') ||
    haystack.includes('neither the') ||
    haystack.includes('along with')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('concord') || c.conceptName.toLowerCase().includes('agreement')
    );
    if (match) return match.conceptName;
    return 'Subject-Verb Concord';
  }

  if (
    haystack.includes('modal') ||
    haystack.includes('ought to') ||
    haystack.includes('must /') ||
    haystack.includes('should /') ||
    haystack.includes('might')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('modal')
    );
    if (match) return match.conceptName;
    return 'Modals';
  }

  if (
    haystack.includes('determiner') ||
    haystack.includes('article') ||
    haystack.includes('quantifier') ||
    haystack.includes('little / few') ||
    haystack.includes('much / many')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('determiner') || c.conceptName.toLowerCase().includes('article')
    );
    if (match) return match.conceptName;
    return 'Determiners & Articles';
  }

  if (
    haystack.includes('synthesis') ||
    haystack.includes('without using and') ||
    haystack.includes('without and') ||
    haystack.includes('join the sentences')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('synthesis') || c.conceptName.toLowerCase().includes('clauses')
    );
    if (match) return match.conceptName;
    return 'Sentence Synthesis (No and/but/so)';
  }

  if (
    haystack.includes('passive') ||
    haystack.includes('active voice') ||
    haystack.includes('voice')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('voice') || c.conceptName.toLowerCase().includes('transformation')
    );
    if (match) return match.conceptName;
    return 'Voice Transformation (Active / Passive)';
  }

  if (
    haystack.includes('affix') ||
    haystack.includes('suffix') ||
    haystack.includes('prefix') ||
    haystack.includes('word formation')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('formation') || c.conceptName.toLowerCase().includes('affix')
    );
    if (match) return match.conceptName;
    return 'Word Formation & Affixes';
  }

  if (
    haystack.includes('editing') ||
    haystack.includes('error') ||
    haystack.includes('omission')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('edit') || c.conceptName.toLowerCase().includes('error')
    );
    if (match) return match.conceptName;
    return 'Error Editing & Omission';
  }

  if (
    haystack.includes('tense') ||
    haystack.includes('past simple') ||
    haystack.includes('present perfect') ||
    haystack.includes('verb')
  ) {
    const match = conceptWeightages.find(
      (c) => c.conceptName.toLowerCase().includes('tense') || c.conceptName.toLowerCase().includes('verb')
    );
    if (match) return match.conceptName;
    return 'Tenses & Verb Forms';
  }

  // Default to the first concept in the blueprint
  return conceptWeightages[0]?.conceptName || 'General Grammar';
}

// ============================================================================
// REAL-TIME AUDIT ENGINE
// ============================================================================

export function auditTestPaperAgainstBlueprint(
  blueprint: BoardQuestionBlueprint,
  questions: GrammarQuestion[]
): BlueprintAuditReport {
  const conceptWeightages = blueprint.conceptWeightages || [];
  const safeQuestions = questions || [];

  // Aggregate assigned marks by concept
  const conceptMarksMap: Record<string, { marks: number; questionCount: number; questionIds: string[] }> = {};
  const questionTypeStats: Record<string, { count: number; marks: number; percentage: number }> = {};
  const cognitiveStats: Record<CognitiveLevel, { marks: number; percentage: number }> = {
    Remembering: { marks: 0, percentage: 0 },
    Understanding: { marks: 0, percentage: 0 },
    Applying: { marks: 0, percentage: 0 },
    Analysing: { marks: 0, percentage: 0 },
    Evaluating: { marks: 0, percentage: 0 },
    Creating: { marks: 0, percentage: 0 },
  };

  conceptWeightages.forEach((cw) => {
    conceptMarksMap[cw.conceptName] = { marks: 0, questionCount: 0, questionIds: [] };
  });

  let totalAssignedMarks = 0;

  safeQuestions.forEach((q) => {
    const assignedMarks = q.marks || 1;
    totalAssignedMarks += assignedMarks;

    const detectedConcept = detectQuestionConcept(q, blueprint);

    if (!conceptMarksMap[detectedConcept]) {
      conceptMarksMap[detectedConcept] = { marks: 0, questionCount: 0, questionIds: [] };
    }
    conceptMarksMap[detectedConcept].marks += assignedMarks;
    conceptMarksMap[detectedConcept].questionCount += 1;
    conceptMarksMap[detectedConcept].questionIds.push(q.id);

    // Question type tracking
    const qType = q.type || 'short_answer';
    if (!questionTypeStats[qType]) {
      questionTypeStats[qType] = { count: 0, marks: 0, percentage: 0 };
    }
    questionTypeStats[qType].count += 1;
    questionTypeStats[qType].marks += assignedMarks;

    // Cognitive tracking
    const cog: CognitiveLevel = q.cognitiveLevel || 'Applying';
    cognitiveStats[cog].marks += assignedMarks;
  });

  // Calculate percentages
  if (totalAssignedMarks > 0) {
    Object.keys(questionTypeStats).forEach((k) => {
      questionTypeStats[k].percentage = Math.round(
        (questionTypeStats[k].marks / totalAssignedMarks) * 100
      );
    });
    (Object.keys(cognitiveStats) as CognitiveLevel[]).forEach((cog) => {
      cognitiveStats[cog].percentage = Math.round(
        (cognitiveStats[cog].marks / totalAssignedMarks) * 100
      );
    });
  }

  // Concept-by-concept analysis
  const conceptsAudit: ConceptAuditResult[] = [];
  const overTestedConcepts: ConceptAuditResult[] = [];
  const underTestedConcepts: ConceptAuditResult[] = [];
  const missingMandatoryConcepts: ConceptAuditResult[] = [];

  let complianceWeightedPoints = 0;
  const maxCompliancePoints = Math.max(1, conceptWeightages.length * 10);

  conceptWeightages.forEach((cw) => {
    const record = conceptMarksMap[cw.conceptName] || { marks: 0, questionCount: 0, questionIds: [] };
    const diff = record.marks - cw.targetMarks;

    let status: 'balanced' | 'over_tested' | 'under_tested' | 'missing' = 'balanced';
    let recommendation = `Concept mark distribution aligns with ${blueprint.board} specifications.`;

    if (record.marks === 0 && cw.targetMarks > 0) {
      status = 'missing';
      recommendation = cw.mandatory
        ? `CRITICAL: Mandatory ${blueprint.board} requirement missing! Add ${cw.targetMarks} marks of ${cw.conceptName}.`
        : `Deficit: Add questions on ${cw.conceptName} to satisfy target ${cw.targetMarks} marks.`;
      if (cw.mandatory) {
        missingMandatoryConcepts.push({
          conceptName: cw.conceptName,
          strand: cw.strand,
          targetMarks: cw.targetMarks,
          assignedMarks: 0,
          difference: -cw.targetMarks,
          status,
          questionCount: 0,
          questionIds: [],
          mandatory: cw.mandatory,
          recommendation,
        });
      }
    } else if (diff > 0.5) {
      status = 'over_tested';
      recommendation = `Over-tested: Assigned ${record.marks} marks exceeds target ${cw.targetMarks} marks (+${diff.toFixed(1)} marks). Consider reallocating to under-tested concepts.`;
      overTestedConcepts.push({
        conceptName: cw.conceptName,
        strand: cw.strand,
        targetMarks: cw.targetMarks,
        assignedMarks: record.marks,
        difference: diff,
        status,
        questionCount: record.questionCount,
        questionIds: record.questionIds,
        mandatory: cw.mandatory,
        recommendation,
      });
    } else if (diff < -0.5) {
      status = 'under_tested';
      recommendation = `Under-tested: Assigned ${record.marks} marks is below prescribed ${cw.targetMarks} marks (${diff.toFixed(1)} marks deficit).`;
      underTestedConcepts.push({
        conceptName: cw.conceptName,
        strand: cw.strand,
        targetMarks: cw.targetMarks,
        assignedMarks: record.marks,
        difference: diff,
        status,
        questionCount: record.questionCount,
        questionIds: record.questionIds,
        mandatory: cw.mandatory,
        recommendation,
      });
    }

    // Points calculation for compliance
    if (status === 'balanced') {
      complianceWeightedPoints += 10;
    } else if (status === 'over_tested') {
      const penalty = Math.min(6, Math.abs(diff) * 2);
      complianceWeightedPoints += Math.max(2, 10 - penalty);
    } else if (status === 'under_tested') {
      const penalty = Math.min(7, Math.abs(diff) * 2.5);
      complianceWeightedPoints += Math.max(1, 10 - penalty);
    } else if (status === 'missing') {
      complianceWeightedPoints += 0;
    }

    conceptsAudit.push({
      conceptName: cw.conceptName,
      strand: cw.strand,
      targetMarks: cw.targetMarks,
      assignedMarks: record.marks,
      difference: diff,
      status,
      questionCount: record.questionCount,
      questionIds: record.questionIds,
      mandatory: cw.mandatory,
      recommendation,
    });
  });

  // Calculate compliance score
  const baseCompliance = conceptWeightages.length === 0
    ? (blueprint.totalMarks === 0 ? 100 : 0)
    : Math.round((complianceWeightedPoints / maxCompliancePoints) * 100);
  const marksDifference = totalAssignedMarks - (blueprint.totalMarks || 0);
  const marksPenalty = Math.min(25, Math.abs(marksDifference) * 3);
  const compliancePercentage = Math.max(0, Math.min(100, (isNaN(baseCompliance) ? 0 : baseCompliance) - marksPenalty));

  let auditStatus: 'compliant' | 'minor_discrepancy' | 'critical_discrepancy' = 'compliant';
  if (missingMandatoryConcepts.length > 0 || Math.abs(marksDifference) > 3 || compliancePercentage < 65) {
    auditStatus = 'critical_discrepancy';
  } else if (overTestedConcepts.length > 0 || underTestedConcepts.length > 0 || Math.abs(marksDifference) > 0.5) {
    auditStatus = 'minor_discrepancy';
  }

  return {
    blueprintId: blueprint.id,
    blueprintTitle: blueprint.title,
    targetTotalMarks: blueprint.totalMarks,
    assignedTotalMarks: totalAssignedMarks,
    totalMarksDifference: marksDifference,
    compliancePercentage,
    status: auditStatus,
    conceptsAudit,
    overTestedConcepts,
    underTestedConcepts,
    missingMandatoryConcepts,
    questionTypeDistribution: questionTypeStats,
    cognitiveDistribution: cognitiveStats,
    auditTimestamp: new Date().toISOString(),
  };
}

// ============================================================================
// BLUEPRINT REBALANCING ADVISORY
// ============================================================================

export interface BlueprintRebalanceAdvice {
  action: 'add' | 'reduce' | 'rebalance';
  conceptName: string;
  marksDelta: number;
  message: string;
}

export function generateRebalancingAdvisories(report: BlueprintAuditReport): BlueprintRebalanceAdvice[] {
  const advisories: BlueprintRebalanceAdvice[] = [];

  // Missing mandatory concepts
  report.missingMandatoryConcepts.forEach((c) => {
    advisories.push({
      action: 'add',
      conceptName: c.conceptName,
      marksDelta: c.targetMarks,
      message: `Add ${c.targetMarks} mark(s) of "${c.conceptName}" to fulfill mandatory board requirements.`,
    });
  });

  // Under-tested
  report.underTestedConcepts.forEach((c) => {
    advisories.push({
      action: 'add',
      conceptName: c.conceptName,
      marksDelta: Math.abs(c.difference),
      message: `Increase coverage of "${c.conceptName}" by +${Math.abs(c.difference).toFixed(1)} mark(s).`,
    });
  });

  // Over-tested
  report.overTestedConcepts.forEach((c) => {
    advisories.push({
      action: 'reduce',
      conceptName: c.conceptName,
      marksDelta: c.difference,
      message: `Trim or reassign ${c.difference.toFixed(1)} mark(s) from "${c.conceptName}" to resolve syllabus over-testing.`,
    });
  });

  return advisories;
}

// ============================================================================
// DRAFT TEST PAPER CREATION FROM BLUEPRINT SLOTS
// ============================================================================

export function createDraftTestFromBlueprint(blueprint: BoardQuestionBlueprint): GrammarTestSeries {
  // Group slots by sectionTitle
  const sectionMap: Record<string, GrammarQuestion[]> = {};

  blueprint.questionSlots.forEach((slot, idx) => {
    const secTitle = slot.sectionTitle || 'Section A: Grammar';
    if (!sectionMap[secTitle]) {
      sectionMap[secTitle] = [];
    }

    const question: GrammarQuestion = {
      id: `bp_q_${blueprint.id}_${slot.id}_${Date.now()}_${idx}`,
      type: slot.questionType,
      prompt: slot.sampleQuestionPrompt || `[${slot.conceptTested}] Solve the following question as per ${blueprint.board} standards:`,
      instruction: slot.choiceNote || `[${slot.slotCode}] ${slot.conceptTested} (${slot.marks} mark)`,
      difficulty: slot.cognitiveLevel === 'Analysing' || slot.cognitiveLevel === 'Evaluating' ? 'Hard' : slot.cognitiveLevel === 'Applying' ? 'Medium' : 'Easy',
      marks: slot.marks,
      correctAnswer: 'Refer to Teacher Key / Board Marking Scheme',
      explanation: `Tests mastery of ${slot.conceptTested} as prescribed in ${blueprint.boardCode}.`,
      conceptTested: slot.conceptTested,
      cognitiveLevel: slot.cognitiveLevel,
      boardSlotId: slot.id,
    };

    sectionMap[secTitle].push(question);
  });

  const sections = Object.entries(sectionMap).map(([title, questions], sIdx) => ({
    id: `sec_${blueprint.id}_${sIdx}`,
    title,
    description: `Official ${blueprint.board} curriculum aligned question set. Total marks: ${questions.reduce((sum, q) => sum + q.marks, 0)}`,
    questions,
  }));

  return {
    id: `test_bp_${blueprint.id}_${Date.now()}`,
    title: `${blueprint.title} Paper`,
    classLevel: blueprint.targetClass,
    totalMarks: blueprint.totalMarks,
    durationMinutes: blueprint.totalDurationMinutes,
    instructions: blueprint.markingSchemeGuidelines,
    blueprintId: blueprint.id,
    boardTarget: blueprint.board,
    sections,
  };
}

// ============================================================================
// EXPORT BLUEPRINT MATRIX AS PRINTABLE TEXT / SPECIFICATION
// ============================================================================

export function exportBlueprintToText(
  blueprint: BoardQuestionBlueprint,
  audit?: BlueprintAuditReport
): string {
  let out = `================================================================================\n`;
  out += `BOARD-SPECIFIC QUESTION BLUEPRINT & WEIGHTAGE MATRIX\n`;
  out += `================================================================================\n\n`;
  out += `TITLE: ${blueprint.title}\n`;
  out += `BOARD / STANDARD: ${blueprint.board} (${blueprint.boardCode})\n`;
  out += `TARGET CLASS: ${blueprint.targetClass}\n`;
  out += `TOTAL MARKS: ${blueprint.totalMarks} Marks\n`;
  out += `TIME DURATION: ${blueprint.totalDurationMinutes} Minutes\n`;
  out += `OFFICIAL SYLLABUS REF: ${blueprint.officialSyllabusReference}\n\n`;

  out += `DESCRIPTION:\n${blueprint.description}\n\n`;

  out += `--------------------------------------------------------------------------------\n`;
  out += `BOARD MARKING SCHEME GUIDELINES:\n`;
  out += `--------------------------------------------------------------------------------\n`;
  blueprint.markingSchemeGuidelines.forEach((g, i) => {
    out += `${i + 1}. ${g}\n`;
  });
  out += `\n`;

  out += `--------------------------------------------------------------------------------\n`;
  out += `CONCEPT WEIGHTAGE MATRIX\n`;
  out += `--------------------------------------------------------------------------------\n`;
  out += `Concept Name               | Strand              | Target | Mandatory | Cognitive   | Types\n`;
  out += `---------------------------+---------------------+--------+-----------+-------------+------------------\n`;
  blueprint.conceptWeightages.forEach((cw) => {
    const name = cw.conceptName.padEnd(26).slice(0, 26);
    const strand = cw.strand.padEnd(20).slice(0, 20);
    const marks = `${cw.targetMarks} m`.padEnd(7);
    const mand = (cw.mandatory ? 'YES' : 'NO').padEnd(10);
    const cog = cw.cognitiveLevel.padEnd(12).slice(0, 12);
    const types = cw.preferredQuestionTypes.join(', ');
    out += `${name} | ${strand} | ${marks} | ${mand} | ${cog} | ${types}\n`;
  });
  out += `\n`;

  out += `--------------------------------------------------------------------------------\n`;
  out += `QUESTION BLUEPRINT SLOTS (${blueprint.questionSlots.length} Slots)\n`;
  out += `--------------------------------------------------------------------------------\n`;
  blueprint.questionSlots.forEach((slot, i) => {
    out += `[${slot.slotCode}] ${slot.conceptTested} (${slot.marks} Mark) - ${slot.questionType.toUpperCase()} - ${slot.cognitiveLevel}\n`;
    if (slot.sampleQuestionPrompt) {
      out += `  Sample: ${slot.sampleQuestionPrompt}\n`;
    }
  });
  out += `\n`;

  if (audit) {
    out += `================================================================================\n`;
    out += `REAL-TIME COMPLIANCE & AUDIT REPORT\n`;
    out += `================================================================================\n`;
    out += `Audit Timestamp: ${new Date(audit.auditTimestamp).toLocaleString()}\n`;
    out += `Overall Compliance: ${audit.compliancePercentage}% (${audit.status.toUpperCase()})\n`;
    out += `Total Marks Assigned: ${audit.assignedTotalMarks} / ${audit.targetTotalMarks} (Difference: ${audit.totalMarksDifference > 0 ? '+' : ''}${audit.totalMarksDifference})\n\n`;

    out += `CONCEPT AUDIT BREAKDOWN:\n`;
    audit.conceptsAudit.forEach((ca) => {
      const statusIcon =
        ca.status === 'balanced'
          ? '[BALANCED]'
          : ca.status === 'over_tested'
          ? '[OVER-TESTED]'
          : ca.status === 'under_tested'
          ? '[UNDER-TESTED]'
          : '[MISSING]';
      out += `- ${ca.conceptName}: Target ${ca.targetMarks}m, Assigned ${ca.assignedMarks}m (${ca.difference > 0 ? '+' : ''}${ca.difference}m) -> ${statusIcon}\n`;
      out += `  Note: ${ca.recommendation}\n`;
    });
    out += `\n`;

    if (audit.missingMandatoryConcepts.length > 0) {
      out += `CRITICAL DEFICITS:\n`;
      audit.missingMandatoryConcepts.forEach((m) => {
        out += `  ! Mandatory requirement "${m.conceptName}" has 0 marks assigned (Target: ${m.targetMarks}m)!\n`;
      });
      out += `\n`;
    }
  }

  out += `================================================================================\n`;
  out += `End of Blueprint Specification Document\n`;
  return out;
}
