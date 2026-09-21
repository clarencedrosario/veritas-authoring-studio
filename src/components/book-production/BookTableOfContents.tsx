import React from 'react';
import {
  ClassCurriculumBook,
  GrammarTopic,
  BookUnit,
  GrammarSeriesProject,
} from '../../types';
import { getChapterWordCount } from '../../utils/bookProductionUtils';
import { BookOpen, Layers, ArrowRight, Printer, Download, Eye } from 'lucide-react';

interface BookTableOfContentsProps {
  currentBook: ClassCurriculumBook;
  seriesProject?: GrammarSeriesProject;
  onOpenChapterStudio: (topicId: string) => void;
  onOpenPreview?: () => void;
  onUpdateBook?: (updated: ClassCurriculumBook) => void;
  isDarkMode: boolean;
}

export const BookTableOfContents: React.FC<BookTableOfContentsProps> = ({
  currentBook,
  seriesProject,
  onOpenChapterStudio,
  onOpenPreview,
  onUpdateBook,
}) => {
  const units = currentBook.units || [];
  const topics = currentBook.topics || [];
  const frontMatter = (currentBook.frontMatter || []).filter((fm) => fm.isEnabled);
  const backMatter = (currentBook.backMatter || []).filter((bm) => bm.isEnabled);

  // Dynamic pagination calculation
  let runningPage = 1;

  // Front matter uses Roman numerals
  const toRoman = (num: number): string => {
    const lookup: Record<string, number> = {
      x: 10,
      ix: 9,
      v: 5,
      iv: 4,
      i: 1,
    };
    let roman = '';
    for (const i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
            Typeset Manuscript Architecture
          </div>
          <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Table of Contents
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
            Dynamically synthesized from active Units, Chapter sections, and Front/Back matter.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenPreview}
            className="px-3.5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Open in Book Reader</span>
          </button>
        </div>
      </div>

      {/* Parchment Typeset TOC Canvas */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-sm space-y-8 font-serif">
        {/* Book Title Header */}
        <div className="text-center pb-6 border-b border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#9A7438] dark:text-[#C29A52] font-semibold">
            {currentBook.edition || '1st Edition'} &bull; {currentBook.classLevel}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#292521] dark:text-[#F6F0E7]">
            Contents
          </h1>
          <div className="w-16 h-0.5 bg-[#9A7438] mx-auto mt-2" />
        </div>

        {/* 1. Preliminary / Front Matter Pages */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold border-b border-[#CBBEAC]/40 pb-1">
            Preliminary Matter
          </div>
          <div className="space-y-1.5 text-xs">
            {frontMatter.map((fm, idx) => (
              <div
                key={fm.id}
                className="flex items-baseline justify-between text-[#292521] dark:text-[#F6F0E7]"
              >
                <span className="font-medium italic">{fm.title}</span>
                <span className="flex-1 border-b border-dotted border-[#CBBEAC] dark:border-[#5A1832] mx-2" />
                <span className="font-mono text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                  {toRoman(idx + 1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Main Units & Chapters */}
        <div className="space-y-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold border-b border-[#CBBEAC]/40 pb-1">
            Units &amp; Chapters
          </div>

          {units.map((unit) => {
            const unitTopics = unit.chapterIds
              .map((id) => topics.find((t) => t.id === id))
              .filter(Boolean) as GrammarTopic[];

            if (unitTopics.length === 0 && unit.isArchived) return null;

            return (
              <div key={unit.id} className="space-y-3">
                {/* Unit Header */}
                <div className="bg-[#EDE4D6]/70 dark:bg-[#35101F]/50 px-3.5 py-1.5 rounded-lg border border-[#CBBEAC]/60 dark:border-[#5A1832]/50 flex items-center justify-between">
                  <div className="font-bold text-xs text-[#5A1832] dark:text-[#C29A52] tracking-wide uppercase font-mono">
                    {unit.title}
                  </div>
                  <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC]">
                    Unit {unit.unitNumber}
                  </span>
                </div>

                {/* Chapters in this Unit */}
                <div className="space-y-3 pl-2 sm:pl-4">
                  {unitTopics.length === 0 ? (
                    <div className="text-xs text-[#71685E] italic pl-2">
                      [Unit under development — no chapters assigned]
                    </div>
                  ) : (
                    unitTopics.map((topic, cIdx) => {
                      const chapterPage = runningPage;
                      const wordCount = getChapterWordCount(topic);
                      const estimatedPages = Math.max(2, Math.round(wordCount / 350));
                      runningPage += estimatedPages;

                      const sections = topic.studioChapter?.sections || [];

                      return (
                        <div key={topic.id} className="space-y-1">
                          <div
                            onClick={() => onOpenChapterStudio(topic.id)}
                            className="group flex items-baseline justify-between text-xs cursor-pointer hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-[#9A7438]">
                                Chapter {cIdx + 1}
                              </span>
                              <span className="font-bold text-[#292521] dark:text-[#F6F0E7] group-hover:underline">
                                {topic.title}
                              </span>
                            </div>
                            <span className="flex-1 border-b border-dotted border-[#CBBEAC] dark:border-[#5A1832] mx-2" />
                            <span className="font-mono text-xs font-bold text-[#292521] dark:text-[#F6F0E7]">
                              {chapterPage}
                            </span>
                          </div>

                          {/* Major Subsections if present */}
                          {sections.length > 0 && (
                            <div className="pl-6 space-y-0.5 text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
                              {sections.map((sec, sIdx) => (
                                <div
                                  key={sec.id}
                                  className="flex items-baseline justify-between"
                                >
                                  <span className="italic">{sec.title}</span>
                                  <span className="flex-1 border-b border-dotted border-[#CBBEAC]/50 dark:border-[#5A1832]/40 mx-2" />
                                  <span className="font-mono text-[10px]">
                                    {chapterPage + Math.min(sIdx, estimatedPages - 1)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Back Matter */}
        <div className="space-y-2 pt-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold border-b border-[#CBBEAC]/40 pb-1">
            Reference &amp; Back Matter
          </div>
          <div className="space-y-1.5 text-xs">
            {backMatter.map((bm) => {
              const bmPage = runningPage;
              runningPage += 4;
              return (
                <div
                  key={bm.id}
                  className="flex items-baseline justify-between text-[#292521] dark:text-[#F6F0E7]"
                >
                  <span className="font-medium italic">{bm.title}</span>
                  <span className="flex-1 border-b border-dotted border-[#CBBEAC] dark:border-[#5A1832] mx-2" />
                  <span className="font-mono text-[11px] font-bold text-[#292521] dark:text-[#F6F0E7]">
                    {bmPage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
