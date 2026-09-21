// =============================================================
// VERITAS Editorial Platform — Visual Studio Defaults & Utilities
// Phase 4E-1: Chapter Demonstration & Synchronization
// =============================================================

import {
  VisualRecord,
  VisualType,
  VisualProductionStatus,
  VisualPedagogicalPurpose,
  VisualArtworkAsset,
} from '../types/visualStudio';
import { StudioChapter, TextbookContentBlock } from '../types';

/**
 * Returns the default demonstration visuals for CBSE Class 3 Unit 1 Chapter 1
 * ("Nouns: Naming Words (Common & Proper)"), adhering strictly to Section 22.
 */
export function createDefaultChapterVisuals(chapter: StudioChapter): VisualRecord[] {
  const chNum = chapter.chapterNumber || 1;

  const sampleClassroomSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF8"/>
      <stop offset="100%" stop-color="#F3E9D9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#35101F" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background / Classroom Wall -->
  <rect width="800" height="480" fill="url(#bgGrad)" />
  <rect y="380" width="800" height="100" fill="#E2D4C0" />
  <line x1="0" y1="380" x2="800" y2="380" stroke="#CBBEAC" stroke-width="3" />

  <!-- Window with Tree (Place) -->
  <g transform="translate(480, 50)" filter="url(#shadow)">
    <rect width="180" height="150" rx="8" fill="#EBF4F6" stroke="#5A1832" stroke-width="4"/>
    <rect x="10" y="10" width="75" height="60" fill="#D2E8EE"/>
    <rect x="95" y="10" width="75" height="60" fill="#D2E8EE"/>
    <rect x="10" y="80" width="75" height="60" fill="#D2E8EE"/>
    <rect x="95" y="80" width="75" height="60" fill="#D2E8EE"/>
    <!-- Tree canopy -->
    <circle cx="90" cy="70" r="38" fill="#7EA172" opacity="0.8"/>
    <circle cx="65" cy="50" r="28" fill="#5F8853" opacity="0.9"/>
    <!-- Label: PLACE -->
    <rect x="40" y="160" width="100" height="24" rx="12" fill="#5A1832" />
    <text x="90" y="176" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold" fill="#FFFDF8">garden (place)</text>
  </g>

  <!-- Blackboard (Thing) -->
  <g transform="translate(80, 50)" filter="url(#shadow)">
    <rect width="340" height="180" rx="8" fill="#3D5A45" stroke="#9A7438" stroke-width="6"/>
    <text x="170" y="45" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#FFFDF8" letter-spacing="1">NAMING WORDS (NOUNS)</text>
    <line x1="40" y1="60" x2="300" y2="60" stroke="#C29A52" stroke-width="2"/>
    <text x="50" y="95" font-family="sans-serif" font-size="14" fill="#F6F0E7">• People: teacher, boy, girl</text>
    <text x="50" y="125" font-family="sans-serif" font-size="14" fill="#F6F0E7">• Places: classroom, school, park</text>
    <text x="50" y="155" font-family="sans-serif" font-size="14" fill="#F6F0E7">• Things: desk, book, clock, bag</text>
  </g>

  <!-- Wall Clock (Thing) -->
  <g transform="translate(435, 70)">
    <circle cx="20" cy="20" r="24" fill="#FFFDF8" stroke="#5A1832" stroke-width="3"/>
    <line x1="20" y1="20" x2="20" y2="8" stroke="#292521" stroke-width="2"/>
    <line x1="20" y1="20" x2="30" y2="20" stroke="#292521" stroke-width="2"/>
    <circle cx="20" cy="20" r="2.5" fill="#C29A52"/>
    <rect x="-15" y="48" width="70" height="20" rx="10" fill="#CBBEAC"/>
    <text x="20" y="62" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="#35101F">clock (thing)</text>
  </g>

  <!-- Teacher (Person) -->
  <g transform="translate(130, 240)">
    <circle cx="45" cy="30" r="22" fill="#E8C59A"/> <!-- Face -->
    <path d="M 23 25 Q 45 5 67 25" fill="#35101F"/> <!-- Hair -->
    <rect x="25" y="52" width="40" height="85" rx="10" fill="#5A1832"/> <!-- Saree/Dress -->
    <rect x="65" y="70" width="28" height="18" rx="3" fill="#C29A52"/> <!-- Book in hand -->
    <!-- Label: PERSON -->
    <rect x="-5" y="145" width="100" height="24" rx="12" fill="#5A1832"/>
    <text x="45" y="161" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold" fill="#FFFDF8">teacher (person)</text>
  </g>

  <!-- Student Desk & Student (Person + Things) -->
  <g transform="translate(420, 270)" filter="url(#shadow)">
    <!-- Student -->
    <circle cx="70" cy="15" r="18" fill="#E2B788"/>
    <rect x="52" y="33" width="36" height="50" rx="8" fill="#2E5A88"/>
    <!-- Wooden Desk -->
    <rect x="10" y="65" width="200" height="25" rx="4" fill="#C49A5A" stroke="#7A5422" stroke-width="2"/>
    <rect x="25" y="90" width="12" height="60" fill="#7A5422"/>
    <rect x="185" y="90" width="12" height="60" fill="#7A5422"/>
    <!-- Book & Bag on Desk -->
    <rect x="40" y="55" width="35" height="12" rx="2" fill="#BE3A34"/>
    <rect x="130" y="45" width="28" height="24" rx="6" fill="#3D5A45"/>
    <!-- Labels -->
    <rect x="55" y="155" width="110" height="24" rx="12" fill="#5A1832"/>
    <text x="110" y="171" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold" fill="#FFFDF8">student (person)</text>
  </g>

  <!-- Foreground Title Tag -->
  <g transform="translate(20, 20)">
    <rect width="180" height="26" rx="6" fill="#5A1832" />
    <text x="12" y="17" font-family="serif" font-size="12" font-weight="bold" fill="#C29A52">VERITAS SPECIMEN ARTWORK</text>
  </g>
</svg>
`)}`;

  const defaultAsset1: VisualArtworkAsset = {
    versionNumber: 1,
    filename: `cbse_c${chapter.equivalentClass || 3}_u1_fig1_1_classroom_nouns.svg`,
    fileType: 'image/svg+xml',
    fileSize: '42 KB',
    dimensions: { width: 800, height: 480 },
    artworkUrl: sampleClassroomSvg,
    uploadedAt: '2026-09-02T10:30:00Z',
    notes: 'Approved vector specimen depicting classroom nouns with educational color-coded callouts.',
    isApproved: true,
  };

  const visual1: VisualRecord = {
    id: `vis-${chapter.id}-1`,
    figureNumber: `Figure ${chNum}.1`,
    title: 'Common Nouns Around Us',
    visualType: 'Educational Illustration',
    purpose: 'Introduce Concept',
    learningObjectiveSupported:
      'Identify and categorize common naming words (people, places, animals, things) in everyday environments.',
    conceptSupported: 'Naming Words: Common Nouns (Everyday People, Places, Things)',
    status: 'Brief Ready',
    statusHistory: [
      {
        status: 'Brief Required',
        timestamp: '2026-08-28T09:00:00Z',
        note: 'Visual requirement registered from Chapter Architecture Opener & Concept 1.',
        author: 'Chief Commissioning Editor',
      },
      {
        status: 'Brief Ready',
        timestamp: '2026-09-01T14:15:00Z',
        note: 'Visual Brief completed with age-appropriate classroom setting, labels, and exercise stimulus prompt.',
        author: 'Primary Grammar Author',
      },
    ],
    board: chapter.systemId || 'CBSE',
    classLevel: (chapter.equivalentClass as string) || 'Class 3',
    bookTitle: chapter.bookTitle || 'Step-by-Step English Grammar: Class 3',
    unit: chapter.unitTitle || 'Unit 1: The World of Naming Words (Nouns)',
    chapterNumber: chNum,
    chapterTitle: chapter.title || 'Nouns: Naming Words (Common & Proper)',
    associatedSectionId: chapter.sections[0]?.id,
    associatedSectionTitle: chapter.sections[0]?.title || '1.1 What Are Naming Words?',
    brief: {
      description:
        'A cheerful, relatable primary classroom scene filled with clearly identifiable people (teacher, students), places (classroom, garden through window), and objects (blackboard, books, desks, clock, school bag). The scene serves as an inviting discovery ground for learners to identify naming words.',
      requiredElements: [
        'A friendly teacher (person) holding a book',
        'Students at wooden desks (people)',
        'Classroom blackboard with simple naming word examples (thing)',
        'Window revealing garden greenery and tree (place)',
        'School supplies: books, pencils, school bag, clock (things)',
      ],
      optionalElements: ['Small classroom pet or bird outside window (animal)', 'Classroom wall chart'],
      elementsToAvoid: [
        'Overcrowded or chaotic clutter',
        'Small unreadable text',
        'Distracting background elements',
      ],
      charactersPeople:
        'Ms. Priya (friendly primary teacher in Indian saree) and two attentive students (Aarav and Riya, ages 8-9).',
      settingEnvironment:
        'Sunlit primary school classroom with warm wooden desks, green blackboard, and a window opening to garden greenery.',
      objectsProps:
        'Blackboard, wooden desk, textbook, notebook, pencil box, school bag, wall clock, water bottle.',
      labelsRequired: ['teacher', 'student', 'blackboard', 'desk', 'book', 'clock', 'garden'],
      textInsideArtwork: 'NAMING WORDS (NOUNS)',
      ageAppropriateness: 'Class 3 (Ages 8-9) — warm, inviting, encouraging discovery without academic intimidation.',
      visualComplexity: 'Moderate',
      suggestedComposition:
        'Two-third wide landscape orientation with teacher on the left, blackboard behind, and student desks extending to the right foreground.',
      orientation: 'Landscape',
      placement: 'Full Width',
      suggestedSize: 'Half Page (180mm x 110mm)',
      colourGuidance:
        'Warm institutional palette: Soft parchment wall, antique gold wood tones, forest green chalkboard, deep burgundy accents.',
      styleGuidance:
        'Clean editorial textbook line art with soft watercolor tints. High clarity, friendly figures, no photographic noise.',
      accessibilityConsiderations:
        'Minimum 4.5:1 text contrast on blackboard; labels in clear sans-serif typography; distinct object silhouettes.',
      illustratorInstructions:
        'Keep linework bold and legible for standard offset printing on uncoated textbook paper (80 GSM maplitho).',
      editorialNotes:
        'This visual acts as the primary opening hook for Class 3 Chapter 1 and connects directly to Exercise A as a picture stimulus.',
      referenceNotes: 'Align with NCERT/CBSE Class 3 English Marigold/Mridang visual benchmark style.',
    },
    metadata: {
      figureNumber: `Figure ${chNum}.1`,
      caption:
        `Figure ${chNum}.1: Look around this lively classroom! Everything you see has a name. Can you identify five common naming words?`,
      shortCaption: 'Classroom Naming Words',
      altText:
        'An illustrated elementary school classroom showing a teacher, students at desks, a blackboard, books, and school items used to demonstrate common nouns.',
      creditSource: 'VERITAS Academic Art Studio',
      copyrightStatus: 'Original Commission',
      rightsPermission: 'Exclusive Educational Publishing Rights — Worldwide',
      creatorIllustrator: 'Priya Sharma & Editorial Design Unit',
      dateCreated: '2026-09-01',
      finalAssetFilename: `cbse_c${chapter.equivalentClass || 3}_u1_fig1_1_classroom_nouns.png`,
    },
    sourceType: 'Uploaded Artwork',
    currentAsset: defaultAsset1,
    versions: [defaultAsset1],
    review: {
      reviewStatus: 'Pending',
      reviewer: 'Senior Academic Editor (English Language Teaching)',
      reviewNotes:
        'Illustration brief fully aligns with CBSE Class 3 curriculum. Sample artwork uploaded meets print resolution and pedagogical criteria.',
      revisionRequested: '',
      approvalDate: '2026-09-02',
      reviewChecks: {
        educationalAccuracy: true,
        grammarAccuracy: true,
        ageAppropriateness: true,
        visualClarity: true,
        captionAccuracy: true,
        labelAccuracy: true,
        accessibility: true,
        boardRelevance: true,
        publicationSuitability: true,
      },
    },
    isExerciseStimulus: true,
    linkedExerciseId: chapter.exercises[0]?.id || 'ex-1',
    stimulusPrompt:
      `Look at Figure ${chNum}.1 above. Identify and write four Common Nouns for people and things you can see in the classroom.`,
  };

  const visual2: VisualRecord = {
    id: `vis-${chapter.id}-2`,
    figureNumber: `Figure ${chNum}.2`,
    title: 'Common Noun vs Proper Noun',
    visualType: 'Comparison Chart',
    purpose: 'Compare Concepts',
    learningObjectiveSupported:
      'Distinguish between general common nouns and specific proper nouns that require initial capital letters.',
    conceptSupported: 'Contrasting General Nouns and Capitalized Proper Nouns',
    status: 'Placeholder',
    statusHistory: [
      {
        status: 'Brief Required',
        timestamp: '2026-09-02T11:00:00Z',
        note: 'Comparison chart required for Section 1.2 Common & Proper Nouns.',
        author: 'Grammar Series Editor',
      },
      {
        status: 'Placeholder',
        timestamp: '2026-09-03T16:20:00Z',
        note: 'Inserted production placeholder into Section 1.2 while typographic schematic is finalized.',
        author: 'Lead Typesetter',
      },
    ],
    board: chapter.systemId || 'CBSE',
    classLevel: (chapter.equivalentClass as string) || 'Class 3',
    bookTitle: chapter.bookTitle || 'Step-by-Step English Grammar: Class 3',
    unit: chapter.unitTitle || 'Unit 1: The World of Naming Words (Nouns)',
    chapterNumber: chNum,
    chapterTitle: chapter.title || 'Nouns: Naming Words (Common & Proper)',
    associatedSectionId: chapter.sections[1]?.id || chapter.sections[0]?.id,
    associatedSectionTitle:
      chapter.sections[1]?.title || '1.2 Common Nouns and Proper Nouns',
    brief: {
      description:
        'A side-by-side two-column comparison card contrasting five common noun concepts on the left (boy, city, river, dog, school) with specific, capitalized proper noun specimens on the right (Kabir, Mumbai, Ganga, Rocky, St. Mary School). Capital letters on proper nouns are highlighted in bold antique gold.',
      requiredElements: [
        'Column A: Common Nouns (general names, lowercase)',
        'Column B: Proper Nouns (special names, capital initials highlighted)',
        '5 explicit contrasting pairs: boy -> Kabir, girl -> Riya, city -> Mumbai, dog -> Rocky, river -> Ganga',
        'Callout note pointing to the capital letters',
      ],
      optionalElements: ['Visual icons next to each pair (person icon, city building icon, river icon)'],
      elementsToAvoid: ['Ambiguous words that can be both common and proper without context', 'All-caps text in Column A'],
      charactersPeople: 'Referenced in names: Kabir, Riya.',
      settingEnvironment: 'Clean graphic comparison card with ruled ledger divider.',
      objectsProps: 'None — typographic infographic layout.',
      labelsRequired: ['Common Noun', 'Proper Noun', 'General Name', 'Special Name', 'Capital Letter'],
      textInsideArtwork: 'boy -> Kabir, city -> Mumbai, river -> Ganga, dog -> Rocky',
      ageAppropriateness: 'Class 3 (Ages 8-9) — crisp, high contrast, visually memorable.',
      visualComplexity: 'Simple',
      suggestedComposition: 'Two equal vertical columns with subtle divider and tinted headers.',
      orientation: 'Landscape',
      placement: 'Boxed Feature',
      suggestedSize: 'Half Page (170mm x 90mm)',
      colourGuidance:
        'Parchment background; Column 1 in ink charcoal; Column 2 in burgundy with gold capital letter accents.',
      styleGuidance: 'Modern academic textbook infographic table with rounded corners and border.',
      accessibilityConsiderations: 'High contrast text table; distinct colored accents; accessible to colorblind readers.',
      illustratorInstructions: 'Deliver as vector SVG with editable text layers.',
      editorialNotes:
        'Essential rule reinforcement: emphasize that Proper Nouns ALWAYS begin with a Capital Letter.',
      referenceNotes: 'CBSE Class 3 English Grammar Curriculum Benchmark.',
    },
    metadata: {
      figureNumber: `Figure ${chNum}.2`,
      caption:
        `Figure ${chNum}.2: Notice how general words (Common Nouns) have lowercase initials, while special unique names (Proper Nouns) always start with a Capital Letter.`,
      shortCaption: 'Common vs Proper Nouns Comparison',
      altText:
        'A comparison table contrasting five common nouns with five proper nouns, showing capitalized first letters for the proper nouns.',
      creditSource: 'VERITAS Infographic & Grammar Studio',
      copyrightStatus: 'In-House Editorial',
      rightsPermission: 'VERITAS Academic Series — All Rights Reserved',
      creatorIllustrator: 'VERITAS Editorial Team',
      dateCreated: '2026-09-03',
      finalAssetFilename: `cbse_c${chapter.equivalentClass || 3}_u1_fig1_2_common_proper_table.svg`,
    },
    sourceType: 'Placeholder',
    versions: [],
    review: {
      reviewStatus: 'Pending',
      reviewer: 'Grammar Content Specialist',
      reviewNotes:
        'Placeholder active in manuscript. Brief ready for layout designer to generate final typographic schematic.',
      revisionRequested: '',
      reviewChecks: {
        educationalAccuracy: true,
        grammarAccuracy: true,
        ageAppropriateness: true,
        visualClarity: true,
        captionAccuracy: true,
        labelAccuracy: true,
        accessibility: true,
        boardRelevance: true,
        publicationSuitability: false,
      },
    },
    isExerciseStimulus: false,
  };

  return [visual1, visual2];
}

/**
 * Retrieves the chapter's existing visual records, or seeds the demonstration records
 * if none exist yet.
 */
export function getOrCreateChapterVisuals(chapter: StudioChapter): VisualRecord[] {
  if (chapter.visualRecords && chapter.visualRecords.length > 0) {
    return chapter.visualRecords;
  }
  return createDefaultChapterVisuals(chapter);
}

/**
 * Renumbers all visuals sequentially (e.g. Figure 1.1, Figure 1.2, ...)
 * based on chapter number and current ordering.
 */
export function renumberChapterVisuals(
  visuals: VisualRecord[],
  chapterNumber: number
): VisualRecord[] {
  return visuals.map((v, index) => {
    const newFigNum = `Figure ${chapterNumber}.${index + 1}`;
    return {
      ...v,
      figureNumber: newFigNum,
      metadata: {
        ...v.metadata,
        figureNumber: newFigNum,
        caption: v.metadata.caption
          ? v.metadata.caption.replace(/^Figure\s+[\d.]+/i, newFigNum)
          : `${newFigNum}: ${v.title}`,
      },
    };
  });
}

/**
 * Synchronizes a VisualRecord into a ChapterSection as a TextbookContentBlock,
 * ensuring that the block and visual record reference the exact same underlying visual.
 */
export function synchronizeVisualWithChapter(
  chapter: StudioChapter,
  visual: VisualRecord,
  targetSectionId?: string,
  placement: 'before_block' | 'after_block' | 'inside_section' | 'end_of_section' = 'end_of_section',
  targetBlockId?: string
): { updatedChapter: StudioChapter; syncedBlockId: string } {
  // Determine which section to target
  const sectionId = targetSectionId || visual.associatedSectionId || chapter.sections[0]?.id;
  if (!sectionId) {
    return { updatedChapter: chapter, syncedBlockId: visual.associatedBlockId || 'blk-new' };
  }

  let syncedBlockId = visual.associatedBlockId || `blk-vis-${visual.id}`;

  const updatedSections = chapter.sections.map((section) => {
    if (section.id !== sectionId) return section;

    const existingBlockIndex = section.blocks.findIndex(
      (b) => b.id === syncedBlockId || b.metadata?.visualRecordId === visual.id
    );

    const blockType =
      visual.visualType === 'Educational Illustration'
        ? 'illustration'
        : visual.visualType === 'Grammar Diagram' || visual.visualType === 'Sentence Diagram'
        ? 'diagram'
        : visual.visualType === 'Comparison Chart' || visual.visualType === 'Table'
        ? 'comparison_table'
        : visual.visualType === 'Flowchart' || visual.visualType === 'Process Diagram'
        ? 'flowchart'
        : 'visual';

    const visualBlockData: any = {
      visualType:
        blockType === 'illustration'
          ? 'illustration'
          : blockType === 'comparison_table'
          ? 'comparison_table'
          : blockType === 'flowchart'
          ? 'flowchart'
          : 'diagram',
      title: visual.title,
      figureNumber: visual.figureNumber,
      caption: visual.metadata.caption,
      altText: visual.metadata.altText,
      source: visual.metadata.creditSource,
      credit: visual.metadata.creatorIllustrator,
      licenseStatus:
        visual.metadata.copyrightStatus === 'Original Commission'
          ? 'Commissioned'
          : visual.metadata.copyrightStatus === 'Licensed'
          ? 'Licensed'
          : 'Original Creation',
      placement:
        visual.brief.placement === 'Full Width'
          ? 'full_width'
          : visual.brief.placement === 'Margin'
          ? 'margin_right'
          : 'center',
      size:
        visual.brief.placement === 'Full Width'
          ? 'large'
          : visual.brief.placement === 'Half Width'
          ? 'medium'
          : 'small',
      imageUrl: visual.currentAsset?.artworkUrl,
      svgIllustrationBrief: visual.brief.description,
      artworkStatus:
        visual.status === 'Approved' || visual.status === 'Publication Ready'
          ? 'Final Artwork'
          : visual.status === 'Draft Artwork' || visual.status === 'Editorial Review'
          ? 'Draft Artwork'
          : visual.status === 'Placeholder'
          ? 'Placeholder'
          : 'Brief',
    };

    if (existingBlockIndex >= 0) {
      // Update existing block
      const existing = section.blocks[existingBlockIndex];
      syncedBlockId = existing.id;
      const updatedBlock: TextbookContentBlock = {
        ...existing,
        title: visual.title,
        visualData: visualBlockData,
        metadata: {
          ...existing.metadata,
          visualRecordId: visual.id,
          figureNumber: visual.figureNumber,
          productionStatus: visual.status,
          sourceType: visual.sourceType,
          isExerciseStimulus: visual.isExerciseStimulus,
        },
      };
      const newBlocks = [...section.blocks];
      newBlocks[existingBlockIndex] = updatedBlock;
      return { ...section, blocks: newBlocks };
    }

    // Otherwise insert new block according to placement
    const newBlock: TextbookContentBlock = {
      id: syncedBlockId,
      type: blockType,
      title: visual.title,
      order: section.blocks.length + 1,
      visibility: 'student',
      visualData: visualBlockData,
      metadata: {
        visualRecordId: visual.id,
        figureNumber: visual.figureNumber,
        productionStatus: visual.status,
        sourceType: visual.sourceType,
        isExerciseStimulus: visual.isExerciseStimulus,
      },
    };

    let newBlocks = [...section.blocks];
    if (placement === 'before_block' && targetBlockId) {
      const idx = newBlocks.findIndex((b) => b.id === targetBlockId);
      if (idx >= 0) newBlocks.splice(idx, 0, newBlock);
      else newBlocks.push(newBlock);
    } else if (placement === 'after_block' && targetBlockId) {
      const idx = newBlocks.findIndex((b) => b.id === targetBlockId);
      if (idx >= 0) newBlocks.splice(idx + 1, 0, newBlock);
      else newBlocks.push(newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    // Reorder blocks sequentially
    newBlocks = newBlocks.map((b, idx) => ({ ...b, order: idx + 1 }));

    return { ...section, blocks: newBlocks };
  });

  // Update visual record itself with the associated block ID & section ID
  const updatedVisuals = (chapter.visualRecords || createDefaultChapterVisuals(chapter)).map((v) => {
    if (v.id === visual.id) {
      return {
        ...v,
        associatedSectionId: sectionId,
        associatedSectionTitle: chapter.sections.find((s) => s.id === sectionId)?.title,
        associatedBlockId: syncedBlockId,
      };
    }
    return v;
  });

  return {
    updatedChapter: {
      ...chapter,
      sections: updatedSections,
      visualRecords: updatedVisuals,
    },
    syncedBlockId,
  };
}

/**
 * Visual Quality Audit checks evaluation across the chapter's visual records.
 * Returns structured diagnosis conforming to Section 21.
 */
export interface VisualAuditCheckResult {
  id: string;
  category: 'Visual Production' | 'Editorial Compliance' | 'Accessibility & Print';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  affectedVisualIds: string[];
}

export function evaluateVisualQualityAudit(
  visuals: VisualRecord[],
  chapter: StudioChapter
): VisualAuditCheckResult[] {
  const results: VisualAuditCheckResult[] = [];

  // 1. Visual required check
  const hasVisuals = visuals.length > 0;
  results.push({
    id: 'va-req-1',
    category: 'Visual Production',
    title: 'Visual Content Required & Present',
    status: hasVisuals ? 'pass' : 'fail',
    description: hasVisuals
      ? `${visuals.length} visual asset(s) registered in Chapter Architecture.`
      : 'No visual records found. At least one instructional visual is required per chapter.',
    affectedVisualIds: [],
  });

  // 2. Incomplete Visual Briefs
  const incompleteBriefs = visuals.filter(
    (v) => !v.brief?.description || v.brief.description.trim().length < 30
  );
  results.push({
    id: 'va-brief-2',
    category: 'Editorial Compliance',
    title: 'Visual Brief Completeness',
    status: incompleteBriefs.length === 0 ? 'pass' : 'warning',
    description:
      incompleteBriefs.length === 0
        ? 'All visuals have comprehensive illustration and design briefs.'
        : `${incompleteBriefs.length} visual(s) have incomplete illustration descriptions.`,
    affectedVisualIds: incompleteBriefs.map((v) => v.id),
  });

  // 3. Caption Present (Reader-Facing)
  const missingCaptions = visuals.filter(
    (v) => !v.metadata?.caption || v.metadata.caption.trim().length < 5
  );
  results.push({
    id: 'va-cap-3',
    category: 'Editorial Compliance',
    title: 'Reader-Facing Caption Present',
    status: missingCaptions.length === 0 ? 'pass' : 'fail',
    description:
      missingCaptions.length === 0
        ? 'All visuals include publication-ready explanatory captions.'
        : `${missingCaptions.length} visual(s) are missing captions.`,
    affectedVisualIds: missingCaptions.map((v) => v.id),
  });

  // 4. Alt Text Present (Separate from caption)
  const missingAltTexts = visuals.filter(
    (v) => !v.metadata?.altText || v.metadata.altText.trim().length < 10
  );
  results.push({
    id: 'va-alt-4',
    category: 'Accessibility & Print',
    title: 'Accessibility Alt-Text Distinct & Present',
    status: missingAltTexts.length === 0 ? 'pass' : 'warning',
    description:
      missingAltTexts.length === 0
        ? 'Screen-reader accessible alt-text is present for all visuals.'
        : `${missingAltTexts.length} visual(s) require alt-text for accessibility compliance.`,
    affectedVisualIds: missingAltTexts.map((v) => v.id),
  });

  // 5. Figure Numbering & Duplicates
  const figNumbers = visuals.map((v) => v.figureNumber);
  const duplicates = figNumbers.filter((item, index) => figNumbers.indexOf(item) !== index);
  const missingFigNum = visuals.filter((v) => !v.figureNumber);
  results.push({
    id: 'va-fig-5',
    category: 'Editorial Compliance',
    title: 'Sequential Figure Numbering',
    status: duplicates.length === 0 && missingFigNum.length === 0 ? 'pass' : 'fail',
    description:
      duplicates.length > 0
        ? `Duplicate figure numbers detected: ${duplicates.join(', ')}. Use Renumber Figures tool.`
        : missingFigNum.length > 0
        ? `${missingFigNum.length} visual(s) missing assigned figure numbers.`
        : 'Figure numbering is unique and properly sequenced.',
    affectedVisualIds: visuals.filter((v) => duplicates.includes(v.figureNumber) || !v.figureNumber).map((v) => v.id),
  });

  // 6. Source & Copyright Status
  const unresolvedCopyright = visuals.filter(
    (v) => !v.metadata?.copyrightStatus || !v.metadata?.creditSource
  );
  results.push({
    id: 'va-cpr-6',
    category: 'Accessibility & Print',
    title: 'Source Credit & Copyright Resolution',
    status: unresolvedCopyright.length === 0 ? 'pass' : 'warning',
    description:
      unresolvedCopyright.length === 0
        ? 'All visual assets have confirmed copyright status and editorial attribution.'
        : `${unresolvedCopyright.length} visual(s) have unresolved source or rights metadata.`,
    affectedVisualIds: unresolvedCopyright.map((v) => v.id),
  });

  // 7. Artwork Status (Draft, Placeholder or Final)
  const pendingArtwork = visuals.filter(
    (v) => v.status === 'Placeholder' || v.status === 'Brief Required' || v.status === 'Brief Ready'
  );
  results.push({
    id: 'va-art-7',
    category: 'Visual Production',
    title: 'Artwork Readiness & Publishing State',
    status: pendingArtwork.length === 0 ? 'pass' : 'warning',
    description:
      pendingArtwork.length === 0
        ? 'All artwork is approved or publication-ready.'
        : `${pendingArtwork.length} visual(s) are in Brief or Placeholder state pending final artwork.`,
    affectedVisualIds: pendingArtwork.map((v) => v.id),
  });

  return results;
}
