import React, { useState } from 'react';
import {
  Feather,
  Sparkles,
  Users,
  Compass,
  Clock,
  GitBranch,
  BookOpen,
  Maximize2,
  Sliders,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { NovelProject, Chapter, Scene, AuthorVoiceProfile } from '../types';
import { EditorView } from './EditorView';
import { AuthorVoiceProfileModal } from './AuthorVoiceProfileModal';

interface NovelWritingStudioProps {
  project: NovelProject;
  activeChapter: Chapter;
  activeScene: Scene;
  onUpdateSceneContent: (newContent: string) => void;
  onUpdateSceneMeta: (updates: Partial<Scene>) => void;
  onUpdateProject: (updates: Partial<NovelProject>) => void;
  onOpenFocusMode: () => void;
  onOpenHumanizerPanel: () => void;
  onNavigateToTab: (tab: any) => void;
  isDarkMode: boolean;
  onAddComment: (commentText: string, quote?: string) => void;
}

export const NovelWritingStudio: React.FC<NovelWritingStudioProps> = ({
  project,
  activeChapter,
  activeScene,
  onUpdateSceneContent,
  onUpdateSceneMeta,
  onUpdateProject,
  onOpenFocusMode,
  onOpenHumanizerPanel,
  onNavigateToTab,
  isDarkMode,
  onAddComment,
}) => {
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleSaveVoiceProfile = (profile: AuthorVoiceProfile) => {
    onUpdateProject({
      authorVoiceProfile: profile,
    });
  };

  const voiceProfile = project.authorVoiceProfile;

  return (
    <div id="novel-writing-studio-container" className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Studio Top Context Strip: Fiction Architecture Navigation & Voice Persona */}
      <div
        id="novel-studio-subnav"
        className="min-h-[44px] px-4 sm:px-6 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between z-10 shrink-0 select-none"
      >
        {/* Left: Quick Fiction View Switchers */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
          <button
            onClick={() => onNavigateToTab('manuscript')}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#5A1832] text-[#F6F0E7] shadow-xs flex items-center space-x-1.5"
          >
            <Feather className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Manuscript</span>
          </button>

          <button
            onClick={() => onNavigateToTab('characters')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors flex items-center space-x-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Characters</span>
          </button>

          <button
            onClick={() => onNavigateToTab('plot')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors flex items-center space-x-1.5"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plot &amp; Arcs</span>
          </button>

          <button
            onClick={() => onNavigateToTab('codex')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors flex items-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Codex</span>
          </button>

          <button
            onClick={() => onNavigateToTab('timeline')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors flex items-center space-x-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
        </div>

        {/* Right: Author Voice Calibration Button & Focus Mode */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            id="btn-open-author-voice-profile"
            onClick={() => setShowVoiceModal(true)}
            className="px-3 py-1 rounded-lg text-xs font-medium border border-[#C29A52]/50 bg-[#F6F0E7] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] hover:bg-[#C29A52]/10 transition-colors flex items-center space-x-1.5 shadow-2xs"
            title="Calibrate author voice fingerprint, archetypes, rhythm, and anti-cliché directives"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C29A52]" />
            <span className="truncate max-w-[130px] sm:max-w-none">
              Voice: {voiceProfile?.name || 'Uncalibrated'}
            </span>
          </button>

          <button
            onClick={onOpenFocusMode}
            className="p-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] dark:text-[#D8CCBC] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 transition-colors"
            title="Enter fullscreen focus mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Manuscript Canvas */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <EditorView
          project={project}
          activeChapter={activeChapter}
          activeScene={activeScene}
          onUpdateSceneContent={onUpdateSceneContent}
          onUpdateSceneMeta={onUpdateSceneMeta}
          onOpenFocusMode={onOpenFocusMode}
          onOpenHumanizerPanel={onOpenHumanizerPanel}
          onOpenVoiceProfile={() => setShowVoiceModal(true)}
          isDarkMode={isDarkMode}
          onAddComment={onAddComment}
          onNavigateToCharacters={() => onNavigateToTab('characters')}
        />
      </div>

      {/* Author Voice Profile Calibration Modal */}
      {showVoiceModal && (
        <AuthorVoiceProfileModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          project={project}
          onSaveVoiceProfile={handleSaveVoiceProfile}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
