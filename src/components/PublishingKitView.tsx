import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  User,
  Zap,
  Edit3,
} from 'lucide-react';
import { NovelProject, QueryLetterData } from '../types';

interface PublishingKitViewProps {
  project: NovelProject;
  onUpdateQueryPitch: (data: QueryLetterData) => void;
  isDarkMode: boolean;
}

export const PublishingKitView: React.FC<PublishingKitViewProps> = ({
  project,
  onUpdateQueryPitch,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'synopsis1' | 'synopsis5'>('letter');
  const [copied, setCopied] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const queryData: QueryLetterData = project.queryPitch || {
    targetAgentName: 'Literary Agent Name',
    agencyName: 'Agency Name',
    hook: project.logline,
    genre: project.genre,
    wordCount: project.targetTotalWords,
    compTitles: 'PIRANESI meets THE HAUNTING OF HILL HOUSE',
    protagonistIntro: '',
    incitingIncident: '',
    stakesAndChoice: '',
    authorBio: `Author bio for ${project.authorName}...`,
    synopsisOnePage: project.synopsis || '',
    synopsisFivePage: '',
  };

  const handleUpdateField = (field: keyof QueryLetterData, val: any) => {
    onUpdateQueryPitch({
      ...queryData,
      [field]: val,
    });
  };

  // Assembled standard publishing query letter
  const assembledQueryLetter = `Dear ${queryData.targetAgentName || 'Agent'},

I am writing to seek representation for ${project.title.toUpperCase()}, a ${queryData.genre} complete at ${queryData.wordCount.toLocaleString()} words. Given your interest in speculative suspense and atmospheric literary fiction, I thought this would be a natural fit for your list.

${queryData.hook}

${queryData.protagonistIntro}

${queryData.incitingIncident}

${queryData.stakesAndChoice}

Fans of ${queryData.compTitles} will appreciate its high-tension atmospheric architecture and psychological depth.

${queryData.authorBio}

Thank you for your time and consideration. The complete manuscript is available upon request.

Sincerely,

${project.authorName}`;

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAiDraftQuery = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'continue',
          prompt: `Draft a professional, compelling, traditional publishing query letter for an agent.
Novel Title: ${project.title}
Genre: ${project.genre}
Logline: ${project.logline}
Protagonist: ${project.characters[0]?.name} (${project.characters[0]?.role} - ${project.characters[0]?.personality})
Antagonist/Stakes: ${project.characters[1]?.name || 'Mystery'}
Plot beats: ${project.plotBeats.map((b) => b.title).join(', ')}

Structure the letter with:
1. One-sentence hook
2. Protagonist Introduction & Inciting Incident paragraph
3. Escalating Stakes & Central Dilemma paragraph
4. Comp titles comparison
Keep it punchy, authentic, and without generic buzzwords.`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        // Populate fields from result
        handleUpdateField('hook', project.logline);
        handleUpdateField('protagonistIntro', data.result);
      }
    } catch (e) {
      console.warn('AI query draft error:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div id="publishing-kit-stage" className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div
        className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-stone-100/60 border-stone-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-slate-100">
              Publishing Pitch &amp; Agent Query Kit
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Traditional literary agent query builder, comps formula, and 1-page/5-page synopsis studio
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleAiDraftQuery}
            disabled={isAiGenerating}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAiGenerating ? 'Drafting Pitch...' : 'AI Synthesize Pitch'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`px-6 py-2.5 border-b flex items-center space-x-2 text-xs ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-stone-50 border-stone-200'
        }`}
      >
        <button
          onClick={() => setActiveTab('letter')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'letter'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800'
          }`}
        >
          1. Agent Query Letter
        </button>
        <button
          onClick={() => setActiveTab('synopsis1')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'synopsis1'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800'
          }`}
        >
          2. 1-Page Synopsis (With Spoilers)
        </button>
        <button
          onClick={() => setActiveTab('synopsis5')}
          className={`px-3 py-1 rounded-md font-medium transition-colors ${
            activeTab === 'synopsis5'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-800'
          }`}
        >
          3. 5-Page Detailed Outline
        </button>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'letter' ? (
          /* Query Letter Editor & Live Letterhead Preview */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Inputs Form */}
            <div
              className={`lg:w-1/2 p-6 overflow-y-auto space-y-4 border-r transition-colors ${
                isDarkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-stone-50/50 border-stone-200'
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Query Letter Metadata
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                    Target Agent Name
                  </label>
                  <input
                    type="text"
                    value={queryData.targetAgentName}
                    onChange={(e) => handleUpdateField('targetAgentName', e.target.value)}
                    placeholder="e.g. Victoria Marlo"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    value={queryData.agencyName}
                    onChange={(e) => handleUpdateField('agencyName', e.target.value)}
                    placeholder="e.g. Marlo & Finch Literary"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Elevator Pitch / Hook (1 Sentence)
                </label>
                <textarea
                  rows={2}
                  value={queryData.hook}
                  onChange={(e) => handleUpdateField('hook', e.target.value)}
                  placeholder="The provocative hook that makes the agent read on..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Comparable Titles ("Comps") Formula
                </label>
                <input
                  type="text"
                  value={queryData.compTitles}
                  onChange={(e) => handleUpdateField('compTitles', e.target.value)}
                  placeholder="e.g. PIRANESI meets THE HAUNTING OF HILL HOUSE"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Paragraph 1: Protagonist &amp; Status Quo
                </label>
                <textarea
                  rows={3}
                  value={queryData.protagonistIntro}
                  onChange={(e) => handleUpdateField('protagonistIntro', e.target.value)}
                  placeholder="Introduce protagonist, their world, and their flaw..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs font-serif leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Paragraph 2: Inciting Incident &amp; Escalation
                </label>
                <textarea
                  rows={3}
                  value={queryData.incitingIncident}
                  onChange={(e) => handleUpdateField('incitingIncident', e.target.value)}
                  placeholder="The event that shatters normalcy..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs font-serif leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Paragraph 3: High Stakes &amp; Unforgiving Choice
                </label>
                <textarea
                  rows={3}
                  value={queryData.stakesAndChoice}
                  onChange={(e) => handleUpdateField('stakesAndChoice', e.target.value)}
                  placeholder="What happens if the protagonist fails? The impossible dilemma..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs font-serif leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 dark:text-slate-400 mb-1">
                  Author Bio &amp; Credentials
                </label>
                <textarea
                  rows={2}
                  value={queryData.authorBio}
                  onChange={(e) => handleUpdateField('authorBio', e.target.value)}
                  placeholder="Writing background, publications, or relevant personal expertise..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 text-xs"
                />
              </div>
            </div>

            {/* Right: Traditional Manuscript Letter Preview */}
            <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-stone-100 dark:bg-slate-900 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Standard 12pt Agent Letter Preview
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyText(assembledQueryLetter)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-50 flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Letter</span>
                  </button>
                  <button
                    onClick={() => handleDownloadText(assembledQueryLetter, `${project.title}-Query-Letter.txt`)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* White Letter Sheet */}
              <div className="flex-1 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-stone-200 dark:border-slate-700 font-serif text-xs md:text-sm text-stone-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-4 max-w-xl mx-auto w-full">
                {assembledQueryLetter}
              </div>
            </div>
          </div>
        ) : activeTab === 'synopsis1' ? (
          /* 1-Page Synopsis */
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-3xl mx-auto space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  1-Page Agent Synopsis (500–800 words)
                </h3>
                <p className="text-xs text-stone-500">
                  Must outline the entire arc, including major twists and the final resolution/ending.
                </p>
              </div>
              <button
                onClick={() => handleCopyText(queryData.synopsisOnePage)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Synopsis</span>
              </button>
            </div>

            <textarea
              rows={16}
              value={queryData.synopsisOnePage}
              onChange={(e) => handleUpdateField('synopsisOnePage', e.target.value)}
              placeholder="Full plot breakdown: Act I, Act II midpoint, Climax, and Resolution..."
              className="w-full p-6 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-serif text-sm leading-relaxed"
            />
          </div>
        ) : (
          /* 5-Page Synopsis */
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-3xl mx-auto space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-slate-100">
                  5-Page Chapter-by-Chapter Detailed Outline
                </h3>
                <p className="text-xs text-stone-500">
                  In-depth breakdown of every chapter beat, subplots, and thematic reveals for acquisitions editors.
                </p>
              </div>
              <button
                onClick={() => handleCopyText(queryData.synopsisFivePage)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy 5-Page</span>
              </button>
            </div>

            <textarea
              rows={16}
              value={queryData.synopsisFivePage}
              onChange={(e) => handleUpdateField('synopsisFivePage', e.target.value)}
              placeholder="Chapter 1–3: ... Chapter 4–7: ... Chapter 8–12: ..."
              className="w-full p-6 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 font-serif text-sm leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};
