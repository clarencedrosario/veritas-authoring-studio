import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  Unlock,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  Maximize2,
  Moon,
  Sun,
  FileText,
  FileCode,
  Shield,
  Clock,
  GraduationCap,
  BookMarked,
  Sparkles,
  ChevronDown,
  Mic,
} from 'lucide-react';
import { NovelProject } from '../types';
import { exportToDocx, exportToMarkdown, exportToPlainText, exportProjectJson } from '../utils/export';

interface NavbarProps {
  project: NovelProject;
  onUpdateProject: (updated: NovelProject) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedTime: string | null;
  onTriggerSync: () => void;
  onOpenEncryption: () => void;
  onOpenFocusMode: () => void;
  onOpenVersions: () => void;
  onOpenLiveVoice?: () => void;
  currentTab?: string;
  onSelectTab?: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onUpdateProject,
  isDarkMode,
  onToggleDarkMode,
  isOnline,
  isSyncing,
  lastSyncedTime,
  onTriggerSync,
  onOpenEncryption,
  onOpenFocusMode,
  onOpenVersions,
  onOpenLiveVoice,
  currentTab,
  onSelectTab,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);

  const totalWords = project.chapters.reduce(
    (acc, chap) => acc + chap.scenes.reduce((sAcc, s) => sAcc + (s.wordCount || 0), 0),
    0
  );
  const dailyProgress = Math.min(100, Math.round(((project.wordsWrittenToday || 0) / (project.dailyGoalWords || 1000)) * 100));

  const isGrammarWorkspace = [
    'grammar_series',
    'spaced_repetition',
    'composition_studio',
    'textbook_exporter',
  ].includes(currentTab || '');

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateProject({ ...project, title: titleInput.trim(), updatedAt: new Date().toISOString() });
    }
    setIsEditingTitle(false);
  };

  return (
    <header
      id="app-navbar"
      className={`h-16 px-4 md:px-6 border-b flex items-center justify-between transition-colors z-30 select-none ${
        isDarkMode
          ? 'bg-[#101c33]/95 border-[#1e2f52] text-slate-100'
          : 'bg-white/95 border-[#e2e8f0] text-[#172554]'
      } backdrop-blur-md sticky top-0 shadow-xs`}
    >
      {/* LEFT SECTION: Brand Identity & Active Project */}
      <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
        <div
          id="nav-brand-icon"
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            {isEditingTitle ? (
              <input
                id="nav-title-input"
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                autoFocus
                className="text-base md:text-lg font-bold bg-transparent border-b-2 border-blue-600 text-[#172554] dark:text-white outline-none px-1 py-0.5"
              />
            ) : (
              <button
                id="nav-title-button"
                onClick={() => {
                  setTitleInput(project.title);
                  setIsEditingTitle(true);
                }}
                className="text-base md:text-lg font-bold tracking-tight text-[#172554] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate flex items-center space-x-2"
                title="Click to rename project"
              >
                <span className="truncate">{project.title || 'Untitled Project'}</span>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                  {project.genre || 'Literature'}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="truncate">By {project.authorName || 'Author'}</span>
            <span>&bull;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {totalWords.toLocaleString()} words
            </span>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: Workspace Mode Switcher with Balanced Spacing */}
      {onSelectTab && (
        <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
          <button
            onClick={() => onSelectTab('manuscript')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              !isGrammarWorkspace
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Novel Studio</span>
          </button>

          <button
            onClick={() => onSelectTab('grammar_series')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              isGrammarWorkspace
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Grammar &amp; Textbook LMS</span>
          </button>
        </div>
      )}

      {/* RIGHT SECTION: Organized Metrics, Sync, Export & Controls */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Metric Pill: Compact Daily Progress */}
        <div
          className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-xs"
          title={`Daily writing target: ${project.wordsWrittenToday || 0} / ${project.dailyGoalWords || 1000} words`}
        >
          <span className="text-slate-600 dark:text-slate-400 font-medium">Goal:</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {dailyProgress}%
          </span>
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${dailyProgress}%` }}
            />
          </div>
        </div>

        {/* Security & Sync Indicators */}
        <div className="flex items-center space-x-1 bg-white dark:bg-slate-800/50 p-0.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700/70">
          <button
            id="btn-nav-encryption"
            onClick={onOpenEncryption}
            className={`h-8 px-2.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              project.isEncrypted
                ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
            title={project.isEncrypted ? 'End-to-End Encryption Active (AES-256)' : 'Configure Encryption'}
          >
            {project.isEncrypted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{project.isEncrypted ? 'Encrypted' : 'Security'}</span>
          </button>

          <button
            id="btn-nav-cloud-sync"
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`h-8 px-2.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              !isOnline
                ? 'text-amber-600 dark:text-amber-400'
                : isSyncing
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700'
            }`}
            title={isOnline ? (lastSyncedTime ? `Last synced ${lastSyncedTime}` : 'Cloud sync') : 'Offline Mode'}
          >
            {!isOnline ? (
              <CloudOff className="w-3.5 h-3.5" />
            ) : isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
            <span className="hidden lg:inline">
              {!isOnline ? 'Offline' : isSyncing ? 'Syncing...' : 'Synced'}
            </span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Live Voice Assistant Button */}
        {onOpenLiveVoice && (
          <button
            id="btn-nav-live-voice"
            onClick={onOpenLiveVoice}
            className="h-8.5 px-3 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center space-x-1.5 shadow-xs transition-colors"
            title="Real-time voice conversation with Gemini 3.1 Flash Live"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>Live Voice</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {/* Primary Export Dropdown with Surf Blue CTA */}
        <div className="relative">
          <button
            id="btn-nav-export"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="h-8.5 px-3.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3 opacity-80" />
          </button>

          {showExportMenu && (
            <div
              id="export-dropdown-menu"
              className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 border text-xs z-50 animate-in fade-in slide-in-from-top-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <div className="px-3.5 py-1 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                Manuscript &amp; Novel Formats
              </div>
              <button
                id="btn-export-docx"
                onClick={() => {
                  exportToDocx(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center space-x-2.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Microsoft Word (.docx)</div>
                  <div className="text-[10px] text-slate-400">Industry manuscript standard</div>
                </div>
              </button>

              <button
                id="btn-export-markdown"
                onClick={() => {
                  exportToMarkdown(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center space-x-2.5 transition-colors"
              >
                <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Markdown (.md)</div>
                  <div className="text-[10px] text-slate-400">Portable plain text</div>
                </div>
              </button>

              <button
                id="btn-export-txt"
                onClick={() => {
                  exportToPlainText(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center space-x-2.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Plain Text (.txt)</div>
                  <div className="text-[10px] text-slate-400">Raw text file</div>
                </div>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1.5" />

              <div className="px-3.5 py-1 font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Grammar &amp; Textbook</span>
                <span className="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-1.5 py-0.2 rounded font-medium">K-12</span>
              </div>
              <button
                id="btn-nav-open-textbook-exporter"
                onClick={() => {
                  if (onSelectTab) onSelectTab('textbook_exporter');
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center space-x-2.5 transition-colors"
              >
                <BookMarked className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Textbook Layout Studio</div>
                  <div className="text-[10px] text-slate-400">Crown Quarto, DOCX &amp; PDF</div>
                </div>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1.5" />

              <button
                id="btn-export-json"
                onClick={() => {
                  exportProjectJson(project);
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/60 flex items-center space-x-2.5 transition-colors"
              >
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Project Archive (.json)</div>
                  <div className="text-[10px] text-slate-400">Complete backup package</div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Clean Utility Buttons */}
        <div className="flex items-center space-x-1">
          <button
            id="btn-nav-version-history"
            onClick={onOpenVersions}
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            title="Version History &amp; Backups"
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            id="btn-nav-focus-mode"
            onClick={onOpenFocusMode}
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            title="Distraction-Free Zen Writing"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            id="btn-nav-theme-toggle"
            onClick={onToggleDarkMode}
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
