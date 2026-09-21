import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  PieChart,
  Flame,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NovelProject, Chapter, Scene } from '../types';

interface PacingHeatmapViewProps {
  project: NovelProject;
  isDarkMode: boolean;
  onNavigateToVoiceGuard?: () => void;
}

export const PacingHeatmapView: React.FC<PacingHeatmapViewProps> = ({
  project,
  isDarkMode,
  onNavigateToVoiceGuard,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    project.chapters[0]?.id || ''
  );

  const chapters = project.chapters || [];
  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // Calculate Scene Velocity metrics (Dialogue vs Exposition vs Action)
  const calculateSceneComposition = (scene: Scene) => {
    const text = scene.content || '';
    const totalChars = text.length || 1;

    // Quotes = Dialogue
    const quoteMatches: string[] = text.match(/["“][^"”]+["”]/g) || [];
    const dialogueChars = quoteMatches.reduce((acc: number, q: string) => acc + q.length, 0);

    // Short action sentences (verbs and short clauses)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const shortSentences = sentences.filter((s) => s.trim().split(/\s+/).length < 10);
    const actionChars = shortSentences.reduce((acc: number, s: string) => acc + s.length, 0);

    const dialogueRatio = Math.min(100, Math.round((dialogueChars / totalChars) * 100));
    const actionRatio = Math.min(
      100 - dialogueRatio,
      Math.round((actionChars / totalChars) * 100 * 0.5)
    );
    const expositionRatio = Math.max(0, 100 - dialogueRatio - actionRatio);

    // Velocity score: high dialogue and action = faster velocity
    const velocityScore = Math.min(10, Math.max(1, Math.round((dialogueRatio * 0.6 + actionRatio * 0.4) / 10)));

    return { dialogueRatio, actionRatio, expositionRatio, velocityScore };
  };

  // POV Character distribution
  const calculatePovDistribution = () => {
    const povMap: Record<string, { name: string; wordCount: number; sceneCount: number }> = {};

    project.characters.forEach((char) => {
      povMap[char.id] = { name: char.name, wordCount: 0, sceneCount: 0 };
    });
    povMap['unassigned'] = { name: 'Omniscient / Ensemble', wordCount: 0, sceneCount: 0 };

    chapters.forEach((chap) => {
      chap.scenes.forEach((sc) => {
        const pov = sc.povCharacterId && povMap[sc.povCharacterId] ? sc.povCharacterId : 'unassigned';
        povMap[pov].wordCount += sc.wordCount || 0;
        povMap[pov].sceneCount += 1;
      });
    });

    return Object.values(povMap).filter((p) => p.sceneCount > 0);
  };

  const povDistribution = calculatePovDistribution();
  const totalNovelWords = chapters.reduce(
    (acc, chap) => acc + chap.scenes.reduce((sAcc, sc) => sAcc + (sc.wordCount || 0), 0),
    0
  );

  return (
    <div id="pacing-heatmap-stage" className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div
        className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-stone-100/60 border-stone-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-slate-100">
              Reader Arc &amp; Narrative Pacing Heatmap
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Visual velocity scanner: track dialogue-to-exposition balance, tension spikes, and narrative momentum
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {onNavigateToVoiceGuard && (
            <button
              onClick={onNavigateToVoiceGuard}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 font-bold transition-all flex items-center space-x-1.5 border border-amber-500/30"
            >
              <span>Active Pacing Radar Suite &rarr;</span>
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-stone-600 dark:text-slate-400">Dialogue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-stone-600 dark:text-slate-400">Action</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-stone-600 dark:text-slate-400">Exposition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Chapter Tension & Word Count Heatmap Matrix */}
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Chapter Narrative Tension &amp; Density Heatmap</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {chapters.length} Chapters Mapped
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {chapters.map((chap) => {
              const chapWords = chap.scenes.reduce((acc, s) => acc + (s.wordCount || 0), 0);
              // Tension score estimation
              const linkedBeats = project.plotBeats.filter((b) => b.linkedChapterId === chap.id);
              const tension =
                linkedBeats.length > 0
                  ? Math.round(
                      linkedBeats.reduce((a, b) => a + b.tensionLevel, 0) / linkedBeats.length
                    )
                  : 5;

              return (
                <div
                  key={chap.id}
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedChapter?.id === chap.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-stone-200 dark:border-slate-800 hover:border-stone-300 bg-stone-50/50 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-slate-100">
                      Chapter {chap.number}: {chap.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        tension >= 8
                          ? 'bg-rose-500/15 text-rose-600'
                          : tension >= 5
                          ? 'bg-amber-500/15 text-amber-600'
                          : 'bg-blue-500/15 text-blue-600'
                      }`}
                    >
                      Tension {tension}/10
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 dark:text-slate-400 mb-2">
                    {chapWords.toLocaleString()} words • {chap.scenes.length} scenes
                  </div>

                  {/* Visual Tension Meter Bar */}
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tension >= 8 ? 'bg-rose-500' : tension >= 5 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${tension * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scene Composition Stacked Breakdown */}
        {selectedChapter && (
          <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                  Scene Composition Breakdown: Chapter {selectedChapter.number} ("{selectedChapter.title}")
                </h3>
                <p className="text-xs text-stone-500">
                  Detailed ratio of spoken dialogue, active pacing, and sensory exposition
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedChapter.scenes.map((scene) => {
                const comp = calculateSceneComposition(scene);

                return (
                  <div
                    key={scene.id}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 dark:text-slate-100">
                          {scene.title}
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          ({scene.wordCount || 0} words)
                        </span>
                      </div>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">
                        Velocity: {comp.velocityScore} / 10
                      </span>
                    </div>

                    {/* Stacked Composition Bar */}
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200 dark:bg-slate-700">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${comp.dialogueRatio}%` }}
                        title={`Dialogue: ${comp.dialogueRatio}%`}
                      />
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${comp.actionRatio}%` }}
                        title={`Action: ${comp.actionRatio}%`}
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${comp.expositionRatio}%` }}
                        title={`Exposition: ${comp.expositionRatio}%`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                      <span>Dialogue: {comp.dialogueRatio}%</span>
                      <span>Action: {comp.actionRatio}%</span>
                      <span>Exposition: {comp.expositionRatio}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* POV Screen-Time & Word Distribution */}
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-purple-500" />
            <span>POV Character Balance &amp; Screen Time</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {povDistribution.map((pov) => {
              const pct = totalNovelWords > 0 ? Math.round((pov.wordCount / totalNovelWords) * 100) : 0;

              return (
                <div
                  key={pov.name}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 text-xs space-y-1"
                >
                  <div className="font-bold text-stone-900 dark:text-slate-100">{pov.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{pov.wordCount.toLocaleString()} words</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{pct}% total</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
