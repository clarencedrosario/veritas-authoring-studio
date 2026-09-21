import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { WorkedExampleItem, WorkedExampleStep, Component07Data } from '../../../../types';
import { ViewDisplayMode } from '../types';

interface WorkedExamplesEditorProps {
  data: Component07Data;
  onChange: (updated: Component07Data) => void;
  viewMode: ViewDisplayMode;
  isDarkMode?: boolean;
}

export const WorkedExamplesEditor: React.FC<WorkedExamplesEditorProps> = ({
  data,
  onChange,
  viewMode,
  isDarkMode = false,
}) => {
  const items = data.items || [];
  const [expandedId, setExpandedId] = useState<string>(items[0]?.id || '');

  const handleAddItem = () => {
    const newId = `we-${Date.now()}`;
    const newItem: WorkedExampleItem = {
      id: newId,
      title: `Worked Example ${items.length + 1}: Step-by-Step Analysis`,
      problem: '',
      difficulty: 'Standard',
      steps: [
        {
          stepNumber: 1,
          title: 'Identify the Subject Head Word',
          instruction: 'Locate the principal noun or pronoun governing the clause before modifiers.',
          sampleWork: '',
          ruleApplied: '',
        },
        {
          stepNumber: 2,
          title: 'Isolate Modifiers or Intervening Phrases',
          instruction: 'Bracket prepositional phrases, relative clauses, or appositives that do not affect concord.',
          sampleWork: '',
          ruleApplied: '',
        },
        {
          stepNumber: 3,
          title: 'Apply Agreement Rule & Select Finite Verb',
          instruction: 'Match number and person to select the authoritative verb form.',
          sampleWork: '',
          ruleApplied: '',
        },
      ],
      finalAnswer: '',
      grammaticalRationale: '',
      teacherNote: '',
      learnerTakeaway: '',
    };

    const updated = {
      ...data,
      items: [...items, newItem],
      lastModified: new Date().toISOString(),
    };
    onChange(updated);
    setExpandedId(newId);
  };

  const handleUpdateItem = (id: string, updates: Partial<WorkedExampleItem>) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    onChange({
      ...data,
      items: updatedItems,
      lastModified: new Date().toISOString(),
    });
  };

  const handleDeleteItem = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    onChange({
      ...data,
      items: filtered,
      lastModified: new Date().toISOString(),
    });
    if (expandedId === id && filtered.length > 0) {
      setExpandedId(filtered[0].id);
    }
  };

  const handleAddStep = (itemId: string) => {
    const targetItem = items.find((it) => it.id === itemId);
    if (!targetItem) return;

    const newStep: WorkedExampleStep = {
      stepNumber: (targetItem.steps?.length || 0) + 1,
      title: `Step ${(targetItem.steps?.length || 0) + 1}: Reasoning`,
      instruction: '',
      sampleWork: '',
      ruleApplied: '',
    };

    handleUpdateItem(itemId, {
      steps: [...(targetItem.steps || []), newStep],
    });
  };

  const handleUpdateStep = (itemId: string, stepIndex: number, stepUpdates: Partial<WorkedExampleStep>) => {
    const targetItem = items.find((it) => it.id === itemId);
    if (!targetItem) return;

    const updatedSteps = [...(targetItem.steps || [])];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...stepUpdates };

    handleUpdateItem(itemId, { steps: updatedSteps });
  };

  const handleDeleteStep = (itemId: string, stepIndex: number) => {
    const targetItem = items.find((it) => it.id === itemId);
    if (!targetItem) return;

    const updatedSteps = (targetItem.steps || [])
      .filter((_, idx) => idx !== stepIndex)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));

    handleUpdateItem(itemId, { steps: updatedSteps });
  };

  // -------------------------------------------------------------
  // PREVIEW MODES (Student Edition vs Teacher Edition)
  // -------------------------------------------------------------
  if (viewMode === 'student_preview' || viewMode === 'teacher_preview') {
    const isTeacher = viewMode === 'teacher_preview';

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-2">
        <div className="flex items-center justify-between border-b border-[#D8C7B5] dark:border-[#3D2C1E] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5A1832]" />
            <h3 className="font-serif text-lg font-bold text-[#292521] dark:text-[#F6F0E7]">
              Worked Examples & Cognitive Walkthroughs
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium uppercase tracking-wider ${
              isTeacher
                ? 'bg-[#5A1832] text-[#F6F0E7]'
                : 'bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C]'
            }`}
          >
            {isTeacher ? 'Teacher Annotated Edition' : 'Student Textbook Edition'}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-[#F6F0E7] dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E]">
            <p className="text-[#71685E] text-sm">No worked examples authored yet.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#FCFAF7] dark:bg-[#1a110a] rounded-xl border border-[#D8C7B5] dark:border-[#3D2C1E] shadow-sm overflow-hidden"
            >
              {/* Box Header */}
              <div className="bg-[#EDE4D6] dark:bg-[#24170e] px-5 py-3 border-b border-[#D8C7B5] dark:border-[#3D2C1E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-[#5A1832] text-white text-xs font-bold px-2 py-0.5 rounded">
                    EXAMPLE {idx + 1}
                  </span>
                  <span className="font-serif font-semibold text-[#292521] dark:text-[#F6F0E7] text-sm">
                    {item.title}
                  </span>
                </div>
                {item.difficulty && (
                  <span className="text-xs text-[#71685E] bg-white dark:bg-[#2e1d13] px-2 py-0.5 rounded border border-[#D8C7B5] dark:border-[#3D2C1E]">
                    {item.difficulty}
                  </span>
                )}
              </div>

              {/* Problem Statement */}
              <div className="p-5 space-y-4">
                <div className="bg-white dark:bg-[#22160d] p-4 rounded-lg border border-[#E8DED1] dark:border-[#3D2C1E]">
                  <p className="text-xs font-bold tracking-wider text-[#5A1832] uppercase mb-1">Problem Sentence:</p>
                  <p className="font-serif text-base text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                    {item.problem || <span className="italic text-gray-400">No problem statement entered.</span>}
                  </p>
                </div>

                {/* Step-by-Step Walkthrough */}
                <div className="space-y-3">
                  <p className="text-xs font-bold tracking-wider text-[#71685E] uppercase">
                    Step-by-Step Grammatical Reasoning:
                  </p>
                  <div className="space-y-2.5">
                    {(item.steps || []).map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-3 bg-[#F6F0E7]/60 dark:bg-[#1f150f]/60 p-3 rounded-lg border border-[#E8DED1] dark:border-[#3D2C1E]"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#9A7438] text-white text-xs font-bold flex items-center justify-center">
                          {step.stepNumber || sIdx + 1}
                        </span>
                        <div className="flex-1 text-xs">
                          <p className="font-bold text-[#292521] dark:text-[#F6F0E7]">{step.title}</p>
                          {step.instruction && (
                            <p className="text-[#71685E] dark:text-[#b4a496] mt-0.5">{step.instruction}</p>
                          )}
                          {step.sampleWork && (
                            <div className="mt-1.5 p-2 bg-white dark:bg-[#180f0a] rounded border border-[#D8C7B5] dark:border-[#3D2C1E] font-mono text-[#5A1832] dark:text-[#E8A87C]">
                              {step.sampleWork}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Verified Answer */}
                <div className="bg-[#5A1832]/5 dark:bg-[#5A1832]/20 border border-[#5A1832]/30 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Verified Final Answer
                    </span>
                    <p className="font-serif font-bold text-[#292521] dark:text-[#F6F0E7] text-sm mt-0.5">
                      {item.finalAnswer || <span className="italic text-gray-400">Answer pending</span>}
                    </p>
                    {item.grammaticalRationale && (
                      <p className="text-xs text-[#71685E] dark:text-[#b4a496] mt-1 italic">
                        {item.grammaticalRationale}
                      </p>
                    )}
                  </div>
                </div>

                {/* Teacher Edition Exclusive Commentary */}
                {isTeacher && (
                  <div className="bg-[#FFFDF5] dark:bg-[#20180a] border-l-4 border-[#9A7438] p-4 rounded-r-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#9A7438]" />
                      <span className="text-xs font-bold text-[#9A7438] uppercase tracking-wider">
                        Teacher Edition Pedagogical Guidance
                      </span>
                    </div>
                    <p className="text-xs text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                      {item.teacherNote ||
                        'Pedagogical Note: Watch for students who mistakenly agree the verb with the nearest noun rather than identifying the true syntactic head.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHORING MODE
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header & Add Item */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#292521] dark:text-[#F6F0E7]">
            Worked Examples with Step-by-Step Commentary
          </h4>
          <p className="text-xs text-[#71685E] dark:text-[#b4a496]">
            Model cognitive reasoning from problem statement through grammatical rules to final answer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] text-white hover:bg-[#481226] text-xs font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Worked Example
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center bg-[#F6F0E7]/60 dark:bg-[#1f150f] rounded-xl border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E] space-y-3">
          <HelpCircle className="w-8 h-8 mx-auto text-[#9A7438]" />
          <p className="text-sm font-medium text-[#292521] dark:text-[#F6F0E7]">
            No Worked Examples Defined
          </p>
          <p className="text-xs text-[#71685E] max-w-md mx-auto">
            Worked examples scaffold student thought processes before independent drills. Click below to add your first modeled walkthrough.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A1832] text-white text-xs font-semibold rounded-lg hover:bg-[#481226] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Worked Example
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id || idx}
                className="bg-[#FCFAF7] dark:bg-[#1a110a] rounded-xl border border-[#D8C7B5] dark:border-[#3D2C1E] shadow-sm transition-all"
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between select-none hover:bg-[#F6F0E7]/50 dark:hover:bg-[#24170e]/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-[#5A1832] text-white text-xs font-bold px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-[#292521] dark:text-[#F6F0E7]">
                        {item.title || `Worked Example ${idx + 1}`}
                      </span>
                      {item.problem && (
                        <p className="text-[11px] text-[#71685E] line-clamp-1 max-w-lg">
                          {item.problem}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#9A7438] font-mono">
                      {(item.steps || []).length} steps
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Form */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#E8DED1] dark:border-[#3D2C1E] space-y-4 bg-white dark:bg-[#160e08]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Example Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. Resolving Intervening Modifiers in Subject-Verb Agreement"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Difficulty Tier
                        </label>
                        <select
                          value={item.difficulty || 'Standard'}
                          onChange={(e) => handleUpdateItem(item.id, { difficulty: e.target.value as any })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        >
                          <option value="Foundational">Foundational</option>
                          <option value="Standard">Standard</option>
                          <option value="Advanced">Advanced / Board Exam</option>
                        </select>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                        Problem Sentence or Prompt
                      </label>
                      <textarea
                        rows={2}
                        value={item.problem}
                        onChange={(e) => handleUpdateItem(item.id, { problem: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-serif bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                        placeholder="e.g. A swarm of bees (was / were) seen flying towards the orchard."
                      />
                    </div>

                    {/* Steps List */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-[#E8DED1] dark:border-[#3D2C1E] pb-1.5">
                        <span className="text-xs font-bold text-[#5A1832] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          Sequential Reasoning Steps
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddStep(item.id)}
                          className="text-xs text-[#9A7438] hover:text-[#7A5A28] font-medium inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Step
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(item.steps || []).map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-[#FAF7F2] dark:bg-[#1c120b] p-3 rounded-lg border border-[#E8DED1] dark:border-[#3D2C1E] space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#9A7438] text-white text-[10px] font-bold flex items-center justify-center">
                                  {step.stepNumber || sIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={step.title}
                                  onChange={(e) =>
                                    handleUpdateStep(item.id, sIdx, { title: e.target.value })
                                  }
                                  className="text-xs font-semibold bg-transparent border-b border-transparent hover:border-[#D8C7B5] focus:border-[#5A1832] focus:outline-none px-1 py-0.5"
                                  placeholder="Step Title (e.g. Identify Core Subject)"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteStep(item.id, sIdx)}
                                className="text-gray-400 hover:text-red-500 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-medium text-[#71685E] mb-0.5">
                                  Instructional Direction
                                </label>
                                <input
                                  type="text"
                                  value={step.instruction}
                                  onChange={(e) =>
                                    handleUpdateStep(item.id, sIdx, { instruction: e.target.value })
                                  }
                                  className="w-full px-2 py-1 text-xs bg-white dark:bg-[#120a06] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded"
                                  placeholder="e.g. Disregard 'of bees' as a prepositional modifier"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-[#71685E] mb-0.5">
                                  Sample Student Work / Cognitive Note
                                </label>
                                <input
                                  type="text"
                                  value={step.sampleWork || ''}
                                  onChange={(e) =>
                                    handleUpdateStep(item.id, sIdx, { sampleWork: e.target.value })
                                  }
                                  className="w-full px-2 py-1 text-xs bg-white dark:bg-[#120a06] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded font-mono text-[#5A1832]"
                                  placeholder="e.g. 'swarm' (singular noun) -> requires 'was'"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Final Solution & Rationale */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                          Verified Final Answer
                        </label>
                        <input
                          type="text"
                          value={item.finalAnswer}
                          onChange={(e) => handleUpdateItem(item.id, { finalAnswer: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-serif font-semibold bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          placeholder="e.g. A swarm of bees was seen flying towards the orchard."
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#71685E] mb-1">
                          Grammatical Rationale
                        </label>
                        <input
                          type="text"
                          value={item.grammaticalRationale || ''}
                          onChange={(e) => handleUpdateItem(item.id, { grammaticalRationale: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] dark:bg-[#20150d] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
                          placeholder="e.g. Singular collective subject 'swarm' governs singular verb 'was'."
                        />
                      </div>
                    </div>

                    {/* Teacher Annotation */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9A7438] mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Teacher Edition Pedagogical Guidance (Blackboard Note)
                      </label>
                      <textarea
                        rows={2}
                        value={item.teacherNote || ''}
                        onChange={(e) => handleUpdateItem(item.id, { teacherNote: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-[#FFFDF5] dark:bg-[#1a150c] border border-[#E8DED1] dark:border-[#3D2C1E] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9A7438]"
                        placeholder="Pedagogical notes for the educator: common student stumbling blocks, blackboard diagrams..."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
