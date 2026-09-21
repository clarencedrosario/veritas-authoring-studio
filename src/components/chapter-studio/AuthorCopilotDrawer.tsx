import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Check,
  Copy,
  ArrowDown,
  Layers,
  ShieldCheck,
  Lightbulb,
  FileText,
  SlidersHorizontal,
  Volume2,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  PanelRightClose,
} from 'lucide-react';
import { StudioChapter, TextbookContentBlock } from '../../types';
import { runAuthorAiCopilotAction } from '../../utils/chapterStudioData';

interface AuthorCopilotDrawerProps {
  chapter: StudioChapter;
  selectedText: string;
  activeSectionTitle: string;
  onInsertContentBlock: (block: TextbookContentBlock) => void;
  onOpenVisualStudio: () => void;
  onUpdateChapterAuthorNotes: (notes: string) => void;
  onToggleCollapse?: () => void;
  isDarkMode: boolean;
}

export const AuthorCopilotDrawer: React.FC<AuthorCopilotDrawerProps> = ({
  chapter,
  selectedText,
  activeSectionTitle,
  onInsertContentBlock,
  onOpenVisualStudio,
  onUpdateChapterAuthorNotes,
  onToggleCollapse,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'copilot' | 'voice_protection' | 'notes'>('copilot');
  const [isLoading, setIsLoading] = useState(false);
  const [lastActionOutput, setLastActionOutput] = useState<{
    actionLabel: string;
    proposedContent: string;
    rationale: string;
    pedagogicalBenefit: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [authorNotesText, setAuthorNotesText] = useState(chapter.authorNotes || '');

  const executeAction = (actionKey: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const res = runAuthorAiCopilotAction(
        actionKey,
        selectedText,
        chapter.equivalentClass,
        chapter.title
      );
      setLastActionOutput(res);
      setIsLoading(false);
    }, 300);
  };

  const handleInsertBelow = () => {
    if (!lastActionOutput) return;
    const newBlock: TextbookContentBlock = {
      id: `blk-copilot-${Date.now()}`,
      type: 'text',
      order: Date.now(),
      visibility: 'student',
      textContent: lastActionOutput.proposedContent,
      authorNotes: `Generated via AI Copilot (${lastActionOutput.actionLabel})`,
    };
    onInsertContentBlock(newBlock);
  };

  const handleCopy = () => {
    if (!lastActionOutput) return;
    navigator.clipboard.writeText(lastActionOutput.proposedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="h-full w-full flex flex-col min-h-0 min-w-0 border-l border-[#CBBEAC] text-xs overflow-hidden bg-[#EDE4D6] text-[#292521]"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-[#CBBEAC] space-y-2 shrink-0 bg-[#EDE4D6] select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/40 shrink-0">
              <Sparkles className="w-4 h-4 text-[#C29A52]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-[#35101F] truncate">Author Intelligence &amp; Copilot</h3>
              <p className="text-[10px] text-[#71685E] truncate">
                Active: <span className="font-semibold text-[#5A1832]">{chapter.equivalentClass}</span>
              </p>
            </div>
          </div>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] cursor-pointer shrink-0"
              title="Collapse Author Intelligence"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#CBBEAC]/40 rounded-xl text-[10px] font-semibold text-center">
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'copilot'
                ? 'bg-[#FFFDF8] text-[#5A1832] font-bold shadow-xs'
                : 'text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Pedagogy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voice_protection')}
            className={`py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'voice_protection'
                ? 'bg-[#FFFDF8] text-[#5A1832] font-bold shadow-xs'
                : 'text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Voice Check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-[#FFFDF8] text-[#5A1832] font-bold shadow-xs'
                : 'text-[#71685E] hover:text-[#292521]'
            }`}
          >
            Author Notes
          </button>
        </div>
      </div>

      {/* Body (Single Scroll Owner for Right Drawer) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0 overscroll-contain pb-[80px]">
        {activeTab === 'copilot' && (
          <div className="space-y-3">
            <div>
              <span className="font-bold text-[10px] uppercase text-[#71685E] block mb-1.5">
                Contextual Writing Actions
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => executeAction('explain_more_clearly')}
                  className="w-full text-left p-2 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] font-medium text-[11px] text-[#292521] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Explain More Clearly</span>
                  <Sparkles className="w-3 h-3 text-[#C29A52]" />
                </button>
                <button
                  type="button"
                  onClick={() => executeAction('simplify_for_stage')}
                  className="w-full text-left p-2 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] font-medium text-[11px] text-[#292521] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Simplify for {chapter.equivalentClass}</span>
                  <Lightbulb className="w-3 h-3 text-[#C29A52]" />
                </button>
                <button
                  type="button"
                  onClick={() => executeAction('make_more_advanced')}
                  className="w-full text-left p-2 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] font-medium text-[11px] text-[#292521] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Make More Advanced / Olympiad</span>
                  <ChevronRight className="w-3 h-3 text-[#C29A52]" />
                </button>
                <button
                  type="button"
                  onClick={() => executeAction('suggest_example')}
                  className="w-full text-left p-2 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] font-medium text-[11px] text-[#292521] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Suggest Contextual Examples</span>
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                </button>
                <button
                  type="button"
                  onClick={() => executeAction('suggest_common_errors')}
                  className="w-full text-left p-2 rounded-xl border border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] font-medium text-[11px] text-[#292521] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Suggest Common Errors &amp; Traps</span>
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                </button>
                <button
                  type="button"
                  onClick={onOpenVisualStudio}
                  className="w-full text-left p-2 rounded-xl border border-[#C29A52]/50 bg-[#F6F0E7] hover:bg-[#EDE4D6] font-bold text-[#5A1832] text-[11px] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Suggest Visual / Diagram Brief</span>
                  <Sparkles className="w-3 h-3 text-[#C29A52]" />
                </button>
              </div>
            </div>

            {/* Output Display */}
            {isLoading ? (
              <div className="p-4 text-center text-[#71685E] text-xs font-medium">
                Generating pedagogical guidance...
              </div>
            ) : lastActionOutput ? (
              <div className="p-3 rounded-2xl border border-[#C29A52]/50 bg-[#FFFDF8] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#5A1832]">
                    {lastActionOutput.actionLabel}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1 hover:text-[#C29A52] text-[#71685E] cursor-pointer"
                      title="Copy"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed whitespace-pre-line text-[#292521] bg-[#F6F0E7] p-2.5 rounded-xl border border-[#CBBEAC] font-mono">
                  {lastActionOutput.proposedContent}
                </p>

                <div className="text-[10px] text-[#71685E] space-y-0.5 font-medium">
                  <p><span className="font-bold text-[#292521]">Rationale:</span> {lastActionOutput.rationale}</p>
                  <p><span className="font-bold text-[#292521]">Benefit:</span> {lastActionOutput.pedagogicalBenefit}</p>
                </div>

                <div className="pt-1 flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleInsertBelow}
                    className="flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold bg-[#5A1832] text-[#F6F0E7] hover:bg-[#35101F] flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span>Insert as Block</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLastActionOutput(null)}
                    className="py-1.5 px-2 rounded-xl text-[10px] border border-[#CBBEAC] hover:bg-[#EDE4D6] text-[#71685E] cursor-pointer transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'voice_protection' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#CBBEAC] text-[#292521] space-y-1 shadow-2xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs text-[#35101F]">Author Voice Protection</span>
              </div>
              <p className="text-[10px] text-[#71685E] leading-relaxed font-medium">
                Guards against robotic AI homogenization. Checks for consistent register, age-appropriate readability, and pedagogical tone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => executeAction('author_voice_analysis')}
              className="w-full py-2 px-3 rounded-xl font-bold bg-[#5A1832] text-[#F6F0E7] hover:bg-[#35101F] border border-[#C29A52]/40 flex items-center justify-center space-x-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Run Stylistic Tone Audit</span>
            </button>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-2">
            <label className="block font-bold text-[10px] uppercase text-[#71685E]">
              Private Author Notebook
            </label>
            <textarea
              rows={12}
              value={authorNotesText}
              onChange={(e) => setAuthorNotesText(e.target.value)}
              onBlur={() => onUpdateChapterAuthorNotes(authorNotesText)}
              placeholder="Record chapter editorial decisions, references to board syllabus guidelines, or production notes here..."
              className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] placeholder-[#71685E] text-xs font-mono leading-relaxed focus:outline-hidden focus:border-[#C29A52]"
            />
            <p className="text-[10px] text-[#71685E] italic">
              Auto-saved with chapter state. Invisible to students and teachers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
