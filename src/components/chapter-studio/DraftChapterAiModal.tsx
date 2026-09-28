import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Check,
  X,
  FileText,
  RefreshCw,
  Plus,
  BookOpen,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  Layers,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { StudioChapter, ChapterSection, TextbookContentBlock } from '../../types';
import {
  cleanHeadingTitle,
  cleanMarkdownSyntax,
  sanitizeContentStrippingRationale,
  calibrateManuscriptMetadataForClass,
  sanitizeStudentTypography,
} from '../../utils/pedagogicalProfileSystem';
import { TextbookMarkdown } from '../common/TextbookMarkdown';

interface ProposedSection {
  id: string;
  title: string;
  sectionType: string;
  content: string;
  rationale: string;
  isSelected: boolean;
  isEditing?: boolean;
}

interface DraftChapterAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onAcceptSections: (newSections: ChapterSection[], replaceExisting: boolean) => void;
  isDarkMode?: boolean;
}

const CLASS_OPTIONS = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const BOARD_OPTIONS = [
  { id: 'CBSE', label: 'CBSE (NCF / NEP 2020 Aligned)' },
  { id: 'CISCE', label: 'CISCE / ICSE / ISC (Formal Syntax Rigour)' },
  { id: 'Cambridge', label: 'Cambridge (CAIE International Framework)' },
  { id: 'State Board', label: 'State Board Curriculum' },
  { id: 'IB', label: 'International Baccalaureate (IB)' },
];

export const DraftChapterAiModal: React.FC<DraftChapterAiModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onAcceptSections,
  isDarkMode = false,
}) => {
  const [chapterTitle, setChapterTitle] = useState(chapter.title || '');
  const [classLevel, setClassLevel] = useState<string>(
    chapter.equivalentClass || CLASS_OPTIONS[0]
  );
  const [board, setBoard] = useState<string>(
    chapter.curriculumBoard || chapter.systemId || 'CBSE'
  );
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proposedSections, setProposedSections] = useState<ProposedSection[]>([]);
  const [pedagogicalOverview, setPedagogicalOverview] = useState<string>('');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setChapterTitle(chapter.title || '');
      if (chapter.equivalentClass) {
        setClassLevel(chapter.equivalentClass);
      }
      if (chapter.curriculumBoard || chapter.systemId) {
        setBoard(chapter.curriculumBoard || chapter.systemId);
      }
      setErrorNotice(null);
    }
  }, [isOpen, chapter.id, chapter.title, chapter.equivalentClass, chapter.curriculumBoard, chapter.systemId]);

  const handleGenerate = async () => {
    if (!chapterTitle.trim()) {
      setErrorNotice('Please provide a chapter title to draft.');
      return;
    }

    setIsLoading(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/chapter-studio/draft-entire-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: chapterTitle.trim(),
          classLevel,
          board,
          subject: chapter.subject || 'English Language & Grammar',
          instructions: instructions.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        const errorMsg =
          (typeof data?.error === 'string' ? data.error : data?.error?.message) ||
          data?.message ||
          `Server returned HTTP ${res.status}`;
        throw new Error(errorMsg);
      }

      if (data.success && data.draft?.sections?.length) {
        const sections: ProposedSection[] = data.draft.sections.map((sec: any, idx: number) => ({
          id: `draft-sec-${Date.now()}-${idx}`,
          title: sec.title || `Section ${idx + 1}`,
          sectionType: sec.sectionType || 'explanation',
          content: sec.content || '',
          rationale: sec.rationale || '',
          isSelected: true,
          isEditing: false,
        }));
        setProposedSections(sections);
        setPedagogicalOverview(data.draft.pedagogicalOverview || '');
      } else {
        throw new Error(data.error || 'Failed to draft chapter sections');
      }
    } catch (err: any) {
      console.error('Draft chapter error:', err);
      setErrorNotice(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (index: number) => {
    setProposedSections((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isSelected: !s.isSelected } : s))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setProposedSections((prev) => prev.map((s) => ({ ...s, isSelected: select })));
  };

  const handleUpdateContent = (index: number, newContent: string) => {
    setProposedSections((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, content: newContent } : s))
    );
  };

  const handleUpdateTitle = (index: number, newTitle: string) => {
    setProposedSections((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, title: newTitle } : s))
    );
  };

  const handleToggleEditing = (index: number) => {
    setProposedSections((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isEditing: !s.isEditing } : s))
    );
  };

  const handleRemoveSection = (index: number) => {
    setProposedSections((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === proposedSections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setProposedSections((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const handleRegenerateSingle = async (index: number) => {
    const target = proposedSections[index];
    if (!target) return;

    try {
      const res = await fetch('/api/chapter-studio/ai-writing-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_section',
          chapterTitle,
          sectionTitle: target.title,
          board,
          classLevel,
          subject: chapter.subject || 'English Language & Grammar',
          additionalInstructions: `Regenerate with fresh examples and clear exposition. ${instructions}`,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data.result) {
        setProposedSections((prev) =>
          prev.map((s, idx) => (idx === index ? { ...s, content: data.result } : s))
        );
      } else {
        const errorMsg =
          (typeof data?.error === 'string' ? data.error : data?.error?.message) ||
          data?.message ||
          `Regeneration failed (HTTP ${res.status})`;
        setErrorNotice(errorMsg);
      }
    } catch (err: any) {
      console.error('Failed to regenerate section:', err);
      setErrorNotice(err?.message || 'Failed to regenerate section.');
    }
  };

  const handleAccept = () => {
    // Preserve the EXACT order of sections as selected by the author
    const selected = proposedSections.filter((s) => s.isSelected);
    if (selected.length === 0) {
      setErrorNotice('Please select at least one section to accept.');
      return;
    }

    const convertedSections: ChapterSection[] = selected.map((s, idx) => {
      // Calibrate section title for target class level
      const cleanTitle = calibrateManuscriptMetadataForClass(s.title, classLevel);
      // RATIONALE PURITY: Strip any rationale text that may be inside s.content
      const { cleanContent, extractedRationale } = sanitizeContentStrippingRationale(s.content || '');
      const rawContent = sanitizeStudentTypography(cleanContent);
      const finalRationale = s.rationale || extractedRationale || '';

      // Check if content has subheadings (### / ####) or major divisions (e.g. 1. Title, Rule 1:, Exercise A:)
      const parts = rawContent.split(/\n(?=#{1,4}\s+|Rule\s+\d+:|Exercise\s+[A-Za-z0-9]+:|\d+\.\s+[A-Z])/g);
      const blocks: TextbookContentBlock[] = [];

      if (parts.length > 1) {
        parts.forEach((part, pIdx) => {
          const trimmedPart = part.trim();
          if (!trimmedPart) return;

          const headingMatch = trimmedPart.match(/^(?:#{1,4}\s+|\d+\.\s+)(.+)$/m);
          const isRuleMatch = /^Rule\s+\d+[:\s-]/i.test(trimmedPart);

          if (isRuleMatch) {
            const ruleLines = trimmedPart.split('\n');
            const ruleTitle = ruleLines[0].trim();
            const ruleBody = ruleLines.slice(1).join('\n').trim();

            blocks.push({
              id: `blk-${Date.now()}-${idx}-${pIdx}-r`,
              type: 'grammar_rule',
              order: blocks.length + 1,
              visibility: 'student',
              calloutTitle: calibrateManuscriptMetadataForClass(ruleTitle, classLevel),
              calloutText: sanitizeStudentTypography(ruleBody || ruleTitle),
              authorNotes: `Drafted rule for ${classLevel}`,
            });
          } else if (headingMatch) {
            const headingText = calibrateManuscriptMetadataForClass(headingMatch[1], classLevel);
            const bodyText = trimmedPart.replace(/^(?:#{1,4}\s+|\d+\.\s+).+$/m, '').trim();

            blocks.push({
              id: `blk-${Date.now()}-${idx}-${pIdx}-h`,
              type: 'heading',
              order: blocks.length + 1,
              visibility: 'student',
              title: headingText,
              textContent: headingText,
              authorNotes: `Drafted heading for ${classLevel}`,
            });

            if (bodyText) {
              blocks.push({
                id: `blk-${Date.now()}-${idx}-${pIdx}-t`,
                type: 'text',
                order: blocks.length + 1,
                visibility: 'student',
                textContent: sanitizeStudentTypography(bodyText),
                authorNotes: `Drafted via AI for ${classLevel} (${s.sectionType})`,
              });
            }
          } else {
            blocks.push({
              id: `blk-${Date.now()}-${idx}-${pIdx}`,
              type: 'text',
              order: blocks.length + 1,
              visibility: 'student',
              textContent: sanitizeStudentTypography(trimmedPart),
              authorNotes: `Drafted via AI for ${classLevel} (${s.sectionType})`,
            });
          }
        });
      }

      // Fallback if no subheadings split
      if (blocks.length === 0) {
        blocks.push({
          id: `blk-${Date.now()}-${idx}-1`,
          type: 'text',
          order: 1,
          visibility: 'student',
          textContent: sanitizeStudentTypography(rawContent),
          authorNotes: `Drafted via AI for ${classLevel} (${s.sectionType})`,
        });
      }

      return {
        id: `sec-ai-${Date.now()}-${idx}`,
        chapterId: chapter.id,
        numberLabel: `${chapter.chapterNumber}.${idx + 1}`,
        title: cleanTitle,
        order: idx + 1,
        blocks,
        metadata: {
          sectionType: s.sectionType,
          rationale: finalRationale,
        },
      };
    });

    // Authoritative insertion: passed in exact sequence (positions 1..N)
    onAcceptSections(convertedSections, replaceExisting);
    onClose();
  };

  const selectedCount = proposedSections.filter((s) => s.isSelected).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#CBBEAC] shadow-2xl text-[#292521] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBBEAC] flex items-center justify-between bg-[#EDE4D6] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#C29A52]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#35101F]">
                Draft Chapter with AI
              </h3>
              <p className="text-xs text-[#71685E]">
                Propose a flexible chapter structure and complete drafted textbook prose tailored to your class and board.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#CBBEAC]/40 text-[#71685E] hover:text-[#292521] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-[#CBBEAC] bg-[#F6F0E7]">
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1 font-mono">
                Chapter Title / Topic
              </label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Enter chapter title or topic (e.g. Prepositional Phrases, Direct & Indirect Speech, Tenses)..."
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-semibold text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1 font-mono">
                Class Level (Classes 1–12)
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-medium text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              >
                {!CLASS_OPTIONS.includes(classLevel) && classLevel && (
                  <option key={classLevel} value={classLevel}>
                    {classLevel}
                  </option>
                )}
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1 font-mono">
                Board / Curriculum
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-medium text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              >
                {!BOARD_OPTIONS.some((b) => b.id === board) && board && (
                  <option key={board} value={board}>
                    {board}
                  </option>
                )}
                {BOARD_OPTIONS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A1832] mb-1 font-mono">
                Optional Author Instructions
              </label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Include collective nouns, contrast pairs, exam tips..."
                className="w-full px-3 py-2 rounded-xl border border-[#CBBEAC] bg-[#FFFDF8] text-xs font-medium text-[#292521] focus:outline-none focus:ring-1 focus:ring-[#C29A52]"
              />
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71685E]">
              {proposedSections.length > 0
                ? `Proposed structure: ${proposedSections.length} sections (${selectedCount} selected)`
                : 'Click generate to propose a tailored chapter structure and draft.'}
            </span>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !chapterTitle.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5A1832] text-[#FFFDF8] hover:bg-[#35101F] transition-all cursor-pointer shadow-xs border border-[#C29A52]/40 disabled:opacity-50 inline-flex items-center space-x-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>{proposedSections.length > 0 ? 'Regenerate Entire Chapter' : 'Propose Chapter Structure & Draft'}</span>
                </>
              )}
            </button>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorNotice}
            </div>
          )}

          {/* Results Area */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29A52]" />
              <p className="text-sm font-semibold text-[#35101F]">
                Authoring complete chapter draft for {chapterTitle}...
              </p>
              <p className="text-xs text-[#71685E]">
                Structuring pedagogical flow for {classLevel} under {board} curriculum...
              </p>
            </div>
          ) : proposedSections.length > 0 ? (
            <div className="space-y-4">
              {pedagogicalOverview && (
                <div className="p-3 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] text-xs text-[#5A1832] font-serif">
                  <strong className="font-bold">Pedagogical Overview:</strong> {pedagogicalOverview}
                </div>
              )}

              <div className="flex items-center justify-between text-xs border-b border-[#CBBEAC] pb-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-[#5A1832] font-bold hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-[#CBBEAC]">•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-[#71685E] hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>

                <label className="flex items-center space-x-1.5 cursor-pointer text-[#71685E]">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="rounded text-[#5A1832]"
                  />
                  <span>Replace existing chapter sections</span>
                </label>
              </div>

              {/* Proposed Section Cards */}
              <div className="space-y-3">
                {proposedSections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`rounded-xl border transition-all ${
                      sec.isSelected
                        ? 'border-[#C29A52] bg-[#FFFDF8] shadow-xs'
                        : 'border-[#CBBEAC]/70 bg-[#F6F0E7]/60 opacity-60'
                    }`}
                  >
                    <div className="p-3 border-b border-[#CBBEAC]/50 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(idx)}
                          className="cursor-pointer text-[#5A1832]"
                        >
                          {sec.isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#5A1832]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#71685E]" />
                          )}
                        </button>

                        <div className="min-w-0">
                          {sec.isEditing ? (
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => handleUpdateTitle(idx, e.target.value)}
                              className="px-2 py-0.5 rounded border border-[#CBBEAC] text-xs font-bold text-[#35101F]"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-[#35101F] truncate">
                                {idx + 1}. {sec.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EDE4D6] text-[#71685E] uppercase font-mono">
                                {sec.sectionType}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] disabled:opacity-30 cursor-pointer"
                          title="Move section up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === proposedSections.length - 1}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] disabled:opacity-30 cursor-pointer"
                          title="Move section down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRegenerateSingle(idx)}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                          title="Regenerate this section"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleEditing(idx)}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                          title="Edit manually"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1 rounded hover:bg-black/5 text-[#71685E] hover:text-rose-600 cursor-pointer"
                          title="Remove section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      {sec.isEditing ? (
                        <textarea
                          rows={6}
                          value={sec.content}
                          onChange={(e) => handleUpdateContent(idx, e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-[#CBBEAC] text-xs font-serif leading-relaxed text-[#292521] focus:ring-1 focus:ring-[#C29A52]"
                        />
                      ) : (
                        <div className="text-xs font-serif text-[#292521] leading-relaxed max-h-40 overflow-y-auto pr-1">
                          <TextbookMarkdown content={sec.content} isDarkMode={isDarkMode} />
                        </div>
                      )}

                      {sec.rationale && (
                        <div className="mt-2 text-[10px] text-[#71685E] italic">
                          Rationale: {sec.rationale}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#71685E] space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-[#CBBEAC]" />
              <p className="text-xs font-medium">Ready to draft your grammar chapter.</p>
              <p className="text-[11px] text-[#71685E]">
                Set your topic, select Class (1–12) and Board, then click "Propose Chapter Structure &amp; Draft".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#CBBEAC] bg-[#EDE4D6] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#71685E]">
            {proposedSections.length > 0 && (
              <span>{selectedCount} of {proposedSections.length} sections will be inserted</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {proposedSections.length > 0 && (
              <button
                type="button"
                onClick={handleAccept}
                disabled={selectedCount === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept &amp; Insert ({selectedCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#71685E] hover:text-[#292521] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
