import React, { useState } from 'react';
import {
  Sparkles,
  Baby,
  Smile,
  Eye,
  Volume2,
  BookOpen,
  CheckCircle2,
  Layers,
  Heart,
  Lightbulb,
} from 'lucide-react';
import { EARLY_YEARS_PEDAGOGICAL_MODELS } from '../../utils/curriculumIntelligenceData';

export const EarlyYearsArchitectureView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'Kindergarten' | 'Class 1' | 'Class 2'>(
    'Kindergarten'
  );

  const activeModel =
    EARLY_YEARS_PEDAGOGICAL_MODELS.find((m) => m.level === selectedLevel) ||
    EARLY_YEARS_PEDAGOGICAL_MODELS[0];

  return (
    <div className="space-y-6">
      {/* Early Years Architecture Banner */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-[#FDFBF7] dark:bg-[#141517] shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
          <Baby className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
          <span>Early Years Foundation Stage (Ages 4–8)</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
          Developmentally Differentiated Early-Years Pedagogy
        </h2>
        <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] max-w-3xl leading-relaxed">
          The <em>Grammar in Action: Complete K–12 English Series</em> integrates foundational early childhood development without forcing Kindergarten, Class 1, and Class 2 into the abstract rule memorization or formal exam models of Classes 3–12. Instead, foundational grammar is acquired naturally through oral immersion, high-engagement picture spreads, auditory rhythm, and playful physical gestures.
        </p>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex items-center space-x-3 border-b border-[#E6DEC9] dark:border-[#28292D] pb-3">
        {EARLY_YEARS_PEDAGOGICAL_MODELS.map((model) => (
          <button
            key={model.level}
            onClick={() => setSelectedLevel(model.level)}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              selectedLevel === model.level
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'bg-white dark:bg-[#18191B] text-[#6E6A64] dark:text-[#9CA3AF] border border-[#E6DEC9] dark:border-[#28292D] hover:bg-black/5'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>{model.title}</span>
          </button>
        ))}
      </div>

      {/* Active Model Content Card */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE0] dark:border-[#28292D] pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
              Target Developmental Window
            </div>
            <h3 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
              {activeModel.title}
            </h3>
            <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] font-medium mt-0.5">
              {activeModel.ageRange} &bull; Architecture Type: Oral- &amp; Picture-Led
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 self-start sm:self-auto">
            Formative &bull; No Formal Written Exams
          </span>
        </div>

        {/* Pedagogical Focus Highlight */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-1">
          <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
            Developmental Focus &amp; Methodology:
          </div>
          <p className="text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
            {activeModel.pedagogicalFocus}
          </p>
        </div>

        {/* Four Key Pillars */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
            Foundational Pedagogical Pillars:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeModel.keyPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-[#18191B] border border-[#E6DEC9] dark:border-[#28292D] space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-[#5A1832] text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                    {pillar.name}
                  </h4>
                </div>
                <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] leading-relaxed">
                  {pillar.description}
                </p>
                <div className="p-2 rounded bg-white dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035] text-[11px] text-[#5A1832] dark:text-[#C29A52] font-mono">
                  Style: {pillar.activityStyle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Activities & Assessment Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>Sample Experiential Classroom Activities:</span>
            </div>
            <ul className="space-y-1.5 text-[#292521] dark:text-[#E5E7EB]">
              {activeModel.sampleActivities.map((act, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="text-[#9A7438] font-bold">&bull;</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assessment &amp; Milestone Model:</span>
            </div>
            <p className="text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
              {activeModel.assessmentStyle}
            </p>
            <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-[11px]">
              Protects children's developmental confidence while capturing systematic qualitative progress indicators for teachers and parents.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
