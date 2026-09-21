import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  MoveUp,
  MoveDown,
  Copy,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Image,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  BookProject,
  ClassCurriculumBook,
  GrammarTopic,
  GrammarClassLevel,
} from '../../types';

interface ChapterManagerViewProps {
  project: BookProject;
  book?: ClassCurriculumBook;
  onUpdateBookTopics: (classLevel: GrammarClassLevel, updatedTopics: GrammarTopic[]) => void;
  onOpenChapterInStudio: (chapterId: string) => void;
}

export const ChapterManagerView: React.FC<ChapterManagerViewProps> = ({
  project,
  book,
  onUpdateBookTopics,
  onOpenChapterInStudio,
}) => {
  const topics = book?.topics || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Move up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...topics];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onUpdateBookTopics(project.classLevel, updated);
  };

  // Move down
  const handleMoveDown = (index: number) => {
    if (index === topics.length - 1) return;
    const updated = [...topics];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onUpdateBookTopics(project.classLevel, updated);
  };

  // Add Chapter
  const handleAddChapter = () => {
    const newNum = topics.length + 1;
    const newTopic: GrammarTopic = {
      id: `top-${project.classLevel.toLowerCase().replace(/\s+/g, '-')}-unit-${Date.now()}`,
      title: `Unit ${newNum}: New Grammar Chapter`,
      category: 'Core Syntax',
      classLevel: project.classLevel,
      overview: 'Comprehensive chapter overview and pedagogical objectives.',
      learningObjectives: ['Define core grammatical terminology', 'Apply syntax rules in sentences'],
      definitions: [
        {
          id: `def-${Date.now()}`,
          term: 'Key Concept',
          partOfSpeechOrCategory: 'Syntactic Rule',
          ageAppropriateExplanation: 'Clear student-friendly explanation of the grammatical principle.',
          formulaOrSyntax: 'Subject + Finite Verb + Object',
          rules: ['Rule 1: Always ensure correct agreement.'],
          examples: [
            {
              sentence: 'The student completed the assignment diligently.',
              highlightWord: 'completed',
              note: 'Standard declarative sentence structure.',
            },
          ],
        },
      ],
      notesAndTheoryMarkdown: '### Unit Introduction\n\nDetailed theoretical guidelines and examples.',
      exercises: [
        {
          id: `ex-${Date.now()}`,
          title: 'Exercise A: Concept Check',
          instructions: 'Identify the correct grammatical forms in the sentences below.',
          targetType: 'mcq',
          tier: 'standard',
          maxMarks: 5,
          questions: [
            {
              id: `q-${Date.now()}`,
              type: 'mcq',
              prompt: 'Choose the correct form to complete the sentence.',
              marks: 1,
              difficulty: 'Easy',
              cognitiveLevel: 'Remembering',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option A',
              explanation: 'Standard grammatical rule rationale.',
            },
          ],
        },
      ],
      testSeries: [],
    };

    onUpdateBookTopics(project.classLevel, [...topics, newTopic]);
  };

  // Duplicate Chapter
  const handleDuplicateChapter = (topic: GrammarTopic) => {
    const duplicated: GrammarTopic = {
      ...JSON.parse(JSON.stringify(topic)),
      id: `${topic.id}-dup-${Date.now()}`,
      title: `${topic.title} (Copy)`,
    };
    onUpdateBookTopics(project.classLevel, [...topics, duplicated]);
  };

  // Archive / Delete Chapter
  const handleDeleteChapter = (topicId: string) => {
    if (confirm('Are you sure you want to remove this chapter from the book sequence?')) {
      const updated = topics.filter((t) => t.id !== topicId);
      onUpdateBookTopics(project.classLevel, updated);
    }
  };

  // Save Rename
  const handleSaveRename = (topicId: string) => {
    if (!renameValue.trim()) return;
    const updated = topics.map((t) => (t.id === topicId ? { ...t, title: renameValue } : t));
    onUpdateBookTopics(project.classLevel, updated);
    setEditingTopicId(null);
  };

  return (
    <div id="chapter-manager-dashboard" className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search chapters in this edition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {topics.length} sequenced {topics.length === 1 ? 'unit' : 'units'}
          </span>
        </div>

        <button
          onClick={handleAddChapter}
          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#431225] rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Chapter Unit</span>
        </button>
      </div>

      {/* Chapters Table */}
      <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3 w-12 text-center">Seq</th>
                <th className="py-3 px-4 min-w-[220px]">Chapter Title & Concept</th>
                <th className="py-3 px-3 text-center">Blocks</th>
                <th className="py-3 px-3 text-center">Words / Pgs</th>
                <th className="py-3 px-3 text-center">Examples</th>
                <th className="py-3 px-3 text-center">Exercises</th>
                <th className="py-3 px-3 text-center">Questions</th>
                <th className="py-3 px-3 text-center">Visuals</th>
                <th className="py-3 px-3 text-center">Answer Key</th>
                <th className="py-3 px-3 text-center">Readiness</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredTopics.map((topic, index) => {
                const words =
                  (topic.notesAndTheoryMarkdown?.split(/\s+/).length || 0) +
                  (topic.overview?.split(/\s+/).length || 0) +
                  (topic.definitions?.reduce(
                    (acc, d) =>
                      acc +
                      (d.ageAppropriateExplanation?.split(/\s+/).length || 0) +
                      (d.examples?.reduce((eAcc, ex) => eAcc + ex.sentence.split(/\s+/).length, 0) || 0),
                    0
                  ) || 0);

                const pages = Math.max(1, Math.ceil(words / 350));
                const defCount = topic.definitions?.length || 0;
                const exCount = topic.exercises?.length || 0;
                const totalQs =
                  topic.exercises?.reduce((acc, ex) => acc + (ex.questions?.length || 0), 0) || 0;
                const topicBlocks = ((topic as any).contentBlocks || topic.studioChapter?.sections?.flatMap((s) => s.blocks) || []) as any[];
                const blocksCount = topicBlocks.length || defCount + exCount;
                const visualsCount =
                  topicBlocks.filter(
                    (b: any) => b.type === 'callout_box' || b.type === 'table_block' || b.type === 'visual'
                  ).length || 0;

                const hasAnswers = topic.exercises?.some((ex) =>
                  ex.questions.some((q) => Boolean(q.correctAnswer || (q as any).answerKey))
                );

                const completionPct = Math.min(
                  100,
                  (defCount > 0 ? 30 : 0) +
                    (words > 200 ? 25 : 10) +
                    (exCount > 0 ? 25 : 0) +
                    (hasAnswers ? 10 : 0) +
                    (visualsCount > 0 ? 10 : 0)
                );

                const isEditing = editingTopicId === topic.id;

                return (
                  <tr
                    key={topic.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Seq & Reorder */}
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-500">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Up"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(index)}
                            disabled={index === topics.length - 1}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Down"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="w-5 text-center">{index + 1}</span>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 w-full"
                          />
                          <button
                            onClick={() => handleSaveRename(topic.id)}
                            className="px-2 py-1 bg-[#5A1832] text-white rounded text-[10px] font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTopicId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div
                            onClick={() => onOpenChapterInStudio(topic.id)}
                            className="font-serif font-bold text-slate-900 dark:text-slate-100 hover:text-[#5A1832] dark:hover:text-[#E6C994] cursor-pointer"
                          >
                            {topic.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                              {topic.category || 'Grammar'}
                            </span>
                            <span className="truncate max-w-[200px]">{topic.overview}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Content Blocks */}
                    <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {blocksCount}
                    </td>

                    {/* Words / Pgs */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                        {words}
                      </span>
                      <span className="text-[10px] text-slate-400 block">~{pages}p</span>
                    </td>

                    {/* Examples */}
                    <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {topic.definitions?.reduce(
                        (acc, d) => acc + (d.examples?.length || 0),
                        0
                      ) || 0}
                    </td>

                    {/* Exercises */}
                    <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {exCount}
                    </td>

                    {/* Questions */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {totalQs}
                    </td>

                    {/* Visuals */}
                    <td className="py-3 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {visualsCount}
                    </td>

                    {/* Answer Key */}
                    <td className="py-3 px-3 text-center">
                      {hasAnswers ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 mr-0.5" />
                          Missing
                        </span>
                      )}
                    </td>

                    {/* Completion % */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5A1832] rounded-full"
                            style={{ width: `${completionPct}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          {completionPct}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setEditingTopicId(topic.id);
                            setRenameValue(topic.title);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Rename Chapter"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateChapter(topic)}
                          className="p-1.5 rounded text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Duplicate Chapter"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenChapterInStudio(topic.id)}
                          className="p-1.5 rounded text-[#5A1832] hover:bg-[#5A1832]/10 dark:text-[#E6C994]"
                          title="Open in Chapter Studio"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(topic.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Remove from sequence"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
