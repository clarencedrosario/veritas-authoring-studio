import React from 'react';
import {
  Home,
  BookOpen,
  GraduationCap,
  FileText,
  Film,
  BookMarked,
  BarChart2,
  Settings,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  Feather,
  FolderOpen,
  HelpCircle,
  Wrench,
} from 'lucide-react';

export type WorkspaceType =
  | 'academic'
  | 'novel'
  | 'content'
  | 'film'
  | 'library'
  | 'publishing'
  | 'tools'
  | 'analytics'
  | 'home';

interface NavigationRailProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace: (ws: WorkspaceType) => void;
  onOpenSettings: () => void;
  onOpenHelp?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSecondaryExpanded: boolean;
  onToggleSecondary: () => void;
  isOnline: boolean;
  isSyncing: boolean;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenSettings,
  onOpenHelp,
  isDarkMode,
  onToggleDarkMode,
  isSecondaryExpanded,
  onToggleSecondary,
  isOnline,
  isSyncing,
}) => {
  // CREATE Group: Four Primary Authoring Studios
  const createStudios: Array<{
    id: WorkspaceType;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut: string;
  }> = [
    { id: 'academic', label: 'Academic', sublabel: 'Books', icon: GraduationCap, shortcut: '1' },
    { id: 'novel', label: 'Novel', sublabel: 'Manuscript', icon: Feather, shortcut: '2' },
    { id: 'content', label: 'Content', sublabel: 'Writing', icon: FileText, shortcut: '3' },
    { id: 'film', label: 'Script', sublabel: 'Screenplay', icon: Film, shortcut: '4' },
  ];

  // Core Destinations: LIBRARY, PUBLISH, TOOLS
  const coreDestinations: Array<{
    id: WorkspaceType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut: string;
  }> = [
    { id: 'library', label: 'Library', icon: FolderOpen, shortcut: 'L' },
    { id: 'publishing', label: 'Publish', icon: BookMarked, shortcut: 'P' },
    { id: 'analytics', label: 'Tools', icon: BarChart2, shortcut: 'T' },
  ];

  return (
    <nav
      id="primary-navigation-rail"
      aria-label="Primary Navigation"
      className="w-20 sm:w-22 h-full flex flex-col items-center justify-between py-2.5 border-r border-[#4a182b] bg-[#35101F] text-[#EDE4D6] shrink-0 select-none z-30 shadow-lg overflow-y-auto"
    >
      {/* Top Section: Veritas Seal & Main Workspaces */}
      <div className="w-full flex flex-col items-center space-y-2">
        {/* Veritas Emblem */}
        <button
          type="button"
          onClick={() => onSelectWorkspace('library')}
          title="Veritas Authoring Studio — Open Project Library"
          className="w-10 h-10 rounded-xl bg-[#5A1832] border border-[#C29A52]/40 text-[#C29A52] flex items-center justify-center font-serif font-bold text-lg tracking-wider shadow-inner hover:scale-105 transition-transform cursor-pointer"
        >
          V
        </button>

        {/* CREATE Group Label */}
        <div className="w-full px-2 text-[9px] uppercase tracking-widest text-[#C29A52]/70 text-center font-mono font-bold pt-1">
          Create
        </div>

        {/* Primary Authoring Studios (Academic, Novel, Content, Film) */}
        <div className="w-full flex flex-col items-center space-y-1 px-1.5">
          {createStudios.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                id={`nav-rail-${item.id}`}
                onClick={() => onSelectWorkspace(item.id)}
                className={`group relative w-full min-h-[46px] py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-sm font-semibold'
                    : 'text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b]'
                }`}
                title={`${item.label} Studio (⌘${item.shortcut})`}
              >
                {/* Active Indicator Bar on Edge */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-[#C29A52]" />
                )}

                <Icon
                  className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#C29A52]' : 'text-[#D8CCBC]'
                  }`}
                />

                {/* Visible Label */}
                <span className="text-[9.5px] leading-tight mt-0.5 text-center truncate max-w-full font-sans font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-[#4a182b] my-1" />

        {/* Core Destination Stack (Library, Publish, Tools) */}
        <div className="w-full flex flex-col items-center space-y-1 px-1.5">
          {coreDestinations.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeWorkspace === item.id ||
              (item.id === 'analytics' && (activeWorkspace as string) === 'tools');
            return (
              <button
                key={item.id}
                id={`nav-rail-${item.id}`}
                onClick={() => onSelectWorkspace(item.id)}
                className={`group relative w-full min-h-[42px] py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-sm font-semibold'
                    : 'text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b]'
                }`}
                title={`${item.label} (${item.shortcut})`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-r bg-[#C29A52]" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#C29A52]' : 'text-[#D8CCBC]'
                  }`}
                />

                <span className="text-[9.5px] leading-tight mt-0.5 text-center truncate max-w-full font-sans">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section (SYSTEM): Sidebar Toggle, Help, Settings, Theme & Sync Status */}
      <div className="w-full flex flex-col items-center space-y-1 px-1.5 border-t border-[#4a182b]/80 pt-1.5 mt-2">
        {/* Toggle secondary sidebar */}
        <button
          id="btn-toggle-secondary-nav"
          onClick={onToggleSecondary}
          className="w-full min-h-[38px] py-0.5 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group cursor-pointer"
          title={isSecondaryExpanded ? 'Collapse secondary menu ([)' : 'Expand secondary menu ([)'}
        >
          {isSecondaryExpanded ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
          <span className="text-[9.5px] leading-tight mt-0.5 font-sans">Sidebar</span>
        </button>

        {/* Theme switch */}
        <button
          id="btn-nav-rail-theme"
          onClick={onToggleDarkMode}
          className="w-full min-h-[38px] py-0.5 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group cursor-pointer"
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-[#C29A52]" />
          ) : (
            <Moon className="w-4 h-4 text-[#C29A52]" />
          )}
          <span className="text-[9.5px] leading-tight mt-0.5 font-sans">Theme</span>
        </button>

        {/* Guide & Help Modal */}
        {onOpenHelp && (
          <button
            id="btn-nav-rail-help"
            onClick={onOpenHelp}
            className="w-full min-h-[38px] py-0.5 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group cursor-pointer"
            title="Help, Studio Guide & Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-[9.5px] leading-tight mt-0.5 font-sans">Help</span>
          </button>
        )}

        {/* Global Settings */}
        <button
          id="btn-nav-rail-settings"
          onClick={onOpenSettings}
          className="w-full min-h-[38px] py-0.5 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group cursor-pointer"
          title="Project & Security Settings"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[9.5px] leading-tight mt-0.5 font-sans">Settings</span>
        </button>

        {/* Network & Cloud status badge */}
        <div
          className="flex items-center space-x-1 pt-1 text-[9px] text-[#C29A52]/80 font-mono"
          title={!isOnline ? 'Offline' : isSyncing ? 'Syncing...' : 'Cloud Synced'}
        >
          <span
            className={`block w-1.5 h-1.5 rounded-full ${
              !isOnline
                ? 'bg-amber-400'
                : isSyncing
                ? 'bg-[#C29A52] animate-ping'
                : 'bg-[#C29A52]'
            }`}
          />
          <span className="text-[8.5px] uppercase tracking-wider">
            {!isOnline ? 'Offline' : isSyncing ? 'Sync' : 'Live'}
          </span>
        </div>
      </div>
    </nav>
  );
};

