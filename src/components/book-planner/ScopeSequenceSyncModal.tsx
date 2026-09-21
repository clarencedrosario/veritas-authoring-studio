import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Link,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Plus,
  ArrowRight,
  Eye,
  Layers,
  FileText,
  ShieldCheck,
  Check,
  ChevronDown,
  Info,
  ExternalLink,
} from 'lucide-react';
import { BookProject, ClassCurriculumBook, GrammarTopic, BookUnit, GrammarClassLevel } from '../../types';
import { CBSE_CLASS_6_DEMO_ROWS, ScopeSequenceMasterRow } from '../../utils/scopeSequenceData';

export type SyncRowAction =
  | 'create_chapter'
  | 'link_existing'
  | 'assign_unit'
  | 'merge'
  | 'defer'
  | 'exclude'
  | 'ignore';

export interface ScopeSyncItem {
  id: string;
  seqNumber: number;
  chapterTitle: string;
  conceptTitle: string;
  strand: string;
  curriculumMappingCode: string;
  suggestedUnitId: string;
  suggestedUnitNumber: number;
  suggestedUnitTitle: string;
  learningObjectives: string[];
  estimatedPages: number;
  recommendedLessons: number;
  // Linkage state
  status: 'linked' | 'unlinked' | 'partial';
  linkedTopicId?: string;
  linkedTopicTitle?: string;
  existingChapterStudioRecord?: boolean;
  // Selected action
  action: SyncRowAction;
  targetUnitId: string;
  targetTopicId?: string;
  exclusionReason?: string;
  isSelected: boolean;
}

interface ScopeSequenceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: BookProject;
  currentBook: ClassCurriculumBook;
  onApplySync: (updatedBook: ClassCurriculumBook) => void;
  isDarkMode?: boolean;
}

export const ScopeSequenceSyncModal: React.FC<ScopeSequenceSyncModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  currentBook,
  onApplySync,
  isDarkMode = false,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [filterStrand, setFilterStrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const existingTopics = useMemo(() => currentBook.topics || [], [currentBook.topics]);
  const existingUnits = useMemo(() => currentBook.units || [], [currentBook.units]);

  // Derive candidate scope rows for the active board and class
  const candidateScopeRows: ScopeSequenceMasterRow[] = useMemo(() => {
    // For CBSE Class 6, use the comprehensive authentic dataset
    if (activeProject.board === 'CBSE' || !activeProject.board) {
      return CBSE_CLASS_6_DEMO_ROWS;
    }
    // For CISCE or Cambridge, adapt rows with authentic board-specific alignment
    if (activeProject.board === 'CISCE') {
      return CBSE_CLASS_6_DEMO_ROWS.map((r, idx) => ({
        ...r,
        id: `seq-cisce6-${String(idx + 1).padStart(2, '0')}`,
        curriculumMappingCode: `VTR-CISCE6-${String(idx + 1).padStart(2, '0')}`,
        officialCurriculumRef: 'CISCE English Language Curriculum Guidelines Class 6 (Editorial)',
        evidenceCitation: 'CISCE Middle School English Syllabus, Grade 6 Language Outcomes',
      }));
    }
    // Cambridge
    return CBSE_CLASS_6_DEMO_ROWS.map((r, idx) => ({
      ...r,
      id: `seq-cambridge-s7-${String(idx + 1).padStart(2, '0')}`,
      curriculumMappingCode: `VTR-CAMB-S7-${String(idx + 1).padStart(2, '0')}`,
      officialCurriculumRef: 'Cambridge Lower Secondary English Curriculum Framework Stage 7',
      evidenceCitation: 'Cambridge Lower Secondary English (0861) Stage 7 Grammar & Syntax Matrix',
    }));
  }, [activeProject.board]);

  // Map each candidate row to a sync item with linkage detection
  const initialSyncItems: ScopeSyncItem[] = useMemo(() => {
    return candidateScopeRows.map((row) => {
      // Check if existing chapter in book matches this scope item
      const matchedTopic = existingTopics.find((t) => {
        // ID match
        if (t.id === row.chapterId || t.id === `cbse-6-${row.chapterId}` || (row.chapterId === 'c6-top-sva' && t.id === 'cbse-6-sva')) {
          return true;
        }
        // Title loose match (e.g. "Subject-Verb" or "Concord")
        const normTopic = t.title.toLowerCase();
        const normScope = row.chapterTitle.toLowerCase();
        if (normTopic.includes('subject-verb') && (normScope.includes('subject-verb') || normScope.includes('concord'))) {
          return true;
        }
        if (normTopic.includes('sentence') && normScope.includes('sentence')) {
          return true;
        }
        if (normTopic.includes('noun') && normScope.includes('noun')) {
          return true;
        }
        return false;
      });

      // Determine unit assignment suggestion
      let suggestedUnitNum = 1;
      const titleLower = row.chapterTitle.toLowerCase();
      if (titleLower.includes('sentence') || titleLower.includes('concord') || titleLower.includes('agreement') || titleLower.includes('syntax')) {
        suggestedUnitNum = 1;
      } else if (titleLower.includes('noun') || titleLower.includes('pronoun') || titleLower.includes('determiner') || titleLower.includes('tense')) {
        suggestedUnitNum = 2;
      } else if (titleLower.includes('modal') || titleLower.includes('verb') || titleLower.includes('auxiliary')) {
        suggestedUnitNum = 3;
      } else if (titleLower.includes('voice') || titleLower.includes('passive') || titleLower.includes('clause')) {
        suggestedUnitNum = 4;
      } else if (titleLower.includes('speech') || titleLower.includes('direct') || titleLower.includes('indirect') || titleLower.includes('reported')) {
        suggestedUnitNum = 5;
      } else {
        suggestedUnitNum = 6;
      }

      const targetUnit = existingUnits.find((u) => u.unitNumber === suggestedUnitNum) || existingUnits[0] || {
        id: `unit-auto-${suggestedUnitNum}`,
        unitNumber: suggestedUnitNum,
        title: `Unit ${suggestedUnitNum}`,
      };

      const isLinked = !!matchedTopic;

      return {
        id: row.id,
        seqNumber: row.seqNumber,
        chapterTitle: row.chapterTitle,
        conceptTitle: row.conceptTitle,
        strand: row.strand,
        curriculumMappingCode: row.curriculumMappingCode,
        suggestedUnitId: targetUnit.id,
        suggestedUnitNumber: suggestedUnitNum,
        suggestedUnitTitle: targetUnit.title,
        learningObjectives: row.learningObjectives,
        estimatedPages: row.estimatedPages || 12,
        recommendedLessons: row.recommendedTeachingLessons || 4,
        status: isLinked ? 'linked' : 'unlinked',
        linkedTopicId: matchedTopic?.id,
        linkedTopicTitle: matchedTopic?.title,
        existingChapterStudioRecord: isLinked,
        action: isLinked ? 'link_existing' : 'create_chapter',
        targetUnitId: targetUnit.id,
        targetTopicId: matchedTopic?.id,
        isSelected: !isLinked, // Default select unlinked items for sync
      };
    });
  }, [candidateScopeRows, existingTopics, existingUnits]);

  // Working state of sync items
  const [items, setItems] = useState<ScopeSyncItem[]>(initialSyncItems);

  // Re-sync items when candidate rows change
  React.useEffect(() => {
    setItems(initialSyncItems);
  }, [initialSyncItems]);

  const toggleSelectAll = (select: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.status === 'linked' ? item : { ...item, isSelected: select }))
    );
  };

  const updateItem = (id: string, updates: Partial<ScopeSyncItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  // Summary counts
  const summary = useMemo(() => {
    const linkedCount = items.filter((i) => i.status === 'linked').length;
    const toCreateCount = items.filter((i) => i.isSelected && i.action === 'create_chapter').length;
    const toDeferCount = items.filter((i) => i.isSelected && i.action === 'defer').length;
    const toExcludeCount = items.filter((i) => i.isSelected && i.action === 'exclude').length;
    const totalSelected = items.filter((i) => i.isSelected).length;

    return { linkedCount, toCreateCount, toDeferCount, toExcludeCount, totalSelected };
  }, [items]);

  // Apply Changes Handler
  const handleConfirmSync = () => {
    // Clone existing topics and units safely
    const updatedTopics: GrammarTopic[] = [...existingTopics];
    const unitMap: Record<string, BookUnit> = {};

    // Copy existing units
    existingUnits.forEach((u) => {
      unitMap[u.id] = {
        ...u,
        chapterIds: [...(u.chapterIds || [])],
      };
    });

    // Ensure 6 core units exist if empty
    if (existingUnits.length === 0) {
      const defaultUnitNames = [
        'Unit 1: Foundations of Syntax & Subject-Verb Agreement',
        'Unit 2: Tense Systems, Time Reference & Aspect',
        'Unit 3: Mood, Modality & Auxiliaries',
        'Unit 4: Voice & Sentence Transformation Architecture',
        'Unit 5: Reported Speech & Direct Discourse',
        'Unit 6: Integrated Editing & Board Examination Diagnostic Papers',
      ];
      defaultUnitNames.forEach((title, i) => {
        const uId = `unit-c6-${i + 1}`;
        unitMap[uId] = {
          id: uId,
          unitNumber: i + 1,
          title,
          description: `Core curricular unit for ${activeProject.classLevel} ${activeProject.board}.`,
          order: i + 1,
          chapterIds: [],
        };
      });
    }

    // Process selected sync items
    items.forEach((item) => {
      if (!item.isSelected) return;

      if (item.action === 'create_chapter') {
        const newTopicId = `top-${activeProject.board?.toLowerCase() || 'cbse'}-c6-${item.seqNumber}`;

        // Check if already exists to avoid duplication
        const alreadyExists = updatedTopics.some((t) => t.id === newTopicId || t.title === item.chapterTitle);
        if (!alreadyExists) {
          const cleanTitle = item.chapterTitle.replace(/^Chapter\s+\d+:\s*/i, '');
          const newTopic: GrammarTopic = {
            id: newTopicId,
            title: cleanTitle,
            category: item.strand,
            classLevel: (activeProject.classLevel as GrammarClassLevel) || 'Class 6',
            overview: `${item.conceptTitle}. Mapped to ${item.curriculumMappingCode}. Authoritative Scope & Sequence item from ${activeProject.board} curriculum continuum.`,
            learningObjectives: item.learningObjectives,
            definitions: [
              {
                id: `def-${newTopicId}`,
                term: cleanTitle,
                ageAppropriateExplanation: `${item.conceptTitle} forms a central pillar of English grammar for ${activeProject.classLevel} students. Mastering this concept enables accurate sentence construction and syntactic clarity.`,
                rules: [
                  'Identify the primary syntactic constituent before determining inflection or concord.',
                  'Maintain grammatical consistency across compound and complex structures.',
                ],
                examples: [
                  {
                    sentence: 'The subject and verb must agree in person and number.',
                    highlightWord: 'agree',
                    note: 'Primary concord rule',
                  },
                ],
              },
            ],
            notesAndTheoryMarkdown: `### 1. Core Grammatical Principle: ${cleanTitle}\n\n${item.conceptTitle} forms a central pillar of English grammar for ${activeProject.classLevel} students.\n\n### 2. Prescribed Rules & Morpho-Syntactic Framework\n\nRule 1: Always identify the core constituent before determining agreement or inflection.\nRule 2: Distinguish between base lexical items and inflectional affixes.\nRule 3: Maintain stylistic consistency across complex sentence registers.`,
            exercises: [
              {
                id: `ex-${newTopicId}-a`,
                title: 'Exercise A: Recognition & Identification',
                instructions: 'Read each sentence and identify the target grammatical constituent.',
                targetType: 'mcq',
                maxMarks: 1,
                questions: [
                  {
                    id: `q-${newTopicId}-1`,
                    type: 'mcq',
                    prompt: `Identify the correct grammatical classification for the underlined constituent in this standard ${activeProject.board} Class 6 sentence.`,
                    options: ['Primary Subject', 'Direct Complement', 'Adjunct Phrase', 'Predicate Verb'],
                    correctAnswer: 'Primary Subject',
                    explanation: 'The primary subject governs syntactic agreement with the finite verb.',
                    difficulty: 'Medium',
                    marks: 1,
                  },
                ],
              },
            ],
            testSeries: [],
          };

          updatedTopics.push(newTopic);

          // Link to target unit
          const targetUnit = unitMap[item.targetUnitId] || Object.values(unitMap)[0];
          if (targetUnit && !targetUnit.chapterIds.includes(newTopicId)) {
            targetUnit.chapterIds.push(newTopicId);
          }
        }
      } else if (item.action === 'assign_unit' && item.targetTopicId) {
        // Link existing topic to target unit
        const targetUnit = unitMap[item.targetUnitId];
        if (targetUnit && !targetUnit.chapterIds.includes(item.targetTopicId)) {
          targetUnit.chapterIds.push(item.targetTopicId);
        }
      }
    });

    const finalUnits = Object.values(unitMap).sort((a, b) => a.unitNumber - b.unitNumber);

    const updatedBook: ClassCurriculumBook = {
      ...currentBook,
      topics: updatedTopics,
      units: finalUnits,
    };

    onApplySync(updatedBook);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="scope-sequence-sync-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="scope-sequence-sync-modal"
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode
            ? 'bg-[#181515] border-[#5A1832] text-[#EDE4D6]'
            : 'bg-[#FAF7F2] border-[#CBBEAC] text-[#292521]'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                  Curriculum Synchronization Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#5A1832] text-[#F6F0E7]">
                  {activeProject.board} • {activeProject.classLevel}
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-[#191918] dark:text-[#F6F0E7] mt-0.5">
                Sync from Scope &amp; Sequence Continuum
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS & PREVIEW SWITCHER BAR */}
        <div className="p-4 border-b border-inherit bg-white/60 dark:bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-[#71685E] dark:text-[#A89C8F]">Scope Items:</span>
              <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">{items.length}</span>
            </div>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-[#71685E] dark:text-[#A89C8F]">Already Linked:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {summary.linkedCount}
              </span>
            </div>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-[#71685E] dark:text-[#A89C8F]">To Create in Units:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {summary.toCreateCount}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                isPreviewMode
                  ? 'bg-[#5A1832] text-[#F6F0E7] border-[#5A1832]'
                  : 'bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border-[#CBBEAC]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewMode ? 'Return to Editor' : 'Preview Changes'}</span>
            </button>
          </div>
        </div>

        {/* CONTENT VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {isPreviewMode ? (
            /* PREVIEW CHANGES VIEW */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start space-x-3 text-xs text-blue-900 dark:text-blue-200">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Summary of Planned Changes</h4>
                  <p className="mt-1 leading-relaxed">
                    Applying this synchronization will create {summary.toCreateCount} planned chapters
                    across Units 2 through 6. Your existing Chapter Studio content for{' '}
                    <strong>Subject-Verb Agreement (cbse-6-sva)</strong> will be preserved intact
                    without duplication or overwrite.
                  </p>
                </div>
              </div>

              {/* Unit allocation breakdown preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((uNum) => {
                  const unitItems = items.filter(
                    (i) => i.suggestedUnitNumber === uNum && (i.isSelected || i.status === 'linked')
                  );
                  return (
                    <div
                      key={uNum}
                      className="p-3.5 rounded-xl border border-inherit bg-white dark:bg-[#200b14] space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-inherit pb-2">
                        <span className="font-serif font-bold text-xs text-[#5A1832] dark:text-[#C29A52]">
                          Unit {uNum}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#71685E] dark:text-[#D8CCBC]">
                          {unitItems.length} chapters
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        {unitItems.length === 0 ? (
                          <span className="text-stone-400 italic text-[11px]">No chapters assigned</span>
                        ) : (
                          unitItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-1.5 text-[11px] truncate"
                            >
                              {item.status === 'linked' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Plus className="w-3 h-3 text-blue-600 shrink-0" />
                              )}
                              <span className="truncate font-medium">{item.chapterTitle}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* INTERACTIVE SYNC TABLE */
            <div className="space-y-3">
              {/* Filter and selection tools */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(true)}
                    className="px-2.5 py-1 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-semibold text-[11px] hover:opacity-90"
                  >
                    Select All Unlinked
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSelectAll(false)}
                    className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] hover:opacity-90"
                  >
                    Deselect All
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-stone-500 font-mono text-[11px]">Filter Strand:</span>
                  <select
                    value={filterStrand}
                    onChange={(e) => setFilterStrand(e.target.value)}
                    className="p-1 rounded-md border border-inherit bg-white dark:bg-[#200b14] text-xs"
                  >
                    <option value="all">All Strands</option>
                    <option value="Syntax & Morphology">Syntax &amp; Morphology</option>
                    <option value="Parts of Speech">Parts of Speech</option>
                    <option value="Tense & Time">Tense &amp; Time</option>
                    <option value="Sentence Architecture">Sentence Architecture</option>
                  </select>
                </div>
              </div>

              {/* Table of items */}
              <div className="border border-inherit rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[10px] uppercase border-b border-inherit">
                    <tr>
                      <th className="p-3 w-10 text-center">Sync</th>
                      <th className="p-3">Scope &amp; Sequence Item</th>
                      <th className="p-3">Suggested Unit</th>
                      <th className="p-3">Current Link Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit">
                    {items
                      .filter(
                        (item) =>
                          filterStrand === 'all' || item.strand.toLowerCase().includes(filterStrand.toLowerCase())
                      )
                      .map((item) => {
                        const isLinked = item.status === 'linked';

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-[#EDE4D6]/20 dark:hover:bg-[#35101F]/20 transition-colors ${
                              item.isSelected ? 'bg-amber-500/5' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                disabled={isLinked}
                                checked={item.isSelected}
                                onChange={(e) =>
                                  updateItem(item.id, { isSelected: e.target.checked })
                                }
                                className="rounded text-[#5A1832] focus:ring-[#5A1832] cursor-pointer"
                              />
                            </td>

                            {/* Item Details */}
                            <td className="p-3">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-[10px] text-[#9A7438] dark:text-[#C29A52] font-bold">
                                  {item.curriculumMappingCode}
                                </span>
                                <span className="text-stone-300 dark:text-stone-700">•</span>
                                <span className="text-[10px] font-mono text-stone-500">
                                  {item.strand}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                                {item.chapterTitle}
                              </h4>
                              <p className="text-[11px] text-stone-500 truncate max-w-sm mt-0.5">
                                {item.conceptTitle}
                              </p>
                            </td>

                            {/* Suggested Unit Selector */}
                            <td className="p-3">
                              <select
                                value={item.targetUnitId}
                                disabled={isLinked}
                                onChange={(e) => updateItem(item.id, { targetUnitId: e.target.value })}
                                className="p-1.5 rounded-lg border border-inherit bg-white dark:bg-[#200b14] text-xs font-serif"
                              >
                                {existingUnits.length > 0 ? (
                                  existingUnits.map((u) => (
                                    <option key={u.id} value={u.id}>
                                      Unit {u.unitNumber}: {u.title.replace(/^Unit\s+\d+:\s*/i, '').slice(0, 24)}...
                                    </option>
                                  ))
                                ) : (
                                  [1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={`unit-c6-${num}`}>
                                      Unit {num}
                                    </option>
                                  ))
                                )}
                              </select>
                            </td>

                            {/* Link Status */}
                            <td className="p-3">
                              {isLinked ? (
                                <div className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Linked ({item.linkedTopicId})</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-amber-700 dark:text-amber-400 font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Unlinked (Ready to Plan)</span>
                                </div>
                              )}
                            </td>

                            {/* Action selector */}
                            <td className="p-3">
                              <select
                                value={item.action}
                                disabled={isLinked}
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    action: e.target.value as SyncRowAction,
                                    isSelected: e.target.value !== 'ignore',
                                  })
                                }
                                className="p-1.5 rounded-lg border border-inherit bg-white dark:bg-[#200b14] text-xs font-semibold"
                              >
                                <option value="create_chapter">Create Planned Chapter</option>
                                <option value="assign_unit">Assign to Unit</option>
                                <option value="merge">Merge Planning Item</option>
                                <option value="defer">Defer to Later Term</option>
                                <option value="exclude">Exclude with Reason</option>
                                <option value="ignore">Ignore Suggestion</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-inherit text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-confirm-scope-sync"
            onClick={handleConfirmSync}
            disabled={summary.totalSelected === 0}
            className="px-5 py-2.5 rounded-xl bg-[#5A1832] text-[#F6F0E7] text-xs font-serif font-bold shadow-md hover:bg-[#431225] disabled:opacity-50 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C29A52]" />
            <span>Apply Selected Sync ({summary.totalSelected} items)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
