import React, { useState } from 'react';
import {
  Table,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import {
  BoardQuestionBlueprint,
  BlueprintCoverageMatrixRow,
  GrammarSeriesProject,
  GrammarClassLevel,
} from '../../types';
import { generateBlueprintCoverageMatrix } from '../../utils/boardBlueprintIntelligenceData';

interface BlueprintCoverageMatrixViewProps {
  blueprint: BoardQuestionBlueprint;
  seriesProject: GrammarSeriesProject;
  onNavigateToCoursebook?: (classLevel?: GrammarClassLevel) => void;
  isDarkMode: boolean;
}

export const BlueprintCoverageMatrixView: React.FC<BlueprintCoverageMatrixViewProps> = ({
  blueprint,
  seriesProject,
  onNavigateToCoursebook,
  isDarkMode,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Covered' | 'Partially Covered' | 'Missing'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const rows: BlueprintCoverageMatrixRow[] = generateBlueprintCoverageMatrix(blueprint, seriesProject);

  const filteredRows = rows.filter((r) => {
    if (filterStatus !== 'ALL') {
      if (
        r.bookChaptersCoverage.status !== filterStatus &&
        r.questionBankCoverage.status !== filterStatus
      ) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.requirementTitle.toLowerCase().includes(q) ||
        r.skill.toLowerCase().includes(q) ||
        r.requirementCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: 'Covered' | 'Partially Covered' | 'Missing' | 'Not Applicable' | 'Needs Review') => {
    if (status === 'Covered') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          <span>Covered</span>
        </span>
      );
    }
    if (status === 'Partially Covered') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3" />
          <span>Partial</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
        <HelpCircle className="w-3 h-3" />
        <span>Missing</span>
      </span>
    );
  };

  return (
    <div id="blueprint-coverage-matrix-view" className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            Blueprint Coverage Matrix
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            Cross-mapping blueprint syllabus requirements against Book Chapters, Question Bank, Chapter Exercises, and Chapter Tests.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search concepts, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7] w-48"
            />
          </div>

          <div className="flex items-center bg-[#EDE4D6] dark:bg-[#2b1622] p-1 rounded-xl text-xs font-semibold">
            {(['ALL', 'Covered', 'Partially Covered', 'Missing'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === st
                    ? 'bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#1e0f18] shadow-2xs'
                    : 'text-[#71685E] dark:text-[#c9b9a6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#CBBEAC] dark:border-[#4d2b3b] bg-[#F6F0E7]/80 dark:bg-[#2b1622]/80 text-[#71685E] dark:text-[#c9b9a6] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Req Code</th>
                <th className="py-3 px-4">Requirement / Concept</th>
                <th className="py-3 px-4">Target Marks</th>
                <th className="py-3 px-4">Cognitive</th>
                <th className="py-3 px-4">Book Chapters</th>
                <th className="py-3 px-4">Question Bank</th>
                <th className="py-3 px-4">Exercises</th>
                <th className="py-3 px-4">Chapter Tests</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBBEAC]/50 dark:divide-[#4d2b3b]/50">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-[#71685E] dark:text-[#c9b9a6]">
                    No coverage rows match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                      {row.requirementCode}
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-xs text-[#292521] dark:text-[#F6F0E7] block">
                        {row.requirementTitle}
                      </strong>
                      <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                        {row.skill}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#292521] dark:text-[#F6F0E7]">
                      {row.targetMarks}m
                    </td>

                    <td className="py-3 px-4 text-[11px] text-[#71685E] dark:text-[#c9b9a6]">
                      {row.cognitiveLevel}
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {getStatusBadge(row.bookChaptersCoverage.status)}
                        <p className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] line-clamp-1">
                          {row.bookChaptersCoverage.details}
                        </p>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="space-y-0.5">
                        {getStatusBadge(row.questionBankCoverage.status)}
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] block">
                          {row.questionBankCoverage.approvedCount} approved / {row.questionBankCoverage.count} total
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="space-y-0.5">
                        {getStatusBadge(row.chapterExercisesCoverage.status)}
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] block">
                          {row.chapterExercisesCoverage.exerciseCount} exercises
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      {getStatusBadge(row.chapterTestsCoverage.status)}
                    </td>

                    <td className="py-3 px-4">
                      {row.evidenceStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <FileCheck className="w-3 h-3" />
                          <span>Editorial</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
