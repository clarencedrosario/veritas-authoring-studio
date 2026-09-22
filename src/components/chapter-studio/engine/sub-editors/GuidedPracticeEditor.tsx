import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Eye,
  EyeOff,
  Copy,
  AlertCircle,
  Lightbulb,
  Check,
  X,
  Edit3,
  Layers,
  Wand2,
} from 'lucide-react';
import { GuidedPracticeItem, Component12Data, ScaffoldingLevel } from '../../../../types';
import { ViewDisplayMode } from '../types';

interface GuidedPracticeEditorProps {
  data: Component12Data;
  onChange: (updated: Component12Data) => void;
  viewMode: ViewDisplayMode;
  isDarkMode?: boolean;
  activeSubject?: string;
  activeClassLevel?: string;
  activeBoard?: string;
  topic?: string;
}

interface AiSuggestionState {
  itemId: string;
  field: keyof GuidedPracticeItem;
  originalValue: string;
  suggestedValue: string;
  actionLabel: string;
  isProcessing: boolean;
}

export const GuidedPracticeEditor: React.FC<GuidedPracticeEditorProps> = ({
  data,
  onChange,
  viewMode,
  isDarkMode = false,
  activeSubject = 'Curriculum',
  activeClassLevel = '',
  activeBoard = '',
  topic = '',
}) => {
  const items = data.items || [];
  const [expandedId, setExpandedId] = useState<string>(items[0]?.id || '');
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestionState | null>(null);

  // -------------------------------------------------------------
  // ITEM MANAGEMENT (STABLE ID PRESERVATION & ANSWER INTEGRITY)
  // -------------------------------------------------------------

  const handleAddItem = (scaffoldingLevel: ScaffoldingLevel = 'Medium Support') => {
    const newId = `gp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newItem: GuidedPracticeItem = {
      id: newId,
      instruction: 'Analyze the given problem and complete the required step with supporting reasoning.',
      prompt: '',
      stimulus: '',
      hint: 'Recall the core principle and isolate the governing element before deciding.',
      scaffoldingLevel,
      modelResponse: '',
      answer: '',
      explanation: '',
      difficulty: scaffoldingLevel === 'High Support' ? 'Foundational' : scaffoldingLevel === 'Independent' ? 'Advanced' : 'Standard',
      teacherNote: 'Monitor students who rush without checking boundary conditions.',
      studentVisible: true,
      teacherVisible: true,
    };

    const updated = {
      ...data,
      items: [...items, newItem],
      lastModified: new Date().toISOString(),
    };
    onChange(updated);
    setExpandedId(newId);
  };

  const handleUpdateItem = (id: string, updates: Partial<GuidedPracticeItem>) => {
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

  const handleDuplicateItem = (id: string) => {
    const original = items.find((it) => it.id === id);
    if (!original) return;
    const newId = `gp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const duplicated: GuidedPracticeItem = {
      ...original,
      id: newId,
      prompt: original.prompt ? `${original.prompt} (Variant)` : '',
    };
    const targetIdx = items.findIndex((it) => it.id === id);
    const updatedItems = [...items];
    updatedItems.splice(targetIdx + 1, 0, duplicated);

    onChange({
      ...data,
      items: updatedItems,
      lastModified: new Date().toISOString(),
    });
    setExpandedId(newId);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    onChange({
      ...data,
      items: updated,
      lastModified: new Date().toISOString(),
    });
  };

  // -------------------------------------------------------------
  // AI ACTION TRIGGER & AUTHOR APPROVAL (PREVIEW/ACCEPT/REJECT)
  // -------------------------------------------------------------

  const handleTriggerAiAction = async (
    item: GuidedPracticeItem,
    action: 'suggest-hint' | 'suggest-answer' | 'generate-feedback' | 'simplify-instruction' | 'increase-difficulty' | 'decrease-difficulty'
  ) => {
    const fieldMap: Record<string, keyof GuidedPracticeItem> = {
      'suggest-hint': 'hint',
      'suggest-answer': 'answer',
      'generate-feedback': 'explanation',
      'simplify-instruction': 'instruction',
      'increase-difficulty': 'prompt',
      'decrease-difficulty': 'prompt',
    };

    const labelMap: Record<string, string> = {
      'suggest-hint': 'Suggest Scaffolding Hint',
      'suggest-answer': 'Suggest Model Answer',
      'generate-feedback': 'Generate Diagnostic Feedback',
      'simplify-instruction': 'Simplify Task Instruction',
      'increase-difficulty': 'Increase Rigor / Depth',
      'decrease-difficulty': 'Increase Scaffolding Support',
    };

    const targetField = fieldMap[action];
    const originalValue = String(item[targetField] || '');

    setAiSuggestion({
      itemId: item.id,
      field: targetField,
      originalValue,
      suggestedValue: 'Generating tailored pedagogical suggestion...',
      actionLabel: labelMap[action],
      isProcessing: true,
    });

    try {
      const response = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-12',
          action,
          topic: topic || 'Key Concept',
          classLevel: activeClassLevel || 'Standard',
          board: activeBoard || 'Academic Curriculum',
          subject: activeSubject,
          currentItem: item,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const suggestedText =
          result.data?.suggestion ||
          result.data?.hint ||
          result.data?.answer ||
          result.data?.explanation ||
          result.data?.instruction ||
          result.data?.prompt;

        if (suggestedText) {
          setAiSuggestion({
            itemId: item.id,
            field: targetField,
            originalValue,
            suggestedValue: String(suggestedText),
            actionLabel: labelMap[action],
            isProcessing: false,
          });
          return;
        }
      }
    } catch {
      // Graceful contextual fallback if offline
    }

    // Dynamic Context-Aware Fallback
    let fallbackText = '';
    if (action === 'suggest-hint') {
      fallbackText = `Hint: Carefully check the relation between the governing terms in "${item.prompt || topic}". Consider what rule applies under ${activeBoard || 'standard'} guidelines.`;
    } else if (action === 'suggest-answer') {
      fallbackText = `Verified solution for "${item.prompt || topic}": Apply standard ${activeSubject} methodology to resolve concord.`;
    } else if (action === 'generate-feedback') {
      fallbackText = `Pedagogical explanation: When evaluating ${item.prompt || topic}, learners at ${activeClassLevel || 'this'} stage must verify core syntax rules before selecting the final outcome.`;
    } else if (action === 'simplify-instruction') {
      fallbackText = `Read the question. Identify the key word and write your answer clearly.`;
    } else if (action === 'increase-difficulty') {
      fallbackText = item.prompt ? `${item.prompt} Additionally, provide a written grammatical rationale explaining why the alternative is invalid.` : `Examine the complex case and state the governing rule.`;
    } else if (action === 'decrease-difficulty') {
      fallbackText = item.prompt ? `Choose the correct option: ${item.prompt}` : `Identify the core term in the sentence.`;
    }

    setAiSuggestion({
      itemId: item.id,
      field: targetField,
      originalValue,
      suggestedValue: fallbackText,
      actionLabel: labelMap[action],
      isProcessing: false,
    });
  };

  const handleAcceptAiSuggestion = () => {
    if (!aiSuggestion) return;
    handleUpdateItem(aiSuggestion.itemId, {
      [aiSuggestion.field]: aiSuggestion.suggestedValue,
    });
    setAiSuggestion(null);
  };

  const handleRejectAiSuggestion = () => {
    setAiSuggestion(null);
  };

  // -------------------------------------------------------------
  // PREVIEW MODES (STUDENT EDITION VS TEACHER MASTER EDITION)
  // -------------------------------------------------------------

  if (viewMode === 'student_preview' || viewMode === 'teacher_preview') {
    const isTeacher = viewMode === 'teacher_preview';
    const visibleItems = items.filter((it) => (isTeacher ? it.teacherVisible !== false : it.studentVisible !== false));

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-2">
        <div className="flex items-center justify-between border-b border-[#D8C7B5] dark:border-[#3D2C1E] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5A1832]" />
            <h3 className="font-serif text-lg font-bold text-[#292521] dark:text-[#F6F0E7]">
              {data.title || 'Guided Practice & Scaffolded Drills'}
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-sans font-medium uppercase tracking-wider ${
              isTeacher
                ? 'bg-[#5A1832] text-[#F6F0E7]'
                : 'bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C]'
            }`}
          >
            {isTeacher ? 'Teacher Master Edition • Full Diagnostic Answers' : 'Student Edition • Scaffolded Reader View'}
          </span>
        </div>

        {data.instructions && (
          <div className="p-3 bg-[#FAF7F2] dark:bg-[#1a110a] rounded-lg border border-[#D8C7B5] dark:border-[#3D2C1E] text-xs text-[#524941] dark:text-[#CBBEAC] italic">
            {data.instructions}
          </div>
        )}

        {visibleItems.length === 0 ? (
          <div className="p-8 border border-dashed border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl text-center text-xs text-[#71685E]">
            No guided practice items visible for this edition.
          </div>
        ) : (
          <div className="space-y-6">
            {visibleItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-[#D8C7B5] dark:border-[#3D2C1E] bg-[#FFFDF8] dark:bg-[#150d08] space-y-3.5 shadow-xs"
              >
                {/* Header row with item number and badges */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E8DDCE] dark:border-[#2D1F14] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#5A1832] text-[#FFFDF8] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#5A1832] dark:text-[#E8A87C]">
                      Drill Item {idx + 1}
                    </span>
                    <span className="text-[10px] text-[#71685E] font-mono">[{item.id}]</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    {item.scaffoldingLevel && (
                      <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C] font-medium">
                        {item.scaffoldingLevel}
                      </span>
                    )}
                    {item.difficulty && (
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {item.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Instruction */}
                {item.instruction && (
                  <p className="text-xs font-semibold text-[#5A1832] dark:text-[#E8A87C]">
                    {item.instruction}
                  </p>
                )}

                {/* Optional Stimulus */}
                {item.stimulus && (
                  <div className="p-3 bg-[#FAF7F2] dark:bg-[#1f150e] rounded-lg border-l-3 border-[#C29A52] text-xs font-serif text-[#292521] dark:text-[#F6F0E7]">
                    {item.stimulus}
                  </div>
                )}

                {/* Question / Prompt */}
                <div className="text-sm font-serif text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                  {item.prompt || <span className="italic text-gray-400">Prompt not authored yet.</span>}
                </div>

                {/* Student Scaffolding Hint (Student Visible) */}
                {item.hint && (
                  <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#20150d] border border-[#E8DDCE] dark:border-[#3D2C1E] flex items-start gap-2.5 text-xs text-[#524941] dark:text-[#CBBEAC]">
                    <Lightbulb className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#5A1832] dark:text-[#E8A87C] mr-1">
                        Guided Scaffolding Hint:
                      </span>
                      <span>{item.hint}</span>
                    </div>
                  </div>
                )}

                {/* Student Workspace (Student Edition only) */}
                {!isTeacher && (
                  <div className="pt-2">
                    <div className="p-4 border border-dashed border-[#CBBEAC] dark:border-[#3D2C1E] rounded-lg bg-[#FAF7F2]/50 text-xs text-[#71685E] flex items-center justify-between">
                      <span className="italic">Write your answer or step reasoning here:</span>
                      <span className="text-[10px] font-mono">Answer Box [{item.id}]</span>
                    </div>
                  </div>
                )}

                {/* TEACHER EDITION ONLY CONTENT (Strictly Protected) */}
                {isTeacher && (
                  <div className="space-y-3 pt-3 border-t border-[#E8DDCE] dark:border-[#2D1F14]">
                    {/* Model Answer */}
                    <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Answer [Bound to ID: {item.id}]</span>
                      </div>
                      <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        {item.answer || <span className="italic text-emerald-600">No answer provided</span>}
                      </div>
                      {item.modelResponse && (
                        <div className="pt-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                          <span className="font-bold">Model Response: </span>
                          <span>{item.modelResponse}</span>
                        </div>
                      )}
                    </div>

                    {/* Pedagogical Explanation / Feedback */}
                    {item.explanation && (
                      <div className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#1a110a] border border-[#D8C7B5] dark:border-[#3D2C1E] text-xs space-y-1 text-[#292521] dark:text-[#F6F0E7]">
                        <div className="font-bold text-[#5A1832] dark:text-[#E8A87C] text-[11px] uppercase tracking-wider">
                          Pedagogical Rationale & Diagnostic Feedback
                        </div>
                        <p className="leading-relaxed">{item.explanation}</p>
                      </div>
                    )}

                    {/* Teacher Diagnostic Note */}
                    {item.teacherNote && (
                      <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1 text-purple-900 dark:text-purple-200">
                        <div className="flex items-center gap-1.5 font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider text-[11px]">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                          <span>Teacher Lesson Note • Diagnostic Observation</span>
                        </div>
                        <p className="leading-relaxed">{item.teacherNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHORING MODE: SPECIALIZED REUSABLE ENGINE WORKSPACE
  // -------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* AI Suggestion Approval Banner */}
      {aiSuggestion && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-xl space-y-3 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI Review & Approval: {aiSuggestion.actionLabel}</span>
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
              Target Field: {String(aiSuggestion.field)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-white dark:bg-[#150d08] rounded border border-amber-200 dark:border-amber-900">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Current Authored Value:
              </span>
              <p className="text-gray-700 dark:text-gray-300 italic min-h-[40px]">
                {aiSuggestion.originalValue || '(Empty)'}
              </p>
            </div>

            <div className="p-2.5 bg-white dark:bg-[#150d08] rounded border-2 border-[#9A7438]">
              <span className="text-[10px] font-bold text-[#9A7438] uppercase block mb-1">
                AI Suggested Replacement:
              </span>
              <textarea
                value={aiSuggestion.suggestedValue}
                onChange={(e) =>
                  setAiSuggestion({ ...aiSuggestion, suggestedValue: e.target.value })
                }
                rows={3}
                className="w-full text-xs bg-transparent border-0 focus:ring-0 text-[#292521] dark:text-[#F6F0E7] p-0 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleRejectAiSuggestion}
              className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg flex items-center gap-1 font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reject
            </button>
            <button
              type="button"
              onClick={handleAcceptAiSuggestion}
              disabled={aiSuggestion.isProcessing}
              className="px-4 py-1.5 text-xs bg-[#5A1832] text-white hover:bg-[#35101F] rounded-lg flex items-center gap-1.5 font-bold shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#C29A52]" />
              Accept & Apply to Content
            </button>
          </div>
        </div>
      )}

      {/* Top Controls & General Section Instructions */}
      <div className="bg-[#FAF7F2] dark:bg-[#1a110a] p-4 rounded-xl border border-[#D8C7B5] dark:border-[#3D2C1E] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-0.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#E8A87C]">
              Component Section Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  title: e.target.value,
                  lastModified: new Date().toISOString(),
                })
              }
              placeholder="Guided Practice & Scaffolded Checkpoints"
              className="w-full max-w-md text-sm font-bold bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3 py-1.5 text-[#292521] dark:text-[#F6F0E7] focus:ring-1 focus:ring-[#5A1832]"
            />
          </div>

          {/* Quick Scaffold Add Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddItem('High Support')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              Add High Support Drill
            </button>
            <button
              type="button"
              onClick={() => handleAddItem('Medium Support')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF7F2] dark:bg-[#20150d] text-[#5A1832] dark:text-[#E8A87C] border border-[#C29A52] hover:bg-[#EDE4D6] rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Standard Drill
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#71685E] dark:text-[#A89F91] block mb-1">
            General Section Instructions (Student-facing header guidance)
          </label>
          <input
            type="text"
            value={data.instructions || ''}
            onChange={(e) =>
              onChange({
                ...data,
                instructions: e.target.value,
                lastModified: new Date().toISOString(),
              })
            }
            placeholder="Work through each drill step-by-step. Use the guided hints if you encounter hesitation."
            className="w-full text-xs bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3 py-1.5 text-[#292521] dark:text-[#F6F0E7]"
          />
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-[#D8C7B5] dark:border-[#3D2C1E] rounded-2xl text-center space-y-3 bg-[#FAF7F2]/50">
          <BookOpen className="w-8 h-8 text-[#C29A52] mx-auto" />
          <h4 className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]">
            No Guided Practice Drills Authored Yet
          </h4>
          <p className="text-xs text-[#71685E] max-w-md mx-auto leading-relaxed">
            Guided Practice creates the essential pedagogical bridge between Worked Examples and formal independent exercises. Add items with scaffolded hints and verified answers.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleAddItem('High Support')}
              className="px-4 py-2 bg-[#5A1832] text-white hover:bg-[#35101F] rounded-lg text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C29A52]" />
              Create First Guided Practice Drill
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl bg-white dark:bg-[#150d08] shadow-xs overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  className="p-4 bg-[#FAF7F2] dark:bg-[#1a110a] flex items-center justify-between gap-3 cursor-pointer select-none border-b border-[#E8DDCE] dark:border-[#2D1F14]"
                  onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#5A1832] text-[#FFFDF8] text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5A1832] dark:text-[#E8A87C]">
                          Drill Item {index + 1}
                        </span>
                        <span className="text-[10px] font-mono text-[#71685E] bg-white dark:bg-black/40 px-1.5 py-0.5 rounded border border-[#E8DDCE] dark:border-[#3D2C1E]">
                          ID: {item.id}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C] font-medium">
                          {item.scaffoldingLevel || 'Medium Support'}
                        </span>
                      </div>
                      <p className="text-xs text-[#71685E] truncate mt-0.5 font-serif">
                        {item.prompt || <span className="italic text-gray-400">Empty prompt</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, 'up')}
                      className="p-1.5 text-gray-500 hover:text-[#5A1832] disabled:opacity-30 rounded hover:bg-[#EDE4D6]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveItem(index, 'down')}
                      className="p-1.5 text-gray-500 hover:text-[#5A1832] disabled:opacity-30 rounded hover:bg-[#EDE4D6]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateItem(item.id)}
                      className="p-1.5 text-gray-500 hover:text-[#5A1832] rounded hover:bg-[#EDE4D6]"
                      title="Duplicate Item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-600 rounded hover:bg-rose-50"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                      className="p-1.5 text-gray-500 hover:text-gray-900 rounded"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Form Workspace */}
                {isExpanded && (
                  <div className="p-5 space-y-5">
                    {/* Control Row: Scaffolding Level, Difficulty, Visibility */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF7F2] dark:bg-[#1a110a] rounded-lg border border-[#E8DDCE] dark:border-[#2D1F14] text-xs">
                      <div>
                        <label className="font-semibold text-[#5A1832] dark:text-[#E8A87C] block mb-1">
                          Scaffolding Level
                        </label>
                        <select
                          value={item.scaffoldingLevel || 'Medium Support'}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              scaffoldingLevel: e.target.value as ScaffoldingLevel,
                            })
                          }
                          className="w-full bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded px-2.5 py-1 text-xs"
                        >
                          <option value="High Support">High Support (Heavily scaffolded / Modelled)</option>
                          <option value="Medium Support">Medium Support (Structured guidance)</option>
                          <option value="Low Support">Low Support (Lighter hint / Exam style)</option>
                          <option value="Independent">Independent (Full learner reasoning)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-[#5A1832] dark:text-[#E8A87C] block mb-1">
                          Cognitive Difficulty
                        </label>
                        <select
                          value={item.difficulty || 'Standard'}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              difficulty: e.target.value as any,
                            })
                          }
                          className="w-full bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded px-2.5 py-1 text-xs"
                        >
                          <option value="Foundational">Foundational</option>
                          <option value="Standard">Standard</option>
                          <option value="Advanced">Advanced / Analytical</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-[#5A1832] dark:text-[#E8A87C] block mb-1">
                          Publication Visibility
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.studentVisible !== false}
                              onChange={(e) =>
                                handleUpdateItem(item.id, { studentVisible: e.target.checked })
                              }
                              className="rounded text-[#5A1832]"
                            />
                            <span>Student Edition</span>
                          </label>
                          <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.teacherVisible !== false}
                              onChange={(e) =>
                                handleUpdateItem(item.id, { teacherVisible: e.target.checked })
                              }
                              className="rounded text-[#5A1832]"
                            />
                            <span>Teacher Edition</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Specific Instruction */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#5A1832] dark:text-[#E8A87C]">
                          Item Instruction
                        </label>
                        <button
                          type="button"
                          onClick={() => handleTriggerAiAction(item, 'simplify-instruction')}
                          className="text-[11px] text-[#9A7438] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <Wand2 className="w-3 h-3" />
                          Simplify Instruction
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.instruction || ''}
                        onChange={(e) => handleUpdateItem(item.id, { instruction: e.target.value })}
                        placeholder="e.g. Choose the correct form and state the governing head noun."
                        className="w-full text-xs bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3 py-2 text-[#292521] dark:text-[#F6F0E7]"
                      />
                    </div>

                    {/* Optional Stimulus */}
                    <div>
                      <label className="text-xs font-bold text-[#71685E] block mb-1">
                        Optional Stimulus / Context (Passage, Data Table, or Equation)
                      </label>
                      <textarea
                        value={item.stimulus || ''}
                        onChange={(e) => handleUpdateItem(item.id, { stimulus: e.target.value })}
                        rows={2}
                        placeholder="Optional contextual passage, sentence set, scenario, or mathematical equation..."
                        className="w-full text-xs bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3 py-2 font-serif text-[#292521] dark:text-[#F6F0E7]"
                      />
                    </div>

                    {/* Prompt / Question */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center gap-1">
                          <span>Core Question / Prompt</span>
                          <span className="text-rose-600">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerAiAction(item, 'decrease-difficulty')}
                            className="text-[11px] text-[#71685E] hover:text-[#5A1832] font-medium"
                          >
                            Add Scaffolding
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            type="button"
                            onClick={() => handleTriggerAiAction(item, 'increase-difficulty')}
                            className="text-[11px] text-[#71685E] hover:text-[#5A1832] font-medium"
                          >
                            Increase Rigor
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={item.prompt || ''}
                        onChange={(e) => handleUpdateItem(item.id, { prompt: e.target.value })}
                        rows={3}
                        placeholder="Enter the question or problem prompt for students to solve..."
                        className="w-full text-sm font-serif bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3.5 py-2.5 text-[#292521] dark:text-[#F6F0E7] focus:ring-1 focus:ring-[#5A1832]"
                      />
                    </div>

                    {/* Scaffolding Hint (Student Facing) */}
                    <div className="p-3 bg-[#FAF7F2] dark:bg-[#1c120a] rounded-lg border border-[#E8DDCE] dark:border-[#3D2C1E] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#5A1832] dark:text-[#E8A87C] flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-[#C29A52]" />
                          <span>Student-Facing Scaffolding Hint</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleTriggerAiAction(item, 'suggest-hint')}
                          className="text-[11px] text-[#9A7438] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          Suggest Hint
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.hint || ''}
                        onChange={(e) => handleUpdateItem(item.id, { hint: e.target.value })}
                        placeholder="Provide a supportive guiding question, formula reminder, or step hint..."
                        className="w-full text-xs bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded px-3 py-1.5 text-[#292521] dark:text-[#F6F0E7]"
                      />
                    </div>

                    {/* ANSWER INTEGRITY: Verified Answer (Strictly Bound to Item ID) */}
                    <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-lg border border-emerald-300 dark:border-emerald-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                            Verified Answer Key
                          </label>
                          <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded">
                            Keyed to ID: {item.id}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTriggerAiAction(item, 'suggest-answer')}
                          className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <Sparkles className="w-3 h-3" />
                          Suggest Verified Answer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 block mb-1">
                            Exact Correct Answer / Solution
                          </span>
                          <input
                            type="text"
                            value={item.answer || ''}
                            onChange={(e) => handleUpdateItem(item.id, { answer: e.target.value })}
                            placeholder="Enter the authoritative verified answer..."
                            className="w-full text-xs font-semibold bg-white dark:bg-[#150d08] border border-emerald-300 dark:border-emerald-800 rounded px-3 py-2 text-emerald-950 dark:text-emerald-100"
                          />
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 block mb-1">
                            Model Response / Formatted Working
                          </span>
                          <input
                            type="text"
                            value={item.modelResponse || ''}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { modelResponse: e.target.value })
                            }
                            placeholder="Complete exemplar response showing step formatting..."
                            className="w-full text-xs bg-white dark:bg-[#150d08] border border-emerald-300 dark:border-emerald-800 rounded px-3 py-2 text-emerald-950 dark:text-emerald-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Explanation / Diagnostic Feedback */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#5A1832] dark:text-[#E8A87C]">
                          Pedagogical Explanation & Feedback
                        </label>
                        <button
                          type="button"
                          onClick={() => handleTriggerAiAction(item, 'generate-feedback')}
                          className="text-[11px] text-[#9A7438] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <Sparkles className="w-3 h-3" />
                          Generate Feedback
                        </button>
                      </div>
                      <textarea
                        value={item.explanation || ''}
                        onChange={(e) => handleUpdateItem(item.id, { explanation: e.target.value })}
                        rows={2}
                        placeholder="Explain why this answer is correct and address the core principle..."
                        className="w-full text-xs bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-lg px-3 py-2 text-[#292521] dark:text-[#F6F0E7]"
                      />
                    </div>

                    {/* Teacher Diagnostic Note (Teacher Edition Only) */}
                    <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300 text-xs">
                        <GraduationCap className="w-4 h-4 text-purple-700" />
                        <span>Teacher Master Note (Teacher Edition Only)</span>
                      </div>
                      <input
                        type="text"
                        value={item.teacherNote || ''}
                        onChange={(e) => handleUpdateItem(item.id, { teacherNote: e.target.value })}
                        placeholder="Classroom diagnostic tip, common student hesitation, or pacing advice..."
                        className="w-full text-xs bg-white dark:bg-[#150d08] border border-purple-200 dark:border-purple-800 rounded px-3 py-1.5 text-purple-950 dark:text-purple-100"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Add Bar */}
      {items.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#71685E]">
            {items.length} guided drill{items.length === 1 ? '' : 's'} authored • Answers strictly keyed to IDs
          </span>
          <button
            type="button"
            onClick={() => handleAddItem('Medium Support')}
            className="px-4 py-2 bg-[#5A1832] text-white hover:bg-[#35101F] rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            Add Another Drill Item
          </button>
        </div>
      )}
    </div>
  );
};
