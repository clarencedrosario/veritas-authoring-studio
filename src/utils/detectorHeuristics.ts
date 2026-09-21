import { AIDetectorReport } from '../types';

const BANNED_AI_CLICHES = [
  { phrase: 'rich tapestry', reason: 'Common synthetic metaphor flagged by detectors' },
  { phrase: 'testament to', reason: 'High-frequency AI cliché' },
  { phrase: 'delve into', reason: 'Overused AI transitional phrasing' },
  { phrase: 'delve', reason: 'Statistical outlier marker in synthetic text' },
  { phrase: 'intertwined', reason: 'Repetitive poetic abstraction' },
  { phrase: 'palpable tension', reason: 'Formulaic sensory shortcut' },
  { phrase: 'furthermore', reason: 'Academic transition unnatural in organic novel dialogue' },
  { phrase: 'moreover', reason: 'Formal expository signpost rarely found in modern fiction' },
  { phrase: 'little did they know', reason: 'Archaic melodramatic cliché' },
  { phrase: 'a symphony of', reason: 'Sterile AI descriptive trope' },
  { phrase: 'navigating the complexities', reason: 'Corporate/analytical phrasing in narrative' },
  { phrase: 'in the quiet corners', reason: 'Overused lyrical filler' },
  { phrase: 'steeped in', reason: 'Predictable figurative cliché' },
  { phrase: 'beacon of hope', reason: 'Generic sentimental abstraction' },
];

export function analyzeProseLocally(text: string): AIDetectorReport {
  if (!text || text.trim().length === 0) {
    return {
      humanProbability: 85,
      burstinessScore: 70,
      perplexityGrade: 'Natural Human',
      avgSentenceLength: 0,
      sentenceLengthVariance: 0,
      sentenceLengthDistribution: [
        { range: '1-6 words', count: 0 },
        { range: '7-15 words', count: 0 },
        { range: '16-28 words', count: 0 },
        { range: '29+ words', count: 0 },
      ],
      pacingAssessment: 'No text entered yet. Start drafting to see real-time pacing diagnostics.',
      flaggedSegments: [],
      recommendations: ['Begin writing your scene to see live burstiness and cadence metrics.'],
    };
  }

  // Split into sentences using punctuation boundaries
  const rawSentences = text
    .replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|')
    .split('|')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentenceLengths = rawSentences.map((s) => {
    const words = s.split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  });

  const totalWords = sentenceLengths.reduce((a, b) => a + b, 0);
  const avgSentenceLength = rawSentences.length > 0 ? Math.round((totalWords / rawSentences.length) * 10) / 10 : 0;

  // Calculate sentence variance & standard deviation (Burstiness)
  const variance =
    rawSentences.length > 1
      ? sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgSentenceLength, 2), 0) / rawSentences.length
      : 0;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation (CV) is standard measure of burstiness
  const cv = avgSentenceLength > 0 ? stdDev / avgSentenceLength : 0;
  // Human writing typically has a CV between 0.65 and 1.3, whereas AI text clusters around 0.25 to 0.45 (monotonous length)
  let burstinessScore = Math.min(100, Math.round(cv * 85));
  if (sentenceLengths.length < 3) burstinessScore = 70; // small sample fallback

  // Sentence distribution brackets
  const dist = [
    { range: '1-6 words (Punchy)', count: sentenceLengths.filter((l) => l <= 6).length },
    { range: '7-15 words (Brisk)', count: sentenceLengths.filter((l) => l >= 7 && l <= 15).length },
    { range: '16-28 words (Cadenced)', count: sentenceLengths.filter((l) => l >= 16 && l <= 28).length },
    { range: '29+ words (Expansive)', count: sentenceLengths.filter((l) => l >= 29).length },
  ];

  // Scan for AI clichés
  const lowerText = text.toLowerCase();
  const flaggedSegments: Array<{ text: string; reason: string; humanizedAlternative: string }> = [];

  for (const item of BANNED_AI_CLICHES) {
    if (lowerText.includes(item.phrase)) {
      flaggedSegments.push({
        text: item.phrase,
        reason: item.reason,
        humanizedAlternative: getSuggestedAlternative(item.phrase),
      });
    }
  }

  // Check for uniform repetitive starters (e.g., He said, He walked, He saw)
  const starters = rawSentences.map((s) => s.split(' ')[0]?.toLowerCase() || '');
  let starterRepetitionPenalty = 0;
  if (starters.length >= 4) {
    for (let i = 1; i < starters.length; i++) {
      if (starters[i] && starters[i] === starters[i - 1] && ['the', 'he', 'she', 'it', 'they'].includes(starters[i])) {
        starterRepetitionPenalty += 5;
      }
    }
  }

  // Calculate Overall Human Probability
  // Factors: Burstiness (+), Length variety (+), Cliches (-), Starter monotony (-)
  let humanProbability = 72;
  // Reward healthy burstiness
  if (burstinessScore > 65) humanProbability += 15;
  else if (burstinessScore > 50) humanProbability += 8;
  else humanProbability -= 12;

  // Penalize clichés
  humanProbability -= flaggedSegments.length * 8;
  // Penalize monotonous starters
  humanProbability -= Math.min(15, starterRepetitionPenalty);

  // Bound between 18 and 99
  humanProbability = Math.max(22, Math.min(99, Math.round(humanProbability)));

  let perplexityGrade: 'Low' | 'Moderate' | 'High' | 'Natural Human' = 'Natural Human';
  if (humanProbability < 50) perplexityGrade = 'Low';
  else if (humanProbability < 70) perplexityGrade = 'Moderate';
  else if (humanProbability < 85) perplexityGrade = 'High';
  else perplexityGrade = 'Natural Human';

  // Recommendations
  const recommendations: string[] = [];
  if (burstinessScore < 55) {
    recommendations.push('Inject stark sentence length contrast: mix 3-word punches with longer rolling clauses.');
  }
  if (dist[0].count === 0 && rawSentences.length > 4) {
    recommendations.push('Add short sentence fragments or abrupt dialogue beats to break predictable cadence.');
  }
  if (flaggedSegments.length > 0) {
    recommendations.push(`Eliminate flagged synthetic tropes like "${flaggedSegments[0].text}" with tactile sensory details.`);
  }
  if (recommendations.length === 0) {
    recommendations.push('Superb rhythmic cadence! The sentence variety and lack of synthetic tropes mimic authentic human craftsmanship.');
  }

  let pacingAssessment = `Sentence lengths average ${avgSentenceLength} words with a burstiness score of ${burstinessScore}/100. `;
  if (burstinessScore > 65) {
    pacingAssessment += 'Rhythm displays strong organic elasticity with varied breathing stops.';
  } else {
    pacingAssessment += 'Rhythm leans uniform. Introduce sharp staccato clauses to disrupt synthetic flow.';
  }

  return {
    humanProbability,
    burstinessScore,
    perplexityGrade,
    avgSentenceLength,
    sentenceLengthVariance: Math.round(variance * 10) / 10,
    sentenceLengthDistribution: dist,
    pacingAssessment,
    flaggedSegments,
    recommendations,
  };
}

function getSuggestedAlternative(phrase: string): string {
  switch (phrase) {
    case 'rich tapestry':
      return 'a tangle of competing histories / raw knot of details';
    case 'testament to':
      return 'living proof of / scars showing';
    case 'delve':
    case 'delve into':
      return 'cut straight to / sift through / examine';
    case 'palpable tension':
      return 'stiff shoulders and tight jaws / silence heavy enough to bruise';
    case 'moreover':
    case 'furthermore':
      return 'and yet / besides / worse still';
    case 'a symphony of':
      return 'a racket of / discordant blare of';
    case 'intertwined':
      return 'braided / snagged together';
    default:
      return 'ground in a concrete physical action or sensory detail';
  }
}
