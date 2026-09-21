import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Check,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Lightbulb,
  GraduationCap,
  Eye,
  ShieldAlert,
  Loader2,
  ChevronDown,
  ChevronUp,
  Tag,
  Hash,
  ArrowRight,
  Info,
  HelpCircle,
  Copy,
  Undo2,
} from 'lucide-react';
import {
  StudioChapter,
  Component06Data,
  RuleVariationItem,
  RuleExceptionItem,
  StructuralFormulaToken,
  Component06TeacherAnnotations,
} from '../../types';

export interface Component06RulesAuthoringProps {
  chapter: StudioChapter;
  onUpdateChapter: (chapter: StudioChapter) => void;
  isDarkMode?: boolean;
}

export const Component06RulesAuthoring: React.FC<Component06RulesAuthoringProps> = ({
  chapter,
  onUpdateChapter,
  isDarkMode = false,
}) => {
  const c06 = chapter.component06;
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [previewTab, setPreviewTab] = useState<'author' | 'student' | 'teacher'>('author');
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
  const [editingTokenIdx, setEditingTokenIdx] = useState<number | null>(null);

  // Helper to update component06 data
  const updateComp06 = (updater: (prev: Component06Data) => Component06Data) => {
    const defaultComp06: Component06Data = {
      status: 'draft',
      ruleIdentifier: 'RULE 6.1 • Principal Law of Syntactic Concord',
      formalRuleStatement: '',
      pedagogicalSummary: '',
      structuralFormula: '[SUBJECT / HEAD NOUN] + (intervening phrases) + [FINITE VERB]',
      formulaTokens: [
        { text: '[SUBJECT / HEAD NOUN]', role: 'subject', highlight: true },
        { text: '+', role: 'operator' },
        { text: '(intervening modifiers)', role: 'modifier', highlight: false },
        { text: '⟶', role: 'operator' },
        { text: '[FINITE VERB (Matches Head Noun)]', role: 'verb', highlight: true },
      ],
      ruleVariations: [],
      ruleOfThumb: {
        title: 'Essential Rule of Thumb',
        summary: 'Look past the intervening words to identify the true head noun.',
        mnemonicOrContrast: 'Singular nouns take singular verbs (with -s); plural nouns take plural verbs (without -s).',
      },
      exceptions: [],
      wordCount: 0,
      lastModified: new Date().toISOString(),
    };

    const prev = chapter.component06 || defaultComp06;
    const updated = updater(prev);
    updated.lastModified = new Date().toISOString();
    updated.wordCount = calculateWordCount(updated);

    onUpdateChapter({
      ...chapter,
      component06: updated,
      lastSaved: new Date().toISOString(),
      saveStatus: 'saved',
    });
  };

  const calculateWordCount = (data: Component06Data): number => {
    const textParts = [
      data.formalRuleStatement || '',
      data.pedagogicalSummary || '',
      data.ruleOfThumb?.summary || '',
      ...(data.ruleVariations || []).flatMap((v) => [
        v.ruleStatement,
        v.correctExample,
        v.incorrectExample || '',
        v.explanation,
      ]),
      ...(data.exceptions || []).flatMap((e) => [e.explanation, e.example]),
    ];
    return textParts.join(' ').trim().split(/\s+/).filter(Boolean).length;
  };

  // Status toggle
  const handleToggleStatus = () => {
    const statusCycle: Array<Component06Data['status']> = ['draft', 'complete', 'needs_review'];
    const current = c06?.status || 'draft';
    const nextIdx = (statusCycle.indexOf(current) + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIdx];

    updateComp06((prev) => ({
      ...prev,
      status: nextStatus,
    }));
  };

  // AI Generation
  const handleGenerateRules = async (force = false) => {
    const hasContent = Boolean(
      c06 &&
      ((c06.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
       (Array.isArray(c06.ruleVariations) && c06.ruleVariations.length > 0))
    );

    if (hasContent && !force) {
      setShowRegenerateConfirm(true);
      return;
    }

    setShowRegenerateConfirm(false);
    setIsGenerating(true);
    setNotice(null);

    try {
      const payload = {
        board: chapter.curriculumBoard || chapter.systemId || 'CISCE',
        grade: chapter.equivalentClass || 'Class 6',
        classLevel: chapter.equivalentClass || 'Class 6',
        bookTitle: chapter.bookTitle || 'Classical Grammar: ICSE Class 6',
        seriesTitle: 'Grammar in Action: Tri-Board English Series',
        chapterTitle: chapter.title || 'Subject–Verb Agreement: Concord & Syntactic Synthesis',
        grammarTopic: chapter.shortTitle || chapter.title?.split(':')[0]?.trim() || 'Subject–Verb Agreement',
        grammarStrand: chapter.category || 'Verbal Syntax & Concord',
        discoveryVignette: chapter.opening?.discoveryVignette || '',
        discoveryQuestions: chapter.opening?.discoveryQuestions || '',
        conceptualExplanation: chapter.component05?.conceptualExplanation || '',
        syntacticAnalysis: chapter.component05?.syntacticAnalysis || [],
        componentNumber: 6,
      };

      const res = await fetch('/api/chapter-studio/generate-grammar-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const updatedComponent06: Component06Data = {
        status: 'draft',
        ruleIdentifier: data.ruleIdentifier || 'RULE 6.1 • Law of Grammatical Concord',
        formalRuleStatement: data.formalRuleStatement || '',
        pedagogicalSummary: data.pedagogicalSummary || '',
        structuralFormula: data.structuralFormula || '',
        formulaTokens: Array.isArray(data.formulaTokens) ? data.formulaTokens : [],
        ruleVariations: Array.isArray(data.ruleVariations) ? data.ruleVariations : [],
        ruleOfThumb: data.ruleOfThumb || {
          title: 'Essential Rule of Thumb',
          summary: '',
          mnemonicOrContrast: '',
        },
        exceptions: Array.isArray(data.exceptions) ? data.exceptions : [],
        teacherAnnotations: data.teacherAnnotations || undefined,
        wordCount: data.wordCount || 0,
        generatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        generationMetadata: data.generationMetadata || {
          board: chapter.curriculumBoard || 'CISCE',
          grade: chapter.equivalentClass || 'Class 6',
          topic: chapter.title,
          model: 'gemini-3.8-flash',
          generatedAt: new Date().toISOString(),
        },
      };

      onUpdateChapter({
        ...chapter,
        component06: updatedComponent06,
        stageStatuses: {
          ...chapter.stageStatuses,
          rules: 'in_progress',
        },
        lastSaved: new Date().toISOString(),
        saveStatus: 'saved',
      });

      setNotice({
        type: 'success',
        text: `Successfully generated COMP-06 Grammar Rules & Structural Form Boxes (${updatedComponent06.ruleVariations.length} sub-rules, ${updatedComponent06.exceptions.length} exceptions).`,
      });
    } catch (err: any) {
      console.error('Failed to generate grammar rules:', err);
      setNotice({
        type: 'error',
        text: `Error generating grammar rules: ${err.message || 'Unknown network error'}.`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Variation Handlers
  const handleAddVariation = () => {
    const newId = `var-${Date.now()}`;
    const newVariation: RuleVariationItem = {
      id: newId,
      title: `Variation ${(c06?.ruleVariations?.length || 0) + 1}`,
      condition: 'When the subject is...',
      ruleStatement: 'State the specific agreement pattern for this condition.',
      formula: '[Subject Type] + [Verb Form]',
      correctExample: 'The head noun governs the verb.',
      incorrectExample: '* The modifying noun incorrectly governs the verb.',
      explanation: 'Explain why this sentence is grammatically sound and identify the concord link.',
      learnerNote: 'Watch out for...',
    };

    updateComp06((prev) => ({
      ...prev,
      ruleVariations: [...(prev.ruleVariations || []), newVariation],
    }));
    setActiveVariationId(newId);
  };

  const handleUpdateVariation = (id: string, field: keyof RuleVariationItem, value: any) => {
    updateComp06((prev) => ({
      ...prev,
      ruleVariations: (prev.ruleVariations || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveVariation = (id: string) => {
    updateComp06((prev) => ({
      ...prev,
      ruleVariations: (prev.ruleVariations || []).filter((item) => item.id !== id),
    }));
  };

  // Exception Handlers
  const handleAddException = () => {
    const newId = `exc-${Date.now()}`;
    const newException: RuleExceptionItem = {
      id: newId,
      caseTitle: 'Special Caveat / Exception Case',
      condition: 'When using special collective or quantitative constructions...',
      explanation: 'Explain the linguistic reasoning behind this divergence from the standard rule.',
      example: 'Example sentence demonstrating this exception.',
    };

    updateComp06((prev) => ({
      ...prev,
      exceptions: [...(prev.exceptions || []), newException],
    }));
  };

  const handleUpdateException = (id: string, field: keyof RuleExceptionItem, value: any) => {
    updateComp06((prev) => ({
      ...prev,
      exceptions: (prev.exceptions || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveException = (id: string) => {
    updateComp06((prev) => ({
      ...prev,
      exceptions: (prev.exceptions || []).filter((item) => item.id !== id),
    }));
  };

  // Formula Token Handlers
  const handleAddToken = () => {
    const newToken: StructuralFormulaToken = {
      id: `token-${Date.now()}`,
      text: '[NEW ELEMENT]',
      role: 'subject',
      highlight: true,
    };
    updateComp06((prev) => ({
      ...prev,
      formulaTokens: [...(prev.formulaTokens || []), newToken],
    }));
  };

  const handleUpdateToken = (idx: number, field: keyof StructuralFormulaToken, value: any) => {
    updateComp06((prev) => {
      const tokens = [...(prev.formulaTokens || [])];
      if (tokens[idx]) {
        tokens[idx] = { ...tokens[idx], [field]: value };
      }
      return { ...prev, formulaTokens: tokens };
    });
  };

  const handleRemoveToken = (idx: number) => {
    updateComp06((prev) => {
      const tokens = (prev.formulaTokens || []).filter((_, i) => i !== idx);
      return { ...prev, formulaTokens: tokens };
    });
  };

  // Teacher Annotation Handlers
  const handleUpdateTeacherAnnotation = (field: keyof Component06TeacherAnnotations, value: any) => {
    updateComp06((prev) => ({
      ...prev,
      teacherAnnotations: {
        ...(prev.teacherAnnotations || {}),
        [field]: value,
      },
    }));
  };

  const currentStatus = c06?.status || 'not_started';
  const hasContent = Boolean(
    c06 &&
    ((c06.formalRuleStatement && c06.formalRuleStatement.trim().length > 0) ||
     (Array.isArray(c06.ruleVariations) && c06.ruleVariations.length > 0))
  );
  const wordCount = c06?.wordCount || (c06 ? calculateWordCount(c06) : 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
            <BookOpen className="w-5 h-5 text-[#C29A52]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                Component 6 • Grammar Rules &amp; Structural Form Boxes
              </span>
              <button
                type="button"
                onClick={handleToggleStatus}
                className="cursor-pointer group flex items-center gap-1"
                title="Click to toggle status: Draft → Complete → Needs Review"
              >
                {currentStatus === 'complete' ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> COMPLETE
                  </span>
                ) : currentStatus === 'needs_review' ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold border border-purple-300">
                    NEEDS REVIEW
                  </span>
                ) : hasContent ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    DRAFT
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium border border-stone-200">
                    PENDING DRAFT
                  </span>
                )}
              </button>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#292521]">
              Grammar Rules &amp; Structural Form Boxes
            </h2>
            <p className="text-xs text-[#71685E] mt-0.5">
              Transform conceptual understanding from Component 5 into definitive grammar rules, visual structural formulas, contrastive exemplars, and caution boxes.
            </p>
          </div>
        </div>

        {/* Action Controls & Preview Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#EDE4D6] p-0.5 rounded-lg border border-[#CBBEAC] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewTab('author')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                previewTab === 'author'
                  ? 'bg-[#5A1832] text-white shadow-xs'
                  : 'text-[#71685E] hover:text-[#5A1832]'
              }`}
            >
              Authoring
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('student')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                previewTab === 'student'
                  ? 'bg-[#5A1832] text-white shadow-xs'
                  : 'text-[#71685E] hover:text-[#5A1832]'
              }`}
            >
              Student View
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('teacher')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                previewTab === 'teacher'
                  ? 'bg-[#5A1832] text-white shadow-xs'
                  : 'text-[#71685E] hover:text-[#5A1832]'
              }`}
            >
              Teacher Edition
            </button>
          </div>

          {/* AI Generation Button */}
          <button
            type="button"
            onClick={() => handleGenerateRules(false)}
            disabled={isGenerating}
            className="h-9 px-3.5 inline-flex items-center space-x-1.5 rounded-lg text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] active:bg-[#250813] shadow-xs transition-all cursor-pointer border border-[#C29A52]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none"
            title="Generate curriculum-grounded rules and structural formulas using Gemini 3.8 Flash"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#C29A52] animate-spin" />
                <span>Generating Rules &amp; Formulas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>{hasContent ? 'Regenerate Rules' : 'Generate Grammar Rules'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overwrite Confirmation Alert */}
      {showRegenerateConfirm && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Existing Rule Box Content Found</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Regenerating will replace your current formal rule statements, structural formulas, variations, and exception boxes with newly generated content.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRegenerateConfirm(false)}
              className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-white hover:bg-amber-100 font-semibold cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleGenerateRules(true)}
              className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-white hover:bg-[#35101F] font-bold cursor-pointer text-xs shadow-xs"
            >
              Overwrite &amp; Regenerate
            </button>
          </div>
        </div>
      )}

      {/* Notice Message */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 border shadow-xs ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : notice.type === 'error'
              ? 'bg-rose-50 text-rose-950 border-rose-300'
              : 'bg-sky-50 text-sky-950 border-sky-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : notice.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-700 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer px-1.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. AUTHORING MODE                                                         */}
      {/* ========================================================================= */}
      {previewTab === 'author' && (
        <div className="space-y-6">
          {/* Section 1: Master Rule Definition */}
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#C29A52]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] font-mono">
                  1. Master Rule Statement &amp; Identifier
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#71685E]">
                {wordCount} words total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Rule Identifier:
                </label>
                <input
                  type="text"
                  value={c06?.ruleIdentifier || ''}
                  onChange={(e) => updateComp06((prev) => ({ ...prev, ruleIdentifier: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-mono font-bold text-[#5A1832] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. RULE 6.1 • Principal Law of Syntactic Concord"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Student Plain-English Summary:
                </label>
                <input
                  type="text"
                  value={c06?.pedagogicalSummary || ''}
                  onChange={(e) => updateComp06((prev) => ({ ...prev, pedagogicalSummary: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. A verb must always match its true subject in number (singular or plural) and person, no matter what words come between them."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                Authoritative Formal Rule Statement (Textbook Canonical Wording):
              </label>
              <textarea
                rows={3}
                value={c06?.formalRuleStatement || ''}
                onChange={(e) => updateComp06((prev) => ({ ...prev, formalRuleStatement: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs sm:text-sm font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                placeholder="e.g. In English grammar, a finite verb must agree in Number and Person with its true Grammatical Subject. A singular subject demands a singular verb; a plural subject demands a plural verb. Intervening phrases or words modifying the subject do not alter this grammatical concord."
              />
              <p className="text-[11px] text-[#71685E] italic">
                Definitive phrasing suitable for formal examination citations in CISCE Class 6.
              </p>
            </div>
          </div>

          {/* Section 2: Structural Formula & Form Box Tokens */}
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C29A52]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] font-mono">
                  2. Structural Formula Box &amp; Tokens
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddToken}
                className="text-[11px] font-bold text-[#5A1832] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Token
              </button>
            </div>

            {/* Formula Raw Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                Structural Formula String:
              </label>
              <input
                type="text"
                value={c06?.structuralFormula || ''}
                onChange={(e) => updateComp06((prev) => ({ ...prev, structuralFormula: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-mono font-bold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                placeholder="e.g. [SUBJECT / HEAD NOUN] + (intervening words) + [FINITE VERB]"
              />
            </div>

            {/* Visual Formula Box Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                Live Formula Box Preview (Student Display):
              </span>
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFFDF8] via-[#F6F0E7] to-[#FFFDF8] border-2 border-[#5A1832]/30 flex flex-wrap items-center justify-center gap-2 text-xs shadow-inner">
                {(c06?.formulaTokens && c06.formulaTokens.length > 0
                  ? c06.formulaTokens
                  : [
                      { text: '[SUBJECT / HEAD NOUN]', role: 'subject', highlight: true },
                      { text: '+', role: 'operator' },
                      { text: '(intervening phrase)', role: 'modifier', highlight: false },
                      { text: '⟶', role: 'operator' },
                      { text: '[FINITE VERB (Matches Head Noun)]', role: 'verb', highlight: true },
                    ]
                ).map((tok, tIdx) => {
                  const isSubject = tok.role === 'subject';
                  const isVerb = tok.role === 'verb';
                  const isModifier = tok.role === 'modifier';
                  const isOperator = tok.role === 'operator' || tok.role === 'punctuation';

                  return (
                    <span
                      key={tok.id || tIdx}
                      onClick={() => setEditingTokenIdx(editingTokenIdx === tIdx ? null : tIdx)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer select-none shadow-2xs ${
                        isSubject
                          ? 'bg-[#5A1832] text-white border border-[#35101F]'
                          : isVerb
                          ? 'bg-emerald-700 text-white border border-emerald-800'
                          : isModifier
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 italic'
                          : isOperator
                          ? 'bg-transparent text-[#5A1832] font-black text-sm px-1'
                          : 'bg-[#EDE4D6] text-[#292521] border border-[#CBBEAC]'
                      } ${editingTokenIdx === tIdx ? 'ring-2 ring-[#C29A52] ring-offset-1' : ''}`}
                      title={`Role: ${tok.role}. Click to edit token.`}
                    >
                      {tok.text}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Token Editor List */}
            {c06?.formulaTokens && c06.formulaTokens.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#CBBEAC]/50">
                <span className="text-[10px] font-bold text-[#71685E] uppercase font-mono block">
                  Token Breakdown &amp; Roles:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {c06.formulaTokens.map((tok, idx) => (
                    <div
                      key={tok.id || idx}
                      className="p-2.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] flex items-center justify-between gap-2 text-xs"
                    >
                      <input
                        type="text"
                        value={tok.text}
                        onChange={(e) => handleUpdateToken(idx, 'text', e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-white border border-[#CBBEAC] text-xs font-mono font-bold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                      />
                      <select
                        value={tok.role}
                        onChange={(e) => handleUpdateToken(idx, 'role', e.target.value)}
                        className="px-1.5 py-1 rounded bg-white border border-[#CBBEAC] text-[10px] font-mono font-bold text-[#5A1832] focus:outline-none"
                      >
                        <option value="subject">Subject</option>
                        <option value="verb">Verb</option>
                        <option value="modifier">Modifier</option>
                        <option value="operator">Operator (+/⟶)</option>
                        <option value="conjunction">Conjunction</option>
                        <option value="object">Object</option>
                        <option value="punctuation">Punctuation</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveToken(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete token"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Rule Variations & Sub-Rules */}
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C29A52]" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] font-mono">
                  3. Rule Variations &amp; Sub-Rules ({c06?.ruleVariations?.length || 0} Scenarios)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddVariation}
                className="text-[11px] font-bold text-[#5A1832] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Sub-Rule Variation
              </button>
            </div>

            {(!c06?.ruleVariations || c06.ruleVariations.length === 0) ? (
              <div className="p-6 rounded-xl bg-[#F6F0E7] border border-dashed border-[#CBBEAC] text-center space-y-2">
                <p className="text-xs text-[#71685E] italic">
                  No rule variations added yet. Click &ldquo;Generate Grammar Rules&rdquo; above to synthesize curriculum-aligned sub-rules, or click &ldquo;Add Sub-Rule Variation&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={handleAddVariation}
                  className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-white text-xs font-bold cursor-pointer hover:bg-[#35101F]"
                >
                  Add First Variation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {c06.ruleVariations.map((item, idx) => {
                  const isExpanded = activeVariationId === item.id || activeVariationId === null;

                  return (
                    <div
                      key={item.id || idx}
                      className="rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-2xs overflow-hidden"
                    >
                      {/* Accordion Bar */}
                      <div
                        onClick={() => setActiveVariationId(activeVariationId === item.id ? 'none' : item.id)}
                        className="p-3 bg-[#F6F0E7] flex items-center justify-between gap-3 cursor-pointer hover:bg-[#EDE4D6]/70 transition-colors border-b border-[#CBBEAC]/60"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#5A1832] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-serif font-bold text-xs text-[#292521]">
                            {item.title || `Variation ${idx + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-[#71685E] hidden sm:inline">
                            [{item.condition || 'Condition'}]
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveVariation(item.id);
                            }}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            title="Delete this sub-rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#71685E]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#71685E]" />
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      {isExpanded && (
                        <div className="p-4 space-y-3.5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Sub-Rule Title / Name:
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleUpdateVariation(item.id, 'title', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif font-bold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. Singular Subject with Intervening Prepositional Phrase"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                                Syntactic Condition / Context:
                              </label>
                              <input
                                type="text"
                                value={item.condition}
                                onChange={(e) => handleUpdateVariation(item.id, 'condition', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-mono text-[#5A1832] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                                placeholder="e.g. When a singular noun is modified by a phrase beginning with 'of', 'in', or 'with'"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                              Sub-Rule Statement:
                            </label>
                            <input
                              type="text"
                              value={item.ruleStatement}
                              onChange={(e) => handleUpdateVariation(item.id, 'ruleStatement', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. The verb remains strictly singular because the intervening prepositional phrase does not alter the head noun."
                            />
                          </div>

                          {/* Exemplars */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1 p-3 rounded-lg bg-emerald-50/70 border border-emerald-300">
                              <label className="text-[10px] font-bold text-emerald-900 uppercase font-mono flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Positive Exemplar (Correct):</span>
                              </label>
                              <input
                                type="text"
                                value={item.correctExample}
                                onChange={(e) => handleUpdateVariation(item.id, 'correctExample', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-white border border-emerald-300 text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                placeholder="e.g. The basket of ripe mangoes smells delightful."
                              />
                            </div>

                            <div className="space-y-1 p-3 rounded-lg bg-rose-50/70 border border-rose-300">
                              <label className="text-[10px] font-bold text-rose-900 uppercase font-mono flex items-center gap-1">
                                <span className="font-bold text-rose-700">*</span>
                                <span>Contrastive Non-Exemplar (Incorrect):</span>
                              </label>
                              <input
                                type="text"
                                value={item.incorrectExample || ''}
                                onChange={(e) => handleUpdateVariation(item.id, 'incorrectExample', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-white border border-rose-300 text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-rose-600"
                                placeholder="e.g. * The basket of ripe mangoes smell delightful."
                              />
                            </div>
                          </div>

                          {/* Linguistic Explanation */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                              Linguistic / Syntactic Explanation:
                            </label>
                            <textarea
                              rows={2}
                              value={item.explanation}
                              onChange={(e) => handleUpdateVariation(item.id, 'explanation', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. The true subject is the singular head noun 'basket', which requires 'smells'. The plural noun 'mangoes' is merely the object of the preposition."
                            />
                          </div>

                          {/* Learner Note */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                              Learner Tip / Avoidance Note:
                            </label>
                            <input
                              type="text"
                              value={item.learnerNote || ''}
                              onChange={(e) => handleUpdateVariation(item.id, 'learnerNote', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#71685E] italic focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                              placeholder="e.g. Do not let your ear be misled by the noun right next to the verb."
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

          {/* Section 4: Rule Exceptions & Caution Box */}
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-950 font-mono">
                  4. Rule Exceptions &amp; Caution Box ({c06?.exceptions?.length || 0} Special Cases)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddException}
                className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exception Case
              </button>
            </div>

            {(!c06?.exceptions || c06.exceptions.length === 0) ? (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-dashed border-amber-300 text-center text-xs text-amber-900 italic">
                No exceptions added yet. Click &ldquo;Add Exception Case&rdquo; to author special caveat scenarios (e.g., nouns plural in form, sums of money, or titles).
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {c06.exceptions.map((exc, idx) => (
                  <div
                    key={exc.id || idx}
                    className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-300/80 space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-1.5">
                      <input
                        type="text"
                        value={exc.caseTitle}
                        onChange={(e) => handleUpdateException(exc.id, 'caseTitle', e.target.value)}
                        className="font-bold text-xs font-mono text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300 flex-1 focus:outline-none"
                        placeholder="e.g. Nouns Plural in Form but Singular in Meaning"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveException(exc.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete exception"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-900 uppercase font-mono">
                        Trigger Condition:
                      </label>
                      <input
                        type="text"
                        value={exc.condition}
                        onChange={(e) => handleUpdateException(exc.id, 'condition', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-white border border-amber-200 text-xs font-serif text-[#292521] focus:outline-none"
                        placeholder="e.g. Names of subjects or diseases ending in -s (physics, mathematics, measles)"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-900 uppercase font-mono">
                        Linguistic Reason:
                      </label>
                      <textarea
                        rows={2}
                        value={exc.explanation}
                        onChange={(e) => handleUpdateException(exc.id, 'explanation', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-white border border-amber-200 text-xs font-serif text-[#292521] focus:outline-none"
                        placeholder="e.g. These words denote a single branch of study or ailment, so their grammatical number is singular despite the final -s."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-900 uppercase font-mono">
                        Exemplar Sentence:
                      </label>
                      <input
                        type="text"
                        value={exc.example}
                        onChange={(e) => handleUpdateException(exc.id, 'example', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-white border border-emerald-300 text-xs font-serif text-[#292521] font-semibold focus:outline-none"
                        placeholder="e.g. Mathematics is a fascinating subject."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Essential Rule of Thumb / Mnemonic Callout */}
          <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#CBBEAC]/60 pb-2">
              <Lightbulb className="w-4 h-4 text-[#C29A52]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A1832] font-mono">
                5. Essential Rule of Thumb / Mnemonic Callout
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Callout Title:
                </label>
                <input
                  type="text"
                  value={c06?.ruleOfThumb?.title || ''}
                  onChange={(e) =>
                    updateComp06((prev) => ({
                      ...prev,
                      ruleOfThumb: { ...(prev.ruleOfThumb || { title: '', summary: '' }), title: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif font-bold text-[#5A1832] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. The Golden Rule of Concord"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Mnemonic / Contrast Tip:
                </label>
                <input
                  type="text"
                  value={c06?.ruleOfThumb?.mnemonicOrContrast || ''}
                  onChange={(e) =>
                    updateComp06((prev) => ({
                      ...prev,
                      ruleOfThumb: {
                        ...(prev.ruleOfThumb || { title: '', summary: '' }),
                        mnemonicOrContrast: e.target.value,
                      },
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-mono text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. The Inverse -s Law: Verbs with -s are SINGULAR; Nouns with -s are PLURAL."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                Core Summary Callout Wording:
              </label>
              <textarea
                rows={2}
                value={c06?.ruleOfThumb?.summary || ''}
                onChange={(e) =>
                  updateComp06((prev) => ({
                    ...prev,
                    ruleOfThumb: { ...(prev.ruleOfThumb || { title: '', summary: '' }), summary: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-[#292521] text-xs font-serif leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                placeholder="e.g. When in doubt, mentally cross out all words between the head noun and the verb. If the head noun is singular, choose the singular verb."
              />
            </div>
          </div>

          {/* Section 6: Teacher Edition Pedagogical Annotations */}
          <div className="bg-[#FFFDF8] border-2 border-dashed border-[#C29A52]/70 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#C29A52]/50 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#5A1832] font-bold uppercase tracking-wider text-xs">
                <GraduationCap className="w-4 h-4 text-[#5A1832]" />
                <span>6. Teacher Edition Pedagogical Annotations (COMP-06)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                Board Syllabus: CISCE Class 6
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                  Board Exam Alignment &amp; Examiner Traps:
                </label>
                <textarea
                  rows={2}
                  value={c06?.teacherAnnotations?.boardExamAlignmentNote || ''}
                  onChange={(e) => handleUpdateTeacherAnnotation('boardExamAlignmentNote', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. CISCE middle-school examinations heavily test proximity error (e.g. 'One of my friends is/are'). Ensure students explicitly bracket prepositional phrases."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#5A1832] uppercase font-mono">
                  Introduction &amp; Rule Delivery Strategy:
                </label>
                <textarea
                  rows={2}
                  value={c06?.teacherAnnotations?.introductionStrategy || ''}
                  onChange={(e) => handleUpdateTeacherAnnotation('introductionStrategy', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. Have students read the formula aloud before copying the rule box. Use color-coded chalk/markers (red for head noun, green for verb)."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Blackboard Summary Schema:
                </label>
                <textarea
                  rows={2}
                  value={c06?.teacherAnnotations?.blackboardSummarySchema || ''}
                  onChange={(e) => handleUpdateTeacherAnnotation('blackboardSummarySchema', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-mono text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. Write: [SINGULAR HEAD] ... (phrase) ... [SINGULAR VERB (-s)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#71685E] uppercase font-mono">
                  Diagnostic Check Suggestion:
                </label>
                <textarea
                  rows={2}
                  value={c06?.teacherAnnotations?.diagnosticCheckSuggestion || ''}
                  onChange={(e) => handleUpdateTeacherAnnotation('diagnosticCheckSuggestion', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#CBBEAC] bg-[#F6F0E7] text-xs font-serif text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  placeholder="e.g. Present 3 rapid-fire diagnostic pairs on the board; ask students to hold up 1 finger for Option A or 2 fingers for Option B."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STUDENT VIEW (TEXTBOOK PUBLISHED RENDERING)                             */}
      {/* ========================================================================= */}
      {(previewTab === 'student' || previewTab === 'teacher') && (
        <div className="p-6 rounded-2xl border border-[#CBBEAC] bg-[#FFFDF8] shadow-xs space-y-6">
          {/* Component Header Banner */}
          <div className="border-b border-[#CBBEAC]/70 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A1832] block font-mono">
                {c06?.ruleIdentifier || 'RULE 6.1 • PRINCIPAL LAW OF SYNTACTIC CONCORD'}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#292521]">
                Grammar Rule &amp; Structural Form Box
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                COMP-06
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-white text-[#71685E] border border-[#CBBEAC]">
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Master Rule Box Frame */}
          <div className="p-5 rounded-xl bg-[#F6F0E7] border-2 border-[#5A1832] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#5A1832] font-bold text-xs uppercase tracking-wider font-mono">
              <BookOpen className="w-4 h-4 text-[#C29A52]" />
              <span>The Principal Rule</span>
            </div>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-[#292521] font-semibold">
              {c06?.formalRuleStatement ||
                'In English grammar, a finite verb must agree in Number and Person with its true Grammatical Subject. A singular subject demands a singular verb; a plural subject demands a plural verb.'}
            </p>

            {c06?.pedagogicalSummary && (
              <p className="font-serif text-xs text-[#71685E] italic border-t border-[#CBBEAC]/60 pt-2">
                <strong>In simple terms:</strong> {c06.pedagogicalSummary}
              </p>
            )}

            {/* Visual Formula Box */}
            <div className="p-4 rounded-lg bg-[#FFFDF8] border border-[#CBBEAC] flex flex-wrap items-center justify-center gap-2 text-xs shadow-inner">
              {(c06?.formulaTokens && c06.formulaTokens.length > 0
                ? c06.formulaTokens
                : [
                    { text: '[SUBJECT / HEAD NOUN]', role: 'subject' },
                    { text: '+', role: 'operator' },
                    { text: '(intervening phrase)', role: 'modifier' },
                    { text: '⟶', role: 'operator' },
                    { text: '[FINITE VERB]', role: 'verb' },
                  ]
              ).map((tok, tIdx) => {
                const isSubject = tok.role === 'subject';
                const isVerb = tok.role === 'verb';
                const isModifier = tok.role === 'modifier';
                const isOperator = tok.role === 'operator' || tok.role === 'punctuation';

                return (
                  <span
                    key={tok.id || tIdx}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold ${
                      isSubject
                        ? 'bg-[#5A1832] text-white'
                        : isVerb
                        ? 'bg-emerald-700 text-white'
                        : isModifier
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 italic'
                        : isOperator
                        ? 'bg-transparent text-[#5A1832] font-black text-sm px-1'
                        : 'bg-[#EDE4D6] text-[#292521]'
                    }`}
                  >
                    {tok.text}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Sub-Rules & Variations */}
          {c06?.ruleVariations && c06.ruleVariations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A1832] font-mono flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>Specific Rule Variations &amp; Structural Applications</span>
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {c06.ruleVariations.map((v, vIdx) => (
                  <div
                    key={v.id || vIdx}
                    className="p-4 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] space-y-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-baseline justify-between gap-2 border-b border-[#CBBEAC]/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#5A1832] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {vIdx + 1}
                        </span>
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-[#292521]">
                          {v.title}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-[#5A1832] font-semibold">
                        {v.condition}
                      </span>
                    </div>

                    <p className="font-serif text-[#292521] leading-relaxed">
                      {v.ruleStatement}
                    </p>

                    {/* Exemplars Pair */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-300 text-[11px] space-y-0.5">
                        <span className="font-mono font-bold text-emerald-900 uppercase text-[9px] flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Correct Exemplar:</span>
                        </span>
                        <p className="font-serif text-emerald-950 font-semibold">
                          &ldquo;{v.correctExample}&rdquo;
                        </p>
                      </div>

                      {v.incorrectExample && (
                        <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-300 text-[11px] space-y-0.5">
                          <span className="font-mono font-bold text-rose-900 uppercase text-[9px]">
                            * Incorrect Non-Exemplar:
                          </span>
                          <p className="font-serif text-rose-950 line-through">
                            &ldquo;{v.incorrectExample}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {v.explanation && (
                      <p className="text-[11px] text-[#71685E] font-serif leading-relaxed pt-1 border-t border-[#CBBEAC]/40">
                        <strong>Why:</strong> {v.explanation}
                      </p>
                    )}

                    {v.learnerNote && (
                      <div className="p-2 rounded bg-[#F6F0E7] text-[10px] font-mono text-[#5A1832] border border-[#CBBEAC]/50">
                        <strong>Tip:</strong> {v.learnerNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exceptions Box */}
          {c06?.exceptions && c06.exceptions.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider font-mono">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Caution Box • Special Caveats &amp; Apparent Exceptions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {c06.exceptions.map((exc, eIdx) => (
                  <div
                    key={exc.id || eIdx}
                    className="p-3 rounded-lg bg-white/80 border border-amber-300/80 space-y-1"
                  >
                    <span className="font-mono font-bold text-amber-950 text-[11px] block">
                      {exc.caseTitle}
                    </span>
                    <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                      {exc.explanation}
                    </p>
                    <p className="font-serif text-[11px] font-semibold text-emerald-900 italic pt-1">
                      &ldquo;{exc.example}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rule of Thumb Callout */}
          {c06?.ruleOfThumb && (c06.ruleOfThumb.summary || c06.ruleOfThumb.mnemonicOrContrast) && (
            <div className="p-4 rounded-xl bg-[#EDE4D6] border border-[#C29A52] flex items-start gap-3 text-xs">
              <Lightbulb className="w-5 h-5 text-[#C29A52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-mono font-bold text-xs text-[#5A1832] uppercase tracking-wider block">
                  {c06.ruleOfThumb.title || 'Rule of Thumb'}
                </span>
                <p className="font-serif text-xs text-[#292521] leading-relaxed">
                  {c06.ruleOfThumb.summary}
                </p>
                {c06.ruleOfThumb.mnemonicOrContrast && (
                  <p className="font-mono text-[11px] text-[#5A1832] font-semibold pt-1 border-t border-[#CBBEAC]/50">
                    💡 {c06.ruleOfThumb.mnemonicOrContrast}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Teacher Edition Pedagogical Guidance (Only in Teacher View) */}
          {previewTab === 'teacher' && (
            <div className="mt-6 pt-4 border-t-2 border-dashed border-[#C29A52] bg-[#EDE4D6]/80 p-5 rounded-xl space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-[#C29A52]/50 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[#5A1832] font-bold uppercase tracking-wider text-xs">
                  <GraduationCap className="w-4 h-4 text-[#5A1832]" />
                  <span>Teacher Edition Pedagogical Guidance • COMP-06 Rules &amp; Form Boxes</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-white text-[#5A1832] border border-[#CBBEAC]">
                  CISCE Class 6
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#5A1832] block">
                  1. Board Exam Traps &amp; Common Confusion Points
                </span>
                <p className="font-serif leading-relaxed text-[11px] text-[#292521]">
                  {c06?.teacherAnnotations?.boardExamAlignmentNote ||
                    'In CISCE examinations, pupils frequently stumble on proximity agreement. Emphasize that physical proximity on the page is irrelevant; only grammatical syntactic dependency governs verb concord.'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                  2. Introduction &amp; Classroom Delivery Strategy
                </span>
                <p className="font-serif leading-relaxed text-[11px] text-[#292521]">
                  {c06?.teacherAnnotations?.introductionStrategy ||
                    'Have pupils physically draw brackets around the subject head noun and the finite verb on their worksheets, linking them with an arc over any intervening words.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                    3. Blackboard Summary Schema
                  </span>
                  <p className="font-mono text-[10px] text-[#292521] leading-relaxed bg-white/70 p-2 rounded border border-[#CBBEAC]/50">
                    {c06?.teacherAnnotations?.blackboardSummarySchema ||
                      '[HEAD NOUN] ... (prepositional phrase) ... [VERB]\nSingular Head ⟶ Verb with -s/-es\nPlural Head ⟶ Verb without -s'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#71685E] block">
                    4. Diagnostic Quick-Check
                  </span>
                  <p className="font-serif text-[11px] text-[#292521] leading-relaxed">
                    {c06?.teacherAnnotations?.diagnosticCheckSuggestion ||
                      'Write 3 test sentences on the board with inverted subjects or intervening phrases. Call on student pairs to identify the head noun before selecting the verb.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
