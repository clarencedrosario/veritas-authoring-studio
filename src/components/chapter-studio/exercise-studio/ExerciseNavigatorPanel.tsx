// =============================================================
// VERITAS Editorial Platform — Exercise Navigator Panel
// Section 24: Left column navigator for unlimited exercises (A-H+)
// =============================================================

import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudioExercise, ExerciseDevelopmentalTier } from '../../../types';

interface ExerciseNavigatorPanelProps {
  exercises: StudioExercise[];
  selectedExerciseId: string;
  onSelectExercise: (id: string) => void;
  onAddExercise: () => void;
  onDuplicateExercise: (id: string) => void;
  onDeleteExercise: (id: string) => void;
  onMoveExercise: (index: number, direction: 'up' | 'down') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAiGenerator: () => void;
}

const TIER_COLORS: Record<ExerciseDevelopmentalTier, { bg: string; text: string; border: string }> = {
  FOUNDATION: { bg: 'bg-[#EBF3E8]', text: 'text-[#2D5A27]', border: 'border-[#C2DFC0]' },
  PRACTICE: { bg: 'bg-[#EBF1F6]', text: 'text-[#1E4E79]', border: 'border-[#BCD3E6]' },
  APPLICATION: { bg: 'bg-[#FDF3E7]', text: 'text-[#8A5012]', border: 'border-[#F2D7B4]' },
  CHALLENGE: { bg: 'bg-[#FBEBEB]', text: 'text-[#8C2435]', border: 'border-[#ECC5CA]' },
  MASTERY: { bg: 'bg-[#F4EEF9]', text: 'text-[#5C2E7E]', border: 'border-[#DCC8EC]' },
};

export const ExerciseNavigatorPanel: React.FC<ExerciseNavigatorPanelProps> = ({
  exercises,
  selectedExerciseId,
  onSelectExercise,
  onAddExercise,
  onDuplicateExercise,
  onDeleteExercise,
  onMoveExercise,
  isCollapsed,
  onToggleCollapse,
  onOpenAiGenerator,
}) => {
  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#F6F0E7] border-r border-[#D8CBB9] flex flex-col items-center py-4 gap-4 transition-all">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#615546] hover:text-[#292521] hover:bg-[#EBE2D3] rounded transition-all"
          title="Expand Exercise Navigator"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-1.5 items-center w-full px-1">
          {exercises.map((ex) => {
            const isSelected = ex.id === selectedExerciseId;
            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(ex.id)}
                className={`w-8 h-8 rounded font-serif font-bold text-xs flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#8C2435] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#EDE4D6] text-[#4A3F33] hover:bg-[#E2D6C4]'
                }`}
                title={`Exercise ${ex.letter}: ${ex.title}`}
              >
                {ex.letter}
              </button>
            );
          })}
        </div>

        <button
          onClick={onAddExercise}
          className="p-1.5 text-[#8C2435] hover:bg-[#EBE2D3] rounded transition-all mt-auto"
          title="Add Exercise"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="exercise-navigator-panel"
      className="w-80 bg-[#F6F0E7] border-r border-[#D8CBB9] flex flex-col h-full select-none"
    >
      {/* Header with Title and Collapse toggle */}
      <div className="px-4 py-3 border-b border-[#D8CBB9] flex items-center justify-between bg-[#EFE8DC]">
        <div>
          <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-[#4A3F33]">
            Exercise Sequence
          </h2>
          <p className="text-[11px] font-serif text-[#7A6E5F]">
            {exercises.length} Sets &bull; A through {exercises[exercises.length - 1]?.letter || 'G'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onAddExercise}
            className="p-1 text-[#8C2435] hover:bg-[#DFD5C4] rounded transition-all"
            title="Add New Exercise Set"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-[#615546] hover:bg-[#DFD5C4] rounded transition-all"
            title="Collapse Navigator"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise list with reordering & tier badges */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {exercises.map((ex, index) => {
          const isSelected = ex.id === selectedExerciseId;
          const tier = (ex.developmentalTier || 'PRACTICE') as ExerciseDevelopmentalTier;
          const tierStyle = TIER_COLORS[tier] || TIER_COLORS.PRACTICE;
          const questionCount = ex.questions?.length || 0;
          const suggestedMarks =
            ex.suggestedMarks || ex.questions?.reduce((acc, q) => acc + (q.marks || 1), 0) || 0;

          return (
            <div
              key={ex.id}
              onClick={() => onSelectExercise(ex.id)}
              className={`group relative rounded border p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#FAF7F2] border-[#8C2435] shadow-sm ring-1 ring-[#8C2435]/30'
                  : 'bg-[#F2ECE1] border-[#DDD0BC] hover:bg-[#EBE2D3] hover:border-[#CDBFA9]'
              }`}
            >
              {/* Top row: Letter badge, title, and action icons */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded font-serif font-bold text-sm flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#8C2435] text-[#FAF7F2]'
                        : 'bg-[#E3D7C5] text-[#4A3F33] group-hover:bg-[#D5C6B1]'
                    }`}
                  >
                    {ex.letter}
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-serif font-bold line-clamp-1 ${
                        isSelected ? 'text-[#8C2435]' : 'text-[#292521]'
                      }`}
                    >
                      {ex.title}
                    </h3>
                    <div className="text-[11px] font-serif text-[#7A6E5F] capitalize">
                      {ex.progression?.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Reorder and management icons */}
                <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveExercise(index, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 hover:text-[#292521] disabled:opacity-20 rounded"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveExercise(index, 'down');
                    }}
                    disabled={index === exercises.length - 1}
                    className="p-1 hover:text-[#292521] disabled:opacity-20 rounded"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom row: Tier badge, Question count, Marks, and Status */}
              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E5DACB]/80 text-[11px]">
                <span
                  className={`px-2 py-0.5 font-serif font-semibold rounded text-[10px] uppercase tracking-wider border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}
                >
                  {tier}
                </span>

                <div className="flex items-center gap-2 text-[#615546] font-mono text-[11px]">
                  <span>{questionCount} Qs</span>
                  <span>&bull;</span>
                  <span>{suggestedMarks} M</span>
                  {ex.status === 'Approved' ? (
                    <span title="Approved"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></span>
                  ) : (
                    <span title={ex.status || 'Draft'}><AlertCircle className="w-3.5 h-3.5 text-amber-600" /></span>
                  )}
                </div>
              </div>

              {/* Visual stimulus tag if linked */}
              {ex.visualId && (
                <div className="mt-1.5 text-[10px] font-serif text-[#8C2435] flex items-center gap-1 font-semibold">
                  <span>Stimulus: {ex.visualFigureNumber || 'Figure 1.1'}</span>
                </div>
              )}

              {/* Context menu actions on hover */}
              <div className="absolute right-2 bottom-2 hidden group-hover:flex items-center gap-1 bg-[#F2ECE1] p-0.5 rounded border border-[#DDD0BC] shadow-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateExercise(ex.id);
                  }}
                  className="p-1 text-[#615546] hover:text-[#292521] hover:bg-[#E3D7C5] rounded"
                  title="Duplicate Exercise"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {exercises.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete Exercise ${ex.letter} and all its questions?`)) {
                        onDeleteExercise(ex.id);
                      }
                    }}
                    className="p-1 text-[#8C2435] hover:bg-[#ECC5CA] rounded"
                    title="Delete Exercise"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Action Bar */}
      <div className="p-3 border-t border-[#D8CBB9] bg-[#EFE8DC] space-y-2">
        <button
          onClick={onAddExercise}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-serif font-bold text-[#8C2435] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#D5C5B0] rounded shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Exercise ({String.fromCharCode(65 + exercises.length)})
        </button>

        <button
          onClick={onOpenAiGenerator}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-serif font-semibold text-[#5A4518] bg-[#FDF8EE] hover:bg-[#F5EAD4] border border-[#E3CD96] rounded transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
          AI Suggest Exercise Set
        </button>
      </div>
    </div>
  );
};
