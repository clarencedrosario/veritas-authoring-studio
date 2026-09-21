import React from 'react';
import {
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Scale,
  Compass,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { CurriculumSystemId, BoardQuestionBlueprint } from '../../types';
import {
  EDUCATION_SYSTEMS,
  SYSTEM_ASSESSMENT_PROFILES,
  DEMO_CBSE_CLASS6_BLUEPRINT,
} from '../../utils/boardBlueprintIntelligenceData';

interface SystemLandingViewProps {
  selectedSystemId: CurriculumSystemId;
  onSelectSystem: (systemId: CurriculumSystemId) => void;
  onSelectBlueprint: (blueprintId: string) => void;
  onSelectSystemLevel?: (
    systemId: CurriculumSystemId,
    levelId: string,
    levelLabel: string,
    programme?: string
  ) => void;
  allBlueprints: BoardQuestionBlueprint[];
  onOpenDesigner: () => void;
  onOpenComparison: () => void;
}

export const SystemLandingView: React.FC<SystemLandingViewProps> = ({
  selectedSystemId,
  onSelectSystem,
  onSelectBlueprint,
  onSelectSystemLevel,
  allBlueprints,
  onOpenDesigner,
  onOpenComparison,
}) => {
  const systems: CurriculumSystemId[] = ['CBSE', 'CISCE', 'Cambridge'];

  return (
    <div id="blueprint-system-landing" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Compact Professional Header (Reduced Vertical Height) */}
      <div className="bg-gradient-to-r from-[#35101F] to-[#5A1832] text-white rounded-xl px-5 py-3.5 shadow-sm border border-[#8C6D3B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-[#F6F0E7] tracking-tight">
              Assessment Intelligence
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C29A52]/25 text-[#EDE4D6] border border-[#C29A52]/40 font-semibold uppercase">
              Publishing Framework
            </span>
          </div>
          <p className="text-xs text-[#EDE4D6]/85 font-sans leading-normal">
            Design, compare and audit assessment structures across publishing systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenComparison}
            className="px-3 py-1.5 rounded-lg bg-[#C29A52] hover:bg-[#9A7438] text-[#1e0f18] text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Three-System Comparison</span>
          </button>
          <button
            onClick={() => onSelectBlueprint('cbse_class6_grammar_writing_demo')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
            <span>CBSE Class 6 Reference Model</span>
          </button>
        </div>
      </div>

      {/* THREE EDUCATION SYSTEM LANDING CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
            <h2 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
              Education Systems &amp; Assessment Contexts
            </h2>
          </div>
          <span className="text-xs text-[#71685E] dark:text-[#c9b9a6] font-mono">
            3 Systems Active · Independent Policy Profiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {systems.map((sysId) => {
            const config = EDUCATION_SYSTEMS[sysId];
            const isSelected = selectedSystemId === sysId;

            // Find blueprints for this system
            const systemBlueprints = allBlueprints.filter((b) => {
              if (sysId === 'CBSE') return b.board === 'CBSE';
              if (sysId === 'CISCE') return b.board === 'ICSE';
              if (sysId === 'Cambridge')
                return b.board === 'Cambridge_Checkpoint' || b.board === 'Cambridge_IGCSE';
              return false;
            });

            const verifiedCount = systemBlueprints.filter((b) => b.verificationStatus === 'VERIFIED').length;
            const editorialCount = systemBlueprints.filter(
              (b) => b.verificationStatus === 'EDITORIAL MODEL' || b.isEditorialModel
            ).length;

            return (
              <div
                key={sysId}
                className={`rounded-2xl border transition-all flex flex-col justify-between bg-white dark:bg-[#1e0f18] p-5 shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#5A1832] dark:border-[#C29A52] ring-2 ring-[#5A1832]/20 dark:ring-[#C29A52]/20'
                    : 'border-[#CBBEAC] dark:border-[#4d2b3b]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832]">
                        {config.shortName}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1.5">
                        {config.fullName}
                      </h3>
                      <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                        {config.governingBody} · {config.headquarters}
                      </p>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#1e0f18]'
                          : 'bg-[#EDE4D6] dark:bg-[#2b1622] text-[#5A1832] dark:text-[#C29A52]'
                      }`}
                    >
                      {sysId === 'CBSE' ? 'IN-CBSE' : sysId === 'CISCE' ? 'IN-ICSE' : 'UK-CAIE'}
                    </div>
                  </div>

                  {/* Grammar Philosophy */}
                  <div className="p-3 rounded-xl bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 border border-[#CBBEAC]/70 dark:border-[#4d2b3b]/70 text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                    <strong className="font-semibold block text-[11px] text-[#5A1832] dark:text-[#C29A52] mb-1 uppercase tracking-wider font-mono">
                      Assessment Philosophy
                    </strong>
                    {config.primaryGrammarPhilosophy}
                  </div>

                  {/* Level Terminology Continuum */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] tracking-wider block">
                      Programmes &amp; Stages ({config.levels.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {config.levels.map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectSystemLevel) {
                              onSelectSystemLevel(sysId, lvl.id, lvl.label, lvl.programme);
                            } else {
                              onSelectSystem(sysId);
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border text-left transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                            lvl.isBoardExamLevel
                              ? 'bg-[#5A1832]/10 border-[#5A1832]/30 text-[#5A1832] dark:bg-[#C29A52]/15 dark:border-[#C29A52]/40 dark:text-[#C29A52] font-semibold hover:bg-[#5A1832]/20'
                              : 'bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-stone-200 dark:border-slate-700 text-stone-600 dark:text-slate-300'
                          }`}
                          title={`${lvl.notes || lvl.label} · Click to inspect or configure blueprint`}
                        >
                          {lvl.label} {lvl.isBoardExamLevel ? '★' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Status Summary */}
                  <div className="pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{verifiedCount} Verified Specs</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 font-medium">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{editorialCount} Editorial Models</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#CBBEAC]/40 dark:border-[#4d2b3b]/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectSystem(sysId);
                      if (systemBlueprints[0]) {
                        onSelectBlueprint(systemBlueprints[0].id);
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#5A1832] text-white hover:bg-[#35101F] dark:bg-[#C29A52] dark:text-[#1e0f18]'
                        : 'bg-[#EDE4D6] hover:bg-[#CBBEAC] text-[#292521] dark:bg-[#2b1622] dark:hover:bg-[#35101F] dark:text-[#F6F0E7]'
                    }`}
                  >
                    <span>{isSelected ? 'Active System Workspace' : `Select ${config.shortName}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REFERENCE BLUEPRINT MODEL: CBSE CLASS 6 SUBJECT-VERB CONCORD */}
      <div className="rounded-2xl border-2 border-[#C29A52] bg-[#F6F0E7] dark:bg-[#2b1622] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
              06
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  {DEMO_CBSE_CLASS6_BLUEPRINT.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                  EDITORIAL MODEL · SCHOOL-BASED PROGRESSION
                </span>
              </div>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                Centralized around <strong>Chapter 6: Subject–Verb Concord</strong>. Demonstrates middle-school assessment architecture bridging to secondary CBSE examinations.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                onSelectSystem('CBSE');
                onSelectBlueprint('cbse_class6_grammar_writing_demo');
                onOpenDesigner();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] dark:bg-[#C29A52] dark:hover:bg-[#9A7438] text-white dark:text-[#1e0f18] text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Blueprint Designer</span>
            </button>
          </div>
        </div>

        {/* Section Structure Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(DEMO_CBSE_CLASS6_BLUEPRINT.sections || []).map((sec) => (
            <div
              key={sec.id}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1e0f18] border border-[#CBBEAC] dark:border-[#4d2b3b] space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#292521] dark:text-[#F6F0E7]">
                <span>{sec.sectionCode}: {sec.title}</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] font-mono text-[11px]">
                  {sec.totalMarks} Marks
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-2">
                {sec.instructions}
              </p>
              <div className="text-[10px] text-stone-500 dark:text-slate-400 font-mono pt-1 border-t border-[#CBBEAC]/40 dark:border-[#4d2b3b]/40">
                {sec.questionGroups.length} Question Groups · {sec.questionGroups.map((g) => g.groupCode).join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* Academic Notice on Integrity */}
        <div className="flex items-start space-x-2 text-[11px] text-[#71685E] dark:text-[#c9b9a6] pt-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Academic Integrity Notice:</strong> CBSE does not administer external public board examinations at Class 6. This blueprint is an <em>EDITORIAL MODEL</em> designed by the VERITAS Academic Board to scaffold learning outcomes from elementary to secondary assessment benchmarks without fabricating official board gazettes.
          </span>
        </div>
      </div>
    </div>
  );
};
