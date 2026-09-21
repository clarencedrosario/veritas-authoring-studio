export type ArchitectureHealthStatus =
  | 'Not Configured'
  | 'Draft'
  | 'Needs Review'
  | 'Configured'
  | 'Verified';

export type BookPositioningType =
  | 'Core Coursebook'
  | 'Grammar & Composition Book'
  | 'Supplementary Grammar'
  | 'Examination Preparation'
  | 'Skills Development'
  | 'Reference & Practice Book';

export type VisualDensityType = 'Low' | 'Moderate' | 'Rich';

export type VisualAssetStatus = 'Preferred' | 'Optional' | 'Restricted' | 'Not Used';

export type BloomCognitiveLevel =
  | 'Remember'
  | 'Understand'
  | 'Apply'
  | 'Analyze'
  | 'Evaluate'
  | 'Create';

export type ExerciseDifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Advanced';

export type EnglishVarietyType =
  | 'British English'
  | 'Indian English conventions'
  | 'International English'
  | 'Custom';

// 1. Book Purpose & Positioning
export interface BookPurposePositioning {
  bookPurpose: string;
  targetLearner: {
    ageRange: string;
    classOrStage: string;
    expectedPriorKnowledge: string;
    learnerProfile: string;
  };
  curriculumContext: {
    boardOrProgramme: string;
    curriculumFramework: string;
    languageStandard: string;
    examinationRelevance: string;
  };
  bookPositioning: BookPositioningType;
  pedagogicalPromise: string;
}

// 2. Learning Architecture
export interface LearningStrand {
  id: string;
  title: string;
  description: string;
  relativeEmphasis: 'Core' | 'High' | 'Moderate' | 'Supportive';
  curriculumLinks: string[];
  contributingChapters: string[];
}

export interface LearningArchitecture {
  priorKnowledge: string;
  entryCompetencies: string[];
  endOfBookCompetencies: string[];
  coreStrands: LearningStrand[];
}

// 3. Pedagogical Model
export interface PedagogicalStage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName?: string;
}

export interface PedagogicalModel {
  modelName: string;
  modelDescription: string;
  stages: PedagogicalStage[];
}

// 4. Standard Chapter Architecture
export interface ChapterComponentAnatomy {
  id: string;
  name: string;
  category: 'opener' | 'instruction' | 'practice' | 'review' | 'assessment' | 'back_matter';
  isRequired: boolean;
  editionTarget: 'student' | 'teacher' | 'both';
  defaultEstimatedPages: number;
  description?: string;
}

export interface StandardChapterArchitecture {
  components: ChapterComponentAnatomy[];
  notes?: string;
}

// 5. Exercise & Practice Architecture
export interface ExerciseProgressionTier {
  id: string;
  name: string;
  purpose: string;
  suggestedQuestionTypes: string[];
  typicalQuestionCount: number;
  difficulty: ExerciseDifficultyLevel;
  marksPerItem: number;
  bloomLevel: BloomCognitiveLevel;
  isRequired: boolean;
}

export interface QuestionTypeSpec {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalMarks: number;
  typicalTimeMinutes: number;
  autoGradable: boolean;
  bloomLevel: string;
  frequencyRecommendation: string;
}

export interface ExerciseDistributionRule {
  id: string;
  title: string;
  description: string;
  minPercentage: number;
  maxPercentage: number;
  enforcementLevel: string;
}

export interface ExerciseArchitecture {
  levels: ExerciseProgressionTier[];
  questionTypes?: QuestionTypeSpec[];
  distributionRules?: ExerciseDistributionRule[];
  rubrics?: any[];
  notes?: string;
}

// 6. Assessment Philosophy
export interface AssessmentPhilosophyTier {
  id: string;
  name: string;
  purpose: string;
  frequency: string;
  approximateMarks: string | number;
  questionMix: string;
  difficultyDistribution: string;
  feedbackModel: string;
}

export interface AssessmentPhilosophy {
  components: AssessmentPhilosophyTier[];
  notes?: string;
}

// 7. Visual & Design Architecture
export interface VisualAssetGuideline {
  id: string;
  name: string;
  status: VisualAssetStatus;
  usageGuideline: string;
}

export interface VisualArchitecture {
  visualDensity: VisualDensityType;
  approxVisualsPerChapter: number;
  assetTypes: VisualAssetGuideline[];
  accessibility: {
    requireCaptions: boolean;
    requireAltText: boolean;
    wcagContrastCompliance: boolean;
    readableTypeMinimum: boolean;
    nonColourDependentMeaning: boolean;
    notes: string;
  };
}

// 8. Language & Editorial Style
export interface EditorialStyleArchitecture {
  englishVariety: EnglishVarietyType;
  spellingStandard: string;
  punctuationConvention: string;
  capitalisation: string;
  terminologyConventions: string;
  grammarTerminology: string;
  exampleSentenceStyle: string;
  tone: string;
  readingLevel: string;
  inclusivityGuidance: string;
  sensitiveContentGuidance: string;
  editorialStyleNotes: string;
}

// 9. Series Progression
export interface SeriesProgressionTier {
  classOrStage: string;
  title: string;
  concepts: string[];
}

export interface SeriesProgressionArchitecture {
  previousVolume: {
    classOrStage: string;
    title: string;
    inheritedConcepts: string[];
  };
  currentVolume: {
    classOrStage: string;
    title: string;
    reinforcedConcepts: string[];
    newConceptsIntroduced: string[];
  };
  nextVolume: {
    classOrStage: string;
    title: string;
    preparedConcepts: string[];
  };
}

// 10. Book Architecture Health Report
export interface ArchitectureHealthCheck {
  id: string;
  title: string;
  isPassed: boolean;
  message: string;
}

export interface ArchitectureWarning {
  id: string;
  severity: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
}

export interface BookArchitectureHealthReport {
  status: ArchitectureHealthStatus;
  checks: ArchitectureHealthCheck[];
  warnings: ArchitectureWarning[];
  lastAudited: string;
}

// Full Config Object
export interface BookArchitectureConfig {
  version: string;
  lastEdited: string;
  purposePositioning: BookPurposePositioning;
  learningArchitecture: LearningArchitecture;
  pedagogicalModel: PedagogicalModel;
  chapterArchitecture: StandardChapterArchitecture;
  exerciseArchitecture: ExerciseArchitecture;
  assessmentPhilosophy: AssessmentPhilosophy;
  visualArchitecture: VisualArchitecture;
  editorialStyle: EditorialStyleArchitecture;
  seriesProgression: SeriesProgressionArchitecture;
  health?: BookArchitectureHealthReport;
}

// AI Assistant Suggestion Type
export interface ArchitectureSuggestion {
  id: string;
  category:
    | 'strand'
    | 'prerequisite'
    | 'chapter_sequence'
    | 'age_appropriateness'
    | 'exercise_balance'
    | 'assessment_balance'
    | 'visual_opportunity'
    | 'page_budget'
    | 'progression';
  title: string;
  rationale: string;
  proposedAction: string;
  targetSection: string;
  targetField?: string;
  payload: any;
  status: 'pending' | 'accepted' | 'rejected';
}
