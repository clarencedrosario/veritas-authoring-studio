import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Copy,
  ChevronRight,
  Edit3,
  GitFork,
  Lightbulb,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarExercise,
  GrammarQuestion,
  QuestionType,
  DevelopmentalTier,
} from '../types';
import { CreateQuestionDialog } from './common/CreateQuestionDialog';
import { ALL_INDIAN_CLASSES } from '../utils/activeBookContext';

interface QuestionBankStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onSendToAssessment?: (question: GrammarQuestion) => void;
  onNavigateToDiagrammer?: (sentence: string) => void;
  onNavigateToAssessments?: () => void;
}

export const QuestionBankStudioView: React.FC<QuestionBankStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onSendToAssessment,
  onNavigateToDiagrammer,
}) => {
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 6'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  // Reusable Create Question Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDialogType, setCreateDialogType] = useState<QuestionType>('mcq');

  // Synchronize local class selection with canonical seriesProject.selectedClass
  useEffect(() => {
    if (seriesProject.selectedClass && seriesProject.selectedClass !== selectedClass) {
      setSelectedClass(seriesProject.selectedClass);
    }
  }, [seriesProject.selectedClass]);

  // AI Assistant Suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<{
    id: string;
    type: 'distractor' | 'clarity' | 'rubric' | 'explanation';
    title: string;
    description: string;
    suggestedChange?: any;
  } | null>(null);

  const allClasses: GrammarClassLevel[] = ALL_INDIAN_CLASSES;

  const currentBook = seriesProject.books[selectedClass] || {
    classLevel: selectedClass,
    title: `${seriesProject.seriesTitle} - ${selectedClass}`,
    topics: [],
  };

  // Aggregate all questions in current book across exercises and test papers with metadata
  const allAggregatedQuestions = useMemo(() => {
    const list: Array<{
      question: GrammarQuestion;
      topicId: string;
      topicTitle: string;
      exerciseId?: string;
      testSeriesId?: string;
    }> = [];

    currentBook.topics.forEach((topic) => {
      topic.exercises.forEach((ex) => {
        ex.questions.forEach((q) => {
          list.push({
            question: q,
            topicId: topic.id,
            topicTitle: topic.title,
            exerciseId: ex.id,
          });
        });
      });

      topic.testSeries.forEach((ts) => {
        ts.sections.forEach((sec) => {
          sec.questions.forEach((q) => {
            list.push({
              question: q,
              topicId: topic.id,
              topicTitle: topic.title,
              testSeriesId: ts.id,
            });
          });
        });
      });
    });

    return list;
  }, [currentBook]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return allAggregatedQuestions.filter(({ question, topicTitle }) => {
      const promptText = (
        question.prompt ||
        question.blanksSentence ||
        question.originalSentence ||
        ''
      ).toLowerCase();
      const matchesSearch =
        !searchQuery ||
        promptText.includes(searchQuery.toLowerCase()) ||
        topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (question.correctAnswer &&
          question.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || question.type === filterType;
      const matchesDifficulty =
        filterDifficulty === 'all' ||
        question.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
      const matchesTier =
        filterTier === 'all' || (question.tier || 'standard') === filterTier;

      return matchesSearch && matchesType && matchesDifficulty && matchesTier;
    });
  }, [allAggregatedQuestions, searchQuery, filterType, filterDifficulty, filterTier]);

  const activeEntry = useMemo(() => {
    if (selectedQuestionId) {
      const found = allAggregatedQuestions.find(
        (entry) => entry.question.id === selectedQuestionId
      );
      if (found) return found;
    }
    return filteredQuestions[0] || allAggregatedQuestions[0];
  }, [selectedQuestionId, allAggregatedQuestions, filteredQuestions]);

  const activeQuestion = activeEntry?.question;

  // Update question
  const handleUpdateActiveQuestion = (updated: GrammarQuestion) => {
    if (!activeEntry) return;

    const topic = currentBook.topics.find((t) => t.id === activeEntry.topicId);
    if (!topic) return;

    let updatedExercises = topic.exercises;
    let updatedTestSeries = topic.testSeries;

    if (activeEntry.exerciseId) {
      updatedExercises = topic.exercises.map((ex) => {
        if (ex.id !== activeEntry.exerciseId) return ex;
        return {
          ...ex,
          questions: ex.questions.map((q) => (q.id === updated.id ? updated : q)),
        };
      });
    }

    if (activeEntry.testSeriesId) {
      updatedTestSeries = topic.testSeries.map((ts) => {
        if (ts.id !== activeEntry.testSeriesId) return ts;
        return {
          ...ts,
          sections: ts.sections.map((sec) => ({
            ...sec,
            questions: sec.questions.map((q) => (q.id === updated.id ? updated : q)),
          })),
        };
      });
    }

    const updatedTopic: GrammarTopic = {
      ...topic,
      exercises: updatedExercises,
      testSeries: updatedTestSeries,
    };

    const updatedBook = {
      ...currentBook,
      topics: currentBook.topics.map((t) => (t.id === topic.id ? updatedTopic : t)),
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [selectedClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleClassChange = (newCls: GrammarClassLevel) => {
    setSelectedClass(newCls);
    setSelectedQuestionId('');
    onUpdateSeriesProject({
      ...seriesProject,
      selectedClass: newCls,
      lastUpdated: new Date().toISOString(),
    });
  };

  const openCreateQuestionDialog = (type: QuestionType = 'mcq') => {
    setCreateDialogType(type);
    setIsCreateDialogOpen(true);
  };

  // Create & persist new question via dialog
  const handleSaveNewQuestion = (question: GrammarQuestion, targetTopicId: string) => {
    let updatedTopics = [...currentBook.topics];
    let targetTopic = updatedTopics.find((t) => t.id === targetTopicId);

    if (!targetTopic) {
      if (updatedTopics.length === 0) {
        targetTopic = {
          id: `topic_${Date.now()}`,
          title: 'Syntax, Concord & Sentence Architecture',
          category: 'Syntax & Clauses',
          classLevel: selectedClass,
          exercises: [],
          testSeries: [],
        };
        updatedTopics.push(targetTopic);
      } else {
        targetTopic = updatedTopics[0];
      }
    }

    let targetExercise = targetTopic.exercises[0];
    let newExerciseCreated = false;

    if (!targetExercise) {
      targetExercise = {
        id: `ex_${Date.now()}`,
        title: 'Exercise 1: Standard Assessment',
        instructions: 'Answer each question according to prescriptive grammar rules.',
        targetType: question.type,
        maxMarks: 10,
        questions: [],
      };
      newExerciseCreated = true;
    }

    const updatedExercises = newExerciseCreated
      ? [...targetTopic.exercises, { ...targetExercise, questions: [question] }]
      : targetTopic.exercises.map((ex) =>
          ex.id === targetExercise.id
            ? { ...ex, questions: [...ex.questions, question] }
            : ex
        );

    const updatedTopic = { ...targetTopic, exercises: updatedExercises };
    const finalTopics = updatedTopics.map((t) => (t.id === targetTopic.id ? updatedTopic : t));

    const updatedBook = {
      ...currentBook,
      topics: finalTopics,
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [selectedClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });

    setSelectedQuestionId(question.id);
  };

  // Trigger Academic AI Review for active question
  const handleTriggerAiReview = () => {
    if (!activeQuestion) return;
    setAiSuggestion({
      id: `sug_${Date.now()}`,
      type: activeQuestion.type === 'mcq' ? 'distractor' : 'rubric',
      title:
        activeQuestion.type === 'mcq'
          ? 'Strengthen Distractor Plausibility'
          : 'Clarify Marking Scheme Rubric',
      description:
        activeQuestion.type === 'mcq'
          ? 'Option C is syntactically implausible. Consider substituting with a subtle dangling modifier error that tests diagnostic discernment.'
          : 'Award 1 mark for identifying proximity concord; award 1 mark for correct reformulation.',
      suggestedChange:
        activeQuestion.type === 'mcq' && activeQuestion.options
          ? [
              activeQuestion.options[0],
              activeQuestion.options[1],
              'Neither of the instructors have completed the syllabus report.',
              activeQuestion.options[3] || 'All of the tutors was absent.',
            ]
          : undefined,
    });
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion || !activeQuestion) return;
    if (aiSuggestion.type === 'distractor' && aiSuggestion.suggestedChange) {
      handleUpdateActiveQuestion({
        ...activeQuestion,
        options: aiSuggestion.suggestedChange,
      });
    } else if (aiSuggestion.type === 'rubric') {
      handleUpdateActiveQuestion({
        ...activeQuestion,
        explanation: `${activeQuestion.explanation || ''}\nMarking Scheme: Award 1 mark for rule citation, 1 mark for correct usage.`,
      });
    }
    setAiSuggestion(null);
  };

  return (
    <div
      id="question-bank-studio-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011] select-none"
    >
      {/* Editorial Subheader */}
      <header className="h-14 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium hidden sm:inline">
              Class Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value as GrammarClassLevel)}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/30">
              {seriesProject.targetBoard}
            </span>
            <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium">
              {allAggregatedQuestions.length} Questions Cataloged
            </span>
          </div>
        </div>

        {/* Quick Add Menu */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openCreateQuestionDialog('mcq')}
            className="h-10 px-3.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ MCQ</span>
          </button>
          <button
            onClick={() => openCreateQuestionDialog('transformation')}
            className="h-10 px-3.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Transformation</span>
          </button>
          <button
            onClick={() => openCreateQuestionDialog('error_correction')}
            className="h-10 px-3.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-sm font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Editing / Error</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Question Index (Left) -> Question Editor (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question Index */}
        <aside className="w-80 sm:w-96 border-r border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] flex flex-col shrink-0">
          {/* Search & Filter Bar */}
          <div className="p-3.5 border-b border-[#CBBEAC] dark:border-[#4d2b3b] space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#71685E] dark:text-[#c9b9a6]" />
              <input
                type="text"
                placeholder="Search questions by keyword or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] text-sm text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52]"
              />
            </div>

            {/* Filter pills */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] font-medium outline-none"
              >
                <option value="all">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="transformation">Transformation</option>
                <option value="error_correction">Editing / Error</option>
                <option value="fill_in_blanks">Cloze / Fill</option>
                <option value="short_answer">Give Reason</option>
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] font-medium outline-none"
              >
                <option value="all">Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>

              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] text-[#292521] dark:text-[#F6F0E7] font-medium outline-none"
              >
                <option value="all">Tier</option>
                <option value="foundation">Foundation</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Questions Index List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#CBBEAC]/50 dark:divide-[#4d2b3b]/50">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                No questions found matching criteria.
                <br />
                Adjust filters or click "+ Add Question".
              </div>
            ) : (
              filteredQuestions.map(({ question, topicTitle }) => {
                const isSelected = activeQuestion?.id === question.id;
                const snippet =
                  question.prompt ||
                  question.blanksSentence ||
                  question.originalSentence ||
                  'Grammar question prompt';

                return (
                  <button
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col space-y-2 ${
                      isSelected
                        ? 'bg-[#EDE4D6] dark:bg-[#35101F]'
                        : 'hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono uppercase font-bold text-[#5A1832] dark:text-[#C29A52]">
                          {question.type.replace('_', ' ')}
                        </span>
                        <span className="text-[#71685E] dark:text-[#c9b9a6]">&bull;</span>
                        <span className="text-[#71685E] dark:text-[#c9b9a6] font-medium truncate max-w-[130px]">
                          {topicTitle}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-xs text-[#292521] dark:text-[#F6F0E7] bg-[#CBBEAC]/30 dark:bg-[#4d2b3b]/60 px-1.5 py-0.5 rounded">
                        [{question.marks} mk]
                      </span>
                    </div>

                    {/* Question List Prompt: 15-16px readable */}
                    <div className="text-[15px] font-serif text-[#292521] dark:text-[#F6F0E7] line-clamp-2 leading-snug">
                      {snippet}
                    </div>

                    {/* Metadata: 13px */}
                    <div className="flex items-center space-x-2 text-[12.5px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                      <span className="font-medium">{question.difficulty || 'Moderate'}</span>
                      <span>&bull;</span>
                      <span>{question.cognitiveLevel || 'Applying'}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{question.tier || 'standard'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right: Question Editor Canvas */}
        {activeQuestion ? (
          <main className="flex-1 overflow-y-auto bg-[#F6F0E7] dark:bg-[#1e0f18] p-6 sm:p-10 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-mono text-xs uppercase font-bold px-3 py-1 rounded-md bg-[#5A1832] text-[#F6F0E7]">
                    {activeQuestion.type.replace('_', ' ')}
                  </span>
                  <span className="text-[#71685E] dark:text-[#c9b9a6]">&bull;</span>
                  <span className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7]">
                    Topic: {activeEntry?.topicTitle}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleTriggerAiReview}
                    className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-medium text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5 transition-colors"
                    title="Review with Academic Editor AI"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Academic Editor Review</span>
                  </button>

                  {onSendToAssessment && (
                    <button
                      onClick={() => onSendToAssessment(activeQuestion)}
                      className="px-3 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-medium text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-1.5 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-[#71685E]" />
                      <span>Add to Assessment</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AI Academic Suggestion Banner (AI Recommends. The Author Decides.) */}
              {aiSuggestion && (
                <div className="p-4 rounded-xl border border-[#C29A52]/50 dark:border-[#C29A52]/40 bg-[#EDE4D6]/70 dark:bg-[#35101F]/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-bold text-[#5A1832] dark:text-[#C29A52]">
                      <Sparkles className="w-4 h-4 text-[#C29A52]" />
                      <span>{aiSuggestion.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                      AI RECOMMENDS &bull; AUTHOR DECIDES
                    </span>
                  </div>

                  <p className="text-[15px] text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                    {aiSuggestion.description}
                  </p>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={handleApplyAiSuggestion}
                      className="px-3.5 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-white text-sm font-semibold shadow-xs flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Recommendation</span>
                    </button>
                    <button
                      onClick={() => setAiSuggestion(null)}
                      className="px-3.5 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] text-[#292521] dark:text-[#F6F0E7] text-sm font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Central Question Prompt (The Actual Question Must Be the Visual Priority: 18-20px) */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6] block">
                  Question Prompt / Stimulus *
                </label>
                <textarea
                  rows={3}
                  value={activeQuestion.prompt || ''}
                  onChange={(e) =>
                    handleUpdateActiveQuestion({ ...activeQuestion, prompt: e.target.value })
                  }
                  placeholder="Enter the primary question stimulus or direction..."
                  className="w-full text-lg sm:text-xl font-serif font-medium text-[#292521] dark:text-[#F6F0E7] bg-white dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-xl p-4 outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52] leading-relaxed shadow-2xs"
                />
              </div>

              {/* Specialized Form Fields Based on Question Type */}
              {activeQuestion.type === 'mcq' && (
                <div className="space-y-3 p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6]">
                    <span>Multiple Choice Options</span>
                    <span>Select circle to mark correct answer key</span>
                  </div>

                  <div className="space-y-2.5">
                    {(activeQuestion.options || ['Option A', 'Option B', 'Option C', 'Option D']).map(
                      (opt, optIdx) => {
                        const isCorrect = activeQuestion.correctAnswer === opt;
                        const letter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                              isCorrect
                                ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                                : 'border-[#CBBEAC]/70 dark:border-[#4d2b3b]/70 bg-[#F6F0E7]/60 dark:bg-[#1e0f18]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateActiveQuestion({
                                  ...activeQuestion,
                                  correctAnswer: opt,
                                })
                              }
                              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                                isCorrect
                                  ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'border-[#71685E] text-[#71685E] dark:text-[#c9b9a6] hover:border-[#292521]'
                              }`}
                              title="Mark as correct answer"
                            >
                              {letter}
                            </button>

                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updatedOpts = [
                                  ...(activeQuestion.options || ['A', 'B', 'C', 'D']),
                                ];
                                updatedOpts[optIdx] = e.target.value;
                                handleUpdateActiveQuestion({
                                  ...activeQuestion,
                                  options: updatedOpts,
                                  correctAnswer: isCorrect
                                    ? e.target.value
                                    : activeQuestion.correctAnswer,
                                });
                              }}
                              className="flex-1 text-base text-[#292521] dark:text-[#F6F0E7] bg-transparent outline-none font-serif"
                            />

                            {isCorrect && (
                              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                                Correct Key
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {activeQuestion.type === 'transformation' && (
                <div className="space-y-4 p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d]">
                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Original Sentence to Transform
                    </label>
                    <input
                      type="text"
                      value={activeQuestion.originalSentence || ''}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          originalSentence: e.target.value,
                        })
                      }
                      placeholder="e.g. As soon as the bell rang, the students left."
                      className="w-full text-base font-serif text-[#292521] dark:text-[#F6F0E7] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none focus:border-[#5A1832]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Transformation Instruction / Constraint
                    </label>
                    <input
                      type="text"
                      value={activeQuestion.transformationInstruction || ''}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          transformationInstruction: e.target.value,
                        })
                      }
                      placeholder="e.g. Begin with 'No sooner...'"
                      className="w-full text-[15px] font-mono font-medium text-[#5A1832] dark:text-[#C29A52] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none focus:border-[#5A1832]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Expected Transformed Response
                    </label>
                    <input
                      type="text"
                      value={activeQuestion.correctAnswer || ''}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          correctAnswer: e.target.value,
                        })
                      }
                      placeholder="e.g. No sooner did the bell ring than the students left."
                      className="w-full text-base font-serif font-bold text-emerald-800 dark:text-emerald-300 bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {activeQuestion.type === 'error_correction' && (
                <div className="space-y-4 p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d]">
                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Sentence Containing Grammatical Error
                    </label>
                    <input
                      type="text"
                      value={activeQuestion.originalSentence || ''}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          originalSentence: e.target.value,
                        })
                      }
                      placeholder="Enter specimen sentence with deliberate grammatical error..."
                      className="w-full text-base font-serif text-[#292521] dark:text-[#F6F0E7] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none focus:border-[#5A1832]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-mono text-red-700 dark:text-red-400 block mb-1.5 font-bold">
                        INCORRECT TOKEN / ERROR
                      </label>
                      <input
                        type="text"
                        value={activeQuestion.errorSnippet || ''}
                        onChange={(e) =>
                          handleUpdateActiveQuestion({
                            ...activeQuestion,
                            errorSnippet: e.target.value,
                          })
                        }
                        placeholder="e.g. was"
                        className="w-full text-[15px] font-mono text-red-700 dark:text-red-400 bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-red-300 dark:border-red-900/60 rounded-lg p-2.5 outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-emerald-700 dark:text-emerald-400 block mb-1.5 font-bold">
                        CORRECTION
                      </label>
                      <input
                        type="text"
                        value={activeQuestion.correctionSnippet || ''}
                        onChange={(e) =>
                          handleUpdateActiveQuestion({
                            ...activeQuestion,
                            correctionSnippet: e.target.value,
                          })
                        }
                        placeholder="e.g. were"
                        className="w-full text-[15px] font-mono text-emerald-700 dark:text-emerald-400 bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-emerald-300 dark:border-emerald-900/60 rounded-lg p-2.5 outline-none font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeQuestion.type === 'fill_in_blanks' && (
                <div className="space-y-4 p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d]">
                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Sentence with Blanks (use '______')
                    </label>
                    <input
                      type="text"
                      value={activeQuestion.blanksSentence || ''}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          blanksSentence: e.target.value,
                        })
                      }
                      placeholder="e.g. She ______ (wait) since two o'clock."
                      className="w-full text-base font-serif text-[#292521] dark:text-[#F6F0E7] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none focus:border-[#5A1832]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block mb-1.5">
                      Acceptable Answers (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        activeQuestion.acceptableAnswers
                            ? activeQuestion.acceptableAnswers.join(', ')
                            : activeQuestion.correctAnswer || ''
                      }
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim());
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          correctAnswer: arr[0] || '',
                          acceptableAnswers: arr,
                        });
                      }}
                      placeholder="has been waiting, had been waiting"
                      className="w-full text-[15px] font-mono text-emerald-700 dark:text-emerald-400 bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Answer Key & Marking Guidance (15-16px) */}
              <div className="space-y-2 p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d]">
                <label className="text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] block">
                  Prescriptive Marking Guidance &amp; Linguistic Rationale
                </label>
                <textarea
                  rows={3}
                  value={activeQuestion.explanation || ''}
                  onChange={(e) =>
                    handleUpdateActiveQuestion({
                      ...activeQuestion,
                      explanation: e.target.value,
                    })
                  }
                  placeholder="State linguistic rationale, acceptable variations, and mark deduction criteria..."
                  className="w-full text-[15.5px] text-[#292521] dark:text-[#F6F0E7] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg p-3 outline-none leading-relaxed"
                />
              </div>

              {/* Secondary Assessment Metadata Grid */}
              <div className="p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] space-y-3.5">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#71685E] dark:text-[#c9b9a6]">
                  Assessment Metadata &amp; Cognitive Classification
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-sm">
                  <div>
                    <label className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium block mb-1">
                      Marks Assigned
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={activeQuestion.marks}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          marks: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] outline-none font-semibold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium block mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={activeQuestion.difficulty}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          difficulty: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] outline-none font-semibold text-sm"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium block mb-1">
                      Cognitive Level (Bloom)
                    </label>
                    <select
                      value={activeQuestion.cognitiveLevel || 'Applying'}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          cognitiveLevel: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] outline-none font-semibold text-sm"
                    >
                      <option value="Remembering">Remembering</option>
                      <option value="Understanding">Understanding</option>
                      <option value="Applying">Applying</option>
                      <option value="Analysing">Analysing</option>
                      <option value="Evaluating">Evaluating</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium block mb-1">
                      Developmental Tier
                    </label>
                    <select
                      value={activeQuestion.tier || 'standard'}
                      onChange={(e) =>
                        handleUpdateActiveQuestion({
                          ...activeQuestion,
                          tier: e.target.value as DevelopmentalTier,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] outline-none capitalize font-semibold text-sm"
                    >
                      <option value="foundation">Foundation (Tier 1)</option>
                      <option value="standard">Standard (Tier 2)</option>
                      <option value="advanced">Advanced (Tier 3)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#F6F0E7] dark:bg-[#1e0f18]">
            <HelpCircle className="w-14 h-14 text-[#71685E] dark:text-[#c9b9a6] mb-3 opacity-60" />
            <h4 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              No Question Selected
            </h4>
            <p className="text-sm text-[#71685E] dark:text-[#c9b9a6] max-w-sm mt-1 mb-5 leading-relaxed">
              Select an item from the Question Index on the left or create a new question.
            </p>
            <button
              onClick={() => openCreateQuestionDialog('mcq')}
              className="h-11 px-6 rounded-xl text-sm font-bold bg-[#5A1832] hover:bg-[#35101F] text-white shadow-xs transition-colors cursor-pointer flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Reusable Veritas Create Question Dialog */}
      <CreateQuestionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        preselectedType={createDialogType}
        topics={currentBook.topics || []}
        selectedClass={selectedClass}
        targetBoard={seriesProject.targetBoard}
        onCreateQuestion={handleSaveNewQuestion}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
