import { BookArchitectureConfig } from './components/book-planner/architecture/types';
export type { BookArchitectureConfig };
export * from './components/book-planner/architecture/types';
import { VisualRecord } from './types/visualStudio';
export * from './types/visualStudio';

export type RoleType = 'owner' | 'co-author' | 'editor' | 'beta-reader';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  online: boolean;
  lastActive: string;
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  role: 'Protagonist' | 'Antagonist' | 'Deuteragonist' | 'Supporting' | 'Minor';
  archetype: string;
  age?: string;
  appearance: string;
  personality: string;
  internalGoal: string;
  externalConflict: string;
  flaw: string;
  voiceNotes: string; // Specific cadence, vocabulary, catchphrases
  portraitUrl?: string;
  relationships?: string[];
}

export interface PlotBeat {
  id: string;
  act: 'Act I (Beginning)' | 'Act II (Middle)' | 'Act III (Climax & Resolution)';
  title: string;
  beatType: 'Hook' | 'Inciting Incident' | 'First Plot Point' | 'Midpoint' | 'All Hope Lost' | 'Climax' | 'Resolution' | 'Custom';
  description: string;
  tensionLevel: number; // 1 to 10
  status: 'Planned' | 'Drafted' | 'Revised';
  linkedChapterId?: string;
  notes?: string;
}

export interface Scene {
  id: string;
  title: string;
  povCharacterId?: string;
  sceneGoal: string;
  conflict: string;
  outcome: string;
  content: string;
  wordCount: number;
  status: 'Draft' | 'In Revision' | 'Final';
  lastModified: string;
  updatedAt?: string;
  location?: string;
  timePeriod?: string;
  notes?: string;
  characterIds?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  scenes: Scene[];
  targetWordCount: number;
  status: 'Draft' | 'In Revision' | 'Final';
}

export interface AuthorVoiceProfile {
  id?: string;
  name?: string;
  description?: string;
  proseDensity: 'Sparse' | 'Balanced' | 'Dense' | 'Ornate & Layered';
  sentenceRhythm: 'Staccato & Punchy' | 'Varied & Syncopated' | 'Rolling & Lyrical' | 'Balanced Classical';
  dialogueStyle: 'Naturalistic & Indirect' | 'Sharp & Witty' | 'Poetic & Subtextual' | 'Period / Formal';
  descriptionLevel: 'Minimalist Focus' | 'Selective Anchors' | 'Rich & Atmospheric' | 'Immersive Tapestry';
  vocabularyLevel: 'Accessible & Direct' | 'Contemporary Literary' | 'Elevated & Nuanced' | 'Archaic / Stylized';
  narrativeDistance: 'Deep Close POV' | 'Moderate Intimate' | 'Cinematic Third' | 'Panoramic Omniscient';
  preferredPov: 'First Person' | 'Third Person Limited' | 'Third Person Omniscient' | 'Second Person';
  tone: string;
  pacing: 'Brisk & Urgent' | 'Measured & Deliberate' | 'Slow-Burn Tension' | 'Episodic Rhythms';
  recurringPreferences: string[];
  antiClichés?: string[];
  customVoiceNotes?: string;
}

export type NovelAIActionType =
  | 'continue'
  | 'draft_scene'
  | 'rewrite'
  | 'expand'
  | 'shorten'
  | 'improve_description'
  | 'deepen_sensory'
  | 'improve_dialogue'
  | 'dialogue_polish'
  | 'character_voice'
  | 'increase_tension'
  | 'reduce_tension'
  | 'decompress_tension'
  | 'tighten_scene'
  | 'expand_scene'
  | 'improve_pacing'
  | 'vary_pacing'
  | 'show_not_tell'
  | 'strengthen_opening'
  | 'strengthen_ending'
  | 'scene_alternatives'
  | 'check_pov'
  | 'check_character'
  | 'check_timeline'
  | 'suggest_plot'
  | 'humanize'
  | 'critique'
  | 'continuity'
  | 'research';

export interface NovelContinuityContext {
  previousSceneSnippet?: string;
  previousSceneSummary?: string;
  activePovName?: string;
  charactersInScene?: string[];
  openPlotThreads?: string[];
  tensionLevel?: string | number;
  activePovCharacter?: {
    name: string;
    role?: string;
    voiceNotes?: string;
    personality?: string;
    flaws?: string;
  };
  activeCharacters?: Array<{
    name: string;
    role?: string;
    personality?: string;
    voiceNotes?: string;
  }>;
  location?: string;
  timePeriod?: string;
  timelineMilestone?: string;
  sceneGoal?: string;
  sceneConflict?: string;
  sceneOutcome?: string;
  unresolvedThreads?: string[];
  plotArc?: string;
}

// ==========================================
// CONTENT WRITING STUDIO DOMAIN TYPES
// ==========================================
export type ContentType = 'article' | 'essay' | 'whitepaper' | 'blog_post' | 'thought_leadership' | 'case_study';

export interface ContentOutlineSection {
  id: string;
  title: string;
  keyPoints: string[];
  estimatedWords: number;
}

export interface ContentDocument {
  id: string;
  title: string;
  subtitle: string;
  contentType: ContentType;
  targetAudience: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'Informational' | 'Commercial' | 'Educational' | 'Inspirational';
  thesisStatement: string;
  outline: ContentOutlineSection[];
  bodyContent: string;
  callToAction: string;
  targetWordCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  status: 'Draft' | 'In Review' | 'Polished' | 'Published';
  tags: string[];
  updatedAt: string;
}

export interface ContentWritingProject {
  id: string;
  title: string;
  authorName: string;
  brandOrPublication: string;
  editorialGuidelines: string;
  documents: ContentDocument[];
  activeDocumentId: string;
}

// ==========================================
// FILM & SCRIPT STUDIO DOMAIN TYPES
// ==========================================
export type ScriptElementType =
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition'
  | 'shot';

export interface ScriptElement {
  id: string;
  type: ScriptElementType;
  text: string;
}

export interface ScriptScene {
  id: string;
  sceneNumber: number;
  heading: string; // e.g. "INT. HIGHCLERE CONSERVATORY - NIGHT"
  intExt: 'INT.' | 'EXT.' | 'INT./EXT.';
  setting: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN' | 'CONTINUOUS' | 'LATER';
  synopsis: string;
  charactersPresent: string[];
  pageLengthEstimated: number;
  elements: ScriptElement[];
}

export interface ScriptProject {
  id: string;
  title: string;
  format: 'Feature Film (Screenplay)' | 'TV Pilot (60 Min)' | 'TV Half-Hour' | 'Short Film' | 'Stage Play';
  logline: string;
  screenwriter: string;
  basedOnSource?: string;
  actStructure: '3-Act Structure' | '5-Act Structure' | 'TV 4-Act + Teaser';
  characters: Array<{
    id: string;
    name: string;
    description: string;
    dialogueNotes: string;
  }>;
  scenes: ScriptScene[];
  activeSceneId: string;
  targetPages: number;
}

export interface StylePersona {
  id: string;
  name: string;
  description: string;
  tone: string;
  burstinessLevel: 'Low' | 'Medium' | 'High' | 'Extreme Organic';
  sensoryLevel: 'Sparse' | 'Moderate' | 'Dense & Visceral';
  dialogueStyle: 'Crisp & Punchy' | 'Naturalistic & Overlapping' | 'Formal / Period' | 'Idiosyncratic';
  bannedWords: string[];
  pacingPreference?: string;
  sensoryDensity?: string;
  primaryTone?: string;
}

export interface VersionSnapshot {
  id: string;
  versionNumber: number;
  timestamp: string;
  title: string;
  author: string;
  wordCount: number;
  summaryNote: string;
  dataJson: string; // Encrypted or serialized snapshot
}

export interface EditorialComment {
  id: string;
  chapterId: string;
  sceneId: string;
  author: string;
  authorRole: RoleType;
  timestamp: string;
  quoteText?: string;
  comment: string;
  resolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface BookCoverDesign {
  title: string;
  subtitle: string;
  authorName: string;
  fontFamily: 'Cinzel' | 'EB Garamond' | 'Lora' | 'Plus Jakarta Sans';
  titleColor: string;
  accentColor: string;
  themeLayout: 'Classic Minimal' | 'Cinematic Drama' | 'Modern Bold' | 'Gothic Mystery' | 'Fantasy Epic';
  backgroundImageUrl?: string;
  spineWidth: number;
}

export interface NovelProject {
  id: string;
  title: string;
  subtitle: string;
  authorName: string;
  genre: string;
  logline: string;
  synopsis: string;
  targetTotalWords: number;
  dailyGoalWords: number;
  wordsWrittenToday: number;
  lastDailyResetDate: string;
  chapters: Chapter[];
  characters: Character[];
  plotBeats: PlotBeat[];
  stylePersona: StylePersona;
  authorVoiceProfile?: AuthorVoiceProfile;
  coverDesign: BookCoverDesign;
  team: TeamMember[];
  comments: EditorialComment[];
  auditLogs: AuditLogEntry[];
  versions: VersionSnapshot[];
  versionHistory?: any[];
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
  encryptionKeyId?: string;
  // Extended author suite modules
  codexEntries?: CodexEntry[];
  timelineEvents?: TimelineEvent[];
  characterRelationships?: CharacterRelationship[];
  queryPitch?: QueryLetterData;
  researchNotes?: ResearchNote[];
}

export interface ResearchNote {
  id: string;
  title: string;
  category: 'Historical' | 'Scientific & Technical' | 'Geographical' | 'Material & Sensory' | 'Literary Reference';
  content: string;
  sourceUrl?: string;
  tags: string[];
  linkedCharacterIds?: string[];
  linkedCodexIds?: string[];
  linkedChapterIds?: string[];
  linkedSceneIds?: string[];
  linkedPlotBeatIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type CodexCategory =
  | 'location'
  | 'faction'
  | 'magic_tech'
  | 'history'
  | 'relic'
  | 'culture';

export interface CodexEntry {
  id: string;
  title: string;
  category: CodexCategory;
  shortDescription: string;
  detailedLore: string;
  sensoryDetails: string; // sights, sounds, scents
  secrets: string; // hidden twists or plot-relevant reveals
  tags: string[];
  linkedCharacterIds?: string[];
  linkedChapterIds?: string[];
  imageUrl?: string;
  significance?: 'Core Narrative' | 'Subplot Lore' | 'Background Atmosphere';
}

export interface TimelineEvent {
  id: string;
  title: string;
  storyDate: string; // In-world date or epoch (e.g. "October 14, 1892" or "Year of the Salt Tide")
  storyOrder: number; // Chronological sequence index
  narrativeChapterId?: string; // Chapter where it is revealed/narrated
  isFlashback?: boolean;
  track: 'Main Quest' | 'Character Arc / Romance' | 'Antagonist Conspiracy' | 'Historical Lore';
  povCharacterId?: string;
  location?: string;
  summary: string;
  impactLevel: 'Low' | 'Medium' | 'High' | 'Catastrophic Climax';
}

export interface CharacterRelationship {
  id: string;
  sourceCharacterId: string;
  targetCharacterId: string;
  relationshipType: 'Allied' | 'Rival' | 'Romantic' | 'Family' | 'Mentor' | 'Betrayal' | 'Debt / Obligation' | 'Unresolved Tension';
  description: string;
  tensionScore: number; // 1 to 10
  evolutionChapter?: number; // Chapter index where relationship status changes
  status: 'Active' | 'Fractured' | 'Latent' | 'Reconciled';
  dynamics?: string;
}

export interface QueryLetterData {
  targetAgentName: string;
  agencyName: string;
  hook: string;
  genre: string;
  wordCount: number;
  compTitles: string; // e.g. "PIRANESI meets THE HAUNTING OF HILL HOUSE"
  protagonistIntro: string;
  incitingIncident: string;
  stakesAndChoice: string;
  authorBio: string;
  synopsisOnePage: string;
  synopsisFivePage: string;
}

export interface EmotionThesaurusEntry {
  emotion: string;
  category: 'Fear & Dread' | 'Anger & Defiance' | 'Grief & Longing' | 'Joy & Euphoria' | 'Surprise & Shock' | 'Guilt & Shame' | 'Obsession & Awe';
  physicalSensations: string[];
  involuntaryExpressions: string[];
  vocalShifts: string[];
  sensoryPerceptions: string[];
  mentalProcessing: string[];
  clicheToAvoid: string;
  sampleHumanRewrite: string;
}

export interface AIDetectorReport {
  humanProbability: number; // 0 - 100
  burstinessScore: number; // 0 - 100
  perplexityGrade: 'Low' | 'Moderate' | 'High' | 'Natural Human';
  avgSentenceLength: number;
  sentenceLengthVariance: number;
  sentenceLengthDistribution: { range: string; count: number }[];
  pacingAssessment: string;
  flaggedSegments: Array<{
    text: string;
    reason: string;
    humanizedAlternative: string;
  }>;
  recommendations: string[];
}

export type ExportFormat = 'docx' | 'markdown' | 'text' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeFrontMatter: boolean;
  includeCharacterDossiers: boolean;
  includePlotOutlines: boolean;
  includeEditorialNotes: boolean;
}

// -------------------------------------------------------------
// Grammar Book Series & Learning Management System (LMS) Types
// -------------------------------------------------------------

export type GrammarClassLevel =
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export type VeritasSeriesLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type DevelopmentalBandId =
  | 'foundation' // Levels 1–2
  | 'primary' // Levels 3–5
  | 'middle' // Levels 6–8
  | 'secondary' // Levels 9–10
  | 'senior_secondary'; // Levels 11–12

export interface DevelopmentalBand {
  id: DevelopmentalBandId;
  name: string;
  seriesLevels: VeritasSeriesLevel[];
  classLevels: GrammarClassLevel[];
  nominalAgeRange: string;
  description: string;
  pedagogicalFocus: string[];
  assessmentFocus: string[];
  vocabularyRestrictions?: string[];
  isConfigurable?: boolean;
}

export type AssessmentArchitectureType =
  | 'Diagnostic Assessment'
  | 'Practice Assessment'
  | 'Exercise Assessment'
  | 'Chapter Assessment'
  | 'Unit Assessment'
  | 'Revision Assessment'
  | 'Term Assessment'
  | 'School Assessment'
  | 'Board / Qualification Assessment';

export type QuestionType =
  | 'mcq'
  | 'fill_in_blanks'
  | 'match_column'
  | 'error_correction'
  | 'transformation'
  | 'short_answer'
  | 'identify_underline'
  | 'circle_select'
  | 'true_false'
  | 'classification'
  | 'sorting'
  | 'editing'
  | 'sentence_combining'
  | 'sentence_reordering'
  | 'rewrite_sentence'
  | 'complete_sentence'
  | 'short_response'
  | 'contextual_grammar'
  | 'passage_based'
  | 'dialogue_based'
  | 'visual_picture'
  | 'table_based'
  | 'application'
  | 'higher_order'
  | 'challenge'
  | 'open_ended'
  | 'custom';

export type ExerciseDevelopmentalTier =
  | 'FOUNDATION'
  | 'PRACTICE'
  | 'APPLICATION'
  | 'CHALLENGE'
  | 'MASTERY';

export type ExerciseWorkflowStatus =
  | 'Planning'
  | 'Drafting'
  | 'Author Review'
  | 'Academic Review'
  | 'Answer Review'
  | 'Copyediting'
  | 'Layout Ready'
  | 'Approved';

export interface OpenEndedAnswerCriteria {
  modelAnswer: string;
  acceptableAlternatives: string[];
  requiredGrammarRule?: string;
  requiredSemanticMeaning?: string;
  requiredElements?: string[];
  optionalElements?: string[];
  caseSensitive?: boolean;
  punctuationTolerance?: boolean;
  partialCreditBreakdown?: Array<{ condition: string; marks: number }>;
  markingNotes?: string;
}

export type DevelopmentalTier = 'foundation' | 'standard' | 'advanced';

export interface TierScaffoldingMetadata {
  tier: DevelopmentalTier;
  label: string;
  sublabel: string;
  targetGroup: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
  scaffoldingCharacteristics: string[];
}

export interface GrammarQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  instruction?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tier?: DevelopmentalTier;
  marks: number;
  options?: string[];
  correctAnswer: string;
  blanksSentence?: string;
  acceptableAnswers?: string[];
  hints?: string;
  scaffoldingNotes?: string;
  tierRationale?: string;
  columnA?: Array<{ id: string; text: string }>;
  columnB?: Array<{ id: string; text: string }>;
  matchPairs?: Array<{ aId: string; bId: string }>;
  originalSentence?: string;
  correctedSentence?: string;
  errorSnippet?: string;
  correctionSnippet?: string;
  transformationInstruction?: string;
  explanation: string;
  grammarRationale?: string;
  teacherNote?: string;
  distractorExplanations?: string[];
  conceptTested?: string;
  cognitiveLevel?: CognitiveLevel;
  boardSlotId?: string;
  rationale?: string;
  markingGuidance?: string;
  curriculumObjective?: string;
  acceptableAlternatives?: string[];
  modelAnswer?: string;
  markingPoints?: string[];
  partialCreditGuidance?: string;
  requiredTransformationRule?: string;
  teacherRationale?: string;
  isAdvisoryEvaluation?: boolean;
  // Phase 4J Question Bank & Assessment Intelligence Extensions
  isAiDraft?: boolean;
  approvalStatus?: 'APPROVED' | 'AI_DRAFT_REVIEW_REQUIRED' | 'NEEDS_REVISION';
  educationSystem?: string;
  programme?: string;
  classOrStage?: string;
  bookProjectTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  curriculumMappingRef?: string;
  blueprintComponent?: string;
  evidenceStatus?: AssessmentIntegrityStatus;
  openEndedMarkingGuideline?: OpenEndedMarkingGuideline;
  // Phase 4L Open-Ended Answer Intelligence & Question Bank
  canonicalAnswer?: string;
  requiredGrammarRule?: string;
  requiredMeaning?: string;
  partialCreditRules?: string[];
  teacherGuidance?: string;
  bloomLevel?: string;
  source?: string;
  status?: 'draft' | 'reviewed' | 'approved' | 'in_bank';
  // Phase 4F Studio Extensions
  visualId?: string;
  visualFigureNumber?: string;
  visualImageUrl?: string;
  visualCaption?: string;
  stimulus?: string;
  passage?: string;
  tableData?: Array<Record<string, string>>;
  requiredRule?: string;
  requiredSemanticMeaning?: string;
  requiredElements?: string[];
  optionalElements?: string[];
  caseSensitive?: boolean;
  punctuationTolerance?: boolean;
  partialCreditConditions?: string[];
  studentFeedback?: string;
  authorNote?: string;
  sourceProvenance?: string;
  inQuestionBank?: boolean;
  questionBankId?: string;
  developmentalTier?: ExerciseDevelopmentalTier;
  openEndedCriteria?: OpenEndedAnswerCriteria;
  exerciseId?: string;
  acceptedAnswers?: string[];
  curriculumLinks?: string[];
  studentVisible?: boolean;
  teacherVisible?: boolean;
  sourceQuestionBankId?: string;
  metadata?: Record<string, any>;
}

export type CognitiveLevel =
  | 'Remembering'
  | 'Understanding'
  | 'Applying'
  | 'Analysing'
  | 'Evaluating'
  | 'Creating';

export type BoardStandardCode =
  | 'CBSE'
  | 'ICSE'
  | 'CISCE'
  | 'ISC'
  | 'Cambridge_Checkpoint'
  | 'Cambridge_IGCSE'
  | 'Cambridge'
  | 'State_Board'
  | 'Custom';

export interface BlueprintConceptWeightage {
  id: string;
  conceptName: string; // e.g., 'Reported Speech', 'Tenses', 'Subject-Verb Concord'
  strand: string; // e.g., 'Syntax & Clauses', 'Verbs & Morphology', 'Vocabulary & Function'
  targetMarks: number; // Prescribed marks by board guideline
  minMarks?: number;
  maxMarks?: number;
  preferredQuestionTypes: QuestionType[];
  cognitiveLevel: CognitiveLevel;
  mandatory: boolean;
  syllabusScopeRef?: string;
  pedagogicalNotes?: string;
}

export interface BlueprintQuestionSlot {
  id: string;
  slotCode: string; // e.g., "Sec B - Q1(i)", "5(a) Blank 1", "Checkpoint Part 1"
  sectionTitle: string; // e.g. "Section B: Grammar (10 Marks)"
  conceptTested: string;
  questionType: QuestionType;
  marks: number; // e.g. 1, 0.5, 2
  cognitiveLevel: CognitiveLevel;
  internalChoiceAvailable?: boolean;
  choiceNote?: string; // e.g. "Attempt any 10 out of 12"
  sampleQuestionPrompt?: string;
}

export interface BoardQuestionBlueprint {
  id: string;
  title: string;
  board: BoardStandardCode;
  boardCode: string; // e.g. "CBSE-ENG-LANG-LIT-SEC-B", "ICSE-ENG-PAP1-Q5", "CAMB-CHECKPOINT-S2"
  targetClass: GrammarClassLevel;
  totalMarks: number;
  totalDurationMinutes: number;
  description: string;
  officialSyllabusReference: string;
  markingSchemeGuidelines: string[];
  conceptWeightages: BlueprintConceptWeightage[];
  questionSlots: BlueprintQuestionSlot[];
  allowCustomization?: boolean;
  // Phase 4J Assessment Intelligence Extensions
  systemId?: CurriculumSystemId;
  programme?: string;
  classOrStageOrQualification?: string;
  academicYear?: string;
  syllabusVersion?: string;
  assessmentVersion?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  supersedes?: string;
  supersededBy?: string;
  isActive?: boolean;
  isArchived?: boolean;
  verificationStatus?: AssessmentIntegrityStatus;
  isEditorialModel?: boolean;
  editorialReferenceNotes?: string;
  evidenceRecord?: BlueprintSourceEvidence;
  assessmentProfile?: AssessmentProfile;
  sections?: BlueprintSection[];
  allowedQuestionTypes?: RichQuestionType[];
  markingModelsSupported?: MarkingIntelligenceModel[];
  cognitiveDemandNotes?: string;
  officialCognitiveTerminology?: string;
  veritasEditorialTaxonomyNotes?: string;
  parentBlueprintId?: string;
  componentCode?: string;
  isComponentOnly?: boolean;
}

export interface ConceptAuditResult {
  conceptName: string;
  strand: string;
  targetMarks: number;
  assignedMarks: number;
  difference: number; // assigned - target
  status: 'balanced' | 'over_tested' | 'under_tested' | 'missing';
  questionCount: number;
  questionIds: string[];
  mandatory: boolean;
  recommendation: string;
}

export interface BlueprintAuditReport {
  blueprintId: string;
  blueprintTitle: string;
  targetTotalMarks: number;
  assignedTotalMarks: number;
  totalMarksDifference: number;
  compliancePercentage: number; // 0 to 100%
  status: 'compliant' | 'minor_discrepancy' | 'critical_discrepancy';
  isCompliant?: boolean;
  issues?: string[];
  conceptsAudit: ConceptAuditResult[];
  overTestedConcepts: ConceptAuditResult[];
  underTestedConcepts: ConceptAuditResult[];
  missingMandatoryConcepts: ConceptAuditResult[];
  questionTypeDistribution: Record<string, { count: number; marks: number; percentage: number }>;
  cognitiveDistribution: Record<CognitiveLevel, { marks: number; percentage: number }>;
  auditTimestamp: string;
}

export interface GrammarDefinition {
  id: string;
  term: string;
  tier?: DevelopmentalTier;
  partOfSpeechOrCategory?: string;
  ageAppropriateExplanation: string;
  remedialExplanation?: string;
  remedialFormula?: string;
  olympiadNotes?: string;
  formulaOrSyntax?: string;
  rules: string[];
  examples: Array<{ sentence: string; highlightWord?: string; note?: string }>;
  exceptions?: string[];
  commonMistakes?: Array<{ incorrect: string; correct: string; reason: string }>;
}

export interface GrammarExercise {
  id: string;
  title: string;
  instructions: string;
  targetType: QuestionType | 'mixed';
  tier?: DevelopmentalTier | 'mixed';
  scaffoldingGuide?: string;
  questions: GrammarQuestion[];
  maxMarks: number;
  timeLimitMinutes?: number;
}

export interface GrammarTestSection {
  id: string;
  title: string;
  description?: string;
  name?: string;
  instructions?: string;
  marksAllocation?: number;
  sectionLetter?: string;
  totalMarks?: number;
  questions: GrammarQuestion[];
}

export interface GrammarTestSeries {
  id: string;
  title: string;
  classLevel: GrammarClassLevel;
  totalMarks: number;
  durationMinutes: number;
  suggestedDurationMinutes?: number;
  instructions: string[];
  blueprintId?: string;
  boardTarget?: BoardStandardCode;
  sections: GrammarTestSection[];
}

export interface GrammarTopic {
  id: string;
  title: string;
  category: string;
  classLevel: GrammarClassLevel;
  chapterNumber?: number;
  overview?: string;
  learningObjectives?: string[];
  differentiatedObjectives?: {
    foundation: string[];
    standard: string[];
    advanced: string[];
  };
  definitions?: GrammarDefinition[];
  notesAndTheoryMarkdown?: string;
  curriculumTopic?: string;
  order?: number;
  pedagogicalRationale?: string;
  subtopics?: Array<{
    id?: string;
    title: string;
    explanation?: string;
    examples?: string[];
    rules?: string[];
    [key: string]: any;
  }>;
  notes?: string;
  exercises: GrammarExercise[];
  testSeries?: GrammarTestSeries[];
  studioChapter?: StudioChapter;
  // Canonical active-book binding fields
  bookProjectId?: string;
  editionId?: string;
  unitId?: string;
  unitTitle?: string;
  curriculumSystemId?: string;
  programmeId?: string;
  classOrStageId?: string;
  universalConceptId?: string; // 3-layer architecture: links to Layer A Universal Concept
}

// -------------------------------------------------------------
// Chapter Authoring Studio Types (Phase 4C)
// -------------------------------------------------------------

export type ChapterWorkflowStatus =
  | 'planning'
  | 'writing'
  | 'visuals_in_progress'
  | 'exercises_in_progress'
  | 'academic_review'
  | 'editorial_review'
  | 'ready_for_layout'
  | 'final';

export type BlockVisibility = 'student' | 'teacher_only' | 'author_only';

export type ContentBlockType =
  | 'text'
  | 'heading'
  | 'subheading'
  | 'definition'
  | 'grammar_rule'
  | 'key_concept'
  | 'example'
  | 'example_pair'
  | 'example_set'
  | 'worked_example'
  | 'tip'
  | 'remember'
  | 'important_note'
  | 'grammar_tip'
  | 'watch_out'
  | 'common_error'
  | 'warning_trap'
  | 'exam_tip'
  | 'did_you_know'
  | 'vocabulary'
  | 'table'
  | 'comparison_table'
  | 'bullet_list'
  | 'numbered_list'
  | 'quote'
  | 'visual'
  | 'diagram'
  | 'illustration'
  | 'photograph'
  | 'image_caption'
  | 'figure'
  | 'flowchart'
  | 'sentence_diagram'
  | 'annotated_sentence'
  | 'try_this'
  | 'challenge'
  | 'activity'
  | 'discussion'
  | 'practice'
  | 'exercise'
  | 'revision_box'
  | 'summary'
  | 'teacher_note'
  | 'author_note'
  | 'page_break';

export type ExampleType =
  | 'simple'
  | 'example_explanation'
  | 'correct_vs_incorrect'
  | 'before_after'
  | 'rule_application'
  | 'contextual'
  | 'progressive_set';

export interface ExampleItem {
  id: string;
  sentence: string;
  targetSnippet?: string;
  highlightWord?: string;
  isCorrect?: boolean;
  incorrectSnippet?: string;
  explanation?: string;
  ruleApplied?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  boardRelevance?: string;
  authorNote?: string;
}

export interface WorkedExampleStep {
  stepNumber: number;
  title: string;
  instruction: string;
  sampleWork?: string;
  explanation?: string;
  ruleApplied?: string;
  note?: string;
}

export interface WorkedExampleData {
  problem: string;
  steps: WorkedExampleStep[];
  finalAnswer: string;
  whyRationale: string;
  ruleApplied: string;
  commonMistake?: string;
  alternativeAnswer?: string;
  teacherNote?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type VisualArtworkStatus =
  | 'Brief'
  | 'Placeholder'
  | 'Draft Artwork'
  | 'Uploaded Artwork'
  | 'Final Artwork';

export interface VisualBlockData {
  visualType:
    | 'illustration'
    | 'diagram'
    | 'concept_map'
    | 'flowchart'
    | 'table'
    | 'comparison_table'
    | 'infographic'
    | 'sentence_diagram'
    | 'syntax_tree'
    | 'reed_kellogg_diagram'
    | 'annotated_sentence'
    | 'photograph'
    | 'photo'
    | 'callout_illustration'
    | 'custom_visual';
  title: string;
  figureNumber?: string;
  caption: string;
  altText: string;
  source: string;
  credit: string;
  licenseStatus: 'Original Creation' | 'Public Domain' | 'Creative Commons' | 'Commissioned' | 'Licensed';
  authorNote?: string;
  authorBrief?: string;
  designerBrief?: string;
  artworkStatus?: VisualArtworkStatus;
  placement: 'full_width' | 'center' | 'margin_right' | 'two_column';
  size: 'small' | 'medium' | 'large';
  estimatedSize?: string;
  imageUrl?: string;
  svgIllustrationBrief?: string;
  tableData?: { headers: string[]; rows: string[][] };
}

export interface AssociatedRuleData {
  ruleText: string;
  explanation?: string;
  formulaOrPattern?: string;
  correctExamples?: string[];
  incorrectExamples?: string[];
  whyIncorrectFails?: string;
  commonLearnerError?: string;
  teacherNote?: string;
  showInStudentEdition?: {
    formula?: boolean;
    incorrectExamples?: boolean;
    commonError?: boolean;
    explanation?: boolean;
  };
}

export interface CommonErrorData {
  incorrectSentence: string;
  correctSentence: string;
  explanation: string;
  mistakeType: string;
  ruleViolated?: string;
  examTrapNote?: string;
}

export interface TextbookContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  order: number;
  visibility: BlockVisibility;
  textContent?: string;
  definition?: GrammarDefinition;
  exampleData?: {
    type: ExampleType;
    items: ExampleItem[];
  };
  workedExample?: WorkedExampleData;
  visualData?: VisualBlockData;
  commonError?: CommonErrorData;
  associatedRuleData?: AssociatedRuleData;
  calloutText?: string;
  calloutTitle?: string;
  authorNotes?: string;
  teacherGuidance?: string;
  exerciseRefId?: string;
  metadata?: Record<string, any>;
  listItems?: string[];
  quoteAuthor?: string;
  examplePair?: {
    incorrect: string;
    correct: string;
    why: string;
    rule?: string;
  };
  figureNumber?: string;
  artworkStatus?: 'brief' | 'placeholder' | 'uploaded' | 'final';
  designerInstruction?: string;
  authorInstruction?: string;
}

export interface ChapterSection {
  id: string;
  chapterId: string;
  numberLabel?: string;
  title: string;
  order: number;
  isSubsection?: boolean;
  parentSectionId?: string;
  isCollapsed?: boolean;
  blocks: TextbookContentBlock[];
  authorNotes?: string;
  learningObjectives?: string[];
  metadata?: Record<string, any>;
  componentId?: string;
}

export type ExerciseProgressionType =
  | 'foundation'
  | 'understanding'
  | 'application'
  | 'error_analysis'
  | 'transformation'
  | 'contextual'
  | 'challenge'
  | 'mixed';

export interface StudioExercise {
  id: string;
  letter: string; // "A", "B", "C", "D", "E", etc.
  title: string;
  progression: ExerciseProgressionType;
  developmentalTier?: ExerciseDevelopmentalTier;
  status?: ExerciseWorkflowStatus;
  instructions: string;
  studentInstruction?: string;
  teacherInstruction?: string;
  purpose?: string;
  pedagogicalPurpose?: string;
  estimatedTimeMinutes?: number;
  learningObjective?: string;
  grammarRuleCoverage?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suggestedMarks: number;
  questionCount?: number;
  boardRelevance?: string;
  classLevel?: string;
  teacherNote?: string;
  questions: GrammarQuestion[];
  authorNotes?: string;
  answerKeyNotes?: string;
  alignment?: ExerciseAssessmentAlignment;
  visualId?: string;
  visualFigureNumber?: string;
  visualCaption?: string;
  visualDescription?: string;
  chapterId?: string;
}

export interface ChapterOpeningData {
  chapterNumber: number;
  title: string;
  subtitle?: string;
  openingIllustrationUrl?: string;
  openingIllustrationPrompt?: string;
  openingHook?: string;
  shortIntroduction: string;
  learningObjectives: string[];
  keyVocabulary: string[];
  conceptsCovered: string[];
  priorKnowledge?: string;
  estimatedStudyTimeMinutes: number;
  warmUpActivity?: string;
  discoveryVignette?: string;
  discoveryQuestions?: string;
  discoveryQuestion?: string;
}

export interface TeacherNotesData {
  pedagogicalNotes?: string;
  lessonPlanFlow?: Array<{
    periodNumber: number;
    topic: string;
    durationMinutes: number;
    activities: string;
  }>;
  misconceptions?: Array<{
    misconception: string;
    correctionStrategy: string;
  }>;
}

export interface ChapterEndingData {
  whatYouLearned: string[];
  rulesAtAGlance: Array<{ rule: string; example: string }>;
  commonMistakes: CommonErrorData[];
  quickRevisionChecklist: string[];
  keyVocabulary: string[];
  examReminders: string[];
  challengePrompt?: string;
  rulesRecap?: Array<{ rule: string; example: string; trap?: string }>;
  summaryPoints?: string[];
  commonTraps?: Array<{ trap: string; fix: string }>;
}

export interface ChapterAnswerKeyItem {
  id: string;
  exerciseLetterOrNumber: string;
  questionNumber: number;
  questionType: QuestionType;
  promptSummary: string;
  correctAnswer: string;
  grammarRationale: string;
  modelAnswer?: string;
  acceptableAlternatives?: string[];
  markingGuidance?: string;
  ruleApplied?: string;
  isSubjective?: boolean;
}

export type ExerciseAuditSeverity =
  | 'clear'
  | 'review_suggested'
  | 'potential_issue'
  | 'needs_academic_review';

export interface ExerciseAuditIssue {
  id: string;
  ruleNumber: number; // 1 through 22
  category:
    | 'duplicate'
    | 'missing_data'
    | 'pedagogy'
    | 'progression'
    | 'visual'
    | 'answer_key'
    | 'language'
    | 'curriculum';
  title: string;
  description: string;
  severity: ExerciseAuditSeverity;
  exerciseLetter?: string;
  questionId?: string;
  recommendation: string;
}

export interface ExerciseCoverageCell {
  concept: string;
  exerciseLetter: string;
  coverageLevel: 'none' | 'introduced' | 'practised' | 'applied' | 'mastered';
  questionCount: number;
  questionIds: string[];
}

export interface ChapterQualityAuditReport {
  overallReadinessScore: number;
  workflowStatus: ChapterWorkflowStatus;
  lastAudited: string;
  dimensions: {
    content: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    pedagogy: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    visualLearning: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    practice: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    assessment: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    editorial: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
    publishing: { score: number; status: 'complete' | 'review' | 'incomplete'; notes: string };
  };
  distinctiveness: {
    score: number;
    rating: 'High Distinction' | 'Strong Commercial' | 'Moderate' | 'Needs Depth';
    highlights: string[];
    areasForDeepening: string[];
    recommendations: string[];
  };
  repetitionAlerts: Array<{
    conceptName: string;
    matchedClassOrEdition: string;
    similarityScore: number;
    note: string;
    actionSuggestion: string;
  }>;
  crossGradeProgression: {
    conceptName: string;
    previousTreatmentClass5: string;
    currentTreatmentClass6: string;
    nextLevelTreatmentClass7: string;
  };
  checklistItems: Array<{
    id: string;
    label: string;
    done: boolean;
    category: string;
  }>;
}

export type ChapterProductionStageId =
  | 'setup'
  | 'opener'
  | 'objectives'
  | 'explanation'
  | 'rules'
  | 'section'
  | 'concepts'
  | 'examples'
  | 'visuals'
  | 'worked_examples'
  | 'common_errors'
  | 'exercises'
  | 'assessment'
  | 'test'
  | 'answer_key'
  | 'summary'
  | 'teacher_notes'
  | 'student_preview'
  | 'teacher_preview'
  | 'preview'
  | 'audit';

export type StageCompletionStatus =
  | 'not_started'
  | 'in_progress'
  | 'complete'
  | 'needs_review';

export type ArchitectureComponentStatus =
  | 'not_started'
  | 'drafting'
  | 'complete'
  | 'needs_review'
  | 'not_applicable';

export interface ChapterComponentCustomization {
  componentId: string;
  name?: string;
  customTitle?: string;
  status: ArchitectureComponentStatus;
  isCustomized?: boolean;
  notes?: string;
  assignedSectionId?: string;
  allocatedPages?: number;
}

export interface ChapterArchitectureState {
  governingArchitectureId?: string;
  inheritedFromBookId?: string;
  architectureVersion?: string;
  hasPendingUpdate?: boolean;
  inheritanceMode?: 'inherited' | 'customized' | 'detached';
  lastSyncedAt?: string;
  isCustomized?: boolean;
  customizations?: Record<string, ChapterComponentCustomization>;
  pedagogicalStagesTracked?: Record<string, boolean>;
}

export interface StudioChapter {
  id: string;
  bookProjectId?: string;
  editionId?: string;
  curriculumSystemId?: string;
  systemId?: CurriculumSystemId;
  programmeId?: string;
  classOrStageId?: string;
  unitId?: string;
  unitTitle?: string;
  equivalentClass: GrammarClassLevel | string;
  chapterNumber: number;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  category: string;
  curriculumTopic?: string;
  description?: string;
  prerequisiteKnowledge?: string;
  keyVocabulary?: string[];
  estimatedTeachingTime?: string;
  difficultyLevel?: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
  stageStatuses?: Record<string, StageCompletionStatus>;
  workflowStatus: ChapterWorkflowStatus;
  opening: ChapterOpeningData;
  sections: ChapterSection[];
  exercises: StudioExercise[];
  chapterTest?: GrammarTestSeries;
  ending: ChapterEndingData;
  answerKey?: ChapterAnswerKeyItem[];
  authorNotes?: string;
  teacherNotes?: string | TeacherNotesData;
  qualityAudit?: ChapterQualityAuditReport;
  architectureState?: ChapterArchitectureState;
  curriculumMappings?: CurriculumMapping[];
  frameworkProfileId?: string;
  lastSaved?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  // Phase 4L Chapter Production Engine
  bookTitle?: string;
  seriesTitle?: string;
  grammarStrand?: string;
  targetPageRange?: string;
  targetPageCount?: number;
  estimatedPageCount?: number;
  rules?: GrammarRuleRecord[];
  visualBriefs?: VisualBriefRecord[];
  visualRecords?: VisualRecord[];
  revisionData?: ChapterRevisionData;
  teacherAuthorNotes?: TeacherAuthorNoteRecord[];
  productionHistory?: ProductionHistoryItem[];
  snapshots?: ChapterSnapshot[];
  curriculumBoard?: string;
  subject?: string;
  status?: string;
  qualityScore?: number;
  academicQualityScore?: number;
  architectureId?: string;
  challengeProblems?: Array<{ id?: string; title: string; prompt: string; modelAnswer?: string }>;
  estimatedPages?: number;
  visuals?: any[];
  component05?: Component05Data;
  component06?: Component06Data;
  component07?: Component07Data;
  component09?: Component07Data;
  component10?: Component10Data;
  component11?: Component11Data;
  component12?: Component12Data;
  componentData?: Record<string, any>;
}

// -------------------------------------------------------------
// Component 5 — Theoretical Content & Syntactic Analysis Types
// -------------------------------------------------------------

export interface SyntacticAnalysisItem {
  id?: string;
  sentence: string;
  // Generic Agreement Model: GRAMMATICAL SUBJECT → relevant features → finite verb agreement
  grammaticalSubject?: string;
  grammaticalFeatures?: {
    number?: 'singular' | 'plural' | string;
    person?: 'first' | 'second' | 'third' | string;
    [key: string]: any;
  };
  finiteVerb?: string;
  // Pedagogical head noun/word where appropriate for the grade and topic
  subjectHeadNoun?: string;
  expandedSubject?: string;
  interveningPhrase?: string;
  verbPhrase: string;
  grammaticalNumber?: 'singular' | 'plural';
  person?: string;
  agreementRelationship?: string;
  explanation?: string;
  notes?: string;
  isContrastivePair?: boolean;
}

export interface Component05TeacherAnnotations {
  teachingFocus?: string;
  terminologyGuidance?: string;
  commonMisconceptions?: string[];
  suggestedBoardExplanation?: string;
  questioningStrategies?: string[];
  diagnosticObservations?: string;
  extensionSuggestions?: string;
}

export interface Component05Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  conceptualExplanation?: string;
  syntacticAnalysis?: SyntacticAnalysisItem[] | string;
  conceptChecks?: string[] | string;
  linguisticInsight?: string;
  teacherAnnotations?: Component05TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Component 6 — Grammar Rules & Structural Form Boxes Types
// -------------------------------------------------------------

export interface StructuralFormulaToken {
  id?: string;
  text: string;
  role: 'subject' | 'verb' | 'modifier' | 'operator' | 'punctuation' | 'note' | 'conjunction' | 'object' | 'complement' | string;
  highlight?: boolean;
}

export interface RuleVariationItem {
  id: string;
  title: string;
  condition: string;
  ruleStatement: string;
  formula?: string;
  formulaTokens?: StructuralFormulaToken[];
  correctExample: string;
  incorrectExample?: string;
  explanation: string;
  learnerNote?: string;
}

export interface RuleExceptionItem {
  id: string;
  caseTitle: string;
  condition: string;
  explanation: string;
  example: string;
}

export interface Component06TeacherAnnotations {
  introductionStrategy?: string;
  commonConfusionPoints?: string[];
  boardExamAlignmentNote?: string;
  blackboardSummarySchema?: string;
  diagnosticCheckSuggestion?: string;
}

export interface Component06Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  ruleIdentifier: string; // e.g., "RULE 1.1" or "RULE-01"
  formalRuleStatement: string; // Definitive, authoritative textbook phrasing
  pedagogicalSummary: string; // Student-accessible plain-English version
  structuralFormula: string; // Symbolic or structured formula representation (e.g. "[Singular Subject] + [Singular Finite Verb]")
  formulaTokens?: StructuralFormulaToken[];
  ruleVariations: RuleVariationItem[];
  ruleOfThumb: {
    title: string;
    summary: string;
    mnemonicOrContrast?: string;
  };
  exceptions: RuleExceptionItem[];
  teacherAnnotations?: Component06TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Component 7 / 9 — Step-by-Step Worked Examples Types
// -------------------------------------------------------------

export interface WorkedExampleItem {
  id: string;
  title: string;
  problem: string;
  contextOrScenario?: string;
  difficulty?: 'Foundational' | 'Standard' | 'Advanced';
  steps: WorkedExampleStep[];
  finalAnswer: string;
  grammaticalRationale?: string;
  ruleReference?: string;
  teacherNote?: string;
  learnerTakeaway?: string;
}

export interface Component07TeacherAnnotations {
  pedagogicalGoal?: string;
  pacingMinutes?: number;
  blackboardLayout?: string;
  commonStudentPitfall?: string;
}

export interface Component07Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  title?: string;
  items: WorkedExampleItem[];
  teacherAnnotations?: Component07TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Component 10 — Common Errors & Pitfalls Types
// -------------------------------------------------------------

export interface CommonErrorItem {
  id: string;
  title: string;
  incorrectSentence: string;
  correctSentence: string;
  mistakeType: string;
  explanation: string;
  ruleAnchor: string;
  preventionTip: string;
  frequency?: 'High' | 'Medium' | 'Critical Exam Trap';
  teacherNote?: string;
}

export interface Component10TeacherAnnotations {
  diagnosticPrompt?: string;
  remediationStrategy?: string;
  boardExamFrequencyNote?: string;
}

export interface Component10Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  title?: string;
  items: CommonErrorItem[];
  teacherAnnotations?: Component10TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Component 11 — Tips & Remember Callouts Types
// -------------------------------------------------------------

export interface TipRememberItem {
  id: string;
  title: string;
  tipType: 'remember' | 'mnemonic' | 'exam_tip' | 'golden_rule' | 'shortcut';
  calloutText: string;
  memoryHook?: string;
  quickFormula?: string;
  icon?: 'award' | 'sparkles' | 'lightbulb' | 'alert' | 'key';
  importance?: 'standard' | 'high' | 'critical';
  teacherNote?: string;
}

export interface Component11TeacherAnnotations {
  pacingAndEmphasis?: string;
  blackboardBoxRecommendation?: string;
}

export interface Component11Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  title?: string;
  items: TipRememberItem[];
  teacherAnnotations?: Component11TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Component 12 — Guided Practice & Scaffolded Drills Types
// -------------------------------------------------------------

export type ScaffoldingLevel = 'High Support' | 'Medium Support' | 'Low Support' | 'Independent';

export interface GuidedPracticeItem {
  id: string; // Stable question/item ID — never relying solely on array position
  instruction?: string; // Specific item or drill instruction
  prompt: string; // The core problem, question, or task prompt
  stimulus?: string; // Optional context, passage, data table, scenario, or mathematical expression
  hint?: string; // Student-facing scaffolding hint or guiding inquiry
  scaffoldingLevel?: ScaffoldingLevel; // High Support / Medium Support / Low Support / Independent
  modelResponse?: string; // Sample solution or model response showing expected formatting
  answer: string; // The verified answer bound strictly to this question's stable id
  explanation?: string; // Pedagogical feedback and rationale
  difficulty?: 'Foundational' | 'Standard' | 'Advanced';
  teacherNote?: string; // Diagnostic observation, common student hesitation, or remediation tip
  studentVisible?: boolean; // Controls Student Edition visibility (defaults to true)
  teacherVisible?: boolean; // Controls Teacher Edition visibility (defaults to true)
}

export interface Component12TeacherAnnotations {
  scaffoldingStrategy?: string;
  pacingMinutes?: number;
  diagnosticRubric?: string;
  commonHesitations?: string[];
  remediationAdvice?: string;
}

export interface Component12Data {
  status?: 'not_started' | 'draft' | 'in_progress' | 'complete' | 'needs_review';
  title?: string;
  instructions?: string; // General section instruction
  items: GuidedPracticeItem[];
  teacherAnnotations?: Component12TeacherAnnotations;
  wordCount?: number;
  generatedAt?: string;
  lastModified?: string;
  generationMetadata?: {
    board?: string;
    grade?: string;
    topic?: string;
    subject?: string;
    model?: string;
    generatedAt?: string;
  };
}

// -------------------------------------------------------------
// Phase 4L — VERITAS Chapter Production Engine Types
// -------------------------------------------------------------

export interface GrammarRuleRecord {
  id: string;
  ruleName: string;
  ruleStatement: string;
  explanation: string;
  patternOrFormula?: string;
  correctExamples: string[];
  incorrectExamples: string[];
  exceptions?: string[];
  commonMisconceptions?: string[];
  relatedConcepts?: string[];
  difficulty: 'Foundation' | 'Standard' | 'Challenge';
  curriculumMapping?: string;
  authorNote?: string;
}

export type VisualBriefType =
  | 'educational_illustration'
  | 'grammar_diagram'
  | 'sentence_structure_diagram'
  | 'flowchart'
  | 'concept_map'
  | 'comparison_graphic'
  | 'timeline'
  | 'table'
  | 'chart'
  | 'infographic'
  | 'character_illustration'
  | 'contextual_scene'
  | 'decorative_chapter_opener'
  | 'photo_placeholder';

export type VisualProductionStatus =
  | 'idea'
  | 'visual_brief'
  | 'placeholder'
  | 'draft_artwork'
  | 'uploaded_artwork'
  | 'approved_artwork'
  | 'final_artwork';

export interface VisualBriefRecord {
  id: string;
  visualType: VisualBriefType;
  title: string;
  figureNumber: string;
  caption: string;
  altText: string;
  authorBrief: string;
  designerBrief: string;
  educationalPurpose: string;
  placement: 'opener' | 'top_span' | 'inline' | 'margin' | 'full_width' | 'exercise_box';
  approximateSize: 'thumbnail' | 'quarter_page' | 'half_page' | 'full_page';
  editionTarget: 'student_and_teacher' | 'teacher_only';
  sourceOrCredit?: string;
  copyrightStatus?: 'original_commission' | 'in_house' | 'licensed' | 'open_source';
  productionStatus: VisualProductionStatus;
  artworkUrl?: string;
  associatedBlockId?: string;
  associatedRuleId?: string;
  diagramData?: any;
}

export interface TeacherAuthorNoteRecord {
  id: string;
  type:
    | 'author_note'
    | 'editor_note'
    | 'teacher_note'
    | 'teaching_strategy'
    | 'expected_misconception'
    | 'differentiation_suggestion'
    | 'remediation'
    | 'extension_activity'
    | 'pacing_guide'
    | 'common_pitfall'
    | 'differentiation'
    | 'pedagogical_background';
  title: string;
  content: string;
  visibility: 'internal_only' | 'teacher_edition' | 'student_edition';
  targetSectionOrRule?: string;
  createdDate?: string;
}

export interface ChapterRevisionData {
  rulesAtAGlance: Array<{ ruleTitle: string; summary: string }>;
  keyConcepts: string[];
  whatYouLearned?: string[];
  commonMistakes: Array<{ mistake: string; correction: string; why: string }>;
  rememberPoints: string[];
  keyVocabulary: Array<{ term: string; definition: string }>;
  quickCheckQuestions: Array<{ prompt: string; answer: string }>;
  revisionExercises: string[];
  challengeQuestions: string[];
  selfAssessmentChecklist: Array<{ statement: string; canDo: boolean }>;
}

export interface ProductionHistoryItem {
  status: string;
  timestamp: string;
  note: string;
  author: string;
}

export interface ChapterSnapshot {
  id: string;
  timestamp: string;
  label: string;
  author: string;
  snapshot: StudioChapter;
}

// -------------------------------------------------------------
// Book Production Architecture Types (Phase 4F)
// -------------------------------------------------------------

export interface BookUnit {
  id: string;
  unitNumber: number;
  title: string;
  description?: string;
  chapterIds: string[];
  order: number;
  isArchived?: boolean;
  // Canonical active-book binding fields
  bookProjectId?: string;
  editionId?: string;
  curriculumSystemId?: string;
  programmeId?: string;
  classOrStageId?: string;
  isTemplate?: boolean;
  aiSuggestion?: boolean;
  status?: 'draft' | 'approved' | 'in_review';
}

export type FrontMatterType =
  | 'half_title'
  | 'title_page'
  | 'copyright_page'
  | 'dedication'
  | 'foreword'
  | 'preface'
  | 'how_to_use'
  | 'table_of_contents'
  | 'curriculum_alignment'
  | 'message_to_students'
  | 'message_to_teachers';

export interface FrontMatterItem {
  id: string;
  type: FrontMatterType;
  title: string;
  content: string;
  isEnabled: boolean;
  order: number;
}

export type BackMatterType =
  | 'glossary'
  | 'grammar_reference'
  | 'revision_tables'
  | 'answer_key'
  | 'index'
  | 'bibliography'
  | 'image_credits'
  | 'acknowledgements';

export interface BackMatterItem {
  id: string;
  type: BackMatterType;
  title: string;
  content: string;
  isEnabled: boolean;
  order: number;
}

export interface BookStyleGuide {
  variety: 'British English' | 'International English' | 'American English';
  quotationStyle: 'Single quotes with punctuation outside' | 'Double quotes with punctuation inside';
  hyphenation: 'Standard Oxford' | 'Minimal hyphenation' | 'Strict grammatical';
  capitalisation: 'Title Case for Headings' | 'Sentence case for subheadings';
  headingConventions: string;
  exerciseNaming: string;
  numberFormatting: 'Words for one to ten, numerals for 11+' | 'Strict numerals in technical sections';
  grammarTerminology: string;
  punctuationConventions: string;
  id?: string;
  spellingStandard?: string;
  preferredGrammarFramework?: string;
  capitalizationRules?: string;
  formattingRules?: string;
  quotationMarkStandard?: string;
  hyphenationStandard?: string;
  numberStyle?: string;
  sampleSentenceStyle?: string;
  approvedTerminology?: Record<string, string> | string[];
  prohibitedTerminology?: Record<string, string> | string[];
}

export interface TerminologyEntry {
  id: string;
  preferredTerm: string;
  term?: string;
  preferredForm?: string;
  forbiddenVariants?: string[];
  domain?: string;
  allowedAlternative?: string;
  board?: string;
  classLevel?: string;
  definition: string;
  usageNote?: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  firstAppearanceChapterId?: string;
  firstAppearanceChapterTitle?: string;
  boardNote?: string;
  status: 'Draft' | 'Approved' | 'Excluded';
}

export interface IndexTermEntry {
  id: string;
  term: string;
  category: 'Grammar Concept' | 'Syntactic Rule' | 'Term' | 'Name' | 'Topic';
  referencedChapterIds: string[];
}

export interface CrossChapterReference {
  id: string;
  sourceChapterId: string;
  targetChapterId: string;
  targetType: 'chapter' | 'unit' | 'section' | 'exercise' | 'rule';
  referenceType?: string;
  anchorText?: string;
  targetNumberOrLabel?: string;
  displayLabel: string;
  resolvedText?: string;
}

export interface BookTeacherMaterial {
  introForTeachers: string;
  pedagogicalApproach: string;
  suggestedSchedule: string;
  differentiationGuidance: string;
  assessmentGuidance: string;
  additionalActivities: string;
  id?: string;
  teacherGuideIntro?: string;
  pedagogicalPrinciples?: string[];
  yearLongTeachingScheme?: Array<{
    term: string;
    week: string;
    unitTitle: string;
    chaptersCovered: string[];
    periodsAllocated: number;
  }>;
  differentiationGuidelines?: {
    strugglingLearners: string;
    advancedLearners: string;
    ellSupport: string;
  };
  diagnosticAssessmentGuidance?: string;
}

export type ChapterTemplateType =
  | 'grammar_concept'
  | 'usage_application'
  | 'sentence_transformation'
  | 'composition'
  | 'vocabulary'
  | 'revision'
  | 'assessment_practice'
  | 'custom';

export interface ChapterStructuralTemplate {
  id: string;
  type: ChapterTemplateType;
  name: string;
  description: string;
  recommendedStages: string[];
  recommendedBlocks: Array<{ type: ContentBlockType; title: string; brief: string }>;
  exerciseStructure: string[];
  assessmentRequirements: string;
  summaryStructure: string[];
  teacherNoteStructure: string[];
}

export interface ClassCurriculumBook {
  id?: string;
  bookProjectId?: string;
  editionId?: string;
  curriculumSystemId?: string;
  programmeId?: string;
  classOrStageId?: string;
  classLevel: GrammarClassLevel;
  title: string;
  subtitle?: string;
  isbn?: string;
  ageBracket: string;
  boardStandards?: string;
  description: string;
  pedagogicalFocus?: string;
  topics: GrammarTopic[];
  testPapers?: any[];
  writingTopics?: any[];
  // Phase 4F Book Production Architecture Extensions:
  subject?: string;
  edition?: string;
  academicYear?: string;
  authorOrEditor?: string;
  bookStatus?: 'Drafting' | 'In Review' | 'Pre-Press' | 'Published';
  targetPageCount?: number;
  units?: BookUnit[];
  frontMatter?: FrontMatterItem[];
  backMatter?: BackMatterItem[];
  styleGuide?: BookStyleGuide;
  terminologyDictionary?: TerminologyEntry[];
  glossary?: GlossaryEntry[];
  indexTerms?: IndexTermEntry[];
  crossReferences?: CrossChapterReference[];
  teacherMaterial?: BookTeacherMaterial;
}

export type ProgressionStage = 'I' | 'D' | 'R' | 'M' | 'E' | 'none';

export interface CurriculumCell {
  stage: ProgressionStage;
  subtopicsOrNotes?: string;
  learningOutcomes?: string[];
  linkedTopicId?: string;
}

export interface ScopeSequenceTopic {
  id: string;
  strand: string;
  title: string;
  description: string;
  progression: Record<GrammarClassLevel, CurriculumCell>;
}

export interface SpiralCurriculumMatrix {
  id: string;
  title: string;
  targetBoard: string;
  strands: string[];
  topics: ScopeSequenceTopic[];
  lastAudited?: string;
}

// -------------------------------------------------------------
// Multi-Board Architecture Types (Phase 4B: CISCE, CBSE, Cambridge)
// -------------------------------------------------------------

export type CurriculumSystemId = 'CBSE' | 'CISCE' | 'Cambridge';

export interface CurriculumStage {
  id: string; // e.g. 'cbse-c6', 'icse-c6', 'camb-s7'
  systemId: CurriculumSystemId;
  programmeId: string;
  stageLabel: string; // e.g. "Class 6" or "Stage 7" or "IGCSE Year 10" or "A Level"
  equivalentClass: GrammarClassLevel;
  veritasLevel?: VeritasSeriesLevel;
  nominalAge: string; // e.g. "Ages 11–12"
  description: string;
  syllabusFrameworkRef: string;
  isEditorialMapping?: boolean;
  officialProgrammeOrStage?: string;
}

export interface CurriculumProgramme {
  id: string; // e.g. 'cbse-main', 'cisce-icse', 'cisce-isc', 'cambridge-primary', 'cambridge-lower-sec', 'cambridge-igcse', 'cambridge-alevel'
  systemId: CurriculumSystemId;
  name: string; // e.g. "CBSE Secondary & Senior", "ICSE (Indian Certificate of Secondary Education)", "Cambridge Lower Secondary"
  shortCode: string; // "CBSE", "ICSE", "ISC", "Cambridge Lower Sec", etc.
  ageBracket: string;
  description: string;
  stages: CurriculumStage[];
}

export interface CurriculumSystem {
  id: CurriculumSystemId;
  name: string;
  shortName: string;
  authority: string;
  description: string;
  programmes: CurriculumProgramme[];
}

export interface BookEdition {
  id: string; // e.g. 'ed-cbse-c6', 'ed-icse-c6', 'ed-camb-s7'
  systemId: CurriculumSystemId;
  programmeId: string;
  stageId: string;
  stageLabel: string;
  equivalentClass: GrammarClassLevel;
  title: string;
  subtitle: string;
  editionCode: string;
  publicationStatus: 'Drafting' | 'In Review' | 'Pre-Press' | 'Published';
  topics: GrammarTopic[];
  pedagogicalPhilosophy: string;
  boardSpecificGuidelines: string[];
  targetExamFormat: string;
  completenessScore: number;
  lastModified: string;
}

export type EvidenceVerificationStatus =
  | 'VERIFIED'
  | 'EDITORIAL_DEMO'
  | 'AI_SUGGESTED_UNVERIFIED'
  | 'MAPPED_SOURCE_REQUIRED'
  | 'SOURCE_ATTACHED_REVIEW_REQUIRED'
  | 'SOURCE_ADDED_NOT_VERIFIED'
  | 'EDITORIAL_INTERPRETATION'
  | 'NEEDS_ACADEMIC_REVIEW'
  | 'UNVERIFIED_EDITORIAL_MODEL'
  | 'MAPPED'
  | 'NEEDS_REVIEW';

export interface EvidenceInspectorRecord {
  claim: string;
  status: EvidenceVerificationStatus;
  educationSystem: string;
  bookClassOrStage: string;
  sourceTitle?: string;
  issuingOrganisation?: string;
  documentTitle?: string;
  versionOrYear?: string;
  pageOrSection?: string;
  citationReference?: string;
  sourceUrl?: string;
  editorialNotes?: string;
  verifiedBy?: string;
  verificationDate?: string;
  isOfficialCodeVerified?: boolean;
}

export type CurriculumClaimType =
  | 'canonicalTerminology'
  | 'pedagogicalEmphasis'
  | 'expectedDepth'
  | 'boardExamWeightage'
  | 'testingPattern'
  | 'introductoryLevel'
  | 'frameworkApplicability';

export interface VerificationAuditEntry {
  timestamp: string;
  action: 'VERIFIED' | 'REVIEW_REQUESTED' | 'SOURCE_ADDED' | 'REJECTED' | 'MARKED_EDITORIAL';
  performedBy: string;
  previousStatus: EvidenceVerificationStatus;
  newStatus: EvidenceVerificationStatus;
  notes?: string;
}

export interface ClaimEvidenceRecord {
  claimType: CurriculumClaimType;
  claimLabel: string;
  claimValue: string;
  status: EvidenceVerificationStatus;
  sourceOrganisation?: string;
  sourceTitle?: string;
  sourceType?:
    | 'official_syllabus'
    | 'sample_question_paper'
    | 'curriculum_framework'
    | 'curriculum_circular'
    | 'textbook_guideline'
    | 'editorial_analysis';
  publicationOrSyllabusYear?: string;
  applicableProgramme?: string;
  applicableClassOrStage?: string;
  pageSectionOrObjective?: string;
  sourceReferenceOrLocation?: string;
  dateChecked?: string;
  checkedByOrReviewer?: string;
  notes?: string;
  history?: VerificationAuditEntry[];
}

export interface CurriculumEvidenceMetadata {
  sourceTitle: string;
  sourceOrganisation: string;
  sourceType:
    | 'official_syllabus'
    | 'sample_question_paper'
    | 'curriculum_framework'
    | 'curriculum_circular'
    | 'textbook_guideline'
    | 'editorial_analysis';
  sourceYear: string;
  referenceUrl?: string;
  pageSection?: string;
  applicableProgramme: string;
  applicableLevel: string;
  applicableSyllabusYear: string;
  dateChecked: string;
  verificationStatus: EvidenceVerificationStatus;
  academicReviewer?: string;
  notes?: string;
}

export interface ConceptBoardImplementation {
  systemId: CurriculumSystemId;
  programmeName: string;
  canonicalTerminology: string;
  pedagogicalEmphasis: string;
  boardExamWeightage: string;
  sampleQuestionPrompt: string;
  testingPattern: string;
  scopeBoundary: string;
  // Phase 4H Layer B Curriculum Implementation Extensions
  expectedDepth?: string;
  learningOutcomes?: string[];
  commonLearnerDifficulty?: string;
  assessmentTreatment?: string;
  recommendedExerciseStyles?: string[];
  evidenceStatus?: EvidenceVerificationStatus;
  evidenceMetadata?: CurriculumEvidenceMetadata;
  // Phase 4H.1 Claim-Level Evidence Breakdown
  claimEvidence?: Partial<Record<CurriculumClaimType, ClaimEvidenceRecord>>;
  effectiveFrom?: string;
  effectiveTo?: string;
  syllabusYear?: string;
  editionYear?: string;
  lastVerified?: string;
  supersededBy?: string;
}

// Layer C: Book / Edition Implementation
export interface ConceptBookImplementation {
  bookProjectId: string;
  bookTitle: string;
  board: 'CBSE' | 'CISCE' | 'Cambridge';
  programme: string;
  classOrStage: string;
  edition: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  teachingDepth: 'Introduced' | 'Developing' | 'Reinforced' | 'Mastered' | 'Extended';
  editionTerminology: string;
  sampleExercises: string[];
  assessmentTreatment: string;
  coverageStatus: 'Covered' | 'Gap' | 'ReviewNeeded';
}

export interface SystemProgressionRecord {
  stageKey: string;
  stageName: string;
  progressionStage: ProgressionStage;
  outcome: string;
  depthNote: string;
  curriculumRef?: string;
}

export interface CurriculumDivergenceInsight {
  id: string;
  title: string;
  description: string;
  classification: 'SOURCE_BASED' | 'EDITORIAL_ANALYSIS' | 'AI_SUGGESTED_UNVERIFIED';
  sourceReference?: string;
  isAcceptedByAuthor: boolean;
  acceptedAt?: string;
  acceptedBy?: string;
}

export interface CrossSystemLearningBand {
  bandId: string;
  bandLabel: string;
  ageBracket: string;
  cbseLevel: string;
  cisceLevel: string;
  cambridgeLevel: string;
  editorialDisclaimer: string;
}

export interface MasterGrammarConcept {
  id: string;
  name: string;
  strand: string;
  universalDefinition: string;
  universalRules: string[];
  commonPitfalls: string[];
  progressionByStage: Record<string, { stage: ProgressionStage; outcome: string; depthNote: string }>;
  implementations: Record<CurriculumSystemId, ConceptBoardImplementation>;
  // Phase 4H Extensions:
  systemProgressions?: {
    CBSE?: Record<string, SystemProgressionRecord>;
    CISCE?: Record<string, SystemProgressionRecord>;
    Cambridge?: Record<string, SystemProgressionRecord>;
    VeritasRecommended?: Record<string, SystemProgressionRecord>;
  };
  bookImplementations?: ConceptBookImplementation[];
  divergenceInsights?: CurriculumDivergenceInsight[];
}

export interface QualityAuditAlert {
  id: string;
  type: 'gap' | 'duplication' | 'terminology' | 'alignment';
  severity: 'info' | 'warning' | 'critical';
  editionId: string;
  editionLabel: string;
  title: string;
  description: string;
  recommendation: string;
}

export type QuizPracticeMode = 'quick' | 'standard' | 'full' | 'mistakes_only';

export type QuizMasteryStatus = 'Mastered' | 'Proficient' | 'Developing' | 'Needs Practice';

export interface QuizAttemptRecord {
  id: string;
  grade: GrammarClassLevel;
  unitId: string;
  unitTitle: string;
  practiceMode: QuizPracticeMode;
  questionIds: string[];
  answers: Record<string, string>;
  marks: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  dateTime: string;
  durationSeconds: number;
  incorrectQuestionIds: string[];
  unansweredQuestionIds: string[];
  masteryStatus: QuizMasteryStatus;
  conceptMastery?: Record<string, { total: number; correct: number }>;
}

export interface GrammarSeriesProject {
  id: string;
  seriesTitle: string;
  author: string;
  targetBoard: 'CBSE' | 'ICSE' | 'Cambridge / IGCSE' | 'Common Core' | 'General ESL';
  selectedClass: GrammarClassLevel;
  books: Record<GrammarClassLevel, ClassCurriculumBook>;
  curriculumMatrix?: SpiralCurriculumMatrix;
  savedBlueprints?: BoardQuestionBlueprint[];
  quizHistory?: QuizAttemptRecord[];
  // Multi-Board Architecture Extensions (Phase 4B)
  activeSystemId?: CurriculumSystemId;
  activeProgrammeId?: string;
  activeStageId?: string;
  activeEditionId?: string;
  editions?: Record<string, BookEdition>;
  masterConcepts?: MasterGrammarConcept[];
  curriculumAuditAlerts?: QualityAuditAlert[];
  // Phase 4F Book Project & Publishing Command Centre Architecture
  bookProjects?: Record<string, BookProject>;
  activeBookProjectId?: string;
  editionBooks?: Record<string, ClassCurriculumBook>;
  // Phase 4H Curriculum & Framework Intelligence Extensions
  frameworkProfiles?: FrameworkProfile[];
  frameworkReferences?: FrameworkReference[];
  curriculumMappings?: CurriculumMapping[];
  lastUpdated: string;
}

// -------------------------------------------------------------
// Phase 4H: Curriculum & Framework Intelligence Engine Types
// -------------------------------------------------------------

export type CurriculumEvidenceSourceType =
  | 'VERIFIED OFFICIAL SOURCE'
  | 'EDITORIAL MAPPING'
  | 'AI-SUGGESTED MAPPING'
  | 'INFERRED PROGRESSION'
  | 'UNVERIFIED'
  | 'NEEDS ACADEMIC REVIEW';

export interface SourceProvenance {
  educationSystem: string;
  programme?: string;
  classOrStage?: string;
  subject?: string;
  sourceTitle: string;
  sourceOrganisation: string;
  sourceYear: string;
  sourceUrlOrRef?: string;
  pageOrSection?: string;
  exactReferenceNote?: string;
  evidenceType: CurriculumEvidenceSourceType;
  verificationStatus: 'VERIFIED' | 'NEEDS ACADEMIC REVIEW' | 'UNVERIFIED' | 'AI-SUGGESTED';
  verifiedBy?: string;
  verificationDate?: string;
}

export type CurriculumCoverageState =
  | 'not_addressed'
  | 'introduced'
  | 'developing'
  | 'practised'
  | 'mastered'
  | 'assessed';

export type FrameworkPolicyStatus =
  | 'NOT CHECKED'
  | 'REFERENCE ADDED'
  | 'MAPPED'
  | 'POTENTIAL GAP'
  | 'NEEDS ACADEMIC REVIEW'
  | 'VERIFIED';

export type FrameworkVerificationStatus =
  | 'not_checked'
  | 'mapped'
  | 'potential_gap'
  | 'needs_academic_review'
  | 'verified';

export interface EarlyYearsPedagogicalModel {
  level: 'Kindergarten' | 'Class 1' | 'Class 2';
  title: string;
  ageRange: string;
  pedagogicalFocus: string;
  structureType: 'oral_and_picture_led';
  keyPillars: Array<{
    id: string;
    name: string;
    description: string;
    activityStyle: string;
  }>;
  sampleActivities: string[];
  assessmentStyle: string;
}

export interface EducationSystemProfile {
  id: CurriculumSystemId;
  name: string;
  shortName: string;
  authority: string;
  description: string;
  programmes: string[];
  standardsTerminology: string; // 'Class' | 'Stage' | 'Grade'
  policyFrameworkDistinction: string;
  assessmentExpectations: string;
  sampleSyllabusRefs: string[];
}

export interface FrameworkProfile {
  id: string;
  educationSystem: CurriculumSystemId;
  awardingOrganisation: string;
  programme: string;
  classOrStage: string;
  subject: string;
  academicYearOrEdition: string;
  curriculumDocument: string;
  frameworkDocument?: string;
  syllabusReference: string;
  documentYear: string;
  sourceCitation: string;
  learningOutcomes: string[];
  competencies: string[];
  assessmentExpectations: string;
  pedagogicalExpectations: string;
  crossCurricularExpectations?: string[];
  notes?: string;
  verificationStatus: FrameworkVerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  version: string;
}

export interface FrameworkReference {
  id: string;
  title: string;
  system: CurriculumSystemId;
  documentType: 'curriculum_syllabus' | 'policy_framework' | 'national_standard' | 'assessment_spec';
  publishingBody: string;
  year: string;
  version: string;
  officialRefUrl?: string;
  editorialNotes: string;
  isExternalPolicyOnly?: boolean; // e.g., NEP 2020 for CISCE or Cambridge
}

export interface CurriculumRequirement {
  id: string;
  frameworkProfileId: string;
  code: string;
  title: string;
  description: string;
  strand: string;
  requirementType:
    | 'syntax'
    | 'morphology'
    | 'concord'
    | 'clause_analysis'
    | 'punctuation'
    | 'composition'
    | 'vocabulary'
    | 'editing';
  recommendedDepth: 'Introduced' | 'Developing' | 'Practised' | 'Mastered';
  prerequisiteRequirementIds?: string[];
  assessmentGuideline?: string;
  learningObjectives: string[];
  provenance?: SourceProvenance;
  evidenceType?: CurriculumEvidenceSourceType;
  verificationStatus?: 'VERIFIED' | 'NEEDS ACADEMIC REVIEW' | 'UNVERIFIED' | 'AI-SUGGESTED';
  sourceTitle?: string;
  sourceOrganisation?: string;
  sourceYear?: string;
  pageOrSection?: string;
  exactReferenceNote?: string;
  subStrand?: string;
  mappedChapterIds?: string[];
  mappedSectionIds?: string[];
  assessmentRelevance?: string;
  editorialNotes?: string;
  evidenceSource?: string;
  sourceReference?: string;
  evidenceStatus?:
    | 'Not Checked'
    | 'Source Located'
    | 'Mapped'
    | 'Potential Gap'
    | 'Needs Academic Review'
    | 'Verified';
}

export interface CoverageEvidence {
  id: string;
  type:
    | 'chapter_section'
    | 'content_block'
    | 'example'
    | 'exercise'
    | 'question'
    | 'assessment'
    | 'teacher_note';
  chapterId: string;
  chapterTitle: string;
  sectionId?: string;
  sectionTitle?: string;
  blockId?: string;
  componentId?: string; // 23-component architecture id
  componentName?: string;
  exerciseId?: string;
  questionId?: string;
  snippet: string;
  pageNumberOrRef?: string;
}

export interface CurriculumMapping {
  id: string;
  requirementId: string;
  requirementCode: string;
  requirementTitle: string;
  bookId: string;
  unitId: string;
  chapterId: string;
  architectureComponentId: string;
  learningObjectiveId?: string;
  exerciseId?: string;
  assessmentQuestionId?: string;
  coverageState: CurriculumCoverageState;
  verificationStatus: FrameworkVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  depth: string;
  evidence: CoverageEvidence[];
  notes: string;
  isDemonstration?: boolean; // Tagged as "SAMPLE / REQUIRES ACADEMIC VERIFICATION"
}

export interface CurriculumGapWarning {
  id: string;
  category:
    | 'unassigned_requirement'
    | 'introduced_not_practised'
    | 'practised_not_assessed'
    | 'objective_without_content'
    | 'question_without_objective'
    | 'excessive_duplication'
    | 'concept_introduced_too_late'
    | 'progression_anomaly'
    | 'missing_prerequisite'
    | 'board_mismatch';
  severity: 'critical' | 'warning' | 'review' | 'info';
  title: string;
  description: string;
  recommendation: string;
  affectedRequirementId?: string;
  affectedChapterId?: string;
  affectedBookId?: string;
  isAiSuggestion?: boolean;
}

export interface SeriesProgressionStep {
  classOrStage: string;
  bookId: string;
  bookTitle: string;
  coverageState: CurriculumCoverageState;
  levelDepth: string;
  spiralFocus: string;
  keyConstructs: string[];
}

export interface ProgressionLink {
  id: string;
  conceptId: string;
  conceptName: string;
  strand: string;
  stages: SeriesProgressionStep[];
  progressionHealth:
    | 'optimal'
    | 'repetition_warning'
    | 'difficulty_jump'
    | 'prerequisite_gap'
    | 'insufficient_spiral';
  analysis: string;
  recommendations: string[];
}

export interface CrossBoardAdaptationAction {
  id: string;
  action: 'KEEP' | 'MODIFY' | 'ADD' | 'REMOVE' | 'REVIEW';
  targetComponent: string;
  itemDescription: string;
  rationale: string;
  approved: boolean;
}

export interface CrossBoardAdaptationPlan {
  sourceBoard: CurriculumSystemId;
  targetBoard: CurriculumSystemId;
  sourceChapterTitle: string;
  targetChapterTitle: string;
  targetProgramme: string;
  targetClassOrStage: string;
  comparison: {
    curriculumRequirements: string;
    terminology: Array<{ from: string; to: string; note: string }>;
    depthShift: string;
    expectedSkills: string;
    exerciseStyleShift: string;
    assessmentExpectations: string;
  };
  actions: CrossBoardAdaptationAction[];
  authorApproved: boolean;
  approvedBy?: string;
  approvalDate?: string;
}

// -------------------------------------------------------------
// Phase 4F Book Project, Rights & Publishing Types
// -------------------------------------------------------------

export type BookProjectStatus =
  | 'Not Planned'
  | 'Planning'
  | 'Curriculum Mapping'
  | 'Scope Defined'
  | 'Authoring'
  | 'Academic Review'
  | 'Assessment Review'
  | 'Copyediting'
  | 'Visual Production'
  | 'Layout'
  | 'Layout Ready'
  | 'Proofreading'
  | 'Publisher Ready'
  | 'Published';

export type BookEditionType =
  | 'Student Edition'
  | 'Teacher Edition'
  | 'Workbook'
  | 'Digital Edition';

export type ProductionMilestoneKey =
  | 'manuscript_started'
  | 'first_draft_complete'
  | 'academic_review'
  | 'board_alignment_review'
  | 'copyedit'
  | 'illustration_complete'
  | 'assessment_review'
  | 'proof_1'
  | 'proof_2'
  | 'final_proof'
  | 'publisher_submission'
  | 'approved_for_production'
  | 'published';

export interface ProductionMilestone {
  id: string;
  key: ProductionMilestoneKey;
  label: string;
  status: 'completed' | 'in_progress' | 'scheduled' | 'delayed' | 'pending';
  targetDate?: string;
  completionDate?: string;
  responsiblePerson: string;
  notes: string;
}

export interface RightsAndEditionRecord {
  id: string;
  editionType: BookEditionType;
  editionNumber: number;
  revision: string;
  copyrightYear: number;
  isbnPlaceholder: string;
  publicationStatus: 'Planning' | 'In Production' | 'Published' | 'Archived';
  publisher: string;
  territory: string;
  language: string;
  notes: string;
}

export type ReadinessVerificationStatus =
  | 'Mapped'
  | 'Internally Verified'
  | 'Potential Gap'
  | 'Needs Academic Review'
  | 'Not Checked';

export interface ReadinessCategoryScore {
  category:
    | 'Curriculum Mapping'
    | 'Chapter Authoring'
    | 'Concept Coverage'
    | 'Examples'
    | 'Visuals'
    | 'Exercises'
    | 'Answer Keys'
    | 'Assessments'
    | 'Teacher Notes'
    | 'Board Review'
    | 'Copyediting'
    | 'Accessibility'
    | 'Layout'
    | 'Preflight';
  percent: number;
  status: 'Complete' | 'In Progress' | 'Missing' | 'Needs Review' | 'Verified';
  verificationStatus: ReadinessVerificationStatus;
  notes: string;
  details: string;
}

export interface BookReadinessReport {
  overallScore: number; // General display percentage (Book Readiness)
  chapterReadinessScore: number; // Average readiness of authored chapters
  bookReadinessScore: number; // Evidence-based whole-book readiness
  productionReadinessScore: number; // Prepress, layout & manufacturing readiness
  categories: ReadinessCategoryScore[];
  calculationExplanation?: {
    summary: string;
    plannedChapters: number;
    authoredChapters: number;
    factors: Array<{
      name: string;
      weight: number;
      score: number;
      contribution: number;
      evidence: string;
    }>;
  };
  lastAudited: string;
}

export type BookWideAuditCategory =
  | 'Missing curriculum concepts'
  | 'Duplicated explanations'
  | 'Repeated examples'
  | 'Repeated questions'
  | 'Uneven chapter length'
  | 'Insufficient practice'
  | 'Difficulty imbalance'
  | 'Missing answer keys'
  | 'Missing assessments'
  | 'Missing visuals'
  | 'Missing captions'
  | 'Missing alt text'
  | 'Undefined terminology'
  | 'Inconsistent terminology'
  | 'Cross-chapter contradictions'
  | 'Age-inappropriate readability'
  | 'Unbalanced Bloom levels'
  | 'Weak progression'
  | 'Missing prerequisite concepts'
  | 'Board-mapping gaps'
  | 'Formatting inconsistencies';

export interface BookWideAuditIssue {
  id: string;
  category: BookWideAuditCategory;
  severity: 'critical' | 'warning' | 'review' | 'info';
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  title: string;
  description: string;
  suggestedFix?: string;
  status: 'open' | 'reviewed' | 'ignored' | 'fixed';
}

export interface PublisherProposalData {
  titlePageTitle: string;
  titlePageSubtitle: string;
  seriesOverview: string;
  seriesOverviewApproval?: 'AI Draft' | 'Author Approved';
  bookOverview: string;
  bookOverviewApproval?: 'AI Draft' | 'Author Approved';
  targetReadership: string;
  targetReadershipApproval?: 'AI Draft' | 'Author Approved';
  curriculumRationale: string;
  curriculumRationaleApproval?: 'AI Draft' | 'Author Approved';
  pedagogicalPhilosophy: string;
  pedagogicalPhilosophyApproval?: 'AI Draft' | 'Author Approved';
  distinctiveFeatures: string[];
  chapterArchitecture: string;
  exerciseArchitecture: string;
  assessmentApproach: string;
  crossBoardStrategy: string;
  sampleTocDescription: string;
  sampleChapterReferences: string[];
  authorBiography: string;
  authorBiographyApproval?: 'AI Draft' | 'Author Approved';
  productionSpecifications: {
    trimSize: string;
    targetPageCount: number;
    colorIntent: string;
    paperStock: string;
    bindingType: string;
  };
  estimatedManuscriptLengthWords: number;
  currentProductionStatus: string;
  marketPositioning: string;
  marketPositioningApproval?: 'AI Draft' | 'Author Approved';
  competingTitlesAnalysis: string;
  competingTitlesApproval?: 'AI Draft' | 'Author Approved';
  lastUpdated: string;
}

export interface BookProject {
  id: string;
  seriesTitle: string;
  bookTitle: string;
  subtitle: string;
  board: CurriculumSystemId | string;
  programme: string;
  programmeId?: string;
  classOrStage: GrammarClassLevel | string;
  subject: string;
  author: string;
  editor: string;
  edition: BookEditionType | string;
  academicYear: string;
  isbnPlaceholder: string;
  isbnStatus?: 'Not Assigned' | 'Entered by Author/Publisher' | 'Validated Format';
  targetAge: string;
  targetPageCount: number;
  estimatedWordCount: number;
  trimSize: string;
  status: BookProjectStatus;
  isManualStatus?: boolean;
  derivedStatus?: BookProjectStatus;
  publisher: string;
  internalProjectCode: string;
  copyrightYear: number;
  language: string;
  notes: string;
  classLevel: GrammarClassLevel;
  veritasLevel?: VeritasSeriesLevel;
  educationSystem?: CurriculumSystemId | string;
  officialLevel?: string;
  developmentalBand?: DevelopmentalBandId;
  curriculumProfile?: string;
  assessmentProfile?: string;
  isOfficialEquivalenceClaimed?: boolean;
  editionId?: string;
  milestones: ProductionMilestone[];
  rightsAndEditions: RightsAndEditionRecord[];
  readiness?: BookReadinessReport;
  auditIssues?: BookWideAuditIssue[];
  proposalData?: PublisherProposalData;
  isArchived?: boolean;
  isDemoProject?: boolean;
  isPrimaryWorkingProject?: boolean;
  lastEdited: string;
  architecture?: BookArchitectureConfig;
  frameworkProfileId?: string;
  curriculumMappings?: CurriculumMapping[];
  curriculumRequirements?: CurriculumRequirement[];
  frameworkReferences?: FrameworkReference[];
  topics?: GrammarTopic[];
}

export type SentenceClassificationType =
  | 'simple'
  | 'compound'
  | 'complex'
  | 'compound-complex';

export type ClauseType =
  | 'principal'
  | 'subordinate_noun'
  | 'subordinate_adverb'
  | 'subordinate_relative'
  | 'coordinate';

export type SyntacticRole =
  | 'subject'
  | 'predicate_verb'
  | 'auxiliary_verb'
  | 'direct_object'
  | 'indirect_object'
  | 'subject_complement'
  | 'object_complement'
  | 'preposition'
  | 'object_of_preposition'
  | 'adjective_modifier'
  | 'adverb_modifier'
  | 'determiner'
  | 'coordinating_conjunction'
  | 'subordinating_conjunction'
  | 'correlative_conjunction'
  | 'infinitive_marker';

export interface GrammarToken {
  id: string;
  word: string;
  pos: 'noun' | 'pronoun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'determiner' | 'interjection';
  role: SyntacticRole;
  roleLabel: string;
  clauseId: string;
  clauseName: string;
  modifiesTarget?: string;
}

export interface ClauseSegment {
  id: string;
  type: ClauseType;
  typeName: string;
  color: string;
  text: string;
  conjunction?: string;
  functionInSentence: string;
  subject: {
    text: string;
    headNoun: string;
    modifiers: string[];
  };
  predicate: {
    verbPhrase: string;
    tense: string;
    transitivity: 'transitive' | 'intransitive' | 'linking';
    directObject?: string;
    indirectObject?: string;
    complement?: string;
    adverbials: string[];
  };
}

export interface ReedKelloggNode {
  clauseId: string;
  clauseType: ClauseType;
  conjunctionToParent?: {
    word: string;
    dashedConnectorText?: string;
  };
  subject: string;
  subjectModifiers: Array<{ word: string; type: 'adjective' | 'determiner' | 'possessive' }>;
  verb: string;
  verbModifiers: Array<{ word: string; type: 'adverb' }>;
  objectOrComplement?: string;
  complementType?: 'direct_object' | 'subject_complement_noun' | 'subject_complement_adj' | 'object_complement';
  objectModifiers?: Array<{ word: string; type: 'adjective' | 'determiner' }>;
  prepPhrases: Array<{
    preposition: string;
    object: string;
    attachesTo: 'subject' | 'verb' | 'object';
    modifiers?: string[];
  }>;
}

export interface SyntacticTreeNode {
  id: string;
  label: string;
  fullLabel: string;
  category: 'clause' | 'phrase' | 'word';
  text?: string;
  color?: string;
  children?: SyntacticTreeNode[];
}

export interface SentenceDiagramData {
  id: string;
  sentence: string;
  classification: SentenceClassificationType;
  classLevelRecommendation: GrammarClassLevel;
  strand: string;
  pedagogicalNotes: string;
  clauses: ClauseSegment[];
  tokens: GrammarToken[];
  reedKellogg: ReedKelloggNode[];
  syntaxTree: SyntacticTreeNode;
}

export type FlashcardDomain = 'irregular_verbs' | 'idioms' | 'grammar_rules';
export type FlashcardReviewRating = 'again' | 'hard' | 'good' | 'easy';
export type FlashcardMastery = 'learning' | 'reviewing' | 'mastered';

export interface IrregularVerbDetails {
  v1: string; // Base / Invariant, e.g. "lie"
  v2: string; // Past simple, e.g. "lay"
  v3: string; // Past participle, e.g. "lain"
  vIng?: string; // Present participle, e.g. "lying"
  v3rd?: string; // 3rd person singular, e.g. "lies"
  phoneticV1?: string;
  phoneticV2?: string;
  phoneticV3?: string;
  confusionWarning?: string; // "Do not confuse with transitive lay/laid/laid"
}

export interface IdiomDetails {
  idiom: string;
  figurativeMeaning: string;
  literalMeaning?: string;
  originOrEtymology?: string;
  dialogueExample: string;
  register?: 'informal' | 'formal' | 'literary' | 'conversational';
  synonymsOrAlternatives?: string[];
}

export interface GrammarRuleDetails {
  ruleName: string;
  category: string; // e.g., 'Agreement', 'Modifiers', 'Conditionals', 'Parallelism'
  incorrectExample: string;
  correctExample: string;
  explanation: string;
  mnemonic?: string;
  examTrapNote?: string;
}

export interface Flashcard {
  id: string;
  domain: FlashcardDomain;
  classLevel: GrammarClassLevel;
  title: string;
  frontPrompt: string;
  backAnswer: string;
  clozeSentence?: string;
  clozeAnswer?: string;
  exampleSentence: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Specific domain payload
  irregularVerbDetails?: IrregularVerbDetails;
  idiomDetails?: IdiomDetails;
  grammarRuleDetails?: GrammarRuleDetails;

  // SRS SM-2 / Leitner state
  box: number; // 1 to 5
  intervalDays: number;
  easeFactor: number; // default 2.5
  repetitions: number;
  lastReviewed?: string;
  nextReviewDate: string; // ISO date
  isBookmarked?: boolean;
  masteryStatus: FlashcardMastery;
  history: Array<{
    date: string;
    rating: FlashcardReviewRating;
    timeSpentSec: number;
  }>;
}

export interface FlashcardDeckStats {
  totalCards: number;
  dueTodayCount: number;
  learningCount: number;
  reviewingCount: number;
  masteredCount: number;
  boxCounts: Record<number, number>;
  retentionRate: number; // 0 to 100%
  streakDays: number;
  reviewedTodayCount: number;
}

// Composition & Writing Skills Studio Types
export type CompositionGenre =
  | 'formal_letter'
  | 'notice'
  | 'diary_entry'
  | 'article_speech'
  | 'story_writing'
  | 'bio_sketch';

export type FormalLetterCategory =
  | 'letter_to_editor'
  | 'complaint_letter'
  | 'inquiry_letter'
  | 'leave_application'
  | 'order_placement';

export type NoticeCategory =
  | 'school_event'
  | 'lost_and_found'
  | 'tour_excursion'
  | 'general_advisory'
  | 'public_notice';

export interface FormalLetterDraft {
  senderAddress: string;
  date: string;
  receiverDesignation: string;
  receiverAddress: string;
  subject: string;
  salutation: string;
  bodyParagraph1: string; // Purpose & Hook
  bodyParagraph2: string; // Detail / Cause / Impact
  bodyParagraph3: string; // Call to action / Resolution
  complimentaryClose: string;
  senderName: string;
  senderDesignation?: string;
}

export interface NoticeDraft {
  issuingAuthority: string; // e.g. "ST. XAVIER'S HIGH SCHOOL, NEW DELHI"
  noticeHeader: string; // "NOTICE"
  dateOfIssue: string; // e.g. "12 October 2026"
  titleOrHeadline: string; // e.g. "ANNUAL INTER-HOUSE DEBATE COMPETITION"
  body: string; // 5 Ws: What, When, Where, Who, Contact
  signatoryName: string; // e.g. "Rohan Sharma"
  signatoryDesignation: string; // e.g. "Head Boy / Secretary, Cultural Club"
  enclosedInBox: boolean; // 50-word box constraint standard
}

export interface RubricCriterionScore {
  criterion: 'Format' | 'Content' | 'Expression' | 'Accuracy';
  scoredMarks: number;
  maxMarks: number;
  rubricExpectations: string[];
  assessedFeedback: string;
}

export interface CompositionEvaluationResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  letterGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Revision';
  wordCount: {
    actual: number;
    recommendedMin: number;
    recommendedMax: number;
    status: 'under' | 'optimal' | 'over';
    penalty: number;
  };
  criteriaBreakdown: RubricCriterionScore[];
  strengths: string[];
  improvements: string[];
  annotatedObservations: Array<{
    targetText: string;
    annotationType: 'format' | 'grammar' | 'vocabulary' | 'praise';
    comment: string;
  }>;
  overallComments: string;
}

export interface CompositionPrompt {
  id: string;
  title: string;
  genre: CompositionGenre;
  subCategory: string;
  classLevels: GrammarClassLevel[];
  scenarioDescription: string;
  inputNotes?: string[];
  prescribedWordCount: { min: number; max: number; target: number };
  maxMarks: number;
  rubric: {
    formatMarks: number;
    contentMarks: number;
    expressionMarks: number;
    accuracyPenaltyNotes: string;
    guidelines: string[];
  };
  sampleSolution?: {
    modelText: string;
    structuredBreakdown?: Record<string, string>;
    markingAnnotations?: Array<{ element: string; marksEarned: string; note: string }>;
  };
}

// ============================================================================
// PHASE 4I: SCOPE & SEQUENCE STUDIO TYPES
// ============================================================================

export type ScopeSequenceDepthLevel =
  | 'Foundational'
  | 'Intermediate'
  | 'Analytical'
  | 'Advanced';

export type ScopeSequenceMasteryStage =
  | 'Introduced'
  | 'Developing'
  | 'Reinforced'
  | 'Mastered'
  | 'Extended';

export type ScopeSequenceProductionStatus =
  | 'Planned'
  | 'Drafting'
  | 'In Review'
  | 'Completed'
  | 'Pre-Press';

export type DependencyRelationType =
  | 'REQUIRED_PREREQUISITE'
  | 'RECOMMENDED_PRIOR_KNOWLEDGE'
  | 'RELATED_CONCEPT'
  | 'LATER_APPLICATION';

export interface ConceptDependencyLink {
  id: string;
  sourceConceptId: string;
  sourceConceptName: string;
  targetConceptId: string;
  targetConceptName: string;
  relationType: DependencyRelationType;
  rationale: string;
  recommendedClassOrStage?: string;
}

export interface ScopeSequenceExerciseItem {
  id: string;
  label: string; // e.g. "Ex A"
  name: string; // e.g. "Recognition & Identification"
  pedagogicalType:
    | 'recognition'
    | 'controlled_practice'
    | 'application'
    | 'editing_correction'
    | 'sentence_transformation'
    | 'contextual_application'
    | 'higher_order_challenge'
    | 'custom';
  targetQuestionsCount: number;
  description: string;
}

export interface AssessmentAlignmentRecord {
  objectiveId: string;
  objectiveText: string;
  taught: boolean;
  practised: boolean;
  assessed: boolean;
  diagnosticInstrument?: string;
  formativeInstrument?: string;
  chapterAssessmentInstrument?: string;
  revisionAssessmentInstrument?: string;
  cumulativeAssessmentInstrument?: string;
}

export interface ScopeSequenceMasterRow {
  id: string;
  seqNumber: number;
  unitId: string;
  unitTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  conceptId: string;
  conceptTitle: string;
  strand: string;
  curriculumMappingCode: string;
  curriculumMappingDescription: string;
  learningObjectives: string[];
  prerequisites: string[];
  priorLearning: string;
  newLearning: string;
  depthLevel: ScopeSequenceDepthLevel;
  masteryStage: ScopeSequenceMasteryStage;
  masteryCode: 'I' | 'D' | 'R' | 'M' | 'E';
  recommendedTeachingLessons: number;
  recommendedTeachingHours: number;
  exerciseProfile: ScopeSequenceExerciseItem[];
  assessmentEvidence: string[];
  assessmentAlignments?: AssessmentAlignmentRecord[];
  keyVocabulary: string[];
  skillsIntegration: string;
  writingConnection: string;
  readingConnection: string;
  speakingListeningConnection: string;
  crossCurricularConnection: string;
  differentiationSupport: string;
  differentiationExtension: string;
  commonMisconceptions: string[];
  boardSystemNotes: string;
  evidenceStatus: EvidenceVerificationStatus;
  evidenceCitation?: string;
  internalMappingId?: string;
  officialCurriculumRef?: string;
  frameworkAssociation?: string;
  isEditorialDemonstration?: boolean;
  currentTreatment?: string;
  nextProgression?: string;
  evidenceRecord?: EvidenceInspectorRecord;
  productionStatus: ScopeSequenceProductionStatus;
  estimatedPages: number;
  teacherNotes?: string;
  authorNotes?: string;
}

export type AuditSeverityLevel = 'CRITICAL' | 'REVIEW' | 'SUGGESTION' | 'INFORMATION';

export interface ScopeSequenceColumnDef {
  id: string;
  key?: string;
  label: string;
  category: 'Structure' | 'Pedagogy' | 'Curriculum' | 'Instruction' | 'Connections' | 'Governance';
  defaultVisible: boolean;
  minWidth: number;
}

export interface ScopeSequenceAuditFinding {
  id: string;
  type:
    | 'missing_prerequisite'
    | 'concept_gap'
    | 'unmapped_objective'
    | 'excessive_repetition'
    | 'premature_mastery'
    | 'missing_reinforcement'
    | 'missing_assessment'
    | 'overloaded_chapter'
    | 'underdeveloped_chapter'
    | 'unbalanced_time'
    | 'assessed_before_teaching'
    | 'unverified_assumption'
    | 'system_conflict'
    | string;
  severity: AuditSeverityLevel;
  title: string;
  description: string;
  recommendation: string;
  affectedRowId?: string;
  affectedConceptId?: string;
  category?: string;
  relatedRowId?: string;
  authorAction?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DEFERRED';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DEFERRED';
  userResolutionNotes?: string;
  isAiGenerated?: boolean;
}

export interface SystemSequenceAdaptationProposal {
  id: string;
  fromSystem: CurriculumSystemId;
  toSystem: CurriculumSystemId;
  targetClassOrStage: string;
  status: 'AI_SUGGESTED_UNVERIFIED' | 'REVIEWED' | 'ACCEPTED';
  terminologyDifferences: Array<{ term: string; explanation: string }>;
  depthDifferences: string;
  sequenceShiftNotes: string;
  pedagogicalTreatmentDifferences: string;
  exerciseStyleDifferences: string;
  assessmentStyleDifferences: string;
  expectedApplication: string;
  universalCorePreserved: string;
}

// -------------------------------------------------------------
// Phase 4J: Board Blueprints & Assessment Intelligence Types
// -------------------------------------------------------------

export type AssessmentIntegrityStatus =
  | 'NOT SET'
  | 'NOT YET MAPPED'
  | 'EDITORIAL MODEL'
  | 'VERITAS EDITORIAL MODEL'
  | 'CURRICULUM-ALIGNED EDITORIAL MODEL'
  | 'CUSTOM / AUTHOR MODEL'
  | 'UNVERIFIED / NEEDS REVIEW'
  | 'SOURCE-MAPPED'
  | 'SOURCE REQUIRED'
  | 'SOURCE ATTACHED'
  | 'REVIEW REQUIRED'
  | 'NEEDS ACADEMIC REVIEW'
  | 'NEEDS SOURCE EVIDENCE'
  | 'VERIFIED'
  | 'VERIFIED BOARD SPECIFICATION'
  | 'DRAFT'
  | 'UNVERIFIED';

export type RichQuestionType =
  | 'mcq'
  | 'multiple_select'
  | 'fill_in_blank'
  | 'cloze'
  | 'gap_filling'
  | 'matching'
  | 'true_false'
  | 'identify'
  | 'label'
  | 'error_detection'
  | 'error_correction'
  | 'editing'
  | 'sentence_transformation'
  | 'sentence_combining'
  | 'sentence_reordering'
  | 'rewrite'
  | 'short_response'
  | 'structured_response'
  | 'extended_response'
  | 'passage_based'
  | 'contextual_grammar'
  | 'reading_comprehension'
  | 'composition'
  | 'letter_email'
  | 'article'
  | 'report'
  | 'notice'
  | 'story_narrative'
  | 'essay'
  | 'summary_precis'
  | 'vocabulary_in_context'
  | 'integrated_language_task'
  | 'custom';

export type MarkingIntelligenceModel =
  | 'exact_objective'
  | 'acceptable_alternatives'
  | 'rule_based'
  | 'keyword_keypoint'
  | 'point_based_rubric'
  | 'analytic_rubric'
  | 'holistic_rubric'
  | 'partial_credit'
  | 'model_response'
  | 'human_review_required';

export interface OpenEndedMarkingGuideline {
  acceptableAlternativeAnswers: string[];
  semanticEquivalenceNotes?: string;
  grammaticalEquivalenceNotes?: string;
  requiredTransformationRule?: string;
  mandatoryKeywords: string[];
  prohibitedChanges: string[];
  preservationOfMeaningRequired: boolean;
  partialMarksAwardable: boolean;
  partialMarksCriteria?: string[];
  manualReviewFallbackRequired: boolean;
}

export interface BlueprintSourceEvidence {
  id: string;
  issuingOrganisation: string; // e.g. "Central Board of Secondary Education", "CISCE", "Cambridge Assessment International Education"
  officialDocumentTitle: string;
  syllabusSpecificationOrFramework: string;
  examinationYearOrVersion: string;
  paperOrComponent: string;
  pageOrSection?: string;
  sourceUrlOrRef?: string;
  verificationDate?: string;
  verifiedBy?: string;
  verificationStatus: AssessmentIntegrityStatus;
  editorialNotes?: string;
}

export interface AssessmentProfileField<T = string> {
  value: T;
  status: AssessmentIntegrityStatus;
  notes?: string;
  evidenceRefId?: string;
}

export interface AssessmentProfile {
  id: string;
  systemId: CurriculumSystemId;
  programme: AssessmentProfileField<string>;
  classOrStageOrQualification: AssessmentProfileField<string>;
  subject: AssessmentProfileField<string>;
  assessmentContext: AssessmentProfileField<string>;
  assessmentType: AssessmentProfileField<string>;
  internalOrExternal: AssessmentProfileField<'Internal' | 'External' | 'Blended'>;
  paperOrComponent: AssessmentProfileField<string>;
  durationMinutes: AssessmentProfileField<number>;
  maximumMarks: AssessmentProfileField<number>;
  sectionStructure: AssessmentProfileField<string>;
  questionFamilies: AssessmentProfileField<string[]>;
  responseTypes: AssessmentProfileField<string[]>;
  markingMethod: AssessmentProfileField<string>;
  cognitiveDemand: AssessmentProfileField<string>;
  skillsAssessed: AssessmentProfileField<string[]>;
  grammarIntegration: AssessmentProfileField<string>;
  writingIntegration: AssessmentProfileField<string>;
  readingIntegration: AssessmentProfileField<string>;
  evidence: BlueprintSourceEvidence[];
  overallStatus: AssessmentIntegrityStatus;
  editorialNotes: string;
}

export interface BlueprintSection {
  id: string;
  sectionCode: string; // e.g. "Section A", "Section B"
  title: string;
  instructions?: string;
  totalMarks: number;
  questionGroups: BlueprintQuestionGroup[];
  isArchived?: boolean;
}

export interface BlueprintQuestionGroup {
  id: string;
  groupCode?: string; // e.g. "Q1", "Q5", "Section B - Part 1"
  title?: string;
  groupTitle?: string;
  rubricNotes?: string;
  slotIds?: string[];
  questionType?: RichQuestionType;
  skill?: string;
  learningObjective?: string;
  markAllocation?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Challenging';
  cognitiveLevel?: CognitiveLevel;
  responseFormat?: string;
  markingRule?: MarkingIntelligenceModel;
  markingGuideline?: OpenEndedMarkingGuideline;
  evidenceStatus?: AssessmentIntegrityStatus;
  evidenceRef?: string;
  samplePrompt?: string;
  internalChoiceNote?: string;
  isArchived?: boolean;
}

export type ExercisePedagogicalPurpose =
  | 'LEARNING PRACTICE'
  | 'FORMATIVE ASSESSMENT'
  | 'CHAPTER ASSESSMENT'
  | 'EXAM PREPARATION';

export interface ExerciseAssessmentAlignment {
  blueprintComponentId?: string;
  blueprintTitle?: string;
  questionFamily?: string;
  skill?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  suggestedMarks?: number;
  learningObjective?: string;
  purpose: ExercisePedagogicalPurpose;
}

export interface BlueprintCoverageMatrixRow {
  id: string;
  requirementCode: string;
  requirementTitle: string;
  skill: string;
  targetMarks: number;
  cognitiveLevel: string;
  evidenceStatus: AssessmentIntegrityStatus;
  bookChaptersCoverage: {
    status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review';
    details: string;
    chapterIds: string[];
  };
  questionBankCoverage: {
    status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review';
    count: number;
    approvedCount: number;
  };
  chapterExercisesCoverage: {
    status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review';
    exerciseCount: number;
  };
  chapterTestsCoverage: {
    status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review';
    count: number;
  };
  assessmentsCoverage: {
    status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review';
    count: number;
  };
}

export interface QuestionBankGapItem {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  componentId?: string;
  chapterId?: string;
  isOfficialRequirement: boolean;
  evidenceStatus: AssessmentIntegrityStatus;
  conceptTitle?: string;
  conceptCode?: string;
  requirementOrigin?: string;
  currentCount?: number;
  targetMinimum?: number;
  gapCount?: number;
  missingQuestionTypes?: string[];
}

export interface BlueprintComprehensiveAuditResult {
  overallAuditStatus: 'PASS' | 'SOURCE REQUIRED' | 'WARNING' | 'ACADEMIC REVIEW';
  targetMarks: number;
  assignedMarks: number;
  marksMatch: boolean;
  auditScore: number;
  issues: Array<{
    id: string;
    rule: string;
    severity: 'BLOCKING' | 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    recommendation: string;
    fieldTarget: string;
  }>;
}

export interface SystemComparisonEntry {
  dimension: string;
  description: string;
  cbse: {
    text: string;
    status: 'SOURCE-BASED' | 'EDITORIAL ANALYSIS' | 'UNVERIFIED';
    citation?: string;
  };
  cisce: {
    text: string;
    status: 'SOURCE-BASED' | 'EDITORIAL ANALYSIS' | 'UNVERIFIED';
    citation?: string;
  };
  cambridge: {
    text: string;
    status: 'SOURCE-BASED' | 'EDITORIAL ANALYSIS' | 'UNVERIFIED';
    citation?: string;
  };
}

export interface SystemSpecificPolicyProfile {
  systemId: CurriculumSystemId;
  systemName: string;
  policyTitle: string;
  regulatoryBody: string;
  frameworkReferences: Array<{
    code: string;
    title: string;
    authority: string;
    year: string;
    description: string;
    isIndependent: boolean;
  }>;
  assessmentRegulatoryRules: string[];
  notes: string;
}

export type SystemPolicyProfile = SystemSpecificPolicyProfile;

export interface BlueprintAuditIssue {
  id: string;
  checkType:
    | 'unsupported_verified_claim'
    | 'missing_source_evidence'
    | 'missing_marks'
    | 'total_mark_mismatch'
    | 'duplicated_components'
    | 'missing_question_types'
    | 'missing_answer_model'
    | 'missing_rubric'
    | 'unlinked_learning_objectives'
    | 'unlinked_chapters'
    | 'insufficient_qb_coverage'
    | 'obsolete_syllabus_version'
    | 'class_stage_mismatch'
    | 'system_mismatch'
    | 'editorial_model_as_official'
    | 'missing_verification_metadata';
  severity: 'PASS' | 'WARNING' | 'SOURCE REQUIRED' | 'ACADEMIC REVIEW' | 'BLOCKING ISSUE';
  title: string;
  description: string;
  remediation: string;
  affectedItem?: string;
}

// =============================================================
// VERITAS ACADEMIC EDITORIAL CLARITY AUDIT
// =============================================================
export type ClarityAuditStatus = 'CLEAR' | 'MINOR_REVIEW' | 'NEEDS_REVISION';

export interface ClarityAuditIssue {
  type: string;
  excerpt?: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ClarityAuditResult {
  status: ClarityAuditStatus;
  issues: ClarityAuditIssue[];
  suggestedRevision: string | null;
  pedagogicalNote: string | null;
}

export interface ClarityAuditRequest {
  questionText: string;
  questionType?: string;
  options?: string[];
  correctAnswer?: string;
  subject?: string;
  board?: string;
  grade?: string;
  chapter?: string;
  learningObjective?: string;
}

// =============================================================
// VERITAS ACADEMIC EDITORIAL ACCURACY & ANSWER KEY AUDIT
// =============================================================
export type EditorialAuditType =
  | 'clarity'
  | 'accuracy'
  | 'difficulty'
  | 'curriculum_alignment'
  | 'distractor_quality'
  | 'duplication'
  | 'inclusivity';

export type AccuracyAuditStatus =
  | 'VERIFIED'
  | 'REVIEW_RECOMMENDED'
  | 'ERROR_FOUND'
  | 'INSUFFICIENT_CONTEXT';

export type AccuracyAnswerStatus =
  | 'CORRECT'
  | 'INCORRECT'
  | 'AMBIGUOUS'
  | 'NOT_APPLICABLE'
  | 'UNVERIFIABLE';

export type AuditConfidence = 'high' | 'medium' | 'low';

export interface AccuracyAuditFinding {
  type: string;
  severity: 'low' | 'medium' | 'high';
  explanation: string;
  excerpt?: string;
}

export interface AccuracyAuditResult {
  status: AccuracyAuditStatus;
  answerStatus: AccuracyAnswerStatus;
  findings: AccuracyAuditFinding[];
  currentAnswer: string | null;
  suggestedAnswer: string | null;
  suggestedQuestionRevision: string | null;
  explanation: string;
  confidence: AuditConfidence;
  editorialNote: string | null;
  rationale?: string | null;
}

export interface AccuracyAuditRequest {
  questionText: string;
  questionType?: string;
  options?: string[];
  currentAnswer?: string;
  rationale?: string;
  marks?: number;
  subject?: string;
  board?: string;
  grade?: string;
  chapter?: string;
  learningObjective?: string;
}

export interface EditorialAuditHistoryRecord {
  id: string;
  timestamp: string;
  auditType: EditorialAuditType;
  questionId: string;
  questionPromptPreview: string;
  fieldModified: 'prompt' | 'correctAnswer' | 'both';
  previousPrompt?: string;
  newPrompt?: string;
  previousAnswer?: string;
  newAnswer?: string;
  userAction: string;
}




