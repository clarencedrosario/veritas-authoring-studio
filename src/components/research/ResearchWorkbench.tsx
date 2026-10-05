import React, { useState } from 'react';
import {
  Plus, Trash2, Edit3, X, BookOpen, FileText, Users, Quote as QuoteIcon,
  AlertTriangle, Search, Link as LinkIcon, Bookmark, MapPin,
} from 'lucide-react';
import type {
  ResearchNote, ResearchSource, ResearchClaim, ResearchPerson, ResearchQuote,
  ResearchSourceType, ResearchClaimStatus, ResearchClaimConfidence,
  ResearchQuoteVerification, ResearchReliability,
} from '../../types';

export type WorkbenchSection = 'overview' | 'sources' | 'claims' | 'people' | 'quotes' | 'assistant';
import { ResearchAssistantPanel } from './ResearchAssistantPanel';

interface Props {
  section: WorkbenchSection;
  notes: ResearchNote[];
  sources: ResearchSource[];
  claims: ResearchClaim[];
  people: ResearchPerson[];
  quotes: ResearchQuote[];
  onUpdateSources: (sources: ResearchSource[]) => void;
  onUpdateClaims: (claims: ResearchClaim[]) => void;
  onUpdatePeople: (people: ResearchPerson[]) => void;
  onUpdateQuotes: (quotes: ResearchQuote[]) => void;
  onSaveNote?: (note: ResearchNote) => void;
  isDarkMode: boolean;
}

const inputCls = 'w-full p-2 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] focus:outline-none focus:border-[#4f46e5]';
const labelCls = 'block text-[10px] font-mono uppercase tracking-wider text-[#9c9c98] mb-1';
const cardCls = 'rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517]';
const btnPrimary = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white transition-colors';
const btnGhost = 'px-3 py-1.5 rounded-lg text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023] transition-colors';

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const nowIso = () => new Date().toISOString();

// ============================== OVERVIEW ==============================
const Overview: React.FC<Props> = ({ notes, sources, claims, people, quotes }) => {
  const verified = claims.filter(c => c.status === 'Verified').length;
  const needsVerify = claims.filter(c => c.status === 'Needs verification' || c.status === 'Unverified').length;
  const contradicted = claims.filter(c => c.status === 'Contradicted' || c.status === 'Outdated').length;
  const bookmarked =
    sources.filter(s => s.isBookmarked).length +
    claims.filter(c => c.isBookmarked).length +
    people.filter(p => p.isBookmarked).length +
    quotes.filter(q => q.isBookmarked).length;

  const stats = [
    { label: 'Research Notes', value: notes.length, icon: FileText, color: 'text-[#9A7438]' },
    { label: 'Sources', value: sources.length, icon: BookOpen, color: 'text-[#5A1832]' },
    { label: 'Claims', value: claims.length, icon: AlertTriangle, color: 'text-[#b45309]' },
    { label: 'People', value: people.length, icon: Users, color: 'text-[#0e7490]' },
    { label: 'Quotes', value: quotes.length, icon: QuoteIcon, color: 'text-[#7c3aed]' },
    { label: 'Bookmarked', value: bookmarked, icon: Bookmark, color: 'text-[#4f46e5]' },
  ];

  const empty = notes.length === 0 && sources.length === 0 && claims.length === 0 && people.length === 0 && quotes.length === 0;

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5] mb-1">Research Overview</h2>
          <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">Live counts derived from your current project data.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${cardCls} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">{s.label}</span>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">{s.value}</div>
              </div>
            );
          })}
        </div>

        <div className={`${cardCls} p-5`}>
          <h3 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5] mb-3">Research Health</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-[#f0f0ee] dark:border-[#242528]">
              <span className="text-[#6e6e6b] dark:text-[#9ca3af]">Verified claims</span>
              <span className="font-mono text-[#10b981]">✓ {verified}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#f0f0ee] dark:border-[#242528]">
              <span className="text-[#6e6e6b] dark:text-[#9ca3af]">Needs verification</span>
              <span className="font-mono text-[#b45309]">⚠ {needsVerify}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#f0f0ee] dark:border-[#242528]">
              <span className="text-[#6e6e6b] dark:text-[#9ca3af]">Contradicted / outdated</span>
              <span className="font-mono text-[#b91c1c]">⚠ {contradicted}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#6e6e6b] dark:text-[#9ca3af]">Claims without sources</span>
              <span className="font-mono text-[#b45309]">⚠ {claims.filter(c => c.sourceIds.length === 0).length}</span>
            </div>
          </div>
        </div>

        {empty && (
          <div className={`${cardCls} p-8 text-center`}>
            <BookOpen className="w-8 h-8 mx-auto text-[#9c9c98] mb-3" />
            <h3 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5] mb-2">Your research workbench is empty</h3>
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] max-w-md mx-auto">
              Start by adding a Source, or generate a draft note with the AI Research Assistant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================== SOURCES ==============================
const SOURCE_TYPES: ResearchSourceType[] = ['Government', 'Official document', 'Newspaper', 'Magazine', 'Journal', 'Academic paper', 'Book', 'Website', 'Interview', 'Press release', 'Company source', 'Social media', 'Database', 'Other'];
const RELIABILITY: ResearchReliability[] = ['High', 'Medium', 'Low', 'Unrated'];

const emptySource = (): ResearchSource => ({
  id: uid('src'),
  title: '',
  sourceType: 'Website',
  reliability: 'Unrated',
  tags: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

const SourcesSection: React.FC<Props> = ({ sources, onUpdateSources }) => {
  const [editing, setEditing] = useState<ResearchSource | null>(null);
  const [search, setSearch] = useState('');

  const filtered = sources.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.author || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.organisation || '').toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (!editing || !editing.title.trim()) return;
    const updated = { ...editing, updatedAt: nowIso() };
    const exists = sources.some(s => s.id === updated.id);
    onUpdateSources(exists ? sources.map(s => s.id === updated.id ? updated : s) : [updated, ...sources]);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this source?')) return;
    onUpdateSources(sources.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">Sources</h2>
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">{sources.length} reference{sources.length === 1 ? '' : 's'} stored</p>
          </div>
          <button onClick={() => setEditing(emptySource())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <Plus className="w-3.5 h-3.5" /> Add Source
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sources..." className={`${inputCls} pl-9`} />
        </div>

        {filtered.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`}>
            <BookOpen className="w-7 h-7 mx-auto text-[#9c9c98] mb-2" />
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">
              {sources.length === 0 ? 'No sources yet. Click "Add Source" to begin.' : 'No sources match your search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(s => (
              <div key={s.id} className={`${cardCls} p-4 flex items-start justify-between gap-3`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">{s.sourceType}</span>
                    {s.reliability !== 'Unrated' && (
                      <>
                        <span className="text-[#9c9c98]">·</span>
                        <span className={`text-[10px] font-mono uppercase ${s.reliability === 'High' ? 'text-[#10b981]' : s.reliability === 'Low' ? 'text-[#b91c1c]' : 'text-[#b45309]'}`}>{s.reliability} reliability</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5] truncate">{s.title || 'Untitled source'}</h3>
                  <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] truncate">
                    {[s.author, s.organisation, s.publication, s.publicationDate].filter(Boolean).join(' · ') || 'No bibliographic detail yet'}
                  </div>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#4f46e5] dark:text-[#818cf8] hover:underline inline-flex items-center gap-1 mt-1">
                      <LinkIcon className="w-3 h-3" /> {s.url.slice(0, 60)}{s.url.length > 60 ? '…' : ''}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(s)} className="p-1.5 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(s.id)} className="p-1.5 text-[#9c9c98] hover:text-[#b91c1c]" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal title={sources.some(s => s.id === editing.id) ? 'Edit Source' : 'New Source'} onClose={() => setEditing(null)} onSave={save}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Title *</label>
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className={inputCls} placeholder="Source title" />
            </div>
            <div><label className={labelCls}>Author</label><input value={editing.author || ''} onChange={e => setEditing({ ...editing, author: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Organisation</label><input value={editing.organisation || ''} onChange={e => setEditing({ ...editing, organisation: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Publication</label><input value={editing.publication || ''} onChange={e => setEditing({ ...editing, publication: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Publication Date</label><input value={editing.publicationDate || ''} onChange={e => setEditing({ ...editing, publicationDate: e.target.value })} className={inputCls} placeholder="e.g. 2026-03-14" /></div>
            <div className="col-span-2"><label className={labelCls}>URL</label><input value={editing.url || ''} onChange={e => setEditing({ ...editing, url: e.target.value })} className={inputCls} placeholder="https://..." /></div>
            <div>
              <label className={labelCls}>Source Type</label>
              <select value={editing.sourceType} onChange={e => setEditing({ ...editing, sourceType: e.target.value as ResearchSourceType })} className={inputCls}>
                {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Reliability</label>
              <select value={editing.reliability} onChange={e => setEditing({ ...editing, reliability: e.target.value as ResearchReliability })} className={inputCls}>
                {RELIABILITY.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className={labelCls}>Description / Notes</label><textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Tags (comma separated)</label><input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className={inputCls} /></div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

// ============================== CLAIMS ==============================
const CLAIM_STATUSES: ResearchClaimStatus[] = ['Unverified', 'Needs verification', 'Verified', 'Contradicted', 'Outdated'];
const CONFIDENCE: ResearchClaimConfidence[] = ['High', 'Medium', 'Low'];

const emptyClaim = (): ResearchClaim => ({
  id: uid('clm'),
  text: '',
  status: 'Unverified',
  confidence: 'Medium',
  sourceIds: [],
  tags: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

const ClaimsSection: React.FC<Props> = ({ claims, onUpdateClaims }) => {
  const [editing, setEditing] = useState<ResearchClaim | null>(null);
  const [filter, setFilter] = useState<'all' | ResearchClaimStatus>('all');

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);

  const save = () => {
    if (!editing || !editing.text.trim()) return;
    const updated = { ...editing, updatedAt: nowIso() };
    const exists = claims.some(c => c.id === updated.id);
    onUpdateClaims(exists ? claims.map(c => c.id === updated.id ? updated : c) : [updated, ...claims]);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this claim?')) return;
    onUpdateClaims(claims.filter(c => c.id !== id));
  };

  const statusColor = (s: ResearchClaimStatus) =>
    s === 'Verified' ? 'text-[#10b981]' :
    s === 'Contradicted' ? 'text-[#b91c1c]' :
    s === 'Outdated' ? 'text-[#9c9c98]' :
    'text-[#b45309]';

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">Claims & Fact Check</h2>
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">{claims.length} claim{claims.length === 1 ? '' : 's'} recorded</p>
          </div>
          <button onClick={() => setEditing(emptyClaim())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <Plus className="w-3.5 h-3.5" /> Add Claim
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? btnPrimary : btnGhost}>All ({claims.length})</button>
          {CLAIM_STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={filter === s ? btnPrimary : btnGhost}>
              {s} ({claims.filter(c => c.status === s).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`}>
            <AlertTriangle className="w-7 h-7 mx-auto text-[#9c9c98] mb-2" />
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">
              {claims.length === 0 ? 'No claims recorded yet. Add one to begin fact-checking.' : 'No claims match this filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className={`${cardCls} p-4 flex items-start justify-between gap-3`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${statusColor(c.status)}`}>{c.status}</span>
                    <span className="text-[#9c9c98]">·</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9c9c98]">{c.confidence} confidence</span>
                    {c.sourceIds.length === 0 && (<><span className="text-[#9c9c98]">·</span><span className="text-[10px] font-mono text-[#b45309]">No source</span></>)}
                  </div>
                  <p className="text-sm text-[#191918] dark:text-[#f4f4f5] leading-relaxed">{c.text}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(c)} className="p-1.5 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(c.id)} className="p-1.5 text-[#9c9c98] hover:text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal title={claims.some(c => c.id === editing.id) ? 'Edit Claim' : 'New Claim'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <div><label className={labelCls}>Claim text *</label><textarea value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} rows={4} className={inputCls} placeholder="State the factual claim as a complete sentence..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Status</label>
                <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as ResearchClaimStatus })} className={inputCls}>
                  {CLAIM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Confidence</label>
                <select value={editing.confidence} onChange={e => setEditing({ ...editing, confidence: e.target.value as ResearchClaimConfidence })} className={inputCls}>
                  {CONFIDENCE.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div><label className={labelCls}>Notes</label><textarea value={editing.notes || ''} onChange={e => setEditing({ ...editing, notes: e.target.value })} rows={3} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Reviewer</label><input value={editing.reviewer || ''} onChange={e => setEditing({ ...editing, reviewer: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Last Checked</label><input value={editing.lastChecked || ''} onChange={e => setEditing({ ...editing, lastChecked: e.target.value })} className={inputCls} placeholder="e.g. 2026-10-05" /></div>
            </div>
            <div><label className={labelCls}>Tags (comma separated)</label><input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className={inputCls} /></div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

// ============================== PEOPLE ==============================
const emptyPerson = (): ResearchPerson => ({
  id: uid('per'),
  name: '',
  sourceIds: [],
  quoteIds: [],
  relatedClaimIds: [],
  tags: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

const PeopleSection: React.FC<Props> = ({ people, onUpdatePeople }) => {
  const [editing, setEditing] = useState<ResearchPerson | null>(null);

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    const updated = { ...editing, updatedAt: nowIso() };
    const exists = people.some(p => p.id === updated.id);
    onUpdatePeople(exists ? people.map(p => p.id === updated.id ? updated : p) : [updated, ...people]);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this person?')) return;
    onUpdatePeople(people.filter(p => p.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">People</h2>
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">{people.length} person{people.length === 1 ? '' : 's'} on record</p>
          </div>
          <button onClick={() => setEditing(emptyPerson())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <Plus className="w-3.5 h-3.5" /> Add Person
          </button>
        </div>

        {people.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`}>
            <Users className="w-7 h-7 mx-auto text-[#9c9c98] mb-2" />
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">No people recorded yet. Add sources, subjects, or contacts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {people.map(p => (
              <div key={p.id} className={`${cardCls} p-4 flex items-start justify-between gap-3`}>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5] truncate">{p.name}</h3>
                  {p.role && <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] mt-0.5">{p.role}{p.organisation ? ` · ${p.organisation}` : ''}</div>}
                  {p.location && <div className="text-[11px] text-[#9c9c98] mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</div>}
                  {p.bio && <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] mt-2 line-clamp-2">{p.bio}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditing(p)} className="p-1.5 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="p-1.5 text-[#9c9c98] hover:text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal title={people.some(p => p.id === editing.id) ? 'Edit Person' : 'New Person'} onClose={() => setEditing(null)} onSave={save}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelCls}>Full Name *</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Role</label><input value={editing.role || ''} onChange={e => setEditing({ ...editing, role: e.target.value })} className={inputCls} placeholder="e.g. Councillor" /></div>
            <div><label className={labelCls}>Organisation</label><input value={editing.organisation || ''} onChange={e => setEditing({ ...editing, organisation: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Location</label><input value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Biography / Notes</label><textarea value={editing.bio || ''} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={4} className={inputCls} /></div>
            <div className="col-span-2"><label className={labelCls}>Tags (comma separated)</label><input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className={inputCls} /></div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

// ============================== QUOTES ==============================
const VERIFICATION: ResearchQuoteVerification[] = ['Unverified', 'Verified', 'Disputed'];

const emptyQuote = (): ResearchQuote => ({
  id: uid('qte'),
  text: '',
  speaker: '',
  verificationStatus: 'Unverified',
  tags: [],
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

const QuotesSection: React.FC<Props> = ({ quotes, onUpdateQuotes }) => {
  const [editing, setEditing] = useState<ResearchQuote | null>(null);

  const save = () => {
    if (!editing || !editing.text.trim()) return;
    const updated = { ...editing, updatedAt: nowIso() };
    const exists = quotes.some(q => q.id === updated.id);
    onUpdateQuotes(exists ? quotes.map(q => q.id === updated.id ? updated : q) : [updated, ...quotes]);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this quote?')) return;
    onUpdateQuotes(quotes.filter(q => q.id !== id));
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">Quotations</h2>
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">{quotes.length} quote{quotes.length === 1 ? '' : 's'} saved</p>
          </div>
          <button onClick={() => setEditing(emptyQuote())} className={`${btnPrimary} flex items-center gap-1.5`}>
            <Plus className="w-3.5 h-3.5" /> Add Quote
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className={`${cardCls} p-8 text-center`}>
            <QuoteIcon className="w-7 h-7 mx-auto text-[#9c9c98] mb-2" />
            <p className="text-xs text-[#6e6e6b] dark:text-[#9ca3af]">No quotes yet. Add an attribution to begin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map(q => (
              <div key={q.id} className={`${cardCls} p-5`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${q.verificationStatus === 'Verified' ? 'text-[#10b981]' : q.verificationStatus === 'Disputed' ? 'text-[#b91c1c]' : 'text-[#b45309]'}`}>
                    {q.verificationStatus}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => copy(`"${q.text}" — ${q.speaker}`)} className="p-1.5 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white" title="Copy quote"><FileText className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setEditing(q)} className="p-1.5 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(q.id)} className="p-1.5 text-[#9c9c98] hover:text-[#b91c1c]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <blockquote className="text-sm font-serif italic text-[#191918] dark:text-[#f4f4f5] leading-relaxed border-l-2 border-[#4f46e5] pl-3">
                  "{q.text}"
                </blockquote>
                <div className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] mt-2">
                  — <strong>{q.speaker}</strong>{q.speakerRole ? `, ${q.speakerRole}` : ''}{q.organisation ? ` (${q.organisation})` : ''}{q.date ? ` · ${q.date}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditModal title={quotes.some(q => q.id === editing.id) ? 'Edit Quote' : 'New Quote'} onClose={() => setEditing(null)} onSave={save}>
          <div className="space-y-3">
            <div><label className={labelCls}>Quotation *</label><textarea value={editing.text} onChange={e => setEditing({ ...editing, text: e.target.value })} rows={4} className={inputCls} placeholder="The exact words spoken or written..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Speaker *</label><input value={editing.speaker} onChange={e => setEditing({ ...editing, speaker: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Role</label><input value={editing.speakerRole || ''} onChange={e => setEditing({ ...editing, speakerRole: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Organisation</label><input value={editing.organisation || ''} onChange={e => setEditing({ ...editing, organisation: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Date</label><input value={editing.date || ''} onChange={e => setEditing({ ...editing, date: e.target.value })} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Source URL</label><input value={editing.url || ''} onChange={e => setEditing({ ...editing, url: e.target.value })} className={inputCls} /></div>
            <div><label className={labelCls}>Context / Notes</label><textarea value={editing.context || ''} onChange={e => setEditing({ ...editing, context: e.target.value })} rows={3} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Verification Status</label>
              <select value={editing.verificationStatus} onChange={e => setEditing({ ...editing, verificationStatus: e.target.value as ResearchQuoteVerification })} className={inputCls}>
                {VERIFICATION.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Tags (comma separated)</label><input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className={inputCls} /></div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

// ============================== SHARED MODAL ==============================
const EditModal: React.FC<{ title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }> = ({ title, onClose, onSave, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
    <div className={`${cardCls} w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col`} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e8e6] dark:border-[#28292d] shrink-0">
        <h3 className="text-sm font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">{title}</h3>
        <button onClick={onClose} className="p-1 text-[#9c9c98] hover:text-[#191918] dark:hover:text-white"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 overflow-y-auto flex-1">{children}</div>
      <div className="px-5 py-3 border-t border-[#e8e8e6] dark:border-[#28292d] flex justify-end gap-2 shrink-0">
        <button onClick={onClose} className={btnGhost}>Cancel</button>
        <button onClick={onSave} className={btnPrimary}>Save</button>
      </div>
    </div>
  </div>
);

// ============================== MAIN DISPATCHER ==============================
export const ResearchWorkbench: React.FC<Props> = (props) => {
  switch (props.section) {
    case 'overview': return <Overview {...props} />;
    case 'sources': return <SourcesSection {...props} />;
    case 'claims': return <ClaimsSection {...props} />;
    case 'people': return <PeopleSection {...props} />;
    case 'quotes': return <QuotesSection {...props} />;
    case 'assistant':
      return (
        <ResearchAssistantPanel
          notes={props.notes}
          sources={props.sources}
          claims={props.claims}
          people={props.people}
          quotes={props.quotes}
          onSaveNote={props.onSaveNote || (() => {})}
          isDarkMode={props.isDarkMode}
        />
      );
    default: return null;
  }
};