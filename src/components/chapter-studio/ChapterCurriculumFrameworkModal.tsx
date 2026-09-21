import React, { useState } from 'react';
import {
  X,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Plus,
  Eye,
  ShieldCheck,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  StudioChapter,
  CurriculumMapping,
  CurriculumRequirement,
  FrameworkVerificationStatus,
  CurriculumCoverageState,
} from '../../types';
import {
  EDUCATION_SYSTEM_PROFILES,
  DEFAULT_FRAMEWORK_PROFILES,
  DEFAULT_CURRICULUM_REQUIREMENTS,
  DEMONSTRATION_CURRICULUM_MAPPINGS,
  detectCurriculumGaps,
} from '../../utils/curriculumFrameworkData';
import { CurriculumEvidenceModal } from '../curriculum/CurriculumEvidenceModal';

interface ChapterCurriculumFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: StudioChapter;
  onUpdateChapter: (updatedChapter: StudioChapter) => void;
  onOpenCurriculumMapping?: () => void;
  isDarkMode?: boolean;
}

export const ChapterCurriculumFrameworkModal: React.FC<ChapterCurriculumFrameworkModalProps> = ({
  isOpen,
  onClose,
  chapter,
  onUpdateChapter,
  onOpenCurriculumMapping,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'mappings' | 'gaps' | 'add'>('mappings');
  const [selectedEvidenceMapping, setSelectedEvidenceMapping] = useState<CurriculumMapping | null>(null);

  // New mapping state
  const [newReqId, setNewReqId] = useState<string>('');
  const [newCoverageState, setNewCoverageState] = useState<CurriculumCoverageState>('practised');
  const [newComponentId, setNewComponentId] = useState<string>('comp-6');
  const [newNotes, setNewNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentBoard = chapter.systemId || 'CBSE';
  const boardProfile = EDUCATION_SYSTEM_PROFILES[currentBoard] || EDUCATION_SYSTEM_PROFILES.CBSE;

  const frameworkProfile =
    DEFAULT_FRAMEWORK_PROFILES.find(
      (p) => p.educationSystem === currentBoard
    ) || DEFAULT_FRAMEWORK_PROFILES[0];

  const chapterMappings: CurriculumMapping[] =
    chapter.curriculumMappings && chapter.curriculumMappings.length > 0
      ? chapter.curriculumMappings
      : DEMONSTRATION_CURRICULUM_MAPPINGS.filter(
          (m) => m.chapterId === chapter.id || m.chapterId === 'top-concord-c6'
        );

  const availableRequirements = DEFAULT_CURRICULUM_REQUIREMENTS.filter(
    (r) => r.frameworkProfileId === frameworkProfile.id
  );

  // Chapter-specific gap detection
  const dummyBook = {
    id: 'active-book',
    board: currentBoard,
    classOrStage: chapter.equivalentClass,
  } as any;
  const allGaps = detectCurriculumGaps(dummyBook, DEFAULT_CURRICULUM_REQUIREMENTS, chapterMappings);
  const chapterGaps = allGaps.filter(
    (g) => !g.affectedChapterId || g.affectedChapterId === chapter.id || g.affectedChapterId === 'top-concord-c6'
  );

  const getCoverageBadge = (state: CurriculumCoverageState) => {
    switch (state) {
      case 'mastered':
      case 'assessed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'practised':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'developing':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'introduced':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300';
    }
  };

  const getVerificationBadge = (status: FrameworkVerificationStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'needs_academic_review':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'potential_gap':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'mapped':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300';
    }
  };

  const handleVerifyMapping = (mappingId: string) => {
    const updated = chapterMappings.map((m) => {
      if (m.id === mappingId) {
        return {
          ...m,
          verificationStatus: 'verified' as FrameworkVerificationStatus,
          verifiedBy: 'Academic Editorial Board',
          verifiedAt: new Date().toLocaleDateString(),
        };
      }
      return m;
    });

    onUpdateChapter({
      ...chapter,
      curriculumMappings: updated,
      lastSaved: new Date().toISOString(),
    });
  };

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    const req = availableRequirements.find((r) => r.id === newReqId);
    if (!req) return;

    const newMappingItem: CurriculumMapping = {
      id: `map-${Date.now()}`,
      requirementId: req.id,
      requirementCode: req.code,
      requirementTitle: req.title,
      bookId: 'proj-active',
      unitId: 'unit-active',
      chapterId: chapter.id,
      architectureComponentId: newComponentId,
      coverageState: newCoverageState,
      verificationStatus: 'needs_academic_review',
      depth: 'Direct chapter application',
      evidence: [
        {
          id: `ev-${Date.now()}`,
          type: 'content_block',
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          componentId: newComponentId,
          componentName: `Architecture Component: ${newComponentId}`,
          snippet: `Author-linked section supporting ${req.code} in Chapter ${chapter.chapterNumber}.`,
        },
      ],
      notes: newNotes || 'Mapped during Chapter Studio authoring.',
    };

    const updated = [...chapterMappings, newMappingItem];
    onUpdateChapter({
      ...chapter,
      curriculumMappings: updated,
      lastSaved: new Date().toISOString(),
    });

    setNewReqId('');
    setNewNotes('');
    setActiveTab('mappings');
  };

  return (
    <>
      <div
        id="chapter-curriculum-framework-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      >
        <div
          id="chapter-curriculum-framework-modal"
          className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
            isDarkMode
              ? 'bg-[#181515] border-[#5A1832] text-[#EDE4D6]'
              : 'bg-[#FAF7F2] border-[#CBBEAC] text-[#292521]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A1832] text-[#C29A52] flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#9A7438] dark:text-[#C29A52]">
                    Curriculum &amp; Framework Intelligence
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5A1832] text-[#EDE4D6]">
                    {currentBoard}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[#191918] dark:text-[#F6F0E7]">
                  Chapter {chapter.chapterNumber}: {chapter.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Overview Bar */}
          <div className="p-4 border-b border-inherit bg-white/70 dark:bg-black/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Education System
              </span>
              <span className="font-bold text-[#5A1832] dark:text-[#C29A52] truncate block">
                {boardProfile.name}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Programme &amp; {boardProfile.standardsTerminology}
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {frameworkProfile.programme} • {chapter.equivalentClass}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Framework Profile
              </span>
              <span className="font-mono text-stone-700 dark:text-stone-300 truncate block" title={frameworkProfile.curriculumDocument}>
                {frameworkProfile.syllabusReference} ({frameworkProfile.academicYearOrEdition})
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#71685E] dark:text-[#A89C8F] uppercase block">
                Mapped Requirements
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {chapterMappings.length} Requirements Mapped
              </span>
            </div>
          </div>

          {/* Policy Distinction Notice */}
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#9A7438] dark:text-[#C29A52]" />
              <span>
                <strong>Statutory Board Framework:</strong> {boardProfile.policyFrameworkDistinction}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold shrink-0 text-amber-800 dark:text-amber-300">
              SAMPLE / REQUIRES ACADEMIC VERIFICATION
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between px-5 pt-3 border-b border-inherit bg-[#F8F4EC] dark:bg-[#201518] shrink-0">
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setActiveTab('mappings')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'mappings'
                    ? 'border-[#5A1832] text-[#5A1832] dark:border-[#C29A52] dark:text-[#C29A52] bg-white dark:bg-[#181515]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Mapped Requirements ({chapterMappings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gaps')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'gaps'
                    ? 'border-[#5A1832] text-[#5A1832] dark:border-[#C29A52] dark:text-[#C29A52] bg-white dark:bg-[#181515]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Curriculum Gaps</span>
                {chapterGaps.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    {chapterGaps.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl border-b-2 transition-colors cursor-pointer flex items-center space-x-1 ${
                  activeTab === 'add'
                    ? 'border-[#5A1832] text-[#5A1832] dark:border-[#C29A52] dark:text-[#C29A52] bg-white dark:bg-[#181515]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>Add Requirement</span>
              </button>
            </div>

            {onOpenCurriculumMapping && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCurriculumMapping();
                }}
                className="text-xs text-[#5A1832] dark:text-[#C29A52] hover:underline flex items-center space-x-1 pb-1 font-semibold"
              >
                <span>Full Mapping Matrix</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {activeTab === 'mappings' && (
              <div className="space-y-3">
                {chapterMappings.map((mapItem) => (
                  <div
                    key={mapItem.id}
                    className="p-4 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                            {mapItem.requirementCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold capitalize border ${getCoverageBadge(
                              mapItem.coverageState
                            )}`}
                          >
                            {mapItem.coverageState.replace('_', ' ')}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getVerificationBadge(
                              mapItem.verificationStatus
                            )}`}
                          >
                            {mapItem.verificationStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                          {mapItem.requirementTitle}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceMapping(mapItem)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-[#C29A52] flex items-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#C29A52]" />
                          <span>View Evidence ({mapItem.evidence.length})</span>
                        </button>

                        {mapItem.verificationStatus !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyMapping(mapItem.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100 flex items-center space-x-1 transition-colors cursor-pointer"
                            title="Perform formal academic verification"
                          >
                            <Check className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600 dark:text-stone-400">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#71685E] block">
                          Blueprint Component:
                        </span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {mapItem.architectureComponentId}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#71685E] block">
                          Pedagogical Depth:
                        </span>
                        <span>{mapItem.depth}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#71685E] block">
                          Verification Audit:
                        </span>
                        <span className="font-mono">
                          {mapItem.verifiedBy ? `${mapItem.verifiedBy} (${mapItem.verifiedAt})` : 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    {mapItem.notes && (
                      <p className="text-xs text-stone-500 italic bg-stone-50 dark:bg-black/20 p-2 rounded-lg">
                        Note: {mapItem.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-3">
                {chapterGaps.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E1919] space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h4 className="font-serif font-bold text-sm">No Curriculum Gaps Found</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      All requirements mapped to this chapter have matching pedagogical components, exercises, and diagnostic assessments.
                    </p>
                  </div>
                ) : (
                  chapterGaps.map((gap) => (
                    <div
                      key={gap.id}
                      className="p-4 rounded-xl border border-inherit bg-white dark:bg-[#1E1919] shadow-xs space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-300">
                          {gap.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
                        {gap.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {gap.description}
                      </p>
                      <div className="p-2.5 rounded-lg bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200">
                        <strong>Recommendation:</strong> {gap.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'add' && (
              <form onSubmit={handleAddMapping} className="space-y-4 bg-white dark:bg-[#1E1919] p-5 rounded-xl border border-inherit">
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                  Map New Curriculum Requirement to Chapter {chapter.chapterNumber}
                </h4>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#71685E] uppercase mb-1">
                    Select Requirement from Profile
                  </label>
                  <select
                    value={newReqId}
                    onChange={(e) => setNewReqId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-stone-900 text-xs font-semibold focus:outline-hidden focus:border-[#5A1832]"
                  >
                    <option value="">-- Choose Syllabus Requirement --</option>
                    {availableRequirements.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code}: {r.title} ({r.strand})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[#71685E] uppercase mb-1">
                      Target Coverage State
                    </label>
                    <select
                      value={newCoverageState}
                      onChange={(e) => setNewCoverageState(e.target.value as CurriculumCoverageState)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-stone-900 text-xs font-semibold"
                    >
                      <option value="introduced">Introduced</option>
                      <option value="developing">Developing</option>
                      <option value="practised">Practised</option>
                      <option value="mastered">Mastered</option>
                      <option value="assessed">Assessed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[#71685E] uppercase mb-1">
                      Architecture Blueprint Component
                    </label>
                    <select
                      value={newComponentId}
                      onChange={(e) => setNewComponentId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-stone-900 text-xs font-semibold"
                    >
                      <option value="comp-6">comp-6: Rules &amp; Form Box</option>
                      <option value="comp-7">comp-7: Contrasting Pairs</option>
                      <option value="comp-8">comp-8: Syntactic Diagram</option>
                      <option value="comp-10">comp-10: Formula Rule Strip</option>
                      <option value="comp-12">comp-12: Guided Practice Drill</option>
                      <option value="comp-13">comp-13: Tier 1 Foundational Exercise</option>
                      <option value="comp-14">comp-14: Tier 2 Intermediate Exercise</option>
                      <option value="comp-15">comp-15: Tier 3 Advanced Contextual</option>
                      <option value="comp-21">comp-21: Chapter Mastery Assessment</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#71685E] uppercase mb-1">
                    Editorial Notes / Rationale
                  </label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    rows={2}
                    placeholder="Specify how this chapter's text and exercises fulfill the requirement..."
                    className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-[#FAF7F2] dark:bg-stone-900 text-xs font-sans"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('mappings')}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold shadow-xs"
                  >
                    Save Mapping
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-inherit bg-[#F3ECE0] dark:bg-[#2A121D] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-stone-500 font-mono">
              Controlled verification: only VERIFIED may be stamped after explicit editorial audit.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#5A1832] text-[#EDE4D6] hover:bg-[#431225] text-xs font-semibold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Viewer Sub-modal */}
      <CurriculumEvidenceModal
        isOpen={!!selectedEvidenceMapping}
        onClose={() => setSelectedEvidenceMapping(null)}
        mapping={selectedEvidenceMapping}
        isDarkMode={isDarkMode}
      />
    </>
  );
};
