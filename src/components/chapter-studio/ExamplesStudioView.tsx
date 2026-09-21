import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Layers,
  Search,
  Filter,
  Check,
  Edit3,
  BookOpen,
  ArrowUpRight,
  Split,
  GraduationCap,
} from 'lucide-react';
import { StudioChapter, TextbookContentBlock, ExampleItem, StudioExercise } from '../../types';

interface ExamplesStudioViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  onConvertExampleToExerciseQuestion: (exampleSentence: string, targetWord?: string) => void;
  isDarkMode: boolean;
}

interface ChapterExampleEntry {
  id: string;
  type: 'single' | 'pair';
  sentence: string;
  highlightWord?: string;
  explanation: string;
  ruleDemonstrated: string;
  difficulty: 'Foundation' | 'Standard' | 'Challenge';
  boardRelevance?: string;
  teacherNote?: string;
  // For pair
  incorrectSentence?: string;
  correctSentence?: string;
  whyExplanation?: string;
  sectionTitle?: string;
  sourceBlockId?: string;
}

export const ExamplesStudioView: React.FC<ExamplesStudioViewProps> = ({
  chapter,
  onUpdateChapter,
  onConvertExampleToExerciseQuestion,
  isDarkMode,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'single' | 'pair'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExampleForEdit, setSelectedExampleForEdit] = useState<ChapterExampleEntry | null>(null);

  // New example form state
  const [newType, setNewType] = useState<'single' | 'pair'>('single');
  const [newSentence, setNewSentence] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newRule, setNewRule] = useState('Basic Singular & Plural Concord');
  const [newDifficulty, setNewDifficulty] = useState<'Foundation' | 'Standard' | 'Challenge'>('Standard');
  const [newBoardRelevance, setNewBoardRelevance] = useState(`${chapter.systemId || 'CBSE'} ${chapter.equivalentClass}`);
  const [newTeacherNote, setNewTeacherNote] = useState('');
  // For pair
  const [newIncorrect, setNewIncorrect] = useState('');
  const [newCorrect, setNewCorrect] = useState('');
  const [newWhy, setNewWhy] = useState('');

  // Extract examples from sections
  const extractedExamples: ChapterExampleEntry[] = [];

  chapter.sections.forEach((sec) => {
    sec.blocks.forEach((blk) => {
      if (blk.type === 'example' && blk.exampleData?.items) {
        blk.exampleData.items.forEach((item, idx) => {
          extractedExamples.push({
            id: `${blk.id}-${idx}`,
            type: 'single',
            sentence: item.sentence,
            highlightWord: item.highlightWord,
            explanation: item.explanation || 'Demonstrates concord rule.',
            ruleDemonstrated: sec.title,
            difficulty: 'Standard',
            boardRelevance: `${chapter.systemId || 'CBSE'} ${chapter.equivalentClass}`,
            sectionTitle: sec.title,
            sourceBlockId: blk.id,
          });
        });
      } else if (blk.type === 'example_pair' || blk.examplePair) {
        const pair = blk.examplePair || {
          incorrect: 'The bouquet of red roses were placed on the table.',
          correct: 'The bouquet of red roses was placed on the table.',
          why: 'The head noun is "bouquet" (singular); "roses" is inside the prepositional phrase.',
          rule: 'Prepositional Modifier Invariance',
        };
        extractedExamples.push({
          id: blk.id,
          type: 'pair',
          sentence: pair.correct,
          incorrectSentence: pair.incorrect,
          correctSentence: pair.correct,
          whyExplanation: pair.why,
          explanation: pair.why,
          ruleDemonstrated: pair.rule || sec.title,
          difficulty: 'Challenge',
          boardRelevance: `${chapter.systemId || 'CBSE'} Examination Trap`,
          sectionTitle: sec.title,
          sourceBlockId: blk.id,
        });
      } else if (blk.type === 'common_error' && blk.commonError) {
        extractedExamples.push({
          id: blk.id,
          type: 'pair',
          sentence: blk.commonError.correctSentence,
          incorrectSentence: blk.commonError.incorrectSentence,
          correctSentence: blk.commonError.correctSentence,
          whyExplanation: blk.commonError.explanation,
          explanation: blk.commonError.explanation,
          ruleDemonstrated: blk.commonError.mistakeType,
          difficulty: 'Challenge',
          boardRelevance: `${chapter.systemId || 'CBSE'} Board Trap`,
          sectionTitle: sec.title,
          sourceBlockId: blk.id,
        });
      }
    });
  });

  // Built-in starter pedagogical examples if none in blocks
  const demoExamples: ChapterExampleEntry[] = [
    {
      id: 'ex-demo-1',
      type: 'single',
      sentence: 'The diligent postman delivers the letters every morning.',
      highlightWord: 'delivers',
      explanation: 'Singular head subject "postman" takes third-person singular verb ending in -s.',
      ruleDemonstrated: 'Basic Present Tense Concord',
      difficulty: 'Foundation',
      boardRelevance: 'Core Syllabus Rule 1',
      teacherNote: 'Highlight that "-s" on verbs denotes singular, unlike nouns.',
      sectionTitle: '6.1 Fundamental Concord Principles',
    },
    {
      id: 'ex-demo-2',
      type: 'pair',
      sentence: 'The quality of these mangoes is outstanding.',
      incorrectSentence: 'The quality of these mangoes are outstanding.',
      correctSentence: 'The quality of these mangoes is outstanding.',
      whyExplanation: 'The true subject is "quality" (singular), not the plural noun "mangoes" inside the prepositional modifier.',
      explanation: 'Mental bracket test: cross out "of these mangoes" to see "The quality is".',
      ruleDemonstrated: 'Intervening Prepositional Phrase Rule',
      difficulty: 'Challenge',
      boardRelevance: 'High-frequency Board Exam Trap',
      teacherNote: 'Ask students to bracket the phrase starting with "of".',
      sectionTitle: '6.2 Intervening Prepositional Modifiers',
    },
    {
      id: 'ex-demo-3',
      type: 'pair',
      sentence: 'Neither the teacher nor the students were present at the auditorium.',
      incorrectSentence: 'Neither the teacher nor the students was present at the auditorium.',
      correctSentence: 'Neither the teacher nor the students were present at the auditorium.',
      whyExplanation: 'With correlative conjunctions (either...or, neither...nor), the verb agrees with the closer subject ("students" [plural]).',
      explanation: 'Proximity principle: the noun closest to the verb wins.',
      ruleDemonstrated: 'Correlative Proximity Principle',
      difficulty: 'Standard',
      boardRelevance: 'ICSE & CBSE Class 6 Standard',
      teacherNote: 'Point out that if the subjects swap order, the verb changes.',
      sectionTitle: '6.4 Correlative Conjunctions',
    },
    {
      id: 'ex-demo-4',
      type: 'single',
      sentence: 'Fifty thousand rupees is a significant amount to spend on a bicycle.',
      highlightWord: 'is',
      explanation: 'Units of money, distance, time, and weight take singular verbs when considered as a single aggregate sum.',
      ruleDemonstrated: 'Quantities and Measurement as Single Units',
      difficulty: 'Standard',
      boardRelevance: 'Applied Grammar Rule',
      teacherNote: 'Contrast with individual counting of rupee coins.',
      sectionTitle: '6.5 Units of Quantity & Measurement',
    },
  ];

  const allExamples = extractedExamples.length > 0 ? extractedExamples : demoExamples;

  const filteredExamples = allExamples.filter((ex) => {
    if (filterType !== 'all' && ex.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ex.sentence.toLowerCase().includes(q) ||
        ex.explanation.toLowerCase().includes(q) ||
        ex.ruleDemonstrated.toLowerCase().includes(q) ||
        (ex.incorrectSentence && ex.incorrectSentence.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddExample = () => {
    if (newType === 'single' && !newSentence.trim()) return;
    if (newType === 'pair' && (!newIncorrect.trim() || !newCorrect.trim())) return;

    const firstSection = chapter.sections[0];
    if (!firstSection) return;

    let newBlock: TextbookContentBlock;
    if (newType === 'single') {
      newBlock = {
        id: `blk-ex-${Date.now()}`,
        type: 'example',
        title: 'Grammar Example',
        order: firstSection.blocks.length + 1,
        visibility: 'student',
        exampleData: {
          type: 'simple',
          items: [
            {
              id: `item-${Date.now()}`,
              sentence: newSentence,
              highlightWord: newHighlight,
              explanation: newExplanation,
              isCorrect: true,
            },
          ],
        },
        authorNotes: newTeacherNote,
      };
    } else {
      newBlock = {
        id: `blk-pair-${Date.now()}`,
        type: 'example_pair',
        title: 'Correct vs Incorrect Pair',
        order: firstSection.blocks.length + 1,
        visibility: 'student',
        examplePair: {
          incorrect: newIncorrect,
          correct: newCorrect,
          why: newWhy || newExplanation,
          rule: newRule,
        },
        authorNotes: newTeacherNote,
      };
    }

    const updatedSections = chapter.sections.map((s, idx) =>
      idx === 0 ? { ...s, blocks: [...s.blocks, newBlock] } : s
    );

    onUpdateChapter({
      ...chapter,
      sections: updatedSections,
      lastSaved: new Date().toISOString(),
    });

    setShowAddModal(false);
    setNewSentence('');
    setNewHighlight('');
    setNewExplanation('');
    setNewIncorrect('');
    setNewCorrect('');
    setNewWhy('');
  };

  const handleGenerateExamplesAi = () => {
    const aiSamples = [
      {
        type: 'single' as const,
        sentence: 'The fleet of naval frigates sails toward the open harbour.',
        highlightWord: 'sails',
        explanation: 'Collective subject "fleet" acts as a singular nautical unit.',
        rule: 'Collective Noun Concord',
      },
      {
        type: 'pair' as const,
        incorrect: 'Each of the participants have received a golden certificate.',
        correct: 'Each of the participants has received a golden certificate.',
        why: 'The distributive pronoun "Each" is always grammatically singular.',
        rule: 'Distributive Pronoun Rule',
      },
    ];

    const targetSection = chapter.sections[0];
    if (!targetSection) return;

    const newBlocks: TextbookContentBlock[] = [
      {
        id: `blk-ai-ex-${Date.now()}-1`,
        type: 'example',
        title: 'AI Suggested Pedagogical Example',
        order: targetSection.blocks.length + 1,
        visibility: 'student',
        exampleData: {
          type: 'simple',
          items: [
            {
              id: `item-${Date.now()}-1`,
              sentence: aiSamples[0].sentence,
              highlightWord: aiSamples[0].highlightWord,
              explanation: aiSamples[0].explanation,
              isCorrect: true,
            },
          ],
        },
      },
      {
        id: `blk-ai-pair-${Date.now()}-2`,
        type: 'example_pair',
        title: 'AI Suggested Common Trap Pair',
        order: targetSection.blocks.length + 2,
        visibility: 'student',
        examplePair: {
          incorrect: aiSamples[1].incorrect,
          correct: aiSamples[1].correct,
          why: aiSamples[1].why,
          rule: aiSamples[1].rule,
        },
      },
    ];

    const updatedSections = chapter.sections.map((s, idx) =>
      idx === 0 ? { ...s, blocks: [...s.blocks, ...newBlocks] } : s
    );

    onUpdateChapter({
      ...chapter,
      sections: updatedSections,
      lastSaved: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner with VERITAS Luxury Palette */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-[#5A1832] text-[#FFFDF8] shrink-0 shadow-xs">
              <BookOpen className="w-6 h-6 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                  Production Stage 5
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                  {allExamples.length} Examples Mapped
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-[#292521] tracking-tight mt-0.5">
                Examples Studio &amp; Pedagogical Pair Lab
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Manage high-contrast illustrative sentences, highlighted grammar elements, and Correct vs. Incorrect diagnostic pairs.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleGenerateExamplesAi}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border border-[#CBBEAC] bg-[#EDE4D6] text-[#5A1832] hover:bg-[#CBBEAC]/40 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>+ Generate Suggested Examples</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Example</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#CBBEAC]/50">
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#EDE4D6] text-xs font-semibold border border-[#CBBEAC]">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                  : 'text-[#71685E] hover:text-[#292521]'
              }`}
            >
              All Examples ({allExamples.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('single')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'single'
                  ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                  : 'text-[#71685E] hover:text-[#292521]'
              }`}
            >
              Explanatory Sentences
            </button>
            <button
              type="button"
              onClick={() => setFilterType('pair')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterType === 'pair'
                  ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                  : 'text-[#71685E] hover:text-[#292521]'
              }`}
            >
              Correct / Incorrect Pairs
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#71685E]" />
            <input
              type="text"
              placeholder="Search example sentences, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
            />
          </div>
        </div>
      </div>

      {/* Examples List */}
      <div className="space-y-4">
        {filteredExamples.map((ex) => (
          <div
            key={ex.id}
            className="p-5 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs hover:border-[#5A1832]/60 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    ex.type === 'pair'
                      ? 'bg-purple-100 text-purple-900 border border-purple-200'
                      : 'bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]'
                  }`}
                >
                  {ex.type === 'pair' ? 'Diagnostic Pair' : 'Illustrative Sentence'}
                </span>
                <span className="text-xs font-semibold text-[#71685E]">
                  {ex.ruleDemonstrated}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDE4D6] font-semibold text-[#5A1832] border border-[#CBBEAC]">
                  {ex.difficulty}
                </span>
                <button
                  type="button"
                  onClick={() => onConvertExampleToExerciseQuestion(ex.sentence, ex.highlightWord)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-[#CBBEAC] hover:bg-[#CBBEAC]/40 text-[#292521] bg-[#EDE4D6] transition-colors cursor-pointer"
                  title="Convert this example into a question in the Exercise Studio"
                >
                  <ArrowUpRight className="w-3 h-3 text-[#5A1832]" />
                  <span>Convert to Exercise Question</span>
                </button>
              </div>
            </div>

            {/* Content Display based on type */}
            {ex.type === 'single' ? (
              <div className="p-3.5 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC]/60 space-y-2">
                <p className="font-serif text-base font-medium text-[#292521] leading-relaxed">
                  "{ex.sentence}"
                </p>
                {ex.highlightWord && (
                  <div className="flex items-center space-x-1.5 text-xs text-[#5A1832] font-semibold">
                    <span className="font-bold">Target Syntactic Focus:</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 font-mono font-bold text-amber-900 border border-amber-200">
                      {ex.highlightWord}
                    </span>
                  </div>
                )}
                <p className="text-xs text-[#71685E] leading-relaxed">
                  <span className="font-bold text-[#292521]">Explanation: </span>
                  {ex.explanation}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Incorrect Row */}
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                      Common Error (Incorrect)
                    </span>
                    <p className="font-serif text-sm font-medium text-rose-950 line-through">
                      "{ex.incorrectSentence || ex.sentence}"
                    </p>
                  </div>
                </div>

                {/* Correct Row */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                      Standard Concord (Correct)
                    </span>
                    <p className="font-serif text-sm font-bold text-emerald-950">
                      "{ex.correctSentence || ex.sentence}"
                    </p>
                  </div>
                </div>

                {/* Why Explanation */}
                <div className="p-2.5 rounded-xl bg-[#F6F0E7] text-xs text-[#292521] leading-relaxed border border-[#CBBEAC]/70">
                  <span className="font-bold text-[#5A1832] mr-1">WHY?</span>
                  {ex.whyExplanation || ex.explanation}
                </div>
              </div>
            )}

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-[11px] text-[#71685E] pt-1">
              <span className="italic">
                {ex.teacherNote ? `Teacher Note: ${ex.teacherNote}` : `Section: ${ex.sectionTitle || 'General'}`}
              </span>
              <span className="font-medium text-[#292521]">
                {ex.boardRelevance}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Example Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#CBBEAC] bg-[#FFFDF8] text-[#292521] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-3">
              <h3 className="font-bold text-base text-[#35101F] flex items-center space-x-2">
                <Plus className="w-4 h-4 text-[#C29A52]" />
                <span>Add Pedagogical Example</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#71685E] hover:text-[#292521] text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Type Selector */}
            <div className="flex rounded-xl p-1 bg-[#EDE4D6] text-xs font-semibold border border-[#CBBEAC]">
              <button
                type="button"
                onClick={() => setNewType('single')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  newType === 'single'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E]'
                }`}
              >
                Single Explanatory Sentence
              </button>
              <button
                type="button"
                onClick={() => setNewType('pair')}
                className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  newType === 'pair'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E]'
                }`}
              >
                Correct / Incorrect Diagnostic Pair
              </button>
            </div>

            {newType === 'single' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1 text-[#292521]">Example Sentence</label>
                  <textarea
                    rows={2}
                    value={newSentence}
                    onChange={(e) => setNewSentence(e.target.value)}
                    placeholder="e.g. The choir of talented singers performs gracefully."
                    className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-[#292521]">Highlighted Grammatical Element</label>
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="e.g. performs"
                    className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-[#292521]">Pedagogical Explanation</label>
                  <textarea
                    rows={2}
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Why this sentence is grammatically correct and what rule it clarifies..."
                    className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold block mb-1 text-rose-700">Incorrect Sentence (Common Mistake)</label>
                  <input
                    type="text"
                    value={newIncorrect}
                    onChange={(e) => setNewIncorrect(e.target.value)}
                    placeholder="e.g. One of the players are injured."
                    className="w-full p-2 rounded-xl border border-rose-300 bg-rose-50/70 text-rose-950 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-emerald-700">Correct Sentence</label>
                  <input
                    type="text"
                    value={newCorrect}
                    onChange={(e) => setNewCorrect(e.target.value)}
                    placeholder="e.g. One of the players is injured."
                    className="w-full p-2 rounded-xl border border-emerald-300 bg-emerald-50/70 text-emerald-950 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-[#292521]">Why? (Rule &amp; Diagnostic Test)</label>
                  <textarea
                    rows={2}
                    value={newWhy}
                    onChange={(e) => setNewWhy(e.target.value)}
                    placeholder="Explain why the incorrect form fails and how students can verify the correct answer..."
                    className="w-full p-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-[#292521]">Difficulty Level</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] font-semibold focus:outline-none"
                >
                  <option value="Foundation">Foundation</option>
                  <option value="Standard">Standard</option>
                  <option value="Challenge">Challenge / Trap</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#292521]">Rule Demonstrated</label>
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="e.g. Intervening Prepositional Phrase"
                  className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[#CBBEAC]/50">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs border border-[#CBBEAC] bg-[#EDE4D6] hover:bg-[#CBBEAC]/40 text-[#292521] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExample}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] shadow-xs transition-colors cursor-pointer"
              >
                Insert Example
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
