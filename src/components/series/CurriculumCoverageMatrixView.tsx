import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Filter,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ProgressionStage } from '../../types';
import {
  CURRICULUM_COVERAGE_MATRIX_DATA,
  CROSS_SYSTEM_LEARNING_BANDS,
  CurriculumCoverageMatrixRow,
} from '../../utils/curriculumIntelligenceData';

interface CurriculumCoverageMatrixViewProps {
  onSelectConcept?: (conceptId: string) => void;
}

export const CurriculumCoverageMatrixView: React.FC<CurriculumCoverageMatrixViewProps> = ({
  onSelectConcept,
}) => {
  const [filterSystem, setFilterSystem] = useState<
    'Entire' | 'CBSE' | 'CISCE' | 'Cambridge'
  >('Entire');
  const [activeCellModal, setActiveCellModal] = useState<{
    row: CurriculumCoverageMatrixRow;
    bandId: string;
    bandLabel: string;
  } | null>(null);

  const getStageBadgeColor = (stage: ProgressionStage) => {
    switch (stage) {
      case 'I':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'D':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300';
      case 'R':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'M':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'E':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-stone-50 text-stone-400 dark:bg-stone-900/40 dark:text-stone-600 border-stone-200/60';
    }
  };

  const getStageName = (stage: ProgressionStage) => {
    switch (stage) {
      case 'I':
        return 'Introduced (I)';
      case 'D':
        return 'Developing (D)';
      case 'R':
        return 'Reinforced (R)';
      case 'M':
        return 'Mastered (M)';
      case 'E':
        return 'Extended (E)';
      default:
        return 'Not Covered (—)';
    }
  };

  const getFlagLabel = (flag?: string) => {
    switch (flag) {
      case 'DEPTH_MISMATCH':
        return { text: 'DEPTH MISMATCH', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'CONCEPT_GAP':
        return { text: 'CONCEPT GAP', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'UNNECESSARY_DUPLICATION':
        return { text: 'UNNECESSARY DUPLICATION', color: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'ASSESSMENT_GAP':
        return { text: 'ASSESSMENT GAP', color: 'bg-red-100 text-red-900 border-red-300' };
      case 'MISSING_SOURCE':
        return { text: 'MISSING SOURCE', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      case 'UNVERIFIED_ALIGNMENT':
        return { text: 'UNVERIFIED ALIGNMENT', color: 'bg-stone-200 text-stone-800 border-stone-400' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Matrix Controls & Filters */}
      <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Curriculum Coverage Matrix</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
            Cross-Band Progression &amp; Anomaly Detection
          </h3>
          <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-1">
            Tracking 10 Core Linguistic Concepts across Learning Bands 3–12. Flagging depth mismatches and curriculum gaps.
          </p>
        </div>

        {/* System Filter Pills */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#F6F0E7] dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D]">
          {(['Entire', 'CBSE', 'CISCE', 'Cambridge'] as const).map((sys) => (
            <button
              key={sys}
              onClick={() => setFilterSystem(sys)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterSystem === sys
                  ? 'bg-[#5A1832] text-white shadow-2xs'
                  : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5'
              }`}
            >
              {sys === 'Entire' ? 'Entire VERITAS Series' : sys}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Safety Note */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18191B] border border-[#E6DEC9] dark:border-[#28292D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
            Progression Levels:
          </span>
          <span className="px-2 py-0.5 rounded font-mono font-bold border bg-blue-100 text-blue-800 border-blue-300">
            Introduced (I)
          </span>
          <span className="px-2 py-0.5 rounded font-mono font-bold border bg-indigo-100 text-indigo-800 border-indigo-300">
            Developing (D)
          </span>
          <span className="px-2 py-0.5 rounded font-mono font-bold border bg-amber-100 text-amber-800 border-amber-300">
            Reinforced (R)
          </span>
          <span className="px-2 py-0.5 rounded font-mono font-bold border bg-emerald-100 text-emerald-800 border-emerald-300">
            Mastered (M)
          </span>
          <span className="px-2 py-0.5 rounded font-mono font-bold border bg-purple-100 text-purple-800 border-purple-300">
            Extended (E)
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[#6E6A64] dark:text-[#9CA3AF]">
          <Info className="w-3.5 h-3.5 text-[#9A7438]" />
          <span>Click any matrix cell for granular lineage inspection</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6DEC9] dark:border-[#28292D] bg-[#F6F0E7] dark:bg-[#1A1C1E]">
                <th className="p-3.5 font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] sticky left-0 bg-[#F6F0E7] dark:bg-[#1A1C1E] z-10 min-w-[220px]">
                  Grammar Concept / Strand
                </th>
                {CROSS_SYSTEM_LEARNING_BANDS.map((band) => (
                  <th
                    key={band.bandId}
                    className="p-3 font-mono font-bold text-center text-[#292521] dark:text-[#F6F0E7] min-w-[85px]"
                    title={`${band.bandLabel} (${band.ageBracket})\nCBSE: ${band.cbseLevel}\nCISCE: ${band.cisceLevel}\nCambridge: ${band.cambridgeLevel}`}
                  >
                    <div>{band.bandLabel.replace('Learning Band ', 'Band ')}</div>
                    <div className="text-[10px] text-[#6E6A64] dark:text-[#9CA3AF] font-normal">
                      {band.ageBracket.split(' ')[0]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE0] dark:divide-[#222428]">
              {CURRICULUM_COVERAGE_MATRIX_DATA.map((row) => (
                <tr key={row.conceptId} className="hover:bg-[#FAF8F5] dark:hover:bg-[#18191B] transition-colors">
                  <td className="p-3.5 font-medium sticky left-0 bg-white dark:bg-[#141517] z-10 border-r border-[#E6DEC9] dark:border-[#28292D]">
                    <div
                      onClick={() => onSelectConcept && onSelectConcept(row.conceptId)}
                      className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7] cursor-pointer hover:text-[#5A1832] dark:hover:text-[#C29A52] transition-colors"
                    >
                      {row.conceptName}
                    </div>
                    <div className="text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                      {row.strand}
                    </div>
                  </td>

                  {CROSS_SYSTEM_LEARNING_BANDS.map((band) => {
                    const cellData = row.bands[band.bandId];
                    if (!cellData) {
                      return (
                        <td key={band.bandId} className="p-2 text-center text-stone-300">
                          —
                        </td>
                      );
                    }

                    const stage =
                      filterSystem === 'Entire'
                        ? cellData.VeritasSeries
                        : filterSystem === 'CBSE'
                        ? cellData.CBSE
                        : filterSystem === 'CISCE'
                        ? cellData.CISCE
                        : cellData.Cambridge;

                    const flagInfo = getFlagLabel(cellData.flag);

                    return (
                      <td
                        key={band.bandId}
                        onClick={() =>
                          setActiveCellModal({
                            row,
                            bandId: band.bandId,
                            bandLabel: band.bandLabel,
                          })
                        }
                        className="p-2 text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
                      >
                        <div
                          className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${getStageBadgeColor(
                            stage
                          )}`}
                          title={`${row.conceptName} at ${band.bandLabel}: ${getStageName(stage)}`}
                        >
                          {stage === 'none' ? '—' : stage}
                        </div>

                        {flagInfo && (
                          <div
                            className="mt-1 inline-block px-1 py-0.2 rounded text-[8px] font-mono font-bold border border-amber-300 bg-amber-100 text-amber-900"
                            title={cellData.flagNote || flagInfo.text}
                          >
                            ! FLAG
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cell Detail Modal */}
      {activeCellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFBF7] dark:bg-[#141517] border border-[#CBBEAC] dark:border-[#5A1832] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E6DEC9] dark:border-[#28292D] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                  Matrix Cell Inspection
                </span>
                <h3 className="font-serif font-bold text-lg text-[#292521] dark:text-[#F6F0E7]">
                  {activeCellModal.row.conceptName}
                </h3>
                <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF]">
                  {activeCellModal.bandLabel}
                </div>
              </div>
              <button
                onClick={() => setActiveCellModal(null)}
                className="text-stone-400 hover:text-stone-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-700">CBSE Progression:</span>
                  <span className="font-mono font-bold">
                    {getStageName(activeCellModal.row.bands[activeCellModal.bandId]?.CBSE || 'none')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700">CISCE Progression:</span>
                  <span className="font-mono font-bold">
                    {getStageName(activeCellModal.row.bands[activeCellModal.bandId]?.CISCE || 'none')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-700">Cambridge Progression:</span>
                  <span className="font-mono font-bold">
                    {getStageName(activeCellModal.row.bands[activeCellModal.bandId]?.Cambridge || 'none')}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#F0EBE0] dark:border-[#28292D] pt-2">
                  <span className="font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                    VERITAS Master Series:
                  </span>
                  <span className="font-mono font-bold">
                    {getStageName(activeCellModal.row.bands[activeCellModal.bandId]?.VeritasSeries || 'none')}
                  </span>
                </div>
              </div>

              {activeCellModal.row.bands[activeCellModal.bandId]?.flag && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      {getFlagLabel(activeCellModal.row.bands[activeCellModal.bandId]?.flag)?.text}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed">
                    {activeCellModal.row.bands[activeCellModal.bandId]?.flagNote ||
                      'Editorial attention required before final manuscript release.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCellModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#471327] rounded-lg cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
