import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Play,
  Layers,
  Sparkles,
  Plus,
  Search,
  CheckCircle,
  FileText,
  Calendar,
  ChevronRight,
  Filter,
  Download,
  GitFork,
  Brain,
  PenTool,
  BookMarked,
  SlidersHorizontal,
  Award,
  Globe2,
  GitCompare,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarDefinition,
  GrammarQuestion,
  GrammarExercise,
  GrammarTestSeries,
  SentenceDiagramData,
} from '../types';
import { GrammarDefinitionsTab } from './GrammarDefinitionsTab';
import { GrammarExercisesTab } from './GrammarExercisesTab';
import { GrammarQuizRunnerTab } from './GrammarQuizRunnerTab';
import { GrammarTestSeriesTab } from './GrammarTestSeriesTab';
import { GrammarAICopilotModal } from './GrammarAICopilotModal';
import { SpiralCurriculumMatrixView } from './SpiralCurriculumMatrixView';
import { SentenceDiagrammerStudio } from './sentence-diagrammer/SentenceDiagrammerStudio';
import { SpacedRepetitionDeckView } from './SpacedRepetitionDeckView';
import { CompositionStudioView } from './composition/CompositionStudioView';
import { TextbookLayoutExporterView } from './textbook/TextbookLayoutExporterView';
import { BoardBlueprintMatrixView } from './BoardBlueprintMatrixView';
import { GrammarBookAuthoringStudioView } from './textbook/GrammarBookAuthoringStudioView';
import { QuestionBankStudioView } from './QuestionBankStudioView';
import { GrammarConceptsStudioView } from './GrammarConceptsStudioView';
import { AssessmentBuilderStudioView } from './AssessmentBuilderStudioView';
import { DifferentiatedWorksheetsView } from './differentiated/DifferentiatedWorksheetsView';
import { GrammarQuizStudioView } from './GrammarQuizStudioView';
import { GlobalContextSelector } from './series/GlobalContextSelector';
import { SeriesDashboardView } from './series/SeriesDashboardView';
import { CurriculumMappingView } from './series/CurriculumMappingView';
import { ChapterAuthoringStudio } from './chapter-studio/ChapterAuthoringStudio';

export type GrammarViewMode =
  | 'series_dashboard'
  | 'curriculum_mapping'
  | 'textbook'
  | 'chapter_studio'
  | 'concepts'
  | 'question_bank'
  | 'assessment'
  | 'matrix'
  | 'blueprints'
  | 'diagrammer'
  | 'worksheets'
  | 'quiz'
  | 'flashcards'
  | 'composition'
  | 'layout_exporter';

interface GrammarSeriesViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  initialViewMode?: GrammarViewMode;
}

export const GrammarSeriesView: React.FC<GrammarSeriesViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  initialViewMode,
}) => {
  const [viewMode, setViewMode] = useState<GrammarViewMode>(initialViewMode || 'textbook');
  const [diagrammerSentence, setDiagrammerSentence] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 6'
  );
  const [activeTab, setActiveTab] = useState<
    'definitions' | 'exercises' | 'quiz_runner' | 'test_series'
  >('definitions');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  // New topic modal state
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Parts of Speech');
  const [newTopicOverview, setNewTopicOverview] = useState('');

  // Keep selectedClass synchronized with authoritative seriesProject state
  useEffect(() => {
    if (seriesProject.selectedClass && seriesProject.selectedClass !== selectedClass) {
      setSelectedClass(seriesProject.selectedClass);
    }
  }, [seriesProject.selectedClass]);

  const allClasses: GrammarClassLevel[] = [
    'Class 1',
    'Class 2',
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
  ];

  const currentBook = seriesProject.books[selectedClass] || {
    classLevel: selectedClass,
    title: `${seriesProject.seriesTitle} - ${selectedClass}`,
    ageBracket: 'School Level',
    description: `Comprehensive grammar, syntax, and writing coursebook for ${selectedClass}.`,
    topics: [],
    testPapers: [],
    writingTopics: [],
  };

  const activeTopic = currentBook.topics.find((t) => t.id === selectedTopicId) || currentBook.topics[0];

  const handleSelectClass = (cls: GrammarClassLevel) => {
    setSelectedClass(cls);
    const book = seriesProject.books[cls];
    if (book && book.topics.length > 0) {
      setSelectedTopicId(book.topics[0].id);
    } else {
      setSelectedTopicId('');
    }
  };

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;

    const newTopic: GrammarTopic = {
      id: `topic_${Date.now()}`,
      title: newTopicTitle.trim(),
      category: newTopicCategory,
      classLevel: selectedClass,
      overview: newTopicOverview.trim() || `Core grammar mastery unit on ${newTopicTitle.trim()} for ${selectedClass}.`,
      learningObjectives: [
        `Master fundamental concepts of ${newTopicTitle.trim()}`,
        `Identify and apply correct usage in sentences`,
        `Avoid common syntactic and punctuation errors`,
      ],
      notesAndTheoryMarkdown: `## ${newTopicTitle.trim()}\n\nWelcome to ${newTopicTitle.trim()}. Review definitions, study real-world contextual examples, and solve the practice exercises below.\n`,
      definitions: [],
      exercises: [],
      testSeries: [],
    };

    const updatedTopics = [...currentBook.topics, newTopic];
    const updatedBook = { ...currentBook, topics: updatedTopics };

    onUpdateSeriesProject({
      ...seriesProject,
      books: { ...seriesProject.books, [selectedClass]: updatedBook },
      lastUpdated: new Date().toISOString(),
    });

    setSelectedTopicId(newTopic.id);
    setNewTopicTitle('');
    setNewTopicOverview('');
    setShowNewTopicModal(false);
  };

  const handleUpdateTopic = (updatedTopic: GrammarTopic) => {
    const updatedTopics = currentBook.topics.map((t) =>
      t.id === updatedTopic.id ? updatedTopic : t
    );
    const updatedBook = { ...currentBook, topics: updatedTopics };

    onUpdateSeriesProject({
      ...seriesProject,
      books: { ...seriesProject.books, [selectedClass]: updatedBook },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleApplyAiContent = (payload: {
    mode: 'definitions' | 'exercises' | 'test_series';
    definition?: GrammarDefinition;
    exercise?: GrammarExercise;
    testSeries?: GrammarTestSeries;
  }) => {
    if (!activeTopic) return;

    if (payload.mode === 'definitions' && payload.definition) {
      const updatedTopic: GrammarTopic = {
        ...activeTopic,
        definitions: [...activeTopic.definitions, payload.definition],
      };
      handleUpdateTopic(updatedTopic);
      setActiveTab('definitions');
    } else if (payload.mode === 'exercises' && payload.exercise) {
      const updatedTopic: GrammarTopic = {
        ...activeTopic,
        exercises: [...activeTopic.exercises, payload.exercise],
      };
      handleUpdateTopic(updatedTopic);
      setActiveTab('exercises');
    } else if (payload.mode === 'test_series' && payload.testSeries) {
      const updatedTopic: GrammarTopic = {
        ...activeTopic,
        testSeries: [...activeTopic.testSeries, payload.testSeries],
      };
      handleUpdateTopic(updatedTopic);
      setActiveTab('test_series');
    }
  };

  const filteredTopics = currentBook.topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="grammar-lms-root" className="flex-1 flex flex-col overflow-hidden select-none bg-[#EDE4D6] dark:bg-[#1e0f18] min-h-0 text-[#292521] dark:text-[#F6F0E7]">
      {/* Unified Single Contextual Subheader */}
      <div className="border-b border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 z-10">
        {/* Left: Global Multi-Board Context Selector */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <GlobalContextSelector
            seriesProject={seriesProject}
            onUpdateSeriesProject={(updated) => {
              onUpdateSeriesProject(updated);
              if (updated.selectedClass !== selectedClass) {
                handleSelectClass(updated.selectedClass);
              }
            }}
            onNavigateToEdition={(editionId) => {
              const ed = seriesProject.editions?.[editionId];
              if (ed) {
                handleSelectClass(ed.equivalentClass);
              }
              setViewMode('textbook');
            }}
          />
        </div>

        {/* Center: Contextual Area Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
          {[
            { id: 'series_dashboard', label: 'Series Studio', icon: Globe2 },
            { id: 'curriculum_mapping', label: 'Curriculum Mapping', icon: GitCompare },
            { id: 'textbook', label: 'Coursebook', icon: BookOpen },
            { id: 'chapter_studio', label: 'Chapter Studio', icon: Sparkles },
            { id: 'concepts', label: 'Concepts', icon: BookMarked },
            { id: 'question_bank', label: 'Question Bank', icon: Layers },
            { id: 'assessment', label: 'Assessments', icon: Award },
            { id: 'worksheets', label: 'Worksheets', icon: FileText },
            { id: 'quiz', label: 'Quiz Runner', icon: HelpCircle },
            { id: 'matrix', label: 'Scope & Sequence', icon: Calendar },
            { id: 'blueprints', label: 'Board Blueprints', icon: Award },
            { id: 'diagrammer', label: 'Sentence Diagrammer', icon: GitFork },
            { id: 'flashcards', label: 'SRS Flashcards', icon: Brain },
            { id: 'composition', label: 'Composition', icon: PenTool },
            { id: 'layout_exporter', label: 'Print Layout', icon: Download },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = viewMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id as any)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                  isSel
                    ? 'bg-[#5A1832] text-[#F6F0E7] dark:bg-[#C29A52] dark:text-[#35101F] font-semibold shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#35101F] dark:hover:text-[#F6F0E7] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {viewMode === 'textbook' && (
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="min-h-[38px] px-3.5 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">New Unit</span>
            </button>
          )}

          <button
            onClick={() => setShowAiModal(true)}
            disabled={!activeTopic}
            className="min-h-[38px] px-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622] text-xs font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50 text-[#35101F] dark:text-[#F6F0E7]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9A7438] dark:text-[#C29A52]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT: Switcher between major modes */}
      {viewMode === 'series_dashboard' ? (
        <div className="flex-1 w-full min-h-0 overflow-y-auto bg-[#fbfbfa] dark:bg-[#0f1011]">
          <SeriesDashboardView
            seriesProject={seriesProject}
            onUpdateSeriesProject={onUpdateSeriesProject}
            onOpenBookEdition={(editionId) => {
              const ed = seriesProject.editions?.[editionId];
              if (ed) {
                handleSelectClass(ed.equivalentClass);
              }
              setViewMode('textbook');
            }}
            onOpenCurriculumMapping={() => setViewMode('curriculum_mapping')}
            onOpenScopeSequence={() => setViewMode('matrix')}
          />
        </div>
      ) : viewMode === 'curriculum_mapping' ? (
        <div className="flex-1 w-full min-h-0 overflow-y-auto bg-[#fbfbfa] dark:bg-[#0f1011]">
          <CurriculumMappingView
            seriesProject={seriesProject}
            onUpdateSeriesProject={onUpdateSeriesProject}
            onNavigateToEdition={(editionId) => {
              const ed = seriesProject.editions?.[editionId];
              if (ed) {
                handleSelectClass(ed.equivalentClass);
              }
              setViewMode('textbook');
            }}
          />
        </div>
      ) : viewMode === 'matrix' ? (
        <SpiralCurriculumMatrixView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          onNavigateToTopicInClass={(targetClass, targetTopicId) => {
            handleSelectClass(targetClass);
            if (targetTopicId) setSelectedTopicId(targetTopicId);
            setViewMode('textbook');
          }}
          isDarkMode={isDarkMode}
        />
      ) : viewMode === 'blueprints' ? (
        <BoardBlueprintMatrixView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToCoursebook={(cls) => {
            if (cls) handleSelectClass(cls);
            setViewMode('textbook');
            setActiveTab('test_series');
          }}
        />
      ) : viewMode === 'diagrammer' ? (
        <SentenceDiagrammerStudio
          initialSentence={diagrammerSentence}
          targetClass={selectedClass}
          isDarkMode={isDarkMode}
          onSendToTextbook={(diagram: SentenceDiagramData) => {
            if (activeTopic) {
              const diagramNote = `\n\n#### Syntactic Diagram Analysis: "${diagram.sentence}"\n- **Classification:** ${diagram.classification.toUpperCase()} Sentence\n- **Strand:** ${diagram.strand}\n- **Pedagogical Takeaway:** ${diagram.pedagogicalNotes}\n- **Clauses:**\n${diagram.clauses.map((c, i) => `  ${i + 1}. [${c.typeName}] "${c.text}" (Subject: ${c.subject.headNoun}, Finite Verb: ${c.predicate.verbPhrase})`).join('\n')}\n`;
              const updatedTopic: GrammarTopic = {
                ...activeTopic,
                notesAndTheoryMarkdown: `${activeTopic.notesAndTheoryMarkdown}${diagramNote}`,
              };
              const updatedTopics = currentBook.topics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t));
              const updatedBook = { ...currentBook, topics: updatedTopics };
              onUpdateSeriesProject({
                ...seriesProject,
                books: { ...seriesProject.books, [selectedClass]: updatedBook },
                lastUpdated: new Date().toISOString(),
              });
              setViewMode('textbook');
            }
          }}
        />
      ) : viewMode === 'flashcards' ? (
        <SpacedRepetitionDeckView
          isDarkMode={isDarkMode}
          selectedClass={selectedClass}
          onNavigateToGrammarTextbook={() => setViewMode('textbook')}
        />
      ) : viewMode === 'composition' ? (
        <CompositionStudioView
          isDarkMode={isDarkMode}
          selectedClass={selectedClass}
          onNavigateToGrammarTextbook={() => setViewMode('textbook')}
        />
      ) : viewMode === 'layout_exporter' ? (
        <TextbookLayoutExporterView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToMatrix={() => setViewMode('matrix')}
          onNavigateToClassTextbook={(cls) => {
            handleSelectClass(cls);
            setViewMode('textbook');
          }}
        />
      ) : viewMode === 'concepts' ? (
        <GrammarConceptsStudioView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToDiagrammer={(sentence) => {
            setDiagrammerSentence(sentence);
            setViewMode('diagrammer');
          }}
          onNavigateToTextbook={() => setViewMode('textbook')}
        />
      ) : viewMode === 'question_bank' ? (
        <QuestionBankStudioView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToAssessments={() => setViewMode('assessment')}
        />
      ) : viewMode === 'assessment' ? (
        <AssessmentBuilderStudioView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToBlueprintMatrix={() => setViewMode('blueprints')}
        />
      ) : viewMode === 'worksheets' ? (
        <DifferentiatedWorksheetsView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
        />
      ) : viewMode === 'quiz' ? (
        <GrammarQuizStudioView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
        />
      ) : viewMode === 'chapter_studio' ? (
        <ChapterAuthoringStudio
          initialTopic={
            activeTopic ||
            currentBook.topics[0] || {
              id: 'topic-default-sv',
              title: 'Subject-Verb Agreement',
              category: 'Syntax & Concord',
              classLevel: selectedClass,
              overview: 'Comprehensive rules of subject-verb agreement.',
              learningObjectives: ['Master grammatical concord.'],
              notesAndTheoryMarkdown: '',
              definitions: [],
              exercises: [],
              testSeries: [],
            }
          }
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          onBackToDashboard={() => setViewMode('textbook')}
          isDarkMode={isDarkMode}
        />
      ) : (
        <GrammarBookAuthoringStudioView
          seriesProject={seriesProject}
          onUpdateSeriesProject={onUpdateSeriesProject}
          isDarkMode={isDarkMode}
          onNavigateToDiagrammer={(sentence) => {
            setDiagrammerSentence(sentence);
            setViewMode('diagrammer');
          }}
          onNavigateToQuestionBank={() => setViewMode('question_bank')}
          onNavigateToAssessments={() => setViewMode('assessment')}
          onOpenChapterStudio={(topicId) => {
            if (topicId) setSelectedTopicId(topicId);
            setViewMode('chapter_studio');
          }}
        />
      )}

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#35101F]/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
              Create New Grammar Topic ({selectedClass})
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#71685E] dark:text-[#c9b9a6] mb-1.5 font-mono uppercase">
                  Topic Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Active and Passive Voice / Direct &amp; Indirect Speech"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#71685E] dark:text-[#c9b9a6] mb-1.5 font-mono uppercase">
                  Grammar Category
                </label>
                <select
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] outline-none"
                >
                  <option value="Parts of Speech">Parts of Speech</option>
                  <option value="Syntax &amp; Concord">Syntax &amp; Concord (Subject-Verb)</option>
                  <option value="Tenses &amp; Time">Tenses &amp; Aspect</option>
                  <option value="Voice &amp; Speech">Voice &amp; Reported Speech</option>
                  <option value="Clauses &amp; Complex Sentences">Clauses &amp; Complex Sentences</option>
                  <option value="Prepositions &amp; Phrasal Verbs">Prepositions &amp; Phrasal Verbs</option>
                  <option value="Transformation of Sentences">Transformation of Sentences</option>
                  <option value="Error Spotting &amp; Editing">Error Spotting &amp; Editing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#71685E] dark:text-[#c9b9a6] mb-1.5 font-mono uppercase">
                  Overview / Learning Objectives (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder={`Summary of what ${selectedClass} students should master...`}
                  value={newTopicOverview}
                  onChange={(e) => setNewTopicOverview(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] placeholder-[#71685E] dark:placeholder-[#a89989] outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTopicModal(false)}
                className="min-h-[42px] px-4 py-1.5 rounded-xl text-xs font-semibold border border-[#CBBEAC] dark:border-[#4f2c3d] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#71685E] dark:text-[#c9b9a6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTopic}
                className="min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#F6F0E7] hover:bg-[#35101F] shadow-xs transition-colors"
              >
                Create Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Copilot Modal with PDF / Document Attachment Support */}
      {activeTopic && (
        <GrammarAICopilotModal
          topic={activeTopic}
          classLevel={selectedClass}
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          onApplyGeneratedContent={handleApplyAiContent}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
