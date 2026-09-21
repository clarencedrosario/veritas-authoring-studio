import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  HelpCircle,
  ShieldCheck,
  FileCheck,
  Sparkles,
  BookOpen,
  Edit3,
} from 'lucide-react';
import {
  BoardQuestionBlueprint,
  BlueprintSection,
  BlueprintQuestionGroup,
  RichQuestionType,
  CognitiveLevel,
  MarkingIntelligenceModel,
  OpenEndedMarkingGuideline,
  AssessmentIntegrityStatus,
} from '../../types';

interface BlueprintDesignerTreeProps {
  blueprint: BoardQuestionBlueprint;
  onUpdateBlueprint: (updated: BoardQuestionBlueprint) => void;
  isDarkMode: boolean;
}

export const BlueprintDesignerTree: React.FC<BlueprintDesignerTreeProps> = ({
  blueprint,
  onUpdateBlueprint,
  isDarkMode,
}) => {
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({
    'sec-cbse6-a': true,
    'sec-cbse6-b': true,
    'sec-cbse6-c': true,
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = blueprint.sections || [];

  // Update a question group
  const handleUpdateGroup = (
    sectionId: string,
    groupId: string,
    updates: Partial<BlueprintQuestionGroup>
  ) => {
    const updatedSections = sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const updatedGroups = sec.questionGroups.map((grp) => {
        if (grp.id !== groupId) return grp;
        return { ...grp, ...updates };
      });
      return { ...sec, questionGroups: updatedGroups };
    });
    onUpdateBlueprint({ ...blueprint, sections: updatedSections });
  };

  // Add question group to a section
  const handleAddQuestionGroup = (sectionId: string) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec) return;
    const newCount = sec.questionGroups.length + 1;
    const newGroup: BlueprintQuestionGroup = {
      id: `qg_${Date.now()}`,
      groupCode: `Q${newCount}`,
      title: `New Question Group #${newCount}`,
      questionType: 'sentence_transformation',
      skill: 'Grammar Syntax & Application',
      learningObjective: 'Apply syntactic rules to transform sentences accurately.',
      markAllocation: 2,
      difficulty: 'Medium',
      cognitiveLevel: 'Applying',
      responseFormat: 'Rewritten full sentence',
      markingRule: 'acceptable_alternatives',
      evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
      samplePrompt: 'Rewrite the sentence adhering to the instructed constraint...',
      markingGuideline: {
        acceptableAlternativeAnswers: ['Option A...', 'Option B...'],
        mandatoryKeywords: [],
        prohibitedChanges: [],
        preservationOfMeaningRequired: true,
        partialMarksAwardable: true,
        partialMarksCriteria: ['0.5 mark for concord, 0.5 mark for punctuation'],
        manualReviewFallbackRequired: false,
      },
    };

    const updatedSections = sections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        totalMarks: s.totalMarks + newGroup.markAllocation,
        questionGroups: [...s.questionGroups, newGroup],
      };
    });

    onUpdateBlueprint({
      ...blueprint,
      totalMarks: blueprint.totalMarks + newGroup.markAllocation,
      sections: updatedSections,
    });
    setSelectedGroupId(newGroup.id);
  };

  // Delete question group
  const handleDeleteGroup = (sectionId: string, groupId: string) => {
    const sec = sections.find((s) => s.id === sectionId);
    if (!sec || sec.questionGroups.length <= 1) {
      alert('A section must maintain at least one question group.');
      return;
    }
    const targetGroup = sec.questionGroups.find((g) => g.id === groupId);
    const marksToDeduct = targetGroup ? targetGroup.markAllocation : 0;

    const updatedSections = sections.map((s) => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        totalMarks: Math.max(0, s.totalMarks - marksToDeduct),
        questionGroups: s.questionGroups.filter((g) => g.id !== groupId),
      };
    });

    onUpdateBlueprint({
      ...blueprint,
      totalMarks: Math.max(0, blueprint.totalMarks - marksToDeduct),
      sections: updatedSections,
    });
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null);
    }
  };

  // Add new section
  const handleAddSection = () => {
    const secIndex = sections.length + 1;
    const secLetter = String.fromCharCode(64 + secIndex);
    const newSection: BlueprintSection = {
      id: `sec_${Date.now()}`,
      sectionCode: `Section ${secLetter}`,
      title: `Applied Language & Assessment ${secLetter}`,
      instructions: 'Answer all questions in this section with clarity and precision.',
      totalMarks: 5,
      questionGroups: [
        {
          id: `qg_${Date.now()}_init`,
          groupCode: `Q${secIndex}`,
          title: 'Core Structural Exercise',
          questionType: 'fill_in_blank',
          skill: 'Concord & Syntax',
          learningObjective: 'Demonstrate accurate agreement in textual blanks.',
          markAllocation: 5,
          difficulty: 'Medium',
          cognitiveLevel: 'Applying',
          responseFormat: 'Targeted single words inserted into numbered blanks',
          markingRule: 'exact_objective',
          evidenceStatus: blueprint.verificationStatus || 'EDITORIAL MODEL',
        },
      ],
    };

    onUpdateBlueprint({
      ...blueprint,
      totalMarks: blueprint.totalMarks + newSection.totalMarks,
      sections: [...sections, newSection],
    });
    setExpandedSectionIds((prev) => ({ ...prev, [newSection.id]: true }));
  };

  const richQuestionTypes: RichQuestionType[] = [
    'mcq',
    'fill_in_blank',
    'cloze',
    'error_correction',
    'editing',
    'sentence_transformation',
    'sentence_combining',
    'contextual_grammar',
    'sentence_reordering',
    'short_response',
    'notice',
    'letter_email',
    'composition',
  ];

  const markingRules: MarkingIntelligenceModel[] = [
    'exact_objective',
    'acceptable_alternatives',
    'rule_based',
    'analytic_rubric',
    'partial_credit',
  ];

  const cognitiveLevels: CognitiveLevel[] = [
    'Remembering',
    'Understanding',
    'Applying',
    'Analysing',
    'Evaluating',
    'Creating',
  ];

  return (
    <div id="blueprint-designer-tree" className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#1e0f18]">
      {/* Top Controls Bar */}
      <div className="h-12 border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
          <span className="text-xs font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Visual Blueprint Hierarchy: Section &rarr; Question Group &rarr; Item Typology
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
            {sections.length} Sections · {sections.reduce((acc, s) => acc + s.questionGroups.length, 0)} Question Groups
          </span>
        </div>

        <button
          onClick={handleAddSection}
          className="h-8 px-3 rounded-lg bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Main Split: Tree Accordion on Left, Deep Group Editor on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Hierarchical Tree Accordion */}
        <div className="w-full md:w-1/2 overflow-y-auto p-4 space-y-3 border-r border-[#CBBEAC] dark:border-[#4d2b3b]">
          {sections.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#71685E] dark:text-[#c9b9a6]">
              No sections defined for this blueprint. Click "Add Section" above.
            </div>
          ) : (
            sections.map((sec) => {
              const isExpanded = !!expandedSectionIds[sec.id];
              return (
                <div
                  key={sec.id}
                  className="rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/40 dark:bg-[#2b1622]/40 overflow-hidden shadow-2xs"
                >
                  {/* Section Bar */}
                  <div
                    onClick={() => toggleSection(sec.id)}
                    className="px-4 py-2.5 bg-[#EDE4D6]/70 dark:bg-[#35101F]/70 border-b border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60 flex items-center justify-between cursor-pointer hover:bg-[#EDE4D6] dark:hover:bg-[#35101F] transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#71685E] dark:text-[#c9b9a6]" />
                      )}
                      <div>
                        <span className="font-mono font-bold text-xs text-[#5A1832] dark:text-[#C29A52] mr-2">
                          {sec.sectionCode}
                        </span>
                        <strong className="text-xs font-semibold text-[#292521] dark:text-[#F6F0E7]">
                          {sec.title}
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-[#1e0f18] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60">
                        {sec.totalMarks} Marks
                      </span>
                    </div>
                  </div>

                  {/* Question Groups Inside Section */}
                  {isExpanded && (
                    <div className="p-2 space-y-2">
                      <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] italic px-2">
                        Instructions: {sec.instructions}
                      </div>

                      {sec.questionGroups.map((grp) => {
                        const isSelected = selectedGroupId === grp.id;
                        return (
                          <div
                            key={grp.id}
                            onClick={() => setSelectedGroupId(grp.id)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white dark:bg-[#1e0f18] border-[#5A1832] dark:border-[#C29A52] ring-2 ring-[#5A1832]/20 dark:ring-[#C29A52]/20 shadow-xs'
                                : 'bg-white/80 dark:bg-[#1e0f18]/80 border-[#CBBEAC]/80 dark:border-[#4d2b3b]/80 hover:border-[#5A1832]/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
                                    {grp.groupCode}
                                  </span>
                                  <strong className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                                    {grp.title}
                                  </strong>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono">
                                    {grp.questionType}
                                  </span>
                                </div>

                                <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                                  <strong>Skill:</strong> {grp.skill} · <strong>Objective:</strong>{' '}
                                  {grp.learningObjective}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                                  {grp.markAllocation}m
                                </span>
                                <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                                  {grp.cognitiveLevel}
                                </div>
                              </div>
                            </div>

                            {/* Marking Model Pill */}
                            <div className="mt-2 pt-2 border-t border-[#CBBEAC]/40 dark:border-[#4d2b3b]/40 flex items-center justify-between text-[10px]">
                              <span className="text-stone-500 font-mono">
                                Rule: <strong>{grp.markingRule.replace('_', ' ')}</strong>
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                  grp.evidenceStatus === 'VERIFIED'
                                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                                }`}
                              >
                                {grp.evidenceStatus || 'EDITORIAL MODEL'}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Group Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddQuestionGroup(sec.id);
                        }}
                        className="w-full py-1.5 rounded-lg border border-dashed border-[#CBBEAC] dark:border-[#4d2b3b] hover:border-[#5A1832] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question Group to {sec.sectionCode}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Question Group Deep Editor */}
        <div className="hidden md:flex md:w-1/2 flex-col overflow-y-auto p-5 bg-[#fbfbfa] dark:bg-[#150a11]">
          {selectedGroupId ? (
            (() => {
              const activeSec = sections.find((s) =>
                s.questionGroups.some((g) => g.id === selectedGroupId)
              );
              const activeGrp = activeSec?.questionGroups.find((g) => g.id === selectedGroupId);
              if (!activeSec || !activeGrp) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b]">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
                      <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        Question Group Parameters: {activeGrp.groupCode} ({activeSec.sectionCode})
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteGroup(activeSec.id, activeGrp.id)}
                      className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                      title="Delete Question Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Group Code */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Group Code
                      </label>
                      <input
                        type="text"
                        value={activeGrp.groupCode}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, { groupCode: e.target.value })
                        }
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Title / Descriptor
                      </label>
                      <input
                        type="text"
                        value={activeGrp.title}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, { title: e.target.value })
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      />
                    </div>
                  </div>

                  {/* Question Typology & Cognitive Level */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Question Typology
                      </label>
                      <select
                        value={activeGrp.questionType}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, {
                            questionType: e.target.value as RichQuestionType,
                          })
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      >
                        {richQuestionTypes.map((qt) => (
                          <option key={qt} value={qt}>
                            {qt.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Cognitive Level (Bloom)
                      </label>
                      <select
                        value={activeGrp.cognitiveLevel}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, {
                            cognitiveLevel: e.target.value as CognitiveLevel,
                          })
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      >
                        {cognitiveLevels.map((cl) => (
                          <option key={cl} value={cl}>
                            {cl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Marks & Difficulty */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Mark Allocation
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={activeGrp.markAllocation}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, {
                            markAllocation: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                        Marking Intelligence Model
                      </label>
                      <select
                        value={activeGrp.markingRule}
                        onChange={(e) =>
                          handleUpdateGroup(activeSec.id, activeGrp.id, {
                            markingRule: e.target.value as MarkingIntelligenceModel,
                          })
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                      >
                        {markingRules.map((mr) => (
                          <option key={mr} value={mr}>
                            {mr.replace(/_/g, ' ').toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Skill & Learning Objective */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                      Specific Skill
                    </label>
                    <input
                      type="text"
                      value={activeGrp.skill}
                      onChange={(e) =>
                        handleUpdateGroup(activeSec.id, activeGrp.id, { skill: e.target.value })
                      }
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                      Learning Objective
                    </label>
                    <textarea
                      rows={2}
                      value={activeGrp.learningObjective}
                      onChange={(e) =>
                        handleUpdateGroup(activeSec.id, activeGrp.id, { learningObjective: e.target.value })
                      }
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                    />
                  </div>

                  {/* Sample Question Prompt Preview */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase font-mono">
                      Sample Question Prompt
                    </label>
                    <textarea
                      rows={2}
                      value={activeGrp.samplePrompt || ''}
                      onChange={(e) =>
                        handleUpdateGroup(activeSec.id, activeGrp.id, { samplePrompt: e.target.value })
                      }
                      placeholder="e.g. Rewrite the sentence beginning with 'Each of'..."
                      className="w-full text-xs px-2.5 py-1.5 rounded border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18]"
                    />
                  </div>

                  {/* OPEN-ENDED MARKING INTELLIGENCE PANEL */}
                  {activeGrp.markingRule !== 'exact_objective' && (
                    <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          Open-Ended Marking Intelligence (Semantic Equivalence &amp; Partial Credit)
                        </h4>
                      </div>

                      <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                        Open-ended grammar items must <strong>not</strong> rely solely on exact-string matching. Define acceptable syntactic alternatives and mandatory keywords.
                      </p>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase font-bold text-amber-900 dark:text-amber-300 block">
                          Acceptable Syntactic Alternatives (one per line)
                        </label>
                        <textarea
                          rows={2}
                          value={(activeGrp.markingGuideline?.acceptableAlternativeAnswers || []).join('\n')}
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            handleUpdateGroup(activeSec.id, activeGrp.id, {
                              markingGuideline: {
                                ...(activeGrp.markingGuideline || {
                                  acceptableAlternativeAnswers: [],
                                  mandatoryKeywords: [],
                                  prohibitedChanges: [],
                                  preservationOfMeaningRequired: true,
                                  partialMarksAwardable: true,
                                  partialMarksCriteria: [],
                                  manualReviewFallbackRequired: false,
                                }),
                                acceptableAlternativeAnswers: lines,
                              },
                            });
                          }}
                          className="w-full text-xs font-mono p-2 rounded border border-amber-300 dark:border-amber-800 bg-white dark:bg-[#1e0f18]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeGrp.markingGuideline?.partialMarksAwardable ?? true}
                            onChange={(e) =>
                              handleUpdateGroup(activeSec.id, activeGrp.id, {
                                markingGuideline: {
                                  ...(activeGrp.markingGuideline || {
                                    acceptableAlternativeAnswers: [],
                                    mandatoryKeywords: [],
                                    prohibitedChanges: [],
                                    preservationOfMeaningRequired: true,
                                    partialMarksAwardable: true,
                                    partialMarksCriteria: [],
                                    manualReviewFallbackRequired: false,
                                  }),
                                  partialMarksAwardable: e.target.checked,
                                },
                              })
                            }
                            className="rounded text-amber-600"
                          />
                          <span className="font-semibold text-stone-800 dark:text-slate-200">
                            Partial Credit Allowed
                          </span>
                        </label>

                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeGrp.markingGuideline?.manualReviewFallbackRequired ?? false}
                            onChange={(e) =>
                              handleUpdateGroup(activeSec.id, activeGrp.id, {
                                markingGuideline: {
                                  ...(activeGrp.markingGuideline || {
                                    acceptableAlternativeAnswers: [],
                                    mandatoryKeywords: [],
                                    prohibitedChanges: [],
                                    preservationOfMeaningRequired: true,
                                    partialMarksAwardable: true,
                                    partialMarksCriteria: [],
                                    manualReviewFallbackRequired: false,
                                  }),
                                  manualReviewFallbackRequired: e.target.checked,
                                },
                              })
                            }
                            className="rounded text-amber-600"
                          />
                          <span className="font-semibold text-stone-800 dark:text-slate-200">
                            Human Review Fallback
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#71685E] dark:text-[#c9b9a6] space-y-2">
              <Layers className="w-8 h-8 text-[#CBBEAC] dark:text-[#4d2b3b]" />
              <p className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Select a Question Group to Edit Parameters
              </p>
              <p className="text-xs max-w-xs">
                Click any question group in the tree hierarchy on the left to configure question typology, Bloom's cognitive level, mark allocation, and open-ended marking intelligence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
