import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Activity,
  Zap,
  Flame,
  AlertTriangle,
  Eye,
  Ear,
  Hand,
  Wind,
  Coffee,
  Heart,
  MessageSquare,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Filter,
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Compass,
} from 'lucide-react';
import { NovelProject, Chapter, Scene, StylePersona, Character } from '../types';
import {
  calculateManuscriptPacing,
  analyzePassiveVoiceHeatmap,
  analyzeSensoryDensity,
  analyzeDialogueCliches,
  GENRE_PACING_BENCHMARKS,
  ChapterPacingMetric,
} from '../utils/styleVoiceGuardEngine';
import { analyzeProseLocally } from '../utils/detectorHeuristics';

interface StyleVoiceGuardViewProps {
  project: NovelProject;
  currentSceneText: string;
  activeChapterId?: string;
  activeSceneId?: string;
  onUpdateStylePersona: (persona: StylePersona) => void;
  onApplyHumanizedText: (newText: string) => void;
  isDarkMode: boolean;
}

export const StyleVoiceGuardView: React.FC<StyleVoiceGuardViewProps> = ({
  project,
  currentSceneText,
  activeChapterId,
  activeSceneId,
  onUpdateStylePersona,
  onApplyHumanizedText,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pacing_radar' | 'passive_voice' | 'sensory_density' | 'dialogue_cliche' | 'ai_detector' | 'persona'
  >('pacing_radar');

  const chapters = project.chapters || [];
  const characters = project.characters || [];

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    activeChapterId || chapters[0]?.id || ''
  );
  const [selectedGenreBenchmark, setSelectedGenreBenchmark] = useState<string>(
    project.genre.toLowerCase().includes('thrill')
      ? 'Thriller / Suspense'
      : project.genre.toLowerCase().includes('sci') || project.genre.toLowerCase().includes('fantasy')
      ? 'Sci-Fi & Fantasy'
      : project.genre.toLowerCase().includes('detective') || project.genre.toLowerCase().includes('mystery')
      ? 'Mystery / Detective'
      : project.genre.toLowerCase().includes('romance')
      ? 'Romance / Contemporary'
      : 'Literary Fiction'
  );

  // Filters for Dialogue Cliche tab
  const [selectedClicheCharacterId, setSelectedClicheCharacterId] = useState<string>('all');
  const [selectedClicheCategory, setSelectedClicheCategory] = useState<string>('all');
  const [clicheSearch, setClicheSearch] = useState('');
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);

  // Passive voice inspector filter
  const [passiveFilter, setPassiveFilter] = useState<'all' | 'passive_only'>('all');

  // Engines calculation with memoization
  const pacingReport = useMemo(() => calculateManuscriptPacing(chapters), [chapters]);
  const activeChapterPacing = useMemo(
    () => pacingReport.chapters.find((c) => c.chapterId === selectedChapterId) || pacingReport.chapters[0],
    [pacingReport, selectedChapterId]
  );

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const chapterText = useMemo(
    () => selectedChapter?.scenes.map((s) => s.content || '').join('\n\n') || currentSceneText || '',
    [selectedChapter, currentSceneText]
  );

  const passiveReport = useMemo(
    () => analyzePassiveVoiceHeatmap(chapters, chapterText),
    [chapters, chapterText]
  );

  const sensoryReport = useMemo(() => analyzeSensoryDensity(chapterText), [chapterText]);

  const dialogueClicheReport = useMemo(
    () => analyzeDialogueCliches(chapters, characters),
    [chapters, characters]
  );

  const localAiReport = useMemo(() => analyzeProseLocally(currentSceneText || chapterText), [currentSceneText, chapterText]);

  const benchmark = GENRE_PACING_BENCHMARKS[selectedGenreBenchmark] || GENRE_PACING_BENCHMARKS['Literary Fiction'];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSentenceId(id);
    setTimeout(() => setCopiedSentenceId(null), 2000);
  };

  return (
    <div id="style-voice-guard-view" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Workspace Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Voice, Cadence &amp; Style Advisor
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">
            ({project.genre} &bull; {project.stylePersona?.primaryTone || 'Literary'})
          </span>
        </div>

        {/* Global Navigation Sub-Tabs */}
        <div className="flex items-center rounded-lg border border-[#e8e8e6] dark:border-[#28292d] p-0.5 bg-[#fbfbfa] dark:bg-[#18191b] text-xs font-medium space-x-0.5">
          <button
            id="tab-btn-pacing-radar"
            onClick={() => setActiveTab('pacing_radar')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'pacing_radar'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Rhythm &amp; Cadence
          </button>

          <button
            id="tab-btn-passive-voice"
            onClick={() => setActiveTab('passive_voice')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'passive_voice'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Active Clarity
          </button>

          <button
            id="tab-btn-sensory-density"
            onClick={() => setActiveTab('sensory_density')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'sensory_density'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Sensory Density
          </button>

          <button
            id="tab-btn-dialogue-cliche"
            onClick={() => setActiveTab('dialogue_cliche')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'dialogue_cliche'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Clichés &amp; Tropes
          </button>

          <button
            id="tab-btn-ai-detector"
            onClick={() => setActiveTab('ai_detector')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'ai_detector'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Synthetic Phrasing
          </button>

          <button
            id="tab-btn-persona"
            onClick={() => setActiveTab('persona')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'persona'
                ? 'bg-white dark:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] shadow-2xs font-semibold'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:text-[#191918]'
            }`}
          >
            Author Targets
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* ========================================================= */}
        {/* TAB 1: ACTIVE PACING RADAR (DIALOGUE VS NARRATIVE EXPOSITION) */}
        {/* ========================================================= */}
        {activeTab === 'pacing_radar' && (
          <div className="space-y-6">
            {/* Top Bar: Chapter Selector & Benchmark Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Target Chapter:
                </span>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-medium focus:outline-none"
                >
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      Chapter {c.number}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Genre Benchmark:
                </span>
                <select
                  value={selectedGenreBenchmark}
                  onChange={(e) => setSelectedGenreBenchmark(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-medium focus:outline-none"
                >
                  {Object.keys(GENRE_PACING_BENCHMARKS).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Radar Diagram & Metrics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Radar Polygon & Axis Breakdown */}
              <div className="lg:col-span-7 p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-amber-500" />
                      <span>Active Narrative Pacing Radar</span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Comparing Dialogue Volume vs. Narrative Exposition vs. Dynamic Action vs. Genre Benchmark
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="font-medium text-stone-600 dark:text-slate-300">
                        Ch. {activeChapterPacing?.chapterNumber || 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 rounded-full border-2 border-dashed border-teal-500" />
                      <span className="font-medium text-stone-600 dark:text-slate-300">
                        {selectedGenreBenchmark.split('/')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG 5-Axis Radar Chart */}
                <div className="flex items-center justify-center py-4">
                  {(() => {
                    const dVal = activeChapterPacing?.dialogueRatio || 30;
                    const eVal = activeChapterPacing?.expositionRatio || 45;
                    const aVal = activeChapterPacing?.actionRatio || 25;
                    const vVal = (activeChapterPacing?.velocityScore || 5) * 10;
                    const sVal = Math.min(100, Math.round(((activeChapterPacing?.avgSentenceLength || 15) / 25) * 100));

                    const bD = benchmark.targetDialogue;
                    const bE = benchmark.targetExposition;
                    const bA = benchmark.targetAction;
                    const bV = Math.round((bD * 0.55 + bA * 0.45));
                    const bS = Math.min(100, Math.round((benchmark.idealAvgSentenceLength / 25) * 100));

                    // Coordinates helper for 5-axis pentagon (center at 150, 150, max radius 110)
                    const center = 150;
                    const maxR = 100;
                    const axes = [
                      { label: 'Spoken Dialogue', angle: -90, val: dVal, bench: bD, color: '#10b981' },
                      { label: 'Exposition / Scene Detail', angle: -18, val: eVal, bench: bE, color: '#f59e0b' },
                      { label: 'Action & Staccato Beats', angle: 54, val: aVal, bench: bA, color: '#3b82f6' },
                      { label: 'Velocity Momentum', angle: 126, val: vVal, bench: bV, color: '#8b5cf6' },
                      { label: 'Clause Expansiveness', angle: 198, val: sVal, bench: bS, color: '#ec4899' },
                    ];

                    const getCoord = (angleDeg: number, radius: number) => {
                      const rad = (angleDeg * Math.PI) / 180;
                      return {
                        x: center + radius * Math.cos(rad),
                        y: center + radius * Math.sin(rad),
                      };
                    };

                    const chapterPoints = axes
                      .map((ax) => {
                        const r = (Math.max(10, Math.min(100, ax.val)) / 100) * maxR;
                        const pt = getCoord(ax.angle, r);
                        return `${pt.x},${pt.y}`;
                      })
                      .join(' ');

                    const benchPoints = axes
                      .map((ax) => {
                        const r = (Math.max(10, Math.min(100, ax.bench)) / 100) * maxR;
                        const pt = getCoord(ax.angle, r);
                        return `${pt.x},${pt.y}`;
                      })
                      .join(' ');

                    return (
                      <svg className="w-72 h-72 overflow-visible" viewBox="0 0 300 300">
                        {/* Background concentric guide webs */}
                        {[0.25, 0.5, 0.75, 1].map((scale) => {
                          const pts = axes
                            .map((ax) => {
                              const pt = getCoord(ax.angle, maxR * scale);
                              return `${pt.x},${pt.y}`;
                            })
                            .join(' ');
                          return (
                            <polygon
                              key={scale}
                              points={pts}
                              fill="none"
                              stroke={isDarkMode ? '#334155' : '#e2e8f0'}
                              strokeWidth="1"
                              strokeDasharray={scale < 1 ? '3 3' : undefined}
                            />
                          );
                        })}

                        {/* Axis spoke lines */}
                        {axes.map((ax, idx) => {
                          const pt = getCoord(ax.angle, maxR);
                          const labelPt = getCoord(ax.angle, maxR + 24);
                          return (
                            <g key={idx}>
                              <line
                                x1={center}
                                y1={center}
                                x2={pt.x}
                                y2={pt.y}
                                stroke={isDarkMode ? '#475569' : '#cbd5e1'}
                                strokeWidth="1"
                              />
                              <text
                                x={labelPt.x}
                                y={labelPt.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="text-[10px] font-semibold fill-stone-600 dark:fill-slate-300"
                              >
                                {ax.label}
                              </text>
                            </g>
                          );
                        })}

                        {/* Benchmark target polygon (dashed) */}
                        <polygon
                          points={benchPoints}
                          fill="rgba(20, 184, 166, 0.12)"
                          stroke="#14b8a6"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />

                        {/* Chapter actual polygon (filled) */}
                        <polygon
                          points={chapterPoints}
                          fill="rgba(245, 158, 11, 0.28)"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                        />

                        {/* Points markers */}
                        {axes.map((ax, idx) => {
                          const r = (Math.max(10, Math.min(100, ax.val)) / 100) * maxR;
                          const pt = getCoord(ax.angle, r);
                          return (
                            <circle
                              key={idx}
                              cx={pt.x}
                              cy={pt.y}
                              r="4"
                              fill="#f59e0b"
                              stroke={isDarkMode ? '#0f172a' : '#ffffff'}
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>

                {/* Radar Legend & Drift Assessment */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-800 flex items-start space-x-3">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg ${
                      activeChapterPacing?.pacingFlag === 'Exposition Drag'
                        ? 'bg-rose-500/15 text-rose-600'
                        : activeChapterPacing?.pacingFlag === 'Talking Heads'
                        ? 'bg-amber-500/15 text-amber-600'
                        : 'bg-emerald-500/15 text-emerald-600'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-slate-100">
                        {activeChapterPacing?.pacingFlag || 'Balanced Flow'}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        {activeChapterPacing?.wordCount.toLocaleString()} words
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
                      {activeChapterPacing?.pacingAdvice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Comparative Ratios & Benchmark Match */}
              <div className="lg:col-span-5 space-y-4">
                {/* Dialogue vs Narrative Exposition Card */}
                <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Dialogue vs. Exposition Calibration
                  </h3>

                  {/* Dialogue Ratio Bar */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Spoken Dialogue</span>
                      </span>
                      <span className="font-mono font-bold text-stone-800 dark:text-slate-200">
                        {activeChapterPacing?.dialogueRatio}%{' '}
                        <span className="text-stone-400 font-normal">
                          (Target: {benchmark.targetDialogue}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeChapterPacing?.dialogueRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* Narrative Exposition Ratio Bar */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Narrative Exposition</span>
                      </span>
                      <span className="font-mono font-bold text-stone-800 dark:text-slate-200">
                        {activeChapterPacing?.expositionRatio}%{' '}
                        <span className="text-stone-400 font-normal">
                          (Target: {benchmark.targetExposition}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeChapterPacing?.expositionRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Velocity Bar */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Action &amp; Physical Staccato</span>
                      </span>
                      <span className="font-mono font-bold text-stone-800 dark:text-slate-200">
                        {activeChapterPacing?.actionRatio}%{' '}
                        <span className="text-stone-400 font-normal">
                          (Target: {benchmark.targetAction}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeChapterPacing?.actionRatio}%` }}
                      />
                    </div>
                  </div>

                  {/* Benchmark note */}
                  <div className="pt-2 border-t border-stone-200 dark:border-slate-800 text-[11px] text-stone-500 leading-relaxed">
                    <strong className="text-stone-800 dark:text-slate-200">{benchmark.genre}:</strong>{' '}
                    {benchmark.description}
                  </div>
                </div>

                {/* Chapter Pacing Drift Cards Grid */}
                <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Manuscript Velocity Index
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800">
                      <div className="text-[11px] text-stone-400">Velocity Score</div>
                      <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {activeChapterPacing?.velocityScore || 5} / 10
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {activeChapterPacing?.velocityScore && activeChapterPacing.velocityScore >= 7
                          ? 'Page-turner sprint'
                          : 'Contemplative pace'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800">
                      <div className="text-[11px] text-stone-400">Avg Sentence Length</div>
                      <div className="text-2xl font-serif font-bold text-stone-900 dark:text-slate-100 mt-1">
                        {activeChapterPacing?.avgSentenceLength || 14}{' '}
                        <span className="text-xs font-sans font-normal text-stone-400">words</span>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Target: ~{benchmark.idealAvgSentenceLength} wps
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter-by-Chapter Pacing Matrix */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span>Cross-Chapter Pacing Arc &amp; Dialogue Flow</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Compare dialogue vs narrative weight progression across your full manuscript
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-500">Dialogue</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-stone-500">Exposition</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-stone-500">Action</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {pacingReport.chapters.map((chap) => {
                  const isSelected = chap.chapterId === selectedChapterId;

                  return (
                    <div
                      key={chap.chapterId}
                      onClick={() => setSelectedChapterId(chap.chapterId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                          : 'border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-stone-900 dark:text-slate-100">
                            Chapter {chap.chapterNumber}: {chap.chapterTitle}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            ({chap.wordCount.toLocaleString()} words • {chap.scenes.length} scenes)
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              chap.pacingFlag === 'Exposition Drag'
                                ? 'bg-rose-500/15 text-rose-600'
                                : chap.pacingFlag === 'Talking Heads'
                                ? 'bg-amber-500/15 text-amber-600'
                                : 'bg-emerald-500/15 text-emerald-600'
                            }`}
                          >
                            {chap.pacingFlag}
                          </span>
                          <span className="text-xs font-semibold text-stone-600 dark:text-slate-300 font-mono">
                            Velocity {chap.velocityScore}/10
                          </span>
                        </div>
                      </div>

                      {/* Stacked Percentage Bar */}
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-200 dark:bg-slate-700">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${chap.dialogueRatio}%` }}
                          title={`Dialogue: ${chap.dialogueRatio}%`}
                        />
                        <div
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${chap.expositionRatio}%` }}
                          title={`Exposition: ${chap.expositionRatio}%`}
                        />
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${chap.actionRatio}%` }}
                          title={`Action: ${chap.actionRatio}%`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mt-1.5">
                        <span>Dialogue: {chap.dialogueRatio}% ({chap.dialogueWords.toLocaleString()}w)</span>
                        <span>Exposition: {chap.expositionRatio}% ({chap.expositionWords.toLocaleString()}w)</span>
                        <span>Action: {chap.actionRatio}% ({chap.actionWords.toLocaleString()}w)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PASSIVE VS ACTIVE VOICE HEATMAP */}
        {/* ========================================================= */}
        {activeTab === 'passive_voice' && (
          <div className="space-y-6">
            {/* Summary Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Active Voice Ratio
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                  {passiveReport.activePercentage}%
                </div>
                <div className="text-xs text-stone-500">
                  {passiveReport.grade}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Passive Constructions
                </div>
                <div className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  {passiveReport.passiveSentencesCount}{' '}
                  <span className="text-sm font-sans font-normal text-stone-400">
                    / {passiveReport.totalSentences}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  {passiveReport.passivePercentage}% passive density
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Agentless Passives
                </div>
                <div className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">
                  {passiveReport.agentlessCount}
                </div>
                <div className="text-xs text-stone-500">
                  Subject dropped ("was struck", "was told")
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  "By [Agent]" Passives
                </div>
                <div className="text-3xl font-serif font-bold text-blue-600 dark:text-blue-400">
                  {passiveReport.byAgentCount}
                </div>
                <div className="text-xs text-stone-500">
                  Inverted actor ("was seen by Marcus")
                </div>
              </div>
            </div>

            {/* Chapter Heatmap Matrix */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span>Chapter Passive Voice Density Heatmap</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Publishing industry standard: &le; 6% passive constructions for commercial fiction
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-500">&le; 6% (Elite Active)</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-stone-500">7-14% (Moderate)</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-stone-500">&gt; 14% (Lagging)</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {passiveReport.chapterHeatmap.map((chap) => {
                  const isSelected = chap.chapterId === selectedChapterId;
                  const isHighPassive = chap.passivePercentage > 14;
                  const isModPassive = chap.passivePercentage >= 7 && chap.passivePercentage <= 14;

                  return (
                    <div
                      key={chap.chapterId}
                      onClick={() => setSelectedChapterId(chap.chapterId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-stone-900 dark:text-slate-100">
                          Ch. {chap.chapterNumber}: {chap.chapterTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isHighPassive
                              ? 'bg-rose-500/15 text-rose-600'
                              : isModPassive
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-emerald-500/15 text-emerald-600'
                          }`}
                        >
                          {chap.passivePercentage}% Passive
                        </span>
                      </div>

                      <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isHighPassive
                              ? 'bg-rose-500'
                              : isModPassive
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, chap.passivePercentage * 4)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1 font-mono">
                        {chap.passiveCount} of {chap.totalSentences} sentences flagged
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentence-by-Sentence Inspector with Active Voice Transformer */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Sentence-Level Heatmap Inspector (Chapter {selectedChapter?.number})</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Inspect individual sentences for passive verb traps and apply one-click dynamic active transforms
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => setPassiveFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      passiveFilter === 'all'
                        ? 'bg-stone-900 text-white dark:bg-slate-100 dark:text-stone-900'
                        : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Sentences ({passiveReport.sentences.length})
                  </button>
                  <button
                    onClick={() => setPassiveFilter('passive_only')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      passiveFilter === 'passive_only'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Flagged Passive Only ({passiveReport.passiveSentencesCount})
                  </button>
                </div>
              </div>

              {/* Sentences List */}
              <div className="space-y-3">
                {passiveReport.sentences
                  .filter((s) => (passiveFilter === 'passive_only' ? s.isPassive : true))
                  .map((sentence) => (
                    <div
                      key={sentence.id}
                      className={`p-4 rounded-xl border transition-all ${
                        sentence.isPassive
                          ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10'
                          : 'border-stone-200/70 dark:border-slate-800/70 bg-stone-50/40 dark:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center space-x-2">
                            {sentence.isPassive ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                Passive: "{sentence.passiveConstruction}"
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                Active Dynamic
                              </span>
                            )}
                            {sentence.byAgent && (
                              <span className="text-[10px] font-mono text-stone-500">
                                Agent: {sentence.byAgent}
                              </span>
                            )}
                          </div>

                          <p className="font-serif text-sm leading-relaxed text-stone-800 dark:text-slate-200">
                            {sentence.originalText}
                          </p>

                          {sentence.isPassive && sentence.suggestedActive && (
                            <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-500/20 text-xs text-stone-700 dark:text-slate-300 flex items-center justify-between">
                              <span className="font-sans text-stone-600 dark:text-slate-300">
                                💡 <strong>Active Transform:</strong> {sentence.suggestedActive}
                              </span>
                              <button
                                onClick={() => handleCopyText(sentence.suggestedActive!, sentence.id)}
                                className="p-1 rounded hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-500 hover:text-stone-800 transition-colors"
                                title="Copy suggested transform"
                              >
                                {copiedSentenceId === sentence.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SENSORY IMAGERY DENSITY CHECKS */}
        {/* ========================================================= */}
        {activeTab === 'sensory_density' && (
          <div className="space-y-6">
            {/* Top Score & Density Grade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Sensory Immersion Score
                </div>
                <div className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  {sensoryReport.densityScorePer100Words}{' '}
                  <span className="text-sm font-sans font-normal text-stone-400">
                    cues / 100 words
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  Target for visceral fiction: 3.5 – 5.5
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Sensory Physicality Grade
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {sensoryReport.overallGrade}
                </div>
                <div className="text-xs text-stone-500">
                  {sensoryReport.distribution.visual > 65
                    ? 'Visual heavy: Needs scent and tactile grounding'
                    : 'Multi-sensory textured atmosphere'}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  White Room Syndrome Warnings
                </div>
                <div className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">
                  {sensoryReport.whiteRoomParagraphs.length}{' '}
                  <span className="text-sm font-sans font-normal text-stone-400">
                    deserts flagged
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  Paragraphs with 0 physical anchoring cues
                </div>
              </div>
            </div>

            {/* 5-Sense + Kinesthetic Distribution Grid */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>5-Sense &amp; Kinesthetic Texture Distribution</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    The balance of physical sensations experienced by your characters
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Visual / Sight */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Sight &amp; Visuals</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sensoryReport.distribution.visual}% ({sensoryReport.rawCounts.visual})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.visual}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.visual.slice(0, 4).join(', ') || 'none'}
                  </div>
                </div>

                {/* Auditory / Sound */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Ear className="w-4 h-4 text-purple-500" />
                      <span>Sound &amp; Acoustics</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                      {sensoryReport.distribution.auditory}% ({sensoryReport.rawCounts.auditory})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.auditory}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.auditory.slice(0, 4).join(', ') || 'none'}
                  </div>
                </div>

                {/* Tactile / Touch */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Hand className="w-4 h-4 text-amber-500" />
                      <span>Touch &amp; Texture</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {sensoryReport.distribution.tactile}% ({sensoryReport.rawCounts.tactile})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.tactile}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.tactile.slice(0, 4).join(', ') || 'none'}
                  </div>
                </div>

                {/* Olfactory / Smell */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Wind className="w-4 h-4 text-teal-500" />
                      <span>Smell &amp; Aromas</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      {sensoryReport.distribution.olfactory}% ({sensoryReport.rawCounts.olfactory})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.olfactory}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.olfactory.slice(0, 4).join(', ') || 'none'}
                  </div>
                </div>

                {/* Gustatory / Taste */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Coffee className="w-4 h-4 text-orange-500" />
                      <span>Taste &amp; Flavors</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                      {sensoryReport.distribution.gustatory}% ({sensoryReport.rawCounts.gustatory})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.gustatory}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.gustatory.slice(0, 4).join(', ') || 'none'}
                  </div>
                </div>

                {/* Kinesthetic / Body Reaction */}
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Kinesthetic Body State</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {sensoryReport.distribution.kinesthetic}% ({sensoryReport.rawCounts.kinesthetic})
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${sensoryReport.distribution.kinesthetic}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">
                    Detected: {sensoryReport.detectedKeywords.kinesthetic.slice(0, 3).join(', ') || 'none'}
                  </div>
                </div>
              </div>
            </div>

            {/* White Room Alerts Section */}
            {sensoryReport.whiteRoomParagraphs.length > 0 && (
              <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>White Room Syndrome Detector (Sensory Deserts)</span>
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-400">
                  These prose blocks exceed 45 words without a single sensory cue. Characters risk speaking or moving in an abstract disembodied vacuum.
                </p>

                <div className="space-y-3 mt-3">
                  {sensoryReport.whiteRoomParagraphs.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-500/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-[11px] text-rose-600 dark:text-rose-400">
                        <span>Paragraph #{w.paragraphIndex} ({w.wordCount} words)</span>
                        <span className="font-normal text-stone-400">Sensory Desert</span>
                      </div>
                      <p className="font-serif italic text-stone-700 dark:text-slate-300">
                        "{w.textSnippet}"
                      </p>
                      <div className="text-[11px] text-stone-500 dark:text-slate-400 pt-1 border-t border-stone-100 dark:border-slate-700">
                        💡 <strong>Guardrail Advice:</strong> Ground the paragraph by naming ambient background sound (rain on corrugated tin, hum of cooling fans) or a tactile grip (knuckles white against the pine armrest).
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CLICHÉ RADAR FOR CHARACTER DIALOGUES */}
        {/* ========================================================= */}
        {activeTab === 'dialogue_cliche' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Total Dialogue Lines Audited
                </div>
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {dialogueClicheReport.totalDialogueLines}
                </div>
                <div className="text-xs text-stone-500">
                  Across all manuscript scenes
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Stock Clichés Flagged
                </div>
                <div className="text-3xl font-serif font-bold text-rose-600 dark:text-rose-400">
                  {dialogueClicheReport.flaggedClicheCount}{' '}
                  <span className="text-sm font-sans font-normal text-stone-400">
                    ({dialogueClicheReport.clichePercentage}%)
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  Formulaic tropes &amp; filler phrases
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Highest Risk Character
                </div>
                <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  {dialogueClicheReport.characterScores[0]?.name || 'None'}
                </div>
                <div className="text-xs text-stone-500">
                  {dialogueClicheReport.characterScores[0]?.vulnerabilityPercentage || 0}% cliché rate
                </div>
              </div>
            </div>

            {/* Character Cliché Vulnerability Matrix */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Character Voice Vulnerability Leaderboard</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {dialogueClicheReport.characterScores.map((c) => {
                  const isHigh = c.vulnerabilityPercentage >= 15;
                  const isSelected = selectedClicheCharacterId === c.characterId;

                  return (
                    <div
                      key={c.characterId}
                      onClick={() =>
                        setSelectedClicheCharacterId(isSelected ? 'all' : c.characterId)
                      }
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-900 dark:text-slate-100">
                          {c.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isHigh
                              ? 'bg-rose-500/15 text-rose-600'
                              : 'bg-emerald-500/15 text-emerald-600'
                          }`}
                        >
                          {c.vulnerabilityPercentage}% Cliché
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {c.clicheLinesCount} of {c.totalDialogueLines} spoken lines flagged
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter & Cliché Inspection Feed */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedClicheCategory}
                    onChange={(e) => setSelectedClicheCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 font-medium focus:outline-none"
                  >
                    <option value="all">All Cliché Categories</option>
                    <option value="Hollywood Trope">Hollywood Tropes</option>
                    <option value="Melodrama Villain">Melodrama &amp; Villains</option>
                    <option value="Exposition Dump">Exposition Dumps ("As you know")</option>
                    <option value="Deadweight Filler">Deadweight Fillers</option>
                  </select>

                  {selectedClicheCharacterId !== 'all' && (
                    <button
                      onClick={() => setSelectedClicheCharacterId('all')}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium"
                    >
                      Clear Character Filter ×
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search dialogue quotes..."
                    value={clicheSearch}
                    onChange={(e) => setClicheSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none w-56"
                  />
                </div>
              </div>

              {/* Dialogue Cliché Cards */}
              <div className="space-y-3">
                {dialogueClicheReport.flaggedLines
                  .filter((line) => {
                    const matchChar =
                      selectedClicheCharacterId === 'all'
                        ? true
                        : line.characterId === selectedClicheCharacterId;
                    const matchCat =
                      selectedClicheCategory === 'all'
                        ? true
                        : line.category === selectedClicheCategory;
                    const matchSearch =
                      line.quote.toLowerCase().includes(clicheSearch.toLowerCase()) ||
                      line.clichePhrase.toLowerCase().includes(clicheSearch.toLowerCase());
                    return matchChar && matchCat && matchSearch;
                  })
                  .map((match) => (
                    <div
                      key={match.id}
                      className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-2 hover:border-amber-500 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-amber-700 dark:text-amber-400">
                            {match.speaker}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                            {match.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          Ch. {match.chapterNumber} • "{match.sceneTitle}"
                        </span>
                      </div>

                      <p className="font-serif text-sm text-stone-900 dark:text-slate-100 pl-3 border-l-2 border-rose-500 leading-relaxed">
                        "{match.quote}"
                      </p>

                      <div className="pt-2 flex items-start space-x-2 text-xs text-stone-600 dark:text-slate-300">
                        <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
                          ✨ Humanized Alternative:
                        </span>
                        <span className="italic">{match.humanizedAlternative}</span>
                      </div>
                    </div>
                  ))}

                {dialogueClicheReport.flaggedLines.length === 0 && (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    No dialogue clichés detected! Your character voices are exceptionally organic and idiosyncratic.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BURSTINESS SPECTRUM & AI RISK DIAGNOSTICS */}
        {/* ========================================================= */}
        {activeTab === 'ai_detector' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Human Authenticity
                </div>
                <div className="text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
                  {localAiReport.humanProbability}%
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {localAiReport.humanProbability >= 80 ? 'Passes AI Detectors' : 'Elevated Uniformity Risk'}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Cadence Burstiness
                </div>
                <div className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  {localAiReport.burstinessScore} / 100
                </div>
                <div className="text-xs text-stone-500">
                  Sentence length variance metric
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Avg Sentence Length
                </div>
                <div className="text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
                  {localAiReport.avgSentenceLength}{' '}
                  <span className="text-sm font-sans font-normal text-stone-400">words</span>
                </div>
                <div className="text-xs text-stone-500">
                  Variance: ±{localAiReport.sentenceLengthVariance}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Perplexity Grade
                </div>
                <div className="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400">
                  {localAiReport.perplexityGrade}
                </div>
                <div className="text-xs text-stone-500">
                  Token unpredictability
                </div>
              </div>
            </div>

            {/* Sentence Length Distribution */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                Rhythmic Burstiness Spectrum (Sentence Length Brackets)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {localAiReport.sentenceLengthDistribution.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-800 space-y-1"
                  >
                    <div className="text-xs font-medium text-stone-600 dark:text-slate-300">
                      {item.range}
                    </div>
                    <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                      {item.count}
                    </div>
                    <div className="text-[11px] text-stone-400">sentences</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: PERSONA PROFILE */}
        {/* ========================================================= */}
        {activeTab === 'persona' && (
          <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
              Author Voice Persona Profile &amp; Banned Phrasing Guardrails
            </h3>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Persona Name
                </label>
                <input
                  type="text"
                  value={project.stylePersona?.name || 'Grounded Atmospheric Realism'}
                  onChange={(e) =>
                    onUpdateStylePersona({
                      ...(project.stylePersona || {
                        id: 'persona-custom',
                        name: '',
                        description: '',
                        tone: '',
                        burstinessLevel: 'High',
                        sensoryLevel: 'Dense & Visceral',
                        dialogueStyle: 'Crisp & Punchy',
                        bannedWords: [],
                      }),
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Tone Directive
                </label>
                <textarea
                  rows={3}
                  value={
                    project.stylePersona?.tone ||
                    'Haunting, visceral, grounded in sensory physics, psychologically alert'
                  }
                  onChange={(e) =>
                    onUpdateStylePersona({
                      ...(project.stylePersona || {
                        id: 'persona-custom',
                        name: '',
                        description: '',
                        tone: '',
                        burstinessLevel: 'High',
                        sensoryLevel: 'Dense & Visceral',
                        dialogueStyle: 'Crisp & Punchy',
                        bannedWords: [],
                      }),
                      tone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
                  Banned AI Words &amp; Tropes
                </label>
                <div className="flex flex-wrap gap-2">
                  {(project.stylePersona?.bannedWords || [
                    'rich tapestry',
                    'testament to',
                    'delve',
                    'intertwined',
                    'palpable tension',
                    'moreover',
                    'furthermore',
                    'a symphony of',
                  ]).map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 flex items-center space-x-1"
                    >
                      <span>{w}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
