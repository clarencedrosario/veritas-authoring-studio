import {
  SentenceDiagramData,
  SentenceClassificationType,
  ClauseSegment,
  GrammarToken,
  ReedKelloggNode,
  SyntacticTreeNode,
  GrammarClassLevel,
  SyntacticRole,
} from '../types';

const PREPOSITIONS = new Set([
  'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at',
  'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'by',
  'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'near',
  'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'through',
  'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'until', 'up',
  'upon', 'with', 'within', 'without',
]);

const COORD_CONJUNCTIONS = new Set(['and', 'but', 'or', 'nor', 'for', 'so', 'yet']);

const SUBORD_CONJUNCTIONS = new Set([
  'although', 'though', 'even though', 'while', 'whereas',
  'because', 'since', 'as', 'so that', 'in order that',
  'if', 'unless', 'provided that', 'whether',
  'when', 'whenever', 'before', 'after', 'until', 'till', 'once', 'as soon as',
  'that', 'which', 'who', 'whom', 'whose', 'where', 'why', 'how',
]);

const DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'some', 'any', 'every', 'each', 'all', 'both', 'few', 'many', 'much', 'several', 'no',
]);

const AUXILIARY_VERBS = new Set([
  'is', 'am', 'are', 'was', 'were', 'be', 'being', 'been',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'ought',
]);

const COMMON_ADVERBS = new Set([
  'quickly', 'slowly', 'peacefully', 'diligently', 'safely', 'clearly', 'loudly',
  'softly', 'gracefully', 'always', 'never', 'often', 'seldom', 'rarely', 'sometimes',
  'very', 'quite', 'too', 'almost', 'extremely', 'not', 'now', 'then', 'here', 'there',
  'yesterday', 'today', 'tomorrow', 'already', 'still', 'soon',
]);

const PRONOUNS = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'someone', 'anyone', 'everyone', 'nobody', 'somebody', 'anybody',
]);

export function heuristicParseSentence(rawSentence: string, targetClass?: GrammarClassLevel): SentenceDiagramData {
  const sentence = rawSentence.trim();
  const rawTokens = sentence.match(/[A-Za-z0-9'-]+|[.,!?;]/g) || [sentence];

  // 1. Detect Clauses & Conjunctions
  let hasCoord = false;
  let hasSubord = false;

  const wordsOnly = rawTokens.filter((t) => /^[A-Za-z0-9'-]+$/.test(t));

  for (const w of wordsOnly) {
    const lower = w.toLowerCase();
    if (COORD_CONJUNCTIONS.has(lower)) hasCoord = true;
    if (SUBORD_CONJUNCTIONS.has(lower)) hasSubord = true;
  }

  let classification: SentenceClassificationType = 'simple';
  if (hasCoord && hasSubord) classification = 'compound-complex';
  else if (hasCoord) classification = 'compound';
  else if (hasSubord) classification = 'complex';

  // 2. Token classification
  const tokens: GrammarToken[] = [];
  let foundVerb = false;
  let foundSubject = false;

  wordsOnly.forEach((w, index) => {
    const lower = w.toLowerCase();
    let pos: GrammarToken['pos'] = 'noun';
    let role: SyntacticRole = 'subject';
    let roleLabel = 'Noun';

    if (DETERMINERS.has(lower)) {
      pos = 'determiner';
      role = 'determiner';
      roleLabel = 'Determiner / Article';
    } else if (PREPOSITIONS.has(lower)) {
      pos = 'preposition';
      role = 'preposition';
      roleLabel = 'Preposition';
    } else if (COORD_CONJUNCTIONS.has(lower)) {
      pos = 'conjunction';
      role = 'coordinating_conjunction';
      roleLabel = 'Coordinating Conjunction';
    } else if (SUBORD_CONJUNCTIONS.has(lower)) {
      pos = 'conjunction';
      role = 'subordinating_conjunction';
      roleLabel = 'Subordinating Conjunction';
    } else if (AUXILIARY_VERBS.has(lower)) {
      pos = 'verb';
      role = 'auxiliary_verb';
      roleLabel = 'Auxiliary / Modal Verb';
      foundVerb = true;
    } else if (COMMON_ADVERBS.has(lower) || lower.endsWith('ly')) {
      pos = 'adverb';
      role = 'adverb_modifier';
      roleLabel = 'Adverbial Modifier';
    } else if (PRONOUNS.has(lower)) {
      pos = 'pronoun';
      if (!foundSubject) {
        role = 'subject';
        roleLabel = 'Subject Pronoun';
        foundSubject = true;
      } else {
        role = 'direct_object';
        roleLabel = 'Object Pronoun';
      }
    } else if (
      lower.endsWith('ed') ||
      lower.endsWith('ing') ||
      ['ran', 'saw', 'walked', 'slept', 'showed', 'revealed', 'proved', 'ate', 'built', 'read', 'sang', 'gave', 'made'].includes(lower)
    ) {
      pos = 'verb';
      role = 'predicate_verb';
      roleLabel = 'Finite Verb';
      foundVerb = true;
    } else if (
      lower.endsWith('ful') ||
      lower.endsWith('ous') ||
      lower.endsWith('ive') ||
      lower.endsWith('able') ||
      lower.endsWith('al') ||
      ['curious', 'black', 'young', 'soft', 'rare', 'ancient', 'greenhouse', 'elder'].includes(lower)
    ) {
      pos = 'adjective';
      role = 'adjective_modifier';
      roleLabel = 'Adjectival Modifier';
    } else {
      // General noun heuristic
      pos = 'noun';
      if (!foundSubject) {
        role = 'subject';
        roleLabel = 'Subject Head Noun';
        foundSubject = true;
      } else if (foundVerb) {
        role = 'direct_object';
        roleLabel = 'Direct Object';
      } else {
        role = 'adjective_modifier';
        roleLabel = 'Noun Adjunct';
      }
    }

    tokens.push({
      id: `tok-${index}`,
      word: w,
      pos,
      role,
      roleLabel,
      clauseId: 'c-1',
      clauseName: 'Principal Clause',
    });
  });

  // Extract primary subject, verb, direct object, prepositional phrases
  const fallbackSubject: GrammarToken = {
    id: 'tok-fallback-subj',
    word: wordsOnly[0] || 'Subject',
    pos: 'noun',
    role: 'subject',
    roleLabel: 'Subject Head',
    clauseId: 'c-1',
    clauseName: 'Principal Clause',
  };

  const fallbackVerb: GrammarToken = {
    id: 'tok-fallback-verb',
    word: wordsOnly[1] || 'Verb',
    pos: 'verb',
    role: 'predicate_verb',
    roleLabel: 'Finite Verb',
    clauseId: 'c-1',
    clauseName: 'Principal Clause',
  };

  const subjectToken: GrammarToken = tokens.find((t) => t.role === 'subject') || tokens[0] || fallbackSubject;
  const verbToken: GrammarToken = tokens.find((t) => t.role === 'predicate_verb' || t.role === 'auxiliary_verb') || fallbackVerb;
  const objectToken = tokens.find((t) => t.role === 'direct_object');

  // Modifiers for subject
  const subjectModifiers = tokens
    .filter((t) => (t.role === 'determiner' || t.role === 'adjective_modifier') && tokens.indexOf(t) < tokens.indexOf(subjectToken))
    .map((t) => ({ word: t.word, type: (t.role === 'determiner' ? 'determiner' : 'adjective') as 'determiner' | 'adjective' }));

  // Modifiers for verb
  const verbModifiers = tokens
    .filter((t) => t.role === 'adverb_modifier')
    .map((t) => ({ word: t.word, type: 'adverb' as const }));

  // Prepositional phrases heuristic
  const prepPhrases: ReedKelloggNode['prepPhrases'] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].role === 'preposition') {
      const prepWord = tokens[i].word;
      const nextWords = tokens.slice(i + 1, i + 4);
      const nounObj = nextWords.find((w) => w.pos === 'noun' || w.pos === 'pronoun') || nextWords[nextWords.length - 1];
      if (nounObj) {
        const mods = nextWords.filter((w) => w !== nounObj && (w.role === 'determiner' || w.role === 'adjective_modifier')).map((w) => w.word);
        prepPhrases.push({
          preposition: prepWord,
          object: nounObj.word,
          attachesTo: 'verb',
          modifiers: mods,
        });
      }
    }
  }

  // Build Clause Segment
  const primaryClause: ClauseSegment = {
    id: 'c-1',
    type: 'principal',
    typeName: 'Principal (Independent) Clause',
    color: 'indigo',
    text: sentence,
    functionInSentence: 'Expresses the core proposition.',
    subject: {
      text: subjectModifiers.map((m) => m.word).concat(subjectToken.word).join(' '),
      headNoun: subjectToken.word,
      modifiers: subjectModifiers.map((m) => m.word),
    },
    predicate: {
      verbPhrase: verbToken.word,
      tense: 'Standard Active',
      transitivity: objectToken ? 'transitive' : 'intransitive',
      directObject: objectToken ? objectToken.word : undefined,
      adverbials: verbModifiers.map((v) => v.word),
    },
  };

  // Build Reed-Kellogg Node
  const reedKellogg: ReedKelloggNode[] = [
    {
      clauseId: 'c-1',
      clauseType: 'principal',
      subject: subjectToken.word,
      subjectModifiers,
      verb: verbToken.word,
      verbModifiers,
      objectOrComplement: objectToken ? objectToken.word : undefined,
      complementType: objectToken ? 'direct_object' : undefined,
      objectModifiers: [],
      prepPhrases,
    },
  ];

  // Build Syntactic Tree
  const syntaxTree: SyntacticTreeNode = {
    id: 'tree-root',
    label: 'S',
    fullLabel: `${classification.toUpperCase()} Sentence`,
    category: 'clause',
    text: sentence,
    children: [
      {
        id: 'tree-np',
        label: 'NP',
        fullLabel: 'Subject Noun Phrase',
        category: 'phrase',
        children: [
          ...subjectModifiers.map((m, idx) => ({
            id: `tree-sm-${idx}`,
            label: m.type === 'determiner' ? 'Det' : 'Adj',
            fullLabel: m.type === 'determiner' ? 'Determiner' : 'Adjective',
            category: 'word' as const,
            text: m.word,
          })),
          {
            id: 'tree-subj-n',
            label: 'N',
            fullLabel: 'Subject Noun',
            category: 'word' as const,
            text: subjectToken.word,
          },
        ],
      },
      {
        id: 'tree-vp',
        label: 'VP',
        fullLabel: 'Verb Phrase (Predicate)',
        category: 'phrase',
        children: [
          {
            id: 'tree-v',
            label: 'V',
            fullLabel: 'Verb',
            category: 'word' as const,
            text: verbToken.word,
          },
          ...(objectToken
            ? [
                {
                  id: 'tree-obj-np',
                  label: 'NP',
                  fullLabel: 'Direct Object Phrase',
                  category: 'phrase' as const,
                  children: [
                    {
                      id: 'tree-obj-n',
                      label: 'N',
                      fullLabel: 'Object Noun',
                      category: 'word' as const,
                      text: objectToken.word,
                    },
                  ],
                },
              ]
            : []),
          ...verbModifiers.map((vm, idx) => ({
            id: `tree-vm-${idx}`,
            label: 'Adv',
            fullLabel: 'Adverbial Modifier',
            category: 'word' as const,
            text: vm.word,
          })),
          ...prepPhrases.map((pp, idx) => ({
            id: `tree-pp-${idx}`,
            label: 'PP',
            fullLabel: 'Prepositional Phrase',
            category: 'phrase' as const,
            children: [
              {
                id: `tree-p-${idx}`,
                label: 'P',
                fullLabel: 'Preposition',
                category: 'word' as const,
                text: pp.preposition,
              },
              {
                id: `tree-pp-obj-${idx}`,
                label: 'NP',
                fullLabel: 'Prepositional Object',
                category: 'phrase' as const,
                text: pp.object,
              },
            ],
          })),
        ],
      },
    ],
  };

  return {
    id: `parsed-${Date.now()}`,
    sentence,
    classification,
    classLevelRecommendation: targetClass || (classification === 'simple' ? 'Class 4' : classification === 'compound' ? 'Class 6' : 'Class 8'),
    strand:
      classification === 'simple'
        ? 'Simple Sentence Architecture & Modifiers'
        : classification === 'compound'
        ? 'Compound Sentences & Coordinating Conjunctions'
        : classification === 'complex'
        ? 'Complex Sentences & Subordination'
        : 'Compound-Complex Multi-Clause Architecture',
    pedagogicalNotes: `Heuristically parsed sentence identified as a ${classification} construction. Subject head: "${subjectToken.word}", finite verb: "${verbToken.word}"${
      objectToken ? `, direct object: "${objectToken.word}"` : ''
    }. Connects modifiers and prepositional phrases to either the nominal subject or the verbal predicate.`,
    clauses: [primaryClause],
    tokens,
    reedKellogg,
    syntaxTree,
  };
}
