import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Edit2,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { StudioChapter, ChapterSection } from '../../types';
import { SUGGESTED_GRAMMAR_SECTIONS } from './SimpleWritingModeView';

export interface SimpleStructureOutlineProps {
  chapter: StudioChapter;
  chapters?: Array<{ id: string; order: number; title: string; category?: string }>;
  activeTopicId?: string;
  onSelectChapter?: (topicId: string) => void;
  onAddChapter?: () => void;
  onDuplicateChapter?: (topicId: string) => void;
  onDeleteChapter?: (topicId: string) => void;
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  onAddSection: (suggestedTitle?: string) => void;
  onRenameSection?: (sectionId: string, newTitle: string) => void;
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDuplicateSection?: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleCollapse?: () => void;
  isDarkMode?: boolean;
}

export const SimpleStructureOutline: React.FC<SimpleStructureOutlineProps> = ({
  chapter,
  chapters = [],
  activeTopicId,
  onSelectChapter,
  onAddChapter,
  onDuplicateChapter,
  onDeleteChapter,
  activeSectionId,
  onSelectSection,
  onAddSection,
  onRenameSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleCollapse,
}) => {
  const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sections = chapter.sections || [];

  const handleStartRename = (sec: ChapterSection, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSectionId(sec.id);
    setEditingTitleText(sec.title);
  };

  const handleSaveRename = (secId: string) => {
    if (editingTitleText.trim() && onRenameSection) {
      onRenameSection(secId, editingTitleText.trim());
    }
    setEditingSectionId(null);
  };

  return (
    <div className="h-full w-full flex flex-col min-h-0 min-w-0 border-r border-[#CBBEAC] bg-[#EDE4D6] text-[#292521] text-xs overflow-hidden select-none">
      {/* Outline Header: Active Chapter & Switcher */}
      <div className="p-3 border-b border-[#CBBEAC] space-y-2 bg-[#EDE4D6] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-1 rounded bg-[#5A1832] text-[#F6F0E7]">
              <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
            </div>
            <span className="font-bold text-xs text-[#35101F] uppercase font-mono tracking-wider truncate">
              Chapter Outline
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {onAddChapter && (
              <button
                type="button"
                onClick={onAddChapter}
                className="p-1 rounded hover:bg-black/5 text-[#5A1832] hover:text-[#35101F] transition-colors cursor-pointer"
                title="Add New Chapter (Unlimited chapters across Classes 1–12)"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#292521] cursor-pointer"
                title="Collapse outline"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chapter Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsChapterDropdownOpen((prev) => !prev)}
            className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] hover:bg-[#F6F0E7] text-left flex items-center justify-between text-xs cursor-pointer shadow-2xs"
          >
            <div className="min-w-0 pr-2">
              <div className="text-[10px] text-[#71685E] uppercase font-mono">
                {chapter.equivalentClass} • Chapter {chapter.chapterNumber}
              </div>
              <div className="font-bold text-xs text-[#35101F] truncate">
                {chapter.title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#71685E] shrink-0" />
          </button>

          {isChapterDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-xl py-1 z-50 max-h-64 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-[#71685E] uppercase font-mono border-b border-[#CBBEAC]/50 flex items-center justify-between">
                <span>Book Chapters ({chapters.length})</span>
                {onAddChapter && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsChapterDropdownOpen(false);
                      onAddChapter();
                    }}
                    className="text-[#5A1832] hover:underline cursor-pointer"
                  >
                    + New Chapter
                  </button>
                )}
              </div>

              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`px-3 py-2 flex items-center justify-between hover:bg-[#F6F0E7] cursor-pointer ${
                    ch.id === activeTopicId || ch.id === chapter.id
                      ? 'bg-[#F6F0E7] text-[#5A1832] font-bold'
                      : 'text-[#292521]'
                  }`}
                  onClick={() => {
                    setIsChapterDropdownOpen(false);
                    if (onSelectChapter) onSelectChapter(ch.id);
                  }}
                >
                  <span className="truncate pr-2">
                    {ch.order || idx + 1}. {ch.title}
                  </span>
                  {ch.id === chapter.id && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-mono">
                      Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#71685E] font-mono flex items-center justify-between">
          <span>Sections ({sections.length})</span>
          <span className="text-[9px] text-[#71685E]">Drag / Reorder</span>
        </div>

        {sections.map((sec, idx) => {
          const isActive = sec.id === activeSectionId;
          const isEditing = editingSectionId === sec.id;

          return (
            <div
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer group flex items-center justify-between ${
                isActive
                  ? 'bg-[#FFFDF8] text-[#5A1832] shadow-xs border border-[#C29A52]/60 font-semibold'
                  : 'hover:bg-[#FFFDF8]/60 text-[#292521] border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span className="text-[10px] font-mono font-bold text-[#C29A52] w-4 text-center shrink-0">
                  {idx + 1}
                </span>

                {isEditing ? (
                  <input
                    type="text"
                    value={editingTitleText}
                    autoFocus
                    onChange={(e) => setEditingTitleText(e.target.value)}
                    onBlur={() => handleSaveRename(sec.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(sec.id);
                      if (e.key === 'Escape') setEditingSectionId(null);
                    }}
                    className="w-full px-1.5 py-0.5 text-xs font-semibold rounded border border-[#C29A52] bg-white text-[#292521]"
                  />
                ) : (
                  <span className="text-xs truncate flex-1">{sec.title}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMoveSection) onMoveSection(sec.id, 'up');
                  }}
                  disabled={idx === 0}
                  className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#292521] cursor-pointer disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMoveSection) onMoveSection(sec.id, 'down');
                  }}
                  disabled={idx === sections.length - 1}
                  className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#292521] cursor-pointer disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleStartRename(sec, e)}
                  className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#292521] cursor-pointer"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDuplicateSection) onDuplicateSection(sec.id);
                  }}
                  className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#292521] cursor-pointer"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(sec.id);
                  }}
                  className="p-1 rounded hover:bg-rose-100 text-[#71685E] hover:text-rose-600 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section Footer Button */}
      <div className="p-3 border-t border-[#CBBEAC] bg-[#EDE4D6] shrink-0 relative">
        <button
          type="button"
          onClick={() => setShowAddMenu((prev) => !prev)}
          className="w-full py-2 px-3 rounded-xl border border-dashed border-[#CBBEAC] hover:border-[#C29A52] bg-[#FFFDF8] hover:bg-[#F6F0E7] text-xs font-bold text-[#5A1832] transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
          <span>+ Add Section</span>
          <ChevronDown className="w-3 h-3 opacity-60 ml-auto" />
        </button>

        {showAddMenu && (
          <div className="absolute left-3 right-3 bottom-full mb-1 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-xl py-1 z-50 max-h-60 overflow-y-auto text-xs text-[#292521]">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#71685E] font-mono border-b border-[#CBBEAC]/50">
              Suggested Grammar Sections
            </div>
            {SUGGESTED_GRAMMAR_SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setShowAddMenu(false);
                  onAddSection(item.title);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F6F0E7] flex items-center space-x-2 cursor-pointer"
              >
                <span className="truncate">{item.title}</span>
              </button>
            ))}
            <div className="border-t border-[#CBBEAC]/40 my-1" />
            <button
              type="button"
              onClick={() => {
                setShowAddMenu(false);
                onAddSection();
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-[#F6F0E7] font-bold text-[#5A1832] flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Blank Section</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
