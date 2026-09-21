import React, { useState } from 'react';
import {
  ArrowDown,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { MasterGrammarConcept, GrammarClassLevel, ProgressionStage } from '../../types';
import { PROGRESSION_META, ALL_CLASSES } from '../../utils/spiralMatrixData';

interface VerticalProgressionViewProps {
  masterConcepts: MasterGrammarConcept[];
  selectedConceptId?: string;
  selectedClass?: GrammarClassLevel;
  onSelectConcept?: (conceptId: string) => void;
  onSelectClass?: (cls: GrammarClassLevel) => void;
  isDarkMode?: boolean;
}

export const VerticalProgressionView: React.FC<VerticalProgressionViewProps> = ({
  masterConcepts,
  selectedConceptId = 'concept-concord',
  selectedClass = 'Class 6',
  onSelectConcept,
  onSelectClass,
  isDarkMode = false,
}) => {
  const [activeConceptId, setActiveConceptId] = useState<string>(selectedConceptId);

  const activeConcept = masterConcepts.find((c) => c.id === activeConceptId) || masterConcepts[0];

  const currentClassIndex = ALL_CLASSES.indexOf(selectedClass);
  const prevClass = currentClassIndex > 0 ? ALL_CLASSES[currentClassIndex - 1] : null;
  const nextClass = currentClassIndex < ALL_CLASSES.length - 1 ? ALL_CLASSES[currentClassIndex + 1] : null;

  const currentProgression = activeConcept?.progressionByStage?.[selectedClass];
  const prevProgression = prevClass ? activeConcept?.progressionByStage?.[prevClass] : null;
  const nextProgression = nextClass ? activeConcept?.progressionByStage?.[nextClass] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Concept Selector Rail */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#5A1832]/10 dark:bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#5A1832] dark:text-[#C29A52]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
              Vertical Spiral Progression
            </span>
            <h3 className="text-base font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
              Multi-Grade Concept Progression Architecture
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6]">Concept:</label>
          <select
            value={activeConceptId}
            onChange={(e) => {
              setActiveConceptId(e.target.value);
              if (onSelectConcept) onSelectConcept(e.target.value);
            }}
            className="text-xs font-semibold p-2 rounded-lg border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] focus:outline-none focus:ring-1 focus:ring-[#5A1832]"
          >
            {masterConcepts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.strand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Triad Inspection Panel: Previous vs Current vs Next Treatment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Previous Treatment */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/20 shadow-sm opacity-90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6]">
              Previous Treatment
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F0EBE0] dark:bg-[#1c1917]">
              {prevClass || 'Pre-School / Foundational'}
            </span>
          </div>
          {prevProgression ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${PROGRESSION_META[prevProgression.stage]?.bgClass} ${PROGRESSION_META[prevProgression.stage]?.colorClass}`}>
                  {PROGRESSION_META[prevProgression.stage]?.label} ({prevProgression.stage})
                </span>
              </div>
              <p className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                {prevProgression.outcome}
              </p>
              {prevProgression.depthNote && (
                <p className="text-[11px] italic text-[#71685E] dark:text-[#c9b9a6]">
                  Depth: {prevProgression.depthNote}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
              First exposure occurs in target grade or no prior formal curriculum entry.
            </p>
          )}
        </div>

        {/* Current Treatment (Highlighted) */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#262220] border-2 border-[#5A1832] dark:border-[#C29A52] shadow-md relative">
          <div className="absolute -top-2.5 right-4 bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#292521] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Current Book Focus
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
              Current Treatment
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#5A1832] text-white">
              {selectedClass}
            </span>
          </div>
          {currentProgression ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${PROGRESSION_META[currentProgression.stage]?.bgClass} ${PROGRESSION_META[currentProgression.stage]?.colorClass} border ${PROGRESSION_META[currentProgression.stage]?.borderClass}`}>
                  {PROGRESSION_META[currentProgression.stage]?.label} ({currentProgression.stage})
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Core Target
                </span>
              </div>
              <p className="text-xs font-medium text-[#292521] dark:text-[#F6F0E7]">
                {currentProgression.outcome}
              </p>
              {currentProgression.depthNote && (
                <p className="text-[11px] font-semibold text-[#5A1832] dark:text-[#C29A52]">
                  Target Depth: {currentProgression.depthNote}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
              No progression record for {selectedClass}.
            </p>
          )}
        </div>

        {/* Next Treatment */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/20 shadow-sm opacity-90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6]">
              Next Treatment
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F0EBE0] dark:bg-[#1c1917]">
              {nextClass || 'Senior Leaving Standard'}
            </span>
          </div>
          {nextProgression ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${PROGRESSION_META[nextProgression.stage]?.bgClass} ${PROGRESSION_META[nextProgression.stage]?.colorClass}`}>
                  {PROGRESSION_META[nextProgression.stage]?.label} ({nextProgression.stage})
                </span>
              </div>
              <p className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                {nextProgression.outcome}
              </p>
              {nextProgression.depthNote && (
                <p className="text-[11px] italic text-[#71685E] dark:text-[#c9b9a6]">
                  Depth: {nextProgression.depthNote}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] italic">
              Terminal mastery achieved; applies across general prose without further discrete progression.
            </p>
          )}
        </div>
      </div>

      {/* Complete Vertical Cascade */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-[#5A1832] dark:text-[#C29A52]">
              Complete Series Vertical Progression: {activeConcept.name}
            </h4>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              Trace conceptual evolution from foundational introduction through secondary board examination mastery.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
            <Info className="w-3.5 h-3.5" />
            <span>Editorial demonstration values clearly labeled unless verified against board documentation.</span>
          </div>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#C29A52]/30">
          {ALL_CLASSES.map((cls, idx) => {
            const prog = activeConcept?.progressionByStage?.[cls];
            const isCurrentClass = cls === selectedClass;
            const stage = prog?.stage || 'none';
            const meta = PROGRESSION_META[stage];

            return (
              <div key={cls} className="relative group">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 transition ${
                    isCurrentClass
                      ? 'bg-[#5A1832] border-[#C29A52] scale-125'
                      : 'bg-white dark:bg-[#1c1917] border-[#C29A52]/60 group-hover:border-[#5A1832]'
                  }`}
                />

                <div
                  onClick={() => onSelectClass && onSelectClass(cls)}
                  className={`p-3.5 rounded-lg border transition cursor-pointer ${
                    isCurrentClass
                      ? 'bg-[#FAF8F5] dark:bg-[#262220] border-[#5A1832] dark:border-[#C29A52] shadow-sm'
                      : 'bg-white dark:bg-[#1c1917] border-[#C29A52]/20 hover:border-[#C29A52]/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                        {cls}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta?.bgClass} ${meta?.colorClass} ${meta?.borderClass}`}>
                        {meta?.label} ({stage})
                      </span>
                      {isCurrentClass && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#5A1832] text-white">
                          ACTIVE WORKING BOOK
                        </span>
                      )}
                    </div>
                    {prog?.depthNote && (
                      <span className="text-[11px] font-medium text-[#71685E] dark:text-[#c9b9a6] italic">
                        {prog.depthNote}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#292521] dark:text-[#F6F0E7]">
                    {prog?.outcome || 'Concept is not formally scheduled in this class scope.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
