import React, { useState } from 'react';
import {
  GitCommit,
  GitBranch,
  Layers,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Globe2,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  GrammarClassLevel,
  CurriculumSystemId,
} from '../../types';
import { auditSeriesProgression, SeriesProgressionItem } from '../../utils/bookProjectUtils';

interface SeriesProgressionAuditViewProps {
  seriesProject: GrammarSeriesProject;
  onNavigateToCurriculumMapping?: () => void;
}

const ALL_CLASSES: GrammarClassLevel[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const CAMBRIDGE_STAGE_MAPPING: Record<GrammarClassLevel, { stage: string; programme: string }> = {
  'Class 1': { stage: 'Stage 1', programme: 'Cambridge Primary (Editorial Mapping)' },
  'Class 2': { stage: 'Stage 2', programme: 'Cambridge Primary (Editorial Mapping)' },
  'Class 3': { stage: 'Stage 3', programme: 'Cambridge Primary' },
  'Class 4': { stage: 'Stage 4', programme: 'Cambridge Primary' },
  'Class 5': { stage: 'Stage 5', programme: 'Cambridge Primary' },
  'Class 6': { stage: 'Stage 6', programme: 'Cambridge Lower Secondary' },
  'Class 7': { stage: 'Stage 7', programme: 'Cambridge Lower Secondary' },
  'Class 8': { stage: 'Stage 8', programme: 'Cambridge Lower Secondary' },
  'Class 9': { stage: 'Stage 9', programme: 'Cambridge IGCSE / O Level' },
  'Class 10': { stage: 'Stage 10', programme: 'Cambridge IGCSE / O Level' },
  'Class 11': { stage: 'AS Level', programme: 'Cambridge International AS' },
  'Class 12': { stage: 'A Level', programme: 'Cambridge International A' },
};

export const SeriesProgressionAuditView: React.FC<SeriesProgressionAuditViewProps> = ({
  seriesProject,
  onNavigateToCurriculumMapping,
}) => {
  const [selectedBoard, setSelectedBoard] = useState<CurriculumSystemId>('CBSE');
  const [progressionItems, setProgressionItems] = useState<SeriesProgressionItem[]>(() => {
    return auditSeriesProgression(seriesProject);
  });
  const [activeConceptId, setActiveConceptId] = useState<string>('concord');

  const activeItem =
    progressionItems.find((p) => p.conceptId === activeConceptId) || progressionItems[0];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Introduced':
        return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'Developing':
        return 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'Reinforced':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
      case 'Mastered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'Extended':
        return 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'Advanced Application':
        return 'bg-[#5A1832] text-white border-[#C29A52] font-semibold';
      case 'None':
      default:
        return 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/50 dark:text-slate-500 dark:border-slate-800';
    }
  };

  const isCambridge = selectedBoard === 'Cambridge';

  return (
    <div id="series-progression-audit-view" className="space-y-6">
      {/* Header & Comparison Selector */}
      <div className="bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5A1832] text-[#E6C994]">
              Series-Wide Progression Matrix
            </span>
            <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              {isCambridge
                ? 'Cambridge Stages 3 to 11 / A-Level Spiral Continuum'
                : 'Classes 3–12 Vertical Scope & Prerequisite Audit'}
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
            {isCambridge
              ? 'Cambridge International English Spiral (Primary to Advanced)'
              : 'Linguistic Spiral Continuum (Classes 3 to 12)'}
          </h3>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            {isCambridge
              ? 'Audits developmental progression across Cambridge Primary, Lower Secondary, and IGCSE strands to prevent curricular gaps and redundant drill.'
              : 'Audit pedagogical trajectories across Indian school classes (3 to 12) to eliminate curriculum gaps, premature spikes, and ungrounded repetition.'}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Board Selector */}
          <div className="flex items-center space-x-1 p-1 bg-[#EDE4D6] dark:bg-[#35101F] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
            {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[]).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBoard(b)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedBoard === b
                    ? 'bg-[#5A1832] text-[#E6C994] font-bold shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] dark:hover:text-[#F6F0E7]'
                }`}
              >
                {b === 'Cambridge' ? 'Cambridge CAIE' : b}
              </button>
            ))}
          </div>

          {onNavigateToCurriculumMapping && (
            <button
              onClick={onNavigateToCurriculumMapping}
              className="px-3 py-1.5 text-xs font-medium text-[#292521] dark:text-[#F6F0E7] hover:bg-black/5 border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-xl flex items-center space-x-1 transition-colors"
            >
              <span>Curriculum Mapping</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Concept Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#EDE4D6] dark:bg-[#35101F] rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d]">
        {progressionItems.map((item) => (
          <button
            key={item.conceptId}
            onClick={() => setActiveConceptId(item.conceptId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all ${
              activeConceptId === item.conceptId
                ? 'bg-[#5A1832] text-[#E6C994] font-bold shadow-xs'
                : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-white/60 dark:hover:bg-[#2b1622]'
            }`}
          >
            {item.conceptName}
          </button>
        ))}
      </div>

      {/* Progression Ribbon across all 10 Classes / Stages */}
      <div className="bg-[#F6F0E7] dark:bg-[#2b1622] border border-[#CBBEAC] dark:border-[#4f2c3d] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#CBBEAC]/50 dark:border-[#4f2c3d] pb-3">
          <div>
            <h4 className="text-base font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              {activeItem.conceptName}
            </h4>
            <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              Strand: {activeItem.strand} • Framework: {isCambridge ? 'Cambridge International CAIE' : selectedBoard}
            </span>
          </div>

          {activeItem.detectedIssues.length > 0 && (
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{activeItem.detectedIssues.length} Progression Anomaly Detected</span>
            </span>
          )}
        </div>

        {/* 10-Class / Stage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {ALL_CLASSES.map((cls) => {
            const data = activeItem.progression[cls] || {
              stage: 'None',
              outcome: 'Not prescribed',
            };

            const isC6 = cls === 'Class 6';
            const cambridgeInfo = CAMBRIDGE_STAGE_MAPPING[cls];

            return (
              <div
                key={cls}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  isC6
                    ? 'border-[#C29A52] bg-[#EDE4D6] dark:bg-[#35101F] ring-1 ring-[#C29A52]/50'
                    : 'border-[#CBBEAC]/60 dark:border-[#4f2c3d] bg-white/70 dark:bg-[#1e0f18]'
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold text-[#35101F] dark:text-[#F6F0E7] flex items-center justify-between">
                    <span>{isCambridge ? cambridgeInfo.stage : cls}</span>
                    {isC6 && (
                      <span className="text-[9px] text-[#5A1832] dark:text-[#E6C994] font-serif font-bold">
                        ★ Vol 1
                      </span>
                    )}
                  </div>
                  {isCambridge && (
                    <div className="text-[9px] text-[#71685E] dark:text-[#c9b9a6] truncate font-mono">
                      {cambridgeInfo.programme.replace('Cambridge ', '')}
                    </div>
                  )}
                  <span
                    className={`mt-1.5 block text-center px-1.5 py-0.5 rounded text-[10px] border ${getStageColor(
                      data.stage
                    )}`}
                  >
                    {data.stage}
                  </span>
                </div>

                <p className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-4 leading-snug">
                  {data.outcome}
                </p>
              </div>
            );
          })}
        </div>

        {/* Anomaly Alerts */}
        {activeItem.detectedIssues.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-xl space-y-2">
            <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Progression Audit Diagnostic Details</span>
            </div>
            {activeItem.detectedIssues.map((iss, i) => (
              <div key={i} className="text-xs text-amber-800 dark:text-amber-300 pl-5">
                • <strong>{isCambridge ? (CAMBRIDGE_STAGE_MAPPING[iss.classAffected as GrammarClassLevel]?.stage || iss.classAffected) : iss.classAffected}:</strong> {iss.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
