import {
  StudioChapter,
  ChapterSection,
  WorkedExampleItem,
  Component07Data,
  CommonErrorItem,
  Component10Data,
  TipRememberItem,
  Component11Data,
} from '../../../types';

export type ComponentCategory =
  | 'opener'
  | 'instruction'
  | 'practice'
  | 'review'
  | 'assessment'
  | 'back_matter';

export type ComponentEditorType =
  | 'structured_fields'
  | 'block_sequence'
  | 'specialised';

export type ComponentTargetAudience = 'student' | 'teacher' | 'both';

export type ComponentStatus =
  | 'not_started'
  | 'draft'
  | 'in_progress'
  | 'complete'
  | 'needs_review';

export interface ValidationRule {
  id: string;
  label: string;
  check: (chapter: StudioChapter, componentData?: any) => { valid: boolean; message?: string };
}

export interface ChapterComponentDefinition {
  id: string; // e.g., 'comp-7', 'comp-10', 'comp-11'
  componentNumber: number; // 1 to 23
  title: string;
  shortTitle: string;
  category: ComponentCategory;
  categoryLabel: string;
  description: string;
  defaultEstimatedPages: number;
  isRequired: boolean;
  targetAudience: ComponentTargetAudience;
  editorType: ComponentEditorType;
  supportedBlockTypes: string[];
  iconName?: string;
  badgeColor?: string;
  pedagogicalRole: string;
  
  // Grade & Board Guidelines
  gradeGuidanceNotes?: Record<string, string>; // e.g. { 'Class 1–2': '...', 'Class 6–8': '...' }

  // AI Prompt Configuration
  aiPromptConfig: {
    systemRole: string;
    taskPromptTemplate: string;
    constraints: string[];
    expectedJsonFormat: string;
  };

  // Validation Rules
  validationRules: ValidationRule[];

  // Export & Print Rules
  exportRules: {
    headingLevel: 2 | 3 | 4;
    includeInStudentEdition: boolean;
    includeInTeacherEdition: boolean;
    calloutBoxTheme?: string;
    exportRendererId: string;
  };
}

export type ViewDisplayMode = 'authoring' | 'student_preview' | 'teacher_preview';

export interface ComponentEngineProps {
  definition: ChapterComponentDefinition;
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  isDarkMode?: boolean;
}
