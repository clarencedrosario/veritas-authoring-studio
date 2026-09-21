import React, { useState } from 'react';
import {
  SentenceDiagramData,
  GrammarToken,
  GrammarClassLevel,
} from '../../types';
import { BENCHMARK_SENTENCE_PRESETS } from '../../utils/sentenceDiagramPresets';
import { heuristicParseSentence } from '../../utils/sentenceParserEngine';
import { ReedKelloggCanvas } from './ReedKelloggCanvas';
import { SyntaxTreeCanvas } from './SyntaxTreeCanvas';
import { ClauseVisualizerBar } from './ClauseVisualizerBar';
import { SyntaxChallengeMode } from './SyntaxChallengeMode';
import {
  Sparkles,
  GitFork,
  Layers,
  HelpCircle,
  BookOpen,
  Send,
  Loader2,
  Printer,
  ChevronDown,
  Info,
  Maximize2,
  Palette,
} from 'lucide-react';

interface SentenceDiagrammerStudioProps {
  initialSentence?: string;
  targetClass?: GrammarClassLevel;
  isDarkMode?: boolean;
  onSendToTextbook?: (diagram: SentenceDiagramData) => void;
}

export const SentenceDiagrammerStudio: React.FC<SentenceDiagrammerStudioProps> = ({
  initialSentence,
  targetClass,
  isDarkMode,
  onSendToTextbook,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    BENCHMARK_SENTENCE_PRESETS[0].id
  );
  const [currentDiagram, setCurrentDiagram] = useState<SentenceDiagramData>(
    BENCHMARK_SENTENCE_PRESETS[0]
  );
  const [customInput, setCustomInput] = useState<string>(
    initialSentence || BENCHMARK_SENTENCE_PRESETS[0].sentence
  );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reed_kellogg' | 'syntax_tree' | 'clauses' | 'challenge'>(
    'reed_kellogg'
  );
  const [canvasTheme, setCanvasTheme] = useState<'blackboard' | 'parchment' | 'modern'>('modern');
  const [hoveredTokenId, setHoveredTokenId] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<GrammarToken | null>(null);
  const [showPosTags, setShowPosTags] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = BENCHMARK_SENTENCE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setCurrentDiagram(found);
      setCustomInput(found.sentence);
      setSelectedToken(null);
      setStatusMessage(null);
    }
  };

  // Fast heuristic parse
  const handleParseCustomHeuristic = () => {
    if (!customInput.trim()) return;
    const parsed = heuristicParseSentence(customInput, targetClass);
    setCurrentDiagram(parsed);
    setSelectedPresetId('custom');
    setSelectedToken(null);
    setStatusMessage('Instant syntactic parse completed.');
  };

  // AI Deep parse with Gemini
  const handleParseWithGemini = async () => {
    if (!customInput.trim()) return;
    setIsAiLoading(true);
    setStatusMessage('Analyzing sentence with Gemini Linguist AI...');

    try {
      const response = await fetch('/api/gemini/parse-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: customInput.trim(),
          targetClass: targetClass || currentDiagram.classLevelRecommendation,
        }),
      });

      if (!response.ok) {
        throw new Error('AI parse unavailable. Falling back to rule-based engine.');
      }

      const data = await response.json();
      if (data && data.classification && data.clauses) {
        const enhancedDiagram: SentenceDiagramData = {
          id: `ai-${Date.now()}`,
          sentence: customInput.trim(),
          classification: data.classification,
          classLevelRecommendation: data.classLevelRecommendation || 'Class 8',
          strand: data.strand || 'Syntactic Architecture',
          pedagogicalNotes: data.pedagogicalNotes || 'AI parsed constituent sentence.',
          clauses: data.clauses,
          tokens: data.tokens || [],
          reedKellogg: data.reedKellogg || [],
          syntaxTree: data.syntaxTree || {
            id: 'root',
            label: 'S',
            fullLabel: 'Sentence',
            category: 'clause',
            text: customInput.trim(),
          },
        };
        setCurrentDiagram(enhancedDiagram);
        setSelectedPresetId('custom');
        setStatusMessage('Linguist-grade Gemini diagram generated successfully!');
      } else {
        handleParseCustomHeuristic();
      }
    } catch (err: any) {
      console.warn(err);
      handleParseCustomHeuristic();
      setStatusMessage('Parsed using local syntactic grammar heuristics.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrintDiagram = () => {
    window.print();
  };

  const getClassificationBadge = (cls: SentenceDiagramData['classification']) => {
    switch (cls) {
      case 'simple':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'compound':
        return 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
      case 'complex':
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
      case 'compound-complex':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-stone-50/50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <GitFork className="w-5 h-5" />
            </div>
            <h2 className="veritas-page-title text-2xl md:text-3xl font-serif font-bold text-stone-900 dark:text-slate-100">
              Sentence Diagrammer &amp; Clause Visualizer
            </h2>
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getClassificationBadge(
                currentDiagram.classification
              )}`}
            >
              {currentDiagram.classification} sentence
            </span>
          </div>
          <p className="veritas-body text-base text-stone-600 dark:text-slate-400 mt-2 leading-relaxed">
            Interactive syntax architecture &bull; Traditional Reed-Kellogg baselines &bull; Constituent phrase structure trees &bull; K-12 benchmark bank
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Theme Selector for Canvas */}
          {activeTab === 'reed_kellogg' && (
            <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 flex items-center space-x-1 shadow-2xs">
              <Palette className="w-4 h-4 text-stone-400 ml-2 mr-1" />
              <button
                onClick={() => setCanvasTheme('modern')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  canvasTheme === 'modern'
                    ? 'bg-indigo-600 text-white'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Modern
              </button>
              <button
                onClick={() => setCanvasTheme('blackboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  canvasTheme === 'blackboard'
                    ? 'bg-emerald-900 text-emerald-100'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Chalkboard
              </button>
              <button
                onClick={() => setCanvasTheme('parchment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  canvasTheme === 'parchment'
                    ? 'bg-amber-900 text-amber-100'
                    : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Parchment
              </button>
            </div>
          )}

          {/* Print / Export Button */}
          <button
            onClick={handlePrintDiagram}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800 text-sm font-semibold text-stone-700 dark:text-slate-300 flex items-center space-x-2 shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Worksheet</span>
          </button>
        </div>
      </div>

      {/* Preset Selector + Custom Sentence Bar */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-slate-100 uppercase tracking-wider">
              K-12 Curated Benchmark Presets
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-stone-500 dark:text-slate-400">Class Level:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-slate-200 font-mono">
              {currentDiagram.classLevelRecommendation}
            </span>
          </div>
        </div>

        {/* Preset Selector Buttons Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {BENCHMARK_SENTENCE_PRESETS.map((p) => {
            const isSel = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{p.classLevelRecommendation}</span>
                <span className="opacity-75 font-normal">&bull;</span>
                <span className="capitalize">{p.classification}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Input Box */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleParseCustomHeuristic()}
              placeholder="Enter any sentence to diagram (e.g., 'Although it rained, we won the match...')"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100 text-base font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleParseCustomHeuristic}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 dark:hover:bg-slate-600 text-stone-800 dark:text-slate-200 font-semibold text-sm transition-all whitespace-nowrap cursor-pointer"
            >
              Parse Rules
            </button>

            <button
              onClick={handleParseWithGemini}
              disabled={isAiLoading || !customInput.trim()}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse with Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 pt-0.5">
            <Info className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Pedagogical Strand & Teaching Guidance Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Grammar Strand:
            </span>
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">
              {currentDiagram.strand}
            </span>
          </div>
          <p className="veritas-body text-sm md:text-[15px] text-stone-700 dark:text-slate-300 leading-relaxed max-w-4xl">
            {currentDiagram.pedagogicalNotes}
          </p>
        </div>

        {onSendToTextbook && (
          <button
            onClick={() => onSendToTextbook(currentDiagram)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shrink-0 self-start md:self-center shadow-xs cursor-pointer"
          >
            Insert into Chapter Notes
          </button>
        )}
      </div>

      {/* View Mode Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('reed_kellogg')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'reed_kellogg'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Reed-Kellogg Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('syntax_tree')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'syntax_tree'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Constituent Syntax Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('clauses')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'clauses'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Clause Architecture &amp; Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab('challenge')}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'challenge'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Syntax Challenge Quiz</span>
        </button>
      </div>

      {/* Main Diagramming Canvas Container */}
      <div className="space-y-4">
        {activeTab === 'reed_kellogg' && (
          <div className="space-y-4">
            <ReedKelloggCanvas
              nodes={currentDiagram.reedKellogg}
              tokens={currentDiagram.tokens}
              hoveredTokenId={hoveredTokenId}
              onHoverToken={setHoveredTokenId}
              onSelectToken={setSelectedToken}
              canvasTheme={canvasTheme}
            />

            {/* Quick Word Ribbon below canvas for bidirectional hover highlighting */}
            <ClauseVisualizerBar
              sentence={currentDiagram.sentence}
              clauses={currentDiagram.clauses}
              tokens={currentDiagram.tokens}
              hoveredTokenId={hoveredTokenId}
              onHoverToken={setHoveredTokenId}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              showPosTags={showPosTags}
              onTogglePosTags={() => setShowPosTags(!showPosTags)}
            />
          </div>
        )}

        {activeTab === 'syntax_tree' && (
          <div className="space-y-4">
            <SyntaxTreeCanvas
              rootNode={currentDiagram.syntaxTree}
              tokens={currentDiagram.tokens}
              hoveredTokenId={hoveredTokenId}
              onHoverToken={setHoveredTokenId}
              onSelectToken={setSelectedToken}
            />

            <ClauseVisualizerBar
              sentence={currentDiagram.sentence}
              clauses={currentDiagram.clauses}
              tokens={currentDiagram.tokens}
              hoveredTokenId={hoveredTokenId}
              onHoverToken={setHoveredTokenId}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              showPosTags={showPosTags}
              onTogglePosTags={() => setShowPosTags(!showPosTags)}
            />
          </div>
        )}

        {activeTab === 'clauses' && (
          <ClauseVisualizerBar
            sentence={currentDiagram.sentence}
            clauses={currentDiagram.clauses}
            tokens={currentDiagram.tokens}
            hoveredTokenId={hoveredTokenId}
            onHoverToken={setHoveredTokenId}
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
            showPosTags={showPosTags}
            onTogglePosTags={() => setShowPosTags(!showPosTags)}
          />
        )}

        {activeTab === 'challenge' && (
          <SyntaxChallengeMode
            currentDiagram={currentDiagram}
            onNextPreset={() => {
              const currentIdx = BENCHMARK_SENTENCE_PRESETS.findIndex((p) => p.id === selectedPresetId);
              const nextPreset = BENCHMARK_SENTENCE_PRESETS[(currentIdx + 1) % BENCHMARK_SENTENCE_PRESETS.length];
              handleSelectPreset(nextPreset.id);
            }}
          />
        )}
      </div>
    </div>
  );
};
