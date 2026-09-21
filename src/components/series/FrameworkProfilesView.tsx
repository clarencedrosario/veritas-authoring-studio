import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';
import { CurriculumSystemId } from '../../types';
import {
  FRAMEWORK_POLICY_PROFILES,
  INDEPENDENT_BOARD_PROFILES,
  PolicyFrameworkProfile,
} from '../../utils/curriculumIntelligenceData';

export const FrameworkProfilesView: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<CurriculumSystemId>('CBSE');

  const boardProfile = INDEPENDENT_BOARD_PROFILES[selectedSystem];
  const frameworkProfiles = FRAMEWORK_POLICY_PROFILES.filter(
    (f) => f.educationSystem === selectedSystem
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'MAPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'REFERENCE ADDED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300';
      case 'NEEDS ACADEMIC REVIEW':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'POTENTIAL GAP':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Policy Decoupling Warning Banner */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18191B] border border-[#E6DEC9] dark:border-[#28292D] flex items-start space-x-3 text-xs">
        <Info className="w-5 h-5 text-[#9A7438] dark:text-[#C29A52] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#292521] dark:text-[#F6F0E7]">
            Decoupled Framework &amp; Policy Architecture
          </div>
          <p className="text-[#6E6A64] dark:text-[#9CA3AF] leading-relaxed">
            VERITAS strictly decouples educational policy frameworks from generic curriculum assumptions.
            <strong> NEP 2020 and NCF-SE 2023</strong> apply to CBSE editions and do not automatically attach to CISCE or Cambridge International unless explicitly ratified by an official council circular. Status labels are evidence-governed and cannot be marked <span className="font-mono font-bold text-emerald-700">VERIFIED</span> without recorded official source citations.
          </p>
        </div>
      </div>

      {/* Board Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E6DEC9] dark:border-[#28292D] pb-3">
        {(['CBSE', 'CISCE', 'Cambridge'] as CurriculumSystemId[]).map((sys) => {
          const profile = INDEPENDENT_BOARD_PROFILES[sys];
          const isSelected = selectedSystem === sys;
          return (
            <button
              key={sys}
              onClick={() => setSelectedSystem(sys)}
              className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                isSelected
                  ? 'bg-[#5A1832] text-white shadow-xs'
                  : 'bg-white dark:bg-[#18191B] text-[#6E6A64] dark:text-[#9CA3AF] border border-[#E6DEC9] dark:border-[#28292D] hover:bg-black/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{profile.systemName}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {profile.verificationStatus}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Independent Board Profile Card */}
      <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0EBE0] dark:border-[#28292D] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
                Independent Board Profile &bull; {boardProfile.systemId}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(
                  boardProfile.verificationStatus
                )}`}
              >
                {boardProfile.verificationStatus} ({boardProfile.verificationEvidenceCount} Evidence Records)
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1">
              {boardProfile.systemName}
            </h2>
            <div className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5 font-medium">
              Governing Authority: {boardProfile.governingBody}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E6DEC9] dark:border-[#28292D] text-xs">
            <div className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">Syllabus Cycle:</div>
            <div className="font-bold text-[#5A1832] dark:text-[#C29A52] font-mono mt-0.5">
              {boardProfile.syllabusYear}
            </div>
          </div>
        </div>

        {/* Board Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
              Primary Curriculum Documents:
            </div>
            <div className="font-medium text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
              {boardProfile.primaryFrameworkDoc}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
              Standard Terminology Conventions:
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {boardProfile.terminologyConventions.map((term, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-[#25272B] border border-[#E0D8C8] dark:border-[#383A3F] text-[#292521] dark:text-[#E5E7EB]"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
              Pedagogical Emphasis:
            </div>
            <p className="text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
              {boardProfile.pedagogicalCore}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2">
            <div className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
              Assessment Structure &amp; Weights:
            </div>
            <p className="text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
              {boardProfile.assessmentStructure}
            </p>
          </div>
        </div>

        {boardProfile.unverifiedModelWarning && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Editorial Notice: </strong>
              {boardProfile.unverifiedModelWarning}
            </div>
          </div>
        )}
      </div>

      {/* Associated Framework & Policy Profiles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Associated Framework &amp; Policy Profiles ({frameworkProfiles.length})</span>
          </div>
          <span className="text-xs font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
            Audited &amp; Evidence-Checked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {frameworkProfiles.map((fp) => (
            <div
              key={fp.id}
              className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-3 hover:border-[#9A7438] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE0] dark:border-[#28292D] pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#9A7438] dark:text-[#C29A52] font-semibold">
                      {fp.programme}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(
                        fp.status
                      )}`}
                    >
                      {fp.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                    {fp.frameworkName}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Effective Cycle:
                  </div>
                  <div className="font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                    {fp.publicationEffectiveYear}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-mono font-semibold text-[#6E6A64] dark:text-[#9CA3AF]">
                    Applicable Target:
                  </span>
                  <div className="text-[#292521] dark:text-[#F6F0E7] font-medium mt-0.5">
                    {fp.applicableClassRange} &bull; {fp.applicableEdition}
                  </div>
                </div>

                <div>
                  <span className="font-mono font-semibold text-[#6E6A64] dark:text-[#9CA3AF]">
                    Official Citation / Document Ref:
                  </span>
                  <div className="text-[#292521] dark:text-[#F6F0E7] font-medium mt-0.5">
                    {fp.sourceReference}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                <span className="font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase text-[10px] block mb-1">
                  Editorial &amp; Implementation Notes:
                </span>
                {fp.notes}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] pt-1 border-t border-[#F0EBE0] dark:border-[#28292D]">
                <div className="flex items-center space-x-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Reviewed by <strong>{fp.reviewedBy}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last Verified: {fp.lastReviewed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
