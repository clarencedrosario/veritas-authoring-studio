import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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
  Newspaper,
  Megaphone,
  Volume2,
  Bookmark,
  ShieldCheck,
  Send,
  Printer,
  Edit3,
  AlignLeft,
  Info,
} from 'lucide-react';
import {
  ContentWritingProject,
  ContentDocument,
  ContentOutlineSection,
  ContentType,
  ContentCategory,
  AdVariantItem,
  HeadlineAlternativeItem,
  ContentToneConfig,
  ContentAuthorVoiceProfile,
} from '../types';
import { WritingToolbar } from './content-studio/WritingToolbar';
import { AiWritingMenu, AiActionScope } from './content-studio/AiWritingMenu';
import { HumanisePolishModal, HumaniseScope } from './content-studio/HumanisePolishModal';
import { AuthorVoiceModal } from './content-studio/AuthorVoiceModal';
import { HeadlineLabModal } from './content-studio/HeadlineLabModal';
import { NewspaperDeskPanel } from './content-studio/NewspaperDeskPanel';
import { AdvertisementDeskPanel } from './content-studio/AdvertisementDeskPanel';
import { ToneVoicePanel } from './content-studio/ToneVoicePanel';
import { ContentExportModal } from './content-studio/ContentExportModal';
import { NewPieceWizardModal } from './content-studio/NewPieceWizardModal';
import { CONTENT_TYPE_REGISTRY } from './content-studio/constants';
import { resolveAITarget, ResolvedAITarget } from './content-studio/aiTargetResolver';

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
  // 1. Resolve Active Document safely
  const activeDoc: ContentDocument = useMemo(() => {
    return (
      project.documents.find((d) => d.id === project.activeDocumentId) ||
      project.documents[0] || {
        id: 'doc-fallback',
        title: 'Untitled Editorial Piece',
        subtitle: 'Professional content draft',
        contentType: 'article' as ContentType,
        category: 'other' as ContentCategory,
        topic: 'General Analysis',
        purpose: 'Professional Communication',
        targetAudience: 'General Audience',
        publicationOrPlatform: 'Veritas Chronicle',
        desiredLength: 600,
        tone: 'Professional & Authoritative',
        language: 'English',
        deadline: 'Today',
        primaryKeyword: 'editorial craft',
        secondaryKeywords: [],
        importantFacts: [],
        keyMessage: 'Clear factual communication with rhythmic precision.',
        callToAction: '',
        referenceMaterial: '',
        authorNotes: '',
        aiInstructions: '',
        searchIntent: 'Informational',
        thesisStatement: 'Draft with rigor, verified facts, and natural cadence.',
        outline: [],
        bodyContent: '',
        targetWordCount: 600,
        wordCount: 0,
        readingTimeMinutes: 1,
        status: 'Draft',
        tags: ['General'],
        updatedAt: new Date().toISOString(),
      }
    );
  }, [project]);

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'editor' | 'outline' | 'strategy' | 'tone' | 'newsroom' | 'ad_desk'>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Search & Filter in left sidebar
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarCategoryFilter, setSidebarCategoryFilter] = useState<string>('all');

  // Modals state
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showHumaniseModal, setShowHumaniseModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showHeadlineLabModal, setShowHeadlineLabModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Textarea Ref & Selection Tracking
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

  // Undo/Redo history stack
  const [history, setHistory] = useState<string[]>([activeDoc.bodyContent || '']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Update active document helper
  const handleUpdateActiveDoc = useCallback(
    (updates: Partial<ContentDocument>) => {
      setAutosaveStatus('saving');
      const updatedDocs = project.documents.map((d) => {
        if (d.id === activeDoc.id) {
          const newBody = updates.bodyContent !== undefined ? updates.bodyContent : d.bodyContent;
          const words = newBody.trim() ? newBody.trim().split(/\s+/).filter(Boolean).length : 0;
          const readTime = Math.max(1, Math.ceil(words / 220));

          return {
            ...d,
            ...updates,
            wordCount: words,
            readingTimeMinutes: readTime,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      });

      onUpdateProject({
        ...project,
        documents: updatedDocs,
      });

      setTimeout(() => {
        setAutosaveStatus('saved');
      }, 400);
    },
    [project, activeDoc.id, onUpdateProject]
  );

  // Text Selection tracking
  const handleTextareaSelect = () => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      setSelectionRange({ start: selectionStart, end: selectionEnd });
      if (selectionStart !== selectionEnd) {
        setSelectedText(value.slice(selectionStart, selectionEnd));
      } else {
        setSelectedText('');
      }
    }
  };

  // Push new history state on change
  const handleBodyChange = (newText: string) => {
    handleUpdateActiveDoc({ bodyContent: newText });

    // Push to undo stack if different
    if (history[historyIndex] !== newText) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      if (newHistory.length > 30) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevText = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      handleUpdateActiveDoc({ bodyContent: prevText });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextText = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      handleUpdateActiveDoc({ bodyContent: nextText });
    }
  };

  // Format actions applied to textarea
  const handleToolbarFormatAction = (action: string, value?: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value: currentText } = textareaRef.current;
    const selected = currentText.slice(selectionStart, selectionEnd);

    let replacement = '';
    let newCursorPos = selectionStart;

    switch (action) {
      case 'bold':
        replacement = selected ? `**${selected}**` : `**bold text**`;
        break;
      case 'italic':
        replacement = selected ? `*${selected}*` : `*italic text*`;
        break;
      case 'underline':
        replacement = selected ? `<u>${selected}</u>` : `<u>underlined</u>`;
        break;
      case 'strikethrough':
        replacement = selected ? `~~${selected}~~` : `~~strikethrough~~`;
        break;
      case 'bullet_list':
        replacement = selected
          ? selected.split('\n').map((l) => (l.startsWith('• ') ? l : `• ${l}`)).join('\n')
          : `\n• Key Point 1\n• Key Point 2\n• Key Point 3\n`;
        break;
      case 'numbered_list':
        replacement = selected
          ? selected.split('\n').map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, '')}`).join('\n')
          : `\n1. First step\n2. Second step\n3. Third step\n`;
        break;
      case 'blockquote':
        replacement = selected ? `\n> "${selected}"\n` : `\n> "A memorable quote from the text."\n`;
        break;
      case 'link':
        replacement = selected ? `[${selected}](https://example.com)` : `[Link Text](https://example.com)`;
        break;
      case 'image':
        replacement = `\n\n![Photograph Caption: ${activeDoc.title}](https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop)\n*Figure 1: Verified photographic record*\n\n`;
        break;
      case 'divider':
        replacement = `\n\n---\n\n`;
        break;
      case 'style':
        if (value === 'h1') replacement = `\n\n# ${selected || 'Main Section Header'}\n\n`;
        else if (value === 'h2') replacement = `\n\n## ${selected || 'Subheading Title'}\n\n`;
        else if (value === 'h3') replacement = `\n\n### ${selected || 'Minor Subtopic'}\n\n`;
        else if (value === 'lead') replacement = `\n\n**[LEAD: ${selected || 'The decisive development that anchors the story...'}]**\n\n`;
        else if (value === 'dateline') replacement = `${activeDoc.newsroom?.dateline || 'WESTMINSTER, 28 SEP — '} `;
        else replacement = selected;
        break;
      case 'align':
        replacement = selected;
        break;
      default:
        replacement = selected;
    }

    const updatedText =
      currentText.slice(0, selectionStart) + replacement + currentText.slice(selectionEnd);
    handleBodyChange(updatedText);

    // Reposition cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          selectionStart + replacement.length,
          selectionStart + replacement.length
        );
      }
    }, 50);
  };

  // AI Command Runner
  const handleRunAiCommand = async (actionKey: string, scope: AiActionScope = 'document', customPrompt?: string) => {
    const fullText = activeDoc.bodyContent || '';

    // Determine accurate cursor and selection boundaries
    const start = textareaRef.current ? textareaRef.current.selectionStart : selectionRange.start;
    const end = textareaRef.current ? textareaRef.current.selectionEnd : selectionRange.end;

    // Authoritative target resolution
    const resolvedTarget = resolveAITarget(scope, fullText, start, end, activeDoc.outline);

    if (!resolvedTarget.isValid) {
      showToast(resolvedTarget.validationMessage || 'Select text in the document first.');
      return;
    }

    setIsGenerating(true);
    setAiMessage(`AI Writing Engine: Processing "${actionKey.replace(/_/g, ' ')}" on ${resolvedTarget.scope}...`);

    try {
      const res = await fetch('/api/gemini/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionKey,
          contentType: activeDoc.contentType,
          category: activeDoc.category,
          title: activeDoc.title,
          brief: {
            topic: activeDoc.topic,
            purpose: activeDoc.purpose,
            targetAudience: activeDoc.targetAudience,
            publicationOrPlatform: activeDoc.publicationOrPlatform,
            desiredLength: activeDoc.desiredLength,
            importantFacts: activeDoc.importantFacts,
            keyMessage: activeDoc.keyMessage,
            callToAction: activeDoc.callToAction,
            aiInstructions: activeDoc.aiInstructions,
          },
          targetText: resolvedTarget.targetText,
          selectedText: resolvedTarget.scope === 'selection' ? resolvedTarget.targetText : undefined,
          currentText: resolvedTarget.targetText,
          fullText: fullText,
          scope: resolvedTarget.scope,
          sectionTitle: resolvedTarget.sectionTitle,
          precedingContext: resolvedTarget.precedingContext,
          followingContext: resolvedTarget.followingContext,
          newsroomData: activeDoc.newsroom,
          adSpecData: activeDoc.adSpec,
          voiceProfile: activeDoc.authorVoice,
          preserveVoice: activeDoc.authorVoice?.preserveVoiceEnabled ?? true,
          toneConfig: activeDoc.toneConfig,
          customInstruction: customPrompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          // Structured response (e.g. ad variants, headlines)
          if (data.action === 'ad_generate_variants' && data.data.variants) {
            handleUpdateActiveDoc({
              adSpec: {
                ...(activeDoc.adSpec as any),
                variants: data.data.variants,
              },
            });
            setActiveTab('ad_desk');
          } else if (data.action === 'headline_lab_generate' && data.data.headlines) {
            handleUpdateActiveDoc({
              savedHeadlines: data.data.headlines.map((h: any, idx: number) => ({
                id: `hl-gen-${Date.now()}-${idx}`,
                headline: h.headline || h,
                category: h.category || 'Creative',
                saved: false,
                score: h.score || 90,
              })),
            });
            setShowHeadlineLabModal(true);
          }
        } else if (data.result) {
          const generated = data.result.trim();

          // Apply based on action and target scope
          if (actionKey === 'generate_full_draft' || actionKey === 'generate_alternative_draft') {
            handleBodyChange(generated);
          } else if (actionKey === 'continue' || actionKey === 'write_next_paragraph') {
            const separator = fullText.trim() ? '\n\n' : '';
            handleBodyChange(`${fullText.trim()}${separator}${generated}`);
          } else if (actionKey.startsWith('newsroom_lead')) {
            handleUpdateActiveDoc({
              newsroom: {
                ...(activeDoc.newsroom as any),
                lead: generated,
              },
            });
          } else if (actionKey.startsWith('newsroom_standfirst')) {
            handleUpdateActiveDoc({
              newsroom: {
                ...(activeDoc.newsroom as any),
                standfirst: generated,
              },
            });
          } else if (actionKey.startsWith('newsroom_pullquote')) {
            handleUpdateActiveDoc({
              newsroom: {
                ...(activeDoc.newsroom as any),
                pullQuote: generated,
              },
            });
          } else if (resolvedTarget.scope === 'selection' || resolvedTarget.scope === 'paragraph' || resolvedTarget.scope === 'section') {
            // Replace ONLY the resolved target range
            const before = fullText.slice(0, resolvedTarget.start);
            const after = fullText.slice(resolvedTarget.end);
            const updated = before + generated + after;
            handleBodyChange(updated);

            // Position cursor right at the end of the replaced range
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = resolvedTarget.start + generated.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
              }
            }, 50);
          } else {
            // Document scope replacement
            handleBodyChange(generated);
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const errorMsg = errData.error || `Server responded with HTTP ${res.status}`;
        console.error("[ContentAI] Gemini generation failed:", errorMsg);
        showToast(`AI generation failed: ${errorMsg}`);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Network error communicating with AI server';
      console.error("[ContentAI] Gemini generation failed:", errorMsg);
      showToast(`AI generation failed: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
      setAiMessage(null);
    }
  };

  // Create new document from creation wizard
  const handleCreateDocumentFromWizard = async (newDoc: ContentDocument, generateWithAi = false) => {
    console.log("[ContentAI] Brief received:", {
      title: newDoc.title,
      contentType: newDoc.contentType,
      topic: newDoc.topic,
      facts: newDoc.importantFacts,
      targetAudience: newDoc.targetAudience,
      desiredLength: newDoc.desiredLength,
      generateWithAi,
    });

    if (generateWithAi) {
      setIsGenerating(true);
      setAiMessage(`AI Writing Engine: Generating complete article for "${newDoc.title}"...`);
      console.log("[ContentAI] Calling Gemini");

      try {
        const res = await fetch('/api/gemini/content-studio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_full_draft',
            contentType: newDoc.contentType,
            category: newDoc.category,
            title: newDoc.title,
            brief: {
              topic: newDoc.topic,
              purpose: newDoc.purpose,
              targetAudience: newDoc.targetAudience,
              publicationOrPlatform: newDoc.publicationOrPlatform,
              desiredLength: newDoc.desiredLength,
              importantFacts: newDoc.importantFacts,
              keyMessage: newDoc.keyMessage,
              callToAction: newDoc.callToAction,
              aiInstructions: newDoc.aiInstructions,
            },
            newsroomData: newDoc.newsroom,
            adSpecData: newDoc.adSpec,
            voiceProfile: newDoc.authorVoice,
            preserveVoice: newDoc.authorVoice?.preserveVoiceEnabled ?? true,
            toneConfig: newDoc.toneConfig,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errorMsg = errData.error || `Server returned error HTTP ${res.status}`;
          console.error("[ContentAI] Gemini generation failed:", errorMsg);
          showToast(`AI generation failed: ${errorMsg}`);
          throw new Error(errorMsg);
        }

        const data = await res.json();
        const generatedText = (data.result || (typeof data.data === 'string' ? data.data : '')).trim();

        if (!generatedText) {
          console.error("[ContentAI] Gemini generation failed: Empty response received from server");
          showToast("AI generation failed: Received empty response from model.");
          throw new Error("Received empty response from model.");
        }

        console.log("[ContentAI] Gemini response received");
        console.log(`[ContentAI] Generated characters: ${generatedText.length}`);

        console.log("[ContentAI] Updating document");
        const words = generatedText.split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(words / 220));

        const finalizedDoc: ContentDocument = {
          ...newDoc,
          bodyContent: generatedText,
          wordCount: words,
          readingTimeMinutes: readTime,
          status: 'Draft',
          updatedAt: new Date().toISOString(),
        };

        // Persist the document and keep it selected
        onUpdateProject({
          ...project,
          documents: [finalizedDoc, ...project.documents.filter((d) => d.id !== finalizedDoc.id)],
          activeDocumentId: finalizedDoc.id,
        });

        // Update editor state directly
        setHistory([generatedText]);
        setHistoryIndex(0);
        if (textareaRef.current) {
          textareaRef.current.value = generatedText;
        }
        setActiveTab('editor');
        console.log("[ContentAI] Editor updated");
        showToast("Article generated and loaded into editor!");
      } catch (err: any) {
        console.error("[ContentAI] Generation pipeline error:", err);
        throw err;
      } finally {
        setIsGenerating(false);
        setAiMessage(null);
      }
    } else {
      // Create blank piece
      onUpdateProject({
        ...project,
        documents: [newDoc, ...project.documents.filter((d) => d.id !== newDoc.id)],
        activeDocumentId: newDoc.id,
      });
      setHistory([newDoc.bodyContent || '']);
      setHistoryIndex(0);
      setActiveTab('editor');
    }
  };

  // Delete document
  const handleDeleteDocument = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.documents.length <= 1) {
      showToast('Cannot delete the only manuscript. Create another piece first.');
      return;
    }
    const remaining = project.documents.filter((d) => d.id !== docId);
    onUpdateProject({
      ...project,
      documents: remaining,
      activeDocumentId: remaining[0].id,
    });
  };

  // Filter sidebar docs
  const filteredSidebarDocs = project.documents.filter((d) => {
    const matchesSearch =
      sidebarSearch.trim() === '' ||
      d.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      d.subtitle?.toLowerCase().includes(sidebarSearch.toLowerCase());
    const matchesCat = sidebarCategoryFilter === 'all' || d.category === sidebarCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const isNewsCategory = activeDoc.category === 'news';
  const isAdCategory = activeDoc.category === 'advertising';

  return (
    <div
      id="content-writing-studio"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1a0812] select-none"
    >
      {/* ==================================================== */}
      {/* 1. MASTER HEADER BAR */}
      {/* ==================================================== */}
      <header className="min-h-[56px] px-4 sm:px-6 border-b border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex flex-wrap items-center justify-between gap-3 z-10 shrink-0">
        {/* Left: Branding & Active Document Title */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-sm shadow-xs shrink-0">
            {isNewsCategory ? <Newspaper className="w-5 h-5" /> : isAdCategory ? <Megaphone className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10.5px] font-mono uppercase tracking-widest font-bold text-[#9A7438] dark:text-[#C29A52]">
                Content Studio & Newsroom Desk
              </span>
              <span className="text-xs text-[#CBBEAC]">&bull;</span>
              <span className="px-2 py-0.5 rounded-md bg-[#EDE4D6] dark:bg-[#2b101c] text-[10px] font-mono font-bold text-[#5A1832] dark:text-[#C29A52] uppercase">
                {activeDoc.contentType.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] truncate max-w-xs sm:max-w-md">
              {activeDoc.title}
            </h1>
          </div>
        </div>

        {/* Center/Right: Navigation Tabs & Top Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Studio Workspace Tabs */}
          <div className="flex bg-[#EDE4D6] dark:bg-[#1a0812] rounded-xl p-0.5 border border-[#CBBEAC] dark:border-[#4d1e2e]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'editor'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Draft Canvas
            </button>

            {isNewsCategory && (
              <button
                onClick={() => setActiveTab('newsroom')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                  activeTab === 'newsroom'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>Newsroom Panel</span>
              </button>
            )}

            {isAdCategory && (
              <button
                onClick={() => setActiveTab('ad_desk')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 ${
                  activeTab === 'ad_desk'
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Ad Variants</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('outline')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'outline'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Outline ({activeDoc.outline.length})
            </button>

            <button
              onClick={() => setActiveTab('tone')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'tone'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Tone & Voice
            </button>

            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'strategy'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Strategy
            </button>
          </div>

          {/* AI Writing Action Button */}
          <AiWritingMenu
            onRunAction={handleRunAiCommand}
            isGenerating={isGenerating}
            hasSelection={selectedText.length > 0}
          />

          {/* Humanise Button */}
          <button
            onClick={() => setShowHumaniseModal(true)}
            className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6] dark:bg-[#200b14] hover:bg-[#CBBEAC]/50 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
            <span className="hidden sm:inline">Humanise & Polish</span>
          </button>

          {/* Export Button */}
          <button
            onClick={() => setShowExportModal(true)}
            title="Publish & Export"
            className="p-2 rounded-xl border border-[#CBBEAC] dark:border-[#4d1e2e] hover:bg-[#EDE4D6] dark:hover:bg-[#200b14] transition-colors"
          >
            <Download className="w-4 h-4 text-[#71685E]" />
          </button>

          {/* "+ New Piece" Button */}
          <button
            onClick={() => setShowWizardModal(true)}
            className="min-h-[36px] px-3.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] text-xs font-bold hover:opacity-90 flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Piece</span>
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. WORKSPACE BODY (3 PANELS: DRAWER, STAGE, SMART DESK) */}
      {/* ==================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT DRAWER: PIECES & MANUSCRIPTS (~240px) */}
        <aside className="w-60 sm:w-64 border-r border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#F6F0E7] dark:bg-[#200b14] flex flex-col shrink-0">
          {/* Header */}
          <div className="p-3 border-b border-[#CBBEAC] dark:border-[#4d1e2e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                Portfolio Documents
              </span>
              <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                {project.documents.length}
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#71685E] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search manuscripts..."
                className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11.5px] outline-none text-[#292521] dark:text-[#F6F0E7]"
              />
            </div>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSidebarDocs.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onUpdateProject({ ...project, activeDocumentId: doc.id })}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex flex-col space-y-1 cursor-pointer group relative ${
                    isSelected
                      ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                      : 'hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#292521] dark:text-[#F6F0E7]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif font-bold text-[13px] truncate pr-2">
                      {doc.title}
                    </span>
                    <button
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      title="Delete piece"
                      className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        isSelected ? 'hover:text-red-200' : 'hover:text-rose-600'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div
                    className={`flex items-center justify-between text-[10.5px] ${
                      isSelected ? 'text-[#EDE4D6]' : 'text-[#71685E] dark:text-[#c9b9a6]'
                    }`}
                  >
                    <span className="capitalize">{doc.contentType.replace(/_/g, ' ')}</span>
                    <span>{doc.wordCount} words</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Voice Guard footer in drawer */}
          <div className="p-2.5 border-t border-[#CBBEAC] dark:border-[#4d1e2e] bg-[#EDE4D6]/60 dark:bg-[#200b14]/60 flex items-center justify-between">
            <button
              onClick={() => setShowVoiceModal(true)}
              className="text-[11px] font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center space-x-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Guard: {activeDoc.authorVoice?.preserveVoiceEnabled ? 'Active' : 'Standby'}</span>
            </button>
            <button
              onClick={() => setShowHeadlineLabModal(true)}
              className="text-[11px] font-semibold text-[#71685E] hover:text-[#35101F]"
            >
              Headline Lab
            </button>
          </div>
        </aside>

        {/* CENTER MAIN WRITING STAGE */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#EDE4D6] dark:bg-[#1a0812]">
          {/* TAB 1: DRAFT CANVAS */}
          {activeTab === 'editor' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Professional Writing Toolbar */}
              <WritingToolbar
                wordCount={activeDoc.wordCount}
                charCount={activeDoc.bodyContent?.length || 0}
                readingTimeMinutes={activeDoc.readingTimeMinutes}
                autosaveStatus={autosaveStatus}
                onFormatAction={handleToolbarFormatAction}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />

              {/* Manuscript Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 select-text">
                <div className="w-full max-w-[820px] mx-auto space-y-4">
                  {/* Context Bar */}
                  <div className="p-3.5 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                        Thesis / Angle:
                      </span>
                      <span className="font-serif italic text-[#35101F] dark:text-[#F6F0E7] truncate max-w-md">
                        {activeDoc.thesisStatement || activeDoc.keyMessage || 'Synthesize evidence with clarity and cadence.'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowHeadlineLabModal(true)}
                        className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e] text-[11px] font-semibold hover:bg-[#EDE4D6] flex items-center space-x-1"
                      >
                        <Bookmark className="w-3 h-3 text-[#9A7438]" />
                        <span>Headline Lab</span>
                      </button>
                      <button
                        onClick={() => handleRunAiCommand('continue')}
                        disabled={isGenerating}
                        className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-bold hover:opacity-90 flex items-center space-x-1 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#C29A52]" />
                        <span>Continue Writing</span>
                      </button>
                    </div>
                  </div>

                  {/* Headline & Subhead Inputs */}
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
                      placeholder="Subheading deck or working angle..."
                      className="w-full font-serif italic text-sm sm:text-base text-[#71685E] dark:text-[#c9b9a6] bg-transparent outline-none border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832] transition-colors py-1"
                    />
                  </div>

                  {/* Writing Canvas Textarea */}
                  <div className="p-6 sm:p-10 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] shadow-xs flex flex-col min-h-[500px]">
                    <textarea
                      ref={textareaRef}
                      value={activeDoc.bodyContent}
                      onChange={(e) => handleBodyChange(e.target.value)}
                      onSelect={handleTextareaSelect}
                      onKeyUp={handleTextareaSelect}
                      onMouseUp={handleTextareaSelect}
                      placeholder="Draft your long-form article, newspaper report, advertisement copy, or institutional notice here..."
                      rows={22}
                      className="w-full flex-1 bg-transparent outline-none border-none resize-none font-serif text-[16px] leading-relaxed text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989]"
                    />

                    {/* Closing Call to Action Box */}
                    <div className="mt-6 pt-4 border-t border-[#CBBEAC]/50 dark:border-[#4d1e2e] space-y-1.5">
                      <label className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                        Closing Call to Action (CTA)
                      </label>
                      <input
                        type="text"
                        value={activeDoc.callToAction}
                        onChange={(e) => handleUpdateActiveDoc({ callToAction: e.target.value })}
                        placeholder="e.g. Subscribe to our deep-dive dispatch, reserve your seat, or register online..."
                        className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEWSROOM COMMAND DESK */}
          {activeTab === 'newsroom' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="max-w-4xl mx-auto space-y-5">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-3">
                  <div>
                    <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                      Newsroom Central
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[#35101F] dark:text-[#F6F0E7]">
                      Journalistic Story Architecture & Inverted Pyramid
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold"
                  >
                    Return to Canvas
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-3">
                    <span className="font-mono text-xs font-bold uppercase text-[#9A7438]">
                      Wire Meta & Dateline
                    </span>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">Headline</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.headline || activeDoc.title}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), headline: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] font-serif font-bold text-sm"
                        />
                      </div>
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">Dateline</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.dateline || 'WESTMINSTER, 28 SEP —'}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), dateline: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] font-mono text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">Lead (Opening Paragraph)</span>
                        <textarea
                          value={activeDoc.newsroom?.lead || ''}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), lead: e.target.value },
                            })
                          }
                          rows={4}
                          className="w-full p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] font-serif text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-3">
                    <span className="font-mono text-xs font-bold uppercase text-[#9A7438]">
                      5W1H Factual Guard
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">Who?</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.who || ''}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), who: e.target.value },
                            })
                          }
                          className="w-full p-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">What?</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.what || ''}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), what: e.target.value },
                            })
                          }
                          className="w-full p-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">When?</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.when || ''}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), when: e.target.value },
                            })
                          }
                          className="w-full p-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[#71685E] block text-[10px] uppercase font-mono">Where?</span>
                        <input
                          type="text"
                          value={activeDoc.newsroom?.where || ''}
                          onChange={(e) =>
                            handleUpdateActiveDoc({
                              newsroom: { ...(activeDoc.newsroom as any), where: e.target.value },
                            })
                          }
                          className="w-full p-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AD DESK (VARIANTS & HIERARCHY) */}
          {activeTab === 'ad_desk' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="max-w-4xl mx-auto space-y-5">
                <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-3">
                  <div>
                    <span className="text-[10.5px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                      Advertising Command Desk
                    </span>
                    <h2 className="font-serif font-bold text-xl text-[#35101F] dark:text-[#F6F0E7]">
                      Copy Variants A/B/C & Content Hierarchy
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRunAiCommand('ad_generate_variants')}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold hover:opacity-90 flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                      <span>Synthesize New Variants</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="px-4 py-1.5 rounded-xl border border-[#CBBEAC] text-xs font-semibold"
                    >
                      Back to Canvas
                    </button>
                  </div>
                </div>

                {/* 3 Variants Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(activeDoc.adSpec?.variants || []).map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border-2 border-[#CBBEAC] dark:border-[#4d1e2e] space-y-3 flex flex-col justify-between shadow-xs hover:border-[#5A1832] transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-1.5">
                          <span className="font-mono font-bold text-xs text-[#9A7438]">
                            Variant {v.variantKey}
                          </span>
                          <span className="text-[10px] text-[#71685E] font-medium italic">
                            {v.tagline || 'Angle'}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
                          {v.headline}
                        </h4>
                        <p className="font-serif text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
                          {v.subheadline}
                        </p>
                        <p className="font-serif text-xs leading-relaxed text-[#292521] dark:text-[#F6F0E7]">
                          {v.bodyCopy}
                        </p>
                        {v.keyBenefits && (
                          <ul className="space-y-0.5 text-xs text-[#71685E] dark:text-[#c9b9a6]">
                            {v.keyBenefits.map((b, i) => (
                              <li key={i}>&bull; {b}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#CBBEAC]/50 space-y-2">
                        <div className="p-2 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] text-[11px] font-serif font-bold text-[#5A1832] dark:text-[#C29A52] text-center">
                          {v.callToAction}
                        </div>
                        <button
                          onClick={() => {
                            handleBodyChange(
                              `${v.headline.toUpperCase()}\n\n${v.subheadline ? `${v.subheadline}\n\n` : ''}${v.bodyCopy}\n\nKEY BENEFITS:\n${v.keyBenefits?.map((b) => `• ${b}`).join('\n') || ''}\n\nCALL TO ACTION: ${v.callToAction}`
                            );
                            handleUpdateActiveDoc({
                              title: v.headline,
                              subtitle: v.subheadline || activeDoc.subtitle,
                            });
                            setActiveTab('editor');
                          }}
                          className="w-full py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold hover:opacity-90 flex items-center justify-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Use This Variant</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OUTLINE */}
          {activeTab === 'outline' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="w-full max-w-[780px] mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                      Structural Essay & Article Outline
                    </h3>
                    <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                      Plan persuasive progression, section allocation, and key evidence points
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newSec: ContentOutlineSection = {
                        id: `sec-${Date.now()}`,
                        title: `Section ${activeDoc.outline.length + 1}: Key Dimension`,
                        keyPoints: ['Supporting evidence and analysis'],
                        estimatedWords: 350,
                      };
                      handleUpdateActiveDoc({ outline: [...activeDoc.outline, newSec] });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-bold hover:opacity-90 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
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
                          onChange={(e) => {
                            const updated = activeDoc.outline.map((s) =>
                              s.id === sec.id ? { ...s, title: e.target.value } : s
                            );
                            handleUpdateActiveDoc({ outline: updated });
                          }}
                          className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] bg-transparent outline-none flex-1"
                        />
                        <button
                          onClick={() => {
                            handleUpdateActiveDoc({
                              outline: activeDoc.outline.filter((s) => s.id !== sec.id),
                            });
                          }}
                          className="text-[#71685E] hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                                const updated = activeDoc.outline.map((s) =>
                                  s.id === sec.id ? { ...s, keyPoints: newPoints } : s
                                );
                                handleUpdateActiveDoc({ outline: updated });
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
            </div>
          )}

          {/* TAB 5: TONE & VOICE ARCHITECTURE */}
          {activeTab === 'tone' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <ToneVoicePanel
                config={activeDoc.toneConfig}
                onUpdateConfig={(updated) => handleUpdateActiveDoc({ toneConfig: updated })}
                onCalibrateDraftWithTone={() => handleRunAiCommand('change_tone', 'document')}
                isGenerating={isGenerating}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* TAB 6: STRATEGY & SEO */}
          {activeTab === 'strategy' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="w-full max-w-[780px] mx-auto p-6 rounded-2xl bg-[#F6F0E7] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-5 text-xs">
                <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                  Content Strategy, SEO & Reader Intent
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                      Primary Keyword Target
                    </label>
                    <input
                      type="text"
                      value={activeDoc.primaryKeyword}
                      onChange={(e) => handleUpdateActiveDoc({ primaryKeyword: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                      Target Word Count
                    </label>
                    <input
                      type="number"
                      value={activeDoc.targetWordCount}
                      onChange={(e) => handleUpdateActiveDoc({ targetWordCount: Number(e.target.value) || 600 })}
                      className="w-full p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
                    Central Thesis Statement / Key Message
                  </label>
                  <textarea
                    value={activeDoc.thesisStatement}
                    onChange={(e) => handleUpdateActiveDoc({ thesisStatement: e.target.value })}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] outline-none font-serif text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT SPECIALIZED SMART DESK (NEWSROOM OR AD SPEC) */}
        {activeTab === 'editor' && isNewsCategory && activeDoc.newsroom && (
          <NewspaperDeskPanel
            newsroom={activeDoc.newsroom}
            onUpdateNewsroom={(updated) => handleUpdateActiveDoc({ newsroom: updated })}
            onRunAiCommand={(cmd) => handleRunAiCommand(cmd, 'document')}
            isGenerating={isGenerating}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'editor' && isAdCategory && activeDoc.adSpec && (
          <AdvertisementDeskPanel
            adSpec={activeDoc.adSpec}
            onUpdateAdSpec={(updated) => handleUpdateActiveDoc({ adSpec: updated })}
            onRunAiCommand={(cmd) => handleRunAiCommand(cmd, 'document')}
            onApplyVariantToDraft={(variant) => {
              handleBodyChange(
                `${variant.headline.toUpperCase()}\n\n${variant.subheadline ? `${variant.subheadline}\n\n` : ''}${variant.bodyCopy}\n\nKEY BENEFITS:\n${variant.keyBenefits?.map((b) => `• ${b}`).join('\n') || ''}\n\nCALL TO ACTION: ${variant.callToAction}`
              );
              handleUpdateActiveDoc({
                title: variant.headline,
                subtitle: variant.subheadline || activeDoc.subtitle,
              });
            }}
            isGenerating={isGenerating}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. MODALS */}
      {/* ==================================================== */}

      {/* New Piece Creation Wizard Modal */}
      {showWizardModal && (
        <NewPieceWizardModal
          isOpen={showWizardModal}
          onClose={() => setShowWizardModal(false)}
          onCreatePiece={handleCreateDocumentFromWizard}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Humanise & Polish Modal */}
      {showHumaniseModal && (
        <HumanisePolishModal
          isOpen={showHumaniseModal}
          onClose={() => setShowHumaniseModal(false)}
          fullDocumentText={activeDoc.bodyContent || ''}
          selectionStart={textareaRef.current ? textareaRef.current.selectionStart : selectionRange.start}
          selectionEnd={textareaRef.current ? textareaRef.current.selectionEnd : selectionRange.end}
          outline={activeDoc.outline}
          hasSelection={selectedText.length > 0}
          onApplyHumanisedText={(polished, target) => {
            if (target.scope === 'selection' || target.scope === 'paragraph' || target.scope === 'section') {
              const fullText = activeDoc.bodyContent || '';
              const before = fullText.slice(0, target.start);
              const after = fullText.slice(target.end);
              const updated = before + polished + after;
              handleBodyChange(updated);
            } else {
              handleBodyChange(polished);
            }
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Author Voice Guard Modal */}
      {showVoiceModal && (
        <AuthorVoiceModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          voiceProfile={activeDoc.authorVoice}
          onUpdateVoiceProfile={(updated) => handleUpdateActiveDoc({ authorVoice: updated })}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Headline Lab Modal */}
      {showHeadlineLabModal && (
        <HeadlineLabModal
          isOpen={showHeadlineLabModal}
          onClose={() => setShowHeadlineLabModal(false)}
          currentHeadline={activeDoc.title}
          contentType={activeDoc.contentType}
          topic={activeDoc.topic || activeDoc.title}
          savedHeadlines={activeDoc.savedHeadlines || []}
          onApplyHeadline={(newHeadline) => handleUpdateActiveDoc({ title: newHeadline })}
          onSaveHeadlines={(saved) => handleUpdateActiveDoc({ savedHeadlines: saved })}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Content Export Modal */}
      {showExportModal && (
        <ContentExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          document={activeDoc}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl bg-slate-900 text-slate-100 text-sm font-medium border border-slate-700/80 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
