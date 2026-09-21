import React, { useState } from 'react';
import { X, Users, ArrowUpRight, UserCheck, Heart, Shield, Sparkles } from 'lucide-react';
import { NovelProject, Chapter, Scene, Character } from '../types';

interface CharacterContextDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: NovelProject;
  activeChapter: Chapter;
  activeScene: Scene;
  onNavigateToCharacters?: () => void;
  isDarkMode: boolean;
}

export const CharacterContextDrawer: React.FC<CharacterContextDrawerProps> = ({
  isOpen,
  onClose,
  project,
  activeChapter,
  activeScene,
  onNavigateToCharacters,
  isDarkMode,
}) => {
  // Default selected character to POV character or first character
  const defaultCharId = activeScene?.povCharacterId || project?.characters?.[0]?.id || '';
  const [selectedCharId, setSelectedCharId] = useState<string>(defaultCharId);

  const selectedChar = project?.characters?.find((c) => c.id === selectedCharId) || project?.characters?.[0];

  // Character relationships involving selected character
  const characterRelationships = (project?.characterRelationships || []).filter(
    (rel) => rel.sourceCharacterId === selectedChar?.id || rel.targetCharacterId === selectedChar?.id
  );

  if (!isOpen || !project || !activeScene) return null;

  return (
    <div
      id="character-context-drawer-container"
      className="fixed inset-0 z-40 flex justify-end bg-black/20 dark:bg-black/50 backdrop-blur-2xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="character-context-panel"
        className="w-full max-w-md h-full bg-white dark:bg-[#18191b] border-l border-[#e8e8e6] dark:border-[#28292d] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-5 border-b border-[#e8e8e6] dark:border-[#28292d] flex items-center justify-between bg-[#fbfbfa] dark:bg-[#121314]">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#4f46e5]" />
            <span className="text-xs font-bold text-[#191918] dark:text-[#f4f4f5]">
              Character Context
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6e6e6b] hover:text-[#191918] dark:hover:text-[#f4f4f5] hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Character Selector Horizontal Strip */}
        <div className="px-4 py-2 border-b border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#121314] flex items-center space-x-1.5 overflow-x-auto">
          {project.characters.map((char) => {
            const isSelected = char.id === selectedChar?.id;
            const isPOV = char.id === activeScene.povCharacterId;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0 ${
                  isSelected
                    ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                    : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918] dark:hover:text-[#f4f4f5] hover:bg-[#f0f0ee] dark:hover:bg-[#28292d]'
                }`}
              >
                <span>{char.name}</span>
                {isPOV && <span className="text-[9px] opacity-75 font-mono ml-0.5">(POV)</span>}
              </button>
            );
          })}
        </div>

        {/* Selected Character Context Details */}
        {selectedChar ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Name & Role Header Card */}
            <div className="p-4 rounded-xl bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#191918] dark:text-[#f4f4f5] font-serif">
                    {selectedChar.name}
                  </h3>
                  {selectedChar.alias && (
                    <div className="text-[11px] text-[#9c9c98] italic">
                      a.k.a. {selectedChar.alias}
                    </div>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#eef2ff] dark:bg-[#1e1b4b]/60 text-[#4f46e5] dark:text-[#c7d2fe]">
                  {selectedChar.role}
                </span>
              </div>

              <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] flex items-center space-x-2 font-mono pt-1">
                <span>Archetype: {selectedChar.archetype || 'Classic'}</span>
                <span>&bull;</span>
                <span>Active in Ch {activeChapter.number}</span>
              </div>
            </div>

            {/* Voice & Cadence Rules */}
            <div className="p-3 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#18191b] space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#4f46e5]" />
                <span>Dialogue Cadence &amp; Voice</span>
              </div>
              <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                {selectedChar.voiceNotes || 'Reserved · Analytical · Speaks in complete sentences, rarely relies on colloquial slang.'}
              </p>
            </div>

            {/* Motivation & Core Goal */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">
                Internal Motivation &amp; Goal
              </div>
              <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed p-2.5 rounded-lg bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d]">
                {selectedChar.internalGoal || 'Desires to uncover the hidden truth without compromising family honor.'}
              </p>
            </div>

            {/* External Conflict & Flaw */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">
                Conflict &amp; Fatal Flaw
              </div>
              <div className="p-2.5 rounded-lg bg-[#fbfbfa] dark:bg-[#121314] border border-[#e8e8e6] dark:border-[#28292d] space-y-1">
                <div className="text-[11px] text-[#191918] dark:text-[#f4f4f5]">
                  <span className="text-[#9c9c98]">Conflict: </span>
                  {selectedChar.externalConflict || 'The institutional bureaucracy of the harbor authority.'}
                </div>
                <div className="text-[11px] text-[#191918] dark:text-[#f4f4f5]">
                  <span className="text-[#9c9c98]">Flaw: </span>
                  {selectedChar.flaw || 'Paralyzing skepticism when confronted with emotional vulnerability.'}
                </div>
              </div>
            </div>

            {/* Relationships in this scene */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">
                Narrative Relationships
              </div>
              {characterRelationships.length > 0 ? (
                <div className="space-y-1.5">
                  {characterRelationships.map((rel) => {
                    const otherCharId =
                      rel.sourceCharacterId === selectedChar.id
                        ? rel.targetCharacterId
                        : rel.sourceCharacterId;
                    const otherChar = project.characters.find((c) => c.id === otherCharId);
                    return (
                      <div
                        key={rel.id}
                        className="p-2 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#121314] flex items-center justify-between"
                      >
                        <div className="font-medium text-[#191918] dark:text-[#f4f4f5]">
                          {otherChar?.name || 'Unknown'}
                        </div>
                        <span className="text-[10px] text-[#6e6e6b] dark:text-[#9ca3af] font-mono">
                          {rel.relationshipType} ({rel.dynamics})
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-[#9c9c98] italic">
                  No explicit cross-character tension links recorded yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-[#9c9c98]">
            No characters available in this project.
          </div>
        )}

        {/* Footer with full dossier jump */}
        <div className="p-3 border-t border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#121314] flex items-center justify-between">
          <span className="text-[10px] text-[#9c9c98]">
            {project.characters.length} characters in roster
          </span>
          {onNavigateToCharacters && (
            <button
              onClick={() => {
                onClose();
                onNavigateToCharacters();
              }}
              className="text-xs font-medium text-[#4f46e5] dark:text-[#818cf8] hover:underline flex items-center space-x-1"
            >
              <span>Open Character Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
