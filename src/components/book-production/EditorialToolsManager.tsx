import React, { useState } from 'react';
import {
  ClassCurriculumBook,
  CrossChapterReference,
  TerminologyEntry,
  BookStyleGuide,
  FrontMatterItem,
  BackMatterItem,
  GrammarSeriesProject,
} from '../../types';
import {
  Link2,
  BookA,
  Palette,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Check,
  Save,
  BookOpen,
} from 'lucide-react';

interface EditorialToolsManagerProps {
  currentBook: ClassCurriculumBook;
  seriesProject?: GrammarSeriesProject;
  onUpdateBook: (updated: ClassCurriculumBook) => void;
  onOpenChapterStudio?: (topicId: string) => void;
  isDarkMode: boolean;
}

export const EditorialToolsManager: React.FC<EditorialToolsManagerProps> = ({
  currentBook,
  seriesProject,
  onUpdateBook,
  onOpenChapterStudio,
}) => {
  const [activeTab, setActiveTab] = useState<
    'cross_refs' | 'terminology' | 'style_guide' | 'front_back_matter'
  >('cross_refs');

  const crossRefs = currentBook.crossReferences || [];
  const terms = currentBook.terminologyDictionary || [];
  const styleGuide: BookStyleGuide = currentBook.styleGuide || {
    id: 'sg-default',
    variety: 'British English',
    quotationStyle: 'Single quotes with punctuation outside',
    hyphenation: 'Standard Oxford',
    capitalisation: 'Title Case for Headings',
    headingConventions: 'Italics for cited linguistic forms; single quotes for semantic glosses.',
    exerciseNaming: 'Lettered progression (Exercise A, Exercise B...)',
    numberFormatting: 'Words for one to ten, numerals for 11+',
    grammarTerminology: 'Traditional Prescriptive with Descriptive Modern Notes',
    punctuationConventions: 'Oxford comma and single quotes',
    spellingStandard: 'British / Oxford',
    preferredGrammarFramework: 'Traditional Prescriptive with Descriptive Modern Notes',
    capitalizationRules: 'Capitalize grammatical terms only when part of formal titles.',
    formattingRules: 'Italics for cited linguistic forms; single quotes for semantic glosses.',
    quotationMarkStandard: 'Single quotation marks with punctuation outside unless part of original quote.',
    hyphenationStandard: 'Hyphenate compound modifiers before nouns (e.g. subject-verb agreement).',
    numberStyle: 'Spell out numbers under 100 in running text; use numerals in drill prompts.',
    sampleSentenceStyle: 'Authentic literary or formal register; avoid colloquial internet slang.',
    approvedTerminology: {},
    prohibitedTerminology: {},
  };
  const frontMatter = currentBook.frontMatter || [];
  const backMatter = currentBook.backMatter || [];

  // Form states for adding items
  const [newTermForm, setNewTermForm] = useState({
    term: '',
    preferredForm: '',
    forbiddenVariants: '',
    definition: '',
    domain: 'Syntax',
  });
  const [showAddTerm, setShowAddTerm] = useState(false);

  const [newRefForm, setNewRefForm] = useState({
    sourceChapterId: currentBook.topics?.[0]?.id || '',
    targetChapterId: currentBook.topics?.[1]?.id || '',
    referenceType: 'prerequisite' as const,
    anchorText: 'See Chapter 1 for foundational subject-predicate rules.',
  });
  const [showAddRef, setShowAddRef] = useState(false);

  // Style guide edit state
  const [localStyleGuide, setLocalStyleGuide] = useState<BookStyleGuide>(styleGuide);
  const [isStyleGuideSaved, setIsStyleGuideSaved] = useState(false);

  // Terminology operations
  const handleAddTerm = () => {
    if (!newTermForm.term.trim()) return;
    const entry: TerminologyEntry = {
      id: `term-${Date.now()}`,
      term: newTermForm.term.trim(),
      preferredTerm: newTermForm.preferredForm.trim() || newTermForm.term.trim(),
      preferredForm: newTermForm.preferredForm.trim() || newTermForm.term.trim(),
      forbiddenVariants: newTermForm.forbiddenVariants
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      definition: newTermForm.definition.trim(),
      domain: newTermForm.domain,
    };
    onUpdateBook({
      ...currentBook,
      terminologyDictionary: [...terms, entry],
    });
    setNewTermForm({
      term: '',
      preferredForm: '',
      forbiddenVariants: '',
      definition: '',
      domain: 'Syntax',
    });
    setShowAddTerm(false);
  };

  const handleDeleteTerm = (id: string) => {
    onUpdateBook({
      ...currentBook,
      terminologyDictionary: terms.filter((t) => t.id !== id),
    });
  };

  // Cross Reference operations
  const handleAddRef = () => {
    if (!newRefForm.anchorText.trim()) return;
    const entry: CrossChapterReference = {
      id: `ref-${Date.now()}`,
      sourceChapterId: newRefForm.sourceChapterId,
      targetChapterId: newRefForm.targetChapterId,
      referenceType: newRefForm.referenceType,
      targetType: 'chapter',
      displayLabel: newRefForm.anchorText.trim(),
      anchorText: newRefForm.anchorText.trim(),
    };
    onUpdateBook({
      ...currentBook,
      crossReferences: [...crossRefs, entry],
    });
    setNewRefForm({
      sourceChapterId: currentBook.topics?.[0]?.id || '',
      targetChapterId: currentBook.topics?.[1]?.id || '',
      referenceType: 'prerequisite',
      anchorText: '',
    });
    setShowAddRef(false);
  };

  const handleDeleteRef = (id: string) => {
    onUpdateBook({
      ...currentBook,
      crossReferences: crossRefs.filter((r) => r.id !== id),
    });
  };

  // Front/Back Matter toggle
  const handleToggleFrontMatter = (id: string) => {
    onUpdateBook({
      ...currentBook,
      frontMatter: frontMatter.map((fm) =>
        fm.id === id ? { ...fm, isEnabled: !fm.isEnabled } : fm
      ),
    });
  };

  const handleToggleBackMatter = (id: string) => {
    onUpdateBook({
      ...currentBook,
      backMatter: backMatter.map((bm) =>
        bm.id === id ? { ...bm, isEnabled: !bm.isEnabled } : bm
      ),
    });
  };

  // Save Style Guide
  const handleSaveStyleGuide = () => {
    onUpdateBook({
      ...currentBook,
      styleGuide: localStyleGuide,
    });
    setIsStyleGuideSaved(true);
    setTimeout(() => setIsStyleGuideSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC] dark:border-[#5A1832] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] font-semibold">
            Academic Editorial Control
          </div>
          <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Editorial Standards &amp; Lexicon
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#D8CCBC] mt-0.5">
            Maintain rigorous terminological consistency, cross-references, and publishing house style.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 rounded-xl bg-white/70 dark:bg-[#251D1E] border border-[#CBBEAC] dark:border-[#5A1832] text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('cross_refs')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'cross_refs'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Cross-References ({crossRefs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('terminology')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'terminology'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <BookA className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Terminology Lexicon ({terms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('style_guide')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'style_guide'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Style Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('front_back_matter')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              activeTab === 'front_back_matter'
                ? 'bg-[#5A1832] text-[#F6F0E7] font-semibold shadow-xs'
                : 'text-[#71685E] dark:text-[#D8CCBC]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>Front &amp; Back Matter</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Cross Chapter References */}
      {activeTab === 'cross_refs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Tracks explicit inter-chapter connections so students and teachers are guided through prerequisite and forward-looking concepts.
            </p>
            <button
              onClick={() => setShowAddRef(!showAddRef)}
              className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Add Reference</span>
            </button>
          </div>

          {/* Add Reference Form */}
          {showAddRef && (
            <div className="p-4 rounded-xl bg-[#EDE4D6]/70 dark:bg-[#35101F]/60 border border-[#CBBEAC] dark:border-[#5A1832] space-y-3 text-xs">
              <div className="font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Record New Cross-Chapter Citation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Source Chapter</label>
                  <select
                    value={newRefForm.sourceChapterId}
                    onChange={(e) => setNewRefForm({ ...newRefForm, sourceChapterId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  >
                    {currentBook.topics?.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Target Chapter</label>
                  <select
                    value={newRefForm.targetChapterId}
                    onChange={(e) => setNewRefForm({ ...newRefForm, targetChapterId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  >
                    {currentBook.topics?.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Reference Type</label>
                  <select
                    value={newRefForm.referenceType}
                    onChange={(e) => setNewRefForm({ ...newRefForm, referenceType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  >
                    <option value="prerequisite">Prerequisite</option>
                    <option value="forward_reference">Forward Reference</option>
                    <option value="revision">Revision</option>
                    <option value="contrast">Contrastive Analysis</option>
                    <option value="extension">Extension</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Anchor Citation Text</label>
                <input
                  type="text"
                  placeholder="e.g. For comprehensive rules on finite verbs, see Chapter 1 (Concord)."
                  value={newRefForm.anchorText}
                  onChange={(e) => setNewRefForm({ ...newRefForm, anchorText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddRef(false)}
                  className="px-3 py-1 rounded-lg border border-[#CBBEAC] text-xs text-[#71685E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRef}
                  className="px-4 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                >
                  Save Citation
                </button>
              </div>
            </div>
          )}

          {/* Cross References List */}
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] text-[10px] font-mono uppercase text-[#71685E]">
                  <tr>
                    <th className="py-3 px-4">Source Chapter</th>
                    <th className="py-3 px-4">Target Chapter</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Anchor Citation Text</th>
                    <th className="py-3 px-4">Integrity Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50">
                  {crossRefs.map((ref) => {
                    const srcTopic = currentBook.topics?.find((t) => t.id === ref.sourceChapterId);
                    const tgtTopic = currentBook.topics?.find((t) => t.id === ref.targetChapterId);
                    return (
                      <tr key={ref.id} className="hover:bg-[#FDFBF7]/70">
                        <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                          {srcTopic?.title || 'Chapter 1 (Concord)'}
                        </td>
                        <td className="py-3.5 px-4 font-serif text-[#292521] dark:text-[#F6F0E7]">
                          {tgtTopic?.title || 'Chapter 2 (Tenses)'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10.5px] uppercase text-[#9A7438]">
                          {ref.referenceType}
                        </td>
                        <td className="py-3.5 px-4 text-[#71685E] italic">
                          &ldquo;{ref.anchorText}&rdquo;
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-mono text-[10.5px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteRef(ref.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Terminology Lexicon */}
      {activeTab === 'terminology' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Enforces authoritative canonical terminology across all chapters (e.g. &ldquo;Subject-Verb Agreement&rdquo; vs non-standard alternatives).
            </p>
            <button
              onClick={() => setShowAddTerm(!showAddTerm)}
              className="px-3 py-1.5 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Add Term</span>
            </button>
          </div>

          {/* Add Term Form */}
          {showAddTerm && (
            <div className="p-4 rounded-xl bg-[#EDE4D6]/70 dark:bg-[#35101F]/60 border border-[#CBBEAC] dark:border-[#5A1832] space-y-3 text-xs">
              <div className="font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                Add Prescribed Lexical Term
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Standard Term</label>
                  <input
                    type="text"
                    placeholder="e.g. Subject-Verb Agreement"
                    value={newTermForm.term}
                    onChange={(e) => setNewTermForm({ ...newTermForm, term: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Preferred Form</label>
                  <input
                    type="text"
                    placeholder="e.g. Subject-Verb Agreement (Concord)"
                    value={newTermForm.preferredForm}
                    onChange={(e) => setNewTermForm({ ...newTermForm, preferredForm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Forbidden Variants (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. S-V Matching, Verb Concordance"
                    value={newTermForm.forbiddenVariants}
                    onChange={(e) => setNewTermForm({ ...newTermForm, forbiddenVariants: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1">Prescriptive Academic Definition</label>
                <textarea
                  rows={2}
                  placeholder="Authoritative linguistic definition used consistently across the series."
                  value={newTermForm.definition}
                  onChange={(e) => setNewTermForm({ ...newTermForm, definition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-white dark:bg-[#251D1E]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddTerm(false)}
                  className="px-3 py-1 rounded-lg border border-[#CBBEAC] text-xs text-[#71685E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTerm}
                  className="px-4 py-1 rounded-lg bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold"
                >
                  Save Term
                </button>
              </div>
            </div>
          )}

          {/* Terms Table */}
          <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#5A1832] bg-white dark:bg-[#1E1919] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDFBF7] dark:bg-[#251D1E] border-b border-[#CBBEAC] text-[10px] font-mono uppercase text-[#71685E]">
                  <tr>
                    <th className="py-3 px-4">Standard Term</th>
                    <th className="py-3 px-4">Preferred Form</th>
                    <th className="py-3 px-4">Forbidden Variants</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Canonical Definition</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/50">
                  {terms.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FDFBF7]/70">
                      <td className="py-3.5 px-4 font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                        {t.term}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-emerald-800 dark:text-emerald-400">
                        {t.preferredForm}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[10.5px] text-rose-700 line-through">
                        {t.forbiddenVariants.join(', ') || 'None registered'}
                      </td>
                      <td className="py-3.5 px-4 text-[#71685E]">
                        {t.domain}
                      </td>
                      <td className="py-3.5 px-4 text-[#71685E] max-w-xs truncate italic">
                        {t.definition}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTerm(t.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Style Guide */}
      {activeTab === 'style_guide' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 pb-3">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                Veritas Publishing House Style Guide
              </h3>
              <p className="text-xs text-[#71685E]">
                Defines typographic standards, spelling protocols, and grammatical frameworks for this edition.
              </p>
            </div>
            <button
              onClick={handleSaveStyleGuide}
              className="px-4 py-2 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              {isStyleGuideSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-[#C29A52]" />}
              <span>{isStyleGuideSaved ? 'Saved' : 'Save Style Guide'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Spelling Standard
              </label>
              <input
                type="text"
                value={localStyleGuide.spellingStandard || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, spellingStandard: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Preferred Grammar Framework
              </label>
              <input
                type="text"
                value={localStyleGuide.preferredGrammarFramework || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, preferredGrammarFramework: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Quotation Mark Standard
              </label>
              <input
                type="text"
                value={localStyleGuide.quotationMarkStandard || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, quotationMarkStandard: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Hyphenation Standard
              </label>
              <input
                type="text"
                value={localStyleGuide.hyphenationStandard || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, hyphenationStandard: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Number &amp; Numeral Style
              </label>
              <input
                type="text"
                value={localStyleGuide.numberStyle || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, numberStyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#71685E] uppercase mb-1 font-semibold">
                Sample Sentence Register
              </label>
              <input
                type="text"
                value={localStyleGuide.sampleSentenceStyle || ''}
                onChange={(e) => setLocalStyleGuide({ ...localStyleGuide, sampleSentenceStyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FDFBF7] dark:bg-[#251D1E]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Front & Back Matter */}
      {activeTab === 'front_back_matter' && (
        <div className="space-y-6">
          {/* Front Matter Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
              Front Matter Modules
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Toggle preliminary sections included in final typeset output before Unit 1.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {frontMatter.map((fm) => (
                <div
                  key={fm.id}
                  onClick={() => handleToggleFrontMatter(fm.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    fm.isEnabled
                      ? 'border-[#5A1832] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 text-[#292521] dark:text-[#F6F0E7]'
                      : 'border-[#CBBEAC]/60 bg-zinc-50 dark:bg-zinc-900 opacity-60 text-[#71685E]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-serif font-bold text-xs">{fm.title}</div>
                    <div className="text-[10px] font-mono uppercase text-[#9A7438]">
                      {fm.type.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      fm.isEnabled ? 'bg-[#5A1832] text-white border-[#5A1832]' : 'border-zinc-400'
                    }`}
                  >
                    {fm.isEnabled && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Matter Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1919] border border-[#CBBEAC] dark:border-[#5A1832] space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
              Back Matter Modules
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#D8CCBC]">
              Appendices, reference tables, answer keys, and indices following the final unit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {backMatter.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => handleToggleBackMatter(bm.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    bm.isEnabled
                      ? 'border-[#5A1832] bg-[#EDE4D6]/50 dark:bg-[#35101F]/50 text-[#292521] dark:text-[#F6F0E7]'
                      : 'border-[#CBBEAC]/60 bg-zinc-50 dark:bg-zinc-900 opacity-60 text-[#71685E]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-serif font-bold text-xs">{bm.title}</div>
                    <div className="text-[10px] font-mono uppercase text-[#9A7438]">
                      {bm.type.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      bm.isEnabled ? 'bg-[#5A1832] text-white border-[#5A1832]' : 'border-zinc-400'
                    }`}
                  >
                    {bm.isEnabled && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
