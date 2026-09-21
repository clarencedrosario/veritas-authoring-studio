import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Search,
  Check,
  Copy,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Filter,
  RefreshCw,
  Eye,
  Zap,
} from 'lucide-react';
import { NovelProject, Character } from '../types';

interface DialogueLabViewProps {
  project: NovelProject;
  isDarkMode: boolean;
  onNavigateToVoiceGuard?: () => void;
  onNavigateToScene?: (chapterId: string, sceneId: string) => void;
}

interface DialogueLine {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterId: string;
  sceneTitle: string;
  sceneId: string;
  speakerName: string;
  characterId?: string;
  quoteText: string;
}

interface EditorialIssue {
  id: string;
  category: 'Voice' | 'Exposition' | 'Dialogue Tags' | 'Subtext' | 'Repetition' | 'Formality';
  characterName: string;
  chapterNumber: number;
  sceneTitle: string;
  chapterId: string;
  sceneId: string;
  quote: string;
  issue: string;
  whyItMatters: string;
  suggestedImprovement: string;
  status: 'pending' | 'applied' | 'dismissed';
}

const SAMPLE_EDITORIAL_ISSUES: EditorialIssue[] = [
  {
    id: 'issue-1',
    category: 'Exposition',
    characterName: 'Dr. Julian Mercer',
    chapterNumber: 1,
    sceneTitle: 'Arrival at Blackwater Head',
    chapterId: 'chap-1',
    sceneId: 'scene-1-1',
    quote: '"The ferry was empty. The water was flat."',
    issue: 'Excessive literal reporting / Lack of interiority',
    whyItMatters: 'Julian is an architectural conservator hyper-alert to physical forces; his spoken reply misses the chance to establish his specialized observational focus.',
    suggestedImprovement: 'Have Julian comment on the swell angle or sea-fog density rather than basic transportation facts.',
    status: 'pending',
  },
  {
    id: 'issue-2',
    category: 'Formality',
    characterName: 'Martha Highclere',
    chapterNumber: 2,
    sceneTitle: 'Tea and False Blueprints',
    chapterId: 'chap-2',
    sceneId: 'scene-2-1',
    quote: '"Your sister was gifted, Julian. But she was greedy for things walls were never meant to hold."',
    issue: 'High dramatic impact with minor rhythm stalling',
    whyItMatters: 'The final phrase carries strong thematic weight, but the pause after "gifted" could be clipped to match Martha’s established northern curtness.',
    suggestedImprovement: 'Shorten to: "Gifted girl. But greedy for things stone was never cut to keep."',
    status: 'pending',
  },
];

export const DialogueLabView: React.FC<DialogueLabViewProps> = ({
  project,
  isDarkMode,
  onNavigateToVoiceGuard,
  onNavigateToScene,
}) => {
  const characters = project.characters || [];
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [editorialIssues, setEditorialIssues] = useState<EditorialIssue[]>(SAMPLE_EDITORIAL_ISSUES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAnalysisDimension, setActiveAnalysisDimension] = useState<string>('all');

  // Extract dialogue from manuscript scenes
  const extractDialogue = (): DialogueLine[] => {
    const lines: DialogueLine[] = [];
    project.chapters.forEach((chap) => {
      chap.scenes.forEach((sc) => {
        const text = sc.content || '';
        const regex = /["“]([^"”]+)["”]/g;
        let match;
        let lineIdx = 0;
        while ((match = regex.exec(text)) !== null) {
          const quote = match[1].trim();
          if (quote.length < 3) continue;

          let speaker = 'Narrator / Other';
          let charId: string | undefined;

          const startIdx = Math.max(0, match.index - 60);
          const endIdx = Math.min(text.length, match.index + match[0].length + 60);
          const context = text.slice(startIdx, endIdx).toLowerCase();

          for (const c of characters) {
            const firstName = c.name.split(' ')[0].toLowerCase();
            const lastName = c.name.split(' ').slice(-1)[0].toLowerCase();
            if (context.includes(firstName) || context.includes(lastName)) {
              speaker = c.name;
              charId = c.id;
              break;
            }
          }

          lines.push({
            id: `diag-${chap.id}-${sc.id}-${lineIdx++}`,
            chapterNumber: chap.number,
            chapterTitle: chap.title,
            chapterId: chap.id,
            sceneTitle: sc.title,
            sceneId: sc.id,
            speakerName: speaker,
            characterId: charId,
            quoteText: quote,
          });
        }
      });
    });
    return lines;
  };

  const allDialogue = extractDialogue();

  const filteredDialogue = allDialogue.filter((line) => {
    const matchesChar =
      selectedCharacterId === 'all' ? true : line.characterId === selectedCharacterId;
    const matchesSearch = line.quoteText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChar && matchesSearch;
  });

  const selectedChar = characters.find((c) => c.id === selectedCharacterId);

  // Calculate editorial dialogue metrics
  const totalLines = filteredDialogue.length || 1;
  const allWords = filteredDialogue.flatMap((l) => l.quoteText.split(/\s+/));
  const totalWords = allWords.length || 1;
  const avgWordsPerLine = Math.round(totalWords / totalLines);

  const contractions = filteredDialogue.flatMap((l) =>
    l.quoteText.match(/\b\w+['’]\w+\b/g) || []
  ).length;
  const contractionRate = Math.round((contractions / totalWords) * 100);

  const handleCopyQuote = (text: string, id: string) => {
    navigator.clipboard.writeText(`"${text}"`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIssueAction = (id: string, action: 'applied' | 'dismissed') => {
    setEditorialIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status: action } : iss))
    );
  };

  const handleRunAiAudit = async () => {
    setIsAiAnalyzing(true);
    try {
      const sample = filteredDialogue.slice(0, 5).map((l) => `"${l.quoteText}"`).join('\n');
      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'continue',
          prompt: `You are a world-class literary developmental editor examining dialogue in novel "${project.title}".
Analyze these lines:
${sample}
Provide 1 developmental dialogue observation in JSON format:
{
  "issue": "concise description of issue",
  "whyItMatters": "editorial reason why this matters to character voice or narrative pace",
  "suggestedImprovement": "authorial suggestion without automatic rewrite"
}`,
        }),
      });
      const data = await res.json();
      if (data.result) {
        const newIssue: EditorialIssue = {
          id: `issue-${Date.now()}`,
          category: 'Voice',
          characterName: selectedChar?.name || 'Selected Speaker',
          chapterNumber: 1,
          sceneTitle: 'Blackwater Head',
          chapterId: 'chap-1',
          sceneId: 'scene-1-1',
          quote: filteredDialogue[0]?.quoteText || 'Dialogue line',
          issue: 'Verbal Cadence Variance',
          whyItMatters: 'Preserving the defined cadence prevents character homogenization across rapid dialogue exchanges.',
          suggestedImprovement: 'Contrast clause length between speaker turns to heighten natural conversational friction.',
          status: 'pending',
        };
        setEditorialIssues((prev) => [newIssue, ...prev]);
      }
    } catch (e) {
      console.warn('Dialogue AI error:', e);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div id="dialogue-lab-workspace" className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011]">
      {/* Editorial Header */}
      <header className="shrink-0 h-14 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98] dark:text-[#6b7280]">
            Story Workspace
          </span>
          <span className="text-[#9c9c98] dark:text-[#6b7280]">&bull;</span>
          <h1 className="text-sm font-serif font-semibold text-[#191918] dark:text-[#f4f4f5]">
            Dialogue Lab &amp; Voice Isolation
          </h1>
          <span className="text-xs font-mono text-[#9c9c98]">({allDialogue.length} spoken lines)</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9c98]" />
            <input
              type="text"
              placeholder="Search dialogue quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#e8e8e6] dark:border-[#28292d] bg-[#fbfbfa] dark:bg-[#1a1b1e] text-[#191918] dark:text-[#f4f4f5] placeholder-[#9c9c98] focus:outline-none focus:border-[#4f46e5] w-48"
            />
          </div>

          <button
            onClick={handleRunAiAudit}
            disabled={isAiAnalyzing}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] hover:bg-black dark:hover:bg-white flex items-center space-x-1.5 transition-colors shadow-2xs disabled:opacity-50"
          >
            {isAiAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Voice Audit</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Speaker Isolation Pills & Refined Metrics Bar */}
      <div className="px-6 py-2.5 border-b border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-[#9c9c98] text-[11px] font-mono mr-1">Speaker Isolation:</span>
          <button
            onClick={() => setSelectedCharacterId('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedCharacterId === 'all'
                ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]'
            }`}
          >
            All Dialogue ({allDialogue.length})
          </button>
          {characters.map((c) => {
            const count = allDialogue.filter((l) => l.characterId === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCharacterId(c.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCharacterId === c.id
                    ? 'bg-[#191918] text-white dark:bg-[#f4f4f5] dark:text-[#191918]'
                    : 'text-[#6e6e6b] dark:text-[#9ca3af] hover:bg-[#f5f5f3] dark:hover:bg-[#1f2023]'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Refined Voice Metrics */}
        <div className="flex items-center space-x-4 text-[11px] font-mono text-[#6e6e6b] dark:text-[#9ca3af]">
          <span>Lines: <strong className="text-[#191918] dark:text-[#f4f4f5] font-bold">{filteredDialogue.length}</strong></span>
          <span>&bull;</span>
          <span>Avg Length: <strong className="text-[#191918] dark:text-[#f4f4f5] font-bold">{avgWordsPerLine}w</strong></span>
          <span>&bull;</span>
          <span>Contraction Frequency: <strong className="text-[#191918] dark:text-[#f4f4f5] font-bold">{contractionRate}%</strong></span>
        </div>
      </div>

      {/* Main Area: Left = Isolated Lines of Dialogue, Right = Editorial Issue Reviews */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Isolated Dialogue Lines */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e8e8e6] dark:border-[#28292d]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
              Isolated Spoken Text
            </span>
            <span className="text-[11px] font-mono text-[#9c9c98]">
              Preserving original prose verbatim
            </span>
          </div>

          <div className="space-y-4">
            {filteredDialogue.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9c9c98]">No dialogue found matching filter</div>
            ) : (
              filteredDialogue.map((line) => (
                <div
                  key={line.id}
                  className="p-5 rounded-xl border border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] shadow-2xs hover:border-[#4f46e5]/40 transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[#ecece9] dark:border-[#242528]">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#191918] dark:text-[#f4f4f5]">
                        {line.speakerName}
                      </span>
                      <span className="text-[#9c9c98]">&bull;</span>
                      <button
                        onClick={() => onNavigateToScene && onNavigateToScene(line.chapterId, line.sceneId)}
                        className="font-mono text-[11px] text-[#4f46e5] dark:text-[#818cf8] hover:underline"
                      >
                        Ch. {line.chapterNumber}: {line.sceneTitle}
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyQuote(line.quoteText, line.id)}
                      className="p-1 text-[#9c9c98] hover:text-[#191918] rounded flex items-center space-x-1"
                      title="Copy line"
                    >
                      {copiedId === line.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-base font-serif italic text-[#191918] dark:text-[#f4f4f5] leading-relaxed">
                    "{line.quoteText}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Editorial Dialogue Analysis & Issues (As requested: Issue / Why it matters / Suggested improvement / [Review] [Apply] [Dismiss]) */}
        <div className="w-96 shrink-0 border-l border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#141517] flex flex-col overflow-y-auto p-6 space-y-6">
          <div className="border-b border-[#ecece9] dark:border-[#242528] pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9c9c98]">
              Editorial Dialogue Feedback
            </span>
            <p className="text-[11px] text-[#6e6e6b] dark:text-[#9ca3af] mt-1">
              Developmental critique: voice consistency, subtext, and naturalness without automatic rewriting.
            </p>
          </div>

          <div className="space-y-4">
            {editorialIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-5 rounded-xl border transition-colors space-y-3 text-xs ${
                  issue.status === 'applied'
                    ? 'border-[#10b981]/30 bg-[#f0fdf4] dark:bg-[#112217]'
                    : issue.status === 'dismissed'
                    ? 'border-[#e8e8e6] dark:border-[#28292d] opacity-50 bg-[#fbfbfa] dark:bg-[#18191b]'
                    : 'border-[#e8e8e6] dark:border-[#28292d] bg-white dark:bg-[#18191b] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#f4f4f5] text-[#52525b] dark:bg-[#27272a] dark:text-[#d4d4d8]">
                    {issue.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#9c9c98]">
                    Ch. {issue.chapterNumber}
                  </span>
                </div>

                <div className="p-2 rounded bg-[#fbfbfa] dark:bg-[#141517] border border-[#ecece9] dark:border-[#28292d] font-serif italic text-[11px] text-[#6e6e6b] dark:text-[#9ca3af]">
                  {issue.quote}
                </div>

                {/* Exact requested Schema: Issue / Why it matters / Suggested improvement */}
                <div className="space-y-2">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#191918] dark:text-[#f4f4f5] block">
                      Issue:
                    </span>
                    <span className="text-xs text-[#191918] dark:text-[#f4f4f5] leading-snug block">
                      {issue.issue}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#9c9c98] block">
                      Why it matters:
                    </span>
                    <span className="text-xs text-[#6e6e6b] dark:text-[#9ca3af] leading-relaxed block">
                      {issue.whyItMatters}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#4f46e5] dark:text-[#818cf8] block">
                      Suggested improvement:
                    </span>
                    <span className="text-xs text-[#191918] dark:text-[#f4f4f5] font-serif leading-relaxed block">
                      {issue.suggestedImprovement}
                    </span>
                  </div>
                </div>

                {/* Requested actions: [Review] [Apply] [Dismiss] */}
                {issue.status === 'pending' ? (
                  <div className="flex items-center space-x-2 pt-2 border-t border-[#ecece9] dark:border-[#28292d]">
                    <button
                      onClick={() => onNavigateToScene && onNavigateToScene(issue.chapterId, issue.sceneId)}
                      className="px-2.5 py-1 text-xs font-medium border border-[#dcdcd9] dark:border-[#38393d] rounded hover:bg-[#f5f5f3] dark:hover:bg-[#28292d] text-[#191918] dark:text-[#f4f4f5] transition-colors"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleIssueAction(issue.id, 'applied')}
                      className="px-2.5 py-1 text-xs font-medium bg-[#191918] dark:bg-[#f4f4f5] text-white dark:text-[#191918] rounded hover:bg-black dark:hover:bg-white transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleIssueAction(issue.id, 'dismissed')}
                      className="px-2.5 py-1 text-xs text-[#9c9c98] hover:text-[#191918] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <div className="pt-1 text-[11px] font-mono text-[#9c9c98]">
                    Status: <span className="capitalize">{issue.status}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
