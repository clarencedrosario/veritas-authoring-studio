import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  StudioChapter,
  GrammarTopic,
  GrammarSeriesProject,
  GrammarQuestion,
  TextbookContentBlock,
  ContentBlockType,
  StudioExercise,
  ChapterQualityAuditReport,
  CurriculumSystemId,
  GrammarClassLevel,
} from '../../types';
import {
  convertTopicToStudioChapter,
  syncStudioChapterToTopic,
} from '../../utils/chapterStudioData';
import { ChapterStructureNavigator } from './ChapterStructureNavigator';
import { ChapterManuscriptCanvas } from './ChapterManuscriptCanvas';
import { AuthorCopilotDrawer } from './AuthorCopilotDrawer';
import { ChapterBlockEditor } from './ChapterBlockEditor';
import { VisualSuggestionModal } from './VisualSuggestionModal';
import { VisualIllustrationStudio } from './visual-studio/VisualIllustrationStudio';
import { ChapterQualityAuditModal } from './ChapterQualityAuditModal';
import { AuditClarityModal } from './AuditClarityModal';
import { AuditAccuracyModal } from './AuditAccuracyModal';
import { ChapterPreviewModal } from './ChapterPreviewModal';
import { BoardAdaptModal } from './BoardAdaptModal';
import {
  resolveActiveBookArchitecture,
  calculateArchitectureCompletionStats,
  createChapterFromArchitecture,
} from './architecture/chapterArchitectureBridge';
import { ChapterArchitectureCustomizerModal } from './architecture/ChapterArchitectureCustomizerModal';
import { ArchitectureUpdateReviewModal } from './architecture/ArchitectureUpdateReviewModal';
import { ChapterCurriculumFrameworkModal } from './ChapterCurriculumFrameworkModal';
import { ChapterProductionDashboardHeader } from './ChapterProductionDashboardHeader';
import { SentenceDiagrammerModal } from './SentenceDiagrammerModal';
import { CurriculumTraceabilityModal } from './CurriculumTraceabilityModal';
import { ChapterSnapshotModal } from './ChapterSnapshotModal';
import { ChapterStudioMenuBar } from './ChapterStudioMenuBar';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft,
  BookOpen,
  Globe,
  Layers,
  RefreshCw,
  ShieldCheck,
  Award,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Sparkles,
  Plus,
  Eye,
  Split,
  FileCheck,
  History,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';

interface ChapterAuthoringStudioProps {
  initialTopic: GrammarTopic;
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onBackToDashboard?: () => void;
  isDarkMode: boolean;
  isSecondaryExpanded?: boolean;
  onToggleSecondary?: (expanded: boolean) => void;
}

export const ChapterAuthoringStudio: React.FC<ChapterAuthoringStudioProps> = ({
  initialTopic,
  seriesProject,
  onUpdateSeriesProject,
  onBackToDashboard,
  isDarkMode,
  isSecondaryExpanded,
  onToggleSecondary,
}) => {
  // Initialize StudioChapter from topic (or use demo rich chapter if it's Subject-Verb Agreement)
  const targetClass = (initialTopic.classLevel || seriesProject.selectedClass || 'Class 6') as GrammarClassLevel;
  const targetSystem = (seriesProject.activeSystemId || seriesProject.targetBoard || 'CBSE') as CurriculumSystemId;
  const [currentTopic, setCurrentTopic] = useState<GrammarTopic>(initialTopic);
  const [chapter, setChapter] = useState<StudioChapter>(() =>
    convertTopicToStudioChapter(initialTopic, targetClass, targetSystem, seriesProject.activeEditionId)
  );

  // Synchronize chapter state when initial topic or active book project changes
  useEffect(() => {
    setCurrentTopic(initialTopic);
    const cls = (initialTopic.classLevel || seriesProject.selectedClass || 'Class 6') as GrammarClassLevel;
    const sys = (seriesProject.activeSystemId || seriesProject.targetBoard || 'CBSE') as CurriculumSystemId;
    const converted = convertTopicToStudioChapter(initialTopic, cls, sys, seriesProject.activeEditionId);
    setChapter(converted);
    setActiveSectionId(converted.sections[0]?.id || '');
  }, [initialTopic.id, initialTopic.classLevel, seriesProject.activeBookProjectId, seriesProject.selectedClass, seriesProject.activeSystemId]);

  // List of all chapters in the active book
  const allCurrentBookTopics: GrammarTopic[] = useMemo(() => {
    const book = seriesProject.books[targetClass] || Object.values(seriesProject.books)[0];
    return book?.topics && book.topics.length > 0 ? book.topics : [currentTopic];
  }, [seriesProject.books, targetClass, currentTopic]);

  const chaptersList = useMemo(() => {
    return allCurrentBookTopics.map((t, idx) => ({
      id: t.id,
      order: t.order || idx + 1,
      title: t.title,
      category: t.category,
    }));
  }, [allCurrentBookTopics]);

  // Add Chapter Modal state
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitleInput, setNewChapterTitleInput] = useState('');
  const [newChapterCategoryInput, setNewChapterCategoryInput] = useState('Syntax & Concord');

  const handleSelectChapter = (topicId: string) => {
    const foundTopic = allCurrentBookTopics.find((t) => t.id === topicId);
    if (!foundTopic) return;
    setCurrentTopic(foundTopic);
    const cls = (foundTopic.classLevel || seriesProject.selectedClass || 'Class 6') as GrammarClassLevel;
    const sys = (seriesProject.activeSystemId || seriesProject.targetBoard || 'CBSE') as CurriculumSystemId;
    const converted = convertTopicToStudioChapter(foundTopic, cls, sys, seriesProject.activeEditionId);
    setChapter(converted);
    setActiveSectionId(converted.sections[0]?.id || '');
    setActiveView('setup');
  };

  // Active navigation view state
  const [activeView, setActiveView] = useState<string>('setup');
  const [activeSectionId, setActiveSectionId] = useState<string>(
    chapter.sections[0]?.id || ''
  );
  const [activeArchitectureItemId, setActiveArchitectureItemId] = useState<string>('intro');

  // Panels visibility (Copilot closed by default)
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isCopilotCollapsed, setIsCopilotCollapsed] = useState(true);

  // Workspace column resizing state (persisted in localStorage)
  const [archNavWidth, setArchNavWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('novelcraft_arch_nav_width');
      return saved ? Math.min(340, Math.max(180, Number(saved))) : 240;
    } catch {
      return 240;
    }
  });

  const [copilotWidth, setCopilotWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('novelcraft_copilot_width');
      return saved ? Math.min(380, Math.max(200, Number(saved))) : 280;
    } catch {
      return 280;
    }
  });

  const handleUpdateArchNavWidth = (w: number) => {
    const clamped = Math.min(340, Math.max(180, w));
    setArchNavWidth(clamped);
    try {
      localStorage.setItem('novelcraft_arch_nav_width', String(clamped));
    } catch {
      // ignore
    }
  };

  const handleUpdateCopilotWidth = (w: number) => {
    const clamped = Math.min(380, Math.max(200, w));
    setCopilotWidth(clamped);
    try {
      localStorage.setItem('novelcraft_copilot_width', String(clamped));
    } catch {
      // ignore
    }
  };

  // Nav resize drag handling
  const handleNavMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = archNavWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      handleUpdateArchNavWidth(startWidth + delta);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleNavTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const startWidth = archNavWidth;

    const onTouchMove = (moveEvent: TouchEvent) => {
      const delta = moveEvent.touches[0].clientX - startX;
      handleUpdateArchNavWidth(startWidth + delta);
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  // Copilot resize drag handling
  const handleCopilotMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = copilotWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      // Dragging to left increases width
      const delta = startX - moveEvent.clientX;
      handleUpdateCopilotWidth(startWidth + delta);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleCopilotTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const startWidth = copilotWidth;

    const onTouchMove = (moveEvent: TouchEvent) => {
      const delta = startX - moveEvent.touches[0].clientX;
      handleUpdateCopilotWidth(startWidth + delta);
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  // Responsive layout: auto-collapse secondary columns on smaller viewports
  useEffect(() => {
    const checkResponsive = () => {
      if (window.innerWidth < 1150) {
        setIsCopilotCollapsed(true);
      }
      if (window.innerWidth < 900) {
        setIsNavCollapsed(true);
      }
    };
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  // Header auto-compacting on vertical scroll
  const [isHeaderCompacted, setIsHeaderCompacted] = useState(false);
  const [isHeaderPinned, setIsHeaderPinned] = useState(false);
  const [showCompactMoreMenu, setShowCompactMoreMenu] = useState(false);

  const handleCanvasScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isHeaderPinned) return;
    const st = e.currentTarget.scrollTop;
    if (st > 90 && !isHeaderCompacted) {
      setIsHeaderCompacted(true);
    } else if (st < 35 && isHeaderCompacted) {
      setIsHeaderCompacted(false);
    }
  }, [isHeaderPinned, isHeaderCompacted]);

  // Quick Maximise (Focus Mode) state & layout restoration
  const [isFocusMaximized, setIsFocusMaximized] = useState(false);
  const savedLayoutRef = useRef<{
    isSecondaryExpanded: boolean;
    isNavCollapsed: boolean;
    isCopilotCollapsed: boolean;
  } | null>(null);

  const handleToggleFocusMaximized = useCallback(() => {
    if (!isFocusMaximized) {
      // Save current layout before collapsing
      savedLayoutRef.current = {
        isSecondaryExpanded: !!isSecondaryExpanded,
        isNavCollapsed,
        isCopilotCollapsed,
      };
      onToggleSecondary?.(false);
      setIsNavCollapsed(true);
      setIsCopilotCollapsed(true);
      setIsFocusMaximized(true);
    } else {
      // Restore previous layout
      if (savedLayoutRef.current) {
        onToggleSecondary?.(savedLayoutRef.current.isSecondaryExpanded);
        setIsNavCollapsed(savedLayoutRef.current.isNavCollapsed);
        setIsCopilotCollapsed(savedLayoutRef.current.isCopilotCollapsed);
      } else {
        onToggleSecondary?.(true);
        setIsNavCollapsed(false);
        setIsCopilotCollapsed(false);
      }
      setIsFocusMaximized(false);
    }
  }, [isFocusMaximized, isSecondaryExpanded, isNavCollapsed, isCopilotCollapsed, onToggleSecondary]);

  // Keyboard shortcut: Escape exits focus mode, Ctrl/Cmd + Shift + F toggles focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMaximized) {
        handleToggleFocusMaximized();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        handleToggleFocusMaximized();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMaximized, handleToggleFocusMaximized]);

  // Modals
  const [editingBlock, setEditingBlock] = useState<TextbookContentBlock | null>(null);
  const [showVisualStudio, setShowVisualStudio] = useState(false);
  const [activeVisualRecordId, setActiveVisualRecordId] = useState<string | undefined>(undefined);
  const [showQualityAudit, setShowQualityAudit] = useState(false);
  const [showClarityAudit, setShowClarityAudit] = useState(false);
  const [clarityAuditTargetQuestion, setClarityAuditTargetQuestion] = useState<GrammarQuestion | null>(null);
  const [showAccuracyAudit, setShowAccuracyAudit] = useState(false);
  const [accuracyAuditTargetQuestion, setAccuracyAuditTargetQuestion] = useState<GrammarQuestion | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showBoardAdaptModal, setShowBoardAdaptModal] = useState(false);
  const [showArchitectureCustomizer, setShowArchitectureCustomizer] = useState(false);
  const [showArchitectureReview, setShowArchitectureReview] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showSentenceDiagrammer, setShowSentenceDiagrammer] = useState(false);
  const [showCurriculumTraceability, setShowCurriculumTraceability] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);

  // Handle applying suggested revision from Clarity Audit
  const handleApplyClarityRevision = (revisedText: string, questionId?: string) => {
    if (!questionId) return;
    const updatedExercises = (chapter.exercises || []).map((ex) => {
      const hasQ = (ex.questions || []).some((q) => q.id === questionId);
      if (!hasQ) return ex;
      return {
        ...ex,
        questions: (ex.questions || []).map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              prompt: revisedText,
              originalSentence: q.originalSentence ? revisedText : q.originalSentence,
              blanksSentence: q.blanksSentence ? revisedText : q.blanksSentence,
            };
          }
          return q;
        }),
      };
    });
    handleUpdateChapter({
      ...chapter,
      exercises: updatedExercises,
      lastSaved: new Date().toISOString(),
    });
  };

  // Handle applying suggested corrections from Accuracy & Answer Key Audit
  const handleApplyAccuracyCorrection = (params: {
    questionId: string;
    newPrompt?: string;
    newAnswer?: string;
    userAction: 'apply_prompt' | 'apply_answer' | 'apply_both';
    previousPrompt?: string;
    previousAnswer?: string;
  }) => {
    const { questionId, newPrompt, newAnswer } = params;
    if (!questionId) return;

    const updatedExercises = (chapter.exercises || []).map((ex) => {
      const hasQ = (ex.questions || []).some((q) => q.id === questionId);
      if (!hasQ) return ex;
      return {
        ...ex,
        questions: (ex.questions || []).map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              ...(newPrompt !== undefined
                ? {
                    prompt: newPrompt,
                    originalSentence: q.originalSentence ? newPrompt : q.originalSentence,
                    blanksSentence: q.blanksSentence ? newPrompt : q.blanksSentence,
                  }
                : {}),
              ...(newAnswer !== undefined
                ? {
                    correctAnswer: newAnswer,
                    modelAnswer: newAnswer,
                  }
                : {}),
            };
          }
          return q;
        }),
      };
    });

    handleUpdateChapter({
      ...chapter,
      exercises: updatedExercises,
      lastSaved: new Date().toISOString(),
    });
  };

  // Active book architecture configuration governing this chapter
  const activeArchitecture = useMemo(
    () => resolveActiveBookArchitecture(seriesProject),
    [seriesProject]
  );

  // Live architecture alignment statistics
  const archStats = useMemo(
    () => calculateArchitectureCompletionStats(chapter, activeArchitecture),
    [chapter, activeArchitecture]
  );

  // Synchronize active chapter back to the parent seriesProject
  const handleUpdateChapter = (updatedChapter: StudioChapter) => {
    setChapter(updatedChapter);

    // Sync back to underlying GrammarTopic
    const updatedTopic = syncStudioChapterToTopic(updatedChapter, currentTopic);
    setCurrentTopic(updatedTopic);

    // Find and update the topic in seriesProject
    const updatedBooks = { ...seriesProject.books };
    Object.keys(updatedBooks).forEach((bookKey) => {
      const book = updatedBooks[bookKey];
      const topicIndex = book.topics.findIndex((t) => t.id === updatedTopic.id);
      if (topicIndex !== -1) {
        const newTopics = [...book.topics];
        newTopics[topicIndex] = updatedTopic;
        updatedBooks[bookKey] = {
          ...book,
          topics: newTopics,
        };
      }
    });

    onUpdateSeriesProject({
      ...seriesProject,
      books: updatedBooks,
    });
  };

  // Add Chapter to Book (adheres to: A BOOK HAS NO FIXED NUMBER OF CHAPTERS)
  const handleAddNewChapter = (title: string, category?: string) => {
    const chapTitle = title.trim() || `Chapter ${allCurrentBookTopics.length + 1}: New Grammar Study`;
    const cat = category?.trim() || 'Syntax & Concord';
    const nextNum = allCurrentBookTopics.length + 1;
    const newTopicId = `top-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newStudioChapter = createChapterFromArchitecture(
      activeArchitecture,
      newTopicId,
      chapTitle,
      nextNum,
      targetClass,
      targetSystem
    );
    newStudioChapter.category = cat;

    const newTopic: GrammarTopic = {
      id: newTopicId,
      order: nextNum,
      title: chapTitle,
      category: cat,
      classLevel: targetClass,
      curriculumSystemId: targetSystem,
      overview: `Academic study of ${chapTitle} adhering to canonical book architecture.`,
      learningObjectives: [
        `Understand foundational grammatical rules of ${chapTitle}`,
        `Apply structural rules in sentence formation`,
        `Identify and rectify common errors in board examinations`,
      ],
      definitions: [
        {
          id: `def-${newTopicId}-1`,
          term: chapTitle,
          partOfSpeechOrCategory: cat,
          ageAppropriateExplanation: `Essential grammatical explanation of ${chapTitle} for ${targetClass}.`,
          rules: [`Core standard rule for ${chapTitle}.`],
          examples: [
            {
              sentence: `Illustrative sentence demonstrating ${chapTitle}.`,
              note: 'Standard declarative application.',
            },
          ],
        },
      ],
      notesAndTheoryMarkdown: `# ${chapTitle}\n\nDetailed pedagogical notes and syntactic theory conforming to standard book architecture.`,
      exercises: newStudioChapter.exercises.map((ex) => ({
        id: `ex-${newTopicId}-${ex.letter}`,
        title: ex.title,
        instructions: ex.instructions || 'Complete the following grammatical practice items.',
        targetType: ((ex as any).targetType as any) || 'mixed',
        tier: ((ex as any).tier as any) || 'mixed',
        difficulty: 'Medium' as const,
        questions: ex.questions || [],
        maxMarks: ex.questions?.length || 10,
      })),
      testSeries: [],
      studioChapter: newStudioChapter,
    };

    const bookKey = targetClass;
    const currentBook = seriesProject.books[bookKey] || Object.values(seriesProject.books)[0];
    if (currentBook) {
      const updatedTopics = [...currentBook.topics, newTopic];
      const targetUnitId = currentBook.units[0]?.id;
      const updatedUnits = currentBook.units.map((u, idx) => {
        if (idx === 0 || u.id === targetUnitId) {
          return { ...u, chapterIds: [...u.chapterIds, newTopicId] };
        }
        return u;
      });

      const updatedSeriesProject = {
        ...seriesProject,
        books: {
          ...seriesProject.books,
          [bookKey]: {
            ...currentBook,
            topics: updatedTopics,
            units: updatedUnits,
          },
        },
      };

      onUpdateSeriesProject(updatedSeriesProject);
      setCurrentTopic(newTopic);
      setChapter(newStudioChapter);
      setActiveSectionId(newStudioChapter.sections[0]?.id || '');
      setActiveView('setup');
      setShowAddChapterModal(false);
      setNewChapterTitleInput('');
    }
  };

  // Section handling
  const handleAddSection = () => {
    const nextNum = chapter.sections.length + 1;
    const newSec = {
      id: `sec-${Date.now()}`,
      chapterId: chapter.id,
      numberLabel: `${chapter.chapterNumber}.${nextNum}`,
      title: `Section ${nextNum}: New Topic Rule`,
      order: nextNum,
      blocks: [
        {
          id: `blk-text-${Date.now()}`,
          type: 'text' as ContentBlockType,
          order: 1,
          visibility: 'student' as const,
          textContent: 'Write introductory exposition for this grammatical rule...',
        },
      ],
    };
    const updatedChapter = {
      ...chapter,
      sections: [...chapter.sections, newSec],
    };
    handleUpdateChapter(updatedChapter);
    setActiveSectionId(newSec.id);
    setActiveView('section');
  };

  const handleUpdateSection = (updatedSec: any) => {
    const updatedSections = chapter.sections.map((s) =>
      s.id === updatedSec.id ? updatedSec : s
    );
    handleUpdateChapter({
      ...chapter,
      sections: updatedSections,
    });
  };

  const handleDeleteSection = (secId: string) => {
    if (chapter.sections.length <= 1) return;
    const filtered = chapter.sections.filter((s) => s.id !== secId);
    handleUpdateChapter({
      ...chapter,
      sections: filtered,
    });
    if (activeSectionId === secId) {
      setActiveSectionId(filtered[0]?.id || '');
    }
  };

  // Block handlers
  const handleAddBlockToCurrentSection = (type: ContentBlockType) => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const newBlock: TextbookContentBlock = {
      id: `blk-${Date.now()}`,
      type,
      order: activeSec.blocks.length + 1,
      visibility: 'student',
      textContent: type === 'text' ? 'Write continuous textbook prose here...' : undefined,
      calloutTitle: type === 'grammar_rule' ? 'RULE STATEMENT' : undefined,
      calloutText: type === 'grammar_rule' ? 'State the clear grammatical principle.' : undefined,
    };

    const updatedSec = {
      ...activeSec,
      blocks: [...activeSec.blocks, newBlock],
    };
    handleUpdateSection(updatedSec);
    setEditingBlock(newBlock);
  };

  const handleSaveBlock = (updatedBlock: TextbookContentBlock) => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const updatedBlocks = activeSec.blocks.map((b) =>
      b.id === updatedBlock.id ? updatedBlock : b
    );
    handleUpdateSection({
      ...activeSec,
      blocks: updatedBlocks,
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const updatedBlocks = activeSec.blocks.filter((b) => b.id !== blockId);
    handleUpdateSection({
      ...activeSec,
      blocks: updatedBlocks,
    });
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const idx = activeSec.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === activeSec.blocks.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newBlocks = [...activeSec.blocks];
    const temp = newBlocks[idx];
    newBlocks[idx] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;

    handleUpdateSection({
      ...activeSec,
      blocks: newBlocks,
    });
  };

  const handleInsertCopilotBlock = (block: TextbookContentBlock) => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const updatedSec = {
      ...activeSec,
      blocks: [...activeSec.blocks, block],
    };
    handleUpdateSection(updatedSec);
  };

  const handleInsertVisualBlock = (visualBlock: TextbookContentBlock) => {
    const activeSec = chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];
    if (!activeSec) return;

    const updatedSec = {
      ...activeSec,
      blocks: [...activeSec.blocks, visualBlock],
    };
    handleUpdateSection(updatedSec);
  };

  const handleExportChapterJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(chapter, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${chapter.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_manuscript.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to export chapter JSON', e);
    }
  };

  const [isWritingChapter, setIsWritingChapter] = useState(false);
  const [authoringNotification, setAuthoringNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleWriteChapter = async () => {
    if (isWritingChapter) return;
    setIsWritingChapter(true);
    setAuthoringNotification(null);
    try {
      const response = await fetch('/api/chapter-studio/author-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: chapter.id,
          chapterNumber: chapter.chapterNumber || (chapter as any).number || 1,
          chapterTitle: chapter.title,
          title: chapter.title,
          subtitle: chapter.subtitle,
          board: chapter.systemId || seriesProject.activeSystemId || 'CISCE',
          systemId: chapter.systemId || seriesProject.activeSystemId || 'CISCE',
          classLevel: chapter.equivalentClass || seriesProject.selectedClass || 'Class 6',
          subject: chapter.category || 'English Grammar',
          category: chapter.category || 'Grammar',
          topicDescription: chapter.description || initialTopic.title || (initialTopic as any).name || '',
          existingSectionsCount: chapter.sections?.length || 0,
        }),
      });

      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const errJson = await response.json();
          if (errJson?.error) errorDetail = errJson.error;
        } catch {
          // ignore
        }
        throw new Error(`Authoring pipeline failed: ${errorDetail}`);
      }

      const data = await response.json();
      const components = data?.components || data?.data;
      if (!data || !data.success || !components) {
        throw new Error(data?.error || 'Invalid authoring pipeline response payload');
      }

      const comp1 = components.component1 || {};
      const comp2 = components.component2 || {};
      const comp3 = components.component3 || {};
      const comp4 = components.component4 || {};

      // Build updated sections ensuring discovery vignette & questions are preserved
      let updatedSections = [...(chapter.sections || [])];
      const discoveryIndex = updatedSections.findIndex(
        (s) => s.id === 'sec-concept-discovery' || s.title?.toLowerCase().includes('discovery')
      );

      const discoveryBlocks: TextbookContentBlock[] = [
        {
          id: `blk-discovery-text-${Date.now()}`,
          type: 'text',
          textContent: comp4.discoveryVignette || '',
          metadata: { componentId: 'comp-4' },
          order: 1,
          visibility: 'student',
        },
        {
          id: `blk-discovery-questions-${Date.now()}`,
          type: 'try_this',
          textContent: comp4.discoveryQuestions || '',
          metadata: { componentId: 'comp-4' },
          order: 2,
          visibility: 'student',
        },
      ];

      if (discoveryIndex >= 0) {
        updatedSections[discoveryIndex] = {
          ...updatedSections[discoveryIndex],
          blocks: discoveryBlocks,
        };
      } else {
        const newDiscoverySection = {
          id: 'sec-concept-discovery',
          chapterId: chapter.id,
          title: 'Concept Introduction & Discovery Vignette',
          order: 1,
          blocks: discoveryBlocks,
        };
        updatedSections = [newDiscoverySection, ...updatedSections];
      }

      // Merge newly authored components 1-4 into canonical StudioChapter state
      const updatedChapter: StudioChapter = {
        ...chapter,
        title: comp1.title || chapter.title,
        subtitle: comp1.subtitle || chapter.subtitle,
        keyVocabulary: comp1.keyVocabulary && comp1.keyVocabulary.length > 0 ? comp1.keyVocabulary : chapter.keyVocabulary,
        sections: updatedSections,
        opening: {
          ...chapter.opening,
          title: comp1.title || chapter.opening.title || chapter.title,
          subtitle: comp1.subtitle || chapter.opening.subtitle || chapter.subtitle,
          openingHook: comp1.openingHook || chapter.opening.openingHook,
          shortIntroduction: comp1.shortIntroduction || chapter.opening.shortIntroduction,
          estimatedStudyTimeMinutes: comp1.estimatedStudyTimeMinutes ?? chapter.opening.estimatedStudyTimeMinutes ?? 45,
          keyVocabulary: comp1.keyVocabulary && comp1.keyVocabulary.length > 0 ? comp1.keyVocabulary : chapter.opening.keyVocabulary,
          conceptsCovered: comp1.conceptsCovered && comp1.conceptsCovered.length > 0 ? comp1.conceptsCovered : chapter.opening.conceptsCovered,
          learningObjectives: comp2.learningObjectives && comp2.learningObjectives.length > 0 ? comp2.learningObjectives : chapter.opening.learningObjectives,
          warmUpActivity: comp3.warmUpActivity || chapter.opening.warmUpActivity,
          priorKnowledge: comp3.priorKnowledge || chapter.opening.priorKnowledge,
          discoveryVignette: comp4.discoveryVignette || chapter.opening.discoveryVignette,
          discoveryQuestions: comp4.discoveryQuestions || chapter.opening.discoveryQuestions,
          discoveryQuestion: comp4.discoveryQuestions || chapter.opening.discoveryQuestion,
          teacherGuidance: comp4.teacherGuidance || (chapter.opening as any).teacherGuidance,
        } as any,
        workflowStatus: 'draft' as any,
        lastSaved: new Date().toISOString(),
        saveStatus: 'saved',
      };

      // Persist across state and series project topic
      handleUpdateChapter(updatedChapter);
      setActiveView('opener');
      setIsCopilotCollapsed(false);

      const sourceLabel = data?.source === 'gemini-3.8-flash'
        ? 'AI Studio Gemini Model'
        : 'Veritas Canonical Pedagogical Engine';
      setAuthoringNotification({
        type: 'success',
        message: `Chapter authored successfully via ${sourceLabel}! Components 1–4 are now updated in the manuscript.`,
      });
    } catch (error: any) {
      console.error('Error in WRITE CHAPTER authoring pipeline:', error);
      setAuthoringNotification({
        type: 'error',
        message: error?.message || 'Failed to author chapter components. Please try again.',
      });
    } finally {
      setIsWritingChapter(false);
    }
  };

  const handleTriggerAiPrompt = (prompt: string) => {
    setIsCopilotCollapsed(false);
  };

  return (
    <div
      className="h-full w-full flex-1 flex flex-col overflow-hidden min-h-0 min-w-0 bg-[#F6F0E7] text-[#292521]"
    >
      {/* Top Header: Either Compact Sticky Header or Full Dual Dashboard Header */}
      {isHeaderCompacted ? (
        /* Sleek Auto-Compacted Header (h-9, 36px) */
        <div className="h-9 border-b border-[#CBBEAC] flex items-center justify-between px-3 sm:px-4 bg-[#EDE4D6] text-[#292521] shrink-0 z-20 shadow-2xs select-none">
          {/* Left: Identity & Quick Stage */}
          <div className="flex items-center space-x-2 min-w-0">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="p-1 rounded text-[#71685E] hover:text-[#292521] hover:bg-[#F6F0E7] transition-colors cursor-pointer"
                title="Return to Book Planner"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="w-5 h-5 rounded bg-[#5A1832] text-[#EDE4D6] text-[10px] font-serif font-bold flex items-center justify-center shrink-0">
              C{chapter.chapterNumber || 1}
            </div>
            <span className="font-serif font-bold text-xs truncate max-w-[140px] sm:max-w-xs md:max-w-sm text-[#35101F]">
              {chapter.title || 'Untitled Chapter'}
            </span>
            <span className="text-[#CBBEAC] hidden sm:inline">•</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFFDF8] text-[#5A1832] border border-[#CBBEAC] shrink-0 hidden sm:inline">
              {chapter.systemId || seriesProject.targetBoard || 'CISCE'} • {chapter.equivalentClass || seriesProject.selectedClass || 'Class 6'}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 hidden md:inline">
              Saved
            </span>
          </div>

          {/* Right: Context Actions, Focus Mode, More Tools, and Expand Button */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {activeView === 'exercises' ? (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#292521] border border-[#CBBEAC] shadow-2xs transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3 text-[#5A1832]" />
                <span className="hidden sm:inline">Textbook View</span>
              </button>
            ) : activeView === 'visuals' ? (
              <button
                type="button"
                onClick={() => {
                  setActiveVisualRecordId(undefined);
                  setShowVisualStudio(true);
                }}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-[#5A1832] text-[#EDE4D6] hover:bg-[#35101F] shadow-2xs transition-colors cursor-pointer border border-[#C29A52]/40"
              >
                <Sparkles className="w-3 h-3 text-[#C29A52]" />
                <span>Visual Studio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAddBlockToCurrentSection('text')}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-[#5A1832] text-[#EDE4D6] hover:bg-[#35101F] shadow-2xs transition-colors cursor-pointer border border-[#C29A52]/40"
              >
                <Plus className="w-3 h-3 text-[#C29A52]" />
                <span className="hidden sm:inline">Add Block</span>
              </button>
            )}

            {/* Quick Maximise (Focus Mode) */}
            <button
              type="button"
              onClick={handleToggleFocusMaximized}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isFocusMaximized
                  ? 'bg-[#5A1832] text-[#C29A52] border-[#5A1832]'
                  : 'bg-[#FFFDF8] text-[#71685E] hover:text-[#5A1832] border-[#CBBEAC] hover:bg-[#F6F0E7]'
              }`}
              title={isFocusMaximized ? 'Exit Focus Mode (Restore sidebars)' : 'Focus Mode (Maximize Canvas)'}
            >
              {isFocusMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCompactMoreMenu(!showCompactMoreMenu)}
                className="p-1 px-1.5 rounded-lg bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#292521] border border-[#CBBEAC] shadow-2xs transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                title="More tools"
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-[#5A1832]" />
              </button>
              {showCompactMoreMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl shadow-xl border border-[#CBBEAC] p-1.5 space-y-0.5 bg-[#FFFDF8] text-[#292521] z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSentenceDiagrammer(true);
                      setShowCompactMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                  >
                    <Split className="w-3.5 h-3.5 text-[#5A1832]" />
                    <span>Sentence Diagrammer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCurriculumTraceability(true);
                      setShowCompactMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Traceability Matrix</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSnapshotModal(true);
                      setShowCompactMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-[#71685E]" />
                    <span>Version Snapshots</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBoardAdaptModal(true);
                      setShowCompactMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EDE4D6] flex items-center space-x-2 text-xs text-[#292521] font-medium cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#C29A52]" />
                    <span>Adapt Board</span>
                  </button>
                </div>
              )}
            </div>

            {/* Expand Header Button */}
            <button
              type="button"
              onClick={() => {
                setIsHeaderCompacted(false);
                setIsHeaderPinned(true);
              }}
              className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-lg bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#71685E] hover:text-[#5A1832] border border-[#CBBEAC] text-xs font-semibold cursor-pointer"
              title="Expand Full Header"
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#5A1832]" />
              <span className="hidden sm:inline text-[10px]">Expand</span>
            </button>
          </div>
        </div>
      ) : (
        /* Full Application Header and Live Dashboard Bar */
        <>
          <header
            className="h-10 border-b border-[#CBBEAC] flex items-center justify-between px-3 sm:px-4 shrink-0 z-20 select-none bg-[#EDE4D6] text-[#292521] shadow-2xs"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              {onBackToDashboard && (
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-semibold text-[#71685E] hover:text-[#292521] hover:bg-[#F6F0E7] transition-colors cursor-pointer"
                  title="Return to Book Planner"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Book Planner</span>
                </button>
              )}

              <div className="h-4 w-px bg-[#CBBEAC]" />

              <div className="flex items-center space-x-2 min-w-0">
                <BookOpen className="w-4 h-4 text-[#C29A52] shrink-0" />
                <h1 className="font-bold text-xs sm:text-sm tracking-tight text-[#35101F] truncate">
                  Chapter Authoring Studio
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F6F0E7] text-[#5A1832] border border-[#CBBEAC] shrink-0">
                  Editorial Production Edition
                </span>
              </div>
            </div>

            {/* Panel Toggles & Board Adapt */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Book Architecture Indicator & Blueprint Manager */}
              <button
                type="button"
                onClick={() => setShowArchitectureCustomizer(true)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#FFFDF8] text-[#5A1832] border border-[#C29A52]/50 hover:border-[#C29A52] transition-colors shadow-2xs cursor-pointer"
                title="Book Architecture Alignment: Click to customize components or view inheritance status"
              >
                <Layers className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Blueprint: <strong className="text-[#5A1832]">{archStats.percentage}%</strong></span>
                <span className="text-[10px] opacity-75 hidden md:inline">({archStats.complete}/{archStats.totalComponents})</span>
              </button>

              <button
                type="button"
                onClick={() => setShowArchitectureReview(true)}
                className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-medium text-[#71685E] hover:text-[#292521] hover:bg-[#F6F0E7] border border-[#CBBEAC] transition-colors cursor-pointer"
                title="Compare chapter against Master Book Architecture"
              >
                <RefreshCw className="w-3 h-3 text-[#C29A52]" />
                <span>Sync Architecture</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCurriculumModal(true)}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#FFFDF8] text-[#5A1832] border border-[#C29A52]/50 hover:border-[#C29A52] transition-colors shadow-2xs cursor-pointer"
                title="Curriculum & Framework Intelligence: View mapped requirements, coverage, and academic review"
              >
                <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Curriculum: <strong className="text-[#5A1832]">{chapter.systemId || 'CBSE'}</strong></span>
              </button>

              <button
                type="button"
                onClick={() => setShowBoardAdaptModal(true)}
                className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#5A1832] text-[#EDE4D6] hover:bg-[#35101F] border border-[#C29A52]/40 transition-colors shadow-2xs cursor-pointer"
                title="Adapt Chapter for CBSE / CISCE / Cambridge Curriculum"
              >
                <Globe className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Adapt Board</span>
              </button>

              <div className="h-4 w-px bg-[#CBBEAC] mx-1" />

              <button
                type="button"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className="p-1 rounded-lg hover:bg-[#F6F0E7] text-[#71685E] hover:text-[#292521] cursor-pointer"
                title={isNavCollapsed ? 'Open Navigator' : 'Collapse Navigator'}
              >
                {isNavCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsCopilotCollapsed(!isCopilotCollapsed)}
                className="p-1 rounded-lg hover:bg-[#F6F0E7] text-[#71685E] hover:text-[#292521] cursor-pointer"
                title={isCopilotCollapsed ? 'Open Copilot' : 'Collapse Copilot'}
              >
                {isCopilotCollapsed ? (
                  <PanelRightOpen className="w-4 h-4" />
                ) : (
                  <PanelRightClose className="w-4 h-4" />
                )}
              </button>
            </div>
          </header>

          {/* Phase 4L: Professional Chapter Production Status & Stage Pipeline Bar */}
          <div className="shrink-0">
            <ChapterProductionDashboardHeader
              chapter={chapter}
              architecture={activeArchitecture}
              activeStageId={activeView}
              onSelectStage={(stageId) => setActiveView(stageId)}
              onOpenDiagrammer={() => setShowSentenceDiagrammer(true)}
              onOpenTraceability={() => setShowCurriculumTraceability(true)}
              onOpenSnapshots={() => setShowSnapshotModal(true)}
              isDarkMode={false}
              onToggleCompact={() => setIsHeaderCompacted(true)}
              onToggleFocusMaximized={handleToggleFocusMaximized}
              isFocusMaximized={isFocusMaximized}
              chapters={chaptersList}
              activeChapterId={currentTopic.id}
              onSelectChapter={handleSelectChapter}
              onAddChapter={() => setShowAddChapterModal(true)}
            />
          </div>
        </>
      )}

      {/* Global Studio Menu Bar: Write Chapter, Chapter, Insert, Review, AI Tools, Publish */}
      <div className="shrink-0">
        <ChapterStudioMenuBar
          onWriteChapter={handleWriteChapter}
          isWritingChapter={isWritingChapter}
          onAddChapter={() => setShowAddChapterModal(true)}
          onOpenChapterInfo={() => setActiveView('setup')}
          onOpenChapterArchitecture={() => setShowArchitectureCustomizer(true)}
          onOpenLearningObjectives={() => setActiveView('objectives')}
          onOpenChapterSettings={() => setActiveView('setup')}
          onOpenCurriculumMapping={() => setShowCurriculumModal(true)}
          onOpenScopeSequence={() => setShowCurriculumTraceability(true)}
          onOpenChapterStatus={() => setActiveView('setup')}
          onOpenSnapshots={() => setShowSnapshotModal(true)}
          onInsertBlock={(type) => handleAddBlockToCurrentSection(type)}
          onInsertImage={() => handleAddBlockToCurrentSection('visual')}
          onInsertDiagram={() => setShowSentenceDiagrammer(true)}
          onOpenQualityAudit={() => setShowQualityAudit(true)}
          onOpenClarityAudit={() => {
            setShowClarityAudit(true);
            setClarityAuditTargetQuestion(null);
          }}
          onOpenAccuracyAudit={() => {
            setShowAccuracyAudit(true);
            setAccuracyAuditTargetQuestion(null);
          }}
          onOpenCurriculumAlignment={() => setShowCurriculumModal(true)}
          onOpenTraceabilityMatrix={() => setShowCurriculumTraceability(true)}
          onOpenReadingPreview={() => setShowPreview(true)}
          onOpenSpellingGrammar={() => setShowQualityAudit(true)}
          onOpenAccessibilityCheck={() => setShowQualityAudit(true)}
          onOpenEditorialNotes={() => setActiveView('teacher_guide')}
          onOpenAiWritingAssistant={() => setIsCopilotCollapsed(false)}
          onTriggerAiAction={handleTriggerAiPrompt}
          onGenerateVisualBrief={() => {
            setActiveVisualRecordId(undefined);
            setShowVisualStudio(true);
          }}
          onOpenTextbookView={() => setShowPreview(true)}
          onOpenStudentEditionPreview={() => setShowPreview(true)}
          onOpenTeacherEditionPreview={() => setActiveView('teacher_guide')}
          onOpenVisualStudio={() => {
            setActiveVisualRecordId(undefined);
            setShowVisualStudio(true);
          }}
          onOpenExerciseStudio={() => setActiveView('assessment')}
          onExportChapter={handleExportChapterJson}
          onExportBook={() => {
            if (onBackToDashboard) onBackToDashboard();
          }}
          onPreflightCheck={() => setShowQualityAudit(true)}
          onPublishingStatus={() => setActiveView('setup')}
        />
      </div>

      {/* Authoring Feedback Notification Banner */}
      {authoringNotification && (
        <div
          role="alert"
          className={`shrink-0 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b transition-all ${
            authoringNotification.type === 'success'
              ? 'bg-[#EBF5EE] text-[#1E5631] border-[#A8D5BA]'
              : authoringNotification.type === 'error'
              ? 'bg-[#FDF0F0] text-[#842029] border-[#F5C2C7]'
              : 'bg-[#EAF2F8] text-[#1A4B75] border-[#B8D5E5]'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            {authoringNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
            ) : authoringNotification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#1976D2] shrink-0" />
            )}
            <span className="truncate">{authoringNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthoringNotification(null)}
            className="flex items-center space-x-1 text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer ml-3 shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        </div>
      )}

      {/* Main 3-Column Studio Workspace with Independent Resizing */}
      <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden relative">
        {/* Left Column: Chapter Structure Navigator (Resizable 180-340px) */}
        {!isNavCollapsed ? (
          <aside
            style={{ width: `${archNavWidth}px` }}
            className="shrink-0 h-full min-h-0 border-r border-[#CBBEAC] flex flex-col overflow-hidden bg-[#EDE4D6] relative group/nav"
          >
            <ChapterStructureNavigator
              chapter={chapter}
              activeSectionId={activeSectionId}
              onSelectSection={(secId) => {
                setActiveSectionId(secId);
                setActiveView('section');
              }}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              activeView={activeView}
              onSelectView={setActiveView}
              onUpdateChapter={handleUpdateChapter}
              architecture={activeArchitecture}
              activeArchitectureItemId={activeArchitectureItemId}
              onSelectArchitectureItem={(itemId, viewId) => {
                setActiveArchitectureItemId(itemId);
                setActiveView(viewId);
              }}
              onOpenArchitectureCustomizer={() => setShowArchitectureCustomizer(true)}
              onToggleCollapse={() => setIsNavCollapsed(true)}
              chapters={chaptersList}
              activeTopicId={currentTopic.id}
              onSelectChapter={handleSelectChapter}
              onAddChapter={() => setShowAddChapterModal(true)}
              isDarkMode={false}
            />

            {/* Draggable Divider on Right Edge */}
            <div
              onMouseDown={handleNavMouseDown}
              onTouchStart={handleNavTouchStart}
              onDoubleClick={() => handleUpdateArchNavWidth(240)}
              className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize z-30 flex items-center justify-center hover:bg-[#C29A52]/20 active:bg-[#5A1832]/30 transition-colors select-none"
              title="Drag to resize Architecture (180–340px) • Double-click to restore default (240px)"
            >
              <div className="w-[2px] h-8 bg-transparent group-hover/nav:bg-[#C29A52] active:bg-[#5A1832] transition-colors rounded-full" />
            </div>
          </aside>
        ) : (
          <button
            type="button"
            onClick={() => setIsNavCollapsed(false)}
            className="w-7 h-full bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 border-r border-[#CBBEAC] flex flex-col items-center justify-start pt-4 text-[#71685E] hover:text-[#5A1832] cursor-pointer transition-colors shrink-0 group select-none"
            title="Expand Chapter Architecture"
          >
            <PanelLeftOpen className="w-4 h-4 mb-3 text-[#5A1832]" />
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-widest text-[#5A1832]">
              Architecture
            </span>
          </button>
        )}

        {/* Center Column: Manuscript Canvas & Editor Area (min-w-0, flex-1, dominant working area) */}
        <main className="flex-1 min-w-0 h-full min-h-0 overflow-hidden flex flex-col bg-[#F6F0E7]">
          <ChapterManuscriptCanvas
            chapter={chapter}
            onUpdateChapter={handleUpdateChapter}
            activeView={activeView}
            activeSectionId={activeSectionId}
            architecture={activeArchitecture}
            activeArchitectureItemId={activeArchitectureItemId}
            onSelectView={setActiveView}
            onOpenPreview={() => setShowPreview(true)}
            onOpenQualityAudit={() => setShowQualityAudit(true)}
            onOpenVisualStudio={(visId?: string) => {
              setActiveVisualRecordId(visId);
              setShowVisualStudio(true);
            }}
            onOpenBoardAdapt={() => setShowBoardAdaptModal(true)}
            onEditBlock={setEditingBlock}
            onDeleteBlock={handleDeleteBlock}
            onMoveBlock={handleMoveBlock}
            onAddBlockToCurrentSection={handleAddBlockToCurrentSection}
            seriesProject={seriesProject}
            isDarkMode={false}
            onScroll={handleCanvasScroll}
          />
        </main>

        {/* Right Column: Author Intelligence & Copilot Drawer (Resizable 200-380px) */}
        {!isCopilotCollapsed ? (
          <aside
            style={{ width: `${copilotWidth}px` }}
            className="shrink-0 h-full min-h-0 border-l border-[#CBBEAC] flex flex-col overflow-hidden bg-[#EDE4D6] relative group/copilot"
          >
            {/* Draggable Divider on Left Edge */}
            <div
              onMouseDown={handleCopilotMouseDown}
              onTouchStart={handleCopilotTouchStart}
              onDoubleClick={() => handleUpdateCopilotWidth(280)}
              className="absolute top-0 left-0 w-2.5 h-full cursor-col-resize z-30 flex items-center justify-center hover:bg-[#C29A52]/20 active:bg-[#5A1832]/30 transition-colors select-none"
              title="Drag to resize Copilot (200–380px) • Double-click to restore default (280px)"
            >
              <div className="w-[2px] h-8 bg-transparent group-hover/copilot:bg-[#C29A52] active:bg-[#5A1832] transition-colors rounded-full" />
            </div>

            <AuthorCopilotDrawer
              chapter={chapter}
              selectedText=""
              activeSectionTitle={
                chapter.sections.find((s) => s.id === activeSectionId)?.title || ''
              }
              onInsertContentBlock={handleInsertCopilotBlock}
              onOpenVisualStudio={() => {
                setActiveVisualRecordId(undefined);
                setShowVisualStudio(true);
              }}
              onUpdateChapterAuthorNotes={(notes) =>
                handleUpdateChapter({ ...chapter, authorNotes: notes })
              }
              onToggleCollapse={() => setIsCopilotCollapsed(true)}
              isDarkMode={false}
            />
          </aside>
        ) : (
          <button
            type="button"
            onClick={() => setIsCopilotCollapsed(false)}
            className="w-7 h-full bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 border-l border-[#CBBEAC] flex flex-col items-center justify-start pt-4 text-[#71685E] hover:text-[#5A1832] cursor-pointer transition-colors shrink-0 group select-none"
            title="Expand Author Intelligence & Copilot"
          >
            <PanelRightOpen className="w-4 h-4 mb-3 text-[#5A1832]" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-widest text-[#5A1832]">
              Copilot
            </span>
          </button>
        )}
      </div>

      {/* Modals & Dialogs */}
      <ChapterBlockEditor
        isOpen={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        block={editingBlock}
        onSaveBlock={handleSaveBlock}
        isDarkMode={false}
      />

      {/* Phase 4E-1: Full-Screen Academic Visual & Illustration Studio */}
      {showVisualStudio && (
        <VisualIllustrationStudio
          chapter={chapter}
          onUpdateChapter={handleUpdateChapter}
          onClose={() => {
            setShowVisualStudio(false);
            setActiveVisualRecordId(undefined);
          }}
          initialVisualId={activeVisualRecordId}
        />
      )}

      <ChapterQualityAuditModal
        isOpen={showQualityAudit}
        onClose={() => setShowQualityAudit(false)}
        chapter={chapter}
        onUpdateQualityAudit={(updatedAudit) =>
          handleUpdateChapter({ ...chapter, qualityAudit: updatedAudit })
        }
        isDarkMode={false}
      />

      <AuditClarityModal
        isOpen={showClarityAudit}
        onClose={() => {
          setShowClarityAudit(false);
          setClarityAuditTargetQuestion(null);
        }}
        chapter={chapter}
        targetQuestion={clarityAuditTargetQuestion}
        onApplyRevision={handleApplyClarityRevision}
        isDarkMode={false}
      />

      <AuditAccuracyModal
        isOpen={showAccuracyAudit}
        onClose={() => {
          setShowAccuracyAudit(false);
          setAccuracyAuditTargetQuestion(null);
        }}
        chapter={chapter}
        targetQuestion={accuracyAuditTargetQuestion}
        onApplyCorrection={handleApplyAccuracyCorrection}
        isDarkMode={false}
      />

      <ChapterPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        chapter={chapter}
        isDarkMode={false}
      />

      <BoardAdaptModal
        isOpen={showBoardAdaptModal}
        onClose={() => setShowBoardAdaptModal(false)}
        chapter={chapter}
        onApplyAdaptation={handleUpdateChapter}
        isDarkMode={false}
      />

      {/* Phase 4G.3: Chapter Architecture Customizer Modal */}
      <ChapterArchitectureCustomizerModal
        isOpen={showArchitectureCustomizer}
        onClose={() => setShowArchitectureCustomizer(false)}
        chapter={chapter}
        architecture={activeArchitecture}
        onUpdateChapter={handleUpdateChapter}
        isDarkMode={false}
      />

      {/* Phase 4G.3: Master Architecture Update & Sync Review Modal */}
      <ArchitectureUpdateReviewModal
        isOpen={showArchitectureReview}
        onClose={() => setShowArchitectureReview(false)}
        chapter={chapter}
        architecture={activeArchitecture}
        onApplySync={handleUpdateChapter}
        isDarkMode={false}
      />

      {/* Phase 4H: Chapter Curriculum & Framework Intelligence Panel */}
      <ChapterCurriculumFrameworkModal
        isOpen={showCurriculumModal}
        onClose={() => setShowCurriculumModal(false)}
        chapter={chapter}
        onUpdateChapter={handleUpdateChapter}
        isDarkMode={false}
      />

      {/* Phase 4L: Sentence Diagrammer Modal */}
      <SentenceDiagrammerModal
        isOpen={showSentenceDiagrammer}
        onClose={() => setShowSentenceDiagrammer(false)}
        chapter={chapter}
        onInsertDiagram={(visualBlock) => handleInsertVisualBlock(visualBlock)}
        isDarkMode={false}
      />

      {/* Phase 4L: Curriculum Traceability Matrix Modal */}
      <CurriculumTraceabilityModal
        isOpen={showCurriculumTraceability}
        onClose={() => setShowCurriculumTraceability(false)}
        chapter={chapter}
        onNavigateToStage={(stage) => setActiveView(stage)}
        isDarkMode={false}
      />

      {/* Phase 4L: Editorial Snapshots & Version History Modal */}
      <ChapterSnapshotModal
        isOpen={showSnapshotModal}
        onClose={() => setShowSnapshotModal(false)}
        chapter={chapter}
        onRestoreSnapshot={(restored) => handleUpdateChapter(restored)}
        isDarkMode={false}
      />

      {/* Add Chapter to Book Modal */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 bg-[#292521]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-2xl p-5 text-[#292521] space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/70 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7]">
                  <BookOpen className="w-4 h-4 text-[#C29A52]" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#35101F]">Add Chapter to Book</h3>
                  <p className="text-[10px] text-[#71685E]">
                    {targetClass} • Chapter {allCurrentBookTopics.length + 1}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="p-1 rounded-lg text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#5A1832] uppercase tracking-wider mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={newChapterTitleInput}
                  onChange={(e) => setNewChapterTitleInput(e.target.value)}
                  placeholder="e.g. Non-Finite Verbs: Infinitives, Gerunds &amp; Participles"
                  className="w-full rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]/50 px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#5A1832] focus:bg-[#FFFDF8]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5A1832] uppercase tracking-wider mb-1">
                  Grammar Category
                </label>
                <select
                  value={newChapterCategoryInput}
                  onChange={(e) => setNewChapterCategoryInput(e.target.value)}
                  className="w-full rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]/50 px-3 py-2 text-xs text-[#292521] focus:outline-none focus:border-[#5A1832] focus:bg-[#FFFDF8]"
                >
                  <option value="Syntax & Concord">Syntax &amp; Concord</option>
                  <option value="Morphology & Parts of Speech">Morphology &amp; Parts of Speech</option>
                  <option value="Verb Tenses & Aspect">Verb Tenses &amp; Aspect</option>
                  <option value="Active & Passive Voice">Active &amp; Passive Voice</option>
                  <option value="Direct & Indirect Speech">Direct &amp; Indirect Speech</option>
                  <option value="Clauses & Sentence Structure">Clauses &amp; Sentence Structure</option>
                  <option value="Vocabulary & Semantics">Vocabulary &amp; Semantics</option>
                  <option value="Punctuation & Mechanics">Punctuation &amp; Mechanics</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EDE4D6]/60 border border-[#CBBEAC]/80 text-[11px] text-[#71685E] space-y-1">
                <div className="font-bold text-[#5A1832]">Architectural Inheritance Notice:</div>
                <div>
                  This new chapter will automatically inherit all 24 pedagogical components configured for this book, including concept discovery, worked examples, tiered exercises, and teacher annotations.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#CBBEAC]/60">
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] text-xs font-semibold text-[#71685E] hover:bg-[#EDE4D6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddNewChapter(newChapterTitleInput, newChapterCategoryInput)}
                className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#FFFDF8] text-xs font-bold hover:bg-[#35101F] shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Create &amp; Author Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
