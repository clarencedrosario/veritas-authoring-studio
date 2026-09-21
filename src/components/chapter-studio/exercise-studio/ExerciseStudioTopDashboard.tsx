// =============================================================
// VERITAS Editorial Platform — Exercise Studio Top Dashboard
// Section 20: Compact editorial header with status and view toggles
// =============================================================

import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Table,
  BookOpen,
  GraduationCap,
  Plus,
  Layers,
  Send,
  HelpCircle,
  Clock,
  Award,
} from 'lucide-react';
import { StudioChapter } from '../../../types';
import { ExerciseQualityAuditResult } from '../../../utils/exerciseStudioDefaults';

export type ExerciseStudioActiveView =
  | 'authoring'
  | 'coverage_matrix'
  | 'student_preview'
  | 'teacher_preview';

interface ExerciseStudioTopDashboardProps {
  chapter: StudioChapter;
  activeView: ExerciseStudioActiveView;
  onSelectView: (view: ExerciseStudioActiveView) => void;
  onOpenAiGenerator: () => void;
  onOpenAuditModal: () => void;
  onOpenExportModal: () => void;
  onAddNewExercise: () => void;
  auditResult: ExerciseQualityAuditResult;
  coveragePercentage: number;
}

export const ExerciseStudioTopDashboard: React.FC<ExerciseStudioTopDashboardProps> = ({
  chapter,
  activeView,
  onSelectView,
  onOpenAiGenerator,
  onOpenAuditModal,
  onOpenExportModal,
  onAddNewExercise,
  auditResult,
  coveragePercentage,
}) => {
  const exercises = chapter.exercises || [];
  const totalQuestions = exercises.reduce((acc, ex) => acc + (ex.questions?.length || 0), 0);
  const totalMarks = exercises.reduce(
    (acc, ex) =>
      acc + (ex.suggestedMarks || ex.questions?.reduce((qAcc, q) => qAcc + (q.marks || 1), 0) || 0),
    0
  );

  const healthColor =
    auditResult.overallHealthScore >= 90
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : auditResult.overallHealthScore >= 75
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  return (
    <div
      id="exercise-studio-top-dashboard"
      className="bg-[#FAF7F2] border-b border-[#D8CBB9] px-6 py-4 transition-all"
    >
      {/* Upper row: Title, curriculum context, and high-impact action buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-serif font-bold uppercase tracking-wider bg-[#8C2435]/10 text-[#8C2435] border border-[#8C2435]/20 rounded">
              {chapter.curriculumBoard || chapter.systemId || 'CISCE'} {chapter.equivalentClass || 'Class 6'}
            </span>
            <span className="text-xs text-[#7A6E5F] font-serif">
              Chapter {chapter.chapterNumber || 1} &bull; Practice & Exercise Suite
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5A6E3F] bg-[#EAF2DC] px-2 py-0.5 rounded border border-[#C6DC9E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5A6E3F]"></span>
              Autosave Active
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#292521] tracking-tight">
            Exercise & Practice Production Studio
          </h1>
          <p className="text-sm text-[#615546] font-serif line-clamp-1">
            {chapter.title || 'Untitled Chapter'} &bull; Textbook sequence, answer intelligence & assessment pipeline
          </p>
        </div>

        {/* Global studio action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            id="btn-ai-exercise-generator"
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-serif font-bold text-[#FAF7F2] bg-gradient-to-r from-[#8C2435] to-[#6E1C2A] hover:from-[#751E2D] hover:to-[#591621] rounded shadow-sm transition-all"
            title="Generate textbook exercises from rules, visuals, or Bloom levels"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            AI Exercise Generator
          </button>

          <button
            id="btn-quality-audit"
            onClick={onOpenAuditModal}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold border rounded shadow-sm transition-all ${healthColor}`}
            title="Inspect 22-point pedagogical and editorial checks"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit ({auditResult.overallHealthScore}%)
          </button>

          <button
            id="btn-export-integrations"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-medium text-[#4A3F33] bg-[#EFE9DD] hover:bg-[#E4DCCE] border border-[#D5C7B4] rounded shadow-sm transition-all"
            title="Export to Question Bank, Interactive Quiz, or Assessment Builder"
          >
            <Send className="w-3.5 h-3.5 text-[#8C2435]" />
            Export & Send
          </button>

          <button
            id="btn-add-exercise"
            onClick={onAddNewExercise}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-serif font-bold text-[#8C2435] bg-[#F4EDE0] hover:bg-[#EBDDC8] border border-[#D4AF37]/50 rounded shadow-sm transition-all"
            title="Add a new exercise set (A-H+)"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Exercise
          </button>
        </div>
      </div>

      {/* Middle row: Live Chapter Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4 pt-3 border-t border-[#E3D8C8]">
        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Exercise Sets</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <Layers className="w-4 h-4 text-[#8C2435]" />
            {exercises.length} Sets
            <span className="text-xs font-normal text-[#7A6E5F] font-mono">
              ({exercises.map((e) => e.letter).join(',') || 'none'})
            </span>
          </div>
        </div>

        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Total Questions</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-[#8C2435]" />
            {totalQuestions} Items
          </div>
        </div>

        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Total Marks</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <Award className="w-4 h-4 text-[#B8860B]" />
            {totalMarks} Marks
          </div>
        </div>

        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Estimated Time</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#615546]" />
            {exercises.reduce((acc, ex) => acc + (ex.estimatedTimeMinutes || 12), 0)} min
          </div>
        </div>

        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Concept Coverage</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <Table className="w-4 h-4 text-[#3D6B58]" />
            {coveragePercentage}%
          </div>
        </div>

        <div className="bg-[#F3ECE0] px-3 py-2 rounded border border-[#DDD0BC]">
          <div className="text-[10px] font-serif uppercase tracking-wider text-[#7A6E5F]">Audit Health</div>
          <div className="text-base font-serif font-bold text-[#292521] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#8C2435]" />
            {auditResult.overallHealthScore}/100
          </div>
        </div>
      </div>

      {/* Bottom row: Primary View Selector Tabs */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#E3D8C8]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-serif font-bold text-[#615546] uppercase tracking-wider mr-2">
            Studio View:
          </span>

          <button
            id="tab-view-authoring"
            onClick={() => onSelectView('authoring')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-semibold rounded transition-all ${
              activeView === 'authoring'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-sm'
                : 'bg-[#EDE4D6] text-[#4A3F33] hover:bg-[#E3D7C5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Authoring Canvas (3-Column)
          </button>

          <button
            id="tab-view-coverage-matrix"
            onClick={() => onSelectView('coverage_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-semibold rounded transition-all ${
              activeView === 'coverage_matrix'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-sm'
                : 'bg-[#EDE4D6] text-[#4A3F33] hover:bg-[#E3D7C5]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Coverage Matrix ({coveragePercentage}%)
          </button>

          <button
            id="tab-view-student-preview"
            onClick={() => onSelectView('student_preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-semibold rounded transition-all ${
              activeView === 'student_preview'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-sm'
                : 'bg-[#EDE4D6] text-[#4A3F33] hover:bg-[#E3D7C5]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Student Edition Preview
          </button>

          <button
            id="tab-view-teacher-preview"
            onClick={() => onSelectView('teacher_preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif font-semibold rounded transition-all ${
              activeView === 'teacher_preview'
                ? 'bg-[#8C2435] text-[#FAF7F2] shadow-sm'
                : 'bg-[#EDE4D6] text-[#4A3F33] hover:bg-[#E3D7C5]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Teacher Edition Preview
          </button>
        </div>

        {/* Visual Studio shortcut indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-serif text-[#7A6E5F]">
          <span>Stimulus Link:</span>
          <span className="font-semibold text-[#8C2435] bg-[#F0E6D6] px-2 py-0.5 rounded border border-[#D5C5B0]">
            Figure 1.1 Linked (Ex F)
          </span>
        </div>
      </div>
    </div>
  );
};
