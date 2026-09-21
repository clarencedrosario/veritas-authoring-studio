import React from 'react';
import { X, User, MapPin, Clock, Target, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { NovelProject, Chapter, Scene, Character } from '../types';

interface SceneDossierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: NovelProject;
  activeChapter: Chapter;
  activeScene: Scene;
  onUpdateSceneMeta: (updates: Partial<Scene>) => void;
  isDarkMode: boolean;
}

export const SceneDossierDrawer: React.FC<SceneDossierDrawerProps> = ({
  isOpen,
  onClose,
  project,
  activeChapter,
  activeScene,
  onUpdateSceneMeta,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const currentPOV = project.characters.find((c) => c.id === activeScene.povCharacterId);
  const selectedCharacterIds = activeScene.characterIds || [];

  const toggleCharacterPresence = (charId: string) => {
    const exists = selectedCharacterIds.includes(charId);
    const updated = exists
      ? selectedCharacterIds.filter((id) => id !== charId)
      : [...selectedCharacterIds, charId];
    onUpdateSceneMeta({ characterIds: updated });
  };

  return (
    <div
      id="scene-dossier-drawer-container"
      className="fixed inset-0 z-40 flex justify-end bg-black/20 dark:bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="scene-dossier-panel"
        className="w-full max-w-md h-full bg-white dark:bg-[#18191b] border-l border-[#e8e8e6] dark:border-[#28292d] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-5 border-b border-[#e8e8e6] dark:border-[#28292d] flex items-center justify-between bg-[#fbfbfa] dark:bg-[#121314]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">Contextual Dossier</span>
            <div className="text-xs font-bold text-[#191918] dark:text-[#f4f4f5]">
              Chapter {activeChapter.number} &middot; {activeScene.title || 'Untitled Scene'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6e6e6b] hover:text-[#191918] dark:hover:text-[#f4f4f5] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] transition-colors"
            title="Close Dossier (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Scene Title */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1">
              Scene Heading
            </label>
            <input
              type="text"
              value={activeScene.title || ''}
              onChange={(e) => onUpdateSceneMeta({ title: e.target.value })}
              placeholder="e.g. Confrontation on the Mooring..."
              className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs font-medium text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5] transition-colors"
            />
          </div>

          {/* Status & POV in 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1">
                Scene Status
              </label>
              <select
                value={activeScene.status}
                onChange={(e) => onUpdateSceneMeta({ status: e.target.value as any })}
                className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-2.5 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5]"
              >
                <option value="Draft">Draft</option>
                <option value="In Revision">In Revision</option>
                <option value="Final">Final Polish</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1 flex items-center space-x-1">
                <User className="w-3 h-3 text-[#4f46e5]" />
                <span>POV Character</span>
              </label>
              <select
                value={activeScene.povCharacterId || ''}
                onChange={(e) => onUpdateSceneMeta({ povCharacterId: e.target.value })}
                className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-2.5 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5]"
              >
                <option value="">-- Third Person Objective --</option>
                {project.characters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name} ({char.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* POV Quick Voice Cue */}
          {currentPOV && (
            <div className="p-2.5 rounded-lg bg-[#f5f5f3] dark:bg-[#1f2023] border border-[#e8e8e6] dark:border-[#28292d] space-y-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#191918] dark:text-[#f4f4f5]">
                <span>POV Voice: {currentPOV.name}</span>
                <span className="text-[10px] text-[#4f46e5] font-mono">{currentPOV.role}</span>
              </div>
              <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] italic">
                &ldquo;{currentPOV.voiceNotes || 'Analytical, measured cadence, avoids informal idioms.'}&rdquo;
              </p>
            </div>
          )}

          {/* Scene Goal */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1 flex items-center space-x-1">
              <Target className="w-3 h-3 text-emerald-600" />
              <span>Scene Goal</span>
            </label>
            <textarea
              rows={2}
              value={activeScene.sceneGoal || ''}
              onChange={(e) => onUpdateSceneMeta({ sceneGoal: e.target.value })}
              placeholder="What does the protagonist enter the scene intending to accomplish?"
              className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5] resize-none"
            />
          </div>

          {/* Conflict & Obstacle */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span>Conflict &amp; Obstacle</span>
            </label>
            <textarea
              rows={2}
              value={activeScene.conflict || ''}
              onChange={(e) => onUpdateSceneMeta({ conflict: e.target.value })}
              placeholder="What unexpected resistance, secrets, or danger stands in the way?"
              className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5] resize-none"
            />
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#6e6e6b]" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={activeScene.location || ''}
                onChange={(e) => onUpdateSceneMeta({ location: e.target.value })}
                placeholder="e.g. Blackwater Head Cliffhouse"
                className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#6e6e6b]" />
                <span>Time / Chronology</span>
              </label>
              <input
                type="text"
                value={activeScene.timePeriod || ''}
                onChange={(e) => onUpdateSceneMeta({ timePeriod: e.target.value })}
                placeholder="e.g. Day 1, Late Dusk"
                className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5]"
              />
            </div>
          </div>

          {/* Characters Present in Scene */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1.5">
              Characters Present in Scene
            </label>
            <div className="flex flex-wrap gap-1.5">
              {project.characters.map((char) => {
                const isSelected = selectedCharacterIds.includes(char.id) || char.id === activeScene.povCharacterId;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => toggleCharacterPresence(char.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                        : 'bg-[#f5f5f3] dark:bg-[#28292d] text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918] dark:hover:text-[#f4f4f5]'
                    }`}
                  >
                    <span>{char.name}</span>
                    {char.id === activeScene.povCharacterId && (
                      <span className="text-[9px] opacity-70 ml-1">(POV)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outcome & Narrative Hook */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1">
              Outcome &amp; Turning Point
            </label>
            <textarea
              rows={2}
              value={activeScene.outcome || ''}
              onChange={(e) => onUpdateSceneMeta({ outcome: e.target.value })}
              placeholder="What shifts irreversibly by the scene's end?"
              className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5] resize-none"
            />
          </div>

          {/* Author Notes */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1">
              Scene Scratchpad / Editorial Notes
            </label>
            <textarea
              rows={2}
              value={activeScene.notes || ''}
              onChange={(e) => onUpdateSceneMeta({ notes: e.target.value })}
              placeholder="Unresolved sensory details, research questions, or future chapter links..."
              className="w-full bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] rounded-lg px-3 py-2 text-xs text-[#191918] dark:text-[#f4f4f5] outline-none focus:border-[#4f46e5] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#121314] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918] text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
