import { Chapter, Scene, Character } from '../types';

export interface ChapterPacingMetric {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  wordCount: number;
  dialogueWords: number;
  dialogueRatio: number; // percentage 0-100
  expositionWords: number;
  expositionRatio: number; // percentage 0-100
  actionWords: number;
  actionRatio: number; // percentage 0-100
  velocityScore: number; // 1-10
  sentenceCount: number;
  avgSentenceLength: number;
  pacingFlag: 'Balanced Flow' | 'Exposition Drag' | 'Talking Heads' | 'High Velocity Action';
  pacingAdvice: string;
  scenes: Array<{
    id: string;
    title: string;
    wordCount: number;
    dialogueRatio: number;
    expositionRatio: number;
    actionRatio: number;
    velocityScore: number;
  }>;
}

export interface PacingRadarPoint {
  axis: string;
  chapterValue: number; // 0 - 100
  benchmarkValue: number; // 0 - 100
  description: string;
}

export interface GenrePacingBenchmark {
  genre: string;
  targetDialogue: number;
  targetExposition: number;
  targetAction: number;
  idealAvgSentenceLength: number;
  description: string;
}

export const GENRE_PACING_BENCHMARKS: Record<string, GenrePacingBenchmark> = {
  'Thriller / Suspense': {
    genre: 'Thriller / Suspense',
    targetDialogue: 45,
    targetExposition: 25,
    targetAction: 30,
    idealAvgSentenceLength: 10.5,
    description: 'Crisp staccato action, high spoken conflict, low expositional reflection.',
  },
  'Literary Fiction': {
    genre: 'Literary Fiction',
    targetDialogue: 28,
    targetExposition: 52,
    targetAction: 20,
    idealAvgSentenceLength: 17.5,
    description: 'Dense internal monologue, rich perceptual exposition, deliberate conversational weight.',
  },
  'Sci-Fi & Fantasy': {
    genre: 'Sci-Fi & Fantasy',
    targetDialogue: 35,
    targetExposition: 45,
    targetAction: 20,
    idealAvgSentenceLength: 15.0,
    description: 'Worldbuilding atmosphere balanced with character interaction and magic/tech momentum.',
  },
  'Mystery / Detective': {
    genre: 'Mystery / Detective',
    targetDialogue: 42,
    targetExposition: 38,
    targetAction: 20,
    idealAvgSentenceLength: 12.8,
    description: 'Interrogation-driven dialogue paired with keen forensic observation and clue-sifting.',
  },
  'Romance / Contemporary': {
    genre: 'Romance / Contemporary',
    targetDialogue: 50,
    targetExposition: 35,
    targetAction: 15,
    idealAvgSentenceLength: 12.0,
    description: 'High banter, emotional subtext exchanges, and intimate internal reaction beats.',
  },
};

// ==========================================
// 1. ACTIVE PACING RADAR ENGINE
// ==========================================
export function calculateManuscriptPacing(chapters: Chapter[]): {
  chapters: ChapterPacingMetric[];
  manuscriptAvg: {
    dialogueRatio: number;
    expositionRatio: number;
    actionRatio: number;
    overallVelocity: number;
    totalWords: number;
  };
} {
  const chapterMetrics: ChapterPacingMetric[] = [];
  let totalWordsAll = 0;
  let totalDialogueWordsAll = 0;
  let totalExpositionWordsAll = 0;
  let totalActionWordsAll = 0;

  chapters.forEach((chap) => {
    let chapWords = 0;
    let chapDialogueChars = 0;
    let chapActionChars = 0;
    let chapExpositionChars = 0;
    let chapSentences: string[] = [];

    const sceneMetrics: ChapterPacingMetric['scenes'] = [];

    chap.scenes.forEach((sc) => {
      const text = sc.content || '';
      const scWords = text.trim() ? text.trim().split(/\s+/).length : 0;
      chapWords += scWords;

      // Extract spoken quotes: "..." or '...'
      const quotes: string[] = text.match(/["“][^"”]+["”]/g) || [];
      const quoteChars: number = quotes.reduce((acc: number, q: string) => acc + q.length, 0);

      // Sentences
      const sentences = text
        .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|')
        .split('|')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      chapSentences.push(...sentences);

      // Action sentences: short physical punchy clauses under 10 words outside quotes
      const shortSentences = sentences.filter((s) => {
        const words = s.split(/\s+/).length;
        return words <= 11 && !s.startsWith('"') && !s.startsWith('“');
      });
      const actionChars: number = shortSentences.reduce((acc: number, s: string) => acc + s.length, 0);

      const totalLen = Math.max(1, text.length);
      const dRatio = Math.min(100, Math.round((quoteChars / totalLen) * 100));
      const aRatio = Math.min(100 - dRatio, Math.round((actionChars / totalLen) * 100 * 0.7));
      const eRatio = Math.max(0, 100 - dRatio - aRatio);

      const velScore = Math.min(10, Math.max(1, Math.round((dRatio * 0.55 + aRatio * 0.45) / 10)));

      sceneMetrics.push({
        id: sc.id,
        title: sc.title,
        wordCount: scWords,
        dialogueRatio: dRatio,
        expositionRatio: eRatio,
        actionRatio: aRatio,
        velocityScore: velScore,
      });

      chapDialogueChars += quoteChars;
      chapActionChars += actionChars;
    });

    const chapTotalLen = Math.max(1, chap.scenes.reduce((acc, s) => acc + (s.content?.length || 0), 0));
    const dialogueRatio = Math.min(100, Math.round((chapDialogueChars / chapTotalLen) * 100));
    const actionRatio = Math.min(100 - dialogueRatio, Math.round((chapActionChars / chapTotalLen) * 100 * 0.7));
    const expositionRatio = Math.max(0, 100 - dialogueRatio - actionRatio);

    const dialogueWords = Math.round((chapWords * dialogueRatio) / 100);
    const actionWords = Math.round((chapWords * actionRatio) / 100);
    const expositionWords = Math.max(0, chapWords - dialogueWords - actionWords);

    totalWordsAll += chapWords;
    totalDialogueWordsAll += dialogueWords;
    totalActionWordsAll += actionWords;
    totalExpositionWordsAll += expositionWords;

    const velocityScore = Math.min(10, Math.max(1, Math.round((dialogueRatio * 0.55 + actionRatio * 0.45) / 10)));
    const avgSentenceLength =
      chapSentences.length > 0 ? Math.round((chapWords / chapSentences.length) * 10) / 10 : 0;

    let pacingFlag: ChapterPacingMetric['pacingFlag'] = 'Balanced Flow';
    let pacingAdvice = 'Pacing is balanced with a healthy pulse between spoken exchange and narrative observation.';

    if (expositionRatio >= 62) {
      pacingFlag = 'Exposition Drag';
      pacingAdvice = 'Exposition outweighs scene action (>60%). Insert dialogue confrontation or immediate physical action beats to break reader fatigue.';
    } else if (dialogueRatio >= 65) {
      pacingFlag = 'Talking Heads';
      pacingAdvice = 'Heavy dialogue clustering (>65%) without enough spatial grounding. Anchor characters with tactile props, micro-gestures, and environmental feedback.';
    } else if (velocityScore >= 8) {
      pacingFlag = 'High Velocity Action';
      pacingAdvice = 'Rapid-fire pacing. Effective for climaxes, but consider inserting a breathing room beat for emotional processing.';
    }

    chapterMetrics.push({
      chapterId: chap.id,
      chapterNumber: chap.number,
      chapterTitle: chap.title,
      wordCount: chapWords,
      dialogueWords,
      dialogueRatio,
      expositionWords,
      expositionRatio,
      actionWords,
      actionRatio,
      velocityScore,
      sentenceCount: chapSentences.length,
      avgSentenceLength,
      pacingFlag,
      pacingAdvice,
      scenes: sceneMetrics,
    });
  });

  const totalLen = Math.max(1, totalWordsAll);
  const manuscriptAvg = {
    dialogueRatio: Math.round((totalDialogueWordsAll / totalLen) * 100),
    expositionRatio: Math.round((totalExpositionWordsAll / totalLen) * 100),
    actionRatio: Math.round((totalActionWordsAll / totalLen) * 100),
    overallVelocity: Math.min(10, Math.max(1, Math.round(((totalDialogueWordsAll * 0.55 + totalActionWordsAll * 0.45) / totalLen) * 10))),
    totalWords: totalWordsAll,
  };

  return { chapters: chapterMetrics, manuscriptAvg };
}

// ==========================================
// 2. PASSIVE VS ACTIVE VOICE HEATMAP ENGINE
// ==========================================
export interface PassiveSentenceAudit {
  id: string;
  originalText: string;
  isPassive: boolean;
  passiveConstruction?: string;
  suggestedActive?: string;
  verbFound?: string;
  byAgent?: string;
  passiveSeverity: 'low' | 'moderate' | 'heavy';
}

export interface PassiveVoiceHeatmapReport {
  totalSentences: number;
  passiveSentencesCount: number;
  passivePercentage: number;
  activePercentage: number;
  grade: 'Elite Active (Publishing Standard)' | 'Healthy Dynamic' | 'Elevated Passive' | 'Heavy Passive Drag';
  byAgentCount: number;
  agentlessCount: number;
  sentences: PassiveSentenceAudit[];
  chapterHeatmap: Array<{
    chapterId: string;
    chapterNumber: number;
    chapterTitle: string;
    totalSentences: number;
    passivePercentage: number;
    passiveCount: number;
  }>;
}

// Irregular past participles commonly found in passive novel constructions
const PAST_PARTICIPLES = new Set([
  'seen', 'heard', 'spoken', 'written', 'broken', 'chosen', 'given', 'taken',
  'found', 'stolen', 'hidden', 'driven', 'known', 'drawn', 'struck', 'thought',
  'brought', 'caught', 'taught', 'felt', 'kept', 'left', 'lost', 'made', 'met',
  'sent', 'shot', 'spent', 'told', 'understood', 'worn', 'wound', 'held', 'torn',
  'dragged', 'pulled', 'pushed', 'shattered', 'observed', 'detected', 'watched',
  'whispered', 'uttered', 'murdered', 'struck', 'consumed', 'haunted', 'surrounded',
  'overwhelmed', 'executed', 'cast', 'forged', 'locked', 'sealed', 'crushed',
]);

export function analyzePassiveVoiceHeatmap(
  chapters: Chapter[],
  selectedText?: string
): PassiveVoiceHeatmapReport {
  const textToScan = selectedText || chapters.flatMap((c) => c.scenes.map((s) => s.content || '')).join('\n\n');

  const rawSentences = textToScan
    .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  let passiveCount = 0;
  let byAgentCount = 0;
  let agentlessCount = 0;

  // Regex pattern for passive voice: (was|were|is|are|been|being|be|became) + optional adverb + (verb-ed | irregular)
  const passivePattern = /\b(was|were|is|are|been|being|be|became|am)\s+(?:\w+ly\s+)?([a-z]+ed|[a-z]+en|seen|heard|spoken|written|broken|chosen|given|taken|found|stolen|hidden|driven|known|drawn|struck|thought|brought|caught|taught|felt|kept|left|lost|made|met|sent|shot|spent|told|understood|worn|wound|held|torn|cast)\b(?:\s+by\s+([a-zA-Z\s]+?)(?=[.,;!?]|$))?/i;

  const auditedSentences: PassiveSentenceAudit[] = rawSentences.map((sentence, idx) => {
    // Exclude dialogue quotes from passive scoring if desired, or examine narrative
    const match = sentence.match(passivePattern);

    if (match) {
      const aux = match[1];
      const participle = match[2];
      const byAgent = match[3]?.trim();

      passiveCount++;
      if (byAgent) byAgentCount++;
      else agentlessCount++;

      // Suggest active alternative
      let suggestedActive = '';
      if (byAgent) {
        suggestedActive = `Flip the agent: "${byAgent} ${participle}..."`;
      } else {
        suggestedActive = `Name the actor directly and use strong transitive action (e.g. "[Actor] ${participle}...")`;
      }

      return {
        id: `sent-${idx}`,
        originalText: sentence,
        isPassive: true,
        passiveConstruction: `${aux} ${participle}`,
        verbFound: participle,
        byAgent,
        suggestedActive,
        passiveSeverity: byAgent ? 'moderate' : 'heavy',
      };
    }

    return {
      id: `sent-${idx}`,
      originalText: sentence,
      isPassive: false,
      passiveSeverity: 'low',
    };
  });

  const total = Math.max(1, rawSentences.length);
  const passivePercentage = Math.round((passiveCount / total) * 100);
  const activePercentage = 100 - passivePercentage;

  let grade: PassiveVoiceHeatmapReport['grade'] = 'Elite Active (Publishing Standard)';
  if (passivePercentage <= 6) grade = 'Elite Active (Publishing Standard)';
  else if (passivePercentage <= 13) grade = 'Healthy Dynamic';
  else if (passivePercentage <= 22) grade = 'Elevated Passive';
  else grade = 'Heavy Passive Drag';

  // Per-chapter breakdown
  const chapterHeatmap = chapters.map((chap) => {
    const chapText = chap.scenes.map((s) => s.content || '').join('\n');
    const cSentences = chapText
      .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|')
      .split('|')
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const cPassives = cSentences.filter((s) => passivePattern.test(s)).length;
    const cTotal = Math.max(1, cSentences.length);
    const cPct = Math.round((cPassives / cTotal) * 100);

    return {
      chapterId: chap.id,
      chapterNumber: chap.number,
      chapterTitle: chap.title,
      totalSentences: cTotal,
      passivePercentage: cPct,
      passiveCount: cPassives,
    };
  });

  return {
    totalSentences: total,
    passiveSentencesCount: passiveCount,
    passivePercentage,
    activePercentage,
    grade,
    byAgentCount,
    agentlessCount,
    sentences: auditedSentences,
    chapterHeatmap,
  };
}

// ==========================================
// 3. SENSORY IMAGERY DENSITY ENGINE
// ==========================================
export interface SensoryDensityReport {
  densityScorePer100Words: number; // e.g. 4.2 sensory terms per 100 words
  overallGrade: 'Visceral & Grounded' | 'Balanced Physicality' | 'Visual Leaning' | 'Sensory Desert (White Room)';
  distribution: {
    visual: number; // percentage of sensory references
    auditory: number;
    tactile: number;
    olfactory: number;
    gustatory: number;
    kinesthetic: number;
  };
  rawCounts: {
    visual: number;
    auditory: number;
    tactile: number;
    olfactory: number;
    gustatory: number;
    kinesthetic: number;
  };
  detectedKeywords: Record<'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory' | 'kinesthetic', string[]>;
  whiteRoomParagraphs: Array<{
    paragraphIndex: number;
    textSnippet: string;
    wordCount: number;
    warning: string;
  }>;
  balanceRecommendations: string[];
}

const SENSORY_DICTIONARY = {
  visual: [
    'shimmer', 'silhouette', 'gleam', 'crimson', 'shadow', 'squint', 'iridescent',
    'gloom', 'dazzling', 'amber', 'obsidian', 'neon', 'stark', 'murky', 'glimmer',
    'flicker', 'blaze', 'pallid', 'scarlet', 'gilded', 'luster', 'azure', 'ashen',
    'opaque', 'translucent', 'glow', 'flash', 'glare', 'dull', 'vivid', 'bleached',
  ],
  auditory: [
    'clatter', 'rustle', 'thud', 'hum', 'chime', 'screech', 'whisper', 'crackle',
    'murmur', 'rasp', 'hiss', 'drone', 'rumble', 'click', 'clink', 'splash',
    'groan', 'screaming', 'wail', 'thump', 'creak', 'snap', 'boom', 'tinkling',
    'rattling', 'bellow', 'sputter', 'gurgle', 'muffled', 'deafening', 'reverberate',
  ],
  tactile: [
    'gritty', 'coarse', 'damp', 'icy', 'velvet', 'stinging', 'slick', 'clammy',
    'jagged', 'searing', 'numb', 'bristling', 'friction', 'rough', 'blistering',
    'humid', 'frost', 'prickle', 'scalding', 'gelid', 'greasy', 'tacky', 'abrasive',
    'silken', 'slimy', 'scratched', 'bruised', 'shivering', 'tepid', 'taut', 'leathery',
  ],
  olfactory: [
    'ozone', 'copper', 'pine', 'rot', 'musk', 'sulfur', 'charred', 'mildew',
    'brine', 'pungent', 'rancid', 'smoke', 'damp earth', 'iron', 'stale',
    'fragrant', 'acrid', 'incense', 'sage', 'cinnamon', 'decay', 'perfume',
    'musty', 'sweat', 'stench', 'cedar', 'petrichor', 'scorched', 'putrid',
  ],
  gustatory: [
    'bitter', 'metallic', 'sour', 'briny', 'sweet', 'astringent', 'tart', 'salty',
    'chalky', 'sickly', 'acidic', 'peppery', 'alkaline', 'tangy', 'savory',
    'cloying', 'acrid', 'pungent', 'syrupy', 'spicy', 'bland', 'burnt', 'yeasty',
  ],
  kinesthetic: [
    'knot in stomach', 'vertigo', 'racing pulse', 'lungs burning', 'nausea',
    'goosebumps', 'throat tight', 'hollow ribs', 'adrenaline', 'shudder',
    'heart thumping', 'dizziness', 'stomach dropped', 'short of breath',
    'temples throbbing', 'spine stiffened', 'legs leaden', 'trembling fingers',
  ],
};

export function analyzeSensoryDensity(text: string): SensoryDensityReport {
  if (!text || text.trim().length === 0) {
    return {
      densityScorePer100Words: 0,
      overallGrade: 'Sensory Desert (White Room)',
      distribution: { visual: 0, auditory: 0, tactile: 0, olfactory: 0, gustatory: 0, kinesthetic: 0 },
      rawCounts: { visual: 0, auditory: 0, tactile: 0, olfactory: 0, gustatory: 0, kinesthetic: 0 },
      detectedKeywords: { visual: [], auditory: [], tactile: [], olfactory: [], gustatory: [], kinesthetic: [] },
      whiteRoomParagraphs: [],
      balanceRecommendations: ['Draft scene text to evaluate sensory anchoring.'],
    };
  }

  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
  const totalWordCount = Math.max(1, words.length);
  const lowerText = text.toLowerCase();

  const detected: Record<'visual' | 'auditory' | 'tactile' | 'olfactory' | 'gustatory' | 'kinesthetic', string[]> = {
    visual: [],
    auditory: [],
    tactile: [],
    olfactory: [],
    gustatory: [],
    kinesthetic: [],
  };

  const rawCounts = { visual: 0, auditory: 0, tactile: 0, olfactory: 0, gustatory: 0, kinesthetic: 0 };

  (Object.keys(SENSORY_DICTIONARY) as Array<keyof typeof SENSORY_DICTIONARY>).forEach((sense) => {
    SENSORY_DICTIONARY[sense].forEach((term) => {
      // Regex word boundary
      const regex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        rawCounts[sense] += matches.length;
        if (!detected[sense].includes(term)) {
          detected[sense].push(term);
        }
      }
    });
  });

  const totalSensoryHits =
    rawCounts.visual +
    rawCounts.auditory +
    rawCounts.tactile +
    rawCounts.olfactory +
    rawCounts.gustatory +
    rawCounts.kinesthetic;

  const densityScorePer100Words = Math.round((totalSensoryHits / (totalWordCount / 100)) * 10) / 10;

  const totalSafeHits = Math.max(1, totalSensoryHits);
  const distribution = {
    visual: Math.round((rawCounts.visual / totalSafeHits) * 100),
    auditory: Math.round((rawCounts.auditory / totalSafeHits) * 100),
    tactile: Math.round((rawCounts.tactile / totalSafeHits) * 100),
    olfactory: Math.round((rawCounts.olfactory / totalSafeHits) * 100),
    gustatory: Math.round((rawCounts.gustatory / totalSafeHits) * 100),
    kinesthetic: Math.round((rawCounts.kinesthetic / totalSafeHits) * 100),
  };

  let overallGrade: SensoryDensityReport['overallGrade'] = 'Balanced Physicality';
  if (densityScorePer100Words >= 4.5 && distribution.visual < 65) {
    overallGrade = 'Visceral & Grounded';
  } else if (distribution.visual >= 75) {
    overallGrade = 'Visual Leaning';
  } else if (densityScorePer100Words < 1.2) {
    overallGrade = 'Sensory Desert (White Room)';
  }

  // Scan paragraphs for White Room Syndrome (passages with > 45 words and 0 sensory anchors)
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0);
  const whiteRoomParagraphs: SensoryDensityReport['whiteRoomParagraphs'] = [];

  paragraphs.forEach((p, idx) => {
    const pWords = p.split(/\s+/).length;
    if (pWords >= 45) {
      const pLower = p.toLowerCase();
      let hasSensory = false;
      for (const senseList of Object.values(SENSORY_DICTIONARY)) {
        for (const term of senseList) {
          if (pLower.includes(term)) {
            hasSensory = true;
            break;
          }
        }
        if (hasSensory) break;
      }

      if (!hasSensory) {
        whiteRoomParagraphs.push({
          paragraphIndex: idx + 1,
          textSnippet: p.slice(0, 140) + (p.length > 140 ? '...' : ''),
          wordCount: pWords,
          warning: 'Zero sensory anchoring detected. The reader cannot feel the physical texture, hear background acoustics, or smell the room.',
        });
      }
    }
  });

  const balanceRecommendations: string[] = [];
  if (distribution.visual >= 70) {
    balanceRecommendations.push('Heavily reliant on sight cues. Infuse olfactory (scent) or tactile (surface grit, temperature, fabric friction) details.');
  }
  if (distribution.olfactory === 0 && totalWordCount > 200) {
    balanceRecommendations.push('Smell is the sense most deeply linked to reader memory. Introduce a background scent (ozone, old paper, damp brick).');
  }
  if (distribution.tactile < 10 && totalWordCount > 200) {
    balanceRecommendations.push('Low tactile feedback. Give characters something to touch, hold, or physically recoil against.');
  }
  if (whiteRoomParagraphs.length > 0) {
    balanceRecommendations.push(`${whiteRoomParagraphs.length} paragraphs trigger "White Room Syndrome" warnings.`);
  }
  if (balanceRecommendations.length === 0) {
    balanceRecommendations.push('Exemplary sensory immersion! The prose balances visual, tactile, and auditory feedback to produce deep physical presence.');
  }

  return {
    densityScorePer100Words,
    overallGrade,
    distribution,
    rawCounts,
    detectedKeywords: detected,
    whiteRoomParagraphs,
    balanceRecommendations,
  };
}

// ==========================================
// 4. DIALOGUE CLICHÉ RADAR FOR CHARACTERS
// ==========================================
export interface DialogueClicheMatch {
  id: string;
  quote: string;
  speaker: string;
  characterId?: string;
  clichePhrase: string;
  category: 'Hollywood Trope' | 'Melodrama Villain' | 'Exposition Dump' | 'Deadweight Filler' | 'Melodramatic Tag';
  severity: 'High' | 'Medium' | 'Low';
  humanizedAlternative: string;
  chapterNumber: number;
  sceneTitle: string;
}

export interface CharacterClicheScore {
  characterId: string;
  name: string;
  role: string;
  totalDialogueLines: number;
  clicheLinesCount: number;
  vulnerabilityPercentage: number;
  topOffendingCategory: string;
}

export interface DialogueClicheReport {
  totalDialogueLines: number;
  flaggedClicheCount: number;
  clichePercentage: number;
  characterScores: CharacterClicheScore[];
  flaggedLines: DialogueClicheMatch[];
  categoryBreakdown: Record<string, number>;
}

const DIALOGUE_CLICHE_DATABASE = [
  // 1. Hollywood Trope
  { phrase: "we've got company", category: 'Hollywood Trope', severity: 'High', alternative: 'Spot an arrival with a physical cue: "Headlights coming up the gravel." or "Footsteps outside."' },
  { phrase: 'we have company', category: 'Hollywood Trope', severity: 'High', alternative: 'Direct alert: "Someone just cut the backyard gate."' },
  { phrase: 'not on my watch', category: 'Hollywood Trope', severity: 'High', alternative: 'Ground in character resolve: "You won\'t touch him while I\'m drawing breath."' },
  { phrase: "don't you die on me", category: 'Hollywood Trope', severity: 'High', alternative: 'Visceral desperation: "Keep your eyes open, look at me, stay with my voice."' },
  { phrase: 'is that all you got', category: 'Hollywood Trope', severity: 'High', alternative: 'Spit blood or sneer: "You hit like a tired clerk."' },
  { phrase: "we're not so different", category: 'Hollywood Trope', severity: 'High', alternative: 'Pinpoint specific moral hypocrisy rather than sweeping generalization.' },
  { phrase: 'need a hand', category: 'Hollywood Trope', severity: 'Low', alternative: 'Direct physical assist without greeting.' },
  { phrase: 'hold the phone', category: 'Hollywood Trope', severity: 'Medium', alternative: 'Abrupt pause: "Wait." or "Say that again."' },

  // 2. Melodrama Villain
  { phrase: "you'll regret this", category: 'Melodrama Villain', severity: 'High', alternative: 'Cold specificity: "Remember my face when the water gets shut off."' },
  { phrase: 'mark my words', category: 'Melodrama Villain', severity: 'High', alternative: 'Drop the prologue: give the grim prediction directly.' },
  { phrase: 'over my dead body', category: 'Melodrama Villain', severity: 'High', alternative: 'Concrete refusal: "Then break my arm, because I\'m not opening that latch."' },
  { phrase: "you just don't get it", category: 'Melodrama Villain', severity: 'High', alternative: 'Reveal the blind spot: "You think this is about money? It\'s about who stays buried."' },
  { phrase: 'if you lay a finger on', category: 'Melodrama Villain', severity: 'Medium', alternative: 'Cold ultimatum: "Touch her, and we finish this right now."' },
  { phrase: 'it was you all along', category: 'Melodrama Villain', severity: 'High', alternative: 'Focus on the concrete betrayal: "You had the keys the entire night."' },
  { phrase: "it's not what it looks like", category: 'Melodrama Villain', severity: 'High', alternative: 'Immediate stammer or blunt confession instead of cliché deflection.' },

  // 3. Exposition Dump ("As you know, Bob")
  { phrase: 'as you already know', category: 'Exposition Dump', severity: 'High', alternative: 'Cut the phrase entirely. Characters never tell each other things they both know.' },
  { phrase: 'as you know', category: 'Exposition Dump', severity: 'High', alternative: 'Never spoon-feed the reader through artificial dialogue.' },
  { phrase: 'in plain english', category: 'Exposition Dump', severity: 'Medium', alternative: 'Impatient reaction: "Cut the jargon, what broke?"' },
  { phrase: 'in english please', category: 'Exposition Dump', severity: 'High', alternative: '"Speak so a normal person understands."' },
  { phrase: 'explain it like i', category: 'Exposition Dump', severity: 'Medium', alternative: 'Ask for the bottom line directly.' },
  { phrase: 'need i remind you', category: 'Exposition Dump', severity: 'Medium', alternative: 'Reference the memory with visceral immediacy.' },
  { phrase: 'to make a long story short', category: 'Exposition Dump', severity: 'Low', alternative: '"The short version: ..."' },

  // 4. Deadweight Filler
  { phrase: 'at the end of the day', category: 'Deadweight Filler', severity: 'Medium', alternative: 'Strike the filler: State the consequence directly.' },
  { phrase: 'believe you me', category: 'Deadweight Filler', severity: 'Medium', alternative: 'Drop archaic rhetorical crutch.' },
  { phrase: 'truth be told', category: 'Deadweight Filler', severity: 'Medium', alternative: 'Speak the truth without the self-conscious disclaimer.' },
  { phrase: 'when all is said and done', category: 'Deadweight Filler', severity: 'Medium', alternative: 'Get straight to the conclusion.' },
  { phrase: 'with all due respect', category: 'Deadweight Filler', severity: 'Low', alternative: 'Deliver the disagreement with cold courtesy.' },
  { phrase: 'let me tell you something', category: 'Deadweight Filler', severity: 'Low', alternative: 'Cut the windup and punch the point.' },
] as const;

export function analyzeDialogueCliches(
  chapters: Chapter[],
  characters: Character[]
): DialogueClicheReport {
  const flaggedLines: DialogueClicheMatch[] = [];
  let totalDialogueLines = 0;

  const charLineCounts: Record<string, { total: number; cliches: number; name: string; role: string }> = {};

  characters.forEach((c) => {
    charLineCounts[c.id] = { total: 0, cliches: 0, name: c.name, role: c.role };
  });
  charLineCounts['unknown'] = { total: 0, cliches: 0, name: 'Narrator / Unassigned', role: 'Minor' };

  chapters.forEach((chap) => {
    chap.scenes.forEach((sc) => {
      const text = sc.content || '';
      const regex = /["“]([^"”]+)["”]/g;
      let match;
      let lineIdx = 0;

      while ((match = regex.exec(text)) !== null) {
        totalDialogueLines++;
        const quote = match[1].trim();
        if (quote.length < 3) continue;

        // Determine speaker attribution
        let speaker = 'Narrator / Speaker';
        let charId = 'unknown';

        const startIdx = Math.max(0, match.index - 60);
        const endIdx = Math.min(text.length, match.index + match[0].length + 60);
        const context = text.slice(startIdx, endIdx).toLowerCase();

        for (const c of characters) {
          const firstName = c.name.split(' ')[0].toLowerCase();
          const lastName = c.name.split(' ').slice(-1)[0].toLowerCase();
          if (context.includes(firstName) || context.includes(lastName)) {
            speaker = c.name;
            charId = c.id;
            break;
          }
        }

        if (charLineCounts[charId]) {
          charLineCounts[charId].total++;
        }

        // Check for dialogue clichés
        const lowerQuote = quote.toLowerCase();
        for (const dbItem of DIALOGUE_CLICHE_DATABASE) {
          if (lowerQuote.includes(dbItem.phrase)) {
            if (charLineCounts[charId]) {
              charLineCounts[charId].cliches++;
            }

            flaggedLines.push({
              id: `cliche-${chap.id}-${sc.id}-${lineIdx++}`,
              quote,
              speaker,
              characterId: charId !== 'unknown' ? charId : undefined,
              clichePhrase: dbItem.phrase,
              category: dbItem.category as any,
              severity: dbItem.severity as any,
              humanizedAlternative: dbItem.alternative,
              chapterNumber: chap.number,
              sceneTitle: sc.title,
            });
            break; // flag once per quote
          }
        }
      }
    });
  });

  const categoryBreakdown: Record<string, number> = {
    'Hollywood Trope': 0,
    'Melodrama Villain': 0,
    'Exposition Dump': 0,
    'Deadweight Filler': 0,
  };

  flaggedLines.forEach((l) => {
    categoryBreakdown[l.category] = (categoryBreakdown[l.category] || 0) + 1;
  });

  const characterScores: CharacterClicheScore[] = Object.entries(charLineCounts)
    .filter(([_, data]) => data.total > 0)
    .map(([id, data]) => {
      const vuln = Math.round((data.cliches / Math.max(1, data.total)) * 100);
      return {
        characterId: id,
        name: data.name,
        role: data.role,
        totalDialogueLines: data.total,
        clicheLinesCount: data.cliches,
        vulnerabilityPercentage: vuln,
        topOffendingCategory: 'Hollywood Trope',
      };
    })
    .sort((a, b) => b.vulnerabilityPercentage - a.vulnerabilityPercentage);

  const safeTotal = Math.max(1, totalDialogueLines);
  const clichePercentage = Math.round((flaggedLines.length / safeTotal) * 100);

  return {
    totalDialogueLines,
    flaggedClicheCount: flaggedLines.length,
    clichePercentage,
    characterScores,
    flaggedLines,
    categoryBreakdown,
  };
}
