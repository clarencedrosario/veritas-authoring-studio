import React, { useState } from 'react';
import {
  X,
  GitFork,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Link,
  BookOpen,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ConceptDependencyLink, DependencyRelationType } from '../../types';
import { CONCEPT_DEPENDENCY_GRAPH, getConceptDependencies } from '../../utils/scopeSequenceData';

interface ConceptDependencyModalProps {
  initialConceptId?: string;
  onClose: () => void;
  onSelectConcept?: (conceptId: string) => void;
  isDarkMode?: boolean;
}

export const ConceptDependencyModal: React.FC<ConceptDependencyModalProps> = ({
  initialConceptId = 'concept-concord',
  onClose,
  onSelectConcept,
  isDarkMode = false,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConceptId);

  const availableConcepts = [
    { id: 'concept-concord', name: 'Subject-Verb Concord / Agreement' },
    { id: 'concept-tenses', name: 'Verb Tenses & Temporal Aspects' },
    { id: 'concept-voice', name: 'Active & Passive Voice' },
    { id: 'concept-clauses', name: 'Clause Hierarchy & Synthesis' },
    { id: 'concept-reported-speech', name: 'Direct & Indirect Speech' },
  ];

  const currentDependencies: ConceptDependencyLink[] = getConceptDependencies(selectedConceptId);

  const requiredPrereqs = currentDependencies.filter((d) => d.relationType === 'REQUIRED_PREREQUISITE');
  const recommendedPrior = currentDependencies.filter((d) => d.relationType === 'RECOMMENDED_PRIOR_KNOWLEDGE');
  const relatedConcepts = currentDependencies.filter((d) => d.relationType === 'RELATED_CONCEPT');
  const laterApps = currentDependencies.filter((d) => d.relationType === 'LATER_APPLICATION');

  const getRelationBadge = (type: DependencyRelationType) => {
    switch (type) {
      case 'REQUIRED_PREREQUISITE':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
      case 'RECOMMENDED_PRIOR_KNOWLEDGE':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'RELATED_CONCEPT':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'LATER_APPLICATION':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/40 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#5A1832] text-[#FAF8F5] border-b border-[#C29A52]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52] shrink-0">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#C29A52] uppercase">
                Concept Dependency Engine
              </span>
              <h2 className="text-lg font-serif font-bold text-[#F6F0E7]">
                Prerequisite & Downstream Knowledge Map
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concept Selector Pills */}
        <div className="flex items-center gap-2 px-6 py-3 bg-[#F0EBE0] dark:bg-[#262220] border-b border-[#C29A52]/20 overflow-x-auto">
          <span className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] shrink-0">
            Target Concept:
          </span>
          {availableConcepts.map((concept) => (
            <button
              key={concept.id}
              type="button"
              onClick={() => setSelectedConceptId(concept.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                selectedConceptId === concept.id
                  ? 'bg-[#5A1832] text-white border-[#5A1832] shadow-sm'
                  : 'bg-white dark:bg-[#1c1917] text-[#292521] dark:text-[#F6F0E7] border-[#C29A52]/30 hover:bg-[#C29A52]/10'
              }`}
            >
              {concept.name}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-[#292521] dark:text-[#F6F0E7]">
          {/* Central Concept Hero */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-[#C29A52]/40 shadow-sm text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29A52] font-bold">
              Inspecting Conceptual Hub
            </span>
            <h3 className="text-xl font-serif font-bold text-[#5A1832] dark:text-[#C29A52] mt-1">
              {availableConcepts.find((c) => c.id === selectedConceptId)?.name}
            </h3>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] max-w-xl mx-auto mt-1">
              The graph models instructional prerequisites to prevent premature exposure and ensure spiraled reinforcement.
            </p>
          </div>

          {/* Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. REQUIRED PREREQUISITES */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-red-500/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" /> Required Prerequisites ({requiredPrereqs.length})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                  BLOCKING DEPENDENCY
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mb-3">
                Must be taught and mastered before this concept. Placing this concept earlier generates a sequence conflict warning.
              </p>
              <div className="space-y-2.5">
                {requiredPrereqs.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-xs"
                  >
                    <div className="font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{link.sourceConceptName}</span>
                    </div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-1 pl-5">
                      {link.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. RECOMMENDED PRIOR KNOWLEDGE */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-amber-500/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" /> Recommended Prior Knowledge ({recommendedPrior.length})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                  ADVISORY SCAFFOLD
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mb-3">
                Provides helpful conceptual scaffolding and accelerates comprehension, but is not strictly blocking.
              </p>
              <div className="space-y-2.5">
                {recommendedPrior.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs"
                  >
                    <div className="font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{link.sourceConceptName}</span>
                    </div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-1 pl-5">
                      {link.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. RELATED CONCEPTS */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-blue-500/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Link className="w-4 h-4" /> Related Concepts ({relatedConcepts.length})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  CROSS-POLLINATION
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mb-3">
                Shares overlapping grammatical mechanisms (e.g. quantifiers affecting nominal agreement).
              </p>
              <div className="space-y-2.5">
                {relatedConcepts.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-xs"
                  >
                    <div className="font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{link.sourceConceptName}</span>
                    </div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-1 pl-5">
                      {link.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. LATER APPLICATIONS */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#292521] border border-emerald-500/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ArrowRight className="w-4 h-4" /> Downstream Applications ({laterApps.length})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  HIGHER SYNTAX & WRITING
                </span>
              </div>
              <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mb-3">
                Subsequent chapters and advanced grades that directly depend on mastery of this concept.
              </p>
              <div className="space-y-2.5">
                {laterApps.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs"
                  >
                    <div className="font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{link.targetConceptName}</span>
                    </div>
                    <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-1 pl-5">
                      {link.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0EBE0] dark:bg-[#262220] border-t border-[#C29A52]/30 text-xs">
          <span className="text-[#71685E] dark:text-[#c9b9a6]">
            The Concept Dependency Engine actively monitors sequence movements in the Horizontal Book Sequence roadmap.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5A1832] text-white font-semibold hover:bg-[#722342] transition"
          >
            Close Dependency Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
