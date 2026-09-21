// =============================================================
// VERITAS Editorial Platform — Teacher Edition Preview
// Section 18: Complete teacher edition with answers, rationales & traps
// =============================================================

import React, { useState } from 'react';
import {
  StudioChapter,
  StudioExercise,
} from '../../../types';
import {
  GraduationCap,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Filter,
  Award,
} from 'lucide-react';

interface ExerciseTeacherPreviewProps {
  chapter: StudioChapter;
}

export const ExerciseTeacherPreview: React.FC<ExerciseTeacherPreviewProps> = ({
  chapter,
}) => {
  const exercises = chapter.exercises || [];
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredExercises =
    selectedFilter === 'ALL'
      ? exercises
      : exercises.filter((e) => e.letter === selectedFilter);

  return (
    <div
      id="exercise-teacher-preview"
      className="flex-1 bg-[#EDE4D6] p-6 overflow-y-auto space-y-6 flex flex-col items-center"
    >
      {/* Control Bar */}
      <div className="w-full max-w-4xl bg-[#FAF7F2] p-4 rounded-lg border border-[#D4AF37]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#8C2435]" />
          <div>
            <h2 className="text-sm font-serif font-bold text-[#292521]">
              Teacher Edition Annotated Master Key
            </h2>
            <p className="text-[11px] font-serif text-[#7A6E5F]">
              Comprehensive answers, acceptable alternatives, grammar rationales, and classroom traps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#EDE4D6] px-2.5 py-1.5 rounded border border-[#D5C7B4] text-xs font-serif">
            <Filter className="w-3.5 h-3.5 text-[#615546]" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent font-bold text-[#292521] outline-none cursor-pointer"
            >
              <option value="ALL">All Exercises (A - {exercises[exercises.length - 1]?.letter || 'G'})</option>
              {exercises.map((e) => (
                <option key={e.id} value={e.letter}>
                  Exercise {e.letter}: {e.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#8C2435] text-white text-xs font-serif font-bold rounded hover:bg-[#721B2A] transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Guide
          </button>
        </div>
      </div>

      {/* Teacher Edition Master Sheet */}
      <div className="w-full max-w-4xl bg-[#FFFDF9] border-2 border-[#8C2435]/40 shadow-md rounded-lg p-8 sm:p-12 space-y-8 font-serif text-[#292521]">
        {/* Running Header */}
        <div className="border-b-2 border-[#8C2435] pb-3 flex items-center justify-between text-xs font-bold text-[#8C2435] uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            TEACHER'S RESOURCE MANUAL &bull; ANNOTATED EDITION
          </span>
          <span>{(chapter.curriculumBoard || chapter.systemId || 'CISCE').toUpperCase()} {(chapter.equivalentClass || 'Class 6').toUpperCase()} &bull; CHAPTER {chapter.chapterNumber || 1}</span>
        </div>

        {/* Chapter Title */}
        <div className="text-center py-2 space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#B8860B] font-bold">
            Pedagogical Master Key
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292521]">
            {chapter.title || 'Untitled Chapter'}
          </h1>
          <p className="text-xs text-[#615546] italic">
            Complete answer matrices, diagnostic remediation advice, and grading rubrics
          </p>
        </div>

        {/* Exercises */}
        <div className="space-y-10">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="space-y-4 border-b border-[#EADDC9] pb-8 last:border-b-0">
              {/* Exercise Header */}
              <div className="bg-[#FAF7F2] p-4 rounded border-l-4 border-[#8C2435] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded font-bold text-sm bg-[#8C2435] text-white flex items-center justify-center">
                      {ex.letter}
                    </span>
                    <h2 className="text-lg font-bold text-[#292521]">
                      Exercise {ex.letter}: {ex.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-[#EDE4D6] text-[#8C2435] rounded font-bold uppercase">
                      {ex.developmentalTier || 'PRACTICE'}
                    </span>
                    <span className="text-[#615546]">{ex.suggestedMarks || 5} Marks</span>
                  </div>
                </div>

                {ex.teacherNote && (
                  <div className="text-xs text-[#4A3F33] italic bg-[#FFFDF9] p-2.5 rounded border border-[#DDD0BC] flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold not-italic text-[#8C2435]">Pedagogical Note: </span>
                      {ex.teacherNote}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions with Full Teacher Annotations */}
              <div className="space-y-4 pt-1">
                {(ex.questions || []).map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="p-4 bg-[#FAF7F2] rounded border border-[#DDD0BC] space-y-3 text-xs leading-relaxed"
                  >
                    {/* Prompt row */}
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sm text-[#8C2435] shrink-0">
                        {qIndex + 1}.
                      </span>
                      <div className="flex-1 space-y-1">
                        <div className="font-medium text-sm text-[#292521]">
                          {q.prompt}
                        </div>
                        {(q.blanksSentence || q.originalSentence) && (
                          <div className="italic text-[#4A3F33] bg-[#FFFDF9] p-2 rounded border border-[#E3D7C5]">
                            "{q.blanksSentence || q.originalSentence}"
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[#7A6E5F] font-bold">
                        [{q.marks || 1} M]
                      </span>
                    </div>

                    {/* Answer Key Box */}
                    <div className="p-3 bg-[#EAF2DC] rounded border border-[#B2CE87] space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-[#2D5A27]">
                        <CheckCircle2 className="w-4 h-4 text-[#4D7C0F]" />
                        <span>MODEL ANSWER / PRIMARY KEY:</span>
                        <span className="text-sm font-serif font-bold ml-1 text-[#1F3D1A]">
                          {q.correctAnswer || q.modelAnswer}
                        </span>
                      </div>

                      {/* Acceptable Alternatives Callout */}
                      {q.acceptableAlternatives && q.acceptableAlternatives.length > 0 && (
                        <div className="text-[11px] text-[#2D5A27] bg-[#FFFDF9]/80 p-2 rounded border border-[#C6DC9E]">
                          <span className="font-bold">ACCEPTABLE ALTERNATIVES: </span>
                          <span>{q.acceptableAlternatives.join('  •  ')}</span>
                        </div>
                      )}

                      {/* Partial Credit breakdown if open-ended */}
                      {q.openEndedCriteria?.partialCreditBreakdown && (
                        <div className="text-[10px] text-[#4A6E1E] space-y-0.5 pt-1 border-t border-[#C6DC9E]/60">
                          <span className="font-bold uppercase tracking-wider">Partial Credit Scheme:</span>
                          {q.openEndedCriteria.partialCreditBreakdown.map((rule: any, rI: number) => (
                            <div key={rI} className="flex justify-between">
                              <span>&bull; {rule.condition}</span>
                              <span className="font-mono font-bold">[{rule.marks} M]</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Grammar Rationale */}
                    {q.grammarRationale && (
                      <div className="text-[11px] text-[#4A3F33] bg-[#FFFDF9] p-2.5 rounded border border-[#DDD0BC]">
                        <span className="font-bold text-[#8C2435]">Grammar Rationale: </span>
                        {q.grammarRationale}
                      </div>
                    )}

                    {/* Teaching Guidance / Student Feedback */}
                    {q.teacherGuidance && (
                      <div className="text-[11px] text-[#7A6E5F] italic flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          <strong>Common Misconception Alert:</strong> {q.teacherGuidance}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
