import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  GraduationCap,
  Award,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Printer,
  Download,
  Share2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  ClassCurriculumBook,
  GrammarTopic,
  GrammarClassLevel,
} from '../../types';
import {
  resolveActiveBookContext,
  getEditionIsolatedBookData,
  switchAcademicContext,
  ALL_INDIAN_CLASSES,
} from '../../utils/activeBookContext';
import { TextbookMarkdown } from '../common/TextbookMarkdown';

interface TextbookPreviewViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject?: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToExporter?: () => void;
  onNavigateToClassTextbook?: (cls: GrammarClassLevel) => void;
}

export const TextbookPreviewView: React.FC<TextbookPreviewViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToExporter,
  onNavigateToClassTextbook,
}) => {
  const allClasses = ALL_INDIAN_CLASSES;

  const resolvedContext = useMemo(() => resolveActiveBookContext(seriesProject), [seriesProject]);
  const activeBook = resolvedContext.activeProject;
  const activeSystemId = resolvedContext.activeSystemId;
  const selectedClass = seriesProject.selectedClass || activeBook.classLevel || 'Class 6';

  const currentBook: ClassCurriculumBook = useMemo(() => {
    return getEditionIsolatedBookData(seriesProject, activeBook);
  }, [seriesProject, activeBook]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    currentBook?.topics[0]?.id || ''
  );

  useEffect(() => {
    if (currentBook?.topics && !currentBook.topics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(currentBook.topics[0]?.id || '');
    }
  }, [currentBook, selectedTopicId]);

  const activeTopic: GrammarTopic | undefined = useMemo(() => {
    return (
      currentBook.topics.find((t) => t.id === selectedTopicId) ||
      currentBook.topics[0]
    );
  }, [currentBook, selectedTopicId]);

  const [readerMode, setReaderMode] = useState<'chapter' | 'spread' | 'toc'>('chapter');
  const [edition, setEdition] = useState<'student' | 'teacher_master'>('student');
  const [fontFamily, setFontFamily] = useState<'garamond' | 'sans' | 'dyslexic'>('garamond');
  const [fontSizePx, setFontSizePx] = useState<number>(16);
  const [paperTheme, setPaperTheme] = useState<'parchment' | 'ivory' | 'charcoal'>('parchment');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const getExerciseItems = (ex: any): Array<{ id: string; itemNumber: number; sentenceOrPrompt: string; expectedAnswer: string }> => {
    if (Array.isArray(ex.items) && ex.items.length > 0) return ex.items;
    if (Array.isArray(ex.questions) && ex.questions.length > 0) {
      return ex.questions.map((q: any, i: number) => ({
        id: q.id || `item-${i}`,
        itemNumber: i + 1,
        sentenceOrPrompt: q.prompt || q.blanksSentence || q.originalSentence || `Question ${i + 1}`,
        expectedAnswer: q.correctAnswer || q.explanation || '',
      }));
    }
    return [];
  };

  const getExerciseType = (ex: any): string => {
    return String(ex.type || ex.targetType || 'practice').replace(/_/g, ' ').toUpperCase();
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectClass = (cls: GrammarClassLevel) => {
    if (onUpdateSeriesProject) {
      const updated = switchAcademicContext(
        seriesProject,
        activeSystemId,
        seriesProject.activeProgrammeId,
        undefined,
        cls
      );
      onUpdateSeriesProject(updated);
    }
    if (onNavigateToClassTextbook) {
      onNavigateToClassTextbook(cls);
    }
    const targetBook = seriesProject.books[cls];
    if (targetBook && targetBook.topics.length > 0) {
      setSelectedTopicId(targetBook.topics[0].id);
    }
  };

  const currentTopicIndex = currentBook.topics.findIndex(
    (t) => t.id === activeTopic?.id
  );

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      setSelectedTopicId(currentBook.topics[currentTopicIndex - 1].id);
    }
  };

  const handleNextTopic = () => {
    if (currentTopicIndex < currentBook.topics.length - 1) {
      setSelectedTopicId(currentBook.topics[currentTopicIndex + 1].id);
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'sans':
        return 'font-sans';
      case 'dyslexic':
        return 'font-mono';
      case 'garamond':
      default:
        return 'font-serif';
    }
  };

  const getPaperBgClass = () => {
    switch (paperTheme) {
      case 'ivory':
        return 'bg-[#FBF8F3] text-[#292521] border-[#CBBEAC]';
      case 'charcoal':
        return 'bg-[#24171E] text-[#F6F0E7] border-[#4d2b3b]';
      case 'parchment':
      default:
        return 'bg-[#F6F0E7] text-[#292521] border-[#CBBEAC]';
    }
  };

  return (
    <div
      id="textbook-preview-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] select-none"
    >
      {/* Top Navigation & Controls Toolbar */}
      <header className="border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10 shadow-xs">
        {/* Left: Class & Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-serif font-bold text-sm shadow-xs">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                {seriesProject.targetBoard} &bull; Textbook Preview
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832]">
                Interactive Reader
              </span>
            </div>
            <h2 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7] truncate max-w-sm">
              {currentBook.title}
            </h2>
          </div>
        </div>

        {/* Center: Class Switcher & Reader Views */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-[#EDE4D6] dark:bg-[#1e0f18] p-1 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b]">
            <span className="text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6] px-2 hidden md:inline">
              Class:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => handleSelectClass(e.target.value as GrammarClassLevel)}
              className="bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4d2b3b] text-[#292521] dark:text-[#F6F0E7] text-xs font-semibold rounded-lg px-2.5 py-1 outline-none cursor-pointer"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Reader Mode Switcher */}
          <div className="flex items-center bg-[#EDE4D6] dark:bg-[#1e0f18] p-1 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b]">
            <button
              onClick={() => setReaderMode('chapter')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                readerMode === 'chapter'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
              }`}
            >
              Chapter Reader
            </button>
            <button
              onClick={() => setReaderMode('spread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                readerMode === 'spread'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
              }`}
            >
              Book Spread
            </button>
            <button
              onClick={() => setReaderMode('toc')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                readerMode === 'toc'
                  ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
              }`}
            >
              Table of Contents
            </button>
          </div>
        </div>

        {/* Right: Edition Toggle & Exporter Gateway */}
        <div className="flex items-center space-x-2">
          {/* Edition Toggle */}
          <div className="flex items-center bg-[#EDE4D6] dark:bg-[#1e0f18] p-1 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b]">
            <button
              onClick={() => setEdition('student')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                edition === 'student'
                  ? 'bg-[#5A1832] text-[#F6F0E7]'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
            >
              Student Edition
            </button>
            <button
              onClick={() => setEdition('teacher_master')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                edition === 'teacher_master'
                  ? 'bg-[#9A7438] text-[#F6F0E7]'
                  : 'text-[#71685E] dark:text-[#c9b9a6]'
              }`}
              title="Includes pedagogical solutions, rubrics, and answer keys"
            >
              Teacher's Master
            </button>
          </div>

          {onNavigateToExporter && (
            <button
              onClick={onNavigateToExporter}
              className="h-9 px-3.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              title="Open print prepress and multi-format exporter"
            >
              <BookMarked className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Layout &amp; Export &rarr;</span>
            </button>
          )}
        </div>
      </header>

      {/* Reader Ergonomics Sub-Bar */}
      <div className="border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 px-6 py-1.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3 text-stone-600 dark:text-[#c9b9a6]">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-stone-700 dark:text-[#F6F0E7]">Typography:</span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-md px-2 py-0.5 text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
            >
              <option value="garamond">Garamond Scholar Serif</option>
              <option value="sans">Academic Sans</option>
              <option value="dyslexic">Dyslexia-Friendly</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-stone-700 dark:text-[#F6F0E7]">Font Size:</span>
            <input
              type="range"
              min="14"
              max="22"
              value={fontSizePx}
              onChange={(e) => setFontSizePx(Number(e.target.value))}
              className="w-20 accent-[#5A1832]"
            />
            <span className="font-mono text-[11px]">{fontSizePx}px</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-stone-700 dark:text-[#F6F0E7]">Paper Tint:</span>
            <select
              value={paperTheme}
              onChange={(e) => setPaperTheme(e.target.value as any)}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-md px-2 py-0.5 text-xs text-[#292521] dark:text-[#F6F0E7] outline-none"
            >
              <option value="parchment">Warm Parchment</option>
              <option value="ivory">Soft Ivory</option>
              <option value="charcoal">Scholar Dark</option>
            </select>
          </div>
        </div>

        {/* Chapter Navigation Controls */}
        {readerMode !== 'toc' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevTopic}
              disabled={currentTopicIndex <= 0}
              className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#1e0f18] hover:bg-[#F6F0E7] disabled:opacity-40 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>
            <span className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
              {currentTopicIndex + 1} of {currentBook.topics.length}
            </span>
            <button
              onClick={handleNextTopic}
              disabled={currentTopicIndex >= currentBook.topics.length - 1}
              className="px-2.5 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#1e0f18] hover:bg-[#F6F0E7] disabled:opacity-40 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Reader Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Table of Contents & Unit Drawer */}
        <aside className="w-64 md:w-72 border-r border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/80 dark:bg-[#2b1622]/80 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b]">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
              Coursebook Syllabus
            </h3>
            <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
              {currentBook.topics.length} Units &bull; {currentBook.boardStandards}
            </p>
          </div>

          <div className="p-2 space-y-1">
            {currentBook.topics.map((topic, index) => {
              const isSelected = topic.id === activeTopic?.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    if (readerMode === 'toc') setReaderMode('chapter');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start space-x-2.5 ${
                    isSelected
                      ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                      : 'hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-mono shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#C29A52] text-[#35101F] font-bold'
                        : 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs truncate">{topic.title}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-[#EDE4D6]' : 'text-[#71685E] dark:text-[#c9b9a6]'
                      }`}
                    >
                      {topic.category} &bull; {topic.exercises.length} Exercises
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Interactive Reading Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
          {readerMode === 'toc' ? (
            /* Table of Contents Overview View */
            <div className={`w-full max-w-4xl p-8 sm:p-12 rounded-2xl border shadow-sm ${getPaperBgClass()} ${getFontFamilyClass()} space-y-8`}>
              <div className="text-center border-b border-[#CBBEAC] pb-6">
                <span className="text-xs font-mono uppercase font-bold text-[#9A7438]">
                  Table of Contents
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-[#5A1832]">
                  {currentBook.title}
                </h1>
                <p className="text-xs text-stone-600 mt-2 max-w-xl mx-auto">
                  {currentBook.description}
                </p>
              </div>

              <div className="space-y-4">
                {currentBook.topics.map((t, idx) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      setReaderMode('chapter');
                    }}
                    className="p-4 rounded-xl border border-[#CBBEAC] hover:border-[#9A7438] bg-white/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold text-xs font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#292521]">{t.title}</h4>
                        <p className="text-xs text-stone-600 line-clamp-1">{t.overview}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-[#9A7438]">
                        Unit {idx + 1} &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : readerMode === 'spread' ? (
            /* Two-Page Facing Spread View */
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Verso (Left Page) */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-md flex flex-col justify-between ${getPaperBgClass()} ${getFontFamilyClass()}`}
                style={{ fontSize: `${fontSizePx}px` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2 text-[11px] font-mono text-[#9A7438]">
                    <span>{seriesProject.seriesTitle}</span>
                    <span>Class {selectedClass}</span>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#9A7438]">
                      Chapter {currentTopicIndex + 1} &bull; {activeTopic?.category}
                    </span>
                    <h2 className="text-xl font-bold text-[#5A1832] mt-1">
                      {activeTopic?.title}
                    </h2>
                  </div>

                  <p className="text-stone-700 leading-relaxed text-sm">
                    {activeTopic?.overview}
                  </p>

                  {activeTopic?.learningObjectives && activeTopic.learningObjectives.length > 0 && (
                    <div className="p-3 rounded-xl bg-white/60 border border-[#CBBEAC] space-y-1.5">
                      <h4 className="text-xs font-bold uppercase text-[#5A1832]">
                        Learning Objectives
                      </h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-stone-700">
                        {activeTopic.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTopic?.definitions && activeTopic.definitions.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase text-[#5A1832] border-b border-[#CBBEAC] pb-1">
                        Core Definitions &amp; Formulas
                      </h4>
                      {activeTopic.definitions.map((def) => (
                        <div key={def.id} className="p-3 rounded-lg bg-white/50 border border-[#CBBEAC]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#5A1832]">{def.term}</span>
                            <span className="text-[10px] font-mono text-[#9A7438]">{def.partOfSpeechOrCategory}</span>
                          </div>
                          <p className="text-xs text-stone-700 mt-1">{def.ageAppropriateExplanation}</p>
                          {def.formulaOrSyntax && (
                            <div className="mt-1 font-mono text-[11px] p-1.5 bg-[#EDE4D6] rounded text-[#5A1832]">
                              {def.formulaOrSyntax}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#CBBEAC] flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>Page {currentTopicIndex * 2 + 1}</span>
                  <span>[Verso - Theory &amp; Formulas]</span>
                </div>
              </div>

              {/* Recto (Right Page) */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border shadow-md flex flex-col justify-between ${getPaperBgClass()} ${getFontFamilyClass()}`}
                style={{ fontSize: `${fontSizePx}px` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2 text-[11px] font-mono text-[#9A7438]">
                    <span>{activeTopic?.title}</span>
                    <span>Practice Exercises</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#5A1832]">
                      Section A: Formative Exercises
                    </h3>

                    {activeTopic?.exercises && activeTopic.exercises.length > 0 ? (
                      activeTopic.exercises.slice(0, 3).map((ex, exIdx) => {
                        const items = getExerciseItems(ex);
                        return (
                          <div key={ex.id} className="p-3 rounded-xl bg-white/60 border border-[#CBBEAC] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#5A1832]">
                                Exercise {exIdx + 1}: {ex.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#9A7438]">
                                {getExerciseType(ex)}
                              </span>
                            </div>
                            <p className="text-xs italic text-stone-600">{ex.instructions}</p>

                            <div className="space-y-1 pt-1">
                              {items.slice(0, 3).map((it) => (
                                <div key={it.id} className="text-xs text-stone-800">
                                  <span className="font-bold mr-1">{it.itemNumber}.</span>
                                  <span>{it.sentenceOrPrompt}</span>
                                </div>
                              ))}
                            </div>

                            {edition === 'teacher_master' && items.length > 0 && (
                              <div className="mt-2 p-2 rounded bg-amber-100/70 border border-amber-300 text-[11px] text-amber-900">
                                <span className="font-bold">Answer Key: </span>
                                {items.map((it) => `${it.itemNumber}. ${it.expectedAnswer}`).join('; ')}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-stone-500 italic">No exercises added yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#CBBEAC] flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>[Recto - Exercises]</span>
                  <span>Page {currentTopicIndex * 2 + 2}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Immersive Single Chapter Reader */
            <article
              className={`w-full max-w-3xl p-8 sm:p-12 rounded-2xl border shadow-sm ${getPaperBgClass()} ${getFontFamilyClass()} space-y-8`}
              style={{ fontSize: `${fontSizePx}px` }}
            >
              {/* Chapter Header Banner */}
              <div className="border-b border-[#CBBEAC] pb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-bold text-[#9A7438]">
                    Unit {currentTopicIndex + 1} &bull; {activeTopic?.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] font-semibold">
                    {activeTopic?.classLevel}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#5A1832]">
                  {activeTopic?.title}
                </h1>
                <p className="text-sm text-stone-700 leading-relaxed mt-2">
                  {activeTopic?.overview}
                </p>
              </div>

              {/* Learning Objectives Callout */}
              {activeTopic?.learningObjectives && activeTopic.learningObjectives.length > 0 && (
                <div className="p-4 rounded-xl bg-white/60 border border-[#CBBEAC] space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase text-[#5A1832]">
                    <GraduationCap className="w-4 h-4 text-[#9A7438]" />
                    <span>Learning Objectives</span>
                  </div>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1.5 text-stone-700 leading-relaxed">
                    {activeTopic.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Core Definitions & Syntactic Formulas */}
              {activeTopic?.definitions && activeTopic.definitions.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-1.5 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#9A7438]" />
                    <span>1. Syntactic Rules &amp; Definitions</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {activeTopic.definitions.map((def) => (
                      <div
                        key={def.id}
                        className="p-4 rounded-xl bg-white/70 border border-[#CBBEAC] space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#5A1832]">{def.term}</h4>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDE4D6] text-[#9A7438] font-semibold">
                            {def.partOfSpeechOrCategory}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                          {def.ageAppropriateExplanation}
                        </p>
                        {def.formulaOrSyntax && (
                          <div className="p-2.5 rounded-lg bg-[#EDE4D6] border border-[#CBBEAC] font-mono text-xs text-[#5A1832]">
                            <span className="font-bold text-[#9A7438]">Rule: </span>
                            {def.formulaOrSyntax}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Theory & Pedagogical Markdown */}
              {activeTopic?.notesAndTheoryMarkdown && (
                <section className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-1.5">
                    2. Theory &amp; Pedagogical Notes
                  </h3>
                  <TextbookMarkdown
                    content={activeTopic.notesAndTheoryMarkdown}
                    className="text-xs sm:text-sm text-stone-800"
                    isDarkMode={isDarkMode}
                  />
                </section>
              )}

              {/* Practice Exercises Section */}
              {activeTopic?.exercises && activeTopic.exercises.length > 0 && (
                <section className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-1.5 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#9A7438]" />
                      <span>3. Practice Exercises</span>
                    </span>
                    <span className="text-xs font-mono font-normal text-stone-500">
                      {activeTopic.exercises.length} Exercises Included
                    </span>
                  </h3>

                  {activeTopic.exercises.map((ex, exIdx) => {
                    const items = getExerciseItems(ex);
                    return (
                    <div
                      key={ex.id}
                      className="p-5 rounded-2xl bg-white/70 border border-[#CBBEAC] space-y-3.5 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-bold text-xs font-mono">
                            {String.fromCharCode(65 + exIdx)}
                          </span>
                          <h4 className="text-sm font-bold text-[#292521]">{ex.title}</h4>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832]">
                          {getExerciseType(ex)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm italic text-stone-600">
                        {ex.instructions}
                      </p>

                      <div className="space-y-2.5 pt-1">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-lg bg-[#F6F0E7]/60 border border-[#CBBEAC] text-xs sm:text-sm space-y-1"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-bold mr-2 text-[#5A1832]">
                                  {item.itemNumber}.
                                </span>
                                <span className="text-stone-900">
                                  {item.sentenceOrPrompt}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-stone-500 shrink-0 ml-2">
                                [1 Mark]
                              </span>
                            </div>

                            {/* Solution Reveal Button */}
                            <div className="pt-1 flex items-center justify-end">
                              {edition === 'teacher_master' || revealedSolutions[item.id] ? (
                                <div className="text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-300 font-medium">
                                  <span className="font-bold">Answer: </span>
                                  {item.expectedAnswer}
                                </div>
                              ) : (
                                <button
                                  onClick={() => toggleSolution(item.id)}
                                  className="text-[11px] text-[#9A7438] hover:underline font-semibold cursor-pointer"
                                >
                                  Reveal Solution
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </section>
              )}

              {/* Chapter Test Series / Assessments */}
              {activeTopic?.testSeries && activeTopic.testSeries.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A1832] border-b border-[#CBBEAC] pb-1.5 flex items-center space-x-2">
                    <Award className="w-4 h-4 text-[#9A7438]" />
                    <span>4. Chapter Assessment Series</span>
                  </h3>

                  {activeTopic.testSeries.map((ts) => (
                    <div
                      key={ts.id}
                      className="p-4 rounded-xl bg-white/70 border border-[#CBBEAC] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-[#5A1832]">
                          {ts.title}
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#9A7438]">
                          {ts.totalMarks} Marks &bull; {ts.durationMinutes} Mins
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{ts.instructions}</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Bottom Pagination Footer */}
              <div className="pt-6 border-t border-[#CBBEAC] flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>
                  Unit {currentTopicIndex + 1} of {currentBook.topics.length}
                </span>
                <span>
                  {edition === 'teacher_master'
                    ? "Annotated Teacher's Edition"
                    : 'Standard Student Edition'}
                </span>
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
};
