import { EmotionThesaurusEntry } from '../types';

export const EMOTION_THESAURUS_ENTRIES: EmotionThesaurusEntry[] = [
  {
    emotion: 'Terror & Existential Dread',
    category: 'Fear & Dread',
    physicalSensations: [
      'Sudden dropping sensation in the sternum, like an elevator snapping its cable',
      'Cold, oily sweat at the hairline; numbness spreading to fingertips',
      'Constriction of the larynx—breath entering as a sharp, dry rasp',
      'Fine micro-tremor in the quadriceps; knees threatening to buckle',
      'Auditory tunneling: ambient noise fades into a high, thin harmonic ringing',
    ],
    involuntaryExpressions: [
      'Eyes widening until the sclera shows above the iris',
      'Swallowing repeatedly against a dry palate',
      'Shoulders drawing up and inward as if bracing for a physical blow',
      'Nostrils flaring slightly with rapid, shallow chest breaths',
      'Fingers clutching involuntarily at seams of clothing or nearby surfaces',
    ],
    vocalShifts: [
      'Voice drops an octave or fractures into an aspirated whisper',
      'Words clipped into staccato monosyllables',
      'Trailing off mid-sentence as attention is hijacked by threat cues',
    ],
    sensoryPerceptions: [
      'Shadows appear to lengthen and shift; peripheral motion exaggerated',
      'Heightened smell of ozone, iron, or stagnant dust',
      'Tactile sensitivity spiked: clothing feels abrasive against skin',
    ],
    mentalProcessing: [
      'Hyper-fixation on escape vectors and structural exits',
      'Racing thoughts alternating with sudden, paralyzing mental blanks',
      'Inability to process non-immediate sensory information',
    ],
    clicheToAvoid: '"A chill ran down his spine" / "Her blood ran cold" / "He was terrified"',
    sampleHumanRewrite:
      'The air went thin in his throat. Julian reached for the doorframe, his palm slipping on cold condensation before his knuckles locked into the splintered pine.',
  },
  {
    emotion: 'Suppressed Rage & Cold Fury',
    category: 'Anger & Defiance',
    physicalSensations: [
      'Heat crawling up the back of the neck and pulsing in the temporal arteries',
      'Pressure behind the eyes; jaw aching from clenched molars',
      'Fists clenching so hard nails leave crescent indentations in the palms',
      'Stomach tight as a drum; deliberate, unnervingly slow breathing',
    ],
    involuntaryExpressions: [
      'Deadpan, unblinking stare with lowered brow',
      'Lips pressed into a pale, bloodless horizontal slit',
      'Head tilting slightly to one side, tracking the speaker with predatory stillness',
      'Subtle tightening around the corners of the mouth',
    ],
    vocalShifts: [
      'Voice lowers in volume; dangerously polite and articulated with surgical precision',
      'Sentences shorten; zero vocal inflection or warmth',
      'Deliberate pauses between clauses, forcing the listener to wait',
    ],
    sensoryPerceptions: [
      'Visual focus sharpens onto the antagonist’s vulnerable spots',
      'Background sounds register as irritating friction',
    ],
    mentalProcessing: [
      'Calculating consequences before acting; cold strategic appraisal',
      'Cataloging past grievances to justify immediate retaliation',
    ],
    clicheToAvoid: '"Steam came out of his ears" / "She saw red" / "He was furious"',
    sampleHumanRewrite:
      'Martha set the teacup down without a sound. Her jawline was carved from slate, and when she looked up, her gaze didn’t blink—she merely let the silence pool between them like spilled kerosene.',
  },
  {
    emotion: 'Visceral Grief & Acute Loss',
    category: 'Grief & Longing',
    physicalSensations: [
      'Heavy, leaden ache centered in the chest, making inhalation feel burdensome',
      'Dry, burning sensation behind the eyelids and in the sinuses',
      'Sudden hollow nausea in the solar plexus, as if internal organs have dissolved',
      'Exhaustion sinking deep into bone marrow; limbs feeling twice their normal weight',
    ],
    involuntaryExpressions: [
      'Gaze fixed on middle distance; unfocused staring through objects',
      'Rubbing chest over sternum as if trying to massage an internal bruise',
      'Shoulders rounding forward into a protective curl',
      'Quiver in the chin caught and clamped down by biting the inner cheek',
    ],
    vocalShifts: [
      'Rough, hoarse tone from disuse or swallowed sobs',
      'Flat, monotone cadence; absence of dynamic range',
      'Hesitation before replying, as though speech requires translating from an alien language',
    ],
    sensoryPerceptions: [
      'Familiar scents (perfume, tobacco, laundry soap) trigger instant physiological ache',
      'Sunlight feels intrusive and inappropriately loud',
    ],
    mentalProcessing: [
      'Replaying the final encounter in looping, obsessive variations of "what if"',
      'Temporary amnesia followed by the crushing recurring realization: "they are gone"',
    ],
    clicheToAvoid: '"A tear rolled down her cheek" / "His heart shattered into a million pieces"',
    sampleHumanRewrite:
      'Julian pressed his thumb into the mason mark in the mortar. The lime was sixty years cold, but the curve of Clara’s cursive felt like touching a pulse through wet silk.',
  },
  {
    emotion: 'Obsessive Awe & Cosmic Wonder',
    category: 'Obsession & Awe',
    physicalSensations: [
      'Dilation of the chest; involuntary sharp intake of breath',
      'Hair rising on the forearms and nape of the neck',
      'Vertigo or grounding sensation where the earth feels vast and shifting',
      'Forgetfulness of physical discomfort (cold, hunger, fatigue)',
    ],
    involuntaryExpressions: [
      'Mouth slightly parted; slackened lower jaw',
      'Eyes tracking vast geometry or minute detail without shifting position',
      'Reaching out a hand hesitantly before catching oneself',
    ],
    vocalShifts: [
      'Breathless, hushed whisper; afraid that normal speech will break the spell',
      'Pauses filled with soft inhalations',
    ],
    sensoryPerceptions: [
      'Colors appear more saturated; light feels crystalline and textured',
      'Acoustics carry resonance, sound seeming to reverberate within the bones',
    ],
    mentalProcessing: [
      'Ego dissolves; observer feels minuscule yet profoundly interconnected',
      'Urge to catalog, memorize, and surrender to the spectacle',
    ],
    clicheToAvoid: '"It was breathtaking" / "Words could not describe the beauty"',
    sampleHumanRewrite:
      'The dusk light struck the salt-tempered glass at fifty-four degrees. Not a single pane reflected the ocean; instead, seven distinct corridors of green harbor water opened through the ceiling, humming in harmonic fifths.',
  },
  {
    emotion: 'Paranoia & Escalating Suspicion',
    category: 'Fear & Dread',
    physicalSensations: [
      'Itch between shoulder blades, as if an invisible crosshair is aimed there',
      'Stomach unsettled; food feels heavy and unswallowable',
      'Rapid darting eye movements; dry mouth and heightened startle reflex',
      'Shallow breathing through nose to hear surrounding floorboards creak',
    ],
    involuntaryExpressions: [
      'Glancing over shoulders or checking mirrors repeatedly',
      'Keeping back against walls; angling body toward room exits',
      'Fidgeting with locks, keys, or concealed items',
    ],
    vocalShifts: [
      'Muffled, guarded whispers; probing questions disguised as casual banter',
      'Suspecting double meanings in ordinary greetings',
    ],
    sensoryPerceptions: [
      'Every floorboard settling sounds like an approaching footstep',
      'Peripheral shadows mistaken for crouching observers',
    ],
    mentalProcessing: [
      'Connecting disparate coincidences into a coordinated conspiracy',
      'Second-guessing allies’ motives; isolating oneself to prevent betrayal',
    ],
    clicheToAvoid: '"He looked over his shoulder nervously" / "She felt watched"',
    sampleHumanRewrite:
      'Julian counted four seconds between the wind gusts. On the third beat, the latch on the pantry didn’t rattle with the draft—it clicked from the inside.',
  },
  {
    emotion: 'Guilt & Gnawing Remorse',
    category: 'Guilt & Shame',
    physicalSensations: [
      'Acid burning in the throat; persistent sour taste on tongue',
      'Weight pressing on top of skull, forcing posture downward',
      'Inability to make sustained eye contact without physical flinching',
      'Compulsive checking of hands or clothing for phantom stains',
    ],
    involuntaryExpressions: [
      'Eyes shifting downward to floors or hands',
      'Fingers picking at cuticles or twisting rings nervously',
      'Shielding face or throat with a hand during conversation',
    ],
    vocalShifts: [
      'Quick, placating agreements to avoid conflict',
      'Voice wavering on definitive statements; over-qualifying statements',
    ],
    sensoryPerceptions: [
      'Praise feels like an accusation; laughter in nearby rooms assumed to be mocking',
    ],
    mentalProcessing: [
      'Self-flagellation: convinced that any misfortune is earned punishment',
      'Yearning for confession combined with terror of exposure',
    ],
    clicheToAvoid: '"He was consumed by guilt" / "Her conscience ate away at her"',
    sampleHumanRewrite:
      'When Martha spoke Clara’s name, Julian’s fork struck the porcelain rim with a sharp ring. He pulled his hands from the table and buried them in his wool pockets, where the silver telegram he never sent still sat folded into fourths.',
  },
];
