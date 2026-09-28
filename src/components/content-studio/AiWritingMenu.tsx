import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  FileText,
  CornerDownRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  AlignLeft,
  List,
  Layers,
  Wand2,
  Sliders,
  Type,
  ShieldCheck,
  AlertCircle,
  Check,
} from 'lucide-react';
import { AiActionScope } from './aiTargetResolver';

export type { AiActionScope };

interface AiWritingMenuProps {
  onRunAction: (actionKey: string, scope: AiActionScope, customPrompt?: string) => void;
  isGenerating: boolean;
  hasSelection: boolean;
}

export const AiWritingMenu: React.FC<AiWritingMenuProps> = ({
  onRunAction,
  isGenerating,
  hasSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<AiActionScope>(hasSelection ? 'selection' : 'document');
  const [customPrompt, setCustomPrompt] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync scope when selection state changes
  useEffect(() => {
    if (hasSelection) {
      setScope('selection');
    }
  }, [hasSelection]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleActionClick = (actionKey: string) => {
    onRunAction(actionKey, scope, customPrompt.trim() || undefined);
    setIsOpen(false);
    setCustomPrompt('');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Prominent Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className="min-h-[36px] px-3.5 rounded-xl bg-gradient-to-r from-[#5A1832] to-[#732342] text-[#F6F0E7] dark:from-[#C29A52] dark:to-[#9A7438] dark:text-[#35101F] text-xs font-bold hover:opacity-95 shadow-md flex items-center space-x-2 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-[#C29A52] dark:text-[#35101F] animate-pulse" />
        <span className="tracking-wide">✨ WRITE WITH AI</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-80" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#F6F0E7] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] shadow-2xl z-50 p-3 space-y-3 text-xs select-none">
          {/* Scope Selector Header */}
          <div className="p-2.5 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
              <span>Target Scope</span>
              {hasSelection ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-sans font-medium text-[10.5px]">
                  Text highlighted
                </span>
              ) : (
                <span className="text-[#71685E] font-sans font-normal text-[10.5px]">
                  Cursor active
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'selection', label: 'Selection' },
                { id: 'paragraph', label: 'Paragraph' },
                { id: 'section', label: 'Section' },
                { id: 'document', label: 'Document' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScope(item.id as AiActionScope)}
                  className={`py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    scope === item.id
                      ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-bold shadow-xs'
                      : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Custom Prompt Input */}
          <div className="space-y-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  handleActionClick('custom_instruction');
                }
              }}
              placeholder={`Custom instructions for ${scope} (e.g. Make sharper, add example)...`}
              className="w-full p-2 rounded-xl bg-[#EDE4D6] dark:bg-[#200b14] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs outline-none text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E]"
            />
          </div>

          {/* Contextual Action List Based On Resolved Scope */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {/* 1. SELECTION SCOPE */}
            {scope === 'selection' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] px-1">
                  <span>Selection Actions</span>
                  <span className="font-normal opacity-80">Replaces highlighted text</span>
                </div>

                {!hasSelection ? (
                  <div className="p-3 text-center text-amber-800 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Select text in the document first.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'rewrite_selection', label: 'Rewrite Selection' },
                      { key: 'expand_selection', label: 'Expand Selection' },
                      { key: 'shorten_selection', label: 'Shorten Selection' },
                      { key: 'improve_clarity', label: 'Improve Clarity' },
                      { key: 'improve_flow', label: 'Improve Flow' },
                      { key: 'humanise', label: 'Humanise Selection' },
                      { key: 'change_tone', label: 'Change Tone' },
                      { key: 'fix_grammar', label: 'Fix Grammar' },
                      { key: 'generate_alternatives', label: 'Generate Alternatives' },
                    ].map((act) => (
                      <button
                        key={act.key}
                        onClick={() => handleActionClick(act.key)}
                        className="text-left p-2 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#35101F] dark:text-[#F6F0E7] font-medium transition-colors cursor-pointer border border-transparent hover:border-[#CBBEAC]/50"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. PARAGRAPH SCOPE */}
            {scope === 'paragraph' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] px-1">
                  <span>Paragraph Actions</span>
                  <span className="font-normal opacity-80">Replaces caret paragraph</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'rewrite_paragraph', label: 'Rewrite Paragraph' },
                    { key: 'expand_paragraph', label: 'Expand Paragraph' },
                    { key: 'shorten_paragraph', label: 'Shorten Paragraph' },
                    { key: 'improve_clarity', label: 'Improve Clarity' },
                    { key: 'improve_flow', label: 'Improve Flow' },
                    { key: 'humanise', label: 'Humanise Paragraph' },
                    { key: 'strengthen_paragraph', label: 'Strengthen Paragraph' },
                    { key: 'fix_grammar', label: 'Fix Grammar' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      onClick={() => handleActionClick(act.key)}
                      className="text-left p-2 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#35101F] dark:text-[#F6F0E7] font-medium transition-colors cursor-pointer border border-transparent hover:border-[#CBBEAC]/50"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SECTION SCOPE */}
            {scope === 'section' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] px-1">
                  <span>Section Actions</span>
                  <span className="font-normal opacity-80">Replaces current section body</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'rewrite_section', label: 'Rewrite Section' },
                    { key: 'expand_section', label: 'Expand Section' },
                    { key: 'condense_section', label: 'Condense Section' },
                    { key: 'improve_section_flow', label: 'Improve Section Flow' },
                    { key: 'strengthen_opening', label: 'Strengthen Opening' },
                    { key: 'strengthen_ending', label: 'Strengthen Ending' },
                    { key: 'humanise', label: 'Humanise Section' },
                    { key: 'add_supporting_points', label: 'Add Supporting Points' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      onClick={() => handleActionClick(act.key)}
                      className="text-left p-2 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#35101F] dark:text-[#F6F0E7] font-medium transition-colors cursor-pointer border border-transparent hover:border-[#CBBEAC]/50"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. DOCUMENT SCOPE */}
            {scope === 'document' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52] px-1">
                  <span>Document Actions</span>
                  <span className="font-normal opacity-80">Full manuscript operations</span>
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => handleActionClick('generate_full_draft')}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] flex items-center justify-between text-[#35101F] dark:text-[#F6F0E7] font-semibold"
                  >
                    <span>Generate Full Draft</span>
                    <span className="text-[10px] text-[#9A7438] font-mono">From Brief</span>
                  </button>
                  <button
                    onClick={() => handleActionClick('continue')}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] flex items-center justify-between text-[#35101F] dark:text-[#F6F0E7]"
                  >
                    <span className="font-medium">Continue Writing</span>
                    <span className="text-[10px] text-[#71685E]">At Caret</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-[#CBBEAC]/40 dark:border-[#4d1e2e]">
                  {[
                    { key: 'improve_overall_flow', label: 'Improve Overall Flow' },
                    { key: 'humanise', label: 'Humanise Entire Piece' },
                    { key: 'shorten_document', label: 'Shorten Document' },
                    { key: 'expand_document', label: 'Expand Document' },
                    { key: 'editorial_polish', label: 'Editorial Polish' },
                    { key: 'check_consistency', label: 'Check Consistency' },
                    { key: 'generate_alternative_draft', label: 'Generate Alternative Draft' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      onClick={() => handleActionClick(act.key)}
                      className="text-left p-2 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#2b101c] text-[#35101F] dark:text-[#F6F0E7] font-medium transition-colors cursor-pointer border border-transparent hover:border-[#CBBEAC]/50"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
