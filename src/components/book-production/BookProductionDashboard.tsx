import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  GrammarTopic,
  ChapterWorkflowStatus,
  GrammarSeriesProject,
} from '../../types';
import {
  getBookMetrics,
  getChapterWordCount,
  getChapterExerciseCount,
  getChapterQuestionCount,
  getChapterVisualCount,
  getChapterCompletionPercentage,
  getChapterProductionStatus,
  getChapterAnswerKeyStatus,
} from '../../utils/bookProductionUtils';
import {
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Filter,
  Eye,
  FileCheck,
  Sparkles,
  ArrowRight,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface BookProductionDashboardProps {
  currentBook: ClassCurriculumBook;
  seriesProject?: GrammarSeriesProject;
  onOpenChapterStudio: (topicId: string) => void;
  onUpdateBook?: (updated: ClassCurriculumBook) => void;
  onOpenReadinessAudit?: () => void;
  onOpenTOC?: () => void;
  isDarkMode: boolean;
}

const ALL_STATUSES: ChapterWorkflowStatus[] = [
  'planning',
  'writing',
  'exercises_in_progress',
  'visuals_in_progress',
  'academic_review',
  'editorial_review',
  'ready_for_layout',
  'final',
];

export const BookProductionDashboard: React.FC<BookProductionDashboardProps> = ({
  currentBook,
  onOpenChapterStudio,
  onUpdateBook,
}) => {
  const metrics = getBookMetrics(currentBook);
  const topics = currentBook.topics || [];
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Categorized chapters for diagnostics
  const chaptersNeedingWork = topics.filter((t) => getChapterCompletionPercentage(t) < 70);
  const chaptersLackingExercises = topics.filter((t) => getChapterExerciseCount(t) === 0);
  const chaptersLackingAnswers = topics.filter((t) => getChapterAnswerKeyStatus(t) !== 'complete');
  const chaptersLackingVisuals = topics.filter((t) => getChapterVisualCount(t) === 0);
  const chaptersAcademicReview = topics.filter(
    (t) => getChapterProductionStatus(t) === 'academic_review'
  );
  const chaptersReadyForLayout = topics.filter(
    (t) => getChapterProductionStatus(t) === 'ready_for_layout' || getChapterProductionStatus(t) === 'final'
  );

  const filteredTopics = topics.filter((t) => {
    if (selectedStatusFilter === 'all') return true;
    return getChapterProductionStatus(t) === selectedStatusFilter;
  });

  const handleUpdateChapterStatus = (topicId: string, newStatus: ChapterWorkflowStatus) => {
    const updatedTopics = topics.map((t) => {
      if (t.id !== topicId) return t;
      const updatedStudio = t.studioChapter
        ? { ...t.studioChapter, workflowStatus: newStatus }
        : undefined;
      return {
        ...t,
        studioChapter: updatedStudio,
      };
    });
    onUpdateBook({ ...currentBook, topics: updatedTopics });
  };

  return (
    <div className="space-y-6">
      {/* 1. Production Diagnostics & Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Overall Completion
          </span>
          <div className="text-xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52] mt-1">
            {metrics.overallCompletionPercentage}%
          </div>
          <span className="text-[10px] text-[#71685E]">{metrics.chaptersCompletedCount} of {metrics.chaptersCount} ready</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Total Words
          </span>
          <div className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
            {metrics.totalWords.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#71685E]">Across manuscript</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Exercises & Qs
          </span>
          <div className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
            {metrics.totalExercises} <span className="text-xs font-normal text-[#71685E]">({metrics.totalQuestions} q)</span>
          </div>
          <span className="text-[10px] text-[#71685E]">Tiered question pool</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Syntactic Visuals
          </span>
          <div className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
            {metrics.totalVisuals}
          </div>
          <span className="text-[10px] text-[#71685E]">{metrics.unresolvedVisualsCount} ch lack visuals</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Missing Answers
          </span>
          <div className={`text-xl font-serif font-bold mt-1 ${metrics.missingAnswersCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {metrics.missingAnswersCount}
          </div>
          <span className="text-[10px] text-[#71685E]">Chapters need audit</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Academic Review
          </span>
          <div className="text-xl font-serif font-bold text-amber-600 mt-1">
            {metrics.academicReviewNeededCount}
          </div>
          <span className="text-[10px] text-[#71685E]">Awaiting sign-off</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs">
          <span className="text-[10px] font-mono text-[#71685E] dark:text-[#D8CCBC] uppercase block">
            Layout Ready
          </span>
          <div className="text-xl font-serif font-bold text-emerald-600 mt-1">
            {metrics.layoutReadyCount}
          </div>
          <span className="text-[10px] text-[#71685E]">Pre-press ready</span>
        </div>
      </div>

      {/* 2. Publishing Questions Checklist / Attention Alert Boxes */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-2">
          <FileCheck className="w-4 h-4" />
          <span>Publishing Readiness Diagnostics</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-[#251D1E] border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-1">
            <div className="flex items-center justify-between font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              <span>Which chapters need exercises?</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                {chaptersLackingExercises.length}
              </span>
            </div>
            <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
              {topics.length === 0
                ? 'No chapters authored for this volume yet.'
                : chaptersLackingExercises.length === 0
                ? 'All chapters have at least one structured exercise set.'
                : chaptersLackingExercises.map((t) => t.title).join(', ')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#251D1E] border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-1">
            <div className="flex items-center justify-between font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              <span>Which chapters lack answer keys?</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded ${chaptersLackingAnswers.length > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {chaptersLackingAnswers.length}
              </span>
            </div>
            <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
              {topics.length === 0
                ? 'No chapters authored for this volume yet.'
                : chaptersLackingAnswers.length === 0
                ? 'All exercises contain complete expected solutions.'
                : chaptersLackingAnswers.map((t) => t.title).join(', ')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#251D1E] border border-[#CBBEAC]/70 dark:border-[#5A1832]/60 space-y-1">
            <div className="flex items-center justify-between font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              <span>Which chapters lack visuals?</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                {chaptersLackingVisuals.length}
              </span>
            </div>
            <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
              {topics.length === 0
                ? 'No chapters authored for this volume yet.'
                : chaptersLackingVisuals.length === 0
                ? 'Every chapter features syntactic diagrams or visual blocks.'
                : chaptersLackingVisuals.map((t) => t.title).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pipeline Filter Bar & Chapter Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#71685E] dark:text-[#D8CCBC]" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#71685E] dark:text-[#D8CCBC]">
              Filter by Pipeline Stage:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedStatusFilter === 'all'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold'
                  : 'bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E]'
              }`}
            >
              All Stages ({topics.length})
            </button>
            {ALL_STATUSES.map((status) => {
              const count = topics.filter((t) => getChapterProductionStatus(t) === status).length;
              if (count === 0 && selectedStatusFilter !== status) return null;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-colors ${
                    selectedStatusFilter === status
                      ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold'
                      : 'bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] text-[#71685E]'
                  }`}
                >
                  {status.replace(/_/g, ' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Chapter Pipeline Table */}
        <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] dark:border-[#5A1832] text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#D8CCBC]">
                <tr>
                  <th className="py-3 px-4">Chapter</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Words</th>
                  <th className="py-3 px-4">Exercises</th>
                  <th className="py-3 px-4">Visuals</th>
                  <th className="py-3 px-4">Key Status</th>
                  <th className="py-3 px-4">Completion</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#5A1832]/50">
                {filteredTopics.map((topic, idx) => {
                  const words = getChapterWordCount(topic);
                  const exercises = getChapterExerciseCount(topic);
                  const questions = getChapterQuestionCount(topic);
                  const visuals = getChapterVisualCount(topic);
                  const completion = getChapterCompletionPercentage(topic);
                  const status = getChapterProductionStatus(topic);
                  const ansStatus = getChapterAnswerKeyStatus(topic);

                  return (
                    <tr
                      key={topic.id}
                      className="hover:bg-[#FDFBF7]/70 dark:hover:bg-[#251D1E]/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[#9A7438] text-[11px]">
                            CH {idx + 1}
                          </span>
                          <span>{topic.title}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#71685E] dark:text-[#D8CCBC]">
                        {topic.category}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#292521] dark:text-[#F6F0E7]">
                        {words.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#292521] dark:text-[#F6F0E7]">
                        {exercises} ex ({questions} q)
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#292521] dark:text-[#F6F0E7]">
                        {visuals}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 font-mono text-[10.5px] font-semibold capitalize ${
                            ansStatus === 'complete'
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : ansStatus === 'partial'
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {ansStatus === 'complete' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span>{ansStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-1.5 rounded-full bg-[#CBBEAC] dark:bg-[#5A1832] overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 rounded-full"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-[#292521] dark:text-[#F6F0E7]">
                            {completion}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={status}
                          onChange={(e) =>
                            handleUpdateChapterStatus(topic.id, e.target.value as ChapterWorkflowStatus)
                          }
                          className="px-2 py-1 rounded-lg border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[11px] font-mono text-[#292521] dark:text-[#F6F0E7] outline-none"
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenChapterStudio(topic.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
                          <span>Open Studio</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredTopics.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#71685E] dark:text-[#D8CCBC]">
                      <BookOpen className="w-8 h-8 text-[#9A7438] mx-auto mb-2 opacity-50" />
                      <p className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                        {topics.length === 0
                          ? 'No chapters authored for this volume yet'
                          : `No chapters in the "${selectedStatusFilter.replace(/_/g, ' ')}" stage`}
                      </p>
                      <p className="text-xs mt-1">
                        {topics.length === 0
                          ? 'Create chapters in Units & Structure or Chapter Studio to begin pipeline tracking.'
                          : 'Adjust filter to view chapters in other production stages.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
