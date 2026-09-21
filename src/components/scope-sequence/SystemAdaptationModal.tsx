import React, { useState } from 'react';
import {
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Check,
  Edit3,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { CurriculumSystemId, SystemSequenceAdaptationProposal } from '../../types';
import { SYSTEM_ADAPTATION_PROPOSALS } from '../../utils/scopeSequenceData';

interface SystemAdaptationModalProps {
  currentSystem: CurriculumSystemId;
  onClose: () => void;
  onApplyAdaptation?: (adaptedProposal: SystemSequenceAdaptationProposal) => void;
  isDarkMode?: boolean;
}

export const SystemAdaptationModal: React.FC<SystemAdaptationModalProps> = ({
  currentSystem = 'CBSE',
  onClose,
  onApplyAdaptation,
  isDarkMode = false,
}) => {
  const [targetSystem, setTargetSystem] = useState<CurriculumSystemId>(
    currentSystem === 'CBSE' ? 'CISCE' : currentSystem === 'CISCE' ? 'Cambridge' : 'CBSE'
  );

  const proposalKey =
    currentSystem === 'CBSE' && targetSystem === 'CISCE'
      ? 'cbse-to-cisce'
      : currentSystem === 'CBSE' && targetSystem === 'Cambridge'
      ? 'cbse-to-cambridge'
      : 'cbse-to-cisce'; // Fallback to our authentic demonstration proposal

  const baseProposal = SYSTEM_ADAPTATION_PROPOSALS[proposalKey] || SYSTEM_ADAPTATION_PROPOSALS['cbse-to-cisce'];

  const [proposal, setProposal] = useState<SystemSequenceAdaptationProposal>({
    ...baseProposal,
    fromSystem: currentSystem,
    toSystem: targetSystem,
  });

  const [authorDecision, setAuthorDecision] = useState<'PENDING' | 'ACCEPTED' | 'EDITED' | 'REJECTED' | 'DEFERRED'>('PENDING');
  const [decisionNotes, setDecisionNotes] = useState('');

  const handleAccept = () => {
    setAuthorDecision('ACCEPTED');
    if (onApplyAdaptation) {
      onApplyAdaptation({ ...proposal, status: 'ACCEPTED' });
    }
  };

  const handleReject = () => {
    setAuthorDecision('REJECTED');
  };

  const handleDefer = () => {
    setAuthorDecision('DEFERRED');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/40 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#5A1832] text-[#FAF8F5] border-b border-[#C29A52]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-[#C29A52] uppercase">
                  Multi-System Sequence Adaptation
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                  AI SUGGESTED — UNVERIFIED
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#F6F0E7]">
                Adapt Curriculum Sequence ({currentSystem} → {targetSystem})
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

        {/* System Target Switcher Banner */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#F0EBE0] dark:bg-[#262220] border-b border-[#C29A52]/20">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-[#71685E] dark:text-[#c9b9a6]">Source System:</span>
            <span className="px-2.5 py-1 rounded bg-[#5A1832] text-white font-bold">{currentSystem}</span>
            <ArrowRight className="w-4 h-4 text-[#C29A52]" />
            <span className="font-bold text-[#71685E] dark:text-[#c9b9a6]">Target System:</span>
            <div className="flex items-center gap-1.5">
              {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[])
                .filter((s) => s !== currentSystem)
                .map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setTargetSystem(sys)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition border ${
                      targetSystem === sys
                        ? 'bg-[#C29A52] text-[#292521] border-[#C29A52]'
                        : 'bg-white dark:bg-[#1c1917] text-[#71685E] border-[#C29A52]/30 hover:bg-[#C29A52]/10'
                    }`}
                  >
                    {sys}
                  </button>
                ))}
            </div>
          </div>

          <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] italic">
            "The software advises. The author decides."
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-[#292521] dark:text-[#F6F0E7]">
          {/* Universal Core Guarantee Card */}
          <div className="p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Universal Linguistic Core Preserved</span>
            </div>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              {proposal.universalCorePreserved}
            </p>
          </div>

          {/* Adaptation Dimensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Terminology Differences */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider block">
                1. Authentic Terminology Differences
              </span>
              <div className="space-y-2 text-xs">
                {proposal.terminologyDifferences.map((td, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                    <span className="font-bold text-[#5A1832] dark:text-[#C29A52] block">{td.term}</span>
                    <p className="text-[#71685E] dark:text-[#c9b9a6] mt-0.5">{td.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Sequence Shift & Order Notes */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider block">
                2. Sequence Shifts & Chapter Reordering
              </span>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                {proposal.sequenceShiftNotes}
              </p>
              <div className="mt-3">
                <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider block mb-1">
                  Depth & Scope Differences
                </span>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                  {proposal.depthDifferences}
                </p>
              </div>
            </div>

            {/* 3. Pedagogical Treatment Differences */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider block">
                3. Pedagogical Treatment & Style
              </span>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                {proposal.pedagogicalTreatmentDifferences}
              </p>
              <div className="mt-2">
                <span className="font-semibold text-xs block text-[#292521] dark:text-[#F6F0E7]">Exercise Style Shift:</span>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">{proposal.exerciseStyleDifferences}</p>
              </div>
            </div>

            {/* 4. Assessment Style & Expected Application */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-2">
              <span className="text-xs font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider block">
                4. Assessment Style & Authentic Application
              </span>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                {proposal.assessmentStyleDifferences}
              </p>
              <div className="mt-2">
                <span className="font-semibold text-xs block text-[#292521] dark:text-[#F6F0E7]">Target Application:</span>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">{proposal.expectedApplication}</p>
              </div>
            </div>
          </div>

          {/* Author Decision Status Banner */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#262220] border border-[#C29A52]/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
                Author Governance Decision
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                  authorDecision === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : authorDecision === 'REJECTED'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : authorDecision === 'DEFERRED'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                STATUS: {authorDecision}
              </span>
            </div>

            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mb-3">
              Automated adaptation proposals remain advisory until reviewed. Accepting this proposal records an authorized adaptation without overwriting your original {currentSystem} sequence.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Adaptation</span>
              </button>
              <button
                type="button"
                onClick={handleDefer}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#1c1917] border border-[#C29A52]/40 text-[#292521] dark:text-[#F6F0E7] text-xs font-semibold hover:bg-[#C29A52]/10 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Defer for Review</span>
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject Proposal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#F0EBE0] dark:bg-[#262220] border-t border-[#C29A52]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#5A1832] text-white text-xs font-semibold hover:bg-[#722342] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
