import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Layers,
  BookMarked,
  ArrowRight,
  Plus,
  Mic,
  Network,
  Download,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { NovelProject, GrammarSeriesProject, Chapter, Scene } from '../types';
import { MainTab } from './Sidebar';

interface HomeDashboardViewProps {
  project: NovelProject;
  grammarProject: GrammarSeriesProject;
  activeChapter?: Chapter;
  activeScene?: Scene;
  onSelectTab: (tab: MainTab) => void;
  onAddScene: () => void;
  onOpenLiveVoice: () => void;
  onOpenExportModal: () => void;
  isDarkMode: boolean;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  project,
  grammarProject,
  activeChapter,
  activeScene,
  onSelectTab,
  onAddScene,
  onOpenLiveVoice,
  onOpenExportModal,
  isDarkMode,
}) => {
  const totalWords = project.chapters.reduce(
    (acc, chap) => acc + chap.scenes.reduce((sAcc, s) => sAcc + (s.wordCount || 0), 0),
    0
  );

  const dailyProgress = Math.min(
    100,
    Math.round(((project.wordsWrittenToday || 0) / (project.dailyGoalWords || 1000)) * 100)
  );

  return (
    <div
      id="home-dashboard-view"
      className="flex-1 overflow-y-auto bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-10"
    >
      {/* Editorial Welcome Header */}
      <div className="space-y-2 border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-6">
        <div className="text-[12px] font-mono uppercase tracking-widest text-[#9A7438] dark:text-[#C29A52] font-semibold">
          Veritas Workspace Overview
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7]">
            Welcome back, {project.authorName || 'Clarence'}
          </h1>
          <div className="text-[13px] text-[#71685E] dark:text-[#c9b9a6] flex items-center space-x-2 font-mono bg-[#F6F0E7] dark:bg-[#2c1b25] px-3.5 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b]">
            <span>Today&apos;s Target: <strong className="text-[#5A1832] dark:text-[#C29A52]">{dailyProgress}%</strong></span>
            <span>&bull;</span>
            <span className="text-[#292521] dark:text-[#F6F0E7] font-semibold">
              {project.wordsWrittenToday || 0} / {project.dailyGoalWords || 1000} words
            </span>
          </div>
        </div>
      </div>

      {/* RECENT WORK SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-[#71685E] dark:text-[#c9b9a6]">
            Recent Work &amp; Active Studios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Novel Project */}
          <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:border-[#9A7438] dark:hover:border-[#C29A52] transition-all flex flex-col justify-between space-y-5 shadow-xs group">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center border border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="badge-status bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4d2b3b] font-medium text-xs">
                  Manuscript Draft
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors">
                  {project.title || 'Untitled Novel'}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] mt-1.5 line-clamp-2">
                  {project.logline || 'A dark academic mystery exploring ancient manuscripts and forgotten wards.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b] text-[12px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between font-mono">
                <span>{totalWords.toLocaleString()} words &bull; {project.chapters.length} chapters</span>
                <span>Active: {activeChapter ? `Ch ${activeChapter.number}` : 'Scene 1'}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('manuscript')}
              className="w-full min-h-[44px] btn-secondary text-[14.5px] flex items-center justify-between group/btn py-2 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] hover:border-[#9A7438]"
            >
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">Continue Writing</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#5A1832] dark:text-[#C29A52]" />
            </button>
          </div>

          {/* Card 2: Textbook & Curriculum Project */}
          <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:border-[#9A7438] dark:hover:border-[#C29A52] transition-all flex flex-col justify-between space-y-5 shadow-xs group">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] flex items-center justify-center border border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="badge-status bg-[#EDE4D6] dark:bg-[#35101F] text-[#9A7438] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4d2b3b] font-medium text-xs">
                  Curriculum LMS
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7] group-hover:text-[#9A7438] dark:group-hover:text-[#C29A52] transition-colors">
                  {grammarProject.seriesTitle}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] mt-1.5 line-clamp-2">
                  Comprehensive 10-grade English Language series with 3-tier differentiated pedagogy.
                </p>
              </div>

              <div className="pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b] text-[12px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between font-mono">
                <span>Selected: {grammarProject.selectedClass}</span>
                <span>CBSE, ICSE &amp; Cambridge</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('grammar_series')}
              className="w-full min-h-[44px] btn-secondary text-[14.5px] flex items-center justify-between group/btn py-2 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] hover:border-[#9A7438]"
            >
              <span className="font-semibold text-[#9A7438] dark:text-[#C29A52]">Open Curriculum Series</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#9A7438] dark:text-[#C29A52]" />
            </button>
          </div>

          {/* Card 3: Board Blueprints & Assessment Matrix */}
          <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:border-[#9A7438] dark:hover:border-[#C29A52] transition-all flex flex-col justify-between space-y-5 shadow-xs group">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center border border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] bg-[#EDE4D6] dark:bg-[#35101F] px-2.5 py-1 rounded-md border border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                  <span>100% Audited</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors">
                  Board Blueprint Matrix
                </h3>
                <p className="text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] mt-1.5 line-clamp-2">
                  Question weightage, Bloom&apos;s cognitive levels, and sectional marks audits for CBSE &amp; ICSE.
                </p>
              </div>

              <div className="pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b] text-[12px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between font-mono">
                <span>Section B Grammar (10 Marks)</span>
                <span>Question 5 ICSE</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('board_blueprints')}
              className="w-full min-h-[44px] btn-secondary text-[14.5px] flex items-center justify-between group/btn py-2 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] hover:border-[#9A7438]"
            >
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">Inspect Audit Matrix</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#5A1832] dark:text-[#C29A52]" />
            </button>
          </div>

          {/* Card 4: Publishing & Submissions Kit */}
          <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:border-[#9A7438] dark:hover:border-[#C29A52] transition-all flex flex-col justify-between space-y-5 shadow-xs group">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center border border-[#CBBEAC] dark:border-[#4d2b3b]">
                  <BookMarked className="w-5 h-5" />
                </div>
                <span className="badge-status bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#4d2b3b] font-medium text-xs">
                  Publishing Kit
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors">
                  Agent Pitch &amp; Cover Studio
                </h3>
                <p className="text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] mt-1.5 line-clamp-2">
                  Professional query letters, market comp titles, book cover dimensions, and spine calculators.
                </p>
              </div>

              <div className="pt-3 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b] text-[12px] text-[#71685E] dark:text-[#c9b9a6] flex items-center justify-between font-mono">
                <span>Cover: {project.coverDesign?.themeLayout || 'Classic Minimal'}</span>
                <span>Agent Queries</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('querykit')}
              className="w-full min-h-[44px] btn-secondary text-[14.5px] flex items-center justify-between group/btn py-2 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] hover:border-[#9A7438]"
            >
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">Manage Submissions</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-[#5A1832] dark:text-[#C29A52]" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold font-mono tracking-wider uppercase text-[#71685E] dark:text-[#c9b9a6]">
          Editorial Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={onAddScene}
            className="p-4 min-h-[64px] rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:border-[#9A7438] text-left transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <div>
              <div className="text-[14px] font-semibold text-[#292521] dark:text-[#F6F0E7]">New Scene</div>
              <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Add to manuscript</div>
            </div>
          </button>

          <button
            onClick={onOpenLiveVoice}
            className="p-4 min-h-[64px] rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:border-[#9A7438] text-left transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <Mic className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
            <div>
              <div className="text-[14px] font-semibold text-[#292521] dark:text-[#F6F0E7]">Live Voice</div>
              <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Gemini 3.1 Flash Live</div>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('grammar_series')}
            className="p-4 min-h-[64px] rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:border-[#9A7438] text-left transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <Network className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <div>
              <div className="text-[14px] font-semibold text-[#292521] dark:text-[#F6F0E7]">Syntax Studio</div>
              <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Reed-Kellogg trees</div>
            </div>
          </button>

          <button
            onClick={onOpenExportModal}
            className="p-4 min-h-[64px] rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2c1b25] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] hover:border-[#9A7438] text-left transition-all flex flex-col justify-between space-y-2 group shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
            <div>
              <div className="text-[14px] font-semibold text-[#292521] dark:text-[#F6F0E7]">Export Files</div>
              <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Word, MD, Text, JSON</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
