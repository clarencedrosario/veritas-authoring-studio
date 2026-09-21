import React, { useState } from 'react';
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
} from 'lucide-react';
import { StudioChapter } from '../../types';

export interface AnswerKeyStudioViewProps {
  chapter: StudioChapter;
  onUpdateChapter: (updated: StudioChapter) => void;
  isDarkMode: boolean;
}

export const AnswerKeyStudioView: React.FC<AnswerKeyStudioViewProps> = ({
  chapter,
  onUpdateChapter,
  isDarkMode,
}) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [placementOption, setPlacementOption] = useState<'teacher_only' | 'end_of_book' | 'online_qr' | 'removable_insert'>('teacher_only');

  const exercises = chapter.exercises || [];
  const currentExercise = exercises[selectedExerciseIndex] || exercises[0];

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
                  Production Stage 12 • Teacher &amp; Editorial Solutions
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
                  Verified Answers
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F]">
                Answer Key &amp; Rubrics Studio
              </h2>
              <p className="text-xs text-[#71685E] mt-0.5">
                Manage canonical solutions, acceptable linguistic variations, diagnostic explanations for common errors, and partial credit rubrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
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

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1832] hover:bg-[#35101F] text-[#FFFDF8] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Export Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Exercise Tabs + Solutions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Exercise Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71685E] px-1">
            Select Exercise ({exercises.length})
          </div>

          <div className="space-y-2">
            {exercises.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => setSelectedExerciseIndex(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedExerciseIndex === idx
                    ? 'bg-[#5A1832] border-[#5A1832] text-[#FFFDF8] shadow-xs'
                    : 'bg-[#FFFDF8] border-[#CBBEAC] hover:bg-[#EDE4D6]/50 text-[#292521]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase ${selectedExerciseIndex === idx ? 'text-[#EDE4D6]' : 'text-[#5A1832]'}`}>
                    Exercise {ex.letter}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    selectedExerciseIndex === idx ? 'bg-[#35101F] text-[#EDE4D6]' : 'bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC]'
                  }`}>
                    {ex.questions?.length || 0} Questions
                  </span>
                </div>
                <h4 className={`text-sm font-serif font-bold mt-1 ${selectedExerciseIndex === idx ? 'text-[#FFFDF8]' : 'text-[#292521]'}`}>
                  {ex.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Rubrics & Scoring Guidance Card */}
          <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#CBBEAC] space-y-2 text-xs shadow-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#5A1832]">
              <Award className="w-3.5 h-3.5 text-[#C29A52]" />
              <span>Partial Credit Guidelines</span>
            </div>
            <p className="text-[#292521] leading-relaxed font-serif">
              • Full Credit (1.0): Exact finite verb identified with correct number and person inflection.
            </p>
            <p className="text-[#292521] leading-relaxed font-serif">
              • Partial Credit (0.5): Head noun correctly distinguished from intervening adjunct, but minor spelling or tense slip occurred.
            </p>
            <p className="text-[#292521] leading-relaxed font-serif">
              • Zero Credit (0.0): Misalignment caused by proximity attraction to intervening noun.
            </p>
          </div>
        </div>

        {/* Right: Detailed Questions & Answers */}
        <div className="lg:col-span-8">
          {currentExercise ? (
            <div className="bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#CBBEAC] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832]">
                    Exercise {currentExercise.letter} Marking Key
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#35101F] mt-0.5">
                    {currentExercise.title}
                  </h3>
                </div>
                <span className="text-xs text-[#71685E]">
                  Target: {(currentExercise as any).focusRuleId || currentExercise.instructions || 'Concord Mastery'}
                </span>
              </div>

              {/* Questions List with Solutions */}
              <div className="space-y-4">
                {currentExercise.questions?.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="p-4 rounded-xl bg-[#F6F0E7] border border-[#CBBEAC] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-serif font-medium text-[#292521]">
                        <span className="font-bold text-[#5A1832] mr-2">{qIndex + 1}.</span>
                        <span>{q.prompt || q.originalSentence || q.blanksSentence}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE4D6] text-[#5A1832] border border-[#CBBEAC] shrink-0 font-bold">
                        {q.difficulty || 'Standard'}
                      </span>
                    </div>

                    {/* Canonical Answer Box */}
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Canonical Correct Answer:</span>
                      </div>
                      <div className="text-sm font-serif font-bold text-emerald-950 pl-5">
                        {q.correctAnswer || q.correctedSentence || 'Standard form'}
                      </div>
                    </div>

                    {/* Step-by-Step Grammatical Explanation */}
                    {q.explanation && (
                      <div className="text-xs text-[#292521] pl-2 border-l-2 border-[#5A1832]">
                        <span className="font-bold text-[#5A1832]">Grammatical Rationale: </span>
                        {q.explanation}
                      </div>
                    )}

                    {/* Acceptable Variations / Common Pitfalls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-[#EDE4D6] text-[#292521] border border-[#CBBEAC]">
                        <span className="font-semibold text-[#5A1832]">Acceptable Variations: </span>
                        Exact finite verb required; no auxiliary substitution permitted.
                      </div>
                      <div className="p-2 rounded bg-amber-50 text-amber-950 border border-amber-300">
                        <span className="font-semibold text-amber-900">Diagnostic Note: </span>
                        Watch for proximity confusion with preceding prepositional nouns.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#71685E] bg-[#FFFDF8] border border-[#CBBEAC] rounded-xl">
              No exercises configured for this chapter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
