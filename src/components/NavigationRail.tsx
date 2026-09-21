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
} from 'lucide-react';

export type WorkspaceType = 'academic' | 'novel' | 'content' | 'film' | 'publishing' | 'analytics' | 'home';

interface NavigationRailProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace: (ws: WorkspaceType) => void;
  onOpenSettings: () => void;
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
  isDarkMode,
  onToggleDarkMode,
  isSecondaryExpanded,
  onToggleSecondary,
  isOnline,
  isSyncing,
}) => {
  // Four Primary Authoring Destinations + Supporting Destinations
  const primaryStudios: Array<{
    id: WorkspaceType;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut: string;
  }> = [
    { id: 'academic', label: 'Academic', sublabel: 'Books', icon: GraduationCap, shortcut: '1' },
    { id: 'novel', label: 'Novel', sublabel: 'Studio', icon: Feather, shortcut: '2' },
    { id: 'content', label: 'Content', sublabel: 'Writing', icon: FileText, shortcut: '3' },
    { id: 'film', label: 'Film & Script', sublabel: 'Screenplay', icon: Film, shortcut: '4' },
  ];

  const supportingItems: Array<{
    id: WorkspaceType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut: string;
  }> = [
    { id: 'publishing', label: 'Publish', icon: BookMarked, shortcut: '5' },
    { id: 'analytics', label: 'Stats', icon: BarChart2, shortcut: '6' },
  ];

  return (
    <nav
      id="primary-navigation-rail"
      aria-label="Primary Navigation"
      className="w-20 sm:w-22 h-full flex flex-col items-center justify-between py-3 border-r border-[#4a182b] bg-[#35101F] text-[#EDE4D6] shrink-0 select-none z-30 shadow-lg"
    >
      {/* Top Section: Veritas Seal & Main Workspaces */}
      <div className="w-full flex flex-col items-center space-y-3">
        {/* Veritas Emblem */}
        <div className="w-11 h-11 rounded-xl bg-[#5A1832] border border-[#C29A52]/40 text-[#C29A52] flex items-center justify-center font-serif font-bold text-lg tracking-wider shadow-inner">
          V
        </div>

        {/* Primary Authoring Studios (Academic, Novel, Content, Film) */}
        <div className="w-full flex flex-col items-center space-y-1 px-1.5">
          {primaryStudios.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                id={`nav-rail-${item.id}`}
                onClick={() => onSelectWorkspace(item.id)}
                className={`group relative w-full min-h-[50px] py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-sm font-semibold'
                    : 'text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b]'
                }`}
                title={`${item.label} ${item.sublabel} (⌘${item.shortcut})`}
              >
                {/* Active Indicator Bar on Edge */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-r bg-[#C29A52]" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-[#C29A52]' : 'text-[#D8CCBC]'
                  }`}
                />

                {/* Visible Label */}
                <span className="text-[10px] leading-tight mt-1 text-center truncate max-w-full font-sans font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-8 h-[1px] bg-[#4a182b] my-1" />

        {/* Supporting Destination Stack (Publish, Stats) */}
        <div className="w-full flex flex-col items-center space-y-1 px-1.5">
          {supportingItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                id={`nav-rail-${item.id}`}
                onClick={() => onSelectWorkspace(item.id)}
                className={`group relative w-full min-h-[42px] py-1 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-sm font-semibold'
                    : 'text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b]'
                }`}
                title={`${item.label} (⌘${item.shortcut})`}
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

      {/* Bottom Section: Sidebar Toggle, Settings, Theme & Sync Status with Labels */}
      <div className="w-full flex flex-col items-center space-y-1.5 px-1.5 border-t border-[#4a182b]/80 pt-2">
        {/* Toggle secondary sidebar */}
        <button
          id="btn-toggle-secondary-nav"
          onClick={onToggleSecondary}
          className="w-full min-h-[44px] py-1 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group"
          title={isSecondaryExpanded ? 'Collapse secondary menu ([)' : 'Expand secondary menu ([)'}
        >
          {isSecondaryExpanded ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeft className="w-4 h-4" />
          )}
          <span className="text-[10px] leading-tight mt-0.5 font-sans">Sidebar</span>
        </button>

        {/* Theme switch */}
        <button
          id="btn-nav-rail-theme"
          onClick={onToggleDarkMode}
          className="w-full min-h-[44px] py-1 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group"
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-[#C29A52]" />
          ) : (
            <Moon className="w-4 h-4 text-[#C29A52]" />
          )}
          <span className="text-[10px] leading-tight mt-0.5 font-sans">Theme</span>
        </button>

        {/* Global Settings */}
        <button
          id="btn-nav-rail-settings"
          onClick={onOpenSettings}
          className="w-full min-h-[44px] py-1 px-1 rounded-lg flex flex-col items-center justify-center text-[#D8CCBC] hover:text-[#F6F0E7] hover:bg-[#4a182b] transition-colors group"
          title="Project & Security Settings"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] leading-tight mt-0.5 font-sans">Settings</span>
        </button>

        {/* Network & Cloud status badge */}
        <div
          className="flex items-center space-x-1 pt-1 text-[10px] text-[#C29A52]/80 font-mono"
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
          <span className="text-[9px] uppercase tracking-wider">
            {!isOnline ? 'Offline' : isSyncing ? 'Sync' : 'Live'}
          </span>
        </div>
      </div>
    </nav>
  );
};
