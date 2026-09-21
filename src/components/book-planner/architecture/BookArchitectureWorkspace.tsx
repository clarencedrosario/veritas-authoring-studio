import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Edit3,
  Save,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  BookOpen,
  Compass,
  Layers,
  Award,
  PenTool,
  Send,
  Activity,
  CheckSquare,
  HelpCircle,
  FileSpreadsheet,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Sliders,
  Type,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { BookProject, GrammarSeriesProject } from '../../../types';
import {
  BookArchitectureConfig,
  BookPositioningType,
  VisualDensityType,
  VisualAssetStatus,
  EnglishVarietyType,
  BloomCognitiveLevel,
  ExerciseDifficultyLevel,
  ArchitectureSuggestion,
} from './types';
import { getDefaultBookArchitecture, auditBookArchitecture } from './defaultArchitecture';
import { AiArchitectureModal } from './AiArchitectureModal';

interface BookArchitectureWorkspaceProps {
  project: BookProject;
  seriesProject: GrammarSeriesProject;
  allProjects: BookProject[];
  unitsCount: number;
  topicsCount: number;
  onUpdateProjectArchitecture: (updatedArch: BookArchitectureConfig) => void;
  onOpenChapterStudio: (topicId?: string) => void;
  onOpenQuestionBank?: () => void;
  onOpenCurriculumMapping?: () => void;
  onOpenScopeSequence?: () => void;
  onOpenSeriesDashboard?: () => void;
  isDarkMode: boolean;
}

export const BookArchitectureWorkspace: React.FC<BookArchitectureWorkspaceProps> = ({
  project,
  seriesProject,
  allProjects,
  unitsCount,
  topicsCount,
  onUpdateProjectArchitecture,
  onOpenChapterStudio,
  onOpenQuestionBank,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenSeriesDashboard,
  isDarkMode,
}) => {
  // Resolve or initialize current project's architecture
  const activeArchitecture: BookArchitectureConfig = useMemo(() => {
    if (project.architecture) {
      return project.architecture;
    }
    return getDefaultBookArchitecture(project);
  }, [project]);

  // Working draft state for editing
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftArch, setDraftArch] = useState<BookArchitectureConfig>(activeArchitecture);

  // Sync draft when active project changes
  React.useEffect(() => {
    setDraftArch(activeArchitecture);
    setIsEditing(false);
  }, [project.id, activeArchitecture]);

  // Collapsible section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    purpose: true,
    learning: true,
    pedagogical: true,
    chapter: true,
    exercise: true,
    assessment: false,
    visual: false,
    style: false,
    progression: false,
    health: true,
  });

  // Modal states
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);
  const [selectedSourceBookId, setSelectedSourceBookId] = useState<string>('');
  const [saveConfirmationToast, setSaveConfirmationToast] = useState<string | null>(null);

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleToggleExpandAll = () => {
    const allOpen = Object.values(openSections).every(Boolean);
    const updated: Record<string, boolean> = {};
    Object.keys(openSections).forEach((k) => {
      updated[k] = !allOpen;
    });
    setOpenSections(updated);
  };

  // Health report computed dynamically
  const healthReport = useMemo(() => {
    return auditBookArchitecture(draftArch, project, unitsCount, topicsCount);
  }, [draftArch, project, unitsCount, topicsCount]);

  // Save handler
  const handleSave = () => {
    const updated: BookArchitectureConfig = {
      ...draftArch,
      lastEdited: new Date().toISOString(),
      health: healthReport,
    };
    onUpdateProjectArchitecture(updated);
    setIsEditing(false);
    setSaveConfirmationToast('Book Architecture saved successfully for ' + project.bookTitle);
    setTimeout(() => setSaveConfirmationToast(null), 3500);
  };

  // Cancel handler
  const handleCancel = () => {
    setDraftArch(activeArchitecture);
    setIsEditing(false);
  };

  // Reset section or entire architecture to defaults
  const handleResetToDefault = (sectionKey?: string) => {
    if (!confirm(sectionKey ? `Reset ${sectionKey} to default standard?` : 'Reset entire Book Architecture to defaults for this volume?')) {
      return;
    }
    const fresh = getDefaultBookArchitecture(project);
    if (!sectionKey) {
      setDraftArch(fresh);
      onUpdateProjectArchitecture(fresh);
    } else {
      const updated = { ...draftArch, [sectionKey]: (fresh as any)[sectionKey] };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    }
    setSaveConfirmationToast('Section reset to academic standard defaults.');
    setTimeout(() => setSaveConfirmationToast(null), 3000);
  };

  // Duplicate architecture from another book
  const handleDuplicateFromBook = () => {
    if (!selectedSourceBookId) return;
    const sourceBook = allProjects.find((p) => p.id === selectedSourceBookId);
    if (!sourceBook) return;

    const sourceArch = sourceBook.architecture || getDefaultBookArchitecture(sourceBook);
    // Clone but tailor volume-specific titles
    const cloned: BookArchitectureConfig = {
      ...sourceArch,
      lastEdited: new Date().toISOString(),
      purposePositioning: {
        ...sourceArch.purposePositioning,
        targetLearner: {
          ...sourceArch.purposePositioning.targetLearner,
          classOrStage: project.classLevel || 'Class 6',
        },
      },
    };

    setDraftArch(cloned);
    onUpdateProjectArchitecture(cloned);
    setShowDuplicateModal(false);
    setSaveConfirmationToast(`Architecture duplicated from ${sourceBook.bookTitle}.`);
    setTimeout(() => setSaveConfirmationToast(null), 3500);
  };

  // Apply suggestion from AI Assistant
  const handleApplyAiSuggestion = (suggestion: ArchitectureSuggestion, customPayload?: any) => {
    const payload = customPayload !== undefined ? customPayload : suggestion.payload;

    if (suggestion.category === 'strand') {
      const updatedStrands = [...draftArch.learningArchitecture.coreStrands, payload];
      const updated = {
        ...draftArch,
        learningArchitecture: {
          ...draftArch.learningArchitecture,
          coreStrands: updatedStrands,
        },
      };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    } else if (suggestion.category === 'prerequisite') {
      const updatedEntries = [...draftArch.learningArchitecture.entryCompetencies, payload];
      const updated = {
        ...draftArch,
        learningArchitecture: {
          ...draftArch.learningArchitecture,
          entryCompetencies: updatedEntries,
        },
      };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    } else if (suggestion.category === 'visual_opportunity') {
      const updatedAssets = draftArch.visualArchitecture.assetTypes.map((a) =>
        a.id === payload.assetId ? { ...a, status: payload.status } : a
      );
      const updated = {
        ...draftArch,
        visualArchitecture: {
          ...draftArch.visualArchitecture,
          assetTypes: updatedAssets,
        },
      };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    } else if (suggestion.targetSection === 'Language & Editorial Style' && suggestion.targetField) {
      const updated = {
        ...draftArch,
        editorialStyle: {
          ...draftArch.editorialStyle,
          [suggestion.targetField]: payload,
        },
      };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    } else if (suggestion.targetSection === 'Standard Chapter Architecture' && suggestion.targetField === 'notes') {
      const updated = {
        ...draftArch,
        chapterArchitecture: {
          ...draftArch.chapterArchitecture,
          notes: payload,
        },
      };
      setDraftArch(updated);
      onUpdateProjectArchitecture(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOAST FEEDBACK */}
      {/* ========================================================================= */}
      {saveConfirmationToast && (
        <div className="fixed bottom-12 right-6 z-50 p-4 rounded-xl bg-[#5A1832] text-[#F6F0E7] shadow-xl border border-[#C29A52] flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C29A52] shrink-0" />
          <span className="font-semibold">{saveConfirmationToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP ARCHITECTURE TOOLBAR */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7]">
            <BookOpen className="w-5 h-5 text-[#C29A52]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Book Architecture &amp; Instructional Design
              </h2>
              <span
                className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  healthReport.status === 'Verified'
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                    : healthReport.status === 'Configured'
                    ? 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300'
                    : healthReport.status === 'Needs Review'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                Status: {healthReport.status}
              </span>
            </div>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
              Defines the pedagogical model, chapter anatomy, exercise tiers, and editorial guidelines for{' '}
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">{project.bookTitle}</span>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {/* AI Architecture Assistant */}
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] hover:bg-[#CBBEAC] dark:hover:bg-[#4d182e] text-[#5A1832] dark:text-[#C29A52] text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer border border-[#CBBEAC]/70 dark:border-[#5A1832]"
            title="Open AI Architecture Assistant for suggestions"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9A7438]" />
            <span>AI Architecture Assistant</span>
          </button>

          {/* Duplicate from Another Book */}
          <button
            onClick={() => setShowDuplicateModal(true)}
            className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#71685E] dark:text-[#D8CCBC] text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer border border-[#CBBEAC]/50"
            title="Duplicate architecture specifications from another volume"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy from Volume</span>
          </button>

          {/* Toggle Expand / Collapse All */}
          <button
            onClick={handleToggleExpandAll}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[#71685E] transition-colors"
            title="Toggle Expand/Collapse All Sections"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Edit / Save / Cancel */}
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded-xl hover:bg-black/5 text-xs text-[#71685E] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#431225] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Edit Architecture</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BOOK PURPOSE & POSITIONING */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('purpose')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.purpose ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 1
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Book Purpose &amp; Positioning
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-semibold">
            {draftArch.purposePositioning.bookPositioning}
          </span>
        </button>

        {openSections.purpose && (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Book Purpose */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase mb-1">
                Book Purpose &amp; Core Intent
              </label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={draftArch.purposePositioning.bookPurpose}
                  onChange={(e) =>
                    setDraftArch({
                      ...draftArch,
                      purposePositioning: {
                        ...draftArch.purposePositioning,
                        bookPurpose: e.target.value,
                      },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] text-[#292521] dark:text-[#F6F0E7] focus:outline-hidden focus:ring-1 focus:ring-[#5A1832]"
                />
              ) : (
                <p className="text-[#292521] dark:text-[#F6F0E7] bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 p-3 rounded-xl border border-[#CBBEAC]/50 leading-relaxed">
                  {draftArch.purposePositioning.bookPurpose}
                </p>
              )}
            </div>

            {/* Target Learner Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                Target Learner Profile
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                  <span className="font-mono text-[10px] text-[#71685E] uppercase block">Age Range &amp; Stage</span>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={draftArch.purposePositioning.targetLearner.ageRange}
                        onChange={(e) =>
                          setDraftArch({
                            ...draftArch,
                            purposePositioning: {
                              ...draftArch.purposePositioning,
                              targetLearner: {
                                ...draftArch.purposePositioning.targetLearner,
                                ageRange: e.target.value,
                              },
                            },
                          })
                        }
                        className="p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                        placeholder="Age Range"
                      />
                      <input
                        type="text"
                        value={draftArch.purposePositioning.targetLearner.classOrStage}
                        onChange={(e) =>
                          setDraftArch({
                            ...draftArch,
                            purposePositioning: {
                              ...draftArch.purposePositioning,
                              targetLearner: {
                                ...draftArch.purposePositioning.targetLearner,
                                classOrStage: e.target.value,
                              },
                            },
                          })
                        }
                        className="p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                        placeholder="Class / Stage"
                      />
                    </div>
                  ) : (
                    <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                      {draftArch.purposePositioning.targetLearner.ageRange} &bull; {draftArch.purposePositioning.targetLearner.classOrStage}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                  <span className="font-mono text-[10px] text-[#71685E] uppercase block">Book Positioning</span>
                  {isEditing ? (
                    <select
                      value={draftArch.purposePositioning.bookPositioning}
                      onChange={(e) =>
                        setDraftArch({
                          ...draftArch,
                          purposePositioning: {
                            ...draftArch.purposePositioning,
                            bookPositioning: e.target.value as BookPositioningType,
                          },
                        })
                      }
                      className="w-full p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                    >
                      <option value="Core Coursebook">Core Coursebook</option>
                      <option value="Grammar & Composition Book">Grammar &amp; Composition Book</option>
                      <option value="Supplementary Grammar">Supplementary Grammar</option>
                      <option value="Examination Preparation">Examination Preparation</option>
                      <option value="Skills Development">Skills Development</option>
                      <option value="Reference & Practice Book">Reference &amp; Practice Book</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                      {draftArch.purposePositioning.bookPositioning}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1 md:col-span-2">
                  <span className="font-mono text-[10px] text-[#71685E] uppercase block">Expected Prior Knowledge Baseline</span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={draftArch.purposePositioning.targetLearner.expectedPriorKnowledge}
                      onChange={(e) =>
                        setDraftArch({
                          ...draftArch,
                          purposePositioning: {
                            ...draftArch.purposePositioning,
                            targetLearner: {
                              ...draftArch.purposePositioning.targetLearner,
                              expectedPriorKnowledge: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                    />
                  ) : (
                    <p className="text-[#292521] dark:text-[#F6F0E7]">
                      {draftArch.purposePositioning.targetLearner.expectedPriorKnowledge}
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1 md:col-span-2">
                  <span className="font-mono text-[10px] text-[#71685E] uppercase block">Learner Profile</span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={draftArch.purposePositioning.targetLearner.learnerProfile}
                      onChange={(e) =>
                        setDraftArch({
                          ...draftArch,
                          purposePositioning: {
                            ...draftArch.purposePositioning,
                            targetLearner: {
                              ...draftArch.purposePositioning.targetLearner,
                              learnerProfile: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                    />
                  ) : (
                    <p className="text-[#292521] dark:text-[#F6F0E7]">
                      {draftArch.purposePositioning.targetLearner.learnerProfile}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Curriculum Context & Pedagogical Promise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#CBBEAC]/50">
              <div className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                  Curriculum Framework &amp; Exam Relevance
                </span>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  <strong>Framework:</strong> {draftArch.purposePositioning.curriculumContext.curriculumFramework}
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC]">
                  <strong>Relevance:</strong> {draftArch.purposePositioning.curriculumContext.examinationRelevance}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                  Pedagogical Promise
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={draftArch.purposePositioning.pedagogicalPromise}
                    onChange={(e) =>
                      setDraftArch({
                        ...draftArch,
                        purposePositioning: {
                          ...draftArch.purposePositioning,
                          pedagogicalPromise: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                  />
                ) : (
                  <p className="text-[#5A1832] dark:text-[#C29A52] italic">
                    &ldquo;{draftArch.purposePositioning.pedagogicalPromise}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. LEARNING ARCHITECTURE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('learning')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.learning ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 2
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Learning Architecture &amp; Core Strands
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.learningArchitecture.coreStrands.length} Strands Configured
          </span>
        </button>

        {openSections.learning && (
          <div className="p-5 sm:p-6 space-y-6 text-xs">
            {/* Prior Knowledge & Competencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/50 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Entry Competencies ({draftArch.learningArchitecture.entryCompetencies.length})</span>
                </span>
                <ul className="space-y-1.5 pl-2">
                  {draftArch.learningArchitecture.entryCompetencies.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[#71685E] dark:text-[#D8CCBC]">
                      <span className="text-[#9A7438] mt-0.5">&bull;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/50 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-[#9A7438]" />
                  <span>End-of-Book Competencies ({draftArch.learningArchitecture.endOfBookCompetencies.length})</span>
                </span>
                <ul className="space-y-1.5 pl-2">
                  {draftArch.learningArchitecture.endOfBookCompetencies.map((c, i) => (
                    <li key={i} className="flex items-start space-x-2 text-[#71685E] dark:text-[#D8CCBC]">
                      <span className="text-[#9A7438] mt-0.5">&bull;</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Core Learning Strands Table / Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                  Instructional Strands Progression
                </span>
                {isEditing && (
                  <button
                    onClick={() => {
                      const newStrand = {
                        id: `strand-${Date.now()}`,
                        title: 'New Instructional Strand',
                        description: 'Enter strand description and target learning outcomes.',
                        relativeEmphasis: 'Moderate' as const,
                        curriculumLinks: ['Curriculum.Link'],
                        contributingChapters: ['Chapter Reference'],
                      };
                      setDraftArch({
                        ...draftArch,
                        learningArchitecture: {
                          ...draftArch.learningArchitecture,
                          coreStrands: [...draftArch.learningArchitecture.coreStrands, newStrand],
                        },
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Strand</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draftArch.learningArchitecture.coreStrands.map((strand, sIdx) => (
                  <div
                    key={strand.id}
                    className="p-3.5 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/70 dark:border-[#5A1832] flex flex-col justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={strand.title}
                            onChange={(e) => {
                              const updated = [...draftArch.learningArchitecture.coreStrands];
                              updated[sIdx].title = e.target.value;
                              setDraftArch({
                                ...draftArch,
                                learningArchitecture: {
                                  ...draftArch.learningArchitecture,
                                  coreStrands: updated,
                                },
                              });
                            }}
                            className="font-bold font-serif text-sm p-1 rounded border border-[#CBBEAC] w-full"
                          />
                        ) : (
                          <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                            {strand.title}
                          </h4>
                        )}

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            strand.relativeEmphasis === 'Core'
                              ? 'bg-[#5A1832] text-[#F6F0E7]'
                              : strand.relativeEmphasis === 'High'
                              ? 'bg-[#9A7438]/20 text-[#9A7438] dark:text-[#C29A52]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {strand.relativeEmphasis}
                        </span>
                      </div>

                      <p className="text-[#71685E] dark:text-[#D8CCBC] mt-1.5 line-clamp-2">
                        {strand.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#CBBEAC]/40 dark:border-[#5A1832]/40 flex items-center justify-between text-[11px] font-mono text-[#71685E]">
                      <span className="truncate max-w-[180px]">
                        {strand.contributingChapters.join(', ')}
                      </span>

                      {isEditing && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              if (sIdx === 0) return;
                              const updated = [...draftArch.learningArchitecture.coreStrands];
                              const temp = updated[sIdx];
                              updated[sIdx] = updated[sIdx - 1];
                              updated[sIdx - 1] = temp;
                              setDraftArch({
                                ...draftArch,
                                learningArchitecture: { ...draftArch.learningArchitecture, coreStrands: updated },
                              });
                            }}
                            disabled={sIdx === 0}
                            className="p-1 hover:bg-black/5 rounded disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (sIdx === draftArch.learningArchitecture.coreStrands.length - 1) return;
                              const updated = [...draftArch.learningArchitecture.coreStrands];
                              const temp = updated[sIdx];
                              updated[sIdx] = updated[sIdx + 1];
                              updated[sIdx + 1] = temp;
                              setDraftArch({
                                ...draftArch,
                                learningArchitecture: { ...draftArch.learningArchitecture, coreStrands: updated },
                              });
                            }}
                            disabled={sIdx === draftArch.learningArchitecture.coreStrands.length - 1}
                            className="p-1 hover:bg-black/5 rounded disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = draftArch.learningArchitecture.coreStrands.filter((_, i) => i !== sIdx);
                              setDraftArch({
                                ...draftArch,
                                learningArchitecture: { ...draftArch.learningArchitecture, coreStrands: updated },
                              });
                            }}
                            className="p-1 hover:bg-red-50 text-red-600 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. PEDAGOGICAL MODEL */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('pedagogical')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.pedagogical ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 3
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Pedagogical Model &amp; Instructional Flow
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.pedagogicalModel.stages.length} Pedagogical Stages
          </span>
        </button>

        {openSections.pedagogical && (
          <div className="p-5 sm:p-6 space-y-6 text-xs">
            <div>
              <h4 className="font-serif font-bold text-base text-[#5A1832] dark:text-[#C29A52]">
                {draftArch.pedagogicalModel.modelName}
              </h4>
              <p className="text-[#71685E] dark:text-[#D8CCBC] mt-1 leading-relaxed">
                {draftArch.pedagogicalModel.modelDescription}
              </p>
            </div>

            {/* Visual Pedagogical Flow Representation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                  <span>Interactive Instructional Progression Flow</span>
                </span>
                {isEditing && (
                  <button
                    onClick={() => {
                      const newStage = {
                        id: `stage-${Date.now()}`,
                        name: 'New Stage',
                        tagline: 'Instructional intention',
                        description: 'Details of pedagogical classroom action.',
                        iconName: 'Activity',
                      };
                      setDraftArch({
                        ...draftArch,
                        pedagogicalModel: {
                          ...draftArch.pedagogicalModel,
                          stages: [...draftArch.pedagogicalModel.stages, newStage],
                        },
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-[#5A1832] text-[#F6F0E7] text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Stage</span>
                  </button>
                )}
              </div>

              {/* Connected Stage Flow Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {draftArch.pedagogicalModel.stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/70 dark:border-[#5A1832] flex flex-col justify-between gap-1.5 relative group hover:border-[#5A1832] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-[#5A1832] text-[#F6F0E7] font-mono font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {isEditing && (
                        <div className="flex items-center space-x-0.5">
                          <button
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...draftArch.pedagogicalModel.stages];
                              const t = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = t;
                              setDraftArch({
                                ...draftArch,
                                pedagogicalModel: { ...draftArch.pedagogicalModel, stages: updated },
                              });
                            }}
                            disabled={idx === 0}
                            className="p-0.5 hover:bg-black/5 disabled:opacity-20"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (idx === draftArch.pedagogicalModel.stages.length - 1) return;
                              const updated = [...draftArch.pedagogicalModel.stages];
                              const t = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = t;
                              setDraftArch({
                                ...draftArch,
                                pedagogicalModel: { ...draftArch.pedagogicalModel, stages: updated },
                              });
                            }}
                            disabled={idx === draftArch.pedagogicalModel.stages.length - 1}
                            className="p-0.5 hover:bg-black/5 disabled:opacity-20"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="font-serif font-bold text-xs text-[#292521] dark:text-[#F6F0E7]">
                        {stage.name}
                      </h5>
                      <span className="text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52] block">
                        {stage.tagline}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#71685E] dark:text-[#D8CCBC] line-clamp-2">
                      {stage.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Standards Restraint Disclaimer */}
            <div className="p-3 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/50 flex items-start space-x-2 text-[11px] text-[#71685E] dark:text-[#D8CCBC]">
              <ShieldCheck className="w-4 h-4 text-[#9A7438] shrink-0 mt-0.5" />
              <span>
                <strong>Academic Standard Note:</strong> The pedagogical flow model represents the internal instructional scaffolding of the VERITAS Academic Publishing Studio. Pedagogical sequencing may be calibrated to suit specific institutional syllabus requirements without compromising core curriculum standards.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. STANDARD CHAPTER ARCHITECTURE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('chapter')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.chapter ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 4
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Standard Chapter Architecture &amp; Anatomy
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.chapterArchitecture.components.length} Anatomy Components
          </span>
        </button>

        {openSections.chapter && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[#71685E] dark:text-[#D8CCBC]">
                Defines the default structure for chapters in this book. Synchronized directly with Chapter Authoring Studio.
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenChapterStudio()}
                  className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-semibold text-xs flex items-center space-x-1.5 border border-[#CBBEAC]/70"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Inspect in Chapter Studio</span>
                </button>

                {isEditing && (
                  <button
                    onClick={() => {
                      const nextLetter = String.fromCharCode(70 + draftArch.chapterArchitecture.components.length % 5); // F, G, H...
                      const newComp = {
                        id: `comp-${Date.now()}`,
                        name: `Exercise ${nextLetter}: Extended Drill`,
                        category: 'practice' as const,
                        isRequired: false,
                        editionTarget: 'both' as const,
                        defaultEstimatedPages: 1.0,
                        description: 'Extended exercise practice block.',
                      };
                      setDraftArch({
                        ...draftArch,
                        chapterArchitecture: {
                          ...draftArch.chapterArchitecture,
                          components: [...draftArch.chapterArchitecture.components, newComp],
                        },
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] font-semibold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Component / Exercise</span>
                  </button>
                )}
              </div>
            </div>

            {/* Components Table */}
            <div className="rounded-xl border border-[#CBBEAC]/70 dark:border-[#5A1832] overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#EDE4D6] dark:bg-[#2b1622] text-[#5A1832] dark:text-[#C29A52] border-b border-[#CBBEAC]/70 dark:border-[#5A1832] font-mono text-[10px] uppercase">
                    <th className="p-2.5 w-12 text-center">#</th>
                    <th className="p-2.5">Component Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">Required</th>
                    <th className="p-2.5 text-center">Edition</th>
                    <th className="p-2.5 text-right">Est. Pages</th>
                    {isEditing && <th className="p-2.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/40 dark:divide-[#5A1832]/40 bg-[#FDFBF7] dark:bg-[#1E1919]">
                  {draftArch.chapterArchitecture.components.map((comp, idx) => (
                    <tr key={comp.id} className="hover:bg-black/2 dark:hover:bg-white/2 transition-colors">
                      <td className="p-2.5 text-center font-mono text-[11px] text-[#71685E]">
                        {idx + 1}
                      </td>

                      <td className="p-2.5">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={comp.name}
                              onChange={(e) => {
                                const updated = draftArch.chapterArchitecture.components.map((c, i) =>
                                  i === idx ? { ...c, name: e.target.value } : { ...c }
                                );
                                setDraftArch({
                                  ...draftArch,
                                  chapterArchitecture: { ...draftArch.chapterArchitecture, components: updated },
                                });
                              }}
                              className="p-1 rounded border border-[#CBBEAC] w-full text-xs"
                            />
                            {comp.id === 'comp-23' && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#5A1832]/20 text-[#5A1832] dark:text-[#C29A52] font-bold">
                                Specialized Section: comp-23 (Pedagogical Notes)
                              </span>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                {comp.name}
                              </span>
                              {comp.id === 'comp-23' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#5A1832] text-[#F6F0E7] font-bold">
                                  comp-23 &bull; Teacher / Author
                                </span>
                              )}
                            </div>
                            {comp.description && (
                              <p className="text-[10px] text-[#71685E] line-clamp-1">
                                {comp.description}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-2.5 font-mono text-[10px] uppercase text-[#9A7438] dark:text-[#C29A52]">
                        {comp.category}
                      </td>

                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = draftArch.chapterArchitecture.components.map((c, i) =>
                              i === idx ? { ...c, isRequired: !c.isRequired } : { ...c }
                            );
                            setDraftArch({
                              ...draftArch,
                              chapterArchitecture: { ...draftArch.chapterArchitecture, components: updated },
                            });
                          }}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          title="Click to toggle Required / Optional status"
                        >
                          {comp.isRequired ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-bold shadow-2xs">
                              Required
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-mono">
                              Optional
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="p-2.5 text-center font-mono text-[11px] capitalize">
                        {comp.editionTarget}
                      </td>

                      <td className="p-2.5 text-right font-mono font-semibold text-[#5A1832] dark:text-[#C29A52]">
                        ~{comp.defaultEstimatedPages} pp
                      </td>

                      {isEditing && (
                        <td className="p-2.5 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => {
                                if (idx === 0) return;
                                const updated = [...draftArch.chapterArchitecture.components];
                                const [item] = updated.splice(idx, 1);
                                updated.splice(idx - 1, 0, item);
                                setDraftArch({
                                  ...draftArch,
                                  chapterArchitecture: { ...draftArch.chapterArchitecture, components: updated },
                                });
                              }}
                              disabled={idx === 0}
                              className="p-1 hover:bg-black/5 rounded disabled:opacity-20 cursor-pointer"
                              title="Move component up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (idx === draftArch.chapterArchitecture.components.length - 1) return;
                                const updated = [...draftArch.chapterArchitecture.components];
                                const [item] = updated.splice(idx, 1);
                                updated.splice(idx + 1, 0, item);
                                setDraftArch({
                                  ...draftArch,
                                  chapterArchitecture: { ...draftArch.chapterArchitecture, components: updated },
                                });
                              }}
                              disabled={idx === draftArch.chapterArchitecture.components.length - 1}
                              className="p-1 hover:bg-black/5 rounded disabled:opacity-20 cursor-pointer"
                              title="Move component down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                const updated = draftArch.chapterArchitecture.components.filter((_, i) => i !== idx);
                                setDraftArch({
                                  ...draftArch,
                                  chapterArchitecture: { ...draftArch.chapterArchitecture, components: updated },
                                });
                              }}
                              className="p-1 hover:bg-red-50 text-red-600 rounded cursor-pointer"
                              title="Remove component"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. EXERCISE & PRACTICE ARCHITECTURE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('exercise')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.exercise ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 5
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Exercise &amp; Practice Architecture (Bloom Taxonomy)
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.exerciseArchitecture.levels.length} Tier Progression
          </span>
        </button>

        {openSections.exercise && (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[#71685E] dark:text-[#D8CCBC]">
                Scaffolded practice architecture graduated from recall to creative application. Directly linked to Question Bank.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {onOpenQuestionBank && (
                  <button
                    onClick={onOpenQuestionBank}
                    className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-3 h-3 text-[#C29A52]" />
                    <span>Open Question Bank</span>
                  </button>
                )}
              </div>
            </div>

            {/* Exercise Tiers Grid */}
            <div className="space-y-3">
              {draftArch.exerciseArchitecture.levels.map((lvl, lIdx) => (
                <div
                  key={lvl.id}
                  className="p-3.5 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/70 dark:border-[#5A1832] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#5A1832] text-[#F6F0E7]">
                        Tier {lIdx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                        {lvl.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#9A7438]/20 text-[#9A7438] dark:text-[#C29A52] font-semibold">
                        Bloom: {lvl.bloomLevel}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          lvl.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lvl.difficulty === 'Medium'
                            ? 'bg-sky-100 text-sky-800'
                            : lvl.difficulty === 'Hard'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {lvl.difficulty}
                      </span>
                    </div>

                    <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11.5px]">
                      {lvl.purpose}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10.5px] font-mono text-[#71685E]">
                      <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">Question Types:</span>
                      {lvl.suggestedQuestionTypes.map((q, qi) => (
                        <span key={qi} className="px-1.5 py-0.2 rounded bg-white dark:bg-[#1E1919] border border-[#CBBEAC]/50">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right shrink-0">
                    <div className="font-mono text-xs">
                      <span className="text-[#5A1832] dark:text-[#C29A52] font-bold block">
                        ~{lvl.typicalQuestionCount} Qs
                      </span>
                      <span className="text-[10px] text-[#71685E]">
                        {lvl.marksPerItem} {lvl.marksPerItem === 1 ? 'mk' : 'mks'} / item
                      </span>
                    </div>

                    {isEditing && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            if (lIdx === 0) return;
                            const updated = [...draftArch.exerciseArchitecture.levels];
                            const t = updated[lIdx];
                            updated[lIdx] = updated[lIdx - 1];
                            updated[lIdx - 1] = t;
                            setDraftArch({
                              ...draftArch,
                              exerciseArchitecture: { ...draftArch.exerciseArchitecture, levels: updated },
                            });
                          }}
                          disabled={lIdx === 0}
                          className="p-1 hover:bg-black/5 rounded disabled:opacity-20"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (lIdx === draftArch.exerciseArchitecture.levels.length - 1) return;
                            const updated = [...draftArch.exerciseArchitecture.levels];
                            const t = updated[lIdx];
                            updated[lIdx] = updated[lIdx + 1];
                            updated[lIdx + 1] = t;
                            setDraftArch({
                              ...draftArch,
                              exerciseArchitecture: { ...draftArch.exerciseArchitecture, levels: updated },
                            });
                          }}
                          disabled={lIdx === draftArch.exerciseArchitecture.levels.length - 1}
                          className="p-1 hover:bg-black/5 rounded disabled:opacity-20"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. ASSESSMENT PHILOSOPHY */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('assessment')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.assessment ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 6
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Assessment Philosophy &amp; Evaluation Framework
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.assessmentPhilosophy.components.length} Assessment Modes
          </span>
        </button>

        {openSections.assessment && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 flex items-start space-x-2.5 text-[#71685E] dark:text-[#D8CCBC]">
              <HelpCircle className="w-4 h-4 text-[#9A7438] shrink-0 mt-0.5" />
              <span>
                <strong>Architectural Standard:</strong> This section defines the overarching evaluation criteria, frequency, and feedback philosophy. Detailed chapter-by-chapter assessment marks and blueprint matrices are managed in the <strong>Assessment Plan</strong> tab.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {draftArch.assessmentPhilosophy.components.map((tier) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/60 flex flex-col justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                        {tier.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-[#5A1832] dark:text-[#C29A52]">
                        {tier.approximateMarks}
                      </span>
                    </div>

                    <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11.5px]">
                      {tier.purpose}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#CBBEAC]/40 space-y-1 text-[11px] font-mono text-[#71685E]">
                    <div>
                      <strong>Frequency:</strong> {tier.frequency}
                    </div>
                    <div>
                      <strong>Question Mix:</strong> {tier.questionMix}
                    </div>
                    <div>
                      <strong>Feedback:</strong> {tier.feedbackModel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. VISUAL & DESIGN ARCHITECTURE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('visual')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.visual ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 7
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Visual &amp; Design Architecture
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            Density: {draftArch.visualArchitecture.visualDensity}
          </span>
        </button>

        {openSections.visual && (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            {/* Visual Density & Target Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Visual Density Target</span>
                {isEditing ? (
                  <select
                    value={draftArch.visualArchitecture.visualDensity}
                    onChange={(e) =>
                      setDraftArch({
                        ...draftArch,
                        visualArchitecture: {
                          ...draftArch.visualArchitecture,
                          visualDensity: e.target.value as VisualDensityType,
                        },
                      })
                    }
                    className="w-full p-1.5 rounded border border-[#CBBEAC] bg-white dark:bg-[#1E1919]"
                  >
                    <option value="Low">Low (Text-dominant, minimal accents)</option>
                    <option value="Moderate">Moderate (Diagrams &amp; rule boxes balanced)</option>
                    <option value="Rich">Rich (Heavy visual scaffolding &amp; illustrated scenarios)</option>
                  </select>
                ) : (
                  <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                    {draftArch.visualArchitecture.visualDensity} Density (~{draftArch.visualArchitecture.approxVisualsPerChapter} visuals/chapter)
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Accessibility Specifications</span>
                <span className="text-[#292521] dark:text-[#F6F0E7]">
                  WCAG AA Contrast &bull; Alt Text Mandatory &bull; Non-Colour Dependent Meaning
                </span>
              </div>
            </div>

            {/* Asset Guidelines Grid */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                Permitted Asset Types &amp; Formatting Guidelines
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {draftArch.visualArchitecture.assetTypes.map((asset, aIdx) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC]/60 flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-[#292521] dark:text-[#F6F0E7] text-[11.5px]">
                        {asset.name}
                      </span>
                      {isEditing ? (
                        <select
                          value={asset.status}
                          onChange={(e) => {
                            const updated = [...draftArch.visualArchitecture.assetTypes];
                            updated[aIdx].status = e.target.value as VisualAssetStatus;
                            setDraftArch({
                              ...draftArch,
                              visualArchitecture: { ...draftArch.visualArchitecture, assetTypes: updated },
                            });
                          }}
                          className="text-[10px] p-0.5 rounded border border-[#CBBEAC]"
                        >
                          <option value="Preferred">Preferred</option>
                          <option value="Optional">Optional</option>
                          <option value="Restricted">Restricted</option>
                          <option value="Not Used">Not Used</option>
                        </select>
                      ) : (
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold shrink-0 ${
                            asset.status === 'Preferred'
                              ? 'bg-emerald-100 text-emerald-800'
                              : asset.status === 'Optional'
                              ? 'bg-sky-100 text-sky-800'
                              : asset.status === 'Restricted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {asset.status}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-[#71685E] dark:text-[#D8CCBC] line-clamp-2">
                      {asset.usageGuideline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. LANGUAGE & EDITORIAL STYLE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('style')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.style ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 8
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Language &amp; Editorial Style Guide
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#71685E]">
            {draftArch.editorialStyle.englishVariety}
          </span>
        </button>

        {openSections.style && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">English Variety &amp; Spelling</span>
                <span className="font-semibold text-[#5A1832] dark:text-[#C29A52] block">
                  {draftArch.editorialStyle.englishVariety}
                </span>
                <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11px]">
                  {draftArch.editorialStyle.spellingStandard}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Punctuation &amp; Capitalization</span>
                <p className="text-[#292521] dark:text-[#F6F0E7] text-[11px]">
                  {draftArch.editorialStyle.punctuationConvention}
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11px]">
                  {draftArch.editorialStyle.capitalisation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Grammar Terminology &amp; Conventions</span>
                <p className="text-[#292521] dark:text-[#F6F0E7] text-[11px]">
                  {draftArch.editorialStyle.terminologyConventions}
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11px]">
                  {draftArch.editorialStyle.grammarTerminology}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Tone &amp; Reading Level</span>
                <p className="text-[#292521] dark:text-[#F6F0E7] text-[11px]">
                  {draftArch.editorialStyle.tone}
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11px]">
                  <strong>Reading Band:</strong> {draftArch.editorialStyle.readingLevel}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EDE4D6]/40 dark:bg-[#35101F]/30 border border-[#CBBEAC]/50 space-y-1 md:col-span-2">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Inclusivity &amp; Sensitive Content Guidance</span>
                <p className="text-[#292521] dark:text-[#F6F0E7] text-[11px]">
                  {draftArch.editorialStyle.inclusivityGuidance}
                </p>
                <p className="text-[#71685E] dark:text-[#D8CCBC] text-[11px]">
                  {draftArch.editorialStyle.sensitiveContentGuidance}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 9. SERIES PROGRESSION */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('progression')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.progression ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 9
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Multi-Volume Series Progression
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-[#5A1832] dark:text-[#C29A52] font-semibold">
            {draftArch.seriesProgression.previousVolume.classOrStage} &rarr; {draftArch.seriesProgression.currentVolume.classOrStage} &rarr; {draftArch.seriesProgression.nextVolume.classOrStage}
          </span>
        </button>

        {openSections.progression && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[#71685E] dark:text-[#D8CCBC]">
                Vertical curricular articulation mapping inherited, reinforced, and advanced grammar concepts.
              </p>
              {onOpenScopeSequence && (
                <button
                  onClick={onOpenScopeSequence}
                  className="px-3 py-1.5 rounded-lg bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-semibold text-xs flex items-center space-x-1.5 border border-[#CBBEAC]/70"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Full Scope &amp; Sequence</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Previous Volume */}
              <div className="p-4 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/60 space-y-2">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Previous Volume</span>
                <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                  {draftArch.seriesProgression.previousVolume.title}
                </h4>
                <div className="space-y-1 pt-1">
                  <span className="font-mono text-[10px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                    Inherited Concepts:
                  </span>
                  <ul className="space-y-1 text-[#71685E] dark:text-[#D8CCBC]">
                    {draftArch.seriesProgression.previousVolume.inheritedConcepts.map((c, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#9A7438]">&bull;</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CURRENT VOLUME */}
              <div className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-[#1E1919] border-2 border-[#5A1832] dark:border-[#C29A52] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#5A1832] dark:text-[#C29A52] font-bold uppercase">
                    Current Volume
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#5A1832] text-[#F6F0E7] text-[9px] font-bold font-mono">
                    ACTIVE
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#5A1832] dark:text-[#C29A52]">
                  {draftArch.seriesProgression.currentVolume.title}
                </h4>
                <div className="space-y-1 pt-1">
                  <span className="font-mono text-[10px] font-bold text-[#5A1832] dark:text-[#C29A52] uppercase block">
                    Reinforced &amp; New Concepts:
                  </span>
                  <ul className="space-y-1 text-[#292521] dark:text-[#F6F0E7]">
                    {draftArch.seriesProgression.currentVolume.newConceptsIntroduced.map((c, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-semibold">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Volume */}
              <div className="p-4 rounded-xl bg-[#EDE4D6]/30 dark:bg-[#35101F]/20 border border-[#CBBEAC]/60 space-y-2">
                <span className="font-mono text-[10px] text-[#71685E] uppercase block">Next Volume</span>
                <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                  {draftArch.seriesProgression.nextVolume.title}
                </h4>
                <div className="space-y-1 pt-1">
                  <span className="font-mono text-[10px] font-bold text-[#9A7438] dark:text-[#C29A52] uppercase block">
                    Prepared for Next Level:
                  </span>
                  <ul className="space-y-1 text-[#71685E] dark:text-[#D8CCBC]">
                    {draftArch.seriesProgression.nextVolume.preparedConcepts.map((c, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#9A7438]">&bull;</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 10. BOOK ARCHITECTURE HEALTH */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('health')}
          className="w-full p-4 sm:p-5 bg-[#EDE4D6]/50 dark:bg-[#200b14]/50 flex items-center justify-between border-b border-[#CBBEAC]/70 dark:border-[#5A1832] cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            {openSections.health ? (
              <ChevronDown className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            )}
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-bold">
                Section 10
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Book Architecture Health &amp; Non-Destructive Audit
              </h3>
            </div>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
              healthReport.status === 'Verified'
                ? 'bg-emerald-100 text-emerald-900'
                : healthReport.status === 'Configured'
                ? 'bg-sky-100 text-sky-900'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            Health: {healthReport.status}
          </span>
        </button>

        {openSections.health && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Health Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {healthReport.checks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3 rounded-xl border flex items-start space-x-2 ${
                    check.isPassed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {check.isPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-[#292521] dark:text-[#F6F0E7] block">
                      {check.title}
                    </span>
                    <p className="text-[10.5px] text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
                      {check.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warnings if any */}
            {healthReport.warnings.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase">
                  Auditor Warnings ({healthReport.warnings.length})
                </span>
                {healthReport.warnings.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center space-x-2 text-amber-900 dark:text-amber-200"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <strong>{w.title}:</strong> {w.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DUPLICATE ARCHITECTURE MODAL */}
      {/* ========================================================================= */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#FDFBF7] dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] p-6 shadow-2xl text-[#292521] dark:text-[#F6F0E7] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 pb-2">
              <h3 className="font-serif font-bold text-base text-[#5A1832] dark:text-[#C29A52]">
                Copy Architecture from Another Volume
              </h3>
              <button onClick={() => setShowDuplicateModal(false)} className="p-1 hover:bg-black/5 rounded">
                <X className="w-4 h-4 text-[#71685E]" />
              </button>
            </div>

            <p className="text-[#71685E] dark:text-[#D8CCBC]">
              Select a book project in this series to copy its chapter anatomy, exercise tiers, and style guidelines into{' '}
              <strong>{project.bookTitle}</strong>.
            </p>

            <select
              value={selectedSourceBookId}
              onChange={(e) => setSelectedSourceBookId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919]"
            >
              <option value="">-- Choose Source Book Project --</option>
              {allProjects
                .filter((p) => p.id !== project.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bookTitle} ({p.classLevel || p.classOrStage})
                  </option>
                ))}
            </select>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#CBBEAC]/50">
              <button
                onClick={() => setShowDuplicateModal(false)}
                className="px-3 py-1.5 rounded-lg text-[#71685E] hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicateFromBook}
                disabled={!selectedSourceBookId}
                className="px-4 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] font-semibold disabled:opacity-40"
              >
                Copy &amp; Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI ARCHITECTURE ASSISTANT MODAL */}
      {/* ========================================================================= */}
      <AiArchitectureModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        project={project}
        architecture={draftArch}
        onApplySuggestion={handleApplyAiSuggestion}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
