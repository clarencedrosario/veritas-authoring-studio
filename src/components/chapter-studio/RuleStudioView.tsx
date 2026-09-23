import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Split,
  Copy,
} from 'lucide-react';
import { StudioChapter, GrammarRuleRecord } from '../../types';
import { CANONICAL_SVA_RULES } from '../../utils/chapterStudioData';

export interface RuleStudioViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  onNavigateToStage?: (stageId: string) => void;
  isDarkMode: boolean;
}

export const RuleStudioView: React.FC<RuleStudioViewProps> = ({
  chapter,
  onUpdateChapter,
  onNavigateToStage,
  isDarkMode,
}) => {
  const isSvaChapter =
    chapter.id === 'chapter-6-sva' ||
    chapter.title?.toLowerCase().includes('subject–verb agreement') ||
    chapter.title?.toLowerCase().includes('subject-verb agreement') ||
    chapter.curriculumTopic?.toLowerCase().includes('subject–verb agreement') ||
    chapter.curriculumTopic?.toLowerCase().includes('subject-verb agreement');

  const rules =
    chapter.rules && chapter.rules.length > 0
      ? chapter.rules
      : isSvaChapter
      ? CANONICAL_SVA_RULES
      : [];
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Foundation' | 'Standard' | 'Challenge'>('All');

  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  // Temporary state for editing
  const [editForm, setEditForm] = useState<GrammarRuleRecord>(selectedRule || ({} as GrammarRuleRecord));

  const handleSelectRule = (rule: GrammarRuleRecord) => {
    setSelectedRuleId(rule.id);
    setEditForm(rule);
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (selectedRule) {
      setEditForm({ ...selectedRule });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedRules = rules.map((r) => (r.id === editForm.id ? editForm : r));
    onUpdateChapter({
      ...chapter,
      rules: updatedRules,
      lastSaved: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleAddNewRule = () => {
    const newId = `rule-sva-${Date.now()}`;
    const newRule: GrammarRuleRecord = {
      id: newId,
      ruleName: `${rules.length + 1}. New Concord Rule`,
      ruleStatement: 'State the formal grammatical rule clearly and authoritatively.',
      explanation: 'Provide the underlying linguistic explanation for this concord structure.',
      patternOrFormula: 'Subject + Verb Concord Pattern',
      correctExamples: ['The head noun governs the verb.'],
      incorrectExamples: ['The modifying noun improperly governs the verb.'],
      exceptions: ['List any contextual or historical exceptions.'],
      commonMisconceptions: ['Common student pitfall or surface proximity error.'],
      difficulty: 'Standard',
      curriculumMapping: `${chapter.systemId || 'CISCE'} ${chapter.equivalentClass || 'Class 6'} Grammar Strand`,
      authorNote: 'Pedagogical note on classroom presentation.',
    };

    const updatedRules = [...rules, newRule];
    onUpdateChapter({
      ...chapter,
      rules: updatedRules,
      lastSaved: new Date().toISOString(),
    });
    setSelectedRuleId(newId);
    setEditForm(newRule);
    setIsEditing(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (rules.length <= 1) return;
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    onUpdateChapter({
      ...chapter,
      rules: updatedRules,
      lastSaved: new Date().toISOString(),
    });
    const nextSelected = updatedRules[0];
    setSelectedRuleId(nextSelected.id);
    setEditForm(nextSelected);
    setIsEditing(false);
  };

  const filteredRules = rules.filter((r) => {
    if (filterDifficulty === 'All') return true;
    return r.difficulty === filterDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
              <Award className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                  Production Stage 5 • Structured Concepts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC] font-bold">
                  {rules.length} Canon Rules
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#292521]">
                Rule &amp; Concept Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Manage high-precision grammatical rules, syntax formulas, pedagogical contrast pairs, and curriculum cross-references.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#EDE4D6] rounded-xl p-1 text-xs border border-[#CBBEAC]">
              {(['All', 'Foundation', 'Standard', 'Challenge'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterDifficulty(tier)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    filterDifficulty === tier
                      ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                      : 'text-[#71685E] hover:text-[#292521]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddNewRule}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>+ Add Rule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rule Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#71685E] px-1 flex items-center justify-between">
            <span>Chapter Rules &amp; Concepts</span>
            <span>{filteredRules.length} items</span>
          </div>

          <div className="space-y-2">
            {filteredRules.map((rule) => {
              const isSelected = rule.id === selectedRuleId;
              const difficultyColor =
                rule.difficulty === 'Foundation'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : rule.difficulty === 'Standard'
                  ? 'bg-[#EDE4D6] text-[#5A1832] border-[#CBBEAC] font-bold'
                  : 'bg-amber-50 text-amber-900 border-amber-300 font-bold';

              return (
                <button
                  key={rule.id}
                  onClick={() => handleSelectRule(rule)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFFDF8] border-[#5A1832] shadow-sm ring-1 ring-[#5A1832]'
                      : 'bg-[#FFFDF8] border-[#CBBEAC] hover:border-[#5A1832]/60 hover:bg-[#F6F0E7]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-serif font-bold text-[#292521] leading-snug">
                      {rule.ruleName}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${difficultyColor}`}>
                      {rule.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-[#71685E] mt-1 line-clamp-2">
                    {rule.ruleStatement}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#CBBEAC]/50 flex items-center justify-between text-[11px] text-[#71685E]">
                    <span>{rule.correctExamples.length} Correct • {rule.incorrectExamples.length} Traps</span>
                    <span className="text-[#5A1832] font-bold flex items-center gap-0.5">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Rule Detail / Editor */}
        <div className="lg:col-span-8">
          {selectedRule ? (
            <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-2xl p-6 shadow-xs space-y-6">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#CBBEAC]/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A1832]">
                      {selectedRule.curriculumMapping || 'CISCE Class 6 Syntax Strand'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC] font-bold">
                      {selectedRule.difficulty} Tier
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.ruleName}
                      onChange={(e) => setEditForm({ ...editForm, ruleName: e.target.value })}
                      className="text-xl font-serif font-bold text-[#292521] bg-[#F6F0E7] border border-[#CBBEAC] rounded-xl px-3 py-1.5 mt-1 w-full focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                    />
                  ) : (
                    <h3 className="text-xl font-serif font-bold text-[#292521] mt-1">
                      {selectedRule.ruleName}
                    </h3>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EDE4D6] text-[#292521] text-xs font-semibold rounded-xl hover:bg-[#CBBEAC]/50 border border-[#CBBEAC] transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleStartEdit}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#292521] text-xs font-bold rounded-xl border border-[#CBBEAC] transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#5A1832]" />
                        <span>Edit Rule</span>
                      </button>
                      {rules.length > 1 && (
                        <button
                          onClick={() => handleDeleteRule(selectedRule.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Rule Statement Callout Box */}
              <div className="p-4 rounded-xl bg-[#F6F0E7] border-l-4 border-[#5A1832] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                  <Award className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Formal Textbook Statement</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editForm.ruleStatement}
                    onChange={(e) => setEditForm({ ...editForm, ruleStatement: e.target.value })}
                    className="w-full text-sm font-serif text-[#292521] bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                ) : (
                  <p className="text-base font-serif italic text-[#292521]">
                    "{selectedRule.ruleStatement}"
                  </p>
                )}
              </div>

              {/* Pattern / Formula Bar */}
              <div className="p-3.5 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#71685E]">
                  Syntactic Formula / Pattern
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.patternOrFormula || ''}
                    onChange={(e) => setEditForm({ ...editForm, patternOrFormula: e.target.value })}
                    className="w-full text-xs font-mono text-[#5A1832] bg-[#FFFDF8] border border-[#CBBEAC] rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                ) : (
                  <div className="text-xs font-mono font-bold text-[#5A1832] bg-[#FFFDF8] px-3 py-1.5 rounded-lg border border-[#CBBEAC]">
                    {selectedRule.patternOrFormula || 'Subject + Verb Concord Pattern'}
                  </div>
                )}
              </div>

              {/* Theoretical Explanation */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#292521] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#5A1832]" />
                  <span>Grammatical &amp; Pedagogical Explanation</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editForm.explanation}
                    onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                    className="w-full text-sm text-[#292521] bg-[#F6F0E7] border border-[#CBBEAC] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
                  />
                ) : (
                  <p className="text-sm text-[#292521] leading-relaxed font-serif">
                    {selectedRule.explanation}
                  </p>
                )}
              </div>

              {/* Contrast Pairs: Correct vs Incorrect */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Correct Examples */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Approved Textbook Models ({selectedRule.correctExamples.length})</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedRule.correctExamples.map((ex, i) => (
                      <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                        <span className="font-serif font-bold text-emerald-700">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Incorrect Traps */}
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Common Exam Traps ({selectedRule.incorrectExamples.length})</span>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedRule.incorrectExamples.map((ex, i) => (
                      <li key={i} className="text-xs text-rose-950 flex items-start gap-1.5">
                        <span className="font-serif font-bold text-rose-700">✕</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exceptions & Common Misconceptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Syntactic Exceptions</span>
                  </div>
                  <p className="text-xs text-amber-950">
                    {selectedRule.exceptions && selectedRule.exceptions.length > 0
                      ? selectedRule.exceptions.join(' ')
                      : 'None recorded for this basic rule level.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    <span>Student Misconception</span>
                  </div>
                  <p className="text-xs text-purple-950">
                    {selectedRule.commonMisconceptions && selectedRule.commonMisconceptions.length > 0
                      ? selectedRule.commonMisconceptions.join(' ')
                      : 'Students misplace emphasis on nearest nouns.'}
                  </p>
                </div>
              </div>

              {/* Author & Teacher Guidance Note */}
              {selectedRule.authorNote && (
                <div className="p-3 rounded-xl bg-[#F6F0E7] text-xs text-[#292521] border border-[#CBBEAC]">
                  <span className="font-bold text-[#5A1832]">Author's Pedagogical Note: </span>
                  {selectedRule.authorNote}
                </div>
              )}

              {/* Production Routing Actions */}
              <div className="pt-4 border-t border-[#CBBEAC]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#71685E]">
                  Cross-link this rule into exercises, worked examples, or visuals:
                </div>
                <div className="flex items-center gap-2">
                  {onNavigateToStage && (
                    <>
                      <button
                        onClick={() => onNavigateToStage('examples')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#292521] text-xs font-semibold rounded-xl transition-colors border border-[#CBBEAC] cursor-pointer"
                      >
                        <Split className="w-3 h-3 text-[#5A1832]" />
                        <span>View in Examples Studio</span>
                      </button>
                      <button
                        onClick={() => onNavigateToStage('exercises')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Link to Exercises</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFDF8] border border-dashed border-[#CBBEAC] rounded-2xl p-8 text-center">
              <Award className="w-8 h-8 text-[#CBBEAC] mx-auto mb-2" />
              <p className="text-sm font-serif font-bold text-[#292521]">No rules authored yet</p>
              <p className="text-xs text-[#71685E] mt-1">Click "+ Add Rule" above to author rules for this chapter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
