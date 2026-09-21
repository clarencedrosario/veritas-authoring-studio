import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Award,
  Clock,
  BookOpen,
  FileText,
  Layers,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  GrammarTestSeries,
  GrammarTestSection,
  GrammarClassLevel,
  GrammarTopic,
  BoardStandardCode,
} from '../../types';
import { ALL_INDIAN_CLASSES } from '../../utils/activeBookContext';

export interface CreateAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: GrammarClassLevel;
  targetBoard: string;
  topics: GrammarTopic[];
  onCreateAssessment: (newPaper: GrammarTestSeries, targetTopicId?: string) => void;
  isDarkMode?: boolean;
}

export const CreateAssessmentDialog: React.FC<CreateAssessmentDialogProps> = ({
  isOpen,
  onClose,
  selectedClass,
  targetBoard,
  topics,
  onCreateAssessment,
  isDarkMode = false,
}) => {
  const [classLevel, setClassLevel] = useState<GrammarClassLevel>(selectedClass);
  const [boardTarget, setBoardTarget] = useState<string>(targetBoard || 'CBSE');
  const [title, setTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [targetTopicId, setTargetTopicId] = useState<string>(
    topics[0]?.id || ''
  );
  const [instructionText, setInstructionText] = useState(
    '1. Attempt all questions with precision.\n2. Marks for each item are indicated in the margin.\n3. Adhere strictly to standard grammatical concord and punctuation.'
  );
  const [sectionStructure, setSectionStructure] = useState<'single' | 'dual'>(
    'single'
  );
  const [includeStarterQuestions, setIncludeStarterQuestions] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize when modal opens or selectedClass changes
  useEffect(() => {
    if (isOpen) {
      setClassLevel(selectedClass);
      setBoardTarget(targetBoard || 'CBSE');
      if (topics.length > 0 && (!targetTopicId || !topics.some((t) => t.id === targetTopicId))) {
        setTargetTopicId(topics[0].id);
      }
      const boardLabel = targetBoard === 'CISCE' ? 'ICSE' : targetBoard || 'CBSE';
      const defaultTopicTitle = topics[0]?.title || 'Grammar & Syntax';
      setTitle(`${boardLabel} ${selectedClass} Periodic Test: ${defaultTopicTitle}`);
      setValidationError(null);
    }
  }, [isOpen, selectedClass, targetBoard, topics]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Please enter an assessment title.');
      return;
    }

    if (totalMarks <= 0) {
      setValidationError('Total marks must be greater than 0.');
      return;
    }

    if (durationMinutes <= 0) {
      setValidationError('Duration must be greater than 0 minutes.');
      return;
    }

    // Split instructions by newline
    const parsedInstructions = instructionText
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);

    // Normalize board
    let normalizedBoard: BoardStandardCode = 'CBSE';
    const bUpper = boardTarget.toUpperCase();
    if (bUpper.includes('CISCE') || bUpper.includes('ICSE')) {
      normalizedBoard = 'ICSE';
    } else if (bUpper.includes('CAMBRIDGE') || bUpper.includes('IGCSE')) {
      normalizedBoard = 'Cambridge_IGCSE';
    } else if (bUpper.includes('ISC')) {
      normalizedBoard = 'ISC';
    }

    const marksPerSec =
      sectionStructure === 'dual'
        ? Math.floor(totalMarks / 2)
        : totalMarks;
    const secBMarks = totalMarks - marksPerSec;

    const sections: GrammarTestSection[] = [];

    // Section A
    sections.push({
      id: `sec_a_${Date.now()}`,
      title: 'Section A: Grammar & Syntax Application',
      name: 'Section A: Grammar & Syntax Application',
      description: 'Answer all questions testing grammatical concordance, tense, and nominal forms.',
      instructions: 'Answer all questions in this section.',
      marksAllocation: marksPerSec,
      totalMarks: marksPerSec,
      questions: includeStarterQuestions
        ? [
            {
              id: `q_a1_${Date.now()}`,
              type: 'mcq',
              prompt: 'Select the sentence with correct subject-verb concordance:',
              options: [
                'Each of the delegates has delivered their opening address.',
                'Each of the delegates have delivered their opening address.',
                'Each of the delegates are delivering their opening address.',
                'Each of the delegates were delivered their opening address.',
              ],
              correctAnswer: 'Each of the delegates has delivered their opening address.',
              marks: 1,
              difficulty: 'Medium',
              tier: 'standard',
              cognitiveLevel: 'Applying',
              explanation: 'The distributive pronoun "Each" is grammatically singular and requires a singular finite verb ("has").',
            },
            {
              id: `q_a2_${Date.now() + 1}`,
              type: 'fill_in_blanks',
              prompt: 'Fill in the blank with the appropriate auxiliary verb:',
              blanksSentence: 'Neither the headmaster nor the tutors ___ (was/were) present at the symposium.',
              correctAnswer: 'were',
              marks: 1,
              difficulty: 'Medium',
              tier: 'standard',
              cognitiveLevel: 'Applying',
              explanation: 'When subjects are connected by "neither...nor", the verb agrees with the nearer subject ("tutors", plural).',
            },
          ]
        : [],
    });

    // Section B (if dual)
    if (sectionStructure === 'dual') {
      sections.push({
        id: `sec_b_${Date.now() + 2}`,
        title: 'Section B: Sentence Transformation & Error Analysis',
        name: 'Section B: Sentence Transformation & Error Analysis',
        description: 'Demonstrate diagnostic discernment and structural sentence transformations.',
        instructions: 'Rewrite the sentences according to prescribed instructions.',
        marksAllocation: secBMarks,
        totalMarks: secBMarks,
        questions: includeStarterQuestions
          ? [
              {
                id: `q_b1_${Date.now() + 3}`,
                type: 'transformation',
                prompt: 'Rewrite the sentence without changing its meaning:',
                originalSentence: 'As soon as the bell rang, the students assembled in the hall.',
                instruction: 'Begin with: No sooner...',
                correctAnswer: 'No sooner did the bell ring than the students assembled in the hall.',
                marks: 1,
                difficulty: 'Hard',
                tier: 'advanced',
                cognitiveLevel: 'Applying',
                explanation: '"No sooner" requires inverted auxiliary syntax and the conjunction "than".',
              },
            ]
          : [],
      });
    }

    const newPaper: GrammarTestSeries = {
      id: `paper_${Date.now()}`,
      title: title.trim(),
      classLevel,
      totalMarks,
      durationMinutes,
      suggestedDurationMinutes: durationMinutes,
      instructions:
        parsedInstructions.length > 0
          ? parsedInstructions
          : [
              'Attempt all questions carefully.',
              'Marks for each question are indicated against it.',
              'Adhere strictly to grammatical concord.',
            ],
      boardTarget: normalizedBoard,
      sections,
    };

    onCreateAssessment(newPaper, targetTopicId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#F6F0E7] dark:bg-[#1e0f18] border border-[#C29A52]/40 rounded-2xl shadow-2xl max-w-2xl w-full text-[#292521] dark:text-[#F6F0E7] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-assessment-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#2b1622] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="create-assessment-modal-title"
                className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]"
              >
                Create Academic Assessment
              </h3>
              <p className="text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6]">
                Veritas Assessment Builder &bull; Standardized Examination Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#71685E] hover:text-[#5A1832] dark:hover:text-[#F6F0E7] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
              Assessment Paper Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CBSE Class 7 Periodic Assessment 1: Syntax & Concord"
              className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs sm:text-sm font-serif font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52]"
            />
          </div>

          {/* 2. Class Level & Target Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Target Class Grade
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as GrammarClassLevel)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              >
                {ALL_INDIAN_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Curriculum Board
              </label>
              <select
                value={boardTarget}
                onChange={(e) => setBoardTarget(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832]"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="CISCE">CISCE / ICSE (Council)</option>
                <option value="Cambridge">Cambridge International / IGCSE</option>
              </select>
            </div>
          </div>

          {/* 3. Total Marks & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Total Marks
              </label>
              <input
                type="number"
                min={5}
                max={100}
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value, 10) || 10)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-bold text-[#292521] dark:text-[#F6F0E7] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 30)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-bold text-[#292521] dark:text-[#F6F0E7] outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
                Section Layout
              </label>
              <select
                value={sectionStructure}
                onChange={(e) => setSectionStructure(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none"
              >
                <option value="single">Single Section (Sec A)</option>
                <option value="dual">Two Sections (Sec A + B)</option>
              </select>
            </div>
          </div>

          {/* 4. Syllabus Topic Alignment */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
              Primary Topic / Chapter Alignment
            </label>
            <select
              value={targetTopicId}
              onChange={(e) => setTargetTopicId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs font-medium text-[#292521] dark:text-[#F6F0E7] outline-none"
            >
              {topics.length > 0 ? (
                topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.category})
                  </option>
                ))
              ) : (
                <option value="general-grammar">General Grammar &amp; Syntax</option>
              )}
            </select>
          </div>

          {/* 5. Assessment Instructions */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] mb-1">
              General Examination Instructions
            </label>
            <textarea
              rows={3}
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              placeholder="Enter bullet points (one per line)..."
              className="w-full p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#25121c] text-xs text-[#292521] dark:text-[#F6F0E7] outline-none focus:border-[#5A1832] dark:focus:border-[#C29A52] leading-relaxed resize-none"
            />
          </div>

          {/* 6. Starter Questions Toggle */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#25121c] border border-[#CBBEAC] dark:border-[#4d2b3b] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-[#C29A52] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Generate Prescriptive Starter Questions
                </p>
                <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                  Pre-populate standard syllabus concord and transformation questions into the sections
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeStarterQuestions}
              onChange={(e) => setIncludeStarterQuestions(e.target.checked)}
              className="w-4 h-4 rounded text-[#5A1832] focus:ring-[#5A1832] cursor-pointer"
            />
          </div>
        </form>

        {/* Footer Actions - VERITAS buttons 40-44px */}
        <div className="px-5 py-3.5 border-t border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#EDE4D6] dark:bg-[#2b1622] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-10 sm:h-11 px-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#CBBEAC]/40 dark:hover:bg-[#35101F] text-xs sm:text-sm font-semibold text-[#71685E] dark:text-[#c9b9a6] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 sm:h-11 px-5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment Paper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
