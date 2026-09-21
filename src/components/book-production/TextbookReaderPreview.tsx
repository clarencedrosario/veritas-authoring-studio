import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarSeriesProject,
  GrammarTopic,
} from '../../types';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  Download,
  GraduationCap,
  Layers,
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface TextbookReaderPreviewProps {
  currentBook: ClassCurriculumBook;
  seriesProject: GrammarSeriesProject;
  onBack: () => void;
  onOpenChapterStudio: (topicId: string) => void;
  isDarkMode: boolean;
}

export const TextbookReaderPreview: React.FC<TextbookReaderPreviewProps> = ({
  currentBook,
  seriesProject,
  onBack,
  onOpenChapterStudio,
}) => {
  const units = currentBook.units || [];
  const topics = currentBook.topics || [];
  const frontMatter = (currentBook.frontMatter || []).filter((f) => f.isEnabled);
  const backMatter = (currentBook.backMatter || []).filter((b) => b.isEnabled);

  const [activeItem, setActiveItem] = useState<{
    type: 'front_matter' | 'chapter' | 'back_matter';
    id: string;
  }>({
    type: frontMatter[0] ? 'front_matter' : 'chapter',
    id: frontMatter[0]?.id || topics[0]?.id || '',
  });

  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

  // Selected topic if chapter
  const selectedTopic = topics.find((t) => t.id === activeItem.id);
  const selectedFront = frontMatter.find((f) => f.id === activeItem.id);
  const selectedBack = backMatter.find((b) => b.id === activeItem.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="p-4 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E] hover:text-[#292521] dark:text-[#D8CCBC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
              Complete Textbook Typeset Reader
            </div>
            <h2 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              {currentBook.title} &bull; {currentBook.classLevel}
            </h2>
          </div>
        </div>

        {/* Edition Mode Switch & Print */}
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-xl bg-white dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] flex items-center text-xs">
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'student'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC]'
              }`}
            >
              Student Edition
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
                viewMode === 'teacher'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                  : 'text-[#71685E] dark:text-[#D8CCBC]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Teacher&apos;s Wraparound</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#251D1E] hover:bg-[#FDFBF7] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#9A7438]" />
            <span>Print Book</span>
          </button>
        </div>
      </div>

      {/* Main Two-Pane Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] p-4 space-y-4 max-h-[80vh] overflow-y-auto print:hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold border-b border-[#CBBEAC]/50 pb-1">
            Book Navigator
          </div>

          {/* Front Matter Pages */}
          {frontMatter.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-[#71685E] uppercase">Front Matter</div>
              {frontMatter.map((fm) => (
                <div
                  key={fm.id}
                  onClick={() => setActiveItem({ type: 'front_matter', id: fm.id })}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    activeItem.id === fm.id
                      ? 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-bold'
                      : 'text-[#71685E] hover:text-[#292521]'
                  }`}
                >
                  {fm.title}
                </div>
              ))}
            </div>
          )}

          {/* Units & Chapters */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[#71685E] uppercase">Units &amp; Chapters</div>
            {units.map((unit) => {
              const unitTopics = unit.chapterIds
                .map((id) => topics.find((t) => t.id === id))
                .filter(Boolean) as GrammarTopic[];

              return (
                <div key={unit.id} className="space-y-1">
                  <div className="text-[11px] font-serif font-bold text-[#5A1832] dark:text-[#C29A52] px-2 py-0.5 bg-[#FDFBF7] dark:bg-[#251D1E] rounded">
                    {unit.title}
                  </div>
                  <div className="pl-2 space-y-0.5">
                    {unitTopics.map((topic, cIdx) => (
                      <div
                        key={topic.id}
                        onClick={() => setActiveItem({ type: 'chapter', id: topic.id })}
                        className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer truncate transition-colors ${
                          activeItem.id === topic.id
                            ? 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-bold'
                            : 'text-[#71685E] hover:text-[#292521]'
                        }`}
                      >
                        {cIdx + 1}. {topic.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back Matter Pages */}
          {backMatter.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#CBBEAC]/50">
              <div className="text-[10px] font-mono text-[#71685E] uppercase">Back Matter</div>
              {backMatter.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => setActiveItem({ type: 'back_matter', id: bm.id })}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    activeItem.id === bm.id
                      ? 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-bold'
                      : 'text-[#71685E] hover:text-[#292521]'
                  }`}
                >
                  {bm.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Reader Canvas */}
        <div className="lg:col-span-3">
          <div className="p-8 sm:p-14 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-sm font-serif min-h-[80vh] space-y-8">
            {/* Header Plate */}
            <div className="border-b border-[#CBBEAC]/80 dark:border-[#5A1832]/80 pb-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
              <span>{seriesProject.seriesTitle} &bull; {currentBook.classLevel}</span>
              <span>{seriesProject.targetBoard} Curriculum</span>
            </div>

            {/* Front Matter View */}
            {activeItem.type === 'front_matter' && selectedFront && (
              <div className="space-y-6 max-w-2xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center text-[#292521] dark:text-[#F6F0E7]">
                  {selectedFront.title}
                </h1>
                <div className="w-12 h-0.5 bg-[#9A7438] mx-auto" />
                <div className="text-sm leading-relaxed text-[#292521] dark:text-[#F6F0E7] space-y-4">
                  {selectedFront.content ? (
                    <p>{selectedFront.content}</p>
                  ) : (
                    <div className="space-y-4 text-center">
                      <p className="text-lg font-semibold">{currentBook.title}</p>
                      <p className="text-xs text-[#71685E]">
                        Authoritative Standard Edition for {currentBook.classLevel}
                      </p>
                      <p className="text-xs text-[#71685E]">
                        Published by Veritas Academic Publishing House
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chapter View */}
            {activeItem.type === 'chapter' && selectedTopic && (
              <div className="space-y-8">
                {/* Chapter Title Block */}
                <div className="space-y-2 border-b border-[#CBBEAC]/60 pb-6">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#9A7438] dark:text-[#C29A52] font-semibold">
                    {selectedTopic.category}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-[#292521] dark:text-[#F6F0E7]">
                    {selectedTopic.title}
                  </h1>
                  {selectedTopic.overview && (
                    <p className="text-sm italic text-[#71685E] dark:text-[#D8CCBC] max-w-2xl leading-relaxed">
                      {selectedTopic.overview}
                    </p>
                  )}
                </div>

                {/* Teacher Callout in Teacher Mode */}
                {viewMode === 'teacher' && selectedTopic.studioChapter?.teacherNotes && (
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 font-mono uppercase tracking-wider text-[#9A7438] font-bold">
                      <GraduationCap className="w-4 h-4" />
                      <span>Teacher&apos;s Wraparound Guidance</span>
                    </div>
                    {typeof selectedTopic.studioChapter.teacherNotes === 'string' ? (
                      <div className="text-[#292521] dark:text-[#F6F0E7]">
                        {selectedTopic.studioChapter.teacherNotes}
                      </div>
                    ) : (
                      <>
                        {selectedTopic.studioChapter.teacherNotes.pedagogicalNotes && (
                          <div className="text-[#292521] dark:text-[#F6F0E7]">
                            <strong>Pedagogical Method: </strong>
                            {selectedTopic.studioChapter.teacherNotes.pedagogicalNotes}
                          </div>
                        )}
                        {selectedTopic.studioChapter.teacherNotes.misconceptions && selectedTopic.studioChapter.teacherNotes.misconceptions.length > 0 && (
                          <div className="text-rose-800 dark:text-rose-300">
                            <strong>Common Traps to Expose: </strong>
                            {selectedTopic.studioChapter.teacherNotes.misconceptions.map((m) => m.misconception).join('; ')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Learning Objectives Box */}
                {selectedTopic.learningObjectives && selectedTopic.learningObjectives.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#EDE4D6]/50 dark:bg-[#35101F]/40 border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-2 text-xs">
                    <div className="font-mono uppercase tracking-wider text-[10px] text-[#9A7438] font-bold">
                      Learning Objectives
                    </div>
                    <ul className="space-y-1 list-disc pl-4 text-[#292521] dark:text-[#F6F0E7]">
                      {selectedTopic.learningObjectives.map((obj, oIdx) => (
                        <li key={oIdx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Definitions & Formal Grammar Rules */}
                {selectedTopic.definitions && selectedTopic.definitions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#292521] dark:text-[#F6F0E7] border-b border-[#CBBEAC]/50 pb-1">
                      Syntactic Exposition &amp; Formal Definitions
                    </h3>
                    <div className="space-y-4">
                      {selectedTopic.definitions.map((def) => (
                        <div
                          key={def.id}
                          className="p-5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] space-y-3"
                        >
                          <div className="flex items-baseline space-x-2">
                            <span className="text-base font-bold text-[#5A1832] dark:text-[#C29A52]">
                              {def.term}
                            </span>
                            <span className="text-xs font-mono text-[#71685E]">
                              [{def.partOfSpeechOrCategory}]
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-[#292521] dark:text-[#F6F0E7]">
                            {def.ageAppropriateExplanation}
                          </p>

                          {def.rules && def.rules.length > 0 && (
                            <div className="p-3 rounded-lg bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/60 space-y-1">
                              <span className="text-[10px] font-mono uppercase text-[#9A7438] font-bold">
                                Prescriptive Rule:
                              </span>
                              {def.rules.map((r, rIdx) => (
                                <div key={rIdx} className="text-xs font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {r}
                                </div>
                              ))}
                            </div>
                          )}

                          {def.examples && def.examples.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[10px] font-mono uppercase text-[#71685E] font-bold">
                                Exemplars in Authentic Usage:
                              </span>
                              {def.examples.map((ex, exIdx) => (
                                <div key={exIdx} className="text-xs italic pl-2 border-l-2 border-[#9A7438]">
                                  &ldquo;{ex.sentence}&rdquo;
                                  {ex.note && <span className="text-[11px] text-[#71685E] not-italic ml-2">— {ex.note}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formative Exercises */}
                {selectedTopic.exercises && selectedTopic.exercises.length > 0 && (
                  <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-bold text-[#292521] dark:text-[#F6F0E7] border-b border-[#CBBEAC]/50 pb-1">
                      Practice Drills &amp; Exercises
                    </h3>
                    <div className="space-y-6">
                      {selectedTopic.exercises.map((exercise, eIdx) => (
                        <div key={exercise.id} className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <h4 className="font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                              {exercise.title}
                            </h4>
                            <span className="text-xs font-mono text-[#71685E]">
                              [{exercise.targetType} &bull; {exercise.maxMarks} Marks]
                            </span>
                          </div>
                          <p className="text-xs italic text-[#71685E]">{exercise.instructions}</p>

                          {/* Exercise Questions */}
                          <div className="space-y-2.5 pt-1">
                            {(exercise.questions || []).map((q, qIdx) => (
                              <div
                                key={q.id || qIdx}
                                className="p-3 rounded-lg bg-white dark:bg-[#251D1E] border border-[#CBBEAC]/60 space-y-1.5 text-xs"
                              >
                                <div className="flex items-start space-x-2">
                                  <span className="font-bold font-mono text-[#9A7438]">
                                    {qIdx + 1}.
                                  </span>
                                  <div className="flex-1 text-[#292521] dark:text-[#F6F0E7]">
                                    {q.prompt || q.blanksSentence}
                                  </div>
                                </div>

                                {/* Options if MCQ */}
                                {q.options && q.options.length > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-5 pt-1 text-xs">
                                    {q.options.map((opt, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className="p-1.5 rounded border border-[#CBBEAC]/50 font-mono text-[11px]"
                                      >
                                        ({String.fromCharCode(65 + optIdx)}) {opt}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Teacher Wraparound Answer Display */}
                                {viewMode === 'teacher' && q.correctAnswer && (
                                  <div className="mt-2 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-[11px] font-mono space-y-0.5">
                                    <div className="text-emerald-800 dark:text-emerald-300 font-bold">
                                      Answer: {q.correctAnswer}
                                    </div>
                                    {q.explanation && (
                                      <div className="text-[#71685E] italic">
                                        Rationale: {q.explanation}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Back Matter View */}
            {activeItem.type === 'back_matter' && selectedBack && (
              <div className="space-y-6 max-w-2xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center text-[#292521] dark:text-[#F6F0E7]">
                  {selectedBack.title}
                </h1>
                <div className="w-12 h-0.5 bg-[#9A7438] mx-auto" />
                <div className="text-sm leading-relaxed text-[#292521] dark:text-[#F6F0E7] space-y-4">
                  {selectedBack.content ? (
                    <p>{selectedBack.content}</p>
                  ) : (
                    <div className="p-6 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E] text-center space-y-2">
                      <div className="font-serif font-bold text-sm">
                        Typeset Back Matter Index
                      </div>
                      <p className="text-xs text-[#71685E]">
                        Compiled reference material automatically linked to chapter exercise solutions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
