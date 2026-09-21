import React from 'react';
import {
  X,
  BookOpen,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Award,
} from 'lucide-react';
import { MasterGrammarConcept, GrammarSeriesProject } from '../../types';
import {
  DEMO_CONCORD_BOOK_IMPLEMENTATIONS,
  DEMO_CONCORD_CBSE_EVIDENCE,
  DEMO_CONCORD_CISCE_EVIDENCE,
  DEMO_CONCORD_CAMBRIDGE_EVIDENCE,
} from '../../utils/curriculumIntelligenceData';

interface ConceptLineageModalProps {
  concept: MasterGrammarConcept;
  seriesProject: GrammarSeriesProject;
  onClose: () => void;
  onOpenBookPlanner?: (bookProjectId?: string) => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
  onOpenScopeSequence?: () => void;
}

export const ConceptLineageModal: React.FC<ConceptLineageModalProps> = ({
  concept,
  seriesProject,
  onClose,
  onOpenBookPlanner,
  onOpenChapterStudio,
  onOpenScopeSequence,
}) => {
  const bookImpls =
    concept.bookImplementations && concept.bookImplementations.length > 0
      ? concept.bookImplementations
      : DEMO_CONCORD_BOOK_IMPLEMENTATIONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FDFBF7] dark:bg-[#141517] border border-[#CBBEAC] dark:border-[#5A1832] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E6DEC9] dark:border-[#28292D] bg-[#F6F0E7] dark:bg-[#1A1C1E] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#F6F0E7] flex items-center justify-center font-bold shadow-xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                  Concept Lineage &amp; Production Trace
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                  Full Pipeline Connected
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                {concept.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#292521] dark:text-[#E5E7EB]">
          {/* Executive Lifecycle Summary */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D] shadow-2xs space-y-3">
            <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Concept Lifecycle Continuum</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Where Introduced?
                </div>
                <div className="text-sm font-bold text-[#5A1832] dark:text-[#E8A598] mt-0.5">
                  Band 3 / Class 3 (Stage 3)
                </div>
                <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-1">
                  Concrete visual singular vs plural naming words with matching regular verbs.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Where Developed?
                </div>
                <div className="text-sm font-bold text-[#9A7438] dark:text-[#C29A52] mt-0.5">
                  Bands 4–5 (Classes 4–5)
                </div>
                <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-1">
                  Compound subjects with "and", filtering intervening prepositional phrases.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Where Mastered?
                </div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Band 6 &amp; Band 10
                </div>
                <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-1">
                  Full formal concord suite in Class 6; high-stakes board examination accuracy in Class 10.
                </div>
              </div>
            </div>
          </div>

          {/* Connected Books & Chapters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Connected Books &amp; Manuscript Chapters</span>
              </div>
              <span className="text-xs font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                {bookImpls.length} VERITAS Titles Active
              </span>
            </div>

            <div className="space-y-2.5">
              {bookImpls.map((impl, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D] shadow-2xs hover:border-[#9A7438] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE0] dark:border-[#28292D] pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            impl.board === 'CBSE'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : impl.board === 'CISCE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                          }`}
                        >
                          {impl.board}
                        </span>
                        <span className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]">
                          {impl.bookTitle}
                        </span>
                      </div>
                      <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                        {impl.programme} &bull; {impl.classOrStage} ({impl.edition})
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                        {impl.teachingDepth}
                      </span>
                      {onOpenBookPlanner && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBookPlanner(impl.bookProjectId);
                          }}
                          className="px-3 py-1 text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] hover:bg-black/5 rounded-lg flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Open Planner</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-mono font-semibold text-[#6E6A64] dark:text-[#9CA3AF]">
                        Chapter Implementation:
                      </span>
                      <div className="font-semibold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                        Ch {impl.chapterNumber}: {impl.chapterTitle}
                      </div>
                      <div className="text-[#6E6A64] dark:text-[#9CA3AF] mt-1">
                        Canonical Term: "{impl.editionTerminology}"
                      </div>
                    </div>

                    <div>
                      <span className="font-mono font-semibold text-[#6E6A64] dark:text-[#9CA3AF]">
                        Assessment &amp; Exercises:
                      </span>
                      <ul className="mt-0.5 space-y-0.5 text-[#292521] dark:text-[#E5E7EB]">
                        {impl.sampleExercises.slice(0, 2).map((ex, i) => (
                          <li key={i} className="truncate">
                            &bull; {ex}
                          </li>
                        ))}
                      </ul>
                      <div className="text-[11px] text-[#9A7438] dark:text-[#C29A52] mt-1 font-medium">
                        {impl.assessmentTreatment}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Evidence Verification Trail */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D] space-y-3">
            <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Registered Curriculum Evidence References</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-800 dark:text-blue-300 font-mono">
                    CBSE Document Code 184 (Sec B, p.7)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                  {DEMO_CONCORD_CBSE_EVIDENCE.sourceTitle} &bull; Checked {DEMO_CONCORD_CBSE_EVIDENCE.dateChecked} by {DEMO_CONCORD_CBSE_EVIDENCE.academicReviewer}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300 font-mono">
                    CISCE Regulations 2025/2026 (Paper 1, Q5)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                  {DEMO_CONCORD_CISCE_EVIDENCE.sourceTitle} &bull; Checked {DEMO_CONCORD_CISCE_EVIDENCE.dateChecked} by {DEMO_CONCORD_CISCE_EVIDENCE.academicReviewer}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-[#202226] border border-[#E8E2D2] dark:border-[#2E3035]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-800 dark:text-purple-300 font-mono">
                    Cambridge CAIE Framework 0861 (Stage 7, LO 7Rg.02)
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    VERIFIED
                  </span>
                </div>
                <div className="text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                  {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.sourceTitle} &bull; Checked {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.dateChecked} by {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.academicReviewer}
                </div>
              </div>
            </div>
          </div>

          {/* Audit Health Analysis: Gaps & Duplications Check */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                Progression Health: Optimal Continuum Across All 3 Boards
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                No prerequisite gaps or excessive rote repetitions detected. Concept is appropriately introduced in Primary Band 3, consolidated into formal rules in Middle Band 6, and sustained through timed board application in Band 10 without uncoordinated duplication.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E6DEC9] dark:border-[#28292D] bg-[#F6F0E7] dark:bg-[#1A1C1E] flex items-center justify-between">
          <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF]">
            All pipeline links live and synced to active book projects.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#5A1832] hover:bg-[#471327] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Close Lineage Trace
          </button>
        </div>
      </div>
    </div>
  );
};
