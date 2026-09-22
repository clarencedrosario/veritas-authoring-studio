import React, { useState } from 'react';
import {
  Layers,
  Award,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  Edit3,
  Check,
  Plus,
  Trash2,
  FileText,
  Save,
} from 'lucide-react';
import { StudioChapter, ChapterRevisionData } from '../../types';
import { CANONICAL_SVA_REVISION_DATA } from '../../utils/chapterStudioData';

export interface ChapterSummaryRevisionViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  seriesProject?: any;
  isDarkMode: boolean;
}

export function getInitialRevisionDataForChapter(chapter: StudioChapter): ChapterRevisionData {
  if (chapter.revisionData) {
    return chapter.revisionData;
  }

  // If this is the Subject-Verb Agreement chapter, use the rich canonical data
  const isSva =
    chapter.title?.toLowerCase().includes('subject') &&
    chapter.title?.toLowerCase().includes('verb');
  if (isSva) {
    return CANONICAL_SVA_REVISION_DATA;
  }

  // If chapter.ending exists, construct from it
  if (chapter.ending) {
    const rulesAtAGlance =
      chapter.ending.rulesRecap?.map((r) => ({
        ruleTitle: r.rule,
        summary: `${r.example} ${r.trap ? `(Watch out: ${r.trap})` : ''}`,
      })) ||
      chapter.ending.rulesAtAGlance?.map((r) => ({
        ruleTitle: r.rule,
        summary: r.example,
      })) ||
      (chapter.rules && chapter.rules.length > 0
        ? chapter.rules.map((r) => ({ ruleTitle: r.ruleName, summary: r.ruleStatement }))
        : [
            {
              ruleTitle: `Core Principle of ${chapter.title}`,
              summary: `Fundamental grammatical law governing ${chapter.title}.`,
            },
          ]);

    const commonMistakes =
      chapter.ending.commonTraps?.map((t) => ({
        mistake: t.trap,
        correction: t.fix,
        why: `Violates standard grammatical rules for ${chapter.title}.`,
      })) ||
      chapter.ending.commonMistakes?.map((cm) => ({
        mistake: cm.incorrectSentence,
        correction: cm.correctSentence,
        why: cm.explanation,
      })) || [];

    const keyVocabulary =
      chapter.ending.keyVocabulary?.map((term) => ({
        term,
        definition: `Essential terminology used in ${chapter.title}.`,
      })) ||
      chapter.opening?.keyVocabulary?.map((term) => ({
        term,
        definition: `Core grammatical term for ${chapter.title}.`,
      })) || [];

    const rememberPoints =
      chapter.ending.summaryPoints ||
      chapter.ending.whatYouLearned || [
        `Always verify grammatical agreement and context in ${chapter.title}.`,
        'Apply rules systematically before choosing your answer.',
      ];

    return {
      rulesAtAGlance,
      keyConcepts: [chapter.title, 'Syntax', 'Form & Function'],
      commonMistakes,
      rememberPoints,
      keyVocabulary,
      quickCheckQuestions: [
        {
          prompt: `State the primary grammatical rule governing ${chapter.title}.`,
          answer: `Consult chapter section 1 for the fundamental definition and exemplary application.`,
        },
      ],
      revisionExercises: [chapter.title],
      challengeQuestions: [
        `Construct an original complex sentence demonstrating accurate use of ${chapter.title}.`,
      ],
      selfAssessmentChecklist: [
        {
          statement: `I can state the core rules of ${chapter.title} in my own words.`,
          canDo: true,
        },
        {
          statement: `I can identify common exam traps and correct them accurately.`,
          canDo: true,
        },
        {
          statement: `I can solve textbook and examination questions on ${chapter.title} with confidence.`,
          canDo: true,
        },
      ],
    };
  }

  // Fallback derived cleanly from chapter attributes without fabricating other topic nouns
  return {
    rulesAtAGlance:
      chapter.rules && chapter.rules.length > 0
        ? chapter.rules.map((r) => ({ ruleTitle: r.ruleName, summary: r.ruleStatement }))
        : [
            {
              ruleTitle: `Core Principle of ${chapter.title}`,
              summary: `Fundamental grammatical rule governing ${chapter.title}.`,
            },
          ],
    keyConcepts: [chapter.title, 'Grammatical Rules', 'Standard English Usage'],
    commonMistakes: [],
    rememberPoints: [
      `Review key definitions and exemplary sentence patterns for ${chapter.title}.`,
      'Pay close attention to exceptions and boundary conditions.',
    ],
    keyVocabulary:
      chapter.opening?.keyVocabulary?.map((term) => ({
        term,
        definition: `Key term for ${chapter.title}.`,
      })) || [{ term: chapter.title, definition: 'Subject of this chapter study unit.' }],
    quickCheckQuestions: [
      {
        prompt: `Explain the fundamental concept of ${chapter.title}.`,
        answer: `See Chapter notes for the formal definition and worked models.`,
      },
    ],
    revisionExercises: [chapter.title],
    challengeQuestions: [
      `Analyze an advanced sentence applying the rules of ${chapter.title}.`,
    ],
    selfAssessmentChecklist: [
      {
        statement: `I understand the fundamental concepts of ${chapter.title}.`,
        canDo: true,
      },
      {
        statement: `I can apply these rules in written exercises accurately.`,
        canDo: true,
      },
    ],
  };
}

export const ChapterSummaryRevisionView: React.FC<ChapterSummaryRevisionViewProps> = ({
  chapter,
  onUpdateChapter,
  seriesProject,
  isDarkMode,
}) => {
  const revision = getInitialRevisionDataForChapter(chapter);

  const [activeTab, setActiveTab] = useState<
    'rules_glance' | 'common_mistakes' | 'vocabulary' | 'quick_check' | 'checklist'
  >('rules_glance');

  const [isEditing, setIsEditing] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateRevision = (updater: (prev: ChapterRevisionData) => ChapterRevisionData) => {
    const updated = updater(revision);
    onUpdateChapter({
      ...chapter,
      revisionData: updated,
    });
  };

  const handleAiGenerateSummary = async () => {
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
    const subject = chapterAny.subject || seriesProject?.subject || 'English Grammar & Composition';
    const topic = chapter.title || 'Subject-Verb Agreement';

    try {
      const res = await fetch('/api/chapter-studio/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentId: 'comp-20',
          topic,
          classLevel,
          board,
          subject,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate chapter summary');
      }

      const generated = data.data;
      if (generated) {
        const updatedRevision: ChapterRevisionData = {
          rulesAtAGlance: (generated.rulesAtAGlance || []).map((r: any) => ({
            ruleTitle: r.rule || r.ruleTitle || 'Rule',
            summary: r.summary || '',
            example: r.example || undefined,
            trap: r.trap || undefined,
          })),
          whatYouLearned: generated.whatYouLearned || revision.whatYouLearned,
          commonMistakes: (generated.commonMistakes || []).map((cm: any) => ({
            mistake: cm.mistake || '',
            correction: cm.correction || '',
            why: cm.why || '',
          })),
          keyVocabulary: (generated.keyVocabulary || []).map((kv: any) => ({
            term: kv.term || '',
            definition: kv.definition || '',
          })),
          quickCheckQuestions: (generated.quickCheckQuestions || []).map((qc: any) => ({
            prompt: qc.prompt || '',
            answer: qc.answer || '',
          })),
          selfAssessmentChecklist: (generated.selfAssessmentChecklist || []).map((sa: any) => ({
            statement: sa.statement || '',
            canDo: sa.canDo ?? true,
          })),
          keyConcepts: generated.keyConcepts || revision.keyConcepts || [chapter.title, 'Syntax', 'Grammar'],
          rememberPoints: generated.rememberPoints || revision.rememberPoints || [],
          revisionExercises: generated.revisionExercises || revision.revisionExercises || [],
          challengeQuestions: generated.challengeQuestions || revision.challengeQuestions || [],
        };

        updateRevision(() => updatedRevision);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating summary');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#EDE4D6]/70 border border-[#CBBEAC] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5A1832] text-[#FFFDF8] flex items-center justify-center font-serif shadow-xs">
              <Layers className="w-5 h-5 text-[#C29A52]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1832]">
                  Component 20 • Architecture Synthesis
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                  {chapter.title}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F]">
                Chapter Summary &amp; Revision Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Consolidate rules at a glance, high-frequency student traps, remember callouts, vocabulary glossaries, and self-assessment matrices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAiGenerateSummary}
              disabled={isAiGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>{isAiGenerating ? 'Synthesizing...' : 'AI Generate Summary'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isEditing
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#FFFDF8] border border-[#CBBEAC] text-[#5A1832] hover:bg-[#EDE4D6]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Summary'}</span>
            </button>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 bg-[#F6F0E7] p-1 rounded-xl border border-[#CBBEAC] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('rules_glance')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'rules_glance'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
                }`}
              >
                Rules at a Glance
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('common_mistakes')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'common_mistakes'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
                }`}
              >
                Common Mistakes ({revision.commonMistakes?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vocabulary')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'vocabulary'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
                }`}
              >
                Vocabulary ({revision.keyVocabulary?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quick_check')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'quick_check'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
                }`}
              >
                Quick Check ({revision.quickCheckQuestions?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'bg-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'text-[#71685E] hover:text-[#292521] hover:bg-[#EDE4D6]'
                }`}
              >
                Self-Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Rules at a Glance */}
      {activeTab === 'rules_glance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#35101F]">
              Rules at a Glance for {chapter.title}
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  updateRevision((prev) => ({
                    ...prev,
                    rulesAtAGlance: [
                      ...(prev.rulesAtAGlance || []),
                      { ruleTitle: 'New Grammatical Rule', summary: 'Enter summary and exemplary formula.' },
                    ],
                  }))
                }
                className="px-2.5 py-1 rounded bg-[#5A1832] text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {revision.rulesAtAGlance && revision.rulesAtAGlance.length > 0 ? (
              revision.rulesAtAGlance.map((r, i) => (
                <div
                  key={i}
                  className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs space-y-2 hover:border-[#5A1832]/50 transition-colors relative"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={r.ruleTitle}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            updateRevision((prev) => {
                              const list = [...prev.rulesAtAGlance];
                              list[i] = { ...list[i], ruleTitle: newTitle };
                              return { ...prev, rulesAtAGlance: list };
                            });
                          }}
                          className="font-serif font-bold text-sm text-[#35101F] bg-[#EDE4D6]/50 p-1.5 rounded border border-[#CBBEAC] w-full"
                          placeholder="Rule title"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateRevision((prev) => ({
                              ...prev,
                              rulesAtAGlance: prev.rulesAtAGlance.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Delete Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={r.summary}
                        onChange={(e) => {
                          const newSummary = e.target.value;
                          updateRevision((prev) => {
                            const list = [...prev.rulesAtAGlance];
                            list[i] = { ...list[i], summary: newSummary };
                            return { ...prev, rulesAtAGlance: list };
                          });
                        }}
                        rows={3}
                        className="text-xs text-[#292521] font-serif bg-[#EDE4D6]/30 p-2 rounded border border-[#CBBEAC] w-full"
                        placeholder="Rule summary and formula..."
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5A1832]/10 text-[#5A1832] text-xs font-serif font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-[#35101F]">
                          {r.ruleTitle}
                        </h4>
                      </div>
                      <p className="text-xs text-[#292521] font-serif leading-relaxed pl-8">
                        {r.summary}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 rounded-xl border border-dashed border-[#CBBEAC] text-center bg-[#FFFDF8]">
                <p className="text-xs text-[#71685E]">
                  No rules at a glance authored yet for {chapter.title}. Click "Edit Summary" to add rules.
                </p>
              </div>
            )}
          </div>

          {/* Remember Box */}
          <div className="p-4 rounded-xl bg-[#EDE4D6]/70 border border-[#C29A52] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#35101F]">
                <Bookmark className="w-4 h-4 text-[#C29A52]" />
                <span>Remember: Golden Principles</span>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    updateRevision((prev) => ({
                      ...prev,
                      rememberPoints: [
                        ...(prev.rememberPoints || []),
                        'New golden principle for this chapter.',
                      ],
                    }))
                  }
                  className="px-2 py-0.5 rounded bg-[#5A1832] text-white text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Point</span>
                </button>
              )}
            </div>
            <ul className="space-y-1.5 pl-2">
              {revision.rememberPoints?.map((pt, i) => (
                <li key={i} className="text-xs text-[#292521] flex items-start gap-2 font-serif">
                  <span className="font-bold text-[#C29A52]">•</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateRevision((prev) => {
                            const pts = [...prev.rememberPoints];
                            pts[i] = val;
                            return { ...prev, rememberPoints: pts };
                          });
                        }}
                        className="text-xs bg-[#FFFDF8] p-1 rounded border border-[#CBBEAC] flex-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateRevision((prev) => ({
                            ...prev,
                            rememberPoints: prev.rememberPoints.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span>{pt}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Common Mistakes */}
      {activeTab === 'common_mistakes' && (
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#CBBEAC] bg-[#EDE4D6]/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#35101F]">
                High-Frequency Board Examination Traps &amp; Misconceptions
              </h3>
              <p className="text-xs text-[#71685E] mt-0.5">
                Targeted contrastive analysis for {chapter.title}.
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  updateRevision((prev) => ({
                    ...prev,
                    commonMistakes: [
                      ...(prev.commonMistakes || []),
                      {
                        mistake: 'Incorrect example sentence',
                        correction: 'Correct standard sentence',
                        why: 'Explain why the incorrect form violates concord or syntax.',
                      },
                    ],
                  }))
                }
                className="px-2.5 py-1 rounded bg-[#5A1832] text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trap</span>
              </button>
            )}
          </div>
          <div className="divide-y divide-[#CBBEAC]/50">
            {revision.commonMistakes && revision.commonMistakes.length > 0 ? (
              revision.commonMistakes.map((m, i) => (
                <div key={i} className="p-4 space-y-2 hover:bg-[#F6F0E7]/60 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                      Trap #{i + 1}
                    </span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRevision((prev) => ({
                            ...prev,
                            commonMistakes: prev.commonMistakes.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Delete Trap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-rose-700 block mb-0.5">Incorrect Sentence:</label>
                          <input
                            type="text"
                            value={m.mistake}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateRevision((prev) => {
                                const list = [...prev.commonMistakes];
                                list[i] = { ...list[i], mistake: val };
                                return { ...prev, commonMistakes: list };
                              });
                            }}
                            className="text-xs w-full bg-[#FFFDF8] border border-rose-300 p-1.5 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-emerald-700 block mb-0.5">Correct Standard Sentence:</label>
                          <input
                            type="text"
                            value={m.correction}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateRevision((prev) => {
                                const list = [...prev.commonMistakes];
                                list[i] = { ...list[i], correction: val };
                                return { ...prev, commonMistakes: list };
                              });
                            }}
                            className="text-xs w-full bg-[#FFFDF8] border border-emerald-300 p-1.5 rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#71685E] block mb-0.5">Pedagogical Why:</label>
                        <input
                          type="text"
                          value={m.why}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRevision((prev) => {
                              const list = [...prev.commonMistakes];
                              list[i] = { ...list[i], why: val };
                              return { ...prev, commonMistakes: list };
                            });
                          }}
                          className="text-xs w-full bg-[#FFFDF8] border border-[#CBBEAC] p-1.5 rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                          <span className="font-bold text-rose-700 block mb-0.5">✕ Incorrect Usage</span>
                          <span className="line-through text-[#71685E] font-serif">{m.mistake}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <span className="font-bold text-emerald-800 block mb-0.5">✓ Standard Form</span>
                          <span className="text-[#292521] font-serif font-semibold">{m.correction}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#71685E] italic pt-1">
                        <span className="font-semibold text-[#292521]">Pedagogical Why: </span>
                        {m.why}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#71685E] text-xs">
                No common mistake traps authored yet for {chapter.title}. Click "Add Trap" to introduce student misconceptions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Key Vocabulary */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#35101F]">
              Key Glossary Terms for {chapter.title}
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  updateRevision((prev) => ({
                    ...prev,
                    keyVocabulary: [
                      ...(prev.keyVocabulary || []),
                      { term: 'New Term', definition: 'Definition of grammatical terminology.' },
                    ],
                  }))
                }
                className="px-2.5 py-1 rounded bg-[#5A1832] text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Term</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {revision.keyVocabulary && revision.keyVocabulary.length > 0 ? (
              revision.keyVocabulary.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-4 shadow-xs space-y-1.5 relative"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={v.term}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRevision((prev) => {
                              const list = [...prev.keyVocabulary];
                              list[i] = { ...list[i], term: val };
                              return { ...prev, keyVocabulary: list };
                            });
                          }}
                          className="font-serif font-bold text-sm text-[#5A1832] bg-[#EDE4D6]/50 p-1.5 rounded border border-[#CBBEAC] w-full"
                          placeholder="Term"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateRevision((prev) => ({
                              ...prev,
                              keyVocabulary: prev.keyVocabulary.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={v.definition}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateRevision((prev) => {
                            const list = [...prev.keyVocabulary];
                            list[i] = { ...list[i], definition: val };
                            return { ...prev, keyVocabulary: list };
                          });
                        }}
                        rows={2}
                        className="text-xs text-[#292521] bg-[#EDE4D6]/30 p-1.5 rounded border border-[#CBBEAC] w-full"
                        placeholder="Definition..."
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-serif font-bold text-[#5A1832]">
                          {v.term}
                        </h4>
                        <span className="text-[10px] font-mono text-[#71685E]">Glossary Item</span>
                      </div>
                      <p className="text-xs text-[#292521] leading-relaxed">
                        {v.definition}
                      </p>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-6 rounded-xl border border-dashed border-[#CBBEAC] text-center bg-[#FFFDF8]">
                <p className="text-xs text-[#71685E]">
                  No glossary terms authored yet for {chapter.title}. Click "Add Term" to add terminology.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Quick Check (Self-Test) */}
      {activeTab === 'quick_check' && (
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#35101F]">
              <HelpCircle className="w-4 h-4 text-[#5A1832]" />
              <span>Formative Quick Check (Self-Assessment for Students)</span>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  updateRevision((prev) => ({
                    ...prev,
                    quickCheckQuestions: [
                      ...(prev.quickCheckQuestions || []),
                      { prompt: 'New question prompt...', answer: 'Correct answer and explanation.' },
                    ],
                  }))
                }
                className="px-2.5 py-1 rounded bg-[#5A1832] text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {revision.quickCheckQuestions && revision.quickCheckQuestions.length > 0 ? (
              revision.quickCheckQuestions.map((q, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-[#F6F0E7] border border-[#CBBEAC] space-y-1.5"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#5A1832] text-xs">{i + 1}.</span>
                        <input
                          type="text"
                          value={q.prompt}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRevision((prev) => {
                              const list = [...prev.quickCheckQuestions];
                              list[i] = { ...list[i], prompt: val };
                              return { ...prev, quickCheckQuestions: list };
                            });
                          }}
                          className="text-xs font-serif text-[#292521] bg-[#FFFDF8] p-1.5 rounded border border-[#CBBEAC] flex-1"
                          placeholder="Question prompt..."
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateRevision((prev) => ({
                              ...prev,
                              quickCheckQuestions: prev.quickCheckQuestions.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="pl-5">
                        <label className="text-[10px] font-mono text-emerald-800 block mb-0.5">Teacher / Answer Key:</label>
                        <input
                          type="text"
                          value={q.answer}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateRevision((prev) => {
                              const list = [...prev.quickCheckQuestions];
                              list[i] = { ...list[i], answer: val };
                              return { ...prev, quickCheckQuestions: list };
                            });
                          }}
                          className="text-xs font-mono text-emerald-900 bg-emerald-50 p-1.5 rounded border border-emerald-300 w-full"
                          placeholder="Answer key..."
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-serif font-medium text-[#292521] flex items-start gap-2">
                        <span className="font-bold text-[#5A1832]">{i + 1}.</span>
                        <span>{q.prompt}</span>
                      </div>
                      <div className="pl-5 text-xs text-emerald-800 font-mono bg-emerald-50/70 p-2 rounded border border-emerald-200">
                        <span className="font-bold font-sans">Answer &amp; Key: </span>
                        {q.answer}
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#71685E] italic">
                No quick check questions added yet for {chapter.title}.
              </p>
            )}
          </div>

          {/* Challenge Prompt */}
          {revision.challengeQuestions && revision.challengeQuestions.length > 0 && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-1.5 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Scholar Challenge Question</span>
              </div>
              <p className="text-xs font-serif italic text-purple-950">
                "{revision.challengeQuestions[0]}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Self-Assessment Checklist */}
      {activeTab === 'checklist' && (
        <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#35101F]">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Student "I Can" Competency Checklist</span>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  updateRevision((prev) => ({
                    ...prev,
                    selfAssessmentChecklist: [
                      ...(prev.selfAssessmentChecklist || []),
                      { statement: 'I can demonstrate competency in this concept.', canDo: true },
                    ],
                  }))
                }
                className="px-2.5 py-1 rounded bg-[#5A1832] text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Competency</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {revision.selfAssessmentChecklist?.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#F6F0E7] hover:bg-[#EDE4D6] transition-colors border border-[#CBBEAC]"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={item.canDo}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateRevision((prev) => {
                        const list = [...prev.selfAssessmentChecklist];
                        list[i] = { ...list[i], canDo: checked };
                        return { ...prev, selfAssessmentChecklist: list };
                      });
                    }}
                    className="w-4 h-4 text-[#5A1832] rounded border-[#CBBEAC] focus:ring-[#5A1832] cursor-pointer"
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.statement}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateRevision((prev) => {
                          const list = [...prev.selfAssessmentChecklist];
                          list[i] = { ...list[i], statement: val };
                          return { ...prev, selfAssessmentChecklist: list };
                        });
                      }}
                      className="text-xs font-serif bg-[#FFFDF8] p-1 rounded border border-[#CBBEAC] flex-1"
                    />
                  ) : (
                    <span className="text-xs font-serif text-[#292521]">
                      {item.statement}
                    </span>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      updateRevision((prev) => ({
                        ...prev,
                        selfAssessmentChecklist: prev.selfAssessmentChecklist.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
