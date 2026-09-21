import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { NavigationRail, WorkspaceType } from './components/NavigationRail';
import { SecondarySidebar } from './components/SecondarySidebar';
import { HomeDashboardView } from './components/HomeDashboardView';
import { CommandPalette } from './components/CommandPalette';
import { MainTab, isGrammarTab } from './components/Sidebar';
import { EditorView } from './components/EditorView';
import { CharactersView } from './components/CharactersView';
import { PlotOutlinesView } from './components/PlotOutlinesView';
import { StyleVoiceGuardView } from './components/StyleVoiceGuardView';
import { BookDesignView } from './components/BookDesignView';
import { AnalyticsView } from './components/AnalyticsView';
import { TeamCollabView } from './components/TeamCollabView';
import { FocusModeModal } from './components/FocusModeModal';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { NovelProject, Chapter, Scene, Character, PlotBeat, BookCoverDesign, TeamMember, StylePersona, CodexEntry, TimelineEvent, CharacterRelationship, QueryLetterData, ResearchNote, VersionSnapshot } from './types';
import { loadProjectFromLocalStorage, saveProjectToLocalStorage, syncProjectToCloud } from './utils/storage';
import { getInitialNovelProject } from './utils/initialData';
import { CodexView } from './components/CodexView';
import { TimelineView } from './components/TimelineView';
import { SensoryThesaurusView } from './components/SensoryThesaurusView';
import { RelationshipGraphView } from './components/RelationshipGraphView';
import { DialogueLabView } from './components/DialogueLabView';
import { PublishingKitView } from './components/PublishingKitView';
import { PacingHeatmapView } from './components/PacingHeatmapView';
import { ResearchView } from './components/ResearchView';
import { GrammarSeriesView } from './components/GrammarSeriesView';
import { SpiralCurriculumMatrixView } from './components/SpiralCurriculumMatrixView';
import { GrammarConceptsStudioView } from './components/GrammarConceptsStudioView';
import { QuestionBankStudioView } from './components/QuestionBankStudioView';
import { AssessmentBuilderStudioView } from './components/AssessmentBuilderStudioView';
import { GrammarQuizStudioView } from './components/GrammarQuizStudioView';
import { SentenceDiagrammerStudio } from './components/sentence-diagrammer/SentenceDiagrammerStudio';
import { DifferentiatedWorksheetsView } from './components/differentiated/DifferentiatedWorksheetsView';
import { SpacedRepetitionDeckView } from './components/SpacedRepetitionDeckView';
import { CompositionStudioView } from './components/composition/CompositionStudioView';
import { TextbookLayoutExporterView } from './components/textbook/TextbookLayoutExporterView';
import { BoardBlueprintMatrixView } from './components/BoardBlueprintMatrixView';
import { SeriesDashboardView } from './components/series/SeriesDashboardView';
import { SeriesStudioView } from './components/series/SeriesStudioView';
import { BookProjectsView } from './components/series/BookProjectsView';
import { CurriculumMappingView } from './components/series/CurriculumMappingView';
import { ChapterAuthoringStudio } from './components/chapter-studio/ChapterAuthoringStudio';
import { TextbookPreviewView } from './components/textbook/TextbookPreviewView';
import { PublisherSubmissionCentre } from './components/publishing/PublisherSubmissionCentre';
import { BookPlannerView } from './components/book-planner/BookPlannerView';
import { NovelWritingStudio } from './components/NovelWritingStudio';
import { ContentStudioView } from './components/ContentStudioView';
import { ScriptStudioView } from './components/ScriptStudioView';
import { ProjectLibraryView } from './components/ProjectLibraryView';
import { PublishingStudioView } from './components/PublishingStudioView';
import { HelpModal } from './components/HelpModal';
import { HumaniseFloatingModal } from './components/HumaniseFloatingModal';
import { GrammarSeriesProject, CurriculumSystemId, GrammarClassLevel, ContentWritingProject, ScriptProject } from './types';
import { getInitialGrammarSeriesProject } from './utils/grammarInitialData';
import { INITIAL_CONTENT_PROJECT, INITIAL_SCRIPT_PROJECT } from './utils/initialStudioData';
import { getDefaultCurriculumMatrix } from './utils/spiralMatrixData';
import { resolveActiveBookContext, switchActiveBookProject } from './utils/activeBookContext';

export default function App() {
  // Initialize state from local persistence or starter novel
  const [project, setProject] = useState<NovelProject>(() => {
    const saved = loadProjectFromLocalStorage();
    return saved || getInitialNovelProject();
  });

  // Grammar Series LMS Project State (Classes 3 to 12)
  const [grammarProject, setGrammarProject] = useState<GrammarSeriesProject>(() => {
    const saved = localStorage.getItem('novelcraft_grammar_series_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.curriculumMatrix) {
          parsed.curriculumMatrix = getDefaultCurriculumMatrix(parsed.targetBoard || 'CBSE');
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved grammar project:', e);
      }
    }
    return getInitialGrammarSeriesProject();
  });

  useEffect(() => {
    try {
      localStorage.setItem('novelcraft_grammar_series_v1', JSON.stringify(grammarProject));
    } catch (e) {
      console.error('Failed to save grammar project to localStorage:', e);
    }
  }, [grammarProject]);

  const [currentTab, setCurrentTab] = useState<MainTab>('manuscript');
  const [activeChapterId, setActiveChapterId] = useState<string>(
    project.chapters[0]?.id || 'chap-1'
  );
  const [activeSceneId, setActiveSceneId] = useState<string>(
    project.chapters[0]?.scenes[0]?.id || 'scene-1-1'
  );

  const [diagrammerSentence, setDiagrammerSentence] = useState<string>('');
  const [selectedGrammarTopicId, setSelectedGrammarTopicId] = useState<string>('');

  // Resolve authoritative active book context across the whole application
  const resolvedBookContext = useMemo(() => {
    return resolveActiveBookContext(grammarProject);
  }, [grammarProject]);

  const currentGrammarBook =
    grammarProject.books[grammarProject.selectedClass || 'Class 6'] ||
    Object.values(grammarProject.books)[0];
  const activeBookProject = resolvedBookContext.activeProject;

  const activeGrammarTopic = useMemo(() => {
    if (selectedGrammarTopicId) {
      if (activeBookProject?.topics) {
        const found = activeBookProject.topics.find((t) => t.id === selectedGrammarTopicId);
        if (found) return found;
      }
      if (currentGrammarBook?.topics) {
        const found = currentGrammarBook.topics.find((t) => t.id === selectedGrammarTopicId);
        if (found) return found;
      }
      for (const book of Object.values(grammarProject.books || {})) {
        const found = book.topics?.find((t) => t.id === selectedGrammarTopicId);
        if (found) return found;
      }
      for (const proj of resolvedBookContext.allProjects || []) {
        const found = proj.topics?.find((t) => t.id === selectedGrammarTopicId);
        if (found) return found;
      }
    }
    if (activeBookProject?.topics && activeBookProject.topics.length > 0) {
      return activeBookProject.topics[0];
    }
    if (currentGrammarBook?.topics && currentGrammarBook.topics.length > 0) {
      return currentGrammarBook.topics[0];
    }
    return {
      id: 'cbse-6-sva',
      title: 'Subject–Verb Agreement',
      category: 'Syntax & Agreement',
      classLevel: grammarProject.selectedClass || 'Class 6',
      overview: 'Core rules governing grammatical concord between subject and finite verbs.',
      learningObjectives: ['Understand singular vs. plural concordance', 'Apply proximity and compounding rules'],
      definitions: [],
      notesAndTheoryMarkdown: '# Subject-Verb Agreement\nRules and principles of concordance in standard English.',
      exercises: [],
      testSeries: [],
    };
  }, [
    selectedGrammarTopicId,
    activeBookProject,
    currentGrammarBook,
    grammarProject.books,
    grammarProject.selectedClass,
    resolvedBookContext.allProjects,
  ]);

  // Derive dynamic authoritative active Chapter Studio context
  const activeChapterStudioContext = useMemo(() => {
    if (currentTab !== 'chapter_studio') return undefined;

    const sysId = (resolvedBookContext.activeSystemId || grammarProject.activeSystemId || 'CBSE') as CurriculumSystemId;
    const clsLevel = (activeGrammarTopic?.classLevel || resolvedBookContext.selectedClass || grammarProject.selectedClass || 'Class 6') as GrammarClassLevel;
    const chTitle = activeGrammarTopic?.title || 'Chapter';
    const chNum = activeGrammarTopic?.order || 1;
    const bkTitle = resolvedBookContext.bookTitle || resolvedBookContext.activeProject?.bookTitle || `Step-by-Step English Grammar: ${clsLevel}`;

    return {
      systemId: sysId,
      classLevel: clsLevel,
      chapterTitle: chTitle,
      chapterNumber: chNum,
      bookTitle: bkTitle,
    };
  }, [
    currentTab,
    resolvedBookContext,
    grammarProject.activeSystemId,
    grammarProject.selectedClass,
    activeGrammarTopic,
  ]);

  // Appearance & State flags
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('novel_writer_dark_mode');
    return savedTheme !== null ? savedTheme === 'true' : true; // Default dark mode for writers
  });
  const [isSecondaryExpanded, setIsSecondaryExpanded] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Modals
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHumaniseModal, setShowHumaniseModal] = useState(false);

  // Content Studio & Script Studio Projects
  const [contentProject, setContentProject] = useState<ContentWritingProject>(() => {
    const saved = localStorage.getItem('veritas_content_project_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved content project', e);
      }
    }
    return INITIAL_CONTENT_PROJECT;
  });

  const [scriptProject, setScriptProject] = useState<ScriptProject>(() => {
    const saved = localStorage.getItem('veritas_script_project_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved script project', e);
      }
    }
    return INITIAL_SCRIPT_PROJECT;
  });

  useEffect(() => {
    localStorage.setItem('veritas_content_project_v1', JSON.stringify(contentProject));
  }, [contentProject]);

  useEffect(() => {
    localStorage.setItem('veritas_script_project_v1', JSON.stringify(scriptProject));
  }, [scriptProject]);

  // Workspace detection
  const getActiveWorkspace = useCallback((tab: MainTab): WorkspaceType => {
    if (tab === 'home') return 'home';
    if (tab === 'library') return 'library';
    if (tab === 'content_studio') return 'content';
    if (tab === 'script_studio') return 'film';
    if (isGrammarTab(tab)) {
      return 'academic';
    }
    if (['design', 'querykit', 'publishing_studio', 'textbook_exporter', 'publisher_submission'].includes(tab)) {
      return 'publishing';
    }
    if (['analytics', 'pacing'].includes(tab)) {
      return 'analytics';
    }
    return 'novel';
  }, []);

  const handleSelectWorkspace = useCallback((ws: WorkspaceType) => {
    if (ws === 'home') {
      setCurrentTab('home');
    } else if (ws === 'library') {
      setCurrentTab('library');
    } else if (ws === 'academic' || (ws as string) === 'grammar') {
      setCurrentTab('grammar_series');
    } else if (ws === 'novel') {
      setCurrentTab('manuscript');
    } else if (ws === 'content') {
      setCurrentTab('content_studio');
    } else if (ws === 'film') {
      setCurrentTab('script_studio');
    } else if (ws === 'publishing') {
      setCurrentTab('publishing_studio');
    } else if (ws === 'analytics' || ws === 'tools') {
      setCurrentTab('analytics');
    }
    setIsSecondaryExpanded(true);
  }, []);

  // Keyboard Shortcuts: Cmd+K for Command Palette, '[' to toggle sidebar, Alt+H for Humanise
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if ((e.altKey || (e.metaKey && e.shiftKey)) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHumaniseModal((prev) => !prev);
      }
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (e.key === '[' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSecondaryExpanded((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Dark Mode class to HTML document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('novel_writer_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Online / Offline tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Debounced Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProjectToLocalStorage(project);
    }, 800);
    return () => clearTimeout(timer);
  }, [project]);

  // Helper to append audit logs
  const addAuditLog = useCallback((action: string, details: string) => {
    setProject((prev) => {
      const newLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        action,
        user: 'Julian Mercer (Lead Author)',
        details,
      };
      return {
        ...prev,
        auditLogs: [newLog, ...prev.auditLogs.slice(0, 99)],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Centralized active book switcher across Veritas
  const handleSelectBookProject = useCallback((projectId: string) => {
    setGrammarProject((prev) => {
      const updated = switchActiveBookProject(prev, projectId);
      const targetClass = updated.selectedClass || 'Class 6';
      const targetProj = updated.bookProjects?.[projectId];
      const book = updated.books[targetClass];
      if (targetProj?.topics?.[0]?.id) {
        setSelectedGrammarTopicId(targetProj.topics[0].id);
      } else if (book?.topics?.[0]?.id) {
        setSelectedGrammarTopicId(book.topics[0].id);
      }
      return updated;
    });
    addAuditLog('ACTIVE_BOOK_PROJECT_SWITCHED', `Switched active book project to ${projectId}`);
  }, [addAuditLog]);

  // Centralized chapter studio launcher that synchronizes book, class, and board
  const handleOpenChapterStudio = useCallback((chapId?: string) => {
    if (chapId) {
      let foundClass: GrammarClassLevel | null = null;
      let foundBoard: CurriculumSystemId | null = null;
      let foundProjectId: string | null = null;

      // 1. Check all book projects
      for (const [pId, p] of Object.entries(resolvedBookContext.allProjectsRecord || {})) {
        if (p.topics?.some((t) => t.id === chapId)) {
          foundClass = (p.classLevel || p.classOrStage) as GrammarClassLevel;
          foundBoard = (p.board || 'CBSE') as CurriculumSystemId;
          foundProjectId = pId;
          break;
        }
      }

      // 2. Check all books by class
      if (!foundClass) {
        for (const [cls, book] of Object.entries(grammarProject.books || {})) {
          if (book.topics?.some((t) => t.id === chapId)) {
            foundClass = cls as GrammarClassLevel;
            break;
          }
        }
      }

      if (foundProjectId) {
        setGrammarProject((prev) => switchActiveBookProject(prev, foundProjectId!));
      } else if (foundClass) {
        setGrammarProject((prev) => ({
          ...prev,
          selectedClass: foundClass!,
          activeSystemId: foundBoard || prev.activeSystemId,
          targetBoard: (foundBoard === 'CISCE' ? 'ICSE' : (foundBoard as any) || prev.targetBoard),
        }));
      }

      setSelectedGrammarTopicId(chapId);
    } else {
      const currentBook = grammarProject.books[grammarProject.selectedClass || 'Class 6'];
      const activeProj = resolvedBookContext.activeProject;
      if (!selectedGrammarTopicId) {
        if (activeProj?.topics?.[0]?.id) {
          setSelectedGrammarTopicId(activeProj.topics[0].id);
        } else if (currentBook?.topics?.[0]?.id) {
          setSelectedGrammarTopicId(currentBook.topics[0].id);
        }
      }
    }
    setCurrentTab('chapter_studio');
  }, [resolvedBookContext, grammarProject.books, grammarProject.selectedClass, selectedGrammarTopicId]);

  // Cloud Sync Handler
  const handleTriggerCloudSync = useCallback(async () => {
    if (!isOnline) {
      alert('Offline mode active. Changes are safely stored in local memory and will sync when reconnected.');
      return;
    }
    setIsSyncing(true);
    try {
      const res = await syncProjectToCloud(project);
      if (res.success) {
        setLastSyncedTime(new Date().toLocaleTimeString());
        addAuditLog('CLOUD_SYNC', 'Synchronized project data and audit state with cloud storage.');
      }
    } catch (e: any) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, project, addAuditLog]);

  // Active Chapter and Scene getters
  const activeChapter =
    project.chapters.find((c) => c.id === activeChapterId) || project.chapters[0];
  const activeScene =
    activeChapter?.scenes.find((s) => s.id === activeSceneId) || activeChapter?.scenes[0];

  // Update Scene Content
  const handleUpdateSceneContent = (newContent: string) => {
    if (!activeChapter || !activeScene) return;

    const words = newContent.trim() ? newContent.trim().split(/\s+/).length : 0;

    setProject((prev) => {
      const updatedChapters = prev.chapters.map((chap) => {
        if (chap.id !== activeChapter.id) return chap;
        return {
          ...chap,
          scenes: chap.scenes.map((sc) => {
            if (sc.id !== activeScene.id) return sc;
            return {
              ...sc,
              content: newContent,
              wordCount: words,
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      });

      return {
        ...prev,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Update Scene Metadata (Title, POV, Goal, Status, etc.)
  const handleUpdateSceneMeta = (updates: Partial<Scene>) => {
    if (!activeChapter || !activeScene) return;

    setProject((prev) => {
      const updatedChapters = prev.chapters.map((chap) => {
        if (chap.id !== activeChapter.id) return chap;
        return {
          ...chap,
          scenes: chap.scenes.map((sc) => {
            if (sc.id !== activeScene.id) return sc;
            return {
              ...sc,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      });

      return {
        ...prev,
        chapters: updatedChapters,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Add Comment / Editorial Note to Scene
  const handleAddComment = (commentText: string, quoteText?: string) => {
    if (!activeChapter || !activeScene) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      chapterId: activeChapter.id,
      sceneId: activeScene.id,
      author: 'Clara Oswald (Developmental Editor)',
      authorRole: 'editor' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      comment: commentText,
      quoteText,
      resolved: false,
    };

    setProject((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));

    addAuditLog('COMMENT_ADDED', `Editorial note posted on Chapter ${activeChapter.number}: "${activeScene.title}"`);
  };

  // Chapter & Scene structural management
  const handleAddChapter = () => {
    const nextNum = project.chapters.length + 1;
    const newChapId = `chap-${Date.now()}`;
    const newSceneId = `scene-${Date.now()}-1`;

    const newChapter: Chapter = {
      id: newChapId,
      number: nextNum,
      title: `Chapter ${nextNum}: The Uncharted Horizon`,
      summary: '',
      status: 'Draft',
      targetWordCount: 4000,
      scenes: [
        {
          id: newSceneId,
          title: 'Opening Sequence',
          content: '',
          wordCount: 0,
          status: 'Draft',
          sceneGoal: '',
          conflict: '',
          outcome: '',
          lastModified: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    setProject((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));

    setActiveChapterId(newChapId);
    setActiveSceneId(newSceneId);
    addAuditLog('CHAPTER_CREATED', `Created Chapter ${nextNum}`);
  };

  const handleAddScene = (chapterId: string) => {
    const targetChap = project.chapters.find((c) => c.id === chapterId);
    if (!targetChap) return;

    const newSceneId = `scene-${Date.now()}`;
    const newScene: Scene = {
      id: newSceneId,
      title: `Scene ${targetChap.scenes.length + 1}`,
      content: '',
      wordCount: 0,
      status: 'Draft',
      sceneGoal: '',
      conflict: '',
      outcome: '',
      lastModified: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProject((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chap) =>
        chap.id === chapterId
          ? { ...chap, scenes: [...chap.scenes, newScene] }
          : chap
      ),
    }));

    setActiveChapterId(chapterId);
    setActiveSceneId(newSceneId);
    addAuditLog('SCENE_CREATED', `Added scene to Chapter ${targetChap.number}`);
  };

  const handleDeleteScene = (chapterId: string, sceneId: string) => {
    const targetChap = project.chapters.find((c) => c.id === chapterId);
    if (!targetChap || targetChap.scenes.length <= 1) {
      alert('A chapter must contain at least one scene.');
      return;
    }

    if (confirm('Delete this scene?')) {
      const remainingScenes = targetChap.scenes.filter((s) => s.id !== sceneId);
      setProject((prev) => ({
        ...prev,
        chapters: prev.chapters.map((chap) =>
          chap.id === chapterId ? { ...chap, scenes: remainingScenes } : chap
        ),
      }));

      if (activeSceneId === sceneId) {
        setActiveSceneId(remainingScenes[0].id);
      }
      addAuditLog('SCENE_DELETED', `Deleted scene from Chapter ${targetChap.number}`);
    }
  };

  // Snapshot / Version management
  const handleSaveSnapshot = (description: string) => {
    const totalWords = project.chapters.reduce(
      (acc, c) => acc + c.scenes.reduce((sa, s) => sa + (s.wordCount || 0), 0),
      0
    );

    const existingVersions = project.versions || (project as any).versionHistory || [];
    const snapshot: VersionSnapshot = {
      id: `snap-${Date.now()}`,
      versionNumber: existingVersions.length + 1,
      timestamp: new Date().toISOString(),
      title: description,
      author: project.authorName || 'Julian Mercer',
      wordCount: totalWords,
      summaryNote: description,
      dataJson: JSON.stringify(project),
    };

    setProject((prev) => {
      const currentList = prev.versionHistory || prev.versions || [];
      return {
        ...prev,
        versionHistory: [snapshot, ...currentList],
        versions: [snapshot, ...(prev.versions || [])],
      };
    });

    addAuditLog('VERSION_BACKUP', `Created version snapshot: "${description}"`);
    alert(`Snapshot "${description}" saved successfully.`);
  };

const handleRestoreSnapshot = (snapshotId: string) => {
  const list = project.versionHistory || project.versions || [];
  const snap = list.find((s: any) => s.id === snapshotId);
  if (!snap) return;

  try {
    const rawJson = snap.dataSnapshot || snap.dataJson;
    if (rawJson) {
      const restored: NovelProject = JSON.parse(rawJson);
      setProject(restored);
      addAuditLog('VERSION_RESTORED', `Restored snapshot "${snap.description || snap.title || 'backup'}"`);
      alert(`Project successfully restored to version from ${new Date(snap.timestamp).toLocaleString()}`);
    } else {
      alert('Selected snapshot has no archived data payload.');
    }
  } catch (e) {
    alert('Failed to parse snapshot.');
  }
};

  return (
    <div
      id="app-root-container"
      className={`h-screen w-screen flex flex-col font-sans overflow-hidden transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0f1011] text-[#f4f4f5]' : 'bg-[#fbfbfa] text-[#191918]'
      }`}
    >
      {/* Unified 56px Top Application Header */}
      <Header
        activeWorkspace={getActiveWorkspace(currentTab)}
        project={project}
        grammarProject={grammarProject}
        onUpdateProjectTitle={(title) =>
          setProject((p) => ({ ...p, title, updatedAt: new Date().toISOString() }))
        }
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
        onOpenExportModal={() => setShowExportModal(true)}
        onAddScene={() => handleAddScene(activeChapterId)}
        onAddChapter={handleAddChapter}
        onAddQuestion={() => {
          setCurrentTab('grammar_series');
          setIsSecondaryExpanded(true);
        }}
        onAddAssessment={() => {
          setCurrentTab('grammar_series');
          setIsSecondaryExpanded(true);
        }}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onSelectBookProject={handleSelectBookProject}
        isDarkMode={isDarkMode}
        currentTab={currentTab}
        activeChapterStudioContext={activeChapterStudioContext}
      />

      {/* Main Workspace Body: Navigation Rail + Secondary Drawer + Stage */}
      <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
        {/* Slim Left Navigation Rail (Home, Novel, Grammar, Publishing, Analytics) */}
        <NavigationRail
          activeWorkspace={getActiveWorkspace(currentTab)}
          onSelectWorkspace={handleSelectWorkspace}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenHelp={() => setShowHelpModal(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isSecondaryExpanded={isSecondaryExpanded}
          onToggleSecondary={() => setIsSecondaryExpanded(!isSecondaryExpanded)}
          isOnline={isOnline}
          isSyncing={isSyncing}
        />

        {/* Secondary Contextual Sidebar */}
        {isSecondaryExpanded && (
          <SecondarySidebar
            activeWorkspace={getActiveWorkspace(currentTab)}
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            project={project}
            activeChapterId={activeChapterId}
            activeSceneId={activeSceneId}
            onSelectScene={(chapId, scId) => {
              setActiveChapterId(chapId);
              setActiveSceneId(scId);
              setCurrentTab('manuscript');
            }}
            onAddChapter={handleAddChapter}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            isDarkMode={isDarkMode}
            onClose={() => setIsSecondaryExpanded(false)}
          />
        )}

        {/* Dynamic Main Workspace Stage */}
        <main
          id="main-content-stage"
          className={`flex-1 flex flex-col relative ${
            currentTab === 'chapter_studio'
              ? 'bg-[#F6F0E7] text-[#292521]'
              : 'bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]'
          } min-h-0 ${
            ['series_dashboard', 'book_projects', 'curriculum_mapping', 'publisher_submission', 'book_planner', 'library', 'publishing_studio'].includes(currentTab)
              ? 'overflow-y-auto'
              : 'overflow-hidden'
          }`}
        >
          {currentTab === 'home' && (
            <HomeDashboardView
              project={project}
              grammarProject={grammarProject}
              activeChapter={activeChapter}
              activeScene={activeScene}
              onSelectTab={(tab) => setCurrentTab(tab)}
              onAddScene={() => handleAddScene(activeChapterId)}
              onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
              onOpenExportModal={() => setShowExportModal(true)}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'library' && (
            <ProjectLibraryView
              novelProject={project}
              grammarProject={grammarProject}
              contentProject={contentProject}
              scriptProject={scriptProject}
              onOpenProject={(type) => {
                if (type === 'academic') {
                  setCurrentTab('grammar_series');
                } else if (type === 'novel') {
                  setCurrentTab('manuscript');
                } else if (type === 'content') {
                  setCurrentTab('content_studio');
                } else if (type === 'film') {
                  setCurrentTab('script_studio');
                }
              }}
              onUpdateNovelProject={(updates) => setProject((prev) => ({ ...prev, ...updates }))}
              onUpdateGrammarProject={(updated) => setGrammarProject(updated)}
              onUpdateContentProject={(updated) => setContentProject(updated)}
              onUpdateScriptProject={(updated) => setScriptProject(updated)}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'publishing_studio' && (
            <PublishingStudioView
              activeStudio={
                (['academic', 'novel', 'content', 'film'].includes(getActiveWorkspace(currentTab))
                  ? getActiveWorkspace(currentTab)
                  : 'novel') as 'academic' | 'novel' | 'content' | 'film'
              }
              novelProject={project}
              grammarProject={grammarProject}
              contentProject={contentProject}
              scriptProject={scriptProject}
              onNavigateToTab={(tab) => setCurrentTab(tab as MainTab)}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'manuscript' && activeChapter && activeScene && (
            <NovelWritingStudio
              project={project}
              activeChapter={activeChapter}
              activeScene={activeScene}
              onUpdateSceneContent={handleUpdateSceneContent}
              onUpdateSceneMeta={handleUpdateSceneMeta}
              onUpdateProject={(updates) => setProject((prev) => ({ ...prev, ...updates }))}
              onOpenFocusMode={() => setShowFocusMode(true)}
              onOpenHumanizerPanel={() => setCurrentTab('humanizer')}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              isDarkMode={isDarkMode}
              onAddComment={handleAddComment}
            />
          )}

          {currentTab === 'content_studio' && (
            <ContentStudioView
              project={contentProject}
              onUpdateProject={(updated) => {
                setContentProject(updated);
                addAuditLog('CONTENT_PROJECT_UPDATED', `Updated content project: ${updated.title}`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'script_studio' && (
            <ScriptStudioView
              project={scriptProject}
              onUpdateProject={(updated) => {
                setScriptProject(updated);
                addAuditLog('SCRIPT_PROJECT_UPDATED', `Updated script project: ${updated.title}`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'codex' && (
            <CodexView
              project={project}
              onUpdateCodex={(entries: CodexEntry[]) => {
                setProject((prev) => ({ ...prev, codexEntries: entries }));
                addAuditLog('CODEX_UPDATED', `Updated worldbuilding codex (${entries.length} lore entries)`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
              onNavigateToCharacter={() => setCurrentTab('characters')}
            />
          )}

          {currentTab === 'timeline' && (
            <TimelineView
              project={project}
              onUpdateTimeline={(events: TimelineEvent[]) => {
                setProject((prev) => ({ ...prev, timelineEvents: events }));
                addAuditLog('TIMELINE_UPDATED', `Updated narrative chronology (${events.length} timeline events)`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
            />
          )}

          {currentTab === 'relationships' && (
            <RelationshipGraphView
              project={project}
              onUpdateRelationships={(rels: CharacterRelationship[]) => {
                setProject((prev) => ({ ...prev, characterRelationships: rels }));
                addAuditLog('RELATIONSHIPS_UPDATED', `Updated character relationship graph (${rels.length} links)`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToCharacter={() => setCurrentTab('characters')}
            />
          )}

          {currentTab === 'dialogue' && (
            <DialogueLabView
              project={project}
              isDarkMode={isDarkMode}
              onNavigateToVoiceGuard={() => setCurrentTab('humanizer')}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
            />
          )}

          {currentTab === 'thesaurus' && (
            <SensoryThesaurusView
              project={project}
              isDarkMode={isDarkMode}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
            />
          )}

          {currentTab === 'research' && (
            <ResearchView
              project={project}
              onUpdateResearchNotes={(notes: ResearchNote[]) => {
                setProject((prev) => ({ ...prev, researchNotes: notes }));
                addAuditLog('RESEARCH_UPDATED', `Updated research notebook (${notes.length} notes)`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
              onNavigateToCharacter={() => setCurrentTab('characters')}
              onNavigateToCodex={() => setCurrentTab('codex')}
            />
          )}

          {currentTab === 'pacing' && (
            <PacingHeatmapView
              project={project}
              isDarkMode={isDarkMode}
              onNavigateToVoiceGuard={() => setCurrentTab('humanizer')}
            />
          )}

          {currentTab === 'querykit' && (
            <PublishingKitView
              project={project}
              onUpdateQueryPitch={(pitch: QueryLetterData) => {
                setProject((prev) => ({ ...prev, queryPitch: pitch }));
                addAuditLog('QUERY_PITCH_UPDATED', `Updated publishing query pitch for "${project.title}"`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'characters' && (
            <CharactersView
              project={project}
              onUpdateCharacters={(chars: Character[]) => {
                setProject((prev) => ({ ...prev, characters: chars }));
                addAuditLog('CHARACTERS_UPDATED', `Updated character dossier (${chars.length} characters)`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'plot' && (
            <PlotOutlinesView
              project={project}
              onUpdatePlotBeats={(beats: PlotBeat[]) => {
                setProject((prev) => ({ ...prev, plotBeats: beats }));
                addAuditLog('PLOT_UPDATED', `Updated plot outline architecture (${beats.length} beats)`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToScene={(chapId, scId) => {
                setActiveChapterId(chapId);
                setActiveSceneId(scId);
                setCurrentTab('manuscript');
              }}
            />
          )}

          {currentTab === 'humanizer' && (
            <StyleVoiceGuardView
              project={project}
              currentSceneText={activeScene?.content || ''}
              activeChapterId={activeChapterId}
              activeSceneId={activeSceneId}
              onUpdateStylePersona={(persona: StylePersona) => {
                setProject((prev) => ({ ...prev, stylePersona: persona }));
                addAuditLog('STYLE_PERSONA_UPDATED', `Calibrated voice persona to "${persona.name}"`);
              }}
              onApplyHumanizedText={(newText) => {
                handleUpdateSceneContent(newText);
                addAuditLog('HUMANIZED_PROSE_APPLIED', 'Applied organic burstiness to active scene');
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'design' && (
            <BookDesignView
              project={project}
              onUpdateCoverDesign={(cover: BookCoverDesign) => {
                setProject((prev) => ({ ...prev, coverDesign: cover }));
                addAuditLog('COVER_DESIGN_UPDATED', `Updated cover design: "${cover.title}"`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView project={project} isDarkMode={isDarkMode} />
          )}

          {currentTab === 'team' && (
            <TeamCollabView
              project={project}
              onUpdateTeam={(team: TeamMember[]) => {
                setProject((prev) => ({ ...prev, team }));
                addAuditLog('TEAM_UPDATED', `Updated collaboration roster (${team.length} members)`);
              }}
              onAddAuditLog={(action, details) => addAuditLog(action, details)}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'series_dashboard' && (
            <SeriesStudioView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('SERIES_STUDIO_UPDATED', 'Updated multi-board publishing series');
              }}
              onOpenBookProjects={() => setCurrentTab('book_projects')}
              onOpenBookPlanner={(projectId) => {
                if (projectId) {
                  handleSelectBookProject(projectId);
                }
                setCurrentTab('book_planner');
              }}
              onOpenCurriculumMapping={() => setCurrentTab('curriculum_mapping')}
              onOpenScopeSequence={() => setCurrentTab('scope_sequence')}
              onOpenPublisherSubmission={() => setCurrentTab('publisher_submission')}
              onOpenChapterStudio={(chapId) => handleOpenChapterStudio(chapId)}
            />
          )}

          {currentTab === 'book_projects' && (
            <BookProjectsView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('BOOK_PROJECTS_UPDATED', 'Updated book project library');
              }}
              onOpenSeriesStudio={() => setCurrentTab('series_dashboard')}
              onOpenBookPlanner={(projectId) => {
                if (projectId) {
                  handleSelectBookProject(projectId);
                }
                setCurrentTab('book_planner');
              }}
              onOpenChapterStudio={(chapId) => handleOpenChapterStudio(chapId)}
              onOpenCurriculumMapping={() => setCurrentTab('curriculum_mapping')}
              onOpenScopeSequence={() => setCurrentTab('scope_sequence')}
              onOpenTextbookPreview={(cls) => {
                if (cls) setGrammarProject((prev) => ({ ...prev, selectedClass: cls as any }));
                setCurrentTab('textbook_preview');
              }}
              onOpenLayoutExport={(cls) => {
                if (cls) setGrammarProject((prev) => ({ ...prev, selectedClass: cls as any }));
                setCurrentTab('textbook_exporter');
              }}
              onOpenPublisherSubmission={() => setCurrentTab('publisher_submission')}
            />
          )}

          {currentTab === 'book_planner' && (
            <BookPlannerView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('BOOK_PLANNER_UPDATED', 'Updated book planner structure and TOC');
              }}
              onOpenChapterStudio={(chapId) => handleOpenChapterStudio(chapId)}
              onOpenLayoutExport={(cls) => {
                if (cls) setGrammarProject((prev) => ({ ...prev, selectedClass: cls as any }));
                setCurrentTab('textbook_exporter');
              }}
              onOpenTextbookPreview={(cls) => {
                if (cls) setGrammarProject((prev) => ({ ...prev, selectedClass: cls as any }));
                setCurrentTab('textbook_preview');
              }}
              onOpenQuestionBank={() => setCurrentTab('question_bank')}
              onOpenCurriculumMapping={() => setCurrentTab('curriculum_mapping')}
              onOpenScopeSequence={() => setCurrentTab('scope_sequence')}
              onOpenSeriesDashboard={() => setCurrentTab('series_dashboard')}
              onOpenBookProjects={() => setCurrentTab('book_projects')}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'curriculum_mapping' && (
            <CurriculumMappingView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('CURRICULUM_MAPPING_UPDATED', 'Updated cross-board curriculum mapping');
              }}
              onNavigateToEdition={(editionId) => {
                const ed = grammarProject.editions?.[editionId];
                if (ed) {
                  setGrammarProject((prev) => ({ ...prev, selectedClass: ed.equivalentClass }));
                }
                setCurrentTab('grammar_series');
              }}
              onOpenBookPlanner={(bookProjId) => {
                if (bookProjId) {
                  handleSelectBookProject(bookProjId);
                }
                setCurrentTab('book_planner');
              }}
              onOpenChapterStudio={(chapId) => handleOpenChapterStudio(chapId)}
              onOpenScopeSequence={() => setCurrentTab('scope_sequence')}
            />
          )}

          {currentTab === 'grammar_series' && (
            <GrammarSeriesView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('GRAMMAR_SERIES_UPDATED', `Updated grammar series: ${updated.seriesTitle}`);
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'scope_sequence' && (
            <SpiralCurriculumMatrixView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('CURRICULUM_MATRIX_UPDATED', 'Updated scope & sequence matrix');
              }}
              onNavigateToTopicInClass={(targetClass, _topicId) => {
                setGrammarProject((prev) => ({ ...prev, selectedClass: targetClass }));
                setCurrentTab('grammar_series');
              }}
              onOpenChapterStudio={(chapId) => handleOpenChapterStudio(chapId)}
              onOpenBookPlanner={(bookProjId) => {
                if (bookProjId) {
                  handleSelectBookProject(bookProjId);
                }
                setCurrentTab('book_planner');
              }}
              onOpenCurriculumMapping={() => setCurrentTab('curriculum_mapping')}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'grammar_concepts' && (
            <GrammarConceptsStudioView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('GRAMMAR_CONCEPTS_UPDATED', 'Updated grammar concepts dossier');
              }}
              isDarkMode={isDarkMode}
              onNavigateToDiagrammer={(sentence) => {
                setDiagrammerSentence(sentence);
                setCurrentTab('sentence_diagrammer');
              }}
              onNavigateToTextbook={() => setCurrentTab('grammar_series')}
            />
          )}

          {currentTab === 'question_bank' && (
            <QuestionBankStudioView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('QUESTION_BANK_UPDATED', 'Updated question bank');
              }}
              isDarkMode={isDarkMode}
              onNavigateToAssessments={() => setCurrentTab('assessment_builder')}
            />
          )}

          {currentTab === 'assessment_builder' && (
            <AssessmentBuilderStudioView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('ASSESSMENT_BUILDER_UPDATED', 'Updated academic assessment');
              }}
              isDarkMode={isDarkMode}
              onNavigateToBlueprintMatrix={() => setCurrentTab('board_blueprints')}
            />
          )}

          {currentTab === 'grammar_quiz' && (
            <GrammarQuizStudioView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('GRAMMAR_QUIZ_UPDATED', 'Updated grammar quiz questions');
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'sentence_diagrammer' && (
            <SentenceDiagrammerStudio
              initialSentence={diagrammerSentence}
              targetClass={grammarProject.selectedClass || 'Class 6'}
              isDarkMode={isDarkMode}
              onSendToTextbook={(diagram) => {
                const book = grammarProject.books[grammarProject.selectedClass || 'Class 6'];
                if (book && book.topics.length > 0) {
                  const targetTopic = book.topics[0];
                  const diagramNote = `\n\n#### Syntactic Diagram Analysis: "${diagram.sentence}"\n- **Classification:** ${diagram.classification.toUpperCase()} Sentence\n- **Strand:** ${diagram.strand}\n- **Pedagogical Takeaway:** ${diagram.pedagogicalNotes}\n- **Clauses:**\n${diagram.clauses.map((c, i) => `  ${i + 1}. [${c.typeName}] "${c.text}" (Subject: ${c.subject.headNoun}, Predicate Verb: ${c.predicate.verbPhrase})`).join('\n')}\n`;
                  const updatedTopic = {
                    ...targetTopic,
                    notesAndTheoryMarkdown: `${targetTopic.notesAndTheoryMarkdown}${diagramNote}`,
                  };
                  const updatedTopics = book.topics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t));
                  const updatedBook = { ...book, topics: updatedTopics };
                  setGrammarProject({
                    ...grammarProject,
                    books: { ...grammarProject.books, [grammarProject.selectedClass || 'Class 6']: updatedBook },
                    lastUpdated: new Date().toISOString(),
                  });
                  addAuditLog('SENTENCE_DIAGRAM_ATTACHED', `Attached syntactic diagram for "${diagram.sentence}" to ${targetTopic.title}`);
                  setCurrentTab('grammar_series');
                }
              }}
            />
          )}

          {currentTab === 'differentiated_worksheets' && (
            <DifferentiatedWorksheetsView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('DIFFERENTIATED_WORKSHEETS_UPDATED', 'Updated tiered differentiated worksheets');
              }}
              isDarkMode={isDarkMode}
            />
          )}

          {currentTab === 'board_blueprints' && (
            <BoardBlueprintMatrixView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('BOARD_BLUEPRINTS_UPDATED', 'Updated question blueprint & weightage matrix');
              }}
              isDarkMode={isDarkMode}
              isSecondaryExpanded={isSecondaryExpanded}
              onToggleSecondary={setIsSecondaryExpanded}
              onNavigateToCoursebook={(cls) => {
                if (cls) {
                  setGrammarProject((prev) => ({ ...prev, selectedClass: cls }));
                }
                setCurrentTab('grammar_series');
              }}
            />
          )}

          {currentTab === 'spaced_repetition' && (
            <SpacedRepetitionDeckView
              isDarkMode={isDarkMode}
              selectedClass={grammarProject.selectedClass}
              onNavigateToGrammarTextbook={() => setCurrentTab('grammar_series')}
            />
          )}

          {currentTab === 'composition_studio' && (
            <CompositionStudioView
              isDarkMode={isDarkMode}
              selectedClass={grammarProject.selectedClass}
              onNavigateToGrammarTextbook={() => setCurrentTab('grammar_series')}
            />
          )}

          {currentTab === 'chapter_studio' && (
            <ChapterAuthoringStudio
              key={`${grammarProject.activeBookProjectId || grammarProject.selectedClass || 'proj'}-${activeGrammarTopic?.id || 'top'}`}
              initialTopic={activeGrammarTopic}
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('CHAPTER_STUDIO_UPDATED', 'Updated chapter in Chapter Authoring Studio');
              }}
              onBackToDashboard={() => setCurrentTab('book_planner')}
              isDarkMode={false}
              isSecondaryExpanded={isSecondaryExpanded}
              onToggleSecondary={setIsSecondaryExpanded}
            />
          )}

          {currentTab === 'textbook_preview' && (
            <TextbookPreviewView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('TEXTBOOK_PREVIEW_UPDATED', `Updated textbook preview for ${updated.seriesTitle}`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToExporter={() => setCurrentTab('textbook_exporter')}
              onNavigateToClassTextbook={(cls) => {
                setGrammarProject((prev) => ({ ...prev, selectedClass: cls }));
                setCurrentTab('grammar_series');
              }}
            />
          )}

          {currentTab === 'textbook_exporter' && (
            <TextbookLayoutExporterView
              seriesProject={grammarProject}
              onUpdateSeriesProject={(updated) => {
                setGrammarProject(updated);
                addAuditLog('GRAMMAR_TEXTBOOK_UPDATED', `Updated textbook curriculum: ${updated.seriesTitle}`);
              }}
              isDarkMode={isDarkMode}
              onNavigateToPreview={() => setCurrentTab('textbook_preview')}
              onNavigateToMatrix={() => setCurrentTab('grammar_series')}
              onNavigateToClassTextbook={(cls) => {
                setGrammarProject((prev) => ({ ...prev, selectedClass: cls }));
                setCurrentTab('grammar_series');
              }}
            />
          )}

          {currentTab === 'publisher_submission' && (
            <div className="w-full min-h-full flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]">
              <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
                <PublisherSubmissionCentre
                  project={
                    (grammarProject.bookProjects && Object.keys(grammarProject.bookProjects).length > 0
                      ? grammarProject.bookProjects[grammarProject.activeBookProjectId || 'proj-cbse-c6'] ||
                        grammarProject.bookProjects['bp-cbse-c6'] ||
                        Object.values(grammarProject.bookProjects)[0]
                      : undefined) || {
                      id: 'proj-cbse-c6',
                      seriesTitle: grammarProject.seriesTitle,
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
                      estimatedWordCount: 38500,
                      trimSize: 'Crown Quarto (189 × 246 mm)',
                      status: 'Authoring',
                      publisher: 'To be confirmed',
                      internalProjectCode: 'BK-CBSE-C6-2026',
                      copyrightYear: 2026,
                      language: 'English (UK / Commonwealth Standard)',
                      notes: 'Primary working volume for middle school grammar series.',
                      milestones: [],
                      rightsAndEditions: [],
                      lastEdited: new Date().toISOString(),
                    }
                  }
                  seriesProject={grammarProject}
                  book={grammarProject.books[grammarProject.selectedClass || 'Class 6']}
                  onUpdateProposal={(proposal) => {
                    const activeProjId = grammarProject.activeBookProjectId || 'bp-cbse-c6';
                    const existingProj = grammarProject.bookProjects?.[activeProjId];
                    if (existingProj) {
                      setGrammarProject((prev) => ({
                        ...prev,
                        bookProjects: {
                          ...prev.bookProjects,
                          [activeProjId]: {
                            ...existingProj,
                            proposalData: proposal,
                          },
                        },
                      }));
                    }
                    addAuditLog('PUBLISHER_PROPOSAL_UPDATED', 'Updated publisher proposal dossier');
                  }}
                  onNavigateToTab={(tab) => setCurrentTab(tab as MainTab)}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Distraction-Free Fullscreen Writing Focus Mode */}
      {showFocusMode && activeChapter && activeScene && (
        <FocusModeModal
          content={activeScene.content}
          onUpdateContent={handleUpdateSceneContent}
          onClose={() => setShowFocusMode(false)}
          chapterTitle={activeChapter.title}
          sceneTitle={activeScene.title}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Multi-Format Export Modal */}
      {showExportModal && (
        <ExportModal
          project={project}
          onClose={() => setShowExportModal(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Studio Settings & Encryption Modal */}
      {showSettingsModal && (
        <ErrorBoundary fallbackTitle="Studio Settings">
          <SettingsModal
            project={project}
            onUpdateProject={(updates) => setProject((prev) => ({ ...prev, ...updates }))}
            onSaveSnapshot={handleSaveSnapshot}
            onRestoreSnapshot={handleRestoreSnapshot}
            onClose={() => setShowSettingsModal(false)}
            isDarkMode={isDarkMode}
            onTriggerSync={handleTriggerCloudSync}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
            onOpenAuthorVoiceProfile={() => {
              setShowSettingsModal(false);
              setCurrentTab('humanizer');
            }}
          />
        </ErrorBoundary>
      )}

      {/* Global Help & Keyboard Shortcuts Modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        isDarkMode={isDarkMode}
      />

      {/* Global Humanise Quick-Polish Modal (Alt+H) */}
      <HumaniseFloatingModal
        isOpen={showHumaniseModal}
        onClose={() => setShowHumaniseModal(false)}
        sourceText={activeScene?.content || ''}
        onApplyText={(appliedText) => {
          if (activeScene) {
            handleUpdateSceneContent(appliedText);
          }
        }}
        authorVoiceName={project.stylePersona?.name}
        isDarkMode={isDarkMode}
        workspaceContext={getActiveWorkspace(currentTab)}
      />

      {/* Real-time Gemini 3.1 Flash Live Voice Modal */}
      {showLiveVoiceModal && (
        <LiveVoiceModal
          onClose={() => setShowLiveVoiceModal(false)}
          isDarkMode={isDarkMode}
          project={project}
          activeContextText={activeScene?.content}
        />
      )}

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsSecondaryExpanded(true);
        }}
        onAddChapter={handleAddChapter}
        onAddScene={() => handleAddScene(activeChapterId)}
        onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        project={project}
        grammarProject={grammarProject}
        onSelectScene={(chapId, scId) => {
          setActiveChapterId(chapId);
          setActiveSceneId(scId);
          setCurrentTab('manuscript');
        }}
      />
    </div>
  );
}
