import React from 'react';
import { ClauseSegment, GrammarToken } from '../../types';
import { Layers, ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

interface ClauseVisualizerBarProps {
  sentence: string;
  clauses: ClauseSegment[];
  tokens: GrammarToken[];
  hoveredTokenId: string | null;
  onHoverToken: (tokenId: string | null) => void;
  selectedToken: GrammarToken | null;
  onSelectToken: (token: GrammarToken | null) => void;
  showPosTags: boolean;
  onTogglePosTags: () => void;
}

export const ClauseVisualizerBar: React.FC<ClauseVisualizerBarProps> = ({
  sentence,
  clauses,
  tokens,
  hoveredTokenId,
  onHoverToken,
  selectedToken,
  onSelectToken,
  showPosTags,
  onTogglePosTags,
}) => {
  // Clause color helpers
  const getClauseBorderColor = (type: ClauseSegment['type']) => {
    switch (type) {
      case 'principal':
        return 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200';
      case 'subordinate_adverb':
        return 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200';
      case 'subordinate_relative':
        return 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200';
      case 'subordinate_noun':
        return 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200';
      case 'coordinate':
        return 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-900 dark:text-cyan-200';
      default:
        return 'border-stone-400 bg-stone-50 dark:bg-slate-800 text-stone-800 dark:text-slate-200';
    }
  };

  const getPosTagColor = (pos: GrammarToken['pos']) => {
    switch (pos) {
      case 'noun':
      case 'pronoun':
        return 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border-sky-300';
      case 'verb':
        return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'adjective':
        return 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'adverb':
        return 'bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-300 border-pink-300';
      case 'preposition':
        return 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'conjunction':
        return 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'determiner':
        return 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-300';
      default:
        return 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Interactive Token Sentence Ribbon */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-slate-100 uppercase tracking-wider">
              Interactive Syntactic Token Breakdown
            </span>
            <span className="text-xs text-stone-500 dark:text-slate-400">
              (Hover or click any word to inspect its syntactic role)
            </span>
          </div>

          <button
            onClick={onTogglePosTags}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showPosTags
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                : 'bg-stone-100 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-400'
            }`}
          >
            {showPosTags ? 'Hide Parts of Speech' : 'Show Parts of Speech'}
          </button>
        </div>

        {/* Word Token Chips */}
        <div className="flex flex-wrap items-end gap-2 md:gap-2.5 pt-1">
          {tokens.map((token) => {
            const isHovered = hoveredTokenId === token.id;
            const isSelected = selectedToken?.id === token.id;

            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(isSelected ? null : token)}
                onMouseEnter={() => onHoverToken(token.id)}
                onMouseLeave={() => onHoverToken(null)}
                className={`group flex flex-col items-center cursor-pointer transition-all ${
                  isHovered || isSelected ? 'scale-105 z-10' : ''
                }`}
              >
                {/* Word Button */}
                <div
                  className={`px-3.5 py-2 rounded-xl font-serif text-lg md:text-xl font-medium border transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : isHovered
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-stone-50 dark:bg-slate-800/80 hover:bg-stone-100 dark:hover:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-900 dark:text-slate-100'
                  }`}
                >
                  {token.word}
                </div>

                {/* Sub-label: POS / Syntactic Role Badge */}
                {showPosTags && (
                  <span
                    className={`mt-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getPosTagColor(
                      token.pos
                    )}`}
                  >
                    {token.pos.substring(0, 4)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Clause Architecture Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clauses.map((clause, idx) => (
          <div
            key={clause.id || idx}
            className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${getClauseBorderColor(clause.type)}`}
          >
            {/* Clause Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-white/80 dark:bg-slate-900/80 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">{clause.typeName}</h4>
                  {clause.conjunction && (
                    <span className="text-xs font-semibold opacity-90">
                      Marker: <strong className="underline">"{clause.conjunction}"</strong>
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/70 font-mono font-bold">
                {clause.type.toUpperCase()}
              </span>
            </div>

            {/* Clause Exact Text */}
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-current/20 text-sm md:text-[15px] font-serif italic leading-relaxed">
              "{clause.text}"
            </div>

            {/* Syntactic Function explanation */}
            <div className="text-xs md:text-sm opacity-90 leading-relaxed">
              <strong className="font-semibold">Syntactic Function:</strong> {clause.functionInSentence}
            </div>

            {/* Subject vs Predicate Breakdown */}
            <div className="pt-2 border-t border-current/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Subject</span>
                <p className="font-semibold text-sm truncate mt-0.5">{clause.subject.headNoun}</p>
                {clause.subject.modifiers.length > 0 && (
                  <span className="text-xs opacity-75">
                    Mod: {clause.subject.modifiers.join(', ')}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Finite Verb</span>
                <p className="font-semibold text-sm truncate mt-0.5">{clause.predicate.verbPhrase}</p>
                <span className="text-xs opacity-75">
                  {clause.predicate.transitivity} &bull; {clause.predicate.directObject ? 'Takes DO' : 'No DO'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Selected Token Inspector Drawer / Callout (if clicked) */}
      {selectedToken && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-serif font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
              {selectedToken.word}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-stone-900 dark:text-slate-100 text-base">
                  "{selectedToken.word}"
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold uppercase text-xs">
                  {selectedToken.pos}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300 font-medium text-xs">
                  {selectedToken.roleLabel}
                </span>
              </div>
              <p className="text-stone-600 dark:text-slate-400 mt-1 text-sm">
                Belongs to: <strong>{selectedToken.clauseName}</strong>
                {selectedToken.modifiesTarget && (
                  <span> &bull; Modifies: <strong className="text-amber-700 dark:text-amber-300">"{selectedToken.modifiesTarget}"</strong></span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectToken(null)}
            className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 dark:hover:bg-slate-600 text-stone-800 dark:text-slate-200 font-semibold text-sm shrink-0 self-start md:self-auto cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
};
