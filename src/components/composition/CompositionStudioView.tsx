import React, { useState } from 'react';
import {
  PenTool,
  FileText,
  Scale,
  BookOpen,
  Award,
  Sparkles,
  Printer,
  RotateCcw,
  Layers,
  CheckCircle2,
  Calendar,
  Download,
  Share2,
  GraduationCap,
} from 'lucide-react';
import {
  GrammarClassLevel,
  FormalLetterDraft,
  NoticeDraft,
  CompositionPrompt,
  CompositionGenre,
  CompositionEvaluationResult,
} from '../../types';
import {
  INITIAL_FORMAL_LETTER_DRAFTS,
  INITIAL_NOTICE_DRAFTS,
  EXEMPLAR_PROMPTS,
  evaluateCompositionLocally,
} from '../../utils/compositionData';
import { FormalLetterStudio } from './FormalLetterStudio';
import { NoticeWritingStudio } from './NoticeWritingStudio';
import { RubricsEvaluator } from './RubricsEvaluator';
import { ModelExemplarsLibrary } from './ModelExemplarsLibrary';

interface CompositionStudioViewProps {
  isDarkMode: boolean;
  selectedClass?: GrammarClassLevel;
  onNavigateToGrammarTextbook?: () => void;
}

export type CompositionStudioTab =
  | 'letter_studio'
  | 'notice_studio'
  | 'rubric_evaluator'
  | 'exemplars'
  | 'prompt_generator';

export const CompositionStudioView: React.FC<CompositionStudioViewProps> = ({
  isDarkMode,
  selectedClass: initialClass = 'Class 8',
  onNavigateToGrammarTextbook,
}) => {
  const [currentClass, setCurrentClass] = useState<GrammarClassLevel>(initialClass);
  const [activeTab, setActiveTab] = useState<CompositionStudioTab>('letter_studio');
  const [letterDraft, setLetterDraft] = useState<FormalLetterDraft>(() => {
    const saved = localStorage.getItem('composition_letter_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_FORMAL_LETTER_DRAFTS.editor_road_safety;
  });

  const [noticeDraft, setNoticeDraft] = useState<NoticeDraft>(() => {
    const saved = localStorage.getItem('composition_notice_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_NOTICE_DRAFTS.debate_competition;
  });

  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [generatedPromptTopic, setGeneratedPromptTopic] = useState<string>('Civic Road Safety & Traffic Calming');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<CompositionPrompt | null>(null);

  // Auto-save drafts
  const handleUpdateLetter = (updated: FormalLetterDraft) => {
    setLetterDraft(updated);
    try {
      localStorage.setItem('composition_letter_draft', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleUpdateNotice = (updated: NoticeDraft) => {
    setNoticeDraft(updated);
    try {
      localStorage.setItem('composition_notice_draft', JSON.stringify(updated));
    } catch (e) {}
  };

  // Prepare raw text for rubric evaluation based on active mode
  const currentRawText =
    activeTab === 'notice_studio'
      ? `${noticeDraft.issuingAuthority}\n${noticeDraft.noticeHeader}\n\n${noticeDraft.dateOfIssue}\n\n${noticeDraft.titleOrHeadline}\n\n${noticeDraft.body}\n\n${noticeDraft.signatoryName}\n${noticeDraft.signatoryDesignation}`
      : `${letterDraft.senderAddress}\n\n${letterDraft.date}\n\n${letterDraft.receiverDesignation}\n${letterDraft.receiverAddress}\n\nSubject: ${letterDraft.subject}\n\n${letterDraft.salutation}\n\n${letterDraft.bodyParagraph1}\n\n${letterDraft.bodyParagraph2}\n\n${letterDraft.bodyParagraph3}\n\n${letterDraft.complimentaryClose}\n${letterDraft.senderName}\n${letterDraft.senderDesignation || ''}`;

  const currentGenre: CompositionGenre = activeTab === 'notice_studio' ? 'notice' : 'formal_letter';

  const handleLoadExemplar = (prompt: CompositionPrompt) => {
    if (prompt.genre === 'notice') {
      setActiveTab('notice_studio');
      setNoticeDraft({
        issuingAuthority: 'CAMBRIDGE INTERNATIONAL SCHOOL, BENGALURU',
        noticeHeader: 'NOTICE',
        dateOfIssue: '22 October 2026',
        titleOrHeadline: prompt.title.toUpperCase(),
        body:
          prompt.sampleSolution?.modelText.split('\n\n')[3] ||
          'All students are hereby informed about the upcoming event. Interested candidates should submit their names to the undersigned by the deadline.',
        signatoryName: 'Ananya Deshmukh',
        signatoryDesignation: 'Secretary, Cultural Club',
        enclosedInBox: true,
      });
    } else {
      setActiveTab('letter_studio');
      setLetterDraft(INITIAL_FORMAL_LETTER_DRAFTS.editor_road_safety);
    }
  };

  const handleGenerateAIPrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const res = await fetch('/api/grammar/generate-composition-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre: currentGenre,
          classLevel: currentClass,
          topic: generatedPromptTopic,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomPrompt(data);
      } else {
        // Fallback prompt generator
        setCustomPrompt({
          id: `custom-${Date.now()}`,
          title: `${generatedPromptTopic} (${currentClass})`,
          genre: currentGenre,
          subCategory: currentGenre === 'notice' ? 'school_event' : 'letter_to_editor',
          classLevels: [currentClass],
          scenarioDescription: `You are the Head Boy/Girl of your school. Prepare a ${
            currentGenre === 'notice' ? 'notice in not more than 50 words' : 'formal letter in 120-150 words'
          } addressing ${generatedPromptTopic}. Ensure full adherence to prescribed curriculum formats.`,
          prescribedWordCount:
            currentGenre === 'notice' ? { min: 40, max: 55, target: 50 } : { min: 120, max: 150, target: 135 },
          maxMarks: 5,
          rubric: {
            formatMarks: 1,
            contentMarks: 2,
            expressionMarks: 2,
            accuracyPenaltyNotes: '-0.5 mark for word count infractions.',
            guidelines: ['Accurate sequential layout', 'Addressing all 5 Ws', 'Formal register'],
          },
        });
      }
    } catch (e) {
      setCustomPrompt({
        id: `custom-${Date.now()}`,
        title: `${generatedPromptTopic} (${currentClass})`,
        genre: currentGenre,
        subCategory: 'letter_to_editor',
        classLevels: [currentClass],
        scenarioDescription: `Draft a formal response regarding ${generatedPromptTopic} following CBSE/ICSE marking guidelines.`,
        prescribedWordCount: { min: 120, max: 150, target: 135 },
        maxMarks: 5,
        rubric: {
          formatMarks: 1,
          contentMarks: 2,
          expressionMarks: 2,
          accuracyPenaltyNotes: '-0.5 mark for spelling or format errors.',
          guidelines: ['3-tier paragraph structure', 'Formal closing'],
        },
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handlePrintWorksheet = () => {
    window.print();
  };

  return (
    <div
      id="composition-studio-view"
      className={`flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0b0f17] text-slate-100' : 'bg-[#faf8f5] text-stone-900'
      }`}
    >
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-white">
                  Composition & Writing Skills Studio
                </h1>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Rubrics &amp; Formats
                </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-slate-400 mt-0.5">
                Formal letter block anatomies, 50-word notice frames, CBSE/ICSE board marking rubrics, and automated AI grading
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls: Class Selector + Textbook Cross-link + Print button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Selector */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-stone-600 dark:text-slate-400 font-medium">Class:</span>
            <select
              value={currentClass}
              onChange={(e) => setCurrentClass(e.target.value as GrammarClassLevel)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 focus:border-amber-500'
                  : 'bg-white border-stone-200 text-stone-800 focus:border-amber-600'
              }`}
            >
              {(
                [
                  'Class 3',
                  'Class 4',
                  'Class 5',
                  'Class 6',
                  'Class 7',
                  'Class 8',
                  'Class 9',
                  'Class 10',
                  'Class 11',
                  'Class 12',
                ] as GrammarClassLevel[]
              ).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowPrintModal(true)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 border transition-all ${
              isDarkMode
                ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100 shadow-xs'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Printable Worksheet</span>
          </button>

          {onNavigateToGrammarTextbook && (
            <button
              onClick={onNavigateToGrammarTextbook}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 border transition-all ${
                isDarkMode
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Back to Textbook</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'letter_studio', label: 'Formal Letter Studio', icon: FileText, badge: '8-Part Anatomy' },
          { id: 'notice_studio', label: 'Notice Writing Studio', icon: PenTool, badge: '50-Word Box' },
          { id: 'rubric_evaluator', label: 'Board Rubrics & Grading', icon: Scale, badge: 'CBSE / ICSE' },
          { id: 'exemplars', label: 'Model Exemplars Library', icon: BookOpen, badge: 'Full Marks' },
          { id: 'prompt_generator', label: 'Exam Prompt Generator', icon: Sparkles, badge: 'AI Assessor' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CompositionStudioTab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-normal ${
                  isActive ? 'bg-amber-500/40 text-white' : 'bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-slate-300'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Studio Screen Container */}
      <div className="flex-1">
        {activeTab === 'letter_studio' && (
          <FormalLetterStudio
            draft={letterDraft}
            onUpdateDraft={handleUpdateLetter}
            selectedClass={currentClass}
            isDarkMode={isDarkMode}
            onRunEvaluation={() => setActiveTab('rubric_evaluator')}
          />
        )}

        {activeTab === 'notice_studio' && (
          <NoticeWritingStudio
            draft={noticeDraft}
            onUpdateDraft={handleUpdateNotice}
            selectedClass={currentClass}
            isDarkMode={isDarkMode}
            onRunEvaluation={() => setActiveTab('rubric_evaluator')}
          />
        )}

        {activeTab === 'rubric_evaluator' && (
          <RubricsEvaluator
            genre={currentGenre}
            subCategory={currentGenre === 'notice' ? 'school_event' : 'letter_to_editor'}
            classLevel={currentClass}
            rawText={currentRawText}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'exemplars' && (
          <ModelExemplarsLibrary
            onSelectPromptForStudio={handleLoadExemplar}
            isDarkMode={isDarkMode}
            selectedClass={currentClass}
          />
        )}

        {activeTab === 'prompt_generator' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div
              className={`p-6 md:p-8 rounded-2xl border ${
                isDarkMode ? 'bg-[#151c28] border-slate-700/80' : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">
                  Board Exam Writing Prompt Generator
                </h3>
              </div>
              <p className="text-sm text-stone-600 dark:text-slate-400 mb-5 leading-relaxed">
                Generate authentic K-12 board examination writing prompts tailored to grade levels, complete with situation scenarios, input hints, word count prescriptions, and marking rubrics.
              </p>

              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <input
                  type="text"
                  value={generatedPromptTopic}
                  onChange={(e) => setGeneratedPromptTopic(e.target.value)}
                  placeholder="Enter a civic, academic, or institutional scenario (e.g. Science Exhibition, Defective Bicycle, Library Hours)..."
                  className={`flex-1 p-3 rounded-xl text-sm border transition-all ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-600'
                  }`}
                />
                <button
                  onClick={handleGenerateAIPrompt}
                  disabled={isGeneratingPrompt}
                  className="px-5 py-3 rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-xs flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingPrompt ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPrompt ? 'Formulating Prompt...' : 'Generate Exam Prompt'}</span>
                </button>
              </div>

              {customPrompt && (
                <div
                  className={`p-6 rounded-xl border space-y-3.5 ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-200 dark:border-slate-800">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Generated Prompt for {currentClass}
                    </span>
                    <span className="text-sm font-mono font-semibold text-stone-600 dark:text-slate-400">
                      Max: {customPrompt.maxMarks} Marks ({customPrompt.prescribedWordCount.target} words)
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 dark:text-white">{customPrompt.title}</h4>
                  <p className="text-base font-serif text-stone-800 dark:text-slate-200 leading-relaxed italic">
                    "{customPrompt.scenarioDescription}"
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-stone-600 dark:text-slate-400 font-medium">
                      Rubric: Format {customPrompt.rubric.formatMarks}m • Content {customPrompt.rubric.contentMarks}m • Expression {customPrompt.rubric.expressionMarks}m
                    </div>
                    <button
                      onClick={() => handleLoadExemplar(customPrompt)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 transition-all cursor-pointer shadow-xs"
                    >
                      Draft Solution in Studio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Printable Worksheet Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 md:p-8 shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#151c28] border-slate-700 text-slate-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200 dark:border-slate-700">
              <div className="flex items-center space-x-2.5">
                <Printer className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-serif font-bold">Printable Examination Paper &amp; Rubric Key</h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-300 hover:bg-stone-300 font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Printable Paper Body */}
            <div className="p-6 md:p-8 rounded-xl border border-stone-300 dark:border-slate-700 bg-[#fffdfa] text-stone-900 font-serif space-y-5 text-sm">
              <div className="text-center font-sans space-y-1 border-b pb-4 border-stone-300">
                <div className="font-extrabold uppercase tracking-wide text-base">
                  ENGLISH LANGUAGE &amp; LITERATURE ASSESSMENT
                </div>
                <div className="text-xs text-stone-600">
                  Section B: Writing Skills • {currentClass} • Maximum Marks: 5
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <div className="font-bold text-stone-900 text-sm">
                  Question:{' '}
                  {currentGenre === 'notice'
                    ? 'NOTICE WRITING (50 WORDS)'
                    : 'FORMAL LETTER (120-150 WORDS)'}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed">
                  {currentGenre === 'notice'
                    ? 'Draft a notice in not more than 50 words for your school bulletin board announcing an upcoming inter-house or inter-school event. State all essential 5 Ws and enclose in a neat rectangular box.'
                    : 'Write a formal letter to the concerned authority or editor regarding a pressing civic, academic, or consumer grievance in 120-150 words following standard 8-part block anatomy.'}
                </p>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="font-sans p-3.5 rounded-lg bg-stone-100 border border-stone-200 text-xs space-y-1.5">
                <div className="font-bold text-stone-800 uppercase tracking-wider">
                  CBSE / ICSE Marking Scheme:
                </div>
                <div className="grid grid-cols-3 gap-2 text-stone-700 font-medium">
                  <div>• Format: 1 Mark</div>
                  <div>• Content (5 Ws): 2 Marks</div>
                  <div>• Expression &amp; Fluency: 2 Marks</div>
                </div>
              </div>

              {/* Blank Student Workspace Area */}
              <div className="pt-2">
                <div className="font-sans text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                  Student Response Workspace:
                </div>
                {currentGenre === 'notice' ? (
                  <div className="h-44 border-2 border-stone-800 rounded-xs flex items-center justify-center text-stone-500 italic text-sm">
                    [Students must enclose their 50-word notice inside this bordered box]
                  </div>
                ) : (
                  <div className="h-48 border border-dashed border-stone-300 rounded p-4 space-y-3 text-sm">
                    <div className="border-b border-stone-200 pb-4 text-stone-500 italic">
                      Sender's Address &amp; Date
                    </div>
                    <div className="border-b border-stone-200 pb-4 text-stone-500 italic">
                      Receiver's Designation &amp; Subject Line
                    </div>
                    <div className="text-stone-500 italic">3-Tier Letter Body &amp; Sign-off</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-end space-x-2">
              <button
                onClick={handlePrintWorksheet}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 shadow-xs flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Paper (Ctrl + P)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
