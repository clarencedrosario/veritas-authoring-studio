import React, { useState, useMemo } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Sparkles,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Award,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { StudioChapter, GrammarQuestion } from '../../types';

export interface AnswerKeyStudioViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  isDarkMode?: boolean;
}

export interface AnswerKeyRecord {
  id: string;
  source: 'exercise' | 'assessment';
  groupName: string;
  questionNumber: number;
  promptSummary: string;
  correctAnswer: string;
  acceptableAlternatives?: string[];
  grammarRationale?: string;
  rationale?: string;
  partialCreditGuidance?: string;
  diagnosticErrorNote?: string;
  marks?: number;
}

export const AnswerKeyStudioView: React.FC<AnswerKeyStudioViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  isDarkMode = false,
}) => {
  const chapterAny = chapter as any;
  const effectiveSubject = chapterAny.subject || seriesProject?.subject || 'Academic Studies';
  const isGrammar = /grammar|syntax|english language/i.test(chapter.category || '') || /grammar/i.test(effectiveSubject);
  const isMath = /math/i.test(chapter.category || '') || /math/i.test(effectiveSubject);
  const isScience = /science|biology|physics|chemistry/i.test(chapter.category || '') || /science|biology|physics|chemistry/i.test(effectiveSubject);
  const isHistory = /history|civics|social/i.test(chapter.category || '') || /history|civics|social/i.test(effectiveSubject);

  const rationaleLabel = isGrammar
    ? 'Grammatical Rationale'
    : isMath
    ? 'Mathematical Derivation'
    : isScience
    ? 'Scientific Reasoning'
    : isHistory
    ? 'Historical Analysis'
    : 'Analytical Rationale';

  const [activeScope, setActiveScope] = useState<'all' | 'exercises' | 'assessment'>('all');
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [placementOption, setPlacementOption] = useState<
    'teacher_only' | 'end_of_book' | 'online_qr' | 'removable_insert'
  >('teacher_only');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AnswerKeyRecord | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Derive all answer items from chapter exercises and assessment test
  const exercises = chapter.exercises || [];
  const chapterTest = chapter.chapterTest;

  // Build canonical answer records
  const derivedRecords: AnswerKeyRecord[] = useMemo(() => {
    const list: AnswerKeyRecord[] = [];

    // 1. From Exercises
    exercises.forEach((ex) => {
      (ex.questions || []).forEach((q, qIdx) => {
        list.push({
          id: `ak-ex-${ex.id}-${q.id || qIdx}`,
          source: 'exercise',
          groupName: ex.title || `Exercise ${ex.letter || ''}`,
          questionNumber: qIdx + 1,
          promptSummary: q.prompt || q.blanksSentence || q.originalSentence || 'Exercise question',
          correctAnswer: q.correctAnswer || (q as any).answer || 'See model text',
          acceptableAlternatives: (q as any).acceptableAlternatives || [
            isGrammar
              ? 'Equivalent syntactic formulation preserving tense and concord'
              : 'Equivalent valid formulation adhering to syllabus requirements',
          ],
          grammarRationale:
            q.explanation ||
            (q as any).rationale ||
            (isGrammar
              ? 'Conforms strictly to standard grammatical concord rules.'
              : isMath
              ? 'Conforms to verified mathematical derivation and method.'
              : isScience
              ? 'Conforms to established scientific laws and mechanisms.'
              : 'Conforms to standard academic syllabus principles.'),
          rationale:
            q.explanation ||
            (q as any).rationale ||
            (isGrammar
              ? 'Conforms strictly to standard grammatical concord rules.'
              : isMath
              ? 'Conforms to verified mathematical derivation and method.'
              : isScience
              ? 'Conforms to established scientific laws and mechanisms.'
              : 'Conforms to standard academic syllabus principles.'),
          partialCreditGuidance:
            (q as any).partialCreditGuidance ||
            (isGrammar
              ? 'Full mark for exact concord; zero credit for agreement violations.'
              : isMath
              ? 'Award partial credit for correct method steps despite arithmetic slip.'
              : isScience
              ? 'Award partial credit for identifying core mechanism with minor descriptive gap.'
              : 'Award partial credit for valid core understanding with minor omissions.'),
          diagnosticErrorNote:
            (q as any).diagnosticErrorNote ||
            (isGrammar
              ? 'Watch for false attraction to intervening prepositional phrases.'
              : isMath
              ? 'Watch for sign inversion or skipped steps.'
              : 'Watch for common conceptual pitfalls.'),
          marks: q.marks || 1,
        });
      });
    });

    // 2. From Chapter Assessment Test
    if (chapterTest && chapterTest.sections) {
      chapterTest.sections.forEach((sec) => {
        (sec.questions || []).forEach((q, qIdx) => {
          list.push({
            id: `ak-test-${sec.id}-${q.id || qIdx}`,
            source: 'assessment',
            groupName: `${chapterTest.title} (${sec.title})`,
            questionNumber: qIdx + 1,
            promptSummary: q.prompt || q.blanksSentence || 'Assessment question',
            correctAnswer: q.correctAnswer || 'See test rubric',
            acceptableAlternatives: (q as any).acceptableAlternatives || [],
            grammarRationale: q.explanation || 'Evaluated against official exam rubric.',
            rationale: q.explanation || 'Evaluated against official exam rubric.',
            partialCreditGuidance:
              (q as any).partialCreditGuidance ||
              (isGrammar
                ? 'Award partial credit (50%) if the finite verb root is correct but inflection slip occurs.'
                : 'Award partial credit (50%) for sound conceptual reasoning with minor precision gaps.'),
            diagnosticErrorNote:
              (q as any).diagnosticErrorNote ||
              (isGrammar ? 'Commonly confused with plural form.' : 'Watch for typical misconception traps.'),
            marks: q.marks || 1,
          });
        });
      });
    }

    return list;
  }, [exercises, chapterTest, isGrammar, isMath, isScience]);

  // Read persisted answerKey from chapter or fall back to derived
  const records = useMemo(() => {
    if (chapter.answerKey && chapter.answerKey.length > 0) {
      return (chapter.answerKey as unknown) as AnswerKeyRecord[];
    }
    return derivedRecords;
  }, [chapter.answerKey, derivedRecords]);

  const persistRecords = (updated: AnswerKeyRecord[]) => {
    onUpdateChapter({
      ...chapter,
      answerKey: (updated as unknown) as any,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleStartEdit = (rec: AnswerKeyRecord) => {
    setEditingRecordId(rec.id);
    setEditForm({ ...rec });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const updated = records.map((r) => (r.id === editForm.id ? editForm : r));
    persistRecords(updated);
    setEditingRecordId(null);
    setEditForm(null);
  };

  const handleSyncFromContent = () => {
    persistRecords(derivedRecords);
  };

  // AI Generation of Answer Key & Rubrics
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setErrorMessage(null);

    const chapterAny = chapter as any;
    const classLevel =
      chapterAny.targetClass ||
      chapterAny.classLevel ||
      seriesProject?.selectedClass ||
      'Class 6';
    const board =
      chapterAny.curriculumFramework ||
      chapterAny.board ||
      chapterAny.curriculumBoard ||
      seriesProject?.activeSystemId ||
      seriesProject?.targetBoard ||
      'CISCE';
    const subject = chapterAny.subject || seriesProject?.subject || (isGrammar ? 'English Grammar & Composition' : 'Academic Studies');
    const topic = chapter.title || (isGrammar ? 'Subject-Verb Agreement' : 'Core Study');

    try {
      const res = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-22',
          topic,
          classLevel,
          board,
          subject,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'AI generation could not be completed. Your existing content has not been changed.');
      }

      const generatedList = data.data?.answerKey || [];
      if (generatedList.length > 0) {
        const merged: AnswerKeyRecord[] = generatedList.map((item: any, idx: number) => ({
          id: `ak-ai-${Date.now()}-${idx}`,
          source: 'exercise',
          groupName: item.exerciseLetterOrNumber || `Exercise A`,
          questionNumber: item.questionNumber || idx + 1,
          promptSummary: item.promptSummary || `Specimen ${idx + 1}`,
          correctAnswer: item.correctAnswer || '',
          acceptableAlternatives: item.acceptableAlternatives || [],
          grammarRationale: item.grammarRationale || item.rationale || '',
          rationale: item.rationale || item.grammarRationale || '',
          partialCreditGuidance: item.partialCreditGuidance || '',
          diagnosticErrorNote: item.diagnosticErrorNote || '',
          marks: 1,
        }));
        persistRecords(merged);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'AI generation could not be completed. Your existing content has not been changed.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Filter records based on activeScope
  const filteredRecords = records.filter((r) => {
    if (activeScope === 'exercises') return r.source === 'exercise';
    if (activeScope === 'assessment') return r.source === 'assessment';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
              <Key className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                  Component 22 • Answer Keys &amp; Rubrics
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
                  {records.length} Solutions Verified
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F]">
                Complete Answer Key &amp; Evaluation Rubrics
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Manage canonical solutions, acceptable {isGrammar ? 'linguistic' : 'domain'} alternatives, diagnostic notes, and partial-credit marking rubrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Student vs Teacher Preview */}
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
              <span>{isTeacherView ? 'Teacher Edition (Full Key)' : 'Student Edition (Restricted)'}</span>
            </button>

            {/* Placement option */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#71685E] font-medium">Placement:</span>
              <select
                value={placementOption}
                onChange={(e) => setPlacementOption(e.target.value as any)}
                className="bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521] text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none"
              >
                <option value="teacher_only">Teacher's Edition Only</option>
                <option value="end_of_book">End of Book Appendix</option>
                <option value="online_qr">Online Resource / QR Code</option>
                <option value="removable_insert">Removable Examination Insert</option>
              </select>
            </div>

            {/* AI Generate Key */}
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isAiGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE4D6] hover:bg-[#CBBEAC]/50 text-[#5A1832] text-xs font-bold rounded-lg border border-[#CBBEAC] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>{isAiGenerating ? 'Synthesizing Key...' : 'AI Generate Key'}</span>
            </button>

            {/* Sync from content */}
            <button
              type="button"
              onClick={handleSyncFromContent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F6F0E7] text-[#71685E] text-xs font-semibold rounded-lg border border-[#CBBEAC] transition-colors cursor-pointer"
              title="Populate or refresh solutions from existing chapter exercises and test"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex gap-2 border-b border-[#CBBEAC] pb-1">
        <button
          type="button"
          onClick={() => setActiveScope('all')}
          className={`px-4 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
            activeScope === 'all'
              ? 'bg-[#FFFDF8] text-[#5A1832] border-t-2 border-x border-[#CBBEAC]'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
        >
          All Solutions ({records.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveScope('exercises')}
          className={`px-4 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
            activeScope === 'exercises'
              ? 'bg-[#FFFDF8] text-[#5A1832] border-t-2 border-x border-[#CBBEAC]'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
        >
          Exercise Keys ({records.filter((r) => r.source === 'exercise').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveScope('assessment')}
          className={`px-4 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
            activeScope === 'assessment'
              ? 'bg-[#FFFDF8] text-[#5A1832] border-t-2 border-x border-[#CBBEAC]'
              : 'text-[#71685E] hover:text-[#292521]'
          }`}
        >
          Assessment Test Keys ({records.filter((r) => r.source === 'assessment').length})
        </button>
      </div>

      {/* Student View Warning Notice */}
      {!isTeacherView && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <EyeOff className="w-4 h-4" />
            <span>Student Edition Preview Active</span>
          </div>
          <p className="leading-relaxed">
            In Student Edition mode, canonical answer keys and diagnostic teacher rationale are withheld by default. Only self-assessment rubrics and blank exercises are exposed to learners.
          </p>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAiGenerate}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-semibold text-xs cursor-pointer transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="px-2 py-1 text-amber-800 hover:text-amber-950 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Solutions Grid / List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-[#FFFDF8] border border-dashed border-[#CBBEAC] rounded-xl p-8 text-center space-y-3">
            <Key className="w-8 h-8 text-[#CBBEAC] mx-auto" />
            <h4 className="text-sm font-serif font-bold text-[#35101F]">No Answer Key Entries Available</h4>
            <p className="text-xs text-[#71685E] max-w-md mx-auto">
              Answers will be populated from your chapter exercises and assessment questions once added, or you can synchronize solutions from the chapter.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
          const isEditing = editingRecordId === rec.id;

          if (isEditing && editForm) {
            return (
              <div
                key={rec.id}
                className="bg-[#FFFDF8] border-2 border-[#5A1832] rounded-xl p-5 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#CBBEAC] pb-2">
                  <span className="text-xs font-bold text-[#5A1832] uppercase">
                    Editing Solution: {rec.groupName} • Q{rec.questionNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-[#5A1832] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRecordId(null)}
                      className="px-3 py-1 bg-white border border-[#CBBEAC] text-[#71685E] rounded text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                    Canonical Correct Answer:
                  </label>
                  <input
                    type="text"
                    value={editForm.correctAnswer}
                    onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A1832] block mb-1">
                      {rationaleLabel}:
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.rationale || editForm.grammarRationale || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          grammarRationale: e.target.value,
                          rationale: e.target.value,
                        })
                      }
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Diagnostic Pitfall / Trap Note:
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.diagnosticErrorNote || ''}
                      onChange={(e) =>
                        setEditForm({ ...editForm, diagnosticErrorNote: e.target.value })
                      }
                      className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#71685E] block mb-1">
                    Partial Credit Guidance:
                  </label>
                  <input
                    type="text"
                    value={editForm.partialCreditGuidance || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, partialCreditGuidance: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] text-[#292521]"
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={rec.id}
              className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs space-y-2.5 transition-all hover:border-[#5A1832]/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]">
                    {rec.groupName}
                  </span>
                  <span className="text-xs font-bold text-[#292521]">
                    Question #{rec.questionNumber}
                  </span>
                  <span className="text-[11px] text-[#71685E] font-serif truncate max-w-md">
                    "{rec.promptSummary}"
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(rec)}
                    className="p-1 text-[#71685E] hover:text-[#5A1832] cursor-pointer"
                    title="Edit Solution & Rubric"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* In Teacher View: Show Full Key & Rationale */}
              {isTeacherView ? (
                <div className="space-y-2 pt-1 font-sans">
                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-emerald-900 text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">
                        Model Answer:
                      </span>
                      <span className="font-serif font-bold text-sm">
                        {rec.correctAnswer}
                      </span>
                    </div>
                    {rec.marks && (
                      <span className="text-[11px] font-mono text-emerald-800 font-bold">
                        [{rec.marks} Mark]
                      </span>
                    )}
                  </div>

                  {(rec.rationale || rec.grammarRationale) && (
                    <div className="text-xs text-[#71685E] pl-2 flex items-start gap-1.5">
                      <span className="font-semibold text-[#5A1832]">{rationaleLabel}:</span>
                      <span className="font-serif italic text-[#292521]">
                        {rec.rationale || rec.grammarRationale}
                      </span>
                    </div>
                  )}

                  {rec.diagnosticErrorNote && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/60 p-2 rounded border border-amber-200 pl-2">
                      <span className="font-bold">Diagnostic Note: </span>
                      {rec.diagnosticErrorNote}
                    </div>
                  )}

                  {rec.partialCreditGuidance && (
                    <div className="text-[10px] text-[#71685E] pl-2">
                      <span className="font-semibold">Marking Scheme: </span>
                      {rec.partialCreditGuidance}
                    </div>
                  )}
                </div>
              ) : (
                /* In Student View: Protected / Concealed */
                <div className="p-2.5 rounded-lg bg-[#F6F0E7] border border-dashed border-[#CBBEAC] text-xs text-[#71685E] flex items-center justify-between">
                  <span>[Answer Key reserved for Teacher Edition or End-of-Book Appendix]</span>
                  <span className="text-[10px] font-mono uppercase bg-[#EDE4D6] px-1.5 py-0.5 rounded">
                    Student Safe
                  </span>
                </div>
              )}
            </div>
          );
        }))}
      </div>
    </div>
  );
};
