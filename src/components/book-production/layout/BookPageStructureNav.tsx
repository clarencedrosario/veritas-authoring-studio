import React, { useState } from 'react';
import { PaginatedPage } from '../../../types/bookLayoutTypes';
import { GrammarTopic } from '../../../types';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Layers,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Hash,
  Search,
  GripVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { insertChapterAt, reorderChaptersList } from './chapterReorderUtils';

interface BookPageStructureNavProps {
  pages: PaginatedPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  topics?: GrammarTopic[];
  onReorderChapters?: (newTopics: GrammarTopic[]) => void;
  onOpenReorderModal?: () => void;
}

export const BookPageStructureNav: React.FC<BookPageStructureNavProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  topics = [],
  onReorderChapters,
  onOpenReorderModal,
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'pages'>('hierarchy');
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [draggedTopicId, setDraggedTopicId] = useState<string | null>(null);
  const [dragOverTopicId, setDragOverTopicId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('after');

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(jumpPageInput.trim(), 10);
    if (!isNaN(targetNum)) {
      // Find page with this display or numeric number
      const foundIdx = pages.findIndex(
        (p) => p.numericPageNumber === targetNum || p.displayPageNumber === String(targetNum)
      );
      if (foundIdx !== -1) {
        onSelectPage(foundIdx);
        setJumpPageInput('');
      }
    }
  };

  // Group pages by section
  const frontMatterPages = pages.filter((p) => p.masterPageId === 'front_matter');
  const mainMatterPages = pages.filter(
    (p) =>
      p.masterPageId !== 'front_matter' &&
      p.masterPageId !== 'back_matter' &&
      p.pageType !== 'half_title' &&
      p.pageType !== 'title_page' &&
      p.pageType !== 'imprint_page'
  );
  const backMatterPages = pages.filter((p) => p.masterPageId === 'back_matter');

  // Fallback distinct chapters from pages if topics prop is empty
  const fallbackChaptersMap: { [key: string]: { title: string; number: number; startPageIndex: number } } = {};
  pages.forEach((p) => {
    if (p.chapterTitle && !fallbackChaptersMap[p.chapterTitle]) {
      fallbackChaptersMap[p.chapterTitle] = {
        title: p.chapterTitle,
        number: p.chapterNumber || 1,
        startPageIndex: p.pageIndex,
      };
    }
  });

  // Drag and Drop handlers for chapters in the sidebar
  const handleDragStart = (e: React.DragEvent, topicId: string) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', topicId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTopicId(topicId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    if (draggedTopicId === targetId) {
      setDragOverTopicId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'before' : 'after';

    setDragOverTopicId(targetId);
    setDropPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverTopicId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedTopicId || draggedTopicId === targetId || !onReorderChapters) {
      setDraggedTopicId(null);
      setDragOverTopicId(null);
      return;
    }

    const reordered = insertChapterAt(topics, draggedTopicId, targetId, dropPosition);
    onReorderChapters(reordered);

    setDraggedTopicId(null);
    setDragOverTopicId(null);
  };

  const handleDragEnd = () => {
    setDraggedTopicId(null);
    setDragOverTopicId(null);
  };

  const handleMoveChapter = (e: React.MouseEvent, index: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    if (!onReorderChapters) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;
    const reordered = reorderChaptersList(topics, index, targetIndex);
    onReorderChapters(reordered);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-[#CBBEAC]/70 dark:border-slate-800 bg-[#FAF8F2] dark:bg-slate-900 flex flex-col items-center py-4 space-y-4 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center hover:bg-[#35101F] transition-colors shadow-2xs cursor-pointer"
          title="Expand Book Structure Tree"
        >
          <Layers className="w-4 h-4" />
        </button>
        <div className="writing-mode-vertical text-[11px] font-mono uppercase tracking-widest text-[#71685E] dark:text-slate-400 rotate-180">
          Book Structure
        </div>
      </div>
    );
  }

  const hasAuthoritativeTopics = topics && topics.length > 0;

  return (
    <div
      id="book-production-structure-nav"
      className="w-64 xl:w-72 border-r border-[#CBBEAC]/80 dark:border-slate-800 bg-[#FAF8F2] dark:bg-slate-900/90 flex flex-col shrink-0 select-none text-xs"
    >
      {/* Header with collapse and mode toggles */}
      <div className="p-3 border-b border-[#CBBEAC]/60 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
          <span className="font-serif font-bold text-[#292521] dark:text-slate-100 text-sm">
            Book Structure
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded text-[#71685E] hover:text-[#5A1832] dark:hover:text-white cursor-pointer"
          title="Collapse structure panel"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Tabs: Hierarchy vs Pages list */}
      <div className="px-3 pt-2 pb-1 border-b border-[#CBBEAC]/40 dark:border-slate-800 flex items-center space-x-1">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] dark:text-slate-400 hover:text-[#292521]'
          }`}
        >
          Sections Tree
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-all cursor-pointer ${
            activeTab === 'pages'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] dark:text-slate-400 hover:text-[#292521]'
          }`}
        >
          Pages ({pages.length})
        </button>
      </div>

      {/* Quick Jump Bar */}
      <div className="p-2 border-b border-[#CBBEAC]/40 dark:border-slate-800">
        <form onSubmit={handleJumpSubmit} className="flex items-center space-x-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Go to page #..."
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              className="w-full pl-6 pr-2 py-1 bg-white dark:bg-slate-800 border border-[#CBBEAC]/70 dark:border-slate-700 rounded-md text-xs text-[#292521] dark:text-slate-200 outline-none"
            />
            <Hash className="w-3 h-3 text-[#71685E] absolute left-1.5 top-2" />
          </div>
          <button
            type="submit"
            className="px-2 py-1 rounded bg-[#5A1832] text-[#F6F0E7] font-semibold text-[11px] hover:bg-[#35101F] cursor-pointer"
          >
            Go
          </button>
        </form>
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {activeTab === 'hierarchy' ? (
          <>
            {/* FRONT MATTER */}
            <div className="space-y-1">
              <div className="px-2 py-1 font-mono uppercase font-bold text-[10px] text-[#9A7438] dark:text-[#C29A52] flex items-center justify-between">
                <span>Front Matter</span>
                <span>{frontMatterPages.length} pp</span>
              </div>
              <div className="space-y-0.5">
                {frontMatterPages.map((p) => {
                  const isActive = activePageIndex === p.pageIndex;
                  const label =
                    p.pageType === 'half_title'
                      ? 'Half Title'
                      : p.pageType === 'title_page'
                      ? 'Full Title Page'
                      : p.pageType === 'imprint_page'
                      ? 'Copyright & Imprint'
                      : p.pageType === 'toc'
                      ? 'Table of Contents'
                      : p.pageType === 'curriculum_matrix'
                      ? 'Curriculum Matrix'
                      : 'Preface & Notes';
                  return (
                    <button
                      key={p.pageIndex}
                      onClick={() => onSelectPage(p.pageIndex)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#5A1832] text-[#F6F0E7] font-medium shadow-2xs'
                          : 'text-[#292521] dark:text-slate-300 hover:bg-[#EDE4D6]/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{label}</span>
                      <span className="font-mono text-[10px] opacity-75">
                        {p.displayPageNumber || `p.${p.pageIndex + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN CHAPTERS WITH DRAG-AND-DROP */}
            <div className="space-y-1">
              <div className="px-2 py-1 font-mono uppercase font-bold text-[10px] text-[#9A7438] dark:text-[#C29A52] flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span>Coursebook Chapters</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#EDE4D6] dark:bg-slate-800 text-[#5A1832] dark:text-[#C29A52]">
                    {hasAuthoritativeTopics ? topics.length : Object.keys(fallbackChaptersMap).length}
                  </span>
                </div>
                {onOpenReorderModal && (
                  <button
                    onClick={onOpenReorderModal}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#5A1832]/10 hover:bg-[#5A1832]/20 text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Open Full Drag & Drop Reorder Studio"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Reorder</span>
                  </button>
                )}
              </div>

              {/* Drag instruction notice */}
              {onReorderChapters && hasAuthoritativeTopics && (
                <div className="px-2 pb-1 text-[10px] text-[#71685E] dark:text-slate-400 flex items-center space-x-1">
                  <GripVertical className="w-3 h-3 text-[#9A7438]" />
                  <span>Drag handle to reorder chapters</span>
                </div>
              )}

              <div className="space-y-1">
                {hasAuthoritativeTopics ? (
                  topics.map((topic, cIdx) => {
                    const startPage = pages.find((p) => p.chapterTitle === topic.title);
                    const startPageIndex = startPage ? startPage.pageIndex : 0;
                    const isChapActive = pages[activePageIndex]?.chapterTitle === topic.title;
                    const isDragged = draggedTopicId === topic.id;
                    const isDragOver = dragOverTopicId === topic.id;

                    return (
                      <div key={topic.id} className="relative group">
                        {/* Insertion indicator before */}
                        {isDragOver && dropPosition === 'before' && (
                          <div className="h-0.5 bg-[#5A1832] dark:bg-[#C29A52] rounded-full mx-1 my-0.5 shadow-xs animate-pulse" />
                        )}

                        <div
                          draggable={!!onReorderChapters}
                          onDragStart={(e) => handleDragStart(e, topic.id)}
                          onDragOver={(e) => handleDragOver(e, topic.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, topic.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onSelectPage(startPageIndex)}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                            isDragged
                              ? 'opacity-40 border border-dashed border-[#5A1832] bg-[#EDE4D6]/60 dark:bg-slate-800/60 scale-[0.98]'
                              : isChapActive
                              ? 'bg-[#5A1832] text-[#F6F0E7] font-medium shadow-2xs'
                              : 'text-[#292521] dark:text-slate-300 hover:bg-[#EDE4D6]/70 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 min-w-0 pr-1 flex-1">
                            {/* Drag handle */}
                            {onReorderChapters && (
                              <div
                                className="cursor-grab active:cursor-grabbing p-0.5 text-[#71685E] group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] transition-colors"
                                title="Drag to reorder"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>
                            )}

                            {/* Chapter number badge */}
                            <span
                              className={`font-mono font-bold text-[10px] px-1 py-0.5 rounded shrink-0 ${
                                isChapActive
                                  ? 'bg-black/20 text-[#F6F0E7]'
                                  : 'bg-[#EDE4D6] dark:bg-slate-800 text-[#5A1832] dark:text-[#C29A52]'
                              }`}
                            >
                              Ch {cIdx + 1}
                            </span>

                            {/* Chapter Title */}
                            <span className="truncate font-serif flex-1">{topic.title}</span>
                          </div>

                          {/* Right: Page number and quick move buttons on hover */}
                          <div className="flex items-center space-x-1 shrink-0">
                            {onReorderChapters && (
                              <div className="hidden group-hover:flex items-center space-x-0.5">
                                <button
                                  onClick={(e) => handleMoveChapter(e, cIdx, 'up')}
                                  disabled={cIdx === 0}
                                  className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handleMoveChapter(e, cIdx, 'down')}
                                  disabled={cIdx === topics.length - 1}
                                  className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <span className="font-mono text-[10px] opacity-75 shrink-0 pl-1">
                              p.{startPage?.displayPageNumber || (startPage ? startPage.pageIndex + 1 : '-')}
                            </span>
                          </div>
                        </div>

                        {/* Insertion indicator after */}
                        {isDragOver && dropPosition === 'after' && (
                          <div className="h-0.5 bg-[#5A1832] dark:bg-[#C29A52] rounded-full mx-1 my-0.5 shadow-xs animate-pulse" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Fallback if topics not loaded yet
                  Object.values(fallbackChaptersMap).map((chap) => {
                    const isChapActive = pages[activePageIndex]?.chapterTitle === chap.title;
                    return (
                      <button
                        key={chap.title}
                        onClick={() => onSelectPage(chap.startPageIndex)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isChapActive
                            ? 'bg-[#5A1832] text-[#F6F0E7] font-medium shadow-2xs'
                            : 'text-[#292521] dark:text-slate-300 hover:bg-[#EDE4D6]/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0 pr-1">
                          <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-slate-800 text-[#5A1832] dark:text-[#C29A52]">
                            Ch {chap.number}
                          </span>
                          <span className="truncate font-serif">{chap.title}</span>
                        </div>
                        <span className="font-mono text-[10px] opacity-75 shrink-0">
                          p.{pages[chap.startPageIndex]?.displayPageNumber || chap.startPageIndex + 1}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* BACK MATTER */}
            {backMatterPages.length > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 font-mono uppercase font-bold text-[10px] text-[#9A7438] dark:text-[#C29A52] flex items-center justify-between">
                  <span>Back Matter</span>
                  <span>{backMatterPages.length} pp</span>
                </div>
                <div className="space-y-0.5">
                  {backMatterPages.map((p) => {
                    const isActive = activePageIndex === p.pageIndex;
                    const label =
                      p.pageType === 'glossary'
                        ? 'Glossary of Terms'
                        : p.pageType === 'index'
                        ? 'Subject Index'
                        : p.pageType === 'answer_key'
                        ? 'Answer Keys'
                        : 'Colophon';
                    return (
                      <button
                        key={p.pageIndex}
                        onClick={() => onSelectPage(p.pageIndex)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#5A1832] text-[#F6F0E7] font-medium shadow-2xs'
                            : 'text-[#292521] dark:text-slate-300 hover:bg-[#EDE4D6]/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        <span className="font-mono text-[10px] opacity-75">
                          p.{p.displayPageNumber}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* THUMBNAIL / SHEET LIST */
          <div className="grid grid-cols-2 gap-2">
            {pages.map((p) => {
              const isActive = activePageIndex === p.pageIndex;
              return (
                <button
                  key={p.pageIndex}
                  onClick={() => onSelectPage(p.pageIndex)}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#5A1832] bg-[#5A1832]/10 ring-2 ring-[#5A1832]'
                      : 'border-[#CBBEAC]/70 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-[#5A1832]/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-mono">
                    <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">
                      {p.displayPageNumber ? `p.${p.displayPageNumber}` : `[${p.pageIndex + 1}]`}
                    </span>
                    <span className="text-[#71685E] dark:text-slate-400">
                      {p.isVerso ? 'Verso' : 'Recto'}
                    </span>
                  </div>

                  <div className="my-auto text-[10px] font-serif text-[#292521] dark:text-slate-200 line-clamp-2">
                    {p.chapterTitle || p.pageType.replace('_', ' ')}
                  </div>

                  <div className="w-full flex items-center justify-between text-[9px] text-[#71685E]">
                    <span className="capitalize">{p.masterPageId.replace('_', ' ')}</span>
                    {p.hasOverset && (
                      <span className="text-rose-600 font-bold">Overset</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-2.5 border-t border-[#CBBEAC]/60 dark:border-slate-800 bg-[#EDE4D6]/50 dark:bg-slate-950 flex items-center justify-between text-[11px] font-mono text-[#71685E] dark:text-slate-400">
        <span>Active Sheet: {activePageIndex + 1} / {pages.length}</span>
        <span className="text-[#5A1832] dark:text-[#C29A52] font-semibold">
          {pages[activePageIndex]?.isVerso ? 'Left (Verso)' : 'Right (Recto)'}
        </span>
      </div>
    </div>
  );
};
