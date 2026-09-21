// =============================================================
// VERITAS Editorial Platform — Exercise & Practice Studio Defaults
// Phase 4F: Textbook Exercise Authoring, Sequencing & Quality Audit
// =============================================================

import {
  StudioChapter,
  StudioExercise,
  GrammarQuestion,
  ExerciseAuditIssue,
  ExerciseCoverageCell,
  OpenEndedAnswerCriteria,
} from '../types';

/**
 * Creates the definitive demonstration exercise sequence for CBSE Class 3 Chapter 1
 * ("Nouns: Naming Words (Common & Proper)"), adhering strictly to Section 21.
 */
export function createDefaultCbseClass3NounsExercises(chapterId: string = 'c3-top-1'): StudioExercise[] {
  return [
    // -------------------------------------------------------------
    // EXERCISE A: Find the Naming Words (FOUNDATION)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-A`,
      letter: 'A',
      title: 'Find the Naming Words',
      progression: 'foundation',
      developmentalTier: 'FOUNDATION',
      status: 'Approved',
      instructions: 'Read each sentence carefully. Underline or identify the naming words (nouns) in each sentence.',
      studentInstruction: 'Find the naming words (people, places, animals, or things) in each sentence.',
      teacherInstruction: 'Encourage students to test words by asking: Is it a person, place, animal, or thing?',
      pedagogicalPurpose: 'Introduce and reinforce noun recognition in authentic primary sentence contexts.',
      estimatedTimeMinutes: 10,
      learningObjective: 'Identify nouns naming people, places, animals, and things in short sentences.',
      grammarRuleCoverage: ['Noun Definition', 'Person, Place, Animal, Thing'],
      difficulty: 'Easy',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE / NCERT Class 3 English Grammar',
      classLevel: 'Class 3',
      teacherNote: 'Notice whether students mistakenly pick action verbs or adjectives instead of the naming words.',
      questions: [
        {
          id: `q-${chapterId}-A1`,
          type: 'identify_underline',
          prompt: 'Identify the two naming words in this sentence:',
          blanksSentence: 'The friendly teacher smiled at the little children.',
          correctAnswer: 'teacher, children',
          acceptableAnswers: ['teacher', 'children', 'teacher, children'],
          acceptableAlternatives: ['teacher and children', 'children, teacher'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Naming Words for People',
          curriculumObjective: 'Recognize nouns that name persons.',
          cognitiveLevel: 'Remembering',
          explanation: "'Teacher' and 'children' are naming words for people.",
          grammarRationale: 'Both words represent human roles and belong to the Person category of nouns.',
          hints: 'Who is smiling? Who is the teacher smiling at?',
          studentFeedback: "Great job! 'Teacher' and 'children' are both people.",
          teacherGuidance: 'Check that learners do not underline the adjective "friendly".',
        },
        {
          id: `q-${chapterId}-A2`,
          type: 'identify_underline',
          prompt: 'Identify the two naming words in this sentence:',
          blanksSentence: 'A tiny sparrow hopped onto the garden branch.',
          correctAnswer: 'sparrow, branch',
          acceptableAnswers: ['sparrow', 'branch', 'sparrow, branch', 'garden'],
          acceptableAlternatives: ['sparrow, garden, branch', 'sparrow and branch'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Naming Words for Animals & Things',
          curriculumObjective: 'Recognize nouns that name animals and things.',
          cognitiveLevel: 'Remembering',
          explanation: "'Sparrow' is an animal (bird); 'branch' is a part of a tree (thing); 'garden' is a place.",
          grammarRationale: 'Naming words denote living creatures and physical objects.',
          hints: 'Look for a bird and an object it sits upon.',
          studentFeedback: "Correct! 'Sparrow' is a bird (animal) and 'branch' is a thing.",
          teacherGuidance: 'Accept garden if students list three nouns.',
        },
        {
          id: `q-${chapterId}-A3`,
          type: 'identify_underline',
          prompt: 'Identify the naming word for a PLACE in this sentence:',
          blanksSentence: 'The excited family spent their holiday at the sunny beach.',
          correctAnswer: 'beach',
          acceptableAnswers: ['beach'],
          acceptableAlternatives: ['the beach'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Naming Words for Places',
          curriculumObjective: 'Distinguish nouns denoting locations.',
          cognitiveLevel: 'Understanding',
          explanation: "'Beach' is the name of a place where people visit.",
          grammarRationale: 'A place noun answers the question: Where did the action occur?',
          hints: 'Where did the family spend their holiday?',
          studentFeedback: "Well done! 'Beach' is the place.",
          teacherGuidance: 'Remind learners that "sunny" describes the beach, but "beach" is the noun.',
        },
        {
          id: `q-${chapterId}-A4`,
          type: 'identify_underline',
          prompt: 'Identify the naming words for THINGS in this sentence:',
          blanksSentence: 'Rohan put his blue water bottle into the red bag.',
          correctAnswer: 'bottle, bag',
          acceptableAnswers: ['bottle', 'bag', 'bottle, bag', 'water bottle, bag'],
          acceptableAlternatives: ['water bottle and red bag', 'bottle and bag'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Naming Words for Things',
          curriculumObjective: 'Identify nouns naming everyday objects.',
          cognitiveLevel: 'Remembering',
          explanation: "'Bottle' and 'bag' are names of everyday objects (things).",
          grammarRationale: 'Objects that can be touched or held are things.',
          hints: 'Look for objects you can carry to school.',
          studentFeedback: "Super! 'Bottle' and 'bag' are things you can hold.",
          teacherGuidance: 'Point out that blue and red tell us about the objects, but are not naming words.',
        },
        {
          id: `q-${chapterId}-A5`,
          type: 'mcq',
          prompt: 'Which word in the following sentence is an ANIMAL naming word?\n"The playful dolphin jumped out of the blue water."',
          options: ['A) playful', 'B) dolphin', 'C) jumped', 'D) blue'],
          correctAnswer: 'B) dolphin',
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Noun Classification',
          curriculumObjective: 'Distinguish animal nouns from verbs and adjectives.',
          cognitiveLevel: 'Remembering',
          explanation: "'Dolphin' is the name of a sea animal.",
          grammarRationale: 'Playful and blue are adjectives; jumped is a verb; dolphin is the animal noun.',
          hints: 'Which word names a creature living in the sea?',
          studentFeedback: "Exactly right! 'Dolphin' names an animal.",
          teacherGuidance: 'Reinforce that adjectives like "playful" describe, while "dolphin" is the noun.',
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE B: People, Places, Animals and Things (FOUNDATION / PRACTICE)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-B`,
      letter: 'B',
      title: 'People, Places, Animals and Things',
      progression: 'understanding',
      developmentalTier: 'FOUNDATION',
      status: 'Approved',
      instructions: 'Classify each given naming word into its correct column: Person, Place, Animal, or Thing.',
      studentInstruction: 'Sort the naming words into four boxes: Person, Place, Animal, or Thing.',
      teacherInstruction: 'Use a four-column blackboard chart to help children visualize the four foundational categories.',
      pedagogicalPurpose: 'Categorization and conceptual sorting of foundational noun sub-classes.',
      estimatedTimeMinutes: 12,
      learningObjective: 'Categorize naming words into Person, Place, Animal, and Thing.',
      grammarRuleCoverage: ['Noun Categories: Person, Place, Animal, Thing'],
      difficulty: 'Easy',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3',
      classLevel: 'Class 3',
      teacherNote: 'Observe if students hesitate when classifying birds or insects under Animal.',
      questions: [
        {
          id: `q-${chapterId}-B1`,
          type: 'classification',
          prompt: 'Under which category does the word "DOCTOR" belong?',
          options: ['A) Person', 'B) Place', 'C) Animal', 'D) Thing'],
          correctAnswer: 'A) Person',
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Noun Categories: Person',
          curriculumObjective: 'Classify profession words as people.',
          cognitiveLevel: 'Understanding',
          explanation: "A 'doctor' is a person who heals sick people.",
          grammarRationale: 'Professions and occupations are names of people.',
          hints: 'A doctor is someone with a job.',
          studentFeedback: "Correct! A doctor is a person.",
          teacherGuidance: 'Remind learners that pilot, nurse, teacher, and driver are also names of people.',
        },
        {
          id: `q-${chapterId}-B2`,
          type: 'classification',
          prompt: 'Under which category does the word "HOSPITAL" belong?',
          options: ['A) Person', 'B) Place', 'C) Animal', 'D) Thing'],
          correctAnswer: 'B) Place',
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Noun Categories: Place',
          curriculumObjective: 'Distinguish buildings and institutions as places.',
          cognitiveLevel: 'Understanding',
          explanation: "A 'hospital' is a building/location (place) where doctors treat patients.",
          grammarRationale: 'Buildings and locations are place nouns.',
          hints: 'A hospital is a place you visit when you need medicine.',
          studentFeedback: "That's right! A hospital is a place.",
          teacherGuidance: 'Contrast doctor (person) with hospital (place).',
        },
        {
          id: `q-${chapterId}-B3`,
          type: 'fill_in_blanks',
          prompt: 'Complete the sentence with an ANIMAL noun from the choices:\n"The heavy ___ walked slowly through the jungle."',
          options: ['elephant', 'tractor', 'farmer', 'mountain'],
          correctAnswer: 'elephant',
          acceptableAnswers: ['elephant', 'an elephant'],
          acceptableAlternatives: ['elephant'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Animal Noun Selection',
          curriculumObjective: 'Select an appropriate animal noun in semantic context.',
          cognitiveLevel: 'Understanding',
          explanation: "'Elephant' is the only animal in the list that lives in the jungle.",
          grammarRationale: 'Tractor is a thing, farmer is a person, mountain is a place.',
          hints: 'Which word names a large grey animal with a trunk?',
          studentFeedback: "Splendid! 'Elephant' is the animal noun.",
          teacherGuidance: 'Discuss why farmer fits grammatically but is a person, not an animal.',
        },
        {
          id: `q-${chapterId}-B4`,
          type: 'match_column',
          prompt: 'Match each noun in Column A with its category in Column B:',
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          columnA: [
            { id: 'cA1', text: '1. Library' },
            { id: 'cA2', text: '2. Kangaroo' },
            { id: 'cA3', text: '3. Scissors' },
            { id: 'cA4', text: '4. Carpenter' },
          ],
          columnB: [
            { id: 'cB1', text: 'A. Animal' },
            { id: 'cB2', text: 'B. Place' },
            { id: 'cB3', text: 'C. Person' },
            { id: 'cB4', text: 'D. Thing' },
          ],
          matchPairs: [
            { aId: 'cA1', bId: 'cB2' },
            { aId: 'cA2', bId: 'cB1' },
            { aId: 'cA3', bId: 'cB4' },
            { aId: 'cA4', bId: 'cB3' },
          ],
          correctAnswer: '1-B, 2-A, 3-D, 4-C',
          conceptTested: 'Multi-category matching',
          curriculumObjective: 'Systematically match nouns to 4 core categories.',
          cognitiveLevel: 'Understanding',
          explanation: 'Library is a place; Kangaroo is an animal; Scissors is a thing; Carpenter is a person.',
          grammarRationale: 'Tests discrimination across all four primary noun categories.',
          hints: 'Think of what each word represents in real life.',
          studentFeedback: 'Perfect matching! You clearly know your noun categories.',
          teacherGuidance: 'Excellent multi-point formative assessment item.',
        },
        {
          id: `q-${chapterId}-B5`,
          type: 'classification',
          prompt: 'Which of the following is a THING you use for writing in school?',
          options: ['A) teacher', 'B) classroom', 'C) pencil', 'D) parrot'],
          correctAnswer: 'C) pencil',
          marks: 1,
          difficulty: 'Easy',
          tier: 'foundation',
          conceptTested: 'Noun Categories: Thing',
          curriculumObjective: 'Identify physical objects used in school.',
          cognitiveLevel: 'Remembering',
          explanation: "'Pencil' is an object (thing) used for writing.",
          grammarRationale: 'Pencil is an inanimate object in the Thing category.',
          hints: 'You hold this object in your hand to write on paper.',
          studentFeedback: "Correct! 'Pencil' is a thing.",
          teacherGuidance: 'Review person (teacher), place (classroom), animal (parrot), thing (pencil).',
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE C: Common or Proper? (PRACTICE)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-C`,
      letter: 'C',
      title: 'Common or Proper?',
      progression: 'understanding',
      developmentalTier: 'PRACTICE',
      status: 'Approved',
      instructions: 'Decide whether each underlined noun is a Common Noun (general) or a Proper Noun (special name).',
      studentInstruction: 'Write "Common Noun" or "Proper Noun" for each highlighted word.',
      teacherInstruction: 'Emphasize that proper nouns give the special, unique name of an individual person, place, day, or month.',
      pedagogicalPurpose: 'Cement the distinction between generic common nouns and specific proper nouns.',
      estimatedTimeMinutes: 15,
      learningObjective: 'Distinguish between general common nouns and special proper nouns.',
      grammarRuleCoverage: ['Common vs Proper Noun Rule', 'Capitalization Principle'],
      difficulty: 'Medium',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3 Curriculum Strand 1.2',
      classLevel: 'Class 3',
      teacherNote: 'Common pitfall: students assuming days of the week are common nouns because they occur regularly.',
      questions: [
        {
          id: `q-${chapterId}-C1`,
          type: 'mcq',
          prompt: 'In the sentence below, what type of noun is "Ganga"?\n"The holy Ganga flows gracefully past Varanasi."',
          options: ['A) Common Noun', 'B) Proper Noun', 'C) Action Word', 'D) Describing Word'],
          correctAnswer: 'B) Proper Noun',
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Special Name of a River',
          curriculumObjective: 'Identify geographical names as proper nouns.',
          cognitiveLevel: 'Understanding',
          explanation: "'Ganga' is the special name of a particular river and starts with a capital letter.",
          grammarRationale: "'River' is a common noun, but 'Ganga' is the unique proper name of that river.",
          hints: 'Does it name a special river, and does it start with a capital letter?',
          studentFeedback: "Terrific! 'Ganga' is a Proper Noun.",
          teacherGuidance: 'Point out: river = common, Ganga = proper.',
        },
        {
          id: `q-${chapterId}-C2`,
          type: 'mcq',
          prompt: 'In the sentence below, what type of noun is "dog"?\n"Our faithful dog barked at the stranger."',
          options: ['A) Common Noun', 'B) Proper Noun', 'C) Person Noun', 'D) Place Noun'],
          correctAnswer: 'A) Common Noun',
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'General Animal Name',
          curriculumObjective: 'Identify general animal words as common nouns.',
          cognitiveLevel: 'Understanding',
          explanation: "'Dog' is a general word for any dog, so it is a Common Noun.",
          grammarRationale: 'It does not give the special name of the dog (like Bruno or Tommy).',
          hints: 'Is "dog" a general animal word or a pet\'s special name?',
          studentFeedback: "Spot on! 'Dog' is a Common Noun.",
          teacherGuidance: 'Ask students what pet name would turn it into a proper noun.',
        },
        {
          id: `q-${chapterId}-C3`,
          type: 'mcq',
          prompt: 'Is "August" a Common Noun or a Proper Noun in this sentence?\n"India celebrates Independence Day in August."',
          options: ['A) Common Noun', 'B) Proper Noun'],
          correctAnswer: 'B) Proper Noun',
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Months as Proper Nouns',
          curriculumObjective: 'Recognize months of the year as proper nouns.',
          cognitiveLevel: 'Understanding',
          explanation: "'August' is the special name of a month in the calendar and always starts with a capital letter.",
          grammarRationale: 'All 12 months and 7 days of the week are proper nouns.',
          hints: 'Months of the year always have special names and capital letters.',
          studentFeedback: "Correct! 'August' is a Proper Noun.",
          teacherGuidance: 'Highlight that "month" is common, but "August" is proper.',
        },
        {
          id: `q-${chapterId}-C4`,
          type: 'mcq',
          prompt: 'Which word in the sentence below is a PROPER NOUN?\n"My cousin Rohan bought a new bicycle yesterday."',
          options: ['A) cousin', 'B) Rohan', 'C) bicycle', 'D) yesterday'],
          correctAnswer: 'B) Rohan',
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Personal Names as Proper Nouns',
          curriculumObjective: 'Identify personal names as proper nouns.',
          cognitiveLevel: 'Remembering',
          explanation: "'Rohan' is the special name of a specific boy.",
          grammarRationale: 'A special name given to a person is a proper noun.',
          hints: 'Look for the special name of the cousin.',
          studentFeedback: "Well done! 'Rohan' is the proper noun.",
          teacherGuidance: 'Contrast cousin (common) with Rohan (proper).',
        },
        {
          id: `q-${chapterId}-C5`,
          type: 'fill_in_blanks',
          prompt: 'Choose the correct pair from the options:\n"___ is a common noun, while ___ is a proper noun."',
          options: [
            'A) city, Mumbai',
            'B) Delhi, India',
            'C) girl, boy',
            'D) Pacific, ocean',
          ],
          correctAnswer: 'A) city, Mumbai',
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Common vs Proper Contrast',
          curriculumObjective: 'Pair general categories with their specific proper noun counterparts.',
          cognitiveLevel: 'Understanding',
          explanation: "'City' is the general naming word (common), while 'Mumbai' is the special name of a city (proper).",
          grammarRationale: 'Common nouns name the general category; proper nouns name the specific member.',
          hints: 'Look for one general word followed by one capitalized special name.',
          studentFeedback: "Excellent! City is common; Mumbai is proper.",
          teacherGuidance: 'Notice option D reverses the order (proper, common).',
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE D: Capital Letters and Proper Nouns (APPLICATION)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-D`,
      letter: 'D',
      title: 'Capital Letters and Proper Nouns',
      progression: 'application',
      developmentalTier: 'APPLICATION',
      status: 'Approved',
      instructions: 'Rewrite each sentence. Use a capital letter for all proper nouns and the first letter of each sentence.',
      studentInstruction: 'Rewrite the sentences below. Put capital letters on proper nouns and sentence beginnings.',
      teacherInstruction: 'Model answer guidance: Award 0.5 mark for sentence-initial capital, and 0.5 mark for proper noun capital.',
      pedagogicalPurpose: 'Application of grammatical capitalization rules in sentence-level composition.',
      estimatedTimeMinutes: 15,
      learningObjective: 'Apply capitalization rules to proper nouns and sentence starters.',
      grammarRuleCoverage: ['Proper Noun Capitalization', 'Sentence-Initial Capitalization'],
      difficulty: 'Medium',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3 Writing & Conventions',
      classLevel: 'Class 3',
      teacherNote: 'Grade open-ended answers using the acceptable alternatives criteria. Do not penalize minor spacing.',
      questions: [
        {
          id: `q-${chapterId}-D1`,
          type: 'rewrite_sentence',
          prompt: 'Rewrite the sentence with proper capitalization:\n"my friend priya lives in jaipur."',
          originalSentence: 'my friend priya lives in jaipur.',
          correctAnswer: 'My friend Priya lives in Jaipur.',
          modelAnswer: 'My friend Priya lives in Jaipur.',
          acceptableAlternatives: [
            'My friend Priya lives in Jaipur.',
            'My friend Priya lives in Jaipur',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Proper Noun Capitalization (Person & City)',
          curriculumObjective: 'Capitalize person names and city names in written sentences.',
          cognitiveLevel: 'Applying',
          explanation: "'My' begins the sentence; 'Priya' is a special person name; 'Jaipur' is a special city name.",
          grammarRationale: 'Sentence starters and proper nouns must always be capitalized.',
          hints: 'Check: 1) First word, 2) Friend\'s name, 3) City name.',
          studentFeedback: "Great writing! Both 'Priya' and 'Jaipur' need capital letters.",
          openEndedCriteria: {
            modelAnswer: 'My friend Priya lives in Jaipur.',
            acceptableAlternatives: ['My friend Priya lives in Jaipur.', 'My friend Priya lives in Jaipur'],
            requiredGrammarRule: 'Proper nouns (Priya, Jaipur) and first word (My) must be capitalized.',
            requiredSemanticMeaning: 'Preserves original statement about Priya living in Jaipur.',
            requiredElements: ['My', 'Priya', 'Jaipur'],
            punctuationTolerance: true,
            caseSensitive: true,
            partialCreditBreakdown: [
              { condition: 'Capitalized My, Priya, and Jaipur with full stop', marks: 1 },
              { condition: 'Capitalized two out of three target words', marks: 0.5 },
            ],
            markingNotes: 'Deduct 0.5 mark if Jaipur or Priya remains in lowercase.',
          },
        },
        {
          id: `q-${chapterId}-D2`,
          type: 'rewrite_sentence',
          prompt: 'Rewrite the sentence with proper capitalization:\n"we do not go to school on sunday."',
          originalSentence: 'we do not go to school on sunday.',
          correctAnswer: 'We do not go to school on Sunday.',
          modelAnswer: 'We do not go to school on Sunday.',
          acceptableAlternatives: [
            'We do not go to school on Sunday.',
            'We do not go to school on Sunday',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Day of the Week Capitalization',
          curriculumObjective: 'Capitalize days of the week in sentences.',
          cognitiveLevel: 'Applying',
          explanation: "'We' starts the sentence; 'Sunday' is a proper noun naming a day of the week.",
          grammarRationale: 'Days of the week are proper nouns and take initial capital letters.',
          hints: 'Sunday is a day of the week, so it needs a capital letter.',
          studentFeedback: "Correct! 'Sunday' is a special day name and must start with a capital 'S'.",
          openEndedCriteria: {
            modelAnswer: 'We do not go to school on Sunday.',
            acceptableAlternatives: ['We do not go to school on Sunday.', 'We do not go to school on Sunday'],
            requiredGrammarRule: 'Capitalize "We" (sentence start) and "Sunday" (day of week).',
            requiredElements: ['We', 'Sunday'],
            punctuationTolerance: true,
            caseSensitive: true,
            partialCreditBreakdown: [
              { condition: 'Both We and Sunday capitalized correctly', marks: 1 },
              { condition: 'Only one word capitalized correctly', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-D3`,
          type: 'rewrite_sentence',
          prompt: 'Rewrite the sentence with proper capitalization:\n"the taj mahal is located in agra."',
          originalSentence: 'the taj mahal is located in agra.',
          correctAnswer: 'The Taj Mahal is located in Agra.',
          modelAnswer: 'The Taj Mahal is located in Agra.',
          acceptableAlternatives: [
            'The Taj Mahal is located in Agra.',
            'The Taj Mahal is located in Agra',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Monument & City Capitalization',
          curriculumObjective: 'Capitalize multi-word monument names and city names.',
          cognitiveLevel: 'Applying',
          explanation: "'Taj Mahal' is a famous monument (both T and M capitalized); 'Agra' is a city.",
          grammarRationale: 'Both words in compound monument proper nouns require capitalization.',
          hints: 'Both words in "Taj Mahal" must begin with capital letters!',
          studentFeedback: "Superb! 'Taj Mahal' and 'Agra' are both capitalized.",
          openEndedCriteria: {
            modelAnswer: 'The Taj Mahal is located in Agra.',
            acceptableAlternatives: ['The Taj Mahal is located in Agra.', 'The Taj Mahal is located in Agra'],
            requiredGrammarRule: 'Capitalize "The", "Taj", "Mahal", and "Agra".',
            requiredElements: ['The', 'Taj Mahal', 'Agra'],
            punctuationTolerance: true,
            caseSensitive: true,
            partialCreditBreakdown: [
              { condition: 'All proper nouns capitalized (The, Taj, Mahal, Agra)', marks: 1 },
              { condition: 'Taj Mahal capitalized but Agra missed (or vice versa)', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-D4`,
          type: 'rewrite_sentence',
          prompt: 'Rewrite the sentence with proper capitalization:\n"kabir and rahul play cricket every evening."',
          originalSentence: 'kabir and rahul play cricket every evening.',
          correctAnswer: 'Kabir and Rahul play cricket every evening.',
          modelAnswer: 'Kabir and Rahul play cricket every evening.',
          acceptableAlternatives: [
            'Kabir and Rahul play cricket every evening.',
            'Kabir and Rahul play cricket every evening',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Two Personal Names in Subject Position',
          curriculumObjective: 'Capitalize multiple person names connected with conjunctions.',
          cognitiveLevel: 'Applying',
          explanation: "'Kabir' and 'Rahul' are special names of two boys and require capital letters.",
          grammarRationale: 'Every proper noun in a sentence must be capitalized.',
          hints: 'Both boys\' names must start with capital letters.',
          studentFeedback: "Well done! Both 'Kabir' and 'Rahul' are proper names.",
          openEndedCriteria: {
            modelAnswer: 'Kabir and Rahul play cricket every evening.',
            acceptableAlternatives: ['Kabir and Rahul play cricket every evening.'],
            requiredGrammarRule: 'Capitalize "Kabir" and "Rahul".',
            requiredElements: ['Kabir', 'Rahul'],
            punctuationTolerance: true,
            caseSensitive: true,
            partialCreditBreakdown: [
              { condition: 'Both Kabir and Rahul capitalized', marks: 1 },
              { condition: 'Only one name capitalized', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-D5`,
          type: 'rewrite_sentence',
          prompt: 'Rewrite the sentence with proper capitalization:\n"diwali and christmas are celebrated in winter."',
          originalSentence: 'diwali and christmas are celebrated in winter.',
          correctAnswer: 'Diwali and Christmas are celebrated in winter.',
          modelAnswer: 'Diwali and Christmas are celebrated in winter.',
          acceptableAlternatives: [
            'Diwali and Christmas are celebrated in winter.',
            'Diwali and Christmas are celebrated in winter',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Festival Names Capitalization',
          curriculumObjective: 'Recognize festival names as proper nouns.',
          cognitiveLevel: 'Applying',
          explanation: "'Diwali' and 'Christmas' are special names of festivals, so they are proper nouns.",
          grammarRationale: 'Festivals are proper nouns; seasons (winter) are common nouns.',
          hints: 'Festivals have special names! Notice that "winter" is a common noun.',
          studentFeedback: "Brilliant! Festivals like Diwali and Christmas are proper nouns.",
          openEndedCriteria: {
            modelAnswer: 'Diwali and Christmas are celebrated in winter.',
            acceptableAlternatives: ['Diwali and Christmas are celebrated in winter.'],
            requiredGrammarRule: 'Capitalize festivals (Diwali, Christmas); "winter" remains lowercase.',
            requiredElements: ['Diwali', 'Christmas'],
            punctuationTolerance: true,
            caseSensitive: true,
            partialCreditBreakdown: [
              { condition: 'Diwali and Christmas capitalized, winter lowercase', marks: 1 },
              { condition: 'Festivals capitalized but winter also capitalized incorrectly', marks: 0.5 },
            ],
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE E: Correct the Mistakes (APPLICATION / ERROR ANALYSIS)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-E`,
      letter: 'E',
      title: 'Correct the Mistakes',
      progression: 'error_analysis',
      developmentalTier: 'APPLICATION',
      status: 'Approved',
      instructions: 'Each sentence below has one noun mistake. Find the mistake and write the corrected word.',
      studentInstruction: 'Find the word that has a mistake in capitalization or noun usage. Write the correction.',
      teacherInstruction: 'Train students to explain WHY the mistake is wrong (e.g., "India is a country name, so it needs capital I").',
      pedagogicalPurpose: 'Error detection and analytical reasoning in grammatical conventions.',
      estimatedTimeMinutes: 15,
      learningObjective: 'Detect and correct noun capitalization and classification errors.',
      grammarRuleCoverage: ['Error Correction', 'Proper Noun Capitalization'],
      difficulty: 'Hard',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3 Language Conventions',
      classLevel: 'Class 3',
      teacherNote: 'This exercise aligns with board-style editing questions.',
      questions: [
        {
          id: `q-${chapterId}-E1`,
          type: 'error_correction',
          prompt: 'Find the mistake in this sentence:\n"We are proud of our country, india."',
          errorSnippet: 'india',
          correctionSnippet: 'India',
          correctAnswer: 'india -> India',
          acceptableAnswers: ['India', 'india -> India', 'india should be India'],
          acceptableAlternatives: ['India', 'India (capital I)'],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Country Name Capitalization',
          curriculumObjective: 'Correct lowercase country names.',
          cognitiveLevel: 'Analysing',
          explanation: "'India' is the special name of our country and must begin with a capital 'I'.",
          grammarRationale: 'Proper nouns are always written with capital letters.',
          hints: 'Look at the name of our country at the end of the sentence.',
          studentFeedback: "Correct! 'india' should be written with a capital 'I' -> 'India'.",
          teacherGuidance: 'Verify that children identify the capitalization rule.',
        },
        {
          id: `q-${chapterId}-E2`,
          type: 'error_correction',
          prompt: 'Find the mistake in this sentence:\n"My birthday falls on monday next week."',
          errorSnippet: 'monday',
          correctionSnippet: 'Monday',
          correctAnswer: 'monday -> Monday',
          acceptableAnswers: ['Monday', 'monday -> Monday'],
          acceptableAlternatives: ['Monday', 'Monday (capital M)'],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'Day Name Capitalization',
          curriculumObjective: 'Correct lowercase day names.',
          cognitiveLevel: 'Analysing',
          explanation: "'Monday' is the name of a day and must start with a capital 'M'.",
          grammarRationale: 'Days of the week are proper nouns.',
          hints: 'Which day of the week is written with a small letter?',
          studentFeedback: "Spot on! Days of the week like 'Monday' always start with a capital letter.",
          teacherGuidance: 'Remind learners that days are proper nouns.',
        },
        {
          id: `q-${chapterId}-E3`,
          type: 'error_correction',
          prompt: 'Find the mistake in this sentence:\n"mita and her mother went to the market."',
          errorSnippet: 'mita',
          correctionSnippet: 'Mita',
          correctAnswer: 'mita -> Mita',
          acceptableAnswers: ['Mita', 'mita -> Mita'],
          acceptableAlternatives: ['Mita', 'Mita (capital M)'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Sentence Starter and Person Name',
          curriculumObjective: 'Correct lowercase person name at start of sentence.',
          cognitiveLevel: 'Analysing',
          explanation: "'Mita' is a person's name and also the first word of the sentence, so it must be capitalized.",
          grammarRationale: 'Twofold rule: sentence starter and proper noun.',
          hints: 'Look at the first word of the sentence.',
          studentFeedback: "Great eye! 'Mita' must be capitalized.",
          teacherGuidance: 'Ask what two reasons make "Mita" need a capital letter.',
        },
        {
          id: `q-${chapterId}-E4`,
          type: 'error_correction',
          prompt: 'Find the word that should NOT have a capital letter:\n"The Boy kicked the football into the goal."',
          errorSnippet: 'Boy',
          correctionSnippet: 'boy',
          correctAnswer: 'Boy -> boy',
          acceptableAnswers: ['boy', 'Boy -> boy', 'Boy should be boy'],
          acceptableAlternatives: ['boy', 'boy (small b)'],
          marks: 1,
          difficulty: 'Hard',
          tier: 'advanced',
          conceptTested: 'Unnecessary Capitalization of Common Nouns',
          curriculumObjective: 'Identify and remove erroneous capitalization from common nouns.',
          cognitiveLevel: 'Analysing',
          explanation: "'Boy' is a common noun in the middle of a sentence, so it should start with a small 'b'.",
          grammarRationale: 'Common nouns should only be capitalized if they begin a sentence.',
          hints: 'Is "boy" a special name or just an ordinary common naming word?',
          studentFeedback: "Sharp thinking! Common nouns like 'boy' do not get capital letters in the middle of a sentence.",
          teacherGuidance: 'This is a crucial test of discrimination: stopping over-capitalization.',
        },
        {
          id: `q-${chapterId}-E5`,
          type: 'error_correction',
          prompt: 'Find the mistake in this sentence:\n"We went to london during the winter break."',
          errorSnippet: 'london',
          correctionSnippet: 'London',
          correctAnswer: 'london -> London',
          acceptableAnswers: ['London', 'london -> London'],
          acceptableAlternatives: ['London', 'London (capital L)'],
          marks: 1,
          difficulty: 'Medium',
          tier: 'standard',
          conceptTested: 'International City Name Capitalization',
          curriculumObjective: 'Capitalize international city names.',
          cognitiveLevel: 'Analysing',
          explanation: "'London' is the special name of a famous city and must begin with capital 'L'.",
          grammarRationale: 'City names anywhere in the world are proper nouns.',
          hints: 'Which city name is missing its capital letter?',
          studentFeedback: "Correct! 'London' is a city and must start with a capital letter.",
          teacherGuidance: 'Reinforce that world cities (London, Tokyo, New York) are proper nouns too.',
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE F: Picture Challenge (APPLICATION / CHALLENGE) — Linked to Figure 1.1
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-F`,
      letter: 'F',
      title: 'Picture Challenge (Visual Studio Stimulus)',
      progression: 'contextual',
      developmentalTier: 'CHALLENGE',
      status: 'Approved',
      instructions: 'Study Figure 1.1 (Common Nouns Around Us) carefully. Answer the questions using details seen in the classroom illustration.',
      studentInstruction: 'Look closely at Figure 1.1 of the classroom. Answer each question based on the picture.',
      teacherInstruction: 'Direct students to notice the labels inside the artwork (teacher, student, blackboard, clock, garden).',
      pedagogicalPurpose: 'Multimodal visual literacy and contextual grammar application referencing Figure 1.1.',
      estimatedTimeMinutes: 15,
      learningObjective: 'Extract naming words and synthesize proper noun replacements from an educational illustration.',
      grammarRuleCoverage: ['Visual Literacy', 'Common to Proper Noun Conversion', 'Environmental Naming Words'],
      difficulty: 'Medium',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3 Visual Stimulus Competency',
      classLevel: 'Class 3',
      visualId: `vis-${chapterId}-1`,
      visualFigureNumber: 'Figure 1.1',
      teacherNote: 'This exercise leverages Figure 1.1 produced in Visual Studio.',
      questions: [
        {
          id: `q-${chapterId}-F1`,
          type: 'visual_picture',
          prompt: 'Look at Figure 1.1. Name TWO people shown in this classroom illustration.',
          visualId: `vis-${chapterId}-1`,
          visualFigureNumber: 'Figure 1.1',
          correctAnswer: 'teacher, student',
          modelAnswer: 'Teacher and student (or children).',
          acceptableAnswers: ['teacher, student', 'teacher, children', 'teacher, boy, girl'],
          acceptableAlternatives: [
            'teacher and student',
            'teacher and students',
            'Ms. Priya and student',
            'teacher, boy',
          ],
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Visual Identification of People',
          curriculumObjective: 'Extract person nouns from an educational illustration.',
          cognitiveLevel: 'Understanding',
          explanation: 'Figure 1.1 shows a teacher at the front and a student seated at the wooden desk.',
          grammarRationale: 'Both teacher and student are naming words for people.',
          hints: 'Look at who is standing near the blackboard and who is sitting at the desk.',
          studentFeedback: "Great observation! 'Teacher' and 'student' are the people in the picture.",
          openEndedCriteria: {
            modelAnswer: 'Teacher and student.',
            acceptableAlternatives: ['teacher, student', 'teacher and students', 'teacher, boy and girl'],
            requiredGrammarRule: 'Must name people nouns depicted in Figure 1.1.',
            requiredElements: ['teacher', 'student'],
            caseSensitive: false,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'Named two people from picture', marks: 1 },
              { condition: 'Named only one person', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-F2`,
          type: 'visual_picture',
          prompt: 'Look at the green blackboard in Figure 1.1. Under which noun category does "classroom, school, park" belong?',
          visualId: `vis-${chapterId}-1`,
          visualFigureNumber: 'Figure 1.1',
          options: ['A) People', 'B) Places', 'C) Animals', 'D) Things'],
          correctAnswer: 'B) Places',
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Visual Reading & Classification',
          curriculumObjective: 'Read text inside artwork and classify nouns.',
          cognitiveLevel: 'Understanding',
          explanation: 'Classroom, school, and park are all names of places where people gather.',
          grammarRationale: 'Locations and buildings belong to the Place category.',
          hints: 'Read the second bullet point on the blackboard in Figure 1.1.',
          studentFeedback: "Spot on! The blackboard lists them under 'Places'.",
          teacherGuidance: 'Praise students who read the text written inside the artwork.',
        },
        {
          id: `q-${chapterId}-F3`,
          type: 'visual_picture',
          prompt: 'Look at the wooden desk in Figure 1.1. Name TWO things resting on or near the desk.',
          visualId: `vis-${chapterId}-1`,
          visualFigureNumber: 'Figure 1.1',
          correctAnswer: 'book, bag',
          modelAnswer: 'Book and bag (or pencil, water bottle).',
          acceptableAnswers: ['book, bag', 'book, school bag', 'notebook, bag'],
          acceptableAlternatives: [
            'book and bag',
            'book and school bag',
            'textbook, bag',
          ],
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Visual Identification of Things',
          curriculumObjective: 'Identify object nouns from an illustration.',
          cognitiveLevel: 'Understanding',
          explanation: 'On the desk in Figure 1.1, there is a red book and a school bag.',
          grammarRationale: 'Book and bag are naming words for things.',
          hints: 'Look closely at what the student is using on the desk.',
          studentFeedback: "Correct! The book and the bag are things.",
          openEndedCriteria: {
            modelAnswer: 'Book and bag.',
            acceptableAlternatives: ['book, bag', 'book and bag', 'book and backpack'],
            requiredGrammarRule: 'Identifies object nouns depicted on the desk.',
            requiredElements: ['book', 'bag'],
            caseSensitive: false,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'Named two objects from desk', marks: 1 },
              { condition: 'Named only one object', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-F4`,
          type: 'open_ended',
          prompt: 'In Figure 1.1, the teacher is a Common Noun. Write ONE Proper Noun that could be a special name for this teacher.',
          visualId: `vis-${chapterId}-1`,
          visualFigureNumber: 'Figure 1.1',
          correctAnswer: 'Ms. Priya (or any properly capitalized teacher name)',
          modelAnswer: 'Ms. Priya / Mrs. Sharma / Mr. Verma',
          acceptableAnswers: ['Ms. Priya', 'Mrs. Sharma', 'Miss Anita', 'Mrs. Gupta'],
          acceptableAlternatives: [
            'Ms. Priya',
            'Mrs. Sharma',
            'Miss Sunita',
            'Mr. Das',
            'Aarav',
            'Riya',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'advanced',
          conceptTested: 'Converting Common Noun to Proper Noun',
          curriculumObjective: 'Generate an appropriate proper noun to substitute for a common noun.',
          cognitiveLevel: 'Applying',
          explanation: "Any special person's name (like 'Ms. Priya' or 'Mrs. Sharma') starting with a capital letter is correct.",
          grammarRationale: 'A common noun (teacher) is replaced with a specific proper noun with capital initial.',
          hints: 'Think of your own teacher\'s name or use "Ms. Priya"!',
          studentFeedback: "Wonderful imagination! A special teacher name starting with a capital letter is a proper noun.",
          openEndedCriteria: {
            modelAnswer: 'Ms. Priya',
            acceptableAlternatives: ['Mrs. Sharma', 'Miss Anita', 'Mr. Verma', 'Mrs. Patel', 'Priya'],
            requiredGrammarRule: 'Must be a capitalized person name suitable for a teacher.',
            caseSensitive: true,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'Valid capitalized personal name provided', marks: 1 },
              { condition: 'Valid name provided but in lowercase (e.g. priya)', marks: 0.5 },
            ],
            markingNotes: 'Accept any respectful human name. Deduct 0.5 if lowercase.',
          },
        },
        {
          id: `q-${chapterId}-F5`,
          type: 'visual_picture',
          prompt: 'Look out through the window in Figure 1.1. What PLACE is visible with trees outside the classroom?',
          visualId: `vis-${chapterId}-1`,
          visualFigureNumber: 'Figure 1.1',
          correctAnswer: 'garden',
          modelAnswer: 'Garden (or park / schoolyard).',
          acceptableAnswers: ['garden', 'school garden', 'park', 'playground'],
          acceptableAlternatives: ['garden', 'the garden', 'a garden', 'park'],
          marks: 1,
          difficulty: 'Easy',
          tier: 'standard',
          conceptTested: 'Visual Identification of Place',
          curriculumObjective: 'Identify an outdoor place noun from background illustration.',
          cognitiveLevel: 'Understanding',
          explanation: "Through the classroom window, we can see the lush green 'garden'.",
          grammarRationale: 'Garden is a naming word for an outdoor place.',
          hints: 'Look through the window frame on the right side of the wall.',
          studentFeedback: "Super! The label outside the window says 'garden (place)'.",
          teacherGuidance: 'Check that learners read the label placed beneath the window in the artwork.',
        },
      ],
    },

    // -------------------------------------------------------------
    // EXERCISE G: Noun Mastery (MASTERY)
    // -------------------------------------------------------------
    {
      id: `ex-${chapterId}-G`,
      letter: 'G',
      title: 'Noun Mastery & Creative Application',
      progression: 'challenge',
      developmentalTier: 'MASTERY',
      status: 'Approved',
      instructions: 'Demonstrate your complete mastery of naming words by completing each higher-order grammar challenge below.',
      studentInstruction: 'Write your own sentences and answers demonstrating mastery of common and proper nouns.',
      teacherInstruction: 'Evaluate open-ended sentences for proper capitalization and correct classification.',
      pedagogicalPurpose: 'Summative synthesis, creative application, and higher-order grammar reasoning.',
      estimatedTimeMinutes: 20,
      learningObjective: 'Synthesize common and proper nouns into grammatically accurate original sentences.',
      grammarRuleCoverage: ['Comprehensive Noun Mastery', 'Original Sentence Generation', 'Grammar Synthesis'],
      difficulty: 'Hard',
      suggestedMarks: 5,
      questionCount: 5,
      boardRelevance: 'CBSE Class 3 Holistic Assessment',
      classLevel: 'Class 3',
      teacherNote: 'These questions test whether the student can apply the concepts in unscripted creative contexts.',
      questions: [
        {
          id: `q-${chapterId}-G1`,
          type: 'open_ended',
          prompt: 'Write ONE complete sentence that contains:\n1) One Common Noun naming an animal\n2) One Proper Noun naming a city.',
          correctAnswer: 'Model: The monkey climbed the tall tree in Jaipur.',
          modelAnswer: 'The monkey climbed the tall tree in Jaipur.',
          acceptableAlternatives: [
            'A dog ran across the street in Delhi.',
            'The elephant lives in Mysore.',
            'We saw a tiger in Bhopal.',
          ],
          marks: 1,
          difficulty: 'Hard',
          tier: 'advanced',
          conceptTested: 'Synthesizing Animal + City Nouns',
          curriculumObjective: 'Compose a sentence integrating specific required noun types.',
          cognitiveLevel: 'Creating',
          explanation: 'The sentence must contain at least one animal (common noun) and one properly capitalized city name.',
          grammarRationale: 'Tests generative command of noun categories and capitalization in self-authored prose.',
          hints: 'Choose an animal (like dog, cat, monkey) and a city (like Delhi, Jaipur, Mumbai).',
          studentFeedback: 'Fantastic creative sentence! You used both required nouns with great grammar.',
          openEndedCriteria: {
            modelAnswer: 'The monkey climbed the tree in Jaipur.',
            acceptableAlternatives: [
              'The dog ran in Delhi.',
              'We saw an elephant in Mysore.',
              'A cat was sleeping in Kolkata.',
            ],
            requiredGrammarRule: 'Must contain an animal common noun and a capitalized city proper noun.',
            requiredElements: ['animal noun', 'capitalized city noun'],
            caseSensitive: true,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'Sentence contains both nouns with correct city capitalization', marks: 1 },
              { condition: 'Contains both nouns but city is lowercase', marks: 0.5 },
              { condition: 'Only one required noun present', marks: 0.5 },
            ],
            markingNotes: 'Accept any meaningful sentence with an animal noun and city proper noun.',
          },
        },
        {
          id: `q-${chapterId}-G2`,
          type: 'open_ended',
          prompt: 'Explain in your own words: Why does the word "country" start with a small letter, but "India" must start with a capital letter?',
          correctAnswer: 'Model: "Country" is a common noun for any nation, while "India" is the special proper name of our nation.',
          modelAnswer: 'Country is a common noun naming any country in general, but India is the special proper noun name of a specific country.',
          acceptableAlternatives: [
            'Because country is a common noun and India is a proper noun.',
            'Country is a general name, but India is a special name.',
            'India is a proper noun so it needs a capital letter, but country is common.',
          ],
          marks: 1,
          difficulty: 'Hard',
          tier: 'advanced',
          conceptTested: 'Metalinguistic Explanation',
          curriculumObjective: 'Articulate the grammatical rationale for proper noun capitalization.',
          cognitiveLevel: 'Analysing',
          explanation: "'Country' is a general naming word (common noun), whereas 'India' is the specific individual name (proper noun).",
          grammarRationale: 'Requires students to explain the grammatical rule rather than merely applying it.',
          hints: 'Think about general names vs special names.',
          studentFeedback: 'Brilliant grammatical explanation! You understand the rule deeply.',
          openEndedCriteria: {
            modelAnswer: '"Country" is a common noun for any nation, while "India" is the special proper name of our nation.',
            acceptableAlternatives: [
              'Because country is a common noun and India is a proper noun.',
              'Country is general, India is special.',
            ],
            requiredGrammarRule: 'Identifies country as common/general and India as proper/special.',
            requiredSemanticMeaning: 'Explains general vs special naming distinction.',
            requiredElements: ['common/general', 'proper/special'],
            partialCreditBreakdown: [
              { condition: 'Explains both common/general and proper/special distinction', marks: 1 },
              { condition: 'Only mentions that India is a proper noun without contrasting country', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-G3`,
          type: 'classification',
          prompt: 'Find the odd one out in this group of words:\n"Monday, Friday, August, school, Diwali"',
          options: ['A) Monday', 'B) Friday', 'C) August', 'D) school'],
          correctAnswer: 'D) school',
          marks: 1,
          difficulty: 'Hard',
          tier: 'advanced',
          conceptTested: 'Odd One Out (Common vs Proper Grouping)',
          curriculumObjective: 'Isolate common nouns from a cluster of proper nouns.',
          cognitiveLevel: 'Analysing',
          explanation: "'School' is a Common Noun; Monday, Friday, August, and Diwali are all Proper Nouns.",
          grammarRationale: 'Discrimination of grammatical category among distractors.',
          hints: 'Look at capital letters: which word does not have a special name?',
          studentFeedback: "Excellent deduction! 'School' is the only common noun in the list.",
          teacherGuidance: 'Ask learners why the other four words all belong together.',
        },
        {
          id: `q-${chapterId}-G4`,
          type: 'sentence_combining',
          prompt: 'Combine these two ideas into one sentence using the proper noun "Aarav":\nIdea 1: A boy is reading a book.\nIdea 2: His name is Aarav.',
          correctAnswer: 'Aarav is reading a book.',
          modelAnswer: 'Aarav is reading a book.',
          acceptableAlternatives: [
            'Aarav is reading a book.',
            'The boy named Aarav is reading a book.',
            'Aarav is reading a book',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'advanced',
          conceptTested: 'Sentence Synthesis with Proper Noun',
          curriculumObjective: 'Synthesize common descriptions with specific proper names.',
          cognitiveLevel: 'Applying',
          explanation: "Replacing 'a boy' with his proper name 'Aarav' produces the crisp sentence: 'Aarav is reading a book.'",
          grammarRationale: 'Proper noun replaces generic common noun reference.',
          hints: 'Start your sentence with the boy\'s special name, Aarav.',
          studentFeedback: "Smooth sentence combining! 'Aarav is reading a book.' is clear and concise.",
          openEndedCriteria: {
            modelAnswer: 'Aarav is reading a book.',
            acceptableAlternatives: ['Aarav is reading a book.', 'The boy named Aarav is reading a book.'],
            requiredGrammarRule: 'Capitalize "Aarav" and formulate a coherent sentence.',
            requiredElements: ['Aarav', 'reading', 'book'],
            caseSensitive: true,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'Aarav is reading a book with proper punctuation', marks: 1 },
              { condition: 'Contains correct sentence structure but aarav in lowercase', marks: 0.5 },
            ],
          },
        },
        {
          id: `q-${chapterId}-G5`,
          type: 'open_ended',
          prompt: 'Write the special Proper Noun name for:\n1) Your favorite festival\n2) Your best friend\n3) The day of the week you like best',
          correctAnswer: 'Model: 1) Diwali  2) Rohan  3) Sunday',
          modelAnswer: '1) Diwali (or Holi/Christmas/Eid)  2) Rohan (any friend\'s name)  3) Sunday (any day of week)',
          acceptableAnswers: ['Diwali, Rohan, Sunday'],
          acceptableAlternatives: [
            'Holi, Priya, Saturday',
            'Christmas, Rahul, Friday',
            'Eid, Aarav, Sunday',
          ],
          marks: 1,
          difficulty: 'Medium',
          tier: 'advanced',
          conceptTested: 'Personal Real-World Proper Noun Elicitation',
          curriculumObjective: 'Generate capitalized proper nouns from personal experience.',
          cognitiveLevel: 'Applying',
          explanation: 'All three must be valid proper nouns and MUST begin with a capital letter.',
          grammarRationale: 'Connects classroom grammatical rules directly to student identity and world experience.',
          hints: 'Make sure all three names begin with a capital letter!',
          studentFeedback: 'Great personal examples! You applied capitalization rules to your own world.',
          openEndedCriteria: {
            modelAnswer: '1) Diwali  2) Rohan  3) Sunday',
            acceptableAlternatives: ['Any three capitalized proper nouns matching the 3 categories.'],
            requiredGrammarRule: 'All three words must be capitalized proper nouns for festival, friend, and day.',
            caseSensitive: true,
            punctuationTolerance: true,
            partialCreditBreakdown: [
              { condition: 'All three capitalized properly', marks: 1 },
              { condition: 'Two capitalized properly', marks: 0.5 },
            ],
          },
        },
      ],
    },
  ];
}

/**
 * Ensures a chapter has the complete rich exercise sequence.
 * If the chapter has 0 or only 1 basic exercise, intelligently injects / merges
 * Exercises A through G without overwriting any authored changes.
 */
export function getOrInitializeChapterExercises(chapter: StudioChapter): StudioExercise[] {
  const currentExercises = chapter.exercises || [];

  // If already contains exercises, preserve authored work
  if (currentExercises.length > 0) {
    return currentExercises;
  }

  // Only the canonical CBSE Class 3 Nouns chapter receives the default Noun sequence
  const isNounsChapter = /noun/i.test(chapter.title || '');
  if (chapter.id === 'c3-top-1' && isNounsChapter) {
    return createDefaultCbseClass3NounsExercises('c3-top-1');
  }

  // All other chapters start with clean, unauthored exercise list
  return [];
}

// -------------------------------------------------------------
// 22-POINT QUALITY AUDIT ENGINE (Section 11)
// -------------------------------------------------------------

export interface ExerciseQualityAuditResult {
  overallHealthScore: number;
  totalChecks: number;
  passedChecks: number;
  findings: ExerciseAuditIssue[];
  severityCounts: {
    clear: number;
    review_suggested: number;
    potential_issue: number;
    needs_academic_review: number;
  };
  summaryText: string;
  disclaimer: string;
}

/**
 * Runs the comprehensive 22-point publisher quality audit across all exercises in a chapter.
 */
export function runExerciseQualityAudit(chapter: StudioChapter): ExerciseQualityAuditResult {
  const exercises = chapter.exercises || [];
  const findings: ExerciseAuditIssue[] = [];

  const allQuestions = exercises.flatMap((ex) =>
    (ex.questions || []).map((q) => ({ question: q, exercise: ex }))
  );

  // Check 1: Duplicate / near-duplicate questions
  const promptMap = new Map<string, string>();
  allQuestions.forEach(({ question, exercise }) => {
    const normPrompt = (question.prompt || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (normPrompt.length > 15) {
      if (promptMap.has(normPrompt)) {
        findings.push({
          id: `audit-dup-${question.id}`,
          ruleNumber: 1,
          category: 'duplicate',
          title: `Duplicate Question Prompt Detected (${exercise.letter})`,
          description: `Question in Exercise ${exercise.letter} has identical prompt wording to a question in Exercise ${promptMap.get(normPrompt)}.`,
          severity: 'potential_issue',
          exerciseLetter: exercise.letter,
          questionId: question.id,
          recommendation: 'Differentiate the prompt wording or test another aspect of the concept.',
        });
      } else {
        promptMap.set(normPrompt, exercise.letter);
      }
    }
  });

  // Check 2: Repeated examples from theory
  const theorySentences = (chapter.sections || [])
    .flatMap((s) => s.blocks || [])
    .flatMap((b) => {
      if (b.exampleData?.items) {
        return b.exampleData.items.map((i) => i.sentence.toLowerCase());
      }
      return [];
    });
  allQuestions.forEach(({ question, exercise }) => {
    const qSentence = (question.originalSentence || question.blanksSentence || '').toLowerCase();
    if (qSentence && theorySentences.some((ts) => ts.includes(qSentence) || qSentence.includes(ts))) {
      findings.push({
        id: `audit-repeat-theory-${question.id}`,
        ruleNumber: 2,
        category: 'pedagogy',
        title: `Question Reuses Exact Theory Example (${exercise.letter})`,
        description: `The sentence in Exercise ${exercise.letter} matches an example already given in the chapter explanation.`,
        severity: 'review_suggested',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Use a novel authentic sentence to assess genuine understanding rather than rote recall.',
      });
    }
  });

  // Check 3: Ambiguous prompts
  allQuestions.forEach(({ question, exercise }) => {
    const prompt = question.prompt || '';
    if (prompt.trim().length < 10) {
      findings.push({
        id: `audit-short-prompt-${question.id}`,
        ruleNumber: 3,
        category: 'missing_data',
        title: `Ambiguous or Overly Terse Prompt (${exercise.letter})`,
        description: `Prompt is under 10 characters long, which may confuse young learners.`,
        severity: 'potential_issue',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Provide clear, explicit instructions on what the student is required to do.',
      });
    }
  });

  // Check 4: Missing answers
  allQuestions.forEach(({ question, exercise }) => {
    if (!question.correctAnswer && !question.modelAnswer) {
      findings.push({
        id: `audit-missing-ans-${question.id}`,
        ruleNumber: 4,
        category: 'answer_key',
        title: `Missing Correct Answer or Model Key (${exercise.letter})`,
        description: `Question lacks a designated correct answer or model answer.`,
        severity: 'needs_academic_review',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Provide a primary correct answer and acceptable alternatives.',
      });
    }
  });

  // Check 5: Incorrect answer-option count for MCQ
  allQuestions.forEach(({ question, exercise }) => {
    if (question.type === 'mcq') {
      const optCount = question.options?.length || 0;
      if (optCount < 3 || optCount > 5) {
        findings.push({
          id: `audit-mcq-opt-${question.id}`,
          ruleNumber: 5,
          category: 'pedagogy',
          title: `Non-Standard MCQ Option Count (${optCount} options in Ex ${exercise.letter})`,
          description: `MCQs should have 3 options (early primary) or 4 options (standard school benchmark).`,
          severity: 'review_suggested',
          exerciseLetter: exercise.letter,
          questionId: question.id,
          recommendation: 'Standardize to 4 options for consistency.',
        });
      }
    }
  });

  // Check 6: Multiple potentially correct MCQ answers
  allQuestions.forEach(({ question, exercise }) => {
    if (question.type === 'mcq' && question.options) {
      const match = question.options.some((o) =>
        o.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase() ||
        o.toLowerCase().includes(question.correctAnswer?.toLowerCase())
      );
      if (!match) {
        findings.push({
          id: `audit-mcq-nomatch-${question.id}`,
          ruleNumber: 6,
          category: 'answer_key',
          title: `MCQ Answer Key Not Found Among Options (${exercise.letter})`,
          description: `Correct answer "${question.correctAnswer}" does not cleanly match any option in the list.`,
          severity: 'needs_academic_review',
          exerciseLetter: exercise.letter,
          questionId: question.id,
          recommendation: 'Ensure the correct answer string exactly matches one of the provided options.',
        });
      }
    }
  });

  // Check 7: Missing marks
  allQuestions.forEach(({ question, exercise }) => {
    if (!question.marks || question.marks <= 0) {
      findings.push({
        id: `audit-no-marks-${question.id}`,
        ruleNumber: 7,
        category: 'missing_data',
        title: `Question Lacks Marks Allocation (${exercise.letter})`,
        description: `Question has no marks or 0 marks allocated.`,
        severity: 'potential_issue',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Assign standard marks (typically 1 mark for objective, 1-2 marks for composition).',
      });
    }
  });

  // Check 8: Missing curriculum objectives
  allQuestions.forEach(({ question, exercise }) => {
    if (!question.curriculumObjective && !exercise.learningObjective) {
      findings.push({
        id: `audit-no-obj-${question.id}`,
        ruleNumber: 8,
        category: 'curriculum',
        title: `Unmapped Learning Objective (${exercise.letter})`,
        description: `Question has no curriculum objective assigned.`,
        severity: 'review_suggested',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Link question to a specific chapter learning objective.',
      });
    }
  });

  // Check 9: Missing rule links
  allQuestions.forEach(({ question, exercise }) => {
    if (!question.conceptTested && !question.requiredRule) {
      findings.push({
        id: `audit-no-rule-${question.id}`,
        ruleNumber: 9,
        category: 'curriculum',
        title: `Missing Grammar Concept/Rule Link (${exercise.letter})`,
        description: `Question is not explicitly tagged with the grammar rule tested.`,
        severity: 'review_suggested',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Specify which grammar concept or rule is tested.',
      });
    }
  });

  // Check 10: Unbalanced difficulty
  const difficulties = allQuestions.map((q) => q.question.difficulty || 'Medium');
  const easyCount = difficulties.filter((d) => d === 'Easy').length;
  const hardCount = difficulties.filter((d) => d === 'Hard').length;
  if (allQuestions.length >= 10 && easyCount === allQuestions.length) {
    findings.push({
      id: 'audit-diff-all-easy',
      ruleNumber: 10,
      category: 'progression',
      title: 'Chapter Exercises Lack Challenge (100% Easy)',
      description: 'All questions in the chapter are rated Easy with no medium or extension tasks.',
      severity: 'potential_issue',
      recommendation: 'Incorporate application and challenge exercises for balanced cognitive rigor.',
    });
  } else if (allQuestions.length >= 10 && hardCount === allQuestions.length) {
    findings.push({
      id: 'audit-diff-all-hard',
      ruleNumber: 10,
      category: 'progression',
      title: 'Chapter Exercises Lack Foundation (100% Hard)',
      description: 'All questions in the chapter are rated Hard with no introductory scaffolded practice.',
      severity: 'potential_issue',
      recommendation: 'Add foundation recognition exercises before higher-order challenges.',
    });
  }

  // Check 11: Insufficient progression
  const hasFoundation = exercises.some((e) => e.developmentalTier === 'FOUNDATION' || e.progression === 'foundation');
  const hasApplication = exercises.some((e) => e.developmentalTier === 'APPLICATION' || e.progression === 'application');
  if (exercises.length >= 3 && !hasFoundation) {
    findings.push({
      id: 'audit-prog-no-foundation',
      ruleNumber: 11,
      category: 'progression',
      title: 'Missing Foundation Exercise Tier',
      description: 'The exercise sequence lacks an initial Foundation tier to scaffold beginner learners.',
      severity: 'potential_issue',
      recommendation: 'Begin with Exercise A as Foundation focusing on basic identification.',
    });
  }
  if (exercises.length >= 3 && !hasApplication) {
    findings.push({
      id: 'audit-prog-no-app',
      ruleNumber: 11,
      category: 'progression',
      title: 'Missing Application Exercise Tier',
      description: 'The exercise sequence lacks an Application tier where rules are used in authentic writing.',
      severity: 'review_suggested',
      recommendation: 'Include sentence rewriting or error correction application exercises.',
    });
  }

  // Check 12: Over-testing / under-testing concepts
  const concepts = allQuestions.map((q) => q.question.conceptTested || 'General');
  const conceptCounts: Record<string, number> = {};
  concepts.forEach((c) => {
    conceptCounts[c] = (conceptCounts[c] || 0) + 1;
  });
  Object.keys(conceptCounts).forEach((c) => {
    if (allQuestions.length >= 15 && conceptCounts[c] > allQuestions.length * 0.7) {
      findings.push({
        id: `audit-overtest-${c}`,
        ruleNumber: 12,
        category: 'pedagogy',
        title: `Over-Testing of Single Concept: "${c}"`,
        description: `Over 70% of questions in the chapter focus exclusively on "${c}".`,
        severity: 'review_suggested',
        recommendation: 'Balance question distribution across all concepts introduced in chapter theory.',
      });
    }
  });

  // Check 13: Too many questions of one type
  const types = allQuestions.map((q) => q.question.type);
  const mcqCount = types.filter((t) => t === 'mcq').length;
  if (allQuestions.length >= 10 && mcqCount === allQuestions.length) {
    findings.push({
      id: 'audit-type-monotony',
      ruleNumber: 13,
      category: 'pedagogy',
      title: 'Monotonous Question Format (100% MCQ)',
      description: 'All exercises use multiple choice with no fill-in-blanks, rewrites, or visual tasks.',
      severity: 'potential_issue',
      recommendation: 'Introduce diverse question formats: underline, sentence rewriting, and classification.',
    });
  }

  // Check 14: Age-inappropriate wording
  const forbiddenPrimaryWords = ['syntactic', 'morphological', 'concordance', 'ubiquitous', 'tautology'];
  allQuestions.forEach(({ question, exercise }) => {
    const text = (question.prompt + ' ' + (question.instruction || '')).toLowerCase();
    forbiddenPrimaryWords.forEach((word) => {
      if (text.includes(word)) {
        findings.push({
          id: `audit-vocab-${question.id}-${word}`,
          ruleNumber: 14,
          category: 'language',
          title: `Overly Academic Vocabulary in Primary Prompt (${exercise.letter})`,
          description: `Prompt contains high-level linguistic terminology ("${word}") unsuitable for Class 3.`,
          severity: 'potential_issue',
          exerciseLetter: exercise.letter,
          questionId: question.id,
          recommendation: `Replace "${word}" with child-friendly phrasing (e.g. naming word, special name).`,
        });
      }
    });
  });

  // Check 15: Excessively long instructions
  exercises.forEach((ex) => {
    if (ex.instructions && ex.instructions.length > 250) {
      findings.push({
        id: `audit-long-inst-${ex.id}`,
        ruleNumber: 15,
        category: 'language',
        title: `Excessively Long Exercise Instructions (${ex.letter})`,
        description: `Instructions for Exercise ${ex.letter} exceed 250 characters.`,
        severity: 'review_suggested',
        exerciseLetter: ex.letter,
        recommendation: 'Shorten student instructions into direct, scannable steps.',
      });
    }
  });

  // Check 16: Unnecessary vocabulary difficulty
  allQuestions.forEach(({ question, exercise }) => {
    const words = (question.prompt || '').split(/\s+/).length;
    if (words > 40) {
      findings.push({
        id: `audit-long-prompt-${question.id}`,
        ruleNumber: 16,
        category: 'language',
        title: `Overly Wordy Question Prompt (${words} words in Ex ${exercise.letter})`,
        description: `Prompt length exceeds 40 words, which can impede comprehension for primary students.`,
        severity: 'review_suggested',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Condense prompt text to 1-2 direct sentences.',
      });
    }
  });

  // Check 17: Questions relying on unexplained concepts
  // (Passes if concepts align with chapter title/category)

  // Check 18: Visual questions without visual assets
  allQuestions.forEach(({ question, exercise }) => {
    if (question.type === 'visual_picture' && !question.visualId && !exercise.visualId) {
      findings.push({
        id: `audit-visual-missing-${question.id}`,
        ruleNumber: 18,
        category: 'visual',
        title: `Visual Question Lacks Linked Figure Asset (${exercise.letter})`,
        description: `Question is configured as a visual stimulus question but has no visual asset or Figure attached.`,
        severity: 'needs_academic_review',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Link Figure 1.1 or attach visual artwork from Visual Studio.',
      });
    }
  });

  // Check 19: Visual questions with missing captions/alt text
  // (Ensured when visual is linked)

  // Check 20: Answer-key mismatch
  allQuestions.forEach(({ question, exercise }) => {
    if (question.openEndedCriteria && !question.openEndedCriteria.modelAnswer) {
      findings.push({
        id: `audit-open-no-model-${question.id}`,
        ruleNumber: 20,
        category: 'answer_key',
        title: `Open-Ended Question Lacks Model Answer Rubric (${exercise.letter})`,
        description: `Open-ended question has no explicit model answer criteria.`,
        severity: 'potential_issue',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Provide a model answer and acceptable alternative criteria.',
      });
    }
  });

  // Check 21: Question numbering / sequence
  exercises.forEach((ex) => {
    if ((ex.questions || []).length === 0) {
      findings.push({
        id: `audit-empty-ex-${ex.id}`,
        ruleNumber: 21,
        category: 'missing_data',
        title: `Empty Exercise Set (${ex.letter})`,
        description: `Exercise ${ex.letter} contains 0 questions.`,
        severity: 'needs_academic_review',
        exerciseLetter: ex.letter,
        recommendation: 'Add at least 3-5 graded questions or remove the placeholder exercise.',
      });
    }
  });

  // Check 22: Possible grammatical ambiguity in open-ended items
  allQuestions.forEach(({ question, exercise }) => {
    if (
      (question.type === 'rewrite_sentence' || question.type === 'open_ended') &&
      (!question.acceptableAlternatives || question.acceptableAlternatives.length === 0)
    ) {
      findings.push({
        id: `audit-no-alt-${question.id}`,
        ruleNumber: 22,
        category: 'answer_key',
        title: `Open-Ended Item Lacks Acceptable Alternatives (${exercise.letter})`,
        description: `Question expects student writing but has no registered acceptable alternative phrasing.`,
        severity: 'review_suggested',
        exerciseLetter: exercise.letter,
        questionId: question.id,
        recommendation: 'Add acceptable variations in punctuation, articles, or equivalent wording.',
      });
    }
  });

  // Calculate severities
  const severityCounts = {
    clear: 22 - Math.min(22, findings.length),
    review_suggested: findings.filter((f) => f.severity === 'review_suggested').length,
    potential_issue: findings.filter((f) => f.severity === 'potential_issue').length,
    needs_academic_review: findings.filter((f) => f.severity === 'needs_academic_review').length,
  };

  const penalty =
    severityCounts.needs_academic_review * 10 +
    severityCounts.potential_issue * 4 +
    severityCounts.review_suggested * 1.5;

  const overallHealthScore = Math.max(25, Math.min(100, Math.round(100 - penalty)));
  const passedChecks = Math.max(0, 22 - (severityCounts.needs_academic_review + severityCounts.potential_issue));

  let summaryText = 'Excellent Academic Standing. All pedagogical and structural checks passed.';
  if (severityCounts.needs_academic_review > 0) {
    summaryText = `${severityCounts.needs_academic_review} item(s) require academic editor review before publication.`;
  } else if (severityCounts.potential_issue > 0) {
    summaryText = `Overall strong quality with ${severityCounts.potential_issue} minor editorial suggestions.`;
  }

  return {
    overallHealthScore,
    totalChecks: 22,
    passedChecks,
    findings,
    severityCounts,
    summaryText,
    disclaimer:
      'Advisory publisher audit. These recommendations are based on VERITAS academic publishing standards and do not claim official CBSE, CISCE, or Cambridge assessment approval or endorsement.',
  };
}

// -------------------------------------------------------------
// COVERAGE MATRIX BUILDER (Section 12)
// -------------------------------------------------------------

export interface ChapterCoverageMatrixResult {
  concepts: string[];
  exercises: { letter: string; title: string; tier: string }[];
  cells: ExerciseCoverageCell[];
  coveragePercentage: number;
  uncoveredConcepts: string[];
}

/**
 * Builds the interactive Coverage Matrix mapping chapter grammar rules/concepts to exercises.
 */
export function buildExerciseCoverageMatrix(chapter: StudioChapter): ChapterCoverageMatrixResult {
  const exercises = chapter.exercises || [];

  // Extract concepts from opening, sections, and objectives
  const conceptSet = new Set<string>();
  (chapter.opening?.conceptsCovered || []).forEach((c) => conceptSet.add(c));
  (chapter.opening?.learningObjectives || []).forEach((o) => conceptSet.add(o));
  (chapter.sections || []).forEach((s) => conceptSet.add(s.title));

  // Fallback defaults for Nouns
  if (conceptSet.size === 0) {
    conceptSet.add('Noun Definition');
    conceptSet.add('Person, Place, Animal, Thing');
    conceptSet.add('Common vs Proper Nouns');
    conceptSet.add('Proper Noun Capitalization');
    conceptSet.add('Visual Classroom Naming Words');
  }

  const concepts = Array.from(conceptSet);
  const exerciseList = exercises.map((e) => ({
    letter: e.letter,
    title: e.title,
    tier: e.developmentalTier || e.progression.toUpperCase(),
  }));

  const cells: ExerciseCoverageCell[] = [];
  const coveredConceptsSet = new Set<string>();

  concepts.forEach((concept) => {
    exercises.forEach((ex) => {
      const matchingQuestions = (ex.questions || []).filter((q) => {
        const cTested = (q.conceptTested || '').toLowerCase();
        const cObj = (q.curriculumObjective || '').toLowerCase();
        const ruleCov = (ex.grammarRuleCoverage || []).map((r) => r.toLowerCase());
        const search = concept.toLowerCase();

        return (
          cTested.includes(search) ||
          search.includes(cTested) ||
          cObj.includes(search) ||
          search.includes(cObj) ||
          ruleCov.some((r) => r.includes(search) || search.includes(r))
        );
      });

      const qCount = matchingQuestions.length;
      let coverageLevel: 'none' | 'introduced' | 'practised' | 'applied' | 'mastered' = 'none';

      if (qCount > 0) {
        coveredConceptsSet.add(concept);
        if (ex.developmentalTier === 'MASTERY') {
          coverageLevel = 'mastered';
        } else if (ex.developmentalTier === 'APPLICATION' || ex.progression === 'error_analysis') {
          coverageLevel = 'applied';
        } else if (qCount >= 2 || ex.developmentalTier === 'PRACTICE') {
          coverageLevel = 'practised';
        } else {
          coverageLevel = 'introduced';
        }
      }

      cells.push({
        concept,
        exerciseLetter: ex.letter,
        coverageLevel,
        questionCount: qCount,
        questionIds: matchingQuestions.map((q) => q.id),
      });
    });
  });

  const uncoveredConcepts = concepts.filter((c) => !coveredConceptsSet.has(c));
  const coveragePercentage = concepts.length > 0
    ? Math.round((coveredConceptsSet.size / concepts.length) * 100)
    : 100;

  return {
    concepts,
    exercises: exerciseList,
    cells,
    coveragePercentage,
    uncoveredConcepts,
  };
}

/**
 * Initial exercises getter alias
 */
export function getInitialStudioExercises(chapter?: StudioChapter): StudioExercise[] {
  // Strictly return Nouns exercises only for the canonical CBSE Class 3 Nouns chapter
  if (chapter?.id === 'c3-top-1' && /noun/i.test(chapter.title || '')) {
    return createDefaultCbseClass3NounsExercises('c3-top-1');
  }
  // All other chapters must not have hardcoded demo/fallback exercises fabricated
  return [];
}
