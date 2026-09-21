import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  X,
  ShieldAlert,
} from 'lucide-react';
import { BoardQuestionBlueprint, GrammarClassLevel } from '../../types';

interface CrossAssemblyWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectedBlueprint: BoardQuestionBlueprint;
  activeBookBoard: string;
  activeBookClass: GrammarClassLevel;
  activeBookTitle: string;
  onAdaptAndAssemble: () => void;
  onSwitchContextAndAssemble: () => void;
  onSaveStandalone: () => void;
}

export const CrossAssemblyWarningModal: React.FC<CrossAssemblyWarningModalProps> = ({
  isOpen,
  onClose,
  inspectedBlueprint,
  activeBookBoard,
  activeBookClass,
  activeBookTitle,
  onAdaptAndAssemble,
  onSwitchContextAndAssemble,
  onSaveStandalone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] dark:bg-[#1E141B] border-2 border-[#8C6D3B]/40 dark:border-[#C29A52]/40 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Warning Header */}
        <div className="bg-gradient-to-r from-[#5A1832] to-[#35101F] text-[#F6F0E7] p-5 flex items-center justify-between border-b border-[#8C6D3B]/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold tracking-tight">
                Cross-System / Cross-Level Assembly Warning
              </h2>
              <p className="text-xs text-[#EDE4D6]/80">
                Contextual Integrity Check: Destination and Blueprint Mismatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#EDE4D6]/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Inspected Model */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider">
                Inspected Blueprint Model
              </span>
              <div className="font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                {inspectedBlueprint.board} • {inspectedBlueprint.targetClass}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                {inspectedBlueprint.title}
              </p>
              <div className="text-[11px] font-mono text-stone-500 pt-1">
                Marks: {inspectedBlueprint.totalMarks}m • Duration: {inspectedBlueprint.totalDurationMinutes}m
              </div>
            </div>

            {/* Active Destination */}
            <div className="p-3.5 rounded-xl bg-[#5A1832]/10 border border-[#5A1832]/30 dark:bg-[#C29A52]/10 dark:border-[#C29A52]/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#5A1832] dark:text-[#C29A52] tracking-wider">
                Active Destination Book
              </span>
              <div className="font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                {activeBookBoard} • {activeBookClass}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2">
                {activeBookTitle}
              </p>
              <div className="text-[11px] font-mono text-stone-500 pt-1">
                Target Curriculum: {activeBookBoard} Standard
              </div>
            </div>
          </div>

          {/* Explanation Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 leading-relaxed flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">
                Curricular Progression Protection
              </strong>
              You are currently inspecting an assessment blueprint for{' '}
              <strong>{inspectedBlueprint.board} ({inspectedBlueprint.targetClass})</strong>, but your active authoring destination is{' '}
              <strong>{activeBookBoard} ({activeBookClass})</strong>. Never silently copy requirements from one board or level into another without conscious pedagogical adaptation.
            </div>
          </div>

          {/* User Action Choices */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 tracking-wide uppercase font-mono block">
              Choose Assembly Resolution:
            </span>

            {/* Option 1: Adapt to Active Book */}
            <button
              onClick={() => {
                onClose();
                onAdaptAndAssemble();
              }}
              className="w-full p-3 rounded-xl border border-[#8C6D3B]/30 hover:border-[#8C6D3B] bg-white dark:bg-slate-900 hover:bg-[#F6F0E7] dark:hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Adapt Blueprint to Active Book ({activeBookBoard} {activeBookClass})</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Transfers an adapted version with question types and marks calibrated to {activeBookBoard} {activeBookClass} learning outcomes.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#5A1832] dark:group-hover:text-[#C29A52] shrink-0" />
            </button>

            {/* Option 2: Switch Context and Assemble */}
            <button
              onClick={() => {
                onClose();
                onSwitchContextAndAssemble();
              }}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-slate-800 hover:border-stone-400 bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>Switch Destination to {inspectedBlueprint.targetClass} Book</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Changes your active book selection in the project to {inspectedBlueprint.targetClass} and assembles directly into that level.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0" />
            </button>

            {/* Option 3: Save Standalone Assessment */}
            <button
              onClick={() => {
                onClose();
                onSaveStandalone();
              }}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-slate-800 hover:border-stone-400 bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-bold text-stone-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>Create Standalone Assessment Paper</span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Saves this test paper to the project's assessment library without writing into the active book chapter.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel Assembly
          </button>
        </div>
      </div>
    </div>
  );
};
