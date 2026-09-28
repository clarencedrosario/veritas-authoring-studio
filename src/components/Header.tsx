import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  BookMarked,
  Search,
  Plus,
  Bell,
  Settings,
  Mic,
  Download,
  ChevronRight,
  ChevronDown,
  Check,
  FileText,
  FileCode,
  Shield,
  FileQuestion,
  User,
  ExternalLink,
} from 'lucide-react';
import { NovelProject, GrammarSeriesProject, ContentWritingProject } from '../types';
import { WorkspaceType } from './NavigationRail';
import { exportToDocx, exportToMarkdown, exportToPlainText, exportProjectJson } from '../utils/export';
import { resolveActiveBookContext, switchActiveBookProject } from '../utils/activeBookContext';

interface HeaderProps {
  activeWorkspace: WorkspaceType;
  project: NovelProject;
  grammarProject: GrammarSeriesProject;
  contentProject?: ContentWritingProject;
  activeChapterId?: string;
  activeSceneId?: string;
  onUpdateProjectTitle: (title: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenLiveVoice: () => void;
  onOpenExportModal: () => void;
  onAddScene: () => void;
  onAddChapter: () => void;
  onAddQuestion: () => void;
  onAddAssessment: () => void;
  onSelectTab: (tab: any) => void;
  onSelectBookProject?: (projectId: string) => void;
  isDarkMode: boolean;
  currentTab?: string;
  activeChapterStudioContext?: {
    systemId: string;
    classLevel: string;
    chapterTitle?: string;
    chapterNumber?: number;
    bookTitle?: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeWorkspace,
  project,
  grammarProject,
  contentProject,
  activeChapterId,
  activeSceneId,
  onUpdateProjectTitle,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenLiveVoice,
  onOpenExportModal,
  onAddScene,
  onAddChapter,
  onAddQuestion,
  onAddAssessment,
  onSelectTab,
  onSelectBookProject,
  isDarkMode,
  currentTab,
  activeChapterStudioContext,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBookSelector, setShowBookSelector] = useState(false);

  const newMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const bookSelectorRef = useRef<HTMLDivElement>(null);

  // Authoritative active book context resolution
  const resolvedBookContext = React.useMemo(() => {
    return resolveActiveBookContext(grammarProject);
  }, [grammarProject]);
  const baseActiveBookProject = resolvedBookContext.activeProject;
  const allProjects = resolvedBookContext.allProjects;

  // Synchronize displayed global academic context with the active chapter when in Chapter Studio
  const activeBookProject = React.useMemo(() => {
    if (currentTab === 'chapter_studio' && activeChapterStudioContext) {
      const targetSystem = activeChapterStudioContext.systemId;
      const targetClass = activeChapterStudioContext.classLevel;
      const matched = allProjects.find(
        (p) =>
          p.board?.toUpperCase() === targetSystem.toUpperCase() &&
          (p.classLevel === targetClass || p.classOrStage === targetClass)
      );
      if (matched) {
        return {
          ...matched,
          bookTitle: activeChapterStudioContext.bookTitle || matched.bookTitle,
        };
      }
      return {
        ...baseActiveBookProject,
        board: targetSystem,
        classLevel: targetClass as any,
        classOrStage: targetClass,
        bookTitle:
          activeChapterStudioContext.bookTitle ||
          baseActiveBookProject.bookTitle,
      };
    }
    return baseActiveBookProject;
  }, [currentTab, activeChapterStudioContext, allProjects, baseActiveBookProject]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (bookSelectorRef.current && !bookSelectorRef.current.contains(e.target as Node)) {
        setShowBookSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalWords = project.chapters.reduce(
    (acc, chap) => acc + chap.scenes.reduce((sAcc, s) => sAcc + (s.wordCount || 0), 0),
    0
  );

  const currentChapter = project.chapters.find((c) => c.id === activeChapterId) || project.chapters[0];
  const currentScene = currentChapter?.scenes?.find((s) => s.id === activeSceneId) || currentChapter?.scenes?.[0];

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateProjectTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const getWorkspaceTitle = () => {
    switch (activeWorkspace) {
      case 'home':
        return 'Overview';
      case 'academic':
        return 'Academic Book Studio';
      case 'novel':
        return 'Novel Writing Studio';
      case 'content':
        return 'Content Writing Studio';
      case 'film':
        return 'Film & Script Studio';
      case 'publishing':
        return 'Publishing Suite';
      case 'analytics':
        return 'Analytics & Metrics';
      default:
        return 'Authoring Studio';
    }
  };

  return (
    <header
      id="top-application-header"
      className="h-[52px] px-3 sm:px-4 border-b border-[#4d1e2e] bg-[#35101F] text-[#F6F0E7] flex items-center justify-between z-40 select-none shrink-0 shadow-md"
    >
      {/* LEFT: Product Logo & Veritas Brand Crest */}
      <div className="flex items-center space-x-3 min-w-0">
        <div
          id="header-brand"
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => onSelectTab('home')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#5A1832] border border-[#C29A52]/50 text-[#C29A52] flex items-center justify-center font-serif font-bold text-base tracking-widest shadow-inner group-hover:scale-105 transition-transform">
            V
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif tracking-widest font-bold text-[13px] text-[#F6F0E7] leading-none uppercase">
              Veritas
            </span>
            <span className="text-[10px] text-[#C29A52] leading-none mt-0.5 tracking-wider font-medium uppercase font-mono">
              Press &amp; Studio
            </span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-[#5A1832] hidden md:block" />

        {/* ACTIVE CONTEXT HIERARCHY (Section 10) */}
        <div className="flex items-center space-x-2 text-xs min-w-0">
          <span className="text-[#C29A52] font-semibold hidden md:inline truncate">
            {getWorkspaceTitle()}
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-[#C29A52]/60 hidden md:inline shrink-0" />

          {/* Publishing / Curriculum Context */}
          {activeWorkspace === 'academic' ? (
            <div className="relative" ref={bookSelectorRef}>
              <button
                type="button"
                id="header-active-book-trigger"
                onClick={() => setShowBookSelector(!showBookSelector)}
                className="flex items-center space-x-1.5 truncate text-[13px] hover:opacity-90 transition-opacity cursor-pointer p-1 rounded-lg hover:bg-black/20 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] focus-visible:ring-offset-1 ring-offset-[#35101F]"
                title="Active Book Project — Click to switch active book"
              >
                <span className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/30 font-semibold font-mono text-[11px] shrink-0">
                  {activeBookProject.board}
                </span>
                <span className="text-[#F6F0E7] font-medium hidden sm:inline truncate max-w-[180px] md:max-w-[260px]">
                  {activeBookProject.bookTitle}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#5A1832]/60 text-[#C29A52] border border-[#5A1832] text-[11px] font-medium shrink-0">
                  {activeBookProject.classLevel || activeBookProject.classOrStage}
                </span>
                <ChevronDown className="w-3 h-3 text-[#C29A52] ml-0.5 shrink-0" />
              </button>

              {/* Book Project Switcher Dropdown */}
              {showBookSelector && (
                <div
                  id="header-book-switcher-menu"
                  className="absolute left-0 top-full mt-1.5 w-80 rounded-xl bg-[#2A121D] border border-[#C29A52]/40 shadow-2xl z-50 p-2 space-y-1 text-xs"
                >
                  <div className="px-2.5 py-1.5 border-b border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#C29A52] font-bold">
                    Switch Active Book Project
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {allProjects.map((p) => {
                      const isSelected = p.id === activeBookProject.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setShowBookSelector(false);
                            if (onSelectBookProject) {
                              onSelectBookProject(p.id);
                            }
                          }}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C29A52] ${
                            isSelected
                              ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold border border-[#C29A52]/40'
                              : 'hover:bg-black/30 text-[#EDE4D6]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center space-x-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-[#C29A52]">
                                {p.board}
                              </span>
                              <span className="truncate block font-serif text-[12px]">
                                {p.bookTitle}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#A89C8F] block font-mono">
                              {p.classLevel || p.classOrStage} • {p.edition || 'Standard Edition'}
                            </span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#C29A52] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : activeWorkspace === 'content' ? (
            /* Content Writing Context */
            <div className="flex items-center space-x-2 truncate">
              <span className="font-serif font-semibold text-[#F6F0E7] truncate text-xs sm:text-[13px]">
                {contentProject?.documents?.find((d) => d.id === contentProject?.activeDocumentId)?.title || contentProject?.title || 'Content Studio'}
              </span>
              {currentTab === 'research' ? (
                <span className="inline-flex items-center text-[11px] text-[#C29A52] font-mono">
                  <span className="mx-1 text-[#C29A52]">•</span>
                  Research Archive
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center text-[11px] text-[#D8CCBC] font-mono">
                  <span className="mx-1 text-[#C29A52]">•</span>
                  {contentProject?.documents?.find((d) => d.id === contentProject?.activeDocumentId)?.contentType?.replace(/_/g, ' ') || 'Manuscript'}
                </span>
              )}
              <span className="hidden sm:inline-flex badge-status bg-[#5A1832] text-[#EDE4D6] border border-[#C29A52]/30 text-[11px] font-mono">
                {(contentProject?.documents?.find((d) => d.id === contentProject?.activeDocumentId)?.wordCount || 0).toLocaleString()} words
              </span>
            </div>
          ) : (
            /* Novel Context */
            <div className="flex items-center space-x-2 truncate">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                  autoFocus
                  className="font-serif font-semibold bg-[#5A1832] border-b-2 border-[#C29A52] text-[#F6F0E7] outline-none text-xs sm:text-[13px] px-1.5 py-0.5 rounded"
                />
              ) : (
                <button
                  onClick={() => {
                    setTitleInput(project.title);
                    setIsEditingTitle(true);
                  }}
                  className="font-serif font-semibold text-[#F6F0E7] hover:text-[#C29A52] transition-colors truncate text-left text-xs sm:text-[13px]"
                  title="Click to rename novel"
                >
                  {project.title || 'Untitled Manuscript'}
                </button>
              )}

              {currentChapter && (
                <span className="hidden lg:inline-flex items-center text-[11px] text-[#D8CCBC] font-mono">
                  <span className="mx-1 text-[#C29A52]">•</span>
                  Ch. {currentChapter.number} {currentScene ? `• Sc. ${currentScene.title || 'Scene 1'}` : ''}
                </span>
              )}

              {/* Status Badge */}
              <span className="hidden sm:inline-flex badge-status bg-[#5A1832] text-[#EDE4D6] border border-[#C29A52]/30 text-[11px] font-mono">
                {totalWords.toLocaleString()} words
              </span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Search, Cmd+K, New, Voice, Export, Notifications, Settings, Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 shrink-0">
        {/* Search / Command Palette Input Button */}
        <button
          id="btn-header-search"
          onClick={onOpenCommandPalette}
          className="h-8.5 px-2.5 sm:px-3 rounded-lg border border-[#5A1832] bg-[#4a1828] hover:bg-[#5A1832] text-[#EDE4D6] hover:text-[#F6F0E7] flex items-center space-x-2 text-xs font-medium transition-colors group shadow-inner"
          title="Search workspace and execute commands (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-[#C29A52] group-hover:scale-105 transition-transform" />
          <span className="hidden sm:inline text-xs font-medium">Search</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-[#35101F] border border-[#5A1832] text-[#C29A52] rounded">
            ⌘K
          </kbd>
        </button>

        {/* Quick + New Action Menu */}
        <div className="relative" ref={newMenuRef}>
          <button
            id="btn-header-new"
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="h-8.5 px-3 rounded-lg bg-[#5A1832] hover:bg-[#6e1e3d] text-[#F6F0E7] border border-[#C29A52]/40 text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-[#C29A52]" />
          </button>

          {showNewMenu && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] shadow-xl py-1.5 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold text-[#71685E] uppercase tracking-wider font-mono">
                Novel Studio
              </div>
              <button
                onClick={() => {
                  onAddScene();
                  setShowNewMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2 text-[#292521] font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#5A1832]" />
                <span>New Scene</span>
              </button>
              <button
                onClick={() => {
                  onAddChapter();
                  setShowNewMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2 text-[#292521] font-medium transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5A1832]" />
                <span>New Chapter</span>
              </button>

              <div className="border-t border-[#CBBEAC] my-1" />

              <div className="px-3 py-1 text-[10px] font-bold text-[#71685E] uppercase tracking-wider font-mono">
                Academic Publishing
              </div>
              <button
                onClick={() => {
                  onAddQuestion();
                  setShowNewMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2 text-[#292521] font-medium transition-colors"
              >
                <FileQuestion className="w-3.5 h-3.5 text-[#9A7438]" />
                <span>New Question</span>
              </button>
              <button
                onClick={() => {
                  onAddAssessment();
                  setShowNewMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2 text-[#292521] font-medium transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#9A7438]" />
                <span>New Assessment Paper</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Voice Assistant */}
        <button
          id="btn-header-live-voice"
          onClick={onOpenLiveVoice}
          className="h-8.5 px-2.5 sm:px-3 rounded-lg border border-[#5A1832] bg-[#4a1828] hover:bg-[#5A1832] text-[#F6F0E7] text-xs font-medium flex items-center space-x-1.5 transition-colors group"
          title="Real-time voice discussion with Gemini 3.1 Flash Live"
        >
          <Mic className="w-3.5 h-3.5 text-[#C29A52] group-hover:scale-105 transition-transform" />
          <span className="hidden lg:inline">Voice</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C29A52] animate-pulse" />
        </button>

        {/* Export Dropdown with Label */}
        <div className="relative" ref={exportMenuRef}>
          <button
            id="btn-header-export"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="h-8.5 px-2.5 sm:px-3 rounded-lg border border-[#5A1832] bg-[#4a1828] hover:bg-[#5A1832] text-[#EDE4D6] hover:text-[#F6F0E7] text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="Export manuscript or textbook"
          >
            <Download className="w-3.5 h-3.5 text-[#C29A52]" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] shadow-xl py-1.5 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold text-[#71685E] uppercase tracking-wider font-mono">
                Manuscript Formats
              </div>
              <button
                onClick={() => {
                  exportToDocx(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2.5 transition-colors text-[#292521]"
              >
                <FileText className="w-3.5 h-3.5 text-[#5A1832]" />
                <div>
                  <div className="font-semibold">Microsoft Word (.docx)</div>
                  <div className="text-[10px] text-[#71685E]">Industry standard publishing format</div>
                </div>
              </button>
              <button
                onClick={() => {
                  exportToMarkdown(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2.5 transition-colors text-[#292521]"
              >
                <FileCode className="w-3.5 h-3.5 text-[#9A7438]" />
                <div>
                  <div className="font-semibold">Markdown (.md)</div>
                  <div className="text-[10px] text-[#71685E]">Clean structural hierarchy</div>
                </div>
              </button>
              <button
                onClick={() => {
                  exportToPlainText(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2.5 transition-colors text-[#292521]"
              >
                <FileText className="w-3.5 h-3.5 text-[#71685E]" />
                <div>
                  <div className="font-semibold">Plain Text (.txt)</div>
                  <div className="text-[10px] text-[#71685E]">Unformatted manuscript text</div>
                </div>
              </button>

              <div className="border-t border-[#CBBEAC] my-1" />

              <div className="px-3 py-1 text-[10px] font-bold text-[#71685E] uppercase tracking-wider font-mono">
                Academic Textbook
              </div>
              <button
                onClick={() => {
                  onSelectTab('textbook_exporter');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2.5 transition-colors text-[#292521]"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#5A1832]" />
                <div>
                  <div className="font-semibold">Textbook Print Exporter</div>
                  <div className="text-[10px] text-[#71685E]">Crown Quarto, PDF &amp; LaTeX</div>
                </div>
              </button>

              <div className="border-t border-[#CBBEAC] my-1" />

              <button
                onClick={() => {
                  exportProjectJson(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#EDE4D6] hover:text-[#5A1832] flex items-center space-x-2.5 transition-colors text-[#292521]"
              >
                <Shield className="w-3.5 h-3.5 text-[#5A1832]" />
                <div>
                  <div className="font-semibold">Project Snapshot (.json)</div>
                  <div className="text-[10px] text-[#71685E]">Full encrypted backup</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Activity & Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#5A1832] transition-colors relative"
            title="Activity notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C29A52]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-76 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] shadow-xl p-3.5 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#CBBEAC] mb-2.5 font-semibold text-[#292521]">
                <span className="font-serif">Veritas Publishing Audits</span>
                <span className="text-[10px] text-[#71685E] font-mono">Real-time</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#EDE4D6] text-[11.5px] text-[#292521] border border-[#CBBEAC]">
                  <strong className="text-[#5A1832]">Voice Engine:</strong> Burstiness calibration calibrated at 84% organic human variance.
                </div>
                <div className="p-2.5 rounded-lg bg-[#EDE4D6] text-[11.5px] text-[#292521] border border-[#CBBEAC]">
                  <strong className="text-[#5A1832]">Curriculum Audit:</strong> CISCE Class 7 Grammar scope is 100% compliant.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Settings with Label on medium screens */}
        <button
          id="btn-header-settings"
          onClick={onOpenSettings}
          className="h-8.5 px-2 sm:px-2.5 rounded-lg flex items-center space-x-1.5 text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#5A1832] transition-colors"
          title="Project settings &amp; encryption"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            id="btn-header-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8.5 h-8.5 rounded-full bg-[#5A1832] text-[#C29A52] border border-[#C29A52]/50 flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform"
            title="Author Profile: Clarence D'Rosario"
          >
            CD
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] shadow-xl p-3.5 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#CBBEAC] mb-2.5">
                <div className="w-9 h-9 rounded-full bg-[#5A1832] text-[#C29A52] border border-[#C29A52]/40 flex items-center justify-center font-bold text-xs">
                  CD
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#292521] truncate font-serif text-[13px]">
                    Clarence D'Rosario
                  </div>
                  <div className="text-[11px] text-[#71685E] truncate">
                    Author &amp; Series Editor
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onSelectTab('team');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.75 rounded-lg hover:bg-[#EDE4D6] hover:text-[#5A1832] text-[#292521] font-medium transition-colors"
                >
                  Editorial Roster
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.75 rounded-lg hover:bg-[#EDE4D6] hover:text-[#5A1832] text-[#292521] font-medium transition-colors"
                >
                  Security &amp; Web Crypto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
