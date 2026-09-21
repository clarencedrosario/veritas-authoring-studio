import React, { useState } from 'react';
import {
  X,
  BookPlus,
  Layers,
  Sparkles,
  FileText,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  GrammarTopic,
  BookUnit,
  GrammarClassLevel,
  BoardStandardCode,
  StudioChapter,
  ClassCurriculumBook,
  GrammarSeriesProject,
} from '../../types';
import { CHAPTER_STRUCTURAL_TEMPLATES } from '../../utils/chapterTemplates';

interface NewChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  units?: BookUnit[];
  selectedClass?: GrammarClassLevel;
  targetBoard?: string;
  existingTopicsCount?: number;
  onCreateChapter?: (newTopic: GrammarTopic, targetUnitId: string) => void;
  currentBook?: ClassCurriculumBook;
  seriesProject?: GrammarSeriesProject;
  onChapterCreated?: (newTopic: GrammarTopic, targetUnitId: string) => void;
  isDarkMode: boolean;
}

export const NewChapterModal: React.FC<NewChapterModalProps> = ({
  isOpen,
  onClose,
  units: propUnits,
  selectedClass: propSelectedClass,
  targetBoard: propTargetBoard,
  existingTopicsCount: propExistingTopicsCount,
  onCreateChapter,
  currentBook,
  seriesProject,
  onChapterCreated,
}) => {
  const effectiveUnits = propUnits || currentBook?.units || [];
  const effectiveClass = propSelectedClass || currentBook?.classLevel || 'Class 7';
  const effectiveBoard = propTargetBoard || seriesProject?.targetBoard || 'CBSE';
  const effectiveCount = propExistingTopicsCount ?? (currentBook?.topics?.length || 0);

  const [chapterNumber, setChapterNumber] = useState<number>(effectiveCount + 1);
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(effectiveUnits[0]?.id || '');
  const [curriculumTopic, setCurriculumTopic] = useState<string>('');
  const [category, setCategory] = useState<string>('Syntax & Concord');
  const [description, setDescription] = useState<string>('');
  const [learningObjectives, setLearningObjectives] = useState<string>(
    'Master foundational definitions\nAnalyze authentic usage in sentences\nAvoid common syntactic exam errors'
  );
  const [estimatedTeachingTime, setEstimatedTeachingTime] = useState<string>('4 Periods (160 mins)');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [prerequisites, setPrerequisites] = useState<string>('Basic understanding of Subject and Predicate');

  // Template selection
  const [creationMode, setCreationMode] = useState<'blank' | 'template'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-grammar-concept');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!chapterTitle.trim()) return;

    const newId = `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const template = CHAPTER_STRUCTURAL_TEMPLATES.find((t) => t.id === selectedTemplateId);

    const objectivesList = learningObjectives
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const targetUnit = selectedUnitId || effectiveUnits[0]?.id || 'unit-1';
    const activeBookId = currentBook?.id || seriesProject?.activeBookProjectId;
    const activeEdId = currentBook?.editionId || seriesProject?.activeEditionId;
    const activeSysId = currentBook?.curriculumSystemId || currentBook?.boardStandards || seriesProject?.activeSystemId || effectiveBoard;
    const activeProgId = currentBook?.programmeId || seriesProject?.activeProgrammeId;
    const activeClsId = currentBook?.classOrStageId || effectiveClass;

    // Build StudioChapter representation
    const studioChapter: StudioChapter = {
      id: `studio-${newId}`,
      bookProjectId: activeBookId,
      editionId: activeEdId,
      curriculumSystemId: activeSysId,
      programmeId: activeProgId,
      classOrStageId: activeClsId,
      unitId: targetUnit,
      equivalentClass: effectiveClass,
      chapterNumber: Number(chapterNumber),
      title: chapterTitle.trim(),
      shortTitle: chapterTitle.trim(),
      category: category,
      curriculumTopic: curriculumTopic || chapterTitle.trim(),
      description: description || `Academic unit exploring ${chapterTitle.trim()}`,
      prerequisiteKnowledge: prerequisites,
      estimatedTeachingTime: estimatedTeachingTime,
      difficultyLevel: difficulty,
      workflowStatus: 'planning',
      opening: {
        chapterNumber: Number(chapterNumber),
        title: chapterTitle.trim(),
        openingHook: `Language is the dress of thought — clear syntax reflects clear minds.`,
        shortIntroduction: description || `Academic unit exploring ${chapterTitle.trim()}`,
        learningObjectives: objectivesList,
        keyVocabulary: [category],
        conceptsCovered: [chapterTitle.trim()],
        priorKnowledge: prerequisites,
        estimatedStudyTimeMinutes: 45,
      },
      sections:
        creationMode === 'template' && template
          ? template.recommendedBlocks.map((blk, idx) => ({
              id: `sec-${newId}-${idx + 1}`,
              chapterId: `studio-${newId}`,
              numberLabel: `${chapterNumber}.${idx + 1}`,
              title: blk.title,
              order: idx + 1,
              blocks: [
                {
                  id: `blk-${newId}-${idx + 1}`,
                  type: blk.type,
                  order: 1,
                  visibility: 'student' as const,
                  textContent: `[${blk.brief}] Enter exposition for ${blk.title}...`,
                },
              ],
            }))
          : [
              {
                id: `sec-${newId}-1`,
                chapterId: `studio-${newId}`,
                numberLabel: `${chapterNumber}.1`,
                title: 'Section 1: Conceptual Introduction',
                order: 1,
                blocks: [
                  {
                    id: `blk-${newId}-1`,
                    type: 'text' as const,
                    order: 1,
                    visibility: 'student' as const,
                    textContent: 'Write introductory exposition for this grammatical concept...',
                  },
                ],
              },
            ],
      exercises:
        creationMode === 'template' && template
          ? template.exerciseStructure.map((exTitle, eIdx) => ({
              id: `ex-${newId}-${eIdx + 1}`,
              letter: String.fromCharCode(65 + eIdx),
              title: exTitle,
              progression: 'foundation' as const,
              instructions: 'Read each prompt carefully and complete the exercise.',
              difficulty: difficulty,
              suggestedMarks: 10,
              questions: [],
            }))
          : [
              {
                id: `ex-${newId}-1`,
                letter: 'A',
                title: 'Exercise A: Practice & Identification',
                progression: 'foundation' as const,
                instructions: 'Answer each question below.',
                difficulty: difficulty,
                suggestedMarks: 10,
                questions: [],
              },
            ],
      ending: {
        whatYouLearned: [
          `Key syntax rules governing ${chapterTitle.trim()}.`,
          `Standard conventions for formal composition.`,
        ],
        rulesAtAGlance: [
          { rule: `Primary rule of ${chapterTitle.trim()}`, example: 'Specimen model sentence.' },
        ],
        commonMistakes: [],
        quickRevisionChecklist: [
          `Verify agreement in complex sentences.`,
          `Check pronoun references and tense continuity.`,
        ],
        keyVocabulary: [category],
        examReminders: [
          `Board exams heavily evaluate concord exceptions.`,
        ],
        rulesRecap: [
          { rule: `Key rule 1 for ${chapterTitle.trim()}`, example: 'Specimen illustrative sentence.' },
          { rule: `Key rule 2 for ${chapterTitle.trim()}`, example: 'Contrastive pair sentence.' },
        ],
        summaryPoints: [
          `Summary point A regarding syntactic structure`,
          `Summary point B regarding board examination pitfalls`,
        ],
        commonTraps: [
          { trap: `Confusing parenthetical elements with the subject`, fix: `Isolate parenthetical phrases before matching verb.` },
        ],
      },
      answerKey: [],
      authorNotes: `Initial manuscript draft for ${chapterTitle.trim()}. Created with Veritas Book Authoring Suite.`,
      teacherNotes: {
        pedagogicalNotes: `Focus on inductive exploration. Allow students to examine contrastive sentence pairs before presenting the formal syntax rule.`,
        lessonPlanFlow: [
          { periodNumber: 1, topic: 'Warm-up & Induction', durationMinutes: 10, activities: 'Observe specimen sentences' },
          { periodNumber: 1, topic: 'Rule Formulation', durationMinutes: 15, activities: 'Syntactic rule mapping' },
          { periodNumber: 1, topic: 'Guided Practice', durationMinutes: 15, activities: 'Exercises A & B' },
        ],
        misconceptions: [
          { misconception: 'Confusing proximity with the true grammatical subject.', correctionStrategy: 'Isolate intervening prepositional phrases.' },
        ],
      },
    };

    const newTopic: GrammarTopic = {
      id: newId,
      bookProjectId: activeBookId,
      editionId: activeEdId,
      curriculumSystemId: activeSysId,
      programmeId: activeProgId,
      classOrStageId: activeClsId,
      unitId: targetUnit,
      order: Number(chapterNumber),
      title: chapterTitle.trim(),
      category: category,
      classLevel: effectiveClass,
      overview: description || `Comprehensive academic study of ${chapterTitle.trim()} aligned to ${effectiveBoard}.`,
      learningObjectives: objectivesList,
      definitions: [
        {
          id: `def-${newId}-1`,
          term: chapterTitle.trim(),
          partOfSpeechOrCategory: category,
          ageAppropriateExplanation: `Essential grammatical explanation of ${chapterTitle.trim()} for ${effectiveClass}.`,
          rules: ['Rule 1: Formulate the core prescriptive grammatical rule.'],
          examples: [
            {
              sentence: `The authoritative exemplar for ${chapterTitle.trim()} illustrates the standard rule.`,
              note: 'Standard illustrative example.',
            },
          ],
        },
      ],
      notesAndTheoryMarkdown: `### ${chapterTitle.trim()}\n\n*Curriculum Topic: ${curriculumTopic || chapterTitle.trim()}*\n\nProvide rigorous instructional exposition, diagnostic contrastive pairs, and authentic literature excerpts.`,
      exercises: [
        {
          id: `cex-${newId}-1`,
          title: 'Exercise A: Formative Practice',
          instructions: 'Complete each question as directed.',
          targetType: 'mixed',
          maxMarks: 5,
          questions: [],
        },
      ],
      testSeries: [],
      studioChapter: studioChapter,
    };

    if (onCreateChapter) {
      onCreateChapter(newTopic, targetUnit);
    } else if (onChapterCreated) {
      onChapterCreated(newTopic, targetUnit);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#EDE4D6] dark:bg-[#35101F] border-b border-[#CBBEAC] dark:border-[#5A1832] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#5A1832] dark:bg-[#5A1832]/80 text-[#F6F0E7] flex items-center justify-center">
              <BookPlus className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Add Chapter to Textbook
              </h2>
              <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
                {effectiveClass} &bull; {effectiveBoard} Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#71685E] dark:text-[#D8CCBC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Creation Mode Toggle */}
          <div className="p-1 rounded-xl bg-[#EDE4D6]/70 dark:bg-[#35101F]/60 border border-[#CBBEAC] dark:border-[#5A1832] flex items-center">
            <button
              onClick={() => setCreationMode('template')}
              className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                creationMode === 'template'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#292521]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C29A52]" />
              <span>Use Structural Template (Recommended)</span>
            </button>
            <button
              onClick={() => setCreationMode('blank')}
              className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${
                creationMode === 'blank'
                  ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-sm'
                  : 'text-[#71685E] dark:text-[#D8CCBC] hover:text-[#292521]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C29A52]" />
              <span>Create Blank Chapter</span>
            </button>
          </div>

          {/* Template Selection Grid if in Template mode */}
          {creationMode === 'template' && (
            <div className="space-y-2">
              <label className="font-mono uppercase tracking-wider text-[10px] text-[#9A7438] dark:text-[#C29A52] font-semibold">
                Select Architectural Template
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {CHAPTER_STRUCTURAL_TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#5A1832] bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] shadow-sm'
                          : 'border-[#CBBEAC]/70 dark:border-[#5A1832]/60 bg-white dark:bg-[#251D1E] hover:border-[#9A7438]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs">{tpl.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#C29A52]" />}
                        </div>
                        <p className="text-[11px] text-[#71685E] dark:text-[#D8CCBC] mt-1 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52]">
                        {tpl.recommendedBlocks.length} recommended blocks &bull; {tpl.exerciseStructure.length} drills
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Core Chapter Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Chapter Number *
              </label>
              <input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Chapter Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Demonstration Chapter — Remove or Rename"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Assign to Unit *
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              >
                {effectiveUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title} ({u.chapterIds.length} chapters)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Curriculum Topic / Strand
              </label>
              <input
                type="text"
                placeholder="e.g. Syntactic Concord / Parts of Speech"
                value={curriculumTopic}
                onChange={(e) => setCurriculumTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              >
                <option value="Syntax & Concord">Syntax & Concord</option>
                <option value="Parts of Speech">Parts of Speech</option>
                <option value="Verbs & Tenses">Verbs & Tenses</option>
                <option value="Clauses & Sentences">Clauses & Sentences</option>
                <option value="Transformation">Transformation</option>
                <option value="Vocabulary & Etymology">Vocabulary & Etymology</option>
                <option value="Composition & Rhetoric">Composition & Rhetoric</option>
                <option value="Revision & Assessment">Revision & Assessment</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Estimated Teaching Time
              </label>
              <input
                type="text"
                value={estimatedTeachingTime}
                onChange={(e) => setEstimatedTeachingTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              />
            </div>

            <div>
              <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
                Difficulty / Progression
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              >
                <option value="Easy">Foundation (Easy)</option>
                <option value="Medium">Standard (Medium)</option>
                <option value="Hard">Advanced / Olympiad (Hard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
              Short Description / Syllabus Scope
            </label>
            <input
              type="text"
              placeholder="Brief pedagogical overview of chapter content and targets"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
              Learning Objectives (One per line)
            </label>
            <textarea
              rows={3}
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono uppercase tracking-wider text-[10px] text-[#71685E] dark:text-[#D8CCBC] mb-1 font-semibold">
              Prerequisite Knowledge
            </label>
            <input
              type="text"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#251D1E] text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EDE4D6] dark:bg-[#35101F] border-t border-[#CBBEAC] dark:border-[#5A1832] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] text-xs font-medium text-[#71685E] dark:text-[#D8CCBC] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!chapterTitle.trim()}
            onClick={handleCreate}
            className="px-5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] disabled:opacity-50 text-[#F6F0E7] text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors"
          >
            <BookPlus className="w-4 h-4 text-[#C29A52]" />
            <span>Create Chapter Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
