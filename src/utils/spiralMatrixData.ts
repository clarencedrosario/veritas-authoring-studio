import {
  SpiralCurriculumMatrix,
  ScopeSequenceTopic,
  GrammarClassLevel,
  ProgressionStage,
} from '../types';

export const ALL_CLASSES: GrammarClassLevel[] = [
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

export const PROGRESSION_META: Record<
  ProgressionStage,
  { label: string; short: string; description: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  I: {
    label: 'Introduced',
    short: 'I',
    description: 'First formal exposure, foundational definitions, simple identification',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
  },
  D: {
    label: 'Developing',
    short: 'D',
    description: 'Active scaffolding, rule application, compound examples, guided drills',
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/30',
  },
  R: {
    label: 'Reinforced & Expanded',
    short: 'R',
    description: 'Varied contexts, compound usage, exceptions and practice sets',
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
  },
  M: {
    label: 'Mastered & Applied',
    short: 'M',
    description: 'Accurate production, error editing, stylistic synthesis & board exams',
    colorClass: 'text-indigo-700 dark:text-indigo-300',
    bgClass: 'bg-indigo-500/15',
    borderClass: 'border-indigo-500/30',
  },
  E: {
    label: 'Extension / Advanced',
    short: 'E',
    description: 'Olympiad, stylistic nuances, collegiate rhetoric & advanced inversion',
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
  },
  none: {
    label: 'Not Taught',
    short: '—',
    description: 'Outside the target grade-level scope',
    colorClass: 'text-stone-400 dark:text-slate-600',
    bgClass: 'bg-stone-100/40 dark:bg-slate-800/20',
    borderClass: 'border-stone-200/40 dark:border-slate-800/40',
  },
};

function makeTopic(
  id: string,
  strand: string,
  title: string,
  description: string,
  progMap: Partial<Record<GrammarClassLevel, { stage: ProgressionStage; notes?: string }>>
): ScopeSequenceTopic {
  const progression: any = {};
  ALL_CLASSES.forEach((cls) => {
    progression[cls] = {
      stage: progMap[cls]?.stage || 'none',
      subtopicsOrNotes: progMap[cls]?.notes || '',
    };
  });
  return { id, strand, title, description, progression };
}

export function getDefaultCurriculumMatrix(targetBoard: string = 'CBSE / ICSE'): SpiralCurriculumMatrix {
  const topics: ScopeSequenceTopic[] = [
    // STRAND: Parts of Speech
    makeTopic(
      'top-nouns',
      'Parts of Speech',
      'Nouns: Types, Gender & Number',
      'Common, Proper, Collective, Abstract, Countable/Uncountable, Irregular Plurals, and Possessive Case.',
      {
        'Class 1': { stage: 'I', notes: 'Naming words: people, places, animals, and things using picture flashcards.' },
        'Class 2': { stage: 'D', notes: 'Common vs proper naming words, singular and plural (-s, -es).' },
        'Class 3': { stage: 'R', notes: 'Common and Proper nouns, simple plurals (-s, -es).' },
        'Class 4': { stage: 'R', notes: 'Collective and Abstract nouns; gender classifications.' },
        'Class 5': { stage: 'R', notes: 'Countable vs uncountable; irregular plurals; possessive apostrophe.' },
        'Class 6': { stage: 'M', notes: 'Abstract noun derivation from verbs and adjectives.' },
        'Class 7': { stage: 'M', notes: 'Noun clauses in complex sentence functions.' },
        'Class 8': { stage: 'M', notes: 'Full mastery applied in composition.' },
        'Class 9': { stage: 'M', notes: 'Board-level editing & concord with complex noun phrases.' },
        'Class 10': { stage: 'M', notes: 'Error correction in board examination passages.' },
        'Class 11': { stage: 'M', notes: 'Nominalization in academic and journalistic prose.' },
        'Class 12': { stage: 'M', notes: 'Rhetorical nominalization and precision.' },
      }
    ),
    makeTopic(
      'top-pronouns',
      'Parts of Speech',
      'Pronouns: Case & Agreement',
      'Personal, Possessive, Demonstrative, Relative, Interrogative, Reflexive & Emphatic pronouns.',
      {
        'Class 1': { stage: 'I', notes: 'Introductory pronouns: I, you, he, she, it.' },
        'Class 2': { stage: 'D', notes: 'We, they, my, your in simple daily speech and sentences.' },
        'Class 3': { stage: 'R', notes: 'Personal subject and object pronouns (I, he, she, they).' },
        'Class 4': { stage: 'R', notes: 'Possessive (mine, hers) and Demonstrative (this, that, these, those).' },
        'Class 5': { stage: 'R', notes: 'Reflexive and Emphatic pronouns (myself, himself).' },
        'Class 6': { stage: 'R', notes: 'Relative pronouns (who, which, that) in clause combining.' },
        'Class 7': { stage: 'M', notes: 'Indefinite pronouns; pronoun-antecedent concord.' },
        'Class 8': { stage: 'M', notes: 'Eliminating vague pronoun reference errors in essays.' },
        'Class 9': { stage: 'M', notes: 'Relative pronoun omission in restrictive vs non-restrictive clauses.' },
        'Class 10': { stage: 'M', notes: 'Board passage editing for pronoun case agreement.' },
        'Class 11': { stage: 'M', notes: 'Nuanced stylistic pronoun shifts in rhetoric.' },
        'Class 12': { stage: 'M', notes: 'Full mastery in formal critical discourse.' },
      }
    ),
    makeTopic(
      'top-adjectives',
      'Parts of Speech',
      'Adjectives & Degrees of Comparison',
      'Descriptive, Quantitative, Demonstrative adjectives; comparative and superlative syntax; order of adjectives.',
      {
        'Class 3': { stage: 'I', notes: 'Descriptive adjectives for sensory traits and colors.' },
        'Class 4': { stage: 'R', notes: 'Regular comparative (-er) and superlative (-est) forms.' },
        'Class 5': { stage: 'R', notes: 'Irregular degrees (good/better/best, little/less/least).' },
        'Class 6': { stage: 'R', notes: 'Royal order of adjectives (opinion, size, age, shape, color, origin).' },
        'Class 7': { stage: 'M', notes: 'Sentence transformation with as...as, than, and the most.' },
        'Class 8': { stage: 'M', notes: 'Participial adjectives (-ing vs -ed) and compound modifiers.' },
        'Class 9': { stage: 'M', notes: 'Board level sentence transformation of degrees.' },
        'Class 10': { stage: 'M', notes: 'Error analysis in degree comparison without meaning change.' },
        'Class 11': { stage: 'M', notes: 'Subtle qualitative modifier positioning.' },
        'Class 12': { stage: 'M', notes: 'Full evaluative rhetoric mastery.' },
      }
    ),
    makeTopic(
      'top-verbs-modals',
      'Parts of Speech',
      'Verbs & Modal Auxiliaries',
      'Action/Stative verbs, Transitive/Intransitive verbs, Primary auxiliaries, and Modals of ability, permission, obligation, and deduction.',
      {
        'Class 3': { stage: 'I', notes: 'Action verbs; is/am/are/was/were as linking verbs.' },
        'Class 4': { stage: 'I', notes: 'Can and May for ability and polite permission.' },
        'Class 5': { stage: 'R', notes: 'Must, should, ought to for duty; transitive vs intransitive verbs.' },
        'Class 6': { stage: 'R', notes: 'Would and could for past habits, hypothetical, and polite requests.' },
        'Class 7': { stage: 'R', notes: 'Modals of deduction and probability (must have, might have).' },
        'Class 8': { stage: 'M', notes: 'Semi-modals (need, dare, used to); modal voice in passive.' },
        'Class 9': { stage: 'M', notes: 'Board cloze gap-filling for modal nuances.' },
        'Class 10': { stage: 'M', notes: 'Modal error spotting in official board examinations.' },
        'Class 11': { stage: 'M', notes: 'Epistemic vs deontic modal usage in discourse analysis.' },
        'Class 12': { stage: 'M', notes: 'Rhetorical modal persuasion in speeches.' },
      }
    ),
    makeTopic(
      'top-non-finites',
      'Parts of Speech',
      'Non-Finite Verbs: Infinitives, Gerunds & Participles',
      'Bare/to-infinitives, Gerunds as subjects/objects, Present/Past/Perfect Participles, and Dangling Participle correction.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'none' },
        'Class 6': { stage: 'I', notes: 'Simple to-infinitives after verbs of intent (want to play).' },
        'Class 7': { stage: 'I', notes: 'Gerund (-ing form) vs continuous verb; bare infinitives.' },
        'Class 8': { stage: 'R', notes: 'Participles as adjectives; combining sentences using participles.' },
        'Class 9': { stage: 'R', notes: 'Split infinitives; fixing dangling participles in essays.' },
        'Class 10': { stage: 'M', notes: 'Sentence synthesis using non-finites in ICSE/CBSE board papers.' },
        'Class 11': { stage: 'M', notes: 'Participial clause reduction in academic writing.' },
        'Class 12': { stage: 'M', notes: 'Stylistic sentence economy and non-finite fronting.' },
      }
    ),
    makeTopic(
      'top-prepositions',
      'Parts of Speech',
      'Prepositions & Phrasal Verbs',
      'Prepositions of time, place, direction; dependent prepositions with verbs/adjectives; separable and inseparable phrasal verbs.',
      {
        'Class 3': { stage: 'I', notes: 'Simple prepositions: in, on, under, at, to, behind.' },
        'Class 4': { stage: 'R', notes: 'Prepositions of time: in, on, at, during; between vs among.' },
        'Class 5': { stage: 'R', notes: 'Since vs for; into, through, across, towards.' },
        'Class 6': { stage: 'R', notes: 'Common dependent prepositions (afraid of, interested in).' },
        'Class 7': { stage: 'R', notes: 'Introductory phrasal verbs with look, give, take, run.' },
        'Class 8': { stage: 'M', notes: 'Complex prepositions (in spite of, on behalf of); separable phrasal verbs.' },
        'Class 9': { stage: 'M', notes: 'Board examination cloze test prepositions.' },
        'Class 10': { stage: 'M', notes: 'Error correction in preposition collocations.' },
        'Class 11': { stage: 'M', notes: 'Idiomatic prepositional nuances in literature.' },
        'Class 12': { stage: 'M', notes: 'Advanced register-appropriate phrasal verbs.' },
      }
    ),

    // STRAND: Tenses & Aspect
    makeTopic(
      'top-simple-continuous-tenses',
      'Tenses & Aspect',
      'Simple & Continuous Tenses (Present, Past, Future)',
      'Habitual actions, universal truths, progressive aspect, and state vs dynamic verbs.',
      {
        'Class 3': { stage: 'I', notes: 'Simple present and simple past of regular verbs (-ed).' },
        'Class 4': { stage: 'R', notes: 'Present and past continuous with -ing; future with will.' },
        'Class 5': { stage: 'R', notes: 'Subject agreement with third person singular -s/-es; going to future.' },
        'Class 6': { stage: 'M', notes: 'State verbs that avoid continuous forms (know, believe, belong).' },
        'Class 7': { stage: 'M', notes: 'Time clauses with present simple indicating future.' },
        'Class 8': { stage: 'M', notes: 'Narrative tenses consistency across multi-paragraph stories.' },
        'Class 9': { stage: 'M', notes: 'Board cloze passage tense consistency.' },
        'Class 10': { stage: 'M', notes: 'Full mastery in all literary forms.' },
        'Class 11': { stage: 'M', notes: 'Mastery.' },
        'Class 12': { stage: 'M', notes: 'Mastery.' },
      }
    ),
    makeTopic(
      'top-perfect-tenses',
      'Tenses & Aspect',
      'Perfect & Perfect Continuous Tenses',
      'Present Perfect with already/yet/just, Past Perfect sequence of events, and Perfect Continuous with since/for.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'I', notes: 'Present perfect preview: has/have + past participle for past experiences.' },
        'Class 6': { stage: 'R', notes: 'Present perfect with since and for vs simple past.' },
        'Class 7': { stage: 'R', notes: 'Past perfect (had + V3) to mark the earlier of two past events.' },
        'Class 8': { stage: 'R', notes: 'Present and Past perfect continuous for ongoing durations.' },
        'Class 9': { stage: 'M', notes: 'Future perfect (will have done) and sequence of tenses.' },
        'Class 10': { stage: 'M', notes: 'Board exam narrative tense concordance.' },
        'Class 11': { stage: 'M', notes: 'Historical present and retrospective past perfect in criticism.' },
        'Class 12': { stage: 'M', notes: 'Full mastery.' },
      }
    ),

    // STRAND: Syntax & Concord
    makeTopic(
      'top-concord',
      'Syntax & Concord',
      'Subject-Verb Agreement (Concord)',
      'Singular/plural rules, compound subjects with and/or, indefinite pronouns, collective nouns, and inverted subjects.',
      {
        'Class 3': { stage: 'I', notes: 'Basic singular subject = singular verb (cat runs vs cats run).' },
        'Class 4': { stage: 'R', notes: 'Compound subjects joined by and.' },
        'Class 5': { stage: 'R', notes: 'Either...or, neither...nor rule matching the nearer subject.' },
        'Class 6': { stage: 'R', notes: 'Indefinite pronouns (everyone, someone, each) taking singular verbs.' },
        'Class 7': { stage: 'R', notes: 'Phrases like as well as, along with, accompanied by.' },
        'Class 8': { stage: 'M', notes: 'Nouns plural in form but singular in meaning (news, mathematics, physics).' },
        'Class 9': { stage: 'M', notes: 'Concord with relative pronoun clauses and inverted word order.' },
        'Class 10': { stage: 'M', notes: 'Rigorous board exam error editing with complex subjects.' },
        'Class 11': { stage: 'M', notes: 'Advanced syntax concord in journalism and debate.' },
        'Class 12': { stage: 'M', notes: 'Full mastery.' },
      }
    ),
    makeTopic(
      'top-sentence-structure',
      'Syntax & Concord',
      'Sentence Types & Subject-Predicate Synthesis',
      'Declarative, Interrogative, Imperative, Exclamatory sentences; simple, compound, and complex sentence architecture.',
      {
        'Class 3': { stage: 'I', notes: 'Four basic sentence types and appropriate end punctuation.' },
        'Class 4': { stage: 'I', notes: 'Subject and Predicate identification.' },
        'Class 5': { stage: 'R', notes: 'Forming interrogatives; affirmative vs negative sentences.' },
        'Class 6': { stage: 'R', notes: 'Simple vs Compound sentences using coordinating conjunctions.' },
        'Class 7': { stage: 'R', notes: 'Complex sentences with main and subordinate clauses.' },
        'Class 8': { stage: 'M', notes: 'Compound-complex sentence synthesis.' },
        'Class 9': { stage: 'M', notes: 'Transforming simple sentences to complex and compound sentences.' },
        'Class 10': { stage: 'M', notes: 'ICSE/CBSE sentence synthesis and transformation papers.' },
        'Class 11': { stage: 'M', notes: 'Stylistic variation: loose vs periodic sentences.' },
        'Class 12': { stage: 'E', notes: 'Rhetorical sentence cadence and parallelism.' },
      }
    ),

    // STRAND: Voice & Reported Speech
    makeTopic(
      'top-voice',
      'Voice & Reported Speech',
      'Active and Passive Voice',
      'Agent by-phrases, passive of continuous and perfect tenses, imperatives, interrogatives, and impersonal scientific passive.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'I', notes: 'Introduction: simple present and simple past active vs passive.' },
        'Class 6': { stage: 'R', notes: 'Passive of all simple tenses; modal auxiliaries in passive.' },
        'Class 7': { stage: 'R', notes: 'Continuous and perfect tenses in passive voice.' },
        'Class 8': { stage: 'M', notes: 'Passive of imperatives (Let it be done) and interrogatives (Who wrote this?).' },
        'Class 9': { stage: 'M', notes: 'Agent omission in passive for official reports and science lab experiments.' },
        'Class 10': { stage: 'M', notes: 'Board examination passive transformations and news reporting.' },
        'Class 11': { stage: 'M', notes: 'Appropriate voice selection in professional writing.' },
        'Class 12': { stage: 'E', notes: 'Passive voice in legal, academic, and diplomatic discourse.' },
      }
    ),
    makeTopic(
      'top-reported-speech',
      'Voice & Reported Speech',
      'Direct and Indirect (Reported) Speech',
      'Reporting verbs, backshift of tenses, pronoun adjustments, time/place shift words, reported questions, commands, and exclamations.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'I', notes: 'Direct speech dialogue punctuation and speech marks.' },
        'Class 6': { stage: 'I', notes: 'Reporting assertive statements; tense backshifting rules.' },
        'Class 7': { stage: 'R', notes: 'Reported questions (wh- questions and yes/no with if/whether).' },
        'Class 8': { stage: 'M', notes: 'Reported imperatives (commanded, requested, advised + to-infinitive).' },
        'Class 9': { stage: 'M', notes: 'Reported exclamations; converting dialogues into reported paragraphs.' },
        'Class 10': { stage: 'M', notes: 'Board paper dialogue reporting and gap-filling.' },
        'Class 11': { stage: 'M', notes: 'Free indirect speech in narrative prose and journalism.' },
        'Class 12': { stage: 'E', notes: 'Nuanced reporting verbs (alleged, conceded, rebutted) in rhetoric.' },
      }
    ),

    // STRAND: Clauses & Complex Syntax
    makeTopic(
      'top-clauses',
      'Clauses & Complex Syntax',
      'Clauses: Noun, Adjective & Adverb Clauses',
      'Dependent vs independent clauses, relative clauses (defining/non-defining), adverbial clauses of condition, concession, and purpose.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'none' },
        'Class 6': { stage: 'I', notes: 'Distinction between a phrase and a clause.' },
        'Class 7': { stage: 'R', notes: 'Noun clauses as subjects and objects; relative adjective clauses.' },
        'Class 8': { stage: 'R', notes: 'Adverb clauses of time, reason, condition, and concession (although, whereas).' },
        'Class 9': { stage: 'M', notes: 'Combining sentences using specified clause types.' },
        'Class 10': { stage: 'M', notes: 'Board exam clause analysis and subordinate clause synthesis.' },
        'Class 11': { stage: 'M', notes: 'Appositive clauses and complex hypotaxis in academic essays.' },
        'Class 12': { stage: 'E', notes: 'Syntactic hierarchy and clause embedding in literature.' },
      }
    ),
    makeTopic(
      'top-conditionals',
      'Clauses & Complex Syntax',
      'Conditionals (Zero, First, Second, Third, Mixed)',
      'Real conditions, hypothetical situations, counterfactual past regrets, inverted conditionals without if.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'I', notes: 'Zero conditional for facts (If water reaches 100°C, it boils).' },
        'Class 6': { stage: 'R', notes: 'First conditional for real possibilities (If it rains, we will stay).' },
        'Class 7': { stage: 'R', notes: 'Second conditional for imaginary situations (If I had wings, I would fly).' },
        'Class 8': { stage: 'M', notes: 'Third conditional for past regrets (If you had studied, you would have passed).' },
        'Class 9': { stage: 'M', notes: 'Unless vs if not; inverted conditionals (Had I known, Should you arrive).' },
        'Class 10': { stage: 'M', notes: 'Board level conditional sentence rewriting.' },
        'Class 11': { stage: 'M', notes: 'Mixed conditionals (Past condition with present outcome).' },
        'Class 12': { stage: 'E', notes: 'Subjunctive mood and counterfactual rhetoric.' },
      }
    ),

    // STRAND: Sentence Transformation
    makeTopic(
      'top-transformation',
      'Sentence Transformation',
      'Sentence Transformation & Interchange',
      'Transformation of sentences without changing meaning: Degrees of comparison, Affirmative/Negative, Interrogative/Assertive, Too...to / So...that.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'none' },
        'Class 6': { stage: 'I', notes: 'Interchange of Affirmative and Negative sentences (He is wise = He is not foolish).' },
        'Class 7': { stage: 'R', notes: 'Interchange of Interrogative and Assertive; Exclamatory and Assertive.' },
        'Class 8': { stage: 'R', notes: 'Removal of too (He is too weak to walk = He is so weak that he cannot walk).' },
        'Class 9': { stage: 'M', notes: 'No sooner...than, As soon as, Hardly...when, Scarcely...when.' },
        'Class 10': { stage: 'M', notes: 'ICSE/CBSE standard 8-mark transformation question mastery.' },
        'Class 11': { stage: 'M', notes: 'Inversion of word order for dramatic emphasis.' },
        'Class 12': { stage: 'E', notes: 'Rhetorical stylistics and syntactic inversion.' },
      }
    ),

    // STRAND: Punctuation & Mechanics
    makeTopic(
      'top-punctuation',
      'Punctuation & Mechanics',
      'Punctuation, Capitalization & Mechanics',
      'Full stop, comma rules, apostrophe for contraction/possession, quotation marks, colons, semicolons, dashes, and parentheses.',
      {
        'Class 3': { stage: 'I', notes: 'Capital letters for names and sentence starts; full stop, question mark, comma in lists.' },
        'Class 4': { stage: 'R', notes: 'Apostrophe for contractions (don’t) and singular possession (girl’s book).' },
        'Class 5': { stage: 'R', notes: 'Plural possessive apostrophe (girls’ school); speech marks for direct speech.' },
        'Class 6': { stage: 'R', notes: 'Exclamation marks; commas after introductory adverb clauses.' },
        'Class 7': { stage: 'M', notes: 'Colons for lists/explanations; semicolons connecting related independent clauses.' },
        'Class 8': { stage: 'M', notes: 'Hyphens vs em-dashes; parentheses for non-essential detail.' },
        'Class 9': { stage: 'M', notes: 'Editing punctuation in board passage questions.' },
        'Class 10': { stage: 'M', notes: 'Flawless punctuation mastery in creative composition.' },
        'Class 11': { stage: 'M', notes: 'Academic citation punctuation and editorial precision.' },
        'Class 12': { stage: 'M', notes: 'Full mastery.' },
      }
    ),

    // STRAND: Error Analysis & Editing
    makeTopic(
      'top-error-editing',
      'Error Analysis & Editing',
      'Error Spotting, Omission & Proofreading',
      'Identification of incorrect tense, concord, preposition, article, pronoun, or word form in passages.',
      {
        'Class 3': { stage: 'none' },
        'Class 4': { stage: 'none' },
        'Class 5': { stage: 'I', notes: 'Spot the incorrect word in a simple sentence (spelling/basic verb).' },
        'Class 6': { stage: 'R', notes: 'Sentence error correction with grammar justifications.' },
        'Class 7': { stage: 'R', notes: 'Passage editing: finding the incorrect word in each line.' },
        'Class 8': { stage: 'R', notes: 'Omission exercises: supplying the missing word (article, preposition, connector).' },
        'Class 9': { stage: 'M', notes: 'CBSE Class 9 integrated grammar editing format.' },
        'Class 10': { stage: 'M', notes: 'CBSE/ICSE Class 10 Board exam passage error editing.' },
        'Class 11': { stage: 'M', notes: 'Proofreading complex non-fiction articles and reports.' },
        'Class 12': { stage: 'M', notes: 'Advanced copyediting and stylistic precision.' },
      }
    ),
  ];

  const strands = Array.from(new Set(topics.map((t) => t.strand)));

  return {
    id: 'spiral-curriculum-matrix-k12',
    title: `K-12 English Grammar Scope & Sequence (${targetBoard})`,
    targetBoard,
    strands,
    topics,
    lastAudited: new Date().toISOString(),
  };
}

export interface CurriculumAuditIssue {
  topicId: string;
  topicTitle: string;
  strand: string;
  type: 'orphan_mastery' | 'interrupted_spiral' | 'never_mastered' | 'unbalanced_grade';
  severity: 'warning' | 'info' | 'error';
  message: string;
  recommendation: string;
}

export function auditCurriculumGaps(matrix: SpiralCurriculumMatrix): CurriculumAuditIssue[] {
  const issues: CurriculumAuditIssue[] = [];

  matrix.topics.forEach((topic) => {
    let hasIntroduced = false;
    let hasReinforced = false;
    let hasMastered = false;
    let lastActiveIndex = -1;

    ALL_CLASSES.forEach((cls, idx) => {
      const stage = topic.progression[cls]?.stage || 'none';

      if (stage === 'I') {
        hasIntroduced = true;
        lastActiveIndex = idx;
      } else if (stage === 'R') {
        if (!hasIntroduced) {
          issues.push({
            topicId: topic.id,
            topicTitle: topic.title,
            strand: topic.strand,
            type: 'orphan_mastery',
            severity: 'warning',
            message: `Reinforced in ${cls} without prior Introduction (I) in lower grades.`,
            recommendation: `Consider introducing foundational concepts in an earlier grade level.`,
          });
        }
        hasReinforced = true;
        lastActiveIndex = idx;
      } else if (stage === 'M' || stage === 'E') {
        if (!hasIntroduced && !hasReinforced) {
          issues.push({
            topicId: topic.id,
            topicTitle: topic.title,
            strand: topic.strand,
            type: 'orphan_mastery',
            severity: 'error',
            message: `Marked as Mastered (M) in ${cls} with no prior Introduction (I) or Reinforcement (R).`,
            recommendation: `Introduce the topic in earlier classes before requiring full exam mastery.`,
          });
        }
        hasMastered = true;
        lastActiveIndex = idx;
      } else if (stage === 'none') {
        // If it was introduced or reinforced earlier, but dropped in this grade, and then re-appears later
        if (lastActiveIndex !== -1 && idx > lastActiveIndex) {
          const subsequentStages = ALL_CLASSES.slice(idx + 1).map(
            (c) => topic.progression[c]?.stage || 'none'
          );
          if (subsequentStages.some((s) => s !== 'none')) {
            issues.push({
              topicId: topic.id,
              topicTitle: topic.title,
              strand: topic.strand,
              type: 'interrupted_spiral',
              severity: 'info',
              message: `Spiral dropped in ${cls} between active instruction grades.`,
              recommendation: `Verify if a bridging review set should be included in ${cls}.`,
            });
          }
        }
      }
    });

    if (hasIntroduced && !hasMastered) {
      issues.push({
        topicId: topic.id,
        topicTitle: topic.title,
        strand: topic.strand,
        type: 'never_mastered',
        severity: 'info',
        message: `Topic is introduced but never reaches formal Mastery (M) by Class 12.`,
        recommendation: `Designate senior grades (Class 10–12) for mastery or application.`,
      });
    }
  });

  return issues;
}

export function exportMatrixToCSV(matrix: SpiralCurriculumMatrix): string {
  const headers = ['Strand', 'Grammar Topic', 'Description', ...ALL_CLASSES];
  const rows = matrix.topics.map((t) => {
    const classCells = ALL_CLASSES.map((cls) => {
      const cell = t.progression[cls];
      if (!cell || cell.stage === 'none') return '-';
      return cell.subtopicsOrNotes
        ? `[${cell.stage}] ${cell.subtopicsOrNotes.replace(/"/g, '""')}`
        : cell.stage;
    });
    return [
      `"${t.strand.replace(/"/g, '""')}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      ...classCells.map((c) => `"${c}"`),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function exportMatrixToMarkdown(matrix: SpiralCurriculumMatrix): string {
  let md = `# ${matrix.title}\n\n`;
  md += `**Target Board:** ${matrix.targetBoard} | **Last Audited:** ${new Date().toLocaleDateString()}\n\n`;
  md += `### Progression Legend\n`;
  md += `- **I** = Introduced (Foundational recognition & simple syntax)\n`;
  md += `- **R** = Reinforced & Expanded (Practical usage & exception sets)\n`;
  md += `- **M** = Mastered & Applied (Board-level examination accuracy)\n`;
  md += `- **E** = Extension / Advanced (Olympiad & collegiate stylistics)\n`;
  md += `- **—** = Not taught in target grade\n\n`;

  const strands = matrix.strands;
  strands.forEach((strand) => {
    md += `## Strand: ${strand}\n\n`;
    const strandTopics = matrix.topics.filter((t) => t.strand === strand);

    strandTopics.forEach((t) => {
      md += `### ${t.title}\n`;
      md += `*${t.description}*\n\n`;
      md += `| Class | Stage | Scope & Pedagogical Notes |\n`;
      md += `| :--- | :---: | :--- |\n`;
      ALL_CLASSES.forEach((cls) => {
        const cell = t.progression[cls];
        const stage = cell?.stage || 'none';
        const notes = cell?.subtopicsOrNotes || '—';
        md += `| ${cls} | **${stage === 'none' ? '—' : stage}** | ${notes} |\n`;
      });
      md += `\n`;
    });
  });

  return md;
}
