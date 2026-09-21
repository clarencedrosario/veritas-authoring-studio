import React, { useState } from 'react';
import {
  Globe2,
  BookOpen,
  BookMarked,
  Layers,
  Plus,
  BarChart3,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  Info,
  Calendar,
  Users,
  Compass,
  Bookmark,
  Share2,
  FileText,
  Filter,
} from 'lucide-react';
import {
  GrammarSeriesProject,
  CurriculumSystemId,
  GrammarClassLevel,
  BookProject,
} from '../../types';
import { getInitialBookProjects } from '../../utils/bookProjectUtils';
import { PublishingBreadcrumbs } from './PublishingBreadcrumbs';
import { SeriesProgressionAuditView } from './SeriesProgressionAuditView';
import { CreateNewBookProjectModal } from './CreateNewBookProjectModal';

interface SeriesStudioViewProps {
  seriesProject: GrammarSeriesProject;
  onUpdateSeriesProject: (updated: GrammarSeriesProject) => void;
  onOpenBookProjects: () => void;
  onOpenBookPlanner: (projectId: string) => void;
  onOpenCurriculumMapping: () => void;
  onOpenScopeSequence: () => void;
  onOpenPublisherSubmission?: () => void;
  onOpenChapterStudio?: (chapterId?: string) => void;
}

export type SeriesStudioSection =
  | 'overview'
  | 'progression'
  | 'systems'
  | 'library_range'
  | 'audit'
  | 'roadmap';

export const SeriesStudioView: React.FC<SeriesStudioViewProps> = ({
  seriesProject,
  onUpdateSeriesProject,
  onOpenBookProjects,
  onOpenBookPlanner,
  onOpenCurriculumMapping,
  onOpenScopeSequence,
  onOpenPublisherSubmission,
  onOpenChapterStudio,
}) => {
  const [activeSection, setActiveSection] = useState<SeriesStudioSection>('overview');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('ALL');

  // Load Book Projects
  const bookProjectsMap: Record<string, BookProject> =
    seriesProject.bookProjects && Object.keys(seriesProject.bookProjects).length > 0
      ? seriesProject.bookProjects
      : getInitialBookProjects(seriesProject);

  const bookProjectsList = Object.values(bookProjectsMap);

  // Series Statistics
  const totalBooks = bookProjectsList.length;
  const inPlanning = bookProjectsList.filter((b) => b.status === 'Planning' || b.status === 'Curriculum Mapping').length;
  const inAuthoring = bookProjectsList.filter((b) => b.status === 'Authoring').length;
  const inReview = bookProjectsList.filter((b) => b.status === 'Academic Review' || b.status === 'Assessment Review').length;
  const layoutReady = bookProjectsList.filter((b) => b.status === 'Layout' || b.status === 'Proofreading' || b.status === 'Publisher Ready').length;
  const published = bookProjectsList.filter((b) => b.status === 'Published').length;

  const cbseBooks = bookProjectsList.filter((b) => b.board === 'CBSE');
  const cisceBooks = bookProjectsList.filter((b) => b.board === 'CISCE');
  const cambridgeBooks = bookProjectsList.filter((b) => b.board === 'Cambridge');

  // Complete K-12 publishing roadmap levels (supporting Kindergarten, 1, 2 through 12, plus Cambridge stages)
  const fullSeriesRoadmap = [
    {
      level: 'Kindergarten / Early Years',
      stageCode: 'KG',
      age: 'Ages 4–5',
      cbseTitle: 'Early Language Play & Phonological Awareness (KG)',
      cisceTitle: 'Pre-Primary Foundational English (KG)',
      cambridgeTitle: 'Cambridge Early Years Communication',
      status: 'Planned (Phase 5)',
      band: 'Foundational',
    },
    {
      level: 'Class / Grade 1',
      stageCode: 'C1',
      age: 'Ages 5–6',
      cbseTitle: 'Foundational Grammar & Sentence Building 1',
      cisceTitle: 'ICSE Preparatory English Language 1',
      cambridgeTitle: 'Cambridge Primary English Stage 1',
      status: 'Planned (Phase 5)',
      band: 'Foundational',
    },
    {
      level: 'Class / Grade 2',
      stageCode: 'C2',
      age: 'Ages 6–7',
      cbseTitle: 'Foundational Grammar & Composition 2',
      cisceTitle: 'ICSE Preparatory English Language 2',
      cambridgeTitle: 'Cambridge Primary English Stage 2',
      status: 'Planned (Phase 5)',
      band: 'Foundational',
    },
    {
      level: 'Class / Grade 3',
      stageCode: 'C3',
      age: 'Ages 7–8',
      cbseTitle: 'Primary Grammar in Action — Book 3',
      cisceTitle: 'ICSE Junior English Language — Book 3',
      cambridgeTitle: 'Cambridge Primary English Stage 3',
      status: 'In Planning',
      band: 'Primary',
    },
    {
      level: 'Class / Grade 4',
      stageCode: 'C4',
      age: 'Ages 8–9',
      cbseTitle: 'Primary Grammar in Action — Book 4',
      cisceTitle: 'ICSE Junior English Language — Book 4',
      cambridgeTitle: 'Cambridge Primary English Stage 4',
      status: 'In Planning',
      band: 'Primary',
    },
    {
      level: 'Class / Grade 5',
      stageCode: 'C5',
      age: 'Ages 9–10',
      cbseTitle: 'Primary Grammar in Action — Book 5',
      cisceTitle: 'ICSE Junior English Language — Book 5',
      cambridgeTitle: 'Cambridge Primary English Stage 5',
      status: 'In Planning',
      band: 'Primary',
    },
    {
      level: 'Class / Grade 6',
      stageCode: 'C6',
      age: 'Ages 11–12',
      cbseTitle: 'Middle School Grammar & Syntax — Class 6',
      cisceTitle: 'Middle School English Language & Composition — Class 6',
      cambridgeTitle: 'Cambridge Lower Secondary English — Stage 7',
      status: 'Active in Authoring',
      activeProjectId: 'bp-cbse-c6',
      band: 'Middle School',
    },
    {
      level: 'Class / Grade 7',
      stageCode: 'C7',
      age: 'Ages 12–13',
      cbseTitle: 'Middle School Grammar & Syntax — Class 7',
      cisceTitle: 'Middle School English Language & Composition — Class 7',
      cambridgeTitle: 'Cambridge Lower Secondary English — Stage 8',
      status: 'In Planning',
      band: 'Middle School',
    },
    {
      level: 'Class / Grade 8',
      stageCode: 'C8',
      age: 'Ages 13–14',
      cbseTitle: 'Middle School Grammar & Syntax — Class 8',
      cisceTitle: 'Middle School English Language & Composition — Class 8',
      cambridgeTitle: 'Cambridge Lower Secondary English — Stage 9',
      status: 'In Planning',
      band: 'Middle School',
    },
    {
      level: 'Class / Grade 9',
      stageCode: 'C9',
      age: 'Ages 14–15',
      cbseTitle: 'Secondary English Grammar & Applied Writing — Class 9',
      cisceTitle: 'ICSE Certificate English Language Paper 1 — Class 9',
      cambridgeTitle: 'Cambridge IGCSE First Language English — Stage 10',
      status: 'In Planning',
      band: 'Secondary',
    },
    {
      level: 'Class / Grade 10',
      stageCode: 'C10',
      age: 'Ages 15–16',
      cbseTitle: 'Secondary English Grammar & Applied Writing — Class 10',
      cisceTitle: 'ICSE Certificate English Language Paper 1 — Class 10',
      cambridgeTitle: 'Cambridge IGCSE First Language English — Stage 11',
      status: 'In Planning',
      band: 'Secondary',
    },
    {
      level: 'Class / Grade 11',
      stageCode: 'C11',
      age: 'Ages 16–17',
      cbseTitle: 'Senior Secondary Advanced English — Class 11',
      cisceTitle: 'ISC English Language Paper 1 — Class 11',
      cambridgeTitle: 'Cambridge International AS Level English',
      status: 'Planned',
      band: 'Senior Secondary',
    },
    {
      level: 'Class / Grade 12',
      stageCode: 'C12',
      age: 'Ages 17–18',
      cbseTitle: 'Senior Secondary Advanced English — Class 12',
      cisceTitle: 'ISC English Language Paper 1 — Class 12',
      cambridgeTitle: 'Cambridge International A Level English',
      status: 'Planned',
      band: 'Senior Secondary',
    },
  ];

  const handleCreateNewProject = (newProj: BookProject) => {
    const updatedMap = {
      ...bookProjectsMap,
      [newProj.id]: newProj,
    };
    onUpdateSeriesProject({
      ...seriesProject,
      bookProjects: updatedMap,
      activeBookProjectId: newProj.id,
      selectedClass: newProj.classLevel,
      lastUpdated: new Date().toISOString(),
    });
    setShowNewProjectModal(false);
  };

  return (
    <div
      id="series-studio-root"
      className="w-full min-h-full flex-1 bg-[#EDE4D6] dark:bg-[#1e0f18] text-[#292521] dark:text-[#F6F0E7]"
    >
      <div id="series-studio-container" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
        {/* Breadcrumb Hierarchy */}
        <PublishingBreadcrumbs
          items={[
            {
              label: 'Academic Publishing',
              icon: Globe2,
            },
            {
              label: seriesProject.seriesTitle || 'Grammar in Action: Complete K-12 English Series',
            },
            {
              label: 'Series Studio',
              icon: Layers,
              isCurrent: true,
            },
          ]}
        />

        {/* 1. Header Section: Series Command Centre */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#CBBEAC] dark:border-[#4f2c3d] pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#9A7438] dark:text-[#C29A52] mb-1">
              <Globe2 className="w-4 h-4 text-[#5A1832] dark:text-[#C29A52]" />
              <span>Series-Level Command Centre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif font-bold tracking-tight text-[#35101F] dark:text-[#F6F0E7]">
              Series Studio
            </h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#71685E] dark:text-[#c9b9a6] max-w-3xl">
              Command centre governing the complete K–12 multi-board English publishing series across
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> CBSE</span>,
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> CISCE (ICSE / ISC)</span>, and
              <span className="font-semibold text-[#5A1832] dark:text-[#C29A52]"> Cambridge International</span>.
            </p>
          </div>

          {/* Global Series Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-nav-to-book-projects"
              onClick={onOpenBookProjects}
              className="flex items-center space-x-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#9A7438] bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[13.5px] font-bold transition-colors shadow-xs"
              title="Open Book Projects Library"
            >
              <BookOpen className="w-4 h-4 text-[#C29A52]" />
              <span>Book Projects ({totalBooks})</span>
            </button>

            <button
              id="btn-series-new-book"
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center space-x-2 min-h-[44px] px-3.5 py-2 rounded-xl bg-[#EDE4D6] dark:bg-[#2b1622] hover:bg-[#FDFBF7] text-[#292521] dark:text-[#F6F0E7] border border-[#CBBEAC] dark:border-[#4f2c3d] text-[13.5px] font-semibold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 text-[#9A7438] dark:text-[#C29A52]" />
              <span>+ New Book</span>
            </button>
          </div>
        </div>

        {/* 2. Series Level Analytics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Total Planned Books</div>
            <div className="text-2xl font-bold font-mono text-[#35101F] dark:text-[#F6F0E7] mt-1">{totalBooks}</div>
            <div className="text-[11px] text-[#9A7438] dark:text-[#C29A52] mt-0.5">Across 3 Boards</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Books in Planning</div>
            <div className="text-2xl font-bold font-mono text-blue-700 dark:text-blue-400 mt-1">{inPlanning}</div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">TOC &amp; Scope Defined</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Books in Authoring</div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{inAuthoring}</div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Class 6 &amp; Stage 7 Active</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Academic Review</div>
            <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-400 mt-1">{inReview}</div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Peer Audit &amp; Concord</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Layout Ready</div>
            <div className="text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-400 mt-1">{layoutReady}</div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">Preflight &amp; Spec Aligned</div>
          </div>

          <div className="p-4 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] shadow-2xs">
            <div className="text-[12px] font-medium text-[#71685E] dark:text-[#c9b9a6]">Series Health</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Optimal (Spiral)</span>
            </div>
            <div className="text-[11px] text-[#71685E] dark:text-[#c9b9a6] mt-0.5">No Concept Gaps</div>
          </div>
        </div>

        {/* 3. Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xs">
          {[
            { id: 'overview', label: 'Series Identity & Overview', icon: Globe2 },
            { id: 'systems', label: 'Education Systems Portfolio', icon: Compass },
            { id: 'library_range', label: 'Series Range & K–12 Roadmap', icon: BookMarked },
            { id: 'progression', label: 'Series Progression (K–12)', icon: GitBranch },
            { id: 'audit', label: 'Cross-Edition Audit', icon: ShieldCheck },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as SeriesStudioSection)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#5A1832] text-[#F6F0E7] shadow-xs font-bold'
                    : 'text-[#71685E] dark:text-[#c9b9a6] hover:text-[#292521] hover:bg-[#EDE4D6] dark:hover:bg-[#35101F]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C29A52]' : ''}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. CONTENT SECTIONS */}

        {/* SECTION A: SERIES IDENTITY & OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Series Identity Dossier */}
            <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#CBBEAC]/60 dark:border-[#4f2c3d] pb-3">
                <div className="flex items-center space-x-2.5">
                  <Bookmark className="w-5 h-5 text-[#9A7438] dark:text-[#C29A52]" />
                  <h2 className="text-lg font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                    Series Identity &amp; Editorial Specifications
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Active Multi-Volume Production Cycle
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
                  <div className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Series Title</div>
                  <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                    Grammar in Action: Complete K-12 English Series
                  </div>
                  <div className="text-[10px] text-[#9A7438] dark:text-[#C29A52] mt-1">Universal Graded Series</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
                  <div className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Publisher / Imprint</div>
                  <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                    VERITAS Academic Press / Scholastic
                  </div>
                  <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">Imprint: Academic Curriculum</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
                  <div className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Author / Senior Editor</div>
                  <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                    Dr. Julian Mercer &amp; Academic Panel
                  </div>
                  <div className="text-[10px] text-[#71685E] dark:text-[#c9b9a6] mt-1">Pedagogical Review Board</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EDE4D6] dark:bg-[#35101F] border border-[#CBBEAC]/50 dark:border-[#4f2c3d]">
                  <div className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Edition Cycle &amp; Year</div>
                  <div className="font-serif font-bold text-sm text-[#35101F] dark:text-[#F6F0E7] mt-0.5">
                    3rd Master Edition (2026–2027)
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Syllabus Current</div>
                </div>
              </div>

              {/* Extended Description */}
              <div className="p-4 rounded-xl bg-[#EDE4D6]/70 dark:bg-[#35101F]/60 border border-[#CBBEAC]/50 dark:border-[#4f2c3d] space-y-2 text-xs leading-relaxed">
                <div className="font-serif font-bold text-xs uppercase tracking-wider text-[#5A1832] dark:text-[#C29A52]">
                  Series Editorial Philosophy &amp; Scope
                </div>
                <p className="text-[#292521] dark:text-[#F6F0E7]">
                  <strong className="text-[#5A1832] dark:text-[#C29A52]">Grammar in Action: Complete K-12 English Series</strong> is a research-informed, multi-tier instructional grammar and writing curriculum designed to provide seamless spiral progression from kindergarten and early primary foundations through senior secondary graduation.
                </p>
                <p className="text-[#71685E] dark:text-[#c9b9a6]">
                  The series maintains strict board-specific integrity across <strong>CBSE</strong> (NCERT Learning Outcomes), <strong>CISCE</strong> (ICSE Paper 1 syllabus and grammar conventions), and <strong>Cambridge International</strong> (Cambridge Primary, Lower Secondary, and IGCSE First/Second Language strands), avoiding generic one-size-fits-all conflation.
                </p>
              </div>

              {/* Fast-Track Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  Looking for individual textbook volumes? Use <strong className="text-[#35101F] dark:text-[#F6F0E7]">Book Projects</strong> to manage manuscripts, chapters, and prepress.
                </div>
                <button
                  onClick={onOpenBookProjects}
                  className="px-4 py-2 rounded-xl bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-xs font-semibold flex items-center space-x-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#C29A52]" />
                  <span>Go to Book Projects Library →</span>
                </button>
              </div>
            </div>

            {/* Quick Education Systems Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* CBSE */}
              <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#5A1832] text-[#F6F0E7]">
                    CBSE
                  </span>
                  <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Classes K–12</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Central Board (CBSE / NCERT)
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-2">
                  Aligned with NCERT Learning Outcomes, NEP 2020 competency framework, integrated grammar editing, and cloze tests.
                </p>
                <div className="text-[11px] font-medium text-[#5A1832] dark:text-[#C29A52]">
                  {cbseBooks.length} Active Volumes Registered
                </div>
                <button
                  onClick={() => {
                    setActiveSection('library_range');
                    setSelectedSystemFilter('CBSE');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#35101F] text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#FDFBF7] transition-colors"
                >
                  View CBSE Range
                </button>
              </div>

              {/* CISCE */}
              <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-[#35101F] text-[#E6C994]">
                    CISCE / ICSE
                  </span>
                  <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">ICSE 1–10 &amp; ISC 11–12</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Council for Indian School Certificate
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-2">
                  Rigorous formal grammar, sentence transformation, phrasal verbs, synthesis, and ICSE English Language Paper 1 precision.
                </p>
                <div className="text-[11px] font-medium text-[#5A1832] dark:text-[#C29A52]">
                  {cisceBooks.length} Active Volumes Registered
                </div>
                <button
                  onClick={() => {
                    setActiveSection('library_range');
                    setSelectedSystemFilter('CISCE');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#35101F] text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#FDFBF7] transition-colors"
                >
                  View CISCE Range
                </button>
              </div>

              {/* Cambridge */}
              <div className="p-5 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-slate-800 text-sky-200">
                    Cambridge CAIE
                  </span>
                  <span className="text-[11px] text-[#71685E] dark:text-[#c9b9a6]">Stages 1–11 &amp; A-Level</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#35101F] dark:text-[#F6F0E7]">
                  Cambridge International
                </h3>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] line-clamp-2">
                  Uses &quot;Stages&quot; instead of &quot;Classes&quot;. Aligned with CAIE Primary, Lower Secondary (Stages 7–9), and IGCSE First/Second Language strands.
                </p>
                <div className="text-[11px] font-medium text-[#5A1832] dark:text-[#C29A52]">
                  {cambridgeBooks.length} Active Volumes Registered
                </div>
                <button
                  onClick={() => {
                    setActiveSection('library_range');
                    setSelectedSystemFilter('Cambridge');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#EDE4D6] dark:bg-[#35101F] text-xs font-semibold text-[#35101F] dark:text-[#F6F0E7] hover:bg-[#FDFBF7] transition-colors"
                >
                  View Cambridge Range
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION B: EDUCATION SYSTEMS PORTFOLIO */}
        {activeSection === 'systems' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Multi-Board Curriculum Architecture</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
                Education Systems: Independent Curricular Frameworks
              </h2>
              <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed max-w-3xl">
                VERITAS strictly separates national and international curricula. CBSE, CISCE, and Cambridge International have distinct awarding bodies, testing mechanisms, and grammatical terminology standards. They are never conflated into a single monolithic curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CBSE Dossier */}
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-[#5A1832] text-[#F6F0E7]">
                    CBSE
                  </span>
                  <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">New Delhi, India</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                    Central Board of Secondary Education
                  </h3>
                  <div className="text-xs text-[#9A7438] dark:text-[#C29A52] font-medium mt-0.5">
                    NCERT Curriculum Guidelines &amp; NEP 2020
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Progression Terminology:</strong> Classes K–12
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Exam Focus:</strong> Integrated grammar (gap-filling, editing, omission, sentence reordering)
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Key Pedagogical Emphasis:</strong> Functional grammar in communicative contexts, inductive discovery
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                    {cbseBooks.length} Registered Book(s)
                  </span>
                  <button
                    onClick={onOpenCurriculumMapping}
                    className="text-xs text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>Curriculum Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CISCE Dossier */}
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-[#35101F] text-[#E6C994]">
                    CISCE / ICSE
                  </span>
                  <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">New Delhi, India</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                    Council for the Indian School Certificate
                  </h3>
                  <div className="text-xs text-[#9A7438] dark:text-[#C29A52] font-medium mt-0.5">
                    ICSE (Grades 1–10) &amp; ISC (Grades 11–12)
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Progression Terminology:</strong> Classes 1–10 (ICSE) &amp; Classes 11–12 (ISC)
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Exam Focus:</strong> ICSE English Language Paper 1 (transformation of sentences, prepositions/phrasal verbs, verb forms, passage synthesis)
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Key Pedagogical Emphasis:</strong> Structural rigour, formal prescriptive syntax, nuanced idiom
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                    {cisceBooks.length} Registered Book(s)
                  </span>
                  <button
                    onClick={onOpenCurriculumMapping}
                    className="text-xs text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>Curriculum Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cambridge Dossier */}
              <div className="p-6 rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-[#F6F0E7] dark:bg-[#2b1622] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-slate-800 text-sky-200">
                    Cambridge CAIE
                  </span>
                  <span className="text-xs text-[#71685E] dark:text-[#c9b9a6]">Cambridge, UK</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#35101F] dark:text-[#F6F0E7]">
                    Cambridge Assessment International
                  </h3>
                  <div className="text-xs text-[#9A7438] dark:text-[#C29A52] font-medium mt-0.5">
                    Primary, Lower Secondary &amp; IGCSE
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#71685E] dark:text-[#c9b9a6]">
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Progression Terminology:</strong> Stages 1–6 (Primary), Stages 7–9 (Lower Secondary), Stages 10–11 (IGCSE)
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Exam Focus:</strong> Directed writing, writer&apos;s effect, summary skills, discourse markers
                  </div>
                  <div>
                    <strong className="text-[#35101F] dark:text-[#F6F0E7]">Key Pedagogical Emphasis:</strong> Applied stylistic awareness, rhetorical conventions, genre mastery
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBBEAC]/50 dark:border-[#4f2c3d] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5A1832] dark:text-[#C29A52]">
                    {cambridgeBooks.length} Registered Book(s)
                  </span>
                  <button
                    onClick={onOpenCurriculumMapping}
                    className="text-xs text-[#5A1832] dark:text-[#C29A52] font-semibold hover:underline flex items-center space-x-1"
                  >
                    <span>Curriculum Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: SERIES RANGE & K–12 ROADMAP */}
        {activeSection === 'library_range' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
                  <BookMarked className="w-4 h-4" />
                  <span>Series Range &amp; Multi-Tier Scope</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7] mt-1">
                  Complete K–12 Publishing Progression Range
                </h2>
                <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] mt-1 max-w-2xl">
                  Full scope from foundational Kindergarten through Class 12, explicitly accommodating early learning expansion and board-specific nomenclature.
                </p>
              </div>

              {/* Filter by System */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#71685E] dark:text-[#c9b9a6] font-medium">Filter View:</span>
                <select
                  value={selectedSystemFilter}
                  onChange={(e) => setSelectedSystemFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#CBBEAC] dark:border-[#4f2c3d] bg-white dark:bg-[#1e0f18] text-xs font-semibold"
                >
                  <option value="ALL">All Curricula Combined</option>
                  <option value="CBSE">CBSE View (K–12)</option>
                  <option value="CISCE">CISCE / ICSE View (1–12)</option>
                  <option value="Cambridge">Cambridge CAIE View (Stages 1–11)</option>
                </select>
              </div>
            </div>

            {/* Roadmap Ledger */}
            <div className="bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EDE4D6] dark:bg-[#35101F] text-[#35101F] dark:text-[#F6F0E7] font-serif font-bold border-b border-[#CBBEAC] dark:border-[#4f2c3d]">
                    <th className="p-3.5">Level / Stage</th>
                    <th className="p-3.5">Age Bracket</th>
                    <th className="p-3.5">CBSE Title / Status</th>
                    <th className="p-3.5">CISCE Title / Status</th>
                    <th className="p-3.5">Cambridge Stage / Title</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBBEAC]/40 dark:divide-[#4f2c3d]">
                  {fullSeriesRoadmap.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-[#EDE4D6]/50 dark:hover:bg-[#35101F]/30 transition-colors ${
                        item.stageCode === 'C6' ? 'bg-[#EDE4D6]/80 dark:bg-[#35101F]/60' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="font-serif font-bold text-xs text-[#35101F] dark:text-[#F6F0E7]">
                          {item.level}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 font-mono">
                          {item.band}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[#71685E] dark:text-[#c9b9a6]">
                        {item.age}
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-[#292521] dark:text-[#F6F0E7]">
                          {item.cbseTitle}
                        </div>
                        {item.stageCode === 'C6' ? (
                          <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400">
                            ● In Authoring (Active Studio)
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                            {item.status}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-[#292521] dark:text-[#F6F0E7]">
                          {item.cisceTitle}
                        </div>
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-medium text-[#292521] dark:text-[#F6F0E7]">
                          {item.cambridgeTitle}
                        </div>
                        <span className="text-[10px] text-[#71685E] dark:text-[#c9b9a6]">
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        {item.activeProjectId ? (
                          <button
                            onClick={() => onOpenBookPlanner(item.activeProjectId!)}
                            className="px-2.5 py-1 rounded bg-[#5A1832] hover:bg-[#35101F] text-[#F6F0E7] text-[11px] font-semibold"
                          >
                            Open Book
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowNewProjectModal(true)}
                            className="px-2.5 py-1 rounded border border-[#CBBEAC] dark:border-[#4f2c3d] text-[11px] font-medium hover:bg-[#EDE4D6]"
                          >
                            + Initialize
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION D: SERIES PROGRESSION (K–12) */}
        {activeSection === 'progression' && (
          <div className="space-y-6">
            <SeriesProgressionAuditView
              seriesProject={seriesProject}
              onNavigateToCurriculumMapping={onOpenCurriculumMapping}
            />
          </div>
        )}

        {/* SECTION E: CROSS-EDITION AUDIT */}
        {activeSection === 'audit' && (
          <div className="p-6 bg-[#F6F0E7] dark:bg-[#2b1622] rounded-2xl border border-[#CBBEAC] dark:border-[#4f2c3d] space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#5A1832] dark:text-[#C29A52] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Series-Level Cohesion &amp; Quality Audit</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#35101F] dark:text-[#F6F0E7]">
              Multi-Edition Consistency &amp; Redundancy Scanner
            </h2>
            <p className="text-xs text-[#71685E] dark:text-[#c9b9a6] leading-relaxed max-w-3xl">
              Analyzes cross-book progression to identify concept gaps, unintended duplications, and curriculum terminology mismatches between editions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Spiral Continuity Maintained</span>
                </div>
                <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-1">
                  Noun and Verb taxonomy correctly expands in developmental difficulty across primary and middle grades without premature difficulty spikes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Terminology Divergence Verified</span>
                </div>
                <p className="text-amber-800/80 dark:text-amber-300/80 mt-1">
                  ICSE books preserve formal &quot;Direct/Indirect Speech&quot; and &quot;Synthesis&quot;, whereas Cambridge uses &quot;Reported Speech&quot; and &quot;Complex Sentence Structures&quot;.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 text-xs">
                <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
                  <Info className="w-4 h-4" />
                  <span>K–2 Foundation Expansion</span>
                </div>
                <p className="text-blue-800/80 dark:text-blue-300/80 mt-1">
                  Ready for Kindergarten and Grade 1–2 curriculum authoring with age-appropriate tactile and phonemic grammar units.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <CreateNewBookProjectModal
          seriesTitle={seriesProject.seriesTitle || 'Grammar in Action: Complete K-12 English Series'}
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateNewProject}
        />
      )}
    </div>
  );
};
