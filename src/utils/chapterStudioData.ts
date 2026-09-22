import {
  StudioChapter,
  ChapterSection,
  TextbookContentBlock,
  StudioExercise,
  ChapterOpeningData,
  ChapterEndingData,
  ChapterAnswerKeyItem,
  ChapterQualityAuditReport,
  GrammarTopic,
  GrammarClassLevel,
  CurriculumSystemId,
  GrammarQuestion,
  WorkedExampleData,
  VisualBlockData,
  CommonErrorData,
  GrammarRuleRecord,
  VisualBriefRecord,
  ChapterRevisionData,
  TeacherAuthorNoteRecord,
} from '../types';
import {
  sanitizeChapterDataIntegrity,
  normalizeExerciseTitle,
} from './dataIntegrityGuard';

/**
 * Creates the master demonstration chapter for CBSE Class 6:
 * Chapter 6: Subject–Verb Agreement (Concord)
 */
export function createDefaultCbseClass6SubjectVerbAgreementChapter(): StudioChapter {
  const opening: ChapterOpeningData = {
    chapterNumber: 6,
    title: 'Subject–Verb Agreement',
    subtitle: 'Mastering Number, Person, Intervening Modifiers, and Correlative Concord',
    openingIllustrationUrl: '',
    openingIllustrationPrompt:
      'Editorial textbook illustration: An antique brass mechanical balance scale with glowing typographic letters. On the left pan sits a singular subject figure (He / The clock) balancing with a singular verb with an illuminated gold -s suffix. In the background, subtle architectural lines of library shelves evoke academic scholarship.',
    openingHook:
      'Why does the sentence "The box of Belgian chocolates are empty" sound natural to many speakers, yet make examiners reach for red pens? The answer lies in an invisible magnetic thread linking subjects and their verbs across sentences—regardless of how many words crowd between them.',
    shortIntroduction:
      'Every complete sentence in the English language tells a story of partnership. The subject performs or undergoes an action, and the verb expresses that action or state of being. For the sentence to be grammatically sound, the subject and verb must agree in both number (singular or plural) and person (first, second, or third). This grammatical harmony is known as Concord or Subject–Verb Agreement.',
    learningObjectives: [
      'Identify the true grammatical subject in sentences with intervening prepositional phrases',
      'Apply the Singular-with-Singular and Plural-with-Plural golden rule in the present tense',
      'Resolve concord with correlative conjunctions (either...or, neither...nor) using the proximity principle',
      'Differentiate between collective nouns acting as single cohesive units versus individual members',
      'Master indefinite pronouns (each, everyone, somebody, neither) that take singular verbs',
    ],
    keyVocabulary: [
      'Concord',
      'Grammatical Number',
      'Intervening Phrase',
      'Parenthetical Expression',
      'Proximity Principle',
      'Collective Noun',
      'Indefinite Pronoun',
    ],
    conceptsCovered: [
      'Basic Singular and Plural Concord',
      'Intervening Prepositional Traps',
      'Correlative Conjunctions',
      'Collective Noun Nuances',
      'Units of Distance, Time, and Money',
    ],
    priorKnowledge:
      'Students should already know how to identify head nouns, subject personal pronouns (he, she, it, they), and auxiliary verbs (is, are, was, were, has, have).',
    estimatedStudyTimeMinutes: 120,
  };

  const sections: ChapterSection[] = [
    {
      id: 'sec-sva-1',
      chapterId: 'c6-top-sva',
      numberLabel: '6.1',
      title: 'What is Subject–Verb Agreement?',
      order: 1,
      learningObjectives: ['Define concord in formal grammar', 'Recognize subject-verb dependency'],
      authorNotes:
        'Keep the tone rigorous yet encouraging. For Class 6, emphasize visual comparison of verb endings.',
      blocks: [
        {
          id: 'blk-sva-1-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'In English syntax, **Concord** (from the Latin *concordia*, meaning "agreement" or "harmony") refers to the grammatical agreement between related words. The foundational rule of English sentence construction is straightforward:\n\n> A **singular subject** requires a **singular verb**.\n> A **plural subject** requires a **plural verb**.\n\nWhile this principle appears elementary in simple two-word sentences like *The boy runs* or *The boys run*, real textbook and literary English rarely keeps the subject and verb side-by-side. As sentences grow richer with modifying clauses and prepositional phrases, identifying the true subject demands careful grammatical discernment.',
        },
        {
          id: 'blk-sva-1-2',
          type: 'grammar_rule',
          order: 2,
          visibility: 'student',
          title: 'The Fundamental Concord Law',
          calloutTitle: 'THE FUNDAMENTAL CONCORD LAW',
          calloutText:
            'A finite verb must always agree with its grammatical subject in person (1st, 2nd, or 3rd) and number (singular or plural). The form of the verb is determined solely by the subject, never by any noun or pronoun that happens to stand between them.',
        },
        {
          id: 'blk-sva-1-3',
          type: 'visual',
          order: 3,
          visibility: 'student',
          title: 'The Agreement Balance Scale',
          visualData: {
            visualType: 'diagram',
            title: 'The Agreement Balance Scale',
            caption:
              'Figure 6.1: Grammatical equilibrium. When the subject is singular (Left), the verb balances with a singular ending (Right). When the subject turns plural, the verb drops the -s ending.',
            altText:
              'Diagram of a mechanical balance scale comparing singular subject plus singular verb versus plural subject plus plural verb',
            source: 'VERITAS Grammar Publishing Core',
            credit: 'VERITAS Editorial Pedagogical Assets',
            licenseStatus: 'Original Creation',
            authorNote: 'Excellent pedagogical visual to anchor the chapter opener.',
            placement: 'center',
            size: 'medium',
            svgIllustrationBrief:
              'Balance scale schematic: Left pan labeled "Singular Subject (The Scholar)", Right pan labeled "Singular Verb (Reads)". Second scale: Left pan "Plural Subject (The Scholars)", Right pan "Plural Verb (Read)". Highlights the counter-intuitive "S" migration.',
          },
        },
      ],
    },
    {
      id: 'sec-sva-2',
      chapterId: 'c6-top-sva',
      numberLabel: '6.2',
      title: 'Singular and Plural Verbs: The "Inverted S" Rule',
      order: 2,
      learningObjectives: [
        'Differentiate between noun plurals and third-person singular verb endings',
        'Avoid confusion caused by the letter -s',
      ],
      blocks: [
        {
          id: 'blk-sva-2-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'A common source of confusion among young writers is the letter **-s**. In English morphology, the letter **-s** operates in opposite ways for nouns and verbs:\n\n* When you add **-s** or **-es** to a noun, it becomes **plural** (*book* → *books*, *child* → *children*).\n* When you add **-s** or **-es** to a regular verb in the simple present tense, it becomes **singular** (*write* → *writes*, *go* → *goes*).',
        },
        {
          id: 'blk-sva-2-2',
          type: 'table',
          order: 2,
          visibility: 'student',
          title: 'Concord in Simple Present Tense',
          visualData: {
            visualType: 'table',
            title: 'Present Tense Concord Paradigm',
            caption: 'Table 6.1: Person and number alignment in standard British/Indian English',
            altText: 'Table contrasting singular and plural verb forms across grammatical persons',
            source: 'VERITAS English Series',
            credit: 'Editorial Curriculum Board',
            licenseStatus: 'Original Creation',
            placement: 'full_width',
            size: 'medium',
            tableData: {
              headers: ['Person', 'Singular Subject + Verb', 'Plural Subject + Verb', 'Notes'],
              rows: [
                ['1st Person', 'I speak / I am', 'We speak / We are', '"I" takes base verb or "am"'],
                ['2nd Person', 'You speak / You are', 'You speak / You are', 'Always takes plural verb form'],
                ['3rd Person', 'He / She / It speaks (is/has)', 'They speak (are/have)', 'Critical examination focus: -s ending in singular'],
              ],
            },
          },
        },
        {
          id: 'blk-sva-2-3',
          type: 'remember',
          order: 3,
          visibility: 'student',
          calloutTitle: 'REMEMBER: THE INVERTED "S" PRINCIPLE',
          calloutText:
            'Nouns add "-s" to become plural (*cats, desks*), but verbs add "-s" to become singular (*purrs, stands*). Only one side of the subject-verb pair generally carries the regular "-s" in the third person: "The cat purrs" (1 "s") vs "The cats purr" (1 "s").',
        },
      ],
    },
    {
      id: 'sec-sva-3',
      chapterId: 'c6-top-sva',
      numberLabel: '6.3',
      title: 'Words Between Subject and Verb: The Prepositional Trap',
      order: 3,
      learningObjectives: [
        'Filter out intervening prepositional phrases',
        'Identify head nouns accurately',
      ],
      authorNotes:
        'This is the highest-weight error area in CBSE Class 6 and ICSE Paper 1 examinations.',
      blocks: [
        {
          id: 'blk-sva-3-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'In mature writing, subjects are frequently followed by descriptive prepositional phrases beginning with *of, with, by, for, in, on, at*, or compound connectives like *as well as, along with, together with, in addition to, accompanied by*.\n\nThese phrases provide descriptive detail, but they **never** change the grammatical number of the subject. A verb agrees only with its true **head noun**.',
        },
        {
          id: 'blk-sva-3-2',
          type: 'worked_example',
          order: 2,
          visibility: 'student',
          title: 'The Parenthetical Bracket Method',
          workedExample: {
            problem:
              'Select the correct verb: "The bouquet of fragrant red roses (was / were) presented to the chief guest."',
            steps: [
              {
                stepNumber: 1,
                title: 'Locate the finite verb choices',
                instruction: 'Identify the verb options in the sentence.',
                sampleWork: 'Verb choices: "was" (singular) vs "were" (plural).',
                ruleApplied: 'Identification of tense and auxiliary number',
              },
              {
                stepNumber: 2,
                title: 'Isolate the intervening prepositional phrase',
                instruction: 'Draw mental or physical brackets around any phrase starting with a preposition.',
                sampleWork:
                  'Prepositional phrase: "[of fragrant red roses]". Notice the preposition "of".',
                ruleApplied: 'Prepositional filtering rule',
                note: 'Do NOT allow the plural noun "roses" inside the bracket to tempt you!',
              },
              {
                stepNumber: 3,
                title: 'Match the head noun directly to the verb',
                instruction: 'Strip away the bracketed phrase and read the core subject with the verb choices.',
                sampleWork: '"The bouquet [...] was / were presented."',
                ruleApplied: 'Head noun concord verification',
              },
            ],
            finalAnswer:
              'The bouquet of fragrant red roses **was** presented to the chief guest.',
            whyRationale:
              'The subject is the singular collective container noun "bouquet". The noun "roses" is merely the object of the preposition "of" and has no grammatical control over the verb.',
            ruleApplied: 'Prepositional Modifier Invariance',
            commonMistake:
              'Students choose "were" because "roses" is plural and sits immediately adjacent to the verb slot.',
            teacherNote:
              'Have students practice placing physical pencil brackets around all phrases beginning with "of", "with", "along with", and "in addition to".',
            difficulty: 'Medium',
          },
        },
        {
          id: 'blk-sva-3-3',
          type: 'common_error',
          order: 3,
          visibility: 'student',
          commonError: {
            incorrectSentence: 'The captain, as well as his loyal teammates, are celebrating the victory.',
            correctSentence: 'The captain, as well as his loyal teammates, is celebrating the victory.',
            mistakeType: 'Intervening Parenthetical Conjunction Trap',
            explanation:
              'Phrases introduced by "as well as", "along with", "together with", and "in addition to" are parenthetical modifiers, NOT coordinating conjunctions like "and". The true subject remains the singular "captain", requiring the singular verb "is".',
            ruleViolated: 'Parenthetical Additive Modifiers do not pluralize subjects',
            examTrapNote:
              'Board examiners specifically test "as well as" against "and" to test whether candidates spot the difference.',
          },
        },
      ],
    },
    {
      id: 'sec-sva-4',
      chapterId: 'c6-top-sva',
      numberLabel: '6.4',
      title: 'Correlative Conjunctions: The Proximity Principle',
      order: 4,
      learningObjectives: [
        'Apply the proximity principle for either...or and neither...nor',
        'Handle singular and plural subject combinations',
      ],
      blocks: [
        {
          id: 'blk-sva-4-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'When two subjects are connected by coordinating conjunction **and**, they combine to form a plural compound subject:\n\n* *The teacher **and** the student **are** in the laboratory.* (Compound = Plural)\n\nHowever, when subjects are linked by correlative disjunctive pairs:\n\n* **either... or**\n* **neither... nor**\n* **not only... but also**\n\nthe sentence does not add the subjects together. Instead, it introduces an alternative. In such cases, English follows the **Rule of Proximity** (closeness): the verb agrees in number and person with the **subject closer to it**.',
        },
        {
          id: 'blk-sva-4-2',
          type: 'example_set',
          order: 2,
          visibility: 'student',
          title: 'The Proximity Rule in Action',
          exampleData: {
            type: 'correct_vs_incorrect',
            items: [
              {
                id: 'ex-prox-1',
                sentence: 'Neither the teacher nor the students were aware of the schedule change.',
                isCorrect: true,
                targetSnippet: 'were aware',
                explanation: 'The verb is closer to "students" (plural), so it takes the plural verb "were".',
                ruleApplied: 'Proximity with neither...nor',
                difficulty: 'Medium',
              },
              {
                id: 'ex-prox-2',
                sentence: 'Neither the students nor the teacher was aware of the schedule change.',
                isCorrect: true,
                targetSnippet: 'was aware',
                explanation: 'When the order is flipped, the verb is now closer to "teacher" (singular), requiring the singular verb "was".',
                ruleApplied: 'Proximity with neither...nor',
                difficulty: 'Medium',
              },
              {
                id: 'ex-prox-3',
                sentence: 'Either Priya or her sisters has prepared the dessert.',
                isCorrect: false,
                incorrectSnippet: 'has prepared',
                explanation: 'Incorrect because "sisters" is plural and closer to the verb. It must be "have prepared".',
                ruleApplied: 'Proximity violation',
                difficulty: 'Medium',
              },
            ],
          },
        },
        {
          id: 'blk-sva-4-3',
          type: 'exam_tip',
          order: 3,
          visibility: 'student',
          calloutTitle: 'EXAM TIP: THE CLOSENESS TEST',
          calloutText:
            'In "either...or" and "neither...nor" questions, put your finger over the first subject and the conjunction. Read only the second subject with the verb. If it sounds correct in isolation, your concord is secure: "[Neither the principal nor] the teachers were present."',
        },
      ],
    },
    {
      id: 'sec-sva-5',
      chapterId: 'c6-top-sva',
      numberLabel: '6.5',
      title: 'Collective Nouns and Units of Measurement',
      order: 5,
      learningObjectives: [
        'Understand unitary vs distributive collective nouns',
        'Recognize quantities of time, distance, and money as singular units',
      ],
      blocks: [
        {
          id: 'blk-sva-5-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'A **collective noun** names a group of persons, animals, or items (*committee, jury, team, crowd, flock, herd, family*).\n\n1. **Unitary Action (Singular Verb)**: When the group acts as a unified single body, use a singular verb:\n   - *The committee **has** submitted its unanimous recommendations.*\n   - *The Indian cricket team **is** playing exceptionally well today.*\n\n2. **Distributive / Divided Action (Plural Verb)**: When the individual members act separately or are in disagreement, British and Indian English permit a plural verb:\n   - *The jury **were** divided in their opinions.* (Notice the plural pronoun *their*).\n\n3. **Units of Measurement, Time, and Money**: Plural expressions of quantity, distance, or currency take a singular verb when considered as a single unified amount:\n   - *Fifty thousand rupees **is** a substantial sum for a school prize.*\n   - *Ten kilometres **is** too far to jog without warm-up exercises.*\n   - *Three hours **was** allocated for the mathematics paper.*',
        },
        {
          id: 'blk-sva-5-2',
          type: 'watch_out',
          order: 2,
          visibility: 'student',
          calloutTitle: 'WATCH OUT: NOUNS PLURAL IN FORM, SINGULAR IN MEANING',
          calloutText:
            'Certain nouns end in "-s" and look plural, but are grammatically singular: subjects of study (*Mathematics, Physics, Civics, Economics*), diseases (*Measles, Mumps, Rickets*), and games (*Billiards, Darts*), as well as *News*. They always take a singular verb: "Mathematics is challenging yet fascinating."',
        },
      ],
    },
    {
      id: 'sec-sva-6',
      chapterId: 'c6-top-sva',
      numberLabel: '6.6',
      title: 'Indefinite Pronouns: The Singular Traps',
      order: 6,
      learningObjectives: [
        'Identify distributive and indefinite pronouns taking singular verbs',
        'Avoid plural contamination from following phrases',
      ],
      blocks: [
        {
          id: 'blk-sva-6-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'Indefinite pronouns refer to non-specific people or things. The following pronouns are **always singular** in formal English, even though they may psychologically suggest a large crowd of people:\n\n* **The "Each & Every" Family**: *each, every, everyone, everybody, everything*\n* **The "Some" Family**: *someone, somebody, something*\n* **The "Any" Family**: *anyone, anybody, anything*\n* **The "No" Family**: *no one, nobody, nothing*\n* **The Dual Distributives**: *either, neither*\n\nWhenever one of these words functions as the subject, the verb **must be singular**.',
        },
        {
          id: 'blk-sva-6-2',
          type: 'example_set',
          order: 2,
          visibility: 'student',
          title: 'Indefinite Pronoun Concord',
          exampleData: {
            type: 'example_explanation',
            items: [
              {
                id: 'ex-indef-1',
                sentence: 'Each of the participants was given a certificate of merit.',
                targetSnippet: 'was given',
                explanation: 'Subject is "Each" (singular). The phrase "of the participants" does not make it plural.',
                ruleApplied: 'Each is singular',
                difficulty: 'Easy',
              },
              {
                id: 'ex-indef-2',
                sentence: 'Everybody in the auditorium wants to meet the astronaut.',
                targetSnippet: 'wants',
                explanation: '"Everybody" takes the singular verb with -s ("wants").',
                ruleApplied: 'Indefinite -body compounds are singular',
                difficulty: 'Easy',
              },
              {
                id: 'ex-indef-3',
                sentence: 'Neither of the explanations sounds convincing to the detective.',
                targetSnippet: 'sounds',
                explanation: '"Neither" refers to neither one alone, hence singular.',
                ruleApplied: 'Neither is singular',
                difficulty: 'Medium',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-sva-7',
      chapterId: 'c6-top-sva',
      numberLabel: '6.7',
      title: 'Inverted Syntax: "There is" and "There are"',
      order: 7,
      learningObjectives: [
        'Recognize expletive dummy subjects (there/here)',
        'Find the true delayed subject after the verb',
      ],
      blocks: [
        {
          id: 'blk-sva-7-1',
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent:
            'In standard sentences, the subject precedes the verb. In sentences beginning with the preparatory adverb **There** or **Here**, however, the word *there* is merely an introductory placeholder (an expletive or dummy subject). The true grammatical subject appears **after** the verb.\n\n* *There **is** a solitary **lighthouse** on the cliff.* (Subject: *lighthouse* → singular)\n* *There **are** three ancient **watchtowers** along the ridge.* (Subject: *watchtowers* → plural)\n\nBefore deciding between *is/are* or *was/were*, glance ahead to identify the noun that follows.',
        },
      ],
    },
  ];

  const exercises: StudioExercise[] = [
    {
      id: 'ex-c6-a',
      letter: 'A',
      title: 'Foundation: Subject and Verb Identification',
      progression: 'foundation',
      instructions:
        'Read each sentence carefully. Choose the correct verb from the options to achieve grammatical concord.',
      purpose: 'Establish fundamental automaticity in simple person and number pairing.',
      learningObjective: 'Pair basic singular and plural nouns with matching present-tense verbs.',
      difficulty: 'Easy',
      suggestedMarks: 4,
      questionCount: 4,
      boardRelevance: 'CBSE Class 6 Section B & ICSE Class 6 Paper 1 Grammar',
      teacherNote: 'Encourage students to highlight the head noun with a colored pencil first.',
      questions: [
        {
          id: 'q-c6-a1',
          type: 'mcq',
          prompt: 'Every morning, the diligent postman ___ the letters to our neighborhood.',
          difficulty: 'Easy',
          marks: 1,
          conceptTested: 'Third-person singular present tense',
          options: ['A) deliver', 'B) delivers', 'C) are delivering', 'D) have delivered'],
          correctAnswer: 'B) delivers',
          explanation: '"Postman" is singular third-person, so the verb requires the -s suffix ("delivers").',
        },
        {
          id: 'q-c6-a2',
          type: 'mcq',
          prompt: 'The young athletes ___ rigorously every afternoon on the track.',
          difficulty: 'Easy',
          marks: 1,
          conceptTested: 'Third-person plural present tense',
          options: ['A) train', 'B) trains', 'C) is training', 'D) has trained'],
          correctAnswer: 'A) train',
          explanation: '"Athletes" is plural, so it pairs with the base verb form "train".',
        },
        {
          id: 'q-c6-a3',
          type: 'fill_in_blanks',
          prompt: 'Fill in the blank with the appropriate auxiliary:',
          blanksSentence: 'The magnificent peacock ___ (is / are) displaying its plumage.',
          hints: 'is / are',
          conceptTested: 'Singular animal subject concord',
          acceptableAnswers: ['is'],
          correctAnswer: 'is',
          difficulty: 'Easy',
          marks: 1,
          explanation: '"Peacock" is a singular noun and takes the singular auxiliary "is".',
        },
        {
          id: 'q-c6-a4',
          type: 'fill_in_blanks',
          prompt: 'Fill in the blank with the correct verb form:',
          blanksSentence: 'Our school library ___ (possess / possesses) over ten thousand volumes.',
          hints: 'possess / possesses',
          conceptTested: 'Third-person singular regular verb',
          acceptableAnswers: ['possesses'],
          correctAnswer: 'possesses',
          difficulty: 'Easy',
          marks: 1,
          explanation: '"Library" is an inanimate singular noun requiring the verb with "-es" ("possesses").',
        },
      ],
    },
    {
      id: 'ex-c6-b',
      letter: 'B',
      title: 'Understanding: Intervening Prepositional Phrases',
      progression: 'understanding',
      instructions:
        'Bracket the intervening phrase between the subject and the verb, then select the correct verb form.',
      purpose: 'Train students to ignore misleading prepositional objects.',
      learningObjective: 'Maintain agreement when nouns of conflicting number stand before the verb.',
      difficulty: 'Medium',
      suggestedMarks: 4,
      questionCount: 4,
      boardRelevance: 'High priority in CBSE periodic assessments',
      questions: [
        {
          id: 'q-c6-b1',
          type: 'mcq',
          prompt: 'The quality of these freshly plucked Alphonso mangoes ___ truly outstanding.',
          difficulty: 'Medium',
          marks: 1,
          conceptTested: 'Intervening prepositional phrase (of + plural noun)',
          options: ['A) is', 'B) are', 'C) were', 'D) have been'],
          correctAnswer: 'A) is',
          explanation: 'The head noun is the abstract singular noun "quality", not the plural object "mangoes". Therefore, the singular verb "is" is correct.',
        },
        {
          id: 'q-c6-b2',
          type: 'mcq',
          prompt: 'The commander, along with his brave officers, ___ inspected the garrison.',
          difficulty: 'Medium',
          marks: 1,
          conceptTested: 'Additive parenthetical phrase (along with)',
          options: ['A) has', 'B) have', 'C) were', 'D) are'],
          correctAnswer: 'A) has',
          explanation: 'Phrases introduced by "along with" do not create a compound subject. The singular subject "commander" governs the auxiliary "has".',
        },
        {
          id: 'q-c6-b3',
          type: 'fill_in_blanks',
          prompt: 'Complete with was or were:',
          blanksSentence: 'A convoy of armoured vehicles ___ (was / were) seen approaching the outpost.',
          hints: 'was / were',
          conceptTested: 'Collective container/group phrase',
          acceptableAnswers: ['was'],
          correctAnswer: 'was',
          difficulty: 'Medium',
          marks: 1,
          explanation: '"Convoy" is the singular head noun; "vehicles" is an object of the preposition "of".',
        },
        {
          id: 'q-c6-b4',
          type: 'fill_in_blanks',
          prompt: 'Complete with the correct present-tense verb:',
          blanksSentence: 'The teacher, as well as her pupils, ___ (is / are) delighted with the science fair result.',
          hints: 'is / are',
          conceptTested: 'Parenthetical "as well as"',
          acceptableAnswers: ['is'],
          correctAnswer: 'is',
          difficulty: 'Medium',
          marks: 1,
          explanation: '"As well as her pupils" is parenthetical. The true subject is "The teacher" (singular).',
        },
      ],
    },
    {
      id: 'ex-c6-c',
      letter: 'C',
      title: 'Application: Correlatives and Distributives',
      progression: 'application',
      instructions:
        'Apply the rule of proximity or the distributive rule to choose the correct verb for each sentence.',
      purpose: 'Master the closeness principle and distributive singulars.',
      learningObjective: 'Correctly resolve either/or, neither/nor, and indefinite pronoun concord.',
      difficulty: 'Medium',
      suggestedMarks: 4,
      questionCount: 4,
      questions: [
        {
          id: 'q-c6-c1',
          type: 'mcq',
          prompt: 'Neither the captain nor the sailors ___ able to navigate through the blinding fog.',
          difficulty: 'Medium',
          marks: 1,
          conceptTested: 'Proximity rule with neither...nor',
          options: ['A) was', 'B) were', 'C) is', 'D) has been'],
          correctAnswer: 'B) were',
          explanation: 'The verb is closer to the plural subject "sailors", requiring the plural verb "were".',
        },
        {
          id: 'q-c6-c2',
          type: 'mcq',
          prompt: 'Either the paintings or the marble sculpture ___ to be auctioned first.',
          difficulty: 'Medium',
          marks: 1,
          conceptTested: 'Proximity rule with either...or',
          options: ['A) is', 'B) are', 'C) were', 'D) have'],
          correctAnswer: 'A) is',
          explanation: 'The singular noun "marble sculpture" is closer to the verb slot, so the singular verb "is" is mandatory.',
        },
        {
          id: 'q-c6-c3',
          type: 'fill_in_blanks',
          prompt: 'Complete with the appropriate verb:',
          blanksSentence: 'Each of the five finalists ___ (receives / receive) a commemorative trophy.',
          hints: 'receives / receive',
          conceptTested: 'Indefinite distributive "each"',
          acceptableAnswers: ['receives'],
          correctAnswer: 'receives',
          difficulty: 'Medium',
          marks: 1,
          explanation: '"Each" is singular and takes the singular verb ending in -s ("receives").',
        },
        {
          id: 'q-c6-c4',
          type: 'fill_in_blanks',
          prompt: 'Complete with has or have:',
          blanksSentence: 'Neither of the two solutions ___ (has / have) proved completely satisfactory.',
          hints: 'has / have',
          conceptTested: 'Distributive "neither of"',
          acceptableAnswers: ['has'],
          correctAnswer: 'has',
          difficulty: 'Medium',
          marks: 1,
          explanation: '"Neither" denotes not one nor the other of two; it always takes the singular auxiliary "has".',
        },
      ],
    },
    {
      id: 'ex-c6-d',
      letter: 'D',
      title: 'Error Analysis: Spot and Correct the Concord Fault',
      progression: 'error_analysis',
      instructions:
        'Each sentence below contains a subject-verb agreement error. Identify the error and provide the corrected version.',
      purpose: 'Develop critical proofreading and editing skills for board examination formats.',
      learningObjective: 'Diagnose agreement traps and formulate grammatical corrections with justification.',
      difficulty: 'Hard',
      suggestedMarks: 6,
      questionCount: 3,
      boardRelevance: 'Direct match for CBSE Editing and Omission tasks',
      questions: [
        {
          id: 'q-c6-d1',
          type: 'error_correction',
          prompt: 'Identify the error and write the correct verb:',
          originalSentence: 'The list of shortlisted candidates for the scholarship were published yesterday.',
          correctedSentence: 'The list of shortlisted candidates for the scholarship was published yesterday.',
          errorSnippet: 'were published',
          correctionSnippet: 'was published',
          correctAnswer: 'Change "were published" to "was published"',
          acceptableAnswers: ['was', 'was published', 'Change were to was'],
          explanation: 'The true subject is the singular noun "list". The prepositional phrase "of shortlisted candidates for the scholarship" does not affect the verb.',
          difficulty: 'Hard',
          marks: 2,
        },
        {
          id: 'q-c6-d2',
          type: 'error_correction',
          prompt: 'Identify the error and write the correct verb:',
          originalSentence: 'Bread and butter are the staple breakfast of the mountaineers.',
          correctedSentence: 'Bread and butter is the staple breakfast of the mountaineers.',
          errorSnippet: 'are',
          correctionSnippet: 'is',
          correctAnswer: 'Change "are" to "is"',
          acceptableAnswers: ['is', 'Change are to is'],
          explanation: '"Bread and butter" forms a single unified concept / composite food unit, and therefore takes the singular verb "is".',
          difficulty: 'Hard',
          marks: 2,
        },
        {
          id: 'q-c6-d3',
          type: 'error_correction',
          prompt: 'Identify the error and write the correct verb:',
          originalSentence: 'Fifty kilometres on a mountainous bicycle trail are an exhausting ordeal.',
          correctedSentence: 'Fifty kilometres on a mountainous bicycle trail is an exhausting ordeal.',
          errorSnippet: 'are',
          correctionSnippet: 'is',
          correctAnswer: 'Change "are" to "is"',
          acceptableAnswers: ['is', 'Change are to is'],
          explanation: 'Quantities and measurements representing a single unified distance or quantity take a singular verb.',
          difficulty: 'Hard',
          marks: 2,
        },
      ],
    },
    {
      id: 'ex-c6-e',
      letter: 'E',
      title: 'Transformation: Rewrite as Directed',
      progression: 'transformation',
      instructions:
        'Transform each sentence according to the given instructions while maintaining strict subject-verb concord.',
      purpose: 'Syntactic flexibility and structural control.',
      learningObjective: 'Switch between singular and plural frameworks while keeping meaning intact.',
      difficulty: 'Hard',
      suggestedMarks: 4,
      questionCount: 2,
      questions: [
        {
          id: 'q-c6-e1',
          type: 'transformation',
          prompt: 'Rewrite using "Neither... nor":',
          instruction: 'Begin the sentence with "Neither the coach..." and join the two statements.',
          originalSentence: 'The coach was not satisfied with the practice match. The players were not satisfied either.',
          correctedSentence: 'Neither the coach nor the players were satisfied with the practice match.',
          correctAnswer: 'Neither the coach nor the players were satisfied with the practice match.',
          acceptableAnswers: [
            'Neither the coach nor the players were satisfied with the practice match.',
            'Neither the coach nor the players was satisfied with the practice match. (less preferred, but proximity dictates were)',
          ],
          explanation: 'When combined with "Neither... nor", the verb agrees with the closer plural subject "players", requiring "were satisfied".',
          difficulty: 'Hard',
          marks: 2,
        },
        {
          id: 'q-c6-e2',
          type: 'transformation',
          prompt: 'Rewrite using "Every one of":',
          instruction: 'Begin with "Every one of the soldiers..."',
          originalSentence: 'All the soldiers have completed their strenuous physical training.',
          correctedSentence: 'Every one of the soldiers has completed his strenuous physical training.',
          correctAnswer: 'Every one of the soldiers has completed his strenuous physical training.',
          acceptableAnswers: [
            'Every one of the soldiers has completed his strenuous physical training.',
            'Every one of the soldiers has completed their strenuous physical training.',
          ],
          explanation: '"Every one" is singular and demands the singular auxiliary "has completed".',
          difficulty: 'Hard',
          marks: 2,
        },
      ],
    },
    {
      id: 'ex-c6-f',
      letter: 'F',
      title: 'Contextual Application: Proofread the Paragraph',
      progression: 'contextual',
      instructions:
        'Read the following passage from a student newsletter. Identify three subject-verb agreement errors and provide the corrected verbs with line numbers.',
      purpose: 'Authentic real-world writing application.',
      learningObjective: 'Locate and rectify multiple agreement flaws embedded within running prose.',
      difficulty: 'Hard',
      suggestedMarks: 6,
      questionCount: 3,
      questions: [
        {
          id: 'q-c6-f1',
          type: 'short_answer',
          prompt:
            'Passage Line 2: "The grand exhibition of robotic prototypes from various schools were inaugurated at nine in the morning." State the incorrect verb and its correction.',
          correctAnswer: 'Incorrect: were. Correct: was.',
          acceptableAnswers: [
            'were -> was',
            'were to was',
            'was',
            'Change were inaugurated to was inaugurated',
          ],
          explanation: 'The head subject is "exhibition" (singular), not the prepositional objects "prototypes" or "schools".',
          difficulty: 'Hard',
          marks: 2,
        },
        {
          id: 'q-c6-f2',
          type: 'short_answer',
          prompt:
            'Passage Line 5: "Neither the chief mentor nor the student inventors was expecting such a massive audience." State the incorrect verb and its correction.',
          correctAnswer: 'Incorrect: was expecting. Correct: were expecting.',
          acceptableAnswers: [
            'was -> were',
            'was expecting -> were expecting',
            'were',
            'Change was to were',
          ],
          explanation: 'The subject closer to the verb is the plural noun "inventors", which requires "were expecting".',
          difficulty: 'Hard',
          marks: 2,
        },
        {
          id: 'q-c6-f3',
          type: 'short_answer',
          prompt:
            'Passage Line 9: "Ten thousand rupees are the cash prize awarded to the best innovator." State the incorrect verb and its correction.',
          correctAnswer: 'Incorrect: are. Correct: is.',
          acceptableAnswers: [
            'are -> is',
            'are to is',
            'is',
            'Change are to is',
          ],
          explanation: '"Ten thousand rupees" represents a single sum of money, requiring the singular verb "is".',
          difficulty: 'Hard',
          marks: 2,
        },
      ],
    },
    {
      id: 'ex-c6-g',
      letter: 'G',
      title: 'Challenge & Higher-Order Inquiry',
      progression: 'challenge',
      instructions:
        'Examine these challenging sentences. Explain why both forms could be argued in different grammatical traditions, and justify the preferred standard form.',
      purpose: 'Develop deep linguistic appreciation for nuance and stylistic precision.',
      learningObjective: 'Analyze collective noun concord in British versus American English.',
      difficulty: 'Hard',
      suggestedMarks: 4,
      questionCount: 1,
      questions: [
        {
          id: 'q-c6-g1',
          type: 'short_answer',
          prompt:
            'Consider the sentence: "The jury (has / have) failed to reach a unanimous verdict." Explain why standard British/Indian grammar favors "have" in this specific context.',
          correctAnswer:
            'When the members of a collective noun act in disagreement or as separate individuals (indicated by failing to reach a unanimous verdict), the plural verb "have" is preferred because the focus is on the conflicting individual members rather than a single unified entity.',
          acceptableAnswers: [
            'The jury is divided / members are disagreeing individually, so plural have is preferred.',
            'Because the failure to reach a unanimous verdict shows the members are acting individually, taking have.',
          ],
          explanation: 'Distributive collective noun concord.',
          difficulty: 'Hard',
          marks: 4,
        },
      ],
    },
  ];

  const ending: ChapterEndingData = {
    whatYouLearned: [
      'A singular subject pairs with a singular verb; a plural subject pairs with a plural verb.',
      'In the present tense, 3rd-person singular verbs carry the "-s" or "-es" suffix, while nouns carry "-s" to become plural.',
      'Intervening prepositional phrases ("of", "with", "along with", "as well as") do not change the number of the head subject.',
      'In "either...or" and "neither...nor", the verb agrees with the subject closest to it (the proximity principle).',
      'Distributive pronouns like "each", "everyone", "neither", and "everybody" always take singular verbs.',
      'Quantities of money, time, and distance functioning as unified wholes take singular verbs.',
    ],
    rulesAtAGlance: [
      {
        rule: 'Golden Rule 1: Number Balance',
        example: 'The scholar reads (singular) | The scholars read (plural)',
      },
      {
        rule: 'Golden Rule 2: Preposition Filter',
        example: 'The crate [of antique glasses] was carefully handled.',
      },
      {
        rule: 'Golden Rule 3: Additive Phrases',
        example: 'The captain, as well as his crew, is ready.',
      },
      {
        rule: 'Golden Rule 4: Proximity Principle',
        example: 'Neither the teacher nor the students were present.',
      },
      {
        rule: 'Golden Rule 5: Quantities as Single Units',
        example: 'Twenty kilometres is a long distance to cycle.',
      },
    ],
    commonMistakes: [
      {
        incorrectSentence: 'One of my friends are travelling abroad.',
        correctSentence: 'One of my friends is travelling abroad.',
        explanation: 'The head subject is "One" (singular), not "friends".',
        mistakeType: 'One of + Plural Noun trap',
      },
      {
        incorrectSentence: 'The news are very encouraging.',
        correctSentence: 'The news is very encouraging.',
        explanation: '"News" is uncountable and singular.',
        mistakeType: 'Nouns ending in -s looking plural',
      },
    ],
    quickRevisionChecklist: [
      'Have I checked whether the subject is singular or plural?',
      'Did I cross out intervening prepositional phrases mentally?',
      'Did I apply proximity for either...or and neither...nor?',
      'Did I verify collective nouns for unitary vs distributive action?',
    ],
    keyVocabulary: [
      'Concord',
      'Head Noun',
      'Proximity',
      'Intervening Phrase',
      'Distributive',
      'Collective Unit',
    ],
    examReminders: [
      'Always circle the head noun before selecting the verb.',
      'Beware of words like "together with" and "in addition to"—they are not conjunctions like "and".',
      'Remember that "each" and "every" demand singular verbs without exception.',
    ],
    challengePrompt:
      'Can you write a short 50-word story where every sentence uses an intervening phrase or correlative conjunction correctly?',
  };

  const answerKey: ChapterAnswerKeyItem[] = [
    {
      id: 'ak-1',
      exerciseLetterOrNumber: 'Exercise A',
      questionNumber: 1,
      questionType: 'mcq',
      promptSummary: 'Diligent postman ___ the letters',
      correctAnswer: 'B) delivers',
      grammarRationale: 'Third-person singular noun "postman" takes verb with "-s".',
      ruleApplied: 'Basic Present Tense Singular Concord',
    },
    {
      id: 'ak-2',
      exerciseLetterOrNumber: 'Exercise A',
      questionNumber: 2,
      questionType: 'mcq',
      promptSummary: 'Young athletes ___ on the track',
      correctAnswer: 'A) train',
      grammarRationale: 'Plural subject "athletes" takes base verb.',
      ruleApplied: 'Basic Present Tense Plural Concord',
    },
    {
      id: 'ak-3',
      exerciseLetterOrNumber: 'Exercise A',
      questionNumber: 3,
      questionType: 'fill_in_blanks',
      promptSummary: 'Peacock ___ displaying its plumage',
      correctAnswer: 'is',
      grammarRationale: 'Singular third-person animal subject requires singular auxiliary "is".',
    },
    {
      id: 'ak-4',
      exerciseLetterOrNumber: 'Exercise A',
      questionNumber: 4,
      questionType: 'fill_in_blanks',
      promptSummary: 'Our school library ___ over ten thousand volumes',
      correctAnswer: 'possesses',
      grammarRationale: 'Singular institutional noun requires verb with "-es".',
    },
    {
      id: 'ak-5',
      exerciseLetterOrNumber: 'Exercise B',
      questionNumber: 1,
      questionType: 'mcq',
      promptSummary: 'The quality of these mangoes ___ outstanding',
      correctAnswer: 'A) is',
      grammarRationale: 'Head noun is "quality" (singular); "of these mangoes" is prepositional object.',
      ruleApplied: 'Prepositional Modifier Invariance',
    },
    {
      id: 'ak-6',
      exerciseLetterOrNumber: 'Exercise B',
      questionNumber: 2,
      questionType: 'mcq',
      promptSummary: 'The commander, along with his officers, ___ inspected',
      correctAnswer: 'A) has',
      grammarRationale: '"Along with" does not make the subject plural. Head noun "commander" governs "has".',
      ruleApplied: 'Additive Parenthetical Modifiers',
    },
    {
      id: 'ak-7',
      exerciseLetterOrNumber: 'Exercise C',
      questionNumber: 1,
      questionType: 'mcq',
      promptSummary: 'Neither the captain nor the sailors ___ able',
      correctAnswer: 'B) were',
      grammarRationale: 'Proximity principle: verb agrees with the adjacent plural noun "sailors".',
      ruleApplied: 'Proximity Rule with Neither... Nor',
    },
    {
      id: 'ak-8',
      exerciseLetterOrNumber: 'Exercise D',
      questionNumber: 1,
      questionType: 'error_correction',
      promptSummary: 'The list of candidates were published',
      correctAnswer: 'Change "were published" to "was published"',
      grammarRationale: 'Head noun "list" is singular; "candidates" is inside prepositional phrase.',
      modelAnswer: 'The list of shortlisted candidates for the scholarship was published yesterday.',
      acceptableAlternatives: ['was', 'was published', 'Change were to was'],
      markingGuidance: 'Award 1 mark for identifying "were" and 1 mark for supplying "was".',
      isSubjective: true,
    },
    {
      id: 'ak-9',
      exerciseLetterOrNumber: 'Exercise E',
      questionNumber: 1,
      questionType: 'transformation',
      promptSummary: 'Neither coach nor players satisfied',
      correctAnswer: 'Neither the coach nor the players were satisfied with the practice match.',
      grammarRationale: 'Correlative "neither...nor" with plural second subject requires plural verb.',
      modelAnswer: 'Neither the coach nor the players were satisfied with the practice match.',
      acceptableAlternatives: [
        'Neither the coach nor the players were satisfied with the practice match.',
      ],
      markingGuidance: 'Full 2 marks for correct syntax and plural auxiliary "were".',
      isSubjective: true,
    },
  ];

  const qualityAudit: ChapterQualityAuditReport = {
    overallReadinessScore: 92,
    workflowStatus: 'writing',
    lastAudited: new Date().toISOString(),
    dimensions: {
      content: {
        score: 95,
        status: 'complete',
        notes: 'Comprehensive topic introduction, rule definitions, and progressive theory sections.',
      },
      pedagogy: {
        score: 94,
        status: 'complete',
        notes: 'Clear learning objectives, scaffolded progression from foundation to challenge, and worked examples.',
      },
      visualLearning: {
        score: 88,
        status: 'complete',
        notes: '2 visual assets mapped (Balance Scale & Paradigm Table); 1 additional visual suggested for Intervening Bracket Filter.',
      },
      practice: {
        score: 96,
        status: 'complete',
        notes: '7 graded exercises (A through G) spanning foundation, application, error correction, and contextual proofreading.',
      },
      assessment: {
        score: 90,
        status: 'complete',
        notes: 'Chapter test and aggregated answer key with subjective acceptable alternative evaluation.',
      },
      editorial: {
        score: 92,
        status: 'complete',
        notes: 'Restrained academic voice, consistent linguistic terminology, and thorough exam callout boxes.',
      },
      publishing: {
        score: 88,
        status: 'review',
        notes: 'Visual illustration briefs ready; final layout preview review pending.',
      },
    },
    distinctiveness: {
      score: 94,
      rating: 'High Distinction',
      highlights: [
        'Step-by-step Worked Example with mental bracket method',
        'Inverted "S" Rule clarification distinguishing noun plurals from verb endings',
        'Contextual proofreading exercise simulating authentic school newsletter editing',
        'Academic callout design system avoiding generic SaaS clichés',
      ],
      areasForDeepening: [
        'Consider commissioning custom vector art for the Agreement Balance Scale illustration',
        'Add one more Olympiad-level challenge question on inverted subjunctive concord',
      ],
      recommendations: [
        'Insert Visual Draft for Section 6.3: The X-Ray Bracket Filter',
        'Verify cross-grade alignment with Class 5 introductory concord chapter',
      ],
    },
    repetitionAlerts: [
      {
        conceptName: 'Basic Singular & Plural Concord',
        matchedClassOrEdition: 'Class 5 Chapter 4: Subject-Verb Match',
        similarityScore: 32,
        note: 'Healthy progression: Class 5 focused on concrete pronouns; Class 6 introduces parenthetical intervening phrases.',
        actionSuggestion: 'Keep current treatment—progression is exemplary.',
      },
    ],
    crossGradeProgression: {
      conceptName: 'Subject–Verb Agreement (Concord)',
      previousTreatmentClass5:
        'Class 5: Concrete noun-verb pairing, regular present tense verbs, simple compound subjects joined by "and".',
      currentTreatmentClass6:
        'Class 6 (Active Chapter): Intervening prepositional phrases ("of", "with", "as well as"), correlative proximity ("either...or"), collective nouns, and units of measurement.',
      nextLevelTreatmentClass7:
        'Class 7: Inverted sentences, indefinite quantifiers ("majority of", "none of"), relative pronoun antecedents, and clause-level concord.',
    },
    checklistItems: [
      { id: 'ck-1', label: 'Chapter Opener & Hook finalized', done: true, category: 'Content' },
      { id: 'ck-2', label: 'Definitions and Golden Rules formatted', done: true, category: 'Content' },
      { id: 'ck-3', label: 'Worked Example step-by-step methodology included', done: true, category: 'Pedagogy' },
      { id: 'ck-4', label: 'At least 5 graded exercises created', done: true, category: 'Practice' },
      { id: 'ck-5', label: 'Full Answer Key with rationale prepared', done: true, category: 'Assessment' },
      { id: 'ck-6', label: 'Visual assets and illustration briefs specified', done: true, category: 'Visuals' },
      { id: 'ck-7', label: 'Author notes attached to teacher-sensitive sections', done: true, category: 'Editorial' },
    ],
  };

  return {
    id: 'c6-top-sva',
    editionId: 'ed-cbse-c6',
    systemId: 'CBSE',
    equivalentClass: 'Class 6',
    chapterNumber: 6,
    title: 'Subject–Verb Agreement',
    shortTitle: 'Subject–Verb Agreement',
    subtitle: 'Mastering Number, Person, Intervening Modifiers, and Correlative Concord',
    category: 'Syntax & Concord',
    curriculumTopic: 'Syntax, Concord & Agreement Principles',
    description:
      'A comprehensive pedagogical unit covering grammatical concord, person and number harmony, parenthetical and prepositional modifiers, correlative conjunctions, collective nouns, and inverted syntax.',
    prerequisiteKnowledge:
      'Identification of head nouns, subject personal pronouns (he, she, it, they), and auxiliary verbs (is, are, was, were, has, have).',
    keyVocabulary: [
      'Concord',
      'Grammatical Number',
      'Intervening Phrase',
      'Parenthetical Expression',
      'Proximity Principle',
      'Collective Noun',
      'Indefinite Pronoun',
    ],
    estimatedTeachingTime: '4 Periods (160 mins total)',
    difficultyLevel: 'Medium',
    stageStatuses: {
      setup: 'complete',
      opener: 'complete',
      explanation: 'complete',
      concepts: 'complete',
      examples: 'complete',
      visuals: 'in_progress',
      worked_examples: 'complete',
      common_errors: 'complete',
      exercises: 'complete',
      test: 'in_progress',
      answer_key: 'complete',
      summary: 'complete',
      teacher_notes: 'complete',
      preview: 'in_progress',
      audit: 'complete',
    },
    workflowStatus: 'writing',
    opening,
    sections,
    exercises,
    ending,
    answerKey,
    authorNotes:
      'Chapter 6 is the flagship syntax unit in our CBSE Class 6 series. It bridges primary grammar to secondary examination standards.',
    teacherNotes:
      'Recommend 4 class periods (40 minutes each). Spend Period 1 on Sections 6.1-6.2; Period 2 on Intervening Phrases; Period 3 on Correlatives & Collectives; Period 4 on Exercises D-F.',
    qualityAudit,
    architectureState: {
      governingArchitectureId: 'arch-cbse-middle-grammar',
      inheritanceMode: 'customized',
      lastSyncedAt: new Date().toISOString(),
      customizations: {
        'comp-13': {
          componentId: 'comp-13',
          isCustomized: true,
          customTitle: 'Exercise G: Contextual Editing & Proofreading',
          status: 'complete',
          notes: 'Added extra 7th exercise tier for rigorous board proofreading practice and authenticity.',
        },
      },
    },
    lastSaved: new Date().toISOString(),
    saveStatus: 'saved',
    curriculumBoard: 'CBSE',
    subject: 'English Grammar',
    rules: CANONICAL_SVA_RULES,
    visualBriefs: CANONICAL_SVA_VISUAL_BRIEFS,
    revisionData: CANONICAL_SVA_REVISION_DATA,
    teacherAuthorNotes: CANONICAL_SVA_TEACHER_NOTES,
    productionHistory: [
      {
        status: 'Planning',
        timestamp: '2026-08-15T09:00:00.000Z',
        note: 'Chapter blueprint initialized from CBSE Middle School English Curriculum.',
        author: 'Chief Academic Editor',
      },
      {
        status: 'Writing',
        timestamp: '2026-08-28T14:30:00.000Z',
        note: 'Sections 6.1 through 6.6 authored with worked examples and rule boxes.',
        author: 'Lead Grammar Author',
      },
    ],
  };
}

export const CANONICAL_SVA_RULES: GrammarRuleRecord[] = [
  {
    id: 'rule-sva-1',
    ruleName: '1. Singular Subject + Singular Verb',
    ruleStatement: 'A singular subject takes a singular finite verb.',
    explanation:
      'In standard present tense English, third-person singular verbs end in -s or -es (e.g. walks, arrives, has), whereas regular plural nouns take -s. This inverse inflection is the most frequent source of concord confusion.',
    patternOrFormula: 'Singular Noun / Pronoun (He / She / It / Sing. Noun) + Verb(-s / -es / is / was / has)',
    correctExamples: [
      'The scholar reads meticulously every morning.',
      'The train arrives on Platform 3 precisely at noon.',
      'A diligent student always double-checks her concord.',
    ],
    incorrectExamples: [
      'The scholar read meticulously every morning. [Incorrect in present tense]',
      'The train arrive on Platform 3 precisely at noon.',
    ],
    exceptions: ['The pronouns "I" and "You" take plural base verb forms in the present tense (I read, You read).'],
    commonMisconceptions: [
      'Believing verbs ending in -s are plural because nouns ending in -s are plural.',
    ],
    relatedConcepts: ['Person and Number Inflection', 'Present Simple Tense'],
    difficulty: 'Foundation',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Concord Fundamentals',
    authorNote: 'Ensure students visually contrast noun -s (plural) with verb -s (singular).',
  },
  {
    id: 'rule-sva-2',
    ruleName: '2. Plural Subject + Plural Verb & Compound Subjects',
    ruleStatement: 'A plural subject, or two or more singular subjects joined by "and", takes a plural verb.',
    explanation:
      'When two subjects are coordinated by "and", they form a compound subject with plural syntactic weight. An exception occurs only when both nouns designate a single unified dish, concept, or office (e.g. Bread and butter).',
    patternOrFormula: 'Subject 1 + and + Subject 2 = Plural Verb (base form / are / were / have)',
    correctExamples: [
      'The architects and the engineers have completed the structural draft.',
      'Sunita and her brother play chess together on weekends.',
      'Time and tide wait for no man.',
    ],
    incorrectExamples: [
      'The architect and the engineer has completed the structural draft.',
      'Sunita and her brother plays chess together.',
    ],
    exceptions: [
      'Compound nouns denoting a single concept or dish: "Bread and butter is wholesome breakfast" / "The horse and carriage has arrived at the gate".',
    ],
    commonMisconceptions: [
      'Treating "as well as" or "together with" as identical to "and". Only "and" compounds syntactic number.',
    ],
    relatedConcepts: ['Compound Subjects', 'Coordinating Conjunctions'],
    difficulty: 'Standard',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Compound Concord',
    authorNote: 'Highlight the single-dish exception using classic ICSE exam examples.',
  },
  {
    id: 'rule-sva-3',
    ruleName: '3. Words Between Subject and Verb (Intervening Modifiers)',
    ruleStatement:
      'The number of the subject is not changed by a prepositional phrase, relative clause, or parenthetical expression following the subject.',
    explanation:
      'Words introduced by "of", "with", "along with", "together with", "as well as", "in addition to", and "accompanied by" are syntactically subordinate and do not alter the head noun\'s grammatical number.',
    patternOrFormula: 'Head Subject + [Prepositional / Parenthetical Phrase] + Verb (Agrees with Head Subject)',
    correctExamples: [
      'The bouquet [of scarlet roses] was presented to the chief guest.',
      'The captain, [along with his crew members], has received the gallantry medal.',
      'The quality [of these Kashmiri apples] is unparalleled in the market.',
    ],
    incorrectExamples: [
      'The bouquet of scarlet roses were presented to the chief guest.',
      'The captain, along with his crew members, have received the gallantry medal.',
    ],
    exceptions: [
      'With fraction/percentage expressions ("half of", "majority of", "all of"), the noun in the prepositional phrase determines the verb (e.g. Half of the cake is gone / Half of the apples are spoiled).',
    ],
    commonMisconceptions: [
      'Looking at the noun closest to the verb (proximity trap) rather than tracing back to the head noun.',
    ],
    relatedConcepts: ['Prepositional Phrases', 'Head Noun Identification'],
    difficulty: 'Standard',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Prepositional Modifiers & Parentheticals',
    authorNote: 'Teach the "bracket test": mentally put brackets around the intervening phrase.',
  },
  {
    id: 'rule-sva-4',
    ruleName: '4. Correlative Conjunctions (Either...or, Neither...nor)',
    ruleStatement:
      'When two or more subjects are connected by "or", "nor", "either...or", or "neither...nor", the verb agrees in person and number with the closer subject.',
    explanation:
      'This principle is universally recognized as the Rule of Proximity. The grammatical slot immediately adjacent to the verb governs its inflection.',
    patternOrFormula: 'Either/Neither [Subject 1] or/nor [Subject 2] + Verb (Agrees solely with Subject 2)',
    correctExamples: [
      'Neither the principal nor the teachers were present in the hall.',
      'Either the students or the headmaster is responsible for the announcement.',
      'Neither the players nor the coach was satisfied with the practice match.',
    ],
    incorrectExamples: [
      'Neither the principal nor the teachers was present in the hall.',
      'Either the students or the headmaster are responsible for the announcement.',
    ],
    exceptions: ['When both coordinated nouns are singular, the verb is unconditionally singular (Neither John nor Mary is coming).'],
    commonMisconceptions: [
      'Averaging or combining the two subjects into a plural.',
    ],
    relatedConcepts: ['Correlative Conjunctions', 'Rule of Proximity'],
    difficulty: 'Standard',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Correlative Concord & Proximity',
    authorNote: 'Emphasize that in questions, the subject closer to the auxiliary verb governs agreement.',
  },
  {
    id: 'rule-sva-5',
    ruleName: '5. Collective Nouns (Unitary vs Divided)',
    ruleStatement:
      'A collective noun takes a singular verb when thought of as a single whole, and a plural verb when individual members are thought of as acting separately.',
    explanation:
      'Nouns such as committee, jury, army, family, orchestra, and council denote an assembly. When acting with unanimous, collective agency, singular concord applies. When members act discordantly or perform separate tasks, plural concord is mandated.',
    patternOrFormula: 'Collective Noun (Acting as unit) = Singular Verb | Collective Noun (Divided / individuals) = Plural Verb',
    correctExamples: [
      'The committee has submitted its unanimous recommendation.',
      'The jury were divided in their opinions regarding the forensic evidence.',
      'Our school debate team is travelling to New Delhi today.',
    ],
    incorrectExamples: [
      'The committee have submitted its unanimous recommendation. [Clashing with singular pronoun "its"]',
      'The jury was divided in their opinions. [Mixed grammatical number with "their"]',
    ],
    exceptions: [
      'Some collective nouns always take plural verbs in standard English: cattle, poultry, clergy, people, police.',
    ],
    commonMisconceptions: [
      'Assuming collective nouns must ALWAYS be singular because they look singular.',
    ],
    relatedConcepts: ['Collective Nouns', 'Notional vs Grammatical Concord'],
    difficulty: 'Challenge',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Collective Noun Split Concord',
    authorNote: 'Check pronoun harmony: "its" must pair with singular verbs, "their" with plural verbs.',
  },
  {
    id: 'rule-sva-6',
    ruleName: '6. Indefinite Pronouns (Distributive Singulars)',
    ruleStatement:
      'The words "each", "everyone", "everybody", "neither", "either", "someone", "anybody", and "nobody" are grammatically singular and require singular verbs.',
    explanation:
      'Even when followed by an "of" phrase containing a plural noun (e.g. "Each of the boys"), the head indefinite pronoun remains singular and governs the verb.',
    patternOrFormula: 'Each / Everyone / Neither / Either + [of the + Plural Noun] + Singular Verb',
    correctExamples: [
      'Each of the contestants has practiced for months.',
      'Everyone in the auditorium is awaiting the guest speaker.',
      'Neither of the proposed routes is safe during monsoon.',
    ],
    incorrectExamples: [
      'Each of the contestants have practiced for months.',
      'Neither of the proposed routes are safe during monsoon.',
    ],
    exceptions: [
      'SANAM indefinite pronouns (Some, Any, None, All, More/Most) take singular or plural depending on whether the referent noun is countable or uncountable (Some of the water is gone / Some of the books are damaged).',
    ],
    commonMisconceptions: [
      'Assuming "everyone" and "everybody" are plural because they refer to multiple human beings.',
    ],
    relatedConcepts: ['Indefinite Pronouns', 'Distributives'],
    difficulty: 'Standard',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Distributives & Indefinite Concord',
    authorNote: 'Reinforce that "None" in formal ICSE examination syntax is treated as "not one" (singular) unless plural sense is intended.',
  },
  {
    id: 'rule-sva-7',
    ruleName: '7. Inverted Constructions & Fixed Quantities',
    ruleStatement:
      'In sentences beginning with "here" or "there", or in interrogatives, the subject follows the verb. Fixed sums of money, periods of time, and measurements of distance take singular verbs when considered as single units.',
    explanation:
      'Because "there" and "here" are dummy expletives / adverbs, they never serve as subjects. The author must look past the verb to locate the post-verbal subject. Similarly, "Ten kilometres" is a single continuous distance, taking a singular verb.',
    patternOrFormula: 'There / Here + Verb + [Post-Verbal Subject] | [Plural Quantity of Measurement / Money] + Singular Verb',
    correctExamples: [
      'There are three rare botanical manuscripts in the library archive.',
      'Here is the historical record you requested.',
      'Fifty thousand rupees is a substantial scholarship prize.',
      'Ten kilometres is a formidable distance to hike before sunrise.',
    ],
    incorrectExamples: [
      'There is three rare botanical manuscripts in the library archive.',
      'Fifty thousand rupees are a substantial scholarship prize.',
    ],
    exceptions: [
      'When the units of money or measurement are considered as individual notes/coins: "Fifty silver rupees were scattered across the table."',
    ],
    commonMisconceptions: [
      'Treating "There" or "Here" as the grammatical subject.',
    ],
    relatedConcepts: ['Inverted Syntax', 'Dummy Subjects', 'Nouns of Measurement'],
    difficulty: 'Challenge',
    curriculumMapping: 'CISCE Class 6 Grammar Strand: Inverted Syntax & Expletive There',
    authorNote: 'Teach students to rearrange "There are three books" into "Three books are there" to verify concord.',
  },
];

export const CANONICAL_SVA_VISUAL_BRIEFS: VisualBriefRecord[] = [
  {
    id: 'vis-brief-1',
    visualType: 'educational_illustration',
    title: 'The Concord Balance Scale',
    figureNumber: 'Figure 1.1',
    caption:
      'Figure 1.1: Grammatical equilibrium. When the subject is singular (The Scholar), the verb balances with a singular -s ending (Reads). When the subject turns plural, the verb drops the suffix.',
    altText: 'Schematic illustration of an antique brass balance scale balancing singular noun and verb',
    authorBrief:
      'Visual hook illustrating the counter-intuitive migration of the -s letter between subject noun and finite verb.',
    designerBrief:
      'Classic Renaissance brass mechanical balance scale with calligraphic lettering. Deep burgundy and antique gold tones. Clear legible typography for Class 6 student edition.',
    educationalPurpose:
      'Demystify why plural nouns take -s while present tense singular verbs take -s.',
    placement: 'opener',
    approximateSize: 'quarter_page',
    editionTarget: 'student_and_teacher',
    sourceOrCredit: 'VERITAS Classical Academic Publishing Assets',
    copyrightStatus: 'original_commission',
    productionStatus: 'approved_artwork',
  },
  {
    id: 'vis-brief-2',
    visualType: 'grammar_diagram',
    title: 'The Prepositional Bracket Filter',
    figureNumber: 'Figure 1.2',
    caption:
      'Figure 1.2: The Prepositional Bracket Filter. Modifying phrases enclosed in brackets do not alter the head noun\'s grammatical number.',
    altText: 'Diagram of a sentence showing prepositional phrases enclosed in brackets with an arrow bypassing to the verb',
    authorBrief:
      'Step-by-step schematic showing "The captain [along with his sailors] is ready" with an agreement arrow linking captain to is.',
    designerBrief:
      'Clean architectural line art. Subject linked to verb by a continuous gold line; prepositional phrase shielded inside a semi-transparent tinted bracket box.',
    educationalPurpose:
      'Train students to isolate the head subject from intervening modifiers.',
    placement: 'inline',
    approximateSize: 'quarter_page',
    editionTarget: 'student_and_teacher',
    sourceOrCredit: 'VERITAS Syntax Engine',
    copyrightStatus: 'original_commission',
    productionStatus: 'approved_artwork',
  },
  {
    id: 'vis-brief-3',
    visualType: 'flowchart',
    title: 'Correlative Proximity Decision Tree',
    figureNumber: 'Figure 1.3',
    caption:
      'Figure 1.3: Proximity Decision Flowchart. Step-by-step logic for choosing verb forms with Either...or and Neither...nor.',
    altText: 'Flowchart showing decision paths for either or neither nor sentences',
    authorBrief:
      'Flowchart beginning with identifying correlatives, locating the verb slot, identifying the adjacent noun, and assigning number.',
    designerBrief:
      'Crisp geometric flowchart with elegant rounded rectangular nodes in parchment and ink tones. Clean arrow vectors.',
    educationalPurpose:
      'Provide a fail-safe algorithmic procedure for proximity concord.',
    placement: 'inline',
    approximateSize: 'quarter_page',
    editionTarget: 'student_and_teacher',
    sourceOrCredit: 'VERITAS Pedagogy Lab',
    copyrightStatus: 'original_commission',
    productionStatus: 'approved_artwork',
  },
  {
    id: 'vis-brief-4',
    visualType: 'table',
    title: 'Collective Noun Concord Matrix',
    figureNumber: 'Figure 1.4',
    caption:
      'Figure 1.4: Collective Noun Concord Matrix comparing single unified action vs individual divergent action.',
    altText: 'Comparison table contrasting singular versus plural collective noun sentences',
    authorBrief:
      'Two-column paradigm contrasting: "The jury has reached its verdict" vs "The jury were divided in their opinions".',
    designerBrief:
      'Typeset table with antique gold header and subtle alternating parchment row fills. Bold concord markers.',
    educationalPurpose:
      'Clarify notional concord and pronoun harmony in collective nouns.',
    placement: 'full_width',
    approximateSize: 'quarter_page',
    editionTarget: 'student_and_teacher',
    sourceOrCredit: 'VERITAS Editorial Team',
    copyrightStatus: 'original_commission',
    productionStatus: 'approved_artwork',
  },
];

export const CANONICAL_SVA_REVISION_DATA: ChapterRevisionData = {
  rulesAtAGlance: [
    {
      ruleTitle: '1. Singular with Singular, Plural with Plural',
      summary: 'He walks (singular -s on verb) | They walk (plural base form).',
    },
    {
      ruleTitle: '2. Intervening Modifiers Are Invariant',
      summary: 'The box [of chocolates] is empty. Head noun "box" governs verb.',
    },
    {
      ruleTitle: '3. Additive Phrases Do Not Compound',
      summary: '"Along with", "as well as", and "together with" do not make subjects plural.',
    },
    {
      ruleTitle: '4. Proximity with Either / Neither',
      summary: 'Neither the teacher nor the students were ready. Verb matches closest noun.',
    },
    {
      ruleTitle: '5. Collective Nouns Split on Agency',
      summary: 'Unitary whole = singular (has decided); Divided individuals = plural (were divided).',
    },
    {
      ruleTitle: '6. Distributives Take Singulars',
      summary: 'Each, everyone, neither, either take singular verbs without exception.',
    },
    {
      ruleTitle: '7. Dummy "There" and Quantities',
      summary: 'There are two books (books = subject). Ten kilometres is a long walk.',
    },
  ],
  keyConcepts: [
    'Concord / Grammatical Harmony',
    'Head Noun vs Modifying Noun',
    'Rule of Proximity',
    'Notional vs Formal Concord',
    'Pronoun-Verb Number Harmony',
  ],
  commonMistakes: [
    {
      mistake: 'The quality of these mangoes are good.',
      correction: 'The quality of these mangoes is good.',
      why: 'Head subject is "quality" (singular); "mangoes" is an object of preposition "of".',
    },
    {
      mistake: 'Neither the monitor nor the prefects has arrived.',
      correction: 'Neither the monitor nor the prefects have arrived.',
      why: 'In neither...nor, the verb agrees with the proximate subject "prefects" (plural).',
    },
    {
      mistake: 'One of my cousins live in London.',
      correction: 'One of my cousins lives in London.',
      why: 'Head noun is "One" (singular), requiring "lives".',
    },
    {
      mistake: 'The news are very distressing.',
      correction: 'The news is very distressing.',
      why: '"News" is an uncountable singular noun despite ending in -s.',
    },
  ],
  rememberPoints: [
    'Always mentally cross out intervening prepositional phrases to identify the true head noun.',
    'Verbs in the present tense take -s for singular; nouns take -s for plural.',
    'Only the conjunction "and" creates a compound plural subject; parentheticals like "as well as" do not.',
    'Always check that pronouns (its vs their) match the number of the collective noun.',
  ],
  keyVocabulary: [
    { term: 'Concord', definition: 'The grammatical agreement between words in gender, number, case, or person.' },
    { term: 'Head Noun', definition: 'The central noun of a noun phrase that determines syntactic agreement.' },
    { term: 'Proximity Principle', definition: 'The rule whereby a verb agrees with the noun closest to it in position.' },
    { term: 'Collective Noun', definition: 'A noun denoting a group of individuals considered as a unit or separately.' },
    { term: 'Distributive Pronoun', definition: 'A pronoun referring to members of a group individually (each, either, neither).' },
  ],
  quickCheckQuestions: [
    {
      prompt: 'The bouquet of red roses (was / were) arranged on the mantle.',
      answer: 'was (Head noun "bouquet" is singular)',
    },
    {
      prompt: 'Either the captain or the players (is / are) to blame for the defeat.',
      answer: 'are (Proximate noun "players" is plural)',
    },
    {
      prompt: 'Ten kilometres (is / are) a testing distance to run in humid weather.',
      answer: 'is (Single unit of distance)',
    },
  ],
  revisionExercises: [
    'Exercise A: Foundational Agreement & Form Selection (5 questions)',
    'Exercise B: Intervening Prepositional Traps (4 questions)',
    'Exercise C: Proximity with Correlatives (4 questions)',
    'Exercise D: ICSE Syntactic Transformation Drill (4 questions)',
    'Exercise E: Comprehensive Sentence Rewriting & Error Analysis (4 questions)',
  ],
  challengeQuestions: [
    'Explain why British English permits "The jury were divided" while American English often requires "The jury was divided". Which standard is preferred by CISCE examiners?',
  ],
  selfAssessmentChecklist: [
    { statement: 'I can identify the head noun in sentences with long prepositional phrases.', canDo: true },
    { statement: 'I know when to apply the proximity rule for either...or and neither...nor.', canDo: true },
    { statement: 'I can determine whether a collective noun requires a singular or plural verb.', canDo: true },
    { statement: 'I remember that indefinite pronouns like each and everyone take singular verbs.', canDo: true },
    { statement: 'I can transform sentences while maintaining strictly accurate concord.', canDo: true },
  ],
};

export const CANONICAL_SVA_TEACHER_NOTES: TeacherAuthorNoteRecord[] = [
  {
    id: 'note-1',
    type: 'author_note',
    title: 'Pedagogical Philosophy for Class 6',
    content:
      'Class 6 represents the critical developmental juncture where students transition from auditory intuition to formal syntactic rule mastery. Avoid presenting concord as an arbitrary list of exceptions; frame it as logical balance and partnership.',
    visibility: 'internal_only',
    createdDate: '2026-08-20',
  },
  {
    id: 'note-2',
    type: 'editor_note',
    title: 'CISCE Style & Orthography Standards',
    content:
      'Ensure standard UK/Commonwealth English orthography is maintained across all exercises (e.g. "practised" verb vs "practice" noun, "programme", "travelled"). Avoid Americanized shortcuts.',
    visibility: 'internal_only',
    createdDate: '2026-08-22',
  },
  {
    id: 'note-3',
    type: 'teaching_strategy',
    title: 'The "Pencil Bracket" Intervention Method',
    content:
      'Train students to lightly pencil brackets around every prepositional phrase starting with of, with, along with, or as well as before choosing the verb. This physical action eliminates proximity errors by 85%.',
    visibility: 'teacher_edition',
    createdDate: '2026-08-25',
  },
  {
    id: 'note-4',
    type: 'expected_misconception',
    title: 'The -S Suffix Mirror Confusion',
    content:
      'Students frequently believe that because "books" is plural (with -s), "runs" must also be plural. Spend 10 minutes contrasting noun plurals with 3rd-person singular verb endings.',
    visibility: 'teacher_edition',
    createdDate: '2026-08-25',
  },
  {
    id: 'note-5',
    type: 'differentiation_suggestion',
    title: 'Scaffolding for Emerging Learners',
    content:
      'Provide two-color sentence cards: Subject card in Burgundy, Verb card in Gold. Have students physically connect matching cards to internalize grammatical number concord before written exercises.',
    visibility: 'teacher_edition',
    createdDate: '2026-08-27',
  },
  {
    id: 'note-6',
    type: 'remediation',
    title: 'Remediation Drill for Correlative Proximity',
    content:
      'If students fail Exercise C, conduct a 5-minute board drill swapping the order: "Neither the teacher nor the students..." vs "Neither the students nor the teacher..." to reveal the proximity shift.',
    visibility: 'teacher_edition',
    createdDate: '2026-08-28',
  },
  {
    id: 'note-7',
    type: 'extension_activity',
    title: 'ICSE Olympiad Challenge Task',
    content:
      'Assign advanced students to find five examples of complex concord in the prescribed ICSE English Literature reader (e.g. sentences with inverted syntax or collective nouns) and analyze them for the class.',
    visibility: 'teacher_edition',
    createdDate: '2026-08-29',
  },
];

/**
 * Creates the master demonstration chapter for CISCE Class 6 Classical Grammar:
 * Chapter 1: Subject–Verb Agreement (Concord)
 */
export function createDefaultCisceClass6SubjectVerbAgreementChapter(): StudioChapter {
  const cisceOpening: ChapterOpeningData = {
    chapterNumber: 1,
    title: 'Subject–Verb Agreement: Concord & Syntactic Synthesis',
    subtitle: 'Foundations of Grammatical Concord, Person–Number Harmony & Syntactic Structure',
    openingHook:
      'Consider these two sentences: "The choir sings in perfect unison" versus "The members of the choir sing in different keys." Why does a single group take a singular verb in one sentence, but a plural verb in the next? How do we determine who or what is truly performing the action in a sentence?',
    shortIntroduction:
      'In English grammar, a sentence works like a finely tuned orchestra. Every instrument has its place, and every part must play in harmony. The most vital partnership in any sentence is between the Subject—who or what the sentence is about—and the Finite Verb—the action or state of being. When the subject and verb harmonize in number (singular or plural) and person (first, second, or third), we achieve Concord, also known as Subject–Verb Agreement. In this chapter, we explore how English sentences maintain balance, how to spot the true subject when other words try to distract us, and how to craft sentences with structural precision.',
    estimatedStudyTimeMinutes: 120,
    keyVocabulary: [
      'Subject',
      'Predicate',
      'Finite Verb',
      'Concord',
      'Number',
      'Person',
      'Singular',
      'Plural',
    ],
    conceptsCovered: [
      'Subject Identification',
      'Verb Inflection',
      'Number and Person Harmony',
      'Syntactic Concord',
    ],
    priorKnowledge:
      'Prerequisites for CISCE Class 6:\n1. Subject & Predicate Division: Distinguishing the naming part from the action part in declarative sentences.\n2. Noun Number: Recognizing regular (-s, -es) and irregular plural nouns (children, mice, geese).\n3. Primary Helping Verbs: Familiarity with basic auxiliary forms (is/are, was/were, has/have, does/do).',
    warmUpActivity:
      'The Sentence Repair Workshop (2-Minute Diagnostic Starter)\n\nRead these three pairs of sentences. In each pair, one sentence displays grammatical concord, while the other creates a discord between the subject and verb:\n\n• Pair A:\n  (a) The whistle blows sharply at noon.\n  (b) The whistle blow sharply at noon.\n\n• Pair B:\n  (a) Two noisy squirrels chases each other up the banyan tree.\n  (b) Two noisy squirrels chase each other up the banyan tree.\n\n• Pair C:\n  (a) The players on the field is warming up before the match.\n  (b) The players on the field are warming up before the match.\n\nQuick Diagnostic Task:\n1. Identify the grammatically correct sentence in each pair.\n2. Underline the word or phrase doing the action (the Subject).\n3. Circle the action or state word (the Finite Verb).\n4. In Pair C, identify why the verb does NOT agree with the noun "field".',
    learningObjectives: [
      'Identify the grammatical subject and finite verb across a variety of declarative, interrogative, and imperative sentences.',
      'Recognise singular and plural subjects, distinguishing between singular base nouns and plural inflections (-s, -es, and irregular plurals).',
      'Select verbs that agree grammatically with their subjects in number and person across standard sentence structures.',
      'Apply fundamental agreement rules to simple, compound, and expanded subject constructions.',
      'Identify and correct common subject–verb agreement errors in unedited sentences and contextual paragraphs.',
      'Apply agreement principles accurately in descriptive writing, dialogue composition, and formal sentence synthesis.',
    ],
    discoveryVignette:
      'It was Thursday afternoon in the St. Jude\'s Middle School media room. Ananya and Kabir, the student editors of The Junior Chronicle, were proofreading the front-page draft before sending it to print.\n\nKabir frowned at the opening headline. "Listen to this line, Ananya: \'The captain of the school cricket team have scored three centuries this season.\' Does that sound right to your ear?"\n\nAnanya read the sentence aloud twice. "No, Kabir. Something sounds discordant. Read it again, but pause after each part."\n\n"Well," said Kabir, "we are talking about \'centuries\', which is plural, and \'team\', which has eleven players!"\n\n"Wait," Ananya pointed her pencil at the first three words. "Ask yourself: Who scored the centuries? Was it the entire team, or was it the captain?"\n\n"The captain!" Kabir exclaimed. "Just one person! So if we say \'The captain has scored\', it sounds natural and balanced."\n\n"Exactly," agreed Ananya. "The words \'of the school cricket team\' are just describing which captain we mean. If you take them away, the real sentence is \'The captain has scored\'. But look at line four in our sports report: \'The enthusiastic spectators cheers loudly from the grandstand.\' What happened there?"\n\nKabir grinned. "Now the writer did the opposite! \'Spectators\' is more than one person, but the verb has an \'s\' on the end like a singular noun!"',
    discoveryQuestions:
      'Work with a partner to examine the clues Ananya and Kabir discovered in the newsroom:\n\n1. Subject Hunt: In Kabir\'s first sentence, what is the single key noun (the head subject) performing the action? What words are simply describing that person?\n2. Verb Spotting: What is the verb in "The captain has scored" versus "The players have scored"? What happens to the verb when we change the subject from one person (singular) to several people (plural)?\n3. The \'S\' Mystery: Examine the words \'spectators\' and \'cheers\'. In English, when a noun takes an \'-s\' (like spectators), does its present-tense verb also take an \'-s\'? What rule does your ear discover?\n4. Ear Check: Read these two sentences out loud:\n   (a) The bird sings sweetly in the rain.\n   (b) The birds sing sweetly in the rain.\n   Which word carries the \'-s\' in each sentence? What pattern do you observe about nouns versus verbs?',
    discoveryQuestion:
      'Work with a partner to examine the clues Ananya and Kabir discovered in the newsroom:\n\n1. Subject Hunt: In Kabir\'s first sentence, what is the single key noun (the head subject) performing the action? What words are simply describing that person?\n2. Verb Spotting: What is the verb in "The captain has scored" versus "The players have scored"? What happens to the verb when we change the subject from one person (singular) to several people (plural)?\n3. The \'S\' Mystery: Examine the words \'spectators\' and \'cheers\'. In English, when a noun takes an \'-s\' (like spectators), does its present-tense verb also take an \'-s\'? What rule does your ear discover?\n4. Ear Check: Read these two sentences out loud:\n   (a) The bird sings sweetly in the rain.\n   (b) The birds sing sweetly in the rain.\n   Which word carries the \'-s\' in each sentence? What pattern do you observe about nouns versus verbs?',
  };

  // Component 4: Concept Introduction & Discovery Vignette
  const discoverySection: ChapterSection = {
    id: 'sec-concept-discovery',
    chapterId: 'icse-6-concord',
    title: 'Concept Discovery: The School Newspaper Dilemma',
    numberLabel: '1.1',
    order: 1,
    blocks: [
      {
        id: 'blk-discovery-vignette',
        type: 'text',
        title: 'The Editorial Dilemma',
        order: 1,
        metadata: {
          componentId: 'comp-4',
          stage: 'concept_introduction',
        },
        visibility: 'student',
        textContent:
          'It was Thursday afternoon in the St. Jude\'s Middle School media room. Ananya and Kabir, the student editors of The Junior Chronicle, were proofreading the front-page draft before sending it to print.\n\nKabir frowned at the opening headline. "Listen to this line, Ananya: \'The captain of the school cricket team have scored three centuries this season.\' Does that sound right to your ear?"\n\nAnanya read the sentence aloud twice. "No, Kabir. Something sounds discordant. Read it again, but pause after each part."\n\n"Well," said Kabir, "we are talking about \'centuries\', which is plural, and \'team\', which has eleven players!"\n\n"Wait," Ananya pointed her pencil at the first three words. "Ask yourself: Who scored the centuries? Was it the entire team, or was it the captain?"\n\n"The captain!" Kabir exclaimed. "Just one person! So if we say \'The captain has scored\', it sounds natural and balanced."\n\n"Exactly," agreed Ananya. "The words \'of the school cricket team\' are just describing which captain we mean. If you take them away, the real sentence is \'The captain has scored\'. But look at line four in our sports report: \'The enthusiastic spectators cheers loudly from the grandstand.\' What happened there?"\n\nKabir grinned. "Now the writer did the opposite! \'Spectators\' is more than one person, but the verb has an \'s\' on the end like a singular noun!"',
      },
      {
        id: 'blk-discovery-inquiry',
        type: 'try_this',
        title: 'Notice & Inquire: Guided Discovery Questions',
        order: 2,
        metadata: {
          componentId: 'comp-4',
          stage: 'concept_introduction',
        },
        visibility: 'student',
        textContent:
          'Work with a partner to examine the clues Ananya and Kabir discovered in the newsroom:\n\n1. Subject Hunt: In Kabir\'s first sentence, what is the single key noun (the head subject) performing the action? What words are simply describing that person?\n2. Verb Spotting: What is the verb in "The captain has scored" versus "The players have scored"? What happens to the verb when we change the subject from one person (singular) to several people (plural)?\n3. The \'S\' Mystery: Examine the words \'spectators\' and \'cheers\'. In English, when a noun takes an \'-s\' (like spectators), does its present-tense verb also take an \'-s\'? What rule does your ear discover?\n4. Ear Check: Read these two sentences out loud:\n   (a) The bird sings sweetly in the rain.\n   (b) The birds sing sweetly in the rain.\n   Which word carries the \'-s\' in each sentence? What pattern do you observe about nouns versus verbs?',
      },
    ],
  };

  return {
    id: 'icse-6-concord',
    editionId: 'ed-icse-c6',
    systemId: 'CISCE',
    equivalentClass: 'Class 6',
    chapterNumber: 1,
    title: 'Subject–Verb Agreement: Concord & Syntactic Synthesis',
    shortTitle: 'Subject–Verb Agreement',
    subtitle: 'Foundations of Grammatical Concord, Person–Number Harmony & Syntactic Structure',
    bookTitle: 'Classical Grammar: ICSE Class 6',
    seriesTitle: 'Grammar in Action: Tri-Board English Series',
    category: 'Syntax & Concord',
    curriculumTopic: 'Subject-Verb Concord (Foundations, Person-Number Harmony & Intervening Modifiers)',
    grammarStrand: 'Verbal Syntax & Concord',
    targetPageRange: 'pp. 14–25 (12 pages)',
    targetPageCount: 12,
    estimatedPageCount: 3.5,
    description:
      'CISCE Class 6 foundational chapter covering subject-verb concord, head noun identification, and syntactic harmony.',
    prerequisiteKnowledge:
      'Subject & predicate division, noun number, and primary auxiliary verbs.',
    keyVocabulary: [
      'Subject',
      'Predicate',
      'Finite Verb',
      'Concord',
      'Number',
      'Person',
      'Singular',
      'Plural',
    ],
    estimatedTeachingTime: '4 Periods (160 minutes total)',
    difficultyLevel: 'Medium',
    opening: cisceOpening,
    sections: [discoverySection],
    // Components 5–23 are intentionally unauthored for this controlled authoring test
    rules: [],
    exercises: [],
    ending: {
      whatYouLearned: [],
      rulesAtAGlance: [],
      commonMistakes: [],
      quickRevisionChecklist: [],
      keyVocabulary: [],
      examReminders: [],
    },
    chapterTest: undefined,
    visualBriefs: [],
    revisionData: undefined,
    teacherAuthorNotes: [],
    productionHistory: [
      {
        status: 'Writing',
        timestamp: new Date().toISOString(),
        note: 'Controlled authoring test: Components 1–4 authored. Components 5–23 unstarted.',
        author: 'Lead Classical Grammar Author',
      },
    ],
    curriculumBoard: 'CISCE',
    subject: 'English Grammar',
    architectureId: 'arch-cisce-middle-grammar',
    architectureState: {
      governingArchitectureId: 'arch-cisce-middle-grammar',
      inheritanceMode: 'inherited',
      lastSyncedAt: new Date().toISOString(),
      customizations: {},
    },
    stageStatuses: {
      setup: 'complete',
      opener: 'complete',
      objectives: 'complete',
      warm_up: 'complete',
      concept_intro: 'complete',
      explanation: 'not_started',
      rules: 'not_started',
      concepts: 'not_started',
      examples: 'not_started',
      visuals: 'not_started',
      worked_examples: 'not_started',
      common_errors: 'not_started',
      exercises: 'not_started',
      assessment: 'not_started',
      test: 'not_started',
      answer_key: 'not_started',
      summary: 'not_started',
      teacher_notes: 'not_started',
      student_preview: 'in_progress',
      teacher_preview: 'in_progress',
      preview: 'in_progress',
      audit: 'not_started',
    },
    workflowStatus: 'writing',
    authorNotes:
      'Controlled authoring phase: Components 1–4 complete. Components 5–23 awaiting drafting.',
    teacherNotes:
      'Teacher Notes (Components 1–4 Scope):\n- Opener: Emphasize the orchestral metaphor to explain concord as harmonious partnership.\n- Warm-Up: Diagnostic Starter Pair C highlights the proximity trap (players on the field) before formal rules are introduced.\n- Concept Discovery: Conduct paired dialogue reading to inductively expose the inverse "-s" pattern.',
    lastSaved: new Date().toISOString(),
    saveStatus: 'saved',
  };
}

/**
 * Converts a standard GrammarTopic into a StudioChapter if not already initialized.
 */
export function convertTopicToStudioChapter(
  topic: GrammarTopic,
  classLevel: GrammarClassLevel = topic.classLevel || 'Class 6',
  systemId: CurriculumSystemId = 'CBSE',
  editionId?: string
): StudioChapter {
  // Pre-authored flagship demonstration chapters are ONLY used for their explicit canonical IDs
  if (topic.id === 'icse-6-concord') {
    if (
      topic.studioChapter &&
      (topic.studioChapter.rules?.length || 0) === 0 &&
      topic.studioChapter.sections?.some((s) => s.id === 'sec-concept-discovery')
    ) {
      return sanitizeChapterDataIntegrity(topic.studioChapter, topic.id).chapter;
    }
    const demo = createDefaultCisceClass6SubjectVerbAgreementChapter();
    demo.id = topic.id;
    demo.equivalentClass = classLevel;
    demo.systemId = 'CISCE';
    demo.editionId = editionId || 'ed-icse-c6';
    return sanitizeChapterDataIntegrity(demo, topic.id).chapter;
  }

  if (topic.studioChapter) {
    return sanitizeChapterDataIntegrity(topic.studioChapter, topic.id).chapter;
  }

  if (topic.id === 'cbse-6-sva') {
    const demo = createDefaultCbseClass6SubjectVerbAgreementChapter();
    demo.id = topic.id;
    demo.equivalentClass = classLevel;
    demo.systemId = systemId;
    demo.editionId = editionId || `ed-${systemId.toLowerCase()}-${classLevel.toLowerCase().replace(' ', '')}`;
    return sanitizeChapterDataIntegrity(demo, topic.id).chapter;
  }

  // Check topic domains to prevent cross-topic content pollution
  const isNounsChapter = /\bnoun(s)?\b|\bnaming word(s)?\b/i.test(topic.title);
  const isSvaChapter = /subject.*verb|verb.*subject|concord|syntactic synthesis/i.test(topic.title);

  // If this is an SVA chapter (such as an adapted variant c3-top-1-cisce), ensure no foreign Noun text leaks in
  const hasForeignNounOverview = !isNounsChapter && /\bnoun\b|\bnaming word\b/i.test(topic.overview || '');
  const hasForeignNounObjectives = !isNounsChapter && (topic.learningObjectives || []).some((o) => /\bnoun\b/i.test(o));

  const resolvedCategory =
    isSvaChapter && (!topic.category || topic.category === 'Parts of Speech' || /noun/i.test(topic.category))
      ? 'Syntax & Concord'
      : topic.category || 'Grammar';

  const rawSubtitle = (topic as any).subtitle || (topic as any).subTitle;
  const defaultSubtitle =
    rawSubtitle && !/parts\s*of\s*speech|class\s*3/i.test(rawSubtitle)
      ? rawSubtitle
      : isSvaChapter
      ? 'Concord & Syntactic Synthesis'
      : '';

  const defaultOpening: ChapterOpeningData = {
    chapterNumber: topic.order || 1,
    title: topic.title,
    subtitle: defaultSubtitle,
    shortIntroduction: hasForeignNounOverview
      ? ''
      : topic.overview ||
        (isNounsChapter
          ? 'Ravi and his sister Maya visited the City Zoo on Sunday. They watched a playful monkey swinging from branch to branch. Ravi pointed and said, "Look at that monkey!" Maya smiled and named every animal they passed.'
          : ''),
    openingHook: isNounsChapter
      ? 'Notice the words in bold: Ravi, Maya, zoo, monkey, animal. Which of these are names of special people, and which are general names of places and animals?'
      : '',
    learningObjectives:
      hasForeignNounObjectives
        ? []
        : topic.learningObjectives && topic.learningObjectives.length > 0
        ? topic.learningObjectives
        : [],
    keyVocabulary: [topic.title],
    conceptsCovered: [topic.title],
    estimatedStudyTimeMinutes: 90,
  };

  const defaultEnding: ChapterEndingData = {
    whatYouLearned: [],
    rulesAtAGlance: [],
    commonMistakes: [],
    quickRevisionChecklist: [],
    keyVocabulary: [topic.title],
    examReminders: [],
    summaryPoints: [],
  };

  // Convert definitions to sections only if they belong to this topic domain
  const sections: ChapterSection[] = [];
  const validDefinitions = (topic.definitions || []).filter((def) => {
    if (!isNounsChapter && /\bnoun\b/i.test(def.term || '')) {
      return false; // foreign definition from a different chapter
    }
    return true;
  });

  if (validDefinitions.length > 0) {
    validDefinitions.forEach((def, idx) => {
      const blocks: TextbookContentBlock[] = [
        {
          id: `blk-${def.id}-1`,
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent: def.ageAppropriateExplanation,
        },
        {
          id: `blk-${def.id}-2`,
          type: 'grammar_rule',
          order: 2,
          visibility: 'student',
          title: def.term,
          calloutTitle: `RULE: ${def.term.toUpperCase()}`,
          calloutText: def.rules?.join('\n\n') || '',
        },
      ];

      if (def.examples && def.examples.length > 0) {
        blocks.push({
          id: `blk-${def.id}-3`,
          type: 'example_set',
          order: 3,
          visibility: 'student',
          title: `${def.term} Examples`,
          exampleData: {
            type: 'simple',
            items: def.examples.map((ex, i) => ({
              id: `ex-${def.id}-${i}`,
              sentence: ex.sentence,
              highlightWord: ex.highlightWord,
              note: ex.note,
              isCorrect: true,
            })),
          },
        });
      }

      if (def.commonMistakes && def.commonMistakes.length > 0) {
        def.commonMistakes.forEach((cm, i) => {
          blocks.push({
            id: `blk-${def.id}-cm-${i}`,
            type: 'common_error',
            order: 4 + i,
            visibility: 'student',
            commonError: {
              incorrectSentence: cm.incorrect,
              correctSentence: cm.correct,
              explanation: cm.reason,
              mistakeType: 'Common Usage Mistake',
            },
          });
        });
      }

      sections.push({
        id: `sec-${def.id}`,
        chapterId: topic.id,
        numberLabel: `1.${idx + 1}`,
        title: def.term,
        order: idx + 1,
        blocks,
      });
    });
  } else if (topic.notesAndTheoryMarkdown && (!isSvaChapter || !/\bnoun\b/i.test(topic.notesAndTheoryMarkdown))) {
    sections.push({
      id: `sec-${topic.id}-1`,
      chapterId: topic.id,
      numberLabel: '1.1',
      title: 'Introduction & Core Concepts',
      order: 1,
      blocks: [
        {
          id: `blk-${topic.id}-intro`,
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent: topic.notesAndTheoryMarkdown,
        },
      ],
    });
  }

  // Filter and convert exercises (exclude foreign Noun exercises from SVA chapters)
  const validTopicExercises = (topic.exercises || []).filter((ex) => {
    if (!isNounsChapter && (/\bnoun\b/i.test(ex.title || '') || (ex.id && ex.id.startsWith('c3-ex')))) {
      return false;
    }
    return true;
  });

  const studioExercises: StudioExercise[] = validTopicExercises.map((ex, idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const letter = letters[idx] || `${idx + 1}`;
    const progressions = [
      'foundation',
      'understanding',
      'application',
      'error_analysis',
      'transformation',
      'contextual',
      'challenge',
    ] as const;
    const progression = progressions[idx % progressions.length];

    return {
      id: ex.id,
      letter,
      title: normalizeExerciseTitle(ex.title, letter),
      chapterId: topic.id,
      progression,
      instructions: ex.instructions,
      difficulty: 'Medium',
      suggestedMarks: ex.maxMarks || 5,
      questionCount: ex.questions ? ex.questions.length : 0,
      questions: (ex.questions || []).map((q) => ({
        ...q,
        exerciseId: ex.id,
      })),
    };
  });
  return sanitizeChapterDataIntegrity(
    {
      id: topic.id,
      editionId,
      systemId,
      equivalentClass: classLevel,
      curriculumBoard: (topic as any).curriculumBoard || (topic as any).board || systemId,
      subject: (topic as any).subject || (resolvedCategory && !/grammar|syntax/i.test(resolvedCategory) ? resolvedCategory : 'English Grammar'),
      unitId: topic.unitId || 'u-1',
      unitTitle:
        topic.unitTitle && !/naming\s*word|parts\s*of\s*speech/i.test(topic.unitTitle)
          ? topic.unitTitle
          : isSvaChapter
          ? (systemId === 'CISCE' ? 'Unit 1: Verbal Syntax & Concord (ICSE Foundation)' : 'Unit 1: Verbal Syntax & Concord')
          : isNounsChapter
          ? 'Unit 1: The World of Naming Words (Nouns)'
          : resolvedCategory
          ? `Unit 1: ${resolvedCategory}`
          : 'Unit 1: Core Grammar Foundations',
      chapterNumber: topic.order || 1,
      title: topic.title,
      subtitle: defaultSubtitle,
      category: resolvedCategory,
      workflowStatus: 'writing',
      opening: defaultOpening,
      sections,
      exercises: studioExercises,
      chapterTest: topic.testSeries && topic.testSeries.length > 0 ? topic.testSeries[0] : undefined,
      ending: defaultEnding,
      answerKey: [],
      architectureState: {
        governingArchitectureId: systemId === 'CISCE' ? 'arch-cisce-middle-grammar' : 'arch-cbse-middle-grammar',
        inheritanceMode: 'inherited',
        lastSyncedAt: new Date().toISOString(),
        customizations: {},
      },
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    },
    topic.id
  ).chapter;
}

/**
 * Syncs changes made inside the Chapter Authoring Studio back to the parent GrammarTopic
 * so existing Question Bank, Assessment Builder, Quiz Runner, and Exporter work automatically!
 */
export function syncStudioChapterToTopic(
  studioChapter: StudioChapter,
  topic: GrammarTopic
): GrammarTopic {
  // Aggregate questions back into topic exercises
  const updatedExercises = studioChapter.exercises.map((se) => ({
    id: se.id,
    title: `Exercise ${se.letter}: ${se.title}`,
    instructions: se.instructions,
    targetType: 'mixed' as const,
    maxMarks: se.suggestedMarks,
    questions: se.questions,
  }));

  // Rebuild notes markdown from text blocks for backward compatibility
  const reconstructedMarkdown = studioChapter.sections
    .map((s) => {
      const sectionHeader = `### ${s.numberLabel ? `${s.numberLabel} ` : ''}${s.title}\n\n`;
      const blockTexts = s.blocks
        .map((b) => {
          if (b.type === 'text') return b.textContent || '';
          if (b.type === 'grammar_rule') return `**${b.calloutTitle || 'RULE'}:** ${b.calloutText || ''}\n`;
          if (b.type === 'remember' || b.type === 'grammar_tip' || b.type === 'watch_out') {
            return `> **${b.calloutTitle || 'NOTE'}:** ${b.calloutText || ''}\n`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');
      return `${sectionHeader}${blockTexts}`;
    })
    .join('\n\n---\n\n');

  return {
    ...topic,
    title: studioChapter.title,
    overview: studioChapter.opening.shortIntroduction,
    learningObjectives: studioChapter.opening.learningObjectives,
    notesAndTheoryMarkdown: reconstructedMarkdown,
    exercises: updatedExercises,
    testSeries: studioChapter.chapterTest
      ? [studioChapter.chapterTest]
      : topic.testSeries,
    studioChapter,
  };
}

/**
 * Visual Suggestion Intelligence: Pedagogical visual generator
 * Proposes pedagogically sound visual concepts, explains why they help, and writes an illustration brief.
 */
export function suggestVisualPedagogy(
  sectionTitle: string,
  topicTitle: string,
  classLevel: string
): {
  id: string;
  title: string;
  visualType: VisualBlockData['visualType'];
  conceptDemonstrated: string;
  leftOrStep1: string;
  rightOrStep2: string;
  whyThisVisualHelps: string;
  illustrationBrief: string;
}[] {
  const normalized = `${sectionTitle} ${topicTitle}`.toLowerCase();

  if (normalized.includes('subject') || normalized.includes('agreement') || normalized.includes('concord')) {
    return [
      {
        id: 'vis-idea-1',
        title: 'The Agreement Balance Scale',
        visualType: 'diagram',
        conceptDemonstrated: 'Counter-intuitive -s migration between nouns and verbs',
        leftOrStep1: 'Left Pan: Singular Subject (The scholar) + Right Pan: Singular Verb with Gold -s (writes)',
        rightOrStep2: 'Left Pan: Plural Subject with Gold -s (The scholars) + Right Pan: Base Verb without -s (write)',
        whyThisVisualHelps:
          'Students frequently associate the letter -s exclusively with plurals. This visual contrast proves graphically that only one side of the scale carries the regular -s suffix.',
        illustrationBrief:
          'A clean dual-pan laboratory balance scale with elegant serif typography. When the left pan is singular, the right pan lights up a golden -s symbol. When the left pan pluralizes, the golden -s shifts to the subject side.',
      },
      {
        id: 'vis-idea-2',
        title: 'The Prepositional Bracket Filter (X-Ray)',
        visualType: 'sentence_diagram',
        conceptDemonstrated: 'Filtering out intervening phrases like "of", "with", "along with"',
        leftOrStep1: 'Sentence: "The bouquet [of red roses] was presented."',
        rightOrStep2: 'A tinted blue translucent bracket isolates [of red roses], leaving a direct glowing arrow connecting "bouquet" to "was".',
        whyThisVisualHelps:
          'Proximity bias makes students select verbs matching the closest noun. The mental bracket filter trains the student eye to see the sentence architecture rather than surface sequence.',
        illustrationBrief:
          'A calligraphic sentence where the intervening phrase sits inside a modern frosted glass bracket with a 50% opacity mask, while an electric indigo arc connects the head noun directly to the finite verb.',
      },
      {
        id: 'vis-idea-3',
        title: 'The Proximity Magnet (Either...Or)',
        visualType: 'concept_map',
        conceptDemonstrated: 'The Rule of Proximity with correlative conjunctions',
        leftOrStep1: 'Subject 1 (Far away): Minimal magnetic pull on the verb.',
        rightOrStep2: 'Subject 2 (Adjacent): Strong magnetic field lines drawing the verb into identical number/person.',
        whyThisVisualHelps:
          'Gives students an intuitive physical metaphor for why the closer subject wins in correlative sentences.',
        illustrationBrief:
          'A stylized horseshoe magnet labeled "Finite Verb" whose field lines pull strongly toward the closer subject noun while the distant first subject remains outside the field.',
      },
    ];
  }

  if (normalized.includes('tense') || normalized.includes('time') || normalized.includes('verb')) {
    return [
      {
        id: 'vis-idea-4',
        title: 'The Linear Aspect Timeline',
        visualType: 'flowchart',
        conceptDemonstrated: 'Past Simple vs Present Perfect vs Past Perfect',
        leftOrStep1: 'Point in time (Specific finished moment)',
        rightOrStep2: 'Bridge from past to present (Continuing relevance)',
        whyThisVisualHelps:
          'Students confuse "has done" with "did". A visual timeline showing the anchor moment versus the ongoing bridge clarifies aspect instantly.',
        illustrationBrief:
          'A clean horizontal axis with a vertical marker at "Now / Present". Past simple is a discrete red pin; present perfect is a shaded gradient spanning from the past up to the present marker.',
      },
    ];
  }

  // Default visual suggestions
  return [
    {
      id: 'vis-idea-def',
      title: `${topicTitle}: Structural Rule Flowchart`,
      visualType: 'flowchart',
      conceptDemonstrated: `Step-by-step decision tree for applying ${topicTitle}`,
      leftOrStep1: 'Step 1: Check sentence context and identify parts of speech.',
      rightOrStep2: 'Step 2: Apply the governing rule and verify the resulting sentence.',
      whyThisVisualHelps:
        'A sequential flowchart breaks down complex grammatical decision-making into concrete logical steps suitable for examination revision.',
      illustrationBrief:
        'A clean vertical flowchart with diamond decision nodes and rounded rectangular action steps styled in navy blue and warm amber.',
    },
  ];
}

/**
 * Author AI Copilot actions simulator & pedagogical prompt assistant
 */
export function runAuthorAiCopilotAction(
  actionType: string,
  selectedText: string,
  classLevel: string,
  chapterTitle: string
): {
  actionLabel: string;
  proposedContent: string;
  rationale: string;
  pedagogicalBenefit: string;
} {
  switch (actionType) {
    case 'explain_more_clearly':
      return {
        actionLabel: 'Explain More Clearly',
        proposedContent:
          selectedText
            ? `To make this rule crystal clear for ${classLevel} students: Think of a sentence like a sports team where the subject is the captain and the verb is the play. If there is one captain (singular), the action takes singular form. When modifying words step between them, imagine them wearing a different jersey—they do not change what the captain does!`
            : `Concord means grammatical harmony. When the subject is singular (one person or thing), the verb must also be singular. When the subject is plural (two or more), the verb must also be plural. Never let words in between confuse your count!`,
        rationale:
          'Replaced abstract syntactic terminology with a concrete visual analogy tailored to students.',
        pedagogicalBenefit:
          'Reduces cognitive load and anchors grammatical theory in a memorable mental model.',
      };

    case 'simplify_for_stage':
      return {
        actionLabel: `Simplify for ${classLevel}`,
        proposedContent:
          selectedText
            ? `Let's break this down simply: 1) Find who or what is doing the action. 2) Ask: is it ONE or MORE THAN ONE? 3) Match your verb ending to that answer.`
            : `Singular means ONE. Plural means MORE THAN ONE. Keep your subject and verb in agreement.`,
        rationale: `Reduced complex clause structures into 3 actionable steps suitable for ${classLevel}.`,
        pedagogicalBenefit: 'Prevents frustration for struggling and foundation-tier learners.',
      };

    case 'make_more_advanced':
      return {
        actionLabel: 'Make More Advanced / Olympiad Level',
        proposedContent:
          `In advanced syntax, subject-verb concord is governed not only by morphological number but also by semantic agreement (notional concord) and the principle of proximity. When collective nouns or quantifiers (*the majority of*, *none of*) enter the clause, syntactic concord and notional concord may diverge based on whether the referent is discrete or mass.`,
        rationale: 'Elevated vocabulary and introduced formal syntactic concepts.',
        pedagogicalBenefit: 'Prepares advanced students for competitive Olympiads and ICSE Paper 1 nuance.',
      };

    case 'suggest_example':
      return {
        actionLabel: 'Suggest Contextual Examples',
        proposedContent:
          `1. Correct: The flock of migratory Siberian cranes has landed near the lake.\n   (Subject is "flock" [singular], not "cranes").\n\n2. Correct: Neither the captain nor the crew members were frightened by the storm.\n   (Proximity: "crew members" is plural and closer to the verb).`,
        rationale: 'Generated high-interest natural science and adventure examples.',
        pedagogicalBenefit: 'Engages student interest far better than generic "The boy walks" sentences.',
      };

    case 'suggest_common_errors':
      return {
        actionLabel: 'Suggest Common Errors & Traps',
        proposedContent:
          `Common Trap 1: "One of my brothers are in the navy."\nCorrection: "One of my brothers IS in the navy." (Head noun is "One").\n\nCommon Trap 2: "Economics are my favorite subject."\nCorrection: "Economics IS my favorite subject." (Subject of study ends in -s but is singular).`,
        rationale: 'Targeted the two highest-frequency error patterns in school examinations.',
        pedagogicalBenefit: 'Provides inoculation against predictable board exam traps.',
      };

    case 'author_voice_analysis':
      return {
        actionLabel: 'Author Voice & Tone Check',
        proposedContent:
          `Voice Assessment:\n- Tone: Authoritative, academic, and encouraging.\n- Reading Ease: Optimal for ${classLevel} (FK Grade Level ~6.2).\n- Linguistic Consistency: Excellent adherence to standard British/Indian grammar nomenclature.\n- Recommendation: Ensure that Latin terms like "concordia" are immediately explained so readers stay engaged.`,
        rationale: 'Comprehensive stylistic and register evaluation of the active textbook prose.',
        pedagogicalBenefit: 'Protects the human authorial voice and prevents robotic AI-style homogenization.',
      };

    default:
      return {
        actionLabel: 'Grammar Accuracy Review',
        proposedContent:
          'Grammar and syntax in the highlighted passage conform strictly to standard formal curriculum standards.',
        rationale: 'Verified against prescriptive and descriptive academic reference grammars.',
        pedagogicalBenefit: 'Guarantees unassailable publishing accuracy.',
      };
  }
}
