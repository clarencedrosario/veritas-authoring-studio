import React, { useState } from 'react';
import {
  Feather,
  BookOpen,
  Clock,
  Users2,
  Share2,
  MessageSquare,
  HeartPulse,
  GitCommit,
  Activity,
  Send,
  ShieldCheck,
  Palette,
  BarChart3,
  Users,
  ChevronRight,
  Plus,
  Trash2,
  GraduationCap,
  Brain,
  PenTool,
  BookMarked,
  Layers,
  GitFork,
  LayoutGrid,
  Award,
  Mic,
  Globe2,
  GitCompare,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { NovelProject, Chapter, Scene } from '../types';

export type MainTab =
  | 'home'
  | 'manuscript'
  | 'content_studio'
  | 'script_studio'
  | 'codex'
  | 'timeline'
  | 'characters'
  | 'relationships'
  | 'dialogue'
  | 'thesaurus'
  | 'plot'
  | 'pacing'
  | 'research'
  | 'querykit'
  | 'humanizer'
  | 'design'
  | 'analytics'
  | 'team'
  | 'series_dashboard'
  | 'book_projects'
  | 'book_planner'
  | 'curriculum_mapping'
  | 'scope_sequence'
  | 'board_blueprints'
  | 'grammar_series'
  | 'chapter_studio'
  | 'grammar_concepts'
  | 'question_bank'
  | 'assessment_builder'
  | 'grammar_quiz'
  | 'differentiated_worksheets'
  | 'spaced_repetition'
  | 'composition_studio'
  | 'sentence_diagrammer'
  | 'textbook_preview'
  | 'textbook_exporter'
  | 'publisher_submission';

export const GRAMMAR_WORKSPACE_TABS: MainTab[] = [
  'series_dashboard',
  'book_projects',
  'book_planner',
  'curriculum_mapping',
  'scope_sequence',
  'board_blueprints',
  'grammar_series',
  'chapter_studio',
  'grammar_concepts',
  'question_bank',
  'assessment_builder',
  'grammar_quiz',
  'differentiated_worksheets',
  'spaced_repetition',
  'composition_studio',
  'sentence_diagrammer',
  'textbook_preview',
  'textbook_exporter',
  'publisher_submission',
];

export const isGrammarTab = (tab: MainTab): boolean => GRAMMAR_WORKSPACE_TABS.includes(tab);

interface SidebarProps {
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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenLiveVoice?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
  isCollapsed,
  onToggleCollapse,
  onOpenLiveVoice,
}) => {
  const isGrammarWorkspace = isGrammarTab(currentTab);

  // Novel Studio Sections
  const novelSections = [
    {
      title: 'Narrative & Lore',
      items: [
        { id: 'manuscript' as MainTab, label: 'Manuscript', icon: Feather, badge: project.chapters.length },
        { id: 'codex' as MainTab, label: 'World Codex', icon: BookOpen, badge: project.codexEntries?.length || 0 },
        { id: 'timeline' as MainTab, label: 'Chronology & Timeline', icon: Clock, badge: project.timelineEvents?.length || 0 },
      ],
    },
    {
      title: 'Characters & Craft',
      items: [
        { id: 'characters' as MainTab, label: 'Character Dossiers', icon: Users2, badge: project.characters.length },
        { id: 'relationships' as MainTab, label: 'Relationship Web', icon: Share2 },
        { id: 'dialogue' as MainTab, label: 'Dialogue Lab', icon: MessageSquare },
        { id: 'thesaurus' as MainTab, label: 'Sensory & "Show Don\'t Tell"', icon: HeartPulse },
      ],
    },
    {
      title: 'Structure & Pacing',
      items: [
        { id: 'plot' as MainTab, label: 'Plot Architecture', icon: GitCommit, badge: project.plotBeats.length },
        { id: 'pacing' as MainTab, label: 'Pacing Heatmap', icon: Activity },
      ],
    },
    {
      title: 'Publishing & Studio',
      items: [
        { id: 'humanizer' as MainTab, label: 'Style & Voice Guard', icon: ShieldCheck, badge: 'Guard' },
        { id: 'design' as MainTab, label: 'Book & AI Cover Art', icon: Palette },
        { id: 'querykit' as MainTab, label: 'Agent Query Kit', icon: Send },
        { id: 'analytics' as MainTab, label: 'Analytics & Goals', icon: BarChart3 },
        { id: 'team' as MainTab, label: 'Team & Collaboration', icon: Users, badge: project.team.length },
      ],
    },
  ];

  // Grammar Academic Publishing & Curriculum Sections
  const grammarSections = [
    {
      title: 'BOOK DEVELOPMENT',
      items: [
        { id: 'series_dashboard' as MainTab, label: 'Series Studio', icon: Globe2, badge: '3-Board' },
        { id: 'book_projects' as MainTab, label: 'Book Projects', icon: BookOpen, badge: 'Projects' },
        { id: 'curriculum_mapping' as MainTab, label: 'Curriculum Mapping', icon: GitCompare, badge: 'Matrix' },
        { id: 'scope_sequence' as MainTab, label: 'Scope & Sequence', icon: Sparkles, badge: 'Spiral' },
        { id: 'board_blueprints' as MainTab, label: 'Board Blueprints', icon: Award, badge: 'Exam' },
      ],
    },
    {
      title: 'AUTHORING',
      items: [
        { id: 'grammar_series' as MainTab, label: 'Grammar Book', icon: GraduationCap, badge: 'Core' },
        { id: 'chapter_studio' as MainTab, label: 'Chapter Studio', icon: BookOpen, badge: 'Author' },
        { id: 'grammar_concepts' as MainTab, label: 'Grammar Concepts', icon: BookMarked, badge: 'Dossier' },
        { id: 'question_bank' as MainTab, label: 'Question Bank', icon: HelpCircle, badge: 'Bank' },
      ],
    },
    {
      title: 'ASSESSMENT',
      items: [
        { id: 'assessment_builder' as MainTab, label: 'Assessment Builder', icon: Award, badge: 'Exam' },
        { id: 'grammar_quiz' as MainTab, label: 'Interactive Quiz', icon: CheckCircle2, badge: 'Quiz' },
        { id: 'differentiated_worksheets' as MainTab, label: 'Differentiated Worksheets', icon: Award, badge: '3-Tier' },
      ],
    },
    {
      title: 'LEARNING',
      items: [
        { id: 'spaced_repetition' as MainTab, label: 'Flashcards (SRS)', icon: Brain, badge: 'SRS' },
        { id: 'composition_studio' as MainTab, label: 'Composition Studio', icon: PenTool, badge: 'Rubric' },
        { id: 'sentence_diagrammer' as MainTab, label: 'Sentence Diagrammer', icon: GitCompare, badge: 'Syntax' },
      ],
    },
    {
      title: 'PUBLISH',
      items: [
        { id: 'textbook_preview' as MainTab, label: 'Textbook Preview', icon: Eye, badge: 'Reader' },
        { id: 'textbook_exporter' as MainTab, label: 'Layout & Export', icon: BookMarked, badge: 'Desk' },
        { id: 'publisher_submission' as MainTab, label: 'Publisher Submission', icon: Send, badge: 'Dossier' },
      ],
    },
  ];

  const activeSections = isGrammarWorkspace ? grammarSections : novelSections;

  return (
    <aside
      id="app-sidebar"
      className={`border-r transition-all duration-300 flex flex-col z-20 select-none ${
        isDarkMode ? 'bg-[#0e1726]/95 border-[#1e2f52]' : 'bg-white/95 border-[#e2e8f0]'
      } ${isCollapsed ? 'w-18' : 'w-72'} shadow-2xs`}
    >
      {/* Workspace Quick Header / Mode Toggle (Expanded Only) */}
      {!isCollapsed ? (
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
              {isGrammarWorkspace ? <GraduationCap className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isGrammarWorkspace ? 'Grammar LMS' : 'Novel Studio'}
            </span>
          </div>

          <button
            onClick={() => onSelectTab(isGrammarWorkspace ? 'manuscript' : 'grammar_series')}
            className="text-[11px] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-semibold px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300/80"
            title="Switch between Novel and Grammar workspace"
          >
            Switch
          </button>
        </div>
      ) : (
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-center">
          <button
            onClick={() => onSelectTab(isGrammarWorkspace ? 'manuscript' : 'grammar_series')}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title={`Switch to ${isGrammarWorkspace ? 'Novel Studio' : 'Grammar LMS'}`}
          >
            {isGrammarWorkspace ? <GraduationCap className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Main Navigation List with Spacious Rhythm */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {activeSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
            )}

            {section.items.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center py-2.5 px-2' : 'justify-between px-3 py-2'
                  } rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-bold border-l-4 border-slate-900 dark:border-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                  title={tab.label}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{tab.label}</span>}
                  </div>

                  {!isCollapsed && tab.badge !== undefined && tab.badge !== 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                        tab.badge === 'Core' || tab.badge === 'Matrix' || tab.badge === 'Guard'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* Manuscript Chapter & Scene Browser (Shown only when in Manuscript tab) */}
        {!isCollapsed && currentTab === 'manuscript' && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Chapters &amp; Scenes
              </span>
              <button
                id="btn-add-chapter"
                onClick={onAddChapter}
                className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-semibold"
                title="Add New Chapter"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chapter</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {project.chapters.map((chapter) => {
                const chapterWordCount = chapter.scenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
                return (
                  <div
                    key={chapter.id}
                    id={`chapter-group-${chapter.id}`}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 overflow-hidden shadow-2xs"
                  >
                    <div className="px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/60">
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Ch.{chapter.number}
                        </span>
                        <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                          {chapter.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {chapterWordCount}w
                        </span>
                        <button
                          id={`btn-add-scene-${chapter.id}`}
                          onClick={() => onAddScene(chapter.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                          title="Add scene to chapter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      {chapter.scenes.map((scene) => {
                        const isSceneActive = activeChapterId === chapter.id && activeSceneId === scene.id;
                        return (
                          <div
                            key={scene.id}
                            id={`scene-item-${scene.id}`}
                            onClick={() => onSelectScene(chapter.id, scene.id)}
                            className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              isSceneActive
                                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <ChevronRight
                                className={`w-3 h-3 shrink-0 ${
                                  isSceneActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                                }`}
                              />
                              <span className="truncate">{scene.title}</span>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                {scene.wordCount}
                              </span>
                              {chapter.scenes.length > 1 && (
                                <button
                                  id={`btn-delete-scene-${scene.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Delete scene "${scene.title}"?`)) {
                                      onDeleteScene(chapter.id, scene.id);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-rose-400 hover:text-rose-600 transition-opacity"
                                  title="Delete Scene"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Real-time Voice Quick Action */}
      {onOpenLiveVoice && (
        <div className="p-2 border-t border-[#e2e8f0] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <button
            id="btn-sidebar-live-voice"
            onClick={onOpenLiveVoice}
            className={`w-full flex items-center rounded-lg font-semibold text-xs transition-colors ${
              isCollapsed
                ? 'justify-center p-2 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                : 'px-3 py-2 space-x-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs'
            }`}
            title="Real-time voice conversation with Gemini 3.1 Flash Live"
          >
            <Mic className={`w-4 h-4 shrink-0 ${isCollapsed ? 'text-emerald-500' : 'text-emerald-400 dark:text-emerald-600'}`} />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span>Gemini Live Voice</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}
          </button>
        </div>
      )}

      {/* Collapse Toggle Footer with Comfortable Touch Target */}
      <div className="p-2.5 border-t border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        {!isCollapsed && (
          <span className="text-[11px] text-blue-900/60 dark:text-slate-500 px-2 font-mono font-semibold">
            Sunny Surf v3.0
          </span>
        )}
        <button
          id="btn-sidebar-toggle-collapse"
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-blue-700 dark:hover:text-slate-200 transition-colors ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
};
