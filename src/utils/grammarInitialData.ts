import { GrammarSeriesProject, GrammarClassLevel, ClassCurriculumBook } from '../types';
import { getDefaultCurriculumMatrix } from './spiralMatrixData';
import {
  getInitialMultiBoardEditions,
  MASTER_GRAMMAR_CONCEPTS,
  detectDuplications,
  detectCurriculumGaps,
} from './multiBoardData';
import { getInitialBookProjects } from './bookProjectUtils';

export function getInitialGrammarSeriesProject(): GrammarSeriesProject {
  const allClassLevels: GrammarClassLevel[] = [
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

  const books: Record<GrammarClassLevel, ClassCurriculumBook> = {
    'Class 1': {
      classLevel: 'Class 1',
      title: 'Foundational English Words & Sentences: Class 1',
      ageBracket: 'Ages 5–6 (Foundational)',
      boardStandards: 'CBSE Foundational / CISCE Primary / Cambridge Stage 1 Aligned',
      description: 'Oral-to-written language transition, naming words, action words, basic capitalization, and full stops through illustrated picture activities.',
      pedagogicalFocus: 'Concrete vocabulary, picture-based associations, spoken language reinforcement, naming words (nouns), doing words (verbs), and initial sentence sense.',
      topics: [
        {
          id: 'c1-top-1',
          title: 'Naming Words: People, Places, Animals & Things',
          category: 'Parts of Speech',
          classLevel: 'Class 1',
          overview: 'Discover that every person, animal, place, and thing has a naming word (noun).',
          learningObjectives: [
            'Spot naming words for people (boy, teacher, mother)',
            'Identify naming words for animals and objects with picture cards',
            'Sort naming words into people, animals, places, and things',
          ],
          definitions: [
            {
              id: 'c1-def-1',
              term: 'Naming Word (Noun)',
              partOfSpeechOrCategory: 'Part of Speech',
              ageAppropriateExplanation: 'A naming word tells us what someone or something is called, like cat, boy, park, or ball.',
              rules: ['A naming word names a person, place, animal, or thing.'],
              examples: [{ sentence: 'The cat sits on the mat.', highlightWord: 'cat', note: 'Naming word for an animal' }],
              commonMistakes: [{ incorrect: 'Run is a naming word.', correct: 'Run is an action word. Boy is a naming word.', reason: 'Do not confuse naming words with actions.' }],
            },
          ],
          notesAndTheoryMarkdown: `### Naming Words (Class 1)\n\nEverything in our world has a name! People, animals, places, and things have naming words.`,
          exercises: [],
          testSeries: [],
        },
        {
          id: 'c1-top-2',
          title: 'Capital Letters and Full Stops',
          category: 'Sentence Structure',
          classLevel: 'Class 1',
          overview: 'Learn that a sentence begins with a capital letter and ends with a full stop.',
          learningObjectives: [
            'Start every written sentence with a capital letter',
            'Put a full stop at the end of a sentence',
            'Always write the word "I" as a capital letter',
          ],
          definitions: [
            {
              id: 'c1-def-2',
              term: 'Full Stop',
              partOfSpeechOrCategory: 'Punctuation',
              ageAppropriateExplanation: 'A full stop is a small dot (.) placed at the end of a complete sentence.',
              rules: ['Every telling sentence ends with a full stop.'],
              examples: [{ sentence: 'I like apples.', highlightWord: '.', note: 'Full stop at the end' }],
              commonMistakes: [{ incorrect: 'i like apples', correct: 'I like apples.', reason: 'Sentences must begin with a capital letter and end with a full stop.' }],
            },
          ],
          notesAndTheoryMarkdown: `### Capital Letters and Full Stops (Class 1)\n\nEvery sentence starts with a big capital letter and finishes with a neat full stop.`,
          exercises: [],
          testSeries: [],
        },
      ],
    },
    'Class 2': {
      classLevel: 'Class 2',
      title: 'Step-by-Step English Grammar: Class 2',
      ageBracket: 'Ages 6–7 (Foundational)',
      boardStandards: 'CBSE Foundational / CISCE Primary / Cambridge Stage 2 Aligned',
      description: 'Foundational sentence framing, personal pronouns, common vs proper naming words, question marks, and singular/plural.',
      pedagogicalFocus: 'Simple complete sentences, singular and plural (-s, -es), pronouns (I, you, he, she, it, we, they), question marks, and action words with -ing.',
      topics: [
        {
          id: 'c2-top-1',
          title: 'Singular and Plural Nouns (One and Many)',
          category: 'Parts of Speech',
          classLevel: 'Class 2',
          overview: 'Understand the difference between one (singular) and more than one (plural) by adding -s or -es.',
          learningObjectives: [
            'Change single naming words to plural by adding -s (book -> books)',
            'Identify words needing -es (bus -> buses, box -> boxes)',
            'Use singular and plural words accurately in simple sentences',
          ],
          definitions: [
            {
              id: 'c2-def-1',
              term: 'Singular and Plural',
              partOfSpeechOrCategory: 'Grammar Concept',
              ageAppropriateExplanation: 'Singular means one person or thing. Plural means two or more people or things.',
              rules: ['Add -s or -es to naming words to show more than one.'],
              examples: [{ sentence: 'One dog, two dogs.', highlightWord: 'dogs', note: 'Plural form' }],
              commonMistakes: [{ incorrect: 'Two dog are playing.', correct: 'Two dogs are playing.', reason: 'Use the plural form when counting more than one.' }],
            },
          ],
          notesAndTheoryMarkdown: `### Singular and Plural: One and Many (Class 2)\n\nWhen we have one, it is singular. When we have more than one, we add **-s** or **-es**!`,
          exercises: [],
          testSeries: [],
        },
        {
          id: 'c2-top-2',
          title: 'Pronouns: Words in Place of Nouns',
          category: 'Parts of Speech',
          classLevel: 'Class 2',
          overview: 'Learn to use words like he, she, it, and they so we do not have to repeat names.',
          learningObjectives: [
            'Use he for boys and men',
            'Use she for girls and women',
            'Use it for animals and things, and they for groups',
          ],
          definitions: [
            {
              id: 'c2-def-2',
              term: 'Pronoun',
              partOfSpeechOrCategory: 'Part of Speech',
              ageAppropriateExplanation: 'A pronoun is a small helper word that takes the place of a naming word.',
              rules: ['Replace repeated names with pronouns like he, she, it, or they.'],
              examples: [{ sentence: 'Rohan has a ball. He likes to play with it.', highlightWord: 'He', note: 'Pronoun replaces Rohan' }],
              commonMistakes: [{ incorrect: 'Pooja is good. He sings well.', correct: 'Pooja is good. She sings well.', reason: 'Use she for girls and women.' }],
            },
          ],
          notesAndTheoryMarkdown: `### Pronouns (Class 2)\n\nPronouns take the place of naming words so we don't have to repeat names over and over!`,
          exercises: [],
          testSeries: [],
        },
      ],
    },
    'Class 3': {
      classLevel: 'Class 3',
      title: 'Step-by-Step English Grammar: Class 3',
      ageBracket: 'Ages 8–9 (Primary)',
      boardStandards: 'CBSE / ICSE / Common Core Grade 3',
      description: 'Foundational grammar introducing parts of speech, naming words, doing words, and sentence building through visual, relatable examples.',
      pedagogicalFocus: 'Concrete vocabulary, single-clause sentences, picture-based associations, capitalization, and punctuation.',
      units: [
        {
          id: 'u-c3-1',
          unitNumber: 1,
          order: 1,
          chapterIds: ['c3-top-1'],
          title: 'Unit 1: The World of Naming Words (Nouns)',
          description: 'Exploring naming words for people, animals, places, and things, with common and proper distinctions.',
        },
      ],
      topics: [
        {
          id: 'c3-top-1',
          unitId: 'u-c3-1',
          unitTitle: 'Unit 1: The World of Naming Words (Nouns)',
          order: 1,
          title: 'Nouns: Naming Words (Common & Proper)',
          category: 'Parts of Speech',
          classLevel: 'Class 3',
          overview: 'Understand that nouns are words used to name people, places, animals, and things, and distinguish between common and proper nouns.',
          learningObjectives: [
            'Identify nouns in short sentences',
            'Distinguish between common nouns and special proper nouns',
            'Always capitalize proper nouns',
          ],
          definitions: [
            {
              id: 'c3-def-1',
              term: 'Noun',
              partOfSpeechOrCategory: 'Part of Speech',
              ageAppropriateExplanation: 'A noun is a naming word. It names a person, an animal, a place, or a thing.',
              formulaOrSyntax: 'Noun = Person | Place | Animal | Thing',
              rules: [
                'Common nouns name general things (e.g. boy, dog, park).',
                'Proper nouns name special names of persons, cities, days, or months and must start with a capital letter (e.g. Rohan, London, Sunday).',
              ],
              examples: [
                { sentence: 'The cat jumped over the wooden fence.', highlightWord: 'cat, fence', note: 'Both are naming words (animals and things).' },
                { sentence: 'Priya visited Delhi during her summer holidays.', highlightWord: 'Priya, Delhi', note: 'Proper nouns starting with capital letters.' },
              ],
              commonMistakes: [
                {
                  incorrect: 'we visited the taj mahal on monday.',
                  correct: 'We visited the Taj Mahal on Monday.',
                  reason: 'Proper nouns and the first letter of a sentence must always be capitalized.',
                },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Naming Words: Nouns (Class 3)\n\nEverything in the world around us has a name! These names are called **Nouns**.\n\n#### 1. Common Nouns\nNames of everyday items in general:\n- **People**: girl, doctor, teacher\n- **Places**: school, garden, city\n- **Animals**: elephant, sparrow, dog\n- **Things**: pencil, toy, water bottle\n\n#### 2. Proper Nouns\nSpecial names given to a particular person, place, or pet:\n- *My dog's name is **Rocky**.*\n- *We live in **Mumbai**.*\n- *My best friend is **Aarav**.*`,
          exercises: [
            {
              id: 'c3-ex-1',
              title: 'Exercise A: Identify the Proper & Common Nouns',
              instructions: 'Read each question and choose the correct answer.',
              targetType: 'mcq',
              maxMarks: 4,
              questions: [
                {
                  id: 'c3-q-1',
                  type: 'mcq',
                  prompt: 'Which of the following is a Proper Noun?',
                  difficulty: 'Easy',
                  marks: 1,
                  options: ['A) river', 'B) Ganga', 'C) city', 'D) country'],
                  correctAnswer: 'B) Ganga',
                  explanation: "'Ganga' is the specific name of a holy river and begins with a capital letter.",
                },
                {
                  id: 'c3-q-2',
                  type: 'fill_in_blanks',
                  prompt: 'Fill in the blank with a suitable naming word from brackets:',
                  blanksSentence: 'The little ___ (baby / drink) is sleeping peacefully.',
                  hints: 'baby / drink',
                  acceptableAnswers: ['baby'],
                  correctAnswer: 'baby',
                  difficulty: 'Easy',
                  marks: 1,
                  explanation: "'Baby' is a noun naming a person.",
                },
                {
                  id: 'c3-q-3',
                  type: 'match_column',
                  prompt: 'Match the Common Noun in Column A with its matching Proper Noun in Column B:',
                  marks: 2,
                  difficulty: 'Easy',
                  columnA: [
                    { id: 'ca1', text: '1. Country' },
                    { id: 'ca2', text: '2. Day' },
                  ],
                  columnB: [
                    { id: 'cb1', text: 'A. Friday' },
                    { id: 'cb2', text: 'B. India' },
                  ],
                  matchPairs: [
                    { aId: 'ca1', bId: 'cb2' },
                    { aId: 'ca2', bId: 'cb1' },
                  ],
                  correctAnswer: '1-B, 2-A',
                  explanation: "'India' is a proper country noun; 'Friday' is a proper day noun.",
                },
              ],
            },
          ],
          testSeries: [],
        },
      ],
    },
    'Class 4': {
      classLevel: 'Class 4',
      title: 'Elementary English Grammar & Composition: Class 4',
      ageBracket: 'Ages 9–10 (Primary)',
      boardStandards: 'CBSE / ICSE / Cambridge Primary Grade 4',
      description: 'Expands into collective nouns, adjectives of quality and quantity, simple tenses, and sentence punctuation.',
      pedagogicalFocus: 'Expanding word classes, noun-pronoun agreement, basic degrees of comparison.',
      topics: [
        {
          id: 'c4-top-1',
          title: 'Collective & Abstract Nouns',
          category: 'Parts of Speech',
          classLevel: 'Class 4',
          overview: 'Master groups of items (collective nouns) and feelings or qualities that cannot be touched (abstract nouns).',
          learningObjectives: [
            'Use standard collective nouns (flock, herd, swarm, pride)',
            'Recognize abstract nouns denoting qualities and feelings',
          ],
          definitions: [
            {
              id: 'c4-def-1',
              term: 'Collective Noun',
              partOfSpeechOrCategory: 'Noun Sub-type',
              ageAppropriateExplanation: 'A collective noun is a special word used to describe a whole group or collection of people, animals, or objects taken together as one single unit.',
              formulaOrSyntax: 'Collective Noun + of + Plural Noun (e.g. A flock of birds)',
              rules: [
                'Treat the collection as one unit unless individual members act separately.',
                'Use appropriate group terms (e.g., flock of sheep, pack of wolves, pride of lions).',
              ],
              examples: [
                { sentence: 'A swarm of bees flew toward the blossoming garden.', highlightWord: 'swarm', note: 'Collection of bees.' },
                { sentence: 'The cricket team celebrated their tournament victory.', highlightWord: 'team', note: 'Group of players.' },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Collective Nouns Guide (Class 4)\n\n| Animal / Object | Collective Noun |\n|---|---|\n| Lions | A **pride** of lions |\n| Wolves | A **pack** of wolves |\n| Birds / Sheep | A **flock** of birds/sheep |\n| Fish | A **school** or **shoal** of fish |\n| Keys / Grapes | A **bunch** of keys/grapes |`,
          exercises: [],
          testSeries: [],
        },
      ],
    },
    'Class 5': {
      classLevel: 'Class 5',
      title: 'Junior Grammar & Sentence Mastery: Class 5',
      ageBracket: 'Ages 10–11 (Upper Primary)',
      boardStandards: 'CBSE / ICSE / Middle School Prep',
      description: 'Covers Subject and Predicate, Articles (a, an, the), Adverbs, and coordinating conjunctions.',
      pedagogicalFocus: 'Sentence anatomy, vowel-sound article rules, adverb classification.',
      topics: [],
    },
    'Class 6': {
      classLevel: 'Class 6',
      title: 'Middle School Grammar & Syntax: Class 6',
      ageBracket: 'Ages 11–12 (Middle School)',
      boardStandards: 'CBSE / ICSE Grade 6',
      description: 'Core focus on Subject-Verb Agreement, Verb Tenses, Prepositions, and introductory Active/Passive Voice.',
      pedagogicalFocus: 'Concord rules, aspectual verb distinctions, prepositional accuracy.',
      topics: [
        {
          id: 'c6-top-1',
          title: 'Subject-Verb Agreement (Concord)',
          category: 'Syntax & Concord',
          classLevel: 'Class 6',
          overview: 'The fundamental rule that a singular subject takes a singular verb, and a plural subject takes a plural verb.',
          learningObjectives: [
            'Match subject number and person with corresponding verb forms',
            'Handle compound subjects joined by "and", "or", and "neither... nor"',
            'Correctly identify subjects in sentences containing intervening prepositional phrases',
          ],
          definitions: [
            {
              id: 'c6-def-1',
              term: 'Subject-Verb Concord',
              partOfSpeechOrCategory: 'Syntactic Rule',
              ageAppropriateExplanation: 'The verb in a sentence must always agree with its true subject in both number (singular or plural) and person (first, second, or third person).',
              formulaOrSyntax: 'Singular Subject + Singular Verb (e.g. He writes) | Plural Subject + Plural Verb (e.g. They write)',
              rules: [
                'When two subjects are joined by "and", they usually take a plural verb.',
                'When subjects are connected by "either... or" or "neither... nor", the verb agrees with the subject closest to it.',
                'Indefinite pronouns like "everybody", "everyone", "someone", and "each" always take singular verbs.',
              ],
              examples: [
                { sentence: 'The quality of these mangoes is exceptional.', highlightWord: 'is', note: 'Subject is "quality" (singular), not "mangoes".' },
                { sentence: 'Neither the principal nor the teachers were present in the hall.', highlightWord: 'were', note: 'Agrees with closer subject "teachers" (plural).' },
              ],
              commonMistakes: [
                {
                  incorrect: 'The list of shortlisted students are published.',
                  correct: 'The list of shortlisted students is published.',
                  reason: 'The true subject is the singular noun "list", not the plural prepositional object "students".',
                },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Subject-Verb Agreement: The Golden Rules\n\n1. **Golden Rule 1**: Singular subjects take singular verbs with *-s* or *-es* in the simple present tense (e.g. *The clock ticks*).\n2. **Golden Rule 2**: Intervening phrases like *along with*, *as well as*, *in addition to* do NOT make the subject plural.\n   - *The captain, along with his sailors, **is** standing on the deck.*\n3. **Golden Rule 3**: Collective nouns take singular verbs when acting together:\n   - *The committee **has** submitted its report.*`,
          exercises: [
            {
              id: 'c6-ex-1',
              title: 'Exercise 1: Concord Mastery Practice',
              instructions: 'Select the correct verb to complete each sentence.',
              targetType: 'mixed',
              maxMarks: 5,
              questions: [
                {
                  id: 'c6-q-1',
                  type: 'mcq',
                  prompt: 'Choose the correct verb: "Neither of the two roads ___ to the railway station."',
                  difficulty: 'Medium',
                  marks: 1,
                  conceptTested: 'Distributive Pronouns (Neither/Either)',
                  options: ['A) lead', 'B) leads', 'C) are leading', 'D) have led'],
                  correctAnswer: 'B) leads',
                  explanation: "'Neither' is grammatically singular and requires the singular verb 'leads'.",
                },
                {
                  id: 'c6-q-2',
                  type: 'fill_in_blanks',
                  prompt: 'Fill in the blank with the appropriate verb form:',
                  blanksSentence: 'The news broadcast ___ (was / were) received with immense relief.',
                  hints: 'was / were',
                  conceptTested: 'Nouns Plural in Form but Singular in Meaning',
                  acceptableAnswers: ['was'],
                  correctAnswer: 'was',
                  difficulty: 'Medium',
                  marks: 1,
                  explanation: "'News' is an uncountable noun singular in form and takes 'was'.",
                },
                {
                  id: 'c6-q-3',
                  type: 'error_correction',
                  prompt: 'Correct the error in subject-verb concord:',
                  originalSentence: 'Rohan, as well as his friends, are playing cricket in the field.',
                  correctedSentence: 'Rohan, as well as his friends, is playing cricket in the field.',
                  conceptTested: 'Intervening Parenthetical Phrases (as well as)',
                  difficulty: 'Medium',
                  marks: 2,
                  correctAnswer: 'Change "are" to "is"',
                  explanation: "Parenthetical phrases introduced by 'as well as' do not alter the number of the primary subject 'Rohan'.",
                },
                {
                  id: 'c6-q-4',
                  type: 'transformation',
                  prompt: 'Combine into a sentence using "Not only... but also":',
                  originalSentence: 'Suman is intelligent. Suman is hardworking.',
                  instruction: 'Use "Not only... but also"',
                  correctedSentence: 'Suman is not only intelligent but also hardworking.',
                  conceptTested: 'Correlative Conjunctions (Not only... but also)',
                  difficulty: 'Easy',
                  marks: 1,
                  correctAnswer: 'Suman is not only intelligent but also hardworking.',
                  explanation: 'Parallel structure with correlative conjunction.',
                },
              ],
            },
          ],
          testSeries: [
            {
              id: 'c6-test-1',
              title: 'Unit Assessment: Subject-Verb Concord (Class 6)',
              classLevel: 'Class 6',
              totalMarks: 10,
              durationMinutes: 20,
              instructions: [
                'All questions carry specified marks.',
                'Verify the subject number carefully before writing.',
              ],
              sections: [
                {
                  id: 'c6-sec-a',
                  title: 'Section A: Multiple Choice Questions',
                  description: 'Select the only grammatically correct option.',
                  questions: [
                    {
                      id: 'c6-tq-1',
                      type: 'mcq',
                      prompt: 'Slow and steady ___ the race.',
                      difficulty: 'Easy',
                      marks: 1,
                      conceptTested: 'Compound Subjects Expressing Single Idea',
                      options: ['A) win', 'B) wins', 'C) are winning', 'D) have won'],
                      correctAnswer: 'B) wins',
                      explanation: "'Slow and steady' expresses a singular unified idea, taking singular verb 'wins'.",
                    },
                    {
                      id: 'c6-tq-2',
                      type: 'mcq',
                      prompt: 'A large number of volunteers ___ registered for the cleanliness drive.',
                      difficulty: 'Medium',
                      marks: 1,
                      conceptTested: 'Quantifier Concord (A number of)',
                      options: ['A) has', 'B) have', 'C) is', 'D) was'],
                      correctAnswer: 'B) have',
                      explanation: "'A number of' takes a plural verb, unlike 'The number of' which takes a singular verb.",
                    },
                  ],
                },
                {
                  id: 'c6-sec-b',
                  title: 'Section B: Fill in the Blanks & Error Correction',
                  description: 'Supply the correct form or rewrite with correct grammar.',
                  questions: [
                    {
                      id: 'c6-tq-3',
                      type: 'fill_in_blanks',
                      prompt: 'Supply the correct auxiliary verb:',
                      blanksSentence: 'Ten miles ___ (is / are) a long distance to walk on foot.',
                      hints: 'is / are',
                      conceptTested: 'Units of Distance/Measurement as Single Whole',
                      acceptableAnswers: ['is'],
                      correctAnswer: 'is',
                      difficulty: 'Medium',
                      marks: 2,
                      explanation: 'A quantity or distance viewed as a whole unit takes a singular verb.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    'Class 7': {
      classLevel: 'Class 7',
      title: 'Intermediate Grammar & Applied Syntax: Class 7',
      ageBracket: 'Ages 12–13 (Middle School)',
      boardStandards: 'CBSE / ICSE Grade 7',
      description: 'Deep dive into Direct & Indirect Speech, Modal Auxiliaries, Transitive/Intransitive verbs, and Prepositions.',
      pedagogicalFocus: 'Back-shifting tenses in reported speech, modal nuances of obligation and permission.',
      topics: [],
    },
    'Class 8': {
      classLevel: 'Class 8',
      title: 'Advanced Middle Grammar & Clause Analysis: Class 8',
      ageBracket: 'Ages 13–14 (Middle School)',
      boardStandards: 'CBSE / ICSE Grade 8',
      description: 'Finite and Non-Finite verbs (Gerunds, Participles, Infinitives), Clause analysis, and Active-Passive Voice transformation.',
      pedagogicalFocus: 'Clause identification (noun, adjective, adverbial), non-finite verbal constructions.',
      topics: [],
    },
    'Class 9': {
      classLevel: 'Class 9',
      title: 'Secondary Grammar & Board Exam Foundations: Class 9',
      ageBracket: 'Ages 14–15 (Secondary)',
      boardStandards: 'CBSE / ICSE / State Board Class 9',
      description: 'Integrated grammar, sentence transformation, dialogue completion, error editing, and formal writing synthesis.',
      pedagogicalFocus: 'Error spotting passages, omission exercises, complex sentence reporting.',
      topics: [],
    },
    'Class 10': {
      classLevel: 'Class 10',
      title: 'Board Exam Grammar & Syntax Blueprint: Class 10',
      ageBracket: 'Ages 15–16 (Secondary / 10th Board)',
      boardStandards: 'CBSE Class 10 / ICSE Class 10',
      description: 'Complete board examination syllabus: Conditionals, Synthesis, Transformation of Sentences, Reported Speech, and Determiners.',
      pedagogicalFocus: 'Board question patterns, editing passages, gap-filling, transformation without changing meaning.',
      topics: [
        {
          id: 'c10-top-1',
          title: 'Conditional Sentences & Hypotheses (Types 0, 1, 2, 3)',
          category: 'Syntax & Conditionals',
          classLevel: 'Class 10',
          overview: 'Master real and hypothetical conditions: Zero, First (Probable), Second (Improbable), and Third (Impossible past conditions).',
          learningObjectives: [
            'Differentiate between real and unreal conditional clauses',
            'Correctly match "if" clause verb tenses with main clause modals',
            'Handle inversions without "if" (e.g. "Had I known...", "Should you require...")',
          ],
          definitions: [
            {
              id: 'c10-def-1',
              term: 'Conditional Sentence (Third Conditional)',
              partOfSpeechOrCategory: 'Complex Sentence Structure',
              ageAppropriateExplanation: 'Used to express regret or an unreal, hypothetical past condition and its impossible result in the past.',
              formulaOrSyntax: 'If + Past Perfect (had + V3), Subject + would/could/might + have + Past Participle (V3)',
              rules: [
                'The condition did NOT happen; it is purely counterfactual.',
                'Never use "would have" in the "if" clause.',
                'Can be inverted by starting with "Had": "Had you warned me, I would have been careful."',
              ],
              examples: [
                { sentence: 'If she had studied diligently, she would have secured first rank.', highlightWord: 'had studied / would have secured', note: 'Third conditional pattern.' },
                { sentence: 'Had the doctor arrived ten minutes earlier, the patient might have survived.', highlightWord: 'Had... arrived', note: 'Inverted conditional without "if".' },
              ],
              commonMistakes: [
                {
                  incorrect: 'If I would have known about the traffic, I would have left earlier.',
                  correct: 'If I had known about the traffic, I would have left earlier.',
                  reason: 'The if-clause takes the past perfect "had known", never "would have".',
                },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Conditionals Classification (Class 10)\n\n1. **Zero Conditional** (General truths & scientific facts):\n   - *If ice melts, it turns into water.* [If + Present, Present]\n2. **First Conditional** (Likely future outcome):\n   - *If it rains, we will cancel the match.* [If + Present, will + Verb]\n3. **Second Conditional** (Imaginary / Unlikely present):\n   - *If I had a million dollars, I would travel the world.* [If + Past, would + Verb]\n4. **Third Conditional** (Past impossible regret):\n   - *If you had practiced, you would have passed.* [If + Past Perfect, would have + V3]`,
          exercises: [],
          testSeries: [],
        },
      ],
    },
    'Class 11': {
      classLevel: 'Class 11',
      title: 'Senior Secondary Grammar & Rhetorical Mechanics: Class 11',
      ageBracket: 'Ages 16–17 (Senior Secondary)',
      boardStandards: 'CBSE / ISC / IGCSE A-Levels',
      description: 'Advanced syntax, inversion, subjunctive mood, nominalisation, and stylistic register variations for academic prose.',
      pedagogicalFocus: 'Formal discourse markers, cohesive sentence linkage, nuanced rhetorical devices.',
      topics: [],
    },
    'Class 12': {
      classLevel: 'Class 12',
      title: 'Mastery of Advanced English Syntax & Competitive Writing: Class 12',
      ageBracket: 'Ages 17–18 (Senior Secondary / Competitive Entrance)',
      boardStandards: 'Class 12 Board / CUET / SAT / Advanced ESL',
      description: 'Mastery over parallelism, dangling modifiers, sentence synthesis, subjunctive mood, and error elimination for college and board excellence.',
      pedagogicalFocus: 'Grammatical elegance, elimination of syntactical ambiguity, advanced parallelism.',
      topics: [
        {
          id: 'c12-top-1',
          title: 'Advanced Parallelism & Inversion Syntax',
          category: 'Advanced Rhetoric & Syntax',
          classLevel: 'Class 12',
          overview: 'Ensure syntactic balance across coordinated elements and master negative inversions for rhetorical emphasis.',
          learningObjectives: [
            'Maintain strict grammatical parallelism with correlative conjunctions',
            'Construct negative and restrictive inversions (Seldom, Scarcely, Under no circumstances)',
            'Eliminate dangling and misplaced modifier traps in formal prose',
          ],
          definitions: [
            {
              id: 'c12-def-1',
              term: 'Negative Inversion',
              partOfSpeechOrCategory: 'Advanced Syntactic Inversion',
              ageAppropriateExplanation: 'When a sentence opens with a negative or restrictive adverbial expression, the auxiliary verb precedes the subject, exactly like a question word order.',
              formulaOrSyntax: 'Negative Adverbial (Seldom / Rarely / Scarcely) + Auxiliary Verb + Subject + Main Verb',
              rules: [
                'Applies to: Hardly, Scarcely, Barely, Seldom, Rarely, Little, Under no circumstances.',
                'When "Scarcely" or "Hardly" begins the sentence, the connecting conjunction is "when", not "than".',
                '"No sooner" takes "than".',
              ],
              examples: [
                { sentence: 'Seldom have we witnessed such intellectual courage.', highlightWord: 'have we witnessed', note: 'Auxiliary "have" precedes subject "we".' },
                { sentence: 'Hardly had the meeting commenced when the fire alarm sounded.', highlightWord: 'Hardly had... when', note: 'Standard inversion pair.' },
              ],
            },
          ],
          notesAndTheoryMarkdown: `### Advanced Inversion Syntax Rules (Class 12)\n\n- **Rule of Parallelism**: Elements joined by *either... or*, *neither... nor*, *not only... but also* must be of identical grammatical categories.\n  - ❌ *He not only gained fame, but also fortune.* (Verb + Noun vs Noun)\n  - ✔️ *He gained not only fame but also fortune.* (Noun vs Noun)\n\n- **Dangling Modifiers**:\n  - ❌ *Walking down the boulevard, the trees looked picturesque.* (The trees were not walking!)\n  - ✔️ *Walking down the boulevard, we admired the picturesque trees.*`,
          exercises: [],
          testSeries: [],
        },
      ],
    },
  };

  const editions = getInitialMultiBoardEditions();
  // Ensure CBSE Class 6 and Class 10 editions share the comprehensive topic data
  if (editions['ed-cbse-c3']) {
    editions['ed-cbse-c3'].topics = books['Class 3'].topics;
  }
  if (editions['ed-cbse-c6']) {
    editions['ed-cbse-c6'].topics = books['Class 6'].topics;
  }
  if (editions['ed-cbse-c10']) {
    editions['ed-cbse-c10'].topics = books['Class 10'].topics;
  }

  const masterConcepts = MASTER_GRAMMAR_CONCEPTS;
  const curriculumAuditAlerts = [
    ...detectDuplications(editions),
    ...detectCurriculumGaps(editions, masterConcepts),
  ];

  const seriesSkeleton: GrammarSeriesProject = {
    id: 'grammar-series-master',
    seriesTitle: 'Grammar in Action: Complete K-12 English Series',
    author: 'Editorial Board & Curriculum Authors',
    targetBoard: 'CBSE',
    selectedClass: 'Class 6',
    books,
    curriculumMatrix: getDefaultCurriculumMatrix('CBSE'),
    activeSystemId: 'CBSE',
    activeProgrammeId: 'cbse-main',
    activeStageId: 'stage-cbse-c6',
    activeEditionId: 'ed-cbse-c6',
    editions,
    masterConcepts,
    curriculumAuditAlerts,
    lastUpdated: new Date().toISOString(),
  };

  seriesSkeleton.bookProjects = getInitialBookProjects(seriesSkeleton);
  seriesSkeleton.activeBookProjectId = 'proj-cbse-c6';

  return seriesSkeleton;
}
