import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, FileText, AlertCircle } from 'lucide-react';
import type {
  ResearchNote, ResearchSource, ResearchClaim, ResearchPerson, ResearchQuote,
} from '../../types';

interface Props {
  notes: ResearchNote[];
  sources: ResearchSource[];
  claims: ResearchClaim[];
  people: ResearchPerson[];
  quotes: ResearchQuote[];
  onSaveNote: (note: ResearchNote) => void;
  isDarkMode: boolean;
  projectTitle?: string;
  workspaceType?: string;
}

const inputCls = 'w-full p-2 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] focus:outline-none focus:border-[#4f46e5]';
const labelCls = 'block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1';
const cardCls = 'rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517]';
const btnPrimary = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
const btnGhost = 'px-3 py-1.5 rounded-lg text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023] transition-colors';

export const ResearchAssistantPanel: React.FC<Props> = ({
  notes, sources, claims, people, quotes, onSaveNote, projectTitle, workspaceType,
}) => {
  const [mode, setMode] = useState<'note' | 'article'>('note');

  // Note draft state
  const [query, setQuery] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteResult, setNoteResult] = useState<any | null>(null);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Article state
  const [articleTitle, setArticleTitle] = useState('');
  const [targetWords, setTargetWords] = useState(1200);
  const [tone, setTone] = useState('Objective, fact-centred journalistic style');
  const [audience, setAudience] = useState('General readers');
  const [instructions, setInstructions] = useState('');
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleResult, setArticleResult] = useState<any | null>(null);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateNote = async () => {
    if (!query.trim()) return;
    setNoteLoading(true);
    setNoteError(null);
    setNoteResult(null);
    setSaved(false);
    try {
      const r = await fetch('/api/gemini/research-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, projectTitle, workspaceType }),
      });
      const data = await r.json();
      if (!r.ok || data.error) throw new Error(data.error || 'AI request failed');
      setNoteResult(data);
    } catch (e: any) {
      setNoteError(e?.message || 'Could not generate research note.');
    } finally {
      setNoteLoading(false);
    }
  };

  const saveAsNote = () => {
    if (!noteResult) return;
    const now = new Date().toISOString();
    const note: ResearchNote = {
      id: `research-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: noteResult.title,
      category: noteResult.category || 'Historical',
      content: noteResult.content,
      sourceUrl: '',
      tags: noteResult.tags || [],
      linkedCharacterIds: [],
      linkedCodexIds: [],
      linkedChapterIds: [],
      createdAt: now,
      updatedAt: now,
    };
    onSaveNote(note);
    setSaved(true);
  };

  const generateArticle = async () => {
    setArticleLoading(true);
    setArticleError(null);
    setArticleResult(null);
    try {
      const r = await fetch('/api/gemini/research-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle || 'Untitled Research Article',
          targetWordCount: targetWords,
          tone,
          audience,
          instructions,
          notes, sources, claims, quotes,
        }),
      });
      const data = await r.json();
      if (!r.ok || data.error) throw new Error(data.error || 'AI request failed');
      setArticleResult(data);
    } catch (e: any) {
      setArticleError(e?.message || 'Could not generate article.');
    } finally {
      setArticleLoading(false);
    }
  };

  const articleAsText = () => {
    if (!articleResult) return '';
    const parts: string[] = [];
    parts.push(articleResult.title || 'Untitled');
    if (articleResult.standfirst) parts.push(`\n${articleResult.standfirst}`);
    (articleResult.sections || []).forEach((s: any) => {
      parts.push(`\n## ${s.heading}\n\n${s.content}`);
    });
    if (articleResult.keyTakeaways?.length) {
      parts.push('\n## Key Takeaways\n');
      articleResult.keyTakeaways.forEach((t: string) => parts.push(`- ${t}`));
    }
    if (articleResult.citationsUsed?.length) {
      parts.push('\n## Sources Cited\n');
      articleResult.citationsUsed.forEach((c: string, i: number) => parts.push(`${i + 1}. ${c}`));
    }
    return parts.join('\n');
  };

  const copyArticle = () => {
    navigator.clipboard.writeText(articleAsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const researchHasContent = notes.length + sources.length + claims.length + quotes.length > 0;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#191918] dark:text-[#f4f4f5] mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9A7438]" /> AI Research Assistant
          </h2>
          <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">
            Generate draft notes or synthesise your collected research into a full article. Powered by Groq.
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1.5">
          <button onClick={() => setMode('note')} className={mode === 'note' ? btnPrimary : btnGhost}>
            Draft a Research Note
          </button>
          <button onClick={() => setMode('article')} className={mode === 'article' ? btnPrimary : btnGhost}>
            Write Research Article
          </button>
        </div>

        {mode === 'note' && (
          <>
            <div className={`${cardCls} p-5 space-y-3`}>
              <div>
                <label className={labelCls}>Research Question</label>
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  rows={3}
                  placeholder="e.g. How did 19th-century Bristol ships' logs record sea fog and its effect on navigation?"
                  className={inputCls}
                />
              </div>
              <button onClick={generateNote} disabled={!query.trim() || noteLoading} className={`${btnPrimary} flex items-center gap-2`}>
                {noteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {noteLoading ? 'Researching…' : 'Generate Draft Note'}
              </button>
            </div>

            {noteError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 flex gap-2 items-start text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{noteError}</span>
              </div>
            )}

            {noteResult && (
              <div className={`${cardCls} p-5 space-y-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">
                    {noteResult.category} · Draft preview
                  </span>
                  <div className="flex gap-2">
                    {!saved ? (
                      <button onClick={saveAsNote} className={`${btnPrimary} flex items-center gap-1.5`}>
                        <FileText className="w-3.5 h-3.5" /> Save as Note
                      </button>
                    ) : (
                      <span className="text-xs text-[#10b981] flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Saved</span>
                    )}
                  </div>
                </div>
                <h3 className="text-base font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">{noteResult.title}</h3>
                <p className="text-sm text-[#191918] dark:text-[#f4f4f5] leading-relaxed whitespace-pre-line">{noteResult.content}</p>
                {noteResult.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {noteResult.tags.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#d4d4d8]">#{t}</span>
                    ))}
                  </div>
                )}
                {noteResult.followUpQuestions?.length > 0 && (
                  <div>
                    <div className={labelCls}>Follow-up Questions</div>
                    <ul className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] space-y-1 list-disc list-inside">
                      {noteResult.followUpQuestions.map((q: string, i: number) => <li key={i}>{q}</li>)}
                    </ul>
                  </div>
                )}
                {noteResult.sourceSearchTerms?.length > 0 && (
                  <div>
                    <div className={labelCls}>Suggested Search Terms</div>
                    <div className="flex flex-wrap gap-1.5">
                      {noteResult.sourceSearchTerms.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono border border-[#e8e8e6] dark:border-[#28292d] text-[#6e6e6b] dark:text-[#9ca3af]">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {mode === 'article' && (
          <>
            <div className={`${cardCls} p-5 space-y-3`}>
              {!researchHasContent && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 text-xs text-amber-800 dark:text-amber-300">
                  No research items yet. Add notes, sources, claims, or quotes first — otherwise the AI has nothing to synthesise.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Article Title / Angle</label>
                  <input value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className={inputCls} placeholder="e.g. The Hidden Cost of Urban Light Rail" />
                </div>
                <div>
                  <label className={labelCls}>Target Word Count</label>
                  <input type="number" value={targetWords} onChange={e => setTargetWords(Number(e.target.value) || 1200)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Tone</label>
                  <input value={tone} onChange={e => setTone(e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Target Audience</label>
                  <input value={audience} onChange={e => setAudience(e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Additional Instructions (optional)</label>
                  <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={2} className={inputCls} placeholder="e.g. Open with a scene from the March council meeting." />
                </div>
              </div>
              <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] flex flex-wrap gap-x-4 gap-y-1">
                <span>Using: <strong>{notes.length}</strong> notes</span>
                <span><strong>{sources.length}</strong> sources</span>
                <span><strong>{claims.length}</strong> claims</span>
                <span><strong>{quotes.length}</strong> quotes</span>
              </div>
              <button onClick={generateArticle} disabled={articleLoading || !researchHasContent} className={`${btnPrimary} flex items-center gap-2`}>
                {articleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {articleLoading ? 'Writing Article…' : 'Synthesise Article'}
              </button>
            </div>

            {articleError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3 flex gap-2 items-start text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{articleError}</span>
              </div>
            )}

            {articleResult && (
              <article className={`${cardCls} p-6 space-y-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">{articleResult.title}</h2>
                    {articleResult.standfirst && (
                      <p className="text-sm italic text-[#6e6e6b] dark:text-[#9ca3af] mt-1">{articleResult.standfirst}</p>
                    )}
                  </div>
                  <button onClick={copyArticle} className={btnGhost}>
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="space-y-4 pt-2 border-t border-[#e8e8e6] dark:border-[#28292d]">
                  {(articleResult.sections || []).map((s: any, i: number) => (
                    <div key={i}>
                      <h3 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5] mb-1.5">{s.heading}</h3>
                      <p className="text-sm text-[#191918] dark:text-[#f4f4f5] leading-relaxed whitespace-pre-line">{s.content}</p>
                    </div>
                  ))}
                </div>
                {articleResult.keyTakeaways?.length > 0 && (
                  <div className="pt-3 border-t border-[#e8e8e6] dark:border-[#28292d]">
                    <div className={labelCls}>Key Takeaways</div>
                    <ul className="text-xs text-[#191918] dark:text-[#f4f4f5] space-y-1 list-disc list-inside">
                      {articleResult.keyTakeaways.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                )}
                {articleResult.citationsUsed?.length > 0 && (
                  <div className="pt-3 border-t border-[#e8e8e6] dark:border-[#28292d]">
                    <div className={labelCls}>Sources Cited</div>
                    <ol className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] space-y-1 list-decimal list-inside">
                      {articleResult.citationsUsed.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ol>
                  </div>
                )}
              </article>
            )}
          </>
        )}
      </div>
    </div>
  );
};