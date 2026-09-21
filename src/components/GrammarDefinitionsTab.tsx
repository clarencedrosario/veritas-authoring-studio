import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Lightbulb,
  Sparkles,
  HelpCircle,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { GrammarTopic, GrammarDefinition, DevelopmentalTier } from '../types';
import { TIER_METADATA } from '../utils/differentiatedTiering';
import { TextbookMarkdown } from './common/TextbookMarkdown';

interface GrammarDefinitionsTabProps {
  topic: GrammarTopic;
  onUpdateTopic: (updated: GrammarTopic) => void;
  isDarkMode: boolean;
  onOpenAiGenerator: () => void;
}

export const GrammarDefinitionsTab: React.FC<GrammarDefinitionsTabProps> = ({
  topic,
  onUpdateTopic,
  isDarkMode,
  onOpenAiGenerator,
}) => {
  const [editingDefId, setEditingDefId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filterTier, setFilterTier] = useState<string>('all');

  // New definition form state with Developmental Tier
  const [term, setTerm] = useState('');
  const [defTier, setDefTier] = useState<DevelopmentalTier>('standard');
  const [category, setCategory] = useState('Core Rule');
  const [explanation, setExplanation] = useState('');
  const [formula, setFormula] = useState('');
  const [remedialExplanation, setRemedialExplanation] = useState('');
  const [rulesText, setRulesText] = useState('');
  const [examplesText, setExamplesText] = useState('');
  const [mistakesText, setMistakesText] = useState('');

  const handleSaveNewDefinition = () => {
    if (!term.trim() || !explanation.trim()) {
      alert('Please provide at least a term title and explanation.');
      return;
    }

    const newDef: GrammarDefinition = {
      id: `def-${Date.now()}`,
      term: term.trim(),
      tier: defTier,
      partOfSpeechOrCategory: category.trim(),
      ageAppropriateExplanation: explanation.trim(),
      formulaOrSyntax: formula.trim() || undefined,
      remedialExplanation: remedialExplanation.trim() || undefined,
      rules: rulesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      examples: examplesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((s) => ({ sentence: s })),
      commonMistakes: mistakesText
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const parts = line.split('|');
          return {
            incorrect: parts[0]?.trim() || line,
            correct: parts[1]?.trim() || '',
            reason: parts[2]?.trim() || 'Violates rule',
          };
        }),
    };

    const updatedDefs = [...topic.definitions, newDef];
    onUpdateTopic({ ...topic, definitions: updatedDefs });

    // Reset form
    setIsAddingNew(false);
    setTerm('');
    setExplanation('');
    setFormula('');
    setRemedialExplanation('');
    setRulesText('');
    setExamplesText('');
    setMistakesText('');
  };

  const handleUpdateDefTier = (defId: string, newTier: DevelopmentalTier) => {
    const updatedDefs = topic.definitions.map((d) =>
      d.id === defId ? { ...d, tier: newTier } : d
    );
    onUpdateTopic({ ...topic, definitions: updatedDefs });
  };

  const handleDeleteDefinition = (defId: string) => {
    if (confirm('Delete this definition entry?')) {
      const updatedDefs = topic.definitions.filter((d) => d.id !== defId);
      onUpdateTopic({ ...topic, definitions: updatedDefs });
    }
  };

  const filteredDefinitions = topic.definitions.filter((d) => {
    if (filterTier === 'all') return true;
    const itemTier = d.tier || 'standard';
    return itemTier === filterTier;
  });

  return (
    <div id="grammar-definitions-tab" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Banner with Actions */}
      <div className="space-y-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Textbook Theory, Formulas &amp; 3-Tier Explanations</span>
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                Scaffolded
              </span>
            </div>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Calibrated for {topic.classLevel} students • Tagged across Foundation (Remedial), Standard (Grade-Level), and Advanced (Olympiad).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAiGenerator}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Draft Lesson</span>
            </button>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-stone-800 dark:text-slate-200 flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Cancel' : 'Add Rule / Definition'}</span>
            </button>
          </div>
        </div>

        {/* Tier filter pill buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-500/20 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mr-1 flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>Explanation Tiers:</span>
          </span>

          <button
            onClick={() => setFilterTier('all')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              filterTier === 'all'
                ? 'bg-amber-800 text-white dark:bg-amber-200 dark:text-amber-950 shadow-xs'
                : 'bg-white/70 dark:bg-slate-800/70 text-stone-700 dark:text-slate-300 hover:bg-white'
            }`}
          >
            All Explanations ({topic.definitions.length})
          </button>

          <button
            onClick={() => setFilterTier('foundation')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              filterTier === 'foundation'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Foundation (Remedial) (
            {topic.definitions.filter((d) => (d.tier || 'standard') === 'foundation').length}
            )
          </button>

          <button
            onClick={() => setFilterTier('standard')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              filterTier === 'standard'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            Standard (Grade-Level) (
            {topic.definitions.filter((d) => (d.tier || 'standard') === 'standard').length}
            )
          </button>

          <button
            onClick={() => setFilterTier('advanced')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              filterTier === 'advanced'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-purple-50/80 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
            }`}
          >
            Advanced / Olympiad (
            {topic.definitions.filter((d) => (d.tier || 'standard') === 'advanced').length}
            )
          </button>
        </div>
      </div>

      {/* Add New Definition Card */}
      {isAddingNew && (
        <div className="p-5 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-500/50 bg-white dark:bg-slate-800/90 shadow-md space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Create New Grammar Rule / Definition ({topic.classLevel})
          </h4>

          {/* Developmental Tier Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400">
              Explanation Developmental Tier (3-Tier Scaffolding) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(['foundation', 'standard', 'advanced'] as DevelopmentalTier[]).map((tierKey) => {
                const meta = TIER_METADATA[tierKey];
                const isSelected = defTier === tierKey;
                return (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() => setDefTier(tierKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${meta.badgeBorder} ${meta.badgeBg} ring-2 ring-amber-500/50 font-semibold shadow-xs`
                        : 'border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? meta.badgeText : 'text-stone-800 dark:text-slate-200'
                        }`}
                      >
                        {meta.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {meta.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Term / Rule Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Present Perfect Continuous Tense"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Verb Tense / Concord / Voice"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Age-Appropriate Explanation *
            </label>
            <textarea
              rows={2}
              placeholder={`Explanation written at ${topic.classLevel} reading level...`}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Remedial Visual Scaffolding / Olympiad Nuance Note (Optional)</span>
            </label>
            <input
              type="text"
              placeholder={
                defTier === 'foundation'
                  ? 'e.g. Visual step cue: [Subject] + [has/have] + [been] + [Verb-ing]'
                  : defTier === 'advanced'
                  ? 'e.g. Linguistic exception: Archaic subjunctive forms & inversion patterns'
                  : 'e.g. Supplementary scaffolding guidance'
              }
              value={remedialExplanation}
              onChange={(e) => setRemedialExplanation(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Syntax Formula / Structural Pattern (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Subject + has/have + been + V(-ing) + since/for"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 font-mono text-stone-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Numbered Rules (One per line)
              </label>
              <textarea
                rows={3}
                placeholder="Rule 1: Use 'since' for a point in time.&#10;Rule 2: Use 'for' for a duration."
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Illustrative Examples (One sentence per line)
              </label>
              <textarea
                rows={3}
                placeholder="She has been playing the violin since morning.&#10;They have been living in this city for five years."
                value={examplesText}
                onChange={(e) => setExamplesText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Common Student Pitfalls (Format: Incorrect | Correct | Reason)
            </label>
            <input
              type="text"
              placeholder="I am waiting since 2 hours | I have been waiting for two hours | Use present perfect continuous with duration"
              value={mistakesText}
              onChange={(e) => setMistakesText(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-3 py-1 rounded-lg text-xs border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNewDefinition}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-xs"
            >
              Save Definition to Book
            </button>
          </div>
        </div>
      )}

      {/* Definitions List */}
      <div className="space-y-6">
        {topic.definitions.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-stone-200 dark:border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
            <p className="text-xs font-semibold text-stone-600 dark:text-slate-400">
              No definitions or rules written for this topic yet.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
              Add definitions manually or click "AI Draft Lesson" to automatically generate rules, formulas, and examples for {topic.classLevel}.
            </p>
          </div>
        ) : filteredDefinitions.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-stone-200 dark:border-slate-800 rounded-2xl">
            <p className="text-xs font-semibold text-stone-600 dark:text-slate-400">
              No definitions found in the "{filterTier}" tier.
            </p>
            <button
              onClick={() => setFilterTier('all')}
              className="mt-2 text-xs text-amber-600 dark:text-amber-400 underline font-medium"
            >
              Reset filter to show all
            </button>
          </div>
        ) : (
          filteredDefinitions.map((def, idx) => {
            const itemTier = def.tier || 'standard';
            const tierMeta = TIER_METADATA[itemTier];
            return (
              <div
                key={def.id}
                className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs space-y-4 hover:border-amber-500/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        {def.partOfSpeechOrCategory || 'Grammar Rule'}
                      </span>

                      {/* Developmental Tier Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierMeta.badgeBg} ${tierMeta.badgeText} ${tierMeta.badgeBorder}`}
                        title={tierMeta.description}
                      >
                        {tierMeta.label}
                      </span>

                      {/* Fast Tier Switcher */}
                      <select
                        value={itemTier}
                        onChange={(e) => handleUpdateDefTier(def.id, e.target.value as DevelopmentalTier)}
                        aria-label="Change explanation developmental tier"
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 text-stone-700 dark:text-slate-300 cursor-pointer hover:border-amber-400"
                        title="Reassign explanation to Foundation, Standard, or Advanced"
                      >
                        <option value="foundation">Tier 1: Foundation (Remedial)</option>
                        <option value="standard">Tier 2: Standard (Grade-Level)</option>
                        <option value="advanced">Tier 3: Advanced / Olympiad</option>
                      </select>

                      <span className="text-[11px] text-stone-400 font-mono">
                        Rule #{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 dark:text-slate-100 mt-1">
                      {def.term}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleDeleteDefinition(def.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete definition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Remedial Visual Scaffolding Callout if available */}
                {def.remedialExplanation && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start space-x-2 text-emerald-900 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        Remedial Visual Scaffolding Step
                      </span>
                      <p>{def.remedialExplanation}</p>
                    </div>
                  </div>
                )}

                {/* Age Appropriate Explanation */}
                <p className="text-xs md:text-sm font-serif leading-relaxed text-stone-800 dark:text-slate-200 bg-stone-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-stone-200/60 dark:border-slate-700/60">
                  {def.ageAppropriateExplanation}
                </p>

              {/* Formula Card if available */}
              {def.formulaOrSyntax && (
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex items-center space-x-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-500/20 px-1.5 py-0.5 rounded">
                    Syntax Formula
                  </span>
                  <code className="font-mono text-xs text-teal-900 dark:text-teal-200">
                    {def.formulaOrSyntax}
                  </code>
                </div>
              )}

              {/* Numbered Rules */}
              {def.rules && def.rules.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                    Key Rules to Remember:
                  </span>
                  <ul className="space-y-1 pl-1">
                    {def.rules.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2 text-stone-700 dark:text-slate-300">
                        <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Illustrative Examples */}
              {def.examples && def.examples.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Illustrative Textbook Examples:</span>
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {def.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-2.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-stone-50/70 dark:bg-slate-900/40 text-stone-800 dark:text-slate-200"
                      >
                        <div className="font-serif italic">"{ex.sentence}"</div>
                        {ex.note && (
                          <div className="text-[10px] text-amber-700 dark:text-amber-400 font-sans mt-0.5">
                            ↳ {ex.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Student Mistakes Table */}
              {def.commonMistakes && def.commonMistakes.length > 0 && (
                <div className="space-y-2 text-xs pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Common Mistakes to Avoid:</span>
                  </span>

                  <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-slate-700">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-stone-100 dark:bg-slate-900 text-stone-600 dark:text-slate-400">
                        <tr>
                          <th className="p-2 border-r border-stone-200 dark:border-slate-800 font-semibold text-rose-600">
                            ❌ Incorrect (Common Pitfall)
                          </th>
                          <th className="p-2 border-r border-stone-200 dark:border-slate-800 font-semibold text-emerald-600">
                            ✔️ Correct Form
                          </th>
                          <th className="p-2 font-semibold text-stone-600 dark:text-slate-400">
                            Why? (Pedagogical Reason)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-slate-800">
                        {def.commonMistakes.map((m, mIdx) => (
                          <tr key={mIdx} className="hover:bg-stone-50/50 dark:hover:bg-slate-900/30">
                            <td className="p-2 border-r border-stone-200 dark:border-slate-800 text-rose-700 dark:text-rose-400 font-serif">
                              {m.incorrect}
                            </td>
                            <td className="p-2 border-r border-stone-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-serif font-medium">
                              {m.correct}
                            </td>
                            <td className="p-2 text-stone-600 dark:text-slate-400">
                              {m.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>

      {/* Chapter Overview & Theory Markdown Notes */}
      {topic.notesAndTheoryMarkdown && (
        <div className="p-6 rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 shadow-xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Comprehensive Classroom Theory Notes
          </h4>
          <div className="bg-stone-50 dark:bg-slate-900/40 p-4 rounded-xl border border-stone-200 dark:border-slate-700">
            <TextbookMarkdown
              content={topic.notesAndTheoryMarkdown}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};
