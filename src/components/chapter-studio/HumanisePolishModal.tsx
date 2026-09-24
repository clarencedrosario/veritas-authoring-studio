import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Check,
  Copy,
  ArrowRight,
  RefreshCw,
  X,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { StudioChapter } from '../../types';

export type HumaniseStyle =
  | 'natural'
  | 'conversational'
  | 'academic'
  | 'textbook'
  | 'child_friendly'
  | 'concise'
  | 'engaging'
  | 'professional';

export type HumaniseScope = 'selection' | 'paragraph' | 'section' | 'chapter';

interface HumanisePolishModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  selectedText?: string;
  currentSectionTitle?: string;
  currentSectionText?: string;
  entireChapterText?: string;
  onApplyPolishedText: (newText: string, scope: HumaniseScope) => void;
  isDarkMode?: boolean;
}

const STYLE_OPTIONS: Array<{
  id: HumaniseStyle;
  label: string;
  description: string;
  badge: string;
}> = [
  {
    id: 'natural',
    label: 'Natural',
    description: 'Organic human cadence, varied sentence lengths, and natural authorial flow.',
    badge: 'Popular',
  },
  {
    id: 'conversational',
    label: 'Conversational',
    description: 'Warm, approachable, teacher-to-student direct instructional voice.',
    badge: 'Approachable',
  },
  {
    id: 'textbook',
    label: 'Textbook',
    description: 'Structured pedagogical exposition with clear definitions and signposts.',
    badge: 'Standard',
  },
  {
    id: 'academic',
    label: 'Academic',
    description: 'Scholarly precision, formal linguistic rigour, and elevated syntax.',
    badge: 'Rigorous',
  },
  {
    id: 'child_friendly',
    label: 'Child-Friendly',
    description: 'Simple vocabulary, concrete relatable analogies, supportive tone.',
    badge: 'Primary',
  },
  {
    id: 'concise',
    label: 'Concise',
    description: 'Lean and punchy. Strips fluff and redundant adverbs while keeping all facts.',
    badge: 'Tight',
  },
  {
    id: 'engaging',
    label: 'Engaging',
    description: 'Dynamic hooks, lively real-world examples, and thought-provoking rhythm.',
    badge: 'Vibrant',
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Balanced, standard publishing house quality with flawless register.',
    badge: 'Editorial',
  },
];

export const HumanisePolishModal: React.FC<HumanisePolishModalProps> = ({
  isOpen,
  onClose,
  chapter,
  selectedText = '',
  currentSectionTitle = '',
  currentSectionText = '',
  entireChapterText = '',
  onApplyPolishedText,
}) => {
  // Determine initial scope
  const defaultScope: HumaniseScope = selectedText && selectedText.trim().length > 10
    ? 'selection'
    : currentSectionText && currentSectionText.trim().length > 0
    ? 'section'
    : 'chapter';

  const [scope, setScope] = useState<HumaniseScope>(defaultScope);
  const [style, setStyle] = useState<HumaniseStyle>('natural');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [polishedResult, setPolishedResult] = useState<string | null>(null);
  const [changesSummary, setChangesSummary] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Resolve source text based on scope
  const getSourceText = (): string => {
    switch (scope) {
      case 'selection':
        return selectedText || currentSectionText.slice(0, 300);
      case 'paragraph': {
        const paras = (currentSectionText || entireChapterText).split('\n\n').filter(Boolean);
        return paras[0] || currentSectionText || 'Sample text';
      }
      case 'section':
        return currentSectionText || entireChapterText;
      case 'chapter':
        return entireChapterText || currentSectionText;
      default:
        return currentSectionText;
    }
  };

  const sourceText = getSourceText();

  const handleExecuteHumanise = async () => {
    if (!sourceText.trim()) {
      setErrorNotice('No manuscript text available in this scope to polish.');
      return;
    }

    setIsLoading(true);
    setErrorNotice(null);
    try {
      const res = await fetch('/api/chapter-studio/humanize-manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          style,
          scope,
          board: chapter.curriculumBoard || chapter.systemId || 'CBSE',
          classLevel: chapter.equivalentClass || 'Class 6',
          subject: chapter.subject || 'English Grammar',
          chapterTitle: chapter.title,
          customInstructions,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.polishedText) {
        setPolishedResult(data.polishedText);
        setChangesSummary(data.changesSummary || 'Prose rhythm and authorial cadence polished.');
      } else {
        throw new Error(data.error || 'Unable to polish text');
      }
    } catch (err: any) {
      console.error('Humanise error:', err);
      setErrorNotice(err.message || 'Failed to humanise text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!polishedResult) return;
    onApplyPolishedText(polishedResult, scope);
    onClose();
  };

  const handleCopy = () => {
    if (!polishedResult) return;
    navigator.clipboard.writeText(polishedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalWordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const polishedWordCount = polishedResult?.trim() ? polishedResult.trim().split(/\s+/).length : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-2xl text-[#292521] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] flex items-center justify-between bg-[#EDE4D6] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-base text-[#35101F]">
                  Humanise &amp; Polish Prose
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFFDF8] text-[#5A1832] border border-[#C29A52]/40">
                  {chapter.equivalentClass} • {chapter.systemId || 'CBSE'}
                </span>
              </div>
              <p className="text-xs text-[#71685E]">
                Transform AI-assisted drafts into natural, polished authorial prose while preserving pedagogical accuracy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#CBBEAC]/40 text-[#71685E] hover:text-[#292521] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scope Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-2 font-mono">
              1. Select Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setScope('selection')}
                disabled={!selectedText}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  scope === 'selection'
                    ? 'bg-[#5A1832] text-[#FFFDF8] border-[#5A1832] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#71685E] border-[#CBBEAC] hover:border-[#C29A52] disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <div className="font-bold">Selection</div>
                <div className="text-[10px] opacity-80 truncate">
                  {selectedText ? `${selectedText.split(/\s+/).length} words selected` : 'No text selected'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('paragraph')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  scope === 'paragraph'
                    ? 'bg-[#5A1832] text-[#FFFDF8] border-[#5A1832] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#71685E] border-[#CBBEAC] hover:border-[#C29A52]'
                }`}
              >
                <div className="font-bold">Paragraph</div>
                <div className="text-[10px] opacity-80 truncate">Active paragraph block</div>
              </button>

              <button
                type="button"
                onClick={() => setScope('section')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  scope === 'section'
                    ? 'bg-[#5A1832] text-[#FFFDF8] border-[#5A1832] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#71685E] border-[#CBBEAC] hover:border-[#C29A52]'
                }`}
              >
                <div className="font-bold">Current Section</div>
                <div className="text-[10px] opacity-80 truncate">
                  {currentSectionTitle || 'Active section'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('chapter')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                  scope === 'chapter'
                    ? 'bg-[#5A1832] text-[#FFFDF8] border-[#5A1832] shadow-xs'
                    : 'bg-[#FFFDF8] text-[#71685E] border-[#CBBEAC] hover:border-[#C29A52]'
                }`}
              >
                <div className="font-bold">Entire Chapter</div>
                <div className="text-[10px] opacity-80 truncate">All sections combined</div>
              </button>
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-2 font-mono">
              2. Authorial Style / Tone
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStyle(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    style === opt.id
                      ? 'border-[#C29A52] bg-[#F6F0E7] shadow-xs ring-1 ring-[#C29A52]'
                      : 'border-[#CBBEAC] bg-[#FFFDF8] hover:border-[#C29A52]/60 hover:bg-[#F6F0E7]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#35101F]">{opt.label}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71685E] leading-snug line-clamp-2">
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instructions (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A1832] mb-1 font-mono">
              3. Author's Custom Polish Directive (Optional)
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Make the classroom examples more vivid; tighten introductory explanations..."
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Side-by-Side Comparison / Result Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Source */}
            <div className="p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] space-y-2">
              <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#71685E] font-mono">
                  Original Manuscript ({originalWordCount} words)
                </span>
                <span className="text-[10px] text-[#71685E] italic">Current draft</span>
              </div>
              <div className="max-h-56 overflow-y-auto text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line pr-2">
                {sourceText || <span className="italic text-[#71685E]">No text found in selected scope.</span>}
              </div>
            </div>

            {/* Polished Result */}
            <div className="p-4 rounded-xl border border-[#C29A52]/60 bg-[#FFFDF8] space-y-2 relative shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#5A1832] font-mono flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Polished Authorial Prose</span>
                </span>
                {polishedResult && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    {polishedWordCount} words
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="h-56 flex flex-col items-center justify-center space-y-2 text-[#71685E]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C29A52]" />
                  <p className="text-xs font-medium">Polishing and humanising manuscript prose...</p>
                  <p className="text-[10px] italic">Calibrating rhythm for {chapter.equivalentClass}...</p>
                </div>
              ) : polishedResult ? (
                <div className="space-y-3">
                  <div className="max-h-48 overflow-y-auto text-xs font-serif text-[#292521] leading-relaxed whitespace-pre-line pr-2">
                    {polishedResult}
                  </div>
                  {changesSummary && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{changesSummary}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center text-center text-[#71685E] p-4">
                  <Wand2 className="w-8 h-8 text-[#CBBEAC] mb-2" />
                  <p className="text-xs font-medium">Click "Humanise &amp; Polish" below to generate natural authorial prose.</p>
                  <p className="text-[10px] text-[#71685E] mt-1">Preserves 100% of educational meaning and grammar rules.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#CBBEAC] bg-[#EDE4D6] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[#71685E]">
            Context: <strong className="text-[#35101F]">{chapter.curriculumBoard || chapter.systemId || 'CBSE'}</strong> • <strong className="text-[#35101F]">{chapter.equivalentClass}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExecuteHumanise}
              disabled={isLoading || !sourceText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] active:bg-[#250813] transition-all cursor-pointer shadow-xs border border-[#C29A52]/40 disabled:opacity-50 inline-flex items-center space-x-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Polishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>{polishedResult ? 'Re-polish' : 'Humanise & Polish'}</span>
                </>
              )}
            </button>

            {polishedResult && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#292521] border border-[#CBBEAC] transition-colors cursor-pointer inline-flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Manuscript</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#71685E] hover:text-[#292521] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
