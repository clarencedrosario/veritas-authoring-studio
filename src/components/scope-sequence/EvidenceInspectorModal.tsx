import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Sparkles,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Info,
  Edit3,
  BookmarkPlus,
  ArrowRight,
} from 'lucide-react';
import {
  ScopeSequenceMasterRow,
  EvidenceVerificationStatus,
  EvidenceInspectorRecord,
} from '../../types';

interface EvidenceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: ScopeSequenceMasterRow;
  onSaveEvidence: (updatedRow: ScopeSequenceMasterRow) => void;
  isDarkMode?: boolean;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({
  isOpen,
  onClose,
  row,
  onSaveEvidence,
  isDarkMode = false,
}) => {
  const initialEvidence: EvidenceInspectorRecord = row.evidenceRecord || {
    claim: row.conceptTitle || row.chapterTitle,
    status: row.evidenceStatus,
    educationSystem: 'CBSE',
    bookClassOrStage: `Class ${row.chapterNumber || 6}`,
    sourceTitle: row.evidenceCitation ? row.evidenceCitation.split(';')[0]?.trim() : '',
    issuingOrganisation: row.evidenceCitation?.includes('NCERT') ? 'NCERT / CBSE' : '',
    documentTitle: row.evidenceCitation || '',
    versionOrYear: '2024–2026',
    pageOrSection: '',
    citationReference: row.evidenceCitation || '',
    sourceUrl: '',
    editorialNotes: row.isEditorialDemonstration ? 'Sample row for editorial demonstration. Unverified against primary gazette syllabus.' : '',
    verifiedBy: row.evidenceStatus === 'VERIFIED' ? 'Academic Reviewer' : undefined,
    verificationDate: row.evidenceStatus === 'VERIFIED' ? '2026-03-15' : undefined,
    isOfficialCodeVerified: false,
  };

  const [evidence, setEvidence] = useState<EvidenceInspectorRecord>(initialEvidence);
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setEvidence(
      row.evidenceRecord || {
        claim: row.conceptTitle || row.chapterTitle,
        status: row.evidenceStatus,
        educationSystem: 'CBSE',
        bookClassOrStage: `Class 6`,
        sourceTitle: row.evidenceCitation ? row.evidenceCitation.split(';')[0]?.trim() : '',
        issuingOrganisation: row.evidenceCitation?.includes('NCERT') ? 'NCERT / CBSE' : '',
        documentTitle: row.evidenceCitation || '',
        versionOrYear: '2024–2026',
        pageOrSection: '',
        citationReference: row.evidenceCitation || '',
        sourceUrl: '',
        editorialNotes: row.isEditorialDemonstration ? 'Sample row for editorial demonstration. Unverified against primary gazette syllabus.' : '',
        verifiedBy: row.evidenceStatus === 'VERIFIED' ? 'Academic Reviewer' : undefined,
        verificationDate: row.evidenceStatus === 'VERIFIED' ? '2026-03-15' : undefined,
        isOfficialCodeVerified: false,
      }
    );
    setIsEditing(false);
    setValidationError(null);
    setSaveSuccessMessage(null);
  }, [row]);

  if (!isOpen) return null;

  // Check minimum verification requirements
  const checkVerificationEligibility = (data: EvidenceInspectorRecord): { eligible: boolean; missingFields: string[] } => {
    const missing: string[] = [];
    if (!data.issuingOrganisation || !data.issuingOrganisation.trim()) {
      missing.push('Issuing Organisation (e.g. NCERT, CBSE, CISCE, Cambridge)');
    }
    if (!data.documentTitle || !data.documentTitle.trim()) {
      missing.push('Document / Framework / Syllabus Title');
    }
    if (!data.versionOrYear || !data.versionOrYear.trim()) {
      missing.push('Publication / Syllabus Year or Version');
    }
    if ((!data.pageOrSection || !data.pageOrSection.trim()) && (!data.citationReference || !data.citationReference.trim())) {
      missing.push('Page, Section, or Specific Learning Objective reference');
    }
    return {
      eligible: missing.length === 0,
      missingFields: missing,
    };
  };

  const handleVerify = () => {
    setValidationError(null);
    const check = checkVerificationEligibility(evidence);
    if (!check.eligible) {
      setValidationError(
        `Academic Verification Gate: Cannot mark as VERIFIED without stored primary evidence. Missing: ${check.missingFields.join('; ')}.`
      );
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const updated: EvidenceInspectorRecord = {
      ...evidence,
      status: 'VERIFIED',
      verifiedBy: evidence.verifiedBy || 'Senior Academic Editor',
      verificationDate: today,
    };
    setEvidence(updated);

    const updatedRow: ScopeSequenceMasterRow = {
      ...row,
      evidenceStatus: 'VERIFIED',
      evidenceCitation: updated.citationReference || `${updated.documentTitle} (§${updated.pageOrSection || 'General'})`,
      evidenceRecord: updated,
    };

    onSaveEvidence(updatedRow);
    setSaveSuccessMessage('Successfully verified against primary documentation. Verification record stored.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleMarkForReview = () => {
    setValidationError(null);
    const updated: EvidenceInspectorRecord = {
      ...evidence,
      status: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
    };
    setEvidence(updated);

    const updatedRow: ScopeSequenceMasterRow = {
      ...row,
      evidenceStatus: 'SOURCE_ATTACHED_REVIEW_REQUIRED',
      evidenceRecord: updated,
    };

    onSaveEvidence(updatedRow);
    setSaveSuccessMessage('Status updated to SOURCE ATTACHED — REVIEW REQUIRED.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleSaveEdits = () => {
    setValidationError(null);
    const updatedRow: ScopeSequenceMasterRow = {
      ...row,
      evidenceStatus: evidence.status,
      evidenceCitation: evidence.citationReference || evidence.documentTitle,
      evidenceRecord: evidence,
    };
    onSaveEvidence(updatedRow);
    setIsEditing(false);
    setSaveSuccessMessage('Evidence metadata updated successfully.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const getStatusBadge = (status: EvidenceVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
          </span>
        );
      case 'SOURCE_ATTACHED_REVIEW_REQUIRED':
      case 'SOURCE_ADDED_NOT_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
            <Clock className="w-3.5 h-3.5" /> SOURCE ATTACHED — REVIEW REQUIRED
          </span>
        );
      case 'MAPPED_SOURCE_REQUIRED':
      case 'MAPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" /> MAPPED — SOURCE REQUIRED
          </span>
        );
      case 'EDITORIAL_DEMO':
      case 'UNVERIFIED_EDITORIAL_MODEL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700">
            <FileText className="w-3.5 h-3.5" /> EDITORIAL / DEMO
          </span>
        );
      case 'AI_SUGGESTED_UNVERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5" /> AI-SUGGESTED — UNVERIFIED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/40 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#5A1832] text-[#FAF8F5] border-b border-[#C29A52]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#C29A52]/20 border border-[#C29A52]/40 flex items-center justify-center text-[#C29A52]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C29A52] font-bold">
                  Academic Governance
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-[#FAF8F5]/80 font-mono">
                  Seq #{row.seqNumber}
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-[#F6F0E7]">
                Evidence Inspector & Citation Audit
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Data Advisory Banner if applicable */}
        {row.isEditorialDemonstration && (
          <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 dark:bg-amber-900/60 px-1.5 py-0.5 rounded mr-1.5">
                EDITORIAL DEMONSTRATION DATA
              </span>
              This record is part of the illustrative CBSE Class 6 sequence model. Pedagogical claims and sequences require official board gazette citation before academic verification.
            </div>
          </div>
        )}

        {/* Success Message Banner */}
        {saveSuccessMessage && (
          <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Validation Warning Banner */}
        {validationError && (
          <div className="px-6 py-2.5 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-800 dark:text-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-[#292521] dark:text-[#F6F0E7]">
          {/* Claim & Status Overview */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] block">
                  Curriculum Claim / Topic
                </span>
                <h3 className="text-base font-bold text-[#5A1832] dark:text-[#C29A52] font-serif">
                  {row.chapterTitle}
                </h3>
                <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  Concept: <strong className="text-[#292521] dark:text-[#F6F0E7]">{row.conceptTitle}</strong>
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71685E] dark:text-[#c9b9a6] block mb-1">
                  Evidence Status
                </span>
                {getStatusBadge(evidence.status)}
              </div>
            </div>

            {/* Internal ID vs Official Code Separation (Problem 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#C29A52]/20 text-xs">
              <div className="p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                  VERITAS Internal Mapping ID
                </span>
                <span className="font-mono font-bold text-[#5A1832] dark:text-[#C29A52] text-xs">
                  {row.internalMappingId || row.curriculumMappingCode || `VTR-CBSE6-${String(row.seqNumber).padStart(2, '0')}`}
                </span>
                <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] block mt-0.5">
                  Internal database identifier — not an official board syllabus code.
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#FAF8F5] dark:bg-[#1c1917] border border-[#C29A52]/20">
                <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider block">
                  Official Board / Framework Reference
                </span>
                <span className="font-medium text-xs text-[#292521] dark:text-[#F6F0E7] block">
                  {evidence.isOfficialCodeVerified
                    ? row.officialCurriculumRef || 'Official Board Entry Verified'
                    : 'Pending Official Gazette Code Verification'}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5">
                  Requires publication citation to establish board authority.
                </span>
              </div>
            </div>
          </div>

          {/* Framework Association Banner (Problem 4) */}
          <div className="p-3.5 rounded-lg bg-[#FAF8F5] dark:bg-[#262220] border border-[#C29A52]/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#5A1832] dark:text-[#C29A52] text-[11px] uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Framework Association Separation
            </div>
            <p className="text-[#71685E] dark:text-[#c9b9a6]">
              <strong className="text-[#292521] dark:text-[#F6F0E7]">Framework Association:</strong> {row.frameworkAssociation || 'NCF-SE 2023 (Curriculum Framework Policy Association)'}
            </p>
            <p className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] italic">
              Note: Framework association demonstrates pedagogical alignment, but does NOT prove chapter-level syllabus inclusion without official issuing organisation document citation.
            </p>
          </div>

          {/* Stored Evidence Record Details */}
          <div className="p-4 rounded-lg bg-white dark:bg-[#292521] border border-[#C29A52]/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase tracking-wider">
                Stored Evidence Record
              </h4>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit Citation Data
                </button>
              ) : (
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Editing Citation Form
                </span>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Issuing Organisation:
                  </span>
                  <p className="font-semibold">{evidence.issuingOrganisation || <span className="text-amber-600 font-normal italic">Source required</span>}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Document / Syllabus Title:
                  </span>
                  <p className="font-semibold">{evidence.documentTitle || <span className="text-amber-600 font-normal italic">Source required</span>}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Version / Publication Year:
                  </span>
                  <p className="font-semibold">{evidence.versionOrYear || 'Not specified'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Page, Section or Objective Ref:
                  </span>
                  <p className="font-semibold">{evidence.pageOrSection || row.evidenceCitation || <span className="text-amber-600 font-normal italic">Specific section reference required</span>}</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Citation / Bibliographic Reference:
                  </span>
                  <p className="font-serif italic text-xs mt-0.5 text-[#5A1832] dark:text-[#C29A52]">
                    {evidence.citationReference || row.evidenceCitation || 'No bibliographic citation attached.'}
                  </p>
                </div>

                {evidence.sourceUrl && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                      Source Document Link:
                    </span>
                    <a
                      href={evidence.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#5A1832] dark:text-[#C29A52] hover:underline inline-flex items-center gap-1"
                    >
                      {evidence.sourceUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="sm:col-span-2 pt-2 border-t border-[#C29A52]/20">
                  <span className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block">
                    Editorial Notes / Audit Record:
                  </span>
                  <p className="text-[#71685E] dark:text-[#c9b9a6] mt-0.5">
                    {evidence.editorialNotes || 'Standard curriculum sequencing entry.'}
                  </p>
                </div>

                {evidence.verifiedBy && (
                  <div className="sm:col-span-2 flex items-center gap-4 text-[11px] text-[#71685E] dark:text-[#c9b9a6] bg-[#FAF8F5] dark:bg-[#1c1917] p-2 rounded border border-emerald-500/30">
                    <div>
                      <span className="font-bold">Verified By:</span> {evidence.verifiedBy}
                    </div>
                    <div>
                      <span className="font-bold">Verification Date:</span> {evidence.verificationDate}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Editing Form */
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                      Issuing Organisation *
                    </label>
                    <input
                      type="text"
                      value={evidence.issuingOrganisation || ''}
                      onChange={(e) => setEvidence({ ...evidence, issuingOrganisation: e.target.value })}
                      placeholder="e.g. NCERT, CBSE, CISCE"
                      className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                      Document / Framework Title *
                    </label>
                    <input
                      type="text"
                      value={evidence.documentTitle || ''}
                      onChange={(e) => setEvidence({ ...evidence, documentTitle: e.target.value })}
                      placeholder="e.g. NCERT Middle School Curriculum"
                      className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                      Publication / Syllabus Year *
                    </label>
                    <input
                      type="text"
                      value={evidence.versionOrYear || ''}
                      onChange={(e) => setEvidence({ ...evidence, versionOrYear: e.target.value })}
                      placeholder="e.g. 2024–2026"
                      className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                      Page / Section Reference *
                    </label>
                    <input
                      type="text"
                      value={evidence.pageOrSection || ''}
                      onChange={(e) => setEvidence({ ...evidence, pageOrSection: e.target.value })}
                      placeholder="e.g. p. 44, Objective E6.1"
                      className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                    Citation / Bibliographic Reference
                  </label>
                  <textarea
                    rows={2}
                    value={evidence.citationReference || ''}
                    onChange={(e) => setEvidence({ ...evidence, citationReference: e.target.value })}
                    placeholder="e.g. NCERT Grade 6 Learning Outcomes E6.1; CBSE Middle School Syllabus 2026."
                    className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                    Source Document URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={evidence.sourceUrl || ''}
                    onChange={(e) => setEvidence({ ...evidence, sourceUrl: e.target.value })}
                    placeholder="https://ncert.nic.in/..."
                    className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#71685E] dark:text-[#c9b9a6] uppercase block mb-1">
                    Editorial Notes / Caveats
                  </label>
                  <textarea
                    rows={2}
                    value={evidence.editorialNotes || ''}
                    onChange={(e) => setEvidence({ ...evidence, editorialNotes: e.target.value })}
                    className="w-full p-2 rounded border border-[#C29A52]/40 bg-[#FAF8F5] dark:bg-[#1c1917]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded border border-[#C29A52]/40 hover:bg-[#FAF8F5] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdits}
                    className="px-4 py-1.5 rounded bg-[#5A1832] text-white text-xs font-bold hover:bg-[#722342] transition"
                  >
                    Save Citation Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-6 py-3.5 bg-[#F0EBE0] dark:bg-[#262220] border-t border-[#C29A52]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded border border-[#C29A52]/50 hover:bg-white dark:hover:bg-[#1c1917] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] transition flex items-center gap-1.5"
              >
                <BookmarkPlus className="w-3.5 h-3.5" /> ATTACH SOURCE
              </button>
            )}

            <button
              type="button"
              onClick={handleMarkForReview}
              className="px-3 py-1.5 rounded border border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-blue-700 dark:text-blue-300 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> MARK FOR REVIEW
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#C29A52]/40 text-xs font-semibold hover:bg-white dark:hover:bg-[#1c1917]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFY CLAIM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
