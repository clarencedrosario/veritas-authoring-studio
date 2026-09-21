import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  GraduationCap,
  RotateCcw,
  Plus,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ChapterComponentDefinition, ViewDisplayMode, ComponentStatus } from './types';
import { StudioChapter } from '../../../types';
import { getGradeGuidance, getBoardGuidance } from './gradeGuidance';

interface ChapterComponentShellProps {
  definition: ChapterComponentDefinition;
  chapter: StudioChapter;
  status: ComponentStatus;
  onStatusChange: (status: ComponentStatus) => void;
  viewMode: ViewDisplayMode;
  onViewModeChange: (mode: ViewDisplayMode) => void;
  onAiGenerate: () => void;
  isAiGenerating?: boolean;
  onClearContent: () => void;
  itemCount: number;
  wordCount: number;
  activeClassLevel?: string;
  activeBoard?: string;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export const ChapterComponentShell: React.FC<ChapterComponentShellProps> = ({
  definition,
  chapter,
  status,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onAiGenerate,
  isAiGenerating = false,
  onClearContent,
  itemCount,
  wordCount,
  activeClassLevel,
  activeBoard,
  isDarkMode = false,
  children,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Dynamic pedagogical guidance based on current book's class and board
  const chAny = chapter as any;
  const gradeInfo = getGradeGuidance(activeClassLevel || chAny.targetClass || chAny.classLevel);
  const boardInfo = getBoardGuidance(activeBoard || chAny.curriculumFramework || chAny.board);

  // Evaluate validation rules
  const validationResults = (definition.validationRules || []).map((rule) => ({
    rule,
    result: rule.check(chapter),
  }));

  const allValid = validationResults.every((vr) => vr.result.valid);

  const getStatusBadge = (s: ComponentStatus) => {
    switch (s) {
      case 'complete':
        return { label: 'Complete', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'needs_review':
        return { label: 'Needs Review', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'draft':
      case 'in_progress':
        return { label: 'In Progress', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { label: 'Not Started', bg: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const statusBadge = getStatusBadge(status);

  return (
    <div className="space-y-4">
      {/* 1. Component Shell Header */}
      <div className="bg-[#FAF7F2] dark:bg-[#1a110a] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#5A1832] text-white">
                COMP-{String(definition.componentNumber).padStart(2, '0')}
              </span>
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#2A1D13] text-[#5A1832] dark:text-[#E8A87C] uppercase tracking-wider">
                {definition.categoryLabel}
              </span>
              <span className="text-[11px] text-[#71685E] dark:text-[#b4a496]">
                Est. ~{definition.defaultEstimatedPages} pages
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#292521] dark:text-[#F6F0E7]">
              {definition.title}
            </h2>
            <p className="text-xs text-[#71685E] dark:text-[#b4a496] max-w-2xl leading-relaxed">
              {definition.description}
            </p>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#71685E]">Status:</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as ComponentStatus)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${statusBadge.bg}`}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress / Draft</option>
              <option value="complete">Complete</option>
              <option value="needs_review">Needs Review</option>
            </select>
          </div>
        </div>

        {/* 2. Grade & Board Guidance Bar */}
        <div className="mt-3 pt-3 border-t border-[#E8DED1] dark:border-[#3D2C1E] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded bg-white dark:bg-[#24170e] border border-[#D8C7B5] dark:border-[#3D2C1E] text-[#5A1832] dark:text-[#E8A87C]">
              <GraduationCap className="w-3.5 h-3.5" />
              {gradeInfo.classLevel} ({gradeInfo.bandLabel})
            </span>
            <span className="inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded bg-white dark:bg-[#24170e] border border-[#D8C7B5] dark:border-[#3D2C1E] text-[#9A7438]">
              <Award className="w-3.5 h-3.5" />
              {boardInfo.boardName}
            </span>
            <span className="text-[#71685E] dark:text-[#b4a496] italic line-clamp-1 max-w-md">
              &ldquo;{gradeInfo.pedagogicalFocus}&rdquo;
            </span>
          </div>

          <div className="text-[11px] text-[#71685E] flex items-center gap-3">
            <span>
              <strong>{itemCount}</strong> items
            </span>
            <span>
              <strong>~{wordCount}</strong> words
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action & View Modes Toolbar */}
      <div className="bg-[#FAF7F2] dark:bg-[#1a110a] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* View Switcher */}
        <div className="flex items-center bg-[#EDE4D6] dark:bg-[#25180f] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onViewModeChange('authoring')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'authoring'
                ? 'bg-white dark:bg-[#3D2C1E] text-[#5A1832] dark:text-[#F6F0E7] shadow-sm font-semibold'
                : 'text-[#71685E] dark:text-[#b4a496] hover:text-[#292521]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Authoring Workspace
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('student_preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'student_preview'
                ? 'bg-white dark:bg-[#3D2C1E] text-[#5A1832] dark:text-[#F6F0E7] shadow-sm font-semibold'
                : 'text-[#71685E] dark:text-[#b4a496] hover:text-[#292521]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Student Edition
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('teacher_preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'teacher_preview'
                ? 'bg-[#5A1832] text-white shadow-sm font-semibold'
                : 'text-[#71685E] dark:text-[#b4a496] hover:text-[#292521]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Teacher Annotated Edition
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAiGenerate}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9A7438] hover:bg-[#7D5E2D] text-white text-xs font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
            {isAiGenerating ? 'Generating...' : 'AI Assistant Draft'}
          </button>

          {showClearConfirm ? (
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1 rounded border border-rose-200">
              <span className="text-[11px] text-rose-700 px-1">Clear all?</span>
              <button
                type="button"
                onClick={() => {
                  onClearContent();
                  setShowClearConfirm(false);
                }}
                className="text-[11px] bg-rose-700 text-white px-2 py-0.5 rounded font-bold"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="text-[11px] text-gray-600 px-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 text-[#71685E] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Clear / Reset Component Content"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Child Content Workspace */}
      <div className="bg-white dark:bg-[#150d08] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl p-5 shadow-sm min-h-[400px]">
        {children}
      </div>

      {/* 5. Validation Checklist Footer */}
      <div className="bg-[#FAF7F2] dark:bg-[#1a110a] border border-[#D8C7B5] dark:border-[#3D2C1E] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${allValid ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
            Editorial Standards Checklist:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {validationResults.map((vr) => (
              <span
                key={vr.rule.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                  vr.result.valid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {vr.result.valid ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                )}
                {vr.rule.label}
              </span>
            ))}
          </div>
        </div>

        <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Auto-synchronized with chapter
        </span>
      </div>
    </div>
  );
};
