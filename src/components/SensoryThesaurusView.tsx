import React, { useState } from 'react';
import {
  Eye,
  Volume2,
  Wind,
  Hand,
  Coffee,
  HeartPulse,
  Sparkles,
  Search,
  Copy,
  Check,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { NovelProject, EmotionThesaurusEntry } from '../types';
import { EMOTION_THESAURUS_ENTRIES } from '../data/emotionThesaurusData';

interface SensoryThesaurusViewProps {
  project: NovelProject;
  isDarkMode: boolean;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
}

const SENSORY_CHANNELS = [
  { id: 'sight', label: 'Sight / Light / Shadow', icon: Eye, color: 'text-sky-600 dark:text-sky-400' },
  { id: 'sound', label: 'Sound / Acoustics / Silence', icon: Volume2, color: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'smell', label: 'Smell / Atmosphere / Chemical', icon: Wind, color: 'text-teal-600 dark:text-teal-400' },
  { id: 'touch', label: 'Touch / Texture / Temp', icon: Hand, color: 'text-amber-600 dark:text-amber-400' },
  { id: 'taste', label: 'Taste / Ingested Sensation', icon: Coffee, color: 'text-orange-600 dark:text-orange-400' },
  { id: 'visceral', label: 'Visceral Internal / Pulse', icon: HeartPulse, color: 'text-rose-600 dark:text-rose-400' },
];

export const SensoryThesaurusView: React.FC<SensoryThesaurusViewProps> = ({
  project,
  isDarkMode,
  onNavigateToScene,
}) => {
  const chapters = project.chapters || [];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || '');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    chapters[0]?.scenes[0]?.id || ''
  );
  const [activeSensoryCategory, setActiveSensoryCategory] = useState<string>('all');
  const [searchThesaurus, setSearchThesaurus] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const selectedScene =
    selectedChapter?.scenes.find((s) => s.id === selectedSceneId) || selectedChapter?.scenes[0];

  const currentSceneText = selectedScene?.content || '';

  // Filter emotion thesaurus
  const filteredThesaurus = EMOTION_THESAURUS_ENTRIES.filter((entry) => {
    const matchesSearch =
      entry.emotion.toLowerCase().includes(searchThesaurus.toLowerCase()) ||
      entry.physicalSensations.some((s) => s.toLowerCase().includes(searchThesaurus.toLowerCase())) ||
      entry.mentalProcessing.some((m) => m.toLowerCase().includes(searchThesaurus.toLowerCase()));
    return matchesSearch;
  });

  const [activeThesaurusIndex, setActiveThesaurusIndex] = useState(0);
  const activeEntry = filteredThesaurus[activeThesaurusIndex] || filteredThesaurus[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateVisceralAlternative = async () => {
    setIsGenerating(true);
    setAiSuggestion(null);
    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'continue',
          prompt: `You are an elite literary stylist for novel "${project.title}" (${project.genre}).
Setting: Coastal north, stone architecture, tide and fog.
Analyze this excerpt from Scene "${selectedScene?.title}":
"${currentSceneText.slice(0, 1000)}"

Identify the most under-described moment and generate 2 concrete, visceral alternative descriptions grounded in sensory specifics (acoustics, drafts, cold lime mortar, sea-salt tang, tactile weight). Do not use purple prose or clichés. Format clearly as:
UNDER-DESCRIBED MOMENT: ...
WHY IT MATTERS: ...
GROUNDED VISCERAL REVISION: ...`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setAiSuggestion(data.result);
      }
    } catch (e) {
      console.warn('Sensory suggestion error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="sensory-thesaurus-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Workspace Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Sensory Engagement &amp; Show Don't Tell
          </h1>
        </div>

        {/* Scene Selection Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#9c9c98] text-[11px] font-mono">Auditing Scene:</span>
          <select
            value={selectedChapterId}
            onChange={(e) => {
              setSelectedChapterId(e.target.value);
              const chap = chapters.find((c) => c.id === e.target.value);
              if (chap && chap.scenes[0]) setSelectedSceneId(chap.scenes[0].id);
            }}
            className="py-1 px-2.5 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] font-medium"
          >
            {chapters.map((chap) => (
              <option key={chap.id} value={chap.id}>
                Ch. {chap.number}: {chap.title}
              </option>
            ))}
          </select>

          {selectedChapter && selectedChapter.scenes.length > 1 && (
            <select
              value={selectedSceneId}
              onChange={(e) => setSelectedSceneId(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5]"
            >
              {selectedChapter.scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleGenerateVisceralAlternative}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Analyze Sensory Density</span>
          </button>
        </div>
      </header>

      {/* Two-Pane Contextual Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Scene Prose Context & Sensory Engagement Analysis */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#e8e8e6] dark:border-[#28292d]">
            <div>
              <h2 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                {selectedScene?.title || 'Scene Prose'}
              </h2>
              <span className="text-[11px] font-mono text-[#9c9c98]">
                Chapter {selectedChapter?.number} &bull; {selectedScene?.wordCount || 0} words
              </span>
            </div>
            {onNavigateToScene && selectedChapter && selectedScene && (
              <button
                onClick={() => onNavigateToScene(selectedChapter.id, selectedScene.id)}
                className="text-xs font-mono text-[#4f46e5] dark:text-[#818cf8] hover:underline flex items-center space-x-1"
              >
                <span>Edit in Manuscript</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Under-described Moments & Editorial Advice */}
          <div className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#d97706] flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Sensory Audit Observation</span>
              </span>
              <span className="text-[10px] font-mono text-[#9c9c98]">Scene Opening Evaluation</span>
            </div>
            <p className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-relaxed font-serif">
              The opening passages rely primarily on narrative recap and declarative statements of feeling. Grounding the scene in tactile temperature (the sea-fog moisture clinging to wool) and acoustic decay (hollow echoes inside the cloister) will immediately intensify physical immersion.
            </p>
          </div>

          {/* Visceral Setting-Grounded Suggestion (AI generated or contextual) */}
          {aiSuggestion && (
            <div className="p-5 rounded-xl border border-[#4f46e5]/30 bg-[#fbfbfa] dark:bg-[#181920] space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8]" />
                <h3 className="text-xs font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                  Setting-Grounded Sensory Revision
                </h3>
              </div>
              <div className="text-xs font-serif text-[#191918] dark:text-[#f4f4f5] leading-relaxed whitespace-pre-line">
                {aiSuggestion}
              </div>
            </div>
          )}

          {/* Scene Prose Display */}
          <div className="p-6 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] block">
              Manuscript Scene Excerpt
            </span>
            <div className="prose dark:prose-invert font-serif text-sm leading-relaxed text-[#191918] dark:text-[#f4f4f5] whitespace-pre-line">
              {currentSceneText || 'No scene content found for this section.'}
            </div>
          </div>
        </div>

        {/* Right Pane: Sensory Channels Reference & Somatic Thesaurus */}
        <div className="w-96 shrink-0 border-l border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-col overflow-y-auto p-6 space-y-6">
          <div className="border-b border-[#ecece9] dark:border-[#242528] pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
              Sensory Reference Channels
            </span>
            <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] mt-1">
              Curated somatic signals and physical manifestations alongside your text.
            </p>
          </div>

          {/* 6 Required Sensory Channels */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {SENSORY_CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.id}
                  className="p-3 rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] space-y-1"
                >
                  <div className="flex items-center space-x-1.5">
                    <Icon className={`w-3.5 h-3.5 ${ch.color}`} />
                    <span className="font-semibold text-[11px] text-[#191918] dark:text-[#f4f4f5] truncate">
                      {ch.label.split('/')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9c9c98] block truncate">
                    {ch.label.split('/')[1] || ch.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Somatic Thesaurus Search */}
          <div className="space-y-3 pt-2 border-t border-[#ecece9] dark:border-[#242528]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
              <input
                type="text"
                placeholder="Lookup somatic emotion (e.g. dread, awe)..."
                value={searchThesaurus}
                onChange={(e) => setSearchThesaurus(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] placeholder-[#9c9c98] focus:outline-none"
              />
            </div>

            {activeEntry && (
              <div className="p-4 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-[#191918] dark:text-[#f4f4f5]">
                    {activeEntry.emotion}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                    {activeEntry.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#b91c1c]">
                    Cliché To Avoid:
                  </span>
                  <p className="text-xs text-[#9c9c98] italic">"{activeEntry.clicheToAvoid}"</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#ecece9] dark:border-[#28292d]">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#191918] dark:text-[#f4f4f5] block">
                    Visceral Physical Signs:
                  </span>
                  <ul className="space-y-1 text-xs text-[#6e6e6b] dark:text-[#9ca3af]">
                    {activeEntry.physicalSensations.slice(0, 3).map((sens, idx) => (
                      <li
                        key={idx}
                        className="flex items-start justify-between group cursor-pointer hover:text-[#4f46e5]"
                        onClick={() => handleCopy(sens, `sens-${idx}`)}
                      >
                        <span>&bull; {sens}</span>
                        <Copy className="w-3 h-3 text-[#9c9c98] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
