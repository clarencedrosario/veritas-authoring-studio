import React, { useState } from 'react';
import {
  Newspaper,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Quote,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { NewsroomStoryComponents } from '../../types';

interface NewspaperDeskPanelProps {
  newsroom?: NewsroomStoryComponents;
  onUpdateNewsroom: (updated: NewsroomStoryComponents) => void;
  onRunAiCommand: (commandKey: string, customParam?: string) => void;
  isGenerating: boolean;
  isDarkMode: boolean;
}

export const NewspaperDeskPanel: React.FC<NewspaperDeskPanelProps> = ({
  newsroom,
  onUpdateNewsroom,
  onRunAiCommand,
  isGenerating,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'components' | '5w1h' | 'facts'>('brief');
  const [newQuoteSpeaker, setNewQuoteSpeaker] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuoteTitle, setNewQuoteTitle] = useState('');

  if (!newsroom) return null;

  const handleUpdate = (updates: Partial<NewsroomStoryComponents>) => {
    onUpdateNewsroom({ ...newsroom, ...updates });
  };

  const handleAddQuote = () => {
    if (!newQuoteText.trim() || !newQuoteSpeaker.trim()) return;
    const newQuote = {
      speaker: newQuoteSpeaker.trim(),
      title: newQuoteTitle.trim(),
      quote: newQuoteText.trim(),
      verified: true,
    };
    handleUpdate({ quotes: [...(newsroom.quotes || []), newQuote] });
    setNewQuoteSpeaker('');
    setNewQuoteText('');
    setNewQuoteTitle('');
  };

  const handleDeleteQuote = (index: number) => {
    handleUpdate({ quotes: newsroom.quotes.filter((_, i) => i !== index) });
  };

  return (
    <aside className="w-80 lg:w-96 border-l border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#1a0812] flex flex-col shrink-0 select-none overflow-hidden">
      {/* Newsroom Desk Header */}
      <div className="p-3.5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center">
            <Newspaper className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] block">
              Newsroom Desk
            </span>
            <span className="font-serif font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
              {newsroom.desk || 'Metro Desk'} &bull; {newsroom.status}
            </span>
          </div>
        </div>

        {/* Fact Guard Indicator */}
        <div
          title="Factual Integrity Active: Quotes and statistics locked against AI hallucination"
          className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Fact Guard</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] p-1 gap-1">
        <button
          onClick={() => setActiveTab('brief')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'brief'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Story Brief
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'components'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Story Blocks
        </button>
        <button
          onClick={() => setActiveTab('5w1h')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === '5w1h'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          5W1H
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`flex-1 py-1 text-center rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'facts'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
              : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
          }`}
        >
          Quotes ({newsroom.quotes?.length || 0})
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs select-text">
        {/* Missing Information Banner if flagged */}
        {newsroom.missingInformationFlags && newsroom.missingInformationFlags.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-200 font-bold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Missing Information Flags:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300 text-[11px]">
              {newsroom.missingInformationFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 1: STORY BRIEF */}
        {activeTab === 'brief' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                Story Slug (Wire Reference)
              </label>
              <input
                type="text"
                value={newsroom.slug}
                onChange={(e) => handleUpdate({ slug: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono font-bold uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Dateline
                </label>
                <input
                  type="text"
                  value={newsroom.dateline}
                  onChange={(e) => handleUpdate({ dateline: e.target.value })}
                  placeholder="e.g. LONDON, 28 SEP —"
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Deadline
                </label>
                <input
                  type="text"
                  value={newsroom.deadline}
                  onChange={(e) => handleUpdate({ deadline: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Byline
                </label>
                <input
                  type="text"
                  value={newsroom.byline}
                  onChange={(e) => handleUpdate({ byline: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                  Target Words
                </label>
                <input
                  type="number"
                  value={newsroom.wordTarget}
                  onChange={(e) => handleUpdate({ wordTarget: Number(e.target.value) || 500 })}
                  className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#71685E] mb-0.5">
                Editorial Workflow Status
              </label>
              <select
                value={newsroom.status}
                onChange={(e) => handleUpdate({ status: e.target.value as any })}
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold cursor-pointer"
              >
                <option value="Draft">Draft in Progress</option>
                <option value="Sub-Edited">Sub-Edited (Desk Review)</option>
                <option value="Fact-Checked">Fact-Checked & Verified</option>
                <option value="Ready for Press">Ready for Press / Wire</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 2: STORY BLOCKS */}
        {activeTab === 'components' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                Lead Paragraph (The Opening Hook)
              </label>
              <textarea
                value={newsroom.lead}
                onChange={(e) => handleUpdate({ lead: e.target.value })}
                rows={3}
                placeholder="The essential development answering Who, What, Where, When in one or two punchy sentences..."
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                Nut Graph (Central Point / Why It Matters)
              </label>
              <textarea
                value={newsroom.nutGraph}
                onChange={(e) => handleUpdate({ nutGraph: e.target.value })}
                rows={2}
                placeholder="Why the reader should care; the broader stakes or context..."
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                Standfirst Deck (25–35 Words)
              </label>
              <input
                type="text"
                value={newsroom.standfirst}
                onChange={(e) => handleUpdate({ standfirst: e.target.value })}
                placeholder="Summary deck printed under the main headline..."
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] mb-0.5">
                Pull Quote Highlight
              </label>
              <input
                type="text"
                value={newsroom.pullQuote}
                onChange={(e) => handleUpdate({ pullQuote: e.target.value })}
                placeholder="Arresting quote formatted as callout graphic..."
                className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif italic"
              />
            </div>
          </div>
        )}

        {/* TAB 3: 5W1H AUDITOR */}
        {activeTab === '5w1h' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#CBBEAC]/50">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Inverted Pyramid 5W1H Check
              </span>
              <button
                onClick={() => onRunAiCommand('newsroom_5w1h')}
                disabled={isGenerating}
                className="px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7] text-[10.5px] font-semibold hover:opacity-90 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-[#C29A52]" />
                <span>Audit 5W1H</span>
              </button>
            </div>

            {[
              { key: 'who', label: 'WHO? (Actors/Officials)', val: newsroom.who },
              { key: 'what', label: 'WHAT? (The Event/Action)', val: newsroom.what },
              { key: 'when', label: 'WHEN? (Time/Date)', val: newsroom.when },
              { key: 'where', label: 'WHERE? (Location)', val: newsroom.where },
              { key: 'why', label: 'WHY? (Underlying Cause)', val: newsroom.why },
              { key: 'how', label: 'HOW? (Mechanism/Execution)', val: newsroom.how },
            ].map((f) => (
              <div key={f.key} className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#71685E] dark:text-[#c9b9a6]">{f.label}</span>
                  {f.val ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Filled</span>
                  ) : (
                    <span className="text-amber-600 font-bold">Missing</span>
                  )}
                </div>
                <input
                  type="text"
                  value={f.val}
                  onChange={(e) => handleUpdate({ [f.key]: e.target.value } as any)}
                  className="w-full p-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: VERIFIED QUOTES & CITATIONS */}
        {activeTab === 'facts' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Verified Quotes ({newsroom.quotes?.length || 0})
              </span>
              <p className="text-[10.5px] text-[#71685E]">
                The AI will use these quotes verbatim. Never fabricate quotes!
              </p>
            </div>

            {/* Existing quotes list */}
            <div className="space-y-2">
              {newsroom.quotes?.map((q, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-1 relative group"
                >
                  <div className="font-serif italic text-xs leading-relaxed text-[#35101F] dark:text-[#F6F0E7]">
                    "{q.quote}"
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#71685E] font-medium">
                    <span>— {q.speaker}{q.title ? `, ${q.title}` : ''}</span>
                    <button
                      onClick={() => handleDeleteQuote(idx)}
                      className="text-rose-600 hover:opacity-80 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add quote form */}
            <div className="p-2.5 rounded-xl bg-[#EDE4D6]/60 dark:bg-[#200b14]/60 border border-dashed border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2">
              <span className="text-[10.5px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52] block">
                + Add Verified Quote
              </span>
              <textarea
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                placeholder="Exact statement spoken on record..."
                rows={2}
                className="w-full p-2 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newQuoteSpeaker}
                  onChange={(e) => setNewQuoteSpeaker(e.target.value)}
                  placeholder="Speaker Name"
                  className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                />
                <input
                  type="text"
                  value={newQuoteTitle}
                  onChange={(e) => setNewQuoteTitle(e.target.value)}
                  placeholder="Official Title / Affiliation"
                  className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none"
                />
              </div>
              <button
                onClick={handleAddQuote}
                disabled={!newQuoteText.trim() || !newQuoteSpeaker.trim()}
                className="w-full py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:opacity-90 disabled:opacity-40"
              >
                Save Verified Quote
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Newsroom AI Actions Bar (Fixed at bottom of panel) */}
      <div className="p-3 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] space-y-1.5 shrink-0">
        <span className="text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] block px-1">
          Newsroom AI Commands
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onRunAiCommand('newsroom_headlines')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            5 Headlines
          </button>
          <button
            onClick={() => onRunAiCommand('newsroom_lead')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Stronger Lead
          </button>
          <button
            onClick={() => onRunAiCommand('newsroom_condense')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Condense to Wire
          </button>
          <button
            onClick={() => onRunAiCommand('newsroom_standfirst')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Create Standfirst
          </button>
          <button
            onClick={() => onRunAiCommand('newsroom_pullquote')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Pull Quote
          </button>
          <button
            onClick={() => onRunAiCommand('newsroom_feature_style')}
            disabled={isGenerating}
            className="p-1.5 rounded-lg bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-medium hover:bg-[#5A1832] hover:text-[#F6F0E7] text-left transition-colors truncate"
          >
            Feature Style
          </button>
        </div>
      </div>
    </aside>
  );
};
