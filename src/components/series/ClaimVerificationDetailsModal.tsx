import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UserCheck,
  Building,
  FileText,
  ExternalLink,
  History,
  AlertTriangle,
  Clock,
  Sparkles,
  Edit3,
  Save,
} from 'lucide-react';
import {
  ClaimEvidenceRecord,
  EvidenceVerificationStatus,
  CurriculumClaimType,
} from '../../types';

interface ClaimVerificationDetailsModalProps {
  claimRecord: ClaimEvidenceRecord;
  boardName: string;
  conceptName: string;
  onClose: () => void;
  onUpdateClaim: (updated: ClaimEvidenceRecord) => void;
}

export const ClaimVerificationDetailsModal: React.FC<ClaimVerificationDetailsModalProps> = ({
  claimRecord,
  boardName,
  conceptName,
  onClose,
  onUpdateClaim,
}) => {
  const [record, setRecord] = useState<ClaimEvidenceRecord>({ ...claimRecord });
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Mandatory fields check for VERIFIED status
  const requiredFields = [
    { key: 'sourceOrganisation', label: 'Source Organisation', value: record.sourceOrganisation },
    { key: 'sourceTitle', label: 'Source Title', value: record.sourceTitle },
    { key: 'sourceType', label: 'Source Type', value: record.sourceType },
    { key: 'publicationOrSyllabusYear', label: 'Publication / Syllabus Year', value: record.publicationOrSyllabusYear },
    { key: 'applicableProgramme', label: 'Applicable Programme', value: record.applicableProgramme },
    { key: 'applicableClassOrStage', label: 'Applicable Class / Stage', value: record.applicableClassOrStage },
    { key: 'pageSectionOrObjective', label: 'Page / Section / Objective', value: record.pageSectionOrObjective },
    { key: 'sourceReferenceOrLocation', label: 'Reference / Source Location', value: record.sourceReferenceOrLocation },
    { key: 'dateChecked', label: 'Date Checked', value: record.dateChecked },
    { key: 'checkedByOrReviewer', label: 'Checked By / Reviewer', value: record.checkedByOrReviewer },
  ];

  const missingFields = requiredFields.filter((f) => !f.value || f.value.trim() === '');
  const canBeVerified = missingFields.length === 0;

  const handleStatusChange = (newStatus: EvidenceVerificationStatus, actionNote: string) => {
    if (newStatus === 'VERIFIED' && !canBeVerified) {
      setValidationError(
        `Cannot verify claim: Missing mandatory evidence fields (${missingFields.map((f) => f.label).join(', ')}). A claim may ONLY display VERIFIED when all evidence parameters are documented from primary authoritative sources.`
      );
      return;
    }

    setValidationError(null);

    const newHistoryEntry = {
      timestamp: new Date().toISOString(),
      action:
        newStatus === 'VERIFIED'
          ? ('VERIFIED' as const)
          : newStatus === 'NEEDS_ACADEMIC_REVIEW'
          ? ('REVIEW_REQUESTED' as const)
          : newStatus === 'SOURCE_ADDED_NOT_VERIFIED'
          ? ('SOURCE_ADDED' as const)
          : newStatus === 'EDITORIAL_INTERPRETATION'
          ? ('MARKED_EDITORIAL' as const)
          : ('REJECTED' as const),
      performedBy: record.checkedByOrReviewer || 'Editorial Compliance Lead',
      previousStatus: record.status,
      newStatus,
      notes: actionNote,
    };

    const updated: ClaimEvidenceRecord = {
      ...record,
      status: newStatus,
      history: [newHistoryEntry, ...(record.history || [])],
    };

    setRecord(updated);
    onUpdateClaim(updated);
  };

  const handleSaveForm = () => {
    onUpdateClaim(record);
    setIsEditing(false);
  };

  const getStatusBadge = (status: EvidenceVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>VERIFIED (OFFICIAL EVIDENCE ATTACHED)</span>
          </span>
        );
      case 'SOURCE_ADDED_NOT_VERIFIED':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>SOURCE ADDED — NOT VERIFIED</span>
          </span>
        );
      case 'NEEDS_ACADEMIC_REVIEW':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>NEEDS ACADEMIC REVIEW</span>
          </span>
        );
      case 'EDITORIAL_INTERPRETATION':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 flex items-center space-x-1.5">
            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
            <span>EDITORIAL INTERPRETATION</span>
          </span>
        );
      case 'AI_SUGGESTED_UNVERIFIED':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-SUGGESTED — UNVERIFIED</span>
          </span>
        );
      case 'UNVERIFIED_EDITORIAL_MODEL':
      default:
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border border-stone-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-stone-600" />
            <span>UNVERIFIED EDITORIAL MODEL</span>
          </span>
        );
    }
  };

  return (
    <div
      id="claim-verification-details-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-[#FDFBF7] dark:bg-[#141517] border border-[#CBBEAC] dark:border-[#2E3035] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#5A1832] text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#C29A52]">
              <ShieldCheck className="w-4 h-4" />
              <span>Curriculum Verification Dossier &bull; {boardName}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              Verification Details: {record.claimLabel}
            </h2>
            <div className="text-xs text-stone-200 font-mono">
              Concept: <strong>{conceptName}</strong> &bull; Board: <strong>{boardName}</strong>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-[#292521] dark:text-[#F6F0E7]">
          {/* Claim Value Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#28292D] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                Claim Statement in Textbook Matrix
              </span>
              {getStatusBadge(record.status)}
            </div>
            <div className="font-serif font-bold text-base text-[#292521] dark:text-[#F6F0E7]">
              "{record.claimValue}"
            </div>
          </div>

          {/* Academic Integrity Rule Callout */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold font-mono text-amber-900 dark:text-amber-300 uppercase">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Publishing Standard: Strict Definition of "VERIFIED"</span>
            </div>
            <p className="text-[#6E6A64] dark:text-[#9CA3AF] leading-relaxed">
              A curriculum or exam claim may display <strong>VERIFIED</strong> only when a genuine evidence record exists with verified primary citations (Syllabus/Circular PDF, Page/Section, and Reviewer Sign-off). Gemini/AI outputs, editorial assumptions, and plausible citation strings do not constitute verification.
            </p>
          </div>

          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Mandatory Evidence Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                Evidence Checklist for Official Verification
              </h3>
              <span
                className={`text-xs font-mono font-bold ${
                  canBeVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {canBeVerified
                  ? 'All 10 Verification Criteria Met'
                  : `${missingFields.length} of 10 Criteria Pending`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {requiredFields.map((field) => {
                const isPresent = Boolean(field.value && field.value.trim() !== '');
                return (
                  <div
                    key={field.key}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      isPresent
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                        : 'bg-stone-50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 text-stone-500'
                    }`}
                  >
                    <span className="font-mono">{field.label}</span>
                    {isPresent ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Evidence Record / Form */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#1A1C1E] border border-[#CBBEAC] dark:border-[#28292D] space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0EBE0] dark:border-[#2E3035] pb-2">
              <span className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7]">
                Authoritative Source Details
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Citation Details'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Source Organisation
                  </label>
                  <input
                    type="text"
                    value={record.sourceOrganisation || ''}
                    onChange={(e) => setRecord({ ...record, sourceOrganisation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Source Title
                  </label>
                  <input
                    type="text"
                    value={record.sourceTitle || ''}
                    onChange={(e) => setRecord({ ...record, sourceTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Publication / Syllabus Year
                    </label>
                    <input
                      type="text"
                      value={record.publicationOrSyllabusYear || ''}
                      onChange={(e) =>
                        setRecord({ ...record, publicationOrSyllabusYear: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Applicable Programme
                    </label>
                    <input
                      type="text"
                      value={record.applicableProgramme || ''}
                      onChange={(e) =>
                        setRecord({ ...record, applicableProgramme: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Applicable Class / Stage
                    </label>
                    <input
                      type="text"
                      value={record.applicableClassOrStage || ''}
                      onChange={(e) =>
                        setRecord({ ...record, applicableClassOrStage: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Page / Section / Objective
                    </label>
                    <input
                      type="text"
                      value={record.pageSectionOrObjective || ''}
                      onChange={(e) =>
                        setRecord({ ...record, pageSectionOrObjective: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Reference / Source Location URL
                  </label>
                  <input
                    type="text"
                    value={record.sourceReferenceOrLocation || ''}
                    onChange={(e) =>
                      setRecord({ ...record, sourceReferenceOrLocation: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Date Checked
                    </label>
                    <input
                      type="date"
                      value={record.dateChecked || ''}
                      onChange={(e) => setRecord({ ...record, dateChecked: e.target.value })}
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Checked By / Reviewer
                    </label>
                    <input
                      type="text"
                      value={record.checkedByOrReviewer || ''}
                      onChange={(e) =>
                        setRecord({ ...record, checkedByOrReviewer: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Academic Review Notes
                  </label>
                  <textarea
                    rows={2}
                    value={record.notes || ''}
                    onChange={(e) => setRecord({ ...record, notes: e.target.value })}
                    className="w-full p-2 rounded-lg border border-[#CBBEAC] dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141517]"
                  />
                </div>
                <button
                  onClick={handleSaveForm}
                  className="px-4 py-2 rounded-lg bg-[#5A1832] text-white font-semibold text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Save Evidence Information</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs divide-y divide-[#F0EBE0] dark:divide-[#2E3035]">
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Source Organisation:
                  </span>
                  <span className="font-semibold text-right">
                    {record.sourceOrganisation || '—'}
                  </span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">Source Title:</span>
                  <span className="font-semibold text-right max-w-md">
                    {record.sourceTitle || '—'}
                  </span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Publication / Syllabus Year:
                  </span>
                  <span className="font-semibold">{record.publicationOrSyllabusYear || '—'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Applicable Programme &amp; Class:
                  </span>
                  <span className="font-semibold">
                    {record.applicableProgramme || '—'} &bull; {record.applicableClassOrStage || '—'}
                  </span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Page / Section / Objective:
                  </span>
                  <span className="font-semibold">{record.pageSectionOrObjective || '—'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Reference Location:
                  </span>
                  <span className="font-semibold text-right truncate max-w-xs">
                    {record.sourceReferenceOrLocation || '—'}
                  </span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">Date Checked:</span>
                  <span className="font-semibold">{record.dateChecked || 'Not recorded'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                    Checked By / Reviewer:
                  </span>
                  <span className="font-semibold">
                    {record.checkedByOrReviewer || 'Unassigned'}
                  </span>
                </div>
                {record.notes && (
                  <div className="pt-2 text-stone-600 dark:text-stone-300">
                    <span className="font-mono font-bold block mb-1">Academic Audit Notes:</span>
                    <p className="bg-[#FAF8F5] dark:bg-[#141517] p-2.5 rounded-lg border border-[#E8E2D2] dark:border-[#2E3035] leading-relaxed">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verification Actions Workflow */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#CBBEAC] dark:border-[#28292D] space-y-3">
            <h4 className="font-serif font-bold text-xs text-[#292521] dark:text-[#F6F0E7] uppercase tracking-wider">
              Manual Verification Governance Actions
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() =>
                  handleStatusChange(
                    'VERIFIED',
                    'Formally verified against primary authoritative syllabus document with reviewer confirmation.'
                  )
                }
                disabled={!canBeVerified}
                className={`px-3 py-2 rounded-lg font-semibold flex items-center space-x-1.5 cursor-pointer ${
                  canBeVerified
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
                title={canBeVerified ? 'Verify this claim' : 'Fill all mandatory fields to verify'}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Claim</span>
              </button>

              <button
                onClick={() =>
                  handleStatusChange(
                    'NEEDS_ACADEMIC_REVIEW',
                    'Flagged for senior academic/board specialist review.'
                  )
                }
                className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Request Academic Review</span>
              </button>

              <button
                onClick={() =>
                  handleStatusChange(
                    'SOURCE_ADDED_NOT_VERIFIED',
                    'Authoritative reference cited, but primary text inspection is pending.'
                  )
                }
                className="px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Mark as Source Added (Not Verified)</span>
              </button>

              <button
                onClick={() =>
                  handleStatusChange(
                    'EDITORIAL_INTERPRETATION',
                    'Formulated by VERITAS editorial team as pedagogical synthesis, not official board mandate.'
                  )
                }
                className="px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Mark as Editorial Interpretation</span>
              </button>

              <button
                onClick={() =>
                  handleStatusChange(
                    'UNVERIFIED_EDITORIAL_MODEL',
                    'Reset to unverified working model.'
                  )
                }
                className="px-3 py-2 rounded-lg bg-stone-600 hover:bg-stone-700 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mark as Unverified Model</span>
              </button>
            </div>
          </div>

          {/* Verification Audit Trail History */}
          {record.history && record.history.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                <History className="w-4 h-4" />
                <span>Verification Audit Trail</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#28292D] space-y-2 text-xs">
                {record.history.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#F0EBE0] dark:border-[#28292D] last:border-none pb-1.5 last:pb-0"
                  >
                    <div>
                      <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]">
                        {entry.action.replace('_', ' ')}
                      </span>
                      <span className="text-[#6E6A64] dark:text-[#9CA3AF] ml-2">
                        by {entry.performedBy}
                      </span>
                      {entry.notes && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                          "{entry.notes}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] dark:bg-[#1A1C1E] border-t border-[#E8E2D2] dark:border-[#28292D] flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
            VERITAS Academic Verification Protocol 4H.1
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#471327] text-white text-xs font-bold font-serif transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
