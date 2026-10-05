import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Bookmark,
  RefreshCw,
  Edit2,
  Trash2,
  Tag,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { ContentDocument, HeadlineAlternativeItem } from '../../types';
import { HEADLINE_LAB_CATEGORIES } from './constants';

interface HeadlineLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeadline: string;
  contentType: string;
  topic: string;
  document: ContentDocument;
  savedHeadlines: HeadlineAlternativeItem[];
  onApplyHeadline: (headlineText: string) => void;
  onSaveHeadlines: (headlines: HeadlineAlternativeItem[]) => void;
  isDarkMode: boolean;
}

export const HeadlineLabModal: React.FC<HeadlineLabModalProps> = ({
  isOpen,
  onClose,
  currentHeadline,
  contentType,
  topic,
  document,
  savedHeadlines,
  onApplyHeadline,
  onSaveHeadlines,
  isDarkMode,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHeadlines, setGeneratedHeadlines] = useState<HeadlineAlternativeItem[]>(savedHeadlines || []);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  if (!isOpen) return null;

  const handleGenerateHeadlines = async (filterCategory: string) => {
    setIsGenerating(true);
    setRequestError(null);
    try {
      const res = await fetch('/api/gemini/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'headline_lab_generate',
          title: currentHeadline || topic,
          contentType,
          targetText: document.bodyContent,
          currentText: document.bodyContent,
          headlineCategory: filterCategory === 'All' ? undefined : filterCategory,
          brief: {
            topic: document.topic,
            purpose: document.purpose,
            targetAudience: document.targetAudience,
            publicationOrPlatform: document.publicationOrPlatform,
            desiredLength: document.desiredLength,
            targetWordCount: document.targetWordCount,
            tone: document.tone,
            language: document.language,
            deadline: document.deadline,
            primaryKeyword: document.primaryKeyword,
            secondaryKeywords: document.secondaryKeywords,
            importantFacts: document.importantFacts,
            keyMessage: document.keyMessage,
            callToAction: document.callToAction,
            referenceMaterial: document.referenceMaterial,
            authorNotes: document.authorNotes,
            aiInstructions: document.aiInstructions,
            thesisStatement: document.thesisStatement,
          },
          newsroomData: document.newsroom,
          adSpecData: document.adSpec,
          pressReleaseData: document.pressRelease,
          socialMediaData: document.socialMedia,
          schoolNoticeData: document.schoolNotice,
          contentTypeInstructions: document.contentTypeInstructions,
          attachedResearch: document.referenceMaterial,
          toneConfig: document.toneConfig,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Provider request failed with HTTP ${res.status}.`);
      }
      if (!Array.isArray(data.data?.headlines)) {
        throw new Error(data.result
          ? `The provider returned an unstructured headline response: ${data.result}`
          : 'The provider returned no headline alternatives.');
      }
      const formatted: HeadlineAlternativeItem[] = data.data.headlines.map((item: any, idx: number) => ({
        id: `hl-gen-${Date.now()}-${idx}`,
        headline: item.headline || item,
        category: item.category || filterCategory || 'Creative',
        saved: false,
        score: typeof item.score === 'number' ? item.score : undefined,
      }));
      setGeneratedHeadlines(formatted);
    } catch (err) {
      console.error(err);
      setRequestError(err instanceof Error ? err.message : 'Headline request failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSave = (item: HeadlineAlternativeItem) => {
    const updated = generatedHeadlines.map((h) =>
      h.id === item.id ? { ...h, saved: !h.saved } : h
    );
    setGeneratedHeadlines(updated);
    const savedOnly = updated.filter((h) => h.saved);
    onSaveHeadlines(savedOnly);
  };

  const handleStartEdit = (item: HeadlineAlternativeItem) => {
    setEditingId(item.id);
    setEditText(item.headline);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) return;
    const updated = generatedHeadlines.map((h) =>
      h.id === id ? { ...h, headline: editText.trim() } : h
    );
    setGeneratedHeadlines(updated);
    setEditingId(null);
    onSaveHeadlines(updated.filter((headline) => headline.saved));
  };

  const handleUseHeadline = (headline: string) => {
    onApplyHeadline(headline);
    onClose();
  };

  const filteredItems = generatedHeadlines.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#292521] dark:text-[#F6F0E7]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-base shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                Headline Lab
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Generate, Test & Compare Headline Alternatives
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#71685E] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Headline Banner */}
        <div className="px-5 py-3 bg-[#EDE4D6]/70 dark:bg-[#200b14]/70 border-b border-[#CBBEAC] dark:border-[#4d1e2e] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-2 truncate pr-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[#71685E]">
              Current Headline:
            </span>
            <span className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] truncate">
              {currentHeadline || 'No headline set'}
            </span>
          </div>
          <span className="text-[10.5px] text-[#71685E] shrink-0">
            Never auto-replaced without confirmation
          </span>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-[#CBBEAC]/60 dark:border-[#4d1e2e] flex items-center justify-between gap-2 overflow-x-auto shrink-0 bg-[#F6F0E7] dark:bg-[#1a0812]">
          <div className="flex items-center space-x-1 overflow-x-auto pb-0.5">
            {HEADLINE_LAB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === cat
                    ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerateHeadlines(selectedFilter)}
            disabled={isGenerating}
            className="px-3 py-1 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shrink-0 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Headline Alternatives Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {requestError && <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">Headline request failed: {requestError}</div>}
          {filteredItems.length === 0 && !requestError && (
            <div className="py-12 text-center text-sm text-[#71685E]">No saved headlines yet. Generate alternatives to compare them here.</div>
          )}
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] hover:border-[#9A7438] transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[10px] font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52]">
                    {item.category}
                  </span>
                  {item.score && (
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {item.score}% Impact Score
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleSave(item)}
                  title={item.saved ? 'Saved in library' : 'Save headline'}
                  className={`p-1 rounded-lg transition-colors ${
                    item.saved
                      ? 'text-[#9A7438] bg-[#F6F0E7] dark:bg-[#1a0812]'
                      : 'text-[#71685E] hover:text-[#35101F]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${item.saved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {editingId === item.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif font-bold outline-none"
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="px-3 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="font-serif font-bold text-sm sm:text-base leading-snug text-[#35101F] dark:text-[#F6F0E7] select-text">
                  {item.headline}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#CBBEAC]/50 dark:border-[#4d1e2e]">
                <div className="flex items-center space-x-1.5 text-xs text-[#71685E]">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="px-2 py-1 rounded hover:bg-[#F6F0E7] dark:hover:bg-[#1a0812] flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                <button
                  onClick={() => handleUseHeadline(item.headline)}
                  className="px-3 py-1 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold hover:opacity-90 flex items-center space-x-1 shadow-xs"
                >
                  <Check className="w-3 h-3 text-[#C29A52]" />
                  <span>Use This Headline</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
            Showing {filteredItems.length} candidate headlines
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-semibold hover:bg-[#F6F0E7]"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
