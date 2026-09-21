import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CurriculumSystemId, SystemSpecificPolicyProfile } from '../../types';
import { SYSTEM_POLICY_PROFILES } from '../../utils/boardBlueprintIntelligenceData';

export const SystemPolicyProfilesView: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<CurriculumSystemId>('CBSE');

  const profile: SystemSpecificPolicyProfile =
    SYSTEM_POLICY_PROFILES[selectedSystem] || SYSTEM_POLICY_PROFILES['CBSE'];

  return (
    <div id="system-policy-profiles-view" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            System Regulatory Policy Profiles
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            Governing statutory frameworks, examination rules, and assessment policies maintaining strict jurisdictional independence.
          </p>
        </div>

        {/* Framework Separation Integrity Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict Framework Independence Enforced</span>
        </div>
      </div>

      {/* System Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60 pb-2">
        {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[]).map((sys) => {
          const isSelected = selectedSystem === sys;
          return (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
              className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition-all ${
                isSelected
                  ? 'bg-[#5A1832] text-white dark:bg-[#C29A52] dark:text-[#1e0f18] shadow-xs'
                  : 'text-[#71685E] dark:text-[#c9b9a6] hover:bg-[#EDE4D6] dark:hover:bg-[#2b1622]'
              }`}
            >
              {sys === 'CBSE'
                ? 'CBSE (India Central)'
                : sys === 'CISCE'
                ? 'CISCE (ICSE / ISC)'
                : 'Cambridge International (CAIE)'}
            </button>
          );
        })}
      </div>

      {/* Selected System Profile Content */}
      <div className="space-y-5">
        <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CBBEAC]/50 dark:border-[#4d2b3b]/50 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#5A1832] dark:text-[#C29A52] px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F]">
                {profile.regulatoryBody}
              </span>
              <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
                {profile.policyTitle}
              </h3>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                {profile.systemName}
              </p>
            </div>
            <div className="text-right text-xs font-mono text-[#71685E] dark:text-[#c9b9a6]">
              System Authority: <strong>{profile.systemId}</strong>
            </div>
          </div>

          {/* Regulatory Rules List */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-[#5A1832] dark:text-[#C29A52] tracking-wider block">
              Statutory Examination Rules &amp; Assessment Directives
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {profile.assessmentRegulatoryRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 p-3 rounded-xl bg-[#F6F0E7]/60 dark:bg-[#2b1622]/60 border border-[#CBBEAC]/70 dark:border-[#4d2b3b]/70"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#292521] dark:text-[#EDE4D6] leading-relaxed">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Framework References */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono uppercase font-bold text-[#71685E] dark:text-[#c9b9a6] tracking-wider block">
              Official Regulatory References &amp; Gazette Mandates ({profile.frameworkReferences.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {profile.frameworkReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[#CBBEAC]/80 dark:border-[#4d2b3b]/80 bg-white dark:bg-[#24111d] space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52]">
                      {ref.code}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {ref.year}
                    </span>
                  </div>
                  <strong className="text-xs font-serif text-[#292521] dark:text-[#F6F0E7] block">
                    {ref.title}
                  </strong>
                  <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                    Issued by: {ref.authority}
                  </div>
                  <p className="text-[11px] text-[#292521] dark:text-[#EDE4D6]/90 leading-relaxed pt-1 border-t border-black/5 dark:border-white/5">
                    {ref.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Notes */}
          {profile.notes && (
            <div className="p-3 rounded-xl bg-[#EDE4D6]/60 dark:bg-[#35101F]/60 border border-[#CBBEAC] dark:border-[#4d2b3b] text-xs text-[#5A1832] dark:text-[#C29A52] font-mono">
              {profile.notes}
            </div>
          )}
        </div>

        {/* Editorial Independence Safeguard Notice */}
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <strong className="font-semibold block font-mono uppercase text-[11px] flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Academic Architecture Guardrails</span>
          </strong>
          <p className="leading-relaxed">
            VERITAS maintains strict segregation between statutory board frameworks. In compliance with core publishing integrity, Indian Class 10/12 syllabi are not hybridized with Cambridge IGCSE or Checkpoint standards. Any cross-curriculum alignment in teacher resources is labelled as an <em>Editorial Comparative Index</em> rather than statutory equivalence.
          </p>
        </div>
      </div>
    </div>
  );
};
