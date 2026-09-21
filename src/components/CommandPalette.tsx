import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  FolderOpen,
  User,
  Clock,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  FileQuestion,
  ClipboardCheck,
  Layers,
  Network,
  Download,
  BookMarked,
  Mic,
  Maximize2,
  Moon,
  Sun,
  X,
  CornerDownLeft,
  Settings,
} from 'lucide-react';
import { MainTab } from './Sidebar';

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: 'Navigation' | 'Manuscript' | 'Curriculum' | 'Publishing' | 'System';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: MainTab) => void;
  onAddScene: () => void;
  onAddChapter: () => void;
  onOpenFocusMode?: () => void;
  onOpenExportModal?: () => void;
  onOpenSettingsModal?: () => void;
  onOpenSettings?: () => void;
  onOpenLiveVoice?: () => void;
  onToggleDarkMode?: () => void;
  isDarkMode?: boolean;
  project?: any;
  grammarProject?: any;
  onSelectScene?: (chapId: any, scId: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onAddScene,
  onAddChapter,
  onOpenFocusMode,
  onOpenExportModal,
  onOpenSettingsModal,
  onOpenSettings,
  onOpenLiveVoice,
  onToggleDarkMode,
  isDarkMode = false,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-manuscript',
      title: 'Open manuscript',
      description: 'Jump to active chapter and scene editor',
      category: 'Manuscript',
      icon: BookOpen,
      shortcut: 'G M',
      action: () => onSelectTab('manuscript'),
    },
    {
      id: 'create-scene',
      title: 'Create scene',
      description: 'Add a new scene to active chapter',
      category: 'Manuscript',
      icon: PlusCircle,
      shortcut: 'N S',
      action: onAddScene,
    },
    {
      id: 'create-chapter',
      title: 'Open chapter',
      description: 'Manage or create a new chapter structure',
      category: 'Manuscript',
      icon: FolderOpen,
      shortcut: 'N C',
      action: onAddChapter,
    },
    {
      id: 'find-character',
      title: 'Find character',
      description: 'Open character dossiers and archetypes',
      category: 'Navigation',
      icon: User,
      action: () => onSelectTab('characters'),
    },
    {
      id: 'open-timeline',
      title: 'Open timeline',
      description: 'Inspect narrative chronology and story time',
      category: 'Navigation',
      icon: Clock,
      action: () => onSelectTab('timeline'),
    },
    {
      id: 'continuity-check',
      title: 'Run continuity check',
      description: 'Audit timeline events, character presence and plot beats',
      category: 'Manuscript',
      icon: ShieldCheck,
      action: () => onSelectTab('plot'),
    },
    {
      id: 'check-human-voice',
      title: 'Check Human Voice',
      description: 'Analyze prose burstiness and style consistency',
      category: 'Manuscript',
      icon: Sparkles,
      action: () => onSelectTab('humanizer'),
    },
    // Curriculum & Assessment
    {
      id: 'create-question',
      title: 'Create question',
      description: 'Author a new grammar question or exercise',
      category: 'Curriculum',
      icon: FileQuestion,
      action: () => onSelectTab('grammar_series'),
    },
    {
      id: 'create-assessment',
      title: 'Create assessment',
      description: 'Build an exam paper or test series module',
      category: 'Curriculum',
      icon: ClipboardCheck,
      action: () => onSelectTab('grammar_series'),
    },
    {
      id: 'audit-blueprint',
      title: 'Audit blueprint',
      description: 'Inspect CBSE / ICSE marks matrix and taxonomy',
      category: 'Curriculum',
      icon: Layers,
      action: () => onSelectTab('board_blueprints'),
    },
    {
      id: 'open-diagrammer',
      title: 'Open diagrammer',
      description: 'Reed-Kellogg and constituent syntax trees',
      category: 'Curriculum',
      icon: Network,
      action: () => onSelectTab('grammar_series'),
    },
    {
      id: 'open-book-planner',
      title: 'Open Book Planner & TOC',
      description: 'Hierarchical unit and chapter planner, page budget and curriculum audit',
      category: 'Curriculum',
      icon: BookMarked,
      action: () => onSelectTab('book_planner'),
    },
    // Publishing & Export
    {
      id: 'export-manuscript',
      title: 'Export manuscript',
      description: 'Download DOCX, Markdown, Text, or JSON archive',
      category: 'Publishing',
      icon: Download,
      action: onOpenExportModal,
    },
    {
      id: 'export-textbook',
      title: 'Export textbook',
      description: 'Open Crown Quarto PDF and print layout compiler',
      category: 'Publishing',
      icon: BookMarked,
      action: () => onSelectTab('textbook_exporter'),
    },
    // Live Voice & System
    {
      id: 'live-voice',
      title: 'Start Live Voice conversation',
      description: 'Low-latency real-time voice with Gemini 3.1 Flash Live',
      category: 'System',
      icon: Mic,
      shortcut: 'V',
      action: onOpenLiveVoice,
    },
    {
      id: 'zen-focus',
      title: 'Open Zen focus mode',
      description: 'Fullscreen distraction-free writing with ambient audio',
      category: 'System',
      icon: Maximize2,
      shortcut: 'F',
      action: onOpenFocusMode,
    },
    {
      id: 'open-settings',
      title: 'Studio Settings & Encryption',
      description: 'Manage project metadata, AES-256 E2EE, snapshots, and cloud sync',
      category: 'System',
      icon: Settings,
      shortcut: ',',
      action: () => (onOpenSettings ? onOpenSettings() : onOpenSettingsModal?.()),
    },
    {
      id: 'toggle-dark-mode',
      title: isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode',
      description: 'Toggle editor visual theme',
      category: 'System',
      icon: isDarkMode ? Sun : Moon,
      action: onToggleDarkMode,
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.description && cmd.description.toLowerCase().includes(q)) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 bg-black/40 dark:bg-black/70 backdrop-blur-xs flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        id="command-palette-dialog"
        className="w-full max-w-xl bg-white dark:bg-[#18191b] border border-[#e8e8e6] dark:border-[#28292d] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#e8e8e6] dark:border-[#28292d]">
          <Search className="w-4 h-4 text-[#6e6e6b] dark:text-[#9ca3af] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace..."
            className="flex-1 bg-transparent text-sm text-[#191918] dark:text-[#f4f4f5] placeholder-[#9c9c98] dark:placeholder-[#6b7280] outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#9c9c98] dark:text-[#6b7280]">
              No commands found matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-[#eef2ff] dark:bg-[#1f2023] text-[#4f46e5] dark:text-[#818cf8]'
                      : 'text-[#191918] dark:text-[#f4f4f5] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#4f46e5] text-white dark:bg-[#6366f1]'
                          : 'bg-[#f5f5f3] dark:bg-[#28292d] text-[#6e6e6b] dark:text-[#9ca3af]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate leading-tight">
                        {cmd.title}
                      </div>
                      {cmd.description && (
                        <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] truncate mt-0.5">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span className="text-[10px] text-[#9c9c98] dark:text-[#6b7280] uppercase tracking-wider font-medium">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#f5f5f3] dark:bg-[#28292d] text-[#6e6e6b] dark:text-[#9ca3af] rounded border border-[#e8e8e6] dark:border-[#383a40]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3 h-3 text-[#4f46e5] dark:text-[#818cf8]" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#fbfbfa] dark:bg-[#121314] border-t border-[#e8e8e6] dark:border-[#28292d] flex items-center justify-between text-[11px] text-[#9c9c98] dark:text-[#6b7280]">
          <div className="flex items-center space-x-3">
            <span><strong className="font-semibold text-[#6e6e6b] dark:text-[#9ca3af]">↑↓</strong> Navigate</span>
            <span><strong className="font-semibold text-[#6e6e6b] dark:text-[#9ca3af]">↵</strong> Select</span>
            <span><strong className="font-semibold text-[#6e6e6b] dark:text-[#9ca3af]">Esc</strong> Close</span>
          </div>
          <span className="font-mono text-[10px]">VERITAS PLATFORM</span>
        </div>
      </div>
    </div>
  );
};
