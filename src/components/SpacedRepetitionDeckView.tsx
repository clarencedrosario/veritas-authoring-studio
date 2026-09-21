import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Brain,
  Layers,
  RotateCw,
  Volume2,
  Bookmark,
  Sparkles,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Flame,
  Trophy,
  BookOpen,
  Plus,
  Trash2,
  Eye,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import {
  Flashcard,
  FlashcardDomain,
  FlashcardReviewRating,
  GrammarClassLevel,
} from '../types';
import { INITIAL_FLASHCARDS_BENCHMARK } from '../utils/flashcardsData';
import {
  calculateNextReview,
  isCardDue,
  getDeckStats,
  speakWordOrPhrase,
  exportToAnkiTSV,
  downloadStringAsFile,
} from '../utils/spacedRepetitionEngine';

interface SpacedRepetitionDeckViewProps {
  isDarkMode: boolean;
  selectedClass?: GrammarClassLevel;
  onNavigateToGrammarTextbook?: () => void;
}

type ViewSubMode = 'study' | 'explorer' | 'leitner' | 'generator';

export const SpacedRepetitionDeckView: React.FC<SpacedRepetitionDeckViewProps> = ({
  isDarkMode,
  selectedClass: initialClass = 'Class 7',
  onNavigateToGrammarTextbook,
}) => {
  // Persistence for user cards
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('novelcraft_srs_flashcards_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved flashcards:', e);
      }
    }
    return INITIAL_FLASHCARDS_BENCHMARK;
  });

  useEffect(() => {
    try {
      localStorage.setItem('novelcraft_srs_flashcards_v1', JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save flashcards to localStorage:', e);
    }
  }, [cards]);

  // UI state
  const [subMode, setSubMode] = useState<ViewSubMode>('study');
  const [selectedDomain, setSelectedDomain] = useState<FlashcardDomain | 'all'>('all');
  const [filterClass, setFilterClass] = useState<GrammarClassLevel | 'all'>('all');
  const [onlyDueToday, setOnlyDueToday] = useState<boolean>(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Study Session state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [clozeInput, setClozeInput] = useState<string>('');
  const [clozeFeedback, setClozeFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [cardsReviewedInSession, setCardsReviewedInSession] = useState<number>(0);

  // AI Generator state
  const [genDomain, setGenDomain] = useState<FlashcardDomain>('irregular_verbs');
  const [genClass, setGenClass] = useState<GrammarClassLevel>(initialClass);
  const [genTopic, setGenTopic] = useState<string>('');
  const [genCount, setGenCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStatusMsg, setGenStatusMsg] = useState<string>('');

  // Manual Add Card Modal / State
  const [showManualModal, setShowManualModal] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    domain: 'irregular_verbs' as FlashcardDomain,
    classLevel: 'Class 7' as GrammarClassLevel,
    title: '',
    frontPrompt: '',
    backAnswer: '',
    clozeSentence: '',
    clozeAnswer: '',
    exampleSentence: '',
    tags: 'grammar, revision',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  // Filtered Cards for Study or Explorer
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      if (selectedDomain !== 'all' && c.domain !== selectedDomain) return false;
      if (filterClass !== 'all' && c.classLevel !== filterClass) return false;
      if (onlyDueToday && !isCardDue(c)) return false;
      if (onlyBookmarked && !c.isBookmarked) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchPrompt = c.frontPrompt.toLowerCase().includes(q);
        const matchBack = c.backAnswer.toLowerCase().includes(q);
        const matchTags = c.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchPrompt && !matchBack && !matchTags) return false;
      }
      return true;
    });
  }, [cards, selectedDomain, filterClass, onlyDueToday, onlyBookmarked, searchQuery]);

  // Due cards count across whole deck
  const stats = useMemo(() => getDeckStats(cards), [cards]);

  const activeCard: Flashcard | undefined = filteredCards[currentCardIndex];

  // Reset index when filters drastically change
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length) {
      setCurrentCardIndex(Math.max(0, filteredCards.length - 1));
    }
    setIsFlipped(false);
    setClozeInput('');
    setClozeFeedback('idle');
    setSessionStartTime(Date.now());
  }, [filteredCards.length, currentCardIndex]);

  // Handle Review Rating (Again, Hard, Good, Easy)
  const handleRateCard = useCallback(
    (rating: FlashcardReviewRating) => {
      if (!activeCard) return;
      const timeSpentSec = Math.max(1, (Date.now() - sessionStartTime) / 1000);
      const updatedCard = calculateNextReview(activeCard, rating, timeSpentSec);

      setCards((prev) => prev.map((c) => (c.id === updatedCard.id ? updatedCard : c)));
      setCardsReviewedInSession((prev) => prev + 1);

      // Advance to next card or complete
      setIsFlipped(false);
      setClozeInput('');
      setClozeFeedback('idle');
      setSessionStartTime(Date.now());

      if (currentCardIndex < filteredCards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        // Reached end of filtered stack
        setCurrentCardIndex(0);
      }
    },
    [activeCard, currentCardIndex, filteredCards.length, sessionStartTime]
  );

  // Toggle bookmark / starred
  const handleToggleBookmark = useCallback(
    (cardId: string) => {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isBookmarked: !c.isBookmarked } : c))
      );
    },
    []
  );

  // Keyboard navigation & hotkeys for rapid SRS learning
  useEffect(() => {
    if (subMode !== 'study') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid if user is currently typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleRateCard('again');
        } else if (e.key === '2') {
          e.preventDefault();
          handleRateCard('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleRateCard('good');
        } else if (e.key === '4') {
          e.preventDefault();
          handleRateCard('easy');
        }
      }

      if (e.key === 's' || e.key === 'S') {
        if (activeCard) {
          const textToSpeak = isFlipped
            ? activeCard.clozeAnswer || activeCard.title
            : activeCard.frontPrompt.split('\n')[0];
          speakWordOrPhrase(textToSpeak);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subMode, isFlipped, activeCard, handleRateCard]);

  // Check cloze typing test
  const handleCheckCloze = () => {
    if (!activeCard || !activeCard.clozeAnswer) return;
    const cleanUser = clozeInput.trim().toLowerCase();
    const cleanAns = activeCard.clozeAnswer.trim().toLowerCase();
    if (cleanUser === cleanAns || cleanAns.includes(cleanUser)) {
      setClozeFeedback('correct');
    } else {
      setClozeFeedback('incorrect');
    }
    setIsFlipped(true);
  };

  // Generate cards with Gemini
  const handleGenerateAICards = async () => {
    setIsGenerating(true);
    setGenStatusMsg('Consulting Gemini pedagogical engine...');
    try {
      const response = await fetch('/api/gemini/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: genDomain,
          classLevel: genClass,
          topic: genTopic || 'High-yield curriculum essentials',
          count: genCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data.flashcards) && data.flashcards.length > 0) {
        const formattedNewCards: Flashcard[] = data.flashcards.map((fc: any, idx: number) => ({
          ...fc,
          id: `ai-fc-${Date.now()}-${idx}`,
          box: 1,
          intervalDays: 1,
          easeFactor: 2.5,
          repetitions: 0,
          nextReviewDate: new Date().toISOString(),
          masteryStatus: 'learning',
          history: [],
          tags: fc.tags || [genDomain, genClass.replace(' ', '_')],
        }));

        setCards((prev) => [...formattedNewCards, ...prev]);
        setGenStatusMsg(`Successfully generated ${formattedNewCards.length} flashcards!`);
        setTimeout(() => {
          setSubMode('study');
          setSelectedDomain(genDomain);
          setCurrentCardIndex(0);
          setGenStatusMsg('');
        }, 1200);
      } else {
        setGenStatusMsg('Model returned empty response. Please retry.');
      }
    } catch (err: any) {
      console.warn('AI card gen error:', err);
      setGenStatusMsg(`Generation failed: ${err.message || 'Network error'}. Try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Manual create card
  const handleSaveManualCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title.trim() || !manualForm.frontPrompt.trim() || !manualForm.backAnswer.trim()) {
      return;
    }

    const newCard: Flashcard = {
      id: `manual-fc-${Date.now()}`,
      domain: manualForm.domain,
      classLevel: manualForm.classLevel,
      title: manualForm.title.trim(),
      frontPrompt: manualForm.frontPrompt.trim(),
      backAnswer: manualForm.backAnswer.trim(),
      clozeSentence: manualForm.clozeSentence.trim() || undefined,
      clozeAnswer: manualForm.clozeAnswer.trim() || undefined,
      exampleSentence: manualForm.exampleSentence.trim(),
      tags: manualForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      difficulty: manualForm.difficulty,
      box: 1,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: new Date().toISOString(),
      masteryStatus: 'learning',
      history: [],
    };

    setCards((prev) => [newCard, ...prev]);
    setShowManualModal(false);
    setManualForm({
      domain: 'irregular_verbs',
      classLevel: 'Class 7',
      title: '',
      frontPrompt: '',
      backAnswer: '',
      clozeSentence: '',
      clozeAnswer: '',
      exampleSentence: '',
      tags: 'grammar, revision',
      difficulty: 'medium',
    });
  };

  // Delete card
  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    }
  };

  // Export Anki TSV
  const handleExportAnki = () => {
    const tsvContent = exportToAnkiTSV(filteredCards);
    downloadStringAsFile(
      tsvContent,
      `Grammar_Flashcards_${selectedDomain}_${filterClass}.tsv`,
      'text/tab-separated-values'
    );
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(cards, null, 2);
    downloadStringAsFile(jsonStr, 'Grammar_SRS_Flashcards_Backup.json', 'application/json');
  };

  // Print flashcards
  const handlePrintDeck = () => {
    window.print();
  };

  return (
    <div
      id="spaced-repetition-deck-studio"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-50 text-stone-900'
      }`}
    >
      {/* Top Header & Overview Bar */}
      <header
        className={`border-b px-5 py-4 ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-stone-200'
        } backdrop-blur-md sticky top-0 z-20`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">
                  Spaced Repetition Flashcard Deck
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  SM-2 & Leitner Engine
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                Targeted memory retrieval for Irregular Verbs, Idioms & Figurative Etymology, and High-Yield Grammar Rules.
              </p>
            </div>
          </div>

          {/* Quick Submode Segmented Controls */}
          <div className="flex items-center space-x-1 p-1 bg-stone-100 dark:bg-slate-800/80 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-medium">
            <button
              id="tab-study-session"
              onClick={() => setSubMode('study')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                subMode === 'study'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Study Session</span>
              {stats.dueTodayCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {stats.dueTodayCount}
                </span>
              )}
            </button>

            <button
              id="tab-explorer"
              onClick={() => setSubMode('explorer')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                subMode === 'explorer'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deck Explorer ({filteredCards.length})</span>
            </button>

            <button
              id="tab-leitner"
              onClick={() => setSubMode('leitner')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                subMode === 'leitner'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leitner Boxes & Stats</span>
            </button>

            <button
              id="tab-generator"
              onClick={() => setSubMode('generator')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                subMode === 'generator'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Deck Creator</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-stone-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Domain Filter Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
            <span className="text-stone-400 dark:text-slate-500 font-semibold mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Domain:
            </span>
            <button
              onClick={() => {
                setSelectedDomain('all');
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                selectedDomain === 'all'
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700'
              }`}
            >
              All Decks ({cards.length})
            </button>

            <button
              onClick={() => {
                setSelectedDomain('irregular_verbs');
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                selectedDomain === 'irregular_verbs'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
              }`}
            >
              Irregular Verbs (V1-V2-V3)
            </button>

            <button
              onClick={() => {
                setSelectedDomain('idioms');
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                selectedDomain === 'idioms'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
              }`}
            >
              Idioms & Figurative
            </button>

            <button
              onClick={() => {
                setSelectedDomain('grammar_rules');
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                selectedDomain === 'grammar_rules'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100'
              }`}
            >
              Grammar Rules & Traps
            </button>
          </div>

          {/* Class, Due & Search Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value as any);
                setCurrentCardIndex(0);
              }}
              className="px-2 py-1 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 text-xs focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Classes (3–12)</option>
              {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>

            <button
              onClick={() => {
                setOnlyDueToday((prev) => !prev);
                setCurrentCardIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1 text-xs transition-colors ${
                onlyDueToday
                  ? 'bg-red-500 text-white border-red-600 font-semibold'
                  : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Due Today</span>
            </button>

            <button
              onClick={() => {
                setOnlyBookmarked((prev) => !prev);
                setCurrentCardIndex(0);
              }}
              className={`px-2 py-1 rounded-lg border flex items-center space-x-1 text-xs transition-colors ${
                onlyBookmarked
                  ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                  : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Starred</span>
            </button>

            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentCardIndex(0);
                }}
                placeholder="Search cards..."
                className="pl-7 pr-2.5 py-1 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-800 dark:text-slate-200 text-xs w-36 focus:w-48 transition-all focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => setShowManualModal(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center space-x-1 text-xs shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>New Card</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-5">
        {/* SUBMODE 1: ACTIVE STUDY SESSION */}
        {subMode === 'study' && (
          <div className="max-w-3xl mx-auto space-y-5">
            {filteredCards.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h2 className="text-lg font-bold">All caught up in this queue!</h2>
                <p className="text-sm text-stone-500 dark:text-slate-400 max-w-md mx-auto">
                  No cards match your current active filters or need review right now. Switch domains, disable &ldquo;Due Today&rdquo;, or generate new flashcards.
                </p>
                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedDomain('all');
                      setOnlyDueToday(false);
                      setOnlyBookmarked(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setSubMode('generator')}
                    className="px-4 py-2 bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-stone-200"
                  >
                    Generate with AI
                  </button>
                </div>
              </div>
            ) : activeCard ? (
              <>
                {/* Progress & Deck Status Bar */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 px-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-stone-800 dark:text-slate-200">
                      Card {currentCardIndex + 1} of {filteredCards.length}
                    </span>
                    <span className="text-stone-300 dark:text-slate-700">•</span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-[11px] font-medium">
                      Box {activeCard.box} / 5
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-[11px] font-medium">
                      {activeCard.classLevel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleToggleBookmark(activeCard.id)}
                      title={activeCard.isBookmarked ? 'Remove Star' : 'Star for review'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        activeCard.isBookmarked
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600'
                          : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const word = isFlipped
                          ? activeCard.clozeAnswer || activeCard.title
                          : activeCard.frontPrompt.split('\n')[0];
                        speakWordOrPhrase(word);
                      }}
                      title="Pronounce using Speech Synthesis (Hotkey: S)"
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-300"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          if (currentCardIndex > 0) {
                            setCurrentCardIndex((p) => p - 1);
                            setIsFlipped(false);
                            setClozeInput('');
                          }
                        }}
                        disabled={currentCardIndex === 0}
                        className="p-1 rounded bg-stone-100 dark:bg-slate-800 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (currentCardIndex < filteredCards.length - 1) {
                            setCurrentCardIndex((p) => p + 1);
                            setIsFlipped(false);
                            setClozeInput('');
                          }
                        }}
                        disabled={currentCardIndex >= filteredCards.length - 1}
                        className="p-1 rounded bg-stone-100 dark:bg-slate-800 disabled:opacity-30"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
                    style={{
                      width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%`,
                    }}
                  />
                </div>

                {/* THE 3D FLASHCARD CONTAINER */}
                <div
                  id={`flashcard-${activeCard.id}`}
                  className={`relative rounded-3xl border transition-all duration-300 min-h-[380px] p-6 sm:p-8 flex flex-col justify-between shadow-md ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 shadow-black/40'
                      : 'bg-white border-stone-200 shadow-stone-200/50'
                  }`}
                >
                  {/* Card Header & Domain Tag */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          activeCard.domain === 'irregular_verbs'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : activeCard.domain === 'idioms'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                        }`}
                      >
                        {activeCard.domain === 'irregular_verbs'
                          ? 'Irregular Verb (V1-V2-V3)'
                          : activeCard.domain === 'idioms'
                          ? 'Idiom & Phrase'
                          : 'Grammar Rule & Trap'}
                      </span>

                      <span className="text-xs text-stone-400 dark:text-slate-500 font-medium">
                        Difficulty: {activeCard.difficulty}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-stone-400 dark:text-slate-500">
                      {isFlipped ? 'BACK: EXPLANATION' : 'FRONT: ACTIVE RECALL'}
                    </span>
                  </div>

                  {/* Card Body: FRONT vs BACK */}
                  <div className="my-auto py-6 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                      {activeCard.title}
                    </h2>

                    {!isFlipped ? (
                      /* FRONT: Challenge / Prompt */
                      <div className="space-y-5">
                        <div className="text-base text-stone-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-serif">
                          {activeCard.frontPrompt}
                        </div>

                        {/* Interactive Cloze / Recall Testing Field */}
                        {activeCard.clozeSentence && (
                          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 space-y-3">
                            <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-500 dark:text-slate-400">
                              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                              <span>Cloze Challenge — Test Your Active Retrieval:</span>
                            </div>
                            <p className="text-sm font-medium text-stone-800 dark:text-slate-200">
                              {activeCard.clozeSentence}
                            </p>

                            <div className="flex items-center space-x-2 pt-1">
                              <input
                                type="text"
                                value={clozeInput}
                                onChange={(e) => setClozeInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCheckCloze();
                                }}
                                placeholder="Type your answer here..."
                                className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                              <button
                                onClick={handleCheckCloze}
                                className="px-3.5 py-1.5 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-stone-800"
                              >
                                Check &amp; Reveal
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* BACK: Comprehensive Pedagogical Explanation */
                      <div className="space-y-5 animate-in fade-in duration-200">
                        {/* Cloze verification banner if student attempted */}
                        {clozeFeedback !== 'idle' && (
                          <div
                            className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-medium ${
                              clozeFeedback === 'correct'
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
                            }`}
                          >
                            {clozeFeedback === 'correct' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span>
                                  Spot on! Your answer &ldquo;{clozeInput}&rdquo; matches the correct target:{' '}
                                  <strong>{activeCard.clozeAnswer}</strong>.
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <span>
                                  Close effort! You typed &ldquo;{clozeInput}&rdquo;, but standard usage is:{' '}
                                  <strong>{activeCard.clozeAnswer}</strong>.
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Core answer block */}
                        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50">
                          <div className="text-sm text-stone-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                            {activeCard.backAnswer}
                          </div>
                        </div>

                        {/* Domain Specific Visual Layouts */}
                        {/* 1. Irregular Verbs 3-Column Table */}
                        {activeCard.domain === 'irregular_verbs' && activeCard.irregularVerbDetails && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2 p-3 bg-stone-100 dark:bg-slate-800/70 rounded-xl border border-stone-200 dark:border-slate-700 text-center">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-slate-400">
                                  V1 (Base Form)
                                </span>
                                <div className="text-base font-bold text-stone-900 dark:text-white mt-0.5">
                                  {activeCard.irregularVerbDetails.v1}
                                </div>
                                {activeCard.irregularVerbDetails.phoneticV1 && (
                                  <div className="text-[11px] font-mono text-stone-500">
                                    {activeCard.irregularVerbDetails.phoneticV1}
                                  </div>
                                )}
                              </div>
                              <div className="border-x border-stone-200 dark:border-slate-700">
                                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                                  V2 (Past Simple)
                                </span>
                                <div className="text-base font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                                  {activeCard.irregularVerbDetails.v2}
                                </div>
                                {activeCard.irregularVerbDetails.phoneticV2 && (
                                  <div className="text-[11px] font-mono text-stone-500">
                                    {activeCard.irregularVerbDetails.phoneticV2}
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                  V3 (Participle)
                                </span>
                                <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                                  {activeCard.irregularVerbDetails.v3}
                                </div>
                                {activeCard.irregularVerbDetails.phoneticV3 && (
                                  <div className="text-[11px] font-mono text-stone-500">
                                    {activeCard.irregularVerbDetails.phoneticV3}
                                  </div>
                                )}
                              </div>
                            </div>

                            {activeCard.irregularVerbDetails.confusionWarning && (
                              <div className="flex items-start space-x-2 text-xs p-2.5 rounded-lg bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800">
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>{activeCard.irregularVerbDetails.confusionWarning}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 2. Idiom Etymology & Dialogue */}
                        {activeCard.domain === 'idioms' && activeCard.idiomDetails && (
                          <div className="space-y-3">
                            {activeCard.idiomDetails.originOrEtymology && (
                              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 text-xs space-y-1">
                                <span className="font-semibold text-stone-700 dark:text-slate-300 flex items-center">
                                  <BookOpen className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                  Historical Origin / Etymology:
                                </span>
                                <p className="text-stone-600 dark:text-slate-400 leading-relaxed">
                                  {activeCard.idiomDetails.originOrEtymology}
                                </p>
                              </div>
                            )}

                            {activeCard.idiomDetails.dialogueExample && (
                              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs italic text-stone-700 dark:text-slate-300">
                                <span className="not-italic font-semibold block text-emerald-700 dark:text-emerald-400 mb-1">
                                  In Authentic Dialogue:
                                </span>
                                {activeCard.idiomDetails.dialogueExample}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3. Grammar Rule Side-by-Side Comparison */}
                        {activeCard.domain === 'grammar_rules' && activeCard.grammarRuleDetails && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
                                <span className="font-bold flex items-center text-red-700 dark:text-red-400 mb-1">
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Common Mistake
                                </span>
                                &ldquo;{activeCard.grammarRuleDetails.incorrectExample}&rdquo;
                              </div>

                              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200">
                                <span className="font-bold flex items-center text-emerald-700 dark:text-emerald-400 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Standard Correct
                                </span>
                                &ldquo;{activeCard.grammarRuleDetails.correctExample}&rdquo;
                              </div>
                            </div>

                            {activeCard.grammarRuleDetails.mnemonic && (
                              <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs flex items-start space-x-2 text-purple-900 dark:text-purple-200">
                                <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">Memory Hook: </span>
                                  {activeCard.grammarRuleDetails.mnemonic}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Exemplar sentence */}
                        {activeCard.exampleSentence && (
                          <div className="pt-2 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400">
                            <span className="font-semibold text-stone-700 dark:text-slate-300">
                              Exemplar Usage:{' '}
                            </span>
                            &ldquo;{activeCard.exampleSentence}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="pt-4 border-t border-stone-100 dark:border-slate-800/80">
                    {!isFlipped ? (
                      <button
                        id="btn-flip-card"
                        onClick={() => setIsFlipped(true)}
                        className="w-full py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-stone-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center space-x-2 shadow-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Reveal Answer &amp; Notes (Space)</span>
                      </button>
                    ) : (
                      /* SM-2 & Leitner Rating Buttons */
                      <div className="space-y-2">
                        <div className="text-center text-xs font-semibold text-stone-400 dark:text-slate-500">
                          Rate Your Retrieval Effort (SM-2 Interval Scheduling):
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            id="btn-rate-again"
                            onClick={() => handleRateCard('again')}
                            className="p-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 text-center transition-all group"
                          >
                            <div className="text-xs font-bold">[1] Again</div>
                            <div className="text-[10px] text-red-500 opacity-80 mt-0.5">&lt; 1 Day (Box 1)</div>
                          </button>

                          <button
                            id="btn-rate-hard"
                            onClick={() => handleRateCard('hard')}
                            className="p-2 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-center transition-all group"
                          >
                            <div className="text-xs font-bold">[2] Hard</div>
                            <div className="text-[10px] text-amber-500 opacity-80 mt-0.5">1–2 Days</div>
                          </button>

                          <button
                            id="btn-rate-good"
                            onClick={() => handleRateCard('good')}
                            className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-center transition-all group"
                          >
                            <div className="text-xs font-bold">[3] Good</div>
                            <div className="text-[10px] text-emerald-500 opacity-80 mt-0.5">+1 Box (3–5 d)</div>
                          </button>

                          <button
                            id="btn-rate-easy"
                            onClick={() => handleRateCard('easy')}
                            className="p-2 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-center transition-all group"
                          >
                            <div className="text-xs font-bold">[4] Easy</div>
                            <div className="text-[10px] text-sky-500 opacity-80 mt-0.5">+1 Box (7–14 d)</div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keyboard hotkeys hint */}
                <div className="text-center text-[11px] text-stone-400 dark:text-slate-500">
                  Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 border">Space</kbd> Flip |{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 border">1–4</kbd> Rate Card |{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 border">S</kbd> Pronounce
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* SUBMODE 2: DECK EXPLORER & CARD REPOSITORY */}
        {subMode === 'explorer' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Deck Explorer</h2>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Showing {filteredCards.length} flashcards in current view
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportAnki}
                  title="Export cards for Anki desktop / mobile app"
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 text-xs font-semibold hover:bg-stone-50 flex items-center space-x-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Anki</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 text-xs font-semibold hover:bg-stone-50 flex items-center space-x-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON Backup</span>
                </button>

                <button
                  onClick={handlePrintDeck}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-stone-700 dark:text-slate-300 text-xs font-semibold hover:bg-stone-50 flex items-center space-x-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Cards</span>
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          card.domain === 'irregular_verbs'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : card.domain === 'idioms'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {card.domain.replace('_', ' ')}
                      </span>

                      <div className="flex items-center space-x-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-slate-800 text-stone-500">
                          Box {card.box}
                        </span>
                        <button
                          onClick={() => handleToggleBookmark(card.id)}
                          className={`p-1 rounded ${
                            card.isBookmarked
                              ? 'text-amber-500'
                              : 'text-stone-300 hover:text-stone-500 dark:text-slate-600'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                      {card.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-slate-300 line-clamp-3 font-serif">
                      {card.frontPrompt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => speakWordOrPhrase(card.clozeAnswer || card.title)}
                        className="p-1 rounded text-stone-400 hover:text-amber-600"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] text-stone-400">{card.classLevel}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSubMode('study');
                          setCurrentCardIndex(idx);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold text-xs hover:bg-amber-100 flex items-center space-x-1"
                      >
                        <span>Study</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1 text-stone-300 hover:text-red-500 rounded"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMODE 3: LEITNER 5-BOX MATRIX & RETENTION STATS */}
        {subMode === 'leitner' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold">Leitner 5-Box Distribution &amp; SRS Memory Curve</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Spaced repetition automatically schedules cards based on retrieval difficulty. As recall solidifies, cards graduate to higher boxes.
              </p>
            </div>

            {/* High level KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1">
                  <span>Total Deck Size</span>
                  <Layers className="w-4 h-4 text-stone-400" />
                </div>
                <div className="text-2xl font-bold">{stats.totalCards}</div>
                <div className="text-[11px] text-stone-400 mt-1">Class 3 to 12 corpus</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1">
                  <span>Cards Due Today</span>
                  <Calendar className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.dueTodayCount}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Ready for retrieval</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1">
                  <span>Long-Term Mastered</span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.masteredCount}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">In Box 5 (Monthly recall)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1">
                  <span>Retrieval Accuracy</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.retentionRate}%
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Historical recall efficiency</div>
              </div>
            </div>

            {/* The 5 Leitner Boxes Interactive Visual Pipeline */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                Active Leitner Progression Pipeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  {
                    boxNum: 1,
                    title: 'Box 1: Daily',
                    interval: 'Everyday Review',
                    color: 'border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20',
                    tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
                  },
                  {
                    boxNum: 2,
                    title: 'Box 2: 3-Day',
                    interval: 'Every 3 Days',
                    color: 'border-amber-300 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20',
                    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
                  },
                  {
                    boxNum: 3,
                    title: 'Box 3: Weekly',
                    interval: 'Every 7 Days',
                    color: 'border-blue-300 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20',
                    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
                  },
                  {
                    boxNum: 4,
                    title: 'Box 4: Fortnightly',
                    interval: 'Every 14 Days',
                    color: 'border-purple-300 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20',
                    tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
                  },
                  {
                    boxNum: 5,
                    title: 'Box 5: Mastered',
                    interval: 'Monthly (Permanent)',
                    color: 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20',
                    tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
                  },
                ].map((b) => {
                  const count = stats.boxCounts[b.boxNum] || 0;
                  const pct = stats.totalCards > 0 ? Math.round((count / stats.totalCards) * 100) : 0;

                  return (
                    <div
                      key={b.boxNum}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${b.color}`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.tagColor}`}>
                            Box {b.boxNum}
                          </span>
                          <span className="text-xs font-bold text-stone-800 dark:text-slate-200">
                            {count} cards
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-stone-900 dark:text-white mt-2">
                          {b.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                          {b.interval}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-1.5 bg-stone-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-stone-700 dark:bg-slate-300 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-stone-400 text-right">{pct}% of deck</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBMODE 4: AI FLASHCARD GENERATOR */}
        {subMode === 'generator' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">AI Flashcard Generator</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 max-w-md mx-auto">
                Generate tailored, high-yield spaced repetition cards for tricky irregular verbs, thematic idioms, or board-exam grammar traps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                    Target Domain:
                  </label>
                  <select
                    value={genDomain}
                    onChange={(e) => setGenDomain(e.target.value as FlashcardDomain)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="irregular_verbs">Irregular Verbs (V1-V2-V3 &amp; Pitfalls)</option>
                    <option value="idioms">Idioms &amp; Figurative Expressions</option>
                    <option value="grammar_rules">Grammar Rules &amp; Common Errors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                    Target Class Level:
                  </label>
                  <select
                    value={genClass}
                    onChange={(e) => setGenClass(e.target.value as GrammarClassLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Specific Topic / Emphasis (Optional):
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder={
                    genDomain === 'irregular_verbs'
                      ? 'e.g., Invariant verbs (cast, burst) or vowel shifts (cling, shrink)'
                      : genDomain === 'idioms'
                      ? 'e.g., Nautical and seafaring idioms, or animal metaphors'
                      : 'e.g., Dangling participles, pronoun case, or subjunctive were'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Number of Cards to Generate:
                </label>
                <div className="flex space-x-2">
                  {[3, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGenCount(num)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        genCount === num
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-50 dark:bg-slate-800 border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300'
                      }`}
                    >
                      {num} Cards
                    </button>
                  ))}
                </div>
              </div>

              {genStatusMsg && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>{genStatusMsg}</span>
                </div>
              )}

              <button
                disabled={isGenerating}
                onClick={handleGenerateAICards}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating with Gemini...' : 'Generate Flashcards'}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MANUAL CREATE CARD MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Create Custom Flashcard</span>
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManualCard} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Domain</label>
                  <select
                    value={manualForm.domain}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, domain: e.target.value as FlashcardDomain })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="irregular_verbs">Irregular Verbs</option>
                    <option value="idioms">Idioms &amp; Phrases</option>
                    <option value="grammar_rules">Grammar Rules</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Class Level</label>
                  <select
                    value={manualForm.classLevel}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, classLevel: e.target.value as GrammarClassLevel })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Card Title / Concept Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.title}
                  onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                  placeholder="e.g., Slay / Slew / Slain"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Front Prompt (The Question) *</label>
                <textarea
                  required
                  rows={2}
                  value={manualForm.frontPrompt}
                  onChange={(e) => setManualForm({ ...manualForm, frontPrompt: e.target.value })}
                  placeholder="e.g., What are the past simple and past participle of 'Slay'?"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Back Answer (The Explanation) *</label>
                <textarea
                  required
                  rows={3}
                  value={manualForm.backAnswer}
                  onChange={(e) => setManualForm({ ...manualForm, backAnswer: e.target.value })}
                  placeholder="e.g., V1: Slay | V2: Slew | V3: Slain"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Cloze Sentence (Optional)</label>
                  <input
                    type="text"
                    value={manualForm.clozeSentence}
                    onChange={(e) => setManualForm({ ...manualForm, clozeSentence: e.target.value })}
                    placeholder="The knight ___ (slay) the beast."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cloze Answer (Target)</label>
                  <input
                    type="text"
                    value={manualForm.clozeAnswer}
                    onChange={(e) => setManualForm({ ...manualForm, clozeAnswer: e.target.value })}
                    placeholder="slew"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Exemplar Sentence</label>
                <input
                  type="text"
                  value={manualForm.exampleSentence}
                  onChange={(e) => setManualForm({ ...manualForm, exampleSentence: e.target.value })}
                  placeholder="e.g., Saint George slew the mythical dragon."
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                >
                  Add to Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
