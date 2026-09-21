import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckSquare,
  HelpCircle,
  GitFork,
  Award,
  BookOpen,
  Users,
  Compass,
  Clock,
  GitBranch,
  Network,
  MessageSquare,
  Sparkles,
  Eye,
  Activity,
  UserCheck,
  GraduationCap,
  Layers,
  FileCheck2,
  BookMarked,
  BrainCircuit,
  PenTool,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  FolderOpen,
  BarChart2,
  Share2,
  Globe2,
  GitCompare,
  Send,
  PanelLeftClose,
} from 'lucide-react';
import { NovelProject, Chapter, Scene } from '../types';
import { MainTab, isGrammarTab } from './Sidebar';
import { WorkspaceType } from './NavigationRail';

interface SecondarySidebarProps {
  activeWorkspace: WorkspaceType;
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  project: NovelProject;
  activeChapterId: string;
  activeSceneId: string;
  onSelectScene: (chapterId: string, sceneId: string) => void;
  onAddChapter: () => void;
  onAddScene: (chapterId: string) => void;
  onDeleteScene: (chapterId: string, sceneId: string) => void;
  isDarkMode: boolean;
  onClose?: () => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  onResetWidth?: () => void;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  activeWorkspace,
  currentTab,
  onSelectTab,
  project,
  activeChapterId,
  activeSceneId,
  onSelectScene,
  onAddChapter,
  onAddScene,
  onDeleteScene,
  isDarkMode,
  onClose,
  width = 225,
  onWidthChange,
  onResetWidth,
}) => {
  const [collapsedChapters, setCollapsedChapters] = useState<Record<string, boolean>>({});

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.min(300, Math.max(180, startWidth + delta));
      onWidthChange?.(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startWidth = width;

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!moveEvent.touches[0]) return;
      const delta = moveEvent.touches[0].clientX - startX;
      const newWidth = Math.min(300, Math.max(180, startWidth + delta));
      onWidthChange?.(newWidth);
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  const toggleChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render Novel Studio Secondary Navigation
  const totalNovelWords = project.chapters.reduce(
    (acc, ch) => acc + ch.scenes.reduce((sAcc, sc) => sAcc + (sc.wordCount || 0), 0),
    0
  );

  const renderNovelNav = () => (
    <div className="space-y-4">
      {/* Active Project Context Hierarchy */}
      <div className="px-3 py-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F]/70 border border-[#CBBEAC] dark:border-[#5A1832]/60">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
          Active Manuscript
        </div>
        <div className="text-[15px] font-serif font-bold text-[#292521] dark:text-[#F6F0E7] truncate mt-0.5">
          {project.title}
        </div>
        <div className="text-xs text-[#71685E] dark:text-[#D8CCBC] flex items-center space-x-1.5 mt-1 font-mono">
          <span>{project.chapters.length} chapters</span>
          <span>&bull;</span>
          <span>{totalNovelWords.toLocaleString()} words</span>
        </div>
      </div>

      {/* MANUSCRIPT & STRUCTURE */}
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Manuscript
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('manuscript')}
            className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-all ${
              currentTab === 'manuscript'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <BookOpen className={`w-4 h-4 shrink-0 ${currentTab === 'manuscript' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
              <span>Manuscript Editor</span>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                currentTab === 'manuscript'
                  ? 'bg-[#35101F] text-[#C29A52]'
                  : 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC]'
              }`}
            >
              {project.chapters.length} ch
            </span>
          </button>
        </div>

        {/* Dynamic Manuscript Structure Tree */}
        <div className="mt-2.5 pl-1 pr-0.5 space-y-1">
          <div className="flex items-center justify-between px-3 py-1 text-[10.5px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
            <span>Outline &amp; Scenes</span>
            <button
              onClick={onAddChapter}
              className="px-2 py-0.5 hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] rounded text-[#5A1832] dark:text-[#C29A52] font-semibold text-xs flex items-center space-x-1 transition-colors"
              title="Add Chapter"
            >
              <Plus className="w-3 h-3" />
              <span>Chapter</span>
            </button>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {project.chapters.map((chap) => {
              const isChapCollapsed = !!collapsedChapters[chap.id];
              const isChapActive = activeChapterId === chap.id;

              return (
                <div key={chap.id} className="text-xs">
                  {/* Chapter Header */}
                  <div
                    onClick={() => {
                      if (chap.scenes[0]) {
                        onSelectScene(chap.id, chap.scenes[0].id);
                        onSelectTab('manuscript');
                      }
                    }}
                    className={`group min-h-[38px] flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      isChapActive && currentTab === 'manuscript'
                        ? 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-semibold'
                        : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6]/70 dark:hover:bg-[#35101F]/70'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <button
                        onClick={(e) => toggleChapter(chap.id, e)}
                        className="p-1 text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52]"
                      >
                        {isChapCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <span className="font-serif font-medium text-xs sm:text-[13px] truncate">
                        Chapter {chap.number}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddScene(chap.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#C29A52] rounded transition-opacity"
                      title="Add scene"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chapter Title subtitle */}
                  {!isChapCollapsed && chap.title && (
                    <div className="pl-7 text-[11px] text-[#71685E] dark:text-[#D8CCBC] italic truncate mb-1">
                      {chap.title}
                    </div>
                  )}

                  {/* Scenes Under Chapter */}
                  {!isChapCollapsed && chap.scenes && (
                    <div className="pl-4 space-y-1 border-l-2 border-[#CBBEAC] dark:border-[#5A1832] ml-4 my-1">
                      {chap.scenes.map((sc, scIdx) => {
                        const isSceneActive =
                          activeChapterId === chap.id &&
                          activeSceneId === sc.id &&
                          currentTab === 'manuscript';
                        const sceneLabel = sc.title || `Scene ${String(scIdx + 1).padStart(2, '0')}`;
                        return (
                          <div
                            key={sc.id}
                            onClick={() => {
                              onSelectScene(chap.id, sc.id);
                              onSelectTab('manuscript');
                            }}
                            className={`group/sc min-h-[34px] flex items-center justify-between px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors ${
                              isSceneActive
                                ? 'bg-[#5A1832] text-[#F6F0E7] font-medium'
                                : 'text-[#292521] dark:text-[#F6F0E7] hover:text-[#5A1832] dark:hover:text-[#C29A52] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                            }`}
                          >
                            <span className="truncate pr-1 font-medium">
                              {sceneLabel}
                            </span>
                            <div className="flex items-center space-x-1.5 shrink-0">
                              <span
                                className={`text-[10px] font-mono ${
                                  isSceneActive ? 'text-[#C29A52]' : 'text-[#71685E]'
                                }`}
                              >
                                {sc.wordCount || 0}w
                              </span>
                              {chap.scenes.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteScene(chap.id, sc.id);
                                  }}
                                  className="opacity-0 group-hover/sc:opacity-100 p-0.5 hover:text-rose-600 transition-opacity"
                                  title="Delete scene"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STORY ARCHITECTURE */}
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Story Architecture
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('characters')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'characters'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${currentTab === 'characters' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Characters</span>
          </button>

          <button
            onClick={() => onSelectTab('codex')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'codex'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Compass className={`w-4 h-4 shrink-0 ${currentTab === 'codex' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>World Codex</span>
          </button>

          <button
            onClick={() => onSelectTab('timeline')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'timeline'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Clock className={`w-4 h-4 shrink-0 ${currentTab === 'timeline' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => onSelectTab('plot')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'plot'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <GitBranch className={`w-4 h-4 shrink-0 ${currentTab === 'plot' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Plot Architecture</span>
          </button>

          <button
            onClick={() => onSelectTab('relationships')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'relationships'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Network className={`w-4 h-4 shrink-0 ${currentTab === 'relationships' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Relationship Web</span>
          </button>

          <button
            onClick={() => onSelectTab('research')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'research'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookMarked className={`w-4 h-4 shrink-0 ${currentTab === 'research' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Historical Research</span>
          </button>
        </div>
      </div>

      {/* CRAFT & VOICE */}
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Craft &amp; Voice
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('dialogue')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'dialogue'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <MessageSquare className={`w-4 h-4 shrink-0 ${currentTab === 'dialogue' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Dialogue Lab</span>
          </button>

          <button
            onClick={() => onSelectTab('humanizer')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'humanizer'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${currentTab === 'humanizer' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Voice &amp; Humanizer</span>
          </button>

          <button
            onClick={() => onSelectTab('thesaurus')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'thesaurus'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Eye className={`w-4 h-4 shrink-0 ${currentTab === 'thesaurus' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Sensory / Show Don&apos;t Tell</span>
          </button>

          <button
            onClick={() => onSelectTab('pacing')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'pacing'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Activity className={`w-4 h-4 shrink-0 ${currentTab === 'pacing' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Pacing Heatmap</span>
          </button>
        </div>
      </div>

      {/* EDITORIAL & PUBLISH */}
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Publish &amp; Submissions
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('querykit')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'querykit'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <FileCheck2 className={`w-4 h-4 shrink-0 ${currentTab === 'querykit' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Query &amp; Pitch Kit</span>
          </button>

          <button
            onClick={() => onSelectTab('design')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'design'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookMarked className={`w-4 h-4 shrink-0 ${currentTab === 'design' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Book Cover Design</span>
          </button>

          <button
            onClick={() => onSelectTab('team')}
            className={`w-full min-h-[42px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-colors ${
              currentTab === 'team'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <UserCheck className={`w-4 h-4 shrink-0 ${currentTab === 'team' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Editorial &amp; Beta Readers</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render Grammar & Curriculum Secondary Navigation reorganized into 5 clear groups
  const renderGrammarNav = () => (
    <div className="space-y-3.5">
      {/* 1. BOOK DEVELOPMENT */}
      <div>
        <div className="px-2.5 py-1 text-[10.5px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Book Development
        </div>
        <div className="mt-0.5 space-y-0.5">
          <button
            id="nav-series-dashboard"
            onClick={() => onSelectTab('series_dashboard')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'series_dashboard'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Globe2 className={`w-4 h-4 shrink-0 ${currentTab === 'series_dashboard' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Series Studio</span>
          </button>

          <button
            id="nav-book-projects"
            onClick={() => onSelectTab('book_projects')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'book_projects'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${currentTab === 'book_projects' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Book Projects</span>
          </button>

          <button
            id="nav-book-planner"
            onClick={() => onSelectTab('book_planner')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'book_planner'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookMarked className={`w-4 h-4 shrink-0 ${currentTab === 'book_planner' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Book Planner</span>
          </button>

          <button
            id="nav-curriculum-mapping"
            onClick={() => onSelectTab('curriculum_mapping')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'curriculum_mapping'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <GitCompare className={`w-4 h-4 shrink-0 ${currentTab === 'curriculum_mapping' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Curriculum Mapping</span>
          </button>

          <button
            id="nav-scope-sequence"
            onClick={() => onSelectTab('scope_sequence')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'scope_sequence'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 shrink-0 ${currentTab === 'scope_sequence' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Scope &amp; Sequence</span>
          </button>

          <button
            id="nav-board-blueprints"
            onClick={() => onSelectTab('board_blueprints')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'board_blueprints'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${currentTab === 'board_blueprints' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Board Blueprints</span>
          </button>
        </div>
      </div>

      {/* 2. AUTHORING */}
      <div>
        <div className="px-2.5 py-1 text-[10.5px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Authoring
        </div>
        <div className="mt-0.5 space-y-0.5">
          <button
            id="nav-grammar-book"
            onClick={() => onSelectTab('grammar_series')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'grammar_series'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <GraduationCap className={`w-4 h-4 shrink-0 ${currentTab === 'grammar_series' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Grammar Book</span>
          </button>

          <button
            id="nav-chapter-studio"
            onClick={() => onSelectTab('chapter_studio')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'chapter_studio'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookOpen className={`w-4 h-4 shrink-0 ${currentTab === 'chapter_studio' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Chapter Studio</span>
          </button>

          <button
            id="nav-grammar-concepts"
            onClick={() => onSelectTab('grammar_concepts')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'grammar_concepts'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 ${currentTab === 'grammar_concepts' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Grammar Concepts</span>
          </button>

          <button
            id="nav-question-bank"
            onClick={() => onSelectTab('question_bank')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'question_bank'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <CheckSquare className={`w-4 h-4 shrink-0 ${currentTab === 'question_bank' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Question Bank</span>
          </button>
        </div>
      </div>

      {/* 3. ASSESSMENT */}
      <div>
        <div className="px-2.5 py-1 text-[10.5px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Assessment
        </div>
        <div className="mt-0.5 space-y-0.5">
          <button
            id="nav-assessment-builder"
            onClick={() => onSelectTab('assessment_builder')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'assessment_builder'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Award className={`w-4 h-4 shrink-0 ${currentTab === 'assessment_builder' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Assessment Builder</span>
          </button>

          <button
            id="nav-grammar-quiz"
            onClick={() => onSelectTab('grammar_quiz')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'grammar_quiz'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <HelpCircle className={`w-4 h-4 shrink-0 ${currentTab === 'grammar_quiz' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Interactive Quiz</span>
          </button>

          <button
            id="nav-differentiated-worksheets"
            onClick={() => onSelectTab('differentiated_worksheets')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'differentiated_worksheets'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${currentTab === 'differentiated_worksheets' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Differentiated Worksheets</span>
          </button>
        </div>
      </div>

      {/* 4. LEARNING */}
      <div>
        <div className="px-2.5 py-1 text-[10.5px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Learning
        </div>
        <div className="mt-0.5 space-y-0.5">
          <button
            id="nav-spaced-repetition"
            onClick={() => onSelectTab('spaced_repetition')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'spaced_repetition'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BrainCircuit className={`w-4 h-4 shrink-0 ${currentTab === 'spaced_repetition' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Flashcards (SRS)</span>
          </button>

          <button
            id="nav-composition-studio"
            onClick={() => onSelectTab('composition_studio')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'composition_studio'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <PenTool className={`w-4 h-4 shrink-0 ${currentTab === 'composition_studio' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Composition Studio</span>
          </button>

          <button
            id="nav-sentence-diagrammer"
            onClick={() => onSelectTab('sentence_diagrammer')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'sentence_diagrammer'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <GitFork className={`w-4 h-4 shrink-0 ${currentTab === 'sentence_diagrammer' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Sentence Diagrammer</span>
          </button>
        </div>
      </div>

      {/* 5. PUBLISH */}
      <div>
        <div className="px-2.5 py-1 text-[10.5px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Publish
        </div>
        <div className="mt-0.5 space-y-0.5">
          <button
            id="nav-textbook-preview"
            onClick={() => onSelectTab('textbook_preview')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'textbook_preview'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Eye className={`w-4 h-4 shrink-0 ${currentTab === 'textbook_preview' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Textbook Preview</span>
          </button>

          <button
            id="nav-textbook-exporter"
            onClick={() => onSelectTab('textbook_exporter')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'textbook_exporter'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookMarked className={`w-4 h-4 shrink-0 ${currentTab === 'textbook_exporter' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Layout &amp; Export</span>
          </button>

          <button
            id="nav-publisher-submission"
            onClick={() => onSelectTab('publisher_submission')}
            className={`w-full min-h-[36px] flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              currentTab === 'publisher_submission'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-2xs'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Send className={`w-4 h-4 shrink-0 ${currentTab === 'publisher_submission' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span className="truncate">Publisher Submission</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render Publishing Secondary Navigation
  const renderPublishingNav = () => (
    <div className="space-y-4">
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Production &amp; Submissions
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('design')}
            className={`w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
              currentTab === 'design'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BookMarked className={`w-4 h-4 shrink-0 ${currentTab === 'design' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Book Cover Design</span>
          </button>

          <button
            onClick={() => onSelectTab('querykit')}
            className={`w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
              currentTab === 'querykit'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Share2 className={`w-4 h-4 shrink-0 ${currentTab === 'querykit' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Agent Query &amp; Pitch Kit</span>
          </button>

          <button
            onClick={() => onSelectTab('textbook_exporter')}
            className={`w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
              currentTab === 'textbook_exporter'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <FileCheck2 className={`w-4 h-4 shrink-0 ${currentTab === 'textbook_exporter' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Print Layout Exporter</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render Analytics Secondary Navigation
  const renderAnalyticsNav = () => (
    <div className="space-y-4">
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Metrics &amp; Velocity
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('analytics')}
            className={`w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
              currentTab === 'analytics'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <BarChart2 className={`w-4 h-4 shrink-0 ${currentTab === 'analytics' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Velocity &amp; Goals</span>
          </button>

          <button
            onClick={() => onSelectTab('pacing')}
            className={`w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium transition-colors ${
              currentTab === 'pacing'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                : 'text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52]'
            }`}
          >
            <Activity className={`w-4 h-4 shrink-0 ${currentTab === 'pacing' ? 'text-[#C29A52]' : 'text-[#5A1832] dark:text-[#C29A52]'}`} />
            <span>Pacing Heatmap</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render Home Secondary Navigation
  const renderHomeNav = () => (
    <div className="space-y-4">
      <div>
        <div className="px-3 py-1 text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider font-mono">
          Quick Launch
        </div>
        <div className="mt-1 space-y-1">
          <button
            onClick={() => onSelectTab('manuscript')}
            className="w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <span>Open Manuscript</span>
          </button>

          <button
            onClick={() => onSelectTab('grammar_series')}
            className="w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
            <span>Open Curriculum</span>
          </button>

          <button
            onClick={() => onSelectTab('board_blueprints')}
            className="w-full min-h-[44px] flex items-center space-x-3 px-3.5 py-2 rounded-xl text-[14.5px] font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
          >
            <Layers className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <span>Audit Blueprints</span>
          </button>
        </div>
      </div>
    </div>
  );

    const effectiveWorkspace: WorkspaceType = isGrammarTab(currentTab) ? 'grammar' : activeWorkspace;

    return (
    <aside
      id="secondary-navigation-drawer"
      aria-label="Secondary Navigation"
      style={{ width: `${width}px` }}
      className="relative h-full border-r border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex flex-col shrink-0 select-none overflow-hidden z-20 shadow-xs transition-[width] duration-75"
    >
      {/* Workspace Header / Context Label */}
      <div className="px-3 py-2.5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#35101F] flex items-center justify-between">
        <span className="text-xs font-serif font-bold tracking-wider text-[#5A1832] dark:text-[#C29A52] uppercase truncate">
          {effectiveWorkspace === 'novel'
            ? 'Novel Architecture'
            : effectiveWorkspace === 'grammar'
            ? 'Academic Publishing'
            : effectiveWorkspace === 'publishing'
            ? 'Publishing Suite'
            : effectiveWorkspace === 'analytics'
            ? 'Analytics & Goals'
            : 'Workspace Navigator'}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/50 transition-colors cursor-pointer"
            title="Collapse sidebar to rail (Restore anytime from rail)"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3.5">
        {effectiveWorkspace === 'grammar' && renderGrammarNav()}
        {effectiveWorkspace === 'novel' && renderNovelNav()}
        {effectiveWorkspace === 'publishing' && renderPublishingNav()}
        {effectiveWorkspace === 'analytics' && renderAnalyticsNav()}
        {effectiveWorkspace === 'home' && renderHomeNav()}
      </div>

      {/* Subtle Draggable Divider Handle (180px - 300px, double-click resets to 225px) */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={() => onResetWidth ? onResetWidth() : onWidthChange?.(225)}
        className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize group z-30 flex items-center justify-center hover:bg-[#C29A52]/20 active:bg-[#5A1832]/30 transition-colors"
        title="Drag to resize sidebar (180–300px) • Double-click to restore default width (225px)"
      >
        <div className="w-[2px] h-8 bg-transparent group-hover:bg-[#C29A52] group-active:bg-[#5A1832] transition-colors rounded-full" />
      </div>
    </aside>
  );
};
