import React, { useState } from 'react';
import {
  SlidersHorizontal,
  BookOpen,
  ArrowRight,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  FileSpreadsheet,
  Globe2,
  ShieldCheck,
  ShieldAlert,
  GitBranch,
  Calendar,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  CurriculumSystemId,
  MasterGrammarConcept,
  ProgressionStage,
  GrammarClassLevel,
  EvidenceVerificationStatus,
  CurriculumDivergenceInsight,
  ClaimEvidenceRecord,
  CurriculumClaimType,
} from '../../types';
import {
  CURRICULUM_SYSTEMS,
  CURRICULUM_STAGES,
  MASTER_GRAMMAR_CONCEPTS,
} from '../../utils/multiBoardData';
import {
  CROSS_SYSTEM_LEARNING_BANDS,
  INDEPENDENT_BOARD_PROFILES,
  DEMO_CONCORD_CLAIM_EVIDENCE,
  DEMO_CONCORD_CBSE_EVIDENCE,
  DEMO_CONCORD_CISCE_EVIDENCE,
  DEMO_CONCORD_CAMBRIDGE_EVIDENCE,
  DEMO_CONCORD_BOOK_IMPLEMENTATIONS,
  DEMO_CONCORD_SYSTEM_PROGRESSIONS,
  DEMO_DIVERGENCE_INSIGHTS,
  PROFESSIONAL_AUDIT_METRICS,
} from '../../utils/curriculumIntelligenceData';
import { ConceptLineageModal } from './ConceptLineageModal';
import { ClaimVerificationDetailsModal } from './ClaimVerificationDetailsModal';
import { CurriculumCoverageMatrixView } from './CurriculumCoverageMatrixView';
import { FrameworkProfilesView } from './FrameworkProfilesView';
import { EarlyYearsArchitectureView } from './EarlyYearsArchitectureView';

interface CurriculumMappingViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onNavigateToEdition: (editionId: string) => void;
  onOpenBookPlanner?: (bookProjectId?: string) => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
  onOpenScopeSequence?: () => void;
}

export const CurriculumMappingView: React.FC<CurriculumMappingViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onNavigateToEdition,
  onOpenBookPlanner,
  onOpenChapterStudio,
  onOpenScopeSequence,
}) => {
  const masterConcepts: MasterGrammarConcept[] =
    seriesProject.masterConcepts && seriesProject.masterConcepts.length > 0
      ? seriesProject.masterConcepts
      : MASTER_GRAMMAR_CONCEPTS;

  // Active Tab
  const [activeStudioTab, setActiveStudioTab] = useState<
    'comparative' | 'progression' | 'coverage' | 'frameworks' | 'early_years'
  >('comparative');

  // Selected Concept & Band
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    masterConcepts[0]?.id || 'concept-concord'
  );
  const [selectedBandId, setSelectedBandId] = useState<string>('band-6');

  // Spiral Progression Tab
  const [progressionSystemTab, setProgressionSystemTab] = useState<
    'CBSE' | 'CISCE' | 'Cambridge' | 'Veritas' | 'Compare'
  >('Compare');

  // Expandable evidence state per board
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({
    CBSE: false,
    CISCE: false,
    Cambridge: false,
  });

  // Divergence insights with user acceptance state
  const [divergenceInsights, setDivergenceInsights] = useState<CurriculumDivergenceInsight[]>(
    DEMO_DIVERGENCE_INSIGHTS
  );

  // Lineage modal state
  const [isLineageModalOpen, setIsLineageModalOpen] = useState(false);

  // Claim verification audit modal state
  const [activeClaimAudit, setActiveClaimAudit] = useState<{
    claimRecord: ClaimEvidenceRecord;
    boardName: string;
    conceptName: string;
    boardId: CurriculumSystemId;
    claimType: CurriculumClaimType;
  } | null>(null);

  // Live claim evidence state per board and claim type
  const [claimEvidenceState, setClaimEvidenceState] = useState<
    Record<CurriculumSystemId, Partial<Record<CurriculumClaimType, ClaimEvidenceRecord>>>
  >(DEMO_CONCORD_CLAIM_EVIDENCE);

  const activeConcept =
    masterConcepts.find((c) => c.id === selectedConceptId) || masterConcepts[0];

  const activeBand =
    CROSS_SYSTEM_LEARNING_BANDS.find((b) => b.bandId === selectedBandId) ||
    CROSS_SYSTEM_LEARNING_BANDS[3]; // Band 6

  // Helper to open audit modal
  const openAuditModal = (boardId: CurriculumSystemId, claimType: CurriculumClaimType) => {
    const record = getClaimRecord(boardId, claimType);
    const boardProfile = INDEPENDENT_BOARD_PROFILES[boardId];
    setActiveClaimAudit({
      claimRecord: record,
      boardName: boardProfile.systemName,
      conceptName: activeConcept.name,
      boardId,
      claimType,
    });
  };

  // Helper to update claim record after user edits or verifies
  const handleUpdateClaimRecord = (updated: ClaimEvidenceRecord) => {
    if (!activeClaimAudit) return;
    const { boardId, claimType } = activeClaimAudit;
    setClaimEvidenceState((prev) => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        [claimType]: updated,
      },
    }));
    setActiveClaimAudit((prev) => (prev ? { ...prev, claimRecord: updated } : null));
  };

  const getClaimTypeLabel = (claimType: CurriculumClaimType): string => {
    switch (claimType) {
      case 'canonicalTerminology':
        return 'Canonical Board Terminology';
      case 'pedagogicalEmphasis':
        return 'Pedagogical Emphasis';
      case 'expectedDepth':
        return 'Expected Depth & Scope';
      case 'boardExamWeightage':
        return 'Board Exam Weightage & Slot';
      case 'testingPattern':
        return 'Assessment Paradigm';
      case 'introductoryLevel':
        return 'Introduced Grade / Stage Level';
      case 'frameworkApplicability':
        return 'Framework Policy Discipline';
      default:
        return 'Curriculum Claim';
    }
  };

  const getFallbackClaimValue = (
    board: CurriculumSystemId,
    claimType: CurriculumClaimType
  ): string => {
    const impl = activeConcept.implementations?.[board];
    switch (claimType) {
      case 'canonicalTerminology':
        return impl?.canonicalTerminology || activeConcept.name;
      case 'pedagogicalEmphasis':
        return impl?.pedagogicalEmphasis || 'Standard pedagogical instruction in grammar concepts.';
      case 'expectedDepth':
        return impl?.scopeBoundary || 'Core grammatical scope defined by editorial sequence.';
      case 'boardExamWeightage':
        return impl?.boardExamWeightage || 'Assessed under general grammar questions.';
      case 'testingPattern':
        return impl?.testingPattern || 'Discrete exercises and application in composition.';
      case 'introductoryLevel':
        return 'Class 6 / Stage 7';
      case 'frameworkApplicability':
        return board === 'CISCE'
          ? 'CISCE Regulations & Syllabuses (NEP 2020 not universally binding)'
          : board === 'Cambridge'
          ? 'Cambridge Assessment International Education Framework 0861'
          : 'NCF-SE 2023 & NEP 2020 Pedagogical Guidelines';
      default:
        return '';
    }
  };

  const getClaimRecord = (
    board: CurriculumSystemId,
    claimType: CurriculumClaimType
  ): ClaimEvidenceRecord => {
    if (activeConcept.id === 'concept-concord' && claimEvidenceState[board]?.[claimType]) {
      return claimEvidenceState[board]![claimType]!;
    }
    const impl = activeConcept.implementations?.[board];
    if (impl?.claimEvidence?.[claimType]) {
      return impl.claimEvidence[claimType]!;
    }
    const boardProfile = INDEPENDENT_BOARD_PROFILES[board];
    return {
      claimType,
      claimLabel: getClaimTypeLabel(claimType),
      claimValue: getFallbackClaimValue(board, claimType),
      status: 'UNVERIFIED_EDITORIAL_MODEL',
      sourceOrganisation: boardProfile.governingBody,
      sourceTitle: boardProfile.primaryFrameworkDoc,
      sourceType: 'curriculum_framework',
      publicationOrSyllabusYear: boardProfile.syllabusYear,
      applicableProgramme: boardProfile.systemName,
      applicableClassOrStage: activeBand.bandLabel,
      dateChecked: '',
      checkedByOrReviewer: '',
      notes:
        'Unverified editorial model. Requires primary source citation (official syllabus/circular PDF) and academic reviewer sign-off before marking verified.',
      history: [],
    };
  };

  // Toggle evidence panel
  const toggleEvidence = (board: string) => {
    setExpandedEvidence((prev) => ({
      ...prev,
      [board]: !prev[board],
    }));
  };

  // Accept AI suggestion into curriculum record
  const handleAcceptInsight = (insightId: string) => {
    setDivergenceInsights((prev) =>
      prev.map((item) =>
        item.id === insightId
          ? {
              ...item,
              isAcceptedByAuthor: true,
              acceptedAt: new Date().toISOString().split('T')[0],
              acceptedBy: 'Editorial Author (Signed Off)',
              classification: 'EDITORIAL_ANALYSIS' as const,
            }
          : item
      )
    );
  };

  const getStageBadgeColor = (stage: ProgressionStage) => {
    switch (stage) {
      case 'I':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'D':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300';
      case 'R':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'M':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'E':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 border-stone-200';
    }
  };

  const getStageName = (stage: ProgressionStage) => {
    switch (stage) {
      case 'I':
        return 'Introduced (I)';
      case 'D':
        return 'Developing (D)';
      case 'R':
        return 'Reinforced (R)';
      case 'M':
        return 'Mastered (M)';
      case 'E':
        return 'Extended (E)';
      default:
        return 'Out of Scope (—)';
    }
  };

  const getEvidenceBadge = (
    status?: EvidenceVerificationStatus,
    onClick?: () => void,
    isInteractive: boolean = false
  ) => {
    const badgeConfig = (() => {
      switch (status) {
        case 'VERIFIED':
          return {
            label: 'VERIFIED',
            icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />,
            classes:
              'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
            desc: 'Strictly verified against primary syllabus PDF with reviewer sign-off',
          };
        case 'SOURCE_ADDED_NOT_VERIFIED':
          return {
            label: 'SOURCE CITED (UNVERIFIED)',
            icon: <FileText className="w-3 h-3 text-sky-600 dark:text-sky-400" />,
            classes:
              'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300',
            desc: 'Source reference identified; awaiting subject specialist review',
          };
        case 'NEEDS_ACADEMIC_REVIEW':
        case 'NEEDS_REVIEW':
          return {
            label: 'NEEDS ACADEMIC REVIEW',
            icon: <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />,
            classes:
              'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
            desc: 'Academic audit flag: topic weightage or scope requires confirmation',
          };
        case 'EDITORIAL_INTERPRETATION':
          return {
            label: 'EDITORIAL INTERPRETATION',
            icon: <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400" />,
            classes:
              'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300',
            desc: 'VERITAS pedagogical synthesis; not a verbatim board regulation',
          };
        case 'AI_SUGGESTED_UNVERIFIED':
          return {
            label: 'AI SUGGESTED (UNVERIFIED)',
            icon: <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />,
            classes:
              'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-300',
            desc: 'Automated AI proposal; unverified until author sign-off',
          };
        case 'MAPPED':
          return {
            label: 'MAPPED',
            icon: <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
            classes:
              'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
            desc: 'Curriculum requirement mapped to progression',
          };
        case 'UNVERIFIED_EDITORIAL_MODEL':
        default:
          return {
            label: 'UNVERIFIED EDITORIAL MODEL',
            icon: <ShieldAlert className="w-3 h-3 text-stone-500 dark:text-stone-400" />,
            classes:
              'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300',
            desc: 'Editorial pedagogical assumption without official board circular citation',
          };
      }
    })();

    if (isInteractive && onClick) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          title={`${badgeConfig.desc}. Click to inspect evidence record or audit claim.`}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center space-x-1 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xs active:scale-95 ${badgeConfig.classes}`}
        >
          {badgeConfig.icon}
          <span>{badgeConfig.label}</span>
        </button>
      );
    }

    return (
      <span
        title={badgeConfig.desc}
        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center space-x-1 ${badgeConfig.classes}`}
      >
        {badgeConfig.icon}
        <span>{badgeConfig.label}</span>
      </span>
    );
  };

  // Resolve active implementations for selected concept
  const cbseImpl = activeConcept.implementations?.CBSE;
  const cisceImpl = activeConcept.implementations?.CISCE;
  const cambImpl = activeConcept.implementations?.Cambridge;

  // Book implementations for Layer C
  const bookImplementations =
    activeConcept.id === 'concept-concord'
      ? DEMO_CONCORD_BOOK_IMPLEMENTATIONS
      : [
          {
            bookProjectId: 'proj-cbse-c6',
            bookTitle: 'Grammar in Action: CBSE Class 6 Edition',
            board: 'CBSE' as const,
            programme: 'CBSE Middle School Core',
            classOrStage: 'Class 6',
            edition: '2024 Academic Edition',
            chapterId: 'cbse-c6-ch04',
            chapterTitle: `${activeConcept.name} in Context`,
            chapterNumber: 4,
            teachingDepth: 'Reinforced' as const,
            editionTerminology: cbseImpl?.canonicalTerminology || activeConcept.name,
            sampleExercises: [
              'Contextual cloze exercise with target grammatical structures',
              'Sentence combining and transformation drills',
            ],
            assessmentTreatment: 'Summative Unit Assessment: 8 contextual objective items',
            coverageStatus: 'Covered' as const,
          },
          {
            bookProjectId: 'proj-icse-c6',
            bookTitle: 'Grammar in Action: CISCE Class 6 Edition',
            board: 'CISCE' as const,
            programme: 'CISCE Middle School Classical Suite',
            classOrStage: 'Class 6',
            edition: '2024 Academic Edition',
            chapterId: 'icse-c6-ch05',
            chapterTitle: `${activeConcept.name} & Syntactic Control`,
            chapterNumber: 5,
            teachingDepth: 'Mastered' as const,
            editionTerminology: cisceImpl?.canonicalTerminology || activeConcept.name,
            sampleExercises: [
              'Classical transformation drill without changing sentence meaning',
              'Passage blank completion for syntactic precision',
            ],
            assessmentTreatment: 'Preparatory ICSE Q5 drill: 6 passage blank completions + 4 sentence rewrites',
            coverageStatus: 'Covered' as const,
          },
          {
            bookProjectId: 'proj-camb-s7',
            bookTitle: 'Grammar in Action: Cambridge Lower Secondary Stage 7',
            board: 'Cambridge' as const,
            programme: 'Cambridge Lower Secondary (0861)',
            classOrStage: 'Stage 7',
            edition: '2024 International Edition',
            chapterId: 'camb-s7-ch03',
            chapterTitle: `${activeConcept.name} & Stylistic Nuance`,
            chapterNumber: 3,
            teachingDepth: 'Developing' as const,
            editionTerminology: cambImpl?.canonicalTerminology || activeConcept.name,
            sampleExercises: [
              'Analyzing rhetorical impact of grammatical variations',
              'Application in formal journalistic discourse',
            ],
            assessmentTreatment: 'Writing Rubric: Stylistic grammatical control in a 200-word persuasive speech',
            coverageStatus: 'Covered' as const,
          },
        ];

  // System progression records for Concord or fallback
  const systemProgressions =
    activeConcept.id === 'concept-concord'
      ? DEMO_CONCORD_SYSTEM_PROGRESSIONS
      : {
          CBSE: Object.fromEntries(
            Object.entries(activeConcept.progressionByStage).map(([k, v]) => [
              k,
              {
                stageKey: k,
                stageName: `CBSE ${k}`,
                progressionStage: v.stage,
                outcome: v.outcome,
                depthNote: v.depthNote,
                curriculumRef: 'CBSE Curriculum Framework Code 184',
              },
            ])
          ),
          CISCE: Object.fromEntries(
            Object.entries(activeConcept.progressionByStage).map(([k, v]) => [
              k,
              {
                stageKey: k,
                stageName: `CISCE ${k}`,
                progressionStage: v.stage,
                outcome: v.outcome,
                depthNote: v.depthNote,
                curriculumRef: 'CISCE Regulations & Syllabuses',
              },
            ])
          ),
          Cambridge: Object.fromEntries(
            Object.entries(activeConcept.progressionByStage).map(([k, v]) => [
              k,
              {
                stageKey: k,
                stageName: `Cambridge ${k.replace('Class ', 'Stage ')}`,
                progressionStage: v.stage,
                outcome: v.outcome,
                depthNote: v.depthNote,
                curriculumRef: 'CAIE English Framework 0861 / 0500',
              },
            ])
          ),
          VeritasRecommended: Object.fromEntries(
            Object.entries(activeConcept.progressionByStage).map(([k, v]) => [
              k,
              {
                stageKey: k,
                stageName: `Band ${k.replace('Class ', '')}`,
                progressionStage: v.stage,
                outcome: v.outcome,
                depthNote: v.depthNote,
                curriculumRef: 'VERITAS K-12 Master Progression Continuum',
              },
            ])
          ),
        };

  return (
    <div
      id="curriculum-mapping-studio-root"
      className="w-full min-h-full flex-1 bg-[#FDFBF7] dark:bg-[#0F1011]"
    >
      <div
        id="curriculum-mapping-studio"
        className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto pb-28"
      >
        {/* 1. Header & Lineage Trigger */}
        <div className="border-b border-[#E6DEC9] dark:border-[#28292D] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
              <GitCompare className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Series Studio &bull; Curriculum Intelligence Architecture</span>
            </div>
            <h1 className="veritas-page-title text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#292521] dark:text-[#F6F0E7]">
              Curriculum Mapping &amp; Comparative Matrix
            </h1>
            <p className="veritas-body text-sm sm:text-base text-[#6E6A64] dark:text-[#9CA3AF] max-w-4xl leading-relaxed">
              Decoupling <strong>Universal Linguistic Core (Layer A)</strong> from
              <strong> Education System Implementations (Layer B: CBSE, CISCE, Cambridge)</strong> and
              <strong> Book Manuscript Implementations (Layer C)</strong> with strict evidence-governed verification.
            </p>
          </div>

          <button
            onClick={() => setIsLineageModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#5A1832] hover:bg-[#471327] text-white text-xs font-serif font-bold shadow-xs flex items-center space-x-2 transition-colors self-start cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-[#C29A52]" />
            <span>Inspect Concept Lineage &amp; Production Links</span>
          </button>
        </div>

        {/* 2. Curriculum Audit Safety Bar */}
        <div className="p-4 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#5A1832]/10 dark:bg-[#5A1832]/30 text-[#5A1832] dark:text-[#C29A52] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#9A7438] dark:text-[#C29A52]">
                    Curriculum Audit Safety &amp; Evidence Control
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                  {PROFESSIONAL_AUDIT_METRICS.complianceClaimNote}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] text-center min-w-[110px]">
                <div className="text-[10px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Mapping Coverage
                </div>
                <div className="text-sm font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                  {PROFESSIONAL_AUDIT_METRICS.mappingCoveragePercentage}%
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] text-center min-w-[110px]">
                <div className="text-[10px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Verified Alignment
                </div>
                <div className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {PROFESSIONAL_AUDIT_METRICS.verifiedAlignmentPercentage}%
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] text-center min-w-[110px]">
                <div className="text-[10px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Awaiting Review
                </div>
                <div className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">
                  {PROFESSIONAL_AUDIT_METRICS.itemsAwaitingAcademicReview}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] text-center min-w-[110px]">
                <div className="text-[10px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Unverified Models
                </div>
                <div className="text-sm font-mono font-bold text-stone-700 dark:text-stone-300">
                  {PROFESSIONAL_AUDIT_METRICS.itemsWithUnverifiedEditorialModel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Studio Mode Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E6DEC9] dark:border-[#28292D] pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveStudioTab('comparative')}
            className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeStudioTab === 'comparative'
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Comparative Matrix &amp; 3-Layer Model</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('progression')}
            className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeStudioTab === 'progression'
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>System-Specific Spiral Progression</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('coverage')}
            className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeStudioTab === 'coverage'
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Curriculum Coverage Matrix</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('frameworks')}
            className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeStudioTab === 'frameworks'
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Framework &amp; Policy Profiles</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('early_years')}
            className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeStudioTab === 'early_years'
                ? 'bg-[#5A1832] text-white shadow-xs'
                : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Early Years Foundation (K–2)</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: COMPARATIVE MATRIX & 3-LAYER MODEL (DEFAULT)                  */}
        {/* ==================================================================== */}
        {activeStudioTab === 'comparative' && (
          <div className="space-y-8">
            {/* Top Selector Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 md:p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs">
              {/* Concept Selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider mb-2">
                  1. Universal Linguistic Concept (Layer A)
                </label>
                <select
                  value={selectedConceptId}
                  onChange={(e) => setSelectedConceptId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E6DEC9] dark:border-[#28292D] bg-[#FAF8F5] dark:bg-[#18191B] text-sm font-semibold text-[#292521] dark:text-[#F6F0E7] focus:outline-hidden focus:border-[#5A1832]"
                >
                  {masterConcepts.map((concept) => (
                    <option key={concept.id} value={concept.id}>
                      {concept.name} ({concept.strand})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cross-System Learning Band Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
                    2. Cross-System Learning Band
                  </label>
                  <span className="text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52] font-semibold">
                    {activeBand.editorialDisclaimer}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {CROSS_SYSTEM_LEARNING_BANDS.map((band) => (
                    <button
                      key={band.bandId}
                      onClick={() => setSelectedBandId(band.bandId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                        selectedBandId === band.bandId
                          ? 'bg-[#5A1832] text-white border-transparent font-bold shadow-2xs'
                          : 'border-[#E6DEC9] dark:border-[#28292D] text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-[#F6F0E7] dark:hover:bg-[#202226]'
                      }`}
                      title={`${band.bandLabel} (${band.ageBracket})\nCBSE: ${band.cbseLevel}\nCISCE: ${band.cisceLevel}\nCambridge: ${band.cambridgeLevel}`}
                    >
                      {band.bandLabel}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF] flex flex-wrap gap-x-3">
                  <span>
                    <strong>CBSE:</strong> {activeBand.cbseLevel}
                  </span>
                  <span>
                    <strong>CISCE:</strong> {activeBand.cisceLevel}
                  </span>
                  <span>
                    <strong>Cambridge:</strong> {activeBand.cambridgeLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* LAYER A — Universal Linguistic Core Card */}
            <div className="p-6 md:p-7 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0EBE0] dark:border-[#222428] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#5A1832] text-white uppercase tracking-wider">
                      Layer A
                    </span>
                    <span className="text-xs font-mono text-[#9A7438] dark:text-[#C29A52] font-bold uppercase tracking-wider">
                      Universal Linguistic Core &bull; {activeConcept.strand}
                    </span>
                  </div>
                  <h2 className="veritas-section-title text-xl md:text-2xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] mt-1.5">
                    {activeConcept.name}
                  </h2>
                </div>

                <div className="text-xs font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Invariant across all languages &amp; frameworks
                </div>
              </div>

              <p className="veritas-body text-base text-[#292521] dark:text-[#E5E7EB] leading-relaxed font-serif">
                {activeConcept.universalDefinition}
              </p>

              {/* Universal Rules & Pitfalls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18191B] border border-[#E8E2D2] dark:border-[#28292D] space-y-2.5">
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Universal Core Linguistic Rules</span>
                  </div>
                  <ul className="text-sm space-y-2 text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                    {activeConcept.universalRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="text-emerald-600 font-bold shrink-0">&bull;</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#18191B] border border-[#E8E2D2] dark:border-[#28292D] space-y-2.5">
                  <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Universal Learner Pitfalls</span>
                  </div>
                  <ul className="text-sm space-y-2 text-[#292521] dark:text-[#F6F0E7] leading-relaxed">
                    {activeConcept.commonPitfalls.map((pitfall, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="text-amber-600 font-bold shrink-0">&bull;</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* LAYER B — Three-Board Side-by-Side Comparative Matrix */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#9A7438] text-white uppercase tracking-wider">
                      Layer B
                    </span>
                    <h2 className="veritas-section-title text-lg md:text-xl font-serif font-bold text-[#292521] dark:text-[#F6F0E7] flex items-center space-x-2">
                      <span>Education System Implementations: {activeConcept.name}</span>
                    </h2>
                  </div>
                  <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                    Independent curricular models for CBSE, CISCE (ICSE/ISC), and Cambridge CAIE.
                  </p>
                </div>

                <div className="text-xs font-mono text-[#9A7438] dark:text-[#C29A52]">
                  Active Comparison: {activeBand.bandLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Column 1: CBSE */}
                {(() => {
                  const termClaim = getClaimRecord('CBSE', 'canonicalTerminology');
                  const emphasisClaim = getClaimRecord('CBSE', 'pedagogicalEmphasis');
                  const depthClaim = getClaimRecord('CBSE', 'expectedDepth');
                  const weightageClaim = getClaimRecord('CBSE', 'boardExamWeightage');
                  const testingClaim = getClaimRecord('CBSE', 'testingPattern');
                  const policyClaim = getClaimRecord('CBSE', 'frameworkApplicability');
                  const profile = INDEPENDENT_BOARD_PROFILES.CBSE;

                  return (
                    <div className="p-5 md:p-6 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-[#141517] shadow-2xs flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        {/* Header with Board-Level Status */}
                        <div className="flex items-center justify-between border-b border-[#F0EBE0] dark:border-[#222428] pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                              CBSE Implementation
                            </span>
                            <div className="text-[10px] text-[#6E6A64] dark:text-[#9CA3AF] font-mono mt-0.5">
                              {activeBand.cbseLevel} &bull; {profile.governingBody}
                            </div>
                          </div>
                          {getEvidenceBadge(
                            profile.verificationStatus,
                            () => openAuditModal('CBSE', 'canonicalTerminology'),
                            true
                          )}
                        </div>

                        {profile.unverifiedModelWarning && (
                          <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 text-[11px] text-amber-900 dark:text-amber-300 flex items-start space-x-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{profile.unverifiedModelWarning}</span>
                          </div>
                        )}

                        {/* Terminology Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Canonical Board Terminology
                            </span>
                            {getEvidenceBadge(
                              termClaim.status,
                              () => openAuditModal('CBSE', 'canonicalTerminology'),
                              true
                            )}
                          </div>
                          <div className="font-bold text-base text-[#292521] dark:text-[#F6F0E7] font-serif">
                            "{cbseImpl?.canonicalTerminology || termClaim.claimValue}"
                          </div>
                        </div>

                        {/* Pedagogical Emphasis Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Pedagogical Emphasis
                            </span>
                            {getEvidenceBadge(
                              emphasisClaim.status,
                              () => openAuditModal('CBSE', 'pedagogicalEmphasis'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cbseImpl?.pedagogicalEmphasis || emphasisClaim.claimValue}
                          </p>
                        </div>

                        {/* Expected Depth Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Expected Depth &amp; Outlay
                            </span>
                            {getEvidenceBadge(
                              depthClaim.status,
                              () => openAuditModal('CBSE', 'expectedDepth'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cbseImpl?.scopeBoundary || depthClaim.claimValue}
                          </p>
                        </div>

                        {/* Board Exam Weightage Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Exam Weightage &amp; Slot
                            </span>
                            {getEvidenceBadge(
                              weightageClaim.status,
                              () => openAuditModal('CBSE', 'boardExamWeightage'),
                              true
                            )}
                          </div>
                          <div className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                            {cbseImpl?.boardExamWeightage || weightageClaim.claimValue}
                          </div>
                          {weightageClaim.status === 'NEEDS_ACADEMIC_REVIEW' && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 italic">
                              * Academic Flag: CBSE syllabus specifies overall Grammar section (10 marks) but does not fix individual topic marks.
                            </p>
                          )}
                        </div>

                        {/* Testing Pattern Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Assessment Paradigm
                            </span>
                            {getEvidenceBadge(
                              testingClaim.status,
                              () => openAuditModal('CBSE', 'testingPattern'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cbseImpl?.testingPattern || testingClaim.claimValue}
                          </p>
                        </div>

                        {/* Policy Framework Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Framework Policy Discipline
                            </span>
                            {getEvidenceBadge(
                              policyClaim.status,
                              () => openAuditModal('CBSE', 'frameworkApplicability'),
                              true
                            )}
                          </div>
                          <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] font-mono">
                            {policyClaim.claimValue}
                          </p>
                        </div>

                        {/* Sample Prompt */}
                        <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-1">
                          <div className="text-xs font-mono font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                            Typical CBSE Exam Item
                          </div>
                          <p className="text-xs text-[#292521] dark:text-[#F6F0E7] font-mono leading-relaxed">
                            {cbseImpl?.sampleQuestionPrompt}
                          </p>
                        </div>

                        {/* Audit Claims Button */}
                        <button
                          type="button"
                          onClick={() => openAuditModal('CBSE', 'boardExamWeightage')}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-mono font-bold text-blue-900 dark:text-blue-200 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Audit CBSE Claims &amp; Evidence</span>
                        </button>

                        {/* Time-Aware Metadata & Evidence Expander */}
                        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                            <span>Effective: {profile.syllabusYear}</span>
                            <span className="text-amber-700 font-bold">{profile.verificationStatus}</span>
                          </div>

                          <button
                            onClick={() => toggleEvidence('CBSE')}
                            className="w-full flex items-center justify-between pt-1 border-t border-[#E8E2D2] dark:border-[#2E3035] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] cursor-pointer"
                          >
                            <span>Official Evidence Citation</span>
                            {expandedEvidence.CBSE ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {expandedEvidence.CBSE && (
                            <div className="pt-2 space-y-1.5 text-[11px] text-[#292521] dark:text-[#E5E7EB]">
                              <div>
                                <strong>Source:</strong> {DEMO_CONCORD_CBSE_EVIDENCE.sourceTitle}
                              </div>
                              <div>
                                <strong>Authority:</strong> {DEMO_CONCORD_CBSE_EVIDENCE.sourceOrganisation}
                              </div>
                              <div>
                                <strong>Section:</strong> {DEMO_CONCORD_CBSE_EVIDENCE.pageSection}
                              </div>
                              <div>
                                <strong>Reviewed by:</strong> {DEMO_CONCORD_CBSE_EVIDENCE.academicReviewer} ({DEMO_CONCORD_CBSE_EVIDENCE.dateChecked})
                              </div>
                              <div className="pt-1.5 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => openAuditModal('CBSE', 'canonicalTerminology')}
                                  className="text-[10px] font-mono font-bold text-[#5A1832] dark:text-[#C29A52] underline cursor-pointer"
                                >
                                  Inspect Full Evidence Record &rarr;
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#F0EBE0] dark:border-[#222428]">
                        <button
                          onClick={() => onNavigateToEdition('ed-cbse-c6')}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
                        >
                          <span>Open CBSE Edition</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Column 2: CISCE */}
                {(() => {
                  const termClaim = getClaimRecord('CISCE', 'canonicalTerminology');
                  const emphasisClaim = getClaimRecord('CISCE', 'pedagogicalEmphasis');
                  const depthClaim = getClaimRecord('CISCE', 'expectedDepth');
                  const weightageClaim = getClaimRecord('CISCE', 'boardExamWeightage');
                  const testingClaim = getClaimRecord('CISCE', 'testingPattern');
                  const policyClaim = getClaimRecord('CISCE', 'frameworkApplicability');
                  const profile = INDEPENDENT_BOARD_PROFILES.CISCE;

                  return (
                    <div className="p-5 md:p-6 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-[#141517] shadow-2xs flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        {/* Header with Board-Level Status */}
                        <div className="flex items-center justify-between border-b border-[#F0EBE0] dark:border-[#222428] pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                              CISCE Implementation
                            </span>
                            <div className="text-[10px] text-[#6E6A64] dark:text-[#9CA3AF] font-mono mt-0.5">
                              {activeBand.cisceLevel} &bull; {profile.governingBody}
                            </div>
                          </div>
                          {getEvidenceBadge(
                            profile.verificationStatus,
                            () => openAuditModal('CISCE', 'canonicalTerminology'),
                            true
                          )}
                        </div>

                        {profile.unverifiedModelWarning && (
                          <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 text-[11px] text-amber-900 dark:text-amber-300 flex items-start space-x-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{profile.unverifiedModelWarning}</span>
                          </div>
                        )}

                        {/* Terminology Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Canonical Board Terminology
                            </span>
                            {getEvidenceBadge(
                              termClaim.status,
                              () => openAuditModal('CISCE', 'canonicalTerminology'),
                              true
                            )}
                          </div>
                          <div className="font-bold text-base text-[#292521] dark:text-[#F6F0E7] font-serif">
                            "{cisceImpl?.canonicalTerminology || termClaim.claimValue}"
                          </div>
                        </div>

                        {/* Pedagogical Emphasis Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Pedagogical Emphasis
                            </span>
                            {getEvidenceBadge(
                              emphasisClaim.status,
                              () => openAuditModal('CISCE', 'pedagogicalEmphasis'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cisceImpl?.pedagogicalEmphasis || emphasisClaim.claimValue}
                          </p>
                        </div>

                        {/* Expected Depth Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Expected Depth &amp; Outlay
                            </span>
                            {getEvidenceBadge(
                              depthClaim.status,
                              () => openAuditModal('CISCE', 'expectedDepth'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cisceImpl?.scopeBoundary || depthClaim.claimValue}
                          </p>
                        </div>

                        {/* Board Exam Weightage Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Exam Weightage &amp; Slot
                            </span>
                            {getEvidenceBadge(
                              weightageClaim.status,
                              () => openAuditModal('CISCE', 'boardExamWeightage'),
                              true
                            )}
                          </div>
                          <div className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                            {cisceImpl?.boardExamWeightage || weightageClaim.claimValue}
                          </div>
                          {weightageClaim.status === 'NEEDS_ACADEMIC_REVIEW' && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 italic">
                              * Academic Flag: ICSE Class 10 Q5 has verified mark slots; junior classes (3–8) are unverified editorial baseline.
                            </p>
                          )}
                        </div>

                        {/* Testing Pattern Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Assessment Paradigm
                            </span>
                            {getEvidenceBadge(
                              testingClaim.status,
                              () => openAuditModal('CISCE', 'testingPattern'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cisceImpl?.testingPattern || testingClaim.claimValue}
                          </p>
                        </div>

                        {/* Policy Framework Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Framework Policy Discipline
                            </span>
                            {getEvidenceBadge(
                              policyClaim.status,
                              () => openAuditModal('CISCE', 'frameworkApplicability'),
                              true
                            )}
                          </div>
                          <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] font-mono">
                            {policyClaim.claimValue}
                          </p>
                        </div>

                        {/* Sample Prompt */}
                        <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-1">
                          <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                            Typical ICSE Exam Item
                          </div>
                          <p className="text-xs text-[#292521] dark:text-[#F6F0E7] font-mono leading-relaxed">
                            {cisceImpl?.sampleQuestionPrompt}
                          </p>
                        </div>

                        {/* Audit Claims Button */}
                        <button
                          type="button"
                          onClick={() => openAuditModal('CISCE', 'boardExamWeightage')}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-mono font-bold text-amber-900 dark:text-amber-200 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Audit CISCE Claims &amp; Evidence</span>
                        </button>

                        {/* Time-Aware Metadata & Evidence Expander */}
                        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                            <span>Effective: {profile.syllabusYear}</span>
                            <span className="text-amber-700 font-bold">{profile.verificationStatus}</span>
                          </div>

                          <button
                            onClick={() => toggleEvidence('CISCE')}
                            className="w-full flex items-center justify-between pt-1 border-t border-[#E8E2D2] dark:border-[#2E3035] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] cursor-pointer"
                          >
                            <span>Official Evidence Citation</span>
                            {expandedEvidence.CISCE ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {expandedEvidence.CISCE && (
                            <div className="pt-2 space-y-1.5 text-[11px] text-[#292521] dark:text-[#E5E7EB]">
                              <div>
                                <strong>Source:</strong> {DEMO_CONCORD_CISCE_EVIDENCE.sourceTitle}
                              </div>
                              <div>
                                <strong>Authority:</strong> {DEMO_CONCORD_CISCE_EVIDENCE.sourceOrganisation}
                              </div>
                              <div>
                                <strong>Section:</strong> {DEMO_CONCORD_CISCE_EVIDENCE.pageSection}
                              </div>
                              <div>
                                <strong>Reviewed by:</strong> {DEMO_CONCORD_CISCE_EVIDENCE.academicReviewer} ({DEMO_CONCORD_CISCE_EVIDENCE.dateChecked})
                              </div>
                              <div className="pt-1.5 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => openAuditModal('CISCE', 'canonicalTerminology')}
                                  className="text-[10px] font-mono font-bold text-[#5A1832] dark:text-[#C29A52] underline cursor-pointer"
                                >
                                  Inspect Full Evidence Record &rarr;
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#F0EBE0] dark:border-[#222428]">
                        <button
                          onClick={() => onNavigateToEdition('ed-icse-c6')}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-amber-200 dark:border-amber-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
                        >
                          <span>Open ICSE Edition</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Column 3: Cambridge International */}
                {(() => {
                  const termClaim = getClaimRecord('Cambridge', 'canonicalTerminology');
                  const emphasisClaim = getClaimRecord('Cambridge', 'pedagogicalEmphasis');
                  const depthClaim = getClaimRecord('Cambridge', 'expectedDepth');
                  const weightageClaim = getClaimRecord('Cambridge', 'boardExamWeightage');
                  const testingClaim = getClaimRecord('Cambridge', 'testingPattern');
                  const policyClaim = getClaimRecord('Cambridge', 'frameworkApplicability');
                  const profile = INDEPENDENT_BOARD_PROFILES.Cambridge;

                  return (
                    <div className="p-5 md:p-6 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-[#141517] shadow-2xs flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        {/* Header with Board-Level Status */}
                        <div className="flex items-center justify-between border-b border-[#F0EBE0] dark:border-[#222428] pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                              Cambridge CAIE
                            </span>
                            <div className="text-[10px] text-[#6E6A64] dark:text-[#9CA3AF] font-mono mt-0.5">
                              {activeBand.cambridgeLevel} &bull; {profile.governingBody}
                            </div>
                          </div>
                          {getEvidenceBadge(
                            profile.verificationStatus,
                            () => openAuditModal('Cambridge', 'canonicalTerminology'),
                            true
                          )}
                        </div>

                        {profile.unverifiedModelWarning && (
                          <div className="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/30 text-[11px] text-purple-900 dark:text-purple-300 flex items-start space-x-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                            <span>{profile.unverifiedModelWarning}</span>
                          </div>
                        )}

                        {/* Terminology Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Canonical Board Terminology
                            </span>
                            {getEvidenceBadge(
                              termClaim.status,
                              () => openAuditModal('Cambridge', 'canonicalTerminology'),
                              true
                            )}
                          </div>
                          <div className="font-bold text-base text-[#292521] dark:text-[#F6F0E7] font-serif">
                            "{cambImpl?.canonicalTerminology || termClaim.claimValue}"
                          </div>
                        </div>

                        {/* Pedagogical Emphasis Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Pedagogical Emphasis
                            </span>
                            {getEvidenceBadge(
                              emphasisClaim.status,
                              () => openAuditModal('Cambridge', 'pedagogicalEmphasis'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cambImpl?.pedagogicalEmphasis || emphasisClaim.claimValue}
                          </p>
                        </div>

                        {/* Expected Depth Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Expected Depth &amp; Outlay
                            </span>
                            {getEvidenceBadge(
                              depthClaim.status,
                              () => openAuditModal('Cambridge', 'expectedDepth'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cambImpl?.scopeBoundary || depthClaim.claimValue}
                          </p>
                        </div>

                        {/* Board Exam Weightage Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Exam Weightage &amp; Slot
                            </span>
                            {getEvidenceBadge(
                              weightageClaim.status,
                              () => openAuditModal('Cambridge', 'boardExamWeightage'),
                              true
                            )}
                          </div>
                          <div className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                            {cambImpl?.boardExamWeightage || weightageClaim.claimValue}
                          </div>
                          {weightageClaim.status === 'UNVERIFIED_EDITORIAL_MODEL' && (
                            <p className="text-[10px] text-stone-600 dark:text-stone-400 italic">
                              * Pedagogical Baseline: CAIE assesses grammar organically through writing rubrics; no isolated grammatical marks.
                            </p>
                          )}
                        </div>

                        {/* Testing Pattern Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Assessment Paradigm
                            </span>
                            {getEvidenceBadge(
                              testingClaim.status,
                              () => openAuditModal('Cambridge', 'testingPattern'),
                              true
                            )}
                          </div>
                          <p className="veritas-body text-xs text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                            {cambImpl?.testingPattern || testingClaim.claimValue}
                          </p>
                        </div>

                        {/* Policy Framework Claim */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#6E6A64] dark:text-[#9CA3AF] uppercase tracking-wider">
                              Framework Policy Discipline
                            </span>
                            {getEvidenceBadge(
                              policyClaim.status,
                              () => openAuditModal('Cambridge', 'frameworkApplicability'),
                              true
                            )}
                          </div>
                          <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] font-mono">
                            {policyClaim.claimValue}
                          </p>
                        </div>

                        {/* Sample Prompt */}
                        <div className="p-3.5 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-1">
                          <div className="text-xs font-mono font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                            Typical Cambridge Task
                          </div>
                          <p className="text-xs text-[#292521] dark:text-[#F6F0E7] font-mono leading-relaxed">
                            {cambImpl?.sampleQuestionPrompt}
                          </p>
                        </div>

                        {/* Audit Claims Button */}
                        <button
                          type="button"
                          onClick={() => openAuditModal('Cambridge', 'boardExamWeightage')}
                          className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-xs font-mono font-bold text-purple-900 dark:text-purple-200 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Audit Cambridge Claims &amp; Evidence</span>
                        </button>

                        {/* Time-Aware Metadata & Evidence Expander */}
                        <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                            <span>Effective: {profile.syllabusYear}</span>
                            <span className="text-purple-700 font-bold">{profile.verificationStatus}</span>
                          </div>

                          <button
                            onClick={() => toggleEvidence('Cambridge')}
                            className="w-full flex items-center justify-between pt-1 border-t border-[#E8E2D2] dark:border-[#2E3035] text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] cursor-pointer"
                          >
                            <span>Official Evidence Citation</span>
                            {expandedEvidence.Cambridge ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {expandedEvidence.Cambridge && (
                            <div className="pt-2 space-y-1.5 text-[11px] text-[#292521] dark:text-[#E5E7EB]">
                              <div>
                                <strong>Source:</strong> {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.sourceTitle}
                              </div>
                              <div>
                                <strong>Authority:</strong> {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.sourceOrganisation}
                              </div>
                              <div>
                                <strong>Section:</strong> {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.pageSection}
                              </div>
                              <div>
                                <strong>Reviewed by:</strong> {DEMO_CONCORD_CAMBRIDGE_EVIDENCE.academicReviewer} ({DEMO_CONCORD_CAMBRIDGE_EVIDENCE.dateChecked})
                              </div>
                              <div className="pt-1.5 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => openAuditModal('Cambridge', 'canonicalTerminology')}
                                  className="text-[10px] font-mono font-bold text-[#5A1832] dark:text-[#C29A52] underline cursor-pointer"
                                >
                                  Inspect Full Evidence Record &rarr;
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#F0EBE0] dark:border-[#222428]">
                        <button
                          onClick={() => onNavigateToEdition('ed-camb-s7')}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-purple-200 dark:border-purple-800/40 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-colors cursor-pointer"
                        >
                          <span>Open Cambridge Edition</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* LAYER C — Book / Edition Implementations in VERITAS Titles */}
            <div className="p-6 md:p-7 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE0] dark:border-[#222428] pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#292521] text-white dark:bg-stone-700 uppercase tracking-wider">
                      Layer C
                    </span>
                    <h3 className="veritas-card-title text-base md:text-lg font-bold text-[#292521] dark:text-[#F6F0E7]">
                      Book / Edition Implementation in Active VERITAS Titles
                    </h3>
                  </div>
                  <p className="text-xs text-[#6E6A64] dark:text-[#9CA3AF] mt-0.5">
                    How "{activeConcept.name}" is instantiated into manuscript chapters, page counts, and exercise suites.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52]">
                  {bookImplementations.length} Active Book Bindings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bookImplementations.map((book, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035] space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            book.board === 'CBSE'
                              ? 'bg-blue-100 text-blue-800'
                              : book.board === 'CISCE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {book.board} &bull; {book.classOrStage}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {book.teachingDepth}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7] mt-1">
                        {book.bookTitle}
                      </h4>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#6E6A64] dark:text-[#9CA3AF]">
                      <div>
                        <strong>Chapter:</strong> Ch {book.chapterNumber}: {book.chapterTitle}
                      </div>
                      <div>
                        <strong>Edition Term:</strong> "{book.editionTerminology}"
                      </div>
                      <div>
                        <strong>Exercises:</strong> {book.sampleExercises[0]}
                      </div>
                    </div>

                    {onOpenBookPlanner && (
                      <button
                        onClick={() => onOpenBookPlanner(book.bookProjectId)}
                        className="w-full py-1.5 text-xs font-semibold text-[#5A1832] dark:text-[#C29A52] border border-[#CBBEAC] dark:border-[#5A1832] rounded-lg hover:bg-black/5 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <span>Open Book Planner</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Divergence & Acceleration Insights with Classification */}
            <div className="p-6 md:p-7 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-[#FAF8F5] dark:bg-[#141517] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52]">
                  <Sparkles className="w-4 h-4" />
                  <span>Curriculum Divergence &amp; Acceleration Insights</span>
                </div>
                <span className="text-xs font-mono text-[#6E6A64] dark:text-[#9CA3AF]">
                  Classified &amp; Author-Governed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#6E6A64] dark:text-[#9CA3AF] leading-relaxed">
                {divergenceInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#18191B] border border-[#E6DEC9] dark:border-[#28292D] space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            insight.classification === 'SOURCE_BASED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : insight.classification === 'EDITORIAL_ANALYSIS'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {insight.classification === 'SOURCE_BASED'
                            ? 'SOURCE-BASED'
                            : insight.classification === 'EDITORIAL_ANALYSIS'
                            ? 'EDITORIAL ANALYSIS'
                            : 'AI-SUGGESTED — UNVERIFIED'}
                        </span>

                        {insight.isAcceptedByAuthor && (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Accepted</span>
                          </span>
                        )}
                      </div>

                      <div className="font-serif font-bold text-sm text-[#292521] dark:text-[#F6F0E7] mt-2">
                        {insight.title}
                      </div>
                      <p className="mt-1 text-[#292521] dark:text-[#E5E7EB] leading-relaxed">
                        {insight.description}
                      </p>
                      {insight.sourceReference && (
                        <div className="mt-2 text-[10px] font-mono text-[#9A7438] dark:text-[#C29A52]">
                          Ref: {insight.sourceReference}
                        </div>
                      )}
                    </div>

                    {!insight.isAcceptedByAuthor && insight.classification === 'AI_SUGGESTED_UNVERIFIED' && (
                      <div className="pt-2 border-t border-[#F0EBE0] dark:border-[#28292D]">
                        <button
                          onClick={() => handleAcceptInsight(insight.id)}
                          className="w-full py-1.5 px-3 rounded-lg bg-[#5A1832] text-white text-xs font-semibold hover:bg-[#471327] transition-colors cursor-pointer"
                        >
                          Accept into Curriculum Record
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: SYSTEM-SPECIFIC SPIRAL PROGRESSION                            */}
        {/* ==================================================================== */}
        {activeStudioTab === 'progression' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#28292D] bg-white dark:bg-[#141517] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE0] dark:border-[#222428] pb-3">
                <div>
                  <div className="text-xs font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase tracking-wider">
                    Spiral Progression Engine &bull; {activeConcept.name}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#292521] dark:text-[#F6F0E7] mt-0.5">
                    System-Specific Progression Models
                  </h3>
                </div>

                <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#FAF8F5] dark:bg-[#1A1C1E] border border-[#E8E2D2] dark:border-[#2E3035]">
                  {(
                    [
                      { id: 'Compare', label: 'Compare All Systems' },
                      { id: 'CBSE', label: 'CBSE Progression' },
                      { id: 'CISCE', label: 'CISCE Progression' },
                      { id: 'Cambridge', label: 'Cambridge Progression' },
                      { id: 'Veritas', label: 'VERITAS Continuum' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProgressionSystemTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        progressionSystemTab === tab.id
                          ? 'bg-[#5A1832] text-white shadow-2xs'
                          : 'text-[#6E6A64] dark:text-[#9CA3AF] hover:bg-black/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compare All Systems Multi-Column View */}
              {progressionSystemTab === 'Compare' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E6DEC9] dark:border-[#28292D] bg-[#FAF8F5] dark:bg-[#1A1C1E]">
                        <th className="p-3 font-mono font-bold text-[#9A7438] dark:text-[#C29A52] uppercase">
                          Comparison Band
                        </th>
                        <th className="p-3 font-mono font-bold text-blue-800 dark:text-blue-300">
                          CBSE Progression
                        </th>
                        <th className="p-3 font-mono font-bold text-amber-800 dark:text-amber-300">
                          CISCE Progression
                        </th>
                        <th className="p-3 font-mono font-bold text-purple-800 dark:text-purple-300">
                          Cambridge Progression
                        </th>
                        <th className="p-3 font-mono font-bold text-[#5A1832] dark:text-[#C29A52]">
                          VERITAS Master Continuum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBE0] dark:divide-[#222428]">
                      {CROSS_SYSTEM_LEARNING_BANDS.map((band, i) => {
                        const cbseKey = `Class ${i + 3}`;
                        const cisceKey = `Class ${i + 3}`;
                        const cambKey =
                          i < 4
                            ? `Stage ${i + 3}`
                            : i === 4
                            ? `Stage 7`
                            : i === 5
                            ? `Stage 8`
                            : i === 6
                            ? `Stage 9`
                            : i === 7
                            ? `IGCSE Year 10`
                            : i === 8
                            ? `IGCSE Year 11`
                            : `AS & A Level`;

                        const cbseStep = systemProgressions.CBSE[cbseKey];
                        const cisceStep = systemProgressions.CISCE[cisceKey];
                        const cambStep = systemProgressions.Cambridge[cambKey];

                        return (
                          <tr key={band.bandId} className="hover:bg-[#FAF8F5] dark:hover:bg-[#18191B]">
                            <td className="p-3 font-mono font-bold text-[#292521] dark:text-[#F6F0E7]">
                              <div>{band.bandLabel}</div>
                              <div className="text-[10px] text-[#6E6A64] dark:text-[#9CA3AF] font-normal">
                                {band.ageBracket.split(' ')[0]}
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${getStageBadgeColor(
                                    cbseStep?.progressionStage || 'none'
                                  )}`}
                                >
                                  {cbseStep?.progressionStage || '—'}
                                </span>
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {band.cbseLevel}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] mt-1 leading-snug">
                                {cbseStep?.outcome}
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${getStageBadgeColor(
                                    cisceStep?.progressionStage || 'none'
                                  )}`}
                                >
                                  {cisceStep?.progressionStage || '—'}
                                </span>
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {band.cisceLevel}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] mt-1 leading-snug">
                                {cisceStep?.outcome}
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${getStageBadgeColor(
                                    cambStep?.progressionStage || 'none'
                                  )}`}
                                >
                                  {cambStep?.progressionStage || '—'}
                                </span>
                                <span className="font-semibold text-[#292521] dark:text-[#F6F0E7]">
                                  {band.cambridgeLevel}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] mt-1 leading-snug">
                                {cambStep?.outcome}
                              </div>
                            </td>

                            <td className="p-3 bg-[#FAF8F5] dark:bg-[#1A1C1E]">
                              <div className="flex items-center space-x-2">
                                <span className="w-6 h-6 rounded-md bg-[#5A1832] text-white flex items-center justify-center font-mono font-bold text-xs">
                                  {cbseStep?.progressionStage || 'M'}
                                </span>
                                <span className="font-bold text-[#5A1832] dark:text-[#C29A52]">
                                  Synthesis Level
                                </span>
                              </div>
                              <div className="text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] mt-1 leading-snug">
                                Consolidated multi-board spiral progression milestone.
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Single System Drilldowns */}
              {progressionSystemTab !== 'Compare' && (
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                  {Object.entries(
                    progressionSystemTab === 'CBSE'
                      ? systemProgressions.CBSE
                      : progressionSystemTab === 'CISCE'
                      ? systemProgressions.CISCE
                      : progressionSystemTab === 'Cambridge'
                      ? systemProgressions.Cambridge
                      : systemProgressions.VeritasRecommended
                  ).map(([stageKey, step]) => (
                    <div
                      key={stageKey}
                      className="p-3 rounded-xl border border-[#E6DEC9] dark:border-[#28292D] bg-[#FAF8F5] dark:bg-[#18191B] text-center space-y-1.5"
                    >
                      <div className="text-[11px] font-bold font-mono text-[#9A7438] dark:text-[#C29A52] truncate">
                        {stageKey}
                      </div>
                      <div
                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-sm my-1 border ${getStageBadgeColor(
                          step.progressionStage
                        )}`}
                      >
                        {step.progressionStage}
                      </div>
                      <div className="text-[11px] text-[#6E6A64] dark:text-[#9CA3AF] leading-snug line-clamp-3">
                        {step.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CURRICULUM COVERAGE MATRIX                                    */}
        {/* ==================================================================== */}
        {activeStudioTab === 'coverage' && (
          <CurriculumCoverageMatrixView
            onSelectConcept={(conceptId) => {
              setSelectedConceptId(conceptId);
              setActiveStudioTab('comparative');
            }}
          />
        )}

        {/* ==================================================================== */}
        {/* TAB 4: FRAMEWORK & POLICY PROFILES                                   */}
        {/* ==================================================================== */}
        {activeStudioTab === 'frameworks' && <FrameworkProfilesView />}

        {/* ==================================================================== */}
        {/* TAB 5: EARLY YEARS FOUNDATION (K–2 ARCHITECTURE)                      */}
        {/* ==================================================================== */}
        {activeStudioTab === 'early_years' && <EarlyYearsArchitectureView />}

        {/* Concept Lineage Modal */}
        {isLineageModalOpen && (
          <ConceptLineageModal
            concept={activeConcept}
            seriesProject={seriesProject}
            onClose={() => setIsLineageModalOpen(false)}
            onOpenBookPlanner={onOpenBookPlanner}
            onOpenChapterStudio={onOpenChapterStudio}
            onOpenScopeSequence={onOpenScopeSequence}
          />
        )}

        {/* Claim Verification Audit Modal */}
        {activeClaimAudit && (
          <ClaimVerificationDetailsModal
            claimRecord={activeClaimAudit.claimRecord}
            boardName={activeClaimAudit.boardName}
            conceptName={activeClaimAudit.conceptName}
            onClose={() => setActiveClaimAudit(null)}
            onUpdateClaim={handleUpdateClaimRecord}
          />
        )}
      </div>
    </div>
  );
};
