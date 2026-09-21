import {
  BookProject,
  CurriculumSystemId,
  GrammarClassLevel,
  GrammarSeriesProject,
  ClassCurriculumBook,
} from '../types';
import {
  getInitialBookProjects,
  getDefaultProductionMilestones,
  getDefaultRightsAndEditions,
} from './bookProjectUtils';
import { CURRICULUM_STAGES, CURRICULUM_SYSTEMS } from './multiBoardData';

export interface ActiveBookContextResult {
  activeProjectId: string;
  activeProject: BookProject;
  activeSystemId: CurriculumSystemId;
  selectedClass: GrammarClassLevel;
  seriesTitle: string;
  bookTitle: string;
  subtitle: string;
  board: string;
  programme: string;
  edition: string;
  curriculumProfile: string;
  allProjectsRecord: Record<string, BookProject>;
  allProjectsList: BookProject[];
  allProjects: BookProject[];
}

/**
 * Standard Classes 1–12 level definitions for multi-volume progression
 */
export const ALL_INDIAN_CLASSES: GrammarClassLevel[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export type BookProjectStatusCategory = 'Book Exists' | 'Planned' | 'Published' | 'Not Yet Created';

/**
 * Checks whether a given Curriculum System + Stage/Class has an active, planned, published, or not-yet-created book.
 */
/**
 * Rigorous stage-to-book-project matching helper.
 * Prevents false positives like "Class 10" matching "Class 1", or "Stage 10" matching "Stage 1".
 */
export function isBookProjectMatchingStage(
  p: BookProject,
  systemId: CurriculumSystemId,
  stageLabelOrClass: string
): boolean {
  const pBoard = (p.board || '').toUpperCase();
  const sysUpper = systemId.toUpperCase();

  const boardMatches =
    (sysUpper === 'CISCE' && (pBoard.includes('CISCE') || pBoard.includes('ICSE') || pBoard.includes('ISC'))) ||
    (sysUpper === 'CBSE' && pBoard.includes('CBSE')) ||
    (sysUpper === 'CAMBRIDGE' && (pBoard.includes('CAMBRIDGE') || pBoard.includes('CAIE')));

  if (!boardMatches) return false;

  const target = stageLabelOrClass.trim();
  const pClass = (p.classLevel || '').trim();
  const pStage = (p.classOrStage || '').trim();
  const pTitle = (p.bookTitle || '').trim();

  // Exact matches (case-insensitive)
  if (pClass.toLowerCase() === target.toLowerCase() || pStage.toLowerCase() === target.toLowerCase()) {
    return true;
  }

  // Cambridge specific matching (e.g. Stage 7, Stage 8, IGCSE, A Level)
  if (sysUpper === 'CAMBRIDGE') {
    const targetStageMatch = target.match(/stage\s*(\d+)/i);
    if (targetStageMatch) {
      const targetStageNum = parseInt(targetStageMatch[1], 10);
      const pStageMatch = pStage.match(/stage\s*(\d+)/i) || pTitle.match(/stage\s*(\d+)/i);
      if (pStageMatch && parseInt(pStageMatch[1], 10) === targetStageNum) {
        return true;
      }
      return false;
    }

    if (/igcse|years?\s*10\s*[–-]\s*11/i.test(target)) {
      return /igcse|years?\s*10\s*[–-]\s*11/i.test(pStage) || /igcse/i.test(pTitle) || /igcse/i.test(p.programme || '');
    }

    if (/a\s*level|as\s*level|years?\s*12\s*[–-]\s*13/i.test(target)) {
      return /a\s*level|as\s*level|years?\s*12\s*[–-]\s*13/i.test(pStage) || /a\s*level/i.test(pTitle) || /alevel/i.test(p.programme || '');
    }

    return false;
  }

  // Indian Curricula (CBSE & CISCE): Match strictly on integer class number 1..12!
  const extractClassNum = (str: string): number | null => {
    const m = str.match(/class\s*(\d+)/i);
    if (m) return parseInt(m[1], 10);
    const m2 = str.match(/\b(\d+)\b/);
    if (m2) return parseInt(m2[1], 10);
    return null;
  };

  const targetClassNum = extractClassNum(target);
  if (targetClassNum !== null) {
    const pClassNum = extractClassNum(pClass) ?? extractClassNum(pStage) ?? extractClassNum(pTitle);
    if (pClassNum !== null) {
      return targetClassNum === pClassNum;
    }
  }

  return false;
}

/**
 * Derives the publication readiness status for a specific curriculum stage.
 * Queries ONLY the matching curriculum system and stage records.
 */
export function getStageBookStatus(
  projects: Record<string, BookProject> | BookProject[],
  systemId: CurriculumSystemId,
  stageLabelOrClass: string
): { status: BookProjectStatusCategory; project?: BookProject } {
  const list = Array.isArray(projects) ? projects : Object.values(projects);

  const matched = list.find((p) => isBookProjectMatchingStage(p, systemId, stageLabelOrClass));

  if (!matched) {
    return { status: 'Not Yet Created' };
  }

  if (matched.status === 'Published') {
    return { status: 'Published', project: matched };
  }

  if (matched.status === 'Planning') {
    return { status: 'Planned', project: matched };
  }

  return { status: 'Book Exists', project: matched };
}

/**
 * Authoritative single resolution of active book context across all Veritas surfaces.
 */
export function resolveActiveBookContext(
  seriesProject: GrammarSeriesProject
): ActiveBookContextResult {
  // 1. Resolve all book projects
  const allProjectsRecord = seriesProject.bookProjects && Object.keys(seriesProject.bookProjects).length > 0
    ? seriesProject.bookProjects
    : getInitialBookProjects(seriesProject);

  const allProjectsList = Object.values(allProjectsRecord);

  // 2. Resolve active project ID
  let activeProjectId = seriesProject.activeBookProjectId;
  let activeProject = activeProjectId ? allProjectsRecord[activeProjectId] : undefined;

  // Verify alignment with activeSystemId and selectedClass
  if (activeProject) {
    let isValid = true;
    if (seriesProject.activeSystemId) {
      const rawBoard = (activeProject.board || '').toUpperCase();
      const sysUpper = seriesProject.activeSystemId.toUpperCase();
      const matchesSystem =
        (sysUpper === 'CISCE' && (rawBoard.includes('CISCE') || rawBoard.includes('ICSE') || rawBoard.includes('ISC'))) ||
        (sysUpper === 'CBSE' && rawBoard.includes('CBSE')) ||
        (sysUpper === 'CAMBRIDGE' && (rawBoard.includes('CAMBRIDGE') || rawBoard.includes('CAIE')));
      if (!matchesSystem) isValid = false;
    }
    if (seriesProject.selectedClass) {
      const targetSystem = (seriesProject.activeSystemId || 'CBSE') as CurriculumSystemId;
      if (!isBookProjectMatchingStage(activeProject, targetSystem, seriesProject.selectedClass)) {
        isValid = false;
      }
    }
    if (!isValid) {
      activeProject = undefined;
    }
  }

  // If no project matched or was mismatched, find best match
  if (!activeProject) {
    const targetSystem = (seriesProject.activeSystemId || 'CBSE') as CurriculumSystemId;
    const targetClass = seriesProject.selectedClass || 'Class 6';

    const matched = allProjectsList.find((p) => {
      return isBookProjectMatchingStage(p, targetSystem, targetClass);
    });

    if (matched) {
      activeProject = matched;
      activeProjectId = matched.id;
    } else {
      // NEVER silently substitute another class!
      // Dynamically instantiate canonical book project for this exact system and class/stage
      const safeStage = targetClass.replace(/[^a-zA-Z0-9]/g, '');
      const sysPrefix = targetSystem.toLowerCase();
      const newId = `bp-${sysPrefix}-${safeStage.toLowerCase()}`;

      const customTitle =
        targetSystem === 'CISCE'
          ? `Classical Grammar & Composition: ICSE ${targetClass}`
          : targetSystem === 'Cambridge'
          ? `Cambridge English Language Coursebook — ${targetClass}`
          : `Communicative English Grammar & Syntax — ${targetClass}`;

      const generatedProject: BookProject = {
        id: newId,
        seriesTitle: seriesProject.seriesTitle || 'Grammar in Action: Tri-Board English Series',
        bookTitle: customTitle,
        subtitle: `Standardized ${targetSystem} coursebook for ${targetClass}`,
        board: targetSystem === 'Cambridge' ? 'Cambridge' : targetSystem,
        programme: seriesProject.activeProgrammeId || (targetSystem === 'CISCE' ? 'cisce-school' : targetSystem === 'Cambridge' ? 'cambridge-lower-sec' : 'cbse-main'),
        classLevel: targetClass as GrammarClassLevel,
        classOrStage: targetClass,
        subject: 'English Language & Grammar',
        author: 'Not entered',
        editor: 'Not assigned',
        edition: 'Student Edition',
        academicYear: '2026–2027',
        isbnPlaceholder: 'Not Assigned',
        isbnStatus: 'Not Assigned',
        targetAge: targetClass === 'Class 1' ? 'Ages 5–6 (Primary)' : 'School Level',
        targetPageCount: 160,
        estimatedWordCount: 30000,
        trimSize: 'Crown Quarto (189 × 246 mm)',
        status: 'Authoring',
        isManualStatus: false,
        derivedStatus: 'Authoring',
        publisher: 'To be confirmed',
        internalProjectCode: `BK-${targetSystem.toUpperCase().slice(0, 4)}-${safeStage}-2026`,
        copyrightYear: 2026,
        language: 'English (UK / Commonwealth Standard)',
        notes: `${targetSystem} curriculum volume for ${targetClass}.`,
        editionId: `ed-${sysPrefix}-${safeStage.toLowerCase()}`,
        milestones: getDefaultProductionMilestones('Authoring'),
        rightsAndEditions: getDefaultRightsAndEditions(`BK-${targetSystem.toUpperCase().slice(0, 4)}-${safeStage}-2026`, customTitle),
        isDemoProject: false,
        lastEdited: new Date().toISOString(),
      };

      allProjectsRecord[newId] = generatedProject;
      allProjectsList.push(generatedProject);
      activeProject = generatedProject;
      activeProjectId = newId;
    }
  }

  const verifiedActiveProject: BookProject = activeProject || allProjectsList[0] || {
    id: 'proj-cbse-c6',
    seriesTitle: seriesProject.seriesTitle || 'Grammar in Action: Complete Classes 1–12 English Series',
    bookTitle: 'Middle School Grammar & Syntax — Class 6',
    subtitle: 'Subject-Verb Concord, Tenses & Applied Sentence Architecture',
    board: 'CBSE',
    programme: 'cbse-main',
    classLevel: 'Class 6',
    classOrStage: 'Class 6',
    subject: 'English Language & Grammar',
    author: 'Not entered',
    editor: 'Not assigned',
    edition: 'Student Edition',
    academicYear: '2026–2027',
    isbnPlaceholder: 'Not Assigned',
    isbnStatus: 'Not Assigned',
    targetAge: '11–12 years',
    targetPageCount: 192,
    estimatedWordCount: 42500,
    trimSize: 'Crown Quarto (189 × 246 mm)',
    status: 'Authoring',
    publisher: 'To be confirmed',
    internalProjectCode: 'BK-CBSE-C6-2026',
    copyrightYear: 2026,
    language: 'English (UK / Commonwealth Standard)',
    notes: 'Primary working academic volume for Class 6.',
    editionId: 'ed-cbse-c6',
    milestones: [],
    rightsAndEditions: [],
    lastEdited: new Date().toISOString(),
  };

  // Derive board and system
  const rawBoard = (verifiedActiveProject.board || 'CBSE').toUpperCase();
  let activeSystemId: CurriculumSystemId = 'CBSE';
  if (rawBoard.includes('CISCE') || rawBoard.includes('ICSE') || rawBoard.includes('ISC')) {
    activeSystemId = 'CISCE';
  } else if (rawBoard.includes('CAMBRIDGE')) {
    activeSystemId = 'Cambridge';
  }

  const selectedClass = (verifiedActiveProject.classLevel || verifiedActiveProject.classOrStage || 'Class 6') as GrammarClassLevel;

  return {
    activeProjectId: verifiedActiveProject.id,
    activeProject: verifiedActiveProject,
    activeSystemId,
    selectedClass,
    seriesTitle: verifiedActiveProject.seriesTitle || seriesProject.seriesTitle || 'Grammar in Action: Complete Classes 1–12 English Series',
    bookTitle: verifiedActiveProject.bookTitle,
    subtitle: verifiedActiveProject.subtitle,
    board: verifiedActiveProject.board,
    programme: verifiedActiveProject.programme || 'Standard',
    edition: (verifiedActiveProject.edition as string) || 'Student Edition',
    curriculumProfile: verifiedActiveProject.curriculumProfile || verifiedActiveProject.board,
    allProjectsRecord,
    allProjectsList,
    allProjects: allProjectsList,
  };
}

/**
 * Switching active book updates ALL contextual keys simultaneously:
 * activeBookProjectId, activeSystemId, selectedClass, targetBoard, activeProgrammeId, activeStageId
 */
export function switchActiveBookProject(
  seriesProject: GrammarSeriesProject,
  newProjectId: string,
  allProjectsRecord?: Record<string, BookProject>
): GrammarSeriesProject {
  const projects = allProjectsRecord || seriesProject.bookProjects || getInitialBookProjects(seriesProject);
  const targetProj = projects[newProjectId];
  if (!targetProj) return seriesProject;

  const rawBoard = (targetProj.board || 'CBSE').toUpperCase();
  let newSystemId: CurriculumSystemId = 'CBSE';
  if (rawBoard.includes('CISCE') || rawBoard.includes('ICSE') || rawBoard.includes('ISC')) {
    newSystemId = 'CISCE';
  } else if (rawBoard.includes('CAMBRIDGE')) {
    newSystemId = 'Cambridge';
  }

  const newClass = (targetProj.classLevel || targetProj.classOrStage || 'Class 6') as GrammarClassLevel;

  // Resolve matching programme
  let newProgrammeId = targetProj.programme;
  if (!newProgrammeId) {
    if (newSystemId === 'CISCE') {
      const clsNum = parseInt(newClass.replace(/\D/g, '') || '6', 10);
      newProgrammeId = clsNum >= 11 ? 'cisce-isc' : clsNum >= 9 ? 'cisce-icse' : 'cisce-school';
    } else if (newSystemId === 'Cambridge') {
      const stageStr = targetProj.classOrStage || '';
      if (stageStr.includes('IGCSE')) newProgrammeId = 'cambridge-igcse';
      else if (stageStr.includes('A Level')) newProgrammeId = 'cambridge-alevel';
      else if (stageStr.includes('Stage 7') || stageStr.includes('Stage 8') || stageStr.includes('Stage 9')) newProgrammeId = 'cambridge-lower-sec';
      else newProgrammeId = 'cambridge-primary';
    } else {
      newProgrammeId = 'cbse-main';
    }
  }

  // Resolve matching stage
  const matchingStage =
    CURRICULUM_STAGES.find((s) => s.systemId === newSystemId && (s.stageLabel === newClass || s.equivalentClass === newClass || s.stageLabel === targetProj.classOrStage)) ||
    CURRICULUM_STAGES.find((s) => s.systemId === newSystemId && s.programmeId === newProgrammeId) ||
    CURRICULUM_STAGES[0];

  return {
    ...seriesProject,
    activeBookProjectId: newProjectId,
    activeSystemId: newSystemId,
    selectedClass: newClass,
    targetBoard: newSystemId === 'Cambridge' ? 'Cambridge / IGCSE' : (newSystemId as any),
    activeEditionId: targetProj.editionId || `ed-${newProjectId.replace(/^proj-/, '')}`,
    activeProgrammeId: newProgrammeId,
    activeStageId: matchingStage.id,
    bookProjects: projects,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Switches academic context with full synchronization across System, Programme, Stage, and Book Project.
 */
export function switchAcademicContext(
  seriesProject: GrammarSeriesProject,
  systemId: CurriculumSystemId,
  programmeId?: string,
  stageId?: string,
  classLevel?: GrammarClassLevel,
  targetBookProjectId?: string
): GrammarSeriesProject {
  const projects = seriesProject.bookProjects && Object.keys(seriesProject.bookProjects).length > 0
    ? seriesProject.bookProjects
    : getInitialBookProjects(seriesProject);

  // If specific book project requested, use it
  if (targetBookProjectId && projects[targetBookProjectId]) {
    return switchActiveBookProject(seriesProject, targetBookProjectId, projects);
  }

  // Resolve stage and programme
  const sys = CURRICULUM_SYSTEMS.find((s) => s.id === systemId) || CURRICULUM_SYSTEMS[1];
  const progId = programmeId || sys.programmes[0]?.id || 'cbse-main';
  const stage = stageId ? CURRICULUM_STAGES.find((s) => s.id === stageId) : undefined;
  const targetClass = classLevel || stage?.equivalentClass || seriesProject.selectedClass || 'Class 6';

  // Find if a book already exists for this system and stage/class
  const stageLabel = stage?.stageLabel || targetClass;
  const { project: matchedProject } = getStageBookStatus(projects, systemId, stageLabel);

  if (matchedProject) {
    return switchActiveBookProject(seriesProject, matchedProject.id, projects);
  }

  // If no book project exists yet, create one so activeBookProjectId is strictly aligned
  const matchingStage = stage || CURRICULUM_STAGES.find((s) => s.systemId === systemId && (s.stageLabel === targetClass || s.equivalentClass === targetClass)) || CURRICULUM_STAGES[0];

  const { updatedProject, newBook } = createBookProjectForStage(seriesProject, systemId, matchingStage.id);
  return switchActiveBookProject(updatedProject, newBook.id, updatedProject.bookProjects);
}

/**
 * Creates a new book project for a given system and stage, adds it to the series,
 * and sets it as the active book project.
 */
export function createBookProjectForStage(
  seriesProject: GrammarSeriesProject,
  systemId: CurriculumSystemId,
  stageId: string,
  customTitle?: string
): { updatedProject: GrammarSeriesProject; newBook: BookProject } {
  const projects = { ...(seriesProject.bookProjects || getInitialBookProjects(seriesProject)) };
  const stage = CURRICULUM_STAGES.find((s) => s.id === stageId) || CURRICULUM_STAGES[0];

  const classLevel = (stage.equivalentClass || 'Class 7') as GrammarClassLevel;
  const classOrStage = systemId === 'Cambridge' ? stage.stageLabel : (stage.stageLabel || classLevel);
  const sysCode = systemId.toUpperCase().slice(0, 4);
  const safeStage = classOrStage.replace(/[^a-zA-Z0-9]/g, '');
  const year = new Date().getFullYear();
  const projectId = `bp-${systemId.toLowerCase()}-${safeStage.toLowerCase()}-${Date.now().toString(36)}`;
  const internalCode = `BK-${sysCode}-${safeStage}-${year}`;

  let defaultTitle = customTitle;
  if (!defaultTitle) {
    if (systemId === 'CISCE') {
      defaultTitle = `Classical Grammar & Composition: ICSE ${classOrStage}`;
    } else if (systemId === 'Cambridge') {
      defaultTitle = `Cambridge English Language Coursebook — ${stage.stageLabel}`;
    } else {
      defaultTitle = `Communicative English Grammar & Syntax — ${classOrStage}`;
    }
  }

  const newBook: BookProject = {
    id: projectId,
    seriesTitle: seriesProject.seriesTitle || 'Grammar in Action: Tri-Board English Series',
    bookTitle: defaultTitle,
    subtitle: stage.description?.slice(0, 80) || 'Comprehensive Grammar, Syntax & Applied Composition',
    board: systemId === 'Cambridge' ? 'Cambridge' : systemId,
    programme: stage.programmeId || (systemId === 'CISCE' ? 'cisce-school' : systemId === 'Cambridge' ? 'cambridge-lower-sec' : 'cbse-main'),
    classLevel,
    classOrStage,
    subject: 'English Language & Grammar',
    author: 'Editorial Board & Curriculum Authors',
    editor: 'Senior Academic Editor',
    edition: 'Student Edition',
    academicYear: `${year}–${year + 1}`,
    isbnPlaceholder: 'Not Assigned',
    isbnStatus: 'Not Assigned',
    targetAge: stage.nominalAge || '11–12 years',
    targetPageCount: 192,
    estimatedWordCount: 42000,
    trimSize: 'Crown Quarto (189 × 246 mm)',
    status: 'Planning',
    publisher: 'To be confirmed',
    internalProjectCode: internalCode,
    copyrightYear: year,
    language: 'English (UK / Commonwealth Standard)',
    notes: `Newly initialized book project for ${systemId} ${classOrStage}. Outline drafted from curriculum framework.`,
    milestones: getDefaultProductionMilestones('Planning'),
    rightsAndEditions: [],
    lastEdited: new Date().toISOString(),
  };

  projects[projectId] = newBook;

  const updatedProject = switchActiveBookProject(
    {
      ...seriesProject,
      bookProjects: projects,
    },
    projectId,
    projects
  );

  return { updatedProject, newBook };
}

/**
 * Ensures edition-isolated book data is retrieved for the current project.
 * Prevents notes or curriculum mappings from bleeding across CBSE, CISCE, and Cambridge.
 */
export function getEditionIsolatedBookData(
  seriesProject: GrammarSeriesProject,
  activeProject: BookProject
): ClassCurriculumBook {
  const projectId = activeProject.id;
  const classLevel = activeProject.classLevel || 'Class 6';
  const numMatch = (activeProject.classLevel || activeProject.classOrStage || '').match(/\d+/);
  const classNum = numMatch ? parseInt(numMatch[0], 10) : null;
  const boardUpper = (activeProject.board || seriesProject.targetBoard || '').toUpperCase();

  // Helper to ensure canonical binding on all units and topics
  const stampOwnership = (book: ClassCurriculumBook): ClassCurriculumBook => {
    const stampedBook: ClassCurriculumBook = {
      ...book,
      id: book.id || projectId,
      bookProjectId: projectId,
      editionId: activeProject.editionId || `ed-${projectId}`,
      curriculumSystemId: activeProject.board || seriesProject.targetBoard || 'CBSE',
      programmeId: activeProject.programmeId || activeProject.programme,
      classOrStageId: activeProject.classLevel || activeProject.classOrStage || classLevel,
      classLevel: book.classLevel || classLevel,
    };

    stampedBook.units = (stampedBook.units || []).map((u, idx) => ({
      ...u,
      order: u.order || idx + 1,
      unitNumber: u.unitNumber || idx + 1,
      bookProjectId: projectId,
      editionId: stampedBook.editionId,
      curriculumSystemId: stampedBook.curriculumSystemId,
      programmeId: stampedBook.programmeId,
      classOrStageId: stampedBook.classOrStageId,
    }));

    stampedBook.topics = (stampedBook.topics || []).map((t, idx) => ({
      ...t,
      bookProjectId: projectId,
      editionId: stampedBook.editionId,
      curriculumSystemId: stampedBook.curriculumSystemId,
      programmeId: stampedBook.programmeId,
      classOrStageId: stampedBook.classOrStageId,
      order: t.order || idx + 1,
    }));

    return stampedBook;
  };

  // 1. If stored in seriesProject.editionBooks under projectId, return that
  if (seriesProject.editionBooks && seriesProject.editionBooks[projectId]) {
    return stampOwnership(seriesProject.editionBooks[projectId]);
  }

  // 2. CISCE projects
  if (boardUpper.includes('CISCE') || boardUpper.includes('ICSE')) {
    if (classNum === 6 || projectId === 'proj-icse-c6') {
      return stampOwnership(createDefaultCisceBook(activeProject));
    }
    // Genuinely clean, isolated book for other classes/stages (e.g. Class 1, Class 10)
    return stampOwnership({
      classLevel,
      title: activeProject.bookTitle || `Classical Grammar & Composition: ICSE ${classLevel}`,
      ageBracket: activeProject.targetAge || (classNum === 1 ? '5–6 years' : 'Primary / Middle Stage'),
      description: activeProject.notes || `CISCE curriculum volume for ${classLevel}.`,
      topics: [],
      units: [],
    });
  }

  // 3. Cambridge projects
  if (boardUpper.includes('CAMBRIDGE')) {
    if (classNum === 7 || projectId === 'proj-camb-s7') {
      return stampOwnership(createDefaultCambridgeBook(activeProject));
    }
    // Genuinely clean, isolated book for other stages (e.g. Stage 1)
    return stampOwnership({
      classLevel,
      title: activeProject.bookTitle || `Cambridge English Language — ${activeProject.classOrStage || classLevel}`,
      ageBracket: activeProject.targetAge || (classNum === 1 ? '5–6 years' : 'Primary / Secondary Stage'),
      description: activeProject.notes || `Cambridge English framework volume for ${activeProject.classOrStage || classLevel}.`,
      topics: [],
      units: [],
    });
  }

  // 4. CBSE projects
  if (boardUpper.includes('CBSE')) {
    if (projectId === 'proj-cbse-c6' || projectId === 'book-c6' || (classNum === 6 && !projectId.includes('c1'))) {
      if (seriesProject.books && seriesProject.books['Class 6']) {
        return stampOwnership(seriesProject.books['Class 6']);
      }
    }
    // If an authored book exists for this exact classLevel and matches this project
    if (seriesProject.books && seriesProject.books[classLevel] && classLevel !== 'Class 6') {
      return stampOwnership(seriesProject.books[classLevel]);
    }
    // Clean, isolated volume for CBSE Class 1 or other classes
    return stampOwnership({
      classLevel,
      title: activeProject.bookTitle || `CBSE Grammar & Composition: ${classLevel}`,
      ageBracket: activeProject.targetAge || (classNum === 1 ? '5–6 years' : 'Primary / Middle Stage'),
      description: activeProject.notes || `CBSE curriculum volume for ${classLevel}.`,
      topics: [],
      units: [],
    });
  }

  // 5. Fallback for any other custom board/project
  return stampOwnership({
    classLevel,
    title: activeProject.bookTitle || `${classLevel} Grammar Volume`,
    ageBracket: activeProject.targetAge || 'Standard',
    description: activeProject.notes || `Curriculum volume for ${classLevel}.`,
    topics: [],
    units: [],
  });
}

/**
 * Generates an isolated CISCE book model focusing on formal grammar rules,
 * synthesis without connectives, direct/indirect transformation, and middle-school ICSE preparation.
 */
function createDefaultCisceBook(project: BookProject): ClassCurriculumBook {
  const classLevel = project.classLevel || 'Class 6';
  return {
    classLevel,
    title: project.bookTitle || 'Classical Grammar & Composition: ICSE Class 6',
    ageBracket: project.targetAge || '11–12 years',
    description: 'Systematic ICSE syllabus curriculum focused on precise terminology, synthesis, and voice transformation.',
    units: [
      {
        id: 'unit-icse-6-1',
        title: 'Unit 1: Verbal Syntax & Concord (ICSE Foundation)',
        description: 'Rigorous subject-verb agreement (neither/nor, each/every, collective nouns) and foundational sentence concord.',
        order: 1,
        unitNumber: 1,
        chapterIds: ['icse-6-concord', 'icse-6-synthesis'],
      },
      {
        id: 'unit-icse-6-2',
        title: 'Unit 2: Noun Taxonomy, Gender & Case Inflection',
        description: 'Abstract nouns, collective agreement, possessive case rules, and formal noun phrase expansion.',
        order: 2,
        unitNumber: 2,
        chapterIds: [],
      },
      {
        id: 'unit-icse-6-3',
        title: 'Unit 3: Verbal Syntax: Tense Aspect & Transformation',
        description: '12-tense timeline, active/passive voice foundations, and verbal aspect.',
        order: 3,
        unitNumber: 3,
        chapterIds: [],
      },
      {
        id: 'unit-icse-6-4',
        title: 'Unit 4: Transformation of Sentences (ICSE Question 5 Foundation)',
        description: 'Active and passive voice, direct to indirect speech, degrees of comparison without changing meaning.',
        order: 4,
        unitNumber: 4,
        chapterIds: [],
      },
    ],
    topics: [
      {
        id: 'icse-6-concord',
        title: 'Chapter 1: Subject–Verb Agreement: Concord & Syntactic Synthesis',
        classLevel,
        category: 'Syntax & Concord',
        order: 1,
        pedagogicalRationale: 'CISCE Middle School syllabus mandates foundational subject-verb concord and person-number harmony.',
        subtopics: [
          {
            id: 'icse-sub-1',
            title: 'Agreement with Correlative Conjunctions (Either...or, Neither...nor)',
            explanation: 'The verb agrees with the subject closer to it in position.',
            examples: [
              'Neither the captain nor the players were prepared.',
              'Either the students or the teacher is responsible for the apparatus.',
            ],
          },
          {
            id: 'icse-sub-2',
            title: 'Collective Nouns: Unified Entity vs Divided Individuals',
            explanation: 'Singular verb when acting as a unified unit; plural when individual members act separately.',
            examples: [
              'The committee has submitted its unanimous report.',
              'The jury were divided in their opinions regarding the verdict.',
            ],
          },
        ],
        exercises: [
          {
            id: 'icse-ex-1',
            title: 'Subject-Verb Concord Form Selection',
            instructions: 'Complete using the correct form of the verb in brackets:',
            targetType: 'fill_in_blanks',
            maxMarks: 1,
            questions: [
              {
                id: 'icse-q-1',
                type: 'fill_in_blanks',
                prompt: 'Complete using the correct form of the verb in brackets:',
                blanksSentence: 'Neither the monitor nor the prefects [has/have] reported the incident.',
                correctAnswer: 'have',
                options: ['has', 'have'],
                explanation: 'In neither...nor constructions, the verb agrees with the proximate subject "prefects" (plural).',
                difficulty: 'Medium',
                marks: 1,
              },
            ],
          },
          {
            id: 'icse-ex-2',
            title: 'ICSE Syntactic Transformation Drill',
            instructions: 'Rewrite the sentence without changing its meaning (ICSE transformation style):',
            targetType: 'transformation',
            maxMarks: 2,
            questions: [
              {
                id: 'icse-q-2',
                type: 'transformation',
                prompt: 'Rewrite the sentence without changing its meaning (ICSE transformation style):',
                originalSentence: 'The council reached a unanimous conclusion yesterday.',
                correctAnswer: 'The council was unanimous in reaching its conclusion yesterday.',
                explanation: 'Formal nominal to adjectival predicate transformation maintaining identical truth value.',
                difficulty: 'Hard',
                marks: 2,
              },
            ],
          },
        ],
        notes: 'CISCE editorial note: prioritize explicit rule formulations, contrastive analysis, and transformation without changing meaning.',
      },
      {
        id: 'icse-6-synthesis',
        title: 'Chapter 2: Sentence Synthesis: Combining without "and", "but", or "so"',
        classLevel,
        category: 'Sentence Architecture',
        order: 2,
        pedagogicalRationale: 'Direct preparation for ICSE Class 10 Paper 1 Question 5(c) sentence combination.',
        subtopics: [
          {
            id: 'icse-sub-synth-1',
            title: 'Using Participle Phrases',
            explanation: 'Combine two sentences sharing a common subject by converting the first action into a participle.',
            examples: ['Seeing the guard, the dog barked.', 'Having finished his homework, Rajiv went to sleep.'],
          },
        ],
        exercises: [
          {
            id: 'icse-ex-synth-1',
            title: 'Sentence Synthesis without Conjunctions',
            instructions: 'Combine into a single sentence without using "and", "but", or "so":',
            targetType: 'transformation',
            maxMarks: 2,
            questions: [
              {
                id: 'icse-q-synth-1',
                type: 'transformation',
                prompt: 'Combine into a single sentence without using "and", "but", or "so":',
                originalSentence: 'He heard the commotion. He immediately ran to the balcony.',
                correctAnswer: 'Hearing the commotion, he immediately ran to the balcony.',
                explanation: 'Present participle synthesis retains identical agent and sequential timing.',
                difficulty: 'Medium',
                marks: 2,
              },
            ],
          },
        ],
        notes: 'Focus on precise syntactic restructuring as expected in ICSE examinations.',
      },
    ],
  };
}

/**
 * Generates an isolated Cambridge book model focusing on communicative intent,
 * effect on the reader, international English register, and enquiry-led grammar discovery.
 */
function createDefaultCambridgeBook(project: BookProject): ClassCurriculumBook {
  const classLevel = project.classLevel || 'Class 6';
  return {
    classLevel,
    title: project.bookTitle || 'Cambridge Lower Secondary English — Stage 7',
    ageBracket: project.targetAge || '11–12 years',
    description: 'Cambridge Lower Secondary English Framework (0861) Stage 7 curriculum volume.',
    units: [
      {
        id: 'unit-camb-7-1',
        title: 'Unit 1: Syntax in Context: Crafting Clear Sentences',
        description: 'Explore how sentence structure affects pace, emphasis, and reader engagement.',
        order: 1,
        unitNumber: 1,
        chapterIds: ['camb-7-concord-context'],
      },
      {
        id: 'unit-camb-7-2',
        title: 'Unit 2: Expressing Time and Aspect in International English',
        description: 'Subtle temporal shifts, modal nuances, and perspective in narrative discourse.',
        order: 2,
        unitNumber: 2,
        chapterIds: [],
      },
    ],
    topics: [
      {
        id: 'camb-7-concord-context',
        title: 'Chapter 1: Subject–Verb Concord: Voice and Precision in Non-Fiction',
        classLevel,
        category: 'Communicative Syntax',
        order: 1,
        pedagogicalRationale: 'Cambridge 0861 Stage 7 framework requirement: examine how agreement maintains cohesion across complex clauses.',
        subtopics: [
          {
            id: 'camb-sub-1',
            title: 'Agreement across Dependent and Relative Clauses',
            explanation: 'Ensuring agreement when parenthetical modifiers or relative clauses separate subject from main verb.',
            examples: [
              'The collection of ancient manuscripts, which was discovered in 1922, provides valuable historical insight.',
            ],
          },
        ],
        exercises: [
          {
            id: 'camb-ex-1',
            title: 'Syntactic Shift and Reader Effect Analysis',
            instructions: 'Explain the effect on the reader when the writer shifts from singular to plural perspective in this extract:',
            targetType: 'short_answer',
            maxMarks: 3,
            questions: [
              {
                id: 'camb-q-1',
                type: 'short_answer',
                prompt: 'Explain the effect on the reader when the writer shifts from singular to plural perspective in this extract: "The team works tirelessly; each member brings unique field experience."',
                correctAnswer: 'The shift moves from observing the team as a singular corporate force to emphasizing individual specialized contributions.',
                explanation: 'Communicative analysis of syntactic perspective demonstrating how syntactic shifts adjust pragmatic focus.',
                difficulty: 'Hard',
                marks: 3,
              },
            ],
          },
        ],
        notes: 'Cambridge editorial note: anchor grammatical mechanics in authentic extracts from travelogues, science essays, and international fiction.',
      },
    ],
  };
}
