import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  FileText,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  Layers,
  Copy,
  Printer,
} from 'lucide-react';
import { StudioChapter, GrammarQuestion, GrammarTestSeries, GrammarTestSection } from '../../types';

export type AssessmentPaper = Omit<GrammarTestSeries, 'classLevel'> & {
  classLevel?: any;
  targetClass?: string;
};
export type AssessmentSection = GrammarTestSection;

export interface ChapterAssessmentViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  onNavigateToStage?: (stage: string) => void;
  isDarkMode?: boolean;
}

export const ChapterAssessmentView: React.FC<ChapterAssessmentViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  onNavigateToStage,
  isDarkMode = false,
}) => {
  // Active academic context from chapter and seriesProject
  const chapterAny = chapter as any;
  const activeClassLevel = useMemo(() => {
    return (
      chapterAny.targetClass ||
      chapterAny.classLevel ||
      seriesProject?.selectedClass ||
      'Class 6'
    );
  }, [chapterAny.targetClass, chapterAny.classLevel, seriesProject?.selectedClass]);

  const activeBoard = useMemo(() => {
    return (
      chapterAny.curriculumFramework ||
      chapterAny.board ||
      chapterAny.curriculumBoard ||
      seriesProject?.activeSystemId ||
      seriesProject?.targetBoard ||
      'CISCE'
    );
  }, [
    chapterAny.curriculumFramework,
    chapterAny.board,
    chapterAny.curriculumBoard,
    seriesProject?.activeSystemId,
    seriesProject?.targetBoard,
  ]);

  const activeSubject = useMemo(() => {
    return chapterAny.subject || seriesProject?.subject || 'Academic Studies';
  }, [chapterAny.subject, seriesProject]);

  const isGrammar = /grammar|syntax|english language/i.test(chapter.category || '') || /grammar/i.test(activeSubject);
  const isMath = /math/i.test(chapter.category || '') || /math/i.test(activeSubject);
  const isScience = /science|biology|physics|chemistry/i.test(chapter.category || '') || /science|biology|physics|chemistry/i.test(activeSubject);
  const isHistory = /history|civics|social/i.test(chapter.category || '') || /history|civics|social/i.test(activeSubject);

  // Read or initialize canonical assessment test
  const activeTest = chapter.chapterTest;

  const [activeTab, setActiveTab] = useState<'paper' | 'rubrics' | 'stats'>('paper');
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Question editing / adding modal state
  const [editingQuestion, setEditingQuestion] = useState<GrammarQuestion | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<string>('sec-a');

  // Helper to persist test updates
  const persistTest = (test: AssessmentPaper) => {
    onUpdateChapter({
      ...chapter,
      chapterTest: {
        ...test,
        classLevel: (test.classLevel || test.targetClass || activeClassLevel || 'Class 6') as any,
      },
      lastSaved: new Date().toISOString(),
    });
  };

  // 1. Create Assessment Button handler (prevent double-clicks, initialize canonical paper)
  const handleCreateAssessment = () => {
    if (isCreatingTest) return;
    setIsCreatingTest(true);

    const defaultSections: AssessmentSection[] = [
      {
        id: 'sec-a',
        title: 'Section A: Objective Questions',
        instructions: 'Answer all questions in this section.',
        marksAllocation: 10,
        questions: [],
      },
      {
        id: 'sec-b',
        title: 'Section B: Short Answer Questions',
        instructions: 'Answer all questions in this section.',
        marksAllocation: 15,
        questions: [],
      },
    ];

    const newPaper: AssessmentPaper = {
      id: `paper-${Date.now()}`,
      title: `${chapter.title} — Chapter Mastery Assessment`,
      targetClass: activeClassLevel,
      totalMarks: 25,
      durationMinutes: 45,
      instructions: [
        'Attempt all questions carefully.',
        'Marks for each question are indicated in brackets against it.',
        isGrammar
          ? 'Adhere strictly to standard grammatical concord and correct orthography.'
          : isMath
          ? 'Show all intermediate working steps, formulae, and units clearly.'
          : isScience
          ? 'State scientific principles, equations, and units wherever applicable.'
          : isHistory
          ? 'Support your answers with historical evidence, chronology, and key terms.'
          : 'Answer clearly and justify your answers where required.',
        isGrammar
          ? 'Do not alter the fundamental meaning in sentence transformation questions.'
          : 'Review all completed solutions before submission.',
      ],
      boardTarget: activeBoard,
      sections: defaultSections,
    };

    persistTest(newPaper);
    setIsCreatingTest(false);
  };

  // 2. Generate Assessment with AI
  const handleAiGenerateAssessment = async () => {
    setIsAiGenerating(true);
    setErrorMessage(null);

    const topic = chapter.title || 'Subject-Verb Agreement';
    if (!activeClassLevel || !activeBoard) {
      setErrorMessage('Academic project context (Class Level and Curriculum Board) is required.');
      setIsAiGenerating(false);
      return;
    }

    try {
      const res = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-21',
          topic,
          classLevel: activeClassLevel,
          board: activeBoard,
          subject: activeSubject,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI generation could not be completed. Your existing content has not been changed.');
      }

      const generatedTest = data.data;
      if (generatedTest && generatedTest.sections) {
        const fullPaper: AssessmentPaper = {
          id: `paper-ai-${Date.now()}`,
          title: generatedTest.title || `${topic} — Mastery Assessment Test`,
          targetClass: activeClassLevel,
          totalMarks: generatedTest.totalMarks || 25,
          durationMinutes: generatedTest.durationMinutes || 45,
          instructions: generatedTest.instructions || [
            'Read each question carefully before attempting.',
            'Marks for each question are indicated against it.',
            'Maintain grammatical concord and clean presentation.',
          ],
          boardTarget: activeBoard,
          sections: generatedTest.sections.map((sec: any, sIdx: number) => ({
            id: sec.id || `sec-${sIdx + 1}`,
            title: sec.title || `Section ${String.fromCharCode(65 + sIdx)}`,
            instructions: sec.instructions || 'Attempt all questions in this section.',
            marksAllocation: sec.marksAllocation || 10,
            questions: (sec.questions || []).map((q: any, qIdx: number) => ({
              id: q.id || `q-ai-${sIdx}-${qIdx}`,
              type: q.type || 'mcq',
              prompt: q.prompt || '',
              options: q.options || undefined,
              blanksSentence: q.blanksSentence || undefined,
              originalSentence: q.originalSentence || undefined,
              correctAnswer: q.correctAnswer || '',
              explanation: q.explanation || '',
              marks: q.marks || 1,
              difficulty: q.difficulty || 'Medium',
              cognitiveLevel: q.cognitiveLevel || 'Applying',
              conceptTested: q.conceptTested || topic,
            })),
          })),
        };
        persistTest(fullPaper);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'AI generation could not be completed. Your existing content has not been changed.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 3. Import Questions from Chapter Exercises
  const handleImportFromExercises = () => {
    const exerciseQuestions = chapter.exercises?.flatMap((ex) => ex.questions) || [];
    if (exerciseQuestions.length === 0) {
      setErrorMessage('No questions found in chapter exercises to import.');
      return;
    }

    const importedPaper: AssessmentPaper = {
      id: `paper-imp-${Date.now()}`,
      title: `${chapter.title} — Cumulative Assessment`,
      targetClass: activeClassLevel,
      totalMarks: exerciseQuestions.reduce((sum, q) => sum + (q.marks || 1), 0),
      durationMinutes: 45,
      instructions: [
        'Attempt all questions.',
        'Marks are indicated against each question.',
        'Review your answers thoroughly before submission.',
      ],
      boardTarget: activeBoard,
      sections: [
        {
          id: 'sec-a',
          title: 'Section A: Exercise Pool Assessment',
          instructions: 'Standard chapter assessment derived from exercise repertoire.',
          marksAllocation: exerciseQuestions.reduce((sum, q) => sum + (q.marks || 1), 0),
          questions: exerciseQuestions.slice(0, 10).map((q, idx) => ({
            ...q,
            id: `imp-${q.id || idx}`,
          })),
        },
      ],
    };

    persistTest(importedPaper);
  };

  // Question Management Helpers
  const handleMoveQuestion = (sectionId: string, qIndex: number, direction: 'up' | 'down') => {
    if (!activeTest) return;
    const updatedSections = activeTest.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const targetIdx = direction === 'up' ? qIndex - 1 : qIndex + 1;
      if (targetIdx < 0 || targetIdx >= sec.questions.length) return sec;
      const reordered = [...sec.questions];
      const temp = reordered[qIndex];
      reordered[qIndex] = reordered[targetIdx];
      reordered[targetIdx] = temp;
      return { ...sec, questions: reordered };
    });
    persistTest({ ...activeTest, sections: updatedSections });
  };

  const handleDeleteQuestion = (sectionId: string, qId: string) => {
    if (!activeTest) return;
    const updatedSections = activeTest.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        questions: sec.questions.filter((q) => q.id !== qId),
      };
    });
    persistTest({ ...activeTest, sections: updatedSections });
  };

  const handleSaveQuestion = (sectionId: string, question: GrammarQuestion) => {
    if (!activeTest) return;
    const updatedSections = activeTest.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const exists = sec.questions.some((q) => q.id === question.id);
      let newQuestions: GrammarQuestion[];
      if (exists) {
        newQuestions = sec.questions.map((q) => (q.id === question.id ? question : q));
      } else {
        newQuestions = [...sec.questions, question];
      }
      return { ...sec, questions: newQuestions };
    });
    persistTest({ ...activeTest, sections: updatedSections });
    setEditingQuestion(null);
    setIsAddingQuestion(false);
  };

  // Compute stats
  const allQuestions = activeTest ? activeTest.sections.flatMap((s) => s.questions) : [];
  const calculatedTotalMarks = allQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

  // If no test is created yet, show the action launchpad
  if (!activeTest || activeTest.sections.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-8 h-8 text-[#C29A52]" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
              Component 21 • Summative Mastery Assessment
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#35101F]">
              No Assessment Paper Configured for {chapter.title}
            </h2>
            <p className="text-xs text-[#71685E] leading-relaxed">
              Create a standardized, tiered examination paper measuring learner retention, transfer, and syntactic precision aligned to {activeBoard} ({activeClassLevel}).
            </p>
          </div>

          {errorMessage && (
            <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAiGenerateAssessment}
                  className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-semibold text-xs cursor-pointer transition-colors"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={handleCreateAssessment}
                  className="px-2.5 py-1 bg-[#5A1832] hover:bg-[#35101F] text-white rounded font-semibold text-xs cursor-pointer transition-colors"
                >
                  Write Manually
                </button>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="px-2 py-1 text-amber-800 hover:text-amber-950 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* Primary Action: + Create Assessment */}
            <button
              type="button"
              onClick={handleCreateAssessment}
              disabled={isCreatingTest}
              className="h-11 px-6 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C29A52]" />
              <span>+ Create Assessment Test</span>
            </button>

            {/* Secondary Action: Generate with AI */}
            <button
              type="button"
              onClick={handleAiGenerateAssessment}
              disabled={isAiGenerating}
              className="h-11 px-5 rounded-xl bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 border border-[#CBBEAC] text-[#5A1832] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#C29A52]" />
              <span>{isAiGenerating ? 'Generating 25-Mark Paper...' : 'Generate Test with AI'}</span>
            </button>

            {/* Tertiary Action: Import from Exercises */}
            <button
              type="button"
              onClick={handleImportFromExercises}
              className="h-11 px-5 rounded-xl bg-[#FFFDF8] hover:bg-[#F6F0E7] border border-[#CBBEAC] text-[#71685E] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-[#71685E]" />
              <span>Import from Chapter Exercises</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
            <GraduationCap className="w-5 h-5 text-[#C29A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                Component 21 • Mastery Assessment
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] font-semibold border border-[#CBBEAC]">
                {activeBoard} • {activeClassLevel}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#35101F]">
              {activeTest.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-[#71685E] mt-0.5">
              <span className="flex items-center gap-1 font-mono font-medium">
                <Clock className="w-3.5 h-3.5 text-[#C29A52]" />
                {activeTest.durationMinutes || 45} Mins
              </span>
              <span className="flex items-center gap-1 font-mono font-medium">
                <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                {calculatedTotalMarks} / {activeTest.totalMarks || 25} Marks
              </span>
              <span>•</span>
              <span>{allQuestions.length} Questions across {activeTest.sections.length} Section(s)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Student vs Teacher Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsTeacherView(!isTeacherView)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isTeacherView
                ? 'bg-[#5A1832] border-[#5A1832] text-[#FFFDF8]'
                : 'bg-[#FFFDF8] border-[#CBBEAC] text-[#5A1832] hover:bg-[#EDE4D6]'
            }`}
          >
            {isTeacherView ? <Eye className="w-3.5 h-3.5 text-[#C29A52]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isTeacherView ? 'Teacher Edition (Full Marking Key)' : 'Student Edition (Exam Paper)'}</span>
          </button>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={() => {
              setTargetSectionId(activeTest.sections[0]?.id || 'sec-a');
              setEditingQuestion({
                id: `q-${Date.now()}`,
                type: 'mcq',
                prompt: '',
                options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
                correctAnswer: '',
                explanation: '',
                marks: 1,
                difficulty: 'Medium',
                cognitiveLevel: 'Applying',
                conceptTested: chapter.title,
              });
              setIsAddingQuestion(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>+ Add Question</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#CBBEAC] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('paper')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'paper'
              ? 'bg-[#FFFDF8] text-[#5A1832] border-t-2 border-x border-[#CBBEAC]'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
        >
          Assessment Question Paper
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rubrics')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
            activeTab === 'rubrics'
              ? 'bg-[#FFFDF8] text-[#5A1832] border-t-2 border-x border-[#CBBEAC]'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
        >
          Evaluation Rubrics &amp; Marking Scheme
        </button>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAiGenerateAssessment}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-semibold text-xs cursor-pointer transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingQuestion(true);
                setErrorMessage(null);
              }}
              className="px-2.5 py-1 bg-[#5A1832] hover:bg-[#35101F] text-white rounded font-semibold text-xs cursor-pointer transition-colors"
            >
              Write Manually
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 text-amber-800 hover:text-amber-950 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Paper */}
      {activeTab === 'paper' && (
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-6 shadow-xs space-y-6 font-serif">
          {/* Formal Exam Banner */}
          <div className="text-center pb-4 border-b-2 border-[#5A1832]/30 space-y-1">
            <div className="text-xs uppercase tracking-widest text-[#71685E] font-sans font-bold">
              {activeBoard} Examination Standards • {activeClassLevel}
            </div>
            <h3 className="text-xl font-bold text-[#35101F]">
              {activeTest.title}
            </h3>
            <div className="flex justify-center gap-6 text-xs text-[#71685E] font-sans pt-1 font-medium">
              <span>Time Allowed: {activeTest.durationMinutes || 45} Minutes</span>
              <span>Maximum Marks: {calculatedTotalMarks}</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3 bg-[#F6F0E7] border border-[#CBBEAC] rounded-lg text-xs font-sans text-[#292521] space-y-1">
            <span className="font-bold text-[#35101F]">General Examination Instructions:</span>
            {activeTest.instructions.map((inst, idx) => (
              <p key={idx}>{idx + 1}. {inst}</p>
            ))}
          </div>

          {/* Sections & Questions */}
          <div className="space-y-8 pt-2">
            {activeTest.sections.map((sec, secIdx) => (
              <div key={sec.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-[#5A1832]/20 pb-2">
                  <div>
                    <h4 className="text-base font-serif font-bold text-[#35101F]">
                      {sec.title}
                    </h4>
                    {sec.instructions && (
                      <p className="text-xs font-sans text-[#71685E] italic">
                        {sec.instructions}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832]">
                    Allocated: {sec.questions.reduce((s, q) => s + (q.marks || 1), 0)} Marks
                  </span>
                </div>

                {/* Questions */}
                <div className="space-y-5">
                  {sec.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="group relative bg-[#FFFDF8] hover:bg-[#FDFBF7] p-4 rounded-lg border border-[#CBBEAC]/60 transition-all space-y-2.5"
                    >
                      {/* Top question line */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm text-[#292521] font-medium leading-relaxed">
                          <span className="font-bold text-[#5A1832] mr-2">
                            Q{qIdx + 1}.
                          </span>
                          <span>{q.prompt}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-sans font-bold text-[#71685E]">
                            [{q.marks || 1} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </span>

                          {/* Reorder & Action Controls */}
                          <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(sec.id, qIdx, 'up')}
                              disabled={qIdx === 0}
                              className="p-1 text-[#71685E] hover:text-[#5A1832] disabled:opacity-20 cursor-pointer"
                              title="Move Question Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(sec.id, qIdx, 'down')}
                              disabled={qIdx === sec.questions.length - 1}
                              className="p-1 text-[#71685E] hover:text-[#5A1832] disabled:opacity-20 cursor-pointer"
                              title="Move Question Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetSectionId(sec.id);
                                setEditingQuestion(q);
                                setIsAddingQuestion(false);
                              }}
                              className="p-1 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                              title="Edit Question"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(sec.id, q.id)}
                              className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Blanks format */}
                      {q.blanksSentence && (
                        <div className="pl-6 pt-1 text-sm italic text-[#292521]">
                          "{q.blanksSentence}"
                        </div>
                      )}

                      {/* Original Sentence for error correction / transformation */}
                      {q.originalSentence && (
                        <div className="pl-6 pt-1 text-xs text-[#71685E] font-sans">
                          Specimen: <span className="font-serif italic text-[#292521]">"{q.originalSentence}"</span>
                        </div>
                      )}

                      {/* Multiple Choice Options */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1 font-sans text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded border transition-colors ${
                                isTeacherView && q.correctAnswer && opt.includes(q.correctAnswer)
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                  : 'bg-[#F6F0E7] border-[#CBBEAC] text-[#292521]'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Student Edition Write-in lines */}
                      {!isTeacherView && (
                        <div className="pl-6 pt-2 space-y-2">
                          <div className="border-b border-dashed border-[#CBBEAC] h-6" />
                          {q.marks && q.marks > 1 && (
                            <div className="border-b border-dashed border-[#CBBEAC] h-6" />
                          )}
                        </div>
                      )}

                      {/* Teacher Edition Answer Key & Explanation Pill */}
                      {isTeacherView && (
                        <div className="pl-6 pt-2 space-y-1.5 font-sans">
                          <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center gap-2">
                            <span className="font-bold uppercase tracking-wider text-emerald-900 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">
                              Answer Key:
                            </span>
                            <span className="font-serif font-bold text-sm">
                              {q.correctAnswer}
                            </span>
                          </div>
                          {q.explanation && (
                            <p className="text-[11px] text-[#71685E] italic pl-1">
                              <span className="font-semibold not-italic">Rationale: </span>
                              {q.explanation}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-[#71685E] pt-0.5">
                            <span>Concept: {q.conceptTested || chapter.title}</span>
                            <span>•</span>
                            <span>Cognitive Level: {q.bloomLevel || q.cognitiveLevel || 'Applying'}</span>
                            <span>•</span>
                            <span>Difficulty: {q.difficulty || 'Medium'}</span>
                          </div>
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

      {/* Tab Content: Rubrics */}
      {activeTab === 'rubrics' && (
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-[#CBBEAC] pb-3">
            <h3 className="text-lg font-serif font-bold text-[#35101F]">
              Comprehensive Evaluation Rubrics &amp; Marking Guidance
            </h3>
            <p className="text-xs text-[#71685E] mt-0.5">
              Standardized objective and subjective marking bands ensuring uniform grading criteria across evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase">
                Full Marks (100%)
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed font-serif">
                {isGrammar
                  ? 'Exact grammatical concord strictly applied. No orthographic or punctuation errors. Sentence retains original semantic intent in transformations.'
                  : isMath
                  ? 'Complete and mathematically accurate working shown. Correct formula applied, algebraic precision maintained, and final answer with correct units.'
                  : isScience
                  ? 'Accurate scientific terminology and principles stated. Precise diagrams/equations provided with correct units and systematic reasoning.'
                  : isHistory
                  ? 'Comprehensive and factually accurate response with relevant dates, causation factors, and contextual significance demonstrated.'
                  : 'Complete, accurate response satisfying all question criteria with systematic reasoning and precise domain terminology.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase">
                Partial Credit (50%)
              </span>
              <p className="text-xs text-amber-950 leading-relaxed font-serif">
                {isGrammar
                  ? 'Correct finite verb identified, but minor transcription or punctuation slip. Proximity concord recognized in correlative conjunctions with partial syntactic error.'
                  : isMath
                  ? 'Correct method and formula applied, but minor arithmetic calculation error or missing final units.'
                  : isScience
                  ? 'Correct scientific concept recognized, but incomplete explanation of mechanism or minor omissions in step reasoning.'
                  : isHistory
                  ? 'Accurate historical facts cited, but limited depth in analysis of causation or incomplete chronologic sequence.'
                  : 'Partially accurate response demonstrating fundamental understanding with minor procedural or explanatory gaps.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 uppercase">
                Zero Credit (0%)
              </span>
              <p className="text-xs text-rose-950 leading-relaxed font-serif">
                {isGrammar
                  ? 'Failure of grammatical concord. Selecting the distractor option. Altering the core grammatical meaning of the specimen sentence.'
                  : isMath
                  ? 'Incorrect formula, flawed mathematical reasoning, or complete misunderstanding of the problem statement.'
                  : isScience
                  ? 'Factually incorrect scientific assertions, false mechanisms, or failure to address the core prompt.'
                  : isHistory
                  ? 'Historically inaccurate facts, erroneous chronologies, or unrelated assertions.'
                  : 'Incorrect response displaying fundamental misconceptions or failing to address the question prompt.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {(isAddingQuestion || editingQuestion) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-3">
              <h3 className="text-base font-serif font-bold text-[#35101F]">
                {isAddingQuestion ? 'Add New Assessment Question' : 'Edit Assessment Question'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingQuestion(false);
                }}
                className="text-[#71685E] hover:text-[#5A1832] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingQuestion && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#5A1832] block mb-1">
                    Question Type:
                  </label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, type: e.target.value as any })
                    }
                    className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                  >
                    <option value="mcq">Multiple Choice Question (MCQ)</option>
                    <option value="fill_in_blanks">Fill in Blanks</option>
                    <option value="error_correction">Error Correction</option>
                    <option value="transformation">Sentence Transformation</option>
                    <option value="short_answer">Short Answer / Subjective</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#5A1832] block mb-1">
                    Question Prompt:
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.prompt}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, prompt: e.target.value })
                    }
                    placeholder="Enter examination question prompt..."
                    className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif"
                  />
                </div>

                {editingQuestion.type === 'fill_in_blanks' && (
                  <div>
                    <label className="font-bold text-[#5A1832] block mb-1">
                      Blanks Sentence (e.g. "The cat ___ [sleep/sleeps]"):
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.blanksSentence || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, blanksSentence: e.target.value })
                      }
                      className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5A1832] block mb-1">Marks:</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editingQuestion.marks || 1}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          marks: parseInt(e.target.value, 10) || 1,
                        })
                      }
                      className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#5A1832] block mb-1">Difficulty:</label>
                    <select
                      value={editingQuestion.difficulty || 'Medium'}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          difficulty: e.target.value as any,
                        })
                      }
                      className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-emerald-900 block mb-1">
                    Verified Correct Answer:
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.correctAnswer || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })
                    }
                    placeholder="Exact correct answer key..."
                    className="w-full p-2 rounded-lg bg-emerald-50/70 border border-emerald-300 text-emerald-950 font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#5A1832] block mb-1">
                    Teacher Explanation / Grammatical Rationale:
                  </label>
                  <textarea
                    rows={2}
                    value={editingQuestion.explanation || ''}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                    }
                    placeholder="Pedagogical explanation justifying the answer..."
                    className="w-full p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#CBBEAC]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingQuestion(null);
                      setIsAddingQuestion(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#71685E] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveQuestion(targetSectionId, editingQuestion)}
                    className="px-4 py-2 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-white font-bold cursor-pointer"
                  >
                    Save Question
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
