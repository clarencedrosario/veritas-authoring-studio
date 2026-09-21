import { GrammarClassLevel } from '../types';

export type TrimPreset =
  | 'crown_quarto'
  | 'royal_octavo'
  | 'a4'
  | 'a5'
  | 'b5'
  | 'us_letter'
  | 'us_trade'
  | 'custom';

export type DimensionUnit = 'mm' | 'cm' | 'in';

export interface TrimDimension {
  name: string;
  widthMm: number;
  heightMm: number;
  inches: string;
  description: string;
}

export const TRIM_PRESET_MAP: Record<TrimPreset, TrimDimension> = {
  crown_quarto: {
    name: 'Crown Quarto (School Standard)',
    widthMm: 189,
    heightMm: 246,
    inches: '7.44" × 9.69"',
    description: 'Premier standard for school grammar textbooks & illustrated student editions.',
  },
  royal_octavo: {
    name: 'Royal Octavo (Academic)',
    widthMm: 156,
    heightMm: 234,
    inches: '6.14" × 9.21"',
    description: 'High-density academic format for Class 9–12 senior secondary coursebooks.',
  },
  a4: {
    name: 'Standard A4 (Workbook / Binder)',
    widthMm: 210,
    heightMm: 297,
    inches: '8.27" × 11.69"',
    description: 'Generous format for worksheets, teacher masters, and practice drills.',
  },
  a5: {
    name: 'Standard A5 (Pocket Handbook)',
    widthMm: 148,
    heightMm: 210,
    inches: '5.83" × 8.27"',
    description: 'Handy pocket reference guide and quick revision handbook.',
  },
  b5: {
    name: 'B5 College Standard',
    widthMm: 176,
    heightMm: 250,
    inches: '6.93" × 9.84"',
    description: 'International standard for secondary education textbooks.',
  },
  us_letter: {
    name: 'US Letter (Standard Sheet)',
    widthMm: 215.9,
    heightMm: 279.4,
    inches: '8.50" × 11.00"',
    description: 'Standard desktop printer and institutional photocopier dimension.',
  },
  us_trade: {
    name: 'US Trade (6" × 9")',
    widthMm: 152.4,
    heightMm: 228.6,
    inches: '6.00" × 9.00"',
    description: 'Classic trade publication paperback trim for prose & language readers.',
  },
  custom: {
    name: 'Custom Dimensions',
    widthMm: 189,
    heightMm: 246,
    inches: 'Custom',
    description: 'Bespoke press requirements configured manually.',
  },
};

export interface PageGeometry {
  topMarginMm: number;
  bottomMarginMm: number;
  insideMarginMm: number; // Gutter side
  outsideMarginMm: number;
  gutterMm: number; // Additional binding allowance
  headerDistanceMm: number;
  footerDistanceMm: number;
  facingPages: boolean; // Verso/Recto mirrored margins
}

export interface BleedSettings {
  bleedMm: number; // 0, 3, 5, etc.
  bleedMode?: 'none' | 'standard_3mm' | 'extended_5mm' | 'full_bleed';
  slugTopMm: number;
  slugBottomMm: number;
  slugInsideMm: number;
  slugOutsideMm: number;
}

export interface PrintGuidesConfig {
  showMargins: boolean;
  showBleed: boolean;
  showTrim: boolean;
  showSafeArea: boolean;
  showBaselineGrid: boolean;
  showColumnGuides: boolean;
}

export type MasterPageId =
  | 'chapter_opener'
  | 'standard_verso'
  | 'standard_recto'
  | 'exercise_page'
  | 'assessment_page'
  | 'teacher_edition'
  | 'front_matter'
  | 'back_matter'
  | 'blank_page';

export type NamedStyleId =
  | 'book_title'
  | 'unit_title'
  | 'chapter_title'
  | 'chapter_subtitle'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'body'
  | 'example'
  | 'grammar_rule'
  | 'exercise_heading'
  | 'exercise_instruction'
  | 'question'
  | 'caption'
  | 'footnote'
  | 'teacher_note'
  | 'running_header'
  | 'page_number';

export interface TypographyStyle {
  id: NamedStyleId;
  label: string;
  fontFamily: string; // 'Garamond' | 'Century Schoolbook' | 'Georgia' | 'Merriweather' | 'Inter' | 'OpenDyslexic'
  fontSizePt: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  italic: boolean;
  lineHeight: number;
  letterSpacingEm: number;
  spaceBeforePt: number;
  spaceAfterPt: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  isCustomOverride?: boolean;
}

export interface RunningHeaderConfig {
  leftHeaderContent: 'book_title' | 'unit_title' | 'series_title' | 'custom';
  leftCustomText?: string;
  rightHeaderContent: 'chapter_title' | 'section_title' | 'topic_title' | 'custom';
  rightCustomText?: string;
  suppressOnChapterOpener: boolean;
  suppressOnFrontMatter: boolean;
  separator: 'rule' | 'dot' | 'none';
}

export interface PageNumberConfig {
  position: 'bottom_outside' | 'bottom_centre' | 'top_outside';
  frontMatterFormat: 'roman' | 'arabic' | 'hidden'; // i, ii, iii...
  mainMatterFormat: 'arabic' | 'roman'; // 1, 2, 3...
  suppressOnChapterOpener: boolean;
  suppressOnTitlePages: boolean;
}

export type AnswerSpaceType = 'lines' | 'blank' | 'box' | 'writing_area' | 'none';

export type CalloutType =
  | 'remember'
  | 'tip'
  | 'grammar_rule'
  | 'common_error'
  | 'warning'
  | 'did_you_know'
  | 'vocabulary'
  | 'teacher_note';

export type FigurePlacement =
  | 'inline'
  | 'full_width'
  | 'half_width_left'
  | 'half_width_right'
  | 'full_page'
  | 'bleed';

export interface BookProductionSettings {
  id: string;
  presetName: string;
  trimPreset: TrimPreset;
  customWidthMm?: number;
  customHeightMm?: number;
  geometry: PageGeometry;
  bleed: BleedSettings;
  guides: PrintGuidesConfig;
  typography: Record<NamedStyleId, TypographyStyle>;
  runningHeaders: RunningHeaderConfig;
  pageNumbers: PageNumberConfig;
  defaultAnswerSpace: AnswerSpaceType;
  startChapterOnRightPage: boolean; // Enforce recto chapter starts
  keepHeadingsWithNext: boolean;
  avoidBreakInsideExercise: boolean;
  twoColumnGlossary: boolean;
  colorMode: 'full_colour' | 'grayscale';
  edition: 'student' | 'teacher_master';
  paperStock: '70gsm' | '80gsm' | '100gsm';
  paperTint: 'cream' | 'white' | 'ivory';
  zoomPercent: number; // 50, 75, 100, etc.
  canvasMode: 'spread' | 'single' | 'clean_reader';
  targetResolutionDpi?: number; // 300 DPI
  pageOverrides?: Record<number, {
    suppressHeader?: boolean;
    suppressPageNumber?: boolean;
    forcePageBreakBefore?: boolean;
    masterTemplateOverride?: string;
  }>;
}

export type PreflightSeverity = 'error' | 'warning' | 'review' | 'info';

export interface PreflightIssue {
  id: string;
  severity: PreflightSeverity;
  category:
    | 'geometry'
    | 'overset'
    | 'widow_orphan'
    | 'artwork'
    | 'cross_reference'
    | 'blank_page'
    | 'answer_key'
    | 'editorial';
  title: string;
  description: string;
  pageIndex?: number;
  pageNumber?: string;
  unitId?: string;
  chapterId?: string;
  elementId?: string;
  remediation: string;
}

// Renderable elements on a paginated page
export type BlockType =
  | 'half_title'
  | 'title_page'
  | 'imprint_page'
  | 'toc'
  | 'curriculum_matrix'
  | 'unit_opener'
  | 'chapter_opener'
  | 'heading'
  | 'paragraph'
  | 'rule_card'
  | 'example_table'
  | 'callout'
  | 'figure'
  | 'exercise'
  | 'assessment'
  | 'teacher_annotation'
  | 'glossary'
  | 'index'
  | 'answer_key'
  | 'blank_filler';

export interface RenderableBlock {
  id: string;
  type: BlockType;
  title?: string;
  level?: 1 | 2 | 3;
  content?: string;
  metadata?: Record<string, any>;
  calloutType?: CalloutType;
  figureCaption?: string;
  figureNumber?: string;
  figurePlacement?: FigurePlacement;
  figureUrl?: string;
  figureCredit?: string;
  figureAlt?: string;
  figureWarning?: string;
  exerciseData?: any;
  assessmentData?: any;
  tocEntries?: Array<{ title: string; pageNumber: string; unitTitle?: string; level: number }>;
  glossaryEntries?: Array<{ term: string; definition: string; pageRefs: string[] }>;
  indexEntries?: Array<{ term: string; pageNumbers: string[] }>;
  answerKeyEntries?: Array<{ chapterTitle: string; solutions: Array<{ question: string; answer: string }> }>;
  estimatedHeightPt: number;
}

export interface PaginatedPage {
  pageIndex: number; // 0-based
  displayPageNumber: string; // e.g. "i", "iv", "1", "14"
  numericPageNumber: number; // 1-based sequential
  isVerso: boolean; // Left-hand page (even in book layout)
  isRecto: boolean; // Right-hand page (odd in book layout)
  isCoverOrTitle: boolean;
  masterPageId: MasterPageId;
  pageType?: string;
  unitTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  blocks: RenderableBlock[];
  hasWidowOrphan?: boolean;
  hasOverset?: boolean;
  isIntentionalBlank?: boolean;
}
