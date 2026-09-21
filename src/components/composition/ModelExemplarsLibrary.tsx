import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Copy,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';
import { CompositionPrompt, GrammarClassLevel, CompositionGenre } from '../../types';
import { EXEMPLAR_PROMPTS } from '../../utils/compositionData';

interface ModelExemplarsLibraryProps {
  onSelectPromptForStudio: (prompt: CompositionPrompt) => void;
  isDarkMode: boolean;
  selectedClass: GrammarClassLevel;
}

export const ModelExemplarsLibrary: React.FC<ModelExemplarsLibraryProps> = ({
  onSelectPromptForStudio,
  isDarkMode,
  selectedClass,
}) => {
  const [filterGenre, setFilterGenre] = useState<'all' | CompositionGenre>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(EXEMPLAR_PROMPTS[0].id);
  const [showMarkingOverlay, setShowMarkingOverlay] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const filteredPrompts = EXEMPLAR_PROMPTS.filter((p) => {
    if (filterGenre !== 'all' && p.genre !== filterGenre) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.scenarioDescription.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activePrompt =
    EXEMPLAR_PROMPTS.find((p) => p.id === selectedPromptId) || EXEMPLAR_PROMPTS[0];

  const handleCopyModel = () => {
    if (!activePrompt.sampleSolution) return;
    navigator.clipboard.writeText(activePrompt.sampleSolution.modelText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model compositions..."
              className={`pl-8 pr-3 py-1.5 rounded-lg text-xs border transition-all ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500'
                  : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400'
              }`}
            />
          </div>

          <div className="flex items-center space-x-1.5">
            {[
              { id: 'all', label: 'All Genres' },
              { id: 'formal_letter', label: 'Formal Letters' },
              { id: 'notice', label: 'Notice Writing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterGenre(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterGenre === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMarkingOverlay(!showMarkingOverlay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              showMarkingOverlay
                ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : isDarkMode
                ? 'border-slate-700 text-slate-400'
                : 'border-stone-200 text-stone-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Marking Scheme Callouts: {showMarkingOverlay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleCopyModel}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition-all ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDarkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Catalog of Exemplars + Right Exemplar Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Prompts List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredPrompts.map((prompt) => {
            const isSelected = prompt.id === selectedPromptId;
            return (
              <div
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-amber-50/60 border-amber-500 shadow-xs ring-1 ring-amber-500/30'
                    : isDarkMode
                    ? 'bg-[#151c28] border-slate-700/80 hover:bg-slate-800/50'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      prompt.genre === 'notice'
                        ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {prompt.genre === 'notice' ? 'Notice (50w)' : 'Formal Letter'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {prompt.classLevels[0]}–{prompt.classLevels[prompt.classLevels.length - 1]}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-stone-900 dark:text-white mb-1">
                  {prompt.title}
                </h4>

                <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {prompt.scenarioDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Exemplar Deep Dive (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className={`p-6 rounded-xl border ${
              isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
            }`}
          >
            {/* Prompt Header Card */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-5 border-b border-stone-200 dark:border-slate-700">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Exam Prompt & Model Answer
                  </span>
                  <span className="text-xs text-stone-400">•</span>
                  <span className="text-xs text-stone-500 dark:text-slate-400">
                    Target: {activePrompt.prescribedWordCount.target} words (Max {activePrompt.maxMarks} Marks)
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {activePrompt.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed italic">
                  "{activePrompt.scenarioDescription}"
                </p>
              </div>

              <button
                onClick={() => onSelectPromptForStudio(activePrompt)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <span>Load in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Model Solution with Authentic Typography & Marking Annotations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Formatted Text Paper (7 cols) */}
              <div
                className={`lg:col-span-7 p-5 rounded-lg border font-serif text-xs leading-relaxed transition-all relative ${
                  activePrompt.genre === 'notice'
                    ? isDarkMode
                      ? 'bg-slate-900 border-2 border-slate-500'
                      : 'bg-white border-2 border-stone-800'
                    : isDarkMode
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-[#fffdfa] border-stone-200'
                }`}
              >
                <div className="whitespace-pre-line text-stone-800 dark:text-slate-200">
                  {activePrompt.sampleSolution?.modelText}
                </div>
              </div>

              {/* Rubric Callout Explanations (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-slate-300">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Why This Achieves Full Marks</span>
                </div>

                <div className="space-y-2.5">
                  {activePrompt.sampleSolution?.markingAnnotations?.map((anno, aIdx) => (
                    <div
                      key={aIdx}
                      className={`p-3 rounded-lg border text-xs ${
                        isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-stone-900 dark:text-white">{anno.element}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                          +{anno.marksEarned}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-slate-400 leading-relaxed">
                        {anno.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Rubric Guidelines Box */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-stone-700 dark:text-slate-300">
                  <div className="font-bold text-amber-700 dark:text-amber-300 mb-1">
                    Board Marking Formula:
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <div>Format: <strong>{activePrompt.rubric.formatMarks} Mark</strong></div>
                    <div>Content: <strong>{activePrompt.rubric.contentMarks} Marks</strong></div>
                    <div>Expression & Style: <strong>{activePrompt.rubric.expressionMarks} Marks</strong></div>
                    <div className="text-stone-500 dark:text-slate-400 pt-1">
                      {activePrompt.rubric.accuracyPenaltyNotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
