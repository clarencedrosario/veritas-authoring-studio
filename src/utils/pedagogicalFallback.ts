// ============================================================================
// VERITAS ACADEMIC ENGINE: Offline Pedagogical Fallback Generator
// Fully calibrated across Classes 1–12 and all Educational Boards (CBSE, CISCE, Cambridge)
// ============================================================================

import {
  parseClassLevelNumber,
  getPedagogicalTier,
  getPedagogicalClassProfile,
  getCurriculumBoardProfile,
  cleanMarkdownSyntax,
  cleanHeadingTitle,
  cleanLeakedEditorialTerms,
  sanitizeContentStrippingRationale,
  PedagogicalTier,
} from './pedagogicalProfileSystem';

export interface PedagogicalWritingActionResult {
  actionLabel: string;
  result: string;
  rationale: string;
}

export interface PedagogicalDraftSection {
  title: string;
  sectionType: string;
  rationale: string;
  content: string;
}

export interface PedagogicalChapterDraft {
  chapterTitle: string;
  subtitle: string;
  pedagogicalOverview: string;
  sections: PedagogicalDraftSection[];
}

/**
 * Generic helper to extract and categorize author instructions.
 */
function parseAuthorDirectives(instructions?: string) {
  if (!instructions || !instructions.trim()) {
    return {
      hasDirectives: false,
      raw: '',
      wantsSubjectVerbDefinition: false,
      wantsPrerequisiteDefinitions: false,
      wantsCollectiveNouns: false,
      wantsExamFocus: false,
    };
  }
  const raw = instructions.trim();
  const lower = raw.toLowerCase();

  const wantsSubjectVerbDefinition =
    (lower.includes('subject') && lower.includes('verb')) &&
    (lower.includes('definition') || lower.includes('define') || lower.includes('explain') || lower.includes('what is') || lower.includes('before') || lower.includes('introduce') || lower.includes('simple'));

  const wantsPrerequisiteDefinitions =
    wantsSubjectVerbDefinition ||
    lower.includes('prerequisite') ||
    lower.includes('foundational definition') ||
    lower.includes('basic definition');

  const wantsCollectiveNouns = lower.includes('collective noun');
  const wantsExamFocus = lower.includes('exam') || lower.includes('board') || lower.includes('trap') || lower.includes('cisce') || lower.includes('icse');

  return {
    hasDirectives: true,
    raw,
    wantsSubjectVerbDefinition,
    wantsPrerequisiteDefinitions,
    wantsCollectiveNouns,
    wantsExamFocus,
  };
}

/**
 * Generates age-appropriate, board-aligned AI writing actions (examples, exercises, activities, etc.)
 */
export function generatePedagogicalWritingAction(
  action: string,
  chapterTitle: string,
  sectionTitle: string,
  classLevel: string,
  board: string,
  subject: string,
  text: string,
  instructions?: string
): PedagogicalWritingActionResult {
  const topic = chapterTitle || "Core Grammar Study";
  const section = sectionTitle || "Main Lesson";
  const classNum = parseClassLevelNumber(classLevel);
  const tier = getPedagogicalTier(classNum);
  const boardProfile = getCurriculumBoardProfile(board);

  // --------------------------------------------------------------------------
  // TIER 1: CLASSES 1–2 (Early Primary / Foundation)
  // --------------------------------------------------------------------------
  if (tier === 'foundation') {
    switch (action) {
      case "suggest_activities":
        return {
          actionLabel: "Suggest Classroom Activities",
          result: `Fun Classroom Games for ${topic} (Class ${classNum})

1. The Magic Word Bag (Hands-on Mystery Game)
   - How to Play: The teacher puts familiar toys, fruit, and classroom things (toy car, apple, pencil, teddy bear) inside a colourful cloth bag. Children take turns putting a hand in, picking an item, and shouting its naming word aloud.
   - Child Task: "I found a blue pencil! Pencil is a naming word!"
   - Why It Helps: Connects naming words to real objects that 6-year-olds can touch and see.

2. Act It Out! (Playground Action Relay)
   - How to Play: Form two small circles. Call out a word. If it is a naming word (puppy, ball), children point to an object. If it is an action word (jump, clap), they do the action!
   - Why It Helps: Teaches children to notice the difference between words through cheerful physical movement.

3. Draw and Label My World (Art & Word Matching)
   - How to Play: Children draw their favourite pet or family member and write the naming word underneath with bright crayons.
   - Why It Helps: Builds handwriting confidence and personal connection.`,
          rationale: `Tailored specifically for Class ${classNum} learners (Age 6–7) with play-based, multisensory activities and zero academic pressure.`,
        };

      case "generate_exercises":
        return {
          actionLabel: "Generate Practice Exercises",
          result: `Fun Practice with ${topic} (Class ${classNum})

Part 1: Circle the Naming Words
Look at the words in each row. Circle the naming word:
1. dog   •   run   •   happy
2. jump  •   apple •   fast
3. ball  •   sleep •   blue

Part 2: Complete the Sentence
Choose the right word from the box and fill in the blank:
[ sister  •  cat  •  book ]
4. Maya plays with her pet __________.
5. My __________ helps me pack my school bag.
6. Ravi reads a colourful story __________.

Part 3: Picture Clues
7. Draw a picture of your favourite fruit. Write its name below:
   "This is a sweet _______________."

---
Answers & Teacher Notes:
1. dog (animal)
2. apple (food/fruit)
3. ball (toy/thing)
4. cat
5. sister
6. book
7. Student's choice (e.g., mango, banana). Great job!`,
          rationale: `Calibrated with short 5–8 word sentences and concrete vocabulary for Class ${classNum}.`,
        };

      case "generate_examples":
        return {
          actionLabel: "Generate Concrete Examples",
          result: `Easy Examples of ${topic} for Class ${classNum}

Everyday Things in Our World:
1. People in Our Family:
   • Mother smiles at me.
   • The doctor helps us stay healthy.

2. Places We Love to Visit:
   • We go to school every morning.
   • The children play in the green park.

3. Friendly Animals:
   • The little puppy wags its tail.
   • A green parrot sits on the branch.

4. Things We Play With:
   • Ravi bounces the red ball.
   • Maya writes with her yellow pencil.

Notice: Every bold word is the name of a person, place, animal, or thing!`,
          rationale: `Concrete examples drawn from family, home, toys, and pets suitable for Class ${classNum}.`,
        };

      default:
        return {
          actionLabel: "Writing Guidance",
          result: `Let us learn about ${topic}! Every person, place, animal, and thing around us has a special name. When you look around your classroom, you see desks, chairs, and friendly faces. Each of these words is a naming word that helps us share stories with our friends and family.`,
          rationale: `Gentle, friendly foundational exposition for Class ${classNum}.`,
        };
    }
  }

  // --------------------------------------------------------------------------
  // TIER 2: CLASSES 3–5 (Primary / Preparatory)
  // --------------------------------------------------------------------------
  if (tier === 'preparatory') {
    switch (action) {
      case "suggest_activities":
        return {
          actionLabel: "Suggest Classroom Activities",
          result: `Interactive Classroom Activities for ${topic} (Class ${classNum} · ${boardProfile.board})

1. Word Detective Hunt (Partner Scavenger Hunt)
   - Procedure: Give students short, engaging paragraphs from children's storybooks. In pairs, students underline target words with coloured highlighters and group them into friendly categories on a chart.
   - Learning Goal: Develops keen observation in real reading contexts.

2. The Sentence Building Challenge (Card Game)
   - Procedure: Students receive two coloured cards—one with a subject and one with a predicate. Teams race to pair them up so the words agree correctly and make complete sense.
   - Learning Goal: Reinforces sentence structure and word agreement playfully.

3. Fix the Story! (Help the Book Editor)
   - Procedure: Display a short 4-sentence story containing 3 obvious, humorous mistakes. The class works together as "Junior Editors" to spot each mistake and explain how to fix it.
   - Learning Goal: Normalises error-spotting without fear and encourages peer collaboration.`,
          rationale: `Designed for 8–10 year-olds using cooperative partner work, storybook contexts, and active manipulation.`,
        };

      case "generate_exercises":
        return {
          actionLabel: "Generate Practice Exercises",
          result: `Practice Drills: ${topic} (Class ${classNum} · ${boardProfile.board})

Section A: Choose the Correct Word
Choose the correct word in brackets to complete each sentence:
1. The teacher (writes / write) neatly on the blackboard.
2. Maya and Rohan (enjoys / enjoy) playing cricket on Saturday morning.
3. A playful monkey (swings / swing) from the high branch.
4. The children in our class (is / are) making paper boats.

Section B: Sentence Correction
Read each sentence. If it has a mistake, rewrite it correctly on the line:
5. The basket of ripe mangoes were on the wooden table.
   Correction: ____________________________________________________
6. Every puppy in the yard have a small red collar.
   Correction: ____________________________________________________

Section C: Creative Sentence Making
7. Write one sentence about your school sports day using a singular subject.
8. Write one sentence about your family using a plural subject.

---
Answer Key & Explanations:
1. writes (Singular subject 'teacher' takes a singular verb).
2. enjoy (Compound subject 'Maya and Rohan' is plural).
3. swings (Singular animal subject 'monkey').
4. are (Plural subject 'children').
5. Correction: "The basket of ripe mangoes was on the wooden table." (The subject is 'basket', which is singular).
6. Correction: "Every puppy in the yard has a small red collar." ('Every puppy' is singular).
7. Model: "Our team wins the relay race every year."
8. Model: "My parents prepare delicious sandwiches for our picnic."`,
          rationale: `Progressively graded for Class ${classNum} with clear instructions, relatable school examples, and friendly explanations.`,
        };

      default:
        return {
          actionLabel: "Writing Guidance",
          result: `Understanding ${topic} helps us build clear, colourful sentences. When we write stories or answer questions in class, our words must fit together smoothly. Let us look closely at how words work as a team to make our meaning clear to every reader.`,
          rationale: `Clear, encouraging textbook prose for primary learners in Class ${classNum}.`,
        };
    }
  }

  // --------------------------------------------------------------------------
  // TIER 3: CLASSES 6–8 (Middle School / Lower Secondary)
  // --------------------------------------------------------------------------
  if (tier === 'middle') {
    switch (action) {
      case "suggest_activities":
        return {
          actionLabel: "Suggest Classroom Activities",
          result: `Classroom Activities for ${topic} (Class ${classNum} · ${boardProfile.board})

1. The School Newspaper Editorial Desk (Peer Editing Workshop)
   - Procedure: Distribute a drafted 200-word article for the school magazine containing 5 realistic concord and punctuation errors. Students work in editorial desks of three to audit the article.
   - Task: Identify each error, highlight the true subject, and supply the correct verb form with a one-sentence justification.
   - Outcome: Builds practical proofreading skill and grammatical vigilance in authentic school contexts.

2. The Subject-Verb Agreement Speed Grid (Interactive Board Game)
   - Procedure: Divide the class into two teams. Present sentences with deceptive intervening phrases (e.g., "along with", "as well as", "one of the..."). Students must identify the head noun before choosing the correct verb.
   - Outcome: Demystifies distracting prepositional phrases and builds instant confidence.

3. Museum of Common Traps (Error Analysis Wall)
   - Procedure: Students create short poster strips showing a "Common Exam Trap" alongside its "Quick Fix Rule" and display them on the class bulletin board.
   - Outcome: Promotes reflective learning and helps students recognize classic board traps.`,
          rationale: `Calibrated for middle school students (Age 11–13) with collaborative tasks, school newspaper scenarios, and clear rules.`,
        };

      case "generate_exercises":
        return {
          actionLabel: "Generate Practice Exercises",
          result: `Practice Drills: ${topic} (Class ${classNum} · ${boardProfile.board})

Exercise A: Guided Choice
Select the correct verb to complete each sentence:
1. The captain, along with the team members, (has / have) arrived at the stadium.
2. Neither the head boy nor the prefects (was / were) present at the assembly hall.
3. A bouquet of fresh yellow roses (brightens / brighten) the library entrance.
4. Ten kilometres (is / are) a long distance to walk in the afternoon heat.

Exercise B: Error Rectification
Find the error in each sentence, underline it, and write the corrected sentence:
5. One of my closest friends play the violin in the school orchestra.
   Correction: ____________________________________________________
6. The quality of these new paints are exceptional.
   Correction: ____________________________________________________

Exercise C: Contextual Sentence Writing
7. Write a sentence about a science club experiment using the phrase "along with".
8. Write a sentence about a school sports competition using "neither... nor".

---
Answer Key & Diagnostic Notes:
1. has (The true subject is singular 'captain'; the phrase 'along with...' does not change the subject number).
2. were (When subjects are joined by 'neither... nor', the verb agrees with the nearer subject 'prefects').
3. brightens (The head noun is the singular 'bouquet', not 'roses').
4. is (Measurements of distance, time, and money expressing a single amount take a singular verb).
5. Correction: "One of my closest friends plays the violin in the school orchestra." (The subject is 'one', which is singular).
6. Correction: "The quality of these new paints is exceptional." (The subject is 'quality', which is singular).`,
          rationale: `Aligned with middle school examination patterns and common concord traps without university jargon.`,
        };

      case "generate_examples":
        return {
          actionLabel: "Generate Concrete Examples",
          result: `Key Examples of ${topic} (Class ${classNum})

1. The Intervening Phrase Trap:
   • Incorrect: The teacher, along with thirty students, have entered the science lab.
   • Correct: The teacher, along with thirty students, has entered the science lab.
   • Explanation: The true subject is 'teacher' (singular). The phrase 'along with thirty students' is extra information and does not make the subject plural.

2. The Proximity Rule (Neither... Nor / Either... Or):
   • Example 1: Neither the coach nor the players were ready for the sudden shower.
     (The verb agrees with the nearer subject: players = were)
   • Example 2: Neither the players nor the coach was ready for the sudden shower.
     (The verb agrees with the nearer subject: coach = was)

3. Quantities as a Single Unit:
   • Fifty rupees is the price of this notebook.
   • Two hours is plenty of time to finish the quiz.`,
          rationale: `Direct, accessible examples with clear middle-school explanations.`,
        };

      default:
        return {
          actionLabel: "Writing Guidance",
          result: `Understanding ${topic} gives your writing strength and polish. In English, the subject and the verb in a sentence must always agree with each other. By learning to identify the true subject and filter out intervening phrases, you will write essays, reports, and answers with total confidence.`,
          rationale: `Clean, encouraging middle-school textbook prose for Class ${classNum}.`,
        };
    }
  }

  // --------------------------------------------------------------------------
  // TIER 4: CLASSES 9–10 (Secondary / High School / Board Exam)
  // --------------------------------------------------------------------------
  if (tier === 'secondary') {
    switch (action) {
      case "generate_exercises":
        return {
          actionLabel: "Generate Practice Exercises",
          result: `Board Examination Drills: ${topic} (Class ${classNum} · ${boardProfile.board})

Section 1: Transformation of Sentences
Rewrite the following sentences according to the instructions given after each. Make other changes that may be necessary, but do not change the meaning of any sentence:
1. No sooner did the bell ring than the students rushed out of the hall.
   (Begin with: As soon as...)
2. Although the team practiced diligently every evening, they failed to secure the trophy.
   (Begin with: In spite of...)
3. The principal said to the students, "Submit your project files before Friday afternoon."
   (Rewrite in Indirect Speech)
4. She was so exhausted that she could not complete the final lap of the race.
   (Use: too... to)

Section 2: Synthesis and Concord Drills
Join each pair of sentences without using 'and', 'but', or 'so':
5. The monsoon arrived late this season. The farmers were still able to harvest a bumper crop.
6. The research paper was published in a prestigious journal. It brought international recognition to the university.

---
Complete Marking Scheme & Diagnostic Rationale:
1. "As soon as the bell rang, the students rushed out of the hall."
   [Marking criteria: Correct past tense 'rang' and removal of 'than'].
2. "In spite of practicing diligently every evening, the team failed to secure the trophy."
   [Marking criteria: Gerund phrase following preposition 'in spite of'].
3. "The principal instructed the students to submit their project files before Friday afternoon."
   [Marking criteria: Reporting verb changed to 'instructed/told' with infinitive clause].
4. "She was too exhausted to complete the final lap of the race."
   [Marking criteria: Accurate 'too... to' construction eliminating the clause marker].
5. "Although the monsoon arrived late this season, the farmers were still able to harvest a bumper crop."
6. "Published in a prestigious journal, the research paper brought international recognition to the university."`,
          rationale: `Rigorous, board-calibrated transformation exercises adhering to ${boardProfile.board} examination standards for Class ${classNum}.`,
        };

      default:
        return {
          actionLabel: "Writing Guidance",
          result: `Mastery of ${topic} is fundamental to advanced syntax and board examination excellence in Class ${classNum}. Precision in sentence structure, correct concord management, and seamless transformation between grammatical registers ensure that analytical essays and examination responses communicate with authority and accuracy.`,
          rationale: `Analytical, board-focused academic prose for Class ${classNum}.`,
        };
    }
  }

  // --------------------------------------------------------------------------
  // TIER 5: CLASSES 11–12 (Senior Secondary / Pre-University)
  // --------------------------------------------------------------------------
  switch (action) {
    case "generate_exercises":
      return {
        actionLabel: "Generate Advanced Exercises",
        result: `Advanced Stylistic & Syntactic Drills: ${topic} (Class ${classNum} · ${boardProfile.board})

Part A: Advanced Sentence Transformation & Inversion
1. Re-write employing negative inversion for rhetorical emphasis:
   "The committee had rarely witnessed such unanimous support for an institutional reform."
   (Begin: Seldom...)
2. Re-write utilizing conditional inversion without 'if':
   "If the economic delegation had anticipated the market fluctuations, they would have restructured the agreement."
   (Begin: Had...)
3. Transform from passive analytical to active rhetorical focus while preserving register:
   "It has been widely argued by constitutional scholars that the amendment lacks structural coherence."

Part B: Concord and Register Diagnostics
4. Identify the nuanced concord error and provide a scholarly correction:
   "A substantial proportion of the published findings in recent clinical trials appears to lack reproducible statistical verification."

---
Scholarly Solutions & Stylistic Notes:
1. "Seldom had the committee witnessed such unanimous support for an institutional reform."
2. "Had the economic delegation anticipated the market fluctuations, they would have restructured the agreement."
3. "Constitutional scholars widely argue that the amendment lacks structural coherence."
4. Correction: "... appear to lack reproducible statistical verification." (With proportions/percentages followed by a plural count noun 'findings', the verb takes the plural form in standard academic discourse).`,
        rationale: `Publication-grade senior secondary exercises emphasizing syntactic inversion, conditional clauses, and sophisticated concord.`,
      };

    default:
      return {
        actionLabel: "Writing Guidance",
        result: `At the senior secondary level, **${topic}** is studied not merely as a set of mechanical rules, but as an essential instrument of rhetorical style and analytical argumentation. Clear syntactic control allows the mature writer to structure multifaceted ideas with precision, cadence, and scholarly authority.`,
        rationale: `Publication-grade senior-secondary exposition for Class ${classNum}.`,
      };
  }
}

/**
 * Generates an age-appropriate chapter draft structure and content for Classes 1–12.
 * Strictly enforces clean headings, appropriate sentence length, and real textbook reading material.
 */
export function generatePedagogicalChapterDraft(
  chapterTitle: string,
  classLevel: string,
  board: string,
  subject: string,
  instructions?: string
): PedagogicalChapterDraft {
  const title = chapterTitle?.trim() || "English Grammar & Structural Mechanics";
  const classNum = parseClassLevelNumber(classLevel);
  const tier = getPedagogicalTier(classNum);
  const boardProfile = getCurriculumBoardProfile(board);
  const directives = parseAuthorDirectives(instructions);

  // --------------------------------------------------------------------------
  // TIER 1: CLASSES 1–2 (Early Primary / Foundation)
  // --------------------------------------------------------------------------
  if (tier === 'foundation') {
    return sanitizeChapterDraft({
      chapterTitle: title,
      subtitle: `Fun Stories and Naming Words for Class ${classNum}`,
      pedagogicalOverview: `Introduces young learners to ${title} through playful stories, colourful picture words, and gentle practice suitable for 6–7 year olds.`,
      sections: [
        {
          title: "Let Us Begin",
          sectionType: "opener",
          rationale: `Engages Class ${classNum} learners through a sweet, relatable story about school and home.`,
          content: `Ravi and Maya are at the school playground. Ravi points to a friendly squirrel on the tree and smiles. "Look at that little squirrel!" he says. Maya laughs and names all the things she can see: the big slide, the red ball, and the tall green tree.

Everything around us has a name. Names help us talk to our friends and share our thoughts. In this chapter, we will discover the magic of naming words!`,
        },
        {
          title: "What Are Naming Words?",
          sectionType: "explanation",
          rationale: `Presents a crystal-clear, friendly definition with familiar everyday objects.`,
          content: `A noun is a naming word. It is the name of:
• A person (mother, teacher, baby, friend)
• A place (school, park, room, zoo)
• An animal (cat, dog, parrot, horse)
• A thing (pencil, ball, book, toy)

Whenever you see or touch something in your room, it has a name. Look around right now! Can you spot three naming words?`,
        },
        {
          title: "Examples in Action",
          sectionType: "examples",
          rationale: `Provides concrete examples of naming words in short, simple sentences.`,
          content: `Let us read these happy sentences together:
1. The puppy wags its fluffy tail.
2. Maya reads a storybook in the library.
3. Father bakes sweet bread for breakfast.
4. The red car stops at the gate.

Notice the names in each sentence: puppy, tail, Maya, storybook, library, Father, bread, car, gate. All of these are naming words!`,
        },
        {
          title: "Fun Practice Games",
          sectionType: "exercises",
          rationale: `Provides short, friendly practice drills matching young children's attention spans.`,
          content: `Activity 1: Spot the Naming Word
Circle the naming word in each pair:
1. apple  •  run
2. jump   •  rabbit
3. school •  happy

Activity 2: Fill in the Blank
Choose the right word from the box: [ dog , book , park ]
4. We play football in the __________.
5. The playful __________ barks happily.
6. Ravi opens his colourful __________.`,
        },
        {
          title: "Remember and Share",
          sectionType: "summary",
          rationale: `Short summary reinforcing the key concept for early primary learners.`,
          content: `What We Learned Today:
• Naming words tell us who, where, and what.
• People, places, animals, and things all have names.
• When you tell a story, naming words help your friends picture what you see!`,
        },
      ],
    }, classNum);
  }

  // --------------------------------------------------------------------------
  // TIER 2: CLASSES 3–5 (Primary / Preparatory)
  // --------------------------------------------------------------------------
  if (tier === 'preparatory') {
    const prepSections: PedagogicalDraftSection[] = [];

    if (directives.wantsSubjectVerbDefinition || directives.wantsPrerequisiteDefinitions) {
      prepSections.push({
        title: "What is a Subject and What is a Verb?",
        sectionType: "explanation",
        rationale: `Fulfills the author's instruction to provide simple definitions of subject and verb for primary learners.`,
        content: `Before we learn how words work together, let us meet the two most important parts of every sentence: the Subject and the Verb!

1. What is a Subject?
The subject is the person, animal, place, or thing that the sentence is about. It tells us who or what is doing the action.
• Example: Maya plays with a red ball. (Who is doing the action? 'Maya'. So, Maya is the subject.)
• Example: The dogs run in the garden. (Who is running? 'The dogs'. So, The dogs is the subject.)

2. What is a Verb?
A verb is an action word. It tells us what the subject does.
• Example: In "Maya plays with a red ball", the action word is 'plays'.
• Example: In "The dogs run in the garden", the action word is 'run'.

3. A Team in Every Sentence!
The subject and the verb always work as a team. Once you can find the subject and the verb, learning how they match is easy and fun!`,
      });
    }

    prepSections.push({
      title: "Let Us Begin",
      sectionType: "opener",
      rationale: `Introduces the chapter through simple, relatable sentences and gentle guided observation.`,
      content: `Read these two friendly sentences:

Sentence 1: The boy plays with his pet dog.
Sentence 2: The boys play with their pet dog.

Look closely at the action word (verb):
• When there is one boy, the verb adds an -s: plays.
• When there are two or more boys, the verb stays in its base form: play.

In English, the naming word (subject) and the action word (verb) must match each other. When they match, our writing sounds smooth and clear! In this chapter, you will learn the simple secrets of matching subjects and verbs.`,
    });

    prepSections.push({
      title: "Understanding the Core Rules",
      sectionType: "explanation",
      rationale: `Clear, straightforward definitions and simple explanations.`,
      content: `In every sentence, the subject and the verb must match each other. This is called subject-verb agreement.

Rule 1: Singular Subject = Singular Verb
When the subject talks about one person, animal, place, or thing, we use a singular verb. In the present tense, singular verbs usually end with an -s:
• The bell rings loudly.
• A bird chirps in the tree.

Rule 2: Plural Subject = Plural Verb
When the subject talks about more than one, we use a plural verb without an -s:
• The bells ring loudly.
• Birds chirp in the tree.`,
    });

    prepSections.push({
      title: "Examples and Everyday Usage",
      sectionType: "examples",
      rationale: `Clear model sentences from school life and hobbies.`,
      content: `Let us examine these clear sentence models:

Model 1: Everyday Classroom Actions
• Correct: Maya draws a map of the solar system. (One person -> draws)
• Correct: Maya and Rohan draw a map together. (Two people -> draw)

Model 2: Watch Out for Extra Words
Sometimes extra words come between the subject and the verb. Do not let them trick you!
• Correct: The box of colourful pencils sits on the desk.
Notice that the true subject is 'box' (one box), not the pencils inside it.`,
    });

    prepSections.push({
      title: "Common Mistakes to Avoid",
      sectionType: "common_errors",
      rationale: `Highlights frequent primary school concord errors with clear corrections.`,
      content: `Mistake 1: The 'Of' Trap
• Incorrect: The basket of fresh apples are heavy.
• Correct: The basket of fresh apples is heavy.
• Why: The subject is 'basket' (singular). The words 'of fresh apples' just tell us what is inside the basket.

Mistake 2: Words Connected by 'And'
• Incorrect: Ravi and his brother goes to cricket practice.
• Correct: Ravi and his brother go to cricket practice.
• Why: Two people joined by 'and' make a plural subject.`,
    });

    prepSections.push({
      title: "Let's Practice",
      sectionType: "exercises",
      rationale: `Scaffolded exercises with a complete answer key.`,
      content: `Exercise A: Choose the Right Verb
1. The little kitten (sleeps / sleep) on the warm rug.
2. All the players on our team (wears / wear) blue jerseys.
3. A herd of cows (grazes / graze) peacefully in the meadow.
4. Neither Ravi nor his friends (was / were) at the playground.

Exercise B: Sentence Correction
5. The bouquet of red roses smell wonderful.
   Correction: ____________________________________________________
6. Every child in our street ride a bicycle in the evening.
   Correction: ____________________________________________________

Answer Key:
1. sleeps
2. wear
3. grazes (Collective noun 'herd' is singular here)
4. were
5. Correction: The bouquet of red roses smells wonderful. (Subject is 'bouquet').
6. Correction: Every child in our street rides a bicycle in the evening. (Subject is 'Every child').`,
    });

    prepSections.push({
      title: "Chapter Summary",
      sectionType: "summary",
      rationale: `Quick revision checklist for primary students.`,
      content: `Quick Revision Points:
1. One person or thing takes a singular verb (adds -s in present tense).
2. More than one person or thing takes a plural verb.
3. Always find the true head noun—ignore the words in between!
4. Two subjects joined by 'and' make a plural verb.`,
    });

    return sanitizeChapterDraft({
      chapterTitle: title,
      subtitle: `Clear Rules and Guided Practice for Class ${classNum} (${boardProfile.board})`,
      pedagogicalOverview: `Builds clear conceptual understanding of ${title} through engaging stories, practical rule boxes, and scaffolded exercises.`,
      sections: prepSections,
    }, classNum);
  }

  // --------------------------------------------------------------------------
  // TIER 3: CLASSES 6–8 (Middle School / Lower Secondary)
  // --------------------------------------------------------------------------
  if (tier === 'middle') {
    const middleSections: PedagogicalDraftSection[] = [];

    // Check if author requested prerequisite definitions (e.g. subject & verb definition before agreement)
    if (directives.wantsSubjectVerbDefinition || directives.wantsPrerequisiteDefinitions) {
      middleSections.push({
        title: "What is a Subject and What is a Verb?",
        sectionType: "explanation",
        rationale: `Directly fulfills the author's instruction to provide clear, simple definitions of a subject and a verb before teaching agreement.`,
        content: `Before we explore how words agree with each other in a sentence, let us make sure we understand the two most important building blocks of every English sentence: the Subject and the Verb.

1. What is a Subject?
In every complete sentence, the subject is who or what the sentence is about. It is the person, animal, place, thing, or idea that performs the action or is being spoken of.
• Example: The boy plays football in the park.
  Here, 'The boy' is the subject because he is performing the action.
• Example: The children laugh at the funny puppet show.
  Here, 'The children' is the subject.

2. What is a Verb?
A verb is an action word or a word that shows a state of being. It tells us what the subject does, feels, or is.
• Example: In "The boy plays football", the action verb is 'plays'.
• Example: In "The children laugh", the action verb is 'laugh'.
• State of being verbs include words like 'is', 'are', 'was', 'were', and 'has'.

3. How the Subject and Verb Work Together
A sentence must have both a subject and a verb to express a complete thought. The subject tells us who or what, and the verb tells us what happens.
Once you can clearly identify the subject and the verb in a sentence, learning how they match each other becomes simple and straightforward!`,
      });
    }

    // Step 1: Opener with foundational observation (Simple to Complex)
    middleSections.push({
      title: "Let Us Begin",
      sectionType: "opener",
      rationale: `Engages Class ${classNum} students through simple, foundational sentences before introducing complex rules.`,
      content: `Look carefully at these two simple sentences:

Sentence 1: The boy plays cricket in the evening.
Sentence 2: The boys play cricket in the evening.

Notice what happens:
• In Sentence 1, the subject is one person ('The boy'). The verb ends with -s ('plays').
• In Sentence 2, the subject is more than one person ('The boys'). The verb stays in its base form ('play').

Here is another pair of simple sentences:
• A bird sings in the morning. (One bird -> sings)
• Birds sing in the morning. (More than one bird -> sing)

This harmony between the subject and the verb is called Subject–Verb Agreement, or Concord. In English, the subject and the verb in every sentence must agree in number (singular or plural). When they agree, our writing is smooth, balanced, and pleasant to read.

In this chapter, we will build from simple sentences to more interesting cases, learning step by step how to choose the right verb every time.`,
    });

    // Step 2: Core Explanation (The Basic Rule)
    middleSections.push({
      title: "The Basic Rule of Agreement",
      sectionType: "explanation",
      rationale: `Presents core singular and plural rules in clean, structured middle-school textbook English.`,
      content: `At its heart, subject-verb agreement means a very simple thing:
The subject and the verb in a sentence must match each other in number.

1. Singular and Plural Subjects
• A singular subject takes a singular verb.
• A plural subject takes a plural verb.

In the simple present tense, singular verbs in the third person end in -s or -es:
• The bell rings at the end of the period. (Singular subject -> Singular verb)
• The bells ring across the campus. (Plural subject -> Plural verb)

2. A Useful Fact to Remember
Notice how English words behave:
• Adding -s to a noun usually makes it plural: boy -> boys, train -> trains.
• Adding -s to a present-tense verb makes it singular: play -> plays, arrive -> arrives.

So, a singular subject noun pairs with a singular verb ending in -s:
• The student writes neatly.
A plural subject noun pairs with a plural verb without -s:
• The students write neatly.`,
    });

    // Step 3: Compound Subjects Joined by 'And'
    middleSections.push({
      title: "Compound Subjects Joined by 'And'",
      sectionType: "rules",
      rationale: `Teaches compound subjects clearly before advancing to intervening phrases.`,
      content: `Once you have mastered simple singular and plural subjects, let us look at compound subjects:

Rule 1: Two or More Subjects Joined by 'And'
When two singular subjects are joined by 'and', they form a plural subject and take a plural verb:
• Ravi and Maya study in the library. (Two people -> plural verb 'study')
• The pencil and the ruler are inside the pencil box.

Exception to Rule 1: Single Unit or Combined Idea
When two words joined by 'and' are thought of as a single dish, combination, or idea, they take a singular verb:
• Bread and butter is a classic breakfast.
• Slow and steady wins the race.`,
    });

    // Step 4: Words that come between subject and verb
    middleSections.push({
      title: "Words That Come Between Subject and Verb",
      sectionType: "rules",
      rationale: `Teaches intervening words and parenthetical phrases without intimidating linguistic jargon.`,
      content: `Now let us take the next step. In longer sentences, other words often appear between the subject and the verb.

Rule 2: Finding the Real Subject
Always identify the true subject (the head word) and ignore any descriptive words that come between the subject and the verb:
• The box of colourful markers is on the desk.
  (The real subject is 'box', which is singular. The words 'of colourful markers' merely describe what is inside the box.)
• The students in our school choir are practicing for the concert.
  (The real subject is 'students', which is plural.)

Rule 3: Phrases Like 'Along With' and 'As Well As'
Phrases such as 'along with', 'together with', 'as well as', and 'in addition to' add extra information, but they do not change the number of the subject. The verb matches the first subject:
• The teacher, as well as the students, was delighted with the results.
  (The first subject is 'teacher', which is singular. We use 'was'.)
• The players, along with the coach, were celebrating on the field.
  (The first subject is 'players', which is plural. We use 'were'.)`,
    });

    // Step 5: Closer subject rule
    middleSections.push({
      title: "Choosing the Nearer Subject: 'Either... Or' and 'Neither... Nor'",
      sectionType: "rules",
      rationale: `Explains the closer subject rule in clean, age-appropriate middle school language without jargon.`,
      content: `When subjects are connected by 'either... or' or 'neither... nor', we have two different subjects. How do we decide which verb to use?

Rule 4: Match the Subject Closer to the Verb
When subjects are joined by 'either... or' or 'neither... nor', the verb agrees with the subject that is nearer to it:
• Neither the teacher nor the students were in the classroom.
  ('students' is plural and closer to the verb -> use 'were')
• Neither the students nor the teacher was in the classroom.
  ('teacher' is singular and closer to the verb -> use 'was')
• Either Rohan or his brothers have the house keys.
  ('brothers' is plural and closer to the verb -> use 'have')
• Either his brothers or Rohan has the house keys.
  ('Rohan' is singular and closer to the verb -> use 'has')

Rule 5: Words Like 'Each' and 'Every'
Words like 'each', 'every', 'everyone', 'someone', and 'nobody' refer to individuals one by one. Therefore, they take singular verbs:
• Each of the athletes receives a certificate.
• Everyone in the audience is listening quietly.`,
    });

    // Step 6: Common Mistakes & Traps
    middleSections.push({
      title: "Common Mistakes and How to Avoid Them",
      sectionType: "common_errors",
      rationale: `Highlights classic middle school exam traps with practical checks.`,
      content: `Watch out for these three common traps:

Trap 1: The 'One of the' Pattern
• Incorrect: One of my cousins are an airline pilot.
• Correct: One of my cousins is an airline pilot.
• Helpful Check: Cover the words 'of my cousins'. You are left with 'One is an airline pilot', which makes complete sense.

Trap 2: Collective Nouns
In Indian and British English curricula (${boardProfile.board}), collective nouns such as 'team', 'committee', 'family', and 'choir' are treated as singular when the group acts together as one single unit:
• The school committee has approved the annual budget.
• Our cricket team is practicing on the main ground.

Trap 3: Amounts, Periods of Time, and Distances
When amounts of money, periods of time, or distances are considered as one single total, use a singular verb:
• Ten kilometres is a long walk after school.
• Fifty rupees is the price of the gel pen.`,
    });

    // Step 7: Practice Exercises
    middleSections.push({
      title: "Classroom Practice Exercises",
      sectionType: "exercises",
      rationale: `Graded exercises testing identification, correction, and application with clear solutions.`,
      content: `Exercise 1: Choose the Correct Verb Form
1. The bouquet of fresh orchids (was / were) presented to the chief guest.
2. Neither the captain nor the players (has / have) arrived yet.
3. Ten thousand rupees (is / are) a substantial amount to spend on books.
4. Each of the laboratory microscopes (needs / need) careful cleaning.

Exercise 2: Error Spotting and Correction
Read each sentence, identify the mistake, and rewrite the sentence correctly:
5. The list of successful candidates were pinned to the notice board.
   Correction: ____________________________________________________
6. The coach, together with all the athletes, are attending the seminar.
   Correction: ____________________________________________________

Exercise 3: Sentence Completion
7. Complete using the correct form of 'be' (is/are):
   "The variety of books in this library _______ impressive."
8. Complete using the correct form of 'have' (has/have):
   "Neither the driver nor the passengers _______ sustained any injuries."

---
Complete Answer Key & Diagnostic Notes:
1. was (The real subject is singular 'bouquet').
2. have (Closer subject rule: 'players' is plural and nearer to the verb).
3. is (Sum of money regarded as a single total).
4. needs ('Each' takes a singular verb).
5. Correction: "The list of successful candidates was pinned to the notice board." (Subject is 'list').
6. Correction: "The coach, together with all the athletes, is attending the seminar." (First subject 'coach' governs the verb).
7. is (Subject is 'variety', which is singular).
8. have (Subject nearer the verb is plural 'passengers').`,
    });

    // Step 8: Chapter Summary
    middleSections.push({
      title: "Chapter Summary and Quick Checklist",
      sectionType: "summary",
      rationale: `Crisp revision checklist for Class ${classNum} students.`,
      content: `Quick Revision Checklist:
1. Singular subject -> Singular verb (verb ends with -s in simple present tense).
2. Plural subject -> Plural verb (base form of verb).
3. Words that come between: Always find the real subject and ignore the descriptive words in between.
4. With 'along with' and 'as well as', match the first subject.
5. With 'either... or' and 'neither... nor', match the subject closer to the verb.
6. Words like 'each' and 'every' always take singular verbs.`,
    });

    return sanitizeChapterDraft({
      chapterTitle: title,
      subtitle: `Understanding Rules, Usage, and Common Traps for Class ${classNum} (${boardProfile.board})`,
      pedagogicalOverview: `Develops systematic mastery of ${title} for Class ${classNum} through foundational observation, clear rules, worked examples, common trap warnings, and graded practice exercises aligned with ${boardProfile.board} expectations.`,
      sections: middleSections,
    }, classNum);
  }

  // --------------------------------------------------------------------------
  // TIER 4: CLASSES 9–10 (Secondary / Board Preparation)
  // --------------------------------------------------------------------------
  if (tier === 'secondary') {
    return sanitizeChapterDraft({
      chapterTitle: title,
      subtitle: `Syntactic Principles, Board Transformations & Exam Drills for Class ${classNum} (${boardProfile.board})`,
      pedagogicalOverview: `Rigorous, board-calibrated chapter for Class ${classNum} candidates, focusing on sentence synthesis, transformation formulas, complex concord, and ${boardProfile.board} examination question formats.`,
      sections: [
        {
          title: "Introduction and Analytical Overview",
          sectionType: "opener",
          rationale: `Sets secondary-level expectations with focus on board examination precision.`,
          content: `In secondary school English language examinations, grammatical competence is evaluated through precision, variety, and the ability to transform sentence structures without altering their original meaning. Whether writing argumentative essays, formal letters, or answering transformation questions in Section A of the English Language paper, flawless syntax is the foundation of high marks.

This chapter examines the core principles of **${title}**, uncovers high-stakes board examination traps, and provides targeted transformation and editing drills designed for Class ${classNum} candidates under ${boardProfile.board}.`,
        },
        {
          title: "Principles of Sentence Structure and Concord",
          sectionType: "explanation",
          rationale: `Structured secondary-level explanation of complex agreement principles.`,
          content: `1. Concord in Complex and Compound Sentences
In mature academic writing, clauses often contain multiple modifiers, relative clauses, and participial phrases that separate the subject from its finite verb.
• Prepositional and Participial Phrases:
  *The evidence presented by the defense witnesses, though extensive, **fails** to substantiate the alibi.*
  (Subject: 'evidence' -> singular verb 'fails').

2. Coordinate Subjects with Correlative Conjunctions
When subjects are paired with correlative conjunctions (*either... or*, *neither... nor*, *not only... but also*), the verb agrees in number and person with the closer coordinate:
• *Not only the editor but also the staff reporters **were** questioning the revised deadline.*
• *Not only the staff reporters but also the editor **was** questioning the revised deadline.*

3. Plural Forms with Singular Meanings
Certain nouns ending in *-s* represent singular academic disciplines, ailments, or civic entities:
• *Physics, politics, economics, measles, news* -> Take singular verbs.
• *The news from the border **was** encouraging.*
• Exception: When nouns like *politics* or *statistics* refer to specific personal beliefs or data sets rather than a discipline, they take plural verbs:
  *His politics **are** well known.* / *These statistics **reveal** an unexpected trend.*`,
        },
        {
          title: "Board Examination Transformation Rules",
          sectionType: "rules",
          rationale: `Explicit transformation formulas aligned with ICSE/CBSE English Language papers.`,
          content: `Formula 1: No Sooner... Than
• Structure: No sooner + had + Subject + past participle + than...
  OR: No sooner + did + Subject + base verb + than...
• Example: *No sooner had the bell rung than the students left the hall.*
• Exam Caution: Never substitute 'when' or 'then' for 'than'.

Formula 2: Hardly / Scarcely... When
• Structure: Hardly / Scarcely + had + Subject + past participle + when...
• Example: *Hardly had the meeting commenced when the power failed.*

Formula 3: Negative Conditionals (Unless)
• Structure: Unless + affirmative clause, main clause.
• Meaning: 'Unless' means 'if not'; do not insert a negative word inside the unless-clause.
• Example: *Unless you submit the application today, you will forfeit your seat.*`,
        },
        {
          title: "Common Board Traps and Solved Models",
          sectionType: "common_errors",
          rationale: `Examines recurring error patterns penalised in board evaluation.`,
          content: `Trap 1: Proximity Error with Intervening Complements
• Board Error: *The collection of seventeenth-century gold coins were auctioned yesterday.*
• Correction: *The collection of seventeenth-century gold coins **was** auctioned yesterday.*
• Examiner Note: The head noun is 'collection' (singular). The intervening plural modifier 'coins' does not alter the head noun's number.

Trap 2: 'A Number of' vs. 'The Number of'
• Rule: *A number of* + plural noun = Plural verb (means 'many').
  *A number of candidates **have** registered for the exam.*
• Rule: *The number of* + plural noun = Singular verb (means 'the specific figure').
  *The number of registered candidates **is** three hundred.*`,
        },
        {
          title: "Board Examination Practice Drills",
          sectionType: "exercises",
          rationale: `Examination-pattern exercises with full marking schemes.`,
          content: `Section A: Sentence Transformation (1 Mark Each)
Rewrite the following sentences according to instructions given after each:
1. As soon as the curtain fell, the audience erupted in applause.
   (Begin: No sooner...)
2. If the team does not improve their fielding, they cannot win the tournament.
   (Use: Unless...)
3. The principal said, "All students must assemble in the auditorium immediately."
   (Rewrite in Indirect Speech)
4. She was too proud to acknowledge her error.
   (Use: so... that)

Section B: Gap-Filling & Integrated Grammar
Fill in each blank with the correct form of the verb given in brackets:
5. Neither the director nor the actors _______ (be) prepared for the sudden script revision.
6. The committee _______ (have) submitted its final recommendations to the governing council.

---
Marking Scheme & Detailed Answers:
1. *No sooner did the curtain fall than the audience erupted in applause.*
   (Or: *No sooner had the curtain fallen than...*)
2. *Unless the team improves their fielding, they cannot win the tournament.*
3. *The principal instructed that all students had to assemble in the auditorium immediately.*
4. *She was so proud that she would not acknowledge her error.*
5. *were* (Proximity rule: 'actors' is plural).
6. *has* (Collective noun acting unanimously as one body).`,
        },
        {
          title: "Revision Checklist and Exam Tips",
          sectionType: "summary",
          rationale: `Summary designed for rapid revision before examinations.`,
          content: `Board Exam Quick Revision:
1. Always isolate the head noun from descriptive prepositional modifiers.
2. In 'No sooner... than', ensure correct auxiliary inversion (*did + base verb* or *had + V3*).
3. 'A number of' takes a plural verb; 'The number of' takes a singular verb.
4. Check correlative conjunctions: *Neither... nor* matches the nearest subject.`,
        },
      ],
    }, classNum);
  }

  // --------------------------------------------------------------------------
  // TIER 5: CLASSES 11–12 (Senior Secondary / Pre-University)
  // --------------------------------------------------------------------------
  const rawDraft: PedagogicalChapterDraft = {
    chapterTitle: title,
    subtitle: `Theoretical Foundations, Syntactic Principles & Stylistic Mastery for Class ${classNum} (${boardProfile.board})`,
    pedagogicalOverview: `Comprehensive senior secondary treatise on ${title} for Class ${classNum}, exploring syntactic inversion, complex concord, stylistic nuances, and pre-university examination standards.`,
    sections: [
      {
        title: "Introduction and Rhetorical Framework",
        sectionType: "opener",
        rationale: `Engages senior secondary students with analytical prose from literature and discourse.`,
        content: `In mature composition and scholarly prose, grammatical competence transcends the mechanical avoidance of error. It becomes the instrument through which an author calibrates emphasis, controls rhetorical pacing, and articulates complex nuances of thought.

When sentences grow in structural density—incorporating parenthetical appositives, relative clauses, and stylistic inversions—the underlying principles of grammatical concord ensure clarity and logical coherence. In this chapter, we examine the governing mechanics of **${title}**, explore the boundary conditions of standard usage, and develop the syntactic precision required for higher secondary and university-level writing.`,
      },
      {
        title: "Theoretical Foundations and Syntactic Principles",
        sectionType: "explanation",
        rationale: `Rigorous academic examination of subject-verb concord and clause architecture.`,
        content: `1. Grammatical Concord and Notional Concord
Standard English recognizes two primary mechanisms governing concord:
• Grammatical Concord: The finite verb inflects strictly according to the grammatical number and person of the head noun.
• Notional Concord: The verb agrees according to the conceptual idea of number rather than the strict grammatical form (frequent with collective nouns, expressions of quantity, and coordinate packaging).

2. Structural Inversion and Finite Verb Agreement
When sentences deviate from canonical Subject-Verb-Object order for rhetorical emphasis, the finite verb must still agree with the postposed subject:
• *Rarely **have** such profound constitutional questions occupied the bench.*
• *Along the southern ridge **stands** a solitary watchtower.*
• *Hardly **had** the treaty been signed when diplomatic disputes resurfaced.*`,
      },
      {
        title: "Advanced Syntactic Rules and Anomalies",
        sectionType: "rules",
        rationale: `Examines proximity concord, disjunctive coordination, and complex collectives.`,
        content: `Principle 1: Proximity Concord vs. Formal Agreement
In sentences containing disjunctive coordinators (*neither... nor*, *either... or*, *not only... but also*), prescriptive grammar mandates agreement with the closer coordinate:
• *Neither the ambassador nor her counselors **were** briefed on the impending sanctions.*
• *Neither the counselors nor the ambassador **was** briefed on the impending sanctions.*

Principle 2: Quasi-Coordinators and Intervening Adjuncts
Parenthetical expressions introduced by quasi-coordinators (*as well as*, *along with*, *together with*, *no less than*, *in addition to*) do not constitute syntactic coordination. The finite verb agrees solely with the grammatical subject:
• *The prime minister, no less than the cabinet members, **is** accountable to parliament.*

Principle 3: Concord with Partitive Constructions
In constructions with fractions, percentages, and indefinite quantifiers (*half of*, *a majority of*, *a percentage of*), the verb agrees with the complement of the preposition:
• *A majority of the electorate **has** cast its ballots.* (Electorate viewed collectively).
• *A majority of the voters **have** cast their ballots.* (Plural countable noun).`,
      },
      {
        title: "Exemplary Models and Contrastive Usage",
        sectionType: "examples",
        rationale: `Sophisticated contrastive models from academic and literary discourse.`,
        content: `Model 1: Stylistic Inversion with Negative Adverbials
• Standard: The committee had never before encountered such unanimous resistance.
• Inverted: *Never before **had** the committee encountered such unanimous resistance.*

Model 2: Complex Clitic and Relative Clause Concord
• Ambiguous: He is one of those authors who writes passionately about environmental justice.
• Precise: *He is one of those authors who **write** passionately about environmental justice.*
• Explanation: The antecedent of the relative pronoun 'who' is the plural noun 'authors', requiring the plural verb 'write'.`,
      },
      {
        title: "Advanced Diagnostic Drills and Examination Series",
        sectionType: "exercises",
        rationale: `Senior secondary assessment evaluating nuanced grammatical competence.`,
        content: `Section 1: Advanced Sentence Transformation
Rewrite the following sentences adhering strictly to the given directives:
1. The delegation had scarcely reached the summit when hostilities were renewed.
   (Begin: Scarcely...)
2. If the administration had evaluated the risks impartially, the crisis might have been averted.
   (Begin: Had...)
3. The report was so meticulously documented that no critic could challenge its validity.
   (Use: too... to)

Section 2: Syntactic Error Identification
Identify and correct the subtle concord error in each sentence:
4. *A substantial proportion of the archives that was recovered from the ruins have been restored by conservators.*
5. *Neither the principal architect nor the municipal engineers was aware of the structural fault.*

---
Scholarly Solutions and Analytical Notes:
1. *Scarcely had the delegation reached the summit when hostilities were renewed.*
2. *Had the administration evaluated the risks impartially, the crisis might have been averted.*
3. *The report was too meticulously documented for any critic to challenge its validity.*
4. Correction: "... that **were** recovered from the ruins **has** been restored..." (The relative clause refers to plural 'archives', while the main verb agrees with singular 'proportion').
5. Correction: "... **were** aware of the structural fault." (The nearer subject 'engineers' is plural).`,
      },
      {
        title: "Summary and Scholarly Reference",
        sectionType: "summary",
        rationale: `Comprehensive reference summary for Class ${classNum} scholars.`,
        content: `Key Takeaways for Senior Scholars:
1. Isolate the true grammatical head from descriptive postmodifiers and quasi-coordinators.
2. In inverted structures, identify the postposed subject before selecting the finite verb form.
3. In relative clauses governed by 'one of those who...', the plural antecedent dictates the verb.
4. Balance syntactic rigour with natural cadence—clarity remains the ultimate hallmark of style.`,
      },
    ],
  };

  return sanitizeChapterDraft(rawDraft, classNum);
}

/**
 * Universal sanitizer for chapter drafts guaranteeing:
 * 1. Clean heading titles without raw markdown hashes or asterisks
 * 2. Editorial rationale stripped from student-facing content and preserved as metadata only
 * 3. Leaked internal pedagogical terms filtered out for Classes 1–8
 */
function sanitizeChapterDraft(draft: PedagogicalChapterDraft, classNum: number): PedagogicalChapterDraft {
  return {
    chapterTitle: cleanHeadingTitle(draft.chapterTitle),
    subtitle: cleanHeadingTitle(draft.subtitle),
    pedagogicalOverview: cleanLeakedEditorialTerms(cleanMarkdownSyntax(draft.pedagogicalOverview), classNum),
    sections: draft.sections.map((s) => {
      const { cleanContent, extractedRationale } = sanitizeContentStrippingRationale(s.content);
      const finalRationale = cleanMarkdownSyntax(s.rationale || extractedRationale || '');
      const studentProse = cleanLeakedEditorialTerms(cleanContent, classNum);
      return {
        ...s,
        title: cleanHeadingTitle(s.title),
        content: studentProse,
        rationale: finalRationale,
      };
    }),
  };
}

/**
 * Humanises and polishes manuscript prose while STRICTLY PRESERVING the target Class level.
 * Improves rhythm, removes robotic clichés, enhances readability, and guarantees no raw Markdown marks.
 */
export function generatePedagogicalHumanizedText(
  text: string,
  style: string,
  classLevel: string,
  board: string,
  chapterTitle: string
): string {
  if (!text || !text.trim()) {
    return text || "";
  }

  const classNum = parseClassLevelNumber(classLevel);
  const tier = getPedagogicalTier(classNum);

  let polished = text;

  // 1. Remove robotic AI clichés universally
  const cliches: [RegExp, string][] = [
    [/\bdelve into\b/gi, tier === 'foundation' || tier === 'preparatory' ? "look at" : "examine"],
    [/\bdelve\b/gi, tier === 'foundation' || tier === 'preparatory' ? "look closely" : "explore"],
    [/\bdive into\b/gi, "explore"],
    [/\bdive deep into\b/gi, tier === 'foundation' ? "learn about" : "investigate"],
    [/\brich tapestry of\b/gi, "wide variety of"],
    [/\ba testament to\b/gi, "clear evidence of"],
    [/\bunlock the power of\b/gi, tier === 'foundation' ? "learn" : "master"],
    [/\bembark on a journey\b/gi, "begin"],
    [/\bfurthermore, it is crucial to remember that\b/gi, "Remember that"],
    [/\bit is important to note that\b/gi, "Notice that"],
    [/\bit is worth noting that\b/gi, "Importantly,"],
    [/\bin conclusion, it can be said that\b/gi, "In summary,"],
    [/\bnavigating the complexities of\b/gi, "understanding"],
    [/\bseamlessly\b/gi, "smoothly"],
    [/\bharnessing\b/gi, "using"],
  ];

  for (const [regex, replacement] of cliches) {
    polished = polished.replace(regex, replacement);
  }

  // 2. Clean out any raw markdown hashes or control characters from headings within the prose
  polished = polished
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1');

  // 3. Ensure sentence variety and paragraph cadence while strictly respecting grade level
  const paragraphs = polished.split(/\n\n+/);
  const refined = paragraphs.map((p) => {
    let trimmed = p.trim();
    if (!trimmed) return "";

    // For younger grades (Classes 1–5), eliminate any accidental university vocabulary
    if (tier === 'foundation' || tier === 'preparatory') {
      trimmed = trimmed
        .replace(/\bsyntactic architecture\b/gi, "sentence patterns")
        .replace(/\bgrammatical constituents\b/gi, "words in the sentence")
        .replace(/\bprescriptive concord\b/gi, "word agreement")
        .replace(/\bfinite verb inflections?\b/gi, "verb forms")
        .replace(/\bmoreover,\s*/gi, "Also, ")
        .replace(/\bfurthermore,\s*/gi, "In addition, ");
    } else if (tier === 'middle') {
      trimmed = trimmed
        .replace(/\bsyntactic architecture governing concord between grammatical constituents\b/gi, "rules that help subjects and verbs agree with each other")
        .replace(/\bgrammatical constituents\b/gi, "parts of the sentence")
        .replace(/\bmoreover,\s*/gi, "In addition, ")
        .replace(/\bfurthermore,\s*/gi, "Also, ");
    }

    return trimmed;
  });

  return refined.filter(Boolean).join("\n\n");
}
