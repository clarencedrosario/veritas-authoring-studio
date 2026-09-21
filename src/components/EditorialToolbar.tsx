import React from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Quote,
  SeparatorHorizontal,
  MessageSquarePlus,
  Undo2,
  Redo2,
} from 'lucide-react';

interface EditorialToolbarProps {
  onFormat: (action: 'bold' | 'italic' | 'heading' | 'quote' | 'break') => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenComment: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedText?: string;
  isDarkMode: boolean;
}

export const EditorialToolbar: React.FC<EditorialToolbarProps> = ({
  onFormat,
  onUndo,
  onRedo,
  onOpenComment,
  canUndo,
  canRedo,
  selectedText,
  isDarkMode,
}) => {
  return (
    <div
      id="editorial-minimal-toolbar"
      role="toolbar"
      aria-label="Manuscript Formatting Controls"
      className="max-w-[740px] w-full mx-auto mb-4 py-1.5 px-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7]/95 dark:bg-[#2b1622]/95 backdrop-blur-xs shadow-xs flex items-center justify-between text-xs select-none transition-all"
    >
      {/* Formatting tools */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <button
          type="button"
          onClick={() => onFormat('bold')}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Bold (Ctrl/Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('italic')}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Italic (Ctrl/Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-[#CBBEAC] dark:bg-[#4f2c3d] mx-1" />

        <button
          type="button"
          onClick={() => onFormat('heading')}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Scene Heading"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('quote')}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Blockquote / Internal Monologue"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onFormat('break')}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Scene Break (* * *)"
        >
          <SeparatorHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Editorial Actions: Comment & History */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <button
          type="button"
          onClick={onOpenComment}
          className={`min-h-[36px] flex items-center space-x-1.5 px-3 py-1 rounded-lg text-[12px] font-medium transition-colors ${
            selectedText
              ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F]'
              : 'hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7]'
          }`}
          title="Add editorial comment"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:inline">Note</span>
        </button>

        <span className="w-px h-4 bg-[#CBBEAC] dark:bg-[#4f2c3d] mx-1" />

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] disabled:opacity-30 text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] disabled:opacity-30 text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] transition-colors"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
