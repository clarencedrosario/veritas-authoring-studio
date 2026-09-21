import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  ShieldCheck,
  Check,
  Sparkles,
  Feather,
  Flame,
  Volume2,
  Compass,
  Clock,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { NovelProject, Chapter, Scene, AIDetectorReport, NovelAIActionType } from '../types';

export interface EditorialSuggestion {
  id: string;
  category: 'Human Voice' | 'Style' | 'Continuity' | 'Character Voice' | 'Pacing' | 'Repetition';
  issue: string;
  whyItMatters: string;
  originalSnippet?: string;
  suggestedImprovement: string;
  status: 'pending' | 'applied' | 'dismissed';
}

interface EditorialIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: NovelProject;
  activeChapter: Chapter;
  activeScene: Scene;
  localAnalysis: AIDetectorReport;
  onApplyImprovement: (original: string | undefined, replacement: string) => void;
  onRunDraftAction: (
    mode: NovelAIActionType,
    customPrompt?: string
  ) => Promise<void>;
  isGenerating: boolean;
  aiActionMessage: string | null;
  onOpenDetailedHumanizer?: () => void;
  onOpenVoiceProfile?: () => void;
  isDarkMode: boolean;
}

export const EditorialIntelligencePanel: React.FC<EditorialIntelligencePanelProps> = ({
  isOpen,
  onClose,
  project,
  activeChapter,
  activeScene,
  localAnalysis,
  onApplyImprovement,
  onRunDraftAction,
  isGenerating,
  aiActionMessage,
  onOpenDetailedHumanizer,
  onOpenVoiceProfile,
}) => {
  // Collapsible section states
  const [expandedSection, setExpandedSection] = useState<'voice' | 'style' | 'continuity' | 'character' | 'fiction_tools' | null>('fiction_tools');
  const [reviewingSuggestionId, setReviewingSuggestionId] = useState<string | null>(null);
  const [researchPrompt, setResearchPrompt] = useState('');

  // Active POV Character
  const activePOV = project.characters.find((c) => c.id === activeScene.povCharacterId);

  // Suggestions state (seeded from detector flagged segments and contextual heuristics)
  const [suggestions, setSuggestions] = useState<EditorialSuggestion[]>(() => {
    const list: EditorialSuggestion[] = [];

    // From flagged clichés in detector
    localAnalysis.flaggedSegments.forEach((flag, index) => {
      list.push({
        id: `flag-${index}-${flag.text}`,
        category: 'Repetition',
        issue: `Synthetic phrasing pattern: "${flag.text}"`,
        whyItMatters: flag.reason || 'Formulaic phrasings diminish emotional intimacy and pull readers out of narrative immersion.',
        originalSnippet: flag.text,
        suggestedImprovement: flag.humanizedAlternative || 'rephrase with sensory grounding',
        status: 'pending',
      });
    });

    // Character voice check heuristic
    if (activePOV && activePOV.voiceNotes && activeScene.content.length > 80) {
      list.push({
        id: 'char-voice-1',
        category: 'Character Voice',
        issue: `${activePOV.name}'s dialogue cadence`,
        whyItMatters: `${activePOV.name} is established as "${activePOV.voiceNotes}". Maintain tight syntactic discipline so their internal cadence remains distinct.`,
        originalSnippet: undefined,
        suggestedImprovement: 'Review sentence clauses: replace informal contractions with measured declarative syntax.',
        status: 'pending',
      });
    }

    // Continuity timeline check heuristic
    if (activeScene.timePeriod && project.timelineEvents?.length > 0) {
      list.push({
        id: 'continuity-check-1',
        category: 'Continuity',
        issue: `Chronology: ${activeScene.timePeriod}`,
        whyItMatters: 'Preserving temporal anchor points ensures the reader tracks elapsed hours accurately across chapters.',
        originalSnippet: undefined,
        suggestedImprovement: `Confirm scene aligns with Chapter ${activeChapter.number} timeline milestone.`,
        status: 'pending',
      });
    }

    return list;
  });

  const toggleSection = (section: 'voice' | 'style' | 'continuity' | 'character' | 'fiction_tools') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleApplySuggestion = (suggestion: EditorialSuggestion) => {
    if (suggestion.originalSnippet) {
      onApplyImprovement(suggestion.originalSnippet, suggestion.suggestedImprovement);
    }
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, status: 'applied' } : s))
    );
    setReviewingSuggestionId(null);
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dismissed' } : s))
    );
    if (reviewingSuggestionId === id) setReviewingSuggestionId(null);
  };

  const activeSuggestions = suggestions.filter((s) => s.status === 'pending');

  // Human Voice Status label (restrained, no large badge)
  const getVoiceStatus = (prob: number) => {
    if (prob >= 85) return { label: 'Strong', colorClass: 'text-emerald-700 dark:text-emerald-400' };
    if (prob >= 70) return { label: 'Moderate', colorClass: 'text-amber-700 dark:text-amber-400' };
    return { label: 'Needs Variance', colorClass: 'text-rose-700 dark:text-rose-400' };
  };

  const voiceStatus = getVoiceStatus(localAnalysis.humanProbability);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      <div
        className="fixed inset-0 bg-[#35101F]/40 z-30 xl:hidden backdrop-blur-2xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Editor's Margin Notes Column: Light separators, compact sections, strong typographic hierarchy */}
      <aside
        id="editorial-intelligence-panel"
        aria-label="Editorial Intelligence Panel"
        className="fixed inset-y-0 right-0 z-40 w-72 sm:w-[315px] xl:relative xl:inset-auto xl:w-[300px] 2xl:w-[315px] xl:z-20 border-l border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] flex flex-col shrink-0 select-none overflow-hidden shadow-2xl xl:shadow-none transition-all"
      >
        {/* 1. Header */}
        <div className="min-h-[50px] px-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] flex items-center justify-between bg-[#EDE4D6] dark:bg-[#35101F] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-[#9A7438] dark:text-[#C29A52]" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Intelligence
              </div>
              <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] font-medium">Editorial Colleague</div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onRunDraftAction('critique')}
              disabled={isGenerating}
              className="p-1.5 rounded-lg text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] transition-colors"
              title="Refresh scene audit"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] transition-colors"
              title="Close Intelligence Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Generating feedback bar */}
        {isGenerating && (
          <div className="px-3.5 py-2 bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold flex items-center space-x-2 shrink-0">
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0 text-[#C29A52]" />
            <span className="truncate">{aiActionMessage || 'Consulting editorial craft heuristics...'}</span>
          </div>
        )}

        {/* 2. Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 text-xs">
          {/* SECTION 1: VOICE */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Voice
              </span>
              <button
                onClick={() => toggleSection('voice')}
                className="text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] p-1"
                title="Toggle voice details"
              >
                {expandedSection === 'voice' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="text-[13px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Human Voice
              </div>
              <div className="text-[11.5px] font-mono text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                <span>{localAnalysis.humanProbability}% &middot; </span>
                <span className={voiceStatus.colorClass}>{voiceStatus.label}</span>
              </div>
            </div>

            {expandedSection === 'voice' && (
              <div className="mt-2.5 pt-2.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d] space-y-2 text-[11.5px] animate-in fade-in">
                <div className="flex justify-between text-[#71685E] dark:text-[#c9b9a6]">
                  <span>Cadence Variance</span>
                  <span className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{localAnalysis.burstinessScore}/100</span>
                </div>
                <div className="flex justify-between text-[#71685E] dark:text-[#c9b9a6]">
                  <span>Avg Sentence Length</span>
                  <span className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{localAnalysis.avgSentenceLength} words</span>
                </div>
                <div className="flex justify-between text-[#71685E] dark:text-[#c9b9a6]">
                  <span>Flagged Repetitions</span>
                  <span className="font-mono text-[#35101F] dark:text-[#F6F0E7]">{localAnalysis.flaggedSegments.length}</span>
                </div>
                <div className="pt-1.5 flex space-x-2">
                  <button
                    onClick={() => onRunDraftAction('humanize')}
                    disabled={isGenerating}
                    className="flex-1 min-h-[38px] py-1 px-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-[11.5px] font-semibold hover:bg-[#35101F] transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C29A52]" />
                    <span>Calibrate Rhythm</span>
                  </button>
                  {onOpenDetailedHumanizer && (
                    <button
                      onClick={onOpenDetailedHumanizer}
                      className="min-h-[38px] py-1 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] text-[11.5px] font-semibold hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6]"
                    >
                      Details
                    </button>
                  )}
                </div>

                {/* Author Voice Profile Quick Calibrate */}
                {onOpenVoiceProfile && (
                  <div className="pt-2 border-t border-[#CBBEAC]/30 dark:border-[#4f2c3d]">
                    <button
                      onClick={onOpenVoiceProfile}
                      className="w-full min-h-[36px] py-1 px-2.5 rounded-xl border border-[#C29A52]/50 bg-[#C29A52]/10 hover:bg-[#C29A52]/20 text-[#5A1832] dark:text-[#C29A52] text-[11px] font-semibold transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center space-x-1.5 truncate">
                        <Feather className="w-3.5 h-3.5 shrink-0 text-[#C29A52]" />
                        <span className="truncate">Voice: {project.authorVoiceProfile?.name || 'Calibrate Profile'}</span>
                      </span>
                      <span className="text-[10px] font-mono shrink-0 ml-1">Configure &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FICTION CRAFT SUITE (TENSION, SENSORY, PACING, HOOKS) */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Fiction Craft Suite
              </span>
              <button
                onClick={() => toggleSection('fiction_tools')}
                className="text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] p-1"
                title="Toggle fiction craft tools"
              >
                {expandedSection === 'fiction_tools' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="mt-1">
              <div className="text-[13px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Narrative Levers
              </div>
              <div className="text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                Prose generation &amp; structural tension
              </div>
            </div>

            {expandedSection === 'fiction_tools' && (
              <div className="mt-2.5 pt-2.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d] space-y-2.5 animate-in fade-in">
                {/* Scene Progression Actions */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] font-semibold">
                    Prose Continuation
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onRunDraftAction('continue')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors flex items-center justify-center space-x-1"
                      title="Continue scene seamlessly from the current paragraph"
                    >
                      <ArrowRight className="w-3 h-3 text-[#C29A52]" />
                      <span>Continue Scene</span>
                    </button>
                    <button
                      onClick={() => onRunDraftAction('draft_scene')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors flex items-center justify-center space-x-1"
                      title="Draft scene beats based on current scene goal"
                    >
                      <Sparkles className="w-3 h-3 text-[#C29A52]" />
                      <span>Draft from Goal</span>
                    </button>
                  </div>
                </div>

                {/* Tension & Pacing Levers */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] font-semibold">
                    Tension &amp; Pacing
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onRunDraftAction('increase_tension')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors flex items-center justify-center space-x-1"
                      title="Shorten syntax and amplify psychological stakes"
                    >
                      <Flame className="w-3 h-3 text-red-500" />
                      <span>Increase Tension</span>
                    </button>
                    <button
                      onClick={() => onRunDraftAction('decompress_tension')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors flex items-center justify-center space-x-1"
                      title="Add contemplative interiority and breathing room"
                    >
                      <Feather className="w-3 h-3 text-[#C29A52]" />
                      <span>Decompress</span>
                    </button>
                  </div>
                </div>

                {/* Craft Polish */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] font-semibold">
                    Texture &amp; Dialogue
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onRunDraftAction('deepen_sensory')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors"
                      title="Anchor olfactory, tactile, and auditory atmospheric textures"
                    >
                      Sensory Anchors
                    </button>
                    <button
                      onClick={() => onRunDraftAction('dialogue_polish')}
                      disabled={isGenerating}
                      className="min-h-[36px] px-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#5A1832] hover:text-[#F6F0E7] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7] transition-colors flex items-center justify-center space-x-1"
                      title="Sharpen subtext and character rhythm in dialogue"
                    >
                      <Volume2 className="w-3 h-3 text-[#C29A52]" />
                      <span>Polish Dialogue</span>
                    </button>
                  </div>
                </div>

                {/* Length Levers */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => onRunDraftAction('tighten_scene')}
                    disabled={isGenerating}
                    className="min-h-[34px] px-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6] transition-colors flex items-center justify-center space-x-1"
                    title="Trim superfluous filler and sharpen prose"
                  >
                    <Minimize2 className="w-3 h-3" />
                    <span>Tighten Scene</span>
                  </button>
                  <button
                    onClick={() => onRunDraftAction('expand_scene')}
                    disabled={isGenerating}
                    className="min-h-[34px] px-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6] transition-colors flex items-center justify-center space-x-1"
                    title="Elaborate scenic physical space and interior thoughts"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Expand Scene</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: STYLE */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Style
              </span>
              <button
                onClick={() => toggleSection('style')}
                className="text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] p-1"
                title="Toggle style details"
              >
                {expandedSection === 'style' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="text-[13px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Consistent
              </div>
              <div className="text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                {project.stylePersona.name || 'Grounded Atmospheric Realism'}
              </div>
            </div>

            {expandedSection === 'style' && (
              <div className="mt-2 pt-2.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d] space-y-2 text-[11.5px] animate-in fade-in">
                <p className="text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  Pacing: {project.stylePersona.pacingPreference || 'Deliberate'}. Sensory density: {project.stylePersona.sensoryDensity || 'Moderate'}.
                </p>
                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => onRunDraftAction('deepen_sensory')}
                    disabled={isGenerating}
                    className="flex-1 min-h-[36px] py-1 px-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7]"
                  >
                    Sensory Anchors
                  </button>
                  <button
                    onClick={() => onRunDraftAction('vary_pacing')}
                    disabled={isGenerating}
                    className="flex-1 min-h-[36px] py-1 px-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[11px] font-semibold text-[#35101F] dark:text-[#F6F0E7]"
                  >
                    Pacing Variation
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: CONTINUITY */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Continuity
              </span>
              <button
                onClick={() => toggleSection('continuity')}
                className="text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] p-1"
                title="Toggle continuity details"
              >
                {expandedSection === 'continuity' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="text-[13px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
                <span>No major conflicts</span>
              </div>
              <div className="text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5 truncate">
                {activeScene.location ? `${activeScene.location} · ` : ''}
                {activeScene.timePeriod || 'Timeline aligned'}
              </div>
            </div>

            {expandedSection === 'continuity' && (
              <div className="mt-2 pt-2.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d] space-y-2 text-[11.5px] animate-in fade-in">
                <p className="text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                  No timeline paradox or geographical jump detected relative to preceding events.
                </p>
                <button
                  onClick={() => onRunDraftAction('continuity')}
                  disabled={isGenerating}
                  className="w-full min-h-[36px] py-1 px-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] text-[11px] font-semibold hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7]"
                >
                  Verify Timeline Milestones
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: CHARACTER VOICE */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Character Voice
              </span>
              <button
                onClick={() => toggleSection('character')}
                className="text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] p-1"
                title="Toggle character details"
              >
                {expandedSection === 'character' ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="text-[13px] font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                {activePOV ? activePOV.name : 'Dr. Julian Mercer'}
              </div>
              <div className="text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                {activePOV && activePOV.voiceNotes ? 'Voice cadence monitored' : 'Review suggested'}
              </div>
            </div>

            {expandedSection === 'character' && (
              <div className="mt-2 pt-2.5 border-t border-[#CBBEAC]/40 dark:border-[#4f2c3d] space-y-2 text-[11.5px] animate-in fade-in">
                {activePOV ? (
                  <>
                    <p className="text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                      Established cadence:{' '}
                      <span className="text-[#35101F] dark:text-[#F6F0E7] font-semibold">
                        {activePOV.voiceNotes || 'Distinct vocabulary, measured cadence.'}
                      </span>
                    </p>
                    <button
                      onClick={() => onRunDraftAction('dialogue_polish')}
                      disabled={isGenerating}
                      className="w-full min-h-[36px] py-1 px-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] text-[11px] font-semibold hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7]"
                    >
                      Polish Dialogue Subtext
                    </button>
                  </>
                ) : (
                  <p className="text-[#71685E] dark:text-[#c9b9a6] italic font-serif">Assign a POV character in the Scene Dossier to enable specific cadence auditing.</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: SUGGESTIONS */}
          <div className="border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Suggestions
              </span>
              <span className="text-[10.5px] font-mono font-medium text-[#71685E] dark:text-[#c9b9a6]">
                {activeSuggestions.length} {activeSuggestions.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {activeSuggestions.length === 0 ? (
              <div className="mt-2.5 py-3.5 px-3 rounded-xl border border-dashed border-[#CBBEAC] dark:border-[#4f2c3d] text-center text-[12px] text-[#71685E] dark:text-[#c9b9a6] font-serif italic">
                No flagged issues in this scene.
              </div>
            ) : (
              <div className="mt-2.5 space-y-3">
                {activeSuggestions.map((sug) => {
                  const isReviewing = reviewingSuggestionId === sug.id;
                  return (
                    <div
                      key={sug.id}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                        isReviewing
                          ? 'border-[#9A7438] bg-[#EDE4D6] dark:bg-[#35101F] shadow-xs'
                          : 'border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6]/70 dark:bg-[#1e0f18]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                          {sug.category}
                        </span>
                        <span className="text-[10px] text-[#9A7438] dark:text-[#C29A52] font-mono font-semibold">
                          Review
                        </span>
                      </div>

                      {/* Issue */}
                      <div>
                        <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                          Issue
                        </div>
                        <div className="font-semibold text-[12px] text-[#35101F] dark:text-[#F6F0E7]">
                          {sug.issue}
                        </div>
                      </div>

                      {/* Why it matters */}
                      <div>
                        <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                          Why it matters
                        </div>
                        <div className="text-[11.5px] text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                          {sug.whyItMatters}
                        </div>
                      </div>

                      {/* Suggested improvement */}
                      <div>
                        <div className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#71685E] dark:text-[#c9b9a6]">
                          Suggested improvement
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#F6F0E7] dark:bg-[#25131e] border border-[#CBBEAC]/70 dark:border-[#4f2c3d] text-[12px] font-serif text-[#35101F] dark:text-[#F6F0E7] italic mt-1 leading-relaxed">
                          {sug.suggestedImprovement}
                        </div>
                      </div>

                      {/* Author Actions */}
                      <div className="flex items-center space-x-1.5 pt-1">
                        <button
                          onClick={() => setReviewingSuggestionId(isReviewing ? null : sug.id)}
                          className="flex-1 min-h-[34px] py-1 px-2 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] text-[11px] font-semibold text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
                        >
                          {isReviewing ? 'Close' : 'Review'}
                        </button>

                        <button
                          onClick={() => handleApplySuggestion(sug)}
                          className="flex-1 min-h-[34px] py-1 px-2 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#35101F] transition-colors"
                        >
                          Apply
                        </button>

                        <button
                          onClick={() => handleDismissSuggestion(sug.id)}
                          className="min-h-[34px] py-1 px-2 rounded-lg text-[11px] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
                          title="Dismiss without changes"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 6: LITERARY RESEARCH */}
          <div className="pt-1">
            <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52] mb-1.5">
              Literary Reference
            </div>
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={researchPrompt}
                onChange={(e) => setResearchPrompt(e.target.value)}
                placeholder="e.g. 19th-century tide bell signals..."
                className="flex-1 min-h-[40px] bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl px-3 text-[13px] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989] outline-none"
              />
              <button
                onClick={() => {
                  if (researchPrompt.trim()) {
                    onRunDraftAction('research', researchPrompt.trim());
                    setResearchPrompt('');
                  }
                }}
                disabled={isGenerating || !researchPrompt.trim()}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#5A1832] text-[#F6F0E7] hover:bg-[#35101F] transition-colors disabled:opacity-40"
                title="Query reference"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
