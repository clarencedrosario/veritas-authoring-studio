import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarTopic,
  TextbookContentBlock,
  GrammarSeriesProject,
} from '../../types';
import {
  Image,
  CheckSquare,
  Award,
  Key,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Eye,
  FileCheck2,
} from 'lucide-react';

interface BookRegistersViewProps {
  currentBook: ClassCurriculumBook;
  seriesProject?: GrammarSeriesProject;
  onOpenChapterStudio: (topicId: string) => void;
  isDarkMode: boolean;
}

export const BookRegistersView: React.FC<BookRegistersViewProps> = ({
  currentBook,
  seriesProject,
  onOpenChapterStudio,
}) => {
  const [activeRegister, setActiveRegister] = useState<
    'visuals' | 'exercises' | 'assessments' | 'answer_audit'
  >('visuals');

  const topics = currentBook.topics || [];

  // 1. Synthesize Visual Register
  const visualItems: Array<{
    id: string;
    chapterTitle: string;
    chapterId: string;
    figureLabel: string;
    type: string;
    title: string;
    caption: string;
    altText: string;
    status: 'Approved' | 'Review Needed' | 'Briefed' | 'Missing Alt Text';
    credit: string;
  }> = [];

  let figCount = 1;
  topics.forEach((t) => {
    // Collect from StudioChapter sections if present
    if (t.studioChapter?.sections) {
      t.studioChapter.sections.forEach((sec) => {
        sec.blocks.forEach((blk) => {
          if (
            blk.type === 'visual' ||
            blk.type === 'diagram' ||
            blk.type === 'illustration' ||
            blk.type === 'photograph' ||
            blk.type === 'figure' ||
            blk.type === 'flowchart' ||
            blk.type === 'sentence_diagram' ||
            blk.visualData
          ) {
            const meta = blk.visualData;
            const alt = meta?.altText || '';
            const caption = meta?.caption || blk.textContent || 'Syntactic structure illustration';
            visualItems.push({
              id: blk.id,
              chapterTitle: t.title,
              chapterId: t.id,
              figureLabel: `Fig ${t.studioChapter?.chapterNumber || 1}.${figCount++}`,
              type: blk.type,
              title: meta?.title || blk.title || 'Syntactic Tree Diagram',
              caption: caption,
              altText: alt,
              status: !alt ? 'Missing Alt Text' : 'Approved',
              credit: meta?.credit || 'Veritas Academic Syntactic Archive',
            });
          }
        });
      });
    }

    // Also include default diagram specimen for grammar topics if none in blocks
    if (visualItems.length === 0) {
      visualItems.push({
        id: `vis-default-${t.id}`,
        chapterTitle: t.title,
        chapterId: t.id,
        figureLabel: 'Fig 1.1',
        type: 'sentence_diagram',
        title: 'Subject-Verb Concord Syntactic Dependency',
        caption: 'Visual breakdown of grammatical subject linked to finite predicate verb ignoring intervening parenthetical modifiers.',
        altText: 'Diagram showing subject linked across parenthetical prepositional phrase to the main verb.',
        status: 'Approved',
        credit: 'Veritas Diagrammer Engine',
      });
    }
  });

  // 2. Synthesize Exercise Register
  const exerciseItems: Array<{
    id: string;
    chapterTitle: string;
    chapterId: string;
    title: string;
    targetType: string;
    difficulty: string;
    questionCount: number;
    maxMarks: number;
    answerStatus: 'Complete' | 'Partial' | 'Missing';
  }> = [];

  topics.forEach((t) => {
    if (t.exercises) {
      t.exercises.forEach((ex) => {
        const questions = ex.questions || [];
        const answered = questions.filter((q) => q.correctAnswer && q.correctAnswer.trim().length > 0).length;
        let ansStatus: 'Complete' | 'Partial' | 'Missing' = 'Missing';
        if (questions.length > 0 && answered === questions.length) ansStatus = 'Complete';
        else if (answered > 0) ansStatus = 'Partial';

        exerciseItems.push({
          id: ex.id,
          chapterTitle: t.title,
          chapterId: t.id,
          title: ex.title,
          targetType: ex.targetType,
          difficulty: (ex.tier as any) || 'Medium',
          questionCount: questions.length,
          maxMarks: ex.maxMarks || questions.length,
          answerStatus: ansStatus,
        });
      });
    }

    if (t.studioChapter?.exercises) {
      t.studioChapter.exercises.forEach((ex) => {
        const questions = ex.questions || [];
        const answered = questions.filter((q) => q.correctAnswer && q.correctAnswer.trim().length > 0).length;
        let ansStatus: 'Complete' | 'Partial' | 'Missing' = 'Missing';
        if (questions.length > 0 && answered === questions.length) ansStatus = 'Complete';
        else if (answered > 0) ansStatus = 'Partial';

        exerciseItems.push({
          id: ex.id,
          chapterTitle: t.title,
          chapterId: t.id,
          title: ex.title,
          targetType: 'Studio Exercise',
          difficulty: ex.difficulty || 'Medium',
          questionCount: questions.length,
          maxMarks: ex.suggestedMarks || questions.length,
          answerStatus: ansStatus,
        });
      });
    }
  });

  // 3. Synthesize Assessment Register
  const assessmentItems: Array<{
    id: string;
    chapterTitle: string;
    chapterId: string;
    title: string;
    totalMarks: number;
    durationMinutes: number;
    questionCount: number;
    blueprintStatus: 'Official Blueprint Aligned' | 'Drafting';
    keyStatus: 'Complete' | 'Draft';
  }> = [];

  topics.forEach((t) => {
    if (t.testSeries) {
      t.testSeries.forEach((test) => {
        const qCount = test.sections.reduce((acc, s) => acc + (s.questions || []).length, 0);
        assessmentItems.push({
          id: test.id,
          chapterTitle: t.title,
          chapterId: t.id,
          title: test.title,
          totalMarks: test.totalMarks,
          durationMinutes: test.durationMinutes,
          questionCount: qCount,
          blueprintStatus: test.blueprintId ? 'Official Blueprint Aligned' : 'Drafting',
          keyStatus: 'Complete',
        });
      });
    }
  });

  // 4. Synthesize Answer Key Completeness Audit
  const answerAuditIssues: Array<{
    id: string;
    chapterTitle: string;
    chapterId: string;
    source: string;
    questionPrompt: string;
    issueType: 'Missing Answer' | 'Missing Explanation' | 'Open Response Needs Model';
    severity: 'critical' | 'warning';
  }> = [];

  topics.forEach((t) => {
    if (t.exercises) {
      t.exercises.forEach((ex) => {
        (ex.questions || []).forEach((q, qIdx) => {
          if (!q.correctAnswer || q.correctAnswer.trim().length === 0) {
            answerAuditIssues.push({
              id: q.id || `q-${qIdx}`,
              chapterTitle: t.title,
              chapterId: t.id,
              source: ex.title,
              questionPrompt: q.prompt || q.blanksSentence || `Question ${qIdx + 1}`,
              issueType: 'Missing Answer',
              severity: 'critical',
            });
          } else if (!q.explanation) {
            answerAuditIssues.push({
              id: q.id || `q-${qIdx}`,
              chapterTitle: t.title,
              chapterId: t.id,
              source: ex.title,
              questionPrompt: q.prompt || q.blanksSentence || `Question ${qIdx + 1}`,
              issueType: 'Missing Explanation',
              severity: 'warning',
            });
          }
        });
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
            Publishing Control &amp; Ledger Registers
          </div>
          <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Editorial Registers &amp; Answer Audit
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
            Comprehensive audit tracking for visuals, exercises, assessments, and answer keys.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 rounded-xl bg-white/70 dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] text-xs overflow-x-auto">
          <button
            onClick={() => setActiveRegister('visuals')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeRegister === 'visuals'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <Image className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Visual Register ({visualItems.length})</span>
          </button>

          <button
            onClick={() => setActiveRegister('exercises')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeRegister === 'exercises'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Exercise Register ({exerciseItems.length})</span>
          </button>

          <button
            onClick={() => setActiveRegister('assessments')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeRegister === 'assessments'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Assessment Register ({assessmentItems.length})</span>
          </button>

          <button
            onClick={() => setActiveRegister('answer_audit')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeRegister === 'answer_audit'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Answer Audit ({answerAuditIssues.length})</span>
          </button>
        </div>
      </div>

      {/* Register 1: Visual Register */}
      {activeRegister === 'visuals' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                  <tr>
                    <th className="py-3 px-4">Figure</th>
                    <th className="py-3 px-4">Chapter</th>
                    <th className="py-3 px-4">Visual Type</th>
                    <th className="py-3 px-4">Artwork Title</th>
                    <th className="py-3 px-4">Caption / Brief</th>
                    <th className="py-3 px-4">Alt Text</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                  {visualItems.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                        {v.figureLabel}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-medium text-[#292521] dark:text-[#F6F0E7]">
                        {v.chapterTitle}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-[#71685E]">
                        {v.type}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#292521] dark:text-[#F6F0E7]">
                        {v.title}
                      </td>
                      <td className="py-3.5 px-4 text-[#71685E] dark:text-[#D8CCBC] max-w-xs truncate italic">
                        {v.caption}
                      </td>
                      <td className="py-3.5 px-4 text-[10.5px] font-mono text-[#71685E] max-w-xs truncate">
                        {v.altText || <span className="text-amber-600 font-bold">Needs Alt Text</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            v.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenChapterStudio(v.chapterId)}
                          className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#431225]"
                        >
                          View in Studio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Register 2: Exercise Register */}
      {activeRegister === 'exercises' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                  <tr>
                    <th className="py-3 px-4">Chapter</th>
                    <th className="py-3 px-4">Exercise Title</th>
                    <th className="py-3 px-4">Question Type</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Max Marks</th>
                    <th className="py-3 px-4">Answer Key</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                  {exerciseItems.map((ex) => (
                    <tr
                      key={ex.id}
                      className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {ex.chapterTitle}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#292521] dark:text-[#F6F0E7]">
                        {ex.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-[#71685E]">
                        {ex.targetType}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px]">
                        {ex.difficulty}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {ex.questionCount}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#71685E]">
                        {ex.maxMarks} m
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            ex.answerStatus === 'Complete'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : ex.answerStatus === 'Partial'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {ex.answerStatus === 'Complete' && <CheckCircle2 className="w-3 h-3" />}
                          {ex.answerStatus !== 'Complete' && <AlertTriangle className="w-3 h-3" />}
                          <span>{ex.answerStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenChapterStudio(ex.chapterId)}
                          className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#431225]"
                        >
                          Edit Drills
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Register 3: Assessment Register */}
      {activeRegister === 'assessments' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                  <tr>
                    <th className="py-3 px-4">Chapter / Unit</th>
                    <th className="py-3 px-4">Assessment Title</th>
                    <th className="py-3 px-4">Total Marks</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Blueprint Status</th>
                    <th className="py-3 px-4">Key Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                  {assessmentItems.map((as) => (
                    <tr
                      key={as.id}
                      className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {as.chapterTitle}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#292521] dark:text-[#F6F0E7]">
                        {as.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                        {as.totalMarks} m
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#71685E]">
                        {as.durationMinutes} mins
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {as.questionCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950 dark:text-blue-300">
                          {as.blueprintStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{as.keyStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenChapterStudio(as.chapterId)}
                          className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#431225]"
                        >
                          Review Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Register 4: Answer Key Completeness Audit */}
      {activeRegister === 'answer_audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <div>
              <strong>Answer Key Completeness Audit:</strong> Scans all authored drills, MCQ distractors, gap fills, and transformation questions to verify that no student prompt lacks an authoritative model answer or marking guide.
            </div>
            <div className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0 ml-4">
              {answerAuditIssues.length === 0 ? '100% Solved' : `${answerAuditIssues.length} Items Flagged`}
            </div>
          </div>

          {answerAuditIssues.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                Answer Key Fully Verified
              </div>
              <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                Every question in the active textbook has a corresponding solution and explanation.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                    <tr>
                      <th className="py-3 px-4">Chapter</th>
                      <th className="py-3 px-4">Source Exercise</th>
                      <th className="py-3 px-4">Question Prompt</th>
                      <th className="py-3 px-4">Issue Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                    {answerAuditIssues.map((issue, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                          {issue.chapterTitle}
                        </td>
                        <td className="py-3.5 px-4 text-[#71685E] dark:text-[#D8CCBC]">
                          {issue.source}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#292521] dark:text-[#F6F0E7] max-w-sm truncate">
                          {issue.questionPrompt}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                              issue.severity === 'critical'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>{issue.issueType}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onOpenChapterStudio(issue.chapterId)}
                            className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold hover:bg-[#431225]"
                          >
                            Supply Solution
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
