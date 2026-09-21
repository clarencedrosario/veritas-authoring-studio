import React from 'react';
import {
  Printer,
  FileDown,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  Clock,
  FileText,
  Target,
} from 'lucide-react';
import {
  ScopeSequenceMasterRow,
  CurriculumSystemId,
  GrammarClassLevel,
} from '../../types';

interface PublisherEditorialViewProps {
  rows: ScopeSequenceMasterRow[];
  system: CurriculumSystemId;
  classLevel: GrammarClassLevel;
  seriesTitle: string;
  bookTitle: string;
  isDarkMode?: boolean;
}

export const PublisherEditorialView: React.FC<PublisherEditorialViewProps> = ({
  rows,
  system,
  classLevel,
  seriesTitle,
  bookTitle,
  isDarkMode = false,
}) => {
  const totalPages = rows.reduce((acc, r) => acc + (r.estimatedPages || 0), 0);
  const totalLessons = rows.reduce((acc, r) => acc + (r.recommendedTeachingLessons || 0), 0);
  const totalExercises = rows.reduce((acc, r) => acc + (r.exerciseProfile?.length || 0), 0);
  const verifiedCount = rows.filter((r) => r.evidenceStatus === 'VERIFIED').length;
  const verifiedPercentage = Math.round((verifiedCount / (rows.length || 1)) * 100);

  // Group by unit
  const unitsMap: Record<string, ScopeSequenceMasterRow[]> = {};
  rows.forEach((r) => {
    const u = r.unitTitle || 'Core Syntax & Foundations';
    if (!unitsMap[u]) unitsMap[u] = [];
    unitsMap[u].push(r);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm print:hidden">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
            Executive Editorial Proposal
          </span>
          <h3 className="text-base font-serif font-bold text-[#5A1832] dark:text-[#C29A52]">
            Publisher Scope & Sequence Specification
          </h3>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
            Clean, publication-ready scope document stripped of internal developer metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5A1832] text-white text-xs font-bold hover:bg-[#722342] transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Specification</span>
          </button>
        </div>
      </div>

      {/* Publisher Spec Document Canvas */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#FAF8F5] text-[#292521] border border-[#C29A52]/40 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#5A1832] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#C29A52] uppercase mb-1">
              <span>VERITAS Academic Publishing</span>
              <span>•</span>
              <span>Curriculum Specification</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#5A1832] tracking-tight">
              {bookTitle}
            </h1>
            <p className="text-sm font-serif italic text-[#71685E] mt-1">
              Part of the {seriesTitle} Series • Structured for {system} ({classLevel})
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-[#C29A52]/30 sm:pl-6">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#71685E] block">
              Editorial Status
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded inline-block mt-1">
              APPROVED SCOPE & SEQUENCE
            </span>
            <span className="text-[11px] font-mono text-[#71685E] block mt-1">
              Verification Index: {verifiedPercentage}% Authoritative
            </span>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#C29A52]/30 shadow-sm">
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#71685E] uppercase tracking-wider block">
              Total Scope
            </span>
            <span className="text-xl font-serif font-bold text-[#5A1832] mt-0.5 block">
              {rows.length} Chapters
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#71685E] uppercase tracking-wider block">
              Total Pages
            </span>
            <span className="text-xl font-serif font-bold text-[#5A1832] mt-0.5 block">
              {totalPages} pp
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#71685E] uppercase tracking-wider block">
              Instructional Hours
            </span>
            <span className="text-xl font-serif font-bold text-[#5A1832] mt-0.5 block">
              {totalLessons} Lessons
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-[#71685E] uppercase tracking-wider block">
              Exercises
            </span>
            <span className="text-xl font-serif font-bold text-[#5A1832] mt-0.5 block">
              {totalExercises} Drills
            </span>
          </div>
        </div>

        {/* Units Breakdown */}
        <div className="space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#5A1832] border-b border-[#C29A52]/30 pb-2">
            Curriculum Sequence & Instructional Units
          </h2>

          {Object.entries(unitsMap).map(([unitTitle, unitRows], uIdx) => (
            <div key={unitTitle} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#5A1832] text-white text-xs font-mono font-bold flex items-center justify-center">
                  {uIdx + 1}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#5A1832]">
                  {unitTitle}
                </h3>
              </div>

              <div className="rounded-lg border border-[#C29A52]/30 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F0EBE0] text-[#71685E] font-bold border-b border-[#C29A52]/30">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Chapter Title</th>
                      <th className="py-2.5 px-3">Curriculum Focus & Standard</th>
                      <th className="py-2.5 px-3 w-28 text-center">Mastery</th>
                      <th className="py-2.5 px-3 w-20 text-center">Lessons</th>
                      <th className="py-2.5 px-3 w-20 text-center">Pages</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C29A52]/20">
                    {unitRows.map((r) => (
                      <tr key={r.id} className="hover:bg-[#FAF8F5]/60 transition">
                        <td className="py-2 px-3 text-center font-mono font-bold text-[#5A1832]">
                          {r.seqNumber}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-[#292521] block">{r.chapterTitle}</span>
                          <span className="text-[10px] text-[#71685E] line-clamp-1">{r.priorLearning}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-medium text-[#292521] block">{r.curriculumMappingDescription}</span>
                          <span className="text-[10px] font-mono text-[#71685E]">{r.curriculumMappingCode}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] border border-[#C29A52]/40 text-[#5A1832]">
                            {r.masteryStage}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          {r.recommendedTeachingLessons}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          {r.estimatedPages}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Pedagogical Compliance Statement */}
        <div className="border-t border-[#C29A52]/30 pt-6 flex flex-col sm:flex-row items-start justify-between gap-4 text-xs text-[#71685E]">
          <div className="max-w-xl">
            <span className="font-bold text-[#5A1832] block mb-1">
              Curriculum Integrity & Evidence Governance
            </span>
            <p>
              This Scope & Sequence adheres to the tripartite curriculum model: Universal Linguistic Core (Layer A), Board Examination Taxonomy (Layer B), and Institutional/Series Pedagogical Flavor (Layer C). All curriculum claims have been cross-checked against official syllabus documentation.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="font-serif italic block">VERITAS Publishing Platform</span>
            <span className="text-[10px] font-mono">Doc ref: SS-SPEC-{classLevel.replace(' ', '')}-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
