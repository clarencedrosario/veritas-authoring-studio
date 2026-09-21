import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Info,
  ExternalLink,
  BookOpen,
  Calendar,
  UserCheck,
  FileText,
  Sliders,
  Award,
} from 'lucide-react';
import { AssessmentProfile, AssessmentIntegrityStatus, BlueprintSourceEvidence } from '../../types';
import { SYSTEM_ASSESSMENT_PROFILES, STORED_BLUEPRINT_EVIDENCE } from '../../utils/boardBlueprintIntelligenceData';

interface AssessmentProfileViewProps {
  activeProfileKey: string;
  onSelectProfileKey: (key: string) => void;
  isDarkMode: boolean;
}

export const AssessmentProfileView: React.FC<AssessmentProfileViewProps> = ({
  activeProfileKey,
  onSelectProfileKey,
  isDarkMode,
}) => {
  const profile: AssessmentProfile =
    SYSTEM_ASSESSMENT_PROFILES[activeProfileKey] || SYSTEM_ASSESSMENT_PROFILES['cbse-class6'];

  const [selectedEvidence, setSelectedEvidence] = useState<BlueprintSourceEvidence | null>(null);

  const getStatusBadge = (status: AssessmentIntegrityStatus) => {
    if (status === 'VERIFIED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <ShieldCheck className="w-3 h-3" />
          <span>VERIFIED</span>
        </span>
      );
    }
    if (status === 'EDITORIAL MODEL') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <FileCheck className="w-3 h-3" />
          <span>EDITORIAL MODEL</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
        <AlertTriangle className="w-3 h-3" />
        <span>SOURCE REQUIRED</span>
      </span>
    );
  };

  const renderFieldRow = (
    label: string,
    field: { value: any; status: AssessmentIntegrityStatus; notes?: string; evidenceRefId?: string },
    isList: boolean = false
  ) => {
    const evidence = field.evidenceRefId ? STORED_BLUEPRINT_EVIDENCE[field.evidenceRefId] : null;

    return (
      <div className="py-2.5 px-3 rounded-xl bg-white/70 dark:bg-[#1e0f18]/70 border border-[#CBBEAC]/60 dark:border-[#4d2b3b]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6]">
            {label}
          </span>
          <div className="text-xs font-semibold text-[#292521] dark:text-[#F6F0E7]">
            {isList && Array.isArray(field.value) ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {field.value.map((v: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#EDE4D6] dark:bg-[#35101F] text-[#5A1832] dark:text-[#C29A52] text-[11px]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            ) : (
              <span>{String(field.value)}</span>
            )}
          </div>
          {field.notes && (
            <p className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] italic">{field.notes}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {evidence && (
            <button
              onClick={() => setSelectedEvidence(evidence)}
              className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Ref: {evidence.officialDocumentTitle.slice(0, 16)}...</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          )}
          {getStatusBadge(field.status)}
        </div>
      </div>
    );
  };

  return (
    <div id="assessment-profile-view" className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Profile Selector Banner */}
      <div className="border-b border-[#CBBEAC] dark:border-[#4d2b3b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
            System Assessment Policy Profile Inspector
          </h2>
          <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
            20+ parameters defining regulatory context, examination format, marking protocol, and primary source evidence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-[#71685E]">Active Profile:</span>
          <select
            value={activeProfileKey}
            onChange={(e) => onSelectProfileKey(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4d2b3b] bg-white dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]"
          >
            <option value="cbse-class6">CBSE Class 6 (Editorial Model - Chapter 6 Concord)</option>
            <option value="cbse-class10">CBSE Class 10 (Subject Code 184 - Verified)</option>
            <option value="cisce-icse10">CISCE ICSE Class 10 (Paper 1 Question 5 - Verified)</option>
            <option value="cisce-class6">CISCE Class 6 (Middle School - Editorial Model)</option>
            <option value="cambridge-checkpoint-stage9">Cambridge Checkpoint Stage 9 (Curriculum 0861 - Verified)</option>
            <option value="cambridge-primary-stage6">Cambridge Primary Stage 6 (Stage 6 English - Editorial Model)</option>
          </select>
        </div>
      </div>

      {/* Overall Integrity Status Card */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          profile.overallStatus === 'VERIFIED'
            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
            : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              profile.overallStatus === 'VERIFIED'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {profile.systemId}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                {profile.programme.value} · {profile.classOrStageOrQualification.value} ({profile.subject.value})
              </h3>
              {getStatusBadge(profile.overallStatus)}
            </div>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
              {profile.editorialNotes}
            </p>
          </div>
        </div>

        {profile.evidence && profile.evidence.length > 0 && (
          <button
            onClick={() => setSelectedEvidence(profile.evidence[0])}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-2xs shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Inspect Stored Evidence</span>
          </button>
        )}
      </div>

      {/* 4 FIELDSETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fieldset 1: Identification & Regulatory */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>1. Regulatory Context &amp; Identification</span>
          </h4>
          <div className="space-y-2">
            {renderFieldRow('Programme Stage', profile.programme)}
            {renderFieldRow('Class / Stage / Qualification', profile.classOrStageOrQualification)}
            {renderFieldRow('Subject Specification', profile.subject)}
            {renderFieldRow('Assessment Context', profile.assessmentContext)}
            {renderFieldRow('Administration Mode', profile.internalOrExternal)}
          </div>
        </div>

        {/* Fieldset 2: Examination Architecture */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>2. Paper &amp; Examination Architecture</span>
          </h4>
          <div className="space-y-2">
            {renderFieldRow('Paper / Component Name', profile.paperOrComponent)}
            {renderFieldRow('Exam Duration (Minutes)', profile.durationMinutes)}
            {renderFieldRow('Maximum Prescribed Marks', profile.maximumMarks)}
            {renderFieldRow('Sectional Structure', profile.sectionStructure)}
            {renderFieldRow('Marking Protocol', profile.markingMethod)}
          </div>
        </div>

        {/* Fieldset 3: Question Typology & Response Formats */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Question Families &amp; Response Taxonomy</span>
          </h4>
          <div className="space-y-2">
            {renderFieldRow('Allowed Question Families', profile.questionFamilies, true)}
            {renderFieldRow('Permitted Response Types', profile.responseTypes, true)}
            {renderFieldRow('Skills Assessed', profile.skillsAssessed, true)}
          </div>
        </div>

        {/* Fieldset 4: Pedagogical Integration */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52] flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Pedagogical &amp; Cognitive Integration</span>
          </h4>
          <div className="space-y-2">
            {renderFieldRow('Cognitive Demand Distribution', profile.cognitiveDemand)}
            {renderFieldRow('Grammar Integration in Text', profile.grammarIntegration)}
            {renderFieldRow('Writing Integration', profile.writingIntegration)}
            {renderFieldRow('Reading Integration', profile.readingIntegration)}
          </div>
        </div>
      </div>

      {/* Stored Primary Source Evidence Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e0f18] rounded-2xl border border-[#CBBEAC] dark:border-[#4d2b3b] max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBBEAC] dark:border-[#4d2b3b]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-serif font-bold text-[#292521] dark:text-[#F6F0E7]">
                  Primary Source Evidence Record
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                  Official Document Title
                </span>
                <strong className="text-sm text-[#292521] dark:text-[#F6F0E7]">
                  {selectedEvidence.officialDocumentTitle}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                    Issuing Authority
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-slate-200">
                    {selectedEvidence.issuingOrganisation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                    Specification / Code
                  </span>
                  <span className="font-semibold text-stone-800 dark:text-slate-200">
                    {selectedEvidence.syllabusSpecificationOrFramework}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                    Version / Year
                  </span>
                  <span className="font-mono text-stone-800 dark:text-slate-200">
                    {selectedEvidence.examinationYearOrVersion}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-500 block">
                    Page / Section Citation
                  </span>
                  <span className="font-mono text-stone-800 dark:text-slate-200">
                    {selectedEvidence.pageOrSection}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                  <UserCheck className="w-4 h-4" />
                  <span className="font-bold">Verified by {selectedEvidence.verifiedBy}</span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Verification Date: {selectedEvidence.verificationDate} · Status: <strong>{selectedEvidence.verificationStatus}</strong>
                </div>
                {selectedEvidence.editorialNotes && (
                  <p className="text-[11px] text-stone-600 dark:text-slate-400 pt-1 italic">
                    "{selectedEvidence.editorialNotes}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 rounded-xl bg-[#5A1832] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
