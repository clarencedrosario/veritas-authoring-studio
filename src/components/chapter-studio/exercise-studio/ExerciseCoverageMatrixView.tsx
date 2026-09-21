// =============================================================
// VERITAS Editorial Platform — Exercise Coverage Matrix View
// Section 12: Visual concept-to-exercise coverage heatmap & gap analysis
// =============================================================

import React, { useState } from 'react';
import {
  StudioChapter,
  StudioExercise,
  ExerciseCoverageCell,
} from '../../../types';
import {
  buildExerciseCoverageMatrix,
  ChapterCoverageMatrixResult,
} from '../../../utils/exerciseStudioDefaults';
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
  Info,
} from 'lucide-react';

interface ExerciseCoverageMatrixViewProps {
  chapter: StudioChapter;
  onSelectExercise: (exerciseId: string) => void;
  onOpenAiGeneratorForUncovered: (concept: string) => void;
}

const COVERAGE_STYLES: Record<
  string,
  { bg: string; text: string; label: string; border: string }
> = {
  none: { bg: 'bg-[#F2ECE1]/50', text: 'text-[#9C8F7E]', label: 'None', border: 'border-[#DDD0BC]/60' },
  introduced: { bg: 'bg-[#EBF1F6]', text: 'text-[#1E4E79]', label: 'Intro', border: 'border-[#BCD3E6]' },
  practised: { bg: 'bg-[#EBF3E8]', text: 'text-[#2D5A27]', label: 'Practised', border: 'border-[#C2DFC0]' },
  applied: { bg: 'bg-[#FDF3E7]', text: 'text-[#8A5012]', label: 'Applied', border: 'border-[#F2D7B4]' },
  mastered: { bg: 'bg-[#F4EEF9]', text: 'text-[#5C2E7E]', label: 'Mastered', border: 'border-[#DCC8EC]' },
};

export const ExerciseCoverageMatrixView: React.FC<ExerciseCoverageMatrixViewProps> = ({
  chapter,
  onSelectExercise,
  onOpenAiGeneratorForUncovered,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const matrixData: ChapterCoverageMatrixResult = buildExerciseCoverageMatrix(chapter);
  const exercises = chapter.exercises || [];

  return (
    <div
      id="exercise-coverage-matrix-view"
      className="flex-1 bg-[#FAF7F2] p-6 overflow-y-auto space-y-6"
    >
      {/* Matrix Header Banner */}
      <div className="bg-[#F6F0E7] p-5 rounded-lg border border-[#D8CBB9] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Table className="w-5 h-5 text-[#8C2435]" />
            <h2 className="text-lg font-serif font-bold text-[#292521]">
              Curriculum & Concept Coverage Matrix
            </h2>
          </div>
          <p className="text-xs font-serif text-[#615546]">
            Cross-reference chapter rules and learning objectives against exercise sets A through {exercises[exercises.length - 1]?.letter || 'G'}.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-serif">
          <div className="bg-[#FAF7F2] px-3 py-2 rounded border border-[#DDD0BC] text-center">
            <div className="text-[10px] text-[#7A6E5F] uppercase tracking-wider">Overall Coverage</div>
            <div className="text-base font-bold text-[#2D5A27]">{matrixData.coveragePercentage}%</div>
          </div>

          <div className="bg-[#FAF7F2] px-3 py-2 rounded border border-[#DDD0BC] text-center">
            <div className="text-[10px] text-[#7A6E5F] uppercase tracking-wider">Uncovered Rules</div>
            <div className="text-base font-bold text-[#8C2435]">{matrixData.uncoveredConcepts.length}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center flex-wrap gap-2 text-xs font-serif bg-[#F4EFE6] px-4 py-2.5 rounded border border-[#DDD0BC]">
        <span className="font-bold text-[#615546] mr-2">Coverage Level:</span>
        {Object.entries(COVERAGE_STYLES).map(([key, style]) => (
          <div
            key={key}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
          >
            {style.label}
          </div>
        ))}
      </div>

      {/* Interactive Table Matrix */}
      <div className="overflow-x-auto rounded-lg border border-[#D8CBB9] bg-[#FAF7F2] shadow-xs">
        <table className="w-full text-left text-xs font-serif border-collapse">
          <thead>
            <tr className="bg-[#EFE8DC] border-b border-[#D8CBB9] text-[#4A3F33]">
              <th className="p-3 font-bold sticky left-0 bg-[#EFE8DC] z-10 min-w-[240px] border-r border-[#D8CBB9]">
                Core Chapter Concept / Rule
              </th>
              {matrixData.exercises.map((ex) => (
                <th
                  key={ex.letter}
                  className="p-3 font-bold text-center border-r border-[#D8CBB9] min-w-[110px]"
                >
                  <div className="text-[#8C2435] font-bold">Ex {ex.letter}</div>
                  <div className="text-[10px] text-[#7A6E5F] truncate max-w-[100px] mx-auto font-normal">
                    {ex.title}
                  </div>
                  <div className="text-[9px] uppercase font-mono text-[#4A3F33]/70">
                    {ex.tier}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5DACB]">
            {matrixData.concepts.map((concept, rIdx) => {
              const isSelected = selectedConcept === concept;
              const matchingCells = matrixData.cells.filter((c) => c.concept === concept);

              return (
                <tr
                  key={rIdx}
                  onClick={() => setSelectedConcept(isSelected ? null : concept)}
                  className={`hover:bg-[#F2ECE1] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F2ECE1]/80' : ''
                  }`}
                >
                  <td className="p-3 font-semibold text-[#292521] sticky left-0 bg-[#FAF7F2] border-r border-[#D8CBB9] shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-2">{concept}</span>
                      {matchingCells.every((c) => c.coverageLevel === 'none') && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                          Gap
                        </span>
                      )}
                    </div>
                  </td>

                  {matrixData.exercises.map((ex) => {
                    const cell = matchingCells.find((c) => c.exerciseLetter === ex.letter);
                    const level = cell?.coverageLevel || 'none';
                    const style = COVERAGE_STYLES[level];
                    const qCount = cell?.questionCount || 0;

                    return (
                      <td
                        key={ex.letter}
                        className="p-2.5 text-center border-r border-[#D8CBB9] align-middle"
                      >
                        <div
                          className={`px-2 py-1.5 rounded text-[11px] font-semibold border inline-flex items-center justify-center gap-1 min-w-[70px] ${style.bg} ${style.text} ${style.border}`}
                        >
                          {qCount > 0 ? (
                            <>
                              <span>{qCount} Q</span>
                              <span className="text-[9px] opacity-80">({style.label})</span>
                            </>
                          ) : (
                            <span className="text-[10px] opacity-40">&mdash;</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Uncovered Concepts Callout & Remediation */}
      {matrixData.uncoveredConcepts.length > 0 && (
        <div className="p-4 bg-[#FBEBEB] rounded-lg border border-[#ECC5CA] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#8C2435]">
            <AlertTriangle className="w-4 h-4" />
            Curriculum Gaps Detected ({matrixData.uncoveredConcepts.length} Concept(s) without Exercises)
          </div>
          <p className="text-xs text-[#615546]">
            The following concepts are introduced in the manuscript but currently lack dedicated practice items in the exercise sequence:
          </p>

          <div className="flex flex-wrap gap-2">
            {matrixData.uncoveredConcepts.map((gapConcept, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1.5 rounded border border-[#D8CBB9] text-xs"
              >
                <span className="font-semibold text-[#292521]">{gapConcept}</span>
                <button
                  onClick={() => onOpenAiGeneratorForUncovered(gapConcept)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#8C2435] hover:underline"
                >
                  <Sparkles className="w-3 h-3 text-[#B8860B]" />
                  Generate Exercise
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
