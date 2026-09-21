import React, { useState } from 'react';
import {
  PaginatedPage,
} from '../../../types/bookLayoutTypes';
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
} from 'lucide-react';

interface BookPageStructureNavProps {
  pages: PaginatedPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
}

export const BookPageStructureNav: React.FC<BookPageStructureNavProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'pages'>('hierarchy');
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');

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

  // Distinct chapters in main matter
  const chaptersMap: { [key: string]: { title: string; number: number; startPageIndex: number } } = {};
  pages.forEach((p) => {
    if (p.chapterTitle && !chaptersMap[p.chapterTitle]) {
      chaptersMap[p.chapterTitle] = {
        title: p.chapterTitle,
        number: p.chapterNumber || 1,
        startPageIndex: p.pageIndex,
      };
    }
  });

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-[#CBBEAC]/70 dark:border-slate-800 bg-[#FAF8F2] dark:bg-slate-900 flex flex-col items-center py-4 space-y-4 shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center hover:bg-[#35101F] transition-colors shadow-2xs"
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
          className="p-1 rounded text-[#71685E] hover:text-[#5A1832] dark:hover:text-white"
          title="Collapse structure panel"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Tabs: Hierarchy vs Pages list */}
      <div className="px-3 pt-2 pb-1 border-b border-[#CBBEAC]/40 dark:border-slate-800 flex items-center space-x-1">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-all ${
            activeTab === 'hierarchy'
              ? 'bg-[#5A1832] text-[#F6F0E7] shadow-2xs'
              : 'text-[#71685E] dark:text-slate-400 hover:text-[#292521]'
          }`}
        >
          Sections Tree
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-all ${
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
            className="px-2 py-1 rounded bg-[#5A1832] text-[#F6F0E7] font-semibold text-[11px] hover:bg-[#35101F]"
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
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
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

            {/* MAIN CHAPTERS */}
            <div className="space-y-1">
              <div className="px-2 py-1 font-mono uppercase font-bold text-[10px] text-[#9A7438] dark:text-[#C29A52] flex items-center justify-between">
                <span>Coursebook Chapters</span>
                <span>{Object.keys(chaptersMap).length} ch</span>
              </div>
              <div className="space-y-1">
                {Object.values(chaptersMap).map((chap) => {
                  const isChapActive =
                    pages[activePageIndex]?.chapterTitle === chap.title;
                  return (
                    <button
                      key={chap.title}
                      onClick={() => onSelectPage(chap.startPageIndex)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-all ${
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
                })}
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
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
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between h-24 transition-all ${
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
