import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  ChevronDown,
  Layers,
  Search,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { ContentWritingProject, ContentDocument, ContentOutlineSection, ContentType } from '../types';

interface ContentStudioViewProps {
  project: ContentWritingProject;
  onUpdateProject: (updated: ContentWritingProject) => void;
  isDarkMode: boolean;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({
  project,
  onUpdateProject,
  isDarkMode,
}) => {
  const activeDoc = useMemo(() => {
    return (
      project.documents.find((d) => d.id === project.activeDocumentId) ||
      project.documents[0]
    );
  }, [project]);

  const [activeTab, setActiveTab] = useState<'editor' | 'outline' | 'strategy'>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Update active document fields
  const handleUpdateActiveDoc = (updates: Partial<ContentDocument>) => {
    const updatedDocs = project.documents.map((d) =>
      d.id === activeDoc.id
        ? {
            ...d,
            ...updates,
            updatedAt: new Date().toISOString(),
            wordCount:
              updates.bodyContent !== undefined
                ? updates.bodyContent.trim().split(/\s+/).filter(Boolean).length
                : d.wordCount,
            readingTimeMinutes:
              updates.bodyContent !== undefined
                ? Math.max(1, Math.ceil(updates.bodyContent.trim().split(/\s+/).filter(Boolean).length / 220))
                : d.readingTimeMinutes,
          }
        : d
    );
    onUpdateProject({
      ...project,
      documents: updatedDocs,
    });
  };

  // Add new document
  const handleCreateDocument = (type: ContentType = 'article') => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: ContentDocument = {
      id: newDocId,
      title: 'Untitled Article & Research Essay',
      subtitle: 'A strategic investigation into current domain concepts',
      contentType: type,
      targetAudience: 'Industry practitioners, researchers, and general readers',
      primaryKeyword: 'strategic editorial craft',
      secondaryKeywords: ['research essay', 'deep dive', 'analysis'],
      searchIntent: 'Informational',
      thesisStatement: 'Synthesize core insights with clarity, rigorous evidence, and compelling cadence.',
      outline: [
        {
          id: 'sec-1',
          title: 'I. Introduction & Contextual Anchor',
          keyPoints: ['Hook the reader with a concrete dilemma', 'Establish the central thesis'],
          estimatedWords: 350,
        },
        {
          id: 'sec-2',
          title: 'II. Core Analysis & Empirical Evidence',
          keyPoints: ['Deconstruct the prevailing assumptions', 'Present comparative findings'],
          estimatedWords: 750,
        },
        {
          id: 'sec-3',
          title: 'III. Practical Implications & Synthesis',
          keyPoints: ['Actionable takeaways for the reader', 'Forward-looking conclusion'],
          estimatedWords: 400,
        },
      ],
      bodyContent: 'Begin drafting your article or essay here. The page is yours...',
      callToAction: 'Subscribe to the publication for deeper research briefings.',
      targetWordCount: 1500,
      wordCount: 10,
      readingTimeMinutes: 1,
      status: 'Draft',
      tags: ['Essay', 'Nonfiction', 'Analysis'],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject({
      ...project,
      documents: [newDoc, ...project.documents],
      activeDocumentId: newDocId,
    });
  };

  // Outline section helpers
  const handleAddOutlineSection = () => {
    const newSec: ContentOutlineSection = {
      id: `sec-${Date.now()}`,
      title: `Section ${activeDoc.outline.length + 1}: Key Dimension`,
      keyPoints: ['Key observation or argument point'],
      estimatedWords: 400,
    };
    handleUpdateActiveDoc({
      outline: [...activeDoc.outline, newSec],
    });
  };

  const handleUpdateOutlineSection = (secId: string, updates: Partial<ContentOutlineSection>) => {
    const updated = activeDoc.outline.map((s) => (s.id === secId ? { ...s, ...updates } : s));
    handleUpdateActiveDoc({ outline: updated });
  };

  const handleDeleteOutlineSection = (secId: string) => {
    handleUpdateActiveDoc({
      outline: activeDoc.outline.filter((s) => s.id !== secId),
    });
  };

  // Content Studio AI Writing Assistant
  const handleRunContentAI = async (action: 'expand' | 'outline' | 'polish_hook' | 'humanize') => {
    setIsGenerating(true);
    setAiMessage(`Content Studio AI: Processing ${action}...`);

    try {
      let prompt = '';
      if (action === 'outline') {
        prompt = `Generate a structured, persuasive essay outline for the topic: "${activeDoc.title}". Thesis: "${activeDoc.thesisStatement}". Target audience: "${activeDoc.targetAudience}". Include 4 distinct section titles with 2 bullet points each.`;
      } else if (action === 'polish_hook') {
        prompt = `Draft 3 high-impact introductory opening hooks for this article: "${activeDoc.title}". Keep it sophisticated, punchy, and grounded in concrete examples without generic marketing clichés.`;
      } else if (action === 'humanize') {
        prompt = `Humanize and calibrate the rhythm of this article draft. Inject natural cadence variation, remove repetitive formulaic transitions, and enhance readability: "${activeDoc.bodyContent.slice(0, 1500)}"`;
      } else {
        prompt = `Draft the next 2 paragraphs of this article continuing from:\n"${activeDoc.bodyContent.slice(-800)}"\nFocus on the thesis: "${activeDoc.thesisStatement}".`;
      }

      const res = await fetch('/api/gemini/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: action === 'humanize' ? 'humanize' : 'continue',
          currentText: activeDoc.bodyContent,
          prompt,
          chapterTitle: activeDoc.title,
          sceneGoal: activeDoc.thesisStatement,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          if (action === 'expand') {
            handleUpdateActiveDoc({
              bodyContent: `${activeDoc.bodyContent.trim()}\n\n${data.result.trim()}`,
            });
          } else if (action === 'humanize') {
            handleUpdateActiveDoc({
              bodyContent: data.result.trim(),
            });
          } else {
            alert(`AI Suggestion:\n\n${data.result.trim()}`);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert('AI assistant connection unavailable. Verify your Gemini API Key in Settings.');
    } finally {
      setIsGenerating(false);
      setAiMessage(null);
    }
  };

  return (
    <div
      id="content-writing-studio"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1a0812] select-none"
    >
      {/* 1. Header Bar */}
      <header className="min-h-[52px] px-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Content Writing Studio
              </span>
              <span className="text-xs text-[#CBBEAC]">&bull;</span>
              <span className="text-xs font-serif italic text-[#71685E] dark:text-[#c9b9a6] capitalize">
                {activeDoc.contentType.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-sm font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] truncate max-w-sm sm:max-w-md">
              {activeDoc.title}
            </h1>
          </div>
        </div>

        {/* Studio Stats & Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-[#71685E] dark:text-[#c9b9a6] border-r border-[#CBBEAC] dark:border-[#4d1e2e] pr-3">
            <span>{activeDoc.wordCount.toLocaleString()} words</span>
            <span>&bull;</span>
            <span>{activeDoc.readingTimeMinutes} min read</span>
          </div>

          <div className="flex bg-[#EDE4D6] dark:bg-[#1a0812] rounded-xl p-0.5 border border-[#CBBEAC] dark:border-[#4d1e2e]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Draft Canvas
            </button>
            <button
              onClick={() => setActiveTab('outline')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'outline'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Outline ({activeDoc.outline.length})
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'strategy'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Strategy & SEO
            </button>
          </div>

          <button
            onClick={() => handleCreateDocument('article')}
            className="min-h-[36px] px-3 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-semibold hover:opacity-90 flex items-center space-x-1"
            title="New Content Document"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Piece</span>
          </button>
        </div>
      </header>

      {/* 2. Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Documents Drawer (~230px) */}
        <aside className="w-56 sm:w-64 border-r border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex flex-col shrink-0">
          <div className="p-3 border-b border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
              Manuscripts & Articles
            </span>
            <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
              {project.documents.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {project.documents.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => onUpdateProject({ ...project, activeDocumentId: doc.id })}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                      : 'hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#292521] dark:text-[#F6F0E7]'
                  }`}
                >
                  <div className="font-serif font-bold text-[13px] truncate">{doc.title}</div>
                  <div
                    className={`flex items-center justify-between text-[10.5px] ${
                      isSelected ? 'text-[#EDE4D6]' : 'text-[#71685E] dark:text-[#c9b9a6]'
                    }`}
                  >
                    <span className="capitalize">{doc.contentType.replace('_', ' ')}</span>
                    <span>{doc.wordCount} words</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Dominant Content Stage */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 select-text">
          {activeTab === 'editor' && (
            <div className="w-full max-w-[780px] mx-auto flex-1 flex flex-col space-y-4">
              {/* Context bar */}
              <div className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                    Thesis:
                  </span>
                  <span className="font-serif italic text-[#35101F] dark:text-[#F6F0E7] truncate max-w-md">
                    {activeDoc.thesisStatement}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleRunContentAI('expand')}
                    disabled={isGenerating}
                    className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:opacity-90 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#C29A52]" />
                    <span>Expand Draft</span>
                  </button>
                  <button
                    onClick={() => handleRunContentAI('humanize')}
                    disabled={isGenerating}
                    className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-semibold hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c]"
                  >
                    Calibrate Cadence
                  </button>
                </div>
              </div>

              {/* Title & Subtitle Inputs */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={activeDoc.title}
                  onChange={(e) => handleUpdateActiveDoc({ title: e.target.value })}
                  placeholder="Article Headline..."
                  className="w-full font-serif font-bold text-2xl sm:text-3xl text-[#35101F] dark:text-[#F6F0E7] bg-transparent outline-none border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] transition-colors py-1"
                />
                <input
                  type="text"
                  value={activeDoc.subtitle}
                  onChange={(e) => handleUpdateActiveDoc({ subtitle: e.target.value })}
                  placeholder="Subheading or deck summary..."
                  className="w-full font-serif italic text-sm sm:text-base text-[#71685E] dark:text-[#c9b9a6] bg-transparent outline-none border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] transition-colors py-1"
                />
              </div>

              {/* Main Content Body Textarea */}
              <div className="flex-1 flex flex-col p-6 sm:p-10 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] shadow-xs">
                <textarea
                  value={activeDoc.bodyContent}
                  onChange={(e) => handleUpdateActiveDoc({ bodyContent: e.target.value })}
                  placeholder="Draft your long-form article here..."
                  rows={20}
                  className="w-full flex-1 bg-transparent outline-none border-none resize-none font-serif text-[16px] leading-relaxed text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989]"
                />

                {/* Call to Action Box */}
                <div className="mt-6 pt-4 border-t border-[#CBBEAC]/50 dark:border-[#4d1e2e] space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                    Closing Call to Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={activeDoc.callToAction}
                    onChange={(e) => handleUpdateActiveDoc({ callToAction: e.target.value })}
                    placeholder="e.g. Subscribe to our deep-dive dispatch or download the research report..."
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="w-full max-w-[780px] mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                    Structural Essay Outline
                  </h3>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Plan sections, word allocations, and persuasive progression
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRunContentAI('outline')}
                    disabled={isGenerating}
                    className="min-h-[36px] px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7] dark:hover:bg-[#200b14] flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#9A7438]" />
                    <span>AI Outline Assist</span>
                  </button>
                  <button
                    onClick={handleAddOutlineSection}
                    className="min-h-[36px] px-3.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold hover:opacity-90 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {activeDoc.outline.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateOutlineSection(sec.id, { title: e.target.value })}
                        className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] bg-transparent outline-none flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                          ~{sec.estimatedWords} words
                        </span>
                        <button
                          onClick={() => handleDeleteOutlineSection(sec.id)}
                          className="text-[#71685E] hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {sec.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-center space-x-2 text-xs">
                          <span className="text-[#9A7438]">&bull;</span>
                          <input
                            type="text"
                            value={pt}
                            onChange={(e) => {
                              const newPoints = [...sec.keyPoints];
                              newPoints[pIdx] = e.target.value;
                              handleUpdateOutlineSection(sec.id, { keyPoints: newPoints });
                            }}
                            className="flex-1 bg-transparent border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] outline-none text-[#292521] dark:text-[#F6F0E7]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="w-full max-w-[780px] mx-auto p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-5 text-xs">
              <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                Content Strategy & Research Positioning
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={activeDoc.targetAudience}
                    onChange={(e) => handleUpdateActiveDoc({ targetAudience: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Search & Reader Intent
                  </label>
                  <select
                    value={activeDoc.searchIntent}
                    onChange={(e) => handleUpdateActiveDoc({ searchIntent: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none text-[#292521] dark:text-[#F6F0E7] cursor-pointer"
                  >
                    <option value="Educational">Educational (Foundational clarity)</option>
                    <option value="Informational">Informational (Research & news)</option>
                    <option value="Inspirational">Inspirational (Craft & thought leadership)</option>
                    <option value="Commercial">Commercial (Framework evaluation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                  Central Thesis Statement
                </label>
                <textarea
                  value={activeDoc.thesisStatement}
                  onChange={(e) => handleUpdateActiveDoc({ thesisStatement: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none text-[#292521] dark:text-[#F6F0E7] font-serif text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Primary Keyword Target
                  </label>
                  <input
                    type="text"
                    value={activeDoc.primaryKeyword}
                    onChange={(e) => handleUpdateActiveDoc({ primaryKeyword: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none text-[#292521] dark:text-[#F6F0E7]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Target Word Count
                  </label>
                  <input
                    type="number"
                    value={activeDoc.targetWordCount}
                    onChange={(e) => handleUpdateActiveDoc({ targetWordCount: Number(e.target.value) || 1500 })}
                    className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none text-[#292521] dark:text-[#F6F0E7] font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
