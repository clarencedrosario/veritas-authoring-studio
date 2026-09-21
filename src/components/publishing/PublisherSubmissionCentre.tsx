import React, { useState } from 'react';
import {
  Send,
  FileText,
  BookOpen,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Layers,
  Award,
  Users,
  Eye,
  ShieldCheck,
  Edit3,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ThumbsUp,
  RotateCcw,
  Trash2,
  Info,
} from 'lucide-react';
import {
  BookProject,
  GrammarSeriesProject,
  ClassCurriculumBook,
  PublisherProposalData,
} from '../../types';
import { getDefaultPublisherProposal } from '../../utils/bookProjectUtils';
import { validateISBN } from '../../utils/isbnUtils';

interface PublisherSubmissionCentreProps {
  project: BookProject;
  seriesProject: GrammarSeriesProject;
  book?: ClassCurriculumBook;
  onUpdateProposal: (proposal: PublisherProposalData) => void;
  onNavigateToTab?: (tab: string) => void;
}

type SectionCompleteness = 'Complete' | 'Partial' | 'Missing' | 'Needs Review';

export const PublisherSubmissionCentre: React.FC<PublisherSubmissionCentreProps> = ({
  project,
  seriesProject,
  book,
  onUpdateProposal,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'dossier' | 'proposal_generator' | 'sample_package' | 'preflight'
  >('dossier');

  // Proposal State
  const [proposal, setProposal] = useState<PublisherProposalData>(() => {
    return (
      project.proposalData ||
      getDefaultPublisherProposal(project, book || ({} as any), seriesProject)
    );
  });

  const [copiedProposal, setCopiedProposal] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [showPreflightBanner, setShowPreflightBanner] = useState(true);

  // Sample Package Selected Checklist
  const [sampleChecklist, setSampleChecklist] = useState({
    coverPage: true,
    bookProposal: true,
    tableOfContents: true,
    sampleChapters: true,
    sampleExercises: true,
    sampleAssessment: true,
    sampleAnswerKey: true,
    authorProfile: true,
  });

  const topics = book?.topics || [];
  const testPapers = book?.testPapers || [];
  const [selectedSampleChapterIds, setSelectedSampleChapterIds] = useState<string[]>(() => {
    return topics.slice(0, 2).map((t) => t.id);
  });

  const isAuthorConfigured = Boolean(
    project.author &&
    project.author !== 'Not entered' &&
    project.author !== 'Not assigned' &&
    project.author !== '—' &&
    project.author.trim().length > 0
  );

  const authorDisplay = isAuthorConfigured ? project.author : 'Not entered';

  // Calculate completeness status for each of the 12 sections
  const getSectionStatus = (sectionNumber: number): { status: SectionCompleteness; reason: string } => {
    switch (sectionNumber) {
      case 1: // Book Information
        if (!project.bookTitle || !project.board) return { status: 'Missing', reason: 'Title or board missing' };
        if (!isAuthorConfigured || project.isbnStatus === 'Not Assigned') return { status: 'Partial', reason: 'Author or ISBN unassigned' };
        return { status: 'Complete', reason: 'All core publishing metadata verified' };

      case 2: // Series Information
        if (!seriesProject.seriesTitle) return { status: 'Missing', reason: 'Series title not configured' };
        return { status: 'Complete', reason: 'Tri-board series scope aligned (Classes 3–12)' };

      case 3: // Author Profile
        if (!isAuthorConfigured) return { status: 'Missing', reason: 'Author profile not yet entered by user' };
        if (proposal.authorBiographyApproval === 'AI Draft') return { status: 'Needs Review', reason: 'Biography draft pending author sign-off' };
        return { status: 'Complete', reason: 'Author biography approved' };

      case 4: // Market Positioning
        if (!proposal.marketPositioning || proposal.marketPositioning.includes('requires author review')) return { status: 'Missing', reason: 'Market positioning empty' };
        if (proposal.marketPositioningApproval === 'AI Draft') return { status: 'Needs Review', reason: 'AI Draft pending author approval' };
        return { status: 'Complete', reason: 'Author approved' };

      case 5: // Pedagogical Approach
        if (!proposal.pedagogicalPhilosophy) return { status: 'Missing', reason: 'Pedagogical text missing' };
        if (proposal.pedagogicalPhilosophyApproval === 'AI Draft') return { status: 'Needs Review', reason: 'AI Draft pending author review' };
        return { status: 'Complete', reason: 'Methodology confirmed' };

      case 6: // Curriculum Alignment
        if (!project.board) return { status: 'Missing', reason: 'Board not assigned' };
        if (proposal.curriculumRationaleApproval === 'AI Draft') return { status: 'Needs Review', reason: 'AI Draft pending board check' };
        return { status: 'Complete', reason: `Aligned with ${project.board}` };

      case 7: // Sample Chapters
        if (topics.length === 0) return { status: 'Missing', reason: 'No authored chapters in book' };
        return { status: 'Complete', reason: `${topics.length} authored chapter(s) ready for evaluation` };

      case 8: // Table of Contents
        if (topics.length >= 3) return { status: 'Complete', reason: `${topics.length} chapters structured` };
        if (topics.length >= 1) return { status: 'Partial', reason: `${topics.length} authored of recommended 12 chapters` };
        return { status: 'Missing', reason: 'No TOC topics outlined' };

      case 9: // Assessment Model
        if (testPapers.length > 0) return { status: 'Complete', reason: `${testPapers.length} assessment blueprint(s) configured` };
        return { status: 'Partial', reason: 'Chapter unit quizzes present, formal papers pending' };

      case 10: // Visual Approach & Diagrams
        const visualsCount = topics.reduce((acc, t) => {
          const blocks = ((t as any).contentBlocks || t.studioChapter?.sections?.flatMap((s: any) => s.blocks) || []) as any[];
          return acc + blocks.filter((b: any) => b.type === 'callout_box' || b.type === 'table_block').length;
        }, 0);
        if (visualsCount > 0) return { status: 'Complete', reason: `${visualsCount} syntax diagram(s) & callouts` };
        return { status: 'Partial', reason: 'Text formatting ready, formal syntax tree artwork pending' };

      case 11: // Competing Titles Analysis
        if (!proposal.competingTitlesAnalysis) return { status: 'Missing', reason: 'No competitive titles listed' };
        if (proposal.competingTitlesApproval === 'AI Draft') return { status: 'Needs Review', reason: 'AI Draft pending author approval' };
        return { status: 'Complete', reason: 'Competitive differentiation approved' };

      case 12: // Production Specification
        if (!project.trimSize || !project.targetPageCount) return { status: 'Partial', reason: 'Trim or page count unconfirmed' };
        return { status: 'Complete', reason: `${project.trimSize}, ${project.targetPageCount} pages` };

      default:
        return { status: 'Partial', reason: 'Pending audit' };
    }
  };

  const getStatusBadgeClass = (status: SectionCompleteness) => {
    switch (status) {
      case 'Complete':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Partial':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Needs Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Missing':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  // Preflight validation checks
  const preflightChecks = [
    {
      id: 'title',
      label: 'Project Title & Scope Specified',
      status: project.bookTitle ? 'ready' : 'blocking',
      details: project.bookTitle || 'Book title is missing',
    },
    {
      id: 'board',
      label: 'Target Educational Board Configured',
      status: project.board ? 'ready' : 'blocking',
      details: `${project.board} (${project.classOrStage})`,
    },
    {
      id: 'grade',
      label: 'Target Class / Stage Specified',
      status: project.classOrStage ? 'ready' : 'blocking',
      details: project.classOrStage || 'Class/Stage not set',
    },
    {
      id: 'author',
      label: 'Author Name Specified (Non-Invented)',
      status: isAuthorConfigured ? 'ready' : 'warning',
      details: isAuthorConfigured ? project.author : 'Author is currently "Not entered". Official submissions should list the primary author.',
    },
    {
      id: 'sampleChapter',
      label: 'At Least 1 Fully Authored Sample Chapter',
      status: topics.length >= 1 ? 'ready' : 'blocking',
      details: topics.length >= 1 ? `${topics[0].title} with rule cards & exercises` : 'No authored chapters available',
    },
    {
      id: 'tocChapters',
      label: 'Table of Contents Scope (≥3 Units Planned)',
      status: topics.length >= 3 ? 'ready' : 'warning',
      details: topics.length >= 3 ? `${topics.length} chapters authored` : `Currently ${topics.length} chapter(s) authored. A standard publisher proposal should outline at least 3–12 units.`,
    },
    {
      id: 'answerKeys',
      label: 'Answer Keys Present in Sample Exercises',
      status: topics.some((t) => t.exercises?.some((e) => e.questions.some((q) => q.correctAnswer || (q as any).answerKey))) ? 'ready' : 'warning',
      details: 'Evaluated for teacher guide and student self-check accuracy.',
    },
  ];

  const hasBlockingIssues = preflightChecks.some((c) => c.status === 'blocking');
  const hasWarnings = preflightChecks.some((c) => c.status === 'warning');

  const handleRegenerateProposal = () => {
    setIsGeneratingProposal(true);
    setTimeout(() => {
      const fresh = getDefaultPublisherProposal(project, book || ({} as any), seriesProject);
      setProposal(fresh);
      onUpdateProposal(fresh);
      setIsGeneratingProposal(false);
    }, 500);
  };

  const handleUpdateApproval = (
    field:
      | 'seriesOverviewApproval'
      | 'bookOverviewApproval'
      | 'targetReadershipApproval'
      | 'curriculumRationaleApproval'
      | 'pedagogicalPhilosophyApproval'
      | 'marketPositioningApproval'
      | 'competingTitlesApproval'
      | 'authorBiographyApproval',
    newStatus: 'Author Approved' | 'AI Draft' | 'Needs Review'
  ) => {
    const updated = { ...proposal, [field]: newStatus, lastUpdated: new Date().toISOString() };
    setProposal(updated);
    onUpdateProposal(updated);
  };

  const handleCopyProposalMarkdown = () => {
    const watermarkNote = hasWarnings || hasBlockingIssues ? '> **NOTE**: DRAFT PUBLISHER PROPOSAL — PRE-SUBMISSION EVALUATION COPY ONLY.\n\n' : '';
    const md = `${watermarkNote}# BOOK PROPOSAL: ${proposal.titlePageTitle}
${proposal.titlePageSubtitle ? `*${proposal.titlePageSubtitle}*\n` : ''}
**Series**: ${seriesProject.seriesTitle} (Classes 3 to 12 Continuum)
**Target Board**: ${project.board} (${project.classOrStage})
**Author**: ${authorDisplay} | **Publisher**: ${project.publisher || 'To be confirmed'}
**Project Code**: ${project.internalProjectCode || '—'}
**ISBN Status**: ${project.isbnStatus || 'Not Assigned'}

---

## 1. Executive Summary & Book Overview
${proposal.bookOverview}
*(Status: ${proposal.bookOverviewApproval || 'AI Draft'})*

## 2. Series Context
${proposal.seriesOverview}
*(Status: ${proposal.seriesOverviewApproval || 'AI Draft'})*

## 3. Target Readership & Market Need
${proposal.targetReadership}
*(Status: ${proposal.targetReadershipApproval || 'AI Draft'})*

## 4. Curriculum Rationale (${project.board})
${proposal.curriculumRationale}
*(Status: ${proposal.curriculumRationaleApproval || 'AI Draft'})*

## 5. Pedagogical Philosophy & Methodology
${proposal.pedagogicalPhilosophy}
*(Status: ${proposal.pedagogicalPhilosophyApproval || 'AI Draft'})*

## 6. Distinctive Differentiating Features
${proposal.distinctiveFeatures.map((f) => `- ${f}`).join('\n')}

## 7. Chapter Architecture
${proposal.chapterArchitecture}

## 8. Exercise & Assessment Framework
${proposal.exerciseArchitecture}

${proposal.assessmentApproach}

## 9. Tri-Board Adaptation Strategy
${proposal.crossBoardStrategy}

## 10. Table of Contents
${proposal.sampleTocDescription}

## 11. Author & Editorial Profile
${proposal.authorBiography}
*(Status: ${proposal.authorBiographyApproval || 'AI Draft'})*

## 12. Technical & Production Specifications
- **Trim Size**: ${proposal.productionSpecifications.trimSize}
- **Target Page Count**: ${proposal.productionSpecifications.targetPageCount} pages
- **Estimated Word Count**: ${proposal.estimatedManuscriptLengthWords} words
- **Colour Intent**: ${proposal.productionSpecifications.colorIntent}
- **Paper Stock**: ${proposal.productionSpecifications.paperStock}
- **Binding**: ${proposal.productionSpecifications.bindingType}
- **Current Production Status**: ${proposal.currentProductionStatus}

---
*Generated by Academic Publishing Engine. Evidence-based submission package.*`;

    navigator.clipboard.writeText(md);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const handlePrintOrExportPackage = () => {
    window.print();
  };

  return (
    <div id="publisher-submission-centre" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#5A1832] via-[#431225] to-[#2B0B18] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C29A52]/30">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C29A52] text-slate-950 font-serif">
              Publisher Handoff & Submission Suite
            </span>
            <span className="text-xs text-[#E6C994]/80">
              Project: {project.internalProjectCode || 'BK-CBSE-C6-2026'}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#FAF8F2]">
            Publisher Submission Centre
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Data-driven publisher dossiers and sample packages for <span className="text-[#E6C994] font-semibold">{project.bookTitle}</span>. All content is anchored in verified manuscript data with explicit AI draft labels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab('dossier')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'dossier'
                ? 'bg-[#C29A52] text-slate-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            12-Section Dossier
          </button>
          <button
            onClick={() => setActiveSubTab('proposal_generator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'proposal_generator'
                ? 'bg-[#C29A52] text-slate-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Book Proposal
          </button>
          <button
            onClick={() => setActiveSubTab('preflight')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'preflight'
                ? 'bg-[#C29A52] text-slate-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Preflight Audit</span>
            {hasBlockingIssues && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('sample_package')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'sample_package'
                ? 'bg-[#C29A52] text-slate-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Sample Manuscript Package
          </button>
        </div>
      </div>

      {/* Preflight Validation Notice Banner */}
      {showPreflightBanner && (hasBlockingIssues || hasWarnings) && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-sm font-serif">
                Pre-Submission Validation Notice
              </span>
              <p className="leading-relaxed">
                {hasBlockingIssues
                  ? 'Critical information is missing before this proposal can be submitted to an official commissioning editor.'
                  : 'Proposal includes warnings (e.g. author name not entered, or AI draft sections pending approval). Exports will carry a "Draft Proposal" watermark until resolved.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('preflight')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold shrink-0 hover:bg-amber-700 transition-colors"
          >
            Review Checks
          </button>
        </div>
      )}

      {/* SUB-VIEW 1: 12-SECTION DOSSIER (DATA-DRIVEN WITH STATUS INDICATORS) */}
      {activeSubTab === 'dossier' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
              12-Section Publisher Dossier Overview
            </h3>
            <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
              Status calculated from actual manuscript database
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: 1,
                title: 'Book Information',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <div><strong>Title:</strong> {project.bookTitle}</div>
                    <div><strong>Subtitle:</strong> {project.subtitle || '—'}</div>
                    <div><strong>Edition:</strong> {project.edition} (Rev 1.0)</div>
                    <div><strong>Subject:</strong> {project.subject}</div>
                    <div><strong>Target Age:</strong> {project.targetAge}</div>
                    <div><strong>ISBN Status:</strong> {project.isbnPlaceholder} ({project.isbnStatus})</div>
                  </div>
                ),
              },
              {
                num: 2,
                title: 'Series Information',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <div><strong>Series:</strong> {seriesProject.seriesTitle}</div>
                    <div><strong>Scope:</strong> Classes 3 to 12 Continuum</div>
                    <div><strong>Boards:</strong> CBSE, CISCE, Cambridge International</div>
                    <div><strong>Publisher:</strong> {project.publisher || 'To be confirmed'}</div>
                    <div><strong>Language:</strong> {project.language}</div>
                  </div>
                ),
              },
              {
                num: 3,
                title: 'Author & Editor Profile',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <div><strong>Author:</strong> {authorDisplay}</div>
                    <div><strong>Commissioning Editor:</strong> {project.editor || 'Not assigned'}</div>
                    <div><strong>Status:</strong> {proposal.authorBiographyApproval || 'AI Draft'}</div>
                    <p className="line-clamp-2 italic text-[11px] pt-1">
                      "{proposal.authorBiography}"
                    </p>
                  </div>
                ),
              },
              {
                num: 4,
                title: 'Market Positioning',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="line-clamp-3 leading-relaxed">
                      {proposal.marketPositioning}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1">Approval: {proposal.marketPositioningApproval || 'AI Draft'}</div>
                  </div>
                ),
              },
              {
                num: 5,
                title: 'Pedagogical Approach',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="line-clamp-3 leading-relaxed">
                      {proposal.pedagogicalPhilosophy}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1">Approval: {proposal.pedagogicalPhilosophyApproval || 'AI Draft'}</div>
                  </div>
                ),
              },
              {
                num: 6,
                title: 'Curriculum Alignment',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="line-clamp-3 leading-relaxed">
                      {proposal.curriculumRationale}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1">Board: {project.board}</div>
                  </div>
                ),
              },
              {
                num: 7,
                title: 'Sample Chapters',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    {topics.length > 0 ? (
                      topics.slice(0, 3).map((t, idx) => (
                        <div key={t.id} className="flex items-center justify-between">
                          <span className="truncate max-w-[170px]">Unit {idx + 1}: {t.title}</span>
                          <span className="text-[10px] font-mono text-emerald-600">Complete</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-rose-500 italic">No authored chapters yet.</div>
                    )}
                  </div>
                ),
              },
              {
                num: 8,
                title: 'Table of Contents Architecture',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="leading-relaxed">
                      {topics.length} of recommended 12 chapters authored in volume matrix.
                    </p>
                    <div className="text-[10px] text-slate-500">Each chapter adheres to 8-part pedagogical architecture.</div>
                  </div>
                ),
              },
              {
                num: 9,
                title: 'Assessment Model',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="line-clamp-3 leading-relaxed">
                      {proposal.assessmentApproach}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1">{testPapers.length} board-style test paper(s)</div>
                  </div>
                ),
              },
              {
                num: 10,
                title: 'Visual Approach & Diagrams',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="leading-relaxed">
                      Custom syntax tree diagrams, contrastive inflection boxes, and dedicated error alerts.
                    </p>
                    <div className="text-[10px] text-slate-500">Euroscale CMYK full-color process.</div>
                  </div>
                ),
              },
              {
                num: 11,
                title: 'Competing Titles & Differentiation',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p className="line-clamp-3 leading-relaxed">
                      {proposal.competingTitlesAnalysis}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-1">Approval: {proposal.competingTitlesApproval || 'AI Draft'}</div>
                  </div>
                ),
              },
              {
                num: 12,
                title: 'Production Specification',
                content: (
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <div><strong>Trim Size:</strong> {proposal.productionSpecifications.trimSize}</div>
                    <div><strong>Target Pages:</strong> {proposal.productionSpecifications.targetPageCount} pages</div>
                    <div><strong>Word Count:</strong> ~{proposal.estimatedManuscriptLengthWords.toLocaleString()} words</div>
                    <div><strong>Color:</strong> {proposal.productionSpecifications.colorIntent}</div>
                    <div><strong>Binding:</strong> {proposal.productionSpecifications.bindingType}</div>
                  </div>
                ),
              },
            ].map((section) => {
              const { status, reason } = getSectionStatus(section.num);
              return (
                <div
                  key={section.num}
                  className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest text-[#5A1832] dark:text-[#E6C994] uppercase">
                      Section {section.num}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                        status
                      )}`}
                      title={reason}
                    >
                      {status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                    {section.title}
                  </h4>

                  {section.content}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PREFLIGHT AUDIT REPORT */}
      {activeSubTab === 'preflight' && (
        <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Pre-Submission Validation Report
              </h3>
              <p className="text-xs text-slate-500">
                Formal publisher gate check ensuring no false data or unverified claims reach commissioning editors.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                hasBlockingIssues
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  : hasWarnings
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {hasBlockingIssues ? 'Blocked by Critical Gaps' : hasWarnings ? 'Ready with Draft Watermark' : 'Fully Publisher Ready'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {preflightChecks.map((check) => (
              <div
                key={check.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  {check.status === 'ready' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : check.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                      {check.label}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {check.details}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  check.status === 'ready'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : check.status === 'warning'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {check.status}
                </span>
              </div>
            ))}
          </div>

          {/* Action guidance */}
          <div className="p-4 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/70 dark:border-[#4f2c3d] text-xs space-y-2">
            <span className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7]">
              Publishing Truth Layer Principle
            </span>
            <p className="text-[#71685E] dark:text-[#c9b9a6] leading-relaxed">
              VERITAS never fabricates ISBNs, commissioning editors, or mock reviews. If your project is still in early authoring (e.g. 1 completed unit), generate an evaluation dossier marked as a "Draft Proposal" rather than asserting a finalized commercial product.
            </p>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: EDITABLE BOOK PROPOSAL WITH AI DRAFT CONTROLS */}
      {activeSubTab === 'proposal_generator' && (
        <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Comprehensive Publisher Proposal
              </h3>
              <p className="text-xs text-slate-500">
                AI draft sections must be reviewed and approved by the author before official submission.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRegenerateProposal}
                disabled={isGeneratingProposal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C29A52]" />
                <span>{isGeneratingProposal ? 'Generating...' : 'Refresh AI Draft'}</span>
              </button>

              <button
                onClick={handleCopyProposalMarkdown}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#5A1832] hover:bg-[#431225] text-white flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                {copiedProposal ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Proposal Editor Fields with AI Review Badges & Controls */}
          <div className="space-y-5 text-xs">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title Page Title
                </label>
                <input
                  type="text"
                  value={proposal.titlePageTitle}
                  onChange={(e) =>
                    setProposal({ ...proposal, titlePageTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title Page Subtitle
                </label>
                <input
                  type="text"
                  value={proposal.titlePageSubtitle || ''}
                  onChange={(e) =>
                    setProposal({ ...proposal, titlePageSubtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Executive Overview with AI Draft Controls */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Executive Book Overview
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    proposal.bookOverviewApproval === 'Author Approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {proposal.bookOverviewApproval || 'AI Draft — Pending Author Review'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateApproval(
                        'bookOverviewApproval',
                        proposal.bookOverviewApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                      )
                    }
                    className="flex items-center space-x-1 text-xs text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{proposal.bookOverviewApproval === 'Author Approved' ? 'Mark as Draft' : 'Approve'}</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={proposal.bookOverview}
                onChange={(e) => setProposal({ ...proposal, bookOverview: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            {/* Series Architecture Context with AI Draft Controls */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Series Architecture Context
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    proposal.seriesOverviewApproval === 'Author Approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {proposal.seriesOverviewApproval || 'AI Draft — Pending Author Review'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateApproval(
                        'seriesOverviewApproval',
                        proposal.seriesOverviewApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                      )
                    }
                    className="flex items-center space-x-1 text-xs text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{proposal.seriesOverviewApproval === 'Author Approved' ? 'Mark as Draft' : 'Approve'}</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={proposal.seriesOverview}
                onChange={(e) => setProposal({ ...proposal, seriesOverview: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            {/* Target Readership & Curriculum Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Target Readership
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateApproval(
                        'targetReadershipApproval',
                        proposal.targetReadershipApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                      )
                    }
                    className="text-[11px] text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    {proposal.targetReadershipApproval === 'Author Approved' ? 'Approved' : 'Approve Draft'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={proposal.targetReadership}
                  onChange={(e) =>
                    setProposal({ ...proposal, targetReadership: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Curriculum Framework Rationale
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateApproval(
                        'curriculumRationaleApproval',
                        proposal.curriculumRationaleApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                      )
                    }
                    className="text-[11px] text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    {proposal.curriculumRationaleApproval === 'Author Approved' ? 'Approved' : 'Approve Draft'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={proposal.curriculumRationale}
                  onChange={(e) =>
                    setProposal({ ...proposal, curriculumRationale: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>
            </div>

            {/* Pedagogical Philosophy & Methodology */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Pedagogical Philosophy & Methodology
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateApproval(
                      'pedagogicalPhilosophyApproval',
                      proposal.pedagogicalPhilosophyApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                    )
                  }
                  className="text-[11px] text-[#5A1832] dark:text-[#C29A52] hover:underline"
                >
                  {proposal.pedagogicalPhilosophyApproval === 'Author Approved' ? 'Approved' : 'Approve Draft'}
                </button>
              </div>
              <textarea
                rows={3}
                value={proposal.pedagogicalPhilosophy}
                onChange={(e) =>
                  setProposal({ ...proposal, pedagogicalPhilosophy: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
              />
            </div>

            {/* Distinctive Features */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Distinctive Differentiating Features (One per line)
              </label>
              <textarea
                rows={4}
                value={proposal.distinctiveFeatures.join('\n')}
                onChange={(e) =>
                  setProposal({
                    ...proposal,
                    distinctiveFeatures: e.target.value.split('\n').filter((l) => l.trim()),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Competing Titles & Author Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Competing Titles Analysis
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateApproval(
                        'competingTitlesApproval',
                        proposal.competingTitlesApproval === 'Author Approved' ? 'AI Draft' : 'Author Approved'
                      )
                    }
                    className="text-[11px] text-[#5A1832] dark:text-[#C29A52] hover:underline"
                  >
                    {proposal.competingTitlesApproval === 'Author Approved' ? 'Approved' : 'Approve Draft'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={proposal.competingTitlesAnalysis || ''}
                  onChange={(e) =>
                    setProposal({ ...proposal, competingTitlesAnalysis: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Author Biography (Author-Supplied Only)
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isAuthorConfigured ? 'Entered' : 'Unset'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={proposal.authorBiography || ''}
                  onChange={(e) =>
                    setProposal({ ...proposal, authorBiography: e.target.value })
                  }
                  placeholder="Enter genuine author profile, degrees, institutions, and previous publications."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SAMPLE MANUSCRIPT PACKAGE */}
      {activeSubTab === 'sample_package' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121b2d] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Publisher Sample PDF Package
                </h3>
                <p className="text-xs text-slate-500">
                  Assemble and print a bespoke evaluation package directly utilizing the existing physical layout engine.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('textbook_exporter')}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in Layout & Export</span>
                  </button>
                )}

                <button
                  onClick={handlePrintOrExportPackage}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#5A1832] hover:bg-[#431225] text-white flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sample PDF Package</span>
                </button>
              </div>
            </div>

            {/* Checklist of Inclusion */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Package Content Checklist:
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: 'coverPage', label: 'Cover / Title Page' },
                  { key: 'bookProposal', label: 'Book Proposal Dossier' },
                  { key: 'tableOfContents', label: 'Table of Contents' },
                  { key: 'sampleChapters', label: 'Sample Chapters' },
                  { key: 'sampleExercises', label: 'Sample Exercises' },
                  { key: 'sampleAssessment', label: 'Sample Assessment' },
                  { key: 'sampleAnswerKey', label: 'Teacher Answer Key' },
                  { key: 'authorProfile', label: 'Author Profile' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center space-x-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={(sampleChecklist as any)[item.key]}
                      onChange={(e) =>
                        setSampleChecklist({
                          ...sampleChecklist,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="rounded text-[#5A1832] focus:ring-[#5A1832]"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sample Chapter Selector */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Authored Chapters for Evaluation:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topics.map((t, idx) => {
                  const isSelected = selectedSampleChapterIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSampleChapterIds(selectedSampleChapterIds.filter((id) => id !== t.id));
                        } else {
                          setSelectedSampleChapterIds([...selectedSampleChapterIds, t.id]);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#5A1832] bg-[#5A1832]/5 dark:bg-[#5A1832]/20 ring-1 ring-[#5A1832]'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100">
                          Unit {idx + 1}: {t.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5A1832] dark:text-[#E6C994]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                        {t.definitions?.length || 0} rules • {t.exercises?.length || 0} exercises
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Paper Preview Card with Watermark */}
            <div className="mt-6 p-6 bg-[#F6F0E7] dark:bg-[#0c1424] rounded-xl border border-[#C29A52]/40 shadow-inner relative">
              {(hasBlockingIssues || hasWarnings) && (
                <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-3 py-1 rounded text-xs font-mono font-bold tracking-wider">
                  DRAFT PROPOSAL — PRE-SUBMISSION
                </div>
              )}
              <div className="max-w-2xl mx-auto bg-white dark:bg-[#121b2d] p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <span className="text-[10px] tracking-widest uppercase font-serif text-[#5A1832] dark:text-[#E6C994]">
                    Publisher Evaluation Manuscript
                  </span>
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
                    {project.bookTitle}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {project.subtitle} • {project.board} ({project.classOrStage})
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Author: {authorDisplay} • Publisher: {project.publisher || 'To be confirmed'} • Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    <strong>Executive Summary:</strong> {proposal.bookOverview}
                  </p>
                  <p>
                    <strong>Pedagogy:</strong> {proposal.pedagogicalPhilosophy}
                  </p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Enclosed Sample Materials:
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <li>Full 12-Section Academic Publishing Proposal</li>
                      <li>Curriculum Matrix & Table of Contents</li>
                      <li>
                        {selectedSampleChapterIds.length} Authored Unit(s) with Rule Cards, Exercises & Answer Keys
                      </li>
                      <li>{project.board} Diagnostic Assessment Material</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
