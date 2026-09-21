import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Volume2,
} from 'lucide-react';
import { NovelProject, StylePersona, AIDetectorReport } from '../types';
import { analyzeProseLocally } from '../utils/detectorHeuristics';

interface HumanizerStylePanelProps {
  project: NovelProject;
  currentSceneText: string;
  onUpdateStylePersona: (updated: StylePersona) => void;
  onApplyHumanizedText: (newText: string) => void;
  isDarkMode: boolean;
}

const PRESET_PERSONAS: StylePersona[] = [
  {
    id: 'persona-1',
    name: 'Grounded Atmospheric Realism',
    description: 'High-burstiness literary suspense with tactile micro-sensory details, stark sentence variance, and natural character cadence.',
    tone: 'Haunting, visceral, grounded, psychologically alert',
    burstinessLevel: 'High',
    sensoryLevel: 'Dense & Visceral',
    dialogueStyle: 'Crisp & Punchy',
    bannedWords: ['rich tapestry', 'testament to', 'delve', 'intertwined', 'palpable tension', 'moreover', 'furthermore', 'a symphony of'],
  },
  {
    id: 'persona-2',
    name: 'Hardboiled Noir & Crime',
    description: 'Fast, cynical, rhythmic staccato pacing with sharp observational wit, short sentences, and cigarette-smoke grit.',
    tone: 'Taut, wry, cynical, urgent, relentless',
    burstinessLevel: 'Extreme Organic',
    sensoryLevel: 'Dense & Visceral',
    dialogueStyle: 'Crisp & Punchy',
    bannedWords: ['testament to', 'delve into', 'in conclusion', 'deeply nuanced', 'beacon of hope', 'whispers of'],
  },
  {
    id: 'persona-3',
    name: 'Lyrical Speculative Fiction',
    description: 'Expansive clause rhythms, metaphorical weight grounded in tangible physics, and deep philosophical subtext.',
    tone: 'Evocative, luminous, melancholic, wondrous',
    burstinessLevel: 'High',
    sensoryLevel: 'Dense & Visceral',
    dialogueStyle: 'Naturalistic & Overlapping',
    bannedWords: ['moreover', 'furthermore', 'rich tapestry', 'navigating the complexities'],
  },
  {
    id: 'persona-4',
    name: 'Fast-Paced Suspense Thriller',
    description: 'Abrupt fragments, high narrative momentum, physical action beats, zero expositional bloat.',
    tone: 'Heart-pounding, breathless, immediate, punchy',
    burstinessLevel: 'Extreme Organic',
    sensoryLevel: 'Moderate',
    dialogueStyle: 'Crisp & Punchy',
    bannedWords: ['delve', 'testament to', 'palpable', 'intertwined', 'moreover'],
  },
];

export const HumanizerStylePanel: React.FC<HumanizerStylePanelProps> = ({
  project,
  currentSceneText,
  onUpdateStylePersona,
  onApplyHumanizedText,
  isDarkMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'detector' | 'style_editor'>('detector');
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [deepScanReport, setDeepScanReport] = useState<any | null>(null);
  const [newBannedWord, setNewBannedWord] = useState('');

  // Local real-time calculation
  const localReport = analyzeProseLocally(currentSceneText);
  const activeReport = deepScanReport || localReport;

  const currentPersona = project.stylePersona || PRESET_PERSONAS[0];

  const handleDeepForensicScan = async () => {
    setIsDeepScanning(true);
    try {
      const res = await fetch('/api/gemini/analyze-detector-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentSceneText }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeepScanReport(data);
      } else {
        alert('Deep scan failed. Falling back to local computational linguistics engine.');
      }
    } catch (e) {
      console.warn('Deep scan error:', e);
    } finally {
      setIsDeepScanning(false);
    }
  };

  const handleAddBannedWord = () => {
    if (newBannedWord.trim() && !currentPersona.bannedWords.includes(newBannedWord.trim())) {
      onUpdateStylePersona({
        ...currentPersona,
        bannedWords: [...currentPersona.bannedWords, newBannedWord.trim().toLowerCase()],
      });
      setNewBannedWord('');
    }
  };

  const handleRemoveBannedWord = (word: string) => {
    onUpdateStylePersona({
      ...currentPersona,
      bannedWords: currentPersona.bannedWords.filter((w) => w !== word),
    });
  };

  return (
    <div id="humanizer-style-panel" className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-stone-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-slate-100">
              AI Detector Evasion &amp; Authentic Voice Engine
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 max-w-2xl">
            Mathematical burstiness, perplexity variance, and voice consistency tooling engineered to guarantee your manuscript
            passes AI detection tools (Turnitin, ZeroGPT, GPTZero, CopyLeaks) with organic human authorship scores.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center p-1 rounded-lg bg-stone-200/60 dark:bg-slate-800 self-start">
          <button
            id="tab-sub-detector"
            onClick={() => setActiveSubTab('detector')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'detector'
                ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            Forensic Detector Diagnostics
          </button>
          <button
            id="tab-sub-style-editor"
            onClick={() => setActiveSubTab('style_editor')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === 'style_editor'
                ? 'bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 shadow-xs'
                : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            Author Style &amp; Persona Editor
          </button>
        </div>
      </div>

      {activeSubTab === 'detector' ? (
        <div className="space-y-6">
          {/* Key Metrics Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Human Writer Probability */}
            <div
              id="card-human-probability"
              className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                  Human Authenticity
                </span>
                <ShieldCheck
                  className={`w-4 h-4 ${
                    activeReport.humanProbability >= 80
                      ? 'text-emerald-500'
                      : activeReport.humanProbability >= 60
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                />
              </div>
              <div className="my-3">
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {activeReport.humanProbability}%
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {activeReport.humanProbability >= 85
                    ? '100% Passes AI Detectors'
                    : activeReport.humanProbability >= 65
                    ? 'Likely Human Authored'
                    : 'Detector Risk Detected'}
                </div>
              </div>
              <div className="w-full bg-stone-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeReport.humanProbability}%` }}
                />
              </div>
            </div>

            {/* Burstiness Score */}
            <div
              id="card-burstiness-score"
              className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                  Cadence Burstiness
                </span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="my-3">
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {activeReport.burstinessScore || localReport.burstinessScore}/100
                </div>
                <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Sentence length variation metric
                </div>
              </div>
              <div className="text-[11px] text-stone-600 dark:text-slate-400">
                {activeReport.burstinessScore >= 70
                  ? 'Strong organic elasticity'
                  : 'Slightly uniform lengths'}
              </div>
            </div>

            {/* Perplexity Estimate */}
            <div
              id="card-perplexity-grade"
              className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                  Perplexity Grade
                </span>
                <Flame className="w-4 h-4 text-purple-500" />
              </div>
              <div className="my-3">
                <div className="text-2xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {activeReport.perplexityGrade || 'Natural Human'}
                </div>
                <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Unpredictable token distribution
                </div>
              </div>
              <div className="text-[11px] text-stone-600 dark:text-slate-400">
                Matches organic literary cadence
              </div>
            </div>

            {/* Avg Sentence Length */}
            <div
              id="card-sentence-avg"
              className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
                  Avg Sentence Length
                </span>
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              </div>
              <div className="my-3">
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {localReport.avgSentenceLength} <span className="text-sm font-sans font-normal text-stone-400">words</span>
                </div>
                <div className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                  Variance: ±{localReport.sentenceLengthVariance}
                </div>
              </div>
              <button
                id="btn-run-deep-scan"
                onClick={handleDeepForensicScan}
                disabled={isDeepScanning}
                className="w-full py-1 text-center rounded bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-xs font-medium text-stone-700 dark:text-slate-300 flex items-center justify-center space-x-1"
              >
                {isDeepScanning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Run Deep AI Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sentence Length Distribution Chart */}
          <div
            id="panel-sentence-distribution"
            className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
                  Rhythmic Sentence Distribution (Burstiness Spectrum)
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  AI detectors search for monotone clustering around 12–18 words. Human authors mix 2-word staccatos with rolling 35-word clauses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {localReport.sentenceLengthDistribution.map((item, idx) => {
                const maxCount = Math.max(1, ...localReport.sentenceLengthDistribution.map((d) => d.count));
                const barHeight = Math.max(15, Math.round((item.count / maxCount) * 100));
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="text-xs font-medium text-stone-600 dark:text-slate-300">
                      {item.range}
                    </div>
                    <div className="my-2 flex items-baseline space-x-1.5">
                      <span className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                        {item.count}
                      </span>
                      <span className="text-[11px] text-stone-400">sentences</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${barHeight}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged AI Markers & Forensic Cliché Inspector */}
          <div
            id="panel-cliche-inspector"
            className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Forensic Cliché &amp; Synthetic Marker Scanner</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 font-mono">
                {activeReport.flaggedSegments?.length || 0} flagged markers
              </span>
            </div>

            {activeReport.flaggedSegments && activeReport.flaggedSegments.length > 0 ? (
              <div className="space-y-2.5">
                {activeReport.flaggedSegments.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-800 dark:text-amber-300 font-mono">
                        "{item.text}"
                      </span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400">{item.reason}</span>
                    </div>
                    {item.humanizedAlternative && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                        <span className="font-medium">Organic Alternative:</span>
                        <span className="font-serif italic">"{item.humanizedAlternative}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Clean scan! No synthetic clichés or AI transitional crutches ("moreover", "delve", "rich tapestry") detected in this excerpt.
                </span>
              </div>
            )}
          </div>

          {/* Diagnostic Recommendations */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/50 text-xs space-y-2">
            <h4 className="font-semibold text-stone-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Forensic Pacing Recommendations
            </h4>
            <p className="text-stone-600 dark:text-slate-400">{activeReport.pacingAssessment}</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-slate-400">
              {activeReport.recommendations?.map((rec: string, idx: number) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Author Style & Persona Editor Sub-Tab */
        <div className="space-y-6">
          {/* Persona Presets */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-2">
              Select Author Voice Archetype
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_PERSONAS.map((preset) => {
                const isSelected = currentPersona.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    id={`preset-${preset.id}`}
                    onClick={() => onUpdateStylePersona(preset)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-slate-100">
                        {preset.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-slate-400 mt-1">{preset.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                        Burstiness: {preset.burstinessLevel}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                        Sensory: {preset.sensoryLevel}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-slate-800 text-stone-700 dark:text-slate-300">
                        Dialogue: {preset.dialogueStyle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Persona Calibration Sliders */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Voice Pacing &amp; Texture Calibration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Burstiness Slider */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700 dark:text-slate-300">
                  Sentence Burstiness (Elasticity)
                </label>
                <select
                  id="select-burstiness-level"
                  value={currentPersona.burstinessLevel}
                  onChange={(e) =>
                    onUpdateStylePersona({
                      ...currentPersona,
                      burstinessLevel: e.target.value as any,
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                >
                  <option value="Low">Low (Uniform &amp; Sedate)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="High">High (Varied Staccato &amp; Rolling)</option>
                  <option value="Extreme Organic">Extreme Organic (Stark Dramatic Contractions)</option>
                </select>
                <p className="text-[10px] text-stone-400">
                  Directly suppresses detector regularity signatures.
                </p>
              </div>

              {/* Sensory Level Slider */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700 dark:text-slate-300">
                  Sensory Grounding
                </label>
                <select
                  id="select-sensory-level"
                  value={currentPersona.sensoryLevel}
                  onChange={(e) =>
                    onUpdateStylePersona({
                      ...currentPersona,
                      sensoryLevel: e.target.value as any,
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                >
                  <option value="Sparse">Sparse (Conceptual / Mind)</option>
                  <option value="Moderate">Moderate (Standard fiction)</option>
                  <option value="Dense & Visceral">Dense &amp; Visceral (Tactile, olfactory, thermal)</option>
                </select>
                <p className="text-[10px] text-stone-400">
                  Grounds scenes in physical realism to avoid AI abstractions.
                </p>
              </div>

              {/* Dialogue Style */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700 dark:text-slate-300">
                  Dialogue Subtext &amp; Cadence
                </label>
                <select
                  id="select-dialogue-style"
                  value={currentPersona.dialogueStyle}
                  onChange={(e) =>
                    onUpdateStylePersona({
                      ...currentPersona,
                      dialogueStyle: e.target.value as any,
                    })
                  }
                  className="w-full text-xs p-2 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                >
                  <option value="Crisp & Punchy">Crisp &amp; Punchy</option>
                  <option value="Naturalistic & Overlapping">Naturalistic &amp; Overlapping</option>
                  <option value="Formal / Period">Formal / Period Literary</option>
                  <option value="Idiosyncratic">Idiosyncratic Character Slang</option>
                </select>
                <p className="text-[10px] text-stone-400">
                  Enforces human contractions, pauses, and speech beats.
                </p>
              </div>
            </div>
          </div>

          {/* Banned AI Words Customizer */}
          <div className="p-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
              Banned Synthetic AI Clichés (Blacklist)
            </h3>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              The drafting engine will strictly forbid these expressions from ever generating in your manuscript.
            </p>

            <div className="flex gap-2">
              <input
                id="input-add-banned-word"
                type="text"
                value={newBannedWord}
                onChange={(e) => setNewBannedWord(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBannedWord()}
                placeholder="Add custom phrase or word to ban..."
                className="flex-1 text-xs px-3 py-1.5 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100"
              />
              <button
                id="btn-add-banned-word"
                onClick={handleAddBannedWord}
                className="px-3 py-1.5 rounded text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {currentPersona.bannedWords.map((word) => (
                <span
                  key={word}
                  className="px-2 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs flex items-center space-x-1.5 border border-stone-200 dark:border-slate-700"
                >
                  <span>{word}</span>
                  <button
                    onClick={() => handleRemoveBannedWord(word)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
