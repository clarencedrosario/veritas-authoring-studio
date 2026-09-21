// =============================================================
// VERITAS Editorial Platform — Visual & Illustration Studio Types
// Phase 4E-1: Visual Production Foundation for Academic Publishing
// =============================================================

export type VisualType =
  | 'Educational Illustration'
  | 'Grammar Diagram'
  | 'Sentence Diagram'
  | 'Concept Map'
  | 'Flowchart'
  | 'Classification Diagram'
  | 'Comparison Chart'
  | 'Process Diagram'
  | 'Timeline'
  | 'Table'
  | 'Infographic'
  | 'Labelled Illustration'
  | 'Picture Vocabulary'
  | 'Picture-Based Exercise'
  | 'Worked Example Visual'
  | 'Revision Visual'
  | 'Icon / Symbol Set'
  | 'Photograph Brief'
  | 'Map'
  | 'Custom Educational Visual'
  // Backward-compatible aliases
  | 'Labelled Diagram'
  | 'Unlabelled Diagram'
  | 'Photograph'
  | 'Icon / Symbol'
  | 'Decorative Illustration'
  | 'Callout Illustration'
  | 'Reference Figure'
  | 'Custom Visual';

export type VisualProductionStatus =
  | 'Brief Required'
  | 'Brief Draft'
  | 'Brief Ready'
  | 'Artwork Required'
  | 'Artwork Requested'
  | 'AI Draft'
  | 'Artist Draft'
  | 'In Review'
  | 'Revision Requested'
  | 'Approved'
  | 'Final Artwork'
  | 'Inserted in Chapter'
  | 'Layout Ready'
  // Backward-compatible aliases
  | 'Placeholder'
  | 'Draft Artwork'
  | 'Editorial Review'
  | 'Revision Required'
  | 'Publication Ready';

export type VisualPedagogicalPurpose =
  | 'Introduce Concept'
  | 'Explain Concept'
  | 'Demonstrate Rule'
  | 'Provide Example'
  | 'Compare Concepts'
  | 'Show Process'
  | 'Support Memory'
  | 'Practice / Exercise'
  | 'Assessment Stimulus'
  | 'Exercise Stimulus'
  | 'Revision'
  | 'Decorative / Engagement';

export type VisualOrientation = 'Portrait' | 'Landscape' | 'Square' | 'Flexible';

export type VisualPlacement =
  | 'Full Width'
  | 'Half Width'
  | 'Inline'
  | 'Margin'
  | 'Boxed Feature'
  | 'Full Page';

export type VisualSourceType =
  | 'Visual Brief Only'
  | 'Placeholder'
  | 'Uploaded Artwork'
  | 'Existing Asset'
  | 'AI Generated Artwork';

export interface VisualArtworkAsset {
  versionNumber: number;
  filename: string;
  fileType: string;
  fileSize?: string;
  dimensions?: { width: number; height: number };
  artworkUrl?: string;
  uploadedAt: string;
  notes?: string;
  isApproved?: boolean;
}

export interface VisualBrief {
  description: string;
  requiredElements: string[];
  optionalElements: string[];
  elementsToAvoid: string[];
  charactersPeople: string;
  settingEnvironment: string;
  objectsProps: string;
  labelsRequired: string[];
  textInsideArtwork: string;
  ageAppropriateness: string;
  visualComplexity: 'Simple' | 'Moderate' | 'Detailed';
  suggestedComposition: string;
  orientation: VisualOrientation;
  placement: VisualPlacement;
  suggestedSize: string;
  colourGuidance: string;
  styleGuidance: string;
  accessibilityConsiderations: string;
  illustratorInstructions: string;
  editorialNotes: string;
  referenceNotes: string;
}

export interface VisualPublishingMetadata {
  figureNumber: string;
  caption: string;
  shortCaption?: string;
  altText: string;
  creditSource: string;
  copyrightStatus: 'Original Commission' | 'In-House Editorial' | 'Licensed' | 'Public Domain' | 'Creative Commons';
  rightsPermission: string;
  creatorIllustrator: string;
  dateCreated: string;
  finalAssetFilename?: string;
  createdBy?: string;
  generationMethod?: 'AI-Generated' | 'Human Commissioned' | 'Hybrid Editorial' | 'Template Vector';
  aiAssisted?: boolean;
  reviewStatus?: 'Pending' | 'Needs Changes' | 'Approved for Publication' | 'Archived';
  approvalDate?: string;
  approvedBy?: string;
  printDimensions?: string;
  resolution?: string;
  fileFormat?: string;
}

// =============================================================
// Phase 4E-2: Educational Visual Intelligence Data Contracts
// =============================================================

export type VisualPriority = 'Essential' | 'Recommended' | 'Optional';
export type VisualComplexity = 'Simple' | 'Moderate' | 'Detailed';

export interface VisualOpportunityRecommendation {
  id: string;
  sectionId: string;
  sectionTitle: string;
  concept: string;
  learningObjective: string;
  recommendedVisualType: VisualType;
  pedagogicalPurpose: VisualPedagogicalPurpose;
  reasonWhyUseful: string;
  suggestedPlacement: VisualPlacement;
  priority: VisualPriority;
  estimatedComplexity: VisualComplexity;
  scenePrompt?: string;
  suggestedTitle: string;
  suggestedLabels: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'brief_created';
}

export type ReviewEvaluationStatus = 'PASS' | 'REVIEW' | 'ISSUE' | 'NOT CHECKED';

export interface VisualQualityReviewCheckItem {
  id: string;
  category:
    | 'Curriculum & Concept'
    | 'Pedagogy & Age'
    | 'Brief Elements'
    | 'Labels & Typography'
    | 'Spelling & Grammar'
    | 'Visual Clarity'
    | 'Accessibility'
    | 'Print Suitability'
    | 'Exercise Compatibility';
  criterion: string;
  status: ReviewEvaluationStatus;
  finding: string;
  remedy?: string;
}

export interface EducationalSafetyFlag {
  id: string;
  type:
    | 'Incorrect Grammar Label'
    | 'Misspelled Text'
    | 'Contradictory Example'
    | 'Age-Inappropriate Imagery'
    | 'Stereotyped Representation'
    | 'Brand / Commercial Logo'
    | 'Copyright-Sensitive Element'
    | 'Irrelevant Decorative Clutter'
    | 'Confusing Visual Hierarchy';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedCorrection: string;
}

export interface VisualQualityReviewReport {
  overallStatus: ReviewEvaluationStatus;
  passPercentage: number;
  reviewedAt: string;
  reviewerOrAgent: string;
  summaryNote: string;
  checks: VisualQualityReviewCheckItem[];
  safetyFlags: EducationalSafetyFlag[];
  isPublicationReady: boolean;
}

export interface BriefComparisonRow {
  id: string;
  requiredItem: string;
  expected: string;
  detected: string;
  status: 'PASS' | 'REVIEW' | 'ISSUE';
  editorialComment: string;
}

export type ArtworkVariationType =
  | 'Composition Variation'
  | 'Simpler Version'
  | 'More Detailed Version'
  | 'Younger Learner Version'
  | 'Older Learner Version'
  | 'Diagram Version'
  | 'Illustration Version'
  | 'Black-and-White Version'
  | 'Print-Friendly Version';

export interface EducationalDiagramOption {
  id: string;
  label: string;
  category:
    | 'Grammar structures'
    | 'Sentence relationships'
    | 'Parts of speech'
    | 'Sentence diagrams'
    | 'Concept relationships'
    | 'Classification trees'
    | 'Flowcharts'
    | 'Comparison diagrams'
    | 'Timelines'
    | 'Process diagrams'
    | 'Revision maps';
  description: string;
  suggestedFor: string;
}

export interface GeneratedExerciseLink {
  id: string;
  exerciseTitle: string;
  exerciseType: string;
  instructions: string;
  questions: Array<{
    id: string;
    itemNumber: number;
    prompt: string;
    expectedAnswer: string;
    marks: number;
    explanation?: string;
  }>;
}

export interface VisualReviewChecks {
  educationalAccuracy: boolean;
  grammarAccuracy: boolean;
  ageAppropriateness: boolean;
  visualClarity: boolean;
  captionAccuracy: boolean;
  labelAccuracy: boolean;
  accessibility: boolean;
  boardRelevance: boolean;
  publicationSuitability: boolean;
}

export interface VisualReviewInfo {
  reviewStatus: 'Pending' | 'Needs Changes' | 'Approved for Publication' | 'Archived';
  reviewer: string;
  reviewNotes: string;
  revisionRequested: string;
  approvalDate?: string;
  reviewChecks: VisualReviewChecks;
}

export interface VisualStatusHistoryItem {
  status: VisualProductionStatus;
  timestamp: string;
  note: string;
  author: string;
}

export interface VisualRecord {
  id: string;
  figureNumber: string;
  title: string;
  visualType: VisualType;
  purpose: VisualPedagogicalPurpose;
  learningObjectiveSupported: string;
  conceptSupported: string;
  status: VisualProductionStatus;
  statusHistory: VisualStatusHistoryItem[];
  // Curriculum & Chapter Context
  board: string;
  classLevel: string;
  bookTitle?: string;
  unit: string | number;
  chapterNumber: number;
  chapterTitle: string;
  associatedSectionId?: string;
  associatedSectionTitle?: string;
  associatedBlockId?: string;
  architectureComponentId?: string;
  // Brief
  brief: VisualBrief;
  // Publishing Metadata
  metadata: VisualPublishingMetadata;
  // Artwork Assets & Versions
  sourceType: VisualSourceType;
  currentAsset?: VisualArtworkAsset;
  versions: VisualArtworkAsset[];
  // Review & Quality
  review: VisualReviewInfo;
  // Exercise Stimulus Linkage
  isExerciseStimulus?: boolean;
  linkedExerciseId?: string;
  linkedQuestionId?: string;
  stimulusPrompt?: string;
}
