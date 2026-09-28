import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Minus,
  Undo2,
  Redo2,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

interface WritingToolbarProps {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  autosaveStatus: 'saved' | 'saving' | 'unsaved';
  onFormatAction: (action: string, value?: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const WritingToolbar: React.FC<WritingToolbarProps> = ({
  wordCount,
  charCount,
  readingTimeMinutes,
  autosaveStatus,
  onFormatAction,
  canUndo = true,
  canRedo = true,
  onUndo,
  onRedo,
}) => {
  const [currentStyle, setCurrentStyle] = useState('paragraph');

  const handleStyleChange = (style: string) => {
    setCurrentStyle(style);
    onFormatAction('style', style);
  };

  // Professional editorial readability metric
  const readabilityStatus = (() => {
    if (wordCount < 20) return 'Standard Readability';
    const avgCharsPerWord = charCount / Math.max(1, wordCount);
    if (avgCharsPerWord > 6.2) return 'Dense & Formal';
    if (avgCharsPerWord > 5.4) return 'Professional Readability';
    return 'Clear & Direct';
  })();

  return (
    <div className="w-full bg-[#F6F0E7] dark:bg-[#200b14] border-b border-[#CBBEAC] dark:border-[#4d1e2e] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
      {/* Left Formatting Group */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {/* Paragraph Style Dropdown */}
        <div className="relative">
          <select
            value={currentStyle}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="h-8 px-2.5 pr-7 rounded-lg bg-[#EDE4D6] dark:bg-[#1a0812] border border-[#CBBEAC] dark:border-[#4d1e2e] text-xs font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] outline-none cursor-pointer appearance-none"
          >
            <option value="paragraph">Paragraph (Body Text)</option>
            <option value="h1">Heading 1 (Main Header)</option>
            <option value="h2">Heading 2 (Section Subhead)</option>
            <option value="h3">Heading 3 (Minor Topic)</option>
            <option value="lead">Lead Paragraph (Standfirst)</option>
            <option value="blockquote">Block Quote / Pull-Quote</option>
            <option value="dateline">Dateline Style (Newsroom)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#71685E] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="h-5 w-px bg-[#CBBEAC] dark:bg-[#4d1e2e] mx-1 hidden sm:block" />

        {/* Text Decoration Controls */}
        <div className="flex items-center space-x-0.5 bg-[#EDE4D6] dark:bg-[#1a0812] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
          <button
            type="button"
            onClick={() => onFormatAction('bold')}
            title="Bold (Ctrl+B)"
            className="w-7 h-7 rounded flex items-center justify-center text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#CBBEAC]/50 dark:hover:bg-[#4d1e2e]/50 transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('italic')}
            title="Italic (Ctrl+I)"
            className="w-7 h-7 rounded flex items-center justify-center text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#CBBEAC]/50 dark:hover:bg-[#4d1e2e]/50 transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('underline')}
            title="Underline (Ctrl+U)"
            className="w-7 h-7 rounded flex items-center justify-center text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#CBBEAC]/50 dark:hover:bg-[#4d1e2e]/50 transition-colors"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('strikethrough')}
            title="Strikethrough"
            className="w-7 h-7 rounded flex items-center justify-center text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#CBBEAC]/50 dark:hover:bg-[#4d1e2e]/50 transition-colors"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignment Controls */}
        <div className="flex items-center space-x-0.5 bg-[#EDE4D6] dark:bg-[#1a0812] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
          <button
            type="button"
            onClick={() => onFormatAction('align', 'left')}
            title="Align Left"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('align', 'center')}
            title="Align Center"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('align', 'right')}
            title="Align Right"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('align', 'justify')}
            title="Justify Text"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center space-x-0.5 bg-[#EDE4D6] dark:bg-[#1a0812] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
          <button
            type="button"
            onClick={() => onFormatAction('bullet_list')}
            title="Bullet List"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('numbered_list')}
            title="Numbered List"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('blockquote')}
            title="Blockquote / Pull Quote"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('link')}
            title="Insert Hyperlink"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('image')}
            title="Insert Image / Caption Box"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <Image className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFormatAction('divider')}
            title="Insert Section Divider"
            className="w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#CBBEAC]/50 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 bg-[#EDE4D6] dark:bg-[#1a0812] p-0.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d1e2e]">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
            className={`w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] transition-colors ${
              canUndo ? 'hover:bg-[#CBBEAC]/50' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
            className={`w-7 h-7 rounded flex items-center justify-center text-[#71685E] dark:text-[#c9b9a6] transition-colors ${
              canRedo ? 'hover:bg-[#CBBEAC]/50' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Metrics & Autosave Bar */}
      <div className="flex items-center space-x-3 text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
        <div className="hidden lg:flex items-center space-x-2 border-r border-[#CBBEAC] dark:border-[#4d1e2e] pr-3">
          <span>{charCount.toLocaleString()} chars</span>
          <span>&bull;</span>
          <span>{readabilityStatus}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#35101F] dark:text-[#F6F0E7]">
            {wordCount.toLocaleString()}
          </span>
          <span>words</span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-[#9A7438]" />
            <span>{readingTimeMinutes}m read</span>
          </span>
        </div>

        {/* Autosave badge */}
        <div className="flex items-center space-x-1 pl-2 border-l border-[#CBBEAC] dark:border-[#4d1e2e]">
          {autosaveStatus === 'saving' ? (
            <span className="flex items-center space-x-1 text-[#9A7438] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7438]" />
              <span>Saving...</span>
            </span>
          ) : autosaveStatus === 'unsaved' ? (
            <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-3 h-3" />
              <span>Unsaved</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
