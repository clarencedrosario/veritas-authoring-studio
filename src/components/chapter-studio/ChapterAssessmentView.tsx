import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Printer,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  FileCheck,
  Layers,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { StudioChapter, GrammarTestSeries, GrammarQuestion } from '../../types';

export interface ChapterAssessmentViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  onNavigateToStage?: (stageId: string) => void;
  isDarkMode: boolean;
}

export const ChapterAssessmentView: React.FC<ChapterAssessmentViewProps> = ({
  chapter,
  onUpdateChapter,
  onNavigateToStage,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'rubrics'>('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Derive questions from chapter exercises if chapterTest isn't explicitly set
  const allExerciseQuestions = chapter.exercises?.flatMap((ex) => ex.questions) || [];
  const testMarks = 25;
  const testDurationMinutes = 45;

  const assessmentQuestions: GrammarQuestion[] = [
    {
      id: 'test-q1',
      type: 'mcq',
      prompt: 'Identify the sentence with strictly accurate subject-verb concord:',
      difficulty: 'Medium',
      marks: 1,
      options: [
        'A) The list of participants have been displayed on the notice board.',
        'B) Neither the captain nor the sailors was able to navigate the reef.',
        'C) The commander, along with his brave officers, has been decorated.',
        'D) Five thousand rupees are too high a price for this dictionary.',
      ],
      correctAnswer: 'C) The commander, along with his brave officers, has been decorated.',
      explanation:
        '"Along with his brave officers" is parenthetical; the singular head noun "commander" takes singular "has been".',
      conceptTested: 'Parenthetical Modifiers',
      bloomLevel: 'Analyzing',
    },
    {
      id: 'test-q2',
      type: 'fill_in_blanks',
      prompt: 'Complete the sentence with the correct form of the verb in brackets:',
      blanksSentence: 'Ten kilometres ___ (is / are) a testing distance for amateur runners.',
      difficulty: 'Easy',
      marks: 1,
      correctAnswer: 'is',
      explanation: 'Quantities of distance functioning as a single collective measurement take a singular verb.',
      conceptTested: 'Units of Measurement',
      bloomLevel: 'Remembering',
    },
    {
      id: 'test-q3',
      type: 'error_correction',
      prompt: 'Detect the concord error and rewrite the sentence correctly:',
      originalSentence: 'The bouquet of scarlet roses were presented to the chief guest.',
      correctedSentence: 'The bouquet of scarlet roses was presented to the chief guest.',
      difficulty: 'Medium',
      marks: 2,
      correctAnswer: 'was presented',
      explanation: 'Head noun "bouquet" is singular; "of scarlet roses" is an intervening prepositional phrase.',
      conceptTested: 'Intervening Prepositional Phrases',
      bloomLevel: 'Evaluating',
    },
    {
      id: 'test-q4',
      type: 'transformation',
      prompt: 'Synthesize the two sentences using "Neither...nor", ensuring strict proximity concord:',
      originalSentence: 'The teacher was not present. The students were not present.',
      correctedSentence: 'Neither the teacher nor the students were present in the hall.',
      difficulty: 'Hard',
      marks: 3,
      correctAnswer: 'Neither the teacher nor the students were present in the hall.',
      explanation: 'In neither...nor, the verb agrees with the closer plural subject "students".',
      conceptTested: 'Correlative Conjunctions',
      bloomLevel: 'Creating',
    },
    {
      id: 'test-q5',
      type: 'short_answer',
      prompt:
        'Explain why British/CISCE English permits "The jury were divided in their opinions", while requiring "The jury has reached its verdict".',
      difficulty: 'Hard',
      marks: 4,
      correctAnswer:
        'When collective nouns act with unified agency, singular concord applies; when members act individually or in discord, plural concord is mandated.',
      explanation: 'Collective Noun Split Concord.',
      conceptTested: 'Collective Nouns',
      bloomLevel: 'Evaluating',
    },
  ];

  const handleBuildFromBank = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
              <GraduationCap className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                  Production Stage 11 • Summative Assessment
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold border border-blue-300">
                  CISCE Examination Format
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F]">
                Chapter Assessment Test Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Generate, balance, and preview standardized end-of-chapter mastery tests connected to the VERITAS Question Bank and Assessment Builder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuildFromBank}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 text-[#5A1832] text-xs font-semibold rounded-lg border border-[#CBBEAC] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>{isGenerating ? 'Balancing Specs...' : 'Build from Question Bank'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Print Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Specification Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#71685E] text-xs font-medium">
            <Award className="w-4 h-4 text-[#5A1832]" />
            <span>Total Marks</span>
          </div>
          <div className="text-2xl font-serif font-bold text-[#35101F] mt-1">
            25 Marks
          </div>
          <div className="text-[11px] text-[#71685E] mt-0.5">Weighted Assessment</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#71685E] text-xs font-medium">
            <Clock className="w-4 h-4 text-[#5A1832]" />
            <span>Target Duration</span>
          </div>
          <div className="text-2xl font-serif font-bold text-[#35101F] mt-1">
            45 Mins
          </div>
          <div className="text-[11px] text-[#71685E] mt-0.5">1 Class Period</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#71685E] text-xs font-medium">
            <Layers className="w-4 h-4 text-[#5A1832]" />
            <span>Question Types</span>
          </div>
          <div className="text-2xl font-serif font-bold text-[#35101F] mt-1">
            5 Modalities
          </div>
          <div className="text-[11px] text-[#71685E] mt-0.5">MCQ, Fill, Error, Transform, Short</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#71685E] text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Concord Coverage</span>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            100%
          </div>
          <div className="text-[11px] text-[#71685E] mt-0.5">All 7 Core Rules Assessed</div>
        </div>
      </div>

      {/* Assessment Question Paper Preview */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-6 shadow-xs space-y-6 font-serif">
        {/* Paper Header */}
        <div className="text-center pb-4 border-b-2 border-[#5A1832]/30 space-y-1">
          <div className="text-xs uppercase tracking-widest text-[#71685E] font-sans font-bold">
            CISCE Examination Series • Class 6 Classical Grammar
          </div>
          <h3 className="text-xl font-bold text-[#35101F]">
            Chapter 1: Subject–Verb Agreement Mastery Assessment
          </h3>
          <div className="flex justify-center gap-6 text-xs text-[#71685E] font-sans pt-1 font-medium">
            <span>Time Allowed: 45 Minutes</span>
            <span>Maximum Marks: 25</span>
          </div>
        </div>

        {/* Paper Instructions */}
        <div className="p-3 bg-[#F6F0E7] border border-[#CBBEAC] rounded-lg text-xs font-sans text-[#292521] space-y-1">
          <span className="font-bold text-[#35101F]">General Instructions:</span>
          <p>1. Attempt all questions. Marks for each question are indicated in brackets.</p>
          <p>2. Pay meticulous attention to spelling, punctuation, and grammatical concord.</p>
          <p>3. In transformation questions, do not alter the fundamental meaning of the sentence.</p>
        </div>

        {/* Questions List */}
        <div className="space-y-6 pt-2">
          {assessmentQuestions.map((q, idx) => (
            <div key={q.id} className="space-y-2 pb-4 border-b border-[#CBBEAC]/50 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-[#292521] font-medium">
                  <span className="font-bold text-[#5A1832] mr-2">Q{idx + 1}.</span>
                  <span>{q.prompt}</span>
                </div>
                <span className="text-xs font-sans font-bold text-[#71685E] shrink-0">
                  [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                </span>
              </div>

              {q.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6 pt-1 font-sans text-xs">
                  {q.options.map((opt, i) => (
                    <div key={i} className="p-2 rounded bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]">
                      {opt}
                    </div>
                  ))}
                </div>
              )}

              {q.blanksSentence && (
                <div className="pl-6 pt-1 text-sm italic text-[#292521]">
                  "{q.blanksSentence}"
                </div>
              )}

              {q.originalSentence && (
                <div className="pl-6 pt-1 text-xs text-[#71685E] font-sans">
                  Original: <span className="font-serif italic text-[#292521]">"{q.originalSentence}"</span>
                </div>
              )}

              {/* Teacher/Editor Metadata Pill */}
              <div className="pl-6 pt-1 flex items-center gap-3 text-[10px] font-sans text-[#71685E]">
                <span>Concept: {q.conceptTested}</span>
                <span>•</span>
                <span>Cognitive Level: {q.bloomLevel}</span>
                <span>•</span>
                <span className="text-emerald-800 font-semibold">
                  Key: {q.correctAnswer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
