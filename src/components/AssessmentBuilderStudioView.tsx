import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  Award,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Info,
  ChevronUp,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Search,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  GrammarTopic,
  GrammarTestSeries,
  GrammarTestSection,
  GrammarQuestion,
  BoardQuestionBlueprint,
} from '../types';
import {
  PRECONFIGURED_BOARD_BLUEPRINTS,
  auditTestPaperAgainstBlueprint,
  createDraftTestFromBlueprint,
} from '../utils/boardBlueprintEngine';
import { DEMO_CBSE_CLASS6_BLUEPRINT } from '../utils/boardBlueprintIntelligenceData';
import { EXTENDED_BOARD_BLUEPRINTS } from '../utils/boardBlueprintDirectory';
import { CreateAssessmentDialog } from './common/CreateAssessmentDialog';
import { ALL_INDIAN_CLASSES } from '../utils/activeBookContext';

interface AssessmentBuilderStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  isDarkMode: boolean;
  onNavigateToBlueprintMatrix?: () => void;
}

export const AssessmentBuilderStudioView: React.FC<AssessmentBuilderStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  isDarkMode,
  onNavigateToBlueprintMatrix,
}) => {
  const [selectedClass, setSelectedClass] = useState<GrammarClassLevel>(
    seriesProject.selectedClass || 'Class 6'
  );
  const [selectedPaperId, setSelectedPaperId] = useState<string>('');
  const [activeAuditTab, setActiveAuditTab] = useState<
    'overview' | 'blueprint' | 'difficulty' | 'cognitive'
  >('overview');
  const [showBlueprintDrawer, setShowBlueprintDrawer] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<string | null>(null); // sectionId
  const [selectedAuditDetail, setSelectedAuditDetail] = useState<string | null>(null);
  const [showBlueprintPickerModal, setShowBlueprintPickerModal] = useState(false);
  const [isCreateAssessmentDialogOpen, setIsCreateAssessmentDialogOpen] = useState(false);

  // Synchronize local class selection with canonical seriesProject.selectedClass
  useEffect(() => {
    if (seriesProject.selectedClass && seriesProject.selectedClass !== selectedClass) {
      setSelectedClass(seriesProject.selectedClass);
    }
  }, [seriesProject.selectedClass]);

  const handleClassChange = (newCls: GrammarClassLevel) => {
    setSelectedClass(newCls);
    setSelectedPaperId('');
    onUpdateSeriesProject({
      ...seriesProject,
      selectedClass: newCls,
      lastUpdated: new Date().toISOString(),
    });
  };

  const availableBlueprints = useMemo(() => {
    const saved = seriesProject.savedBlueprints || [];
    const savedIds = new Set(saved.map((b) => b.id));
    const presets = EXTENDED_BOARD_BLUEPRINTS;
    return [...saved, ...presets.filter((b) => !savedIds.has(b.id))];
  }, [seriesProject.savedBlueprints]);

  const handleBuildFromBlueprint = (blueprint: BoardQuestionBlueprint) => {
    const targetClass = blueprint.targetClass || selectedClass;
    setSelectedClass(targetClass);

    const draftPaper = createDraftTestFromBlueprint(blueprint);
    const targetBook = seriesProject.books[targetClass] || currentBook;

    if (!targetBook.topics || targetBook.topics.length === 0) {
      alert(`No topics found in ${targetClass}. Please ensure chapters/topics exist first.`);
      return;
    }

    const targetTopic = targetBook.topics[0];
    const updatedTopics = targetBook.topics.map((top) => {
      if (top.id === targetTopic.id) {
        return {
          ...top,
          testSeries: [...top.testSeries, draftPaper],
        };
      }
      return top;
    });

    const updatedProject: GrammarSeriesProject = {
      ...seriesProject,
      selectedClass: targetClass,
      books: {
        ...seriesProject.books,
        [targetClass]: {
          ...targetBook,
          topics: updatedTopics,
        },
      },
    };

    onUpdateSeriesProject(updatedProject);
    setSelectedPaperId(draftPaper.id);
    setShowBlueprintPickerModal(false);
  };

  const allClasses: GrammarClassLevel[] = ALL_INDIAN_CLASSES;

  const currentBook = seriesProject.books[selectedClass] || {
    classLevel: selectedClass,
    title: `${seriesProject.seriesTitle} - ${selectedClass}`,
    topics: [],
  };

  // Find all test papers across topics
  const allPapers = useMemo(() => {
    const list: Array<{
      paper: GrammarTestSeries;
      topicId: string;
      topicTitle: string;
    }> = [];

    currentBook.topics.forEach((topic) => {
      topic.testSeries.forEach((ts) => {
        list.push({
          paper: ts,
          topicId: topic.id,
          topicTitle: topic.title,
        });
      });
    });

    return list;
  }, [currentBook]);

  // Ensure an active paper
  const activePaperEntry = useMemo(() => {
    if (selectedPaperId) {
      const found = allPapers.find((p) => p.paper.id === selectedPaperId);
      if (found) return found;
    }
    return allPapers[0] || null;
  }, [selectedPaperId, allPapers]);

  const activePaper = activePaperEntry?.paper;

  // Real-time calculation of total marks
  const totalAssignedMarks = useMemo(() => {
    if (!activePaper) return 0;
    return activePaper.sections.reduce(
      (secAcc, sec) => secAcc + sec.questions.reduce((qAcc, q) => qAcc + q.marks, 0),
      0
    );
  }, [activePaper]);

  const totalAssignedQuestions = useMemo(() => {
    if (!activePaper) return 0;
    return activePaper.sections.reduce((secAcc, sec) => secAcc + sec.questions.length, 0);
  }, [activePaper]);

  // Board Blueprint compliance
  const activeBlueprint: BoardQuestionBlueprint = useMemo(() => {
    const board = seriesProject.targetBoard;
    const found = PRECONFIGURED_BOARD_BLUEPRINTS.find((bp) => {
      if (board === 'ICSE') return bp.board === 'ICSE';
      if (board === 'Cambridge / IGCSE') return bp.board === 'Cambridge_Checkpoint' || bp.board === 'Cambridge_IGCSE';
      return bp.board === 'CBSE';
    });
    return found || PRECONFIGURED_BOARD_BLUEPRINTS[0];
  }, [seriesProject.targetBoard]);

  const blueprintAudit = useMemo(() => {
    if (!activePaper) return null;
    const allQuestions = activePaper.sections.flatMap((sec) => sec.questions);
    return auditTestPaperAgainstBlueprint(activeBlueprint, allQuestions);
  }, [activePaper, activeBlueprint]);

  // Difficulty breakdown
  const difficultyStats = useMemo(() => {
    if (!activePaper || totalAssignedQuestions === 0) {
      return { easy: 0, moderate: 0, challenging: 0 };
    }
    let e = 0,
      m = 0,
      c = 0;
    activePaper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.difficulty === 'Easy') e++;
        else if ((q.difficulty as string) === 'Challenging' || q.difficulty === 'Hard') c++;
        else m++;
      });
    });
    return {
      easy: Math.round((e / totalAssignedQuestions) * 100),
      moderate: Math.round((m / totalAssignedQuestions) * 100),
      challenging: Math.round((c / totalAssignedQuestions) * 100),
      counts: { e, m, c },
    };
  }, [activePaper, totalAssignedQuestions]);

  // Cognitive levels breakdown (Bloom's Revised Taxonomy)
  const cognitiveStats = useMemo(() => {
    if (!activePaper || totalAssignedQuestions === 0) {
      return { remembering: 0, understanding: 0, applying: 0, analysing: 0, evaluating: 0 };
    }
    const counts = { remembering: 0, understanding: 0, applying: 0, analysing: 0, evaluating: 0 };
    activePaper.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const lvl = (q.cognitiveLevel || 'Applying').toLowerCase();
        if (lvl.includes('rememb')) counts.remembering++;
        else if (lvl.includes('underst')) counts.understanding++;
        else if (lvl.includes('apply')) counts.applying++;
        else if (lvl.includes('analy')) counts.analysing++;
        else if (lvl.includes('eval')) counts.evaluating++;
        else counts.applying++;
      });
    });
    return {
      remembering: Math.round((counts.remembering / totalAssignedQuestions) * 100),
      understanding: Math.round((counts.understanding / totalAssignedQuestions) * 100),
      applying: Math.round((counts.applying / totalAssignedQuestions) * 100),
      analysing: Math.round((counts.analysing / totalAssignedQuestions) * 100),
      evaluating: Math.round((counts.evaluating / totalAssignedQuestions) * 100),
      counts,
    };
  }, [activePaper, totalAssignedQuestions]);

  // Update paper in project
  const handleUpdateActivePaper = (updatedPaper: GrammarTestSeries) => {
    if (!activePaperEntry) return;

    const topic = currentBook.topics.find((t) => t.id === activePaperEntry.topicId);
    if (!topic) return;

    const updatedTestSeries = topic.testSeries.map((ts) =>
      ts.id === updatedPaper.id ? updatedPaper : ts
    );

    const updatedTopic = { ...topic, testSeries: updatedTestSeries };
    const updatedBook = {
      ...currentBook,
      topics: currentBook.topics.map((t) => (t.id === topic.id ? updatedTopic : t)),
    };

    onUpdateSeriesProject({
      ...seriesProject,
      books: {
        ...seriesProject.books,
        [selectedClass]: updatedBook,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  // Create & persist new assessment via dialog
  const handleSaveNewAssessment = (newPaper: GrammarTestSeries, targetTopicId?: string) => {
    const targetClass = newPaper.classLevel || selectedClass;
    let targetBook = seriesProject.books[targetClass] || {
      classLevel: targetClass,
      title: `${seriesProject.seriesTitle} - ${targetClass}`,
      topics: [],
    };

    let updatedTopics = [...(targetBook.topics || [])];
    let targetTopic = targetTopicId ? updatedTopics.find((t) => t.id === targetTopicId) : undefined;

    if (!targetTopic) {
      if (updatedTopics.length === 0) {
        targetTopic = {
          id: `topic_${Date.now()}`,
          title: 'Syntax, Concord & Sentence Architecture',
          category: 'Syntax & Clauses',
          classLevel: targetClass,
          exercises: [],
          testSeries: [],
        };
        updatedTopics.push(targetTopic);
      } else {
        targetTopic = updatedTopics[0];
      }
    }

    const finalTopics = updatedTopics.map((top) => {
      if (top.id === targetTopic!.id) {
        return {
          ...top,
          testSeries: [...(top.testSeries || []), newPaper],
        };
      }
      return top;
    });

    const updatedProject: GrammarSeriesProject = {
      ...seriesProject,
      selectedClass: targetClass,
      books: {
        ...seriesProject.books,
        [targetClass]: {
          ...targetBook,
          topics: finalTopics,
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    onUpdateSeriesProject(updatedProject);
    setSelectedPaperId(newPaper.id);
  };

  // Reordering helpers
  const handleMoveQuestion = (sectionId: string, qIdx: number, direction: 'up' | 'down') => {
    if (!activePaper) return;

    const updatedSections = activePaper.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newQuestions = [...sec.questions];
      const targetIdx = direction === 'up' ? qIdx - 1 : qIdx + 1;
      if (targetIdx < 0 || targetIdx >= newQuestions.length) return sec;

      const temp = newQuestions[qIdx];
      newQuestions[qIdx] = newQuestions[targetIdx];
      newQuestions[targetIdx] = temp;

      return { ...sec, questions: newQuestions };
    });

    handleUpdateActivePaper({ ...activePaper, sections: updatedSections });
  };

  // Delete question
  const handleDeleteQuestion = (sectionId: string, qId: string) => {
    if (!activePaper) return;

    const updatedSections = activePaper.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, questions: sec.questions.filter((q) => q.id !== qId) };
    });

    handleUpdateActivePaper({ ...activePaper, sections: updatedSections });
  };

  return (
    <div
      id="assessment-builder-studio-root"
      className="flex-1 flex flex-col h-full overflow-hidden bg-[#fbfbfa] dark:bg-[#0f1011] select-none"
    >
      {/* Editorial Subheader */}
      <header className="h-14 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium hidden sm:inline">
              Class Grade:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value as GrammarClassLevel)}
              className="bg-[#EDE4D6] dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] rounded-lg px-3 py-1.5 text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] outline-none cursor-pointer"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#5A1832] text-[#F6F0E7] border border-[#C29A52]/30">
              {seriesProject.targetBoard}
            </span>
            {activePaper && (
              <span className="text-sm text-[#71685E] dark:text-[#c9b9a6] font-medium hidden md:inline">
                Target: {activePaper.totalMarks} Marks &bull; Duration: {activePaper.durationMinutes}m
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {activePaper && (
            <button
              onClick={() => window.print()}
              className="h-10 px-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#71685E]" />
              <span className="hidden sm:inline">Print Exam</span>
            </button>
          )}

          <button
            onClick={() => setShowBlueprintPickerModal(true)}
            className="h-10 px-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] text-sm font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Assemble authentic assessment directly from official board blueprint"
          >
            <Sparkles className="w-4 h-4 text-[#C29A52]" />
            <span className="hidden sm:inline">+ Build from Blueprint</span>
            <span className="sm:hidden">+ Blueprint</span>
          </button>

          <button
            onClick={() => setIsCreateAssessmentDialogOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-sm font-semibold flex items-center space-x-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Assessment</span>
          </button>
        </div>
      </header>

      {/* Main Split Layout: Assessment Paper Index / Central Editor / Persistent Audit Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Assessments Index */}
        <aside className="w-72 border-r border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6]">
            <span>Test Papers ({allPapers.length})</span>
            <span>{selectedClass}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {allPapers.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
                No assessments created for {selectedClass}.
                <br />
                Click "+ New Assessment".
              </div>
            ) : (
              allPapers.map(({ paper, topicTitle }) => {
                const isSelected = activePaper?.id === paper.id;
                const totalM = paper.sections.reduce(
                  (a, s) => a + s.questions.reduce((qa, q) => qa + q.marks, 0),
                  0
                );

                return (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaperId(paper.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#292521] dark:text-[#F6F0E7] font-semibold shadow-2xs'
                        : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#F6F0E7] dark:hover:bg-[#2b1622]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                      <span className="font-medium">{topicTitle}</span>
                      <span className="font-bold">
                        {totalM}/{paper.totalMarks} mk
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm truncate text-[#292521] dark:text-[#F6F0E7]">
                      {paper.title}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Center: Visually Central Assessment Canvas */}
        {activePaper ? (
          <main className="flex-1 overflow-y-auto bg-[#F6F0E7] dark:bg-[#1e0f18] p-6 sm:p-10 space-y-6">
            <div className="max-w-3xl mx-auto space-y-8 font-serif">
              {/* Formal Assessment Header */}
              <div className="border-b-2 border-[#5A1832] dark:border-[#C29A52] pb-6 space-y-4 bg-white dark:bg-[#24111d] p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] shadow-xs">
                <div className="flex items-center justify-between font-sans text-sm text-[#71685E] dark:text-[#c9b9a6]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono uppercase text-xs px-2.5 py-1 rounded-md bg-[#5A1832] text-[#F6F0E7] font-bold">
                      {seriesProject.targetBoard} EXAM
                    </span>
                    <span>&bull;</span>
                    <span className="font-medium">English Language &amp; Grammar</span>
                    <span>&bull;</span>
                    <span className="font-semibold">{selectedClass}</span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-sm">
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        totalAssignedMarks === activePaper.totalMarks
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                      }`}
                    >
                      Total: {totalAssignedMarks} / {activePaper.totalMarks} Marks
                    </span>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={activePaper.title}
                    onChange={(e) =>
                      handleUpdateActivePaper({ ...activePaper, title: e.target.value })
                    }
                    className="w-full text-2xl sm:text-3xl font-bold text-[#292521] dark:text-[#F6F0E7] bg-transparent outline-none border-b border-transparent hover:border-[#CBBEAC] focus:border-[#5A1832]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-sans text-sm pt-1">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] block">
                      Target Duration
                    </label>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <input
                        type="number"
                        min={10}
                        max={180}
                        value={activePaper.durationMinutes}
                        onChange={(e) =>
                          handleUpdateActivePaper({
                            ...activePaper,
                            durationMinutes: Number(e.target.value) || 30,
                          })
                        }
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-sm font-semibold font-mono"
                      />
                      <span className="text-[#71685E] dark:text-[#c9b9a6] text-xs font-medium">mins</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-[#71685E] dark:text-[#c9b9a6] block">
                      Blueprint Target Marks
                    </label>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <input
                        type="number"
                        min={5}
                        max={100}
                        value={activePaper.totalMarks}
                        onChange={(e) =>
                          handleUpdateActivePaper({
                            ...activePaper,
                            totalMarks: Number(e.target.value) || 10,
                          })
                        }
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#1e0f18] text-sm font-semibold font-mono"
                      />
                      <span className="text-[#71685E] dark:text-[#c9b9a6] text-xs font-medium">marks</span>
                    </div>
                  </div>
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-xl bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4d2b3b] font-sans text-sm space-y-1.5">
                  <span className="text-xs font-mono uppercase font-bold text-[#5A1832] dark:text-[#C29A52] block">
                    General Instructions
                  </span>
                  <ul className="text-[#292521] dark:text-[#F6F0E7] space-y-1 list-disc list-inside text-sm leading-relaxed">
                    {activePaper.instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sections & Questions List */}
              <div className="space-y-8 font-sans">
                {activePaper.sections.map((section, secIdx) => {
                  const sectionMarks = section.questions.reduce((a, q) => a + q.marks, 0);

                  return (
                    <div key={section.id} className="space-y-4">
                      {/* Section Header: 20-22px */}
                      <div className="flex items-center justify-between border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-2.5">
                        <div>
                          <input
                            type="text"
                            value={section.name}
                            onChange={(e) => {
                              const updatedSecs = [...activePaper.sections];
                              updatedSecs[secIdx] = { ...section, name: e.target.value };
                              handleUpdateActivePaper({
                                ...activePaper,
                                sections: updatedSecs,
                              });
                            }}
                            className="font-serif font-bold text-xl sm:text-[22px] text-[#292521] dark:text-[#F6F0E7] bg-transparent outline-none"
                          />
                          <p className="text-sm italic text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                            {section.instructions}
                          </p>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#5A1832] dark:text-[#C29A52] bg-[#EDE4D6] dark:bg-[#35101F] px-2.5 py-1 rounded-lg">
                          [{sectionMarks} Marks]
                        </span>
                      </div>

                      {/* Questions in Section */}
                      <div className="space-y-3.5">
                        {section.questions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] space-y-3.5 shadow-2xs hover:border-[#5A1832]/60 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="font-mono text-base font-bold text-[#5A1832] dark:text-[#C29A52] pt-0.5">
                                Q{qIdx + 1}.
                              </span>

                              <div className="flex-1 space-y-2.5">
                                {/* Question prompt: 17-18px */}
                                <div className="text-[17.5px] font-serif font-medium text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                                  {q.prompt || q.blanksSentence || q.originalSentence}
                                </div>

                                {q.transformationInstruction && (
                                  <div className="text-sm font-mono font-semibold text-[#5A1832] dark:text-[#C29A52]">
                                    {q.transformationInstruction}
                                  </div>
                                )}

                                {/* Options: 16px */}
                                {q.options && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-base font-serif text-[#292521] dark:text-[#F6F0E7]">
                                    {q.options.map((opt, i) => (
                                      <div
                                        key={i}
                                        className={`p-2 rounded-lg border border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 ${
                                          q.correctAnswer === opt
                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 font-semibold text-emerald-900 dark:text-emerald-300'
                                            : 'bg-[#F6F0E7]/40 dark:bg-[#1e0f18]'
                                        }`}
                                      >
                                        <span className="font-mono text-xs font-bold mr-1.5 text-[#71685E] dark:text-[#c9b9a6]">
                                          ({String.fromCharCode(97 + i)})
                                        </span>
                                        {opt}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Right Actions & Marks Badge (13-14px) */}
                              <div className="flex flex-col items-end space-y-2 shrink-0">
                                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#5A1832] text-[#F6F0E7]">
                                  [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                                </span>

                                <div className="flex items-center space-x-1.5 text-[#71685E] dark:text-[#c9b9a6]">
                                  <button
                                    onClick={() => handleMoveQuestion(section.id, qIdx, 'up')}
                                    disabled={qIdx === 0}
                                    className="p-1.5 hover:text-[#292521] dark:hover:text-white disabled:opacity-30 rounded hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                                    title="Move Question Up"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveQuestion(section.id, qIdx, 'down')}
                                    disabled={qIdx === section.questions.length - 1}
                                    className="p-1.5 hover:text-[#292521] dark:hover:text-white disabled:opacity-30 rounded hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]"
                                    title="Move Question Down"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteQuestion(section.id, q.id)}
                                    className="p-1.5 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                                    title="Remove Question"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add question to section */}
                        <div className="pt-2 flex items-center space-x-2">
                          <button
                            onClick={() => {
                              const newQ: GrammarQuestion = {
                                id: `q_${Date.now()}`,
                                type: 'transformation',
                                prompt:
                                  'Rewrite the following sentence according to the given instruction:',
                                originalSentence:
                                  'The storm was so severe that all flights were grounded.',
                                instruction: 'Rewrite using "too... to"',
                                correctAnswer: 'The storm was too severe for flights to take off.',
                                explanation: 'Transformation requires replacing the correlative clause "so...that" with the intensive structure "too...to".',
                                marks: 1,
                                difficulty: 'Medium',
                                cognitiveLevel: 'Applying',
                              };
                              const updatedSecs = activePaper.sections.map((s) =>
                                s.id === section.id
                                  ? { ...s, questions: [...s.questions, newQ] }
                                  : s
                              );
                              handleUpdateActivePaper({
                                ...activePaper,
                                sections: updatedSecs,
                              });
                            }}
                            className="px-4 py-2 rounded-lg border border-dashed border-[#CBBEAC] dark:border-[#4d2b3b] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-sm font-semibold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-2 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Question to {section.name}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#F6F0E7] dark:bg-[#1e0f18]">
            <Layers className="w-14 h-14 text-[#71685E] dark:text-[#c9b9a6] mb-3 opacity-60" />
            <h4 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              No Assessment Selected
            </h4>
            <p className="text-sm text-[#71685E] dark:text-[#c9b9a6] max-w-sm mt-1 mb-5 leading-relaxed">
              Select an assessment from the index on the left or create a new test paper.
            </p>
            <button
              onClick={() => setIsCreateAssessmentDialogOpen(true)}
              className="h-11 px-6 rounded-xl text-sm font-bold bg-[#5A1832] hover:bg-[#35101F] text-white shadow-xs transition-colors cursor-pointer flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assessment</span>
            </button>
          </div>
        )}

        {/* Right: Persistent Unobtrusive Assessment Audit Panel */}
        <aside className="w-72 sm:w-80 border-l border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] flex flex-col shrink-0 overflow-y-auto p-4 space-y-5">
          <div className="flex items-center justify-between border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Assessment Audit</span>
            </h4>
            <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">REAL-TIME</span>
          </div>

          {activePaper ? (
            <div className="space-y-4 text-sm">
              {/* Audit Row 1: Total Marks */}
              <div
                onClick={() =>
                  setSelectedAuditDetail(
                    selectedAuditDetail === 'marks'
                      ? null
                      : totalAssignedMarks === activePaper.totalMarks
                      ? 'Marks tally correctly with the target exam specification.'
                      : `Total assigned marks (${totalAssignedMarks}) do not match target blueprint (${activePaper.totalMarks}). Adjust question mark values.`
                  )
                }
                className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] cursor-pointer hover:border-[#5A1832] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#292521] dark:text-[#F6F0E7] text-sm">
                    Total Marks
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      totalAssignedMarks === activePaper.totalMarks
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {totalAssignedMarks} / {activePaper.totalMarks}
                  </span>
                </div>
                <div className="w-full bg-[#EDE4D6] dark:bg-[#35101F] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      totalAssignedMarks === activePaper.totalMarks
                        ? 'bg-emerald-600'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (totalAssignedMarks / (activePaper.totalMarks || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Audit Row 2: Board Blueprint Compliance */}
              <div
                onClick={() =>
                  setSelectedAuditDetail(
                    selectedAuditDetail === 'blueprint'
                      ? null
                      : blueprintAudit?.isCompliant
                      ? `Blueprint compliant with standard ${seriesProject.targetBoard} assessment pattern.`
                      : blueprintAudit?.issues.join(' • ') || 'Review blueprint specifications.'
                  )
                }
                className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] cursor-pointer hover:border-[#5A1832] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#292521] dark:text-[#F6F0E7] text-sm">
                    Board Blueprint
                  </span>
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded font-bold ${
                      blueprintAudit?.isCompliant
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {blueprintAudit?.isCompliant ? 'Compliant' : 'Review Needed'}
                  </span>
                </div>
                <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium">
                  Target: {seriesProject.targetBoard}
                </div>
              </div>

              {/* Audit Row 3: Difficulty Balance */}
              <div
                onClick={() =>
                  setSelectedAuditDetail(
                    selectedAuditDetail === 'difficulty'
                      ? null
                      : `Difficulty Distribution: Easy: ${difficultyStats.easy}%, Moderate: ${difficultyStats.moderate}%, Challenging: ${difficultyStats.challenging}%. Recommended board benchmark: ~30% Easy, ~50% Moderate, ~20% Challenging.`
                  )
                }
                className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] cursor-pointer hover:border-[#5A1832] transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#292521] dark:text-[#F6F0E7] text-sm">
                    Difficulty Balance
                  </span>
                  <span className="text-xs font-mono text-[#5A1832] dark:text-[#C29A52] font-semibold">Click for why</span>
                </div>

                <div className="flex h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${difficultyStats.easy}%` }}
                    className="bg-emerald-500"
                    title={`Easy: ${difficultyStats.easy}%`}
                  />
                  <div
                    style={{ width: `${difficultyStats.moderate}%` }}
                    className="bg-sky-500"
                    title={`Moderate: ${difficultyStats.moderate}%`}
                  />
                  <div
                    style={{ width: `${difficultyStats.challenging}%` }}
                    className="bg-purple-500"
                    title={`Challenging: ${difficultyStats.challenging}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-[#71685E] dark:text-[#c9b9a6]">
                  <span>Easy {difficultyStats.easy}%</span>
                  <span>Mod {difficultyStats.moderate}%</span>
                  <span>Hard {difficultyStats.challenging}%</span>
                </div>
              </div>

              {/* Audit Row 4: Cognitive Levels (Bloom) */}
              <div
                onClick={() =>
                  setSelectedAuditDetail(
                    selectedAuditDetail === 'cognitive'
                      ? null
                      : `Bloom's Taxonomy distribution: Applying: ${cognitiveStats.applying}%, Understanding: ${cognitiveStats.understanding}%, Remembering: ${cognitiveStats.remembering}%, Analysing: ${cognitiveStats.analysing}%. Grammar assessments should emphasize Applying and Understanding.`
                  )
                }
                className="p-3.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7] dark:bg-[#2b1622] cursor-pointer hover:border-[#5A1832] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#292521] dark:text-[#F6F0E7] text-sm">
                    Cognitive Distribution
                  </span>
                  <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                    Applying {cognitiveStats.applying}%
                  </span>
                </div>
                <div className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-medium">
                  Includes Understanding, Applying, Analysis
                </div>
              </div>

              {/* Audit Detail Popover / Explanation */}
              {selectedAuditDetail && (
                <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#C29A52]/60 text-xs text-[#292521] dark:text-[#F6F0E7] space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
                    <span className="flex items-center space-x-1.5">
                      <Info className="w-4 h-4" />
                      <span>Audit Explanation &amp; Rationale</span>
                    </span>
                    <button
                      onClick={() => setSelectedAuditDetail(null)}
                      className="text-[#5A1832] dark:text-[#C29A52] font-bold text-base hover:opacity-75"
                    >
                      &times;
                    </button>
                  </div>
                  <p className="leading-relaxed text-xs">{selectedAuditDetail}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-[#71685E] dark:text-[#c9b9a6] text-center p-4">
              Select an assessment to audit.
            </div>
          )}
        </aside>
      </div>

      {/* BLUEPRINT PICKER MODAL */}
      {showBlueprintPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e0f18] rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#CBBEAC] dark:border-[#4d2b3b] flex items-center justify-between bg-[#F6F0E7] dark:bg-[#2b1622] shrink-0">
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-5 h-5 text-[#C29A52]" />
                <div>
                  <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                    Assemble Assessment from Board Blueprint
                  </h3>
                  <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                    Generate an authentic exam paper structured according to official board specifications.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBlueprintPickerModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Blueprints List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {availableBlueprints.map((bp) => (
                <div
                  key={bp.id}
                  className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#24111d] hover:border-[#5A1832] dark:hover:border-[#C29A52] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC]/50">
                        {bp.board} &bull; {bp.targetClass}
                      </span>
                      <span className="text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
                        {bp.boardCode}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                      {bp.title}
                    </h4>

                    <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-2">
                      {bp.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] font-mono text-[#71685E] dark:text-[#c9b9a6] pt-1">
                      <span>Total Marks: <strong>{bp.totalMarks}m</strong></span>
                      <span>&bull;</span>
                      <span>Duration: <strong>{bp.totalDurationMinutes} mins</strong></span>
                      <span>&bull;</span>
                      <span>Slots: <strong>{bp.questionSlots.length}</strong></span>
                      {bp.sections && (
                        <>
                          <span>&bull;</span>
                          <span>Sections: <strong>{bp.sections.length}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuildFromBlueprint(bp)}
                    className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-semibold shrink-0 shadow-2xs transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assemble Paper</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] font-mono">
                Official Board Standards Compliance &bull; Academic Standards Spec
              </span>
              <button
                onClick={() => setShowBlueprintPickerModal(false)}
                className="px-4 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] text-xs font-semibold text-[#71685E] dark:text-[#c9b9a6]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Veritas Create Assessment Dialog */}
      <CreateAssessmentDialog
        isOpen={isCreateAssessmentDialogOpen}
        onClose={() => setIsCreateAssessmentDialogOpen(false)}
        selectedClass={selectedClass}
        targetBoard={seriesProject.targetBoard}
        topics={currentBook.topics || []}
        onCreateAssessment={handleSaveNewAssessment}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
