import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Table as TableIcon,
  Undo2,
  Redo2,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Edit3,
  Check,
  ChevronDown,
  Wand2,
  FileText,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Layers,
  Award,
  MoreVertical,
  Split,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { StudioChapter, ChapterSection, TextbookContentBlock, ContentBlockType } from '../../types';

export const SUGGESTED_GRAMMAR_SECTIONS = [
  { id: 'opener', title: 'Chapter Opener & Hook', type: 'opener', icon: Sparkles },
  { id: 'objectives', title: 'Learning Objectives', type: 'objectives', icon: Award },
  { id: 'warmup', title: 'Warm-Up Diagnostic', type: 'warmup', icon: Lightbulb },
  { id: 'introduction', title: 'Concept Introduction & Discovery', type: 'introduction', icon: BookOpen },
  { id: 'explanation', title: 'Detailed Explanation & Theory', type: 'explanation', icon: FileText },
  { id: 'rules', title: 'Grammar Rules & Concord Principles', type: 'rules', icon: Award },
  { id: 'examples', title: 'Exemplary Sentences & Contrast Pairs', type: 'examples', icon: Split },
  { id: 'worked_examples', title: 'Worked Examples & Modeling', type: 'worked_examples', icon: HelpCircle },
  { id: 'remember', title: 'Remember / Key Takeaways', type: 'remember', icon: Lightbulb },
  { id: 'common_errors', title: 'Common Errors & Exam Traps', type: 'common_errors', icon: AlertTriangle },
  { id: 'exercises', title: 'Practice Exercises (A–D)', type: 'exercises', icon: FileText },
  { id: 'activities', title: 'Communicative & Pair Activities', type: 'activities', icon: Sparkles },
  { id: 'summary', title: 'Chapter Summary & Quick Guide', type: 'summary', icon: Layers },
  { id: 'answer_key', title: 'Answer Key & Explanations', type: 'answer_key', icon: CheckCircle2 },
];

export interface SimpleWritingModeViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onOpenDraftAiModal: () => void;
  onOpenHumaniseModal: (scope?: 'selection' | 'section' | 'chapter', selectedText?: string) => void;
  onTriggerCopilotAction?: (actionKey: string, textToUse?: string) => void;
  onInsertContentBlock?: (block: TextbookContentBlock) => void;
  isDarkMode?: boolean;
}

export const SimpleWritingModeView: React.FC<SimpleWritingModeViewProps> = ({
  chapter,
  onUpdateChapter,
  activeSectionId,
  onSelectSection,
  onOpenDraftAiModal,
  onOpenHumaniseModal,
  onTriggerCopilotAction,
}) => {
  // Continuous vs Section-based view toggle
  const [isContinuousView, setIsContinuousView] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [activeEditingBlockId, setActiveEditingBlockId] = useState<string | null>(null);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const [isAddSectionMenuOpen, setIsAddSectionMenuOpen] = useState(false);
  const [aiExecutingAction, setAiExecutingAction] = useState<string | null>(null);

  // Undo/Redo history stack
  const [history, setHistory] = useState<StudioChapter[]>([chapter]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Track selection
  const handleTextSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      setSelectedText(sel.toString().trim());
    } else {
      setSelectedText('');
    }
  };

  // Push to history on change
  const pushUpdate = (updated: StudioChapter) => {
    onUpdateChapter({
      ...updated,
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });

    setHistory((prev) => [...prev.slice(0, historyIndex + 1), updated]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevChapter = history[historyIndex - 1];
      setHistoryIndex((prev) => prev - 1);
      onUpdateChapter(prevChapter);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextChapter = history[historyIndex + 1];
      setHistoryIndex((prev) => prev + 1);
      onUpdateChapter(nextChapter);
    }
  };

  // Ensure chapter has at least one section
  const sections = chapter.sections && chapter.sections.length > 0
    ? chapter.sections
    : [
        {
          id: `sec-default-${Date.now()}`,
          chapterId: chapter.id,
          numberLabel: `${chapter.chapterNumber}.1`,
          title: 'Introduction & Core Concept',
          order: 1,
          blocks: [
            {
              id: `blk-default-1`,
              type: 'text' as const,
              order: 1,
              visibility: 'student' as const,
              textContent:
                'In English grammar, a verb must agree with its subject in number and person. When the subject is singular, the verb takes a singular form; when the subject is plural, the verb takes a plural form.',
            },
          ],
        },
      ];

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  // Calculate manuscript statistics
  const totalWords = sections.reduce((acc, sec) => {
    const secWords = sec.blocks.reduce((bAcc, b) => {
      const text = b.textContent || b.calloutText || '';
      return bAcc + (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    }, 0);
    return acc + secWords;
  }, 0);

  const readingTimeMin = Math.max(1, Math.ceil(totalWords / 150));

  // --- Section Operations ---
  const handleAddSection = (suggestedTitle?: string) => {
    const nextOrder = sections.length + 1;
    const newTitle = suggestedTitle || `Section ${nextOrder}: New Section`;
    const newSection: ChapterSection = {
      id: `sec-${Date.now()}`,
      chapterId: chapter.id,
      numberLabel: `${chapter.chapterNumber}.${nextOrder}`,
      title: newTitle,
      order: nextOrder,
      blocks: [
        {
          id: `blk-${Date.now()}-1`,
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent: '',
        },
      ],
    };

    const updated = {
      ...chapter,
      sections: [...sections, newSection],
    };
    pushUpdate(updated);
    onSelectSection(newSection.id);
    setIsAddSectionMenuOpen(false);
  };

  const handleRenameSection = (secId: string, newTitle: string) => {
    const updated = {
      ...chapter,
      sections: sections.map((s) => (s.id === secId ? { ...s, title: newTitle } : s)),
    };
    pushUpdate(updated);
  };

  const handleDeleteSection = (secId: string) => {
    if (sections.length <= 1) {
      alert('A chapter must have at least one section.');
      return;
    }
    const updated = {
      ...chapter,
      sections: sections.filter((s) => s.id !== secId),
    };
    pushUpdate(updated);
    if (activeSectionId === secId) {
      const remaining = sections.filter((s) => s.id !== secId);
      onSelectSection(remaining[0].id);
    }
  };

  const handleDuplicateSection = (secId: string) => {
    const target = sections.find((s) => s.id === secId);
    if (!target) return;

    const duplicated: ChapterSection = {
      ...target,
      id: `sec-dup-${Date.now()}`,
      title: `${target.title} (Copy)`,
      order: target.order + 1,
      blocks: target.blocks.map((b) => ({
        ...b,
        id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    };

    const targetIdx = sections.findIndex((s) => s.id === secId);
    const newSections = [...sections];
    newSections.splice(targetIdx + 1, 0, duplicated);

    const reordered = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    pushUpdate({ ...chapter, sections: reordered });
    onSelectSection(duplicated.id);
  };

  const handleMoveSection = (secId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex((s) => s.id === secId);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reordered = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    pushUpdate({ ...chapter, sections: reordered });
  };

  // --- Block Operations ---
  const handleUpdateBlockContent = (secId: string, blockId: string, text: string) => {
    const updated = {
      ...chapter,
      sections: sections.map((s) => {
        if (s.id !== secId) return s;
        return {
          ...s,
          blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, textContent: text } : b)),
        };
      }),
    };
    pushUpdate(updated);
  };

  const handleAddBlockToSection = (secId: string, type: 'text' | 'callout' | 'example' | 'exercise' = 'text') => {
    const targetSec = sections.find((s) => s.id === secId);
    if (!targetSec) return;

    const newBlock: TextbookContentBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: (type === 'callout' ? 'grammar_rule' : type === 'example' ? 'worked_example' : 'text') as ContentBlockType,
      order: targetSec.blocks.length + 1,
      visibility: 'student',
      textContent: type === 'callout' ? 'Remember: Singular subjects take singular verbs.' : '',
      calloutTitle: type === 'callout' ? 'Fundamental Rule' : undefined,
    };

    const updated = {
      ...chapter,
      sections: sections.map((s) => {
        if (s.id !== secId) return s;
        return { ...s, blocks: [...s.blocks, newBlock] };
      }),
    };
    pushUpdate(updated);
  };

  const handleDeleteBlock = (secId: string, blockId: string) => {
    const updated = {
      ...chapter,
      sections: sections.map((s) => {
        if (s.id !== secId) return s;
        return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) };
      }),
    };
    pushUpdate(updated);
  };

  // --- AI Direct Action on Manuscript ---
  const handleTriggerAiAction = async (actionKey: string, customText?: string) => {
    setAiExecutingAction(actionKey);
    setIsAiDropdownOpen(false);

    try {
      const contextText = customText || selectedText || activeSection?.blocks?.[0]?.textContent || chapter.title;
      const res = await fetch('/api/chapter-studio/ai-writing-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionKey,
          text: contextText,
          chapterTitle: chapter.title,
          sectionTitle: activeSection?.title || '',
          board: chapter.curriculumBoard || chapter.systemId || 'CBSE',
          classLevel: chapter.equivalentClass || 'Class 6',
          subject: chapter.subject || 'English Grammar',
          existingChapterContent: sections.map((s) => s.blocks.map((b) => b.textContent).join('\n')).join('\n\n'),
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        // Append as a new block in active section
        const newBlock: TextbookContentBlock = {
          id: `blk-ai-${Date.now()}`,
          type: 'text',
          order: (activeSection?.blocks?.length || 0) + 1,
          visibility: 'student',
          textContent: data.result,
          authorNotes: `Generated via AI: ${data.actionLabel || actionKey}`,
        };

        const updated = {
          ...chapter,
          sections: sections.map((s) => {
            if (s.id !== activeSection.id) return s;
            return { ...s, blocks: [...s.blocks, newBlock] };
          }),
        };
        pushUpdate(updated);
      }
    } catch (err) {
      console.error('AI action failed:', err);
    } finally {
      setAiExecutingAction(null);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col h-full min-h-0 bg-[#F6F0E7] text-[#292521] overflow-hidden select-text"
      onMouseUp={handleTextSelection}
    >
      {/* ========================================================================= */}
      {/* CLEAN FORMATTING TOOLBAR (Word / Google Docs Experience)                  */}
      {/* ========================================================================= */}
      <div className="shrink-0 px-4 py-2 bg-[#FFFDF8] border-b border-[#CBBEAC] flex items-center justify-between shadow-2xs z-10 flex-wrap gap-2">
        {/* Left Toolbar Items: Styles, Font formatting, Alignment, Lists, Insertables */}
        <div className="flex items-center space-x-1 flex-wrap gap-y-1">
          {/* Style Selector */}
          <div className="relative inline-block">
            <select
              aria-label="Format Block Style"
              className="h-8 px-2.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] hover:bg-[#EDE4D6] text-xs font-semibold text-[#35101F] focus:outline-none focus:ring-1 focus:ring-[#C29A52] cursor-pointer"
              onChange={(e) => {
                if (e.target.value === 'callout') {
                  handleAddBlockToSection(activeSection.id, 'callout');
                } else if (e.target.value === 'example') {
                  handleAddBlockToSection(activeSection.id, 'example');
                }
              }}
            >
              <option value="normal">Normal Body Text</option>
              <option value="h1">Heading 1 (Main Topic)</option>
              <option value="h2">Heading 2 (Sub-Principle)</option>
              <option value="h3">Heading 3 (Example Group)</option>
              <option value="callout">📌 Callout / Rule Box</option>
              <option value="example">⚖️ Example Pair (✓ / ✗)</option>
            </select>
          </div>

          <div className="h-5 w-px bg-[#CBBEAC] mx-1" />

          {/* Text Formatting */}
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
            onClick={() => document.execCommand('bold', false)}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
            onClick={() => document.execCommand('italic', false)}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Underline (Ctrl+U)"
            onClick={() => document.execCommand('underline', false)}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Strikethrough"
            onClick={() => document.execCommand('strikeThrough', false)}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-[#CBBEAC] mx-1" />

          {/* Alignment */}
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Align Left"
            onClick={() => document.execCommand('justifyLeft', false)}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Align Center"
            onClick={() => document.execCommand('justifyCenter', false)}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Justify"
            onClick={() => document.execCommand('justifyFull', false)}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-[#CBBEAC] mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Bulleted List"
            onClick={() => document.execCommand('insertUnorderedList', false)}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Numbered List"
            onClick={() => document.execCommand('insertOrderedList', false)}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer"
            title="Blockquote"
            onClick={() => handleAddBlockToSection(activeSection.id, 'callout')}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-px bg-[#CBBEAC] mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Toolbar Items: Prominent AI Tools & Humanise Action */}
        <div className="flex items-center space-x-2">
          {/* Continuous vs Section Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsContinuousView((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isContinuousView
                ? 'bg-[#5A1832] text-[#FFFDF8] border-[#5A1832]'
                : 'bg-[#FFFDF8] text-[#71685E] border-[#CBBEAC] hover:border-[#C29A52]'
            }`}
            title="Switch between single continuous document and section-by-section view"
          >
            {isContinuousView ? 'Continuous Flow' : 'Sectioned View'}
          </button>

          {/* Prominent Humanise / Polish Action Button */}
          <button
            type="button"
            onClick={() =>
              onOpenHumaniseModal(
                selectedText ? 'selection' : 'section',
                selectedText || activeSection?.blocks?.[0]?.textContent || ''
              )
            }
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F6F0E7] hover:bg-[#EDE4D6] text-[#5A1832] border border-[#C29A52] transition-all cursor-pointer shadow-2xs inline-flex items-center space-x-1.5"
            title="Humanise and polish AI-assisted drafts into authentic authorial prose"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Humanise &amp; Polish</span>
          </button>

          {/* Prominent Write with AI Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAiDropdownOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] transition-all cursor-pointer shadow-xs inline-flex items-center space-x-1.5 border border-[#C29A52]/40"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Write with AI</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isAiDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-xl py-1.5 z-50 text-xs text-[#292521]">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#71685E] border-b border-[#CBBEAC]/50 font-mono">
                  Pedagogical Writing Actions
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('continue_writing')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Continue Writing</span>
                  <span className="text-[10px] text-[#71685E]">Next paragraph</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('explain_clearly')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Explain More Clearly</span>
                  <Sparkles className="w-3 h-3 text-[#C29A52]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('simplify_grade')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Simplify for {chapter.equivalentClass}</span>
                  <Lightbulb className="w-3 h-3 text-[#C29A52]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('make_advanced')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Make More Advanced</span>
                  <Award className="w-3 h-3 text-[#5A1832]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('generate_examples')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Generate Contrast Examples</span>
                  <Split className="w-3 h-3 text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('generate_exercises')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Generate Exercises</span>
                  <FileText className="w-3 h-3 text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('generate_answer_key')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Generate Answer Key</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('generate_learning_objectives')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Generate Objectives (Bloom)</span>
                  <Award className="w-3 h-3 text-amber-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerAiAction('suggest_activities')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F6F0E7] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold text-[#35101F]">Suggest Activities</span>
                  <Sparkles className="w-3 h-3 text-[#C29A52]" />
                </button>

                <div className="border-t border-[#CBBEAC]/50 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsAiDropdownOpen(false);
                    onOpenDraftAiModal();
                  }}
                  className="w-full text-left px-3 py-2 bg-[#F6F0E7] hover:bg-[#EDE4D6] text-[#5A1832] font-bold flex items-center justify-between cursor-pointer rounded-b-xl"
                >
                  <span>Draft Entire Chapter...</span>
                  <BookOpen className="w-3.5 h-3.5 text-[#5A1832]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MANUSCRIPT CANVAS (Document Page Centerpiece)                             */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 overscroll-contain">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Document Sheet / Page */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#CBBEAC]/70 shadow-sm p-8 sm:p-14 min-h-[820px] space-y-8 relative">
            {/* Autosave & Document Metadata Pill */}
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/40 pb-4 text-xs text-[#71685E]">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#5A1832] uppercase tracking-wider font-mono text-[10px]">
                  {chapter.curriculumBoard || chapter.systemId || 'CBSE'} • {chapter.equivalentClass}
                </span>
                <span className="text-[#CBBEAC]">•</span>
                <span>{chapter.subject || 'English Grammar'}</span>
              </div>

              <div className="flex items-center space-x-3 text-[11px]">
                <span>{totalWords} words</span>
                <span className="text-[#CBBEAC]">•</span>
                <span>{readingTimeMin} min read</span>
                <span className="text-[#CBBEAC]">•</span>
                <span className="inline-flex items-center space-x-1 text-emerald-800 font-medium">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Autosaved</span>
                </span>
              </div>
            </div>

            {/* Document Header (Chapter Title & Scope) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C29A52] font-mono">
                  CHAPTER {chapter.chapterNumber}
                </span>
                {aiExecutingAction && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] animate-pulse">
                    AI writing: {aiExecutingAction}...
                  </span>
                )}
              </div>

              {/* Editable Chapter Title */}
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => pushUpdate({ ...chapter, title: e.target.value })}
                className="w-full font-serif font-black text-3xl sm:text-4xl text-[#35101F] tracking-tight border-none focus:outline-none focus:ring-0 bg-transparent p-0 placeholder-[#CBBEAC]"
                placeholder="Chapter Title"
              />

              {/* Editable Chapter Subtitle */}
              <input
                type="text"
                value={chapter.subtitle || ''}
                onChange={(e) => pushUpdate({ ...chapter, subtitle: e.target.value })}
                className="w-full font-serif text-sm sm:text-base text-[#71685E] border-none focus:outline-none focus:ring-0 bg-transparent p-0 placeholder-[#CBBEAC]"
                placeholder="Add pedagogical scope / subtitle (e.g. Agreement in Person, Number and Collective Nouns)..."
              />
            </div>

            {/* Horizontal Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#CBBEAC] to-transparent my-6" />

            {/* =================================================================== */}
            {/* MANUSCRIPT CONTENT: Flexible Sections or Continuous Flow            */}
            {/* =================================================================== */}
            <div className="space-y-10">
              {sections.map((section, secIdx) => {
                const isFocused = !isContinuousView && section.id === activeSectionId;
                if (!isContinuousView && section.id !== activeSectionId) {
                  return null; // When in single section mode, only show the active one
                }

                return (
                  <div
                    key={section.id}
                    className="space-y-4 group relative transition-all"
                    onClick={() => onSelectSection(section.id)}
                  >
                    {/* Section Header with Section Controls */}
                    <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#C29A52]">
                          {secIdx + 1}.
                        </span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleRenameSection(section.id, e.target.value)}
                          className="font-serif font-bold text-lg text-[#35101F] bg-transparent border-none focus:outline-none focus:ring-0 p-0 flex-1 truncate"
                          placeholder="Section Title"
                        />
                      </div>

                      {/* Section Quick Actions */}
                      <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(section.id, 'up')}
                          disabled={secIdx === 0}
                          className="p-1 rounded hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] cursor-pointer disabled:opacity-20"
                          title="Move section up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(section.id, 'down')}
                          disabled={secIdx === sections.length - 1}
                          className="p-1 rounded hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] cursor-pointer disabled:opacity-20"
                          title="Move section down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(section.id)}
                          className="p-1 rounded hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#35101F] cursor-pointer"
                          title="Duplicate section"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenHumaniseModal(
                              'section',
                              section.blocks.map((b) => b.textContent).join('\n\n')
                            )
                          }
                          className="p-1 rounded hover:bg-[#EDE4D6] text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                          title="Humanise this section"
                        >
                          <Sparkles className="w-3 h-3 text-[#C29A52]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 rounded hover:bg-rose-100 text-[#71685E] hover:text-rose-700 cursor-pointer"
                          title="Delete section"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Section Blocks / Prose Paragraphs */}
                    <div className="space-y-4">
                      {section.blocks.map((block, blockIdx) => (
                        <div
                          key={block.id}
                          className="relative group/block rounded-xl transition-all"
                          onFocus={() => setActiveEditingBlockId(block.id)}
                        >
                          {block.type === 'grammar_rule' || block.type === 'remember' || block.type === 'important_note' ? (
                            /* Special Callout / Rule Box */
                            <div className="p-4 rounded-xl border border-[#C29A52]/60 bg-[#F6F0E7] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs uppercase text-[#5A1832] flex items-center space-x-1.5 font-mono">
                                  <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                                  <span>{block.calloutTitle || 'Rule Principle'}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBlock(section.id, block.id)}
                                  className="text-[#71685E] hover:text-rose-600 p-0.5 cursor-pointer opacity-0 group-hover/block:opacity-100"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <textarea
                                rows={3}
                                value={block.textContent || ''}
                                onChange={(e) =>
                                  handleUpdateBlockContent(section.id, block.id, e.target.value)
                                }
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 font-serif text-sm text-[#292521] leading-relaxed resize-none"
                                placeholder="State the rule clearly..."
                              />
                            </div>
                          ) : (
                            /* Standard Prose Paragraph */
                            <div className="relative">
                              <textarea
                                rows={Math.max(3, Math.ceil((block.textContent || '').length / 80))}
                                value={block.textContent || ''}
                                onChange={(e) =>
                                  handleUpdateBlockContent(section.id, block.id, e.target.value)
                                }
                                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 font-serif text-base sm:text-lg text-[#292521] leading-relaxed resize-none placeholder-[#CBBEAC]"
                                placeholder="Type chapter prose freely here. Use the toolbar or AI to assist..."
                              />

                              {/* Hover Block Controls */}
                              <div className="absolute right-0 top-0 opacity-0 group-hover/block:opacity-100 transition-opacity flex items-center space-x-1 bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onOpenHumaniseModal('section', block.textContent || '')
                                  }
                                  className="p-1 rounded hover:bg-[#F6F0E7] text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                                  title="Humanise paragraph"
                                >
                                  <Sparkles className="w-3 h-3 text-[#C29A52]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBlock(section.id, block.id)}
                                  className="p-1 rounded hover:bg-rose-100 text-[#71685E] hover:text-rose-600 cursor-pointer"
                                  title="Delete paragraph"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Block Below Section */}
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddBlockToSection(section.id, 'text')}
                        className="px-2.5 py-1 rounded-lg border border-dashed border-[#CBBEAC] hover:border-[#C29A52] text-xs text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Paragraph</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddBlockToSection(section.id, 'callout')}
                        className="px-2.5 py-1 rounded-lg border border-dashed border-[#CBBEAC] hover:border-[#C29A52] text-xs text-[#71685E] hover:text-[#35101F] transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Award className="w-3 h-3 text-[#C29A52]" />
                        <span>Add Rule Box</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Section Action */}
            <div className="pt-8 border-t border-[#CBBEAC]/50 flex items-center justify-between">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAddSectionMenuOpen((prev) => !prev)}
                  className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#F6F0E7] hover:bg-[#EDE4D6] text-xs font-bold text-[#35101F] transition-all cursor-pointer inline-flex items-center space-x-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>+ Add Section</span>
                  <ChevronDown className="w-3 h-3 text-[#71685E]" />
                </button>

                {isAddSectionMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-72 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-xl py-2 z-50 text-xs text-[#292521] max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#71685E] font-mono border-b border-[#CBBEAC]/40">
                      Suggested Grammar Building Blocks
                    </div>
                    {SUGGESTED_GRAMMAR_SECTIONS.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleAddSection(item.title)}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#F6F0E7] flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <IconComponent className="w-3.5 h-3.5 text-[#C29A52] shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                    <div className="border-t border-[#CBBEAC]/40 my-1" />
                    <button
                      type="button"
                      onClick={() => handleAddSection('Custom Section')}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F6F0E7] font-bold text-[#5A1832] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Custom Empty Section</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-[#71685E]">
                {sections.length} flexible section{sections.length === 1 ? '' : 's'} in chapter
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
