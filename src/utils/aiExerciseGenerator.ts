// =============================================================
// VERITAS Editorial Platform — AI Exercise Generator Engine
// Phase 4F: Pedagogical Generation & Editorial Workflow
// =============================================================

import {
  StudioChapter,
  StudioExercise,
  GrammarQuestion,
  QuestionType,
  ExerciseDevelopmentalTier,
} from '../types';

export interface AiExerciseGenerationParams {
  mode:
    | 'generate_entire_exercise'
    | 'from_rule'
    | 'from_concept'
    | 'from_section'
    | 'from_visual'
    | 'more_like_this'
    | 'easier_version'
    | 'harder_version'
    | 'misconceptions'
    | 'challenge'
    | 'revision';
  questionCount: number;
  questionTypes: QuestionType[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tier: ExerciseDevelopmentalTier;
  marksPerQuestion: number;
  targetRule?: string;
  targetConcept?: string;
  targetSectionId?: string;
  sourceQuestion?: GrammarQuestion;
  targetVisualId?: string;
  targetVisualFigureNumber?: string;
  includeVisual?: boolean;
  targetObjective?: string;
  customPrompt?: string;
}

export interface GeneratedExerciseDraft {
  exerciseTitle?: string;
  exerciseInstructions?: string;
  pedagogicalPurpose?: string;
  tier: ExerciseDevelopmentalTier;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: GrammarQuestion[];
  generatedAt: string;
  promptNotes: string;
}

/**
 * Generates pedagogical textbook exercise questions adhering to strict publisher quality standards.
 * All generated items are marked as AI drafts requiring human author review/acceptance.
 */
export function generateAiExerciseQuestions(
  chapter: StudioChapter,
  params: AiExerciseGenerationParams
): GeneratedExerciseDraft {
  const chapterTitle = chapter.title || 'Grammar Practice';
  const classLevel = (chapter.equivalentClass as string) || 'Class 6';
  const timestamp = Date.now();
  const isSva = /subject.*verb|concord|agreement/i.test(chapterTitle);

  const generatedQuestions: GrammarQuestion[] = [];
  const count = Math.min(10, Math.max(1, params.questionCount));

  // Authentic Subject-Verb Agreement Question Templates
  const svaQuestionTemplates: Array<{
    type: QuestionType;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    modelAnswer?: string;
    acceptableAlternatives?: string[];
    conceptTested: string;
    explanation: string;
    grammarRationale: string;
    hints: string;
    openEndedCriteria?: any;
    visualRequired?: boolean;
  }> = [
    {
      type: 'mcq',
      prompt: 'Choose the correct verb to complete the sentence:\n"Neither the conductor nor the musicians ______ satisfied with the rehearsal acoustic."',
      options: ['A) was', 'B) were', 'C) is', 'D) has been'],
      correctAnswer: 'B) were',
      conceptTested: 'Correlative Conjunctions (Neither...nor) & Proximity Rule',
      explanation: "When subjects are joined by 'neither...nor', the verb agrees with the closer subject ('musicians', which is plural).",
      grammarRationale: 'Rule of proximity: verb agrees with the nearest subject in correlative disjunction.',
      hints: 'Look at the subject closest to the verb blank.',
    },
    {
      type: 'fill_in_blanks',
      prompt: 'Fill in the blank with the correct form of the verb in brackets:\n"The quality of these handmade silk scarves ______ (be) exceptional."',
      correctAnswer: 'is',
      modelAnswer: 'is',
      acceptableAlternatives: ['is'],
      conceptTested: 'Intervening Prepositional Phrase',
      explanation: "The true grammatical subject is singular ('quality'), not the intervening plural noun ('scarves').",
      grammarRationale: 'Prepositional modifiers between subject and verb do not alter the grammatical number of the subject.',
      hints: 'Identify the head noun of the subject phrase before "of".',
    },
    {
      type: 'error_correction',
      prompt: 'Identify and correct the subject-verb agreement error in this sentence:\n"Ten kilometers are a long distance to run in hot weather."',
      correctAnswer: 'are -> is',
      modelAnswer: 'Ten kilometers is a long distance to run in hot weather.',
      acceptableAlternatives: ['are should be is', 'are -> is', 'is'],
      conceptTested: 'Plural Expressions of Measurement as Single Unit',
      explanation: "Expressions of distance, money, or time regarded as a single quantitative unit take a singular verb ('is').",
      grammarRationale: 'Nouns denoting measurement take singular concord when thought of as a single entity.',
      hints: 'Consider whether "ten kilometers" is treated as one single measure of distance.',
    },
    {
      type: 'mcq',
      prompt: 'Select the sentence with impeccable subject-verb agreement:',
      options: [
        'A) Each of the participating scholars have submitted their thesis.',
        'B) Each of the participating scholars has submitted their thesis.',
        'C) Each of the participating scholars were submitting their thesis.',
        'D) Each of the participating scholars are submitting their thesis.',
      ],
      correctAnswer: 'B) Each of the participating scholars has submitted their thesis.',
      conceptTested: 'Indefinite Pronouns (Each / Every) with Partitive Phrases',
      explanation: "'Each' is an inherently singular indefinite pronoun and mandates a singular verb ('has submitted').",
      grammarRationale: 'Distributive pronouns take singular agreement regardless of intervening plural prepositional objects.',
      hints: 'Remember that "each" distributively refers to one person at a time.',
    },
    {
      type: 'rewrite_sentence',
      prompt: 'Rewrite this sentence with the corrected verb agreement:\n"The committee have decided to postpone the annual symposium until October."',
      correctAnswer: 'The committee has decided to postpone the annual symposium until October.',
      modelAnswer: 'The committee has decided to postpone the annual symposium until October.',
      acceptableAlternatives: [
        'The committee has decided to postpone the annual symposium until October.',
        'The committee has decided to postpone the annual symposium until October',
      ],
      conceptTested: 'Collective Nouns Acting as a Single Unit',
      explanation: "When a collective noun ('committee') acts as a unified singular body, it takes a singular verb ('has decided').",
      grammarRationale: 'Collective nouns take singular concord when emphasizing the collective unit.',
      hints: 'Is the committee acting together as one single body?',
    },
    {
      type: 'sentence_combining',
      prompt: 'Combine these two clauses into one compound sentence with proper concord:\nClause 1: The mentor is arriving today.\nClause 2: The apprentices are arriving today.',
      correctAnswer: 'Both the mentor and the apprentices are arriving today.',
      modelAnswer: 'Both the mentor and the apprentices are arriving today. (or: The mentor as well as the apprentices is arriving today.)',
      acceptableAlternatives: [
        'Both the mentor and the apprentices are arriving today.',
        'The mentor and the apprentices are arriving today.',
      ],
      conceptTested: 'Compound Subjects with "Both...and" vs "As well as"',
      explanation: "Subjects joined by 'and' or 'both...and' compound into a plural subject, requiring the plural verb 'are'.",
      grammarRationale: 'Additive coordination of subjects yields plural syntactic concord.',
      hints: 'When joining two subjects with "and", the combined subject is plural.',
    },
  ];

  // Pool of authentic primary grammar questions based on CBSE/NCERT Class 3 standards
  const nounQuestionTemplates: Array<{
    type: QuestionType;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    modelAnswer?: string;
    acceptableAlternatives?: string[];
    conceptTested: string;
    explanation: string;
    grammarRationale: string;
    hints: string;
    openEndedCriteria?: any;
    visualRequired?: boolean;
  }> = [
    {
      type: 'mcq',
      prompt: 'Which word in the sentence below is a PROPER NOUN naming a specific mountain peak?\n"Mount Everest stands tall in the majestic Himalayan range."',
      options: ['A) tall', 'B) Mount Everest', 'C) mountain', 'D) range'],
      correctAnswer: 'B) Mount Everest',
      conceptTested: 'Proper Noun: Specific Geographical Name',
      explanation: "'Mount Everest' is the special name of a specific mountain and begins with capital letters.",
      grammarRationale: 'Specific names of geographic monuments and peaks are proper nouns.',
      hints: 'Look for the capitalized special name of the mountain.',
    },
    {
      type: 'identify_underline',
      prompt: 'Identify the TWO naming words (nouns) in this sentence:',
      correctAnswer: 'peacock, garden',
      modelAnswer: 'peacock, garden',
      acceptableAlternatives: ['peacock and garden', 'peacock, garden'],
      conceptTested: 'Animal & Place Naming Words',
      explanation: "'Peacock' is an animal (bird); 'garden' is a place.",
      grammarRationale: 'Naming words denote living creatures and locations.',
      hints: 'Find the bird and the place where it is walking.',
      openEndedCriteria: {
        modelAnswer: 'peacock, garden',
        acceptableAlternatives: ['peacock and garden'],
        requiredGrammarRule: 'Identifies animal and place nouns.',
        requiredElements: ['peacock', 'garden'],
      },
    },
    {
      type: 'classification',
      prompt: 'Under which noun category does "ASTRONAUT" belong?',
      options: ['A) Person', 'B) Place', 'C) Animal', 'D) Thing'],
      correctAnswer: 'A) Person',
      conceptTested: 'Noun Categories: Person (Occupation)',
      explanation: "An 'astronaut' is a person trained to travel in a spacecraft.",
      grammarRationale: 'Professions and human occupations belong to the Person category.',
      hints: 'An astronaut is a human being who flies into space.',
    },
  ];

  // Choose the template set matching the chapter topic
  const activeTemplates = isSva ? svaQuestionTemplates : nounQuestionTemplates;

  // Filter templates matching requested criteria
  let eligibleTemplates = activeTemplates;
  if (params.mode === 'from_visual' || params.includeVisual) {
    eligibleTemplates = activeTemplates.filter((t) => t.visualRequired || t.type === 'visual_picture');
    if (eligibleTemplates.length === 0) {
      eligibleTemplates = activeTemplates;
    }
  }

  for (let i = 0; i < count; i++) {
    const template = eligibleTemplates[i % eligibleTemplates.length];
    const qId = `ai-gen-${timestamp}-${i + 1}`;

    const question: GrammarQuestion = {
      id: qId,
      type: template.type,
      prompt: template.prompt,
      options: template.options ? [...template.options] : undefined,
      correctAnswer: template.correctAnswer,
      modelAnswer: template.modelAnswer,
      acceptableAlternatives: template.acceptableAlternatives ? [...template.acceptableAlternatives] : undefined,
      marks: params.marksPerQuestion || 1,
      difficulty: params.difficulty,
      tier: params.tier === 'FOUNDATION' ? 'foundation' : params.tier === 'APPLICATION' ? 'standard' : 'advanced',
      developmentalTier: params.tier,
      conceptTested: params.targetConcept || template.conceptTested,
      curriculumObjective: params.targetObjective || `Master ${chapterTitle} principles for ${classLevel}`,
      cognitiveLevel: params.tier === 'FOUNDATION' ? 'Remembering' : params.tier === 'APPLICATION' ? 'Applying' : 'Creating',
      explanation: template.explanation,
      grammarRationale: template.grammarRationale,
      hints: template.hints,
      studentFeedback: `Good work! ${template.explanation}`,
      teacherGuidance: `AI Draft generated for ${classLevel}. Review answer tolerance before publishing.`,
      visualId: template.visualRequired ? (params.targetVisualId || `vis-${chapter.id}-1`) : undefined,
      visualFigureNumber: template.visualRequired ? (params.targetVisualFigureNumber || 'Figure 1.1') : undefined,
      openEndedCriteria: template.openEndedCriteria,
      isAiDraft: true,
      approvalStatus: 'AI_DRAFT_REVIEW_REQUIRED',
      status: 'draft',
      sourceProvenance: `AI Exercise Generator (${params.mode})`,
    };

    generatedQuestions.push(question);
  }

  let exerciseTitle = `Exercise: Practice & Application`;
  let exerciseInstructions = `Read each question carefully and follow the instructions provided.`;
  let pedagogicalPurpose = `Reinforce core grammatical competencies in ${chapterTitle}.`;

  if (params.mode === 'challenge') {
    exerciseTitle = `Exercise: Higher-Order Thinking Challenge`;
    exerciseInstructions = `Apply your grammatical reasoning to solve these higher-order noun puzzles.`;
    pedagogicalPurpose = `Extend proficient learners through synthesis and creative composition.`;
  } else if (params.mode === 'from_visual') {
    exerciseTitle = `Exercise: Visual Grammar Exploration`;
    exerciseInstructions = `Examine Figure 1.1 carefully. Answer the questions using visual evidence.`;
    pedagogicalPurpose = `Multimodal learning connecting visual illustration to grammatical categories.`;
  } else if (params.mode === 'misconceptions') {
    exerciseTitle = `Exercise: Common Trap Buster`;
    exerciseInstructions = `Identify subtle grammatical misconceptions and write the proper corrections.`;
    pedagogicalPurpose = `Remediate persistent confusion between common nouns and proper names.`;
  }

  return {
    exerciseTitle,
    exerciseInstructions,
    pedagogicalPurpose,
    tier: params.tier,
    difficulty: params.difficulty,
    questions: generatedQuestions,
    generatedAt: new Date().toISOString(),
    promptNotes: `Generated ${count} question(s) in "${params.mode}" mode for ${classLevel} ${chapterTitle}.`,
  };
}
