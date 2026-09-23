import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { StudioChapter } from '../../types';

export interface ChapterChallengeDrillViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  isDarkMode?: boolean;
}

export interface ChallengeProblemItem {
  id: string;
  title: string;
  prompt: string;
  hint?: string;
  modelAnswer?: string;
  rationale?: string;
  solutionReasoning?: string;
  conceptualExplanation?: string;
  grammaticalRationale?: string;
  commonPitfall?: string;
  marks?: number;
  difficulty?: 'Hard' | 'Olympiad' | 'Advanced';
  cognitiveLevel?: string;
}

export const ChapterChallengeDrillView: React.FC<ChapterChallengeDrillViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  isDarkMode = false,
}) => {
  const effectiveSubject = (chapter as any).subject || seriesProject?.subject || 'Academic Studies';
  const isGrammar = /grammar|syntax|english language/i.test(chapter.category || '') || /grammar/i.test(effectiveSubject);
  const isMath = /math/i.test(chapter.category || '') || /math/i.test(effectiveSubject);
  const isScience = /science|biology|physics|chemistry/i.test(chapter.category || '') || /science|biology|physics|chemistry/i.test(effectiveSubject);
  const isHistory = /history|civics|social/i.test(chapter.category || '') || /history|civics|social/i.test(effectiveSubject);

  const rationaleLabel = isGrammar
    ? 'Grammatical Rationale & Syntactic Analysis'
    : isMath
    ? 'Mathematical Derivation & Proof'
    : isScience
    ? 'Scientific Reasoning & Empirical Principle'
    : isHistory
    ? 'Historical Evidence & Analytical Reasoning'
    : 'Conceptual Rationale & Explanation';

  // Normalize existing challenge problems
  const initialProblems: ChallengeProblemItem[] = (chapter.challengeProblems || []).map((cp, idx) => ({
    id: cp.id || `chal-${idx + 1}`,
    title: cp.title || `Challenge Problem ${idx + 1}`,
    prompt: cp.prompt || '',
    modelAnswer: cp.modelAnswer || '',
    hint: (cp as any).hint || (isGrammar ? 'Look closely at intervening parenthetical clauses and structural head nouns.' : 'Analyze the core constraints and governing principles.'),
    rationale: (cp as any).rationale || (cp as any).solutionReasoning || (cp as any).grammaticalRationale || '',
    grammaticalRationale: (cp as any).grammaticalRationale || (cp as any).rationale || '',
    commonPitfall: (cp as any).commonPitfall || (isGrammar ? 'Proximity attraction to the noun immediately preceding the verb.' : 'Common surface misconception or sign error.'),
    marks: (cp as any).marks || 3,
    difficulty: (cp as any).difficulty || 'Olympiad',
    cognitiveLevel: (cp as any).cognitiveLevel || 'Evaluating',
  }));

  const defaultProblem: ChallengeProblemItem = isGrammar
    ? {
        id: 'chal-sva-1',
        title: 'The Royal Fleet & Inverted Complementation',
        prompt:
          'Analyze the sentence: "Down the stormy channel, accompanied by three smaller escorts, (sail / sails) the flagship of the Admiral." Determine the correct finite verb and provide full syntactic justification.',
        hint: 'Identify the true head noun after subject-verb inversion.',
        modelAnswer:
          'The correct verb is "sails". The sentence is inverted; the true grammatical subject is the singular noun phrase "the flagship of the Admiral", not the fronted adverbial or the parenthetical escort adjunct.',
        rationale:
          'Inversion does not alter concord requirements; the singular head noun "flagship" requires the singular verb "sails".',
        grammaticalRationale:
          'Inversion does not alter concord requirements; the singular head noun "flagship" requires the singular verb "sails".',
        commonPitfall:
          'Attraction to the plural noun "escorts" in the parenthetical phrase or "channel" in the fronted prepositional phrase.',
        marks: 3,
        difficulty: 'Olympiad',
        cognitiveLevel: 'Evaluating',
      }
    : isMath
    ? {
        id: `chal-math-1`,
        title: `${chapter.title} — Non-Routine Olympiad Challenge`,
        prompt: `Evaluate the given conditions for ${chapter.title} under multi-step constraints and determine the exact solution with step-by-step mathematical reasoning.`,
        hint: 'Apply structural decomposition or algebraic invariant principles.',
        modelAnswer: 'Complete multi-step mathematical derivation yielding verified solution.',
        rationale: 'Derived from fundamental theorems without approximation errors.',
        grammaticalRationale: 'Derived from fundamental theorems without approximation errors.',
        commonPitfall: 'Sign error or overlooking boundary/domain restrictions.',
        marks: 4,
        difficulty: 'Olympiad',
        cognitiveLevel: 'Evaluating',
      }
    : isScience
    ? {
        id: `chal-sci-1`,
        title: `${chapter.title} — Experimental Analysis & Reasoning`,
        prompt: `Anomalous observational data is gathered in a controlled experiment testing ${chapter.title}. Account for the phenomenon using core scientific laws.`,
        hint: 'Examine independent and confounding variables.',
        modelAnswer: 'Scientific explanation establishing the causal mechanism.',
        rationale: 'Grounded in empirical laws and validated experimental evidence.',
        grammaticalRationale: 'Grounded in empirical laws and validated experimental evidence.',
        commonPitfall: 'Confusing correlation with causation or relying on surface analogies.',
        marks: 4,
        difficulty: 'Olympiad',
        cognitiveLevel: 'Analysing',
      }
    : isHistory
    ? {
        id: `chal-hist-1`,
        title: `${chapter.title} — Historiographical Inquiry`,
        prompt: `Evaluate conflicting historical interpretations regarding ${chapter.title}. What primary evidence best supports the prevailing consensus?`,
        hint: 'Critique the provenance and reliability of the conflicting sources.',
        modelAnswer: 'Structured historical synthesis integrating contextual evidence.',
        rationale: 'Corroborated by primary documentary evidence and critical source analysis.',
        grammaticalRationale: 'Corroborated by primary documentary evidence and critical source analysis.',
        commonPitfall: 'Anachronistic projection of modern concepts onto historical agents.',
        marks: 4,
        difficulty: 'Advanced',
        cognitiveLevel: 'Evaluating',
      }
    : {
        id: `chal-gen-1`,
        title: `${chapter.title} — High-Order Analytical Application`,
        prompt: `Analyze the core theoretical framework of ${chapter.title} in a complex scenario and formulate a rigorous solution.`,
        hint: 'Synthesize foundational principles with contextual constraints.',
        modelAnswer: 'Comprehensive analytical solution.',
        rationale: 'Rigorous application of conceptual frameworks.',
        grammaticalRationale: 'Rigorous application of conceptual frameworks.',
        commonPitfall: 'Superficial recall without deep conceptual synthesis.',
        marks: 4,
        difficulty: 'Advanced',
        cognitiveLevel: 'Analysing',
      };

  const [problems, setProblems] = useState<ChallengeProblemItem[]>(
    initialProblems.length > 0 ? initialProblems : [defaultProblem]
  );

  const [isTeacherView, setIsTeacherView] = useState(true);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ChallengeProblemItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const persistProblems = (updated: ChallengeProblemItem[]) => {
    setProblems(updated);
    onUpdateChapter({
      ...chapter,
      challengeProblems: updated,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleToggleReveal = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= problems.length) return;
    const reordered = [...problems];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    persistProblems(reordered);
  };

  const handleDelete = (id: string) => {
    const filtered = problems.filter((p) => p.id !== id);
    persistProblems(filtered);
  };

  const handleStartEdit = (prob: ChallengeProblemItem) => {
    setEditingProblemId(prob.id);
    setEditForm({ ...prob });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const updated = problems.map((p) => (p.id === editForm.id ? editForm : p));
    persistProblems(updated);
    setEditingProblemId(null);
    setEditForm(null);
  };

  const handleAddNew = () => {
    const newItem: ChallengeProblemItem = {
      id: `chal-${Date.now()}`,
      title: isGrammar
        ? `Challenge ${problems.length + 1}: Syntactic Trap`
        : isMath
        ? `Challenge ${problems.length + 1}: Non-Routine Problem`
        : isScience
        ? `Challenge ${problems.length + 1}: Deep Experimental Problem`
        : isHistory
        ? `Challenge ${problems.length + 1}: Historiographical Synthesis`
        : `Challenge ${problems.length + 1}: High-Order Analytical Application`,
      prompt: 'Enter the Olympiad or competition-level challenge question prompt...',
      hint: isGrammar
        ? 'Guide students toward structural decomposition without revealing the answer.'
        : 'Guide students toward foundational principles and decomposition without revealing the answer.',
      modelAnswer: isGrammar
        ? 'Enter verified model solution and syntactic reasoning...'
        : isMath
        ? 'Enter verified model solution and step-by-step mathematical derivation...'
        : 'Enter verified model solution and analytical justification...',
      rationale: isGrammar
        ? 'State the formal grammatical rule and concord justification...'
        : isMath
        ? 'State the formal mathematical theorem and proof...'
        : isScience
        ? 'State the governing empirical principle and reasoning...'
        : 'State the core theoretical framework and rationale...',
      grammaticalRationale: isGrammar
        ? 'State the formal grammatical rule and concord justification...'
        : 'State the formal academic justification...',
      commonPitfall: 'Describe the false intuition or trap students should avoid...',
      marks: 3,
      difficulty: 'Olympiad',
      cognitiveLevel: 'Evaluating',
    };
    const updated = [...problems, newItem];
    persistProblems(updated);
    setEditingProblemId(newItem.id);
    setEditForm(newItem);
    setIsAddingNew(false);
  };

  // AI Generation using active canonical academic context
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setErrorMessage(null);

    const chapterAny = chapter as any;
    const classLevel =
      chapterAny.targetClass ||
      chapterAny.classLevel ||
      seriesProject?.selectedClass ||
      '';
    const board =
      chapterAny.curriculumFramework ||
      chapterAny.board ||
      chapterAny.curriculumBoard ||
      seriesProject?.activeSystemId ||
      seriesProject?.targetBoard ||
      '';
    const subject = chapterAny.subject || seriesProject?.subject || (isGrammar ? 'English Grammar & Composition' : 'Academic Studies');
    const topic = chapter.title || (isGrammar ? 'Subject-Verb Agreement' : 'Core Chapter Study');

    if (!classLevel || !board) {
      setErrorMessage('Academic project context (Class Level and Curriculum Board) is required for authentic Olympiad generation.');
      setIsAiGenerating(false);
      return;
    }

    try {
      const res = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-19',
          topic,
          classLevel,
          board,
          subject,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate challenge drills');
      }

      const generated: ChallengeProblemItem[] = (data.data?.challengeProblems || []).map((cp: any, idx: number) => ({
        id: `chal-ai-${Date.now()}-${idx}`,
        title: cp.title || `Olympiad Drill ${problems.length + idx + 1}`,
        prompt: cp.prompt || '',
        hint: cp.hint || (isGrammar ? 'Carefully analyze syntactic relations.' : 'Examine fundamental constraints and invariants.'),
        modelAnswer: cp.modelAnswer || '',
        rationale: cp.rationale || cp.solutionReasoning || cp.conceptualExplanation || cp.grammaticalRationale || '',
        grammaticalRationale: cp.grammaticalRationale || cp.rationale || '',
        commonPitfall: cp.commonPitfall || '',
        marks: cp.marks || 3,
        difficulty: (cp.difficulty as any) || 'Olympiad',
        cognitiveLevel: cp.cognitiveLevel || 'Evaluating',
      }));

      if (generated.length > 0) {
        const merged = [...problems, ...generated];
        persistProblems(merged);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to AI generator.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
            <Award className="w-5 h-5 text-[#C29A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                Component 19 • Enrichment &amp; Olympiad
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-semibold border border-purple-200">
                Bloom Level 5–6
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#35101F]">
              Application &amp; Olympiad Challenge Drills
            </h2>
            <p className="text-xs text-[#71685E] mt-0.5">
              Author competitive examination questions, non-routine problems, and high-order analytical application tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Student vs Teacher Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsTeacherView(!isTeacherView)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isTeacherView
                ? 'bg-[#5A1832] border-[#5A1832] text-[#FFFDF8]'
                : 'bg-[#FFFDF8] border-[#CBBEAC] text-[#5A1832] hover:bg-[#EDE4D6]'
            }`}
          >
            {isTeacherView ? <Eye className="w-3.5 h-3.5 text-[#C29A52]" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isTeacherView ? 'Teacher Edition (Full Keys)' : 'Student Edition (Worksheet)'}</span>
          </button>

          {/* AI Generator */}
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#5A1832] text-xs font-bold rounded-lg border border-[#CBBEAC] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>{isAiGenerating ? 'Synthesizing Drills...' : 'AI Generate Drills'}</span>
          </button>

          {/* Add Problem */}
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>+ Add Challenge</span>
          </button>
        </div>
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Problems List */}
      <div className="space-y-4">
        {problems.map((prob, index) => {
          const isEditing = editingProblemId === prob.id;
          const isRevealed = isTeacherView || revealedSolutions[prob.id];

          if (isEditing && editForm) {
            return (
              <div
                key={prob.id}
                className="bg-[#FFFDF8] border-2 border-[#5A1832] rounded-xl p-5 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                  <span className="text-xs font-bold text-[#5A1832] uppercase">
                    Editing Challenge Problem #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-[#5A1832] hover:bg-[#35101F] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProblemId(null)}
                      className="px-3 py-1 bg-white border border-[#CBBEAC] text-[#71685E] rounded text-xs hover:bg-[#F6F0E7] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                      Problem Title:
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                      Marks / Weight:
                    </label>
                    <input
                      type="number"
                      value={editForm.marks || 3}
                      onChange={(e) => setEditForm({ ...editForm, marks: parseInt(e.target.value, 10) || 1 })}
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                    Problem Statement / Prompt:
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.prompt}
                    onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] font-serif leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                      Guiding Hint (Student Scaffolding):
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.hint || ''}
                      onChange={(e) => setEditForm({ ...editForm, hint: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Common Deceptive Trap / Pitfall:
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.commonPitfall || ''}
                      onChange={(e) => setEditForm({ ...editForm, commonPitfall: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                      Model Solution &amp; {isGrammar ? 'Syntactic Reasoning' : isMath ? 'Step-by-Step Derivation' : isScience ? 'Scientific Reasoning' : 'Analytical Justification'}:
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.modelAnswer || ''}
                      onChange={(e) => setEditForm({ ...editForm, modelAnswer: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-300 text-emerald-950 font-serif leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                      {rationaleLabel}:
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.rationale || editForm.grammaticalRationale || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          rationale: e.target.value,
                          grammaticalRationale: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={prob.id}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-3 transition-all hover:border-[#5A1832]/40"
            >
              {/* Problem Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                    Drill {index + 1}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                    {prob.difficulty || 'Olympiad'}
                  </span>
                  <span className="text-xs font-sans font-bold text-[#71685E]">
                    [{prob.marks || 3} Marks]
                  </span>
                  <h4 className="text-base font-serif font-bold text-[#35101F]">
                    {prob.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-[#71685E] hover:text-[#5A1832] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === problems.length - 1}
                    className="p-1 text-[#71685E] hover:text-[#5A1832] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(prob)}
                    className="p-1 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                    title="Edit Drill"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prob.id)}
                    className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                    title="Delete Drill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Problem Prompt */}
              <div className="p-3.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC]/70 font-serif text-sm text-[#292521] leading-relaxed">
                {prob.prompt}
              </div>

              {/* Student Hint Callout */}
              {prob.hint && (
                <div className="p-3 rounded-lg bg-[#EDE4D6]/50 border border-[#CBBEAC] flex items-start gap-2.5 text-xs text-[#292521]">
                  <Lightbulb className="w-4 h-4 text-[#C29A52] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#5A1832]">Analytical Hint: </span>
                    <span className="font-serif italic">{prob.hint}</span>
                  </div>
                </div>
              )}

              {/* Common Pitfall Note */}
              {prob.commonPitfall && isTeacherView && (
                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">Deceptive Trap: </span>
                    <span className="font-serif">{prob.commonPitfall}</span>
                  </div>
                </div>
              )}

              {/* Model Answer (Toggled in Student view, Always shown in Teacher view) */}
              {prob.modelAnswer && (
                <div>
                  {!isTeacherView && (
                    <button
                      type="button"
                      onClick={() => handleToggleReveal(prob.id)}
                      className="text-xs font-semibold text-[#5A1832] hover:underline flex items-center gap-1 cursor-pointer mb-2"
                    >
                      {revealedSolutions[prob.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-[#C29A52]" />}
                      <span>{revealedSolutions[prob.id] ? 'Hide Model Solution' : 'Reveal Model Solution'}</span>
                    </button>
                  )}

                  {isRevealed && (
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wide">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Verified Model Solution:</span>
                      </div>
                      <p className="font-serif text-emerald-950 leading-relaxed pl-5 font-medium">
                        {prob.modelAnswer}
                      </p>
                      {(prob.rationale || prob.grammaticalRationale) && (
                        <p className="pl-5 pt-1 text-[11px] text-emerald-800 font-serif italic">
                          <span className="font-bold">{rationaleLabel}: </span>
                          {prob.rationale || prob.grammaticalRationale}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
