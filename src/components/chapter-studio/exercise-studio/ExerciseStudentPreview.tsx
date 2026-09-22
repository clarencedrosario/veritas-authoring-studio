// =============================================================
// VERITAS Editorial Platform — Student Edition Preview
// Section 17: Authentic primary textbook print layout simulation
// =============================================================

import React, { useState } from 'react';
import {
  StudioChapter,
  StudioExercise,
} from '../../../types';
import {
  BookOpen,
  Printer,
  Download,
  Filter,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface ExerciseStudentPreviewProps {
  chapter: StudioChapter;
  onOpenVisualStudio?: (visualId?: string) => void;
}

export const ExerciseStudentPreview: React.FC<ExerciseStudentPreviewProps> = ({
  chapter,
  onOpenVisualStudio,
}) => {
  const exercises = chapter.exercises || [];
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredExercises =
    selectedFilter === 'ALL'
      ? exercises
      : exercises.filter((e) => e.letter === selectedFilter);

  return (
    <div
      id="exercise-student-preview"
      className="flex-1 bg-[#ECE3D4] p-6 overflow-y-auto space-y-6 flex flex-col items-center"
    >
      {/* Control Bar */}
      <div className="w-full max-w-4xl bg-[#FAF7F2] p-4 rounded-lg border border-[#D8CBB9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#8C2435]" />
          <div>
            <h2 className="text-sm font-serif font-bold text-[#292521]">
              Student Edition Simulated Textbook Layout
            </h2>
            <p className="text-[11px] font-serif text-[#7A6E5F]">
              Parchment print layout &bull; No answers shown &bull; Grade 3 pedagogical typesetting
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
            Print Preview
          </button>
        </div>
      </div>

      {/* Simulated Authentic Textbook Page */}
      <div className="w-full max-w-4xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-md rounded-lg p-8 sm:p-12 space-y-8 font-serif text-[#292521]">
        {/* Running Book Header */}
        <div className="border-b-2 border-[#8C2435] pb-3 flex items-center justify-between text-xs text-[#7A6E5F] uppercase tracking-widest font-bold">
          <span>{chapter.curriculumBoard || chapter.systemId || 'CURRICULUM'} &bull; {chapter.subject || 'ACADEMIC COURSE'} &bull; {chapter.equivalentClass || 'CLASS 6'}</span>
          <span>CHAPTER {chapter.chapterNumber || 1} &bull; PRACTICE EXERCISES</span>
        </div>

        {/* Chapter Title Banner */}
        <div className="text-center py-2 space-y-1">
          <div className="text-xs uppercase tracking-widest text-[#8C2435] font-bold">
            Practice Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292521]">
            {chapter.title}
          </h1>
          <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {/* Exercises */}
        <div className="space-y-10">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="space-y-4 border-b border-[#EADDC9] pb-8 last:border-b-0">
              {/* Exercise Header */}
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#8C2435]">
                    Exercise {ex.letter}.
                  </h2>
                  <h3 className="text-base sm:text-lg font-bold text-[#292521]">
                    {ex.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-[#7A6E5F] ml-auto">
                    [{ex.suggestedMarks || 5} Marks]
                  </span>
                </div>

                {/* Instructions */}
                <p className="text-sm italic text-[#4A3F33] bg-[#FAF7F2] p-3 rounded border border-[#E8DFC8] leading-relaxed">
                  <span className="font-bold not-italic text-[#8C2435]">Instruction: </span>
                  {ex.instructions}
                </p>
              </div>

              {/* Linked Visual Artwork Stimulus (Exercise F) */}
              {ex.visualId && (
                <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#D4AF37]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C2435]">
                      Visual Stimulus: {ex.visualFigureNumber || 'Figure 1.1'}
                    </span>
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio(ex.visualId)}
                        className="text-[11px] text-[#8C2435] hover:underline font-bold"
                      >
                        Inspect Figure Details &rarr;
                      </button>
                    )}
                  </div>
                  <div className="border border-[#DDD0BC] rounded p-4 bg-[#FFFDF9] text-center space-y-2">
                    <div className="font-bold text-sm text-[#292521]">
                      [{ex.visualFigureNumber || 'Figure 1.1'}: {ex.visualCaption || 'Grammar Visual Stimulus'}]
                    </div>
                    {ex.visualDescription && (
                      <p className="text-xs text-[#615546] max-w-xl mx-auto italic">
                        {ex.visualDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4 pt-2">
                {(ex.questions || []).map((q, qIndex) => (
                  <div key={q.id} className="space-y-2 text-sm leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#8C2435] shrink-0">{qIndex + 1}.</span>
                      <div className="flex-1 space-y-2">
                        <div className="text-[#292521] font-medium whitespace-pre-line">
                          {q.prompt}
                        </div>

                        {/* Blanks or Sentence context */}
                        {(q.blanksSentence || q.originalSentence) && (
                          <div className="p-2.5 bg-[#FAF7F2] rounded border border-[#DDD0BC] font-serif text-[#292521] italic">
                            "{q.blanksSentence || q.originalSentence}"
                          </div>
                        )}

                        {/* MCQ Options formatted for print */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-center gap-2 p-1.5 text-xs text-[#292521]"
                              >
                                <span className="w-3.5 h-3.5 rounded-full border border-[#7A6E5F] shrink-0"></span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Answer write-in lines for student handwriting */}
                        {(q.type === 'rewrite_sentence' ||
                          q.type === 'open_ended' ||
                          q.type === 'identify_underline' ||
                          q.type === 'error_correction' ||
                          q.type === 'visual_picture') && (
                          <div className="pt-2 space-y-2">
                            <div className="text-[11px] text-[#7A6E5F] font-bold uppercase tracking-wider">
                              Ans:
                            </div>
                            <div className="border-b border-dotted border-[#7A6E5F] h-6 w-full"></div>
                            {q.type === 'open_ended' && (
                              <div className="border-b border-dotted border-[#7A6E5F] h-6 w-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Running Book Footer */}
        <div className="border-t border-[#D8CBB9] pt-4 flex items-center justify-between text-xs text-[#7A6E5F] font-serif">
          <span>VERITAS Press &bull; Academic Publishing Division</span>
          <span>Page 18</span>
        </div>
      </div>
    </div>
  );
};
